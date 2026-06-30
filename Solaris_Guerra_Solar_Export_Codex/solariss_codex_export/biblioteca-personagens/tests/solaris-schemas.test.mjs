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
  identity: { name: "", level: 1 },
  attributes: { for: 7, ref: 7, con: 7, int: 7, pre: 7, men: 7 },
  derived: {},
  skills: {},
  combat: {},
  equipment: {},
  inventory: {},
  ammoSystem: {},
  abilities: [],
  notes: {},
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
