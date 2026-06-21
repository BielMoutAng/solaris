export const SOLARIS_DOMAIN_VERSION = 1;

export const ENTITY_TYPES = Object.freeze({
  ITEM: "item",
  WEAPON: "weapon",
  ARMOR: "armor",
  CUBE: "cube",
  HOOK: "hook",
  HOLSTER: "holster",
  BANDOLIER: "bandolier",
  CHIP_MOD: "chip-mod",
  COSMIC_SPELL: "cosmic-spell",
  CUSTOM_ABILITY: "custom-ability",
  DRONE: "drone",
  ROBOT: "robot",
  VEHICLE: "vehicle",
});

export const LOCATION_KINDS = Object.freeze({
  EQUIPPED: "equipped",
  ACTIVE: "active",
  CUBE: "cube",
  CONTAINER: "container",
  HOOK: "hook",
  HOLSTER: "holster",
  BANDOLIER: "bandolier",
  BASE: "base",
  VEHICLE: "vehicle",
  UNASSIGNED: "unassigned",
});

export const STORAGE_TYPES = Object.freeze({
  CUBE: "cube",
  CONTAINER: "container",
  HOOK: "hook",
  HOLSTER: "holster",
  BANDOLIER: "bandolier",
  VEHICLE: "vehicle",
});

export const INVENTORY_SIZES = Object.freeze({
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
});

export const EFFECT_OPERATIONS = Object.freeze({
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  SET: "set",
});

export const AMMO_KINDS = Object.freeze({
  NONE: "none",
  LIGHT: "light",
  MEDIUM: "medium",
  SHELL: "shell",
  ENERGY_CELL: "energy_cell",
  GRENADE: "grenade",
  ROCKET: "rocket",
});

export const FEED_SYSTEMS = Object.freeze({
  NONE: "none",
  DETACHABLE_MAGAZINE: "detachable_magazine",
  INTERNAL_MAGAZINE: "internal_magazine",
  CYLINDER: "cylinder",
  SINGLE_LOAD: "single_load",
  ENERGY_CELL: "energy_cell",
  BELT: "belt",
});

export const FIRE_MODE_IDS = Object.freeze({
  SINGLE: "single",
  BURST: "burst",
  HEAVY_BURST: "heavy_burst",
  SHOTGUN_CONE: "shotgun_cone",
  LAUNCHER_SHOT: "launcher_shot",
  MACHINEGUN_BURST: "machinegun_burst",
  SUPPRESSION: "suppression",
});

export const FIRE_MODES = Object.freeze({
  [FIRE_MODE_IDS.SINGLE]: Object.freeze({
    id: FIRE_MODE_IDS.SINGLE,
    label: "Tiro",
    ammoCost: 1,
    rollMode: "normal",
    damageDiceBonus: 0,
    targetSave: "",
  }),
  [FIRE_MODE_IDS.BURST]: Object.freeze({
    id: FIRE_MODE_IDS.BURST,
    label: "Rajada",
    ammoCost: 4,
    rollMode: "advantage",
    damageDiceBonus: 1,
    targetSave: "",
  }),
  [FIRE_MODE_IDS.HEAVY_BURST]: Object.freeze({
    id: FIRE_MODE_IDS.HEAVY_BURST,
    label: "Rajada pesada",
    ammoCost: 4,
    rollMode: "disadvantage",
    damageDiceBonus: 3,
    targetSave: "",
  }),
  [FIRE_MODE_IDS.SHOTGUN_CONE]: Object.freeze({
    id: FIRE_MODE_IDS.SHOTGUN_CONE,
    label: "Cone",
    ammoCost: 1,
    rollMode: "save",
    damageDiceBonus: 0,
    targetSave: "JPR",
  }),
  [FIRE_MODE_IDS.LAUNCHER_SHOT]: Object.freeze({
    id: FIRE_MODE_IDS.LAUNCHER_SHOT,
    label: "Disparo de lancador",
    ammoCost: 1,
    rollMode: "normal",
    damageDiceBonus: 0,
    targetSave: "",
  }),
  [FIRE_MODE_IDS.MACHINEGUN_BURST]: Object.freeze({
    id: FIRE_MODE_IDS.MACHINEGUN_BURST,
    label: "Rajada de metralhadora",
    ammoCost: 6,
    rollMode: "normal",
    damageDiceBonus: 1,
    targetSave: "",
  }),
  [FIRE_MODE_IDS.SUPPRESSION]: Object.freeze({
    id: FIRE_MODE_IDS.SUPPRESSION,
    label: "Supressao",
    ammoCost: 10,
    rollMode: "save",
    damageDiceBonus: 0,
    targetSave: "JPR",
  }),
});

export const AMMO_CUBE_BULK = Object.freeze({
  [AMMO_KINDS.LIGHT]: 20,
  [AMMO_KINDS.MEDIUM]: 10,
  [AMMO_KINDS.SHELL]: 5,
  [AMMO_KINDS.ENERGY_CELL]: 2,
  [AMMO_KINDS.GRENADE]: 1,
  [AMMO_KINDS.ROCKET]: 1,
});

export const AMMO_TYPE_LIBRARY = Object.freeze({
  light_round: Object.freeze({ id: "light_round", name: "Municao leve", ammoKind: AMMO_KINDS.LIGHT, cubeBulk: 20 }),
  medium_round: Object.freeze({ id: "medium_round", name: "Municao media", ammoKind: AMMO_KINDS.MEDIUM, cubeBulk: 10 }),
  shell: Object.freeze({ id: "shell", name: "Cartucho de escopeta", ammoKind: AMMO_KINDS.SHELL, cubeBulk: 5 }),
  energy_cell: Object.freeze({ id: "energy_cell", name: "Celula de energia", ammoKind: AMMO_KINDS.ENERGY_CELL, cubeBulk: 2 }),
  grenade_round: Object.freeze({ id: "grenade_round", name: "Granada de lancador", ammoKind: AMMO_KINDS.GRENADE, cubeBulk: 1 }),
  rocket: Object.freeze({ id: "rocket", name: "Foguete", ammoKind: AMMO_KINDS.ROCKET, cubeBulk: 1 }),
});

const DEFINITION_CLASS_BY_TYPE = new Map();

function createId(prefix = "entity") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function numeric(value, fallback = 0) {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function positiveInteger(value, fallback = 0) {
  return Math.max(0, Math.floor(numeric(value, fallback)));
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, numeric(value, min)));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(value) {
  return [...new Set(arrayOf(value).map((entry) => String(entry || "").trim()).filter(Boolean))];
}

function normalizeInventorySize(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const aliases = {
    small: INVENTORY_SIZES.SMALL,
    pequeno: INVENTORY_SIZES.SMALL,
    pequena: INVENTORY_SIZES.SMALL,
    leve: INVENTORY_SIZES.SMALL,
    medium: INVENTORY_SIZES.MEDIUM,
    medio: INVENTORY_SIZES.MEDIUM,
    media: INVENTORY_SIZES.MEDIUM,
    large: INVENTORY_SIZES.LARGE,
    grande: INVENTORY_SIZES.LARGE,
    pesado: INVENTORY_SIZES.LARGE,
    pesada: INVENTORY_SIZES.LARGE,
  };
  return aliases[normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "")] || "";
}

function entityInventorySize(entity = {}) {
  return normalizeInventorySize(
    entity.customData?.inventorySize
      || entity.metadata?.inventorySize
      || entity.definitionSnapshot?.metadata?.inventorySize
  ) || INVENTORY_SIZES.SMALL;
}

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function normalizeRuleText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ammoId(prefix = "ammo") {
  return createId(prefix);
}

function weaponRuleText(weapon = {}) {
  const snapshot = weapon.definitionSnapshot || {};
  const metadata = weapon.metadata || snapshot.metadata || {};
  return normalizeRuleText([
    weapon.name,
    weapon.category,
    weapon.type,
    snapshot.name,
    snapshot.category,
    metadata.category,
    metadata.type,
    metadata.subtype,
    metadata.classe,
    metadata.kind,
    ...(weapon.tags || []),
    ...(snapshot.tags || []),
  ].filter(Boolean).join(" "));
}

function defaultMagazineTemplateId(weapon = {}, profile = null) {
  const sourceId = weapon.definitionId || weapon.id || weapon.name || "weapon";
  const slug = normalizeRuleText(sourceId).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "weapon";
  return `${slug}-${profile?.defaultAmmoKind || AMMO_KINDS.LIGHT}-mag`;
}

function ammoProfileFromData(weapon = {}) {
  const direct = weapon.ammoProfile || weapon.metadata?.ammoProfile || weapon.definitionSnapshot?.ammoProfile || weapon.definitionSnapshot?.metadata?.ammoProfile;
  return direct && typeof direct === "object" ? clone(direct) : null;
}

export function normalizeAmmoKind(value) {
  const normalized = normalizeRuleText(value).replace(/[\s-]+/g, "_");
  const aliases = {
    none: AMMO_KINDS.NONE,
    sem_municao: AMMO_KINDS.NONE,
    leve: AMMO_KINDS.LIGHT,
    light: AMMO_KINDS.LIGHT,
    bala_leve: AMMO_KINDS.LIGHT,
    municao_leve: AMMO_KINDS.LIGHT,
    media: AMMO_KINDS.MEDIUM,
    medium: AMMO_KINDS.MEDIUM,
    bala_media: AMMO_KINDS.MEDIUM,
    municao_media: AMMO_KINDS.MEDIUM,
    cartucho: AMMO_KINDS.SHELL,
    shell: AMMO_KINDS.SHELL,
    escopeta: AMMO_KINDS.SHELL,
    celula: AMMO_KINDS.ENERGY_CELL,
    celula_de_energia: AMMO_KINDS.ENERGY_CELL,
    energy: AMMO_KINDS.ENERGY_CELL,
    energy_cell: AMMO_KINDS.ENERGY_CELL,
    granada: AMMO_KINDS.GRENADE,
    grenade: AMMO_KINDS.GRENADE,
    foguete: AMMO_KINDS.ROCKET,
    rocket: AMMO_KINDS.ROCKET,
  };
  return aliases[normalized] || Object.values(AMMO_KINDS).find((kind) => kind === normalized) || AMMO_KINDS.LIGHT;
}

export function inferWeaponAmmoProfile(weapon = {}) {
  const explicit = ammoProfileFromData(weapon);
  if (explicit) {
    const acceptedAmmoKinds = arrayOf(explicit.acceptedAmmoKinds || explicit.ammoKinds)
      .map(normalizeAmmoKind)
      .filter((kind) => kind !== AMMO_KINDS.NONE);
    const defaultAmmoKind = normalizeAmmoKind(explicit.defaultAmmoKind || acceptedAmmoKinds[0]);
    const feedSystem = Object.values(FEED_SYSTEMS).includes(explicit.feedSystem)
      ? explicit.feedSystem
      : FEED_SYSTEMS.DETACHABLE_MAGAZINE;
    return {
      feedSystem,
      defaultAmmoKind,
      acceptedAmmoKinds: acceptedAmmoKinds.length ? acceptedAmmoKinds : (feedSystem === FEED_SYSTEMS.NONE ? [] : [defaultAmmoKind]),
      defaultCapacity: Math.max(0, positiveInteger(explicit.defaultCapacity ?? explicit.capacity, feedSystem === FEED_SYSTEMS.NONE ? 0 : 1)),
      fireModes: uniqueStrings(explicit.fireModes).filter((mode) => FIRE_MODES[mode]),
      requiresPumpAfterShot: Boolean(explicit.requiresPumpAfterShot),
      magazineTemplateId: explicit.magazineTemplateId || "",
      label: explicit.label || "",
    };
  }

  const text = weaponRuleText(weapon);
  if (!text || /(punho|briga|espada|lamina|machado|martelo|lanca|cajado|adaga|faca|corpo a corpo|melee)/i.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.NONE,
      defaultAmmoKind: AMMO_KINDS.NONE,
      acceptedAmmoKinds: [],
      defaultCapacity: 0,
      fireModes: [],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Sem municao",
    };
  }

  if (/escopeta|shotgun|serrada/.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.INTERNAL_MAGAZINE,
      defaultAmmoKind: AMMO_KINDS.SHELL,
      acceptedAmmoKinds: [AMMO_KINDS.SHELL],
      defaultCapacity: /serrada/.test(text) ? 2 : 5,
      fireModes: [FIRE_MODE_IDS.SINGLE, FIRE_MODE_IDS.SHOTGUN_CONE],
      requiresPumpAfterShot: true,
      magazineTemplateId: "",
      label: "Tubo interno",
    };
  }

  if (/revolver|tambor/.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.CYLINDER,
      defaultAmmoKind: AMMO_KINDS.LIGHT,
      acceptedAmmoKinds: [AMMO_KINDS.LIGHT],
      defaultCapacity: 6,
      fireModes: [FIRE_MODE_IDS.SINGLE],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Tambor interno",
    };
  }

  if (/lancador|launcher|foguete|bazuca/.test(text)) {
    const ammoKind = /foguete|rocket|bazuca/.test(text) ? AMMO_KINDS.ROCKET : AMMO_KINDS.GRENADE;
    return {
      feedSystem: FEED_SYSTEMS.SINGLE_LOAD,
      defaultAmmoKind: ammoKind,
      acceptedAmmoKinds: [ammoKind],
      defaultCapacity: 1,
      fireModes: [FIRE_MODE_IDS.LAUNCHER_SHOT],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Carga unica",
    };
  }

  if (/submetralhadora|smg/.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.DETACHABLE_MAGAZINE,
      defaultAmmoKind: AMMO_KINDS.LIGHT,
      acceptedAmmoKinds: [AMMO_KINDS.LIGHT],
      defaultCapacity: 30,
      fireModes: [FIRE_MODE_IDS.SINGLE, FIRE_MODE_IDS.BURST],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Carregador",
    };
  }

  if (/metralhadora|machinegun|suporte pesado/.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.BELT,
      defaultAmmoKind: AMMO_KINDS.MEDIUM,
      acceptedAmmoKinds: [AMMO_KINDS.MEDIUM],
      defaultCapacity: 60,
      fireModes: [FIRE_MODE_IDS.MACHINEGUN_BURST, FIRE_MODE_IDS.SUPPRESSION],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Cinta interna",
    };
  }

  if (/laser|plasma|energia|energetic|celula/.test(text)) {
    return {
      feedSystem: FEED_SYSTEMS.ENERGY_CELL,
      defaultAmmoKind: AMMO_KINDS.ENERGY_CELL,
      acceptedAmmoKinds: [AMMO_KINDS.ENERGY_CELL],
      defaultCapacity: 8,
      fireModes: [FIRE_MODE_IDS.SINGLE, FIRE_MODE_IDS.BURST],
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Celula interna",
    };
  }

  if (/rifle|fuzil|carabina|precisao/.test(text)) {
    const modes = /fuzil|assalto/.test(text)
      ? [FIRE_MODE_IDS.SINGLE, FIRE_MODE_IDS.BURST, FIRE_MODE_IDS.HEAVY_BURST]
      : [FIRE_MODE_IDS.SINGLE, FIRE_MODE_IDS.BURST];
    return {
      feedSystem: FEED_SYSTEMS.DETACHABLE_MAGAZINE,
      defaultAmmoKind: AMMO_KINDS.MEDIUM,
      acceptedAmmoKinds: [AMMO_KINDS.MEDIUM],
      defaultCapacity: /precisao|precisão/.test(text) ? 5 : 20,
      fireModes: modes,
      requiresPumpAfterShot: false,
      magazineTemplateId: "",
      label: "Carregador",
    };
  }

  return {
    feedSystem: FEED_SYSTEMS.DETACHABLE_MAGAZINE,
    defaultAmmoKind: AMMO_KINDS.LIGHT,
    acceptedAmmoKinds: [AMMO_KINDS.LIGHT],
    defaultCapacity: 12,
    fireModes: [FIRE_MODE_IDS.SINGLE],
    requiresPumpAfterShot: false,
    magazineTemplateId: "",
    label: "Carregador",
  };
}

