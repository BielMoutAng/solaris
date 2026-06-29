export const CHARACTER_CREATION_SCHEMA_VERSION = 2;
export const CHARACTER_CREATION_CACHE_VERSION = "20260624g";
export const TABLETOP_ALPHA_VERSION = "0.6.0-alpha.21";

export const CREATION_RULE_SOURCE = Object.freeze({
  book: "Livro 1 base do jogador.docx",
  chapters: Object.freeze([
    "Capitulo 4 - Criacao de Personagem",
    "Capitulo 6 - Atributos",
    "Capitulo 7 - Pericias",
    "Capitulo 9 - Equipamento Inicial",
    "Capitulo 39 - Progressao, Subida de Nivel e Desenvolvimento",
  ]),
});

export const CREATION_ATTRIBUTES = Object.freeze(["FOR", "REF", "CON", "MEN", "PRE", "INT"]);
export const CREATION_ATTRIBUTE_BASE = 7;
export const CREATION_ATTRIBUTE_MOD_BASE = 10;
export const STARTING_LUZENTIS = 2000;

export const PLAYABLE_RACES = Object.freeze(["humanis", "zerak", "veyrkan", "kairi"]);

export const OFFICIAL_SKILLS_BY_ATTRIBUTE = Object.freeze({
  FOR: Object.freeze(["Atletismo", "Briga", "Demolicao", "Coleta"]),
  REF: Object.freeze(["Furtividade", "Maos Leves", "Acrobacia", "Pilotagem", "Pes Ageis"]),
  CON: Object.freeze([]),
  MEN: Object.freeze(["Cosmos", "Memoria Cosmica", "Intuicao Cosmica", "Percepcao Cosmica", "Busca Cosmica"]),
  PRE: Object.freeze(["Intimidacao", "Persuasao", "Empatia", "Acalmar Criatura", "Performance", "Atuacao"]),
  INT: Object.freeze(["Tecnologia", "Medicina", "Engenharia", "Biologia", "Culinaria", "Busca"]),
});

export const LEVEL_ONE_STARTING_LOADOUT = Object.freeze({
  luzentis: STARTING_LUZENTIS,
  cubesFormula: "5 + MOD FOR",
  weapon: "1 arma Tier F",
  armor: "1 armadura Tier F",
  supplyKit: "1 kit de suprimento",
  professionKit: "Itens do kit da profissao",
  languages: "Idioma Comum + idioma da raca, se usado",
  note: "Arma e armadura iniciais fazem parte do equipamento basico e nao consomem os 2000 Luzentis.",
});

export const OFFICIAL_CREATION_STAGES = Object.freeze([
  Object.freeze({
    title: "Conceito e identidade",
    officialSteps: "Passo 1",
    summary: "Defina quem era o personagem, o que perdeu, por que se arrisca e qual funcao pratica ocupa no grupo.",
    fields: "Nome, jogador, origem, objetivo pessoal, ligacao com o grupo e notas.",
    tip: "Um bom personagem de Solaris tem funcao, motivo para continuar e uma relacao clara com o mundo destruido.",
  }),
  Object.freeze({
    title: "Raca e origem",
    officialSteps: "Passos 2 e 3",
    summary: "Escolha uma das quatro racas jogaveis e registre bonus, visao, idioma, habilidade inicial e fraqueza.",
    fields: "Humanis, Zerak, Veyrkan ou Kairi; atributo racial; habilidade e fraqueza racial.",
    tip: "Humanis escolhe +1 em qualquer atributo e uma pericia treinada adicional; as outras racas seguem seus bonus proprios.",
  }),
  Object.freeze({
    title: "Atributos",
    officialSteps: "Passos 4, 5 e 6",
    summary: "Role 7d6, descarte o menor, distribua os seis dados e calcule os modificadores.",
    fields: "FOR, REF, CON, MEN, PRE e INT.",
    tip: "Formula oficial: atributo = 7 + dado distribuido. O modificador e o numero usado nas rolagens.",
  }),
  Object.freeze({
    title: "Chip de profissao",
    officialSteps: "Passo 7",
    summary: "Escolha o treinamento inicial do personagem: foco, talento, kit e penalidade.",
    fields: "Profissao/chip, foco +1, talento, kit inicial e penalidade.",
    tip: "O chip de profissao nao e classe fixa; ele registra o que o personagem sabia fazer antes da campanha.",
  }),
  Object.freeze({
    title: "Pericias e ignorancias",
    officialSteps: "Passo 8",
    summary: "Escolha duas pericias treinadas livres, registre foco da profissao e marque ignorancias permitidas pelo mestre.",
    fields: "Pericias treinadas, foco profissional, ignorancias e observacoes.",
    tip: "Pericia treinada concede vantagem. Ignorancia concede desvantagem. Foco de profissao concede +1 fixo.",
  }),
  Object.freeze({
    title: "Derivados e recursos",
    officialSteps: "Passo 9",
    summary: "Confira PV, CA, Cosmos, movimento, iniciativa, JPs, carga, cubos e percepcao passiva.",
    fields: "PV atual/maximo, CA, Cosmos, Estresse, Movimento, JPF/JPR/JPC, carga e cubos.",
    tip: "A ficha digital recalcula os principais derivados quando atributos, raca, nivel e equipamentos mudam.",
  }),
  Object.freeze({
    title: "Equipamento e finalizacao",
    officialSteps: "Passo 10",
    summary: "Receba Luzentis, cubos, arma Tier F, armadura Tier F, kit de suprimento, kit da profissao e idiomas.",
    fields: "Inventario inicial, historia, vinculos, ficha salva/exportada.",
    tip: "O equipamento inicial nao deve consumir os 2000 Luzentis de partida.",
  }),
]);

