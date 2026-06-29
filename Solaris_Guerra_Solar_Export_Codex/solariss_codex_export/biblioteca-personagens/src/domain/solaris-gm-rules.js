export const GM_SCHEMA_VERSION = 1;

export const MISSION_TYPES = Object.freeze({
  EXPLORATION: "exploracao",
  COMBAT: "combate",
  RESCUE: "resgate",
  ESCORT: "escolta",
  COLLECTION: "coleta",
  INVESTIGATION: "investigacao",
  SOCIAL: "social",
  COSMIC: "cosmica",
});

export const MISSION_PHASES = Object.freeze([
  "chamado",
  "preparacao",
  "viagem-ou-entrada",
  "execucao",
  "retorno-e-consequencia",
  "concluida",
  "fracassada",
]);

export const MISSION_OBJECTIVE_TYPES = Object.freeze({
  PRIMARY: "principal",
  SECONDARY: "secundario",
  HIDDEN: "oculto",
  MORAL: "escolha-moral",
  FACTION: "faccao",
  RESOURCE: "recurso",
});

export const MISSION_RISK_LEVELS = Object.freeze({
  SIMPLE: "simples",
  DANGEROUS: "perigosa",
  VERY_DANGEROUS: "muito-perigosa",
  HIGH_THREAT: "alta-ameaca",
  CRITICAL: "critica-ou-rara",
});

export const MISSION_COMPLICATION_TYPES = Object.freeze({
  OMITTED_INFORMATION: "informacao-omitida",
  RIVAL_FACTION: "faccao-rival",
  ENVIRONMENT_WORSENS: "ambiente-mais-perigoso",
  MOVING_TARGET: "alvo-em-movimento",
  DAMAGED_OBJECTIVE: "objetivo-danificado",
  NPC_IN_DANGER: "npc-em-perigo",
  HIDDEN_COSMIC_THREAT: "ameaca-cosmica-oculta",
  UNSECURED_REWARD: "recompensa-incerta",
  STEALTH_REQUIRED: "discricao-obrigatoria",
  INNOCENTS_INVOLVED: "inocentes-envolvidos",
  TIME_LIMIT_REDUCED: "tempo-reduzido",
  BIGGER_PROBLEM: "problema-maior",
});

export const TRAVEL_PACES = Object.freeze({
  CAUTIOUS: "cauteloso",
  NORMAL: "normal",
  FAST: "rapido",
  FORCED: "forcado",
});

export const TERRAIN_TYPES = Object.freeze({
  SIMPLE: "simples",
  DIFFICULT: "dificil",
  DANGEROUS: "perigoso",
});

export const TERRAIN_DIFFICULTY_LEVELS = Object.freeze({
  simples: Object.freeze({ id: "simples", difficulty: 0, movementMultiplier: 1, description: "Sem penalidade relevante." }),
  dificil: Object.freeze({ id: "dificil", difficulty: 2, movementMultiplier: 0.5, description: "Reduz movimento, ritmo ou exige teste sob pressao." }),
  perigoso: Object.freeze({ id: "perigoso", difficulty: 4, movementMultiplier: 0.5, description: "Pode causar dano, condicao, rachadura, Estresse ou perda de recurso." }),
});

export const ENVIRONMENT_HAZARD_TYPES = Object.freeze({
  HEAT: "calor-extremo",
  COLD: "frio-extremo",
  MUD_RAIN: "chuva-e-lama",
  ELECTRIC_STORM: "tempestade-eletrica",
  FOG_DUST: "nevoa-fumaca-poeira",
  COSMIC_STORM: "tempestade-cosmica",
  TOXIC: "toxico-ou-esporos",
  RADIATION: "radiacao",
  COSMIC_ZONE: "zona-cosmica",
  GRAVITY: "gravidade-alterada",
  VACUUM: "vacuo",
  WATER: "agua-pantano",
  INSTABILITY: "estrutura-instavel",
});

export const RESOURCE_TYPES = Object.freeze({
  WATER: "agua",
  FOOD: "comida",
  OXYGEN: "oxigenio",
  FILTERS: "filtros",
  BATTERY: "bateria",
  AMMUNITION: "municao",
  MEDICINE: "medicina",
  PARTS: "pecas",
  CUBES: "cubos-vazios",
  SHELTER: "abrigo",
  TIME: "tempo",
  MORALE: "moral",
  INFORMATION: "informacao",
});

export const RESOURCE_PRESSURE_LEVELS = Object.freeze({
  STABLE: "estavel",
  WATCH: "atencao",
  PRESSURED: "pressionado",
  CRITICAL: "critico",
  DEPLETED: "esgotado",
});

export const REWARD_TYPES = Object.freeze({
  LUZENTIS: "luzentis",
  EQUIPMENT: "equipamento",
  MATERIAL: "material",
  INFORMATION: "informacao",
  REPUTATION: "reputacao",
  FAVOR: "favor",
  LOOT: "loot",
});

export const REPUTATION_STATES = Object.freeze({
  "-3": "inimigo-declarado",
  "-2": "hostil",
  "-1": "desconfiado",
  0: "neutro",
  1: "conhecido-favoravelmente",
  2: "aliado",
  3: "confiavel-ou-heroi-local",
});

export const FACTION_RELATION_STATES = Object.freeze({
  DECLARED_ENEMY: "inimigo-declarado",
  HOSTILE: "hostil",
  SUSPICIOUS: "desconfiado",
  NEUTRAL: "neutro",
  FRIENDLY_CONTACT: "contato-amigavel",
  ALLIED: "aliado",
  PROTECTOR: "protetor-ou-parceiro-forte",
});

export const FACTION_TYPES = Object.freeze({
  GOVERNMENT: "governo",
  PATROL: "patrulha",
  MEDICAL: "enfermaria",
  FORGE: "forja",
  SCAVENGER: "sucateiros",
  SCIENTIST: "cientistas",
  TRADER: "comerciantes",
  COLONY: "colonia",
  RAIDER: "saqueadores",
  CULT: "culto-cosmico",
  MILITARY: "militar",
  ANCIENT: "antiga",
  OTHER: "outro",
});

export const GM_EVENT_TYPES = Object.freeze({
  MISSION: "missao",
  TRAVEL: "viagem",
  RESOURCE: "recurso",
  REPUTATION: "reputacao",
  FACTION: "faccao",
  HACKING: "hacking",
  BASE: "base",
  REWARD: "recompensa",
  CONSEQUENCE: "consequencia",
  CLOCK: "contador",
});

export const CAMPAIGN_CLOCK_TYPES = Object.freeze({
  MISSION: "missao",
  THREAT: "ameaca",
  TRAVEL: "viagem",
  RESOURCE: "recurso",
  FACTION: "faccao",
  BASE: "base",
  COSMIC: "cosmico",
  COUNTDOWN: "contagem",
});