export function createWeaponAmmoState(weapon = {}, options = {}) {
  const profile = inferWeaponAmmoProfile(weapon);
  const acceptedAmmoKinds = arrayOf(profile.acceptedAmmoKinds)
    .map(normalizeAmmoKind)
    .filter((kind) => kind !== AMMO_KINDS.NONE);
  const feedSystem = profile.feedSystem || FEED_SYSTEMS.NONE;
  const defaultCapacity = Math.max(0, positiveInteger(options.defaultCapacity ?? profile.defaultCapacity, 0));
  const fireModes = uniqueStrings(options.fireModes || profile.fireModes).filter((mode) => FIRE_MODES[mode]);
  const internalFeedSystems = [
    FEED_SYSTEMS.INTERNAL_MAGAZINE,
    FEED_SYSTEMS.CYLINDER,
    FEED_SYSTEMS.SINGLE_LOAD,
    FEED_SYSTEMS.ENERGY_CELL,
    FEED_SYSTEMS.BELT,
  ];
  return {
    schemaVersion: 1,
    feedSystem,
    acceptedAmmoKinds,
    defaultAmmoKind: normalizeAmmoKind(options.defaultAmmoKind || profile.defaultAmmoKind || acceptedAmmoKinds[0] || AMMO_KINDS.NONE),
    defaultCapacity,
    compatibleMagazineTemplateIds: feedSystem === FEED_SYSTEMS.DETACHABLE_MAGAZINE
      ? [options.magazineTemplateId || profile.magazineTemplateId || defaultMagazineTemplateId(weapon, profile)]
      : [],
    attachedMagazineId: options.attachedMagazineId || "",
    internalAmmo: internalFeedSystems.includes(feedSystem)
      ? {
          ammoKind: normalizeAmmoKind(options.ammoKind || profile.defaultAmmoKind || acceptedAmmoKinds[0]),
          currentAmmo: clampNumber(options.currentAmmo ?? defaultCapacity, 0, defaultCapacity),
          capacity: defaultCapacity,
        }
      : null,
    status: {
      needsPump: Boolean(options.needsPump),
      jammed: Boolean(options.jammed),
      overheated: Boolean(options.overheated),
    },
    requiresPumpAfterShot: Boolean(options.requiresPumpAfterShot ?? profile.requiresPumpAfterShot),
    fireModes: fireModes.length ? fireModes : (feedSystem === FEED_SYSTEMS.NONE ? [] : [FIRE_MODE_IDS.SINGLE]),
    label: profile.label || "",
  };
}

function coerceWeaponAmmoState(weapon = {}) {
  const state = weapon.ammoState || weapon.customData?.ammoState || weapon.metadata?.ammoState;
  if (!state || typeof state !== "object") return createWeaponAmmoState(weapon);
  const profile = inferWeaponAmmoProfile(weapon);
  const base = createWeaponAmmoState(weapon, {
    ...profile,
    ...state,
    currentAmmo: state.internalAmmo?.currentAmmo,
    ammoKind: state.internalAmmo?.ammoKind,
  });
  return {
    ...base,
    ...clone(state),
    acceptedAmmoKinds: arrayOf(state.acceptedAmmoKinds || base.acceptedAmmoKinds).map(normalizeAmmoKind).filter((kind) => kind !== AMMO_KINDS.NONE),
    compatibleMagazineTemplateIds: uniqueStrings(state.compatibleMagazineTemplateIds || base.compatibleMagazineTemplateIds),
    status: { ...base.status, ...(state.status || {}) },
    internalAmmo: state.internalAmmo ? {
      ...base.internalAmmo,
      ...state.internalAmmo,
      ammoKind: normalizeAmmoKind(state.internalAmmo.ammoKind || base.internalAmmo?.ammoKind),
      capacity: Math.max(0, positiveInteger(state.internalAmmo.capacity, base.internalAmmo?.capacity || 0)),
      currentAmmo: clampNumber(state.internalAmmo.currentAmmo, 0, Math.max(0, positiveInteger(state.internalAmmo.capacity, base.internalAmmo?.capacity || 0))),
    } : base.internalAmmo,
    fireModes: uniqueStrings(state.fireModes || base.fireModes).filter((mode) => FIRE_MODES[mode]),
  };
}

export function createMagazineInstance(template = {}, options = {}) {
  const acceptedAmmoKinds = arrayOf(template.acceptedAmmoKinds || template.ammoKinds || options.acceptedAmmoKinds)
    .map(normalizeAmmoKind)
    .filter((kind) => kind !== AMMO_KINDS.NONE);
  const capacity = Math.max(1, positiveInteger(options.capacity ?? template.capacity, 1));
  const ammoKind = normalizeAmmoKind(options.ammoKind || options.loadedAmmoKind || template.defaultAmmoKind || acceptedAmmoKinds[0]);
  return {
    id: options.id || ammoId("magazine"),
    templateId: options.templateId || template.id || "",
    name: options.name || template.name || "Carregador",
    category: "magazine",
    compatibleWeaponIds: uniqueStrings(options.compatibleWeaponIds || template.compatibleWeaponIds),
    compatibleWeaponCategories: uniqueStrings(options.compatibleWeaponCategories || template.compatibleWeaponCategories),
    acceptedAmmoKinds: acceptedAmmoKinds.length ? acceptedAmmoKinds : [ammoKind],
    loadedAmmoKind: ammoKind,
    currentAmmo: clampNumber(options.currentAmmo ?? capacity, 0, capacity),
    capacity,
    attachedToWeaponId: options.attachedToWeaponId || "",
  };
}

function normalizeMagazine(magazine = {}) {
  return createMagazineInstance(magazine, {
    ...magazine,
    id: magazine.id,
    templateId: magazine.templateId,
    currentAmmo: magazine.currentAmmo,
    capacity: magazine.capacity,
    loadedAmmoKind: magazine.loadedAmmoKind || magazine.ammoKind,
  });
}

function magazineCompatibleWithWeapon(magazine = {}, weapon = {}, ammoState = coerceWeaponAmmoState(weapon)) {
  const normalized = normalizeMagazine(magazine);
  if (ammoState.feedSystem !== FEED_SYSTEMS.DETACHABLE_MAGAZINE) return false;
  if (normalized.templateId && ammoState.compatibleMagazineTemplateIds.includes(normalized.templateId)) return true;
  if (normalized.compatibleWeaponIds.includes(weapon.id) || normalized.compatibleWeaponIds.includes(weapon.definitionId)) return true;
  if (normalized.compatibleWeaponCategories.includes(weapon.category)) return true;
  return normalized.acceptedAmmoKinds.some((kind) => ammoState.acceptedAmmoKinds.includes(kind));
}

export function validateAmmoCompatibility(weapon = {}, ammoOrMagazine = {}) {
  const ammoState = coerceWeaponAmmoState(weapon);
  if (ammoState.feedSystem === FEED_SYSTEMS.NONE) throw new Error("Esta arma nao usa municao.");
  if (ammoOrMagazine.category === "magazine" || ammoOrMagazine.capacity !== undefined) {
    if (!magazineCompatibleWithWeapon(ammoOrMagazine, weapon, ammoState)) {
      throw new Error("Este carregador nao e compativel com a arma.");
    }
    return true;
  }
  const ammoKind = normalizeAmmoKind(ammoOrMagazine.ammoKind || ammoOrMagazine.loadedAmmoKind || ammoOrMagazine.kind);
  if (!ammoState.acceptedAmmoKinds.includes(ammoKind)) throw new Error("Municao incompativel com a arma.");
  return true;
}

export function attachMagazineToWeapon(weapon = {}, magazine = {}) {
  const nextWeapon = clone(weapon) || {};
  const nextMagazine = normalizeMagazine(magazine);
  const ammoState = coerceWeaponAmmoState(nextWeapon);
  if (ammoState.feedSystem !== FEED_SYSTEMS.DETACHABLE_MAGAZINE) throw new Error("Esta arma nao aceita carregador removivel.");
  validateAmmoCompatibility(nextWeapon, nextMagazine);
  ammoState.attachedMagazineId = nextMagazine.id;
  nextMagazine.attachedToWeaponId = nextWeapon.id || nextWeapon.uid || "";
  nextWeapon.ammoState = ammoState;
  return { weapon: nextWeapon, magazine: nextMagazine };
}

export function detachMagazineFromWeapon(weapon = {}, magazines = []) {
  const nextWeapon = clone(weapon) || {};
  const ammoState = coerceWeaponAmmoState(nextWeapon);
  const detachedId = ammoState.attachedMagazineId || "";
  ammoState.attachedMagazineId = "";
  nextWeapon.ammoState = ammoState;
  const nextMagazines = arrayOf(magazines).map((magazine) => {
    const nextMagazine = normalizeMagazine(magazine);
    if (nextMagazine.id === detachedId) nextMagazine.attachedToWeaponId = "";
    return nextMagazine;
  });
  return { weapon: nextWeapon, magazines: nextMagazines, detachedMagazineId: detachedId };
}

export function loadAmmoIntoMagazine(magazine = {}, ammoStack = {}, requestedAmount = Number.POSITIVE_INFINITY) {
  const nextMagazine = normalizeMagazine(magazine);
  const nextAmmoStack = clone(ammoStack) || {};
  const ammoKind = normalizeAmmoKind(nextAmmoStack.ammoKind || nextAmmoStack.kind);
  if (!nextMagazine.acceptedAmmoKinds.includes(ammoKind)) throw new Error("Municao incompativel com este carregador.");
  if (nextMagazine.currentAmmo > 0 && nextMagazine.loadedAmmoKind !== ammoKind) {
    throw new Error("Esvazie o carregador antes de trocar o tipo de municao.");
  }
  const available = Math.max(0, positiveInteger(nextAmmoStack.quantity ?? nextAmmoStack.currentAmmo, 0));
  const capacityLeft = Math.max(0, nextMagazine.capacity - nextMagazine.currentAmmo);
  const amount = Math.min(available, capacityLeft, Math.max(0, positiveInteger(requestedAmount, capacityLeft)));
  if (amount <= 0) throw new Error("Nao ha municao ou espaco suficiente para municiar.");
  nextMagazine.loadedAmmoKind = ammoKind;
  nextMagazine.currentAmmo += amount;
  nextAmmoStack.quantity = available - amount;
  return { magazine: nextMagazine, ammoStack: nextAmmoStack, loaded: amount };
}

export function reloadInternalWeapon(weapon = {}, ammoStack = {}, requestedAmount = Number.POSITIVE_INFINITY) {
  const nextWeapon = clone(weapon) || {};
  const ammoState = coerceWeaponAmmoState(nextWeapon);
  if (!ammoState.internalAmmo) throw new Error("Esta arma precisa de carregador, nao de recarga interna.");
  const nextAmmoStack = clone(ammoStack) || {};
  const ammoKind = normalizeAmmoKind(nextAmmoStack.ammoKind || nextAmmoStack.kind);
  if (!ammoState.acceptedAmmoKinds.includes(ammoKind)) throw new Error("Municao incompativel com a arma.");
  if (ammoState.internalAmmo.currentAmmo > 0 && ammoState.internalAmmo.ammoKind !== ammoKind) {
    throw new Error("Esvazie a arma antes de trocar o tipo de municao.");
  }
  const available = Math.max(0, positiveInteger(nextAmmoStack.quantity ?? nextAmmoStack.currentAmmo, 0));
  const capacityLeft = Math.max(0, ammoState.internalAmmo.capacity - ammoState.internalAmmo.currentAmmo);
  const amount = Math.min(available, capacityLeft, Math.max(0, positiveInteger(requestedAmount, capacityLeft)));
  if (amount <= 0) throw new Error("Nao ha municao ou espaco suficiente para recarregar.");
  ammoState.internalAmmo.ammoKind = ammoKind;
  ammoState.internalAmmo.currentAmmo += amount;
  nextAmmoStack.quantity = available - amount;
  ammoState.status.needsPump = false;
  nextWeapon.ammoState = ammoState;
  return { weapon: nextWeapon, ammoStack: nextAmmoStack, loaded: amount };
}

