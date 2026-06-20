export const SESSION_ROLES = Object.freeze({
  GM: "gm",
  PLAYER: "player",
  OBSERVER: "observer",
});

export const GAME_EVENT_TYPES = Object.freeze({
  PLAYER_JOIN: "player:join",
  PLAYER_LEAVE: "player:leave",
  CHAT_MESSAGE: "chat:message",
  DICE_ROLL: "dice:roll",
  CHARACTER_UPDATE: "character:update",
  CHARACTER_SHEET_UPDATE: "character:sheet:update",
  CHARACTER_ATTRIBUTES_UPDATE: "character:attributes:update",
  CHARACTER_DERIVED_UPDATE: "character:derived:update",
  CHARACTER_EQUIPMENT_UPDATE: "character:equipment:update",
  CHARACTER_INVENTORY_UPDATE: "character:inventory:update",
  CHARACTER_ITEM_ADD: "character:item:add",
  CHARACTER_ITEM_REMOVE: "character:item:remove",
  CHARACTER_ITEM_MOVE: "character:item:move",
  CHARACTER_ITEM_EQUIP: "character:item:equip",
  CHARACTER_ITEM_UNEQUIP: "character:item:unequip",
  CHARACTER_ITEM_USE: "character:item:use",
  CHARACTER_WEAPON_UPDATE: "character:weapon:update",
  CHARACTER_ARMOR_UPDATE: "character:armor:update",
  CHARACTER_CUBE_UPDATE: "character:cube:update",
  CHARACTER_SPELL_ADD: "character:spell:add",
  CHARACTER_SPELL_REMOVE: "character:spell:remove",
  CHARACTER_CHIP_ADD: "character:chip:add",
  CHARACTER_CHIP_REMOVE: "character:chip:remove",
  CHARACTER_CHIP_INSTALL: "character:chip:install",
  CHARACTER_CHIP_UNINSTALL: "character:chip:uninstall",
  CHARACTER_ABILITY_ADD: "character:ability:add",
  CHARACTER_ABILITY_REMOVE: "character:ability:remove",
  CHARACTER_DAMAGE: "character:damage",
  CHARACTER_HEAL: "character:heal",
  CHARACTER_CONDITION_ADD: "character:condition:add",
  CHARACTER_CONDITION_REMOVE: "character:condition:remove",
  CHARACTER_CONDITION_UPDATE: "character:condition:update",
  CHARACTER_SYNC_REQUEST: "character:sync:request",
  CHARACTER_SYNC_FULL: "character:sync:full",
  MONSTER_CREATE: "monster:create",
  MONSTER_UPDATE: "monster:update",
  MONSTER_DELETE: "monster:delete",
  MONSTER_DAMAGE: "monster:damage",
  MONSTER_HEAL: "monster:heal",
  MONSTER_CONDITION_ADD: "monster:condition:add",
  MONSTER_CONDITION_REMOVE: "monster:condition:remove",
  COMBAT_START: "combat:start",
  COMBAT_END: "combat:end",
  COMBAT_LOG: "combat:log",
  INITIATIVE_ROLL: "initiative:roll",
  INITIATIVE_UPDATE: "initiative:update",
  TURN_NEXT: "turn:next",
  SCENE_UPDATE: "scene:update",
  SCENE_MAP_UPDATE: "scene:map:update",
  SCENE_GRID_UPDATE: "scene:grid:update",
  SCENE_MEASUREMENT_CREATE: "scene:measurement:create",
  SCENE_MEASUREMENT_CLEAR: "scene:measurement:clear",
  SCENE_AREA_CREATE: "scene:area:create",
  SCENE_AREA_UPDATE: "scene:area:update",
  SCENE_AREA_DELETE: "scene:area:delete",
  SCENE_VISIBILITY_UPDATE: "scene:visibility:update",
  SCENE_OBJECTIVE_CREATE: "scene:objective:create",
  SCENE_OBJECTIVE_UPDATE: "scene:objective:update",
  SCENE_OBJECTIVE_DELETE: "scene:objective:delete",
  TOKEN_MOVE: "token:move",
  SHOP_ITEM_DETAILS: "shop:item:details",
  SHOP_CART_STATE: "shop:cart:state",
  SHOP_CART_SUBMIT: "shop:cart:submit",
  SHOP_CART_APPROVE: "shop:cart:approve",
  SHOP_CART_REJECT: "shop:cart:reject",
  SHOP_CATALOG_REQUEST: "shop:catalog:request",
  SHOP_CATALOG_STATE: "shop:catalog:state",
  SHOP_CART_UPDATE: "shop:cart:update",
  SHOP_PURCHASE_REQUEST: "shop:purchase:request",
  SHOP_PURCHASE_APPROVE: "shop:purchase:approve",
  SHOP_PURCHASE_REJECT: "shop:purchase:reject",
  SHOP_PURCHASE_COMPLETE: "shop:purchase:complete",
  SHOP_SELL_REQUEST: "shop:sell:request",
  SHOP_SELL_APPROVE: "shop:sell:approve",
  SHOP_SELL_REJECT: "shop:sell:reject",
  SHOP_SELL_COMPLETE: "shop:sell:complete",
  SHOP_DELETE_REQUEST: "shop:delete:request",
  SHOP_DELETE_APPROVE: "shop:delete:approve",
  SHOP_DELETE_REJECT: "shop:delete:reject",
  LOOT_CREATE: "loot:create",
  LOOT_UPDATE: "loot:update",
  LOOT_DELETE: "loot:delete",
  LOOT_ASSIGN: "loot:assign",
  LOOT_CLAIM: "loot:claim",
  LOOT_DISTRIBUTE: "loot:distribute",
  LOOT_STATE: "loot:state",
  LOOT_PACK_CREATE: "loot:pack:create",
  LOOT_PACK_UPDATE: "loot:pack:update",
  LOOT_PACK_DISTRIBUTE: "loot:pack:distribute",
  LOOT_MONSTER_DEFEATED: "loot:monster:defeated",
  TRANSACTION_LOG: "transaction:log",
  APPROVAL_REQUEST: "approval:request",
  APPROVAL_APPROVE: "approval:approve",
  APPROVAL_REJECT: "approval:reject",
  APPROVAL_STATE: "approval:state",
});

export const APPROVAL_STATUSES = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const CHARACTER_SYNC_EVENTS = new Set([
  GAME_EVENT_TYPES.CHARACTER_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_SHEET_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_ATTRIBUTES_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_DERIVED_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_EQUIPMENT_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_INVENTORY_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_ITEM_ADD,
  GAME_EVENT_TYPES.CHARACTER_ITEM_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_ITEM_MOVE,
  GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP,
  GAME_EVENT_TYPES.CHARACTER_ITEM_UNEQUIP,
  GAME_EVENT_TYPES.CHARACTER_ITEM_USE,
  GAME_EVENT_TYPES.CHARACTER_WEAPON_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_ARMOR_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_CUBE_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_SPELL_ADD,
  GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CHIP_ADD,
  GAME_EVENT_TYPES.CHARACTER_CHIP_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL,
  GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL,
  GAME_EVENT_TYPES.CHARACTER_ABILITY_ADD,
  GAME_EVENT_TYPES.CHARACTER_ABILITY_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_DAMAGE,
  GAME_EVENT_TYPES.CHARACTER_HEAL,
  GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD,
  GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CONDITION_UPDATE,
  GAME_EVENT_TYPES.CHARACTER_SYNC_FULL,
]);

const BASE_SENSITIVE_CHARACTER_EVENTS = new Set([
  GAME_EVENT_TYPES.CHARACTER_SPELL_ADD,
  GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL,
  GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL,
]);

const IMPORTANT_CHARACTER_EVENTS = new Set([
  GAME_EVENT_TYPES.CHARACTER_ITEM_ADD,
  GAME_EVENT_TYPES.CHARACTER_ITEM_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_ITEM_MOVE,
  GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP,
  GAME_EVENT_TYPES.CHARACTER_ITEM_UNEQUIP,
  GAME_EVENT_TYPES.CHARACTER_ITEM_USE,
  GAME_EVENT_TYPES.CHARACTER_SPELL_ADD,
  GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL,
  GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL,
  GAME_EVENT_TYPES.CHARACTER_ABILITY_ADD,
  GAME_EVENT_TYPES.CHARACTER_ABILITY_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD,
  GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE,
  GAME_EVENT_TYPES.CHARACTER_SYNC_FULL,
]);

function createId(prefix = "session") {
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

function numeric(value, fallback = 0) {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function bounded(value, min, max, fallback = min) {
  return Math.min(max, Math.max(min, numeric(value, fallback)));
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeRole(role) {
  const value = String(role || "").toLowerCase();
  return Object.values(SESSION_ROLES).includes(value) ? value : SESSION_ROLES.PLAYER;
}

function normalizeConditions(value = []) {
  return arrayOf(value).map((condition) => ({
    id: String(condition.id || createId("condition")),
    label: String(condition.label || condition.name || "Condicao"),
    description: String(condition.description || ""),
    active: condition.active !== false,
    createdAt: condition.createdAt || nowIso(),
  }));
}

function normalizeSheetSnapshot(value = {}) {
  const snapshot = clone(value) || {};
  const inventory = arrayOf(snapshot.inventory).map((item) => ({ ...clone(item) }));
  const conditions = normalizeConditions(snapshot.conditions);
  return {
    ...snapshot,
    id: String(snapshot.id || snapshot.characterId || ""),
    characterId: String(snapshot.characterId || snapshot.id || ""),
    ownerId: String(snapshot.ownerId || snapshot.ownerPlayerId || ""),
    name: String(snapshot.name || "Personagem sem nome"),
    race: String(snapshot.race || ""),
    profession: String(snapshot.profession || ""),
    level: Math.max(1, Math.floor(numeric(snapshot.level, 1))),
    xp: Math.max(0, Math.floor(numeric(snapshot.xp ?? snapshot.experience, 0))),
    attributes: clone(snapshot.attributes || {}),
    modifiers: clone(snapshot.modifiers || {}),
    derived: clone(snapshot.derived || {}),
    skills: clone(snapshot.skills || snapshot.pericias || {}),
    protections: clone(snapshot.protections || snapshot.saves || snapshot.jogadasProtecao || {}),
    equipment: clone(snapshot.equipment || {}),
    loadout: clone(snapshot.loadout || {}),
    inventory,
    unassignedItems: arrayOf(snapshot.unassignedItems).map((item) => ({ ...clone(item) })),
    storage: clone(snapshot.storage || {}),
    cubes: arrayOf(snapshot.cubes).map((item) => ({ ...clone(item) })),
    backpacks: arrayOf(snapshot.backpacks).map((item) => ({ ...clone(item) })),
    holsters: arrayOf(snapshot.holsters).map((item) => ({ ...clone(item) })),
    bandoliers: arrayOf(snapshot.bandoliers).map((item) => ({ ...clone(item) })),
    hooks: arrayOf(snapshot.hooks).map((item) => ({ ...clone(item) })),
    cosmicSpells: arrayOf(snapshot.cosmicSpells || snapshot.spells).map((item) => ({ ...clone(item) })),
    modifierChips: arrayOf(snapshot.modifierChips || snapshot.chips).map((item) => ({ ...clone(item) })),
    professionChip: clone(snapshot.professionChip || {}),
    installedMods: arrayOf(snapshot.installedMods || snapshot.mods).map((item) => ({ ...clone(item) })),
    racialAbilities: arrayOf(snapshot.racialAbilities).map((item) => ({ ...clone(item) })),
    manualAbilities: arrayOf(snapshot.manualAbilities).map((item) => ({ ...clone(item) })),
    abilities: arrayOf(snapshot.abilities).map((item) => ({ ...clone(item) })),
    activeItems: arrayOf(snapshot.activeItems).map((item) => ({ ...clone(item) })),
    conditions,
    playerNotes: String(snapshot.playerNotes || ""),
    metadata: {
      schemaVersion: 1,
      foundryReady: true,
      ...(clone(snapshot.metadata || {}) || {}),
    },
  };
}

function setPath(target, path, value) {
  const keys = Array.isArray(path) ? path : String(path || "").split(".").filter(Boolean);
  if (!keys.length) return target;
  let cursor = target;
  keys.slice(0, -1).forEach((key) => {
    if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
    cursor = cursor[key];
  });
  cursor[keys[keys.length - 1]] = clone(value);
  return target;
}

function uniqueById(items = []) {
  const seen = new Set();
  return arrayOf(items).filter((item) => {
    const id = String(item.id || item.uid || item.name || createId("item"));
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function itemIdOf(item = {}) {
  return String(item.id || item.uid || item.itemId || item.definitionId || "");
}

function inventoryWithout(inventory = [], itemId = "") {
  return arrayOf(inventory).filter((item) => itemIdOf(item) !== itemId);
}

function updateCurrency(snapshot = {}, delta = 0) {
  const current = numeric(snapshot.currency ?? snapshot.luzentis, 0);
  const next = Math.max(0, current + numeric(delta, 0));
  snapshot.currency = next;
  snapshot.luzentis = next;
  return next;
}

function messageForCharacterChange(type, character, payload = {}, actor = null) {
  const actorName = actor?.name || "Mesa";
  const item = payload.item || payload.spell || payload.chip || payload.ability || {};
  const itemName = item.name || payload.itemName || payload.name || "item";
  const name = character?.name || "Personagem";
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_ADD) return `${actorName} adicionou ${itemName} a ficha de ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_ADD) return `${name} adicionou magia cosmica: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE) return `${name} removeu magia cosmica: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD) return `${name} recebeu uma condicao.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE) return `${name} removeu uma condicao.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP) return `${name} equipou ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_UNEQUIP) return `${name} desequipou ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_USE) return `${name} usou ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_ADD) return `${actorName} adicionou ${itemName} à ficha de ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_REMOVE) return `${actorName} removeu ${itemName} da ficha de ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_ADD) return `${name} adicionou magia cósmica: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE) return `${name} removeu magia cósmica: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL) return `${name} instalou chip modificador: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL) return `${name} desinstalou chip modificador: ${itemName}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD) return `${name} recebeu uma condição.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE) return `${name} removeu uma condição.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SYNC_FULL) return `${name} sincronizou a ficha completa.`;
  return `${name} atualizou a ficha.`;
}