export const CONSEQUENCE_TYPES = Object.freeze({
  RESOURCE_LOSS: "perda-de-recurso",
  STRESS: "estresse",
  CONDITION: "condicao",
  CRACK: "rachadura",
  REPUTATION: "reputacao",
  THREAT: "ameaca",
  DELAY: "atraso",
  CLUE: "pista",
  MORAL: "moral",
  WORLD_CHANGE: "mudanca-no-mundo",
});

export const HACKING_ACTIONS = Object.freeze({
  ACCESS_SERVER: "acessar-servidor",
  BREAK_NODE: "quebrar-no",
  ERASE_TRACES: "apagar-rastros",
  STEAL_DATA: "roubar-dados",
  CONTROL_ACCESS: "controlar-acesso",
  DISABLE_ALARM: "desativar-alarme",
  CONTROL_DEVICE: "controlar-drone-torreta",
  CONTROL_VEHICLE: "controlar-veiculo",
  COUNTER_INTRUSION: "resistir-contra-invasao",
  END_ACCESS: "encerrar-acesso",
});

export const BASE_ATTRIBUTES = Object.freeze([
  "agua",
  "comida",
  "energia",
  "medicina",
  "oficina",
  "defesa",
  "moral",
  "seguranca",
  "producao",
  "comunicacao",
  "armazenamento",
]);

const MISSION_REWARD_RANGES = Object.freeze({
  [MISSION_RISK_LEVELS.SIMPLE]: Object.freeze([1000, 3000]),
  [MISSION_RISK_LEVELS.DANGEROUS]: Object.freeze([4000, 10000]),
  [MISSION_RISK_LEVELS.VERY_DANGEROUS]: Object.freeze([12000, 30000]),
  [MISSION_RISK_LEVELS.HIGH_THREAT]: Object.freeze([40000, 100000]),
  [MISSION_RISK_LEVELS.CRITICAL]: Object.freeze([100000, 150000]),
});

const TRAVEL_EVENTS = Object.freeze([
  "Criatura ou predador seguindo o grupo",
  "Mudanca brusca de clima",
  "Recurso encontrado em local perigoso",
  "Rastro de outro grupo",
  "Equipamento sofre falha ou interferencia",
  "Terreno dificil ou rota bloqueada",
  "Pequena ruina ou estrutura abandonada",
  "Agua, comida ou material contaminado",
  "Patrulha, saqueadores ou viajantes",
  "Sinal tecnologico ou pedido de socorro",
  "Fenomeno cosmico menor",
  "Descoberta valiosa ou atalho seguro",
]);

const MISSION_COMPLICATIONS = Object.freeze([
  [MISSION_COMPLICATION_TYPES.OMITTED_INFORMATION, "O contratante omitiu informacao importante."],
  [MISSION_COMPLICATION_TYPES.RIVAL_FACTION, "Outra faccao busca o mesmo objetivo."],
  [MISSION_COMPLICATION_TYPES.ENVIRONMENT_WORSENS, "O ambiente ficou mais perigoso do que esperado."],
  [MISSION_COMPLICATION_TYPES.MOVING_TARGET, "O alvo da missao esta se movendo."],
  [MISSION_COMPLICATION_TYPES.DAMAGED_OBJECTIVE, "O objetivo principal esta danificado."],
  [MISSION_COMPLICATION_TYPES.NPC_IN_DANGER, "Um aliado ou NPC esta em perigo."],
  [MISSION_COMPLICATION_TYPES.HIDDEN_COSMIC_THREAT, "O local possui ameaca cosmica nao informada."],
  [MISSION_COMPLICATION_TYPES.UNSECURED_REWARD, "A recompensa prometida nao esta garantida."],
  [MISSION_COMPLICATION_TYPES.STEALTH_REQUIRED, "A missao precisa ser feita sem chamar atencao."],
  [MISSION_COMPLICATION_TYPES.INNOCENTS_INVOLVED, "O grupo encontra inocentes envolvidos."],
  [MISSION_COMPLICATION_TYPES.TIME_LIMIT_REDUCED, "O tempo limite diminui."],
  [MISSION_COMPLICATION_TYPES.BIGGER_PROBLEM, "Cumprir a missao cria um problema maior."],
]);

const BASE_EVENTS = Object.freeze([
  "Nada grave acontece",
  "Falha de energia",
  "Doenca se espalha",
  "Caravana chega",
  "Boato perigoso surge",
  "Saqueadores observam a base",
  "Criatura ataca recurso externo",
  "Conflito interno",
  "Equipamento importante quebra",
  "Faccao envia proposta",
  "Sinal antigo e captado",
  "Evento cosmico leve afeta a base",
]);

const HAZARD_CONFIG = Object.freeze({
  [ENVIRONMENT_HAZARD_TYPES.HEAT]: Object.freeze({ save: "JPF", attribute: "CON", dc: 12, effects: ["consumo de agua dobrado", "Exausto ou Tonto em falha"] }),
  [ENVIRONMENT_HAZARD_TYPES.COLD]: Object.freeze({ save: "JPF", attribute: "CON", dc: 12, effects: ["Congelando", "Exausto", "bateria prejudicada"] }),
  [ENVIRONMENT_HAZARD_TYPES.MUD_RAIN]: Object.freeze({ save: "JPR", attribute: "REF", dc: 10, effects: ["terreno dificil", "queda", "falha de vedacao"] }),
  [ENVIRONMENT_HAZARD_TYPES.ELECTRIC_STORM]: Object.freeze({ save: "JPR", attribute: "REF", dc: 14, effects: ["dano eletrico", "Jammed", "falha de drone"] }),
  [ENVIRONMENT_HAZARD_TYPES.FOG_DUST]: Object.freeze({ save: "JPF", attribute: "CON", dc: 10, effects: ["visao reduzida", "respiracao em risco"] }),
  [ENVIRONMENT_HAZARD_TYPES.COSMIC_STORM]: Object.freeze({ save: "JPC", attribute: "MEN/PRE", dc: 14, effects: ["Estresse", "interferencia", "falha cosmica"] }),
  [ENVIRONMENT_HAZARD_TYPES.TOXIC]: Object.freeze({ save: "JPF", attribute: "CON", dc: 12, effects: ["Tonto", "Envenenado", "filtro saturado"] }),
  [ENVIRONMENT_HAZARD_TYPES.RADIATION]: Object.freeze({ save: "JPF", attribute: "CON", dc: 14, effects: ["Irradiado", "recuperacao prejudicada", "Ferimento Grave"] }),
  [ENVIRONMENT_HAZARD_TYPES.COSMIC_ZONE]: Object.freeze({ save: "JPC", attribute: "MEN/PRE", dc: 14, effects: ["Marcado pelo Cosmos", "visoes", "perda de orientacao"] }),
  [ENVIRONMENT_HAZARD_TYPES.GRAVITY]: Object.freeze({ save: "JPF", attribute: "CON", dc: 12, effects: ["movimento alterado", "carga alterada", "quedas perigosas"] }),
  [ENVIRONMENT_HAZARD_TYPES.VACUUM]: Object.freeze({ save: "JPF", attribute: "CON", dc: 16, effects: ["Sufocando", "frio extremo", "pressao"] }),
  [ENVIRONMENT_HAZARD_TYPES.WATER]: Object.freeze({ save: "JPF", attribute: "CON", dc: 12, effects: ["movimento reduzido", "perda de cubos", "contaminacao"] }),
  [ENVIRONMENT_HAZARD_TYPES.INSTABILITY]: Object.freeze({ save: "JPR", attribute: "REF", dc: 12, effects: ["queda", "desabamento", "contador avanca"] }),
});

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function objectOf(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function numeric(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
  const normalized = String(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.+-]/g, "");
  const result = Number(normalized);
  return Number.isFinite(result) ? result : fallback;
}

