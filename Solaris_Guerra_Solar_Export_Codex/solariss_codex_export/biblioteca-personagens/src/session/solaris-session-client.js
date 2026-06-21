export const SESSION_SOCKET_EVENTS = Object.freeze({
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_STATE: "room:state",
  PLAYER_JOIN: "player:join",
  PLAYER_LEAVE: "player:leave",
  CHAT_MESSAGE: "chat:message",
  DICE_ROLL: "dice:roll",
  CHARACTER_RESOURCES_UPDATE: "character:resources:update",
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
  CAMPAIGN_CREATE: "campaign:create",
  CAMPAIGN_UPDATE: "campaign:update",
  CAMPAIGN_DELETE: "campaign:delete",
  CAMPAIGN_LIST: "campaign:list",
  CAMPAIGN_LOAD: "campaign:load",
  SESSION_SAVE: "session:save",
  SESSION_LOAD: "session:load",
  SESSION_EXPORT: "session:export",
  SESSION_IMPORT: "session:import",
  SESSION_AUTOSAVE: "session:autosave",
  SESSION_SNAPSHOT_CREATE: "session:snapshot:create",
  SESSION_SNAPSHOT_RESTORE: "session:snapshot:restore",
  SESSION_RESTORE_AVAILABLE: "session:restore:available",
  GM_DASHBOARD_STATE: "gm:dashboard:state",
  GM_NOTE_CREATE: "gm:note:create",
  GM_NOTE_UPDATE: "gm:note:update",
  GM_NOTE_DELETE: "gm:note:delete",
  GM_NOTE_REVEAL: "gm:note:reveal",
  GM_COUNTER_CREATE: "gm:counter:create",
  GM_COUNTER_UPDATE: "gm:counter:update",
  GM_COUNTER_DELETE: "gm:counter:delete",
  GM_COUNTER_TICK: "gm:counter:tick",
  GM_COUNTER_REVEAL: "gm:counter:reveal",
  GM_ENVIRONMENT_CREATE: "gm:environment:create",
  GM_ENVIRONMENT_UPDATE: "gm:environment:update",
  GM_ENVIRONMENT_DELETE: "gm:environment:delete",
  GM_SCENE_CREATE: "gm:scene:create",
  GM_SCENE_UPDATE: "gm:scene:update",
  GM_SCENE_DELETE: "gm:scene:delete",
  GM_SCENE_SWITCH: "gm:scene:switch",
  GM_ENCOUNTER_CREATE: "gm:encounter:create",
  GM_ENCOUNTER_UPDATE: "gm:encounter:update",
  GM_ENCOUNTER_DELETE: "gm:encounter:delete",
  GM_ENCOUNTER_START: "gm:encounter:start",
  GM_ENCOUNTER_COMPLETE: "gm:encounter:complete",
  GM_ENCOUNTER_GENERATE: "gm:encounter:generate",
  GM_SHIELD_SEARCH: "gm:shield:search",
  GM_SHIELD_PIN: "gm:shield:pin",
  GM_SHIELD_SEND_TO_CHAT: "gm:shield:send-to-chat",
  GM_REPORT_EXPORT: "gm:report:export",
  GM_REPORT_SAVE: "gm:report:save",
  ERROR: "error",
});

