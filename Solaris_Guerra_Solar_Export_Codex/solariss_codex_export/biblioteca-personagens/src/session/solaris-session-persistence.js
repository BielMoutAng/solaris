import {
  LORE_SCHEMA_VERSION,
  hydrateLoreState,
  serializeLoreState,
} from "../domain/solaris-lore-rules.js";

export const SESSION_SCHEMA_VERSION = "1.0.0";
export const SESSION_EXPORT_KIND = "solaris-tabletop-session";
export const CAMPAIGN_STORAGE_KEY = "solaris.tabletop.campaigns.v1";
export const ACTIVE_CAMPAIGN_STORAGE_KEY = "solaris.tabletop.activeCampaign.v1";
export const RECOVERY_STORAGE_KEY = "solaris.tabletop.recovery.v1";

function createId(prefix = "persist") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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

const GM_CAMPAIGN_KEYS = Object.freeze([
  "gmSchemaVersion",
  "activeMissionId",
  "missions",
  "travelRoutes",
  "resourceTracks",
  "factionStates",
  "reputationLog",
  "campaignClocks",
  "gmEvents",
  "rewards",
  "consequences",
  "hackingChallenges",
  "bases",
]);

const LORE_CAMPAIGN_KEYS = Object.freeze([
  "loreSchemaVersion",
  "loreState",
  "pinnedLoreEntries",
  "discoveredLoreEntries",
  "secretLoreEntries",
  "loreNotes",
  "loreRelations",
  "reportLoreEntries",
  "missionLoreLinks",
  "factionLoreLinks",
  "locationLoreLinks",
  "npcLoreLinks",
  "monsterLoreLinks",
  "itemLoreLinks",
]);

function extractGmCampaignState(source = {}) {
  const gmState = objectOf(source.gmState || source.gmDashboard?.gmState);
  return {
    gmSchemaVersion: Number(source.gmSchemaVersion || gmState.gmSchemaVersion || 1),
    activeMissionId: String(source.activeMissionId || gmState.activeMissionId || ""),
    missions: arrayOf(source.missions || gmState.missions || source.gmDashboard?.missions).map((entry) => clone(entry)),
    travelRoutes: arrayOf(source.travelRoutes || gmState.travelRoutes || source.gmDashboard?.travelRoutes).map((entry) => clone(entry)),
    resourceTracks: arrayOf(source.resourceTracks || gmState.resourceTracks || source.gmDashboard?.resourceTracks).map((entry) => clone(entry)),
    factionStates: arrayOf(source.factionStates || gmState.factionStates || source.gmDashboard?.factionStates).map((entry) => clone(entry)),
    reputationLog: arrayOf(source.reputationLog || gmState.reputationLog || source.gmDashboard?.reputationLog).map((entry) => clone(entry)),
    campaignClocks: arrayOf(source.campaignClocks || gmState.campaignClocks || source.gmDashboard?.campaignClocks).map((entry) => clone(entry)),
    gmEvents: arrayOf(source.gmEvents || gmState.gmEvents || source.gmDashboard?.gmEvents).map((entry) => clone(entry)),
    rewards: arrayOf(source.rewards || gmState.rewards || source.gmDashboard?.rewards).map((entry) => clone(entry)),
    consequences: arrayOf(source.consequences || gmState.consequences || source.gmDashboard?.consequences).map((entry) => clone(entry)),
    hackingChallenges: arrayOf(source.hackingChallenges || gmState.hackingChallenges || source.gmDashboard?.hackingChallenges).map((entry) => clone(entry)),
    bases: arrayOf(source.bases || gmState.bases || source.gmDashboard?.bases).map((entry) => clone(entry)),
  };
}

