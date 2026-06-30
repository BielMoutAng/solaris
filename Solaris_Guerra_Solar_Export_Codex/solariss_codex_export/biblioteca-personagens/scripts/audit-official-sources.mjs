import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

export const RECONCILIATION_DATE = "2026-06-23";

export const CURRENT_OFFICIAL_BOOKS = {
  book1: {
    id: "book1",
    title: "Livro Basico do Jogador",
    fileName: "Livro 1 base do jogador.docx",
    governs: ["racas", "atributos", "pericias", "criacao", "rolagens", "combate basico", "progressao"],
    appFiles: ["official-books-data.js", "official-rulebook-compendium.js", "app.js"],
    status: "current-source-needs-review"
  },
  book2: {
    id: "book2",
    title: "Guia do Mestre",
    fileName: "Livro_2_Guia_do_Mestre_rifles_corrigido.docx",
    governs: ["escudo", "encontros", "missoes", "viagem", "recompensas", "faccao", "hacking"],
    appFiles: ["official-rulebook-compendium.js", "src/domain/solaris-gm-rules.js", "app.js"],
    status: "current-source-needs-review"
  },
  book3: {
    id: "book3",
    title: "Bestiario",
    fileName: "Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx",
    governs: ["bestiario", "fichas de monstro", "loot", "recursos coletaveis"],
    appFiles: ["official-books-data.js", "official-rulebook-compendium.js", "src/domain/solaris-domain-architecture.js"],
    status: "current-source-needs-review"
  },
  book4: {
    id: "book4",
    title: "Cenarios e Historia",
    fileName: "Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx",
    governs: ["lore", "locais", "faccao", "povos", "NPCs", "ganchos"],
    appFiles: ["official-rulebook-compendium.js"],
    status: "current-source-needs-review"
  },
  book5: {
    id: "book5",
    title: "Itens, Equipamentos e Habilidades",
    fileName: "Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx",
    governs: ["armas", "armaduras", "itens", "cubos", "municoes", "mods", "chips", "magias", "crafting"],
    appFiles: ["official-book5-catalog.js", "official-books-data.js", "official-rulebook-compendium.js"],
    status: "current-source-needs-review"
  }
};

export const OLD_SOURCE_TERMS = [
  "livro 5 tabelas.docx",
  "CA_armaduras_corrigida",
  "COMPILADO_COMPLETO_FINAL",
  "Livro_5_Itens_Equipamentos_e_Habilidades_Guerra_Solar_formatado_enumerado",
  "Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado",
  "Livro_3_Bestiario_Guerra_Solar_Edicao_Visual",
  "livro 1 base para jogadores.docx"
];

export const OFFICIAL_DATA_FILES = [
  {
    file: "official-books-data.js",
    globalName: "SOLARIS_OFFICIAL_BOOKS"
  },
  {
    file: "official-book5-catalog.js",
    globalName: "SOLARIS_OFFICIAL_BOOK5"
  },
  {
    file: "official-rulebook-compendium.js",
    globalName: "SOLARIS_RULEBOOK_COMPENDIUM"
  }
];

export function projectRootFromHere() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

export function officialBookDirectory() {
  return path.join(
    process.env.USERPROFILE || "C:\\Users\\Gabriel",
    "Desktop",
    "Solaris",
    "livros de regras",
    "vers\u00e3o final"
  );
}

export function loadGlobalScript(filePath, globalName) {
  const source = fs.readFileSync(filePath, "utf8");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: filePath });
  return context.globalThis[globalName];
}

function readZipEntry(buffer, fileName) {
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === eocdSignature) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("EOCD not found");

  const centralDirectoryEntries = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  let offset = centralDirectoryOffset;

  for (let index = 0; index < centralDirectoryEntries; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("Invalid central directory");
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const entryName = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");

    if (entryName === fileName) {
      if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) throw new Error("Invalid local header");
      const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
      if (compressionMethod === 0) return compressed;
      if (compressionMethod === 8) return zlib.inflateRawSync(compressed);
      throw new Error(`Unsupported zip compression method ${compressionMethod}`);
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return null;
}

