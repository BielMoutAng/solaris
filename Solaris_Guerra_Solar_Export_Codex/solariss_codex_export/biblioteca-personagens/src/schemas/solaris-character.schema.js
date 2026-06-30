export {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicCharacterShape,
} from "./solaris-schemas.js";

export const SOLARIS_CHARACTER_SCHEMA_FIELDS = Object.freeze({
  meta: ["appVersion", "saveVersion", "createdAt", "updatedAt", "exportedAt"],
  identity: ["name", "race", "origin", "profession", "level", "portrait"],
  attributes: ["for", "ref", "con", "men", "pre", "int", "esp"],
  derived: ["pv", "ca", "movement", "baseDice", "stress", "cosmos"],
  inventory: ["looseItems", "cubes", "credits", "unassigned"],
});