function extractLoreCampaignState(source = {}) {
  const loreState = hydrateLoreState({
    ...(clone(source.loreState || source.gmDashboard?.loreState) || {}),
    loreSchemaVersion: source.loreSchemaVersion || source.gmDashboard?.loreSchemaVersion || LORE_SCHEMA_VERSION,
    pinnedLoreEntries: source.pinnedLoreEntries || source.gmDashboard?.pinnedLoreEntries || source.gmDashboard?.loreState?.pinnedLoreEntries,
    discoveredLoreEntries: source.discoveredLoreEntries || source.gmDashboard?.discoveredLoreEntries || source.gmDashboard?.loreState?.discoveredLoreEntries,
    secretLoreEntries: source.secretLoreEntries || source.gmDashboard?.secretLoreEntries || source.gmDashboard?.loreState?.secretLoreEntries,
    loreNotes: source.loreNotes || source.gmDashboard?.loreNotes || source.gmDashboard?.loreState?.loreNotes,
    relations: source.loreRelations || source.gmDashboard?.loreRelations || source.gmDashboard?.loreState?.relations,
    reportLoreEntries: source.reportLoreEntries || source.gmDashboard?.reportLoreEntries || source.gmDashboard?.loreState?.reportLoreEntries,
    missionLoreLinks: source.missionLoreLinks || source.gmDashboard?.missionLoreLinks || source.gmDashboard?.loreState?.missionLoreLinks,
    factionLoreLinks: source.factionLoreLinks || source.gmDashboard?.factionLoreLinks || source.gmDashboard?.loreState?.factionLoreLinks,
    locationLoreLinks: source.locationLoreLinks || source.gmDashboard?.locationLoreLinks || source.gmDashboard?.loreState?.locationLoreLinks,
    npcLoreLinks: source.npcLoreLinks || source.gmDashboard?.npcLoreLinks || source.gmDashboard?.loreState?.npcLoreLinks,
    monsterLoreLinks: source.monsterLoreLinks || source.gmDashboard?.monsterLoreLinks || source.gmDashboard?.loreState?.monsterLoreLinks,
    itemLoreLinks: source.itemLoreLinks || source.gmDashboard?.itemLoreLinks || source.gmDashboard?.loreState?.itemLoreLinks,
  });
  return {
    loreSchemaVersion: loreState.loreSchemaVersion,
    loreState: serializeLoreState(loreState),
    pinnedLoreEntries: arrayOf(loreState.pinnedLoreEntries).map((entry) => clone(entry)),
    discoveredLoreEntries: arrayOf(loreState.discoveredLoreEntries).map((entry) => clone(entry)),
    secretLoreEntries: arrayOf(loreState.secretLoreEntries).map((entry) => clone(entry)),
    loreNotes: arrayOf(loreState.loreNotes).map((entry) => clone(entry)),
    loreRelations: arrayOf(loreState.relations).map((entry) => clone(entry)),
    reportLoreEntries: arrayOf(loreState.reportLoreEntries).map((entry) => clone(entry)),
    missionLoreLinks: arrayOf(loreState.missionLoreLinks).map((entry) => clone(entry)),
    factionLoreLinks: arrayOf(loreState.factionLoreLinks).map((entry) => clone(entry)),
    locationLoreLinks: arrayOf(loreState.locationLoreLinks).map((entry) => clone(entry)),
    npcLoreLinks: arrayOf(loreState.npcLoreLinks).map((entry) => clone(entry)),
    monsterLoreLinks: arrayOf(loreState.monsterLoreLinks).map((entry) => clone(entry)),
    itemLoreLinks: arrayOf(loreState.itemLoreLinks).map((entry) => clone(entry)),
  };
}

function compareVersion(a = "0.0.0", b = "0.0.0") {
  const pa = String(a).split(".").map((part) => Number(part) || 0);
  const pb = String(b).split(".").map((part) => Number(part) || 0);
  for (let index = 0; index < Math.max(pa.length, pb.length); index += 1) {
    const diff = (pa[index] || 0) - (pb[index] || 0);
    if (diff) return diff;
  }
  return 0;
}

export function getCurrentSessionSchemaVersion() {
  return SESSION_SCHEMA_VERSION;
}

