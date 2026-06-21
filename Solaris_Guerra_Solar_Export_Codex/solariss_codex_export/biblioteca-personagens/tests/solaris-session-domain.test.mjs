import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVAL_STATUSES,
  GAME_EVENT_TYPES,
  GameRoom,
  MapToken,
  PlayerConnection,
  SESSION_ROLES,
  Scene,
  SessionCharacter,
  estimateEncounterBalance,
} from "../src/session/solaris-session-domain.js";
import {
  createAutosave,
  createCampaign,
  createSessionExportBundle,
  createSessionSnapshot,
  getCurrentSessionSchemaVersion,
  getRecentRecovery,
  migrateCampaign,
  migrateSessionState,
  parseCampaignList,
  parseSessionExportBundle,
  restoreAutosave,
  serializeCampaignList,
  upsertCampaignSession,
  validateCampaign,
  validateSessionState,
} from "../src/session/solaris-session-persistence.js";

test("sala aceita mestre, jogador, chat e rolagem compartilhada", () => {
  const room = new GameRoom({ id: "sala-1", name: "Colonia Solaris-7" });
  const gm = new PlayerConnection({ id: "gm", name: "Solaris GM", role: SESSION_ROLES.GM });
  const player = new PlayerConnection({ id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER });

  room.dispatch(GAME_EVENT_TYPES.PLAYER_JOIN, gm.toJSON());
  room.dispatch(GAME_EVENT_TYPES.PLAYER_JOIN, player.toJSON());
  room.dispatch(GAME_EVENT_TYPES.CHAT_MESSAGE, { message: "Estou na mesa." }, "p1");
  room.dispatch(GAME_EVENT_TYPES.DICE_ROLL, {
    label: "Teste de Reflexo",
    formula: "3d6-2",
    rolls: [6, 4, 3],
    total: 11,
  }, "p1");

  assert.equal(room.players.length, 2);
  assert.equal(room.chat.length, 2);
  assert.equal(room.chat[1].message, "Teste de Reflexo: 3d6-2 = 11");
  assert.equal(room.diceLog[0].total, 11);
  assert.equal(room.events.length, 4);
});

test("jogador altera apenas a propria ficha e mestre altera qualquer ficha", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 38, maxPV: 38 },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_DAMAGE, { characterId: "char-1", amount: 6 }, "p1");
  assert.equal(room.getCharacter("char-1").snapshot.currentPV, 32);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.CHARACTER_HEAL, { characterId: "char-1", amount: 2 }, "p2"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_HEAL, { characterId: "char-1", amount: 3 }, "gm");
  assert.equal(room.getCharacter("char-1").snapshot.currentPV, 35);
});

test("mestre controla combate, iniciativa e monstros da sessao", () => {
  const room = new GameRoom({
    players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }],
  });

  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, {
    id: "monster-1",
    name: "Vanguarda Xirax",
    snapshot: { currentPV: 58, maxPV: 58, ca: 15 },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.COMBAT_START, {
    entries: [
      { id: "i1", entityId: "char-1", entityType: "character", name: "Lyssara", initiative: 22 },
      { id: "i2", entityId: "monster-1", entityType: "monster", name: "Vanguarda Xirax", initiative: 14 },
    ],
  }, "gm");

  assert.equal(room.monsters[0].name, "Vanguarda Xirax");
  assert.equal(room.combat.active, true);
  assert.equal(room.combat.currentEntry.name, "Lyssara");

  room.dispatch(GAME_EVENT_TYPES.TURN_NEXT, {}, "gm");
  assert.equal(room.combat.currentEntry.name, "Vanguarda Xirax");
});

test("combate compartilhado sincroniza iniciativa, dano, cura e condicoes", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 38, maxPV: 38, ca: 16, movement: 9 },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, {
    id: "monster-1",
    name: "Vanguarda Xirax",
    snapshot: { currentPV: 58, maxPV: 58, ca: 15, movement: 9 },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.COMBAT_START, {}, "gm");
  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, {
    id: "monster-2",
    name: "Drone Xirax",
    snapshot: { currentPV: 18, maxPV: 18, ca: 12 },
  }, "gm");
  assert.ok(room.combat.entries.some((entry) => entry.entityId === "monster-2"));

  room.dispatch(GAME_EVENT_TYPES.INITIATIVE_ROLL, {
    entityId: "char-1",
    rolls: [16],
    bonus: 2,
  }, "p1");
  assert.equal(room.combat.entries[0].name, "Lyssara");
  assert.equal(room.combat.entries[0].initiative, 18);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.INITIATIVE_ROLL, { entityId: "char-1", rolls: [20] }, "p2"),
    /Permissao insuficiente/
  );
  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.MONSTER_DAMAGE, { monsterId: "monster-1", amount: 5 }, "p1"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.MONSTER_DAMAGE, { monsterId: "monster-1", amount: 13 }, "gm");
  assert.equal(room.getMonster("monster-1").snapshot.currentPV, 45);
  assert.equal(room.combat.getCombatant("monster-1").currentPV, 45);

  room.dispatch(GAME_EVENT_TYPES.MONSTER_HEAL, { monsterId: "monster-1", amount: 3 }, "gm");
  assert.equal(room.getMonster("monster-1").snapshot.currentPV, 48);

  room.dispatch(GAME_EVENT_TYPES.MONSTER_CONDITION_ADD, {
    monsterId: "monster-1",
    condition: { id: "cond-1", label: "Marcado" },
  }, "gm");
  assert.equal(room.combat.getCombatant("monster-1").conditions[0].label, "Marcado");

  room.dispatch(GAME_EVENT_TYPES.TURN_NEXT, {}, "gm");
  assert.equal(room.combat.round, 1);
  assert.ok(room.combat.log.length >= 4);
});

