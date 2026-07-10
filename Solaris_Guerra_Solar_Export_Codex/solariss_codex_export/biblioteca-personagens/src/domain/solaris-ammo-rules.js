import {
  AMMO_CUBE_BULK,
  AMMO_KINDS,
  FEED_SYSTEMS,
  FIRE_MODE_IDS,
  FIRE_MODES,
  ammoCubeUnitsFor,
  attachMagazineToWeapon,
  createMagazineInstance,
  createWeaponAmmoState,
  detachMagazineFromWeapon,
  fireWeapon,
  loadAmmoIntoMagazine,
  normalizeAmmoKind,
  pumpWeapon,
  reloadInternalWeapon,
  resolveActiveAmmoSource,
  validateAmmoCompatibility,
  validateWeaponCanFire,
} from "./solaris-domain-architecture.js";
import {
  listAllInventoryItems,
  normalizeCharacterInventory,
} from "./solaris-inventory-rules.js";

export {
  AMMO_CUBE_BULK,
  AMMO_KINDS,
  FEED_SYSTEMS,
  FIRE_MODE_IDS,
  FIRE_MODES,
  ammoCubeUnitsFor,
  attachMagazineToWeapon,
  createMagazineInstance,
  createWeaponAmmoState,
  detachMagazineFromWeapon,
  fireWeapon,
  loadAmmoIntoMagazine,
  normalizeAmmoKind,
  pumpWeapon,
  reloadInternalWeapon,
  resolveActiveAmmoSource,
  validateAmmoCompatibility,
  validateWeaponCanFire,
};

export const AMMO_SYSTEM_SCHEMA_VERSION = 1;

const clone = (value) => {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value ?? null));
};

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function positiveInteger(value, fallback = 0) {
  return Math.max(0, Math.floor(numberValue(value, fallback)));
}

function textValue(value, fallback = "") {
  return value === undefined || value === null ? fallback : String(value);
}

function idOf(entry = {}, fallbackPrefix = "ammo") {
  return textValue(
    entry.id
      || entry.uid
      || entry.itemId
      || entry.weaponId
      || entry.magazineId
      || entry.ammoStackId,
    `${fallbackPrefix}-${textValue(entry.name, "entry").toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "entry"}`
  );
}

