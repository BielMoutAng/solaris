import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  CURRENT_OFFICIAL_BOOKS,
  loadGlobalScript,
  projectRootFromHere,
} from "../scripts/audit-official-sources.mjs";

import {
  AMMO_KINDS,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_SCHEMA_VERSION,
  EQUIPMENT_TIERS,
  ITEM_STORAGE_TYPES,
  WEAPON_CATEGORIES,
  applyEquipmentCrack,
  applyEmergencyRepair,
  applyJammed,
  checkEquipmentBroken,
  checkModCompatibility,
  checkStorageCompatibility,
  checkWeaponJammed,
  clearJammedOutsideCombat,
  computeArmorProfile,
  computeBuyTransaction,
  computeCraftingRecipe,
  computeEquipmentCrackPenalty,
  computeItemStorageCost,
  computeModEffects,
  computeSaleValue,
  computeUpgradeTierCost,
  computeWeaponAttackProfile,
  computeWeaponDamageProfile,
  createEquipmentState,
  hydrateEquipmentState,
  installEquipmentMod,
  normalizeAmmoEntry,
  normalizeArmorEntry,
  normalizeEquipmentEntry,
  normalizeMagazineEntry,
  normalizeModEntry,
  normalizeWeaponEntry,
  removeEquipmentMod,
  repairEquipmentCrack,
  resolveCraftingAttempt,
  serializeEquipmentState,
  validateCraftingAttempt,
} from "../src/domain/solaris-equipment-rules.js";

const root = projectRootFromHere();

function book5() {
  return loadGlobalScript(path.join(root, "official-book5-catalog.js"), "SOLARIS_OFFICIAL_BOOK5");
}

function officialWeapon(namePart) {
  const key = String(namePart || "").toLowerCase();
  return book5().catalog.weapons.find((weapon) => String(weapon.name || "").toLowerCase().includes(key));
}

function officialArmor(namePart) {
  const key = String(namePart || "").toLowerCase();
  return book5().catalog.armors.find((armor) => String(armor.name || "").toLowerCase().includes(key));
}

test("Fase 23 exporta schema, tiers e categorias oficiais sem sniper", () => {
  assert.equal(EQUIPMENT_SCHEMA_VERSION, 1);
  assert.deepEqual(EQUIPMENT_TIERS, ["F", "E", "D", "C", "B", "A", "S"]);
  assert.equal(EQUIPMENT_CATEGORIES.WEAPON, "weapon");
  assert.ok(WEAPON_CATEGORIES.includes("rifle de precisao"));
  assert.equal(WEAPON_CATEGORIES.includes("sniper"), false);
});

test("catalogo oficial do Livro 5 atual possui secoes mecanicas esperadas", () => {
  const data = book5();
  assert.equal(data.sourceFileCurrent, CURRENT_OFFICIAL_BOOKS.book5.fileName);
  assert.equal(data.cubeWeightKg, 1);
  assert.ok(data.catalog.weapons.length >= 30);
  assert.ok(data.catalog.armors.length >= 20);
  assert.ok(data.catalog.items.length >= 200);
  assert.ok(data.catalog.storage.length >= 30);
  assert.ok(data.catalog.cubes.length >= 10);
});

test("normaliza entrada generica mantendo governanca oficial", () => {
  const item = normalizeEquipmentEntry(book5().catalog.items[0]);
  assert.equal(item.schemaVersion, EQUIPMENT_SCHEMA_VERSION);
  assert.equal(item.sourceFileCurrent, CURRENT_OFFICIAL_BOOKS.book5.fileName);
  assert.ok(item.id);
  assert.ok(item.name);
});

test("normaliza primeira arma oficial com ataque, dano, alcance e municao", () => {
  const weapon = normalizeWeaponEntry(book5().catalog.weapons[0]);
  assert.equal(weapon.category, "weapon");
  assert.equal(weapon.attackAttribute, "REF");
  assert.equal(weapon.damageDice.count, 1);
  assert.equal(weapon.ammoKind, AMMO_KINDS.LIGHT);
  assert.ok(weapon.rangeMeters >= 0);
});

