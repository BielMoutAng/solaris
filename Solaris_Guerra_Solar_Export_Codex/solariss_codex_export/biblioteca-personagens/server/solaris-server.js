import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { WebSocketServer } from "ws";

import {
  GAME_EVENT_TYPES,
  GameRoom,
  PlayerConnection,
  SESSION_ROLES,
  SessionCharacter,
} from "../src/session/solaris-session-domain.js";
import {
  createAutosave,
  createCampaign,
  createSessionExportBundle,
  createSessionSnapshot,
  migrateCampaign,
  migrateSessionState,
  parseSessionExportBundle,
  upsertCampaignSession,
} from "../src/session/solaris-session-persistence.js";

const PORT = Number(process.env.PORT || 3000);
const APP_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_ROOM_ID = "colonia-solaris-7";
const DEFAULT_ROOM_NAME = "Colonia Solaris-7";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const rooms = new Map();
const clients = new Map();
const campaigns = new Map();
let activeCampaignId = "";
const ROOM_EVENT_TYPES = new Set(Object.values(GAME_EVENT_TYPES));

function createId(prefix = "session") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function send(socket, type, payload = {}) {
  if (socket.readyState !== 1) return;
  socket.send(JSON.stringify({
    type,
    payload,
    sentAt: new Date().toISOString(),
  }));
}

function sendError(socket, message) {
  send(socket, "error", { message });
}

function roomPayload(room, viewerPlayerId = "") {
  const data = room.toJSON();
  const viewer = viewerPlayerId ? room.getPlayer(viewerPlayerId) : null;
  const gmDashboard = room.gmDashboardStateFor(viewer);
  return {
    roomId: data.id,
    roomName: data.name,
    system: data.system,
    hostId: data.hostPlayerId,
    hostPlayerId: data.hostPlayerId,
    players: data.players,
    characters: data.characters,
    monsters: data.monsters,
    chatMessages: data.chat,
    diceRolls: data.diceLog,
    approvals: data.approvals,
    pendingApprovals: data.pendingApprovals,
    shopState: data.shopState,
    lootPacks: data.lootPacks,
    transactionLog: data.transactionLog,
    gmNotes: gmDashboard.gmNotes,
    revealedNotes: gmDashboard.revealedNotes,
    gmCounters: gmDashboard.gmCounters,
    counters: gmDashboard.gmCounters,
    environmentalEffects: gmDashboard.environmentalEffects,
    preparedEncounters: gmDashboard.preparedEncounters,
    sessionReports: gmDashboard.sessionReports,
    sceneList: gmDashboard.sceneList,
    scenes: gmDashboard.sceneList,
    activeSceneId: gmDashboard.activeSceneId,
    gmDashboard,
    combat: data.combat,
    scene: viewerPlayerId ? room.sceneForPlayer(viewerPlayerId) : data.scene,
    sequence: data.sequence,
    updatedAt: data.updatedAt,
  };
}

function campaignPayload(campaign = {}) {
  const data = migrateCampaign(campaign);
  return {
    ...data,
    sessions: data.sessions.map((session) => ({
      roomId: session.roomId,
      roomName: session.roomName,
      updatedAt: session.updatedAt,
      players: session.players.length,
      characters: session.characters.length,
      monsters: session.monsters.length,
    })),
  };
}

