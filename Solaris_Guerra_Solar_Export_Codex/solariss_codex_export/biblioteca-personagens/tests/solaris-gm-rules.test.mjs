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
  GM_SCHEMA_VERSION,
  advanceBaseProject,
  advanceCampaignClock,
  advanceHackingChallenge,
  advanceMissionPhase,
  applyEnvironmentHazard,
  applyMissionReward,
  completeMissionObjective,
  computeMissionReward,
  computeMissionRisk,
  computeResourcePressure,
  computeTravelDifficulty,
  createBaseState,
  createCampaignClock,
  createFactionState,
  createHackingChallenge,
  createMissionObjective,
  createResourceTrack,
  createTravelRoute,
  failHackingChallenge,
  failMissionObjective,
  generateComplicationSeed,
  generateMissionSeed,
  generateRewardSeed,
  generateTravelEventSeed,
  hydrateGmState,
  resolveBaseEvent,
  resolveCampaignClock,
  resolveMissionComplication,
  resolveTravelEvent,
  restoreResource,
  serializeGmState,
  updateBaseResource,
  updateFactionReputation,
  consumeResource,
  normalizeMissionEntry,
} from "../src/domain/solaris-gm-rules.js";

function gmRoom() {
  const room = new GameRoom({
    id: "gm-room",
    players: [
      new PlayerConnection({ id: "gm", name: "Solaris GM", role: SESSION_ROLES.GM }),
      new PlayerConnection({ id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER }),
    ],
  });
  return room;
}

test("normaliza missao, recompensa e risco de missao do mestre", () => {
  const mission = normalizeMissionEntry({
    id: "mission-1",
    name: "Resgate em Tarantus",
    objective: "Salvar colonos",
    riskLevel: "alta ameaca",
    objectives: [createMissionObjective({ id: "main", title: "Salvar colonos", type: "principal" })],
  });
  const reward = computeMissionReward({ riskLevel: mission.riskLevel, level: 3, secondaryCompleted: 1 });
  const risk = computeMissionRisk({ ...mission, complications: [generateComplicationSeed({ roll: 2 })] });

  assert.equal(mission.name, "Resgate em Tarantus");
  assert.equal(mission.riskLevel, "alta-ameaca");
  assert.ok(reward.amount > 0);
  assert.ok(risk.score >= 1);
});

test("missao avanca fase, conclui objetivo e registra complicacao", () => {
  const mission = normalizeMissionEntry({
    id: "mission-2",
    name: "Investigar sinal",
    objectives: [{ id: "obj-1", title: "Ler assinatura", type: "principal" }],
  });
  const advanced = advanceMissionPhase(mission);
  const resolved = resolveMissionComplication(advanced, { roll: 4 });
  const completed = completeMissionObjective(resolved.mission, "obj-1");

  assert.equal(advanced.phase, "preparacao");
  assert.equal(resolved.complication.roll, 4);
  assert.equal(completed.status, "completed");
  assert.equal(completed.phase, "concluida");
});

test("missao falha quando objetivo principal falha", () => {
  const mission = normalizeMissionEntry({
    id: "mission-fail",
    objectives: [{ id: "obj-main", title: "Proteger reator", type: "principal" }],
  });
  const failed = failMissionObjective(mission, "obj-main");

  assert.equal(failed.status, "failed");
  assert.equal(failed.phase, "fracassada");
});

test("rotas calculam dificuldade e resolvem eventos de viagem", () => {
  const route = createTravelRoute({
    id: "route-1",
    name: "Travessia da zona termica",
    origin: "Colonia",
    destination: "Reator",
    terrain: "perigoso",
    pace: "forcado",
    hazards: [{ type: "calor-extremo", intensity: 3 }],
  });
  const difficulty = computeTravelDifficulty(route);
  const resolved = resolveTravelEvent(route, { roll: 6 });

  assert.ok(difficulty.difficulty >= 7);
  assert.equal(resolved.event.roll, 6);
  assert.equal(resolved.route.events.length, 1);
});

test("perigo ambiental gera teste e consequencias", () => {
  const result = applyEnvironmentHazard(
    { id: "char-1", protections: [] },
    { type: "nevoa-fumaca-poeira", intensity: 4 }
  );

  assert.equal(result.hasProtection, false);
  assert.ok(result.dc >= 5);
  assert.ok(result.consequences.length >= 1);
});

test("recursos consomem, recuperam e calculam pressao sem recursao", () => {
  const resource = createResourceTrack({ id: "water", name: "Agua", max: 10, current: 10 });
  const consumed = consumeResource(resource, 8);
  const restored = restoreResource(consumed, 2);
  const pressure = computeResourcePressure([consumed, restored]);

  assert.equal(consumed.current, 2);
  assert.equal(restored.current, 4);
  assert.equal(pressure.criticalResources.includes("Agua"), true);
});

test("faccao altera reputacao e relacao", () => {
  const faction = createFactionState({ id: "f1", name: "Conclave", reputation: 0 });
  const next = updateFactionReputation(faction, 2, "Ajudou a colonia");

  assert.equal(next.reputation, 2);
  assert.equal(next.relation, "aliado");
  assert.equal(next.history.length, 1);
});

