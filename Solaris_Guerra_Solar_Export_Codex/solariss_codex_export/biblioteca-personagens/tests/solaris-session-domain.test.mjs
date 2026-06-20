import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVAL_STATUSES,
  GAME_EVENT_TYPES,
  GameRoom,
  MapToken,
  PlayerConnection,
  SESSION_ROLES,
  SessionCharacter,
} from "../src/session/solaris-session-domain.js";

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