export function resolveActiveAmmoSource(weapon = {}, magazines = []) {
  const ammoState = coerceWeaponAmmoState(weapon);
  if (ammoState.feedSystem === FEED_SYSTEMS.NONE) {
    return { kind: FEED_SYSTEMS.NONE, label: "Sem municao", currentAmmo: Number.POSITIVE_INFINITY, capacity: 0, missing: false };
  }
  if (ammoState.feedSystem === FEED_SYSTEMS.DETACHABLE_MAGAZINE) {
    const magazine = arrayOf(magazines).map(normalizeMagazine).find((entry) => entry.id === ammoState.attachedMagazineId) || null;
    if (!magazine) return { kind: FEED_SYSTEMS.DETACHABLE_MAGAZINE, label: "Sem carregador", currentAmmo: 0, capacity: 0, missing: true, magazine: null };
    return {
      kind: FEED_SYSTEMS.DETACHABLE_MAGAZINE,
      label: magazine.name || "Carregador",
      currentAmmo: magazine.currentAmmo,
      capacity: magazine.capacity,
      ammoKind: magazine.loadedAmmoKind,
      missing: false,
      magazine,
    };
  }
  const internalAmmo = ammoState.internalAmmo || { currentAmmo: 0, capacity: 0, ammoKind: ammoState.defaultAmmoKind };
  return {
    kind: ammoState.feedSystem,
    label: ammoState.label || (ammoState.feedSystem === FEED_SYSTEMS.CYLINDER ? "Tambor interno" : "Alimentacao interna"),
    currentAmmo: internalAmmo.currentAmmo,
    capacity: internalAmmo.capacity,
    ammoKind: internalAmmo.ammoKind,
    missing: false,
    internalAmmo,
  };
}

export function validateAmmoAvailable(source = {}, amount = 1) {
  if (source.currentAmmo === Number.POSITIVE_INFINITY) return true;
  if (Math.max(0, positiveInteger(source.currentAmmo, 0)) < amount) {
    throw new Error(`Municao insuficiente: precisa de ${amount}.`);
  }
  return true;
}

export function validateWeaponCanFire(weapon = {}, magazines = [], modeId = FIRE_MODE_IDS.SINGLE) {
  const ammoState = coerceWeaponAmmoState(weapon);
  const mode = FIRE_MODES[modeId] || FIRE_MODES[FIRE_MODE_IDS.SINGLE];
  if (ammoState.feedSystem === FEED_SYSTEMS.NONE) return { ammoState, mode, source: resolveActiveAmmoSource(weapon, magazines) };
  if (!ammoState.fireModes.includes(mode.id)) throw new Error("Modo de disparo indisponivel para esta arma.");
  if (ammoState.status?.jammed) throw new Error("A arma esta travada.");
  if (ammoState.status?.overheated) throw new Error("A arma esta superaquecida.");
  if (ammoState.status?.needsPump) throw new Error("A arma precisa ser bombeada antes de disparar.");
  const source = resolveActiveAmmoSource(weapon, magazines);
  if (source.missing) throw new Error("Sem carregador.");
  validateAmmoAvailable(source, mode.ammoCost);
  return { ammoState, mode, source };
}

export function fireWeapon(weapon = {}, options = {}) {
  const modeId = options.modeId || options.fireModeId || FIRE_MODE_IDS.SINGLE;
  const nextWeapon = clone(weapon) || {};
  const nextMagazines = arrayOf(options.magazines).map(normalizeMagazine);
  const { ammoState, mode, source } = validateWeaponCanFire(nextWeapon, nextMagazines, modeId);
  if (ammoState.feedSystem === FEED_SYSTEMS.NONE) {
    return { weapon: nextWeapon, magazines: nextMagazines, consumed: 0, mode, source, message: "Arma sem municao disparada." };
  }
  if (ammoState.feedSystem === FEED_SYSTEMS.DETACHABLE_MAGAZINE) {
    const magazine = nextMagazines.find((entry) => entry.id === ammoState.attachedMagazineId);
    magazine.currentAmmo = Math.max(0, magazine.currentAmmo - mode.ammoCost);
  } else if (ammoState.internalAmmo) {
    ammoState.internalAmmo.currentAmmo = Math.max(0, ammoState.internalAmmo.currentAmmo - mode.ammoCost);
    if (ammoState.requiresPumpAfterShot) ammoState.status.needsPump = true;
  }
  nextWeapon.ammoState = ammoState;
  return {
    weapon: nextWeapon,
    magazines: nextMagazines,
    consumed: mode.ammoCost,
    mode,
    source: resolveActiveAmmoSource(nextWeapon, nextMagazines),
    message: `${mode.label}: ${mode.ammoCost} municao consumida.`,
  };
}

export function pumpWeapon(weapon = {}) {
  const nextWeapon = clone(weapon) || {};
  const ammoState = coerceWeaponAmmoState(nextWeapon);
  if (!ammoState.requiresPumpAfterShot) throw new Error("Esta arma nao precisa bombear.");
  ammoState.status.needsPump = false;
  nextWeapon.ammoState = ammoState;
  return nextWeapon;
}

export function moveItem(items = [], itemId = "", location = {}) {
  return arrayOf(items).map((item) => {
    if ((item.id || item.uid) !== itemId) return clone(item);
    return { ...clone(item), location: normalizeLocation(location) };
  });
}

export function ammoCubeUnitsFor(item = {}) {
  if (item.category === "magazine" || item.ammoMagazine || item.capacity !== undefined) return Math.max(1, positiveInteger(item.quantity, 1));
  const ammoKind = normalizeAmmoKind(item.ammoKind || item.kind || item.loadedAmmoKind);
  const bulk = AMMO_CUBE_BULK[ammoKind] || 1;
  const quantity = Math.max(1, positiveInteger(item.quantity ?? item.currentAmmo, 1));
  return Math.max(1, Math.ceil(quantity / bulk));
}

export function canStoreInAmmoCube(item = {}) {
  if (item.category === "magazine" || item.ammoMagazine || item.capacity !== undefined) return true;
  const category = normalizeRuleText(item.category || item.type || item.name);
  return category.includes("municao") || category.includes("ammo") || Boolean(item.ammoKind);
}

function normalizedLootName(value) {
  return String(value || "")
    .replace(/^[\s◆•●▪◦*+\-–—\d.)]+/u, "")
    .replace(/^recursos?\s+colet[aá]veis?\s*:\s*/iu, "")
    .replace(/[.;:]+$/u, "")
    .trim();
}

