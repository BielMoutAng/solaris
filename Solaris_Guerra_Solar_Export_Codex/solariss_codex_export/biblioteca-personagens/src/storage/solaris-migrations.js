import {
  SOLARIS_SCHEMA_SAVE_VERSION,
} from "../schemas/solaris-schemas.js";
import {
  SOLARIS_EXPORT_APP_VERSION,
  exportSolarisCharacter,
} from "../export/solaris-export-core.js";

export const SOLARIS_STORAGE_SCHEMA = "solaris-storage-v1";
export const SOLARIS_STORAGE_VERSION = 1;

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const arrayOf = (value) => (Array.isArray(value) ? value : []);
const nowIso = (options = {}) => options.now || new Date().toISOString();

function parseJsonSafe(value) {
  if (typeof value !== "string") return { ok: true, value: clone(value), errors: [] };
  try {
    return { ok: true, value: JSON.parse(value), errors: [] };
  } catch (error) {
    return { ok: false, value: null, errors: [`JSON invalido para storage Solaris: ${error.message}`] };
  }
}

function firstObject(...values) {
  return values.find((value) => isObject(value)) || {};
}

function sourceSchemaFor(source) {
  if (Array.isArray(source)) return "legacy-character-array";
  if (source?.schema) return source.schema;
  if (Array.isArray(source?.saved)) return "legacy-local-storage-snapshot";
  if (Array.isArray(source?.characters)) return "legacy-character-list";
  return "unknown-legacy-storage";
}

function characterCandidatesFrom(source) {
  if (Array.isArray(source)) return source;
  if (source?.schema === SOLARIS_STORAGE_SCHEMA) {
    return arrayOf(source.data?.characters || source.characters);
  }
  return arrayOf(source?.data?.characters || source?.characters || source?.saved);
}

export function normalizeStorageCharacter(character = {}, options = {}) {
  const exported = exportSolarisCharacter(character, {
    appVersion: options.appVersion || SOLARIS_EXPORT_APP_VERSION,
    exportedAt: nowIso(options),
  });

  const warnings = [
    ...(exported.validation?.warnings || []),
    ...(exported.warnings || []),
    ...(exported.migration?.warnings || []),
  ];

  return {
    character: exported,
    warnings: [...new Set(warnings)],
  };
}

export function createEmptySolarisStorage(options = {}) {
  const timestamp = nowIso(options);
  return {
    schema: SOLARIS_STORAGE_SCHEMA,
    version: SOLARIS_STORAGE_VERSION,
    meta: {
      appVersion: options.appVersion || SOLARIS_EXPORT_APP_VERSION,
      saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
      createdAt: timestamp,
      updatedAt: timestamp,
      migratedAt: "",
      sourceSchema: SOLARIS_STORAGE_SCHEMA,
    },
    data: {
      characters: [],
      customLibraryContent: {},
      monsterSheets: {},
      shopPriceOverrides: {},
      settings: {},
      campaigns: [],
      backups: [],
    },
    migration: {
      fromLegacy: false,
      warnings: [],
    },
    legacy: options.includeLegacy === false ? null : {},
  };
}

export function migrateSolarisStorageState(input = {}, options = {}) {
  const parsed = parseJsonSafe(input);
  if (!parsed.ok) {
    return {
      ok: false,
      data: null,
      errors: parsed.errors,
      warnings: [],
    };
  }

  const source = parsed.value ?? {};
  const timestamp = nowIso(options);
  const isCurrent = source?.schema === SOLARIS_STORAGE_SCHEMA;
  const sourceData = isCurrent ? firstObject(source.data) : firstObject(source.data, source);
  const characterResults = characterCandidatesFrom(source).map((character) => normalizeStorageCharacter(character, options));
  const charactersById = new Map();

  for (const result of characterResults) {
    charactersById.set(result.character.id, result.character);
  }

  const migrationWarnings = [
    ...characterResults.flatMap((result) => result.warnings),
    ...(isCurrent && source.version === SOLARIS_STORAGE_VERSION ? [] : [`Storage migrado de ${sourceSchemaFor(source)} para ${SOLARIS_STORAGE_SCHEMA}.`]),
  ];

  const meta = firstObject(source.meta);
  const envelope = {
    schema: SOLARIS_STORAGE_SCHEMA,
    version: SOLARIS_STORAGE_VERSION,
    meta: {
      appVersion: options.appVersion || meta.appVersion || SOLARIS_EXPORT_APP_VERSION,
      saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
      createdAt: meta.createdAt || timestamp,
      updatedAt: timestamp,
      migratedAt: isCurrent && source.version === SOLARIS_STORAGE_VERSION ? meta.migratedAt || "" : timestamp,
      sourceSchema: sourceSchemaFor(source),
    },
    data: {
      characters: [...charactersById.values()],
      customLibraryContent: clone(sourceData.customLibraryContent || source.customLibraryContent || {}),
      monsterSheets: clone(sourceData.monsterSheets || source.monsterSheets || {}),
      shopPriceOverrides: clone(sourceData.shopPriceOverrides || source.shopPriceOverrides || {}),
      settings: clone(sourceData.settings || source.settings || {}),
      campaigns: clone(arrayOf(sourceData.campaigns || source.campaigns)),
      backups: clone(arrayOf(sourceData.backups || source.backups)),
    },
    migration: {
      fromLegacy: !isCurrent || source.version !== SOLARIS_STORAGE_VERSION,
      warnings: [...new Set(migrationWarnings)],
    },
    legacy: options.includeLegacy === false ? null : clone(source),
  };

  return {
    ok: true,
    data: envelope,
    errors: [],
    warnings: envelope.migration.warnings,
  };
}

export function migrateSolarisCharacterList(characters = [], options = {}) {
  return migrateSolarisStorageState({ saved: arrayOf(characters) }, options);
}

