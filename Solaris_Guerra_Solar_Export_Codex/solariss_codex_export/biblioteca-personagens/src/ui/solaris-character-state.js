import {
  SOLARIS_CHARACTER_SCHEMA,
  SOLARIS_OFFICIAL_ATTRIBUTES,
  SOLARIS_RESOURCE_KEYS,
  validateBasicCharacterShape,
} from "../schemas/solaris-schemas.js";
import {
  SOLARIS_EXPORT_APP_VERSION,
  exportSolarisCharacter,
} from "../export/solaris-export-core.js";

const ATTRIBUTE_ALIASES = Object.freeze({
  FOR: "for",
  REF: "ref",
  CON: "con",
  INT: "int",
  PRE: "pre",
  MEN: "men",
});

const DEFAULT_RESOURCE_MAX = Object.freeze({
  pv: 0,
  stress: 6,
  cosmos: 0,
});

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function textValue(value, fallback = "") {
  return value === undefined || value === null ? fallback : String(value);
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function createValidationSummary(character = null) {
  if (!character) return { ok: true, valid: true, errors: [], warnings: [] };
  return validateBasicCharacterShape(character);
}

function resourceTrack(source = {}, key) {
  const track = isObject(source[key]) ? source[key] : {};
  const fallbackMax = DEFAULT_RESOURCE_MAX[key] ?? 0;
  return {
    value: numberValue(track.value, 0),
    max: numberValue(track.max, fallbackMax),
  };
}

function ensureResources(resources = {}) {
  return SOLARIS_RESOURCE_KEYS.reduce((acc, key) => {
    acc[key] = resourceTrack(resources, key);
    return acc;
  }, {});
}

function ensureDerived(derived = {}, resources = ensureResources()) {
  return {
    ...clone(derived),
    ca: numberValue(derived.ca, 0),
    movement: numberValue(derived.movement, 0),
    initiative: numberValue(derived.initiative, 0),
    baseDice: textValue(derived.baseDice, "3d6"),
    pv: clone(resources.pv),
    stress: clone(resources.stress),
    cosmos: clone(resources.cosmos),
  };
}

function ensureAttributes(attributes = {}, legacy = {}) {
  const official = SOLARIS_OFFICIAL_ATTRIBUTES.reduce((acc, key) => {
    const upper = key.toUpperCase();
    acc[key] = numberValue(attributes[key] ?? attributes[upper], 0);
    return acc;
  }, {});
  const legacyAttributes = {
    ...(isObject(legacy.attributes) ? clone(legacy.attributes) : {}),
  };
  if (attributes.esp !== undefined) legacyAttributes.esp = attributes.esp;
  if (attributes.ESP !== undefined) legacyAttributes.ESP = attributes.ESP;
  return {
    official,
    legacyAttributes,
  };
}

function ensureIdentity(identity = {}) {
  return {
    name: textValue(identity.name, "Personagem Solaris"),
    player: textValue(identity.player, ""),
    race: textValue(identity.race, "humanis"),
    raceName: textValue(identity.raceName, ""),
    origin: textValue(identity.origin, ""),
    profession: textValue(identity.profession, ""),
    professionName: textValue(identity.professionName, ""),
    level: numberValue(identity.level, 1),
    xp: numberValue(identity.xp, 0),
    portrait: identity.portrait ?? null,
  };
}

function ensureSkills(skills = {}) {
  return {
    trained: arrayValue(skills.trained),
    ignorant: arrayValue(skills.ignorant),
    focus: arrayValue(skills.focus),
    professionSkills: arrayValue(skills.professionSkills),
    other: arrayValue(skills.other),
  };
}

function ensureCombat(combat = {}) {
  return {
    conditions: arrayValue(combat.conditions),
    damageResistances: arrayValue(combat.damageResistances),
    damageWeaknesses: arrayValue(combat.damageWeaknesses),
    activeEffects: arrayValue(combat.activeEffects),
  };
}

function ensureEquipment(equipment = {}) {
  return {
    armor: equipment.armor ?? null,
    weapons: arrayValue(equipment.weapons),
    activeWeaponId: equipment.activeWeaponId ?? null,
    equippedItems: arrayValue(equipment.equippedItems),
    hooks: arrayValue(equipment.hooks),
    holsters: arrayValue(equipment.holsters),
    bandoliers: arrayValue(equipment.bandoliers),
  };
}

function ensureInventory(inventory = {}) {
  return {
    looseItems: arrayValue(inventory.looseItems),
    cubes: arrayValue(inventory.cubes),
    credits: numberValue(inventory.credits, 0),
    allItems: arrayValue(inventory.allItems),
    unassigned: arrayValue(inventory.unassigned),
  };
}

function ensureAmmoSystem(ammoSystem = {}) {
  return {
    ...clone(ammoSystem),
    magazines: arrayValue(ammoSystem.magazines),
    ammoStacks: arrayValue(ammoSystem.ammoStacks),
    loadedWeapons: arrayValue(ammoSystem.loadedWeapons),
  };
}

function ensureNotes(notes = {}) {
  return {
    background: textValue(notes.background, ""),
    appearance: textValue(notes.appearance, ""),
    personality: textValue(notes.personality, ""),
    campaignNotes: textValue(notes.campaignNotes, ""),
    abilities: textValue(notes.abilities, ""),
  };
}

function finalizeCharacter(character = {}) {
  const resources = ensureResources(character.resources);
  const legacy = isObject(character.legacy) ? clone(character.legacy) : {};
  const attributes = ensureAttributes(character.attributes, legacy);
  const normalized = {
    ...clone(character),
    schema: SOLARIS_CHARACTER_SCHEMA,
    id: textValue(character.id, "char-solaris"),
    meta: {
      appVersion: textValue(character.meta?.appVersion, SOLARIS_EXPORT_APP_VERSION),
      saveVersion: numberValue(character.meta?.saveVersion, 1),
      createdAt: textValue(character.meta?.createdAt, ""),
      updatedAt: textValue(character.meta?.updatedAt, ""),
      exportedAt: textValue(character.meta?.exportedAt, ""),
      legacySchemaVersion: character.meta?.legacySchemaVersion ?? null,
    },
    identity: ensureIdentity(character.identity),
    attributes: attributes.official,
    modifiers: isObject(character.modifiers) ? clone(character.modifiers) : {},
    resources,
    derived: ensureDerived(character.derived, resources),
    skills: ensureSkills(character.skills),
    protectionRolls: isObject(character.protectionRolls) ? clone(character.protectionRolls) : {},
    combat: ensureCombat(character.combat),
    equipment: ensureEquipment(character.equipment),
    inventory: ensureInventory(character.inventory),
    ammoSystem: ensureAmmoSystem(character.ammoSystem),
    abilities: arrayValue(character.abilities),
    notes: ensureNotes(character.notes),
    migration: {
      fromLegacy: Boolean(character.migration?.fromLegacy),
      warnings: arrayValue(character.migration?.warnings),
      ...(isObject(character.migration) ? clone(character.migration) : {}),
    },
    legacy: {
      ...legacy,
      ...(Object.keys(attributes.legacyAttributes).length ? { attributes: attributes.legacyAttributes } : {}),
    },
  };
  const validation = validateBasicCharacterShape(normalized);
  return {
    ...normalized,
    validation,
    warnings: [...new Set([...(normalized.warnings || []), ...(validation.warnings || [])])],
  };
}

function normalizePatchAttributes(attributesPatch = {}) {
  const official = {};
  const legacyAttributes = {};
  Object.entries(attributesPatch || {}).forEach(([key, value]) => {
    const lower = String(key).toLowerCase();
    const officialKey = ATTRIBUTE_ALIASES[key] || lower;
    if (officialKey === "esp") {
      legacyAttributes[key] = value;
      return;
    }
    if (officialKey === "cosmos") return;
    if (SOLARIS_OFFICIAL_ATTRIBUTES.includes(officialKey)) {
      official[officialKey] = numberValue(value, 0);
    }
  });
  return { official, legacyAttributes };
}

function withDirty(state = {}, dirty) {
  return {
    ...state,
    dirty,
    saved: dirty ? false : state.saved,
  };
}

export function normalizeActiveCharacter(character = null, options = {}) {
  if (!character) return null;
  const exported = character?.schema === SOLARIS_CHARACTER_SCHEMA
    ? exportSolarisCharacter(character, { appVersion: options.appVersion || SOLARIS_EXPORT_APP_VERSION })
    : exportSolarisCharacter(character, { appVersion: options.appVersion || SOLARIS_EXPORT_APP_VERSION });
  return finalizeCharacter(exported);
}

export function validateActiveCharacter(character = null) {
  const normalized = normalizeActiveCharacter(character);
  return createValidationSummary(normalized);
}

export function createCharacterState(initialCharacter = null) {
  const activeCharacter = normalizeActiveCharacter(initialCharacter);
  const validation = createValidationSummary(activeCharacter);
  return {
    activeCharacter,
    dirty: false,
    saved: Boolean(activeCharacter),
    lastSavedAt: activeCharacter?.meta?.updatedAt || "",
    validation,
    warnings: validation.warnings || [],
    errors: validation.errors || [],
  };
}

export function getActiveCharacter(state = {}) {
  return state.activeCharacter || null;
}

export function setActiveCharacter(state = {}, character = null) {
  const activeCharacter = normalizeActiveCharacter(character);
  const validation = createValidationSummary(activeCharacter);
  return {
    ...state,
    activeCharacter,
    dirty: false,
    saved: Boolean(activeCharacter),
    lastSavedAt: activeCharacter?.meta?.updatedAt || "",
    validation,
    warnings: validation.warnings || [],
    errors: validation.errors || [],
  };
}

export function updateCharacterIdentity(character, identityPatch = {}) {
  const normalized = normalizeActiveCharacter(character);
  return finalizeCharacter({
    ...normalized,
    identity: {
      ...normalized.identity,
      ...clone(identityPatch),
    },
  });
}

export function updateCharacterAttributes(character, attributesPatch = {}) {
  const normalized = normalizeActiveCharacter(character);
  const patch = normalizePatchAttributes(attributesPatch);
  const legacyAttributes = {
    ...(isObject(normalized.legacy?.attributes) ? clone(normalized.legacy.attributes) : {}),
    ...patch.legacyAttributes,
  };
  const warnings = [...(normalized.migration?.warnings || [])];
  if (Object.keys(patch.legacyAttributes).length) {
    warnings.push("ESP legado preservado em legacy; nao convertido para MEN.");
  }
  return finalizeCharacter({
    ...normalized,
    attributes: {
      ...normalized.attributes,
      ...patch.official,
    },
    migration: {
      ...normalized.migration,
      warnings: [...new Set(warnings)],
    },
    legacy: {
      ...(isObject(normalized.legacy) ? clone(normalized.legacy) : {}),
      ...(Object.keys(legacyAttributes).length ? { attributes: legacyAttributes } : {}),
    },
  });
}

export function updateCharacterResources(character, resourcesPatch = {}) {
  const normalized = normalizeActiveCharacter(character);
  const nextResources = { ...normalized.resources };
  SOLARIS_RESOURCE_KEYS.forEach((key) => {
    if (!isObject(resourcesPatch[key])) return;
    nextResources[key] = {
      ...nextResources[key],
      ...clone(resourcesPatch[key]),
      value: numberValue(resourcesPatch[key].value, nextResources[key].value),
      max: numberValue(resourcesPatch[key].max, nextResources[key].max),
    };
  });
  return finalizeCharacter({
    ...normalized,
    resources: nextResources,
    derived: {
      ...normalized.derived,
      pv: clone(nextResources.pv),
      stress: clone(nextResources.stress),
      cosmos: clone(nextResources.cosmos),
    },
    attributes: {
      ...normalized.attributes,
    },
  });
}

export function updateCharacterDerived(character, derivedPatch = {}) {
  const normalized = normalizeActiveCharacter(character);
  return finalizeCharacter({
    ...normalized,
    derived: {
      ...normalized.derived,
      ...clone(derivedPatch),
    },
  });
}

export function updateCharacterNotes(character, notesPatch = {}) {
  const normalized = normalizeActiveCharacter(character);
  return finalizeCharacter({
    ...normalized,
    notes: {
      ...normalized.notes,
      ...clone(notesPatch),
    },
  });
}

export function updateActiveCharacterSection(state = {}, sectionName, value) {
  const activeCharacter = getActiveCharacter(state);
  if (!activeCharacter) {
    return {
      ...state,
      errors: ["Nao ha ficha ativa para atualizar."],
    };
  }
  let nextCharacter;
  if (sectionName === "identity") nextCharacter = updateCharacterIdentity(activeCharacter, value);
  else if (sectionName === "attributes") nextCharacter = updateCharacterAttributes(activeCharacter, value);
  else if (sectionName === "resources") nextCharacter = updateCharacterResources(activeCharacter, value);
  else if (sectionName === "derived") nextCharacter = updateCharacterDerived(activeCharacter, value);
  else if (sectionName === "notes") nextCharacter = updateCharacterNotes(activeCharacter, value);
  else {
    nextCharacter = finalizeCharacter({
      ...activeCharacter,
      [sectionName]: clone(value),
    });
  }
  const validation = validateBasicCharacterShape(nextCharacter);
  return {
    ...state,
    activeCharacter: nextCharacter,
    dirty: true,
    saved: false,
    validation,
    warnings: validation.warnings || [],
    errors: validation.errors || [],
  };
}

export function markCharacterDirty(state = {}) {
  return withDirty(state, true);
}

export function markCharacterSaved(state = {}) {
  return {
    ...withDirty(state, false),
    saved: true,
    lastSavedAt: new Date().toISOString(),
  };
}

export function isCharacterDirty(state = {}) {
  return Boolean(state.dirty);
}
