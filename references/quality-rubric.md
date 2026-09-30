# README quality rubric

Use these criteria to answer “Is this any good?” and “Did I follow the skill?” for the **actual project and reader**. The repository is the source of truth. A screenshot or rendered preview helps assess hierarchy and legibility, but cannot verify a product claim. The best proof differs by project: terminal output for a CLI, a small working example for a library, a real screenshot for a UI app, or a simple mental model for infrastructure.

| Dimension | Weight | 0: fails | 2: mixed | 4: strong |
| --- | ---: | --- | --- | --- |
| `accuracy` | 25 | Material false claim, broken core command, or wrong license | Mostly correct, but key claims or steps are unverified or ambiguous | Specific claims and primary path match evidence; limits are honest |
| `clarity` | 20 | Newcomer cannot tell what it does or for whom | Category is clear; benefit or audience is vague | Name, job, audience, and main benefit are clear in the opening |
| `proof` | 15 | No relevant visual, output, demo, or example | Proof exists but is late, context-free, or weak | Early proof shows useful behavior in the right medium |
| `first_success` | 15 | No viable first action | An action exists, but choices or missing steps slow it | One supported path gets a reader to an observable result quickly |
| `hierarchy` | 10 | Opening is dominated by metadata, setup matrix, or dense reference | Some scan path, but important content is buried or crowded | First screen flows from value to proof to action; details come later |
| `trust_navigation` | 10 | Material caveat hidden; no clear deeper docs or participation path | Some trust and navigation cues, but an important route is missing | Status or limits, docs, support, contribution, and license are handled as relevant |
| `voice` | 5 | Generic hype, jargon, or gimmicks obscure meaning | Competent but flat or uneven | Precise, concise, human, and distinct to the project |

A 1 has one useful element but falls short; a 3 is strong with a specific fix remaining. Do not award or withhold points for a prescribed section order, a screenshot on a nonvisual project, or a code block where a demo is the better proof. Treat missing evidence as unknown, not as permission to infer a feature.

## Agent self-review

For each dimension, note **sound / needs work / unknown** and one piece of README or repository evidence. Then answer:

1. What could a new developer explain after ten seconds, and what remains unclear?
2. What is the earliest credible proof and first useful action? Does that action really work?
3. Which claim or missing caveat could mislead someone? Check it against source or maintained docs.
4. What are the two or three changes with the largest reader impact?

Fix critical facts and the first path before trimming badges or rewriting tone. If asked for a review, report a short verdict, concrete strengths, and prioritized fixes. If asked to write or improve the README, use these answers to revise it before delivery. A self-review is a diagnostic, not an independent benchmark: do not report a numeric self-score as evidence of quality unless the user explicitly requests one.

## Independent judge scoring

For a benchmark, score each dimension **0–4** and cite a README excerpt or visible location plus the relevant source for factual claims. Weighted score = `sum(weight × score / 4)`, out of 100. A **critical error** is an adoption-relevant claim or instruction contradicted by the evidence: a fabricated capability, unsupported primary command, wrong license, or omitted material limitation. Cite the exact claim and conflicting source. A critical error, or `accuracy = 0`, caps the total at 49/100. A weak sentence alone is not critical. The judge scores independently of the agent that wrote the README.
