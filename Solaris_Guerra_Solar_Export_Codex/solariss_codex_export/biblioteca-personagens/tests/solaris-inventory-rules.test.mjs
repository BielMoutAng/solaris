import assert from "node:assert/strict";
import test from "node:test";

import {
  addItemToCharacterInventory,
  addItemToCube,
  canPlaceItemInLocation,
  createInventoryLocation,
  equipCharacterItem,
  equipArmor,
  equipWeapon,
  findInventoryItemById,
  getCharacterInventorySummary,
  listAllInventoryItems,
  listCubeContents,
  listItemsByLocation,
  moveItemBetweenCubes,
  moveItemToLocation,
  normalizeBandolier,
  normalizeCharacterInventory,
  normalizeCube,
  normalizeHolster,
  normalizeHook,
  normalizeInventoryItem,
  normalizeInventoryLocation,
  placeItemInBandolier,
  placeItemInHolster,
  placeItemOnHook,
  removeItemFromCube,
  removeItemFromCharacterInventory,
  setActiveWeapon,
  unequipCharacterItem,
  unequipArmor,
  unequipWeapon,
} from "../src/domain/solaris-inventory-rules.js";

const baseCharacter = {
  id: "char-inventory",
  legacy: {
    attributes: {
      ESP: 13,
    },
  },
  inventory: {
    credits: 120,
    looseItems: [
      { id: "item-lanterna", name: "Lanterna", type: "tool" },
      { id: "item-kit", name: "Kit de Cura", type: "consumable" },
    ],
    cubes: [
      { id: "cube-1", name: "Cubo Simples", type: "cube", contents: [{ id: "item-minerio", name: "Minerio", type: "material" }] },
    ],
  },
};

test("normalizeCharacterInventory cria equipment minimo", () => {
  const normalized = normalizeCharacterInventory({});
  assert.deepEqual(normalized.equipment.weapons, []);
  assert.deepEqual(normalized.equipment.hooks, []);
  assert.deepEqual(normalized.equipment.holsters, []);
  assert.deepEqual(normalized.equipment.bandoliers, []);
});

test("normalizeCharacterInventory cria inventory minimo", () => {
  const normalized = normalizeCharacterInventory({});
  assert.deepEqual(normalized.inventory.looseItems, []);
  assert.deepEqual(normalized.inventory.cubes, []);
  assert.equal(normalized.inventory.credits, 0);
});

test("normalizeCharacterInventory cria ammoSystem minimo", () => {
  const normalized = normalizeCharacterInventory({});
  assert.deepEqual(normalized.ammoSystem.magazines, []);
  assert.deepEqual(normalized.ammoSystem.ammoStacks, []);
  assert.deepEqual(normalized.ammoSystem.loadedWeapons, []);
});

test("normalizeInventoryLocation aceita loose", () => {
  const location = normalizeInventoryLocation({ type: "loose" });
  assert.equal(location.type, "loose");
});

test("normalizeInventoryLocation aceita cube", () => {
  const location = normalizeInventoryLocation({ type: "cube", id: "cube-1" });
  assert.equal(location.type, "cube");
  assert.equal(location.id, "cube-1");
});

test("normalizeInventoryItem preserva legacy", () => {
  const item = normalizeInventoryItem({ id: "item-1", name: "Item", legacy: { origem: "antiga" } });
  assert.equal(item.legacy.origem, "antiga");
});

test("normalizeCube cria container com contents localizados", () => {
  const cube = normalizeCube({ id: "cube-x", name: "Cubo X", contents: [{ id: "item-x", name: "Item X" }] });
  assert.equal(cube.id, "cube-x");
  assert.equal(cube.contents[0].location.type, "cube");
  assert.equal(cube.contents[0].location.id, "cube-x");
});

test("normalizeHook normalizeHolster e normalizeBandolier criam suportes fisicos", () => {
  assert.equal(normalizeHook({ id: "hook-x" }).supportType, "hook");
  assert.equal(normalizeHolster({ id: "holster-x" }).supportType, "holster");
  assert.equal(normalizeBandolier({ id: "bandolier-x" }).supportType, "bandolier");
});

