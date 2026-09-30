---
name: badass-readme-writer
description: Write, review, or substantially improve a README for an open-source software project or package. Use for a new README, a quality critique, a rewrite, or a first-impression and onboarding refresh; keep detailed reference documentation in its own place.
---

# README as a front door

A repository README earns the next 30 seconds. Help a new developer understand the project, see credible proof, try one useful path, and find the right next link. It is an introduction and a map, not the entire manual.

Use this skill for a README from scratch, a review, or a substantive rewrite. Respect an explicitly requested scope, audience, or style. Do not impose one outline on every project. The reusable [starter](assets/README-starter.md) is a set of possible moves, not a form to fill in. For short before/after patterns, see [transformations](references/transformations.md).

## 1. Learn the project before writing

When a repository is available, inspect it. Start with the existing README and nearby contributor-facing files, then follow the evidence relevant to the project's main use case: manifests, package metadata, source entry points, examples, tests, CLI help, container files, screenshots or demo assets, docs, releases, `CONTRIBUTING`, `LICENSE`, and issue/discussion links. Distinguish a user install from a contributor development setup. In a monorepo, identify whether the target README introduces the whole project or a particular package, and tailor its first action accordingly.

Build a compact working picture of:

- the software, intended reader, principal job, pain point, and real differentiator;
- the shortest credible path to a useful result, with prerequisites and observable output;
- whether a UI image, terminal capture, code example, hosted demo, or simple architecture diagram is the best proof;
- current maturity, material limitations, docs, support/community, contribution path, and license.

Use repository evidence over assumptions or memory. Ask only for missing facts that materially change the README and cannot be inferred. If they stay unknown, omit optional claims or mark a critical gap with an obvious, specific placeholder and flag it in the handoff. Never invent commands, output, features, compatibility, performance, testimonials, maturity, license, or links. Recheck claims copied from an old README against current source and docs.

## 2. Choose the reader's first journey

Answer these questions in roughly this order, merging or omitting sections when that improves flow:

1. What is it, and who is it for?
2. Why is it useful or different?
3. What does it look like or do in practice?
4. How can I get one useful result now?
5. How does it work, if that matters to adoption?
6. What signals make it trustworthy, including candid limits?
7. Where are the deeper docs?
8. How can I ask, report, or contribute?

Make the top of the page carry **name → clear value → proof → route to trying it**. A logo may support the name, but cannot replace a plain-language one-line explanation. Put a few useful links nearby. Keep badges secondary and restrained; a badge row must not delay the explanation. If the project name is opaque, explain it only if that helps comprehension or voice.

Select proof for the product. For a UI app, put a current, readable screenshot, concise GIF, or linked demo early, with alt text and a caption that says what the reader is seeing. For a library or framework, a tiny real example and its result often beats an image. For a CLI, show a command and recognizable output. For infrastructure, show a small system sketch or concrete integration. If a missing visual would materially improve a UI README, recommend the exact asset to create; do not substitute generic prose or fabricate a screenshot.

## 3. Write for first success

Lead with one recommended route, not a package-manager or deployment matrix. Show only the prerequisites needed for that route, the actual install/run or import steps, and what success looks like. Prefer a code block that a reader can copy without guessing paths, tokens, or an unstated setup step. If trying the product requires credentials, a hosted account, Docker, a supported OS, or a paid service, say so at the point of use. Link to advanced and alternate setups. Do not collapse meaningful security, data-loss, or production caveats into a remote link.

Describe a handful of important capabilities as outcomes, with concrete objects and verbs. Put exhaustive flags, API tables, environment variables, compatibility matrices, and deployment variants in docs unless the README's audience genuinely needs a compact comparison. Explain architecture only to the depth needed for a mental model or adoption decision; a diagram should show the few important components and data flow, not every implementation class.

Keep project status honest. State experimental or alpha status and material missing pieces clearly when relevant. A mature project may instead show trust through a working example, maintained docs, license, releases, and an accessible issue path. Invite contributions at more than one level when supported: bugs, ideas, docs, code, integrations. Give a clear first step and link to contribution guidance; do not imply newcomers must understand the whole codebase.

## 4. Adapt to the project

| Project | Best early proof | First successful action | Common trap |
| --- | --- | --- | --- |
| CLI | short terminal exchange | one install and one useful command | full command reference before a result |
| Library or SDK | minimal import and visible result | install plus tiny working example | listing classes before use cases |
| Web app | product screenshot or live demo | try demo or one supported local path | buried UI, giant setup matrix |
| Developer infrastructure | problem and small mental model | concrete integration or minimal config | internal topology before the benefit |
| Framework | philosophy expressed through a tiny example | create and run something | abstract claims without an example |
| Early experimental OSS | real current behavior | narrow reproducible example | polish that implies unsupported maturity |

These are priorities, not separate fixed templates. If the project's architecture *is* its primary value, move that explanation earlier. If running it is impractical, an honest demo or worked example may be the fastest trial.

## 5. Edit with a point of view

Write like an engineer introducing useful work to another engineer: concrete, active, technically precise, and human. Use short paragraphs, meaningful headings, whitespace, and code blocks short enough to scan. Personality should come from the project, not emojis or slogans. Avoid empty claims such as “revolutionary,” “next-generation,” “seamless,” “robust,” or “powerful” without a specific reason.

On a rewrite, diagnose and fix the information hierarchy before polishing sentences. Check for: badge wall; vague headline; no problem or audience; implementation before value; unbounded feature list; installation before proof; hidden, stale, or context-free screenshots; unverified commands; duplicated docs; oversized architecture; missing quick start, maturity, contribution path, or next action; unexplained jargon; dense prose; giant centered HTML; too many calls to action. Explain the few consequential issues, not a scorecard.

## 6. Verify the handoff

Before finishing, read the README as a newcomer and apply the shared [quality rubric](references/quality-rubric.md). Check the actual repository evidence, then mark each dimension internally as sound, needs work, or unknown. Fix material factual or first-success problems before presentation details. For an ordinary writing task, use the rubric to revise the draft; do not present a numeric self-score unless requested.

Check local links and assets against the tree. Run the documented quick path when feasible and safe; otherwise trace commands to maintained scripts/docs and state that execution was unverified. Check version-sensitive or external claims against current authoritative sources when needed. Never claim a screenshot is current without checking it against the current UI or maintainers' current assets. Do not execute opaque remote install scripts simply to validate a README.

When creating: deliver a ready-to-use `README.md`, with any unresolved factual placeholders called out briefly. When improving: briefly identify the largest reader-experience problems, state the new information hierarchy, produce the revised `README.md`, and mention only visual assets that would materially improve it. For a review-only question such as “Is this any good?”, give a clear verdict, cite what works, and name the few highest-impact fixes with evidence; do not rewrite unless asked. If editing files was requested, make the edit; summarize what changed and what was verified. Do not expose a large scoring rubric unless asked.