test("tokens da cena podem ser movidos pelo dono ou pelo mestre", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      { id: "char-1", ownerPlayerId: "p1", name: "Lyssara", snapshot: { currentPV: 38 } },
    ],
    scene: {
      id: "scene-1",
      name: "Corredor de Manutencao",
      tokens: [
        new MapToken({ id: "token-1", entityType: "character", entityId: "char-1", name: "Lyssara", x: 1, y: 1 }),
      ],
    },
  });

  room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: "token-1", x: 3, y: 4 }, "p1");
  assert.equal(room.scene.tokens[0].x, 3);
  assert.equal(room.scene.tokens[0].y, 4);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: "token-1", x: 5, y: 6 }, "p2"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: "token-1", x: 7, y: 8 }, "gm");
  assert.equal(room.scene.tokens[0].x, 7);
});

test("mapa tatico sincroniza tokens, zonas, objetivos e permissoes", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 38, maxPV: 38, portrait: "portrait.png" },
      }),
    ],
    scene: { id: "scene-1", name: "Hangar Solar", columns: 10, rows: 6 },
  });

  const characterToken = room.scene.findTokenForEntity("character", "char-1");
  assert.ok(characterToken);
  assert.equal(characterToken.image, "portrait.png");

  room.dispatch(GAME_EVENT_TYPES.SCENE_UPDATE, {
    patch: {
      zones: [{ id: "risk-1", label: "Plasma instavel", type: "danger", x: 8, y: 2, width: 2, height: 3 }],
      objectives: [{ id: "obj-1", label: "Console", progress: "0/1", x: 5, y: 2 }],
    },
  }, "gm");
  assert.equal(room.scene.zones[0].label, "Plasma instavel");
  assert.equal(room.scene.objectives[0].label, "Console");

  room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: characterToken.id, x: 99, y: 99 }, "p1");
  assert.equal(characterToken.x, 10);
  assert.equal(characterToken.y, 6);
  assert.ok(room.chat.at(-1).message.includes("Lyssara"));

  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, {
    id: "monster-1",
    name: "Vanguarda Xirax",
    snapshot: { currentPV: 58, maxPV: 58, image: "xirax.png" },
  }, "gm");
  const monsterToken = room.scene.findTokenForEntity("monster", "monster-1");
  assert.ok(monsterToken);
  assert.equal(monsterToken.image, "xirax.png");

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: monsterToken.id, x: 4, y: 4 }, "p1"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: monsterToken.id, x: 4, y: 4 }, "gm");
  assert.equal(monsterToken.x, 4);
  assert.equal(monsterToken.y, 4);

  room.dispatch(GAME_EVENT_TYPES.MONSTER_DELETE, { monsterId: "monster-1" }, "gm");
  assert.equal(room.scene.findTokenForEntity("monster", "monster-1"), null);
});

test("fase 5 do mapa aceita imagem, grid, medicao, areas, objetivos e visibilidade", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 20, maxPV: 20, movement: 3 },
      }),
    ],
    scene: {
      columns: 8,
      rows: 8,
      tokens: [
        new MapToken({ id: "token-1", entityType: "character", entityId: "char-1", name: "Lyssara", x: 1, y: 1, metadata: { movement: 3 } }),
      ],
    },
  });

  room.dispatch(GAME_EVENT_TYPES.SCENE_MAP_UPDATE, { mapImage: "data:image/png;base64,abc" }, "gm");
  assert.equal(room.scene.mapImage, "data:image/png;base64,abc");

  room.dispatch(GAME_EVENT_TYPES.SCENE_GRID_UPDATE, {
    columns: 12,
    rows: 10,
    metersPerCell: 1.5,
    gridVisible: false,
    gridOpacity: 0.2,
  }, "gm");
  assert.equal(room.scene.columns, 12);
  assert.equal(room.scene.gridVisible, false);
  assert.equal(room.scene.gridOpacity, 0.2);

  room.dispatch(GAME_EVENT_TYPES.SCENE_MEASUREMENT_CREATE, {
    from: { x: 1, y: 1 },
    to: { x: 4, y: 5 },
  }, "p1");
  assert.equal(room.scene.measurements[0].cells, 5);
  assert.equal(room.scene.measurements[0].meters, 7.5);

  room.dispatch(GAME_EVENT_TYPES.SCENE_AREA_CREATE, {
    id: "area-1",
    type: "circle",
    label: "Pulso cosmico",
    x: 4,
    y: 4,
    radius: 2,
  }, "gm");
  assert.equal(room.scene.areas[0].label, "Pulso cosmico");

  room.dispatch(GAME_EVENT_TYPES.SCENE_AREA_UPDATE, {
    id: "area-1",
    label: "Pulso ampliado",
    x: 4,
    y: 4,
    radius: 3,
  }, "gm");
  assert.equal(room.scene.areas[0].radius, 3);

  room.dispatch(GAME_EVENT_TYPES.SCENE_OBJECTIVE_CREATE, {
    id: "obj-1",
    title: "Reativar console",
    progressCurrent: 0,
    progressMax: 3,
    x: 3,
    y: 3,
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.SCENE_OBJECTIVE_UPDATE, {
    id: "obj-1",
    title: "Reativar console",
    progressCurrent: 2,
    progressMax: 3,
    x: 3,
    y: 3,
  }, "gm");
  assert.equal(room.scene.objectives[0].progressCurrent, 2);

  room.dispatch(GAME_EVENT_TYPES.SCENE_VISIBILITY_UPDATE, {
    targetType: "token",
    id: "token-1",
    hidden: true,
  }, "gm");
  assert.equal(room.sceneForPlayer("gm").tokens.length, 1);
  assert.equal(room.sceneForPlayer("p1").tokens.length, 0);

  room.dispatch(GAME_EVENT_TYPES.SCENE_VISIBILITY_UPDATE, {
    targetType: "token",
    id: "token-1",
    hidden: false,
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.TOKEN_MOVE, { tokenId: "token-1", x: 5, y: 1 }, "p1");
  assert.equal(room.scene.tokens[0].metadata.lastMove.exceedsMovement, true);
  assert.ok(room.combat.log[0].message.includes("Movimento excede"));

  room.dispatch(GAME_EVENT_TYPES.SCENE_AREA_DELETE, { areaId: "area-1" }, "gm");
  assert.equal(room.scene.areas.length, 0);
});

