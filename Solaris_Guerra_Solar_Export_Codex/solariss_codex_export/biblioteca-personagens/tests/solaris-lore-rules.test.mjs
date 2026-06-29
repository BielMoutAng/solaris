import assert from "node:assert/strict";
import test from "node:test";

import {
  GAME_EVENT_TYPES,
  GameRoom,
  PlayerConnection,
  SESSION_ROLES,
} from "../src/session/solaris-session-domain.js";
import {
  createCampaign,
  migrateSessionState,
  upsertCampaignSession,
} from "../src/session/solaris-session-persistence.js";
import {
  DEFAULT_LORE_ENTRIES,
  DEFAULT_LORE_RELATIONS,
  FACTION_LORE_TYPES,
  HOOK_TYPES,
  LOCATION_TYPES,
  LORE_DISCOVERY_STATES,
  LORE_ENTRY_TYPES,
  LORE_IMPORTANCE_LEVELS,
  LORE_RELATION_TYPES,
  LORE_SCHEMA_VERSION,
  LORE_SECRET_LEVELS,
  createDefaultLoreState,
  createEncounterSeedFromLore,
  createLocationSceneSeed,
  createLoreEntry,
  createLoreLinkedFactionState,
  createLoreNote,
  createLoreRelation,
  createMissionSeedFromLore,
  createNpcSeedFromLore,
  filterLoreEntries,
  getLoreRelatedEntries,
  hydrateLoreState,
  linkLoreEntries,
  markLoreDiscovered,
  markLoreSecret,
  normalizeEntityLoreEntry,
  normalizeFactionLoreEntry,
  normalizeLocationEntry,
  normalizeLoreHook,
  normalizeLoreRelation,
  normalizeNpcLoreEntry,
  normalizeTimelineEvent,
  pinLoreEntry,
  rankLoreSearchResults,
  searchLoreEntries,
  sendLoreToGmNotes,
  sendLoreToSessionReport,
  serializeLoreState,
  sortTimelineEvents,
  unlinkLoreEntries,
  unpinLoreEntry,
  validateLoreEntry,
} from "../src/domain/solaris-lore-rules.js";

function gmRoom() {
  return new GameRoom({
    id: "lore-room",
    name: "Mesa de Tarantus",
    players: [
      new PlayerConnection({ id: "gm", name: "Solaris GM", role: SESSION_ROLES.GM }),
      new PlayerConnection({ id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER }),
    ],
  });
}

test("compendio de lore carrega entradas oficiais do Livro 4", () => {
  const state = createDefaultLoreState();

  assert.equal(state.loreSchemaVersion, LORE_SCHEMA_VERSION);
  assert.ok(DEFAULT_LORE_ENTRIES.length >= 10);
  assert.ok(DEFAULT_LORE_RELATIONS.length >= 6);
  assert.ok(state.entries.some((entry) => entry.title === "Tarantus"));
  assert.ok(state.entries.some((entry) => entry.title === "Ktaluhl Kalar"));
  assert.ok(state.entries.some((entry) => entry.title === "Uryon"));
  assert.ok(state.pinnedLoreEntries.includes("lore-planeta-tarantus"));
  assert.ok(state.secretLoreEntries.includes("lore-entidade-uryon"));
});

test("normalizadores criam locais, faccoes, NPCs, entidades, eventos e ganchos", () => {
  const location = normalizeLocationEntry({
    title: "Ruina de Nytharal",
    locationType: LOCATION_TYPES.RUIN,
    dangers: ["poeira cosmica"],
    resources: ["cristais"],
  });
  const faction = normalizeFactionLoreEntry({
    title: "Patrulheiros da Fenda",
    factionType: FACTION_LORE_TYPES.PATROL,
    objectives: ["vigiar rotas"],
  });
  const npc = normalizeNpcLoreEntry({ title: "Halen Myrr", faction: "Enfermaria Myrr" });
  const entity = normalizeEntityLoreEntry({ title: "Eco de Uryon" });
  const event = normalizeTimelineEvent({ title: "Queda", order: 1 });
  const hook = normalizeLoreHook({ title: "Sinal perdido", type: HOOK_TYPES.MYSTERY });

  assert.equal(location.type, LORE_ENTRY_TYPES.LOCATION);
  assert.equal(location.locationType, LOCATION_TYPES.RUIN);
  assert.equal(faction.type, LORE_ENTRY_TYPES.FACTION);
  assert.equal(faction.factionType, FACTION_LORE_TYPES.PATROL);
  assert.equal(npc.type, LORE_ENTRY_TYPES.NPC);
  assert.equal(entity.type, LORE_ENTRY_TYPES.ENTITY);
  assert.equal(event.type, LORE_ENTRY_TYPES.HISTORICAL_EVENT);
  assert.equal(hook.type, HOOK_TYPES.MYSTERY);
});

test("validacao aponta entrada sem titulo e aceita entrada completa", () => {
  const valid = validateLoreEntry({ title: "Cidade perdida", type: LORE_ENTRY_TYPES.CITY });
  const invalid = validateLoreEntry({ type: "tipo-inexistente" });

  assert.equal(valid.ok, true);
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.some((entry) => /titulo/i.test(entry)));
  assert.ok(invalid.errors.some((entry) => /Tipo de lore/i.test(entry)));
});

