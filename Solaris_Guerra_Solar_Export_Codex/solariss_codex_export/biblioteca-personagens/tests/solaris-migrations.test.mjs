import assert from "node:assert/strict";
import test from "node:test";

import {
  SOLARIS_STORAGE_SCHEMA,
  createEmptySolarisStorage,
  migrateSolarisCharacterList,
  migrateSolarisStorageState,
  normalizeStorageCharacter,
} from "../src/storage/solaris-migrations.js";

const legacyCharacter = {
  id: "char-antigo",
  name: "Ficha Antiga",
  race: "humanis",
  profession: "explorador",
  attributes: { FOR: 7, REF: 8, CON: 9, INT: 10, PRE: 11, ESP: 12 },
  pvCurrent: 6,
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

test("createEmptySolarisStorage cria envelope oficial de storage", () => {
  const storage = createEmptySolarisStorage({ now: "2026-07-03T00:00:00.000Z" });
  assert.equal(storage.schema, SOLARIS_STORAGE_SCHEMA);
  assert.equal(storage.version, 1);
  assert.deepEqual(storage.data.characters, []);
  assert.equal(storage.meta.createdAt, "2026-07-03T00:00:00.000Z");
});

test("migrateSolarisStorageState migra lista legada sem converter ESP para MEN", () => {
  const migrated = migrateSolarisStorageState([legacyCharacter], {
    now: "2026-07-03T00:00:00.000Z",
  });
  assert.equal(migrated.ok, true);
  assert.equal(migrated.data.schema, SOLARIS_STORAGE_SCHEMA);
  assert.equal(migrated.data.migration.fromLegacy, true);
  assert.equal(migrated.data.data.characters.length, 1);

  const character = migrated.data.data.characters[0];
  assert.equal(character.attributes.men, 0);
  assert.equal(Object.hasOwn(character.attributes, "esp"), false);
  assert.equal(character.legacy.attributes.ESP, 12);
  assert.equal(character.resources.pv.max, 8);
  assert.ok(migrated.warnings.some((warning) => warning.includes("legacy-esp")));
});

test("migrateSolarisCharacterList aceita arrays antigos da biblioteca", () => {
  const migrated = migrateSolarisCharacterList([legacyCharacter], {
    now: "2026-07-03T00:00:00.000Z",
  });
  assert.equal(migrated.ok, true);
  assert.equal(migrated.data.data.characters[0].identity.name, "Ficha Antiga");
});

test("normalizeStorageCharacter preserva resources oficiais", () => {
  const normalized = normalizeStorageCharacter({
    schema: "solaris-character-v1",
    id: "char-oficial",
    meta: { appVersion: "teste", saveVersion: 1, exportedAt: "2026-07-03T00:00:00.000Z" },
    identity: { name: "Oficial", race: "humanis", origin: "", profession: "", level: 1, portrait: null },
    attributes: { for: 7, ref: 7, con: 7, int: 7, pre: 7, men: 7 },
    modifiers: {},
    resources: {
      pv: { value: 5, max: 9 },
      stress: { value: 1, max: 6 },
      cosmos: { value: 2, max: 3 },
    },
    derived: { ca: 4, movement: 4, baseDice: "3d6", initiative: 0 },
    skills: { trained: [], focus: [], professionSkills: [] },
    protectionRolls: {},
    combat: { conditions: [], damageResistances: [], damageWeaknesses: [], activeEffects: [] },
    equipment: { armor: null, weapons: [], activeWeaponId: null, equippedItems: [], hooks: [], holsters: [], bandoliers: [] },
    inventory: { looseItems: [], cubes: [], credits: 0 },
    ammoSystem: { magazines: [], ammoStacks: [], loadedWeapons: [] },
    abilities: [],
    notes: { background: "", appearance: "", personality: "", campaignNotes: "" },
    migration: { fromLegacy: false, warnings: [] },
    legacy: {},
  }, { now: "2026-07-03T00:00:00.000Z" });

  assert.equal(normalized.character.resources.pv.max, 9);
  assert.equal(normalized.character.resources.cosmos.value, 2);
});

test("migrateSolarisStorageState retorna erro claro para JSON invalido", () => {
  const migrated = migrateSolarisStorageState("{");
  assert.equal(migrated.ok, false);
  assert.equal(migrated.data, null);
  assert.ok(migrated.errors[0].includes("JSON invalido"));
});