test("fase 6 do mapa resolve alvos em area e registra fonte do dano", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 20, maxPV: 20, ca: 14 },
      }),
    ],
    monsters: [{
      id: "monster-1",
      name: "Vanguarda Xirax",
      snapshot: { currentPV: 40, maxPV: 40, ca: 15 },
    }],
    scene: {
      columns: 10,
      rows: 10,
      tokens: [
        new MapToken({ id: "token-char", entityType: "character", entityId: "char-1", name: "Lyssara", x: 3, y: 3 }),
        new MapToken({ id: "token-monster", entityType: "monster", entityId: "monster-1", name: "Vanguarda Xirax", x: 8, y: 8 }),
      ],
      areas: [
        { id: "area-pulse", type: "circle", label: "Pulso cosmico", x: 3, y: 3, radius: 2 },
        { id: "area-cone", type: "cone", label: "Cone de plasma", x: 2, y: 2, length: 4, width: 4 },
        { id: "area-line-north", type: "line", label: "Raio ascendente", x: 5, y: 5, length: 3, width: 1, direction: "north" },
        { id: "area-cone-west", type: "cone", label: "Cone oeste", x: 5, y: 5, length: 3, width: 4, direction: "west" },
      ],
    },
  });

  const circleTargets = room.scene.tokensInsideArea("area-pulse").map((token) => token.id);
  assert.deepEqual(circleTargets, ["token-char"]);
  assert.equal(room.scene.areaContainsPoint("area-cone", { x: 4, y: 3 }), true);
  assert.equal(room.scene.areaContainsPoint("area-cone", { x: 1, y: 2 }), false);
  assert.equal(room.scene.areaContainsPoint("area-line-north", { x: 5, y: 3 }), true);
  assert.equal(room.scene.areaContainsPoint("area-line-north", { x: 6, y: 3 }), false);
  assert.equal(room.scene.areaContainsPoint("area-cone-west", { x: 3, y: 5 }), true);
  assert.equal(room.scene.areaContainsPoint("area-cone-west", { x: 7, y: 5 }), false);

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_DAMAGE, {
    characterId: "char-1",
    amount: 6,
    sourceLabel: "Pulso cosmico",
  }, "gm");
  assert.equal(room.getCharacter("char-1").snapshot.currentPV, 14);
  assert.match(room.combat.log[0].message, /Pulso cosmico/);

  room.dispatch(GAME_EVENT_TYPES.MONSTER_DAMAGE, {
    monsterId: "monster-1",
    amount: 9,
    sourceLabel: "Rifle de teste",
  }, "gm");
  assert.equal(room.getMonster("monster-1").snapshot.currentPV, 31);
  assert.match(room.combat.log[0].message, /Rifle de teste/);

  const standaloneScene = new Scene(room.scene.toJSON());
  assert.equal(standaloneScene.tokensInsideArea("area-pulse").length, 1);
});

test("fase 7 calcula previa de area direcionada antes do dano", () => {
  const scene = new Scene({
    columns: 10,
    rows: 10,
    tokens: [
      new MapToken({ id: "east-hit", entityType: "monster", entityId: "m1", name: "Alvo leste", x: 6, y: 5 }),
      new MapToken({ id: "north-hit", entityType: "monster", entityId: "m2", name: "Alvo norte", x: 3, y: 2 }),
      new MapToken({ id: "miss", entityType: "monster", entityId: "m3", name: "Fora", x: 9, y: 9 }),
    ],
    areas: [
      { id: "line-east", type: "line", x: 4, y: 5, length: 3, width: 1, direction: "east" },
      { id: "cone-north", type: "cone", x: 3, y: 5, length: 4, width: 4, direction: "north" },
    ],
  });

  assert.deepEqual(scene.tokensInsideArea("line-east").map((token) => token.id), ["east-hit"]);
  assert.deepEqual(scene.tokensInsideArea("cone-north").map((token) => token.id), ["north-hit"]);
  assert.equal(scene.areaContainsPoint("line-east", { x: 3, y: 5 }), false);
  assert.equal(scene.areaContainsPoint("cone-north", { x: 3, y: 7 }), false);
});

