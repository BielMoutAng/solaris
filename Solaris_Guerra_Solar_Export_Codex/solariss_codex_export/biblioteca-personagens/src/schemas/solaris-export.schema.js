export {
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
  SOLARIS_EXPORT_BUNDLE_TYPES,
  SOLARIS_FOUNDRY_DRAFT_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicExportBundleShape,
  validateBasicFoundryDraftShape,
} from "./solaris-schemas.js";

export const SOLARIS_EXPORT_BUNDLE_FIELDS = Object.freeze([
  "schema",
  "id",
  "meta",
  "type",
  "payload",
  "warnings",
  "legacy",
]);

export const SOLARIS_FOUNDRY_DRAFT_FIELDS = Object.freeze([
  "schema",
  "id",
  "meta",
  "actor",
  "items",
  "flags",
  "legacy",
]);
