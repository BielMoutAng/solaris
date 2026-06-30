import {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
} from "../schemas/solaris-schemas.js";

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

function parseJson(value) {
  return typeof value === "string" ? JSON.parse(value) : clone(value);
}

function upperAttributes(attributes = {}) {
  return {
    FOR: Number(attributes.for ?? attributes.FOR ?? 7),
    REF: Number(attributes.ref ?? attributes.REF ?? 7),
    CON: Number(attributes.con ?? attributes.CON ?? 7),
    MEN: Number(attributes.men ?? attributes.MEN ?? 7),
    PRE: Number(attributes.pre ?? attributes.PRE ?? 7),
    INT: Number(attributes.int ?? attributes.INT ?? 7),
  };
}

function legacyEspWarnings(character = {}) {
  const attributes = character.attributes || {};
  return attributes.esp !== undefined || attributes.ESP !== undefined
    ? ["ESP legado preservado em source/legacy; nao foi convertido automaticamente para MEN."]
    : [];
}

function legacyInventoryFromSolaris(character = {}) {
  return [
    ...(character.inventory?.allItems || []),
    ...(character.inventory?.looseItems || []),
  ].reduce((items, entry) => {
    const uid = entry.legacy?.uid || entry.id;
    if (items.some((item) => item.uid === uid)) return items;
    items.push({
      ...(entry.legacy || {}),
      uid,
      itemId: entry.legacy?.itemId || entry.id,
      name: entry.name,
      category: entry.type,
      price: entry.price,
      weight: entry.weight,
      location: entry.storage?.location || entry.equip?.location || { kind: "unassigned" },
      cubeUid: entry.storage?.cubeUid || "",
      supportSlot: entry.storage?.supportSlot || "",
      crackLevel: entry.durability?.cracks || 0,
    });
    return items;
  }, []);
}

function legacyCharacterFromSolaris(character = {}) {
  return {
    ...(character.legacy || {}),
    id: character.id,
    createdAt: character.meta?.createdAt || character.legacy?.createdAt || new Date().toISOString(),
    updatedAt: null,
    createdWithVersion: character.meta?.appVersion || character.legacy?.createdWithVersion || "",
    name: character.identity?.name || "",
    player: character.identity?.player || "",
    race: character.identity?.race || "humanis",
    profession: character.identity?.profession || "escolha-profissao",
    level: Number(character.identity?.level || 1),
    experience: Number(character.identity?.xp || 0),
    origin: character.identity?.origin || "",
    attributes: upperAttributes(character.attributes),
    pvCurrent: Number(character.derived?.pv?.value || 0),
    cosmosCurrent: Number(character.derived?.cosmos?.value || 0),
    stress: Number(character.derived?.stress?.value || 0),
    currency: Number(character.inventory?.credits || 0),
    inventory: legacyInventoryFromSolaris(character),
    knownAbilities: (character.abilities || []).map((ability) => ability.legacy || ability),
    notes: character.notes?.campaignNotes || "",
    abilities: character.notes?.abilities || "",
    photoDataUrl: character.identity?.portrait || "",
  };
}

export function importSolarisCharacter(json) {
  const parsed = parseJson(json);
  if (parsed?.schema === SOLARIS_EXPORT_BUNDLE_SCHEMA) {
    const character = parsed.payload?.characters?.[0] || parsed.characters?.[0];
    if (!character) throw new Error("Pacote Solaris nao contem personagens.");
    return {
      character: legacyCharacterFromSolaris(character),
      schema: parsed.schema,
      source: parsed,
      warnings: [
        "Pacote importado usando o primeiro personagem encontrado.",
        ...legacyEspWarnings(character),
      ],
    };
  }
  if (parsed?.schema === SOLARIS_CHARACTER_SCHEMA) {
    return {
      character: legacyCharacterFromSolaris(parsed),
      schema: parsed.schema,
      source: parsed,
      warnings: [
        ...(parsed.validation?.warnings || []),
        ...legacyEspWarnings(parsed),
      ],
    };
  }
  return {
    character: parsed,
    schema: "legacy-biblioteca-solaris-character",
    source: parsed,
    warnings: ["Ficha legada importada sem schema Solaris oficial."],
  };
}