test("ficha completa sincroniza dados ricos, respeita permissoes e ignora revision antiga", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 10, maxPV: 10, currency: 1000, inventory: [] },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_SYNC_FULL, {
    characterId: "char-1",
    revision: 1,
    snapshot: {
      id: "char-1",
      characterId: "char-1",
      name: "Lyssara Kalar",
      race: "Humanis",
      profession: "Guerreira Solar",
      level: 3,
      xp: 1200,
      attributes: { FOR: 12, REF: 14, CON: 11, MEN: 10, PRE: 9, INT: 13 },
      modifiers: { FOR: 1, REF: 2, CON: 0, MEN: 0, PRE: -1, INT: 1 },
      derived: { ca: 16, movement: 6, initiative: 2 },
      skills: { briga: { expert: true }, atletismo: { ignorant: true } },
      protections: { jpf: 1, jpv: -1, jpr: 2 },
      currentPV: 28,
      maxPV: 38,
      cosmosCurrent: 8,
      cosmosMax: 12,
      stress: 2,
      stressMax: 7,
      ca: 16,
      movement: 6,
      inventory: [
        { uid: "item-1", id: "item-1", itemId: "kit", name: "Kit de Cura", location: { kind: "unassigned" }, consumable: true, charges: 1 },
        { uid: "weapon-1", id: "weapon-1", itemId: "rifle", name: "Rifle de Pulso", category: "weapon", location: { kind: "unassigned" } },
      ],
      unassignedItems: [{ uid: "item-1", name: "Kit de Cura" }],
      cubes: [{ uid: "cube-1", name: "Cubo Simples" }],
      cosmicSpells: [{ id: "spell-1", name: "Pulso Estelar" }],
      modifierChips: [{ id: "chip-1", name: "Reflexo Basico", installed: false }],
      professionChip: { id: "prof-1", name: "Guerreiro Solar" },
      abilities: [{ id: "race-1", name: "Versatilidade Humanis", source: "Raca" }],
      conditions: [{ id: "cond-1", label: "Foco" }],
      playerNotes: "Notas visiveis",
      metadata: { migration: "test" },
      currency: 1000,
      luzentis: 1000,
    },
  }, "p1");

  const character = room.getCharacter("char-1");
  assert.equal(character.name, "Lyssara Kalar");
  assert.equal(character.snapshot.attributes.REF, 14);
  assert.equal(character.snapshot.inventory.length, 2);
  assert.equal(character.snapshot.unassignedItems.length, 1);
  assert.equal(character.snapshot.cosmicSpells[0].name, "Pulso Estelar");
  assert.equal(character.snapshot.modifierChips[0].installed, false);
  assert.equal(character.snapshot.conditions[0].label, "Foco");
  assert.equal(character.snapshot.metadata.foundryReady, true);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.CHARACTER_ATTRIBUTES_UPDATE, {
      characterId: "char-1",
      attributes: { FOR: 20 },
    }, "p2"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_ITEM_MOVE, {
    characterId: "char-1",
    itemId: "item-1",
    location: { kind: "hook" },
  }, "p1");
  assert.equal(character.snapshot.inventory.find((item) => item.uid === "item-1").location.kind, "hook");

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP, {
    characterId: "char-1",
    itemId: "weapon-1",
    item: { uid: "weapon-1", id: "weapon-1", name: "Rifle de Pulso", category: "weapon" },
    slot: "mainWeapon",
  }, "p1");
  assert.equal(character.snapshot.equipment.mainWeapon.name, "Rifle de Pulso");

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_SPELL_ADD, {
    characterId: "char-1",
    spell: { id: "spell-2", name: "Passo Sombrio" },
  }, "gm");
  assert.ok(character.snapshot.cosmicSpells.some((spell) => spell.id === "spell-2"));

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL, {
    characterId: "char-1",
    chip: { id: "chip-2", name: "Mira de Precisao" },
  }, "gm");
  assert.ok(character.snapshot.modifierChips.some((chip) => chip.id === "chip-2" && chip.installed));

  room.dispatch(GAME_EVENT_TYPES.CHARACTER_CONDITION_UPDATE, {
    characterId: "char-1",
    conditionId: "cond-1",
    patch: { label: "Foco Aprimorado" },
  }, "p1");
  assert.equal(character.snapshot.conditions[0].label, "Foco Aprimorado");

  const revisionAfterUpdates = character.revision;
  room.dispatch(GAME_EVENT_TYPES.CHARACTER_ATTRIBUTES_UPDATE, {
    characterId: "char-1",
    revision: revisionAfterUpdates - 1,
    attributes: { FOR: 99 },
  }, "gm");
  assert.equal(character.snapshot.attributes.FOR, 12);

  room.dispatch(GAME_EVENT_TYPES.DICE_ROLL, {
    label: "Rolagem com item sem local apenas avisando",
    formula: "3d6",
    rolls: [1, 2, 3],
    total: 6,
  }, "p1");
  assert.equal(room.diceLog.at(-1).total, 6);
});

test("aprovacao do mestre compra, vende, exclui e rejeita sem quebrar dinheiro", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: {
          currency: 1000,
          luzentis: 1000,
          inventory: [
            { uid: "sell-1", id: "sell-1", name: "Granada de Luz", price: 80, location: { kind: "unassigned" } },
            { uid: "delete-1", id: "delete-1", name: "Sucata", price: 20, location: { kind: "unassigned" } },
          ],
        },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.APPROVAL_REQUEST, {
    characterId: "char-1",
    type: "purchase-item",
    payload: {
      characterId: "char-1",
      item: { uid: "cube-1", id: "cube-1", name: "Cubo de Expansao", price: 250, location: { kind: "unassigned" } },
      price: 250,
    },
  }, "p1");
  const purchase = room.approvals[0];
  assert.equal(purchase.status, APPROVAL_STATUSES.PENDING);

  room.dispatch(GAME_EVENT_TYPES.APPROVAL_APPROVE, { approvalId: purchase.id }, "gm");
  const character = room.getCharacter("char-1");
  assert.equal(purchase.status, APPROVAL_STATUSES.APPROVED);
  assert.equal(character.snapshot.currency, 750);
  assert.ok(character.snapshot.inventory.some((item) => item.uid === "cube-1"));

  room.dispatch(GAME_EVENT_TYPES.APPROVAL_REQUEST, {
    characterId: "char-1",
    type: "sell-item",
    payload: { characterId: "char-1", itemId: "sell-1", saleValue: 120 },
  }, "p1");
  const sale = room.approvals[0];
  room.dispatch(GAME_EVENT_TYPES.APPROVAL_APPROVE, { approvalId: sale.id }, "gm");
  assert.equal(character.snapshot.currency, 870);
  assert.equal(character.snapshot.inventory.some((item) => item.uid === "sell-1"), false);

  room.dispatch(GAME_EVENT_TYPES.APPROVAL_REQUEST, {
    characterId: "char-1",
    type: "delete-item",
    payload: { characterId: "char-1", itemId: "delete-1" },
  }, "p1");
  const deletion = room.approvals[0];
  room.dispatch(GAME_EVENT_TYPES.APPROVAL_APPROVE, { approvalId: deletion.id }, "gm");
  assert.equal(character.snapshot.currency, 870);
  assert.equal(character.snapshot.inventory.some((item) => item.uid === "delete-1"), false);

  room.dispatch(GAME_EVENT_TYPES.APPROVAL_REQUEST, {
    characterId: "char-1",
    type: "purchase-item",
    payload: {
      characterId: "char-1",
      item: { uid: "rejected-1", id: "rejected-1", name: "Item Rejeitado", price: 50 },
      price: 50,
    },
  }, "p1");
  const rejected = room.approvals[0];
  room.dispatch(GAME_EVENT_TYPES.APPROVAL_REJECT, { approvalId: rejected.id }, "gm");
  assert.equal(rejected.status, APPROVAL_STATUSES.REJECTED);
  assert.equal(character.snapshot.currency, 870);
  assert.equal(character.snapshot.inventory.some((item) => item.uid === "rejected-1"), false);
});