test("addItemToCharacterInventory adiciona item em loose por padrao", () => {
  const updated = addItemToCharacterInventory({ inventory: { looseItems: [] } }, { id: "item-solto", name: "Item Solto" });
  assert.equal(updated.inventory.looseItems.length, 1);
  assert.equal(updated.inventory.looseItems[0].location.type, "loose");
});

test("addItemToCharacterInventory adiciona item em cubo quando location.type = cube", () => {
  const updated = addItemToCharacterInventory(baseCharacter, { id: "item-granada", name: "Granada" }, createInventoryLocation("cube", "cube-1"));
  assert.ok(listCubeContents(updated, "cube-1").some((item) => item.id === "item-granada"));
});

test("removeItemFromCharacterInventory remove item sem apagar outros", () => {
  const updated = removeItemFromCharacterInventory(baseCharacter, "item-lanterna");
  assert.equal(findInventoryItemById(updated, "item-lanterna"), null);
  assert.ok(findInventoryItemById(updated, "item-kit"));
});

test("findInventoryItemById encontra item em loose", () => {
  const item = findInventoryItemById(baseCharacter, "item-lanterna");
  assert.equal(item.name, "Lanterna");
});

test("findInventoryItemById encontra item em cubo", () => {
  const item = findInventoryItemById(baseCharacter, "item-minerio");
  assert.equal(item.location.type, "cube");
});

test("canPlaceItemInLocation valida locais fisicos conhecidos", () => {
  assert.equal(canPlaceItemInLocation({ id: "item-ok" }, createInventoryLocation("loose"), baseCharacter), true);
  assert.equal(canPlaceItemInLocation({ id: "item-ok" }, createInventoryLocation("cube", "cube-1"), baseCharacter), true);
  assert.equal(canPlaceItemInLocation({ id: "item-ok" }, createInventoryLocation("cube", "cube-inexistente"), baseCharacter), false);
});

test("listAllInventoryItems lista loose e itens em cubos", () => {
  const items = listAllInventoryItems(baseCharacter);
  assert.ok(items.some((item) => item.id === "item-lanterna"));
  assert.ok(items.some((item) => item.id === "item-minerio"));
});

test("listItemsByLocation filtra por tipo de local", () => {
  const updated = moveItemToLocation(baseCharacter, "item-kit", createInventoryLocation("cube", "cube-1"));
  const cubeItems = listItemsByLocation(updated, "cube");
  assert.ok(cubeItems.some((item) => item.id === "item-kit"));
});

test("moveItemToLocation move item para cubo", () => {
  const updated = moveItemToLocation(baseCharacter, "item-kit", createInventoryLocation("cube", "cube-1"));
  assert.ok(listCubeContents(updated, "cube-1").some((item) => item.id === "item-kit"));
  assert.equal(updated.inventory.looseItems.some((item) => item.id === "item-kit"), false);
});

test("moveItemToLocation move item para loose", () => {
  const inCube = addItemToCharacterInventory(baseCharacter, { id: "item-bateria", name: "Bateria" }, createInventoryLocation("cube", "cube-1"));
  const updated = moveItemToLocation(inCube, "item-bateria", createInventoryLocation("loose"));
  assert.ok(updated.inventory.looseItems.some((item) => item.id === "item-bateria"));
});

test("addItemToCube removeItemFromCube e moveItemBetweenCubes operam containers", () => {
  const withSecondCube = addItemToCharacterInventory(baseCharacter, { id: "cube-2", name: "Cubo Dois", type: "cube" });
  const withItem = addItemToCube(withSecondCube, "cube-1", { id: "item-carga", name: "Carga" });
  assert.ok(listCubeContents(withItem, "cube-1").some((item) => item.id === "item-carga"));

  const moved = moveItemBetweenCubes(withItem, "item-carga", "cube-1", "cube-2");
  assert.equal(listCubeContents(moved, "cube-1").some((item) => item.id === "item-carga"), false);
  assert.ok(listCubeContents(moved, "cube-2").some((item) => item.id === "item-carga"));

  const removed = removeItemFromCube(moved, "cube-2", "item-carga");
  assert.equal(listCubeContents(removed, "cube-2").some((item) => item.id === "item-carga"), false);
});

