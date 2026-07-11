import {
  SOLARIS_ITEM_SCHEMA,
  SOLARIS_SCHEMA_SAVE_VERSION,
  validateBasicItemShape,
} from "../schemas/solaris-schemas.js";
import {
  normalizeArmorEntry,
  normalizeEquipmentEntry,
  normalizeModEntry,
  normalizeWeaponEntry,
} from "./solaris-equipment-rules.js";

export const CATALOG_SCHEMA_VERSION = 1;

export const CATALOG_COLLECTIONS = Object.freeze({
  WEAPONS: "weapons",
  ARMORS: "armors",
  ITEMS: "items",
  STORAGE: "storage",
  CUBES: "cubes",
  MODIFIER_CHIPS: "modifierChips",
  MODS: "mods",
  COSMIC_SPELLS: "cosmicSpells",
});

export const COSMIC_SPELL_COST_TO_TIER = Object.freeze({
  1: "F",
  2: "E",
  3: "D",
  4: "C",
  6: "B",
  8: "A",
  10: "S",
});

export const OFFICIAL_COSMIC_SPELL_ROWS = Object.freeze([
  [1, "Rajada Cósmica", "1d6 de dano energético, ignora 1 CA. Alcance 10 m.", "Instantânea"],
  [1, "Impulso Cinético", "Empurra inimigo 2 m; FOR CD 10 ou cai.", "Instantânea"],
  [1, "Fôlego Vital", "Cura 1d4 PV ou remove 1 Estresse.", "Instantânea"],
  [1, "Reflexo Instintivo", "+2 CA até o próximo turno.", "1 rodada"],
  [1, "Sentir Presença", "Detecta criaturas/fontes em 15 m.", "1 rodada"],
  [1, "Clarão Mental", "Ilumina 10 m, inimigos sofrem -2 no próximo ataque.", "1 rodada"],
  [1, "Toque de Gravidade", "Alvo tem movimento alterado em +/-2 m.", "1 rodada"],
  [1, "Escudo Cósmico", "Reduz 1d4 de dano do próximo ataque.", "1 turno"],
  [1, "Voz Interior", "Comunicação mental com 1 alvo em 15 m.", "1 rodada"],
  [1, "Tiro de luz", "1d4 de dano com alcance de 15 m.", "Instantânea"],
  [1, "Bola de esporos", "Cria nuvem circular de esporos de 3 m, causando 1d4 por turno a quem passar ali.", "Instantânea"],
  [2, "Explosão Cósmica", "2d6 de dano energético em área de 3 m.", "Instantânea"],
  [2, "Cura Cósmica", "Cura 2d6 PV em 1 aliado.", "Instantânea"],
  [2, "Impacto Estelar", "Próximo ataque recebe +2d6 de dano.", "1 turno"],
  [2, "Telecinese Menor", "Move objeto/inimigo leve, até 50 kg, em 5 m. Pode desarmar.", "1 rodada"],
  [2, "Armadura Etérea", "Concede +3 CA.", "1 turno"],
  [2, "Lança de Luz", "Invoca lança de energia em campo, alcance 20 m, dura 6 rodadas, dano 2d8.", "6 turnos"],
  [2, "Correntes Etéreas", "Energia prende 1 alvo em 5 m. FOR CD 13 ou fica imobilizado.", "1 turno"],
  [2, "Espinhos do chão", "Área circular de 5 m causa 1d6+2 por turno e reduz movimento pela metade.", "1 rodada"],
  [3, "Tempestade de Energia", "3d8 de dano energético em área de 5 m.", "Instantânea"],
  [3, "Regeneração Cósmica", "Cura 3d6 PV e remove 2 Estresse de 1 aliado.", "Instantânea"],
  [3, "Campo de Gravidade", "Área de 6 m: inimigos têm movimento reduzido à metade.", "1 rodada"],
  [3, "Dominação Mental", "Alvo em até 10 m faz JPC com PRE CD 15; em falha, fica sob influência por 1 turno.", "1 turno"],
  [3, "Armadura Estelar", "+4 CA e resistência a 1d4 por ataque, dura 3 turnos.", "3 turnos"],
  [3, "Invocação da Fera Abatida", "Ritual prévio com sangue. Invoca fera F/E/D já abatida, com metade do PV, por 1d4 turnos.", "1d4 turnos"],
  [4, "Nova de Ruína", "4d8 dano energético em área raio 6 m. Ignora 2 CA.", "Instantânea"],
  [4, "Domo Prismático", "Domo raio 4 m: aliados dentro ganham +3 CA e reduzem 1d4 de dano energético por ataque.", "3 turnos"],
  [4, "Ruptura Gravitacional", "Área raio 6 m: inimigos ficam com movimento pela metade e testes de REF têm -2.", "1 rodada"],
  [4, "Marca do Eclipse", "Marca 1 alvo a 20 m: ataques contra ele ganham +2 para acertar e ignoram 2 CA.", "3 turnos"],
  [4, "Salto Astral", "Teleporta até 20 m em linha de visão e pode levar 1 aliado adjacente; ganha +2 CA contra o próximo ataque.", "Instantânea"],
  [4, "Purga Sináptica", "Em 1 aliado a 10 m: remove 2 condições.", "Instantânea"],
  [4, "Correntes de Luz Maior", "Até 2 alvos a 15 m fazem FOR CD 15; falha imobiliza e causa 2d6 energético no início do turno.", "2 turnos"],
  [4, "Sentinela Prismática", "Invoca sentinela com CA 13, PV 4d8 e ataque 1d10 energético.", "3 turnos"],
  [4, "Olho do Vazio", "Ganha Visão Cósmica 30 m, detecta assinaturas cósmicas e tem vantagem em Percepção/Busca.", "1 cena"],
  [4, "Reforço Vital Avançado", "Cura 4d6 PV e remove 2 Estresse de 1 alvo a 10 m.", "Instantânea"],
  [6, "Tempestade de Fragmentos", "6d8 energético em área raio 8 m; alvos atingidos ficam -1 CA até o próximo turno.", "Instantânea"],
  [6, "Muralha de Luz Densa", "Cria parede 10 m x 2 m que dá cobertura pesada +4 CA e bloqueia projéteis comuns.", "3 turnos"],
  [6, "Âncora Gravitacional", "Área raio 6 m: inimigos não podem correr e teleportes na área falham.", "2 turnos"],
  [6, "Selo de Dissipação", "Remove até 3 efeitos numa área raio 4 m.", "Instantânea"],
  [6, "Passo Entre Fendas", "Teleporta até 35 m e pode atravessar 1 parede fina durante o salto.", "Instantânea"],
  [6, "Circuito da Coragem", "Até 3 aliados a 10 m: -1 Estresse, +1 contra medo/terror e +1 CA.", "1 cena"],
  [6, "Lança Perfurante do Sol Morto", "Ataque em linha 20 m: 4d10 energético, ignora 3 CA e atravessa 1 alvo secundário.", "Instantânea"],
  [6, "Tecido Reparador", "Cura 6d6 PV e remove 1 condição de 1 alvo a 10 m.", "Instantânea"],
  [6, "Espectro Guardião", "Invoca guardião CA 14, PV 6d8, ataque 1d12 e intercepta 1 ataque por turno.", "3 turnos"],
  [6, "Pulso de Interferência", "Área raio 6 m: inimigos sofrem -2 no ataque à distância e equipamentos ficam Jammed por 1 turno.", "1 rodada"],
  [8, "Colapso de Singularidade", "Área raio 8 m: puxa inimigos 3 m ao centro e causa 8d8 concussão/energético.", "Instantânea"],
  [8, "Cúpula de Estase", "Domo raio 4 m: inimigos ficam Lentos, com 1 ação ou 1 movimento por turno.", "2 turnos"],
  [8, "Ressonância Blindada", "Você e 2 aliados ganham +4 CA e redução de dano 1d6 por acerto.", "3 turnos"],
  [8, "Cadeia de Julgamento", "1 alvo faz JPC com MEN; falha atordoa e causa 4d8, parcial aplica -2 CA.", "1 turno"],
  [8, "Portal de Extração", "Teleporta você e até 2 aliados a 3 m para um ponto visto a 60 m.", "Instantânea"],
  [8, "Reanimação de Campo", "Alvo a 10 m em 0 PV volta com 2d12 PV e sofre uma consequência definida pelo mestre por 1 cena.", "Instantânea"],
  [8, "Chuva Prismática", "Área raio 10 m: 6d10 energético. Falha em REF CD 14 deixa Cego até o próximo turno.", "Instantânea"],
  [8, "Vínculo de Comando", "Assume comando de 1 drone, torreta ou robô por 3 turnos.", "3 turnos"],
  [8, "Reescrita de Probabilidade", "3 aliados a 10 m podem rerrolar 1 teste e ficar com o melhor.", "1 cena"],
  [8, "Passagem no Vazio", "Fica Intangível a dano físico comum, toma metade e atravessa criaturas/obstáculos finos.", "2 turnos"],
  [10, "Extinção Local", "Explosão controlada raio 12 m: 10d10 energético. Estruturas sofrem dano total.", "Instantânea"],
  [10, "Tempo Fraturado", "Ganha +1 ação no turno atual, sem repetir a mesma ação de ataque.", "Instantânea"],
  [10, "Cárcere de Luz Absoluta", "Prende 1 alvo em estase: não age, não se move e não recebe cura.", "2 turnos"],
  [10, "Muralha do Fim", "Barreira raio 6 m ao redor de você bloqueia 2 acertos por turno.", "2 turnos"],
  [10, "Reconstituição Total", "Cura 10d6 PV, remove todas as condições e reduz -3 Estresse.", "Instantânea"],
  [10, "Olho de Uryon", "Revela invisibilidade, disfarces, campos, portas ocultas, assinaturas cósmicas e rotas de rede locais em 30 m.", "1 cena"],
  [10, "Dilúvio Antimatéria", "Linha 30 m: 8d12 energético + perfurante, ignora 5 CA e atravessa cobertura média.", "Instantânea"],
  [10, "Pacto do Guardião Ancestral", "Invoca guardião maior CA 15, PV 10d8, 2 ataques por turno e proteção +3 CA.", "3 turnos"],
  [10, "Rasgo de Realidade", "Abre fenda de 8 m; quem atravessa sai em ponto visto a 100 m.", "2 turnos"],
  [10, "Apagamento do Medo", "Até 4 aliados removem Medo/Terror, reduzem -4 Estresse e ganham vantagem em JPC com PRE.", "1 cena"],
]);