test("loja da sessao cria pedido, mestre aprova e registra transacao", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
      { id: "p2", name: "Drax", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currency: 500, luzentis: 500, inventory: [] },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.SHOP_CART_UPDATE, {
    characterId: "char-1",
    items: [{ item: { id: "vela", name: "Vela", price: 5 }, quantity: 2, price: 5 }],
  }, "p1");
  assert.equal(room.shopState.carts.p1.items[0].quantity, 2);

  room.dispatch(GAME_EVENT_TYPES.SHOP_PURCHASE_REQUEST, {
    characterId: "char-1",
    items: [{ item: { id: "vela", name: "Vela", price: 5 }, quantity: 2, price: 5 }],
    destination: { kind: "backpack" },
  }, "p1");
  const purchase = room.approvals[0];
  assert.equal(purchase.type, "purchase-cart");
  assert.equal(purchase.status, APPROVAL_STATUSES.PENDING);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.SHOP_PURCHASE_APPROVE, { approvalId: purchase.id }, "p1"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.SHOP_PURCHASE_APPROVE, { approvalId: purchase.id }, "gm");
  const character = room.getCharacter("char-1");
  assert.equal(character.snapshot.currency, 490);
  assert.equal(character.snapshot.inventory.length, 2);
  assert.equal(character.snapshot.inventory[0].location.kind, "backpack");
  assert.equal(room.transactionLog[0].type, "purchase");
});

test("loja da sessao vende, exclui e mantem item sem local apenas como estado visual", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: {
          currency: 100,
          luzentis: 100,
          inventory: [
            { uid: "kit-1", id: "kit-1", name: "Kit de Cura", price: 40, location: { kind: "unassigned" } },
            { uid: "sucata-1", id: "sucata-1", name: "Sucata", price: 5, location: { kind: "unassigned" } },
          ],
        },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.SHOP_SELL_REQUEST, {
    characterId: "char-1",
    itemId: "kit-1",
    saleValue: 20,
  }, "p1");
  const sale = room.approvals[0];
  room.dispatch(GAME_EVENT_TYPES.SHOP_SELL_APPROVE, { approvalId: sale.id }, "gm");
  assert.equal(room.getCharacter("char-1").snapshot.currency, 120);
  assert.equal(room.getCharacter("char-1").snapshot.inventory.some((item) => item.uid === "kit-1"), false);

  room.dispatch(GAME_EVENT_TYPES.SHOP_DELETE_REQUEST, {
    characterId: "char-1",
    itemId: "sucata-1",
  }, "p1");
  const deletion = room.approvals[0];
  room.dispatch(GAME_EVENT_TYPES.SHOP_DELETE_APPROVE, { approvalId: deletion.id }, "gm");
  assert.equal(room.getCharacter("char-1").snapshot.currency, 120);
  assert.equal(room.getCharacter("char-1").snapshot.inventory.some((item) => item.uid === "sucata-1"), false);

  room.dispatch(GAME_EVENT_TYPES.DICE_ROLL, {
    label: "Teste apos inventario sem local",
    formula: "3d6",
    rolls: [4, 4, 4],
    total: 12,
  }, "p1");
  assert.equal(room.diceLog.at(-1).total, 12);
});

test("mestre cria e distribui loot para ficha sincronizada", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currency: 10, luzentis: 10, inventory: [] },
      }),
    ],
  });

  room.dispatch(GAME_EVENT_TYPES.LOOT_CREATE, {
    name: "Vanguarda Xirax derrotado",
    luzentis: 30,
    items: [{ item: { id: "nucleo", name: "Nucleo de Fusao", price: 0 }, quantity: 1, price: 0 }],
  }, "gm");
  const pack = room.lootPacks[0];
  assert.equal(pack.status, "pending");

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.LOOT_DISTRIBUTE, { lootPackId: pack.id, characterId: "char-1" }, "p1"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.LOOT_DISTRIBUTE, { lootPackId: pack.id, characterId: "char-1" }, "gm");
  const character = room.getCharacter("char-1");
  assert.equal(character.snapshot.currency, 40);
  assert.equal(character.snapshot.inventory[0].name, "Nucleo de Fusao");
  assert.equal(room.lootPacks[0].status, "distributed");
  assert.equal(room.transactionLog[0].type, "loot:distribute");
});

test("monstro derrotado cria loot pendente automaticamente", () => {
  const room = new GameRoom({
    players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }],
  });

  room.dispatch(GAME_EVENT_TYPES.MONSTER_CREATE, {
    id: "monster-1",
    name: "Vanguarda Xirax",
    snapshot: {
      currentPV: 5,
      maxPV: 5,
      loot: [{ id: "nucleo", name: "Nucleo Xirax", quantity: 1 }],
      luzentis: 12,
    },
  }, "gm");

  room.dispatch(GAME_EVENT_TYPES.MONSTER_DAMAGE, { monsterId: "monster-1", amount: 5 }, "gm");

  assert.equal(room.lootPacks.length, 1);
  assert.equal(room.lootPacks[0].name, "Loot pendente - Vanguarda Xirax");
  assert.equal(room.lootPacks[0].items[0].item.name, "Nucleo Xirax");
  assert.equal(room.lootPacks[0].luzentis, 12);
  assert.ok(room.chat.at(-1).message.includes("Loot pendente criado"));
});

function samplePersistentRoom() {
  return new GameRoom({
    id: "mesa-campanha-1",
    name: "Colonia Solaris-7",
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    characters: [
      new SessionCharacter({
        id: "char-1",
        ownerPlayerId: "p1",
        name: "Lyssara",
        snapshot: { currentPV: 20, maxPV: 30, currency: 120, inventory: [{ uid: "kit", name: "Kit", location: { kind: "unassigned" } }] },
      }),
    ],
    monsters: [
      { id: "monster-1", name: "Drone Xirax", snapshot: { currentPV: 8, maxPV: 8, ca: 12 } },
    ],
    scene: {
      id: "scene-1",
      name: "Hangar",
      tokens: [
        { id: "token-char", entityType: "character", entityId: "char-1", name: "Lyssara", x: 2, y: 3 },
      ],
      areas: [{ id: "area-1", type: "circle", x: 4, y: 4, radius: 2 }],
    },
    shopState: { carts: { p1: { items: [] } } },
    lootPacks: [{ id: "loot-1", name: "Caixa Xirax", items: [], luzentis: 20 }],
    transactionLog: [{ id: "tx-1", type: "loot", message: "Loot criado." }],
    gmNotes: [{ id: "note-1", title: "Segredo", body: "Nucleo oculto", secret: true }],
    gmCounters: [{ id: "counter-1", name: "Alarme", current: 2, max: 6, type: "alarme" }],
    environmentalEffects: [{ id: "effect-1", name: "Gravidade instavel", duration: "1 turno" }],
    preparedEncounters: [{ id: "encounter-1", name: "Patrulha", monsters: [{ id: "monster-prep", name: "Drone Xirax", snapshot: { currentPV: 8, maxPV: 8 } }] }],
    sceneList: [{ id: "scene-1", name: "Hangar" }, { id: "scene-2", name: "Reator", tokens: [] }],
    activeSceneId: "scene-1",
  });
}

