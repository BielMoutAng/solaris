import assert from "node:assert/strict";
import test from "node:test";

import {
  AMMO_KINDS,
  FEED_SYSTEMS,
  FIRE_MODE_IDS,
  attachMagazineToCharacterWeapon,
  detachMagazineFromCharacterWeapon,
  fireCharacterWeapon,
  getCharacterAmmoSummary,
  loadMagazineFromCharacterAmmo,
  normalizeAmmoMagazine,
  normalizeAmmoStack,
  normalizeCharacterAmmoSystem,
  normalizeLoadedWeapon,
  pumpCharacterWeapon,
  reloadCharacterWeaponInternal,
} from "../src/domain/solaris-ammo-rules.js";

const rifle = {
  id: "weapon-rifle",
  name: "Rifle de Pulso",
  category: "weapon",
  ammoProfile: {
    feedSystem: FEED_SYSTEMS.DETACHABLE_MAGAZINE,
    defaultAmmoKind: AMMO_KINDS.MEDIUM,
    acceptedAmmoKinds: [AMMO_KINDS.MEDIUM],
    defaultCapacity: 5,
    fireModes: [FIRE_MODE_IDS.SINGLE],
    magazineTemplateId: "rifle-mag",
  },
};

const emptyMagazine = {
  id: "mag-rifle-1",
  name: "Carregador de Rifle",
  category: "magazine",
  templateId: "rifle-mag",
  acceptedAmmoKinds: [AMMO_KINDS.MEDIUM],
  loadedAmmoKind: AMMO_KINDS.MEDIUM,
  capacity: 5,
  currentAmmo: 0,
};

const ammoStack = {
  id: "ammo-media-1",
  name: "Municao Media",
  category: "ammo",
  ammoKind: AMMO_KINDS.MEDIUM,
  quantity: 12,
};

function baseCharacter() {
  return {
    id: "char-ammo",
    legacy: { attributes: { ESP: 14 } },
    equipment: {
      weapons: [rifle],
    },
    inventory: {
      looseItems: [emptyMagazine, ammoStack],
      cubes: [],
      credits: 0,
    },
  };
}

test("normalizeAmmoStack calcula unidades de cubo por tipo de municao", () => {
  const stack = normalizeAmmoStack({ id: "ammo-light", category: "ammo", ammoKind: "light", quantity: 21 });
  assert.equal(stack.ammoKind, AMMO_KINDS.LIGHT);
  assert.equal(stack.cubeUnits, 2);
});

test("normalizeAmmoMagazine preserva capacidade, municao atual e compatibilidade", () => {
  const magazine = normalizeAmmoMagazine(emptyMagazine);
  assert.equal(magazine.category, "magazine");
  assert.equal(magazine.capacity, 5);
  assert.equal(magazine.currentAmmo, 0);
  assert.deepEqual(magazine.acceptedAmmoKinds, [AMMO_KINDS.MEDIUM]);
});

test("normalizeLoadedWeapon identifica arma sem carregador como fonte ausente", () => {
  const weapon = normalizeLoadedWeapon(rifle, []);
  assert.equal(weapon.feedSystem, FEED_SYSTEMS.DETACHABLE_MAGAZINE);
  assert.equal(weapon.source.missing, true);
  assert.equal(weapon.canFire, false);
});

test("normalizeCharacterAmmoSystem consolida armas, carregadores e pilhas da ficha", () => {
  const normalized = normalizeCharacterAmmoSystem(baseCharacter());
  assert.equal(normalized.ammoSystem.schemaVersion, 1);
  assert.equal(normalized.ammoSystem.loadedWeapons.length, 1);
  assert.equal(normalized.ammoSystem.magazines.length, 1);
  assert.equal(normalized.ammoSystem.ammoStacks.length, 1);
  assert.equal(normalized.legacy.attributes.ESP, 14);
});