export function parseMonsterLootResources(resources = "") {
  const source = arrayOf(resources).length ? resources.join("\n") : String(resources || "");
  const lines = source.replace(/\r/g, "").split(/\n+/);
  const hasCollectibleSection = lines.some((line) => /recursos?\s+colet[aá]veis?/iu.test(line));
  let collecting = !hasCollectibleSection;
  const relevantLines = [];
  lines.forEach((line) => {
    if (/recursos?\s+colet[aá]veis?/iu.test(line)) {
      collecting = true;
      relevantLines.push(line);
      return;
    }
    if (collecting && hasCollectibleSection && /^[\s◆•●▪◦*+\-–—]*[^:]+:\s*/u.test(line)) {
      collecting = false;
    }
    if (collecting) relevantLines.push(line);
  });
  const entries = relevantLines
    .flatMap((line) => {
      const cleaned = normalizedLootName(line);
      if (!cleaned) return [];
      return cleaned.split(/\s*,\s*|\s+e\s+(?=[^,]+$)/iu);
    })
    .map(normalizedLootName)
    .filter((name) => name && !/^(?:nenhum|nenhuma|n\/a)$/iu.test(name));
  const seen = new Set();
  return entries.filter((name) => {
    const key = name.toLocaleLowerCase("pt-BR");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function monsterLootChance(index, count) {
  if (count <= 1) return 70;
  if (count === 2) return [80, 35][index];
  if (count === 3) return [85, 55, 25][index];
  return Math.max(15, Math.round(85 - ((65 * index) / (count - 1))));
}

function monsterLootRarity(chance) {
  if (chance >= 70) return "Comum";
  if (chance >= 45) return "Incomum";
  if (chance >= 25) return "Raro";
  return "Exótico";
}

export function buildMonsterLootTable(resources = "") {
  const names = parseMonsterLootResources(resources);
  return names.map((name, index) => {
    const chance = monsterLootChance(index, names.length);
    return {
      id: `loot-${index + 1}`,
      name,
      chance,
      rarity: monsterLootRarity(chance),
      minQuantity: 1,
      maxQuantity: chance >= 70 ? 3 : (chance >= 45 ? 2 : 1),
    };
  });
}

export function rollMonsterLoot(table = [], random = Math.random, options = {}) {
  const attempts = arrayOf(table).map((item) => {
    const roll = Math.min(100, Math.max(1, Math.floor(numeric(random(), 0) * 100) + 1));
    const dropped = roll <= numeric(item.chance, 0);
    let quantity = 0;
    if (dropped) {
      const min = Math.max(1, positiveInteger(item.minQuantity, 1));
      const max = Math.max(min, positiveInteger(item.maxQuantity, min));
      quantity = min + Math.floor(numeric(random(), 0) * ((max - min) + 1));
    }
    return {
      id: item.id,
      name: item.name,
      chance: item.chance,
      rarity: item.rarity,
      roll,
      dropped,
      quantity,
    };
  });
  return {
    id: createId("loot-roll"),
    reason: String(options.reason || "manual"),
    createdAt: options.createdAt || new Date().toISOString(),
    attempts,
    drops: attempts.filter((item) => item.dropped),
  };
}

function normalizeSourceReference(sourceReference = {}) {
  return {
    book: String(sourceReference.book || ""),
    chapter: String(sourceReference.chapter || ""),
    page: String(sourceReference.page || ""),
    origin: String(sourceReference.origin || ""),
    notes: String(sourceReference.notes || ""),
  };
}

function mergeSourceReference(base = {}, override = {}) {
  const merged = normalizeSourceReference(base);
  Object.entries(normalizeSourceReference(override)).forEach(([key, value]) => {
    if (value) merged[key] = value;
  });
  return merged;
}

export function normalizeLocation(location = {}) {
  const kind = Object.values(LOCATION_KINDS).includes(location?.kind)
    ? location.kind
    : LOCATION_KINDS.UNASSIGNED;
  return {
    kind,
    containerId: String(location?.containerId || ""),
    slotId: String(location?.slotId || ""),
    label: String(location?.label || ""),
  };
}

function normalizedCatalogKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function reconcileLegacyArmorCatalog(
  legacyCharacter = {},
  armorCatalog = [],
  definitionSnapshotFactory = (armor) => armor
) {
  const catalog = arrayOf(armorCatalog);
  const byId = new Map(catalog.map((armor) => [String(armor.id || ""), armor]).filter(([id]) => id));
  const byName = new Map(catalog.map((armor) => [normalizedCatalogKey(armor.name), armor]).filter(([name]) => name));
  const equippedArmorUid = String(legacyCharacter.equippedArmorUid || "");

  const findArmor = (entry = {}, fallbackName = "") => {
    const domainEntity = entry.domainEntity || {};
    const snapshot = domainEntity.definitionSnapshot || {};
    const ids = [entry.itemId, entry.id, domainEntity.definitionId, snapshot.id].filter(Boolean);
    for (const id of ids) {
      const armor = byId.get(String(id));
      if (armor) return armor;
    }
    const names = [entry.name, domainEntity.name, snapshot.name, fallbackName];
    for (const name of names) {
      const armor = byName.get(normalizedCatalogKey(name));
      if (armor) return armor;
    }
    return null;
  };

  const reconcileDomainEntity = (entity = {}, armor) => {
    const definitionSnapshot = clone(definitionSnapshotFactory(armor)) || {};
    return {
      ...entity,
      definitionId: armor.id,
      entityType: ENTITY_TYPES.ARMOR,
      name: armor.name,
      category: "armor",
      weight: Math.max(0, numeric(definitionSnapshot.weight, entity.weight || 0)),
      definitionSnapshot,
    };
  };

  const inventory = arrayOf(legacyCharacter.inventory).map((entry) => {
    const armor = findArmor(entry, entry.uid === equippedArmorUid ? legacyCharacter.armor : "");
    if (!armor) return entry;
    return {
      ...entry,
      itemId: armor.id,
      category: "armor",
      name: armor.name,
      ca: numeric(armor.ca, 0),
      domainEntity: entry.domainEntity && typeof entry.domainEntity === "object"
        ? reconcileDomainEntity(entry.domainEntity, armor)
        : entry.domainEntity,
    };
  });

  const entriesByUid = new Map(inventory.map((entry) => [entry.uid, entry]));
  const domainCharacter = legacyCharacter.domainCharacter && typeof legacyCharacter.domainCharacter === "object"
    ? {
      ...legacyCharacter.domainCharacter,
      inventory: Array.isArray(legacyCharacter.domainCharacter.inventory)
        ? legacyCharacter.domainCharacter.inventory.map((entity) => {
          const legacyEntry = entriesByUid.get(entity.id) || {};
          const armor = findArmor({
            ...legacyEntry,
            itemId: legacyEntry.itemId || entity.definitionId,
            domainEntity: entity,
          }, entity.id === equippedArmorUid ? legacyCharacter.armor : "");
          return armor ? reconcileDomainEntity(entity, armor) : entity;
        })
        : legacyCharacter.domainCharacter.inventory,
    }
    : legacyCharacter.domainCharacter;

  return {
    ...legacyCharacter,
    inventory,
    domainCharacter,
  };
}

function storageLocationKind(storageType) {
  if (storageType === STORAGE_TYPES.CUBE) return LOCATION_KINDS.CUBE;
  if (storageType === STORAGE_TYPES.HOOK) return LOCATION_KINDS.HOOK;
  if (storageType === STORAGE_TYPES.HOLSTER) return LOCATION_KINDS.HOLSTER;
  if (storageType === STORAGE_TYPES.BANDOLIER) return LOCATION_KINDS.BANDOLIER;
  if (storageType === STORAGE_TYPES.VEHICLE) return LOCATION_KINDS.VEHICLE;
  return LOCATION_KINDS.CONTAINER;
}

function coerceEffect(effect) {
  return effect instanceof Effect ? effect : Effect.fromJSON(effect);
}

function coerceRequirement(requirement) {
  return requirement instanceof Requirement ? requirement : Requirement.fromJSON(requirement);
}

function coerceCondition(condition) {
  return condition instanceof Condition ? condition : Condition.fromJSON(condition);
}

function coerceResource(resource) {
  return resource instanceof ResourcePool ? resource : ResourcePool.fromJSON(resource);
}

function coerceRachaduras(value) {
  return value instanceof Rachaduras ? value : Rachaduras.fromJSON(value);
}

function coerceDefinition(definition) {
  if (definition instanceof EntityDefinition) return definition;
  return EntityDefinition.fromJSON(definition);
}

function coerceInstance(entity) {
  return entity instanceof EntityInstance ? entity : EntityInstance.fromJSON(entity);
}

export class Effect {
  constructor({
    id = createId("effect"),
    key = "",
    operation = EFFECT_OPERATIONS.ADD,
    value = 0,
    label = "",
    source = "",
    enabled = true,
    metadata = {},
  } = {}) {
    this.id = id;
    this.key = String(key || "");
    this.operation = Object.values(EFFECT_OPERATIONS).includes(operation)
      ? operation
      : EFFECT_OPERATIONS.ADD;
    this.value = numeric(value, 0);
    this.label = String(label || "");
    this.source = String(source || "");
    this.enabled = enabled !== false;
    this.metadata = clone(metadata) || {};
  }

  apply(currentValue) {
    const current = numeric(currentValue, 0);
    if (!this.enabled) return current;
    if (this.operation === EFFECT_OPERATIONS.SUBTRACT) return current - this.value;
    if (this.operation === EFFECT_OPERATIONS.MULTIPLY) return current * this.value;
    if (this.operation === EFFECT_OPERATIONS.SET) return this.value;
    return current + this.value;
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      operation: this.operation,
      value: this.value,
      label: this.label,
      source: this.source,
      enabled: this.enabled,
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new Effect(data);
  }
}

export class Requirement {
  constructor({
    id = createId("requirement"),
    scope = "property",
    key = "",
    operator = ">=",
    value = 0,
    label = "",
    message = "",
  } = {}) {
    this.id = id;
    this.scope = String(scope || "property");
    this.key = String(key || "");
    this.operator = String(operator || ">=");
    this.value = value;
    this.label = String(label || "");
    this.message = String(message || "");
  }

  getActualValue(character) {
    if (this.scope === "attribute") return character.attributes?.[this.key];
    if (this.scope === "derivedStat") return character.getDerivedStat(this.key);
    return this.key.split(".").reduce((current, part) => current?.[part], character);
  }

  validate(character) {
    const actual = this.getActualValue(character);
    const expected = this.value;
    let valid = false;
    if (this.operator === "==") valid = actual == expected;
    else if (this.operator === "===") valid = actual === expected;
    else if (this.operator === "!=") valid = actual != expected;
    else if (this.operator === "!==") valid = actual !== expected;
    else if (this.operator === ">") valid = numeric(actual) > numeric(expected);
    else if (this.operator === "<") valid = numeric(actual) < numeric(expected);
    else if (this.operator === "<=") valid = numeric(actual) <= numeric(expected);
    else if (this.operator === "includes") valid = arrayOf(actual).includes(expected);
    else valid = numeric(actual) >= numeric(expected);
    return {
      valid,
      actual,
      expected,
      message: valid ? "" : this.message || `${this.label || this.key} não atende ao requisito.`,
    };
  }

  toJSON() {
    return {
      id: this.id,
      scope: this.scope,
      key: this.key,
      operator: this.operator,
      value: clone(this.value),
      label: this.label,
      message: this.message,
    };
  }

  static fromJSON(data = {}) {
    return new Requirement(data);
  }
}

export class Condition {
  constructor({
    id = createId("condition"),
    key = "",
    label = "",
    description = "",
    duration = null,
    active = true,
    effects = [],
    metadata = {},
  } = {}) {
    this.id = id;
    this.key = String(key || id);
    this.label = String(label || key || "Condição");
    this.description = String(description || "");
    this.duration = duration === null ? null : numeric(duration, 0);
    this.active = active !== false;
    this.effects = arrayOf(effects).map(coerceEffect);
    this.metadata = clone(metadata) || {};
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      label: this.label,
      description: this.description,
      duration: this.duration,
      active: this.active,
      effects: this.effects.map((effect) => effect.toJSON()),
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new Condition(data);
  }
}

export class Rachaduras {
  constructor({ current = 0, max = 5 } = {}) {
    this.max = Math.max(1, positiveInteger(max, 5));
    this.current = Math.min(this.max, positiveInteger(current, 0));
  }

  add(amount = 1) {
    this.current = Math.min(this.max, this.current + positiveInteger(amount, 0));
    return this.current;
  }

  repair(amount = 1) {
    this.current = Math.max(0, this.current - positiveInteger(amount, 0));
    return this.current;
  }

  isCollapsed() {
    return this.current >= this.max;
  }

  toJSON() {
    return { current: this.current, max: this.max };
  }

  static fromJSON(data = {}) {
    return new Rachaduras(data || {});
  }
}

export class ResourcePool {
  constructor({
    key = "",
    label = "",
    current = 0,
    max = 0,
    type = "uses",
    recharge = "",
  } = {}) {
    this.key = String(key || "");
    this.label = String(label || key);
    this.max = Math.max(0, numeric(max, 0));
    this.current = Math.min(this.max, Math.max(0, numeric(current, this.max)));
    this.type = String(type || "uses");
    this.recharge = String(recharge || "");
  }

  spend(amount = 1) {
    const cost = Math.max(0, numeric(amount, 0));
    if (this.current < cost) return false;
    this.current -= cost;
    return true;
  }

  restore(amount = 1) {
    this.current = Math.min(this.max, this.current + Math.max(0, numeric(amount, 0)));
    return this.current;
  }

  refill() {
    this.current = this.max;
    return this.current;
  }

  toJSON() {
    return {
      key: this.key,
      label: this.label,
      current: this.current,
      max: this.max,
      type: this.type,
      recharge: this.recharge,
    };
  }

  static fromJSON(data = {}) {
    return new ResourcePool(data);
  }
}

export class EntityDefinition {
  constructor({
    id = createId("definition"),
    entityType = ENTITY_TYPES.ITEM,
    name = "",
    category = "",
    description = "",
    weight = 0,
    price = 0,
    purchasable = true,
    physical = true,
    tags = [],
    effects = [],
    requirements = [],
    resources = [],
    rachadurasMax = 5,
    metadata = {},
    sourceReference = {},
    foundryType = "",
  } = {}) {
    this.id = String(id || createId("definition"));
    this.entityType = String(entityType || ENTITY_TYPES.ITEM);
    this.name = String(name || "Entidade sem nome");
    this.category = String(category || "");
    this.description = String(description || "");
    this.weight = Math.max(0, numeric(weight, 0));
    this.price = Math.max(0, numeric(price, 0));
    this.purchasable = purchasable !== false;
    this.physical = physical !== false;
    this.tags = uniqueStrings(tags);
    this.effects = arrayOf(effects).map(coerceEffect);
    this.requirements = arrayOf(requirements).map(coerceRequirement);
    this.resources = arrayOf(resources).map(coerceResource);
    this.rachadurasMax = Math.max(1, positiveInteger(rachadurasMax, 5));
    this.metadata = clone(metadata) || {};
    this.sourceReference = normalizeSourceReference(sourceReference);
    this.foundryType = String(foundryType || this.entityType);
  }

  validateRequirements(character) {
    const results = this.requirements.map((requirement) => requirement.validate(character));
    return {
      valid: results.every((result) => result.valid),
      results,
      messages: results.filter((result) => !result.valid).map((result) => result.message),
    };
  }

  createInstance(options = {}) {
    // Definitions are immutable catalog records; mutable wear and resources live on instances.
    return new EntityInstance({
      id: options.id || createId(this.entityType),
      definitionId: this.id,
      entityType: this.entityType,
      name: options.name || this.name,
      category: options.category || this.category,
      physical: options.physical ?? this.physical,
      weight: options.weight ?? this.weight,
      quantity: options.quantity ?? 1,
      baseCost: options.baseCost ?? this.price,
      location: options.location,
      rachaduras: options.rachaduras || { current: 0, max: this.rachadurasMax },
      resources: options.resources || this.resources.map((resource) => resource.toJSON()),
      effects: options.effects || this.effects.map((effect) => effect.toJSON()),
      metadata: { ...clone(this.metadata), ...clone(options.metadata || {}) },
      sourceReference: mergeSourceReference(this.sourceReference, options.sourceReference),
      definitionSnapshot: this.toJSON(),
      installedModIds: options.installedModIds,
      storage: options.storage,
      customData: options.customData,
    });
  }

  toJSON() {
    return {
      definitionClass: this.constructor.name,
      id: this.id,
      entityType: this.entityType,
      name: this.name,
      category: this.category,
      description: this.description,
      weight: this.weight,
      price: this.price,
      purchasable: this.purchasable,
      physical: this.physical,
      tags: [...this.tags],
      effects: this.effects.map((effect) => effect.toJSON()),
      requirements: this.requirements.map((requirement) => requirement.toJSON()),
      resources: this.resources.map((resource) => resource.toJSON()),
      rachadurasMax: this.rachadurasMax,
      metadata: clone(this.metadata),
      sourceReference: { ...this.sourceReference },
      foundryType: this.foundryType,
    };
  }

  static fromJSON(data = {}) {
    const DefinitionClass = DEFINITION_CLASS_BY_TYPE.get(data.definitionClass)
      || DEFINITION_CLASS_BY_TYPE.get(data.entityType)
      || EntityDefinition;
    return new DefinitionClass(data);
  }
}

export class ItemDefinition extends EntityDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: data.entityType || ENTITY_TYPES.ITEM });
  }
}

export class EquipmentDefinition extends ItemDefinition {
  constructor(data = {}) {
    super(data);
    this.slotTypes = uniqueStrings(data.slotTypes);
  }

  toJSON() {
    return { ...super.toJSON(), slotTypes: [...this.slotTypes] };
  }
}

export class WeaponDefinition extends EquipmentDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: ENTITY_TYPES.WEAPON });
    this.damage = String(data.damage || "");
    this.range = String(data.range || "");
    this.modSlots = positiveInteger(data.modSlots, 0);
    this.ammoProfile = data.ammoProfile ? clone(data.ammoProfile) : null;
  }

  toJSON() {
    return { ...super.toJSON(), damage: this.damage, range: this.range, modSlots: this.modSlots, ammoProfile: clone(this.ammoProfile) };
  }
}

export class ArmorDefinition extends EquipmentDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: ENTITY_TYPES.ARMOR });
    this.ca = numeric(data.ca, 0);
    this.modSlots = positiveInteger(data.modSlots, 0);
  }

  toJSON() {
    return { ...super.toJSON(), ca: this.ca, modSlots: this.modSlots };
  }
}

export class StorageDefinition extends EquipmentDefinition {
  constructor(data = {}) {
    super(data);
    this.storageType = String(data.storageType || STORAGE_TYPES.CONTAINER);
    this.maxSlots = Math.max(0, numeric(data.maxSlots, 0));
    this.maxWeight = Math.max(0, numeric(data.maxWeight, 0));
    this.allowedTypes = uniqueStrings(data.allowedTypes);
    this.forbiddenTypes = uniqueStrings(data.forbiddenTypes);
    this.allowedCategories = uniqueStrings(data.allowedCategories);
    this.forbiddenCategories = uniqueStrings(data.forbiddenCategories);
    this.allowedSizes = uniqueStrings(data.allowedSizes).map(normalizeInventorySize).filter(Boolean);
    this.quickAccess = Boolean(data.quickAccess);
  }

  createInstance(options = {}) {
    return super.createInstance({
      ...options,
      storage: {
        storageType: this.storageType,
        maxSlots: this.maxSlots,
        maxWeight: this.maxWeight,
        usedSlots: 0,
        storedEntityIds: [],
        allowedTypes: [...this.allowedTypes],
        forbiddenTypes: [...this.forbiddenTypes],
        allowedCategories: [...this.allowedCategories],
        forbiddenCategories: [...this.forbiddenCategories],
        allowedSizes: [...this.allowedSizes],
        quickAccess: this.quickAccess,
        ...clone(options.storage || {}),
      },
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      storageType: this.storageType,
      maxSlots: this.maxSlots,
      maxWeight: this.maxWeight,
      allowedTypes: [...this.allowedTypes],
      forbiddenTypes: [...this.forbiddenTypes],
      allowedCategories: [...this.allowedCategories],
      forbiddenCategories: [...this.forbiddenCategories],
      allowedSizes: [...this.allowedSizes],
      quickAccess: this.quickAccess,
    };
  }
}

export class CubeDefinition extends StorageDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: ENTITY_TYPES.CUBE, storageType: STORAGE_TYPES.CUBE });
    this.cubeKind = String(data.cubeKind || "simple");
  }

  toJSON() {
    return { ...super.toJSON(), cubeKind: this.cubeKind };
  }
}