test("equipArmor define equipment.armor", () => {
  const updated = equipArmor(baseCharacter, { id: "armor-1", name: "Armadura", type: "armor" });
  assert.equal(updated.equipment.armor.id, "armor-1");
  assert.equal(updated.equipment.armor.location.type, "armor");
});

test("unequipArmor remove armor e move para destino", () => {
  const equipped = equipArmor(baseCharacter, { id: "armor-1", name: "Armadura", type: "armor" });
  const updated = unequipArmor(equipped);
  assert.equal(updated.equipment.armor, null);
  assert.ok(updated.inventory.looseItems.some((item) => item.id === "armor-1"));
});

test("equipWeapon adiciona arma em equipment.weapons", () => {
  const updated = equipWeapon(baseCharacter, { id: "weapon-1", name: "Rifle", type: "weapon" });
  assert.ok(updated.equipment.weapons.some((item) => item.id === "weapon-1"));
});

test("unequipWeapon remove arma equipada e move para loose", () => {
  const equipped = equipWeapon(baseCharacter, { id: "weapon-1", name: "Rifle", type: "weapon" });
  const updated = unequipWeapon(equipped, "weapon-1");
  assert.equal(updated.equipment.weapons.some((item) => item.id === "weapon-1"), false);
  assert.ok(updated.inventory.looseItems.some((item) => item.id === "weapon-1"));
});

test("setActiveWeapon define activeWeaponId", () => {
  const equipped = equipWeapon(baseCharacter, { id: "weapon-1", name: "Rifle", type: "weapon" });
  const updated = setActiveWeapon(equipped, "weapon-1");
  assert.equal(updated.equipment.activeWeaponId, "weapon-1");
});

test("equipCharacterItem e unequipCharacterItem operam item generico", () => {
  const withItem = addItemToCharacterInventory(baseCharacter, { id: "item-equipavel", name: "Item Equipavel" });
  const equipped = equipCharacterItem(withItem, "item-equipavel", "utilitario");
  assert.ok(equipped.equipment.equippedItems.some((item) => item.id === "item-equipavel"));

  const unequipped = unequipCharacterItem(equipped, "item-equipavel");
  assert.equal(unequipped.equipment.equippedItems.some((item) => item.id === "item-equipavel"), false);
  assert.ok(unequipped.inventory.looseItems.some((item) => item.id === "item-equipavel"));
});

test("placeItemOnHook define location hook", () => {
  const updated = placeItemOnHook(baseCharacter, "item-lanterna", "hook-1");
  const item = findInventoryItemById(updated, "item-lanterna");
  assert.equal(item.location.type, "hook");
  assert.equal(item.location.id, "hook-1");
});

test("placeItemInHolster define location holster", () => {
  const updated = placeItemInHolster(baseCharacter, "item-lanterna", "holster-1");
  const item = findInventoryItemById(updated, "item-lanterna");
  assert.equal(item.location.type, "holster");
});

test("placeItemInBandolier define location bandolier", () => {
  const updated = placeItemInBandolier(baseCharacter, "item-kit", "bandolier-1");
  const item = findInventoryItemById(updated, "item-kit");
  assert.equal(item.location.type, "bandolier");
});

test("getCharacterInventorySummary resume inventario fisico", () => {
  const updated = addItemToCube(baseCharacter, "cube-1", { id: "item-resumo", name: "Resumo" });
  const summary = getCharacterInventorySummary(updated);
  assert.equal(summary.cubes, 1);
  assert.ok(summary.totalItems >= 4);
  assert.equal(summary.credits, 120);
});

test("ESP em legacy nao e alterado por normalizacao de inventario", () => {
  const normalized = normalizeCharacterInventory(baseCharacter);
  assert.equal(normalized.legacy.attributes.ESP, 13);
});