export const OFFICIAL_CREATION_CHECKLIST = Object.freeze([
  "Nome do personagem",
  "Raca",
  "Profissao/Chip",
  "Conceito",
  "Objetivo pessoal",
  "Ligacao com o grupo",
  "Atributos",
  "Modificadores",
  "Pericias treinadas",
  "Ignorancias, se houver",
  "PV maximo e atual",
  "CA",
  "Cosmos maximo e atual",
  "Movimento",
  "Iniciativa",
  "Jogadas de Protecao",
  "Percepcao passiva",
  "Carga maxima",
  "Cubos disponiveis",
  "Arma inicial",
  "Armadura inicial",
  "Kit de suprimento",
  "Kit da profissao",
  "Dinheiro inicial em Luzentis",
  "Idiomas",
  "Habilidade racial",
  "Talento da profissao",
  "Penalidade da profissao",
  "Fraqueza racial, se houver",
  "Anotacoes de historia",
]);

export const LEVEL_XP_REQUIREMENTS = Object.freeze({
  1: 0,
  2: 1000,
  3: 3000,
  4: 6000,
  5: 10000,
  6: 15000,
  7: 21000,
  8: 28000,
  9: 36000,
  10: 45000,
});

export function characterModifier(value) {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : CREATION_ATTRIBUTE_BASE;
  return Math.floor((numeric - CREATION_ATTRIBUTE_MOD_BASE) / 2);
}

export function createInitialAttributeRoll(random = Math.random) {
  const rolls = Array.from({ length: 7 }, () => Math.floor(random() * 6) + 1);
  const discardedIndex = rolls.reduce((lowestIndex, value, index) => (
    value < rolls[lowestIndex] ? index : lowestIndex
  ), 0);
  const kept = rolls.filter((_, index) => index !== discardedIndex);
  return { rolls, kept, discardedIndex };
}

export function applyInitialAttributeAssignments(kept, assignments) {
  if (!Array.isArray(kept) || kept.length !== CREATION_ATTRIBUTES.length) {
    throw new Error("E necessario ter 6 dados mantidos para aplicar os atributos.");
  }

  const indexes = CREATION_ATTRIBUTES.map((attribute) => Number(assignments?.[attribute]));
  if (indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= kept.length)) {
    throw new Error("Todos os atributos precisam receber um dado valido.");
  }
  if (new Set(indexes).size !== CREATION_ATTRIBUTES.length) {
    throw new Error("Cada dado mantido deve ser usado uma unica vez.");
  }

  return CREATION_ATTRIBUTES.reduce((attributes, attribute, position) => {
    attributes[attribute] = CREATION_ATTRIBUTE_BASE + Number(kept[indexes[position]]);
    return attributes;
  }, {});
}

