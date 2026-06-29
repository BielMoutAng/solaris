import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  loadGlobalScript,
  projectRootFromHere,
} from "../scripts/audit-official-sources.mjs";
import {
  GAME_EVENT_TYPES,
  GameRoom,
  SESSION_ROLES,
} from "../src/session/solaris-session-domain.js";
import {
  BESTIARY_SCHEMA_VERSION,
  MONSTER_TIERS,
  applyMonsterTemplate,
  applyMonsterVariant,
  collectMonsterResource,
  computeMonsterAttackProfile,
  computeMonsterCombatProfile,
  computeMonsterDamageProfile,
  computeMonsterDefenses,
  computeMonsterInitiativeProfile,
  computeMonsterSenses,
  createBossVersion,
  createEliteVersion,
  createMinionVersion,
  createMonsterState,
  createMonsterTokenDefaults,
  createSessionMonsterFromBestiary,
  createSwarmVersion,
  estimateEncounterThreat,
  estimateMonsterThreat,
  hydrateMonsterState,
  normalizeMonsterAbility,
  normalizeMonsterAttack,
  normalizeMonsterEntry,
  normalizeMonsterLootProfile,
  normalizeMonsterMoraleProfile,
  normalizeMonsterResistanceProfile,
  resolveMonsterAbilityUse,
  resolveMonsterAttack,
  resolveMonsterLoot,
  resolveMonsterMoraleCheck,
  serializeMonsterState,
  validateMonsterSheet,
} from "../src/domain/solaris-bestiary-rules.js";

const root = projectRootFromHere();

function book3() {
  return loadGlobalScript(path.join(root, "official-books-data.js"), "SOLARIS_OFFICIAL_BOOKS").bestiary;
}

function sampleMonster(overrides = {}) {
  return {
    id: "vanguarda-xirax",
    name: "Vanguarda Xirax",
    tier: "C",
    type: "alienigena mecanico",
    role: "brutamontes elite",
    size: "grande",
    habitat: "estacoes e estruturas",
    behavior: "Avanca contra alvos isolados.",
    pv: 58,
    ca: 15,
    movement: "9 m",
    attributes: "FOR 18/MOD +4 REF 14/MOD +2 CON 18/MOD +4",
    attacks: "Lamina de Fusao: 2d8+4 cortante termico\nCanhao de Particulas: 3d6+3 energia",
    abilities: "Pulso Disruptor: CD 14 JPF ou sofre 3d6 eletrico e fica Atordoado.\nArmadura Adaptativa: recebe resistencia a energia.",
    resistances: "Energia; termico",
    weaknesses: "Dano cinetico",
    immunities: "Envenenado",
    senses: "Visao 18m; Infravermelho",
    moral: "Luta ate metade dos PV; se a missao falhar, recua.",
    resources: "Nucleo de fusao instavel; Modulo de armadura Xirax; Dados de combate Xirax",
    reward: "120 Luzentis",
    sourceFileCurrent: "Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx",
    sourceStatus: "current-source-needs-review",
    ...overrides,
  };
}

const target = {
  id: "char-1",
  name: "Lyssara",
  entityType: "character",
  currentPV: 30,
  maxPV: 30,
  ca: 14,
};

test("Fase 24: modulo carrega schema e constantes oficiais", () => {
  assert.equal(BESTIARY_SCHEMA_VERSION, 1);
  assert.ok(MONSTER_TIERS.includes("C"));
});

test("monstros oficiais normalizados possuem id e nome", () => {
  const monster = normalizeMonsterEntry(book3()[0]);
  assert.ok(monster.id);
  assert.ok(monster.name);
});

test("monstro normalizado possui tier valido", () => {
  const monster = normalizeMonsterEntry(sampleMonster());
  assert.equal(MONSTER_TIERS.includes(monster.tier), true);
});