function defaultSocketUrl() {
  if (typeof window === "undefined" || !["http:", "https:"].includes(window.location.protocol)) return "";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

function createId(prefix = "client") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export class SolarisSessionClient extends EventTarget {
  constructor({
    url = defaultSocketUrl(),
    playerId = createId("player"),
    playerName = "Jogador Solaris",
    connectTimeoutMs = 1400,
  } = {}) {
    super();
    this.url = url;
    this.playerId = playerId;
    this.playerName = playerName;
    this.connectTimeoutMs = connectTimeoutMs;
    this.socket = null;
    this.connected = false;
    this.room = null;
    this.lastError = "";
  }

  get isConnected() {
    return Boolean(this.connected && this.socket?.readyState === WebSocket.OPEN);
  }

  async connect() {
    if (!this.url || typeof WebSocket === "undefined") {
      this.setConnection(false, "WebSocket indisponivel neste modo.");
      return false;
    }
    if (this.isConnected) return true;

    return new Promise((resolve) => {
      let settled = false;
      const socket = new WebSocket(this.url);
      this.socket = socket;
      const timeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        try {
          socket.close();
        } catch {}
        this.setConnection(false, "Servidor da mesa nao encontrado.");
        resolve(false);
      }, this.connectTimeoutMs);

      socket.addEventListener("open", () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        this.setConnection(true, "");
        resolve(true);
      });

      socket.addEventListener("message", (event) => this.handleMessage(event.data));
      socket.addEventListener("error", () => {
        this.lastError = "Falha na conexao com o servidor da mesa.";
        this.emit(SESSION_SOCKET_EVENTS.ERROR, { message: this.lastError });
      });
      socket.addEventListener("close", () => {
        window.clearTimeout(timeout);
        this.setConnection(false, this.lastError);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {}
    }
    this.socket = null;
    this.room = null;
    this.setConnection(false, "");
  }

  setPlayer({ id = this.playerId, name = this.playerName } = {}) {
    this.playerId = String(id || this.playerId);
    this.playerName = String(name || this.playerName);
  }

  createRoom({ roomName = "Colonia Solaris-7", character = null } = {}) {
    return this.send(SESSION_SOCKET_EVENTS.ROOM_CREATE, {
      roomName,
      player: this.localPlayer("gm"),
      character,
    });
  }

  joinRoom({ roomId = "", roomName = "Colonia Solaris-7", character = null } = {}) {
    return this.send(SESSION_SOCKET_EVENTS.ROOM_JOIN, {
      roomId,
      roomName,
      player: this.localPlayer("player"),
      character,
    });
  }

  sendChat(message) {
    return this.send(SESSION_SOCKET_EVENTS.CHAT_MESSAGE, {
      message: String(message || ""),
    });
  }

  sendDiceRoll(roll) {
    return this.send(SESSION_SOCKET_EVENTS.DICE_ROLL, clone(roll));
  }

  updateCharacterResources(characterId, resources) {
    return this.send(SESSION_SOCKET_EVENTS.CHARACTER_RESOURCES_UPDATE, {
      characterId,
      resources: clone(resources),
    });
  }

  sendCharacterEvent(type, payload = {}) {
    return this.send(type, clone(payload));
  }

  syncFullCharacter(characterId = "", snapshot = {}) {
    return this.send(SESSION_SOCKET_EVENTS.CHARACTER_SYNC_FULL, {
      characterId,
      snapshot: clone(snapshot),
      revision: Number(snapshot.revision || 0),
    });
  }

  sendFullCharacterSync(character = {}) {
    const snapshot = clone(character) || {};
    return this.syncFullCharacter(snapshot.characterId || snapshot.id || "", snapshot);
  }

  requestCharacterSync(characterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.CHARACTER_SYNC_REQUEST, { characterId });
  }

  updateCharacterSheet(characterId = "", patch = {}, revision = patch.revision || 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_SHEET_UPDATE, { characterId, patch: clone(patch), revision });
  }

  updateCharacterAttributes(characterId = "", attributes = {}, revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ATTRIBUTES_UPDATE, { characterId, attributes, revision });
  }

  updateCharacterDerived(characterId = "", derived = {}, revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_DERIVED_UPDATE, { characterId, derived, revision });
  }

  updateCharacterEquipment(characterId = "", equipment = {}, revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_EQUIPMENT_UPDATE, { characterId, equipment, revision });
  }

  updateCharacterInventory(characterId = "", inventory = [], revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_INVENTORY_UPDATE, { characterId, inventory, revision });
  }

  addCharacterItem(characterId = "", item = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_ADD, { characterId, item: clone(item), ...clone(extra) });
  }

  removeCharacterItem(characterId = "", itemId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_REMOVE, { characterId, itemId, ...clone(extra) });
  }

  moveCharacterItem(characterId = "", itemId = "", location = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_MOVE, { characterId, itemId, location: clone(location), ...clone(extra) });
  }

  equipCharacterItem(characterId = "", itemId = "", itemOrSlot = "main", slotId = "", extra = {}) {
    const item = typeof itemOrSlot === "string" ? {} : clone(itemOrSlot);
    const slot = typeof itemOrSlot === "string" ? itemOrSlot : (slotId || extra.slot || "main");
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_EQUIP, {
      characterId,
      itemId,
      item,
      slot,
      slotId: slot,
      ...clone(extra),
    });
  }

  unequipCharacterItem(characterId = "", itemId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_UNEQUIP, { characterId, itemId, ...clone(extra) });
  }

  useCharacterItem(characterId = "", itemId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ITEM_USE, { characterId, itemId, ...clone(extra) });
  }

  updateCharacterWeapon(characterId = "", weapon = {}, revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_WEAPON_UPDATE, { characterId, weapon: clone(weapon), revision });
  }

  updateCharacterArmor(characterId = "", armor = {}, revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ARMOR_UPDATE, { characterId, armor: clone(armor), revision });
  }

  updateCharacterCubes(characterId = "", cubes = [], revision = 0) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CUBE_UPDATE, { characterId, cubes: clone(cubes), revision });
  }

  addCharacterSpell(characterId = "", spell = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_SPELL_ADD, { characterId, spell: clone(spell), ...clone(extra) });
  }

  removeCharacterSpell(characterId = "", spellId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_SPELL_REMOVE, { characterId, spellId, ...clone(extra) });
  }

  addCharacterChip(characterId = "", chip = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CHIP_ADD, { characterId, chip: clone(chip), ...clone(extra) });
  }

  removeCharacterChip(characterId = "", chipId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CHIP_REMOVE, { characterId, chipId, ...clone(extra) });
  }

  installCharacterChip(characterId = "", chipId = "", targetId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CHIP_INSTALL, { characterId, chipId, targetId, ...clone(extra) });
  }

  uninstallCharacterChip(characterId = "", chipId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CHIP_UNINSTALL, { characterId, chipId, ...clone(extra) });
  }

  addCharacterAbility(characterId = "", ability = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ABILITY_ADD, { characterId, ability: clone(ability), ...clone(extra) });
  }

  removeCharacterAbility(characterId = "", abilityId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_ABILITY_REMOVE, { characterId, abilityId, ...clone(extra) });
  }

  addCharacterCondition(characterId = "", condition = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CONDITION_ADD, { characterId, condition: clone(condition), ...clone(extra) });
  }

  removeCharacterCondition(characterId = "", conditionId = "", extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CONDITION_REMOVE, { characterId, conditionId, ...clone(extra) });
  }

  updateCharacterCondition(characterId = "", conditionId = "", patch = {}, extra = {}) {
    return this.sendCharacterEvent(SESSION_SOCKET_EVENTS.CHARACTER_CONDITION_UPDATE, { characterId, conditionId, patch: clone(patch), ...clone(extra) });
  }

  requestApproval({ characterId = "", type = "", payload = {}, message = "" } = {}) {
    return this.send(SESSION_SOCKET_EVENTS.APPROVAL_REQUEST, {
      characterId,
      type,
      payload: clone(payload),
      message,
    });
  }

  requestApprovalState() {
    return this.send(SESSION_SOCKET_EVENTS.APPROVAL_STATE, {});
  }

  approveApproval(approvalId = "") {
    return this.send(SESSION_SOCKET_EVENTS.APPROVAL_APPROVE, { approvalId });
  }

  rejectApproval(approvalId = "", message = "") {
    return this.send(SESSION_SOCKET_EVENTS.APPROVAL_REJECT, { approvalId, message });
  }

  approveRequest(requestId = "") {
    return this.approveApproval(requestId);
  }

  rejectRequest(requestId = "", message = "") {
    return this.rejectApproval(requestId, message);
  }

  startCombat(payload = {}) {
    return this.send(SESSION_SOCKET_EVENTS.COMBAT_START, clone(payload));
  }

  endCombat() {
    return this.send(SESSION_SOCKET_EVENTS.COMBAT_END, {});
  }

  nextTurn() {
    return this.send(SESSION_SOCKET_EVENTS.TURN_NEXT, {});
  }

  updateScene(patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_UPDATE, { patch: clone(patch) });
  }

  updateSceneMap(mapImage = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_MAP_UPDATE, { mapImage, ...clone(extra) });
  }

  updateSceneGrid(patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_GRID_UPDATE, clone(patch));
  }

  createSceneMeasurement(measurement = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_MEASUREMENT_CREATE, { measurement: clone(measurement) });
  }

  clearSceneMeasurements() {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_MEASUREMENT_CLEAR, {});
  }

  createSceneArea(area = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_AREA_CREATE, { area: clone(area) });
  }

  updateSceneArea(areaId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_AREA_UPDATE, { id: areaId, areaId, ...clone(patch) });
  }

  deleteSceneArea(areaId = "") {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_AREA_DELETE, { areaId });
  }

  updateSceneVisibility(target = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_VISIBILITY_UPDATE, clone(target));
  }

  createSceneObjective(objective = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_OBJECTIVE_CREATE, { objective: clone(objective) });
  }

  updateSceneObjective(objectiveId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_OBJECTIVE_UPDATE, { id: objectiveId, objectiveId, ...clone(patch) });
  }

  deleteSceneObjective(objectiveId = "") {
    return this.send(SESSION_SOCKET_EVENTS.SCENE_OBJECTIVE_DELETE, { objectiveId });
  }

  moveToken(tokenId = "", x = 0, y = 0) {
    return this.send(SESSION_SOCKET_EVENTS.TOKEN_MOVE, {
      tokenId,
      x: Number(x || 0),
      y: Number(y || 0),
    });
  }

  requestShopCatalog(filters = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_CATALOG_REQUEST, { filters: clone(filters) });
  }

  requestShopItemDetails(itemId = "") {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_ITEM_DETAILS, { itemId });
  }

  updateShopCart(characterId = "", items = [], extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_CART_UPDATE, {
      characterId,
      items: clone(items),
      ...clone(extra),
    });
  }

  requestShopPurchase(characterId = "", items = [], extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_PURCHASE_REQUEST, {
      characterId,
      items: clone(items),
      ...clone(extra),
    });
  }

  submitShopCart(characterId = "", items = [], extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_CART_SUBMIT, {
      characterId,
      items: clone(items),
      ...clone(extra),
    });
  }

  approveShopPurchase(approvalId = "") {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_PURCHASE_APPROVE, { approvalId });
  }

  rejectShopPurchase(approvalId = "", message = "") {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_PURCHASE_REJECT, { approvalId, message });
  }

  requestShopSale(characterId = "", itemId = "", saleValue = 0, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_SELL_REQUEST, {
      characterId,
      itemId,
      saleValue: Number(saleValue || 0),
      ...clone(extra),
    });
  }

  requestShopDelete(characterId = "", itemId = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SHOP_DELETE_REQUEST, {
      characterId,
      itemId,
      ...clone(extra),
    });
  }

  createLootPack(pack = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_CREATE, { pack: clone(pack) });
  }

  createLootPackV2(pack = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_PACK_CREATE, { pack: clone(pack) });
  }

  updateLootPack(lootPackId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_UPDATE, { lootPackId, patch: clone(patch) });
  }

  updateLootPackV2(lootPackId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_PACK_UPDATE, { lootPackId, patch: clone(patch) });
  }

  deleteLootPack(lootPackId = "") {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_DELETE, { lootPackId });
  }

  distributeLootPack(lootPackId = "", characterId = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_DISTRIBUTE, {
      lootPackId,
      characterId,
      ...clone(extra),
    });
  }

  distributeLootPackV2(lootPackId = "", characterId = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_PACK_DISTRIBUTE, {
      lootPackId,
      characterId,
      ...clone(extra),
    });
  }

  createLootFromDefeatedMonster(monsterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_MONSTER_DEFEATED, { monsterId });
  }

  claimLootPack(lootPackId = "", characterId = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_CLAIM, {
      lootPackId,
      characterId,
      ...clone(extra),
    });
  }

  requestLootState() {
    return this.send(SESSION_SOCKET_EVENTS.LOOT_STATE, {});
  }

  requestGmDashboardState() {
    return this.send(SESSION_SOCKET_EVENTS.GM_DASHBOARD_STATE, {});
  }

  createGmNote(note = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_NOTE_CREATE, { note: clone(note) });
  }

  updateGmNote(noteId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_NOTE_UPDATE, { noteId, patch: clone(patch) });
  }

  deleteGmNote(noteId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_NOTE_DELETE, { noteId });
  }

  revealGmNote(noteId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_NOTE_REVEAL, { noteId });
  }

  createGmCounter(counter = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_COUNTER_CREATE, { counter: clone(counter) });
  }

  updateGmCounter(counterId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_COUNTER_UPDATE, { counterId, patch: clone(patch) });
  }

  deleteGmCounter(counterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_COUNTER_DELETE, { counterId });
  }

  tickGmCounter(counterId = "", delta = 1) {
    return this.send(SESSION_SOCKET_EVENTS.GM_COUNTER_TICK, { counterId, delta: Number(delta || 0) });
  }

  revealGmCounter(counterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_COUNTER_REVEAL, { counterId });
  }

  createGmEnvironment(effect = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENVIRONMENT_CREATE, { effect: clone(effect) });
  }

  updateGmEnvironment(effectId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENVIRONMENT_UPDATE, { effectId, patch: clone(patch) });
  }

  deleteGmEnvironment(effectId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENVIRONMENT_DELETE, { effectId });
  }

  createGmScene(scene = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_SCENE_CREATE, { scene: clone(scene) });
  }

  updateGmScene(sceneId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_SCENE_UPDATE, { sceneId, patch: clone(patch) });
  }

  deleteGmScene(sceneId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_SCENE_DELETE, { sceneId });
  }

  switchGmScene(sceneId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_SCENE_SWITCH, { sceneId });
  }

  createGmEncounter(encounter = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_CREATE, { encounter: clone(encounter) });
  }

  updateGmEncounter(encounterId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_UPDATE, { encounterId, patch: clone(patch) });
  }

  deleteGmEncounter(encounterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_DELETE, { encounterId });
  }

  startGmEncounter(encounterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_START, { encounterId });
  }

  completeGmEncounter(encounterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_COMPLETE, { encounterId });
  }

  generateGmEncounter(payload = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_ENCOUNTER_GENERATE, clone(payload));
  }

  searchGmShield(query = "", results = []) {
    return this.send(SESSION_SOCKET_EVENTS.GM_SHIELD_SEARCH, { query, results: clone(results) });
  }

  pinGmShieldRule(ruleId = "", pinned = true) {
    return this.send(SESSION_SOCKET_EVENTS.GM_SHIELD_PIN, { ruleId, pinned });
  }

  sendGmShieldRuleToChat(rule = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_SHIELD_SEND_TO_CHAT, { rule: clone(rule) });
  }

  exportGmReport(options = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_REPORT_EXPORT, { options: clone(options) });
  }

  saveGmReport(report = {}) {
    return this.send(SESSION_SOCKET_EVENTS.GM_REPORT_SAVE, { report: clone(report) });
  }

  listCampaigns() {
    return this.send(SESSION_SOCKET_EVENTS.CAMPAIGN_LIST, {});
  }

  createCampaign(campaign = {}) {
    return this.send(SESSION_SOCKET_EVENTS.CAMPAIGN_CREATE, { campaign: clone(campaign) });
  }

  updateCampaign(campaignId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.CAMPAIGN_UPDATE, { campaignId, patch: clone(patch) });
  }

  deleteCampaign(campaignId = "", confirmation = "") {
    return this.send(SESSION_SOCKET_EVENTS.CAMPAIGN_DELETE, { campaignId, confirmation });
  }

  loadCampaign(campaignId = "", sessionId = "") {
    return this.send(SESSION_SOCKET_EVENTS.CAMPAIGN_LOAD, { campaignId, sessionId });
  }

  saveSession(sessionState = {}, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_SAVE, { sessionState: clone(sessionState), ...clone(extra) });
  }

  loadSession(sessionState = {}, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_LOAD, { sessionState: clone(sessionState), ...clone(extra) });
  }

  importSession(bundle = {}, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_IMPORT, { bundle: clone(bundle), ...clone(extra) });
  }

  exportSession(extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_EXPORT, clone(extra));
  }

  autosaveSession(sessionState = {}, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_AUTOSAVE, { sessionState: clone(sessionState), ...clone(extra) });
  }

  createSessionSnapshot(sessionState = {}, extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_SNAPSHOT_CREATE, { sessionState: clone(sessionState), ...clone(extra) });
  }

  restoreSessionSnapshot(snapshotId = "", extra = {}) {
    return this.send(SESSION_SOCKET_EVENTS.SESSION_SNAPSHOT_RESTORE, { snapshotId, ...clone(extra) });
  }

  rollInitiative({ entityId = "", characterId = "", monsterId = "", bonus = 0, sides = 20 } = {}) {
    return this.send(SESSION_SOCKET_EVENTS.INITIATIVE_ROLL, {
      entityId,
      characterId,
      monsterId,
      bonus: Number(bonus || 0),
      sides: Number(sides || 20),
    });
  }

  updateInitiative(entry = {}) {
    return this.send(SESSION_SOCKET_EVENTS.INITIATIVE_UPDATE, { entry: clone(entry) });
  }

  damageCombatant({ entityType = "character", entityId = "", amount = 0, sourceLabel = "", attackName = "" } = {}) {
    const type = entityType === "monster"
      ? SESSION_SOCKET_EVENTS.MONSTER_DAMAGE
      : SESSION_SOCKET_EVENTS.CHARACTER_DAMAGE;
    return this.send(type, {
      [`${entityType}Id`]: entityId,
      amount: Number(amount || 0),
      sourceLabel,
      attackName,
    });
  }

  healCombatant({ entityType = "character", entityId = "", amount = 0 } = {}) {
    const type = entityType === "monster"
      ? SESSION_SOCKET_EVENTS.MONSTER_HEAL
      : SESSION_SOCKET_EVENTS.CHARACTER_HEAL;
    return this.send(type, {
      [`${entityType}Id`]: entityId,
      amount: Number(amount || 0),
    });
  }

  addCombatantCondition({ entityType = "character", entityId = "", condition = {} } = {}) {
    const type = entityType === "monster"
      ? SESSION_SOCKET_EVENTS.MONSTER_CONDITION_ADD
      : SESSION_SOCKET_EVENTS.CHARACTER_CONDITION_ADD;
    return this.send(type, {
      [`${entityType}Id`]: entityId,
      condition: clone(condition),
    });
  }

  removeCombatantCondition({ entityType = "character", entityId = "", conditionId = "" } = {}) {
    const type = entityType === "monster"
      ? SESSION_SOCKET_EVENTS.MONSTER_CONDITION_REMOVE
      : SESSION_SOCKET_EVENTS.CHARACTER_CONDITION_REMOVE;
    return this.send(type, {
      [`${entityType}Id`]: entityId,
      conditionId,
    });
  }

  createMonster(monster = {}) {
    return this.send(SESSION_SOCKET_EVENTS.MONSTER_CREATE, { monster: clone(monster) });
  }

  updateMonster(monsterId = "", patch = {}) {
    return this.send(SESSION_SOCKET_EVENTS.MONSTER_UPDATE, { monsterId, patch: clone(patch) });
  }

  deleteMonster(monsterId = "") {
    return this.send(SESSION_SOCKET_EVENTS.MONSTER_DELETE, { monsterId });
  }

  localPlayer(role = "player") {
    return {
      id: this.playerId,
      name: this.playerName,
      role,
      online: true,
    };
  }

  send(type, payload = {}) {
    if (!this.isConnected) return false;
    this.socket.send(JSON.stringify({
      type,
      payload,
      sentAt: new Date().toISOString(),
    }));
    return true;
  }

  handleMessage(raw) {
    let message;
    try {
      message = JSON.parse(raw);
    } catch {
      this.emit(SESSION_SOCKET_EVENTS.ERROR, { message: "Mensagem invalida do servidor." });
      return;
    }
    if (message.type === SESSION_SOCKET_EVENTS.ROOM_STATE) {
      this.room = clone(message.payload?.room || message.payload);
      this.emit(SESSION_SOCKET_EVENTS.ROOM_STATE, { room: this.room });
      return;
    }
    if (message.type === SESSION_SOCKET_EVENTS.ERROR) {
      this.lastError = message.payload?.message || "Erro da mesa.";
    }
    this.emit(message.type, message.payload || {});
  }

  setConnection(connected, reason = "") {
    const changed = this.connected !== Boolean(connected) || this.lastError !== String(reason || "");
    this.connected = Boolean(connected);
    this.lastError = String(reason || "");
    if (changed) {
      this.emit("connection:change", {
        connected: this.connected,
        reason: this.lastError,
      });
    }
  }

  emit(type, detail = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export default SolarisSessionClient;