export function buildCreationChoicesSnapshot(character = {}, context = {}) {
  const skillTraining = character.skillTraining && typeof character.skillTraining === "object"
    ? character.skillTraining
    : {};
  const trainedSkills = Object.entries(skillTraining)
    .filter(([, state]) => state === "trained")
    .map(([skill]) => skill);
  const ignorantSkills = Object.entries(skillTraining)
    .filter(([, state]) => state === "ignorant")
    .map(([skill]) => skill);
  const attributes = CREATION_ATTRIBUTES.reduce((acc, attribute) => {
    acc[attribute] = Number(character.attributes?.[attribute] ?? CREATION_ATTRIBUTE_BASE);
    return acc;
  }, {});

  return {
    schemaVersion: CHARACTER_CREATION_SCHEMA_VERSION,
    sourceBook: CREATION_RULE_SOURCE.book,
    sourceChapters: [...CREATION_RULE_SOURCE.chapters],
    appVersion: context.appVersion || TABLETOP_ALPHA_VERSION,
    cacheVersion: context.cacheVersion || CHARACTER_CREATION_CACHE_VERSION,
    raceId: character.race || "humanis",
    raceName: context.raceName || "",
    racialChoice: character.racialChoice || "",
    professionId: character.profession || "escolha-profissao",
    professionName: context.professionName || "",
    level: Number(character.level || 1),
    experience: Number(character.experience || 0),
    attributes,
    initialAttributeRoll: character.initialAttributeRoll || { rolls: [], kept: [] },
    trainedSkills,
    ignorantSkills,
    professionFocus: context.professionFocus || "",
    humanisExtraSkillAvailable: character.race === "humanis",
    startingLoadout: { ...LEVEL_ONE_STARTING_LOADOUT },
    recordedAt: context.recordedAt || new Date().toISOString(),
    reason: context.reason || "sync",
  };
}

export function validateCreationCharacter(character = {}) {
  const issues = [];
  if (!PLAYABLE_RACES.includes(character.race)) issues.push("Raca jogavel invalida para criacao padrao.");
  if (!character.profession || character.profession === "escolha-profissao") issues.push("Escolha um chip de profissao antes de jogar.");
  CREATION_ATTRIBUTES.forEach((attribute) => {
    const value = Number(character.attributes?.[attribute]);
    if (!Number.isFinite(value) || value < CREATION_ATTRIBUTE_BASE || value > 20) {
      issues.push(`${attribute} deve ficar entre ${CREATION_ATTRIBUTE_BASE} e 20 na criacao padrao.`);
    }
  });
  if (Number(character.level || 1) !== 1 && !Array.isArray(character.progressionHistory)) {
    issues.push("Personagens acima do nivel 1 precisam manter historico de progressao.");
  }
  return { valid: issues.length === 0, issues };
}

export function buildProgressionHistoryEntry({
  previousLevel,
  targetLevel,
  roll,
  benefit,
  choice = "",
  requirement = {},
  cost = 0,
  experience = 0,
  currencyBefore = 0,
  currencyAfter = 0,
  completedAt = new Date().toISOString(),
} = {}) {
  return {
    schemaVersion: CHARACTER_CREATION_SCHEMA_VERSION,
    sourceBook: CREATION_RULE_SOURCE.book,
    sourceChapter: "Capitulo 39 - Progressao, Subida de Nivel e Desenvolvimento",
    previousLevel: Number(previousLevel || 1),
    level: Number(targetLevel || previousLevel || 1),
    targetLevel: Number(targetLevel || previousLevel || 1),
    roll: Number(roll || 0),
    benefit: benefit?.name || String(benefit || ""),
    effect: benefit?.effect || "",
    choice,
    xpRequired: Number(requirement.xp || LEVEL_XP_REQUIREMENTS[Number(targetLevel)] || 0),
    xpAtUpgrade: Number(experience || 0),
    material: requirement.material || "",
    time: requirement.time || "",
    stationRequired: true,
    cost,
    currencyBefore,
    currencyAfter,
    completedAt,
  };
}
