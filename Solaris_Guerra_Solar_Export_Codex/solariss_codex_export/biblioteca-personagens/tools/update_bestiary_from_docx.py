#!/usr/bin/env python3
"""Replace the generated bestiary with the current official Book 3 DOCX."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from docx import Document

from generate_official_books_data import build_bestiary, slug


PREFIX = "globalThis.SOLARIS_OFFICIAL_BOOKS = "


def read_generated_payload(path: Path) -> dict:
    source = path.read_text(encoding="utf-8")
    start = source.index(PREFIX) + len(PREFIX)
    end = source.rfind(";")
    return json.loads(source[start:end])


def docx_blocks(path: Path) -> dict:
    document = Document(path)
    blocks = []
    for paragraph in document.paragraphs:
        text = re.sub(r"\s+", " ", paragraph.text or "").strip()
        blocks.append(
            {
                "type": "paragraph",
                "style": paragraph.style.name if paragraph.style else "Normal",
                "text": text,
            }
        )
    return {"source": path.name, "blocks": blocks}


def write_payload(path: Path, payload: dict) -> None:
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    path.write_text(
        "/* Gerado a partir das versões finais dos Livros 1, 2, 3 e 5. */\n"
        f"{PREFIX}{serialized};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--book3", type=Path, required=True)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--assets-dir", type=Path)
    args = parser.parse_args()

    payload = read_generated_payload(args.data)
    bestiary = build_bestiary(docx_blocks(args.book3))
    if args.assets_dir:
        for monster in bestiary:
            image_name = f"{slug(monster['name'])}.jpg"
            if (args.assets_dir / image_name).exists():
                monster["image"] = f"./assets/bestiary/{image_name}"
                monster["assets"] = [
                    {
                        "type": "image",
                        "label": f"Registro visual de {monster['name']}",
                        "url": monster["image"],
                    }
                ]
    payload["bestiary"] = bestiary
    payload.setdefault("sources", {})["book3"] = args.book3.name
    write_payload(args.data, payload)
    print(json.dumps({"output": str(args.data), "monsters": len(bestiary)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
