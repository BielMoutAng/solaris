import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  CURRENT_OFFICIAL_BOOKS,
  OFFICIAL_DATA_FILES,
  loadGlobalScript,
  projectRootFromHere,
  runOfficialSourceAudit,
} from "../scripts/audit-official-sources.mjs";

const root = projectRootFromHere();

function loadOfficialData() {
  return Object.fromEntries(
    OFFICIAL_DATA_FILES.map(({ file, globalName }) => [
      file,
      loadGlobalScript(path.join(root, file), globalName),
    ])
  );
}

function walk(value, visitor, location = "root") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  visitor(value, location);
  Object.entries(value).forEach(([key, nested]) => walk(nested, visitor, `${location}.${key}`));
}

function allCatalogEntries(book5) {
  return Object.entries(book5.catalog || {}).flatMap(([category, entries]) => (
    Array.isArray(entries) ? entries.map((entry) => ({ ...entry, _categoryKey: category })) : []
  ));
}

test("arquivos official carregam e apontam para fontes oficiais atuais", () => {
  const data = loadOfficialData();
  const books = data["official-books-data.js"];
  const book5 = data["official-book5-catalog.js"];
  const compendium = data["official-rulebook-compendium.js"];

  assert.equal(books.schemaVersion, 2);
  assert.equal(book5.schemaVersion, 3);
  assert.equal(compendium.schemaVersion, 2);

  for (const [bookId, book] of Object.entries(CURRENT_OFFICIAL_BOOKS)) {
    assert.equal(books.sources[bookId], book.fileName);
  }

  assert.equal(book5.sourceFileCurrent, CURRENT_OFFICIAL_BOOKS.book5.fileName);
  assert.equal(book5.sourceStatus, "current-source-needs-review");
  assert.equal(compendium.sources.find((source) => source.id === "book1").file, CURRENT_OFFICIAL_BOOKS.book1.fileName);
  assert.equal(compendium.sources.find((source) => source.id === "book5").file, CURRENT_OFFICIAL_BOOKS.book5.fileName);
});

test("catalogo do Livro 5 possui governanca minima e dados mecanicos basicos", () => {
  const data = loadOfficialData();
  const book5 = data["official-book5-catalog.js"];
  const entries = allCatalogEntries(book5);

  assert.ok(entries.length > 100);
  assert.equal(book5.cubeWeightKg, 1);

  for (const entry of entries) {
    assert.ok(entry.name || entry.title || entry.label, `entrada sem nome: ${entry.id || entry._categoryKey}`);
    assert.ok(entry.category || entry.type || entry._categoryKey, `entrada sem categoria: ${entry.id || entry.name}`);
    assert.equal(entry.sourceFileCurrent, CURRENT_OFFICIAL_BOOKS.book5.fileName);
    assert.equal(entry.sourceStatus, "current-source-needs-review");

    const tier = String(entry.tier || "").trim();
    if (tier) assert.match(tier, /^(S\+?|A\+?|B\+?|C\+?|D\+?|E\+?|F\+?|I|II|III|IV|V|VI|VII|VIII|IX|X|Tier\s*[A-Z0-9+]+|[0-9]+)(\/(S\+?|A\+?|B\+?|C\+?|D\+?|E\+?|F\+?|I|II|III|IV|V|VI|VII|VIII|IX|X|[0-9]+))*$/i, `tier invalido em ${entry.name}: ${tier}`);

    for (const key of ["price", "cost", "basePrice", "preco"]) {
      if (typeof entry[key] === "number") assert.ok(entry[key] >= 0, `preco negativo em ${entry.name}`);
    }
  }
});

test("armas, armaduras e termos oficiais nao usam categorias legadas perigosas", () => {
  const data = loadOfficialData();
  const book5 = data["official-book5-catalog.js"];
  const entries = allCatalogEntries(book5);

  for (const entry of entries) {
    const categoryText = String([entry.category, entry.type, entry.subtype, ...(entry.tags || [])].join(" ")).toLowerCase();
    assert.notEqual(categoryText, "sniper", `categoria sniper encontrada em ${entry.name}`);
    assert.ok(!/\bslot de carga\b/i.test(categoryText), `termo slot de carga encontrado em ${entry.name}`);
    assert.ok(!/\b(paralatium|paralatun|paralaton|paralato)\b/i.test(categoryText), `grafia suspeita de paralatum em ${entry.name}`);

    if (entry._categoryKey === "weapons" || entry.category === "weapon") {
      assert.ok(entry.damage || entry.dano || entry.summary || entry.officialData, `arma sem dano/resumo: ${entry.name}`);
    }
    if (entry._categoryKey === "armors" || entry.category === "armor") {
      assert.ok(entry.ca !== undefined || entry.armorClass !== undefined || entry.summary || entry.officialData, `armadura sem CA/resumo: ${entry.name}`);
    }
  }
});

test("todo needsReview possui motivo e auditoria diagnostica roda", () => {
  const data = loadOfficialData();

  for (const [file, dataset] of Object.entries(data)) {
    walk(dataset, (entry, location) => {
      if (entry.needsReview) {
        assert.ok(entry.reviewReason, `${file} ${location} marcou needsReview sem reviewReason`);
      }
    });
  }

  const report = runOfficialSourceAudit({ root });
  assert.equal(report.officialFiles.length, 3);
  assert.equal(report.officialFiles.find((file) => file.file === "official-book5-catalog.js").sourceStatus, "current-source-needs-review");

  for (const signature of Object.values(report.bookSignatures)) {
    if (signature.found) {
      assert.ok(signature.paragraphs > 0);
      assert.ok(signature.characters > 0);
    }
  }
});
