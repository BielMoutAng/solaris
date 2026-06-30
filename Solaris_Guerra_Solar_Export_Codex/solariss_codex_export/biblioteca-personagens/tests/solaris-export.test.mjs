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
      damage: "1d10+2",
      crackLevel: 1,
      location: { kind: "equipped", slotId: "mainWeapon" },
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
  assert.equal(exported.attributes.esp, 10);
  assert.equal(exported.derived.pv.max, 20);
  assert.equal(exported.inventory.credits, 350);
  assert.equal(exported.equipment.weapons.length, 1);
  assert.equal(exported.equipment.armor.durability.cracks, 2);
  assert.equal(exported.abilities[0].schema, SOLARIS_ITEM_SCHEMA);
});

test("importSolarisCharacter hydrates official schema back into legacy-compatible data", () => {
  const exported = exportSolarisCharacter(sampleCharacter);
  const imported = importSolarisCharacter(JSON.stringify(exported));
  assert.equal(imported.schema, SOLARIS_CHARACTER_SCHEMA);
  assert.equal(imported.character.name, "Lyssara Kalar");
  assert.equal(imported.character.attributes.REF, 11);
  assert.equal(imported.character.pvCurrent, 18);
  assert.equal(imported.character.inventory.length, 2);
});

test("createSolarisExportBundle creates versioned bundle", () => {
  const bundle = createSolarisExportBundle({ character: sampleCharacter, items: [{ id: "vela", name: "Vela", type: "utility" }] });
  assert.equal(bundle.schema, SOLARIS_EXPORT_BUNDLE_SCHEMA);
  assert.equal(bundle.characters.length, 1);
  assert.equal(bundle.items.length, 1);
});

test("exportFoundryDraft maps Solaris character to draft actor and items", () => {
  const draft = exportFoundryDraft(sampleCharacter);
  assert.equal(draft.schema, SOLARIS_FOUNDRY_DRAFT_SCHEMA);
  assert.equal(draft.actors.length, 1);
  assert.equal(draft.actors[0].type, "character");
  assert.equal(draft.actors[0].system.identity.name, "Lyssara Kalar");
  assert.ok(draft.items.some((item) => item.type === "weapon"));
  assert.ok(draft.mappingNotes.some((note) => note.includes("Biblioteca Solaris")));
});