export class HolsterDefinition extends StorageDefinition {
  constructor(data = {}) {
    super({
      ...data,
      entityType: ENTITY_TYPES.HOLSTER,
      storageType: STORAGE_TYPES.HOLSTER,
      allowedTypes: data.allowedTypes || [ENTITY_TYPES.WEAPON],
      allowedSizes: data.allowedSizes || [INVENTORY_SIZES.SMALL],
      quickAccess: data.quickAccess ?? true,
    });
  }
}

export class BandolierDefinition extends StorageDefinition {
  constructor(data = {}) {
    super({
      ...data,
      entityType: ENTITY_TYPES.BANDOLIER,
      storageType: STORAGE_TYPES.BANDOLIER,
      allowedTypes: data.allowedTypes || [ENTITY_TYPES.WEAPON, ENTITY_TYPES.ITEM],
      allowedSizes: data.allowedSizes || [INVENTORY_SIZES.MEDIUM, INVENTORY_SIZES.LARGE],
      quickAccess: data.quickAccess ?? true,
    });
  }
}

export class HookDefinition extends StorageDefinition {
  constructor(data = {}) {
    super({
      ...data,
      entityType: ENTITY_TYPES.HOOK,
      storageType: STORAGE_TYPES.HOOK,
      allowedTypes: data.allowedTypes || [ENTITY_TYPES.WEAPON, ENTITY_TYPES.ITEM],
      quickAccess: data.quickAccess ?? true,
    });
  }
}

export class ChipModDefinition extends ItemDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: ENTITY_TYPES.CHIP_MOD });
    this.slotCost = Math.max(1, positiveInteger(data.slotCost, 1));
  }

  toJSON() {
    return { ...super.toJSON(), slotCost: this.slotCost };
  }
}

export class CosmicSpellDefinition extends EntityDefinition {
  constructor(data = {}) {
    super({ ...data, entityType: ENTITY_TYPES.COSMIC_SPELL, physical: data.physical ?? false });
    this.cosmosCost = Math.max(0, numeric(data.cosmosCost, 0));
  }

  toJSON() {
    return { ...super.toJSON(), cosmosCost: this.cosmosCost };
  }
}

export class EntityInstance {
  constructor({
    id = createId("instance"),
    definitionId = "",
    entityType = ENTITY_TYPES.ITEM,
    name = "",
    category = "",
    physical = true,
    weight = 0,
    quantity = 1,
    baseCost = 0,
    location = {},
    rachaduras = {},
    resources = [],
    effects = [],
    installedModIds = [],
    storage = null,
    metadata = {},
    sourceReference = {},
    definitionSnapshot = null,
    customData = {},
    createdAt = new Date().toISOString(),
    updatedAt = null,
  } = {}) {
    this.id = String(id || createId("instance"));
    this.definitionId = String(definitionId || "");
    this.entityType = String(entityType || ENTITY_TYPES.ITEM);
    this.name = String(name || definitionSnapshot?.name || "Instância sem nome");
    this.category = String(category || definitionSnapshot?.category || "");
    this.physical = physical !== false;
    this.weight = Math.max(0, numeric(weight, definitionSnapshot?.weight || 0));
    this.quantity = Math.max(1, numeric(quantity, 1));
    this.baseCost = Math.max(0, numeric(baseCost, definitionSnapshot?.price || 0));
    this.location = normalizeLocation(location);
    this.rachaduras = coerceRachaduras(rachaduras);
    this.resources = arrayOf(resources).map(coerceResource);
    this.effects = arrayOf(effects).map(coerceEffect);
    this.installedModIds = uniqueStrings(installedModIds);
    this.storage = storage ? this.normalizeStorage(storage) : null;
    this.metadata = clone(metadata) || {};
    this.sourceReference = normalizeSourceReference(sourceReference);
    this.definitionSnapshot = definitionSnapshot ? clone(definitionSnapshot) : null;
    this.customData = clone(customData) || {};
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt;
  }

  normalizeStorage(storage = {}) {
    const maxSlots = Math.max(0, numeric(storage.maxSlots, 0));
    const storedEntityIds = uniqueStrings(storage.storedEntityIds);
    return {
      storageType: String(storage.storageType || STORAGE_TYPES.CONTAINER),
      maxSlots,
      maxWeight: Math.max(0, numeric(storage.maxWeight, 0)),
      usedSlots: Math.min(maxSlots || Number.POSITIVE_INFINITY, Math.max(0, numeric(storage.usedSlots, storedEntityIds.length))),
      storedEntityIds,
      allowedTypes: uniqueStrings(storage.allowedTypes),
      forbiddenTypes: uniqueStrings(storage.forbiddenTypes),
      allowedCategories: uniqueStrings(storage.allowedCategories),
      forbiddenCategories: uniqueStrings(storage.forbiddenCategories),
      allowedSizes: uniqueStrings(storage.allowedSizes).map(normalizeInventorySize).filter(Boolean),
      quickAccess: Boolean(storage.quickAccess),
    };
  }

  isStorage() {
    return Boolean(this.storage);
  }

  getSlotCostFor(entity) {
    return Math.max(1, numeric(entity?.customData?.slotCost, entity?.definitionSnapshot?.slotCost || 1));
  }

  getAvailableSlots(inventory = null) {
    if (!this.storage) return 0;
    const used = inventory
      ? this.storage.storedEntityIds.reduce((total, id) => {
        const entity = inventory.findById(id);
        return total + (entity ? this.getSlotCostFor(entity) : 0);
      }, 0)
      : numeric(this.storage.usedSlots, 0);
    this.storage.usedSlots = used;
    if (this.storage.maxSlots <= 0) return Number.POSITIVE_INFINITY;
    return Math.max(0, this.storage.maxSlots - used);
  }

  getStoredWeight(inventory = null) {
    if (!this.storage || !inventory) return 0;
    return this.storage.storedEntityIds.reduce((total, id) => {
      const entity = inventory.findById(id);
      if (!entity?.physical) return total;
      return total + entity.weight * entity.quantity;
    }, 0);
  }

  getAvailableWeight(inventory = null) {
    if (!this.storage?.maxWeight) return Number.POSITIVE_INFINITY;
    return Math.max(0, this.storage.maxWeight - this.getStoredWeight(inventory));
  }

  canStore(entity, inventory = null) {
    if (!this.storage || !entity || entity.id === this.id) return false;
    if (this.storage.forbiddenTypes.includes(entity.entityType)) return false;
    if (this.storage.forbiddenCategories.includes(entity.category)) return false;
    if (this.storage.allowedTypes.length && !this.storage.allowedTypes.includes(entity.entityType)) return false;
    if (this.storage.allowedCategories.length && !this.storage.allowedCategories.includes(entity.category)) return false;
    if (this.storage.allowedSizes.length && !this.storage.allowedSizes.includes(entityInventorySize(entity))) return false;
    if (this.storage.storedEntityIds.includes(entity.id)) return true;
    if (this.storage.maxSlots > 0 && this.getAvailableSlots(inventory) < this.getSlotCostFor(entity)) return false;
    const entityWeight = entity.physical ? entity.weight * entity.quantity : 0;
    if (this.storage.maxWeight > 0 && this.getAvailableWeight(inventory) < entityWeight) return false;
    return true;
  }

  store(entity, locationKind = storageLocationKind(this.storage?.storageType), inventory = null) {
    if (!this.canStore(entity, inventory)) return false;
    if (!this.storage.storedEntityIds.includes(entity.id)) this.storage.storedEntityIds.push(entity.id);
    this.storage.usedSlots += this.getSlotCostFor(entity);
    entity.location = normalizeLocation({
      kind: locationKind,
      containerId: this.id,
      label: this.name,
    });
    this.updatedAt = new Date().toISOString();
    entity.updatedAt = this.updatedAt;
    return true;
  }

  removeStored(entity) {
    if (!this.storage || !entity) return false;
    const before = this.storage.storedEntityIds.length;
    this.storage.storedEntityIds = this.storage.storedEntityIds.filter((id) => id !== entity.id);
    if (before === this.storage.storedEntityIds.length) return false;
    this.storage.usedSlots = Math.max(0, this.storage.usedSlots - this.getSlotCostFor(entity));
    if (entity.location.containerId === this.id) entity.location = normalizeLocation();
    this.updatedAt = new Date().toISOString();
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      definitionId: this.definitionId,
      entityType: this.entityType,
      name: this.name,
      category: this.category,
      physical: this.physical,
      weight: this.weight,
      quantity: this.quantity,
      baseCost: this.baseCost,
      location: { ...this.location },
      rachaduras: this.rachaduras.toJSON(),
      resources: this.resources.map((resource) => resource.toJSON()),
      effects: this.effects.map((effect) => effect.toJSON()),
      installedModIds: [...this.installedModIds],
      storage: this.storage ? clone(this.storage) : null,
      metadata: clone(this.metadata),
      sourceReference: { ...this.sourceReference },
      definitionSnapshot: clone(this.definitionSnapshot),
      customData: clone(this.customData),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data = {}) {
    return new EntityInstance(data);
  }
}

export class Inventory {
  constructor(entities = []) {
    this.entities = [];
    arrayOf(entities).forEach((entity) => this.add(entity));
  }

  add(entity) {
    const instance = coerceInstance(entity);
    if (this.findById(instance.id)) throw new Error(`Entidade duplicada no inventário: ${instance.id}`);
    this.entities.push(instance);
    return instance;
  }

  remove(entityId) {
    const entity = this.findById(entityId);
    if (!entity) return null;
    this.entities = this.entities.filter((entry) => entry.id !== entityId);
    this.getStorageEntities().forEach((storage) => storage.removeStored(entity));
    return entity;
  }

  findById(entityId) {
    return this.entities.find((entity) => entity.id === entityId) || null;
  }

  getAll() {
    return [...this.entities];
  }

  getByType(type) {
    return this.entities.filter((entity) => entity.entityType === type);
  }

  getByLocationKind(kind) {
    return this.entities.filter((entity) => entity.location.kind === kind);
  }

  getEquipped() {
    return this.getByLocationKind(LOCATION_KINDS.EQUIPPED);
  }

  getActive() {
    return this.getByLocationKind(LOCATION_KINDS.ACTIVE);
  }

  getUnassigned() {
    return this.getByLocationKind(LOCATION_KINDS.UNASSIGNED);
  }

  getStoredIn(containerId) {
    return this.entities.filter((entity) => entity.location.containerId === containerId);
  }

  getStorageEntities() {
    return this.entities.filter((entity) => entity.isStorage());
  }

  getTotalWeight({ carriedOnly = true } = {}) {
    return this.entities.reduce((total, entity) => {
      if (!entity.physical) return total;
      if (carriedOnly && [
        LOCATION_KINDS.EQUIPPED,
        LOCATION_KINDS.CUBE,
        LOCATION_KINDS.BASE,
        LOCATION_KINDS.VEHICLE,
      ].includes(entity.location.kind)) return total;
      return total + entity.weight * entity.quantity;
    }, 0);
  }

  validateStorage() {
    const errors = [];
    const warnings = [];
    this.entities.forEach((entity) => {
      if (entity.physical && entity.location.kind === LOCATION_KINDS.UNASSIGNED) {
        warnings.push({ code: "unassigned", entityId: entity.id, message: `${entity.name} está sem local definido.` });
      }
      if (!entity.location.containerId) return;
      const storage = this.findById(entity.location.containerId);
      if (!storage?.isStorage()) {
        errors.push({ code: "missing-storage", entityId: entity.id, message: `Armazenador de ${entity.name} não foi encontrado.` });
        return;
      }
      if (!storage.canStore(entity, this)) {
        errors.push({ code: "incompatible-storage", entityId: entity.id, storageId: storage.id, message: `${entity.name} não é compatível com ${storage.name}.` });
      }
    });
    this.getStorageEntities().forEach((storage) => {
      const actualIds = this.getStoredIn(storage.id).map((entity) => entity.id);
      storage.storage.storedEntityIds = uniqueStrings([...storage.storage.storedEntityIds, ...actualIds])
        .filter((id) => Boolean(this.findById(id)));
      const used = storage.storage.storedEntityIds.reduce((sum, id) => {
        const entity = this.findById(id);
        return sum + (entity ? storage.getSlotCostFor(entity) : 0);
      }, 0);
      storage.storage.usedSlots = used;
      if (storage.storage.maxSlots > 0 && used > storage.storage.maxSlots) {
        errors.push({ code: "storage-overflow", storageId: storage.id, message: `${storage.name} excedeu ${storage.storage.maxSlots} espaços.` });
      }
      const storedWeight = storage.getStoredWeight(this);
      if (storage.storage.maxWeight > 0 && storedWeight > storage.storage.maxWeight) {
        errors.push({
          code: "storage-overweight",
          storageId: storage.id,
          message: `${storage.name} excedeu ${storage.storage.maxWeight} kg.`,
        });
      }
    });
    return { valid: errors.length === 0, errors, warnings };
  }

  toJSON() {
    return this.entities.map((entity) => entity.toJSON());
  }

  static fromJSON(data = []) {
    return new Inventory(arrayOf(data).map((entity) => EntityInstance.fromJSON(entity)));
  }
}

export class Loadout {
  constructor({
    mainWeapon = "",
    secondaryWeapon = "",
    armor = "",
    activeItems = [],
    hooks = [],
    holsters = [],
    bandoliers = [],
  } = {}) {
    this.mainWeapon = String(mainWeapon || "");
    this.secondaryWeapon = String(secondaryWeapon || "");
    this.armor = String(armor || "");
    this.activeItems = uniqueStrings(activeItems);
    this.hooks = uniqueStrings(hooks);
    this.holsters = uniqueStrings(holsters);
    this.bandoliers = uniqueStrings(bandoliers);
  }

  clearEntityReferences(entityId) {
    if (this.mainWeapon === entityId) this.mainWeapon = "";
    if (this.secondaryWeapon === entityId) this.secondaryWeapon = "";
    if (this.armor === entityId) this.armor = "";
    ["activeItems", "hooks", "holsters", "bandoliers"].forEach((key) => {
      this[key] = this[key].filter((id) => id !== entityId);
    });
  }