function integer(value, fallback = 0) {
  return Math.floor(numeric(value, fallback));
}

function bounded(value, min, max, fallback = min) {
  return Math.min(max, Math.max(min, numeric(value, fallback)));
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = "gm") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

function normalizeTags(value = []) {
  if (Array.isArray(value)) return value.map((entry) => String(entry || "").trim()).filter(Boolean);
  return String(value || "").split(/[,;\n]+/).map((entry) => entry.trim()).filter(Boolean);
}

function normalizeRisk(value = "") {
  const key = normalizeKey(value);
  if (/crit|rara|s\b/.test(key)) return MISSION_RISK_LEVELS.CRITICAL;
  if (/alta|ameaca|mortal|a\b/.test(key)) return MISSION_RISK_LEVELS.HIGH_THREAT;
  if (/muito|severa|grave|dificil/.test(key)) return MISSION_RISK_LEVELS.VERY_DANGEROUS;
  if (/perig/.test(key)) return MISSION_RISK_LEVELS.DANGEROUS;
  return MISSION_RISK_LEVELS.SIMPLE;
}

function normalizeMissionType(value = "") {
  const key = normalizeKey(value);
  if (/comb|cac|eliminar/.test(key)) return MISSION_TYPES.COMBAT;
  if (/resgat|salvar/.test(key)) return MISSION_TYPES.RESCUE;
  if (/escolt|comboio|carga/.test(key)) return MISSION_TYPES.ESCORT;
  if (/colet|amostra|material/.test(key)) return MISSION_TYPES.COLLECTION;
  if (/invest|sinal|pista/.test(key)) return MISSION_TYPES.INVESTIGATION;
  if (/social|negoc|facc|fac/.test(key)) return MISSION_TYPES.SOCIAL;
  if (/cosm|tharan|falaris|uryon/.test(key)) return MISSION_TYPES.COSMIC;
  return MISSION_TYPES.EXPLORATION;
}

function nextPhase(current = "", direction = "next") {
  const index = MISSION_PHASES.indexOf(current);
  if (index < 0) return MISSION_PHASES[0];
  if (MISSION_PHASES.includes(direction)) return direction;
  if (direction === "previous") return MISSION_PHASES[Math.max(0, index - 1)];
  return MISSION_PHASES[Math.min(MISSION_PHASES.length - 1, index + 1)];
}

export function createMissionObjective(value = {}) {
  return normalizeMissionObjective(value);
}