function uniqueById(entries = []) {
  const seen = new Set();
  return entries.filter((entry) => {
    const id = idOf(entry);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function locationOf(entry = {}) {
  return isObject(entry.location) ? clone(entry.location) : {};
}

function isAmmoEntry(entry = {}) {
  const category = textValue(entry.category || entry.type).toLowerCase();
  return Boolean(entry.ammoStack || entry.ammoKind || category === "ammo" || category.includes("municao"));
}

function isMagazineEntry(entry = {}) {
  const category = textValue(entry.category || entry.type).toLowerCase();
  return Boolean(entry.ammoMagazine || category === "magazine" || category.includes("carregador"));
}

function isWeaponEntry(entry = {}) {
  const category = textValue(entry.category || entry.type).toLowerCase();
  return Boolean(entry.ammoState || entry.ammoProfile || category === "weapon" || category.includes("arma"));
}

function normalizeWeaponAmmoState(weapon = {}) {
  const state = isObject(weapon.ammoState) ? clone(weapon.ammoState) : {};
  const base = createWeaponAmmoState(weapon, {
    ...state,
    currentAmmo: state.internalAmmo?.currentAmmo,
    ammoKind: state.internalAmmo?.ammoKind,
  });
  const acceptedAmmoKinds = arrayOf(state.acceptedAmmoKinds || base.acceptedAmmoKinds)
    .map(normalizeAmmoKind)
    .filter((kind) => kind !== AMMO_KINDS.NONE);
  const internalCapacity = positiveInteger(state.internalAmmo?.capacity, base.internalAmmo?.capacity || 0);
  return {
    ...base,
    ...state,
    schemaVersion: AMMO_SYSTEM_SCHEMA_VERSION,
    acceptedAmmoKinds,
    compatibleMagazineTemplateIds: arrayOf(state.compatibleMagazineTemplateIds || base.compatibleMagazineTemplateIds).map(String),
    status: { ...(base.status || {}), ...(state.status || {}) },
    internalAmmo: state.internalAmmo || base.internalAmmo
      ? {
          ...(base.internalAmmo || {}),
          ...(state.internalAmmo || {}),
          ammoKind: normalizeAmmoKind(state.internalAmmo?.ammoKind || base.internalAmmo?.ammoKind || base.defaultAmmoKind),
          capacity: internalCapacity,
          currentAmmo: Math.min(internalCapacity, Math.max(0, positiveInteger(state.internalAmmo?.currentAmmo, base.internalAmmo?.currentAmmo || 0))),
        }
      : null,
    fireModes: arrayOf(state.fireModes || base.fireModes).filter((mode) => FIRE_MODES[mode]),
  };
}

export function normalizeAmmoStack(entry = {}) {
  const source = isObject(entry.ammoStack) ? entry.ammoStack : entry;
  const ammoKind = normalizeAmmoKind(source.ammoKind || source.kind || entry.ammoKind || entry.kind || entry.type || entry.name);
  const quantity = Math.max(0, positiveInteger(source.quantity ?? entry.quantity ?? source.currentAmmo ?? entry.currentAmmo, 0));
  return {
    id: idOf(source.id ? source : entry, "ammo"),
    itemId: textValue(entry.itemId || source.itemId, ""),
    name: textValue(entry.name || source.name, ammoKind === AMMO_KINDS.NONE ? "Municao" : `Municao ${ammoKind}`),
    category: "ammo",
    ammoKind,
    quantity,
    cubeUnits: ammoCubeUnitsFor({ category: "ammo", ammoKind, quantity }),
    location: locationOf(entry),
    legacy: clone(entry.legacy || {}),
  };
}

export function normalizeAmmoMagazine(entry = {}) {
  const source = isObject(entry.ammoMagazine) ? entry.ammoMagazine : entry;
  const magazine = createMagazineInstance(source, {
    ...source,
    id: source.id || entry.id || entry.uid,
    templateId: source.templateId || entry.templateId,
    name: source.name || entry.name,
    capacity: source.capacity ?? entry.capacity ?? entry.maxAmmo ?? 1,
    currentAmmo: source.currentAmmo ?? entry.currentAmmo ?? entry.quantity ?? 0,
    loadedAmmoKind: source.loadedAmmoKind || entry.loadedAmmoKind || source.ammoKind || entry.ammoKind || entry.kind,
  });
  return {
    ...magazine,
    itemId: textValue(entry.itemId || source.itemId, ""),
    location: locationOf(entry),
    cubeUnits: ammoCubeUnitsFor({ ...magazine, category: "magazine" }),
    legacy: clone(entry.legacy || {}),
  };
}

export function normalizeLoadedWeapon(weapon = {}, magazines = []) {
  const normalizedWeapon = {
    ...clone(weapon),
    id: idOf(weapon, "weapon"),
  };
  const ammoState = normalizeWeaponAmmoState(normalizedWeapon);
  const source = resolveActiveAmmoSource({ ...normalizedWeapon, ammoState }, magazines);
  const hasInfiniteAmmo = source.currentAmmo === Number.POSITIVE_INFINITY;
  const currentAmmo = hasInfiniteAmmo ? null : Math.max(0, positiveInteger(source.currentAmmo, 0));
  const capacity = hasInfiniteAmmo ? null : Math.max(0, positiveInteger(source.capacity, 0));
  return {
    id: normalizedWeapon.id,
    weaponId: normalizedWeapon.id,
    itemId: textValue(normalizedWeapon.itemId, ""),
    name: textValue(normalizedWeapon.name, "Arma Solaris"),
    category: "weapon",
    schemaVersion: AMMO_SYSTEM_SCHEMA_VERSION,
    feedSystem: ammoState.feedSystem,
    acceptedAmmoKinds: arrayOf(ammoState.acceptedAmmoKinds),
    defaultAmmoKind: ammoState.defaultAmmoKind,
    fireModes: arrayOf(ammoState.fireModes),
    attachedMagazineId: textValue(ammoState.attachedMagazineId, ""),
    internalAmmo: ammoState.internalAmmo ? clone(ammoState.internalAmmo) : null,
    source: {
      kind: source.kind,
      label: source.label,
      missing: Boolean(source.missing),
      currentAmmo,
      capacity,
      ammoKind: source.ammoKind || ammoState.defaultAmmoKind,
      magazineId: source.magazine?.id || "",
    },
    status: clone(ammoState.status || {}),
    requiresPumpAfterShot: Boolean(ammoState.requiresPumpAfterShot),
    canFire: ammoState.feedSystem === FEED_SYSTEMS.NONE || (!source.missing && (hasInfiniteAmmo || currentAmmo > 0)),
    legacy: clone(normalizedWeapon.legacy || {}),
  };
}

export function normalizeCharacterAmmoSystem(character = {}) {
  const normalizedCharacter = normalizeCharacterInventory(character);
  const source = isObject(normalizedCharacter.ammoSystem) ? normalizedCharacter.ammoSystem : {};
  const allItems = listAllInventoryItems(normalizedCharacter);
  const equipmentWeapons = arrayOf(normalizedCharacter.equipment?.weapons);
  const itemWeapons = allItems.filter(isWeaponEntry);
  const magazines = uniqueById([
    ...arrayOf(source.magazines).map(normalizeAmmoMagazine),
    ...allItems.filter(isMagazineEntry).map(normalizeAmmoMagazine),
  ]);
  const ammoStacks = uniqueById([
    ...arrayOf(source.ammoStacks).map(normalizeAmmoStack),
    ...allItems.filter(isAmmoEntry).filter((entry) => !isMagazineEntry(entry)).map(normalizeAmmoStack),
  ]);
  const weapons = uniqueById([
    ...equipmentWeapons,
    ...itemWeapons,
    ...arrayOf(source.loadedWeapons),
  ].filter(isWeaponEntry));
  const loadedWeapons = weapons.map((weapon) => normalizeLoadedWeapon(weapon, magazines));
  return {
    ...normalizedCharacter,
    ammoSystem: {
      ...clone(source),
      schemaVersion: AMMO_SYSTEM_SCHEMA_VERSION,
      magazines,
      ammoStacks,
      loadedWeapons,
      summary: {
        weapons: loadedWeapons.length,
        magazines: magazines.length,
        ammoStacks: ammoStacks.length,
        totalAmmo: ammoStacks.reduce((sum, stack) => sum + stack.quantity, 0)
          + magazines.reduce((sum, magazine) => sum + magazine.currentAmmo, 0),
      },
    },
  };
}

function findAmmoWeapon(character = {}, weaponId = "") {
  const normalized = normalizeCharacterAmmoSystem(character);
  const id = String(weaponId || "");
  const equipmentWeapon = arrayOf(normalized.equipment?.weapons).find((weapon) => [weapon.id, weapon.uid, weapon.itemId].map(String).includes(id));
  if (equipmentWeapon) return { character: normalized, weapon: equipmentWeapon };
  const inventoryWeapon = listAllInventoryItems(normalized).find((weapon) => isWeaponEntry(weapon) && [weapon.id, weapon.uid, weapon.itemId].map(String).includes(id));
  if (inventoryWeapon) return { character: normalized, weapon: inventoryWeapon };
  throw new Error("Arma nao encontrada no inventario da ficha.");
}

function findAmmoMagazine(character = {}, magazineId = "") {
  const normalized = normalizeCharacterAmmoSystem(character);
  const id = String(magazineId || "");
  const magazine = arrayOf(normalized.ammoSystem?.magazines).find((entry) => [entry.id, entry.itemId].map(String).includes(id));
  if (!magazine) throw new Error("Carregador nao encontrado no inventario da ficha.");
  return { character: normalized, magazine };
}

function findAmmoStack(character = {}, ammoStackId = "") {
  const normalized = normalizeCharacterAmmoSystem(character);
  const id = String(ammoStackId || "");
  const stack = arrayOf(normalized.ammoSystem?.ammoStacks).find((entry) => [entry.id, entry.itemId].map(String).includes(id));
  if (!stack) throw new Error("Pilha de municao nao encontrada no inventario da ficha.");
  return { character: normalized, stack };
}

function replaceById(entries = [], updated = {}) {
  const id = idOf(updated);
  let replaced = false;
  const next = arrayOf(entries).map((entry) => {
    if ([entry.id, entry.uid, entry.itemId].map(String).includes(id)) {
      replaced = true;
      return { ...clone(entry), ...clone(updated), id: entry.id || updated.id };
    }
    return clone(entry);
  });
  return replaced ? next : [...next, clone(updated)];
}

function replaceWeaponInCharacter(character = {}, weapon = {}) {
  const next = clone(character) || {};
  next.equipment = {
    ...(next.equipment || {}),
    weapons: replaceById(next.equipment?.weapons || [], weapon),
  };
  return next;
}

function withAmmoSystem(character = {}, patch = {}) {
  const normalized = normalizeCharacterAmmoSystem(character);
  const ammoSystem = {
    ...(normalized.ammoSystem || {}),
    ...patch,
  };
  return normalizeCharacterAmmoSystem({ ...normalized, ammoSystem });
}

export function attachMagazineToCharacterWeapon(character = {}, weaponId = "", magazineId = "") {
  const { character: normalized, weapon } = findAmmoWeapon(character, weaponId);
  const magazine = findAmmoMagazine(normalized, magazineId).magazine;
  const result = attachMagazineToWeapon(weapon, magazine);
  const withWeapon = replaceWeaponInCharacter(normalized, result.weapon);
  const magazines = replaceById(normalized.ammoSystem.magazines, result.magazine);
  return {
    character: withAmmoSystem(withWeapon, { magazines }),
    weapon: result.weapon,
    magazine: result.magazine,
  };
}

export function detachMagazineFromCharacterWeapon(character = {}, weaponId = "") {
  const { character: normalized, weapon } = findAmmoWeapon(character, weaponId);
  const result = detachMagazineFromWeapon(weapon, normalized.ammoSystem.magazines);
  const withWeapon = replaceWeaponInCharacter(normalized, result.weapon);
  return {
    character: withAmmoSystem(withWeapon, { magazines: result.magazines }),
    weapon: result.weapon,
    magazines: result.magazines,
    detachedMagazineId: result.detachedMagazineId,
  };
}

export function loadMagazineFromCharacterAmmo(character = {}, magazineId = "", ammoStackId = "", requestedAmount = Number.POSITIVE_INFINITY) {
  const { character: normalized, magazine } = findAmmoMagazine(character, magazineId);
  const stack = findAmmoStack(normalized, ammoStackId).stack;
  const result = loadAmmoIntoMagazine(magazine, stack, requestedAmount);
  const magazines = replaceById(normalized.ammoSystem.magazines, result.magazine);
  const ammoStacks = replaceById(normalized.ammoSystem.ammoStacks, result.ammoStack);
  return {
    character: withAmmoSystem(normalized, { magazines, ammoStacks }),
    magazine: result.magazine,
    ammoStack: result.ammoStack,
    loaded: result.loaded,
  };
}

export function reloadCharacterWeaponInternal(character = {}, weaponId = "", ammoStackId = "", requestedAmount = Number.POSITIVE_INFINITY) {
  const { character: normalized, weapon } = findAmmoWeapon(character, weaponId);
  const stack = findAmmoStack(normalized, ammoStackId).stack;
  const result = reloadInternalWeapon(weapon, stack, requestedAmount);
  const withWeapon = replaceWeaponInCharacter(normalized, result.weapon);
  const ammoStacks = replaceById(normalized.ammoSystem.ammoStacks, result.ammoStack);
  return {
    character: withAmmoSystem(withWeapon, { ammoStacks }),
    weapon: result.weapon,
    ammoStack: result.ammoStack,
    loaded: result.loaded,
  };
}

export function fireCharacterWeapon(character = {}, weaponId = "", modeId = FIRE_MODE_IDS.SINGLE) {
  const { character: normalized, weapon } = findAmmoWeapon(character, weaponId);
  const result = fireWeapon(weapon, { magazines: normalized.ammoSystem.magazines, modeId });
  const withWeapon = replaceWeaponInCharacter(normalized, result.weapon);
  return {
    character: withAmmoSystem(withWeapon, { magazines: result.magazines }),
    weapon: result.weapon,
    magazines: result.magazines,
    consumed: result.consumed,
    mode: result.mode,
    source: result.source,
    message: result.message,
  };
}

export function pumpCharacterWeapon(character = {}, weaponId = "") {
  const { character: normalized, weapon } = findAmmoWeapon(character, weaponId);
  const updatedWeapon = pumpWeapon(weapon);
  const withWeapon = replaceWeaponInCharacter(normalized, updatedWeapon);
  return {
    character: withAmmoSystem(withWeapon),
    weapon: updatedWeapon,
  };
}

export function getCharacterAmmoSummary(character = {}) {
  const normalized = normalizeCharacterAmmoSystem(character);
  const system = normalized.ammoSystem;
  return {
    schemaVersion: AMMO_SYSTEM_SCHEMA_VERSION,
    weapons: system.loadedWeapons.length,
    magazines: system.magazines.length,
    ammoStacks: system.ammoStacks.length,
    totalLooseAmmo: system.ammoStacks.reduce((sum, stack) => sum + stack.quantity, 0),
    totalLoadedAmmo: system.loadedWeapons.reduce((sum, weapon) => sum + (weapon.source.currentAmmo || 0), 0),
    missingMagazineWeapons: system.loadedWeapons.filter((weapon) => weapon.source.missing).length,
  };
}