const COLLECTION_ORDER = Object.freeze([
  CATALOG_COLLECTIONS.WEAPONS,
  CATALOG_COLLECTIONS.ARMORS,
  CATALOG_COLLECTIONS.ITEMS,
  CATALOG_COLLECTIONS.STORAGE,
  CATALOG_COLLECTIONS.CUBES,
  CATALOG_COLLECTIONS.MODIFIER_CHIPS,
  CATALOG_COLLECTIONS.MODS,
  CATALOG_COLLECTIONS.COSMIC_SPELLS,
]);

const COLLECTION_LABELS = Object.freeze({
  weapons: "Armas",
  armors: "Armaduras",
  items: "Itens",
  storage: "Armazenamento",
  cubes: "Cubos",
  modifierChips: "Chips modificadores",
  mods: "Mods",
  cosmicSpells: "Habilidades cosmicas",
});

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value ?? null));
}

function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function text(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  const result = String(value).trim();
  return result || fallback;
}

function numberValue(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value ?? "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.+-]/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function key(value = "") {
  return text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slug(value = "", fallback = "catalog-entry") {
  return key(value).replace(/\s+/g, "-").replace(/^-+|-+$/g, "") || fallback;
}

function firstPresent(...values) {
  return values.find((value) => value !== undefined && value !== null && text(value) !== "");
}

function uniqueStrings(values = []) {
  return [...new Set(arrayOf(values).map((entry) => text(entry)).filter(Boolean))];
}

function rowsFromOfficialData(officialData = {}) {
  return Object.entries(objectOrEmpty(officialData))
    .filter(([, value]) => value !== undefined && value !== null && text(value) !== "")
    .map(([label, value]) => ({ label, value: text(value) }));
}

function sourceFrom(raw = {}, book5 = {}) {
  return {
    bookId: text(raw.bookId, book5.bookId || "book5"),
    bookTitle: text(raw.bookTitle, book5.bookTitle || "Livro 5 - Itens, Equipamentos e Habilidades"),
    label: text(raw.source, book5.sourceLabel || "Livro 5"),
    sourceSection: text(firstPresent(raw.sourceSection, raw.source), ""),
    sourceFileCurrent: text(firstPresent(raw.sourceFileCurrent, book5.sourceFileCurrent, book5.source), ""),
    sourceStatus: text(firstPresent(raw.sourceStatus, book5.sourceStatus), ""),
    sourceLastReconciledAt: text(firstPresent(raw.sourceLastReconciledAt, book5.sourceLastReconciledAt), ""),
    dataStability: text(firstPresent(raw.dataStability, book5.dataStability), ""),
    needsReview: Boolean(raw.needsReview || book5.needsReview),
    reviewReason: text(firstPresent(raw.reviewReason, book5.reviewReason), ""),
  };
}

function typeForCollection(collection, raw = {}) {
  if (collection === CATALOG_COLLECTIONS.WEAPONS) return "weapon";
  if (collection === CATALOG_COLLECTIONS.ARMORS) return "armor";
  if (collection === CATALOG_COLLECTIONS.CUBES) return "cube";
  if (collection === CATALOG_COLLECTIONS.STORAGE) return "container";
  if (collection === CATALOG_COLLECTIONS.MODS) return "mod";
  if (collection === CATALOG_COLLECTIONS.MODIFIER_CHIPS) return "implant";
  if (collection === CATALOG_COLLECTIONS.COSMIC_SPELLS) return "ability";
  if (raw.consumable) return "consumable";
  return "utility";
}

function normalizeByCollection(raw = {}, collection) {
  if (collection === CATALOG_COLLECTIONS.WEAPONS) return normalizeWeaponEntry(raw);
  if (collection === CATALOG_COLLECTIONS.ARMORS) return normalizeArmorEntry(raw);
  if (collection === CATALOG_COLLECTIONS.MODS) return normalizeModEntry(raw);
  return normalizeEquipmentEntry(raw);
}

function mechanicsFor(collection, raw = {}, normalized = {}) {
  if (collection === CATALOG_COLLECTIONS.WEAPONS) {
    return {
      weapon: {
        category: normalized.weaponCategory,
        attackAttribute: normalized.attackAttribute,
        attackSkill: normalized.attackSkill,
        damageFormula: normalized.damageFormula,
        damageDice: clone(normalized.damageDice),
        damageType: normalized.damageType,
        rangeMeters: normalized.rangeMeters,
        modSlots: normalized.modSlots,
        crackMax: normalized.crackMax,
      },
      ammo: {
        ammoKind: normalized.ammoKind,
        feedSystem: normalized.feedSystem,
        fireModes: clone(normalized.fireModes || []),
        capacity: normalized.capacity,
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.ARMORS) {
    return {
      armor: {
        category: normalized.armorCategory,
        caBonus: normalized.caBonus,
        baseCa: normalized.baseCa,
        reduction: text(normalized.reduction),
        movement: text(normalized.movement),
        hooks: numberValue(normalized.hooks, 0),
        modSlots: normalized.modSlots,
        crackMax: normalized.crackMax,
        cosmicSpellSlots: numberValue(normalized.cosmicSpellSlots, 0),
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.CUBES) {
    return {
      storage: {
        kind: text(raw.cubeKind, "cube"),
        capacity: numberValue(raw.cubeCapacity, 0),
        materialMode: text(raw.cubeMaterialMode, ""),
        weightKg: numberValue(firstPresent(raw.weight, normalized.weightKg), 1),
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.STORAGE) {
    return {
      storage: {
        kind: inferStorageKind(raw),
        capacity: numberValue(firstPresent(raw.maxSlots, raw.capacity), 0),
        weightKg: normalized.weightKg,
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.MODIFIER_CHIPS) {
    return {
      chip: {
        rank: text(firstPresent(raw.rank, raw.tier), ""),
        type: text(raw.type, ""),
        installation: text(raw.installation, ""),
        slots: numberValue(raw.slots, 1),
        activation: text(raw.activation, ""),
        materials: text(raw.materials, ""),
        failure: text(raw.failure, ""),
      },
      ability: {
        kind: "modifier-chip",
        passive: /passivo/i.test(text(raw.type) + " " + text(raw.activation)),
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.MODS) {
    return {
      mod: {
        type: text(raw.type, ""),
        slots: numberValue(firstPresent(raw.slots, raw.slotCost), 1),
        risk: text(raw.risk, ""),
      },
    };
  }

  if (collection === CATALOG_COLLECTIONS.COSMIC_SPELLS) {
    return {
      ability: {
        kind: "cosmic-spell",
        cost: numberValue(raw.cost, 0),
        duration: text(raw.duration, ""),
        tier: text(raw.tier, ""),
      },
    };
  }

  return {
    item: {
      consumable: Boolean(raw.consumable),
      effect: text(firstPresent(raw.effect, raw.summary), ""),
    },
  };
}

function inferStorageKind(raw = {}) {
  const haystack = key(`${raw.name || ""} ${raw.type || ""} ${raw.summary || ""}`);
  if (haystack.includes("mochila") || haystack.includes("bolsa")) return "backpack";
  if (haystack.includes("coldre")) return "holster";
  if (haystack.includes("bandoleira")) return "bandolier";
  if (haystack.includes("gancho")) return "hook";
  if (haystack.includes("cubo")) return "cube-support";
  return "container";
}

export function normalizeOfficialCatalogEntry(raw = {}, collection = CATALOG_COLLECTIONS.ITEMS, options = {}) {
  const sourceBook = objectOrEmpty(options.book5);
  const normalized = normalizeByCollection(raw, collection);
  const source = sourceFrom(raw, sourceBook);
  const id = text(firstPresent(raw.id, raw.officialId), `${collection}-${slug(raw.name)}`);
  const tier = text(firstPresent(raw.tier, raw.rank), "");
  const officialData = clone(objectOrEmpty(raw.officialData));
  const tags = uniqueStrings([
    collection,
    COLLECTION_LABELS[collection],
    tier ? `tier-${tier}` : "",
    ...arrayOf(raw.tags),
    ...arrayOf(normalized.tags),
  ]);
  const entry = {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    id,
    officialId: text(firstPresent(raw.officialId, id), id),
    collection,
    collectionLabel: COLLECTION_LABELS[collection] || collection,
    type: typeForCollection(collection, raw),
    category: text(raw.category, collection),
    subtype: text(firstPresent(raw.type, raw.kind, normalized.weaponCategory, normalized.armorCategory), ""),
    name: text(firstPresent(raw.name, raw.Nome), "Entrada Solaris"),
    tier,
    rank: text(firstPresent(raw.rank, tier), ""),
    price: numberValue(firstPresent(raw.price, normalized.price), 0),
    weightKg: numberValue(firstPresent(normalized.weightKg, raw.weight), 0),
    tags,
    summary: text(firstPresent(raw.summary, normalized.summary, raw.description), ""),
    source,
    details: {
      fields: officialData,
      rows: rowsFromOfficialData(officialData),
      summary: text(firstPresent(raw.summary, normalized.summary, raw.description), ""),
      sourceLabel: source.label,
    },
    mechanics: mechanicsFor(collection, raw, normalized),
    officialData,
    legacy: clone(raw),
  };
  return entry;
}

export function normalizeCatalogTemplate(template = {}) {
  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    id: text(template.id, `template-${slug(template.label)}`),
    label: text(template.label, "Modelo Solaris"),
    source: text(template.source, ""),
    fields: arrayOf(template.fields).map((field) => ({
      id: text(field.id, slug(field.label, "field")),
      label: text(field.label, ""),
      type: text(field.type, "text"),
      wide: Boolean(field.wide),
    })),
    legacy: clone(template),
  };
}

export function normalizeCosmicSpellEntry(rowOrEntry = {}, index = 0) {
  const isRow = Array.isArray(rowOrEntry);
  const cost = numberValue(isRow ? rowOrEntry[0] : rowOrEntry.cost, 1);
  const name = text(isRow ? rowOrEntry[1] : rowOrEntry.name, `Magia Cosmica ${index + 1}`);
  const summary = text(isRow ? rowOrEntry[2] : rowOrEntry.summary, "");
  const duration = text(isRow ? rowOrEntry[3] : rowOrEntry.duration, "");
  const tier = text(firstPresent(rowOrEntry.tier, COSMIC_SPELL_COST_TO_TIER[cost]), "");
  const id = text(firstPresent(rowOrEntry.id, rowOrEntry.officialId), `book5-cosmic-spell-${slug(name)}`);
  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    id,
    officialId: id,
    collection: CATALOG_COLLECTIONS.COSMIC_SPELLS,
    collectionLabel: COLLECTION_LABELS.cosmicSpells,
    type: "ability",
    category: "cosmos",
    subtype: "cosmic-spell",
    name,
    tier,
    rank: tier,
    cost,
    duration,
    price: 0,
    weightKg: 0,
    tags: uniqueStrings(["cosmos", "habilidade cosmica", `custo-${cost}`, tier ? `tier-${tier}` : ""]),
    summary,
    source: {
      bookId: "book5",
      bookTitle: "Livro 5 - Itens, Equipamentos e Habilidades",
      label: "Livro 5, Capitulo 11 - Habilidades Cosmicas",
      sourceSection: "Capitulo 11 - Habilidades Cosmicas",
      sourceFileCurrent: "",
      sourceStatus: "structured-from-app-catalog",
      sourceLastReconciledAt: "",
      dataStability: "provisional",
      needsReview: false,
      reviewReason: "",
    },
    details: {
      fields: {
        Nome: name,
        Tier: tier,
        Custo: String(cost),
        Duracao: duration,
        Efeito: summary,
      },
      rows: rowsFromOfficialData({ Nome: name, Tier: tier, Custo: cost, Duracao: duration, Efeito: summary }),
      summary,
      sourceLabel: "Livro 5, Capitulo 11 - Habilidades Cosmicas",
    },
    mechanics: mechanicsFor(CATALOG_COLLECTIONS.COSMIC_SPELLS, { cost, duration, tier }, {}),
    officialData: {
      Nome: name,
      Tier: tier,
      Custo: cost,
      Duracao: duration,
      Efeito: summary,
    },
    legacy: clone(rowOrEntry),
  };
}

export function createOfficialCosmicSpellCatalog(rows = OFFICIAL_COSMIC_SPELL_ROWS) {
  return arrayOf(rows).map((row, index) => normalizeCosmicSpellEntry(row, index));
}

export function createCatalogIndex(entries = []) {
  const all = arrayOf(entries);
  const byId = {};
  const byCollection = {};
  const byType = {};
  const byTier = {};
  for (const entry of all) {
    byId[entry.id] = entry;
    if (entry.officialId) byId[entry.officialId] = entry;
    byCollection[entry.collection] = [...(byCollection[entry.collection] || []), entry.id];
    byType[entry.type] = [...(byType[entry.type] || []), entry.id];
    if (entry.tier) byTier[entry.tier] = [...(byTier[entry.tier] || []), entry.id];
  }
  return { byId, byCollection, byType, byTier };
}

export function normalizeOfficialBook5Catalog(book5 = {}, options = {}) {
  const catalog = objectOrEmpty(book5.catalog);
  const groups = {
    weapons: arrayOf(catalog.weapons).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.WEAPONS, { book5 })),
    armors: arrayOf(catalog.armors).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.ARMORS, { book5 })),
    items: arrayOf(catalog.items).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.ITEMS, { book5 })),
    storage: arrayOf(catalog.storage).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.STORAGE, { book5 })),
    cubes: arrayOf(catalog.cubes).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.CUBES, { book5 })),
    modifierChips: arrayOf(catalog.modifierChips).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.MODIFIER_CHIPS, { book5 })),
    mods: arrayOf(catalog.mods).map((entry) => normalizeOfficialCatalogEntry(entry, CATALOG_COLLECTIONS.MODS, { book5 })),
    cosmicSpells: createOfficialCosmicSpellCatalog(options.cosmicSpellRows || OFFICIAL_COSMIC_SPELL_ROWS),
  };
  const all = COLLECTION_ORDER.flatMap((collection) => groups[collection] || []);
  const counts = Object.fromEntries(Object.entries(groups).map(([name, entries]) => [name, entries.length]));
  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    source: sourceFrom(book5, book5),
    groups,
    all,
    counts,
    templates: arrayOf(book5.templates).map(normalizeCatalogTemplate),
    indexes: createCatalogIndex(all),
    warnings: [
      ...(book5.needsReview ? ["official-book5-source-needs-review"] : []),
      ...(book5.sourceNeedsReview ? ["official-book5-current-source-needs-review"] : []),
    ],
  };
}

