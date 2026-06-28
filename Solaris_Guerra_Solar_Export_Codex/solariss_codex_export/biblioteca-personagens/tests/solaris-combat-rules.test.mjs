import test from "node:test";
import assert from "node:assert/strict";

import {
  COMBAT_ACTIONS,
  COMBAT_CONDITIONS,
  applyBleedingTick,
  applyConditionToCombatant,
  applyDamageToCombatant,
  applyDeathMark,
  applyEquipmentCombatConsequence,
  applyHealingToCombatant,
  canUseAction,
  checkRangeState,
  computeCoverModifier,
  createCombatantState,
  removeConditionFromCombatant,
  resetTurnActionState,
  resolveAttackRoll,
  resolveCriticalFailure,
  resolveCriticalHit,
  resolveDamageRoll,
  rollSevereWound,
  stabilizeCombatant,
  advanceConditionDurations,
  crackEffectFor,
} from "../src/domain/solaris-combat-rules.js";

function character(overrides = {}) {
  return createCombatantState({
    id: "char-1",
    entityId: "char-1",
    entityType: "character",
    name: "Lyssara",
    currentPV: 10,
    maxPV: 10,
    ca: 12,
    ...overrides,
  });
}

test("Fase 22: lista de acoes de combate possui acoes minimas", () => {
  const ids = COMBAT_ACTIONS.map((action) => action.id);
  for (const id of ["attack", "move", "reload", "use_item", "stabilize", "stop_bleeding"]) {
    assert.ok(ids.includes(id), `acao ausente: ${id}`);
  }
});

test("ataque com 1d20 acerta quando total >= CA", () => {
  const result = resolveAttackRoll({
    attacker: { name: "Atacante" },
    target: { name: "Alvo", ca: 12 },
    roll: 10,
    attributeModifier: 2,
  });
  assert.equal(result.total, 12);
  assert.equal(result.isHit, true);
});

test("ataque com 1d20 erra quando total < CA", () => {
  const result = resolveAttackRoll({ target: { ca: 15 }, roll: 10, attributeModifier: 2 });
  assert.equal(result.isHit, false);
  assert.equal(result.margin, -3);
});

test("20 natural e critico e acerta automaticamente", () => {
  const result = resolveAttackRoll({ target: { ca: 40 }, roll: 20, attributeModifier: -2 });
  assert.equal(result.isCritical, true);
  assert.equal(result.isHit, true);
});

test("1 natural e erro critico e erra automaticamente", () => {
  const result = resolveAttackRoll({ target: { ca: 2 }, roll: 1, attributeModifier: 30 });
  assert.equal(result.isCriticalFailure, true);
  assert.equal(result.isHit, false);
});

test("critico dobra dados de dano, mas nao duplica bonus fixo", () => {
  const result = resolveDamageRoll({
    expression: "2d6+3",
    rolls: [4, 5],
    isCritical: true,
  });
  assert.equal(result.total, 21);
  assert.equal(result.diceSubtotal, 9);
  assert.equal(result.fixedBonus, 3);
});

test("dano reduz PV e cura nao ultrapassa PV maximo", () => {
  const damaged = applyDamageToCombatant({ combatant: character(), amount: 4 });
  assert.equal(damaged.combatant.currentPV, 6);
  const healed = applyHealingToCombatant({ combatant: damaged.combatant, amount: 20 });
  assert.equal(healed.combatant.currentPV, 10);
});

test("dano que reduz a 0 entra em estado critico", () => {
  const result = applyDamageToCombatant({ combatant: character({ currentPV: 4 }), amount: 8 });
  assert.equal(result.combatant.currentPV, 0);
  assert.equal(result.combatant.criticalState, "critical");
  assert.equal(result.enteredCriticalState, true);
  assert.equal(result.combatant.isDead, false);
});

test("cura em 0 PV tira do estado critico, mas nao remove Marca de Morte", () => {
  const marked = applyDeathMark(character({ currentPV: 0, criticalState: "critical" }), 1, "teste");
  const healed = applyHealingToCombatant({ combatant: marked, amount: 1 });
  assert.equal(healed.combatant.currentPV, 1);
  assert.equal(healed.combatant.criticalState, "");
  assert.equal(healed.combatant.deathMarks, 1);
});