test("fase 10 protege painel do mestre, revela pistas e inicia encontros preparados", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    scene: { id: "scene-1", name: "Hangar", tokens: [] },
    sceneList: [{ id: "scene-1", name: "Hangar", tokens: [] }, { id: "scene-2", name: "Reator", tokens: [] }],
  });

  room.dispatch(GAME_EVENT_TYPES.GM_NOTE_CREATE, {
    note: { id: "note-secret", title: "Verdade de Helion", body: "Portal abre no ato 3.", tags: ["segredo"], important: true },
  }, "gm");
  assert.equal(room.gmNotes.length, 1);
  assert.equal(room.gmDashboardStateFor(room.getPlayer("p1")).gmNotes.length, 0);

  room.dispatch(GAME_EVENT_TYPES.GM_NOTE_REVEAL, { noteId: "note-secret" }, "gm");
  assert.equal(room.gmDashboardStateFor(room.getPlayer("p1")).gmNotes.length, 1);
  assert.match(room.chat.at(-1).message, /Nota revelada/);

  room.dispatch(GAME_EVENT_TYPES.GM_COUNTER_CREATE, {
    counter: { id: "counter-alert", name: "Alerta da frota", current: 5, max: 6, direction: "up", triggerText: "Reforcos chegaram." },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_COUNTER_TICK, { counterId: "counter-alert", delta: 1 }, "gm");
  assert.equal(room.gmCounters[0].current, 6);
  assert.match(room.combat.log.at(-1).message, /Reforcos chegaram/);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.GM_COUNTER_TICK, { counterId: "counter-alert", delta: -1 }, "p1"),
    /Permissao insuficiente/
  );

  room.dispatch(GAME_EVENT_TYPES.GM_SCENE_SWITCH, { sceneId: "scene-2" }, "gm");
  assert.equal(room.scene.name, "Reator");
  assert.equal(room.activeSceneId, "scene-2");

  room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, {
    encounter: {
      id: "encounter-xirax",
      name: "Patrulha Xirax",
      monsters: [{ id: "drone-xirax", name: "Drone Xirax", snapshot: { currentPV: 8, maxPV: 8, ca: 12 } }],
    },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_START, { encounterId: "encounter-xirax" }, "gm");
  assert.equal(room.preparedEncounters[0].status, "active");
  assert.equal(room.monsters.length, 1);
  assert.equal(room.scene.findTokenForEntity("monster", room.monsters[0].id).name, "Drone Xirax");

  const report = room.dispatch(GAME_EVENT_TYPES.GM_REPORT_EXPORT, {}, "gm");
  assert.equal(report.type, GAME_EVENT_TYPES.GM_REPORT_EXPORT);
  assert.match(room.applyGmDashboardEvent(GAME_EVENT_TYPES.GM_REPORT_EXPORT, {}, room.getPlayer("gm")).report, /Relatorio da Sessao/);
});

test("fase 10 persiste notas, contadores, cenas e encontros em campanhas", () => {
  const room = samplePersistentRoom();
  const state = migrateSessionState(room.toJSON());
  assert.equal(state.gmNotes[0].title, "Segredo");
  assert.equal(state.gmCounters[0].name, "Alarme");
  assert.equal(state.preparedEncounters[0].name, "Patrulha");
  assert.equal(state.sceneList.length, 2);

  const campaign = createCampaign({ name: "Campanha do Mestre", sessionState: state });
  const saved = upsertCampaignSession(campaign, state, "Fase 10");
  assert.equal(saved.gmNotes[0].title, "Segredo");
  assert.equal(saved.gmCounters[0].current, 2);
  assert.equal(saved.sceneList[1].name, "Reator");

  const bundle = createSessionExportBundle({ campaign: saved, sessionState: state, appVersion: "0.6.0-alpha.3" });
  const imported = parseSessionExportBundle(bundle);
  assert.equal(imported.sessionState.environmentalEffects[0].name, "Gravidade instavel");
  assert.equal(imported.campaign.gmNotes[0].body, "Nucleo oculto");
});

test("fase 11 gera encontro, fixa regra do escudo e envia regra ao chat", () => {
  const room = new GameRoom({
    players: [
      { id: "gm", name: "GM", role: SESSION_ROLES.GM },
      { id: "p1", name: "Lyssara", role: SESSION_ROLES.PLAYER },
    ],
    scene: { id: "scene-1", name: "Hangar", tokens: [] },
  });

  const generated = room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE, {
    name: "Emboscada gerada",
    difficulty: "dificil",
    startNow: true,
    monsters: [
      { id: "xirax-1", name: "Vanguarda Xirax", snapshot: { currentPV: 30, maxPV: 30, ca: 15 } },
      { id: "xirax-2", name: "Drone Xirax", snapshot: { currentPV: 8, maxPV: 8, ca: 12 } },
    ],
    filters: { tier: "C", role: "brutamontes" },
  }, "gm");

  assert.equal(generated.type, GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE);
  assert.equal(room.preparedEncounters[0].status, "active");
  assert.equal(room.monsters.length, 2);
  assert.equal(room.scene.tokens.filter((token) => token.entityType === "monster").length, 2);

  room.dispatch(GAME_EVENT_TYPES.GM_SHIELD_PIN, { ruleId: "fallback-cobertura" }, "gm");
  assert.deepEqual(room.gmDashboardSettings.pinnedShieldRules, ["fallback-cobertura"]);

  room.dispatch(GAME_EVENT_TYPES.GM_SHIELD_SEND_TO_CHAT, {
    rule: { title: "Cobertura", summary: "Cobertura parcial concede +2." },
  }, "gm");
  assert.match(room.chat.at(-1).message, /Cobertura parcial/);

  assert.throws(
    () => room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE, { name: "Invasao" }, "p1"),
    /Permissao insuficiente/
  );
});

