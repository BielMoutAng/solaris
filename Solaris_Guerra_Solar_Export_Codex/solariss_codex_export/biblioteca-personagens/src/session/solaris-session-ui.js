import {
  GAME_EVENT_TYPES,
  GameRoom,
  SESSION_ROLES,
} from "./solaris-session-domain.js?v=20260620c";
import {
  SESSION_SOCKET_EVENTS,
  SolarisSessionClient,
} from "./solaris-session-client.js?v=20260620c";

const SESSION_SAVE_KEY = "solaris.virtual.table.session.v1";
const PLAYER_SESSION_KEY = "solaris.virtual.table.playerId";

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
    mapImage: scene.mapImage || "",
    gridSize: Number(scene.gridSize || 64),
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
    objectives: Array.isArray(scene.objectives) ? scene.objectives : [],
  };
}

function tokenInitial(token = {}) {
  return String(token.name || token.entityType || "S").trim().slice(0, 1).toUpperCase() || "S";
}

function tokenKindClass(token = {}) {
  if (token.entityType === "monster") return "enemy";
  if (token.hidden) return "hidden";
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

function rollPool(count = 3, sides = 6, bonus = 0) {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return {
    rolls,
    total: rolls.reduce((sum, value) => sum + value, 0) + Number(bonus || 0),
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
  utility: "Utilitarios",
  material: "Materiais",
  service: "Servicos",
};

function normalizeSearch(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  if (text.includes("material")) return "material";
  if (text.includes("servico") || text.includes("serviço")) return "service";
  if (text.includes("utilitario") || text.includes("utilitario")) return "utility";
  return fallback;
}

function normalizeShopCatalogItem(item = {}, fallbackCategory = "common") {
  const category = inferShopCategory(item, fallbackCategory);
  const price = Math.max(0, numberFromPrice(item.price ?? item.cost ?? item.officialData?.["Preco em Lz"] ?? item.officialData?.["Preço em Lz"]));
  return {
    ...item,
    id: String(item.id || item.uid || createId("shop-catalog")),
    name: String(item.name || "Item sem nome"),
    sessionCategory: category,
    categoryLabel: SHOP_CATEGORY_LABELS[category] || "Item",
    tier: String(item.tier || item.rank || item.cost || ""),
    price,
    weight: item.weight || item.peso || "",
    summary: item.summary || item.effect || item.description || "",
    source: item.source || "Catalogo Solaris",
    type: item.type || item.category || category,
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
  const maxPV = Number(monster.maxPV ?? monster.pvMax ?? monster.pv ?? 24);
  const currentPV = Number(monster.currentPV ?? monster.pvAtual ?? monster.pvCurrent ?? maxPV);
  return {
    id: monster.instanceId || `${monster.id || "monster"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    definitionId: monster.id || monster.definitionId || "",
    name: monster.name || "Monstro sem nome",
    snapshot: {
      ...monster,
      name: monster.name || "Monstro sem nome",
      currentPV,
      maxPV,
      pv: maxPV,
      ca: Number(monster.ca ?? 10),
      movement: Number(monster.movement ?? monster.movimento ?? 6),
      image: monster.imageDataUrl || monster.image || "",
      imageDataUrl: monster.imageDataUrl || monster.image || "",
      tier: monster.tier || "",
      type: monster.type || "",
      role: monster.role || "",
      attacks: monster.attacks || [],
      abilities: monster.abilities || [],
    },
    conditions: [],
    hidden: false,
  };
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
  const players = Array.isArray(room.players) && room.players.length
    ? room.players.map((player) => {
      const character = (room.characters || []).find((entry) => entry.ownerPlayerId === player.id);
      const snapshot = characterSnapshot(character?.snapshot || {});
      return {
        id: player.id,
        name: player.name,
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
    this.selectedMapTokenId = "";
    this.draggingMapTokenId = "";
    this.shopQuery = "";
    this.shopCategory = "all";
    this.shopTier = "all";
    this.shopSort = "name";
    this.shopPage = 1;
    this.shopCart = [];
    this.lootPanelOpen = true;
    this.localSheetRevision = Number(current.revision || 0);
    this.lastRoomSequence = 0;
    this.characterRevisionMap = new Map();
    this.bindClient();
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

  approveRequest(approvalId = "") {
    if (this.client.isConnected) this.client.approveApproval(approvalId);
  }

  rejectRequest(approvalId = "") {
    if (this.client.isConnected) this.client.rejectApproval(approvalId);
  }

  shopCatalog() {
    const source = this.options.getShopCatalog();
    return (Array.isArray(source) && source.length ? source : defaultSessionShopCatalog())
      .map((item) => normalizeShopCatalogItem(item, item.sessionCategory || item.category || "common"));
  }

  filteredShopCatalog() {
    const query = normalizeSearch(this.shopQuery);
    const tier = String(this.shopTier || "all");
    const items = this.shopCatalog().filter((item) => {
      const haystack = normalizeSearch([item.name, item.type, item.summary, item.source, item.tier].join(" "));
      const categoryMatch = this.shopCategory === "all" || item.sessionCategory === this.shopCategory;
      const tierMatch = tier === "all" || String(item.tier || "").toLowerCase() === tier.toLowerCase();
      return categoryMatch && tierMatch && (!query || haystack.includes(query));
    });
    return items.sort((a, b) => {
      if (this.shopSort === "price-asc") return a.price - b.price || a.name.localeCompare(b.name);
      if (this.shopSort === "price-desc") return b.price - a.price || a.name.localeCompare(b.name);
      if (this.shopSort === "tier") return String(a.tier || "Z").localeCompare(String(b.tier || "Z")) || a.name.localeCompare(b.name);
      if (this.shopSort === "category") return String(a.categoryLabel).localeCompare(String(b.categoryLabel)) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }

  addShopItemToCart(itemId = "") {
    const item = this.shopCatalog().find((entry) => entry.id === itemId);
    if (!item) return;
    const existing = this.shopCart.find((line) => line.item.id === item.id);
    if (existing) existing.quantity += 1;
    else this.shopCart.push({ id: createId("cart-line"), item, quantity: 1, price: item.price });
    if (this.client.isConnected) this.client.updateShopCart(this.currentSheetId(), this.shopCart);
    this.options.notify(`${item.name} entrou no carrinho.`);
    this.render();
  }

  removeShopCartLine(lineId = "") {
    this.shopCart = this.shopCart.filter((line) => line.id !== lineId);
    if (this.client.isConnected) this.client.updateShopCart(this.currentSheetId(), this.shopCart);
    this.render();
  }

  clearShopCart() {
    this.shopCart = [];
    if (this.client.isConnected) this.client.updateShopCart(this.currentSheetId(), []);
    this.render();
  }

  requestShopCartPurchase({ direct = false } = {}) {
    if (!this.shopCart.length) {
      this.options.notify("Carrinho vazio.");
      return;
    }
    const total = this.shopCart.reduce((sum, line) => sum + cartLineTotal(line), 0);
    const current = this.currentSheetSnapshot();
    if (Number(current.currency || current.luzentis || 0) < total) {
      this.options.notify("Luzentis insuficientes para essa compra.", "tech-error");
      return;
    }
    if (!this.client.isConnected) {
      this.completeOfflinePurchase(this.shopCart, total);
      this.clearShopCart();
      return;
    }
    this.client.requestShopPurchase(this.currentSheetId(), this.shopCart, { total, direct });
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
      location: { kind: "unassigned" },
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
    const name = window.prompt("Nome do pacote de loot", "Loot da cena");
    if (!name) return;
    const luzentis = this.promptNumber("Luzentis no pacote", 0);
    if (luzentis === null) return;
    const firstCartItem = this.shopCart[0] || null;
    const pack = {
      name,
      luzentis,
      items: firstCartItem ? [firstCartItem] : [],
      notes: firstCartItem ? "Criado a partir do primeiro item do carrinho." : "Pacote manual sem itens.",
    };
    if (this.client.isConnected) this.client.createLootPack(pack);
    else {
      this.room.lootPacks = [{ ...pack, id: createId("loot"), status: "pending", createdAt: new Date().toISOString() }, ...(this.room.lootPacks || [])];
      this.render();
    }
    this.options.notify("Pacote de loot criado.");
  }

  distributeLootPackPrompt(lootPackId = "") {
    const room = this.client.isConnected && this.client.room
      ? normalizeServerRoom(this.client.room, this.options.getCurrentCharacter())
      : this.room;
    const pack = (room.lootPacks || []).find((entry) => entry.id === lootPackId);
    if (!pack) return;
    const characterId = window.prompt("ID do personagem destino", this.currentSheetId());
    if (!characterId) return;
    if (this.client.isConnected) {
      this.client.distributeLootPack(pack.id, characterId);
      return;
    }
    this.options.notify("Modo offline: distribua itens pela ficha local ou conecte ao servidor.");
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

  saveSession() {
    localStorage.setItem(SESSION_SAVE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      room: this.room,
    }));
    this.options.notify("Sessao local salva.");
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
      return;
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
    const selectedToken = scene.tokens.find((token) => token.id === this.selectedMapTokenId) || scene.tokens[0] || null;
    if (!this.selectedMapTokenId && selectedToken) this.selectedMapTokenId = selectedToken.id;
    return `
      <section class="vtt-map-panel">
        <div class="vtt-map-toolbar">
          <div>
            <strong>Mapa tatico</strong>
            <span>${escapeHtml(scene.columns)} x ${escapeHtml(scene.rows)} casas</span>
          </div>
          <button type="button" data-vtt-map-action="sync-tokens">Tokens</button>
          <button type="button" data-vtt-map-action="edit-scene">Cena</button>
          <button type="button" data-vtt-map-action="add-danger">Perigo</button>
          <button type="button" data-vtt-map-action="add-cover">Cobertura</button>
        </div>
        <div
          class="vtt-map-grid"
          data-vtt-map-grid
          data-columns="${escapeHtml(scene.columns)}"
          data-rows="${escapeHtml(scene.rows)}"
          aria-label="Mapa tatico da cena"
          style="--map-columns:${escapeHtml(scene.columns)};--map-rows:${escapeHtml(scene.rows)};${scene.mapImage ? `--map-image:url('${escapeHtml(scene.mapImage)}');` : ""}"
        >
          <div class="vtt-map-glow"></div>
          <div class="vtt-grid-coordinate top-left">A1</div>
          <div class="vtt-grid-coordinate bottom-right">${escapeHtml(gridLabel(scene.columns, scene.rows))}</div>
          ${(scene.zones || []).map((zone) => `
            <span
              class="vtt-map-zone ${escapeHtml(zone.type || "danger")}"
              title="${escapeHtml(zone.label || "Zona")}"
              style="${zoneGridStyle(zone, scene)}"
            >
              ${escapeHtml(zone.label || "Zona")}
            </span>
          `).join("")}
          ${(scene.objectives || []).filter((objective) => objective.x && objective.y).map((objective) => `
            <span
              class="vtt-map-objective ${objective.completed ? "completed" : ""}"
              style="${tokenGridStyle({ x: objective.x, y: objective.y, color: "#f2c35b" }, scene)}"
              title="${escapeHtml(objective.label)}"
            >
              OBJ
            </span>
          `).join("")}
          ${(scene.tokens || []).map((token) => `
            <button
              type="button"
              class="vtt-map-token ${tokenKindClass(token)} ${token.id === this.selectedMapTokenId ? "selected" : ""} ${token.locked ? "locked" : ""}"
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
          </div>
        </div>
        <div class="vtt-map-footer">
          <span>${combat.active ? `Combate ativo: rodada ${escapeHtml(combat.round || 1)}` : "Cena livre"}</span>
          <span>${escapeHtml((scene.tokens || []).length)} token${(scene.tokens || []).length === 1 ? "" : "s"}</span>
          <span>${escapeHtml((scene.zones || []).length)} zona${(scene.zones || []).length === 1 ? "" : "s"}</span>
        </div>
        <div class="vtt-quick-actions">
          <button type="button" data-vtt-roll="Teste rapido" data-count="3" data-sides="6">Rolar</button>
          <button type="button" data-vtt-roll="Ataque" data-count="1" data-sides="20">Atacar</button>
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
      <article class="vtt-shop-card">
        <div>
          <span>${escapeHtml(item.categoryLabel)}</span>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml([item.tier ? `Tier ${item.tier}` : "", item.type].filter(Boolean).join(" - "))}</small>
        </div>
        <p>${escapeHtml(detail || item.summary || "Item oficial da biblioteca Solaris.")}</p>
        <footer>
          <em>${escapeHtml(item.source || "Livro 5")}</em>
          <strong>${Number(item.price || 0).toLocaleString("pt-BR")} ℓ</strong>
          <button type="button" data-vtt-shop-add="${escapeHtml(item.id)}">Adicionar</button>
          <button type="button" data-vtt-shop-buy-now="${escapeHtml(item.id)}">Comprar Agora</button>
        </footer>
      </article>
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

  render() {
    if (!this.root) return;
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

    this.root.innerHTML = `
      <section class="vtt-shell" aria-label="Mesa Virtual Solaris">
        <header class="vtt-topbar">
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
            <button type="button" data-vtt-action="save-session">Salvar Sessao</button>
          </div>
        </header>

        <aside class="vtt-left">
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

        <main class="vtt-main">
          <section class="vtt-panel vtt-session">
            <div class="vtt-session-copy">
              <p>Resumo da cena atual</p>
              <h2>${escapeHtml(room.scene?.name || "Corredor de Manutencao - Nivel 2")}</h2>
              <span>${escapeHtml(room.scene?.notes || "Area reservada para mapas, grid, tokens e linha de visao.")}</span>
            </div>
            <div class="vtt-offline-banner">
              <strong>${this.client.isConnected ? "Mesa sincronizada por LAN/Radmin" : "Modo simulado/offline"}</strong>
              <span>${this.client.isConnected ? `Ficha completa, inventario e combate em sessao. ${syncLabel}.` : "O app continua funcionando como ficha local. Ligue o servidor para multiplayer."}</span>
            </div>
          </section>

          ${this.renderTacticalMap(room, current, combat)}
          ${this.renderSessionShop(room, current)}

          <section class="vtt-bottom">
            ${this.renderSelectedCharacter(current)}
            ${this.renderActiveItems(current)}
            <div class="vtt-sheet-actions">
              <button type="button" data-vtt-action="open-inventory">Abrir Inventario</button>
              <button type="button" data-vtt-action="open-sheet">Ver Ficha</button>
              <button type="button" data-vtt-action="sync-sheet">Sincronizar</button>
              <button type="button" data-vtt-action="request-sync">Pedir sync</button>
            </div>
          </section>
        </main>

        <aside class="vtt-right">
          ${this.renderCombatPanel(combat)}
          ${this.renderApprovalPanel(room, pendingApprovals)}
          ${this.renderLootPanel(room)}
          <section class="vtt-panel">
            <div class="vtt-panel-heading">
              <h3>Objetivos</h3>
              <span>sessao</span>
            </div>
            <div class="vtt-objectives">
              ${room.objectives.map((objective) => `
                <article>
                  <strong>${escapeHtml(objective.label)}</strong>
                  <span>${escapeHtml(objective.progress)}</span>
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

        <footer class="vtt-quickbar">
          ${this.renderQuickSlot("Cubo", "3")}
          ${this.renderQuickSlot("Arma", "1")}
          ${this.renderQuickSlot("Armadura", "1")}
          ${this.renderQuickSlot("Chip", "2")}
          ${this.renderQuickSlot("Magia", "2")}
          ${Array.from({ length: 4 }, () => this.renderQuickSlot("+", "")).join("")}
        </footer>
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
          <button type="button" data-vtt-roll-initiative="${escapeHtml(combatant.entityId)}">Iniciativa</button>
          <button type="button" data-vtt-damage-combatant="${escapeHtml(combatant.entityId)}">Dano</button>
          <button type="button" data-vtt-heal-combatant="${escapeHtml(combatant.entityId)}">Cura</button>
          <button type="button" data-vtt-condition-combatant="${escapeHtml(combatant.entityId)}">Condicao</button>
          ${combatant.entityType === "monster" ? `<button type="button" class="danger" data-vtt-delete-monster="${escapeHtml(combatant.entityId)}">Remover</button>` : ""}
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
    this.root.querySelectorAll("[data-vtt-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttAction;
        if (action === "create-room") this.createRoom();
        if (action === "join-room") this.joinRoom();
        if (action === "leave-room") this.leaveRoom();
        if (action === "save-session") this.saveSession();
        if (action === "open-sheet") this.options.onOpenCharacter();
        if (action === "open-inventory") this.options.onOpenInventory();
        if (action === "sync-sheet") this.syncCurrentSheet();
        if (action === "request-sync") this.requestCurrentSheetSync();
        if (action === "use-item") this.sessionUseItem();
        if (action === "move-item") this.sessionMoveItem();
        if (action === "equip-item") this.sessionEquipItem();
        if (action === "request-purchase") this.requestPurchaseApproval();
        if (action === "request-sale") this.requestSaleApproval();
        if (action === "request-delete") this.requestDeleteApproval();
      });
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
    this.root.querySelectorAll("[data-vtt-approval-approve]").forEach((button) => {
      button.addEventListener("click", () => this.approveRequest(button.dataset.vttApprovalApprove));
    });
    this.root.querySelectorAll("[data-vtt-approval-reject]").forEach((button) => {
      button.addEventListener("click", () => this.rejectRequest(button.dataset.vttApprovalReject));
    });
    this.root.querySelector("[data-vtt-shop-query]")?.addEventListener("change", (event) => {
      this.shopQuery = event.currentTarget.value;
      this.shopPage = 1;
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
    this.root.querySelector("[data-vtt-shop-sort]")?.addEventListener("change", (event) => {
      this.shopSort = event.currentTarget.value;
      this.shopPage = 1;
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
    this.root.querySelectorAll("[data-vtt-shop-buy-now]").forEach((button) => {
      button.addEventListener("click", () => {
        this.addShopItemToCart(button.dataset.vttShopBuyNow);
        this.requestShopCartPurchase();
      });
    });
    this.root.querySelectorAll("[data-vtt-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => this.removeShopCartLine(button.dataset.vttCartRemove));
    });
    this.root.querySelectorAll("[data-vtt-shop-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttShopAction;
        if (action === "clear-cart") this.clearShopCart();
        if (action === "request-purchase") this.requestShopCartPurchase();
        if (action === "direct-purchase") this.requestShopCartPurchase({ direct: true });
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
    this.root.querySelectorAll("[data-vtt-map-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.vttMapAction;
        if (action === "sync-tokens") this.syncSceneTokens();
        if (action === "edit-scene") this.editScene();
        if (action === "add-danger") this.addSceneZone("danger");
        if (action === "add-cover") this.addSceneZone("cover");
      });
    });
    this.root.querySelectorAll("[data-vtt-map-token]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
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
        this.moveMapToken(this.selectedMapTokenId, point.x, point.y);
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
        this.moveMapToken(tokenId, point.x, point.y);
        this.draggingMapTokenId = "";
      });
    });
  }
}

export function mountSolarisSessionUI(root, options = {}) {
  return new SolarisSessionUI(root, options);
}
