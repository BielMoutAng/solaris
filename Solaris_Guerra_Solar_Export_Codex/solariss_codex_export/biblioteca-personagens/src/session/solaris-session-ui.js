import {
  GAME_EVENT_TYPES,
  GameRoom,
  Scene,
  SESSION_ROLES,
  estimateEncounterBalance,
} from "./solaris-session-domain.js?v=20260624g";
import {
  SESSION_SOCKET_EVENTS,
  SolarisSessionClient,
} from "./solaris-session-client.js?v=20260624g";
import {
  ACTIVE_CAMPAIGN_STORAGE_KEY,
  CAMPAIGN_STORAGE_KEY,
  RECOVERY_STORAGE_KEY,
  createAutosave,
  createCampaign,
  createSessionExportBundle,
  getRecentRecovery,
  migrateCampaign,
  migrateSessionState,
  parseCampaignList,
  parseSessionExportBundle,
  serializeCampaignList,
  upsertCampaignSession,
} from "./solaris-session-persistence.js?v=20260624g";
import {
  createSessionMonsterFromBestiary,
  estimateEncounterThreat as estimateBestiaryEncounterThreat,
  estimateMonsterThreat as estimateBestiaryMonsterThreat,
  computeMonsterAttackProfile,
  computeMonsterDamageProfile,
  normalizeMonsterEntry,
  resolveMonsterAttack,
} from "../domain/solaris-bestiary-rules.js?v=20260624g";
import {
  computeMissionRisk,
  computeTravelDifficulty,
  generateMissionSeed,
  generateTravelEventSeed,
} from "../domain/solaris-gm-rules.js?v=20260624g";
import {
  LORE_ENTRY_TYPES,
  LORE_IMPORTANCE_LEVELS,
  LORE_SECRET_LEVELS,
  filterLoreEntries,
  hydrateLoreState,
  rankLoreSearchResults,
  searchLoreEntries,
} from "../domain/solaris-lore-rules.js?v=20260624g";

const SESSION_SAVE_KEY = "solaris.virtual.table.session.v1";
const PLAYER_SESSION_KEY = "solaris.virtual.table.playerId";
const TABLETOP_APP_VERSION = "0.6.0-alpha.21";
const DEFAULT_REPORT_OPTIONS = Object.freeze({
  includeFullChat: false,
  includeSecretNotes: false,
  includeTechnicalLogs: false,
  includeTransactions: true,
  includeCombat: true,
  includeLoot: true,
  includeCounters: true,
  includeEnvironment: true,
  includePending: true,
  includeScenes: true,
  includeEncounters: true,
  includeObjectives: true,
  includeGmCampaign: true,
});
const SHIELD_SECTION_LABELS = [
  "Testes",
  "Dificuldades",
  "Vantagem",
  "Desvantagem",
  "Estresse",
  "Ações de Combate",
  "Cobertura",
  "Condições",
  "Cura",
  "Recuperação",
  "Equipamento",
  "Cubos",
  "Dano Improvisado",
  "Inventário",
  "Rachaduras",
  "Cosmos",
  "Lembretes do Mestre",
];

function createId(prefix = "ui") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTime(value = new Date().toISOString()) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "--:--";
  }
}

function pct(current, max) {
  if (!max) return 0;
  return clamp((Number(current) / Number(max)) * 100, 0, 100);
}

function gridLabel(x = 1, y = 1) {
  const column = Math.max(1, Math.floor(Number(x) || 1));
  const row = Math.max(1, Math.floor(Number(y) || 1));
  return `${String.fromCharCode(64 + Math.min(26, column))}${row}`;
}

function normalizeScene(scene = {}, currentCharacter = {}) {
  const columns = Math.max(4, Number(scene.columns || 12));
  const rows = Math.max(4, Number(scene.rows || 8));
  return {
    id: scene.id || "local-scene",
    name: scene.name || "Corredor de Manutencao - Nivel 2",
    notes: scene.notes || "Mapa tatico com grid, tokens e zonas da cena.",
    description: scene.description || scene.notes || "",
    mapImage: scene.mapImage || "",
    gridSize: Number(scene.gridSize || 64),
    gridVisible: scene.gridVisible !== false,
    gridOpacity: Number(scene.gridOpacity ?? 0.38),
    gridColor: scene.gridColor || "#1aa8ff",
    snapToGrid: scene.snapToGrid !== false,
    metersPerCell: Number(scene.metersPerCell || 1.5),
    columns,
    rows,
    tokens: Array.isArray(scene.tokens) ? scene.tokens : [{
      id: `token-character-${currentCharacter.id || "local-character"}`,
      entityType: "character",
      entityId: currentCharacter.id || "local-character",
      name: currentCharacter.name || "Personagem",
      x: 2,
      y: 3,
      image: currentCharacter.portrait || "",
      color: "#39cfff",
    }],
    zones: Array.isArray(scene.zones) ? scene.zones : [],
    areas: Array.isArray(scene.areas) ? scene.areas : [],
    measurements: Array.isArray(scene.measurements) ? scene.measurements : [],
    objectives: Array.isArray(scene.objectives) ? scene.objectives : [],
  };
}

function tokenInitial(token = {}) {
  return String(token.name || token.entityType || "S").trim().slice(0, 1).toUpperCase() || "S";
}

function tokenKindClass(token = {}) {
  if (token.hidden) return "hidden";
  if (token.entityType === "monster") return "enemy";
  return "ally";
}

function tokenGridStyle(token = {}, scene = {}) {
  const columns = Math.max(4, Number(scene.columns || 12));
  const rows = Math.max(4, Number(scene.rows || 8));
  const x = clamp(Number(token.x || 1), 1, columns);
  const y = clamp(Number(token.y || 1), 1, rows);
  const left = ((x - 0.5) / columns) * 100;
  const top = ((y - 0.5) / rows) * 100;
  const color = token.color || (token.entityType === "monster" ? "#ff4e63" : "#39cfff");
  return `--x:${left}%;--y:${top}%;--token-color:${escapeHtml(color)};--token-size:${Math.max(1, Number(token.size || 1))};`;
}

function zoneGridStyle(zone = {}, scene = {}) {
  const columns = Math.max(4, Number(scene.columns || 12));
  const rows = Math.max(4, Number(scene.rows || 8));
  const x = clamp(Number(zone.x || 1), 1, columns);
  const y = clamp(Number(zone.y || 1), 1, rows);
  const width = clamp(Number(zone.width || 1), 1, columns);
  const height = clamp(Number(zone.height || 1), 1, rows);
  return [
    `--zone-x:${((x - 1) / columns) * 100}%`,
    `--zone-y:${((y - 1) / rows) * 100}%`,
    `--zone-w:${(width / columns) * 100}%`,
    `--zone-h:${(height / rows) * 100}%`,
  ].join(";");
}

function areaGridStyle(area = {}, scene = {}) {
  const columns = Math.max(4, Number(scene.columns || 12));
  const rows = Math.max(4, Number(scene.rows || 8));
  const x = clamp(Number(area.x || 1), 1, columns);
  const y = clamp(Number(area.y || 1), 1, rows);
  const radius = Math.max(0.5, Number(area.radius || area.length || 2));
  const length = Math.max(1, Number(area.length || radius || 3));
  const width = Math.max(1, Number(area.width || 1));
  const direction = String(area.direction || "east").toLowerCase();
  const vertical = ["north", "south"].includes(direction);
  const rotation = direction === "south" ? 90 : direction === "west" ? 180 : direction === "north" ? 270 : 0;
  const directional = ["line", "cone", "rectangle"].includes(area.type);
  const centerX = directional
    ? x + (direction === "east" ? length / 2 : direction === "west" ? -length / 2 : 0)
    : x;
  const centerY = directional
    ? y + (direction === "south" ? length / 2 : direction === "north" ? -length / 2 : 0)
    : y;
  const left = ((clamp(centerX, 1, columns) - 0.5) / columns) * 100;
  const top = ((clamp(centerY, 1, rows) - 0.5) / rows) * 100;
  const w = area.type === "line" || area.type === "rectangle"
    ? ((vertical ? width : length) / columns) * 100
    : area.type === "cone"
      ? ((vertical ? width : length) / columns) * 100
      : ((radius * 2) / columns) * 100;
  const h = area.type === "line" || area.type === "rectangle"
    ? Math.max(2.5, ((vertical ? length : width) / rows) * 100)
    : area.type === "cone"
      ? ((vertical ? length : width) / rows) * 100
      : ((radius * 2) / rows) * 100;
  return [
    `--area-x:${left}%`,
    `--area-y:${top}%`,
    `--area-w:${w}%`,
    `--area-h:${h}%`,
    `--area-color:${escapeHtml(area.color || "#9b4dff")}`,
    `--area-rotation:${rotation}deg`,
  ].join(";");
}

function measurementStyle(measurement = {}, scene = {}) {
  const columns = Math.max(4, Number(scene.columns || 12));
  const rows = Math.max(4, Number(scene.rows || 8));
  const from = measurement.from || {};
  const to = measurement.to || {};
  const x1 = ((clamp(from.x || 1, 1, columns) - 0.5) / columns) * 100;
  const y1 = ((clamp(from.y || 1, 1, rows) - 0.5) / rows) * 100;
  const x2 = ((clamp(to.x || 1, 1, columns) - 0.5) / columns) * 100;
  const y2 = ((clamp(to.y || 1, 1, rows) - 0.5) / rows) * 100;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return [
    `--measure-x:${x1}%`,
    `--measure-y:${y1}%`,
    `--measure-length:${length}%`,
    `--measure-angle:${angle}deg`,
  ].join(";");
}

function visibleSceneItems(items = [], isGm = false) {
  return isGm ? items : items.filter((item) => !item.hidden && item.visibleToPlayers !== false);
}

function destinationLabel(kind = "unassigned") {
  const labels = {
    unassigned: "Sem local definido",
    active: "Ativo",
    inventory: "Inventario",
    equip: "Equipar apos compra",
    backpack: "Mochila",
    cube: "Cubo",
    holster: "Coldre",
    bandolier: "Bandoleira",
    hook: "Gancho",
  };
  return labels[kind] || kind;
}

function directionLabel(direction = "east") {
  const labels = {
    east: "Leste",
    west: "Oeste",
    north: "Norte",
    south: "Sul",
  };
  return labels[direction] || direction;
}

function rollPool(count = 3, sides = 6, bonus = 0) {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return {
    rolls,
    total: rolls.reduce((sum, value) => sum + value, 0) + Number(bonus || 0),
  };
}

function parseDiceFormula(formula = "1d6") {
  const normalized = String(formula || "1d6").replace(/\s+/g, "");
  const match = normalized.match(/^(\d*)d(\d+)([+-]\d+)?/i);
  if (!match) return null;
  return {
    count: Math.max(1, Number(match[1] || 1)),
    sides: Math.max(2, Number(match[2] || 6)),
    bonus: Number(match[3] || 0),
    formula: normalized,
  };
}

export function paginateItems(items = [], page = 1, pageSize = 20) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePageSize = Math.max(1, Math.floor(Number(pageSize) || 20));
  const totalPages = Math.max(1, Math.ceil(safeItems.length / safePageSize));
  const currentPage = clamp(Math.floor(Number(page) || 1), 1, totalPages);
  const start = (currentPage - 1) * safePageSize;
  return {
    items: safeItems.slice(start, start + safePageSize),
    page: currentPage,
    pageSize: safePageSize,
    totalItems: safeItems.length,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

const SHOP_CATEGORY_LABELS = {
  all: "Todos",
  featured: "Destaque",
  common: "Itens comuns",
  weapon: "Armas",
  armor: "Armaduras",
  cube: "Cubos",
  backpack: "Mochilas",
  holster: "Coldres",
  bandolier: "Bandoleiras",
  hook: "Ganchos",
  chip: "Chips modificadores",
  spell: "Magias cosmicas",
  consumable: "Consumiveis",
  utility: "Utilitarios",
  material: "Materiais",
  service: "Servicos",
};

const SHOP_MODE_LABELS = {
  library: "Biblioteca",
  session: "Sessao",
  master: "Mestre",
};

const SHOP_RARITY_LABELS = {
  all: "Todas as raridades",
  comum: "Comum",
  incomum: "Incomum",
  raro: "Raro",
  epico: "Epico",
  lendario: "Lendario",
};

const SHOP_RARITY_RANK = {
  comum: 1,
  incomum: 2,
  raro: 3,
  epico: 4,
  lendario: 5,
};

function normalizeSearch(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function activeRouteView() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search || "");
  return params.get("view") || params.get("start") || "";
}

function shieldFallbackRules() {
  return [
    { id: "fallback-testes", title: "Testes", category: "Testes", summary: "Role 1d20 ou 3d6 conforme a regra pedida, some atributo, treinamento e bônus/penalidades. Compare com a CD definida pelo mestre.", source: "Fallback local" },
    { id: "fallback-dificuldades", title: "Dificuldades", category: "Dificuldades", summary: "Muito fácil 5, fácil 10, moderado 15, difícil 20, muito difícil 25, extremo 30+.", source: "Fallback local" },
    { id: "fallback-vantagem", title: "Vantagem e Desvantagem", category: "Vantagem/Desvantagem", summary: "Vantagem rola duas vezes e usa o melhor resultado. Desvantagem usa o pior. Efeitos equivalentes se anulam.", source: "Fallback local" },
    { id: "fallback-estresse", title: "Estresse", category: "Estresse", summary: "Estresse representa pressão, trauma e desgaste. Em níveis críticos, reduza dados ou aplique efeitos narrativos conforme a cena.", source: "Fallback local" },
    { id: "fallback-combate", title: "Ações de Combate", category: "Ações de Combate", summary: "Atacar, mover, usar item, defender, esquivar, interagir, conjurar habilidade ou preparar uma ação.", source: "Fallback local" },
    { id: "fallback-cobertura", title: "Cobertura", category: "Cobertura", summary: "Sem cobertura +0, cobertura parcial +2, cobertura 3/4 +5, cobertura total impede ataques sem linha de visão.", source: "Fallback local" },
    { id: "fallback-condicoes", title: "Condições", category: "Condições", summary: "Atordoado, envenenado, sangrando, queimando, congelado, marcado, hackeado e incapacitado alteram ações, dano ou recuperação.", source: "Fallback local" },
    { id: "fallback-cura", title: "Cura e Recuperação", category: "Cura e Recuperação", summary: "Kits, descanso, medicina e habilidades recuperam PV, estabilizam personagens e removem condições quando permitido.", source: "Fallback local" },
    { id: "fallback-equipamento", title: "Equipamento e Cubos", category: "Equipamento e Cubos", summary: "Cubos pesam 1 kg. Itens fora do cubo, exceto equipados, contam para carga. Itens sem local são aviso visual.", source: "Fallback local" },
    { id: "fallback-dano-improvisado", title: "Dano Improvisado", category: "Dano Improvisado", summary: "Use 1d6 para impactos leves, 2d6 para riscos moderados e aumente conforme escala, queda, explosão ou ambiente.", source: "Fallback local" },
    { id: "fallback-inventario", title: "Regras de Inventário", category: "Regras de Inventário", summary: "Mochilas, coldres, bandoleiras, ganchos e cubos definem onde o item está e se ele pesa na sobrecarga.", source: "Fallback local" },
    { id: "fallback-rachaduras", title: "Rachaduras", category: "Rachaduras", summary: "Equipamentos acumulam rachaduras. No limite, ficam quebrados ou entram em colapso conforme a ficha do item.", source: "Fallback local" },
    { id: "fallback-cosmos", title: "Cosmos", category: "Cosmos", summary: "Cosmos alimenta magias e efeitos especiais. O acesso pode vir de treino, equipamento, chips ou grimórios.", source: "Fallback local" },
    { id: "fallback-lembretes", title: "Lembretes do Mestre", category: "Lembretes do Mestre", summary: "Mostre consequência, mantenha pressão, use pistas e deixe escolhas alterarem a campanha.", source: "Fallback local" },
  ];
}

function officialRulebookSections() {
  const compendium = globalThis.SOLARIS_RULEBOOK_COMPENDIUM || {};
  return Array.isArray(compendium.sections) ? compendium.sections : [];
}

function buildShieldRules(query = "") {
  const normalizedQuery = normalizeSearch(query);
  const wanted = SHIELD_SECTION_LABELS.map(normalizeSearch);
  const official = officialRulebookSections()
    .filter((section) => {
      const haystack = normalizeSearch([
        section.title,
        section.name,
        section.summary,
        section.bookLabel,
        section.bookTitle,
        ...(section.tags || []),
      ].join(" "));
      const categoryMatch = wanted.some((label) => haystack.includes(label));
      const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
      return queryMatch && (categoryMatch || normalizedQuery);
    })
    .slice(0, 36)
    .map((section) => ({
      id: section.id,
      title: section.title || section.name,
      category: section.bookLabel || "Regra",
      summary: section.summary || (section.contentBlocks || []).map((block) => block.text).filter(Boolean).slice(0, 2).join(" "),
      source: [section.bookLabel, section.number].filter(Boolean).join(" "),
      blocks: section.contentBlocks || [],
    }));
  const fallback = shieldFallbackRules().filter((rule) => {
    if (!normalizedQuery) return true;
    return normalizeSearch([rule.title, rule.category, rule.summary].join(" ")).includes(normalizedQuery);
  });
  const seen = new Set();
  return [...official, ...fallback].filter((rule) => {
    if (!rule.id || seen.has(rule.id)) return false;
    seen.add(rule.id);
    return true;
  });
}

function campaignStats(campaign = {}) {
  const sessions = Array.isArray(campaign.sessions) ? campaign.sessions : [];
  const latestSession = sessions[0] || {};
  return {
    sessions: sessions.length,
    scenes: (campaign.sceneList || campaign.scenes || latestSession.sceneList || []).length,
    characters: (campaign.characters || latestSession.characters || []).length,
    autosaves: (campaign.autosaves || []).length,
    snapshots: (campaign.autosaves || []).filter((entry) => normalizeSearch(entry.label).includes("snapshot")).length,
    lastSession: latestSession.roomName || latestSession.name || "Sem sessão salva",
  };
}

function monsterThreatScore(monster = {}) {
  return Math.max(1, Math.round(estimateBestiaryMonsterThreat(monster).score * 100));
}

function monsterMatchesEncounterFilters(monster = {}, filters = {}) {
  const haystack = normalizeSearch([
    monster.name,
    monster.type,
    monster.role,
    monster.habitat,
    monster.faction,
    monster.origin,
    monster.summary,
  ].join(" "));
  const query = normalizeSearch(filters.query || "");
  const tier = String(filters.tier || "all");
  const type = normalizeSearch(filters.type || "all");
  const habitat = normalizeSearch(filters.habitat || "all");
  const role = normalizeSearch(filters.role || "all");
  const faction = normalizeSearch(filters.faction || "all");
  if (query && !haystack.includes(query)) return false;
  if (tier !== "all" && String(monster.tier || "").toLowerCase() !== tier.toLowerCase()) return false;
  if (type !== "all" && !haystack.includes(type)) return false;
  if (habitat !== "all" && !haystack.includes(habitat)) return false;
  if (role !== "all" && !haystack.includes(role)) return false;
  if (faction !== "all" && !haystack.includes(faction)) return false;
  return true;
}

function numberFromPrice(value = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value || "0").replace(/\./g, "").replace(",", ".");
  const found = normalized.match(/\d+(?:\.\d+)?/);
  return found ? Number(found[0]) : 0;
}

function inferShopCategory(item = {}, fallback = "common") {
  const text = normalizeSearch([item.category, item.type, item.name, ...(item.tags || [])].join(" "));
  if (item.category === "weapon" || text.includes("arma")) return "weapon";
  if (item.category === "armor" || text.includes("armadura")) return "armor";
  if (item.category === "cube" || text.includes("cubo")) return "cube";
  if (text.includes("mochila")) return "backpack";
  if (text.includes("coldre")) return "holster";
  if (text.includes("bandoleira")) return "bandolier";
  if (text.includes("gancho")) return "hook";
  if (item.category === "chip" || text.includes("chip")) return "chip";
  if (item.category === "cosmos" || text.includes("magia")) return "spell";
  if (item.consumable || text.includes("consumivel") || text.includes("uso unico")) return "consumable";
  if (text.includes("material")) return "material";
  if (text.includes("servico") || text.includes("serviço")) return "service";
  if (text.includes("utilitario") || text.includes("utilitario")) return "utility";
  return fallback;
}

function inferShopRarity(item = {}) {
  const raw = normalizeSearch(item.rarity || item.raridade || item.quality || item.rank || item.tier || "");
  if (raw.includes("lend")) return "lendario";
  if (raw.includes("epic") || raw.includes("epico")) return "epico";
  if (raw.includes("raro") || raw.includes("rare")) return "raro";
  if (raw.includes("incom")) return "incomum";
  return "comum";
}

function formatLuzentis(value = 0) {
  return `${Math.max(0, Number(value || 0)).toLocaleString("pt-BR")} ℓ`;
}

function encodeDestination(destination = {}) {
  const kind = String(destination.kind || "unassigned");
  const id = String(destination.id || destination.containerId || "");
  return id ? `${kind}:${id}` : kind;
}

function decodeDestination(value = "unassigned") {
  const [kind = "unassigned", ...rest] = String(value || "unassigned").split(":");
  const id = rest.join(":");
  return id ? { kind, id, containerId: id } : { kind };
}

function storageKindForItem(item = {}) {
  const text = normalizeSearch([item.category, item.type, item.name, item.itemId, item.sessionCategory, ...(item.tags || [])].join(" "));
  if (text.includes("cubo")) return "cube";
  if (text.includes("mochila")) return "backpack";
  if (text.includes("coldre")) return "holster";
  if (text.includes("bandoleira")) return "bandolier";
  if (text.includes("gancho")) return "hook";
  return "";
}

function normalizeShopCatalogItem(item = {}, fallbackCategory = "common") {
  const category = inferShopCategory(item, fallbackCategory);
  const rarity = inferShopRarity(item);
  const tags = Array.isArray(item.tags) ? item.tags.map(String) : String(item.tags || "").split(",").map((entry) => entry.trim()).filter(Boolean);
  const price = Math.max(0, numberFromPrice(item.price ?? item.cost ?? item.officialData?.["Preco em Lz"] ?? item.officialData?.["Preço em Lz"]));
  return {
    ...item,
    id: String(item.id || item.uid || createId("shop-catalog")),
    name: String(item.name || "Item sem nome"),
    sessionCategory: category,
    categoryLabel: SHOP_CATEGORY_LABELS[category] || "Item",
    tier: String(item.tier || item.rank || item.cost || ""),
    rarity,
    rarityLabel: SHOP_RARITY_LABELS[rarity] || "Comum",
    tags,
    price,
    stock: item.stock ?? item.estoque ?? item.quantityAvailable ?? "",
    weight: item.weight || item.peso || "",
    summary: item.summary || item.effect || item.description || "",
    source: item.source || "Catalogo Solaris",
    type: item.type || item.category || category,
    requiresApproval: item.requiresApproval ?? item.requerAprovacao ?? false,
  };
}

function defaultSessionShopCatalog() {
  const catalog = globalThis.SOLARIS_OFFICIAL_BOOK5?.catalog || {};
  return [
    ...arrayFromCatalog(catalog.items, "common"),
    ...arrayFromCatalog(catalog.weapons, "weapon"),
    ...arrayFromCatalog(catalog.armors, "armor"),
    ...arrayFromCatalog(catalog.cubes, "cube"),
    ...arrayFromCatalog(catalog.storage, "utility"),
    ...arrayFromCatalog(catalog.modifierChips, "chip"),
    ...arrayFromCatalog(catalog.mods, "utility"),
  ];
}

function arrayFromCatalog(items = [], category = "common") {
  return Array.isArray(items) ? items.map((item) => normalizeShopCatalogItem(item, category)) : [];
}

function cartLineTotal(line = {}) {
  return Math.max(0, numberFromPrice(line.price ?? line.item?.price)) * Math.max(1, Number(line.quantity || 1));
}

function sessionPlayerId() {
  try {
    const stored = sessionStorage.getItem(PLAYER_SESSION_KEY);
    if (stored) return stored;
    const id = createId("player");
    sessionStorage.setItem(PLAYER_SESSION_KEY, id);
    return id;
  } catch {
    return createId("player");
  }
}

function safeReadStorage(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function readCampaignsFromStorage() {
  try {
    return parseCampaignList(safeReadStorage(CAMPAIGN_STORAGE_KEY, "[]"));
  } catch {
    return [];
  }
}

function writeCampaignsToStorage(campaigns = []) {
  return safeWriteStorage(CAMPAIGN_STORAGE_KEY, serializeCampaignList(campaigns));
}

function readActiveCampaignId() {
  return safeReadStorage(ACTIVE_CAMPAIGN_STORAGE_KEY, "");
}

function writeActiveCampaignId(campaignId = "") {
  return safeWriteStorage(ACTIVE_CAMPAIGN_STORAGE_KEY, String(campaignId || ""));
}

function downloadJsonFile(filename = "solaris-session.json", data = {}) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadTextFile(filename = "solaris-relatorio.md", text = "") {
  const blob = new Blob([String(text || "")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function characterSnapshot(character = {}) {
  const maxPV = Number(character.maxPV ?? character.pvMax ?? character.pvMaximo ?? 8);
  const currentPV = Number(character.currentPV ?? character.pvCurrent ?? character.pvAtual ?? maxPV);
  const cosmosMax = Number(character.cosmosMax ?? 0);
  const cosmosCurrent = Number(character.cosmosCurrent ?? 0);
  return {
    ...character,
    id: character.id || character.characterId || "local-character",
    characterId: character.characterId || character.id || "local-character",
    ownerId: character.ownerId || character.ownerPlayerId || "",
    name: character.name || "Personagem sem nome",
    player: character.player || "Jogador local",
    race: character.race || "Humanis",
    profession: character.profession || "Sem profissao",
    xp: Number(character.xp || character.experience || 0),
    level: Number(character.level || 1),
    currentPV,
    maxPV,
    pvCurrent: currentPV,
    cosmosCurrent,
    cosmosMax,
    stress: Number(character.stress || 0),
    stressMax: Number(character.stressMax || 7),
    ca: Number(character.ca || 2),
    movement: Number(character.movement || 4),
    initiative: Number(character.initiative || 0),
    weapon: character.weapon || "Arma nao equipada",
    armor: character.armor || "Armadura nao equipada",
    portrait: character.portrait || character.photoDataUrl || "",
    inventory: Array.isArray(character.inventory) ? character.inventory : [],
    unassignedItems: Array.isArray(character.unassignedItems) ? character.unassignedItems : [],
    equipment: character.equipment || {},
    cosmicSpells: Array.isArray(character.cosmicSpells) ? character.cosmicSpells : [],
    modifierChips: Array.isArray(character.modifierChips) ? character.modifierChips : [],
    abilities: Array.isArray(character.abilities) ? character.abilities : [],
    conditions: Array.isArray(character.conditions) ? character.conditions : [],
    currency: Number(character.currency ?? character.luzentis ?? 0),
    luzentis: Number(character.luzentis ?? character.currency ?? 0),
    revision: Number(character.revision || character.metadata?.revision || 0),
  };
}

function combatantFromCharacter(character = {}, ownerPlayerId = "local-player") {
  const snapshot = characterSnapshot(character);
  return {
    id: snapshot.id,
    entityId: snapshot.id,
    entityType: "character",
    kind: "character",
    ownerPlayerId,
    name: snapshot.name,
    portrait: snapshot.portrait,
    initiative: Number(character.initiative || 0),
    currentPV: snapshot.currentPV,
    maxPV: snapshot.maxPV,
    pvAtual: snapshot.currentPV,
    pvMax: snapshot.maxPV,
    cosmosCurrent: snapshot.cosmosCurrent,
    cosmosMax: snapshot.cosmosMax,
    stress: snapshot.stress,
    stressMax: snapshot.stressMax,
    ca: snapshot.ca,
    movement: snapshot.movement,
    conditions: Array.isArray(character.conditions) ? character.conditions : [],
    isDefeated: snapshot.currentPV <= 0,
  };
}

function normalizeMonsterForSession(monster = {}) {
  const normalized = normalizeMonsterEntry(monster);
  return createSessionMonsterFromBestiary(normalized, {
    id: monster.instanceId || `${normalized.id || "monster"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  });
}

function combatantFromMonster(monster = {}) {
  const snapshot = monster.snapshot || monster;
  const maxPV = Number(snapshot.maxPV ?? snapshot.pvMax ?? snapshot.pv ?? 24);
  const currentPV = Number(snapshot.currentPV ?? snapshot.pvAtual ?? snapshot.pvCurrent ?? maxPV);
  return {
    id: monster.id || snapshot.id,
    entityId: monster.id || snapshot.id,
    entityType: "monster",
    kind: "monster",
    name: monster.name || snapshot.name || "Monstro",
    portrait: snapshot.imageDataUrl || snapshot.image || "",
    initiative: Number(snapshot.initiative || 0),
    currentPV,
    maxPV,
    pvAtual: currentPV,
    pvMax: maxPV,
    ca: Number(snapshot.ca || 0),
    movement: Number(snapshot.movement ?? snapshot.movimento ?? 0),
    tier: snapshot.tier || "",
    type: snapshot.type || "",
    role: snapshot.role || "",
    attacks: snapshot.attacks || [],
    abilities: snapshot.abilities || [],
    conditions: Array.isArray(monster.conditions) ? monster.conditions : [],
    isDefeated: currentPV <= 0,
  };
}

function normalizeCombatState(room = {}, currentCharacter = {}) {
  const characterCombatant = combatantFromCharacter(currentCharacter);
  const monsters = Array.isArray(room.monsters) ? room.monsters : [];
  const combat = room.combat || {};
  const sourceCombatants = Array.isArray(combat.combatants) && combat.combatants.length
    ? combat.combatants
    : [characterCombatant, ...monsters.map(combatantFromMonster)];
  const combatants = sourceCombatants.map((combatant) => ({
    ...combatant,
    entityType: combatant.entityType || combatant.kind || "character",
    kind: combatant.kind || combatant.entityType || "character",
    entityId: combatant.entityId || combatant.id,
    currentPV: Number(combatant.currentPV ?? combatant.pvAtual ?? 0),
    maxPV: Number(combatant.maxPV ?? combatant.pvMax ?? 0),
    initiative: Number(combatant.initiative || 0),
    conditions: Array.isArray(combatant.conditions) ? combatant.conditions : [],
  }));
  const entries = Array.isArray(combat.entries) && combat.entries.length
    ? combat.entries
    : Array.isArray(room.initiative) && room.initiative.length
      ? room.initiative
      : combatants.map((combatant) => ({
        entityType: combatant.entityType,
        entityId: combatant.entityId,
        name: combatant.name,
        initiative: combatant.initiative,
      }));
  return {
    active: Boolean(combat.active),
    round: Number(combat.round || 0),
    turnIndex: Math.max(0, Number(combat.turnIndex || 0)),
    entries,
    combatants,
    log: Array.isArray(combat.log) ? combat.log : [],
  };
}

function combatantSummary(combatant = {}) {
  const type = combatant.entityType === "monster" ? "Monstro" : "Personagem";
  const details = [type, combatant.tier ? `Tier ${combatant.tier}` : "", combatant.role || combatant.type || ""].filter(Boolean);
  return details.join(" - ");
}

function demoPlayers(localCharacter) {
  const active = characterSnapshot(localCharacter);
  return [
    {
      id: "local-player",
      name: active.name,
      role: SESSION_ROLES.GM,
      isGM: true,
      classLine: `${active.race} - ${active.profession}`,
      level: active.level,
      online: true,
      pv: active.currentPV,
      pvMax: active.maxPV,
      ca: active.ca,
      portrait: active.portrait,
      selected: true,
    },
    { id: "p2", name: "Drax Voren", classLine: "Soldado - Nivel 5", level: 5, online: true, pv: 44, pvMax: 44, ca: 17 },
    { id: "p3", name: "Zephra N'Kai", classLine: "Tecnomante - Nivel 5", level: 5, online: true, pv: 24, pvMax: 30, ca: 16 },
    { id: "p4", name: "Jorim Valek", classLine: "Medico - Nivel 5", level: 5, online: false, pv: 27, pvMax: 32, ca: 15 },
  ];
}

function demoRoomState(localCharacter) {
  const character = characterSnapshot(localCharacter);
  const room = new GameRoom({
    id: "offline-colonia-solaris-7",
    name: "Colonia Solaris-7",
    system: "Guerra Solar / Solaris",
  });
  room.dispatch(GAME_EVENT_TYPES.PLAYER_JOIN, {
    id: "offline-gm",
    name: "Solaris GM",
    role: SESSION_ROLES.GM,
    online: true,
  });
  room.dispatch(GAME_EVENT_TYPES.CHAT_MESSAGE, {
    message: "Mesa em modo simulado. Inicie o servidor para sincronizar jogadores.",
    authorName: "Solaris",
  }, "offline-gm");
  room.dispatch(GAME_EVENT_TYPES.DICE_ROLL, {
    label: "Teste de conexao",
    formula: "3d6 + 2",
    rolls: [5, 4, 6],
    total: 17,
    authorName: "Solaris",
  }, "offline-gm");
  const demoMonster = normalizeMonsterForSession({
    id: "demo-vanguarda-xirax",
    name: "Vanguarda Xirax",
    tier: "4",
    type: "Aberracao",
    role: "Brutamontes",
    pv: 58,
    ca: 15,
    movement: 9,
    attacks: "Lamina de Fusao; Canhao de Particulas",
    abilities: "Armadura adaptativa; Sobrecarga de combate",
  });
  const demoCombatants = [combatantFromCharacter(character), combatantFromMonster(demoMonster)];

  return {
    roomId: room.id,
    roomName: room.name,
    system: room.system,
    hostId: "offline-gm",
    players: demoPlayers(character),
    characters: [{
      id: character.id,
      characterId: character.characterId,
      ownerPlayerId: "local-player",
      name: character.name,
      snapshot: character,
    }],
    monsters: [demoMonster],
    combat: {
      active: false,
      round: 0,
      turnIndex: 0,
      entries: demoCombatants.map((combatant) => ({
        entityType: combatant.entityType,
        entityId: combatant.entityId,
        name: combatant.name,
        initiative: combatant.name === character.name ? 22 : 14,
      })),
      combatants: demoCombatants,
      log: [],
    },
    chatMessages: room.chat.map((message) => message.toJSON()),
    diceRolls: room.diceLog.map((roll) => roll.toJSON()),
    approvals: [],
    shopState: { catalogVersion: "offline-alpha", approvalRequired: false, carts: {}, updatedAt: new Date().toISOString() },
    lootPacks: [],
    transactionLog: [],
    gmNotes: [
      {
        id: "gm-note-demo",
        title: "A verdade de Helion",
        body: "A colonia esconde um nucleo antigo que reage a Cosmos instavel.",
        tags: ["segredo", "ato 1"],
        important: true,
        secret: true,
        visibleToPlayers: false,
        revealed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    revealedNotes: [],
    gmCounters: [
      {
        id: "gm-counter-demo",
        name: "Alerta da frota",
        type: "alarme",
        current: 4,
        max: 6,
        direction: "up",
        color: "#ff4e63",
        description: "Quando chegar ao maximo, reforcos inimigos entram na cena.",
        visibleToPlayers: false,
        revealed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    environmentalEffects: [
      {
        id: "gm-effect-demo",
        name: "Gravidade instavel",
        description: "Movimento aumentado ou reduzido em 2m a criterio do mestre.",
        duration: "1 turno",
        active: true,
        visibleToPlayers: false,
        revealed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    preparedEncounters: [
      {
        id: "gm-encounter-demo",
        name: "Patrulha Xirax",
        description: "Uma vanguarda escoltada por um drone de reconhecimento.",
        difficulty: "moderado",
        monsters: [demoMonster],
        rewards: {},
        status: "prepared",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    scene: {
      id: "offline-scene-corredor",
      name: "Corredor de Manutencao - Nivel 2",
      notes: "Mapa tatico local com cobertura, risco e tokens simulados.",
      columns: 12,
      rows: 8,
      gridSize: 64,
      tokens: [
        {
          id: `token-character-${character.id}`,
          entityType: "character",
          entityId: character.id,
          name: character.name,
          x: 3,
          y: 5,
          image: character.portrait,
          color: "#39cfff",
        },
        { id: "token-character-demo-drax", entityType: "character", entityId: "demo-drax", name: "Drax Voren", x: 4, y: 6, color: "#39cfff" },
        { id: `token-monster-${demoMonster.id}`, entityType: "monster", entityId: demoMonster.id, name: demoMonster.name, x: 9, y: 3, color: "#ff4e63" },
      ],
      zones: [
        { id: "zone-danger-reactor", label: "Descarga termica", type: "danger", x: 8, y: 2, width: 3, height: 3 },
        { id: "zone-cover-crates", label: "Cobertura parcial", type: "cover", x: 5, y: 5, width: 2, height: 2 },
      ],
      objectives: [
        { id: "obj-console", label: "Console de manutencao", progress: "0/1 hack", x: 6, y: 2 },
      ],
    },
    objectives: [
      { label: "Investigar a Colonia Solaris-7", progress: "3/5 pistas" },
      { label: "Encontrar o Nucleo de Energia", progress: "1/3 etapas" },
      { label: "Sobreviver a ameaca Xirax", progress: "Em andamento" },
    ],
    initiative: [
      { name: character.name, initiative: 22, active: true },
      { name: "Zephra N'Kai", initiative: 19 },
      { name: "Drax Voren", initiative: 17 },
      { name: "Vanguarda Xirax", initiative: 14, hostile: true },
      { name: "Jorim Valek", initiative: 12 },
    ],
  };
}

function normalizeServerRoom(room = {}, localCharacter = {}) {
  const fallback = demoRoomState(localCharacter);
  const loreState = hydrateLoreState(room.loreState || room.gmDashboard?.loreState || fallback.loreState || {});
  const players = Array.isArray(room.players) && room.players.length
    ? room.players.map((player) => {
      const character = (room.characters || []).find((entry) => entry.ownerPlayerId === player.id);
      const snapshot = characterSnapshot(character?.snapshot || {});
      return {
        id: player.id,
        name: player.name,
        role: player.role || "player",
        isGM: Boolean(player.isGM || player.role === SESSION_ROLES.GM),
        characterId: player.characterId || character?.id || "",
        classLine: `${snapshot.race || "Solaris"} - ${snapshot.profession || player.role}`,
        level: snapshot.level || 1,
        online: player.online !== false,
        pv: snapshot.currentPV || 0,
        pvMax: snapshot.maxPV || 0,
        ca: snapshot.ca || 0,
        portrait: snapshot.portrait || "",
        selected: player.id === room.hostId,
      };
    })
    : fallback.players;
  return {
    ...fallback,
    ...room,
    players,
    monsters: room.monsters || fallback.monsters,
    combat: room.combat || fallback.combat,
    chatMessages: room.chatMessages || room.chat || fallback.chatMessages,
    diceRolls: room.diceRolls || room.diceLog || fallback.diceRolls,
    approvals: room.approvals || fallback.approvals || [],
    pendingApprovals: room.pendingApprovals || (room.approvals || fallback.approvals || []).filter((approval) => approval.status === "pending"),
    shopState: room.shopState || fallback.shopState || { carts: {} },
    lootPacks: room.lootPacks || fallback.lootPacks || [],
    transactionLog: room.transactionLog || fallback.transactionLog || [],
    gmNotes: room.gmNotes || room.gmDashboard?.gmNotes || fallback.gmNotes || [],
    revealedNotes: room.revealedNotes || room.gmDashboard?.revealedNotes || fallback.revealedNotes || [],
    gmCounters: room.gmCounters || room.counters || room.gmDashboard?.gmCounters || fallback.gmCounters || [],
    environmentalEffects: room.environmentalEffects || room.gmDashboard?.environmentalEffects || fallback.environmentalEffects || [],
    preparedEncounters: room.preparedEncounters || room.gmDashboard?.preparedEncounters || fallback.preparedEncounters || [],
    sessionReports: room.sessionReports || room.gmDashboard?.sessionReports || fallback.sessionReports || [],
    sceneList: room.sceneList || room.scenes || room.gmDashboard?.sceneList || fallback.sceneList || [room.scene || fallback.scene],
    activeSceneId: room.activeSceneId || room.gmDashboard?.activeSceneId || room.scene?.id || fallback.scene?.id || "",
    gmDashboard: room.gmDashboard || {},
    gmState: room.gmState || room.gmDashboard?.gmState || fallback.gmState || {},
    gmSchemaVersion: room.gmSchemaVersion || room.gmState?.gmSchemaVersion || room.gmDashboard?.gmSchemaVersion || 1,
    activeMissionId: room.activeMissionId || room.gmState?.activeMissionId || room.gmDashboard?.activeMissionId || "",
    missions: room.missions || room.gmState?.missions || room.gmDashboard?.missions || [],
    travelRoutes: room.travelRoutes || room.gmState?.travelRoutes || room.gmDashboard?.travelRoutes || [],
    resourceTracks: room.resourceTracks || room.gmState?.resourceTracks || room.gmDashboard?.resourceTracks || [],
    factionStates: room.factionStates || room.gmState?.factionStates || room.gmDashboard?.factionStates || [],
    reputationLog: room.reputationLog || room.gmState?.reputationLog || room.gmDashboard?.reputationLog || [],
    campaignClocks: room.campaignClocks || room.gmState?.campaignClocks || room.gmDashboard?.campaignClocks || [],
    gmEvents: room.gmEvents || room.gmState?.gmEvents || room.gmDashboard?.gmEvents || [],
    rewards: room.rewards || room.gmState?.rewards || room.gmDashboard?.rewards || [],
    consequences: room.consequences || room.gmState?.consequences || room.gmDashboard?.consequences || [],
    hackingChallenges: room.hackingChallenges || room.gmState?.hackingChallenges || room.gmDashboard?.hackingChallenges || [],
    bases: room.bases || room.gmState?.bases || room.gmDashboard?.bases || [],
    loreSchemaVersion: room.loreSchemaVersion || room.gmDashboard?.loreSchemaVersion || loreState.loreSchemaVersion,
    loreState,
    pinnedLoreEntries: room.pinnedLoreEntries || room.gmDashboard?.pinnedLoreEntries || loreState.pinnedLoreEntries || [],
    discoveredLoreEntries: room.discoveredLoreEntries || room.gmDashboard?.discoveredLoreEntries || loreState.discoveredLoreEntries || [],
    secretLoreEntries: room.secretLoreEntries || room.gmDashboard?.secretLoreEntries || loreState.secretLoreEntries || [],
    loreNotes: room.loreNotes || room.gmDashboard?.loreNotes || loreState.loreNotes || [],
    loreRelations: room.loreRelations || room.gmDashboard?.loreRelations || loreState.relations || [],
    reportLoreEntries: room.reportLoreEntries || room.gmDashboard?.reportLoreEntries || loreState.reportLoreEntries || [],
    missionLoreLinks: room.missionLoreLinks || room.gmDashboard?.missionLoreLinks || loreState.missionLoreLinks || [],
    factionLoreLinks: room.factionLoreLinks || room.gmDashboard?.factionLoreLinks || loreState.factionLoreLinks || [],
    locationLoreLinks: room.locationLoreLinks || room.gmDashboard?.locationLoreLinks || loreState.locationLoreLinks || [],
    npcLoreLinks: room.npcLoreLinks || room.gmDashboard?.npcLoreLinks || loreState.npcLoreLinks || [],
    monsterLoreLinks: room.monsterLoreLinks || room.gmDashboard?.monsterLoreLinks || loreState.monsterLoreLinks || [],
    itemLoreLinks: room.itemLoreLinks || room.gmDashboard?.itemLoreLinks || loreState.itemLoreLinks || [],
    scene: normalizeScene(room.scene || fallback.scene, characterSnapshot(localCharacter)),
    objectives: room.scene?.objectives?.length ? room.scene.objectives : (room.objectives || fallback.objectives),
    initiative: room.combat?.entries?.length ? room.combat.entries : fallback.initiative,
  };
}

class SolarisSessionUI {
  constructor(root, options = {}) {
    this.root = root;
    this.options = {
      getCurrentCharacter: () => ({}),
      onOpenCharacter: () => {},
      onOpenInventory: () => {},
      onResourceUpdate: () => {},
      onRemoteCharacterUpdate: () => {},
      getMonsterCatalog: () => [],
      getShopCatalog: defaultSessionShopCatalog,
      notify: () => {},
      ...options,
    };
    const current = characterSnapshot(this.options.getCurrentCharacter());
    this.client = new SolarisSessionClient({
      playerName: current.player || current.name || "Jogador Solaris",
      playerId: sessionPlayerId(),
    });
    this.mode = "offline";
    this.connectionMessage = "Modo simulado local";
    this.room = demoRoomState(current);
    this.chatDraft = "";
    this.monsterPickerOpen = false;
    this.selectedCombatantId = "";
    this.selectedMonsterSheetId = "";
    this.selectedMapTokenId = "";
    this.selectedTargetTokenId = "";
    this.selectedAreaId = "";
    this.draggingMapTokenId = "";
    this.mapTool = "move";
    this.measurementStart = null;
    this.purchaseDestination = "unassigned";
    this.selectedShopItemId = "";
    this.shopQuery = "";
    this.shopMode = "session";
    this.shopCategory = "all";
    this.shopTier = "all";
    this.shopRarity = "all";
    this.shopMinPrice = "";
    this.shopMaxPrice = "";
    this.shopCompatibility = "all";
    this.shopOnlyInStock = false;
    this.shopSort = "name";
    this.shopPage = 1;
    this.shopCart = [];
    this.shopTargetCharacterId = "";
    this.lootPanelOpen = true;
    this.lootModalOpen = false;
    this.editingLootPackId = "";
    this.gmPanelOpen = false;
    this.gmPanelTab = "overview";
    const routeView = activeRouteView();
    this.screen = options.initialScreen || (routeView === "campaigns" ? "campaigns" : routeView === "launcher" || routeView === "home" ? "launcher" : "table");
    this.tableView = options.initialTableView || "table";
    this.gmForm = null;
    this.sceneEditor = null;
    this.sceneEditorDrag = null;
    this.encounterEditor = null;
    this.reportPreviewOpen = false;
    this.loreQuery = "";
    this.loreTypeFilter = "all";
    this.loreImportanceFilter = "all";
    this.campaignForm = null;
    this.launcherModal = null;
    this.launcherJoinAddress = "http://localhost:3000";
    this.launcherReducedFx = safeReadStorage("solaris.tabletop.launcher.reducedFx", "") === "1";
    this.shieldQuery = "";
    this.encounterFilters = {
      query: "",
      tier: "all",
      type: "all",
      habitat: "all",
      role: "all",
      faction: "all",
      quantity: 2,
      difficulty: "moderado",
      includeBoss: false,
      includeMinions: true,
    };
    this.reportOptions = { ...DEFAULT_REPORT_OPTIONS };
    this.campaigns = readCampaignsFromStorage();
    this.activeCampaignId = readActiveCampaignId() || this.campaigns[0]?.id || "";
    this.campaignPanelOpen = false;
    this.recoveryNotice = getRecentRecovery(safeReadStorage(RECOVERY_STORAGE_KEY, ""));
    this.autosaveStatus = "";
    this.autosaveTimer = null;
    this.localSheetRevision = Number(current.revision || 0);
    this.lastRoomSequence = 0;
    this.characterRevisionMap = new Map();
    this.bindClient();
    this.ensureCampaignBase(current);
    this.startAutosaveTimer();
    this.render();
  }

  bindClient() {
    this.client.addEventListener("connection:change", (event) => {
      this.mode = event.detail.connected ? "connected" : "offline";
      this.connectionMessage = event.detail.connected ? "Conectado ao servidor local" : (event.detail.reason || "Modo simulado local");
      this.render();
    });
    this.client.addEventListener(SESSION_SOCKET_EVENTS.ROOM_STATE, (event) => {
      this.room = normalizeServerRoom(event.detail.room, this.options.getCurrentCharacter());
      const changedCharacter = this.detectRemoteCharacterChange(this.room);
      if (changedCharacter && changedCharacter.ownerPlayerId !== this.client.playerId) {
        this.options.notify(`${changedCharacter.name || "Uma ficha"} foi atualizada na mesa.`);
      }
      this.applyRemoteOwnCharacter(this.room);
      this.mode = this.client.isConnected ? "connected" : this.mode;
      this.lastRoomSequence = Number(this.room.sequence || this.lastRoomSequence || 0);
      try {
        this.markRecoverableSession("Estado recente da mesa", this.buildSessionState("Estado recente da mesa"));
      } catch {}
      this.render();
    });
    this.client.addEventListener(SESSION_SOCKET_EVENTS.CHARACTER_SYNC_FULL, (event) => {
      this.applyRemoteOwnCharacter({ characters: [{ snapshot: event.detail.snapshot, revision: event.detail.revision }] });
      this.options.notify("Ficha sincronizada com a mesa.");
      this.render();
    });
    this.client.addEventListener(SESSION_SOCKET_EVENTS.ERROR, (event) => {
      this.connectionMessage = event.detail.message || "Erro na mesa.";
      this.options.notify(this.connectionMessage, "tech-error");
      this.render();
    });
    this.client.addEventListener(SESSION_SOCKET_EVENTS.CAMPAIGN_LIST, (event) => {
      const serverCampaigns = Array.isArray(event.detail.campaigns) ? event.detail.campaigns : [];
      if (serverCampaigns.length) {
        this.autosaveStatus = `${serverCampaigns.length} campanha(s) no servidor local.`;
        this.render();
      }
    });
    this.client.addEventListener(SESSION_SOCKET_EVENTS.SESSION_EXPORT, (event) => {
      if (event.detail.bundle) {
        downloadJsonFile(this.exportFilename("sessao-servidor"), event.detail.bundle);
        this.options.notify("Sessao exportada pelo servidor.");
      }
    });
  }

  activeCampaign() {
    return this.campaigns.find((campaign) => campaign.id === this.activeCampaignId) || this.campaigns[0] || null;
  }

  persistCampaigns() {
    writeCampaignsToStorage(this.campaigns);
    writeActiveCampaignId(this.activeCampaignId);
  }

  ensureCampaignBase(current = this.currentSheetSnapshot()) {
    if (this.campaigns.length) {
      if (!this.activeCampaignId) this.activeCampaignId = this.campaigns[0].id;
      this.persistCampaigns();
      return this.activeCampaign();
    }
    const campaign = createCampaign({
      name: "Colonia Solaris-7",
      description: "Campanha local da Mesa Virtual Solaris.",
      ownerName: current.player || current.name || "Solaris GM",
      sessionState: this.buildSessionState("Campanha inicial"),
    });
    this.campaigns = [campaign];
    this.activeCampaignId = campaign.id;
    this.persistCampaigns();
    return campaign;
  }

  buildSessionState(label = "Sessao atual") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
    return migrateSessionState({
      ...room,
      label,
      roomId: room.roomId || room.id || "colonia-solaris-7",
      roomName: room.roomName || room.name || "Colonia Solaris-7",
      sessionReports: room.sessionReports || [],
      chatMessages: room.chatMessages || room.chat || [],
      diceRolls: room.diceRolls || room.diceLog || [],
      combatState: room.combat || {},
      loreSchemaVersion: room.loreSchemaVersion,
      loreState: room.loreState,
      pinnedLoreEntries: room.pinnedLoreEntries || room.loreState?.pinnedLoreEntries || [],
      discoveredLoreEntries: room.discoveredLoreEntries || room.loreState?.discoveredLoreEntries || [],
      secretLoreEntries: room.secretLoreEntries || room.loreState?.secretLoreEntries || [],
      loreNotes: room.loreNotes || room.loreState?.loreNotes || [],
      loreRelations: room.loreRelations || room.loreState?.relations || [],
      reportLoreEntries: room.reportLoreEntries || room.loreState?.reportLoreEntries || [],
      missionLoreLinks: room.missionLoreLinks || room.loreState?.missionLoreLinks || [],
      factionLoreLinks: room.factionLoreLinks || room.loreState?.factionLoreLinks || [],
      locationLoreLinks: room.locationLoreLinks || room.loreState?.locationLoreLinks || [],
      npcLoreLinks: room.npcLoreLinks || room.loreState?.npcLoreLinks || [],
      monsterLoreLinks: room.monsterLoreLinks || room.loreState?.monsterLoreLinks || [],
      itemLoreLinks: room.itemLoreLinks || room.loreState?.itemLoreLinks || [],
      scene: room.scene || {},
      mapTokens: room.scene?.tokens || [],
      zones: room.scene?.zones || [],
      objectives: room.scene?.objectives || [],
      measurements: room.scene?.measurements || [],
      areas: room.scene?.areas || [],
      logs: room.events || room.combat?.log || [],
      gmDashboardSettings: {
        ...(room.gmDashboardSettings || room.gmDashboard?.settings || {}),
        reportSettings: this.reportOptions,
      },
      settings: {
        autosaveEnabled: this.activeCampaign()?.settings?.autosaveEnabled !== false,
        autosaveIntervalSeconds: this.activeCampaign()?.settings?.autosaveIntervalSeconds || 60,
        maxAutosaves: this.activeCampaign()?.settings?.maxAutosaves || 10,
      },
      metadata: {
        source: "solaris-session-ui",
        label,
      },
    });
  }

  applySessionState(sessionState = {}, { notify = true } = {}) {
    const state = migrateSessionState(sessionState);
    const nextRoom = normalizeServerRoom({
      id: state.roomId,
      roomId: state.roomId,
      name: state.roomName,
      roomName: state.roomName,
      system: state.system,
      hostId: state.hostId,
      hostPlayerId: state.hostPlayerId,
      players: state.players,
      characters: state.characters,
      monsters: state.monsters,
      chatMessages: state.chatMessages,
      diceRolls: state.diceRolls,
      approvals: state.approvals,
      shopState: state.shopState,
      lootPacks: state.lootPacks,
      transactionLog: state.transactionLog,
      gmNotes: state.gmNotes,
      revealedNotes: state.revealedNotes,
      gmCounters: state.gmCounters,
      environmentalEffects: state.environmentalEffects,
      preparedEncounters: state.preparedEncounters,
      sessionReports: state.sessionReports,
      sceneList: state.sceneList,
      activeSceneId: state.activeSceneId,
      gmDashboardSettings: {
        ...(state.gmDashboardSettings || {}),
        reportSettings: {
          ...DEFAULT_REPORT_OPTIONS,
          ...(state.gmDashboardSettings?.reportSettings || {}),
        },
      },
      gmSchemaVersion: state.gmSchemaVersion,
      activeMissionId: state.activeMissionId,
      missions: state.missions,
      travelRoutes: state.travelRoutes,
      resourceTracks: state.resourceTracks,
      factionStates: state.factionStates,
      reputationLog: state.reputationLog,
      campaignClocks: state.campaignClocks,
      gmEvents: state.gmEvents,
      rewards: state.rewards,
      consequences: state.consequences,
      hackingChallenges: state.hackingChallenges,
      bases: state.bases,
      loreSchemaVersion: state.loreSchemaVersion,
      loreState: state.loreState,
      pinnedLoreEntries: state.pinnedLoreEntries,
      discoveredLoreEntries: state.discoveredLoreEntries,
      secretLoreEntries: state.secretLoreEntries,
      loreNotes: state.loreNotes,
      loreRelations: state.loreRelations,
      reportLoreEntries: state.reportLoreEntries,
      missionLoreLinks: state.missionLoreLinks,
      factionLoreLinks: state.factionLoreLinks,
      locationLoreLinks: state.locationLoreLinks,
      npcLoreLinks: state.npcLoreLinks,
      monsterLoreLinks: state.monsterLoreLinks,
      itemLoreLinks: state.itemLoreLinks,
      combat: state.combatState || state.combat,
      scene: {
        ...(state.scene || {}),
        tokens: state.mapTokens.length ? state.mapTokens : state.scene?.tokens,
        zones: state.zones.length ? state.zones : state.scene?.zones,
        objectives: state.objectives.length ? state.objectives : state.scene?.objectives,
        measurements: state.measurements.length ? state.measurements : state.scene?.measurements,
        areas: state.areas.length ? state.areas : state.scene?.areas,
      },
      sequence: state.sequence,
      updatedAt: state.updatedAt,
    }, this.options.getCurrentCharacter());
    this.room = nextRoom;
    this.reportOptions = {
      ...DEFAULT_REPORT_OPTIONS,
      ...(state.gmDashboardSettings?.reportSettings || {}),
    };
    if (this.client.isConnected) this.client.loadSession(state, { campaignId: this.activeCampaignId });
    this.markRecoverableSession("Sessao restaurada", state);
    if (notify) this.options.notify("Sessao carregada na Mesa Virtual.");
    this.render();
    return state;
  }

  markRecoverableSession(label = "Sessao recente", sessionState = this.buildSessionState(label)) {
    safeWriteStorage(RECOVERY_STORAGE_KEY, JSON.stringify({
      id: createId("recovery"),
      label,
      campaignId: this.activeCampaignId,
      createdAt: new Date().toISOString(),
      sessionState,
    }));
  }

  clearRecoveryNotice() {
    this.recoveryNotice = null;
    safeRemoveStorage(RECOVERY_STORAGE_KEY);
    this.render();
  }

  continueRecoverySession() {
    if (!this.recoveryNotice?.sessionState) return;
    this.applySessionState(this.recoveryNotice.sessionState);
    this.clearRecoveryNotice();
  }

  createCampaignPrompt() {
    this.campaignForm = { mode: "create", campaignId: "" };
    this.render();
  }

  editCampaign(campaignId = "") {
    this.campaignForm = { mode: "edit", campaignId };
    this.render();
  }

  closeCampaignForm() {
    this.campaignForm = null;
    this.render();
  }

  submitCampaignForm(form) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) {
      this.options.notify("Informe o nome da campanha.", "tech-error");
      return;
    }
    const description = String(data.get("description") || "").trim();
    const systemName = String(data.get("systemName") || "Guerra Solar / Solaris").trim();
    const current = this.currentSheetSnapshot();
    if (this.campaignForm?.mode === "edit") {
      const campaign = this.campaigns.find((entry) => entry.id === this.campaignForm.campaignId);
      if (!campaign) return;
      const next = migrateCampaign({
        ...campaign,
        name,
        description,
        systemName,
        updatedAt: new Date().toISOString(),
      });
      this.campaigns = [next, ...this.campaigns.filter((entry) => entry.id !== next.id)];
      this.persistCampaigns();
      if (this.client.isConnected) this.client.updateCampaign(next.id, { name, description, systemName });
      this.options.notify("Campanha atualizada.");
    } else {
      const campaign = createCampaign({
        name,
        systemName,
        description,
        ownerName: current.player || current.name || "Solaris GM",
        sessionState: this.buildSessionState("Campanha criada"),
      });
      this.campaigns = [campaign, ...this.campaigns];
      this.activeCampaignId = campaign.id;
      this.persistCampaigns();
      if (this.client.isConnected) this.client.createCampaign(campaign);
      this.options.notify(`Campanha criada: ${campaign.name}.`);
    }
    this.campaignForm = null;
    this.screen = "campaigns";
    this.render();
  }

  duplicateCampaign(campaignId = "") {
    const source = this.campaigns.find((campaign) => campaign.id === campaignId);
    if (!source) return;
    const duplicate = migrateCampaign({
      ...source,
      id: createId("campaign"),
      name: `${source.name} - copia`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: { ...(source.metadata || {}), duplicatedFrom: source.id },
    });
    this.campaigns = [duplicate, ...this.campaigns];
    this.activeCampaignId = duplicate.id;
    this.persistCampaigns();
    this.options.notify("Campanha duplicada.");
    this.render();
  }

  deleteCampaign(campaignId = "") {
    const campaign = this.campaigns.find((entry) => entry.id === campaignId);
    if (!campaign) return;
    const confirmation = window.prompt(`Esta acao nao pode ser desfeita. Digite o nome da campanha para excluir: ${campaign.name}`, "");
    if (confirmation !== campaign.name) {
      this.options.notify("Exclusao cancelada: nome nao confirmado.");
      return;
    }
    this.campaigns = this.campaigns.filter((entry) => entry.id !== campaignId);
    if (this.activeCampaignId === campaignId) this.activeCampaignId = this.campaigns[0]?.id || "";
    this.persistCampaigns();
    if (this.client.isConnected) this.client.deleteCampaign(campaignId, confirmation);
    this.options.notify("Campanha excluida.");
    this.render();
  }

  loadCampaign(campaignId = "", sessionId = "") {
    const campaign = this.campaigns.find((entry) => entry.id === campaignId);
    const session = campaign?.sessions.find((entry) => entry.roomId === sessionId) || campaign?.sessions[0];
    if (!campaign || !session) {
      this.options.notify("Campanha sem sessao salva para carregar.");
      return;
    }
    this.activeCampaignId = campaign.id;
    this.persistCampaigns();
    this.screen = "table";
    this.campaignPanelOpen = false;
    this.applySessionState(session);
    if (this.client.isConnected) this.client.loadCampaign(campaign.id, session.roomId);
  }

  saveCurrentCampaign(label = "Sessao salva") {
    const base = this.ensureCampaignBase();
    const sessionState = this.buildSessionState(label);
    const next = upsertCampaignSession(base, sessionState, label);
    this.campaigns = [next, ...this.campaigns.filter((campaign) => campaign.id !== next.id)];
    this.activeCampaignId = next.id;
    this.persistCampaigns();
    this.markRecoverableSession(label, sessionState);
    if (this.client.isConnected) this.client.saveSession(sessionState, { campaignId: next.id, label });
    return { campaign: next, sessionState };
  }

  createManualSnapshot() {
    const saved = this.saveCurrentCampaign("Snapshot manual");
    const result = createAutosave(saved.campaign, saved.sessionState, {
      label: "Snapshot manual",
      maxAutosaves: saved.campaign.settings?.maxAutosaves || 10,
    });
    this.campaigns = [result.campaign, ...this.campaigns.filter((campaign) => campaign.id !== result.campaign.id)];
    this.activeCampaignId = result.campaign.id;
    this.persistCampaigns();
    if (this.client.isConnected) this.client.createSessionSnapshot(saved.sessionState, { campaignId: result.campaign.id, label: "Snapshot manual" });
    this.options.notify("Snapshot manual criado.");
    this.render();
  }

  runAutosave(label = "Autosave") {
    const campaign = this.ensureCampaignBase();
    if (campaign.settings?.autosaveEnabled === false) return null;
    const sessionState = this.buildSessionState(label);
    const result = createAutosave(campaign, sessionState, {
      label,
      maxAutosaves: campaign.settings?.maxAutosaves || 10,
    });
    const next = upsertCampaignSession(result.campaign, sessionState, label);
    this.campaigns = [next, ...this.campaigns.filter((entry) => entry.id !== next.id)];
    this.activeCampaignId = next.id;
    this.autosaveStatus = `${label} salvo ${formatTime(result.snapshot.createdAt)}.`;
    this.persistCampaigns();
    this.markRecoverableSession(label, sessionState);
    if (this.client.isConnected) this.client.autosaveSession(sessionState, { campaignId: next.id, label, maxAutosaves: next.settings?.maxAutosaves || 10 });
    return result.snapshot;
  }

  startAutosaveTimer() {
    if (typeof window === "undefined") return;
    if (this.autosaveTimer) window.clearInterval(this.autosaveTimer);
    const intervalSeconds = Math.max(10, Number(this.activeCampaign()?.settings?.autosaveIntervalSeconds || 60));
    this.autosaveTimer = window.setInterval(() => {
      try {
        this.runAutosave("Autosave");
      } catch {}
    }, intervalSeconds * 1000);
  }

  restoreAutosave(snapshotId = "") {
    const campaign = this.activeCampaign();
    const snapshot = campaign?.autosaves.find((entry) => entry.id === snapshotId);
    if (!snapshot) return;
    this.applySessionState(snapshot.stateSnapshot);
    this.options.notify("Autosave restaurado.");
  }

  deleteAutosave(snapshotId = "") {
    const campaign = this.activeCampaign();
    if (!campaign) return;
    const next = migrateCampaign({
      ...campaign,
      autosaves: campaign.autosaves.filter((entry) => entry.id !== snapshotId),
      updatedAt: new Date().toISOString(),
    });
    this.campaigns = [next, ...this.campaigns.filter((entry) => entry.id !== next.id)];
    this.persistCampaigns();
    this.render();
  }

  exportFilename(prefix = "solaris-sessao") {
    const campaign = this.activeCampaign();
    const cleanName = String(campaign?.name || "campanha").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
    return `${prefix}-${cleanName || "campanha"}.json`;
  }

  exportCurrentSession() {
    const saved = this.saveCurrentCampaign("Exportacao");
    const bundle = createSessionExportBundle({
      campaign: saved.campaign,
      sessionState: saved.sessionState,
      appVersion: TABLETOP_APP_VERSION,
      notes: "Exportado pela Mesa Virtual Solaris.",
    });
    downloadJsonFile(this.exportFilename("solaris-tabletop"), bundle);
    if (this.client.isConnected) this.client.exportSession({ campaignId: saved.campaign.id, sessionState: saved.sessionState });
    this.options.notify("Sessao exportada em JSON.");
  }

  exportCampaign(campaignId = "") {
    const campaign = this.campaigns.find((entry) => entry.id === campaignId) || this.activeCampaign();
    if (!campaign) return;
    const sessionState = campaign.sessions[0] || this.buildSessionState("Exportacao");
    const bundle = createSessionExportBundle({
      campaign,
      sessionState,
      appVersion: TABLETOP_APP_VERSION,
      notes: "Campanha exportada pela tela Minhas Campanhas.",
    });
    const cleanName = String(campaign.name || "campanha").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
    downloadJsonFile(`solaris-campanha-${cleanName || "campanha"}.json`, bundle);
    this.options.notify("Campanha exportada em JSON.");
  }

  async importSessionFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const bundle = parseSessionExportBundle(text);
      const imported = migrateCampaign({
        ...bundle.campaign,
        id: createId("campaign"),
        name: `${bundle.campaign.name} (importada)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      this.campaigns = [imported, ...this.campaigns];
      this.activeCampaignId = imported.id;
      this.persistCampaigns();
      this.applySessionState(bundle.sessionState, { notify: false });
      if (this.client.isConnected) this.client.importSession(bundle);
      this.options.notify("Sessao importada como nova campanha.");
    } catch (error) {
      this.options.notify(error.message || "Nao foi possivel importar a sessao.", "tech-error");
    }
  }

  refresh() {
    if (!this.client.isConnected) {
      this.room = demoRoomState(this.options.getCurrentCharacter());
    } else if (this.client.room) {
      this.room = normalizeServerRoom(this.client.room, this.options.getCurrentCharacter());
    }
    this.render();
  }

  currentSheetSnapshot() {
    return characterSnapshot(this.options.getCurrentCharacter());
  }

  currentSheetId() {
    const current = this.currentSheetSnapshot();
    return current.characterId || current.id;
  }

  nextSheetRevision() {
    this.localSheetRevision = Math.max(this.localSheetRevision + 1, Number(this.currentSheetSnapshot().revision || 0) + 1);
    return this.localSheetRevision;
  }

  findServerCharacter(room = this.room) {
    const current = this.currentSheetSnapshot();
    return (room.characters || []).find((character) =>
      character.id === current.id
      || character.characterId === current.characterId
      || character.snapshot?.id === current.id
      || character.snapshot?.characterId === current.characterId
    ) || null;
  }

  applyRemoteOwnCharacter(room = this.room) {
    const remote = this.findServerCharacter(room);
    const snapshot = remote?.snapshot || null;
    if (!snapshot) return;
    const revision = Number(remote.revision ?? snapshot.revision ?? 0);
    if (revision && revision < this.localSheetRevision) return;
    this.localSheetRevision = Math.max(this.localSheetRevision, revision);
    this.options.onRemoteCharacterUpdate({ ...snapshot, revision });
  }

  detectRemoteCharacterChange(room = this.room) {
    let changed = null;
    (room.characters || []).forEach((character) => {
      const id = character.id || character.characterId || character.snapshot?.id;
      const revision = Number(character.revision ?? character.snapshot?.revision ?? 0);
      const previous = this.characterRevisionMap.get(id);
      if (previous !== undefined && revision > previous) changed = changed || character;
      this.characterRevisionMap.set(id, revision);
    });
    return changed;
  }

  syncCurrentSheet() {
    const snapshot = this.currentSheetSnapshot();
    snapshot.revision = this.nextSheetRevision();
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: a ficha local segue salva neste aparelho.");
      return false;
    }
    const sent = this.client.syncFullCharacter(snapshot.characterId || snapshot.id, snapshot);
    if (sent) this.options.notify("Ficha enviada para sincronizacao da mesa.");
    return sent;
  }

  requestCurrentSheetSync() {
    if (!this.client.isConnected) {
      this.options.notify("Sem servidor ativo. A ficha local continua funcionando.");
      return false;
    }
    return this.client.requestCharacterSync(this.currentSheetId());
  }

  firstInventoryItem(predicate = () => true) {
    const inventory = this.currentSheetSnapshot().inventory || [];
    return inventory.find(predicate) || inventory[0] || null;
  }

  sessionUseItem() {
    const item = this.firstInventoryItem();
    if (!item) {
      this.options.notify("Nenhum item encontrado na ficha.");
      return;
    }
    if (!this.client.isConnected) {
      this.sendChat(`usou ${item.name || item.itemId || "um item"} no modo local.`);
      return;
    }
    this.client.useCharacterItem(this.currentSheetId(), item.uid || item.id || item.itemId, { item });
  }

  sessionMoveItem() {
    const item = this.firstInventoryItem();
    if (!item) {
      this.options.notify("Nenhum item encontrado para mover.");
      return;
    }
    const locationKind = window.prompt("Mover item para qual local? (unassigned, active, cube, hook, holster, bandolier)", "unassigned");
    if (!locationKind) return;
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: mova o item pela aba Equipamentos.");
      return;
    }
    this.client.moveCharacterItem(this.currentSheetId(), item.uid || item.id || item.itemId, { kind: locationKind });
  }

  sessionEquipItem() {
    const item = this.firstInventoryItem((entry) => ["weapon", "armor"].includes(entry.category));
    if (!item) {
      this.options.notify("Nenhuma arma ou armadura encontrada para equipar.");
      return;
    }
    const slot = item.category === "armor" ? "armor" : "mainWeapon";
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: equipe pela aba Equipamentos.");
      return;
    }
    this.client.equipCharacterItem(this.currentSheetId(), item.uid || item.id || item.itemId, item, slot);
  }

  requestPurchaseApproval() {
    const name = window.prompt("Nome do item para comprar", "Cubo de Expansao");
    if (!name) return;
    const price = this.promptNumber("Valor em Luzentis", 0);
    if (price === null) return;
    const item = { id: createId("shop-item"), uid: createId("shop-item"), name, price, location: { kind: "unassigned" } };
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: use a loja normal para comprar imediatamente.");
      return;
    }
    this.client.requestApproval({
      characterId: this.currentSheetId(),
      type: "purchase-item",
      payload: { characterId: this.currentSheetId(), item, price },
      message: `Comprar ${name} por ${price}L.`,
    });
  }

  requestSaleApproval() {
    const item = this.firstInventoryItem();
    if (!item) {
      this.options.notify("Nenhum item encontrado para vender.");
      return;
    }
    const saleValue = this.promptNumber(`Valor de venda de ${item.name || item.itemId}`, Number(item.price || 0));
    if (saleValue === null) return;
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: venda pela aba Equipamentos.");
      return;
    }
    this.client.requestApproval({
      characterId: this.currentSheetId(),
      type: "sell-item",
      payload: { characterId: this.currentSheetId(), itemId: item.uid || item.id || item.itemId, item, saleValue },
      message: `Vender ${item.name || item.itemId} por ${saleValue}L.`,
    });
  }

  requestDeleteApproval() {
    const item = this.firstInventoryItem();
    if (!item) {
      this.options.notify("Nenhum item encontrado para excluir.");
      return;
    }
    if (!window.confirm(`Solicitar exclusao de ${item.name || item.itemId}?`)) return;
    if (!this.client.isConnected) {
      this.options.notify("Modo offline: exclua pela aba Equipamentos.");
      return;
    }
    this.client.requestApproval({
      characterId: this.currentSheetId(),
      type: "delete-item",
      payload: { characterId: this.currentSheetId(), itemId: item.uid || item.id || item.itemId, item },
      message: `Excluir ${item.name || item.itemId}.`,
    });
  }

  approveRequest(approvalId = "", extra = {}) {
    if (this.client.isConnected) this.client.approveApproval(approvalId, extra);
  }

  rejectRequest(approvalId = "", extra = {}) {
    if (this.client.isConnected) this.client.rejectApproval(approvalId, extra.message || "", extra);
  }

  shopCatalog() {
    const source = this.options.getShopCatalog();
    return (Array.isArray(source) && source.length ? source : defaultSessionShopCatalog())
      .map((item) => normalizeShopCatalogItem(item, item.sessionCategory || item.category || "common"));
  }

  currentShopCharacter(room = this.room, fallback = this.currentSheetSnapshot()) {
    const characters = Array.isArray(room.characters) ? room.characters : [];
    const targetId = this.shopTargetCharacterId || fallback.characterId || fallback.id || this.currentSheetId();
    const sessionCharacter = characters.find((character) => character.id === targetId || character.characterId === targetId);
    if (sessionCharacter) return characterSnapshot({ ...(sessionCharacter.snapshot || {}), id: sessionCharacter.id, characterId: sessionCharacter.id, name: sessionCharacter.name });
    return fallback;
  }

  shopItemCompatibility(item = {}, character = this.currentSheetSnapshot()) {
    const inventory = Array.isArray(character.inventory) ? character.inventory : [];
    const hasStorage = (kind) => inventory.some((entry) => storageKindForItem(entry) === kind);
    const category = item.sessionCategory || item.category;
    if (["weapon", "armor", "chip", "spell"].includes(category)) return { status: "compatible", label: "Compativel" };
    if (category === "cube") return { status: "compatible", label: "Armazenador" };
    if (category === "consumable" || item.consumable) return { status: hasStorage("backpack") || hasStorage("cube") ? "compatible" : "warning", label: hasStorage("backpack") || hasStorage("cube") ? "Tem destino" : "Sem destino ideal" };
    return { status: "compatible", label: "Sem requisito" };
  }

  availableShopDestinations(character = this.currentSheetSnapshot(), item = {}) {
    const inventory = Array.isArray(character.inventory) ? character.inventory : [];
    const options = [
      { kind: "unassigned", label: "Sem local definido" },
      { kind: "inventory", label: "Inventario solto" },
      { kind: "active", label: "Ativo" },
    ];
    if (["weapon", "armor"].includes(item.sessionCategory)) {
      options.push({ kind: "equip", label: "Equipar apos compra" });
    }
    for (const entry of inventory) {
      const kind = storageKindForItem(entry);
      if (!kind) continue;
      const label = `${destinationLabel(kind)} - ${entry.name || entry.itemId || entry.id}`;
      options.push({ kind, id: entry.uid || entry.id || entry.itemId, label });
    }
    for (const kind of ["backpack", "cube", "holster", "bandolier", "hook"]) {
      if (!options.some((option) => option.kind === kind)) options.push({ kind, label: destinationLabel(kind) });
    }
    return options;
  }

  defaultDestinationForItem(item = {}) {
    const destination = decodeDestination(this.purchaseDestination || "unassigned");
    if (destination.kind && destination.kind !== "unassigned") return destination;
    if (["weapon", "armor"].includes(item.sessionCategory)) return { kind: "equip" };
    if (item.sessionCategory === "consumable") return { kind: "active" };
    return { kind: "unassigned" };
  }

  filteredShopCatalog() {
    const query = normalizeSearch(this.shopQuery);
    const tier = String(this.shopTier || "all");
    const rarity = String(this.shopRarity || "all");
    const minPrice = this.shopMinPrice === "" ? null : Math.max(0, Number(this.shopMinPrice || 0));
    const maxPrice = this.shopMaxPrice === "" ? null : Math.max(0, Number(this.shopMaxPrice || 0));
    const current = this.currentShopCharacter();
    const items = this.shopCatalog().filter((item) => {
      const haystack = normalizeSearch([item.name, item.type, item.categoryLabel, item.summary, item.effect, item.description, item.source, item.tier, item.rarity, ...(item.tags || [])].join(" "));
      const categoryMatch = this.shopCategory === "all"
        || item.sessionCategory === this.shopCategory
        || (this.shopCategory === "featured" && (item.featured || SHOP_RARITY_RANK[item.rarity] >= 3 || item.price >= 500));
      const tierMatch = tier === "all" || String(item.tier || "").toLowerCase() === tier.toLowerCase();
      const rarityMatch = rarity === "all" || item.rarity === rarity;
      const priceMatch = (minPrice === null || item.price >= minPrice) && (maxPrice === null || item.price <= maxPrice);
      const stockMatch = !this.shopOnlyInStock || item.stock === "" || Number(item.stock) > 0;
      const compatibility = this.shopItemCompatibility(item, current);
      const compatibilityMatch = this.shopCompatibility === "all"
        || compatibility.status === this.shopCompatibility
        || (this.shopCompatibility === "buyable" && item.price <= Number(current.currency || current.luzentis || 0));
      return categoryMatch && tierMatch && rarityMatch && priceMatch && stockMatch && compatibilityMatch && (!query || haystack.includes(query));
    });
    return items.sort((a, b) => {
      if (this.shopSort === "price-asc") return a.price - b.price || a.name.localeCompare(b.name);
      if (this.shopSort === "price-desc") return b.price - a.price || a.name.localeCompare(b.name);
      if (this.shopSort === "tier") return String(a.tier || "Z").localeCompare(String(b.tier || "Z")) || a.name.localeCompare(b.name);
      if (this.shopSort === "rarity") return (SHOP_RARITY_RANK[b.rarity] || 0) - (SHOP_RARITY_RANK[a.rarity] || 0) || a.name.localeCompare(b.name);
      if (this.shopSort === "category") return String(a.categoryLabel).localeCompare(String(b.categoryLabel)) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }

  addShopItemToCart(itemId = "") {
    const item = this.shopCatalog().find((entry) => entry.id === itemId);
    if (!item) return;
    const existing = this.shopCart.find((line) => line.item.id === item.id);
    if (existing) existing.quantity += 1;
    else this.shopCart.push({
      id: createId("cart-line"),
      item,
      quantity: 1,
      price: item.price,
      destination: this.defaultDestinationForItem(item),
      status: "draft",
      approvalRequired: this.shopMode === "session" && this.client.isConnected,
    });
    this.syncShopCartState();
    this.options.notify(`${item.name} entrou no carrinho.`);
    this.render();
  }

  openShopItemDetails(itemId = "") {
    this.selectedShopItemId = itemId;
    if (this.client.isConnected) this.client.requestShopItemDetails(itemId);
    this.render();
  }

  closeShopItemDetails() {
    this.selectedShopItemId = "";
    this.render();
  }

  compareShopItem(itemId = "") {
    const item = this.shopCatalog().find((entry) => entry.id === itemId);
    if (!item) return;
    const current = this.currentSheetSnapshot();
    const equipped = item.sessionCategory === "weapon"
      ? (current.equipment?.weapons?.[0] || current.weapon || current.mainWeapon)
      : item.sessionCategory === "armor"
        ? (current.equipment?.armor || current.armor)
        : null;
    const equippedName = typeof equipped === "string" ? equipped : equipped?.name;
    this.options.notify(equippedName ? `${item.name} comparado com ${equippedName}.` : `${item.name}: nenhum equipamento equivalente equipado.`);
  }

  sendShopItemToChat(itemId = "") {
    const item = this.shopCatalog().find((entry) => entry.id === itemId);
    if (!item) return;
    this.sendChat(`${item.name} (${item.categoryLabel}, ${item.rarityLabel || "Comum"}) - ${formatLuzentis(item.price)}. ${item.summary || item.description || "Item da Loja Solaris."}`);
  }

  removeShopCartLine(lineId = "") {
    this.shopCart = this.shopCart.filter((line) => line.id !== lineId);
    this.syncShopCartState();
    this.render();
  }

  clearShopCart() {
    this.shopCart = [];
    this.syncShopCartState();
    this.render();
  }

  updateShopCartLine(lineId = "", patch = {}) {
    this.shopCart = this.shopCart.map((line) => line.id === lineId ? { ...line, ...patch } : line);
    this.syncShopCartState();
    this.render();
  }

  syncShopCartState() {
    if (!this.client.isConnected) return false;
    return this.client.updateShopCart(this.currentShopCharacter(this.client.room || this.room).id || this.currentSheetId(), this.shopCart, {
      mode: this.shopMode,
      destination: decodeDestination(this.purchaseDestination || "unassigned"),
    });
  }

  monsterById(monsterId = "") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
    return (room.monsters || []).find((monster) => monster.id === monsterId || monster.definitionId === monsterId) || null;
  }

  openMonsterSheet(monsterId = "") {
    this.selectedMonsterSheetId = monsterId;
    this.render();
  }

  closeMonsterSheet() {
    this.selectedMonsterSheetId = "";
    this.render();
  }

  rollMonsterAttack(monsterId = "", attackIndex = 0, { compareTarget = false } = {}) {
    const monster = this.monsterById(monsterId);
    if (!monster) return;
    const snapshot = monster.snapshot || {};
    const attack = computeMonsterAttackProfile(snapshot, Number(attackIndex || 0)) || {};
    const bonus = Number(attack.attackBonus ?? attack.attack ?? attack.bonus ?? attack.mod ?? 0);
    const roll = this.roll(`${monster.name} - ${attack.name || "Ataque"}`, 1, 20, bonus);
    if (compareTarget && roll) {
      const target = this.selectedTargetToken();
      if (!target) {
        this.options.notify("Marque um alvo no mapa para comparar o ataque.");
        return roll;
      }
      const targetCombatant = this.targetCombatantForToken(target);
      if (targetCombatant?.id) {
        const result = resolveMonsterAttack({
          monster: snapshot,
          target: targetCombatant,
          attackId: attack.id || Number(attackIndex || 0),
          roll: roll.rolls?.[0] || roll.total,
        });
        const ca = result.attackResult?.targetCA ?? target.metadata?.ca ?? 0;
        this.sendChat(`${monster.name} atacou ${target.name}: ${result.attackResult?.total ?? roll.total} vs CA ${ca} (${result.attackResult?.isHit ? "acerto" : "falha"}).`);
      } else {
        this.sendChat(`${monster.name} atacou ${target.name}: ${roll.total}. CA do alvo nao informada.`);
      }
    }
    return roll;
  }

  rollMonsterDamage(monsterId = "", attackIndex = 0, { applyToTarget = false } = {}) {
    const monster = this.monsterById(monsterId);
    if (!monster) return;
    const snapshot = monster.snapshot || {};
    const attack = computeMonsterAttackProfile(snapshot, Number(attackIndex || 0)) || {};
    const damage = computeMonsterDamageProfile(snapshot, attack.id || Number(attackIndex || 0)) || {};
    const formula = String(damage.formula || attack.damage || attack.dano || "1d6");
    const parsed = parseDiceFormula(formula);
    if (!parsed) {
      this.sendChat(`${monster.name} - dano de ${attack.name || "ataque"}: ${formula}`);
      return;
    }
    const roll = this.roll(`${monster.name} - Dano ${attack.name || ""}`.trim(), parsed.count, parsed.sides, parsed.bonus);
    if (applyToTarget && roll) {
      this.damageSelectedTarget(roll.total, `${monster.name} - ${attack.name || "ataque"}`);
    }
    return roll;
  }

  createLootFromMonster(monsterId = "") {
    if (!monsterId) return;
    if (this.client.isConnected) {
      this.client.createLootFromDefeatedMonster(monsterId);
      return;
    }
    const monster = this.monsterById(monsterId);
    if (!monster) return;
    const room = this.mutableOfflineRoom();
    room.lootPacks = [{
      id: createId("loot"),
      name: `Loot pendente - ${monster.name}`,
      source: monster.name,
      status: "pending",
      items: [],
      luzentis: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: "Criado a partir da ficha de monstro no modo local.",
    }, ...(room.lootPacks || [])];
    this.pushLocalCombatLog(`Loot pendente criado para ${monster.name}.`, "loot:monster:defeated", monster);
    this.render();
  }

  requestShopCartPurchase({ direct = false, asLoot = false } = {}) {
    if (!this.shopCart.length) {
      this.options.notify("Carrinho vazio.");
      return;
    }
    const total = this.shopCart.reduce((sum, line) => sum + cartLineTotal(line), 0);
    const room = this.client.isConnected && this.client.room ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter()) : this.room;
    const current = this.currentShopCharacter(room, this.currentSheetSnapshot());
    if (asLoot) {
      const pack = {
        id: createId("loot"),
        status: "pending",
        name: `Carrinho convertido em loot - ${current.name || "Personagem"}`,
        source: "Loja Solaris",
        items: this.shopCart,
        luzentis: 0,
        assignedTo: current.id || current.characterId,
        notes: `Criado a partir de carrinho no modo ${SHOP_MODE_LABELS[this.shopMode] || this.shopMode}.`,
      };
      if (this.client.isConnected) this.client.createLootPack(pack);
      else {
        this.room.lootPacks = [pack, ...(this.room.lootPacks || [])];
      }
      this.options.notify("Carrinho convertido em pacote de loot.");
      this.clearShopCart();
      return;
    }
    if (Number(current.currency || current.luzentis || 0) < total) {
      this.options.notify("Luzentis insuficientes para essa compra.", "tech-error");
      return;
    }
    if (!this.client.isConnected) {
      this.completeOfflinePurchase(this.shopCart, total);
      this.clearShopCart();
      return;
    }
    this.client.requestShopPurchase(current.id || current.characterId || this.currentSheetId(), this.shopCart, {
      total,
      direct: direct || this.shopMode === "master",
      mode: this.shopMode,
      destination: decodeDestination(this.purchaseDestination || "unassigned"),
    });
    this.options.notify(direct ? "Compra enviada como acao direta do mestre." : "Pedido de compra enviado ao mestre.");
    this.clearShopCart();
  }

  completeOfflinePurchase(lines = [], total = 0) {
    const current = this.currentSheetSnapshot();
    const instances = lines.flatMap((line) => Array.from({ length: Math.max(1, Number(line.quantity || 1)) }, () => ({
      ...line.item,
      id: createId("offline-item"),
      uid: createId("offline-item"),
      itemId: line.item.id,
      sourceItemId: line.item.id,
      price: line.price,
      location: line.destination || decodeDestination(this.purchaseDestination || "unassigned"),
    })));
    this.options.onRemoteCharacterUpdate({
      ...current,
      inventory: [...(current.inventory || []), ...instances],
      currency: Math.max(0, Number(current.currency || current.luzentis || 0) - total),
      luzentis: Math.max(0, Number(current.currency || current.luzentis || 0) - total),
      revision: this.nextSheetRevision(),
    });
    this.room.transactionLog = [
      {
        id: createId("transaction"),
        type: "purchase",
        actorName: "Modo offline",
        characterId: current.id,
        quantity: instances.length,
        price: total,
        status: "completed",
        createdAt: new Date().toISOString(),
        message: `Compra local de ${instances.length} item(ns).`,
      },
      ...(this.room.transactionLog || []),
    ];
    this.options.notify("Compra local concluida. Itens foram para sem local definido.");
  }

  createLootPackPrompt() {
    this.lootModalOpen = true;
    this.editingLootPackId = "";
    this.render();
  }

  distributeLootPackPrompt(lootPackId = "") {
    this.lootModalOpen = true;
    this.editingLootPackId = lootPackId;
    this.render();
  }

  closeLootModal() {
    this.lootModalOpen = false;
    this.editingLootPackId = "";
    this.render();
  }

  submitLootModal(form) {
    const data = new FormData(form);
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const catalogItemId = String(data.get("itemId") || "");
    const catalogItem = this.shopCatalog().find((item) => item.id === catalogItemId);
    const manualName = String(data.get("manualItem") || "").trim();
    const items = [];
    if (catalogItem) items.push({ item: catalogItem, quantity: Number(data.get("quantity") || 1), price: 0 });
    if (manualName) items.push({ item: { id: createId("manual-loot"), name: manualName, price: 0 }, quantity: Number(data.get("quantity") || 1), price: 0 });
    const pack = {
      name: String(data.get("name") || "Loot da cena"),
      luzentis: Number(data.get("luzentis") || 0),
      items,
      notes: String(data.get("notes") || ""),
    };
    const targetCharacterId = String(data.get("characterId") || this.currentSheetId());
    const destination = { kind: String(data.get("destination") || "unassigned") };
    if (this.editingLootPackId) {
      if (this.client.isConnected) this.client.distributeLootPackV2(this.editingLootPackId, targetCharacterId, { destination });
      else this.options.notify("Modo offline: a distribuicao real acontece pela ficha local.");
    } else if (this.client.isConnected) {
      this.client.createLootPackV2(pack);
    } else {
      room.lootPacks = [{ ...pack, id: createId("loot"), status: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...(room.lootPacks || [])];
      this.room = room;
    }
    this.lootModalOpen = false;
    this.editingLootPackId = "";
    this.options.notify("Loot atualizado.");
    this.render();
  }

  async ensureConnected() {
    const current = characterSnapshot(this.options.getCurrentCharacter());
    this.client.setPlayer({ id: this.client.playerId, name: current.player || current.name || "Jogador Solaris" });
    const connected = await this.client.connect();
    if (!connected) {
      this.mode = "offline";
      this.connectionMessage = this.client.lastError || "Servidor offline. A mesa continua em simulacao.";
      this.options.notify(this.connectionMessage);
      this.render();
    }
    return connected;
  }

  async createRoom() {
    const connected = await this.ensureConnected();
    if (!connected) return;
    const character = characterSnapshot(this.options.getCurrentCharacter());
    character.revision = this.nextSheetRevision();
    this.client.createRoom({
      roomName: "Colonia Solaris-7",
      character,
    });
  }

  async joinRoom() {
    const connected = await this.ensureConnected();
    if (!connected) return;
    const character = characterSnapshot(this.options.getCurrentCharacter());
    character.revision = this.nextSheetRevision();
    this.client.joinRoom({
      roomId: "colonia-solaris-7",
      roomName: "Colonia Solaris-7",
      character,
    });
  }

  leaveRoom() {
    this.client.disconnect();
    this.mode = "offline";
    this.room = demoRoomState(this.options.getCurrentCharacter());
    this.connectionMessage = "Saiu da sala. Modo simulado local.";
    this.render();
  }

  continueLauncherCampaign() {
    const active = this.activeCampaign();
    const session = active?.sessions?.[0];
    if (!active || !session) {
      this.screen = "campaigns";
      this.render();
      return;
    }
    this.loadCampaign(active.id, session.roomId);
  }

  openLauncherModal(modal) {
    this.launcherModal = modal;
    this.render();
  }

  closeLauncherModal() {
    this.launcherModal = null;
    this.render();
  }

  launchOfflineRoom() {
    this.launcherModal = null;
    this.client.disconnect();
    this.mode = "offline";
    this.room = demoRoomState(this.options.getCurrentCharacter());
    this.connectionMessage = "Sala offline local criada.";
    this.screen = "table";
    this.tableView = "table";
    this.options.notify("Sala offline criada neste computador.");
    this.render();
  }

  async launchMultiplayerRoom() {
    this.launcherModal = null;
    this.screen = "table";
    this.tableView = "table";
    await this.createRoom();
    this.render();
  }

  joinLocalAddress(address = "") {
    const raw = String(address || "").trim();
    if (!raw) {
      this.options.notify("Informe o endereço da sala local.", "tech-error");
      return;
    }
    const normalized = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
    this.launcherJoinAddress = normalized;
    const separator = normalized.includes("?") ? "&" : "?";
    window.location.href = `${normalized}${separator}view=mesaVirtual&check=20260624g`;
  }

  async copyLauncherText(text = "") {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
      await navigator.clipboard.writeText(String(text || ""));
      this.options.notify("Instruções copiadas.");
    } catch {
      this.options.notify("Não foi possível copiar automaticamente.", "tech-error");
    }
  }

  setLauncherReducedFx(enabled) {
    this.launcherReducedFx = Boolean(enabled);
    safeWriteStorage("solaris.tabletop.launcher.reducedFx", this.launcherReducedFx ? "1" : "0");
    this.render();
  }

  saveSession() {
    const saved = this.saveCurrentCampaign("Sessao salva manualmente");
    safeWriteStorage(SESSION_SAVE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      campaignId: saved.campaign.id,
      room: saved.sessionState,
    }));
    this.options.notify(`Sessao salva em ${saved.campaign.name}.`);
    this.render();
  }

  sendChat(message) {
    const text = String(message || "").trim();
    if (!text) return;
    if (this.client.isConnected) {
      this.client.sendChat(text);
      return;
    }
    this.room.chatMessages = [
      ...(this.room.chatMessages || []),
      {
        id: createId("chat"),
        authorName: characterSnapshot(this.options.getCurrentCharacter()).name,
        message: text,
        createdAt: new Date().toISOString(),
      },
    ].slice(-80);
    this.render();
  }

  roll(label = "Rolagem rapida", count = 3, sides = 6, bonus = 0) {
    const pool = rollPool(count, sides, bonus);
    const roll = {
      id: createId("roll"),
      label,
      formula: `${count}d${sides}${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ""}`,
      rolls: pool.rolls,
      total: pool.total,
      characterId: characterSnapshot(this.options.getCurrentCharacter()).id,
      authorName: characterSnapshot(this.options.getCurrentCharacter()).name,
      createdAt: new Date().toISOString(),
    };
    if (this.client.isConnected) {
      this.client.sendDiceRoll(roll);
      return roll;
    }
    this.room.diceRolls = [roll, ...(this.room.diceRolls || [])].slice(0, 80);
    this.room.chatMessages = [
      ...(this.room.chatMessages || []),
      {
        id: createId("chat"),
        authorName: roll.authorName,
        message: `${roll.label}: ${roll.formula} = ${roll.total}`,
        createdAt: roll.createdAt,
      },
    ].slice(-80);
    this.render();
    return roll;
  }

  updateResource(resource, value) {
    const current = characterSnapshot(this.options.getCurrentCharacter());
    const next = {
      currentPV: resource === "pv" ? Number(value) : current.currentPV,
      pvCurrent: resource === "pv" ? Number(value) : current.currentPV,
      cosmosCurrent: resource === "cosmos" ? Number(value) : current.cosmosCurrent,
      stress: resource === "stress" ? Number(value) : current.stress,
    };
    this.options.onResourceUpdate(next);
    if (this.client.isConnected) this.client.updateCharacterResources(current.id, next);
    this.refresh();
  }

  promptNumber(label, fallback = 0) {
    const raw = window.prompt(label, String(fallback));
    if (raw === null) return null;
    const value = Number(raw.replace(",", "."));
    return Number.isFinite(value) ? value : fallback;
  }

  localPlayer(room = this.room) {
    return (room.players || []).find((player) => player.id === this.client.playerId) || null;
  }

  isLocalGm(room = this.room) {
    const player = this.localPlayer(room);
    return player?.role === SESSION_ROLES.GM || player?.isGM;
  }

  mutableOfflineRoom() {
    this.room = normalizeServerRoom(this.room, this.options.getCurrentCharacter());
    this.room.monsters = Array.isArray(this.room.monsters) ? this.room.monsters : [];
    this.room.combat = normalizeCombatState(this.room, this.options.getCurrentCharacter());
    this.room.scene = normalizeScene(this.room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    return this.room;
  }

  activeRoomSnapshot() {
    return this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
  }

  selectedTargetToken(scene = null) {
    const resolvedScene = scene || normalizeScene(this.activeRoomSnapshot().scene, this.options.getCurrentCharacter());
    return (resolvedScene.tokens || []).find((token) => token.id === this.selectedTargetTokenId) || null;
  }

  targetCombatantForToken(token = {}) {
    if (!token?.entityId) return null;
    const room = this.activeRoomSnapshot();
    const combat = normalizeCombatState(room, this.options.getCurrentCharacter());
    return (combat.combatants || []).find((entry) => entry.entityId === token.entityId || entry.id === token.entityId) || null;
  }

  selectTargetToken(tokenId = "") {
    const scene = normalizeScene(this.activeRoomSnapshot().scene, this.options.getCurrentCharacter());
    const token = (scene.tokens || []).find((entry) => entry.id === tokenId);
    if (!token) return;
    this.selectedTargetTokenId = token.id;
    this.selectedCombatantId = token.entityId || this.selectedCombatantId;
    this.mapTool = "move";
    this.options.notify(`${token.name} marcado como alvo.`);
    this.render();
  }

  selectTargetByEntity(entityId = "") {
    const scene = normalizeScene(this.activeRoomSnapshot().scene, this.options.getCurrentCharacter());
    const token = (scene.tokens || []).find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (token) this.selectTargetToken(token.id);
  }

  applyDamageToToken(token = {}, amount = 0, sourceLabel = "acao") {
    const damage = Math.max(0, Number(amount || 0));
    if (!token?.entityId || damage <= 0) return null;
    if (this.client.isConnected) {
      this.client.damageCombatant({
        entityType: token.entityType,
        entityId: token.entityId,
        amount: damage,
        sourceLabel,
      });
      return { ...token, amount: damage };
    }
    const updated = this.mutateCombatant(token.entityId, (entry) => {
      entry.currentPV = Math.max(0, Number(entry.currentPV || 0) - damage);
      entry.pvAtual = entry.currentPV;
      entry.isDefeated = entry.currentPV <= 0;
    });
    if (updated) {
      this.pushLocalCombatLog(`${updated.name} sofreu ${damage} de dano por ${sourceLabel}.`, "damage", updated);
      if (updated.entityType === "monster" && updated.currentPV <= 0) this.createLootFromMonster(updated.entityId);
    }
    return updated;
  }

  damageSelectedTarget(amount = null, sourceLabel = "dano manual") {
    const scene = normalizeScene(this.activeRoomSnapshot().scene, this.options.getCurrentCharacter());
    const target = this.selectedTargetToken(scene);
    if (!target) {
      this.options.notify("Marque um alvo no mapa primeiro.");
      return;
    }
    const damage = amount === null ? this.promptNumber(`Dano em ${target.name}`, 1) : Number(amount || 0);
    if (damage === null) return;
    this.applyDamageToToken(target, damage, sourceLabel);
    if (!this.client.isConnected) this.render();
  }

  applyDamageToSelectedArea() {
    const room = this.activeRoomSnapshot();
    if (this.client.isConnected && !this.isLocalGm(room)) {
      this.options.notify("Apenas o mestre aplica dano em area na mesa.");
      return;
    }
    const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
    const area = (scene.areas || []).find((entry) => entry.id === this.selectedAreaId) || (scene.areas || [])[0];
    if (!area) {
      this.options.notify("Crie ou selecione uma area primeiro.");
      return;
    }
    const amount = this.promptNumber(`Dano da area ${area.label || "selecionada"}`, 1);
    if (amount === null) return;
    const domainScene = new Scene(scene);
    const targets = domainScene.tokensInsideArea(area.id).filter((token) => !token.hidden);
    if (!targets.length) {
      this.options.notify("Nenhum token dentro dessa area.");
      return;
    }
    targets.forEach((token) => this.applyDamageToToken(token, amount, area.label || "area de efeito"));
    const names = targets.map((token) => token.name).join(", ");
    this.sendChat(`${area.label || "Area"} causou ${amount} de dano em ${names}.`);
    if (!this.client.isConnected) this.render();
  }

  sceneTokenFromCharacter(character = {}, index = 0) {
    const snapshot = characterSnapshot(character.snapshot || character);
    return {
      id: `token-character-${snapshot.id}`,
      entityType: "character",
      entityId: snapshot.id,
      name: snapshot.name,
      x: 2 + (index % 3),
      y: 4 + Math.floor(index / 3),
      image: snapshot.portrait,
      color: "#39cfff",
    };
  }

  sceneTokenFromMonster(monster = {}, index = 0, scene = {}) {
    const snapshot = monster.snapshot || monster;
    const columns = Math.max(4, Number(scene.columns || 12));
    return {
      id: `token-monster-${monster.id || snapshot.id}`,
      entityType: "monster",
      entityId: monster.id || snapshot.id,
      name: monster.name || snapshot.name || "Monstro",
      x: Math.max(1, columns - 2 - (index % 2)),
      y: 2 + index,
      image: snapshot.imageDataUrl || snapshot.image || "",
      color: "#ff4e63",
    };
  }

  syncSceneTokens() {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    const byEntity = new Map((scene.tokens || []).map((token) => [`${token.entityType}:${token.entityId}`, token]));
    (room.characters || []).forEach((character, index) => {
      const token = this.sceneTokenFromCharacter(character, index);
      if (!byEntity.has(`character:${token.entityId}`)) scene.tokens.push(token);
    });
    (room.monsters || []).forEach((monster, index) => {
      const token = this.sceneTokenFromMonster(monster, index, scene);
      if (!byEntity.has(`monster:${token.entityId}`)) scene.tokens.push(token);
    });
    if (this.client.isConnected) {
      if (!this.isLocalGm(room)) {
        this.options.notify("Apenas o mestre sincroniza a cena inteira. Jogadores movem o proprio token.");
        return;
      }
      this.client.updateScene({
        name: scene.name,
        notes: scene.notes,
        columns: scene.columns,
        rows: scene.rows,
        tokens: scene.tokens,
        zones: scene.zones,
        objectives: scene.objectives,
      });
      return;
    }
    this.room.scene = scene;
    this.render();
  }

  editScene() {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    const name = window.prompt("Nome da cena", scene.name);
    if (name === null) return;
    const notes = window.prompt("Notas visiveis da cena", scene.notes);
    if (notes === null) return;
    const columns = this.promptNumber("Colunas do grid", scene.columns);
    if (columns === null) return;
    const rows = this.promptNumber("Linhas do grid", scene.rows);
    if (rows === null) return;
    const patch = { name, notes, columns, rows };
    if (this.client.isConnected) {
      if (!this.isLocalGm(room)) {
        this.options.notify("Apenas o mestre edita a cena compartilhada.");
        return;
      }
      this.client.updateScene(patch);
      return;
    }
    this.room.scene = { ...scene, ...patch };
    this.render();
  }

  pushScenePatch(patch = {}, eventMethod = "updateScene") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    if (this.client.isConnected) {
      if (!this.isLocalGm(room) && !["createSceneMeasurement", "clearSceneMeasurements"].includes(eventMethod)) {
        this.options.notify("Apenas o mestre altera a cena compartilhada.");
        return false;
      }
      if (typeof this.client[eventMethod] === "function") {
        this.client[eventMethod](...(Array.isArray(patch) ? patch : [patch]));
      } else {
        this.client.updateScene(patch);
      }
      return true;
    }
    this.room.scene = { ...scene, ...patch };
    this.render();
    return true;
  }

  selectMapFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const mapImage = String(reader.result || "");
      if (!mapImage) return;
      if (this.client.isConnected) {
        this.client.updateSceneMap(mapImage, { name: file.name });
      } else {
        const room = this.mutableOfflineRoom();
        this.room.scene = { ...normalizeScene(room.scene, this.options.getCurrentCharacter()), mapImage };
        this.render();
      }
      this.options.notify("Mapa selecionado para a cena.");
    });
    reader.readAsDataURL(file);
  }

  updateGridSetting(field = "", value = "") {
    const numericFields = new Set(["columns", "rows", "gridSize", "gridOpacity", "metersPerCell"]);
    const booleanFields = new Set(["gridVisible", "snapToGrid"]);
    const patch = {
      [field]: booleanFields.has(field)
        ? Boolean(value)
        : numericFields.has(field)
          ? Number(value)
          : value,
    };
    this.pushScenePatch(patch, "updateSceneGrid");
  }

  setMapTool(tool = "move") {
    this.mapTool = tool;
    this.measurementStart = null;
    this.render();
  }

  handleMapPoint(point = {}) {
    if (this.mapTool === "target") {
      this.options.notify("Clique em um token para marcar o alvo.");
      return;
    }
    if (this.mapTool === "measure") {
      if (!this.measurementStart) {
        this.measurementStart = point;
        this.options.notify(`Medicao iniciada em ${gridLabel(point.x, point.y)}.`);
        this.render();
        return;
      }
      const measurement = { from: this.measurementStart, to: point, visibleToPlayers: true };
      this.measurementStart = null;
      if (this.client.isConnected) this.client.createSceneMeasurement(measurement);
      else {
        const room = this.mutableOfflineRoom();
        const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
        const cells = Math.hypot(point.x - measurement.from.x, point.y - measurement.from.y);
        const meters = Number((cells * Number(scene.metersPerCell || 1.5)).toFixed(2));
        scene.measurements = [{ ...measurement, id: createId("measurement"), cells: Number(cells.toFixed(2)), meters }, ...(scene.measurements || [])].slice(0, 12);
        this.room.scene = scene;
        this.render();
      }
      return;
    }
    this.moveMapToken(this.selectedMapTokenId, point.x, point.y);
  }

  clearMeasurements() {
    if (this.client.isConnected) this.client.clearSceneMeasurements();
    else {
      const room = this.mutableOfflineRoom();
      this.room.scene = { ...normalizeScene(room.scene, this.options.getCurrentCharacter()), measurements: [] };
      this.render();
    }
  }

  addSceneArea(type = "circle") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    if (this.client.isConnected && !this.isLocalGm(room)) {
      this.options.notify("Apenas o mestre cria areas na cena.");
      return;
    }
    const selected = scene.tokens.find((token) => token.id === this.selectedMapTokenId) || scene.tokens[0] || {};
    const label = window.prompt("Nome da area", type === "cone" ? "Cone de efeito" : type === "line" ? "Linha de efeito" : "Area de efeito");
    if (!label) return;
    const radius = type === "circle" ? this.promptNumber("Raio em casas", 2) : 0;
    const length = type !== "circle" ? this.promptNumber("Comprimento em casas", 4) : radius;
    const width = type === "cone" ? this.promptNumber("Largura final em casas", 3) : type === "line" ? this.promptNumber("Largura em casas", 1) : radius;
    const rawDirection = type === "circle" ? "east" : (window.prompt("Direcao (east, west, north, south)", "east") || "east").toLowerCase();
    const direction = ["east", "west", "north", "south"].includes(rawDirection) ? rawDirection : "east";
    const area = {
      id: createId("area"),
      type,
      label,
      x: selected.x || 2,
      y: selected.y || 2,
      radius: radius || 0,
      length: length || radius || 2,
      width: width || 1,
      direction,
      color: type === "circle" ? "#9b4dff" : type === "cone" ? "#ffb84d" : "#39cfff",
      visibleToPlayers: true,
    };
    if (this.client.isConnected) this.client.createSceneArea(area);
    else {
      this.room.scene = { ...scene, areas: [...(scene.areas || []), area] };
      this.render();
    }
  }

  clearSceneAreas() {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    if (this.client.isConnected && !this.isLocalGm(room)) {
      this.options.notify("Apenas o mestre limpa areas da cena.");
      return;
    }
    const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
    if (this.client.isConnected) this.client.updateScene({ areas: [] });
    else {
      this.room.scene = { ...scene, areas: [] };
      this.render();
    }
  }

  toggleSelectedTokenVisibility() {
    if (!this.selectedMapTokenId) return;
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
    const token = scene.tokens.find((entry) => entry.id === this.selectedMapTokenId);
    if (!token) return;
    const hidden = !token.hidden;
    if (this.client.isConnected) {
      if (!this.isLocalGm(room)) {
        this.options.notify("Apenas o mestre oculta ou revela tokens.");
        return;
      }
      this.client.updateSceneVisibility({ targetType: "token", id: token.id, hidden });
      return;
    }
    token.hidden = hidden;
    this.room.scene = scene;
    this.render();
  }

  createObjectivePrompt() {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    if (this.client.isConnected && !this.isLocalGm(room)) {
      this.options.notify("Apenas o mestre cria objetivos.");
      return;
    }
    const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
    const title = window.prompt("Titulo do objetivo", "Ativar console");
    if (!title) return;
    const progressMax = this.promptNumber("Progresso maximo", 1);
    if (progressMax === null) return;
    const selected = scene.tokens.find((token) => token.id === this.selectedMapTokenId) || {};
    const objective = {
      id: createId("objective"),
      title,
      label: title,
      description: window.prompt("Descricao curta", "") || "",
      progressCurrent: 0,
      progressMax,
      x: selected.x || 2,
      y: selected.y || 2,
      visibleToPlayers: true,
    };
    if (this.client.isConnected) this.client.createSceneObjective(objective);
    else {
      this.room.scene = { ...scene, objectives: [...(scene.objectives || []), objective] };
      this.render();
    }
  }

  updateObjectiveProgress(objectiveId = "") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, this.options.getCurrentCharacter());
    const objective = (scene.objectives || []).find((entry) => entry.id === objectiveId);
    if (!objective) return;
    const progressCurrent = this.promptNumber(`Progresso de ${objective.title || objective.label}`, objective.progressCurrent || 0);
    if (progressCurrent === null) return;
    const patch = { ...objective, progressCurrent, completed: progressCurrent >= Number(objective.progressMax || 1) };
    if (this.client.isConnected) this.client.updateSceneObjective(objective.id, patch);
    else {
      this.room.scene = {
        ...scene,
        objectives: scene.objectives.map((entry) => entry.id === objective.id ? patch : entry),
      };
      this.render();
    }
  }

  addSceneZone(type = "danger") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    const label = window.prompt(type === "cover" ? "Nome da cobertura" : "Nome da zona de perigo", type === "cover" ? "Cobertura parcial" : "Zona de risco");
    if (!label) return;
    const x = this.promptNumber("Coluna inicial", 5);
    if (x === null) return;
    const y = this.promptNumber("Linha inicial", 3);
    if (y === null) return;
    const width = this.promptNumber("Largura em casas", 2);
    if (width === null) return;
    const height = this.promptNumber("Altura em casas", 2);
    if (height === null) return;
    const zone = {
      id: createId("zone"),
      label,
      type,
      x,
      y,
      width,
      height,
    };
    const patch = { zones: [...(scene.zones || []), zone] };
    if (this.client.isConnected) {
      if (!this.isLocalGm(room)) {
        this.options.notify("Apenas o mestre altera zonas da cena.");
        return;
      }
      this.client.updateScene(patch);
      return;
    }
    this.room.scene = { ...scene, zones: patch.zones };
    this.render();
  }

  mapPointFromEvent(event, scene = {}) {
    const grid = event.currentTarget.closest?.(".vtt-map-grid") || event.currentTarget;
    const rect = grid.getBoundingClientRect();
    const columns = Math.max(4, Number(scene.columns || 12));
    const rows = Math.max(4, Number(scene.rows || 8));
    const x = clamp(Math.floor(((event.clientX - rect.left) / rect.width) * columns) + 1, 1, columns);
    const y = clamp(Math.floor(((event.clientY - rect.top) / rect.height) * rows) + 1, 1, rows);
    return { x, y };
  }

  moveMapToken(tokenId = "", x = 1, y = 1) {
    if (!tokenId) {
      this.options.notify("Selecione um token no mapa primeiro.");
      return;
    }
    if (this.client.isConnected) {
      this.client.moveToken(tokenId, x, y);
      return;
    }
    const room = this.mutableOfflineRoom();
    const scene = normalizeScene(room.scene, characterSnapshot(this.options.getCurrentCharacter()));
    const token = scene.tokens.find((entry) => entry.id === tokenId);
    if (!token) return;
    token.x = x;
    token.y = y;
    this.room.scene = scene;
    this.pushLocalCombatLog(`${token.name} moveu para ${gridLabel(x, y)}.`, "token:move", token);
    this.render();
  }

  pushLocalCombatLog(message, type = "info", target = {}) {
    const room = this.mutableOfflineRoom();
    const current = characterSnapshot(this.options.getCurrentCharacter());
    const entry = {
      id: createId("combat-log"),
      type,
      actorId: this.client.playerId,
      actorName: current.name,
      targetId: target.entityId || target.id || "",
      targetName: target.name || "",
      message,
      createdAt: new Date().toISOString(),
    };
    room.combat.log = [entry, ...(room.combat.log || [])].slice(0, 80);
    room.chatMessages = [
      ...(room.chatMessages || []),
      {
        id: createId("chat"),
        authorName: "Combate",
        message,
        createdAt: entry.createdAt,
      },
    ].slice(-80);
    return entry;
  }

  startCombat() {
    const room = normalizeServerRoom(this.room, this.options.getCurrentCharacter());
    const combat = normalizeCombatState(room, this.options.getCurrentCharacter());
    const entries = combat.combatants.map((combatant) => ({
      entityType: combatant.entityType,
      entityId: combatant.entityId,
      name: combatant.name,
      initiative: combatant.initiative,
      ownerPlayerId: combatant.ownerPlayerId || "",
      portrait: combatant.portrait || "",
      currentPV: combatant.currentPV,
      maxPV: combatant.maxPV,
      ca: combatant.ca,
      isDefeated: combatant.isDefeated,
    }));
    if (this.client.isConnected) {
      this.client.startCombat({ combatants: combat.combatants, entries });
      return;
    }
    this.room.combat = {
      ...combat,
      active: true,
      round: 1,
      turnIndex: 0,
      entries: entries.sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name, "pt-BR")),
    };
    this.pushLocalCombatLog("Combate iniciado.", "combat:start");
    this.render();
  }

  endCombat() {
    if (this.client.isConnected) {
      this.client.endCombat();
      return;
    }
    const room = this.mutableOfflineRoom();
    room.combat.active = false;
    this.pushLocalCombatLog("Combate encerrado.", "combat:end");
    this.render();
  }

  nextTurn() {
    if (this.client.isConnected) {
      this.client.send("turn:next", {});
      return;
    }
    const room = this.mutableOfflineRoom();
    const combat = room.combat;
    if (!combat.entries.length) return;
    combat.turnIndex += 1;
    if (combat.turnIndex >= combat.entries.length) {
      combat.turnIndex = 0;
      combat.round = Math.max(1, Number(combat.round || 1) + 1);
    }
    const entry = combat.entries[combat.turnIndex];
    this.pushLocalCombatLog(`Turno de ${entry.name} (rodada ${combat.round}).`, "turn:next", entry);
    this.render();
  }

  rollInitiative(entityId = "") {
    const bonus = this.promptNumber("Bonus de iniciativa", 0);
    if (bonus === null) return;
    const room = this.mutableOfflineRoom();
    const combat = room.combat;
    const combatant = combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) return;
    if (this.client.isConnected) {
      this.client.rollInitiative({ entityId: combatant.entityId, bonus });
      return;
    }
    const pool = rollPool(1, 20, bonus);
    combatant.initiative = pool.total;
    const entry = {
      entityType: combatant.entityType,
      entityId: combatant.entityId,
      name: combatant.name,
      initiative: pool.total,
      ownerPlayerId: combatant.ownerPlayerId || "",
      portrait: combatant.portrait || "",
      currentPV: combatant.currentPV,
      maxPV: combatant.maxPV,
      ca: combatant.ca,
      isDefeated: combatant.isDefeated,
    };
    const existingIndex = combat.entries.findIndex((item) => item.entityId === combatant.entityId);
    if (existingIndex >= 0) combat.entries[existingIndex] = entry;
    else combat.entries.push(entry);
    combat.entries.sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name, "pt-BR"));
    this.room.diceRolls = [{
      id: createId("roll"),
      label: `Iniciativa - ${combatant.name}`,
      formula: `1d20${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ""}`,
      rolls: pool.rolls,
      total: pool.total,
      createdAt: new Date().toISOString(),
    }, ...(this.room.diceRolls || [])].slice(0, 80);
    this.pushLocalCombatLog(`${combatant.name} rolou iniciativa ${pool.total}.`, "initiative:roll", combatant);
    this.render();
  }

  mutateCombatant(entityId = "", mutate) {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) return null;
    mutate(combatant);
    const entry = room.combat.entries.find((item) => item.entityId === combatant.entityId);
    if (entry) {
      entry.currentPV = combatant.currentPV;
      entry.maxPV = combatant.maxPV;
      entry.isDefeated = combatant.currentPV <= 0;
    }
    if (combatant.entityType === "monster") {
      const monster = room.monsters.find((item) => item.id === combatant.entityId);
      if (monster) {
        monster.snapshot.currentPV = combatant.currentPV;
        monster.snapshot.maxPV = combatant.maxPV;
        monster.conditions = combatant.conditions;
      }
    } else {
      this.options.onResourceUpdate({
        currentPV: combatant.currentPV,
        pvCurrent: combatant.currentPV,
        cosmosCurrent: combatant.cosmosCurrent,
        stress: combatant.stress,
      });
    }
    return combatant;
  }

  damageCombatant(entityId = "") {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) return;
    const amount = this.promptNumber(`Dano em ${combatant.name}`, 1);
    if (amount === null) return;
    if (this.client.isConnected) {
      this.client.damageCombatant({ entityType: combatant.entityType, entityId: combatant.entityId, amount });
      return;
    }
    const updated = this.mutateCombatant(entityId, (entry) => {
      entry.currentPV = Math.max(0, Number(entry.currentPV || 0) - Math.max(0, amount));
      entry.pvAtual = entry.currentPV;
      entry.isDefeated = entry.currentPV <= 0;
    });
    this.pushLocalCombatLog(`${updated.name} sofreu ${amount} de dano.`, "damage", updated);
    this.render();
  }

  healCombatant(entityId = "") {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) return;
    const amount = this.promptNumber(`Cura em ${combatant.name}`, 1);
    if (amount === null) return;
    if (this.client.isConnected) {
      this.client.healCombatant({ entityType: combatant.entityType, entityId: combatant.entityId, amount });
      return;
    }
    const updated = this.mutateCombatant(entityId, (entry) => {
      entry.currentPV = Math.min(Number(entry.maxPV || entry.currentPV || 0), Number(entry.currentPV || 0) + Math.max(0, amount));
      entry.pvAtual = entry.currentPV;
      entry.isDefeated = entry.currentPV <= 0;
    });
    this.pushLocalCombatLog(`${updated.name} recuperou ${amount} PV.`, "heal", updated);
    this.render();
  }

  addCondition(entityId = "") {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant) return;
    const label = window.prompt(`Condicao para ${combatant.name}`, "Marcado");
    if (!label) return;
    const condition = {
      id: createId("condition"),
      label: label.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    if (this.client.isConnected) {
      this.client.addCombatantCondition({ entityType: combatant.entityType, entityId: combatant.entityId, condition });
      return;
    }
    const updated = this.mutateCombatant(entityId, (entry) => {
      entry.conditions = [...(entry.conditions || []), condition];
    });
    this.pushLocalCombatLog(`${updated.name} recebeu a condicao ${condition.label}.`, "condition:add", updated);
    this.render();
  }

  removeCondition(entityId = "", conditionId = "") {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant || !conditionId) return;
    if (this.client.isConnected) {
      this.client.removeCombatantCondition({ entityType: combatant.entityType, entityId: combatant.entityId, conditionId });
      return;
    }
    this.mutateCombatant(entityId, (entry) => {
      entry.conditions = (entry.conditions || []).filter((condition) => condition.id !== conditionId);
    });
    this.render();
  }

  addMonsterToCombat(monsterId = "") {
    const catalog = this.options.getMonsterCatalog() || [];
    const monster = catalog.find((entry) => entry.id === monsterId) || catalog[0];
    if (!monster) {
      this.options.notify("Nenhum monstro encontrado no bestiario.", "tech-error");
      return;
    }
    const sessionMonster = normalizeMonsterForSession(monster);
    if (this.client.isConnected) {
      this.client.createMonster(sessionMonster);
      this.monsterPickerOpen = false;
      return;
    }
    const room = this.mutableOfflineRoom();
    room.monsters.push(sessionMonster);
    const combatant = combatantFromMonster(sessionMonster);
    room.combat.combatants.push(combatant);
    room.combat.entries.push({
      entityType: combatant.entityType,
      entityId: combatant.entityId,
      name: combatant.name,
      initiative: combatant.initiative,
      currentPV: combatant.currentPV,
      maxPV: combatant.maxPV,
      ca: combatant.ca,
    });
    this.selectedCombatantId = combatant.entityId;
    this.monsterPickerOpen = false;
    this.pushLocalCombatLog(`${combatant.name} entrou na cena.`, "monster:create", combatant);
    this.render();
  }

  deleteMonsterFromCombat(entityId = "") {
    const room = this.mutableOfflineRoom();
    const combatant = room.combat.combatants.find((entry) => entry.entityId === entityId || entry.id === entityId);
    if (!combatant || combatant.entityType !== "monster") return;
    if (this.client.isConnected) {
      this.client.deleteMonster(combatant.entityId);
      return;
    }
    room.monsters = room.monsters.filter((monster) => monster.id !== combatant.entityId);
    room.combat.combatants = room.combat.combatants.filter((entry) => entry.entityId !== combatant.entityId);
    room.combat.entries = room.combat.entries.filter((entry) => entry.entityId !== combatant.entityId);
    this.pushLocalCombatLog(`${combatant.name} saiu da cena.`, "monster:delete", combatant);
    this.render();
  }

  renderTacticalMap(room, current, combat) {
    const scene = normalizeScene(room.scene, current);
    const localPlayer = this.localPlayer(room);
    const isGm = localPlayer?.role === SESSION_ROLES.GM || localPlayer?.isGM;
    const tokens = visibleSceneItems(scene.tokens || [], isGm);
    const zones = visibleSceneItems(scene.zones || [], isGm);
    const areas = visibleSceneItems(scene.areas || [], isGm);
    const objectives = visibleSceneItems(scene.objectives || [], isGm);
    const measurements = visibleSceneItems(scene.measurements || [], isGm);
    const selectedToken = scene.tokens.find((token) => token.id === this.selectedMapTokenId) || scene.tokens[0] || null;
    if (!this.selectedMapTokenId && selectedToken) this.selectedMapTokenId = selectedToken.id;
    const selectedTarget = scene.tokens.find((token) => token.id === this.selectedTargetTokenId) || null;
    const selectedArea = areas.find((area) => area.id === this.selectedAreaId) || null;
    const selectedAreaHits = selectedArea
      ? new Set(new Scene(scene).tokensInsideArea(selectedArea.id).map((token) => token.id))
      : new Set();
    const selectedAreaNames = selectedArea
      ? tokens.filter((token) => selectedAreaHits.has(token.id)).map((token) => token.name)
      : [];
    const movement = selectedToken?.metadata?.lastMove || null;
    return `
      <section class="vtt-map-panel">
        <div class="vtt-map-toolbar">
          <div>
            <strong>Mapa tatico</strong>
            <span>${escapeHtml(scene.columns)} x ${escapeHtml(scene.rows)} casas</span>
          </div>
          <input type="file" accept="image/*" data-vtt-map-file hidden />
          <button type="button" data-vtt-map-action="select-map" ${isGm || !this.client.isConnected ? "" : "disabled"}>Selecionar Mapa</button>
          <button type="button" data-vtt-map-action="sync-tokens">Tokens</button>
          <button type="button" data-vtt-map-action="edit-scene">Cena</button>
          <button type="button" class="${this.mapTool === "target" ? "active" : ""}" data-vtt-map-tool="target">Alvo</button>
          <button type="button" class="${this.mapTool === "measure" ? "active" : ""}" data-vtt-map-tool="measure">Medir Distancia</button>
          <button type="button" data-vtt-map-action="clear-measurements">Limpar Medidas</button>
          <button type="button" data-vtt-map-action="area-circle">Area Circular</button>
          <button type="button" data-vtt-map-action="area-cone">Cone</button>
          <button type="button" data-vtt-map-action="area-line">Linha</button>
          <button type="button" data-vtt-map-action="damage-area" ${selectedArea ? "" : "disabled"}>Dano Area</button>
          <button type="button" data-vtt-map-action="clear-areas">Limpar Areas</button>
          <button type="button" data-vtt-map-action="toggle-visibility" ${selectedToken ? "" : "disabled"}>${selectedToken?.hidden ? "Revelar" : "Ocultar"}</button>
          <button type="button" data-vtt-map-action="create-objective">Objetivo</button>
        </div>
        <div class="vtt-grid-controls">
          <label>Col.<input type="number" min="4" max="40" value="${escapeHtml(scene.columns)}" data-vtt-grid-setting="columns" /></label>
          <label>Lin.<input type="number" min="4" max="40" value="${escapeHtml(scene.rows)}" data-vtt-grid-setting="rows" /></label>
          <label>Escala<input type="number" min="0.5" max="12" step="0.5" value="${escapeHtml(scene.metersPerCell)}" data-vtt-grid-setting="metersPerCell" /></label>
          <label>Grid<input type="checkbox" ${scene.gridVisible ? "checked" : ""} data-vtt-grid-toggle="gridVisible" /></label>
          <label>Snap<input type="checkbox" ${scene.snapToGrid ? "checked" : ""} data-vtt-grid-toggle="snapToGrid" /></label>
          <label>Opac.<input type="range" min="0" max="1" step="0.05" value="${escapeHtml(scene.gridOpacity)}" data-vtt-grid-setting="gridOpacity" /></label>
        </div>
        <div
          class="vtt-map-grid ${scene.gridVisible ? "" : "grid-hidden"} ${this.mapTool === "measure" ? "measuring" : ""}"
          data-vtt-map-grid
          data-columns="${escapeHtml(scene.columns)}"
          data-rows="${escapeHtml(scene.rows)}"
          aria-label="Mapa tatico da cena"
          style="--map-columns:${escapeHtml(scene.columns)};--map-rows:${escapeHtml(scene.rows)};--grid-opacity:${escapeHtml(scene.gridOpacity)};${scene.mapImage ? `--map-image:url('${escapeHtml(scene.mapImage)}');` : ""}"
        >
          <div class="vtt-map-glow"></div>
          <div class="vtt-grid-coordinate top-left">A1</div>
          <div class="vtt-grid-coordinate bottom-right">${escapeHtml(gridLabel(scene.columns, scene.rows))}</div>
          ${zones.map((zone) => `
            <span
              class="vtt-map-zone ${escapeHtml(zone.type || "danger")}"
              title="${escapeHtml(zone.label || "Zona")}"
              style="${zoneGridStyle(zone, scene)}"
            >
              ${escapeHtml(zone.label || "Zona")}
            </span>
          `).join("")}
          ${areas.map((area) => `
            <button
              type="button"
              class="vtt-map-area ${escapeHtml(area.type || "circle")} ${area.hidden ? "hidden" : ""} ${area.id === this.selectedAreaId ? "selected" : ""}"
              style="${areaGridStyle(area, scene)}"
              title="${escapeHtml([area.label || "Area", area.type !== "circle" ? directionLabel(area.direction || "east") : ""].filter(Boolean).join(" - "))}"
              data-vtt-map-area="${escapeHtml(area.id)}"
            >
              ${escapeHtml(area.label || "Area")}
              ${area.type !== "circle" ? `<small>${escapeHtml(directionLabel(area.direction || "east"))}</small>` : ""}
            </button>
          `).join("")}
          ${measurements.map((measurement) => `
            <span class="vtt-map-measurement" style="${measurementStyle(measurement, scene)}">
              <i></i><b>${escapeHtml(measurement.cells)} casas / ${escapeHtml(measurement.meters)}m</b>
            </span>
          `).join("")}
          ${objectives.filter((objective) => objective.x && objective.y).map((objective) => `
            <span
              class="vtt-map-objective ${objective.completed ? "completed" : ""}"
              style="${tokenGridStyle({ x: objective.x, y: objective.y, color: "#f2c35b" }, scene)}"
              title="${escapeHtml(objective.title || objective.label)}"
              data-vtt-objective-progress="${escapeHtml(objective.id)}"
            >
              ${escapeHtml(`${objective.progressCurrent ?? 0}/${objective.progressMax ?? 1}`)}
            </span>
          `).join("")}
          ${tokens.map((token) => `
            <button
              type="button"
              class="vtt-map-token ${tokenKindClass(token)} ${token.id === this.selectedMapTokenId ? "selected" : ""} ${token.id === this.selectedTargetTokenId ? "targeted" : ""} ${selectedAreaHits.has(token.id) ? "area-hit" : ""} ${token.locked ? "locked" : ""}"
              data-vtt-map-token="${escapeHtml(token.id)}"
              draggable="true"
              style="${tokenGridStyle(token, scene)}"
              title="${escapeHtml(token.name)} em ${escapeHtml(gridLabel(token.x, token.y))}"
            >
              ${token.image ? `<img src="${escapeHtml(token.image)}" alt="" />` : `<span>${escapeHtml(tokenInitial(token))}</span>`}
            </button>
          `).join("")}
          <div class="vtt-map-caption">
            <strong>${escapeHtml(scene.name)}</strong>
            <small>${selectedToken ? `${escapeHtml(selectedToken.name)} selecionado em ${escapeHtml(gridLabel(selectedToken.x, selectedToken.y))}` : "Selecione um token para mover."}</small>
            ${selectedTarget ? `<small class="vtt-map-target">Alvo: ${escapeHtml(selectedTarget.name)} em ${escapeHtml(gridLabel(selectedTarget.x, selectedTarget.y))}</small>` : `<small>Modo Alvo marca quem recebe ataques e dano.</small>`}
            ${selectedArea ? `<small>Area ativa: ${escapeHtml(selectedArea.label || selectedArea.type)}${selectedArea.type !== "circle" ? ` / ${escapeHtml(directionLabel(selectedArea.direction || "east"))}` : ""}</small>` : ""}
            ${selectedArea ? `<small>${selectedAreaNames.length ? `Atinge: ${escapeHtml(selectedAreaNames.join(", "))}` : "Nenhum token atingido pela area."}</small>` : ""}
            ${this.measurementStart ? `<small>Medindo desde ${escapeHtml(gridLabel(this.measurementStart.x, this.measurementStart.y))}</small>` : ""}
            ${movement?.exceedsMovement ? `<small class="vtt-map-warning">Movimento excede o MOV (${escapeHtml(movement.meters)}m / ${escapeHtml(movement.movement)}m)</small>` : ""}
          </div>
        </div>
        <div class="vtt-map-footer">
          <span>${combat.active ? `Combate ativo: rodada ${escapeHtml(combat.round || 1)}` : "Cena livre"}</span>
          <span>${escapeHtml(tokens.length)} token${tokens.length === 1 ? "" : "s"}</span>
          <span>${escapeHtml(areas.length)} area${areas.length === 1 ? "" : "s"}</span>
          <span>1 casa = ${escapeHtml(scene.metersPerCell)}m</span>
        </div>
        <div class="vtt-quick-actions">
          <button type="button" data-vtt-roll="Teste rapido" data-count="3" data-sides="6">Rolar</button>
          <button type="button" data-vtt-roll="Ataque" data-count="1" data-sides="20">Atacar</button>
          <button type="button" data-vtt-action="damage-target" ${selectedTarget ? "" : "disabled"}>Dano no alvo</button>
          <button type="button" data-vtt-action="damage-area" ${selectedArea ? "" : "disabled"}>Dano na area</button>
          <button type="button" data-vtt-action="use-item">Usar Item</button>
          <button type="button" data-vtt-action="move-item">Mover Item</button>
          <button type="button" data-vtt-action="equip-item">Equipar</button>
          <button type="button" data-vtt-roll="Conjurar" data-count="3" data-sides="6">Conjurar</button>
          <button type="button" data-vtt-action="request-purchase">Comprar</button>
          <button type="button" data-vtt-action="request-sale">Vender</button>
          <button type="button" data-vtt-action="request-delete">Excluir</button>
        </div>
      </section>
    `;
  }

  renderSessionShop(room, current) {
    const filtered = this.filteredShopCatalog();
    const tiers = [...new Set(this.shopCatalog().map((item) => item.tier).filter(Boolean))].slice(0, 16);
    const paginated = paginateItems(filtered, this.shopPage, 20);
    const balance = Number(current.currency || current.luzentis || 0);
    const cartTotal = this.shopCart.reduce((sum, line) => sum + cartLineTotal(line), 0);
    const localPlayer = this.localPlayer(room);
    const isGm = localPlayer?.role === SESSION_ROLES.GM || localPlayer?.isGM;
    return `
      <section class="vtt-panel vtt-shop-panel" aria-label="Loja da Sessao">
        <div class="vtt-panel-heading">
          <h3>Loja da Sessao</h3>
          <span>${paginated.totalItems} item(ns)</span>
        </div>
        <div class="vtt-shop-layout">
          <aside class="vtt-shop-filters">
            <input type="search" value="${escapeHtml(this.shopQuery)}" placeholder="Buscar item..." data-vtt-shop-query />
            <select data-vtt-shop-category>
              ${Object.entries(SHOP_CATEGORY_LABELS).map(([value, label]) => `
                <option value="${escapeHtml(value)}" ${this.shopCategory === value ? "selected" : ""}>${escapeHtml(label)}</option>
              `).join("")}
            </select>
            <select data-vtt-shop-tier>
              <option value="all">Todos os tiers</option>
              ${tiers.map((tier) => `<option value="${escapeHtml(tier)}" ${this.shopTier === tier ? "selected" : ""}>Tier ${escapeHtml(tier)}</option>`).join("")}
            </select>
            <select data-vtt-shop-sort>
              <option value="name" ${this.shopSort === "name" ? "selected" : ""}>Nome</option>
              <option value="price-asc" ${this.shopSort === "price-asc" ? "selected" : ""}>Preco menor</option>
              <option value="price-desc" ${this.shopSort === "price-desc" ? "selected" : ""}>Preco maior</option>
              <option value="tier" ${this.shopSort === "tier" ? "selected" : ""}>Tier</option>
              <option value="category" ${this.shopSort === "category" ? "selected" : ""}>Categoria</option>
            </select>
          </aside>
          <div class="vtt-shop-results">
            <div class="vtt-shop-grid">
              ${paginated.items.map((item) => this.renderShopCard(item)).join("") || "<small>Nenhum item encontrado.</small>"}
            </div>
            <nav class="vtt-shop-pages" aria-label="Paginas da loja">
              <button type="button" data-vtt-shop-page="${paginated.page - 1}" ${paginated.hasPrevious ? "" : "disabled"}>Anterior</button>
              <span>${paginated.page} / ${paginated.totalPages}</span>
              <button type="button" data-vtt-shop-page="${paginated.page + 1}" ${paginated.hasNext ? "" : "disabled"}>Proxima</button>
            </nav>
          </div>
          <aside class="vtt-shop-cart">
            <div>
              <strong>Carrinho</strong>
              <small>Saldo: ${balance.toLocaleString("pt-BR")} ℓ</small>
            </div>
            <label class="vtt-shop-destination">
              Destino
              <select data-vtt-shop-destination>
                ${["unassigned", "active", "backpack", "cube", "holster", "bandolier", "hook"].map((kind) => `
                  <option value="${escapeHtml(kind)}" ${this.purchaseDestination === kind ? "selected" : ""}>${escapeHtml(destinationLabel(kind))}</option>
                `).join("")}
              </select>
            </label>
            <div class="vtt-shop-cart-lines">
              ${this.shopCart.length ? this.shopCart.map((line) => `
                <article>
                  <span>${escapeHtml(line.item.name)} x${escapeHtml(line.quantity)}</span>
                  <strong>${cartLineTotal(line).toLocaleString("pt-BR")} ℓ</strong>
                  <button type="button" data-vtt-cart-remove="${escapeHtml(line.id)}">Remover</button>
                </article>
              `).join("") : "<small>Nenhum item selecionado.</small>"}
            </div>
            <footer>
              <span>Restante: ${(balance - cartTotal).toLocaleString("pt-BR")} ℓ</span>
              <strong>Total: ${cartTotal.toLocaleString("pt-BR")} ℓ</strong>
              <button type="button" data-vtt-shop-action="clear-cart" ${this.shopCart.length ? "" : "disabled"}>Limpar</button>
              <button type="button" data-vtt-shop-action="request-purchase" ${this.shopCart.length ? "" : "disabled"}>${this.client.isConnected && !isGm ? "Solicitar Compra" : "Comprar"}</button>
              ${isGm ? `<button type="button" data-vtt-shop-action="direct-purchase" ${this.shopCart.length ? "" : "disabled"}>Comprar como Mestre</button>` : ""}
            </footer>
            ${isGm ? this.renderMasterCarts(room) : ""}
          </aside>
        </div>
      </section>
    `;
  }

  renderShopCard(item) {
    const detail = [
      item.damage ? `Dano ${item.damage}` : "",
      item.attack ? `Ataque ${item.attack}` : "",
      item.range ? `Alcance ${item.range}` : "",
      item.ca ? `CA ${item.ca}` : "",
      item.capacity ? `Cap. ${item.capacity}` : "",
      item.weight ? `Peso ${item.weight}` : "",
    ].filter(Boolean).join(" - ");
    return `
      <article class="vtt-shop-card" data-vtt-shop-card="${escapeHtml(item.id)}">
        <div>
          <span>${escapeHtml(item.categoryLabel)}</span>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml([item.tier ? `Tier ${item.tier}` : "", item.type].filter(Boolean).join(" - "))}</small>
        </div>
        <p>${escapeHtml(detail || item.summary || "Item oficial da biblioteca Solaris.")}</p>
        <footer>
          <em>${escapeHtml(item.source || "Livro 5")}</em>
          <strong>${Number(item.price || 0).toLocaleString("pt-BR")} ℓ</strong>
          <button type="button" data-vtt-shop-details="${escapeHtml(item.id)}">Detalhes</button>
          <button type="button" data-vtt-shop-add="${escapeHtml(item.id)}">Adicionar</button>
          <button type="button" data-vtt-shop-buy-now="${escapeHtml(item.id)}">Comprar Agora</button>
        </footer>
      </article>
    `;
  }

  renderSessionShop(room, current) {
    const filtered = this.filteredShopCatalog();
    const catalog = this.shopCatalog();
    const tiers = [...new Set(catalog.map((item) => item.tier).filter(Boolean))].slice(0, 16);
    const paginated = paginateItems(filtered, this.shopPage, 20);
    const localPlayer = this.localPlayer(room);
    const isGm = localPlayer?.role === SESSION_ROLES.GM || localPlayer?.isGM;
    if (!isGm && this.shopMode === "master") this.shopMode = "session";
    const buyer = this.currentShopCharacter(room, current);
    const balance = Number(buyer.currency || buyer.luzentis || 0);
    const cartTotal = this.shopCart.reduce((sum, line) => sum + cartLineTotal(line), 0);
    const taxRate = Number(room.shopState?.taxRate || room.shopState?.policies?.transactionFeePercent || 0);
    const tax = Math.round(cartTotal * (taxRate / 100));
    const grandTotal = cartTotal + tax;
    const characters = Array.isArray(room.characters) ? room.characters : [];
    const modeNote = this.shopMode === "library"
      ? "Compra local na ficha, sem depender da sala."
      : this.shopMode === "master"
        ? "Mestre entrega, compra ou converte em loot."
        : "Compra de sessao pode exigir aprovacao do mestre.";
    const categoryCount = (value) => value === "all"
      ? catalog.length
      : catalog.filter((item) => value === "featured"
        ? (item.featured || SHOP_RARITY_RANK[item.rarity] >= 3 || item.price >= 500)
        : item.sessionCategory === value).length;
    return `
      <section class="vtt-panel vtt-shop-panel solaris-store-shell" aria-label="Loja Solaris">
        <aside class="solaris-store-sidebar">
          <div class="solaris-store-brand">
            <span>MERCADO</span>
            <strong>SOLARIS</strong>
          </div>
          <nav aria-label="Categorias da Loja Solaris">
            ${Object.entries(SHOP_CATEGORY_LABELS).map(([value, label]) => `
              <button type="button" class="solaris-store-category ${this.shopCategory === value ? "active" : ""}" data-vtt-shop-category-button="${escapeHtml(value)}">
                <span>${escapeHtml(label)}</span>
                <small>${escapeHtml(categoryCount(value))}</small>
              </button>
            `).join("")}
          </nav>
        </aside>
        <div class="solaris-store-main">
          <header class="solaris-store-topbar">
            <div>
              <h3>Loja Solaris</h3>
              <span>${escapeHtml(modeNote)}</span>
            </div>
            <label class="solaris-store-search">
              <span>Buscar</span>
              <input type="search" value="${escapeHtml(this.shopQuery)}" placeholder="Buscar item ou palavra-chave..." data-vtt-shop-query />
            </label>
            <label class="solaris-store-filter compact">
              <span>Modo</span>
              <select data-vtt-shop-mode>
                ${Object.entries(SHOP_MODE_LABELS).filter(([mode]) => isGm || mode !== "master").map(([mode, label]) => `
                  <option value="${escapeHtml(mode)}" ${this.shopMode === mode ? "selected" : ""}>${escapeHtml(label)}</option>
                `).join("")}
              </select>
            </label>
            <div class="solaris-store-balance">
              <small>Luzentis</small>
              <strong>${formatLuzentis(balance)}</strong>
            </div>
          </header>
          <div class="solaris-store-filters">
            <label class="solaris-store-filter">
              <span>Tier</span>
              <select data-vtt-shop-tier>
                <option value="all">Todos os tiers</option>
                ${tiers.map((tier) => `<option value="${escapeHtml(tier)}" ${this.shopTier === tier ? "selected" : ""}>Tier ${escapeHtml(tier)}</option>`).join("")}
              </select>
            </label>
            <label class="solaris-store-filter">
              <span>Raridade</span>
              <select data-vtt-shop-rarity>
                ${Object.entries(SHOP_RARITY_LABELS).map(([value, label]) => `<option value="${escapeHtml(value)}" ${this.shopRarity === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
              </select>
            </label>
            <label class="solaris-store-filter">
              <span>Preco min.</span>
              <input type="number" min="0" value="${escapeHtml(this.shopMinPrice)}" data-vtt-shop-min-price />
            </label>
            <label class="solaris-store-filter">
              <span>Preco max.</span>
              <input type="number" min="0" value="${escapeHtml(this.shopMaxPrice)}" data-vtt-shop-max-price />
            </label>
            <label class="solaris-store-filter">
              <span>Ordenar</span>
              <select data-vtt-shop-sort>
                <option value="name" ${this.shopSort === "name" ? "selected" : ""}>Nome A-Z</option>
                <option value="price-asc" ${this.shopSort === "price-asc" ? "selected" : ""}>Preco menor</option>
                <option value="price-desc" ${this.shopSort === "price-desc" ? "selected" : ""}>Preco maior</option>
                <option value="tier" ${this.shopSort === "tier" ? "selected" : ""}>Tier</option>
                <option value="rarity" ${this.shopSort === "rarity" ? "selected" : ""}>Raridade</option>
                <option value="category" ${this.shopSort === "category" ? "selected" : ""}>Categoria</option>
              </select>
            </label>
            <label class="solaris-store-check">
              <input type="checkbox" ${this.shopOnlyInStock ? "checked" : ""} data-vtt-shop-in-stock />
              <span>Em estoque</span>
            </label>
            <label class="solaris-store-filter">
              <span>Compat.</span>
              <select data-vtt-shop-compatibility>
                <option value="all" ${this.shopCompatibility === "all" ? "selected" : ""}>Todos</option>
                <option value="compatible" ${this.shopCompatibility === "compatible" ? "selected" : ""}>Compativeis</option>
                <option value="warning" ${this.shopCompatibility === "warning" ? "selected" : ""}>Com alerta</option>
                <option value="buyable" ${this.shopCompatibility === "buyable" ? "selected" : ""}>Compraveis</option>
              </select>
            </label>
          </div>
          <div class="solaris-store-content">
            <div class="solaris-store-results">
              <div class="solaris-store-result-heading">
                <span>${paginated.totalItems} item(ns) encontrados</span>
                <small>Pagina ${paginated.page} de ${paginated.totalPages}</small>
              </div>
              <div class="solaris-store-grid">
                ${paginated.items.map((item) => this.renderShopCard(item, buyer)).join("") || `
                  <div class="solaris-store-empty">
                    <strong>Nenhum item encontrado.</strong>
                    <span>Ajuste busca, filtros ou categoria.</span>
                  </div>
                `}
              </div>
              <nav class="vtt-shop-pages solaris-store-pages" aria-label="Paginas da loja">
                <button type="button" data-vtt-shop-page="${paginated.page - 1}" ${paginated.hasPrevious ? "" : "disabled"}>Anterior</button>
                <span>${paginated.page} / ${paginated.totalPages}</span>
                <button type="button" data-vtt-shop-page="${paginated.page + 1}" ${paginated.hasNext ? "" : "disabled"}>Proxima</button>
              </nav>
            </div>
            <aside class="solaris-store-cart">
              <div class="solaris-store-cart-head">
                <div>
                  <strong>Carrinho</strong>
                  <small>${escapeHtml(SHOP_MODE_LABELS[this.shopMode] || this.shopMode)} - ${escapeHtml(buyer.name || "Personagem")}</small>
                </div>
                <span>${this.shopCart.length}/10</span>
              </div>
              ${isGm && characters.length ? `
                <label class="solaris-store-filter">
                  <span>Personagem</span>
                  <select data-vtt-shop-target-character>
                    ${characters.map((character) => `<option value="${escapeHtml(character.id)}" ${(this.shopTargetCharacterId || buyer.id) === character.id ? "selected" : ""}>${escapeHtml(character.name || character.id)}</option>`).join("")}
                  </select>
                </label>
              ` : ""}
              <div class="solaris-store-cart-lines">
                ${this.shopCart.length ? this.shopCart.map((line) => {
                  const destinations = this.availableShopDestinations(buyer, line.item);
                  const selectedDestination = encodeDestination(line.destination || this.defaultDestinationForItem(line.item));
                  return `
                    <article class="solaris-store-cart-item">
                      <div>
                        <strong>${escapeHtml(line.item.name)}</strong>
                        <small>${escapeHtml(line.item.categoryLabel || line.item.type)} - ${formatLuzentis(line.price)}</small>
                      </div>
                      <label>
                        <span>Qtd.</span>
                        <input type="number" min="1" max="99" value="${escapeHtml(line.quantity)}" data-vtt-cart-qty="${escapeHtml(line.id)}" />
                      </label>
                      <label>
                        <span>Destino</span>
                        <select data-vtt-cart-destination="${escapeHtml(line.id)}">
                          ${destinations.map((destination) => {
                            const value = encodeDestination(destination);
                            return `<option value="${escapeHtml(value)}" ${selectedDestination === value ? "selected" : ""}>${escapeHtml(destination.label)}</option>`;
                          }).join("")}
                        </select>
                      </label>
                      <footer>
                        <span>${formatLuzentis(cartLineTotal(line))}</span>
                        <button type="button" data-vtt-cart-remove="${escapeHtml(line.id)}">Remover</button>
                      </footer>
                    </article>
                  `;
                }).join("") : `
                  <div class="solaris-store-empty small">
                    <strong>Carrinho vazio</strong>
                    <span>Adicione itens para comprar ou enviar ao mestre.</span>
                  </div>
                `}
              </div>
              <div class="solaris-store-total">
                <span><small>Subtotal</small><strong>${formatLuzentis(cartTotal)}</strong></span>
                <span><small>Taxa</small><strong>${formatLuzentis(tax)}</strong></span>
                <span><small>Total</small><strong>${formatLuzentis(grandTotal)}</strong></span>
                <span><small>Restante</small><strong class="${balance - grandTotal < 0 ? "danger" : ""}">${formatLuzentis(balance - grandTotal)}</strong></span>
              </div>
              <div class="solaris-store-alert ${balance - grandTotal < 0 ? "danger" : ""}">
                ${balance - grandTotal < 0 ? "Luzentis insuficientes." : "Destino sem local definido continua apenas como aviso visual."}
              </div>
              <footer class="solaris-store-actionbar">
                <button type="button" data-vtt-shop-action="clear-cart" ${this.shopCart.length ? "" : "disabled"}>Limpar</button>
                <button type="button" data-vtt-shop-action="request-purchase" ${this.shopCart.length ? "" : "disabled"}>${this.client.isConnected && !isGm && this.shopMode !== "library" ? "Solicitar compra" : "Comprar"}</button>
                ${isGm ? `<button type="button" data-vtt-shop-action="direct-purchase" ${this.shopCart.length ? "" : "disabled"}>Compra mestre</button>` : ""}
                ${isGm ? `<button type="button" data-vtt-shop-action="cart-to-loot" ${this.shopCart.length ? "" : "disabled"}>Virar loot</button>` : ""}
              </footer>
              ${isGm ? this.renderMasterCarts(room) : ""}
            </aside>
          </div>
        </div>
      </section>
    `;
  }

  renderShopCard(item, current = this.currentSheetSnapshot()) {
    const compatibility = this.shopItemCompatibility(item, current);
    const hasMoney = Number(current.currency || current.luzentis || 0) >= Number(item.price || 0);
    const detail = [
      item.damage ? `Dano ${item.damage}` : "",
      item.attack ? `Ataque ${item.attack}` : "",
      item.range ? `Alcance ${item.range}` : "",
      item.ca ? `CA ${item.ca}` : "",
      item.capacity ? `Cap. ${item.capacity}` : "",
      item.weight ? `Peso ${item.weight}` : "",
    ].filter(Boolean).join(" - ");
    const badges = [
      item.source ? "Oficial Livro 5" : "",
      item.requiresApproval || this.shopMode === "session" ? "Requer aprovacao" : "",
      compatibility.label,
      item.stock !== "" ? "Em estoque" : "",
      item.consumable || item.sessionCategory === "consumable" ? "Consumivel" : "",
      item.sessionCategory === "weapon" ? "Arma" : "",
      item.sessionCategory === "armor" ? "Armadura" : "",
      item.sessionCategory === "cube" ? "Cubo" : "",
      !hasMoney ? "Luzentis insuficientes" : "",
    ].filter(Boolean).slice(0, 5);
    return `
      <article class="vtt-shop-card solaris-store-card rarity-${escapeHtml(item.rarity || "comum")} ${hasMoney ? "" : "locked"}" data-vtt-shop-card="${escapeHtml(item.id)}">
        <header>
          <span class="solaris-store-card-rarity">${escapeHtml(item.rarityLabel || "Comum")}</span>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml([item.tier ? `Tier ${item.tier}` : "", item.categoryLabel, item.type].filter(Boolean).join(" - "))}</small>
        </header>
        <div class="solaris-store-card-media">
          ${item.image || item.imageDataUrl ? `<img src="${escapeHtml(item.image || item.imageDataUrl)}" alt="" />` : `<span>${escapeHtml(tokenInitial(item))}</span>`}
        </div>
        <p>${escapeHtml(detail || item.summary || "Item oficial da biblioteca Solaris.")}</p>
        <div class="solaris-store-badges">
          ${badges.map((badge) => `<span class="solaris-store-badge">${escapeHtml(badge)}</span>`).join("")}
        </div>
        <footer>
          <em>${escapeHtml(item.source || "Livro 5")}</em>
          <strong>${formatLuzentis(item.price || 0)}</strong>
          <button type="button" data-vtt-shop-details="${escapeHtml(item.id)}">Detalhes</button>
          <button type="button" data-vtt-shop-compare="${escapeHtml(item.id)}">Comparar</button>
          <button type="button" data-vtt-shop-add="${escapeHtml(item.id)}">Adicionar</button>
        </footer>
      </article>
    `;
  }

  renderMasterCarts(room) {
    const carts = Object.entries(room.shopState?.carts || {});
    if (!carts.length) {
      return `<div class="vtt-master-carts"><strong>Carrinhos da mesa</strong><small>Nenhum carrinho pendente.</small></div>`;
    }
    return `
      <div class="vtt-master-carts">
        <strong>Carrinhos da mesa</strong>
        ${carts.slice(0, 5).map(([playerId, cart]) => {
          const player = (room.players || []).find((entry) => entry.id === playerId);
          const total = (cart.items || []).reduce((sum, line) => sum + cartLineTotal(line), 0);
          return `<small>${escapeHtml(player?.name || playerId)}: ${escapeHtml(cart.items?.length || 0)} item(ns), ${total.toLocaleString("pt-BR")} ℓ</small>`;
        }).join("")}
      </div>
    `;
  }

  renderMasterCarts(room) {
    const carts = Object.entries(room.shopState?.carts || {});
    const approvals = (room.approvals || []).filter((approval) => approval.status === "pending" && approval.type === "purchase-cart");
    return `
      <div class="vtt-master-carts solaris-store-master-carts">
        <strong>Carrinhos da mesa</strong>
        ${carts.length ? carts.slice(0, 5).map(([playerId, cart]) => {
          const player = (room.players || []).find((entry) => entry.id === playerId);
          const total = (cart.items || []).reduce((sum, line) => sum + cartLineTotal(line), 0);
          return `<small>${escapeHtml(player?.name || playerId)}: ${escapeHtml(cart.items?.length || 0)} item(ns), ${formatLuzentis(total)}</small>`;
        }).join("") : "<small>Nenhum carrinho enviado em tempo real.</small>"}
        <strong>Pedidos pendentes</strong>
        ${approvals.length ? approvals.slice(0, 4).map((approval) => {
          const requester = (room.players || []).find((entry) => entry.id === approval.requestedBy);
          const lines = Array.isArray(approval.payload?.items) ? approval.payload.items : [];
          return `
            <article>
              <div>
                <span>${escapeHtml(requester?.name || "Jogador")}</span>
                <small>${escapeHtml(approval.message || "Pedido de compra")}</small>
              </div>
              ${lines.slice(0, 4).map((line) => `
                <div class="solaris-store-master-line">
                  <small>${escapeHtml(line.item?.name || line.itemId || "Item")} - ${formatLuzentis(cartLineTotal(line))} - ${escapeHtml(line.status || "pending")}</small>
                  ${line.status === "approved" || line.status === "rejected" ? "" : `
                    <span>
                      <button type="button" data-vtt-approval-approve-line="${escapeHtml(approval.id)}" data-line-id="${escapeHtml(line.id)}">Aprovar item</button>
                      <button type="button" data-vtt-approval-reject-line="${escapeHtml(approval.id)}" data-line-id="${escapeHtml(line.id)}">Rejeitar</button>
                    </span>
                  `}
                </div>
              `).join("")}
              <footer>
                <button type="button" data-vtt-approval-approve="${escapeHtml(approval.id)}">Aprovar carrinho</button>
                <button type="button" data-vtt-approval-reject="${escapeHtml(approval.id)}">Rejeitar carrinho</button>
              </footer>
            </article>
          `;
        }).join("") : "<small>Nenhuma compra aguardando aprovacao.</small>"}
      </div>
    `;
  }

  renderLootPanel(room) {
    const packs = room.lootPacks || [];
    const transactions = room.transactionLog || [];
    const localPlayer = this.localPlayer(room);
    const isGm = localPlayer?.role === SESSION_ROLES.GM || localPlayer?.isGM;
    return `
      <section class="vtt-panel vtt-loot-panel">
        <div class="vtt-panel-heading">
          <h3>Distribuicao de Loot</h3>
          <span>${packs.length} pacote(s)</span>
        </div>
        <div class="vtt-loot-actions">
          <button type="button" data-vtt-loot-action="create" ${isGm || !this.client.isConnected ? "" : "disabled"}>Criar loot</button>
        </div>
        <div class="vtt-loot-list">
          ${packs.slice(0, 5).map((pack) => `
            <article>
              <div>
                <strong>${escapeHtml(pack.name)}</strong>
                <small>${escapeHtml(pack.status)} - ${escapeHtml(pack.items?.length || 0)} item(ns) - ${Number(pack.luzentis || 0).toLocaleString("pt-BR")} ℓ</small>
              </div>
              <button type="button" data-vtt-loot-distribute="${escapeHtml(pack.id)}" ${isGm ? "" : "disabled"}>Distribuir</button>
            </article>
          `).join("") || "<small>Nenhum loot pendente.</small>"}
        </div>
        <div class="vtt-transaction-log">
          <strong>Transacoes</strong>
          ${transactions.slice(0, 5).map((entry) => `<small>${escapeHtml(entry.message || entry.type)}</small>`).join("") || "<small>Sem transacoes ainda.</small>"}
        </div>
      </section>
    `;
  }

  renderItemDetailModal() {
    const item = this.selectedShopItemId ? this.shopCatalog().find((entry) => entry.id === this.selectedShopItemId) : null;
    if (!item) return "";
    const rows = [
      ["Tipo", item.type || item.categoryLabel],
      ["Categoria", item.categoryLabel],
      ["Tier", item.tier || "-"],
      ["Preco", `${Number(item.price || 0).toLocaleString("pt-BR")} Lz`],
      ["Peso", item.weight || item.peso || "-"],
      ["Fonte", item.source || "Livro 5"],
      ["Dano", item.damage || item.dano || ""],
      ["Alcance", item.range || item.alcance || ""],
      ["CA", item.ca || item.CA || ""],
      ["Slots", item.slots || item.modSlots || ""],
      ["Capacidade", item.capacity || item.capacidade || ""],
      ["Custo", item.cost || item.custo || ""],
      ["Acao", item.action || item.acao || ""],
      ["Duracao", item.duration || item.duracao || ""],
    ].filter(([, value]) => value !== undefined && value !== null && value !== "");
    const description = item.description || item.summary || item.effect || item.effects || "Item oficial da biblioteca Solaris. Use os campos acima como referencia rapida de mesa.";
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="item">
        <section class="vtt-modal vtt-item-detail-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>${escapeHtml(item.categoryLabel)}</span>
              <h3>${escapeHtml(item.name)}</h3>
            </div>
            <button type="button" data-vtt-modal-close="item">Fechar</button>
          </header>
          <div class="vtt-item-detail-body">
            <div class="vtt-item-detail-icon">${item.image || item.imageDataUrl ? `<img src="${escapeHtml(item.image || item.imageDataUrl)}" alt="" />` : `<span>${escapeHtml(tokenInitial(item))}</span>`}</div>
            <dl>
              ${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
            </dl>
            <p>${escapeHtml(description)}</p>
            ${item.requirements ? `<p><strong>Requisitos:</strong> ${escapeHtml(item.requirements)}</p>` : ""}
            ${item.tags?.length ? `<p><strong>Tags:</strong> ${item.tags.map(escapeHtml).join(", ")}</p>` : ""}
          </div>
          <footer>
            <button type="button" data-vtt-shop-add="${escapeHtml(item.id)}">Adicionar ao Carrinho</button>
            <button type="button" data-vtt-shop-buy-now="${escapeHtml(item.id)}">Comprar Agora</button>
            <button type="button" data-vtt-modal-close="item">Fechar</button>
          </footer>
        </section>
      </div>
    `;
  }

  renderItemDetailModal() {
    const item = this.selectedShopItemId ? this.shopCatalog().find((entry) => entry.id === this.selectedShopItemId) : null;
    if (!item) return "";
    const room = this.client.isConnected && this.client.room ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter()) : this.room;
    const current = this.currentShopCharacter(room, this.currentSheetSnapshot());
    const compatibility = this.shopItemCompatibility(item, current);
    const hasMoney = Number(current.currency || current.luzentis || 0) >= Number(item.price || 0);
    const rows = [
      ["Categoria", item.categoryLabel],
      ["Tipo", item.type || item.categoryLabel],
      ["Tier", item.tier || "-"],
      ["Raridade", item.rarityLabel || "Comum"],
      ["Preco", formatLuzentis(item.price || 0)],
      ["Estoque", item.stock === "" ? "Indefinido" : item.stock],
      ["Peso", item.weight || item.peso || "-"],
      ["Fonte", item.source || "Livro 5"],
      ["Dano", item.damage || item.dano || ""],
      ["Alcance", item.range || item.alcance || ""],
      ["CA", item.ca || item.CA || ""],
      ["Slots", item.slots || item.modSlots || ""],
      ["Capacidade", item.capacity || item.capacidade || ""],
      ["Custo", item.cost || item.custo || ""],
      ["Acao", item.action || item.acao || ""],
      ["Duracao", item.duration || item.duracao || ""],
    ].filter(([, value]) => value !== undefined && value !== null && value !== "");
    const description = item.description || item.summary || item.effect || item.effects || "Item oficial da biblioteca Solaris. Use os campos acima como referencia rapida de mesa.";
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="item">
        <section class="vtt-modal vtt-item-detail-modal solaris-store-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>${escapeHtml(item.categoryLabel)} / ${escapeHtml(item.rarityLabel || "Comum")}</span>
              <h3>${escapeHtml(item.name)}</h3>
            </div>
            <button type="button" data-vtt-modal-close="item">Fechar</button>
          </header>
          <div class="vtt-item-detail-body solaris-store-detail-body">
            <div class="vtt-item-detail-icon">${item.image || item.imageDataUrl ? `<img src="${escapeHtml(item.image || item.imageDataUrl)}" alt="" />` : `<span>${escapeHtml(tokenInitial(item))}</span>`}</div>
            <dl>
              ${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
            </dl>
            <section>
              <h4>Descricao e uso em mesa</h4>
              <p>${escapeHtml(description)}</p>
              ${item.requirements ? `<p><strong>Requisitos:</strong> ${escapeHtml(item.requirements)}</p>` : ""}
              <p><strong>Compatibilidade:</strong> ${escapeHtml(compatibility.label)}.</p>
              <p><strong>Politica da sessao:</strong> ${this.shopMode === "session" ? "Pode exigir aprovacao do mestre." : this.shopMode === "master" ? "Mestre pode entregar sem custo ou converter em loot." : "Compra local imediata."}</p>
              ${hasMoney ? "" : `<p class="solaris-store-alert danger">Luzentis insuficientes para ${escapeHtml(current.name || "personagem")}.</p>`}
              ${item.tags?.length ? `<p><strong>Tags:</strong> ${item.tags.map(escapeHtml).join(", ")}</p>` : ""}
            </section>
          </div>
          <footer>
            <button type="button" data-vtt-shop-add="${escapeHtml(item.id)}">Adicionar ao Carrinho</button>
            <button type="button" data-vtt-shop-buy-now="${escapeHtml(item.id)}">${this.client.isConnected && this.shopMode === "session" ? "Solicitar Compra" : "Comprar Agora"}</button>
            <button type="button" data-vtt-shop-compare="${escapeHtml(item.id)}">Comparar</button>
            <button type="button" data-vtt-shop-send-chat="${escapeHtml(item.id)}">Enviar ao Chat</button>
            <button type="button" data-vtt-modal-close="item">Fechar</button>
          </footer>
        </section>
      </div>
    `;
  }

  renderLootModal(room) {
    if (!this.lootModalOpen) return "";
    const pack = this.editingLootPackId ? (room.lootPacks || []).find((entry) => entry.id === this.editingLootPackId) : null;
    const characters = room.characters || [];
    const catalog = this.shopCatalog().slice(0, 160);
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="loot">
        <section class="vtt-modal vtt-loot-modal solaris-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>Distribuicao de Loot</span>
              <h3>${pack ? escapeHtml(pack.name) : "Novo pacote de loot"}</h3>
            </div>
            <button type="button" data-vtt-modal-close="loot">Fechar</button>
          </header>
          <form data-vtt-loot-form>
            <label>Nome do pacote<input name="name" value="${escapeHtml(pack?.name || "Loot da cena")}" /></label>
            <label>Luzentis<input name="luzentis" type="number" min="0" value="${escapeHtml(pack?.luzentis || 0)}" /></label>
            <label>Item oficial
              <select name="itemId">
                <option value="">Nenhum</option>
                ${catalog.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("")}
              </select>
            </label>
            <label>Item manual<input name="manualItem" placeholder="Nome do item criado na hora" /></label>
            <label>Quantidade<input name="quantity" type="number" min="1" value="1" /></label>
            <label>Destino
              <select name="destination">
                ${["unassigned", "active", "backpack", "cube", "holster", "bandolier", "hook"].map((kind) => `<option value="${escapeHtml(kind)}">${escapeHtml(destinationLabel(kind))}</option>`).join("")}
              </select>
            </label>
            <label>Personagem destino
              <select name="characterId">
                ${characters.map((character) => `<option value="${escapeHtml(character.id)}">${escapeHtml(character.name || character.snapshot?.name || character.id)}</option>`).join("")}
                <option value="${escapeHtml(this.currentSheetId())}">Ficha atual</option>
              </select>
            </label>
            <label>Notas<textarea name="notes">${escapeHtml(pack?.notes || "")}</textarea></label>
            <footer>
              <button type="submit">${pack ? "Entregar loot" : "Criar pacote"}</button>
              <button type="button" data-vtt-modal-close="loot">Cancelar</button>
            </footer>
          </form>
        </section>
      </div>
    `;
  }

  renderMonsterSheetModal(room) {
    const monster = this.selectedMonsterSheetId ? (room.monsters || []).find((entry) => entry.id === this.selectedMonsterSheetId) : null;
    if (!monster) return "";
    const snapshot = monster.snapshot || {};
    const attacks = Array.isArray(snapshot.attacks) ? snapshot.attacks : [];
    const abilities = Array.isArray(snapshot.abilities) ? snapshot.abilities : [];
    const defenses = snapshot.resistanceProfile || {};
    const resources = snapshot.lootProfile?.resources || snapshot.resourcesStructured || [];
    const normalization = snapshot.needsReview ? `Revisar: ${snapshot.reviewReason || "dados oficiais pendentes"}` : "Ficha normalizada";
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="monster">
        <section class="vtt-modal vtt-monster-sheet-modal solaris-modal-large" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>${escapeHtml([snapshot.tier ? `Tier ${snapshot.tier}` : "", snapshot.role || snapshot.type || ""].filter(Boolean).join(" - "))}</span>
              <h3>${escapeHtml(monster.name)}</h3>
            </div>
            <button type="button" data-vtt-modal-close="monster">Fechar</button>
          </header>
          <div class="vtt-monster-sheet-grid">
            <figure>${snapshot.imageDataUrl || snapshot.image ? `<img src="${escapeHtml(snapshot.imageDataUrl || snapshot.image)}" alt="" />` : `<span>${escapeHtml(tokenInitial(monster))}</span>`}</figure>
            <dl>
              <div><dt>PV</dt><dd>${escapeHtml(snapshot.currentPV ?? snapshot.pvAtual ?? 0)} / ${escapeHtml(snapshot.maxPV ?? snapshot.pv ?? 0)}</dd></div>
              <div><dt>CA</dt><dd>${escapeHtml(snapshot.ca ?? snapshot.CA ?? "-")}</dd></div>
              <div><dt>Movimento</dt><dd>${escapeHtml(snapshot.movement ?? snapshot.movimento ?? "-")}m</dd></div>
              <div><dt>Iniciativa</dt><dd>${escapeHtml(snapshot.initiative ?? snapshot.iniciativa ?? "-")}</dd></div>
              <div><dt>Sentidos</dt><dd>${escapeHtml(snapshot.senses ?? snapshot.sentidos ?? "-")}</dd></div>
              <div><dt>Habitat</dt><dd>${escapeHtml(snapshot.habitat ?? "-")}</dd></div>
              <div><dt>Status</dt><dd>${escapeHtml(normalization)}</dd></div>
            </dl>
          </div>
          <section>
            <h4>Ataques</h4>
            ${attacks.length ? attacks.map((attack, index) => `
              <article class="vtt-monster-attack-row">
                <div><strong>${escapeHtml(attack.name || `Ataque ${index + 1}`)}</strong><small>${escapeHtml([attack.attack ? `Ataque ${attack.attack}` : "", attack.damage || attack.dano ? `Dano ${attack.damage || attack.dano}` : "", attack.range || attack.alcance || ""].filter(Boolean).join(" - "))}</small></div>
                <button type="button" data-vtt-monster-attack="${escapeHtml(monster.id)}" data-attack-index="${index}">Atacar</button>
                <button type="button" data-vtt-monster-attack-target="${escapeHtml(monster.id)}" data-attack-index="${index}">Atacar Alvo</button>
                <button type="button" data-vtt-monster-damage="${escapeHtml(monster.id)}" data-attack-index="${index}">Rolar Dano</button>
                <button type="button" data-vtt-monster-damage-target="${escapeHtml(monster.id)}" data-attack-index="${index}">Dano no Alvo</button>
              </article>
            `).join("") : "<small>Sem ataques estruturados.</small>"}
          </section>
          <section>
            <h4>Habilidades e notas</h4>
            ${abilities.length ? abilities.map((ability) => `<p><strong>${escapeHtml(ability.name || "Habilidade")}:</strong> ${escapeHtml(ability.description || ability.effect || "")}</p>`).join("") : "<small>Sem habilidades estruturadas.</small>"}
            ${monster.notes || snapshot.notes ? `<p>${escapeHtml(monster.notes || snapshot.notes)}</p>` : ""}
          </section>
          <section>
            <h4>Defesas, moral e recursos</h4>
            <p><strong>Resistencias:</strong> ${escapeHtml((defenses.resistances || snapshot.resistances || []).join?.(", ") || "-")}</p>
            <p><strong>Fraquezas:</strong> ${escapeHtml((defenses.vulnerabilities || snapshot.vulnerabilities || []).join?.(", ") || snapshot.weaknesses || "-")}</p>
            <p><strong>Imunidades:</strong> ${escapeHtml((defenses.immunities || snapshot.immunities || []).join?.(", ") || "-")}</p>
            <p><strong>Moral:</strong> ${escapeHtml(snapshot.moraleProfile?.text || snapshot.moral || "-")}</p>
            <p><strong>Recursos:</strong> ${escapeHtml(resources.length ? resources.map((resource) => resource.name).join(", ") : (snapshot.resources || "-"))}</p>
          </section>
          <footer>
            <button type="button" data-vtt-monster-loot="${escapeHtml(monster.id)}">Criar Loot</button>
            <button type="button" data-vtt-damage-combatant="${escapeHtml(monster.id)}">Aplicar Dano</button>
            <button type="button" data-vtt-heal-combatant="${escapeHtml(monster.id)}">Curar</button>
            <button type="button" data-vtt-condition-combatant="${escapeHtml(monster.id)}">Aplicar Condicao</button>
            <button type="button" class="danger" data-vtt-delete-monster="${escapeHtml(monster.id)}">Remover da Cena</button>
          </footer>
        </section>
      </div>
    `;
  }

  renderRecoveryNotice() {
    if (!this.recoveryNotice) return "";
    return `
      <div class="vtt-modal-backdrop vtt-recovery-backdrop">
        <section class="vtt-modal vtt-recovery-modal solaris-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>recuperacao</span>
              <h3>Sessao recente encontrada</h3>
            </div>
          </header>
          <p>Encontramos uma sessao recente nao encerrada: <strong>${escapeHtml(this.recoveryNotice.label)}</strong>.</p>
          <small>${escapeHtml(new Date(this.recoveryNotice.createdAt).toLocaleString("pt-BR"))}</small>
          <footer>
            <button type="button" data-vtt-action="continue-recovery">Continuar Sessao</button>
            <button type="button" data-vtt-action="open-campaigns">Abrir Campanhas</button>
            <button type="button" data-vtt-action="ignore-recovery">Ignorar</button>
          </footer>
        </section>
      </div>
    `;
  }

  activeRoomSnapshot() {
    return this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
  }

  isLocalGm(room = this.activeRoomSnapshot()) {
    if (!this.client.isConnected) return true;
    const player = (room.players || []).find((entry) => entry.id === this.client.playerId);
    return Boolean(player?.isGM || player?.role === SESSION_ROLES.GM);
  }

  roomFromSnapshot(room = this.activeRoomSnapshot()) {
    return new GameRoom({
      id: room.roomId || room.id || "offline-colonia-solaris-7",
      name: room.roomName || room.name || "Colonia Solaris-7",
      system: room.system || "Guerra Solar / Solaris",
      hostPlayerId: room.hostPlayerId || room.hostId || (room.players || []).find((entry) => entry.isGM || entry.role === SESSION_ROLES.GM)?.id || "local-player",
      players: (room.players || []).map((player) => ({
        ...player,
        role: player.role || (player.isGM ? SESSION_ROLES.GM : SESSION_ROLES.PLAYER),
      })),
      characters: room.characters || [],
      monsters: room.monsters || [],
      scene: room.scene || {},
      combat: room.combat || {},
      chat: room.chatMessages || [],
      diceLog: room.diceRolls || [],
      approvals: room.approvals || [],
      shopState: room.shopState || {},
      lootPacks: room.lootPacks || [],
      transactionLog: room.transactionLog || [],
      gmNotes: room.gmNotes || [],
      revealedNotes: room.revealedNotes || [],
      gmCounters: room.gmCounters || [],
      environmentalEffects: room.environmentalEffects || [],
      preparedEncounters: room.preparedEncounters || [],
      sessionReports: room.sessionReports || room.gmDashboard?.sessionReports || [],
      sceneList: room.sceneList || [room.scene || {}],
      activeSceneId: room.activeSceneId || room.scene?.id || "",
      gmDashboardSettings: room.gmDashboardSettings || room.gmDashboard?.settings || {},
      gmState: room.gmState || room.gmDashboard?.gmState || {},
      gmSchemaVersion: room.gmSchemaVersion || room.gmState?.gmSchemaVersion || 1,
      activeMissionId: room.activeMissionId || room.gmState?.activeMissionId || "",
      missions: room.missions || room.gmState?.missions || [],
      travelRoutes: room.travelRoutes || room.gmState?.travelRoutes || [],
      resourceTracks: room.resourceTracks || room.gmState?.resourceTracks || [],
      factionStates: room.factionStates || room.gmState?.factionStates || [],
      reputationLog: room.reputationLog || room.gmState?.reputationLog || [],
      campaignClocks: room.campaignClocks || room.gmState?.campaignClocks || [],
      gmEvents: room.gmEvents || room.gmState?.gmEvents || [],
      rewards: room.rewards || room.gmState?.rewards || [],
      consequences: room.consequences || room.gmState?.consequences || [],
      hackingChallenges: room.hackingChallenges || room.gmState?.hackingChallenges || [],
      bases: room.bases || room.gmState?.bases || [],
      loreSchemaVersion: room.loreSchemaVersion || room.gmDashboard?.loreSchemaVersion,
      loreState: room.loreState || room.gmDashboard?.loreState || {},
      pinnedLoreEntries: room.pinnedLoreEntries || room.gmDashboard?.pinnedLoreEntries || [],
      discoveredLoreEntries: room.discoveredLoreEntries || room.gmDashboard?.discoveredLoreEntries || [],
      secretLoreEntries: room.secretLoreEntries || room.gmDashboard?.secretLoreEntries || [],
      loreNotes: room.loreNotes || room.gmDashboard?.loreNotes || [],
      loreRelations: room.loreRelations || room.gmDashboard?.loreRelations || [],
      reportLoreEntries: room.reportLoreEntries || room.gmDashboard?.reportLoreEntries || [],
      missionLoreLinks: room.missionLoreLinks || room.gmDashboard?.missionLoreLinks || [],
      factionLoreLinks: room.factionLoreLinks || room.gmDashboard?.factionLoreLinks || [],
      locationLoreLinks: room.locationLoreLinks || room.gmDashboard?.locationLoreLinks || [],
      npcLoreLinks: room.npcLoreLinks || room.gmDashboard?.npcLoreLinks || [],
      monsterLoreLinks: room.monsterLoreLinks || room.gmDashboard?.monsterLoreLinks || [],
      itemLoreLinks: room.itemLoreLinks || room.gmDashboard?.itemLoreLinks || [],
      events: room.events || [],
      sequence: room.sequence || 0,
    });
  }

  applyOfflineRoom(gameRoom) {
    const data = gameRoom.toJSON();
    this.room = normalizeServerRoom({
      ...data,
      roomId: data.id,
      roomName: data.name,
      hostId: data.hostPlayerId,
      chatMessages: data.chat,
      diceRolls: data.diceLog,
    }, this.options.getCurrentCharacter());
    this.markRecoverableSession("Estado recente do mestre", this.buildSessionState("Estado recente do mestre"));
    this.render();
  }

  dispatchGmEvent(type, payload = {}) {
    if (this.client.isConnected) return this.client.send(type, payload);
    const gameRoom = this.roomFromSnapshot();
    const actor = gameRoom.players.find((player) => player.isGM) || gameRoom.players[0];
    gameRoom.dispatch(type, payload, actor?.id || "");
    this.applyOfflineRoom(gameRoom);
    return true;
  }

  promptGmValue(message, fallback = "") {
    if (typeof window === "undefined" || typeof window.prompt !== "function") return fallback;
    const value = window.prompt(message, fallback);
    if (value === null) return null;
    return String(value).trim() || fallback;
  }

  generateGmMission() {
    const riskLevel = this.promptGmValue("Risco da missao (simples, perigosa, muito-perigosa, alta-ameaca, critica-ou-rara)", "perigosa");
    if (riskLevel === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: generateMissionSeed({ riskLevel }) });
  }

  createGmMission() {
    const name = this.promptGmValue("Nome da missao", "Missao Solaris");
    if (name === null) return;
    const objective = this.promptGmValue("Objetivo principal", "Investigar a ameaca");
    if (objective === null) return;
    const riskLevel = this.promptGmValue("Risco", "perigosa");
    if (riskLevel === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_MISSION_CREATE, { mission: { name, objective, riskLevel, briefing: objective, visibleToPlayers: false } });
  }

  createGmTravelRoute() {
    const name = this.promptGmValue("Nome da rota", "Rota Solaris");
    if (name === null) return;
    const origin = this.promptGmValue("Origem", "Colonia");
    if (origin === null) return;
    const destination = this.promptGmValue("Destino", "Ruinas");
    if (destination === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_TRAVEL_ROUTE_CREATE, { route: { name, origin, destination, terrain: "dificil", pace: "normal", resourcesRequired: ["agua", "suprimentos"] } });
  }

  createGmResource() {
    const name = this.promptGmValue("Nome do recurso", "Suprimentos");
    if (name === null) return;
    const max = Number(this.promptGmValue("Maximo", "6") || 6);
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_RESOURCE_CREATE, { resource: { name, max, current: max, type: "supplies", unit: "carga(s)" } });
  }

  createGmFaction() {
    const name = this.promptGmValue("Nome da faccao", "Faccao Solaris");
    if (name === null) return;
    const goal = this.promptGmValue("Objetivo da faccao", "Expandir influencia");
    if (goal === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_FACTION_CREATE, { faction: { name, goal, reputation: 0, visibleToPlayers: false } });
  }

  createGmClock() {
    const name = this.promptGmValue("Nome do contador", "Alerta da ameaca");
    if (name === null) return;
    const max = Number(this.promptGmValue("Tamanho do contador", "6") || 6);
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_CLOCK_CREATE, { clock: { name, max, current: max, direction: "down", type: "threat" } });
  }

  createGmHacking() {
    const name = this.promptGmValue("Nome da rede", "Sistema bloqueado");
    if (name === null) return;
    const sr = Number(this.promptGmValue("SR", "12") || 12);
    const nodes = Number(this.promptGmValue("Nos", "3") || 3);
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_HACKING_CREATE, { challenge: { name, sr, nodes, detectionMax: 4 } });
  }

  createGmBase() {
    const name = this.promptGmValue("Nome da base/colonia", "Base Solaris");
    if (name === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_BASE_CREATE, { base: { name, attributes: { security: 2, supplies: 2, morale: 2 } } });
  }

  updateLoreFilter(kind = "", value = "") {
    if (kind === "query") this.loreQuery = String(value || "");
    if (kind === "type") this.loreTypeFilter = String(value || "all");
    if (kind === "importance") this.loreImportanceFilter = String(value || "all");
    this.render();
  }

  runGmLoreAction(action = "", loreId = "") {
    const events = {
      pin: GAME_EVENT_TYPES.GM_LORE_PIN,
      unpin: GAME_EVENT_TYPES.GM_LORE_PIN,
      discover: GAME_EVENT_TYPES.GM_LORE_DISCOVER,
      secret: GAME_EVENT_TYPES.GM_LORE_SECRET,
      note: GAME_EVENT_TYPES.GM_LORE_NOTE,
      report: GAME_EVENT_TYPES.GM_LORE_REPORT,
      mission: GAME_EVENT_TYPES.GM_LORE_MISSION,
      encounter: GAME_EVENT_TYPES.GM_LORE_ENCOUNTER,
      npc: GAME_EVENT_TYPES.GM_LORE_NPC,
      scene: GAME_EVENT_TYPES.GM_LORE_SCENE,
      clock: GAME_EVENT_TYPES.GM_LORE_CLOCK,
      faction: GAME_EVENT_TYPES.GM_LORE_FACTION,
    };
    const eventType = events[action];
    if (!eventType || !loreId) return;
    const payload = { loreId };
    if (action === "unpin") payload.pinned = false;
    if (action === "secret") payload.secretLevel = LORE_SECRET_LEVELS.SECRET;
    this.dispatchGmEvent(eventType, payload);
  }

  advanceGmMission(missionId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_MISSION_ADVANCE, { missionId, direction: "next" });
  }

  addGmMissionObjective(missionId) {
    const title = this.promptGmValue("Novo objetivo", "Objetivo secundario");
    if (title === null) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_MISSION_OBJECTIVE_CREATE, { missionId, objective: { title, type: "secundario" } });
  }

  resolveGmMissionComplication(missionId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_MISSION_COMPLICATION, { missionId });
  }

  resolveGmTravelEvent(routeId) {
    const seed = generateTravelEventSeed();
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_TRAVEL_EVENT, { routeId, roll: seed.roll, event: seed.message });
  }

  changeGmResource(resourceId, delta = -1) {
    const type = delta < 0 ? GAME_EVENT_TYPES.GM_RESOURCE_CONSUME : GAME_EVENT_TYPES.GM_RESOURCE_RESTORE;
    this.dispatchGmEvent(type, { resourceId, amount: Math.abs(delta), reason: delta < 0 ? "Consumo registrado pelo mestre." : "Recurso recuperado pelo mestre." });
  }

  changeGmFactionReputation(factionId, delta = 0) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_FACTION_REPUTATION, { factionId, delta, reason: "Ajuste de reputacao em sessao." });
  }

  advanceGmCampaignClock(clockId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_CLOCK_ADVANCE, { clockId, amount: 1 });
  }

  advanceGmHacking(challengeId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_HACKING_ADVANCE, { challengeId, success: true });
  }

  failGmHacking(challengeId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_HACKING_FAIL, { challengeId, reason: "Falha registrada pelo mestre." });
  }

  resolveGmBaseEvent(baseId) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_BASE_EVENT, { baseId });
  }

  openGmForm(kind = "", id = "") {
    this.gmForm = { kind, id };
    this.render();
  }

  closeGmForm() {
    this.gmForm = null;
    this.render();
  }

  submitGmForm(form) {
    const data = new FormData(form);
    const kind = this.gmForm?.kind || data.get("kind");
    const id = this.gmForm?.id || "";
    const bool = (name) => data.get(name) === "on" || data.get(name) === "true";
    const requiredName = String(data.get("name") || data.get("title") || "").trim();
    if (!requiredName) {
      this.options.notify("Preencha o nome/titulo antes de salvar.", "tech-error");
      return;
    }
    if (kind === "note") {
      const note = {
        title: requiredName,
        body: String(data.get("body") || ""),
        tags: String(data.get("tags") || ""),
        visibleToPlayers: bool("visibleToPlayers"),
        sceneId: String(data.get("sceneId") || ""),
        linkedType: String(data.get("linkedType") || ""),
        linkedId: String(data.get("linkedId") || ""),
        important: bool("important"),
        revealed: data.get("state") === "revelada",
        secret: data.get("state") !== "revelada",
        status: String(data.get("state") || "secreta"),
      };
      this.dispatchGmEvent(id ? GAME_EVENT_TYPES.GM_NOTE_UPDATE : GAME_EVENT_TYPES.GM_NOTE_CREATE, id ? { noteId: id, patch: note } : { note });
    }
    if (kind === "counter") {
      const counter = {
        name: requiredName,
        description: String(data.get("description") || ""),
        current: Number(data.get("current") || 0),
        max: Number(data.get("max") || 1),
        direction: String(data.get("direction") || "down"),
        type: String(data.get("type") || "ameaca"),
        color: String(data.get("color") || "#a35dff"),
        visibleToPlayers: bool("visibleToPlayers"),
        triggerText: String(data.get("triggerText") || ""),
        limitBehavior: String(data.get("limitBehavior") || ""),
      };
      this.dispatchGmEvent(id ? GAME_EVENT_TYPES.GM_COUNTER_UPDATE : GAME_EVENT_TYPES.GM_COUNTER_CREATE, id ? { counterId: id, patch: counter } : { counter });
    }
    if (kind === "environment") {
      const effect = {
        name: requiredName,
        description: String(data.get("description") || ""),
        type: String(data.get("type") || "outro"),
        duration: String(data.get("duration") || "Cena atual"),
        visibleToPlayers: bool("visibleToPlayers"),
        mechanicalEffect: String(data.get("mechanicalEffect") || ""),
        sceneId: String(data.get("sceneId") || ""),
        color: String(data.get("color") || "#35d4ff"),
        icon: String(data.get("icon") || ""),
      };
      this.dispatchGmEvent(id ? GAME_EVENT_TYPES.GM_ENVIRONMENT_UPDATE : GAME_EVENT_TYPES.GM_ENVIRONMENT_CREATE, id ? { effectId: id, patch: effect } : { effect });
    }
    if (kind === "scene") {
      const room = this.activeRoomSnapshot();
      const scene = {
        ...(id ? {} : room.scene || {}),
        id: id || createId("scene"),
        name: requiredName,
        notes: String(data.get("description") || ""),
        mapImage: String(data.get("mapImage") || room.scene?.mapImage || ""),
        columns: Number(data.get("columns") || room.scene?.columns || 12),
        rows: Number(data.get("rows") || room.scene?.rows || 8),
        metersPerCell: Number(data.get("metersPerCell") || room.scene?.metersPerCell || 1.5),
        gridVisible: bool("gridVisible"),
        lighting: String(data.get("lighting") || ""),
        danger: String(data.get("danger") || ""),
        climate: String(data.get("climate") || ""),
        gmNotes: String(data.get("gmNotes") || ""),
      };
      this.dispatchGmEvent(id ? GAME_EVENT_TYPES.GM_SCENE_UPDATE : GAME_EVENT_TYPES.GM_SCENE_CREATE, id ? { sceneId: id, patch: scene } : { scene });
    }
    if (kind === "encounter") {
      const catalog = this.options.getMonsterCatalog() || [];
      const monsterIds = String(data.get("monsterIds") || "").split(",").map((entry) => entry.trim()).filter(Boolean);
      const quantity = Math.max(1, Number(data.get("quantity") || 1));
      const selected = monsterIds.length
        ? monsterIds.map((monsterId) => catalog.find((monster) => monster.id === monsterId || normalizeSearch(monster.name) === normalizeSearch(monsterId))).filter(Boolean)
        : catalog.slice(0, quantity);
      const monsters = selected.flatMap((monster) => Array.from({ length: quantity }, () => normalizeMonsterForSession(monster)));
      const encounter = {
        name: requiredName,
        description: String(data.get("description") || ""),
        sceneId: String(data.get("sceneId") || ""),
        difficulty: String(data.get("difficulty") || "moderado"),
        monsters,
        rewards: { notes: String(data.get("rewards") || "") },
        notes: String(data.get("notes") || ""),
        status: String(data.get("status") || "prepared"),
      };
      this.dispatchGmEvent(id ? GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE : GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, id ? { encounterId: id, patch: encounter } : { encounter });
    }
    this.gmForm = null;
    this.render();
  }

  createGmNotePrompt() {
    this.openGmForm("note");
  }

  revealGmNote(noteId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_NOTE_REVEAL, { noteId });
  }

  deleteGmNote(noteId = "") {
    if (!window.confirm("Excluir esta nota do mestre?")) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_NOTE_DELETE, { noteId });
  }

  createGmCounterPrompt() {
    this.openGmForm("counter");
  }

  tickGmCounter(counterId = "", delta = 1) {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_COUNTER_TICK, { counterId, delta });
  }

  revealGmCounter(counterId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_COUNTER_REVEAL, { counterId });
  }

  deleteGmCounter(counterId = "") {
    if (!window.confirm("Excluir este contador?")) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_COUNTER_DELETE, { counterId });
  }

  createGmEnvironmentPrompt() {
    this.openGmForm("environment");
  }

  deleteGmEnvironment(effectId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENVIRONMENT_DELETE, { effectId });
  }

  createGmScenePrompt() {
    this.openGmForm("scene");
  }

  saveCurrentSceneToGmList() {
    const room = this.activeRoomSnapshot();
    const scene = room.scene || {};
    const exists = (room.sceneList || []).some((entry) => entry.id === scene.id);
    this.dispatchGmEvent(exists ? GAME_EVENT_TYPES.GM_SCENE_UPDATE : GAME_EVENT_TYPES.GM_SCENE_CREATE, exists
      ? { sceneId: scene.id, patch: scene }
      : { scene: { ...scene, id: scene.id || createId("scene") } });
  }

  switchGmScene(sceneId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_SWITCH, { sceneId });
  }

  deleteGmScene(sceneId = "") {
    if (!window.confirm("Excluir esta cena salva?")) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_DELETE, { sceneId });
  }

  createGmEncounterPrompt() {
    this.openGmForm("encounter");
  }

  startGmEncounter(encounterId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_START, { encounterId });
  }

  completeGmEncounter(encounterId = "") {
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_COMPLETE, { encounterId });
  }

  deleteGmEncounter(encounterId = "") {
    if (!window.confirm("Excluir este encontro preparado?")) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_DELETE, { encounterId });
  }

  encounterSuggestions() {
    const catalog = this.options.getMonsterCatalog() || [];
    const quantity = Math.max(1, Number(this.encounterFilters.quantity || 1));
    return catalog
      .filter((monster) => monsterMatchesEncounterFilters(monster, this.encounterFilters))
      .sort((a, b) => monsterThreatScore(a) - monsterThreatScore(b) || String(a.name).localeCompare(String(b.name), "pt-BR"))
      .slice(0, Math.max(6, quantity * 3));
  }

  generatedEncounterPayload({ immediate = false } = {}) {
    const suggestions = this.encounterSuggestions();
    const quantity = Math.max(1, Number(this.encounterFilters.quantity || 1));
    const picked = suggestions.slice(0, quantity);
    const monsters = picked.map((monster) => normalizeMonsterForSession(monster));
    const bestiaryThreat = estimateBestiaryEncounterThreat(monsters.map((monster) => monster.snapshot || monster), {
      characters: this.activeRoomSnapshot().characters || [],
    });
    return {
      name: `Encontro ${this.encounterFilters.difficulty || "moderado"} - ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      description: `Gerado por filtros do bestiario: ${[this.encounterFilters.tier, this.encounterFilters.type, this.encounterFilters.role].filter((value) => value && value !== "all").join(" / ") || "sem filtro"}.`,
      sceneId: this.activeRoomSnapshot().activeSceneId,
      difficulty: this.encounterFilters.difficulty || "moderado",
      monsters,
      threatXp: monsters.reduce((sum, monster) => sum + monsterThreatScore(monster.snapshot || monster), 0),
      bestiaryThreat,
      filters: { ...this.encounterFilters },
      generated: true,
      notes: immediate ? "Gerado e adicionado imediatamente a cena." : "Gerado para preparacao posterior.",
    };
  }

  generatePreparedEncounter({ immediate = false } = {}) {
    const payload = this.generatedEncounterPayload({ immediate });
    if (!payload.monsters.length) {
      this.options.notify("Nenhum monstro encontrado para esses filtros.", "tech-error");
      return;
    }
    if (immediate) {
      payload.startNow = true;
      if (this.client.isConnected) {
        this.client.generateGmEncounter(payload);
        return;
      }
      const room = this.roomFromSnapshot();
      const actor = room.players.find((player) => player.isGM) || room.players[0];
      const encounter = room.dispatch(GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE, payload, actor?.id || "");
      this.applyOfflineRoom(room);
      return;
    }
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_GENERATE, payload);
  }

  updateEncounterFilter(key = "", value = "") {
    const normalized = key === "query" ? String(value || "") : (value || "all");
    this.encounterFilters = {
      ...this.encounterFilters,
      [key]: ["quantity"].includes(key) ? Math.max(1, Number(value || 1)) : normalized,
    };
    this.render();
  }

  updateReportOption(key = "", checked = false) {
    this.reportOptions = { ...this.reportOptions, [key]: Boolean(checked) };
    this.render();
  }

  shieldRules(room = this.activeRoomSnapshot()) {
    const settings = room.gmDashboardSettings || room.gmDashboard?.settings || {};
    const pinned = new Set(settings.pinnedShieldRules || []);
    const rules = buildShieldRules(this.shieldQuery);
    return [
      ...rules.filter((rule) => pinned.has(rule.id)),
      ...rules.filter((rule) => !pinned.has(rule.id)),
    ];
  }

  findShieldRule(ruleId = "") {
    return buildShieldRules(this.shieldQuery).find((rule) => rule.id === ruleId)
      || buildShieldRules("").find((rule) => rule.id === ruleId)
      || shieldFallbackRules().find((rule) => rule.id === ruleId)
      || null;
  }

  pinShieldRule(ruleId = "") {
    if (!ruleId) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SHIELD_PIN, { ruleId });
  }

  async copyShieldRule(ruleId = "") {
    const rule = this.findShieldRule(ruleId);
    if (!rule) return;
    const text = `${rule.title}\n${rule.summary || ""}`.trim();
    try {
      await navigator.clipboard?.writeText(text);
      this.options.notify("Regra copiada para a area de transferencia.");
    } catch {
      this.options.notify(text);
    }
  }

  sendShieldRuleToChat(ruleId = "") {
    const rule = this.findShieldRule(ruleId);
    if (!rule) return;
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SHIELD_SEND_TO_CHAT, { rule });
  }

  buildGmReport(room = this.activeRoomSnapshot(), combat = normalizeCombatState(room, this.options.getCurrentCharacter()), options = this.reportOptions) {
    const revealedNotes = (room.gmNotes || []).filter((note) => note.revealed || note.visibleToPlayers);
    const notes = options.includeSecretNotes ? (room.gmNotes || []) : revealedNotes;
    const encounters = room.preparedEncounters || [];
    const loot = room.lootPacks || [];
    const transactions = room.transactionLog || [];
    const chat = room.chatMessages || [];
    const objectives = room.scene?.objectives || [];
    const lines = [
      `# Relatorio da Sessao - ${this.activeCampaign()?.name || room.roomName || room.name || "Solaris"}`,
      "",
      `Sessao: ${room.roomName || room.name || "Colonia Solaris-7"}`,
      `Sistema: ${room.system || "Guerra Solar / Solaris"}`,
      `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
      `Mestre: ${(room.players || []).find((player) => player.isGM || player.role === SESSION_ROLES.GM)?.name || "Solaris GM"}`,
      `Cena ativa: ${room.scene?.name || "-"}`,
      `Combate: ${combat.active ? `Rodada ${combat.round || 1}` : "inativo"}`,
      "",
      "## Jogadores",
      ...((room.players || []).map((player) => `- ${player.name} (${player.online ? "online" : "offline"})`)),
      "",
      "## Personagens",
      ...((room.characters || []).length ? room.characters.map((character) => `- ${character.name || character.snapshot?.name || character.id}`) : ["- Nenhuma ficha sincronizada."]),
      "",
      ...(options.includeScenes ? ["## Cenas visitadas", ...((room.sceneList || []).length ? room.sceneList.map((scene) => `- ${scene.name || scene.title || scene.id}`) : ["- Apenas cena atual."]), ""] : []),
      "## Monstros",
      ...((room.monsters || []).length ? room.monsters.map((monster) => `- ${monster.name}`) : ["- Nenhum monstro ativo."]),
      "",
      ...(options.includeEncounters ? ["## Encontros", ...(encounters.length ? encounters.map((encounter) => `- ${encounter.name}: ${encounter.status || "preparado"}`) : ["- Nenhum encontro preparado."]), ""] : []),
      "## Notas",
      ...(notes.length ? notes.map((note) => `- ${note.important ? "[!]" : "[ ]"} ${note.title}: ${note.body || ""}`) : ["- Nenhuma nota revelada."]),
      "",
      ...(options.includeCounters ? ["## Contadores", ...((room.gmCounters || []).length ? room.gmCounters.map((counter) => `- ${counter.name}: ${counter.current}/${counter.max}`) : ["- Nenhum contador."]), ""] : []),
      ...(options.includeEnvironment ? ["## Efeitos ambientais", ...((room.environmentalEffects || []).length ? room.environmentalEffects.map((effect) => `- ${effect.name}: ${effect.description || effect.mechanicalEffect || "sem detalhe"}`) : ["- Nenhum efeito ambiental."]), ""] : []),
      ...(options.includeObjectives ? ["## Objetivos concluidos", ...(() => {
        const completed = objectives.filter((objective) => objective.completed || Number(objective.progressCurrent || 0) >= Number(objective.progressMax || 1));
        return completed.length ? completed.map((objective) => `- ${objective.title || objective.label}`) : ["- Nenhum objetivo concluido."];
      })(), ""] : []),
      ...(options.includeCombat ? ["## Combate", ...((combat.log || []).slice(-40).map((entry) => `- ${entry.message || entry.type || "Evento"}`) || ["- Sem combate."]), ""] : []),
      ...(options.includeLoot ? ["## Loot", ...(loot.length ? loot.map((pack) => `- ${pack.name}: ${pack.luzentis || 0}L, ${(pack.items || []).length} item(ns).`) : ["- Nenhum loot."]), ""] : []),
      ...(options.includeTransactions ? ["## Transacoes", ...(transactions.length ? transactions.slice(-40).map((entry) => `- ${entry.message || entry.type || "Transacao"}`) : ["- Nenhuma transacao."]), ""] : []),
      "## Chat",
      ...((options.includeFullChat ? chat : chat.slice(-20)).map((entry) => `- ${entry.authorName || "Mesa"}: ${entry.message || ""}`)),
      "",
      ...(options.includePending ? ["## Pendencias para a proxima sessao", "- Revisar cenas, contadores ativos, objetivos abertos e encontros preparados."] : []),
      ...(options.includeTechnicalLogs ? ["", "## Logs tecnicos", ...((room.events || []).slice(-40).map((entry) => `- ${entry.type || "Evento"} ${entry.createdAt || ""}`))] : []),
    ];
    return lines.join("\n");
  }

  exportGmReport() {
    const room = this.activeRoomSnapshot();
    downloadTextFile(this.exportFilename("relatorio-mestre").replace(/\.json$/i, ".md"), this.buildGmReport(room, normalizeCombatState(room, this.options.getCurrentCharacter()), this.reportOptions));
    if (this.client.isConnected) this.client.exportGmReport(this.reportOptions);
    this.sendChat("Relatorio da sessao exportado pelo Mestre.");
  }

  sceneEditorScene(room = this.activeRoomSnapshot()) {
    const scenes = room.sceneList?.length ? room.sceneList : [room.scene || {}];
    const sceneId = this.sceneEditor?.sceneId || room.activeSceneId || room.scene?.id || scenes[0]?.id || "";
    return scenes.find((scene) => scene.id === sceneId) || room.scene || scenes[0] || {};
  }

  sceneEditorSelection(scene = this.sceneEditorScene()) {
    const selection = this.sceneEditor?.selection || {};
    const kind = selection.kind || "";
    const id = selection.id || "";
    const key = { token: "tokens", zone: "zones", area: "areas", objective: "objectives" }[kind];
    const entry = key ? (scene[key] || []).find((item) => item.id === id) : null;
    return entry ? { kind, id, entry, key } : { kind: "", id: "", entry: null, key: "" };
  }

  openSceneEditor(sceneId = "") {
    const room = this.activeRoomSnapshot();
    const target = sceneId || room.activeSceneId || room.scene?.id || room.sceneList?.[0]?.id || "";
    this.sceneEditor = { sceneId: target, selection: null };
    this.gmPanelOpen = false;
    this.render();
  }

  closeSceneEditor() {
    this.sceneEditor = null;
    this.render();
  }

  selectSceneEditorScene(sceneId = "") {
    this.sceneEditor = { sceneId, selection: null };
    this.render();
  }

  selectSceneEditorEntry(kind = "", id = "") {
    if (!this.sceneEditor) return;
    this.sceneEditor = {
      ...this.sceneEditor,
      selection: kind && id ? { kind, id } : null,
    };
    this.render();
  }

  createSceneFromEditor() {
    const room = this.activeRoomSnapshot();
    const next = new Scene({
      id: createId("scene"),
      name: "Nova cena Solaris",
      description: "Cena preparada no editor visual.",
      columns: room.scene?.columns || 12,
      rows: room.scene?.rows || 8,
      metersPerCell: room.scene?.metersPerCell || 1.5,
      gridVisible: true,
      gridOpacity: room.scene?.gridOpacity ?? 0.38,
      gridColor: room.scene?.gridColor || "#1aa8ff",
    }).toJSON();
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_CREATE, { scene: next });
    this.sceneEditor = { sceneId: next.id, selection: null };
  }

  duplicateSceneEditorScene() {
    const room = this.activeRoomSnapshot();
    const source = this.sceneEditorScene(room);
    if (!source?.id) return;
    const copy = new Scene({
      ...source,
      id: createId("scene"),
      name: `${source.name || "Cena"} - copia`,
      tokens: (source.tokens || []).map((token) => ({ ...token, id: createId("token") })),
      zones: (source.zones || []).map((zone) => ({ ...zone, id: createId("zone") })),
      areas: (source.areas || []).map((area) => ({ ...area, id: createId("area") })),
      objectives: (source.objectives || []).map((objective) => ({ ...objective, id: createId("objective") })),
      measurements: [],
    }).toJSON();
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_CREATE, { scene: copy });
    this.sceneEditor = { sceneId: copy.id, selection: null };
  }

  exportSceneEditorScene() {
    const scene = this.sceneEditorScene();
    if (!scene?.id) return;
    downloadJsonFile(this.exportFilename(`cena-${scene.name || "solaris"}`), scene);
  }

  saveSceneEditor(form) {
    const data = new FormData(form);
    const id = String(data.get("id") || "").trim() || createId("scene");
    const room = this.activeRoomSnapshot();
    const existing = (room.sceneList || []).find((scene) => scene.id === id) || (room.scene?.id === id ? room.scene : {}) || {};
    const scene = new Scene({
      ...existing,
      id,
      name: String(data.get("name") || "Cena sem nome").trim(),
      description: String(data.get("description") || ""),
      notes: String(data.get("description") || ""),
      publicNotes: String(data.get("publicNotes") || ""),
      gmNotes: String(data.get("gmNotes") || ""),
      mapImage: String(data.get("mapImage") || ""),
      columns: Number(data.get("columns") || 12),
      rows: Number(data.get("rows") || 8),
      metersPerCell: Number(data.get("metersPerCell") || 1.5),
      gridVisible: data.get("gridVisible") === "on",
      gridOpacity: Number(data.get("gridOpacity") || 0.38),
      gridColor: String(data.get("gridColor") || "#1aa8ff"),
      lighting: String(data.get("lighting") || ""),
      climate: String(data.get("climate") || ""),
      danger: String(data.get("danger") || ""),
    }).toJSON();
    const exists = (room.sceneList || []).some((entry) => entry.id === id);
    this.dispatchGmEvent(exists ? GAME_EVENT_TYPES.GM_SCENE_UPDATE : GAME_EVENT_TYPES.GM_SCENE_CREATE, exists
      ? { sceneId: id, patch: scene }
      : { scene });
    this.sceneEditor = { sceneId: id, selection: this.sceneEditor?.selection || null };
    this.options.notify("Cena salva no editor visual.");
  }

  updateSceneEditorEntry(kind = "", id = "", patch = {}) {
    const scene = this.sceneEditorScene();
    const key = { token: "tokens", zone: "zones", area: "areas", objective: "objectives" }[kind];
    if (!scene?.id || !key || !id) return false;
    const nextEntries = (scene[key] || []).map((entry) => entry.id === id ? { ...entry, ...patch, id } : entry);
    const nextScene = new Scene({ ...scene, [key]: nextEntries }).toJSON();
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
    this.sceneEditor = { sceneId: scene.id, selection: { kind, id } };
    return true;
  }

  moveSceneEditorEntry(kind = "", id = "", point = {}) {
    const scene = this.sceneEditorScene();
    const maxX = Math.max(1, Number(scene.columns || 12));
    const maxY = Math.max(1, Number(scene.rows || 8));
    const patch = {
      x: clamp(Number(point.x || 1), 1, maxX),
      y: clamp(Number(point.y || 1), 1, maxY),
    };
    if (this.updateSceneEditorEntry(kind, id, patch)) {
      this.options.notify(`Elemento movido para ${gridLabel(patch.x, patch.y)}.`);
    }
  }

  saveSceneEditorEntry(form) {
    const data = new FormData(form);
    const kind = String(data.get("kind") || "");
    const id = String(data.get("id") || "");
    const bool = (name) => data.get(name) === "on";
    const num = (name, fallback = 0) => Number(data.get(name) || fallback);
    const patchByKind = {
      objective: {
        title: String(data.get("title") || "Objetivo"),
        label: String(data.get("title") || "Objetivo"),
        description: String(data.get("description") || ""),
        progressCurrent: num("progressCurrent", 0),
        progressMax: Math.max(1, num("progressMax", 1)),
        x: num("x", 1),
        y: num("y", 1),
        color: String(data.get("color") || "#f2c35b"),
        icon: String(data.get("icon") || ""),
        reward: String(data.get("reward") || ""),
        gmNotes: String(data.get("gmNotes") || ""),
        completed: bool("completed"),
        hidden: bool("hidden"),
        visibleToPlayers: bool("visibleToPlayers") && !bool("hidden"),
      },
      zone: {
        label: String(data.get("label") || "Zona"),
        type: String(data.get("type") || "danger"),
        x: num("x", 1),
        y: num("y", 1),
        width: Math.max(1, num("width", 1)),
        height: Math.max(1, num("height", 1)),
        shape: String(data.get("shape") || "rectangle"),
        direction: String(data.get("direction") || ""),
        opacity: Math.max(0, Math.min(1, num("opacity", 0.32))),
        color: String(data.get("color") || ""),
        description: String(data.get("description") || ""),
        notes: String(data.get("description") || ""),
        mechanicalEffect: String(data.get("mechanicalEffect") || ""),
        duration: String(data.get("duration") || ""),
        hidden: bool("hidden"),
        visibleToPlayers: bool("visibleToPlayers") && !bool("hidden"),
      },
      area: {
        label: String(data.get("label") || "Area"),
        type: String(data.get("type") || "circle"),
        x: num("x", 1),
        y: num("y", 1),
        radius: Math.max(0, num("radius", 2)),
        length: Math.max(1, num("length", 4)),
        width: Math.max(1, num("width", 1)),
        direction: String(data.get("direction") || "east"),
        color: String(data.get("color") || ""),
        source: String(data.get("source") || ""),
        hidden: bool("hidden"),
        visibleToPlayers: bool("visibleToPlayers") && !bool("hidden"),
      },
      token: {
        name: String(data.get("name") || "Token"),
        entityType: String(data.get("entityType") || "object"),
        entityId: String(data.get("entityId") || ""),
        x: num("x", 1),
        y: num("y", 1),
        size: Math.max(1, num("size", 1)),
        image: String(data.get("image") || ""),
        color: String(data.get("color") || ""),
        hidden: bool("hidden"),
        locked: bool("locked"),
        metadata: {
          movement: num("movement", 0),
          notes: String(data.get("notes") || ""),
        },
      },
    };
    if (!patchByKind[kind]) return;
    this.updateSceneEditorEntry(kind, id, patchByKind[kind]);
    this.options.notify("Elemento da cena salvo.");
  }

  addSceneEditorObjective() {
    const room = this.activeRoomSnapshot();
    const scene = this.sceneEditorScene(room);
    if (!scene?.id) return;
    const objectiveId = createId("objective");
    const nextScene = new Scene({
      ...scene,
      objectives: [
        ...(scene.objectives || []),
        {
          id: objectiveId,
          title: "Novo objetivo",
          description: "Objetivo criado no editor visual.",
          progressCurrent: 0,
          progressMax: 1,
          x: Math.max(1, Math.ceil((scene.columns || 12) / 2)),
          y: Math.max(1, Math.ceil((scene.rows || 8) / 2)),
          color: "#f2c35b",
          visibleToPlayers: true,
        },
      ],
    }).toJSON();
    this.sceneEditor = { sceneId: scene.id, selection: { kind: "objective", id: objectiveId } };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
  }

  addSceneEditorZone(type = "danger") {
    const room = this.activeRoomSnapshot();
    const scene = this.sceneEditorScene(room);
    if (!scene?.id) return;
    const zoneId = createId("zone");
    const nextScene = new Scene({
      ...scene,
      zones: [
        ...(scene.zones || []),
        {
          id: zoneId,
          label: type === "cover" ? "Cobertura" : "Zona de perigo",
          type,
          x: 2,
          y: 2,
          width: 3,
          height: 2,
          shape: "rectangle",
          color: type === "cover" ? "#35d4ff" : "#ff4d63",
          mechanicalEffect: type === "cover" ? "+2 CA contra ataques a distancia" : "Risco ambiental definido pelo mestre",
          visibleToPlayers: true,
        },
      ],
    }).toJSON();
    this.sceneEditor = { sceneId: scene.id, selection: { kind: "zone", id: zoneId } };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
  }

  addSceneEditorArea(type = "circle") {
    const room = this.activeRoomSnapshot();
    const scene = this.sceneEditorScene(room);
    if (!scene?.id) return;
    const areaId = createId("area");
    const nextScene = new Scene({
      ...scene,
      areas: [
        ...(scene.areas || []),
        {
          id: areaId,
          label: type === "line" ? "Linha de efeito" : type === "cone" ? "Cone de efeito" : "Area de efeito",
          type,
          x: Math.max(1, Math.ceil((scene.columns || 12) / 2)),
          y: Math.max(1, Math.ceil((scene.rows || 8) / 2)),
          radius: type === "circle" ? 2 : 0,
          length: type === "circle" ? 1 : 4,
          width: type === "line" ? 1 : 3,
          direction: "east",
          color: "#9b4dff",
          visibleToPlayers: true,
        },
      ],
    }).toJSON();
    this.sceneEditor = { sceneId: scene.id, selection: { kind: "area", id: areaId } };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
  }

  addSceneEditorToken() {
    const room = this.activeRoomSnapshot();
    const scene = this.sceneEditorScene(room);
    if (!scene?.id) return;
    const monster = (this.options.getMonsterCatalog() || [])[0] || {};
    const token = {
      id: createId("token"),
      entityType: monster.id ? "monster" : "object",
      entityId: monster.id || createId("object"),
      name: monster.name || "Marcador de cena",
      x: Math.max(1, Math.ceil((scene.columns || 12) / 2)),
      y: Math.max(1, Math.ceil((scene.rows || 8) / 2)),
      image: monster.imageDataUrl || monster.image || "",
      color: monster.id ? "#ff4d63" : "#39cfff",
      hidden: false,
      locked: false,
    };
    const nextScene = new Scene({ ...scene, tokens: [...(scene.tokens || []), token] }).toJSON();
    this.sceneEditor = { sceneId: scene.id, selection: { kind: "token", id: token.id } };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
  }

  removeSceneEditorEntry(kind = "", id = "") {
    const scene = this.sceneEditorScene();
    if (!scene?.id || !id) return;
    const key = { token: "tokens", zone: "zones", area: "areas", objective: "objectives" }[kind];
    if (!key) return;
    const nextScene = new Scene({
      ...scene,
      [key]: (scene[key] || []).filter((entry) => entry.id !== id),
    }).toJSON();
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_SCENE_UPDATE, { sceneId: scene.id, patch: nextScene });
    const selected = this.sceneEditor?.selection;
    this.sceneEditor = {
      sceneId: scene.id,
      selection: selected?.kind === kind && selected?.id === id ? null : selected || null,
    };
  }

  openEncounterEditor(encounterId = "") {
    const room = this.activeRoomSnapshot();
    const target = encounterId || room.preparedEncounters?.[0]?.id || "";
    this.encounterEditor = { encounterId: target };
    this.gmPanelOpen = false;
    this.render();
  }

  closeEncounterEditor() {
    this.encounterEditor = null;
    this.render();
  }

  encounterEditorEncounter(room = this.activeRoomSnapshot()) {
    const id = this.encounterEditor?.encounterId || "";
    return (room.preparedEncounters || []).find((entry) => entry.id === id) || {};
  }

  createEncounterFromEditor() {
    const id = createId("encounter");
    const encounter = {
      id,
      name: "Novo encontro",
      description: "Encontro preparado no editor visual.",
      sceneId: this.activeRoomSnapshot().activeSceneId || "",
      difficulty: "moderado",
      status: "prepared",
      monsters: [],
      initialPositions: [],
      objectives: [],
      rewards: { notes: "" },
      notes: "",
    };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, { encounter });
    this.encounterEditor = { encounterId: id };
  }

  saveEncounterEditor(form) {
    const data = new FormData(form);
    const room = this.activeRoomSnapshot();
    const id = String(data.get("id") || "").trim() || createId("encounter");
    const existing = (room.preparedEncounters || []).find((entry) => entry.id === id) || {};
    const monsters = Array.isArray(existing.monsters) ? existing.monsters : [];
    const encounter = {
      ...existing,
      id,
      name: String(data.get("name") || "Encontro preparado").trim(),
      description: String(data.get("description") || ""),
      sceneId: String(data.get("sceneId") || ""),
      difficulty: String(data.get("difficulty") || "moderado"),
      status: String(data.get("status") || "prepared"),
      publicNotes: String(data.get("publicNotes") || ""),
      secretNotes: String(data.get("secretNotes") || ""),
      notes: String(data.get("secretNotes") || existing.notes || ""),
      rewards: { ...(existing.rewards || {}), notes: String(data.get("rewards") || "") },
      monsters,
      initialPositions: Array.isArray(existing.initialPositions) ? existing.initialPositions : [],
    };
    encounter.balance = estimateEncounterBalance({
      monsters: monsters.map((monster) => monster.snapshot || monster),
      characters: (room.characters || []).map((character) => character.snapshot || character),
    });
    const exists = (room.preparedEncounters || []).some((entry) => entry.id === id);
    this.dispatchGmEvent(exists ? GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE : GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, exists
      ? { encounterId: id, patch: encounter }
      : { encounter });
    this.encounterEditor = { encounterId: id };
    this.options.notify("Encontro salvo no editor visual.");
  }

  duplicateEncounterEditorEncounter() {
    const source = this.encounterEditorEncounter();
    if (!source?.id) return;
    const copy = {
      ...source,
      id: createId("encounter"),
      name: `${source.name || "Encontro"} - copia`,
      monsters: (source.monsters || []).map((monster) => normalizeMonsterForSession(monster.snapshot || monster)),
      initialPositions: (source.initialPositions || []).map((position) => ({ ...position })),
      status: "prepared",
    };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_CREATE, { encounter: copy });
    this.encounterEditor = { encounterId: copy.id };
  }

  addEncounterEditorMonster(monsterId = "") {
    const room = this.activeRoomSnapshot();
    const encounter = this.encounterEditorEncounter(room);
    if (!encounter?.id) return;
    const catalog = this.options.getMonsterCatalog() || [];
    const monster = catalog.find((entry) => entry.id === monsterId) || catalog[0];
    if (!monster) {
      this.options.notify("Nenhum monstro no bestiario para adicionar.", "tech-error");
      return;
    }
    const monsters = [...(encounter.monsters || []), normalizeMonsterForSession(monster)];
    const initialPositions = [
      ...(encounter.initialPositions || []),
      { x: 2 + monsters.length, y: 2, hidden: false },
    ];
    const balance = estimateEncounterBalance({
      monsters: monsters.map((entry) => entry.snapshot || entry),
      characters: (room.characters || []).map((character) => character.snapshot || character),
    });
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE, {
      encounterId: encounter.id,
      patch: { monsters, initialPositions, balance, estimatedDifficulty: balance.classification },
    });
  }

  removeEncounterEditorMonster(index = 0) {
    const room = this.activeRoomSnapshot();
    const encounter = this.encounterEditorEncounter(room);
    if (!encounter?.id) return;
    const targetIndex = Number(index || 0);
    const monsters = (encounter.monsters || []).filter((_, entryIndex) => entryIndex !== targetIndex);
    const initialPositions = (encounter.initialPositions || []).filter((_, entryIndex) => entryIndex !== targetIndex);
    const balance = estimateEncounterBalance({
      monsters: monsters.map((entry) => entry.snapshot || entry),
      characters: (room.characters || []).map((character) => character.snapshot || character),
    });
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_ENCOUNTER_UPDATE, {
      encounterId: encounter.id,
      patch: { monsters, initialPositions, balance, estimatedDifficulty: balance.classification },
    });
  }

  openReportPreview() {
    this.reportPreviewOpen = true;
    this.gmPanelOpen = false;
    this.render();
  }

  closeReportPreview() {
    this.reportPreviewOpen = false;
    this.render();
  }

  reportMarkdown() {
    const room = this.activeRoomSnapshot();
    return this.buildGmReport(room, normalizeCombatState(room, this.options.getCurrentCharacter()), this.reportOptions);
  }

  copyReportPreview() {
    const text = this.reportMarkdown();
    navigator.clipboard?.writeText(text)
      .then(() => this.options.notify("Relatorio copiado."))
      .catch(() => this.options.notify(text));
  }

  downloadReportPreview() {
    downloadTextFile(this.exportFilename("relatorio-mestre").replace(/\.json$/i, ".md"), this.reportMarkdown());
  }

  saveReportPreview() {
    const room = this.activeRoomSnapshot();
    const markdown = this.reportMarkdown();
    const report = {
      id: createId("report"),
      sessionId: room.roomId || room.id || "sessao-local",
      title: `Relatorio - ${room.scene?.name || room.roomName || "Sessao Solaris"}`,
      markdown,
      summary: markdown.split("\n").filter(Boolean).slice(0, 6).join(" "),
      options: { ...this.reportOptions },
      metadata: { savedBy: this.client.playerId, appVersion: TABLETOP_APP_VERSION },
    };
    this.dispatchGmEvent(GAME_EVENT_TYPES.GM_REPORT_SAVE, { report });
    this.options.notify("Relatorio salvo na campanha.");
  }

  exportReportHtml() {
    const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Relatorio Solaris</title><body><pre>${escapeHtml(this.reportMarkdown())}</pre></body></html>`;
    downloadTextFile(this.exportFilename("relatorio-mestre").replace(/\.json$/i, ".html"), html);
  }

  renderEditorScenePreview(scene = {}) {
    const normalized = normalizeScene(scene, this.options.getCurrentCharacter());
    const zones = normalized.zones || [];
    const areas = normalized.areas || [];
    const objectives = normalized.objectives || [];
    const tokens = normalized.tokens || [];
    const selection = this.sceneEditorSelection(scene);
    return `
      <div
        class="vtt-editor-map-preview vtt-map-grid ${normalized.gridVisible ? "" : "grid-hidden"}"
        data-vtt-scene-editor-grid
        style="--map-columns:${escapeHtml(normalized.columns)};--map-rows:${escapeHtml(normalized.rows)};--grid-opacity:${escapeHtml(normalized.gridOpacity)};--grid-color:${escapeHtml(normalized.gridColor || "#1aa8ff")};${normalized.mapImage ? `--map-image:url('${escapeHtml(normalized.mapImage)}');` : ""}"
      >
        <div class="vtt-map-glow"></div>
        <div class="vtt-grid-coordinate top-left">A1</div>
        <div class="vtt-grid-coordinate bottom-right">${escapeHtml(gridLabel(normalized.columns, normalized.rows))}</div>
        ${zones.map((zone) => `
          <span class="vtt-map-zone ${escapeHtml(zone.type || "danger")} ${selection.kind === "zone" && selection.id === zone.id ? "editor-selected" : ""}" style="${zoneGridStyle(zone, normalized)}" draggable="true" data-vtt-scene-editor-entry="zone" data-entry-id="${escapeHtml(zone.id)}" title="${escapeHtml(`${zone.label || "Zona"} em ${gridLabel(zone.x, zone.y)}`)}">
            ${escapeHtml(zone.label || "Zona")}
          </span>
        `).join("")}
        ${areas.map((area) => `
          <span class="vtt-map-area ${escapeHtml(area.type || "circle")} ${selection.kind === "area" && selection.id === area.id ? "editor-selected" : ""}" style="${areaGridStyle(area, normalized)}" draggable="true" data-vtt-scene-editor-entry="area" data-entry-id="${escapeHtml(area.id)}" title="${escapeHtml(`${area.label || "Area"} em ${gridLabel(area.x, area.y)}`)}">
            ${escapeHtml(area.label || "Area")}
          </span>
        `).join("")}
        ${objectives.filter((objective) => objective.x && objective.y).map((objective) => `
          <span class="vtt-map-objective ${objective.completed ? "completed" : ""} ${selection.kind === "objective" && selection.id === objective.id ? "editor-selected" : ""}" style="${tokenGridStyle({ x: objective.x, y: objective.y, color: objective.color || "#f2c35b" }, normalized)}" draggable="true" data-vtt-scene-editor-entry="objective" data-entry-id="${escapeHtml(objective.id)}" title="${escapeHtml(`${objective.title || objective.label || "Objetivo"} em ${gridLabel(objective.x, objective.y)}`)}">
            ${escapeHtml(objective.progressCurrent ?? 0)}/${escapeHtml(objective.progressMax ?? 1)}
          </span>
        `).join("")}
        ${tokens.map((token) => `
          <span
            class="vtt-map-token ${tokenKindClass(token)} ${token.hidden ? "hidden" : ""} ${token.locked ? "locked" : ""} ${selection.kind === "token" && selection.id === token.id ? "editor-selected" : ""}"
            style="${tokenGridStyle(token, normalized)}"
            title="${escapeHtml(`${token.name} em ${gridLabel(token.x, token.y)}`)}"
            draggable="true"
            data-vtt-scene-editor-entry="token"
            data-entry-id="${escapeHtml(token.id)}"
          >
            ${token.image ? `<img src="${escapeHtml(token.image)}" alt="" />` : `<span>${escapeHtml(tokenInitial(token))}</span>`}
          </span>
        `).join("")}
        <div class="vtt-map-caption">
          <strong>${escapeHtml(normalized.name)}</strong>
          <small>${escapeHtml(normalized.columns)} x ${escapeHtml(normalized.rows)} casas / ${escapeHtml(normalized.metersPerCell)}m por casa</small>
        </div>
      </div>
    `;
  }

  renderSceneEditorElementForm(scene = {}) {
    const selection = this.sceneEditorSelection(scene);
    if (!selection.entry) {
      return `
        <section class="vtt-editor-element-empty">
          <strong>Elemento da cena</strong>
          <p>Clique em um token, zona, area ou objetivo no preview para editar. Arraste no mapa para reposicionar.</p>
        </section>
      `;
    }
    const { kind, entry } = selection;
    const commonHidden = `
      <input type="hidden" name="kind" value="${escapeHtml(kind)}" />
      <input type="hidden" name="id" value="${escapeHtml(entry.id)}" />
    `;
    const positionFields = `
      <label>X<input name="x" type="number" min="1" max="${escapeHtml(scene.columns || 60)}" value="${escapeHtml(entry.x || 1)}" /></label>
      <label>Y<input name="y" type="number" min="1" max="${escapeHtml(scene.rows || 60)}" value="${escapeHtml(entry.y || 1)}" /></label>
    `;
    const visibilityFields = `
      <label class="check"><input type="checkbox" name="visibleToPlayers" ${entry.visibleToPlayers !== false && !entry.hidden ? "checked" : ""} /> Visivel para jogadores</label>
      <label class="check"><input type="checkbox" name="hidden" ${entry.hidden ? "checked" : ""} /> Oculto</label>
    `;
    const formByKind = {
      objective: `
        <label class="wide">Titulo<input name="title" required value="${escapeHtml(entry.title || entry.label || "Objetivo")}" /></label>
        ${positionFields}
        <label>Progresso atual<input name="progressCurrent" type="number" min="0" value="${escapeHtml(entry.progressCurrent ?? 0)}" /></label>
        <label>Progresso max.<input name="progressMax" type="number" min="1" value="${escapeHtml(entry.progressMax ?? 1)}" /></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(entry.color || "#f2c35b")}" /></label>
        <label>Icone<input name="icon" value="${escapeHtml(entry.icon || "")}" /></label>
        ${visibilityFields}
        <label class="check"><input type="checkbox" name="completed" ${entry.completed ? "checked" : ""} /> Concluido</label>
        <label class="wide">Descricao<textarea name="description" rows="3">${escapeHtml(entry.description || "")}</textarea></label>
        <label class="wide">Recompensa<textarea name="reward" rows="2">${escapeHtml(entry.reward || "")}</textarea></label>
        <label class="wide">Notas do mestre<textarea name="gmNotes" rows="3">${escapeHtml(entry.gmNotes || "")}</textarea></label>
      `,
      zone: `
        <label class="wide">Nome<input name="label" required value="${escapeHtml(entry.label || "Zona")}" /></label>
        <label>Tipo<select name="type">${["danger", "cover", "hazard", "objective", "neutral"].map((value) => `<option value="${value}" ${entry.type === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
        <label>Formato<select name="shape">${["rectangle", "circle", "line", "cone"].map((value) => `<option value="${value}" ${entry.shape === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
        ${positionFields}
        <label>Largura<input name="width" type="number" min="1" max="${escapeHtml(scene.columns || 60)}" value="${escapeHtml(entry.width || 1)}" /></label>
        <label>Altura<input name="height" type="number" min="1" max="${escapeHtml(scene.rows || 60)}" value="${escapeHtml(entry.height || 1)}" /></label>
        <label>Direcao<select name="direction">${["", "east", "west", "north", "south"].map((value) => `<option value="${value}" ${entry.direction === value ? "selected" : ""}>${escapeHtml(value || "livre")}</option>`).join("")}</select></label>
        <label>Opacidade<input name="opacity" type="range" min="0" max="1" step="0.05" value="${escapeHtml(entry.opacity ?? 0.32)}" /></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(entry.color || (entry.type === "cover" ? "#35d4ff" : "#ff4d63"))}" /></label>
        <label>Duracao<input name="duration" value="${escapeHtml(entry.duration || "")}" /></label>
        ${visibilityFields}
        <label class="wide">Descricao<textarea name="description" rows="3">${escapeHtml(entry.description || entry.notes || "")}</textarea></label>
        <label class="wide">Efeito mecanico<textarea name="mechanicalEffect" rows="3">${escapeHtml(entry.mechanicalEffect || "")}</textarea></label>
      `,
      area: `
        <label class="wide">Nome<input name="label" required value="${escapeHtml(entry.label || "Area")}" /></label>
        <label>Tipo<select name="type">${["circle", "cone", "line"].map((value) => `<option value="${value}" ${entry.type === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
        ${positionFields}
        <label>Raio<input name="radius" type="number" min="0" value="${escapeHtml(entry.radius ?? 2)}" /></label>
        <label>Comprimento<input name="length" type="number" min="1" value="${escapeHtml(entry.length || 4)}" /></label>
        <label>Largura<input name="width" type="number" min="1" value="${escapeHtml(entry.width || 1)}" /></label>
        <label>Direcao<select name="direction">${["east", "west", "north", "south"].map((value) => `<option value="${value}" ${entry.direction === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(entry.color || "#9b4dff")}" /></label>
        <label>Origem<input name="source" value="${escapeHtml(entry.source || "")}" /></label>
        ${visibilityFields}
      `,
      token: `
        <label class="wide">Nome<input name="name" required value="${escapeHtml(entry.name || "Token")}" /></label>
        <label>Tipo<select name="entityType">${["character", "monster", "object", "npc", "marker"].map((value) => `<option value="${value}" ${entry.entityType === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></label>
        <label>ID vinculado<input name="entityId" value="${escapeHtml(entry.entityId || "")}" /></label>
        ${positionFields}
        <label>Tamanho<input name="size" type="number" min="1" max="6" value="${escapeHtml(entry.size || 1)}" /></label>
        <label>Movimento<input name="movement" type="number" min="0" value="${escapeHtml(entry.metadata?.movement || 0)}" /></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(entry.color || "#39cfff")}" /></label>
        <label class="wide">Imagem<input name="image" value="${escapeHtml(entry.image || "")}" /></label>
        <label class="check"><input type="checkbox" name="hidden" ${entry.hidden ? "checked" : ""} /> Oculto</label>
        <label class="check"><input type="checkbox" name="locked" ${entry.locked ? "checked" : ""} /> Travado</label>
        <label class="wide">Notas<textarea name="notes" rows="3">${escapeHtml(entry.metadata?.notes || "")}</textarea></label>
      `,
    };
    const title = { objective: "Objetivo", zone: "Zona", area: "Area", token: "Token" }[kind] || "Elemento";
    return `
      <form class="vtt-editor-entry-form" data-vtt-scene-editor-entry-form>
        ${commonHidden}
        <h4>${escapeHtml(title)} selecionado</h4>
        ${formByKind[kind] || ""}
        <footer>
          <button type="submit">Salvar elemento</button>
          <button type="button" class="danger" data-vtt-scene-editor-remove="${escapeHtml(kind)}" data-entry-id="${escapeHtml(entry.id)}">Remover</button>
        </footer>
      </form>
    `;
  }

  renderSceneEditorModal(room = this.activeRoomSnapshot()) {
    if (!this.sceneEditor) return "";
    const scenes = room.sceneList?.length ? room.sceneList : [room.scene || {}];
    const scene = this.sceneEditorScene(room);
    return `
      <div class="vtt-modal-backdrop vtt-editor-backdrop" data-vtt-modal-close="scene-editor">
        <section class="vtt-modal vtt-visual-editor-modal solaris-modal-large" role="dialog" aria-modal="true" aria-label="Editor visual de cena">
          <header>
            <div>
              <span>fase 14</span>
              <h2>Editor Visual de Cena</h2>
            </div>
            <div class="vtt-editor-header-actions">
              <button type="button" data-vtt-scene-editor-action="new">Nova</button>
              <button type="button" data-vtt-scene-editor-action="duplicate" ${scene?.id ? "" : "disabled"}>Duplicar</button>
              <button type="button" data-vtt-scene-editor-action="export" ${scene?.id ? "" : "disabled"}>Exportar</button>
              <button type="button" data-vtt-modal-close="scene-editor">Fechar</button>
            </div>
          </header>
          <div class="vtt-visual-editor">
            <aside class="vtt-editor-sidebar">
              <strong>Cenas</strong>
              <div class="vtt-editor-scroll">
                ${scenes.map((entry) => `
                  <button type="button" class="${entry.id === scene.id ? "active" : ""}" data-vtt-scene-editor-select="${escapeHtml(entry.id)}">
                    <span>${escapeHtml(entry.name || "Cena sem nome")}</span>
                    <small>${entry.id === room.activeSceneId ? "ativa" : `${escapeHtml(entry.columns || 12)}x${escapeHtml(entry.rows || 8)}`}</small>
                  </button>
                `).join("") || "<small>Nenhuma cena salva.</small>"}
              </div>
            </aside>
            <section class="vtt-editor-canvas">
              ${this.renderEditorScenePreview(scene)}
              <div class="vtt-editor-canvas-actions">
                <button type="button" data-vtt-scene-editor-action="add-objective">Adicionar objetivo</button>
                <button type="button" data-vtt-scene-editor-action="add-danger">Zona de perigo</button>
                <button type="button" data-vtt-scene-editor-action="add-cover">Cobertura</button>
                <button type="button" data-vtt-scene-editor-action="add-area">Area de efeito</button>
                <button type="button" data-vtt-scene-editor-action="add-token">Adicionar token</button>
                <button type="button" data-vtt-scene-editor-action="switch" ${scene?.id ? "" : "disabled"}>Tornar ativa</button>
              </div>
              <div class="vtt-editor-lists">
                <article>
                  <strong>Objetivos</strong>
                  ${(scene.objectives || []).map((objective) => `
                    <div>
                      <span>${escapeHtml(objective.title || objective.label || "Objetivo")}</span>
                      <small>${escapeHtml(objective.progressCurrent ?? 0)}/${escapeHtml(objective.progressMax ?? 1)}</small>
                      <button type="button" data-vtt-scene-editor-select-entry="objective" data-entry-id="${escapeHtml(objective.id)}">Editar</button>
                      <button type="button" data-vtt-scene-editor-remove="objective" data-entry-id="${escapeHtml(objective.id)}">Remover</button>
                    </div>
                  `).join("") || "<small>Nenhum objetivo.</small>"}
                </article>
                <article>
                  <strong>Zonas</strong>
                  ${(scene.zones || []).map((zone) => `
                    <div>
                      <span>${escapeHtml(zone.label || "Zona")}</span>
                      <small>${escapeHtml(zone.type || "zona")} ${escapeHtml(zone.width || 1)}x${escapeHtml(zone.height || 1)}</small>
                      <button type="button" data-vtt-scene-editor-select-entry="zone" data-entry-id="${escapeHtml(zone.id)}">Editar</button>
                      <button type="button" data-vtt-scene-editor-remove="zone" data-entry-id="${escapeHtml(zone.id)}">Remover</button>
                    </div>
                  `).join("") || "<small>Nenhuma zona.</small>"}
                </article>
                <article>
                  <strong>Areas</strong>
                  ${(scene.areas || []).map((area) => `
                    <div>
                      <span>${escapeHtml(area.label || "Area")}</span>
                      <small>${escapeHtml(area.type || "area")} ${escapeHtml(gridLabel(area.x, area.y))}</small>
                      <button type="button" data-vtt-scene-editor-select-entry="area" data-entry-id="${escapeHtml(area.id)}">Editar</button>
                      <button type="button" data-vtt-scene-editor-remove="area" data-entry-id="${escapeHtml(area.id)}">Remover</button>
                    </div>
                  `).join("") || "<small>Nenhuma area.</small>"}
                </article>
                <article>
                  <strong>Tokens</strong>
                  ${(scene.tokens || []).map((token) => `
                    <div>
                      <span>${escapeHtml(token.name || "Token")}</span>
                      <small>${escapeHtml(gridLabel(token.x, token.y))}</small>
                      <button type="button" data-vtt-scene-editor-select-entry="token" data-entry-id="${escapeHtml(token.id)}">Editar</button>
                      <button type="button" data-vtt-scene-editor-remove="token" data-entry-id="${escapeHtml(token.id)}">Remover</button>
                    </div>
                  `).join("") || "<small>Nenhum token.</small>"}
                </article>
              </div>
            </section>
            <aside class="vtt-editor-properties">
              <form data-vtt-scene-editor-form>
                <input type="hidden" name="id" value="${escapeHtml(scene.id || "")}" />
                <label>Nome<input name="name" required value="${escapeHtml(scene.name || "Nova cena Solaris")}" /></label>
                <label class="wide">Imagem/mapa<input name="mapImage" value="${escapeHtml(scene.mapImage || "")}" placeholder="URL ou data URL do mapa" /></label>
                <label>Colunas<input name="columns" type="number" min="4" max="60" value="${escapeHtml(scene.columns || 12)}" /></label>
                <label>Linhas<input name="rows" type="number" min="4" max="60" value="${escapeHtml(scene.rows || 8)}" /></label>
                <label>Metros/casa<input name="metersPerCell" type="number" min="0.5" max="12" step="0.5" value="${escapeHtml(scene.metersPerCell || 1.5)}" /></label>
                <label>Opacidade grid<input name="gridOpacity" type="range" min="0" max="1" step="0.05" value="${escapeHtml(scene.gridOpacity ?? 0.38)}" /></label>
                <label>Cor grid<input name="gridColor" type="color" value="${escapeHtml(scene.gridColor || "#1aa8ff")}" /></label>
                <label>Iluminacao<input name="lighting" value="${escapeHtml(scene.lighting || "")}" /></label>
                <label>Clima<input name="climate" value="${escapeHtml(scene.climate || "")}" /></label>
                <label>Perigo<input name="danger" value="${escapeHtml(scene.danger || "")}" /></label>
                <label class="check"><input type="checkbox" name="gridVisible" ${scene.gridVisible !== false ? "checked" : ""} /> Grid visivel</label>
                <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(scene.description || scene.notes || "")}</textarea></label>
                <label class="wide">Notas publicas<textarea name="publicNotes" rows="3">${escapeHtml(scene.publicNotes || "")}</textarea></label>
                <label class="wide">Notas do mestre<textarea name="gmNotes" rows="4">${escapeHtml(scene.gmNotes || "")}</textarea></label>
                <footer>
                  <button type="submit">Salvar cena</button>
                  <button type="button" data-vtt-scene-editor-action="switch" ${scene?.id ? "" : "disabled"}>Ativar</button>
                </footer>
              </form>
              ${this.renderSceneEditorElementForm(scene)}
            </aside>
          </div>
        </section>
      </div>
    `;
  }

  renderEncounterEditorModal(room = this.activeRoomSnapshot()) {
    if (!this.encounterEditor) return "";
    const encounters = room.preparedEncounters || [];
    const encounter = this.encounterEditorEncounter(room);
    const scenes = room.sceneList?.length ? room.sceneList : [room.scene || {}];
    const linkedScene = scenes.find((scene) => scene.id === encounter.sceneId) || room.scene || scenes[0] || {};
    const catalog = (this.options.getMonsterCatalog() || []).slice(0, 80);
    const monsters = encounter.monsters || [];
    const balance = encounter.balance || estimateEncounterBalance({
      monsters: monsters.map((monster) => monster.snapshot || monster),
      characters: (room.characters || []).map((character) => character.snapshot || character),
    });
    return `
      <div class="vtt-modal-backdrop vtt-editor-backdrop" data-vtt-modal-close="encounter-editor">
        <section class="vtt-modal vtt-visual-editor-modal solaris-modal-large" role="dialog" aria-modal="true" aria-label="Editor de encontro">
          <header>
            <div>
              <span>fase 12</span>
              <h2>Editor de Encontros</h2>
            </div>
            <div class="vtt-editor-header-actions">
              <button type="button" data-vtt-encounter-editor-action="new">Novo</button>
              <button type="button" data-vtt-encounter-editor-action="duplicate" ${encounter?.id ? "" : "disabled"}>Duplicar</button>
              <button type="button" data-vtt-gm-start-encounter="${escapeHtml(encounter.id || "")}" ${encounter?.id ? "" : "disabled"}>Iniciar</button>
              <button type="button" data-vtt-modal-close="encounter-editor">Fechar</button>
            </div>
          </header>
          <div class="vtt-visual-editor vtt-encounter-editor">
            <aside class="vtt-editor-sidebar">
              <strong>Encontros</strong>
              <div class="vtt-editor-scroll">
                ${encounters.map((entry) => `
                  <button type="button" class="${entry.id === encounter.id ? "active" : ""}" data-vtt-encounter-editor-select="${escapeHtml(entry.id)}">
                    <span>${escapeHtml(entry.name || "Encontro")}</span>
                    <small>${escapeHtml(entry.estimatedDifficulty || entry.difficulty || entry.status || "preparado")}</small>
                  </button>
                `).join("") || "<small>Nenhum encontro salvo.</small>"}
              </div>
            </aside>
            <section class="vtt-editor-canvas">
              <div class="vtt-editor-balance ${normalizeSearch(balance.classification || "moderado")}">
                <div>
                  <span>Dificuldade estimada</span>
                  <strong>${escapeHtml(balance.classification || "Moderado")}</strong>
                </div>
                <div>
                  <span>Pressao</span>
                  <strong>${escapeHtml(balance.totalThreat || balance.monsterThreat || balance.threat || 0)} / ${escapeHtml(balance.partyBudget || balance.partyThreat || 0)}</strong>
                </div>
                <p>${escapeHtml((balance.warnings || []).join(" ") || "Sem alertas de balanceamento.")}</p>
              </div>
              ${this.renderEditorScenePreview(linkedScene)}
              <div class="vtt-editor-lists">
                <article class="wide">
                  <strong>Monstros do encontro</strong>
                  ${monsters.map((monster, index) => {
                    const snapshot = monster.snapshot || monster;
                    const position = (encounter.initialPositions || [])[index] || {};
                    return `
                      <div>
                        <span>${escapeHtml(snapshot.name || monster.name || "Monstro")}</span>
                        <small>Tier ${escapeHtml(snapshot.tier || "-")} / ${escapeHtml(gridLabel(position.x || index + 2, position.y || 2))}</small>
                        <button type="button" data-vtt-encounter-remove-monster="${escapeHtml(index)}">Remover</button>
                      </div>
                    `;
                  }).join("") || "<small>Nenhuma criatura no encontro.</small>"}
                </article>
              </div>
              <div class="vtt-editor-canvas-actions">
                <select data-vtt-encounter-monster-select>
                  ${catalog.map((monster) => `<option value="${escapeHtml(monster.id)}">${escapeHtml(monster.name)}${monster.tier ? ` / Tier ${escapeHtml(monster.tier)}` : ""}</option>`).join("")}
                </select>
                <button type="button" data-vtt-encounter-editor-action="add-monster" ${catalog.length ? "" : "disabled"}>Adicionar monstro</button>
              </div>
            </section>
            <aside class="vtt-editor-properties">
              <form data-vtt-encounter-editor-form>
                <input type="hidden" name="id" value="${escapeHtml(encounter.id || "")}" />
                <label>Nome<input name="name" required value="${escapeHtml(encounter.name || "Novo encontro")}" /></label>
                <label>Cena vinculada<select name="sceneId">
                  <option value="">Cena ativa</option>
                  ${scenes.map((scene) => `<option value="${escapeHtml(scene.id)}" ${scene.id === encounter.sceneId ? "selected" : ""}>${escapeHtml(scene.name || "Cena")}</option>`).join("")}
                </select></label>
                <label>Dificuldade desejada<select name="difficulty">
                  ${["facil","moderado","dificil","mortal","boss"].map((value) => `<option value="${value}" ${encounter.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}
                </select></label>
                <label>Status<select name="status">
                  ${["prepared","active","completed","archived"].map((value) => `<option value="${value}" ${encounter.status === value ? "selected" : ""}>${value}</option>`).join("")}
                </select></label>
                <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(encounter.description || "")}</textarea></label>
                <label class="wide">Notas publicas<textarea name="publicNotes" rows="3">${escapeHtml(encounter.publicNotes || "")}</textarea></label>
                <label class="wide">Notas secretas<textarea name="secretNotes" rows="4">${escapeHtml(encounter.secretNotes || encounter.notes || "")}</textarea></label>
                <label class="wide">Recompensas<textarea name="rewards" rows="3">${escapeHtml(encounter.rewards?.notes || "")}</textarea></label>
                <footer>
                  <button type="submit">Salvar encontro</button>
                  <button type="button" data-vtt-gm-start-encounter="${escapeHtml(encounter.id || "")}" ${encounter?.id ? "" : "disabled"}>Iniciar</button>
                </footer>
              </form>
            </aside>
          </div>
        </section>
      </div>
    `;
  }

  renderReportPreviewModal(room = this.activeRoomSnapshot(), combat = normalizeCombatState(room, this.options.getCurrentCharacter())) {
    if (!this.reportPreviewOpen) return "";
    const optionLabels = {
      includeFullChat: "Chat completo",
      includeSecretNotes: "Notas secretas",
      includeTechnicalLogs: "Logs tecnicos",
      includeTransactions: "Transacoes",
      includeCombat: "Combate",
      includeLoot: "Loot",
      includeCounters: "Contadores",
      includeEnvironment: "Ambiente",
      includePending: "Pendencias",
      includeScenes: "Cenas",
      includeEncounters: "Encontros",
      includeObjectives: "Objetivos",
      includeCounters: "Contadores",
      includeEnvironment: "Ambiente",
      includePending: "Pendencias",
      includeScenes: "Cenas",
      includeEncounters: "Encontros",
      includeObjectives: "Objetivos",
    };
    const markdown = this.buildGmReport(room, combat, this.reportOptions);
    return `
      <div class="vtt-modal-backdrop vtt-editor-backdrop" data-vtt-modal-close="report-preview">
        <section class="vtt-modal vtt-report-preview-modal solaris-modal-large" role="dialog" aria-modal="true" aria-label="Previa do relatorio">
          <header>
            <div>
              <span>relatorio de sessao</span>
              <h2>Previa antes de exportar</h2>
            </div>
            <div class="vtt-editor-header-actions">
              <button type="button" data-vtt-report-action="copy">Copiar</button>
              <button type="button" data-vtt-report-action="download">Baixar .md</button>
              <button type="button" data-vtt-report-action="html">Baixar .html</button>
              <button type="button" data-vtt-report-action="save">Salvar na campanha</button>
              <button type="button" data-vtt-modal-close="report-preview">Fechar</button>
            </div>
          </header>
          <div class="vtt-report-preview-layout">
            <aside class="vtt-report-options">
              <strong>Conteudo</strong>
              ${Object.entries(optionLabels).map(([key, label]) => `
                <label><input type="checkbox" data-vtt-report-option="${escapeHtml(key)}" ${this.reportOptions[key] ? "checked" : ""} /> ${escapeHtml(label)}</label>
              `).join("")}
              <strong>Relatorios salvos</strong>
              <div class="vtt-editor-scroll">
                ${(room.sessionReports || []).slice(0, 12).map((report) => `
                  <article>
                    <span>${escapeHtml(report.title || "Relatorio")}</span>
                    <small>${escapeHtml(new Date(report.createdAt || report.updatedAt || Date.now()).toLocaleString("pt-BR"))}</small>
                  </article>
                `).join("") || "<small>Nenhum relatorio salvo.</small>"}
              </div>
            </aside>
            <pre class="vtt-report-markdown">${escapeHtml(markdown)}</pre>
          </div>
        </section>
      </div>
    `;
  }

  renderCampaignsHome() {
    const active = this.activeCampaign();
    return `
      <section class="vtt-shell vtt-campaign-home solaris-shell solaris-screen-campaigns" aria-label="Minhas Campanhas Solaris">
        <header class="vtt-campaign-home-hero solaris-topbar">
          <div class="vtt-brand">
            <span class="vtt-brand-mark" aria-hidden="true"></span>
            <div>
              <strong>Solaris Tabletop Alpha</strong>
              <small>Minhas Campanhas</small>
            </div>
          </div>
          <div class="vtt-campaign-home-actions">
            <button type="button" data-vtt-action="new-campaign">Nova Campanha</button>
            <button type="button" data-vtt-action="import-session">Importar Campanha</button>
            <button type="button" data-vtt-action="go-table" ${active ? "" : "disabled"}>Voltar para Mesa</button>
          </div>
        </header>
        <main class="vtt-campaign-home-main solaris-main-stage">
          <section class="vtt-campaign-home-list solaris-panel">
            <div class="vtt-panel-heading">
              <h3>Campanhas salvas</h3>
              <span>${this.campaigns.length}</span>
            </div>
            <div class="vtt-campaign-card-grid">
              ${this.campaigns.length ? this.campaigns.map((campaign) => {
                const stats = campaignStats(campaign);
                const session = campaign.sessions[0];
                return `
                  <article class="vtt-campaign-card ${campaign.id === this.activeCampaignId ? "active" : ""}">
                    <header>
                      <div>
                        <small>${escapeHtml(campaign.systemName || "Guerra Solar / Solaris")}</small>
                        <h3>${escapeHtml(campaign.name)}</h3>
                      </div>
                      <span>${escapeHtml(campaign.version || "1.0.0")}</span>
                    </header>
                    <p>${escapeHtml(campaign.description || "Campanha sem descricao.")}</p>
                    <dl>
                      <div><dt>Ultima sessao</dt><dd>${escapeHtml(stats.lastSession)}</dd></div>
                      <div><dt>Criada em</dt><dd>${escapeHtml(new Date(campaign.createdAt).toLocaleDateString("pt-BR"))}</dd></div>
                      <div><dt>Ultimo save</dt><dd>${escapeHtml(new Date(campaign.updatedAt).toLocaleString("pt-BR"))}</dd></div>
                      <div><dt>Sessoes</dt><dd>${escapeHtml(stats.sessions)}</dd></div>
                      <div><dt>Cenas</dt><dd>${escapeHtml(stats.scenes)}</dd></div>
                      <div><dt>Personagens</dt><dd>${escapeHtml(stats.characters)}</dd></div>
                      <div><dt>Autosaves</dt><dd>${escapeHtml(stats.autosaves)}</dd></div>
                      <div><dt>Snapshots</dt><dd>${escapeHtml(stats.snapshots)}</dd></div>
                    </dl>
                    <footer>
                      <button type="button" data-vtt-load-campaign="${escapeHtml(campaign.id)}" data-vtt-load-session="${escapeHtml(session?.roomId || "")}" ${session ? "" : "disabled"}>Continuar</button>
                      <button type="button" data-vtt-edit-campaign="${escapeHtml(campaign.id)}">Detalhes</button>
                      <button type="button" data-vtt-duplicate-campaign="${escapeHtml(campaign.id)}">Duplicar</button>
                      <button type="button" data-vtt-export-campaign="${escapeHtml(campaign.id)}">Exportar</button>
                      <button type="button" class="danger" data-vtt-delete-campaign="${escapeHtml(campaign.id)}">Excluir</button>
                    </footer>
                  </article>
                `;
              }).join("") : `
                <article class="vtt-empty-campaigns">
                  <h3>Nenhuma campanha criada ainda</h3>
                  <p>Crie uma campanha para salvar cenas, encontros, notas, contadores, snapshots e relatórios.</p>
                  <button type="button" data-vtt-action="new-campaign">Criar primeira campanha</button>
                </article>
              `}
            </div>
          </section>
          <aside class="vtt-campaign-home-aside solaris-sidebar">
            <article>
              <h3>Entrada do VTT</h3>
              <p>Use esta tela para preparar campanha antes de abrir a mesa. A ficha online continua separada em Solaris Biblioteca.</p>
              <code>?view=campaigns</code>
              <code>?view=mesaVirtual</code>
              <code>?view=ficha</code>
            </article>
            <article>
              <h3>Backup seguro</h3>
              <p>Exportar campanha gera JSON com sessão, autosaves, notas reveladas/secretas, cenas, encontros e configurações do mestre.</p>
            </article>
          </aside>
        </main>
        ${this.renderCampaignFormModal()}
        ${this.renderRecoveryNotice()}
        <input type="file" accept="application/json,.json" data-vtt-session-import hidden />
      </section>
    `;
  }

  renderLauncherHome() {
    const active = this.activeCampaign();
    const session = active?.sessions?.[0] || null;
    const stats = active ? campaignStats(active) : null;
    const updatedAt = active
      ? new Date(active.updatedAt || active.createdAt || Date.now()).toLocaleString("pt-BR")
      : "Nenhuma campanha recente";
    const statusLabel = this.client.isConnected ? "Servidor local conectado" : "Offline / simulado pronto";
    const statusClass = this.client.isConnected ? "online" : "offline";
    const menuButtons = [
      { action: "launcher-continue", label: "Continuar Campanha", tone: "primary", disabled: !active || !session, meta: active ? active.name : "Nenhuma campanha recente" },
      { action: "launcher-offline", label: "Criar Sala Offline", tone: "green", meta: "Jogar ou preparar neste PC" },
      { action: "launcher-multiplayer", label: "Criar Sala Multijogador Local", tone: "purple", meta: "LAN / Radmin / localhost" },
      { action: "launcher-join", label: "Entrar em Sala Local", tone: "blue", meta: "Conectar ao IP do mestre" },
      { action: "open-campaigns", label: "Minhas Campanhas", tone: "secondary", meta: "Autosaves, snapshots e JSON" },
      { action: "launcher-creator", label: "Criador de Personagem", tone: "secondary", meta: "Ficha e criação" },
      { action: "launcher-library", label: "Biblioteca / Ficha", tone: "secondary", meta: "Personagens e inventário" },
      { action: "launcher-bestiary", label: "Bestiário", tone: "secondary", meta: "Criaturas e fichas" },
      { action: "launcher-gm-shield", label: "Escudo do Mestre", tone: "secondary", meta: "Painel e regras rápidas" },
      { action: "launcher-settings", label: "Configurações", tone: "secondary", meta: "Visual e preferências" },
    ];

    return `
      <section class="solaris-launcher ${this.launcherReducedFx ? "reduced-fx" : ""}" aria-label="Launcher Solaris Tabletop Alpha">
        <div class="solaris-launcher-bg" aria-hidden="true">
          <span class="solaris-launcher-stars"></span>
          <span class="solaris-launcher-world"></span>
          <span class="solaris-launcher-orbit"></span>
          <span class="solaris-launcher-pulse"></span>
          <span class="solaris-launcher-grid"></span>
        </div>
        <main class="solaris-launcher-content">
          <section class="solaris-launcher-brand" aria-label="Solaris Guerra Solar">
            <span class="vtt-brand-mark" aria-hidden="true"></span>
            <div>
              <strong>SOLARIS</strong>
              <small>GUERRA SOLAR</small>
            </div>
          </section>

          <section class="solaris-launcher-hero">
            <span>SOLARIS TABLETOP ALPHA</span>
            <h1>Mesa virtual própria para sobreviver, explorar e lutar no sistema Guerra Solar.</h1>
            <p>Prepare campanhas, jogue offline, conecte jogadores por rede local/Radmin e acesse fichas, bestiário, escudo do mestre e biblioteca oficial.</p>
          </section>

          <section class="solaris-launcher-recent" aria-label="Campanha recente">
            <div>
              <span>Campanha recente</span>
              <h2>${escapeHtml(active?.name || "Nenhuma campanha criada")}</h2>
              <p>${escapeHtml(active?.description || "Crie uma campanha ou abra uma sala offline para começar.")}</p>
            </div>
            <dl>
              <div><dt>Última sessão</dt><dd>${escapeHtml(stats?.lastSession || session?.label || "-")}</dd></div>
              <div><dt>Último save</dt><dd>${escapeHtml(updatedAt)}</dd></div>
              <div><dt>Cenas</dt><dd>${escapeHtml(stats?.scenes ?? 0)}</dd></div>
              <div><dt>Personagens</dt><dd>${escapeHtml(stats?.characters ?? 0)}</dd></div>
            </dl>
          </section>

          <section class="solaris-launcher-status" aria-label="Status do Tabletop">
            <header>
              <span class="${statusClass}"></span>
              <strong>${escapeHtml(statusLabel)}</strong>
            </header>
            <p>Jogadores entram por <code>http://IP-DO-MESTRE:3000</code> quando o servidor local estiver ativo.</p>
            <div>
              <span>${escapeHtml(TABLETOP_APP_VERSION)}</span>
              <span>cache 20260624g</span>
              <span>HTML/CSS/JS</span>
            </div>
          </section>

          <aside class="solaris-launcher-menu" aria-label="Menu principal">
            <header>
              <h2>Menu Principal</h2>
              <p>Escolha como iniciar sua sessão.</p>
            </header>
            <div class="solaris-launcher-actions">
              ${menuButtons.map((button) => `
                <button type="button" class="${escapeHtml(button.tone)}" data-vtt-action="${escapeHtml(button.action)}" ${button.disabled ? "disabled" : ""}>
                  <strong>${escapeHtml(button.label)}</strong>
                  <small>${escapeHtml(button.meta)}</small>
                </button>
              `).join("")}
            </div>
            <footer>
              <span>Offline pronto</span>
              <span>LAN/Radmin</span>
              <span>Mestre + jogadores</span>
            </footer>
          </aside>
        </main>
        ${this.renderLauncherModal()}
        <input type="file" accept="application/json,.json" data-vtt-session-import hidden />
      </section>
    `;
  }

  renderLauncherModal() {
    if (!this.launcherModal) return "";
    const modal = this.launcherModal;
    const multiplayerInstructions = "Para jogar em multijogador local, rode npm run server:vtt no computador do mestre. Mestre: http://localhost:3000. Jogadores: http://IP-DO-MESTRE:3000.";
    const modalBodies = {
      offline: `
        <h3>Criar Sala Offline</h3>
        <p>Você está criando uma sala offline. Ela funciona neste computador, sem servidor, ideal para preparação, jogo presencial ou teste.</p>
        <footer>
          <button type="button" data-vtt-action="launcher-offline-confirm">Criar sala offline</button>
          <button type="button" data-vtt-modal-close="launcher">Cancelar</button>
        </footer>
      `,
      multiplayer: `
        <h3>Criar Sala Multijogador Local</h3>
        <p>Para jogar em multijogador local, rode o servidor do VTT no computador do mestre com <code>npm run server:vtt</code>.</p>
        <dl>
          <div><dt>Mestre</dt><dd>http://localhost:3000</dd></div>
          <div><dt>Jogadores</dt><dd>http://IP-DO-MESTRE:3000</dd></div>
        </dl>
        <footer>
          <button type="button" data-vtt-action="launcher-multiplayer-confirm">Abrir Mesa</button>
          <button type="button" data-vtt-copy="${escapeHtml(multiplayerInstructions)}">Copiar instruções</button>
          <button type="button" data-vtt-modal-close="launcher">Cancelar</button>
        </footer>
      `,
      join: `
        <h3>Entrar em Sala Local</h3>
        <p>Digite o endereço do computador do mestre na rede local ou Radmin.</p>
        <form data-vtt-launcher-join-form>
          <label>Endereço da sala
            <input name="address" type="url" value="${escapeHtml(this.launcherJoinAddress)}" placeholder="http://192.168.0.10:3000" required />
          </label>
          <footer>
            <button type="submit">Entrar</button>
            <button type="button" data-vtt-modal-close="launcher">Cancelar</button>
          </footer>
        </form>
      `,
      settings: `
        <h3>Configurações rápidas</h3>
        <p>Ajustes locais da tela inicial. O app respeita automaticamente <code>prefers-reduced-motion</code>.</p>
        <label class="solaris-launcher-toggle">
          <input type="checkbox" data-vtt-launcher-reduced-fx ${this.launcherReducedFx ? "checked" : ""} />
          Reduzir brilho e animações do fundo
        </label>
        <footer>
          <button type="button" data-vtt-action="launcher-clear-visual-cache">Limpar preferência visual</button>
          <button type="button" data-vtt-modal-close="launcher">Voltar</button>
        </footer>
      `,
    };
    return `
      <div class="vtt-modal-backdrop solaris-launcher-modal-backdrop" data-vtt-modal-close="launcher">
        <section class="solaris-launcher-modal" role="dialog" aria-modal="true">
          ${modalBodies[modal] || ""}
        </section>
      </div>
    `;
  }

  renderCampaignFormModal() {
    if (!this.campaignForm) return "";
    const campaign = this.campaignForm.mode === "edit"
      ? this.campaigns.find((entry) => entry.id === this.campaignForm.campaignId)
      : null;
    return `
      <div class="vtt-modal-backdrop">
        <section class="vtt-modal vtt-form-modal solaris-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>campanha</span>
              <h3>${campaign ? "Editar campanha" : "Nova campanha"}</h3>
            </div>
            <button type="button" data-vtt-modal-close="campaign-form">Fechar</button>
          </header>
          <form class="vtt-dedicated-form" data-vtt-campaign-form>
            <label>Nome da campanha<input name="name" required value="${escapeHtml(campaign?.name || "Nova Campanha Solaris")}" /></label>
            <label>Sistema<input name="systemName" value="${escapeHtml(campaign?.systemName || "Guerra Solar / Solaris")}" /></label>
            <label class="wide">Descricao<textarea name="description" rows="5">${escapeHtml(campaign?.description || "")}</textarea></label>
            <footer>
              <button type="submit">Salvar campanha</button>
              <button type="button" data-vtt-modal-close="campaign-form">Cancelar</button>
            </footer>
          </form>
        </section>
      </div>
    `;
  }

  renderGmFormModal(room) {
    if (!this.gmForm) return "";
    const kind = this.gmForm.kind;
    const id = this.gmForm.id;
    const note = (room.gmNotes || []).find((entry) => entry.id === id) || {};
    const counter = (room.gmCounters || []).find((entry) => entry.id === id) || {};
    const effect = (room.environmentalEffects || []).find((entry) => entry.id === id) || {};
    const scene = (room.sceneList || []).find((entry) => entry.id === id) || room.scene || {};
    const encounter = (room.preparedEncounters || []).find((entry) => entry.id === id) || {};
    const sceneOptions = (room.sceneList || [room.scene || {}]).map((entry) => `<option value="${escapeHtml(entry.id)}">${escapeHtml(entry.name || "Cena")}</option>`).join("");
    const title = {
      note: id ? "Editar nota do mestre" : "Nota do Mestre",
      counter: id ? "Editar contador" : "Contador do Mestre",
      environment: id ? "Editar efeito ambiental" : "Efeito Ambiental",
      scene: id ? "Editar cena" : "Cena",
      encounter: id ? "Editar encontro" : "Encontro Preparado",
    }[kind] || "Formulario";
    const body = {
      note: `
        <label>Titulo<input name="title" required value="${escapeHtml(note.title || "Nova nota secreta")}" /></label>
        <label>Estado<select name="state"><option value="secreta">Secreta</option><option value="revelada" ${note.revealed ? "selected" : ""}>Revelada</option><option value="arquivada">Arquivada</option></select></label>
        <label class="wide">Conteudo<textarea name="body" rows="6">${escapeHtml(note.body || "")}</textarea></label>
        <label>Tags<input name="tags" value="${escapeHtml((note.tags || []).join(", "))}" /></label>
        <label>Cena vinculada<select name="sceneId"><option value="">Nenhuma</option>${sceneOptions}</select></label>
        <label>Vinculo<input name="linkedType" placeholder="NPC, monstro, item..." value="${escapeHtml(note.linkedType || "")}" /></label>
        <label>ID vinculado<input name="linkedId" value="${escapeHtml(note.linkedId || "")}" /></label>
        <label class="check"><input type="checkbox" name="important" ${note.important ? "checked" : ""} /> Importante</label>
        <label class="check"><input type="checkbox" name="visibleToPlayers" ${note.visibleToPlayers ? "checked" : ""} /> Visivel para jogadores</label>
      `,
      counter: `
        <label>Nome<input name="name" required value="${escapeHtml(counter.name || "Contador secreto")}" /></label>
        <label>Tipo<select name="type">${["ameaca","tempo","ritual","alarme","confianca","corrupcao","recursos","customizado"].map((type) => `<option value="${type}" ${counter.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
        <label>Atual<input name="current" type="number" value="${escapeHtml(counter.current ?? 0)}" /></label>
        <label>Maximo<input name="max" type="number" min="1" value="${escapeHtml(counter.max || 6)}" /></label>
        <label>Direcao<select name="direction"><option value="down">Desce</option><option value="up" ${counter.direction === "up" ? "selected" : ""}>Sobe</option></select></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(counter.color || "#a35dff")}" /></label>
        <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(counter.description || "")}</textarea></label>
        <label class="wide">Texto de gatilho<input name="triggerText" value="${escapeHtml(counter.triggerText || "")}" /></label>
        <label class="wide">Ao chegar no limite<input name="limitBehavior" value="${escapeHtml(counter.limitBehavior || "")}" /></label>
        <label class="check"><input type="checkbox" name="visibleToPlayers" ${counter.visibleToPlayers ? "checked" : ""} /> Visivel para jogadores</label>
      `,
      environment: `
        <label>Nome<input name="name" required value="${escapeHtml(effect.name || "Efeito ambiental")}" /></label>
        <label>Tipo<select name="type">${["clima","radiacao","cosmos","gravidade","tecnologia","terror","outro"].map((type) => `<option value="${type}" ${effect.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
        <label>Duracao<input name="duration" value="${escapeHtml(effect.duration || "Cena atual")}" /></label>
        <label>Cena vinculada<select name="sceneId"><option value="">Cena atual</option>${sceneOptions}</select></label>
        <label>Cor<input name="color" type="color" value="${escapeHtml(effect.color || "#35d4ff")}" /></label>
        <label>Icone<input name="icon" value="${escapeHtml(effect.icon || "")}" /></label>
        <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(effect.description || "")}</textarea></label>
        <label class="wide">Efeito mecanico<textarea name="mechanicalEffect" rows="3">${escapeHtml(effect.mechanicalEffect || "")}</textarea></label>
        <label class="check"><input type="checkbox" name="visibleToPlayers" ${effect.visibleToPlayers ? "checked" : ""} /> Visivel para jogadores</label>
      `,
      scene: `
        <label>Nome<input name="name" required value="${escapeHtml(scene.name || "Nova cena")}" /></label>
        <label>Imagem/mapa<input name="mapImage" value="${escapeHtml(scene.mapImage || "")}" /></label>
        <label>Colunas<input name="columns" type="number" min="4" value="${escapeHtml(scene.columns || 12)}" /></label>
        <label>Linhas<input name="rows" type="number" min="4" value="${escapeHtml(scene.rows || 8)}" /></label>
        <label>Metros por casa<input name="metersPerCell" type="number" step="0.5" value="${escapeHtml(scene.metersPerCell || 1.5)}" /></label>
        <label>Iluminacao<input name="lighting" value="${escapeHtml(scene.lighting || "")}" /></label>
        <label>Perigo<input name="danger" value="${escapeHtml(scene.danger || "")}" /></label>
        <label>Clima<input name="climate" value="${escapeHtml(scene.climate || "")}" /></label>
        <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(scene.notes || "")}</textarea></label>
        <label class="wide">Notas do mestre<textarea name="gmNotes" rows="4">${escapeHtml(scene.gmNotes || "")}</textarea></label>
        <label class="check"><input type="checkbox" name="gridVisible" ${scene.gridVisible !== false ? "checked" : ""} /> Grid ligado</label>
      `,
      encounter: `
        <label>Nome<input name="name" required value="${escapeHtml(encounter.name || "Encontro preparado")}" /></label>
        <label>Cena<select name="sceneId"><option value="">Cena ativa</option>${sceneOptions}</select></label>
        <label>Dificuldade<select name="difficulty">${["facil","moderado","dificil","mortal"].map((value) => `<option value="${value}" ${encounter.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        <label>Status<select name="status">${["prepared","active","completed"].map((value) => `<option value="${value}" ${encounter.status === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        <label>Quantidade por monstro<input name="quantity" type="number" min="1" value="1" /></label>
        <label class="wide">Monstros<input name="monsterIds" placeholder="IDs ou nomes separados por virgula" value="${escapeHtml((encounter.monsters || []).map((monster) => monster.definitionId || monster.id || monster.name).join(", "))}" /></label>
        <label class="wide">Descricao<textarea name="description" rows="4">${escapeHtml(encounter.description || "")}</textarea></label>
        <label class="wide">Recompensas<textarea name="rewards" rows="3">${escapeHtml(encounter.rewards?.notes || "")}</textarea></label>
        <label class="wide">Notas secretas<textarea name="notes" rows="4">${escapeHtml(encounter.notes || "")}</textarea></label>
      `,
    }[kind] || "";
    return `
      <div class="vtt-modal-backdrop">
        <section class="vtt-modal vtt-form-modal solaris-modal" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>painel do mestre</span>
              <h3>${escapeHtml(title)}</h3>
            </div>
            <button type="button" data-vtt-modal-close="gm-form">Fechar</button>
          </header>
          <form class="vtt-dedicated-form" data-vtt-gm-form>
            <input type="hidden" name="kind" value="${escapeHtml(kind)}" />
            ${body}
            <footer>
              <button type="submit">Salvar</button>
              ${id && kind === "note" ? `<button type="button" data-vtt-gm-reveal-note="${escapeHtml(id)}">Revelar</button>` : ""}
              <button type="button" data-vtt-modal-close="gm-form">Cancelar</button>
            </footer>
          </form>
        </section>
      </div>
    `;
  }

  renderGmDashboardPanel(room, current, combat) {
    if (!this.gmPanelOpen) return "";
    const isGm = this.isLocalGm(room);
    const tabs = [
      ["overview", "Resumo"],
      ["campaign", "Campanha"],
      ["lore", "Lore"],
      ["scenes", "Cenas"],
      ["encounters", "Encontros"],
      ["notes", "Notas"],
      ["counters", "Contadores"],
      ["environment", "Ambiente"],
      ["shield", "Escudo"],
      ["logs", "Logs"],
    ];
    const tab = this.gmPanelTab || "overview";
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="gm">
        <section class="vtt-modal vtt-gm-modal solaris-modal-large" role="dialog" aria-modal="true">
          <header>
            <div>
              <small>Controle privado da sessao</small>
              <h2>Painel do Mestre</h2>
            </div>
            <button type="button" data-vtt-modal-close="gm">Fechar</button>
          </header>
          ${isGm ? `
            <nav class="vtt-gm-tabs">
              ${tabs.map(([id, label]) => `<button type="button" class="${tab === id ? "active" : ""}" data-vtt-gm-tab="${id}">${label}</button>`).join("")}
            </nav>
            <div class="vtt-gm-body">
              ${tab === "overview" ? this.renderGmOverview(room, current, combat) : ""}
              ${tab === "campaign" ? this.renderGmCampaignTools(room) : ""}
              ${tab === "lore" ? this.renderGmLoreTools(room) : ""}
              ${tab === "scenes" ? this.renderGmScenes(room) : ""}
              ${tab === "encounters" ? this.renderGmEncounters(room) : ""}
              ${tab === "notes" ? this.renderGmNotes(room) : ""}
              ${tab === "counters" ? this.renderGmCounters(room) : ""}
              ${tab === "environment" ? this.renderGmEnvironment(room) : ""}
              ${tab === "shield" ? this.renderGmShield(room) : ""}
              ${tab === "logs" ? this.renderGmLogs(room, combat) : ""}
            </div>
          ` : `
            <div class="vtt-gm-locked">
              <strong>Painel privado do mestre.</strong>
              <span>Jogadores nao veem notas secretas, contadores ocultos nem ferramentas privadas.</span>
            </div>
          `}
          ${isGm ? this.renderGmFormModal(room) : ""}
        </section>
      </div>
    `;
  }

  renderGmOverview(room, current, combat) {
    const pending = (room.approvals || []).filter((approval) => approval.status === "pending").length;
    return `
      <div class="vtt-gm-grid">
        <article class="vtt-gm-card wide">
          <header><h3>Resumo da campanha</h3><span>${escapeHtml(this.activeCampaign()?.name || "Sem campanha")}</span></header>
          <div class="vtt-gm-metrics">
            <span><small>Sala</small><strong>${escapeHtml(room.roomName || room.name)}</strong></span>
            <span><small>Sessao</small><strong>${escapeHtml(room.scene?.name || "Cena atual")}</strong></span>
            <span><small>Combate</small><strong>${combat.active ? `Rodada ${escapeHtml(combat.round || 1)}` : "Inativo"}</strong></span>
            <span><small>Pendencias</small><strong>${pending}</strong></span>
          </div>
          <footer>
            <button type="button" data-vtt-gm-action="save-session">Salvar sessao</button>
            <button type="button" data-vtt-gm-action="snapshot-session">Snapshot</button>
            <button type="button" data-vtt-gm-action="open-scene-editor">Editor de cena</button>
            <button type="button" data-vtt-gm-action="open-encounter-editor">Editor de encontro</button>
            <button type="button" data-vtt-gm-action="open-report-preview">Relatorio</button>
          </footer>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Jogadores</h3><span>${(room.players || []).length}</span></header>
          <div class="vtt-gm-list compact">
            ${(room.players || []).map((player) => `
              <button type="button" data-vtt-gm-open-character="${escapeHtml(player.characterId || "")}">
                <strong>${escapeHtml(player.name)}</strong>
                <small>PV ${escapeHtml(player.pv || 0)}/${escapeHtml(player.pvMax || 0)} - CA ${escapeHtml(player.ca || 0)}</small>
              </button>
            `).join("")}
          </div>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Monstros e NPCs</h3><span>${(room.monsters || []).length}</span></header>
          <div class="vtt-gm-list compact">
            ${(room.monsters || []).map((monster) => `
              <button type="button" data-vtt-open-monster-sheet="${escapeHtml(monster.id)}">
                <strong>${escapeHtml(monster.name)}</strong>
                <small>PV ${escapeHtml(monster.snapshot?.currentPV ?? monster.snapshot?.pv ?? "-")} - CA ${escapeHtml(monster.snapshot?.ca ?? "-")}</small>
              </button>
            `).join("") || "<small>Nenhum monstro ativo.</small>"}
          </div>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Ferramentas rapidas</h3><span>GM</span></header>
          <div class="vtt-gm-actions">
            <button type="button" data-vtt-combat-action="start">Iniciar combate</button>
            <button type="button" data-vtt-combat-action="next">Proximo turno</button>
            <button type="button" data-vtt-map-action="sync-tokens">Sincronizar tokens</button>
            <button type="button" data-vtt-loot-action="create">Criar loot</button>
          </div>
        </article>
      </div>
    `;
  }

  renderGmCampaignTools(room) {
    const missions = room.missions || room.gmState?.missions || [];
    const activeMission = missions.find((mission) => mission.id === room.activeMissionId) || missions[0] || null;
    const resources = room.resourceTracks || room.gmState?.resourceTracks || [];
    const factions = room.factionStates || room.gmState?.factionStates || [];
    const routes = room.travelRoutes || room.gmState?.travelRoutes || [];
    const clocks = room.campaignClocks || room.gmState?.campaignClocks || [];
    const hacking = room.hackingChallenges || room.gmState?.hackingChallenges || [];
    const bases = room.bases || room.gmState?.bases || [];
    const recentEvents = room.gmEvents || room.gmState?.gmEvents || [];
    const missionRisk = activeMission ? computeMissionRisk(activeMission) : null;
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="gm-generate-mission">Gerar missao</button>
        <button type="button" data-vtt-gm-action="gm-create-mission">Criar missao</button>
        <button type="button" data-vtt-gm-action="gm-create-route">Criar rota</button>
        <button type="button" data-vtt-gm-action="gm-create-resource">Criar recurso</button>
        <button type="button" data-vtt-gm-action="gm-create-faction">Criar faccao</button>
        <button type="button" data-vtt-gm-action="gm-create-clock">Criar contador</button>
        <button type="button" data-vtt-gm-action="gm-create-hacking">Criar hacking</button>
        <button type="button" data-vtt-gm-action="gm-create-base">Criar base</button>
      </div>
      <div class="vtt-gm-grid">
        <article class="vtt-gm-card wide">
          <header>
            <h3>Missao ativa</h3>
            <span>${missionRisk ? `${escapeHtml(missionRisk.label)} / risco ${escapeHtml(missionRisk.score)}` : "sem missao"}</span>
          </header>
          ${activeMission ? `
            <div class="vtt-gm-list compact">
              <article class="active">
                <div>
                  <strong>${escapeHtml(activeMission.name)}</strong>
                  <small>${escapeHtml(activeMission.briefing || activeMission.objective || "Sem briefing.")}</small>
                  <em>${escapeHtml(activeMission.phase || "chamado")} - ${escapeHtml(activeMission.riskLevel || "simples")}</em>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-mission-advance="${escapeHtml(activeMission.id)}">Avancar fase</button>
                  <button type="button" data-vtt-gm-mission-complication="${escapeHtml(activeMission.id)}">Complicacao</button>
                  <button type="button" data-vtt-gm-mission-objective="${escapeHtml(activeMission.id)}">Novo objetivo</button>
                </footer>
              </article>
            </div>
          ` : `<small>Nenhuma missao registrada. Gere uma missao para iniciar o arco da sessao.</small>`}
        </article>

        <article class="vtt-gm-card">
          <header><h3>Recursos</h3><span>${resources.length}</span></header>
          <div class="vtt-gm-list compact">
            ${resources.map((resource) => `
              <article>
                <div>
                  <strong>${escapeHtml(resource.name)}</strong>
                  <small>${escapeHtml(resource.current)}/${escapeHtml(resource.max)} ${escapeHtml(resource.unit || "ponto(s)")}</small>
                  <span class="vtt-gm-counter-bar"><i style="width:${pct(resource.current, resource.max)}%"></i></span>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-resource-consume="${escapeHtml(resource.id)}">-</button>
                  <button type="button" data-vtt-gm-resource-restore="${escapeHtml(resource.id)}">+</button>
                </footer>
              </article>
            `).join("") || "<small>Nenhum recurso monitorado.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Faccoes</h3><span>${factions.length}</span></header>
          <div class="vtt-gm-list compact">
            ${factions.map((faction) => `
              <article>
                <div>
                  <strong>${escapeHtml(faction.name)}</strong>
                  <small>Rep. ${escapeHtml(faction.reputation ?? 0)} - ${escapeHtml(faction.relation || "neutro")}</small>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-faction-reputation="${escapeHtml(faction.id)}" data-delta="-1">- Rep</button>
                  <button type="button" data-vtt-gm-faction-reputation="${escapeHtml(faction.id)}" data-delta="1">+ Rep</button>
                </footer>
              </article>
            `).join("") || "<small>Nenhuma faccao registrada.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Viagens</h3><span>${routes.length}</span></header>
          <div class="vtt-gm-list compact">
            ${routes.map((route) => {
              const difficulty = computeTravelDifficulty(route);
              return `
                <article>
                  <div>
                    <strong>${escapeHtml(route.name)}</strong>
                    <small>${escapeHtml(route.origin || "?")} -> ${escapeHtml(route.destination || "?")}</small>
                    <em>${escapeHtml(difficulty.classification)} / dificuldade ${escapeHtml(difficulty.difficulty)}</em>
                  </div>
                  <footer>
                    <button type="button" data-vtt-gm-travel-event="${escapeHtml(route.id)}">Evento</button>
                  </footer>
                </article>
              `;
            }).join("") || "<small>Nenhuma rota de viagem.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Contadores</h3><span>${clocks.length}</span></header>
          <div class="vtt-gm-list compact">
            ${clocks.map((clock) => `
              <article>
                <div>
                  <strong>${escapeHtml(clock.name)}</strong>
                  <small>${escapeHtml(clock.current)}/${escapeHtml(clock.max)} - ${escapeHtml(clock.status || "ativo")}</small>
                  <span class="vtt-gm-counter-bar"><i style="width:${pct(clock.current, clock.max)}%"></i></span>
                </div>
                <footer><button type="button" data-vtt-gm-clock-advance="${escapeHtml(clock.id)}">Avancar</button></footer>
              </article>
            `).join("") || "<small>Nenhum contador de campanha.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Hacking</h3><span>${hacking.length}</span></header>
          <div class="vtt-gm-list compact">
            ${hacking.map((challenge) => `
              <article>
                <div>
                  <strong>${escapeHtml(challenge.name)}</strong>
                  <small>SR ${escapeHtml(challenge.sr)} - nos ${escapeHtml(challenge.progress)}/${escapeHtml(challenge.nodes)}</small>
                  <em>Deteccao ${escapeHtml(challenge.detection)}/${escapeHtml(challenge.detectionMax)}</em>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-hacking-advance="${escapeHtml(challenge.id)}">Sucesso</button>
                  <button type="button" data-vtt-gm-hacking-fail="${escapeHtml(challenge.id)}">Falha</button>
                </footer>
              </article>
            `).join("") || "<small>Nenhum desafio de hacking.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Bases e colonias</h3><span>${bases.length}</span></header>
          <div class="vtt-gm-list compact">
            ${bases.map((base) => `
              <article>
                <div>
                  <strong>${escapeHtml(base.name)}</strong>
                  <small>Seg. ${escapeHtml(base.attributes?.security ?? 0)} / Sup. ${escapeHtml(base.resources?.supplies ?? 0)}</small>
                </div>
                <footer><button type="button" data-vtt-gm-base-event="${escapeHtml(base.id)}">Evento</button></footer>
              </article>
            `).join("") || "<small>Nenhuma base ou colonia.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card">
          <header><h3>Historico GM</h3><span>${recentEvents.length}</span></header>
          <div class="vtt-gm-list compact">
            ${recentEvents.slice(0, 8).map((event) => `
              <article>
                <div>
                  <strong>${escapeHtml(event.targetName || event.type || "Evento")}</strong>
                  <small>${escapeHtml(event.message || "Sem descricao.")}</small>
                </div>
              </article>
            `).join("") || "<small>Nenhum evento de campanha registrado.</small>"}
          </div>
        </article>
      </div>
    `;
  }

  renderGmLoreTools(room) {
    const loreState = hydrateLoreState(room.loreState || {});
    const query = this.loreQuery || "";
    const filters = {
      type: this.loreTypeFilter === "all" ? "" : this.loreTypeFilter,
      importance: this.loreImportanceFilter === "all" ? "" : this.loreImportanceFilter,
    };
    const filtered = query
      ? searchLoreEntries(loreState, query, filters)
      : rankLoreSearchResults(filterLoreEntries(loreState, filters), "");
    const pinned = loreState.entries.filter((entry) => loreState.pinnedLoreEntries.includes(entry.id) || entry.pinned);
    const relationCount = loreState.relations.length;
    const typeOptions = ["all", ...Object.values(LORE_ENTRY_TYPES)];
    const importanceOptions = ["all", ...Object.values(LORE_IMPORTANCE_LEVELS)];
    const selected = filtered[0] || pinned[0] || loreState.entries[0] || null;
    const selectedRelations = selected
      ? loreState.relations.filter((relation) => relation.fromId === selected.id || relation.toId === selected.id)
      : [];
    const entryById = new Map(loreState.entries.map((entry) => [entry.id, entry]));
    return `
      <div class="vtt-gm-toolbar vtt-lore-toolbar">
        <label>Buscar lore<input value="${escapeHtml(query)}" data-vtt-lore-filter="query" placeholder="Tarantus, faccao, Uryon..." /></label>
        <label>Tipo<select data-vtt-lore-filter="type">${typeOptions.map((type) => `<option value="${escapeHtml(type)}" ${this.loreTypeFilter === type ? "selected" : ""}>${escapeHtml(type === "all" ? "Todos" : type)}</option>`).join("")}</select></label>
        <label>Importancia<select data-vtt-lore-filter="importance">${importanceOptions.map((importance) => `<option value="${escapeHtml(importance)}" ${this.loreImportanceFilter === importance ? "selected" : ""}>${escapeHtml(importance === "all" ? "Todas" : importance)}</option>`).join("")}</select></label>
      </div>
      <div class="vtt-gm-grid vtt-lore-grid">
        <article class="vtt-gm-card">
          <header><h3>Pins de lore</h3><span>${pinned.length}</span></header>
          <div class="vtt-gm-list compact">
            ${pinned.slice(0, 8).map((entry) => `
              <article>
                <div>
                  <strong>${escapeHtml(entry.title)}</strong>
                  <small>${escapeHtml(entry.type)} - ${escapeHtml(entry.importance)}</small>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-lore-action="unpin" data-lore-id="${escapeHtml(entry.id)}">Desfixar</button>
                </footer>
              </article>
            `).join("") || "<small>Nenhuma lore pinada.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card wide">
          <header><h3>Compendio do Livro 4</h3><span>${filtered.length}/${loreState.entries.length}</span></header>
          <div class="vtt-gm-list compact vtt-lore-list">
            ${filtered.slice(0, 12).map((entry) => `
              <article class="${entry.id === selected?.id ? "active" : ""}">
                <div>
                  <strong>${escapeHtml(entry.title)}</strong>
                  <small>${escapeHtml(entry.summary || entry.description || "Sem resumo.")}</small>
                  <em>${escapeHtml(entry.type)} - ${escapeHtml(entry.secretLevel)} - ${entry.needsReview ? "needsReview" : "fonte atual"}</em>
                </div>
                <footer>
                  <button type="button" data-vtt-gm-lore-action="pin" data-lore-id="${escapeHtml(entry.id)}">Pinar</button>
                  <button type="button" data-vtt-gm-lore-action="discover" data-lore-id="${escapeHtml(entry.id)}">Descoberto</button>
                  <button type="button" data-vtt-gm-lore-action="secret" data-lore-id="${escapeHtml(entry.id)}">Segredo</button>
                  <button type="button" data-vtt-gm-lore-action="note" data-lore-id="${escapeHtml(entry.id)}">Nota</button>
                  <button type="button" data-vtt-gm-lore-action="report" data-lore-id="${escapeHtml(entry.id)}">Relatorio</button>
                </footer>
              </article>
            `).join("") || "<small>Nenhuma entrada encontrada.</small>"}
          </div>
        </article>

        <article class="vtt-gm-card wide">
          <header><h3>${escapeHtml(selected?.title || "Entrada")}</h3><span>${escapeHtml(selected?.type || "lore")}</span></header>
          ${selected ? `
            <p>${escapeHtml(selected.longText || selected.description || selected.summary)}</p>
            <div class="tag-row">${(selected.tags || []).slice(0, 8).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
            <div class="vtt-gm-actions">
              <button type="button" data-vtt-gm-lore-action="mission" data-lore-id="${escapeHtml(selected.id)}">Criar missao</button>
              <button type="button" data-vtt-gm-lore-action="scene" data-lore-id="${escapeHtml(selected.id)}">Criar cena</button>
              <button type="button" data-vtt-gm-lore-action="encounter" data-lore-id="${escapeHtml(selected.id)}">Criar encontro</button>
              <button type="button" data-vtt-gm-lore-action="clock" data-lore-id="${escapeHtml(selected.id)}">Criar contador</button>
              <button type="button" data-vtt-gm-lore-action="faction" data-lore-id="${escapeHtml(selected.id)}">Virar faccao</button>
              <button type="button" data-vtt-gm-lore-action="npc" data-lore-id="${escapeHtml(selected.id)}">Nota de NPC</button>
            </div>
          ` : "<small>Selecione uma entrada pelo filtro.</small>"}
        </article>

        <article class="vtt-gm-card">
          <header><h3>Relacoes</h3><span>${relationCount}</span></header>
          <div class="vtt-gm-list compact">
            ${selectedRelations.slice(0, 8).map((relation) => {
              const relatedId = relation.fromId === selected?.id ? relation.toId : relation.fromId;
              const related = entryById.get(relatedId);
              return `
                <article>
                  <div>
                    <strong>${escapeHtml(related?.title || relatedId)}</strong>
                    <small>${escapeHtml(relation.type)} ${relation.secret ? "- segredo" : ""}</small>
                  </div>
                </article>
              `;
            }).join("") || "<small>Sem relacoes para a entrada selecionada.</small>"}
          </div>
        </article>
      </div>
    `;
  }

  renderGmScenes(room) {
    const sceneList = room.sceneList?.length ? room.sceneList : [room.scene || {}];
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="open-scene-editor">Editor visual</button>
        <button type="button" data-vtt-gm-action="create-scene">Criar cena</button>
        <button type="button" data-vtt-gm-action="save-current-scene">Salvar cena atual</button>
      </div>
      <div class="vtt-gm-list">
        ${sceneList.map((scene) => `
          <article class="${scene.id === room.activeSceneId ? "active" : ""}">
            <div>
              <strong>${escapeHtml(scene.name || "Cena sem nome")}</strong>
              <small>${escapeHtml(scene.notes || "Sem resumo.")}</small>
            </div>
            <footer>
              <button type="button" data-vtt-open-scene-editor="${escapeHtml(scene.id)}">Editor</button>
              <button type="button" data-vtt-gm-edit="scene" data-vtt-gm-edit-id="${escapeHtml(scene.id)}">Rapido</button>
              <button type="button" data-vtt-gm-switch-scene="${escapeHtml(scene.id)}">Trocar</button>
              <button type="button" class="danger" data-vtt-gm-delete-scene="${escapeHtml(scene.id)}" ${scene.id === room.activeSceneId ? "disabled" : ""}>Excluir</button>
            </footer>
          </article>
        `).join("")}
      </div>
    `;
  }

  renderGmEncounters(room) {
    const suggestions = this.encounterSuggestions();
    const tierOptions = ["all", "F", "E", "D", "C", "B", "A", "S"];
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="open-encounter-editor">Editor visual</button>
        <button type="button" data-vtt-gm-action="create-encounter">Criar encontro</button>
        <button type="button" data-vtt-gm-action="generate-encounter">Salvar gerado</button>
        <button type="button" data-vtt-gm-action="generate-encounter-now">Adicionar à cena agora</button>
      </div>
      <section class="vtt-encounter-generator">
        <header>
          <div>
            <h3>Gerador de Encontros</h3>
            <small>Usa o bestiario atual carregado na Biblioteca Solaris.</small>
          </div>
          <strong>${suggestions.length} sugestao(oes)</strong>
        </header>
        <div class="vtt-generator-filters">
          <label>Buscar<input value="${escapeHtml(this.encounterFilters.query)}" data-vtt-encounter-filter="query" /></label>
          <label>Tier<select data-vtt-encounter-filter="tier">${tierOptions.map((tier) => `<option value="${tier}" ${this.encounterFilters.tier === tier ? "selected" : ""}>${tier === "all" ? "Todos" : tier}</option>`).join("")}</select></label>
          <label>Tipo<input value="${escapeHtml(this.encounterFilters.type === "all" ? "" : this.encounterFilters.type)}" placeholder="alienigena, constructo..." data-vtt-encounter-filter="type" /></label>
          <label>Habitat<input value="${escapeHtml(this.encounterFilters.habitat === "all" ? "" : this.encounterFilters.habitat)}" placeholder="ruina, floresta..." data-vtt-encounter-filter="habitat" /></label>
          <label>Papel<input value="${escapeHtml(this.encounterFilters.role === "all" ? "" : this.encounterFilters.role)}" placeholder="brutamontes, suporte..." data-vtt-encounter-filter="role" /></label>
          <label>Facção<input value="${escapeHtml(this.encounterFilters.faction === "all" ? "" : this.encounterFilters.faction)}" placeholder="Xirax..." data-vtt-encounter-filter="faction" /></label>
          <label>Qtd.<input type="number" min="1" max="12" value="${escapeHtml(this.encounterFilters.quantity)}" data-vtt-encounter-filter="quantity" /></label>
          <label>Dificuldade<select data-vtt-encounter-filter="difficulty">${["facil","moderado","dificil","mortal"].map((value) => `<option value="${value}" ${this.encounterFilters.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        </div>
        <div class="vtt-generator-results">
          ${suggestions.slice(0, 6).map((monster) => `
            <article>
              ${monster.image || monster.imageDataUrl ? `<img src="${escapeHtml(monster.image || monster.imageDataUrl)}" alt="" />` : `<span>${escapeHtml(tokenInitial(monster))}</span>`}
              <div>
                <strong>${escapeHtml(monster.name)}</strong>
                <small>${escapeHtml([monster.tier ? `Tier ${monster.tier}` : "", monster.type, monster.role].filter(Boolean).join(" - "))}</small>
                <em>PV ${escapeHtml(monster.pv || monster.maxPV || "-")} / CA ${escapeHtml(monster.ca || "-")} / MOV ${escapeHtml(monster.movement || "-")}</em>
              </div>
            </article>
          `).join("") || "<small>Nenhuma criatura encontrada para esses filtros.</small>"}
        </div>
      </section>
      <div class="vtt-gm-list">
        ${(room.preparedEncounters || []).map((encounter) => `
          <article class="${escapeHtml(encounter.status || "prepared")}">
            <div>
              <strong>${escapeHtml(encounter.name)}</strong>
              <small>${escapeHtml(encounter.description || `${(encounter.monsters || []).length} criatura(s)`)} - ${escapeHtml(encounter.status || "preparado")}</small>
            </div>
            <footer>
              <button type="button" data-vtt-open-encounter-editor="${escapeHtml(encounter.id)}">Editor</button>
              <button type="button" data-vtt-gm-edit="encounter" data-vtt-gm-edit-id="${escapeHtml(encounter.id)}">Rapido</button>
              <button type="button" data-vtt-gm-start-encounter="${escapeHtml(encounter.id)}">Iniciar</button>
              <button type="button" data-vtt-gm-complete-encounter="${escapeHtml(encounter.id)}">Concluir</button>
              <button type="button" class="danger" data-vtt-gm-delete-encounter="${escapeHtml(encounter.id)}">Excluir</button>
            </footer>
          </article>
        `).join("") || "<small>Nenhum encontro preparado.</small>"}
      </div>
    `;
  }

  renderGmNotes(room) {
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="create-note">Criar nota</button>
      </div>
      <div class="vtt-gm-list">
        ${(room.gmNotes || []).map((note) => `
          <article class="${note.important ? "important" : ""}">
            <div>
              <strong>${escapeHtml(note.title)}</strong>
              <small>${escapeHtml(note.body || "Sem texto.")}</small>
              <em>${(note.tags || []).map((tag) => escapeHtml(tag)).join(" / ")}</em>
            </div>
            <footer>
              <button type="button" data-vtt-gm-edit="note" data-vtt-gm-edit-id="${escapeHtml(note.id)}">Editar</button>
              <button type="button" data-vtt-gm-reveal-note="${escapeHtml(note.id)}">${note.revealed ? "Revelada" : "Revelar"}</button>
              <button type="button" class="danger" data-vtt-gm-delete-note="${escapeHtml(note.id)}">Excluir</button>
            </footer>
          </article>
        `).join("") || "<small>Nenhuma nota secreta.</small>"}
      </div>
    `;
  }

  renderGmCounters(room) {
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="create-counter">Criar contador</button>
      </div>
      <div class="vtt-gm-list">
        ${(room.gmCounters || []).map((counter) => `
          <article>
            <div>
              <strong>${escapeHtml(counter.name)}</strong>
              <small>${escapeHtml(counter.type)} - ${escapeHtml(counter.description || "Sem descricao.")}</small>
              <span class="vtt-gm-counter-bar"><i style="width:${pct(counter.current, counter.max)}%"></i></span>
            </div>
            <footer>
              <button type="button" data-vtt-gm-edit="counter" data-vtt-gm-edit-id="${escapeHtml(counter.id)}">Editar</button>
              <button type="button" data-vtt-gm-counter-delta="-1" data-vtt-gm-counter="${escapeHtml(counter.id)}">-</button>
              <strong>${escapeHtml(counter.current)}/${escapeHtml(counter.max)}</strong>
              <button type="button" data-vtt-gm-counter-delta="1" data-vtt-gm-counter="${escapeHtml(counter.id)}">+</button>
              <button type="button" data-vtt-gm-reveal-counter="${escapeHtml(counter.id)}">Revelar</button>
              <button type="button" class="danger" data-vtt-gm-delete-counter="${escapeHtml(counter.id)}">Excluir</button>
            </footer>
          </article>
        `).join("") || "<small>Nenhum contador ativo.</small>"}
      </div>
    `;
  }

  renderGmEnvironment(room) {
    return `
      <div class="vtt-gm-toolbar">
        <button type="button" data-vtt-gm-action="create-environment">Criar efeito</button>
      </div>
      <div class="vtt-gm-list">
        ${(room.environmentalEffects || []).map((effect) => `
          <article class="${effect.active ? "active" : ""}">
            <div>
              <strong>${escapeHtml(effect.name)}</strong>
              <small>${escapeHtml(effect.description || "Sem descricao.")}</small>
              <em>${escapeHtml(effect.duration || "Duracao indefinida")}</em>
            </div>
            <footer>
              <button type="button" data-vtt-gm-edit="environment" data-vtt-gm-edit-id="${escapeHtml(effect.id)}">Editar</button>
              <button type="button" class="danger" data-vtt-gm-delete-environment="${escapeHtml(effect.id)}">Remover</button>
            </footer>
          </article>
        `).join("") || "<small>Nenhum efeito ambiental.</small>"}
      </div>
    `;
  }

  renderGmShield(room = this.activeRoomSnapshot()) {
    const settings = room.gmDashboardSettings || room.gmDashboard?.settings || {};
    const pinned = new Set(settings.pinnedShieldRules || []);
    const rules = this.shieldRules(room);
    return `
      <section class="vtt-shield-console">
        <header>
          <div>
            <h3>Escudo do Mestre</h3>
            <small>Busca rápida no compêndio oficial com fallback local.</small>
          </div>
          <label>Buscar regra rápida<input value="${escapeHtml(this.shieldQuery)}" placeholder="Buscar regra rápida..." data-vtt-shield-query /></label>
        </header>
        <div class="vtt-pinned-rules">
          <strong>Fixadas</strong>
          ${(rules.filter((rule) => pinned.has(rule.id)).slice(0, 6).map((rule) => `<span>${escapeHtml(rule.title)}</span>`).join("")) || "<small>Nenhuma regra fixada ainda.</small>"}
        </div>
        <div class="vtt-gm-shield">
          ${rules.slice(0, 18).map((rule) => `
            <article class="${pinned.has(rule.id) ? "pinned" : ""}">
              <header>
                <div>
                  <small>${escapeHtml(rule.category || rule.source || "Regra")}</small>
                  <h3>${escapeHtml(rule.title)}</h3>
                </div>
                <span>${escapeHtml(rule.source || "")}</span>
              </header>
              <p>${escapeHtml(rule.summary || "Sem resumo estruturado.")}</p>
              <footer>
                <button type="button" data-vtt-shield-pin="${escapeHtml(rule.id)}">${pinned.has(rule.id) ? "Desfixar" : "Fixar"}</button>
                <button type="button" data-vtt-shield-copy="${escapeHtml(rule.id)}">Copiar regra</button>
                <button type="button" data-vtt-shield-chat="${escapeHtml(rule.id)}">Enviar ao chat</button>
              </footer>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  renderGmLogs(room, combat) {
    const transactions = room.transactionLog || [];
    const chat = room.chatMessages || [];
    const optionLabels = {
      includeFullChat: "Chat completo",
      includeSecretNotes: "Notas secretas",
      includeTechnicalLogs: "Logs tecnicos",
      includeTransactions: "Transacoes",
      includeCombat: "Combate",
      includeLoot: "Loot",
    };
    return `
      <div class="vtt-gm-grid">
        <article class="vtt-gm-card wide">
          <header><h3>Relatorio da sessao</h3><span>Markdown</span></header>
          <div class="vtt-report-options">
            ${Object.entries(optionLabels).map(([key, label]) => `
              <label><input type="checkbox" data-vtt-report-option="${escapeHtml(key)}" ${this.reportOptions[key] ? "checked" : ""} /> ${escapeHtml(label)}</label>
            `).join("")}
          </div>
          <footer>
            <button type="button" data-vtt-gm-action="open-report-preview">Pre-visualizar</button>
            <button type="button" data-vtt-gm-action="export-report">Exportar relatorio .md</button>
          </footer>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Combate</h3><span>${(combat.log || []).length}</span></header>
          <div class="vtt-gm-list compact">${(combat.log || []).slice(-20).map((entry) => `<small>${escapeHtml(entry.message || entry.type || "Evento")}</small>`).join("") || "<small>Nenhum log.</small>"}</div>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Transacoes</h3><span>${transactions.length}</span></header>
          <div class="vtt-gm-list compact">${transactions.slice(0, 20).map((entry) => `<small>${escapeHtml(entry.message || entry.type || "Transacao")}</small>`).join("") || "<small>Nenhuma transacao.</small>"}</div>
        </article>
        <article class="vtt-gm-card">
          <header><h3>Chat</h3><span>${chat.length}</span></header>
          <div class="vtt-gm-list compact">${chat.slice(-20).map((entry) => `<small><b>${escapeHtml(entry.authorName || "Mesa")}:</b> ${escapeHtml(entry.message || "")}</small>`).join("") || "<small>Nenhuma mensagem.</small>"}</div>
        </article>
      </div>
    `;
  }

  renderCampaignPanel() {
    if (!this.campaignPanelOpen) return "";
    const active = this.activeCampaign();
    const campaigns = this.campaigns;
    const autosaves = active?.autosaves || [];
    return `
      <div class="vtt-modal-backdrop" data-vtt-modal-close="campaigns">
        <section class="vtt-modal vtt-campaign-modal solaris-modal-large" role="dialog" aria-modal="true">
          <header>
            <div>
              <span>persistencia de campanha</span>
              <h3>Campanhas</h3>
            </div>
            <button type="button" data-vtt-modal-close="campaigns">Fechar</button>
          </header>
          <div class="vtt-campaign-layout">
            <section>
              <div class="vtt-campaign-actions">
                <button type="button" data-vtt-action="new-campaign">Nova Campanha</button>
                <button type="button" data-vtt-action="save-session">Salvar Sessao</button>
                <button type="button" data-vtt-action="export-session">Exportar Sessao</button>
                <button type="button" data-vtt-action="import-session">Importar Sessao</button>
              </div>
              <div class="vtt-campaign-list">
                ${campaigns.length ? campaigns.map((campaign) => {
                  const session = campaign.sessions[0];
                  return `
                    <article class="${campaign.id === this.activeCampaignId ? "active" : ""}">
                      <div>
                        <strong>${escapeHtml(campaign.name)}</strong>
                        <small>${escapeHtml(campaign.description || campaign.systemName)} - ${campaign.sessions.length} sessao(oes)</small>
                        <em>Atualizada ${escapeHtml(new Date(campaign.updatedAt).toLocaleString("pt-BR"))}</em>
                      </div>
                      <footer>
                        <button type="button" data-vtt-load-campaign="${escapeHtml(campaign.id)}" data-vtt-load-session="${escapeHtml(session?.roomId || "")}" ${session ? "" : "disabled"}>Continuar</button>
                        <button type="button" data-vtt-duplicate-campaign="${escapeHtml(campaign.id)}">Duplicar</button>
                        <button type="button" class="danger" data-vtt-delete-campaign="${escapeHtml(campaign.id)}">Excluir</button>
                      </footer>
                    </article>
                  `;
                }).join("") : "<small>Nenhuma campanha salva.</small>"}
              </div>
            </section>
            <aside>
              <div class="vtt-autosave-head">
                <div>
                  <strong>Autosaves</strong>
                  <small>${escapeHtml(this.autosaveStatus || "Intervalo padrao: 60s")}</small>
                </div>
                <button type="button" data-vtt-action="snapshot-session">Snapshot</button>
              </div>
              <div class="vtt-autosave-list">
                ${autosaves.length ? autosaves.map((snapshot) => `
                  <article>
                    <div>
                      <strong>${escapeHtml(snapshot.label)}</strong>
                      <small>${escapeHtml(new Date(snapshot.createdAt).toLocaleString("pt-BR"))}</small>
                    </div>
                    <footer>
                      <button type="button" data-vtt-restore-autosave="${escapeHtml(snapshot.id)}">Restaurar</button>
                      <button type="button" data-vtt-delete-autosave="${escapeHtml(snapshot.id)}">Excluir</button>
                    </footer>
                  </article>
                `).join("") : "<small>Nenhum autosave ainda.</small>"}
              </div>
              <p class="vtt-campaign-note">No Electron alfa, o salvamento duravel usa o armazenamento local do app. A ponte IPC para arquivos nativos fica documentada como proxima melhoria.</p>
            </aside>
          </div>
        </section>
      </div>
    `;
  }

  renderTableViewNav(room, current, combat, pendingApprovals = []) {
    const view = ["table", "shop", "sheet", "gm"].includes(this.tableView) ? this.tableView : "table";
    const cartCount = this.shopCart.reduce((sum, line) => sum + Number(line.quantity || 1), 0);
    const sceneCount = (room.sceneList || []).length;
    const activeCombatants = (combat.combatants || []).filter((entry) => !entry.isDefeated).length;
    const tabs = [
      { id: "table", label: "Mesa", meta: `${activeCombatants || 0} ativos` },
      { id: "shop", label: "Loja", meta: cartCount ? `${cartCount} no carrinho` : "biblioteca" },
      { id: "sheet", label: "Ficha", meta: current.name || "personagem" },
      { id: "gm", label: "Mestre", meta: pendingApprovals.length ? `${pendingApprovals.length} pedidos` : `${sceneCount} cenas` },
    ];
    return `
      <nav class="vtt-view-tabs" aria-label="Telas da Mesa Virtual">
        ${tabs.map((tab) => `
          <button type="button" class="${view === tab.id ? "active" : ""}" data-vtt-table-view="${escapeHtml(tab.id)}">
            <strong>${escapeHtml(tab.label)}</strong>
            <span>${escapeHtml(tab.meta)}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  renderCurrentTableView(view, room, current, combat) {
    if (view === "shop") return this.renderSessionShop(room, current);
    if (view === "sheet") return this.renderSheetWorkspace(room, current, combat);
    if (view === "gm") return this.renderGmWorkspace(room, current, combat);
    return `
      ${this.renderTacticalMap(room, current, combat)}
      ${this.renderTableBottom(current)}
    `;
  }

  renderTableBottom(character) {
    const inventory = Array.isArray(character.inventory) ? character.inventory : [];
    const active = inventory.filter((item) => item.location?.kind === "active" || item.active).slice(0, 3);
    return `
      <section class="vtt-bottom vtt-table-bottom">
        <article class="vtt-table-character-card">
          <span class="vtt-table-portrait">
            ${character.portrait ? `<img src="${escapeHtml(character.portrait)}" alt="" />` : `<i>${escapeHtml(character.name.slice(0, 1) || "S")}</i>`}
          </span>
          <div>
            <h3>${escapeHtml(character.name)}</h3>
            <small>${escapeHtml(character.race)} - ${escapeHtml(character.profession)} - Nivel ${escapeHtml(character.level)}</small>
            <div class="vtt-table-resources">
              ${this.renderResourceInput("pv", "PV", character.currentPV, character.maxPV)}
              ${this.renderResourceInput("cosmos", "Cosmos", character.cosmosCurrent, character.cosmosMax)}
              ${this.renderResourceInput("stress", "Estresse", character.stress, character.stressMax)}
            </div>
          </div>
        </article>
        <article class="vtt-table-mini-panel">
          <h3>Equipamento</h3>
          <span><small>Arma equipada</small><strong>${escapeHtml(character.weapon)}</strong></span>
          <span><small>Armadura</small><strong>${escapeHtml(character.armor)}</strong></span>
          <span><small>CA / MOV</small><strong>${escapeHtml(character.ca)} / ${escapeHtml(character.movement)} m</strong></span>
        </article>
        <article class="vtt-table-mini-panel">
          <h3>Itens ativos</h3>
          ${active.length ? active.map((item) => `<span><small>${escapeHtml(item.type || "item")}</small><strong>${escapeHtml(item.name || item.itemId || "Item")}</strong></span>`).join("") : "<span><small>sessao</small><strong>Nenhum item ativo</strong></span>"}
        </article>
        <article class="vtt-table-actions">
          <h3>Acoes rapidas</h3>
          <div>
            <button type="button" data-vtt-roll="Teste rapido" data-count="3" data-sides="6">Rolar</button>
            <button type="button" data-vtt-roll="Ataque" data-count="1" data-sides="20">Atacar</button>
            <button type="button" data-vtt-action="use-item">Usar item</button>
            <button type="button" data-vtt-action="open-sheet">Ver ficha</button>
          </div>
        </article>
      </section>
    `;
  }

  renderSheetHero(character) {
    return `
      <div class="vtt-sheet-profile">
        <span class="vtt-sheet-profile-portrait">
          ${character.portrait ? `<img src="${escapeHtml(character.portrait)}" alt="" />` : `<i>${escapeHtml(character.name.slice(0, 1) || "S")}</i>`}
        </span>
        <div class="vtt-sheet-profile-copy">
          <h2>${escapeHtml(character.name)}</h2>
          <small>${escapeHtml(character.race)} - ${escapeHtml(character.profession)} - Nivel ${escapeHtml(character.level)}</small>
          <div class="vtt-sheet-profile-resources">
            ${this.renderResourceInput("pv", "PV", character.currentPV, character.maxPV)}
            ${this.renderResourceInput("cosmos", "Cosmos", character.cosmosCurrent, character.cosmosMax)}
            ${this.renderResourceInput("stress", "Estresse", character.stress, character.stressMax)}
          </div>
        </div>
        <div class="vtt-sheet-profile-stats">
          <span><small>CA</small><strong>${escapeHtml(character.ca)}</strong></span>
          <span><small>MOV.</small><strong>${escapeHtml(character.movement)} m</strong></span>
          <span><small>Arma</small><strong>${escapeHtml(character.weapon)}</strong></span>
          <span><small>Armadura</small><strong>${escapeHtml(character.armor)}</strong></span>
        </div>
      </div>
    `;
  }

  renderSheetWorkspace(room, current, combat) {
    const conditions = Array.isArray(current.conditions) ? current.conditions : [];
    const inventory = Array.isArray(current.inventory) ? current.inventory : [];
    const activeItems = inventory.filter((item) => item.location?.kind === "active" || item.active).slice(0, 5);
    const equipped = inventory.filter((item) => item.equipped || item.location?.kind === "equipped").slice(0, 5);
    const rollCount = (room.diceRolls || []).length;
    return `
      <section class="vtt-sheet-workspace" aria-label="Ficha sincronizada">
        <article class="vtt-sheet-hero">
          ${this.renderSheetHero(current)}
        </article>
        <article class="vtt-sheet-module vtt-sheet-module-stats">
          <header>
            <h3>Estado da ficha</h3>
            <span>sync</span>
          </header>
          <div class="vtt-sheet-stat-grid">
            <span><small>PV</small><strong>${escapeHtml(current.currentPV)} / ${escapeHtml(current.maxPV)}</strong></span>
            <span><small>Cosmos</small><strong>${escapeHtml(current.cosmosCurrent)} / ${escapeHtml(current.cosmosMax)}</strong></span>
            <span><small>Estresse</small><strong>${escapeHtml(current.stress)} / ${escapeHtml(current.stressMax)}</strong></span>
            <span><small>CA</small><strong>${escapeHtml(current.ca)}</strong></span>
            <span><small>Movimento</small><strong>${escapeHtml(current.movement)} m</strong></span>
            <span><small>Rolagens</small><strong>${escapeHtml(rollCount)}</strong></span>
          </div>
        </article>
        <article class="vtt-sheet-module">
          <header>
            <h3>Equipamentos</h3>
            <span>${equipped.length}</span>
          </header>
          <div class="vtt-sheet-list">
            ${equipped.length ? equipped.map((item) => `
              <span><strong>${escapeHtml(item.name || item.itemId || "Item")}</strong><small>${escapeHtml(destinationLabel(item.location?.kind || "equipped"))}</small></span>
            `).join("") : "<small>Nenhum equipamento marcado como equipado.</small>"}
          </div>
        </article>
        <article class="vtt-sheet-module">
          <header>
            <h3>Itens ativos</h3>
            <span>${activeItems.length}</span>
          </header>
          <div class="vtt-sheet-list">
            ${activeItems.length ? activeItems.map((item) => `
              <span><strong>${escapeHtml(item.name || item.itemId || "Item")}</strong><small>${escapeHtml(item.type || item.category || "ativo")}</small></span>
            `).join("") : "<small>Nenhum item ativo.</small>"}
          </div>
        </article>
        <article class="vtt-sheet-module vtt-sheet-module-actions">
          <header>
            <h3>Rolagens rapidas</h3>
            <span>${conditions.length} cond.</span>
          </header>
          <div class="vtt-action-tile-grid">
            <button type="button" data-vtt-roll="Teste de atributo" data-count="3" data-sides="6">Teste de atributo</button>
            <button type="button" data-vtt-roll="Teste de pericia" data-count="3" data-sides="6">Teste de pericia</button>
            <button type="button" data-vtt-roll="Ataque" data-count="1" data-sides="20">Ataque</button>
            <button type="button" data-vtt-roll="Defesa" data-count="3" data-sides="6">Defesa</button>
            <button type="button" data-vtt-action="use-item">Usar item</button>
            <button type="button" data-vtt-action="open-inventory">Inventario</button>
          </div>
        </article>
      </section>
    `;
  }

  renderGmWorkspace(room, current, combat) {
    const scene = room.scene || {};
    const objectives = scene.objectives || room.objectives || [];
    const scenes = (room.sceneList || []).slice(0, 5);
    const notes = (room.gmNotes || []).slice(0, 5);
    const counters = (room.gmCounters || []).slice(0, 4);
    const monsters = (room.monsters || []).slice(0, 5);
    return `
      <section class="vtt-gm-workspace" aria-label="Pagina do Mestre">
        <header class="vtt-gm-workspace-title">
          <div>
            <span>controle total da sessao</span>
            <h2>Pagina do Mestre</h2>
          </div>
          <button type="button" data-vtt-action="open-gm-panel">Abrir escudo completo</button>
        </header>
        <div class="vtt-gm-command-grid">
          <button type="button" class="danger" data-vtt-combat-action="start">Iniciar combate</button>
          <button type="button" data-vtt-gm-action="open-scene-editor">Revelar cena</button>
          <button type="button" data-vtt-gm-action="create-environment">Aplicar condicao</button>
          <button type="button" data-vtt-combat-action="toggle-monsters">Adicionar monstro</button>
          <button type="button" data-vtt-loot-action="create">Distribuir item</button>
          <button type="button" data-vtt-action="save-session">Salvar sessao</button>
        </div>
        <article class="vtt-gm-scene-summary">
          <div class="vtt-gm-scene-image">
            ${scene.mapImage ? `<img src="${escapeHtml(scene.mapImage)}" alt="" />` : "<span>SEM MAPA</span>"}
          </div>
          <div>
            <span>Resumo da cena atual</span>
            <h3>${escapeHtml(scene.name || "Cena sem nome")}</h3>
            <p>${escapeHtml(scene.notes || "Use o editor visual para preparar mapas, objetivos e areas.")}</p>
            <footer>
              <small>Iluminacao: ${escapeHtml(scene.lighting || "normal")}</small>
              <small>Perigo: ${escapeHtml(scene.danger || "baixo")}</small>
              <small>Rodada: ${escapeHtml(combat.round || 1)}</small>
            </footer>
          </div>
        </article>
        <div class="vtt-gm-dashboard-grid">
          <article class="vtt-sheet-module wide">
            <header><h3>Objetivos ativos</h3><span>${objectives.length}</span></header>
            <div class="vtt-sheet-list">
              ${objectives.length ? objectives.slice(0, 4).map((objective) => `
                <span><strong>${escapeHtml(objective.title || objective.label)}</strong><small>${escapeHtml(objective.progress || `${objective.progressCurrent ?? 0}/${objective.progressMax ?? 1}`)}</small></span>
              `).join("") : "<small>Nenhum objetivo ativo.</small>"}
            </div>
          </article>
          <article class="vtt-sheet-module">
            <header><h3>Mapas e cenas</h3><span>${scenes.length}</span></header>
            <div class="vtt-sheet-list">
              ${scenes.length ? scenes.map((entry) => `<span><strong>${escapeHtml(entry.name || "Cena")}</strong><small>${entry.id === room.activeSceneId ? "Atual" : "Preparada"}</small></span>`).join("") : "<small>Nenhuma cena preparada.</small>"}
            </div>
          </article>
          <article class="vtt-sheet-module">
            <header><h3>Notas secretas</h3><span>${notes.length}</span></header>
            <div class="vtt-sheet-list">
              ${notes.length ? notes.map((note) => `<span><strong>${escapeHtml(note.title || note.name || "Nota")}</strong><small>${escapeHtml(note.status || (note.revealed ? "revelada" : "secreta"))}</small></span>`).join("") : "<small>Nenhuma nota do mestre.</small>"}
            </div>
          </article>
          <article class="vtt-sheet-module">
            <header><h3>Monstros e NPCs</h3><span>${monsters.length}</span></header>
            <div class="vtt-sheet-list">
              ${monsters.length ? monsters.map((monster) => `<span><strong>${escapeHtml(monster.name)}</strong><small>PV ${escapeHtml(monster.snapshot?.currentPV ?? "-")} / CA ${escapeHtml(monster.snapshot?.ca ?? "-")}</small></span>`).join("") : "<small>Nenhum monstro em cena.</small>"}
            </div>
          </article>
          <article class="vtt-sheet-module">
            <header><h3>Contadores</h3><span>${counters.length}</span></header>
            <div class="vtt-sheet-list">
              ${counters.length ? counters.map((counter) => `<span><strong>${escapeHtml(counter.name)}</strong><small>${escapeHtml(counter.current ?? 0)} / ${escapeHtml(counter.max ?? 1)}</small></span>`).join("") : "<small>Nenhum contador ativo.</small>"}
            </div>
          </article>
        </div>
      </section>
    `;
  }

  render() {
    if (!this.root) return;
    if (this.screen === "launcher") {
      this.root.innerHTML = this.renderLauncherHome();
      this.bindDom();
      return;
    }
    if (this.screen === "campaigns") {
      this.root.innerHTML = this.renderCampaignsHome();
      this.bindDom();
      return;
    }
    const current = characterSnapshot(this.options.getCurrentCharacter());
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, current)
      : normalizeServerRoom(this.room, current);
    const statusLabel = this.client.isConnected ? "Conectado" : "Offline";
    const statusClass = this.client.isConnected ? "connected" : "offline";
    const combat = normalizeCombatState(room, current);
    const remoteCharacter = this.findServerCharacter(room);
    const pendingApprovals = (room.approvals || []).filter((approval) => approval.status === "pending");
    const syncLabel = this.client.isConnected
      ? (remoteCharacter ? `Ficha sync r${escapeHtml(remoteCharacter.revision || remoteCharacter.snapshot?.revision || 0)}` : "Ficha ainda nao enviada")
      : "Ficha local";
    const tableView = ["table", "shop", "sheet", "gm"].includes(this.tableView) ? this.tableView : "table";

    this.root.innerHTML = `
      <section class="vtt-shell solaris-shell solaris-screen-tabletop solaris-table-view-${escapeHtml(tableView)}" aria-label="Mesa Virtual Solaris">
        <header class="vtt-topbar solaris-topbar">
          <div class="vtt-brand">
            <span class="vtt-brand-mark" aria-hidden="true"></span>
            <div>
              <strong>Mesa Virtual Solaris</strong>
              <small>Sistema: Guerra Solar / Solaris</small>
            </div>
          </div>
          <div class="vtt-room-strip">
            <span>Sala:</span>
            <strong>${escapeHtml(room.roomName || "Colonia Solaris-7")}</strong>
          </div>
          <div class="vtt-connection ${statusClass}">
            <i aria-hidden="true"></i>
            <span>${statusLabel}</span>
            <small>${escapeHtml(this.connectionMessage)}</small>
          </div>
          <div class="vtt-top-actions">
            <button type="button" data-vtt-action="create-room">Criar Sala</button>
            <button type="button" data-vtt-action="join-room">Entrar em Sala</button>
            <button type="button" data-vtt-action="leave-room">Sair da Sala</button>
            <button type="button" data-vtt-action="open-gm-panel">Painel do Mestre</button>
            <button type="button" data-vtt-action="open-campaigns">Minhas Campanhas</button>
            <button type="button" data-vtt-action="save-session">Salvar Sessao</button>
            <button type="button" data-vtt-action="export-session">Exportar</button>
          </div>
        </header>

        <aside class="vtt-left solaris-sidebar">
          <section class="vtt-panel vtt-players">
            <div class="vtt-panel-heading">
              <h3>Jogadores</h3>
              <span>${room.players.length}</span>
            </div>
            <div class="vtt-player-list">
              ${room.players.map((player) => this.renderPlayer(player)).join("")}
            </div>
          </section>
          <section class="vtt-panel vtt-chat">
            <div class="vtt-panel-heading">
              <h3>Chat da Mesa</h3>
              <span>${this.client.isConnected ? "sync" : "local"}</span>
            </div>
            <div class="vtt-chat-log" data-vtt-chat-log>
              ${(room.chatMessages || []).slice(-12).map((message) => `
                <article>
                  <strong>${escapeHtml(message.authorName || "Solaris")}</strong>
                  <p>${escapeHtml(message.message || "")}</p>
                  <time>${formatTime(message.createdAt)}</time>
                </article>
              `).join("")}
            </div>
            <form class="vtt-chat-form" data-vtt-chat-form>
              <input name="message" type="text" placeholder="Digite sua mensagem..." autocomplete="off" />
              <button type="submit" aria-label="Enviar mensagem">Enviar</button>
            </form>
          </section>
        </aside>

        <main class="vtt-main solaris-main-stage" data-vtt-active-view="${escapeHtml(tableView)}">
          <section class="vtt-panel vtt-session">
            <div class="vtt-session-copy">
              <p>Resumo da cena atual</p>
              <h2>${escapeHtml(room.scene?.name || "Corredor de Manutencao - Nivel 2")}</h2>
              <span>${escapeHtml(room.scene?.notes || "Area reservada para mapas, grid, tokens e linha de visao.")}</span>
            </div>
            <div class="vtt-offline-banner">
              <strong>${this.client.isConnected ? "Mesa sincronizada por LAN/Radmin" : "Modo simulado/offline"}</strong>
              <span>${this.client.isConnected ? `Ficha completa, inventario e combate em sessao. ${syncLabel}.` : "O app continua funcionando como ficha local. Ligue o servidor para multiplayer."}</span>
              <small>Campanha ativa: ${escapeHtml(this.activeCampaign()?.name || "Sem campanha")} ${this.autosaveStatus ? `- ${escapeHtml(this.autosaveStatus)}` : ""}</small>
            </div>
          </section>

          ${this.renderTableViewNav(room, current, combat, pendingApprovals)}
          <section class="vtt-view-stage vtt-view-${escapeHtml(tableView)}">
            ${this.renderCurrentTableView(tableView, room, current, combat)}
          </section>
        </main>

        <aside class="vtt-right solaris-sidebar solaris-sidebar-right">
          ${this.renderCombatPanel(combat)}
          ${this.renderApprovalPanel(room, pendingApprovals)}
          ${this.renderLootPanel(room)}
          <section class="vtt-panel">
            <div class="vtt-panel-heading">
              <h3>Objetivos</h3>
              <span>sessao</span>
            </div>
            <div class="vtt-objectives">
              ${(room.scene?.objectives || room.objectives || []).map((objective) => `
                <article data-vtt-objective-progress="${escapeHtml(objective.id)}">
                  <strong>${escapeHtml(objective.title || objective.label)}</strong>
                  <span>${escapeHtml(objective.progress || `${objective.progressCurrent ?? 0}/${objective.progressMax ?? 1}`)}</span>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="vtt-panel">
            <div class="vtt-panel-heading">
              <h3>Historico de rolagens</h3>
              <span>${(room.diceRolls || []).length}</span>
            </div>
            <div class="vtt-roll-history">
              ${(room.diceRolls || []).slice(0, 8).map((roll) => `
                <article>
                  <strong>${escapeHtml(roll.label || "Rolagem")}</strong>
                  <span>${escapeHtml(roll.formula || "")}</span>
                  <em>${escapeHtml(roll.total ?? "-")}</em>
                </article>
              `).join("")}
            </div>
          </section>
        </aside>

        <footer class="vtt-quickbar solaris-bottom-bar">
          ${this.renderQuickSlot("Cubo", "3")}
          ${this.renderQuickSlot("Arma", "1")}
          ${this.renderQuickSlot("Armadura", "1")}
          ${this.renderQuickSlot("Chip", "2")}
          ${this.renderQuickSlot("Magia", "2")}
          ${Array.from({ length: 4 }, () => this.renderQuickSlot("+", "")).join("")}
        </footer>
        ${this.renderItemDetailModal()}
        ${this.renderLootModal(room)}
        ${this.renderMonsterSheetModal(room)}
        ${this.renderCampaignPanel()}
        ${this.renderGmDashboardPanel(room, current, combat)}
        ${this.renderSceneEditorModal(room)}
        ${this.renderEncounterEditorModal(room)}
        ${this.renderReportPreviewModal(room, combat)}
        ${this.renderRecoveryNotice()}
        <input type="file" accept="application/json,.json" data-vtt-session-import hidden />
      </section>
    `;
    this.bindDom();
  }

  renderActiveItems(character) {
    const inventory = Array.isArray(character.inventory) ? character.inventory : [];
    const active = inventory
      .filter((item) => item.location?.kind === "active" || item.active)
      .slice(0, 4);
    return `
      <div class="vtt-active-items">
        <h3>Itens ativos</h3>
        ${active.length
          ? active.map((item) => `<span>${escapeHtml(item.name || item.itemId || "Item")}</span>`).join("")
          : "<span>Nenhum item ativo</span>"}
      </div>
    `;
  }

  renderApprovalPanel(room, pendingApprovals = []) {
    const localPlayer = (room.players || []).find((player) => player.id === this.client.playerId);
    const isGm = localPlayer?.role === SESSION_ROLES.GM || localPlayer?.isGM;
    const approvals = (room.approvals || []).slice(0, 6);
    return `
      <section class="vtt-panel vtt-approval-panel">
        <div class="vtt-panel-heading">
          <h3>Aprovacoes do mestre</h3>
          <span>${pendingApprovals.length} pendente${pendingApprovals.length === 1 ? "" : "s"}</span>
        </div>
        <div class="vtt-approval-list">
          ${approvals.length ? approvals.map((approval) => {
            const requester = (room.players || []).find((player) => player.id === approval.requestedBy);
            const status = approval.status || "pending";
            return `
              <article class="${status}">
                <div>
                  <strong>${escapeHtml(approval.message || approval.type || "Pedido")}</strong>
                  <small>${escapeHtml(requester?.name || "Jogador")} - ${escapeHtml(status)}</small>
                </div>
                ${isGm && status === "pending" ? `
                  <footer>
                    <button type="button" data-vtt-approval-approve="${escapeHtml(approval.id)}">Aprovar</button>
                    <button type="button" data-vtt-approval-reject="${escapeHtml(approval.id)}">Rejeitar</button>
                  </footer>
                ` : ""}
              </article>
            `;
          }).join("") : "<small>Nenhum pedido registrado.</small>"}
        </div>
      </section>
    `;
  }

  renderCombatPanel(combat) {
    const currentEntry = combat.entries[combat.turnIndex] || null;
    const selectedId = this.selectedCombatantId || currentEntry?.entityId || combat.combatants[0]?.entityId || "";
    const selected = combat.combatants.find((combatant) => combatant.entityId === selectedId || combatant.id === selectedId) || combat.combatants[0] || null;
    return `
      <section class="vtt-panel vtt-combat-panel">
        <div class="vtt-panel-heading">
          <h3>Painel de Combate</h3>
          <span>${combat.active ? `Rodada ${escapeHtml(combat.round || 1)}` : "inativo"}</span>
        </div>
        <div class="vtt-combat-actions">
          <button type="button" data-vtt-combat-action="start" ${combat.active ? "disabled" : ""}>Iniciar</button>
          <button type="button" data-vtt-combat-action="next" ${combat.active ? "" : "disabled"}>Proximo</button>
          <button type="button" data-vtt-combat-action="end" ${combat.active ? "" : "disabled"}>Encerrar</button>
          <button type="button" data-vtt-combat-action="toggle-monsters">+ Monstro</button>
        </div>
        ${this.renderMonsterPicker()}
        <ol class="vtt-initiative vtt-combat-initiative">
          ${combat.entries.length ? combat.entries.map((entry, index) => {
            const combatant = combat.combatants.find((item) => item.entityId === entry.entityId) || entry;
            const active = index === combat.turnIndex && combat.active;
            return `
              <li class="${active ? "active" : ""} ${combatant.entityType === "monster" ? "hostile" : ""} ${combatant.isDefeated ? "defeated" : ""}">
                <button type="button" data-vtt-select-combatant="${escapeHtml(entry.entityId)}">
                  <span>${index + 1}</span>
                  <strong>${escapeHtml(entry.name)}</strong>
                  <em>${escapeHtml(entry.initiative ?? "-")}</em>
                </button>
              </li>
            `;
          }).join("") : `<li><button type="button" disabled><strong>Nenhum combatente</strong><em>-</em></button></li>`}
        </ol>
        ${selected ? this.renderCombatantCard(selected) : ""}
        <div class="vtt-combat-log">
          ${(combat.log || []).slice(0, 5).map((entry) => `
            <article>
              <span>${formatTime(entry.createdAt)}</span>
              <p>${escapeHtml(entry.message || "")}</p>
            </article>
          `).join("") || "<small>Nenhum evento de combate registrado.</small>"}
        </div>
      </section>
    `;
  }

  renderMonsterPicker() {
    if (!this.monsterPickerOpen) return "";
    const catalog = (this.options.getMonsterCatalog() || []).slice(0, 8);
    return `
      <div class="vtt-monster-picker">
        <strong>Adicionar criatura</strong>
        <div>
          ${catalog.length ? catalog.map((monster) => `
            <button type="button" data-vtt-add-monster="${escapeHtml(monster.id)}">
              ${monster.imageDataUrl || monster.image ? `<img src="${escapeHtml(monster.imageDataUrl || monster.image)}" alt="" />` : "<i>?</i>"}
              <span>
                <b>${escapeHtml(monster.name)}</b>
                <small>${escapeHtml([monster.tier ? `Tier ${monster.tier}` : "", monster.role || monster.type || ""].filter(Boolean).join(" - "))}</small>
              </span>
            </button>
          `).join("") : "<small>Nenhum monstro carregado no bestiario.</small>"}
        </div>
      </div>
    `;
  }

  renderCombatantCard(combatant) {
    const bar = pct(combatant.currentPV, combatant.maxPV);
    const conditions = Array.isArray(combatant.conditions) ? combatant.conditions : [];
    return `
      <article class="vtt-combatant-card ${combatant.entityType === "monster" ? "monster" : "character"} ${combatant.isDefeated ? "defeated" : ""}">
        <header>
          <span class="vtt-combatant-portrait">
            ${combatant.portrait ? `<img src="${escapeHtml(combatant.portrait)}" alt="" />` : `<i>${escapeHtml(String(combatant.name || "S").slice(0, 1))}</i>`}
          </span>
          <div>
            <h4>${escapeHtml(combatant.name)}</h4>
            <small>${escapeHtml(combatantSummary(combatant))}</small>
          </div>
        </header>
        <div class="vtt-combatant-stats">
          <span><small>PV</small><strong>${escapeHtml(combatant.currentPV)}/${escapeHtml(combatant.maxPV)}</strong></span>
          <span><small>CA</small><strong>${escapeHtml(combatant.ca || "-")}</strong></span>
          <span><small>Mov.</small><strong>${escapeHtml(combatant.movement || "-")} m</strong></span>
          <span><small>Ini.</small><strong>${escapeHtml(combatant.initiative || "-")}</strong></span>
        </div>
        <i class="vtt-combatant-bar" style="--vtt-pv:${bar}%"></i>
        <div class="vtt-combatant-actions">
          <button type="button" data-vtt-target-combatant="${escapeHtml(combatant.entityId)}">Alvo</button>
          <button type="button" data-vtt-roll-initiative="${escapeHtml(combatant.entityId)}">Iniciativa</button>
          <button type="button" data-vtt-damage-combatant="${escapeHtml(combatant.entityId)}">Dano</button>
          <button type="button" data-vtt-heal-combatant="${escapeHtml(combatant.entityId)}">Cura</button>
          <button type="button" data-vtt-condition-combatant="${escapeHtml(combatant.entityId)}">Condicao</button>
          ${combatant.entityType === "monster" ? `<button type="button" data-vtt-open-monster-sheet="${escapeHtml(combatant.entityId)}">Ficha</button><button type="button" class="danger" data-vtt-delete-monster="${escapeHtml(combatant.entityId)}">Remover</button>` : ""}
        </div>
        <div class="vtt-combatant-conditions">
          ${conditions.length ? conditions.map((condition) => `
            <button type="button" data-vtt-remove-condition="${escapeHtml(condition.id)}" data-vtt-condition-owner="${escapeHtml(combatant.entityId)}">
              ${escapeHtml(condition.label)}
            </button>
          `).join("") : "<small>Sem condicoes ativas.</small>"}
        </div>
      </article>
    `;
  }

  renderPlayer(player) {
    const bar = pct(player.pv, player.pvMax);
    return `
      <article class="vtt-player ${player.selected ? "selected" : ""}">
        <span class="vtt-avatar">
          ${player.portrait ? `<img src="${escapeHtml(player.portrait)}" alt="" />` : `<i>${escapeHtml(String(player.name || "S").slice(0, 1))}</i>`}
        </span>
        <div>
          <strong>${escapeHtml(player.name)}</strong>
          <small>${escapeHtml(player.classLine || `Nivel ${player.level || 1}`)}</small>
          <span class="${player.online ? "online" : "offline"}">${player.online ? "Online" : "Offline"}</span>
        </div>
        <footer>
          <span>PV ${escapeHtml(player.pv)}/${escapeHtml(player.pvMax)}</span>
          <span>CA ${escapeHtml(player.ca)}</span>
        </footer>
        <b style="--vtt-pv:${bar}%"></b>
      </article>
    `;
  }

  renderSelectedCharacter(character) {
    return `
      <section class="vtt-selected">
        <span class="vtt-selected-portrait">
          ${character.portrait ? `<img src="${escapeHtml(character.portrait)}" alt="" />` : `<i>${escapeHtml(character.name.slice(0, 1) || "S")}</i>`}
        </span>
        <div class="vtt-selected-info">
          <h3>${escapeHtml(character.name)}</h3>
          <small>${escapeHtml(character.race)} - ${escapeHtml(character.profession)} - Nivel ${escapeHtml(character.level)}</small>
          <div class="vtt-resource-editors">
            ${this.renderResourceInput("pv", "PV", character.currentPV, character.maxPV)}
            ${this.renderResourceInput("cosmos", "Cosmos", character.cosmosCurrent, character.cosmosMax)}
            ${this.renderResourceInput("stress", "Estresse", character.stress, character.stressMax)}
          </div>
        </div>
        <div class="vtt-gear-summary">
          <span><small>CA</small><strong>${escapeHtml(character.ca)}</strong></span>
          <span><small>Mov.</small><strong>${escapeHtml(character.movement)} m</strong></span>
          <span><small>Arma</small><strong>${escapeHtml(character.weapon)}</strong></span>
          <span><small>Armadura</small><strong>${escapeHtml(character.armor)}</strong></span>
        </div>
      </section>
    `;
  }

  renderResourceInput(key, label, value, max) {
    const bar = pct(value, max);
    return `
      <label class="vtt-resource-input ${key}">
        <span>${label}</span>
        <input type="number" min="0" max="${escapeHtml(max)}" value="${escapeHtml(value)}" data-vtt-resource="${key}" />
        <small>/ ${escapeHtml(max)}</small>
        <i style="--vtt-fill:${bar}%"></i>
      </label>
    `;
  }

  renderQuickSlot(label, value) {
    return `
      <button type="button" class="vtt-quick-slot">
        <span>${escapeHtml(label)}</span>
        ${value ? `<strong>${escapeHtml(value)}</strong>` : ""}
      </button>
    `;
  }

  bindDom() {
    this.root.querySelectorAll("[data-vtt-table-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.vttTableView || "table";
        this.tableView = ["table", "shop", "sheet", "gm"].includes(view) ? view : "table";
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttAction;
        if (action === "create-room") this.createRoom();
        if (action === "join-room") this.joinRoom();
        if (action === "leave-room") this.leaveRoom();
        if (action === "open-launcher") {
          this.screen = "launcher";
          this.launcherModal = null;
          this.render();
        }
        if (action === "open-campaigns") {
          this.screen = "campaigns";
          this.campaignPanelOpen = false;
          this.gmPanelOpen = false;
          this.render();
        }
        if (action === "go-table") {
          this.screen = "table";
          this.render();
        }
        if (action === "open-gm-panel") {
          this.gmPanelOpen = true;
          this.render();
        }
        if (action === "save-session") this.saveSession();
        if (action === "new-campaign") this.createCampaignPrompt();
        if (action === "snapshot-session") this.createManualSnapshot();
        if (action === "export-session") this.exportCurrentSession();
        if (action === "import-session") this.root.querySelector("[data-vtt-session-import]")?.click();
        if (action === "continue-recovery") this.continueRecoverySession();
        if (action === "ignore-recovery") this.clearRecoveryNotice();
        if (action === "open-sheet") this.options.onOpenCharacter();
        if (action === "open-inventory") this.options.onOpenInventory();
        if (action === "sync-sheet") this.syncCurrentSheet();
        if (action === "request-sync") this.requestCurrentSheetSync();
        if (action === "use-item") this.sessionUseItem();
        if (action === "move-item") this.sessionMoveItem();
        if (action === "equip-item") this.sessionEquipItem();
        if (action === "damage-target") this.damageSelectedTarget();
        if (action === "damage-area") this.applyDamageToSelectedArea();
        if (action === "request-purchase") this.requestPurchaseApproval();
        if (action === "request-sale") this.requestSaleApproval();
        if (action === "request-delete") this.requestDeleteApproval();
        if (action === "launcher-continue") this.continueLauncherCampaign();
        if (action === "launcher-offline") this.openLauncherModal("offline");
        if (action === "launcher-multiplayer") this.openLauncherModal("multiplayer");
        if (action === "launcher-join") this.openLauncherModal("join");
        if (action === "launcher-settings") this.openLauncherModal("settings");
        if (action === "launcher-offline-confirm") this.launchOfflineRoom();
        if (action === "launcher-multiplayer-confirm") this.launchMultiplayerRoom();
        if (action === "launcher-creator") {
          this.options.onOpenCreator?.();
          this.options.notify("Criador de personagem aberto.");
        }
        if (action === "launcher-library") this.options.onOpenCharacter?.();
        if (action === "launcher-bestiary") {
          this.options.onOpenBestiary?.();
          this.options.notify("Bestiário aberto.");
        }
        if (action === "launcher-gm-shield") {
          this.screen = "table";
          this.tableView = "gm";
          this.gmPanelOpen = true;
          this.render();
        }
        if (action === "launcher-clear-visual-cache") {
          this.setLauncherReducedFx(false);
          this.options.notify("Preferência visual do launcher limpa.");
        }
      });
    });
    this.root.querySelectorAll("[data-vtt-gm-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        this.gmPanelTab = button.dataset.vttGmTab || "overview";
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-gm-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttGmAction;
        if (action === "save-session") this.saveSession();
        if (action === "snapshot-session") this.createManualSnapshot();
        if (action === "export-report") this.exportGmReport();
        if (action === "open-scene-editor") this.openSceneEditor();
        if (action === "open-encounter-editor") this.openEncounterEditor();
        if (action === "open-report-preview") this.openReportPreview();
        if (action === "create-note") this.createGmNotePrompt();
        if (action === "create-counter") this.createGmCounterPrompt();
        if (action === "create-environment") this.createGmEnvironmentPrompt();
        if (action === "create-scene") this.createGmScenePrompt();
        if (action === "save-current-scene") this.saveCurrentSceneToGmList();
        if (action === "create-encounter") this.createGmEncounterPrompt();
        if (action === "generate-encounter") this.generatePreparedEncounter();
        if (action === "generate-encounter-now") this.generatePreparedEncounter({ immediate: true });
        if (action === "gm-generate-mission") this.generateGmMission();
        if (action === "gm-create-mission") this.createGmMission();
        if (action === "gm-create-route") this.createGmTravelRoute();
        if (action === "gm-create-resource") this.createGmResource();
        if (action === "gm-create-faction") this.createGmFaction();
        if (action === "gm-create-clock") this.createGmClock();
        if (action === "gm-create-hacking") this.createGmHacking();
        if (action === "gm-create-base") this.createGmBase();
      });
    });
    this.root.querySelector("[data-vtt-campaign-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitCampaignForm(event.currentTarget);
    });
    this.root.querySelector("[data-vtt-gm-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitGmForm(event.currentTarget);
    });
    this.root.querySelector("[data-vtt-scene-editor-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.saveSceneEditor(event.currentTarget);
    });
    this.root.querySelector("[data-vtt-scene-editor-entry-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.saveSceneEditorEntry(event.currentTarget);
    });
    this.root.querySelector("[data-vtt-encounter-editor-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.saveEncounterEditor(event.currentTarget);
    });
    this.root.querySelectorAll("[data-vtt-gm-edit]").forEach((button) => {
      button.addEventListener("click", () => this.openGmForm(button.dataset.vttGmEdit, button.dataset.vttGmEditId));
    });
    this.root.querySelectorAll("[data-vtt-open-scene-editor]").forEach((button) => {
      button.addEventListener("click", () => this.openSceneEditor(button.dataset.vttOpenSceneEditor));
    });
    this.root.querySelectorAll("[data-vtt-open-encounter-editor]").forEach((button) => {
      button.addEventListener("click", () => this.openEncounterEditor(button.dataset.vttOpenEncounterEditor));
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-select]").forEach((button) => {
      button.addEventListener("click", () => this.selectSceneEditorScene(button.dataset.vttSceneEditorSelect));
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttSceneEditorAction;
        if (action === "new") this.createSceneFromEditor();
        if (action === "duplicate") this.duplicateSceneEditorScene();
        if (action === "export") this.exportSceneEditorScene();
        if (action === "add-objective") this.addSceneEditorObjective();
        if (action === "add-danger") this.addSceneEditorZone("danger");
        if (action === "add-cover") this.addSceneEditorZone("cover");
        if (action === "add-area") this.addSceneEditorArea("circle");
        if (action === "add-token") this.addSceneEditorToken();
        if (action === "switch") this.switchGmScene(this.sceneEditorScene().id);
      });
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-select-entry]").forEach((button) => {
      button.addEventListener("click", () => this.selectSceneEditorEntry(button.dataset.vttSceneEditorSelectEntry, button.dataset.entryId));
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-remove]").forEach((button) => {
      button.addEventListener("click", () => this.removeSceneEditorEntry(button.dataset.vttSceneEditorRemove, button.dataset.entryId));
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-entry]").forEach((entry) => {
      entry.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectSceneEditorEntry(entry.dataset.vttSceneEditorEntry, entry.dataset.entryId);
      });
      entry.addEventListener("dragstart", (event) => {
        const kind = entry.dataset.vttSceneEditorEntry || "";
        const id = entry.dataset.entryId || "";
        this.sceneEditorDrag = { kind, id };
        event.dataTransfer?.setData("text/plain", `${kind}:${id}`);
      });
    });
    this.root.querySelectorAll("[data-vtt-scene-editor-grid]").forEach((grid) => {
      grid.addEventListener("dragover", (event) => event.preventDefault());
      grid.addEventListener("drop", (event) => {
        event.preventDefault();
        const raw = event.dataTransfer?.getData("text/plain") || "";
        const [rawKind, rawId] = raw.split(":");
        const kind = rawKind || this.sceneEditorDrag?.kind || "";
        const id = rawId || this.sceneEditorDrag?.id || "";
        if (!kind || !id) return;
        const scene = this.sceneEditorScene();
        const point = this.mapPointFromEvent(event, normalizeScene(scene, this.options.getCurrentCharacter()));
        this.moveSceneEditorEntry(kind, id, point);
        this.sceneEditorDrag = null;
      });
    });
    this.root.querySelectorAll("[data-vtt-encounter-editor-select]").forEach((button) => {
      button.addEventListener("click", () => {
        this.encounterEditor = { encounterId: button.dataset.vttEncounterEditorSelect || "" };
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-encounter-editor-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttEncounterEditorAction;
        if (action === "new") this.createEncounterFromEditor();
        if (action === "duplicate") this.duplicateEncounterEditorEncounter();
        if (action === "add-monster") {
          const selected = this.root.querySelector("[data-vtt-encounter-monster-select]")?.value || "";
          this.addEncounterEditorMonster(selected);
        }
      });
    });
    this.root.querySelectorAll("[data-vtt-encounter-remove-monster]").forEach((button) => {
      button.addEventListener("click", () => this.removeEncounterEditorMonster(button.dataset.vttEncounterRemoveMonster));
    });
    this.root.querySelectorAll("[data-vtt-report-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttReportAction;
        if (action === "copy") this.copyReportPreview();
        if (action === "download") this.downloadReportPreview();
        if (action === "html") this.exportReportHtml();
        if (action === "save") this.saveReportPreview();
      });
    });
    this.root.querySelectorAll("[data-vtt-encounter-filter]").forEach((input) => {
      input.addEventListener("change", () => this.updateEncounterFilter(input.dataset.vttEncounterFilter, input.value));
    });
    this.root.querySelectorAll("[data-vtt-lore-filter]").forEach((input) => {
      const eventName = input.tagName === "INPUT" ? "input" : "change";
      input.addEventListener(eventName, () => this.updateLoreFilter(input.dataset.vttLoreFilter, input.value));
    });
    this.root.querySelectorAll("[data-vtt-gm-lore-action]").forEach((button) => {
      button.addEventListener("click", () => this.runGmLoreAction(button.dataset.vttGmLoreAction, button.dataset.loreId));
    });
    this.root.querySelectorAll("[data-vtt-report-option]").forEach((input) => {
      input.addEventListener("change", () => this.updateReportOption(input.dataset.vttReportOption, input.checked));
    });
    this.root.querySelector("[data-vtt-shield-query]")?.addEventListener("input", (event) => {
      this.shieldQuery = event.currentTarget.value;
      this.render();
    });
    this.root.querySelectorAll("[data-vtt-shield-pin]").forEach((button) => {
      button.addEventListener("click", () => this.pinShieldRule(button.dataset.vttShieldPin));
    });
    this.root.querySelectorAll("[data-vtt-shield-copy]").forEach((button) => {
      button.addEventListener("click", () => this.copyShieldRule(button.dataset.vttShieldCopy));
    });
    this.root.querySelectorAll("[data-vtt-shield-chat]").forEach((button) => {
      button.addEventListener("click", () => this.sendShieldRuleToChat(button.dataset.vttShieldChat));
    });
    this.root.querySelectorAll("[data-vtt-gm-reveal-note]").forEach((button) => {
      button.addEventListener("click", () => this.revealGmNote(button.dataset.vttGmRevealNote));
    });
    this.root.querySelectorAll("[data-vtt-gm-delete-note]").forEach((button) => {
      button.addEventListener("click", () => this.deleteGmNote(button.dataset.vttGmDeleteNote));
    });
    this.root.querySelectorAll("[data-vtt-gm-counter]").forEach((button) => {
      button.addEventListener("click", () => this.tickGmCounter(button.dataset.vttGmCounter, Number(button.dataset.vttGmCounterDelta || 0)));
    });
    this.root.querySelectorAll("[data-vtt-gm-reveal-counter]").forEach((button) => {
      button.addEventListener("click", () => this.revealGmCounter(button.dataset.vttGmRevealCounter));
    });
    this.root.querySelectorAll("[data-vtt-gm-delete-counter]").forEach((button) => {
      button.addEventListener("click", () => this.deleteGmCounter(button.dataset.vttGmDeleteCounter));
    });
    this.root.querySelectorAll("[data-vtt-gm-delete-environment]").forEach((button) => {
      button.addEventListener("click", () => this.deleteGmEnvironment(button.dataset.vttGmDeleteEnvironment));
    });
    this.root.querySelectorAll("[data-vtt-gm-mission-advance]").forEach((button) => {
      button.addEventListener("click", () => this.advanceGmMission(button.dataset.vttGmMissionAdvance));
    });
    this.root.querySelectorAll("[data-vtt-gm-mission-complication]").forEach((button) => {
      button.addEventListener("click", () => this.resolveGmMissionComplication(button.dataset.vttGmMissionComplication));
    });
    this.root.querySelectorAll("[data-vtt-gm-mission-objective]").forEach((button) => {
      button.addEventListener("click", () => this.addGmMissionObjective(button.dataset.vttGmMissionObjective));
    });
    this.root.querySelectorAll("[data-vtt-gm-resource-consume]").forEach((button) => {
      button.addEventListener("click", () => this.changeGmResource(button.dataset.vttGmResourceConsume, -1));
    });
    this.root.querySelectorAll("[data-vtt-gm-resource-restore]").forEach((button) => {
      button.addEventListener("click", () => this.changeGmResource(button.dataset.vttGmResourceRestore, 1));
    });
    this.root.querySelectorAll("[data-vtt-gm-faction-reputation]").forEach((button) => {
      button.addEventListener("click", () => this.changeGmFactionReputation(button.dataset.vttGmFactionReputation, Number(button.dataset.delta || 0)));
    });
    this.root.querySelectorAll("[data-vtt-gm-travel-event]").forEach((button) => {
      button.addEventListener("click", () => this.resolveGmTravelEvent(button.dataset.vttGmTravelEvent));
    });
    this.root.querySelectorAll("[data-vtt-gm-clock-advance]").forEach((button) => {
      button.addEventListener("click", () => this.advanceGmCampaignClock(button.dataset.vttGmClockAdvance));
    });
    this.root.querySelectorAll("[data-vtt-gm-hacking-advance]").forEach((button) => {
      button.addEventListener("click", () => this.advanceGmHacking(button.dataset.vttGmHackingAdvance));
    });
    this.root.querySelectorAll("[data-vtt-gm-hacking-fail]").forEach((button) => {
      button.addEventListener("click", () => this.failGmHacking(button.dataset.vttGmHackingFail));
    });
    this.root.querySelectorAll("[data-vtt-gm-base-event]").forEach((button) => {
      button.addEventListener("click", () => this.resolveGmBaseEvent(button.dataset.vttGmBaseEvent));
    });
    this.root.querySelectorAll("[data-vtt-gm-switch-scene]").forEach((button) => {
      button.addEventListener("click", () => this.switchGmScene(button.dataset.vttGmSwitchScene));
    });
    this.root.querySelectorAll("[data-vtt-gm-delete-scene]").forEach((button) => {
      button.addEventListener("click", () => this.deleteGmScene(button.dataset.vttGmDeleteScene));
    });
    this.root.querySelectorAll("[data-vtt-gm-start-encounter]").forEach((button) => {
      button.addEventListener("click", () => this.startGmEncounter(button.dataset.vttGmStartEncounter));
    });
    this.root.querySelectorAll("[data-vtt-gm-complete-encounter]").forEach((button) => {
      button.addEventListener("click", () => this.completeGmEncounter(button.dataset.vttGmCompleteEncounter));
    });
    this.root.querySelectorAll("[data-vtt-gm-delete-encounter]").forEach((button) => {
      button.addEventListener("click", () => this.deleteGmEncounter(button.dataset.vttGmDeleteEncounter));
    });
    this.root.querySelectorAll("[data-vtt-roll]").forEach((button) => {
      button.addEventListener("click", () => {
        this.roll(
          button.dataset.vttRoll,
          Number(button.dataset.count || 3),
          Number(button.dataset.sides || 6),
          0
        );
      });
    });
    this.root.querySelector("[data-vtt-chat-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = event.currentTarget.elements.message;
      this.sendChat(input.value);
      input.value = "";
    });
    this.root.querySelectorAll("[data-vtt-resource]").forEach((input) => {
      input.addEventListener("change", () => this.updateResource(input.dataset.vttResource, input.value));
    });
    this.root.querySelectorAll("[data-vtt-combat-action]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const action = button.getAttribute("data-vtt-combat-action") || "";
        if (action === "start") this.startCombat();
        else if (action === "end") this.endCombat();
        else if (action === "next") this.nextTurn();
        else if (action === "toggle-monsters") {
          this.monsterPickerOpen = !this.monsterPickerOpen;
          this.render();
        }
      });
    });
    this.root.querySelectorAll("[data-vtt-select-combatant]").forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedCombatantId = button.dataset.vttSelectCombatant;
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-add-monster]").forEach((button) => {
      button.addEventListener("click", () => this.addMonsterToCombat(button.dataset.vttAddMonster));
    });
    this.root.querySelectorAll("[data-vtt-roll-initiative]").forEach((button) => {
      button.addEventListener("click", () => this.rollInitiative(button.dataset.vttRollInitiative));
    });
    this.root.querySelectorAll("[data-vtt-target-combatant]").forEach((button) => {
      button.addEventListener("click", () => this.selectTargetByEntity(button.dataset.vttTargetCombatant));
    });
    this.root.querySelectorAll("[data-vtt-damage-combatant]").forEach((button) => {
      button.addEventListener("click", () => this.damageCombatant(button.dataset.vttDamageCombatant));
    });
    this.root.querySelectorAll("[data-vtt-heal-combatant]").forEach((button) => {
      button.addEventListener("click", () => this.healCombatant(button.dataset.vttHealCombatant));
    });
    this.root.querySelectorAll("[data-vtt-condition-combatant]").forEach((button) => {
      button.addEventListener("click", () => this.addCondition(button.dataset.vttConditionCombatant));
    });
    this.root.querySelectorAll("[data-vtt-remove-condition]").forEach((button) => {
      button.addEventListener("click", () => this.removeCondition(button.dataset.vttConditionOwner, button.dataset.vttRemoveCondition));
    });
    this.root.querySelectorAll("[data-vtt-delete-monster]").forEach((button) => {
      button.addEventListener("click", () => this.deleteMonsterFromCombat(button.dataset.vttDeleteMonster));
    });
    this.root.querySelectorAll("[data-vtt-open-monster-sheet]").forEach((button) => {
      button.addEventListener("click", () => this.openMonsterSheet(button.dataset.vttOpenMonsterSheet));
    });
    this.root.querySelectorAll("[data-vtt-approval-approve]").forEach((button) => {
      button.addEventListener("click", () => this.approveRequest(button.dataset.vttApprovalApprove));
    });
    this.root.querySelectorAll("[data-vtt-approval-reject]").forEach((button) => {
      button.addEventListener("click", () => this.rejectRequest(button.dataset.vttApprovalReject));
    });
    this.root.querySelectorAll("[data-vtt-approval-approve-line]").forEach((button) => {
      button.addEventListener("click", () => this.approveRequest(button.dataset.vttApprovalApproveLine, { shopLineId: button.dataset.lineId }));
    });
    this.root.querySelectorAll("[data-vtt-approval-reject-line]").forEach((button) => {
      button.addEventListener("click", () => this.rejectRequest(button.dataset.vttApprovalRejectLine, { shopLineId: button.dataset.lineId, message: "Item rejeitado pelo mestre." }));
    });
    this.root.querySelectorAll("[data-vtt-load-campaign]").forEach((button) => {
      button.addEventListener("click", () => this.loadCampaign(button.dataset.vttLoadCampaign, button.dataset.vttLoadSession));
    });
    this.root.querySelectorAll("[data-vtt-edit-campaign]").forEach((button) => {
      button.addEventListener("click", () => this.editCampaign(button.dataset.vttEditCampaign));
    });
    this.root.querySelectorAll("[data-vtt-duplicate-campaign]").forEach((button) => {
      button.addEventListener("click", () => this.duplicateCampaign(button.dataset.vttDuplicateCampaign));
    });
    this.root.querySelectorAll("[data-vtt-export-campaign]").forEach((button) => {
      button.addEventListener("click", () => this.exportCampaign(button.dataset.vttExportCampaign));
    });
    this.root.querySelectorAll("[data-vtt-delete-campaign]").forEach((button) => {
      button.addEventListener("click", () => this.deleteCampaign(button.dataset.vttDeleteCampaign));
    });
    this.root.querySelectorAll("[data-vtt-restore-autosave]").forEach((button) => {
      button.addEventListener("click", () => this.restoreAutosave(button.dataset.vttRestoreAutosave));
    });
    this.root.querySelectorAll("[data-vtt-delete-autosave]").forEach((button) => {
      button.addEventListener("click", () => this.deleteAutosave(button.dataset.vttDeleteAutosave));
    });
    this.root.querySelector("[data-vtt-session-import]")?.addEventListener("change", (event) => {
      this.importSessionFile(event.currentTarget.files?.[0]);
      event.currentTarget.value = "";
    });
    this.root.querySelector("[data-vtt-shop-query]")?.addEventListener("change", (event) => {
      this.shopQuery = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-query]")?.addEventListener("input", (event) => {
      this.shopQuery = event.currentTarget.value;
      this.shopPage = 1;
    });
    this.root.querySelectorAll("[data-vtt-shop-category-button]").forEach((button) => {
      button.addEventListener("click", () => {
        this.shopCategory = button.dataset.vttShopCategoryButton || "all";
        this.shopPage = 1;
        this.render();
      });
    });
    this.root.querySelector("[data-vtt-shop-mode]")?.addEventListener("change", (event) => {
      this.shopMode = event.currentTarget.value || "session";
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-category]")?.addEventListener("change", (event) => {
      this.shopCategory = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-tier]")?.addEventListener("change", (event) => {
      this.shopTier = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-rarity]")?.addEventListener("change", (event) => {
      this.shopRarity = event.currentTarget.value || "all";
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-min-price]")?.addEventListener("change", (event) => {
      this.shopMinPrice = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-max-price]")?.addEventListener("change", (event) => {
      this.shopMaxPrice = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-in-stock]")?.addEventListener("change", (event) => {
      this.shopOnlyInStock = event.currentTarget.checked;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-compatibility]")?.addEventListener("change", (event) => {
      this.shopCompatibility = event.currentTarget.value || "all";
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-sort]")?.addEventListener("change", (event) => {
      this.shopSort = event.currentTarget.value;
      this.shopPage = 1;
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-destination]")?.addEventListener("change", (event) => {
      this.purchaseDestination = event.currentTarget.value || "unassigned";
      this.render();
    });
    this.root.querySelector("[data-vtt-shop-target-character]")?.addEventListener("change", (event) => {
      this.shopTargetCharacterId = event.currentTarget.value || "";
      this.syncShopCartState();
      this.render();
    });
    this.root.querySelectorAll("[data-vtt-shop-page]").forEach((button) => {
      button.addEventListener("click", () => {
        this.shopPage = Number(button.dataset.vttShopPage || 1);
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-shop-add]").forEach((button) => {
      button.addEventListener("click", () => this.addShopItemToCart(button.dataset.vttShopAdd));
    });
    this.root.querySelectorAll("[data-vtt-shop-details]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openShopItemDetails(button.dataset.vttShopDetails);
      });
    });
    this.root.querySelectorAll("[data-vtt-shop-compare]").forEach((button) => {
      button.addEventListener("click", () => this.compareShopItem(button.dataset.vttShopCompare));
    });
    this.root.querySelectorAll("[data-vtt-shop-send-chat]").forEach((button) => {
      button.addEventListener("click", () => this.sendShopItemToChat(button.dataset.vttShopSendChat));
    });
    this.root.querySelectorAll("[data-vtt-shop-card]").forEach((card) => {
      card.addEventListener("dblclick", () => this.openShopItemDetails(card.dataset.vttShopCard));
    });
    this.root.querySelectorAll("[data-vtt-shop-buy-now]").forEach((button) => {
      button.addEventListener("click", () => {
        this.addShopItemToCart(button.dataset.vttShopBuyNow);
        this.requestShopCartPurchase();
      });
    });
    this.root.querySelectorAll("[data-vtt-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => this.removeShopCartLine(button.dataset.vttCartRemove));
    });
    this.root.querySelectorAll("[data-vtt-cart-qty]").forEach((input) => {
      input.addEventListener("change", () => this.updateShopCartLine(input.dataset.vttCartQty, { quantity: Math.max(1, Number(input.value || 1)) }));
    });
    this.root.querySelectorAll("[data-vtt-cart-destination]").forEach((select) => {
      select.addEventListener("change", () => this.updateShopCartLine(select.dataset.vttCartDestination, { destination: decodeDestination(select.value || "unassigned") }));
    });
    this.root.querySelectorAll("[data-vtt-shop-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttShopAction;
        if (action === "clear-cart") this.clearShopCart();
        if (action === "request-purchase") this.requestShopCartPurchase();
        if (action === "direct-purchase") this.requestShopCartPurchase({ direct: true });
        if (action === "cart-to-loot") this.requestShopCartPurchase({ asLoot: true });
      });
    });
    this.root.querySelectorAll("[data-vtt-loot-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.vttLootAction === "create") this.createLootPackPrompt();
      });
    });
    this.root.querySelectorAll("[data-vtt-loot-distribute]").forEach((button) => {
      button.addEventListener("click", () => this.distributeLootPackPrompt(button.dataset.vttLootDistribute));
    });
    this.root.querySelector("[data-vtt-loot-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitLootModal(event.currentTarget);
    });
    this.root.querySelectorAll("[data-vtt-map-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttMapAction;
        if (action === "select-map") this.root.querySelector("[data-vtt-map-file]")?.click();
        if (action === "sync-tokens") this.syncSceneTokens();
        if (action === "edit-scene") this.openSceneEditor();
        if (action === "add-danger") this.addSceneZone("danger");
        if (action === "add-cover") this.addSceneZone("cover");
        if (action === "clear-measurements") this.clearMeasurements();
        if (action === "area-circle") this.addSceneArea("circle");
        if (action === "area-cone") this.addSceneArea("cone");
        if (action === "area-line") this.addSceneArea("line");
        if (action === "damage-area") this.applyDamageToSelectedArea();
        if (action === "clear-areas") this.clearSceneAreas();
        if (action === "toggle-visibility") this.toggleSelectedTokenVisibility();
        if (action === "create-objective") this.createObjectivePrompt();
      });
    });
    this.root.querySelector("[data-vtt-map-file]")?.addEventListener("change", (event) => {
      this.selectMapFile(event.currentTarget.files?.[0]);
      event.currentTarget.value = "";
    });
    this.root.querySelectorAll("[data-vtt-map-tool]").forEach((button) => {
      button.addEventListener("click", () => this.setMapTool(this.mapTool === button.dataset.vttMapTool ? "move" : button.dataset.vttMapTool));
    });
    this.root.querySelectorAll("[data-vtt-grid-setting]").forEach((input) => {
      input.addEventListener("change", () => this.updateGridSetting(input.dataset.vttGridSetting, input.value));
    });
    this.root.querySelectorAll("[data-vtt-grid-toggle]").forEach((input) => {
      input.addEventListener("change", () => this.updateGridSetting(input.dataset.vttGridToggle, input.checked));
    });
    this.root.querySelectorAll("[data-vtt-objective-progress]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.updateObjectiveProgress(button.dataset.vttObjectiveProgress);
      });
    });
    this.root.querySelectorAll("[data-vtt-map-area]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectedAreaId = button.dataset.vttMapArea;
        this.render();
      });
    });
    this.root.querySelectorAll("[data-vtt-map-token]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.mapTool === "target") {
          this.selectTargetToken(button.dataset.vttMapToken);
          return;
        }
        this.selectedMapTokenId = button.dataset.vttMapToken;
        this.render();
      });
      button.addEventListener("dragstart", (event) => {
        this.draggingMapTokenId = button.dataset.vttMapToken;
        event.dataTransfer?.setData("text/plain", this.draggingMapTokenId);
      });
    });
    this.root.querySelectorAll("[data-vtt-map-grid]").forEach((grid) => {
      grid.addEventListener("click", (event) => {
        if (event.target.closest("[data-vtt-map-token]")) return;
        const room = this.client.isConnected && this.client.room
          ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
          : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
        const point = this.mapPointFromEvent(event, normalizeScene(room.scene, this.options.getCurrentCharacter()));
        this.handleMapPoint(point);
      });
      grid.addEventListener("dragover", (event) => event.preventDefault());
      grid.addEventListener("drop", (event) => {
        event.preventDefault();
        const tokenId = event.dataTransfer?.getData("text/plain") || this.draggingMapTokenId || this.selectedMapTokenId;
        const room = this.client.isConnected && this.client.room
          ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
          : normalizeServerRoom(this.room, this.options.getCurrentCharacter());
        const point = this.mapPointFromEvent(event, normalizeScene(room.scene, this.options.getCurrentCharacter()));
        this.selectedMapTokenId = tokenId;
        this.handleMapPoint(point);
        this.draggingMapTokenId = "";
      });
    });
    this.root.querySelectorAll("[data-vtt-copy]").forEach((button) => {
      button.addEventListener("click", () => this.copyLauncherText(button.dataset.vttCopy || ""));
    });
    this.root.querySelectorAll("[data-vtt-launcher-reduced-fx]").forEach((input) => {
      input.addEventListener("change", () => this.setLauncherReducedFx(input.checked));
    });
    this.root.querySelectorAll("[data-vtt-launcher-join-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        this.joinLocalAddress(data.get("address"));
      });
    });
    this.root.querySelectorAll("[data-vtt-modal-close]").forEach((button) => {
      button.addEventListener("click", (event) => {
        if (event.target !== button && button.classList.contains("vtt-modal-backdrop")) return;
        const modal = button.dataset.vttModalClose;
        if (modal === "item") this.closeShopItemDetails();
        if (modal === "loot") this.closeLootModal();
        if (modal === "monster") this.closeMonsterSheet();
        if (modal === "campaigns") {
          this.campaignPanelOpen = false;
          this.render();
        }
        if (modal === "campaign-form") this.closeCampaignForm();
        if (modal === "launcher") this.closeLauncherModal();
        if (modal === "gm-form") this.closeGmForm();
        if (modal === "scene-editor") this.closeSceneEditor();
        if (modal === "encounter-editor") this.closeEncounterEditor();
        if (modal === "report-preview") this.closeReportPreview();
        if (modal === "gm") {
          this.gmPanelOpen = false;
          this.render();
        }
      });
    });
    this.root.querySelectorAll("[data-vtt-monster-attack]").forEach((button) => {
      button.addEventListener("click", () => this.rollMonsterAttack(button.dataset.vttMonsterAttack, button.dataset.attackIndex));
    });
    this.root.querySelectorAll("[data-vtt-monster-attack-target]").forEach((button) => {
      button.addEventListener("click", () => this.rollMonsterAttack(button.dataset.vttMonsterAttackTarget, button.dataset.attackIndex, { compareTarget: true }));
    });
    this.root.querySelectorAll("[data-vtt-monster-damage]").forEach((button) => {
      button.addEventListener("click", () => this.rollMonsterDamage(button.dataset.vttMonsterDamage, button.dataset.attackIndex));
    });
    this.root.querySelectorAll("[data-vtt-monster-damage-target]").forEach((button) => {
      button.addEventListener("click", () => this.rollMonsterDamage(button.dataset.vttMonsterDamageTarget, button.dataset.attackIndex, { applyToTarget: true }));
    });
    this.root.querySelectorAll("[data-vtt-monster-loot]").forEach((button) => {
      button.addEventListener("click", () => this.createLootFromMonster(button.dataset.vttMonsterLoot));
    });
  }
}

export function mountSolarisSessionUI(root, options = {}) {
  return new SolarisSessionUI(root, options);
}
