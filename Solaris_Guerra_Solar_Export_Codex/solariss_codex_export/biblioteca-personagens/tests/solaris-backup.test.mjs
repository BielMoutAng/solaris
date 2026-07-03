import assert from "node:assert/strict";
import test from "node:test";

import {
  SOLARIS_BACKUP_SCHEMA,
  createSolarisBackup,
  createSolarisChecksum,
  exportSolarisBackupJson,
  importSolarisBackupJson,
  restoreSolarisBackup,
  rotateSolarisBackups,
  stableStringify,
} from "../src/storage/solaris-backup.js";

const storageState = {
  saved: [
    {
      id: "char-backup",
      name: "Lyssara",
      race: "humanis",
      profession: "guardia",
      attributes: { FOR: 7, REF: 7, CON: 7, INT: 7, PRE: 7, MEN: 7 },
      pvCurrent: 8,
      stress: 1,
      cosmosCurrent: 0,
      exportContext: {
        derived: {
          pvMax: 8,
          stressMax: 6,
          cosmosMax: 0,
          ca: 4,
          movement: 4,
          baseDice: "3d6",
        },
      },
    },
  ],
};

test("createSolarisBackup cria snapshot versionado com checksum", () => {
  const result = createSolarisBackup(storageState, {
    now: "2026-07-03T00:00:00.000Z",
    reason: "teste",
  });

  assert.equal(result.ok, true);
  assert.equal(result.backup.schema, SOLARIS_BACKUP_SCHEMA);
  assert.equal(result.backup.meta.reason, "teste");
  assert.equal(result.backup.payload.storage.data.characters.length, 1);
  assert.equal(result.backup.checksum, createSolarisChecksum(result.backup.payload));
});

test("exportSolarisBackupJson e importSolarisBackupJson restauram storage", () => {
  const exported = exportSolarisBackupJson(storageState, {
    now: "2026-07-03T00:00:00.000Z",
  });
  assert.equal(exported.ok, true);
  assert.ok(exported.json.includes(SOLARIS_BACKUP_SCHEMA));

  const restored = importSolarisBackupJson(exported.json, {
    now: "2026-07-03T00:01:00.000Z",
  });
  assert.equal(restored.ok, true);
  assert.equal(restored.storage.data.characters[0].identity.name, "Lyssara");
});

test("restoreSolarisBackup avisa quando checksum nao confere", () => {
  const result = createSolarisBackup(storageState, {
    now: "2026-07-03T00:00:00.000Z",
  });
  const backup = {
    ...result.backup,
    checksum: "00000000",
  };
  const restored = restoreSolarisBackup(backup);

  assert.equal(restored.ok, true);
  assert.ok(restored.warnings.some((warning) => warning.includes("Checksum")));
});

test("restoreSolarisBackup rejeita schema incorreto e JSON invalido", () => {
  assert.equal(restoreSolarisBackup({ schema: "outro" }).ok, false);
  assert.equal(restoreSolarisBackup("{").ok, false);
});

test("rotateSolarisBackups mantem backups mais recentes", () => {
  const makeBackup = (id, createdAt) => ({
    schema: SOLARIS_BACKUP_SCHEMA,
    id,
    meta: { createdAt },
  });
  const rotated = rotateSolarisBackups([
    makeBackup("old", "2026-07-01T00:00:00.000Z"),
    makeBackup("new", "2026-07-03T00:00:00.000Z"),
    makeBackup("mid", "2026-07-02T00:00:00.000Z"),
  ], 2);

  assert.deepEqual(rotated.map((backup) => backup.id), ["new", "mid"]);
});

test("stableStringify gera texto estavel para checksum", () => {
  assert.equal(stableStringify({ b: 1, a: 2 }), stableStringify({ a: 2, b: 1 }));
});

