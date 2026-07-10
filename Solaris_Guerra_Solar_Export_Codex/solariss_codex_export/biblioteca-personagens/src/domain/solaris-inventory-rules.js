export const SOLARIS_INVENTORY_LOCATION_TYPES = Object.freeze([
  "equipped",
  "armor",
  "hand",
  "hook",
  "holster",
  "bandolier",
  "cube",
  "backpack",
  "loose",
  "attached",
  "container",
  "unknown",
]);

const LOCATION_ALIASES = Object.freeze({
  active: "hand",
  armor: "armor",
  armadura: "armor",
  attached: "attached",
  acoplado: "attached",
  backpack: "backpack",
  mochila: "backpack",
  bandoleira: "bandolier",
  bandolier: "bandolier",
  coldre: "holster",
  container: "container",
  cubo: "cube",
  cube: "cube",
  equipado: "equipped",
  equipped: "equipped",
  gancho: "hook",
  hand: "hand",
  hook: "hook",
  holster: "holster",
  loose: "loose",
  mao: "hand",
  maos: "hand",
  recipiente: "container",
  solto: "loose",
  unassigned: "unknown",
  unknown: "unknown",
});

const SUPPORT_COLLECTIONS = Object.freeze({
  hook: "hooks",
  holster: "holsters",
  bandolier: "bandoliers",
});

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const arrayValue = (value) => (Array.isArray(value) ? value : []);
const textValue = (value, fallback = "") => (value === undefined || value === null ? fallback : String(value));
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function slug(value, fallback = "solaris") {
  return textValue(value, fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase() || fallback;
}

function ensureId(prefix, source = {}) {
  return textValue(firstValue(source.id, source.uid, source.itemId), "")
    || `${prefix}-${slug(firstValue(source.name, source.label, source.type, "sem-id"))}`;
}

function normalizeLocationType(type) {
  const normalized = textValue(type, "loose").trim();
  const alias = LOCATION_ALIASES[normalized] || LOCATION_ALIASES[normalized.toLowerCase()];
  return SOLARIS_INVENTORY_LOCATION_TYPES.includes(alias) ? alias : "unknown";
}

function itemMatchesId(item = {}, itemId) {
  const target = textValue(itemId);
  return [item.id, item.uid, item.itemId].some((value) => textValue(value) === target);
}

function dedupeItems(items = []) {
  const seen = new Set();
  return items.filter((item, index) => {
    const key = textValue(firstValue(item.id, item.uid, item.itemId), `index-${index}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function createInventoryLocation(type, id = null, metadata = {}) {
  return normalizeInventoryLocation({
    type,
    id,
    metadata,
  });
}

export function normalizeInventoryLocation(location = null) {
  if (!isObject(location)) {
    return {
      type: "loose",
      id: null,
      parentId: null,
      slot: null,
      index: null,
      metadata: {},
    };
  }
  const source = clone(location);
  const type = normalizeLocationType(firstValue(source.type, source.kind));
  return {
    ...source,
    type,
    id: firstValue(source.id, source.slotId, source.containerId, null),
    parentId: firstValue(source.parentId, source.parent, null),
    slot: firstValue(source.slot, source.slotId, null),
    index: source.index === undefined || source.index === null ? null : numberValue(source.index, null),
    metadata: isObject(source.metadata) ? clone(source.metadata) : {},
  };
}

function inferLocationFromItem(item = {}) {
  if (isObject(item.location)) return item.location;
  if (isObject(item.storage?.location)) return item.storage.location;
  if (isObject(item.equip?.location)) return item.equip.location;
  if (firstValue(item.cubeUid, item.storage?.cubeUid)) {
    return createInventoryLocation("cube", firstValue(item.cubeUid, item.storage?.cubeUid));
  }
  if (item.inCube || item.storage?.inCube) return createInventoryLocation("cube", firstValue(item.cubeUid, item.storage?.cubeUid, null));
  const supportSlot = textValue(firstValue(item.supportSlot, item.storage?.supportSlot), "").toLowerCase();
  if (supportSlot.includes("gancho")) return createInventoryLocation("hook", firstValue(item.supportId, null));
  if (supportSlot.includes("coldre")) return createInventoryLocation("holster", firstValue(item.supportId, null));
  if (supportSlot.includes("bandoleira")) return createInventoryLocation("bandolier", firstValue(item.supportId, null));
  if (item.equipped || item.equip?.equipped) return createInventoryLocation("equipped", firstValue(item.slot, item.slotId, item.equip?.slot, null));
  return createInventoryLocation("loose");
}

export function normalizeInventoryItem(item = {}) {
  const source = isObject(item) ? clone(item) : {};
  const location = normalizeInventoryLocation(inferLocationFromItem(source));
  const id = ensureId("item", source);
  return {
    ...source,
    id,
    name: textValue(firstValue(source.name, source.label, source.itemId), "Item Solaris"),
    location,
    storage: {
      ...(isObject(source.storage) ? clone(source.storage) : {}),
      location,
    },
    legacy: source.legacy === undefined ? source.legacy : clone(source.legacy),
  };
}

export function setItemLocation(item, location) {
  return normalizeInventoryItem({
    ...(isObject(item) ? clone(item) : {}),
    location: normalizeInventoryLocation(location),
  });
}

export function getItemLocation(item = {}) {
  return normalizeInventoryLocation(isObject(item?.location) ? item.location : inferLocationFromItem(item));
}

export function normalizeCube(cube = {}) {
  const source = isObject(cube) ? clone(cube) : {};
  const id = ensureId("cube", source);
  const contents = arrayValue(firstValue(source.contents, source.items, [])).map((entry) => setItemLocation(entry, createInventoryLocation("cube", id)));
  return {
    ...normalizeInventoryItem({
      ...source,
      id,
      type: firstValue(source.type, source.category, "cube"),
      location: normalizeInventoryLocation(firstValue(source.location, createInventoryLocation("loose"))),
    }),
    id,
    name: textValue(firstValue(source.name, source.label), "Cubo Solaris"),
    contents,
    capacity: source.capacity ?? source.maxUnits ?? source.units ?? null,
    warnings: arrayValue(source.warnings),
  };
}

function normalizeSupport(support = {}, supportType) {
  const source = isObject(support) ? clone(support) : {};
  const id = ensureId(supportType, source);
  const contents = arrayValue(firstValue(source.contents, source.items, [])).map((entry) => setItemLocation(entry, createInventoryLocation(supportType, id)));
  return {
    ...normalizeInventoryItem({
      ...source,
      id,
      location: normalizeInventoryLocation(firstValue(source.location, createInventoryLocation(supportType, id))),
    }),
    supportType,
    contents,
  };
}

export const normalizeHook = (hook = {}) => normalizeSupport(hook, "hook");
export const normalizeHolster = (holster = {}) => normalizeSupport(holster, "holster");
export const normalizeBandolier = (bandolier = {}) => normalizeSupport(bandolier, "bandolier");

function normalizeBackpack(backpack = {}) {
  return normalizeSupport(backpack, "backpack");
}

function normalizeEquipment(equipment = {}) {
  const source = isObject(equipment) ? clone(equipment) : {};
  return {
    ...source,
    armor: source.armor ? setItemLocation(source.armor, createInventoryLocation("armor")) : null,
    weapons: arrayValue(source.weapons).map((item) => setItemLocation(item, getItemLocation(item).type === "loose" ? createInventoryLocation("equipped") : getItemLocation(item))),
    activeWeaponId: source.activeWeaponId ?? null,
    equippedItems: arrayValue(source.equippedItems).map((item) => setItemLocation(item, getItemLocation(item).type === "loose" ? createInventoryLocation("equipped") : getItemLocation(item))),
    hooks: arrayValue(source.hooks).map(normalizeHook),
    holsters: arrayValue(source.holsters).map(normalizeHolster),
    bandoliers: arrayValue(source.bandoliers).map(normalizeBandolier),
  };
}

function normalizeInventory(inventory = {}, character = {}) {
  const source = Array.isArray(inventory) ? { looseItems: inventory } : (isObject(inventory) ? clone(inventory) : {});
  return {
    ...source,
    looseItems: arrayValue(source.looseItems).map(normalizeInventoryItem),
    cubes: arrayValue(source.cubes).map(normalizeCube),
    credits: numberValue(firstValue(source.credits, character.currency, character.credits), 0),
    allItems: arrayValue(source.allItems).map(normalizeInventoryItem),
    unassigned: arrayValue(source.unassigned).map((item) => setItemLocation(item, createInventoryLocation("unknown"))),
    backpacks: arrayValue(source.backpacks).map(normalizeBackpack),
  };
}

function normalizeAmmoSystem(ammoSystem = {}) {
  const source = isObject(ammoSystem) ? clone(ammoSystem) : {};
  return {
    ...source,
    magazines: arrayValue(source.magazines),
    ammoStacks: arrayValue(source.ammoStacks),
    loadedWeapons: arrayValue(source.loadedWeapons),
  };
}

function collectContainerContents(containers = []) {
  return arrayValue(containers).flatMap((container) => [
    normalizeInventoryItem(container),
    ...arrayValue(container.contents).map(normalizeInventoryItem),
  ]);
}

function collectOnlyContainerContents(containers = []) {
  return arrayValue(containers).flatMap((container) => arrayValue(container.contents).map(normalizeInventoryItem));
}

function collectPhysicalItems(character = {}, { includeAllItems = false } = {}) {
  const equipment = character.equipment || {};
  const inventory = character.inventory || {};
  const items = [
    ...arrayValue(inventory.looseItems),
    ...arrayValue(inventory.unassigned),
    ...arrayValue(inventory.backpacks),
    ...arrayValue(inventory.cubes),
    ...arrayValue(inventory.cubes).flatMap((cube) => arrayValue(cube.contents)),
    ...(equipment.armor ? [equipment.armor] : []),
    ...arrayValue(equipment.weapons),
    ...arrayValue(equipment.equippedItems),
    ...collectContainerContents(equipment.hooks),
    ...collectContainerContents(equipment.holsters),
    ...collectContainerContents(equipment.bandoliers),
  ].map(normalizeInventoryItem);
  if (includeAllItems) items.push(...arrayValue(inventory.allItems).map(normalizeInventoryItem));
  return dedupeItems(items);
}

function refreshAllItems(character = {}) {
  return {
    ...character,
    inventory: {
      ...character.inventory,
      allItems: collectPhysicalItems(character, { includeAllItems: true }),
    },
  };
}

export function normalizeCharacterInventory(character = {}) {
  const source = isObject(character) ? clone(character) : {};
  const legacy = isObject(source.legacy) ? clone(source.legacy) : {};
  if (Array.isArray(source.inventory)) {
    legacy.rawInventory = clone(source.inventory);
    legacy.inventory = legacy.inventory ?? clone(source.inventory);
  }
  const normalized = {
    ...source,
    equipment: normalizeEquipment(source.equipment),
    inventory: normalizeInventory(source.inventory, source),
    ammoSystem: normalizeAmmoSystem(source.ammoSystem),
    legacy,
  };
  return refreshAllItems(normalized);
}

export function listAllInventoryItems(character = {}) {
  return collectPhysicalItems(normalizeCharacterInventory(character), { includeAllItems: true });
}

export function listItemsByLocation(character = {}, locationType) {
  const type = normalizeLocationType(locationType);
  return listAllInventoryItems(character).filter((item) => getItemLocation(item).type === type);
}

function findInventoryEntry(character = {}, itemId) {
  const normalized = normalizeCharacterInventory(character);
  const target = textValue(itemId);
  const all = listAllInventoryItems(normalized);
  return {
    character: normalized,
    item: all.find((entry) => itemMatchesId(entry, target)) || null,
  };
}

export function findInventoryItemById(character = {}, itemId) {
  return findInventoryEntry(character, itemId).item;
}

function removeFromContainer(container, itemId) {
  return {
    ...container,
    contents: arrayValue(container.contents).filter((entry) => !itemMatchesId(entry, itemId)),
  };
}

function removeItemEverywhere(character = {}, itemId) {
  const normalized = normalizeCharacterInventory(character);
  const removed = findInventoryItemById(normalized, itemId);
  const equipment = normalized.equipment;
  const inventory = normalized.inventory;
  return {
    character: refreshAllItems({
      ...normalized,
      equipment: {
        ...equipment,
        armor: equipment.armor && itemMatchesId(equipment.armor, itemId) ? null : equipment.armor,
        weapons: arrayValue(equipment.weapons).filter((entry) => !itemMatchesId(entry, itemId)),
        activeWeaponId: textValue(equipment.activeWeaponId) === textValue(itemId) ? null : equipment.activeWeaponId,
        equippedItems: arrayValue(equipment.equippedItems).filter((entry) => !itemMatchesId(entry, itemId)),
        hooks: arrayValue(equipment.hooks)
          .filter((entry) => !itemMatchesId(entry, itemId))
          .map((entry) => removeFromContainer(entry, itemId)),
        holsters: arrayValue(equipment.holsters)
          .filter((entry) => !itemMatchesId(entry, itemId))
          .map((entry) => removeFromContainer(entry, itemId)),
        bandoliers: arrayValue(equipment.bandoliers)
          .filter((entry) => !itemMatchesId(entry, itemId))
          .map((entry) => removeFromContainer(entry, itemId)),
      },
      inventory: {
        ...inventory,
        looseItems: arrayValue(inventory.looseItems).filter((entry) => !itemMatchesId(entry, itemId)),
        unassigned: arrayValue(inventory.unassigned).filter((entry) => !itemMatchesId(entry, itemId)),
        backpacks: arrayValue(inventory.backpacks)
          .filter((entry) => !itemMatchesId(entry, itemId))
          .map((entry) => removeFromContainer(entry, itemId)),
        cubes: arrayValue(inventory.cubes)
          .filter((entry) => !itemMatchesId(entry, itemId))
          .map((cube) => removeFromContainer(cube, itemId)),
        allItems: arrayValue(inventory.allItems).filter((entry) => !itemMatchesId(entry, itemId)),
      },
    }),
    removed,
  };
}

function upsertContainer(containers, id, type, namePrefix) {
  const normalizedId = textValue(id, `${type}-default`);
  const existing = arrayValue(containers).find((entry) => textValue(entry.id) === normalizedId);
  if (existing) return arrayValue(containers);
  return [
    ...arrayValue(containers),
    normalizeSupport({ id: normalizedId, name: `${namePrefix} ${normalizedId}`, contents: [] }, type),
  ];
}

function addToSupport(character = {}, item = {}, location) {
  const collection = SUPPORT_COLLECTIONS[location.type];
  const namePrefix = location.type === "hook" ? "Gancho" : location.type === "holster" ? "Coldre" : "Bandoleira";
  const supportId = textValue(location.id, `${location.type}-default`);
  const equipment = {
    ...character.equipment,
    [collection]: upsertContainer(character.equipment?.[collection], supportId, location.type, namePrefix),
  };
  equipment[collection] = arrayValue(equipment[collection]).map((support) => {
    if (textValue(support.id) !== supportId) return support;
    return {
      ...support,
      contents: dedupeItems([...arrayValue(support.contents), setItemLocation(item, createInventoryLocation(location.type, supportId))]),
    };
  });
  return {
    ...character,
    equipment,
  };
}

function addToCube(character = {}, item = {}, location) {
  const cubeId = textValue(location.id, "cube-default");
  const inventory = {
    ...character.inventory,
    cubes: arrayValue(character.inventory?.cubes),
  };
  if (!inventory.cubes.some((cube) => textValue(cube.id) === cubeId)) {
    inventory.cubes = [...inventory.cubes, normalizeCube({ id: cubeId, name: `Cubo ${cubeId}`, contents: [] })];
  }
  inventory.cubes = inventory.cubes.map((cube) => {
    if (textValue(cube.id) !== cubeId) return cube;
    return {
      ...cube,
      contents: dedupeItems([...arrayValue(cube.contents), setItemLocation(item, createInventoryLocation("cube", cubeId))]),
    };
  });
  return {
    ...character,
    inventory,
  };
}

function addToLocation(character = {}, item = {}, location = createInventoryLocation("loose")) {
  const normalized = normalizeCharacterInventory(character);
  const target = normalizeInventoryLocation(location);
  const preparedItem = setItemLocation(item, target);
  if (preparedItem.type === "cube" && target.type === "loose") {
    return refreshAllItems({
      ...normalized,
      inventory: {
        ...normalized.inventory,
        cubes: dedupeItems([...arrayValue(normalized.inventory.cubes), normalizeCube(preparedItem)]),
      },
    });
  }
  if (target.type === "cube") return refreshAllItems(addToCube(normalized, preparedItem, target));
  if (SUPPORT_COLLECTIONS[target.type]) return refreshAllItems(addToSupport(normalized, preparedItem, target));
  if (target.type === "armor") {
    return refreshAllItems({
      ...normalized,
      equipment: {
        ...normalized.equipment,
        armor: preparedItem,
      },
    });
  }
  if (target.type === "equipped" || target.type === "hand") {
    return refreshAllItems({
      ...normalized,
      equipment: {
        ...normalized.equipment,
        equippedItems: dedupeItems([...arrayValue(normalized.equipment.equippedItems), preparedItem]),
      },
    });
  }
  if (target.type === "unknown") {
    return refreshAllItems({
      ...normalized,
      inventory: {
        ...normalized.inventory,
        unassigned: dedupeItems([...arrayValue(normalized.inventory.unassigned), preparedItem]),
      },
    });
  }
  return refreshAllItems({
    ...normalized,
    inventory: {
      ...normalized.inventory,
      looseItems: dedupeItems([...arrayValue(normalized.inventory.looseItems), setItemLocation(preparedItem, createInventoryLocation("loose"))]),
    },
  });
}

export function addItemToCharacterInventory(character = {}, item = {}, location = null) {
  const target = normalizeInventoryLocation(location || getItemLocation(item));
  return addToLocation(character, item, target);
}

export function removeItemFromCharacterInventory(character = {}, itemId) {
  return removeItemEverywhere(character, itemId).character;
}

export function moveItemToLocation(character = {}, itemId, location) {
  const { character: withoutItem, removed } = removeItemEverywhere(character, itemId);
  if (!removed) return withoutItem;
  return addToLocation(withoutItem, removed, normalizeInventoryLocation(location));
}

export function canPlaceItemInLocation(item = {}, location = null, character = {}) {
  const normalizedLocation = normalizeInventoryLocation(location);
  if (!SOLARIS_INVENTORY_LOCATION_TYPES.includes(normalizedLocation.type)) return false;
  if (normalizedLocation.type === "cube" && normalizedLocation.id) {
    const normalized = normalizeCharacterInventory(character);
    return normalized.inventory.cubes.some((cube) => textValue(cube.id) === textValue(normalizedLocation.id));
  }
  return Boolean(normalizeInventoryItem(item));
}

export function listCubeContents(character = {}, cubeId) {
  const normalized = normalizeCharacterInventory(character);
  const cube = normalized.inventory.cubes.find((entry) => textValue(entry.id) === textValue(cubeId));
  return arrayValue(cube?.contents).map(normalizeInventoryItem);
}

export function addItemToCube(character = {}, cubeId, item = {}) {
  return addItemToCharacterInventory(character, item, createInventoryLocation("cube", cubeId));
}

export function removeItemFromCube(character = {}, cubeId, itemId) {
  const normalized = normalizeCharacterInventory(character);
  return refreshAllItems({
    ...normalized,
    inventory: {
      ...normalized.inventory,
      cubes: arrayValue(normalized.inventory.cubes).map((cube) => (
        textValue(cube.id) === textValue(cubeId) ? removeFromContainer(cube, itemId) : cube
      )),
    },
  });
}

export function moveItemBetweenCubes(character = {}, itemId, fromCubeId, toCubeId) {
  const sourceItem = listCubeContents(character, fromCubeId).find((entry) => itemMatchesId(entry, itemId));
  if (!sourceItem) return normalizeCharacterInventory(character);
  return addItemToCube(removeItemFromCube(character, fromCubeId, itemId), toCubeId, sourceItem);
}

export function listHookItems(character = {}) {
  const normalized = normalizeCharacterInventory(character);
  return collectOnlyContainerContents(normalized.equipment.hooks);
}

export function listHolsterItems(character = {}) {
  const normalized = normalizeCharacterInventory(character);
  return collectOnlyContainerContents(normalized.equipment.holsters);
}

export function listBandolierItems(character = {}) {
  const normalized = normalizeCharacterInventory(character);
  return collectOnlyContainerContents(normalized.equipment.bandoliers);
}

export const placeItemOnHook = (character = {}, itemId, hookId = null) => moveItemToLocation(character, itemId, createInventoryLocation("hook", hookId));
export const placeItemInHolster = (character = {}, itemId, holsterId = null) => moveItemToLocation(character, itemId, createInventoryLocation("holster", holsterId));
export const placeItemInBandolier = (character = {}, itemId, bandolierId = null) => moveItemToLocation(character, itemId, createInventoryLocation("bandolier", bandolierId));

export function equipArmor(character = {}, armorItem = {}) {
  const normalized = normalizeCharacterInventory(character);
  const armor = setItemLocation(armorItem, createInventoryLocation("armor"));
  const withoutArmor = removeItemEverywhere(normalized, armor.id).character;
  return refreshAllItems({
    ...withoutArmor,
    equipment: {
      ...withoutArmor.equipment,
      armor,
    },
  });
}

export function unequipArmor(character = {}, destinationLocation = null) {
  const normalized = normalizeCharacterInventory(character);
  if (!normalized.equipment.armor) return normalized;
  const armor = normalized.equipment.armor;
  const withoutArmor = {
    ...normalized,
    equipment: {
      ...normalized.equipment,
      armor: null,
    },
  };
  return addToLocation(withoutArmor, armor, normalizeInventoryLocation(destinationLocation || createInventoryLocation("loose")));
}

export function equipWeapon(character = {}, weaponItem = {}) {
  const normalized = normalizeCharacterInventory(character);
  const weapon = setItemLocation(weaponItem, createInventoryLocation("equipped"));
  const withoutWeapon = removeItemEverywhere(normalized, weapon.id).character;
  return refreshAllItems({
    ...withoutWeapon,
    equipment: {
      ...withoutWeapon.equipment,
      weapons: dedupeItems([...arrayValue(withoutWeapon.equipment.weapons), weapon]),
      activeWeaponId: withoutWeapon.equipment.activeWeaponId || weapon.id,
    },
  });
}

export function unequipWeapon(character = {}, weaponId, destinationLocation = null) {
  const normalized = normalizeCharacterInventory(character);
  const weapon = arrayValue(normalized.equipment.weapons).find((entry) => itemMatchesId(entry, weaponId));
  if (!weapon) return normalized;
  const withoutWeapon = removeItemEverywhere(normalized, weaponId).character;
  return addToLocation(withoutWeapon, weapon, normalizeInventoryLocation(destinationLocation || createInventoryLocation("loose")));
}

export function setActiveWeapon(character = {}, weaponId) {
  const normalized = normalizeCharacterInventory(character);
  const weapon = arrayValue(normalized.equipment.weapons).find((entry) => itemMatchesId(entry, weaponId));
  return {
    ...normalized,
    equipment: {
      ...normalized.equipment,
      activeWeaponId: weapon ? textValue(firstValue(weapon.id, weapon.uid, weapon.itemId), weaponId) : normalized.equipment.activeWeaponId,
    },
  };
}

export function equipCharacterItem(character = {}, itemId, slotType = null) {
  const { character: normalized, item } = findInventoryEntry(character, itemId);
  if (!item) return normalized;
  const type = textValue(firstValue(slotType, item.type, item.category), "").toLowerCase();
  if (type.includes("armor") || type.includes("armadura")) return equipArmor(normalized, item);
  if (type.includes("weapon") || type.includes("arma")) return equipWeapon(normalized, item);
  return moveItemToLocation(normalized, itemId, createInventoryLocation("equipped", slotType));
}

export function unequipCharacterItem(character = {}, itemId) {
  const normalized = normalizeCharacterInventory(character);
  if (normalized.equipment.armor && itemMatchesId(normalized.equipment.armor, itemId)) return unequipArmor(normalized);
  if (arrayValue(normalized.equipment.weapons).some((entry) => itemMatchesId(entry, itemId))) return unequipWeapon(normalized, itemId);
  return moveItemToLocation(normalized, itemId, createInventoryLocation("loose"));
}

export function getCharacterInventorySummary(character = {}) {
  const normalized = normalizeCharacterInventory(character);
  const allItems = listAllInventoryItems(normalized);
  return {
    totalItems: allItems.length,
    looseItems: normalized.inventory.looseItems.length,
    unassignedItems: normalized.inventory.unassigned.length,
    cubes: normalized.inventory.cubes.length,
    cubeItems: normalized.inventory.cubes.reduce((sum, cube) => sum + arrayValue(cube.contents).length, 0),
    hooks: normalized.equipment.hooks.length,
    holsters: normalized.equipment.holsters.length,
    bandoliers: normalized.equipment.bandoliers.length,
    equippedItems: normalized.equipment.equippedItems.length + normalized.equipment.weapons.length + (normalized.equipment.armor ? 1 : 0),
    credits: normalized.inventory.credits,
    warnings: [
      ...normalized.inventory.cubes
        .filter((cube) => cube.capacity === null || cube.capacity === undefined)
        .map((cube) => `Cubo ${cube.name} sem capacidade consolidada.`),
    ],
  };
}