export function entriesFromCatalog(catalogOrEntries = []) {
  if (Array.isArray(catalogOrEntries)) return catalogOrEntries;
  if (Array.isArray(catalogOrEntries.all)) return catalogOrEntries.all;
  if (objectOrEmpty(catalogOrEntries).groups) {
    return Object.values(catalogOrEntries.groups).flatMap((entries) => arrayOf(entries));
  }
  return [];
}

export function findCatalogEntry(catalogOrEntries = [], idOrName = "") {
  const search = text(idOrName);
  if (!search) return null;
  const catalog = objectOrEmpty(catalogOrEntries);
  if (catalog.indexes?.byId?.[search]) return catalog.indexes.byId[search];
  const searchKey = key(search);
  return entriesFromCatalog(catalogOrEntries).find((entry) => (
    key(entry.id) === searchKey
    || key(entry.officialId) === searchKey
    || key(entry.name) === searchKey
  )) || null;
}

export function filterCatalogEntries(catalogOrEntries = [], filters = {}) {
  let entries = entriesFromCatalog(catalogOrEntries);
  const collection = text(filters.collection);
  const type = text(filters.type);
  const tier = text(filters.tier);
  const tag = key(filters.tag);
  const search = key(filters.text || filters.search || filters.query);
  const maxPrice = filters.maxPrice === undefined ? null : numberValue(filters.maxPrice, null);
  const minPrice = filters.minPrice === undefined ? null : numberValue(filters.minPrice, null);

  if (collection) entries = entries.filter((entry) => entry.collection === collection);
  if (type) entries = entries.filter((entry) => entry.type === type || entry.subtype === type);
  if (tier) entries = entries.filter((entry) => entry.tier === tier || entry.rank === tier);
  if (tag) entries = entries.filter((entry) => entry.tags.some((entryTag) => key(entryTag).includes(tag)));
  if (search) {
    entries = entries.filter((entry) => key([
      entry.name,
      entry.summary,
      entry.collectionLabel,
      entry.subtype,
      entry.tags.join(" "),
    ].join(" ")).includes(search));
  }
  if (minPrice !== null) entries = entries.filter((entry) => entry.price >= minPrice);
  if (maxPrice !== null) entries = entries.filter((entry) => entry.price <= maxPrice);

  return sortCatalogEntries(entries, filters.sortBy || "name");
}

