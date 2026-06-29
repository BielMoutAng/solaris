import {
  advanceConditionDurations,
  applyConditionToCombatant,
  applyDamageToCombatant,
  applyHealingToCombatant,
  createCombatantState,
  removeConditionFromCombatant,
  resetTurnActionState,
} from "../domain/solaris-combat-rules.js";
import {
  BESTIARY_SCHEMA_VERSION,
  createSessionMonsterFromBestiary,
  resolveMonsterLoot,
} from "../domain/solaris-bestiary-rules.js";
import {
  GM_SCHEMA_VERSION,
  advanceBaseProject,
  advanceCampaignClock,
  advanceHackingChallenge,
  advanceMissionPhase,
  applyMissionReward,
  completeMissionObjective,
  consumeResource,
  createBaseState,
  createCampaignClock,
  createFactionState,
  createGmEvent as createGmRuleEvent,
  createHackingChallenge,
  createMissionObjective,
  createResourceTrack,
  createTravelRoute,
  failHackingChallenge,
  failMissionObjective,
  hydrateGmState,
  normalizeMissionEntry,
  resolveBaseEvent,
  resolveCampaignClock,
  resolveMissionComplication,
  resolveTravelEvent,
  restoreResource,
  serializeGmState,
  updateBaseResource,
  updateFactionReputation,
} from "../domain/solaris-gm-rules.js";
import {
  LORE_DISCOVERY_STATES,
  LORE_SCHEMA_VERSION,
  LORE_SECRET_LEVELS,
  createEncounterSeedFromLore,
  createLocationSceneSeed,
  createLoreLinkedFactionState,
  createLoreRelation,
  createMissionSeedFromLore,
  createNpcSeedFromLore,
  hydrateLoreState,
  linkLoreEntries,
  markLoreDiscovered,
  markLoreSecret,
  pinLoreEntry,
  sendLoreToGmNotes,
  sendLoreToSessionReport,
  serializeLoreState,
  unpinLoreEntry,
} from "../domain/solaris-lore-rules.js";

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
  GM_LORE_PIN: "gm:lore:pin",
  GM_LORE_DISCOVER: "gm:lore:discover",
  GM_LORE_SECRET: "gm:lore:secret",
  GM_LORE_NOTE: "gm:lore:note",
  GM_LORE_REPORT: "gm:lore:report",
  GM_LORE_RELATION: "gm:lore:relation",
  GM_LORE_MISSION: "gm:lore:mission",
  GM_LORE_ENCOUNTER: "gm:lore:encounter",
  GM_LORE_NPC: "gm:lore:npc",
  GM_LORE_SCENE: "gm:lore:scene",
  GM_LORE_CLOCK: "gm:lore:clock",
  GM_LORE_FACTION: "gm:lore:faction",
  GM_REPORT_EXPORT: "gm:report:export",
  GM_REPORT_SAVE: "gm:report:save",
  GM_MISSION_CREATE: "gm:mission:create",
  GM_MISSION_UPDATE: "gm:mission:update",
  GM_MISSION_DELETE: "gm:mission:delete",
  GM_MISSION_ADVANCE: "gm:mission:advance",
  GM_MISSION_OBJECTIVE_CREATE: "gm:mission:objective:create",
  GM_MISSION_OBJECTIVE_COMPLETE: "gm:mission:objective:complete",
  GM_MISSION_OBJECTIVE_FAIL: "gm:mission:objective:fail",
  GM_MISSION_COMPLICATION: "gm:mission:complication",
  GM_TRAVEL_ROUTE_CREATE: "gm:travel-route:create",
  GM_TRAVEL_ROUTE_UPDATE: "gm:travel-route:update",
  GM_TRAVEL_ROUTE_DELETE: "gm:travel-route:delete",
  GM_TRAVEL_EVENT: "gm:travel:event",
  GM_RESOURCE_CREATE: "gm:resource:create",
  GM_RESOURCE_CONSUME: "gm:resource:consume",
  GM_RESOURCE_RESTORE: "gm:resource:restore",
  GM_FACTION_CREATE: "gm:faction:create",
  GM_FACTION_UPDATE: "gm:faction:update",
  GM_FACTION_REPUTATION: "gm:faction:reputation",
  GM_CLOCK_CREATE: "gm:clock:create",
  GM_CLOCK_ADVANCE: "gm:clock:advance",
  GM_CLOCK_RESOLVE: "gm:clock:resolve",
  GM_HACKING_CREATE: "gm:hacking:create",
  GM_HACKING_ADVANCE: "gm:hacking:advance",
  GM_HACKING_FAIL: "gm:hacking:fail",
  GM_BASE_CREATE: "gm:base:create",
  GM_BASE_UPDATE: "gm:base:update",
  GM_BASE_RESOURCE_UPDATE: "gm:base:resource:update",
  GM_BASE_PROJECT_ADVANCE: "gm:base:project:advance",
  GM_BASE_EVENT: "gm:base:event",
  GM_REWARD_CREATE: "gm:reward:create",
  GM_REWARD_APPLY: "gm:reward:apply",
  GM_EVENT_CREATE: "gm:event:create",
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