function characterEventRequiresApproval(type, payload = {}, room = null, actor = null) {
  if (actor?.isGM || payload.approved === true) return false;
  if (BASE_SENSITIVE_CHARACTER_EVENTS.has(type)) return true;
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_ADD) {
    return ["purchase", "buy"].includes(String(payload.reason || payload.transaction || "").toLowerCase());
  }
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_REMOVE) {
    return ["sell", "delete", "manual-delete", "remove"].includes(String(payload.reason || payload.transaction || "").toLowerCase());
  }
  if (type === GAME_EVENT_TYPES.CHARACTER_ITEM_MOVE) {
    return Boolean(payload.targetCharacterId && payload.targetCharacterId !== payload.characterId);
  }
  if ([
    GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP,
    GAME_EVENT_TYPES.CHARACTER_ITEM_UNEQUIP,
    GAME_EVENT_TYPES.CHARACTER_EQUIPMENT_UPDATE,
    GAME_EVENT_TYPES.CHARACTER_WEAPON_UPDATE,
    GAME_EVENT_TYPES.CHARACTER_ARMOR_UPDATE,
  ].includes(type)) {
    return Boolean(room?.combat?.active);
  }
  if ([GAME_EVENT_TYPES.CHARACTER_UPDATE, GAME_EVENT_TYPES.CHARACTER_SHEET_UPDATE, GAME_EVENT_TYPES.CHARACTER_SYNC_FULL].includes(type)) {
    const patch = payload.patch || payload.sheet || payload.snapshot || {};
    if (patch.currency === undefined && patch.luzentis === undefined) return false;
    const character = room?.getCharacter?.(payload.characterId || payload.id || patch.characterId || patch.id);
    const currentMoney = numeric(character?.snapshot?.currency ?? character?.snapshot?.luzentis, NaN);
    const nextMoney = numeric(patch.currency ?? patch.luzentis, currentMoney);
    return Number.isFinite(currentMoney) ? nextMoney !== currentMoney : true;
  }
  return false;
}

