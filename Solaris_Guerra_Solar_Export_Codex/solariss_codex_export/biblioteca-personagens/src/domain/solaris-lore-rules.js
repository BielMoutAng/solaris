export const LORE_SCHEMA_VERSION = 1;

export const LORE_ENTRY_TYPES = Object.freeze({
  UNIVERSE: "universo",
  PLANET: "planeta",
  REGION: "regiao",
  CITY: "cidade",
  PLATFORM: "plataforma",
  LOCATION: "local",
  FACTION: "faccao",
  PEOPLE: "povo",
  CULTURE: "raca-cultura",
  NPC: "npc",
  ENTITY: "entidade",
  ORGANIZATION: "organizacao",
  HISTORICAL_EVENT: "evento-historico",
  THREAT: "ameaca",
  MYSTERY: "misterio",
  TECHNOLOGY: "tecnologia",
  BELIEF: "religiao-crenca",
  RESOURCE: "recurso",
  HOOK: "gancho-narrativo",
  RUMOR: "rumor",
  SECRET: "segredo",
  TIMELINE: "linha-do-tempo",
  CUSTOM: "personalizado",
});

export const LORE_RELATION_TYPES = Object.freeze({
  LOCATED_IN: "localizado-em",
  BELONGS_TO: "pertence-a",
  CONTROLS: "controla",
  RIVAL_OF: "rival-de",
  ALLY_OF: "aliado-de",
  ENEMY_OF: "inimigo-de",
  LEADS: "lidera",
  SERVES: "serve",
  INVESTIGATES: "investiga",
  THREATENS: "ameaca",
  HUNTS: "caca",
  PROTECTS: "protege",
  CREATED: "criou",
  DESTROYED: "destruiu",
  KNOWS: "conhece",
  SECRET_OF: "segredo-de",
  ORIGIN_OF: "origem-de",
  APPEARS_IN: "aparece-em",
  LINKED_MISSION: "ligado-a-missao",
  LINKED_MONSTER: "ligado-a-monstro",
  LINKED_ITEM: "ligado-a-item",
});

export const LORE_TAG_TYPES = Object.freeze({
  TARANTUS: "tarantus",
  FALARIS: "falaris",
  URYON: "uryon",
  KTALUHL_KALAR: "ktaluhl-kalar",
  FACTION: "faccao",
  RUIN: "ruina",
  COSMOS: "cosmos",
  SURVIVAL: "sobrevivencia",
  MYSTERY: "misterio",
  THARAN: "tharan",
  GM: "mestre",
});

export const LORE_IMPORTANCE_LEVELS = Object.freeze({
  BACKGROUND: "ambientacao",
  USEFUL: "util",
  IMPORTANT: "importante",
  CRITICAL: "critico",
});

export const LORE_DISCOVERY_STATES = Object.freeze({
  UNKNOWN: "desconhecido",
  RUMORED: "rumor",
  DISCOVERED: "descoberto",
  REVEALED: "revelado",
});

export const LORE_SECRET_LEVELS = Object.freeze({
  PUBLIC: "publico",
  GM: "mestre",
  SECRET: "segredo",
  SPOILER: "spoiler",
});

export const LOCATION_TYPES = Object.freeze({
  SYSTEM: "sistema",
  PLANET: "planeta",
  REGION: "regiao",
  CITY: "cidade",
  FORTRESS: "cidade-fortaleza",
  COLONY: "colonia",
  RUIN: "ruina",
  CAVE: "caverna",
  PLATFORM: "plataforma",
  STATION: "estacao",
  WILDERNESS: "ermo",
  COSMIC: "cosmico",
});

export const FACTION_LORE_TYPES = Object.freeze({
  GOVERNMENT: "governo",
  PATROL: "patrulha",
  MEDICAL: "enfermaria",
  FORGE: "forja",
  SCAVENGERS: "sucateiros",
  SCIENTISTS: "cientistas",
  TRADERS: "comerciantes",
  COLONY: "colonia",
  CULT: "culto-cosmico",
  RAIDER: "saqueadores",
  ANCIENT: "remanescente-antigo",
  MONSTROUS: "faccao-monstruosa",
  OTHER: "outro",
});

export const NPC_LORE_ROLES = Object.freeze({
  LEADER: "lider",
  CONTACT: "contato",
  GUIDE: "guia",
  HEALER: "curandeiro",
  SCIENTIST: "cientista",
  MERCHANT: "comerciante",
  RIVAL: "rival",
  WITNESS: "testemunha",
  SECRET_KEEPER: "guardiao-de-segredo",
  OTHER: "outro",
});

export const ENTITY_TYPES = Object.freeze({
  COSMIC: "cosmica",
  ANCIENT: "antiga",
  PLANETARY: "planetaria",
  TECHNOLOGICAL: "tecnologica",
  RELIGIOUS: "religiosa",
  UNKNOWN: "desconhecida",
});

export const TIMELINE_EVENT_TYPES = Object.freeze({
  BEFORE_FALL: "antes-da-queda",
  FALL: "queda-de-falaris",
  AFTERMATH: "pos-queda",
  FACTION: "faccao",
  DISCOVERY: "descoberta",
  WAR: "conflito",
  MYSTERY: "misterio",
  CURRENT: "atual",
});

export const HOOK_TYPES = Object.freeze({
  MISSION: "missao",
  INVESTIGATION: "investigacao",
  SURVIVAL: "sobrevivencia",
  EXPLORATION: "exploracao",
  COMBAT: "combate",
  MORAL: "moral",
  FACTION: "faccao",
  MYSTERY: "misterio",
  COSMIC_HORROR: "horror-cosmico",
  TECHNOLOGY: "tecnologia",
  RUIN: "ruina",
  RESOURCE: "recurso",
  NPC: "npc",
  RUMOR: "rumor",
  SECRET: "segredo",
});

const OFFICIAL_BOOK4_SOURCE = "Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx";

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

