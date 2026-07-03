import assert from "node:assert/strict";
import test from "node:test";

import {
  SOLARIS_LEGACY_STORAGE_KEYS,
  SOLARIS_STORAGE_ROOT_KEY,
  clearSolarisStorage,
  createMemoryStorage,
  listSolarisCharacters,
  loadSolarisCharacter,
  loadSolarisStorage,
  readLegacySolarisStorageSnapshot,
  removeSolarisCharacter,
  saveSolarisCharacter,
  saveSolarisStorage,
} from "../src/storage/solaris-storage.js";

const legacyCharacter = {
  id: "char-storage",
  name: "Aric Valen",
  race: "humanis",
  profession: "soldado",
  attributes: { FOR: 8, REF: 7, CON: 7, INT: 7, PRE: 7, MEN: 9 },
  pvCurrent: 8,
  stress: 0,
  cosmosCurrent: 1,
  currency: 50,
  exportContext: {
    derived: {
      pvMax: 8,
      stressMax: 6,
      cosmosMax: 2,
      ca: 4,
      movement: 4,
      baseDice: "3d6",
    },
  },
};

test("createMemoryStorage implementa adaptador localStorage minimo", () => {
  const adapter = createMemoryStorage({ a: "1" });
  assert.equal(adapter.getItem("a"), "1");
  adapter.setItem("b", "2");
  assert.equal(adapter.length, 2);
  adapter.removeItem("a");
  assert.equal(adapter.getItem("a"), null);
});

test("loadSolarisStorage migra snapshot legado sem apagar chaves antigas", () => {
  const adapter = createMemoryStorage({
    [SOLARIS_LEGACY_STORAGE_KEYS.characters]: JSON.stringify([legacyCharacter]),
    [SOLARIS_LEGACY_STORAGE_KEYS.customLibraryContent]: JSON.stringify({ items: [{ id: "item-1" }] }),
  });
  const loaded = loadSolarisStorage({
    adapter,
    persistMigration: true,
    now: "2026-07-03T00:00:00.000Z",
  });

  assert.equal(loaded.ok, true);
  assert.equal(loaded.source, "legacy");
  assert.equal(loaded.data.data.characters.length, 1);
  assert.equal(adapter.getItem(SOLARIS_LEGACY_STORAGE_KEYS.characters) !== null, true);
  assert.equal(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY) !== null, true);
});

test("saveSolarisCharacter adiciona e atualiza ficha normalizada", () => {
  const adapter = createMemoryStorage();
  const saved = saveSolarisCharacter(legacyCharacter, {
    adapter,
    now: "2026-07-03T00:00:00.000Z",
  });

  assert.equal(saved.ok, true);
  assert.equal(saved.character.identity.name, "Aric Valen");

  const updated = saveSolarisCharacter({ ...legacyCharacter, name: "Aric Atualizado" }, {
    adapter,
    now: "2026-07-03T00:01:00.000Z",
  });
  assert.equal(updated.ok, true);

  const listed = listSolarisCharacters({ adapter });
  assert.equal(listed.characters.length, 1);
  assert.equal(listed.characters[0].identity.name, "Aric Atualizado");
});

test("loadSolarisCharacter e removeSolarisCharacter operam por id oficial", () => {
  const adapter = createMemoryStorage();
  const saved = saveSolarisCharacter(legacyCharacter, { adapter });
  const loaded = loadSolarisCharacter(saved.character.id, { adapter });

  assert.equal(loaded.character.identity.name, "Aric Valen");

  const removed = removeSolarisCharacter(saved.character.id, { adapter });
  assert.equal(removed.removed, true);
  assert.equal(listSolarisCharacters({ adapter }).characters.length, 0);
});

test("saveSolarisStorage persiste envelope migrado e clearSolarisStorage remove somente root", () => {
  const adapter = createMemoryStorage();
  const saved = saveSolarisStorage({ saved: [legacyCharacter] }, {
    adapter,
    now: "2026-07-03T00:00:00.000Z",
  });
  assert.equal(saved.ok, true);
  assert.equal(JSON.parse(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY)).data.characters.length, 1);

  const cleared = clearSolarisStorage({ adapter });
  assert.equal(cleared.ok, true);
  assert.equal(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY), null);
});

test("readLegacySolarisStorageSnapshot tolera JSON legado quebrado", () => {
  const adapter = createMemoryStorage({
    [SOLARIS_LEGACY_STORAGE_KEYS.characters]: "{",
    [SOLARIS_LEGACY_STORAGE_KEYS.monsterSheets]: JSON.stringify({ m1: { name: "Drone" } }),
  });
  const snapshot = readLegacySolarisStorageSnapshot(adapter);
  assert.deepEqual(snapshot.saved, []);
  assert.equal(snapshot.monsterSheets.m1.name, "Drone");
});