test("categoria legado sniper vira rifle de precisao sem espalhar termo antigo", () => {
  const weapon = normalizeWeaponEntry({ name: "Olho de NYX", category: "weapon", type: "sniper", damage: "2d8 perfurante" });
  assert.equal(weapon.weaponCategory, "rifle de precisao");
});

test("punhos usam Briga, FOR e dano 1d4 + MOD FOR concussao", () => {
  const damage = computeWeaponDamageProfile({ name: "Punhos", category: "weapon", type: "punhos" }, { attributes: { FOR: 14 } });
  const attack = computeWeaponAttackProfile({ name: "Punhos", category: "weapon", type: "punhos" }, { attributes: { FOR: 14 } });
  assert.equal(attack.attribute, "FOR");
  assert.equal(attack.skill, "Briga");
  assert.equal(damage.diceCount, 1);
  assert.equal(damage.dieSize, 4);
  assert.equal(damage.fixedBonus, 2);
  assert.equal(damage.damageType, "concussao");
});

test("Manopla de Kuldrus usa 1d4 + 1 + MOD FOR", () => {
  const damage = computeWeaponDamageProfile({ name: "Manopla de Kuldrus", category: "weapon", type: "manopla", damage: "1d4 concussao" }, { attributes: { FOR: 16 } });
  assert.equal(damage.fixedBonus, 4);
  assert.equal(damage.formula, "1d4+4");
});

test("perfil de ataque soma modificador de atributo e passivo de ataque", () => {
  const weapon = normalizeWeaponEntry({ name: "Pistola", category: "weapon", type: "pistola", attack: "REF", damage: "1d6 balistico", ammo: "Leve", capacity: "6 / tiro unico" });
  const profile = computeWeaponAttackProfile({ ...weapon, passiveAttackBonus: 1 }, { attributes: { REF: 14 }, passiveAttackBonus: 2 });
  assert.equal(profile.modifier, 2);
  assert.equal(profile.totalBonus, 5);
  assert.equal(profile.canAttack, true);
});

test("arma Jammed bloqueia perfil de ataque", () => {
  const profile = computeWeaponAttackProfile({ name: "Rifle", category: "weapon", type: "rifle", damage: "1d8", jammed: true });
  assert.equal(profile.canAttack, false);
  assert.match(profile.blockReason, /Jammed/);
});

test("arma com municao interna zerada bloqueia disparo", () => {
  const weapon = normalizeWeaponEntry({ name: "Pistola vazia", category: "weapon", type: "pistola", damage: "1d6", ammo: "Leve", capacity: "6 / tiro unico" });
  weapon.ammoState.internalAmmo.currentAmmo = 0;
  const profile = computeWeaponAttackProfile(weapon);
  assert.equal(profile.canAttack, false);
  assert.match(profile.blockReason, /Sem municao/);
});

test("armadura oficial normaliza CA e categoria", () => {
  const armor = normalizeArmorEntry(officialArmor("jaqueta") || book5().catalog.armors[0]);
  assert.equal(armor.category, "armor");
  assert.ok(armor.caBonus >= 0);
});

test("perfil de armadura aplica penalidade de rachadura em CA", () => {
  const armor = normalizeArmorEntry({ name: "Colete", category: "armor", type: "media", ca: 5, cracks: 4 });
  const profile = computeArmorProfile(armor, { baseCa: 4 });
  assert.equal(profile.effectiveCaBonus, 4);
  assert.equal(profile.totalCa, 8);
});

test("cinco rachaduras deixam equipamento inutilizavel", () => {
  const weapon = applyEquipmentCrack({ name: "Rifle", category: "weapon", cracks: 4 }, 1);
  assert.equal(weapon.cracks, 5);
  assert.equal(checkEquipmentBroken(weapon), true);
  assert.equal(computeEquipmentCrackPenalty(weapon).unusable, true);
});

test("reparo reduz rachadura e atualiza estado", () => {
  const repaired = repairEquipmentCrack({ name: "Rifle", category: "weapon", cracks: 3 }, 1);
  assert.equal(repaired.cracks, 2);
  assert.equal(repaired.unusable, false);
});

test("reparo emergencial reduz rachadura efetiva temporariamente", () => {
  const repaired = applyEmergencyRepair({ name: "Armadura", category: "armor", cracks: 4 }, { temporaryReduction: 2 });
  assert.equal(repaired.effectiveCracks, 2);
  assert.equal(repaired.emergencyRepair.active, true);
});

