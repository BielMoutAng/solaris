import assert from "node:assert/strict";
import test from "node:test";

import {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
  SOLARIS_FOUNDRY_DRAFT_SCHEMA,
  SOLARIS_ITEM_SCHEMA,
  validateBasicCharacterShape,
  validateBasicItemShape,
} from "../src/schemas/solaris-schemas.js";
import {
  createSolarisExportBundle,
  exportSolarisCharacter,
  normalizeSolarisItemForExport,
} from "../src/export/solaris-export-core.js";
import {
  importSolarisCharacter,
} from "../src/export/solaris-import-core.js";
import {
  exportFoundryDraft,
} from "../src/export/solaris-foundry-export.js";

const sampleCharacter = {
  id: "char-lyssara",
  createdWithVersion: "0.6.0-alpha.27",
  createdAt: "2026-06-30T00:00:00.000Z",
  name: "Lyssara Kalar",
  player: "Gabriel",
  race: "humanis",
  profession: "guardiao",
  level: 3,
  experience: 3200,
  origin: "Colonia Solaris",
  attributes: { FOR: 8, REF: 11, CON: 9, MEN: 10, PRE: 7, INT: 12 },
  pvCurrent: 18,
  cosmosCurrent: 4,
  stress: 2,
  currency: 350,
  equippedWeaponUid: "inv-rifle",
  equippedArmorUid: "inv-armor",
  inventory: [
    {
      uid: "inv-rifle",
      itemId: "rifle-pulso",
      name: "Rifle de Pulso",
      category: "weapon",
      ammoProfile: {
        feedSystem: "detachable-magazine",
        defaultAmmoKind: "medium",
        acceptedAmmoKinds: ["medium"],
        defaultCapacity: 5,
        fireModes: ["single"],
        magazineTemplateId: "rifle-pulso-mag",
      },
      ammoState: {
        feedSystem: "detachable-magazine",
        defaultAmmoKind: "medium",
        acceptedAmmoKinds: ["medium"],
        attachedMagazineId: "inv-mag",
        fireModes: ["single"],
      },
      damage: "1d10+2",
      crackLevel: 1,
      location: { kind: "equipped", slotId: "mainWeapon" },
    },
    {
      uid: "inv-mag",
      itemId: "rifle-pulso-mag",
      name: "Carregador de Rifle",
      category: "magazine",
      templateId: "rifle-pulso-mag",
      acceptedAmmoKinds: ["medium"],
      loadedAmmoKind: "medium",
      capacity: 5,
      currentAmmo: 4,
      location: { kind: "loose" },
    },
    {
      uid: "inv-ammo",
      itemId: "municao-media",
      name: "Municao Media",
      category: "ammo",
      ammoKind: "medium",
      quantity: 10,
      location: { kind: "loose" },
    },
    {
      uid: "inv-armor",
      itemId: "armadura-media",
      name: "Armadura Media",
      category: "armor",
      crackLevel: 2,
      location: { kind: "equipped", slotId: "armor" },
    },
  ],
  knownAbilities: [
    { id: "pulso-eter", name: "Pulso de Eter", source: "Cosmos", effect: "Teste cosmico." },
  ],
  exportContext: {
    raceName: "Humanis",
    professionName: "Guardiao",
    derived: {
      pvMax: 20,
      cosmosMax: 6,
      stressMax: 6,
      ca: 7,
      movement: 4,
      baseDice: "3d6",
      cubeSlots: 4,
    },
  },
};

test("schema validators identify Solaris character and item shapes", () => {
  const item = normalizeSolarisItemForExport({ uid: "i1", name: "Kit de Cura", category: "consumable" });
  assert.equal(item.schema, SOLARIS_ITEM_SCHEMA);
  assert.equal(validateBasicItemShape(item).ok, true);

  const character = exportSolarisCharacter(sampleCharacter);
  assert.equal(character.schema, SOLARIS_CHARACTER_SCHEMA);
  assert.equal(validateBasicCharacterShape(character).ok, true);
});

test("exportSolarisCharacter serializes legacy Biblioteca character into official schema", () => {
  const exported = exportSolarisCharacter(sampleCharacter);
  assert.equal(exported.identity.name, "Lyssara Kalar");
  assert.equal(exported.attributes.ref, 11);
  assert.equal(exported.attributes.men, 10);
  assert.equal(Object.hasOwn(exported.attributes, "esp"), false);
  assert.equal(exported.resources.pv.max, 20);
  assert.equal(exported.resources.stress.max, 6);
  assert.equal(exported.resources.cosmos.max, 6);
  assert.equal(exported.derived.pv.max, 20);
  assert.equal(exported.derived.initiative, 0);
  assert.equal(exported.inventory.credits, 350);
  assert.equal(exported.equipment.weapons.length, 1);
  assert.equal(exported.equipment.armor.durability.cracks, 2);
  assert.equal(exported.ammoSystem.loadedWeapons.length, 1);
  assert.equal(exported.ammoSystem.magazines[0].currentAmmo, 4);
  assert.equal(exported.ammoSystem.ammoStacks[0].quantity, 10);
  assert.equal(exported.abilities[0].schema, SOLARIS_ITEM_SCHEMA);
});

