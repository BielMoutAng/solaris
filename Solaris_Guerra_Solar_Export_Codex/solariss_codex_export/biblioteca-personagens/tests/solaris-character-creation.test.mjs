import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_CREATION_CACHE_VERSION,
  CHARACTER_CREATION_SCHEMA_VERSION,
  LEVEL_ONE_STARTING_LOADOUT,
  OFFICIAL_CREATION_CHECKLIST,
  OFFICIAL_CREATION_STAGES,
  OFFICIAL_SKILLS_BY_ATTRIBUTE,
  PLAYABLE_RACES,
  STARTING_LUZENTIS,
  applyInitialAttributeAssignments,
  buildCreationChoicesSnapshot,
  buildProgressionHistoryEntry,
  characterModifier,
  createInitialAttributeRoll,
  validateCreationCharacter,
} from "../src/domain/solaris-character-creation.js";

test("criacao oficial usa quatro racas jogaveis e sete etapas guiadas", () => {
  assert.deepEqual(PLAYABLE_RACES, ["humanis", "zerak", "veyrkan", "kairi"]);
  assert.equal(OFFICIAL_CREATION_STAGES.length, 7);
  assert.ok(OFFICIAL_CREATION_STAGES.some((stage) => stage.officialSteps === "Passo 10"));
  assert.ok(OFFICIAL_CREATION_CHECKLIST.includes("Dinheiro inicial em Luzentis"));
});

test("pericias oficiais mantem CON sem pericias proprias", () => {
  assert.deepEqual(OFFICIAL_SKILLS_BY_ATTRIBUTE.CON, []);
  assert.deepEqual(OFFICIAL_SKILLS_BY_ATTRIBUTE.FOR, ["Atletismo", "Briga", "Demolicao", "Coleta"]);
  assert.ok(OFFICIAL_SKILLS_BY_ATTRIBUTE.REF.includes("Furtividade"));
  assert.ok(OFFICIAL_SKILLS_BY_ATTRIBUTE.INT.includes("Medicina"));
});

test("modificador oficial de atributo fecha 20 como +5", () => {
  assert.equal(characterModifier(7), -2);
  assert.equal(characterModifier(10), 0);
  assert.equal(characterModifier(12), 1);
  assert.equal(characterModifier(18), 4);
  assert.equal(characterModifier(20), 5);
});

test("rolagem inicial gera 7d6, descarta menor e aplica cada dado uma vez", () => {
  const values = [0, 0.2, 0.4, 0.6, 0.8, 0.99, 0.1];
  const roll = createInitialAttributeRoll(() => values.shift());
  assert.deepEqual(roll.rolls, [1, 2, 3, 4, 5, 6, 1]);
  assert.equal(roll.discardedIndex, 0);
  assert.deepEqual(roll.kept, [2, 3, 4, 5, 6, 1]);

  const attributes = applyInitialAttributeAssignments(roll.kept, {
    FOR: 0,
    REF: 1,
    CON: 2,
    MEN: 3,
    PRE: 4,
    INT: 5,
  });
  assert.deepEqual(attributes, { FOR: 9, REF: 10, CON: 11, MEN: 12, PRE: 13, INT: 8 });
  assert.throws(() => applyInitialAttributeAssignments(roll.kept, {
    FOR: 0,
    REF: 0,
    CON: 2,
    MEN: 3,
    PRE: 4,
    INT: 5,
  }), /unica vez/);
});

test("snapshot de criacao registra escolhas, Luzentis e versao", () => {
  const snapshot = buildCreationChoicesSnapshot({
    race: "humanis",
    profession: "hacker",
    racialChoice: "INT",
    level: 1,
    experience: 0,
    attributes: { FOR: 9, REF: 12, CON: 9, MEN: 10, PRE: 11, INT: 13 },
    skillTraining: { Tecnologia: "trained", Briga: "ignorant" },
    initialAttributeRoll: { rolls: [1, 2, 2, 3, 4, 5, 5], kept: [2, 2, 3, 4, 5, 5], discardedIndex: 0 },
  }, {
    raceName: "Humanis",
    professionName: "Hacker",
    professionFocus: "+1 em Tecnologia",
  });

  assert.equal(snapshot.schemaVersion, CHARACTER_CREATION_SCHEMA_VERSION);
  assert.equal(snapshot.cacheVersion, CHARACTER_CREATION_CACHE_VERSION);
  assert.equal(snapshot.startingLoadout.luzentis, STARTING_LUZENTIS);
  assert.deepEqual(snapshot.trainedSkills, ["Tecnologia"]);
  assert.deepEqual(snapshot.ignorantSkills, ["Briga"]);
  assert.equal(snapshot.humanisExtraSkillAvailable, true);
});

test("validacao e historico de progressao registram requisitos oficiais", () => {
  assert.equal(LEVEL_ONE_STARTING_LOADOUT.luzentis, 2000);
  const validation = validateCreationCharacter({
    race: "humanis",
    profession: "hacker",
    level: 1,
    attributes: { FOR: 9, REF: 12, CON: 9, MEN: 10, PRE: 11, INT: 13 },
  });
  assert.equal(validation.valid, true);

  const entry = buildProgressionHistoryEntry({
    previousLevel: 1,
    targetLevel: 2,
    roll: 1,
    benefit: { name: "Perito", effect: "Ganhe 1 pericia treinada a escolha." },
    choice: "Medicina",
    requirement: { xp: 1000, material: "5 Barras de Ferrita", time: "2 horas" },
    cost: 1000,
    experience: 1200,
    currencyBefore: 2000,
    currencyAfter: 1000,
    completedAt: "2026-06-24T00:00:00.000Z",
  });
  assert.equal(entry.level, 2);
  assert.equal(entry.xpRequired, 1000);
  assert.equal(entry.material, "5 Barras de Ferrita");
  assert.equal(entry.stationRequired, true);
});
