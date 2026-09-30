#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');

const HERE = __dirname;
const QUALITY_RUBRIC = path.join(HERE, '..', 'references', 'quality-rubric.md');
const AXES = ['accuracy', 'clarity', 'proof', 'first_success', 'hierarchy', 'trust_navigation', 'voice'];
const WEIGHTS = loadWeights();

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { fs.writeFileSync(file, content); }
function sha256(content) { return crypto.createHash('sha256').update(content).digest('hex'); }
function loadWeights() {
  const found = new Map();
  for (const line of read(QUALITY_RUBRIC).split('\n')) {
    const row = line.match(/^\| `([a-z_]+)` \| (\d+) \|/);
    if (row) found.set(row[1], Number(row[2]));
  }
  if (found.size !== AXES.length || AXES.some((axis) => !found.has(axis))) fail('Quality rubric dimensions do not match the scorer.');
  if ([...found.values()].reduce((sum, weight) => sum + weight, 0) !== 100) fail('Quality rubric weights must total 100.');
  return Object.fromEntries(AXES.map((axis) => [axis, found.get(axis)]));
}
function hashDirectory(root) {
  const hash = crypto.createHash('sha256');
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) {
        hash.update(path.relative(root, full));
        hash.update(fs.readFileSync(full));
      }
    }
  }
  visit(root);
  return hash.digest('hex');
}
function escapeHtml(value) { return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function fence(content) {
  const longest = Math.max(3, ...[...content.matchAll(/`+/g)].map((m) => m[0].length + 1));
  const marker = '`'.repeat(longest);
  return `${marker}markdown\n${content.trimEnd()}\n${marker}`;
}
function requireDependency(name) {
  try { return require(name); }
  catch { fail(`Missing ${name}. Run npm install in evals/ (or set NODE_PATH to the bundled packages directory).`); }
}
function fileWithin(root, relative) {
  const full = path.resolve(root, relative);
  if (!full.startsWith(`${root}${path.sep}`)) fail(`Source file escapes fixture: ${relative}`);
  return full;
}
function loadCase(id) {
  if (!/^[a-z0-9-]+$/.test(id)) fail('Case ID must use lowercase letters, digits, and hyphens.');
  const dir = path.join(HERE, 'cases', id);
  const spec = JSON.parse(read(path.join(dir, 'case.json')));
  if (spec.id !== id) fail('Case ID mismatch.');
  return { spec, repo: path.join(dir, 'repo') };
}

function seed(args) {
  if (args.length !== 2) fail('Usage: node evals/bench.cjs seed CASE_ID WORK_DIR');
  const [id, workDir] = args;
  const { spec, repo } = loadCase(id);
  const destination = path.resolve(workDir);
  if (fs.existsSync(destination)) fail(`Work directory already exists: ${destination}`);
  fs.cpSync(repo, destination, { recursive: true });
  console.log(`Created ${destination}\nTask: ${spec.task}`);
}

function htmlFor(markdown, root, label) {
  const { marked } = requireDependency('marked');
  const base = pathToFileURL(`${root}${path.sep}`).href;
  const css = read(path.join(HERE, 'github-like.css'));
  const rendered = marked.parse(markdown, { gfm: true, breaks: false });
  const folder = path.basename(root) === 'repo' ? path.basename(path.dirname(root)) : path.basename(root);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${escapeHtml(base)}"><title>${escapeHtml(label)} README preview</title><style>${css}</style></head><body><div class="repo-bar"><strong>${escapeHtml(folder)}</strong> / README.md</div><div class="file-bar">README.md</div><main class="markdown-body">${rendered}</main></body></html>`;
}

async function renderScreenshots(out, root, labels) {
  const { chromium } = requireDependency('playwright');
  const launch = process.env.PLAYWRIGHT_CHROME_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH, headless: true }
    : { channel: 'chrome', headless: true };
  const browser = await chromium.launch(launch);
  try {
    for (const label of ['A', 'B']) {
      const htmlFile = path.join(out, `${label}.html`);
      write(htmlFile, htmlFor(labels[label], root, label));
      const variants = [
        { suffix: 'desktop', width: 1280, height: 800, theme: 'light', fullPage: false },
        { suffix: 'full', width: 1280, height: 800, theme: 'light', fullPage: true },
        { suffix: 'mobile', width: 390, height: 844, theme: 'light', fullPage: false },
        { suffix: 'dark', width: 1280, height: 800, theme: 'dark', fullPage: false },
      ];
      for (const variant of variants) {
        const context = await browser.newContext({
          viewport: { width: variant.width, height: variant.height },
          colorScheme: variant.theme,
          deviceScaleFactor: 1,
          javaScriptEnabled: false,
        });
        await context.route(/^https?:\/\//, (route) => {
          if (process.env.README_BENCH_ALLOW_REMOTE_IMAGES === '1' && route.request().resourceType() === 'image') return route.continue();
          return route.abort();
        });
        try {
          const page = await context.newPage();
          await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
          await page.screenshot({ path: path.join(out, `${label}-${variant.suffix}.png`), fullPage: variant.fullPage, animations: 'disabled' });
        } finally { await context.close(); }
      }
    }
  } finally { await browser.close(); }
}

function makeComparison(out, mapping) {
  const before = mapping.A === 'baseline' ? 'A' : 'B';
  const after = before === 'A' ? 'B' : 'A';
  for (const suffix of ['desktop', 'full', 'mobile', 'dark']) {
    fs.copyFileSync(path.join(out, `${before}-${suffix}.png`), path.join(out, `before-${suffix}.png`));
    fs.copyFileSync(path.join(out, `${after}-${suffix}.png`), path.join(out, `after-${suffix}.png`));
  }
  write(path.join(out, 'before-after.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>README before and after</title><style>body{font:16px system-ui,sans-serif;margin:24px;background:#eef1f5;color:#202b3d}h1{margin-bottom:8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:22px 0}.card{background:white;padding:14px;border-radius:10px;min-width:0}.card img{display:block;width:100%;border:1px solid #cbd5e1}@media(max-width:720px){.pair{grid-template-columns:1fr}}</style><h1>README before and after</h1><p>Local approximation of GitHub Markdown. Compare hierarchy at the same viewport.</p>${['desktop','mobile','dark','full'].map((s) => `<h2>${s}</h2><div class="pair"><div class="card"><h3>Before</h3><img src="before-${s}.png" alt="Before ${s} screenshot"></div><div class="card"><h3>After</h3><img src="after-${s}.png" alt="After ${s} screenshot"></div></div>`).join('')}</html>`);
}

async function prepare(args) {
  if (args.length < 3) fail('Usage: node evals/bench.cjs prepare CASE_ID CANDIDATE_README OUTPUT_DIR [--seed TEXT] [--skip-render]');
  const [id, candidateFile, outputDir, ...flags] = args;
  const seedIndex = flags.indexOf('--seed');
  const seed = seedIndex >= 0 ? flags[seedIndex + 1] : 'readme-bench-v1';
  if (!seed) fail('--seed needs a value.');
  const skipRender = flags.includes('--skip-render');
  const { spec, repo } = loadCase(id);
  const out = path.resolve(outputDir);
  if (fs.existsSync(out)) fail(`Output directory already exists: ${out}`);
  const baseline = read(path.join(repo, 'README.md'));
  const candidate = read(path.resolve(candidateFile));
  const fixtureHash = sha256(`${read(path.join(HERE, 'cases', id, 'case.json'))}\n${hashDirectory(repo)}`);
  const rubricHash = sha256(read(QUALITY_RUBRIC) + read(path.join(HERE, 'judge-instructions.md')));
  const rendererHash = sha256(read(__filename) + read(path.join(HERE, 'github-like.css')) + read(path.join(HERE, 'package.json')));
  const hash = crypto.createHash('sha256').update(`${seed}:${id}`).digest()[0];
  const mapping = hash % 2 === 0 ? { A: 'baseline', B: 'candidate' } : { A: 'candidate', B: 'baseline' };
  const labels = {
    A: mapping.A === 'baseline' ? baseline : candidate,
    B: mapping.B === 'baseline' ? baseline : candidate,
  };
  fs.mkdirSync(out, { recursive: true });
  write(path.join(out, 'A.md'), labels.A);
  write(path.join(out, 'B.md'), labels.B);
  write(path.join(out, 'mapping.json'), JSON.stringify({ case_id: id, bench_version: 1, seed, mapping, fixture_sha256: fixtureHash, rubric_sha256: rubricHash, renderer_sha256: rendererHash, baseline_sha256: sha256(baseline), candidate_sha256: sha256(candidate) }, null, 2) + '\n');

  const evidence = spec.source_files.map((name) => {
    const content = read(fileWithin(repo, name));
    return `### ${name}\n\n${fence(content)}`;
  }).join('\n\n');
  const packet = `# Blind README evaluation: ${id}\n\n${read(path.join(HERE, 'judge-instructions.md'))}\n\n${read(QUALITY_RUBRIC)}\n\n## Case task\n\n${spec.task}\n\n## Verified facts\n\n${spec.facts.map((f) => `- ${f}`).join('\n')}\n\n## Repository evidence (README excluded)\n\n${evidence}\n\n## README A\n\n${fence(labels.A)}\n\n## README B\n\n${fence(labels.B)}\n\n## Visual attachments\n\nAttach A-desktop.png, B-desktop.png, A-mobile.png, B-mobile.png, A-dark.png, and B-dark.png when image input is available. The full-page captures are A-full.png and B-full.png. The screenshots use a local GitHub-like renderer; use the Markdown text for factual checks. Do not attach mapping.json or before-after.html to the judge.\n`;
  write(path.join(out, 'judge-packet.md'), packet);

  if (!skipRender) {
    await renderScreenshots(out, repo, labels);
    makeComparison(out, mapping);
  }
  console.log(`Prepared ${id} in ${out}${skipRender ? ' (screenshots skipped)' : ''}`);
}

async function render(args) {
  if (args.length !== 4) fail('Usage: node evals/bench.cjs render BEFORE_README AFTER_README PROJECT_ROOT OUTPUT_DIR');
  const [beforeFile, afterFile, rootDir, outputDir] = args;
  const root = path.resolve(rootDir);
  const out = path.resolve(outputDir);
  if (!fs.statSync(root).isDirectory()) fail(`Project root is not a directory: ${root}`);
  if (fs.existsSync(out)) fail(`Output directory already exists: ${out}`);
  const labels = { A: read(path.resolve(beforeFile)), B: read(path.resolve(afterFile)) };
  fs.mkdirSync(out, { recursive: true });
  await renderScreenshots(out, root, labels);
  makeComparison(out, { A: 'baseline', B: 'candidate' });
  console.log(`Before/after screenshots: ${path.join(out, 'before-after.html')}`);
}

function scoreOne(result) {
  const totals = {};
  for (const label of ['A', 'B']) {
    const item = result[label];
    if (!item || !item.scores || !Array.isArray(item.critical_errors)) fail(`Missing scores or critical_errors for ${label}.`);
    let raw = 0;
    for (const [axis, weight] of Object.entries(WEIGHTS)) {
      const value = item.scores[axis];
      if (!value || !Number.isInteger(value.score) || value.score < 0 || value.score > 4 || !value.evidence?.trim() || !value.reason?.trim()) fail(`Invalid ${label}.${axis}.`);
      raw += weight * value.score / 4;
    }
    for (const error of item.critical_errors) {
      if (!error.claim?.trim() || !error.contradiction?.trim()) fail(`Critical error for ${label} needs claim and contradiction.`);
    }
    const gate = item.critical_errors.length > 0 || item.scores.accuracy.score === 0;
    totals[label] = { raw, final: gate ? Math.min(raw, 49) : raw, critical: gate };
  }
  return totals;
}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2;
}
function score(args) {
  if (args.length < 2) fail('Usage: node evals/bench.cjs score RUN_DIR JUDGE_RESULT.json [MORE_RESULTS.json...]');
  const [runDir, ...files] = args;
  const out = path.resolve(runDir);
  const manifest = JSON.parse(read(path.join(out, 'mapping.json')));
  const mapping = manifest.mapping;
  const beforeLabel = mapping.A === 'baseline' ? 'A' : 'B';
  const afterLabel = beforeLabel === 'A' ? 'B' : 'A';
  const rows = files.map((file) => {
    const totals = scoreOne(JSON.parse(read(path.resolve(file))));
    return { file: path.basename(file), before: totals[beforeLabel], after: totals[afterLabel], delta: totals[afterLabel].final - totals[beforeLabel].final };
  });
  const fmt = (n) => Number(n.toFixed(1));
  const summary = {
    case_id: manifest.case_id,
    bench_version: manifest.bench_version,
    fixture_sha256: manifest.fixture_sha256,
    rubric_sha256: manifest.rubric_sha256,
    renderer_sha256: manifest.renderer_sha256,
    judgments: rows.length,
    median_before: fmt(median(rows.map((r) => r.before.final))),
    median_after: fmt(median(rows.map((r) => r.after.final))),
    median_delta: fmt(median(rows.map((r) => r.delta))),
    candidate_critical_in_any_judgment: rows.some((r) => r.after.critical),
    results: rows.map((r) => ({ file: r.file, before: fmt(r.before.final), after: fmt(r.after.final), delta: fmt(r.delta), candidate_critical: r.after.critical })),
  };
  write(path.join(out, 'score-summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}

(async () => {
  const [, , command, ...args] = process.argv;
  if (command === 'seed') seed(args);
  else if (command === 'render') await render(args);
  else if (command === 'prepare') await prepare(args);
  else if (command === 'score') score(args);
  else fail('Commands: seed, render, prepare, score');
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
