import assert from "node:assert/strict";
import test from "node:test";

import {
  ArmorDefinition,
  AMMO_KINDS,
  BandolierDefinition,
  Character,
  Condition,
  CubeDefinition,
  EFFECT_OPERATIONS,
  Effect,
  HolsterDefinition,
  ItemDefinition,
  LOCATION_KINDS,
  MonsterDefinition,
  MonsterSheet,
  FIRE_MODE_IDS,
  ResourcePool,
  Rachaduras,
  StorageDefinition,
  WeaponDefinition,
  ammoCubeUnitsFor,
  attachMagazineToWeapon,
  buildMonsterLootTable,
  createMagazineInstance,
  createWeaponAmmoState,
  detachMagazineFromWeapon,
  definitionFromLegacyItem,
  fireWeapon,
  loadAmmoIntoMagazine,
  migrateLegacyCharacterData,
  pumpWeapon,
  parseMonsterLootResources,
  reconcileLegacyArmorCatalog,
  reloadInternalWeapon,
  rollMonsterLoot,
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

test("mochilas legadas viram armazenadores e preservam a regra de carga", () => {
  const character = new Character({ luzentis: 10000 });
  const equippedWeapon = character.buyEntity(new WeaponDefinition({
    id: "rifle-equipado",
    name: "Rifle equipado",
    price: 0,
    weight: 4,
  }));
  const cube = character.buyEntity(new CubeDefinition({
    id: "cubo-simples",
    name: "Cubo Simples",
    price: 0,
    weight: 1,
    maxSlots: 1,
    allowedTypes: ["item"],
  }));
  const cubeContent = character.buyEntity(new ItemDefinition({
    id: "material-no-cubo",
    name: "Material no cubo",
    price: 0,
    weight: 8,
  }));
  const holster = character.buyEntity(new HolsterDefinition({
    id: "coldre",
    name: "Coldre",
    price: 0,
    weight: 0.5,
    maxSlots: 1,
  }));
  const holsteredWeapon = character.buyEntity(new WeaponDefinition({
    id: "pistola-no-coldre",
    name: "Pistola no coldre",
    price: 0,
    weight: 2,
  }));
  const backpackDefinition = definitionFromLegacyItem({
    id: "mochila",
    name: "Mochila reforçada",
    category: "item",
    type: "Armazenamento, transporte e recipientes",
    weight: "1,5 Kg",
    price: 0,
    cubeSupport: 5,
  });
  const backpack = character.buyEntity(backpackDefinition);
  const backpackItem = character.buyEntity(new ItemDefinition({
    id: "item-na-mochila",
    name: "Item na mochila",
    price: 0,
    weight: 0.5,
    metadata: { inventorySize: "small" },
  }));
  const baseItem = character.buyEntity(new ItemDefinition({
    id: "item-na-base",
    name: "Item na base",
    price: 0,
    weight: 50,
  }));

  assert.ok(backpackDefinition instanceof StorageDefinition);
  assert.equal(backpackDefinition.maxSlots, 0);
  assert.equal(backpackDefinition.maxWeight, 10);

  character.equipEntity(equippedWeapon.id, "mainWeapon");
  character.moveEntityTo(cubeContent.id, { kind: LOCATION_KINDS.CUBE, containerId: cube.id });
  character.moveEntityTo(holsteredWeapon.id, { kind: LOCATION_KINDS.HOLSTER, containerId: holster.id });
  character.moveEntityTo(backpackItem.id, { kind: LOCATION_KINDS.CONTAINER, containerId: backpack.id });
  character.moveEntityTo(baseItem.id, { kind: LOCATION_KINDS.BASE });

  assert.equal(character.inventory.getTotalWeight(), 5.5);
  assert.equal(character.inventory.getTotalWeight({ carriedOnly: false }), 67.5);
});

test("mochilas, coldres e bandoleiras respeitam porte e peso", () => {
  const character = new Character({ luzentis: 10000 });
  const backpack = character.buyEntity(definitionFromLegacyItem({
    id: "mochila-campo",
    name: "Mochila de campo",
    category: "item",
    type: "Armazenamento",
    weight: "2 Kg",
    price: 0,
  }));
  const holster = character.buyEntity(definitionFromLegacyItem({
    id: "coldre-campo",
    name: "Coldre simples",
    category: "item",
    weight: "0,8 Kg",
    price: 0,
  }));
  const bandolier = character.buyEntity(new BandolierDefinition({
    id: "bandoleira-campo",
    name: "Bandoleira tatica",
    price: 0,
    weight: 1,
    maxSlots: 2,
  }));
  const smallMeleeWeapon = character.buyEntity(definitionFromLegacyItem({
    id: "adaga",
    name: "Adaga",
    category: "weapon",
    weight: "1 Kg",
    price: 0,
  }));
  const smallRangedWeapon = definitionFromLegacyItem({
    id: "pistola",
    name: "Pistola leve",
    category: "weapon",
    weight: "1,5 Kg",
    price: 0,
  }).createInstance();
  const rifle = character.buyEntity(definitionFromLegacyItem({
    id: "rifle",
    name: "Rifle de precisao",
    category: "weapon",
    weight: "6 Kg",
    price: 0,
  }));
  const smallSupplies = character.buyEntity(definitionFromLegacyItem({
    id: "suprimentos",
    name: "Suprimentos compactos",
    category: "item",
    inventorySize: "small",
    weight: "9 Kg",
    price: 0,
  }));
  const extraSupplies = character.buyEntity(definitionFromLegacyItem({
    id: "suprimentos-extra",
    name: "Suprimentos extras",
    category: "item",
    inventorySize: "small",
    weight: "2 Kg",
    price: 0,
  }));
  const mediumEquipment = character.buyEntity(definitionFromLegacyItem({
    id: "equipamento-medio",
    name: "Equipamento medio",
    category: "item",
    inventorySize: "medium",
    weight: "4 Kg",
    price: 0,
  }));

  character.moveEntityTo(extraSupplies.id, { kind: LOCATION_KINDS.BASE });
  assert.equal(holster.canStore(smallMeleeWeapon, character.inventory), true);
  assert.equal(holster.canStore(smallRangedWeapon, character.inventory), true);
  assert.equal(backpack.canStore(mediumEquipment, character.inventory), false);
  character.moveEntityTo(smallMeleeWeapon.id, { kind: LOCATION_KINDS.HOLSTER, containerId: holster.id });
  character.moveEntityTo(rifle.id, { kind: LOCATION_KINDS.BANDOLIER, containerId: bandolier.id });
  character.moveEntityTo(smallSupplies.id, { kind: LOCATION_KINDS.CONTAINER, containerId: backpack.id });
  character.moveEntityTo(mediumEquipment.id, { kind: LOCATION_KINDS.BANDOLIER, containerId: bandolier.id });

  assert.equal(backpack.getAvailableWeight(character.inventory), 1);
  assert.throws(
    () => character.moveEntityTo(extraSupplies.id, { kind: LOCATION_KINDS.CONTAINER, containerId: backpack.id }),
    /não pode armazenar/
  );
  assert.throws(
    () => character.moveEntityTo(rifle.id, { kind: LOCATION_KINDS.HOLSTER, containerId: holster.id }),
    /não pode armazenar/
  );
  assert.equal(character.inventory.getTotalWeight(), 23.8);
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

test("arma com carregador removivel consome municao no carregador e preserva ao remover", () => {
  const weapon = {
    id: "rifle-1",
    definitionId: "rifle-pulso",
    name: "Rifle de Pulso Mk. II",
    category: "weapon",
    ammoState: createWeaponAmmoState({
      id: "rifle-1",
      name: "Rifle de Pulso Mk. II",
      category: "weapon",
    }),
  };
  const magazine = createMagazineInstance({
    id: weapon.ammoState.compatibleMagazineTemplateIds[0],
    name: "Carregador de rifle",
    capacity: 20,
    acceptedAmmoKinds: [AMMO_KINDS.MEDIUM],
  }, {
    id: "mag-1",
    currentAmmo: 8,
  });

  const attached = attachMagazineToWeapon(weapon, magazine);
  const fired = fireWeapon(attached.weapon, {
    magazines: [attached.magazine],
    modeId: FIRE_MODE_IDS.BURST,
  });

  assert.equal(fired.weapon.ammoState.attachedMagazineId, "mag-1");
  assert.equal(fired.magazines[0].currentAmmo, 4);

  const detached = detachMagazineFromWeapon(fired.weapon, fired.magazines);
  assert.equal(detached.weapon.ammoState.attachedMagazineId, "");
  assert.equal(detached.magazines[0].currentAmmo, 4);
});

test("armas internas recarregam e disparam sem aceitar carregador removivel", () => {
  const revolver = {
    id: "rev-1",
    name: "Revolver Antigo",
    category: "weapon",
    ammoState: createWeaponAmmoState({ name: "Revolver Antigo", category: "weapon" }, { currentAmmo: 0 }),
  };
  const ammoStack = { id: "ammo-light", ammoKind: AMMO_KINDS.LIGHT, quantity: 12 };

  assert.throws(
    () => attachMagazineToWeapon(revolver, createMagazineInstance({ acceptedAmmoKinds: [AMMO_KINDS.LIGHT], capacity: 6 })),
    /nao aceita carregador/
  );

  const reloaded = reloadInternalWeapon(revolver, ammoStack, 6);
  assert.equal(reloaded.weapon.ammoState.internalAmmo.currentAmmo, 6);
  assert.equal(reloaded.ammoStack.quantity, 6);

  const fired = fireWeapon(reloaded.weapon, { modeId: FIRE_MODE_IDS.SINGLE });
  assert.equal(fired.weapon.ammoState.internalAmmo.currentAmmo, 5);
});

test("rajada exige municao suficiente e municao compativel", () => {
  const weapon = {
    id: "smg-1",
    name: "Submetralhadora de Sucatas",
    category: "weapon",
    ammoState: createWeaponAmmoState({ id: "smg-1", name: "Submetralhadora de Sucatas", category: "weapon" }),
  };
  const magazine = attachMagazineToWeapon(weapon, createMagazineInstance({
    id: weapon.ammoState.compatibleMagazineTemplateIds[0],
    capacity: 30,
    acceptedAmmoKinds: [AMMO_KINDS.LIGHT],
  }, {
    id: "mag-smg",
    currentAmmo: 3,
  }));

  assert.throws(
    () => fireWeapon(magazine.weapon, { magazines: [magazine.magazine], modeId: FIRE_MODE_IDS.BURST }),
    /Municao insuficiente/
  );

  assert.throws(
    () => loadAmmoIntoMagazine(magazine.magazine, { ammoKind: AMMO_KINDS.MEDIUM, quantity: 10 }, 4),
    /incompativel/
  );
});

test("escopeta exige bombear antes do proximo disparo", () => {
  const shotgun = {
    id: "shotgun-1",
    name: "Escopeta Serrada de Sucata",
    category: "weapon",
    ammoState: createWeaponAmmoState({ name: "Escopeta Serrada de Sucata", category: "weapon" }),
  };

  const fired = fireWeapon(shotgun, { modeId: FIRE_MODE_IDS.SHOTGUN_CONE });
  assert.equal(fired.weapon.ammoState.status.needsPump, true);
  assert.throws(() => fireWeapon(fired.weapon, { modeId: FIRE_MODE_IDS.SINGLE }), /precisa ser bombeada/);

  const pumped = pumpWeapon(fired.weapon);
  assert.equal(pumped.ammoState.status.needsPump, false);
  assert.equal(fireWeapon(pumped, { modeId: FIRE_MODE_IDS.SINGLE }).weapon.ammoState.internalAmmo.currentAmmo, 0);
});

test("cubo de municao calcula unidades por pilha e carregador", () => {
  assert.equal(ammoCubeUnitsFor({ category: "ammo", ammoKind: AMMO_KINDS.LIGHT, quantity: 20 }), 1);
  assert.equal(ammoCubeUnitsFor({ category: "ammo", ammoKind: AMMO_KINDS.LIGHT, quantity: 21 }), 2);
  assert.equal(ammoCubeUnitsFor({ category: "ammo", ammoKind: AMMO_KINDS.SHELL, quantity: 9 }), 2);
  assert.equal(ammoCubeUnitsFor({ category: "magazine", quantity: 2 }), 2);
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

test("fichas antigas recebem a CA atual da armadura oficial", () => {
  const armorCatalog = [{
    id: "book5-armadura-couraca-leviata",
    name: "Couraça Leviatã",
    category: "armor",
    ca: 15,
    weight: 40,
  }];
  const legacy = {
    armor: "Couraça Leviatã",
    equippedArmorUid: "armor-instance",
    inventory: [{
      uid: "armor-instance",
      itemId: "old-couraca-id",
      category: "armor",
      name: "Couraça Leviatã",
      ca: 5,
      domainEntity: {
        id: "armor-instance",
        definitionId: "old-couraca-id",
        entityType: "armor",
        name: "Couraça Leviatã",
        weight: 40,
        definitionSnapshot: {
          id: "old-couraca-id",
          name: "Couraça Leviatã",
          ca: 5,
        },
      },
    }],
    domainCharacter: {
      inventory: [{
        id: "armor-instance",
        definitionId: "old-couraca-id",
        entityType: "armor",
        name: "Couraça Leviatã",
        weight: 40,
        definitionSnapshot: {
          id: "old-couraca-id",
          name: "Couraça Leviatã",
          ca: 5,
        },
      }],
    },
  };

  const migrated = reconcileLegacyArmorCatalog(
    legacy,
    armorCatalog,
    (armor) => ({ ...armor, entityType: "armor" })
  );

  assert.equal(migrated.inventory[0].itemId, armorCatalog[0].id);
  assert.equal(migrated.inventory[0].ca, 15);
  assert.equal(migrated.inventory[0].domainEntity.definitionSnapshot.ca, 15);
  assert.equal(migrated.domainCharacter.inventory[0].definitionSnapshot.ca, 15);
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

test("recursos do bestiário viram uma tabela de loot do comum ao raro", () => {
  const resources = "◆ Recursos coletáveis: couro, dentes, glândula rara e núcleo cósmico.";
  const names = parseMonsterLootResources(resources);
  const table = buildMonsterLootTable(resources);

  assert.deepEqual(names, ["couro", "dentes", "glândula rara", "núcleo cósmico"]);
  assert.deepEqual(table.map((item) => item.chance), [85, 63, 42, 20]);
  assert.equal(table[0].rarity, "Comum");
  assert.equal(table[3].rarity, "Exótico");
});

test("parser ignora condições e recursos ameaçados na ficha de chefe", () => {
  const resources = [
    "◆ Condicoes que aplica: Derrubado, Sangrando, Medo ou Estresse.",
    "◆ Recursos ameacados: Armaduras, coberturas e rotas de retirada.",
    "◆ Recursos coletaveis: Presa Ancestral, couro superior e glandula de dominio.",
  ].join("\n");

  assert.deepEqual(
    parseMonsterLootResources(resources),
    ["Presa Ancestral", "couro superior", "glandula de dominio"]
  );
});

test("loot de monstro é rolado ao chegar a zero PV e persiste na ficha", () => {
  const definition = new MonsterDefinition({
    id: "predador-loot",
    name: "Predador de Teste",
    maxPV: 5,
    metadata: {
      resources: "◆ Couro.\n◆ Presa rara.",
    },
  });
  const sheet = new MonsterSheet({ definition });
  const rolls = [0.1, 0, 0.9];
  const random = () => rolls.shift() ?? 0.99;

  sheet.instance.receiveDamage(5, { random });

  assert.equal(sheet.instance.currentPV, 0);
  assert.equal(sheet.instance.lootHistory.length, 1);
  assert.deepEqual(sheet.instance.lootHistory[0].drops.map((drop) => drop.name), ["Couro"]);

  const restored = MonsterSheet.fromJSON(sheet.toJSON());
  assert.equal(restored.instance.lootGeneratedForDefeat, true);
  assert.equal(restored.instance.lootHistory[0].drops[0].name, "Couro");
});

test("rolagem manual de loot respeita a chance individual", () => {
  const result = rollMonsterLoot([
    { id: "comum", name: "Couro", chance: 80, rarity: "Comum", minQuantity: 1, maxQuantity: 1 },
    { id: "raro", name: "Núcleo", chance: 20, rarity: "Raro", minQuantity: 1, maxQuantity: 1 },
  ], (() => {
    const rolls = [0.79, 0, 0.2];
    return () => rolls.shift() ?? 0.99;
  })());

  assert.deepEqual(result.attempts.map((item) => item.roll), [80, 21]);
  assert.deepEqual(result.drops.map((item) => item.name), ["Couro"]);
});
