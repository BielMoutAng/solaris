export const COMBAT_SCHEMA_VERSION = 1;

export const COMBAT_DAMAGE_TYPES = Object.freeze({
  SLASHING: "cortante",
  PIERCING: "perfurante",
  BLUDGEONING: "concussao",
  FIRE: "fogo",
  ELECTRIC: "eletrico",
  ACID: "acido",
  TOXIC: "toxico",
  COSMIC: "cosmico",
  EMP: "emp",
});

export const COMBAT_CONDITIONS = Object.freeze({
  BLEEDING: "bleeding",
  IMMOBILIZED: "immobilized",
  PRONE: "prone",
  STUNNED: "stunned",
  BLINDED: "blinded",
  POISONED: "poisoned",
  BURNING: "burning",
  VULNERABLE: "vulnerable",
  EASY_TARGET: "easy_target",
  DEFENDING: "defending",
  JAMMED: "jammed",
  CRITICAL_STATE: "critical_state",
  DEAD: "dead",
  STABILIZED: "stabilized",
});

export const COMBAT_ACTIONS = Object.freeze([
  { id: "attack", name: "Atacar", type: "main", cost: "acao principal", description: "Realiza ataque com arma, ataque desarmado ou ataque cosmico dirigido.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "attack"] },
  { id: "move", name: "Mover", type: "movement", cost: "movimento", description: "Usa o deslocamento do turno.", consumesAction: false, consumesMovement: true, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "movement"] },
  { id: "run", name: "Correr", type: "main", cost: "acao principal + movimento", description: "Aumenta o deslocamento da rodada conforme permissao do mestre.", consumesAction: true, consumesMovement: true, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "movement"] },
  { id: "defend", name: "Defender", type: "main", cost: "acao principal", description: "Assume postura defensiva e pode conceder bonus simples de CA.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "defense"] },
  { id: "use_item", name: "Usar item", type: "main", cost: "acao principal", description: "Usa item ativo ou de acesso rapido.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "item"] },
  { id: "reload", name: "Recarregar", type: "main", cost: "acao principal", description: "Recarrega arma, carregador, celula ou tubo interno.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "ammo"] },
  { id: "swap_weapon", name: "Trocar arma", type: "simple", cost: "acao simples", description: "Troca arma pronta, coldre ou bandoleira conforme ficcao da cena.", consumesAction: false, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "equipment"] },
  { id: "help", name: "Ajudar", type: "main", cost: "acao principal", description: "Ajuda aliado em ataque, teste, cobertura, estabilizacao ou retirada.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "support"] },
  { id: "interact", name: "Interagir com objeto", type: "simple", cost: "acao simples ou principal", description: "Abre, puxa, aciona, hackeia ou manipula algo da cena.", consumesAction: false, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "scene"] },
  { id: "use_ability", name: "Usar habilidade", type: "main", cost: "acao principal", description: "Ativa habilidade racial, manual, de item, arma, armadura ou chip.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "ability"] },
  { id: "use_cosmic_ability", name: "Usar habilidade cosmica", type: "main", cost: "acao principal + Cosmos", description: "Canaliza magia ou habilidade cosmica.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "cosmos"] },
  { id: "stabilize", name: "Estabilizar aliado", type: "main", cost: "acao principal", description: "Usa Medicina com INT e kit ou improviso para estabilizar alvo em 0 PV.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "medicine"] },
  { id: "stop_bleeding", name: "Estancar sangramento", type: "main", cost: "acao principal", description: "Usa Medicina com INT, kit, compressao, cauterizacao ou recurso plausivel.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "medicine", "bleeding"] },
  { id: "prepare", name: "Preparar acao", type: "main", cost: "acao principal", description: "Prepara gatilho narrativo e resolve quando a condicao ocorrer.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "reaction"] },
  { id: "hide", name: "Furtividade / esconder-se", type: "main", cost: "acao principal", description: "Tenta ficar oculto usando cobertura, sombra, ruido ou confusao da cena.", consumesAction: true, consumesMovement: false, consumesReaction: false, canUseAtZeroPV: false, tags: ["combat", "stealth"] },
]);

export const COMBAT_REACTIONS = Object.freeze([
  { id: "deflect", name: "Defender", description: "Reacao defensiva quando regra, cobertura ou habilidade permitir." },
  { id: "opportunity", name: "Ataque de oportunidade", description: "Uso opcional para mesas mais taticas." },
  { id: "dodge", name: "Esquivar", description: "Reacao situacional ligada a REF, cobertura ou habilidade." },
]);

export const CRITICAL_HIT_TABLE = Object.freeze([
  { roll: 1, id: "double_damage", name: "Dano dobrado", effect: "Dobra apenas os dados de dano; bonus fixos entram uma vez." },
  { roll: 2, id: "severe_wound", name: "Ferimento Grave", effect: "Alem do dano normal, pode aplicar Ferimento Grave se a cena justificar." },
  { roll: 3, id: "critical_surge", name: "Surto critico", effect: "Permite 1 acao simples imediata ou reposicionamento curto, a criterio do mestre." },
  { roll: 4, id: "max_damage", name: "Dano maximo", effect: "Dados de dano contam como valor maximo; bonus fixos entram normalmente." },
  { roll: 5, id: "double_plus_impact", name: "Dano dobrado + impacto", effect: "Dobra dados e soma +1d8, ou aplica 1 rachadura ao equipamento atingido." },
  { roll: 6, id: "devastating", name: "Critico devastador", effect: "Dano maximo +1d8; se sobreviver, pode sofrer Ferimento Grave ou vulneravel por 1 rodada." },
]);

export const CRITICAL_FAILURE_TABLE = Object.freeze([
  { roll: 1, id: "jammed", name: "Jammed", effect: "Arma, foco, modulo ou mecanismo trava e precisa ser destravado com acao apropriada." },
  { roll: 2, id: "easy_target", name: "Alvo facil", effect: "Proximo ataque contra o personagem recebe vantagem ou bonus situacional." },
  { roll: 3, id: "drop_item", name: "Derruba arma ou item", effect: "Arma, foco ou item usado cai aos pes ou espaco adjacente." },
  { roll: 4, id: "stress", name: "Estresse +1", effect: "Personagem ganha +1 Estresse pela falha sob pressao." },
  { roll: 5, id: "equipment_failure", name: "Falha no equipamento", effect: "Equipamento ganha 1 rachadura ou mau funcionamento apropriado." },
  { roll: 6, id: "cosmic_surge", name: "Surto de Cosmos", effect: "Interferencia cosmica beneficia inimigo, marca assinatura ou piora a cena." },
]);

export const SEVERE_WOUNDS_TABLE = Object.freeze([
  { roll: 1, id: "arm_wound", name: "Braco ferido", effect: "-1 em ataques ou acoes manuais com esse braco ate tratamento adequado.", automaticCondition: "" },
  { roll: 2, id: "leg_wound", name: "Perna ferida", effect: "-1 m de movimento ate tratamento adequado.", automaticCondition: "" },
  { roll: 3, id: "torso_wound", name: "Costela ou torso lesionado", effect: "-1 em testes de FOR ou JPF com CON sob esforco ate tratamento adequado.", automaticCondition: "" },
  { roll: 4, id: "burn_corrosion", name: "Queimadura, acido ou corrosao", effect: "+1 Estresse e dificuldade para descansar sem tratamento.", automaticCondition: "" },
  { roll: 5, id: "deep_wound", name: "Ferimento profundo", effect: "Sofre Sangramento.", automaticCondition: COMBAT_CONDITIONS.BLEEDING },
  { roll: 6, id: "neural_trauma", name: "Trauma neurologico, sensorial ou cosmico", effect: "-1 em MEN ou PRE ate tratamento adequado.", automaticCondition: "" },
]);

export const ARMOR_CRACK_EFFECTS = Object.freeze([
  { min: 0, max: 0, caPenalty: 0, label: "Integra" },
  { min: 1, max: 2, caPenalty: 0, label: "Arranhada" },
  { min: 3, max: 4, caPenalty: 1, label: "Comprometida" },
  { min: 5, max: 99, caPenalty: 999, label: "Inutilizavel" },
]);

export const WEAPON_CRACK_EFFECTS = Object.freeze([
  { min: 0, max: 0, attackPenalty: 0, unusable: false, jamRisk: false, label: "Integra" },
  { min: 1, max: 2, attackPenalty: -1, unusable: false, jamRisk: false, label: "Rachada" },
  { min: 3, max: 4, attackPenalty: -2, unusable: false, jamRisk: true, label: "Instavel" },
  { min: 5, max: 99, attackPenalty: 0, unusable: true, jamRisk: true, label: "Inutilizavel" },
]);

function createId(prefix = "combat") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function numeric(value, fallback = 0) {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function integer(value, fallback = 0) {
  return Math.floor(numeric(value, fallback));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, numeric(value, min)));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_ -]+/g, "")
    .trim();
}

function nowIso() {
  return new Date().toISOString();
}

function uniqueConditionId(condition = {}) {
  return String(condition.id || condition.conditionId || condition.key || createId("condition"));
}

export function normalizeCombatCondition(condition = {}) {
  const id = uniqueConditionId(condition);
  const key = normalizeKey(condition.key || condition.type || id).replace(/[\s-]+/g, "_");
  const duration = condition.duration === null || condition.duration === undefined
    ? null
    : Math.max(0, integer(condition.duration, 0));
  return {
    id,
    key,
    type: String(condition.type || key || id),
    name: String(condition.name || condition.label || condition.title || id),
    label: String(condition.label || condition.name || condition.title || id),
    description: String(condition.description || condition.effect || ""),
    source: String(condition.source || ""),
    duration,
    durationType: String(condition.durationType || condition.unit || (duration === null ? "scene" : "turns")),
    appliedAt: condition.appliedAt || condition.createdAt || nowIso(),
    expiresAt: condition.expiresAt || "",
    automatic: Boolean(condition.automatic || condition.auto),
    visibleToPlayer: condition.visibleToPlayer !== false,
    removable: condition.removable !== false,
    notes: String(condition.notes || ""),
    active: condition.active !== false,
  };
}

export function hasCondition(combatant = {}, conditionKey = "") {
  const key = normalizeKey(conditionKey).replace(/[\s-]+/g, "_");
  return arrayOf(combatant.conditions).some((condition) => {
    const normalized = normalizeCombatCondition(condition);
    return normalized.active && [normalized.id, normalized.key, normalizeKey(normalized.label).replace(/[\s-]+/g, "_")].includes(key);
  });
}

export function createCombatantState(value = {}) {
  const snapshot = clone(value.snapshot || {}) || {};
  const entityType = String(value.entityType || value.kind || snapshot.entityType || "character");
  const maxPV = Math.max(0, numeric(value.maxPV ?? value.pvMax ?? value.pvMaximo ?? snapshot.maxPV ?? snapshot.pvMax ?? snapshot.pvMaximo ?? snapshot.pv, 0));
  const currentPV = Math.max(0, numeric(value.currentPV ?? value.pvCurrent ?? value.pvAtual ?? snapshot.currentPV ?? snapshot.pvCurrent ?? snapshot.pvAtual ?? snapshot.pv, maxPV));
  const deathMarks = clamp(value.deathMarks ?? snapshot.deathMarks, 0, 2);
  const isDead = Boolean(value.isDead || snapshot.isDead || deathMarks >= 2 || hasCondition(value, COMBAT_CONDITIONS.DEAD));
  const usesDeathMarks = value.usesDeathMarks ?? snapshot.usesDeathMarks ?? entityType === "character";
  const conditions = arrayOf(value.conditions || snapshot.conditions).map(normalizeCombatCondition);
  const criticalState = String(value.criticalState || snapshot.criticalState || (isDead ? "dead" : currentPV <= 0 && usesDeathMarks ? "critical" : ""));
  return {
    ...snapshot,
    ...clone(value),
    id: String(value.id || value.entityId || snapshot.id || createId("combatant")),
    entityId: String(value.entityId || value.characterId || value.monsterId || value.id || snapshot.entityId || snapshot.id || ""),
    entityType,
    name: String(value.name || snapshot.name || "Combatente"),
    currentPV,
    pvCurrent: currentPV,
    pvAtual: currentPV,
    maxPV,
    pvMax: maxPV,
    deathMarks,
    isDead,
    usesDeathMarks: Boolean(usesDeathMarks),
    criticalState,
    stabilized: Boolean(value.stabilized || snapshot.stabilized || hasCondition({ conditions }, COMBAT_CONDITIONS.STABILIZED)),
    isDefeated: Boolean(value.isDefeated || snapshot.isDefeated || isDead || currentPV <= 0),
    conditions,
    severeWounds: arrayOf(value.severeWounds || snapshot.severeWounds).map((wound) => ({ ...clone(wound) })),
    injuries: arrayOf(value.injuries || snapshot.injuries).map((wound) => ({ ...clone(wound) })),
    scars: arrayOf(value.scars || snapshot.scars).map((scar) => ({ ...clone(scar) })),
    woundHistory: arrayOf(value.woundHistory || snapshot.woundHistory).map((entry) => ({ ...clone(entry) })),
    combatActionState: {
      actedThisTurn: Boolean(value.combatActionState?.actedThisTurn || value.actedThisTurn),
      movedThisTurn: Boolean(value.combatActionState?.movedThisTurn || value.movedThisTurn),
      reactionAvailable: value.combatActionState?.reactionAvailable !== false && value.reactionAvailable !== false,
      actionUsed: String(value.combatActionState?.actionUsed || value.actionUsed || ""),
      movementUsed: Math.max(0, numeric(value.combatActionState?.movementUsed ?? value.movementUsed, 0)),
      lastTurnSummary: String(value.combatActionState?.lastTurnSummary || value.lastTurnSummary || ""),
    },
    resistances: arrayOf(value.resistances || snapshot.resistances).map(normalizeKey),
    vulnerabilities: arrayOf(value.vulnerabilities || snapshot.vulnerabilities).map(normalizeKey),
    immunities: arrayOf(value.immunities || snapshot.immunities).map(normalizeKey),
    reductions: clone(value.reductions || snapshot.reductions || {}) || {},
    equipmentCombatState: clone(value.equipmentCombatState || snapshot.equipmentCombatState || {}) || {},
    ammoCombatState: clone(value.ammoCombatState || snapshot.ammoCombatState || {}) || {},
    lastCombatEvents: arrayOf(value.lastCombatEvents || snapshot.lastCombatEvents).map((entry) => ({ ...clone(entry) })),
  };
}

export function rollInitiative({ roll = null, modifier = 0, bonus = 0, sides = 20 } = {}) {
  const natural = roll === null || roll === undefined
    ? Math.floor(Math.random() * Math.max(2, integer(sides, 20))) + 1
    : integer(roll, 1);
  return {
    natural,
    modifier: numeric(modifier, 0),
    bonus: numeric(bonus, 0),
    total: natural + numeric(modifier, 0) + numeric(bonus, 0),
    formula: `1d${Math.max(2, integer(sides, 20))}`,
  };
}

export function computeCoverModifier(cover = "none") {
  const key = normalizeKey(typeof cover === "string" ? cover : cover?.type || cover?.level || "none").replace(/[\s-]+/g, "_");
  const custom = typeof cover === "object" ? cover : {};
  if (custom.blocksLineOfSight || ["total", "cobertura_total", "full"].includes(key)) {
    return { type: "total", caBonus: 0, attackPenalty: 0, blocksAttack: true, label: "Cobertura total" };
  }
  if (["heavy", "pesada", "cobertura_pesada"].includes(key)) {
    return { type: "heavy", caBonus: numeric(custom.caBonus, 4), attackPenalty: numeric(custom.attackPenalty, 0), blocksAttack: false, label: "Cobertura pesada" };
  }
  if (["half", "partial", "meia", "parcial", "leve", "cobertura_parcial", "meia_cobertura"].includes(key)) {
    return { type: "partial", caBonus: numeric(custom.caBonus, 2), attackPenalty: numeric(custom.attackPenalty, 0), blocksAttack: false, label: "Meia cobertura" };
  }
  return { type: "none", caBonus: numeric(custom.caBonus, 0), attackPenalty: numeric(custom.attackPenalty, 0), blocksAttack: false, label: "Sem cobertura" };
}

export function checkRangeState({ distance = 0, normalRange = 0, maxRange = null, allowBeyond = false } = {}) {
  const dist = Math.max(0, numeric(distance, 0));
  const normal = Math.max(0, numeric(normalRange, 0));
  const maximum = maxRange === null || maxRange === undefined ? normal * 2 : Math.max(normal, numeric(maxRange, normal * 2));
  if (!normal || dist <= normal) return { state: "normal", penalty: 0, autoMiss: false, warning: "" };
  if (dist <= maximum) return { state: "extended", penalty: -1, autoMiss: false, warning: "Alcance ruim: ataque sofre -1." };
  return {
    state: "out_of_range",
    penalty: 0,
    autoMiss: !allowBeyond,
    warning: allowBeyond ? "Acima do alcance: exige permissao especial da mesa." : "Fora do alcance: ataque erra automaticamente.",
  };
}

export function resolveAttackRoll({
  attacker = {},
  target = {},
  weapon = {},
  roll = 10,
  bonuses = 0,
  cover = "none",
  rangeState = {},
  attributeUsed = "",
  attributeModifier = 0,
  criticalRange = [20],
  fumbleRange = [1],
} = {}) {
  const naturalRoll = integer(roll, 0);
  const coverApplied = computeCoverModifier(cover);
  const range = typeof rangeState === "string" ? { state: rangeState } : (rangeState || {});
  const autoMiss = Boolean(coverApplied.blocksAttack || range.autoMiss || weapon.unusable || weapon.jammed);
  const targetCA = numeric(target.ca ?? target.CA ?? target.armorClass, 0) + coverApplied.caBonus;
  const rangePenalty = numeric(range.penalty, 0);
  const equipmentPenalty = numeric(weapon.attackPenalty ?? weapon.penalty, 0);
  const total = naturalRoll + numeric(attributeModifier, 0) + numeric(bonuses, 0) + coverApplied.attackPenalty + rangePenalty + equipmentPenalty;
  const isCriticalFailure = fumbleRange.map(Number).includes(naturalRoll);
  const isCritical = criticalRange.map(Number).includes(naturalRoll);
  const isHit = !autoMiss && !isCriticalFailure && (isCritical || total >= targetCA);
  const warnings = [
    coverApplied.blocksAttack ? "Cobertura total impede ataque direto." : "",
    range.warning || "",
    weapon.unusable ? "Arma inutilizavel." : "",
    weapon.jammed ? "Arma Jammed." : "",
  ].filter(Boolean);
  return {
    total,
    naturalRoll,
    isHit,
    isCritical,
    isCriticalFailure,
    targetCA,
    margin: total - targetCA,
    attributeUsed: attributeUsed || weapon.attribute || "",
    coverApplied,
    rangeState: range.state || "normal",
    warnings,
    logMessage: `${attacker.name || "Atacante"} ${isHit ? "acertou" : "errou"} ${target.name || "alvo"} com ${naturalRoll} natural (${total} vs CA ${targetCA}).`,
  };
}

export function parseDiceExpression(expression = "") {
  const match = String(expression || "").trim().match(/^(\d+)d(\d+)\s*([+-]\s*\d+)?/i);
  if (!match) return null;
  return {
    count: Math.max(1, integer(match[1], 1)),
    sides: Math.max(2, integer(match[2], 6)),
    bonus: match[3] ? integer(String(match[3]).replace(/\s+/g, ""), 0) : 0,
  };
}

export function resolveDamageRoll({
  expression = "",
  dice = null,
  rolls = null,
  fixedBonus = null,
  isCritical = false,
  criticalMode = "double-dice",
} = {}) {
  const parsed = parseDiceExpression(expression) || { count: 0, sides: 0, bonus: 0 };
  const explicitRolls = arrayOf(rolls).length ? arrayOf(rolls).map((roll) => integer(roll, 0)) : null;
  const diceGroups = arrayOf(dice).length
    ? arrayOf(dice).map((group) => ({
      count: Math.max(1, integer(group.count, arrayOf(group.rolls).length || 1)),
      sides: Math.max(2, integer(group.sides, parsed.sides || 6)),
      rolls: arrayOf(group.rolls).length ? arrayOf(group.rolls).map((roll) => integer(roll, 0)) : null,
    }))
    : [{
      count: parsed.count || (explicitRolls?.length || 0),
      sides: parsed.sides || 6,
      rolls: explicitRolls,
    }];
  const resolvedGroups = diceGroups.map((group) => {
    const groupRolls = group.rolls || Array.from({ length: group.count }, () => Math.floor(Math.random() * group.sides) + 1);
    return { ...group, rolls: groupRolls, subtotal: groupRolls.reduce((sum, roll) => sum + roll, 0) };
  });
  const diceSubtotal = resolvedGroups.reduce((sum, group) => sum + group.subtotal, 0);
  const bonus = fixedBonus === null || fixedBonus === undefined ? parsed.bonus : numeric(fixedBonus, 0);
  const criticalMultiplier = isCritical && criticalMode === "double-dice" ? 2 : 1;
  const total = diceSubtotal * criticalMultiplier + bonus;
  return {
    total,
    diceSubtotal,
    fixedBonus: bonus,
    isCritical: Boolean(isCritical),
    criticalMode,
    dice: resolvedGroups,
    rolls: resolvedGroups.flatMap((group) => group.rolls),
    formula: expression || resolvedGroups.map((group) => `${group.count}d${group.sides}`).join("+"),
  };
}

function mitigationForType(combatant = {}, damageType = "") {
  const type = normalizeKey(damageType);
  const reductions = combatant.reductions || {};
  const reduction = Math.max(0, numeric(reductions[type] ?? reductions[damageType] ?? reductions.all, 0));
  const immune = arrayOf(combatant.immunities).map(normalizeKey).includes(type);
  const resistant = arrayOf(combatant.resistances).map(normalizeKey).includes(type);
  const vulnerable = arrayOf(combatant.vulnerabilities).map(normalizeKey).includes(type);
  return { type, reduction, immune, resistant, vulnerable };
}

function combatEvent(type, message, data = {}) {
  return { id: createId("combat-event"), type, message, data: clone(data) || {}, createdAt: nowIso() };
}

export function applyDeathMark(combatant = {}, count = 1, reason = "") {
  const next = createCombatantState(combatant);
  next.deathMarks = clamp(next.deathMarks + Math.max(0, numeric(count, 1)), 0, 2);
  next.lastDeathCheck = nowIso();
  if (reason) next.deathNotes = [next.deathNotes, reason].filter(Boolean).join("\n");
  if (next.deathMarks >= 2) {
    next.isDead = true;
    next.criticalState = "dead";
    next.isDefeated = true;
    next.conditions = upsertCondition(next.conditions, { id: COMBAT_CONDITIONS.DEAD, key: COMBAT_CONDITIONS.DEAD, label: "Morto", name: "Morto", source: reason || "Marca de Morte" });
  }
  return next;
}

export function checkDeathState(combatant = {}) {
  const next = createCombatantState(combatant);
  return {
    deathMarks: next.deathMarks,
    isDead: Boolean(next.isDead || next.deathMarks >= 2),
    criticalState: next.isDead || next.deathMarks >= 2 ? "dead" : next.criticalState,
    stabilized: Boolean(next.stabilized),
  };
}

function upsertCondition(conditions = [], condition = {}) {
  const normalized = normalizeCombatCondition(condition);
  const key = normalized.key || normalized.id;
  const existingIndex = arrayOf(conditions).findIndex((entry) => {
    const current = normalizeCombatCondition(entry);
    return current.id === normalized.id || current.key === key;
  });
  if (existingIndex < 0) return [...arrayOf(conditions).map(normalizeCombatCondition), normalized];
  const next = arrayOf(conditions).map(normalizeCombatCondition);
  next[existingIndex] = { ...next[existingIndex], ...normalized, appliedAt: next[existingIndex].appliedAt };
  return next;
}

export function enterCriticalState(combatant = {}, reason = "0 PV") {
  const next = createCombatantState(combatant);
  next.currentPV = 0;
  next.pvCurrent = 0;
  next.pvAtual = 0;
  next.criticalState = "critical";
  next.stabilized = false;
  next.isDefeated = true;
  next.conditions = upsertCondition(next.conditions, {
    id: COMBAT_CONDITIONS.CRITICAL_STATE,
    key: COMBAT_CONDITIONS.CRITICAL_STATE,
    label: "Estado critico",
    name: "Estado critico",
    source: reason,
    description: "0 PV por dano letal; precisa estabilizacao ou cura.",
  });
  return next;
}

export function applyDamageToCombatant({
  combatant = {},
  amount = 0,
  damageType = "",
  source = "",
  isCritical = false,
  options = {},
} = {}) {
  let next = createCombatantState(combatant);
  const rawDamage = Math.max(0, numeric(amount, 0));
  const mitigation = mitigationForType(next, damageType);
  const logEvents = [];
  let preventedDamage = 0;
  let damageAfterReduction = Math.max(0, rawDamage - mitigation.reduction);
  preventedDamage += rawDamage - damageAfterReduction;
  if (mitigation.immune) {
    preventedDamage += damageAfterReduction;
    damageAfterReduction = 0;
  }
  if (mitigation.resistant) {
    const reduced = Math.floor(damageAfterReduction / 2);
    preventedDamage += damageAfterReduction - reduced;
    damageAfterReduction = reduced;
  }
  if (mitigation.vulnerable) damageAfterReduction *= 2;
  const damageApplied = Math.max(0, damageAfterReduction);
  const wasAtZero = next.currentPV <= 0;
  const previousPV = next.currentPV;

  if (wasAtZero && damageApplied > 0 && next.usesDeathMarks && !options.nonLethal) {
    next = applyDeathMark(next, 1, "Sofreu dano em 0 PV");
    const wound = rollSevereWound({ roll: options.severeWoundRoll });
    next.severeWounds = [...arrayOf(next.severeWounds), wound];
    if (wound.condition) next.conditions = upsertCondition(next.conditions, wound.condition);
    logEvents.push(combatEvent("death-mark", `${next.name} recebeu 1 Marca de Morte por sofrer dano em 0 PV.`));
    logEvents.push(combatEvent("severe-wound", `${next.name} sofreu Ferimento Grave: ${wound.name}.`));
    return {
      combatant: next,
      damageApplied,
      preventedDamage,
      resistancesApplied: mitigation.resistant ? [damageType] : [],
      vulnerabilitiesApplied: mitigation.vulnerable ? [damageType] : [],
      reachedZero: true,
      enteredCriticalState: next.criticalState === "critical",
      deathMarkAdded: true,
      isDead: next.isDead,
      logEvents,
    };
  }

  const nextPV = Math.max(0, previousPV - damageApplied);
  const excessDamage = Math.max(0, damageApplied - previousPV);
  next.currentPV = nextPV;
  next.pvCurrent = nextPV;
  next.pvAtual = nextPV;
  let deathMarkAdded = false;
  let enteredCriticalState = false;
  if (nextPV <= 0 && previousPV > 0) {
    if (next.entityType === "monster" && !next.usesDeathMarks) {
      next.isDefeated = true;
      next.criticalState = "defeated";
      logEvents.push(combatEvent("defeated", `${next.name} ficou fora de combate.`));
    } else if (options.nonLethal) {
      next.isDefeated = true;
      next.criticalState = "incapacitated";
      next.conditions = upsertCondition(next.conditions, { id: "unconscious", key: "unconscious", label: "Inconsciente", name: "Inconsciente", source });
    } else if (next.deathMarks >= 1) {
      next = applyDeathMark(next, 1, "Chegou a 0 PV com 1 Marca de Morte");
      deathMarkAdded = true;
    } else {
      next = enterCriticalState(next, source || "Dano letal");
      enteredCriticalState = true;
    }
  }
  if (!next.isDead && excessDamage >= next.maxPV * 2 && next.maxPV > 0 && next.usesDeathMarks && !options.nonLethal) {
    next = applyDeathMark(next, 2, "Dano excedente massivo");
    deathMarkAdded = true;
  }
  if (isCritical && nextPV <= 0 && !next.isDead && !options.nonLethal) {
    const wound = rollSevereWound({ roll: options.severeWoundRoll });
    next.severeWounds = [...arrayOf(next.severeWounds), wound];
    if (wound.condition) next.conditions = upsertCondition(next.conditions, wound.condition);
    logEvents.push(combatEvent("severe-wound", `${next.name} sofreu Ferimento Grave: ${wound.name}.`));
  }
  logEvents.unshift(combatEvent("damage", `${next.name} sofreu ${damageApplied} de dano${damageType ? ` ${damageType}` : ""}.`, { rawDamage, damageApplied, source }));
  return {
    combatant: next,
    damageApplied,
    preventedDamage,
    resistancesApplied: mitigation.resistant ? [damageType] : [],
    vulnerabilitiesApplied: mitigation.vulnerable ? [damageType] : [],
    reachedZero: nextPV <= 0,
    enteredCriticalState,
    deathMarkAdded,
    isDead: next.isDead,
    logEvents,
  };
}

export function applyHealingToCombatant({ combatant = {}, amount = 0, source = "" } = {}) {
  const next = createCombatantState(combatant);
  const healing = Math.max(0, numeric(amount, 0));
  const previousPV = next.currentPV;
  const healedPV = Math.min(next.maxPV, previousPV + healing);
  next.currentPV = healedPV;
  next.pvCurrent = healedPV;
  next.pvAtual = healedPV;
  if (previousPV <= 0 && healedPV >= 1) {
    next.criticalState = "";
    next.stabilized = false;
    next.isDefeated = false;
    next.conditions = next.conditions.filter((condition) => ![
      COMBAT_CONDITIONS.CRITICAL_STATE,
      COMBAT_CONDITIONS.STABILIZED,
    ].includes(normalizeCombatCondition(condition).key));
  }
  return {
    combatant: next,
    healingApplied: healedPV - previousPV,
    exitedCriticalState: previousPV <= 0 && healedPV >= 1,
    logEvents: [combatEvent("heal", `${next.name} recuperou ${healedPV - previousPV} PV.`, { source })],
  };
}

export function applyConditionToCombatant({ combatant = {}, condition = {} } = {}) {
  const next = createCombatantState(combatant);
  const normalized = normalizeCombatCondition(condition);
  next.conditions = upsertCondition(next.conditions, normalized);
  return {
    combatant: next,
    condition: normalized,
    logEvents: [combatEvent("condition:add", `${next.name} recebeu a condicao ${normalized.label}.`)],
  };
}

export function removeConditionFromCombatant({ combatant = {}, conditionId = "" } = {}) {
  const next = createCombatantState(combatant);
  const key = normalizeKey(conditionId).replace(/[\s-]+/g, "_");
  next.conditions = next.conditions.filter((condition) => {
    const normalized = normalizeCombatCondition(condition);
    return normalized.id !== conditionId && normalized.key !== key;
  });
  return {
    combatant: next,
    logEvents: [combatEvent("condition:remove", `${next.name} removeu uma condicao.`)],
  };
}

export function applyBleedingTick({ combatant = {}, roll = null } = {}) {
  let next = createCombatantState(combatant);
  if (!hasCondition(next, COMBAT_CONDITIONS.BLEEDING)) {
    return { combatant: next, damageApplied: 0, deathMarkAdded: false, roll: 0, logEvents: [] };
  }
  const bleedingRoll = roll === null || roll === undefined ? Math.floor(Math.random() * 4) + 1 : clamp(roll, 1, 4);
  if (next.currentPV <= 0 && next.usesDeathMarks) {
    next = applyDeathMark(next, 1, "Sangramento em 0 PV");
    return {
      combatant: next,
      damageApplied: 0,
      deathMarkAdded: true,
      roll: bleedingRoll,
      logEvents: [combatEvent("bleeding", `${next.name} recebeu 1 Marca de Morte por Sangramento em 0 PV.`)],
    };
  }
  const result = applyDamageToCombatant({
    combatant: next,
    amount: bleedingRoll,
    damageType: COMBAT_DAMAGE_TYPES.PIERCING,
    source: "Sangramento",
  });
  return {
    ...result,
    deathMarkAdded: result.deathMarkAdded,
    roll: bleedingRoll,
    logEvents: [combatEvent("bleeding", `${next.name} sofreu ${bleedingRoll} de dano por Sangramento.`), ...result.logEvents],
  };
}

export function advanceConditionDurations({ combatant = {}, phase = "end", bleedingRoll = null } = {}) {
  let next = createCombatantState(combatant);
  const logEvents = [];
  if (phase === "start") {
    const bleeding = applyBleedingTick({ combatant: next, roll: bleedingRoll });
    next = bleeding.combatant;
    logEvents.push(...bleeding.logEvents);
  }
  next.conditions = next.conditions
    .map((condition) => {
      const normalized = normalizeCombatCondition(condition);
      if (normalized.duration === null || normalized.durationType === "scene" || normalized.durationType === "rest") return normalized;
      if (!["turns", "rounds", "turn", "round"].includes(normalized.durationType)) return normalized;
      const duration = Math.max(0, normalized.duration - 1);
      return { ...normalized, duration };
    })
    .filter((condition) => {
      const keep = condition.duration === null || condition.duration > 0;
      if (!keep) logEvents.push(combatEvent("condition:expire", `${next.name}: ${condition.label} expirou.`));
      return keep;
    });
  return { combatant: next, logEvents };
}

export function stabilizeCombatant({ combatant = {}, result = "success", source = "Medicina" } = {}) {
  const next = createCombatantState(combatant);
  if (next.currentPV > 0) {
    return { combatant: next, stabilized: false, progress: false, logEvents: [combatEvent("stabilize", `${next.name} nao esta em 0 PV.`)] };
  }
  const outcome = String(result || "success");
  if (["success", "complete", "sucesso", "sucesso completo"].includes(outcome)) {
    next.stabilized = true;
    next.criticalState = "stabilized";
    next.conditions = upsertCondition(next.conditions, {
      id: COMBAT_CONDITIONS.STABILIZED,
      key: COMBAT_CONDITIONS.STABILIZED,
      label: "Estabilizado",
      name: "Estabilizado",
      source,
      description: "Permanece com 0 PV, mas para de piorar por teste de sobrevivencia.",
    });
    return { combatant: next, stabilized: true, progress: true, logEvents: [combatEvent("stabilize", `${next.name} foi estabilizado.`)] };
  }
  if (["partial", "parcial", "success_partial"].includes(outcome)) {
    next.stabilizationProgress = Math.min(2, numeric(next.stabilizationProgress, 0) + 1);
    if (next.stabilizationProgress >= 2) return stabilizeCombatant({ combatant: next, result: "success", source });
    return { combatant: next, stabilized: false, progress: true, logEvents: [combatEvent("stabilize", `${next.name} recebeu progresso de estabilizacao.`)] };
  }
  return { combatant: next, stabilized: false, progress: false, logEvents: [combatEvent("stabilize", `${next.name} nao foi estabilizado.`)] };
}

export function rollSevereWound({ roll = null } = {}) {
  const value = roll === null || roll === undefined ? Math.floor(Math.random() * 6) + 1 : clamp(roll, 1, 6);
  const entry = SEVERE_WOUNDS_TABLE.find((item) => item.roll === value) || SEVERE_WOUNDS_TABLE[0];
  return {
    id: createId("severe-wound"),
    roll: value,
    name: entry.name,
    effect: entry.effect,
    condition: entry.automaticCondition ? normalizeCombatCondition({
      id: entry.automaticCondition,
      key: entry.automaticCondition,
      label: entry.automaticCondition === COMBAT_CONDITIONS.BLEEDING ? "Sangrando" : entry.name,
      name: entry.automaticCondition === COMBAT_CONDITIONS.BLEEDING ? "Sangrando" : entry.name,
      source: entry.name,
      duration: null,
    }) : null,
    createdAt: nowIso(),
  };
}

export function recordCombatEvent(log = [], event = {}) {
  return [combatEvent(event.type || "info", event.message || event.description || "", event.data || event), ...arrayOf(log)].slice(0, 250);
}

export function canUseAction(combatant = {}, actionId = "") {
  const state = createCombatantState(combatant);
  const action = COMBAT_ACTIONS.find((item) => item.id === actionId);
  if (!action) return { allowed: false, reason: "Acao desconhecida." };
  if (state.isDead) return { allowed: false, reason: "Combatente morto." };
  if (state.currentPV <= 0 && !action.canUseAtZeroPV) return { allowed: false, reason: "Combatente em 0 PV nao pode usar esta acao." };
  if (hasCondition(state, COMBAT_CONDITIONS.STUNNED) && action.consumesAction) return { allowed: false, reason: "Atordoado impede a acao." };
  if (hasCondition(state, COMBAT_CONDITIONS.IMMOBILIZED) && action.consumesMovement) return { allowed: false, reason: "Imobilizado impede movimento." };
  if (action.consumesAction && state.combatActionState.actedThisTurn) return { allowed: false, reason: "Acao principal ja usada." };
  if (action.consumesMovement && state.combatActionState.movedThisTurn) return { allowed: false, reason: "Movimento ja usado." };
  if (action.consumesReaction && !state.combatActionState.reactionAvailable) return { allowed: false, reason: "Reacao indisponivel." };
  return { allowed: true, action };
}

export function consumeCombatAction(combatant = {}, actionId = "", movementUsed = 0) {
  const state = createCombatantState(combatant);
  const check = canUseAction(state, actionId);
  if (!check.allowed) return { combatant: state, allowed: false, reason: check.reason };
  const action = check.action;
  state.combatActionState = {
    ...state.combatActionState,
    actedThisTurn: state.combatActionState.actedThisTurn || action.consumesAction,
    movedThisTurn: state.combatActionState.movedThisTurn || action.consumesMovement,
    reactionAvailable: action.consumesReaction ? false : state.combatActionState.reactionAvailable,
    actionUsed: action.id,
    movementUsed: state.combatActionState.movementUsed + Math.max(0, numeric(movementUsed, 0)),
    lastTurnSummary: action.name,
  };
  return { combatant: state, allowed: true, action };
}

export function resetTurnActionState(combatant = {}) {
  const state = createCombatantState(combatant);
  state.combatActionState = {
    actedThisTurn: false,
    movedThisTurn: false,
    reactionAvailable: true,
    actionUsed: "",
    movementUsed: 0,
    lastTurnSummary: "",
  };
  return state;
}

export function resolveCriticalHit({ roll = 1, mode = "table" } = {}) {
  if (mode === "quick") return CRITICAL_HIT_TABLE[0];
  const value = clamp(roll, 1, 6);
  return CRITICAL_HIT_TABLE.find((entry) => entry.roll === value) || CRITICAL_HIT_TABLE[0];
}

export function resolveCriticalFailure({ roll = 1, mode = "table" } = {}) {
  const value = clamp(roll, 1, 6);
  return CRITICAL_FAILURE_TABLE.find((entry) => entry.roll === value) || CRITICAL_FAILURE_TABLE[0];
}

export function crackEffectFor(level = 0, kind = "weapon") {
  const table = kind === "armor" ? ARMOR_CRACK_EFFECTS : WEAPON_CRACK_EFFECTS;
  const crack = Math.max(0, numeric(level, 0));
  return table.find((entry) => crack >= entry.min && crack <= entry.max) || table[0];
}

export function applyEquipmentCombatConsequence({
  equipment = {},
  consequence = "critical-failure",
  confirmDestructive = false,
} = {}) {
  const next = clone(equipment) || {};
  const kind = String(next.kind || next.category || "weapon");
  const crackLevel = Math.max(0, numeric(next.crackLevel ?? next.rachaduras, 0));
  const logEvents = [];
  if (consequence === "jammed" || consequence === "critical-failure") {
    next.jammed = true;
    next.conditions = upsertCondition(next.conditions || [], { id: COMBAT_CONDITIONS.JAMMED, key: COMBAT_CONDITIONS.JAMMED, label: "Jammed", name: "Jammed", source: "Erro critico" });
    logEvents.push(combatEvent("equipment:jammed", `${next.name || "Equipamento"} ficou Jammed.`));
  }
  if (consequence === "crack" || (consequence === "critical-failure" && confirmDestructive)) {
    next.crackLevel = clamp(crackLevel + 1, 0, 5);
    next.rachaduras = next.crackLevel;
    logEvents.push(combatEvent("equipment:crack", `${next.name || "Equipamento"} ganhou 1 rachadura.`));
  }
  const crackEffect = crackEffectFor(next.crackLevel ?? crackLevel, kind === "armor" ? "armor" : "weapon");
  next.attackPenalty = crackEffect.attackPenalty || 0;
  next.caPenalty = crackEffect.caPenalty || 0;
  next.unusable = Boolean(crackEffect.unusable || crackEffect.caPenalty >= 999);
  return { equipment: next, crackEffect, logEvents };
}