test("monstro normalizado possui PV e CA numericos quando disponiveis", () => {
  const monster = normalizeMonsterEntry(sampleMonster());
  assert.equal(monster.maxPV, 58);
  assert.equal(monster.ca, 15);
});

test("monstro normalizado possui movimento numerico", () => {
  const monster = normalizeMonsterEntry(sampleMonster());
  assert.equal(monster.movementMeters, 9);
});

test("ataque de monstro e normalizado", () => {
  const attack = normalizeMonsterAttack("Garra: 1d6 cortante", 0);
  assert.equal(attack.name, "Garra");
  assert.equal(attack.damageType, "cortante");
});

test("dano de ataque de monstro e normalizado", () => {
  const attack = normalizeMonsterAttack("Mordida: 1d8+2 perfurante", 0);
  assert.equal(attack.damageFormula, "1d8+2");
  assert.equal(attack.fixedBonus, 2);
});

test("habilidade de monstro e normalizada", () => {
  const ability = normalizeMonsterAbility("Pulso: CD 14 JPR ou sofre 2d6 eletrico e fica Atordoado.", 0);
  assert.equal(ability.saveType, "JPR");
  assert.equal(ability.damageFormula, "2d6");
  assert.equal(ability.condition.key, "stunned");
});

test("resistencia e normalizada", () => {
  const profile = normalizeMonsterResistanceProfile(sampleMonster());
  assert.ok(profile.resistances.includes("eletrico") || profile.resistances.includes("Energia") || profile.resistances.includes("fogo"));
});

test("vulnerabilidade/fraqueza e normalizada", () => {
  const profile = normalizeMonsterResistanceProfile(sampleMonster());
  assert.ok(profile.vulnerabilities.includes("concussao") || profile.weaknessNotes.length > 0);
});

test("imunidade e normalizada", () => {
  const profile = normalizeMonsterResistanceProfile(sampleMonster({ immunities: "toxico" }));
  assert.ok(profile.immunities.includes("toxico"));
});

test("sentidos sao normalizados", () => {
  const senses = computeMonsterSenses(sampleMonster());
  assert.equal(senses.some((sense) => sense.type === "termico"), true);
});

test("loot profile e normalizado", () => {
  const loot = normalizeMonsterLootProfile(sampleMonster());
  assert.ok(loot.lootTable.length >= 2);
});

test("recursos coletaveis sao normalizados", () => {
  const loot = normalizeMonsterLootProfile(sampleMonster());
  assert.ok(loot.resources[0].id);
  assert.ok(loot.resources[0].collectionSkill);
});

test("moral profile e normalizado", () => {
  const morale = normalizeMonsterMoraleProfile(sampleMonster());
  assert.ok(morale.thresholds.some((entry) => entry.atPvRatio === 0.5));
});

test("validateMonsterSheet detecta monstro sem PV", () => {
  const result = validateMonsterSheet(sampleMonster({ pv: undefined, maxPV: undefined }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((entry) => entry.includes("PV")));
});

test("computeMonsterCombatProfile gera PV, CA, movimento e ataques", () => {
  const combat = computeMonsterCombatProfile(sampleMonster());
  assert.equal(combat.maxPV, 58);
  assert.equal(combat.ca, 15);
  assert.equal(combat.movement, 9);
  assert.ok(combat.attacks.length >= 2);
});

test("computeMonsterAttackProfile gera perfil compativel com combate", () => {
  const profile = computeMonsterAttackProfile(sampleMonster(), 0);
  assert.equal(profile.compatibleWithCombat, true);
  assert.equal(profile.formula, "1d20");
});

test("computeMonsterDamageProfile gera perfil compativel com dano", () => {
  const profile = computeMonsterDamageProfile(sampleMonster(), 0);
  assert.equal(profile.compatibleWithCombat, true);
  assert.equal(profile.formula, "2d8+4");
});

test("resolveMonsterAttack acerta alvo quando total >= CA", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 4, damage: "1d6 cortante" }] }),
    target,
    roll: 10,
    context: { damageRolls: [3] },
  });
  assert.equal(result.attackResult.isHit, true);
});

