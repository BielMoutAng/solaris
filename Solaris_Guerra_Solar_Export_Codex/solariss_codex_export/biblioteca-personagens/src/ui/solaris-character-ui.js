import {
  SOLARIS_OFFICIAL_ATTRIBUTES,
} from "../schemas/solaris-schemas.js";
import {
  normalizeActiveCharacter,
  validateActiveCharacter,
} from "./solaris-character-state.js";
import {
  getCharacterInventorySummary,
  listAllInventoryItems,
  listBandolierItems,
  listCubeContents,
  listHolsterItems,
  listHookItems,
} from "../domain/solaris-inventory-rules.js";
import {
  getCharacterAmmoSummary,
  normalizeCharacterAmmoSystem,
} from "../domain/solaris-ammo-rules.js";

const ATTRIBUTE_LABELS = Object.freeze({
  for: "FOR",
  ref: "REF",
  con: "CON",
  int: "INT",
  pre: "PRE",
  men: "MEN",
});

const ATTRIBUTE_NAMES = Object.freeze({
  for: "Forca",
  ref: "Reflexo",
  con: "Constituicao",
  int: "Intelecto",
  pre: "Presenca",
  men: "Mentalidade",
});

const RESOURCE_LABELS = Object.freeze({
  pv: "PV",
  stress: "Estresse",
  cosmos: "Cosmos",
});

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeForView(character = null) {
  return normalizeActiveCharacter(character);
}

function percent(value, max) {
  const resolvedMax = numberValue(max, 0);
  if (resolvedMax <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((numberValue(value, 0) / resolvedMax) * 100)));
}

export function getCharacterDisplayName(character = null, fallback = "Personagem sem nome") {
  const normalized = normalizeForView(character);
  const explicitName = normalized?.legacy?.name || normalized?.identity?.name || "";
  if (!explicitName || explicitName === "Personagem Solaris") return fallback;
  return explicitName;
}

export function getCharacterSummary(character = null) {
  const normalized = normalizeForView(character);
  if (!normalized) {
    return {
      id: "",
      name: "Personagem sem nome",
      player: "",
      race: "",
      profession: "",
      level: 1,
      xp: 0,
    };
  }
  return {
    id: normalized.id,
    name: getCharacterDisplayName(normalized),
    player: normalized.identity.player,
    race: normalized.identity.race,
    raceName: normalized.identity.raceName,
    profession: normalized.identity.profession,
    professionName: normalized.identity.professionName,
    level: numberValue(normalized.identity.level, 1),
    xp: numberValue(normalized.identity.xp, 0),
  };
}

export function getCharacterAttributeViewModel(character = null) {
  const normalized = normalizeForView(character);
  const attributes = normalized?.attributes || {};
  return SOLARIS_OFFICIAL_ATTRIBUTES.map((key) => ({
    key,
    label: ATTRIBUTE_LABELS[key] || key.toUpperCase(),
    name: ATTRIBUTE_NAMES[key] || key,
    value: numberValue(attributes[key], 0),
  }));
}

export function getCharacterResourceViewModel(character = null) {
  const normalized = normalizeForView(character);
  const resources = normalized?.resources || {};
  return ["pv", "stress", "cosmos"].map((key) => {
    const track = resources[key] || {};
    const value = numberValue(track.value, 0);
    const max = numberValue(track.max, 0);
    return {
      key,
      label: RESOURCE_LABELS[key] || key,
      value,
      max,
      text: `${value}/${max}`,
      percent: percent(value, max),
    };
  });
}

export function getCharacterCombatViewModel(character = null) {
  const normalized = normalizeForView(character);
  const derived = normalized?.derived || {};
  return {
    ca: numberValue(derived.ca, 0),
    movement: numberValue(derived.movement, 0),
    initiative: numberValue(derived.initiative, 0),
    baseDice: String(derived.baseDice || "3d6"),
    conditions: normalized?.combat?.conditions || [],
    activeEffects: normalized?.combat?.activeEffects || [],
  };
}

export function getCharacterEquipmentSummary(character = null) {
  const normalized = normalizeForView(character);
  const equipment = normalized?.equipment || {};
  const inventory = normalized?.inventory || {};
  return {
    armor: equipment.armor || null,
    weapons: equipment.weapons || [],
    activeWeaponId: equipment.activeWeaponId || "",
    equippedItems: equipment.equippedItems || [],
    hooks: equipment.hooks || [],
    holsters: equipment.holsters || [],
    bandoliers: equipment.bandoliers || [],
    looseItems: inventory.looseItems || [],
    cubes: inventory.cubes || [],
    credits: numberValue(inventory.credits, 0),
  };
}

export function getCharacterInventoryViewModel(character = null) {
  const normalized = normalizeForView(character);
  const inventory = normalized?.inventory || {};
  return {
    looseItems: inventory.looseItems || [],
    unassigned: inventory.unassigned || [],
    allItems: listAllInventoryItems(normalized),
    credits: numberValue(inventory.credits, 0),
    summary: getCharacterInventorySummary(normalized),
  };
}

export function getCharacterEquipmentViewModel(character = null) {
  const normalized = normalizeForView(character);
  const equipment = normalized?.equipment || {};
  const activeWeaponId = equipment.activeWeaponId || "";
  const weapons = equipment.weapons || [];
  return {
    armor: equipment.armor || null,
    weapons,
    activeWeaponId,
    activeWeapon: weapons.find((weapon) => [weapon.id, weapon.uid, weapon.itemId].includes(activeWeaponId)) || null,
    equippedItems: equipment.equippedItems || [],
    hooks: equipment.hooks || [],
    holsters: equipment.holsters || [],
    bandoliers: equipment.bandoliers || [],
  };
}

export function getCubeViewModels(character = null) {
  const normalized = normalizeForView(character);
  const cubes = normalized?.inventory?.cubes || [];
  return cubes.map((cube) => {
    const contents = listCubeContents(normalized, cube.id);
    const capacity = numberValue(cube.capacity, 0);
    return {
      ...cube,
      contents,
      used: contents.length,
      capacity,
      percent: capacity > 0 ? percent(contents.length, capacity) : 0,
    };
  });
}

export function getQuickAccessViewModel(character = null) {
  const normalized = normalizeForView(character);
  return {
    hooks: listHookItems(normalized),
    holsters: listHolsterItems(normalized),
    bandoliers: listBandolierItems(normalized),
  };
}

export function getCharacterStorageViewModel(character = null) {
  const normalized = normalizeForView(character);
  return {
    cubes: getCubeViewModels(normalized),
    backpacks: normalized?.inventory?.backpacks || [],
    quickAccess: getQuickAccessViewModel(normalized),
    summary: getCharacterInventorySummary(normalized),
  };
}

export function getCharacterAmmoViewModel(character = null) {
  const normalized = normalizeCharacterAmmoSystem(normalizeForView(character) || {});
  const ammoSystem = normalized?.ammoSystem || {};
  return {
    schemaVersion: ammoSystem.schemaVersion || 1,
    weapons: ammoSystem.loadedWeapons || [],
    magazines: ammoSystem.magazines || [],
    ammoStacks: ammoSystem.ammoStacks || [],
    summary: getCharacterAmmoSummary(normalized),
  };
}

export function getCharacterValidationMessages(character = null) {
  const validation = validateActiveCharacter(character);
  return {
    ok: validation.ok,
    errors: validation.errors || [],
    warnings: validation.warnings || [],
  };
}
