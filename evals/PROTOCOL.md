# Stable README benchmark protocol

The [shared quality rubric](../references/quality-rubric.md) is the source for both agent self-review and independent judge scores. The benchmark adds blind comparison and repeatable visual captures; it does not change the README's content requirements.

1. Keep the fixture repository and task prompt unchanged across skill revisions. Run the skill on the same case as if it were a real user request. Save the resulting `README.md` outside the fixture.
2. Use `bench.cjs prepare` to render the fixture's original README and candidate at identical viewport sizes. The judge packet assigns randomized A/B labels; keep `mapping.json` private until scoring is complete.
3. Give the judge the packet and its named screenshots. Ask it to score A and B independently, citing exact README text and source evidence. Do not identify which version used the skill. Use the same judge model and settings for comparable runs. For consequential changes, run three independent judgments and compare the median delta.
4. Feed the judge's JSON to `bench.cjs score`. Inspect individual dimensions and critical errors as well as the total. A score increase is evidence of improvement, not proof that the README is ready to ship.

The screenshots are diagnostic: check the first 800 desktop pixels, full page, narrow mobile viewport, and dark theme. Look for late product proof, image cropping, dense link or badge rows, unreadable code, and oversized tables. Accuracy and a working first path carry more weight than appearance.

Keep a small, varied, versioned set: CLI, library, UI app, infrastructure, and an experimental project. Add a case only when it represents a distinct failure mode. Keep a held-out case for spot checks so the skill does not overfit the public fixtures. When changing a fixture or rubric, record that as a benchmark revision rather than comparing scores across the change as if they were identical.