export function sortCatalogEntries(entries = [], sortBy = "name") {
  const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });
  return [...arrayOf(entries)].sort((left, right) => {
    if (sortBy === "price") return (left.price || 0) - (right.price || 0) || collator.compare(left.name, right.name);
    if (sortBy === "tier") return collator.compare(left.tier || "ZZ", right.tier || "ZZ") || collator.compare(left.name, right.name);
    if (sortBy === "collection") return collator.compare(left.collectionLabel, right.collectionLabel) || collator.compare(left.name, right.name);
    return collator.compare(left.name, right.name);
  });
}

export function getCatalogEntryDetails(entry = {}) {
  return {
    id: text(entry.id),
    title: text(entry.name, "Entrada Solaris"),
    collection: text(entry.collectionLabel, entry.collection),
    summary: text(entry.summary),
    source: clone(entry.source || {}),
    rows: arrayOf(entry.details?.rows),
    mechanics: clone(entry.mechanics || {}),
    officialData: clone(entry.officialData || {}),
  };
}

export function catalogEntryToSolarisItem(entry = {}, options = {}) {
  const source = objectOrEmpty(entry);
  const item = {
    schema: SOLARIS_ITEM_SCHEMA,
    id: text(firstPresent(options.id, source.id), `item-${slug(source.name)}`),
    name: text(source.name, "Item Solaris"),
    type: text(source.type, "utility"),
    tier: text(source.tier, ""),
    source: {
      book: text(source.source?.bookTitle, ""),
      chapter: text(source.source?.sourceSection, ""),
      reference: text(source.source?.label, ""),
    },
    tags: uniqueStrings(source.tags),
    rules: {
      catalogCollection: source.collection,
      subtype: source.subtype,
      mechanics: clone(source.mechanics || {}),
      officialData: clone(source.officialData || {}),
    },
    equip: {
      equipped: false,
      slot: "",
      location: {},
    },
    durability: {
      cracks: 0,
      maxCracks: numberValue(firstPresent(source.mechanics?.weapon?.crackMax, source.mechanics?.armor?.crackMax), 5),
    },
    storage: {
      location: {},
      cubeUid: "",
      supportSlot: "",
      inCube: false,
    },
    quantity: 1,
    ammo: clone(source.mechanics?.ammo || {}),
    price: numberValue(source.price, 0),
    weight: numberValue(source.weightKg, 0),
    description: text(source.summary, ""),
    legacy: clone(source.legacy || source),
  };
  return { ...item, validation: validateBasicItemShape(item), meta: { saveVersion: SOLARIS_SCHEMA_SAVE_VERSION } };
}