test("Sangramento causa 1d4 no inicio do turno", () => {
  const bleeding = applyConditionToCombatant({
    combatant: character(),
    condition: { id: COMBAT_CONDITIONS.BLEEDING, label: "Sangrando" },
  }).combatant;
  const result = applyBleedingTick({ combatant: bleeding, roll: 3 });
  assert.equal(result.damageApplied, 3);
  assert.equal(result.combatant.currentPV, 7);
});

test("Sangramento em 0 PV adiciona Marca de Morte", () => {
  const bleeding = applyConditionToCombatant({
    combatant: character({ currentPV: 0, criticalState: "critical" }),
    condition: { id: COMBAT_CONDITIONS.BLEEDING, label: "Sangrando" },
  }).combatant;
  const result = applyBleedingTick({ combatant: bleeding, roll: 4 });
  assert.equal(result.deathMarkAdded, true);
  assert.equal(result.combatant.deathMarks, 1);
});

test("duas Marcas de Morte matam personagem", () => {
  const first = applyDeathMark(character({ currentPV: 0 }), 1, "primeira");
  const second = applyDeathMark(first, 1, "segunda");
  assert.equal(second.deathMarks, 2);
  assert.equal(second.isDead, true);
  assert.equal(second.criticalState, "dead");
});

test("estabilizacao remove risco imediato, mas nao cura PV", () => {
  const result = stabilizeCombatant({ combatant: character({ currentPV: 0, criticalState: "critical" }), result: "success" });
  assert.equal(result.stabilized, true);
  assert.equal(result.combatant.currentPV, 0);
  assert.equal(result.combatant.criticalState, "stabilized");
});

test("ferimento grave 1d6 retorna entrada valida e ferimento profundo aplica Sangramento", () => {
  const wound = rollSevereWound({ roll: 5 });
  assert.equal(wound.roll, 5);
  assert.equal(wound.name, "Ferimento profundo");
  assert.equal(wound.condition.key, COMBAT_CONDITIONS.BLEEDING);
});

test("condicao com duracao reduz e expira ao passar turno", () => {
  const conditioned = applyConditionToCombatant({
    combatant: character(),
    condition: { id: "easy", label: "Alvo facil", duration: 1, durationType: "turns" },
  }).combatant;
  const result = advanceConditionDurations({ combatant: conditioned, phase: "end" });
  assert.equal(result.combatant.conditions.some((condition) => condition.id === "easy"), false);
  assert.ok(result.logEvents.some((entry) => entry.type === "condition:expire"));
});

test("fora do alcance marca ataque como erro automatico", () => {
  const range = checkRangeState({ distance: 31, normalRange: 10 });
  const result = resolveAttackRoll({ target: { ca: 1 }, roll: 20, rangeState: range });
  assert.equal(range.autoMiss, true);
  assert.equal(result.isHit, false);
  assert.ok(result.warnings.some((warning) => warning.includes("Fora do alcance")));
});

test("cobertura altera CA e cobertura total bloqueia ataque direto", () => {
  assert.equal(computeCoverModifier("partial").caBonus, 2);
  const covered = resolveAttackRoll({ target: { ca: 10 }, roll: 11, cover: "heavy" });
  assert.equal(covered.targetCA, 14);
  assert.equal(covered.isHit, false);
  const blocked = resolveAttackRoll({ target: { ca: 1 }, roll: 20, cover: "total" });
  assert.equal(blocked.isHit, false);
  assert.equal(blocked.coverApplied.blocksAttack, true);
});

test("arma sem municao nao dispara e arma Jammed bloqueia ataque normal", () => {
  const noAmmo = resolveAttackRoll({ target: { ca: 1 }, roll: 20, weapon: { unusable: true } });
  assert.equal(noAmmo.isHit, false);
  assert.ok(noAmmo.warnings.includes("Arma inutilizavel."));
  const jammed = resolveAttackRoll({ target: { ca: 1 }, roll: 20, weapon: { jammed: true } });
  assert.equal(jammed.isHit, false);
  assert.ok(jammed.warnings.includes("Arma Jammed."));
});

test("erro critico pode sugerir Jammed ou rachadura", () => {
  assert.equal(resolveCriticalFailure({ roll: 1 }).id, "jammed");
  const result = applyEquipmentCombatConsequence({
    equipment: { name: "Rifle", crackLevel: 0, category: "weapon" },
    consequence: "critical-failure",
    confirmDestructive: true,
  });
  assert.equal(result.equipment.jammed, true);
  assert.equal(result.equipment.crackLevel, 1);
});

