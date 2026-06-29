import {
  buildMonsterLootTable,
  parseMonsterLootResources,
  rollMonsterLoot,
} from "./solaris-domain-architecture.js";
import {
  COMBAT_CONDITIONS,
  COMBAT_DAMAGE_TYPES,
  applyConditionToCombatant,
  applyDamageToCombatant,
  createCombatantState,
  normalizeCombatCondition,
  resolveAttackRoll,
  resolveDamageRoll,
  rollInitiative,
} from "./solaris-combat-rules.js";

export const BESTIARY_SCHEMA_VERSION = 1;

export const MONSTER_TIERS = Object.freeze(["F", "E", "D", "C", "B", "A", "S"]);
export const MONSTER_TYPES = Object.freeze([
  "biologico",
  "predador biologico",
  "maquina",
  "construto",
  "cultista",
  "saqueador",
  "cosmico",
  "corrompido",
  "ambiental",
  "chefe",
]);
export const MONSTER_ROLES = Object.freeze([
  "minion",
  "predador",
  "brutamontes",
  "controlador",
  "suporte",
  "artilharia",
  "elite",
  "chefe",
  "ameaca recorrente",
]);
export const MONSTER_SIZES = Object.freeze(["minusculo", "pequeno", "medio", "grande", "enorme", "colossal"]);
export const MONSTER_BEHAVIOR_TAGS = Object.freeze(["agressivo", "territorial", "furtivo", "foge", "recua", "negocia", "protege ninho", "patrulha"]);
export const MONSTER_MORALE_STATES = Object.freeze(["steady", "pressured", "retreating", "fleeing", "frenzied", "surrendering"]);
export const MONSTER_SENSE_TYPES = Object.freeze(["visao", "visao_noturna", "olfato", "audicao", "cosmos", "tremor", "termico", "tecnologico"]);
export const MONSTER_RESOURCE_TYPES = Object.freeze(["material", "trofeu", "componente", "organo", "sucata", "amostra", "loot"]);
export const MONSTER_TEMPLATE_TYPES = Object.freeze(["minion", "elite", "boss", "swarm", "legendary", "cosmic", "technological"]);
export const MONSTER_VARIANT_TYPES = Object.freeze(["young", "alpha", "ancient", "wounded", "corrupted", "cosmic", "technological", "mutant", "territorial", "swarm", "elite", "boss"]);
export const MONSTER_THREAT_LEVELS = Object.freeze(["trivial", "facil", "moderado", "dificil", "mortal", "boss"]);