export function normalizeMissionObjective(value = {}, index = 0) {
  const progressMax = Math.max(1, numeric(value.progressMax ?? value.max ?? 1, 1));
  const progressCurrent = bounded(value.progressCurrent ?? value.current ?? 0, 0, progressMax, 0);
  const status = String(value.status || (progressCurrent >= progressMax ? "completed" : "open"));
  return {
    id: String(value.id || createId("objective")),
    title: String(value.title || value.name || value.label || `Objetivo ${index + 1}`),
    type: String(value.type || (index === 0 ? MISSION_OBJECTIVE_TYPES.PRIMARY : MISSION_OBJECTIVE_TYPES.SECONDARY)),
    description: String(value.description || value.notes || ""),
    progressCurrent,
    progressMax,
    status,
    completed: Boolean(value.completed || status === "completed" || progressCurrent >= progressMax),
    failed: Boolean(value.failed || status === "failed"),
    reward: clone(value.reward || {}) || {},
    consequences: arrayOf(value.consequences).map((entry) => normalizeConsequence(entry)),
    visibleToPlayers: value.visibleToPlayers !== false,
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function normalizeMissionEntry(value = {}) {
  const riskLevel = normalizeRisk(value.riskLevel || value.risk || value.difficulty);
  const objectives = arrayOf(value.objectives).map(normalizeMissionObjective);
  const mainObjective = String(value.mainObjective || value.objective || value.goal || "");
  if (!objectives.length && mainObjective) objectives.push(normalizeMissionObjective({ title: mainObjective, type: MISSION_OBJECTIVE_TYPES.PRIMARY }));
  const reward = computeMissionReward({ riskLevel, level: value.level || value.nivel || 1, secondaryCompleted: objectives.filter((entry) => entry.completed && entry.type !== MISSION_OBJECTIVE_TYPES.PRIMARY).length });
  return {
    id: String(value.id || createId("mission")),
    name: String(value.name || value.title || "Missao sem nome"),
    type: normalizeMissionType(value.type || value.category || value.name),
    phase: MISSION_PHASES.includes(value.phase) ? value.phase : MISSION_PHASES[0],
    status: String(value.status || "active"),
    riskLevel,
    objective: mainObjective,
    location: String(value.location || value.local || ""),
    contractor: String(value.contractor || value.contratante || ""),
    motivation: String(value.motivation || value.motivacao || ""),
    briefing: String(value.briefing || value.description || value.summary || ""),
    information: String(value.information || value.info || ""),
    missingInformation: String(value.missingInformation || value.incompleteInformation || ""),
    objectives,
    complications: arrayOf(value.complications).map(normalizeMissionComplication),
    clocks: arrayOf(value.clocks).map(createCampaignClock),
    resources: normalizeTags(value.resources || value.importantResources),
    rewards: arrayOf(value.rewards).length ? arrayOf(value.rewards).map(normalizeRewardEntry) : [reward],
    consequences: arrayOf(value.consequences).map(normalizeConsequence),
    factionIds: normalizeTags(value.factionIds || value.factions),
    loreLinks: normalizeTags(value.loreLinks || value.linkedLore || value.loreIds),
    source: String(value.source || ""),
    sourceLoreId: String(value.sourceLoreId || value.loreId || ""),
    visibleToPlayers: value.visibleToPlayers !== false,
    sourceFileCurrent: String(value.sourceFileCurrent || "Livro_2_Guia_do_Mestre_rifles_corrigido.docx"),
    sourceStatus: String(value.sourceStatus || "current-source-needs-review"),
    needsReview: value.needsReview !== false,
    reviewReason: String(value.reviewReason || "Valores narrativos e faixas de recompensa dependem de ajuste do mestre por campanha."),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function createMissionState(value = {}) {
  return hydrateGmState({
    activeMissionId: value.activeMissionId || value.mission?.id || "",
    missions: arrayOf(value.missions).length ? value.missions : (value.mission ? [value.mission] : []),
    rewards: value.rewards || [],
    consequences: value.consequences || [],
    gmEvents: value.gmEvents || value.events || [],
  });
}

export function advanceMissionPhase(mission = {}, direction = "next") {
  const next = normalizeMissionEntry(mission);
  next.phase = nextPhase(next.phase, direction);
  if (next.phase === "concluida") next.status = "completed";
  if (next.phase === "fracassada") next.status = "failed";
  next.updatedAt = nowIso();
  next.events = [
    ...(arrayOf(next.events)),
    createGmEvent({ type: GM_EVENT_TYPES.MISSION, targetId: next.id, targetName: next.name, message: `Missao avancou para ${next.phase}.` }),
  ];
  return next;
}

export function resolveMissionComplication(mission = {}, options = {}) {
  const roll = Math.max(1, integer(options.roll, Math.floor(Math.random() * MISSION_COMPLICATIONS.length) + 1));
  const [type, description] = MISSION_COMPLICATIONS[(roll - 1) % MISSION_COMPLICATIONS.length];
  const complication = normalizeMissionComplication({
    type: options.type || type,
    description: options.description || description,
    roll,
    status: "active",
  });
  const next = normalizeMissionEntry(mission);
  next.complications = [complication, ...next.complications].slice(0, 20);
  next.updatedAt = nowIso();
  return { mission: next, complication };
}

export function completeMissionObjective(mission = {}, objectiveId = "") {
  const next = normalizeMissionEntry(mission);
  next.objectives = next.objectives.map((objective) => {
    if (objective.id !== objectiveId && objective.title !== objectiveId) return objective;
    return normalizeMissionObjective({ ...objective, progressCurrent: objective.progressMax, status: "completed", completed: true, updatedAt: nowIso() });
  });
  if (next.objectives.length && next.objectives.every((objective) => objective.completed || objective.type !== MISSION_OBJECTIVE_TYPES.PRIMARY)) {
    next.status = "completed";
    next.phase = "concluida";
  }
  next.updatedAt = nowIso();
  return next;
}

export function failMissionObjective(mission = {}, objectiveId = "") {
  const next = normalizeMissionEntry(mission);
  next.objectives = next.objectives.map((objective) => {
    if (objective.id !== objectiveId && objective.title !== objectiveId) return objective;
    return normalizeMissionObjective({ ...objective, status: "failed", failed: true, updatedAt: nowIso() });
  });
  if (next.objectives.some((objective) => objective.type === MISSION_OBJECTIVE_TYPES.PRIMARY && objective.failed)) {
    next.status = "failed";
    next.phase = "fracassada";
  }
  next.updatedAt = nowIso();
  return next;
}

export function computeMissionReward(input = {}) {
  const riskLevel = normalizeRisk(input.riskLevel || input.risk || input.difficulty);
  const [min, max] = MISSION_REWARD_RANGES[riskLevel] || MISSION_REWARD_RANGES[MISSION_RISK_LEVELS.SIMPLE];
  const level = Math.max(1, numeric(input.level || input.nivel, 1));
  const secondaryCompleted = Math.max(0, numeric(input.secondaryCompleted, 0));
  const multiplier = 1 + Math.max(0, level - 1) * 0.12 + secondaryCompleted * 0.1;
  const low = Math.round(min * multiplier);
  const high = Math.round(max * multiplier);
  return normalizeRewardEntry({
    type: REWARD_TYPES.LUZENTIS,
    name: `Recompensa ${riskLevel}`,
    amount: Math.round((low + high) / 2),
    min,
    max,
    scaledMin: low,
    scaledMax: high,
    notes: "Faixa sugerida pelo Livro 2; ajuste por risco, faccao e custo narrativo.",
  });
}

export function computeMissionRisk(mission = {}) {
  const normalized = normalizeMissionEntry(mission);
  const riskIndex = Object.values(MISSION_RISK_LEVELS).indexOf(normalized.riskLevel);
  const complications = normalized.complications.filter((entry) => entry.status !== "resolved").length;
  const clocks = normalized.clocks.filter((clock) => clock.status !== "resolved").length;
  const hiddenObjectives = normalized.objectives.filter((objective) => objective.type === MISSION_OBJECTIVE_TYPES.HIDDEN && !objective.completed).length;
  const score = Math.max(1, riskIndex + 1) * 2 + complications + clocks + hiddenObjectives;
  const label = score >= 12 ? "critico" : score >= 9 ? "alto" : score >= 6 ? "moderado" : "baixo";
  return {
    score,
    label,
    riskLevel: normalized.riskLevel,
    complications,
    clocks,
    hiddenObjectives,
    warnings: [
      ...(complications ? [`${complications} complicacao(oes) ativa(s).`] : []),
      ...(clocks ? [`${clocks} contador(es) pressionando a missao.`] : []),
      ...(hiddenObjectives ? ["Ha objetivo oculto ainda nao resolvido."] : []),
    ],
  };
}

function normalizeMissionComplication(value = {}) {
  return {
    id: String(value.id || createId("complication")),
    type: String(value.type || MISSION_COMPLICATION_TYPES.OMITTED_INFORMATION),
    description: String(value.description || value.text || ""),
    roll: Math.max(0, integer(value.roll, 0)),
    status: String(value.status || "active"),
    consequences: arrayOf(value.consequences).map(normalizeConsequence),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function createTravelRoute(value = {}) {
  return normalizeTravelRoute(value);
}

export function normalizeTravelRoute(value = {}) {
  const hazards = arrayOf(value.hazards).map(normalizeEnvironmentHazard);
  return {
    id: String(value.id || createId("route")),
    name: String(value.name || value.title || "Rota sem nome"),
    origin: String(value.origin || value.from || ""),
    destination: String(value.destination || value.to || ""),
    duration: String(value.duration || value.time || ""),
    pace: Object.values(TRAVEL_PACES).includes(value.pace) ? value.pace : TRAVEL_PACES.NORMAL,
    terrain: Object.values(TERRAIN_TYPES).includes(value.terrain) ? value.terrain : TERRAIN_TYPES.SIMPLE,
    resourcesRequired: normalizeTags(value.resourcesRequired || value.resources),
    threat: String(value.threat || value.ameaca || ""),
    reward: String(value.reward || ""),
    cost: String(value.cost || value.custo || ""),
    hazards,
    events: arrayOf(value.events).map(createGmEvent),
    status: String(value.status || "planned"),
    visibleToPlayers: value.visibleToPlayers !== false,
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function computeTravelDifficulty(route = {}) {
  const normalized = normalizeTravelRoute(route);
  const terrain = TERRAIN_DIFFICULTY_LEVELS[normalized.terrain] || TERRAIN_DIFFICULTY_LEVELS.simples;
  const pacePenalty = normalized.pace === TRAVEL_PACES.CAUTIOUS ? -1 : normalized.pace === TRAVEL_PACES.FAST ? 1 : normalized.pace === TRAVEL_PACES.FORCED ? 3 : 0;
  const hazardPenalty = normalized.hazards.reduce((sum, hazard) => sum + Math.max(1, numeric(hazard.intensity, 1)), 0);
  const difficulty = Math.max(0, terrain.difficulty + pacePenalty + hazardPenalty);
  return {
    difficulty,
    classification: difficulty >= 9 ? "letal" : difficulty >= 6 ? "perigosa" : difficulty >= 3 ? "tensa" : "segura",
    movementMultiplier: terrain.movementMultiplier,
    resourcePressure: normalized.resourcesRequired.length + Math.max(0, pacePenalty),
    suggestedSave: normalized.hazards[0]?.save || (normalized.pace === TRAVEL_PACES.FORCED ? "JPF" : ""),
    notes: terrain.description,
  };
}

export function resolveTravelEvent(route = {}, options = {}) {
  const normalized = normalizeTravelRoute(route);
  const roll = Math.max(1, integer(options.roll, Math.floor(Math.random() * 12) + 1));
  const eventName = options.event || TRAVEL_EVENTS[(roll - 1) % TRAVEL_EVENTS.length];
  const event = createGmEvent({
    type: GM_EVENT_TYPES.TRAVEL,
    targetId: normalized.id,
    targetName: normalized.name,
    roll,
    message: eventName,
    data: { routeId: normalized.id, travelDifficulty: computeTravelDifficulty(normalized) },
  });
  normalized.events = [event, ...normalized.events].slice(0, 40);
  normalized.updatedAt = nowIso();
  return { route: normalized, event };
}

export function normalizeEnvironmentHazard(value = {}) {
  const type = Object.values(ENVIRONMENT_HAZARD_TYPES).includes(value.type) ? value.type : ENVIRONMENT_HAZARD_TYPES.TOXIC;
  const config = HAZARD_CONFIG[type] || HAZARD_CONFIG[ENVIRONMENT_HAZARD_TYPES.TOXIC];
  return {
    id: String(value.id || createId("hazard")),
    name: String(value.name || value.title || type),
    type,
    intensity: bounded(value.intensity ?? value.level, 1, 5, 1),
    frequency: String(value.frequency || value.frequencia || ""),
    save: String(value.save || config.save),
    attribute: String(value.attribute || config.attribute),
    dc: Math.max(5, numeric(value.dc || value.cd, config.dc)),
    effects: normalizeTags(value.effects || config.effects),
    protections: normalizeTags(value.protections || value.protection),
    active: value.active !== false,
    notes: String(value.notes || value.description || ""),
  };
}

export function createEnvironmentHazard(value = {}) {
  return normalizeEnvironmentHazard(value);
}

export function applyEnvironmentHazard(target = {}, hazard = {}, context = {}) {
  const normalized = normalizeEnvironmentHazard(hazard);
  const protectedBy = normalizeTags(context.protectedBy || target.protections || target.equipment);
  const hasProtection = normalized.protections.some((entry) => protectedBy.map(normalizeKey).includes(normalizeKey(entry)));
  const dc = Math.max(5, normalized.dc + normalized.intensity - (hasProtection ? 2 : 0));
  const consequences = [
    ...(hasProtection ? [] : normalized.effects.map((effect) => normalizeConsequence({ type: CONSEQUENCE_TYPES.CONDITION, description: effect }))),
    ...(normalized.intensity >= 4 ? [normalizeConsequence({ type: CONSEQUENCE_TYPES.STRESS, amount: 1, description: "+1 Estresse por exposicao severa." })] : []),
  ];
  return {
    targetId: target.id || "",
    hazard: normalized,
    save: normalized.save,
    attribute: normalized.attribute,
    dc,
    hasProtection,
    consequences,
  };
}

export function createResourceTrack(value = {}) {
  const max = Math.max(1, numeric(value.max ?? value.maximum ?? 5, 5));
  const current = bounded(value.current ?? value.value ?? max, 0, max, max);
  const track = {
    id: String(value.id || createId("resource")),
    name: String(value.name || value.label || value.type || "Recurso"),
    type: String(value.type || RESOURCE_TYPES.WATER),
    current,
    max,
    unit: String(value.unit || "ponto(s)"),
    pressure: RESOURCE_PRESSURE_LEVELS.STABLE,
    location: String(value.location || "grupo"),
    shared: value.shared !== false,
    notes: String(value.notes || value.description || ""),
    history: arrayOf(value.history).map(createGmEvent),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
  track.pressure = computeResourcePressure(track).state;
  return track;
}

export function consumeResource(resource = {}, amount = 1, reason = "") {
  const next = createResourceTrack(resource);
  const value = Math.max(0, numeric(amount, 1));
  next.current = bounded(next.current - value, 0, next.max, next.current);
  next.pressure = computeResourcePressure(next).state;
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.RESOURCE, targetId: next.id, targetName: next.name, message: reason || `Consumo de ${value} ${next.unit}.`, data: { delta: -value } }),
    ...next.history,
  ].slice(0, 40);
  return next;
}

export function restoreResource(resource = {}, amount = 1, reason = "") {
  const next = createResourceTrack(resource);
  const value = Math.max(0, numeric(amount, 1));
  next.current = bounded(next.current + value, 0, next.max, next.current);
  next.pressure = computeResourcePressure(next).state;
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.RESOURCE, targetId: next.id, targetName: next.name, message: reason || `Recuperacao de ${value} ${next.unit}.`, data: { delta: value } }),
    ...next.history,
  ].slice(0, 40);
  return next;
}

export function computeResourcePressure(resourceOrList = {}) {
  const normalizePressureInput = (value = {}) => {
    const max = Math.max(1, numeric(value.max ?? value.maximum ?? 5, 5));
    const current = bounded(value.current ?? value.value ?? max, 0, max, max);
    return {
      name: String(value.name || value.label || value.type || "Recurso"),
      current,
      max,
    };
  };
  const resources = (Array.isArray(resourceOrList) ? resourceOrList : [resourceOrList]).map(normalizePressureInput);
  const ratios = resources.map((entry) => entry.max > 0 ? entry.current / entry.max : 0);
  const ratio = ratios.length ? Math.min(...ratios) : 1;
  const state = ratio <= 0
    ? RESOURCE_PRESSURE_LEVELS.DEPLETED
    : ratio <= 0.2
      ? RESOURCE_PRESSURE_LEVELS.CRITICAL
      : ratio <= 0.45
        ? RESOURCE_PRESSURE_LEVELS.PRESSURED
        : ratio <= 0.7
          ? RESOURCE_PRESSURE_LEVELS.WATCH
          : RESOURCE_PRESSURE_LEVELS.STABLE;
  return {
    state,
    ratio: Number(ratio.toFixed(2)),
    criticalResources: resources.filter((entry) => entry.max > 0 && entry.current / entry.max <= 0.2).map((entry) => entry.name),
  };
}

export function createFactionState(value = {}) {
  const reputation = bounded(value.reputation ?? value.score ?? 0, -3, 3, 0);
  return {
    id: String(value.id || createId("faction")),
    name: String(value.name || "Faccao sem nome"),
    type: String(value.type || FACTION_TYPES.OTHER),
    goal: String(value.goal || value.objective || ""),
    resource: String(value.resource || ""),
    fear: String(value.fear || ""),
    publicFace: String(value.publicFace || value.representative || ""),
    allies: normalizeTags(value.allies),
    rivals: normalizeTags(value.rivals),
    offers: String(value.offers || ""),
    demands: String(value.demands || ""),
    secret: String(value.secret || ""),
    reputation,
    relation: computeFactionRelation(reputation).state,
    contacts: arrayOf(value.contacts).map((entry) => clone(entry)),
    loreId: String(value.loreId || value.sourceLoreId || ""),
    loreLinks: normalizeTags(value.loreLinks || value.linkedLore || value.loreIds || (value.loreId ? [value.loreId] : [])),
    history: arrayOf(value.history).map(createGmEvent),
    visibleToPlayers: value.visibleToPlayers !== false,
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function updateFactionReputation(faction = {}, delta = 0, reason = "") {
  const next = createFactionState(faction);
  const previous = next.reputation;
  next.reputation = bounded(previous + numeric(delta, 0), -3, 3, previous);
  next.relation = computeFactionRelation(next.reputation).state;
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({
      type: GM_EVENT_TYPES.REPUTATION,
      targetId: next.id,
      targetName: next.name,
      message: reason || `Reputacao mudou de ${previous} para ${next.reputation}.`,
      data: { previous, current: next.reputation, delta: next.reputation - previous },
    }),
    ...next.history,
  ].slice(0, 60);
  return next;
}

export function computeFactionRelation(value = 0) {
  const score = bounded(typeof value === "object" ? value.reputation ?? value.score : value, -3, 3, 0);
  const state = REPUTATION_STATES[String(score)] || REPUTATION_STATES[0];
  const label = {
    "inimigo-declarado": "Inimigo declarado",
    hostil: "Hostil",
    desconfiado: "Desconfiado",
    neutro: "Neutro",
    "conhecido-favoravelmente": "Conhecido favoravelmente",
    aliado: "Aliado",
    "confiavel-ou-heroi-local": "Confiavel ou heroi local",
  }[state] || "Neutro";
  return { score, state, label };
}

export function createCampaignClock(value = {}) {
  const max = Math.max(1, numeric(value.max ?? value.maximum ?? 6, 6));
  const current = bounded(value.current ?? value.value ?? (value.direction === "down" ? max : 0), 0, max, value.direction === "down" ? max : 0);
  return {
    id: String(value.id || createId("clock")),
    name: String(value.name || "Contador de campanha"),
    type: String(value.type || CAMPAIGN_CLOCK_TYPES.THREAT),
    current,
    max,
    direction: String(value.direction || "down"),
    status: String(value.status || (current === 0 || current === max ? "ready" : "active")),
    triggerText: String(value.triggerText || ""),
    visibleToPlayers: Boolean(value.visibleToPlayers || value.revealed),
    revealed: Boolean(value.revealed),
    notes: String(value.notes || value.description || ""),
    loreId: String(value.loreId || value.sourceLoreId || ""),
    loreLinks: normalizeTags(value.loreLinks || value.linkedLore || value.loreIds || (value.loreId ? [value.loreId] : [])),
    history: arrayOf(value.history).map(createGmEvent),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function advanceCampaignClock(clock = {}, amount = 1) {
  const next = createCampaignClock(clock);
  const delta = numeric(amount, 1);
  const previous = next.current;
  next.current = next.direction === "down"
    ? bounded(next.current - delta, 0, next.max, next.current)
    : bounded(next.current + delta, 0, next.max, next.current);
  next.status = next.current === 0 || next.current === next.max ? "triggered" : "active";
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.CLOCK, targetId: next.id, targetName: next.name, message: `${next.name}: ${previous} -> ${next.current}.`, data: { previous, current: next.current } }),
    ...next.history,
  ].slice(0, 40);
  return next;
}

export function resolveCampaignClock(clock = {}, context = {}) {
  const next = createCampaignClock(clock);
  next.status = String(context.status || "resolved");
  next.resolution = String(context.resolution || context.message || next.triggerText || "Contador resolvido.");
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.CLOCK, targetId: next.id, targetName: next.name, message: next.resolution }),
    ...next.history,
  ].slice(0, 40);
  return next;
}

