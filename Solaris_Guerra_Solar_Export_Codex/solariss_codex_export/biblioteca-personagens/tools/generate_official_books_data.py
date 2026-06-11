#!/usr/bin/env python3
"""Generate browser-ready Solaris data from the extracted final rulebooks."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path


TEMPLATE_META = {
    212: ("equipment", "Equipamento geral"),
    213: ("weapon", "Arma"),
    214: ("armor", "Armadura"),
    215: ("mod", "Mod"),
    216: ("cube", "Cubo"),
    217: ("special-item", "Item especial"),
    218: ("crafting", "Projeto de crafting"),
    219: ("vehicle", "Veiculo"),
    220: ("pursuit", "Perseguicao"),
    221: ("drone", "Drone"),
    222: ("turret", "Torreta"),
    223: ("robot", "Robo"),
    224: ("hacking", "Hacking"),
    225: ("network", "Rede digital"),
    226: ("shop", "Loja"),
    227: ("black-market", "Mercado negro"),
}

BOOK5_RULES = [
    {
        "id": "regra-l5-tiers-equipamento",
        "name": "Tiers de equipamento",
        "source": "Livro 5, 1.2",
        "tags": ["Livro 5", "equipamento", "tier"],
        "summary": "Os Tiers F, E, D, C, B, A e S indicam qualidade, raridade, acesso e potencia. Tier alto exige contexto, manutencao e disponibilidade adequados.",
    },
    {
        "id": "regra-l5-slots-mod",
        "name": "Espacos de mod",
        "source": "Livro 5, 1.12-1.17",
        "tags": ["Livro 5", "mods", "slots"],
        "summary": "Armas, armaduras, corpos, robos e sistemas possuem espacos proprios. Um mod so funciona se for compativel, instalado e couber nos espacos livres.",
    },
    {
        "id": "regra-l5-rachaduras",
        "name": "Rachaduras e colapso de equipamento",
        "source": "Livro 5, 1.18-1.25",
        "tags": ["Livro 5", "rachaduras", "reparo"],
        "summary": "Rachaduras medem dano estrutural. Elas afetam armas, armaduras, focos e sistemas individualmente e exigem reparo, material, ferramenta e teste apropriados.",
    },
    {
        "id": "regra-l5-jammed",
        "name": "Jammed",
        "source": "Livro 5, 1.22",
        "tags": ["Livro 5", "Jammed", "tecnologia"],
        "summary": "Jammed representa travamento de arma, equipamento ou sistema. Engenharia, Tecnologia, manutencao ou uma acao especifica podem remover a condicao.",
    },
    {
        "id": "regra-l5-cubos",
        "name": "Cubos materializadores",
        "source": "Livro 5, 4.1-4.5",
        "tags": ["Livro 5", "cubos", "carga"],
        "summary": "Todo cubo padrao pesa 1 kg. Cubo simples guarda uma unidade; cubo de carga guarda ate 10 unidades do mesmo recurso; cubo especializado guarda ate 10 unidades da mesma categoria tecnica.",
    },
    {
        "id": "regra-l5-crafting",
        "name": "Crafting e forja",
        "source": "Livro 5, Capitulo 5",
        "tags": ["Livro 5", "crafting", "forja"],
        "summary": "Criar ou melhorar equipamento exige projeto, materiais, ferramentas, bancada, tempo, Luzentis e testes. Tier, qualidade e falhas alteram custo e resultado.",
    },
    {
        "id": "regra-l5-utilitarios",
        "name": "Utilitarios em cena",
        "source": "Livro 5, Capitulo 6",
        "tags": ["Livro 5", "utilitarios", "acao"],
        "summary": "Kits, granadas, drones e torretas usam acoes, bateria, controle, alcance e manutencao proprios. O local de armazenamento define o acesso durante a cena.",
    },
    {
        "id": "regra-l5-veiculos",
        "name": "Veiculos e perseguicoes",
        "source": "Livro 5, Capitulo 7",
        "tags": ["Livro 5", "veiculos", "perseguicao"],
        "summary": "Veiculos controlam PV, CA, velocidade, manobrabilidade, combustivel, carga, tripulacao, sistemas, rachaduras e falhas durante viagens e perseguicoes.",
    },
    {
        "id": "regra-l5-robos",
        "name": "Robos, drones e torretas",
        "source": "Livro 5, Capitulo 8",
        "tags": ["Livro 5", "robos", "drones"],
        "summary": "Maquinas usam chassi, nucleo, autonomia, processador, controle, slots, modulos, sensores, resistencias, vulnerabilidades e SR para hacking.",
    },
]

BOOK12_RULES = [
    {
        "id": "regra-final-rolagem",
        "name": "Resolucao central",
        "source": "Livro 1, 10; Livro 2, 18",
        "tags": ["Livro 1", "Livro 2", "3d6"],
        "summary": "Testes gerais usam 3d6 mais modificadores. Ataques contra CA usam 1d20. Triplo 6 e triplo 1 sao os extremos dos testes; 20 e 1 naturais sao os extremos dos ataques.",
    },
    {
        "id": "regra-final-atributos",
        "name": "Atributos iniciais",
        "source": "Livro 1, 4.6",
        "tags": ["Livro 1", "criacao", "atributos"],
        "summary": "Role 7d6, descarte o menor resultado e distribua os seis restantes. Cada atributo final e igual a 7 mais o dado escolhido.",
    },
    {
        "id": "regra-final-pericias",
        "name": "Pericias treinadas e ignorancias",
        "source": "Livro 1, 4.10; Livro 2, 18.6",
        "tags": ["Livro 1", "Livro 2", "pericias"],
        "summary": "Pericia treinada concede vantagem; ignorancia concede desvantagem; foco de profissao concede +1 fixo na area indicada.",
    },
    {
        "id": "regra-final-jp",
        "name": "Jogadas de Protecao",
        "source": "Livro 1, 4.17; Livro 2, 18.7",
        "tags": ["Livro 1", "Livro 2", "JPF", "JPR", "JPC"],
        "summary": "JPF usa FOR ou CON; JPR usa REF; JPC usa MEN contra energia e distorcao ou PRE contra medo, panico e pressao espiritual.",
    },
    {
        "id": "regra-final-estresse",
        "name": "Estresse e Colapso",
        "source": "Livro 1, Capitulo 11; Livro 2, 18.8",
        "tags": ["Livro 1", "Livro 2", "estresse"],
        "summary": "A trilha padrao vai de 0 a 6. De 0 a 5, testes usam 3d6; em 6, o personagem entra em Colapso e passa a usar 2d6 ate reduzir o Estresse.",
    },
    {
        "id": "regra-final-turno",
        "name": "Estrutura do turno",
        "source": "Livro 1, 16; Livro 2, 18.10",
        "tags": ["Livro 1", "Livro 2", "combate"],
        "summary": "Um turno padrao possui movimento, uma acao principal, uma acao simples e uma reacao por rodada quando uma regra permitir.",
    },
    {
        "id": "regra-final-iniciativa",
        "name": "Iniciativa",
        "source": "Livro 1, 4.16 e 16.4",
        "tags": ["Livro 1", "iniciativa", "1d20"],
        "summary": "Iniciativa e 1d20 + MOD REF. Empates usam maior MOD REF, depois maior MOD MEN e, por fim, nova rolagem.",
    },
    {
        "id": "regra-final-economia",
        "name": "Economia em Luzentis",
        "source": "Livro 1, 9.2; Livro 2, 18.21",
        "tags": ["Livro 1", "Livro 2", "Luzentis"],
        "summary": "Luzentis e a unica moeda oficial. Cada personagem comeca com 2.000 Luzentis; arma e armadura iniciais fazem parte do equipamento basico.",
    },
    {
        "id": "regra-final-carga",
        "name": "Carga e cubos iniciais",
        "source": "Livro 1, 4.18-4.19 e 9.3",
        "tags": ["Livro 1", "carga", "cubos"],
        "summary": "Carga maxima em kg e metade do peso corporal mais MOD FOR vezes 10. Cubos simples iniciais sao 5 + MOD FOR e nao anulam peso.",
    },
]


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    ascii_value = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")


def clean_field(value: str) -> str:
    value = re.sub(r"_+", "", value)
    return value.strip().rstrip(":").strip()


def parse_price(value: str) -> int:
    digits = re.sub(r"\D", "", value or "")
    return int(digits) if digits else 0


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def table_by_index(book: dict, index: int) -> dict:
    return next(table for table in book["tables"] if table["index"] == index)


def build_templates(book5: dict) -> list[dict]:
    templates = []
    for table_index, (template_id, label) in TEMPLATE_META.items():
        table = table_by_index(book5, table_index)
        fields = []
        seen = set()
        for row in table["rows"]:
            for cell in row:
                field_label = clean_field(cell)
                if not field_label or field_label.lower() in seen:
                    continue
                seen.add(field_label.lower())
                fields.append(
                    {
                        "id": slug(field_label),
                        "label": field_label,
                        "type": infer_field_type(field_label),
                        "wide": infer_wide_field(field_label),
                    }
                )
        templates.append(
            {
                "id": template_id,
                "label": label,
                "source": f"Livro 5, Tabela {table_index}",
                "schemaVersion": 1,
                "fields": fields,
            }
        )
    return templates


def infer_field_type(label: str) -> str:
    text = slug(label)
    if any(key in text for key in ("descricao", "observacoes", "histor", "consequencia", "resultado", "segredo", "gancho", "dados-obtidos")):
        return "textarea"
    if any(key in text for key in ("preco", "pv", "ca", "tier", "slots", "espacos", "rachaduras", "dificuldade", "quantidade", "capacidade")):
        return "text"
    if text.endswith("jammed") or text.startswith("pode-") or text.startswith("ocupa-cubo"):
        return "select-yes-no"
    return "text"


def infer_wide_field(label: str) -> bool:
    text = slug(label)
    return any(key in text for key in ("descricao", "observacoes", "histor", "consequencia", "resultado", "segredo", "gancho", "efeito", "funcao"))


def rows_as_dicts(table: dict) -> list[dict]:
    headers = [clean_field(value) for value in table["rows"][0]]
    return [
        {headers[index]: clean_field(value) for index, value in enumerate(row)}
        for row in table["rows"][1:]
        if any(clean_field(value) for value in row)
    ]


def build_weapons(book5: dict) -> list[dict]:
    entries = []
    for table_index, tier in zip(range(42, 48), ("F", "E", "D", "C", "B", "A")):
        for row in rows_as_dicts(table_by_index(book5, table_index)):
            name = row.get("Arma", "")
            if not name:
                continue
            properties = row.get("Propriedades", "")
            entries.append(
                {
                    "id": f"livro5-arma-{slug(name)}",
                    "category": "weapon",
                    "name": name,
                    "tier": tier,
                    "type": row.get("Tipo", ""),
                    "damage": row.get("Dano", ""),
                    "range": row.get("Alcance", ""),
                    "properties": properties,
                    "mods": parse_price(row.get("Slots", "")),
                    "price": parse_price(row.get("Preco", row.get("Preço", ""))),
                    "tags": [tag for tag in (tier, row.get("Tipo", ""), properties) if tag],
                    "summary": " | ".join(
                        part
                        for part in (
                            f"Alcance {row.get('Alcance', '')}" if row.get("Alcance") else "",
                            properties,
                        )
                        if part
                    ),
                    "source": f"Livro 5, Tabela {table_index}",
                    "schemaVersion": 1,
                }
            )
    return entries


def build_armors(book5: dict) -> list[dict]:
    entries = []
    for table_index, tier in zip(range(49, 55), ("F", "E", "D", "C", "B", "A")):
        for row in rows_as_dicts(table_by_index(book5, table_index)):
            name = row.get("Armadura", "")
            if not name:
                continue
            properties = row.get("Propriedades", "")
            entries.append(
                {
                    "id": f"livro5-armadura-{slug(name)}",
                    "category": "armor",
                    "name": name,
                    "tier": tier,
                    "kind": row.get("Tipo", ""),
                    "ca": parse_price(row.get("CA", "")),
                    "hooks": row.get("Ganchos", ""),
                    "mods": parse_price(row.get("Slots", "")),
                    "price": parse_price(row.get("Preco", row.get("Preço", ""))),
                    "tags": [tag for tag in (tier, row.get("Tipo", ""), properties) if tag],
                    "summary": " | ".join(
                        part
                        for part in (
                            f"Ganchos {row.get('Ganchos', '')}" if row.get("Ganchos") else "",
                            properties,
                        )
                        if part
                    ),
                    "source": f"Livro 5, Tabela {table_index}",
                    "schemaVersion": 1,
                }
            )
    return entries


def build_items(book5: dict) -> list[dict]:
    configs = {
        56: ("Municao", "Munição", "Uso", "Preço"),
        57: ("Municao especial", "Munição especial", "Efeito sugerido", "Preço"),
        58: ("Explosivo", "Item", "Efeito", "Preço"),
        59: ("Kit", "Kit", "Uso", "Preço"),
        60: ("Kit avancado", "Kit avançado", "Uso", "Preço"),
        61: ("Exploracao", "Equipamento", "Efeito sugerido", "Preço"),
        62: ("Tecnologico", "Equipamento", "Efeito sugerido", "Preço"),
        63: ("Medico", "Equipamento", "Efeito sugerido", "Preço"),
        64: ("Cosmico", "Equipamento", "Efeito sugerido", "Preço"),
    }
    entries = []
    for table_index, (category_label, name_key, summary_key, price_key) in configs.items():
        for row in rows_as_dicts(table_by_index(book5, table_index)):
            name = row.get(name_key, "")
            if not name:
                continue
            extras = [
                value
                for key, value in row.items()
                if value and key not in (name_key, summary_key, price_key)
            ]
            tier = row.get("Tier", row.get("Tier comum", ""))
            entries.append(
                {
                    "id": f"livro5-item-{slug(name)}",
                    "category": "item",
                    "name": name,
                    "tier": tier,
                    "price": parse_price(row.get(price_key, "")),
                    "weight": "",
                    "tags": [tag for tag in (category_label, tier) if tag],
                    "summary": " | ".join([row.get(summary_key, ""), *extras]).strip(" |"),
                    "source": f"Livro 5, Tabela {table_index}",
                    "schemaVersion": 1,
                }
            )
    return entries


def build_mods(book5: dict) -> list[dict]:
    entries = []
    for table_index in range(28, 37):
        table = table_by_index(book5, table_index)
        headers = [clean_field(value) for value in table["rows"][0]]
        if len(headers) < 3:
            continue
        group = headers[0].replace("Mod de ", "").replace("Mod ", "")
        for row in table["rows"][1:]:
            values = [clean_field(value) for value in row]
            if not values or not values[0]:
                continue
            name = values[0]
            effect = values[1] if len(values) > 1 else ""
            slots = values[2] if len(values) > 2 else ""
            entries.append(
                {
                    "id": f"livro5-mod-{slug(name)}",
                    "category": "mod",
                    "name": name,
                    "type": group,
                    "slots": parse_price(slots),
                    "effect": effect,
                    "summary": effect,
                    "tags": ["mod", group],
                    "source": f"Livro 5, Tabela {table_index}",
                    "schemaVersion": 1,
                }
            )
    return dedupe_by_id(entries)


def heading_level(style: str) -> int:
    match = re.search(r"(\d+)", style or "")
    return int(match.group(1)) if match else 99


def build_bestiary(book3: dict) -> list[dict]:
    blocks = book3["blocks"]
    headings = [
        (position, block)
        for position, block in enumerate(blocks)
        if block["type"] == "paragraph" and block.get("style", "").startswith("Heading")
    ]
    monsters = []
    for heading_position, (block_position, heading) in enumerate(headings):
        title = heading["text"]
        number_match = re.match(r"(\d+)\.(\d+)\.\s*(.+)", title)
        if not number_match:
            continue
        chapter = int(number_match.group(1))
        section = int(number_match.group(2))
        name = number_match.group(3).strip()
        level = heading_level(heading["style"])
        end_position = len(blocks)
        for next_position, next_heading in headings[heading_position + 1 :]:
            if heading_level(next_heading["style"]) <= level:
                end_position = next_position
                break
        section_blocks = [
            block
            for block in blocks[block_position + 1 : end_position]
            if block["type"] == "paragraph"
        ]
        direct_blocks = []
        for block in section_blocks:
            if block.get("style", "").startswith("Heading") and heading_level(block["style"]) > level:
                break
            direct_blocks.append(block)
        direct_text = "\n".join(block.get("text", "") for block in direct_blocks)
        has_core = bool(re.search(r"\bTier\s*:", direct_text, re.I)) and bool(
            re.search(r"\bPV\s*:", direct_text, re.I)
        )
        has_structured_core = any(
            block.get("style") == "Ficha Campo" and re.match(r"Tier\s*:", block.get("text", ""), re.I)
            for block in direct_blocks
        ) and any(
            block.get("style") == "Ficha Campo" and re.search(r"\bPV\s*:", block.get("text", ""), re.I)
            for block in direct_blocks
        )
        is_boss = chapter == 3 and 1 <= section <= 8
        is_standard = (chapter == 2 and has_core) or (chapter == 4 and has_structured_core)
        if not (is_boss or is_standard):
            continue
        monsters.append(build_monster_entry(chapter, section, name, section_blocks, is_boss))
    return monsters


def build_monster_entry(
    chapter: int,
    section: int,
    name: str,
    blocks: list[dict],
    is_boss: bool,
) -> dict:
    groups = []
    current = {"label": "Resumo", "items": []}
    groups.append(current)
    for block in blocks:
        text = block.get("text", "").strip()
        if not text:
            continue
        style = block.get("style", "")
        if style == "Ficha Campo" and ":" not in text and len(text) < 80:
            current = {"label": text.rstrip("."), "items": []}
            groups.append(current)
        else:
            current["items"].append(text)
    groups = [group for group in groups if group["items"]]
    full_text = "\n".join(item for group in groups for item in group["items"])
    tier = extract_text(full_text, "Tier") or ("Lendario" if is_boss else "")
    monster_type = extract_text(full_text, "Tipo") or ("Chefe lendario" if is_boss else "")
    role = extract_text(full_text, "Papel") or ("Chefe" if is_boss else "")
    size = extract_text(full_text, "Tamanho")
    pv = extract_number(full_text, "PV")
    ca = extract_number(full_text, "CA")
    movement = extract_text(full_text, "Movimento")
    habitat = extract_text(full_text, "Habitat")
    behavior = extract_text(full_text, "Comportamento")
    attributes = extract_text(full_text, "Atributos(?: importantes)?")
    attacks = collect_group_text(groups, ("ataque",))
    abilities = collect_group_text(groups, ("habilidade", "acoes de chefe", "reacoes", "fases"))
    resistances = collect_group_text(groups, ("resistencia",))
    weaknesses = collect_group_text(groups, ("fraqueza",))
    senses = collect_group_text(groups, ("sentido",))
    moral = collect_group_text(groups, ("moral",))
    resources = collect_group_text(groups, ("recurso", "loot", "coleta"))
    campaign = collect_group_text(groups, ("uso em campanha", "solucoes", "consequencias"))
    summary = behavior or campaign or first_meaningful_text(groups)
    tags = [value for value in (tier, monster_type, role, size, "Chefe" if is_boss else "") if value]
    return {
        "id": f"livro3-{chapter}-{section}-{slug(name)}",
        "category": "monster",
        "name": name,
        "tier": tier,
        "type": monster_type,
        "role": role,
        "size": size,
        "pv": pv,
        "ca": ca,
        "movement": movement,
        "habitat": habitat,
        "behavior": behavior,
        "attributes": attributes,
        "attacks": attacks,
        "abilities": abilities,
        "resistances": resistances,
        "weaknesses": weaknesses,
        "senses": senses,
        "moral": moral,
        "resources": resources,
        "campaign": campaign,
        "summary": summary,
        "tags": tags,
        "details": groups,
        "sheetType": "boss" if is_boss else "full",
        "needsCoreStats": is_boss and not (pv and ca),
        "assets": [],
        "source": f"Livro 3, {chapter}.{section}",
        "schemaVersion": 1,
    }


def extract_text(text: str, label_pattern: str) -> str:
    pattern = rf"(?:^|\n|[.;]\s*){label_pattern}\s*:\s*([^\n]+)"
    match = re.search(pattern, text, re.I)
    if not match:
        return ""
    value = match.group(1).strip()
    next_label = re.search(
        r"\.\s+(?:CA|PV|Movimento|Ataques?|Habilidade|Resistencias?|Fraquezas?|Sentidos?|Moral|Recursos?|Uso em campanha)\s*:",
        value,
        re.I,
    )
    if next_label:
        value = value[: next_label.start()]
    return value.rstrip(".").strip()


def extract_number(text: str, label: str) -> int | None:
    match = re.search(rf"(?:^|\n|[.;]\s*){label}\s*:\s*(\d+)", text, re.I)
    return int(match.group(1)) if match else None


def collect_group_text(groups: list[dict], needles: tuple[str, ...]) -> str:
    values = []
    for group in groups:
        normalized = slug(group["label"])
        if any(slug(needle) in normalized for needle in needles):
            values.extend(group["items"])
        else:
            for item in group["items"]:
                item_normalized = slug(item)
                if any(item_normalized.startswith(slug(needle)) for needle in needles):
                    values.append(item)
    return "\n".join(dict.fromkeys(values))


def first_meaningful_text(groups: list[dict]) -> str:
    for group in groups:
        for item in group["items"]:
            if len(item) >= 30:
                return item
    return ""


def dedupe_by_id(entries: list[dict]) -> list[dict]:
    result = []
    seen = set()
    for entry in entries:
        if entry["id"] in seen:
            continue
        seen.add(entry["id"])
        result.append(entry)
    return result


def write_js(output: Path, payload: dict) -> None:
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    output.write_text(
        "/* Gerado a partir das versoes finais dos Livros 1, 2, 3 e 5. */\n"
        f"globalThis.SOLARIS_OFFICIAL_BOOKS = {serialized};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--book1", type=Path, required=True)
    parser.add_argument("--book2", type=Path, required=True)
    parser.add_argument("--book3", type=Path, required=True)
    parser.add_argument("--book5", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    book1 = read_json(args.book1)
    book2 = read_json(args.book2)
    book3 = read_json(args.book3)
    book5 = read_json(args.book5)
    payload = {
        "schemaVersion": 1,
        "sources": {
            "book1": book1["source"],
            "book2": book2["source"],
            "book3": book3["source"],
            "book5": book5["source"],
        },
        "templates": build_templates(book5),
        "catalog": {
            "weapons": build_weapons(book5),
            "armors": build_armors(book5),
            "items": build_items(book5),
            "mods": build_mods(book5),
        },
        "bestiary": build_bestiary(book3),
        "rules": [*BOOK12_RULES, *BOOK5_RULES],
    }
    write_js(args.output, payload)


if __name__ == "__main__":
    main()