test("fase 11 relatorio omite notas secretas por padrao e persiste settings do mestre", () => {
  const room = samplePersistentRoom();
  room.dispatch(GAME_EVENT_TYPES.GM_NOTE_CREATE, {
    note: { id: "note-revealed", title: "Pista revelada", body: "A porta vibra.", revealed: true },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_NOTE_CREATE, {
    note: { id: "note-secret-2", title: "Segredo total", body: "Traicao interna.", secret: true },
  }, "gm");
  room.dispatch(GAME_EVENT_TYPES.GM_REPORT_EXPORT, {
    options: { includeSecretNotes: false, includeLoot: true, includeTransactions: true },
  }, "gm");
  const reportPublic = room.applyGmDashboardEvent(GAME_EVENT_TYPES.GM_REPORT_EXPORT, {
    options: { includeSecretNotes: false },
  }, room.getPlayer("gm")).report;
  assert.match(reportPublic, /Pista revelada/);
  assert.doesNotMatch(reportPublic, /Traicao interna/);

  const reportSecret = room.applyGmDashboardEvent(GAME_EVENT_TYPES.GM_REPORT_EXPORT, {
    options: { includeSecretNotes: true },
  }, room.getPlayer("gm")).report;
  assert.match(reportSecret, /Traicao interna/);

  const state = migrateSessionState(room.toJSON());
  const saved = upsertCampaignSession(createCampaign({ name: "Fase 11", sessionState: state }), state, "Fase 11");
  assert.equal(saved.gmDashboardSettings.reportSettings.includeSecretNotes, true);
  assert.equal(saved.gmDashboardSettings.lastReportAt.length > 0, true);
});

test("fase 12 salva cenas ricas do editor visual e preserva estrutura em persistencia", () => {
  const room = new GameRoom({
    players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }],
    scene: { id: "scene-base", name: "Base", tokens: [] },
  });

  room.dispatch(GAME_EVENT_TYPES.GM_SCENE_CREATE, {
    scene: {
      id: "scene-editor",
      name: "Corredor de Manutencao",
      description: "Mapa tatico preparado no editor visual.",
      mapImage: "mapa.png",
      columns: 16,
      rows: 10,
      metersPerCell: 1.5,
      gridColor: "#35d4ff",
      lighting: "Escuro",
      climate: "Ambiente controlado",
      danger: "Moderado",
      publicNotes: "Portas seladas ao norte.",
      gmNotes: "Reforcos chegam em 3 rodadas.",
      zones: [{ id: "zone-1", label: "Plasma", type: "danger", x: 4, y: 3, width: 3, height: 2, mechanicalEffect: "1d6 termico" }],
      objectives: [{ id: "obj-1", title: "Reativar console", progressCurrent: 0, progressMax: 3, x: 6, y: 4 }],
      tokens: [{ id: "token-object", entityType: "object", entityId: "console", name: "Console", x: 6, y: 4, color: "#f2c35b" }],
    },
  }, "gm");

  room.dispatch(GAME_EVENT_TYPES.GM_SCENE_SWITCH, { sceneId: "scene-editor" }, "gm");

  assert.equal(room.scene.name, "Corredor de Manutencao");
  assert.equal(room.scene.gridColor, "#35d4ff");
  assert.equal(room.scene.lighting, "Escuro");
  assert.equal(room.scene.zones[0].mechanicalEffect, "1d6 termico");
  assert.equal(room.scene.objectives[0].title, "Reativar console");
  assert.equal(room.scene.tokens[0].name, "Console");

  const state = migrateSessionState(room.toJSON());
  assert.equal(state.sceneList.find((scene) => scene.id === "scene-editor").gmNotes, "Reforcos chegam em 3 rodadas.");
  assert.equal(state.sceneList.find((scene) => scene.id === "scene-editor").zones[0].mechanicalEffect, "1d6 termico");
});

test("fase 12 balanceia encontro e aplica posicoes iniciais ao iniciar cena", () => {
  const room = new GameRoom({
    players: [{ id: "gm", name: "GM", role: SESSION_ROLES.GM }],
    characters: [
      new SessionCharacter({ id: "char-1", ownerPlayerId: "gm", name: "Lyssara", snapshot: { level: 4, currentPV: 30, maxPV: 30 } }),
      new SessionCharacter({ id: "char-2", ownerPlayerId: "gm", name: "Drax", snapshot: { level: 4, currentPV: 32, maxPV: 32 } }),
    ],
    scene: { id: "scene-base", name: "Base", tokens: [] },
    sceneList: [
      { id: "scene-base", name: "Base", tokens: [] },
      { id: "scene-linked", name: "Hangar Xirax", columns: 12, rows: 8, tokens: [] },
    ],
  });

  const monsters = [
    { id: "xirax-1", name: "Vanguarda Xirax", snapshot: { name: "Vanguarda Xirax", tier: "C", role: "brutamontes", currentPV: 58, maxPV: 58, ca: 15 } },
    { id: "drone-1", name: "Drone Xirax", snapshot: { name: "Drone Xirax", tier: "E", role: "minion", currentPV: 12, maxPV: 12, ca: 12 } },
  ];
  const balance = estimateEncounterBalance({
    monsters: monsters.map((monster) => monster.snapshot),
    characters: room.characters.map((character) => character.snapshot),
  });

  room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, {
    encounter: {
      id: "encounter-editor",
      name: "Patrulha posicionada",
      sceneId: "scene-linked",
      loadScene: true,
      monsters,
      initialPositions: [{ x: 8, y: 3, hidden: true }, { x: 9, y: 4, hidden: false }],
      balance,
    },
  }, "gm");

  assert.equal(room.preparedEncounters[0].balance.classification, balance.classification);

  room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_START, { encounterId: "encounter-editor", loadScene: true }, "gm");
  assert.equal(room.activeSceneId, "scene-linked");
  assert.equal(room.scene.name, "Hangar Xirax");
  assert.equal(room.monsters.length, 2);
  const monsterTokens = room.scene.tokens.filter((token) => token.entityType === "monster");
  assert.equal(monsterTokens[0].x, 8);
  assert.equal(monsterTokens[0].y, 3);
  assert.equal(monsterTokens[0].hidden, true);
  assert.equal(monsterTokens[1].x, 9);
  assert.equal(room.preparedEncounters[0].status, "active");
});

