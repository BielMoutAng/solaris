export const SOLARIS_CHARACTER_SCHEMA = "solaris-character-v1";
export const SOLARIS_ITEM_SCHEMA = "solaris-item-v1";
export const SOLARIS_CREATURE_SCHEMA = "solaris-creature-v1";
export const SOLARIS_CAMPAIGN_SCHEMA = "solaris-campaign-v1";
export const SOLARIS_EXPORT_BUNDLE_SCHEMA = "solaris-export-bundle-v1";
export const SOLARIS_FOUNDRY_DRAFT_SCHEMA = "solaris-foundry-draft-v1";

export const CURRENT_SOLARIS_SAVE_VERSION = 1;
export const SOLARIS_SCHEMA_SAVE_VERSION = CURRENT_SOLARIS_SAVE_VERSION;

export const SOLARIS_OFFICIAL_ATTRIBUTES = Object.freeze(["for", "ref", "con", "int", "pre", "men"]);
export const SOLARIS_LEGACY_ATTRIBUTES = Object.freeze(["esp"]);

export const SOLARIS_ITEM_TYPES = Object.freeze([
  "weapon",
  "armor",
  "ammo",
  "magazine",
  "cube",
  "consumable",
  "utility",
  "tool",
  "implant",
  "professionChip",
  "ability",
  "material",
  "treasure",
  "drone",
  "turret",
  "vehicle",
  "unknown",
]);

export function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isNumberLike(value) {
  return value !== null && value !== "" && Number.isFinite(Number(value));
}

export function hasSchema(value, schemaName) {
  return isObject(value) && value.schema === schemaName;
}

export function hasAnySchema(value, schemaNames = []) {
  return isObject(value) && schemaNames.includes(value.schema);
}

export function createValidationResult(valid, errors = [], warnings = []) {
  return { valid, ok: valid, errors, warnings };
}

function result(errors = [], warnings = []) {
  return createValidationResult(errors.length === 0, errors, warnings);
}

function requireString(value, field, errors, { allowEmpty = false } = {}) {
  if (typeof value !== "string") {
    errors.push(`${field} deve ser texto.`);
    return;
  }
  if (!allowEmpty && !value.trim()) errors.push(`${field} nao pode ficar vazio.`);
}

function requireObject(value, field, errors) {
  if (!isObject(value)) errors.push(`${field} deve ser um objeto.`);
}

function requireArrayIfPresent(value, field, errors) {
  if (value !== undefined && !Array.isArray(value)) errors.push(`${field}, se existir, deve ser uma lista.`);
}

function requireObjectIfPresent(value, field, errors) {
  if (value !== undefined && !isObject(value)) errors.push(`${field}, se existir, deve ser um objeto.`);
}

function requireLegacyIfPresent(value, field, errors) {
  if (value !== undefined && value !== null && !isObject(value)) errors.push(`${field}, se existir, deve ser um objeto ou null.`);
}

function requireNumberLike(value, field, errors) {
  if (!isNumberLike(value)) errors.push(`${field} deve ser numerico.`);
}

function warnLegacyEsp(attributes = {}, warnings) {
  if (Object.prototype.hasOwnProperty.call(attributes, "esp")) {
    warnings.push("attributes.esp e legado; preserve em legacy ate uma migracao manual segura.");
  }
  if (Object.prototype.hasOwnProperty.call(attributes, "ESP")) {
    warnings.push("attributes.ESP e legado; preserve em legacy ate uma migracao manual segura.");
  }
}

export function validateBasicCharacterShape(character) {
  const errors = [];
  const warnings = [];

  if (!isObject(character)) return result(["Ficha deve ser um objeto."]);
  if (!hasSchema(character, SOLARIS_CHARACTER_SCHEMA)) errors.push(`Ficha deve usar schema ${SOLARIS_CHARACTER_SCHEMA}.`);
  requireString(character.id, "id", errors);

  if (!isObject(character.meta)) {
    errors.push("meta deve ser um objeto.");
  } else {
    if (character.meta.saveVersion === undefined) errors.push("meta.saveVersion deve existir.");
    if (character.meta.appVersion === undefined) warnings.push("meta.appVersion ausente; exportadores devem preencher quando possivel.");
  }

  if (!isObject(character.identity)) {
    errors.push("identity deve ser um objeto.");
  } else {
    requireString(character.identity.name, "identity.name", errors, { allowEmpty: true });
    if (character.identity.level !== undefined) requireNumberLike(character.identity.level, "identity.level", errors);
  }

  if (!isObject(character.attributes)) {
    errors.push("attributes deve ser um objeto.");
  } else {
    for (const attribute of SOLARIS_OFFICIAL_ATTRIBUTES) {
      if (character.attributes[attribute] === undefined) {
        errors.push(`attributes.${attribute} deve existir como atributo oficial.`);
      } else {
        requireNumberLike(character.attributes[attribute], `attributes.${attribute}`, errors);
      }
    }
    warnLegacyEsp(character.attributes, warnings);
    if (Object.prototype.hasOwnProperty.call(character.attributes, "cosmos")) {
      warnings.push("Cosmos e recurso/poder separado; nao deve ficar em attributes.");
    }
  }

  requireObject(character.derived, "derived", errors);
  requireObject(character.skills, "skills", errors);
  requireObject(character.combat, "combat", errors);
  requireObject(character.equipment, "equipment", errors);
  requireObject(character.inventory, "inventory", errors);
  requireObject(character.ammoSystem, "ammoSystem", errors);
  requireArrayIfPresent(character.abilities, "abilities", errors);
  requireObject(character.notes, "notes", errors);
  requireLegacyIfPresent(character.legacy, "legacy", errors);

  return result(errors, warnings);
}

