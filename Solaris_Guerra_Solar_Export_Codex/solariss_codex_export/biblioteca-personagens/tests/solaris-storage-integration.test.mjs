import assert from "node:assert/strict";
import test from "node:test";

import {
  SOLARIS_LEGACY_STORAGE_KEYS,
  SOLARIS_STORAGE_ROOT_KEY,
  createMemoryStorage,
  initializeSolarisAppStorage,
  listStoredSolarisCharacters,
  loadStoredSolarisCharacter,
  saveStoredSolarisCharacter,
  saveStoredSolarisCharacters,
} from "../src/storage/solaris-storage.js";

const legacyCharacter = {
  id: "char-integracao",
  name: "Integracao Solaris",
  race: "humanis",
  profession: "explorador",
  attributes: { FOR: 7, REF: 8, CON: 9, INT: 10, PRE: 11, ESP: 12 },
  pvCurrent: 5,
  stress: 1,
  cosmosCurrent: 2,
  exportContext: {
    derived: {
      pvMax: 8,
      stressMax: 6,
      cosmosMax: 4,
      ca: 4,
      movement: 4,
      baseDice: "3d6",
    },
  },
};

function storageWithLegacy(characters = [legacyCharacter]) {
  return createMemoryStorage({
    [SOLARIS_LEGACY_STORAGE_KEYS.characters]: JSON.stringify(characters),
    [SOLARIS_LEGACY_STORAGE_KEYS.customLibraryContent]: JSON.stringify({ itens: [{ id: "item-legado" }] }),
  });
}

test("initializeSolarisAppStorage carrega storage novo", () => {
  const adapter = createMemoryStorage({
    [SOLARIS_STORAGE_ROOT_KEY]: JSON.stringify({
      schema: "solaris-storage-v1",
      version: 1,
      meta: { appVersion: "teste", saveVersion: 1, createdAt: "2026-07-03T00:00:00.000Z" },
      data: { characters: [], customLibraryContent: {}, monsterSheets: {}, shopPriceOverrides: {}, settings: {}, campaigns: [], backups: [] },
      migration: { fromLegacy: false, warnings: [] },
      legacy: {},
    }),
  });
  const initialized = initializeSolarisAppStorage({ adapter });
  assert.equal(initialized.ok, true);
  assert.equal(initialized.mode, "current");
});

test("initializeSolarisAppStorage detecta ausencia de storage novo", () => {
  const adapter = createMemoryStorage();
  const initialized = initializeSolarisAppStorage({ adapter, now: "2026-07-03T00:00:00.000Z" });
  assert.equal(initialized.ok, true);
  assert.equal(initialized.mode, "current");
  assert.equal(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY), null);
});

test("initializeSolarisAppStorage detecta chaves legadas e migra snapshot em memoria", () => {
  const adapter = storageWithLegacy();
  const initialized = initializeSolarisAppStorage({ adapter, now: "2026-07-03T00:00:00.000Z" });

  assert.equal(initialized.ok, true);
  assert.equal(initialized.mode, "legacy-compatible");
  assert.equal(initialized.storage.data.characters.length, 1);
  assert.equal(initialized.storage.data.characters[0].legacy.attributes.ESP, 12);
  assert.equal(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY), null);
});

test("primeiro save apos legado cria backup e preserva chaves antigas", () => {
  const adapter = storageWithLegacy();
  const saved = saveStoredSolarisCharacter({ ...legacyCharacter, name: "Salvo no Storage Novo" }, {
    adapter,
    now: "2026-07-03T00:00:00.000Z",
  });

  assert.equal(saved.ok, true);
  assert.equal(adapter.getItem(SOLARIS_LEGACY_STORAGE_KEYS.characters) !== null, true);
  const root = JSON.parse(adapter.getItem(SOLARIS_STORAGE_ROOT_KEY));
  assert.equal(root.data.backups.length, 1);
  assert.ok(root.migration.warnings.some((warning) => warning.includes("chaves antigas preservadas")));
});

test("saveStoredSolarisCharacter preserva ESP em legacy", () => {
  const adapter = createMemoryStorage();
  const saved = saveStoredSolarisCharacter(legacyCharacter, { adapter });

  assert.equal(saved.ok, true);
  assert.equal(saved.storedCharacter.attributes.men, 0);
  assert.equal(saved.storedCharacter.legacy.attributes.ESP, 12);
  assert.equal(saved.character.attributes.MEN, 0);
});

test("loadStoredSolarisCharacter retorna ficha migrada compativel com app", () => {
  const adapter = createMemoryStorage();
  const saved = saveStoredSolarisCharacter(legacyCharacter, { adapter });
  const loaded = loadStoredSolarisCharacter(saved.storedCharacter.id, { adapter });

  assert.equal(loaded.ok, true);
  assert.equal(loaded.character.name, "Integracao Solaris");
  assert.equal(loaded.character.resources.cosmos.value, 2);
});

test("listStoredSolarisCharacters evita duplicatas por id", () => {
  const adapter = storageWithLegacy([
    legacyCharacter,
    { ...legacyCharacter, name: "Duplicata Mais Recente" },
  ]);
  const listed = listStoredSolarisCharacters({ adapter });

  assert.equal(listed.ok, true);
  assert.equal(listed.characters.length, 1);
  assert.equal(listed.characters[0].name, "Duplicata Mais Recente");
});

test("saveStoredSolarisCharacters substitui a lista completa sem duplicatas", () => {
  const adapter = createMemoryStorage();
  const saved = saveStoredSolarisCharacters([
    legacyCharacter,
    { ...legacyCharacter, name: "Lista Atualizada" },
  ], { adapter });

  assert.equal(saved.ok, true);
  assert.equal(saved.characters.length, 1);
  assert.equal(saved.characters[0].name, "Lista Atualizada");
});

test("fallback em memoria funciona quando localStorage nao existe", () => {
  const initialized = initializeSolarisAppStorage({
    adapter: null,
    allowMemoryFallback: true,
    now: "2026-07-03T00:00:00.000Z",
  });

  assert.equal(initialized.ok, true);
  assert.equal(initialized.mode, "memory-fallback");
  const saved = saveStoredSolarisCharacter(legacyCharacter, { adapter: initialized.adapter });
  assert.equal(saved.ok, true);
});