test("Jammed pode ser aplicado e limpo fora de combate", () => {
  const jammed = applyJammed({ name: "Pistola", category: "weapon", type: "pistola", ammo: "Leve", capacity: "8" }, "teste");
  assert.equal(checkWeaponJammed(jammed), true);
  const cleared = clearJammedOutsideCombat(jammed);
  assert.equal(checkWeaponJammed(cleared), false);
});

test("normaliza mod com custo de slot e alvo", () => {
  const mod = normalizeModEntry({ name: "Mira", category: "mod", targetTypes: ["weapon"], slotCost: 2 });
  assert.equal(mod.category, "mod");
  assert.equal(mod.slotCost, 2);
  assert.deepEqual(mod.targetTypes, ["weapon"]);
});

test("mod de arma e compativel com arma com slot livre", () => {
  const compatibility = checkModCompatibility({ name: "Rifle", category: "weapon", modSlots: 2 }, { name: "Mira", category: "mod", targetTypes: ["weapon"], slotCost: 1 });
  assert.equal(compatibility.compatible, true);
});

test("mod de armadura nao instala em arma", () => {
  const compatibility = checkModCompatibility({ name: "Rifle", category: "weapon", modSlots: 2 }, { name: "Placa", category: "mod", targetTypes: ["armor"], slotCost: 1 });
  assert.equal(compatibility.compatible, false);
});

test("mod respeita limite de slots", () => {
  const compatibility = checkModCompatibility({ name: "Rifle", category: "weapon", modSlots: 1 }, { name: "Mira Pesada", category: "mod", targetTypes: ["weapon"], slotCost: 2 });
  assert.equal(compatibility.compatible, false);
  assert.match(compatibility.reason, /espaco/);
});

test("instalar e remover mod atualiza slots usados", () => {
  const installed = installEquipmentMod({ name: "Rifle", category: "weapon", modSlots: 2 }, { id: "mira", name: "Mira", category: "mod", targetTypes: ["weapon"], slotCost: 1 });
  assert.equal(installed.installed, true);
  assert.equal(installed.equipment.modSlotsUsed, 1);
  const removed = removeEquipmentMod(installed.equipment, "mira");
  assert.equal(removed.modSlotsUsed, 0);
});

test("efeitos passivos de mods somam ataque, dano e CA", () => {
  const totals = computeModEffects([
    { name: "Mira", category: "mod", passiveEffects: { attackBonus: 1 } },
    { name: "Punho pesado", category: "mod", description: "+2 em dano" },
    { name: "Placa", category: "mod", passiveEffects: { caBonus: 1 } },
  ]);
  assert.equal(totals.attackBonus, 1);
  assert.equal(totals.damageBonus, 2);
  assert.equal(totals.caBonus, 1);
});

test("custo de armazenamento reconhece municao por unidade de cubo", () => {
  const ammo = normalizeAmmoEntry({ name: "Municao leve", category: "ammo", ammoKind: "light", quantity: 21 });
  assert.equal(ammo.cubeUnits, 2);
  assert.equal(computeItemStorageCost(ammo), 2);
});

test("carregador e normalizado como item de municao armazenavel", () => {
  const magazine = normalizeMagazineEntry({ name: "Carregador leve", category: "magazine", acceptedAmmoKinds: ["light"], capacity: 8, currentAmmo: 8 });
  assert.equal(magazine.category, "magazine");
  assert.equal(magazine.cubeUnits, 1);
});

test("cubo simples respeita capacidade", () => {
  const result = checkStorageCompatibility({ name: "Cubo Simples", storageType: ITEM_STORAGE_TYPES.CUBE_SIMPLE, capacity: 1 }, { name: "Vela", category: "item" }, [{ name: "Tocha", category: "item" }]);
  assert.equal(result.allowed, false);
});

