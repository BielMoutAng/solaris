import {
  AMMO_KINDS,
  FEED_SYSTEMS,
  FIRE_MODE_IDS,
  FIRE_MODES,
  ammoCubeUnitsFor,
  createMagazineInstance,
  createWeaponAmmoState,
  normalizeAmmoKind,
} from "./solaris-domain-architecture.js";

import {
  COMBAT_DAMAGE_TYPES,
  crackEffectFor,
} from "./solaris-combat-rules.js";

export {
  AMMO_KINDS,
  FEED_SYSTEMS,
  FIRE_MODE_IDS,
  FIRE_MODES,
  ammoCubeUnitsFor,
  createMagazineInstance,
  createWeaponAmmoState,
  normalizeAmmoKind,
};

export const EQUIPMENT_SCHEMA_VERSION = 1;

export const EQUIPMENT_TIERS = Object.freeze(["F", "E", "D", "C", "B", "A", "S"]);

export const EQUIPMENT_CATEGORIES = Object.freeze({
  ITEM: "item",
  WEAPON: "weapon",
  ARMOR: "armor",
  STORAGE: "storage",
  CUBE: "cube",
  MOD: "mod",
  CHIP: "chip",
  AMMO: "ammo",
  MAGAZINE: "magazine",
  DRONE: "drone",
  TURRET: "turret",
  VEHICLE: "vehicle",
  ROBOT: "robot",
  SERVICE: "service",
});

export const WEAPON_CATEGORIES = Object.freeze([
  "punhos",
  "manoplas",
  "adagas",
  "espadas",
  "sabres",
  "machados",
  "martelos",
  "lancas",
  "bastoes",
  "chicotes",
  "pistola",
  "revolver",
  "submetralhadora",
  "escopeta",
  "carabina",
  "rifle",
  "rifle de precisao",
  "fuzil",
  "metralhadora",
  "lancador",
  "granada",
  "arma pesada",
  "arma improvisada",
  "arma cosmica",
]);

export const ARMOR_CATEGORIES = Object.freeze([
  "leve",
  "media",
  "pesada",
  "traje",
  "escudo",
  "utilitaria",
  "organica",
  "tecnologica",
]);

export const DAMAGE_TYPES = Object.freeze({
  BALLISTIC: "balistico",
  PIERCING: COMBAT_DAMAGE_TYPES.PIERCING,
  SLASHING: COMBAT_DAMAGE_TYPES.SLASHING,
  BLUDGEONING: COMBAT_DAMAGE_TYPES.BLUDGEONING,
  FIRE: COMBAT_DAMAGE_TYPES.FIRE,
  ELECTRIC: COMBAT_DAMAGE_TYPES.ELECTRIC,
  ACID: COMBAT_DAMAGE_TYPES.ACID,
  TOXIC: COMBAT_DAMAGE_TYPES.TOXIC,
  COSMIC: COMBAT_DAMAGE_TYPES.COSMIC,
  ENERGY: "energia",
  THERMAL: "termico",
  COLD: "frio",
  EMP: COMBAT_DAMAGE_TYPES.EMP,
});

export const ITEM_STORAGE_TYPES = Object.freeze({
  EQUIPPED: "equipped",
  ACTIVE: "active",
  CUBE_SIMPLE: "cube-simple",
  CUBE_CARGO: "cube-cargo",
  CUBE_SPECIALIZED: "cube-specialized",
  CUBE_AMMO: "cube-ammo",
  BACKPACK: "backpack",
  HOLSTER: "holster",
  BANDOLIER: "bandolier",
  HOOK: "hook",
  BASE: "base",
  UNASSIGNED: "unassigned",
});

export const EQUIPMENT_CONDITION_STATES = Object.freeze({
  INTACT: "intact",
  SCRATCHED: "scratched",
  COMPROMISED: "compromised",
  UNSTABLE: "unstable",
  BROKEN: "broken",
  JAMMED: "jammed",
  TEMPORARILY_REPAIRED: "temporarily-repaired",
});

export const REPAIR_ACTIONS = Object.freeze({
  REPAIR_CRACK: "repair-crack",
  EMERGENCY_REPAIR: "emergency-repair",
  CLEAR_JAM: "clear-jam",
  MAINTENANCE: "maintenance",
});

export const CRAFTING_ACTIONS = Object.freeze({
  CREATE: "create",
  REPAIR: "repair",
  UPGRADE_TIER: "upgrade-tier",
  INSTALL_MOD: "install-mod",
  DISMANTLE: "dismantle",
});

export const MOD_CATEGORIES = Object.freeze({
  WEAPON: "weapon",
  ARMOR: "armor",
  STORAGE: "storage",
  VEHICLE: "vehicle",
  ROBOT: "robot",
  UNIVERSAL: "universal",
});

export const MOD_COMPATIBILITY_RULES = Object.freeze({
  weapon: Object.freeze(["weapon", "arma"]),
  armor: Object.freeze(["armor", "armadura"]),
  storage: Object.freeze(["storage", "cube", "container", "cubo", "mochila"]),
  vehicle: Object.freeze(["vehicle", "veiculo"]),
  robot: Object.freeze(["robot", "drone", "turret", "robo", "torreta"]),
  universal: Object.freeze(["weapon", "armor", "storage", "cube", "vehicle", "robot", "drone", "turret", "item"]),
});

const RANGED_WEAPON_CATEGORIES = new Set([
  "pistola",
  "revolver",
  "submetralhadora",
  "escopeta",
  "carabina",
  "rifle",
  "rifle de precisao",
  "fuzil",
  "metralhadora",
  "lancador",
  "granada",
  "arma pesada",
]);

const MELEE_WEAPON_CATEGORIES = new Set([
  "punhos",
  "manoplas",
  "adagas",
  "espadas",
  "sabres",
  "machados",
  "martelos",
  "lancas",
  "bastoes",
  "chicotes",
  "arma improvisada",
]);