const TIER_POINTS = Object.freeze({ F: 1, E: 2, D: 4, C: 8, B: 16, A: 32, S: 64 });
const SIZE_TOKEN_SCALE = Object.freeze({ minusculo: 0.5, pequeno: 0.75, medio: 1, grande: 2, enorme: 3, colossal: 4 });
const TEMPLATE_CONFIG = Object.freeze({
  minion: Object.freeze({ id: "minion", pvMultiplier: 0.45, caDelta: -1, damageDelta: -1, threatMultiplier: 0.45, usesDeathMarks: false }),
  elite: Object.freeze({ id: "elite", pvMultiplier: 1.5, caDelta: 1, damageDelta: 1, threatMultiplier: 1.5, usesDeathMarks: false }),
  boss: Object.freeze({ id: "boss", pvMultiplier: 2.5, caDelta: 2, damageDelta: 2, threatMultiplier: 2.5, usesDeathMarks: true }),
  swarm: Object.freeze({ id: "swarm", pvMultiplier: 1.8, caDelta: 0, damageDelta: 0, threatMultiplier: 1.35, usesDeathMarks: false }),
  legendary: Object.freeze({ id: "legendary", pvMultiplier: 3, caDelta: 3, damageDelta: 3, threatMultiplier: 3, usesDeathMarks: true }),
  cosmic: Object.freeze({ id: "cosmic", pvMultiplier: 1.25, caDelta: 0, damageDelta: 1, threatMultiplier: 1.25, extraTags: ["cosmico"] }),
  technological: Object.freeze({ id: "technological", pvMultiplier: 1.15, caDelta: 1, damageDelta: 0, threatMultiplier: 1.2, extraTags: ["tecnologico"] }),
});

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function numeric(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value ?? "").replace(",", ".");
  const found = normalized.match(/-?\d+(?:\.\d+)?/);
  const result = found ? Number(found[0]) : Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function integer(value, fallback = 0) {
  return Math.floor(numeric(value, fallback));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function unique(values = []) {
  const seen = new Set();
  return values.filter((value) => {
    const key = normalizeKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_ -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value = "monster") {
  return normalizeKey(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "monster";
}

function nowIso() {
  return new Date().toISOString();
}

function splitList(value = "") {
  if (Array.isArray(value)) return value.flatMap(splitList);
  return String(value || "")
    .replace(/\r/g, "")
    .split(/\n+|;/)
    .map((entry) => entry.replace(/^[\s\p{P}\p{S}\d.)]+/u, "").replace(/[.;]+$/u, "").trim())
    .filter(Boolean);
}

function parseMeters(value) {
  return Math.max(0, numeric(value, 0));
}

function parseTier(value = "") {
  const text = String(value || "").trim().toUpperCase();
  if (MONSTER_TIERS.includes(text)) return text;
  const number = integer(text, 0);
  if (number <= 1) return "F";
  if (number === 2) return "E";
  if (number === 3) return "D";
  if (number === 4) return "C";
  if (number === 5) return "B";
  if (number === 6) return "A";
  return number > 6 ? "S" : "";
}

function canonicalSize(value = "") {
  const key = normalizeKey(value);
  if (key.includes("colossal")) return "colossal";
  if (key.includes("enorme")) return "enorme";
  if (key.includes("grande")) return "grande";
  if (key.includes("pequen")) return "pequeno";
  if (key.includes("minuscul")) return "minusculo";
  if (key.includes("medio") || key.includes("media")) return "medio";
  return key || "medio";
}

function canonicalDamageType(value = "") {
  const key = normalizeKey(value);
  if (/cort/.test(key)) return COMBAT_DAMAGE_TYPES.SLASHING;
  if (/perfur|penetr/.test(key)) return COMBAT_DAMAGE_TYPES.PIERCING;
  if (/concuss|impact|contus/.test(key)) return COMBAT_DAMAGE_TYPES.BLUDGEONING;
  if (/fogo|flama|term|queim/.test(key)) return COMBAT_DAMAGE_TYPES.FIRE;
  if (/eletr|choque|raio/.test(key)) return COMBAT_DAMAGE_TYPES.ELECTRIC;
  if (/acid|corros/.test(key)) return COMBAT_DAMAGE_TYPES.ACID;
  if (/tox|venen|poison/.test(key)) return COMBAT_DAMAGE_TYPES.TOXIC;
  if (/cosm|psiq|mental|energia|eter/.test(key)) return COMBAT_DAMAGE_TYPES.COSMIC;
  if (/emp|pulso/.test(key)) return COMBAT_DAMAGE_TYPES.EMP;
  return "";
}

function conditionFromText(value = "") {
  const key = normalizeKey(value);
  if (/sangr/.test(key)) return { id: COMBAT_CONDITIONS.BLEEDING, key: COMBAT_CONDITIONS.BLEEDING, label: "Sangrando" };
  if (/imobil|presa|agarr/.test(key)) return { id: COMBAT_CONDITIONS.IMMOBILIZED, key: COMBAT_CONDITIONS.IMMOBILIZED, label: "Imobilizado" };
  if (/derrub|caid|prone/.test(key)) return { id: COMBAT_CONDITIONS.PRONE, key: COMBAT_CONDITIONS.PRONE, label: "Caido" };
  if (/atordo|stun/.test(key)) return { id: COMBAT_CONDITIONS.STUNNED, key: COMBAT_CONDITIONS.STUNNED, label: "Atordoado" };
  if (/cego|cegue|visao prejud/.test(key)) return { id: COMBAT_CONDITIONS.BLINDED, key: COMBAT_CONDITIONS.BLINDED, label: "Cego" };
  if (/venen|toxic/.test(key)) return { id: COMBAT_CONDITIONS.POISONED, key: COMBAT_CONDITIONS.POISONED, label: "Envenenado" };
  if (/queim|fogo/.test(key)) return { id: COMBAT_CONDITIONS.BURNING, key: COMBAT_CONDITIONS.BURNING, label: "Queimando" };
  if (/vulner|expost/.test(key)) return { id: COMBAT_CONDITIONS.VULNERABLE, key: COMBAT_CONDITIONS.VULNERABLE, label: "Vulneravel" };
  if (/alvo facil/.test(key)) return { id: COMBAT_CONDITIONS.EASY_TARGET, key: COMBAT_CONDITIONS.EASY_TARGET, label: "Alvo facil" };
  return null;
}

function saveTypeFromText(value = "") {
  const key = normalizeKey(value);
  if (/\bjpf\b|fisic|constitu|forca/.test(key)) return "JPF";
  if (/\bjpr\b|reflex/.test(key)) return "JPR";
  if (/\bjpc\b|\bjpv\b|vontade|cosmic|presenca|mental/.test(key)) return "JPC";
  return "";
}

function parseDice(value = "") {
  const text = String(value || "");
  const match = text.match(/(\d*)d(\d+)\s*([+-]\s*\d+)?/i);
  if (!match) return null;
  return {
    count: Math.max(1, integer(match[1] || 1, 1)),
    sides: Math.max(2, integer(match[2], 6)),
    bonus: match[3] ? integer(String(match[3]).replace(/\s+/g, ""), 0) : 0,
    formula: `${Math.max(1, integer(match[1] || 1, 1))}d${Math.max(2, integer(match[2], 6))}${match[3] ? String(match[3]).replace(/\s+/g, "") : ""}`,
  };
}

function addFixedBonusToFormula(formula = "", delta = 0) {
  const parsed = parseDice(formula);
  if (!parsed || !delta) return formula || "";
  const next = parsed.bonus + delta;
  return `${parsed.count}d${parsed.sides}${next ? (next > 0 ? `+${next}` : String(next)) : ""}`;
}

function parseAttackBonus(value = "") {
  const text = String(value || "");
  const match = text.match(/(?:ataque|acerto|to hit|bonus)\s*([+-]\s*\d+)/i) || text.match(/\b([+-]\s*\d+)\s*(?:para acertar|ataque)\b/i);
  return match ? integer(String(match[1]).replace(/\s+/g, ""), 0) : 0;
}

function parseRangeMeters(value = "") {
  const key = normalizeKey(value);
  if (/corpo a corpo|melee|adjac/.test(key)) return 1.5;
  const match = String(value || "").replace(",", ".").match(/(\d+(?:\.\d+)?)\s*m\b/i);
  return match ? Number(match[1]) : 1.5;
}

function sourceGovernance(entry = {}) {
  return {
    sourceFileCurrent: entry.sourceFileCurrent || entry.sourceGovernance?.sourceFileCurrent || "Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx",
    sourceStatus: entry.sourceStatus || entry.sourceGovernance?.sourceStatus || "current-source-needs-review",
    sourceChapter: entry.sourceChapter || entry.source || entry.sourceReference?.chapter || "",
    dataStability: entry.dataStability || entry.sourceGovernance?.dataStability || "provisional",
    needsReview: entry.needsReview ?? entry.sourceGovernance?.needsReview ?? true,
    reviewReason: entry.reviewReason || entry.sourceGovernance?.reviewReason || "Bestiario normalizado a partir de dados oficiais em revisao.",
  };
}

export function normalizeMonsterAttack(attack = {}, index = 0) {
  const raw = typeof attack === "string" ? { description: attack } : clone(attack) || {};
  const text = String(raw.description || raw.text || raw.label || raw.name || raw.damage || raw.dano || "").replace(/[.;]+$/u, "").trim();
  const colon = text.match(/^([^:]+):\s*(.+)$/);
  const name = String(raw.name || raw.nome || (colon ? colon[1] : text) || `Ataque ${index + 1}`)
    .replace(/^ataques?\s*:?/i, "")
    .trim();
  const damageText = String(raw.damage || raw.dano || raw.effect || (colon ? colon[2] : text) || "");
  const parsed = parseDice(damageText);
  const damageType = raw.damageType || raw.tipoDano || canonicalDamageType([damageText, text, raw.type].join(" "));
  const condition = raw.condition || raw.condicao || conditionFromText([damageText, text, raw.effect].join(" "));
  const rangeSource = raw.range || raw.alcance || text;
  return {
    ...raw,
    id: String(raw.id || raw.attackId || `attack-${index + 1}-${slug(name)}`),
    name: name || `Ataque ${index + 1}`,
    attackAttribute: String(raw.attribute || raw.atributo || raw.attackAttribute || ""),
    attackBonus: numeric(raw.attackBonus ?? raw.bonus ?? parseAttackBonus([raw.attack, raw.ataque, text].join(" ")), 0),
    range: String(raw.range || raw.alcance || ""),
    rangeMeters: numeric(raw.rangeMeters ?? parseRangeMeters(rangeSource), 1.5),
    target: String(raw.target || raw.alvo || "1 alvo"),
    area: String(raw.area || ""),
    damage: parsed?.formula || String(raw.damage || raw.dano || ""),
    damageFormula: parsed?.formula || String(raw.damageFormula || ""),
    damageDice: parsed ? { count: parsed.count, sides: parsed.sides, bonus: parsed.bonus } : null,
    fixedBonus: parsed?.bonus ?? numeric(raw.fixedBonus, 0),
    damageType,
    effect: String(raw.effect || raw.efeito || (parsed ? damageText.replace(parsed.formula, "").trim() : damageText)),
    condition: condition ? normalizeCombatCondition({ ...condition, source: name }) : null,
    saveType: String(raw.saveType || raw.salvamento || saveTypeFromText(text)),
    cooldown: String(raw.cooldown || raw.recarga || ""),
    uses: raw.uses ?? raw.usos ?? "",
    tags: unique([...(raw.tags || []), damageType, condition?.label, raw.type].filter(Boolean)),
    sourceStatus: raw.sourceStatus || "current-source-needs-review",
    needsReview: Boolean(raw.needsReview || !parsed),
    reviewReason: raw.reviewReason || (!parsed ? "Ataque sem formula de dano estruturada." : ""),
    rawText: text,
  };
}

export function normalizeMonsterAbility(ability = {}, index = 0) {
  const raw = typeof ability === "string" ? { description: ability } : clone(ability) || {};
  const text = String(raw.description || raw.effect || raw.text || raw.name || "").replace(/[.;]+$/u, "").trim();
  const heading = text.match(/^(?:habilidade|acao|reacao|fase)\s*[-:]\s*([^:]+):?\s*(.*)$/i);
  const name = String(raw.name || raw.nome || (heading ? heading[1] : "") || `Habilidade ${index + 1}`).trim();
  const effect = String(raw.effect || raw.efeito || raw.description || (heading ? heading[2] : text) || "").trim();
  const parsed = parseDice([raw.damage, raw.dano, effect].join(" "));
  const condition = raw.condition || raw.condicao || conditionFromText(effect);
  const saveType = String(raw.saveType || raw.salvamento || saveTypeFromText(effect));
  return {
    ...raw,
    id: String(raw.id || raw.abilityId || `ability-${index + 1}-${slug(name)}`),
    name,
    type: String(raw.type || raw.tipo || inferAbilityType(effect)),
    actionCost: String(raw.actionCost || raw.acao || inferAbilityAction(effect)),
    range: String(raw.range || raw.alcance || ""),
    target: String(raw.target || raw.alvo || ""),
    duration: String(raw.duration || raw.duracao || ""),
    cooldown: String(raw.cooldown || raw.recarga || ""),
    cost: String(raw.cost || raw.custo || ""),
    trigger: String(raw.trigger || raw.gatilho || ""),
    effect,
    condition: condition ? normalizeCombatCondition({ ...condition, source: name }) : null,
    saveType,
    difficultyClass: numeric(raw.difficultyClass ?? raw.cd ?? parseDifficultyClass(effect), 0),
    damage: parsed?.formula || String(raw.damage || raw.dano || ""),
    damageFormula: parsed?.formula || "",
    damageType: raw.damageType || canonicalDamageType(effect),
    area: String(raw.area || ""),
    tags: unique([...(raw.tags || []), saveType, raw.type, condition?.label].filter(Boolean)),
    sourceStatus: raw.sourceStatus || "current-source-needs-review",
    needsReview: Boolean(raw.needsReview || (!parsed && !condition && !saveType && effect.length > 120)),
    reviewReason: raw.reviewReason || "",
    rawText: text,
  };
}

function inferAbilityType(text = "") {
  const key = normalizeKey(text);
  if (/aura/.test(key)) return "aura";
  if (/reacao|quando/.test(key)) return "reacao";
  if (/invoca|convoca/.test(key)) return "invocacao";
  if (/area|cone|explos/.test(key)) return "area";
  if (/passiv|sempre|recebe/.test(key)) return "passiva";
  if (/foge|recua/.test(key)) return "fuga";
  return "acao";
}

function inferAbilityAction(text = "") {
  const key = normalizeKey(text);
  if (/reacao/.test(key)) return "reacao";
  if (/passiv/.test(key)) return "passiva";
  if (/uma vez por cena|acao/.test(key)) return "acao";
  return "";
}

function parseDifficultyClass(text = "") {
  const match = String(text || "").match(/\bCD\s*(\d+)/i);
  return match ? integer(match[1], 0) : 0;
}

function defensiveList(value = "") {
  const lines = splitList(value);
  if (!lines.length) return [];
  if (lines.some((line) => /nenhum|nenhuma|sem especial/i.test(normalizeKey(line)))) return [];
  return unique(lines.flatMap((line) => {
    const damageType = canonicalDamageType(line);
    return damageType ? [damageType] : [line];
  }));
}

export function normalizeMonsterResistanceProfile(monster = {}) {
  const raw = monster.resistanceProfile || monster.defenses || {};
  const resistances = unique([
    ...defensiveList(raw.resistances || monster.resistances || monster.resistencia),
    ...arrayOf(raw.resistances),
  ]);
  const vulnerabilities = unique([
    ...defensiveList(raw.vulnerabilities || monster.vulnerabilities || monster.weaknesses || monster.fraquezas),
    ...arrayOf(raw.vulnerabilities),
  ]);
  const immunities = unique([
    ...defensiveList(raw.immunities || monster.immunities || monster.imunidades),
    ...arrayOf(raw.immunities),
  ]);
  const conditionImmunities = unique([
    ...splitList(raw.conditionImmunities || monster.conditionImmunities || ""),
    ...arrayOf(raw.conditionImmunities),
  ]);
  return {
    resistances,
    vulnerabilities,
    immunities,
    damageReduction: clone(raw.damageReduction || monster.damageReduction || {}) || {},
    conditionImmunities,
    weaknessNotes: splitList(monster.weaknesses || monster.fraquezas || raw.weaknessNotes || ""),
    notes: splitList([monster.resistancesText, monster.resistances, monster.weaknesses].filter(Boolean).join("\n")),
  };
}

function senseType(line = "") {
  const key = normalizeKey(line);
  if (/noturn|escuro/.test(key)) return "visao_noturna";
  if (/olfato/.test(key)) return "olfato";
  if (/audicao|audio|som/.test(key)) return "audicao";
  if (/cosm/.test(key)) return "cosmos";
  if (/tremor|sism/.test(key)) return "tremor";
  if (/term|infraverm/.test(key)) return "termico";
  if (/radar|sonar|tecnolog/.test(key)) return "tecnologico";
  return "visao";
}

export function computeMonsterSenses(monster = {}) {
  const source = monster.sensesProfile || monster.senses || monster.sentidos || "";
  const entries = Array.isArray(source)
    ? source.map((sense, index) => typeof sense === "string" ? { id: `sense-${index + 1}`, label: sense } : sense)
    : splitList(source).map((line, index) => ({ id: `sense-${index + 1}`, label: line }));
  return entries.map((entry, index) => ({
    id: String(entry.id || `sense-${index + 1}`),
    type: String(entry.type || senseType(entry.label || entry.name || entry.description)),
    label: String(entry.label || entry.name || entry.description || "Sentido"),
    rangeMeters: numeric(entry.rangeMeters ?? entry.range, 0),
    notes: String(entry.notes || entry.description || ""),
  }));
}

export function normalizeMonsterLootProfile(monster = {}) {
  const resourceText = monster.resources || monster.recursos || monster.parts || monster.materials || "";
  const parsedNames = parseMonsterLootResources(resourceText);
  const resourceNames = parsedNames.length > 1 ? parsedNames : splitList(resourceText);
  const resources = resourceNames.map((name, index) => ({
    id: `resource-${index + 1}-${slug(name)}`,
    name,
    type: inferResourceType(name),
    quantity: 1,
    collectionDifficulty: numeric(monster.collectionDifficulty, 10 + index),
    collectionSkill: String(monster.collectionSkill || "Coleta"),
    collectionRisk: String(monster.collectionRisk || ""),
    collectionTime: String(monster.collectionTime || "1 acao ou alguns minutos, conforme cena"),
    sourceStatus: monster.sourceStatus || "current-source-needs-review",
  }));
  const lootTable = arrayOf(monster.lootTable).length ? clone(monster.lootTable) : buildMonsterLootTable(resourceNames.join("\n"));
  return {
    resources,
    parts: resources.filter((entry) => ["orgao", "trofeu", "componente"].includes(entry.type)),
    materials: resources.filter((entry) => ["material", "sucata", "amostra"].includes(entry.type)),
    trophies: resources.filter((entry) => entry.type === "trofeu"),
    lootTable,
    rewardSuggestion: monster.rewardSuggestion || monster.reward || monster.recompensa || "",
    collectionDifficulty: numeric(monster.collectionDifficulty, 10),
    collectionSkill: String(monster.collectionSkill || "Coleta"),
    collectionRisk: String(monster.collectionRisk || ""),
    collectionTime: String(monster.collectionTime || ""),
    sourceStatus: monster.sourceStatus || "current-source-needs-review",
  };
}

function inferResourceType(name = "") {
  const key = normalizeKey(name);
  if (/garra|dente|chifre|carapaca|couro|trofeu/.test(key)) return "trofeu";
  if (/gland|orgao|sangue|veneno|tecido/.test(key)) return "orgao";
  if (/nucleo|modulo|circuit|placa|sucata/.test(key)) return "sucata";
  if (/amostra|esporo|fungo|cristal/.test(key)) return "amostra";
  if (/tend|fibra|material|barra|mineral/.test(key)) return "material";
  return "componente";
}

export function normalizeMonsterMoraleProfile(monster = {}) {
  const text = String(monster.moralProfile?.text || monster.morale || monster.moral || "");
  const key = normalizeKey(text);
  const thresholds = [];
  if (/metade|50|meia/.test(key)) thresholds.push({ atPvRatio: 0.5, action: "testar moral", resultOnFailure: "recua ou foge" });
  if (/gravemente ferid|baixo pv|perto de morrer/.test(key)) thresholds.push({ atPvRatio: 0.25, action: "testar moral", resultOnFailure: "foge" });
  if (/ninho|territorio|proteg/.test(key)) thresholds.push({ trigger: "territorio_ameacado", action: "protege ninho/territorio" });
  return {
    state: monster.moralProfile?.state || "steady",
    text,
    thresholds,
    defaultBehavior: String(monster.behavior || monster.comportamento || ""),
    woundedBehavior: key.includes("ferid") ? text : "",
    retreatBehavior: key.includes("recua") ? text : "",
    objective: String(monster.objective || monster.narrativeObjective || ""),
    needsReview: Boolean(monster.moralProfile?.needsReview || !text),
  };
}

export function normalizeMonsterEntry(entry = {}) {
  const raw = clone(entry) || {};
  const id = String(raw.id || raw.monsterId || `monster-${slug(raw.name || raw.nome || "sem-nome")}`);
  const name = String(raw.name || raw.nome || "Monstro sem nome");
  const tier = parseTier(raw.tier || raw.rank || raw.nivel);
  const pv = Math.max(0, numeric(raw.maxPV ?? raw.pvMax ?? raw.pv, 0));
  const ca = Math.max(0, numeric(raw.ca ?? raw.CA, 0));
  const movementMeters = parseMeters(raw.movement ?? raw.movimento);
  const attacksSource = arrayOf(raw.attacks).length ? raw.attacks : splitList(raw.attacks || raw.attack || raw.ataques);
  const abilitiesSource = arrayOf(raw.abilities).length ? raw.abilities : splitList(raw.abilities || raw.habilidades || raw.ability);
  const attacks = attacksSource.map(normalizeMonsterAttack).filter((attack) => attack.name);
  const abilities = abilitiesSource.map(normalizeMonsterAbility).filter((ability) => ability.name);
  const resistanceProfile = normalizeMonsterResistanceProfile(raw);
  const sensesProfile = computeMonsterSenses(raw);
  const lootProfile = normalizeMonsterLootProfile(raw);
  const moraleProfile = normalizeMonsterMoraleProfile(raw);
  const governance = sourceGovernance(raw);
  const missing = [];
  if (!tier) missing.push("tier");
  if (!pv) missing.push("PV");
  if (!ca) missing.push("CA");
  if (!movementMeters) missing.push("movimento");
  if (!attacks.length) missing.push("ataques");
  const needsReview = Boolean(governance.needsReview || missing.length || raw.needsReview);
  return {
    ...raw,
    id,
    category: "monster",
    name,
    tier,
    rank: String(raw.rank || tier || ""),
    type: String(raw.type || raw.tipo || ""),
    role: String(raw.role || raw.papel || ""),
    size: canonicalSize(raw.size || raw.tamanho),
    tokenSize: SIZE_TOKEN_SCALE[canonicalSize(raw.size || raw.tamanho)] || 1,
    habitat: String(raw.habitat || ""),
    behavior: String(raw.behavior || raw.comportamento || ""),
    pv,
    maxPV: pv,
    currentPV: numeric(raw.currentPV ?? raw.pvAtual, pv),
    ca,
    movement: movementMeters || raw.movement || raw.movimento || "",
    movementMeters,
    movementLabel: raw.movementLabel || raw.movement || raw.movimento || (movementMeters ? `${movementMeters} m` : ""),
    attributes: normalizeMonsterAttributes(raw.attributes),
    attacks,
    abilities,
    conditionsApplied: unique([
      ...attacks.flatMap((attack) => attack.condition ? [attack.condition.label] : []),
      ...abilities.flatMap((ability) => ability.condition ? [ability.condition.label] : []),
      ...splitList(raw.conditionsApplied || raw.condicoes || ""),
    ]),
    resistanceProfile,
    resistances: resistanceProfile.resistances,
    vulnerabilities: resistanceProfile.vulnerabilities,
    immunities: resistanceProfile.immunities,
    damageReduction: resistanceProfile.damageReduction,
    conditionImmunities: resistanceProfile.conditionImmunities,
    sensesProfile,
    senses: sensesProfile.map((sense) => sense.label).join("; ") || raw.senses || raw.sentidos || "",
    moraleProfile,
    lootProfile,
    resourcesStructured: lootProfile.resources,
    lootTable: lootProfile.lootTable,
    rewardSuggestion: lootProfile.rewardSuggestion,
    clueHooks: splitList(raw.clueHooks || raw.pistas || ""),
    moralChoiceHooks: splitList(raw.moralChoiceHooks || raw.escolhasMorais || ""),
    recurringThreatHooks: splitList(raw.recurringThreatHooks || raw.ameacaRecorrente || ""),
    ecologicalNotes: String(raw.ecologicalNotes || raw.ecology || raw.ecologia || ""),
    narrativeUse: String(raw.narrativeUse || raw.campaign || raw.summary || ""),
    factionLinks: splitList(raw.factionLinks || raw.faction || ""),
    locationLinks: splitList(raw.locationLinks || raw.habitat || ""),
    campaignHooks: splitList(raw.campaignHooks || raw.campaign || raw.summary || ""),
    bestiarySchemaVersion: BESTIARY_SCHEMA_VERSION,
    sourceGovernance: governance,
    sourceFileCurrent: governance.sourceFileCurrent,
    sourceStatus: governance.sourceStatus,
    sourceChapter: governance.sourceChapter,
    dataStability: governance.dataStability,
    needsReview,
    reviewReason: raw.reviewReason || (missing.length ? `Campos pendentes: ${missing.join(", ")}.` : governance.reviewReason),
  };
}

function normalizeMonsterAttributes(value = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) return clone(value);
  const text = String(value || "");
  const result = {};
  for (const match of text.matchAll(/\b(FOR|REF|CON|MEN|PRE|INT)\s*(\d+)(?:\s*\/\s*MOD\s*([+-]?\d+))?/gi)) {
    result[match[1].toUpperCase()] = {
      value: numeric(match[2], 0),
      modifier: match[3] === undefined ? Math.floor((numeric(match[2], 10) - 10) / 2) : numeric(match[3], 0),
    };
  }
  return Object.keys(result).length ? result : { summary: text };
}

export function createMonsterState(monster = {}, options = {}) {
  const normalized = normalizeMonsterEntry(monster);
  return {
    ...normalized,
    id: String(options.id || monster.instanceId || monster.sessionMonsterId || normalized.id),
    definitionId: String(monster.definitionId || normalized.id),
    currentPV: Math.max(0, numeric(options.currentPV ?? normalized.currentPV, normalized.maxPV)),
    maxPV: Math.max(1, numeric(options.maxPV ?? normalized.maxPV, 1)),
    conditions: arrayOf(options.conditions || monster.conditions).map(normalizeCombatCondition),
    collectedResources: arrayOf(options.collectedResources || monster.collectedResources),
    usedAbilities: arrayOf(options.usedAbilities || monster.usedAbilities),
    abilityCooldowns: clone(options.abilityCooldowns || monster.abilityCooldowns || {}) || {},
    monsterStateCreatedAt: options.createdAt || monster.monsterStateCreatedAt || nowIso(),
  };
}

export function validateMonsterSheet(monster = {}) {
  const normalized = normalizeMonsterEntry(monster);
  const errors = [];
  const warnings = [];
  if (!normalized.id) errors.push("Monstro sem id.");
  if (!normalized.name || normalized.name === "Monstro sem nome") errors.push("Monstro sem nome.");
  if (!normalized.tier) warnings.push("Monstro sem tier valido.");
  if (!normalized.maxPV) errors.push("Monstro sem PV numerico.");
  if (!normalized.ca) warnings.push("Monstro sem CA numerica.");
  if (!normalized.movementMeters) warnings.push("Monstro sem movimento numerico.");
  if (!normalized.attacks.length) warnings.push("Monstro sem ataque estruturado.");
  if (normalized.needsReview) warnings.push(normalized.reviewReason);
  return {
    valid: errors.length === 0,
    errors,
    warnings: unique(warnings),
    normalized,
  };
}

export function computeMonsterDefenses(monster = {}) {
  const normalized = normalizeMonsterEntry(monster);
  return {
    ca: normalized.ca,
    pv: normalized.maxPV,
    maxPV: normalized.maxPV,
    resistances: normalized.resistanceProfile.resistances,
    vulnerabilities: normalized.resistanceProfile.vulnerabilities,
    immunities: normalized.resistanceProfile.immunities,
    damageReduction: normalized.resistanceProfile.damageReduction,
    conditionImmunities: normalized.resistanceProfile.conditionImmunities,
  };
}

export function computeMonsterCombatProfile(monster = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const state = createCombatantState({
    ...normalized,
    id: monster.id || normalized.id,
    entityId: monster.id || normalized.id,
    entityType: "monster",
    name: monster.name || normalized.name,
    currentPV: numeric(monster.currentPV ?? monster.pvCurrent ?? normalized.currentPV, normalized.maxPV),
    maxPV: numeric(monster.maxPV ?? normalized.maxPV, normalized.maxPV),
    ca: normalized.ca,
    movement: normalized.movementMeters,
    resistances: normalized.resistanceProfile.resistances,
    vulnerabilities: normalized.resistanceProfile.vulnerabilities,
    immunities: normalized.resistanceProfile.immunities,
    reductions: normalized.resistanceProfile.damageReduction,
    conditions: monster.conditions || normalized.conditions || [],
    usesDeathMarks: Boolean(monster.usesDeathMarks ?? normalized.usesDeathMarks ?? normalizeKey(normalized.role).includes("chefe")),
  });
  return {
    ...state,
    ca: normalized.ca,
    movement: normalized.movementMeters,
    attacks: normalized.attacks,
    abilities: normalized.abilities,
    senses: normalized.sensesProfile,
    defenses: computeMonsterDefenses(normalized),
    morale: normalized.moraleProfile,
    lootProfile: normalized.lootProfile,
    sourceGovernance: normalized.sourceGovernance,
    bestiarySchemaVersion: BESTIARY_SCHEMA_VERSION,
  };
}

function selectByIdOrIndex(list = [], idOrIndex = "") {
  if (!list.length) return null;
  if (idOrIndex === "" || idOrIndex === null || idOrIndex === undefined) return list[0];
  if (typeof idOrIndex === "number") return list[idOrIndex] || list[0];
  return list.find((entry) => entry.id === idOrIndex || normalizeKey(entry.name) === normalizeKey(idOrIndex)) || list[0];
}

export function computeMonsterAttackProfile(monster = {}, attackId = "") {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const attack = selectByIdOrIndex(normalized.attacks, attackId);
  if (!attack) return null;
  return {
    monsterId: normalized.id,
    monsterName: normalized.name,
    ...attack,
    attackBonus: numeric(attack.attackBonus, 0),
    formula: "1d20",
    targetCA: null,
    compatibleWithCombat: true,
  };
}

export function computeMonsterDamageProfile(monster = {}, attackId = "") {
  const profile = computeMonsterAttackProfile(monster, attackId);
  if (!profile) return null;
  const parsed = parseDice(profile.damageFormula || profile.damage || profile.rawText || "");
  return {
    attackId: profile.id,
    attackName: profile.name,
    formula: parsed?.formula || profile.damageFormula || profile.damage || "",
    diceCount: parsed?.count || 0,
    dieSize: parsed?.sides || 0,
    fixedBonus: parsed?.bonus || 0,
    damageType: profile.damageType || canonicalDamageType(profile.rawText),
    effect: profile.effect || "",
    condition: profile.condition || null,
    compatibleWithCombat: Boolean(parsed),
  };
}

export function computeMonsterInitiativeProfile(monster = {}, options = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const ref = normalized.attributes?.REF;
  const modifier = numeric(options.modifier ?? ref?.modifier ?? normalized.initiative ?? 0, 0);
  return {
    ...rollInitiative({ roll: options.roll, modifier, bonus: options.bonus || 0 }),
    monsterId: normalized.id,
    monsterName: normalized.name,
    attribute: "REF",
  };
}

export function resolveMonsterAttack({ monster = {}, target = {}, attackId = "", roll = 10, context = {} } = {}) {
  const attacker = computeMonsterCombatProfile(monster);
  const targetState = createCombatantState(target);
  const attack = computeMonsterAttackProfile(monster, attackId);
  if (!attack) {
    return { ok: false, error: "Monstro sem ataque estruturado.", attacker, target: targetState };
  }
  const attackResult = resolveAttackRoll({
    attacker,
    target: targetState,
    roll,
    bonuses: numeric(context.bonuses ?? context.bonus, 0),
    cover: context.cover || "none",
    rangeState: context.rangeState || {},
    attributeUsed: attack.attackAttribute || "",
    attributeModifier: attack.attackBonus,
    weapon: context.weapon || {},
  });
  let targetCombatant = targetState;
  let damageRoll = null;
  let damageApplication = null;
  let conditionApplication = null;
  const damageProfile = computeMonsterDamageProfile(monster, attack.id);
  if (attackResult.isHit && damageProfile?.compatibleWithCombat) {
    damageRoll = resolveDamageRoll({
      expression: damageProfile.formula,
      rolls: context.damageRolls,
      isCritical: attackResult.isCritical,
    });
    damageApplication = applyDamageToCombatant({
      combatant: targetCombatant,
      amount: damageRoll.total,
      damageType: damageProfile.damageType,
      source: attack.name,
      isCritical: attackResult.isCritical,
      options: context.damageOptions || {},
    });
    targetCombatant = damageApplication.combatant;
  }
  if (attackResult.isHit && attack.condition) {
    conditionApplication = applyConditionToCombatant({
      combatant: targetCombatant,
      condition: {
        ...attack.condition,
        source: `${attacker.name} - ${attack.name}`,
        duration: attack.condition.duration ?? context.conditionDuration,
      },
    });
    targetCombatant = conditionApplication.combatant;
  }
  return {
    ok: true,
    attacker,
    target: targetCombatant,
    attack,
    attackResult,
    damageProfile,
    damageRoll,
    damageApplication,
    conditionApplication,
    log: `${attacker.name} usou ${attack.name} em ${targetState.name}: ${attackResult.isHit ? "acertou" : "errou"} (${attackResult.total} vs CA ${attackResult.targetCA}).`,
  };
}

export function resolveMonsterAbilityUse({ monster = {}, target = {}, abilityId = "", context = {} } = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const ability = selectByIdOrIndex(normalized.abilities, abilityId);
  const targetState = target?.id || target?.name ? createCombatantState(target) : null;
  if (!ability) return { ok: false, error: "Monstro sem habilidade estruturada.", monster: normalized };
  let targetCombatant = targetState;
  let damageRoll = null;
  let damageApplication = null;
  let conditionApplication = null;
  if (ability.damageFormula && targetCombatant) {
    damageRoll = resolveDamageRoll({
      expression: ability.damageFormula,
      rolls: context.damageRolls,
      isCritical: Boolean(context.isCritical),
    });
    damageApplication = applyDamageToCombatant({
      combatant: targetCombatant,
      amount: damageRoll.total,
      damageType: ability.damageType,
      source: ability.name,
      options: context.damageOptions || {},
    });
    targetCombatant = damageApplication.combatant;
  }
  if (ability.condition && targetCombatant) {
    conditionApplication = applyConditionToCombatant({
      combatant: targetCombatant,
      condition: { ...ability.condition, source: `${normalized.name} - ${ability.name}` },
    });
    targetCombatant = conditionApplication.combatant;
  }
  return {
    ok: true,
    monster: normalized,
    ability,
    target: targetCombatant,
    requiresSave: Boolean(ability.saveType),
    save: ability.saveType ? { type: ability.saveType, difficultyClass: ability.difficultyClass || context.difficultyClass || 10 } : null,
    damageRoll,
    damageApplication,
    conditionApplication,
    log: `${normalized.name} usou ${ability.name}.`,
  };
}

export function resolveMonsterMoraleCheck({ monster = {}, context = {}, roll = 10 } = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const maxPV = Math.max(1, numeric(monster.maxPV ?? normalized.maxPV, normalized.maxPV));
  const currentPV = Math.max(0, numeric(monster.currentPV ?? normalized.currentPV, maxPV));
  const ratio = currentPV / maxPV;
  const profile = normalized.moraleProfile;
  let outcome = "continua lutando";
  if (ratio <= 0.25 && roll < 15) outcome = "foge";
  else if (ratio <= 0.5 && roll < 12) outcome = "recua";
  if (context.protectingNest || normalizeKey(profile.text).includes("ninho")) outcome = roll < 8 ? "entra em furia" : "protege aliado/ninho";
  if (context.intelligent && roll <= 4) outcome = "se rende";
  return {
    monsterId: normalized.id,
    monsterName: normalized.name,
    roll,
    pvRatio: Number(ratio.toFixed(2)),
    outcome,
    moraleState: outcome === "continua lutando" ? "steady" : outcome === "foge" ? "fleeing" : "retreating",
    profile,
  };
}

export function resolveMonsterLoot(monster = {}, context = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const table = arrayOf(context.lootTable).length ? context.lootTable : normalized.lootProfile.lootTable;
  const result = rollMonsterLoot(table, context.random || Math.random, {
    reason: context.reason || (context.defeated ? "derrota" : "manual"),
    createdAt: context.createdAt,
  });
  return {
    monsterId: normalized.id,
    monsterName: normalized.name,
    lootProfile: normalized.lootProfile,
    result,
    drops: result.drops,
    log: result.drops.length
      ? `${normalized.name} gerou loot: ${result.drops.map((drop) => `${drop.quantity}x ${drop.name}`).join(", ")}.`
      : `${normalized.name} nao gerou loot nesta rolagem.`,
  };
}

export function collectMonsterResource({ monster = {}, resourceId = "", roll = 10, collector = {} } = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const resource = selectByIdOrIndex(normalized.lootProfile.resources, resourceId);
  if (!resource) return { ok: false, error: "Recurso coletavel nao encontrado.", monster: normalized };
  const difficulty = numeric(resource.collectionDifficulty, normalized.lootProfile.collectionDifficulty || 10);
  const bonus = numeric(collector.bonus ?? collector.modifier, 0);
  const total = numeric(roll, 0) + bonus;
  const success = total >= difficulty;
  return {
    ok: true,
    success,
    roll,
    bonus,
    total,
    difficulty,
    skill: resource.collectionSkill || normalized.lootProfile.collectionSkill,
    resource,
    item: success ? {
      id: `collected-${slug(resource.name)}-${Date.now()}`,
      name: resource.name,
      category: "material",
      type: resource.type,
      quantity: resource.quantity || 1,
      sourceMonsterId: normalized.id,
      sourceMonsterName: normalized.name,
    } : null,
    log: success
      ? `${collector.name || "Coletor"} coletou ${resource.name} de ${normalized.name}.`
      : `${collector.name || "Coletor"} falhou ao coletar ${resource.name}.`,
  };
}

function transformMonster(monster = {}, transform = {}, label = "template") {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const pvMultiplier = numeric(transform.pvMultiplier, 1);
  const caDelta = numeric(transform.caDelta, 0);
  const damageDelta = numeric(transform.damageDelta, 0);
  const next = {
    ...normalized,
    id: transform.keepId ? normalized.id : `${normalized.id}-${slug(transform.id || label)}`,
    name: transform.name || `${normalized.name} (${transform.label || transform.id || label})`,
    maxPV: Math.max(1, Math.round(normalized.maxPV * pvMultiplier)),
    pv: Math.max(1, Math.round(normalized.maxPV * pvMultiplier)),
    currentPV: Math.max(1, Math.round(normalized.maxPV * pvMultiplier)),
    ca: Math.max(0, normalized.ca + caDelta),
    attacks: normalized.attacks.map((attack) => ({
      ...attack,
      damage: addFixedBonusToFormula(attack.damageFormula || attack.damage, damageDelta),
      damageFormula: addFixedBonusToFormula(attack.damageFormula || attack.damage, damageDelta),
      fixedBonus: numeric(attack.fixedBonus, 0) + damageDelta,
    })),
    tags: unique([...(normalized.tags || []), ...(transform.extraTags || []), transform.id || label].filter(Boolean)),
    usesDeathMarks: Boolean(transform.usesDeathMarks ?? normalized.usesDeathMarks),
    threatMultiplier: numeric(transform.threatMultiplier, normalized.threatMultiplier || 1),
    needsReview: true,
    reviewReason: `Versao ${label} usa modificadores configuraveis e deve ser conferida pelo mestre.`,
  };
  next.lootProfile = {
    ...normalized.lootProfile,
    rewardSuggestion: transform.rewardSuggestion || normalized.lootProfile.rewardSuggestion,
  };
  return next;
}

export function applyMonsterVariant(monster = {}, variantId = "alpha", options = {}) {
  const configs = {
    young: { id: "young", label: "jovem", pvMultiplier: 0.7, caDelta: -1, damageDelta: 0, threatMultiplier: 0.7 },
    alpha: { id: "alpha", label: "alfa", pvMultiplier: 1.35, caDelta: 1, damageDelta: 1, threatMultiplier: 1.35 },
    ancient: { id: "ancient", label: "anciao", pvMultiplier: 1.6, caDelta: 1, damageDelta: 1, threatMultiplier: 1.6 },
    wounded: { id: "wounded", label: "ferido", pvMultiplier: 0.5, caDelta: 0, damageDelta: 0, threatMultiplier: 0.8 },
    corrupted: { id: "corrupted", label: "corrompido", pvMultiplier: 1.2, caDelta: 0, damageDelta: 1, threatMultiplier: 1.25, extraTags: ["corrompido"] },
    cosmic: TEMPLATE_CONFIG.cosmic,
    technological: TEMPLATE_CONFIG.technological,
    mutant: { id: "mutant", label: "mutante", pvMultiplier: 1.2, caDelta: 0, damageDelta: 1, threatMultiplier: 1.2, extraTags: ["mutante"] },
    territorial: { id: "territorial", label: "territorial", pvMultiplier: 1.1, caDelta: 0, damageDelta: 0, threatMultiplier: 1.1, extraTags: ["territorial"] },
    swarm: TEMPLATE_CONFIG.swarm,
    elite: TEMPLATE_CONFIG.elite,
    boss: TEMPLATE_CONFIG.boss,
  };
  const config = { ...(configs[variantId] || configs.alpha), ...clone(options) };
  const result = transformMonster(monster, config, "variant");
  result.monsterVariantState = { id: config.id || variantId, appliedAt: nowIso(), config };
  return result;
}

export function applyMonsterTemplate(monster = {}, templateId = "elite", options = {}) {
  const config = { ...(TEMPLATE_CONFIG[templateId] || TEMPLATE_CONFIG.elite), ...clone(options) };
  const result = transformMonster(monster, config, "template");
  result.monsterTemplateState = { id: config.id || templateId, appliedAt: nowIso(), config };
  return result;
}

export function createBossVersion(monster = {}, options = {}) {
  return applyMonsterTemplate(monster, "boss", options);
}

export function createMinionVersion(monster = {}, options = {}) {
  return applyMonsterTemplate(monster, "minion", options);
}

export function createEliteVersion(monster = {}, options = {}) {
  return applyMonsterTemplate(monster, "elite", options);
}

export function createSwarmVersion(monster = {}, options = {}) {
  return applyMonsterTemplate(monster, "swarm", options);
}

export function createMonsterTokenDefaults(monster = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  return {
    entityType: "monster",
    entityId: monster.id || normalized.id,
    name: normalized.name,
    size: normalized.tokenSize || SIZE_TOKEN_SCALE[normalized.size] || 1,
    image: normalized.imageDataUrl || normalized.image || "",
    color: normalizeKey(normalized.role).includes("chefe") ? "#ff4e63" : "#b14dff",
    movement: normalized.movementMeters,
    metadata: {
      tier: normalized.tier,
      role: normalized.role,
      type: normalized.type,
      sizeLabel: normalized.size,
      ca: normalized.ca,
      movement: normalized.movementMeters,
      bestiarySchemaVersion: BESTIARY_SCHEMA_VERSION,
    },
  };
}

export function createSessionMonsterFromBestiary(monster = {}, options = {}) {
  const state = createMonsterState(monster, options);
  const token = createMonsterTokenDefaults(state);
  const snapshot = {
    ...state,
    tokenSize: token.size,
    tokenDefaults: token,
    monsterCombatProfile: computeMonsterCombatProfile(state),
    monsterLootProfile: state.lootProfile,
    monsterMoraleProfile: state.moraleProfile,
    monsterSource: state.sourceGovernance,
    sourceGovernance: state.sourceGovernance,
  };
  return {
    id: String(options.id || options.sessionMonsterId || `shared-${state.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    definitionId: state.definitionId || state.id,
    name: state.name,
    snapshot,
    conditions: arrayOf(options.conditions || state.conditions),
    hidden: Boolean(options.hidden),
    notes: String(options.notes || state.notes || ""),
    bestiarySchemaVersion: BESTIARY_SCHEMA_VERSION,
    monsterState: state,
    monsterSource: state.sourceGovernance,
    monsterCombatProfile: snapshot.monsterCombatProfile,
    monsterLootProfile: state.lootProfile,
    monsterMoraleProfile: state.moraleProfile,
    monsterVariantState: state.monsterVariantState || null,
    monsterTemplateState: state.monsterTemplateState || null,
    collectedResources: arrayOf(state.collectedResources),
    usedAbilities: arrayOf(state.usedAbilities),
    abilityCooldowns: clone(state.abilityCooldowns || {}) || {},
    sourceGovernance: state.sourceGovernance,
  };
}

export function estimateMonsterThreat(monster = {}) {
  const normalized = normalizeMonsterEntry(monster.snapshot || monster);
  const tierPoints = TIER_POINTS[normalized.tier] || 1;
  const roleKey = normalizeKey([normalized.role, normalized.type, ...(normalized.tags || [])].join(" "));
  let multiplier = numeric(normalized.threatMultiplier, 0);
  if (!multiplier) {
    if (/boss|chefe|lendaria|legend/.test(roleKey)) multiplier = 2.5;
    else if (/elite|alfa|vanguarda/.test(roleKey)) multiplier = 1.5;
    else if (/minion|larva|drone|enxame|fraco/.test(roleKey)) multiplier = 0.7;
    else if (/controlador|suporte|artilharia|conjur/.test(roleKey)) multiplier = 1.15;
    else multiplier = 1;
  }
  const score = Number((tierPoints * multiplier).toFixed(2));
  return {
    monsterId: normalized.id,
    monsterName: normalized.name,
    tier: normalized.tier,
    role: normalized.role,
    score,
    xpSuggestion: Math.max(10, Math.round(score * 35)),
    classification: score >= 24 ? "boss" : score >= 12 ? "mortal" : score >= 7 ? "dificil" : score >= 3 ? "moderado" : score >= 1.5 ? "facil" : "trivial",
  };
}

export function estimateEncounterThreat(monsters = [], partyContext = {}) {
  const entries = arrayOf(monsters).map(estimateMonsterThreat);
  const totalThreat = Number(entries.reduce((sum, entry) => sum + entry.score, 0).toFixed(2));
  const partySize = Math.max(1, numeric(partyContext.partySize ?? partyContext.characters?.length, 4));
  const averageLevel = Math.max(1, numeric(partyContext.averageLevel ?? partyContext.level, 1));
  const partyBudget = Number((partySize * averageLevel * 2).toFixed(2));
  const ratio = partyBudget ? totalThreat / partyBudget : totalThreat;
  const classification = totalThreat === 0 ? "trivial"
    : ratio < 0.45 ? "trivial"
      : ratio < 0.75 ? "facil"
        : ratio < 1.15 ? "moderado"
          : ratio < 1.65 ? "dificil"
            : "mortal";
  return {
    entries,
    totalThreat,
    partySize,
    averageLevel,
    partyBudget,
    ratio: Number(ratio.toFixed(2)),
    classification,
    rewardSuggestion: Math.max(25, Math.round(totalThreat * 35)),
  };
}

export function serializeMonsterState(monster = {}) {
  return JSON.stringify(hydrateMonsterState(monster), null, 2);
}

export function hydrateMonsterState(monster = {}) {
  const source = typeof monster === "string" ? JSON.parse(monster) : clone(monster) || {};
  if (source.bestiarySchemaVersion === BESTIARY_SCHEMA_VERSION && source.monsterState) {
    return {
      ...source,
      monsterState: createMonsterState(source.monsterState),
      snapshot: source.snapshot ? createMonsterState(source.snapshot) : source.snapshot,
    };
  }
  return createMonsterState(source.snapshot || source);
}