test("carregador pode ser acoplado, municiado e disparado sem consumir pilha diretamente", () => {
  const attached = attachMagazineToCharacterWeapon(baseCharacter(), "weapon-rifle", "mag-rifle-1");
  assert.equal(attached.magazine.attachedToWeaponId, "weapon-rifle");
  assert.equal(attached.weapon.ammoState.attachedMagazineId, "mag-rifle-1");

  const loaded = loadMagazineFromCharacterAmmo(attached.character, "mag-rifle-1", "ammo-media-1", 5);
  assert.equal(loaded.loaded, 5);
  assert.equal(loaded.magazine.currentAmmo, 5);
  assert.equal(loaded.ammoStack.quantity, 7);

  const fired = fireCharacterWeapon(loaded.character, "weapon-rifle", FIRE_MODE_IDS.SINGLE);
  const magazine = fired.character.ammoSystem.magazines.find((entry) => entry.id === "mag-rifle-1");
  const stack = fired.character.ammoSystem.ammoStacks.find((entry) => entry.id === "ammo-media-1");
  assert.equal(fired.consumed, 1);
  assert.equal(magazine.currentAmmo, 4);
  assert.equal(stack.quantity, 7);
});

test("remover carregador preserva a municao dentro dele", () => {
  const attached = attachMagazineToCharacterWeapon(baseCharacter(), "weapon-rifle", "mag-rifle-1");
  const loaded = loadMagazineFromCharacterAmmo(attached.character, "mag-rifle-1", "ammo-media-1", 3);
  const detached = detachMagazineFromCharacterWeapon(loaded.character, "weapon-rifle");
  const magazine = detached.character.ammoSystem.magazines.find((entry) => entry.id === "mag-rifle-1");
  const weapon = detached.character.equipment.weapons.find((entry) => entry.id === "weapon-rifle");
  assert.equal(detached.detachedMagazineId, "mag-rifle-1");
  assert.equal(magazine.currentAmmo, 3);
  assert.equal(magazine.attachedToWeaponId, "");
  assert.equal(weapon.ammoState.attachedMagazineId, "");
});

test("arma de recarga interna consome pilha e pode exigir bombear apos disparo", () => {
  const shotgun = {
    id: "weapon-shotgun",
    name: "Escopeta de Teste",
    category: "weapon",
    ammoProfile: {
      feedSystem: FEED_SYSTEMS.INTERNAL_MAGAZINE,
      defaultAmmoKind: AMMO_KINDS.SHELL,
      acceptedAmmoKinds: [AMMO_KINDS.SHELL],
      defaultCapacity: 2,
      fireModes: [FIRE_MODE_IDS.SINGLE],
      requiresPumpAfterShot: true,
    },
    ammoState: {
      feedSystem: FEED_SYSTEMS.INTERNAL_MAGAZINE,
      defaultAmmoKind: AMMO_KINDS.SHELL,
      acceptedAmmoKinds: [AMMO_KINDS.SHELL],
      fireModes: [FIRE_MODE_IDS.SINGLE],
      requiresPumpAfterShot: true,
      internalAmmo: { ammoKind: AMMO_KINDS.SHELL, currentAmmo: 0, capacity: 2 },
      status: { needsPump: false },
    },
  };
  const character = {
    equipment: { weapons: [shotgun] },
    ammoSystem: {
      ammoStacks: [{ id: "shells", category: "ammo", ammoKind: AMMO_KINDS.SHELL, quantity: 5 }],
      magazines: [],
      loadedWeapons: [],
    },
  };
  const reloaded = reloadCharacterWeaponInternal(character, "weapon-shotgun", "shells", 2);
  assert.equal(reloaded.loaded, 2);
  assert.equal(reloaded.ammoStack.quantity, 3);
  assert.equal(reloaded.weapon.ammoState.internalAmmo.currentAmmo, 2);

  const fired = fireCharacterWeapon(reloaded.character, "weapon-shotgun", FIRE_MODE_IDS.SINGLE);
  assert.equal(fired.weapon.ammoState.internalAmmo.currentAmmo, 1);
  assert.equal(fired.weapon.ammoState.status.needsPump, true);

  const pumped = pumpCharacterWeapon(fired.character, "weapon-shotgun");
  assert.equal(pumped.weapon.ammoState.status.needsPump, false);
});

test("getCharacterAmmoSummary resume armas, carregadores e municao", () => {
  const summary = getCharacterAmmoSummary(baseCharacter());
  assert.equal(summary.weapons, 1);
  assert.equal(summary.magazines, 1);
  assert.equal(summary.ammoStacks, 1);
  assert.equal(summary.totalLooseAmmo, 12);
  assert.equal(summary.missingMagazineWeapons, 1);
});