export function createGmEvent(value = {}) {
  return {
    id: String(value.id || createId("gm-event")),
    type: String(value.type || GM_EVENT_TYPES.CONSEQUENCE),
    targetId: String(value.targetId || ""),
    targetName: String(value.targetName || ""),
    actorId: String(value.actorId || ""),
    actorName: String(value.actorName || "Mestre"),
    roll: value.roll === undefined ? null : numeric(value.roll, 0),
    message: String(value.message || value.description || ""),
    severity: String(value.severity || "info"),
    data: clone(value.data || {}) || {},
    visibleToPlayers: Boolean(value.visibleToPlayers),
    createdAt: value.createdAt || nowIso(),
  };
}

export function generateMissionSeed(options = {}) {
  const objective = [
    "Resgatar alguem",
    "Recuperar item",
    "Eliminar ameaca",
    "Investigar sinal",
    "Escoltar carga",
    "Coletar material",
  ][Math.max(0, integer(options.objectiveRoll, Math.floor(Math.random() * 6)) % 6)];
  const location = ["Ruina", "Pantano", "Colonia", "Instalacao antiga", "Estrada hostil", "Zona cosmica"][Math.max(0, integer(options.locationRoll, Math.floor(Math.random() * 6)) % 6)];
  const complication = generateComplicationSeed(options);
  return normalizeMissionEntry({
    name: `${objective} em ${location}`,
    objective,
    location,
    riskLevel: options.riskLevel || MISSION_RISK_LEVELS.DANGEROUS,
    complications: [complication],
    contractor: options.contractor || "Contratante local",
    briefing: `Missao rapida: ${objective.toLowerCase()} em ${location.toLowerCase()}.`,
  });
}