  toJSON() {
    return {
      mainWeapon: this.mainWeapon,
      secondaryWeapon: this.secondaryWeapon,
      armor: this.armor,
      activeItems: [...this.activeItems],
      hooks: [...this.hooks],
      holsters: [...this.holsters],
      bandoliers: [...this.bandoliers],
    };
  }

  static fromJSON(data = {}) {
    return new Loadout(data);
  }
}

export class Character {
  constructor({
    id = createId("character"),
    name = "",
    race = "",
    level = 1,
    bodyWeight = 70,
    luzentis = 0,
    attributes = {},
    baseDerivedStats = {},
    currentPV = 0,
    currentCosmos = 0,
    stress = 0,
    inventory = [],
    loadout = {},
    knownSpells = [],
    installedChips = [],
    permanentEffects = [],
    temporaryEffects = [],
    conditions = [],
    rollHistory = [],
    metadata = {},
  } = {}) {
    this.id = String(id || createId("character"));
    this.name = String(name || "");
    this.race = String(race || "");
    this.level = Math.max(1, positiveInteger(level, 1));
    this.bodyWeight = Math.max(1, numeric(bodyWeight, 70));
    this.luzentis = Math.max(0, numeric(luzentis, 0));
    this.attributes = { ...clone(attributes || {}) };
    this.baseDerivedStats = { ...clone(baseDerivedStats || {}) };
    this.currentPV = Math.max(0, numeric(currentPV, 0));
    this.currentCosmos = Math.max(0, numeric(currentCosmos, 0));
    this.stress = Math.max(0, numeric(stress, 0));
    this.inventory = inventory instanceof Inventory ? inventory : Inventory.fromJSON(inventory);
    this.loadout = loadout instanceof Loadout ? loadout : Loadout.fromJSON(loadout);
    this.knownSpells = arrayOf(knownSpells).map((spell) => spell instanceof EntityInstance ? spell : EntityInstance.fromJSON(spell));
    this.installedChips = arrayOf(installedChips).map((entry) => ({ ...clone(entry) }));
    this.permanentEffects = arrayOf(permanentEffects).map(coerceEffect);
    this.temporaryEffects = arrayOf(temporaryEffects).map(coerceEffect);
    this.conditions = arrayOf(conditions).map(coerceCondition);
    this.rollHistory = clone(arrayOf(rollHistory));
    this.metadata = clone(metadata) || {};
    this.domainVersion = SOLARIS_DOMAIN_VERSION;
  }

  getAttributeMod(attribute) {
    return Math.floor((numeric(this.attributes?.[attribute], 10) - 10) / 2);
  }

  canAfford(price) {
    return this.luzentis >= Math.max(0, numeric(price, 0));
  }

  getBaseDerivedStat(key) {
    if (Object.hasOwn(this.baseDerivedStats, key)) return numeric(this.baseDerivedStats[key], 0);
    if (key === "currentPV") return this.currentPV;
    if (key === "currentCosmos") return this.currentCosmos;
    if (key === "stress") return this.stress;
    if (key === "level") return this.level;
    if (Object.hasOwn(this.attributes, key)) return numeric(this.attributes[key], 0);
    return 0;
  }

  getActiveEffects() {
    const equippedEffects = this.inventory.getEquipped().flatMap((entity) => entity.effects);
    const conditionEffects = this.conditions.filter((condition) => condition.active).flatMap((condition) => condition.effects);
    return [
      ...this.permanentEffects,
      ...this.temporaryEffects,
      ...conditionEffects,
      ...equippedEffects,
    ].filter((effect) => effect.enabled);
  }

  getDerivedStat(key) {
    return this.getActiveEffects()
      .filter((effect) => effect.key === key)
      .reduce((value, effect) => effect.apply(value), this.getBaseDerivedStat(key));
  }

  buyEntity(definition, options = {}) {
    const resolved = coerceDefinition(definition);
    if (!resolved.purchasable) throw new Error(`${resolved.name} não está disponível para compra.`);
    const requirementState = resolved.validateRequirements(this);
    if (!requirementState.valid) throw new Error(requirementState.messages.join(" "));
    const price = Math.max(0, numeric(options.price, resolved.price));
    if (!this.canAfford(price)) throw new Error("Luzentis insuficientes para comprar.");
    const entity = resolved.createInstance({
      ...options,
      baseCost: price,
      location: normalizeLocation(options.location),
    });
    this.luzentis -= price;
    this.inventory.add(entity);
    this.syncLoadoutFromLocation(entity);
    return entity;
  }

  sellEntity(instanceId, sellPrice = undefined) {
    const instance = this.inventory.findById(instanceId);
    if (!instance) throw new Error("Item não encontrado no inventário.");
    const price = sellPrice === undefined || sellPrice === null || sellPrice === ""
      ? Math.floor(instance.baseCost / 2)
      : Math.max(0, numeric(sellPrice, 0));
    this.removeEntity(instanceId, { force: true, deleteContents: false });
    this.luzentis += price;
    return { instance, sellPrice: price };
  }

  deleteEntityManually(instanceId, options = {}) {
    return this.removeEntity(instanceId, { ...options, manualDelete: true });
  }

  removeEntity(instanceId, options = {}) {
    const instance = this.inventory.findById(instanceId);
    if (!instance) return null;
    const validation = this.validateEntityCanBeDeleted(instance, options);
    if (!validation.valid) throw new Error(validation.message);
    const contents = this.inventory.getStoredIn(instance.id);
    // A removed container never leaves dangling physical locations behind.
    if (contents.length) {
      if (options.deleteContents) {
        contents.forEach((entity) => this.removeEntity(entity.id, { force: true, deleteContents: true }));
      } else {
        contents.forEach((entity) => this.moveEntityTo(entity.id, { kind: LOCATION_KINDS.UNASSIGNED }));
      }
    }
    this.clearEntityReferences(instance.id);
    return this.inventory.remove(instance.id);
  }

  validateEntityCanBeDeleted(instance, options = {}) {
    const equipped = instance.location.kind === LOCATION_KINDS.EQUIPPED;
    if (equipped && !options.force) {
      return { valid: false, message: "Desequipe o item antes de excluí-lo ou use force=true." };
    }
    const contents = instance.isStorage() ? this.inventory.getStoredIn(instance.id) : [];
    if (contents.length && !options.deleteContents && !options.force) {
      return { valid: false, message: "O armazenador contém itens. Esvazie-o, use deleteContents=true ou force=true." };
    }
    return { valid: true, message: "" };
  }

  moveEntityTo(instanceId, location) {
    const entity = this.inventory.findById(instanceId);
    if (!entity) throw new Error("Item não encontrado no inventário.");
    const nextLocation = normalizeLocation(location);
    this.inventory.getStorageEntities().forEach((storage) => storage.removeStored(entity));
    this.loadout.clearEntityReferences(entity.id);
    if (nextLocation.containerId) {
      const storage = this.inventory.findById(nextLocation.containerId);
      if (!storage?.isStorage()) throw new Error("Armazenador não encontrado.");
      if (!storage.store(entity, nextLocation.kind, this.inventory)) {
        throw new Error(`${storage.name} não pode armazenar ${entity.name}.`);
      }
    } else {
      entity.location = nextLocation;
    }
    this.syncLoadoutFromLocation(entity);
    return entity;
  }

  equipEntity(instanceId, slotId = "") {
    const entity = this.inventory.findById(instanceId);
    if (!entity) throw new Error("Item não encontrado no inventário.");
    let resolvedSlot = slotId;
    if (!resolvedSlot && entity.entityType === ENTITY_TYPES.WEAPON) resolvedSlot = "mainWeapon";
    if (!resolvedSlot && entity.entityType === ENTITY_TYPES.ARMOR) resolvedSlot = "armor";
    if (!resolvedSlot) resolvedSlot = "active";
    if (resolvedSlot === "mainWeapon") {
      const previous = this.inventory.findById(this.loadout.mainWeapon);
      if (previous && previous.id !== entity.id) previous.location = normalizeLocation();
      this.loadout.mainWeapon = entity.id;
    } else if (resolvedSlot === "secondaryWeapon") {
      const previous = this.inventory.findById(this.loadout.secondaryWeapon);
      if (previous && previous.id !== entity.id) previous.location = normalizeLocation();
      this.loadout.secondaryWeapon = entity.id;
    } else if (resolvedSlot === "armor") {
      const previous = this.inventory.findById(this.loadout.armor);
      if (previous && previous.id !== entity.id) previous.location = normalizeLocation();
      this.loadout.armor = entity.id;
    } else if (!this.loadout.activeItems.includes(entity.id)) {
      this.loadout.activeItems.push(entity.id);
    }
    this.inventory.getStorageEntities().forEach((storage) => storage.removeStored(entity));
    entity.location = normalizeLocation({ kind: LOCATION_KINDS.EQUIPPED, slotId: resolvedSlot });
    return entity;
  }

  unequipEntity(instanceId) {
    const entity = this.inventory.findById(instanceId);
    if (!entity) return null;
    this.loadout.clearEntityReferences(instanceId);
    entity.location = normalizeLocation();
    return entity;
  }

  setEntityActive(instanceId, activeSlotId = "") {
    const entity = this.moveEntityTo(instanceId, { kind: LOCATION_KINDS.ACTIVE, slotId: activeSlotId });
    if (!this.loadout.activeItems.includes(entity.id)) this.loadout.activeItems.push(entity.id);
    return entity;
  }

  clearEntityReferences(instanceId) {
    this.loadout.clearEntityReferences(instanceId);
    this.inventory.getStorageEntities().forEach((storage) => {
      const entity = this.inventory.findById(instanceId);
      if (entity) storage.removeStored(entity);
      storage.installedModIds = storage.installedModIds.filter((id) => id !== instanceId);
    });
    this.inventory.getAll().forEach((entity) => {
      entity.installedModIds = entity.installedModIds.filter((id) => id !== instanceId);
      if (entity.location.containerId === instanceId) entity.location = normalizeLocation();
    });
    this.installedChips = this.installedChips.filter((chip) => chip.chipId !== instanceId && chip.targetId !== instanceId);
  }

  syncLoadoutFromLocation(entity) {
    if (!entity) return;
    const { kind, slotId } = entity.location;
    if (kind === LOCATION_KINDS.EQUIPPED) {
      if (slotId === "armor" || entity.entityType === ENTITY_TYPES.ARMOR) this.loadout.armor = entity.id;
      else if (slotId === "secondaryWeapon") this.loadout.secondaryWeapon = entity.id;
      else if (entity.entityType === ENTITY_TYPES.WEAPON) this.loadout.mainWeapon = entity.id;
      else if (!this.loadout.activeItems.includes(entity.id)) this.loadout.activeItems.push(entity.id);
    }
    if (kind === LOCATION_KINDS.ACTIVE && !this.loadout.activeItems.includes(entity.id)) this.loadout.activeItems.push(entity.id);
    if (kind === LOCATION_KINDS.HOOK && !this.loadout.hooks.includes(entity.id)) this.loadout.hooks.push(entity.id);
    if (kind === LOCATION_KINDS.HOLSTER && !this.loadout.holsters.includes(entity.id)) this.loadout.holsters.push(entity.id);
    if (kind === LOCATION_KINDS.BANDOLIER && !this.loadout.bandoliers.includes(entity.id)) this.loadout.bandoliers.push(entity.id);
  }

  learnSpell(spellDefinitionOrInstance) {
    const spell = spellDefinitionOrInstance instanceof EntityDefinition
      ? spellDefinitionOrInstance.createInstance({ location: { kind: LOCATION_KINDS.ACTIVE } })
      : coerceInstance(spellDefinitionOrInstance);
    if (!this.knownSpells.some((known) => known.definitionId === spell.definitionId || known.id === spell.id)) {
      this.knownSpells.push(spell);
    }
    return spell;
  }

  installChip(chipId, targetId) {
    const chip = this.inventory.findById(chipId);
    const target = this.inventory.findById(targetId);
    if (!chip || chip.entityType !== ENTITY_TYPES.CHIP_MOD) throw new Error("Chip modificador não encontrado.");
    if (!target) throw new Error("Alvo do chip não encontrado.");
    if (!target.installedModIds.includes(chip.id)) target.installedModIds.push(chip.id);
    this.installedChips = this.installedChips.filter((entry) => entry.chipId !== chip.id);
    this.installedChips.push({ chipId: chip.id, targetId: target.id });
    chip.location = normalizeLocation({ kind: LOCATION_KINDS.EQUIPPED, containerId: target.id, slotId: "chip" });
    return chip;
  }

  uninstallChip(chipId) {
    const chip = this.inventory.findById(chipId);
    this.inventory.getAll().forEach((entity) => {
      entity.installedModIds = entity.installedModIds.filter((id) => id !== chipId);
    });
    this.installedChips = this.installedChips.filter((entry) => entry.chipId !== chipId);
    if (chip) chip.location = normalizeLocation();
    return chip;
  }

  addTemporaryEffect(effect) {
    const resolved = coerceEffect(effect);
    this.temporaryEffects.push(resolved);
    return resolved;
  }

  addCondition(condition) {
    const resolved = coerceCondition(condition);
    this.conditions.push(resolved);
    return resolved;
  }

  validateInventory() {
    const storage = this.inventory.validateStorage();
    const danglingLoadoutIds = [
      this.loadout.mainWeapon,
      this.loadout.secondaryWeapon,
      this.loadout.armor,
      ...this.loadout.activeItems,
      ...this.loadout.hooks,
      ...this.loadout.holsters,
      ...this.loadout.bandoliers,
    ].filter((id) => id && !this.inventory.findById(id));
    const errors = [...storage.errors];
    danglingLoadoutIds.forEach((id) => {
      errors.push({ code: "dangling-loadout", entityId: id, message: `Referência inválida no loadout: ${id}.` });
    });
    return { valid: errors.length === 0, errors, warnings: storage.warnings };
  }