const SIZE_BULK = Object.freeze({
  tiny: 0.25,
  small: 1,
  pequeno: 1,
  pequena: 1,
  medium: 2,
  medio: 2,
  media: 2,
  large: 3,
  grande: 3,
  huge: 5,
});

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function numeric(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
  const normalized = String(value ?? "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.+-]/g, "");
  const result = Number(normalized);
  return Number.isFinite(result) ? result : fallback;
}

function integer(value, fallback = 0) {
  return Math.floor(numeric(value, fallback));
}

function bounded(value, min, max, fallback = min) {
  return Math.min(max, Math.max(min, numeric(value, fallback)));
}

function normalizeKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[ºª]/g, "")
    .replace(/[^a-z0-9+ -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeId(value = "", fallback = "equipment") {
  const key = normalizeKey(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return key || `${fallback}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function uniqueStrings(value) {
  return [...new Set(arrayOf(value).map((entry) => String(entry || "").trim()).filter(Boolean))];
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function officialField(entry = {}, ...keys) {
  const data = objectOrEmpty(entry.officialData);
  for (const key of keys) {
    if (entry[key] !== undefined && entry[key] !== null && String(entry[key]).trim() !== "") return entry[key];
    if (data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== "") return data[key];
  }
  return "";
}

function normalizeTier(value = "") {
  const raw = String(value || "").trim().toUpperCase().replace(/^TIER\s+/i, "");
  return EQUIPMENT_TIERS.includes(raw) ? raw : raw;
}

function normalizeCategory(value = "") {
  const key = normalizeKey(value);
  if (["arma", "weapon", "weapons"].includes(key)) return EQUIPMENT_CATEGORIES.WEAPON;
  if (["armadura", "armor", "armors"].includes(key)) return EQUIPMENT_CATEGORIES.ARMOR;
  if (["cubo", "cube", "cubes"].includes(key)) return EQUIPMENT_CATEGORIES.CUBE;
  if (["armazenamento", "storage", "container", "mochila", "coldre", "bandoleira", "gancho"].includes(key)) return EQUIPMENT_CATEGORIES.STORAGE;
  if (["mod", "mods", "melhoria", "upgrade"].includes(key)) return EQUIPMENT_CATEGORIES.MOD;
  if (["chip", "chip mod", "chip modificador", "modifier chip", "modifierchips"].includes(key)) return EQUIPMENT_CATEGORIES.CHIP;
  if (["municao", "ammo"].includes(key)) return EQUIPMENT_CATEGORIES.AMMO;
  if (["carregador", "magazine"].includes(key)) return EQUIPMENT_CATEGORIES.MAGAZINE;
  if (["drone", "drones"].includes(key)) return EQUIPMENT_CATEGORIES.DRONE;
  if (["torreta", "turret", "torretas"].includes(key)) return EQUIPMENT_CATEGORIES.TURRET;
  if (["veiculo", "vehicle", "vehicles"].includes(key)) return EQUIPMENT_CATEGORIES.VEHICLE;
  if (["robo", "robot", "automato", "autonomo"].includes(key)) return EQUIPMENT_CATEGORIES.ROBOT;
  if (["servico", "service"].includes(key)) return EQUIPMENT_CATEGORIES.SERVICE;
  return EQUIPMENT_CATEGORIES.ITEM;
}

function normalizeWeaponCategory(value = "") {
  const key = normalizeKey(value).replace(/\bde\s+precisao\b/g, "de precisao");
  const aliases = {
    "punho": "punhos",
    "briga": "punhos",
    "desarmado": "punhos",
    "unarmed": "punhos",
    "manopla": "manoplas",
    "adaga": "adagas",
    "espada": "espadas",
    "sabre": "sabres",
    "machado": "machados",
    "martelo": "martelos",
    "lanca": "lancas",
    "bastao": "bastoes",
    "chicote": "chicotes",
    "revólver": "revolver",
    "revolveres": "revolver",
    "submetralhadoras": "submetralhadora",
    "escopetas": "escopeta",
    "carabinas": "carabina",
    "rifles": "rifle",
    "rifle precisao": "rifle de precisao",
    "rifle de precisão": "rifle de precisao",
    "sniper": "rifle de precisao",
    "fuzis": "fuzil",
    "metralhadoras": "metralhadora",
    "lancadores": "lancador",
    "lançador": "lancador",
    "granadas": "granada",
    "pesada": "arma pesada",
    "arma pesada": "arma pesada",
    "improvisado": "arma improvisada",
    "improvisada": "arma improvisada",
    "cosmica": "arma cosmica",
  };
  if (aliases[key]) return aliases[key];
  const match = WEAPON_CATEGORIES.find((category) => key.includes(category));
  return match || key || "arma improvisada";
}

function normalizeArmorCategory(value = "") {
  const key = normalizeKey(value);
  if (key.includes("pesad")) return "pesada";
  if (key.includes("med")) return "media";
  if (key.includes("leve")) return "leve";
  if (key.includes("escudo")) return "escudo";
  if (key.includes("traje")) return "traje";
  if (key.includes("organ")) return "organica";
  if (key.includes("tec")) return "tecnologica";
  if (key.includes("util")) return "utilitaria";
  return key || "leve";
}

function normalizeSize(value = "") {
  const key = normalizeKey(value);
  if (["tiny", "miudo", "minusculo"].includes(key)) return "tiny";
  if (key.includes("pequen") || key.includes("small") || key.includes("leve")) return "small";
  if (key.includes("medio") || key.includes("media") || key.includes("medium")) return "medium";
  if (key.includes("grande") || key.includes("large") || key.includes("pesad")) return "large";
  if (key.includes("enorme") || key.includes("huge")) return "huge";
  return "";
}

function parseWeightKg(value, fallback = 0) {
  if (typeof value === "number") return Math.max(0, value);
  const text = String(value || "");
  const result = numeric(text, fallback);
  return Math.max(0, result);
}

function parsePrice(value, fallback = 0) {
  return Math.max(0, integer(value, fallback));
}

function parseRangeMeters(value, fallback = 0) {
  if (typeof value === "number") return Math.max(0, value);
  const text = String(value || "");
  if (!text.trim() || /corpo|toque|melee/i.test(text)) return fallback;
  return Math.max(0, numeric(text, fallback));
}

function parseSlots(value, fallback = 0) {
  if (typeof value === "number") return Math.max(0, Math.floor(value));
  const text = String(value || "");
  const match = text.match(/(\d+)\s*(?:slots?|mods?|mod)/i) || text.match(/^(\d+)/);
  return Math.max(0, integer(match?.[1], fallback));
}

function parseDiceFormula(value = "", fallback = "1d4") {
  const text = String(value || "").trim();
  const match = text.match(/(\d+)\s*d\s*(\d+)\s*([+-]\s*\d+)?/i);
  if (!match) {
    const fallbackMatch = String(fallback).match(/(\d+)\s*d\s*(\d+)\s*([+-]\s*\d+)?/i);
    return {
      formula: fallback,
      diceCount: integer(fallbackMatch?.[1], 1),
      dieSize: integer(fallbackMatch?.[2], 4),
      flatBonus: fallbackMatch?.[3] ? integer(String(fallbackMatch[3]).replace(/\s+/g, ""), 0) : 0,
      text,
    };
  }
  const flatBonus = match[3] ? integer(String(match[3]).replace(/\s+/g, ""), 0) : 0;
  return {
    formula: `${integer(match[1], 1)}d${integer(match[2], 4)}${flatBonus ? (flatBonus > 0 ? `+${flatBonus}` : String(flatBonus)) : ""}`,
    diceCount: integer(match[1], 1),
    dieSize: integer(match[2], 4),
    flatBonus,
    text,
  };
}

function inferDamageType(value = "") {
  const key = normalizeKey(value);
  if (key.includes("balist")) return DAMAGE_TYPES.BALLISTIC;
  if (key.includes("perfur")) return DAMAGE_TYPES.PIERCING;
  if (key.includes("cort")) return DAMAGE_TYPES.SLASHING;
  if (key.includes("concuss") || key.includes("impact")) return DAMAGE_TYPES.BLUDGEONING;
  if (key.includes("term") || key.includes("fogo") || key.includes("calor")) return DAMAGE_TYPES.THERMAL;
  if (key.includes("eletr")) return DAMAGE_TYPES.ELECTRIC;
  if (key.includes("acid") || key.includes("corros")) return DAMAGE_TYPES.ACID;
  if (key.includes("toxic") || key.includes("venen")) return DAMAGE_TYPES.TOXIC;
  if (key.includes("cosm")) return DAMAGE_TYPES.COSMIC;
  if (key.includes("energia") || key.includes("energet")) return DAMAGE_TYPES.ENERGY;
  return "";
}

function getAttributeModifier(actor = {}, attribute = "FOR") {
  const key = String(attribute || "").toUpperCase();
  const direct = actor.modifiers?.[key] ?? actor.mods?.[key] ?? actor.attributeModifiers?.[key];
  if (direct !== undefined) return numeric(direct, 0);
  const value = actor.attributes?.[key] ?? actor[key] ?? actor[key.toLowerCase()];
  if (value !== undefined) return Math.floor((numeric(value, 7) - 10) / 2);
  return 0;
}

function capacityFromWeapon(entry = {}) {
  if (entry.capacity !== undefined && entry.capacity !== null && String(entry.capacity).trim() !== "") return Math.max(0, integer(entry.capacity, 0));
  const value = String(officialField(entry, "capacity", "Capacidade/Cadência", "Capacidade/Cadencia") || "");
  const match = value.match(/(\d+)/);
  return match ? integer(match[1], 0) : 0;
}

function ammoKindFromWeapon(entry = {}) {
  const direct = firstDefined(entry.ammoKind, entry.defaultAmmoKind, entry.ammoState?.defaultAmmoKind);
  if (direct) return normalizeAmmoKind(direct);
  const text = normalizeKey(officialField(entry, "ammo", "Munição", "Municao"));
  if (text.includes("leve")) return AMMO_KINDS.LIGHT;
  if (text.includes("media") || text.includes("medio")) return AMMO_KINDS.MEDIUM;
  if (text.includes("cartucho") || text.includes("escopeta")) return AMMO_KINDS.SHELL;
  if (text.includes("energia") || text.includes("celula")) return AMMO_KINDS.ENERGY_CELL;
  if (text.includes("granada")) return AMMO_KINDS.GRENADE;
  if (text.includes("foguete") || text.includes("missil")) return AMMO_KINDS.ROCKET;
  return AMMO_KINDS.NONE;
}

function feedSystemFromWeapon(entry = {}, category = "") {
  if (Object.values(FEED_SYSTEMS).includes(entry.feedSystem)) return entry.feedSystem;
  if (Object.values(FEED_SYSTEMS).includes(entry.ammoState?.feedSystem)) return entry.ammoState.feedSystem;
  const text = normalizeKey([
    officialField(entry, "capacity", "Capacidade/Cadência", "Capacidade/Cadencia"),
    officialField(entry, "ammo", "Munição", "Municao"),
    entry.name,
  ].join(" "));
  if (MELEE_WEAPON_CATEGORIES.has(category) || category === "arma cosmica") return FEED_SYSTEMS.NONE;
  if (text.includes("tambor") || category === "revolver") return FEED_SYSTEMS.CYLINDER;
  if (text.includes("cartucho") || category === "escopeta") return FEED_SYSTEMS.INTERNAL_MAGAZINE;
  if (text.includes("celula") || text.includes("energia")) return FEED_SYSTEMS.ENERGY_CELL;
  if (text.includes("unico") || text.includes("tiro unico")) return FEED_SYSTEMS.INTERNAL_MAGAZINE;
  return FEED_SYSTEMS.DETACHABLE_MAGAZINE;
}

function defaultFireModesForWeapon(category = "", entry = {}) {
  const text = normalizeKey([
    officialField(entry, "capacity", "Capacidade/Cadência", "Capacidade/Cadencia"),
    entry.name,
    entry.summary,
  ].join(" "));
  const modes = [FIRE_MODE_IDS.SINGLE];
  if (category === "escopeta") modes.push(FIRE_MODE_IDS.SHOTGUN_CONE);
  if (category === "lancador") modes.push(FIRE_MODE_IDS.LAUNCHER_SHOT);
  if (category === "metralhadora") modes.push(FIRE_MODE_IDS.MACHINEGUN_BURST, FIRE_MODE_IDS.SUPPRESSION);
  if (text.includes("rajada") || category === "submetralhadora" || category === "fuzil") modes.push(FIRE_MODE_IDS.BURST);
  return [...new Set(modes)];
}

export function normalizeEquipmentEntry(entry = {}) {
  const source = clone(entry) || {};
  const name = String(firstDefined(source.name, source.nome, source.title, source.label, source.id, "Equipamento") || "Equipamento");
  const category = normalizeCategory(firstDefined(source.category, source.kind, source.reconciliationCategory, source.type));
  const normalized = {
    ...source,
    schemaVersion: EQUIPMENT_SCHEMA_VERSION,
    id: String(source.id || source.uid || source.officialId || normalizeId(name, "equipment")),
    officialId: String(source.officialId || source.id || ""),
    category,
    type: String(firstDefined(source.type, source.subtype, source.kind, source.category, "") || ""),
    name,
    tier: normalizeTier(firstDefined(source.tier, source.rank, "")),
    price: parsePrice(firstDefined(source.price, source.cost, source.basePrice, source.preco, officialField(source, "Legalidade/Preço", "Legalidade/Preco")), 0),
    weightKg: parseWeightKg(firstDefined(source.weightKg, source.weight, source.peso, officialField(source, "Peso ou carga", "Peso")), 0),
    legalidade: String(firstDefined(source.legality, source.legalidade, officialField(source, "Legalidade/Preço", "Legalidade/Preco"), "") || ""),
    description: String(firstDefined(source.description, source.descricao, source.summary, officialField(source, "Descrição", "Descricao"), "") || ""),
    functionText: String(firstDefined(source.functionText, source.funcao, officialField(source, "Função", "Funcao"), "") || ""),
    tags: uniqueStrings(source.tags),
    source: String(source.source || source.sourceSection || ""),
    sourceFileCurrent: String(source.sourceFileCurrent || ""),
    sourceStatus: String(source.sourceStatus || ""),
    needsReview: Boolean(source.needsReview || source.sourceNeedsReview),
    reviewReason: String(source.reviewReason || ""),
    cracks: bounded(firstDefined(source.crackLevel, source.rachaduras, source.cracks, source.cracksCurrent, 0), 0, 5, 0),
    crackMax: 5,
    jammed: Boolean(source.jammed === true || source.status?.jammed),
    conditionState: String(source.conditionState || EQUIPMENT_CONDITION_STATES.INTACT),
    installedMods: arrayOf(source.installedMods || source.modsInstalled).map((item) => normalizeModEntry(item)),
    modSlots: parseSlots(firstDefined(source.modSlots, source.mods, source.slots, officialField(source, "Slots/Rach.", "Slots"))),
    metadata: {
      sourceSchemaVersion: source.schemaVersion || 0,
      reconciliationCategory: source.reconciliationCategory || "",
      foundryReady: true,
      ...(clone(source.metadata || {}) || {}),
    },
  };
  normalized.modSlotsUsed = normalized.installedMods.reduce((sum, mod) => sum + Math.max(1, integer(mod.slotCost, 1)), 0);
  normalized.modSlotsAvailable = Math.max(0, normalized.modSlots - normalized.modSlotsUsed);
  normalized.unusable = checkEquipmentBroken(normalized);
  return normalized;
}

export function normalizeWeaponEntry(entry = {}) {
  const base = normalizeEquipmentEntry({ ...entry, category: EQUIPMENT_CATEGORIES.WEAPON });
  const weaponCategory = normalizeWeaponCategory(firstDefined(entry.weaponCategory, entry.type, officialField(entry, "Categoria"), entry.category, entry.name));
  const damageText = String(firstDefined(entry.damage, entry.dano, officialField(entry, "Dano"), "1d4") || "1d4");
  const parsed = parseDiceFormula(damageText, weaponCategory === "punhos" || weaponCategory === "manoplas" ? "1d4" : "1d4");
  const ammoKind = ammoKindFromWeapon(entry);
  const capacity = capacityFromWeapon(entry);
  const feedSystem = feedSystemFromWeapon(entry, weaponCategory);
  const attackAttribute = String(firstDefined(entry.attack, officialField(entry, "Ataque"), MELEE_WEAPON_CATEGORIES.has(weaponCategory) ? "FOR" : "REF") || "").toUpperCase();
  const attackSkill = weaponCategory === "punhos" || weaponCategory === "manoplas"
    ? "Briga"
    : String(firstDefined(entry.attackSkill, entry.skill, entry.pericia, "") || "");
  const weapon = {
    ...base,
    category: EQUIPMENT_CATEGORIES.WEAPON,
    weaponCategory,
    attackAttribute,
    attackSkill,
    damageFormula: parsed.formula,
    damageDice: { count: parsed.diceCount, sides: parsed.dieSize },
    fixedDamageBonus: parsed.flatBonus,
    damageType: inferDamageType(damageText) || (MELEE_WEAPON_CATEGORIES.has(weaponCategory) ? DAMAGE_TYPES.BLUDGEONING : DAMAGE_TYPES.BALLISTIC),
    rangeMeters: parseRangeMeters(firstDefined(entry.range, entry.alcance, officialField(entry, "Alcance/Área", "Alcance/Area")), 0),
    ammoKind,
    capacity,
    feedSystem,
    fireModes: defaultFireModesForWeapon(weaponCategory, entry),
  };
  weapon.ammoProfile = {
    feedSystem,
    defaultAmmoKind: ammoKind,
    acceptedAmmoKinds: ammoKind === AMMO_KINDS.NONE ? [] : [ammoKind],
    defaultCapacity: capacity,
    fireModes: weapon.fireModes,
    label: feedSystem === FEED_SYSTEMS.NONE ? "Sem municao" : "Alimentacao da arma",
  };
  weapon.ammoState = createWeaponAmmoState(weapon, {
    feedSystem,
    acceptedAmmoKinds: ammoKind === AMMO_KINDS.NONE ? [] : [ammoKind],
    defaultAmmoKind: ammoKind,
    defaultCapacity: capacity,
    fireModes: weapon.fireModes,
    currentAmmo: integer(entry.currentAmmo ?? entry.ammoState?.internalAmmo?.currentAmmo ?? capacity, capacity),
    jammed: weapon.jammed,
  });
  return weapon;
}

export function normalizeArmorEntry(entry = {}) {
  const base = normalizeEquipmentEntry({ ...entry, category: EQUIPMENT_CATEGORIES.ARMOR });
  const armorCategory = normalizeArmorCategory(firstDefined(entry.armorCategory, entry.type, officialField(entry, "Categoria"), entry.name));
  const caSource = firstDefined(entry.ca, entry.CA, entry.armorClass, officialField(entry, "CA", "Defesa", "Bonus CA"), entry.summary);
  const caBonus = Math.max(0, integer(caSource, 0));
  return {
    ...base,
    category: EQUIPMENT_CATEGORIES.ARMOR,
    armorCategory,
    caBonus,
    baseCa: caBonus,
    defenseTags: uniqueStrings(entry.defenseTags || entry.resistances || entry.tags),
  };
}

export function normalizeModEntry(entry = {}) {
  const base = normalizeEquipmentEntry({ ...entry, category: EQUIPMENT_CATEGORIES.MOD });
  const target = normalizeKey(firstDefined(entry.target, entry.targetType, entry.compatibility, entry.type, entry.category));
  return {
    ...base,
    category: EQUIPMENT_CATEGORIES.MOD,
    modCategory: normalizeKey(firstDefined(entry.modCategory, entry.type, entry.category, MOD_CATEGORIES.UNIVERSAL)) || MOD_CATEGORIES.UNIVERSAL,
    targetTypes: uniqueStrings(entry.targetTypes || entry.allowedTargets || (target ? [target] : [MOD_CATEGORIES.UNIVERSAL])),
    slotCost: Math.max(1, integer(firstDefined(entry.slotCost, entry.slots, entry.costSlots, 1), 1)),
    passiveEffects: clone(entry.passiveEffects || entry.effects || {}) || {},
  };
}

export function normalizeAmmoEntry(entry = {}) {
  const base = normalizeEquipmentEntry({ ...entry, category: EQUIPMENT_CATEGORIES.AMMO });
  const ammoKind = normalizeAmmoKind(firstDefined(entry.ammoKind, entry.kind, entry.type, entry.name));
  return {
    ...base,
    category: EQUIPMENT_CATEGORIES.AMMO,
    ammoKind,
    quantity: Math.max(0, integer(entry.quantity ?? entry.currentAmmo, 1)),
    cubeUnits: ammoCubeUnitsFor({ ...entry, ammoKind, quantity: entry.quantity ?? entry.currentAmmo ?? 1 }),
  };
}

export function normalizeMagazineEntry(entry = {}) {
  const magazine = createMagazineInstance(entry, {
    ...entry,
    id: entry.id || entry.uid,
    currentAmmo: entry.currentAmmo ?? entry.quantity ?? entry.capacity,
    capacity: entry.capacity ?? entry.maxAmmo ?? 1,
    loadedAmmoKind: entry.loadedAmmoKind || entry.ammoKind || entry.kind,
  });
  return {
    ...normalizeEquipmentEntry({ ...entry, category: EQUIPMENT_CATEGORIES.MAGAZINE }),
    ...magazine,
    category: EQUIPMENT_CATEGORIES.MAGAZINE,
    cubeUnits: ammoCubeUnitsFor(magazine),
  };
}

export function computeWeaponAttackProfile(weaponInput = {}, actor = {}) {
  const weapon = normalizeWeaponEntry(weaponInput);
  const crack = computeEquipmentCrackPenalty(weapon);
  const jammed = checkWeaponJammed(weapon);
  const ammoSource = weapon.ammoState?.internalAmmo || null;
  const ammoMissing = weapon.feedSystem !== FEED_SYSTEMS.NONE && !weapon.ammoState?.attachedMagazineId && !ammoSource;
  const ammoEmpty = weapon.feedSystem !== FEED_SYSTEMS.NONE && ammoSource && ammoSource.currentAmmo <= 0;
  const modifier = getAttributeModifier(actor, weapon.attackAttribute);
  const passive = numeric(actor.passiveAttackBonus ?? actor.attackBonus, 0) + numeric(weapon.passiveAttackBonus, 0);
  const canAttack = !weapon.unusable && !jammed && !ammoMissing && !ammoEmpty;
  return {
    weaponId: weapon.id,
    weaponName: weapon.name,
    category: weapon.weaponCategory,
    attribute: weapon.attackAttribute,
    skill: weapon.attackSkill,
    modifier,
    passiveBonus: passive,
    totalBonus: modifier + passive + numeric(crack.attackPenalty, 0),
    rangeMeters: weapon.rangeMeters,
    fireModes: weapon.fireModes,
    jammed,
    ammoMissing,
    ammoEmpty,
    unusable: weapon.unusable,
    canAttack,
    blocked: !canAttack,
    blockReason: weapon.unusable
      ? "Equipamento inutilizavel por rachaduras."
      : jammed
        ? "Arma Jammed."
        : ammoMissing
          ? "Sem fonte de municao."
          : ammoEmpty
            ? "Sem municao."
            : "",
    crackPenalty: crack,
  };
}

export function computeWeaponDamageProfile(weaponInput = {}, actor = {}) {
  const weapon = normalizeWeaponEntry(weaponInput);
  const category = weapon.weaponCategory;
  const forMod = getAttributeModifier(actor, "FOR");
  const isUnarmed = category === "punhos" || normalizeKey(weapon.name).includes("punho") || normalizeKey(weapon.name).includes("briga");
  const isKuldrusGauntlet = category === "manoplas" && normalizeKey(weapon.name).includes("kuldrus");
  const baseFormula = isUnarmed || category === "manoplas" ? "1d4" : weapon.damageFormula;
  const parsed = parseDiceFormula(baseFormula, "1d4");
  const attributeBonus = (isUnarmed || isKuldrusGauntlet || MELEE_WEAPON_CATEGORIES.has(category)) ? forMod : 0;
  const specialBonus = isKuldrusGauntlet ? 1 : 0;
  const passiveDamageBonus = numeric(actor.passiveDamageBonus ?? actor.damageBonus, 0) + numeric(weapon.passiveDamageBonus, 0);
  const fixedBonus = parsed.flatBonus + attributeBonus + specialBonus + passiveDamageBonus;
  return {
    weaponId: weapon.id,
    weaponName: weapon.name,
    formula: `${parsed.diceCount}d${parsed.dieSize}${fixedBonus ? (fixedBonus > 0 ? `+${fixedBonus}` : String(fixedBonus)) : ""}`,
    diceCount: parsed.diceCount,
    dieSize: parsed.dieSize,
    fixedBonus,
    attributeBonus,
    passiveDamageBonus,
    damageType: isUnarmed || isKuldrusGauntlet ? DAMAGE_TYPES.BLUDGEONING : weapon.damageType,
    criticalMode: "double-dice",
  };
}

export function computeArmorProfile(armorInput = {}, actor = {}) {
  const armor = normalizeArmorEntry(armorInput);
  const crack = computeEquipmentCrackPenalty(armor);
  const caBase = numeric(actor.baseCa ?? actor.caBase, 0);
  const passiveCaBonus = numeric(actor.passiveCaBonus ?? actor.caBonus, 0) + numeric(armor.passiveCaBonus, 0);
  const effectiveCaBonus = crack.unusable ? 0 : Math.max(0, armor.caBonus - numeric(crack.caPenalty, 0));
  return {
    armorId: armor.id,
    armorName: armor.name,
    armorCategory: armor.armorCategory,
    caBonus: armor.caBonus,
    crackPenalty: crack,
    effectiveCaBonus,
    totalCa: caBase + effectiveCaBonus + passiveCaBonus,
    unusable: Boolean(crack.unusable),
  };
}

export function computeEquipmentCrackPenalty(equipmentInput = {}) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const kind = equipment.category === EQUIPMENT_CATEGORIES.ARMOR ? "armor" : "weapon";
  const effect = crackEffectFor(equipment.cracks, kind);
  return {
    crackLevel: equipment.cracks,
    maxCracks: 5,
    state: effect.unusable || effect.caPenalty >= 999 ? EQUIPMENT_CONDITION_STATES.BROKEN : equipment.conditionState,
    label: effect.label,
    attackPenalty: numeric(effect.attackPenalty, 0),
    caPenalty: numeric(effect.caPenalty, 0) >= 999 ? equipment.caBonus || 999 : numeric(effect.caPenalty, 0),
    jamRisk: Boolean(effect.jamRisk),
    unusable: Boolean(effect.unusable || effect.caPenalty >= 999 || equipment.cracks >= 5),
  };
}

export function applyEquipmentCrack(equipmentInput = {}, amount = 1) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const cracks = bounded(equipment.cracks + Math.max(0, numeric(amount, 1)), 0, 5, equipment.cracks);
  const next = { ...equipment, cracks, crackLevel: cracks, rachaduras: cracks };
  const penalty = computeEquipmentCrackPenalty(next);
  return {
    ...next,
    conditionState: penalty.state,
    unusable: penalty.unusable,
    attackPenalty: penalty.attackPenalty,
    caPenalty: penalty.caPenalty,
  };
}

export function repairEquipmentCrack(equipmentInput = {}, amount = 1) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const cracks = bounded(equipment.cracks - Math.max(0, numeric(amount, 1)), 0, 5, equipment.cracks);
  const next = { ...equipment, cracks, crackLevel: cracks, rachaduras: cracks };
  const penalty = computeEquipmentCrackPenalty(next);
  return {
    ...next,
    conditionState: cracks === 0 ? EQUIPMENT_CONDITION_STATES.INTACT : penalty.state,
    unusable: penalty.unusable,
    attackPenalty: penalty.attackPenalty,
    caPenalty: penalty.caPenalty,
  };
}

export function applyEmergencyRepair(equipmentInput = {}, { temporaryReduction = 1, duration = "scene" } = {}) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const effectiveCracks = bounded(equipment.cracks - Math.max(0, temporaryReduction), 0, 5, equipment.cracks);
  return {
    ...equipment,
    effectiveCracks,
    conditionState: EQUIPMENT_CONDITION_STATES.TEMPORARILY_REPAIRED,
    emergencyRepair: {
      active: true,
      temporaryReduction,
      duration,
      expiresAtPhase: duration === "scene" ? "scene-end" : "gm-review",
    },
  };
}

export function checkEquipmentBroken(equipmentInput = {}) {
  const cracks = numeric(equipmentInput.cracks ?? equipmentInput.crackLevel ?? equipmentInput.rachaduras, 0);
  return Boolean(equipmentInput.unusable || equipmentInput.broken || cracks >= 5);
}

export function checkWeaponJammed(weaponInput = {}) {
  return Boolean(
    weaponInput.jammed
      || weaponInput.status?.jammed
      || weaponInput.ammoState?.status?.jammed
      || arrayOf(weaponInput.conditions).some((condition) => normalizeKey(condition.key || condition.id || condition.name) === "jammed")
  );
}

export function applyJammed(weaponInput = {}, reason = "Erro critico") {
  const weapon = normalizeWeaponEntry(weaponInput);
  return {
    ...weapon,
    jammed: true,
    conditionState: EQUIPMENT_CONDITION_STATES.JAMMED,
    ammoState: {
      ...weapon.ammoState,
      status: { ...(weapon.ammoState?.status || {}), jammed: true },
    },
    jammedReason: reason,
  };
}

export function clearJammedOutsideCombat(weaponInput = {}, { maintenance = true } = {}) {
  const weapon = normalizeWeaponEntry(weaponInput);
  const next = {
    ...weapon,
    jammed: false,
    conditionState: weapon.cracks >= 3 ? EQUIPMENT_CONDITION_STATES.UNSTABLE : EQUIPMENT_CONDITION_STATES.INTACT,
    ammoState: {
      ...weapon.ammoState,
      status: { ...(weapon.ammoState?.status || {}), jammed: false },
    },
    lastMaintenance: maintenance ? new Date().toISOString() : weapon.lastMaintenance || "",
  };
  return next;
}

export function checkModCompatibility(equipmentInput = {}, modInput = {}) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const mod = normalizeModEntry(modInput);
  const equipmentKeys = new Set([
    equipment.category,
    normalizeCategory(equipment.category),
    normalizeKey(equipment.type),
    normalizeKey(equipment.weaponCategory),
    normalizeKey(equipment.armorCategory),
    ...arrayOf(equipment.tags).map(normalizeKey),
  ].filter(Boolean));
  const targetTypes = mod.targetTypes.length ? mod.targetTypes.map(normalizeKey) : [MOD_CATEGORIES.UNIVERSAL];
  const acceptsUniversal = targetTypes.some((target) => target === MOD_CATEGORIES.UNIVERSAL || target === "universal" || target === "qualquer");
  const targetRules = targetTypes.flatMap((target) => MOD_COMPATIBILITY_RULES[target] || [target]).map(normalizeKey);
  const typeMatches = acceptsUniversal || targetRules.some((target) => equipmentKeys.has(target) || [...equipmentKeys].some((key) => key.includes(target) || target.includes(key)));
  const usedSlots = arrayOf(equipment.installedMods).reduce((sum, installed) => sum + Math.max(1, integer(installed.slotCost, 1)), 0);
  const remainingSlots = Math.max(0, integer(equipment.modSlots, 0) - usedSlots);
  const duplicate = arrayOf(equipment.installedMods).some((installed) => String(installed.id || installed.name) === String(mod.id || mod.name));
  if (!typeMatches) return { compatible: false, reason: "Mod incompativel com este tipo de equipamento.", remainingSlots };
  if (duplicate) return { compatible: false, reason: "Mod ja instalado neste equipamento.", remainingSlots };
  if (mod.slotCost > remainingSlots) return { compatible: false, reason: "Sem espaco de mod suficiente.", remainingSlots };
  return { compatible: true, reason: "", remainingSlots };
}

export function installEquipmentMod(equipmentInput = {}, modInput = {}) {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const mod = normalizeModEntry(modInput);
  const compatibility = checkModCompatibility(equipment, mod);
  if (!compatibility.compatible) return { equipment, mod, installed: false, reason: compatibility.reason, compatibility };
  const installedMods = [...arrayOf(equipment.installedMods), mod];
  const next = normalizeEquipmentEntry({ ...equipment, installedMods });
  return { equipment: next, mod, installed: true, reason: "", compatibility: checkModCompatibility(next, mod) };
}

export function removeEquipmentMod(equipmentInput = {}, modId = "") {
  const equipment = normalizeEquipmentEntry(equipmentInput);
  const id = String(modId || "");
  const installedMods = arrayOf(equipment.installedMods).filter((mod) => ![mod.id, mod.name].map(String).includes(id));
  return normalizeEquipmentEntry({ ...equipment, installedMods });
}

function effectNumberFromText(text = "", pattern) {
  const match = String(text || "").match(pattern);
  return match ? numeric(match[1], 0) : 0;
}

export function computeModEffects(mods = []) {
  const totals = {
    attackBonus: 0,
    damageBonus: 0,
    caBonus: 0,
    rangeBonus: 0,
    movementBonus: 0,
    pvBonus: 0,
    cosmosBonus: 0,
    storageSlotsBonus: 0,
    raw: [],
  };
  arrayOf(mods).map(normalizeModEntry).forEach((mod) => {
    const passive = objectOrEmpty(mod.passiveEffects);
    totals.attackBonus += numeric(passive.attackBonus ?? passive.ataque, 0);
    totals.damageBonus += numeric(passive.damageBonus ?? passive.dano, 0);
    totals.caBonus += numeric(passive.caBonus ?? passive.ca, 0);
    totals.rangeBonus += numeric(passive.rangeBonus ?? passive.alcance, 0);
    totals.movementBonus += numeric(passive.movementBonus ?? passive.movimento, 0);
    totals.pvBonus += numeric(passive.pvBonus ?? passive.pv, 0);
    totals.cosmosBonus += numeric(passive.cosmosBonus ?? passive.cosmos, 0);
    totals.storageSlotsBonus += numeric(passive.storageSlotsBonus ?? passive.slots ?? passive.cubos, 0);
    const text = [mod.description, mod.functionText, mod.summary, mod.name].join(" ");
    totals.attackBonus += effectNumberFromText(text, /([+-]\s*\d+)\s*(?:em\s*)?(?:ataque|jogada de ataque)/i);
    totals.damageBonus += effectNumberFromText(text, /([+-]\s*\d+)\s*(?:em\s*)?(?:dano|jogada de dano)/i);
    totals.caBonus += effectNumberFromText(text, /([+-]\s*\d+)\s*(?:em\s*)?(?:ca|defesa)/i);
    totals.raw.push(mod);
  });
  return totals;
}

export function computeItemStorageCost(itemInput = {}) {
  const item = normalizeEquipmentEntry(itemInput);
  if (item.category === EQUIPMENT_CATEGORIES.AMMO || itemInput.ammoKind) return ammoCubeUnitsFor(itemInput);
  if (item.category === EQUIPMENT_CATEGORIES.MAGAZINE || itemInput.capacity !== undefined) return ammoCubeUnitsFor(itemInput);
  const size = normalizeSize(firstDefined(itemInput.inventorySize, itemInput.size, itemInput.porte, itemInput.type));
  const explicit = numeric(itemInput.storageCost ?? itemInput.bulk ?? itemInput.cubeUnits, NaN);
  if (Number.isFinite(explicit)) return Math.max(0, explicit);
  if (size && SIZE_BULK[size] !== undefined) return SIZE_BULK[size];
  if (item.weightKg > 5) return 3;
  if (item.weightKg > 2) return 2;
  return 1;
}

function storageKind(storageInput = {}) {
  const key = normalizeKey(firstDefined(storageInput.storageType, storageInput.kind, storageInput.type, storageInput.name, ""));
  if (key === "cube simple" || key === "cube-simple" || key === "cubo simples") return ITEM_STORAGE_TYPES.CUBE_SIMPLE;
  if (key === "cube cargo" || key === "cube-cargo" || key === "cubo de carga") return ITEM_STORAGE_TYPES.CUBE_CARGO;
  if (key === "cube specialized" || key === "cube-specialized" || key === "cubo especializado") return ITEM_STORAGE_TYPES.CUBE_SPECIALIZED;
  if (key === "cube ammo" || key === "cube-ammo" || key === "cubo de municao") return ITEM_STORAGE_TYPES.CUBE_AMMO;
  if (key.includes("cubo de municao") || key.includes("ammo")) return ITEM_STORAGE_TYPES.CUBE_AMMO;
  if (key.includes("carga")) return ITEM_STORAGE_TYPES.CUBE_CARGO;
  if (key.includes("especial")) return ITEM_STORAGE_TYPES.CUBE_SPECIALIZED;
  if (key.includes("cubo")) return ITEM_STORAGE_TYPES.CUBE_SIMPLE;
  if (key.includes("mochila") || key.includes("backpack")) return ITEM_STORAGE_TYPES.BACKPACK;
  if (key.includes("coldre") || key.includes("holster")) return ITEM_STORAGE_TYPES.HOLSTER;
  if (key.includes("bandoleira") || key.includes("bandolier")) return ITEM_STORAGE_TYPES.BANDOLIER;
  if (key.includes("gancho") || key.includes("hook")) return ITEM_STORAGE_TYPES.HOOK;
  if (key.includes("unassigned") || key.includes("indefin")) return ITEM_STORAGE_TYPES.UNASSIGNED;
  return String(storageInput.storageType || storageInput.kind || ITEM_STORAGE_TYPES.CUBE_SIMPLE);
}

function familyOf(item = {}) {
  const key = normalizeKey(firstDefined(item.family, item.itemFamily, item.type, item.category, item.name));
  if (key.includes("granada")) return "granada";
  if (key.includes("municao") || key.includes("ammo")) return "municao";
  if (key.includes("material")) return "material";
  if (key.includes("arma")) return "arma";
  if (key.includes("armadura")) return "armadura";
  if (key.includes("kit")) return "kit";
  return key;
}

function sameExactItem(a = {}, b = {}) {
  return String(a.definitionId || a.officialId || a.id || a.name) === String(b.definitionId || b.officialId || b.id || b.name);
}

export function checkStorageCompatibility(storageInput = {}, itemInput = {}, contents = []) {
  const kind = storageKind(storageInput);
  const item = normalizeEquipmentEntry(itemInput);
  if (kind === ITEM_STORAGE_TYPES.UNASSIGNED) {
    return { allowed: true, reason: "Item sem local definido gera aviso visual, mas nao bloqueia rolagens.", kind };
  }
  const capacity = Math.max(0, numeric(storageInput.capacity ?? storageInput.maxSlots ?? storageInput.units ?? 1, 1));
  const used = arrayOf(contents).reduce((sum, entry) => sum + computeItemStorageCost(entry), 0);
  const cost = computeItemStorageCost(itemInput);
  if (capacity && used + cost > capacity) return { allowed: false, reason: "Sem espaco disponivel.", kind, used, capacity, cost };

  if (kind === ITEM_STORAGE_TYPES.CUBE_AMMO) {
    const isAmmo = item.category === EQUIPMENT_CATEGORIES.AMMO || item.category === EQUIPMENT_CATEGORIES.MAGAZINE || itemInput.ammoKind || itemInput.capacity !== undefined || itemInput.ammoMagazine;
    return { allowed: Boolean(isAmmo), reason: isAmmo ? "" : "Cubo de municao aceita apenas municao e carregadores.", kind, used, capacity, cost };
  }

  if (kind === ITEM_STORAGE_TYPES.CUBE_CARGO && contents.length > 0) {
    const first = contents[0];
    return {
      allowed: sameExactItem(first, itemInput),
      reason: sameExactItem(first, itemInput) ? "" : "Cubo de carga aceita varias unidades do mesmo item exato.",
      kind,
      used,
      capacity,
      cost,
    };
  }

  if (kind === ITEM_STORAGE_TYPES.CUBE_SPECIALIZED && contents.length > 0) {
    const first = contents[0];
    const sameFamily = familyOf(first) === familyOf(itemInput);
    return {
      allowed: sameFamily,
      reason: sameFamily ? "" : "Cubo especializado aceita itens da mesma familia do primeiro item.",
      kind,
      used,
      capacity,
      cost,
    };
  }

  if (kind === ITEM_STORAGE_TYPES.BACKPACK) {
    const size = normalizeSize(firstDefined(itemInput.inventorySize, itemInput.size, itemInput.porte, "small")) || "small";
    const maxWeight = numeric(storageInput.maxWeightKg ?? storageInput.maxWeight, 10);
    const usedWeight = arrayOf(contents).reduce((sum, entry) => sum + parseWeightKg(entry.weightKg ?? entry.weight), 0);
    const weight = parseWeightKg(itemInput.weightKg ?? itemInput.weight);
    const allowed = ["tiny", "small"].includes(size) && usedWeight + weight <= maxWeight;
    return { allowed, reason: allowed ? "" : "Mochila aceita itens pequenos ate 10 Kg.", kind, usedWeight, maxWeight, cost };
  }

  if (kind === ITEM_STORAGE_TYPES.HOLSTER) {
    const category = normalizeWeaponCategory(firstDefined(itemInput.weaponCategory, itemInput.type, itemInput.category, itemInput.name));
    const size = normalizeSize(firstDefined(itemInput.inventorySize, itemInput.size, itemInput.porte, "small")) || "small";
    const allowed = item.category === EQUIPMENT_CATEGORIES.WEAPON && ["tiny", "small"].includes(size) && !["rifle", "fuzil", "metralhadora", "arma pesada"].includes(category);
    return { allowed, reason: allowed ? "" : "Coldre aceita armas pequenas corpo a corpo ou a distancia.", kind, cost };
  }

  if (kind === ITEM_STORAGE_TYPES.BANDOLIER) {
    const size = normalizeSize(firstDefined(itemInput.inventorySize, itemInput.size, itemInput.porte, "medium")) || "medium";
    const allowed = ["medium", "large"].includes(size) || item.category === EQUIPMENT_CATEGORIES.WEAPON;
    return { allowed, reason: allowed ? "" : "Bandoleira aceita itens medios, grandes e armas carregaveis.", kind, cost };
  }

  if (kind === ITEM_STORAGE_TYPES.HOOK) {
    const allowed = Boolean(itemInput.quickAccess || itemInput.location?.kind === "active" || item.category !== EQUIPMENT_CATEGORIES.CUBE);
    return { allowed, reason: allowed ? "" : "Gancho aceita itens de acesso rapido e suporte de armadura.", kind, cost };
  }

  return { allowed: true, reason: "", kind, used, capacity, cost };
}

export function computeSaleValue(itemInput = {}, { saleValue = null, ratio = 0.5 } = {}) {
  const item = normalizeEquipmentEntry(itemInput);
  const value = saleValue === null || saleValue === undefined || saleValue === ""
    ? Math.floor(item.price * numeric(ratio, 0.5))
    : Math.max(0, integer(saleValue, 0));
  return { item, saleValue: value, editable: true, currency: "Luzentis" };
}

export function computeBuyTransaction({ characterCurrency = 0, item = {}, quantity = 1, destination = ITEM_STORAGE_TYPES.UNASSIGNED, isInitial = false } = {}) {
  const normalized = normalizeEquipmentEntry(item);
  const qty = Math.max(1, integer(quantity, 1));
  const unitPrice = parsePrice(normalized.price, 0);
  const totalCost = isInitial ? 0 : unitPrice * qty;
  const balance = Math.max(0, numeric(characterCurrency, 0));
  const allowed = isInitial || balance >= totalCost;
  return {
    allowed,
    reason: allowed ? "" : "Luzentis insuficientes.",
    item: { ...normalized, quantity: qty, location: { kind: destination } },
    quantity: qty,
    unitPrice,
    totalCost,
    beforeCurrency: balance,
    afterCurrency: allowed ? balance - totalCost : balance,
    currency: "Luzentis",
  };
}

function normalizeRecipe(recipe = {}) {
  return {
    id: String(recipe.id || normalizeId(recipe.name || "recipe", "recipe")),
    name: String(recipe.name || recipe.result?.name || "Receita"),
    action: String(recipe.action || CRAFTING_ACTIONS.CREATE),
    tier: normalizeTier(recipe.tier || recipe.result?.tier || ""),
    requiredMaterials: clone(recipe.requiredMaterials || recipe.materials || {}) || {},
    requiredTools: uniqueStrings(recipe.requiredTools || recipe.tools),
    requiredSkill: String(recipe.requiredSkill || recipe.skill || "Engenharia"),
    difficulty: Math.max(5, integer(recipe.difficulty ?? recipe.cd, 10)),
    workUnits: Math.max(1, integer(recipe.workUnits ?? recipe.timeUnits, 1)),
    cost: Math.max(0, integer(recipe.cost ?? recipe.luzentis, 0)),
    result: clone(recipe.result || {}) || {},
  };
}

export function computeCraftingRecipe(input = {}) {
  const recipe = normalizeRecipe(input);
  return {
    ...recipe,
    result: normalizeEquipmentEntry(recipe.result),
    upgradeCost: recipe.action === CRAFTING_ACTIONS.UPGRADE_TIER ? computeUpgradeTierCost(recipe.tier, recipe.result?.nextTier) : 0,
  };
}

export function validateCraftingAttempt({ recipe = {}, materials = {}, tools = [], currency = 0, skillBonus = 0 } = {}) {
  const normalized = computeCraftingRecipe(recipe);
  const missingMaterials = Object.entries(normalized.requiredMaterials).filter(([id, amount]) => numeric(materials[id], 0) < numeric(amount, 0));
  const missingTools = normalized.requiredTools.filter((tool) => !tools.map(normalizeKey).includes(normalizeKey(tool)));
  const missingCurrency = numeric(currency, 0) < normalized.cost;
  return {
    valid: missingMaterials.length === 0 && missingTools.length === 0 && !missingCurrency,
    recipe: normalized,
    missingMaterials,
    missingTools,
    missingCurrency,
    skillBonus: numeric(skillBonus, 0),
  };
}

export function resolveCraftingAttempt({ recipe = {}, materials = {}, tools = [], currency = 0, skillBonus = 0, roll = 10 } = {}) {
  const validation = validateCraftingAttempt({ recipe, materials, tools, currency, skillBonus });
  if (!validation.valid) return { ...validation, successLevel: "invalid", item: null, materials, currency };
  const total = integer(roll, 0) + numeric(skillBonus, 0);
  const cd = validation.recipe.difficulty;
  let successLevel = "failure";
  if (total >= cd + 10) successLevel = "critical-success";
  else if (total >= cd) successLevel = "success";
  else if (total >= cd - 4) successLevel = "partial";
  const nextMaterials = clone(materials) || {};
  Object.entries(validation.recipe.requiredMaterials).forEach(([id, amount]) => {
    nextMaterials[id] = Math.max(0, numeric(nextMaterials[id], 0) - numeric(amount, 0));
  });
  const nextCurrency = Math.max(0, numeric(currency, 0) - validation.recipe.cost);
  const item = ["success", "critical-success", "partial"].includes(successLevel)
    ? normalizeEquipmentEntry({ ...validation.recipe.result, craftingQuality: successLevel })
    : null;
  return {
    ...validation,
    total,
    cd,
    successLevel,
    item,
    materials: nextMaterials,
    currency: nextCurrency,
    consequence: successLevel === "failure" ? "Materiais consumidos conforme decisao do mestre." : "",
  };
}

export function computeUpgradeTierCost(fromTier = "F", toTier = "") {
  const fromIndex = EQUIPMENT_TIERS.indexOf(normalizeTier(fromTier));
  const toIndex = EQUIPMENT_TIERS.indexOf(normalizeTier(toTier));
  if (fromIndex < 0 || toIndex < 0 || toIndex <= fromIndex) return 0;
  const steps = toIndex - fromIndex;
  return steps * 2500 * (toIndex + 1);
}

export function createEquipmentState(source = {}) {
  const inventory = arrayOf(source.inventory).map((item) => {
    const category = normalizeCategory(item.category || item.reconciliationCategory);
    if (category === EQUIPMENT_CATEGORIES.WEAPON) return normalizeWeaponEntry(item);
    if (category === EQUIPMENT_CATEGORIES.ARMOR) return normalizeArmorEntry(item);
    if (category === EQUIPMENT_CATEGORIES.MOD) return normalizeModEntry(item);
    if (category === EQUIPMENT_CATEGORIES.AMMO) return normalizeAmmoEntry(item);
    if (category === EQUIPMENT_CATEGORIES.MAGAZINE) return normalizeMagazineEntry(item);
    return normalizeEquipmentEntry(item);
  });
  return {
    schemaVersion: EQUIPMENT_SCHEMA_VERSION,
    inventory,
    equipment: clone(source.equipment || {}) || {},
    loadout: clone(source.loadout || {}) || {},
    storage: clone(source.storage || {}) || {},
    cubes: arrayOf(source.cubes).map((item) => normalizeEquipmentEntry({ ...item, category: EQUIPMENT_CATEGORIES.CUBE })),
    backpacks: arrayOf(source.backpacks).map((item) => normalizeEquipmentEntry({ ...item, category: EQUIPMENT_CATEGORIES.STORAGE })),
    holsters: arrayOf(source.holsters).map((item) => normalizeEquipmentEntry({ ...item, category: EQUIPMENT_CATEGORIES.STORAGE })),
    bandoliers: arrayOf(source.bandoliers).map((item) => normalizeEquipmentEntry({ ...item, category: EQUIPMENT_CATEGORIES.STORAGE })),
    hooks: arrayOf(source.hooks).map((item) => normalizeEquipmentEntry({ ...item, category: EQUIPMENT_CATEGORIES.STORAGE })),
    installedMods: arrayOf(source.installedMods || source.mods).map(normalizeModEntry),
    ammoState: clone(source.ammoState || source.ammoCombatState || {}) || {},
    craftingHistory: arrayOf(source.craftingHistory).map((entry) => clone(entry)),
    repairHistory: arrayOf(source.repairHistory).map((entry) => clone(entry)),
    sourceGovernance: clone(source.sourceGovernance || {}) || {},
  };
}

export function serializeEquipmentState(state = {}) {
  return JSON.stringify(hydrateEquipmentState(state));
}

export function hydrateEquipmentState(value = {}) {
  if (typeof value === "string") {
    try {
      return createEquipmentState(JSON.parse(value));
    } catch {
      return createEquipmentState();
    }
  }
  return createEquipmentState(value);
}
