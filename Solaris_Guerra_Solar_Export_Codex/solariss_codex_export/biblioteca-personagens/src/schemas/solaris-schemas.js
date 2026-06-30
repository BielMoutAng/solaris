export const SOLARIS_CHARACTER_SCHEMA = "solaris-character-v1";
export const SOLARIS_ITEM_SCHEMA = "solaris-item-v1";
export const SOLARIS_CREATURE_SCHEMA = "solaris-creature-v1";
export const SOLARIS_CAMPAIGN_SCHEMA = "solaris-campaign-v1";
export const SOLARIS_EXPORT_BUNDLE_SCHEMA = "solaris-export-bundle-v1";
export const SOLARIS_FOUNDRY_DRAFT_SCHEMA = "solaris-foundry-draft-v1";

export const SOLARIS_SCHEMA_SAVE_VERSION = 1;

export function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function hasSchema(value, schemaName) {
  return isObject(value) && value.schema === schemaName;
}

function result(errors = [], warnings = []) {
  return { ok: errors.length === 0, errors, warnings };
}

function requireString(value, field, errors, { allowEmpty = false } = {}) {
  if (typeof value !== "string") {
    errors.push(`${field} deve ser texto.`);
    return;
  }
  if (!allowEmpty && !value.trim()) errors.push(`${field} nao pode ficar vazio.`);
}

function requireNumberLike(value, field, errors) {
  if (!Number.isFinite(Number(value))) errors.push(`${field} deve ser numerico.`);
}

export function validateBasicCharacterShape(character) {
  const errors = [];
  const warnings = [];
  if (!isObject(character)) return result(["Ficha deve ser um objeto."]);
  if (!hasSchema(character, SOLARIS_CHARACTER_SCHEMA)) errors.push(`Ficha deve usar schema ${SOLARIS_CHARACTER_SCHEMA}.`);
  requireString(character.id, "id", errors);
  if (!isObject(character.meta)) warnings.push("meta ausente; exportadores devem preencher versao e datas.");
  if (!isObject(character.identity)) {
    errors.push("identity deve ser um objeto.");
  } else {
    requireString(character.identity.name, "identity.name", errors, { allowEmpty: true });
    requireString(character.identity.race, "identity.race", errors, { allowEmpty: true });
    requireNumberLike(character.identity.level, "identity.level", errors);
  }
  if (!isObject(character.attributes)) errors.push("attributes deve ser um objeto.");
  if (!isObject(character.derived)) errors.push("derived deve ser um objeto.");
  if (!isObject(character.inventory)) warnings.push("inventory ausente; ficha exportada pode estar incompleta.");
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
  if (!isObject(item.rules)) warnings.push("rules ausente; item pode nao ter mecanica exportavel.");
  return result(errors, warnings);
}

export function validateBasicCreatureShape(creature) {
  const errors = [];
  const warnings = [];
  if (!isObject(creature)) return result(["Criatura deve ser um objeto."]);
  if (!hasSchema(creature, SOLARIS_CREATURE_SCHEMA)) errors.push(`Criatura deve usar schema ${SOLARIS_CREATURE_SCHEMA}.`);
  requireString(creature.id, "id", errors);
  requireString(creature.name, "name", errors, { allowEmpty: true });
  if (!isObject(creature.stats)) warnings.push("stats ausente; criatura pode estar incompleta.");
  return result(errors, warnings);
}
