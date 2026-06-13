#!/usr/bin/env python3
"""Generate the official Solaris Book 5 catalog directly from the final DOCX."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

from docx import Document


SOURCE_LABEL = "Livro 5 - Tabelas oficiais"
CUBE_WEIGHT_KG = 1

TEMPLATE_META = {
    237: ("equipment", "Equipamento geral"),
    238: ("weapon", "Arma"),
    239: ("armor", "Armadura"),
    240: ("mod", "Mod"),
    241: ("cube", "Cubo"),
    242: ("special-item", "Item especial"),
    243: ("crafting", "Projeto de crafting"),
    244: ("vehicle", "Veículo"),
    245: ("pursuit", "Perseguição"),
    246: ("drone", "Drone"),
    247: ("turret", "Torreta"),
    248: ("robot", "Robô"),
    249: ("hacking", "Hacking"),
    250: ("network", "Rede digital"),
    251: ("shop", "Loja"),
    252: ("black-market", "Mercado negro"),
}

COMMON_ITEM_GROUPS = {
    226: "Iluminação, fogo e energia",
    227: "Sobrevivência, viagem e acampamento",
    228: "Reparo, manutenção e energia",
    229: "Ferramentas e objetos improvisáveis",
    230: "Observação, medição e sinalização",
    231: "Armazenamento, transporte e recipientes",
    232: "Vestuário e proteção ambiental",
    233: "Escrita, pesquisa e documentação",
    234: "Utensílios e objetos domésticos",
    235: "Luxo, cultura, religião e troca",
    236: "Itens comuns diversos",
}


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFD", clean(value))
    normalized = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", normalized.lower()).strip("-")
    return normalized or "entrada"


def table_rows(document: Document, index: int) -> list[list[str]]:
    table = document.tables[index - 1]
    return [[clean(cell.text) for cell in row.cells] for row in table.rows]


def rows_as_dicts(document: Document, index: int) -> list[dict[str, str]]:
    rows = table_rows(document, index)
    headers = rows[0]
    return [
        {headers[column]: row[column] if column < len(row) else "" for column in range(len(headers))}
        for row in rows[1:]
        if any(row)
    ]


def key_value_table(document: Document, index: int) -> dict[str, str]:
    return {
        clean(row[0]): clean(row[1])
        for row in table_rows(document, index)
        if len(row) >= 2 and clean(row[0]) and clean(row[0]).lower() not in {"campo", "valor"}
    }


def price_values(value: str) -> list[int]:
    numbers = re.findall(r"\d[\d.]*", clean(value))
    return [int(re.sub(r"\D", "", number)) for number in numbers if re.sub(r"\D", "", number)]


def exact_price(value: str) -> int | None:
    values = price_values(value)
    return values[0] if len(values) == 1 else None


def first_number(value: str, default: int = 0) -> int:
    match = re.search(r"-?\d+", clean(value))
    return int(match.group(0)) if match else default


def weight_value(value: str) -> float | None:
    match = re.search(r"\d+(?:[,.]\d+)?", clean(value))
    return float(match.group(0).replace(",", ".")) if match else None


def source_ref(table_index: int) -> str:
    return f"{SOURCE_LABEL}, Tabela {table_index}"


def split_legal_price(value: str) -> tuple[str, int | None]:
    text = clean(value)
    values = price_values(text)
    price = values[-1] if values else None
    legal = re.split(r"\s*/\s*(?=\d)", text, maxsplit=1)[0]
    return clean(legal), price


def unique_by_name(entries: list[dict]) -> list[dict]:
    result: list[dict] = []
    positions: dict[str, int] = {}
    for entry in entries:
        key = slug(entry.get("name", ""))
        if key in positions:
            previous = result[positions[key]]
            merged = {**previous, **{field: value for field, value in entry.items() if value not in ("", None, [], {})}}
            merged["tags"] = list(dict.fromkeys([*previous.get("tags", []), *entry.get("tags", [])]))
            merged["officialData"] = {
                **previous.get("officialData", {}),
                **entry.get("officialData", {}),
            }
            result[positions[key]] = merged
            continue
        positions[key] = len(result)
        result.append(entry)
    return result


def weapon_entry(
    *,
    name: str,
    tier: str,
    weapon_type: str,
    attack: str,
    damage: str,
    weapon_range: str,
    ammo: str = "",
    capacity: str = "",
    handling: str = "",
    mods: int = 0,
    cracks: str = "0/5",
    jammed: str = "",
    legality: str = "",
    price: int | None = None,
    summary: str = "",
    table_index: int,
    official_data: dict[str, str] | None = None,
) -> dict:
    details = [summary, f"Empunhadura: {handling}" if handling else "", f"Falha/Jammed: {jammed}" if jammed else ""]
    return {
        "id": f"book5-arma-{slug(name)}",
        "category": "weapon",
        "name": clean(name),
        "tier": clean(tier),
        "type": clean(weapon_type),
        "attack": clean(attack),
        "damage": clean(damage),
        "range": clean(weapon_range),
        "ammo": clean(ammo),
        "capacity": clean(capacity),
        "handling": clean(handling),
        "mods": max(0, mods),
        "cracks": clean(cracks),
        "jammed": clean(jammed),
        "legality": clean(legality),
        "price": price,
        "tags": list(dict.fromkeys(filter(None, ["arma", clean(weapon_type), clean(tier), clean(attack)]))),
        "summary": " ".join(filter(None, details)),
        "officialData": official_data or {},
        "source": source_ref(table_index),
        "schemaVersion": 2,
    }


def build_weapons(document: Document) -> list[dict]:
    weapons: list[dict] = []

    for row in rows_as_dicts(document, 54):
        slots, cracks = [clean(value) for value in row["Slots/Rach."].split("/", 1)]
        legality, price = split_legal_price(row["Legalidade/Preço"])
        weapons.append(
            weapon_entry(
                name=row["Nome"],
                tier="F",
                weapon_type=row["Categoria"],
                attack=row["Ataque"],
                damage=row["Dano"],
                weapon_range=row["Alcance/Área"],
                ammo=row["Munição"],
                capacity=row["Capacidade/Cadência"],
                mods=first_number(slots),
                cracks=cracks,
                jammed=row["Jammed"],
                legality=legality,
                price=price,
                table_index=54,
                official_data=row,
            )
        )

    for row in rows_as_dicts(document, 55):
        legality, price = split_legal_price(row["Legalidade/Preço"])
        weapons.append(
            weapon_entry(
                name=row["Nome"],
                tier="F",
                weapon_type=row["Categoria"],
                attack=row["Ataque"],
                damage=row["Dano"],
                weapon_range=row["Alcance"],
                handling=row["Empunhadura"],
                legality=legality,
                price=price,
                summary=row["Material/Origem"],
                table_index=55,
                official_data=row,
            )
        )

    for table_index in (74, 75):
        for row in rows_as_dicts(document, table_index):
            legality, price = split_legal_price(row["Legalidade / Preço"])
            weapons.append(
                weapon_entry(
                    name=row["Nome atualizado"],
                    tier=row["Tier"],
                    weapon_type=row["Categoria"],
                    attack=row["Ataque"],
                    damage=row["Dano"],
                    weapon_range=row["Alcance"],
                    handling=row["Empunhadura"],
                    mods=first_number(row["Slots"]),
                    cracks=row["Rachaduras"],
                    jammed=row["Falha"],
                    legality=legality,
                    price=price,
                    summary=row["Observações"],
                    table_index=table_index,
                    official_data=row,
                )
            )

    for table_index in (76, 77):
        for row in rows_as_dicts(document, table_index):
            legality, price = split_legal_price(row["Legalidade / Preço"])
            weapons.append(
                weapon_entry(
                    name=row["Nome atualizado"],
                    tier=row["Tier"],
                    weapon_type=row["Categoria"],
                    attack=row["Ataque"],
                    damage=row["Dano"],
                    weapon_range=row["Alcance / Área"],
                    ammo=row["Munição"],
                    capacity=row["Capacidade / Cadência"],
                    mods=first_number(row["Slots"]),
                    cracks=row["Rachaduras"],
                    jammed=row["Jammed / Falha"],
                    legality=legality,
                    price=price,
                    summary=row["Observações"],
                    table_index=table_index,
                    official_data=row,
                )
            )

    return unique_by_name(weapons)


def armor_entry(values: dict[str, str], table_index: int) -> dict:
    name = values.get("Nome", "")
    property_text = values.get("Propriedade especial", values.get("Propriedade", ""))
    observations = values.get("Observação", values.get("Observações", ""))
    spell_match = re.search(r"(?:aprender|escolher)\s+(\d+)\s+(?:magia|habilidade)", property_text, re.I)
    weight = values.get("Peso", "")
    return {
        "id": f"book5-armadura-{slug(name)}",
        "category": "armor",
        "name": name,
        "tier": values.get("Tier", ""),
        "type": values.get("Tipo", ""),
        "kind": values.get("Categoria", ""),
        "ca": first_number(values.get("CA", "")),
        "reduction": values.get("Redução", ""),
        "movement": values.get("Movimento", values.get("Mov.", "")),
        "hooks": first_number(values.get("Ganchos", "")),
        "interface": values.get("Interface Medular", ""),
        "electronics": values.get("Sistema eletrônico", ""),
        "mods": first_number(values.get("Slots", "")),
        "cracks": values.get("Rachaduras", values.get("Rach.", "0/5")),
        "failure": values.get("Falha", ""),
        "legality": values.get("Legalidade", ""),
        "price": exact_price(values.get("Preço", "")),
        "weight": weight.replace("kg", "Kg") if weight else "",
        "cosmicSpellSlots": first_number(spell_match.group(1)) if spell_match else 0,
        "tags": list(dict.fromkeys(filter(None, ["armadura", values.get("Tier", ""), values.get("Tipo", ""), values.get("Categoria", "")]))),
        "summary": " ".join(filter(None, [property_text, observations, values.get("Material/Origem", ""), values.get("Falha", "")])),
        "officialData": values,
        "source": source_ref(table_index),
        "schemaVersion": 2,
    }


def build_armors(document: Document) -> list[dict]:
    armors: list[dict] = []

    detail_indices = list(range(64, 72))
    for row, detail_index in zip(rows_as_dicts(document, 62), detail_indices):
        details = key_value_table(document, detail_index)
        values = {**row, **details}
        armors.append(armor_entry(values, detail_index))

    summary_rows: list[tuple[dict[str, str], int]] = []
    for table_index in (80, 81, 82):
        summary_rows.extend((row, table_index) for row in rows_as_dicts(document, table_index))
    detail_indices = [83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 94, 95]
    for (row, source_table), detail_index in zip(summary_rows, detail_indices):
        details = key_value_table(document, detail_index)
        values = {**row, **details, "Nome": row["Nome"]}
        armors.append(armor_entry(values, source_table))

    return unique_by_name(armors)


def common_item_entry(row: dict[str, str], group: str, table_index: int) -> dict:
    name = row["Nome"]
    payload = " ".join(
        filter(None, [name, row.get("FunÃ§Ã£o/Efeito", ""), row.get("ObservaÃ§Ã£o", "")])
    )
    normalized = slug(payload)
    consumable = bool(
        re.search(
            r"\b(racao|granada|dose|ampola|capsula|coagulante|antidoto|neutralizante|reagente|municao|cartucho|projetil|fosforos|oleo-inflamavel|foguete)\b",
            normalized,
        )
        or re.search(r"\b(consumivel|descartavel|uso-unico|gasto-ao-ser-usado|consumido)\b", normalized)
    )
    tags = ["item", group, *(["consumível"] if consumable else [])]
    return {
        "id": f"book5-item-{slug(name)}",
        "category": "item",
        "name": name,
        "type": group,
        "weight": row.get("Peso", ""),
        "price": exact_price(row.get("Preço em Lz", "")),
        "tags": tags,
        "consumable": consumable,
        "summary": " ".join(filter(None, [row.get("Função/Efeito", ""), row.get("Observação", "")])),
        "officialData": row,
        "source": source_ref(table_index),
        "schemaVersion": 2,
    }


def reference_item(
    *,
    name: str,
    item_type: str,
    summary: str,
    table_index: int,
    tier: str = "",
    price: int | None = None,
    category: str = "item",
    tags: list[str] | None = None,
    official_data: dict[str, str] | None = None,
    **extra,
) -> dict:
    return {
        "id": f"book5-{slug(category)}-{slug(name)}",
        "category": category,
        "name": clean(name),
        "tier": clean(tier),
        "type": clean(item_type),
        "price": price,
        "tags": list(dict.fromkeys(["item", clean(item_type), *(tags or [])])),
        "summary": clean(summary),
        "officialData": official_data or {},
        "source": source_ref(table_index),
        "schemaVersion": 2,
        **extra,
    }


def build_materials(document: Document) -> list[dict]:
    return [
        reference_item(
            name=row["Material"],
            item_type=f"Material {row['Tipo']}",
            summary=f"Material de crafting. Tier recomendado: {row['Tier']}.",
            table_index=136,
            tier=row["Tier"],
            price=exact_price(row["Preço Médio Atual"]),
            tags=["material", row["Tipo"]],
            official_data=row,
        )
        for row in rows_as_dicts(document, 136)
    ]


def build_reference_items(document: Document) -> list[dict]:
    items: list[dict] = []

    for row in rows_as_dicts(document, 143):
        items.append(
            reference_item(
                name=row["Kit"],
                item_type="Kit",
                summary=f"{row['Uso principal']} Teste associado: {row['Perícia ou teste associado']}",
                table_index=143,
                tags=["kit", "utilitário"],
                official_data=row,
            )
        )

    for row in rows_as_dicts(document, 146):
        items.append(
            reference_item(
                name=f"Granada de {row['Granada']}",
                item_type="Granada",
                summary=f"Área: {row['Área']}. {row['Efeito principal']} Defesa: {row['Defesa comum']}",
                table_index=146,
                tier=row["Tier comum"],
                tags=["granada", "combate", "consumível"],
                consumable=True,
                area=row["Área"],
                defense=row["Defesa comum"],
                official_data=row,
            )
        )

    for row in rows_as_dicts(document, 151):
        items.append(
            reference_item(
                name=row["Tipo"],
                item_type="Torreta",
                summary=row["Função"],
                table_index=151,
                tier=row["Tier comum"],
                tags=["torreta", "utilitário"],
                official_data=row,
            )
        )

    for row in rows_as_dicts(document, 157):
        items.append(
            reference_item(
                name=row["Drone"],
                item_type="Drone",
                summary=row["Função"],
                table_index=157,
                category="drone",
                tags=["drone", "utilitário"],
                official_data=row,
            )
        )

    for row in rows_as_dicts(document, 158):
        items.append(
            reference_item(
                name=row["Tipo"],
                item_type="Bateria",
                summary=row["Uso comum"],
                table_index=158,
                tags=["bateria", "energia"],
                official_data=row,
            )
        )

    vehicle_slots = {}
    for row in rows_as_dicts(document, 194):
        if row["Mod"] == "Tipo de veículo" or row["Risco"].isdigit() or row["Risco"].endswith("+"):
            vehicle_slots[slug(row["Mod"])] = row["Risco"]

    for row in rows_as_dicts(document, 200):
        prices = price_values(row["Preço sugerido em Luzentis"])
        price = prices[0] if len(prices) == 1 and "não disponível" not in row["Preço sugerido em Luzentis"].lower() else None
        slot_key = next((key for key in vehicle_slots if key in slug(row["Veículo"])), "")
        slot_text = vehicle_slots.get(slot_key, "")
        items.append(
            reference_item(
                name=row["Veículo"],
                item_type="Veículo",
                summary=f"Preço oficial sugerido: {row['Preço sugerido em Luzentis']} Luzentis.",
                table_index=200,
                price=price,
                category="vehicle",
                tags=["veículo"],
                mods=first_number(slot_text),
                priceRange=row["Preço sugerido em Luzentis"],
                official_data=row,
            )
        )

    chassis_stats = {row["Chassi"]: row for row in rows_as_dicts(document, 203)}
    for row in rows_as_dicts(document, 218):
        stats = chassis_stats.get(row["Chassi"], {})
        values = price_values(row["Custo base"])
        items.append(
            reference_item(
                name=f"Chassi robótico {row['Chassi']}",
                item_type="Chassi robótico",
                summary=" ".join(
                    filter(
                        None,
                        [
                            f"Custo base: {row['Custo base']}.",
                            f"PV {stats.get('PV base')}, CA {stats.get('CA base')}, slots {stats.get('Slots')}, carga {stats.get('Carga')}."
                            if stats
                            else "",
                        ],
                    )
                ),
                table_index=218,
                price=values[0] if values else None,
                category="robot",
                tags=["robô", "chassi"],
                pv=stats.get("PV base", ""),
                ca=stats.get("CA base", ""),
                mods=first_number(stats.get("Slots", "")),
                weight=stats.get("Carga", ""),
                official_data={**row, **stats},
            )
        )

    return items


def build_common_items(document: Document) -> tuple[list[dict], list[dict]]:
    items: list[dict] = []
    storage: list[dict] = []

    for table_index, group in COMMON_ITEM_GROUPS.items():
        for row in rows_as_dicts(document, table_index):
            entry = common_item_entry(row, group, table_index)
            is_storage = table_index == 231 or re.search(r"\b(coldre|bandoleira|gancho)\b", slug(row["Nome"]))
            (storage if is_storage else items).append(entry)

    items.extend(build_materials(document))
    items.extend(build_reference_items(document))
    return unique_by_name(items), unique_by_name(storage)


def build_cubes(document: Document) -> list[dict]:
    kind_map = {
        "Cubo Simples": ("simple", 1, "single"),
        "Cubo de Carga": ("cargo", 10, "same-item"),
        "Cubo Especializado": ("specialized", 10, "same-family"),
    }
    cubes: list[dict] = []

    for row in rows_as_dicts(document, 96):
        kind, capacity, material_mode = kind_map[row["Cubo"]]
        cubes.append(
            {
                "id": f"book5-cubo-{slug(row['Cubo'])}",
                "category": "cube",
                "name": row["Cubo"],
                "tier": "F",
                "cubeKind": kind,
                "cubeCapacity": capacity,
                "cubeMaterialMode": material_mode,
                "weight": f"{CUBE_WEIGHT_KG} Kg",
                "price": None,
                "tags": ["cubo", kind],
                "summary": f"{row['Função']} Exemplos: {row['Exemplos']}",
                "officialData": row,
                "source": source_ref(96),
                "schemaVersion": 2,
            }
        )

    for row in rows_as_dicts(document, 97):
        cubes.append(
            {
                "id": f"book5-cubo-{slug(row['Cubo especializado'])}",
                "category": "cube",
                "name": row["Cubo especializado"],
                "tier": "F",
                "cubeKind": "specialized",
                "cubeCapacity": 10,
                "cubeMaterialMode": "same-family",
                "cubeFamily": slug(row["Cubo especializado"].replace("Cubo de ", "").replace("Cubo ", "")),
                "weight": f"{CUBE_WEIGHT_KG} Kg",
                "price": None,
                "tags": ["cubo", "especializado"],
                "summary": f"Conteúdo adequado: {row['Conteudo adequado']}",
                "officialData": row,
                "source": source_ref(97),
                "schemaVersion": 2,
            }
        )

    return cubes


def build_storage_supports(document: Document, storage_items: list[dict]) -> list[dict]:
    supports = list(storage_items)
    for row in rows_as_dicts(document, 98):
        name_key = slug(row["Suporte"])
        existing = next((item for item in supports if slug(item["name"]) == name_key), None)
        capacity = first_number(row["Capacidade sugerida"])
        summary = f"Capacidade sugerida: {row['Capacidade sugerida']}. {row['Observação']}"
        if existing:
            existing["summary"] = f"{existing['summary']} {summary}"
            existing["cubeSupport"] = capacity
            existing["officialData"] = {
                **existing.get("officialData", {}),
                **row,
            }
            existing["tags"] = list(dict.fromkeys([*existing["tags"], "suporte de cubos"]))
            continue
        supports.append(
            reference_item(
                name=row["Suporte"],
                item_type="Suporte de cubos",
                summary=summary,
                table_index=98,
                tags=["armazenamento", "suporte de cubos"],
                cubeSupport=capacity,
                official_data=row,
            )
        )
    return unique_by_name(supports)


def build_modifier_chips(document: Document) -> list[dict]:
    chips: list[dict] = []
    rank_by_table = {46: "F", 47: "E", 48: "D"}
    for table_index, rank in rank_by_table.items():
        for row in rows_as_dicts(document, table_index):
            name = row["Nome"]
            chips.append(
                {
                    "id": f"book5-chip-{slug(name)}",
                    "category": "chip-mod",
                    "name": name,
                    "rank": rank,
                    "tier": rank,
                    "type": row["Tipo"],
                    "installation": row["Instalação"],
                    "slots": max(1, first_number(row["Slots"], 1)),
                    "activation": row["Ativação"],
                    "materials": row["Materiais sugeridos"],
                    "failure": row["Falha / Limite"],
                    "tags": ["chip modificador", rank, row["Tipo"]],
                    "summary": row["Efeito mecânico revisado"],
                    "officialData": row,
                    "source": source_ref(table_index),
                    "schemaVersion": 2,
                }
            )
    return unique_by_name(chips)


def build_mods(document: Document) -> list[dict]:
    mods: list[dict] = []
    for row in rows_as_dicts(document, 194):
        name = row["Mod"]
        risk = row["Risco"]
        if name == "Tipo de veículo" or risk.isdigit() or risk.endswith("+"):
            continue
        mods.append(
            {
                "id": f"book5-mod-veiculo-{slug(name)}",
                "category": "mod",
                "name": name,
                "tier": "",
                "type": "Mod de veículo",
                "slots": 1,
                "risk": risk,
                "tags": ["mod", "veículo"],
                "summary": f"{row['Efeito possível']} Risco: {risk}",
                "officialData": row,
                "source": source_ref(194),
                "schemaVersion": 2,
            }
        )

    for row in rows_as_dicts(document, 210):
        name = row["Módulo"]
        mods.append(
            {
                "id": f"book5-mod-robo-{slug(name)}",
                "category": "mod",
                "name": name,
                "tier": "",
                "type": "Módulo de robô",
                "slots": max(1, first_number(row["Slots"], 1)),
                "tags": ["mod", "robô"],
                "summary": row["Efeito"],
                "officialData": row,
                "source": source_ref(210),
                "schemaVersion": 2,
            }
        )
    return unique_by_name(mods)


def clean_template_field(value: str) -> str:
    value = re.sub(r"_+", "", clean(value))
    return clean(value).rstrip(":")


def infer_field_type(label: str) -> str:
    text = slug(label)
    if any(word in text for word in ("descricao", "observacoes", "historico", "consequencia", "resultado", "segredo", "efeito", "funcao")):
        return "textarea"
    if text.endswith("jammed") or text.startswith("pode-") or text.startswith("ocupa-cubo"):
        return "select-yes-no"
    return "text"


def build_templates(document: Document) -> list[dict]:
    templates: list[dict] = []
    for table_index, (template_id, label) in TEMPLATE_META.items():
        fields = []
        seen = set()
        for row in table_rows(document, table_index):
            for cell in row:
                field_label = clean_template_field(cell)
                field_id = slug(field_label)
                if not field_label or field_id in seen:
                    continue
                seen.add(field_id)
                fields.append(
                    {
                        "id": field_id,
                        "label": field_label,
                        "type": infer_field_type(field_label),
                        "wide": infer_field_type(field_label) == "textarea",
                    }
                )
        templates.append(
            {
                "id": template_id,
                "label": label,
                "source": source_ref(table_index),
                "schemaVersion": 2,
                "fields": fields,
            }
        )
    return templates


def write_output(output: Path, payload: dict) -> None:
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    output.write_text(
        "/* Gerado automaticamente a partir das tabelas oficiais do Livro 5. */\n"
        f"globalThis.SOLARIS_OFFICIAL_BOOK5 = {serialized};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--book", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    document = Document(args.book)
    common_items, storage_items = build_common_items(document)
    payload = {
        "schemaVersion": 2,
        "source": args.book.name,
        "sourceLabel": SOURCE_LABEL,
        "cubeWeightKg": CUBE_WEIGHT_KG,
        "templates": build_templates(document),
        "catalog": {
            "weapons": build_weapons(document),
            "armors": build_armors(document),
            "items": common_items,
            "storage": build_storage_supports(document, storage_items),
            "cubes": build_cubes(document),
            "modifierChips": build_modifier_chips(document),
            "mods": build_mods(document),
        },
    }
    write_output(args.output, payload)

    counts = {name: len(entries) for name, entries in payload["catalog"].items()}
    print(json.dumps({"output": str(args.output), "counts": counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