test("contadores de campanha avancam e resolvem", () => {
  const clock = createCampaignClock({ id: "clock-1", name: "Alerta", current: 3, max: 6, direction: "down" });
  const advanced = advanceCampaignClock(clock, 2);
  const resolved = resolveCampaignClock(advanced, { resolution: "Reforcos chegaram." });

  assert.equal(advanced.current, 1);
  assert.equal(resolved.status, "resolved");
});

test("desafio de hacking progride e pode falhar", () => {
  const challenge = createHackingChallenge({ id: "hack-1", name: "Terminal", nodes: 2, detectionMax: 3 });
  const advanced = advanceHackingChallenge(challenge, { success: true });
  const failed = failHackingChallenge(advanced, "ICE ativou defesa.");

  assert.equal(advanced.progress, 1);
  assert.equal(failed.status, "locked");
});

test("base controla recursos, projetos e eventos", () => {
  const base = createBaseState({
    id: "base-1",
    name: "Colonia Solaris-7",
    attributes: { comida: 2 },
    projects: [{ id: "proj-1", name: "Muralha", progress: 0, max: 2 }],
  });
  const supplied = updateBaseResource(base, "comida", 2, "Carga entregue");
  const projected = advanceBaseProject(supplied, "proj-1", 2);
  const event = resolveBaseEvent(projected, { roll: 3 });

  assert.equal(supplied.attributes.comida, 4);
  assert.equal(projected.projects[0].status, "completed");
  assert.equal(event.event.roll, 3);
});

test("seeds geram missao, viagem, complicacao e recompensa", () => {
  assert.ok(generateMissionSeed({ objectiveRoll: 0, locationRoll: 1 }).name);
  assert.ok(generateTravelEventSeed({ roll: 1 }).message);
  assert.equal(generateComplicationSeed({ roll: 1 }).roll, 1);
  assert.ok(generateRewardSeed({ riskLevel: "perigosa", level: 2 }).amount > 0);
});

test("estado GM serializa e hidrata mantendo schema", () => {
  const state = hydrateGmState({
    missions: [generateMissionSeed({ objectiveRoll: 1 })],
    resourceTracks: [createResourceTrack({ name: "Suprimentos", current: 3, max: 6 })],
  });
  const serialized = serializeGmState(state);

  assert.equal(serialized.gmSchemaVersion, GM_SCHEMA_VERSION);
  assert.equal(serialized.missions.length, 1);
  assert.equal(hydrateGmState(serialized).resourceTracks[0].max, 6);
});

test("GameRoom cria e persiste missao, recurso, faccao, rota, clock, hacking e base", () => {
  const room = gmRoom();

  room.dispatch(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: { id: "m1", name: "Salvar colonia", objective: "Evacuar civis" } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_RESOURCE_CREATE, { resource: { id: "r1", name: "Agua", max: 5, current: 5 } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_RESOURCE_CONSUME, { resourceId: "r1", amount: 2 }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_FACTION_CREATE, { faction: { id: "f1", name: "Conclave" } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_FACTION_REPUTATION, { factionId: "f1", delta: 1 }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_CREATE, { route: { id: "t1", name: "Rota oeste" } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_CLOCK_CREATE, { clock: { id: "c1", name: "Alarme", current: 2, max: 4 } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_HACKING_CREATE, { challenge: { id: "h1", name: "Terminal" } }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_BASE_CREATE, { base: { id: "b1", name: "Posto Solaris" } }, "gm");

  const json = room.toJSON();
  assert.equal(json.missions[0].name, "Salvar colonia");
  assert.equal(json.resourceTracks[0].current, 3);
  assert.equal(json.factionStates[0].reputation, 1);
  assert.equal(json.travelRoutes.length, 1);
  assert.equal(json.campaignClocks.length, 1);
  assert.equal(json.hackingChallenges.length, 1);
  assert.equal(json.bases.length, 1);
});

test("jogador nao executa evento privado do mestre", () => {
  const room = gmRoom();
  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: { name: "Secreta" } }, "p1"),
    /Permissao insuficiente/
  );
});

test("estado GM entra em migracao de sessao e campanha", () => {
  const room = gmRoom();
  room.dispatch(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: { id: "m1", name: "Busca por Helion" } }, "gm");
  const state = migrateSessionState(room.toJSON());
  const campaign = createCampaign({ name: "Campanha GM", sessionState: state });
  const updated = upsertCampaignSession(campaign, state, "Teste Fase 25");

  assert.equal(state.missions[0].name, "Busca por Helion");
  assert.equal(campaign.missions[0].id, "m1");
  assert.equal(updated.sessions[0].missions[0].id, "m1");
});

test("relatorio da sessao inclui campanha do mestre", () => {
  const room = gmRoom();
  room.dispatch(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: { id: "m1", name: "Operacao Tarantus" } }, "gm");
  const result = room.applyGmDashboardEvent(GAME_EVENT_TYPES.GM_REPORT_EXPORT, { options: { includeGmCampaign: true } }, room.getPlayer("gm"));

  assert.match(result.report, /Campanha do Mestre/);
  assert.match(result.report, /Operacao Tarantus/);
});

test("aplicar recompensa retorna transacao narrativa", () => {
  const result = applyMissionReward({}, { id: "rw1", name: "Pagamento", type: "luzentis", amount: 120 }, { id: "char-1", name: "Lyssara" });

  assert.equal(result.reward.status, "applied");
  assert.deepEqual(result.transaction, { currency: "luzentis", amount: 120 });
});