test("resolveMonsterAttack erra alvo quando total < CA", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 0, damage: "1d6 cortante" }] }),
    target,
    roll: 5,
  });
  assert.equal(result.attackResult.isHit, false);
});

test("20 natural em ataque de monstro e critico", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 0, damage: "1d6 cortante" }] }),
    target: { ...target, ca: 99 },
    roll: 20,
    context: { damageRolls: [4] },
  });
  assert.equal(result.attackResult.isCritical, true);
  assert.equal(result.attackResult.isHit, true);
});

test("1 natural em ataque de monstro e erro critico", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 99, damage: "1d6 cortante" }] }),
    target,
    roll: 1,
  });
  assert.equal(result.attackResult.isCriticalFailure, true);
  assert.equal(result.attackResult.isHit, false);
});

test("dano de monstro usa motor de combate", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 10, damage: "1d6+2 cortante" }] }),
    target,
    roll: 10,
    context: { damageRolls: [4] },
  });
  assert.equal(result.damageApplication.damageApplied, 6);
  assert.equal(result.target.currentPV, 24);
});

test("resistencia do alvo reduz dano", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 10, damage: "1d6 cortante" }] }),
    target: { ...target, resistances: ["cortante"] },
    roll: 10,
    context: { damageRolls: [6] },
  });
  assert.equal(result.damageApplication.damageApplied, 3);
});

test("vulnerabilidade aumenta dano", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 10, damage: "1d6 cortante" }] }),
    target: { ...target, vulnerabilities: ["cortante"] },
    roll: 10,
    context: { damageRolls: [6] },
  });
  assert.equal(result.damageApplication.damageApplied, 12);
});

test("imunidade zera dano", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 10, damage: "1d6 cortante" }] }),
    target: { ...target, immunities: ["cortante"] },
    roll: 10,
    context: { damageRolls: [6] },
  });
  assert.equal(result.damageApplication.damageApplied, 0);
});

test("condicao de monstro pode ser aplicada ao alvo", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Pulso", attackBonus: 10, damage: "1d4 eletrico", effect: "Atordoado" }] }),
    target,
    roll: 10,
    context: { damageRolls: [1] },
  });
  assert.equal(result.target.conditions.some((condition) => condition.key === "stunned"), true);
});

test("habilidade com salvamento registra JPF/JPR/JPC", () => {
  const result = resolveMonsterAbilityUse({
    monster: sampleMonster({ abilities: [{ name: "Pulso", effect: "CD 14 JPF ou sofre 3d6 eletrico." }] }),
    target,
  });
  assert.equal(result.requiresSave, true);
  assert.equal(result.save.type, "JPF");
});

test("monstro comum em 0 PV fica derrotado", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 20, damage: "30d1 cortante" }] }),
    target: { id: "monster-target", entityType: "monster", name: "Drone", currentPV: 5, maxPV: 5, ca: 1, usesDeathMarks: false },
    roll: 10,
  });
  assert.equal(result.target.criticalState, "defeated");
});

test("monstro importante com usesDeathMarks usa Marcas de Morte", () => {
  const result = resolveMonsterAttack({
    monster: sampleMonster({ attacks: [{ name: "Golpe", attackBonus: 20, damage: "5d2 cortante" }] }),
    target: { id: "boss", entityType: "monster", name: "Boss", currentPV: 5, maxPV: 5, ca: 1, usesDeathMarks: true },
    roll: 10,
    context: { damageRolls: [1, 1, 1, 1, 1] },
  });
  assert.equal(result.target.criticalState, "critical");
});

test("loot e gerado ao derrotar monstro", () => {
  const result = resolveMonsterLoot(sampleMonster(), { defeated: true, random: () => 0 });
  assert.ok(result.drops.length >= 1);
});

