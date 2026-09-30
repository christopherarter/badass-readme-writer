# Badass README Writer

Write a README that helps someone understand your project and get a first result. This Agent Skill can create one, improve an existing one, or review it and suggest fixes.

It checks the repository before making claims, puts a useful example or visual near the top, and makes the quickest supported path to trying the project clear. If something important cannot be verified, it says so.

## Install

Clone this repository and install the skill for Codex:

```sh
git clone https://github.com/christopherarter/badass-readme-writer.git
cd badass-readme-writer
python3 tools/install-skill.py --parent "$HOME/.agents/skills"
```

For Claude Code, use `--parent "$HOME/.claude/skills"` instead. To make the skill available only in one project, pass that project's `.agents/skills` or `.claude/skills` directory. The installer copies the skill files into a `badass-readme-writer/` folder under the directory you choose. Run it with `--replace` to update an existing installation.

The same folder follows the [Agent Skills specification](https://agentskills.io/specification) and can be placed in any other harness's documented skills directory. Only `SKILL.md`, `assets/`, and `references/` are installed; `evals/` remains a separate development bench. For a hosted agent, upload or mount that folder in the agent's environment.

## Use it

Open the project whose README you want to change and ask your agent:

```text
Use badass-readme-writer to rewrite README.md for someone new to this project. Check the claims and quick start against the repository, then edit the file.
```

In Codex, you can invoke it explicitly as `$badass-readme-writer`; in Claude Code, use `/badass-readme-writer`. Ask for a **review** if you want a verdict and prioritized fixes without an edit. If a new installation does not appear, restart the agent session.

## Contributing

If the skill misses a claim or produces a README that is hard to use, propose a change with the source evidence and resulting draft. The [benchmark guide](evals/HOWTO.md) explains how to compare changes against the bundled cases.

This repository does not currently include a license file.
