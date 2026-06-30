export {
  SOLARIS_EXPORT_BUNDLE_SCHEMA,
  SOLARIS_FOUNDRY_DRAFT_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicExportBundleShape,
  validateBasicFoundryDraftShape,
} from "./solaris-schemas.js";

export const SOLARIS_EXPORT_BUNDLE_FIELDS = Object.freeze([
  "schema",
  "saveVersion",
  "appVersion",
  "exportedAt",
  "characters",
  "items",
  "creatures",
  "notes",
]);