test("fase 12 salva relatorios da sessao e inclui no snapshot da campanha", () => {
  const room = samplePersistentRoom();
  room.dispatch(GAME_EVENT_TYPES.GM_REPORT_SAVE, {
    report: {
      id: "report-1",
      title: "Relatorio Alfa",
      markdown: "# Relatorio Alfa\n\nCena testada.",
      options: {
        includeCounters: true,
        includeEnvironment: true,
        includeScenes: true,
        includeEncounters: true,
        includeObjectives: true,
      },
    },
  }, "gm");

  assert.equal(room.sessionReports[0].id, "report-1");
  assert.equal(room.sessionReports[0].title, "Relatorio Alfa");
  assert.equal(room.gmDashboardSettings.reportSettings.includeCounters, true);
  assert.equal(room.gmDashboardSettings.lastReportAt.length > 0, true);

  const state = migrateSessionState(room.toJSON());
  const campaign = upsertCampaignSession(createCampaign({ name: "Relatorios", sessionState: state }), state, "Fase 12");
  assert.equal(state.sessionReports[0].markdown.includes("Cena testada"), true);
  assert.equal(campaign.sessions[0].sessionReports[0].title, "Relatorio Alfa");
});

test("fase 9 cria campanha, salva sessao e serializa lista de campanhas", () => {
  const room = samplePersistentRoom();
  const sessionState = migrateSessionState(room.toJSON());
  const campaign = createCampaign({
    name: "Campanha Persistente",
    ownerName: "GM",
    sessionState,
  });

  const validation = validateCampaign(campaign);
  assert.equal(validation.ok, true);
  assert.equal(campaign.sessions.length, 1);
  assert.equal(campaign.sessions[0].roomId, "mesa-campanha-1");
  assert.equal(campaign.characters.length, 0);

  const saved = upsertCampaignSession(campaign, {
    ...sessionState,
    chatMessages: [{ id: "chat-1", message: "Registro salvo." }],
  }, "Teste de salvamento");
  assert.equal(saved.sessions.length, 1);
  assert.equal(saved.sessions[0].chatMessages[0].message, "Registro salvo.");
  assert.equal(saved.metadata.lastSaveLabel, "Teste de salvamento");

  const parsed = parseCampaignList(serializeCampaignList([saved]));
  assert.equal(parsed[0].name, "Campanha Persistente");
  assert.equal(parsed[0].sessions[0].lootPacks[0].name, "Caixa Xirax");
});

test("fase 9 exporta, importa, valida schema e migra sessao antiga", () => {
  const room = samplePersistentRoom();
  const legacy = {
    id: "legacy-room",
    name: "Sessao Antiga",
    players: [],
    characters: [],
    scene: { id: "legacy-scene", tokens: [] },
    chat: [{ id: "chat", message: "antigo" }],
    diceLog: [{ id: "roll", total: 12 }],
  };
  const migrated = migrateSessionState(legacy);
  assert.equal(migrated.schemaVersion, getCurrentSessionSchemaVersion());
  assert.equal(migrated.roomId, "legacy-room");
  assert.equal(migrated.chatMessages[0].message, "antigo");
  assert.equal(validateSessionState(migrated).ok, true);

  const sessionState = migrateSessionState(room.toJSON());
  const campaign = upsertCampaignSession(createCampaign({ name: "Exportavel" }), sessionState, "Exportavel");
  const bundle = createSessionExportBundle({
    campaign,
    sessionState,
    appVersion: "0.6.0-alpha.3",
    notes: "Teste export",
  });
  assert.equal(bundle.schemaVersion, getCurrentSessionSchemaVersion());
  assert.equal(bundle.sessionState.roomId, "mesa-campanha-1");

  const imported = parseSessionExportBundle(JSON.stringify(bundle));
  assert.equal(imported.campaign.sessions[0].roomName, "Colonia Solaris-7");
  assert.equal(imported.sessionState.mapTokens[0].id, "token-char");
});

test("fase 9 cria autosave, limita quantidade e restaura snapshot", () => {
  const room = samplePersistentRoom();
  let campaign = createCampaign({
    name: "Autosave Solaris",
    sessionState: migrateSessionState(room.toJSON()),
  });

  for (let index = 0; index < 4; index += 1) {
    const result = createAutosave(campaign, {
      ...migrateSessionState(room.toJSON()),
      roomName: `Sessao ${index}`,
    }, {
      label: `Auto ${index}`,
      maxAutosaves: 2,
    });
    campaign = result.campaign;
  }

  assert.equal(campaign.autosaves.length, 2);
  assert.equal(campaign.autosaves[0].label, "Auto 3");
  const restored = restoreAutosave(campaign, campaign.autosaves[0].id);
  assert.equal(restored.roomName, "Sessao 3");

  const manual = createSessionSnapshot({ room: restored, campaignId: campaign.id, label: "Manual" });
  assert.equal(manual.label, "Manual");
  assert.equal(manual.stateSnapshot.roomName, "Sessao 3");
});

test("fase 9 encontra sessao recente recuperavel e ignora recuperacao antiga", () => {
  const room = samplePersistentRoom();
  const recent = getRecentRecovery({
    id: "recovery-1",
    createdAt: new Date().toISOString(),
    label: "Queda recente",
    sessionState: migrateSessionState(room.toJSON()),
  });
  assert.equal(recent.label, "Queda recente");
  assert.equal(recent.sessionState.roomId, "mesa-campanha-1");

  const old = getRecentRecovery({
    id: "recovery-old",
    createdAt: "2000-01-01T00:00:00.000Z",
    sessionState: migrateSessionState(room.toJSON()),
  });
  assert.equal(old, null);
});
