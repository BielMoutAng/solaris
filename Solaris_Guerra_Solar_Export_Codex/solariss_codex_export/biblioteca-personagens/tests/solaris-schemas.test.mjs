import assert from "node:assert/strict";
import test from "node:test";

import {
  CURRENT_SOLARIS_SAVE_VERSION,
  SOLARIS_CAMPAIGN_SCHEMA,
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_CREATURE_SCHEMA,
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
  SOLARIS_FOUNDRY_DRAFT_SCHEMA,
  SOLARIS_ITEM_SCHEMA,
  SOLARIS_OFFICIAL_ATTRIBUTES,
  createValidationResult,
  hasAnySchema,
  hasSchema,
  isNonEmptyString,
  isNumberLike,
  isObject,
  validateCharacterAttributes,
  validateCharacterResources,
  validateBasicCampaignShape,
  validateBasicCharacterShape,
  validateBasicCreatureShape,
  validateBasicExportBundleShape,
  validateBasicFoundryDraftShape,
  validateBasicItemShape,
} from "../src/schemas/solaris-schemas.js";

const minimalCharacter = {
  schema: SOLARIS_CHARACTER_SCHEMA,
  id: "char-1",
  meta: { saveVersion: CURRENT_SOLARIS_SAVE_VERSION, appVersion: "test" },
  identity: { name: "", race: "", origin: "", profession: "", level: 1, portrait: null },
  attributes: { for: 7, ref: 7, con: 7, int: 7, pre: 7, men: 7 },
  resources: {
    pv: { value: 8, max: 8 },
    stress: { value: 0, max: 7 },
    cosmos: { value: 0, max: 0 },
  },
  derived: { ca: 2, movement: 4, baseDice: "3d6", initiative: 0 },
  skills: { trained: [], focus: [], professionSkills: [], ignorant: [] },
  combat: { conditions: [], damageResistances: [], damageWeaknesses: [], activeEffects: [] },
  equipment: { armor: null, weapons: [], activeWeaponId: null, equippedItems: [], hooks: [], holsters: [], bandoliers: [] },
  inventory: { looseItems: [], cubes: [], credits: 0, allItems: [], unassigned: [] },
  ammoSystem: { magazines: [], ammoStacks: [], loadedWeapons: [] },
  abilities: [],
  notes: { background: "", appearance: "", personality: "", campaignNotes: "" },
  migration: { fromLegacy: false, warnings: [] },
  legacy: {},
};

test("schema constants and utility validators are available", () => {
  assert.equal(CURRENT_SOLARIS_SAVE_VERSION, 1);
  assert.equal(SOLARIS_CHARACTER_SCHEMA, "solaris-character-v1");
  assert.equal(SOLARIS_ITEM_SCHEMA, "solaris-item-v1");
  assert.equal(SOLARIS_CREATURE_SCHEMA, "solaris-creature-v1");
  assert.equal(SOLARIS_CAMPAIGN_SCHEMA, "solaris-campaign-v1");
  assert.equal(SOLARIS_EXPORT_BUNDLE_SCHEMA, "solaris-export-bundle-v1");
  assert.equal(SOLARIS_FOUNDRY_DRAFT_SCHEMA, "solaris-foundry-draft-v1");
  assert.deepEqual(SOLARIS_OFFICIAL_ATTRIBUTES, ["for", "ref", "con", "int", "pre", "men"]);
  assert.equal(isObject({}), true);
  assert.equal(isNonEmptyString("Solaris"), true);
  assert.equal(isNumberLike("7"), true);
  assert.equal(hasSchema(minimalCharacter, SOLARIS_CHARACTER_SCHEMA), true);
  assert.equal(hasAnySchema(minimalCharacter, [SOLARIS_ITEM_SCHEMA, SOLARIS_CHARACTER_SCHEMA]), true);
  assert.deepEqual(createValidationResult(true), { valid: true, ok: true, errors: [], warnings: [] });
});