test("cubo de carga aceita apenas o mesmo item exato do primeiro conteudo", () => {
  const first = { id: "granada-luz", name: "Granada de Luz", category: "item", family: "granada" };
  assert.equal(checkStorageCompatibility({ name: "Cubo de Carga", storageType: ITEM_STORAGE_TYPES.CUBE_CARGO, capacity: 5 }, first, [first]).allowed, true);
  assert.equal(checkStorageCompatibility({ name: "Cubo de Carga", storageType: ITEM_STORAGE_TYPES.CUBE_CARGO, capacity: 5 }, { id: "granada-fumaca", name: "Granada de Fumaca", category: "item", family: "granada" }, [first]).allowed, false);
});

test("cubo especializado aceita familia do primeiro item", () => {
  const first = { id: "granada-luz", name: "Granada de Luz", category: "item", family: "granada" };
  const second = { id: "granada-fumaca", name: "Granada de Fumaca", category: "item", family: "granada" };
  assert.equal(checkStorageCompatibility({ name: "Cubo Especializado", storageType: ITEM_STORAGE_TYPES.CUBE_SPECIALIZED, capacity: 5 }, second, [first]).allowed, true);
});

test("cubo de municao aceita ammo e rejeita item comum", () => {
  const storage = { name: "Cubo de Municao", storageType: ITEM_STORAGE_TYPES.CUBE_AMMO, capacity: 5 };
  assert.equal(checkStorageCompatibility(storage, { name: "Municao leve", category: "ammo", ammoKind: "light", quantity: 10 }).allowed, true);
  assert.equal(checkStorageCompatibility(storage, { name: "Vela", category: "item" }).allowed, false);
});

test("mochila aceita item pequeno ate 10 Kg", () => {
  const ok = checkStorageCompatibility({ name: "Mochila", storageType: ITEM_STORAGE_TYPES.BACKPACK, maxWeightKg: 10 }, { name: "Kit", category: "item", inventorySize: "small", weightKg: 2 }, []);
  const heavy = checkStorageCompatibility({ name: "Mochila", storageType: ITEM_STORAGE_TYPES.BACKPACK, maxWeightKg: 10 }, { name: "Caixa", category: "item", inventorySize: "small", weightKg: 11 }, []);
  assert.equal(ok.allowed, true);
  assert.equal(heavy.allowed, false);
});

test("coldre aceita arma pequena e rejeita rifle", () => {
  const holster = { name: "Coldre", storageType: ITEM_STORAGE_TYPES.HOLSTER, capacity: 1 };
  assert.equal(checkStorageCompatibility(holster, { name: "Pistola", category: "weapon", type: "pistola", inventorySize: "small" }).allowed, true);
  assert.equal(checkStorageCompatibility(holster, { name: "Rifle", category: "weapon", type: "rifle", inventorySize: "large" }).allowed, false);
});

test("bandoleira aceita itens medios e grandes", () => {
  const result = checkStorageCompatibility({ name: "Bandoleira", storageType: ITEM_STORAGE_TYPES.BANDOLIER, capacity: 3 }, { name: "Rifle", category: "weapon", type: "rifle", inventorySize: "large" }, []);
  assert.equal(result.allowed, true);
});

test("gancho aceita item de acesso rapido", () => {
  const result = checkStorageCompatibility({ name: "Gancho", storageType: ITEM_STORAGE_TYPES.HOOK }, { name: "Granada", category: "item", quickAccess: true }, []);
  assert.equal(result.allowed, true);
});

test("item sem local definido e aviso visual, nao bloqueio de rolagem", () => {
  const result = checkStorageCompatibility({ storageType: ITEM_STORAGE_TYPES.UNASSIGNED }, { name: "Vela", category: "item" }, []);
  assert.equal(result.allowed, true);
  assert.match(result.reason, /nao bloqueia rolagens/);
});

test("compra debita Luzentis quando ha saldo", () => {
  const tx = computeBuyTransaction({ characterCurrency: 1000, item: { name: "Vela", category: "item", price: 100 }, quantity: 3 });
  assert.equal(tx.allowed, true);
  assert.equal(tx.totalCost, 300);
  assert.equal(tx.afterCurrency, 700);
});

test("compra sem saldo falha sem debitar", () => {
  const tx = computeBuyTransaction({ characterCurrency: 50, item: { name: "Vela", category: "item", price: 100 } });
  assert.equal(tx.allowed, false);
  assert.equal(tx.afterCurrency, 50);
});