  toJSON() {
    return {
      domainVersion: SOLARIS_DOMAIN_VERSION,
      id: this.id,
      name: this.name,
      race: this.race,
      level: this.level,
      bodyWeight: this.bodyWeight,
      luzentis: this.luzentis,
      attributes: clone(this.attributes),
      baseDerivedStats: clone(this.baseDerivedStats),
      currentPV: this.currentPV,
      currentCosmos: this.currentCosmos,
      stress: this.stress,
      inventory: this.inventory.toJSON(),
      loadout: this.loadout.toJSON(),
      knownSpells: this.knownSpells.map((spell) => spell.toJSON()),
      installedChips: clone(this.installedChips),
      permanentEffects: this.permanentEffects.map((effect) => effect.toJSON()),
      temporaryEffects: this.temporaryEffects.map((effect) => effect.toJSON()),
      conditions: this.conditions.map((condition) => condition.toJSON()),
      rollHistory: clone(this.rollHistory),
      metadata: clone(this.metadata),
    };
  }

  static fromJSON(data = {}) {
    return new Character(data);
  }
}

export class MonsterDefinition {
  constructor({
    id = createId("monster-definition"),
    name = "",
    tier = "",
    rank = "",
    type = "",
    description = "",
    image = "",
    attributes = {},
    maxPV = 1,
    ca = 0,
    movement = "",
    maxCosmos = 0,
    maxStress = 0,
    attacks = [],
    abilities = [],
    rachadurasMax = 0,
    quickRolls = [],
    metadata = {},
    sourceReference = {},
  } = {}) {
    this.id = String(id || createId("monster-definition"));
    this.name = String(name || "Monstro sem nome");
    this.tier = String(tier || rank || "");
    this.rank = String(rank || tier || "");
    this.type = String(type || "");
    this.description = String(description || "");
    this.image = String(image || "");
    this.attributes = clone(attributes) || {};
    this.maxPV = Math.max(1, numeric(maxPV, 1));
    this.ca = Math.max(0, numeric(ca, 0));
    this.movement = String(movement || "");
    this.maxCosmos = Math.max(0, numeric(maxCosmos, 0));
    this.maxStress = Math.max(0, numeric(maxStress, 0));
    this.attacks = clone(arrayOf(attacks));
    this.abilities = clone(arrayOf(abilities));
    this.rachadurasMax = Math.max(0, positiveInteger(rachadurasMax, 0));
    this.quickRolls = clone(arrayOf(quickRolls));
    this.metadata = clone(metadata) || {};
    this.sourceReference = normalizeSourceReference(sourceReference);
  }

  createInstance(options = {}) {
    return new MonsterInstance({
      id: options.id,
      definitionId: this.id,
      name: options.name || this.name,
      tier: this.tier,
      rank: this.rank,
      type: this.type,
      description: this.description,
      image: options.image || this.image,
      attributes: this.attributes,
      currentPV: options.currentPV ?? this.maxPV,
      maxPV: options.maxPV ?? this.maxPV,
      ca: options.ca ?? this.ca,
      movement: options.movement || this.movement,
      currentCosmos: options.currentCosmos ?? this.maxCosmos,
      maxCosmos: options.maxCosmos ?? this.maxCosmos,
      stress: options.stress ?? 0,
      maxStress: options.maxStress ?? this.maxStress,
      attacks: this.attacks,
      abilities: this.abilities,
      rachaduras: options.rachaduras || { current: 0, max: this.rachadurasMax || 1 },
      quickRolls: this.quickRolls,
      metadata: { ...this.metadata, ...(options.metadata || {}) },
      sourceReference: mergeSourceReference(this.sourceReference, options.sourceReference),
      notes: options.notes,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tier: this.tier,
      rank: this.rank,
      type: this.type,
      description: this.description,
      image: this.image,
      attributes: clone(this.attributes),
      maxPV: this.maxPV,
      ca: this.ca,
      movement: this.movement,
      maxCosmos: this.maxCosmos,
      maxStress: this.maxStress,
      attacks: clone(this.attacks),
      abilities: clone(this.abilities),
      rachadurasMax: this.rachadurasMax,
      quickRolls: clone(this.quickRolls),
      metadata: clone(this.metadata),
      sourceReference: { ...this.sourceReference },
    };
  }

  static fromJSON(data = {}) {
    return new MonsterDefinition(data);
  }
}

export class MonsterInstance {
  constructor({
    id = createId("monster"),
    definitionId = "",
    name = "",
    tier = "",
    rank = "",
    type = "",
    description = "",
    image = "",
    attributes = {},
    currentPV = 1,
    maxPV = 1,
    ca = 0,
    movement = "",
    currentCosmos = 0,
    maxCosmos = 0,
    stress = 0,
    maxStress = 0,
    attacks = [],
    abilities = [],
    conditions = [],
    rachaduras = {},
    notes = "",
    quickRolls = [],
    rollHistory = [],
    lootTable = [],
    lootHistory = [],
    lootGeneratedForDefeat = false,
    defeatedAt = null,
    metadata = {},
    sourceReference = {},
    createdAt = new Date().toISOString(),
    updatedAt = null,
  } = {}) {
    this.id = String(id || createId("monster"));
    this.definitionId = String(definitionId || "");
    this.name = String(name || "Monstro sem nome");
    this.tier = String(tier || rank || "");
    this.rank = String(rank || tier || "");
    this.type = String(type || "");
    this.description = String(description || "");
    this.image = String(image || "");
    this.attributes = clone(attributes) || {};
    this.maxPV = Math.max(1, numeric(maxPV, 1));
    this.currentPV = clampNumber(currentPV, 0, this.maxPV);
    this.ca = Math.max(0, numeric(ca, 0));
    this.movement = String(movement || "");
    this.maxCosmos = Math.max(0, numeric(maxCosmos, 0));
    this.currentCosmos = clampNumber(currentCosmos, 0, this.maxCosmos);
    this.maxStress = Math.max(0, numeric(maxStress, 0));
    this.stress = clampNumber(stress, 0, this.maxStress || Number.POSITIVE_INFINITY);
    this.attacks = clone(arrayOf(attacks));
    this.abilities = clone(arrayOf(abilities));
    this.conditions = arrayOf(conditions).map(coerceCondition);
    this.rachaduras = coerceRachaduras(rachaduras);
    this.notes = String(notes || "");
    this.quickRolls = clone(arrayOf(quickRolls));
    this.rollHistory = clone(arrayOf(rollHistory));
    this.metadata = clone(metadata) || {};
    this.lootTable = arrayOf(lootTable).length
      ? clone(lootTable)
      : buildMonsterLootTable(this.metadata.resources);
    this.lootHistory = clone(arrayOf(lootHistory));
    this.lootGeneratedForDefeat = Boolean(lootGeneratedForDefeat);
    this.defeatedAt = defeatedAt || null;
    this.sourceReference = normalizeSourceReference(sourceReference);
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt;
  }

  receiveDamage(amount = 0, options = {}) {
    const previousPV = this.currentPV;
    this.currentPV = Math.max(0, this.currentPV - Math.max(0, numeric(amount, 0)));
    this.updatedAt = new Date().toISOString();
    if (previousPV > 0 && this.currentPV === 0) {
      this.markDefeated({
        resources: options.resources ?? this.metadata.resources,
        random: options.random,
      });
    }
    return this.currentPV;
  }

  heal(amount = 0) {
    const wasDefeated = this.currentPV === 0;
    this.currentPV = Math.min(this.maxPV, this.currentPV + Math.max(0, numeric(amount, 0)));
    if (wasDefeated && this.currentPV > 0) {
      this.defeatedAt = null;
      this.lootGeneratedForDefeat = false;
    }
    this.updatedAt = new Date().toISOString();
    return this.currentPV;
  }

  setLootTable(resources = this.metadata.resources) {
    this.lootTable = buildMonsterLootTable(resources);
    this.updatedAt = new Date().toISOString();
    return this.lootTable;
  }

  generateLoot({ resources = this.metadata.resources, random = Math.random, reason = "manual" } = {}) {
    if (!this.lootTable.length && resources) this.setLootTable(resources);
    const result = rollMonsterLoot(this.lootTable, random, { reason });
    this.lootHistory.unshift(result);
    this.lootHistory = this.lootHistory.slice(0, 10);
    this.updatedAt = new Date().toISOString();
    return result;
  }

  markDefeated({ resources = this.metadata.resources, random = Math.random } = {}) {
    this.currentPV = 0;
    this.defeatedAt = this.defeatedAt || new Date().toISOString();
    if (this.lootGeneratedForDefeat) return null;
    this.lootGeneratedForDefeat = true;
    return this.generateLoot({ resources, random, reason: "derrota" });
  }

  applyCondition(condition) {
    const resolved = coerceCondition(condition);
    this.conditions.push(resolved);
    this.updatedAt = new Date().toISOString();
    return resolved;
  }

  removeCondition(conditionId) {
    this.conditions = this.conditions.filter((condition) => condition.id !== conditionId);
    this.updatedAt = new Date().toISOString();
  }

  recordRoll(roll = {}) {
    this.rollHistory.unshift({ ...clone(roll), createdAt: roll.createdAt || new Date().toISOString() });
    this.rollHistory = this.rollHistory.slice(0, 50);
    this.updatedAt = new Date().toISOString();
    return this.rollHistory[0];
  }

  toJSON() {
    return {
      id: this.id,
      definitionId: this.definitionId,
      name: this.name,
      tier: this.tier,
      rank: this.rank,
      type: this.type,
      description: this.description,
      image: this.image,
      attributes: clone(this.attributes),
      currentPV: this.currentPV,
      maxPV: this.maxPV,
      ca: this.ca,
      movement: this.movement,
      currentCosmos: this.currentCosmos,
      maxCosmos: this.maxCosmos,
      stress: this.stress,
      maxStress: this.maxStress,
      attacks: clone(this.attacks),
      abilities: clone(this.abilities),
      conditions: this.conditions.map((condition) => condition.toJSON()),
      rachaduras: this.rachaduras.toJSON(),
      notes: this.notes,
      quickRolls: clone(this.quickRolls),
      rollHistory: clone(this.rollHistory),
      lootTable: clone(this.lootTable),
      lootHistory: clone(this.lootHistory),
      lootGeneratedForDefeat: this.lootGeneratedForDefeat,
      defeatedAt: this.defeatedAt,
      metadata: clone(this.metadata),
      sourceReference: { ...this.sourceReference },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data = {}) {
    return new MonsterInstance(data);
  }
}

export class MonsterSheet {
  constructor({ definition = {}, instance = null, gmNotes = "" } = {}) {
    this.definition = definition instanceof MonsterDefinition
      ? definition
      : MonsterDefinition.fromJSON(definition);
    this.instance = instance
      ? (instance instanceof MonsterInstance ? instance : MonsterInstance.fromJSON(instance))
      : this.definition.createInstance();
    this.gmNotes = String(gmNotes || this.instance.notes || "");
    this.schemaVersion = 1;
  }

  toJSON() {
    return {
      schemaVersion: this.schemaVersion,
      definition: this.definition.toJSON(),
      instance: this.instance.toJSON(),
      gmNotes: this.gmNotes,
    };
  }

  static fromJSON(data = {}) {
    return new MonsterSheet(data);
  }
}

export class StorageService {
  static saveCharacter(character, key = "solaris.character.domain.v1") {
    if (!globalThis.localStorage) throw new Error("localStorage não está disponível.");
    const resolved = character instanceof Character ? character : Character.fromJSON(character);
    globalThis.localStorage.setItem(key, JSON.stringify(resolved.toJSON()));
    return resolved;
  }

  static loadCharacter(key = "solaris.character.domain.v1") {
    if (!globalThis.localStorage) throw new Error("localStorage não está disponível.");
    const raw = globalThis.localStorage.getItem(key);
    return raw ? Character.fromJSON(JSON.parse(raw)) : null;
  }

  static exportCharacter(character) {
    const resolved = character instanceof Character ? character : Character.fromJSON(character);
    return JSON.stringify(resolved.toJSON(), null, 2);
  }