export function validateBasicItemShape(item) {
  const errors = [];
  const warnings = [];

  if (!isObject(item)) return result(["Item deve ser um objeto."]);
  if (!hasSchema(item, SOLARIS_ITEM_SCHEMA)) errors.push(`Item deve usar schema ${SOLARIS_ITEM_SCHEMA}.`);
  requireString(item.id, "id", errors);
  requireString(item.name, "name", errors, { allowEmpty: true });
  requireString(item.type, "type", errors, { allowEmpty: true });

  if (item.type && !SOLARIS_ITEM_TYPES.includes(item.type)) {
    warnings.push(`Tipo de item nao catalogado no schema v1: ${item.type}.`);
  }
  requireArrayIfPresent(item.tags, "tags", errors);
  requireObjectIfPresent(item.rules, "rules", errors);
  requireObjectIfPresent(item.equip, "equip", errors);
  requireObjectIfPresent(item.durability, "durability", errors);
  requireObjectIfPresent(item.storage, "storage", errors);
  if (item.description !== undefined && typeof item.description !== "string") errors.push("description, se existir, deve ser texto.");
  requireLegacyIfPresent(item.legacy, "legacy", errors);

  return result(errors, warnings);
}

export function validateBasicCreatureShape(creature) {
  const errors = [];
  const warnings = [];

  if (!isObject(creature)) return result(["Criatura deve ser um objeto."]);
  if (!hasSchema(creature, SOLARIS_CREATURE_SCHEMA)) errors.push(`Criatura deve usar schema ${SOLARIS_CREATURE_SCHEMA}.`);
  requireString(creature.id, "id", errors);
  requireString(creature.name, "name", errors, { allowEmpty: true });
  if (creature.tier !== undefined && typeof creature.tier !== "string") errors.push("tier, se existir, deve ser texto.");
  requireArrayIfPresent(creature.attacks, "attacks", errors);
  requireArrayIfPresent(creature.abilities, "abilities", errors);
  requireLegacyIfPresent(creature.legacy, "legacy", errors);
  if (!isObject(creature.stats)) warnings.push("stats ausente; criatura pode estar incompleta.");

  return result(errors, warnings);
}

export function validateBasicCampaignShape(campaign) {
  const errors = [];

  if (!isObject(campaign)) return result(["Campanha deve ser um objeto."]);
  if (!hasSchema(campaign, SOLARIS_CAMPAIGN_SCHEMA)) errors.push(`Campanha deve usar schema ${SOLARIS_CAMPAIGN_SCHEMA}.`);
  requireString(campaign.id, "id", errors);
  requireString(campaign.name, "name", errors, { allowEmpty: true });
  requireArrayIfPresent(campaign.characters, "characters", errors);
  requireArrayIfPresent(campaign.creatures, "creatures", errors);
  requireLegacyIfPresent(campaign.legacy, "legacy", errors);

  return result(errors);
}

export function validateBasicExportBundleShape(bundle) {
  const errors = [];

  if (!isObject(bundle)) return result(["Pacote de exportacao deve ser um objeto."]);
  if (!hasSchema(bundle, SOLARIS_EXPORT_BUNDLE_SCHEMA)) errors.push(`Pacote deve usar schema ${SOLARIS_EXPORT_BUNDLE_SCHEMA}.`);
  requireString(bundle.id, "id", errors);
  requireObject(bundle.meta, "meta", errors);
  if (bundle.payload === undefined) errors.push("payload deve existir.");
  requireArrayIfPresent(bundle.warnings, "warnings", errors);
  requireLegacyIfPresent(bundle.legacy, "legacy", errors);

  return result(errors);
}

export function validateBasicFoundryDraftShape(draft) {
  const errors = [];

  if (!isObject(draft)) return result(["Foundry Draft deve ser um objeto."]);
  if (!hasSchema(draft, SOLARIS_FOUNDRY_DRAFT_SCHEMA)) errors.push(`Foundry Draft deve usar schema ${SOLARIS_FOUNDRY_DRAFT_SCHEMA}.`);
  requireString(draft.id, "id", errors);
  requireObjectIfPresent(draft.actor, "actor", errors);
  requireArrayIfPresent(draft.items, "items", errors);
  requireObjectIfPresent(draft.flags, "flags", errors);
  requireLegacyIfPresent(draft.legacy, "legacy", errors);

  return result(errors);
}