function decodeXmlText(xml) {
  return xml
    .replace(/<w:p[\s\S]*?>/g, "\n")
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function inspectDocxBook(filePath) {
  if (!fs.existsSync(filePath)) {
    return { found: false, filePath, chapters: [], headings: [], paragraphs: 0, tables: 0, characters: 0 };
  }

  const buffer = fs.readFileSync(filePath);
  const documentXml = readZipEntry(buffer, "word/document.xml");
  if (!documentXml) throw new Error(`word/document.xml not found in ${filePath}`);
  const xml = documentXml.toString("utf8");
  const text = decodeXmlText(xml);
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const headingPattern = /^(livro|capitulo|capítulo|apendice|apêndice|tabela)\b|^\d+(\.\d+){0,3}\s+/i;
  const headings = lines.filter((line) => headingPattern.test(line)).slice(0, 80);
  const chapters = lines.filter((line) => /^(capitulo|capítulo)\b/i.test(line)).slice(0, 80);

  return {
    found: true,
    filePath,
    sizeBytes: buffer.length,
    chapters,
    headings,
    paragraphs: (xml.match(/<w:p[\s>]/g) || []).length,
    tables: (xml.match(/<w:tbl[\s>]/g) || []).length,
    characters: text.length
  };
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

function countIssuesForData(file, data) {
  const issues = [];
  const oldSourceTerms = [];
  const raw = JSON.stringify(data);

  OLD_SOURCE_TERMS.forEach((term) => {
    if (raw.toLowerCase().includes(term.toLowerCase())) oldSourceTerms.push(term);
  });

  walk(data, (entry, location) => {
    if (location.includes(".officialData") || location.includes(".contentBlocks")) return;
    if (entry.needsReview && !entry.reviewReason) {
      issues.push({ file, location, type: "needs-review-without-reason" });
    }
    const looksLikeCatalogEntry = Boolean(entry.id || entry.category || entry.tier || entry.price || entry.cost);
    if (looksLikeCatalogEntry && !entry.name && !entry.title && !entry.label) {
      issues.push({ file, location, type: "entry-without-name" });
    }
    if ((entry.category === "weapon" || location.includes(".weapons[")) && !entry.damage && !entry.dano && !entry.damageFormula && !entry.summary) {
      issues.push({ file, location, type: "weapon-without-damage-or-summary" });
    }
    if ((entry.category === "armor" || location.includes(".armors[")) && entry.ca === undefined && entry.armorClass === undefined && !entry.summary) {
      issues.push({ file, location, type: "armor-without-ca-or-summary" });
    }
    const category = String(entry.category || entry.type || "").toLowerCase();
    if (category === "sniper") {
      issues.push({ file, location, type: "legacy-sniper-category" });
    }
  });

  return { oldSourceTerms, issues };
}

export function runOfficialSourceAudit({ root = projectRootFromHere() } = {}) {
  const bookDir = officialBookDirectory();
  const bookSignatures = Object.fromEntries(
    Object.entries(CURRENT_OFFICIAL_BOOKS).map(([id, book]) => [
      id,
      inspectDocxBook(path.join(bookDir, book.fileName))
    ])
  );

  const officialFiles = OFFICIAL_DATA_FILES.map(({ file, globalName }) => {
    const filePath = path.join(root, file);
    const data = loadGlobalScript(filePath, globalName);
    const issueSummary = countIssuesForData(file, data);
    const counts = {};

    if (data.catalog && typeof data.catalog === "object") {
      Object.entries(data.catalog).forEach(([key, value]) => {
        if (Array.isArray(value)) counts[key] = value.length;
      });
    }
    if (Array.isArray(data.sources)) counts.sources = data.sources.length;
    if (Array.isArray(data.sections)) counts.sections = data.sections.length;
    if (Array.isArray(data.templates)) counts.templates = data.templates.length;
    if (Array.isArray(data.bestiary)) counts.bestiary = data.bestiary.length;
    if (Array.isArray(data.rules)) counts.rules = data.rules.length;

    return {
      file,
      schemaVersion: data.schemaVersion,
      sourceStatus: data.sourceStatus || data.sourceGovernance?.sourceStatus || "unknown",
      sourceLastReconciledAt: data.sourceLastReconciledAt || data.sourceGovernance?.sourceLastReconciledAt || null,
      counts,
      oldSourceTerms: issueSummary.oldSourceTerms,
      issues: issueSummary.issues.slice(0, 50)
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    reconciliationDate: RECONCILIATION_DATE,
    bookDirectory: bookDir,
    books: CURRENT_OFFICIAL_BOOKS,
    bookSignatures,
    officialFiles
  };
}

function printHumanReport(report) {
  console.log("# Solaris official source audit");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Reconciled at: ${report.reconciliationDate}`);
  console.log(`Book dir: ${report.bookDirectory}`);
  console.log("");
  console.log("## Books");
  Object.entries(report.bookSignatures).forEach(([id, signature]) => {
    const book = report.books[id];
    console.log(`- ${id}: ${book.fileName}`);
    console.log(`  found=${signature.found} paragraphs=${signature.paragraphs} tables=${signature.tables} characters=${signature.characters}`);
    if (signature.chapters.length) console.log(`  chapters=${signature.chapters.slice(0, 6).join(" | ")}`);
  });
  console.log("");
  console.log("## Data files");
  report.officialFiles.forEach((file) => {
    console.log(`- ${file.file}: schema=${file.schemaVersion} status=${file.sourceStatus} reconciled=${file.sourceLastReconciledAt}`);
    console.log(`  counts=${JSON.stringify(file.counts)}`);
    if (file.oldSourceTerms.length) console.log(`  oldSourceTerms=${file.oldSourceTerms.join(", ")}`);
    if (file.issues.length) console.log(`  issues=${file.issues.length} first=${JSON.stringify(file.issues[0])}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = runOfficialSourceAudit();
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else printHumanReport(report);
}