export function generateTravelEventSeed(options = {}) {
  const roll = Math.max(1, integer(options.roll, Math.floor(Math.random() * 12) + 1));
  return createGmEvent({ type: GM_EVENT_TYPES.TRAVEL, roll, message: TRAVEL_EVENTS[(roll - 1) % TRAVEL_EVENTS.length] });
}

export function generateComplicationSeed(options = {}) {
  const roll = Math.max(1, integer(options.roll, Math.floor(Math.random() * 12) + 1));
  const [type, description] = MISSION_COMPLICATIONS[(roll - 1) % MISSION_COMPLICATIONS.length];
  return normalizeMissionComplication({ type, description, roll });
}

export function generateRewardSeed(options = {}) {
  return computeMissionReward({
    riskLevel: options.riskLevel || options.risk || MISSION_RISK_LEVELS.SIMPLE,
    level: options.level || 1,
    secondaryCompleted: options.secondaryCompleted || 0,
  });
}

export function createHackingChallenge(value = {}) {
  const nodes = Math.max(1, numeric(value.nodes ?? value.nos ?? 1, 1));
  const progress = bounded(value.progress ?? value.nodesBroken ?? 0, 0, nodes, 0);
  const detectionMax = Math.max(1, numeric(value.detectionMax ?? value.maxDetection ?? 4, 4));
  const detection = bounded(value.detection ?? value.alert ?? 0, 0, detectionMax, 0);
  return {
    id: String(value.id || createId("hack")),
    name: String(value.name || "Rede sem nome"),
    location: String(value.location || ""),
    type: String(value.type || "rede"),
    sr: Math.max(5, numeric(value.sr ?? value.SR ?? 10, 10)),
    nodes,
    ramPerNode: Math.max(0, numeric(value.ramPerNode ?? value.ram ?? 1, 1)),
    progress,
    detection,
    detectionMax,
    defenses: normalizeTags(value.defenses || value.ice),
    connectedSystems: normalizeTags(value.connectedSystems || value.systems),
    actions: normalizeTags(value.actions || Object.values(HACKING_ACTIONS)),
    dataAvailable: String(value.dataAvailable || value.data || ""),
    error403: String(value.error403 || "Bloqueio grave, contra-invasao ou reacao hostil."),
    detectionConsequence: String(value.detectionConsequence || "Alarme, patrulha, drone, torreta ou bloqueio."),
    cosmicInterference: String(value.cosmicInterference || ""),
    reward: String(value.reward || ""),
    secret: String(value.secret || ""),
    status: String(value.status || (progress >= nodes ? "breached" : detection >= detectionMax ? "locked" : "active")),
    history: arrayOf(value.history).map(createGmEvent),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function advanceHackingChallenge(challenge = {}, result = {}) {
  const next = createHackingChallenge(challenge);
  const outcome = String(result.outcome || result.status || "partial");
  if (outcome === "success" || outcome === "complete") next.progress = bounded(next.progress + numeric(result.nodes || 1, 1), 0, next.nodes, next.progress);
  else if (outcome === "partial") {
    next.progress = bounded(next.progress + numeric(result.nodes || 1, 1), 0, next.nodes, next.progress);
    next.detection = bounded(next.detection + numeric(result.detection || 1, 1), 0, next.detectionMax, next.detection);
  } else {
    next.detection = bounded(next.detection + numeric(result.detection || 1, 1), 0, next.detectionMax, next.detection);
  }
  next.status = next.progress >= next.nodes ? "breached" : next.detection >= next.detectionMax ? "locked" : "active";
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.HACKING, targetId: next.id, targetName: next.name, message: result.message || `Hacking: ${outcome}.`, data: { outcome, progress: next.progress, detection: next.detection } }),
    ...next.history,
  ].slice(0, 50);
  return next;
}