test("validateBasicCharacterShape accepts MEN and does not require ESP", () => {
  const result = validateBasicCharacterShape(minimalCharacter);
  assert.equal(result.ok, true);
  assert.equal(result.valid, true);
});

test("validateCharacterAttributes accepts official attributes and warns for ESP", () => {
  assert.equal(validateCharacterAttributes({ for: 7, ref: 7, con: 7, int: 7, pre: 7, men: 7 }).ok, true);
  const legacy = validateCharacterAttributes({ for: 7, ref: 7, con: 7, int: 7, pre: 7, men: 7, esp: 12 });
  assert.equal(legacy.ok, true);
  assert.ok(legacy.warnings.some((warning) => warning.includes("esp")));
});

test("validateCharacterResources accepts PV, Estresse and Cosmos", () => {
  const result = validateCharacterResources({
    pv: { value: 8, max: 10 },
    stress: { value: 1, max: 7 },
    cosmos: { value: 2, max: 5 },
  });
  assert.equal(result.ok, true);
});

test("validateBasicCharacterShape rejects wrong schema", () => {
  const result = validateBasicCharacterShape({ ...minimalCharacter, schema: "old-schema" });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /solaris-character-v1/);
});

test("validateBasicCharacterShape warns when legacy ESP appears", () => {
  const result = validateBasicCharacterShape({
    ...minimalCharacter,
    attributes: { ...minimalCharacter.attributes, esp: 12 },
  });
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((warning) => warning.includes("ESP") || warning.includes("esp")));
});

test("validateBasicCharacterShape warns if Cosmos is placed as an attribute", () => {
  const result = validateBasicCharacterShape({
    ...minimalCharacter,
    attributes: { ...minimalCharacter.attributes, cosmos: 3 },
  });
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((warning) => warning.includes("Cosmos")));
});

test("validateBasicItemShape accepts minimal item and warns unknown types", () => {
  const item = {
    schema: SOLARIS_ITEM_SCHEMA,
    id: "item-1",
    name: "Item",
    type: "utility",
    tags: [],
    rules: {},
    legacy: {},
  };
  assert.equal(validateBasicItemShape(item).ok, true);
  const unknown = validateBasicItemShape({ ...item, type: "strange-relic" });
  assert.equal(unknown.ok, true);
  assert.ok(unknown.warnings.some((warning) => warning.includes("strange-relic")));
});

test("validateBasicCreatureShape accepts minimal creature", () => {
  const result = validateBasicCreatureShape({
    schema: SOLARIS_CREATURE_SCHEMA,
    id: "creature-1",
    name: "Vanguarda",
    tier: "4",
    stats: {},
    attacks: [],
    abilities: [],
    legacy: {},
  });
  assert.equal(result.ok, true);
});

test("validateBasicCampaignShape accepts minimal campaign", () => {
  const result = validateBasicCampaignShape({
    schema: SOLARIS_CAMPAIGN_SCHEMA,
    id: "campaign-1",
    name: "Campanha",
    characters: [],
    creatures: [],
    legacy: {},
  });
  assert.equal(result.ok, true);
});

test("validateBasicExportBundleShape accepts minimal bundle", () => {
  const result = validateBasicExportBundleShape({
    schema: SOLARIS_EXPORT_BUNDLE_SCHEMA,
    id: "bundle-1",
    meta: { saveVersion: 1 },
    type: "library-export",
    payload: {},
    warnings: [],
    legacy: {},
  });
  assert.equal(result.ok, true);
});

test("validateBasicFoundryDraftShape accepts minimal draft", () => {
  const result = validateBasicFoundryDraftShape({
    schema: SOLARIS_FOUNDRY_DRAFT_SCHEMA,
    id: "draft-1",
    meta: { saveVersion: 1 },
    actor: {},
    items: [],
    flags: {},
    legacy: {},
  });
  assert.equal(result.ok, true);
});
