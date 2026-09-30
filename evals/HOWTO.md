# Run the README benchmark

The benchmark is a development tool for `badass-readme-writer`. The three versioned fixtures cover a CLI with false claims, a small experimental library, and a UI app with buried visual proof. Use the shared [quality rubric](../references/quality-rubric.md) for both agent self-review and judge criteria; [PROTOCOL.md](PROTOCOL.md) describes stable comparison rules.

## Set up the renderer

From `evals/`, run `npm install` to install the pinned `marked` and `playwright` packages. The renderer uses a locally installed Google Chrome by default. Set `PLAYWRIGHT_CHROME_PATH` to a Chrome executable if needed. It does not need a Playwright browser download.

On a Codex desktop host with bundled Node packages, you can instead set `NODE_PATH` to that bundle's `node_modules` directory and use its Node executable. The visual renderer uses a fixed GitHub-like stylesheet and viewport sizes. It is a consistent comparison, not a pixel-perfect GitHub capture.

## Run a fixed case

From the repository root:

```sh
node evals/bench.cjs seed incident-deck /tmp/incident-deck-work
```

Ask the README skill to rewrite `/tmp/incident-deck-work/README.md` for the printed task. The fixture under `evals/cases/` remains untouched. Then prepare the blind judging packet and screenshots:

```sh
node evals/bench.cjs prepare incident-deck /tmp/incident-deck-work/README.md evals/runs/incident-deck-v1
```

Open `evals/runs/incident-deck-v1/before-after.html` for a side-by-side view. Send `judge-packet.md` and the listed A/B screenshots to a judge model; keep `mapping.json` and `before-after.html` out of its context. Save its JSON response as a file, then calculate weighted scores:

```sh
node evals/bench.cjs score evals/runs/incident-deck-v1 /tmp/incident-deck-judge-1.json
```

You can pass three judge result files to `score`; it reports the median before score, after score, and delta. Use the same judge model and settings across runs. Preserve the fixture and rubric version when comparing skill revisions. Review any cited critical errors yourself before acting on the score.

If the browser cannot launch, `prepare` accepts `--skip-render`; the packet can still be judged from text, but visual scores have less evidence.

## Render any README change

For a real project, save the old and revised READMEs, then run:

```sh
node evals/bench.cjs render /path/to/before.md /path/to/after.md /path/to/project-root /path/to/output-dir
```

The output includes `before-after.html` and matching desktop first-screen, full-page, mobile, and dark-theme PNGs. Relative images resolve from `PROJECT_ROOT`. Remote images are blocked by default for repeatability; set `README_BENCH_ALLOW_REMOTE_IMAGES=1` if you explicitly want them loaded. Review remote-media READMEs on GitHub as well, since a local preview cannot guarantee GitHub's exact rendering.
