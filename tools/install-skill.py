#!/usr/bin/env python3
"""Install only the portable Agent Skills payload into a host's skills directory."""

import argparse
import re
import shutil
import sys
import tempfile
from pathlib import Path


SKILL_NAME = "badass-readme-writer"
SOURCE = Path(__file__).resolve().parent.parent
PAYLOAD = ("SKILL.md", "assets", "references")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--parent", type=Path, required=True, help="Parent skills directory")
    parser.add_argument(
        "--replace", action="store_true", help="Replace an existing installed skill folder"
    )
    args = parser.parse_args()

    parent = args.parent.expanduser().resolve()
    destination = parent / SKILL_NAME
    if destination.exists() or destination.is_symlink():
        if not args.replace:
            parser.error(f"{destination} already exists; use --replace to update it")
        if destination.is_symlink() or not destination.is_dir():
            parser.error(f"refusing to replace a symlink or non-directory: {destination}")
        installed_skill = destination / "SKILL.md"
        frontmatter = (
            installed_skill.read_text(encoding="utf-8").split("---", 2)
            if installed_skill.is_file()
            else []
        )
        if len(frontmatter) < 3 or not re.search(
            rf"(?m)^name:\s*{re.escape(SKILL_NAME)}\s*$", frontmatter[1]
        ):
            parser.error(f"refusing to replace a directory that is not this skill: {destination}")

    parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f".{SKILL_NAME}-", dir=parent) as temp:
        staged = Path(temp) / SKILL_NAME
        staged.mkdir()
        for name in PAYLOAD:
            source = SOURCE / name
            if source.is_dir():
                shutil.copytree(source, staged / name)
            else:
                shutil.copy2(source, staged / name)
        if destination.exists():
            backup = Path(temp) / "previous-install"
            destination.rename(backup)
            try:
                staged.rename(destination)
            except OSError:
                backup.rename(destination)
                raise
        else:
            staged.rename(destination)

    print(f"Installed {destination}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except OSError as error:
        print(f"Install failed: {error}", file=sys.stderr)
        sys.exit(1)