export function normalizeSessionState(rawState = {}) {
  const source = clone(rawState?.sessionState || rawState?.room || rawState) || {};
  const updatedAt = source.updatedAt || nowIso();
  const scene = objectOf(source.scene);
  return {
    schemaVersion: String(source.schemaVersion || source.sessionSchemaVersion || SESSION_SCHEMA_VERSION),
    sessionSchemaVersion: String(source.sessionSchemaVersion || source.schemaVersion || SESSION_SCHEMA_VERSION),
    roomId: String(source.roomId || source.id || "colonia-solaris-7"),
    roomName: String(source.roomName || source.name || "Colonia Solaris-7"),
    hostId: String(source.hostId || source.hostPlayerId || ""),
    hostPlayerId: String(source.hostPlayerId || source.hostId || ""),
    system: String(source.system || "Guerra Solar / Solaris"),
    players: arrayOf(source.players).map((entry) => clone(entry)),
    chatMessages: arrayOf(source.chatMessages || source.chat).map((entry) => clone(entry)),
    diceRolls: arrayOf(source.diceRolls || source.diceLog).map((entry) => clone(entry)),
    characters: arrayOf(source.characters).map((entry) => clone(entry)),
    characterRevisions: objectOf(source.characterRevisions),
    combatState: clone(source.combatState || source.combat || {}),
    combat: clone(source.combat || source.combatState || {}),
    scene: clone(scene),
    scenes: arrayOf(source.scenes).length ? arrayOf(source.scenes).map((entry) => clone(entry)) : [clone(scene)],
    mapTokens: arrayOf(source.mapTokens || scene.tokens).map((entry) => clone(entry)),
    zones: arrayOf(source.zones || scene.zones).map((entry) => clone(entry)),
    objectives: arrayOf(source.objectives || scene.objectives).map((entry) => clone(entry)),
    measurements: arrayOf(source.measurements || scene.measurements).map((entry) => clone(entry)),
    areas: arrayOf(source.areas || scene.areas).map((entry) => clone(entry)),
    selectedTargets: arrayOf(source.selectedTargets).map((entry) => clone(entry)),
    monsters: arrayOf(source.monsters).map((entry) => clone(entry)),
    lootPacks: arrayOf(source.lootPacks).map((entry) => clone(entry)),
    shopState: clone(source.shopState || {}),
    transactionLog: arrayOf(source.transactionLog).map((entry) => clone(entry)),
    gmNotes: arrayOf(source.gmNotes || source.gmDashboard?.gmNotes || source.gmDashboard?.notes).map((entry) => clone(entry)),
    revealedNotes: arrayOf(source.revealedNotes || source.gmDashboard?.revealedNotes).map((entry) => clone(entry)),
    gmCounters: arrayOf(source.gmCounters || source.counters || source.gmDashboard?.gmCounters || source.gmDashboard?.counters).map((entry) => clone(entry)),
    environmentalEffects: arrayOf(source.environmentalEffects || source.gmDashboard?.environmentalEffects).map((entry) => clone(entry)),
    preparedEncounters: arrayOf(source.preparedEncounters || source.gmDashboard?.preparedEncounters).map((entry) => clone(entry)),
    sessionReports: arrayOf(source.sessionReports || source.reports || source.gmDashboard?.sessionReports).map((entry) => clone(entry)),
    sceneList: arrayOf(source.sceneList || source.gmDashboard?.sceneList || source.scenes).length
      ? arrayOf(source.sceneList || source.gmDashboard?.sceneList || source.scenes).map((entry) => clone(entry))
      : [clone(scene)],
    activeSceneId: String(source.activeSceneId || source.gmDashboard?.activeSceneId || scene.id || ""),
    gmDashboardSettings: {
      ...(clone(source.gmDashboardSettings || source.gmDashboard?.settings || {}) || {}),
      pinnedShieldRules: arrayOf(source.pinnedShieldRules || source.gmDashboardSettings?.pinnedShieldRules || source.gmDashboard?.settings?.pinnedShieldRules).map(String),
      favoriteShieldRules: arrayOf(source.favoriteShieldRules || source.gmDashboardSettings?.favoriteShieldRules || source.gmDashboard?.settings?.favoriteShieldRules).map(String),
      reportSettings: clone(source.reportSettings || source.gmDashboardSettings?.reportSettings || source.gmDashboard?.settings?.reportSettings || {}) || {},
    },
    ...extractGmCampaignState(source),
    ...extractLoreCampaignState(source),
    approvals: arrayOf(source.approvals || source.pendingApprovals).map((entry) => clone(entry)),
    logs: arrayOf(source.logs || source.events).map((entry) => clone(entry)),
    events: arrayOf(source.events || source.logs).map((entry) => clone(entry)),
    settings: clone(source.settings || {}),
    sequence: Number(source.sequence || 0),
    createdAt: source.createdAt || updatedAt,
    updatedAt,
    metadata: {
      ...(clone(source.metadata || {}) || {}),
      normalizedAt: nowIso(),
    },
  };
}

