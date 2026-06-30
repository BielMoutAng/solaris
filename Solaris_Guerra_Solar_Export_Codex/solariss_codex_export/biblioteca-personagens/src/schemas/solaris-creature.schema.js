export {
  SOLARIS_CREATURE_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicCreatureShape,
} from "./solaris-schemas.js";

export const SOLARIS_CREATURE_FIELDS = Object.freeze([
  "id",
  "name",
  "tier",
  "type",
  "role",
  "size",
  "habitat",
  "stats",
  "attacks",
  "abilities",
  "loot",
  "source",
]);