function campaignListPayload() {
  return Array.from(campaigns.values())
    .map(campaignPayload)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function sessionFromRoom(room) {
  return migrateSessionState(room.toJSON());
}

function roomDataFromSession(sessionState = {}) {
  const state = migrateSessionState(sessionState);
  return {
    ...state,
    id: state.roomId,
    name: state.roomName,
    hostPlayerId: state.hostPlayerId || state.hostId,
    chat: state.chatMessages,
    diceLog: state.diceRolls,
    combat: state.combatState || state.combat,
    scene: {
      ...(state.scene || {}),
      tokens: state.mapTokens.length ? state.mapTokens : state.scene?.tokens,
      zones: state.zones.length ? state.zones : state.scene?.zones,
      objectives: state.objectives.length ? state.objectives : state.scene?.objectives,
      measurements: state.measurements.length ? state.measurements : state.scene?.measurements,
      areas: state.areas.length ? state.areas : state.scene?.areas,
    },
    approvals: state.approvals,
    gmNotes: state.gmNotes,
    revealedNotes: state.revealedNotes,
    gmCounters: state.gmCounters,
    environmentalEffects: state.environmentalEffects,
    preparedEncounters: state.preparedEncounters,
    sessionReports: state.sessionReports,
    sceneList: state.sceneList || state.scenes,
    activeSceneId: state.activeSceneId,
    gmDashboardSettings: state.gmDashboardSettings,
    events: state.logs.length ? state.logs : state.events,
  };
}

function createOrUpdateActiveCampaign(room, patch = {}) {
  const current = activeCampaignId ? campaigns.get(activeCampaignId) : null;
  const base = current || createCampaign({
    name: room?.name || DEFAULT_ROOM_NAME,
    ownerName: room?.getPlayer?.(room.hostPlayerId)?.name || "Solaris GM",
    sessionState: room ? sessionFromRoom(room) : null,
  });
  const next = migrateCampaign({
    ...base,
    ...patch,
    id: patch.id || base.id,
    sessions: patch.sessions || base.sessions,
    autosaves: patch.autosaves || base.autosaves,
    updatedAt: new Date().toISOString(),
  });
  campaigns.set(next.id, next);
  activeCampaignId = next.id;
  return next;
}

function broadcastRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const [socket, meta] of clients.entries()) {
    if (meta.roomId === roomId) send(socket, "room:state", { room: roomPayload(room, meta.playerId) });
  }
}

function normalizePlayer(rawPlayer = {}, fallbackRole = SESSION_ROLES.PLAYER) {
  const player = new PlayerConnection({
    ...rawPlayer,
    id: rawPlayer.id || createId("player"),
    name: rawPlayer.name || "Jogador Solaris",
    role: rawPlayer.role || fallbackRole,
    online: true,
  });
  return player;
}

function upsertSessionCharacter(room, player, rawCharacter = null) {
  if (!rawCharacter) return null;
  const characterId = String(rawCharacter.characterId || rawCharacter.id || player.characterId || `${player.id}-character`);
  const existing = room.getCharacter(characterId);
  const snapshot = clone(rawCharacter.snapshot || rawCharacter);
  const patch = {
    currentPV: Number(snapshot.currentPV ?? snapshot.pvCurrent ?? snapshot.pvAtual ?? 0),
    maxPV: Number(snapshot.maxPV ?? snapshot.pvMax ?? snapshot.pvMaximo ?? 0),
    cosmosCurrent: Number(snapshot.cosmosCurrent ?? 0),
    cosmosMax: Number(snapshot.cosmosMax ?? 0),
    stress: Number(snapshot.stress ?? 0),
    ca: Number(snapshot.ca ?? 0),
    movement: Number(snapshot.movement ?? 0),
    race: snapshot.race || "",
    profession: snapshot.profession || "",
    level: Number(snapshot.level ?? 1),
    portrait: snapshot.portrait || snapshot.photoDataUrl || "",
    weapon: snapshot.weapon || "",
    armor: snapshot.armor || "",
  };
  if (existing) {
    existing.ownerPlayerId = existing.ownerPlayerId || player.id;
    existing.update({ ...snapshot, ...patch }, { revision: Number(snapshot.revision ?? existing.revision ?? 0) });
    room.syncSceneTokens();
    return existing;
  }
  const character = new SessionCharacter({
    id: characterId,
    characterId,
    ownerPlayerId: player.id,
    name: snapshot.name || rawCharacter.name || player.name,
    snapshot: { ...snapshot, ...patch },
    revision: Number(snapshot.revision ?? 0),
  });
  room.characters.push(character);
  player.characterId = character.id;
  room.syncSceneTokens();
  return character;
}