export function failHackingChallenge(challenge = {}, reason = "") {
  const next = advanceHackingChallenge(challenge, { outcome: "failure", detection: 2, message: reason || "Falha: Detecao aumenta e pode ocorrer ERROR 403." });
  if (next.detection >= next.detectionMax) next.status = "locked";
  return next;
}

export function createBaseState(value = {}) {
  const attributes = {};
  for (const attribute of BASE_ATTRIBUTES) {
    attributes[attribute] = bounded(objectOf(value.attributes)[attribute] ?? value[attribute] ?? 1, 0, 5, 1);
  }
  const level = bounded(value.level ?? value.nivel ?? inferBaseLevel(attributes), 1, 5, 1);
  return {
    id: String(value.id || createId("base")),
    name: String(value.name || "Base sem nome"),
    location: String(value.location || ""),
    population: String(value.population || value.populacao || "pequena"),
    mainResource: String(value.mainResource || ""),
    biggestProblem: String(value.biggestProblem || value.problem || ""),
    leader: String(value.leader || ""),
    interestedFaction: String(value.interestedFaction || ""),
    externalThreat: String(value.externalThreat || ""),
    secret: String(value.secret || ""),
    request: String(value.request || ""),
    level,
    attributes,
    improvements: arrayOf(value.improvements).map((entry) => clone(entry)),
    projects: arrayOf(value.projects).map(normalizeBaseProject),
    crises: arrayOf(value.crises).map((entry) => clone(entry)),
    routes: arrayOf(value.routes).map((entry) => clone(entry)),
    factionRelations: clone(value.factionRelations || {}) || {},
    history: arrayOf(value.history).map(createGmEvent),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function inferBaseLevel(attributes = {}) {
  if (attributes.producao >= 4 && attributes.comunicacao >= 4 && attributes.seguranca >= 4) return 5;
  if (attributes.agua >= 3 && attributes.comida >= 3 && attributes.defesa >= 3 && attributes.moral >= 3) return 4;
  if (attributes.oficina >= 2 && attributes.medicina >= 2 && attributes.comunicacao >= 1) return 3;
  if (attributes.defesa >= 1 && attributes.energia >= 1 && attributes.armazenamento >= 1) return 2;
  return 1;
}

export function updateBaseResource(base = {}, resource = "", delta = 0, reason = "") {
  const next = createBaseState(base);
  const key = normalizeKey(resource).replace(/\s+/g, "-");
  const attribute = BASE_ATTRIBUTES.find((entry) => entry === key || normalizeKey(entry) === normalizeKey(resource));
  if (!attribute) throw new Error("Atributo de base desconhecido.");
  const previous = next.attributes[attribute];
  next.attributes[attribute] = bounded(previous + numeric(delta, 0), 0, 5, previous);
  next.level = inferBaseLevel(next.attributes);
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.BASE, targetId: next.id, targetName: next.name, message: reason || `${attribute}: ${previous} -> ${next.attributes[attribute]}.`, data: { attribute, previous, current: next.attributes[attribute] } }),
    ...next.history,
  ].slice(0, 60);
  return next;
}