test("busca e filtros encontram lore por texto, tag, tipo, local, faccao e segredo", () => {
  const state = createDefaultLoreState();
  const tarantus = searchLoreEntries(state, "Tarantus");
  const factions = filterLoreEntries(state, { type: LORE_ENTRY_TYPES.FACTION });
  const ktaluhl = filterLoreEntries(state, { location: "Ktaluhl Kalar" });
  const secrets = filterLoreEntries(state, { secret: true });
  const critical = filterLoreEntries(state, { importance: LORE_IMPORTANCE_LEVELS.CRITICAL });
  const ranked = rankLoreSearchResults(state.entries, "uryon");

  assert.equal(tarantus[0].title, "Tarantus");
  assert.ok(factions.some((entry) => entry.title.includes("Conselho")));
  assert.ok(ktaluhl.some((entry) => entry.title === "Selia Vardes" || entry.title.includes("Conselho")));
  assert.ok(secrets.some((entry) => entry.title === "Uryon"));
  assert.ok(critical.length >= 3);
  assert.equal(ranked[0].title, "Uryon");
});

test("relacoes de lore podem ser criadas, consultadas e removidas", () => {
  const base = createDefaultLoreState();
  const relation = createLoreRelation({
    fromId: "lore-planeta-tarantus",
    toId: "lore-entidade-uryon",
    type: LORE_RELATION_TYPES.THREATENS,
    bidirectional: true,
  });
  const linked = linkLoreEntries(base, relation);
  const related = getLoreRelatedEntries(linked, "lore-entidade-uryon");
  const unlinked = unlinkLoreEntries(linked, relation.id);
  const normalized = normalizeLoreRelation({ from: "a", to: "b", type: LORE_RELATION_TYPES.LINKED_ITEM });

  assert.ok(related.some((item) => item.entry.id === "lore-planeta-tarantus"));
  assert.ok(!unlinked.relations.some((entry) => entry.id === relation.id));
  assert.equal(normalized.fromId, "a");
  assert.equal(normalized.toId, "b");
});

test("pins, descobertas e segredos atualizam estado serializado", () => {
  const base = createDefaultLoreState();
  const pinned = pinLoreEntry(base, "lore-entidade-uryon");
  const unpinned = unpinLoreEntry(pinned, "lore-entidade-uryon");
  const discovered = markLoreDiscovered(base, "lore-entidade-uryon", LORE_DISCOVERY_STATES.REVEALED);
  const secret = markLoreSecret(base, "lore-planeta-tarantus", LORE_SECRET_LEVELS.SPOILER);

  assert.ok(pinned.pinnedLoreEntries.includes("lore-entidade-uryon"));
  assert.ok(!unpinned.pinnedLoreEntries.includes("lore-entidade-uryon"));
  assert.ok(discovered.discoveredLoreEntries.includes("lore-entidade-uryon"));
  assert.equal(discovered.entries.find((entry) => entry.id === "lore-entidade-uryon").visibleToPlayers, true);
  assert.ok(secret.secretLoreEntries.includes("lore-planeta-tarantus"));
});

test("lore gera notas, relatorio, missao, encontro, NPC, cena e faccao", () => {
  const state = createDefaultLoreState();
  const tarantus = state.entries.find((entry) => entry.id === "lore-planeta-tarantus");
  const ktaluhl = state.entries.find((entry) => entry.id === "lore-cidade-ktaluhl-kalar");
  const selia = state.entries.find((entry) => entry.id === "lore-npc-selia-vardes");
  const conselho = state.entries.find((entry) => entry.id === "lore-faccao-conselho-ktaluhl-kalar");

  const note = createLoreNote(tarantus, { title: "Nota de Tarantus" });
  const withNote = sendLoreToGmNotes(state, tarantus.id);
  const withReport = sendLoreToSessionReport(state, tarantus.id);
  const mission = createMissionSeedFromLore(ktaluhl);
  const encounter = createEncounterSeedFromLore(tarantus);
  const npc = createNpcSeedFromLore(selia);
  const scene = createLocationSceneSeed(ktaluhl);
  const faction = createLoreLinkedFactionState(conselho);

  assert.equal(note.linkedId, tarantus.id);
  assert.equal(withNote.loreNotes[0].linkedId, tarantus.id);
  assert.equal(withReport.reportLoreEntries[0].loreId, tarantus.id);
  assert.equal(mission.sourceLoreId, ktaluhl.id);
  assert.deepEqual(encounter.loreLinks, [tarantus.id]);
  assert.equal(npc.name, "Selia Vardes");
  assert.equal(scene.loreId, ktaluhl.id);
  assert.equal(faction.loreId, conselho.id);
});

