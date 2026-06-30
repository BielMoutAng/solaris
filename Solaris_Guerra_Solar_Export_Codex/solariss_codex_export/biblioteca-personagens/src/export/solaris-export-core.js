import {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
  SOLARIS_ITEM_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicCharacterShape,
  validateBasicExportBundleShape,
  validateBasicItemShape,
} from "../schemas/solaris-schemas.js";

export const SOLARIS_EXPORT_APP_VERSION = "0.6.0-alpha.28";

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const arrayOf = (value) => (Array.isArray(value) ? value : []);
const textValue = (value, fallback = "") => (value === undefined || value === null ? fallback : String(value));
const numberValue = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

function slug(value, fallback = "solaris-entry") {
  return textValue(value, fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase() || fallback;
}

function makeId(prefix, source) {
  return textValue(firstValue(source?.id, source?.uid, source?.itemId), "")
    || `${prefix}-${slug(firstValue(source?.name, source?.label, Date.now()))}`;
}

function normalizeItemType(item = {}) {
  const normalized = textValue(firstValue(item.type, item.category, item.kind), "item").toLowerCase();
  if (normalized.includes("weapon") || normalized.includes("arma")) return "weapon";
  if (normalized.includes("armor") || normalized.includes("armadura")) return "armor";
  if (normalized.includes("ammo") || normalized.includes("municao")) return "ammo";
  if (normalized.includes("magazine") || normalized.includes("carregador")) return "magazine";
  if (normalized.includes("cube") || normalized.includes("cubo")) return "cube";
  if (normalized.includes("chip")) return "implant";
  if (normalized.includes("cosmos") || normalized.includes("ability") || normalized.includes("habilidade")) return "ability";
  if (normalized.includes("consum")) return "consumable";
  return normalized || "utility";
}

export function normalizeSolarisItemForExport(item = {}, options = {}) {
  const source = isObject(item) ? item : {};
  const exported = {
    schema: SOLARIS_ITEM_SCHEMA,
    id: makeId("item", source),
    name: textValue(firstValue(source.name, source.itemId, options.name), "Item Solaris"),
    type: normalizeItemType(source),
    tier: textValue(firstValue(source.tier, source.rank), ""),
    source: {
      book: textValue(firstValue(source.source?.book, source.source, source.officialData?.Livro), ""),
      chapter: textValue(firstValue(source.source?.chapter, source.officialData?.Capitulo), ""),
      reference: textValue(firstValue(source.sourceRow, source.reference), ""),
    },
    tags: arrayOf(source.tags).map(String),
    rules: clone(firstValue(source.rules, source.officialData, {})),
    equip: {
      equipped: Boolean(source.equipped || options.equipped),
      slot: textValue(firstValue(source.slot, source.slotId, source.location?.slotId), ""),
      location: clone(firstValue(source.location, {})),
    },
    durability: {
      cracks: numberValue(firstValue(source.crackLevel, source.cracks, source.durability?.cracks), 0),
      maxCracks: numberValue(firstValue(source.maxCracks, source.durability?.maxCracks), 5),
    },
    storage: {
      location: clone(firstValue(source.location, {})),
      cubeUid: textValue(source.cubeUid, ""),
      supportSlot: textValue(source.supportSlot, ""),
      inCube: Boolean(source.inCube || source.location?.kind === "cube"),
    },
    quantity: numberValue(firstValue(source.quantity, source.amount), 1),
    price: numberValue(firstValue(source.price, source.cost), 0),
    weight: numberValue(firstValue(source.weightKg, source.weight), 0),
    description: textValue(firstValue(source.description, source.summary, source.effect), ""),
    legacy: clone(source),
  };
  return { ...exported, validation: validateBasicItemShape(exported) };
}

function normalizeAttributes(character = {}) {
  const attrs = character.attributes || {};
  return {
    for: numberValue(firstValue(attrs.for, attrs.FOR), 0),
    ref: numberValue(firstValue(attrs.ref, attrs.REF), 0),
    con: numberValue(firstValue(attrs.con, attrs.CON), 0),
    men: numberValue(firstValue(attrs.men, attrs.MEN), 0),
    pre: numberValue(firstValue(attrs.pre, attrs.PRE), 0),
    int: numberValue(firstValue(attrs.int, attrs.INT), 0),
  };
}

function hasLegacyEsp(character = {}) {
  const attrs = character.attributes || {};
  return attrs.esp !== undefined || attrs.ESP !== undefined;
}

function normalizeDerived(character = {}) {
  const derived = character.exportContext?.derived || character.derived || {};
  return {
    pv: {
      value: numberValue(firstValue(character.pvCurrent, derived.pv?.value), 0),
      max: numberValue(firstValue(derived.pvMax, character.pvMax, derived.pv?.max, character.pvCurrent), 0),
    },
    ca: numberValue(firstValue(derived.ca, character.ca), 0),
    movement: numberValue(firstValue(derived.move, derived.movement, character.movement), 0),
    baseDice: textValue(firstValue(derived.baseDice, character.baseDice), "3d6"),
    stress: {
      value: numberValue(firstValue(character.stress, derived.stress?.value), 0),
      max: numberValue(firstValue(derived.stressMax, character.stressMax, derived.stress?.max), 6),
    },
    cosmos: {
      value: numberValue(firstValue(character.cosmosCurrent, derived.cosmos?.value), 0),
      max: numberValue(firstValue(derived.cosmosMax, character.cosmosMax, derived.cosmos?.max), 0),
    },
    cubeSlots: numberValue(firstValue(derived.cubeSlots, character.cubeSlots, character.loadUsed), 0),
  };
}

function normalizeSkills(character = {}) {
  const training = isObject(character.skillTraining) ? character.skillTraining : {};
  return Object.entries(training).reduce((acc, [name, state]) => {
    if (state === "trained") acc.trained.push(name);
    else if (state === "ignorant") acc.ignorant.push(name);
    else acc.other.push({ name, state });
    return acc;
  }, { trained: [], ignorant: [], other: [], focus: [], professionSkills: [] });
}

function normalizeInventory(character = {}) {
  const entries = arrayOf(character.inventory).map((entry) => normalizeSolarisItemForExport(entry));
  return {
    looseItems: entries.filter((entry) => !entry.storage.cubeUid && !entry.storage.supportSlot && !entry.equip.equipped),
    unassigned: entries.filter((entry) => entry.storage.location?.kind === "unassigned"),
    allItems: entries,
    cubes: entries.filter((entry) => entry.type === "cube"),
    credits: numberValue(firstValue(character.currency, character.credits), 0),
  };
}

function normalizeEquipment(character = {}, inventory) {
  const weaponUid = textValue(character.equippedWeaponUid, "");
  const armorUid = textValue(character.equippedArmorUid, "");
  const allItems = inventory.allItems || [];
  return {
    armor: allItems.find((entry) => entry.id === armorUid || entry.legacy?.uid === armorUid) || null,
    weapons: allItems.filter((entry) => entry.type === "weapon"),
    activeWeaponId: weaponUid,
    equippedItems: allItems.filter((entry) => entry.equip.equipped || [weaponUid, armorUid].includes(entry.legacy?.uid)),
    hooks: allItems.filter((entry) => entry.storage.supportSlot === "gancho"),
    holsters: allItems.filter((entry) => entry.storage.supportSlot === "coldre"),
    bandoliers: allItems.filter((entry) => entry.storage.supportSlot === "bandoleira"),
  };
}

export function exportSolarisCharacter(character = {}, options = {}) {
  const source = isObject(character) ? character : {};
  const now = options.exportedAt || new Date().toISOString();
  const inventory = normalizeInventory(source);
  const equipment = normalizeEquipment(source, inventory);
  const exported = {
    schema: SOLARIS_CHARACTER_SCHEMA,
    id: makeId("char", source),
    meta: {
      appVersion: textValue(firstValue(options.appVersion, source.createdWithVersion, source.exportContext?.appVersion), SOLARIS_EXPORT_APP_VERSION),
      saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
      createdAt: textValue(source.createdAt, ""),
      updatedAt: textValue(source.updatedAt, ""),
      exportedAt: now,
      legacySchemaVersion: source.characterSchemaVersion || null,
    },
    identity: {
      name: textValue(source.name, "Personagem Solaris"),
      player: textValue(source.player, ""),
      race: textValue(source.race, "humanis"),
      raceName: textValue(source.exportContext?.raceName, ""),
      origin: textValue(source.origin, ""),
      profession: textValue(source.profession, ""),
      professionName: textValue(source.exportContext?.professionName, ""),
      level: numberValue(source.level, 1),
      xp: numberValue(firstValue(source.experience, source.xp), 0),
      portrait: source.photoDataUrl || null,
    },
    attributes: normalizeAttributes(source),
    modifiers: clone(firstValue(source.modifiers, source.exportContext?.modifiers, {})),
    derived: normalizeDerived(source),
    skills: normalizeSkills(source),
    protectionRolls: clone(firstValue(source.protectionRolls, source.saves, {})),
    combat: {
      initiative: numberValue(firstValue(source.initiative, source.exportContext?.initiative), 0),
      conditions: clone(firstValue(source.conditions, [])),
      damageResistances: clone(firstValue(source.damageResistances, [])),
      damageWeaknesses: clone(firstValue(source.damageWeaknesses, [])),
    },
    equipment,
    inventory,
    ammoSystem: clone(firstValue(source.ammoSystem, source.domainCharacter?.ammoSystem, {})),
    abilities: arrayOf(source.knownAbilities).map((ability) => normalizeSolarisItemForExport({
      ...ability,
      type: ability.source === "Cosmos" ? "ability" : ability.type || "ability",
    })),
    notes: {
      background: textValue(source.background, ""),
      appearance: textValue(source.appearance, ""),
      personality: textValue(source.personality, ""),
      campaignNotes: textValue(source.notes, ""),
      abilities: textValue(source.abilities, ""),
    },
    migration: {
      source: "biblioteca-solaris-legacy-character",
      needsReviewFlags: [
        ...arrayOf(firstValue(source.needsReviewFlags, [])),
        ...(hasLegacyEsp(source) ? ["legacy-esp-preserved-without-men-migration"] : []),
      ],
    },
    legacy: options.includeLegacy === false ? null : clone(source),
  };
  return { ...exported, validation: validateBasicCharacterShape(exported) };
}

export function validateSolarisCharacter(character = {}) {
  if (character?.schema === SOLARIS_CHARACTER_SCHEMA) return validateBasicCharacterShape(character);
  return validateBasicCharacterShape(exportSolarisCharacter(character, { includeLegacy: false }));
}

export function createSolarisExportBundle(data = {}, options = {}) {
  const now = options.exportedAt || new Date().toISOString();
  const sourceCharacters = arrayOf(firstValue(data.characters, data.character ? [data.character] : []));
  const characters = sourceCharacters.map((character) => exportSolarisCharacter(character, { ...options, exportedAt: now }));
  const items = arrayOf(data.items).map((item) => normalizeSolarisItemForExport(item));
  const creatures = arrayOf(data.creatures).map((creature) => clone(creature));
  const warnings = [
    ...characters.flatMap((character) => character.validation?.warnings || []),
    ...items.flatMap((item) => item.validation?.warnings || []),
  ];
  const bundle = {
    schema: SOLARIS_EXPORT_BUNDLE_SCHEMA,
    id: makeId("export", { id: options.id, name: firstValue(options.name, data.name, "bundle") }),
    meta: {
      appVersion: textValue(options.appVersion, SOLARIS_EXPORT_APP_VERSION),
      saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
      exportedAt: now,
    },
    type: textValue(options.type, "library-export"),
    payload: {
      characters,
      items,
      creatures,
      notes: textValue(data.notes, ""),
    },
    saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
    appVersion: textValue(options.appVersion, SOLARIS_EXPORT_APP_VERSION),
    exportedAt: now,
    characters,
    items,
    creatures,
    notes: textValue(data.notes, ""),
    warnings,
    legacy: options.includeLegacy === false ? null : clone(data),
  };
  return { ...bundle, validation: validateBasicExportBundleShape(bundle) };
}