test("recurso coletavel pode virar material/item", () => {
  const result = collectMonsterResource({ monster: sampleMonster(), resourceId: 0, roll: 20, collector: { name: "Lyssara", bonus: 2 } });
  assert.equal(result.success, true);
  assert.equal(result.item.category, "material");
});

test("variante altera PV/CA/dano conforme configuracao", () => {
  const variant = applyMonsterVariant(sampleMonster(), "alpha");
  assert.ok(variant.maxPV > sampleMonster().pv);
  assert.ok(variant.ca > sampleMonster().ca);
  assert.notEqual(variant.attacks[0].damageFormula, normalizeMonsterEntry(sampleMonster()).attacks[0].damageFormula);
});

test("template Minion reduz ameaca", () => {
  const base = estimateMonsterThreat(sampleMonster()).score;
  const minion = estimateMonsterThreat(createMinionVersion(sampleMonster())).score;
  assert.ok(minion <= base);
});

test("template Elite aumenta ameaca", () => {
  const base = estimateMonsterThreat(sampleMonster()).score;
  const elite = estimateMonsterThreat(createEliteVersion(sampleMonster())).score;
  assert.ok(elite >= base);
});

test("template Boss usa Marcas de Morte", () => {
  const boss = createBossVersion(sampleMonster());
  assert.equal(boss.usesDeathMarks, true);
});

test("token padrao e criado com tamanho/imagem/movimento", () => {
  const token = createMonsterTokenDefaults(sampleMonster({ image: "./x.png" }));
  assert.equal(token.entityType, "monster");
  assert.equal(token.size, 2);
  assert.equal(token.movement, 9);
  assert.equal(token.image, "./x.png");
});

test("estado de monstro serializa e hidrata sem perda", () => {
  const state = createMonsterState(sampleMonster());
  const hydrated = hydrateMonsterState(serializeMonsterState(state));
  assert.equal(hydrated.name, state.name);
  assert.equal(hydrated.maxPV, state.maxPV);
  assert.equal(hydrated.attacks.length, state.attacks.length);
});

test("encontro estima ameaca agregada", () => {
  const result = estimateEncounterThreat([sampleMonster(), createSwarmVersion(sampleMonster())], { partySize: 4, averageLevel: 3 });
  assert.ok(result.totalThreat > 0);
  assert.ok(result.rewardSuggestion > 0);
});

test("sessao aceita campos novos de monstro sem quebrar", () => {
  const room = new GameRoom({ id: "room", players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }] });
  const sessionMonster = createSessionMonsterFromBestiary(sampleMonster(), { id: "monster-1" });
  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, { monster: sessionMonster }, "gm");
  assert.equal(room.monsters[0].bestiarySchemaVersion, BESTIARY_SCHEMA_VERSION);
  assert.ok(room.monsters[0].snapshot.monsterCombatProfile);
});

test("campanhas antigas recebem defaults sem quebrar", () => {
  const room = new GameRoom({
    id: "old-room",
    players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }],
    monsters: [{ id: "old-monster", name: "Antigo", snapshot: { name: "Antigo", pv: 6, ca: 10, movement: "6 m", attacks: "Mordida: 1d4 perfurante" } }],
  });
  assert.equal(room.monsters[0].bestiarySchemaVersion, BESTIARY_SCHEMA_VERSION);
  assert.ok(room.monsters[0].snapshot.attacks.length >= 1);
});

test("computeMonsterDefenses e iniciativa expõem perfis auxiliares", () => {
  assert.equal(computeMonsterDefenses(sampleMonster()).ca, 15);
  assert.equal(computeMonsterInitiativeProfile(sampleMonster(), { roll: 10 }).total >= 10, true);
});

test("resolveMonsterMoraleCheck fornece decisao narrativa simples", () => {
  const result = resolveMonsterMoraleCheck({ monster: sampleMonster({ currentPV: 10, maxPV: 58 }), roll: 5 });
  assert.ok(["foge", "recua", "continua lutando"].includes(result.outcome));
});
