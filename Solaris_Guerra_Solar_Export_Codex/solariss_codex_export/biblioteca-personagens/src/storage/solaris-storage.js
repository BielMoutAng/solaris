import {
  SOLARIS_STORAGE_SCHEMA,
  createEmptySolarisStorage,
  migrateSolarisStorageState,
  normalizeStorageCharacter,
} from "./solaris-migrations.js";

export const SOLARIS_STORAGE_ROOT_KEY = "solaris.storage.v1";
export const SOLARIS_LEGACY_STORAGE_KEYS = Object.freeze({
  characters: "solaris.character.library.v1",
  customLibraryContent: "solaris.custom.content.library.v1",
  shopPriceOverrides: "solaris.shop.price.overrides.v1",
  monsterSheets: "solaris.monster.library.v1",
});

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

function resolveAdapter(adapter = globalThis.localStorage) {
  if (!adapter || typeof adapter.getItem !== "function" || typeof adapter.setItem !== "function") {
    throw new Error("Storage Solaris requer localStorage ou adaptador compativel.");
  }
  return adapter;
}

function parseLegacyKey(adapter, key, fallback) {
  const raw = adapter.getItem(key);
  if (!raw) return clone(fallback);
  try {
    return JSON.parse(raw);
  } catch {
    return clone(fallback);
  }
}

function nowIso(options = {}) {
  return options.now || new Date().toISOString();
}

export function createMemoryStorage(initial = {}) {
  const entries = Object.entries(initial).map(([key, value]) => [String(key), String(value)]);
  const state = new Map(entries);
  return {
    get length() {
      return state.size;
    },
    key(index) {
      return [...state.keys()][index] ?? null;
    },
    getItem(key) {
      const resolved = String(key);
      return state.has(resolved) ? state.get(resolved) : null;
    },
    setItem(key, value) {
      state.set(String(key), String(value));
    },
    removeItem(key) {
      state.delete(String(key));
    },
    clear() {
      state.clear();
    },
    dump() {
      return Object.fromEntries(state.entries());
    },
  };
}

export function readLegacySolarisStorageSnapshot(adapterInput = globalThis.localStorage) {
  const adapter = resolveAdapter(adapterInput);
  return {
    saved: parseLegacyKey(adapter, SOLARIS_LEGACY_STORAGE_KEYS.characters, []),
    customLibraryContent: parseLegacyKey(adapter, SOLARIS_LEGACY_STORAGE_KEYS.customLibraryContent, {}),
    shopPriceOverrides: parseLegacyKey(adapter, SOLARIS_LEGACY_STORAGE_KEYS.shopPriceOverrides, {}),
    monsterSheets: parseLegacyKey(adapter, SOLARIS_LEGACY_STORAGE_KEYS.monsterSheets, {}),
  };
}

export function loadSolarisStorage(options = {}) {
  const adapter = resolveAdapter(options.adapter);
  const key = options.key || SOLARIS_STORAGE_ROOT_KEY;
  const raw = adapter.getItem(key);
  const source = raw || readLegacySolarisStorageSnapshot(adapter);
  const migration = migrateSolarisStorageState(source, options);

  if (migration.ok && options.persistMigration) {
    adapter.setItem(key, JSON.stringify(migration.data));
  }

  return {
    ...migration,
    source: raw ? "root" : "legacy",
    key,
  };
}

export function saveSolarisStorage(storageState = createEmptySolarisStorage(), options = {}) {
  const adapter = resolveAdapter(options.adapter);
  const key = options.key || SOLARIS_STORAGE_ROOT_KEY;
  const migration = migrateSolarisStorageState(storageState, options);
  if (!migration.ok) return { ...migration, key };

  adapter.setItem(key, JSON.stringify(migration.data));
  return { ...migration, key, source: "root" };
}

export function listSolarisCharacters(options = {}) {
  const loaded = loadSolarisStorage(options);
  if (!loaded.ok) return { ...loaded, characters: [] };
  return {
    ...loaded,
    characters: loaded.data.data.characters,
  };
}

export function loadSolarisCharacter(characterId, options = {}) {
  const loaded = listSolarisCharacters(options);
  const character = loaded.characters.find((entry) => entry.id === characterId) || null;
  return {
    ...loaded,
    character,
  };
}

export function saveSolarisCharacter(character, options = {}) {
  const loaded = loadSolarisStorage(options);
  if (!loaded.ok) return { ...loaded, character: null };

  const normalized = normalizeStorageCharacter(character, options);
  const characters = loaded.data.data.characters.filter((entry) => entry.id !== normalized.character.id);
  characters.push(normalized.character);

  const next = {
    ...loaded.data,
    meta: {
      ...loaded.data.meta,
      updatedAt: nowIso(options),
    },
    data: {
      ...loaded.data.data,
      characters,
    },
    migration: {
      ...loaded.data.migration,
      warnings: [...new Set([...(loaded.data.migration?.warnings || []), ...normalized.warnings])],
    },
  };
  const saved = saveSolarisStorage(next, options);

  return {
    ...saved,
    character: normalized.character,
  };
}

export function removeSolarisCharacter(characterId, options = {}) {
  const loaded = loadSolarisStorage(options);
  if (!loaded.ok) return { ...loaded, removed: false };

  const before = loaded.data.data.characters.length;
  const next = {
    ...loaded.data,
    meta: {
      ...loaded.data.meta,
      updatedAt: nowIso(options),
    },
    data: {
      ...loaded.data.data,
      characters: loaded.data.data.characters.filter((entry) => entry.id !== characterId),
    },
  };
  const saved = saveSolarisStorage(next, options);

  return {
    ...saved,
    removed: next.data.characters.length !== before,
  };
}

export function clearSolarisStorage(options = {}) {
  const adapter = resolveAdapter(options.adapter);
  const key = options.key || SOLARIS_STORAGE_ROOT_KEY;
  adapter.removeItem(key);
  return {
    ok: true,
    schema: SOLARIS_STORAGE_SCHEMA,
    key,
  };
}