test("equipamento inicial pode entrar sem debitar Luzentis", () => {
  const tx = computeBuyTransaction({ characterCurrency: 0, item: { name: "Pistola inicial", category: "weapon", price: 5000 }, isInitial: true });
  assert.equal(tx.allowed, true);
  assert.equal(tx.totalCost, 0);
});

test("valor de venda e editavel e padrao usa metade do preco", () => {
  const normal = computeSaleValue({ name: "Rifle", category: "weapon", price: 1000 });
  const edited = computeSaleValue({ name: "Rifle", category: "weapon", price: 1000 }, { saleValue: 700 });
  assert.equal(normal.saleValue, 500);
  assert.equal(edited.saleValue, 700);
  assert.equal(edited.editable, true);
});

test("receita de crafting normaliza resultado e CD", () => {
  const recipe = computeCraftingRecipe({ name: "Forjar lamina", difficulty: 15, materials: { ferro: 2 }, result: { name: "Lamina", category: "weapon", price: 100 } });
  assert.equal(recipe.difficulty, 15);
  assert.equal(recipe.result.name, "Lamina");
});

test("validacao de crafting detecta materiais e ferramentas faltantes", () => {
  const result = validateCraftingAttempt({ recipe: { materials: { ferro: 2 }, tools: ["Oficina"] }, materials: { ferro: 1 }, tools: [] });
  assert.equal(result.valid, false);
  assert.equal(result.missingMaterials.length, 1);
  assert.equal(result.missingTools.length, 1);
});

test("crafting com sucesso cria item e consome recursos", () => {
  const result = resolveCraftingAttempt({
    recipe: { difficulty: 12, materials: { ferro: 2 }, cost: 50, result: { name: "Lamina", category: "weapon" } },
    materials: { ferro: 3 },
    currency: 100,
    roll: 12,
  });
  assert.equal(result.successLevel, "success");
  assert.equal(result.item.name, "Lamina");
  assert.equal(result.materials.ferro, 1);
  assert.equal(result.currency, 50);
});

test("crafting com falha nao cria item", () => {
  const result = resolveCraftingAttempt({
    recipe: { difficulty: 20, materials: { ferro: 1 }, result: { name: "Lamina", category: "weapon" } },
    materials: { ferro: 1 },
    roll: 3,
  });
  assert.equal(result.successLevel, "failure");
  assert.equal(result.item, null);
});

test("custo de upgrade cresce por distancia de tier", () => {
  assert.ok(computeUpgradeTierCost("F", "D") > computeUpgradeTierCost("F", "E"));
  assert.equal(computeUpgradeTierCost("A", "F"), 0);
});

test("estado de equipamento serializa e hidrata preservando inventario e mods", () => {
  const state = createEquipmentState({
    inventory: [{ name: "Pistola", category: "weapon", type: "pistola", damage: "1d6", ammo: "Leve", capacity: "8" }],
    installedMods: [{ name: "Mira", category: "mod", targetTypes: ["weapon"] }],
  });
  const restored = hydrateEquipmentState(serializeEquipmentState(state));
  assert.equal(restored.schemaVersion, EQUIPMENT_SCHEMA_VERSION);
  assert.equal(restored.inventory.length, 1);
  assert.equal(restored.installedMods.length, 1);
});

test("estado de equipamento contempla cubos, mochilas, coldres, bandoleiras e ganchos", () => {
  const state = createEquipmentState({
    cubes: [{ name: "Cubo Simples", category: "cube" }],
    backpacks: [{ name: "Mochila" }],
    holsters: [{ name: "Coldre" }],
    bandoliers: [{ name: "Bandoleira" }],
    hooks: [{ name: "Gancho" }],
  });
  assert.equal(state.cubes.length, 1);
  assert.equal(state.backpacks.length, 1);
  assert.equal(state.holsters.length, 1);
  assert.equal(state.bandoliers.length, 1);
  assert.equal(state.hooks.length, 1);
});

test("Rifle de precisao oficial pode ser normalizado quando existir no catalogo", () => {
  const entry = officialWeapon("rifle") || book5().catalog.weapons[0];
  const weapon = normalizeWeaponEntry(entry);
  assert.equal(weapon.category, "weapon");
  assert.ok(weapon.damageFormula);
  assert.notEqual(weapon.weaponCategory, "sniper");
});
