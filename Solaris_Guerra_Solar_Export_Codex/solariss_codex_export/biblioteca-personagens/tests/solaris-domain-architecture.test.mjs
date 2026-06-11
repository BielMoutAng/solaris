import assert from "node:assert/strict";
import test from "node:test";

import {
  ArmorDefinition,
  Character,
  Condition,
  CubeDefinition,
  EFFECT_OPERATIONS,
  Effect,
  HolsterDefinition,
  LOCATION_KINDS,
  MonsterDefinition,
  MonsterSheet,
  ResourcePool,
  Rachaduras,
  WeaponDefinition,
  migrateLegacyCharacterData,
} from "../src/domain/solaris-domain-architecture.js";

test("compra cria uma instância real, debita Luzentis e alerta sem localização", () => {
  const character = new Character({ name: "Lysara", luzentis: 3000 });
  const weapon = new WeaponDefinition({
    id: "pistola-luz",
    name: "Pistola de Luz",
    price: 1200,
    damage: "1d6",
  });

  const instance = character.buyEntity(weapon);

  assert.equal(character.luzentis, 1800);
  assert.equal(instance.definitionId, weapon.id);
  assert.equal(instance.location.kind, LOCATION_KINDS.UNASSIGNED);
  assert.equal(character.validateInventory().warnings[0].entityId, instance.id);
});

test("armazenadores validam tipo, capacidade e movimentação", () => {
  const character = new Character({ luzentis: 5000 });
  const holster = character.buyEntity(new HolsterDefinition({
    id: "coldre",
    name: "Coldre Lateral",
    price: 300,
    maxSlots: 1,
  }));
  const weapon = character.buyEntity(new WeaponDefinition({
    id: "pistola",
    name: "Pistola",
    price: 500,
  }));
  const armor = character.buyEntity(new ArmorDefinition({
    id: "colete",
    name: "Colete",
    price: 500,
  }));

  character.moveEntityTo(weapon.id, {
    kind: LOCATION_KINDS.HOLSTER,
    containerId: holster.id,
  });

  assert.deepEqual(character.inventory.getStoredIn(holster.id).map((entry) => entry.id), [weapon.id]);
  assert.equal(holster.getAvailableSlots(character.inventory), 0);
  assert.throws(
    () => character.moveEntityTo(armor.id, { kind: LOCATION_KINDS.HOLSTER, containerId: holster.id }),
    /não pode armazenar/
  );
});

test("venda usa metade do custo por padrão e limpa o loadout", () => {
  const character = new Character({ luzentis: 2000 });
  const weapon = character.buyEntity(new WeaponDefinition({
    id: "rifle",
    name: "Rifle",
    price: 1000,
  }));
  character.equipEntity(weapon.id, "mainWeapon");

  const result = character.sellEntity(weapon.id);

  assert.equal(result.sellPrice, 500);
  assert.equal(character.luzentis, 1500);
  assert.equal(character.loadout.mainWeapon, "");
  assert.equal(character.inventory.findById(weapon.id), null);
});

test("exclusão manual protege equipamento e conteúdo de armazenadores", () => {
  const character = new Character({ luzentis: 5000 });
  const cube = character.buyEntity(new CubeDefinition({
    id: "cubo",
    name: "Cubo",
    price: 200,
    maxSlots: 2,
  }));
  const weapon = character.buyEntity(new WeaponDefinition({
    id: "arma",
    name: "Arma",
    price: 400,
  }));

  character.equipEntity(weapon.id, "mainWeapon");
  assert.throws(() => character.deleteEntityManually(weapon.id), /Desequipe/);

  character.unequipEntity(weapon.id);
  character.moveEntityTo(weapon.id, { kind: LOCATION_KINDS.CUBE, containerId: cube.id });
  assert.throws(() => character.deleteEntityManually(cube.id), /contém itens/);

  character.deleteEntityManually(cube.id, { force: true });
  assert.equal(character.inventory.findById(cube.id), null);
  assert.equal(character.inventory.findById(weapon.id).location.kind, LOCATION_KINDS.UNASSIGNED);
});

test("rachaduras, recursos, efeitos e condições mantêm regras próprias", () => {
  const cracks = new Rachaduras({ current: 4, max: 5 });
  cracks.add(2);
  assert.equal(cracks.isCollapsed(), true);
  cracks.repair(3);
  assert.equal(cracks.current, 2);

  const ammo = new ResourcePool({ key: "ammo", label: "Munição", current: 2, max: 6 });
  assert.equal(ammo.spend(2), true);
  assert.equal(ammo.spend(1), false);
  ammo.refill();
  assert.equal(ammo.current, 6);

  const character = new Character({ baseDerivedStats: { ca: 4 } });
  character.addCondition(new Condition({
    key: "cobertura",
    effects: [new Effect({ key: "ca", operation: EFFECT_OPERATIONS.ADD, value: 2 })],
  }));
  character.addTemporaryEffect(new Effect({
    key: "ca",
    operation: EFFECT_OPERATIONS.MULTIPLY,
    value: 2,
  }));
  assert.equal(character.getDerivedStat("ca"), 10);
});

test("serialização e migração preservam recursos e referência de origem", () => {
  const character = new Character({ luzentis: 2000 });
  const definition = new WeaponDefinition({
    id: "pistola",
    name: "Pistola",
    price: 500,
    sourceReference: { book: "Livro 5", page: "42" },
    resources: [{ key: "ammo", label: "Munição", current: 3, max: 6 }],
  });
  const instance = character.buyEntity(definition);
  instance.resources[0].spend(1);

  const restored = Character.fromJSON(character.toJSON());
  assert.equal(restored.inventory.findById(instance.id).resources[0].current, 2);
  assert.equal(restored.inventory.findById(instance.id).sourceReference.book, "Livro 5");

  const migrated = migrateLegacyCharacterData({
    id: "legacy",
    name: "Legado",
    currency: 1500,
    inventory: [{
      uid: instance.id,
      itemId: definition.id,
      category: "weapon",
      domainEntity: instance.toJSON(),
    }],
  }, () => ({
    id: definition.id,
    name: definition.name,
    category: "weapon",
    price: definition.price,
  }));

  assert.equal(migrated.inventory.findById(instance.id).resources[0].current, 2);
  assert.equal(migrated.inventory.findById(instance.id).sourceReference.page, "42");
});

test("ficha jogável de monstro preserva combate, condições e notas", () => {
  const definition = new MonsterDefinition({
    id: "fera-solar",
    name: "Fera Solar",
    tier: "D",
    type: "Predador",
    maxPV: 18,
    ca: 7,
    movement: "8 m",
    attacks: ["Mordida 1d8+2"],
    abilities: ["Rugido cósmico"],
    maxCosmos: 3,
    maxStress: 6,
    rachadurasMax: 4,
  });
  const sheet = new MonsterSheet({ definition, gmNotes: "Protege o ninho." });

  sheet.instance.receiveDamage(5);
  sheet.instance.heal(2);
  const condition = sheet.instance.applyCondition({ key: "cego", label: "Cego" });
  sheet.instance.recordRoll({ label: "Mordida", rolls: [7], total: 9 });

  const restored = MonsterSheet.fromJSON(sheet.toJSON());
  assert.equal(restored.instance.currentPV, 15);
  assert.equal(restored.instance.currentCosmos, 3);
  assert.equal(restored.instance.conditions[0].id, condition.id);
  assert.equal(restored.instance.rollHistory[0].total, 9);
  assert.equal(restored.gmNotes, "Protege o ninho.");
});
