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

function parseJsonSafe(value) {
  try {
    return { ok: true, value: parseJson(value), errors: [] };
  } catch (error) {
    return {
      ok: false,
      value: null,
      errors: [`JSON invalido: ${error.message}`],
    };
  }
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
  return attributes.esp !== undefined || attributes.ESP !== undefined || character.legacy?.attributes?.esp !== undefined || character.legacy?.attributes?.ESP !== undefined
    ? ["ESP legado preservado em source/legacy; nao foi convertido automaticamente para MEN."]
    : [];
}

function readResource(character = {}, key, legacyCurrent, legacyMax) {
  const resources = character.resources || {};
  const derived = character.derived || {};
  return {
    value: Number(resources[key]?.value ?? derived[key]?.value ?? legacyCurrent ?? 0),
    max: Number(resources[key]?.max ?? derived[key]?.max ?? legacyMax ?? legacyCurrent ?? 0),
  };
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
  const pv = readResource(character, "pv", 0, 0);
  const cosmos = readResource(character, "cosmos", 0, 0);
  const stress = readResource(character, "stress", 0, 0);
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
    pvCurrent: pv.value,
    cosmosCurrent: cosmos.value,
    stress: stress.value,
    resources: {
      pv,
      cosmos,
      stress,
    },
    currency: Number(character.inventory?.credits || 0),
    inventory: legacyInventoryFromSolaris(character),
    knownAbilities: (character.abilities || []).map((ability) => ability.legacy || ability),
    notes: character.notes?.campaignNotes || "",
    abilities: character.notes?.abilities || "",
    photoDataUrl: character.identity?.portrait || "",
  };
}

export function importSolarisCharacter(json) {
  const parsedResult = parseJsonSafe(json);
  if (!parsedResult.ok) {
    return {
      ok: false,
      character: null,
      schema: "invalid-json",
      source: null,
      errors: parsedResult.errors,
      warnings: [],
    };
  }
  const parsed = parsedResult.value;
  if (parsed?.schema === SOLARIS_EXPORT_BUNDLE_SCHEMA) {
    const character = parsed.payload?.character || parsed.payload?.characters?.[0] || parsed.characters?.[0];
    if (!character) throw new Error("Pacote Solaris nao contem personagens.");
    return {
      ok: true,
      character: legacyCharacterFromSolaris(character),
      schema: parsed.schema,
      source: parsed,
      errors: [],
      warnings: [
        "Pacote importado usando o primeiro personagem encontrado.",
        ...legacyEspWarnings(character),
      ],
    };
  }
  if (parsed?.schema === SOLARIS_CHARACTER_SCHEMA) {
    return {
      ok: true,
      character: legacyCharacterFromSolaris(parsed),
      schema: parsed.schema,
      source: parsed,
      errors: [],
      warnings: [
        ...(parsed.validation?.warnings || []),
        ...(parsed.warnings || []),
        ...legacyEspWarnings(parsed),
      ],
    };
  }
  return {
    ok: true,
    character: parsed,
    schema: "legacy-biblioteca-solaris-character",
    source: parsed,
    errors: [],
    warnings: ["Ficha legada importada sem schema Solaris oficial."],
  };
}
