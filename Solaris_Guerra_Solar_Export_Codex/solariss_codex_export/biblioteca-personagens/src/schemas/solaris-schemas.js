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
export const SOLARIS_RESOURCE_KEYS = Object.freeze(["pv", "stress", "cosmos"]);
export const SOLARIS_EXPORT_BUNDLE_TYPES = Object.freeze(["character", "item", "creature", "campaign", "mixed", "backup", "unknown"]);

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

function appendValidation(targetErrors, targetWarnings, validation) {
  targetErrors.push(...(validation.errors || []));
  targetWarnings.push(...(validation.warnings || []));
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

function requireArray(value, field, errors) {
  if (!Array.isArray(value)) errors.push(`${field} deve ser uma lista.`);
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

function validateResourceTrack(resources, key, errors) {
  const track = resources?.[key];
  if (!isObject(track)) {
    errors.push(`resources.${key} deve ser um objeto.`);
    return;
  }
  if (track.value === undefined) errors.push(`resources.${key}.value deve existir.`);
  else requireNumberLike(track.value, `resources.${key}.value`, errors);
  if (track.max === undefined) errors.push(`resources.${key}.max deve existir.`);
  else requireNumberLike(track.max, `resources.${key}.max`, errors);
}

function warnLegacyEsp(attributes = {}, warnings) {
  if (Object.prototype.hasOwnProperty.call(attributes, "esp")) {
    warnings.push("attributes.esp e legado; preserve em legacy ate uma migracao manual segura.");
  }
  if (Object.prototype.hasOwnProperty.call(attributes, "ESP")) {
    warnings.push("attributes.ESP e legado; preserve em legacy ate uma migracao manual segura.");
  }
}

export function validateCharacterMeta(meta) {
  const errors = [];
  const warnings = [];

  if (!isObject(meta)) return result(["meta deve ser um objeto."]);
  if (meta.saveVersion === undefined) errors.push("meta.saveVersion deve existir.");
  else requireNumberLike(meta.saveVersion, "meta.saveVersion", errors);
  if (meta.appVersion === undefined) warnings.push("meta.appVersion ausente; exportadores devem preencher quando possivel.");
  if (meta.createdAt !== undefined) requireString(meta.createdAt, "meta.createdAt", errors, { allowEmpty: true });
  if (meta.updatedAt !== undefined) requireString(meta.updatedAt, "meta.updatedAt", errors, { allowEmpty: true });
  if (meta.exportedAt === undefined) warnings.push("meta.exportedAt ausente; exportacoes devem registrar data.");
  else requireString(meta.exportedAt, "meta.exportedAt", errors, { allowEmpty: true });

  return result(errors, warnings);
}

export function validateCharacterIdentity(identity) {
  const errors = [];

  if (!isObject(identity)) return result(["identity deve ser um objeto."]);
  requireString(identity.name, "identity.name", errors, { allowEmpty: true });
  requireString(identity.race, "identity.race", errors, { allowEmpty: true });
  requireString(identity.origin, "identity.origin", errors, { allowEmpty: true });
  requireString(identity.profession, "identity.profession", errors, { allowEmpty: true });
  requireNumberLike(identity.level, "identity.level", errors);
  if (identity.portrait !== undefined && identity.portrait !== null && typeof identity.portrait !== "string") {
    errors.push("identity.portrait deve ser texto ou null.");
  }

  return result(errors);
}

export function validateCharacterAttributes(attributes) {
  const errors = [];
  const warnings = [];

  if (!isObject(attributes)) return result(["attributes deve ser um objeto."]);
  for (const attribute of SOLARIS_OFFICIAL_ATTRIBUTES) {
    if (attributes[attribute] === undefined) {
      errors.push(`attributes.${attribute} deve existir como atributo oficial.`);
    } else {
      requireNumberLike(attributes[attribute], `attributes.${attribute}`, errors);
    }
  }
  warnLegacyEsp(attributes, warnings);
  if (Object.prototype.hasOwnProperty.call(attributes, "cosmos")) {
    warnings.push("Cosmos e recurso/poder separado; nao deve ficar em attributes.");
  }

  return result(errors, warnings);
}

export function validateCharacterResources(resources) {
  const errors = [];
  const warnings = [];

  if (!isObject(resources)) return result(["resources deve ser um objeto."]);
  for (const key of SOLARIS_RESOURCE_KEYS) validateResourceTrack(resources, key, errors);
  for (const key of Object.keys(resources)) {
    if (!SOLARIS_RESOURCE_KEYS.includes(key)) warnings.push(`resources.${key} ainda nao e recurso oficial do schema v1.`);
  }

  return result(errors, warnings);
}

export function validateCharacterDerived(derived) {
  const errors = [];
  const warnings = [];

  if (!isObject(derived)) return result(["derived deve ser um objeto."]);
  for (const field of ["ca", "movement", "initiative"]) {
    if (derived[field] === undefined) errors.push(`derived.${field} deve existir.`);
    else requireNumberLike(derived[field], `derived.${field}`, errors);
  }
  if (derived.baseDice === undefined) errors.push("derived.baseDice deve existir.");
  else requireString(derived.baseDice, "derived.baseDice", errors, { allowEmpty: true });
  for (const legacyField of SOLARIS_RESOURCE_KEYS) {
    if (derived[legacyField] !== undefined) {
      warnings.push(`derived.${legacyField} e compatibilidade temporaria; resources.${legacyField} e o campo oficial.`);
    }
  }

  return result(errors, warnings);
}

export function validateCharacterSkills(skills) {
  const errors = [];

  if (!isObject(skills)) return result(["skills deve ser um objeto."]);
  requireArray(skills.trained, "skills.trained", errors);
  requireArray(skills.focus, "skills.focus", errors);
  requireArray(skills.professionSkills, "skills.professionSkills", errors);
  requireArrayIfPresent(skills.ignorant, "skills.ignorant", errors);

  return result(errors);
}

export function validateCharacterCombat(combat) {
  const errors = [];

  if (!isObject(combat)) return result(["combat deve ser um objeto."]);
  requireArray(combat.conditions, "combat.conditions", errors);
  requireArray(combat.damageResistances, "combat.damageResistances", errors);
  requireArray(combat.damageWeaknesses, "combat.damageWeaknesses", errors);
  requireArray(combat.activeEffects, "combat.activeEffects", errors);

  return result(errors);
}

export function validateCharacterEquipment(equipment) {
  const errors = [];

  if (!isObject(equipment)) return result(["equipment deve ser um objeto."]);
  if (equipment.armor !== null && equipment.armor !== undefined && !isObject(equipment.armor)) {
    errors.push("equipment.armor deve ser objeto, null ou undefined.");
  }
  requireArray(equipment.weapons, "equipment.weapons", errors);
  requireArray(equipment.equippedItems, "equipment.equippedItems", errors);
  requireArray(equipment.hooks, "equipment.hooks", errors);
  requireArray(equipment.holsters, "equipment.holsters", errors);
  requireArray(equipment.bandoliers, "equipment.bandoliers", errors);

  return result(errors);
}

export function validateCharacterInventory(inventory) {
  const errors = [];

  if (!isObject(inventory)) return result(["inventory deve ser um objeto."]);
  requireArray(inventory.looseItems, "inventory.looseItems", errors);
  requireArray(inventory.cubes, "inventory.cubes", errors);
  if (inventory.credits === undefined) errors.push("inventory.credits deve existir.");
  else requireNumberLike(inventory.credits, "inventory.credits", errors);
  requireArrayIfPresent(inventory.unassigned, "inventory.unassigned", errors);
  requireArrayIfPresent(inventory.allItems, "inventory.allItems", errors);

  return result(errors);
}

export function validateCharacterAmmoSystem(ammoSystem) {
  const errors = [];

  if (!isObject(ammoSystem)) return result(["ammoSystem deve ser um objeto."]);
  requireArray(ammoSystem.magazines, "ammoSystem.magazines", errors);
  requireArray(ammoSystem.ammoStacks, "ammoSystem.ammoStacks", errors);
  requireArray(ammoSystem.loadedWeapons, "ammoSystem.loadedWeapons", errors);

  return result(errors);
}

export function validateCharacterAbilities(abilities) {
  const errors = [];

  requireArray(abilities, "abilities", errors);
  return result(errors);
}

export function validateCharacterNotes(notes) {
  const errors = [];

  if (!isObject(notes)) return result(["notes deve ser um objeto."]);
  for (const field of ["background", "appearance", "personality", "campaignNotes"]) {
    requireString(notes[field], `notes.${field}`, errors, { allowEmpty: true });
  }

  return result(errors);
}

export function validateCharacterMigration(migration) {
  const errors = [];

  if (!isObject(migration)) return result(["migration deve ser um objeto."]);
  if (typeof migration.fromLegacy !== "boolean") errors.push("migration.fromLegacy deve ser booleano.");
  requireArray(migration.warnings, "migration.warnings", errors);

  return result(errors);
}

export function validateCharacterLegacy(legacy) {
  const errors = [];

  requireLegacyIfPresent(legacy, "legacy", errors);
  return result(errors);
}

export function validateBasicCharacterShape(character) {
  const errors = [];
  const warnings = [];

  if (!isObject(character)) return result(["Ficha deve ser um objeto."]);
  if (!hasSchema(character, SOLARIS_CHARACTER_SCHEMA)) errors.push(`Ficha deve usar schema ${SOLARIS_CHARACTER_SCHEMA}.`);
  requireString(character.id, "id", errors);

  appendValidation(errors, warnings, validateCharacterMeta(character.meta));
  appendValidation(errors, warnings, validateCharacterIdentity(character.identity));
  appendValidation(errors, warnings, validateCharacterAttributes(character.attributes));
  appendValidation(errors, warnings, validateCharacterResources(character.resources));
  appendValidation(errors, warnings, validateCharacterDerived(character.derived));
  appendValidation(errors, warnings, validateCharacterSkills(character.skills));
  requireObjectIfPresent(character.protectionRolls, "protectionRolls", errors);
  appendValidation(errors, warnings, validateCharacterCombat(character.combat));
  appendValidation(errors, warnings, validateCharacterEquipment(character.equipment));
  appendValidation(errors, warnings, validateCharacterInventory(character.inventory));
  appendValidation(errors, warnings, validateCharacterAmmoSystem(character.ammoSystem));
  appendValidation(errors, warnings, validateCharacterAbilities(character.abilities));
  appendValidation(errors, warnings, validateCharacterNotes(character.notes));
  appendValidation(errors, warnings, validateCharacterMigration(character.migration));
  appendValidation(errors, warnings, validateCharacterLegacy(character.legacy));

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
  const warnings = [];

  if (!isObject(bundle)) return result(["Pacote de exportacao deve ser um objeto."]);
  if (!hasSchema(bundle, SOLARIS_EXPORT_BUNDLE_SCHEMA)) errors.push(`Pacote deve usar schema ${SOLARIS_EXPORT_BUNDLE_SCHEMA}.`);
  requireString(bundle.id, "id", errors);
  requireObject(bundle.meta, "meta", errors);
  if (bundle.payload === undefined) errors.push("payload deve existir.");
  if (bundle.type && !SOLARIS_EXPORT_BUNDLE_TYPES.includes(bundle.type)) {
    warnings.push(`Tipo de bundle nao catalogado no schema v1: ${bundle.type}.`);
  }
  requireArrayIfPresent(bundle.warnings, "warnings", errors);
  requireLegacyIfPresent(bundle.legacy, "legacy", errors);

  return result(errors, warnings);
}

export function validateBasicFoundryDraftShape(draft) {
  const errors = [];

  if (!isObject(draft)) return result(["Foundry Draft deve ser um objeto."]);
  if (!hasSchema(draft, SOLARIS_FOUNDRY_DRAFT_SCHEMA)) errors.push(`Foundry Draft deve usar schema ${SOLARIS_FOUNDRY_DRAFT_SCHEMA}.`);
  requireString(draft.id, "id", errors);
  requireObjectIfPresent(draft.meta, "meta", errors);
  requireObjectIfPresent(draft.actor, "actor", errors);
  requireArrayIfPresent(draft.items, "items", errors);
  requireObjectIfPresent(draft.flags, "flags", errors);
  requireLegacyIfPresent(draft.legacy, "legacy", errors);

  return result(errors);
}
