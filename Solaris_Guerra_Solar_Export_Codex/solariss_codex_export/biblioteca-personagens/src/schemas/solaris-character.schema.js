export {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  SOLARIS_OFFICIAL_ATTRIBUTES,
  SOLARIS_LEGACY_ATTRIBUTES,
  validateBasicCharacterShape,
} from "./solaris-schemas.js";

export const SOLARIS_CHARACTER_SCHEMA_FIELDS = Object.freeze({
  meta: ["appVersion", "saveVersion", "createdAt", "updatedAt", "exportedAt"],
  identity: ["name", "race", "origin", "profession", "level", "portrait"],
  attributes: [...SOLARIS_OFFICIAL_ATTRIBUTES],
  legacyAttributes: [...SOLARIS_LEGACY_ATTRIBUTES],
  derived: ["pv", "ca", "movement", "baseDice", "stress", "cosmos"],
  inventory: ["looseItems", "cubes", "credits", "unassigned"],
});