test("exportSolarisCharacter preserves legacy ESP without making it official", () => {
  const exported = exportSolarisCharacter({
    ...sampleCharacter,
    attributes: { FOR: 8, REF: 11, CON: 9, ESP: 13, PRE: 7, INT: 12 },
  });
  assert.equal(exported.attributes.men, 0);
  assert.equal(Object.hasOwn(exported.attributes, "esp"), false);
  assert.equal(exported.legacy.attributes.ESP, 13);
  assert.ok(exported.migration.warnings.includes("legacy-esp-preserved-without-men-migration"));
});

test("importSolarisCharacter hydrates official schema back into legacy-compatible data", () => {
  const exported = exportSolarisCharacter(sampleCharacter);
  const imported = importSolarisCharacter(JSON.stringify(exported));
  assert.equal(imported.ok, true);
  assert.equal(imported.schema, SOLARIS_CHARACTER_SCHEMA);
  assert.equal(imported.character.name, "Lyssara Kalar");
  assert.equal(imported.character.attributes.REF, 11);
  assert.equal(imported.character.pvCurrent, 18);
  assert.equal(imported.character.inventory.length, 4);
  assert.ok(imported.character.inventory.some((entry) => entry.uid === "inv-mag"));
  assert.ok(imported.character.inventory.some((entry) => entry.uid === "inv-ammo"));
});

test("importSolarisCharacter returns structured error for invalid JSON", () => {
  const imported = importSolarisCharacter("{");
  assert.equal(imported.ok, false);
  assert.equal(imported.character, null);
  assert.ok(imported.errors[0].includes("JSON invalido"));
});

test("importSolarisCharacter does not migrate legacy ESP to MEN automatically", () => {
  const imported = importSolarisCharacter(JSON.stringify({
    schema: SOLARIS_CHARACTER_SCHEMA,
    id: "char-legacy-esp",
    meta: { saveVersion: 1, appVersion: "0.6.0-alpha.27" },
    identity: { name: "Ficha antiga", level: 1 },
    attributes: { for: 7, ref: 7, con: 7, int: 7, pre: 7, esp: 14 },
    resources: {
      pv: { value: 1, max: 2 },
      stress: { value: 3, max: 7 },
      cosmos: { value: 4, max: 5 },
    },
    derived: {},
    inventory: {},
    abilities: [],
    notes: {},
  }));
  assert.equal(imported.character.attributes.MEN, 7);
  assert.equal(imported.character.resources.cosmos.value, 4);
  assert.ok(imported.warnings.some((warning) => warning.includes("ESP legado")));
});

test("createSolarisExportBundle creates versioned bundle", () => {
  const bundle = createSolarisExportBundle({ character: sampleCharacter });
  assert.equal(bundle.schema, SOLARIS_EXPORT_BUNDLE_SCHEMA);
  assert.equal(bundle.validation.ok, true);
  assert.equal(bundle.type, "character");
  assert.equal(bundle.payload.character.schema, SOLARIS_CHARACTER_SCHEMA);
  assert.equal(bundle.payload.characters.length, 1);
  assert.equal(bundle.characters.length, 1);
  assert.equal(bundle.items.length, 0);
});

test("createSolarisExportBundle warns for unknown bundle type", () => {
  const bundle = createSolarisExportBundle({ character: sampleCharacter }, { type: "misterioso" });
  assert.equal(bundle.validation.ok, true);
  assert.ok(bundle.warnings.some((warning) => warning.includes("misterioso")));
});

test("exportFoundryDraft maps Solaris character to draft actor and items", () => {
  const draft = exportFoundryDraft(sampleCharacter);
  assert.equal(draft.schema, SOLARIS_FOUNDRY_DRAFT_SCHEMA);
  assert.equal(draft.validation.ok, true);
  assert.equal(draft.actor.type, "character");
  assert.equal(draft.actor.system.attributes.men, 10);
  assert.equal(Object.hasOwn(draft.actor.system.attributes, "esp"), false);
  assert.equal(draft.actor.system.resources.cosmos.max, 6);
  assert.equal(draft.flags.solaris.originalCharacter.schema, SOLARIS_CHARACTER_SCHEMA);
  assert.equal(draft.actors.length, 1);
  assert.equal(draft.actors[0].type, "character");
  assert.equal(draft.actors[0].system.identity.name, "Lyssara Kalar");
  assert.ok(draft.items.some((item) => item.type === "weapon"));
  assert.ok(draft.items.some((item) => item.system.ammo?.kind === "weapon-ammo"));
  assert.equal(draft.actor.system.ammoSystem.magazines[0].currentAmmo, 4);
  assert.ok(draft.mappingNotes.some((note) => note.includes("Biblioteca Solaris")));
});
