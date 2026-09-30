# README transformations

These are invented examples that illustrate editorial decisions. Do not copy their product facts, names, commands, or links into a real README.

## Name and value before badges

**Weak**: `# Rivet` followed by ten status badges and “The next-generation developer platform.”

**Better**: `# Rivet` followed by “Run background jobs from your TypeScript app without managing a worker fleet.” The example or demo appears next; a build badge can sit lower. The reader learns the job and audience before metadata.

## Outcome before internal vocabulary

**Weak**: “ProviderAdapterFactory, HookManager, and RequestMiddleware support extensible orchestration.”

**Better**: “Route each request to the right provider, inspect it before sending, and add your own policy checks.” If those component names matter, explain them in the architecture docs.

## One successful path before a matrix

**Weak**: The first section offers npm, pnpm, Yarn, Bun, Docker, Homebrew, and source builds, then lists every flag.

**Better**: Show the supported recommended install, one representative invocation, and its expected result. Link “Other installation methods” afterward. If the reader must choose a platform first, explain that single decision.

## Visual with a job, not decoration

**Weak**: A full-width screenshot appears halfway down, unlabeled, after a long feature list.

**Better**: Put a legible crop near the opening and caption what a newcomer should notice: “The run view shows each step, its input, and a retry button.” Verify the image reflects the current product.

## A mental model instead of a topology dump

**Weak**: A diagram names every queue, cache, service, database table, and protocol before the quick start.

**Better**: “Your app sends a job; the worker processes it; the dashboard shows its state.” Use a three-part diagram if it clarifies the flow, then link to the full architecture guide.

## Honest maturity and an approachable invitation

**Weak**: “Production ready” with no evidence, followed by “Contributions welcome!”

**Better**: “Experimental: the CLI supports local files today; remote storage is planned. Try the example, report a failing file in Issues, or start with a docs fix in the contribution guide.” Make only claims supported by the repository.