export const GM_DASHBOARD_EVENTS = new Set([
  GAME_EVENT_TYPES.GM_DASHBOARD_STATE,
  GAME_EVENT_TYPES.GM_NOTE_CREATE,
  GAME_EVENT_TYPES.GM_NOTE_UPDATE,
  GAME_EVENT_TYPES.GM_NOTE_DELETE,
  GAME_EVENT_TYPES.GM_NOTE_REVEAL,
  GAME_EVENT_TYPES.GM_COUNTER_CREATE,
  GAME_EVENT_TYPES.GM_COUNTER_UPDATE,
  GAME_EVENT_TYPES.GM_COUNTER_DELETE,
  GAME_EVENT_TYPES.GM_COUNTER_TICK,
  GAME_EVENT_TYPES.GM_COUNTER_REVEAL,
  GAME_EVENT_TYPES.GM_ENVIRONMENT_CREATE,
  GAME_EVENT_TYPES.GM_ENVIRONMENT_UPDATE,
  GAME_EVENT_TYPES.GM_ENVIRONMENT_DELETE,
  GAME_EVENT_TYPES.GM_SCENE_CREATE,
  GAME_EVENT_TYPES.GM_SCENE_UPDATE,
  GAME_EVENT_TYPES.GM_SCENE_DELETE,
  GAME_EVENT_TYPES.GM_SCENE_SWITCH,
  GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE,
  GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE,
  GAME_EVENT_TYPES.GM_ENCOUNTER_DELETE,
  GAME_EVENT_TYPES.GM_ENCOUNTER_START,
  GAME_EVENT_TYPES.GM_ENCOUNTER_COMPLETE,
  GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE,
  GAME_EVENT_TYPES.GM_SHIELD_SEARCH,
  GAME_EVENT_TYPES.GM_SHIELD_PIN,
  GAME_EVENT_TYPES.GM_SHIELD_SEND_TO_CHAT,
  GAME_EVENT_TYPES.GM_LORE_PIN,
  GAME_EVENT_TYPES.GM_LORE_DISCOVER,
  GAME_EVENT_TYPES.GM_LORE_SECRET,
  GAME_EVENT_TYPES.GM_LORE_NOTE,
  GAME_EVENT_TYPES.GM_LORE_REPORT,
  GAME_EVENT_TYPES.GM_LORE_RELATION,
  GAME_EVENT_TYPES.GM_LORE_MISSION,
  GAME_EVENT_TYPES.GM_LORE_ENCOUNTER,
  GAME_EVENT_TYPES.GM_LORE_NPC,
  GAME_EVENT_TYPES.GM_LORE_SCENE,
  GAME_EVENT_TYPES.GM_LORE_CLOCK,
  GAME_EVENT_TYPES.GM_LORE_FACTION,
  GAME_EVENT_TYPES.GM_REPORT_EXPORT,
  GAME_EVENT_TYPES.GM_REPORT_SAVE,
  GAME_EVENT_TYPES.GM_MISSION_CREATE,
  GAME_EVENT_TYPES.GM_MISSION_UPDATE,
  GAME_EVENT_TYPES.GM_MISSION_DELETE,
  GAME_EVENT_TYPES.GM_MISSION_ADVANCE,
  GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_CREATE,
  GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_COMPLETE,
  GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_FAIL,
  GAME_EVENT_TYPES.GM_MISSION_COMPLICATION,
  GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_CREATE,
  GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_UPDATE,
  GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_DELETE,
  GAME_EVENT_TYPES.GM_TRAVEL_EVENT,
  GAME_EVENT_TYPES.GM_RESOURCE_CREATE,
  GAME_EVENT_TYPES.GM_RESOURCE_CONSUME,
  GAME_EVENT_TYPES.GM_RESOURCE_RESTORE,
  GAME_EVENT_TYPES.GM_FACTION_CREATE,
  GAME_EVENT_TYPES.GM_FACTION_UPDATE,
  GAME_EVENT_TYPES.GM_FACTION_REPUTATION,
  GAME_EVENT_TYPES.GM_CLOCK_CREATE,
  GAME_EVENT_TYPES.GM_CLOCK_ADVANCE,
  GAME_EVENT_TYPES.GM_CLOCK_RESOLVE,
  GAME_EVENT_TYPES.GM_HACKING_CREATE,
  GAME_EVENT_TYPES.GM_HACKING_ADVANCE,
  GAME_EVENT_TYPES.GM_HACKING_FAIL,
  GAME_EVENT_TYPES.GM_BASE_CREATE,
  GAME_EVENT_TYPES.GM_BASE_UPDATE,
  GAME_EVENT_TYPES.GM_BASE_RESOURCE_UPDATE,
  GAME_EVENT_TYPES.GM_BASE_PROJECT_ADVANCE,
  GAME_EVENT_TYPES.GM_BASE_EVENT,
  GAME_EVENT_TYPES.GM_REWARD_CREATE,
  GAME_EVENT_TYPES.GM_REWARD_APPLY,
  GAME_EVENT_TYPES.GM_EVENT_CREATE,
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
  return arrayOf(value).map((condition) => {
    const duration = condition.duration === null || condition.duration === undefined
      ? null
      : Math.max(0, Math.floor(numeric(condition.duration, 0)));
    return {
      ...(clone(condition) || {}),
      id: String(condition.id || condition.conditionId || condition.key || createId("condition")),
      key: String(condition.key || condition.type || condition.id || condition.name || condition.label || "condition"),
      label: String(condition.label || condition.name || "Condicao"),
      name: String(condition.name || condition.label || "Condicao"),
      description: String(condition.description || condition.effect || ""),
      source: String(condition.source || ""),
      duration,
      durationType: String(condition.durationType || condition.unit || (duration === null ? "scene" : "turns")),
      active: condition.active !== false,
      automatic: Boolean(condition.automatic || condition.auto),
      visibleToPlayer: condition.visibleToPlayer !== false,
      removable: condition.removable !== false,
      appliedAt: condition.appliedAt || condition.createdAt || nowIso(),
      createdAt: condition.createdAt || condition.appliedAt || nowIso(),
      updatedAt: condition.updatedAt || nowIso(),
    };
  });
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
    equipmentSchemaVersion: Math.max(1, Math.floor(numeric(snapshot.equipmentSchemaVersion ?? snapshot.equipmentState?.schemaVersion, 1))),
    equipmentState: clone(snapshot.equipmentState || {}) || {},
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
    combatState: clone(snapshot.combatState || {}) || {},
    deathMarks: bounded(snapshot.deathMarks, 0, 2, 0),
    isDead: Boolean(snapshot.isDead),
    criticalState: String(snapshot.criticalState || ""),
    stabilized: Boolean(snapshot.stabilized),
    lastDeathCheck: String(snapshot.lastDeathCheck || ""),
    deathNotes: String(snapshot.deathNotes || ""),
    severeWounds: arrayOf(snapshot.severeWounds).map((item) => ({ ...clone(item) })),
    injuries: arrayOf(snapshot.injuries).map((item) => ({ ...clone(item) })),
    scars: arrayOf(snapshot.scars).map((item) => ({ ...clone(item) })),
    woundHistory: arrayOf(snapshot.woundHistory).map((item) => ({ ...clone(item) })),
    conditionDurations: clone(snapshot.conditionDurations || {}) || {},
    combatActionState: clone(snapshot.combatActionState || {}) || {},
    lastCombatEvents: arrayOf(snapshot.lastCombatEvents).map((item) => ({ ...clone(item) })),
    equipmentCombatState: clone(snapshot.equipmentCombatState || {}) || {},
    ammoState: clone(snapshot.ammoState || {}) || {},
    magazines: arrayOf(snapshot.magazines).map((item) => ({ ...clone(item) })),
    ammoCombatState: clone(snapshot.ammoCombatState || {}) || {},
    craftingHistory: arrayOf(snapshot.craftingHistory).map((item) => ({ ...clone(item) })),
    repairHistory: arrayOf(snapshot.repairHistory).map((item) => ({ ...clone(item) })),
    sourceGovernance: clone(snapshot.sourceGovernance || {}) || {},
    usesDeathMarks: snapshot.usesDeathMarks !== false,
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
  const destination = line.destination || line.location || item.location || { kind: "unassigned" };
  return {
    id: String(line.id || item.uid || item.id || createId("cart-line")),
    item,
    itemId: String(line.itemId || item.itemId || item.definitionId || item.id || ""),
    quantity,
    price,
    total: price * quantity,
    destination: normalizeInventoryItem({ location: destination }).location,
    status: String(line.status || "pending"),
    approvalRequired: line.approvalRequired !== false,
    warnings: arrayOf(line.warnings).map((entry) => String(entry || "")).filter(Boolean),
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
    mode: String(value.mode || "session"),
    approvalRequired: value.approvalRequired !== false,
    taxRate: Math.max(0, numeric(value.taxRate, 0)),
    policies: value.policies && typeof value.policies === "object" ? clone(value.policies) : {
      approvalMode: "session",
      allowUnassignedDestination: true,
      transactionFeePercent: 0,
    },
    carts: normalizedCarts,
    filters: value.filters && typeof value.filters === "object" ? clone(value.filters) : {},
    updatedAt: value.updatedAt || nowIso(),
  };
}

function cartLineMatches(line = {}, lineId = "") {
  const id = String(lineId || "");
  if (!id) return false;
  return [line.id, line.itemId, line.item?.id, line.item?.uid, line.item?.itemId, line.item?.definitionId]
    .some((value) => String(value || "") === id);
}

function cartLineIdFromPayload(payload = {}) {
  return String(payload.shopLineId || payload.cartLineId || payload.lineId || payload.itemLineId || "");
}

function cartLinesAllResolved(lines = []) {
  const normalized = arrayOf(lines).map(normalizeCartLine);
  return normalized.length > 0 && normalized.every((line) => ["approved", "rejected"].includes(line.status));
}

function markCartLineStatus(lines = [], lineId = "", status = "pending", actorId = "", message = "") {
  return arrayOf(lines).map((line) => {
    const normalized = normalizeCartLine(line);
    if (!cartLineMatches(normalized, lineId)) return normalized;
    return {
      ...normalized,
      status,
      resolvedAt: nowIso(),
      resolvedBy: String(actorId || ""),
      resolutionMessage: String(message || ""),
    };
  });
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

function normalizeTags(value = []) {
  if (Array.isArray(value)) return value.map((entry) => String(entry || "").trim()).filter(Boolean);
  return String(value || "").split(",").map((entry) => entry.trim()).filter(Boolean);
}

function normalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeGmNote(value = {}) {
  return {
    id: String(value.id || createId("gm-note")),
    title: String(value.title || value.name || "Nota secreta"),
    body: String(value.body || value.description || value.text || ""),
    tags: normalizeTags(value.tags),
    important: Boolean(value.important),
    secret: value.secret !== false,
    visibleToPlayers: Boolean(value.visibleToPlayers || value.revealed),
    revealed: Boolean(value.revealed),
    sceneId: String(value.sceneId || ""),
    linkedType: String(value.linkedType || ""),
    linkedId: String(value.linkedId || ""),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function normalizeGmCounter(value = {}) {
  const max = Math.max(1, Math.floor(numeric(value.max ?? value.maximum, 6)));
  const current = bounded(value.current ?? value.value, 0, max, max);
  return {
    id: String(value.id || createId("gm-counter")),
    name: String(value.name || "Contador secreto"),
    type: String(value.type || "ameaca"),
    current,
    max,
    direction: String(value.direction || "down"),
    color: String(value.color || "#a35dff"),
    description: String(value.description || ""),
    tags: normalizeTags(value.tags),
    visibleToPlayers: Boolean(value.visibleToPlayers || value.revealed),
    revealed: Boolean(value.revealed),
    paused: Boolean(value.paused),
    triggerText: String(value.triggerText || ""),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function normalizeEnvironmentalEffect(value = {}) {
  return {
    id: String(value.id || createId("gm-effect")),
    name: String(value.name || "Efeito ambiental"),
    description: String(value.description || ""),
    type: String(value.type || "outro"),
    duration: String(value.duration || ""),
    mechanicalEffect: String(value.mechanicalEffect || value.mechanics || ""),
    color: String(value.color || "#35d4ff"),
    icon: String(value.icon || ""),
    active: value.active !== false,
    visibleToPlayers: Boolean(value.visibleToPlayers || value.revealed),
    revealed: Boolean(value.revealed),
    sceneId: String(value.sceneId || ""),
    tags: normalizeTags(value.tags),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function normalizePreparedEncounter(value = {}) {
  return {
    id: String(value.id || createId("gm-encounter")),
    name: String(value.name || "Encontro preparado"),
    description: String(value.description || ""),
    sceneId: String(value.sceneId || ""),
    monsters: arrayOf(value.monsters).map((monster) => clone(monster)),
    npcs: arrayOf(value.npcs).map((npc) => clone(npc)),
    initialPositions: arrayOf(value.initialPositions || value.positions).map((position) => clone(position)),
    objectives: arrayOf(value.objectives).map((objective) => clone(objective)),
    zones: arrayOf(value.zones).map((zone) => clone(zone)),
    conditions: arrayOf(value.conditions).map((condition) => clone(condition)),
    difficulty: String(value.difficulty || ""),
    estimatedDifficulty: String(value.estimatedDifficulty || value.balance?.classification || value.difficulty || ""),
    threatXp: Math.max(0, numeric(value.threatXp ?? value.xp, 0)),
    threatScore: Math.max(0, numeric(value.threatScore ?? value.balance?.totalThreat, value.threatXp ?? value.xp ?? 0)),
    balance: clone(value.balance || {}) || {},
    sourceFilters: clone(value.sourceFilters || value.filters || {}) || {},
    source: String(value.source || ""),
    sourceLoreId: String(value.sourceLoreId || value.loreId || ""),
    loreLinks: normalizeTags(value.loreLinks || value.linkedLore || value.loreIds),
    generated: Boolean(value.generated),
    rewards: clone(value.rewards || {}) || {},
    lootSuggested: clone(value.lootSuggested || value.suggestedLoot || {}) || {},
    notes: String(value.notes || ""),
    publicNotes: String(value.publicNotes || ""),
    secretNotes: String(value.secretNotes || ""),
    status: String(value.status || "prepared"),
    model: Boolean(value.model || value.template),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || nowIso(),
  };
}

function normalizeSessionReport(value = {}) {
  return {
    id: String(value.id || createId("session-report")),
    sessionId: String(value.sessionId || ""),
    title: String(value.title || "Relatorio da sessao"),
    createdAt: value.createdAt || nowIso(),
    updatedAt: value.updatedAt || value.createdAt || nowIso(),
    options: clone(value.options || {}) || {},
    markdown: String(value.markdown || ""),
    summary: String(value.summary || ""),
    metadata: clone(value.metadata || {}) || {},
  };
}

function normalizeGmDashboardSettings(value = {}) {
  const reportSettings = clone(value.reportSettings || {}) || {};
  return {
    ...(clone(value) || {}),
    showPlayerFacingCounters: Boolean(value.showPlayerFacingCounters),
    pauseCounters: Boolean(value.pauseCounters),
    lastReportAt: String(value.lastReportAt || ""),
    pinnedShieldRules: normalizeTags(value.pinnedShieldRules),
    favoriteShieldRules: normalizeTags(value.favoriteShieldRules),
    reportSettings: {
      includeFullChat: Boolean(reportSettings.includeFullChat),
      includeSecretNotes: Boolean(reportSettings.includeSecretNotes),
      includeTechnicalLogs: Boolean(reportSettings.includeTechnicalLogs),
      includeTransactions: reportSettings.includeTransactions !== false,
      includeCombat: reportSettings.includeCombat !== false,
      includeLoot: reportSettings.includeLoot !== false,
      includeCounters: reportSettings.includeCounters !== false,
      includeEnvironment: reportSettings.includeEnvironment !== false,
      includePending: reportSettings.includePending !== false,
      includeScenes: reportSettings.includeScenes !== false,
      includeEncounters: reportSettings.includeEncounters !== false,
      includeObjectives: reportSettings.includeObjectives !== false,
    },
  };
}

function normalizeSceneList(scenes = [], activeScene = {}) {
  const source = arrayOf(scenes).length ? arrayOf(scenes) : [activeScene];
  return source
    .filter(Boolean)
    .map((scene, index) => {
      const normalized = Scene.fromJSON({
        ...scene,
        id: String(scene.id || `scene-${index + 1}`),
        name: String(scene.name || scene.title || `Cena ${index + 1}`),
      }).toJSON();
      return {
        ...normalized,
        createdAt: scene.createdAt || nowIso(),
        updatedAt: scene.updatedAt || nowIso(),
      };
    });
}

const ENCOUNTER_TIER_POINTS = Object.freeze({
  F: 1,
  E: 2,
  D: 4,
  C: 8,
  B: 16,
  A: 32,
  S: 64,
});

function normalizedTier(value = "") {
  const text = String(value || "").toUpperCase().trim();
  if (ENCOUNTER_TIER_POINTS[text]) return text;
  const number = numeric(text, 0);
  if (number <= 1) return "F";
  if (number === 2) return "E";
  if (number === 3) return "D";
  if (number === 4) return "C";
  if (number === 5) return "B";
  if (number === 6) return "A";
  return number > 6 ? "S" : "F";
}

function roleThreatMultiplier(monster = {}) {
  const role = normalizeText([monster.role, monster.papel, monster.tags, monster.type, monster.category].flat().join(" "));
  if (/boss|chefe|climax|lenda/.test(role)) return 2.5;
  if (/elite|campeao|vanguarda/.test(role)) return 1.5;
  if (/controlador|suporte|artilh|conjur|lider/.test(role)) return 1.15;
  if (/minion|servo|fraco|drone|enxame/.test(role)) return 0.75;
  return 1;
}

function monsterThreatScoreValue(monster = {}) {
  const snapshot = monster.snapshot || monster.monster || monster;
  const tier = normalizedTier(snapshot.tier || snapshot.rank || snapshot.nivel || snapshot.level);
  return Number((ENCOUNTER_TIER_POINTS[tier] * roleThreatMultiplier(snapshot)).toFixed(2));
}

export function estimateEncounterBalance({ monsters = [], characters = [] } = {}) {
  const list = arrayOf(monsters);
  const party = arrayOf(characters);
  const totalThreat = Number(list.reduce((sum, monster) => sum + monsterThreatScoreValue(monster), 0).toFixed(2));
  const partySize = Math.max(1, party.length || 4);
  const averageLevel = party.length
    ? party.reduce((sum, character) => sum + numeric(character.level || character.nivel || character.snapshot?.level || character.snapshot?.nivel, 1), 0) / party.length
    : 1;
  const partyBudget = Math.max(2, partySize * Math.max(1, averageLevel) * 2);
  const ratio = totalThreat / partyBudget;
  const hasBoss = list.some((monster) => roleThreatMultiplier(monster.snapshot || monster) >= 2);
  const minionCount = list.filter((monster) => roleThreatMultiplier(monster.snapshot || monster) <= 0.75).length;
  const classification = hasBoss && ratio >= 0.9
    ? "Boss/Climax"
    : ratio < 0.45
      ? "Trivial"
      : ratio < 0.75
        ? "Facil"
        : ratio < 1.15
          ? "Moderado"
          : ratio < 1.65
            ? "Dificil"
            : "Mortal";
  const warnings = [];
  if (ratio >= 1.65) warnings.push("Encontro mortal: reduza criaturas, tier ou suporte se nao for climax.");
  if (ratio < 0.45) warnings.push("Encontro trivial: adicione suporte, minions ou uma ameaca de tier maior.");
  if (minionCount >= partySize * 2) warnings.push("Muitos minions podem alongar o turno; agrupe rolagens quando possivel.");
  if (hasBoss && list.length === 1) warnings.push("Boss solo pode oscilar muito; considere suporte ou objetivos de cena.");
  const suggestions = [];
  if (ratio > 1.25) suggestions.push("Remover 1 criatura ou trocar um elite por combatente padrao.");
  if (ratio < 0.75) suggestions.push("Adicionar 1 suporte/minion ou elevar um tier da ameaca principal.");
  suggestions.push(`Recompensa sugerida: ${Math.max(25, Math.round(totalThreat * 35))} Luzentis ou loot equivalente.`);
  return {
    totalThreat,
    partySize,
    averageLevel: Number(averageLevel.toFixed(2)),
    partyBudget: Number(partyBudget.toFixed(2)),
    ratio: Number(ratio.toFixed(2)),
    classification,
    hasBoss,
    minionCount,
    warnings,
    suggestions,
    alpha: true,
  };
}

function generateSessionReport(room, options = {}) {
  const data = room.toJSON();
  const settings = {
    includeFullChat: false,
    includeSecretNotes: false,
    includeTechnicalLogs: false,
    includeTransactions: true,
    includeCombat: true,
    includeLoot: true,
    includeGmCampaign: true,
    ...(clone(options) || {}),
  };
  const revealedNotes = (data.gmNotes || []).filter((note) => note.revealed || note.visibleToPlayers);
  const visibleNotes = settings.includeSecretNotes ? (data.gmNotes || []) : revealedNotes;
  const combatLog = data.combat?.log || [];
  const chats = data.chat || [];
  const transactions = data.transactionLog || [];
  const lootPacks = data.lootPacks || [];
  const scenes = data.sceneList || data.scenes || [];
  const encounters = data.preparedEncounters || [];
  const missions = data.missions || data.gmState?.missions || [];
  const resources = data.resourceTracks || data.gmState?.resourceTracks || [];
  const factions = data.factionStates || data.gmState?.factionStates || [];
  const routes = data.travelRoutes || data.gmState?.travelRoutes || [];
  const clocks = data.campaignClocks || data.gmState?.campaignClocks || [];
  const hacking = data.hackingChallenges || data.gmState?.hackingChallenges || [];
  const bases = data.bases || data.gmState?.bases || [];
  const loreState = serializeLoreState(data.loreState || {});
  const loreEntries = loreState.entries || [];
  const pinnedLore = loreEntries.filter((entry) => loreState.pinnedLoreEntries.includes(entry.id) || entry.pinned);
  const reportLore = loreState.reportLoreEntries || [];
  const discoveredLore = loreEntries.filter((entry) => loreState.discoveredLoreEntries.includes(entry.id));
  const secretLore = settings.includeSecretNotes
    ? loreEntries.filter((entry) => loreState.secretLoreEntries.includes(entry.id) || entry.secretLevel !== LORE_SECRET_LEVELS.PUBLIC)
    : [];
  const loreByType = (types = []) => loreEntries.filter((entry) => types.includes(entry.type));
  const completedObjectives = arrayOf(data.scene?.objectives).filter((objective) =>
    objective.completed || numeric(objective.progressCurrent, 0) >= numeric(objective.progressMax, 1)
  );
  const lines = [
    `# Relatorio da Sessao - ${data.name}`,
    "",
    `Sistema: ${data.system}`,
    `Gerado em: ${nowIso()}`,
    `Duracao registrada: ${data.metadata?.duration || "nao registrada"}`,
    `Cena ativa: ${data.scene?.name || "-"}`,
    `Combate: ${data.combat?.active ? `Rodada ${data.combat.round || 1}` : "inativo"}`,
    "",
    "## Jogadores",
    ...(data.players || []).map((player) => `- ${player.name} (${player.role}) ${player.online ? "online" : "offline"}`),
    "",
    "## Personagens",
    ...((data.characters || []).length ? data.characters.map((character) => `- ${character.name || character.snapshot?.name || character.id}`) : ["- Nenhum personagem sincronizado."]),
    "",
    "## Cenas visitadas",
    ...(scenes.length ? scenes.map((scene) => `- ${scene.name || scene.title || scene.id}`) : ["- Nenhuma cena salva."]),
    "",
    "## Monstros ativos",
    ...((data.monsters || []).length ? data.monsters.map((monster) => `- ${monster.name}`) : ["- Nenhum monstro ativo."]),
    "",
    "## Encontros",
    ...(encounters.length ? encounters.map((encounter) => `- ${encounter.name}: ${encounter.status || "preparado"} (${arrayOf(encounter.monsters).length} criatura(s))`) : ["- Nenhum encontro preparado."]),
    "",
    ...(settings.includeGmCampaign ? [
      "## Campanha do Mestre",
      ...(missions.length ? missions.map((mission) => `- Missao: ${mission.name} (${mission.phase || mission.status || "ativa"})`) : ["- Nenhuma missao registrada."]),
      ...(routes.length ? routes.map((route) => `- Viagem: ${route.name} (${route.origin || "?"} -> ${route.destination || "?"})`) : []),
      ...(resources.length ? resources.map((resource) => `- Recurso: ${resource.name} ${resource.current}/${resource.max} (${resource.pressure || "estavel"})`) : []),
      ...(factions.length ? factions.map((faction) => `- Faccao: ${faction.name} reputacao ${faction.reputation ?? 0} (${faction.relation || "neutro"})`) : []),
      ...(clocks.length ? clocks.map((clock) => `- Contador: ${clock.name} ${clock.current}/${clock.max} (${clock.status || "ativo"})`) : []),
      ...(hacking.length ? hacking.map((challenge) => `- Hacking: ${challenge.name} ${challenge.progress}/${challenge.nodes} nos, deteccao ${challenge.detection}/${challenge.detectionMax}`) : []),
      ...(bases.length ? bases.map((base) => `- Base/Colonia: ${base.name} seguranca ${base.attributes?.security ?? 0}, suprimentos ${base.resources?.supplies ?? 0}`) : []),
      "",
    ] : []),
    "## Lore e cenario",
    ...(pinnedLore.length ? pinnedLore.map((entry) => `- Pin: ${entry.title} (${entry.type})`) : ["- Nenhuma lore pinada."]),
    ...(reportLore.length ? reportLore.map((entry) => `- Relatorio: ${entry.title}: ${entry.summary}`) : []),
    ...(loreByType(["local", "cidade", "planeta", "regiao", "plataforma"]).length ? loreByType(["local", "cidade", "planeta", "regiao", "plataforma"]).slice(0, 8).map((entry) => `- Local: ${entry.title}`) : []),
    ...(loreByType(["faccao", "organizacao"]).length ? loreByType(["faccao", "organizacao"]).slice(0, 8).map((entry) => `- Faccao/organizacao: ${entry.title}`) : []),
    ...(loreByType(["npc"]).length ? loreByType(["npc"]).slice(0, 8).map((entry) => `- NPC: ${entry.title}`) : []),
    ...(discoveredLore.length ? discoveredLore.slice(0, 8).map((entry) => `- Descoberto: ${entry.title}`) : []),
    ...(secretLore.length ? secretLore.slice(0, 8).map((entry) => `- Segredo: ${entry.title}`) : []),
    "",
    "## Notas do mestre",
    ...(visibleNotes.length ? visibleNotes.map((note) => `- ${note.important ? "[!]" : "[ ]"} ${note.title}: ${note.body}`) : ["- Nenhuma nota revelada."]),
    "",
    "## Contadores",
    ...((data.gmCounters || []).length ? data.gmCounters.map((counter) => `- ${counter.name}: ${counter.current}/${counter.max}`) : ["- Nenhum contador."]),
    "",
    "## Efeitos ambientais",
    ...((data.environmentalEffects || []).length ? data.environmentalEffects.map((effect) => `- ${effect.name}: ${effect.description || effect.mechanicalEffect || "sem detalhe"}`) : ["- Nenhum efeito ambiental."]),
    "",
    "## Objetivos concluidos",
    ...(completedObjectives.length ? completedObjectives.map((objective) => `- ${objective.title || objective.label}`) : ["- Nenhum objetivo concluido registrado."]),
    "",
    ...(settings.includeCombat ? [
      "## Combate",
      ...(combatLog.length ? combatLog.slice(-40).map((entry) => `- ${entry.message || entry.type || "Evento"}`) : ["- Nenhum log de combate."]),
      "",
    ] : []),
    ...(settings.includeLoot ? [
      "## Loot",
      ...(lootPacks.length ? lootPacks.map((pack) => `- ${pack.name}: ${pack.luzentis || 0}L, ${arrayOf(pack.items).length} item(ns), status ${pack.status || "pendente"}`) : ["- Nenhum loot registrado."]),
      "",
    ] : []),
    ...(settings.includeTransactions ? [
      "## Transacoes",
      ...(transactions.length ? transactions.slice(-40).map((entry) => `- ${entry.message || entry.type || "Transacao"}`) : ["- Nenhuma transacao registrada."]),
      "",
    ] : []),
    "## Resumo do chat",
    ...((settings.includeFullChat ? chats : chats.slice(-20)).map((entry) => `- ${entry.authorName || "Mesa"}: ${entry.message || ""}`)),
    "",
    "## Pendencias para a proxima sessao",
    "- Revisar contadores ativos, encontros preparados e objetivos ainda abertos.",
    ...(settings.includeTechnicalLogs ? [
      "",
      "## Logs tecnicos",
      ...((data.events || []).slice(-40).map((entry) => `- ${entry.type || "Evento"} ${entry.createdAt || ""}`)),
    ] : []),
  ];
  return lines.join("\n");
}

function inventoryInstancesFromCart(items = [], destination = null) {
  return arrayOf(items).flatMap((line) => {
    const normalized = normalizeCartLine(line);
    const resolvedDestination = destination || normalized.destination || normalized.item.location || { kind: "unassigned" };
    return Array.from({ length: normalized.quantity }, (_, index) => normalizeInventoryItem({
      ...normalized.item,
      id: normalized.quantity === 1 && (normalized.item.id || normalized.item.uid) ? normalized.item.id : createId("item"),
      uid: normalized.quantity === 1 && (normalized.item.uid || normalized.item.id) ? normalized.item.uid || normalized.item.id : createId("item"),
      sourceItemId: normalized.itemId || normalized.item.id,
      quantity: 1,
      price: normalized.price,
      location: resolvedDestination,
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
  const combatState = createCombatantState({
    ...snapshot,
    ...clone(value),
    id: String(value.id || entityId),
    entityId,
    entityType,
    kind: entityType,
    currentPV,
    maxPV,
    conditions: value.conditions || snapshot.conditions,
    usesDeathMarks: value.usesDeathMarks ?? snapshot.usesDeathMarks ?? entityType === "character",
  });
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
    conditions: normalizeConditions(combatState.conditions),
    visible: value.visible !== false,
    isDefeated: Boolean(combatState.isDefeated),
    deathMarks: combatState.deathMarks,
    isDead: combatState.isDead,
    criticalState: combatState.criticalState,
    stabilized: combatState.stabilized,
    usesDeathMarks: combatState.usesDeathMarks,
    severeWounds: arrayOf(combatState.severeWounds).map((entry) => ({ ...clone(entry) })),
    injuries: arrayOf(combatState.injuries).map((entry) => ({ ...clone(entry) })),
    scars: arrayOf(combatState.scars).map((entry) => ({ ...clone(entry) })),
    woundHistory: arrayOf(combatState.woundHistory).map((entry) => ({ ...clone(entry) })),
    combatActionState: clone(combatState.combatActionState || {}) || {},
    equipmentCombatState: clone(combatState.equipmentCombatState || {}) || {},
    ammoCombatState: clone(combatState.ammoCombatState || {}) || {},
    lastCombatEvents: arrayOf(combatState.lastCombatEvents).map((entry) => ({ ...clone(entry) })),
    resistances: arrayOf(combatState.resistances),
    vulnerabilities: arrayOf(combatState.vulnerabilities),
    immunities: arrayOf(combatState.immunities),
    reductions: clone(combatState.reductions || {}) || {},
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

  toCombatantState(extra = {}) {
    return createCombatantState({
      ...this.snapshot,
      ...clone(extra),
      id: this.id,
      entityId: this.id,
      entityType: "character",
      ownerPlayerId: this.ownerPlayerId,
      name: this.name,
      currentPV: this.snapshot.currentPV ?? this.snapshot.pvCurrent ?? this.snapshot.pvAtual,
      maxPV: this.snapshot.maxPV ?? this.snapshot.pvMax ?? this.snapshot.pvMaximo,
      conditions: this.conditions,
      usesDeathMarks: this.snapshot.usesDeathMarks !== false,
    });
  }

  applyCombatantState(combatant = {}) {
    const state = createCombatantState({
      ...combatant,
      id: this.id,
      entityId: this.id,
      entityType: "character",
      ownerPlayerId: this.ownerPlayerId,
      name: this.name,
      usesDeathMarks: combatant.usesDeathMarks ?? this.snapshot.usesDeathMarks ?? true,
    });
    this.snapshot = normalizeSheetSnapshot({
      ...this.snapshot,
      ...state,
      id: this.id,
      characterId: this.characterId,
      ownerId: this.ownerPlayerId,
      ownerPlayerId: this.ownerPlayerId,
      name: this.name,
      currentPV: state.currentPV,
      pvCurrent: state.currentPV,
      pvAtual: state.currentPV,
      maxPV: state.maxPV,
      pvMax: state.maxPV,
      conditions: state.conditions,
      deathMarks: state.deathMarks,
      isDead: state.isDead,
      criticalState: state.criticalState,
      stabilized: state.stabilized,
      severeWounds: state.severeWounds,
      injuries: state.injuries,
      scars: state.scars,
      woundHistory: state.woundHistory,
      combatActionState: state.combatActionState,
      equipmentCombatState: state.equipmentCombatState,
      ammoCombatState: state.ammoCombatState,
      lastCombatEvents: state.lastCombatEvents,
      usesDeathMarks: state.usesDeathMarks,
    });
    this.conditions = normalizeConditions(state.conditions);
    return state;
  }

  applyDamage(amount = 0, options = {}) {
    const result = applyDamageToCombatant({
      combatant: this.toCombatantState(),
      amount,
      damageType: options.damageType || options.type || "",
      source: options.source || options.sourceLabel || options.attackName || "",
      isCritical: Boolean(options.isCritical || options.critical),
      options,
    });
    this.applyCombatantState(result.combatant);
    this.bumpRevision();
    return result;
  }

  heal(amount = 0, options = {}) {
    const result = applyHealingToCombatant({
      combatant: this.toCombatantState(),
      amount,
      source: options.source || options.sourceLabel || options.itemName || "",
    });
    this.applyCombatantState(result.combatant);
    this.bumpRevision();
    return result;
  }

  addCondition(condition = {}) {
    const result = applyConditionToCombatant({
      combatant: this.toCombatantState(),
      condition,
    });
    this.applyCombatantState(result.combatant);
    this.bumpRevision();
    return result.condition;
  }

  removeCondition(conditionId = "") {
    const result = removeConditionFromCombatant({
      combatant: this.toCombatantState(),
      conditionId,
    });
    this.applyCombatantState(result.combatant);
    this.bumpRevision();
    return result;
  }

  advanceCombatTurnStart(options = {}) {
    const ready = resetTurnActionState(this.toCombatantState());
    const result = advanceConditionDurations({
      combatant: ready,
      phase: "start",
      bleedingRoll: options.bleedingRoll,
    });
    this.applyCombatantState(result.combatant);
    this.bumpRevision();
    return result;
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
    bestiarySchemaVersion = BESTIARY_SCHEMA_VERSION,
    monsterState = null,
    monsterSource = null,
    monsterCombatProfile = null,
    monsterLootProfile = null,
    monsterMoraleProfile = null,
    monsterVariantState = null,
    monsterTemplateState = null,
    collectedResources = [],
    usedAbilities = [],
    abilityCooldowns = {},
    sourceGovernance = null,
    updatedAt = nowIso(),
  } = {}) {
    const sessionMonster = createSessionMonsterFromBestiary(
      { ...(clone(snapshot) || {}), id: definitionId || snapshot.id || id, name: name || snapshot.name },
      { id, conditions, hidden, notes }
    );
    this.id = String(id || createId("shared-monster"));
    this.definitionId = String(definitionId || sessionMonster.definitionId || "");
    this.name = String(name || sessionMonster.name || snapshot.name || "Monstro sem nome");
    this.snapshot = {
      ...(clone(sessionMonster.snapshot) || {}),
      ...(clone(snapshot) || {}),
      attacks: clone(sessionMonster.snapshot?.attacks || snapshot.attacks || []),
      abilities: clone(sessionMonster.snapshot?.abilities || snapshot.abilities || []),
      resistanceProfile: clone(sessionMonster.snapshot?.resistanceProfile || snapshot.resistanceProfile || {}) || {},
      lootProfile: clone(sessionMonster.snapshot?.lootProfile || snapshot.lootProfile || {}) || {},
      moraleProfile: clone(sessionMonster.snapshot?.moraleProfile || snapshot.moraleProfile || {}) || {},
      sensesProfile: clone(sessionMonster.snapshot?.sensesProfile || snapshot.sensesProfile || []) || [],
      tokenSize: sessionMonster.snapshot?.tokenSize ?? snapshot.tokenSize,
      tokenDefaults: clone(sessionMonster.snapshot?.tokenDefaults || snapshot.tokenDefaults || {}) || {},
      bestiarySchemaVersion,
    };
    this.hidden = Boolean(hidden);
    this.conditions = normalizeConditions(conditions.length ? conditions : this.snapshot.conditions);
    this.notes = String(notes || snapshot.notes || "");
    this.bestiarySchemaVersion = bestiarySchemaVersion;
    this.monsterState = clone(monsterState || sessionMonster.monsterState) || null;
    this.monsterSource = clone(monsterSource || sessionMonster.monsterSource) || null;
    this.monsterCombatProfile = clone(monsterCombatProfile || sessionMonster.monsterCombatProfile) || null;
    this.monsterLootProfile = clone(monsterLootProfile || sessionMonster.monsterLootProfile) || null;
    this.monsterMoraleProfile = clone(monsterMoraleProfile || sessionMonster.monsterMoraleProfile) || null;
    this.monsterVariantState = clone(monsterVariantState || sessionMonster.monsterVariantState) || null;
    this.monsterTemplateState = clone(monsterTemplateState || sessionMonster.monsterTemplateState) || null;
    this.collectedResources = arrayOf(collectedResources || sessionMonster.collectedResources).map(clone);
    this.usedAbilities = arrayOf(usedAbilities || sessionMonster.usedAbilities).map(clone);
    this.abilityCooldowns = clone(abilityCooldowns || sessionMonster.abilityCooldowns || {}) || {};
    this.sourceGovernance = clone(sourceGovernance || sessionMonster.sourceGovernance || this.snapshot.sourceGovernance) || null;
    this.updatedAt = updatedAt || nowIso();
  }

  update(patch = {}) {
    this.snapshot = { ...this.snapshot, ...clone(patch) };
    if (patch.name) this.name = String(patch.name);
    if (patch.conditions) this.conditions = normalizeConditions(patch.conditions);
    if (patch.notes !== undefined) this.notes = String(patch.notes || "");
    if (patch.monsterState) this.monsterState = clone(patch.monsterState);
    if (patch.monsterCombatProfile) this.monsterCombatProfile = clone(patch.monsterCombatProfile);
    if (patch.monsterLootProfile) this.monsterLootProfile = clone(patch.monsterLootProfile);
    if (patch.monsterMoraleProfile) this.monsterMoraleProfile = clone(patch.monsterMoraleProfile);
    this.updatedAt = nowIso();
    return this;
  }

  toCombatantState(extra = {}) {
    return createCombatantState({
      ...this.snapshot,
      ...clone(extra),
      id: this.id,
      entityId: this.id,
      entityType: "monster",
      name: this.name,
      currentPV: this.snapshot.currentPV ?? this.snapshot.pvCurrent ?? this.snapshot.pvAtual,
      maxPV: this.snapshot.maxPV ?? this.snapshot.pvMax ?? this.snapshot.pvMaximo,
      conditions: this.conditions,
      usesDeathMarks: this.snapshot.usesDeathMarks === true,
    });
  }

  applyCombatantState(combatant = {}) {
    const state = createCombatantState({
      ...combatant,
      id: this.id,
      entityId: this.id,
      entityType: "monster",
      name: this.name,
      usesDeathMarks: combatant.usesDeathMarks ?? this.snapshot.usesDeathMarks === true,
    });
    this.snapshot = {
      ...this.snapshot,
      ...state,
      id: this.id,
      currentPV: state.currentPV,
      pvCurrent: state.currentPV,
      pvAtual: state.currentPV,
      maxPV: state.maxPV,
      pvMax: state.maxPV,
      conditions: normalizeConditions(state.conditions),
      deathMarks: state.deathMarks,
      isDead: state.isDead,
      isDefeated: state.isDefeated,
      criticalState: state.criticalState,
      stabilized: state.stabilized,
      severeWounds: arrayOf(state.severeWounds).map((entry) => ({ ...clone(entry) })),
      injuries: arrayOf(state.injuries).map((entry) => ({ ...clone(entry) })),
      scars: arrayOf(state.scars).map((entry) => ({ ...clone(entry) })),
      woundHistory: arrayOf(state.woundHistory).map((entry) => ({ ...clone(entry) })),
      combatActionState: clone(state.combatActionState || {}) || {},
      equipmentCombatState: clone(state.equipmentCombatState || {}) || {},
      ammoCombatState: clone(state.ammoCombatState || {}) || {},
      lastCombatEvents: arrayOf(state.lastCombatEvents).map((entry) => ({ ...clone(entry) })),
      usesDeathMarks: state.usesDeathMarks,
    };
    this.conditions = normalizeConditions(state.conditions);
    this.updatedAt = nowIso();
    return state;
  }

  applyDamage(amount = 0, options = {}) {
    const result = applyDamageToCombatant({
      combatant: this.toCombatantState(),
      amount,
      damageType: options.damageType || options.type || "",
      source: options.source || options.sourceLabel || options.attackName || "",
      isCritical: Boolean(options.isCritical || options.critical),
      options,
    });
    this.applyCombatantState(result.combatant);
    this.updatedAt = nowIso();
    return result;
  }

  heal(amount = 0, options = {}) {
    const result = applyHealingToCombatant({
      combatant: this.toCombatantState(),
      amount,
      source: options.source || options.sourceLabel || options.itemName || "",
    });
    this.applyCombatantState(result.combatant);
    this.updatedAt = nowIso();
    return result;
  }

  addCondition(condition = {}) {
    const result = applyConditionToCombatant({
      combatant: this.toCombatantState(),
      condition,
    });
    this.applyCombatantState(result.combatant);
    this.updatedAt = nowIso();
    return result.condition;
  }

  removeCondition(conditionId = "") {
    const result = removeConditionFromCombatant({
      combatant: this.toCombatantState(),
      conditionId,
    });
    this.applyCombatantState(result.combatant);
    this.updatedAt = nowIso();
    return result;
  }

  advanceCombatTurnStart(options = {}) {
    const ready = resetTurnActionState(this.toCombatantState());
    const result = advanceConditionDurations({
      combatant: ready,
      phase: "start",
      bleedingRoll: options.bleedingRoll,
    });
    this.applyCombatantState(result.combatant);
    this.updatedAt = nowIso();
    return result;
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
      bestiarySchemaVersion: this.bestiarySchemaVersion,
      monsterState: clone(this.monsterState),
      monsterSource: clone(this.monsterSource),
      monsterCombatProfile: clone(this.monsterCombatProfile),
      monsterLootProfile: clone(this.monsterLootProfile),
      monsterMoraleProfile: clone(this.monsterMoraleProfile),
      monsterVariantState: clone(this.monsterVariantState),
      monsterTemplateState: clone(this.monsterTemplateState),
      collectedResources: this.collectedResources.map((entry) => ({ ...clone(entry) })),
      usedAbilities: this.usedAbilities.map((entry) => ({ ...clone(entry) })),
      abilityCooldowns: clone(this.abilityCooldowns),
      sourceGovernance: clone(this.sourceGovernance),
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
    description = "",
    mapImage = "",
    gridSize = 64,
    gridVisible = true,
    gridOpacity = 0.38,
    gridColor = "#1aa8ff",
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
    publicNotes = "",
    gmNotes = "",
    lighting = "",
    illumination = "",
    climate = "",
    weather = "",
    danger = "",
    dangerLevel = "",
    linkedMonsters = [],
    linkedNpcs = [],
    loreId = "",
    loreLinks = [],
    metadata = {},
  } = {}) {
    this.id = String(id || createId("scene"));
    this.name = String(name || "Cena sem nome");
    this.description = String(description || notes || "");
    this.mapImage = String(mapImage || "");
    this.gridSize = Math.max(1, numeric(gridSize, 64));
    this.gridVisible = gridVisible !== false;
    this.gridOpacity = Math.max(0, Math.min(1, numeric(gridOpacity, 0.38)));
    this.gridColor = String(gridColor || "#1aa8ff");
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
    this.publicNotes = String(publicNotes || notes || "");
    this.gmNotes = String(gmNotes || "");
    this.lighting = String(lighting || illumination || "");
    this.illumination = this.lighting;
    this.climate = String(climate || weather || "");
    this.weather = this.climate;
    this.danger = String(danger || dangerLevel || "");
    this.dangerLevel = this.danger;
    this.linkedMonsters = arrayOf(linkedMonsters).map((entry) => clone(entry));
    this.linkedNpcs = arrayOf(linkedNpcs).map((entry) => clone(entry));
    this.loreId = String(loreId || "");
    this.loreLinks = normalizeTags(loreLinks || (loreId ? [loreId] : []));
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
      shape: String(zone.shape || zone.forma || "rectangle"),
      direction: String(zone.direction || zone.facing || ""),
      opacity: Math.max(0, Math.min(1, numeric(zone.opacity, 0.32))),
      color: String(zone.color || ""),
      notes: String(zone.notes || ""),
      description: String(zone.description || zone.notes || ""),
      mechanicalEffect: String(zone.mechanicalEffect || zone.effect || ""),
      duration: String(zone.duration || ""),
      hidden: Boolean(zone.hidden),
      visibleToPlayers: zone.visibleToPlayers !== false && !zone.hidden,
      metadata: clone(zone.metadata) || {},
    };
  }

  normalizeArea(area = {}) {
    const direction = String(area.direction || area.facing || area.metadata?.direction || "east").toLowerCase();
    return {
      id: String(area.id || createId("area")),
      type: String(area.type || "circle"),
      x: bounded(area.x, 1, this.columns, 1),
      y: bounded(area.y, 1, this.rows, 1),
      radius: Math.max(0, numeric(area.radius, 2)),
      length: Math.max(1, numeric(area.length, area.radius || 4)),
      width: Math.max(1, numeric(area.width, 1)),
      direction: ["east", "west", "north", "south"].includes(direction) ? direction : "east",
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
      color: String(objective.color || "#f2c35b"),
      icon: String(objective.icon || ""),
      reward: String(objective.reward || ""),
      gmNotes: String(objective.gmNotes || ""),
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

  areaContainsPoint(areaRef = {}, point = {}) {
    const area = typeof areaRef === "string"
      ? this.areas.find((entry) => entry.id === areaRef)
      : this.normalizeArea(areaRef);
    if (!area) return false;
    const x = numeric(point.x, 0);
    const y = numeric(point.y, 0);
    if (area.type === "circle") return this.measureDistanceCells(area.x, area.y, x, y) <= Math.max(0, numeric(area.radius, 0));
    const dx = x - area.x;
    const dy = y - area.y;
    const length = Math.max(1, numeric(area.length, 1));
    const width = Math.max(1, numeric(area.width, 1));
    const direction = String(area.direction || "east").toLowerCase();
    let along = dx;
    let side = dy;
    if (direction === "west") {
      along = -dx;
      side = dy;
    } else if (direction === "south") {
      along = dy;
      side = dx;
    } else if (direction === "north") {
      along = -dy;
      side = dx;
    }
    if (area.type === "cone") {
      if (along < 0 || along > length) return false;
      const halfWidth = Math.max(0.5, (width / 2) * (along / length));
      return Math.abs(side) <= halfWidth;
    }
    if (area.type === "line") {
      return along >= 0 && along <= length && Math.abs(side) <= width / 2;
    }
    return along >= 0 && along <= length && Math.abs(side) <= width / 2;
  }

  tokensInsideArea(areaRef = {}) {
    const area = typeof areaRef === "string"
      ? this.areas.find((entry) => entry.id === areaRef)
      : this.normalizeArea(areaRef);
    if (!area) return [];
    return this.tokens.filter((token) => this.areaContainsPoint(area, token));
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
    if (patch.description !== undefined) this.description = String(patch.description || "");
    if (patch.mapImage !== undefined) this.mapImage = String(patch.mapImage || "");
    if (patch.gridSize !== undefined) this.gridSize = Math.max(1, numeric(patch.gridSize, this.gridSize));
    if (patch.gridVisible !== undefined) this.gridVisible = patch.gridVisible !== false;
    if (patch.gridOpacity !== undefined) this.gridOpacity = Math.max(0, Math.min(1, numeric(patch.gridOpacity, this.gridOpacity)));
    if (patch.gridColor !== undefined) this.gridColor = String(patch.gridColor || this.gridColor);
    if (patch.snapToGrid !== undefined) this.snapToGrid = patch.snapToGrid !== false;
    if (patch.metersPerCell !== undefined) this.metersPerCell = Math.max(0.1, numeric(patch.metersPerCell, this.metersPerCell));
    if (patch.columns !== undefined) this.columns = Math.max(4, Math.floor(numeric(patch.columns, this.columns)));
    if (patch.rows !== undefined) this.rows = Math.max(4, Math.floor(numeric(patch.rows, this.rows)));
    if (patch.notes !== undefined) this.notes = String(patch.notes || "");
    if (patch.publicNotes !== undefined) this.publicNotes = String(patch.publicNotes || "");
    if (patch.gmNotes !== undefined) this.gmNotes = String(patch.gmNotes || "");
    if (patch.lighting !== undefined || patch.illumination !== undefined) {
      this.lighting = String(patch.lighting || patch.illumination || "");
      this.illumination = this.lighting;
    }
    if (patch.climate !== undefined || patch.weather !== undefined) {
      this.climate = String(patch.climate || patch.weather || "");
      this.weather = this.climate;
    }
    if (patch.danger !== undefined || patch.dangerLevel !== undefined) {
      this.danger = String(patch.danger || patch.dangerLevel || "");
      this.dangerLevel = this.danger;
    }
    if (patch.metadata) this.metadata = { ...this.metadata, ...clone(patch.metadata) };
    if (patch.linkedMonsters) this.linkedMonsters = arrayOf(patch.linkedMonsters).map((entry) => clone(entry));
    if (patch.linkedNpcs) this.linkedNpcs = arrayOf(patch.linkedNpcs).map((entry) => clone(entry));
    if (patch.loreId !== undefined) this.loreId = String(patch.loreId || "");
    if (patch.loreLinks) this.loreLinks = normalizeTags(patch.loreLinks);
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
      description: this.description,
      mapImage: this.mapImage,
      gridSize: this.gridSize,
      gridVisible: this.gridVisible,
      gridOpacity: this.gridOpacity,
      gridColor: this.gridColor,
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
      publicNotes: this.publicNotes,
      gmNotes: this.gmNotes,
      lighting: this.lighting,
      illumination: this.illumination,
      climate: this.climate,
      weather: this.weather,
      danger: this.danger,
      dangerLevel: this.dangerLevel,
      linkedMonsters: this.linkedMonsters.map((entry) => clone(entry)),
      linkedNpcs: this.linkedNpcs.map((entry) => clone(entry)),
      loreId: this.loreId,
      loreLinks: this.loreLinks.map((entry) => String(entry)),
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
    const result = applyDamageToCombatant({ combatant, amount });
    const next = this.upsertCombatant(result.combatant);
    return { ...result, combatant: next };
  }

  heal(entityId = "", amount = 0) {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    const result = applyHealingToCombatant({ combatant, amount });
    const next = this.upsertCombatant(result.combatant);
    return { ...result, combatant: next };
  }

  addCondition(entityId = "", condition = {}) {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    const result = applyConditionToCombatant({ combatant, condition });
    this.upsertCombatant(result.combatant);
    return result.condition;
  }

  removeCondition(entityId = "", conditionId = "") {
    const combatant = this.getCombatant(entityId);
    if (!combatant) return null;
    const result = removeConditionFromCombatant({ combatant, conditionId });
    return this.upsertCombatant(result.combatant);
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
    if (GM_DASHBOARD_EVENTS.has(action)) return false;
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
    gmNotes = [],
    revealedNotes = [],
    gmCounters = [],
    counters = [],
    environmentalEffects = [],
    preparedEncounters = [],
    sessionReports = [],
    sceneList = [],
    scenes = [],
    activeSceneId = "",
    gmDashboardSettings = {},
    gmState = {},
    gmSchemaVersion = GM_SCHEMA_VERSION,
    activeMissionId = "",
    missions = [],
    travelRoutes = [],
    resourceTracks = [],
    factionStates = [],
    reputationLog = [],
    campaignClocks = [],
    gmEvents = [],
    rewards = [],
    consequences = [],
    hackingChallenges = [],
    bases = [],
    loreState = {},
    loreSchemaVersion = LORE_SCHEMA_VERSION,
    pinnedLoreEntries = [],
    discoveredLoreEntries = [],
    secretLoreEntries = [],
    loreNotes = [],
    loreRelations = [],
    reportLoreEntries = [],
    missionLoreLinks = [],
    factionLoreLinks = [],
    locationLoreLinks = [],
    npcLoreLinks = [],
    monsterLoreLinks = [],
    itemLoreLinks = [],
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
    this.gmNotes = arrayOf(gmNotes).map(normalizeGmNote);
    this.revealedNotes = arrayOf(revealedNotes).map(normalizeGmNote);
    this.gmCounters = arrayOf(gmCounters.length ? gmCounters : counters).map(normalizeGmCounter);
    this.environmentalEffects = arrayOf(environmentalEffects).map(normalizeEnvironmentalEffect);
    this.preparedEncounters = arrayOf(preparedEncounters).map(normalizePreparedEncounter);
    this.sessionReports = arrayOf(sessionReports).map(normalizeSessionReport);
    this.sceneList = normalizeSceneList(arrayOf(sceneList).length ? sceneList : scenes, this.scene.toJSON());
    this.activeSceneId = String(activeSceneId || this.scene.id || this.sceneList[0]?.id || "");
    this.gmDashboardSettings = normalizeGmDashboardSettings(gmDashboardSettings);
    const hydratedGmState = hydrateGmState({
      ...(clone(gmState) || {}),
      gmSchemaVersion,
      activeMissionId,
      missions,
      travelRoutes,
      resourceTracks,
      factionStates,
      reputationLog,
      campaignClocks,
      gmEvents,
      rewards,
      consequences,
      hackingChallenges,
      bases,
    });
    this.gmSchemaVersion = hydratedGmState.gmSchemaVersion;
    this.activeMissionId = hydratedGmState.activeMissionId;
    this.missions = hydratedGmState.missions;
    this.travelRoutes = hydratedGmState.travelRoutes;
    this.resourceTracks = hydratedGmState.resourceTracks;
    this.factionStates = hydratedGmState.factionStates;
    this.reputationLog = hydratedGmState.reputationLog;
    this.campaignClocks = hydratedGmState.campaignClocks;
    this.gmEvents = hydratedGmState.gmEvents;
    this.rewards = hydratedGmState.rewards;
    this.consequences = hydratedGmState.consequences;
    this.hackingChallenges = hydratedGmState.hackingChallenges;
    this.bases = hydratedGmState.bases;
    this.loreState = hydrateLoreState({
      ...(clone(loreState) || {}),
      loreSchemaVersion,
      pinnedLoreEntries,
      discoveredLoreEntries,
      secretLoreEntries,
      loreNotes,
      relations: loreRelations,
      reportLoreEntries,
      missionLoreLinks,
      factionLoreLinks,
      locationLoreLinks,
      npcLoreLinks,
      monsterLoreLinks,
      itemLoreLinks,
    });
    this.loreSchemaVersion = this.loreState.loreSchemaVersion;
    this.pinnedLoreEntries = this.loreState.pinnedLoreEntries;
    this.discoveredLoreEntries = this.loreState.discoveredLoreEntries;
    this.secretLoreEntries = this.loreState.secretLoreEntries;
    this.loreNotes = this.loreState.loreNotes;
    this.loreRelations = this.loreState.relations;
    this.reportLoreEntries = this.loreState.reportLoreEntries;
    this.missionLoreLinks = this.loreState.missionLoreLinks;
    this.factionLoreLinks = this.loreState.factionLoreLinks;
    this.locationLoreLinks = this.loreState.locationLoreLinks;
    this.npcLoreLinks = this.loreState.npcLoreLinks;
    this.monsterLoreLinks = this.loreState.monsterLoreLinks;
    this.itemLoreLinks = this.loreState.itemLoreLinks;
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

  setLoreState(nextLoreState = {}) {
    this.loreState = hydrateLoreState(nextLoreState);
    this.loreSchemaVersion = this.loreState.loreSchemaVersion;
    this.pinnedLoreEntries = this.loreState.pinnedLoreEntries;
    this.discoveredLoreEntries = this.loreState.discoveredLoreEntries;
    this.secretLoreEntries = this.loreState.secretLoreEntries;
    this.loreNotes = this.loreState.loreNotes;
    this.loreRelations = this.loreState.relations;
    this.reportLoreEntries = this.loreState.reportLoreEntries;
    this.missionLoreLinks = this.loreState.missionLoreLinks;
    this.factionLoreLinks = this.loreState.factionLoreLinks;
    this.locationLoreLinks = this.loreState.locationLoreLinks;
    this.npcLoreLinks = this.loreState.npcLoreLinks;
    this.monsterLoreLinks = this.loreState.monsterLoreLinks;
    this.itemLoreLinks = this.loreState.itemLoreLinks;
    return this.loreState;
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
      case GAME_EVENT_TYPES.GM_DASHBOARD_STATE:
      case GAME_EVENT_TYPES.GM_NOTE_CREATE:
      case GAME_EVENT_TYPES.GM_NOTE_UPDATE:
      case GAME_EVENT_TYPES.GM_NOTE_DELETE:
      case GAME_EVENT_TYPES.GM_NOTE_REVEAL:
      case GAME_EVENT_TYPES.GM_COUNTER_CREATE:
      case GAME_EVENT_TYPES.GM_COUNTER_UPDATE:
      case GAME_EVENT_TYPES.GM_COUNTER_DELETE:
      case GAME_EVENT_TYPES.GM_COUNTER_TICK:
      case GAME_EVENT_TYPES.GM_COUNTER_REVEAL:
      case GAME_EVENT_TYPES.GM_ENVIRONMENT_CREATE:
      case GAME_EVENT_TYPES.GM_ENVIRONMENT_UPDATE:
      case GAME_EVENT_TYPES.GM_ENVIRONMENT_DELETE:
      case GAME_EVENT_TYPES.GM_SCENE_CREATE:
      case GAME_EVENT_TYPES.GM_SCENE_UPDATE:
      case GAME_EVENT_TYPES.GM_SCENE_DELETE:
      case GAME_EVENT_TYPES.GM_SCENE_SWITCH:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_DELETE:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_START:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_COMPLETE:
      case GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE:
      case GAME_EVENT_TYPES.GM_SHIELD_SEARCH:
      case GAME_EVENT_TYPES.GM_SHIELD_PIN:
      case GAME_EVENT_TYPES.GM_SHIELD_SEND_TO_CHAT:
      case GAME_EVENT_TYPES.GM_LORE_PIN:
      case GAME_EVENT_TYPES.GM_LORE_DISCOVER:
      case GAME_EVENT_TYPES.GM_LORE_SECRET:
      case GAME_EVENT_TYPES.GM_LORE_NOTE:
      case GAME_EVENT_TYPES.GM_LORE_REPORT:
      case GAME_EVENT_TYPES.GM_LORE_RELATION:
      case GAME_EVENT_TYPES.GM_LORE_MISSION:
      case GAME_EVENT_TYPES.GM_LORE_ENCOUNTER:
      case GAME_EVENT_TYPES.GM_LORE_NPC:
      case GAME_EVENT_TYPES.GM_LORE_SCENE:
      case GAME_EVENT_TYPES.GM_LORE_CLOCK:
      case GAME_EVENT_TYPES.GM_LORE_FACTION:
      case GAME_EVENT_TYPES.GM_REPORT_EXPORT:
      case GAME_EVENT_TYPES.GM_REPORT_SAVE:
        return this.applyGmDashboardEvent(event.type, payload, actor);
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
        if (GM_DASHBOARD_EVENTS.has(event.type)) {
          return this.applyGmDashboardEvent(event.type, payload, actor);
        }
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

  addCombatRuleLogEvents(result = {}, actor = null, target = {}, skipTypes = []) {
    const skipped = new Set(skipTypes);
    for (const entry of arrayOf(result.logEvents)) {
      if (!entry?.message || skipped.has(entry.type)) continue;
      this.addCombatLog({
        type: entry.type || "combat:rule",
        actorId: actor?.id || "",
        actorName: actor?.name || "Sistema Solaris",
        targetId: target.id || target.entityId || "",
        targetName: target.name || "",
        message: entry.message,
        data: clone(entry.data || {}) || {},
      });
    }
  }

  applyTurnStartEffects(entry = {}, actor = null) {
    const target = entry.entityType === "monster"
      ? this.getMonster(entry.entityId)
      : this.getCharacter(entry.entityId);
    if (!target?.advanceCombatTurnStart) return null;
    const result = target.advanceCombatTurnStart();
    this.syncCombatants();
    this.addCombatRuleLogEvents(result, actor, target, []);
    return result;
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
      size: numeric(snapshot.tokenSize ?? snapshot.tokenDefaults?.size ?? snapshot.size, 1),
      image: snapshot.portrait || snapshot.photoDataUrl || snapshot.imageDataUrl || snapshot.image || "",
      color: isMonster ? "#ff4e63" : "#39cfff",
      hidden: Boolean(entity.hidden),
      metadata: {
        tier: snapshot.tier || "",
        role: snapshot.role || "",
        ca: snapshot.ca ?? snapshot.CA ?? "",
        movement: snapshot.movement ?? snapshot.movimento ?? "",
        bestiarySchemaVersion: snapshot.bestiarySchemaVersion || "",
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
        existing.size = numeric(monster.snapshot?.tokenSize ?? monster.snapshot?.tokenDefaults?.size, existing.size);
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
      this.applyTurnStartEffects(entry, actor);
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

  gmDashboardStateFor(actor = null) {
    const isGm = Boolean(actor?.isGM);
    const visibleNote = (note) => note.visibleToPlayers || note.revealed;
    const visibleCounter = (counter) => counter.visibleToPlayers || counter.revealed;
    const visibleEffect = (effect) => effect.visibleToPlayers || effect.revealed;
    const visibleEntry = (entry) => entry.visibleToPlayers || entry.revealed;
    const fullLoreState = serializeLoreState(this.loreState);
    const visibleLoreState = isGm ? fullLoreState : serializeLoreState({
      ...fullLoreState,
      entries: fullLoreState.entries.filter((entry) =>
        entry.visibleToPlayers ||
        entry.revealed ||
        entry.secretLevel === LORE_SECRET_LEVELS.PUBLIC ||
        entry.discoveryState === LORE_DISCOVERY_STATES.REVEALED
      ),
      relations: fullLoreState.relations.filter((relation) => relation.public && !relation.secret),
      loreNotes: fullLoreState.loreNotes.filter((note) => note.visibleToPlayers || note.revealed),
      reportLoreEntries: [],
    });
    const gmState = serializeGmState({
      gmSchemaVersion: this.gmSchemaVersion,
      activeMissionId: this.activeMissionId,
      missions: isGm ? this.missions : this.missions.filter(visibleEntry),
      travelRoutes: isGm ? this.travelRoutes : this.travelRoutes.filter(visibleEntry),
      resourceTracks: isGm ? this.resourceTracks : this.resourceTracks.filter((entry) => entry.shared || visibleEntry(entry)),
      factionStates: isGm ? this.factionStates : this.factionStates.filter(visibleEntry),
      reputationLog: isGm ? this.reputationLog : this.reputationLog.filter(visibleEntry),
      campaignClocks: isGm ? this.campaignClocks : this.campaignClocks.filter(visibleEntry),
      gmEvents: isGm ? this.gmEvents : this.gmEvents.filter(visibleEntry),
      rewards: isGm ? this.rewards : this.rewards.filter(visibleEntry),
      consequences: isGm ? this.consequences : this.consequences.filter(visibleEntry),
      hackingChallenges: isGm ? this.hackingChallenges : [],
      bases: isGm ? this.bases : this.bases.filter(visibleEntry),
    });
    return {
      gmNotes: isGm ? this.gmNotes.map(clone) : this.gmNotes.filter(visibleNote).map(clone),
      revealedNotes: this.revealedNotes.map(clone),
      gmCounters: isGm ? this.gmCounters.map(clone) : this.gmCounters.filter(visibleCounter).map(clone),
      environmentalEffects: isGm ? this.environmentalEffects.map(clone) : this.environmentalEffects.filter(visibleEffect).map(clone),
      preparedEncounters: isGm ? this.preparedEncounters.map(clone) : [],
      sessionReports: isGm ? this.sessionReports.map(clone) : [],
      sceneList: this.sceneList.map(clone),
      activeSceneId: this.activeSceneId,
      settings: isGm ? clone(this.gmDashboardSettings) : {},
      gmState,
      gmSchemaVersion: gmState.gmSchemaVersion,
      activeMissionId: gmState.activeMissionId,
      missions: gmState.missions,
      travelRoutes: gmState.travelRoutes,
      resourceTracks: gmState.resourceTracks,
      factionStates: gmState.factionStates,
      reputationLog: gmState.reputationLog,
      campaignClocks: gmState.campaignClocks,
      gmEvents: gmState.gmEvents,
      rewards: gmState.rewards,
      consequences: gmState.consequences,
      hackingChallenges: gmState.hackingChallenges,
      bases: gmState.bases,
      loreSchemaVersion: visibleLoreState.loreSchemaVersion,
      loreState: visibleLoreState,
      pinnedLoreEntries: visibleLoreState.pinnedLoreEntries,
      discoveredLoreEntries: visibleLoreState.discoveredLoreEntries,
      secretLoreEntries: isGm ? visibleLoreState.secretLoreEntries : [],
      loreNotes: visibleLoreState.loreNotes,
      loreRelations: visibleLoreState.relations,
      reportLoreEntries: isGm ? visibleLoreState.reportLoreEntries : [],
      missionLoreLinks: visibleLoreState.missionLoreLinks,
      factionLoreLinks: visibleLoreState.factionLoreLinks,
      locationLoreLinks: visibleLoreState.locationLoreLinks,
      npcLoreLinks: visibleLoreState.npcLoreLinks,
      monsterLoreLinks: visibleLoreState.monsterLoreLinks,
      itemLoreLinks: visibleLoreState.itemLoreLinks,
    };
  }

  applyGmDashboardEvent(type, payload = {}, actor = null) {
    this.assertAllowed(actor, type);
    if (type === GAME_EVENT_TYPES.GM_DASHBOARD_STATE) return this.gmDashboardStateFor(actor);

    const addGmRuleEvent = (entry = {}) => {
      const gmEvent = createGmRuleEvent({
        ...entry,
        actorId: actor?.id || entry.actorId || "",
        actorName: actor?.name || entry.actorName || "Mestre",
      });
      this.gmEvents = [gmEvent, ...this.gmEvents].slice(0, 160);
      return gmEvent;
    };
    const findMission = (missionId = "") => {
      const id = String(missionId || payload.missionId || payload.id || "");
      return this.missions.find((entry) => entry.id === id) || this.missions.find((entry) => entry.id === this.activeMissionId) || null;
    };
    const upsertMission = (mission = {}) => {
      const normalized = normalizeMissionEntry(mission);
      this.missions = [normalized, ...this.missions.filter((entry) => entry.id !== normalized.id)].slice(0, 80);
      if (!this.activeMissionId) this.activeMissionId = normalized.id;
      return normalized;
    };

    if (type === GAME_EVENT_TYPES.GM_MISSION_CREATE) {
      const mission = upsertMission({ ...payload.mission, ...payload });
      addGmRuleEvent({ type: "mission", targetId: mission.id, targetName: mission.name, message: `Missao criada: ${mission.name}.`, visibleToPlayers: mission.visibleToPlayers });
      return mission;
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_UPDATE) {
      const current = findMission(payload.missionId || payload.id);
      if (!current) throw new Error("Missao nao encontrada.");
      const mission = upsertMission({ ...current, ...(payload.patch || payload), id: current.id, createdAt: current.createdAt, updatedAt: nowIso() });
      return mission;
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_DELETE) {
      const missionId = payload.missionId || payload.id;
      const mission = findMission(missionId);
      this.missions = this.missions.filter((entry) => entry.id !== missionId);
      if (this.activeMissionId === missionId) this.activeMissionId = this.missions[0]?.id || "";
      return mission || null;
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_ADVANCE) {
      const current = findMission(payload.missionId || payload.id);
      if (!current) throw new Error("Missao nao encontrada.");
      const mission = upsertMission(advanceMissionPhase(current, payload.phase || payload.direction || "next"));
      addGmRuleEvent({ type: "mission", targetId: mission.id, targetName: mission.name, message: `Missao avancou para ${mission.phase}.`, visibleToPlayers: mission.visibleToPlayers });
      return mission;
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_CREATE) {
      const current = findMission(payload.missionId || payload.id);
      if (!current) throw new Error("Missao nao encontrada.");
      const objective = createMissionObjective(payload.objective || payload);
      const mission = upsertMission({ ...current, objectives: [...arrayOf(current.objectives), objective], updatedAt: nowIso() });
      return { mission, objective };
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_COMPLETE || type === GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_FAIL) {
      const current = findMission(payload.missionId || payload.id);
      if (!current) throw new Error("Missao nao encontrada.");
      const objectiveId = payload.objectiveId || payload.id || payload.title || "";
      const mission = upsertMission(type === GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_COMPLETE
        ? completeMissionObjective(current, objectiveId)
        : failMissionObjective(current, objectiveId));
      addGmRuleEvent({ type: "mission", targetId: mission.id, targetName: mission.name, message: `Objetivo ${type === GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_COMPLETE ? "concluido" : "falhou"} em ${mission.name}.`, visibleToPlayers: mission.visibleToPlayers });
      return mission;
    }
    if (type === GAME_EVENT_TYPES.GM_MISSION_COMPLICATION) {
      const current = findMission(payload.missionId || payload.id);
      if (!current) throw new Error("Missao nao encontrada.");
      const resolved = resolveMissionComplication(current, payload);
      const mission = upsertMission(resolved.mission);
      addGmRuleEvent({ type: "mission", targetId: mission.id, targetName: mission.name, roll: resolved.complication.roll, message: `Complicacao: ${resolved.complication.description}`, visibleToPlayers: mission.visibleToPlayers });
      return { mission, complication: resolved.complication };
    }

    if (type === GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_CREATE) {
      const route = createTravelRoute({ ...payload.route, ...payload });
      this.travelRoutes = [route, ...this.travelRoutes.filter((entry) => entry.id !== route.id)].slice(0, 80);
      addGmRuleEvent({ type: "travel", targetId: route.id, targetName: route.name, message: `Rota criada: ${route.name}.`, visibleToPlayers: route.visibleToPlayers });
      return route;
    }
    if (type === GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_UPDATE) {
      const routeId = payload.routeId || payload.id;
      const current = this.travelRoutes.find((entry) => entry.id === routeId);
      if (!current) throw new Error("Rota nao encontrada.");
      const route = createTravelRoute({ ...current, ...(payload.patch || payload), id: current.id, createdAt: current.createdAt, updatedAt: nowIso() });
      this.travelRoutes = [route, ...this.travelRoutes.filter((entry) => entry.id !== route.id)].slice(0, 80);
      return route;
    }
    if (type === GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_DELETE) {
      const routeId = payload.routeId || payload.id;
      const route = this.travelRoutes.find((entry) => entry.id === routeId);
      this.travelRoutes = this.travelRoutes.filter((entry) => entry.id !== routeId);
      return route || null;
    }
    if (type === GAME_EVENT_TYPES.GM_TRAVEL_EVENT) {
      const routeId = payload.routeId || payload.id;
      const current = this.travelRoutes.find((entry) => entry.id === routeId);
      if (!current) throw new Error("Rota nao encontrada.");
      const resolved = resolveTravelEvent(current, payload);
      this.travelRoutes = [resolved.route, ...this.travelRoutes.filter((entry) => entry.id !== resolved.route.id)].slice(0, 80);
      addGmRuleEvent({ ...resolved.event, visibleToPlayers: resolved.route.visibleToPlayers });
      return resolved;
    }

    if (type === GAME_EVENT_TYPES.GM_RESOURCE_CREATE) {
      const resource = createResourceTrack({ ...payload.resource, ...payload });
      this.resourceTracks = [resource, ...this.resourceTracks.filter((entry) => entry.id !== resource.id)].slice(0, 80);
      return resource;
    }
    if (type === GAME_EVENT_TYPES.GM_RESOURCE_CONSUME || type === GAME_EVENT_TYPES.GM_RESOURCE_RESTORE) {
      const resourceId = payload.resourceId || payload.id;
      const current = this.resourceTracks.find((entry) => entry.id === resourceId);
      if (!current) throw new Error("Recurso nao encontrado.");
      const resource = type === GAME_EVENT_TYPES.GM_RESOURCE_CONSUME
        ? consumeResource(current, payload.amount ?? 1, payload.reason || payload.message || "")
        : restoreResource(current, payload.amount ?? 1, payload.reason || payload.message || "");
      this.resourceTracks = [resource, ...this.resourceTracks.filter((entry) => entry.id !== resource.id)].slice(0, 80);
      addGmRuleEvent({ type: "resource", targetId: resource.id, targetName: resource.name, message: `${resource.name}: ${resource.current}/${resource.max}.`, visibleToPlayers: resource.shared });
      return resource;
    }

    if (type === GAME_EVENT_TYPES.GM_FACTION_CREATE) {
      const faction = createFactionState({ ...payload.faction, ...payload });
      this.factionStates = [faction, ...this.factionStates.filter((entry) => entry.id !== faction.id)].slice(0, 80);
      return faction;
    }
    if (type === GAME_EVENT_TYPES.GM_FACTION_UPDATE || type === GAME_EVENT_TYPES.GM_FACTION_REPUTATION) {
      const factionId = payload.factionId || payload.id;
      const current = this.factionStates.find((entry) => entry.id === factionId);
      if (!current) throw new Error("Faccao nao encontrada.");
      const faction = type === GAME_EVENT_TYPES.GM_FACTION_REPUTATION
        ? updateFactionReputation(current, payload.delta ?? 0, payload.reason || payload.message || "")
        : createFactionState({ ...current, ...(payload.patch || payload), id: current.id, createdAt: current.createdAt, updatedAt: nowIso() });
      this.factionStates = [faction, ...this.factionStates.filter((entry) => entry.id !== faction.id)].slice(0, 80);
      if (type === GAME_EVENT_TYPES.GM_FACTION_REPUTATION) {
        const last = faction.history[0] || createGmRuleEvent({ type: "reputation", targetId: faction.id, targetName: faction.name, message: `Reputacao ${faction.reputation}.` });
        this.reputationLog = [last, ...this.reputationLog].slice(0, 120);
      }
      return faction;
    }

    if (type === GAME_EVENT_TYPES.GM_CLOCK_CREATE) {
      const clock = createCampaignClock({ ...payload.clock, ...payload });
      this.campaignClocks = [clock, ...this.campaignClocks.filter((entry) => entry.id !== clock.id)].slice(0, 80);
      return clock;
    }
    if (type === GAME_EVENT_TYPES.GM_CLOCK_ADVANCE || type === GAME_EVENT_TYPES.GM_CLOCK_RESOLVE) {
      const clockId = payload.clockId || payload.id;
      const current = this.campaignClocks.find((entry) => entry.id === clockId);
      if (!current) throw new Error("Contador de campanha nao encontrado.");
      const clock = type === GAME_EVENT_TYPES.GM_CLOCK_ADVANCE
        ? advanceCampaignClock(current, payload.amount ?? 1)
        : resolveCampaignClock(current, payload);
      this.campaignClocks = [clock, ...this.campaignClocks.filter((entry) => entry.id !== clock.id)].slice(0, 80);
      addGmRuleEvent({ type: "clock", targetId: clock.id, targetName: clock.name, message: `${clock.name}: ${clock.current}/${clock.max}.`, visibleToPlayers: clock.visibleToPlayers });
      return clock;
    }

    if (type === GAME_EVENT_TYPES.GM_HACKING_CREATE) {
      const challenge = createHackingChallenge({ ...payload.challenge, ...payload });
      this.hackingChallenges = [challenge, ...this.hackingChallenges.filter((entry) => entry.id !== challenge.id)].slice(0, 60);
      return challenge;
    }
    if (type === GAME_EVENT_TYPES.GM_HACKING_ADVANCE || type === GAME_EVENT_TYPES.GM_HACKING_FAIL) {
      const challengeId = payload.challengeId || payload.id;
      const current = this.hackingChallenges.find((entry) => entry.id === challengeId);
      if (!current) throw new Error("Desafio de hacking nao encontrado.");
      const challenge = type === GAME_EVENT_TYPES.GM_HACKING_ADVANCE
        ? advanceHackingChallenge(current, payload)
        : failHackingChallenge(current, payload.reason || payload.message || "");
      this.hackingChallenges = [challenge, ...this.hackingChallenges.filter((entry) => entry.id !== challenge.id)].slice(0, 60);
      return challenge;
    }

    if (type === GAME_EVENT_TYPES.GM_BASE_CREATE) {
      const base = createBaseState({ ...payload.base, ...payload });
      this.bases = [base, ...this.bases.filter((entry) => entry.id !== base.id)].slice(0, 40);
      return base;
    }
    if (type === GAME_EVENT_TYPES.GM_BASE_UPDATE || type === GAME_EVENT_TYPES.GM_BASE_RESOURCE_UPDATE || type === GAME_EVENT_TYPES.GM_BASE_PROJECT_ADVANCE || type === GAME_EVENT_TYPES.GM_BASE_EVENT) {
      const baseId = payload.baseId || payload.id;
      const current = this.bases.find((entry) => entry.id === baseId);
      if (!current) throw new Error("Base ou colonia nao encontrada.");
      const result = type === GAME_EVENT_TYPES.GM_BASE_RESOURCE_UPDATE
        ? updateBaseResource(current, payload.resource || payload.resourceKey || "", payload.delta ?? 0, payload.reason || "")
        : type === GAME_EVENT_TYPES.GM_BASE_PROJECT_ADVANCE
          ? advanceBaseProject(current, payload.projectId || payload.id || "", payload.amount ?? 1)
          : type === GAME_EVENT_TYPES.GM_BASE_EVENT
            ? resolveBaseEvent(current, payload)
            : createBaseState({ ...current, ...(payload.patch || payload), id: current.id, createdAt: current.createdAt, updatedAt: nowIso() });
      const base = result.base || result;
      this.bases = [base, ...this.bases.filter((entry) => entry.id !== base.id)].slice(0, 40);
      if (result.event) addGmRuleEvent(result.event);
      return result;
    }

    if (type === GAME_EVENT_TYPES.GM_REWARD_CREATE) {
      const applied = applyMissionReward({ rewards: this.rewards, gmEvents: this.gmEvents }, payload.reward || payload, payload.target || {});
      this.rewards = [applied.reward, ...this.rewards.filter((entry) => entry.id !== applied.reward.id)].slice(0, 80);
      return applied.reward;
    }
    if (type === GAME_EVENT_TYPES.GM_REWARD_APPLY) {
      const rewardId = payload.rewardId || payload.id;
      const reward = this.rewards.find((entry) => entry.id === rewardId) || payload.reward || payload;
      const applied = applyMissionReward(this, reward, payload.target || {});
      this.rewards = [applied.reward, ...this.rewards.filter((entry) => entry.id !== applied.reward.id)].slice(0, 80);
      if (applied.state?.gmEvents) this.gmEvents = applied.state.gmEvents;
      return applied;
    }
    if (type === GAME_EVENT_TYPES.GM_EVENT_CREATE) {
      return addGmRuleEvent(payload.event || payload);
    }

    if (type === GAME_EVENT_TYPES.GM_NOTE_CREATE) {
      const note = normalizeGmNote({ ...payload.note, ...payload });
      this.gmNotes.unshift(note);
      this.gmNotes = this.gmNotes.slice(0, 160);
      return note;
    }
    if (type === GAME_EVENT_TYPES.GM_NOTE_UPDATE) {
      const note = this.gmNotes.find((entry) => entry.id === (payload.noteId || payload.id));
      if (!note) throw new Error("Nota do mestre nao encontrada.");
      Object.assign(note, normalizeGmNote({ ...note, ...(payload.patch || payload), id: note.id, createdAt: note.createdAt, updatedAt: nowIso() }));
      return note;
    }
    if (type === GAME_EVENT_TYPES.GM_NOTE_DELETE) {
      const noteId = payload.noteId || payload.id;
      const note = this.gmNotes.find((entry) => entry.id === noteId);
      this.gmNotes = this.gmNotes.filter((entry) => entry.id !== noteId);
      this.revealedNotes = this.revealedNotes.filter((entry) => entry.id !== noteId);
      return note || null;
    }
    if (type === GAME_EVENT_TYPES.GM_NOTE_REVEAL) {
      const note = this.gmNotes.find((entry) => entry.id === (payload.noteId || payload.id));
      if (!note) throw new Error("Nota do mestre nao encontrada.");
      note.revealed = true;
      note.visibleToPlayers = true;
      note.updatedAt = nowIso();
      this.revealedNotes = [normalizeGmNote(note), ...this.revealedNotes.filter((entry) => entry.id !== note.id)].slice(0, 80);
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `Nota revelada: ${note.title}${note.body ? ` - ${note.body}` : ""}`,
      });
      return note;
    }

    if (type === GAME_EVENT_TYPES.GM_COUNTER_CREATE) {
      const counter = normalizeGmCounter({ ...payload.counter, ...payload });
      this.gmCounters.unshift(counter);
      this.gmCounters = this.gmCounters.slice(0, 80);
      return counter;
    }
    if (type === GAME_EVENT_TYPES.GM_COUNTER_UPDATE) {
      const counter = this.gmCounters.find((entry) => entry.id === (payload.counterId || payload.id));
      if (!counter) throw new Error("Contador do mestre nao encontrado.");
      Object.assign(counter, normalizeGmCounter({ ...counter, ...(payload.patch || payload), id: counter.id, createdAt: counter.createdAt, updatedAt: nowIso() }));
      return counter;
    }
    if (type === GAME_EVENT_TYPES.GM_COUNTER_DELETE) {
      const counterId = payload.counterId || payload.id;
      const counter = this.gmCounters.find((entry) => entry.id === counterId);
      this.gmCounters = this.gmCounters.filter((entry) => entry.id !== counterId);
      return counter || null;
    }
    if (type === GAME_EVENT_TYPES.GM_COUNTER_TICK) {
      const counter = this.gmCounters.find((entry) => entry.id === (payload.counterId || payload.id));
      if (!counter) throw new Error("Contador do mestre nao encontrado.");
      if (counter.paused) return counter;
      const delta = numeric(payload.delta, counter.direction === "up" ? 1 : -1);
      const previous = counter.current;
      counter.current = bounded(counter.current + delta, 0, counter.max, counter.current);
      counter.updatedAt = nowIso();
      if (counter.current === 0 || counter.current === counter.max) {
        this.addCombatLog({
          type: "gm:counter",
          actorId: actor?.id || "",
          actorName: actor?.name || "Mestre",
          targetId: counter.id,
          targetName: counter.name,
          message: counter.triggerText || `${counter.name} atingiu ${counter.current}/${counter.max}.`,
        });
      }
      return { ...counter, previous };
    }
    if (type === GAME_EVENT_TYPES.GM_COUNTER_REVEAL) {
      const counter = this.gmCounters.find((entry) => entry.id === (payload.counterId || payload.id));
      if (!counter) throw new Error("Contador do mestre nao encontrado.");
      counter.revealed = true;
      counter.visibleToPlayers = true;
      counter.updatedAt = nowIso();
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `Contador revelado: ${counter.name} (${counter.current}/${counter.max}).`,
      });
      return counter;
    }

    if (type === GAME_EVENT_TYPES.GM_ENVIRONMENT_CREATE) {
      const effect = normalizeEnvironmentalEffect({ ...payload.effect, ...payload });
      this.environmentalEffects.unshift(effect);
      this.environmentalEffects = this.environmentalEffects.slice(0, 80);
      return effect;
    }
    if (type === GAME_EVENT_TYPES.GM_ENVIRONMENT_UPDATE) {
      const effect = this.environmentalEffects.find((entry) => entry.id === (payload.effectId || payload.id));
      if (!effect) throw new Error("Efeito ambiental nao encontrado.");
      Object.assign(effect, normalizeEnvironmentalEffect({ ...effect, ...(payload.patch || payload), id: effect.id, createdAt: effect.createdAt, updatedAt: nowIso() }));
      return effect;
    }
    if (type === GAME_EVENT_TYPES.GM_ENVIRONMENT_DELETE) {
      const effectId = payload.effectId || payload.id;
      const effect = this.environmentalEffects.find((entry) => entry.id === effectId);
      this.environmentalEffects = this.environmentalEffects.filter((entry) => entry.id !== effectId);
      return effect || null;
    }

    if (type === GAME_EVENT_TYPES.GM_SCENE_CREATE) {
      const scene = normalizeSceneList([{ ...payload.scene, ...payload }], this.scene.toJSON())[0];
      this.sceneList.unshift(scene);
      return scene;
    }
    if (type === GAME_EVENT_TYPES.GM_SCENE_UPDATE) {
      const sceneId = payload.sceneId || payload.id;
      const index = this.sceneList.findIndex((entry) => entry.id === sceneId);
      if (index < 0) throw new Error("Cena salva nao encontrada.");
      this.sceneList[index] = normalizeSceneList([{ ...this.sceneList[index], ...(payload.patch || payload), id: sceneId }], this.sceneList[index])[0];
      if (this.activeSceneId === sceneId) this.scene.update(this.sceneList[index]);
      return this.sceneList[index];
    }
    if (type === GAME_EVENT_TYPES.GM_SCENE_DELETE) {
      const sceneId = payload.sceneId || payload.id;
      if (sceneId === this.activeSceneId) throw new Error("Nao e possivel excluir a cena ativa.");
      const scene = this.sceneList.find((entry) => entry.id === sceneId);
      this.sceneList = this.sceneList.filter((entry) => entry.id !== sceneId);
      return scene || null;
    }
    if (type === GAME_EVENT_TYPES.GM_SCENE_SWITCH) {
      const scene = this.sceneList.find((entry) => entry.id === (payload.sceneId || payload.id));
      if (!scene) throw new Error("Cena salva nao encontrada.");
      this.scene = Scene.fromJSON(scene);
      this.activeSceneId = this.scene.id;
      this.syncSceneTokens();
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `${actor?.name || "Mestre"} trocou para a cena: ${this.scene.name}.`,
      });
      return this.scene;
    }

    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE) {
      const encounter = normalizePreparedEncounter({ ...payload.encounter, ...payload });
      this.preparedEncounters.unshift(encounter);
      return encounter;
    }
    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE) {
      const encounterId = payload.encounterId || payload.id;
      const encounter = this.preparedEncounters.find((entry) => entry.id === encounterId);
      if (!encounter) throw new Error("Encontro preparado nao encontrado.");
      Object.assign(encounter, normalizePreparedEncounter({ ...encounter, ...(payload.patch || payload), id: encounter.id, createdAt: encounter.createdAt, updatedAt: nowIso() }));
      return encounter;
    }
    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_DELETE) {
      const encounterId = payload.encounterId || payload.id;
      const encounter = this.preparedEncounters.find((entry) => entry.id === encounterId);
      this.preparedEncounters = this.preparedEncounters.filter((entry) => entry.id !== encounterId);
      return encounter || null;
    }
    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_START) {
      const encounter = this.preparedEncounters.find((entry) => entry.id === (payload.encounterId || payload.id));
      if (!encounter) throw new Error("Encontro preparado nao encontrado.");
      if (payload.loadScene && encounter.sceneId && encounter.sceneId !== this.activeSceneId) {
        const scene = this.sceneList.find((entry) => entry.id === encounter.sceneId);
        if (scene) {
          this.scene = Scene.fromJSON(scene);
          this.activeSceneId = this.scene.id;
        }
      }
      const created = [];
      const positions = arrayOf(encounter.initialPositions);
      arrayOf(encounter.monsters).forEach((entry) => {
        const monster = new SharedMonster({
          ...(entry.monster || entry),
          id: entry.sessionMonsterId || createId("encounter-monster"),
          definitionId: entry.definitionId || entry.id || entry.monsterId || "",
          name: entry.name || entry.monster?.name || "Criatura",
          snapshot: clone(entry.snapshot || entry.monster || entry),
        });
        this.monsters.push(monster);
        created.push(monster);
      });
      encounter.status = "active";
      encounter.updatedAt = nowIso();
      this.syncCombatants();
      this.syncSceneTokens();
      created.forEach((monster, index) => {
        const position = positions[index] || encounter.monsters[index]?.position || {};
        if (!position.x || !position.y) return;
        const token = this.scene.findTokenForEntity("monster", monster.id);
        if (token) {
          token.moveTo(position.x, position.y);
          if (position.hidden !== undefined) token.hidden = Boolean(position.hidden);
          if (position.locked !== undefined) token.locked = Boolean(position.locked);
          if (position.color) token.color = String(position.color);
        }
      });
      this.addCombatLog({
        type: "gm:encounter:start",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: encounter.id,
        targetName: encounter.name,
        message: `Encontro iniciado: ${encounter.name} (${created.length} criatura(s)).`,
      });
      return { encounter, monsters: created };
    }
    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_COMPLETE) {
      const encounter = this.preparedEncounters.find((entry) => entry.id === (payload.encounterId || payload.id));
      if (!encounter) throw new Error("Encontro preparado nao encontrado.");
      encounter.status = "completed";
      encounter.updatedAt = nowIso();
      this.addCombatLog({
        type: "gm:encounter:complete",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: encounter.id,
        targetName: encounter.name,
        message: `Encontro concluido: ${encounter.name}.`,
      });
      return encounter;
    }
    if (type === GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE) {
      const balance = payload.balance || estimateEncounterBalance({
        monsters: arrayOf(payload.monsters),
        characters: this.characters.map((character) => character.snapshot || character),
      });
      const encounter = normalizePreparedEncounter({
        name: payload.name || "Encontro gerado",
        description: payload.description || "Criado pelo gerador de encontros.",
        sceneId: payload.sceneId || this.activeSceneId,
        monsters: arrayOf(payload.monsters).map((monster) => clone(monster)),
        difficulty: payload.difficulty || "moderado",
        estimatedDifficulty: balance.classification,
        threatXp: payload.threatXp || balance.totalThreat || 0,
        threatScore: payload.threatScore || balance.totalThreat || 0,
        balance,
        sourceFilters: payload.filters || {},
        generated: true,
        rewards: payload.rewards || {},
        notes: payload.notes || "",
      });
      this.preparedEncounters.unshift(encounter);
      if (payload.startNow) {
        const created = [];
        arrayOf(encounter.monsters).forEach((entry) => {
          const monster = new SharedMonster({
            ...(entry.monster || entry),
            id: entry.sessionMonsterId || createId("encounter-monster"),
            definitionId: entry.definitionId || entry.id || entry.monsterId || "",
            name: entry.name || entry.monster?.name || "Criatura",
            snapshot: clone(entry.snapshot || entry.monster || entry),
          });
          this.monsters.push(monster);
          created.push(monster);
        });
        encounter.status = "active";
        encounter.updatedAt = nowIso();
        this.syncCombatants();
        this.syncSceneTokens();
        this.addCombatLog({
          type: "gm:encounter:start",
          actorId: actor?.id || "",
          actorName: actor?.name || "Mestre",
          targetId: encounter.id,
          targetName: encounter.name,
          message: `Encontro gerado e iniciado: ${encounter.name} (${created.length} criatura(s)).`,
        });
        return { encounter, monsters: created };
      }
      return encounter;
    }
    if (type === GAME_EVENT_TYPES.GM_SHIELD_SEARCH) {
      return { query: String(payload.query || ""), results: arrayOf(payload.results).map(clone) };
    }
    if (type === GAME_EVENT_TYPES.GM_SHIELD_PIN) {
      const ruleId = String(payload.ruleId || payload.id || "");
      if (!ruleId) return clone(this.gmDashboardSettings);
      const current = new Set(normalizeTags(this.gmDashboardSettings.pinnedShieldRules));
      if (payload.pinned === false || current.has(ruleId)) current.delete(ruleId);
      else current.add(ruleId);
      this.gmDashboardSettings = normalizeGmDashboardSettings({
        ...this.gmDashboardSettings,
        pinnedShieldRules: Array.from(current),
      });
      return clone(this.gmDashboardSettings);
    }
    if (type === GAME_EVENT_TYPES.GM_SHIELD_SEND_TO_CHAT) {
      const title = String(payload.title || payload.rule?.title || "Regra rapida");
      const summary = String(payload.summary || payload.rule?.summary || payload.text || "");
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Escudo do Mestre",
        message: `${title}${summary ? ` - ${summary}` : ""}`,
      });
      return { title, summary };
    }

    const findLoreEntry = (loreId = "") => {
      const id = String(loreId || payload.loreId || payload.entryId || payload.id || "");
      return this.loreState.entries.find((entry) => entry.id === id) || null;
    };

    if (type === GAME_EVENT_TYPES.GM_LORE_PIN) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      this.setLoreState(payload.pinned === false ? unpinLoreEntry(this.loreState, entry.id) : pinLoreEntry(this.loreState, entry.id));
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: payload.pinned === false ? `Lore removida dos pins: ${entry.title}.` : `Lore pinada: ${entry.title}.` });
      return this.loreState;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_DISCOVER) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      this.setLoreState(markLoreDiscovered(this.loreState, entry.id, payload.discoveryState || LORE_DISCOVERY_STATES.DISCOVERED));
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Lore descoberta: ${entry.title}.`, visibleToPlayers: payload.discoveryState === LORE_DISCOVERY_STATES.REVEALED });
      return this.loreState;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_SECRET) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      this.setLoreState(markLoreSecret(this.loreState, entry.id, payload.secretLevel || LORE_SECRET_LEVELS.SECRET));
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Segredo de lore marcado: ${entry.title}.` });
      return this.loreState;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_NOTE) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      this.setLoreState(sendLoreToGmNotes(this.loreState, entry.id, payload.options || payload));
      const note = this.loreNotes[0];
      if (note) {
        const gmNote = normalizeGmNote({
          ...note,
          title: `Lore: ${note.title}`,
          linkedType: "lore",
          linkedId: entry.id,
        });
        this.gmNotes = [gmNote, ...this.gmNotes.filter((saved) => saved.id !== gmNote.id)].slice(0, 160);
      }
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Lore enviada para notas: ${entry.title}.` });
      return note || this.loreState;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_REPORT) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      this.setLoreState(sendLoreToSessionReport(this.loreState, entry.id, payload.options || payload));
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Lore enviada para relatorio: ${entry.title}.` });
      return this.reportLoreEntries[0] || this.loreState;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_RELATION) {
      if (payload.remove) {
        this.setLoreState({
          ...this.loreState,
          relations: this.loreState.relations.filter((relation) => relation.id !== payload.relationId && relation.id !== payload.id),
        });
        return this.loreState;
      }
      const relation = createLoreRelation(payload.relation || payload);
      this.setLoreState(linkLoreEntries(this.loreState, relation));
      return relation;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_MISSION) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const mission = upsertMission(createMissionSeedFromLore(entry, payload.options || payload));
      this.setLoreState({
        ...this.loreState,
        missionLoreLinks: [{ missionId: mission.id, loreId: entry.id, createdAt: nowIso() }, ...this.loreState.missionLoreLinks].slice(0, 120),
      });
      addGmRuleEvent({ type: "mission", targetId: mission.id, targetName: mission.name, message: `Missao criada a partir de lore: ${entry.title}.`, visibleToPlayers: mission.visibleToPlayers });
      return mission;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_ENCOUNTER) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const encounter = normalizePreparedEncounter(createEncounterSeedFromLore(entry, payload.options || payload));
      this.preparedEncounters = [encounter, ...this.preparedEncounters.filter((saved) => saved.id !== encounter.id)].slice(0, 80);
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Encontro sugerido por lore: ${encounter.name}.` });
      return encounter;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_SCENE) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const scene = normalizeSceneList([createLocationSceneSeed(entry, payload.options || payload)], this.scene.toJSON())[0];
      this.sceneList = [scene, ...this.sceneList.filter((saved) => saved.id !== scene.id)].slice(0, 80);
      this.setLoreState({
        ...this.loreState,
        locationLoreLinks: [{ sceneId: scene.id, loreId: entry.id, createdAt: nowIso() }, ...this.loreState.locationLoreLinks].slice(0, 120),
      });
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `Cena criada a partir de lore: ${scene.name}.` });
      return scene;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_NPC) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const npc = createNpcSeedFromLore(entry, payload.options || payload);
      const note = normalizeGmNote({
        title: `NPC: ${npc.name}`,
        body: [npc.role, npc.faction, npc.location, npc.motivation].filter(Boolean).join(" | "),
        tags: ["lore", "npc", ...(npc.tags || [])],
        linkedType: "lore",
        linkedId: entry.id,
        visibleToPlayers: false,
      });
      this.gmNotes = [note, ...this.gmNotes.filter((saved) => saved.id !== note.id)].slice(0, 160);
      this.setLoreState({
        ...this.loreState,
        npcLoreLinks: [{ npcId: npc.id, loreId: entry.id, createdAt: nowIso() }, ...this.loreState.npcLoreLinks].slice(0, 120),
      });
      addGmRuleEvent({ type: "lore", targetId: entry.id, targetName: entry.title, message: `NPC enviado para notas: ${npc.name}.` });
      return npc;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_CLOCK) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const clock = createCampaignClock({
        name: payload.name || `Ameaca: ${entry.title}`,
        description: payload.description || entry.summary || entry.description,
        max: payload.max || 6,
        current: payload.current ?? 0,
        direction: payload.direction || "up",
        type: "ameaca",
        visibleToPlayers: false,
        loreId: entry.id,
      });
      this.campaignClocks = [clock, ...this.campaignClocks.filter((saved) => saved.id !== clock.id)].slice(0, 80);
      addGmRuleEvent({ type: "clock", targetId: clock.id, targetName: clock.name, message: `Contador criado a partir de lore: ${entry.title}.` });
      return clock;
    }
    if (type === GAME_EVENT_TYPES.GM_LORE_FACTION) {
      const entry = findLoreEntry();
      if (!entry) throw new Error("Entrada de lore nao encontrada.");
      const faction = createFactionState(createLoreLinkedFactionState(entry, payload.options || payload));
      this.factionStates = [faction, ...this.factionStates.filter((saved) => saved.id !== faction.id)].slice(0, 80);
      this.setLoreState({
        ...this.loreState,
        factionLoreLinks: [{ factionId: faction.id, loreId: entry.id, createdAt: nowIso() }, ...this.loreState.factionLoreLinks].slice(0, 120),
      });
      addGmRuleEvent({ type: "faccao", targetId: faction.id, targetName: faction.name, message: `Faccao criada a partir de lore: ${entry.title}.` });
      return faction;
    }

    if (type === GAME_EVENT_TYPES.GM_REPORT_EXPORT) {
      this.gmDashboardSettings = normalizeGmDashboardSettings({
        ...this.gmDashboardSettings,
        reportSettings: {
          ...(this.gmDashboardSettings.reportSettings || {}),
          ...(payload.options || {}),
        },
        lastReportAt: nowIso(),
      });
      return { report: generateSessionReport(this, payload.options || this.gmDashboardSettings.reportSettings), generatedAt: nowIso() };
    }
    if (type === GAME_EVENT_TYPES.GM_REPORT_SAVE) {
      const report = normalizeSessionReport({
        ...payload.report,
        sessionId: payload.sessionId || this.id,
        title: payload.title || payload.report?.title || `Relatorio - ${this.name}`,
        options: payload.options || payload.report?.options || this.gmDashboardSettings.reportSettings,
        markdown: payload.markdown || payload.report?.markdown || generateSessionReport(this, payload.options || this.gmDashboardSettings.reportSettings),
        summary: payload.summary || payload.report?.summary || "Relatorio salvo pelo mestre.",
      });
      this.sessionReports = [report, ...this.sessionReports.filter((entry) => entry.id !== report.id)].slice(0, 40);
      this.gmDashboardSettings = normalizeGmDashboardSettings({
        ...this.gmDashboardSettings,
        reportSettings: {
          ...(this.gmDashboardSettings.reportSettings || {}),
          ...(report.options || {}),
        },
        lastReportAt: report.createdAt,
      });
      return report;
    }

    return this.gmDashboardStateFor(actor);
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
    const lootRoll = resolveMonsterLoot(snapshot, { defeated: true });
    const rawLoot = lootRoll.drops.length
      ? lootRoll.drops
      : arrayOf(snapshot.loot || snapshot.drops || snapshot.rewards);
    const items = rawLoot.map((entry) => normalizeCartLine({
      item: entry.item || {
        id: entry.id || createId("loot-item"),
        name: entry.name || "Loot de monstro",
        category: entry.category || "material",
        rarity: entry.rarity || "",
        source: monster.name,
      },
      quantity: entry.quantity || entry.qty || 1,
      price: entry.price || 0,
    }));
    const pack = normalizeLootPack({
      name: `Loot pendente - ${monster.name}`,
      source: monster.name,
      items,
      luzentis: Math.max(0, numeric(snapshot.luzentis || snapshot.credits || snapshot.currency, 0)),
      notes: items.length ? lootRoll.log : "Pacote vazio criado automaticamente; mestre define recompensas.",
      createdBy: actor?.id || "",
    });
    monster.snapshot.lootPackId = pack.id;
    monster.snapshot.lastLootRoll = lootRoll.result;
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
    const partialCartLineId = approval.type === "purchase-cart" ? cartLineIdFromPayload(payload) : "";
    if (type === GAME_EVENT_TYPES.APPROVAL_REJECT) {
      if (partialCartLineId) {
        approval.payload.items = markCartLineStatus(approval.payload.items, partialCartLineId, "rejected", actor?.id || "", payload.message || "");
        if (cartLinesAllResolved(approval.payload.items)) approval.reject(actor?.id || "", payload.message || approval.message);
        this.addChatMessage({
          playerId: actor?.id || "",
          authorName: "Sistema Solaris",
          message: `${actor?.name || "Mestre"} rejeitou item do carrinho: ${approval.message}`,
        });
        return approval;
      }
      approval.reject(actor?.id || "", payload.message || "");
      this.addChatMessage({
        playerId: actor?.id || "",
        authorName: "Sistema Solaris",
        message: `${actor?.name || "Mestre"} rejeitou: ${approval.message}`,
      });
      return approval;
    }
    const result = this.executeApprovedRequest(approval, actor, payload);
    if (!partialCartLineId || cartLinesAllResolved(approval.payload.items)) approval.approve(actor?.id || "");
    this.addChatMessage({
      playerId: actor?.id || "",
      authorName: "Sistema Solaris",
      message: partialCartLineId
        ? `${actor?.name || "Mestre"} aprovou item do carrinho: ${approval.message}`
        : `${actor?.name || "Mestre"} aprovou: ${approval.message}`,
    });
    return result || approval;
  }

  executeApprovedRequest(approval, actor = null, actionPayload = {}) {
    const payload = clone(approval.payload) || {};
    const character = this.getCharacter(approval.characterId || payload.characterId);
    if (!character) throw new Error("Personagem da aprovacao nao encontrado.");
    const type = approval.type;
    if (type === "purchase-item" || type === "purchase-cart") {
      const selectedLineId = type === "purchase-cart" ? cartLineIdFromPayload(actionPayload) : "";
      const allItems = type === "purchase-cart"
        ? arrayOf(payload.items).map(normalizeCartLine)
        : [normalizeCartLine({ item: payload.item || { name: payload.itemName || "Item comprado" }, quantity: payload.quantity || 1, price: payload.price })];
      const items = type === "purchase-cart"
        ? (selectedLineId
          ? allItems.filter((line) => cartLineMatches(line, selectedLineId))
          : allItems.filter((line) => !["approved", "rejected"].includes(line.status)))
        : allItems;
      if (!items.length) throw new Error("Nenhum item pendente encontrado neste carrinho.");
      const batchDestination = selectedLineId ? null : (payload.destination || payload.location || { kind: "unassigned" });
      const instances = inventoryInstancesFromCart(items, batchDestination);
      const price = Math.max(0, numeric(
        selectedLineId ? undefined : (payload.price ?? payload.total),
        items.reduce((sum, line) => sum + line.total, 0)
      ));
      const snapshot = normalizeSheetSnapshot(character.snapshot);
      const currentMoney = numeric(snapshot.currency ?? snapshot.luzentis, 0);
      if (currentMoney < price) throw new Error("Luzentis insuficientes para aprovar a compra.");
      updateCurrency(snapshot, -price);
      snapshot.inventory = uniqueById([...snapshot.inventory, ...instances]);
      character.update(snapshot, { full: true });
      if (type === "purchase-cart") {
        const approvedIds = new Set(items.map((line) => line.id));
        approval.payload.items = allItems.map((line) => approvedIds.has(line.id)
          ? { ...line, status: "approved", resolvedAt: nowIso(), resolvedBy: actor?.id || "" }
          : line);
      }
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
      const result = character.applyDamage(payload.amount, payload);
      const current = result.combatant.currentPV;
      this.syncCombatants();
      const sourceLabel = payload.sourceLabel || payload.attackName || payload.source || "";
      const source = sourceLabel ? ` por ${sourceLabel}` : "";
      this.addCombatLog({
        type: "damage",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mesa",
        targetId: character.id,
        targetName: character.name,
        message: `${character.name} sofreu ${Math.max(0, numeric(result.damageApplied, 0))} de dano${source}.`,
        data: {
          rawAmount: Math.max(0, numeric(payload.amount, 0)),
          damageApplied: result.damageApplied,
          preventedDamage: result.preventedDamage,
          damageType: payload.damageType || payload.type || "",
        },
      });
      this.addCombatRuleLogEvents(result, actor, character, ["damage"]);
      return current;
    }
    if (type === GAME_EVENT_TYPES.CHARACTER_HEAL) {
      const result = character.heal(payload.amount, payload);
      const current = result.combatant.currentPV;
      this.syncCombatants();
      this.addCombatLog({
        type: "heal",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mesa",
        targetId: character.id,
        targetName: character.name,
        message: `${character.name} recuperou ${Math.max(0, numeric(result.healingApplied, 0))} PV.`,
        data: { requestedHealing: Math.max(0, numeric(payload.amount, 0)), healingApplied: result.healingApplied },
      });
      this.addCombatRuleLogEvents(result, actor, character, ["heal"]);
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
      const result = monster.applyDamage(payload.amount, payload);
      const current = result.combatant.currentPV;
      this.syncCombatants();
      const sourceLabel = payload.sourceLabel || payload.attackName || payload.source || "";
      const source = sourceLabel ? ` por ${sourceLabel}` : "";
      this.addCombatLog({
        type: "damage",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} sofreu ${Math.max(0, numeric(result.damageApplied, 0))} de dano${source}.`,
        data: {
          rawAmount: Math.max(0, numeric(payload.amount, 0)),
          damageApplied: result.damageApplied,
          preventedDamage: result.preventedDamage,
          damageType: payload.damageType || payload.type || "",
        },
      });
      this.addCombatRuleLogEvents(result, actor, monster, ["damage"]);
      if (current <= 0) this.createLootFromMonster(monster.id, actor);
      return current;
    }
    if (type === GAME_EVENT_TYPES.MONSTER_HEAL) {
      const result = monster.heal(payload.amount, payload);
      const current = result.combatant.currentPV;
      this.syncCombatants();
      this.addCombatLog({
        type: "heal",
        actorId: actor?.id || "",
        actorName: actor?.name || "Mestre",
        targetId: monster.id,
        targetName: monster.name,
        message: `${monster.name} recuperou ${Math.max(0, numeric(result.healingApplied, 0))} PV.`,
        data: { requestedHealing: Math.max(0, numeric(payload.amount, 0)), healingApplied: result.healingApplied },
      });
      this.addCombatRuleLogEvents(result, actor, monster, ["heal"]);
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
      gmNotes: this.gmNotes.map((note) => clone(note)),
      revealedNotes: this.revealedNotes.map((note) => clone(note)),
      gmCounters: this.gmCounters.map((counter) => clone(counter)),
      counters: this.gmCounters.map((counter) => clone(counter)),
      environmentalEffects: this.environmentalEffects.map((effect) => clone(effect)),
      preparedEncounters: this.preparedEncounters.map((encounter) => clone(encounter)),
      sessionReports: this.sessionReports.map((report) => clone(report)),
      sceneList: this.sceneList.map((scene) => clone(scene)),
      scenes: this.sceneList.map((scene) => clone(scene)),
      activeSceneId: this.activeSceneId,
      gmDashboardSettings: clone(this.gmDashboardSettings),
      gmSchemaVersion: this.gmSchemaVersion,
      activeMissionId: this.activeMissionId,
      missions: this.missions.map((mission) => clone(mission)),
      travelRoutes: this.travelRoutes.map((route) => clone(route)),
      resourceTracks: this.resourceTracks.map((resource) => clone(resource)),
      factionStates: this.factionStates.map((faction) => clone(faction)),
      reputationLog: this.reputationLog.map((entry) => clone(entry)),
      campaignClocks: this.campaignClocks.map((clock) => clone(clock)),
      gmEvents: this.gmEvents.map((entry) => clone(entry)),
      rewards: this.rewards.map((reward) => clone(reward)),
      consequences: this.consequences.map((consequence) => clone(consequence)),
      hackingChallenges: this.hackingChallenges.map((challenge) => clone(challenge)),
      bases: this.bases.map((base) => clone(base)),
      loreSchemaVersion: this.loreSchemaVersion,
      loreState: serializeLoreState(this.loreState),
      pinnedLoreEntries: this.pinnedLoreEntries.map((entry) => clone(entry)),
      discoveredLoreEntries: this.discoveredLoreEntries.map((entry) => clone(entry)),
      secretLoreEntries: this.secretLoreEntries.map((entry) => clone(entry)),
      loreNotes: this.loreNotes.map((entry) => clone(entry)),
      loreRelations: this.loreRelations.map((entry) => clone(entry)),
      reportLoreEntries: this.reportLoreEntries.map((entry) => clone(entry)),
      missionLoreLinks: this.missionLoreLinks.map((entry) => clone(entry)),
      factionLoreLinks: this.factionLoreLinks.map((entry) => clone(entry)),
      locationLoreLinks: this.locationLoreLinks.map((entry) => clone(entry)),
      npcLoreLinks: this.npcLoreLinks.map((entry) => clone(entry)),
      monsterLoreLinks: this.monsterLoreLinks.map((entry) => clone(entry)),
      itemLoreLinks: this.itemLoreLinks.map((entry) => clone(entry)),
      gmState: serializeGmState(this),
      gmDashboard: this.gmDashboardStateFor({ isGM: true }),
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
