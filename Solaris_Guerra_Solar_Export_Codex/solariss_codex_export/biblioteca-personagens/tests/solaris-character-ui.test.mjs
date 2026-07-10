import assert from "node:assert/strict";
import test from "node:test";

import {
  getCharacterAttributeViewModel,
  getCharacterCombatViewModel,
  getCharacterDisplayName,
  getCharacterEquipmentSummary,
  getCharacterEquipmentViewModel,
  getCharacterInventoryViewModel,
  getCharacterResourceViewModel,
  getCharacterStorageViewModel,
  getCubeViewModels,
  getQuickAccessViewModel,
  getCharacterSummary,
  getCharacterValidationMessages,
} from "../src/ui/solaris-character-ui.js";

const character = {
  id: "char-ui",
  name: "Lyssara Kalar",
  race: "humanis",
  profession: "guardiao",
  level: 2,
  experience: 1200,
  attributes: { FOR: 8, REF: 9, CON: 10, INT: 11, PRE: 12, MEN: 13, ESP: 14 },
  pvCurrent: 6,
  stress: 1,
  cosmosCurrent: 2,
  currency: 250,
  inventory: [
    { uid: "arma-1", itemId: "rifle", name: "Rifle", category: "weapon" },
  ],
  equipment: {
    armor: { id: "armor-ui", name: "Armadura UI", type: "armor" },
    weapons: [{ id: "weapon-ui", name: "Rifle UI", type: "weapon" }],
    activeWeaponId: "weapon-ui",
    hooks: [{ id: "hook-ui", name: "Gancho UI", contents: [{ id: "item-hook-ui", name: "Item no Gancho" }] }],
    holsters: [{ id: "holster-ui", name: "Coldre UI", contents: [{ id: "item-holster-ui", name: "Item no Coldre" }] }],
    bandoliers: [{ id: "bandolier-ui", name: "Bandoleira UI", contents: [{ id: "item-bandolier-ui", name: "Item na Bandoleira" }] }],
  },
  ammoSystem: {
    magazines: [],
    ammoStacks: [],
    loadedWeapons: [],
  },
  exportContext: {
    raceName: "Humanis",
    professionName: "Guardiao",
    derived: {
      pvMax: 10,
      stressMax: 6,
      cosmosMax: 4,
      ca: 7,
      movement: 4,
      initiative: 2,
      baseDice: "3d6",
    },
  },
};

test("getCharacterDisplayName retorna nome ou fallback", () => {
  assert.equal(getCharacterDisplayName(character), "Lyssara Kalar");
  assert.equal(getCharacterDisplayName({ id: "sem-nome", name: "" }), "Personagem sem nome");
});

test("getCharacterSummary retorna dados basicos", () => {
  const summary = getCharacterSummary(character);
  assert.equal(summary.name, "Lyssara Kalar");
  assert.equal(summary.race, "humanis");
  assert.equal(summary.profession, "guardiao");
  assert.equal(summary.level, 2);
});

test("getCharacterAttributeViewModel inclui MEN", () => {
  const attributes = getCharacterAttributeViewModel(character);
  assert.ok(attributes.some((attribute) => attribute.key === "men" && attribute.value === 13));
});

test("getCharacterAttributeViewModel nao inclui ESP como oficial", () => {
  const attributes = getCharacterAttributeViewModel(character);
  assert.equal(attributes.some((attribute) => attribute.key === "esp"), false);
  assert.equal(attributes.length, 6);
});

test("getCharacterResourceViewModel inclui PV, Estresse e Cosmos", () => {
  const resources = getCharacterResourceViewModel(character);
  assert.deepEqual(resources.map((resource) => resource.key), ["pv", "stress", "cosmos"]);
  assert.equal(resources.find((resource) => resource.key === "pv").text, "6/10");
  assert.equal(resources.find((resource) => resource.key === "cosmos").percent, 50);
});

test("getCharacterCombatViewModel inclui CA, movimento e iniciativa quando disponiveis", () => {
  const combat = getCharacterCombatViewModel(character);
  assert.equal(combat.ca, 7);
  assert.equal(combat.movement, 4);
  assert.equal(combat.initiative, 2);
  assert.equal(combat.baseDice, "3d6");
});

test("getCharacterEquipmentSummary prepara equipamentos sem DOM", () => {
  const equipment = getCharacterEquipmentSummary(character);
  assert.equal(equipment.weapons.length, 1);
  assert.equal(equipment.credits, 250);
});

test("getCharacterInventoryViewModel retorna itens soltos", () => {
  const inventory = getCharacterInventoryViewModel({
    ...character,
    inventory: {
      credits: 50,
      looseItems: [{ id: "item-solto-ui", name: "Item Solto" }],
      cubes: [],
    },
  });
  assert.ok(inventory.looseItems.some((item) => item.id === "item-solto-ui"));
  assert.equal(inventory.credits, 50);
});

test("getCubeViewModels retorna cubos", () => {
  const cubes = getCubeViewModels({
    ...character,
    inventory: {
      looseItems: [],
      cubes: [{ id: "cube-ui", name: "Cubo UI", type: "cube", capacity: 3, contents: [{ id: "item-cube-ui", name: "Item no Cubo" }] }],
      credits: 0,
    },
  });
  assert.equal(cubes.length, 1);
  assert.equal(cubes[0].used, 1);
});

test("getCharacterEquipmentViewModel retorna armor e weapons", () => {
  const equipment = getCharacterEquipmentViewModel(character);
  assert.equal(equipment.armor.id, "armor-ui");
  assert.ok(equipment.weapons.some((weapon) => weapon.id === "weapon-ui"));
});

test("getQuickAccessViewModel retorna hooks holsters e bandoliers", () => {
  const quickAccess = getQuickAccessViewModel(character);
  assert.ok(quickAccess.hooks.some((item) => item.id === "item-hook-ui"));
  assert.ok(quickAccess.holsters.some((item) => item.id === "item-holster-ui"));
  assert.ok(quickAccess.bandoliers.some((item) => item.id === "item-bandolier-ui"));
});

test("getCharacterStorageViewModel retorna armazenamento consolidado", () => {
  const storage = getCharacterStorageViewModel({
    ...character,
    inventory: {
      looseItems: [],
      cubes: [{ id: "cube-storage-ui", name: "Cubo Storage", type: "cube", contents: [] }],
      credits: 0,
    },
  });
  assert.equal(storage.cubes.length, 1);
  assert.ok(storage.summary.totalItems >= 1);
});

test("getCharacterValidationMessages retorna erros e warnings", () => {
  const validation = getCharacterValidationMessages(character);
  assert.equal(validation.ok, true);
  assert.ok(Array.isArray(validation.warnings));
});