function createOrGetRoom(roomId = DEFAULT_ROOM_ID, roomName = DEFAULT_ROOM_NAME) {
  const id = String(roomId || DEFAULT_ROOM_ID);
  if (!rooms.has(id)) {
    rooms.set(id, new GameRoom({
      id,
      name: roomName || DEFAULT_ROOM_NAME,
      system: "Guerra Solar / Solaris",
    }));
  }
  return rooms.get(id);
}

function canEditResources(room, actorId, character) {
  const actor = room.getPlayer(actorId);
  if (!actor || !character) return false;
  return actor.isGM || character.ownerPlayerId === actor.id;
}

function handleRoomCreate(socket, payload = {}) {
  const player = normalizePlayer(payload.player, SESSION_ROLES.GM);
  player.role = SESSION_ROLES.GM;
  const room = createOrGetRoom(payload.roomId || DEFAULT_ROOM_ID, payload.roomName || DEFAULT_ROOM_NAME);
  room.dispatch(GAME_EVENT_TYPES.PLAYER_JOIN, player.toJSON());
  room.hostPlayerId = player.id;
  upsertSessionCharacter(room, player, payload.character);
  clients.set(socket, { roomId: room.id, playerId: player.id, role: player.role });
  broadcastRoom(room.id);
}

function handleRoomJoin(socket, payload = {}) {
  const player = normalizePlayer(payload.player, SESSION_ROLES.PLAYER);
  const room = createOrGetRoom(payload.roomId || DEFAULT_ROOM_ID, payload.roomName || DEFAULT_ROOM_NAME);
  room.dispatch(GAME_EVENT_TYPES.PLAYER_JOIN, player.toJSON());
  upsertSessionCharacter(room, player, payload.character);
  clients.set(socket, { roomId: room.id, playerId: player.id, role: player.role });
  broadcastRoom(room.id);
}

function handleChat(socket, payload = {}) {
  const meta = clients.get(socket);
  const room = meta ? rooms.get(meta.roomId) : null;
  if (!room) return sendError(socket, "Entre em uma sala antes de enviar chat.");
  room.dispatch(GAME_EVENT_TYPES.CHAT_MESSAGE, { message: payload.message || "" }, meta.playerId);
  broadcastRoom(room.id);
}

function handleDice(socket, payload = {}) {
  const meta = clients.get(socket);
  const room = meta ? rooms.get(meta.roomId) : null;
  if (!room) return sendError(socket, "Entre em uma sala antes de rolar dados.");
  room.dispatch(GAME_EVENT_TYPES.DICE_ROLL, payload, meta.playerId);
  broadcastRoom(room.id);
}

function handleCharacterResources(socket, payload = {}) {
  const meta = clients.get(socket);
  const room = meta ? rooms.get(meta.roomId) : null;
  if (!room) return sendError(socket, "Entre em uma sala antes de alterar recursos.");
  const character = room.getCharacter(payload.characterId);
  if (!character) return sendError(socket, "Personagem nao encontrado na sala.");
  if (!canEditResources(room, meta.playerId, character)) {
    return sendError(socket, "Permissao insuficiente para alterar esta ficha.");
  }
  const resources = payload.resources || {};
  character.update({
    currentPV: Number(resources.currentPV ?? resources.pvCurrent ?? character.snapshot.currentPV ?? 0),
    pvCurrent: Number(resources.pvCurrent ?? resources.currentPV ?? character.snapshot.currentPV ?? 0),
    cosmosCurrent: Number(resources.cosmosCurrent ?? character.snapshot.cosmosCurrent ?? 0),
    stress: Number(resources.stress ?? character.snapshot.stress ?? 0),
  });
  room.syncCombatants();
  if (room.combat.active) {
    room.addCombatLog({
      type: "resources:update",
      actorId: meta.playerId,
      actorName: room.getPlayer(meta.playerId)?.name || "Mesa",
      targetId: character.id,
      targetName: character.name,
      message: `${character.name} atualizou recursos vitais.`,
    });
  }
  broadcastRoom(room.id);
}

