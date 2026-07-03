import {
  SOLARIS_EXPORT_APP_VERSION,
} from "../export/solaris-export-core.js";
import {
  SOLARIS_STORAGE_SCHEMA,
  migrateSolarisStorageState,
} from "./solaris-migrations.js";

export const SOLARIS_BACKUP_SCHEMA = "solaris-backup-v1";
export const SOLARIS_BACKUP_VERSION = 1;

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

function nowIso(options = {}) {
  return options.now || new Date().toISOString();
}

function sortForStableJson(value) {
  if (Array.isArray(value)) return value.map(sortForStableJson);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortForStableJson(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(sortForStableJson(value));
}

export function createSolarisChecksum(value) {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function parseBackup(value) {
  if (typeof value !== "string") return { ok: true, value: clone(value), errors: [] };
  try {
    return { ok: true, value: JSON.parse(value), errors: [] };
  } catch (error) {
    return { ok: false, value: null, errors: [`JSON invalido para backup Solaris: ${error.message}`] };
  }
}

export function createSolarisBackup(storageState = {}, options = {}) {
  const migrated = migrateSolarisStorageState(storageState, options);
  if (!migrated.ok) {
    return {
      ok: false,
      backup: null,
      errors: migrated.errors,
      warnings: migrated.warnings,
    };
  }

  const timestamp = nowIso(options);
  const payload = {
    storage: migrated.data,
  };
  const backup = {
    schema: SOLARIS_BACKUP_SCHEMA,
    version: SOLARIS_BACKUP_VERSION,
    id: options.id || `backup-${timestamp.replace(/[^0-9]/g, "")}`,
    meta: {
      appVersion: options.appVersion || SOLARIS_EXPORT_APP_VERSION,
      saveVersion: SOLARIS_BACKUP_VERSION,
      createdAt: timestamp,
      reason: options.reason || "manual",
    },
    payload,
    checksum: createSolarisChecksum(payload),
    warnings: migrated.warnings,
    legacy: options.includeLegacy === false ? null : clone(storageState),
  };

  return {
    ok: true,
    backup,
    errors: [],
    warnings: backup.warnings,
  };
}

export function createSolarisFullBackup(storageState = {}, options = {}) {
  return createSolarisBackup(storageState, {
    ...options,
    reason: options.reason || "pre-migration",
  });
}

export function restoreSolarisBackup(backupInput = {}, options = {}) {
  const parsed = parseBackup(backupInput);
  if (!parsed.ok) {
    return {
      ok: false,
      storage: null,
      errors: parsed.errors,
      warnings: [],
    };
  }

  const backup = parsed.value;
  if (backup?.schema !== SOLARIS_BACKUP_SCHEMA) {
    return {
      ok: false,
      storage: null,
      errors: [`Backup deve usar schema ${SOLARIS_BACKUP_SCHEMA}.`],
      warnings: [],
    };
  }

  const warnings = [...(backup.warnings || [])];
  const expectedChecksum = createSolarisChecksum(backup.payload || {});
  if (options.validateChecksum !== false && backup.checksum !== expectedChecksum) {
    warnings.push("Checksum do backup nao confere; dados foram restaurados em modo cauteloso.");
  }

  const migrated = migrateSolarisStorageState(backup.payload?.storage || {}, options);
  return {
    ok: migrated.ok,
    storage: migrated.data,
    schema: migrated.data?.schema || SOLARIS_STORAGE_SCHEMA,
    errors: migrated.errors,
    warnings: [...new Set([...warnings, ...migrated.warnings])],
  };
}

export function exportSolarisBackupJson(storageState = {}, options = {}) {
  const backup = createSolarisBackup(storageState, options);
  if (!backup.ok) return backup;
  return {
    ...backup,
    json: JSON.stringify(backup.backup, null, 2),
  };
}

export function importSolarisBackupJson(json, options = {}) {
  return restoreSolarisBackup(json, options);
}

export function rotateSolarisBackups(backups = [], limit = 10) {
  return [...backups]
    .filter((backup) => backup?.schema === SOLARIS_BACKUP_SCHEMA)
    .sort((a, b) => String(b.meta?.createdAt || "").localeCompare(String(a.meta?.createdAt || "")))
    .slice(0, Math.max(0, Number(limit) || 0));
}