test("arma com 5 rachaduras fica inutilizavel e armadura rachada altera CA quando configurado", () => {
  assert.equal(crackEffectFor(5, "weapon").unusable, true);
  assert.equal(crackEffectFor(4, "armor").caPenalty, 1);
});

test("monstro comum em 0 PV fica derrotado; chefe pode usar Marcas de Morte", () => {
  const common = createCombatantState({ entityType: "monster", name: "Drone", currentPV: 5, maxPV: 5, usesDeathMarks: false });
  const defeated = applyDamageToCombatant({ combatant: common, amount: 5 });
  assert.equal(defeated.combatant.criticalState, "defeated");
  assert.equal(defeated.combatant.isDead, false);

  const boss = createCombatantState({ entityType: "monster", name: "Chefe", currentPV: 5, maxPV: 5, usesDeathMarks: true });
  const critical = applyDamageToCombatant({ combatant: boss, amount: 5 });
  assert.equal(critical.combatant.criticalState, "critical");
});

test("estado de combate serializa e restaura campos novos", () => {
  const state = createCombatantState({
    name: "Nolan",
    currentPV: 0,
    maxPV: 12,
    deathMarks: 1,
    criticalState: "critical",
    severeWounds: [rollSevereWound({ roll: 1 })],
  });
  const restored = createCombatantState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.deathMarks, 1);
  assert.equal(restored.criticalState, "critical");
  assert.equal(restored.severeWounds.length, 1);
});

test("acao nao bloqueia rolagem por item sem local definido; bloqueia apenas estado fisico incoerente", () => {
  const ready = canUseAction(character({ unassignedItems: [{ id: "vela" }] }), "attack");
  assert.equal(ready.allowed, true);
  const down = canUseAction(character({ currentPV: 0, criticalState: "critical" }), "attack");
  assert.equal(down.allowed, false);
});

test("consumo de acao e reset de turno funcionam", () => {
  const consumed = canUseAction(character(), "attack");
  assert.equal(consumed.allowed, true);
  const after = resetTurnActionState(character({ combatActionState: { actedThisTurn: true, movedThisTurn: true, reactionAvailable: false } }));
  assert.equal(after.combatActionState.actedThisTurn, false);
  assert.equal(after.combatActionState.reactionAvailable, true);
});

test("resultado de critico oficial rapido aponta para dano dobrado", () => {
  const critical = resolveCriticalHit({ mode: "quick" });
  assert.equal(critical.id, "double_damage");
});

test("resistencia, vulnerabilidade, reducao e imunidade alteram dano", () => {
  const resisted = applyDamageToCombatant({
    combatant: character({ resistances: ["fogo"], reductions: { fogo: 2 } }),
    amount: 10,
    damageType: "fogo",
  });
  assert.equal(resisted.damageApplied, 4);

  const vulnerable = applyDamageToCombatant({
    combatant: character({ vulnerabilities: ["fogo"] }),
    amount: 4,
    damageType: "fogo",
  });
  assert.equal(vulnerable.damageApplied, 8);

  const immune = applyDamageToCombatant({
    combatant: character({ immunities: ["fogo"] }),
    amount: 10,
    damageType: "fogo",
  });
  assert.equal(immune.damageApplied, 0);
});

test("dano excedente massivo aplica morte imediata por duas marcas", () => {
  const result = applyDamageToCombatant({ combatant: character({ currentPV: 4, maxPV: 10 }), amount: 24 });
  assert.equal(result.combatant.deathMarks, 2);
  assert.equal(result.combatant.isDead, true);
});

test("remocao de condicao preserva outras condicoes", () => {
  const first = applyConditionToCombatant({ combatant: character(), condition: { id: "bleeding", label: "Sangrando" } }).combatant;
  const second = applyConditionToCombatant({ combatant: first, condition: { id: "prone", label: "Caido" } }).combatant;
  const removed = removeConditionFromCombatant({ combatant: second, conditionId: "bleeding" }).combatant;
  assert.equal(removed.conditions.some((condition) => condition.id === "bleeding"), false);
  assert.equal(removed.conditions.some((condition) => condition.id === "prone"), true);
});