function currentRoom(socket) {
  const meta = clients.get(socket);
  const room = meta ? rooms.get(meta.roomId) : null;
  return { meta, room };
}

function dispatchRoomEvent(socket, type, payload = {}) {
  const { meta, room } = currentRoom(socket);
  if (!room || !meta?.playerId) {
    sendError(socket, "Entre em uma sala antes de executar esta acao.");
    return;
  }
  room.dispatch(type, payload, meta.playerId);
  broadcastRoom(room.id);
}

function handleCharacterSyncRequest(socket, payload = {}) {
  const { meta, room } = currentRoom(socket);
  if (!room || !meta?.playerId) {
    sendError(socket, "Entre em uma sala antes de sincronizar ficha.");
    return;
  }
  const event = room.dispatch(GAME_EVENT_TYPES.CHARACTER_SYNC_REQUEST, payload, meta.playerId);
  const character = room.getCharacter(payload.characterId || payload.id);
  if (character) {
    send(socket, GAME_EVENT_TYPES.CHARACTER_SYNC_FULL, {
      characterId: character.id,
      snapshot: character.snapshot,
      revision: character.revision,
      event,
    });
  }
  broadcastRoom(room.id);
}

function sendCampaignState(socket, extra = {}) {
  send(socket, "campaign:list", {
    campaigns: campaignListPayload(),
    activeCampaignId,
    ...extra,
  });
}

function assertGmForPersistence(room, playerId = "") {
  const actor = room?.getPlayer?.(playerId);
  if (!actor?.isGM) throw new Error("Apenas o mestre pode alterar campanhas e restaurar sessoes no servidor.");
  return actor;
}