function normalizeBaseProject(value = {}) {
  const progressMax = Math.max(1, numeric(value.progressMax ?? value.cycles ?? 1, 1));
  const progressCurrent = bounded(value.progressCurrent ?? value.progress ?? 0, 0, progressMax, 0);
  return {
    id: String(value.id || createId("project")),
    name: String(value.name || "Projeto de base"),
    size: String(value.size || "pequena"),
    cost: numeric(value.cost, 0),
    progressCurrent,
    progressMax,
    benefit: String(value.benefit || ""),
    status: progressCurrent >= progressMax ? "completed" : String(value.status || "active"),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function advanceBaseProject(base = {}, projectId = "", amount = 1) {
  const next = createBaseState(base);
  next.projects = next.projects.map((project) => {
    if (project.id !== projectId && project.name !== projectId) return project;
    return normalizeBaseProject({
      ...project,
      progressCurrent: bounded(project.progressCurrent + numeric(amount, 1), 0, project.progressMax, project.progressCurrent),
      updatedAt: nowIso(),
    });
  });
  next.updatedAt = nowIso();
  next.history = [
    createGmEvent({ type: GM_EVENT_TYPES.BASE, targetId: next.id, targetName: next.name, message: `Projeto avancou: ${projectId}.` }),
    ...next.history,
  ].slice(0, 60);
  return next;
}

export function resolveBaseEvent(base = {}, options = {}) {
  const next = createBaseState(base);
  const roll = Math.max(1, integer(options.roll, Math.floor(Math.random() * 12) + 1));
  const event = createGmEvent({
    type: GM_EVENT_TYPES.BASE,
    targetId: next.id,
    targetName: next.name,
    roll,
    message: options.event || BASE_EVENTS[(roll - 1) % BASE_EVENTS.length],
  });
  next.history = [event, ...next.history].slice(0, 60);
  next.updatedAt = nowIso();
  return { base: next, event };
}

export function normalizeRewardEntry(value = {}) {
  return {
    id: String(value.id || createId("reward")),
    type: String(value.type || REWARD_TYPES.LUZENTIS),
    name: String(value.name || value.title || "Recompensa"),
    amount: Math.max(0, numeric(value.amount ?? value.value ?? value.luzentis, 0)),
    min: Math.max(0, numeric(value.min, 0)),
    max: Math.max(0, numeric(value.max, 0)),
    scaledMin: Math.max(0, numeric(value.scaledMin, value.min || 0)),
    scaledMax: Math.max(0, numeric(value.scaledMax, value.max || 0)),
    item: clone(value.item || {}) || {},
    factionId: String(value.factionId || ""),
    notes: String(value.notes || value.description || ""),
    status: String(value.status || "pending"),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function applyMissionReward(state = {}, reward = {}, target = {}) {
  const normalized = normalizeRewardEntry(reward);
  return {
    reward: { ...normalized, status: "applied", updatedAt: nowIso() },
    targetId: String(target.id || target.characterId || ""),
    transaction: normalized.type === REWARD_TYPES.LUZENTIS
      ? { currency: "luzentis", amount: normalized.amount }
      : null,
    state: serializeGmState({
      ...hydrateGmState(state),
      rewards: [normalized, ...arrayOf(state.rewards)].slice(0, 80),
      gmEvents: [
        createGmEvent({ type: GM_EVENT_TYPES.REWARD, targetId: target.id || "", targetName: target.name || "", message: `Recompensa aplicada: ${normalized.name}.` }),
        ...arrayOf(state.gmEvents),
      ].slice(0, 120),
    }),
  };
}

export function normalizeConsequence(value = {}) {
  return {
    id: String(value.id || createId("consequence")),
    type: String(value.type || CONSEQUENCE_TYPES.WORLD_CHANGE),
    description: String(value.description || value.message || value.text || ""),
    amount: numeric(value.amount, 0),
    targetId: String(value.targetId || ""),
    targetName: String(value.targetName || ""),
    status: String(value.status || "open"),
    severity: String(value.severity || "normal"),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

export function serializeGmState(state = {}) {
  const hydrated = hydrateGmState(state);
  return {
    gmSchemaVersion: hydrated.gmSchemaVersion,
    activeMissionId: hydrated.activeMissionId,
    missions: hydrated.missions.map((entry) => clone(entry)),
    travelRoutes: hydrated.travelRoutes.map((entry) => clone(entry)),
    resourceTracks: hydrated.resourceTracks.map((entry) => clone(entry)),
    factionStates: hydrated.factionStates.map((entry) => clone(entry)),
    reputationLog: hydrated.reputationLog.map((entry) => clone(entry)),
    campaignClocks: hydrated.campaignClocks.map((entry) => clone(entry)),
    gmEvents: hydrated.gmEvents.map((entry) => clone(entry)),
    rewards: hydrated.rewards.map((entry) => clone(entry)),
    consequences: hydrated.consequences.map((entry) => clone(entry)),
    hackingChallenges: hydrated.hackingChallenges.map((entry) => clone(entry)),
    bases: hydrated.bases.map((entry) => clone(entry)),
    metadata: clone(hydrated.metadata || {}) || {},
  };
}

export function hydrateGmState(raw = {}) {
  const source = raw.gmState && typeof raw.gmState === "object" ? { ...raw, ...raw.gmState } : raw;
  const missions = arrayOf(source.missions).map(normalizeMissionEntry);
  return {
    gmSchemaVersion: Number(source.gmSchemaVersion || source.schemaVersion || GM_SCHEMA_VERSION),
    activeMissionId: String(source.activeMissionId || missions[0]?.id || ""),
    missions,
    travelRoutes: arrayOf(source.travelRoutes || source.routes).map(normalizeTravelRoute),
    resourceTracks: arrayOf(source.resourceTracks || source.resources).map(createResourceTrack),
    factionStates: arrayOf(source.factionStates || source.factions).map(createFactionState),
    reputationLog: arrayOf(source.reputationLog).map(createGmEvent),
    campaignClocks: arrayOf(source.campaignClocks || source.clocks).map(createCampaignClock),
    gmEvents: arrayOf(source.gmEvents || source.events).map(createGmEvent),
    rewards: arrayOf(source.rewards).map(normalizeRewardEntry),
    consequences: arrayOf(source.consequences).map(normalizeConsequence),
    hackingChallenges: arrayOf(source.hackingChallenges || source.networks).map(createHackingChallenge),
    bases: arrayOf(source.bases || source.colonies).map(createBaseState),
    metadata: {
      ...(clone(source.metadata || {}) || {}),
      sourceFileCurrent: source.metadata?.sourceFileCurrent || "Livro_2_Guia_do_Mestre_rifles_corrigido.docx",
      sourceStatus: source.metadata?.sourceStatus || "current-source-needs-review",
      hydratedAt: nowIso(),
    },
  };
}

export function summarizeGmStateForReport(state = {}) {
  const gm = hydrateGmState(state);
  return {
    activeMission: gm.missions.find((entry) => entry.id === gm.activeMissionId) || gm.missions[0] || null,
    openMissions: gm.missions.filter((entry) => !["completed", "failed"].includes(entry.status)).length,
    activeRoutes: gm.travelRoutes.filter((entry) => entry.status !== "completed").length,
    pressuredResources: gm.resourceTracks.filter((entry) => computeResourcePressure(entry).state !== RESOURCE_PRESSURE_LEVELS.STABLE),
    factions: gm.factionStates.map((entry) => ({ id: entry.id, name: entry.name, reputation: entry.reputation, relation: entry.relation })),
    activeClocks: gm.campaignClocks.filter((entry) => !["resolved"].includes(entry.status)).length,
    activeHacking: gm.hackingChallenges.filter((entry) => entry.status === "active").length,
    bases: gm.bases.map((entry) => ({ id: entry.id, name: entry.name, level: entry.level })),
  };
}