export function validateSessionState(state = {}) {
  const errors = [];
  if (!state || typeof state !== "object") errors.push("Sessao invalida.");
  if (!String(state.roomId || state.id || "").trim()) errors.push("Sessao sem roomId.");
  if (!String(state.roomName || state.name || "").trim()) errors.push("Sessao sem nome.");
  if (!Array.isArray(state.players)) errors.push("players deve ser uma lista.");
  if (!Array.isArray(state.characters)) errors.push("characters deve ser uma lista.");
  if (!state.scene || typeof state.scene !== "object") errors.push("scene deve existir.");
  return {
    ok: errors.length === 0,
    errors,
  };
}

export function migrateSessionState(rawState = {}) {
  const migrated = normalizeSessionState(rawState);
  if (compareVersion(migrated.schemaVersion, SESSION_SCHEMA_VERSION) > 0) {
    migrated.metadata = {
      ...(migrated.metadata || {}),
      newerThanApp: true,
      warning: `Sessao exportada em schema ${migrated.schemaVersion}; app conhece ${SESSION_SCHEMA_VERSION}.`,
    };
  }
  migrated.schemaVersion = SESSION_SCHEMA_VERSION;
  migrated.sessionSchemaVersion = SESSION_SCHEMA_VERSION;
  const validation = validateSessionState(migrated);
  if (!validation.ok) {
    throw new Error(`Sessao invalida: ${validation.errors.join(" ")}`);
  }
  return migrated;
}

export function normalizeCampaign(rawCampaign = {}) {
  const source = clone(rawCampaign?.campaign || rawCampaign) || {};
  const createdAt = source.createdAt || nowIso();
  const updatedAt = source.updatedAt || createdAt;
  const sessions = arrayOf(source.sessions).map((session) => migrateSessionState(session));
  const scenes = arrayOf(source.scenes).map((scene) => clone(scene));
  const autosaves = arrayOf(source.autosaves).map((snapshot) => ({
    id: String(snapshot.id || createId("autosave")),
    campaignId: String(snapshot.campaignId || source.id || ""),
    sessionId: String(snapshot.sessionId || snapshot.stateSnapshot?.roomId || ""),
    createdAt: snapshot.createdAt || nowIso(),
    label: String(snapshot.label || "Autosave"),
    stateSnapshot: migrateSessionState(snapshot.stateSnapshot || snapshot.sessionState || {}),
    version: String(snapshot.version || SESSION_SCHEMA_VERSION),
  }));
  return {
    id: String(source.id || createId("campaign")),
    name: String(source.name || "Campanha Solaris"),
    systemName: String(source.systemName || source.system || "Guerra Solar / Solaris"),
    description: String(source.description || ""),
    createdAt,
    updatedAt,
    ownerName: String(source.ownerName || source.owner || "Solaris GM"),
    version: String(source.version || SESSION_SCHEMA_VERSION),
    sessions,
    scenes,
    characters: arrayOf(source.characters).map((entry) => clone(entry)),
    monsters: arrayOf(source.monsters).map((entry) => clone(entry)),
    lootPacks: arrayOf(source.lootPacks).map((entry) => clone(entry)),
    shopState: clone(source.shopState || {}),
    transactionLog: arrayOf(source.transactionLog).map((entry) => clone(entry)),
    gmNotes: arrayOf(source.gmNotes).map((entry) => clone(entry)),
    revealedNotes: arrayOf(source.revealedNotes).map((entry) => clone(entry)),
    gmCounters: arrayOf(source.gmCounters || source.counters).map((entry) => clone(entry)),
    environmentalEffects: arrayOf(source.environmentalEffects).map((entry) => clone(entry)),
    preparedEncounters: arrayOf(source.preparedEncounters).map((entry) => clone(entry)),
    sessionReports: arrayOf(source.sessionReports || source.reports).map((entry) => clone(entry)),
    sceneList: arrayOf(source.sceneList || source.scenes).map((entry) => clone(entry)),
    activeSceneId: String(source.activeSceneId || ""),
    gmDashboardSettings: clone(source.gmDashboardSettings || {}) || {},
    ...extractGmCampaignState(source),
    ...extractLoreCampaignState(source),
    notes: String(source.notes || ""),
    settings: {
      autosaveEnabled: source.settings?.autosaveEnabled !== false,
      autosaveIntervalSeconds: Math.max(10, Number(source.settings?.autosaveIntervalSeconds || 60)),
      maxAutosaves: Math.max(1, Number(source.settings?.maxAutosaves || 10)),
      ...(clone(source.settings || {}) || {}),
    },
    autosaves,
    metadata: clone(source.metadata || {}) || {},
  };
}

