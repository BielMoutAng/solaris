import {
  SOLARIS_FOUNDRY_DRAFT_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicFoundryDraftShape,
} from "../schemas/solaris-schemas.js";
import {
  SOLARIS_EXPORT_APP_VERSION,
  exportSolarisCharacter,
} from "./solaris-export-core.js";

const clone = (value) => (typeof structuredClone === "function"
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value ?? null)));

function foundryItemType(type = "") {
  const normalized = String(type || "").toLowerCase();
  if (normalized === "weapon") return "weapon";
  if (normalized === "armor") return "armor";
  if (normalized === "ammo") return "ammo";
  if (normalized === "magazine") return "magazine";
  if (normalized === "cube") return "container";
  if (normalized === "consumable") return "consumable";
  if (["ability", "implant", "professionchip"].includes(normalized)) return "ability";
  return "equipment";
}

function toFoundryItem(item = {}) {
  return {
    name: item.name || "Item Solaris",
    type: foundryItemType(item.type),
    img: item.legacy?.imageDataUrl || item.legacy?.image || "icons/svg/item-bag.svg",
    system: {
      solarisId: item.id,
      solarisSchema: item.schema,
      tier: item.tier || "",
      tags: item.tags || [],
      rules: clone(item.rules || {}),
      equip: clone(item.equip || {}),
      durability: clone(item.durability || {}),
      storage: clone(item.storage || {}),
      quantity: item.quantity || 1,
      price: item.price || 0,
      weight: item.weight || 0,
      description: item.description || "",
      source: clone(item.source || {}),
    },
    flags: {
      solaris: {
        source: "Biblioteca Solaris",
        draftSchema: SOLARIS_FOUNDRY_DRAFT_SCHEMA,
        original: clone(item),
      },
    },
  };
}

function toFoundryActor(character = {}) {
  const actorItems = [
    ...(character.inventory?.allItems || []),
    ...(character.abilities || []),
  ].map(toFoundryItem);
  return {
    name: character.identity?.name || "Personagem Solaris",
    type: "character",
    img: character.identity?.portrait || "icons/svg/mystery-man.svg",
    prototypeToken: {
      name: character.identity?.name || "Personagem Solaris",
      actorLink: true,
      disposition: 1,
      img: character.identity?.portrait || "icons/svg/mystery-man.svg",
    },
    system: {
      solarisId: character.id,
      identity: clone(character.identity || {}),
      attributes: clone(character.attributes || {}),
      resources: clone(character.resources || {}),
      modifiers: clone(character.modifiers || {}),
      derived: clone(character.derived || {}),
      skills: clone(character.skills || {}),
      protectionRolls: clone(character.protectionRolls || {}),
      combat: clone(character.combat || {}),
      equipment: clone(character.equipment || {}),
      inventory: clone(character.inventory || {}),
      ammoSystem: clone(character.ammoSystem || {}),
      notes: clone(character.notes || {}),
      migration: clone(character.migration || {}),
    },
    items: actorItems,
    flags: {
      solaris: {
        source: "Biblioteca Solaris",
        sourceSchema: character.schema,
        draftSchema: SOLARIS_FOUNDRY_DRAFT_SCHEMA,
        exportedAt: character.meta?.exportedAt || "",
        legacy: clone(character.legacy || {}),
      },
    },
  };
}

export function exportFoundryDraft(character = {}, options = {}) {
  const solarisCharacter = exportSolarisCharacter(character, options);
  const actor = toFoundryActor(solarisCharacter);
  const exportedAt = options.exportedAt || new Date().toISOString();
  const draft = {
    schema: SOLARIS_FOUNDRY_DRAFT_SCHEMA,
    id: `foundry-draft-${solarisCharacter.id || Date.now()}`,
    meta: {
      appVersion: options.appVersion || solarisCharacter.meta?.appVersion || SOLARIS_EXPORT_APP_VERSION,
      saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
      exportedAt,
    },
    saveVersion: SOLARIS_SCHEMA_SAVE_VERSION,
    appVersion: options.appVersion || solarisCharacter.meta?.appVersion || SOLARIS_EXPORT_APP_VERSION,
    exportedAt,
    source: {
      schema: solarisCharacter.schema,
      id: solarisCharacter.id,
      name: solarisCharacter.identity?.name || "",
    },
    target: {
      foundry: {
        mode: "draft",
        importerModule: "solaris-importer",
        futureSystem: "guerra-solar",
      },
    },
    actor,
    actors: [actor],
    items: actor.items,
    journals: [],
    compendiums: [],
    flags: {
      solaris: {
        source: "Biblioteca Solaris",
        schema: solarisCharacter.schema,
        draftSchema: SOLARIS_FOUNDRY_DRAFT_SCHEMA,
        sourceSchema: solarisCharacter.schema,
        originalCharacter: clone(solarisCharacter),
        legacy: clone(solarisCharacter.legacy || {}),
        warnings: [
          ...(solarisCharacter.validation?.warnings || []),
          "Draft ainda nao cria documentos Foundry diretamente; use como contrato para o importador.",
        ],
      },
    },
    mappingNotes: [
      "Este e um rascunho independente do Foundry: a Biblioteca Solaris continua sendo a fonte oficial.",
      "Actor character recebe a ficha completa em system e flags.solaris.",
      "Itens, habilidades, cubos e equipamentos seguem como Item drafts para importador futuro.",
      "Active Effects e compendios serao materializados no modulo importador Foundry.",
    ],
    warnings: [
      ...(solarisCharacter.validation?.warnings || []),
      "Draft ainda nao cria documentos Foundry diretamente; use como contrato para o importador.",
    ],
    legacy: clone(solarisCharacter.legacy || {}),
  };
  return { ...draft, validation: validateBasicFoundryDraftShape(draft) };
}