function approvalMessageForType(type, payload = {}) {
  const item = payload.item || payload.spell || payload.chip || payload.ability || {};
  const name = item.name || payload.itemName || payload.name || "item";
  if (type === "purchase-item") return `Solicita compra de ${name}.`;
  if (type === "sell-item") return `Solicita venda de ${name}.`;
  if (type === "delete-item") return `Solicita exclusao de ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL) return `Solicita instalar chip ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL) return `Solicita remover chip ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_ADD) return `Solicita adicionar magia ${name}.`;
  if (type === GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE) return `Solicita remover magia ${name}.`;
  return "Solicita alteracao sensivel na ficha.";
}

function matchItem(item = {}, itemId = "") {
  const id = String(itemId || "");
  if (!id) return false;
  return [item.id, item.uid, item.itemId, item.definitionId].some((value) => String(value || "") === id);
}

function normalizeInventoryItem(item = {}) {
  const next = clone(item) || {};
  if (!next.id && !next.uid) next.id = createId("item");
  if (!next.uid) next.uid = next.id;
  if (!next.id) next.id = next.uid;
  if (!next.location) next.location = { kind: "unassigned" };
  return next;
}

function normalizeCartLine(line = {}) {
  const item = normalizeInventoryItem(line.item || line.itemSnapshot || line);
  const quantity = Math.max(1, Math.floor(numeric(line.quantity ?? item.quantity, 1)));
  const price = Math.max(0, numeric(line.price ?? item.price, 0));
  return {
    id: String(line.id || item.uid || item.id || createId("cart-line")),
    item,
    itemId: String(line.itemId || item.itemId || item.definitionId || item.id || ""),
    quantity,
    price,
    total: price * quantity,
  };
}

function normalizeShopState(value = {}) {
  const carts = value.carts && typeof value.carts === "object" && !Array.isArray(value.carts)
    ? value.carts
    : {};
  const normalizedCarts = Object.fromEntries(Object.entries(carts).map(([playerId, cart]) => [
    String(playerId),
    {
      characterId: String(cart.characterId || ""),
      items: arrayOf(cart.items).map(normalizeCartLine),
      updatedAt: cart.updatedAt || nowIso(),
    },
  ]));
  return {
    catalogVersion: String(value.catalogVersion || "book5-session-alpha"),
    approvalRequired: value.approvalRequired !== false,
    carts: normalizedCarts,
    filters: value.filters && typeof value.filters === "object" ? clone(value.filters) : {},
    updatedAt: value.updatedAt || nowIso(),
  };
}

function normalizeTransactionEntry(value = {}) {
  return {
    id: String(value.id || createId("transaction")),
    type: String(value.type || "transaction"),
    actorId: String(value.actorId || ""),
    actorName: String(value.actorName || ""),
    characterId: String(value.characterId || ""),
    targetCharacterId: String(value.targetCharacterId || ""),
    itemId: String(value.itemId || value.itemSnapshot?.id || value.itemSnapshot?.uid || ""),
    itemSnapshot: value.itemSnapshot ? normalizeInventoryItem(value.itemSnapshot) : null,
    quantity: Math.max(1, Math.floor(numeric(value.quantity, 1))),
    price: Math.max(0, numeric(value.price, 0)),
    status: String(value.status || "completed"),
    createdAt: value.createdAt || nowIso(),
    resolvedAt: value.resolvedAt || "",
    resolvedBy: String(value.resolvedBy || ""),
    message: String(value.message || ""),
  };
}

function normalizeLootPack(value = {}) {
  return {
    id: String(value.id || createId("loot")),
    name: String(value.name || "Pacote de loot"),
    source: String(value.source || ""),
    status: String(value.status || "pending"),
    items: arrayOf(value.items).map((entry) => normalizeCartLine(entry)),
    luzentis: Math.max(0, numeric(value.luzentis, 0)),
    assignedTo: String(value.assignedTo || value.targetCharacterId || ""),
    createdBy: String(value.createdBy || ""),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
    notes: String(value.notes || ""),
  };
}

function inventoryInstancesFromCart(items = [], destination = null) {
  return arrayOf(items).flatMap((line) => {
    const normalized = normalizeCartLine(line);
    return Array.from({ length: normalized.quantity }, (_, index) => normalizeInventoryItem({
      ...normalized.item,
      id: normalized.quantity === 1 && (normalized.item.id || normalized.item.uid) ? normalized.item.id : createId("item"),
      uid: normalized.quantity === 1 && (normalized.item.uid || normalized.item.id) ? normalized.item.uid || normalized.item.id : createId("item"),
      sourceItemId: normalized.itemId || normalized.item.id,
      quantity: 1,
      price: normalized.price,
      location: destination || normalized.item.location || { kind: "unassigned" },
      metadata: {
        ...(normalized.item.metadata || {}),
        shopLineId: normalized.id,
        stackIndex: index + 1,
      },
    }));
  });
}

function normalizeCombatant(value = {}) {
  const snapshot = clone(value.snapshot || {}) || {};
  const entityType = String(value.entityType || value.kind || "character");
  const entityId = String(value.entityId || value.characterId || value.monsterId || value.id || createId("combatant"));
  const maxPV = Math.max(0, numeric(
    value.maxPV ?? value.pvMax ?? value.pvMaximo ?? snapshot.maxPV ?? snapshot.pvMax ?? snapshot.pvMaximo ?? snapshot.pv,
    0
  ));
  const currentPV = Math.max(0, numeric(
    value.currentPV ?? value.pvCurrent ?? value.pvAtual ?? snapshot.currentPV ?? snapshot.pvCurrent ?? snapshot.pvAtual ?? snapshot.pv,
    maxPV
  ));
  const cosmosMax = Math.max(0, numeric(value.cosmosMax ?? snapshot.cosmosMax, 0));
  const stressMax = Math.max(0, numeric(value.stressMax ?? snapshot.stressMax, 7));
  return {
    id: String(value.id || entityId),
    entityId,
    entityType,
    kind: entityType,
    ownerPlayerId: String(value.ownerPlayerId || value.actorId || snapshot.ownerPlayerId || ""),
    name: String(value.name || snapshot.name || "Combatente"),
    portrait: String(value.portrait || value.image || value.imageDataUrl || snapshot.portrait || snapshot.photoDataUrl || snapshot.image || snapshot.imageDataUrl || ""),
    initiative: numeric(value.initiative ?? snapshot.initiative, 0),
    currentPV,
    maxPV,
    pvAtual: currentPV,
    pvMax: maxPV,
    cosmosCurrent: Math.max(0, numeric(value.cosmosCurrent ?? snapshot.cosmosCurrent, 0)),
    cosmosMax,
    stress: Math.max(0, numeric(value.stress ?? snapshot.stress, 0)),
    stressMax,
    ca: numeric(value.ca ?? snapshot.ca, 0),
    movement: numeric(value.movement ?? value.movimento ?? snapshot.movement ?? snapshot.movimento, 0),
    tier: String(value.tier || snapshot.tier || ""),
    type: String(value.type || snapshot.type || ""),
    role: String(value.role || snapshot.role || ""),
    attacks: clone(value.attacks ?? snapshot.attacks ?? []),
    abilities: clone(value.abilities ?? snapshot.abilities ?? []),
    conditions: normalizeConditions(value.conditions || snapshot.conditions),
    visible: value.visible !== false,
    isDefeated: Boolean(value.isDefeated || currentPV <= 0),
    metadata: clone(value.metadata || snapshot.metadata || {}) || {},
  };
}

function normalizeCombatLogEntry(value = {}) {
  return {
    id: String(value.id || createId("combat-log")),
    type: String(value.type || "info"),
    actorId: String(value.actorId || ""),
    actorName: String(value.actorName || "Sistema"),
    targetId: String(value.targetId || ""),
    targetName: String(value.targetName || ""),
    message: String(value.message || value.description || ""),
    data: clone(value.data || {}) || {},
    createdAt: value.createdAt || nowIso(),
  };
}

export class GameEvent {
  constructor({
    id = createId("event"),
    roomId = "",
    type = "",
    actorId = "",
    payload = {},
    sequence = 0,
    createdAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("event"));
    this.roomId = String(roomId || "");
    this.type = String(type || "");
    this.actorId = String(actorId || "");
    this.payload = clone(payload) || {};
    this.sequence = Math.max(0, Math.floor(numeric(sequence, 0)));
    this.createdAt = createdAt || nowIso();
  }

  toJSON() {
    return {
      id: this.id,
      roomId: this.roomId,
      type: this.type,
      actorId: this.actorId,
      payload: clone(this.payload),
      sequence: this.sequence,
      createdAt: this.createdAt,
    };
  }

  static fromJSON(data = {}) {
    return new GameEvent(data);
  }
}

export class PlayerConnection {
  constructor({
    id = createId("player"),
    name = "",
    role = SESSION_ROLES.PLAYER,
    characterId = "",
    online = true,
    latencyMs = 0,
    joinedAt = nowIso(),
    lastSeenAt = nowIso(),
    metadata = {},
  } = {}) {
    this.id = String(id || createId("player"));
    this.name = String(name || "Jogador sem nome");
    this.role = normalizeRole(role);
    this.characterId = String(characterId || "");
    this.online = Boolean(online);
    this.latencyMs = Math.max(0, Math.floor(numeric(latencyMs, 0)));
    this.joinedAt = joinedAt || nowIso();
    this.lastSeenAt = lastSeenAt || nowIso();
    this.metadata = clone(metadata) || {};
  }

  get isGM() {
    return this.role === SESSION_ROLES.GM;
  }

  touch({ online = this.online, latencyMs = this.latencyMs } = {}) {
    this.online = Boolean(online);
    this.latencyMs = Math.max(0, Math.floor(numeric(latencyMs, 0)));
    this.lastSeenAt = nowIso();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      characterId: this.characterId,
      online: this.online,
      latencyMs: this.latencyMs,
      joinedAt: this.joinedAt,
      lastSeenAt: this.lastSeenAt,
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new PlayerConnection(data);
  }
}

export class ChatMessage {
  constructor({
    id = createId("chat"),
    playerId = "",
    characterId = "",
    authorName = "",
    message = "",
    visibility = "table",
    createdAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("chat"));
    this.playerId = String(playerId || "");
    this.characterId = String(characterId || "");
    this.authorName = String(authorName || "");
    this.message = String(message || "");
    this.visibility = String(visibility || "table");
    this.createdAt = createdAt || nowIso();
  }

  toJSON() {
    return {
      id: this.id,
      playerId: this.playerId,
      characterId: this.characterId,
      authorName: this.authorName,
      message: this.message,
      visibility: this.visibility,
      createdAt: this.createdAt,
    };
  }

  static fromJSON(data = {}) {
    return new ChatMessage(data);
  }
}

export class DiceRollEvent {
  constructor({
    id = createId("dice"),
    playerId = "",
    characterId = "",
    label = "Rolagem",
    formula = "",
    rolls = [],
    total = 0,
    visibility = "table",
    createdAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("dice"));
    this.playerId = String(playerId || "");
    this.characterId = String(characterId || "");
    this.label = String(label || "Rolagem");
    this.formula = String(formula || "");
    this.rolls = arrayOf(rolls).map((roll) => Math.floor(numeric(roll, 0)));
    this.total = numeric(total, 0);
    this.visibility = String(visibility || "table");
    this.createdAt = createdAt || nowIso();
  }

  toJSON() {
    return {
      id: this.id,
      playerId: this.playerId,
      characterId: this.characterId,
      label: this.label,
      formula: this.formula,
      rolls: [...this.rolls],
      total: this.total,
      visibility: this.visibility,
      createdAt: this.createdAt,
    };
  }

  static fromJSON(data = {}) {
    return new DiceRollEvent(data);
  }
}

export class ApprovalRequest {
  constructor({
    id = createId("approval"),
    requestedBy = "",
    characterId = "",
    type = "",
    payload = {},
    createdAt = nowIso(),
    resolvedAt = "",
    resolvedBy = "",
    status = APPROVAL_STATUSES.PENDING,
    message = "",
  } = {}) {
    this.id = String(id || createId("approval"));
    this.requestedBy = String(requestedBy || "");
    this.characterId = String(characterId || "");
    this.type = String(type || "");
    this.payload = clone(payload) || {};
    this.createdAt = createdAt || nowIso();
    this.resolvedAt = resolvedAt || "";
    this.resolvedBy = String(resolvedBy || "");
    this.status = Object.values(APPROVAL_STATUSES).includes(status) ? status : APPROVAL_STATUSES.PENDING;
    this.message = String(message || approvalMessageForType(this.type, this.payload));
  }

  approve(resolvedBy = "") {
    this.status = APPROVAL_STATUSES.APPROVED;
    this.resolvedBy = String(resolvedBy || "");
    this.resolvedAt = nowIso();
    return this;
  }

  reject(resolvedBy = "", message = "") {
    this.status = APPROVAL_STATUSES.REJECTED;
    this.resolvedBy = String(resolvedBy || "");
    this.resolvedAt = nowIso();
    if (message) this.message = String(message);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      requestedBy: this.requestedBy,
      characterId: this.characterId,
      type: this.type,
      payload: clone(this.payload),
      createdAt: this.createdAt,
      resolvedAt: this.resolvedAt,
      resolvedBy: this.resolvedBy,
      status: this.status,
      message: this.message,
    };
  }

  static fromJSON(data = {}) {
    return new ApprovalRequest(data);
  }
}

export class SessionCharacter {
  constructor({
    id = createId("session-character"),
    characterId = "",
    ownerPlayerId = "",
    name = "",
    snapshot = {},
    revision = 0,
    visibleToPlayers = true,
    conditions = [],
    updatedAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("session-character"));
    this.characterId = String(characterId || id || "");
    this.ownerPlayerId = String(ownerPlayerId || "");
    this.revision = Math.max(0, Math.floor(numeric(revision ?? snapshot.revision, 0)));
    this.name = String(name || snapshot.name || "Personagem sem nome");
    this.snapshot = normalizeSheetSnapshot({
      ...(clone(snapshot) || {}),
      id: this.id,
      characterId: this.characterId,
      ownerId: this.ownerPlayerId,
      ownerPlayerId: this.ownerPlayerId,
      name: this.name,
    });
    this.snapshot.revision = this.revision;
    this.visibleToPlayers = Boolean(visibleToPlayers);
    this.conditions = normalizeConditions(conditions.length ? conditions : this.snapshot.conditions);
    this.updatedAt = updatedAt || nowIso();
  }

  shouldIgnoreRevision(incomingRevision = 0) {
    return incomingRevision > 0 && incomingRevision < this.revision;
  }

  bumpRevision(incomingRevision = 0) {
    this.revision = Math.max(this.revision + 1, Math.floor(numeric(incomingRevision, 0)));
    this.snapshot.revision = this.revision;
    this.updatedAt = nowIso();
  }

  update(patch = {}, { full = false, revision = patch.revision } = {}) {
    const incomingRevision = Math.floor(numeric(revision, 0));
    if (this.shouldIgnoreRevision(incomingRevision)) return this;
    const next = full
      ? normalizeSheetSnapshot({ ...clone(patch), id: this.id, characterId: this.characterId, ownerId: this.ownerPlayerId, ownerPlayerId: this.ownerPlayerId })
      : normalizeSheetSnapshot({ ...this.snapshot, ...clone(patch), id: this.id, characterId: this.characterId, ownerId: this.ownerPlayerId, ownerPlayerId: this.ownerPlayerId });
    this.snapshot = next;
    if (patch.name) this.name = String(patch.name);
    if (patch.conditions) this.conditions = normalizeConditions(patch.conditions);
    this.bumpRevision(incomingRevision);
    return this;
  }

  updateSection(path, value, options = {}) {
    const incomingRevision = Math.floor(numeric(options.revision, 0));
    if (this.shouldIgnoreRevision(incomingRevision)) return this;
    const next = normalizeSheetSnapshot(this.snapshot);
    setPath(next, path, value);
    this.snapshot = normalizeSheetSnapshot(next);
    if (path === "conditions") this.conditions = normalizeConditions(value);
    this.bumpRevision(incomingRevision);
    return this;
  }

  applyDamage(amount = 0) {
    const current = Math.max(0, numeric(this.snapshot.currentPV ?? this.snapshot.pvAtual, 0));
    this.snapshot.currentPV = Math.max(0, current - Math.max(0, numeric(amount, 0)));
    this.snapshot.pvCurrent = this.snapshot.currentPV;
    this.bumpRevision();
    return this.snapshot.currentPV;
  }

  heal(amount = 0) {
    const current = Math.max(0, numeric(this.snapshot.currentPV ?? this.snapshot.pvAtual, 0));
    const max = Math.max(current, numeric(this.snapshot.maxPV ?? this.snapshot.pvMaximo, current));
    this.snapshot.currentPV = Math.min(max, current + Math.max(0, numeric(amount, 0)));
    this.snapshot.pvCurrent = this.snapshot.currentPV;
    this.bumpRevision();
    return this.snapshot.currentPV;
  }

  addCondition(condition = {}) {
    const next = normalizeConditions([condition])[0];
    this.conditions.push(next);
    this.snapshot.conditions = this.conditions.map((entry) => ({ ...entry }));
    this.bumpRevision();
    return next;
  }

  removeCondition(conditionId = "") {
    this.conditions = this.conditions.filter((condition) => condition.id !== conditionId);
    this.snapshot.conditions = this.conditions.map((entry) => ({ ...entry }));
    this.bumpRevision();
  }

  toJSON() {
    return {
      id: this.id,
      characterId: this.characterId,
      ownerPlayerId: this.ownerPlayerId,
      name: this.name,
      snapshot: clone(this.snapshot),
      revision: this.revision,
      visibleToPlayers: this.visibleToPlayers,
      conditions: this.conditions.map((condition) => ({ ...condition })),
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data = {}) {
    return new SessionCharacter(data);
  }
}

export class SharedMonster {
  constructor({
    id = createId("shared-monster"),
    definitionId = "",
    name = "",
    snapshot = {},
    hidden = false,
    conditions = [],
    notes = "",
    updatedAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("shared-monster"));
    this.definitionId = String(definitionId || "");
    this.name = String(name || snapshot.name || "Monstro sem nome");
    this.snapshot = clone(snapshot) || {};
    this.hidden = Boolean(hidden);
    this.conditions = normalizeConditions(conditions.length ? conditions : this.snapshot.conditions);
    this.notes = String(notes || snapshot.notes || "");
    this.updatedAt = updatedAt || nowIso();
  }

  update(patch = {}) {
    this.snapshot = { ...this.snapshot, ...clone(patch) };
    if (patch.name) this.name = String(patch.name);
    if (patch.conditions) this.conditions = normalizeConditions(patch.conditions);
    if (patch.notes !== undefined) this.notes = String(patch.notes || "");
    this.updatedAt = nowIso();
    return this;
  }

  applyDamage(amount = 0) {
    const current = Math.max(0, numeric(this.snapshot.currentPV, 0));
    this.snapshot.currentPV = Math.max(0, current - Math.max(0, numeric(amount, 0)));
    this.updatedAt = nowIso();
    return this.snapshot.currentPV;
  }

  heal(amount = 0) {
    const current = Math.max(0, numeric(this.snapshot.currentPV, 0));
    const max = Math.max(current, numeric(this.snapshot.maxPV, current));
    this.snapshot.currentPV = Math.min(max, current + Math.max(0, numeric(amount, 0)));
    this.updatedAt = nowIso();
    return this.snapshot.currentPV;
  }

  addCondition(condition = {}) {
    const next = normalizeConditions([condition])[0];
    this.conditions.push(next);
    this.snapshot.conditions = this.conditions.map((entry) => ({ ...entry }));
    this.updatedAt = nowIso();
    return next;
  }

  removeCondition(conditionId = "") {
    this.conditions = this.conditions.filter((condition) => condition.id !== conditionId);
    this.snapshot.conditions = this.conditions.map((entry) => ({ ...entry }));
    this.updatedAt = nowIso();
  }

  toJSON() {
    return {
      id: this.id,
      definitionId: this.definitionId,
      name: this.name,
      snapshot: clone(this.snapshot),
      hidden: this.hidden,
      conditions: this.conditions.map((condition) => ({ ...condition })),
      notes: this.notes,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data = {}) {
    return new SharedMonster(data);
  }
}

export class MapToken {
  constructor({
    id = createId("token"),
    entityType = "character",
    entityId = "",
    name = "",
    x = 0,
    y = 0,
    size = 1,
    image = "",
    color = "",
    hidden = false,
    locked = false,
    metadata = {},
  } = {}) {
    this.id = String(id || createId("token"));
    this.entityType = String(entityType || "character");
    this.entityId = String(entityId || "");
    this.name = String(name || "Token");
    this.x = numeric(x, 0);
    this.y = numeric(y, 0);
    this.size = Math.max(1, numeric(size, 1));
    this.image = String(image || "");
    this.color = String(color || "");
    this.hidden = Boolean(hidden);
    this.locked = Boolean(locked);
    this.metadata = clone(metadata) || {};
  }

  moveTo(x = this.x, y = this.y) {
    if (this.locked) return this;
    this.x = numeric(x, this.x);
    this.y = numeric(y, this.y);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      entityType: this.entityType,
      entityId: this.entityId,
      name: this.name,
      x: this.x,
      y: this.y,
      size: this.size,
      image: this.image,
      color: this.color,
      hidden: this.hidden,
      locked: this.locked,
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new MapToken(data);
  }
}

export class Scene {
  constructor({
    id = createId("scene"),
    name = "Cena sem nome",
    mapImage = "",
    gridSize = 64,
    gridVisible = true,
    gridOpacity = 0.38,
    snapToGrid = true,
    metersPerCell = 1.5,
    columns = 12,
    rows = 8,
    tokens = [],
    zones = [],
    areas = [],
    measurements = [],
    objectives = [],
    notes = "",
    metadata = {},
  } = {}) {
    this.id = String(id || createId("scene"));
    this.name = String(name || "Cena sem nome");
    this.mapImage = String(mapImage || "");
    this.gridSize = Math.max(1, numeric(gridSize, 64));
    this.gridVisible = gridVisible !== false;
    this.gridOpacity = Math.max(0, Math.min(1, numeric(gridOpacity, 0.38)));
    this.snapToGrid = snapToGrid !== false;
    this.metersPerCell = Math.max(0.1, numeric(metersPerCell, 1.5));
    this.columns = Math.max(4, Math.floor(numeric(columns, 12)));
    this.rows = Math.max(4, Math.floor(numeric(rows, 8)));
    this.tokens = arrayOf(tokens).map((token) => token instanceof MapToken ? token : MapToken.fromJSON(token));
    this.zones = arrayOf(zones).map((zone) => this.normalizeZone(zone));
    this.areas = arrayOf(areas).map((area) => this.normalizeArea(area));
    this.measurements = arrayOf(measurements).map((measurement) => this.normalizeMeasurement(measurement));
    this.objectives = arrayOf(objectives).map((objective) => this.normalizeObjective(objective));
    this.notes = String(notes || "");
    this.metadata = clone(metadata) || {};
  }

  normalizeZone(zone = {}) {
    return {
      id: String(zone.id || createId("zone")),
      label: String(zone.label || zone.name || "Zona"),
      type: String(zone.type || "danger"),
      x: bounded(zone.x, 1, this.columns, 1),
      y: bounded(zone.y, 1, this.rows, 1),
      width: Math.max(1, Math.min(this.columns, numeric(zone.width, 2))),
      height: Math.max(1, Math.min(this.rows, numeric(zone.height, 2))),
      color: String(zone.color || ""),
      notes: String(zone.notes || ""),
      hidden: Boolean(zone.hidden),
      visibleToPlayers: zone.visibleToPlayers !== false && !zone.hidden,
      metadata: clone(zone.metadata) || {},
    };
  }

  normalizeArea(area = {}) {
    return {
      id: String(area.id || createId("area")),
      type: String(area.type || "circle"),
      x: bounded(area.x, 1, this.columns, 1),
      y: bounded(area.y, 1, this.rows, 1),
      radius: Math.max(0, numeric(area.radius, 2)),
      length: Math.max(1, numeric(area.length, area.radius || 4)),
      width: Math.max(1, numeric(area.width, 1)),
      color: String(area.color || ""),
      label: String(area.label || area.name || "Area"),
      source: String(area.source || ""),
      ownerId: String(area.ownerId || ""),
      visibleToPlayers: area.visibleToPlayers !== false && !area.hidden,
      hidden: Boolean(area.hidden),
      metadata: clone(area.metadata) || {},
    };
  }

  normalizeMeasurement(measurement = {}) {
    const from = measurement.from || {};
    const to = measurement.to || {};
    const startX = bounded(from.x ?? measurement.startX ?? measurement.x1, 1, this.columns, 1);
    const startY = bounded(from.y ?? measurement.startY ?? measurement.y1, 1, this.rows, 1);
    const endX = bounded(to.x ?? measurement.endX ?? measurement.x2, 1, this.columns, startX);
    const endY = bounded(to.y ?? measurement.endY ?? measurement.y2, 1, this.rows, startY);
    const cells = this.measureDistanceCells(startX, startY, endX, endY);
    return {
      id: String(measurement.id || createId("measurement")),
      from: { x: startX, y: startY },
      to: { x: endX, y: endY },
      cells,
      meters: Number((cells * this.metersPerCell).toFixed(2)),
      ownerId: String(measurement.ownerId || ""),
      createdAt: measurement.createdAt || nowIso(),
      visibleToPlayers: measurement.visibleToPlayers !== false,
      metadata: clone(measurement.metadata) || {},
    };
  }

  normalizeObjective(objective = {}) {
    const progressCurrent = Math.max(0, numeric(objective.progressCurrent ?? objective.current, 0));
    const progressMax = Math.max(1, numeric(objective.progressMax ?? objective.max, 1));
    return {
      id: String(objective.id || createId("objective")),
      title: String(objective.title || objective.label || objective.name || "Objetivo"),
      label: String(objective.label || objective.title || objective.name || "Objetivo"),
      description: String(objective.description || objective.notes || ""),
      progressCurrent,
      progressMax,
      progress: String(objective.progress || `${progressCurrent}/${progressMax}`),
      x: objective.x === undefined ? null : bounded(objective.x, 1, this.columns, 1),
      y: objective.y === undefined ? null : bounded(objective.y, 1, this.rows, 1),
      completed: Boolean(objective.completed),
      visibleToPlayers: objective.visibleToPlayers !== false && !objective.hidden,
      hidden: Boolean(objective.hidden),
    };
  }

  measureDistanceCells(x1 = 1, y1 = 1, x2 = 1, y2 = 1) {
    const dx = numeric(x2, x1) - numeric(x1, 1);
    const dy = numeric(y2, y1) - numeric(y1, 1);
    return Number(Math.hypot(dx, dy).toFixed(2));
  }

  movementPreview(tokenId = "", x = 1, y = 1) {
    const token = this.tokens.find((entry) => entry.id === tokenId);
    if (!token) return null;
    const cells = this.measureDistanceCells(token.x, token.y, x, y);
    const meters = Number((cells * this.metersPerCell).toFixed(2));
    const movement = Math.max(0, numeric(token.metadata?.movement ?? token.metadata?.movimento ?? token.movement, 0));
    return {
      tokenId: token.id,
      tokenName: token.name,
      from: { x: token.x, y: token.y },
      to: { x, y },
      cells,
      meters,
      movement,
      exceedsMovement: Boolean(movement && meters > movement),
    };
  }

  findTokenForEntity(entityType = "", entityId = "") {
    return this.tokens.find((token) => token.entityType === entityType && token.entityId === entityId) || null;
  }

  upsertToken(token) {
    const resolved = token instanceof MapToken ? token : new MapToken(token);
    const index = this.tokens.findIndex((entry) => entry.id === resolved.id);
    if (index >= 0) this.tokens[index] = resolved;
    else this.tokens.push(resolved);
    return resolved;
  }

  moveToken(tokenId = "", x = 0, y = 0) {
    const token = this.tokens.find((entry) => entry.id === tokenId);
    if (!token) throw new Error("Token nao encontrado.");
    return token.moveTo(
      bounded(x, 1, this.columns, token.x || 1),
      bounded(y, 1, this.rows, token.y || 1)
    );
  }

  removeToken(tokenId = "") {
    this.tokens = this.tokens.filter((token) => token.id !== tokenId);
  }

  addMeasurement(measurement = {}) {
    const next = this.normalizeMeasurement(measurement);
    this.measurements.unshift(next);
    this.measurements = this.measurements.slice(0, 12);
    return next;
  }

  clearMeasurements() {
    this.measurements = [];
    return this.measurements;
  }

  upsertArea(area = {}) {
    const next = this.normalizeArea(area);
    const index = this.areas.findIndex((entry) => entry.id === next.id);
    if (index >= 0) this.areas[index] = next;
    else this.areas.push(next);
    return next;
  }

  removeArea(areaId = "") {
    const existing = this.areas.find((entry) => entry.id === areaId) || null;
    this.areas = this.areas.filter((entry) => entry.id !== areaId);
    return existing;
  }

  upsertObjective(objective = {}) {
    const next = this.normalizeObjective(objective);
    const index = this.objectives.findIndex((entry) => entry.id === next.id);
    if (index >= 0) this.objectives[index] = next;
    else this.objectives.push(next);
    return next;
  }

  removeObjective(objectiveId = "") {
    const existing = this.objectives.find((entry) => entry.id === objectiveId) || null;
    this.objectives = this.objectives.filter((entry) => entry.id !== objectiveId);
    return existing;
  }

  updateVisibility({ targetType = "token", id = "", hidden = false, visibleToPlayers } = {}) {
    const list = targetType === "area" ? this.areas : targetType === "objective" ? this.objectives : this.tokens;
    const target = list.find((entry) => entry.id === id);
    if (!target) throw new Error("Elemento de cena nao encontrado.");
    target.hidden = Boolean(hidden);
    if (visibleToPlayers !== undefined) target.visibleToPlayers = Boolean(visibleToPlayers);
    else if ("visibleToPlayers" in target) target.visibleToPlayers = !target.hidden;
    return target;
  }

  update(patch = {}) {
    if (patch.name !== undefined) this.name = String(patch.name || "Cena sem nome");
    if (patch.mapImage !== undefined) this.mapImage = String(patch.mapImage || "");
    if (patch.gridSize !== undefined) this.gridSize = Math.max(1, numeric(patch.gridSize, this.gridSize));
    if (patch.gridVisible !== undefined) this.gridVisible = patch.gridVisible !== false;
    if (patch.gridOpacity !== undefined) this.gridOpacity = Math.max(0, Math.min(1, numeric(patch.gridOpacity, this.gridOpacity)));
    if (patch.snapToGrid !== undefined) this.snapToGrid = patch.snapToGrid !== false;
    if (patch.metersPerCell !== undefined) this.metersPerCell = Math.max(0.1, numeric(patch.metersPerCell, this.metersPerCell));
    if (patch.columns !== undefined) this.columns = Math.max(4, Math.floor(numeric(patch.columns, this.columns)));
    if (patch.rows !== undefined) this.rows = Math.max(4, Math.floor(numeric(patch.rows, this.rows)));
    if (patch.notes !== undefined) this.notes = String(patch.notes || "");
    if (patch.metadata) this.metadata = { ...this.metadata, ...clone(patch.metadata) };
    if (patch.tokens) this.tokens = arrayOf(patch.tokens).map((token) => token instanceof MapToken ? token : MapToken.fromJSON(token));
    if (patch.zones) this.zones = arrayOf(patch.zones).map((zone) => this.normalizeZone(zone));
    if (patch.areas) this.areas = arrayOf(patch.areas).map((area) => this.normalizeArea(area));
    if (patch.measurements) this.measurements = arrayOf(patch.measurements).map((measurement) => this.normalizeMeasurement(measurement));
    if (patch.objectives) this.objectives = arrayOf(patch.objectives).map((objective) => this.normalizeObjective(objective));
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      mapImage: this.mapImage,
      gridSize: this.gridSize,
      gridVisible: this.gridVisible,
      gridOpacity: this.gridOpacity,
      snapToGrid: this.snapToGrid,
      metersPerCell: this.metersPerCell,
      columns: this.columns,
      rows: this.rows,
      tokens: this.tokens.map((token) => token.toJSON()),
      zones: this.zones.map((zone) => ({ ...zone })),
      areas: this.areas.map((area) => clone(area)),
      measurements: this.measurements.map((measurement) => clone(measurement)),
      objectives: this.objectives.map((objective) => ({ ...objective })),
      notes: this.notes,
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new Scene(data);
  }
}

export class InitiativeEntry {
  constructor({
    id = createId("initiative"),
    entityType = "character",
    kind = entityType,
    entityId = "",
    name = "",
    initiative = 0,
    actorId = "",
    ownerPlayerId = "",
    portrait = "",
    ca = 0,
    currentPV = 0,
    maxPV = 0,
    isDefeated = false,
    visible = true,
  } = {}) {
    this.id = String(id || createId("initiative"));
    this.entityType = String(entityType || kind || "character");
    this.kind = String(kind || this.entityType);
    this.entityId = String(entityId || "");
    this.name = String(name || "Participante");
    this.initiative = numeric(initiative, 0);
    this.actorId = String(actorId || "");
    this.ownerPlayerId = String(ownerPlayerId || actorId || "");
    this.portrait = String(portrait || "");
    this.ca = numeric(ca, 0);
    this.currentPV = Math.max(0, numeric(currentPV, 0));
    this.maxPV = Math.max(0, numeric(maxPV, this.currentPV));
    this.isDefeated = Boolean(isDefeated);
    this.visible = Boolean(visible);
  }

  toJSON() {
    return {
      id: this.id,
      entityType: this.entityType,
      kind: this.kind,
      entityId: this.entityId,
      name: this.name,
      initiative: this.initiative,
      actorId: this.actorId,
      ownerPlayerId: this.ownerPlayerId,
      portrait: this.portrait,
      ca: this.ca,
      currentPV: this.currentPV,
      maxPV: this.maxPV,
      isDefeated: this.isDefeated,
      visible: this.visible,
    };
  }

  static fromJSON(data = {}) {
    return new InitiativeEntry(data);
  }
}

export class CombatTracker {
  constructor({
    active = false,
    round = 0,
    turnIndex = 0,
    entries = [],
    initiative = [],
    combatants = [],
    log = [],
    startedAt = null,
    endedAt = null,
  } = {}) {
    this.active = Boolean(active);
    this.round = Math.max(0, Math.floor(numeric(round, 0)));
    this.turnIndex = Math.max(0, Math.floor(numeric(turnIndex, 0)));
    this.entries = arrayOf(entries.length ? entries : initiative).map((entry) => entry instanceof InitiativeEntry ? entry : InitiativeEntry.fromJSON(entry));
    this.combatants = arrayOf(combatants).map(normalizeCombatant);
    this.log = arrayOf(log).map(normalizeCombatLogEntry);
    this.startedAt = startedAt || null;
    this.endedAt = endedAt || null;
  }

  get currentEntry() {
    return this.entries[this.turnIndex] || null;
  }

  get currentCombatant() {
    const entry = this.currentEntry;
    if (!entry) return null;
    return this.getCombatant(entry.entityId);
  }

  start(entries = this.entries, combatants = this.combatants) {
    this.combatants = arrayOf(combatants).map(normalizeCombatant);
    const nextEntries = arrayOf(entries).length
      ? entries
      : this.combatants.map((combatant) => ({
        entityType: combatant.entityType,
        entityId: combatant.entityId,
        name: combatant.name,
        initiative: combatant.initiative,
        actorId: combatant.ownerPlayerId,
        ownerPlayerId: combatant.ownerPlayerId,
        portrait: combatant.portrait,
        ca: combatant.ca,
        currentPV: combatant.currentPV,
        maxPV: combatant.maxPV,
        isDefeated: combatant.isDefeated,
      }));
    this.entries = arrayOf(nextEntries)
      .map((entry) => {
        const resolved = entry instanceof InitiativeEntry ? entry : new InitiativeEntry(entry);
        const combatant = this.getCombatant(resolved.entityId);
        if (combatant) {
          resolved.name = resolved.name || combatant.name;
          resolved.actorId = resolved.actorId || combatant.ownerPlayerId;
          resolved.ownerPlayerId = resolved.ownerPlayerId || combatant.ownerPlayerId;
          resolved.portrait = resolved.portrait || combatant.portrait;
          resolved.ca = resolved.ca || combatant.ca;
          resolved.currentPV = combatant.currentPV;
          resolved.maxPV = combatant.maxPV;
          resolved.isDefeated = combatant.isDefeated;
          combatant.initiative = resolved.initiative;
        }
        return resolved;
      })
      .sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name, "pt-BR"));
    this.active = true;
    this.round = 1;
    this.turnIndex = 0;
    this.startedAt = nowIso();
    this.endedAt = null;
    return this;
  }

  end() {
    this.active = false;
    this.endedAt = nowIso();
    return this;
  }

  nextTurn() {
    if (!this.entries.length) return null;
    this.turnIndex += 1;
    if (this.turnIndex >= this.entries.length) {
      this.turnIndex = 0;
      this.round += 1;
    }
    return this.currentEntry;
  }

  updateEntry(entry) {
    const resolved = entry instanceof InitiativeEntry ? entry : new InitiativeEntry(entry);
    const index = this.entries.findIndex((item) => item.id === resolved.id || (item.entityId && item.entityId === resolved.entityId));
    if (index >= 0) this.entries[index] = resolved;
    else this.entries.push(resolved);
    this.entries.sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name, "pt-BR"));
    const combatant = this.getCombatant(resolved.entityId);
    if (combatant) combatant.initiative = resolved.initiative;
    this.turnIndex = Math.min(this.turnIndex, Math.max(0, this.entries.length - 1));
    return resolved;
  }

  upsertCombatant(combatant = {}) {
    const resolved = normalizeCombatant(combatant);
    const index = this.combatants.findIndex((item) => item.id === resolved.id || item.entityId === resolved.entityId);
    if (index >= 0) this.combatants[index] = { ...this.combatants[index], ...resolved };
    else this.combatants.push(resolved);
    const entry = this.entries.find((item) => item.entityId === resolved.entityId);
    if (entry) {
      entry.name = resolved.name;
      entry.ownerPlayerId = resolved.ownerPlayerId;
      entry.actorId = entry.actorId || resolved.ownerPlayerId;
      entry.portrait = resolved.portrait;
      entry.ca = resolved.ca;
      entry.currentPV = resolved.currentPV;
      entry.maxPV = resolved.maxPV;
      entry.isDefeated = resolved.isDefeated;
    }
    return resolved;
  }

  removeCombatant(entityId = "") {
    this.combatants = this.combatants.filter((combatant) => combatant.entityId !== entityId && combatant.id !== entityId);
    this.entries = this.entries.filter((entry) => entry.entityId !== entityId && entry.id !== entityId);
    this.turnIndex = Math.min(this.turnIndex, Math.max(0, this.entries.length - 1));
  }

  getCombatant(entityId = "") {
    return this.combatants.find((combatant) => combatant.entityId === entityId || combatant.id === entityId) || null;
  }

  updateCombatant(entityId = "", patch = {}) {
    const existing = this.getCombatant(entityId);
    if (!existing) return null;
    const next = normalizeCombatant({ ...existing, ...clone(patch), id: existing.id, entityId: existing.entityId });
    return this.upsertCombatant(next);
  }

  applyDamage(entityId = "", amount = 0) {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    combatant.currentPV = Math.max(0, numeric(combatant.currentPV, 0) - Math.max(0, numeric(amount, 0)));
    combatant.pvAtual = combatant.currentPV;
    combatant.isDefeated = combatant.currentPV <= 0;
    this.upsertCombatant(combatant);
    return combatant;
  }

  heal(entityId = "", amount = 0) {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    combatant.currentPV = Math.min(
      Math.max(combatant.currentPV, combatant.maxPV),
      Math.max(0, numeric(combatant.currentPV, 0)) + Math.max(0, numeric(amount, 0))
    );
    combatant.pvAtual = combatant.currentPV;
    combatant.isDefeated = combatant.currentPV <= 0;
    this.upsertCombatant(combatant);
    return combatant;
  }

  addCondition(entityId = "", condition = {}) {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    const next = normalizeConditions([condition])[0];
    combatant.conditions = normalizeConditions([...combatant.conditions, next]);
    this.upsertCombatant(combatant);
    return next;
  }

  removeCondition(entityId = "", conditionId = "") {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    combatant.conditions = combatant.conditions.filter((condition) => condition.id !== conditionId);
    this.upsertCombatant(combatant);
    return combatant;
  }

  addLog(entry = {}) {
    const next = normalizeCombatLogEntry(entry);
    if (next.message.trim()) {
      this.log.unshift(next);
      this.log = this.log.slice(0, 200);
    }
    return next;
  }

  toJSON() {
    return {
      active: this.active,
      round: this.round,
      turnIndex: this.turnIndex,
      entries: this.entries.map((entry) => entry.toJSON()),
      initiative: this.entries.map((entry) => entry.toJSON()),
      combatants: this.combatants.map((combatant) => clone(combatant)),
      currentEntry: this.currentEntry ? this.currentEntry.toJSON() : null,
      currentCombatant: this.currentCombatant ? clone(this.currentCombatant) : null,
      log: this.log.map((entry) => clone(entry)),
      startedAt: this.startedAt,
      endedAt: this.endedAt,
    };
  }

  static fromJSON(data = {}) {
    return new CombatTracker(data);
  }
}

export class PermissionManager {
  static can(player, action, target = {}) {
    if (!player) return [GAME_EVENT_TYPES.PLAYER_JOIN].includes(action);
    if (player.isGM) return true;
    if ([GAME_EVENT_TYPES.CHAT_MESSAGE, GAME_EVENT_TYPES.DICE_ROLL, GAME_EVENT_TYPES.PLAYER_LEAVE].includes(action)) return true;
    if (action === GAME_EVENT_TYPES.APPROVAL_REQUEST) return true;
    if ([
      GAME_EVENT_TYPES.SHOP_CATALOG_REQUEST,
      GAME_EVENT_TYPES.SHOP_CART_UPDATE,
      GAME_EVENT_TYPES.SHOP_PURCHASE_REQUEST,
      GAME_EVENT_TYPES.SHOP_SELL_REQUEST,
      GAME_EVENT_TYPES.SHOP_DELETE_REQUEST,
      GAME_EVENT_TYPES.LOOT_STATE,
      GAME_EVENT_TYPES.LOOT_CLAIM,
      GAME_EVENT_TYPES.SCENE_MEASUREMENT_CREATE,
      GAME_EVENT_TYPES.SCENE_MEASUREMENT_CLEAR,
    ].includes(action)) return true;
    if ([GAME_EVENT_TYPES.APPROVAL_APPROVE, GAME_EVENT_TYPES.APPROVAL_REJECT].includes(action)) return false;
    if (action === GAME_EVENT_TYPES.INITIATIVE_ROLL) {
      return target.entityType === "character" && target.ownerPlayerId === player.id;
    }
    if (CHARACTER_SYNC_EVENTS.has(action) || action === GAME_EVENT_TYPES.CHARACTER_SYNC_REQUEST) {
      return Boolean(target.ownerPlayerId && target.ownerPlayerId === player.id);
    }
    if (action === GAME_EVENT_TYPES.TOKEN_MOVE) {
      return target.entityType === "character" && target.ownerPlayerId === player.id;
    }
    return false;
  }
}

export class GameRoom {
  constructor({
    id = createId("room"),
    name = "Sala Solaris",
    system = "Guerra Solar / Solaris",
    accessCode = "",
    hostPlayerId = "",
    players = [],
    characters = [],
    monsters = [],
    scene = {},
    combat = {},
    chat = [],
    diceLog = [],
    approvals = [],
    shopState = {},
    pendingApprovals = [],
    lootPacks = [],
    transactionLog = [],
    events = [],
    sequence = 0,
    createdAt = nowIso(),
    updatedAt = nowIso(),
  } = {}) {
    this.id = String(id || createId("room"));
    this.name = String(name || "Sala Solaris");
    this.system = String(system || "Guerra Solar / Solaris");
    this.accessCode = String(accessCode || "");
    this.hostPlayerId = String(hostPlayerId || "");
    this.players = arrayOf(players).map((player) => player instanceof PlayerConnection ? player : PlayerConnection.fromJSON(player));
    this.characters = arrayOf(characters).map((character) => character instanceof SessionCharacter ? character : SessionCharacter.fromJSON(character));
    this.monsters = arrayOf(monsters).map((monster) => monster instanceof SharedMonster ? monster : SharedMonster.fromJSON(monster));
    this.scene = scene instanceof Scene ? scene : Scene.fromJSON(scene);
    this.combat = combat instanceof CombatTracker ? combat : CombatTracker.fromJSON(combat);
    this.chat = arrayOf(chat).map((message) => message instanceof ChatMessage ? message : ChatMessage.fromJSON(message));
    this.diceLog = arrayOf(diceLog).map((roll) => roll instanceof DiceRollEvent ? roll : DiceRollEvent.fromJSON(roll));
    this.approvals = arrayOf(approvals.length ? approvals : pendingApprovals).map((approval) => approval instanceof ApprovalRequest ? approval : ApprovalRequest.fromJSON(approval));
    this.shopState = normalizeShopState(shopState);
    this.lootPacks = arrayOf(lootPacks).map(normalizeLootPack);
    this.transactionLog = arrayOf(transactionLog).map(normalizeTransactionEntry);
    this.events = arrayOf(events).map((event) => event instanceof GameEvent ? event : GameEvent.fromJSON(event));
    this.sequence = Math.max(0, Math.floor(numeric(sequence, 0)));
    this.createdAt = createdAt || nowIso();
    this.updatedAt = updatedAt || nowIso();
    this.syncSceneTokens();
  }

  getPlayer(playerId = "") {
    return this.players.find((player) => player.id === playerId) || null;
  }

  getCharacter(characterId = "") {
    return this.characters.find((character) => character.id === characterId || character.characterId === characterId) || null;
  }

  getMonster(monsterId = "") {
    return this.monsters.find((monster) => monster.id === monsterId || monster.definitionId === monsterId) || null;
  }

  dispatch(type, payload = {}, actorId = "") {
    return this.applyEvent(new GameEvent({ roomId: this.id, type, actorId, payload }));
  }

  applyEvent(event) {
    const nextEvent = event instanceof GameEvent ? event : GameEvent.fromJSON(event);
    nextEvent.roomId = this.id;
    nextEvent.sequence = this.sequence + 1;
    const actor = this.getPlayer(nextEvent.actorId);
    this.applyEventPayload(nextEvent, actor);
    this.sequence = nextEvent.sequence;
    this.events.push(nextEvent);
    this.events = this.events.slice(-500);
    this.updatedAt = nowIso();
    return nextEvent;
  }

  assertAllowed(actor, action, target = {}) {
    if (!PermissionManager.can(actor, action, target)) {
      throw new Error("Permissao insuficiente para executar esta acao na mesa.");
    }
  }

  applyEventPayload(event, actor) {
    const payload = clone(event.payload) || {};
    switch (event.type) {
      case GAME_EVENT_TYPES.PLAYER_JOIN:
        return this.handlePlayerJoin(payload);
      case GAME_EVENT_TYPES.PLAYER_LEAVE:
        this.assertAllowed(actor, event.type);
        return this.handlePlayerLeave(payload.playerId || event.actorId);
      case GAME_EVENT_TYPES.CHAT_MESSAGE:
        this.assertAllowed(actor, event.type);
        return this.addChatMessage({ ...payload, playerId: event.actorId, authorName: actor?.name || payload.authorName });
      case GAME_EVENT_TYPES.DICE_ROLL:
        this.assertAllowed(actor, event.type);
        return this.addDiceRoll({ ...payload, playerId: event.actorId });
      case GAME_EVENT_TYPES.CHARACTER_SYNC_REQUEST:
        return this.requestCharacterSync(payload, actor);
      case GAME_EVENT_TYPES.APPROVAL_REQUEST:
      case GAME_EVENT_TYPES.APPROVAL_APPROVE:
      case GAME_EVENT_TYPES.APPROVAL_REJECT:
      case GAME_EVENT_TYPES.APPROVAL_STATE:
        return this.applyApprovalEvent(event.type, payload, actor);
      case GAME_EVENT_TYPES.SHOP_CATALOG_REQUEST:
      case GAME_EVENT_TYPES.SHOP_CATALOG_STATE:
      case GAME_EVENT_TYPES.SHOP_ITEM_DETAILS:
      case GAME_EVENT_TYPES.SHOP_CART_STATE:
      case GAME_EVENT_TYPES.SHOP_CART_SUBMIT:
      case GAME_EVENT_TYPES.SHOP_CART_APPROVE:
      case GAME_EVENT_TYPES.SHOP_CART_REJECT:
      case GAME_EVENT_TYPES.SHOP_CART_UPDATE:
      case GAME_EVENT_TYPES.SHOP_PURCHASE_REQUEST:
      case GAME_EVENT_TYPES.SHOP_PURCHASE_APPROVE:
      case GAME_EVENT_TYPES.SHOP_PURCHASE_REJECT:
      case GAME_EVENT_TYPES.SHOP_PURCHASE_COMPLETE:
      case GAME_EVENT_TYPES.SHOP_SELL_REQUEST:
      case GAME_EVENT_TYPES.SHOP_SELL_APPROVE:
      case GAME_EVENT_TYPES.SHOP_SELL_REJECT:
      case GAME_EVENT_TYPES.SHOP_SELL_COMPLETE:
      case GAME_EVENT_TYPES.SHOP_DELETE_REQUEST:
      case GAME_EVENT_TYPES.SHOP_DELETE_APPROVE:
      case GAME_EVENT_TYPES.SHOP_DELETE_REJECT:
        return this.applyShopEvent(event.type, payload, actor);
      case GAME_EVENT_TYPES.LOOT_CREATE:
      case GAME_EVENT_TYPES.LOOT_UPDATE:
      case GAME_EVENT_TYPES.LOOT_DELETE:
      case GAME_EVENT_TYPES.LOOT_ASSIGN:
      case GAME_EVENT_TYPES.LOOT_CLAIM:
      case GAME_EVENT_TYPES.LOOT_DISTRIBUTE:
      case GAME_EVENT_TYPES.LOOT_STATE:
      case GAME_EVENT_TYPES.LOOT_PACK_CREATE:
      case GAME_EVENT_TYPES.LOOT_PACK_UPDATE:
      case GAME_EVENT_TYPES.LOOT_PACK_DISTRIBUTE:
      case GAME_EVENT_TYPES.LOOT_MONSTER_DEFEATED:
        return this.applyLootEvent(event.type, payload, actor);
      case GAME_EVENT_TYPES.TRANSACTION_LOG:
        this.assertAllowed(actor, event.type);
        return this.addTransaction({ ...payload, actorId: event.actorId, actorName: actor?.name || payload.actorName });
      case GAME_EVENT_TYPES.MONSTER_CREATE:
      case GAME_EVENT_TYPES.MONSTER_UPDATE:
      case GAME_EVENT_TYPES.MONSTER_DELETE:
      case GAME_EVENT_TYPES.MONSTER_DAMAGE:
      case GAME_EVENT_TYPES.MONSTER_HEAL:
      case GAME_EVENT_TYPES.MONSTER_CONDITION_ADD:
      case GAME_EVENT_TYPES.MONSTER_CONDITION_REMOVE:
        this.assertAllowed(actor, event.type);
        return this.applyMonsterEvent(event.type, payload, actor);
      case GAME_EVENT_TYPES.COMBAT_START:
        this.assertAllowed(actor, event.type);
        return this.startCombat(payload, actor);
      case GAME_EVENT_TYPES.COMBAT_END:
        this.assertAllowed(actor, event.type);
        return this.endCombat(actor);
      case GAME_EVENT_TYPES.COMBAT_LOG:
        this.assertAllowed(actor, event.type);
        return this.addCombatLog({ ...payload, actorId: event.actorId, actorName: actor?.name || payload.actorName });
      case GAME_EVENT_TYPES.INITIATIVE_ROLL:
        return this.rollInitiative(payload, actor);
      case GAME_EVENT_TYPES.INITIATIVE_UPDATE:
        this.assertAllowed(actor, event.type);
        return this.updateInitiative(payload, actor);
      case GAME_EVENT_TYPES.TURN_NEXT:
        this.assertAllowed(actor, event.type);
        return this.nextTurn(actor);
      case GAME_EVENT_TYPES.SCENE_MAP_UPDATE:
      case GAME_EVENT_TYPES.SCENE_GRID_UPDATE:
      case GAME_EVENT_TYPES.SCENE_MEASUREMENT_CREATE:
      case GAME_EVENT_TYPES.SCENE_MEASUREMENT_CLEAR:
      case GAME_EVENT_TYPES.SCENE_AREA_CREATE:
      case GAME_EVENT_TYPES.SCENE_AREA_UPDATE:
      case GAME_EVENT_TYPES.SCENE_AREA_DELETE:
      case GAME_EVENT_TYPES.SCENE_VISIBILITY_UPDATE:
      case GAME_EVENT_TYPES.SCENE_OBJECTIVE_CREATE:
      case GAME_EVENT_TYPES.SCENE_OBJECTIVE_UPDATE:
      case GAME_EVENT_TYPES.SCENE_OBJECTIVE_DELETE:
        return this.applySceneEvent(event.type, payload, actor);
      case GAME_EVENT_TYPES.SCENE_UPDATE:
        this.assertAllowed(actor, event.type);
        this.scene.update(payload.patch || payload);
        this.addChatMessage({
          playerId: actor?.id || "",
          authorName: "Sistema Solaris",
          message: `${actor?.name || "Mestre"} atualizou a cena: ${this.scene.name}.`,
        });
        return this.scene;
      case GAME_EVENT_TYPES.TOKEN_MOVE:
        return this.applyTokenMove(payload, actor);
      default:
        if (CHARACTER_SYNC_EVENTS.has(event.type)) {
          return this.applyCharacterSyncEvent(event.type, payload, actor);
        }
        throw new Error(`Evento de mesa desconhecido: ${event.type}`);
    }
  }

  handlePlayerJoin(payload = {}) {
    const player = new PlayerConnection(payload.player || payload);
    const existing = this.getPlayer(player.id);
    if (existing) existing.touch({ online: true, latencyMs: player.latencyMs });
    else this.players.push(player);
    if (player.isGM && !this.hostPlayerId) this.hostPlayerId = player.id;
    return player;
  }

  handlePlayerLeave(playerId = "") {
    const player = this.getPlayer(playerId);
    if (player) player.touch({ online: false });
    return player;
  }

  addChatMessage(message = {}) {
    const chat = new ChatMessage(message);
    if (!chat.message.trim()) throw new Error("Mensagem vazia.");
    this.chat.push(chat);
    this.chat = this.chat.slice(-250);
    return chat;
  }

  addDiceRoll(roll = {}) {
    const diceRoll = new DiceRollEvent(roll);
    this.diceLog.unshift(diceRoll);
    this.diceLog = this.diceLog.slice(0, 250);
    this.addChatMessage({
      playerId: diceRoll.playerId,
      characterId: diceRoll.characterId,
      authorName: roll.authorName || this.getPlayer(diceRoll.playerId)?.name || "Sistema",
      message: `${diceRoll.label}: ${diceRoll.formula} = ${diceRoll.total}`,
    });
    return diceRoll;
  }

  buildCombatants() {
    return [
      ...this.characters.map((character) => {
        const snapshot = clone(character.snapshot) || {};
        return normalizeCombatant({
          id: character.id,
          entityId: character.id,
          entityType: "character",
          ownerPlayerId: character.ownerPlayerId,
          name: character.name,
          snapshot,
          conditions: character.conditions,
          portrait: snapshot.portrait || snapshot.photoDataUrl || "",
        });
      }),
      ...this.monsters.map((monster) => {
        const snapshot = clone(monster.snapshot) || {};
        return normalizeCombatant({
          id: monster.id,
          entityId: monster.id,
          entityType: "monster",
          name: monster.name,
          snapshot,
          conditions: monster.conditions,
          portrait: snapshot.imageDataUrl || snapshot.image || "",
          tier: snapshot.tier,
          type: snapshot.type,
          role: snapshot.role,
          attacks: snapshot.attacks,
          abilities: snapshot.abilities,
        });
      }),
    ];
  }

  syncCombatants() {
    for (const combatant of this.buildCombatants()) {
      const existing = this.combat.getCombatant(combatant.entityId);
      const synced = this.combat.upsertCombatant({
        ...combatant,
        initiative: existing?.initiative ?? combatant.initiative,
      });
      if (this.combat.active && !this.combat.entries.some((entry) => entry.entityId === synced.entityId)) {
        this.combat.updateEntry({
          entityType: synced.entityType,
          entityId: synced.entityId,
          name: synced.name,
          initiative: synced.initiative,
          actorId: synced.ownerPlayerId,
          ownerPlayerId: synced.ownerPlayerId,
          portrait: synced.portrait,
          currentPV: synced.currentPV,
          maxPV: synced.maxPV,
          ca: synced.ca,
          isDefeated: synced.isDefeated,
        });
      }
    }
    return this.combat.combatants;
  }

  buildSceneToken(entity, index = 0) {
    const isMonster = entity instanceof SharedMonster || entity.entityType === "monster";
    const snapshot = clone(entity.snapshot || {}) || {};
    const entityType = isMonster ? "monster" : "character";
    const entityId = entity.id || entity.entityId || snapshot.id || createId("entity");
    const columns = Math.max(4, this.scene.columns || 12);
    const rows = Math.max(4, this.scene.rows || 8);
    const x = isMonster
      ? Math.max(1, columns - 2 - (index % 2))
      : Math.min(columns, 2 + (index % 3));
    const y = isMonster
      ? Math.min(rows, 2 + index)
      : Math.min(rows, 3 + Math.floor(index / 3));
    return new MapToken({
      id: `token-${entityType}-${entityId}`,
      entityType,
      entityId,
      name: entity.name || snapshot.name || (isMonster ? "Monstro" : "Personagem"),
      x,
      y,
      size: numeric(snapshot.size, 1),
      image: snapshot.portrait || snapshot.photoDataUrl || snapshot.imageDataUrl || snapshot.image || "",
      color: isMonster ? "#ff4e63" : "#39cfff",
      hidden: Boolean(entity.hidden),
      metadata: {
        tier: snapshot.tier || "",
        role: snapshot.role || "",
        ca: snapshot.ca ?? snapshot.CA ?? "",
        movement: snapshot.movement ?? snapshot.movimento ?? "",
      },
    });
  }

  syncSceneTokens() {
    this.characters.forEach((character, index) => {
      const existing = this.scene.findTokenForEntity("character", character.id);
      if (existing) {
        existing.name = character.name;
        existing.image = character.snapshot?.portrait || character.snapshot?.photoDataUrl || existing.image;
        existing.hidden = false;
      } else {
        this.scene.upsertToken(this.buildSceneToken(character, index));
      }
    });
    this.monsters.forEach((monster, index) => {
      const existing = this.scene.findTokenForEntity("monster", monster.id);
      if (existing) {
        existing.name = monster.name;
        existing.image = monster.snapshot?.imageDataUrl || monster.snapshot?.image || existing.image;
        existing.hidden = Boolean(monster.hidden);
      } else {
        this.scene.upsertToken(this.buildSceneToken(monster, index));
      }
    });
    return this.scene.tokens;
  }

  addCombatLog(entry = {}) {
    const log = this.combat.addLog(entry);
    if (log.message) {
      this.addChatMessage({
        playerId: log.actorId,
        authorName: log.actorName || "Combate",
        message: log.message,
        visibility: "table",
      });
    }
    return log;
  }

  startCombat(payload = {}, actor = null) {
    this.syncSceneTokens();
    const combatants = arrayOf(payload.combatants).length ? payload.combatants : this.buildCombatants();
    const entries = arrayOf(payload.entries).length ? payload.entries : combatants.map((combatant) => ({
      entityType: combatant.entityType,
      entityId: combatant.entityId,
      name: combatant.name,
      initiative: combatant.initiative,
      actorId: combatant.ownerPlayerId,
      ownerPlayerId: combatant.ownerPlayerId,
      portrait: combatant.portrait,
      ca: combatant.ca,
      currentPV: combatant.currentPV,
      maxPV: combatant.maxPV,
      isDefeated: combatant.isDefeated,
    }));
    const tracker = this.combat.start(entries, combatants);
    this.addCombatLog({
      type: "combat:start",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mestre",
      message: "Combate iniciado.",
    });
    return tracker;
  }

  endCombat(actor = null) {
    const tracker = this.combat.end();
    this.addCombatLog({
      type: "combat:end",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mestre",
      message: "Combate encerrado.",
    });
    return tracker;
  }

  rollInitiative(payload = {}, actor = null) {
    const entityId = String(payload.entityId || payload.characterId || payload.monsterId || "");
    const combatant = this.combat.getCombatant(entityId)
      || this.buildCombatants().find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) throw new Error("Combatente nao encontrado para iniciativa.");
    this.assertAllowed(actor, GAME_EVENT_TYPES.INITIATIVE_ROLL, combatant);
    const sides = Math.max(2, Math.floor(numeric(payload.sides, 20)));
    const rolls = arrayOf(payload.rolls).length
      ? arrayOf(payload.rolls).map((roll) => Math.floor(numeric(roll, 0)))
      : [Math.floor(Math.random() * sides) + 1];
    const bonus = numeric(payload.bonus, 0);
    const total = numeric(payload.total, rolls.reduce((sum, roll) => sum + roll, 0) + bonus);
    this.combat.upsertCombatant({ ...combatant, initiative: total });
    const entry = this.combat.updateEntry({
      entityType: combatant.entityType,
      entityId: combatant.entityId,
      name: combatant.name,
      initiative: total,
      actorId: combatant.ownerPlayerId || actor?.id || "",
      ownerPlayerId: combatant.ownerPlayerId || "",
      portrait: combatant.portrait,
      ca: combatant.ca,
      currentPV: combatant.currentPV,
      maxPV: combatant.maxPV,
      isDefeated: combatant.isDefeated,
    });
    this.addDiceRoll({
      playerId: actor?.id || "",
      characterId: combatant.entityType === "character" ? combatant.entityId : "",
      authorName: actor?.name || combatant.name,
      label: `Iniciativa - ${combatant.name}`,
      formula: `1d${sides}${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ""}`,
      rolls,
      total,
    });
    return entry;
  }

  updateInitiative(payload = {}, actor = null) {
    const entry = payload.entry || payload;
    const resolved = this.combat.updateEntry(entry);
    this.addCombatLog({
      type: "initiative:update",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mestre",
      targetId: resolved.entityId,
      targetName: resolved.name,
      message: `Iniciativa de ${resolved.name}: ${resolved.initiative}.`,
    });
    return resolved;
  }

  nextTurn(actor = null) {
    const entry = this.combat.nextTurn();
    if (entry) {
      this.addCombatLog({
        type: "turn:next",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: entry.entityId,
        targetName: entry.name,
        message: `Turno de ${entry.name} (rodada ${this.combat.round}).`,
      });
    }
    return entry;
  }

  addTransaction(entry = {}) {
    const transaction = normalizeTransactionEntry(entry);
    this.transactionLog.unshift(transaction);
    this.transactionLog = this.transactionLog.slice(0, 160);
    if (transaction.message) {
      this.addChatMessage({
        playerId: transaction.actorId,
        authorName: "Sistema Solaris",
        message: transaction.message,
      });
    }
    return transaction;
  }

  updateShopCart(payload = {}, actor = null) {
    this.assertAllowed(actor, GAME_EVENT_TYPES.SHOP_CART_UPDATE);
    const playerId = actor?.id || payload.playerId || "local";
    this.shopState.carts[playerId] = {
      characterId: String(payload.characterId || ""),
      items: arrayOf(payload.items).map(normalizeCartLine),
      updatedAt: nowIso(),
    };
    this.shopState.updatedAt = nowIso();
    return this.shopState;
  }

  applySceneEvent(type, payload = {}, actor = null) {
    this.assertAllowed(actor, type);
    if (type === GAME_EVENT_TYPES.SCENE_MAP_UPDATE) {
      this.scene.update({
        mapImage: payload.mapImage || payload.image || "",
        name: payload.name ?? this.scene.name,
        notes: payload.notes ?? this.scene.notes,
      });
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `${actor?.name || "Mestre"} selecionou um mapa para a cena.`,
      });
      return this.scene;
    }
    if (type === GAME_EVENT_TYPES.SCENE_GRID_UPDATE) {
      this.scene.update(payload.patch || payload);
      return this.scene;
    }
    if (type === GAME_EVENT_TYPES.SCENE_MEASUREMENT_CREATE) {
      const measurement = this.scene.addMeasurement({
        ...payload.measurement,
        ...payload,
        ownerId: actor?.id || payload.ownerId || "",
      });
      return measurement;
    }
    if (type === GAME_EVENT_TYPES.SCENE_MEASUREMENT_CLEAR) {
      return this.scene.clearMeasurements();
    }
    if (type === GAME_EVENT_TYPES.SCENE_AREA_CREATE || type === GAME_EVENT_TYPES.SCENE_AREA_UPDATE) {
      const area = this.scene.upsertArea({
        ...payload.area,
        ...payload,
        ownerId: payload.ownerId || actor?.id || "",
      });
      return area;
    }
    if (type === GAME_EVENT_TYPES.SCENE_AREA_DELETE) {
      return this.scene.removeArea(payload.areaId || payload.id);
    }
    if (type === GAME_EVENT_TYPES.SCENE_VISIBILITY_UPDATE) {
      return this.scene.updateVisibility(payload);
    }
    if (type === GAME_EVENT_TYPES.SCENE_OBJECTIVE_CREATE || type === GAME_EVENT_TYPES.SCENE_OBJECTIVE_UPDATE) {
      return this.scene.upsertObjective(payload.objective || payload);
    }
    if (type === GAME_EVENT_TYPES.SCENE_OBJECTIVE_DELETE) {
      return this.scene.removeObjective(payload.objectiveId || payload.id);
    }
    return this.scene;
  }

  applyShopEvent(type, payload = {}, actor = null) {
    if ([GAME_EVENT_TYPES.SHOP_CATALOG_REQUEST, GAME_EVENT_TYPES.SHOP_CATALOG_STATE, GAME_EVENT_TYPES.SHOP_ITEM_DETAILS, GAME_EVENT_TYPES.SHOP_CART_STATE].includes(type)) {
      this.assertAllowed(actor, GAME_EVENT_TYPES.SHOP_CATALOG_REQUEST);
      return this.shopState;
    }
    if ([GAME_EVENT_TYPES.SHOP_CART_UPDATE, GAME_EVENT_TYPES.SHOP_CART_SUBMIT].includes(type)) return this.updateShopCart(payload, actor);
    if ([GAME_EVENT_TYPES.SHOP_PURCHASE_APPROVE, GAME_EVENT_TYPES.SHOP_SELL_APPROVE, GAME_EVENT_TYPES.SHOP_CART_APPROVE].includes(type)) {
      return this.applyApprovalEvent(GAME_EVENT_TYPES.APPROVAL_APPROVE, payload, actor);
    }
    if ([GAME_EVENT_TYPES.SHOP_PURCHASE_REJECT, GAME_EVENT_TYPES.SHOP_SELL_REJECT, GAME_EVENT_TYPES.SHOP_DELETE_REJECT, GAME_EVENT_TYPES.SHOP_CART_REJECT].includes(type)) {
      return this.applyApprovalEvent(GAME_EVENT_TYPES.APPROVAL_REJECT, payload, actor);
    }
    if (type === GAME_EVENT_TYPES.SHOP_DELETE_APPROVE) {
      return this.applyApprovalEvent(GAME_EVENT_TYPES.APPROVAL_APPROVE, payload, actor);
    }

    const character = this.getCharacter(payload.characterId || payload.targetCharacterId);
    if (!character) throw new Error("Personagem da transacao nao encontrado.");
    if (!actor?.isGM && character.ownerPlayerId !== actor?.id) {
      throw new Error("Jogador so pode solicitar transacoes para a propria ficha.");
    }

    if (type === GAME_EVENT_TYPES.SHOP_PURCHASE_REQUEST) {
      const items = arrayOf(payload.items).length
        ? arrayOf(payload.items).map(normalizeCartLine)
        : [normalizeCartLine({ item: payload.item || payload.itemSnapshot || payload, quantity: payload.quantity || 1, price: payload.price })];
      const total = Math.max(0, numeric(payload.total, items.reduce((sum, item) => sum + item.total, 0)));
      const requestPayload = {
        characterId: character.id,
        items,
        price: total,
        total,
        destination: payload.destination || payload.location || { kind: "unassigned" },
      };
      if (actor?.isGM || payload.direct === true) {
        return this.executeApprovedRequest({
          characterId: character.id,
          type: "purchase-cart",
          payload: requestPayload,
        }, actor);
      }
      return this.createApprovalRequest({
        requestedBy: actor?.id || "",
        characterId: character.id,
        type: "purchase-cart",
        payload: requestPayload,
        message: `Solicita compra de ${items.length} item(ns) por ${total} Luzentis.`,
      }, actor);
    }

    if (type === GAME_EVENT_TYPES.SHOP_SELL_REQUEST) {
      const itemId = payload.itemId || payload.uid || payload.id || payload.item?.uid || payload.item?.id;
      const saleValue = Math.max(0, numeric(payload.saleValue ?? payload.price, 0));
      if (actor?.isGM || payload.direct === true) {
        return this.executeApprovedRequest({
          characterId: character.id,
          type: "sell-item",
          payload: { characterId: character.id, itemId, item: payload.item, saleValue },
        }, actor);
      }
      return this.createApprovalRequest({
        requestedBy: actor?.id || "",
        characterId: character.id,
        type: "sell-item",
        payload: { characterId: character.id, itemId, item: payload.item, saleValue },
        message: `Solicita venda de ${payload.item?.name || itemId || "item"} por ${saleValue} Luzentis.`,
      }, actor);
    }

    if (type === GAME_EVENT_TYPES.SHOP_DELETE_REQUEST) {
      const itemId = payload.itemId || payload.uid || payload.id || payload.item?.uid || payload.item?.id;
      if (actor?.isGM || payload.direct === true) {
        return this.executeApprovedRequest({
          characterId: character.id,
          type: "delete-item",
          payload: { characterId: character.id, itemId, item: payload.item, deleteContents: payload.deleteContents },
        }, actor);
      }
      return this.createApprovalRequest({
        requestedBy: actor?.id || "",
        characterId: character.id,
        type: "delete-item",
        payload: { characterId: character.id, itemId, item: payload.item, deleteContents: payload.deleteContents },
        message: `Solicita exclusao de ${payload.item?.name || itemId || "item"}.`,
      }, actor);
    }

    return this.shopState;
  }

  applyLootEvent(type, payload = {}, actor = null) {
    if (type === GAME_EVENT_TYPES.LOOT_STATE) {
      this.assertAllowed(actor, GAME_EVENT_TYPES.LOOT_STATE);
      return this.lootPacks;
    }
    if (type === GAME_EVENT_TYPES.LOOT_CLAIM) {
      this.assertAllowed(actor, GAME_EVENT_TYPES.LOOT_CLAIM);
      const character = this.getCharacter(payload.characterId || payload.targetCharacterId);
      if (!character || (!actor?.isGM && character.ownerPlayerId !== actor?.id)) {
        throw new Error("Jogador so pode solicitar loot para a propria ficha.");
      }
      return this.createApprovalRequest({
        requestedBy: actor?.id || "",
        characterId: character.id,
        type: "loot-claim",
        payload: { ...payload, characterId: character.id },
        message: `Solicita receber loot: ${payload.packName || payload.lootPackId || "pacote"}.`,
      }, actor);
    }

    this.assertAllowed(actor, type);
    if (type === GAME_EVENT_TYPES.LOOT_MONSTER_DEFEATED) {
      return this.createLootFromMonster(payload.monsterId || payload.entityId || payload.id, actor);
    }
    if (type === GAME_EVENT_TYPES.LOOT_CREATE || type === GAME_EVENT_TYPES.LOOT_PACK_CREATE) {
      const pack = normalizeLootPack({
        ...payload.pack,
        ...payload,
        createdBy: actor?.id || payload.createdBy || "",
      });
      this.lootPacks.unshift(pack);
      this.lootPacks = this.lootPacks.slice(0, 80);
      this.addTransaction({
        type: "loot:create",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        status: "pending",
        message: `Loot criado: ${pack.name}.`,
      });
      return pack;
    }
    const packId = payload.lootPackId || payload.packId || payload.id;
    const pack = this.lootPacks.find((entry) => entry.id === packId);
    if (!pack) throw new Error("Pacote de loot nao encontrado.");
    if (type === GAME_EVENT_TYPES.LOOT_UPDATE || type === GAME_EVENT_TYPES.LOOT_PACK_UPDATE || type === GAME_EVENT_TYPES.LOOT_ASSIGN) {
      Object.assign(pack, normalizeLootPack({ ...pack, ...payload.patch, ...payload, id: pack.id, updatedAt: nowIso() }));
      return pack;
    }
    if (type === GAME_EVENT_TYPES.LOOT_DELETE) {
      this.lootPacks = this.lootPacks.filter((entry) => entry.id !== pack.id);
      this.addTransaction({
        type: "loot:delete",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        status: "deleted",
        message: `Loot cancelado: ${pack.name}.`,
      });
      return pack;
    }
    if (type === GAME_EVENT_TYPES.LOOT_DISTRIBUTE || type === GAME_EVENT_TYPES.LOOT_PACK_DISTRIBUTE) {
      const character = this.getCharacter(payload.characterId || payload.targetCharacterId || pack.assignedTo);
      if (!character) throw new Error("Personagem destino do loot nao encontrado.");
      const result = this.distributeLootPack(pack, character, actor, payload);
      return result;
    }
    return pack;
  }

  distributeLootPack(pack, character, actor = null, payload = {}) {
    const snapshot = normalizeSheetSnapshot(character.snapshot);
    const selectedItems = arrayOf(payload.items).length ? arrayOf(payload.items).map(normalizeCartLine) : pack.items;
    const destination = payload.destination || payload.location || { kind: "unassigned" };
    const instances = inventoryInstancesFromCart(selectedItems, destination);
    snapshot.inventory = uniqueById([...snapshot.inventory, ...instances]);
    const luzentis = Math.max(0, numeric(payload.luzentis ?? pack.luzentis, 0));
    if (luzentis > 0) updateCurrency(snapshot, luzentis);
    character.update(snapshot, { full: true });
    pack.status = "distributed";
    pack.assignedTo = character.id;
    pack.updatedAt = nowIso();
    this.syncCombatants();
    this.addTransaction({
      type: "loot:distribute",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mestre",
      characterId: character.id,
      targetCharacterId: character.id,
      quantity: instances.length,
      price: luzentis,
      status: "completed",
      resolvedAt: nowIso(),
      resolvedBy: actor?.id || "",
      message: `${actor?.name || "Mestre"} entregou ${pack.name} para ${character.name}.`,
    });
    return { pack, character, items: instances };
  }

  createLootFromMonster(monsterId = "", actor = null) {
    const monster = this.getMonster(monsterId);
    if (!monster) throw new Error("Monstro da sessao nao encontrado.");
    const snapshot = clone(monster.snapshot) || {};
    if (snapshot.lootPackId && this.lootPacks.some((pack) => pack.id === snapshot.lootPackId)) {
      return this.lootPacks.find((pack) => pack.id === snapshot.lootPackId);
    }
    const rawLoot = arrayOf(snapshot.loot || snapshot.lootTable || snapshot.drops || snapshot.rewards);
    const items = rawLoot.map((entry) => normalizeCartLine({
      item: entry.item || entry,
      quantity: entry.quantity || entry.qty || 1,
      price: entry.price || 0,
    }));
    const pack = normalizeLootPack({
      name: `Loot pendente - ${monster.name}`,
      source: monster.name,
      items,
      luzentis: Math.max(0, numeric(snapshot.luzentis || snapshot.credits || snapshot.currency, 0)),
      notes: items.length ? "Criado automaticamente ao derrotar a criatura." : "Pacote vazio criado automaticamente; mestre define recompensas.",
      createdBy: actor?.id || "",
    });
    monster.snapshot.lootPackId = pack.id;
    this.lootPacks.unshift(pack);
    this.lootPacks = this.lootPacks.slice(0, 80);
    this.addTransaction({
      type: "loot:monster:defeated",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mestre",
      status: "pending",
      message: `Loot pendente criado para ${monster.name}.`,
    });
    return pack;
  }

  getApproval(approvalId = "") {
    return this.approvals.find((approval) => approval.id === approvalId) || null;
  }

  createApprovalRequest({ requestedBy = "", characterId = "", type = "", payload = {}, message = "" } = {}, actor = null) {
    this.assertAllowed(actor, GAME_EVENT_TYPES.APPROVAL_REQUEST);
    const character = this.getCharacter(characterId);
    if (character && !actor?.isGM && character.ownerPlayerId !== actor?.id) {
      throw new Error("Jogador so pode solicitar alteracoes para a propria ficha.");
    }
    const approval = new ApprovalRequest({
      requestedBy: requestedBy || actor?.id || "",
      characterId,
      type,
      payload,
      message: message || approvalMessageForType(type, payload),
    });
    this.approvals.unshift(approval);
    this.approvals = this.approvals.slice(0, 80);
    this.addChatMessage({
      playerId: actor?.id || "",
      authorName: "Sistema Solaris",
      message: `${actor?.name || "Jogador"} enviou pedido ao mestre: ${approval.message}`,
    });
    return approval;
  }

  applyApprovalEvent(type, payload = {}, actor = null) {
    if (type === GAME_EVENT_TYPES.APPROVAL_STATE) return this.approvals;
    if (type === GAME_EVENT_TYPES.APPROVAL_REQUEST) {
      return this.createApprovalRequest({
        requestedBy: payload.requestedBy || actor?.id || "",
        characterId: payload.characterId || payload.payload?.characterId || "",
        type: payload.type || "",
        payload: payload.payload || {},
        message: payload.message || "",
      }, actor);
    }
    this.assertAllowed(actor, type);
    const approval = this.getApproval(payload.id || payload.approvalId);
    if (!approval) throw new Error("Pedido de aprovacao nao encontrado.");
    if (approval.status !== APPROVAL_STATUSES.PENDING) return approval;
    if (type === GAME_EVENT_TYPES.APPROVAL_REJECT) {
      approval.reject(actor?.id || "", payload.message || "");
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `${actor?.name || "Mestre"} rejeitou: ${approval.message}`,
      });
      return approval;
    }
    const result = this.executeApprovedRequest(approval, actor);
    approval.approve(actor?.id || "");
    this.addChatMessage({
      playerId: actor?.id || "",
      authorName: "Sistema Solaris",
      message: `${actor?.name || "Mestre"} aprovou: ${approval.message}`,
    });
    return result || approval;
  }

  executeApprovedRequest(approval, actor = null) {
    const payload = clone(approval.payload) || {};
    const character = this.getCharacter(approval.characterId || payload.characterId);
    if (!character) throw new Error("Personagem da aprovacao nao encontrado.");
    const type = approval.type;
    if (type === "purchase-item" || type === "purchase-cart") {
      const items = type === "purchase-cart"
        ? arrayOf(payload.items).map(normalizeCartLine)
        : [normalizeCartLine({ item: payload.item || { name: payload.itemName || "Item comprado" }, quantity: payload.quantity || 1, price: payload.price })];
      const instances = inventoryInstancesFromCart(items, payload.destination || payload.location || { kind: "unassigned" });
      const price = Math.max(0, numeric(payload.price ?? payload.total, items.reduce((sum, line) => sum + line.total, 0)));
      const snapshot = normalizeSheetSnapshot(character.snapshot);
      const currentMoney = numeric(snapshot.currency ?? snapshot.luzentis, 0);
      if (currentMoney < price) throw new Error("Luzentis insuficientes para aprovar a compra.");
      updateCurrency(snapshot, -price);
      snapshot.inventory = uniqueById([...snapshot.inventory, ...instances]);
      character.update(snapshot, { full: true });
      this.syncCombatants();
      this.addTransaction({
        type: "purchase",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        characterId: character.id,
        targetCharacterId: character.id,
        itemId: instances[0]?.id || "",
        itemSnapshot: instances[0] || null,
        quantity: instances.length,
        price,
        status: "completed",
        resolvedAt: nowIso(),
        resolvedBy: actor?.id || "",
        message: `${actor?.name || "Mestre"} aprovou compra de ${instances.length} item(ns) para ${character.name}.`,
      });
      return character;
    }
    if (type === "sell-item" || type === "delete-item") {
      const itemId = payload.itemId || payload.uid || payload.id || itemIdOf(payload.item || {});
      const snapshot = normalizeSheetSnapshot(character.snapshot);
      const item = snapshot.inventory.find((entry) => matchItem(entry, itemId)) || payload.item || {};
      snapshot.inventory = snapshot.inventory.filter((entry) => !matchItem(entry, itemId));
      if (type === "sell-item") updateCurrency(snapshot, Math.max(0, numeric(payload.saleValue ?? payload.price ?? item.price, 0)));
      character.update(snapshot, { full: true });
      this.syncCombatants();
      this.addTransaction({
        type: type === "sell-item" ? "sell" : "delete",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        characterId: character.id,
        targetCharacterId: character.id,
        itemId,
        itemSnapshot: item,
        quantity: 1,
        price: type === "sell-item" ? Math.max(0, numeric(payload.saleValue ?? payload.price ?? item.price, 0)) : 0,
        status: "completed",
        resolvedAt: nowIso(),
        resolvedBy: actor?.id || "",
        message: type === "sell-item"
          ? `${actor?.name || "Mestre"} aprovou venda de ${item.name || "item"} por ${Math.max(0, numeric(payload.saleValue ?? payload.price ?? item.price, 0))} Luzentis.`
          : `${actor?.name || "Mestre"} aprovou exclusao de ${item.name || "item"}.`,
      });
      return character;
    }
    if (type === "loot-claim") {
      const pack = this.lootPacks.find((entry) => entry.id === (payload.lootPackId || payload.packId || payload.id));
      if (!pack) throw new Error("Pacote de loot nao encontrado.");
      return this.distributeLootPack(pack, character, actor, payload);
    }
    if (CHARACTER_SYNC_EVENTS.has(type)) {
      return this.applyCharacterSyncEvent(type, { ...payload, characterId: character.id, approved: true }, actor, { approved: true });
    }
    return approval;
  }

  requestCharacterSync(payload = {}, actor = null) {
    const character = this.getCharacter(payload.characterId || payload.id);
    if (!character) throw new Error("Personagem da sessao nao encontrado.");
    this.assertAllowed(actor, GAME_EVENT_TYPES.CHARACTER_SYNC_REQUEST, character);
    return character;
  }

  applyCharacterSyncEvent(type, payload = {}, actor = null, options = {}) {
    const character = this.getCharacter(payload.characterId || payload.id);
    if (!character) throw new Error("Personagem da sessao nao encontrado.");
    this.assertAllowed(actor, type, character);
    if (!options.approved && characterEventRequiresApproval(type, payload, this, actor)) {
      return this.createApprovalRequest({
        requestedBy: actor?.id || "",
        characterId: character.id,
        type,
        payload,
      }, actor);
    }
    const result = this.applyCharacterSheetMutation(character, type, payload, actor);
    this.syncCombatants();
    this.syncSceneTokens();
    if (IMPORTANT_CHARACTER_EVENTS.has(type)) {
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: messageForCharacterChange(type, character, payload, actor),
      });
    }
    return result;
  }

  applyCharacterSheetMutation(character, type, payload = {}, actor = null) {
    if ([
      GAME_EVENT_TYPES.CHARACTER_UPDATE,
      GAME_EVENT_TYPES.CHARACTER_DAMAGE,
      GAME_EVENT_TYPES.CHARACTER_HEAL,
      GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD,
      GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE,
    ].includes(type)) {
      return this.applyCharacterEvent(type, payload, actor, { alreadyAllowed: true });
    }
    const revision = payload.revision
      ?? payload.patch?.revision
      ?? payload.sheet?.revision
      ?? payload.snapshot?.revision
      ?? 0;
    if (character.shouldIgnoreRevision(Math.floor(numeric(revision, 0)))) return character;
    const snapshot = normalizeSheetSnapshot(character.snapshot);
    const referenceItem = payload.item || payload.spell || payload.chip || payload.ability || {};
    const item = normalizeInventoryItem(referenceItem);
    const itemId = payload.itemId
      || payload.spellId
      || payload.chipId
      || payload.abilityId
      || payload.uid
      || payload.id
      || itemIdOf(referenceItem)
      || itemIdOf(item);
    switch (type) {
      case GAME_EVENT_TYPES.CHARACTER_SHEET_UPDATE:
        return character.update(payload.patch || payload.sheet || payload.snapshot || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_SYNC_FULL:
        return character.update(payload.sheet || payload.snapshot || payload.patch || payload, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ATTRIBUTES_UPDATE:
        return character.updateSection("attributes", payload.attributes || payload.patch || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_DERIVED_UPDATE:
        return character.updateSection("derived", payload.derived || payload.patch || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_EQUIPMENT_UPDATE:
        return character.updateSection("equipment", payload.equipment || payload.patch || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_INVENTORY_UPDATE:
        return character.updateSection("inventory", arrayOf(payload.inventory || payload.items).map(normalizeInventoryItem), { revision });
      case GAME_EVENT_TYPES.CHARACTER_WEAPON_UPDATE:
        return character.updateSection("equipment.weapon", payload.weapon || payload.patch || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_ARMOR_UPDATE:
        return character.updateSection("equipment.armor", payload.armor || payload.patch || payload, { revision });
      case GAME_EVENT_TYPES.CHARACTER_CUBE_UPDATE:
        return character.updateSection("cubes", arrayOf(payload.cubes || payload.items).map(normalizeInventoryItem), { revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_ADD:
        snapshot.inventory = uniqueById([...snapshot.inventory, item]);
        if (["purchase", "buy"].includes(String(payload.reason || payload.transaction || "").toLowerCase())) {
          updateCurrency(snapshot, -Math.max(0, numeric(payload.price ?? item.price, 0)));
        }
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_REMOVE:
        snapshot.inventory = snapshot.inventory.filter((entry) => !matchItem(entry, itemId));
        if (String(payload.reason || "").toLowerCase() === "sell") {
          updateCurrency(snapshot, Math.max(0, numeric(payload.saleValue ?? payload.price ?? item.price, 0)));
        }
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_MOVE:
        snapshot.inventory = snapshot.inventory.map((entry) => matchItem(entry, itemId)
          ? { ...entry, location: clone(payload.location || { kind: "unassigned" }) }
          : entry);
        snapshot.unassignedItems = snapshot.inventory.filter((entry) => entry.location?.kind === "unassigned");
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_EQUIP:
        snapshot.inventory = snapshot.inventory.map((entry) => matchItem(entry, itemId)
          ? { ...entry, location: clone(payload.location || { kind: "equipped", slotId: payload.slotId || payload.slot || "main" }) }
          : entry);
        snapshot.equipment = {
          ...snapshot.equipment,
          [payload.slot || payload.slotId || item.category || "item"]: payload.item || item,
        };
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_UNEQUIP:
        snapshot.inventory = snapshot.inventory.map((entry) => matchItem(entry, itemId)
          ? { ...entry, location: clone(payload.location || { kind: "unassigned" }) }
          : entry);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ITEM_USE:
        snapshot.inventory = snapshot.inventory.flatMap((entry) => {
          if (!matchItem(entry, itemId)) return [entry];
          const charges = entry.charges ?? entry.quantity ?? payload.charges;
          if (entry.consumable || payload.consumable) {
            const nextCharges = Math.max(0, numeric(charges, 1) - 1);
            if (nextCharges <= 0) return [];
            return [{ ...entry, charges: nextCharges, quantity: nextCharges }];
          }
          return [{ ...entry, lastUsedAt: nowIso() }];
        });
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_SPELL_ADD:
        snapshot.cosmicSpells = uniqueById([...snapshot.cosmicSpells, payload.spell || payload.item || payload]);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_SPELL_REMOVE:
        snapshot.cosmicSpells = snapshot.cosmicSpells.filter((entry) => !matchItem(entry, itemId));
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_CHIP_ADD:
        snapshot.modifierChips = uniqueById([...snapshot.modifierChips, payload.chip || payload.item || payload]);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_CHIP_REMOVE:
        snapshot.modifierChips = snapshot.modifierChips.filter((entry) => !matchItem(entry, itemId));
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_CHIP_INSTALL:
        snapshot.modifierChips = uniqueById([...snapshot.modifierChips, { ...(payload.chip || payload.item || payload), installed: true }]);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_CHIP_UNINSTALL:
        snapshot.modifierChips = snapshot.modifierChips.map((entry) => matchItem(entry, itemId) ? { ...entry, installed: false } : entry);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ABILITY_ADD:
        snapshot.abilities = uniqueById([...snapshot.abilities, payload.ability || payload.item || payload]);
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_ABILITY_REMOVE:
        snapshot.abilities = snapshot.abilities.filter((entry) => !matchItem(entry, itemId));
        return character.update(snapshot, { full: true, revision });
      case GAME_EVENT_TYPES.CHARACTER_CONDITION_UPDATE:
        snapshot.conditions = normalizeConditions(payload.conditions || snapshot.conditions.map((condition) =>
          condition.id === payload.conditionId ? { ...condition, ...(payload.patch || payload.condition || {}) } : condition
        ));
        return character.update(snapshot, { full: true, revision });
      default:
        return character.update(payload.patch || payload, { revision });
    }
  }

  applyCharacterEvent(type, payload = {}, actor = null, options = {}) {
    const character = this.getCharacter(payload.characterId);
    if (!character) throw new Error("Personagem da sessao nao encontrado.");
    if (!options.alreadyAllowed) this.assertAllowed(actor, type, character);
    if (type === GAME_EVENT_TYPES.CHARACTER_UPDATE) {
      const updated = character.update(payload.patch || {});
      this.syncCombatants();
      return updated;
    }
    if (type === GAME_EVENT_TYPES.CHARACTER_DAMAGE) {
      const current = character.applyDamage(payload.amount);
      this.syncCombatants();
      this.addCombatLog({
        type: "damage",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mesa",
        targetId: character.id,
        targetName: character.name,
        message: `${character.name} sofreu ${Math.max(0, numeric(payload.amount, 0))} de dano.`,
      });
      return current;
    }
    if (type === GAME_EVENT_TYPES.CHARACTER_HEAL) {
      const current = character.heal(payload.amount);
      this.syncCombatants();
      this.addCombatLog({
        type: "heal",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mesa",
        targetId: character.id,
        targetName: character.name,
        message: `${character.name} recuperou ${Math.max(0, numeric(payload.amount, 0))} PV.`,
      });
      return current;
    }
    if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_ADD) {
      const condition = character.addCondition(payload.condition || {});
      this.syncCombatants();
      this.addCombatLog({
        type: "condition:add",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mesa",
        targetId: character.id,
        targetName: character.name,
        message: `${character.name} recebeu a condicao ${condition.label}.`,
      });
      return condition;
    }
    if (type === GAME_EVENT_TYPES.CHARACTER_CONDITION_REMOVE) {
      const result = character.removeCondition(payload.conditionId);
      this.syncCombatants();
      return result;
    }
    return character;
  }

  applyMonsterEvent(type, payload = {}, actor = null) {
    if (type === GAME_EVENT_TYPES.MONSTER_CREATE) {
      const monster = new SharedMonster(payload.monster || payload);
      this.monsters.push(monster);
      this.syncCombatants();
      this.syncSceneTokens();
      this.addCombatLog({
        type: "monster:create",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} entrou na cena.`,
      });
      return monster;
    }
    const monster = this.getMonster(payload.monsterId);
    if (!monster) throw new Error("Monstro da sessao nao encontrado.");
    if (type === GAME_EVENT_TYPES.MONSTER_UPDATE) {
      const updated = monster.update(payload.patch || {});
      this.syncCombatants();
      return updated;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_DELETE) {
      this.monsters = this.monsters.filter((entry) => entry.id !== monster.id);
      this.combat.removeCombatant(monster.id);
      const token = this.scene.findTokenForEntity("monster", monster.id);
      if (token) this.scene.removeToken(token.id);
      this.addCombatLog({
        type: "monster:delete",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} saiu da cena.`,
      });
      return monster;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_DAMAGE) {
      const current = monster.applyDamage(payload.amount);
      this.syncCombatants();
      this.addCombatLog({
        type: "damage",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} sofreu ${Math.max(0, numeric(payload.amount, 0))} de dano.`,
      });
      if (current <= 0) this.createLootFromMonster(monster.id, actor);
      return current;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_HEAL) {
      const current = monster.heal(payload.amount);
      this.syncCombatants();
      this.addCombatLog({
        type: "heal",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} recuperou ${Math.max(0, numeric(payload.amount, 0))} PV.`,
      });
      return current;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_CONDITION_ADD) {
      const condition = monster.addCondition(payload.condition || {});
      this.syncCombatants();
      this.addCombatLog({
        type: "condition:add",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} recebeu a condicao ${condition.label}.`,
      });
      return condition;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_CONDITION_REMOVE) {
      const result = monster.removeCondition(payload.conditionId);
      this.syncCombatants();
      return result;
    }
    return monster;
  }

  applyTokenMove(payload = {}, actor = null) {
    const token = this.scene.tokens.find((entry) => entry.id === payload.tokenId);
    if (!token) throw new Error("Token nao encontrado.");
    const character = token.entityType === "character" ? this.getCharacter(token.entityId) : null;
    this.assertAllowed(actor, GAME_EVENT_TYPES.TOKEN_MOVE, {
      ...token,
      ownerPlayerId: character?.ownerPlayerId || "",
    });
    const movement = this.scene.movementPreview(payload.tokenId, payload.x, payload.y);
    const moved = this.scene.moveToken(payload.tokenId, payload.x, payload.y);
    moved.metadata = { ...(moved.metadata || {}), lastMove: movement };
    const label = `${String.fromCharCode(64 + Math.max(1, Math.floor(moved.x)))}${Math.max(1, Math.floor(moved.y))}`;
    const warning = movement?.exceedsMovement
      ? ` Movimento excede o MOV do personagem (${movement.meters}m > ${movement.movement}m).`
      : "";
    this.addCombatLog({
      type: "token:move",
      actorId: actor?.id || "",
      actorName: actor?.name || "Mesa",
      targetId: moved.entityId,
      targetName: moved.name,
      message: `${actor?.name || "Mesa"} moveu ${moved.name} para ${label}.${warning}`,
    });
    return moved;
  }

  sceneForPlayer(playerId = "") {
    const actor = this.getPlayer(playerId);
    const scene = this.scene.toJSON();
    if (actor?.isGM) return scene;
    const visible = (entry) => !entry.hidden && entry.visibleToPlayers !== false;
    return {
      ...scene,
      tokens: scene.tokens.filter(visible),
      zones: scene.zones.filter(visible),
      areas: scene.areas.filter(visible),
      measurements: scene.measurements.filter(visible),
      objectives: scene.objectives.filter(visible),
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      system: this.system,
      accessCode: this.accessCode,
      hostPlayerId: this.hostPlayerId,
      players: this.players.map((player) => player.toJSON()),
      characters: this.characters.map((character) => character.toJSON()),
      monsters: this.monsters.map((monster) => monster.toJSON()),
      scene: this.scene.toJSON(),
      combat: this.combat.toJSON(),
      chat: this.chat.map((message) => message.toJSON()),
      diceLog: this.diceLog.map((roll) => roll.toJSON()),
      approvals: this.approvals.map((approval) => approval.toJSON()),
      pendingApprovals: this.approvals.filter((approval) => approval.status === APPROVAL_STATUSES.PENDING).map((approval) => approval.toJSON()),
      shopState: clone(this.shopState),
      lootPacks: this.lootPacks.map((pack) => clone(pack)),
      transactionLog: this.transactionLog.map((transaction) => clone(transaction)),
      events: this.events.map((event) => event.toJSON()),
      sequence: this.sequence,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data = {}) {
    return new GameRoom(data);
  }
}