export function validateCampaign(campaign = {}) {
  const errors = [];
  if (!campaign || typeof campaign !== "object") errors.push("Campanha invalida.");
  if (!String(campaign.id || "").trim()) errors.push("Campanha sem id.");
  if (!String(campaign.name || "").trim()) errors.push("Campanha sem nome.");
  if (!Array.isArray(campaign.sessions)) errors.push("sessions deve ser uma lista.");
  if (!Array.isArray(campaign.autosaves)) errors.push("autosaves deve ser uma lista.");
  return {
    ok: errors.length === 0,
    errors,
  };
}

export function migrateCampaign(rawCampaign = {}) {
  const campaign = normalizeCampaign(rawCampaign);
  const validation = validateCampaign(campaign);
  if (!validation.ok) {
    throw new Error(`Campanha invalida: ${validation.errors.join(" ")}`);
  }
  return campaign;
}

export function createCampaign({
  name = "Nova Campanha Solaris",
  systemName = "Guerra Solar / Solaris",
  description = "",
  ownerName = "Solaris GM",
  sessionState = null,
} = {}) {
  const campaign = normalizeCampaign({
    name,
    systemName,
    description,
    ownerName,
    sessions: sessionState ? [migrateSessionState(sessionState)] : [],
    scenes: sessionState?.scene ? [sessionState.scene] : [],
    sceneList: sessionState?.sceneList || (sessionState?.scene ? [sessionState.scene] : []),
    activeSceneId: sessionState?.activeSceneId || sessionState?.scene?.id || "",
    gmNotes: sessionState?.gmNotes || [],
    revealedNotes: sessionState?.revealedNotes || [],
    gmCounters: sessionState?.gmCounters || [],
    environmentalEffects: sessionState?.environmentalEffects || [],
    preparedEncounters: sessionState?.preparedEncounters || [],
    sessionReports: sessionState?.sessionReports || [],
    gmDashboardSettings: sessionState?.gmDashboardSettings || {},
    ...extractGmCampaignState(sessionState || {}),
    ...extractLoreCampaignState(sessionState || {}),
  });
  return campaign;
}

export function createSessionSnapshot({
  room = {},
  campaignId = "",
  label = "Sessao salva",
} = {}) {
  const state = migrateSessionState(room);
  return {
    id: createId("session-snapshot"),
    campaignId: String(campaignId || ""),
    sessionId: state.roomId,
    createdAt: nowIso(),
    label: String(label || "Sessao salva"),
    stateSnapshot: state,
    version: SESSION_SCHEMA_VERSION,
  };
}

export function upsertCampaignSession(campaign = {}, sessionState = {}, label = "Sessao salva") {
  const next = migrateCampaign(campaign);
  const state = migrateSessionState(sessionState);
  const existingIndex = next.sessions.findIndex((session) => session.roomId === state.roomId);
  if (existingIndex >= 0) next.sessions[existingIndex] = state;
  else next.sessions.unshift(state);
  if (!next.scenes.some((scene) => scene?.id === state.scene?.id)) next.scenes.unshift(clone(state.scene));
  next.characters = state.characters;
  next.monsters = state.monsters;
  next.lootPacks = state.lootPacks;
  next.shopState = state.shopState;
  next.transactionLog = state.transactionLog;
  next.gmNotes = state.gmNotes;
  next.revealedNotes = state.revealedNotes;
  next.gmCounters = state.gmCounters;
  next.environmentalEffects = state.environmentalEffects;
  next.preparedEncounters = state.preparedEncounters;
  next.sessionReports = state.sessionReports;
  next.sceneList = state.sceneList;
  next.activeSceneId = state.activeSceneId;
  next.gmDashboardSettings = state.gmDashboardSettings;
  for (const key of GM_CAMPAIGN_KEYS) {
    next[key] = clone(state[key]);
  }
  for (const key of LORE_CAMPAIGN_KEYS) {
    next[key] = clone(state[key]);
  }
  next.updatedAt = nowIso();
  next.metadata = {
    ...(next.metadata || {}),
    lastSaveLabel: label,
    lastSessionId: state.roomId,
  };
  return next;
}