  static importCharacter(jsonText) {
    return Character.fromJSON(JSON.parse(jsonText));
  }
}

export function buyDefinitionForCharacter(character, definition, options = {}) {
  const resolved = character instanceof Character ? character : Character.fromJSON(character);
  const entity = resolved.buyEntity(definition, options);
  if (options.autoSave) StorageService.saveCharacter(resolved, options.storageKey);
  return { character: resolved, entity };
}

export function sellCharacterEntity(character, instanceId, options = {}) {
  const resolved = character instanceof Character ? character : Character.fromJSON(character);
  const result = resolved.sellEntity(instanceId, options.sellPrice);
  if (options.autoSave) StorageService.saveCharacter(resolved, options.storageKey);
  return { character: resolved, ...result };
}

export function deleteCharacterEntity(character, instanceId, options = {}) {
  const resolved = character instanceof Character ? character : Character.fromJSON(character);
  const entity = resolved.deleteEntityManually(instanceId, options);
  if (options.autoSave) StorageService.saveCharacter(resolved, options.storageKey);
  return { character: resolved, entity };
}

export function moveCharacterEntity(character, instanceId, location, options = {}) {
  const resolved = character instanceof Character ? character : Character.fromJSON(character);
  const entity = resolved.moveEntityTo(instanceId, location);
  if (options.autoSave) StorageService.saveCharacter(resolved, options.storageKey);
  return { character: resolved, entity };
}

export function parseLegacyWeight(value) {
  const match = String(value || "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Math.max(0, numeric(match[0], 0)) : 0;
}

export function inferLegacyInventorySize(item = {}) {
  const official = item.officialData || {};
  const explicit = normalizeInventorySize(
    item.inventorySize
      || item.size
      || item.porte
      || official.Tamanho
      || official.Porte
  );
  if (explicit) return explicit;

  const text = [
    item.name,
    item.category,
    item.type,
    item.kind,
    item.summary,
    ...arrayOf(item.tags),
  ].filter(Boolean).join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (item.category === "weapon") {
    if (/pistola|revolver|adaga|faca|punhal|manopla|soqueira/.test(text)) return INVENTORY_SIZES.SMALL;
    if (/rifle|fuzil|carabina|sniper|lancador|bazuca|canhao|alabarda|tridente|arco|besta/.test(text)) {
      return INVENTORY_SIZES.LARGE;
    }
    return INVENTORY_SIZES.MEDIUM;
  }

  if (item.category === "cube") return INVENTORY_SIZES.SMALL;
  const weight = parseLegacyWeight(item.weight);
  if (weight <= 2) return INVENTORY_SIZES.SMALL;
  if (weight <= 10) return INVENTORY_SIZES.MEDIUM;
  return INVENTORY_SIZES.LARGE;
}

function legacyStorageCapacity(item = {}) {
  const explicit = numeric(item.maxSlots ?? item.cubeSupport, NaN);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const official = item.officialData || {};
  const capacityText = [
    official["Capacidade sugerida"],
    official["Capacidade"],
    official["Função/Efeito"],
    item.summary,
  ].filter(Boolean).join(" ");
  const match = capacityText.replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(?:cubos?|kg|espaços?|itens?)/i);
  return match ? Math.max(1, numeric(match[1], 5)) : 5;
}

export function definitionFromLegacyItem(item = {}) {
  const text = [
    item.name,
    item.category,
    item.type,
    item.summary,
    ...arrayOf(item.tags),
  ].filter(Boolean).join(" ").toLowerCase();
  const sourceReference = {
    book: item.source?.startsWith?.("Livro") ? item.source : "",
    chapter: "",
    page: "",
    origin: item.source || item.sourceRow ? "Biblioteca Solaris" : "Conteúdo customizado",
    notes: item.sourceRow ? `Linha ${item.sourceRow}` : "",
  };
  const common = {
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.summary || item.description || "",
    weight: parseLegacyWeight(item.weight),
    price: Number.isFinite(item.price) ? item.price : 0,
    purchasable: Number.isFinite(item.price),
    tags: item.tags,
    metadata: { ...clone(item), inventorySize: inferLegacyInventorySize(item) },
    sourceReference,
  };
  if (item.category === "weapon") {
    return new WeaponDefinition({
      ...common,
      damage: item.damage,
      range: item.range || "",
      modSlots: item.mods,
      slotTypes: ["mainWeapon", "secondaryWeapon"],
    });
  }
  if (item.category === "armor") {
    return new ArmorDefinition({
      ...common,
      ca: item.ca,
      modSlots: item.mods,
      slotTypes: ["armor"],
    });
  }
  if (item.category === "cube") {
    return new CubeDefinition({
      ...common,
      cubeKind: item.cubeKind,
      maxSlots: item.cubeCapacity || 1,
      allowedTypes: [ENTITY_TYPES.ITEM],
      quickAccess: false,
    });
  }
  if (/coldre/.test(text)) {
    return new HolsterDefinition({ ...common, maxSlots: item.maxSlots || 1 });
  }
  if (/bandoleira/.test(text)) {
    return new BandolierDefinition({ ...common, maxSlots: item.maxSlots || 1 });
  }
  if (/gancho/.test(text)) {
    return new HookDefinition({ ...common, maxSlots: item.maxSlots || 1 });
  }
  if (/mochila/.test(text)) {
    return new StorageDefinition({
      ...common,
      storageType: STORAGE_TYPES.CONTAINER,
      maxSlots: 0,
      maxWeight: Math.max(0.1, numeric(item.maxWeight, 10)),
      allowedTypes: [ENTITY_TYPES.ITEM, ENTITY_TYPES.WEAPON, ENTITY_TYPES.CUBE],
      allowedSizes: [INVENTORY_SIZES.SMALL],
      quickAccess: false,
    });
  }
  if (
    /armazenamento|recipiente|bolsa|maleta|pote|frasco|caixa|cesta|cesto|barril|balde|saco|estojo/.test(text)
  ) {
    return new StorageDefinition({
      ...common,
      storageType: STORAGE_TYPES.CONTAINER,
      maxSlots: legacyStorageCapacity(item),
      allowedTypes: [ENTITY_TYPES.ITEM, ENTITY_TYPES.WEAPON, ENTITY_TYPES.CUBE],
      quickAccess: false,
    });
  }
  if (item.category === "chip-mod" || item.category === "chip") {
    return new ChipModDefinition(common);
  }
  if (item.category === "cosmos" || item.category === "cosmic-spell") {
    return new CosmicSpellDefinition({ ...common, cosmosCost: item.cost });
  }
  if (item.category === "drone") return new EntityDefinition({ ...common, entityType: ENTITY_TYPES.DRONE });
  if (item.category === "robot") return new EntityDefinition({ ...common, entityType: ENTITY_TYPES.ROBOT });
  if (item.category === "vehicle") return new EntityDefinition({ ...common, entityType: ENTITY_TYPES.VEHICLE });
  return new ItemDefinition(common);
}

export function migrateLegacyCharacterData(legacyCharacter = {}, definitionResolver = () => null) {
  if (legacyCharacter.domainCharacter?.domainVersion === SOLARIS_DOMAIN_VERSION) {
    const existing = Character.fromJSON(legacyCharacter.domainCharacter);
    existing.name = legacyCharacter.name ?? existing.name;
    existing.race = legacyCharacter.race ?? existing.race;
    existing.level = legacyCharacter.level ?? existing.level;
    existing.bodyWeight = legacyCharacter.bodyWeightKg ?? existing.bodyWeight;
    existing.luzentis = legacyCharacter.currency ?? existing.luzentis;
    existing.attributes = { ...existing.attributes, ...(legacyCharacter.attributes || {}) };
    existing.currentPV = legacyCharacter.pvCurrent ?? existing.currentPV;
    existing.currentCosmos = legacyCharacter.cosmosCurrent ?? existing.currentCosmos;
    existing.stress = legacyCharacter.stress ?? existing.stress;
    existing.rollHistory = clone(legacyCharacter.diceLog || existing.rollHistory);
    return existing;
  }

  const inventory = new Inventory();
  // Keep the legacy shape as a compatibility envelope while restoring richer instance state.
  arrayOf(legacyCharacter.inventory).forEach((entry) => {
    const { domainEntity: _domainEntity, ...legacyEntry } = entry;
    const legacyItem = definitionResolver(entry.itemId, entry) || {
      id: entry.itemId,
      name: entry.name || entry.itemId || "Item legado",
      category: entry.category || ENTITY_TYPES.ITEM,
      price: entry.price || 0,
      weight: entry.weight || 0,
    };
    let location = normalizeLocation(entry.location);
    if (entry.uid === legacyCharacter.equippedWeaponUid) location = normalizeLocation({ kind: LOCATION_KINDS.EQUIPPED, slotId: "mainWeapon" });
    else if (entry.uid === legacyCharacter.equippedArmorUid) location = normalizeLocation({ kind: LOCATION_KINDS.EQUIPPED, slotId: "armor" });
    else if (entry.cubeUid) location = normalizeLocation({ kind: LOCATION_KINDS.CUBE, containerId: entry.cubeUid });
    else if (entry.supportSlot === "gancho") location = normalizeLocation({ kind: LOCATION_KINDS.HOOK });
    else if (entry.supportSlot === "coldre") location = normalizeLocation({ kind: LOCATION_KINDS.HOLSTER });
    else if (entry.supportSlot === "bandoleira") location = normalizeLocation({ kind: LOCATION_KINDS.BANDOLIER });
    else if (entry.inCube) location = normalizeLocation({ kind: LOCATION_KINDS.CUBE, containerId: "legacy-cube" });
    const definition = definitionFromLegacyItem(legacyItem);
    const instance = entry.domainEntity
      ? EntityInstance.fromJSON({
        ...entry.domainEntity,
        id: entry.uid || entry.domainEntity.id,
        definitionId: entry.itemId || entry.domainEntity.definitionId,
        location,
        customData: {
          ...(entry.domainEntity.customData || {}),
          legacyEntry: clone(legacyEntry),
        },
      })
      : definition.createInstance({
        id: entry.uid || createId("legacy"),
        location,
        rachaduras: { current: entry.crackLevel || 0, max: entry.crackMax || 5 },
        storage: definition instanceof StorageDefinition ? {
          maxSlots: entry.cubeCapacity || definition.maxSlots,
          storedEntityIds: [],
        } : undefined,
        customData: { legacyEntry: clone(legacyEntry) },
      });
    inventory.add(instance);
  });

  const character = new Character({
    id: legacyCharacter.id,
    name: legacyCharacter.name,
    race: legacyCharacter.race,
    level: legacyCharacter.level,
    bodyWeight: legacyCharacter.bodyWeightKg,
    luzentis: legacyCharacter.currency,
    attributes: legacyCharacter.attributes,
    currentPV: legacyCharacter.pvCurrent,
    currentCosmos: legacyCharacter.cosmosCurrent,
    stress: legacyCharacter.stress,
    inventory,
    rollHistory: legacyCharacter.diceLog,
    metadata: { migratedFromLegacy: true },
  });
  inventory.getAll().forEach((entity) => {
    if (entity.location.containerId && entity.location.containerId !== "legacy-cube") {
      const storage = inventory.findById(entity.location.containerId);
      if (storage?.isStorage() && !storage.storage.storedEntityIds.includes(entity.id)) {
        storage.storage.storedEntityIds.push(entity.id);
      }
    }
    character.syncLoadoutFromLocation(entity);
  });
  character.validateInventory();
  return character;
}

DEFINITION_CLASS_BY_TYPE.set("EntityDefinition", EntityDefinition);
DEFINITION_CLASS_BY_TYPE.set("ItemDefinition", ItemDefinition);
DEFINITION_CLASS_BY_TYPE.set("EquipmentDefinition", EquipmentDefinition);
DEFINITION_CLASS_BY_TYPE.set("WeaponDefinition", WeaponDefinition);
DEFINITION_CLASS_BY_TYPE.set("ArmorDefinition", ArmorDefinition);
DEFINITION_CLASS_BY_TYPE.set("StorageDefinition", StorageDefinition);
DEFINITION_CLASS_BY_TYPE.set("CubeDefinition", CubeDefinition);
DEFINITION_CLASS_BY_TYPE.set("HolsterDefinition", HolsterDefinition);
DEFINITION_CLASS_BY_TYPE.set("BandolierDefinition", BandolierDefinition);
DEFINITION_CLASS_BY_TYPE.set("HookDefinition", HookDefinition);
DEFINITION_CLASS_BY_TYPE.set("ChipModDefinition", ChipModDefinition);
DEFINITION_CLASS_BY_TYPE.set("CosmicSpellDefinition", CosmicSpellDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.ITEM, ItemDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.WEAPON, WeaponDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.ARMOR, ArmorDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.CUBE, CubeDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.HOLSTER, HolsterDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.BANDOLIER, BandolierDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.HOOK, HookDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.CHIP_MOD, ChipModDefinition);
DEFINITION_CLASS_BY_TYPE.set(ENTITY_TYPES.COSMIC_SPELL, CosmicSpellDefinition);

export const SOLARIS_SAMPLE_DEFINITIONS = Object.freeze({
  kitCuraBasico: new ItemDefinition({
    id: "sample-kit-cura-basico",
    name: "Kit de Cura Básico",
    category: "cura",
    description: "Suprimentos básicos para primeiros socorros.",
    weight: 1,
    price: 500,
    sourceReference: { origin: "Exemplo da arquitetura Solaris" },
  }),
  pistolaLuz: new WeaponDefinition({
    id: "sample-pistola-luz",
    name: "Pistola de Luz",
    category: "pistola",
    description: "Arma leve de energia.",
    weight: 1.2,
    price: 1500,
    damage: "1d6",
    range: "Médio",
    modSlots: 1,
    resources: [{ key: "municao", label: "Munição", current: 6, max: 6, type: "ammo", recharge: "recarga" }],
  }),
  coleteReforcado: new ArmorDefinition({
    id: "sample-colete-reforcado",
    name: "Colete Reforçado",
    category: "armadura leve",
    weight: 5,
    price: 2200,
    ca: 2,
    modSlots: 1,
  }),
  cuboBasico: new CubeDefinition({
    id: "sample-cubo-basico",
    name: "Cubo Básico",
    category: "cubo",
    weight: 1,
    price: 800,
    maxSlots: 1,
    allowedTypes: [ENTITY_TYPES.ITEM],
  }),
  coldreLateral: new HolsterDefinition({
    id: "sample-coldre-lateral",
    name: "Coldre Lateral",
    category: "suporte",
    weight: 0.5,
    price: 600,
    maxSlots: 1,
  }),
  bandoleiraBasica: new BandolierDefinition({
    id: "sample-bandoleira-basica",
    name: "Bandoleira Básica",
    category: "suporte",
    weight: 0.8,
    price: 900,
    maxSlots: 1,
  }),
  ganchoCostas: new HookDefinition({
    id: "sample-gancho-costas",
    name: "Gancho de Costas",
    category: "suporte",
    weight: 0.6,
    price: 700,
    maxSlots: 1,
  }),
  chipReflexoF: new ChipModDefinition({
    id: "sample-chip-reflexo-f",
    name: "Chip de Reflexo F",
    category: "reflexo",
    weight: 0.1,
    price: 1200,
    effects: [{ key: "REF", operation: EFFECT_OPERATIONS.ADD, value: 1, label: "Reflexo aprimorado" }],
  }),
  laminaVermelha: new WeaponDefinition({
    id: "sample-lamina-vermelha",
    name: "Lâmina Vermelha",
    category: "espada cósmica",
    description: "Lâmina de energia de origem desconhecida.",
    weight: 2,
    price: 3200,
    damage: "1d8",
    modSlots: 2,
    sourceReference: { origin: "Exemplo da arquitetura Solaris" },
  }),
});
