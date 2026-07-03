import assert from "node:assert/strict";
import test from "node:test";

import {
  createCharacterState,
  getActiveCharacter,
  isCharacterDirty,
  markCharacterDirty,
  markCharacterSaved,
  normalizeActiveCharacter,
  setActiveCharacter,
  updateActiveCharacterSection,
  updateCharacterAttributes,
  updateCharacterDerived,
  updateCharacterIdentity,
  updateCharacterNotes,
  updateCharacterResources,
  validateActiveCharacter,
} from "../src/ui/solaris-character-state.js";

const legacyCharacter = {
  id: "char-fase-5",
  name: "Lyssara Kalar",
  player: "Gabriel",
  race: "humanis",
  profession: "guardiao",
  level: 3,
  experience: 3200,
  origin: "Colonia Solaris",
  attributes: { FOR: 8, REF: 11, CON: 9, INT: 12, PRE: 7, ESP: 13 },
  pvCurrent: 18,
  cosmosCurrent: 4,
  stress: 2,
  currency: 350,
  inventory: [
    {
      uid: "arma-1",
      itemId: "rifle-pulso",
      name: "Rifle de Pulso",
      category: "weapon",
      location: { kind: "equipped", slotId: "mainWeapon" },
    },
  ],
  exportContext: {
    raceName: "Humanis",
    professionName: "Guardiao",
    derived: {
      pvMax: 20,
      cosmosMax: 6,
      stressMax: 6,
      ca: 7,
      movement: 4,
      baseDice: "3d6",
      initiative: 2,
    },
  },
  legacyExtra: {
    keep: true,
  },
};

test("createCharacterState cria estado vazio seguro", () => {
  const state = createCharacterState();
  assert.equal(state.activeCharacter, null);
  assert.equal(state.dirty, false);
  assert.equal(state.validation.ok, true);
});

test("setActiveCharacter define ficha ativa", () => {
  const state = setActiveCharacter(createCharacterState(), legacyCharacter);
  assert.equal(getActiveCharacter(state).identity.name, "Lyssara Kalar");
  assert.equal(state.dirty, false);
});

test("getActiveCharacter retorna ficha ativa", () => {
  const state = createCharacterState(legacyCharacter);
  assert.equal(getActiveCharacter(state).id, "char-fase-5");
});

test("updateCharacterIdentity altera identity sem apagar outros campos", () => {
  const updated = updateCharacterIdentity(legacyCharacter, { name: "Drax Voren" });
  assert.equal(updated.identity.name, "Drax Voren");
  assert.equal(updated.identity.race, "humanis");
  assert.equal(updated.resources.pv.value, 18);
});

test("updateCharacterAttributes aceita for/ref/con/int/pre/men", () => {
  const updated = updateCharacterAttributes(legacyCharacter, {
    for: 10,
    REF: 12,
    con: 9,
    int: 11,
    pre: 8,
    men: 7,
  });
  assert.equal(updated.attributes.for, 10);
  assert.equal(updated.attributes.ref, 12);
  assert.equal(updated.attributes.men, 7);
});

test("updateCharacterAttributes nao promove esp para atributo oficial", () => {
  const updated = updateCharacterAttributes(legacyCharacter, { esp: 18 });
  assert.equal(Object.hasOwn(updated.attributes, "esp"), false);
  assert.equal(Object.hasOwn(updated.attributes, "ESP"), false);
  assert.equal(updated.attributes.men, 0);
});

test("updateCharacterAttributes preserva esp em legacy quando aparecer", () => {
  const updated = updateCharacterAttributes(legacyCharacter, { ESP: 18 });
  assert.equal(updated.legacy.attributes.ESP, 18);
  assert.ok(updated.migration.warnings.some((warning) => warning.includes("ESP legado")));
});

test("updateCharacterResources atualiza pv/stress/cosmos", () => {
  const updated = updateCharacterResources(legacyCharacter, {
    pv: { value: 12, max: 22 },
    stress: { value: 3, max: 6 },
    cosmos: { value: 5, max: 8 },
  });
  assert.equal(updated.resources.pv.value, 12);
  assert.equal(updated.resources.pv.max, 22);
  assert.equal(updated.resources.stress.value, 3);
  assert.equal(updated.resources.cosmos.value, 5);
  assert.deepEqual(updated.derived.cosmos, { value: 5, max: 8 });
});

test("updateCharacterResources nao coloca cosmos em attributes", () => {
  const updated = updateCharacterResources(legacyCharacter, {
    cosmos: { value: 5, max: 8 },
  });
  assert.equal(Object.hasOwn(updated.attributes, "cosmos"), false);
});

test("normalizeActiveCharacter cria resources minimos", () => {
  const normalized = normalizeActiveCharacter({ id: "char-minimo", name: "Minimo" });
  assert.deepEqual(Object.keys(normalized.resources), ["pv", "stress", "cosmos"]);
  assert.equal(normalized.resources.stress.max, 6);
});

test("normalizeActiveCharacter cria equipment/inventory/ammoSystem minimos", () => {
  const normalized = normalizeActiveCharacter({ id: "char-minimo", name: "Minimo" });
  assert.deepEqual(normalized.equipment.weapons, []);
  assert.deepEqual(normalized.equipment.hooks, []);
  assert.deepEqual(normalized.inventory.looseItems, []);
  assert.deepEqual(normalized.ammoSystem.magazines, []);
});

test("markCharacterDirty marca estado como alterado", () => {
  const state = markCharacterDirty(createCharacterState(legacyCharacter));
  assert.equal(isCharacterDirty(state), true);
});

test("markCharacterSaved limpa dirty", () => {
  const state = markCharacterSaved(markCharacterDirty(createCharacterState(legacyCharacter)));
  assert.equal(isCharacterDirty(state), false);
  assert.equal(state.saved, true);
});

test("validateActiveCharacter usa validadores existentes", () => {
  const validation = validateActiveCharacter(legacyCharacter);
  assert.equal(validation.ok, true);
  assert.ok(validation.warnings.some((warning) => warning.includes("derived.pv")));
});

test("legacy e preservado", () => {
  const normalized = normalizeActiveCharacter(legacyCharacter);
  assert.equal(normalized.legacy.legacyExtra.keep, true);
  assert.equal(normalized.legacy.attributes.ESP, 13);
});

test("updateActiveCharacterSection atualiza secao e marca dirty", () => {
  const state = createCharacterState(legacyCharacter);
  const updated = updateActiveCharacterSection(state, "notes", { campaignNotes: "Nota nova" });
  assert.equal(updated.dirty, true);
  assert.equal(updated.activeCharacter.notes.campaignNotes, "Nota nova");
});

test("updateCharacterDerived e updateCharacterNotes preservam formato oficial", () => {
  const withDerived = updateCharacterDerived(legacyCharacter, { ca: 9, movement: 5, initiative: 1 });
  assert.equal(withDerived.derived.ca, 9);
  const withNotes = updateCharacterNotes(withDerived, { campaignNotes: "Campanha" });
  assert.equal(withNotes.notes.campaignNotes, "Campanha");
  assert.equal(withNotes.schema, "solaris-character-v1");
});