export function createAutosave(campaign = {}, sessionState = {}, options = {}) {
  const next = migrateCampaign(campaign);
  const maxAutosaves = Math.max(1, Number(options.maxAutosaves || next.settings.maxAutosaves || 10));
  const snapshot = createSessionSnapshot({
    room: sessionState,
    campaignId: next.id,
    label: options.label || "Autosave",
  });
  next.autosaves = [snapshot, ...arrayOf(next.autosaves)]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, maxAutosaves);
  next.updatedAt = nowIso();
  return {
    campaign: next,
    snapshot,
  };
}

export function restoreAutosave(campaign = {}, autosaveId = "") {
  const next = migrateCampaign(campaign);
  const snapshot = next.autosaves.find((entry) => entry.id === autosaveId);
  if (!snapshot) throw new Error("Autosave nao encontrado.");
  return migrateSessionState(snapshot.stateSnapshot);
}

export function createSessionExportBundle({
  campaign = null,
  sessionState = {},
  appVersion = "0.0.0",
  notes = "",
} = {}) {
  const normalizedSession = migrateSessionState(sessionState);
  const normalizedCampaign = campaign ? upsertCampaignSession(campaign, normalizedSession, "Exportacao") : createCampaign({
    name: normalizedSession.roomName,
    sessionState: normalizedSession,
  });
  return {
    kind: SESSION_EXPORT_KIND,
    schemaVersion: SESSION_SCHEMA_VERSION,
    appVersion: String(appVersion || "0.0.0"),
    exportedAt: nowIso(),
    campaign: normalizedCampaign,
    sessionState: normalizedSession,
    assetsPolicy: {
      embeddedDataUrls: true,
      externalAssets: "preserve-reference",
    },
    notes: String(notes || ""),
  };
}

export function parseSessionExportBundle(input) {
  const raw = typeof input === "string" ? JSON.parse(input) : clone(input);
  if (!raw || typeof raw !== "object") throw new Error("Arquivo de sessao invalido.");
  const sessionState = migrateSessionState(raw.sessionState || raw.room || raw.campaign?.sessions?.[0] || raw);
  const campaign = raw.campaign ? migrateCampaign(raw.campaign) : createCampaign({
    name: sessionState.roomName,
    sessionState,
  });
  return {
    ...raw,
    kind: raw.kind || SESSION_EXPORT_KIND,
    schemaVersion: SESSION_SCHEMA_VERSION,
    campaign: upsertCampaignSession(campaign, sessionState, "Importacao"),
    sessionState,
  };
}

export function serializeCampaignList(campaigns = []) {
  return JSON.stringify(arrayOf(campaigns).map((campaign) => migrateCampaign(campaign)));
}

export function parseCampaignList(raw = "[]") {
  const parsed = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
  return arrayOf(parsed).map((campaign) => migrateCampaign(campaign));
}

export function getRecentRecovery(raw = null, maxAgeMs = 1000 * 60 * 60 * 24) {
  if (!raw) return null;
  const recovery = typeof raw === "string" ? JSON.parse(raw) : raw;
  const createdAt = new Date(recovery.createdAt || recovery.savedAt || 0).getTime();
  if (!createdAt || Date.now() - createdAt > maxAgeMs) return null;
  return {
    id: String(recovery.id || createId("recovery")),
    createdAt: recovery.createdAt || recovery.savedAt || nowIso(),
    label: String(recovery.label || "Sessao recente"),
    campaignId: String(recovery.campaignId || ""),
    sessionState: migrateSessionState(recovery.sessionState || recovery.room || {}),
  };
}