function handleCampaignSocketEvent(socket, type, payload = {}) {
  const { meta, room } = currentRoom(socket);
  if (type === GAME_EVENT_TYPES.CAMPAIGN_LIST || type === GAME_EVENT_TYPES.SESSION_RESTORE_AVAILABLE) {
    sendCampaignState(socket);
    return;
  }
  const resolvedRoom = room || createOrGetRoom();
  const actor = assertGmForPersistence(resolvedRoom, meta?.playerId);

  if (type === GAME_EVENT_TYPES.CAMPAIGN_CREATE) {
    const campaign = migrateCampaign(payload.campaign || {
      name: payload.name || resolvedRoom.name || DEFAULT_ROOM_NAME,
      ownerName: actor.name,
      sessionState: sessionFromRoom(resolvedRoom),
    });
    campaigns.set(campaign.id, campaign);
    activeCampaignId = campaign.id;
    resolvedRoom.addChatMessage({
      playerId: actor.id,
      authorName: "Sistema Solaris",
      message: `Campanha criada: ${campaign.name}.`,
    });
    sendCampaignState(socket, { campaign: campaignPayload(campaign) });
    broadcastRoom(resolvedRoom.id);
    return;
  }

  if (type === GAME_EVENT_TYPES.CAMPAIGN_UPDATE) {
    const campaign = campaigns.get(payload.campaignId || activeCampaignId);
    if (!campaign) throw new Error("Campanha nao encontrada.");
    const next = migrateCampaign({ ...campaign, ...(payload.patch || {}), id: campaign.id, updatedAt: new Date().toISOString() });
    campaigns.set(next.id, next);
    sendCampaignState(socket, { campaign: campaignPayload(next) });
    return;
  }

  if (type === GAME_EVENT_TYPES.CAMPAIGN_DELETE) {
    const campaign = campaigns.get(payload.campaignId);
    if (!campaign) throw new Error("Campanha nao encontrada.");
    if (String(payload.confirmation || "") !== campaign.name) {
      throw new Error("Confirmacao forte invalida para excluir campanha.");
    }
    campaigns.delete(campaign.id);
    if (activeCampaignId === campaign.id) activeCampaignId = "";
    sendCampaignState(socket);
    return;
  }

  if (type === GAME_EVENT_TYPES.SESSION_SAVE || type === GAME_EVENT_TYPES.SESSION_SNAPSHOT_CREATE) {
    const currentCampaign = createOrUpdateActiveCampaign(resolvedRoom);
    const next = upsertCampaignSession(currentCampaign, payload.sessionState || sessionFromRoom(resolvedRoom), payload.label || "Sessao salva");
    campaigns.set(next.id, next);
    activeCampaignId = next.id;
    const snapshot = createSessionSnapshot({
      room: payload.sessionState || sessionFromRoom(resolvedRoom),
      campaignId: next.id,
      label: payload.label || "Snapshot manual",
    });
    resolvedRoom.addChatMessage({
      playerId: actor.id,
      authorName: "Sistema Solaris",
      message: `Sessao salva em ${next.name}.`,
    });
    send(socket, type, { campaign: campaignPayload(next), snapshot });
    sendCampaignState(socket);
    broadcastRoom(resolvedRoom.id);
    return;
  }

  if (type === GAME_EVENT_TYPES.SESSION_AUTOSAVE) {
    const currentCampaign = createOrUpdateActiveCampaign(resolvedRoom);
    const result = createAutosave(currentCampaign, payload.sessionState || sessionFromRoom(resolvedRoom), {
      label: payload.label || "Autosave",
      maxAutosaves: payload.maxAutosaves || currentCampaign.settings?.maxAutosaves || 10,
    });
    campaigns.set(result.campaign.id, result.campaign);
    activeCampaignId = result.campaign.id;
    send(socket, type, { campaign: campaignPayload(result.campaign), snapshot: result.snapshot });
    sendCampaignState(socket);
    return;
  }

  if (type === GAME_EVENT_TYPES.SESSION_EXPORT) {
    const currentCampaign = createOrUpdateActiveCampaign(resolvedRoom);
    const bundle = createSessionExportBundle({
      campaign: currentCampaign,
      sessionState: payload.sessionState || sessionFromRoom(resolvedRoom),
      appVersion: payload.appVersion || "0.6.0-alpha.3",
      notes: payload.notes || "",
    });
    send(socket, type, { bundle });
    return;
  }

  if (type === GAME_EVENT_TYPES.SESSION_IMPORT) {
    const bundle = parseSessionExportBundle(payload.bundle || payload.session || payload);
    campaigns.set(bundle.campaign.id, bundle.campaign);
    activeCampaignId = bundle.campaign.id;
    const importedRoom = new GameRoom(roomDataFromSession(bundle.sessionState));
    rooms.set(importedRoom.id, importedRoom);
    clients.set(socket, { roomId: importedRoom.id, playerId: actor.id, role: actor.role });
    sendCampaignState(socket, { campaign: campaignPayload(bundle.campaign) });
    broadcastRoom(importedRoom.id);
    return;
  }

  if (type === GAME_EVENT_TYPES.CAMPAIGN_LOAD || type === GAME_EVENT_TYPES.SESSION_LOAD || type === GAME_EVENT_TYPES.SESSION_SNAPSHOT_RESTORE) {
    const campaign = campaigns.get(payload.campaignId || activeCampaignId);
    if (!campaign) throw new Error("Campanha nao encontrada.");
    let state = null;
    if (type === GAME_EVENT_TYPES.SESSION_SNAPSHOT_RESTORE) {
      const snapshot = campaign.autosaves.find((entry) => entry.id === payload.snapshotId);
      state = snapshot?.stateSnapshot || null;
    } else if (payload.sessionState) {
      state = payload.sessionState;
    } else {
      state = campaign.sessions.find((session) => session.roomId === payload.sessionId) || campaign.sessions[0];
    }
    if (!state) throw new Error("Sessao salva nao encontrada.");
    const loadedRoom = new GameRoom(roomDataFromSession(state));
    const actorInLoadedRoom = loadedRoom.getPlayer(actor.id);
    if (!actorInLoadedRoom) loadedRoom.players.push(new PlayerConnection({ ...actor.toJSON(), online: true }));
    loadedRoom.hostPlayerId = loadedRoom.hostPlayerId || actor.id;
    rooms.set(loadedRoom.id, loadedRoom);
    activeCampaignId = campaign.id;
    clients.set(socket, { roomId: loadedRoom.id, playerId: actor.id, role: actor.role });
    loadedRoom.addChatMessage({
      playerId: actor.id,
      authorName: "Sistema Solaris",
      message: `Sessao carregada da campanha ${campaign.name}.`,
    });
    sendCampaignState(socket, { campaign: campaignPayload(campaign) });
    broadcastRoom(loadedRoom.id);
    return;
  }

  throw new Error(`Evento de campanha desconhecido: ${type}`);
}