function nowIso() {
  return new Date().toISOString();
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

function slug(value = "lore") {
  return normalizeKey(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "lore";
}

function createId(prefix = "lore", seed = "") {
  const stable = slug(seed);
  if (stable) return `${prefix}-${stable}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function unique(values = []) {
  const seen = new Set();
  return arrayOf(values)
    .flatMap((value) => Array.isArray(value) ? value : String(value || "").split(/[,;|]/))
    .map((value) => String(value || "").trim())
    .filter((value) => {
      const key = normalizeKey(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function asBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return value === true || value === "true" || value === "1" || value === 1;
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function sourceGovernanceFor(entry = {}) {
  return {
    sourceFileCurrent: String(firstValue(entry.sourceFileCurrent, entry.sourceFile, OFFICIAL_BOOK4_SOURCE)),
    sourceStatus: String(firstValue(entry.sourceStatus, "current-source-needs-review")),
    sourceChapter: String(firstValue(entry.sourceChapter, "")),
    dataStability: String(firstValue(entry.dataStability, "media")),
    needsReview: asBoolean(entry.needsReview, false),
    reviewReason: String(firstValue(entry.reviewReason, "")),
  };
}

function normalizeRelations(value = []) {
  return arrayOf(value).map(normalizeLoreRelation).filter((relation) => relation.fromId && relation.toId);
}

export function createLoreEntry(entry = {}) {
  return normalizeLoreEntry(entry);
}

export function normalizeLoreEntry(entry = {}) {
  const source = objectOf(entry);
  const title = String(firstValue(source.title, source.name, "Entrada de lore")).trim();
  const type = String(firstValue(source.type, LORE_ENTRY_TYPES.CUSTOM));
  const id = String(firstValue(source.id, createId(type, title)));
  const summary = String(firstValue(source.summary, source.resumo, source.description, source.descricao, ""));
  const description = String(firstValue(source.description, source.descricao, summary));
  const hooks = arrayOf(source.hooks || source.ganchos).map((hook) =>
    typeof hook === "string" ? normalizeLoreHook({ title: hook, description: hook, linkedEntryId: id }) : normalizeLoreHook({ ...hook, linkedEntryId: hook.linkedEntryId || id })
  );
  const normalized = {
    id,
    type,
    title,
    name: String(firstValue(source.name, title)),
    subtitle: String(firstValue(source.subtitle, source.subtitulo, "")),
    summary,
    description,
    longText: String(firstValue(source.longText, source.text, source.textoLongo, source.officialText, description)),
    tags: unique(source.tags),
    importance: String(firstValue(source.importance, LORE_IMPORTANCE_LEVELS.USEFUL)),
    discoveryState: String(firstValue(source.discoveryState, LORE_DISCOVERY_STATES.UNKNOWN)),
    secretLevel: String(firstValue(source.secretLevel, LORE_SECRET_LEVELS.GM)),
    relations: normalizeRelations(source.relations),
    hooks,
    gmNotes: String(firstValue(source.gmNotes, source.notes, "")),
    publicNotes: String(firstValue(source.publicNotes, "")),
    visibleToPlayers: asBoolean(source.visibleToPlayers, false),
    pinned: asBoolean(source.pinned, false),
    custom: asBoolean(source.custom, false),
    linkedMonsters: unique(source.linkedMonsters || source.monstersAssociated || source.monsters),
    linkedItems: unique(source.linkedItems || source.itemsAssociated || source.items),
    linkedMissions: unique(source.linkedMissions || source.missions),
    linkedScenes: unique(source.linkedScenes || source.scenes),
    linkedFactions: unique(source.linkedFactions || source.factions),
    linkedLocations: unique(source.linkedLocations || source.locations),
    linkedNpcs: unique(source.linkedNpcs || source.npcs),
    location: String(firstValue(source.location, source.local, "")),
    region: String(firstValue(source.region, source.regiao, "")),
    locationType: String(firstValue(source.locationType, source.tipoLocal, "")),
    faction: String(firstValue(source.faction, source.faccao, "")),
    factionType: String(firstValue(source.factionType, source.tipoFaccao, "")),
    territory: String(firstValue(source.territory, source.territorio, "")),
    role: String(firstValue(source.role, source.papel, "")),
    associatedLocation: String(firstValue(source.associatedLocation, source.localAssociado, "")),
    createdAt: String(firstValue(source.createdAt, nowIso())),
    updatedAt: String(firstValue(source.updatedAt, nowIso())),
    sourceGovernance: {
      ...sourceGovernanceFor(source.sourceGovernance || source),
      ...(objectOf(source.sourceGovernance)),
    },
    metadata: {
      ...(clone(source.metadata || {}) || {}),
      schemaVersion: LORE_SCHEMA_VERSION,
    },
  };
  return {
    ...normalized,
    ...normalized.sourceGovernance,
  };
}

export function normalizeLocationEntry(entry = {}) {
  const location = normalizeLoreEntry({
    ...entry,
    type: entry.type || LORE_ENTRY_TYPES.LOCATION,
    tags: unique(["local", entry.locationType, entry.region, ...(entry.tags || [])]),
  });
  return {
    ...location,
    locationType: String(firstValue(entry.locationType, entry.tipoLocal, LOCATION_TYPES.WILDERNESS)),
    region: String(firstValue(entry.region, "")),
    climate: String(firstValue(entry.climate, entry.environment, entry.ambiente, "")),
    environment: String(firstValue(entry.environment, entry.ambiente, entry.climate, "")),
    dangers: unique(entry.dangers || entry.perigos),
    factionsPresent: unique(entry.factionsPresent || entry.factions || entry.faccoesPresentes),
    npcsPresent: unique(entry.npcsPresent || entry.npcs),
    monstersAssociated: unique(entry.monstersAssociated || entry.monsters || entry.linkedMonsters),
    resources: unique(entry.resources || entry.recursos),
    pointsOfInterest: unique(entry.pointsOfInterest || entry.pontosDeInteresse),
    missionHooks: arrayOf(entry.missionHooks || entry.hooks || entry.ganchos).map((hook) =>
      typeof hook === "string" ? normalizeLoreHook({ title: hook, description: hook, linkedLocationId: location.id }) : normalizeLoreHook({ ...hook, linkedLocationId: hook.linkedLocationId || location.id })
    ),
    suggestedScenes: unique(entry.suggestedScenes || entry.scenes || entry.cenasSugeridas),
    dangerLevel: String(firstValue(entry.dangerLevel, entry.nivelDePerigo, "variavel")),
    access: String(firstValue(entry.access, entry.acesso, "")),
    secret: String(firstValue(entry.secret, entry.segredo, "")),
  };
}

export function normalizeFactionLoreEntry(entry = {}) {
  const faction = normalizeLoreEntry({
    ...entry,
    type: entry.type || LORE_ENTRY_TYPES.FACTION,
    tags: unique(["faccao", entry.factionType, ...(entry.tags || [])]),
  });
  return {
    ...faction,
    factionType: String(firstValue(entry.factionType, entry.tipoFaccao, FACTION_LORE_TYPES.OTHER)),
    objectives: unique(entry.objectives || entry.goals || entry.objetivos),
    ideology: String(firstValue(entry.ideology, entry.ideologia, "")),
    leaders: unique(entry.leaders || entry.lideres),
    allies: unique(entry.allies || entry.aliados),
    enemies: unique(entry.enemies || entry.inimigos),
    territory: String(firstValue(entry.territory, entry.territorio, "")),
    resources: unique(entry.resources || entry.recursos),
    methods: unique(entry.methods || entry.metodos),
    secrets: unique(entry.secrets || entry.segredos || entry.secret),
    initialRelation: String(firstValue(entry.initialRelation, entry.relacaoInicial, "neutro")),
    reputation: Number(firstValue(entry.reputation, 0)) || 0,
  };
}

export function normalizeNpcLoreEntry(entry = {}) {
  const npc = normalizeLoreEntry({
    ...entry,
    type: entry.type || LORE_ENTRY_TYPES.NPC,
    tags: unique(["npc", entry.role, entry.faction, ...(entry.tags || [])]),
  });
  return {
    ...npc,
    role: String(firstValue(entry.role, entry.papel, NPC_LORE_ROLES.OTHER)),
    faction: String(firstValue(entry.faction, entry.faccao, "")),
    location: String(firstValue(entry.location, entry.local, "")),
    motivation: String(firstValue(entry.motivation, entry.motivacao, "")),
    secret: String(firstValue(entry.secret, entry.segredo, "")),
    groupRelation: String(firstValue(entry.groupRelation, entry.relacaoComGrupo, "neutro")),
    resources: unique(entry.resources || entry.recursos),
    status: String(firstValue(entry.status, "ativo")),
  };
}

export function normalizeEntityLoreEntry(entry = {}) {
  const entity = normalizeLoreEntry({
    ...entry,
    type: entry.type || LORE_ENTRY_TYPES.ENTITY,
    tags: unique(["entidade", entry.entityType, ...(entry.tags || [])]),
  });
  return {
    ...entity,
    entityType: String(firstValue(entry.entityType, entry.tipoEntidade, ENTITY_TYPES.UNKNOWN)),
    influence: String(firstValue(entry.influence, entry.influencia, "")),
    associatedLocation: String(firstValue(entry.associatedLocation, entry.location, "")),
    associatedFactions: unique(entry.associatedFactions || entry.factions),
    associatedMonsters: unique(entry.associatedMonsters || entry.monsters || entry.linkedMonsters),
    signs: unique(entry.signs || entry.sinais || entry.clues),
    narrativeEffects: unique(entry.narrativeEffects || entry.effects || entry.efeitosNarrativos),
    secret: String(firstValue(entry.secret, entry.segredo, "")),
  };
}

export function normalizeTimelineEvent(entry = {}) {
  const event = normalizeLoreEntry({
    ...entry,
    type: entry.type || LORE_ENTRY_TYPES.HISTORICAL_EVENT,
    tags: unique(["linha-do-tempo", entry.eventType, entry.era, ...(entry.tags || [])]),
  });
  return {
    ...event,
    eventType: String(firstValue(entry.eventType, entry.tipoEvento, TIMELINE_EVENT_TYPES.CURRENT)),
    era: String(firstValue(entry.era, entry.date, entry.data, "")),
    date: String(firstValue(entry.date, entry.data, entry.era, "")),
    involved: unique(entry.involved || entry.envolvidos),
    locations: unique(entry.locations || entry.locais),
    factions: unique(entry.factions || entry.faccoes),
    consequences: unique(entry.consequences || entry.consequencias),
    mysteries: unique(entry.mysteries || entry.misterios),
    order: Number(firstValue(entry.order, entry.ordem, 0)) || 0,
  };
}

export function normalizeLoreHook(entry = {}) {
  const hook = objectOf(entry);
  const title = String(firstValue(hook.title, hook.name, "Gancho de lore")).trim();
  const id = String(firstValue(hook.id, createId("hook", title)));
  return {
    id,
    title,
    type: String(firstValue(hook.type, HOOK_TYPES.MISSION)),
    description: String(firstValue(hook.description, hook.summary, "")),
    origin: String(firstValue(hook.origin, "")),
    linkedEntryId: String(firstValue(hook.linkedEntryId, "")),
    linkedLocationId: String(firstValue(hook.linkedLocationId, hook.locationId, "")),
    linkedFactionId: String(firstValue(hook.linkedFactionId, hook.factionId, "")),
    linkedNpcId: String(firstValue(hook.linkedNpcId, hook.npcId, "")),
    linkedMonsterId: String(firstValue(hook.linkedMonsterId, hook.monsterId, "")),
    linkedItemId: String(firstValue(hook.linkedItemId, hook.itemId, "")),
    possibleReward: String(firstValue(hook.possibleReward, hook.reward, "")),
    risk: String(firstValue(hook.risk, "medio")),
    secret: String(firstValue(hook.secret, "")),
    status: String(firstValue(hook.status, "disponivel")),
    tags: unique(hook.tags),
    sourceGovernance: {
      ...sourceGovernanceFor(hook.sourceGovernance || hook),
      ...(objectOf(hook.sourceGovernance)),
    },
  };
}

export function normalizeLoreRelation(relation = {}) {
  const source = objectOf(relation);
  const fromId = String(firstValue(source.fromId, source.from, source.sourceId, ""));
  const toId = String(firstValue(source.toId, source.to, source.targetId, ""));
  const type = String(firstValue(source.type, LORE_RELATION_TYPES.APPEARS_IN));
  return {
    id: String(firstValue(source.id, createId("rel", `${fromId}-${type}-${toId}`))),
    fromId,
    toId,
    type,
    label: String(firstValue(source.label, type)),
    bidirectional: asBoolean(source.bidirectional, [LORE_RELATION_TYPES.ALLY_OF, LORE_RELATION_TYPES.RIVAL_OF, LORE_RELATION_TYPES.ENEMY_OF].includes(type)),
    weight: Number(firstValue(source.weight, 1)) || 1,
    public: asBoolean(source.public, false),
    secret: asBoolean(source.secret, false),
    notes: String(firstValue(source.notes, "")),
    createdAt: String(firstValue(source.createdAt, nowIso())),
  };
}

export function validateLoreEntry(entry = {}) {
  const normalized = normalizeLoreEntry(entry);
  const errors = [];
  if (!String(entry.title || entry.name || "").trim()) errors.push("Entrada sem titulo.");
  if (!Object.values(LORE_ENTRY_TYPES).includes(normalized.type)) errors.push(`Tipo de lore desconhecido: ${normalized.type}.`);
  if (!normalized.id) errors.push("Entrada sem id.");
  return {
    ok: errors.length === 0,
    errors,
    entry: normalized,
  };
}

function entriesFrom(input = {}) {
  if (Array.isArray(input)) return input.map(normalizeLoreEntry);
  return arrayOf(input.entries || input.loreEntries || input.loreState?.entries).map(normalizeLoreEntry);
}

function relationsFrom(input = {}) {
  if (Array.isArray(input?.relations)) return input.relations.map(normalizeLoreRelation);
  return arrayOf(input?.loreState?.relations).map(normalizeLoreRelation);
}

function textForEntry(entry = {}) {
  return normalizeKey([
    entry.title,
    entry.subtitle,
    entry.summary,
    entry.description,
    entry.longText,
    entry.type,
    entry.locationType,
    entry.region,
    entry.factionType,
    entry.faction,
    entry.location,
    ...(entry.tags || []),
    ...(entry.factionsPresent || []),
    ...(entry.npcsPresent || []),
    ...(entry.monstersAssociated || []),
    ...(entry.linkedItems || []),
  ].filter(Boolean).join(" "));
}

export function searchLoreEntries(input = {}, query = "", options = {}) {
  const normalizedQuery = normalizeKey(query);
  const entries = filterLoreEntries(input, options);
  if (!normalizedQuery) return entries;
  return rankLoreSearchResults(entries.filter((entry) => textForEntry(entry).includes(normalizedQuery)), query);
}

export function filterLoreEntries(input = {}, filters = {}) {
  const entries = entriesFrom(input);
  const wantedType = normalizeKey(filters.type || filters.entryType || "");
  const wantedTag = normalizeKey(filters.tag || "");
  const wantedImportance = normalizeKey(filters.importance || "");
  const wantedFaction = normalizeKey(filters.faction || filters.factionId || "");
  const wantedLocation = normalizeKey(filters.location || filters.locationId || "");
  const wantedSource = normalizeKey(filters.source || filters.sourceFileCurrent || "");
  const discovered = filters.discovered;
  const secret = filters.secret;
  const needsReview = filters.needsReview;
  return entries.filter((entry) => {
    const tags = unique(entry.tags).map(normalizeKey);
    const factions = unique([entry.faction, ...(entry.factions || []), ...(entry.factionsPresent || []), ...(entry.linkedFactions || [])]).map(normalizeKey);
    const locations = unique([entry.location, entry.region, entry.associatedLocation, ...(entry.locations || []), ...(entry.linkedLocations || [])]).map(normalizeKey);
    if (wantedType && normalizeKey(entry.type) !== wantedType) return false;
    if (wantedTag && !tags.includes(wantedTag)) return false;
    if (wantedImportance && normalizeKey(entry.importance) !== wantedImportance) return false;
    if (wantedFaction && !factions.some((value) => value.includes(wantedFaction) || wantedFaction.includes(value))) return false;
    if (wantedLocation && !locations.some((value) => value.includes(wantedLocation) || wantedLocation.includes(value))) return false;
    if (wantedSource && !normalizeKey(entry.sourceFileCurrent).includes(wantedSource)) return false;
    if (discovered !== undefined) {
      const isDiscovered = [LORE_DISCOVERY_STATES.DISCOVERED, LORE_DISCOVERY_STATES.REVEALED].includes(entry.discoveryState);
      if (Boolean(discovered) !== isDiscovered) return false;
    }
    if (secret !== undefined) {
      const isSecret = [LORE_SECRET_LEVELS.SECRET, LORE_SECRET_LEVELS.SPOILER].includes(entry.secretLevel) || Boolean(entry.secret);
      if (Boolean(secret) !== isSecret) return false;
    }
    if (needsReview !== undefined && Boolean(needsReview) !== Boolean(entry.needsReview)) return false;
    return true;
  });
}

export function rankLoreSearchResults(entries = [], query = "") {
  const q = normalizeKey(query);
  return arrayOf(entries).map(normalizeLoreEntry).map((entry) => {
    const title = normalizeKey(entry.title);
    const tags = normalizeKey(arrayOf(entry.tags).join(" "));
    const summary = normalizeKey(entry.summary);
    let score = 0;
    if (title === q) score += 100;
    if (title.includes(q)) score += 60;
    if (tags.includes(q)) score += 35;
    if (summary.includes(q)) score += 20;
    if (textForEntry(entry).includes(q)) score += 10;
    if (entry.pinned) score += 5;
    if (entry.importance === LORE_IMPORTANCE_LEVELS.CRITICAL) score += 4;
    if (entry.importance === LORE_IMPORTANCE_LEVELS.IMPORTANT) score += 2;
    return { entry, score };
  }).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).map((item) => item.entry);
}

export function createLoreRelation(relation = {}) {
  return normalizeLoreRelation(relation);
}

export function linkLoreEntries(state = {}, relation = {}) {
  const next = hydrateLoreState(state);
  const normalized = normalizeLoreRelation(relation);
  if (!normalized.fromId || !normalized.toId) return next;
  next.relations = [
    normalized,
    ...next.relations.filter((entry) => entry.id !== normalized.id),
  ];
  return serializeLoreState(next);
}

export function unlinkLoreEntries(state = {}, relationIdOrFilter = "") {
  const next = hydrateLoreState(state);
  if (typeof relationIdOrFilter === "object") {
    const filter = relationIdOrFilter;
    next.relations = next.relations.filter((relation) => {
      if (filter.id && relation.id === filter.id) return false;
      if (filter.fromId && filter.toId && relation.fromId === filter.fromId && relation.toId === filter.toId) return false;
      return true;
    });
  } else {
    const id = String(relationIdOrFilter || "");
    next.relations = next.relations.filter((relation) => relation.id !== id);
  }
  return serializeLoreState(next);
}

export function getLoreRelatedEntries(state = {}, entryId = "", options = {}) {
  const next = hydrateLoreState(state);
  const id = String(entryId || "");
  const relationType = normalizeKey(options.type || "");
  const relations = next.relations.filter((relation) => {
    const touches = relation.fromId === id || relation.toId === id || (relation.bidirectional && (relation.fromId === id || relation.toId === id));
    if (!touches) return false;
    if (relationType && normalizeKey(relation.type) !== relationType) return false;
    return true;
  });
  return relations.map((relation) => {
    const relatedId = relation.fromId === id ? relation.toId : relation.fromId;
    const entry = next.entries.find((candidate) => candidate.id === relatedId);
    return entry ? { relation, entry } : null;
  }).filter(Boolean);
}

function updateEntryState(state = {}, entryId = "", patch = {}) {
  const next = hydrateLoreState(state);
  const id = String(entryId || "");
  next.entries = next.entries.map((entry) => entry.id === id ? normalizeLoreEntry({ ...entry, ...patch, updatedAt: nowIso() }) : entry);
  return next;
}

export function pinLoreEntry(state = {}, entryId = "") {
  const next = updateEntryState(state, entryId, { pinned: true });
  next.pinnedLoreEntries = unique([...next.pinnedLoreEntries, entryId]);
  return serializeLoreState(next);
}

export function unpinLoreEntry(state = {}, entryId = "") {
  const next = updateEntryState(state, entryId, { pinned: false });
  next.pinnedLoreEntries = next.pinnedLoreEntries.filter((id) => id !== entryId);
  return serializeLoreState(next);
}

export function markLoreDiscovered(state = {}, entryId = "", discoveryState = LORE_DISCOVERY_STATES.DISCOVERED) {
  const next = updateEntryState(state, entryId, { discoveryState, visibleToPlayers: discoveryState === LORE_DISCOVERY_STATES.REVEALED });
  next.discoveredLoreEntries = unique([...next.discoveredLoreEntries, entryId]);
  return serializeLoreState(next);
}

export function markLoreSecret(state = {}, entryId = "", secretLevel = LORE_SECRET_LEVELS.SECRET) {
  const next = updateEntryState(state, entryId, { secretLevel });
  next.secretLoreEntries = unique([...next.secretLoreEntries, entryId]);
  return serializeLoreState(next);
}

export function createLoreNote(entry = {}, options = {}) {
  const lore = normalizeLoreEntry(entry);
  return {
    id: String(firstValue(options.id, createId("lore-note", `${lore.id}-${options.title || lore.title}`))),
    title: String(firstValue(options.title, lore.title)),
    body: String(firstValue(options.body, lore.summary || lore.description)),
    tags: unique(["lore", lore.type, ...(lore.tags || []), ...(options.tags || [])]),
    linkedType: "lore",
    linkedId: lore.id,
    visibleToPlayers: asBoolean(options.visibleToPlayers, lore.visibleToPlayers),
    important: asBoolean(options.important, lore.importance === LORE_IMPORTANCE_LEVELS.CRITICAL),
    revealed: asBoolean(options.revealed, lore.discoveryState === LORE_DISCOVERY_STATES.REVEALED),
    secret: asBoolean(options.secret, lore.secretLevel !== LORE_SECRET_LEVELS.PUBLIC),
    status: String(firstValue(options.status, lore.secretLevel === LORE_SECRET_LEVELS.PUBLIC ? "publica" : "secreta")),
    createdAt: String(firstValue(options.createdAt, nowIso())),
    updatedAt: String(firstValue(options.updatedAt, nowIso())),
  };
}

export function sendLoreToGmNotes(state = {}, entryIdOrEntry = "", options = {}) {
  const next = hydrateLoreState(state);
  const lore = typeof entryIdOrEntry === "object"
    ? normalizeLoreEntry(entryIdOrEntry)
    : next.entries.find((entry) => entry.id === entryIdOrEntry);
  if (!lore) return serializeLoreState(next);
  const note = createLoreNote(lore, options);
  next.loreNotes = [note, ...next.loreNotes.filter((entry) => entry.id !== note.id)].slice(0, 160);
  return serializeLoreState(next);
}

export function sendLoreToSessionReport(state = {}, entryIdOrEntry = "", options = {}) {
  const next = hydrateLoreState(state);
  const lore = typeof entryIdOrEntry === "object"
    ? normalizeLoreEntry(entryIdOrEntry)
    : next.entries.find((entry) => entry.id === entryIdOrEntry);
  if (!lore) return serializeLoreState(next);
  const reportEntry = {
    id: String(firstValue(options.id, createId("lore-report", lore.id))),
    loreId: lore.id,
    title: lore.title,
    type: lore.type,
    summary: String(firstValue(options.summary, lore.summary || lore.description)),
    secretLevel: lore.secretLevel,
    discovered: [LORE_DISCOVERY_STATES.DISCOVERED, LORE_DISCOVERY_STATES.REVEALED].includes(lore.discoveryState),
    createdAt: String(firstValue(options.createdAt, nowIso())),
  };
  next.reportLoreEntries = [reportEntry, ...next.reportLoreEntries.filter((entry) => entry.id !== reportEntry.id)].slice(0, 120);
  return serializeLoreState(next);
}

export function createMissionSeedFromLore(entry = {}, options = {}) {
  const lore = normalizeLoreEntry(entry);
  const hook = normalizeLoreHook(options.hook || lore.hooks?.[0] || {
    title: lore.title,
    description: lore.summary || lore.description,
    type: lore.type === LORE_ENTRY_TYPES.FACTION ? HOOK_TYPES.FACTION : lore.type === LORE_ENTRY_TYPES.LOCATION ? HOOK_TYPES.EXPLORATION : HOOK_TYPES.MISSION,
  });
  return {
    id: String(firstValue(options.id, createId("mission", `${lore.id}-${hook.id}`))),
    name: String(firstValue(options.name, hook.title || `Investigar ${lore.title}`)),
    type: String(firstValue(options.type, hook.type || "investigacao")),
    objective: String(firstValue(options.objective, hook.description || lore.summary || `Investigar ${lore.title}.`)),
    briefing: String(firstValue(options.briefing, lore.summary || lore.description)),
    riskLevel: String(firstValue(options.riskLevel, hook.risk === "alto" ? "muito-perigosa" : hook.risk === "baixo" ? "simples" : "perigosa")),
    phase: "chamado",
    visibleToPlayers: false,
    loreLinks: unique([lore.id, hook.linkedEntryId, hook.linkedLocationId, hook.linkedFactionId, hook.linkedNpcId]),
    locationId: hook.linkedLocationId || (lore.type === LORE_ENTRY_TYPES.LOCATION ? lore.id : ""),
    factionId: hook.linkedFactionId || (lore.type === LORE_ENTRY_TYPES.FACTION ? lore.id : ""),
    npcId: hook.linkedNpcId || (lore.type === LORE_ENTRY_TYPES.NPC ? lore.id : ""),
    source: "lore",
    sourceLoreId: lore.id,
  };
}

export function createEncounterSeedFromLore(entry = {}, options = {}) {
  const lore = normalizeLoreEntry(entry);
  return {
    id: String(firstValue(options.id, createId("encounter", lore.id))),
    name: String(firstValue(options.name, `Encontro em ${lore.title}`)),
    description: String(firstValue(options.description, lore.summary || lore.description)),
    sceneId: String(firstValue(options.sceneId, "")),
    difficulty: String(firstValue(options.difficulty, lore.type === LORE_ENTRY_TYPES.THREAT ? "dificil" : "moderado")),
    filters: {
      habitat: String(firstValue(options.habitat, lore.region || lore.locationType || lore.type)),
      faction: String(firstValue(options.faction, lore.faction || arrayOf(lore.factionsPresent)[0] || "")),
      tags: unique([...(lore.tags || []), ...(options.tags || [])]),
    },
    monsters: arrayOf(options.monsters || lore.linkedMonsters).map((monster) => clone(monster)),
    loreLinks: [lore.id],
    source: "lore",
  };
}

export function createNpcSeedFromLore(entry = {}, options = {}) {
  const lore = normalizeNpcLoreEntry(entry);
  return {
    id: String(firstValue(options.id, lore.id)),
    name: lore.title,
    role: lore.role,
    faction: lore.faction,
    location: lore.location,
    motivation: lore.motivation,
    secret: lore.secret,
    notes: String(firstValue(options.notes, lore.summary || lore.description)),
    tags: unique(["npc", ...(lore.tags || [])]),
    loreId: lore.id,
  };
}

export function createLocationSceneSeed(entry = {}, options = {}) {
  const location = normalizeLocationEntry(entry);
  return {
    id: String(firstValue(options.id, createId("scene", location.id))),
    name: String(firstValue(options.name, location.title)),
    notes: String(firstValue(options.notes, location.summary || location.description)),
    description: location.description,
    lighting: String(firstValue(options.lighting, "variavel")),
    climate: location.climate || location.environment,
    danger: location.dangerLevel,
    gmNotes: location.gmNotes || location.secret,
    loreId: location.id,
    tags: unique(["lore", "local", ...(location.tags || [])]),
  };
}

export function serializeLoreState(state = {}) {
  const source = objectOf(state.loreState || state);
  return {
    loreSchemaVersion: Number(firstValue(source.loreSchemaVersion, LORE_SCHEMA_VERSION)) || LORE_SCHEMA_VERSION,
    entries: entriesFrom(source).map(normalizeLoreEntry),
    relations: relationsFrom(source).map(normalizeLoreRelation),
    pinnedLoreEntries: unique(source.pinnedLoreEntries),
    discoveredLoreEntries: unique(source.discoveredLoreEntries),
    secretLoreEntries: unique(source.secretLoreEntries),
    loreNotes: arrayOf(source.loreNotes).map((entry) => clone(entry)),
    reportLoreEntries: arrayOf(source.reportLoreEntries).map((entry) => clone(entry)),
    missionLoreLinks: arrayOf(source.missionLoreLinks).map((entry) => clone(entry)),
    factionLoreLinks: arrayOf(source.factionLoreLinks).map((entry) => clone(entry)),
    locationLoreLinks: arrayOf(source.locationLoreLinks).map((entry) => clone(entry)),
    npcLoreLinks: arrayOf(source.npcLoreLinks).map((entry) => clone(entry)),
    monsterLoreLinks: arrayOf(source.monsterLoreLinks).map((entry) => clone(entry)),
    itemLoreLinks: arrayOf(source.itemLoreLinks).map((entry) => clone(entry)),
    metadata: {
      ...(clone(source.metadata || {}) || {}),
      serializedAt: nowIso(),
    },
  };
}

export function hydrateLoreState(rawState = {}) {
  const source = objectOf(rawState?.loreState || rawState);
  const fallback = createDefaultLoreState();
  const entries = entriesFrom(source).length ? entriesFrom(source) : fallback.entries;
  const relationInput = relationsFrom(source).length ? relationsFrom(source) : fallback.relations;
  const pinned = unique([
    ...arrayOf(source.pinnedLoreEntries),
    ...entries.filter((entry) => entry.pinned).map((entry) => entry.id),
  ]);
  const discovered = unique([
    ...arrayOf(source.discoveredLoreEntries),
    ...entries.filter((entry) => [LORE_DISCOVERY_STATES.DISCOVERED, LORE_DISCOVERY_STATES.REVEALED].includes(entry.discoveryState)).map((entry) => entry.id),
  ]);
  const secret = unique([
    ...arrayOf(source.secretLoreEntries),
    ...entries.filter((entry) => [LORE_SECRET_LEVELS.SECRET, LORE_SECRET_LEVELS.SPOILER].includes(entry.secretLevel)).map((entry) => entry.id),
  ]);
  return serializeLoreState({
    loreSchemaVersion: Number(firstValue(source.loreSchemaVersion, LORE_SCHEMA_VERSION)) || LORE_SCHEMA_VERSION,
    entries: entries.map((entry) => normalizeLoreEntry({
      ...entry,
      pinned: pinned.includes(entry.id) || entry.pinned,
      discoveryState: discovered.includes(entry.id) && entry.discoveryState === LORE_DISCOVERY_STATES.UNKNOWN ? LORE_DISCOVERY_STATES.DISCOVERED : entry.discoveryState,
      secretLevel: secret.includes(entry.id) && entry.secretLevel === LORE_SECRET_LEVELS.PUBLIC ? LORE_SECRET_LEVELS.SECRET : entry.secretLevel,
    })),
    relations: relationInput,
    pinnedLoreEntries: pinned,
    discoveredLoreEntries: discovered,
    secretLoreEntries: secret,
    loreNotes: arrayOf(source.loreNotes),
    reportLoreEntries: arrayOf(source.reportLoreEntries),
    missionLoreLinks: arrayOf(source.missionLoreLinks),
    factionLoreLinks: arrayOf(source.factionLoreLinks),
    locationLoreLinks: arrayOf(source.locationLoreLinks),
    npcLoreLinks: arrayOf(source.npcLoreLinks),
    monsterLoreLinks: arrayOf(source.monsterLoreLinks),
    itemLoreLinks: arrayOf(source.itemLoreLinks),
    metadata: clone(source.metadata || {}),
  });
}

export function sortTimelineEvents(entries = []) {
  return entriesFrom(entries)
    .filter((entry) => entry.type === LORE_ENTRY_TYPES.HISTORICAL_EVENT || entry.type === LORE_ENTRY_TYPES.TIMELINE)
    .map(normalizeTimelineEvent)
    .sort((a, b) => (a.order - b.order) || String(a.date).localeCompare(String(b.date)) || a.title.localeCompare(b.title));
}

export function createLoreLinkedFactionState(entry = {}, options = {}) {
  const faction = normalizeFactionLoreEntry(entry);
  return {
    id: String(firstValue(options.id, faction.id)),
    name: faction.title,
    type: faction.factionType,
    goal: arrayOf(faction.objectives)[0] || faction.summary || "Sobreviver em Tarantus.",
    reputation: Number(firstValue(options.reputation, faction.reputation, 0)) || 0,
    relation: String(firstValue(options.relation, faction.initialRelation, "neutro")),
    visibleToPlayers: asBoolean(options.visibleToPlayers, faction.visibleToPlayers),
    loreId: faction.id,
    tags: unique(["lore", ...(faction.tags || [])]),
  };
}

export const DEFAULT_LORE_ENTRIES = Object.freeze([
  normalizeLoreEntry({
    id: "lore-universo-solaris",
    type: LORE_ENTRY_TYPES.UNIVERSE,
    title: "Solaris",
    subtitle: "Sistema estelar e civilizacao do cenario",
    summary: "Sistema quebrado pela morte de Falaris, marcado por rotas instaveis, colonias, ruinas e povos tentando sobreviver.",
    description: "Antes da queda, Solaris tinha mundos conectados por rotas, estacoes, cidades e comercio. Depois de Falaris, a ordem minima virou sobrevivencia fragmentada.",
    longText: "Use Solaris como pano de fundo amplo: um sistema estelar ferido, com tecnologia quebrada, comercio perigoso, povos deslocados e misterios cosmicos que ainda nao foram totalmente explicados.",
    tags: ["Solaris", "Falaris", "sobrevivencia", "sistema-estelar"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    discoveryState: LORE_DISCOVERY_STATES.DISCOVERED,
    secretLevel: LORE_SECRET_LEVELS.PUBLIC,
    sourceChapter: "Capitulo 1 - O Universo de Guerra Solar",
  }),
  normalizeTimelineEvent({
    id: "lore-evento-explosao-falaris",
    title: "A Explosao de Falaris",
    summary: "A morte de Falaris colapsou luz, massa, rotas, ecossistemas e estabilidade social do sistema.",
    description: "A destruicao de Falaris nao foi apenas uma explosao no ceu; foi a perda de uma estrutura inteira de sobrevivencia.",
    eventType: TIMELINE_EVENT_TYPES.FALL,
    era: "Queda",
    order: 10,
    tags: ["Falaris", "queda", "cosmos", "misterio"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    discoveryState: LORE_DISCOVERY_STATES.DISCOVERED,
    secretLevel: LORE_SECRET_LEVELS.PUBLIC,
    hooks: [{
      title: "O padrao que nao fecha",
      type: HOOK_TYPES.MYSTERY,
      description: "Investigar sinais de que a morte de Falaris talvez nao tenha sido mero acidente.",
      risk: "alto",
    }],
    sourceChapter: "1.2. A Explosao de Falaris",
  }),
  normalizeLocationEntry({
    id: "lore-planeta-tarantus",
    type: LORE_ENTRY_TYPES.PLANET,
    title: "Tarantus",
    subtitle: "O mundo ferido",
    summary: "Um dos principais mundos sobreviventes de Solaris, hostil na superficie e vivo nas profundezas.",
    description: "Tarantus e frio, instavel e perigoso, com ventos cortantes, poeira cosmica, ruinas congeladas, pantanos contaminados, cristais e fendas. Ainda assim, cavernas geotermicas e ecossistemas subterraneos sustentam vida.",
    locationType: LOCATION_TYPES.PLANET,
    region: "Sistema Solaris",
    environment: "superficie hostil, profundezas vivas, anomalias cosmicas",
    dangers: ["frio", "poeira cosmica", "ruinas instaveis", "criaturas adaptadas", "anomalias"],
    resources: ["cristais", "seiva cosmica", "sucata", "rotas subterraneas"],
    tags: ["Tarantus", "planeta", "sobrevivencia", "cosmos"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    discoveryState: LORE_DISCOVERY_STATES.DISCOVERED,
    secretLevel: LORE_SECRET_LEVELS.PUBLIC,
    sourceChapter: "1.5. Tarantus, o Mundo Ferido",
  }),
  normalizeLocationEntry({
    id: "lore-cidade-ktaluhl-kalar",
    type: LORE_ENTRY_TYPES.CITY,
    title: "Ktaluhl Kalar",
    subtitle: "Cidade-fortaleza de Tarantus",
    summary: "Abrigo, muralha, oficina, quartel, mercado e centro de sobrevivencia organizada.",
    description: "Ktaluhl Kalar e uma das maiores tentativas de sobrevivencia organizada em Tarantus. Dentro dela, povos sobreviventes cooperam, disputam recursos e escondem problemas.",
    locationType: LOCATION_TYPES.FORTRESS,
    region: "Tarantus",
    environment: "pedra, metal, cavernas e estruturas reforcadas",
    factionsPresent: ["Conselho de Ktaluhl Kalar", "Patrulheiros", "Enfermaria Myrr", "Forja de Durn Karr", "Sucateiros"],
    dangers: ["escassez", "conflito politico", "segredos internos", "pressao externa"],
    missionHooks: [{
      title: "Artefato exigido pelo Conselho",
      type: HOOK_TYPES.MORAL,
      description: "A administracao exige um artefato encontrado em ruina, mas o grupo sabe que ele pode salvar uma colonia ou causar desastre.",
      risk: "medio",
    }],
    tags: ["Ktaluhl Kalar", "cidade", "fortaleza", "faccao"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    discoveryState: LORE_DISCOVERY_STATES.DISCOVERED,
    secretLevel: LORE_SECRET_LEVELS.PUBLIC,
    sourceChapter: "1.6. Ktaluhl Kalar",
  }),
  normalizeFactionLoreEntry({
    id: "lore-faccao-conselho-ktaluhl-kalar",
    title: "Conselho de Ktaluhl Kalar",
    subtitle: "Autoridade administrativa da cidade-fortaleza",
    summary: "Representa ordem, controle de recursos, leis, autorizacao de exploracao e resposta a crises.",
    description: "O Conselho tenta manter a cidade viva, mesmo quando suas decisoes parecem duras. E uma faccao de governo, sobrevivencia coletiva e tensao politica.",
    factionType: FACTION_LORE_TYPES.GOVERNMENT,
    objectives: ["manter a cidade viva", "controlar recursos", "evitar instabilidade", "gerir exploracao de ruinas"],
    leaders: ["Selia Vardes"],
    territory: "Ktaluhl Kalar",
    secrets: ["conflitos internos", "relatorios ocultos sobre ruinas"],
    tags: ["Conselho", "Ktaluhl Kalar", "governo"],
    importance: LORE_IMPORTANCE_LEVELS.IMPORTANT,
    sourceChapter: "3.5. Conselho de Ktaluhl Kalar",
  }),
  normalizeFactionLoreEntry({
    id: "lore-faccao-enfermaria-myrr",
    title: "Enfermaria Myrr",
    summary: "Faccao medica essencial para tratamento, quarentenas, estudos de contaminacao e decisoes morais de sobrevivencia.",
    description: "A Enfermaria e uma das faccoes mais importantes de Ktaluhl Kalar. Feridos contam segredos, contaminacao exige isolamento e medicina vira politica.",
    factionType: FACTION_LORE_TYPES.MEDICAL,
    objectives: ["salvar vidas", "controlar contaminacao", "estabilizar feridos", "estudar doencas e efeitos de Falaris"],
    territory: "Ktaluhl Kalar",
    tags: ["Enfermaria", "medicina", "Ktaluhl Kalar"],
    importance: LORE_IMPORTANCE_LEVELS.IMPORTANT,
    sourceChapter: "2.21. Exemplo de faccao: Enfermaria de Ktaluhl Kalar",
  }),
  normalizeFactionLoreEntry({
    id: "lore-faccao-forja-durn-karr",
    title: "Forja de Durn Karr",
    summary: "Coracao material da cidade: equipamentos, reparos, armas, ferramentas e manutencao.",
    description: "Sem equipamentos, a cidade sangra. A Forja depende de materiais, projetos perdidos e rotas perigosas para manter a defesa funcionando.",
    factionType: FACTION_LORE_TYPES.FORGE,
    objectives: ["manter equipamentos", "criar ferramentas", "reparar defesas", "buscar materiais raros"],
    resources: ["oficinas", "projetos", "armaduras", "ferramentas"],
    tags: ["Forja", "Durn Karr", "equipamento"],
    importance: LORE_IMPORTANCE_LEVELS.IMPORTANT,
    sourceChapter: "2.22. Exemplo de faccao: Forja de Durn Karr",
  }),
  normalizeFactionLoreEntry({
    id: "lore-faccao-sucateiros-myla-renn",
    title: "Sucateiros de Myla Renn",
    summary: "Entram onde outros nao entram, desmontam ruinas e transformam maquinas mortas em recurso.",
    description: "Sucateiros vivem entre risco, comercio e sobrevivencia. Sao fonte de pecas, boatos, atalhos, mapas e problemas.",
    factionType: FACTION_LORE_TYPES.SCAVENGERS,
    objectives: ["recuperar pecas", "avaliar ruinas", "achar rotas alternativas", "vender sucata"],
    tags: ["sucateiros", "Myla Renn", "ruinas"],
    importance: LORE_IMPORTANCE_LEVELS.USEFUL,
    sourceChapter: "2.23. Exemplo de faccao: Sucateiros de Myla Renn",
  }),
  normalizeNpcLoreEntry({
    id: "lore-npc-selia-vardes",
    title: "Selia Vardes",
    summary: "Figura politica importante de Ktaluhl Kalar, presa entre proteger a cidade e tomar decisoes duras.",
    description: "Selia pode negar ajuda a uma colonia distante para proteger a cidade. E um rosto para os conflitos morais do Conselho.",
    role: NPC_LORE_ROLES.LEADER,
    faction: "Conselho de Ktaluhl Kalar",
    location: "Ktaluhl Kalar",
    motivation: "Manter a cidade viva.",
    secret: "Pode ocultar relatorios ou riscos para evitar panico.",
    tags: ["NPC", "Conselho", "politica"],
    importance: LORE_IMPORTANCE_LEVELS.IMPORTANT,
    sourceChapter: "3.5. Conselho de Ktaluhl Kalar",
  }),
  normalizeEntityLoreEntry({
    id: "lore-entidade-uryon",
    title: "Uryon",
    summary: "Nome ligado a cultos, entidades antigas, pressagios e misterio cosmico em torno de Falaris e Tarantus.",
    description: "Alguns cultos temem ou aguardam Uryon. A natureza exata permanece instavel nas fontes e deve ser usada como misterio de campanha.",
    entityType: ENTITY_TYPES.UNKNOWN,
    influence: "cultos, sonhos, visoes, simbolos e ruinas antigas",
    signs: ["padroes que nao fecham", "visoes", "entidade esquecida", "sinais cosmicos"],
    secret: "A verdade sobre Uryon deve ser tratada como segredo de mestre ate auditoria futura.",
    tags: ["Uryon", "entidade", "misterio", "cosmos"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    secretLevel: LORE_SECRET_LEVELS.SECRET,
    needsReview: true,
    reviewReason: "O app preserva Uryon como misterio ate revisao narrativa final do Livro 4.",
    sourceChapter: "Capitulo 4 - Entidades Cosmicas, Falaris, Uryon e Portais Tharan",
  }),
  normalizeLoreEntry({
    id: "lore-tecnologia-portais-tharan",
    type: LORE_ENTRY_TYPES.TECHNOLOGY,
    title: "Portais Tharan",
    summary: "Estruturas antigas associadas a ruinas profundas, remanescentes e acesso a segredos maiores.",
    description: "Os Portais Tharan devem ser usados como tecnologia/misterio de alto risco. Entrar em um portal selado e uma decisao de campanha, nao uma rotina.",
    tags: ["Tharan", "portais", "ruina", "tecnologia-antiga"],
    importance: LORE_IMPORTANCE_LEVELS.CRITICAL,
    secretLevel: LORE_SECRET_LEVELS.SECRET,
    needsReview: true,
    reviewReason: "Funcoes mecanicas dos portais ainda nao foram fechadas no app.",
    hooks: [{
      title: "Portal Tharan selado",
      type: HOOK_TYPES.RUIN,
      description: "Entrar em um portal Tharan selado antes que uma faccao moderna ative uma arma perdida.",
      risk: "alto",
    }],
    sourceChapter: "Capitulo 4 - Entidades Cosmicas, Falaris, Uryon e Portais Tharan",
  }),
  normalizeLoreEntry({
    id: "lore-gancho-remedios-contaminados",
    type: LORE_ENTRY_TYPES.HOOK,
    title: "Remedios contaminados por poeira de Falaris",
    subtitle: "Gancho moral da Enfermaria Myrr",
    description: "Um lote de remedios cura uma doenca, mas causa visoes. A cidade precisa decidir se usa, isola ou destroi o lote.",
    summary: "Remedios contaminados por Falaris curam uma doenca enquanto causam visoes.",
    tags: ["gancho", "moral", "Enfermaria Myrr", "Falaris"],
    hooks: [{
      title: "Remedios contaminados por poeira de Falaris",
      type: HOOK_TYPES.MORAL,
      description: "Um lote de remedios cura uma doenca, mas causa visoes. A cidade precisa decidir se usa, isola ou destroi o lote.",
      linkedLocationId: "lore-cidade-ktaluhl-kalar",
      linkedFactionId: "lore-faccao-enfermaria-myrr",
      risk: "medio",
    }],
    sourceChapter: "2.20. Ganchos de campanha por faccao",
  }),
  normalizeLoreEntry({
    id: "lore-gancho-sinal-nytharal",
    type: LORE_ENTRY_TYPES.HOOK,
    title: "Sinal em Nytharal",
    subtitle: "Gancho de misterio cosmico",
    description: "Dr. Halen Myrr detecta um sinal em Nytharal repetindo o nome de uma entidade esquecida.",
    summary: "Um sinal em Nytharal repete o nome de uma entidade esquecida.",
    tags: ["gancho", "misterio", "Uryon", "Nytharal"],
    secretLevel: LORE_SECRET_LEVELS.SECRET,
    hooks: [{
      title: "Sinal em Nytharal",
      type: HOOK_TYPES.MYSTERY,
      description: "Dr. Halen Myrr detecta um sinal em Nytharal repetindo o nome de uma entidade esquecida.",
      linkedFactionId: "lore-faccao-enfermaria-myrr",
      linkedEntryId: "lore-entidade-uryon",
      risk: "alto",
      secret: "Pode apontar para Uryon ou outro remanescente antigo.",
    }],
    sourceChapter: "2.20. Ganchos de campanha por faccao",
  }),
].map((entry) => Object.freeze(entry)));

export const DEFAULT_LORE_RELATIONS = Object.freeze([
  normalizeLoreRelation({ fromId: "lore-cidade-ktaluhl-kalar", toId: "lore-planeta-tarantus", type: LORE_RELATION_TYPES.LOCATED_IN, public: true }),
  normalizeLoreRelation({ fromId: "lore-planeta-tarantus", toId: "lore-universo-solaris", type: LORE_RELATION_TYPES.LOCATED_IN, public: true }),
  normalizeLoreRelation({ fromId: "lore-evento-explosao-falaris", toId: "lore-universo-solaris", type: LORE_RELATION_TYPES.DESTROYED, public: true }),
  normalizeLoreRelation({ fromId: "lore-faccao-conselho-ktaluhl-kalar", toId: "lore-cidade-ktaluhl-kalar", type: LORE_RELATION_TYPES.CONTROLS }),
  normalizeLoreRelation({ fromId: "lore-faccao-enfermaria-myrr", toId: "lore-cidade-ktaluhl-kalar", type: LORE_RELATION_TYPES.BELONGS_TO }),
  normalizeLoreRelation({ fromId: "lore-faccao-forja-durn-karr", toId: "lore-cidade-ktaluhl-kalar", type: LORE_RELATION_TYPES.BELONGS_TO }),
  normalizeLoreRelation({ fromId: "lore-faccao-sucateiros-myla-renn", toId: "lore-cidade-ktaluhl-kalar", type: LORE_RELATION_TYPES.BELONGS_TO }),
  normalizeLoreRelation({ fromId: "lore-npc-selia-vardes", toId: "lore-faccao-conselho-ktaluhl-kalar", type: LORE_RELATION_TYPES.LEADS }),
  normalizeLoreRelation({ fromId: "lore-entidade-uryon", toId: "lore-tecnologia-portais-tharan", type: LORE_RELATION_TYPES.SECRET_OF, secret: true }),
]);

export function createDefaultLoreState() {
  return serializeLoreState({
    loreSchemaVersion: LORE_SCHEMA_VERSION,
    entries: DEFAULT_LORE_ENTRIES.map(clone),
    relations: DEFAULT_LORE_RELATIONS.map(clone),
    pinnedLoreEntries: ["lore-planeta-tarantus", "lore-cidade-ktaluhl-kalar"],
    discoveredLoreEntries: ["lore-universo-solaris", "lore-evento-explosao-falaris", "lore-planeta-tarantus", "lore-cidade-ktaluhl-kalar"],
    secretLoreEntries: ["lore-entidade-uryon", "lore-tecnologia-portais-tharan"],
    loreNotes: [],
    reportLoreEntries: [],
    missionLoreLinks: [],
    factionLoreLinks: [],
    locationLoreLinks: [],
    npcLoreLinks: [],
    monsterLoreLinks: [],
    itemLoreLinks: [],
    metadata: {
      source: "Livro 4",
      sourceFileCurrent: OFFICIAL_BOOK4_SOURCE,
      sourceStatus: "current-source-needs-review",
    },
  });
}
