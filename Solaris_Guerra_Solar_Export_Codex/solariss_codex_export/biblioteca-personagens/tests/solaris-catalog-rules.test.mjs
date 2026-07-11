import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  loadGlobalScript,
  projectRootFromHere,
} from "../scripts/audit-official-sources.mjs";
import {
  CATALOG_COLLECTIONS,
  CATALOG_SCHEMA_VERSION,
  OFFICIAL_COSMIC_SPELL_ROWS,
  catalogEntryToSolarisItem,
  createOfficialCosmicSpellCatalog,
  filterCatalogEntries,
  findCatalogEntry,
  getCatalogEntryDetails,
  normalizeOfficialBook5Catalog,
  normalizeOfficialCatalogEntry,
} from "../src/domain/solaris-catalog-rules.js";

const root = projectRootFromHere();

function book5() {
  return loadGlobalScript(path.join(root, "official-book5-catalog.js"), "SOLARIS_OFFICIAL_BOOK5");
}

test("Fase 8 exporta schema e colecoes oficiais de catalogo", () => {
  assert.equal(CATALOG_SCHEMA_VERSION, 1);
  assert.equal(CATALOG_COLLECTIONS.WEAPONS, "weapons");
  assert.equal(CATALOG_COLLECTIONS.COSMIC_SPELLS, "cosmicSpells");
});

test("normalizeOfficialBook5Catalog estrutura todos os grupos do Livro 5", () => {
  const raw = book5();
  const catalog = normalizeOfficialBook5Catalog(raw);
  assert.equal(catalog.schemaVersion, CATALOG_SCHEMA_VERSION);
  assert.equal(catalog.counts.weapons, raw.catalog.weapons.length);
  assert.equal(catalog.counts.armors, raw.catalog.armors.length);
  assert.equal(catalog.counts.items, raw.catalog.items.length);
  assert.equal(catalog.counts.storage, raw.catalog.storage.length);
  assert.equal(catalog.counts.cubes, raw.catalog.cubes.length);
  assert.equal(catalog.counts.modifierChips, raw.catalog.modifierChips.length);
  assert.equal(catalog.counts.mods, raw.catalog.mods.length);
  assert.equal(catalog.counts.cosmicSpells, OFFICIAL_COSMIC_SPELL_ROWS.length);
  assert.ok(catalog.all.length > 400);
  assert.ok(catalog.templates.length >= 10);
  assert.ok(catalog.indexes.byCollection.weapons.length >= 30);
});

test("entrada de arma oficial preserva detalhes e mecanica", () => {
  const entry = normalizeOfficialCatalogEntry(book5().catalog.weapons[0], CATALOG_COLLECTIONS.WEAPONS, { book5: book5() });
  assert.equal(entry.collection, "weapons");
  assert.equal(entry.type, "weapon");
  assert.ok(entry.details.rows.some((row) => row.label === "Dano"));
  assert.ok(entry.mechanics.weapon.damageFormula);
  assert.equal(entry.mechanics.weapon.attackAttribute, "REF");
  assert.ok(entry.mechanics.ammo.ammoKind);
});

test("entrada de armadura oficial preserva CA, slots e rachaduras", () => {
  const entry = normalizeOfficialCatalogEntry(book5().catalog.armors[0], CATALOG_COLLECTIONS.ARMORS, { book5: book5() });
  assert.equal(entry.type, "armor");
  assert.ok(entry.mechanics.armor.caBonus >= 0);
  assert.ok(entry.mechanics.armor.modSlots >= 0);
  assert.equal(entry.mechanics.armor.crackMax, 5);
  assert.ok(entry.details.rows.some((row) => row.label === "CA"));
});

test("cubos e armazenamento sao catalogados como containers fisicos", () => {
  const catalog = normalizeOfficialBook5Catalog(book5());
  const cube = catalog.groups.cubes.find((entry) => entry.name === "Cubo Simples");
  const backpack = catalog.groups.storage.find((entry) => /mochila/i.test(entry.name));
  assert.equal(cube.type, "cube");
  assert.equal(cube.mechanics.storage.capacity, 1);
  assert.equal(cube.mechanics.storage.weightKg, 1);
  assert.equal(backpack.type, "container");
  assert.equal(backpack.mechanics.storage.kind, "backpack");
});

test("chips modificadores e mods ficam em formatos diferenciados", () => {
  const catalog = normalizeOfficialBook5Catalog(book5());
  const chip = catalog.groups.modifierChips[0];
  const mod = catalog.groups.mods[0];
  assert.equal(chip.type, "implant");
  assert.equal(chip.mechanics.ability.kind, "modifier-chip");
  assert.ok(chip.mechanics.chip.slots >= 1);
  assert.equal(mod.type, "mod");
  assert.ok(mod.mechanics.mod.slots >= 1);
});

test("habilidades cosmicas estruturadas possuem tier, custo e detalhes", () => {
  const spells = createOfficialCosmicSpellCatalog();
  assert.equal(spells.length, OFFICIAL_COSMIC_SPELL_ROWS.length);
  const rajada = spells.find((spell) => spell.name === "Rajada Cósmica");
  const extincao = spells.find((spell) => spell.name === "Extinção Local");
  assert.equal(rajada.tier, "F");
  assert.equal(rajada.mechanics.ability.cost, 1);
  assert.equal(extincao.tier, "S");
  assert.equal(extincao.mechanics.ability.cost, 10);
  assert.ok(rajada.details.rows.some((row) => row.label === "Efeito"));
});

test("busca e filtros usam indice estruturado", () => {
  const catalog = normalizeOfficialBook5Catalog(book5());
  const pistol = findCatalogEntry(catalog, "Pistola de Sucata");
  const filtered = filterCatalogEntries(catalog, { collection: "weapons", tier: "F", text: "pistola" });
  assert.equal(pistol.name, "Pistola de Sucata");
  assert.ok(filtered.some((entry) => entry.id === pistol.id));
  assert.ok(filterCatalogEntries(catalog, { type: "ability", tier: "S" }).length >= 1);
});

test("detalhes completos sao preparados para janela de dois cliques", () => {
  const catalog = normalizeOfficialBook5Catalog(book5());
  const entry = catalog.groups.items[0];
  const details = getCatalogEntryDetails(entry);
  assert.equal(details.title, entry.name);
  assert.ok(details.rows.length >= 3);
  assert.equal(details.officialData.Nome, entry.name);
  assert.ok(details.source.label);
});

test("entrada de catalogo vira solaris-item-v1 valido para exportacao", () => {
  const catalog = normalizeOfficialBook5Catalog(book5());
  const weaponItem = catalogEntryToSolarisItem(catalog.groups.weapons[0]);
  const modItem = catalogEntryToSolarisItem(catalog.groups.mods[0]);
  const spellItem = catalogEntryToSolarisItem(catalog.groups.cosmicSpells[0]);
  assert.equal(weaponItem.schema, "solaris-item-v1");
  assert.equal(weaponItem.type, "weapon");
  assert.equal(weaponItem.validation.ok, true);
  assert.equal(modItem.type, "mod");
  assert.equal(modItem.validation.ok, true);
  assert.equal(spellItem.type, "ability");
  assert.equal(spellItem.rules.mechanics.ability.kind, "cosmic-spell");
});