function handleSocketMessage(socket, raw) {
  let message;
  try {
    message = JSON.parse(raw);
  } catch {
    return sendError(socket, "Mensagem WebSocket invalida.");
  }

  try {
    if (message.type === "room:create") return handleRoomCreate(socket, message.payload);
    if (message.type === "room:join") return handleRoomJoin(socket, message.payload);
    if (message.type === "chat:message") return handleChat(socket, message.payload);
    if (message.type === "dice:roll") return handleDice(socket, message.payload);
    if (message.type === "character:resources:update") return handleCharacterResources(socket, message.payload);
    if (message.type === GAME_EVENT_TYPES.CHARACTER_SYNC_REQUEST) return handleCharacterSyncRequest(socket, message.payload);
    if ([
      GAME_EVENT_TYPES.CAMPAIGN_CREATE,
      GAME_EVENT_TYPES.CAMPAIGN_UPDATE,
      GAME_EVENT_TYPES.CAMPAIGN_DELETE,
      GAME_EVENT_TYPES.CAMPAIGN_LIST,
      GAME_EVENT_TYPES.CAMPAIGN_LOAD,
      GAME_EVENT_TYPES.SESSION_SAVE,
      GAME_EVENT_TYPES.SESSION_LOAD,
      GAME_EVENT_TYPES.SESSION_EXPORT,
      GAME_EVENT_TYPES.SESSION_IMPORT,
      GAME_EVENT_TYPES.SESSION_AUTOSAVE,
      GAME_EVENT_TYPES.SESSION_SNAPSHOT_CREATE,
      GAME_EVENT_TYPES.SESSION_SNAPSHOT_RESTORE,
      GAME_EVENT_TYPES.SESSION_RESTORE_AVAILABLE,
    ].includes(message.type)) return handleCampaignSocketEvent(socket, message.type, message.payload);
    if (ROOM_EVENT_TYPES.has(message.type)) return dispatchRoomEvent(socket, message.type, message.payload);
    return sendError(socket, `Evento desconhecido: ${message.type}`);
  } catch (error) {
    return sendError(socket, error.message || "Erro interno da mesa.");
  }
}

function handleSocketClose(socket) {
  const meta = clients.get(socket);
  clients.delete(socket);
  if (!meta) return;
  const room = rooms.get(meta.roomId);
  if (!room) return;
  try {
    room.dispatch(GAME_EVENT_TYPES.PLAYER_LEAVE, { playerId: meta.playerId }, meta.playerId);
  } catch {}
  broadcastRoom(room.id);
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.resolve(APP_ROOT, `.${pathname}`);
  if (!filePath.startsWith(APP_ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Arquivo nao encontrado.");
      return;
    }
    response.writeHead(200, {
      "content-type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(data);
  });
}

const server = http.createServer(serveStatic);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  clients.set(socket, { roomId: "", playerId: "", role: SESSION_ROLES.PLAYER });
  send(socket, "room:state", {
    room: roomPayload(createOrGetRoom()),
  });
  socket.on("message", (raw) => handleSocketMessage(socket, raw.toString()));
  socket.on("close", () => handleSocketClose(socket));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Solaris Mesa Virtual ativa em http://localhost:${PORT}`);
  console.log(`Jogadores na LAN/Radmin: http://IP-DO-MESTRE:${PORT}`);
});