test("estado de lore hidrata sem perder dados e ordena linha do tempo", () => {
  const custom = serializeLoreState({
    entries: [
      normalizeTimelineEvent({ id: "event-2", title: "Depois", order: 2 }),
      normalizeTimelineEvent({ id: "event-1", title: "Antes", order: 1 }),
      createLoreEntry({ id: "custom-lore", title: "Boato", type: LORE_ENTRY_TYPES.RUMOR }),
    ],
    pinnedLoreEntries: ["custom-lore"],
  });
  const hydrated = hydrateLoreState(custom);
  const timeline = sortTimelineEvents(hydrated.entries);

  assert.equal(hydrated.entries.length, 3);
  assert.ok(hydrated.pinnedLoreEntries.includes("custom-lore"));
  assert.deepEqual(timeline.map((entry) => entry.id), ["event-1", "event-2"]);
});

test("GameRoom aplica acoes GM de lore e filtra segredos para jogadores", () => {
  const room = gmRoom();

  room.dispatch(GAME_EVENT_TYPES.GM_LORE_PIN, { loreId: "lore-entidade-uryon" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_DISCOVER, {
    loreId: "lore-entidade-uryon",
    discoveryState: LORE_DISCOVERY_STATES.REVEALED,
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_NOTE, { loreId: "lore-planeta-tarantus" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_REPORT, { loreId: "lore-planeta-tarantus" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_MISSION, { loreId: "lore-cidade-ktaluhl-kalar" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_SCENE, { loreId: "lore-cidade-ktaluhl-kalar" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_ENCOUNTER, { loreId: "lore-planeta-tarantus" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_NPC, { loreId: "lore-npc-selia-vardes" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_CLOCK, { loreId: "lore-entidade-uryon", max: 4 }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_FACTION, { loreId: "lore-faccao-conselho-ktaluhl-kalar" }, "gm");

  assert.ok(room.pinnedLoreEntries.includes("lore-entidade-uryon"));
  assert.ok(room.loreNotes.length >= 1);
  assert.ok(room.reportLoreEntries.length >= 1);
  assert.ok(room.missions.some((entry) => entry.sourceLoreId === "lore-cidade-ktaluhl-kalar"));
  assert.ok(room.sceneList.some((entry) => entry.loreId === "lore-cidade-ktaluhl-kalar"));
  assert.ok(room.preparedEncounters.some((entry) => entry.source === "lore"));
  assert.ok(room.gmNotes.some((entry) => entry.linkedType === "lore"));
  assert.ok(room.campaignClocks.some((entry) => entry.loreId === "lore-entidade-uryon"));
  assert.ok(room.factionStates.some((entry) => entry.loreId === "lore-faccao-conselho-ktaluhl-kalar"));

  const gmState = room.gmDashboardStateFor({ isGM: true });
  const playerState = room.gmDashboardStateFor({ isGM: false });

  assert.ok(gmState.loreState.entries.some((entry) => entry.id === "lore-tecnologia-portais-tharan"));
  assert.ok(!playerState.loreState.entries.some((entry) => entry.id === "lore-tecnologia-portais-tharan"));
});

test("GameRoom vincula lore a relacoes, monstros, itens e relatorio de sessao", () => {
  const room = gmRoom();

  room.dispatch(GAME_EVENT_TYPES.GM_LORE_RELATION, {
    fromId: "lore-entidade-uryon",
    toId: "monster-vanguarda-xirax",
    type: LORE_RELATION_TYPES.LINKED_MONSTER,
    secret: true,
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_RELATION, {
    fromId: "lore-tecnologia-portais-tharan",
    toId: "item-cubo",
    type: LORE_RELATION_TYPES.LINKED_ITEM,
    secret: true,
  }, "gm");

  const monsterRelations = getLoreRelatedEntries(room.loreState, "lore-entidade-uryon");
  const report = room.applyGmDashboardEvent(
    GAME_EVENT_TYPES.GM_REPORT_EXPORT,
    {},
    room.getPlayer("gm")
  );

  assert.ok(room.loreRelations.some((entry) => entry.type === LORE_RELATION_TYPES.LINKED_MONSTER));
  assert.equal(monsterRelations.length, 1);
  assert.match(report.report, /Lore e cenario/);
  assert.match(report.report, /Tarantus/);
});

test("persistencia de sessoes e campanhas preserva compendio de lore", () => {
  const room = gmRoom();
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_NOTE, { loreId: "lore-planeta-tarantus" }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_LORE_MISSION, { loreId: "lore-cidade-ktaluhl-kalar" }, "gm");

  const migrated = migrateSessionState(room.toJSON());
  const campaign = createCampaign({ name: "Campanha de Lore", sessionState: migrated });
  const updated = upsertCampaignSession(campaign, migrated, "Teste de lore");

  assert.equal(migrated.loreSchemaVersion, LORE_SCHEMA_VERSION);
  assert.ok(migrated.loreState.entries.some((entry) => entry.id === "lore-planeta-tarantus"));
  assert.ok(migrated.loreNotes.length >= 1);
  assert.ok(campaign.loreState.entries.some((entry) => entry.id === "lore-cidade-ktaluhl-kalar"));
  assert.ok(updated.missionLoreLinks.some((entry) => entry.loreId === "lore-cidade-ktaluhl-kalar"));
});
