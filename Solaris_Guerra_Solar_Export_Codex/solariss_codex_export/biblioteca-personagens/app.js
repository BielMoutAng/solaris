import {
  Character as DomainCharacter,
  ENTITY_TYPES,
  INVENTORY_SIZES,
  LOCATION_KINDS,
  MonsterDefinition,
  MonsterSheet,
  buildMonsterLootTable,
  definitionFromLegacyItem,
  inferLegacyInventorySize,
  migrateLegacyCharacterData,
  reconcileLegacyArmorCatalog,
} from "./src/domain/solaris-domain-architecture.js?v=20260615c";
import { mountSolarisSessionUI } from "./src/session/solaris-session-ui.js?v=20260620d";

const ATTRIBUTES = ["FOR", "REF", "CON", "MEN", "PRE", "INT"];
const QUICK_TEST_ATTRIBUTES = ATTRIBUTES.filter((attr) => attr !== "CON");
const ATTRIBUTE_BASE = 7;
const ATTRIBUTE_MOD_BASE = 10;
const STORAGE_KEY = "solaris.character.library.v1";
const MONSTER_STORAGE_KEY = "solaris.monster.library.v1";
const MONSTER_SESSION_STORAGE_KEY = "solaris.monster.session.v1";
const CUSTOM_LIBRARY_STORAGE_KEY = "solaris.custom.content.library.v1";
const SHOP_PRICE_STORAGE_KEY = "solaris.shop.price.overrides.v1";
const PAGE_SIZE = 20;
const LEVEL_COSMOS_BASE = { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 4 };
const STRESS_MAX = 6;
const STARTING_CURRENCY = 2000;
const BASE_CA = 4;
const ARMOR_CA_BY_TIER = Object.freeze({
  F: Object.freeze({ leve: 2, media: 3, pesada: 5 }),
  E: Object.freeze({ leve: 3, media: 4, pesada: 6 }),
  D: Object.freeze({ leve: 4, media: 6, pesada: 8 }),
  C: Object.freeze({ leve: 5, media: 7, pesada: 10 }),
  B: Object.freeze({ leve: 7, media: 9, pesada: 12 }),
  A: Object.freeze({ leve: 8, media: 11, pesada: 14 }),
  S: Object.freeze({ leve: 10, media: 13, pesada: 15 }),
});
const ARMOR_CA_TIER_RULE_SUMMARY = Object.entries(ARMOR_CA_BY_TIER)
  .map(([tier, values]) => `Tier ${tier}: leve +${values.leve}, média +${values.media}, pesada +${values.pesada}`)
  .join("; ");
const ITEM_CRACK_MAX = 5;
const TIER_ORDER = ["F", "E", "D", "C", "B", "A", "S"];
const OFFICIAL_BOOK5 = globalThis.SOLARIS_OFFICIAL_BOOK5 || {
  templates: [],
  catalog: { weapons: [], armors: [], items: [], storage: [], cubes: [], modifierChips: [], mods: [] },
};
const RULEBOOK_COMPENDIUM = globalThis.SOLARIS_RULEBOOK_COMPENDIUM || {
  sources: [],
  sections: [],
};
const RULEBOOK_SECTIONS = Array.isArray(RULEBOOK_COMPENDIUM.sections)
  ? RULEBOOK_COMPENDIUM.sections
  : [];
const CUBE_WEIGHT_KG = 1;
const CURRENCY_NAME = "Luzentis";
const LEVEL_UP_REQUIREMENTS = {
  2: { xp: 1000, material: "5 Barras de Ferrita", time: "2 horas" },
  3: { xp: 3000, material: "5 Barras de Paralatum", time: "2 horas" },
  4: { xp: 6000, material: "5 Barras de Paralatum + Ferrita fundidas", time: "2 horas" },
  5: { xp: 10000, material: "5 Barras de Ourium", time: "2 horas" },
  6: { xp: 15000, material: "5 Barras de Palatita", time: "4 horas" },
  7: { xp: 21000, material: "5 Barras de Palatita + Ourium fundidas", time: "4 horas" },
  8: { xp: 28000, material: "5 Barras de Adamantina", time: "4 horas" },
  9: { xp: 36000, material: "5 Barras de liga Adamantita + Palatita + Ourium", time: "6 horas" },
  10: { xp: 45000, material: "5 Barras de Vulcanium", time: "6 horas" },
};
const LEVEL_UP_BENEFITS = {
  2: [
    { name: "Perito", effect: "Ganhe 1 perícia treinada à escolha.", choice: "skill", trainedSkill: true },
    { name: "Vital", effect: "+1d4 PV permanentes.", permanentPvRoll: 4 },
    { name: "Surto de Ação", effect: "1 vez por descanso completo, pode atacar 2 vezes no seu turno." },
    { name: "Estressado", effect: "+1 Estresse fixo.", stressFloor: 1 },
    { name: "Soneca", effect: "Recupera +1d4 PV extra em descanso rápido." },
    { name: "Estômago de Aço", effect: "Sem penalidade por comida estragada ou água turva." },
  ],
  3: [
    { name: "Afinidade Paralatum", effect: "-1 Dificuldade em craft que use Paralatum." },
    { name: "Circuito Estável", effect: "1 vez por descanso de vigília, ignora Jammed." },
    { name: "Mão Certeira", effect: "+1 na primeira jogada de ataque do turno." },
    { name: "Eletroestático", effect: "A primeira vez que sofrer dano elétrico em cada combate: +1 dano." },
    { name: "Pulso Fino", effect: "Troca de arma e ataca em seguida 1 vez por combate." },
    { name: "Reparo Ligeiro", effect: "1 vez por descanso de vigília, repara 1d4 rachaduras de arma ou armadura com kit." },
  ],
  4: [
    { name: "Mecano-reflexo", effect: "+1 em um teste de Engenharia." },
    { name: "Dorso Firme", effect: "+1 PV permanente e ignora 1 ponto de concussão 1 vez por turno.", permanentPvBonus: 1 },
    { name: "Contra-golpe Inercial", effect: "Ao levar concussão, +1d4 no próximo ataque corpo a corpo, 1 vez por combate." },
    { name: "Interferência", effect: "-1 no teste de Furtividade.", passiveEffects: [{ target: "skill", key: "Furtividade", value: -1, label: "Furtividade -1" }] },
    { name: "Chassi Ajustado", effect: "+1 m de deslocamento quando sem carga pesada." },
    { name: "Pinça Universal", effect: "Abrir ou fechar compartimento difícil vira ação simples 1 vez por cena." },
  ],
  5: [
    { name: "Nariz de Cristal", effect: "+2 para rastrear cristais ou Cosmos." },
    { name: "Eco Mental", effect: "1 vez por descanso de vigília, converte 1 Estresse em +1 no próximo teste de PRE." },
    { name: "Estalo Místico", effect: "+1 no primeiro teste de PRE do dia." },
    { name: "Vertigem Cósmica", effect: "Ao entrar em Escuridão Cósmica, teste MEN 11; falha: -1 no próximo teste." },
    { name: "Camada de Silício", effect: "-1d4 de dano laser/plasma 1 vez por combate." },
    { name: "Limiar Consciente", effect: "A primeira falha em Medo/Terror por dia vira sucesso parcial." },
  ],
  6: [
    { name: "Casco Ajustado", effect: "+1 CA enquanto parado ou Aguardando." },
    { name: "Ferramental Pesado", effect: "-1 Dificuldade em instalar carenagens ou placas." },
    { name: "Pé de Chumbo", effect: "+1 para resistir empurrões ou derrubar." },
    { name: "Tranco Inflexível", effect: "-1 em testes de Acrobacia.", passiveEffects: [{ target: "skill", key: "Acrobacia", value: -1, label: "Acrobacia -1" }] },
    { name: "Fixador Rápido", effect: "1 vez por descanso completo, estabiliza motor ou mecanismo com +2 em Engenharia." },
    { name: "Respiração Compassada", effect: "+1 no primeiro teste de Briga ou Atletismo da cena." },
  ],
  7: [
    { name: "Sinergia Tecnomística", effect: "+1 em Tecnologia ou PRE, escolha 1, na primeira rolagem por descanso completo.", choice: "technology-or-pre" },
    { name: "Lente Interna", effect: "Vantagem 1 vez por descanso de vigília para identificar fluxos." },
    { name: "Amortecedor Ósseo", effect: "1 vez por cena, reduza 1d4 de concussão recebida." },
    { name: "Descarga Sensível", effect: "Ao fazer uma rolagem de ataque, sofre -1 no ataque.", passiveEffects: [{ target: "attack", value: -1, label: "Ataques -1" }] },
    { name: "Mecânico", effect: "-1 Dificuldade ao consertar veículos de Paralatum, Ourium ou Palatita." },
    { name: "Chispa de Ação", effect: "1 vez por descanso de vigília, transforma uma ação simples em ação simples." },
  ],
  8: [
    { name: "Espinha Rígida", effect: "+2 PV permanentes.", permanentPvBonus: 2 },
    { name: "Bloqueio Instintivo", effect: "+1 CA contra o primeiro ataque que o acerte na cena." },
    { name: "Postura Estável", effect: "Vantagem 1 vez por combate contra derrubar ou arrastar." },
    { name: "Peso Morto", effect: "-1 m de deslocamento quando carregado com equipamento pesado." },
    { name: "Punho Seguro", effect: "+1 no ataque corpo a corpo.", passiveEffects: [{ target: "attack", scope: "melee", value: 1, label: "Ataque corpo a corpo +1" }] },
    { name: "Regra da Casa", effect: "-1 Dificuldade para reparar rachaduras de armaduras." },
  ],
  9: [
    { name: "Matrix Estável", effect: "Na primeira falha de Tecnologia da cena, trate como sucesso parcial." },
    { name: "Sintonia de Núcleo", effect: "1 vez por cena, recarrega 1 carga de mod." },
    { name: "Ressonância de Campo", effect: "-1 dano laser/plasma por fonte." },
    { name: "Resíduo de Estresse", effect: "Ao tirar falha crítica em perícia, ganha +1 Estresse." },
    { name: "Sangue Frio", effect: "+1 em testes de Percepção." },
    { name: "Ferramenta Fantasma", effect: "Cria ferramentas cósmicas usadas em Engenharia com +1." },
  ],
  10: [
    { name: "Trilho Vulcânico", effect: "+1 em Pilotagem ou Briga, escolha 1, na primeira rolagem 1 vez por descanso de vigília.", choice: "pilot-or-fight" },
    { name: "Inércia Contida", effect: "1 vez por combate, reduz 1d6 de dano explosivo recebido." },
    { name: "Tônus Supremo", effect: "+1 em uma Jogada de Proteção à escolha, 1 vez por descanso de vigília.", choice: "protection" },
    { name: "Calor Residual", effect: "A primeira vez que sofrer dano de fogo no combate recebe 1d6 extra de dano." },
    { name: "Marcha Forçada", effect: "+1 m de deslocamento fora de combate." },
    { name: "Mestre de Bancada", effect: "-1 Dificuldade em um tipo de craft à escolha: Armas, Armaduras ou Mods.", choice: "craft" },
  ],
};
const CURRENCY_SYMBOL = "ℓ";
const OFFICIAL_BOOKS = globalThis.SOLARIS_OFFICIAL_BOOKS || {
  templates: [],
  catalog: { weapons: [], armors: [], items: [], mods: [] },
  bestiary: [],
  rules: [],
};
const OFFICIAL_TEMPLATE_TYPE_MAP = {
  item: "equipment",
  weapon: "weapon",
  armor: "armor",
  mod: "mod",
  cube: "cube",
  "special-item": "special-item",
  crafting: "crafting",
  vehicle: "vehicle",
  pursuit: "pursuit",
  drone: "drone",
  turret: "turret",
  robot: "robot",
  hacking: "hacking",
  network: "network",
  shop: "shop",
  "black-market": "black-market",
};
const PASSIVE_ATTRIBUTE_ALIASES = { ESP: "PRE" };
const COSMIC_SPELL_SLOT_RULE_SUMMARY = "Cada magia cósmica conhecida ocupa 1 espaço de magia. Espaços podem vir de equipamentos canalizadores, chips modificadores, treino durante timeskip e grimórios encontrados na campanha.";
const CUBE_TYPE_DEFINITIONS = {
  simple: {
    label: "Cubo simples",
    summary: "Isola 1 item, amostra, relíquia, cristal ou componente perigoso. Não possui variações.",
    fixedCapacity: 1,
    materialMode: "single",
  },
  cargo: {
    label: "Cubo de carga",
    summary: "Transporta até 10 unidades do item ou recurso exato definido pelo primeiro conteúdo.",
    fixedCapacity: null,
    materialMode: "exact-first-item",
  },
  specialized: {
    label: "Cubo especializado",
    summary: "Transporta até 10 unidades da categoria técnica definida pelo primeiro conteúdo.",
    fixedCapacity: null,
    materialMode: "family-first-item",
  },
};
const EXTERNAL_SUPPORT_TYPES = [
  {
    id: "gancho",
    label: "Ganchos",
    singular: "Gancho",
    keywords: ["gancho", "ganchos"],
    accepts: ["item", "weapon"],
  },
  {
    id: "coldre",
    label: "Coldres",
    singular: "Coldre",
    keywords: ["coldre", "coldres"],
    accepts: ["weapon"],
  },
  {
    id: "bandoleira",
    label: "Bandoleiras",
    singular: "Bandoleira",
    keywords: ["bandoleira", "bandoleiras"],
    accepts: ["item", "weapon"],
  },
];

const skillData = [
  { name: "Atletismo", attr: "FOR", summary: "Corrida, salto, escalada, natação, abrir passagens, derrubar portas e erguer objetos." },
  { name: "Briga", attr: "FOR", summary: "Combate desarmado, agarrões, imobilizações, quedas, arremessos e desarmes corpo a corpo. Ataque sem arma usa Briga para 1d6 base." },
  { name: "Demolição", attr: "FOR", summary: "Força bruta contra estruturas e máquinas: derrubar paredes, arrombar cofres, quebrar grades ou arrancar cabos." },
  { name: "Coleta", attr: "FOR", summary: "Usar força para coleta de materiais como minérios, madeira e materiais energéticos." },
  { name: "Furtividade", attr: "REF", summary: "Esconder-se, mover-se em silêncio, camuflagem e infiltração. Para ficar furtivo, supere a percepção passiva do alvo." },
  { name: "Mãos Leves", attr: "REF", summary: "Bater carteiras, abrir fechaduras, desarmar armadilhas e fazer manipulação delicada." },
  { name: "Acrobacia", attr: "REF", summary: "Equilíbrio, saltos difíceis, rolamentos e quedas controladas." },
  { name: "Pilotagem", attr: "REF", summary: "Controle de naves, veículos, exoesqueletos ou máquinas em movimento, incluindo manobras evasivas e combate veicular." },
  { name: "Pés Ágeis", attr: "REF", summary: "Movimentos rápidos de fuga, dança corporal, deslocamento em combate e escapar de armadilhas já ativas." },
  { name: "Cosmos", attr: "MEN", summary: "Sentir cosmos: perceber energias, presenças e distúrbios cósmicos." },
  { name: "Memória Cósmica", attr: "MEN", summary: "História e saberes universais ligados ao cosmos, incluindo conhecimentos históricos, mitológicos ou científicos." },
  { name: "Intuição Cósmica", attr: "MEN", summary: "Antecipar eventos e conectar informações de forma instintiva por meio de energias cósmicas." },
  { name: "Percepção Cósmica", attr: "MEN", summary: "Perceber quando algo está errado pelas variações do cosmos. Percepção passiva racial: 10 + MOD MEN." },
  { name: "Busca Cósmica", attr: "MEN", summary: "Procurar itens, rastros ou alvos por energia cósmica e conhecimento relacionado." },
  { name: "Intimidação", attr: "PRE", summary: "Usar presença, voz ou postura para forçar respeito ou medo." },
  { name: "Persuasão", attr: "PRE", summary: "Convencer, negociar, inspirar confiança ou manipular socialmente." },
  { name: "Empatia", attr: "PRE", summary: "Perceber emoções, intenções, mentiras, medo e motivações ocultas." },
  { name: "Acalmar Criatura", attr: "PRE", summary: "Tentar domesticar ou acalmar criatura capaz de compreender o personagem, evitando combate quando ela ataca por medo." },
  { name: "Performance", attr: "PRE", summary: "Música, dança, canto, discurso público, expressão artística e apresentações que influenciam o ambiente social ou emocional." },
  { name: "Atuação", attr: "PRE", summary: "Fingimento, interpretação de papel, disfarce emocional, blefe social e sustentação de uma identidade falsa." },
  { name: "Tecnologia", attr: "INT", summary: "Interagir com sistemas digitais, hackear e obter dados." },
  { name: "Medicina", attr: "INT", summary: "Estancar sangramento, fazer remédios, realizar cirurgias, identificar doenças e estabilizar aliados em 1d4 turnos." },
  { name: "Engenharia", attr: "INT", summary: "Reparar e construir equipamentos, consertar veículos e fazer modificações em oficinas de equipamentos e mods." },
  { name: "Biologia", attr: "INT", summary: "Aprender sobre fauna e flora e descobrir propriedades de plantas e componentes animais." },
  { name: "Culinária", attr: "INT", summary: "Preparar alimentos com os materiais disponíveis: sucesso total prepara tudo, parcial prepara metade, falha não gera alimento comestível." },
  { name: "Busca", attr: "INT", summary: "Examinar rastros, marcas, mapas físicos, passagens, documentos, objetos, sucata e detalhes materiais do ambiente." },
];

const protectionData = [
  { name: "JPF", attr: "FOR", attrs: ["FOR", "CON"], summary: "JP física: integridade física, músculos e saúde. Role com MOD FOR ou MOD CON, conforme a situação pedida pelo mestre." },
  { name: "JPR", attr: "REF", summary: "JP de Reflexo: tempo de reação, esquiva, explosões, quedas, armadilhas e situações rápidas." },
  { name: "JPC", attr: "MEN", attrs: ["MEN", "PRE"], summary: "JP Cósmica: use MEN contra energia, distorção e interferência; use PRE contra medo, possessão emocional e pressão espiritual." },
];

const attributeDetailData = {
  FOR: {
    name: "Força",
    summary: "Representa potência muscular, esforço físico, impacto e capacidade de mover, erguer, romper ou dominar fisicamente.",
  },
  REF: {
    name: "Reflexo",
    summary: "Representa coordenação, precisão, velocidade de reação, equilíbrio, deslocamento e controle corporal.",
  },
  CON: {
    name: "Constituição",
    summary: "Representa resistência física, saúde, vigor, tolerância a esforço, ferimentos, doenças e condições ambientais.",
  },
  MEN: {
    name: "Mentalidade",
    summary: "Representa percepção e compreensão do Cosmos, memória cósmica, intuição e resistência a interferências mentais.",
  },
  PRE: {
    name: "Presença",
    summary: "Representa espírito, força emocional, influência social, empatia, persuasão e imposição da vontade.",
  },
  INT: {
    name: "Intelecto",
    summary: "Representa conhecimento técnico, raciocínio, medicina, engenharia, biologia, tecnologia e análise material.",
  },
};

const manualCreationTemplates = {
  item: {
    title: "Formato de item",
    format: "Nome | Peso | Preço | Efeito/Descrição | Tags",
    example: "Ex.: Kit de reparo rápido | 1 Kg | 800 | Remove 1 rachadura | reparo, utilitário",
    fields: {
      tier: { hidden: true },
      subtype: { hidden: true },
      price: { label: "Preço", placeholder: "800" },
      weight: { label: "Peso", placeholder: "1 Kg" },
      power: { hidden: true },
      mods: { hidden: true },
      cosmos: { hidden: true },
      tags: { label: "Tags", placeholder: "reparo, utilitário, luz" },
      effect: { placeholder: "Descreva o efeito mecânico ou narrativo do item." },
    },
  },
  weapon: {
    title: "Formato de arma",
    format: "Nome | Tier | Grupo/Tipo | Dano | Mods | Peso | Preço | Efeito",
    example: "Ex.: Pistola de Ferrita | F | Pistola / Perfurante | 1d4 | 0 | 0,5 Kg | 1500 | Carregador com 6 munições",
    fields: {
      tier: { label: "Tier", placeholder: "F, E, D, C, B, A, S" },
      subtype: { label: "Grupo / tipo", placeholder: "Pistola, rifle, espada, machado..." },
      price: { label: "Preço", placeholder: "1500" },
      weight: { label: "Peso", placeholder: "0,5 Kg" },
      power: { label: "Dano", placeholder: "1d4, 1d6+1, 2d6..." },
      mods: { label: "Mods", placeholder: "0" },
      cosmos: { hidden: true },
      tags: { label: "Tags", placeholder: "pistola, perfurante, 2-8 m" },
      effect: { placeholder: "Descreva alcance, carregador, regra especial ou observações da arma." },
    },
  },
  armor: {
    title: "Formato de armadura",
    format: "Nome | Tier | Tipo | CA | Mods | Cosmos | Peso | Preço | Efeito",
    example: "Ex.: Colete Tático | E | Ranged | CA 6 | 1 | 0 | 12 Kg | 90 | Projetado para manobras rápidas",
    fields: {
      tier: { label: "Tier", placeholder: "F, E, D, C, B, A, S" },
      subtype: { label: "Tipo", placeholder: "CaC, Ranged, Cósmica, Suporte..." },
      price: { label: "Preço", placeholder: "90" },
      weight: { label: "Peso", placeholder: "12 Kg" },
      power: { label: "CA", placeholder: "6 ou CA 6" },
      mods: { label: "Mods", placeholder: "1" },
      cosmos: { label: "Cosmos bônus", placeholder: "0" },
      tags: { label: "Tags", placeholder: "leve, suporte, cosmos" },
      effect: { placeholder: "Descreva a proteção, habilidade passiva, slots ou regra da armadura." },
    },
  },
  cosmos: {
    title: "Formato de magia cósmica",
    format: "Nome | Custo de Cosmos | Duração | Efeito | Tags",
    example: "Ex.: Rajada Cósmica | 1 | Instantânea | 1d6 energético, ignora 1 CA | dano, alcance 10 m",
    fields: {
      tier: { label: "Custo de Cosmos", placeholder: "1, 2, 3, 4, 6, 8, 10" },
      subtype: { hidden: true },
      price: { hidden: true },
      weight: { label: "Duração", placeholder: "Instantânea, 1 rodada, 1 cena..." },
      power: { label: "Dano / alcance", placeholder: "1d6, cura 2d6, alcance 10 m..." },
      mods: { hidden: true },
      cosmos: { hidden: true },
      tags: { label: "Tags", placeholder: "dano, cura, defesa, controle" },
      effect: { placeholder: "Descreva o efeito completo da magia e qualquer teste exigido." },
    },
  },
  "chip-mod": {
    title: "Formato de chip modificador",
    format: "Nome | Rank/Tier | Tipo | Efeito | Tags",
    example: "Ex.: Equalizador de Estresse D-08 | D | Neural | Consome 1 estresse para recuperar 1d4 PV | estresse, cura",
    fields: {
      tier: { label: "Rank / Tier", placeholder: "F, E, D, C, B, A, S" },
      subtype: { label: "Tipo", placeholder: "Neural, arma, armadura, suporte..." },
      price: { hidden: true },
      weight: { hidden: true },
      power: { label: "Bônus / custo", placeholder: "+1, 1x/dia, consome 1..." },
      mods: { hidden: true },
      cosmos: { hidden: true },
      tags: { label: "Tags", placeholder: "estresse, cura, ataque, defesa" },
      effect: { placeholder: "Descreva o efeito do chip, limite de uso e penalidade se existir." },
    },
  },
  ability: {
    title: "Formato de habilidade solta",
    format: "Nome | Fonte | Gatilho/Bônus | Efeito | Tags",
    example: "Ex.: Instinto de Sobrevivência | Raça | 1x/cena | Rerrola teste de proteção física | raça, proteção",
    fields: {
      tier: { label: "Fonte", placeholder: "Raça, arma, armadura, evento..." },
      subtype: { label: "Categoria", placeholder: "Passiva, reação, ação, talento..." },
      price: { hidden: true },
      weight: { hidden: true },
      power: { label: "Gatilho / bônus", placeholder: "1x/cena, +2, reação..." },
      mods: { hidden: true },
      cosmos: { hidden: true },
      tags: { label: "Tags", placeholder: "raça, proteção, passiva" },
      effect: { placeholder: "Descreva a regra da habilidade e quando ela pode ser usada." },
    },
  },
};

const icons = {
  user: '<svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
  orbit: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M4.9 19.1c-2.5-2.5.4-7.8 6.5-11.7s13-5.3 15.5-2.8-.4 7.8-6.5 11.7-13 5.3-15.5 2.8z" transform="scale(.78) translate(3 3)"/><path d="M19.1 19.1c2.5-2.5-.4-7.8-6.5-11.7S-.4 2.1-2.9 4.6s.4 7.8 6.5 11.7 13 5.3 15.5 2.8z" transform="scale(.78) translate(3 3)"/></svg>',
  chip: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M7 2v3M12 2v3M17 2v3M7 19v3M12 19v3M17 19v3M2 7h3M2 12h3M2 17h3M19 7h3M19 12h3M19 17h3"/></svg>',
  sword: '<svg viewBox="0 0 24 24"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6 2 2-6 6z"/><path d="m16 16-2 2"/></svg>',
  skull: '<svg viewBox="0 0 24 24"><path d="M8 18v-2a4 4 0 0 1-3-4V9a7 7 0 0 1 14 0v3a4 4 0 0 1-3 4v2"/><path d="M10 21h4"/><path d="M10 14h.01M14 14h.01M12 17v4"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  package: '<svg viewBox="0 0 24 24"><path d="m7.5 4.3 9 5.2"/><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/></svg>',
  printer: '<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 2 14.7 9.3 22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z"/></svg>',
};

const raceData = [
  {
    id: "humanis",
    name: "Humanis",
    bonus: {},
    choice: { label: "Atributo racial", options: ATTRIBUTES, amount: 1 },
    ca: 4,
    pvBonus: 0,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    extraTrainedSkills: 1,
    tags: ["adaptável", "explorador", "+1 atributo", "+1 perícia"],
    summary: "Adaptáveis e versáteis. Escolhem qualquer atributo para receber +1 e uma perícia treinada adicional.",
    profile: {
      age: "100-120 anos / maturidade aos 18",
      build: "1,75m / 70-90 kg",
      attributeBonus: "+1 em qualquer atributo",
      documentCosmos: "0",
      culture: "Adaptáveis, curiosos e exploradores.",
      baseAbility: "Adaptabilidade Humana: 1x por cena, recebe +1 em um teste de perícia na qual não seja treinado. Gente de Sistema: +1 em testes sociais simples para negociar trabalho, comida, abrigo ou informação com comunidades civilizadas.",
      weakness: "Sem Especialização Natural: não recebe resistência natural, visão especial ou afinidade cósmica automática.",
      skill: "Escolhe 1 perícia treinada adicional. Adaptabilidade Humana dá +1, uma vez por cena, em uma perícia na qual o Humanis não seja treinado.",
      note: "Visão comum, com 3 m de visão no escuro pelo padrão do sistema. Idioma Comum.",
    },
    progression: [],
    documentNotes: ["Regras raciais atualizadas conforme o Livro 1. Progressões raciais antigas foram removidas por não aparecerem nos Livros 1 e 2."],
  },
  {
    id: "veyrkan",
    name: "Veyrkan",
    bonus: {},
    choice: { label: "Atributo racial", options: ["MEN", "INT"], amount: 1 },
    ca: 4,
    pvBonus: 0,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["anfíbio", "padrões", "MEN ou INT"],
    summary: "Anfíbios sensíveis a padrões, energia e frequências. Escolhem MEN ou INT para receber +1.",
    profile: {
      age: "Até 150 anos / maturidade aos 16",
      build: "1,80m / ~80 kg",
      attributeBonus: "+1 MEN ou +1 INT",
      documentCosmos: "0",
      culture: "Anfíbios, científicos e atentos a padrões, energia, vibração e fluxo.",
      baseAbility: "Leitura de Padrões: 1x por cena, recebe +1 em Tecnologia, Engenharia, Percepção Cósmica, Busca Cósmica ou análise energética. Anfíbio Parcial: +1 em testes adequados de locomoção, resistência ou percepção em água e umidade.",
      weakness: "Secura Corporal: em ambiente extremamente seco, quente ou desidratante, sofre -1 em testes de CON até se reidratar ou descansar adequadamente.",
      skill: "Não concede perícia treinada extra. Leitura de Padrões dá +1, uma vez por cena, em Tecnologia, Engenharia, Percepção Cósmica, Busca Cósmica ou análise energética.",
      note: "Visão infravermelha limitada a 10 m. Idiomas Comum e Veyrkan, se usados na campanha.",
    },
    progression: [],
    documentNotes: ["Regras raciais atualizadas conforme o Livro 1. Progressões raciais antigas foram removidas por não aparecerem nos Livros 1 e 2."],
  },
  {
    id: "zerak",
    name: "Zerak",
    bonus: {},
    choice: { label: "Atributo racial", options: ["FOR", "CON"], amount: 1 },
    ca: 4,
    pvBonus: 2,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["força", "disciplina", "+1 FOR/CON", "+2 PV"],
    summary: "A muralha viva. Escolhem FOR ou CON para receber +1 e começam com +2 PV.",
    profile: {
      age: "Até 120 anos / maturidade aos 15",
      build: "1,85m / 110-130 kg",
      attributeBonus: "+1 FOR ou +1 CON",
      documentCosmos: "0",
      culture: "Disciplina, hierarquia, força como status e resistência física.",
      baseAbility: "Corpo de Rocha: +2 PV no nível 1. Promessa de Rocha: 1x por descanso curto, transforma em sucesso parcial uma falha apropriada de JPF, JPR ou JPC que o faria abandonar uma posição defensiva.",
      weakness: "Peso da Pedra: -1 em Furtividade com armadura média ou pesada ou ao atravessar áreas frágeis, silenciosas ou instáveis.",
      skill: "Não concede perícia treinada extra. Corpo de Rocha aumenta os PV e Peso da Pedra pode aplicar -1 em Furtividade.",
      note: "Visão de penumbra até 10 m. Idiomas Comum e Zerakhul, se usados na campanha.",
    },
    progression: [],
    documentNotes: ["Regras raciais atualizadas conforme o Livro 1. Progressões raciais antigas foram removidas por não aparecerem nos Livros 1 e 2."],
  },
  {
    id: "kairi",
    name: "Kairi",
    bonus: {},
    choice: { label: "Atributo racial", options: ["MEN", "PRE"], amount: 1 },
    ca: 4,
    pvBonus: 0,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["cosmos", "mediação", "MEN ou PRE"],
    summary: "Ligados aos ciclos naturais e aos sinais de Tarantus. Escolhem MEN ou PRE para receber +1.",
    profile: {
      age: "Até 180 anos / maturidade aos 20",
      build: "1,70m / 60-75 kg",
      attributeBonus: "+1 MEN ou +1 PRE",
      documentCosmos: "0",
      culture: "Espirituais, ligados ao equilíbrio do Cosmos.",
      baseAbility: "Escutar o Mundo: 1x por cena, recebe do mestre uma impressão sensorial sobre perigo, desequilíbrio ou segurança. Freio do Ciclo: 1x por descanso curto, um sucesso parcial apropriado pode reduzir em 1 o Estresse de um aliado.",
      weakness: "Peso do Desrespeito: agressão ecológica ou profanação gratuita pode causar +1 Estresse ou desvantagem no próximo teste de MEN ou PRE.",
      skill: "Não concede perícia treinada extra. Freio do Ciclo interage com Empatia, Acalmar Criatura, Percepção Cósmica e Intuição Cósmica.",
      note: "Visão de penumbra até 10 m. Idiomas Comum e Kairi.",
    },
    progression: [],
    documentNotes: ["Regras raciais atualizadas conforme o Livro 1. Progressões raciais antigas foram removidas por não aparecerem nos Livros 1 e 2."],
  },
];

const professionData = [
  {
    id: "escolha-profissao",
    name: "Escolha uma profissão",
    focus: "",
    skill: "",
    talent: "",
    kit: "",
    penalty: "",
    notes: "Use este item apenas como marcador inicial da ficha.",
    cubeBonus: 0,
    tags: ["marcador"],
    summary: "Marcador inicial. Escolha um chip de profissão antes de jogar.",
  },
  {
    id: "medico",
    name: "Médico",
    focus: "+1 em Medicina",
    skill: "Medicina",
    talent: "Estabilizar Rápido — 1×/cena, tenta estabilizar um aliado como ação simples; em sucesso, ele também recupera +1d4 PV.",
    kit: "Cubo de medicina — permite carregar 2 kits de medicina.",
    penalty: "Juramento Prioritário — desvantagem no primeiro ataque.",
    notes: "",
    cubeBonus: 0,
    tags: ["suporte", "cura", "medicina"],
    summary: "Chip de suporte médico focado em estabilização, cura emergencial e kits de medicina.",
  },
  {
    id: "hacker",
    name: "Hacker",
    focus: "+1 em Tecnologia",
    skill: "Tecnologia",
    talent: "Flow — ao quebrar dois nós em sequência, ganha +1 em outros testes de tecnologia na rede.",
    kit: "Mini-notebook — possui 2 RAM.",
    penalty: "Pegada Digital — na 1ª invasão de cada cena, a Detecção da rede tem +1 contra você.",
    notes: "",
    cubeBonus: 0,
    tags: ["rede", "tecnologia", "invasão"],
    summary: "Chip para invasão, protocolos digitais, rede e suporte tecnológico.",
  },
  {
    id: "mecanico",
    name: "Mecânico",
    focus: "+1 em Engenharia",
    skill: "Engenharia",
    talent: "Remendo Esperto — conserto de campo recupera +1d6 PV/placa em veículo/robô 1×/cena.",
    kit: "Jogo de ferramentas + 1 bateria Tier E.",
    penalty: "Mãos Engorduradas — −1 nas jogadas de ataque.",
    notes: "",
    cubeBonus: 0,
    tags: ["engenharia", "reparo", "veículos"],
    summary: "Chip de reparo, máquinas, veículos e manutenção em campo.",
  },
  {
    id: "eletricista",
    name: "Eletricista",
    focus: "+1 em Engenharia",
    skill: "Engenharia",
    talent: "Desjam — 1×/cena, remove Jammed de uma arma, console, porta, dispositivo ou sistema simples como ação simples.",
    kit: "Detector IR simples + 10 m de cabo condutor.",
    penalty: "Corrente de Fuga — ao falhar em Engenharia, recebe 1 dano elétrico.",
    notes: "",
    cubeBonus: 0,
    tags: ["engenharia", "energia", "jammed"],
    summary: "Chip voltado a energia, cabos, sensores e correções elétricas rápidas.",
  },
  {
    id: "espiao",
    name: "Espião",
    focus: "+1 em Furtividade",
    skill: "Furtividade",
    talent: "Perfil Baixo — ignora a primeira câmera/observador da cena.",
    kit: "Camaleão de pano — +1 Furtividade em sombras.",
    penalty: "Paranoia Operacional — em cena social longa, busca por vigilância é obrigatória.",
    notes: "",
    cubeBonus: 0,
    tags: ["furtividade", "infiltração"],
    summary: "Chip de infiltração, sombras e evasão de vigilância.",
  },
  {
    id: "perseguidor",
    name: "Perseguidor",
    focus: "+1 em Busca/Percepção",
    skill: "Busca Cósmica",
    talent: "Rota Silenciosa — grupo ignora terreno difícil natural em viagens longas.",
    kit: "Pó marcador + apito sônico.",
    penalty: "Foco no Rastro — em combate fechado sofre −1 em Briga.",
    notes: "Caso prefira, troque a perícia foco para Percepção Cósmica.",
    cubeBonus: 0,
    tags: ["rastreamento", "exploração"],
    summary: "Chip de rastreamento, busca e deslocamento em terreno hostil.",
  },
  {
    id: "mineiro",
    name: "Mineiro",
    focus: "+1 em Coleta",
    skill: "Coleta",
    talent: "Veio Rico — ao minerar, 1d4: em 3–4 ganha +1 material extra.",
    kit: "Picareta reforçada — arma improvisada 1d6 concussão.",
    penalty: "Peso Extra — −1 slot de cubo.",
    notes: "",
    cubeBonus: -1,
    tags: ["coleta", "materiais", "cubos -1"],
    summary: "Chip de coleta mineral e extração de materiais, com −1 slot de cubo automático.",
  },
  {
    id: "campeao-lsr",
    name: "Campeão de LSR",
    focus: "+1 em Briga",
    skill: "Briga",
    talent: "Golpe Limpo — crítico com 19–20 em ataques desarmados.",
    kit: "Bandagens de mãos.",
    penalty: "Sangue Quente — ao errar ataque desarmado, −1 CA no próximo turno.",
    notes: "",
    cubeBonus: 0,
    tags: ["briga", "desarmado"],
    summary: "Chip de combate desarmado e presença de arena.",
  },
  {
    id: "piloto",
    name: "Piloto",
    focus: "+1 em Pilotagem",
    skill: "Pilotagem",
    talent: "Mão Firme — 1×/cena, falha em manobra vira sucesso parcial.",
    kit: "Óculos HUD simples.",
    penalty: "Vertigem Terrestre — fora de veículos, 1ª Acrobacia da cena tem −1.",
    notes: "",
    cubeBonus: 0,
    tags: ["pilotagem", "veículos"],
    summary: "Chip para manobras, navegação e controle de veículos.",
  },
  {
    id: "medium",
    name: "Médium",
    focus: "+1 em Intuição Cósmica ou Percepção Cósmica",
    skill: "Intuição Cósmica",
    talent: "Eco Cósmico — 1×/cena, converte +1 Estresse que receberia em +1 no próximo teste de MEN ou PRE ligado ao fenômeno.",
    kit: "Talismã — permite canalização cósmica pelo talismã.",
    penalty: "Paranoia Cósmica — sucesso parcial em percepção pode trazer informações confusas.",
    notes: "Ajustável para Empatia/Percepção Cósmica conforme a campanha.",
    cubeBonus: 0,
    tags: ["cosmos", "presságios", "PRE"],
    summary: "Chip sensitivo para presságios, canalização e leitura de ecos cósmicos.",
  },
  {
    id: "forjador",
    name: "Forjador",
    focus: "+1 em Engenharia",
    skill: "Engenharia",
    talent: "Bainha Fria — reduz em −1 material comum o custo de um craft por sessão.",
    kit: "Mini-forja portátil nível 1 + 1 barra de Ferrita.",
    penalty: "Obcecado por Acabamento — −1 em ataque com armas que não foram feitas por ele.",
    notes: "",
    cubeBonus: 0,
    tags: ["craft", "forja", "engenharia"],
    summary: "Chip de fabricação, bancada e economia de materiais.",
  },
  {
    id: "atirador-elite",
    name: "Atirador de Elite",
    focus: "+1 em ataques com armas longas de precisão",
    skill: "",
    talent: "Respiração Controlada — ignora distância mínima e dobra alcance máximo.",
    kit: "Visor de estabilização — +1 no 1º ataque do combate com arma longa.",
    penalty: "Lento para Mudar — −2 no próximo ataque após andar.",
    notes: "",
    cubeBonus: 0,
    tags: ["arma longa", "precisão"],
    summary: "Chip de tiro preciso, alcance e controle respiratório.",
  },
  {
    id: "soldado",
    name: "Soldado",
    focus: "+1 em Briga",
    skill: "Briga",
    talent: "Disciplina — vantagem em um teste de MEN contra Medo/Terror por cena.",
    kit: "Luvas militares — vantagens para segurar arma.",
    penalty: "Rotina Dura — −1 em testes sociais de sutileza.",
    notes: "",
    cubeBonus: 0,
    tags: ["combate", "disciplina"],
    summary: "Chip militar para linha de frente, medo/terror e controle de campo.",
  },
  {
    id: "guarda-interestelar",
    name: "Guarda Interestelar",
    focus: "+1 em Busca para risco, patrulha, ameaça e segurança",
    skill: "Busca",
    talent: "Comando Legal — 1×/cena, impõe −1 no primeiro teste social hostil contra você.",
    kit: "Algemas inteligentes — 1 uso.",
    penalty: "Procedimental — gasta 1 ação avaliando protocolos ou sofre −1 no 1º teste social.",
    notes: "",
    cubeBonus: 0,
    tags: ["percepção", "autoridade"],
    summary: "Chip de patrulha, autoridade e leitura de ameaça.",
  },
  {
    id: "biologo",
    name: "Biólogo",
    focus: "+1 em Biologia",
    skill: "Biologia",
    talent: "Soro Rápido — cria 1 antídoto básico em 10 min 1×/sessão.",
    kit: "Misturador portátil + tubos.",
    penalty: "Curiosidade Perigosa — ao ver criatura ou material novo, falha em MEN CD 10 perde a ação simples.",
    notes: "",
    cubeBonus: 0,
    tags: ["biologia", "antídoto"],
    summary: "Chip de estudo biológico, criaturas, amostras e antídotos.",
  },
  {
    id: "domador-feras",
    name: "Domador de Feras",
    focus: "+1 em Acalmar Criatura",
    skill: "Acalmar Criatura",
    talent: "Meu Pet — 1×/dia, após sucesso completo em acalmar criatura, 20 no d20 adestra como pet; 1 a torna hostil.",
    kit: "Assovio harmônico + cordas.",
    penalty: "Vínculo Exposto — se aliado animal cair, recebe +1 Estresse 1×/cena.",
    notes: "",
    cubeBonus: 0,
    tags: ["criaturas", "vínculo"],
    summary: "Chip para criaturas, domesticação e vínculos animais.",
  },
  {
    id: "musico",
    name: "Músico",
    focus: "+1 em Performance/moral",
    skill: "Performance",
    talent: "Ritmo de Guerra — 1×/cena, aliados a 6 m ganham +1 no próximo teste por 5 rodadas.",
    kit: "Instrumento compacto.",
    penalty: "Ritmo Visado — enquanto tocar, sofre −1 CA.",
    notes: "",
    cubeBonus: 0,
    tags: ["moral", "suporte"],
    summary: "Chip de moral, ritmo de combate e suporte de grupo.",
  },
  {
    id: "artista",
    name: "Artista",
    focus: "+1 em Atuação/Enganar",
    skill: "Atuação",
    talent: "Máscara Social — 1×/cena, vantagem numa interação social curta.",
    kit: "Tintas/patches para marcações discretas.",
    penalty: "Ego Performático — após sucesso completo social, −1 em outro teste social no turno seguinte.",
    notes: "O foco pode ser trocado para Performance ao escolher a profissão.",
    cubeBonus: 0,
    tags: ["social", "persuasão"],
    summary: "Chip social para atuação, enganação e presença em cena.",
  },
  {
    id: "catador-sucatas",
    name: "Catador de Sucatas",
    focus: "+1 em Busca",
    skill: "Busca",
    talent: "Desmonta & Leva — ao destruir máquina, extrai 1 peça comum 1×/cena.",
    kit: "Cubo de sucatas — capacidade 3 sucatas pequenas.",
    penalty: "Barulho de Ferragens — −1 em Furtividade usando o cubo.",
    notes: "",
    cubeBonus: 0,
    tags: ["sucata", "busca"],
    summary: "Chip para desmontar máquinas, coletar sucata e achar peças úteis.",
  },
  {
    id: "mestre-destruicao",
    name: "Mestre em Destruição",
    focus: "+1 em Engenharia/explosivos",
    skill: "Engenharia",
    talent: "Brecha Limpa — ao usar explosivo, +1 dado de dano estrutural ou −1 CD para abrir porta/cofre.",
    kit: "2 cargas moldáveis Tier F.",
    penalty: "Mãos Pesadas — +1 CD em Engenharia delicada.",
    notes: "",
    cubeBonus: 0,
    tags: ["explosivos", "engenharia"],
    summary: "Chip de brechas, explosivos e dano estrutural.",
  },
  {
    id: "perito-fuzil",
    name: "Perito em Fuzil",
    focus: "+1 em ataques com fuzis",
    skill: "",
    talent: "Troca Tática — 1×/cena, recarrega usando apenas 1 ação simples.",
    kit: "Coldre de coxa.",
    penalty: "Recuo Conhecido — ao trocar para arma que não seja fuzil, 1º ataque tem desvantagem.",
    notes: "Bônus deve ser lançado na aba Combate, não em Perícias.",
    cubeBonus: 0,
    tags: ["fuzil", "combate"],
    summary: "Chip especializado em fuzis e recarga tática.",
  },
  {
    id: "perito-pistolas",
    name: "Perito em Pistolas",
    focus: "+1 em ataques com pistolas",
    skill: "",
    talent: "Troca Tática — 1×/cena, recarrega usando apenas 1 ação simples.",
    kit: "Coldre de coxa.",
    penalty: "Alcance Curto — a >18 m, ataques de pistola têm −1.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["pistolas", "combate"],
    summary: "Chip especializado em pistolas, saque e recarga.",
  },
  {
    id: "perito-revolver",
    name: "Perito em Revólver",
    focus: "+1 em ataques com revólveres",
    skill: "",
    talent: "Sexto Tiro — o último disparo do tambor causa o dobro de dano.",
    kit: "Coldre de coxa.",
    penalty: "Seis Tiros — ao terminar a recarga, −1 no próximo ataque.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["revólver", "combate"],
    summary: "Chip especializado em revólveres e tiros decisivos.",
  },
  {
    id: "perito-rifles-precisao",
    name: "Perito em Rifles de Precisão",
    focus: "+1 em snipers",
    skill: "",
    talent: "Flow de Longo Alcance — 1×/cena, acertar no alcance máximo efetivo concede +1 na próxima jogada de ataque com rifle de precisão na mesma cena.",
    kit: "Capa ou suporte de transporte para rifle.",
    penalty: "Foco Estático — se mover no turno, sofre −1 em Busca para localizar alvos até o início do próximo turno.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["sniper", "precisão"],
    summary: "Chip especializado em rifles de precisão e alcance máximo.",
  },
  {
    id: "perito-metralhadora",
    name: "Perito em Metralhadora",
    focus: "+1 com metralhadoras",
    skill: "",
    talent: "Troca Tática — 1×/cena, recarrega usando apenas 1 ação simples.",
    kit: "Coldre de coxa.",
    penalty: "Espalhamento — 1ª rajada da cena tem −1 para acertar.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["metralhadora", "combate"],
    summary: "Chip especializado em metralhadoras e rajadas.",
  },
  {
    id: "perito-submetralhadoras",
    name: "Perito em Submetralhadoras",
    focus: "+1 com SMGs",
    skill: "",
    talent: "Troca Tática — 1×/cena, recarrega usando apenas 1 ação simples.",
    kit: "Coldre de coxa.",
    penalty: "Spray & Pray — contra alvos a >12 m, −1 no ataque.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["SMG", "combate"],
    summary: "Chip especializado em submetralhadoras e combate móvel.",
  },
  {
    id: "perito-espadas",
    name: "Perito em Espadas",
    focus: "+1 com espadas",
    skill: "",
    talent: "Postura — +1 CA ao segurar duas espadas.",
    kit: "Bainha rígida.",
    penalty: "Defesa Aberta — após errar golpe, −1 CA até o próximo turno.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["espadas", "corpo a corpo"],
    summary: "Chip especializado em espadas e postura defensiva.",
  },
  {
    id: "perito-machados",
    name: "Perito em Machados",
    focus: "+1 com machados",
    skill: "",
    talent: "Postura — +1 CA ao segurar dois machados.",
    kit: "Pedra de amolar.",
    penalty: "Peso do Corte — após crítico, próximo ataque sofre −1.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["machados", "corpo a corpo"],
    summary: "Chip especializado em machados e cortes pesados.",
  },
  {
    id: "perito-sabres",
    name: "Perito em Sabres",
    focus: "+1 com sabres",
    skill: "",
    talent: "Postura — +1 CA ao segurar dois sabres.",
    kit: "Guarda-mão leve.",
    penalty: "Guarda Alta — +1 CD para resistir empurrão.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["sabres", "corpo a corpo"],
    summary: "Chip especializado em sabres e guarda elevada.",
  },
  {
    id: "perito-lancas",
    name: "Perito em Lanças",
    focus: "+1 com lanças",
    skill: "",
    talent: "Alcance Seguro — reação contra inimigo que entrar a 2 m 1×/cena.",
    kit: "Tala reforçada.",
    penalty: "Túnel de Alcance — inimigo adjacente ganha +1 para agarrar você.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["lanças", "alcance"],
    summary: "Chip especializado em lanças, alcance e reação.",
  },
  {
    id: "perito-martelos",
    name: "Perito em Martelos",
    focus: "+1 com martelos",
    skill: "",
    talent: "Atordoar — 1×/combate, ao acertar com martelo, o alvo faz JPF com CON CD 12; em falha, fica Atordoado e sofre −2 CA até o fim do próximo turno.",
    kit: "Correia de pulso.",
    penalty: "Retorno Lento — após usar Atordoar, inimigos recebem +1 para acertá-lo até o início do próximo turno.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["martelos", "atordoar"],
    summary: "Chip especializado em martelos, impacto e atordoamento.",
  },
  {
    id: "perito-katanas",
    name: "Perito em Katanas",
    focus: "+1 com katanas",
    skill: "",
    talent: "Iaijutsu — golpe desembainhando a katana causa +1d4 no primeiro dano.",
    kit: "Obi/tsuba reforçados.",
    penalty: "Fraqueza Iaijutsu — com katana na bainha, −1 CA.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["katanas", "iaijutsu"],
    summary: "Chip especializado em katanas e golpes de saque.",
  },
  {
    id: "perito-adagas",
    name: "Perito em Adagas",
    focus: "+1 com adagas",
    skill: "",
    talent: "Mão Dupla — 1×/cena, ataque extra com a outra mão sem mods.",
    kit: "Bainha dupla.",
    penalty: "Pressa de Mão Dupla — se atacar com a outra mão, suas JPF com FOR ou CON sofrem −1 até o próximo turno.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["adagas", "mão dupla"],
    summary: "Chip especializado em adagas, velocidade e ataque extra.",
  },
  {
    id: "perito-manoplas",
    name: "Perito em Manoplas",
    focus: "+1 com manoplas",
    skill: "",
    talent: "Soco Direto — chance de derrubar/sacudir o cérebro do inimigo.",
    kit: "Fitas de punho — não ocupam slot.",
    penalty: "Exposto ao Alcance — −1 CA contra armas de alcance ≥2 m.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["manoplas", "briga"],
    summary: "Chip especializado em manoplas e impacto direto.",
  },
  {
    id: "perito-lancadores",
    name: "Perito em Lançadores",
    focus: "+1 com lançadores",
    skill: "",
    talent: "Arco Calculado — ignora cobertura média 1×/combate.",
    kit: "1 granada Tier F à escolha do mestre.",
    penalty: "Recarrega Pesada — após disparo, recarregar exige ação e gera −1 Furtividade.",
    notes: "Bônus deve ser lançado na aba Combate.",
    cubeBonus: 0,
    tags: ["lançadores", "granadas"],
    summary: "Chip especializado em lançadores, granadas e cobertura.",
  },
];

const itemData = Array.isArray(OFFICIAL_BOOK5.catalog.items) ? OFFICIAL_BOOK5.catalog.items : [];

const cubeData = (Array.isArray(OFFICIAL_BOOK5.catalog.cubes) ? OFFICIAL_BOOK5.catalog.cubes : []).map((cube) => ({
  ...cube,
  price: Number.isFinite(cube.price) ? cube.price : 0,
  weight: `${CUBE_WEIGHT_KG} Kg`,
  tags: uniqueTags([...(cube.tags || []), "cubo", "1 kg"]),
}));

const storageMarketData = [
  ...cubeData,
  ...(Array.isArray(OFFICIAL_BOOK5.catalog.storage) ? OFFICIAL_BOOK5.catalog.storage : []),
  {
    id: "system-item-bandoleira-tatica",
    category: "item",
    name: "Bandoleira tática",
    type: "Suporte externo",
    weight: "1 Kg",
    price: 750,
    maxSlots: 1,
    inventorySize: "medium",
    tags: ["item", "armazenamento", "bandoleira", "suporte externo"],
    consumable: false,
    summary: "Suporte para 1 item ou arma de porte médio ou grande. O objeto preso continua contando pelo peso real na sobrecarga.",
    source: "Complemento do sistema Solaris",
    schemaVersion: 2,
  },
];
const commonItemData = itemData;

const weaponData = Array.isArray(OFFICIAL_BOOK5.catalog.weapons) ? OFFICIAL_BOOK5.catalog.weapons : [];
const armorData = Array.isArray(OFFICIAL_BOOK5.catalog.armors) ? OFFICIAL_BOOK5.catalog.armors : [];
const equipmentModData = Array.isArray(OFFICIAL_BOOK5.catalog.mods) ? OFFICIAL_BOOK5.catalog.mods : [];

const cosmicSpellRows = [
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
];

const cosmicSpellData = cosmicSpellRows.map(([cost, name, summary, duration]) => ({
  id: `magia-${dataSlug(name)}`,
  category: "cosmos",
  name,
  cost,
  duration,
  summary,
  tags: ["cosmos", `custo ${cost}`],
}));

const modifierChipData = (Array.isArray(OFFICIAL_BOOK5.catalog.modifierChips)
  ? OFFICIAL_BOOK5.catalog.modifierChips
  : []
).map((chip) => ({
  ...chip,
  passiveEffects: inferModifierChipPassiveEffects({ ...chip, effect: chip.summary }),
}));

const monsterData = Array.isArray(OFFICIAL_BOOKS.bestiary) && OFFICIAL_BOOKS.bestiary.length
  ? OFFICIAL_BOOKS.bestiary
  : [
      { id: "fallback-predador", name: "Predador territorial", tier: "E", type: "Besta", tags: ["emboscada", "rastros"], summary: "Ameaça de exploração externa, normalmente foge quando ferida demais.", assets: [] },
    ];

const monsterSheetTemplates = {
  full: {
    label: "Monstro comum",
    source: "Livro 3, 1.1 e 5.1",
    fields: [
      ["name", "Nome", "text"],
      ["tier", "Tier", "text"],
      ["type", "Tipo", "text"],
      ["imageDataUrl", "Imagem (URL ou data URL)", "text"],
      ["role", "Papel", "text"],
      ["size", "Tamanho", "text"],
      ["habitat", "Habitat", "textarea"],
      ["behavior", "Comportamento", "textarea"],
      ["pv", "PV", "number"],
      ["ca", "CA", "number"],
      ["movement", "Movimento", "text"],
      ["cosmos", "Cosmos máximo", "number"],
      ["stressMax", "Estresse máximo", "number"],
      ["cracksMax", "Rachaduras máximas", "number"],
      ["attributes", "Atributos importantes", "textarea"],
      ["attacks", "Ataques", "textarea"],
      ["abilities", "Habilidades", "textarea"],
      ["conditionsApplied", "Condições que aplica", "textarea"],
      ["resistances", "Resistências", "textarea"],
      ["weaknesses", "Fraquezas", "textarea"],
      ["senses", "Sentidos", "textarea"],
      ["moral", "Moral", "textarea"],
      ["resources", "Recursos coletáveis", "textarea"],
      ["reward", "Recompensa sugerida", "textarea"],
      ["campaign", "Ganchos e uso em campanha", "textarea"],
      ["quickRolls", "Rolagens rápidas", "textarea"],
      ["gmNotes", "Notas do mestre", "textarea"],
    ],
  },
  quick: {
    label: "Ficha curta",
    source: "Livro 3, 1.2 e 5.2",
    fields: [
      ["name", "Nome", "text"],
      ["tier", "Tier", "text"],
      ["type", "Tipo", "text"],
      ["imageDataUrl", "Imagem (URL ou data URL)", "text"],
      ["pv", "PV", "number"],
      ["ca", "CA", "number"],
      ["attack", "Ataque", "text"],
      ["damage", "Dano", "text"],
      ["movement", "Movimento", "text"],
      ["abilities", "Habilidade especial", "textarea"],
      ["behavior", "Comportamento", "textarea"],
      ["resources", "Recurso coletável", "textarea"],
      ["gmNotes", "Notas do mestre", "textarea"],
    ],
  },
  boss: {
    label: "Chefe",
    source: "Livro 3, Capítulos 3 e 5.3",
    fields: [
      ["name", "Nome", "text"],
      ["tier", "Tier", "text"],
      ["type", "Tipo", "text"],
      ["imageDataUrl", "Imagem (URL ou data URL)", "text"],
      ["role", "Papel", "text"],
      ["size", "Tamanho", "text"],
      ["pv", "PV", "number"],
      ["ca", "CA", "number"],
      ["movement", "Movimento", "text"],
      ["cosmos", "Cosmos máximo", "number"],
      ["stressMax", "Estresse máximo", "number"],
      ["cracksMax", "Rachaduras máximas", "number"],
      ["attributes", "Atributos importantes", "textarea"],
      ["signs", "Sinais antes do encontro", "textarea"],
      ["attacks", "Ataques", "textarea"],
      ["abilities", "Habilidades principais", "textarea"],
      ["bossActions", "Ações de chefe", "textarea"],
      ["reactions", "Reações", "textarea"],
      ["phases", "Fases", "textarea"],
      ["resistances", "Resistências", "textarea"],
      ["weaknesses", "Fraquezas", "textarea"],
      ["conditionsApplied", "Condições que aplica", "textarea"],
      ["resources", "Recursos coletáveis", "textarea"],
      ["campaign", "Soluções e consequências", "textarea"],
      ["quickRolls", "Rolagens rápidas", "textarea"],
      ["gmNotes", "Notas do mestre", "textarea"],
    ],
  },
};

const legacyRuleData = [
  { name: "CA das armaduras por Tier", tags: ["CA", "armadura", "tier"], summary: `${ARMOR_CA_TIER_RULE_SUMMARY}. Armaduras utilitárias, cósmicas, seladas e improvisadas usam essa escala como referência e podem variar 1 ou 2 pontos conforme função, ganchos, vedação, instabilidade e fragilidade.` },
  { name: "Rolagem padrão", tags: ["3d6", "modificador"], summary: "Role 3d6 + atributo/perícia + modificador situacional. 3 a 9 falha, 10 a 14 sucesso parcial, 15 a 18 sucesso completo." },
  { name: "Ataques", tags: ["1d20", "CA", "crítico"], summary: "Ataques usam 1d20 + atributo contra a CA. Corpo a corpo normalmente usa FOR, distância usa REF e ataques cósmicos usam MEN. 20 natural é crítico; 1 natural é erro crítico." },
  { name: "Iniciativa", tags: ["1d20", "REF"], summary: "A iniciativa usa 1d20 + MOD REF." },
  { name: "Jogadas de Proteção", tags: ["JPF", "JPR", "JPC"], summary: "JPF usa FOR ou CON, JPR usa REF e JPC usa MEN ou PRE conforme a ameaça." },
  { name: "Estresse e colapso", tags: ["estresse", "2d6"], summary: "Enquanto o Estresse fica em 5 ou menos, a Tríade usa 3d6. Em 6 ou mais, a rolagem cai para 2d6 + modificadores." },
  { name: "Bênção Cósmica", tags: ["4-5-6", "bônus"], summary: "Com 3d6 ativos, a sequência 4, 5, 6 gera +1d4 futuro. Apenas um bônus fica guardado por vez." },
  { name: "Falha Cósmica", tags: ["3-2-1", "risco"], summary: "Com 3d6 ativos, a sequência 3, 2, 1 aplica -1d4 na próxima rolagem e pode causar rachadura ou Estresse." },
  { name: "Rachaduras", tags: ["equipamento", "colapso"], summary: "Armas, armaduras e equipamentos acumulam rachaduras individualmente. Ao chegar a 5 rachaduras, o item colapsa e deixa de funcionar até ser reparado." },
  { name: "Carga", tags: ["peso", "sobrecarga", "cubos"], summary: "Carga máxima: metade do peso corporal + MOD FOR × 10 kg. Cada cubo pesa 1 kg e sua carga interna não soma peso separado. Acima de 100%, o movimento cai pela metade; acima de 150%, o movimento fica 0." },
  { name: "Equipamento inicial", tags: ["criação", "Luzentis"], summary: "Cada personagem começa com 2.000 Luzentis, cubos simples iguais a 5 + MOD FOR, uma arma Tier F, uma armadura Tier F, kit de suprimento e kit da profissão." },
  { name: "Espaços de magia cósmica", tags: ["cosmos", "magias", "grimórios"], summary: `${COSMIC_SPELL_SLOT_RULE_SUMMARY} Equipamentos e chips são calculados automaticamente quando equipados/adicionados; treino e grimórios são registrados na aba Cosmos e chips.` },
  { name: "Level up", tags: ["espinha artificial", "evolução"], summary: "A evolução usa materiais, custo em ℓ, tempo de procedimento e rolagem de benefício do nível." },
];

const raceRuleData = raceData.map((race) => ({
  id: `regra-raca-${race.id}`,
  name: `Raça: ${race.name}`,
  source: "Livro 1, Capítulo 5",
  tags: ["raça", race.name, ...(race.tags || [])],
  summary: [
    `Bônus: ${race.profile.attributeBonus}.`,
    `Perícia extra: ${race.profile.skill}`,
    `Traços: ${race.profile.baseAbility}`,
    `Fraqueza: ${race.profile.weakness}`,
    race.profile.note,
  ].filter(Boolean).join(" "),
}));

const levelRuleData = Object.entries(LEVEL_UP_REQUIREMENTS).map(([level, requirement]) => ({
  id: `regra-evolucao-nivel-${level}`,
  name: `Evolução para o nível ${level}`,
  source: "Livro 1, Capítulo 39",
  tags: ["evolução", "nível", `nível ${level}`],
  summary: `Requer ${requirement.xp.toLocaleString("pt-BR")} XP total, ${requirement.material}, ${requirement.cost || 500 * Number(level)} Luzentis, ${requirement.time} e uma Estação de Evolução funcional. Ao concluir, role 1d6 na tabela do nível ${level}.`,
}));

const ruleData = mergeCatalogByName(
  [...OFFICIAL_BOOKS.rules, ...raceRuleData, ...levelRuleData, ...RULEBOOK_SECTIONS],
  legacyRuleData
);

const actionData = [
  { name: "Atacar", context: "Combate", tags: ["ação", "arma"], summary: "Faça uma jogada de ataque com arma, corpo a corpo ou habilidade ofensiva. Em acerto, role o dano." },
  { name: "Mover-se", context: "Combate", tags: ["movimento"], summary: "Desloque até seu movimento atual, levando em conta terreno difícil, gravidade e efeitos ativos." },
  { name: "Defender", context: "Combate", tags: ["reação", "CA"], summary: "Prepare defesa, cobertura ou postura. O mestre pode conceder bônus de CA ou redução de dano." },
  { name: "Usar item", context: "Combate", tags: ["item", "cubo"], summary: "Pegue, ative ou entregue item. Itens dentro do cubo precisam estar acessíveis." },
  { name: "Conjurar Cosmos", context: "Combate", tags: ["cosmos"], summary: "Use uma magia cósmica conhecida, gaste Cosmos e aplique a duração/alcance da habilidade." },
  { name: "Ajudar aliado", context: "Combate", tags: ["suporte"], summary: "Crie abertura, estabilize, arraste, proteja ou dê vantagem narrativa para a ação do aliado." },
  { name: "Investigar detalhe", context: "Cena", tags: ["percepção", "busca"], summary: "Examine pistas, pessoas, máquinas, rastros ou anomalias no ambiente da cena." },
  { name: "Negociar", context: "Cena", tags: ["social"], summary: "Tente convencer, trocar favores, blefar, intimidar ou acalmar uma tensão social." },
  { name: "Preparar recurso", context: "Cena", tags: ["preparação"], summary: "Carregue arma, ajuste armadura, repare rachadura simples ou organize itens antes do risco aumentar." },
  { name: "Rastrear", context: "Cena", tags: ["sobrevivência"], summary: "Siga pegadas, sinais de máquinas, resíduos cósmicos ou comportamento de criaturas." },
  { name: "Pesquisar", context: "Timeskip", tags: ["lore", "tecnologia"], summary: "Use tempo livre para estudar região, facções, criaturas, tecnologia ou fenômenos cósmicos." },
  { name: "Fabricar ou modificar", context: "Timeskip", tags: ["craft", "chips"], summary: "Crie item, arma, armadura, chip ou melhoria usando materiais, custo e tempo narrativo." },
  { name: "Treinar", context: "Timeskip", tags: ["evolução"], summary: "Justifique avanço, pratique perícia, estabilize nova técnica ou prepare evolução de nível." },
  { name: "Descansar", context: "Timeskip", tags: ["cura", "estresse"], summary: "Recupere recursos, reduza Estresse e trate ferimentos conforme o tipo de descanso usado pela mesa." },
  { name: "Viajar", context: "Fora de combate", tags: ["exploração"], summary: "Defina rota, marcha, vigias, suprimentos, ritmo e riscos de encontro." },
  { name: "Comprar ou vender", context: "Fora de combate", tags: ["economia"], summary: "Negocie equipamento, venda itens do inventário e atualize os Luzentis da ficha." },
  { name: "Conversar no grupo", context: "Fora de combate", tags: ["interpretação"], summary: "Planeje, discuta objetivos, divida informações e tome decisões de personagem." },
  { name: "Manutenção", context: "Fora de combate", tags: ["equipamento"], summary: "Revise armas, armaduras, cubos, rachaduras e munição antes da próxima cena perigosa." },
];

const characterCreationSteps = [
  {
    title: "Conceito",
    summary: "Defina quem o personagem era, o que perdeu e por que aceita se arriscar.",
    fields: "Nome, origem, notas e objetivo pessoal.",
    tip: "Pense em função no grupo: protege, cura, hackeia, pilota, negocia, rastreia ou canaliza Cosmos.",
  },
  {
    title: "Raça",
    summary: "Escolha a origem jogável permitida pela campanha e leia cultura, traços, bônus e fraqueza.",
    fields: "Raça e atributo racial.",
    tip: "Raça influencia, mas não aprisiona. Use a cultura como ponto de partida, não como limite.",
  },
  {
    title: "Traços raciais",
    summary: "Anote bônus de atributo, visão, idioma, habilidade inicial, fraqueza e progressões raciais.",
    fields: "Raça e chip, habilidades e notas.",
    tip: "A ficha digital já soma bônus racial no atributo escolhido.",
  },
  {
    title: "Atributos",
    summary: "Role 7d6, descarte o menor dado e distribua os 6 restantes entre FOR, REF, CON, MEN, PRE e INT.",
    fields: "Atributos base.",
    tip: "Cada atributo começa em 7. Some o dado escolhido ao 7 para chegar ao valor final.",
  },
  {
    title: "Distribuição",
    summary: "Coloque os maiores dados nos atributos que combinam com o conceito.",
    fields: "FOR, REF, CON, MEN, PRE e INT.",
    tip: "Corpo a corpo usa FOR/CON; tiro e pilotagem usam REF; tecnologia e medicina usam INT; Cosmos usa MEN.",
  },
  {
    title: "Modificadores",
    summary: "Use o modificador do atributo nas rolagens, não o valor cheio.",
    fields: "Modificadores calculados automaticamente.",
    tip: "7 = -2, 8-9 = -1, 10-11 = 0, 12-13 = +1, 14-15 = +2, 16-17 = +3, 18-19 = +4, 20 = +5.",
  },
  {
    title: "Chip de profissão",
    summary: "Escolha o treinamento inicial: foco, talento, kit e penalidade.",
    fields: "Chip de profissão, raça e chip.",
    tip: "O chip não é classe fixa. Ele mostra o que o personagem sabia fazer antes da campanha.",
  },
  {
    title: "Perícias e ignorâncias",
    summary: "Escolha 2 perícias treinadas livres. Humanis escolhe 1 perícia treinada adicional. O chip concede um foco profissional. Cada ignorância marcada permite escolher mais 1 perícia treinada.",
    fields: "Habilidades e notas.",
    tip: "Perícia treinada pode dar vantagem; ignorância deve ser uma fraqueza real que aparece em jogo.",
  },
  {
    title: "Derivados",
    summary: "Confira PV, CA, Cosmos, movimento, iniciativa, proteção, carga, cubos e percepção passiva.",
    fields: "Derivados, recursos e HUD vital.",
    tip: "A ficha calcula os principais derivados quando raça, atributos, nível e equipamentos mudam.",
  },
  {
    title: "Equipamento e história",
    summary: "Escolha arma Tier F, armadura Tier F, kit de suprimento, kit da profissão, idiomas, objetivo pessoal e ligação com o grupo.",
    fields: "Equipamentos, habilidades e notas.",
    tip: "Comece simples. O personagem cresce por escolhas, cicatrizes, alianças, equipamentos e descobertas.",
  },
];

const characterCreationFormulas = [
  ["Atributo", "7 + dado distribuído"],
  ["Modificador", "7: -2 | 8-9: -1 | 10-11: 0 | 12-13: +1 | 14-15: +2 | 16-17: +3 | 18-19: +4 | 20: +5"],
  ["PV inicial", "8 + vida adicional por MOD CON + bônus racial; dados usam o valor máximo no nível 1"],
  ["CA", "4 + MOD REF + armadura + raça + mods + cobertura"],
  ["Cosmos", "Base do nível + MOD MEN + raça + equipamento/mod"],
  ["Movimento", "6 m + MOD REF + ajustes raciais/equipamento"],
  ["Iniciativa", "1d20 + MOD REF"],
  ["Cubos", "5 + MOD FOR + raça + profissão"],
  ["Carga máxima", "Metade do peso corporal + (MOD FOR × 10 kg)"],
];

const characterCreationChecklist = [
  "Nome, conceito, origem e objetivo pessoal",
  "Raça, atributo racial, idioma, habilidade e fraqueza",
  "Atributos distribuídos e modificadores conferidos",
  "Chip de profissão com foco, talento, kit e penalidade",
  "Perícias treinadas e todas as ignorâncias escolhidas",
  "PV atual/máximo, CA, Cosmos, movimento, cubos e iniciativa",
  "Arma inicial Tier F e armadura inicial Tier F",
  "Kit de suprimento, kit da profissão, Luzentis iniciais e anotações",
  "Ligação com outro personagem ou com a missão inicial",
  "Ficha salva e, se quiser compartilhar, exportada em JSON",
];

const libraryMap = {
  racas: { title: "Raças", kicker: "Povos de Tarantus", items: raceData },
  profissoes: { title: "Profissões", kicker: "Chips de função", items: professionData },
  magias: { title: "Magias cósmicas", kicker: "Tabela Cósmica", items: cosmicSpellData, learn: "cosmos", monsterAsset: "cosmos" },
  chipsMod: { title: "Chips modificadores", kicker: "Chips por ranking", items: modifierChipData, learn: "chip-mod", monsterAsset: "ability" },
  mods: { title: "Mods", kicker: "Livro 5 - melhorias", items: equipmentModData, monsterAsset: "mod" },
  armazenamento: { title: "Armazenamento", kicker: "Cubos e acesso rápido", items: storageMarketData, market: true },
  armas: { title: "Armas", kicker: "Livro 5 - tiers e dano", items: weaponData, market: true, monsterAsset: "weapon" },
  armaduras: { title: "Armaduras", kicker: "CA e mods", items: armorData, market: true },
  itens: { title: "Itens comuns", kicker: "Utilidades e suprimentos", items: commonItemData, market: true },
  monstros: { title: "Monstros", kicker: "Livro 3 - Bestiário", items: monsterData },
  regras: { title: "Regras", kicker: "Livros oficiais 1 a 5", items: ruleData },
  acoes: { title: "Ações possíveis", kicker: "Combate, cena e downtime", items: actionData },
};

const rulebookTitles = {
  "Livro 1": "Básico do Jogador",
  "Livro 2": "Guia do Mestre",
  "Livro 3": "Bestiário",
  "Livro 4": "Cenários e História",
  "Livro 5": "Itens, Equipamentos e Habilidades",
};

const CUSTOM_LIBRARY_VIEWS = ["magias", "chipsMod", "mods", "armazenamento", "armas", "armaduras", "itens"];
const emptyCustomLibraryContent = () => CUSTOM_LIBRARY_VIEWS.reduce((content, view) => {
  content[view] = [];
  return content;
}, {});

const emptyCharacter = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  createdAt: new Date().toISOString(),
  updatedAt: null,
  name: "",
  player: "",
  race: "humanis",
  profession: "escolha-profissao",
  racialChoice: "FOR",
  level: 1,
  experience: 0,
  evolutionHistory: [],
  permanentPvBonus: 0,
  stressFloor: 0,
  bonusTrainedSkills: 0,
  origin: "",
  attributes: { FOR: ATTRIBUTE_BASE, REF: ATTRIBUTE_BASE, CON: ATTRIBUTE_BASE, MEN: ATTRIBUTE_BASE, PRE: ATTRIBUTE_BASE, INT: ATTRIBUTE_BASE },
  pvCurrent: 8,
  cosmosCurrent: 0,
  stress: 0,
  crackLevel: 0,
  weapon: "",
  armor: "",
  loadUsed: 0,
  bodyWeightKg: 70,
  currency: STARTING_CURRENCY,
  inventory: [],
  knownAbilities: [],
  installedMods: [],
  cosmicTrainingSlots: 0,
  cosmicGrimoireSlots: 0,
  customItems: [],
  customRecords: [],
  diceLog: [],
  initialAttributeRoll: { rolls: [], kept: [] },
  skillTraining: {},
  pendingCosmicEffect: "",
  vitalSigns: {},
  vitalResources: {},
  conditions: {},
  bodyParts: {},
  equippedWeaponUid: "",
  equippedArmorUid: "",
  domainCharacter: null,
  photoDataUrl: "",
  photoName: "",
  abilities: "",
  notes: "",
});

const state = {
  activeView: "inicio",
  activeLibrary: "racas",
  libraryPresetFilter: "",
  activeRaceId: null,
  activeCharacterPage: "ficha",
  openCubeUid: "",
  navExpanded: false,
  pendingTest: null,
  manualImageDataUrl: "",
  manualImageName: "",
  monsterSheets: {},
  monsterSession: [],
  activeMonsterId: "",
  activeMonsterImageId: "",
  activeMonsterAssetCategory: "weapon",
  pagination: {},
  pendingLocationEntityId: "",
  pendingLocationReason: "",
  pendingLevelUp: null,
  pendingRaceChange: null,
  pendingRacialChoiceChange: null,
  customLibraryContent: emptyCustomLibraryContent(),
  shopPriceOverrides: {},
  current: emptyCharacter(),
  saved: [],
};

const el = {
  form: document.querySelector("#characterForm"),
  navList: document.querySelector(".nav-list"),
  tabletHomeView: document.querySelector("#tabletHomeView"),
  itemsHubView: document.querySelector("#itemsHubView"),
  skillsHubView: document.querySelector("#skillsHubView"),
  booksHubView: document.querySelector("#booksHubView"),
  rulesHubView: document.querySelector("#rulesHubView"),
  characterManagerView: document.querySelector("#characterManagerView"),
  mesaVirtualView: document.querySelector("#mesaVirtualView"),
  mesaVirtualRoot: document.querySelector("#mesaVirtualRoot"),
  topbar: document.querySelector(".topbar"),
  homeButton: document.querySelector("#homeButton"),
  launcherVitalTrigger: document.querySelector("#launcherVitalTrigger"),
  launcherPortraitImage: document.querySelector("#launcherPortraitImage"),
  launcherPortraitIcon: document.querySelector("#launcherPortraitIcon"),
  launcherName: document.querySelector("#launcherName"),
  launcherLine: document.querySelector("#launcherLine"),
  launcherStats: document.querySelector("#launcherStats"),
  launcherResourceBars: document.querySelector("#launcherResourceBars"),
  attributeGrid: document.querySelector("#attributeGrid"),
  quickTestGrid: document.querySelector("#quickTestGrid"),
  race: document.querySelector("#race"),
  racialChoice: document.querySelector("#racialChoice"),
  profession: document.querySelector("#profession"),
  savedList: document.querySelector("#savedList"),
  characterSearch: document.querySelector("#characterSearch"),
  librarySearch: document.querySelector("#librarySearch"),
  libraryControls: document.querySelector("#libraryControls"),
  libraryTierControl: document.querySelector("#libraryTierControl"),
  libraryTierFilter: document.querySelector("#libraryTierFilter"),
  librarySort: document.querySelector("#librarySort"),
  libraryGrid: document.querySelector("#libraryGrid"),
  libraryPagination: document.querySelector("#libraryPagination"),
  monsterSessionPanel: document.querySelector("#monsterSessionPanel"),
  libraryTitle: document.querySelector("#libraryTitle"),
  libraryKicker: document.querySelector("#libraryKicker"),
  personagensView: document.querySelector("#personagensView"),
  libraryView: document.querySelector("#libraryView"),
  raceDetailView: document.querySelector("#raceDetailView"),
  raceDetail: document.querySelector("#raceDetail"),
  characterTabs: document.querySelectorAll("[data-character-page]"),
  characterPages: document.querySelectorAll(".character-page"),
  creationGuideContent: document.querySelector("#creationGuideContent"),
  equipmentPageContent: document.querySelector("#equipmentPageContent"),
  cosmosPageContent: document.querySelector("#cosmosPageContent"),
  cubePageContent: document.querySelector("#cubePageContent"),
  abilitiesPageContent: document.querySelector("#abilitiesPageContent"),
  diceResultDisplay: document.querySelector("#diceResultDisplay"),
  diceChatLog: document.querySelector("#diceChatLog"),
  rollDiceButton: document.querySelector("#rollDiceButton"),
  rollInitiativeButton: document.querySelector("#rollInitiativeButton"),
  diceLockNotice: document.querySelector("#diceLockNotice"),
  manualCreateForm: document.querySelector("#manualCreateForm"),
  manualCreatedContent: document.querySelector("#manualCreatedContent"),
  manualFormatGuide: document.querySelector("#manualFormatGuide"),
  manualType: document.querySelector("#manualType"),
  manualName: document.querySelector("#manualName"),
  manualTier: document.querySelector("#manualTier"),
  manualSubtype: document.querySelector("#manualSubtype"),
  manualPrice: document.querySelector("#manualPrice"),
  manualWeight: document.querySelector("#manualWeight"),
  manualPower: document.querySelector("#manualPower"),
  manualMods: document.querySelector("#manualMods"),
  manualCosmos: document.querySelector("#manualCosmos"),
  manualTags: document.querySelector("#manualTags"),
  manualEffect: document.querySelector("#manualEffect"),
  manualOfficialFields: document.querySelector("#manualOfficialFields"),
  manualImagePanel: document.querySelector("#manualImagePanel"),
  manualImageDropzone: document.querySelector("#manualImageDropzone"),
  manualImageInput: document.querySelector("#manualImageInput"),
  manualImagePreview: document.querySelector("#manualImagePreview"),
  manualImagePlaceholder: document.querySelector("#manualImagePlaceholder"),
  removeManualImageButton: document.querySelector("#removeManualImageButton"),
  stressHudPanel: document.querySelector("#stressHudPanel"),
  vitalHudModal: document.querySelector("#vitalHudModal"),
  closeVitalHud: document.querySelector("#closeVitalHud"),
  vitalHudCharacterTrigger: document.querySelector("#vitalHudCharacterTrigger"),
  vitalHudDerivedTrigger: document.querySelector("#vitalHudDerivedTrigger"),
  testDialog: document.querySelector("#testDialog"),
  testRollForm: document.querySelector("#testRollForm"),
  closeTestDialog: document.querySelector("#closeTestDialog"),
  testDialogKicker: document.querySelector("#testDialogKicker"),
  testDialogTitle: document.querySelector("#testDialogTitle"),
  testDialogFormula: document.querySelector("#testDialogFormula"),
  testAttributeField: document.querySelector("#testAttributeField"),
  testAttributeSelect: document.querySelector("#testAttributeSelect"),
  testBonus: document.querySelector("#testBonus"),
  testMode: document.querySelector("#testMode"),
  equipmentWallet: document.querySelector("#equipmentWallet"),
  cubeUsagePill: document.querySelector("#cubeUsagePill"),
  cubeLoadMonitor: document.querySelector("#cubeLoadMonitor"),
  pvMaxInline: document.querySelector("#pvMaxInline"),
  cosmosMaxInline: document.querySelector("#cosmosMaxInline"),
  viewTitle: document.querySelector("#viewTitle"),
  viewKicker: document.querySelector("#viewKicker"),
  photoInput: document.querySelector("#photoInput"),
  photoDropzone: document.querySelector("#photoDropzone"),
  photoPreview: document.querySelector("#photoPreview"),
  photoPlaceholder: document.querySelector("#photoPlaceholder"),
  removePhotoButton: document.querySelector("#removePhotoButton"),
  summaryPortraitImage: document.querySelector("#summaryPortraitImage"),
  summaryPortraitIcon: document.querySelector("#summaryPortraitIcon"),
  createMonsterButton: document.querySelector("#createMonsterButton"),
  monsterEditorModal: document.querySelector("#monsterEditorModal"),
  monsterEditorForm: document.querySelector("#monsterEditorForm"),
  monsterEditorTitle: document.querySelector("#monsterEditorTitle"),
  monsterSheetType: document.querySelector("#monsterSheetType"),
  monsterEditorFields: document.querySelector("#monsterEditorFields"),
  closeMonsterEditor: document.querySelector("#closeMonsterEditor"),
  deleteMonsterButton: document.querySelector("#deleteMonsterButton"),
  monsterImageModal: document.querySelector("#monsterImageModal"),
  monsterImageTitle: document.querySelector("#monsterImageTitle"),
  monsterImageDropzone: document.querySelector("#monsterImageDropzone"),
  monsterImageInput: document.querySelector("#monsterImageInput"),
  monsterImagePreview: document.querySelector("#monsterImagePreview"),
  monsterImagePlaceholder: document.querySelector("#monsterImagePlaceholder"),
  removeMonsterImageButton: document.querySelector("#removeMonsterImageButton"),
  closeMonsterImage: document.querySelector("#closeMonsterImage"),
  monsterAssetsModal: document.querySelector("#monsterAssetsModal"),
  monsterAssetsTitle: document.querySelector("#monsterAssetsTitle"),
  closeMonsterAssets: document.querySelector("#closeMonsterAssets"),
  monsterAssetSearch: document.querySelector("#monsterAssetSearch"),
  monsterAssetCategory: document.querySelector("#monsterAssetCategory"),
  monsterAssetGrid: document.querySelector("#monsterAssetGrid"),
  exportMonsterButton: document.querySelector("#exportMonsterButton"),
  inventoryLocationModal: document.querySelector("#inventoryLocationModal"),
  inventoryLocationTitle: document.querySelector("#inventoryLocationTitle"),
  inventoryLocationMessage: document.querySelector("#inventoryLocationMessage"),
  inventoryLocationForm: document.querySelector("#inventoryLocationForm"),
  inventoryLocationSelect: document.querySelector("#inventoryLocationSelect"),
  closeInventoryLocation: document.querySelector("#closeInventoryLocation"),
  levelUpButton: document.querySelector("#levelUpButton"),
  levelUpModal: document.querySelector("#levelUpModal"),
  levelUpForm: document.querySelector("#levelUpForm"),
  levelUpContent: document.querySelector("#levelUpContent"),
  confirmLevelUp: document.querySelector("#confirmLevelUp"),
  closeLevelUp: document.querySelector("#closeLevelUp"),
  universalDetailModal: document.querySelector("#universalDetailModal"),
  universalDetailKicker: document.querySelector("#universalDetailKicker"),
  universalDetailTitle: document.querySelector("#universalDetailTitle"),
  universalDetailContent: document.querySelector("#universalDetailContent"),
  closeUniversalDetail: document.querySelector("#closeUniversalDetail"),
  toast: document.querySelector("#toast"),
};

let mesaVirtualUi = null;

function init() {
  installIcons();
  syncNavState();
  hydrateSelects();
  hydrateAttributes();
  hydrateQuickTests();
  applyManualTemplate();
  loadSaved();
  loadCustomLibraryContent();
  loadShopPriceOverrides();
  loadMonsterSheets();
  loadMonsterSession();
  bindEvents();
  renderForm();
  renderSavedList();
  renderSummary();
  renderLibrary();
  mountMesaVirtual();
  switchView(initialViewFromUrl());
}

function initialViewFromUrl() {
  const params = new URLSearchParams(window.location.search || "");
  const view = params.get("view") || params.get("start") || "";
  const hashView = (window.location.hash || "").replace(/^#\/?/, "");
  const requested = view || hashView;
  if (requested === "mesaVirtual" || requested === "vtt" || requested === "tabletop") return "mesaVirtual";
  return "inicio";
}

function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    const icon = icons[node.dataset.icon];
    if (icon) node.innerHTML = icon;
  });
}

function hydrateSelects() {
  el.race.innerHTML = raceData.map((race) => `<option value="${race.id}">${race.name}</option>`).join("");
  el.profession.innerHTML = professionData.map((profession) => `<option value="${profession.id}">${profession.name}</option>`).join("");
  hydrateRacialChoice(state.current.race);
}

function hydrateRacialChoice(raceId) {
  const race = findRace(raceId);
  const options = race.choice?.options || [];
  el.racialChoice.innerHTML = options.map((attr) => `<option value="${attr}">${attr} +${race.choice.amount}</option>`).join("");
  el.racialChoice.disabled = options.length === 0;
}

function hydrateAttributes() {
  el.attributeGrid.innerHTML = ATTRIBUTES.map((attr) => `
    <article class="attribute-cell" data-detail-kind="attribute" data-detail-id="${attr}">
      <header>
        <strong>${attr}</strong>
        <span class="attribute-total" id="${attr}Total">+0</span>
      </header>
      <label>
        Base
        <input id="${attr}" name="${attr}" type="number" min="0" max="20" step="1" />
      </label>
      <button class="mini-button test-roll-button" type="button" data-test-roll data-test-kind="Atributo" data-test-name="${attr}" data-test-attr="${attr}">Testar ${attr}</button>
    </article>
  `).join("");
}

function hydrateQuickTests() {
  const training = skillTrainingLimits();
  const race = findRace(state.current.race);
  el.quickTestGrid.innerHTML = `
    <section class="quick-test-section">
      <div class="quick-test-section-heading">
        <h4>Perícias por atributo</h4>
        <span class="skill-training-limit ${training.trained > training.limit ? "over-limit" : ""}">${training.trained}/${training.limit} Peritos${training.racialExtra ? ` · ${escapeHtml(race.name)} +${training.racialExtra}` : ""}</span>
      </div>
      <div class="skill-training-grid">
        ${QUICK_TEST_ATTRIBUTES.map(renderSkillAttributeCard).join("")}
      </div>
    </section>
    <section class="quick-test-section">
      <h4>Jogadas de proteção</h4>
      <div class="quick-test-list">
        ${protectionData.map(renderProtectionTestButton).join("")}
      </div>
    </section>
  `;
}

function skillTrainingLimits({ excludedSkill = "" } = {}) {
  const selections = Object.entries(state.current.skillTraining || {})
    .filter(([skillName]) => skillName !== excludedSkill)
    .map(([, value]) => value);
  const trained = selections.filter((value) => value === "trained").length;
  const ignorant = selections.filter((value) => value === "ignorant").length;
  const racialExtra = Math.max(0, numberValue(findRace(state.current.race).extraTrainedSkills, 0));
  const evolutionExtra = Math.max(0, numberValue(state.current.bonusTrainedSkills, 0));
  const baseLimit = 2 + racialExtra + evolutionExtra;
  return {
    trained,
    ignorant,
    racialExtra,
    evolutionExtra,
    baseLimit,
    limit: baseLimit + ignorant,
  };
}

function renderSkillAttributeCard(attr) {
  const skills = skillData.filter((skill) => skill.attr === attr);
  return `
    <article class="skill-attribute-card">
      <h5>${attr}</h5>
      ${skills.length
        ? skills.map(renderSkillTrainingRow).join("")
        : '<p class="skill-empty-note">Nenhuma perícia cadastrada para este atributo ainda.</p>'}
    </article>
  `;
}

function renderSkillTrainingRow(skill) {
  const value = state.current.skillTraining?.[skill.name] || "";
  const modifier = skillModifier(skill);
  return `
    <div class="skill-training-row">
      <button class="quick-test-button skill-test-button" type="button" title="${escapeHtml(skill.summary)}" aria-label="${escapeHtml(`${skill.name} ${formatMod(modifier)}. ${skill.summary}`)}" data-test-roll data-test-kind="Perícia" data-test-name="${escapeHtml(skill.name)}" data-test-attr="${escapeHtml(skill.attr)}" data-detail-kind="skill" data-detail-id="${escapeHtml(skill.name)}">
        <strong>${escapeHtml(skill.name)} <span class="skill-modifier" data-skill-modifier="${escapeHtml(skill.name)}" data-skill-attr="${escapeHtml(skill.attr)}">${formatMod(modifier)}</span></strong>
      </button>
      <div class="skill-training-checks" aria-label="Treinamento em ${escapeHtml(skill.name)}">
        <label class="skill-training-check">
          <input type="checkbox" data-skill-training="${escapeHtml(skill.name)}" data-skill-training-value="trained" ${value === "trained" ? "checked" : ""} />
          <span>Perito</span>
        </label>
        <label class="skill-training-check">
          <input type="checkbox" data-skill-training="${escapeHtml(skill.name)}" data-skill-training-value="ignorant" ${value === "ignorant" ? "checked" : ""} />
          <span>Ignorante</span>
        </label>
      </div>
    </div>
  `;
}

function refreshSkillTrainingModifiers(totals = totalAttributes()) {
  document.querySelectorAll("[data-skill-modifier]").forEach((node) => {
    const attr = node.dataset.skillAttr;
    const skill = skillData.find((item) => item.name === node.dataset.skillModifier);
    node.textContent = formatMod(attributeModifier(totals[attr] || ATTRIBUTE_BASE) + passiveSkillBonus(skill?.name || ""));
  });
}

function renderQuickTestButton(kind, item) {
  return `
    <button class="quick-test-button" type="button" data-test-roll data-test-kind="${escapeHtml(kind)}" data-test-name="${escapeHtml(item.name)}" data-test-attr="${escapeHtml(item.attr)}" data-detail-kind="${kind === "Proteção" ? "protection" : "skill"}" data-detail-id="${escapeHtml(item.name)}">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.attr)} - ${escapeHtml(item.summary)}</span>
    </button>
  `;
}

function renderProtectionTestButton(item) {
  const attrs = item.attrs || [item.attr];
  if (attrs.length === 1) return renderQuickTestButton("Proteção", item);

  return `
    <article class="protection-choice-card" data-detail-kind="protection" data-detail-id="${escapeHtml(item.name)}">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.summary)}</span>
      </div>
      <div class="protection-choice-actions" aria-label="Escolha o atributo da ${escapeHtml(item.name)}">
        ${attrs.map((attr) => `
          <button class="mini-button" type="button" data-test-roll data-test-kind="Proteção" data-test-name="${escapeHtml(item.name)}" data-test-attr="${escapeHtml(attr)}" data-detail-kind="protection" data-detail-id="${escapeHtml(item.name)}">${escapeHtml(attr)}</button>
        `).join("")}
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => handleNavClick(button.dataset.view));
  });
  document.querySelectorAll("[data-launcher-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.launcherView));
  });
  document.querySelectorAll("[data-launcher-library]").forEach((button) => {
    button.addEventListener("click", () => {
      state.libraryPresetFilter = "";
      switchView(button.dataset.launcherLibrary);
    });
  });
  document.querySelectorAll("[data-launcher-book]").forEach((button) => {
    button.addEventListener("click", () => openRulebookLibrary(button.dataset.launcherBook));
  });
  el.homeButton.addEventListener("click", () => switchView("inicio"));

  el.characterTabs.forEach((button) => {
    button.addEventListener("click", () => switchCharacterPage(button.dataset.characterPage));
  });
  el.creationGuideContent.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const pageButton = event.target.closest("[data-guide-page]");
    if (pageButton) {
      switchView("personagens");
      switchCharacterPage(pageButton.dataset.guidePage);
      return;
    }
    const libraryButton = event.target.closest("[data-guide-library]");
    if (libraryButton) {
      switchView(libraryButton.dataset.guideLibrary);
      return;
    }
    const rollAttributesButton = event.target.closest("[data-roll-initial-attributes]");
    if (rollAttributesButton) {
      rollInitialAttributePool();
      return;
    }
    const applyAttributesButton = event.target.closest("[data-apply-initial-attributes]");
    if (applyAttributesButton) {
      applyInitialAttributePool();
      return;
    }
    if (event.target.closest("[data-create-random-character]")) {
      createRandomLevel1Character();
      return;
    }
    const bulkDeleteButton = event.target.closest("[data-bulk-delete]");
    if (bulkDeleteButton) bulkDeleteCharacterContent(bulkDeleteButton.dataset.bulkDelete);
  });

  el.form.addEventListener("input", () => {
    readForm();
    renderSummary();
  });

  el.form.addEventListener("change", () => {
    readForm();
    renderSummary();
  });
  el.form.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-test-roll]");
    if (!button) return;
    event.preventDefault();
    const testRequest = {
      kind: button.dataset.testKind,
      name: button.dataset.testName,
      attr: button.dataset.testAttr,
      mode: defaultTestModeFor(button.dataset.testKind, button.dataset.testName),
    };
    window.clearTimeout(testRollClickTimer);
    testRollClickTimer = window.setTimeout(() => openTestDialog(testRequest), 240);
  });
  el.quickTestGrid.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.dataset.skillTraining) return;
    const skillName = event.target.dataset.skillTraining;
    const skillState = event.target.dataset.skillTrainingValue;
    const row = event.target.closest(".skill-training-row");
    state.current.skillTraining = state.current.skillTraining || {};
    if (event.target.checked) {
      const previousState = state.current.skillTraining[skillName] || "";
      const training = skillTrainingLimits({ excludedSkill: skillName });
      if (skillState === "trained" && training.trained >= training.limit && previousState !== "trained") {
        event.target.checked = false;
        showToast(`Limite atual: ${training.limit} perícias treinadas${training.racialExtra ? " (Humanis +1)" : ""}.`);
        return;
      }
      row?.querySelectorAll("[data-skill-training]").forEach((input) => {
        if (input !== event.target) input.checked = false;
      });
      state.current.skillTraining[skillName] = skillState;
    } else if (state.current.skillTraining[skillName] === skillState) {
      const training = skillTrainingLimits();
      const remainingLimit = training.baseLimit + Math.max(0, training.ignorant - 1);
      if (skillState === "ignorant" && training.trained > remainingLimit) {
        event.target.checked = true;
        showToast("Remova uma perícia treinada adicional antes de retirar esta Ignorância.");
        return;
      }
      delete state.current.skillTraining[skillName];
    }
    hydrateQuickTests();
    renderSummary();
  });
  const captureRaceChange = () => {
    if (state.pendingRaceChange) return;
    const previousRace = findRace(state.current.race);
    const previousDerived = derivedStats(totalAttributes(), previousRace, findProfession(state.current.profession));
    state.pendingRaceChange = {
      previousRaceId: previousRace.id,
      wasAtFullPv: state.current.pvCurrent >= previousDerived.pvMax,
    };
  };
  el.race.addEventListener("pointerdown", captureRaceChange);
  el.race.addEventListener("keydown", captureRaceChange);
  el.race.addEventListener("input", captureRaceChange);
  el.race.addEventListener("change", () => {
    const wasAtFullPv = Boolean(state.pendingRaceChange?.wasAtFullPv);
    hydrateRacialChoice(el.race.value);
    const race = findRace(el.race.value);
    el.racialChoice.value = defaultRacialChoice(race, el.racialChoice.value);
    readForm();
    if (wasAtFullPv) {
      state.current.pvCurrent = derivedStats(totalAttributes(), race, findProfession(state.current.profession)).pvMax;
      document.querySelector("#pvCurrent").value = state.current.pvCurrent;
    }
    state.pendingRaceChange = null;
    hydrateQuickTests();
    renderSummary();
    const training = skillTrainingLimits();
    if (training.trained > training.limit) {
      showToast(`A raça ${race.name} permite ${training.limit} perícias treinadas. Revise as seleções excedentes.`);
    }
  });
  const captureRacialChoiceChange = () => {
    if (state.pendingRacialChoiceChange) return;
    const derived = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession));
    state.pendingRacialChoiceChange = {
      wasAtFullPv: state.current.pvCurrent >= derived.pvMax,
    };
  };
  el.racialChoice.addEventListener("pointerdown", captureRacialChoiceChange);
  el.racialChoice.addEventListener("keydown", captureRacialChoiceChange);
  el.racialChoice.addEventListener("input", captureRacialChoiceChange);
  el.racialChoice.addEventListener("change", () => {
    const wasAtFullPv = Boolean(state.pendingRacialChoiceChange?.wasAtFullPv);
    readForm();
    if (wasAtFullPv) {
      state.current.pvCurrent = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)).pvMax;
      document.querySelector("#pvCurrent").value = state.current.pvCurrent;
    }
    state.pendingRacialChoiceChange = null;
    renderSummary();
  });

  document.querySelector("#saveButton").addEventListener("click", saveCurrent);
  document.querySelector("#newCharacterSide").addEventListener("click", newCharacter);
  document.querySelector("#exportButton").addEventListener("click", exportCurrent);
  document.querySelector("#printButton").addEventListener("click", () => window.print());
  document.querySelector("#importButton").addEventListener("click", () => document.querySelector("#importInput").click());
  document.querySelector("#importInput").addEventListener("change", importCharacter);
  el.photoDropzone.addEventListener("click", () => el.photoInput.click());
  el.photoInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) setCharacterPhoto(file);
    event.target.value = "";
  });
  el.photoDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    el.photoDropzone.classList.add("dragging");
  });
  el.photoDropzone.addEventListener("dragleave", () => {
    el.photoDropzone.classList.remove("dragging");
  });
  el.photoDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    el.photoDropzone.classList.remove("dragging");
    const file = event.dataTransfer?.files?.[0];
    if (file) setCharacterPhoto(file);
  });
  el.removePhotoButton.addEventListener("click", () => {
    state.current.photoDataUrl = "";
    state.current.photoName = "";
    renderPhotoPreviews();
    showToast("Imagem removida da ficha.");
  });
  el.rollDiceButton.addEventListener("click", rollDice);
  el.rollInitiativeButton.addEventListener("click", rollInitiative);
  el.manualCreateForm.addEventListener("submit", createManualEntry);
  el.manualType.addEventListener("change", applyManualTemplate);
  el.createMonsterButton.addEventListener("click", () => openMonsterEditor());
  el.monsterSheetType.addEventListener("change", () => renderMonsterEditorFields({}, el.monsterSheetType.value));
  el.monsterEditorForm.addEventListener("submit", saveMonsterSheet);
  el.closeMonsterEditor.addEventListener("click", closeMonsterEditor);
  el.monsterEditorModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-monster-editor-close]")) closeMonsterEditor();
  });
  el.deleteMonsterButton.addEventListener("click", deleteActiveMonsterSheet);
  el.monsterImageDropzone.addEventListener("click", () => el.monsterImageInput.click());
  el.monsterImageInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) setMonsterImage(file);
    event.target.value = "";
  });
  el.monsterImageDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    el.monsterImageDropzone.classList.add("dragging");
  });
  el.monsterImageDropzone.addEventListener("dragleave", () => {
    el.monsterImageDropzone.classList.remove("dragging");
  });
  el.monsterImageDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    el.monsterImageDropzone.classList.remove("dragging");
    const file = event.dataTransfer?.files?.[0];
    if (file) setMonsterImage(file);
  });
  el.removeMonsterImageButton.addEventListener("click", removeMonsterImage);
  el.closeMonsterImage.addEventListener("click", closeMonsterImageDialog);
  el.monsterImageModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-monster-image-close]")) closeMonsterImageDialog();
  });
  el.closeMonsterAssets.addEventListener("click", closeMonsterAssets);
  el.monsterAssetsModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-monster-assets-close]")) closeMonsterAssets();
  });
  el.monsterAssetSearch.addEventListener("input", renderMonsterAssetManager);
  el.monsterAssetCategory.addEventListener("change", () => {
    state.activeMonsterAssetCategory = el.monsterAssetCategory.value;
    renderMonsterAssetManager();
  });
  el.monsterAssetGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-monster-asset-toggle]");
    if (button) toggleMonsterAsset(button.dataset.monsterAssetToggle, button.dataset.assetCategory);
  });
  el.exportMonsterButton.addEventListener("click", exportActiveMonster);
  el.inventoryLocationForm.addEventListener("submit", applyPendingInventoryLocation);
  el.closeInventoryLocation.addEventListener("click", closeInventoryLocationDialog);
  el.inventoryLocationModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-inventory-location-close]")) {
      closeInventoryLocationDialog();
    }
  });
  el.levelUpButton.addEventListener("click", openLevelUpDialog);
  el.levelUpForm.addEventListener("submit", handleLevelUpSubmit);
  el.closeLevelUp.addEventListener("click", closeLevelUpDialog);
  el.levelUpModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-level-up-close]")) closeLevelUpDialog();
  });
  el.closeUniversalDetail.addEventListener("click", closeUniversalDetail);
  el.universalDetailModal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-universal-detail-close]")) closeUniversalDetail();
  });
  el.manualImageDropzone.addEventListener("click", () => el.manualImageInput.click());
  el.manualImageInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) setManualItemImage(file);
    event.target.value = "";
  });
  el.manualImageDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    el.manualImageDropzone.classList.add("dragging");
  });
  el.manualImageDropzone.addEventListener("dragleave", () => {
    el.manualImageDropzone.classList.remove("dragging");
  });
  el.manualImageDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    el.manualImageDropzone.classList.remove("dragging");
    const file = event.dataTransfer?.files?.[0];
    if (file) setManualItemImage(file);
  });
  el.removeManualImageButton.addEventListener("click", () => {
    clearManualItemImage();
    showToast("Imagem removida do conteúdo criado.");
  });
  el.testRollForm.addEventListener("submit", submitTestRoll);
  el.closeTestDialog.addEventListener("click", closeTestDialog);
  el.testDialog.addEventListener("click", (event) => {
    if (event.target === el.testDialog) closeTestDialog();
  });
  [el.vitalHudCharacterTrigger, el.vitalHudDerivedTrigger, el.launcherVitalTrigger].forEach((trigger) => {
    trigger.addEventListener("click", openVitalHud);
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openVitalHud();
    });
  });
  el.closeVitalHud.addEventListener("click", closeVitalHud);
  el.vitalHudModal.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("[data-vital-hud-close]")) return;
    closeVitalHud();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!el.vitalHudModal.hidden) closeVitalHud();
    if (!el.monsterEditorModal.hidden) closeMonsterEditor();
    if (!el.monsterImageModal.hidden) closeMonsterImageDialog();
    if (!el.monsterAssetsModal.hidden) closeMonsterAssets();
    if (!el.inventoryLocationModal.hidden) closeInventoryLocationDialog();
    if (!el.levelUpModal.hidden) closeLevelUpDialog();
    if (!el.universalDetailModal.hidden) closeUniversalDetail();
  });
  el.testBonus.addEventListener("input", renderPendingTestFormula);
  el.testMode.addEventListener("change", renderPendingTestFormula);
  el.testAttributeSelect.addEventListener("change", updatePendingTestAttribute);

  el.characterSearch.addEventListener("input", renderSavedList);
  el.librarySearch.addEventListener("input", () => resetLibraryPaginationAndRender());
  el.libraryTierFilter.addEventListener("change", () => resetLibraryPaginationAndRender());
  el.librarySort.addEventListener("change", () => resetLibraryPaginationAndRender());
  document.addEventListener("click", handleCardDetailsClick);
  document.addEventListener("click", handlePaginationClick);
  document.addEventListener("dblclick", handleUniversalDetailDoubleClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCardDetails();
  });
  el.libraryGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const addSessionButton = event.target.closest("[data-monster-session-add]");
    if (addSessionButton) {
      addMonsterToSession(addSessionButton.dataset.monsterSessionAdd);
      return;
    }
    const playableButton = event.target.closest("[data-monster-playable]");
    if (playableButton) {
      addMonsterToSession(playableButton.dataset.monsterPlayable, { openEditor: true });
      return;
    }
    const deleteMonsterCardButton = event.target.closest("[data-monster-delete]");
    if (deleteMonsterCardButton) {
      deleteMonsterSheetById(deleteMonsterCardButton.dataset.monsterDelete);
      return;
    }
    const editMonsterButton = event.target.closest("[data-monster-edit]");
    if (editMonsterButton) {
      openMonsterEditor(editMonsterButton.dataset.monsterEdit);
      return;
    }
    const monsterImageButton = event.target.closest("[data-monster-image]");
    if (monsterImageButton) {
      openMonsterImageDialog(monsterImageButton.dataset.monsterImage);
      return;
    }
    const monsterAssetsButton = event.target.closest("[data-monster-assets]");
    if (monsterAssetsButton) {
      openMonsterAssets(monsterAssetsButton.dataset.monsterAssets);
      return;
    }
    const blockedSlotButton = event.target.closest("[data-slot-blocked]");
    if (blockedSlotButton) {
      showSlotLimitFeedback(blockedSlotButton.dataset.slotBlocked);
      return;
    }
    const buyButton = event.target.closest("[data-buy-id]");
    if (buyButton) {
      buyMarketItem(buyButton.dataset.buyId, buyButton);
      return;
    }
    const learnButton = event.target.closest("[data-learn-id]");
    if (learnButton) {
      learnLibraryAbility(learnButton.dataset.learnId);
      return;
    }
    const raceCard = event.target.closest("[data-race-id]");
    if (!raceCard || state.activeLibrary !== "racas") return;
    window.clearTimeout(raceCardClickTimer);
    raceCardClickTimer = window.setTimeout(() => {
      openRaceDetail(raceCard.dataset.raceId);
      raceCardClickTimer = null;
    }, 240);
  });

  el.monsterSessionPanel.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const action = event.target.closest("[data-monster-session-action]");
    if (!action) return;
    handleMonsterSessionAction(action.dataset.monsterSessionAction, action.dataset.monsterSessionId, action);
  });

  [el.cosmosPageContent, el.abilitiesPageContent, el.manualCreatedContent].forEach((container) => {
    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const abilityAction = event.target.closest("[data-ability-action]");
      if (abilityAction) {
        handleAbilityAction(abilityAction.dataset.abilityAction, abilityAction.dataset.abilityId);
        return;
      }
      const professionAction = event.target.closest("[data-profession-action]");
      if (professionAction) {
        removeProfessionChip();
        return;
      }
      const modAction = event.target.closest("[data-installed-mod-action]");
      if (modAction) {
        removeInstalledMod(modAction.dataset.modId);
        return;
      }
      const customAction = event.target.closest("[data-custom-content-delete]");
      if (customAction) {
        deleteCustomContent(customAction.dataset.customContentDelete, customAction.dataset.customContentType);
        return;
      }
      const exportAction = event.target.closest("[data-custom-content-export]");
      if (exportAction) {
        exportCustomContentToLibrary(exportAction.dataset.customContentExport, exportAction.dataset.customContentType);
      }
    });
  });

  [el.equipmentPageContent, el.cubePageContent].forEach((container) => {
    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const equipmentRoll = event.target.closest("[data-equipment-roll]");
      if (equipmentRoll) {
        handleEquipmentRoll(equipmentRoll.dataset.equipmentRoll);
        return;
      }
      const action = event.target.closest("[data-inventory-action]");
      if (!action) return;
      handleInventoryAction(action.dataset.inventoryAction, action.dataset.uid, action);
    });
  });

  el.equipmentPageContent.addEventListener("dragstart", (event) => {
    const card = event.target instanceof Element ? event.target.closest("[data-drag-inventory-uid]") : null;
    if (!card || !event.dataTransfer) return;
    event.dataTransfer.setData("text/solaris-inventory-uid", card.dataset.dragInventoryUid);
    event.dataTransfer.effectAllowed = "move";
    card.classList.add("is-dragging");
    el.equipmentPageContent.classList.add("support-dragging");
  });
  el.equipmentPageContent.addEventListener("dragend", (event) => {
    const card = event.target instanceof Element ? event.target.closest("[data-drag-inventory-uid]") : null;
    card?.classList.remove("is-dragging");
    el.equipmentPageContent.classList.remove("support-dragging");
    el.equipmentPageContent.querySelectorAll(".support-drop-active").forEach((target) => target.classList.remove("support-drop-active"));
  });
  el.equipmentPageContent.addEventListener("dragover", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-support-drop-kind], [data-storage-drop-uid]")
      : null;
    if (!target) return;
    event.preventDefault();
    target.classList.add("support-drop-active");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  });
  el.equipmentPageContent.addEventListener("dragleave", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-support-drop-kind], [data-storage-drop-uid]")
      : null;
    if (target && (!(event.relatedTarget instanceof Node) || !target.contains(event.relatedTarget))) {
      target.classList.remove("support-drop-active");
    }
  });
  el.equipmentPageContent.addEventListener("drop", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-support-drop-kind], [data-storage-drop-uid]")
      : null;
    if (!target || !event.dataTransfer) return;
    event.preventDefault();
    target.classList.remove("support-drop-active");
    el.equipmentPageContent.classList.remove("support-dragging");
    const entityId = event.dataTransfer.getData("text/solaris-inventory-uid");
    if (target.dataset.storageDropUid) moveInventoryItemToStorage(entityId, target.dataset.storageDropUid);
    else moveInventoryItemToExternalSupport(entityId, target.dataset.supportDropKind);
  });

  el.cubePageContent.addEventListener("submit", (event) => {
    if (!(event.target instanceof HTMLFormElement) || !event.target.matches("[data-cube-create-form]")) return;
    createCubeFromForm(event);
  });
  el.cubePageContent.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLSelectElement) || !event.target.matches("[data-cube-create-type]")) return;
    syncCubeCreatorFields(event.target.closest("[data-cube-create-form]"));
  });
  el.cubePageContent.addEventListener("dblclick", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-card-details-toggle]")) return;
    const cubeCard = event.target.closest("[data-cube-drop-uid]");
    if (!cubeCard) return;
    openCubeInterior(cubeCard.dataset.cubeDropUid);
  });
  el.cubePageContent.addEventListener("dragstart", (event) => {
    const card = event.target instanceof Element ? event.target.closest("[data-drag-inventory-uid]") : null;
    if (!card || !event.dataTransfer) return;
    event.dataTransfer.setData("text/solaris-inventory-uid", card.dataset.dragInventoryUid);
    event.dataTransfer.effectAllowed = "move";
  });
  el.cubePageContent.addEventListener("dragover", (event) => {
    const cubeCard = event.target instanceof Element ? event.target.closest("[data-cube-drop-uid]") : null;
    if (!cubeCard) return;
    event.preventDefault();
    cubeCard.classList.add("drag-over");
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  });
  el.cubePageContent.addEventListener("dragleave", (event) => {
    const cubeCard = event.target instanceof Element ? event.target.closest("[data-cube-drop-uid]") : null;
    if (cubeCard) cubeCard.classList.remove("drag-over");
  });
  el.cubePageContent.addEventListener("drop", (event) => {
    const cubeCard = event.target instanceof Element ? event.target.closest("[data-cube-drop-uid]") : null;
    if (!cubeCard || !event.dataTransfer) return;
    event.preventDefault();
    cubeCard.classList.remove("drag-over");
    moveInventoryItemToCube(event.dataTransfer.getData("text/solaris-inventory-uid"), cubeCard.dataset.cubeDropUid);
  });

  el.cosmosPageContent.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const unequipChipButton = event.target.closest("[data-unequip-chip-id]");
    if (!unequipChipButton) return;
    unequipModifierChip(unequipChipButton.dataset.unequipChipId);
  });

  el.cosmosPageContent.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const source = event.target.dataset.cosmicSlotSource;
    if (!source) return;
    const value = Math.max(0, numberValue(event.target.value, 0));
    if (source === "training") state.current.cosmicTrainingSlots = value;
    if (source === "grimoires") state.current.cosmicGrimoireSlots = value;
    renderSummary();
  });

  [el.equipmentPageContent, el.cubePageContent].forEach((container) => {
    container.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLInputElement)) return;
      if (event.target.id === "crackLevelInput") {
        const entry = getEquippedInventoryEntry("weapon");
        if (!entry) return;
        entry.crackLevel = clamp(numberValue(event.target.value, 0), 0, ITEM_CRACK_MAX);
        renderSummary();
        return;
      }
      if (event.target.dataset.itemCrack) {
        const entry = getInventoryEntry(event.target.dataset.itemCrack);
        if (!entry) return;
        entry.crackLevel = clamp(numberValue(event.target.value, 0), 0, ITEM_CRACK_MAX);
        renderSummary();
      }
    });
  });
}

function mountMesaVirtual() {
  if (!el.mesaVirtualRoot || mesaVirtualUi) return;
  mesaVirtualUi = mountSolarisSessionUI(el.mesaVirtualRoot, {
    getCurrentCharacter: currentSessionCharacterSnapshot,
    onOpenCharacter: () => switchView("personagens"),
    onOpenInventory: () => {
      switchView("personagens");
      switchCharacterPage("equipamentos");
    },
    onResourceUpdate: applySessionResourceUpdate,
    onRemoteCharacterUpdate: applySessionFullCharacterSnapshot,
    getMonsterCatalog: sessionMonsterCatalog,
    getShopCatalog: sessionShopCatalog,
    notify: showToast,
  });
}

function refreshMesaVirtual() {
  if (mesaVirtualUi && state.activeView === "mesaVirtual") mesaVirtualUi.refresh();
}

function currentSessionCharacterSnapshot() {
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const attrs = totalAttributes();
  const derived = derivedStats(attrs, race, profession);
  const weapon = getEquippedMarketItem("weapon");
  const armor = getEquippedMarketItem("armor");
  const inventory = structuredCloneSafe(state.current.inventory || []);
  const unassignedItems = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.UNASSIGNED);
  const equippedItems = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.EQUIPPED);
  const activeItems = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.ACTIVE);
  const cubes = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.CUBE || entry.category === "cube");
  const backpacks = inventory.filter((entry) => entry.category === "storage" || /mochila/i.test(findMarketItem(entry.itemId)?.name || ""));
  const holsters = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.HOLSTER || entry.supportSlot === "coldre");
  const bandoliers = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.BANDOLIER || entry.supportSlot === "bandoleira");
  const hooks = inventory.filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.HOOK || entry.supportSlot === "gancho");
  const modifiers = ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = attributeModifier(attrs[attr]);
    return acc;
  }, {});
  const cosmicSpells = cosmicSpellEntries().map((entry) => structuredCloneSafe(entry));
  const modifierChips = modifierChipEntries().map((entry) => structuredCloneSafe(entry));
  const racialAbilities = (state.current.knownAbilities || []).filter((ability) => ability.source === "Raça").map((entry) => structuredCloneSafe(entry));
  const manualAbilities = (state.current.knownAbilities || []).filter((ability) => ability.source === "Manual" || ability.custom).map((entry) => structuredCloneSafe(entry));
  return {
    id: state.current.id,
    characterId: state.current.id,
    ownerId: "",
    name: state.current.name || "Personagem sem nome",
    player: state.current.player || "Jogador local",
    race: race.name,
    profession: profession.name,
    level: state.current.level,
    xp: state.current.xp || 0,
    attributes: attrs,
    modifiers,
    derived,
    skills: structuredCloneSafe(state.current.skillStates || state.current.skills || {}),
    protections: structuredCloneSafe(state.current.protectionStates || state.current.protections || {}),
    currentPV: state.current.pvCurrent,
    pvCurrent: state.current.pvCurrent,
    maxPV: derived.pvMax,
    cosmosCurrent: state.current.cosmosCurrent,
    cosmosMax: derived.cosmosMax,
    stress: state.current.stress,
    stressMax: derived.stressMax,
    ca: derived.ca,
    movement: derived.movement,
    initiative: derived.initiative || modifiers.REF || 0,
    inventory,
    unassignedItems,
    activeItems,
    equipment: {
      weapon: weapon ? structuredCloneSafe(weapon) : null,
      armor: armor ? structuredCloneSafe(armor) : null,
      equippedItems,
      equippedWeaponUid: state.current.equippedWeaponUid || "",
      equippedArmorUid: state.current.equippedArmorUid || "",
    },
    loadout: {
      weaponUid: state.current.equippedWeaponUid || "",
      armorUid: state.current.equippedArmorUid || "",
    },
    storage: structuredCloneSafe(state.current.domainCharacter?.inventory || {}),
    cubes,
    backpacks,
    holsters,
    bandoliers,
    hooks,
    cosmicSpells,
    modifierChips,
    professionChip: structuredCloneSafe(findProfession(state.current.profession) || {}),
    installedMods: modifierChips.filter((entry) => entry.installed !== false),
    racialAbilities,
    manualAbilities,
    abilities: structuredCloneSafe(state.current.knownAbilities || []),
    conditions: structuredCloneSafe(state.current.conditions || []),
    playerNotes: state.current.notes || "",
    currency: numberValue(state.current.currency, STARTING_CURRENCY),
    luzentis: numberValue(state.current.currency, STARTING_CURRENCY),
    metadata: {
      schemaVersion: 1,
      appCache: "20260620d",
      source: "solaris-local-character",
      updatedAt: state.current.updatedAt || new Date().toISOString(),
    },
    revision: numberValue(state.current.sessionRevision, 0),
    weapon: weapon?.name || state.current.weapon || "Arma nao equipada",
    armor: armor?.name || state.current.armor || "Armadura nao equipada",
    portrait: state.current.photoDataUrl || "",
  };
}

function sessionMonsterCatalog() {
  return getMonsterLibraryItems().map((monster) => ({
    id: monster.id,
    name: monster.name,
    tier: monster.tier || "",
    type: monster.type || "",
    role: monster.role || "",
    pv: Number(monster.pv ?? monster.maxPV ?? monster.pvMax ?? 24),
    maxPV: Number(monster.maxPV ?? monster.pvMax ?? monster.pv ?? 24),
    currentPV: Number(monster.currentPV ?? monster.pvAtual ?? monster.pv ?? monster.maxPV ?? 24),
    ca: Number(monster.ca ?? 10),
    movement: Number(monster.movement ?? monster.movimento ?? 6),
    image: monster.imageDataUrl || monster.image || "",
    imageDataUrl: monster.imageDataUrl || monster.image || "",
    attacks: monster.attacks || monster.actions || "",
    abilities: monster.abilities || monster.traits || "",
    source: monster.source || "Bestiario Solaris",
  })).slice(0, 40);
}

function sessionShopCatalog() {
  const buckets = [
    ["itens", "common"],
    ["armas", "weapon"],
    ["armaduras", "armor"],
    ["armazenamento", "utility"],
    ["chipsMod", "chip"],
    ["magias", "spell"],
    ["mods", "utility"],
  ];
  return buckets.flatMap(([view, sessionCategory]) => getLibraryItemsForView(view).map((item) => ({
    ...structuredCloneSafe(item),
    sessionCategory,
    categoryLabel: libraryMap[view]?.title || "Item",
    price: getLibraryPrice(item),
    sourceView: view,
  })));
}

function applySessionResourceUpdate(resources = {}) {
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const derived = derivedStats(totalAttributes(), race, profession);
  if (resources.currentPV !== undefined || resources.pvCurrent !== undefined) {
    state.current.pvCurrent = clamp(numberValue(resources.currentPV ?? resources.pvCurrent, state.current.pvCurrent), 0, derived.pvMax);
  }
  if (resources.cosmosCurrent !== undefined) {
    state.current.cosmosCurrent = clamp(numberValue(resources.cosmosCurrent, state.current.cosmosCurrent), 0, derived.cosmosMax);
  }
  if (resources.stress !== undefined) {
    state.current.stress = clamp(numberValue(resources.stress, state.current.stress), 0, derived.stressMax);
  }
  renderForm();
  persistCurrentCharacterSilently();
}

function applySessionFullCharacterSnapshot(snapshot = {}) {
  if (!snapshot) return;
  const characterId = snapshot.characterId || snapshot.id;
  if (characterId && characterId !== state.current.id) return;
  const incomingRevision = numberValue(snapshot.revision, 0);
  const currentRevision = numberValue(state.current.sessionRevision, 0);
  if (incomingRevision && incomingRevision < currentRevision) return;
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const derived = derivedStats(totalAttributes(), race, profession);
  if (snapshot.name !== undefined) state.current.name = String(snapshot.name || state.current.name);
  if (snapshot.player !== undefined) state.current.player = String(snapshot.player || state.current.player);
  if (snapshot.level !== undefined) state.current.level = clamp(numberValue(snapshot.level, state.current.level), 1, 10);
  if (snapshot.xp !== undefined) state.current.xp = Math.max(0, numberValue(snapshot.xp, state.current.xp || 0));
  if (snapshot.currentPV !== undefined || snapshot.pvCurrent !== undefined) {
    state.current.pvCurrent = clamp(numberValue(snapshot.currentPV ?? snapshot.pvCurrent, state.current.pvCurrent), 0, derived.pvMax);
  }
  if (snapshot.cosmosCurrent !== undefined) {
    state.current.cosmosCurrent = clamp(numberValue(snapshot.cosmosCurrent, state.current.cosmosCurrent), 0, derived.cosmosMax);
  }
  if (snapshot.stress !== undefined) {
    state.current.stress = clamp(numberValue(snapshot.stress, state.current.stress), 0, derived.stressMax);
  }
  if (snapshot.currency !== undefined || snapshot.luzentis !== undefined) {
    state.current.currency = Math.max(0, numberValue(snapshot.currency ?? snapshot.luzentis, state.current.currency));
  }
  if (Array.isArray(snapshot.inventory)) {
    state.current.inventory = structuredCloneSafe(snapshot.inventory);
  }
  if (snapshot.equipment) {
    state.current.equippedWeaponUid = snapshot.equipment.equippedWeaponUid || snapshot.loadout?.weaponUid || state.current.equippedWeaponUid || "";
    state.current.equippedArmorUid = snapshot.equipment.equippedArmorUid || snapshot.loadout?.armorUid || state.current.equippedArmorUid || "";
  }
  if (Array.isArray(snapshot.abilities)) {
    state.current.knownAbilities = structuredCloneSafe(snapshot.abilities);
  } else if (Array.isArray(snapshot.cosmicSpells) || Array.isArray(snapshot.modifierChips)) {
    const nonSessionAbilities = (state.current.knownAbilities || []).filter((ability) =>
      ability.source !== "Cosmos" && ability.source !== "Chip modificador"
    );
    state.current.knownAbilities = [
      ...nonSessionAbilities,
      ...structuredCloneSafe(snapshot.cosmicSpells || []),
      ...structuredCloneSafe(snapshot.modifierChips || []),
    ];
  }
  if (Array.isArray(snapshot.conditions)) state.current.conditions = structuredCloneSafe(snapshot.conditions);
  state.current.sessionRevision = incomingRevision || currentRevision;
  state.current.updatedAt = new Date().toISOString();
  renderForm();
  persistCurrentCharacterSilently();
}

function handleNavClick(view) {
  if (view === state.activeView) {
    setNavExpanded(!state.navExpanded);
    return;
  }
  switchView(view);
}

function setActiveNav(view) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    item.setAttribute("aria-current", active ? "page" : "false");
  });
}

function setNavExpanded(expanded) {
  state.navExpanded = Boolean(expanded);
  el.navList.classList.toggle("expanded", state.navExpanded);
  el.navList.setAttribute("aria-expanded", String(state.navExpanded));
}

function syncNavState() {
  setActiveNav(state.activeView);
  setNavExpanded(state.navExpanded);
}

function hideWorkspaceViews() {
  document.querySelectorAll(".workspace > .view").forEach((view) => view.classList.remove("active"));
  el.personagensView.classList.remove("standalone-tool-mode");
}

function switchView(view) {
  setActiveNav(view);
  setNavExpanded(false);
  state.activeView = view;
  state.activeRaceId = null;
  hideWorkspaceViews();

  const hubViews = {
    itensHub: el.itemsHubView,
    skillsHub: el.skillsHubView,
    booksHub: el.booksHubView,
    rulesHub: el.rulesHubView,
    criador: el.characterManagerView,
  };
  const isHub = Boolean(hubViews[view]);
  el.topbar.hidden = view === "inicio" || isHub || view === "mesaVirtual";
  document.body.classList.toggle("is-tablet-home", view === "inicio");
  document.body.classList.toggle("is-virtual-table", view === "mesaVirtual");
  document.querySelector("#saveButton").hidden = view !== "personagens";
  document.querySelector("#printButton").hidden = view !== "personagens";

  if (view === "inicio") {
    el.tabletHomeView.classList.add("active");
    renderLauncherSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (isHub) {
    hubViews[view].classList.add("active");
    if (view === "criador") renderSavedList();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (view === "mesaVirtual") {
    el.mesaVirtualView.classList.add("active");
    refreshMesaVirtual();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (view === "personagens") {
    if (state.activeCharacterPage === "guia" || state.activeCharacterPage === "dados") {
      switchCharacterPage("ficha");
    }
    el.personagensView.classList.add("active");
    el.viewKicker.textContent = "Ficha ativa";
    el.viewTitle.textContent = "Personagem";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (view === "guia" || view === "dados") {
    el.personagensView.classList.add("active", "standalone-tool-mode");
    switchCharacterPage(view);
    el.viewKicker.textContent = view === "guia" ? "Orientação do jogador" : "Mesa Solaris";
    el.viewTitle.textContent = view === "guia" ? "Guia de criação de personagens" : "Rolagem de dados";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (!libraryMap[view]) {
    switchView("inicio");
    return;
  }

  state.activeLibrary = view;
  el.libraryView.classList.add("active");
  el.viewKicker.textContent = "Biblioteca";
  el.viewTitle.textContent = libraryMap[view].title;
  el.librarySearch.value = "";
  el.libraryTierFilter.value = "";
  el.librarySort.value = "default";
  renderLibrary();
  state.libraryPresetFilter = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openRulebookLibrary(bookLabel) {
  if (!rulebookTitles[bookLabel]) return;
  state.libraryPresetFilter = bookLabel;
  switchView("regras");
}

function switchCharacterPage(page) {
  const pageIds = {
    ficha: "characterSheetPage",
    guia: "characterGuidePage",
    equipamentos: "characterEquipmentPage",
    cosmos: "characterCosmosPage",
    cubo: "characterCubePage",
    habilidades: "characterAbilitiesPage",
    dados: "characterDicePage",
    criar: "characterCreatePage",
  };
  state.activeCharacterPage = page;
  el.characterTabs.forEach((button) => button.classList.toggle("active", button.dataset.characterPage === page));
  el.characterPages.forEach((section) => section.classList.toggle("active", section.id === pageIds[page]));
  renderCharacterPages();
}

function openRaceDetail(raceId) {
  const race = findRace(raceId);
  state.activeView = "racas";
  state.activeLibrary = "racas";
  state.activeRaceId = race.id;
  setActiveNav("racas");
  setNavExpanded(false);
  el.personagensView.classList.remove("active");
  el.libraryView.classList.remove("active");
  el.raceDetailView.classList.add("active");
  el.viewKicker.textContent = "Raça jogável";
  el.viewTitle.textContent = race.name;
  renderRaceDetail(race);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderRaceDetail(race = findRace(state.activeRaceId)) {
  const fixedBonus = formatBonusSummary(race.bonus || {});
  const choiceText = race.choice
    ? `${race.choice.options.join(" ou ")} ${formatMod(race.choice.amount)}`
    : "Nenhuma escolha racial";
  const tags = (race.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");

  el.raceDetail.innerHTML = `
    <div class="race-detail-shell">
      <button class="back-button" id="raceBackButton" type="button">Voltar para raças</button>

      <section class="race-hero" data-detail-kind="library" data-detail-view="racas" data-detail-id="${escapeHtml(race.id)}">
        <div class="race-hero-copy">
          <p>Povo jogável</p>
          <h2>${renderCardTitleButton(race.name)}</h2>
          <strong>${escapeHtml(race.summary)}</strong>
          ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        </div>
        <div class="race-stat-strip" aria-label="Números da raça na ficha">
          ${renderRaceStatTile("Atributo", race.choice ? `${race.choice.options.join("/")} ${formatMod(race.choice.amount)}` : formatBonusSummary(race.bonus || {}))}
          ${renderRaceStatTile("PV racial", formatMod(race.pvBonus || 0))}
          ${renderRaceStatTile("Perícias extras", formatMod(race.extraTrainedSkills || 0))}
          ${renderRaceStatTile("Cosmos racial", formatMod(race.cosmos || 0))}
        </div>
      </section>

      <div class="race-detail-grid">
        <section class="race-info-panel">
          <h3>Perfil</h3>
          <div class="detail-list">
            ${renderDetailRow("Vida e maturidade", race.profile.age)}
            ${renderDetailRow("Altura e peso", race.profile.build)}
            ${renderDetailRow("Identidade", race.profile.culture)}
            ${renderDetailRow("Observação", race.profile.note)}
          </div>
        </section>

        <section class="race-info-panel">
          <h3>Criação</h3>
          <div class="detail-list">
            ${renderDetailRow("Bônus original", race.profile.attributeBonus)}
            ${renderDetailRow("Bônus fixo usado", fixedBonus)}
            ${renderDetailRow("Escolha no app", choiceText)}
            ${renderDetailRow("Perícia racial", race.profile.skill)}
            ${renderDetailRow("Cosmos nos documentos", race.profile.documentCosmos)}
          </div>
        </section>

        <section class="race-info-panel">
          <h3>Habilidade base</h3>
          <p>${escapeHtml(race.profile.baseAbility)}</p>
        </section>

        <section class="race-info-panel weakness-panel">
          <h3>Fraqueza</h3>
          <p>${escapeHtml(race.profile.weakness)}</p>
        </section>

        <section class="race-info-panel race-info-panel-wide">
          <h3>Habilidades por nível</h3>
          <ol class="race-progression">
            ${race.progression.map(renderRaceProgressionItem).join("")}
          </ol>
        </section>

        <section class="race-info-panel race-info-panel-wide document-panel">
          <h3>Notas dos documentos</h3>
          <ul class="race-note-list">
            ${race.documentNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
          </ul>
        </section>
      </div>
    </div>
  `;

  el.raceDetail.querySelector("#raceBackButton").addEventListener("click", () => switchView("racas"));
}

function renderRaceStatTile(label, value) {
  return `
    <div class="race-stat-tile">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderRaceProgressionItem(item) {
  return `
    <li>
      <span>${escapeHtml(item.level)}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.text)}</p>
      </div>
    </li>
  `;
}

function readForm() {
  const form = new FormData(el.form);
  state.current.name = form.get("name").trim();
  state.current.player = form.get("player").trim();
  state.current.race = form.get("race");
  state.current.racialChoice = form.get("racialChoice");
  state.current.profession = form.get("profession");
  state.current.level = numberValue(form.get("level"), 1);
  state.current.experience = Math.max(0, numberValue(form.get("experience"), 0));
  state.current.origin = form.get("origin").trim();
  ATTRIBUTES.forEach((attr) => {
    state.current.attributes[attr] = clamp(numberValue(form.get(attr), ATTRIBUTE_BASE), 0, 20);
  });
  state.current.pvCurrent = numberValue(form.get("pvCurrent"), 0);
  state.current.cosmosCurrent = numberValue(form.get("cosmosCurrent"), 0);
  state.current.stress = Math.max(numberValue(state.current.stressFloor, 0), numberValue(form.get("stress"), 0));
  state.current.weapon = form.get("weapon").trim();
  state.current.armor = form.get("armor").trim();
  state.current.loadUsed = numberValue(form.get("loadUsed"), 0);
  state.current.bodyWeightKg = Math.max(1, numberValue(form.get("bodyWeightKg"), 70));
  syncLoadUsedFromCubeStorage();
  state.current.currency = numberValue(form.get("currency"), 0);
  state.current.abilities = form.get("abilities").trim();
  state.current.notes = form.get("notes").trim();
  readCosmicSlotInputs();
}

function readCosmicSlotInputs() {
  const trainingInput = el.cosmosPageContent?.querySelector('[data-cosmic-slot-source="training"]');
  const grimoireInput = el.cosmosPageContent?.querySelector('[data-cosmic-slot-source="grimoires"]');
  if (trainingInput instanceof HTMLInputElement) {
    state.current.cosmicTrainingSlots = Math.max(0, numberValue(trainingInput.value, 0));
  }
  if (grimoireInput instanceof HTMLInputElement) {
    state.current.cosmicGrimoireSlots = Math.max(0, numberValue(grimoireInput.value, 0));
  }
}

function renderForm() {
  document.querySelector("#name").value = state.current.name;
  document.querySelector("#player").value = state.current.player;
  document.querySelector("#race").value = state.current.race;
  hydrateRacialChoice(state.current.race);
  document.querySelector("#racialChoice").value = defaultRacialChoice(findRace(state.current.race), state.current.racialChoice);
  document.querySelector("#profession").value = state.current.profession;
  document.querySelector("#level").value = state.current.level;
  document.querySelector("#experience").value = state.current.experience;
  document.querySelector("#origin").value = state.current.origin;
  ATTRIBUTES.forEach((attr) => {
    document.querySelector(`#${attr}`).value = state.current.attributes[attr] ?? 0;
  });
  document.querySelector("#pvCurrent").value = state.current.pvCurrent;
  document.querySelector("#cosmosCurrent").value = state.current.cosmosCurrent;
  document.querySelector("#stress").value = state.current.stress;
  document.querySelector("#weapon").value = state.current.weapon;
  document.querySelector("#armor").value = state.current.armor;
  syncLoadUsedFromCubeStorage();
  document.querySelector("#loadUsed").value = state.current.loadUsed;
  document.querySelector("#bodyWeightKg").value = state.current.bodyWeightKg;
  document.querySelector("#currency").value = state.current.currency;
  document.querySelector("#abilities").value = state.current.abilities;
  document.querySelector("#notes").value = state.current.notes;
  renderPhotoPreviews();
  hydrateQuickTests();
  applyManualTemplate();
  renderSummary();
}

function renderSummary() {
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const totals = totalAttributes();
  const derived = derivedStats(totals, race, profession);
  const cubeStorage = syncLoadUsedFromCubeStorage(cubeStorageStats(derived));
  const cubeLoad = cubeLoadStats(derived);
  syncLoadUsedInput();
  syncResourceBounds(derived);
  refreshSkillTrainingModifiers(totals);

  ATTRIBUTES.forEach((attr) => {
    const totalNode = document.querySelector(`#${attr}Total`);
    totalNode.textContent = `${totals[attr]} (${formatMod(attributeModifier(totals[attr]))})`;
  });

  document.querySelector("#summaryName").textContent = state.current.name || "Personagem sem nome";
  document.querySelector("#summaryLine").textContent = `${race.name} - ${profession.name} - Nível ${state.current.level}`;
  renderPhotoPreviews();
  document.querySelector("#currentSheetState").textContent = state.current.updatedAt
    ? `Salva em ${formatDate(state.current.updatedAt)}`
    : "Ficha nova";

  const diceProfile = currentDiceProfile();
  document.querySelector("#stressState").textContent = diceProfile.label;
  document.querySelector("#stressState").style.color = state.current.stress >= 6 ? "var(--danger)" : "var(--teal)";
  el.pvMaxInline.textContent = derived.pvMax;
  el.cosmosMaxInline.textContent = derived.cosmosMax;
  renderResourceMeters(derived);
  renderCubeLoadMonitor(cubeLoad);
  const modSlots = modifierSlotState();
  const cosmicSpellSlots = cosmicSpellSlotState();

  document.querySelector("#derivedStats").innerHTML = [
    ["PV", `${state.current.pvCurrent}/${derived.pvMax}`],
    ["CA", derived.ca],
    ["Mov.", `${derived.movement} m`],
    ["Cosmos", `${state.current.cosmosCurrent}/${derived.cosmosMax}`],
    ["Cubos", `${state.current.loadUsed}/${cubeStorage.totalUnits}`],
    ["Dados", `${diceProfile.count}d6`],
    ["Percepção", derived.passivePerception],
  ].map(([label, value]) => `
    <div class="stat-tile">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  const racialBonus = raceEffectiveBonus(race, state.current.racialChoice);
  document.querySelector("#bonusList").innerHTML = [
    ["Bônus racial", formatBonusSummary(racialBonus)],
    ["Benefícios da raça", raceMechanicalBenefitSummary(race)],
    ["Traços raciais", raceTraitNameSummary(race.profile?.baseAbility)],
    ["Fraqueza racial", raceTraitNameSummary(race.profile?.weakness)],
    ["Passivos de mods", formatPassiveEffectSummary(activeModifierPassiveEffects({ includeConditional: true }), { includeConditional: true })],
    ["CA base", BASE_CA],
    ["CA armadura equipada", derived.armorCa],
    ["CA mods", derived.passiveBonuses.ca || 0],
    ["Cosmos racial", race.cosmos || 0],
    ["Cosmos equipamento/mods", derived.equipmentCosmosBonus + derived.passiveBonuses.cosmosMax + derived.passiveBonuses.cosmosPerLevel * state.current.level],
    ["Foco", profession.focus || "—"],
    ["Perícia foco", profession.skill || "Combate/equipamento"],
    ["Talento", profession.talent || "—"],
    ["Kit inicial", profession.kit || "—"],
    ["Penalidade", profession.penalty || "—"],
  ].map(([label, value]) => renderDetailRow(label, value)).join("");

  document.querySelector("#slotList").innerHTML = [
    ["Capacidade de cubos", `${cubeLoad.maxCubes} cubo${cubeLoad.maxCubes === 1 ? "" : "s"}`],
    ["Carga total", `${formatWeight(cubeLoad.weightKg)}/${formatWeight(cubeLoad.capacityKg)} Kg`],
    ["Percepção passiva", derived.passivePerception],
    ["Interferência cósmica", cosmicEffectLabel(state.current.pendingCosmicEffect)],
    ["Mods ocupados", `${modSlots.used}/${modSlots.total}`],
    ["Mods livres", modSlots.over > 0 ? `Excedente ${modSlots.over}` : modSlots.free],
    ["Magias cósmicas", `${cosmicSpellSlots.used}/${cosmicSpellSlots.total}`],
    ["Armadura equipada", state.current.armor || "Nenhuma"],
    ["Arma equipada", state.current.weapon || "Nenhuma"],
  ].map(([label, value]) => `<div class="row-line"><span>${label}</span><strong>${value}</strong></div>`).join("");
  renderLauncherSummary({ race, profession, derived, diceProfile });
  renderStressHud(diceProfile, derived);
  renderCharacterPages(derived);
  refreshMesaVirtual();
}

function renderLauncherSummary(context = {}) {
  if (!el.launcherStats || !el.launcherResourceBars) return;
  const race = context.race || findRace(state.current.race);
  const profession = context.profession || findProfession(state.current.profession);
  const derived = context.derived || derivedStats(totalAttributes(), race, profession);
  const diceProfile = context.diceProfile || currentDiceProfile();
  const stressMax = derived.stressMax || STRESS_MAX;

  el.launcherName.textContent = state.current.name || "Personagem sem nome";
  el.launcherLine.textContent = `${race.name} // ${profession.name} // Nível ${state.current.level}`;
  el.launcherStats.innerHTML = [
    ["PV", `${state.current.pvCurrent}/${derived.pvMax}`],
    ["CA", derived.ca],
    ["MOV", `${derived.movement} m`],
    ["DADOS", `${diceProfile.count}d6`],
  ].map(([label, value]) => `
    <span>
      <small>${label}</small>
      <strong>${value}</strong>
    </span>
  `).join("");

  const resources = [
    ["PV", state.current.pvCurrent, derived.pvMax, "life"],
    ["COSMOS", state.current.cosmosCurrent, derived.cosmosMax, "cosmos"],
    ["ESTRESSE", state.current.stress, stressMax, "stress"],
  ];
  el.launcherResourceBars.innerHTML = resources.map(([label, value, max, kind]) => {
    const percent = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
    return `
      <span class="tablet-resource-row ${kind}">
        <span><small>${label}</small><strong>${value}/${max}</strong></span>
        <i><b style="width:${percent}%"></b></i>
      </span>
    `;
  }).join("");
}

function syncResourceBounds(derived) {
  state.current.pvCurrent = clamp(numberValue(state.current.pvCurrent, derived.pvMax), 0, derived.pvMax);
  state.current.cosmosCurrent = clamp(numberValue(state.current.cosmosCurrent, 0), 0, derived.cosmosMax);
  state.current.stress = clamp(
    numberValue(state.current.stress, 0),
    Math.max(0, numberValue(state.current.stressFloor, 0)),
    derived.stressMax || STRESS_MAX
  );
  const pvInput = document.querySelector("#pvCurrent");
  const cosmosInput = document.querySelector("#cosmosCurrent");
  const stressInput = document.querySelector("#stress");
  pvInput.max = derived.pvMax;
  cosmosInput.max = derived.cosmosMax;
  stressInput.max = derived.stressMax || STRESS_MAX;
  stressInput.min = Math.max(0, numberValue(state.current.stressFloor, 0));
  pvInput.value = state.current.pvCurrent;
  cosmosInput.value = state.current.cosmosCurrent;
  stressInput.value = state.current.stress;
}

function renderResourceMeters(derived) {
  const meterValues = [
    ["#pvMeter", derived.pvMax ? state.current.pvCurrent / derived.pvMax : 0],
    ["#cosmosMeter", derived.cosmosMax ? state.current.cosmosCurrent / derived.cosmosMax : 0],
    ["#stressMeter", derived.stressMax ? state.current.stress / derived.stressMax : 0],
  ];

  meterValues.forEach(([selector, ratio]) => {
    const meter = document.querySelector(selector);
    if (!meter) return;
    meter.style.width = `${Math.round(clamp(ratio, 0, 1) * 100)}%`;
  });
}

function currentDiceProfile() {
  if (state.current.stress >= 6) return { count: 2, label: "Colapso: 2d6", reason: "Estresse 6+" };
  return { count: 3, label: "Tríade: 3d6", reason: "Estável" };
}

function renderHudMetric(label, value, percent = 0, className = "") {
  const width = Math.round(clamp(numberValue(percent, 0), 0, 100));
  return `
    <div class="hud-metric ${className}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <div class="meter"><span style="width:${width}%"></span></div>
    </div>
  `;
}

function renderStressHud(diceProfile = currentDiceProfile(), derived = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession))) {
  el.stressHudPanel.className = "humanis-vital-host compact";
  if (!document.querySelector("#hud-humanis")) {
    el.stressHudPanel.innerHTML = '<div id="hud-humanis"></div>';
  }

  if (typeof window.renderHumanisVitalHUD !== "function") {
    document.querySelector("#hud-humanis").innerHTML = '<div class="empty-state">HUD Humanis não carregada.</div>';
    return;
  }

  window.renderHumanisVitalHUD("#hud-humanis", buildHumanisVitalHUDData(derived, diceProfile));
}

function buildHumanisVitalHUDData(derived, diceProfile) {
  const race = findRace(state.current.race);
  const equippedArmor = getEquippedMarketItem("armor");
  const pvPercent = derived.pvMax ? (state.current.pvCurrent / derived.pvMax) * 100 : 0;
  const injury = clamp(100 - pvPercent, 0, 100);
  const stressMax = derived.stressMax || STRESS_MAX;
  const stress = clamp(numberValue(state.current.stress, 0), 0, stressMax);
  const vitalSigns = state.current.vitalSigns || state.current.sinaisVitais || {};
  const vitalResources = state.current.vitalResources || state.current.resources || state.current.recursos || {};
  const conditions = state.current.conditions || state.current.condicoes || {};
  const bodyParts = state.current.bodyParts || state.current.corpo || {};
  const status = stress >= 6 || pvPercent <= 35 ? "ALERTA" : "ATIVO";

  return {
    id: formatHumanisHudId(),
    nome: state.current.name || "Personagem sem nome",
    raca: race.name || "Humanis",
    status,
    modelUrl: humanisHudModelUrl(),
    onBodyPartClick: (partName, value) => {
      showToast(`${humanisHudBodyPartLabel(partName)}: ${Math.round(value)}%`);
    },
    pv: {
      atual: state.current.pvCurrent,
      maximo: derived.pvMax,
    },
    estresse: {
      atual: stress,
      maximo: stressMax,
    },
    cosmos: {
      atual: state.current.cosmosCurrent,
      maximo: derived.cosmosMax,
    },
    defesa: buildHumanisDefenseData(derived, race, equippedArmor),
    sinaisVitais: {
      frequenciaCardiaca: optionalNumber(vitalSigns, ["frequenciaCardiaca", "heartRate", "batimentos"], inferHeartRate(pvPercent, stress)),
      pressaoArterial: vitalSigns.pressaoArterial || vitalSigns.bloodPressure || inferBloodPressure(pvPercent, stress),
      frequenciaRespiratoria: optionalNumber(vitalSigns, ["frequenciaRespiratoria", "respirationRate", "respiracao"], inferRespiration(stress)),
      temperatura: optionalNumber(vitalSigns, ["temperatura", "temperature"], inferTemperature(stress)).toFixed(1),
      saturacaoOxigenio: optionalNumber(vitalSigns, ["saturacaoOxigenio", "oxygen", "oxigenio"], inferOxygen(pvPercent)),
    },
    recursos: {
      hidratacao: optionalNumber(vitalResources, ["hidratacao", "hydration"], clamp(100 - stress * 2, 0, 100)),
      nutricao: optionalNumber(vitalResources, ["nutricao", "nutrition"], clamp(88 - Math.max(0, state.current.loadUsed - 2) * 3, 35, 100)),
    },
    condicoes: {
      sangramento: conditions.sangramento || conditions.bleeding || inferBleeding(pvPercent),
      alerta: conditions.alerta || conditions.alert || inferHudAlert(pvPercent, stress, diceProfile),
    },
    corpo: {
      cabeca: optionalNumber(bodyParts, ["cabeca", "head"], inferBodyPart(100, injury, stress)),
      pescoco: optionalNumber(bodyParts, ["pescoco", "neck"], inferBodyPart(98, injury, stress)),
      torax: optionalNumber(bodyParts, ["torax", "chest"], inferBodyPart(100, injury * 0.85, stress)),
      abdomen: optionalNumber(bodyParts, ["abdomen", "abdômen"], inferBodyPart(100, injury * 0.75, stress)),
      bracoDireito: optionalNumber(bodyParts, ["bracoDireito", "braçoDireito", "rightArm"], inferBodyPart(100, injury * 0.55, stress)),
      bracoEsquerdo: optionalNumber(bodyParts, ["bracoEsquerdo", "braçoEsquerdo", "leftArm"], inferBodyPart(100, injury * 0.55, stress)),
      pernaDireita: optionalNumber(bodyParts, ["pernaDireita", "rightLeg"], inferBodyPart(100, injury * 0.6, stress)),
      pernaEsquerda: optionalNumber(bodyParts, ["pernaEsquerda", "leftLeg"], inferBodyPart(100, injury * 0.6, stress)),
    },
    equipamento: {
      nome: "Equipamento Biometrico",
      sistema: equippedArmor ? equippedArmor.name : "Sistema Integrado",
      versao: "3.7.2",
    },
  };
}

function optionalNumber(source, keys, fallback) {
  const foundKey = keys.find((key) => source[key] !== undefined && source[key] !== "");
  return foundKey ? numberValue(source[foundKey], fallback) : fallback;
}

function formatHumanisHudId() {
  const raw = state.current.id || "humanis";
  return `H-${String(raw).replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase().padEnd(6, "0")}`;
}

function humanisHudModelUrl() {
  if (state.current.humanisModelUrl) return state.current.humanisModelUrl;
  if (state.current.modelUrl) return state.current.modelUrl;
  return window.location.protocol === "file:" ? "./assets/models/humanis.glb" : "/assets/models/humanis.glb";
}

function humanisHudBodyPartLabel(partName) {
  const labels = {
    cabeca: "Cabeca",
    pescoco: "Pescoco",
    torax: "Torax",
    abdomen: "Abdomen",
    bracoDireito: "Braco direito",
    bracoEsquerdo: "Braco esquerdo",
    pernaDireita: "Perna direita",
    pernaEsquerda: "Perna esquerda",
  };

  return labels[partName] || "Regiao corporal";
}

function inferHeartRate(pvPercent, stress) {
  return Math.round(clamp(72 + stress * 6 + (pvPercent < 50 ? 10 : 0), 55, 150));
}

function inferBloodPressure(pvPercent, stress) {
  const systolic = Math.round(clamp(120 + stress * 4 - (pvPercent < 30 ? 14 : 0), 80, 180));
  const diastolic = Math.round(clamp(80 + stress * 2 - (pvPercent < 30 ? 8 : 0), 50, 120));
  return `${systolic}/${diastolic}`;
}

function inferRespiration(stress) {
  return Math.round(clamp(16 + stress, 10, 32));
}

function inferTemperature(stress) {
  return clamp(36.7 + stress * 0.05, 35, 41);
}

function inferOxygen(pvPercent) {
  return Math.round(clamp(99 - (pvPercent < 35 ? 5 : 0), 70, 99));
}

function inferBleeding(pvPercent) {
  if (pvPercent <= 0) return "CRITICO";
  if (pvPercent < 30) return "RISCO";
  return "NENHUM";
}

function inferHudAlert(pvPercent, stress, diceProfile) {
  if (pvPercent <= 0) return "PV ESGOTADO";
  if (pvPercent < 35) return "PV EM RISCO";
  if (stress >= 6) return "COLAPSO POR ESTRESSE";
  return diceProfile.reason === "Estável" ? "NENHUM ALERTA" : diceProfile.reason.toUpperCase();
}

function inferBodyPart(base, injury, stress) {
  return Math.round(clamp(base - injury * 0.62 - stress * 1.5, 0, 100));
}

function buildHumanisDefenseData(derived, race, equippedArmor) {
  const armorText = [equippedArmor?.name, equippedArmor?.kind, equippedArmor?.summary, ...(equippedArmor?.tags || [])].join(" ").toLowerCase();
  const armorBonus = numberValue(derived.armorCa, 0);
  return {
    ca: derived.ca,
    fisica: Math.round(clamp(derived.ca * 7 + armorBonus * 5, 0, 100)),
    termica: Math.round(clamp(10 + armorBonus * 4 + (/term|fogo|calor|frio/.test(armorText) ? 22 : 0), 0, 100)),
    eletrica: Math.round(clamp(10 + armorBonus * 4 + (/eletr|energia|condutor/.test(armorText) ? 22 : 0), 0, 100)),
    cosmica: Math.round(clamp(10 + (race.cosmos || 0) * 12 + numberValue(derived.equipmentCosmosBonus, 0) * 18 + (/cosm/.test(armorText) ? 20 : 0), 0, 100)),
  };
}

function renderCharacterPages(derived = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession))) {
  renderCreationGuidePage(derived);
  renderEquipmentPage(derived);
  renderCosmosPage(derived);
  renderCubePage(derived);
  renderAbilitiesPage();
  renderDicePage();
  renderManualCreatedPage();
}

function renderCreationGuidePage(derived) {
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const totals = totalAttributes();
  const modifierSummary = ATTRIBUTES
    .map((attr) => `${attr} ${totals[attr]} (${formatMod(attributeModifier(totals[attr]))})`)
    .join(" | ");

  el.creationGuideContent.innerHTML = `
    <div class="creation-guide-layout">
      <section class="guide-hero">
        <div>
          <span class="ability-source">Solaris - criação em 10 passos</span>
          <h3>Crie um sobrevivente pronto para jogar</h3>
          <p>Use este roteiro junto da ficha. A ficha digital calcula boa parte dos números, mas o guia mostra por que cada escolha existe.</p>
        </div>
        <div class="guide-current-card">
          <strong>${escapeHtml(state.current.name || "Personagem sem nome")}</strong>
          <span>${escapeHtml(race.name)} - ${escapeHtml(profession.name)} - Nível ${escapeHtml(state.current.level)}</span>
          <small>${escapeHtml(modifierSummary)}</small>
        </div>
      </section>

      <section class="guide-action-strip">
        <button class="mini-button" type="button" data-guide-page="ficha">Abrir ficha</button>
        <button class="mini-button" type="button" data-guide-library="racas">Ver raças</button>
        <button class="mini-button" type="button" data-guide-library="profissoes">Ver profissões</button>
        <button class="mini-button" type="button" data-guide-page="equipamentos">Escolher equipamentos</button>
        <button class="primary-button" type="button" data-create-random-character>Criar personagem aleatório nível 1</button>
      </section>

      ${renderInitialAttributeRoller()}

      <section class="guide-step-grid">
        ${characterCreationSteps.map((step, index) => `
          <article class="guide-step-card">
            <span class="guide-step-number">${String(index + 1).padStart(2, "0")}</span>
            <h4>${escapeHtml(step.title)}</h4>
            <p>${escapeHtml(step.summary)}</p>
            <strong>${escapeHtml(step.fields)}</strong>
            <small>${escapeHtml(step.tip)}</small>
          </article>
        `).join("")}
      </section>

      <section class="guide-panel">
          <h3>Fórmulas rápidas</h3>
          <div class="guide-formula-list">
            ${characterCreationFormulas.map(([label, formula]) => `
              <div class="row-line">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(formula)}</strong>
              </div>
            `).join("")}
          </div>
      </section>

      <section class="guide-example-card">
        <h3>Exemplo rápido</h3>
        <p>Um Humanis Hacker pode priorizar REF e INT, escolher Tecnologia como ponto forte, usar uma pistola Tier F, uma armadura utilitária Tier F, 4 cubos e um objetivo como descobrir o que causou a explosão de Falaris.</p>
        <p>O importante é sair com uma função clara no grupo, uma fraqueza interessante e uma razão pessoal para entrar em ruínas, zonas hostis e conflitos.</p>
      </section>

      <section class="guide-panel danger-zone">
        <div>
          <span class="ability-source">Gerenciamento da ficha</span>
          <h3>Exclusão em massa</h3>
          <p>Estas ações removem conteúdo sem devolver Luzentis.</p>
        </div>
        <div class="bulk-delete-grid">
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="items">Excluir todos os itens comuns</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="weapons">Excluir todas as armas</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="armors">Excluir todas as armaduras</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="equipment">Excluir todos os equipamentos</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="chips">Excluir todos os chips modificadores</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="spells">Excluir todas as magias</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="manual">Excluir todas as habilidades manuais</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="monsters">Excluir todos os monstros da sessão</button>
          <button class="mini-button danger-mini-button" type="button" data-bulk-delete="inventory">Limpar inventário completo</button>
        </div>
      </section>

      <section class="guide-panel guide-checklist-panel">
        <h3>Checklist final</h3>
        <div class="guide-checklist">
          ${characterCreationChecklist.map((item) => `
            <label>
              <input type="checkbox" />
              <span>${escapeHtml(item)}</span>
            </label>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderInitialAttributeRoller() {
  const rollState = state.current.initialAttributeRoll || { rolls: [], kept: [] };
  const rolls = Array.isArray(rollState.rolls) ? rollState.rolls : [];
  const kept = Array.isArray(rollState.kept) ? rollState.kept : [];
  const discardedIndex = Number.isInteger(rollState.discardedIndex) ? rollState.discardedIndex : -1;
  const hasRoll = rolls.length === 7 && kept.length === ATTRIBUTES.length;

  return `
    <section class="guide-roller-card">
      <div class="guide-roller-header">
        <div>
          <span class="ability-source">Atributos iniciais</span>
          <h3>Role 7d6, descarte o menor e distribua</h3>
          <p>O resultado aplicado em cada atributo é sempre 7 + o dado escolhido. Use cada dado restante uma única vez.</p>
        </div>
        <button class="primary-button" type="button" data-roll-initial-attributes>Rolar 7d6</button>
      </div>
      ${hasRoll ? `
        <div class="initial-dice-row" aria-label="Dados de atributos iniciais">
          ${rolls.map((value, index) => `
            <span class="initial-die ${index === discardedIndex ? "discarded" : ""}" title="${index === discardedIndex ? "Dado descartado" : "Dado disponível"}">${value}</span>
          `).join("")}
        </div>
        <div class="attribute-assignment-grid">
          ${ATTRIBUTES.map((attr, attrIndex) => `
            <label>
              <span>${attr}</span>
              <select data-attribute-assignment="${attr}">
                ${kept.map((value, index) => `
                  <option value="${index}" ${index === attrIndex ? "selected" : ""}>Dado ${index + 1}: ${value} -> ${ATTRIBUTE_BASE + value}</option>
                `).join("")}
              </select>
            </label>
          `).join("")}
        </div>
        <button class="ghost-button" type="button" data-apply-initial-attributes>Aplicar atributos na ficha</button>
      ` : `
        <p class="inventory-note">Nenhuma rolagem feita ainda. Clique em Rolar 7d6 para gerar os valores iniciais.</p>
      `}
    </section>
  `;
}

function rollInitialAttributePool() {
  if (!ensureDiceRollAllowed()) return;
  readForm();
  const rolls = Array.from({ length: 7 }, () => Math.floor(Math.random() * 6) + 1);
  const discardedIndex = rolls.reduce((lowestIndex, value, index) => (
    value < rolls[lowestIndex] ? index : lowestIndex
  ), 0);
  const kept = rolls.filter((_, index) => index !== discardedIndex);
  state.current.initialAttributeRoll = { rolls, kept, discardedIndex };
  renderCharacterPages();
  showToast(`Atributos: ${rolls.join(", ")} | descartado ${rolls[discardedIndex]}`);
}

function applyInitialAttributePool() {
  readForm();
  const kept = state.current.initialAttributeRoll?.kept || [];
  if (kept.length !== ATTRIBUTES.length) {
    showToast("Role 7d6 antes de aplicar os atributos.");
    return;
  }

  const selects = [...el.creationGuideContent.querySelectorAll("[data-attribute-assignment]")];
  const selectedIndexes = selects.map((select) => Number(select.value));
  if (new Set(selectedIndexes).size !== ATTRIBUTES.length) {
    showToast("Use cada dado restante uma única vez.");
    return;
  }

  selects.forEach((select) => {
    const attr = select.dataset.attributeAssignment;
    state.current.attributes[attr] = ATTRIBUTE_BASE + kept[Number(select.value)];
  });
  renderForm();
  switchCharacterPage("ficha");
  showToast("Atributos iniciais aplicados na ficha.");
}

function entryLocationKind(entry) {
  if (entry?.location?.kind) return entry.location.kind;
  if (entry?.uid === state.current.equippedWeaponUid || entry?.uid === state.current.equippedArmorUid) return LOCATION_KINDS.EQUIPPED;
  if (entry?.cubeUid || entry?.inCube) return LOCATION_KINDS.CUBE;
  if (entry?.supportSlot === "gancho") return LOCATION_KINDS.HOOK;
  if (entry?.supportSlot === "coldre") return LOCATION_KINDS.HOLSTER;
  if (entry?.supportSlot === "bandoleira") return LOCATION_KINDS.BANDOLIER;
  return LOCATION_KINDS.UNASSIGNED;
}

function isStorageMarketItem(item) {
  if (!item) return false;
  if (["cube", "storage", "hook", "holster", "bandolier"].includes(item.category)) return true;
  const text = normalizeSearch([
    item.name,
    item.type,
    item.summary,
    ...(item.tags || []),
  ].filter(Boolean).join(" "));
  return /\b(cubo|armazenamento|recipiente|mochila|gancho|coldre|bandoleira)\b/.test(text);
}

function isConsumableItem(item) {
  if (!item) return false;
  if (item.consumable === true) return true;
  return (item.tags || []).some((tag) => normalizeSearch(tag) === "consumivel");
}

function isStorageInventoryEntry(entry) {
  return isStorageMarketItem(findMarketItem(entry?.itemId));
}

function inventoryStorageType(entry) {
  const storedType = entry?.domainEntity?.storage?.storageType;
  if (storedType) return storedType;
  const item = findMarketItem(entry?.itemId);
  if (!item) return "";
  if (item.category === "cube" || normalizeSearch(item.name).includes("cubo")) return "cube";
  const text = normalizeSearch([item.name, item.type, ...(item.tags || [])].filter(Boolean).join(" "));
  if (/coldre/.test(text)) return "holster";
  if (/bandoleira/.test(text)) return "bandolier";
  if (/gancho/.test(text)) return "hook";
  return isStorageMarketItem(item) ? "container" : "";
}

function groupInventoryForEquipment(entries = state.current.inventory) {
  const groups = { equipped: [], active: [], hooks: [], holsters: [], containers: [], cubes: [], common: [], unassigned: [] };
  entries.forEach((entry) => {
    const kind = entryLocationKind(entry);
    const storageType = inventoryStorageType(entry);
    if (kind === LOCATION_KINDS.EQUIPPED) groups.equipped.push(entry);
    else if (kind === LOCATION_KINDS.ACTIVE) groups.active.push(entry);
    else if (kind === LOCATION_KINDS.HOOK) groups.hooks.push(entry);
    else if ([LOCATION_KINDS.HOLSTER, LOCATION_KINDS.BANDOLIER].includes(kind)) groups.holsters.push(entry);
    else if (kind === LOCATION_KINDS.CONTAINER || storageType === "container") groups.containers.push(entry);
    else if (storageType === "hook") groups.hooks.push(entry);
    else if (["holster", "bandolier"].includes(storageType)) groups.holsters.push(entry);
    else if (storageType === "cube" || kind === LOCATION_KINDS.CUBE) groups.cubes.push(entry);
    else if (kind === LOCATION_KINDS.UNASSIGNED) groups.unassigned.push(entry);
    else groups.common.push(entry);
  });
  return groups;
}

function renderInventoryLocationSection(title, entries, note = "", className = "", supportState = externalSupportState()) {
  const key = `inventory:${dataSlug(title)}`;
  const paginated = paginateItems(entries, state.pagination[key] || 1);
  state.pagination[key] = paginated.page;
  return `
    <section class="inventory-panel inventory-panel-wide inventory-location-section ${className}">
      <div class="inventory-section-heading">
        <div>
          <h3>${escapeHtml(title)}</h3>
          ${note ? `<p class="inventory-note">${escapeHtml(note)}</p>` : ""}
        </div>
        <strong>${entries.length}</strong>
      </div>
      ${renderInventoryCards(paginated.items, {
        showCubeAction: true,
        showEquipAction: true,
        showSupportAction: true,
        draggable: true,
        supportState,
      })}
      <nav class="pagination-controls" aria-label="Paginação de ${escapeHtml(title)}">${renderPaginationControls(paginated, key)}</nav>
    </section>
  `;
}

function renderEquipmentPage(derived) {
  const equippedWeapon = getEquippedMarketItem("weapon");
  const equippedArmor = getEquippedMarketItem("armor");
  const equippedWeaponEntry = getEquippedInventoryEntry("weapon");
  const equippedArmorEntry = getEquippedInventoryEntry("armor");
  const modSlots = modifierSlotState();
  const supportState = externalSupportState();
  const inventoryGroups = groupInventoryForEquipment();
  const domainValidation = domainCharacterFromLegacy().validateInventory();
  el.equipmentWallet.textContent = formatCurrency(state.current.currency);
  el.equipmentPageContent.innerHTML = `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Painel de combate</h3>
      ${renderEquipmentCombatPanel(equippedWeapon)}
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Equipado</h3>
      <div class="detail-list">
        ${renderDetailRow("Arma", equippedWeapon ? marketLine(equippedWeapon) : "Nenhuma")}
        ${renderDetailRow("Armadura", equippedArmor ? `${marketLine(equippedArmor)} - CA ${equippedArmor.ca}` : "Nenhuma")}
        ${renderDetailRow("Rachaduras da arma", equippedWeaponEntry ? `${itemCrackLevel(equippedWeaponEntry)}/${ITEM_CRACK_MAX}` : "—")}
        ${renderDetailRow("Rachaduras da armadura", equippedArmorEntry ? `${itemCrackLevel(equippedArmorEntry)}/${ITEM_CRACK_MAX}` : "—")}
        ${renderDetailRow("CA total", derived.ca)}
        ${renderDetailRow("Mods ocupados", `${modSlots.used}/${modSlots.total}`)}
        ${renderDetailRow("Suportes externos", `${supportState.totalUsed}/${supportState.totalCapacity}`)}
        ${renderDetailRow(CURRENCY_NAME, formatCurrency(state.current.currency))}
      </div>
      <label class="crack-control">
        Rachaduras da arma equipada
        <input id="crackLevelInput" type="number" min="0" max="${ITEM_CRACK_MAX}" step="1" value="${itemCrackLevel(equippedWeaponEntry)}" ${equippedWeaponEntry ? "" : "disabled"} />
      </label>
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Suportes externos</h3>
      ${renderExternalSupportPanel(supportState)}
    </section>
    ${renderInventoryLocationSection("Equipado", inventoryGroups.equipped, "Armas, armadura e itens atualmente prontos no loadout.")}
    ${renderInventoryLocationSection("Ativos / acesso rápido", inventoryGroups.active, "Itens preparados para uso imediato durante uma cena.")}
    ${renderInventoryLocationSection("Ganchos", inventoryGroups.hooks, "Itens presos em ganchos externos.")}
    ${renderInventoryLocationSection("Coldres / bandoleiras", inventoryGroups.holsters, "Armas e itens presos em suportes de acesso rápido.")}
    ${renderInventoryLocationSection("Mochilas / recipientes", inventoryGroups.containers, "O armazenador e tudo que estiver dentro dele continuam contando para a carga carregada.")}
    ${renderInventoryLocationSection("Cubos", inventoryGroups.cubes, "Cubos, armazenadores e os itens vinculados a eles.")}
    ${renderInventoryLocationSection("Itens comuns", inventoryGroups.common, "Itens guardados em base, veículo ou outro armazenador.")}
    ${renderInventoryLocationSection(
      "Itens sem local definido",
      inventoryGroups.unassigned,
      domainValidation.warnings.length
        ? "Estes itens não estão prontos para uso. Use Mover para escolher uma localização."
        : "Nenhum alerta de localização.",
      inventoryGroups.unassigned.length ? "inventory-location-warning" : ""
    )}
  `;
}

function renderExternalSupportPanel(supportState = externalSupportState()) {
  return `
    <div class="external-support-summary">
      <div>
        <span class="ability-source">Acesso rápido</span>
        <p class="inventory-note">Itens presos em ganchos, coldres e bandoleiras ficam fora dos cubos e contam pelo peso real. Suportes de armadura só funcionam quando a armadura está equipada.</p>
      </div>
      <strong>${supportState.totalUsed}/${supportState.totalCapacity}</strong>
    </div>
    <div class="external-support-grid">
      ${supportState.types.map((typeState) => {
        const percent = typeState.capacity ? clamp(Math.round((typeState.used / typeState.capacity) * 100), 0, 100) : typeState.used ? 100 : 0;
        const sources = supportState.providers
          .filter((provider) => provider.counts[typeState.id] > 0)
          .map((provider) => `${provider.name} +${provider.counts[typeState.id]}`);
        return `
          <article class="external-support-card ${typeState.over > 0 ? "over-limit" : ""}" data-support-drop-kind="${escapeHtml(typeState.id)}">
            <div class="support-card-head">
              <span>${escapeHtml(typeState.label)}</span>
              <strong>${typeState.used}/${typeState.capacity}</strong>
            </div>
            <div class="support-meter" aria-label="Uso de ${escapeHtml(typeState.label)}">
              <span style="width:${percent}%"></span>
            </div>
            <p class="inventory-note">${escapeHtml(sources.length ? sources.join(" - ") : "Nenhum suporte deste tipo.")}</p>
            ${typeState.assigned.length ? `
              <div class="support-assigned-list">
                ${typeState.assigned.map((entry) => {
                  const item = findMarketItem(entry.itemId);
                  return item ? `
                    <div class="support-assigned-row">
                      <span>${escapeHtml(item.name)}</span>
                      <button class="mini-button" type="button" data-inventory-action="support-remove" data-uid="${escapeHtml(entry.uid)}">Soltar</button>
                    </div>
                  ` : "";
                }).join("")}
              </div>
            ` : '<p class="inventory-note">Nada preso aqui.</p>'}
            ${typeState.over > 0 ? `<p class="inventory-note support-warning">Excedente: solte ${typeState.over} item${typeState.over === 1 ? "" : "s"} ou equipe mais suporte.</p>` : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderEquipmentCombatPanel(equippedWeapon) {
  const group = classifyWeapon(equippedWeapon);
  const equippedWeaponEntry = getEquippedInventoryEntry("weapon");
  const crack = itemCrackLevel(equippedWeaponEntry);
  const broken = crack >= ITEM_CRACK_MAX;
  const attackAttr = weaponAttackAttribute(group);
  return `
    <div class="combat-panel">
      <div class="equipment-visual ${broken ? "broken" : ""}" ${equippedWeapon ? `data-detail-kind="inventory" data-detail-id="${escapeHtml(equippedWeapon.id)}" data-detail-uid="${escapeHtml(equippedWeaponEntry?.uid || "")}"` : ""}>
        ${renderWeaponSketch(group)}
        <div>
          <span class="ability-source">${escapeHtml(group.label)}</span>
          <h4>${equippedWeapon ? renderCardTitleButton(equippedWeapon.name) : escapeHtml("Nenhuma arma equipada")}</h4>
          <p>${escapeHtml(equippedWeapon ? marketMeta(equippedWeapon) : "Equipe uma arma para habilitar ataque e dano.")}</p>
          <div class="crack-track" aria-label="Graus de rachadura">
            ${Array.from({ length: ITEM_CRACK_MAX }, (_, index) => `<span class="${index < crack ? "filled" : ""}"></span>`).join("")}
          </div>
          <p class="inventory-note" id="equipmentCrackNote">${broken ? "Arma colapsada: precisa ser reparada antes de funcionar." : `Rachaduras ${crack}/${ITEM_CRACK_MAX}.`}</p>
        </div>
      </div>
      <div class="combat-actions">
        <button class="primary-button" type="button" data-equipment-roll="attack" ${equippedWeapon && !broken ? "" : "disabled"}>Ataque (${attackAttr})</button>
        <button class="ghost-button" type="button" data-equipment-roll="damage" ${equippedWeapon?.damage && !broken ? "" : "disabled"}>Dano ${escapeHtml(equippedWeapon?.damage || "")}</button>
      </div>
    </div>
  `;
}

function updateCrackVisual() {
  const crack = itemCrackLevel(getEquippedInventoryEntry("weapon"));
  const visual = el.equipmentPageContent.querySelector(".equipment-visual");
  if (!visual) return;
  visual.classList.toggle("broken", crack >= ITEM_CRACK_MAX);
  el.equipmentPageContent.querySelectorAll(".crack-track span").forEach((node, index) => {
    node.classList.toggle("filled", index < crack);
  });
  const note = el.equipmentPageContent.querySelector("#equipmentCrackNote");
  if (note) note.textContent = crack >= ITEM_CRACK_MAX ? "Arma colapsada: precisa ser reparada antes de funcionar." : `Rachaduras ${crack}/${ITEM_CRACK_MAX}.`;
}

function renderWeaponSketch(group) {
  const sketches = {
    firearm: '<svg viewBox="0 0 180 96"><path d="M22 35h92l13 9h31v13h-34l-12 9H77l-10 22H47l9-22H22z"/><path d="M116 44v21M41 35v31"/></svg>',
    rifle: '<svg viewBox="0 0 220 96"><path d="M18 42h126l18-12h38v16h-32l-18 11H66l-15 21H31l12-21H18z"/><path d="M146 31v35M78 38v24"/></svg>',
    blade: '<svg viewBox="0 0 180 96"><path d="M20 52h42l78-32 20 7-72 42H20z"/><path d="M58 38v30M34 42v22"/></svg>',
    axe: '<svg viewBox="0 0 180 96"><path d="M75 20h16v58H75z"/><path d="M89 18c38 4 54 19 51 39-21-6-36-5-51 8z"/><path d="M75 18c-28 5-40 17-36 36 15-5 25-3 36 9z"/></svg>',
    polearm: '<svg viewBox="0 0 220 96"><path d="M18 53h142"/><path d="M158 25l44 28-44 18 14-18z"/><path d="M44 45v16"/></svg>',
    blunt: '<svg viewBox="0 0 180 96"><path d="M30 66 112 24"/><path d="M105 16h34v24h-34z"/><path d="m44 59 12 18"/></svg>',
    launcher: '<svg viewBox="0 0 220 96"><path d="M22 38h128l42 18-42 18H22z"/><path d="M64 38v36M126 38v36"/><path d="M83 74 72 88H51l11-14z"/></svg>',
    unarmed: '<svg viewBox="0 0 160 96"><path d="M44 28h18v28H44zM65 18h18v38H65zM86 22h18v34H86zM107 32h16v36H61c-23 0-33-14-30-31l13 2z"/></svg>',
    generic: '<svg viewBox="0 0 180 96"><path d="M24 54h98l30-20 12 14-34 28H24z"/><path d="M54 42v26M92 42v26"/></svg>',
  };
  return `<div class="weapon-sketch" aria-hidden="true">${sketches[group.key] || sketches.generic}</div>`;
}

function renderCosmosPage(derived) {
  const profession = findProfession(state.current.profession);
  const equippedWeapon = getEquippedMarketItem("weapon");
  const equippedArmor = getEquippedMarketItem("armor");
  const learnedCosmosAndChips = (state.current.knownAbilities || []).filter((ability) => ["Cosmos", "Chip modificador"].includes(ability.source));
  const knownPaginationKey = "cosmos:known";
  const knownPaginated = paginateItems(learnedCosmosAndChips, state.pagination[knownPaginationKey] || 1);
  state.pagination[knownPaginationKey] = knownPaginated.page;
  const modSlots = modifierSlotState();
  const cosmicSpellSlots = cosmicSpellSlotState();
  const channelers = [equippedWeapon, equippedArmor]
    .filter((item) => item && /cosmos|canalizador|cósmic/i.test([item.summary, ...(item.tags || [])].join(" ")))
    .map(marketLine)
    .join(", ") || "Nenhum canalizador equipado";
  el.cosmosPageContent.innerHTML = `
    <section class="inventory-panel">
      <h3>Cosmos</h3>
      <div class="detail-list">
        ${renderDetailRow("Atual / máximo", `${state.current.cosmosCurrent}/${derived.cosmosMax}`)}
        ${renderDetailRow("Base por nível", LEVEL_COSMOS_BASE[state.current.level] || 1)}
        ${renderDetailRow("Bônus por equipamento", derived.equipmentCosmosBonus)}
        ${renderDetailRow("Canalização", channelers)}
      </div>
    </section>
    <section class="inventory-panel" data-detail-kind="library" data-detail-view="profissoes" data-detail-id="${escapeHtml(profession.id)}">
      <h3>Chip escolhido</h3>
      <h4>${renderCardTitleButton(profession.name)}</h4>
      <div class="detail-list">
        ${renderDetailRow("Chip", profession.name)}
        ${renderDetailRow("Foco", profession.focus || "—")}
        ${renderDetailRow("Talento", profession.talent || "—")}
        ${renderDetailRow("Kit", profession.kit || "—")}
        ${renderDetailRow("Penalidade", profession.penalty || "—")}
      </div>
      ${profession.id !== "escolha-profissao" ? '<button class="mini-button danger-mini-button" type="button" data-profession-action="remove">Remover chip de profissão</button>' : ""}
    </section>
    <section class="inventory-panel">
      <h3>Espaços de mods</h3>
      ${renderModifierSlotPanel(modSlots)}
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Espaços de magia cósmica</h3>
      ${renderCosmicSpellSlotPanel(cosmicSpellSlots)}
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Habilidades registradas</h3>
      ${learnedCosmosAndChips.length ? `<div class="ability-grid">${knownPaginated.items.map(renderKnownAbilityCard).join("")}</div><nav class="pagination-controls">${renderPaginationControls(knownPaginated, knownPaginationKey)}</nav>` : `<p class="inventory-note">${escapeHtml(state.current.abilities || "Nenhuma habilidade cósmica, chip modificador ou talento extra registrado ainda.")}</p>`}
    </section>
    ${renderInstalledModsPanel()}
  `;
}

function renderCosmicSpellSlotPanel(slots = cosmicSpellSlotState()) {
  const status = slots.over > 0
    ? `${slots.over} magia${slots.over > 1 ? "s" : ""} acima do limite`
    : `${slots.free} livre${slots.free === 1 ? "" : "s"}`;
  const percent = slots.total ? Math.min(100, Math.round((slots.used / slots.total) * 100)) : 0;
  return `
    <div class="mod-slot-panel cosmic-slot-panel ${slots.over > 0 ? "over-limit" : ""}">
      <div class="mod-slot-head">
        <span>Magias conhecidas</span>
        <strong>${slots.used}/${slots.total}</strong>
      </div>
      <div class="mod-slot-meter cosmic-slot-meter" aria-label="Uso dos espaços de magia cósmica">
        <span style="width:${percent}%"></span>
      </div>
      <p class="inventory-note">${escapeHtml(COSMIC_SPELL_SLOT_RULE_SUMMARY)}</p>
      <div class="slot-source-controls">
        <label>
          <span>Treino</span>
          <input type="number" min="0" step="1" value="${slots.training}" data-cosmic-slot-source="training" aria-label="Espaços de magia por treino" />
        </label>
        <label>
          <span>Grimórios</span>
          <input type="number" min="0" step="1" value="${slots.grimoires}" data-cosmic-slot-source="grimoires" aria-label="Espaços de magia por grimórios" />
        </label>
      </div>
      <div class="detail-list">
        ${renderDetailRow("Espaços livres", status)}
        ${slots.sources.map((source) => renderDetailRow(source.label, `${source.slots} espaço${source.slots === 1 ? "" : "s"}`)).join("")}
      </div>
    </div>
  `;
}

function renderModifierSlotPanel(modSlots = modifierSlotState()) {
  const status = modSlots.over > 0
    ? `${modSlots.over} espaço${modSlots.over === 1 ? "" : "s"} acima do limite`
    : `${modSlots.free} livre${modSlots.free === 1 ? "" : "s"}`;
  const percent = modSlots.total ? Math.min(100, Math.round((modSlots.used / modSlots.total) * 100)) : 0;
  return `
    <div class="mod-slot-panel ${modSlots.over > 0 ? "over-limit" : ""}">
      <div class="mod-slot-head">
        <span>Chips modificadores</span>
        <strong>${modSlots.used}/${modSlots.total}</strong>
      </div>
      <div class="mod-slot-meter" aria-label="Uso dos espaços de mods">
        <span style="width:${percent}%"></span>
      </div>
      <p class="inventory-note">Cada chip ocupa a quantidade de slots indicada no Livro 5. O total vem da arma e da armadura equipadas.</p>
      <div class="detail-list">
        ${renderDetailRow("Espaços livres", status)}
        ${modSlots.sources.map((source) => renderDetailRow(source.label, `${source.mods} mod${source.mods === 1 ? "" : "s"}`)).join("")}
      </div>
    </div>
  `;
}

function renderInstalledModsPanel() {
  const mods = state.current.installedMods || [];
  return `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Mods instalados</h3>
      ${mods.length ? `
        <div class="ability-grid">
          ${mods.map((mod) => `
            <article class="inventory-card ability-card compact-card with-actions" tabindex="0" data-detail-kind="installed-mod" data-detail-id="${escapeHtml(mod.id)}" data-detail-name="${escapeHtml(mod.name || "Mod sem nome")}">
              <div class="card-face">
                <span class="ability-source">Mod instalado</span>
                <h4>${renderCardTitleButton(mod.name || "Mod sem nome")}</h4>
                <p class="card-meta-line">${escapeHtml(mod.targetName || "Equipamento não informado")}</p>
              </div>
              <div class="inventory-actions">
                <button class="mini-button danger-mini-button" type="button" data-mod-action="remove" data-mod-id="${escapeHtml(mod.id)}">Remover mod</button>
              </div>
              <div class="card-hover-popover" role="tooltip">
                <strong>${escapeHtml(mod.name || "Mod sem nome")}</strong>
                <p>${escapeHtml(mod.effect || "Mod instalado no equipamento.")}</p>
              </div>
            </article>
          `).join("")}
        </div>
      ` : '<div class="empty-state">Nenhum mod instalado.</div>'}
    </section>
  `;
}

function renderCubePage(derived) {
  const storage = syncLoadUsedFromCubeStorage(cubeStorageStats(derived));
  const { cubes, usedUnits, totalUnits, looseItems, legacyCubeItems } = storage;
  const load = cubeLoadStats(derived);
  const openCube = cubes.find((entry) => entry.uid === state.openCubeUid) || cubes[0] || null;
  if (openCube && state.openCubeUid !== openCube.uid) state.openCubeUid = openCube.uid;
  const openCubeItems = openCube ? cubeContainedEntries(openCube.uid) : [];
  const cubeListKey = "cubes:physical";
  const looseItemsKey = "cubes:loose";
  const openCubeKey = `cubes:contents:${openCube?.uid || "none"}`;
  const legacyCubeKey = "cubes:legacy";
  const cubeListPage = paginateItems(cubes, state.pagination[cubeListKey] || 1);
  const looseItemsPage = paginateItems(looseItems, state.pagination[looseItemsKey] || 1);
  const openCubePage = paginateItems(openCubeItems, state.pagination[openCubeKey] || 1);
  const legacyCubePage = paginateItems(legacyCubeItems, state.pagination[legacyCubeKey] || 1);
  state.pagination[cubeListKey] = cubeListPage.page;
  state.pagination[looseItemsKey] = looseItemsPage.page;
  state.pagination[openCubeKey] = openCubePage.page;
  state.pagination[legacyCubeKey] = legacyCubePage.page;
  syncLoadUsedInput();
  el.cubeUsagePill.textContent = `${usedUnits}/${totalUnits} unidades`;
  el.cubePageContent.innerHTML = `
    <section class="inventory-panel">
      <h3>Sistema de cubos</h3>
      <div class="detail-list">
        ${renderDetailRow("Cubos físicos", cubes.length)}
        ${renderDetailRow("Unidades armazenadas", `${usedUnits}/${totalUnits}`)}
        ${renderDetailRow("Capacidade base da ficha", derived.cubeSlots)}
        ${renderDetailRow("Carga total", `${load.carriedCubes}/${load.maxCubes} cubo${load.maxCubes === 1 ? "" : "s"} - ${formatWeight(load.weightKg)}/${formatWeight(load.capacityKg)} Kg`)}
        ${renderDetailRow("Status", load.statusLabel)}
        ${renderDetailRow("Arrastar", "Arraste um item solto para dentro de um cubo.")}
      </div>
    </section>
    <section class="inventory-panel">
      <h3>Criar cubo</h3>
      ${renderCubeCreatorForm()}
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Cubos do personagem</h3>
      ${cubes.length ? `<div class="cube-grid">${cubeListPage.items.map(renderCubeCard).join("")}</div><nav class="pagination-controls">${renderPaginationControls(cubeListPage, cubeListKey)}</nav>` : '<div class="empty-state">Nenhum cubo criado. Crie um cubo aqui ou compre o Cubo simples na biblioteca de Itens.</div>'}
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Itens soltos</h3>
      ${renderInventoryCards(looseItemsPage.items, { showCubeAction: false, showEquipAction: false, draggable: true })}
      <nav class="pagination-controls">${renderPaginationControls(looseItemsPage, looseItemsKey)}</nav>
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>${openCube ? `Interior: ${escapeHtml(cubeDisplayName(openCube))}` : "Interior do cubo"}</h3>
      ${openCube ? `
        <p class="inventory-note">Duplo clique em outro cubo para abrir o interior dele. Para tirar um item, use o botão abaixo.</p>
        ${renderInventoryCards(openCubePage.items, { showCubeAction: true, showEquipAction: false })}
        <nav class="pagination-controls">${renderPaginationControls(openCubePage, openCubeKey)}</nav>
      ` : '<div class="empty-state">Nenhum cubo selecionado.</div>'}
    </section>
    ${legacyCubeItems.length ? `
      <section class="inventory-panel inventory-panel-wide">
        <h3>Cubo antigo da ficha</h3>
        <p class="inventory-note">Itens salvos no formato antigo aparecem aqui até serem retirados e colocados em um cubo físico.</p>
        ${renderInventoryCards(legacyCubePage.items, { showCubeAction: true, showEquipAction: false })}
        <nav class="pagination-controls">${renderPaginationControls(legacyCubePage, legacyCubeKey)}</nav>
      </section>
    ` : ""}
  `;
}

function renderCubeCreatorForm() {
  return `
    <form class="cube-create-form" data-cube-create-form>
      <label>
        Tipo
        <select data-cube-create-type>
          <option value="simple">Cubo simples</option>
          <option value="cargo">Cubo de cargas</option>
          <option value="specialized">Cubo especializado</option>
        </select>
      </label>
      <label>
        Nome
        <input type="text" data-cube-create-name placeholder="Ex.: Cubo de minério" />
      </label>
      <label data-cube-variation-field hidden>
        Capacidade
        <input type="number" min="1" max="10" step="1" value="1" data-cube-create-capacity disabled />
      </label>
      <p class="inventory-note" data-cube-create-summary>${escapeHtml(CUBE_TYPE_DEFINITIONS.simple.summary)}</p>
      <button class="primary-button" type="submit">Criar cubo</button>
    </form>
  `;
}

function renderCubeCard(entry) {
  const item = findMarketItem(entry.itemId);
  const capacity = cubeCapacity(entry);
  const contents = cubeContainedEntries(entry.uid);
  const ratio = capacity ? clamp(contents.length / capacity, 0, 1) : 1;
  const hue = Math.round(128 - ratio * 128);
  const status = contents.length >= capacity ? "Cheio" : contents.length === 0 ? "Vazio" : "Parcial";
  const selected = state.openCubeUid === entry.uid;
  return `
    <article class="cube-card compact-card ${selected ? "selected" : ""}" tabindex="0" data-cube-drop-uid="${escapeHtml(entry.uid)}" data-detail-kind="inventory" data-detail-id="${escapeHtml(entry.itemId)}" data-detail-uid="${escapeHtml(entry.uid)}" style="--cube-hue:${hue}; --cube-fill:${Math.round(ratio * 100)}%">
      <div class="cube-core" aria-hidden="true">
        <span></span>
      </div>
      <div class="cube-card-body">
        <span class="ability-source">${escapeHtml(cubeTypeLabel(entry))}</span>
        <h4>${renderCardTitleButton(cubeDisplayName(entry))}</h4>
        <p class="card-meta-line">${contents.length}/${capacity} unidades - ${escapeHtml(status)}</p>
        <p class="inventory-note">${escapeHtml(cubeRuleText(entry))}</p>
      </div>
      <div class="inventory-actions">
        <button class="mini-button" type="button" data-inventory-action="open-cube" data-uid="${escapeHtml(entry.uid)}">Abrir</button>
        <button class="mini-button" type="button" data-inventory-action="move" data-uid="${escapeHtml(entry.uid)}">Mover</button>
        <button class="mini-button danger-mini-button" type="button" data-inventory-action="sell" data-uid="${escapeHtml(entry.uid)}">Vender</button>
        <button class="mini-button danger-mini-button" type="button" data-inventory-action="delete" data-uid="${escapeHtml(entry.uid)}">Excluir</button>
      </div>
      <div class="card-hover-popover" role="tooltip">
        <strong>${escapeHtml(cubeDisplayName(entry))}</strong>
        <p>${escapeHtml(cubeRuleText(entry))}</p>
        <p>${escapeHtml(item?.summary || "Cubo criado na ficha.")}</p>
      </div>
    </article>
  `;
}

function syncCubeCreatorFields(form) {
  if (!form) return;
  const type = form.querySelector("[data-cube-create-type]")?.value || "simple";
  const definition = CUBE_TYPE_DEFINITIONS[type] || CUBE_TYPE_DEFINITIONS.simple;
  form.querySelectorAll("[data-cube-variation-field]").forEach((field) => {
    field.hidden = type === "simple";
  });
  const capacityInput = form.querySelector("[data-cube-create-capacity]");
  if (capacityInput instanceof HTMLInputElement) {
    const wasFixed = capacityInput.disabled;
    capacityInput.disabled = type === "simple";
    if (type === "simple") capacityInput.value = "1";
    else if (wasFixed || !capacityInput.value) capacityInput.value = "4";
  }
  const summary = form.querySelector("[data-cube-create-summary]");
  if (summary) {
    summary.textContent = type === "simple"
      ? definition.summary
      : `${definition.summary} Ajuste a capacidade; o vínculo será definido pelo primeiro item guardado.`;
  }
}

function createCubeFromForm(event) {
  event.preventDefault();
  readForm();
  if (!canAddPhysicalCube()) return;
  const form = event.target;
  const type = form.querySelector("[data-cube-create-type]")?.value || "simple";
  const definition = CUBE_TYPE_DEFINITIONS[type] || CUBE_TYPE_DEFINITIONS.simple;
  const nameInput = form.querySelector("[data-cube-create-name]");
  const capacityInput = form.querySelector("[data-cube-create-capacity]");
  const capacity = definition.fixedCapacity || clamp(numberValue(capacityInput?.value, 4), 1, 10);
  const id = `custom-cube-${type}-${dataSlug(nameInput?.value || definition.label)}-${Date.now()}`;
  const item = {
    id,
    category: "cube",
    name: String(nameInput?.value || "").trim() || definition.label,
    tier: "Custom",
    cubeKind: type,
    cubeCapacity: capacity,
    cubeMaterialMode: definition.materialMode,
    price: 0,
    weight: `${CUBE_WEIGHT_KG} Kg`,
    tags: uniqueTags(["cubo", type]),
    summary: type === "simple"
      ? definition.summary
      : `${definition.summary} Capacidade: ${capacity} unidade${capacity === 1 ? "" : "s"}. O vínculo é definido pelo primeiro item guardado.`,
  };
  state.current.customItems = state.current.customItems || [];
  state.current.customItems.unshift(item);
  const uid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const domain = domainCharacterFromLegacy();
    const entity = domainDefinitionForItem(item).createInstance({
      id: uid,
      location: { kind: LOCATION_KINDS.UNASSIGNED },
    });
    domain.inventory.add(entity);
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    state.openCubeUid = entity.id;
  } catch (error) {
    state.current.customItems = state.current.customItems.filter((entry) => entry.id !== item.id);
    showToast(error.message || "Não foi possível criar o cubo.", "tech-error");
    return;
  }
  form.reset();
  renderSummary();
  showToast(`${item.name} criado.`);
}

function openCubeInterior(uid) {
  if (!uid || !getCubeEntries().some((entry) => entry.uid === uid)) return;
  state.openCubeUid = uid;
  renderSummary();
}

function moveInventoryItemToCube(itemUid, cubeUid) {
  const itemEntry = getInventoryEntry(itemUid);
  const cubeEntry = getInventoryEntry(cubeUid);
  if (!itemEntry || !cubeEntry || !isCubeEntry(cubeEntry)) return;
  const item = findMarketItem(itemEntry.itemId);
  if (!item || !canStoreEntryInPhysicalCube(itemEntry)) {
    showToast("Apenas itens soltos podem entrar em cubos.");
    return;
  }
  if (!canDisableExternalSupportProvider(itemEntry)) return;
  if (itemEntry.uid === cubeEntry.uid) return;
  const capacity = cubeCapacity(cubeEntry);
  const contents = cubeContainedEntries(cubeEntry.uid);
  if (contents.length >= capacity) {
    showToast(`${cubeDisplayName(cubeEntry)} está cheio.`);
    return;
  }
  if (!cubeAcceptsItem(cubeEntry, itemEntry)) {
    showToast(cubeRejectText(cubeEntry));
    return;
  }
  const domain = domainCharacterFromLegacy();
  try {
    domain.moveEntityTo(itemUid, { kind: LOCATION_KINDS.CUBE, containerId: cubeUid });
  } catch (error) {
    showToast(error.message || "Não foi possível guardar o item neste cubo.", "tech-error");
    return;
  }
  syncDomainCharacterToLegacy(domain);
  persistCurrentCharacterSilently();
  state.openCubeUid = cubeEntry.uid;
  renderSummary();
  showToast(`${item.name} guardado em ${cubeDisplayName(cubeEntry)}.`);
}

function renderAbilitiesPage() {
  const entries = collectAbilityEntries();
  const key = "abilities:all";
  const paginated = paginateItems(entries, state.pagination[key] || 1);
  state.pagination[key] = paginated.page;
  el.abilitiesPageContent.innerHTML = `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Habilidades do personagem</h3>
      ${entries.length ? `<div class="ability-grid">${paginated.items.map(renderAbilityCard).join("")}</div><nav class="pagination-controls">${renderPaginationControls(paginated, key)}</nav>` : '<div class="empty-state">Nenhuma habilidade vinculada à ficha ainda.</div>'}
    </section>
  `;
}

function unassignedInventoryEntries() {
  return (state.current.inventory || []).filter((entry) => entryLocationKind(entry) === LOCATION_KINDS.UNASSIGNED);
}

function diceLockMessage(entries = unassignedInventoryEntries()) {
  const names = entries.slice(0, 3).map((entry) => findMarketItem(entry.itemId)?.name || "Item sem nome");
  const remaining = Math.max(0, entries.length - names.length);
  return `Itens sem local definido: ${names.join(", ")}${remaining ? ` e mais ${remaining}` : ""}.`;
}

function ensureDiceRollAllowed() {
  return true;
}

function renderDicePage() {
  const log = state.current.diceLog || [];
  const latest = log[0];
  const unassigned = unassignedInventoryEntries();
  const hasLocationWarnings = unassigned.length > 0;
  el.rollDiceButton.disabled = false;
  el.rollInitiativeButton.disabled = false;
  el.diceLockNotice.hidden = !hasLocationWarnings;
  el.diceLockNotice.textContent = hasLocationWarnings
    ? `Aviso de inventário: ${diceLockMessage(unassigned)} As rolagens continuam liberadas.`
    : "";
  el.diceResultDisplay.classList.toggle("empty-state", !latest);
  el.diceResultDisplay.innerHTML = latest ? `
    <div class="dice-total">
      <span>${escapeHtml(latest.label || latest.formula)}</span>
      <strong>${latest.total}</strong>
    </div>
    <div class="die-row">
      ${latest.rolls.map((roll) => `<span class="die-face" aria-label="Dado rolado ${roll}">${roll}</span>`).join("")}
    </div>
    <p>${escapeHtml(latest.formula)}</p>
    ${latest.resultLabel ? `<p><strong>${escapeHtml(latest.resultLabel)}</strong></p>` : ""}
    ${latest.cosmicEffect ? `<p>${escapeHtml(latest.cosmicEffect)}</p>` : ""}
    ${latest.triggeredCosmicEffect && latest.triggeredCosmicEffect !== "Nenhuma" ? `<p>${escapeHtml(latest.triggeredCosmicEffect)}</p>` : ""}
    ${latest.alternateRolls?.length ? `<p>Alternativas: ${escapeHtml(latest.alternateRolls.map((rolls) => `[${rolls.join(", ")}]`).join(" / "))}</p>` : ""}
    ${latest.modifier || latest.bonus ? `<p>Modificador: ${formatMod(latest.modifier || 0)} | Bônus: ${formatMod(latest.bonus || 0)}</p>` : ""}
  ` : "Nenhuma rolagem ainda.";

  el.diceChatLog.innerHTML = log.length ? log.map((entry) => `
    <article class="dice-log-entry">
      <div>
        <strong>${escapeHtml(entry.label || entry.formula)} = ${entry.total}</strong>
        <span>${escapeHtml(entry.formula)} | ${escapeHtml(entry.rolls.join(", "))}${entry.modifier ? ` ${formatMod(entry.modifier)}` : ""}${entry.bonus ? ` ${formatMod(entry.bonus)}` : ""}${entry.mode && entry.mode !== "normal" ? ` | ${entry.mode === "advantage" ? "vantagem" : "desvantagem"}` : ""}${entry.resultLabel ? ` | ${escapeHtml(entry.resultLabel)}` : ""}</span>
      </div>
      <time>${escapeHtml(formatShortTime(entry.createdAt))}</time>
    </article>
  `).join("") : '<div class="empty-state">O chat ainda não tem rolagens.</div>';
}

function renderManualCreatedPage() {
  const customItems = state.current.customItems || [];
  const customAbilities = (state.current.knownAbilities || []).filter((ability) => ability.custom);
  const customRecords = state.current.customRecords || [];
  const entries = [
    ...customItems.map((item) => ({
      name: item.name,
      source: marketCategoryLabel(item.category),
      effect: item.summary,
      meta: marketMeta(item),
      imageDataUrl: item.imageDataUrl,
      imageName: item.imageName,
      deleteId: item.id,
      deleteType: "item",
      exportId: customLibraryDestination(item, "item") ? item.id : "",
      exportType: "item",
      exportedToLibrary: isCustomContentExported(item.id),
    })),
    ...customAbilities.map((ability) => ({
      ...ability,
      deleteId: ability.id,
      deleteType: "ability",
      exportId: customLibraryDestination(ability, "ability") ? ability.id : "",
      exportType: "ability",
      exportedToLibrary: isCustomContentExported(ability.id),
    })),
    ...customRecords.map((record) => ({
      name: record.name,
      source: manualRecordCategoryLabel(record.category),
      effect: formatOfficialRecordFields(record),
      meta: [record.tier ? `Tier ${record.tier}` : "", record.source].filter(Boolean).join(" - "),
      imageDataUrl: record.imageDataUrl,
      imageName: record.imageName,
      deleteId: record.id,
      deleteType: "record",
      exportId: customLibraryDestination(record, "record") ? record.id : "",
      exportType: "record",
      exportedToLibrary: isCustomContentExported(record.id),
    })),
  ];
  const key = "manual:created";
  const paginated = paginateItems(entries, state.pagination[key] || 1);
  state.pagination[key] = paginated.page;
  el.manualCreatedContent.innerHTML = `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Conteúdo criado</h3>
      ${entries.length ? `
        <div class="ability-grid">
          ${paginated.items.map(renderAbilityCard).join("")}
        </div>
        <nav class="pagination-controls">${renderPaginationControls(paginated, key)}</nav>
      ` : '<div class="empty-state">Nada criado manualmente ainda.</div>'}
    </section>
  `;
}

function manualRecordCategoryLabel(category) {
  const labels = {
    mod: "Mod",
    cube: "Cubo",
    "special-item": "Item especial",
    crafting: "Crafting",
    vehicle: "Veículo",
    pursuit: "Perseguição",
    drone: "Drone",
    turret: "Torreta",
    robot: "Robô",
    hacking: "Hacking",
    network: "Rede digital",
    shop: "Loja",
    "black-market": "Mercado negro",
  };
  return labels[category] || "Modelo oficial";
}

function formatOfficialRecordFields(record) {
  const fields = Object.entries(record.fields || {});
  if (!fields.length) return record.summary || "Registro criado pelo modelo oficial.";
  return fields.map(([key, value]) => `${fieldLabelFromId(key)}: ${value}`).join(" | ");
}

function fieldLabelFromId(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderAbilityCard(entry) {
  const passiveSummary = formatPassiveEffectSummary(entry.passiveEffects, { includeConditional: true, empty: "" });
  const knownAbility = entry.knownAbility === true;
  const hasActions = Boolean(entry.deleteId || entry.exportId || knownAbility || entry.professionRemovable);
  return `
    <article class="inventory-card ability-card compact-card ${hasActions ? "with-actions" : ""} ${entry.imageDataUrl ? "with-image" : ""}" tabindex="0" data-detail-kind="ability" data-detail-id="${escapeHtml(entry.id || entry.deleteId || "")}" data-detail-name="${escapeHtml(entry.name)}" data-detail-source="${escapeHtml(entry.source || "")}">
      ${renderCardImage(entry)}
      <div class="card-face">
        <span class="ability-source">${escapeHtml(entry.source || "Manual")}</span>
        <h4>${renderCardTitleButton(entry.name)}</h4>
        ${entry.meta ? `<p class="card-meta-line">${escapeHtml(entry.meta)}</p>` : ""}
      </div>
      ${hasActions ? `
        <div class="inventory-actions">
          ${entry.professionRemovable ? '<button class="mini-button danger-mini-button" type="button" data-profession-action="remove">Remover chip</button>' : ""}
          ${knownAbility ? renderKnownAbilityActions(entry) : ""}
          ${entry.exportId ? `<button class="mini-button" type="button" data-custom-content-export="${escapeHtml(entry.exportId)}" data-custom-content-type="${escapeHtml(entry.exportType)}">${entry.exportedToLibrary ? "Atualizar biblioteca" : "Enviar à biblioteca"}</button>` : ""}
          ${entry.deleteId ? `<button class="mini-button danger-mini-button" type="button" data-custom-content-delete="${escapeHtml(entry.deleteId)}" data-custom-content-type="${escapeHtml(entry.deleteType || "ability")}">Excluir</button>` : ""}
        </div>
      ` : ""}
      <div class="card-hover-popover" role="tooltip">
        <strong>${escapeHtml(entry.name)}</strong>
        ${entry.meta ? `<p>${escapeHtml(entry.meta)}</p>` : ""}
        ${passiveSummary ? `<p><strong>Passivo automático:</strong> ${escapeHtml(passiveSummary)}</p>` : ""}
        <p>${escapeHtml(entry.effect || "Sem efeito registrado.")}</p>
      </div>
    </article>
  `;
}

function renderKnownAbilityCard(entry) {
  const passiveSummary = formatPassiveEffectSummary(entry.passiveEffects, { includeConditional: true, empty: "" });
  return `
    <article class="inventory-card ability-card compact-card with-actions ${entry.imageDataUrl ? "with-image" : ""}" tabindex="0" data-detail-kind="ability" data-detail-id="${escapeHtml(entry.id || "")}" data-detail-name="${escapeHtml(entry.name)}" data-detail-source="${escapeHtml(entry.source || "")}">
      ${renderCardImage(entry)}
      <div class="card-face">
        <span class="ability-source">${escapeHtml(entry.source || "Manual")}</span>
        <h4>${renderCardTitleButton(entry.name)}</h4>
        ${entry.meta ? `<p class="card-meta-line">${escapeHtml(entry.meta)}</p>` : ""}
      </div>
      <div class="inventory-actions">${renderKnownAbilityActions(entry)}</div>
      <div class="card-hover-popover" role="tooltip">
        <strong>${escapeHtml(entry.name)}</strong>
        ${entry.meta ? `<p>${escapeHtml(entry.meta)}</p>` : ""}
        ${passiveSummary ? `<p><strong>Passivo automático:</strong> ${escapeHtml(passiveSummary)}</p>` : ""}
        <p>${escapeHtml(entry.effect || "Sem efeito registrado.")}</p>
      </div>
    </article>
  `;
}

function renderKnownAbilityActions(entry) {
  if (entry.source === "Cosmos") {
    return `<button class="mini-button danger-mini-button" type="button" data-ability-action="remove" data-ability-id="${escapeHtml(entry.id)}">Remover magia</button>`;
  }
  if (entry.source === "Chip modificador") {
    return `
      <button class="mini-button" type="button" data-ability-action="${entry.installed === false ? "install" : "uninstall"}" data-ability-id="${escapeHtml(entry.id)}">${entry.installed === false ? "Instalar" : "Desinstalar"}</button>
      <button class="mini-button danger-mini-button" type="button" data-ability-action="delete" data-ability-id="${escapeHtml(entry.id)}">Excluir</button>
    `;
  }
  return `<button class="mini-button danger-mini-button" type="button" data-ability-action="delete" data-ability-id="${escapeHtml(entry.id)}">Excluir</button>`;
}

function renderCardImage(entry) {
  const image = entry?.imageDataUrl || entry?.image || "";
  if (!image) return "";
  return `
    <div class="item-card-image">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(entry.imageName || entry.name || "Imagem do item")}" />
    </div>
  `;
}

function renderCardTitleButton(name) {
  return `
    <button class="card-title-button" type="button" data-card-details-toggle aria-expanded="false" aria-label="Ver detalhes de ${escapeHtml(name)}">
      ${escapeHtml(name)}
    </button>
  `;
}

function handleCardDetailsClick(event) {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest("[data-card-details-toggle]");
  if (trigger) {
    const card = trigger.closest(".compact-card");
    if (!card) return;
    event.preventDefault();
    event.stopPropagation();
    toggleCardDetails(card);
    return;
  }

  if (!event.target.closest(".card-hover-popover")) {
    closeCardDetails();
  }
}

function toggleCardDetails(card) {
  const shouldOpen = !card.classList.contains("details-open");
  closeCardDetails(card);
  card.classList.toggle("details-open", shouldOpen);
  const trigger = card.querySelector("[data-card-details-toggle]");
  if (trigger) trigger.setAttribute("aria-expanded", String(shouldOpen));
}

function closeCardDetails(exceptCard = null) {
  document.querySelectorAll(".compact-card.details-open").forEach((card) => {
    if (card === exceptCard) return;
    card.classList.remove("details-open");
    const trigger = card.querySelector("[data-card-details-toggle]");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

const universalDetailFieldLabels = {
  source: "Fonte oficial",
  usageGuide: "Guia de utilização",
  summary: "Descrição resumida",
  effect: "Efeito",
  context: "Contexto",
  tier: "Tier",
  type: "Tipo",
  kind: "Categoria",
  category: "Categoria",
  role: "Papel",
  size: "Tamanho",
  pv: "Pontos de Vida",
  ca: "Classe de Armadura",
  movement: "Movimento",
  habitat: "Habitat",
  behavior: "Comportamento",
  attributes: "Atributos",
  attacks: "Ataques",
  abilities: "Habilidades",
  resistances: "Resistências",
  weaknesses: "Fraquezas",
  senses: "Sentidos",
  moral: "Moral",
  resources: "Recursos coletáveis",
  campaign: "Uso em campanha",
  attack: "Atributo da jogada de ataque",
  damage: "Dano",
  range: "Alcance",
  ammo: "Munição",
  capacity: "Capacidade / Cadência",
  handling: "Empunhadura",
  mods: "Espaços de mod",
  cracks: "Limite de rachaduras",
  jammed: "Condição de falha (Jammed)",
  failure: "Falha ou limite",
  legality: "Legalidade",
  price: "Preço",
  weight: "Peso",
  reduction: "Redução",
  hooks: "Ganchos",
  interface: "Interface",
  electronics: "Eletrônica",
  cosmicSpellSlots: "Espaços de magia cósmica",
  cost: "Custo em Cosmos",
  duration: "Duração",
  rank: "Tier do chip",
  installation: "Local de instalação",
  slots: "Espaços de mod ocupados",
  activation: "Tipo de ativação",
  materials: "Materiais sugeridos",
  risk: "Risco",
  focus: "Foco",
  talent: "Talento",
  kit: "Kit",
  penalty: "Penalidade",
  bonus: "Bônus",
  choice: "Escolha racial",
  progression: "Progressão",
  profile: "Perfil racial",
  passiveEffects: "Efeitos passivos",
  officialData: "Ficha técnica oficial",
  fields: "Campos oficiais",
  details: "Texto detalhado do livro",
  contentBlocks: "Conteúdo integral do livro",
  bookExcerpts: "Regras oficiais aplicáveis",
  bookLabel: "Livro",
  bookTitle: "Título do livro",
  number: "Seção",
  breadcrumb: "Localização no livro",
  tags: "Tags",
  inventoryState: "Estado na ficha",
  training: "Treinamento",
  modifier: "Modificador atual",
  formula: "Fórmula do teste",
  relatedSkills: "Perícias relacionadas",
  currentValue: "Valor atual",
  baseValue: "Valor base",
  totalValue: "Valor total",
  targetName: "Equipamento vinculado",
  attr: "Atributo associado",
};

const universalDetailHiddenFields = new Set([
  "id",
  "name",
  "title",
  "bookId",
  "level",
  "schemaVersion",
  "category",
  "notes",
  "documentNotes",
  "metadata",
  "sourceReference",
  "sourceRow",
  "imageDataUrl",
  "imageName",
  "official",
  "officialSourceId",
  "libraryOriginId",
  "libraryCustom",
  "domainEntityType",
  "deleteId",
  "deleteType",
  "exportId",
  "exportType",
  "exportedToLibrary",
  "knownAbility",
  "professionRemovable",
  "custom",
  "manualType",
  "snapshot",
  "priceEditable",
  "createdAt",
  "updatedAt",
]);

const universalDetailFieldOrder = [
  "usageGuide",
  "summary",
  "effect",
  "context",
  "contentBlocks",
  "bookExcerpts",
  "details",
  "tier",
  "rank",
  "type",
  "kind",
  "role",
  "size",
  "pv",
  "ca",
  "movement",
  "attributes",
  "attack",
  "damage",
  "range",
  "ammo",
  "capacity",
  "handling",
  "habitat",
  "behavior",
  "attacks",
  "abilities",
  "resistances",
  "weaknesses",
  "senses",
  "moral",
  "resources",
  "campaign",
  "cost",
  "duration",
  "activation",
  "installation",
  "slots",
  "mods",
  "cracks",
  "jammed",
  "failure",
  "reduction",
  "hooks",
  "interface",
  "electronics",
  "cosmicSpellSlots",
  "materials",
  "risk",
  "weight",
  "legality",
  "price",
  "focus",
  "talent",
  "kit",
  "penalty",
  "bonus",
  "choice",
  "profile",
  "progression",
  "training",
  "modifier",
  "formula",
  "relatedSkills",
  "currentValue",
  "baseValue",
  "totalValue",
  "passiveEffects",
  "officialData",
  "fields",
  "inventoryState",
  "tags",
];

let universalDetailReturnFocus = null;
let testRollClickTimer = null;
let raceCardClickTimer = null;

function handleUniversalDetailDoubleClick(event) {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-cube-drop-uid]") && !event.target.closest("[data-card-details-toggle]")) return;

  const interactive = event.target.closest("button, input, select, textarea, label, a");
  if (interactive && !interactive.matches("[data-detail-kind], [data-card-details-toggle]")) return;

  const target = event.target.closest("[data-detail-kind]");
  if (!target) return;
  const payload = resolveUniversalDetail(target.dataset);
  if (!payload) return;

  event.preventDefault();
  window.clearTimeout(testRollClickTimer);
  testRollClickTimer = null;
  window.clearTimeout(raceCardClickTimer);
  raceCardClickTimer = null;
  closeCardDetails();
  openUniversalDetail(payload);
}

function resolveUniversalDetail(dataset) {
  const kind = dataset.detailKind;
  const id = dataset.detailId || "";
  const name = dataset.detailName || "";
  const source = dataset.detailSource || "";

  if (kind === "attribute") {
    const detail = attributeDetailData[id];
    if (!detail) return null;
    const totals = totalAttributes();
    return {
      kicker: "Atributo",
      title: `${id} - ${detail.name}`,
      record: {
        name: detail.name,
        summary: detail.summary,
        baseValue: numberValue(state.current.attributes?.[id], ATTRIBUTE_BASE),
        totalValue: totals[id],
        modifier: formatMod(attributeModifier(totals[id])),
        formula: "3d6 + modificador do atributo + bônus situacional",
        relatedSkills: skillData.filter((skill) => skill.attr === id).map((skill) => skill.name),
        bookExcerpts: findRulebookReferences(detail.name, ["book1"]),
        source: "Livro 1 - atributos e testes",
      },
    };
  }

  if (kind === "skill") {
    const skill = skillData.find((entry) => entry.name === id);
    if (!skill) return null;
    const training = state.current.skillTraining?.[skill.name] || "normal";
    return {
      kicker: "Perícia",
      title: skill.name,
      record: {
        ...skill,
        training: training === "trained" ? "Perito: vantagem no teste" : training === "ignorant" ? "Ignorante: desvantagem no teste" : "Sem especialização",
        modifier: formatMod(skillModifier(skill)),
        formula: `3d6 + MOD ${skill.attr} + bônus situacional`,
        bookExcerpts: findRulebookReferences(skill.name, ["book1"]),
        source: "Livro 1 - perícias",
      },
    };
  }

  if (kind === "protection") {
    const protection = protectionData.find((entry) => entry.name === id);
    if (!protection) return null;
    const attrs = protection.attrs || [protection.attr];
    return {
      kicker: "Jogada de Proteção",
      title: protection.name,
      record: {
        ...protection,
        type: attrs.join(" ou "),
        formula: `3d6 + ${attrs.map((attr) => `MOD ${attr}`).join(" ou ")} + bônus situacional`,
        bookExcerpts: findRulebookReferences(protection.name, ["book1", "book2"]),
        source: "Livro 1 - Jogadas de Proteção",
      },
    };
  }

  if (kind === "library") {
    const view = dataset.detailView || state.activeLibrary;
    const item = getLibraryItemsForView(view).find((entry) => entry.id === id);
    if (!item) return null;
    return {
      kicker: libraryMap[view]?.title || "Biblioteca",
      title: item.name,
      record: enrichDetailRecordWithRulebooks(item, view),
    };
  }

  if (kind === "inventory") {
    const item = findMarketItem(id);
    if (!item) return null;
    const inventoryEntry = (state.current.inventory || []).find((entry) => entry.uid === dataset.detailUid);
    return {
      kicker: "Inventário do personagem",
      title: item.name,
      record: enrichDetailRecordWithRulebooks({
        ...item,
        inventoryState: inventoryEntry ? {
          localização: inventoryLocationLabel(inventoryEntry),
          equipado: isInventoryEquipped(inventoryEntry),
          rachaduras: itemCrackLevel(inventoryEntry),
          suporte: inventoryEntry.supportSlot ? externalSupportTypeLabel(inventoryEntry.supportSlot) : "",
          cubo: inventoryEntry.cubeUid || inventoryEntry.inCube ? "Armazenado em cubo" : "",
        } : {},
      }, libraryViewForItem(item)),
    };
  }

  if (kind === "ability") {
    const entry = collectAbilityEntries().find((ability) => (
      (id && (ability.id === id || ability.deleteId === id))
      || (ability.name === name && (!source || ability.source === source))
    ));
    if (!entry) return null;
    const linkedRecord = resolveLinkedAbilityRecord(entry);
    const linkedView = entry.source === "Arma"
      ? "armas"
      : entry.source === "Armadura"
        ? "armaduras"
        : entry.source === "Cosmos"
          ? "magias"
          : entry.source === "Chip modificador"
            ? "chipsMod"
            : entry.source === "Raça"
              ? "racas"
              : entry.source === "Chip de profissão"
                ? "profissoes"
                : "";
    return {
      kicker: entry.source || "Habilidade",
      title: entry.name,
      record: enrichDetailRecordWithRulebooks(
        linkedRecord ? { ...linkedRecord, effect: entry.effect || linkedRecord.effect || linkedRecord.summary } : entry,
        linkedView
      ),
    };
  }

  if (kind === "installed-mod") {
    const mod = (state.current.installedMods || []).find((entry) => entry.id === id)
      || (state.current.installedMods || []).find((entry) => entry.name === name);
    if (!mod) return null;
    const libraryMod = [...equipmentModData, ...customLibraryItems("mods")].find((entry) => entry.name === mod.name);
    return {
      kicker: "Mod instalado",
      title: mod.name || "Mod sem nome",
      record: enrichDetailRecordWithRulebooks({ ...(libraryMod || {}), ...mod }, "mods"),
    };
  }

  return null;
}

function resolveLinkedAbilityRecord(entry) {
  if (entry.source === "Arma") return [...weaponData, ...customLibraryItems("armas")].find((item) => item.name === entry.name);
  if (entry.source === "Armadura") return [...armorData, ...customLibraryItems("armaduras")].find((item) => item.name === entry.name);
  if (entry.source === "Cosmos") return findAbilityLibraryItem(entry.id) || cosmicSpellData.find((item) => item.name === entry.name);
  if (entry.source === "Chip modificador") return findAbilityLibraryItem(entry.id) || modifierChipData.find((item) => item.name === entry.name);
  if (entry.source === "Raça") return findRace(state.current.race);
  if (entry.source === "Chip de profissão") return findProfession(state.current.profession);
  return null;
}

const rulebookReferenceCache = new Map();
const preferredRulebooksByView = {
  racas: ["book1"],
  profissoes: ["book1", "book5"],
  magias: ["book1", "book5"],
  chipsMod: ["book5", "book1"],
  mods: ["book5"],
  armas: ["book5"],
  armaduras: ["book5"],
  itens: ["book5"],
  armazenamento: ["book5"],
  monstros: ["book3"],
  regras: ["book1", "book2", "book3", "book4", "book5"],
};

const weaponRuleSectionMatchers = [
  [/pistola/, "1.4.3"],
  [/revolver/, "1.4.4"],
  [/escopeta/, "1.4.5"],
  [/carabina/, "1.4.6"],
  [/rifle de precisao|sniper/, "1.4.7"],
  [/submetralhadora/, "1.4.8"],
  [/fuzil/, "1.4.9"],
  [/metralhadora/, "1.4.10"],
  [/lancador/, "1.4.11"],
  [/arremesso/, "1.4.12"],
  [/adaga|faca/, "1.4.13"],
  [/espada/, "1.4.14"],
  [/sabre|katana/, "1.4.15"],
  [/machado|foice/, "1.4.16"],
  [/martelo|maca/, "1.4.17"],
  [/lanca|alabarda|tridente/, "1.4.18"],
  [/manopla|punho|briga/, "1.4.19"],
  [/improvisad/, "1.4.20"],
  [/cosmic/, "1.4.21"],
];

function findRulebookReferences(term, preferredBooks = [], limit = 4) {
  const normalizedTerm = normalizeSearch(term).trim();
  if (normalizedTerm.length < 3) return [];
  const cacheKey = `${preferredBooks.join(",")}|${normalizedTerm}|${limit}`;
  if (rulebookReferenceCache.has(cacheKey)) return rulebookReferenceCache.get(cacheKey);

  const preferred = new Set(preferredBooks);
  const references = RULEBOOK_SECTIONS
    .map((section) => {
      const title = normalizeSearch(section.title || section.name);
      let score = Number.POSITIVE_INFINITY;
      if (title === normalizedTerm) score = 0;
      else if (title.startsWith(`${normalizedTerm} `) || title.endsWith(` ${normalizedTerm}`)) score = 1;
      else if (title.includes(normalizedTerm)) score = 2;
      else if (normalizedTerm.includes(title) && title.length >= 5) score = 3;
      if (!Number.isFinite(score)) return null;
      if (preferred.size && !preferred.has(section.bookId)) score += 10;
      return { section, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || Number(a.section.level || 9) - Number(b.section.level || 9))
    .slice(0, limit)
    .map(({ section }) => ({
      bookLabel: section.bookLabel,
      title: section.title,
      number: section.number,
      source: section.source,
      contentBlocks: section.contentBlocks,
    }));

  rulebookReferenceCache.set(cacheKey, references);
  return references;
}

function rulebookReferenceByNumber(bookId, number) {
  const section = RULEBOOK_SECTIONS.find((entry) => entry.bookId === bookId && entry.number === number);
  if (!section) return null;
  return {
    bookLabel: section.bookLabel,
    title: section.title,
    number: section.number,
    source: section.source,
    contentBlocks: section.contentBlocks,
  };
}

function exactRulebookReferences(terms, preferredBooks = [], limit = 3) {
  const normalizedTerms = new Set(
    terms.map((term) => normalizeSearch(term).trim()).filter((term) => term.length >= 3)
  );
  if (!normalizedTerms.size) return [];
  const preferred = new Set(preferredBooks);
  return RULEBOOK_SECTIONS
    .filter((section) => normalizedTerms.has(normalizeSearch(section.title || section.name).trim()))
    .sort((a, b) => (
      Number(preferred.has(b.bookId)) - Number(preferred.has(a.bookId))
      || Number(a.level || 9) - Number(b.level || 9)
    ))
    .slice(0, limit)
    .map((section) => ({
      bookLabel: section.bookLabel,
      title: section.title,
      number: section.number,
      source: section.source,
      contentBlocks: section.contentBlocks,
    }));
}

function detailRulebookReferences(record, view) {
  if (!record || view === "chipsMod") return [];
  const references = exactRulebookReferences(
    [record.name, record.title],
    preferredRulebooksByView[view] || [],
    2
  );
  if (view === "armas") {
    const weaponText = normalizeSearch([record.type, record.name, ...(record.tags || [])].filter(Boolean).join(" "));
    const match = weaponRuleSectionMatchers.find(([pattern]) => pattern.test(weaponText));
    const categoryReference = match ? rulebookReferenceByNumber("book5", match[1]) : null;
    const operationReference = rulebookReferenceByNumber("book5", "1.4.2");
    if (categoryReference) references.push(categoryReference);
    if (operationReference) references.push(operationReference);
  } else if (view === "armaduras") {
    references.push(
      rulebookReferenceByNumber("book5", "3.7.2"),
      rulebookReferenceByNumber("book5", "3.7.5")
    );
  } else if (view === "mods") {
    references.push(rulebookReferenceByNumber("book5", "2.26"));
  } else if (view === "armazenamento") {
    const text = normalizeSearch([record.name, record.type, ...(record.tags || [])].filter(Boolean).join(" "));
    if (/cubo/.test(text)) references.push(rulebookReferenceByNumber("book5", "4.2"));
    if (/mochila|bolsa|suporte de cubos/.test(text)) references.push(rulebookReferenceByNumber("book5", "4.4"));
    if (/gancho|coldre|bandoleira|acesso rapido/.test(text)) references.push(rulebookReferenceByNumber("book5", "4.5"));
  }
  const seen = new Set();
  return references
    .filter(Boolean)
    .filter((reference) => {
      const key = `${reference.bookLabel}|${reference.number}|${reference.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);
}

function sanitizeOfficialDetailData(value) {
  if (Array.isArray(value)) return value.map(sanitizeOfficialDetailData);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => key !== "#" && detailValueIsPresent(item))
      .map(([key, item]) => [key, sanitizeOfficialDetailData(item)])
  );
}

function compactGuide(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => detailValueIsPresent(value))
  );
}

function standardizedDetailSummary(record) {
  const official = record.officialData || {};
  if (record.category === "weapon" || record.category === "armor") {
    return official["Observações"] || official["Observação"] || record.summary;
  }
  if (record.category === "chip-mod") {
    return official["Efeito mecânico revisado"] || official["Efeito"] || record.summary;
  }
  if (["item", "storage", "cube", "mod"].includes(record.category)) {
    return official["Função/Efeito"] || official["Efeito mecânico revisado"] || official["Efeito"] || record.summary;
  }
  return record.summary;
}

function detailTransportGuide(record, { equipped = false } = {}) {
  const weight = record.weight ? `Peso informado: ${record.weight}. ` : "";
  return `${weight}${equipped
    ? "Enquanto estiver equipado, não entra na carga carregada. Fora do equipamento e fora de um cubo, seu peso entra normalmente."
    : "Fora de um cubo, seu peso entra na carga carregada, inclusive em mochila, coldre, bandoleira ou gancho."}`;
}

function buildUsageGuide(record, view) {
  if (!record || view === "regras" || record.category === "rulebook-section") return {};
  if (view === "armas" || record.category === "weapon") {
    return compactGuide({
      "Função": [record.type || "Arma", record.tier ? `Tier ${record.tier}` : ""].filter(Boolean).join(" - "),
      "Teste de ataque": record.attack ? `Role usando ${record.attack}. Aplique vantagens, desvantagens e bônus situacionais indicados pela categoria ou pela arma.` : "",
      "Em caso de acerto": record.damage ? `Cause ${record.damage}.` : "",
      "Alcance e operação": [record.range && `Alcance: ${record.range}`, record.handling && `Empunhadura: ${record.handling}`].filter(Boolean).join(". "),
      "Munição e cadência": [record.ammo && `Munição: ${record.ammo}`, record.capacity && `Capacidade/Cadência: ${record.capacity}`].filter(Boolean).join(". "),
      "Mods e integridade": [detailValueIsPresent(record.mods) && `${record.mods} espaço(s) de mod`, record.cracks && `rachaduras ${record.cracks}`, record.jammed && `falha: ${record.jammed}`].filter(Boolean).join(". "),
      "Limites próprios": record.summary,
      "Transporte": detailTransportGuide(record, { equipped: true }),
    });
  }
  if (view === "armaduras" || record.category === "armor") {
    return compactGuide({
      "Função": [record.type || "Armadura", record.kind, record.tier ? `Tier ${record.tier}` : ""].filter(Boolean).join(" - "),
      "Proteção": [detailValueIsPresent(record.ca) && `CA ${record.ca}`, record.reduction && `redução ${record.reduction}`, record.movement && `movimento ${record.movement}`].filter(Boolean).join(". "),
      "Suportes e interface": [detailValueIsPresent(record.hooks) && `${record.hooks} gancho(s)`, record.interface && `interface ${record.interface}`, record.electronics && `eletrônica ${record.electronics}`].filter(Boolean).join(". "),
      "Mods e integridade": [detailValueIsPresent(record.mods) && `${record.mods} espaço(s) de mod`, record.cracks && `rachaduras ${record.cracks}`, record.failure && `falha: ${record.failure}`].filter(Boolean).join(". "),
      "Limites próprios": record.summary,
      "Transporte": detailTransportGuide(record, { equipped: true }),
    });
  }
  if (view === "chipsMod" || record.category === "chip-mod") {
    return compactGuide({
      "Tipo": `Chip modificador${record.tier || record.rank ? ` Tier ${record.tier || record.rank}` : ""}${record.type ? ` - ${record.type}` : ""}`,
      "Instalação": record.installation,
      "Ativação": record.activation,
      "Efeito": record.summary || record.effect,
      "Espaços": detailValueIsPresent(record.slots) ? `Ocupa ${record.slots} espaço(s) de mod.` : "",
      "Limite": record.failure,
      "Materiais": record.materials,
    });
  }
  if (view === "mods" || record.category === "mod") {
    return compactGuide({
      "Tipo": [record.type || "Mod", record.tier ? `Tier ${record.tier}` : ""].filter(Boolean).join(" - "),
      "Instalação": record.installation,
      "Ativação": record.activation,
      "Efeito": record.summary || record.effect,
      "Espaços": detailValueIsPresent(record.slots) ? `Ocupa ${record.slots} espaço(s).` : "",
      "Limite": record.failure || record.risk,
      "Materiais": record.materials,
    });
  }
  if (view === "magias" || ["cosmos", "cosmic-spell"].includes(record.category)) {
    return compactGuide({
      "Conjuração": detailValueIsPresent(record.cost) ? `Gaste ${record.cost} ponto(s) de Cosmos para usar a habilidade.` : "",
      "Efeito": record.summary || record.effect,
      "Duração": record.duration,
      "Aquisição": "A magia precisa ocupar um espaço disponível, obtido por treino, grimório, equipamento ou chip compatível.",
    });
  }
  if (view === "armazenamento" || ["cube", "storage"].includes(record.category) || isStorageMarketItem(record)) {
    const isCube = record.category === "cube" || normalizeSearch(record.name).includes("cubo");
    return compactGuide({
      "Finalidade": record.summary || "Armazenar e transportar itens.",
      "Capacidade": [record.cubeCapacity && `${record.cubeCapacity} unidade(s)`, record.cubeSupport && `suporta ${record.cubeSupport} cubo(s)`].filter(Boolean).join(". "),
      "Organização": isCube
        ? "Itens colocados dentro do cubo deixam de contar individualmente para a carga; o próprio cubo pesa 1 kg."
        : "Itens guardados neste suporte continuam contando para a carga carregada.",
      "Transporte": detailTransportGuide(record),
    });
  }
  if (view === "itens" || record.category === "item") {
    return compactGuide({
      "Finalidade": record.summary || record.effect,
      "Como usar": record.consumable
        ? "Item consumível: ao registrar o uso, uma unidade é removida do inventário."
        : "Item reutilizável, salvo quando a descrição oficial indicar perda, quebra ou consumo.",
      "Transporte": detailTransportGuide(record),
    });
  }
  if (view === "monstros") {
    return compactGuide({
      "Papel em cena": [record.type, record.role, record.tier ? `Tier ${record.tier}` : ""].filter(Boolean).join(" - "),
      "Combate": [detailValueIsPresent(record.pv) && `PV ${record.pv}`, detailValueIsPresent(record.ca) && `CA ${record.ca}`, record.movement && `Movimento ${record.movement}`].filter(Boolean).join(". "),
      "Uso pelo mestre": record.behavior || record.summary || record.campaign,
    });
  }
  return compactGuide({
    "Finalidade": record.summary || record.effect || record.context,
    "Aplicação": record.activation || record.duration || record.formula,
  });
}

function enrichDetailRecordWithRulebooks(record, view) {
  if (!record) return record;
  const sanitized = { ...record };
  ["notes", "documentNotes", "metadata", "sourceReference", "sourceRow"].forEach((key) => delete sanitized[key]);
  if (sanitized.officialData) sanitized.officialData = sanitizeOfficialDetailData(sanitized.officialData);
  sanitized.summary = standardizedDetailSummary(sanitized);
  const usageGuide = buildUsageGuide(sanitized, view);
  if (Object.keys(usageGuide).length) sanitized.usageGuide = usageGuide;
  if (sanitized.contentBlocks?.length) return sanitized;
  if (view === "chipsMod") {
    delete sanitized.bookExcerpts;
    delete sanitized.passiveEffects;
    return sanitized;
  }
  const references = sanitized.bookExcerpts?.length
    ? sanitized.bookExcerpts
    : detailRulebookReferences(sanitized, view);
  if (references.length) sanitized.bookExcerpts = references;
  else delete sanitized.bookExcerpts;
  return sanitized;
}

function libraryViewForItem(item) {
  const category = item?.category || "";
  if (category === "weapon") return "armas";
  if (category === "armor") return "armaduras";
  if (category === "chip-mod") return "chipsMod";
  if (category === "mod") return "mods";
  if (category === "cube" || category === "storage") return "armazenamento";
  return "itens";
}

function openUniversalDetail({ kicker, title, record }) {
  universalDetailReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  el.universalDetailKicker.textContent = kicker || "Informações completas";
  el.universalDetailTitle.textContent = title || record?.name || "Detalhes";
  el.universalDetailContent.innerHTML = renderUniversalDetailContent(record || {});
  el.universalDetailModal.hidden = false;
  document.body.classList.add("modal-open");
  el.closeUniversalDetail.focus();
}

function closeUniversalDetail() {
  el.universalDetailModal.hidden = true;
  el.universalDetailContent.innerHTML = "";
  syncModalOpenState();
  universalDetailReturnFocus?.focus?.();
  universalDetailReturnFocus = null;
}

function renderUniversalDetailContent(record) {
  const source = record.source ? `<span>${escapeHtml(record.source)}</span>` : "";
  const tags = Array.isArray(record.tags) && record.tags.length
    ? `<div class="universal-detail-tags">${record.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
    : "";
  const image = record.imageDataUrl
    ? `<figure class="universal-detail-image"><img src="${escapeHtml(record.imageDataUrl)}" alt="${escapeHtml(record.imageName || record.name || "Imagem do registro")}" /></figure>`
    : "";
  const keys = [...universalDetailFieldOrder, ...Object.keys(record)]
    .filter((key, index, all) => all.indexOf(key) === index)
    .filter((key) => !universalDetailHiddenFields.has(key) && key !== "source" && key !== "tags" && detailValueIsPresent(record[key]))
    .filter((key) => !(key === "category" && record[key] === "rulebook-section"));
  return `
    ${source || tags ? `<div class="universal-detail-meta">${source}${tags}</div>` : ""}
    ${image}
    <dl class="universal-detail-fields">
      ${keys.map((key) => renderUniversalDetailField(key, record[key])).join("")}
    </dl>
  `;
}

function renderUniversalDetailField(key, value) {
  const wide = typeof value === "object" || String(value).length > 90;
  return `
    <div class="universal-detail-field ${wide ? "wide" : ""}">
      <dt>${escapeHtml(universalDetailFieldLabel(key))}</dt>
      <dd>${renderUniversalDetailValue(value, key)}</dd>
    </div>
  `;
}

function renderUniversalDetailValue(value, key = "") {
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (Array.isArray(value)) {
    if (key === "contentBlocks") return renderRulebookBlocks(value);
    if (key === "bookExcerpts") {
      return value.map((reference) => `
        <section class="universal-detail-book-section">
          <header>
            <h3>${escapeHtml([reference.bookLabel, reference.number, reference.title].filter(Boolean).join(" · "))}</h3>
            ${reference.source ? `<small>${escapeHtml(reference.source)}</small>` : ""}
          </header>
          ${renderRulebookBlocks(reference.contentBlocks || [])}
        </section>
      `).join("");
    }
    if (key === "details") {
      return value.map((group) => `
        <section class="universal-detail-book-section">
          ${group?.label ? `<h3>${escapeHtml(group.label)}</h3>` : ""}
          ${Array.isArray(group?.blocks)
            ? renderRulebookBlocks(group.blocks)
            : `<ul>${(group?.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`}
        </section>
      `).join("");
    }
    if (value.every((item) => typeof item !== "object")) {
      return `<ul>${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    return value.map((item) => `<div class="universal-detail-object">${renderUniversalDetailValue(item)}</div>`).join("");
  }
  if (value && typeof value === "object") {
    return `
      <dl class="universal-detail-subfields">
        ${Object.entries(value)
          .filter(([, item]) => detailValueIsPresent(item))
          .map(([subKey, item]) => `
            <div>
              <dt>${escapeHtml(universalDetailFieldLabel(subKey))}</dt>
              <dd>${renderUniversalDetailValue(item, subKey)}</dd>
            </div>
          `).join("")}
      </dl>
    `;
  }
  if (key === "price" && Number.isFinite(Number(value))) return escapeHtml(formatCurrency(Number(value)));
  return `<span class="universal-detail-text">${escapeHtml(value)}</span>`;
}

function renderRulebookBlocks(blocks) {
  let html = "";
  let listItems = [];
  const flushList = () => {
    if (!listItems.length) return;
    html += `<ul class="rulebook-detail-list">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    listItems = [];
  };

  (blocks || []).forEach((block) => {
    if (!block) return;
    if (block.type === "list") {
      listItems.push(block.text || "");
      return;
    }
    flushList();
    if (block.type === "table") {
      const headers = Array.isArray(block.headers) ? block.headers : [];
      const rows = Array.isArray(block.rows) ? block.rows : [];
      html += `
        <div class="rulebook-detail-table-wrap">
          <table class="rulebook-detail-table">
            ${headers.some(Boolean) ? `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>` : ""}
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
      return;
    }
    const tag = block.type === "quote" ? "blockquote" : block.type === "note" ? "aside" : "p";
    html += `<${tag} class="rulebook-detail-${escapeHtml(block.type || "paragraph")}">${escapeHtml(block.text || "")}</${tag}>`;
  });
  flushList();
  return `<div class="rulebook-detail-blocks">${html}</div>`;
}

function universalDetailFieldLabel(key) {
  if (universalDetailFieldLabels[key]) return universalDetailFieldLabels[key];
  const label = String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : "Informação";
}

function detailValueIsPresent(value) {
  if (value === 0 || value === false) return true;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function renderInventoryCards(entries, options = {}) {
  if (!entries.length) return '<div class="empty-state">Nenhum item nesta lista.</div>';
  return `
    <div class="inventory-grid">
      ${entries.map((entry) => {
        const item = findMarketItem(entry.itemId);
        if (!item) return "";
        const definition = domainDefinitionForItem(item);
        const entityType = entry.domainEntityType || definition.entityType;
        const storageEntity = isStorageMarketItem(item);
        const equipped = isInventoryEquipped(entry);
        const cubeLabel = entry.cubeUid || entry.inCube ? "Tirar do cubo" : "Guardar no cubo";
        const cubeAction = entry.cubeUid ? "cube-remove" : "cube";
        const equipAction = equipped ? "unequip" : "equip";
        const equipLabel = equipped ? "Desequipar" : "Equipar";
        const salePrice = Number.isFinite(item.price) ? Math.floor(item.price / 2) : 0;
        const draggableAttrs = options.draggable && (canStoreEntryInPhysicalCube(entry) || canAttachToExternalSupport(entry))
          ? ` draggable="true" data-drag-inventory-uid="${escapeHtml(entry.uid)}"`
          : "";
        const storageDropAttrs = storageEntity
          ? ` data-storage-drop-uid="${escapeHtml(entry.uid)}"`
          : "";
        const supportState = options.supportState || externalSupportState();
        const supportTarget = options.showSupportAction && !entry.supportSlot ? findAvailableExternalSupport(entry, supportState) : null;
        const canAttachSupport = options.showSupportAction && canAttachToExternalSupport(entry);
        const supportLabel = entry.supportSlot ? `Suporte: ${externalSupportTypeLabel(entry.supportSlot)}` : "";
        const providerCounts = supportProviderCounts(entry);
        const providerLabel = EXTERNAL_SUPPORT_TYPES
          .filter((type) => providerCounts[type.id] > 0)
          .map((type) => `${type.singular} +${providerCounts[type.id]}`)
          .join(", ");
        const locationLabel = inventoryLocationLabel(entry);
        const cardMeta = [compactMarketMeta(item), locationLabel, supportLabel, providerLabel ? `Fornece: ${providerLabel}` : ""].filter(Boolean).join(" - ");
        const tracksCracks = ["item", "weapon", "armor", "cube"].includes(item.category);
        const crackLevel = itemCrackLevel(entry);
        const chipInstalled = entityType === ENTITY_TYPES.CHIP_MOD && entry.location?.slotId === "chip";
        const consumable = isConsumableItem(item);
        return `
          <article class="inventory-card compact-card ${item.imageDataUrl ? "with-image" : ""}" tabindex="0" data-detail-kind="inventory" data-detail-id="${escapeHtml(item.id)}" data-detail-uid="${escapeHtml(entry.uid)}"${draggableAttrs}${storageDropAttrs}>
            ${renderCardImage(item)}
            <div class="card-face">
              <span class="ability-source">${escapeHtml(domainEntityTypeLabel(entityType))}${consumable ? ' · <span class="inventory-consumable-tag">Consumível</span>' : ""}</span>
              <h4>${renderCardTitleButton(item.name)}</h4>
              <p class="card-meta-line">${escapeHtml(cardMeta)}</p>
            </div>
            <div class="inventory-actions">
              ${storageEntity ? `<button class="mini-button" type="button" data-inventory-action="open-storage" data-uid="${entry.uid}">Abrir</button>` : ""}
              ${entityType === ENTITY_TYPES.ITEM && !storageEntity ? `<button class="mini-button" type="button" data-inventory-action="use" data-uid="${entry.uid}">Usar</button>` : ""}
              ${entityType === ENTITY_TYPES.CHIP_MOD ? `<button class="mini-button" type="button" data-inventory-action="${chipInstalled ? "uninstall" : "install"}" data-uid="${entry.uid}">${chipInstalled ? "Remover chip" : "Instalar"}</button>` : ""}
              ${entityType === ENTITY_TYPES.COSMIC_SPELL ? `<button class="mini-button" type="button" data-inventory-action="cast" data-uid="${entry.uid}">Conjurar</button>` : ""}
              ${options.showEquipAction && ["weapon", "armor"].includes(item.category) ? `<button class="mini-button" type="button" data-inventory-action="${equipAction}" data-uid="${entry.uid}">${equipLabel}</button>` : ""}
              ${options.showCubeAction && item.category === "item" && (entry.cubeUid || entry.inCube) ? `<button class="mini-button" type="button" data-inventory-action="${cubeAction}" data-uid="${entry.uid}">${cubeLabel}</button>` : ""}
              ${entry.supportSlot ? `<button class="mini-button" type="button" data-inventory-action="support-remove" data-uid="${entry.uid}">Soltar suporte</button>` : ""}
              ${canAttachSupport && !entry.supportSlot ? `<button class="mini-button" type="button" data-inventory-action="support-attach" data-uid="${entry.uid}" ${supportTarget ? "" : "disabled"}>${supportTarget ? `Prender em ${supportTarget.singular}` : "Sem suporte"}</button>` : ""}
              <button class="mini-button" type="button" data-inventory-action="move" data-uid="${entry.uid}">Mover</button>
              <button class="mini-button danger-mini-button" type="button" data-inventory-action="sell" data-uid="${entry.uid}">Vender</button>
              <button class="mini-button danger-mini-button" type="button" data-inventory-action="delete" data-uid="${entry.uid}">Excluir</button>
            </div>
            <div class="card-hover-popover" role="tooltip">
              <strong>${escapeHtml(item.name)}</strong>
              <p>${escapeHtml(marketMeta(item))}</p>
              <p>${escapeHtml(item.summary || "Sem descrição.")}</p>
              ${supportLabel || providerLabel ? `<p>${escapeHtml([supportLabel, providerLabel ? `Fornece: ${providerLabel}` : ""].filter(Boolean).join(" - "))}</p>` : ""}
              ${(item.tags || []).length ? `<div class="tag-row">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
              ${tracksCracks ? `
                <label class="sell-field">
                  Rachaduras
                  <input type="number" min="0" max="${ITEM_CRACK_MAX}" step="1" value="${crackLevel}" data-item-crack="${escapeHtml(entry.uid)}" />
                </label>
                ${crackLevel >= ITEM_CRACK_MAX ? '<p><strong>Item colapsado.</strong></p>' : ""}
              ` : ""}
              <label class="sell-field">
                Valor sugerido de venda
                <input type="number" min="0" step="1" value="${salePrice}" data-sell-value />
              </label>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function buyMarketItem(itemId, trigger = null) {
  readForm();
  let item = findMarketItem(itemId);
  if (!item) return;
  if (item.priceEditable) {
    const priceInput = trigger?.closest(".library-card")?.querySelector("[data-shop-price-input]");
    if (!priceInput || priceInput.value === "") {
      showToast("Defina o preço deste item antes de comprar.", "tech-error");
      priceInput?.focus();
      return;
    }
    const customPrice = Math.max(0, numberValue(priceInput.value, 0));
    state.shopPriceOverrides[itemId] = customPrice;
    persistShopPriceOverrides();
    item = { ...item, price: customPrice };
  }
  if (!Number.isFinite(item.price)) {
    showToast("Este item não tem preço definido.");
    return;
  }
  if (item.category === "cube" && !canAddPhysicalCube()) return;
  try {
    const domain = domainCharacterFromLegacy();
    const entity = domain.buyEntity(domainDefinitionForItem(item), {
      location: { kind: LOCATION_KINDS.UNASSIGNED },
    });
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderForm();
    showToast(item.price === 0
      ? `${item.name} adicionado ao inventário.`
      : `${item.name} comprado por ${formatCurrency(item.price)}.`);
    openInventoryLocationDialog(entity.id, "purchase");
  } catch (error) {
    showToast(error.message || "Não foi possível concluir a compra.", "tech-error");
  }
}

function learnLibraryAbility(itemId) {
  const item = findAbilityLibraryItem(itemId);
  if (!item) return;
  const source = item.category === "cosmos" ? "Cosmos" : "Chip modificador";
  state.current.knownAbilities = state.current.knownAbilities || [];
  if (state.current.knownAbilities.some((ability) => ability.id === item.id)) {
    showToast("Essa habilidade já está na ficha.");
    return;
  }
  if (source === "Cosmos" && !canAddCosmicSpell()) {
    const slots = cosmicSpellSlotState();
    showToast(`Sem espaços de magia cósmica: ${slots.used}/${slots.total}.`, "cosmic-error");
    return;
  }
  if (source === "Chip modificador" && !canAddModifierChip(item.slots)) {
    const slots = modifierSlotState();
    showToast(`Sem espaço de mods para chip: ${slots.used}/${slots.total}.`, "tech-error");
    return;
  }
  state.current.knownAbilities.unshift({
    id: item.id,
    name: item.name,
    source,
    effect: item.summary,
    meta: libraryMeta(item),
    passiveEffects: source === "Chip modificador" ? normalizePassiveEffects(item.passiveEffects || inferModifierChipPassiveEffects(item)) : [],
    modifierSlots: source === "Chip modificador" ? Math.max(1, numberValue(item.slots, 1)) : 0,
    installed: source === "Chip modificador",
    custom: false,
  });
  const domain = domainCharacterFromLegacy();
  if (source === "Cosmos") domain.learnSpell(domainDefinitionForItem(item));
  domain.metadata.legacyKnownAbilities = structuredCloneSafe(state.current.knownAbilities);
  syncDomainCharacterToLegacy(domain);
  persistCurrentCharacterSilently();
  renderSummary();
  showToast(`${item.name} adicionado às habilidades.`);
}

function unequipModifierChip(abilityId) {
  const ability = (state.current.knownAbilities || []).find((entry) => entry.id === abilityId);
  if (!ability) return;
  if (!canUseCosmicSpellSlotLayout({ excludedAbilityId: abilityId })) return;
  state.current.knownAbilities = (state.current.knownAbilities || []).filter((entry) => entry.id !== abilityId);
  const domain = domainCharacterFromLegacy();
  domain.metadata.legacyKnownAbilities = structuredCloneSafe(state.current.knownAbilities);
  syncDomainCharacterToLegacy(domain);
  persistCurrentCharacterSilently();
  renderSummary();
  showToast(`${ability.name} desequipado da ficha.`);
}

function rollDice() {
  readForm();
  if (!ensureDiceRollAllowed()) return;
  const count = clamp(numberValue(document.querySelector("#diceCount").value, 1), 1, 20);
  const sides = clamp(numberValue(document.querySelector("#diceSides").value, 6), 2, 100);
  const bonus = numberValue(document.querySelector("#diceBonus").value, 0);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + bonus;
  const formula = `${count}d${sides}${bonus ? formatMod(bonus) : ""}`;
  pushDiceLog({ count, sides, bonus, rolls, total, formula, label: "Rolagem livre" });
  showToast(`${formula}: ${total}`);
}

function rollInitiative() {
  readForm();
  if (!ensureDiceRollAllowed()) return;
  const totals = totalAttributes();
  const modifier = attributeModifier(totals.REF);
  const pool = rollDicePool(1, 20);
  const total = pool.raw + modifier;
  const formula = `Iniciativa: 1d20${formatMod(modifier)}`;
  pushDiceLog({
    kind: "initiative",
    label: "Iniciativa",
    count: 1,
    sides: 20,
    bonus: 0,
    modifier,
    attribute: "REF",
    rolls: pool.rolls,
    total,
    formula,
    foundry: {
      type: "combatant-initiative",
      system: "solaris",
      attribute: "REF",
      diceProfile: "1d20 + MOD REF",
    },
  });
  showToast(`Iniciativa: ${total}`);
}

function openVitalHud() {
  readForm();
  renderStressHud(currentDiceProfile(), derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)));
  el.vitalHudModal.hidden = false;
  document.body.classList.add("modal-open");
  el.closeVitalHud.focus({ preventScroll: true });
}

function closeVitalHud() {
  el.vitalHudModal.hidden = true;
  syncModalOpenState();
}

function defaultTestModeFor(kind, name) {
  if (kind !== "Perícia") return "normal";
  const stateValue = state.current.skillTraining?.[name] || "";
  if (stateValue === "trained") return "advantage";
  if (stateValue === "ignorant") return "disadvantage";
  return "normal";
}

function openTestDialog({
  kind = "Teste",
  name = "Rolagem",
  attr = "FOR",
  modifier = null,
  modifierBonus = 0,
  selectableAttributes = [],
  mode = "normal",
} = {}) {
  readForm();
  if (!ensureDiceRollAllowed()) return;
  const totals = totalAttributes();
  const passiveBonus = kind === "Perícia" ? passiveSkillBonus(name) : kind === "Proteção" ? passiveProtectionBonus(name) : 0;
  const attributeOptions = selectableAttributes.filter((attribute) => ATTRIBUTES.includes(attribute));
  const fixedModifierBonus = numberValue(modifierBonus, 0) + passiveBonus;
  const testModifier = modifier ?? (attributeModifier(totals[attr] || ATTRIBUTE_BASE) + fixedModifierBonus);
  state.pendingTest = {
    kind,
    name,
    attr,
    modifier: testModifier,
    fixedModifier: modifier,
    modifierBonus: fixedModifierBonus,
    selectableAttributes: attributeOptions,
    diceType: kind === "Ataque" ? "d20" : "d6-pool",
  };
  el.testDialogKicker.textContent = kind;
  el.testDialogTitle.textContent = `${name} (${attr})`;
  el.testAttributeField.hidden = !attributeOptions.length;
  el.testAttributeSelect.innerHTML = attributeOptions.map((attribute) => {
    const attributeMod = attributeModifier(totals[attribute] || ATTRIBUTE_BASE);
    return `<option value="${attribute}">${attribute} (${formatMod(attributeMod)})</option>`;
  }).join("");
  if (attributeOptions.length) el.testAttributeSelect.value = attributeOptions.includes(attr) ? attr : attributeOptions[0];
  el.testBonus.value = "0";
  el.testMode.value = mode;
  updatePendingTestAttribute();
  renderPendingTestFormula();
  el.testDialog.hidden = false;
  (attributeOptions.length ? el.testAttributeSelect : el.testBonus).focus();
}

function closeTestDialog() {
  el.testDialog.hidden = true;
  el.testAttributeField.hidden = true;
  state.pendingTest = null;
}

function updatePendingTestAttribute() {
  if (!state.pendingTest?.selectableAttributes?.length) return;
  const attr = el.testAttributeSelect.value;
  if (!state.pendingTest.selectableAttributes.includes(attr)) return;
  const totals = totalAttributes();
  state.pendingTest.attr = attr;
  state.pendingTest.modifier = attributeModifier(totals[attr] || ATTRIBUTE_BASE) + state.pendingTest.modifierBonus;
  el.testDialogTitle.textContent = `${state.pendingTest.name} (${attr})`;
  renderPendingTestFormula();
}

function renderPendingTestFormula() {
  if (!state.pendingTest) return;
  const bonus = numberValue(el.testBonus.value, 0);
  const modeLabel = el.testMode.value === "advantage" ? "vantagem" : el.testMode.value === "disadvantage" ? "desvantagem" : "normal";
  const diceFormula = state.pendingTest.diceType === "d20" ? "1d20" : `${currentDiceProfile().count}d6`;
  el.testDialogFormula.textContent = `${diceFormula} ${formatMod(state.pendingTest.modifier)} ${bonus ? formatMod(bonus) : ""} (${modeLabel})`;
}

function submitTestRoll(event) {
  event.preventDefault();
  if (!state.pendingTest) return;
  if (!ensureDiceRollAllowed()) {
    closeTestDialog();
    return;
  }
  const testName = state.pendingTest.name;
  const bonus = numberValue(el.testBonus.value, 0);
  const mode = el.testMode.value;
  const result = rollCharacterTest(state.pendingTest, bonus, mode);
  closeTestDialog();
  showToast(`${testName}: ${result.total}${result.resultLabel ? ` - ${result.resultLabel}` : ""}`);
}

function rollCharacterTest(test, situationalBonus = 0, mode = "normal") {
  if (test.diceType === "d20" || test.kind === "Ataque") {
    return rollD20CharacterTest(test, situationalBonus, mode);
  }

  const diceProfile = currentDiceProfile();
  const pools = [rollDicePool(diceProfile.count, 6)];
  if (mode !== "normal") pools.push(rollDicePool(diceProfile.count, 6));
  const chosen = mode === "advantage"
    ? pools.reduce((best, pool) => pool.raw > best.raw ? pool : best, pools[0])
    : mode === "disadvantage"
      ? pools.reduce((worst, pool) => pool.raw < worst.raw ? pool : worst, pools[0])
      : pools[0];
  const cosmicEffect = consumePendingCosmicEffect();
  const total = chosen.raw + test.modifier + situationalBonus + cosmicEffect.value;
  const resultLabel = classifyCommonTestResult(total, chosen.rolls);
  const formula = `${test.name}: ${diceProfile.count}d6${formatMod(test.modifier)}${situationalBonus ? formatMod(situationalBonus) : ""}${cosmicEffect.value ? formatMod(cosmicEffect.value) : ""}`;
  const triggeredCosmicEffect = detectCosmicSequence(chosen.rolls);
  if (triggeredCosmicEffect) state.current.pendingCosmicEffect = triggeredCosmicEffect;
  pushDiceLog({
    label: `${test.kind} - ${test.name}`,
    count: diceProfile.count,
    sides: 6,
    bonus: situationalBonus,
    modifier: test.modifier,
    attribute: test.attr,
    rolls: chosen.rolls,
    alternateRolls: pools.length > 1 ? pools.map((pool) => pool.rolls) : [],
    mode,
    total,
    formula,
    resultLabel,
    cosmicEffect: cosmicEffect.label,
    triggeredCosmicEffect: cosmicEffectLabel(triggeredCosmicEffect),
  });
  renderSummary();
  return { total, rolls: chosen.rolls, resultLabel };
}

function rollD20CharacterTest(test, situationalBonus = 0, mode = "normal") {
  const pools = [rollDicePool(1, 20)];
  if (mode !== "normal") pools.push(rollDicePool(1, 20));
  const chosen = mode === "advantage"
    ? pools.reduce((best, pool) => pool.raw > best.raw ? pool : best, pools[0])
    : mode === "disadvantage"
      ? pools.reduce((worst, pool) => pool.raw < worst.raw ? pool : worst, pools[0])
      : pools[0];
  const natural = chosen.rolls[0];
  const total = natural + test.modifier + situationalBonus;
  const resultLabel = natural === 20 ? "Crítico de ataque" : natural === 1 ? "Erro crítico de ataque" : "";
  const formula = `${test.name}: 1d20${formatMod(test.modifier)}${situationalBonus ? formatMod(situationalBonus) : ""}`;
  pushDiceLog({
    kind: "attack",
    label: `${test.kind} - ${test.name}`,
    count: 1,
    sides: 20,
    bonus: situationalBonus,
    modifier: test.modifier,
    attribute: test.attr,
    rolls: chosen.rolls,
    alternateRolls: pools.length > 1 ? pools.map((pool) => pool.rolls) : [],
    mode,
    total,
    formula,
    resultLabel,
  });
  return { total, rolls: chosen.rolls, resultLabel };
}

function classifyCommonTestResult(total, rolls) {
  if (rolls.length === 3 && rolls.every((roll) => roll === 6)) return "Crítico: triplo 6";
  if (rolls.length === 3 && rolls.every((roll) => roll === 1)) return "Erro crítico: triplo 1";
  if (rolls.length === 2 && rolls.every((roll) => roll === 6)) return "Superação extrema em Colapso";
  if (total >= 15) return "Sucesso completo";
  if (total >= 10) return "Sucesso parcial";
  return "Falha";
}

function detectCosmicSequence(rolls) {
  if (rolls.length !== 3) return "";
  const sequence = rolls.join(",");
  if (sequence === "4,5,6") return "blessing";
  if (sequence === "3,2,1") return "failure";
  return "";
}

function consumePendingCosmicEffect() {
  const effect = state.current.pendingCosmicEffect;
  if (!effect) return { value: 0, label: "" };
  const roll = Math.floor(Math.random() * 4) + 1;
  state.current.pendingCosmicEffect = "";
  return effect === "blessing"
    ? { value: roll, label: `Bênção Cósmica +${roll}` }
    : { value: -roll, label: `Falha Cósmica -${roll}` };
}

function cosmicEffectLabel(effect) {
  if (effect === "blessing") return "Bênção guardada (+1d4)";
  if (effect === "failure") return "Falha guardada (-1d4)";
  return "Nenhuma";
}

function rollDicePool(count, sides) {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, raw: rolls.reduce((sum, roll) => sum + roll, 0) };
}

function pushDiceLog(entry) {
  const logEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    schemaVersion: 1,
    system: "solaris",
    createdAt: new Date().toISOString(),
    ...entry,
  };
  state.current.diceLog = [logEntry, ...(state.current.diceLog || [])].slice(0, 50);
  renderDicePage();
  showHolographicDiceOverlay(logEntry);
}

function showHolographicDiceOverlay(entry) {
  const rolls = Array.isArray(entry.rolls) ? entry.rolls.slice(0, 20) : [];
  if (!rolls.length) return;

  clearTimeout(diceOverlayTimer);
  document.querySelector(".holo-dice-overlay")?.remove();

  const sides = numberValue(entry.sides, 6);
  const hiddenCount = Math.max(0, (entry.rolls?.length || 0) - rolls.length);
  const diceMarkup = rolls.map((roll, index) => {
    const spread = Math.round((index - (rolls.length - 1) / 2) * 18);
    const drift = Math.round((Math.random() - 0.5) * 70);
    const rotate = Math.round(240 + Math.random() * 300);
    return `
      <span class="holo-die" style="--die-delay:${index * 70}ms; --die-x:${spread + drift}px; --die-rot-x:${rotate}deg; --die-rot-y:${-rotate}deg; --die-mid-x:${Math.round(rotate * -0.38)}deg; --die-mid-y:${Math.round(rotate * 0.44)}deg;">
        <span>D${escapeHtml(sides)}</span>
        <strong>${escapeHtml(roll)}</strong>
      </span>
    `;
  }).join("");

  const overlay = document.createElement("div");
  overlay.className = "holo-dice-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="holo-dice-stage">
      <p>${escapeHtml(entry.label || "Rolagem")}</p>
      <div class="holo-dice-row">${diceMarkup}</div>
      ${hiddenCount ? `<small>+${hiddenCount} dados no chat</small>` : ""}
      <strong class="holo-dice-total">${escapeHtml(entry.total)}</strong>
      <span>${escapeHtml(entry.formula || "")}</span>
    </div>
  `;
  document.body.appendChild(overlay);
  diceOverlayTimer = setTimeout(() => overlay.remove(), 2400);
}

function handleEquipmentRoll(kind) {
  if (!ensureDiceRollAllowed()) return;
  const weapon = getEquippedMarketItem("weapon");
  if (!weapon) {
    showToast("Equipe uma arma antes de rolar.");
    return;
  }
  if (itemCrackLevel(getEquippedInventoryEntry("weapon")) >= ITEM_CRACK_MAX) {
    showToast("A arma está colapsada e precisa ser reparada.");
    return;
  }
  const group = classifyWeapon(weapon);
  if (kind === "attack") {
    const attr = weaponAttackAttribute(group);
    openTestDialog({
      kind: "Ataque",
      name: weapon.name,
      attr,
      modifierBonus: passiveAttackBonus(weapon, group),
      selectableAttributes: ATTRIBUTES,
    });
    return;
  }
  if (kind === "damage") rollWeaponDamage(weapon);
}

function rollWeaponDamage(weapon) {
  if (!ensureDiceRollAllowed()) return;
  const expression = parseDiceExpression(weapon.damage);
  if (!expression) {
    showToast("Essa arma não tem dano em formato de dado.");
    return;
  }
  const rolls = Array.from({ length: expression.count }, () => Math.floor(Math.random() * expression.sides) + 1);
  const passiveBonus = passiveDamageBonus(weapon);
  const totalBonus = expression.bonus + passiveBonus;
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + totalBonus;
  const formula = `Dano ${weapon.name}: ${expression.count}d${expression.sides}${totalBonus ? formatMod(totalBonus) : ""}`;
  pushDiceLog({
    label: `Dano - ${weapon.name}`,
    count: expression.count,
    sides: expression.sides,
    bonus: totalBonus,
    rolls,
    total,
    formula,
  });
  showToast(`${formula}: ${total}`);
}

function applyManualTemplate() {
  if (!el.manualType) return;
  const officialTemplate = findOfficialTemplateForManualType(el.manualType.value);
  const template = officialTemplate
    ? {
        title: `Modelo oficial - ${officialTemplate.label}`,
        format: officialTemplate.fields.map((field) => field.label).join(" | "),
        example: officialTemplate.source,
        fields: {},
      }
    : manualCreationTemplates[el.manualType.value] || manualCreationTemplates.item;
  const allowsImage = true;
  el.manualFormatGuide.innerHTML = `
    <strong>${escapeHtml(template.title)}</strong>
    <span>${escapeHtml(template.format)}</span>
    <small>${escapeHtml(template.example)}</small>
  `;

  el.manualImagePanel.hidden = !allowsImage;
  renderManualImagePreview();
  ["tier", "subtype", "price", "weight", "power", "mods", "cosmos", "tags"].forEach((field) => {
    setManualField(field, officialTemplate ? { hidden: true } : template.fields[field] || {});
  });
  renderManualOfficialFields(officialTemplate);
  el.manualEffect.placeholder = template.fields.effect?.placeholder || "Descreva o efeito, regra ou observações.";
}

function findOfficialTemplateForManualType(type) {
  const templateId = OFFICIAL_TEMPLATE_TYPE_MAP[type];
  if (!templateId) return null;
  return OFFICIAL_BOOK5.templates.find((template) => template.id === templateId) || null;
}

function renderManualOfficialFields(template) {
  if (!el.manualOfficialFields) return;
  if (!template) {
    el.manualOfficialFields.hidden = true;
    el.manualOfficialFields.innerHTML = "";
    return;
  }
  el.manualOfficialFields.hidden = false;
  el.manualOfficialFields.innerHTML = template.fields
    .filter((field) => !/^nome(?:\s|$)|^nome-da-|^nome-do-|^nome-ou-numero/.test(normalizeSearch(field.label)))
    .map((field) => {
      const wideClass = field.wide ? "wide-field" : "";
      if (field.type === "textarea") {
        return `
          <label class="${wideClass}">
            ${escapeHtml(field.label)}
            <textarea rows="3" data-official-field="${escapeHtml(field.id)}"></textarea>
          </label>
        `;
      }
      if (field.type === "select-yes-no") {
        return `
          <label class="${wideClass}">
            ${escapeHtml(field.label)}
            <select data-official-field="${escapeHtml(field.id)}">
              <option value="">Não informado</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </label>
        `;
      }
      return `
        <label class="${wideClass}">
          ${escapeHtml(field.label)}
          <input type="text" data-official-field="${escapeHtml(field.id)}" />
        </label>
      `;
    })
    .join("");
}

function setManualField(field, config = {}) {
  const wrapper = el.manualCreateForm.querySelector(`[data-manual-field="${field}"]`);
  const input = wrapper?.querySelector("input");
  const label = wrapper?.querySelector(".manual-field-label");
  if (!wrapper || !input || !label) return;
  const hidden = Boolean(config.hidden);
  wrapper.hidden = hidden;
  input.disabled = hidden;
  if (config.label) label.textContent = config.label;
  input.placeholder = config.placeholder || "";
}

function readManualEntry() {
  const type = el.manualType.value;
  const officialTemplate = findOfficialTemplateForManualType(type);
  const template = manualCreationTemplates[type] || manualCreationTemplates.item;
  const visible = (field) => !officialTemplate && !template.fields[field]?.hidden;
  const textValue = (field, node) => visible(field) ? node.value.trim() : "";
  const numberIfVisible = (field, node) => {
    if (!visible(field) || node.value === "") return "";
    return Math.max(0, numberValue(node.value, 0));
  };
  return {
    type,
    name: el.manualName.value.trim(),
    tier: textValue("tier", el.manualTier),
    subtype: textValue("subtype", el.manualSubtype),
    price: visible("price") ? Math.max(0, numberValue(el.manualPrice.value, 0)) : 0,
    weight: textValue("weight", el.manualWeight),
    power: textValue("power", el.manualPower),
    mods: numberIfVisible("mods", el.manualMods),
    cosmos: numberIfVisible("cosmos", el.manualCosmos),
    tags: parseTagList(textValue("tags", el.manualTags)),
    effect: el.manualEffect.value.trim(),
    imageDataUrl: state.manualImageDataUrl,
    imageName: state.manualImageName,
    templateId: officialTemplate?.id || "",
    templateSource: officialTemplate?.source || "",
    officialData: readManualOfficialFields(),
  };
}

function readManualOfficialFields() {
  if (!el.manualOfficialFields || el.manualOfficialFields.hidden) return {};
  return [...el.manualOfficialFields.querySelectorAll("[data-official-field]")].reduce((values, input) => {
    const value = input.value.trim();
    if (value) values[input.dataset.officialField] = value;
    return values;
  }, {});
}

function officialFieldValue(entry, ...keys) {
  const fields = entry.officialData || {};
  for (const key of keys) {
    const exact = fields[key];
    if (exact !== undefined && exact !== "") return exact;
    const normalizedKey = normalizeSearch(key);
    const match = Object.entries(fields).find(([field]) => normalizeSearch(field).includes(normalizedKey));
    if (match && match[1] !== "") return match[1];
  }
  return "";
}

function parseTagList(value) {
  return String(value || "")
    .split(/[,;|\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function uniqueTags(tags) {
  return tags.filter((tag, index, list) => list.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index);
}

function buildManualAbilityMeta(type, entry) {
  const parts = [];
  if (type === "cosmos" && entry.tier) parts.push(`Custo ${entry.tier} Cosmos`);
  else if (entry.tier) parts.push(entry.tier);
  if (entry.subtype) parts.push(entry.subtype);
  if (entry.weight) parts.push(type === "cosmos" ? `Duração ${entry.weight}` : entry.weight);
  if (entry.power) parts.push(entry.power);
  if (entry.tags.length) parts.push(entry.tags.join(", "));
  return parts.join(" - ");
}

function createManualEntry(event) {
  event.preventDefault();
  readForm();
  const manual = readManualEntry();
  if (!manual.name) return;

  const id = `custom-${manual.type}-${dataSlug(manual.name)}-${Date.now()}`;
  if (manual.templateId) applyOfficialManualValues(manual);
  const tags = uniqueTags(["manual", manual.templateId ? "modelo oficial" : "", ...manual.tags].filter(Boolean));
  const summary = manual.effect
    || officialFieldValue(manual, "descricao", "efeito", "funcao", "observacoes")
    || manual.power
    || "Criado manualmente.";
  if (["item", "weapon", "armor"].includes(manual.type)) {
    state.current.customItems = state.current.customItems || [];
    const item = {
      id,
      category: manual.type,
      name: manual.name,
      price: manual.price,
      weight: manual.weight,
      tags,
      summary,
      imageDataUrl: manual.imageDataUrl,
      imageName: manual.imageName,
      officialData: manual.officialData,
      templateId: manual.templateId,
      source: manual.templateSource || "Criação manual",
      schemaVersion: 1,
    };
    if (manual.type === "weapon") {
      item.tier = manual.tier || "Custom";
      item.type = manual.subtype || "Criada";
      item.damage = manual.power;
      item.mods = manual.mods;
    }
    if (manual.type === "armor") {
      item.tier = manual.tier || "Custom";
      item.kind = manual.subtype || "Criada";
      item.ca = parseFirstNumber(manual.power);
      item.mods = manual.mods;
      if (manual.cosmos !== "") item.cosmos = manual.cosmos;
    }
    state.current.customItems.unshift(item);
    state.current.inventory.unshift({
      uid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      itemId: item.id,
      category: item.category,
      inCube: false,
      cubeUid: "",
      supportSlot: "",
      crackLevel: 0,
    });
    syncDomainSnapshotFromLegacy({ autoSave: true });
    event.currentTarget.reset();
    clearManualItemImage();
    applyManualTemplate();
    renderForm();
    showToast(`${manual.name} criado e colocado nos equipamentos.`);
    return;
  }

  if (manual.templateId) {
    state.current.customRecords = state.current.customRecords || [];
    state.current.customRecords.unshift({
      id,
      category: manual.type,
      name: manual.name,
      tier: manual.tier,
      type: manual.subtype,
      price: manual.price,
      summary,
      tags,
      imageDataUrl: manual.imageDataUrl,
      imageName: manual.imageName,
      fields: manual.officialData,
      templateId: manual.templateId,
      source: manual.templateSource,
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
    });
    event.currentTarget.reset();
    clearManualItemImage();
    applyManualTemplate();
    renderForm();
    showToast(`${manual.name} criado no modelo oficial ${manual.templateSource}.`);
    return;
  }

  const sourceMap = {
    cosmos: "Cosmos",
    "chip-mod": "Chip modificador",
    ability: "Manual",
  };
  if (manual.type === "cosmos" && !canAddCosmicSpell()) {
    const slots = cosmicSpellSlotState();
    showToast(`Sem espaços de magia cósmica: ${slots.used}/${slots.total}.`, "cosmic-error");
    return;
  }
  if (manual.type === "chip-mod" && !canAddModifierChip()) {
    const slots = modifierSlotState();
    showToast(`Sem espaço de mods para chip: ${slots.used}/${slots.total}.`, "tech-error");
    return;
  }
  state.current.knownAbilities = state.current.knownAbilities || [];
  state.current.knownAbilities.unshift({
    id,
    name: manual.name,
    manualType: manual.type,
    source: manual.type === "ability" ? manual.tier || "Manual" : sourceMap[manual.type] || "Manual",
    effect: manual.effect || "Sem efeito registrado.",
    meta: buildManualAbilityMeta(manual.type, manual),
    tier: manual.tier,
    subtype: manual.subtype,
    price: manual.price,
    weight: manual.weight,
    power: manual.power,
    passiveEffects: manual.type === "chip-mod" ? inferModifierChipPassiveEffects({ name: manual.name, effect: manual.effect, tags }) : [],
    modifierSlots: manual.type === "chip-mod" ? 1 : 0,
    installed: manual.type === "chip-mod",
    tags,
    imageDataUrl: manual.imageDataUrl,
    imageName: manual.imageName,
    custom: true,
  });
  event.currentTarget.reset();
  clearManualItemImage();
  applyManualTemplate();
  renderSummary();
  showToast(`${manual.name} criado e adicionado às habilidades.`);
}

function applyOfficialManualValues(manual) {
  manual.tier = officialFieldValue(manual, "tier") || manual.tier;
  manual.subtype = officialFieldValue(manual, "categoria", "tipo") || manual.subtype;
  manual.price = parseCurrencyNumber(
    officialFieldValue(manual, "preco-base-em-luzentis", "preco-em-luzentis", "preco-local-em-luzentis", "preco-estimado")
  );
  manual.weight = officialFieldValue(manual, "peso-ou-carga", "peso", "carga") || manual.weight;
  if (manual.type === "weapon") {
    manual.power = officialFieldValue(manual, "dano");
    manual.mods = parseFirstNumber(officialFieldValue(manual, "espacos-de-mod"));
    manual.tags = uniqueTags([
      ...manual.tags,
      officialFieldValue(manual, "tipo-de-dano"),
      officialFieldValue(manual, "alcance"),
      officialFieldValue(manual, "propriedades"),
    ].filter(Boolean));
  }
  if (manual.type === "armor") {
    manual.power = officialFieldValue(manual, "ca-concedida");
    manual.mods = parseFirstNumber(officialFieldValue(manual, "espacos-de-mod"));
    manual.tags = uniqueTags([
      ...manual.tags,
      officialFieldValue(manual, "resistencias"),
      officialFieldValue(manual, "vulnerabilidades"),
    ].filter(Boolean));
  }
}

function parseCurrencyNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? numberValue(digits, 0) : 0;
}

function handleInventoryAction(action, uid, trigger = null) {
  const entry = state.current.inventory.find((item) => item.uid === uid);
  if (!entry) return;
  const item = findMarketItem(entry.itemId);
  if (!item) return;

  if (action === "open-storage") {
    const domain = domainCharacterFromLegacy();
    const storage = domain.inventory.findById(uid);
    if (!storage?.isStorage()) return;
    if (storage.entityType === ENTITY_TYPES.CUBE || item.category === "cube") {
      openCubeInterior(uid);
      switchCharacterPage("cubo");
      return;
    }
    const contents = domain.inventory.getStoredIn(uid);
    const capacity = storageCapacityLabel(storage, domain.inventory);
    const contentNames = contents.map((entity) => entity.name).join(", ") || "Vazio";
    window.alert(`${storage.name}\nCapacidade: ${capacity}\nConteúdo: ${contentNames}`);
    return;
  }

  if (action === "open-cube") {
    openCubeInterior(uid);
    return;
  }

  if (action === "cube-remove") {
    const domain = domainCharacterFromLegacy();
    domain.moveEntityTo(uid, { kind: LOCATION_KINDS.UNASSIGNED });
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderSummary();
    showToast(`${item.name} removido do cubo e marcado como sem local.`);
    return;
  }

  if (action === "support-attach") {
    openInventoryLocationDialog(uid, "move");
    return;
  }

  if (action === "support-remove") {
    const domain = domainCharacterFromLegacy();
    domain.moveEntityTo(uid, { kind: LOCATION_KINDS.UNASSIGNED });
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderSummary();
    showToast(`${item.name} solto do suporte e marcado como sem local.`);
    return;
  }

  if (action === "move") {
    openInventoryLocationDialog(uid, "move");
    return;
  }

  if (action === "use") {
    const domain = domainCharacterFromLegacy();
    const entity = domain.inventory.findById(uid);
    const resource = entity?.resources?.[0];
    if (resource && !resource.spend(1)) {
      showToast(`${item.name} está sem ${resource.label.toLowerCase()}.`, "tech-error");
      return;
    }
    const consumed = isConsumableItem(item) && (!resource || resource.current <= 0);
    if (entity && consumed) {
      domain.removeEntity(uid, { force: true, deleteContents: true });
    }
    if (entity) {
      syncDomainCharacterToLegacy(domain);
      persistCurrentCharacterSilently();
    }
    renderSummary();
    showToast(consumed
      ? `${item.name} consumido e removido do inventário.`
      : resource
        ? `${item.name} usado. ${resource.current}/${resource.max} ${resource.label}.`
        : `${item.name} usado.`);
    return;
  }

  if (action === "install") {
    if (!canAddModifierChip(item.slots)) {
      const slots = modifierSlotState();
      showToast(`Sem espaço de mods para chip: ${slots.used}/${slots.total}.`, "tech-error");
      return;
    }
    const domain = domainCharacterFromLegacy();
    const targets = domain.inventory.getAll().filter((entity) =>
      [ENTITY_TYPES.WEAPON, ENTITY_TYPES.ARMOR].includes(entity.entityType)
      && entity.location.kind === LOCATION_KINDS.EQUIPPED
    );
    if (!targets.length) {
      showToast("Equipe uma arma ou armadura antes de instalar o chip.", "tech-error");
      return;
    }
    let target = targets[0];
    if (targets.length > 1) {
      const choices = targets.map((candidate, index) => `${index + 1}. ${candidate.name}`).join("\n");
      const selected = window.prompt(`Instalar ${item.name} em qual equipamento?\n${choices}`, "1");
      if (selected === null) return;
      target = targets[clamp(numberValue(selected, 1) - 1, 0, targets.length - 1)];
    }
    try {
      domain.installChip(uid, target.id);
      syncDomainCharacterToLegacy(domain);
      persistCurrentCharacterSilently();
      renderForm();
      showToast(`${item.name} instalado em ${target.name}.`);
    } catch (error) {
      showToast(error.message || "Não foi possível instalar o chip.", "tech-error");
    }
    return;
  }

  if (action === "uninstall") {
    const domain = domainCharacterFromLegacy();
    domain.uninstallChip(uid);
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${item.name} removido do equipamento.`);
    return;
  }

  if (action === "cast") {
    const domain = domainCharacterFromLegacy();
    const entity = domain.inventory.findById(uid);
    const cosmosCost = Math.max(0, numberValue(entity?.definitionSnapshot?.cosmosCost, item.cost || 0));
    if (domain.currentCosmos < cosmosCost) {
      showToast(`Cosmos insuficiente: a magia exige ${cosmosCost}.`, "cosmic-error");
      return;
    }
    domain.currentCosmos -= cosmosCost;
    syncDomainCharacterToLegacy(domain);
    state.current.cosmosCurrent = domain.currentCosmos;
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${item.name} conjurada${cosmosCost ? ` por ${cosmosCost} Cosmos` : ""}.`);
    return;
  }

  if (action === "sell") {
    if (!canDisableExternalSupportProvider(entry)) return;
    const nextWeaponUid = item.category === "weapon" && state.current.equippedWeaponUid === uid ? "" : state.current.equippedWeaponUid;
    const nextArmorUid = item.category === "armor" && state.current.equippedArmorUid === uid ? "" : state.current.equippedArmorUid;
    const removesModSource = nextWeaponUid !== state.current.equippedWeaponUid || nextArmorUid !== state.current.equippedArmorUid;
    if (removesModSource && !canUseModifierSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    if (removesModSource && !canUseCosmicSpellSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    const input = trigger?.closest(".inventory-card")?.querySelector("[data-sell-value]");
    const suggestedValue = Math.floor(numberValue(input?.value, numberValue(item.price, 0) / 2));
    const requestedValue = window.prompt(`Valor de venda de ${item.name}:`, String(suggestedValue));
    if (requestedValue === null) return;
    const saleValue = Math.max(0, numberValue(requestedValue, suggestedValue));
    const domain = domainCharacterFromLegacy();
    const entity = domain.inventory.findById(uid);
    const contents = entity?.isStorage() ? domain.inventory.getStoredIn(uid) : [];
    if (contents.length && !window.confirm(`Este armazenador possui ${contents.length} item(ns). Ao vender, eles ficarão sem local definido. Continuar?`)) return;
    try {
      domain.sellEntity(uid, saleValue);
      syncDomainCharacterToLegacy(domain);
      persistCurrentCharacterSilently();
      if (state.openCubeUid === uid) state.openCubeUid = "";
      renderForm();
      showToast(`${item.name} vendido por ${formatCurrency(saleValue)}.`);
    } catch (error) {
      showToast(error.message || "Não foi possível vender o item.", "tech-error");
    }
    return;
  }

  if (action === "delete") {
    if (isInventoryEquipped(entry)) {
      showToast("Este item está equipado. Desequipe antes de excluir.", "tech-error");
      return;
    }
    if (!window.confirm(`Excluir ${item.name}? Isso não devolve Luzentis.`)) return;
    const domain = domainCharacterFromLegacy();
    const entity = domain.inventory.findById(uid);
    const contents = entity?.isStorage() ? domain.inventory.getStoredIn(uid) : [];
    let deleteContents = false;
    if (contents.length) {
      deleteContents = window.confirm("Este armazenador possui itens dentro. Deseja excluir também o conteúdo?");
      if (!deleteContents) {
        showToast("Exclusão bloqueada: esvazie o armazenador primeiro.", "tech-error");
        return;
      }
    }
    try {
      domain.deleteEntityManually(uid, { deleteContents, force: false });
      syncDomainCharacterToLegacy(domain);
      persistCurrentCharacterSilently();
      if (state.openCubeUid === uid) state.openCubeUid = "";
      renderForm();
      showToast(`${item.name} excluído sem reembolso.`);
    } catch (error) {
      showToast(error.message || "Não foi possível excluir o item.", "tech-error");
    }
    return;
  }

  if (action === "equip") {
    const nextWeaponUid = item.category === "weapon" ? uid : state.current.equippedWeaponUid;
    const nextArmorUid = item.category === "armor" ? uid : state.current.equippedArmorUid;
    if (!canUseModifierSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    if (!canUseCosmicSpellSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    const domain = domainCharacterFromLegacy();
    domain.equipEntity(uid, item.category === "armor" ? "armor" : "mainWeapon");
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${item.name} equipado.`);
    return;
  }

  if (action === "unequip") {
    if (!canDisableExternalSupportProvider(entry)) return;
    const nextWeaponUid = item.category === "weapon" && state.current.equippedWeaponUid === uid ? "" : state.current.equippedWeaponUid;
    const nextArmorUid = item.category === "armor" && state.current.equippedArmorUid === uid ? "" : state.current.equippedArmorUid;
    if (!canUseModifierSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    if (!canUseCosmicSpellSlotLayout({ weaponUid: nextWeaponUid, armorUid: nextArmorUid })) return;
    const domain = domainCharacterFromLegacy();
    domain.unequipEntity(uid);
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${item.name} desequipado e marcado como sem local.`);
    return;
  }

  if (action === "cube") {
    openInventoryLocationDialog(uid, "move");
  }
}

function renderSavedList() {
  const query = el.characterSearch.value.trim().toLowerCase();
  const filtered = state.saved.filter((character) => {
    const race = findRace(character.race).name;
    const profession = findProfession(character.profession).name;
    return [character.name, character.player, race, profession, character.origin].join(" ").toLowerCase().includes(query);
  });

  if (!filtered.length) {
    el.savedList.innerHTML = '<div class="empty-state">Nenhuma ficha salva.</div>';
    return;
  }

  el.savedList.innerHTML = filtered.map((character) => {
    const race = findRace(character.race).name;
    const profession = findProfession(character.profession).name;
    const active = character.id === state.current.id ? "active" : "";
    const thumb = character.photoDataUrl
      ? `<img src="${escapeHtml(character.photoDataUrl)}" alt="" />`
      : '<span data-icon="spark"></span>';
    return `
      <article class="saved-card ${active}" data-id="${character.id}">
        <div class="saved-summary">
          <div class="saved-thumb">${thumb}</div>
          <div>
            <h3>${escapeHtml(character.name || "Personagem sem nome")}</h3>
            <p>${race} - ${profession} - Nível ${character.level || 1}</p>
            <p>${character.updatedAt ? formatDate(character.updatedAt) : "Ainda sem data"}</p>
          </div>
        </div>
        <div class="saved-actions">
          <button class="mini-button" type="button" data-action="load" data-id="${character.id}">Abrir</button>
          <button class="mini-button" type="button" data-action="duplicate" data-id="${character.id}">Duplicar</button>
          <button class="mini-button" type="button" data-action="delete" data-id="${character.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join("");
  installIcons();

  el.savedList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      handleSavedAction(button.dataset.action, button.dataset.id);
    });
  });

  el.savedList.querySelectorAll(".saved-card").forEach((card) => {
    card.addEventListener("click", () => loadCharacter(card.dataset.id));
  });
}

function getLibraryItemsForView(view) {
  const library = libraryMap[view];
  if (!library) return [];
  if (view === "monstros") return getMonsterLibraryItems();
  return [...library.items, ...customLibraryItems(view)].map(resolveShopPrice);
}

function renderLibrary() {
  const library = libraryMap[state.activeLibrary];
  const libraryItems = getLibraryItemsForView(state.activeLibrary);
  const selectedGroup = syncLibraryFilterOptions(
    libraryItems,
    state.activeLibrary,
    state.libraryPresetFilter
  );
  const sortMode = el.librarySort.value || "default";
  const query = normalizeSearch(el.librarySearch.value.trim());
  const isRaceLibrary = state.activeLibrary === "racas";
  const isMonsterLibrary = state.activeLibrary === "monstros";
  const showsInlineSummary = state.activeLibrary === "regras";
  const isMarketLibrary = Boolean(library.market);
  const isLearnLibrary = Boolean(library.learn);
  const isModifierChipLibrary = library.learn === "chip-mod";
  const isCosmicSpellLibrary = library.learn === "cosmos";
  const modSlots = modifierSlotState();
  const cosmicSpellSlots = cosmicSpellSlotState();
  const learnedAbilityIds = new Set((state.current.knownAbilities || []).map((ability) => ability.id));
  const selectedRulebookTitle = state.activeLibrary === "regras" && selectedGroup
    ? rulebookTitles[selectedGroup]
    : "";
  el.libraryTitle.textContent = selectedRulebookTitle
    ? `${selectedGroup} - ${selectedRulebookTitle}`
    : library.title;
  el.libraryKicker.textContent = selectedRulebookTitle ? "Biblioteca oficial" : library.kicker;
  el.viewTitle.textContent = selectedRulebookTitle
    ? `${selectedGroup} - ${selectedRulebookTitle}`
    : library.title;
  el.createMonsterButton.hidden = !isMonsterLibrary;
  el.monsterSessionPanel.hidden = !isMonsterLibrary;
  if (isMonsterLibrary) renderMonsterSessionPanel();

  const filtered = sortLibraryItems(libraryItems.filter((item) => {
    const matchesSearch = !query || itemSearchText(item).includes(query);
    const matchesGroup = !selectedGroup || getLibraryGroupValues(item, state.activeLibrary).includes(selectedGroup);
    return matchesSearch && matchesGroup;
  }), sortMode, state.activeLibrary);
  const paginationKey = `library:${state.activeLibrary}`;
  const paginated = paginateItems(filtered, state.pagination[paginationKey] || 1);
  state.pagination[paginationKey] = paginated.page;
  el.libraryPagination.innerHTML = renderPaginationControls(paginated, paginationKey);

  if (!filtered.length) {
    el.libraryGrid.innerHTML = '<div class="empty-state">Nada encontrado na biblioteca.</div>';
    return;
  }

  el.libraryGrid.innerHTML = paginated.items.map((item) => {
    const meta = isMarketLibrary ? marketMeta(item) : isMonsterLibrary ? monsterMeta(item) : libraryMeta(item);
    const bonus = item.bonus ? Object.entries(item.bonus).map(([key, value]) => `${key} ${formatMod(value)}`).join("  ") : "";
    const tags = (item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const alreadyLearned = isLearnLibrary && learnedAbilityIds.has(item.id);
    const lacksModSlot = isModifierChipLibrary && !alreadyLearned && modSlots.free < modifierChipSlotCost(item);
    const lacksCosmicSpellSlot = isCosmicSpellLibrary && !alreadyLearned && cosmicSpellSlots.free <= 0;
    const slotBlocked = lacksModSlot ? "tech" : lacksCosmicSpellSlot ? "cosmic" : "";
    const learnDisabled = alreadyLearned;
    const learnLabel = alreadyLearned
      ? "Na ficha"
      : slotBlocked
        ? "Sem slot livre"
        : library.learn === "cosmos" ? "Adicionar magia" : "Adicionar chip";
    const cardOpen = isRaceLibrary
      ? `<button class="library-card race-card compact-card" type="button" data-race-id="${escapeHtml(item.id)}" data-detail-kind="library" data-detail-view="${escapeHtml(state.activeLibrary)}" data-detail-id="${escapeHtml(item.id)}" aria-label="Abrir página da raça ${escapeHtml(item.name)}">`
      : `<article class="library-card compact-card ${isMonsterLibrary ? "with-actions monster-library-card" : ""} ${item.priceEditable ? "with-price-editor" : ""} ${item.imageDataUrl || item.image ? "with-image" : ""}" tabindex="0" data-detail-kind="library" data-detail-view="${escapeHtml(state.activeLibrary)}" data-detail-id="${escapeHtml(item.id)}">`;
    const cardClose = isRaceLibrary ? "</button>" : "</article>";
    return `
      ${cardOpen}
        ${renderCardImage(item)}
        <div class="card-face">
          <h3>${isRaceLibrary ? escapeHtml(item.name) : renderCardTitleButton(item.name)}</h3>
          ${meta || bonus ? `<p class="card-meta-line">${escapeHtml(meta || bonus)}</p>` : ""}
          ${showsInlineSummary ? `<p class="library-inline-summary">${escapeHtml(item.summary)}</p>` : ""}
        </div>
        ${isMarketLibrary ? renderLibraryPurchaseControls(item) : ""}
        ${isLearnLibrary ? `<button class="primary-button shop-button" type="button" data-learn-id="${escapeHtml(item.id)}" ${learnDisabled ? "disabled" : ""} ${slotBlocked ? `data-slot-blocked="${slotBlocked}" aria-disabled="true"` : ""}>${learnLabel}</button>` : ""}
        ${isMonsterLibrary ? `
          <div class="inventory-actions monster-card-actions">
            <button class="mini-button" type="button" data-monster-session-add="${escapeHtml(item.id)}">Adicionar à sessão</button>
            <button class="mini-button" type="button" data-monster-playable="${escapeHtml(item.id)}">Criar ficha jogável</button>
            <button class="mini-button" type="button" data-monster-image="${escapeHtml(item.id)}">${item.imageDataUrl || item.image ? "Alterar imagem" : "Adicionar imagem"}</button>
            <button class="mini-button" type="button" data-monster-assets="${escapeHtml(item.id)}">Conteúdo</button>
            ${item.official ? `<button class="mini-button" type="button" data-monster-edit="${escapeHtml(item.id)}">Editar cópia</button>` : `<button class="mini-button danger-mini-button" type="button" data-monster-delete="${escapeHtml(item.id)}">Excluir</button>`}
          </div>
        ` : ""}
        <div class="card-hover-popover" role="tooltip">
          <strong>${escapeHtml(item.name)}</strong>
          ${meta || bonus ? `<p>${escapeHtml(meta || bonus)}</p>` : ""}
          <p>${escapeHtml(item.summary)}</p>
          ${isMonsterLibrary ? renderMonsterPopoverDetails(item) : ""}
          ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        </div>
      ${cardClose}
    `;
  }).join("");
}

function renderLibraryPurchaseControls(item) {
  if (!item.priceEditable) {
    return Number.isFinite(item.price)
      ? `<button class="primary-button shop-button" type="button" data-buy-id="${escapeHtml(item.id)}">${item.price === 0 ? "Adicionar" : "Comprar"}</button>`
      : '<button class="primary-button shop-button" type="button" disabled>Preço narrativo</button>';
  }
  const priceValue = Number.isFinite(item.price) ? item.price : "";
  return `
    <div class="shop-price-editor">
      <label>
        Preço da loja
        <input type="number" min="0" step="1" value="${escapeHtml(priceValue)}" data-shop-price-input="${escapeHtml(item.id)}" placeholder="Definir" />
      </label>
      <button class="primary-button shop-button" type="button" data-buy-id="${escapeHtml(item.id)}">${Number.isFinite(item.price) && item.price === 0 ? "Adicionar" : "Comprar"}</button>
    </div>
  `;
}

function paginateItems(items, page, pageSize = PAGE_SIZE) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePageSize = Math.max(1, numberValue(pageSize, PAGE_SIZE));
  const pageCount = Math.max(1, Math.ceil(safeItems.length / safePageSize));
  const safePage = clamp(numberValue(page, 1), 1, pageCount);
  const start = (safePage - 1) * safePageSize;
  return {
    items: safeItems.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    pageCount,
    total: safeItems.length,
  };
}

function renderPaginationControls(pagination, key) {
  if (!pagination || pagination.total <= pagination.pageSize) return "";
  const visiblePages = new Set([
    1,
    pagination.pageCount,
    pagination.page - 2,
    pagination.page - 1,
    pagination.page,
    pagination.page + 1,
    pagination.page + 2,
  ].filter((page) => page >= 1 && page <= pagination.pageCount));
  const pageButtons = [...visiblePages]
    .sort((a, b) => a - b)
    .reduce((markup, page, index, pages) => {
      const hasGap = index > 0 && page - pages[index - 1] > 1;
      return `${markup}${hasGap ? '<span class="pagination-ellipsis" aria-hidden="true">...</span>' : ""}<button class="mini-button ${page === pagination.page ? "active" : ""}" type="button" data-page-key="${escapeHtml(key)}" data-page-value="${page}" aria-label="Página ${page}" aria-current="${page === pagination.page ? "page" : "false"}">${page}</button>`;
    }, "");
  return `
    <button class="mini-button" type="button" data-page-key="${escapeHtml(key)}" data-page-value="${pagination.page - 1}" ${pagination.page <= 1 ? "disabled" : ""}>Anterior</button>
    ${pageButtons}
    <button class="mini-button" type="button" data-page-key="${escapeHtml(key)}" data-page-value="${pagination.page + 1}" ${pagination.page >= pagination.pageCount ? "disabled" : ""}>Próxima</button>
  `;
}

function handlePaginationClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-page-key]");
  if (!button || button.hasAttribute("disabled")) return;
  const key = button.dataset.pageKey;
  state.pagination[key] = Math.max(1, numberValue(button.dataset.pageValue, 1));
  if (key.startsWith("library:")) renderLibrary();
  else if (key.startsWith("inventory:")) renderEquipmentPage(derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)));
  else if (key.startsWith("cosmos:")) renderCosmosPage(derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)));
  else if (key.startsWith("abilities:")) renderAbilitiesPage();
  else if (key.startsWith("manual:")) renderManualCreatedPage();
  else if (key.startsWith("monster-assets:")) renderMonsterAssetManager();
  else if (key.startsWith("cubes:")) renderCubePage(derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)));
  else if (key.startsWith("monster-session:")) renderMonsterSessionPanel();
}

function resetLibraryPaginationAndRender() {
  state.pagination[`library:${state.activeLibrary}`] = 1;
  renderLibrary();
}

function handleAbilityAction(action, abilityId) {
  const ability = (state.current.knownAbilities || []).find((entry) => entry.id === abilityId);
  if (!ability) return;
  if (action === "install") {
    if (!canAddModifierChip(modifierChipSlotCost(ability))) {
      const slots = modifierSlotState();
      showToast(`Sem espaço de mods para chip: ${slots.used}/${slots.total}.`, "tech-error");
      return;
    }
    ability.installed = true;
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${ability.name} instalado.`);
    return;
  }
  if (action === "uninstall") {
    if (!canUseCosmicSpellSlotLayout({ excludedAbilityId: abilityId })) return;
    ability.installed = false;
    persistCurrentCharacterSilently();
    renderForm();
    showToast(`${ability.name} desinstalado.`);
    return;
  }
  const label = ability.source === "Cosmos" ? "Remover magia" : "Excluir";
  if (!window.confirm(`${label} ${ability.name}? Esta ação não devolve Luzentis.`)) return;
  state.current.knownAbilities = (state.current.knownAbilities || []).filter((entry) => entry.id !== abilityId);
  const domain = domainCharacterFromLegacy();
  domain.knownSpells = (domain.knownSpells || []).filter((spell) => spell.id !== abilityId && spell.definitionId !== abilityId);
  domain.metadata.legacyKnownAbilities = structuredCloneSafe(state.current.knownAbilities);
  syncDomainCharacterToLegacy(domain);
  persistCurrentCharacterSilently();
  renderForm();
  showToast(ability.source === "Cosmos" ? `${ability.name} removida da ficha.` : `${ability.name} excluído sem reembolso.`);
}

function removeProfessionChip() {
  const profession = findProfession(state.current.profession);
  if (profession.id === "escolha-profissao") return;
  if (!window.confirm(`Remover o chip de profissão ${profession.name}? Os efeitos concedidos deixarão de valer.`)) return;
  state.current.profession = "escolha-profissao";
  persistCurrentCharacterSilently();
  renderForm();
  showToast("Chip de profissão removido.");
}

function removeInstalledMod(modId) {
  const mod = (state.current.installedMods || []).find((entry) => entry.id === modId);
  if (!mod) return;
  if (!window.confirm(`Remover o mod ${mod.name || "selecionado"} do equipamento?`)) return;
  const returnToInventory = window.confirm("Deseja devolver o mod ao inventário? OK devolve; Cancelar exclui o mod sem reembolso.");
  const domain = domainCharacterFromLegacy();
  domain.inventory.getAll().forEach((entity) => {
    entity.installedModIds = (entity.installedModIds || []).filter((id) => id !== modId);
  });
  state.current.installedMods = (state.current.installedMods || []).filter((entry) => entry.id !== modId);
  if (returnToInventory) {
    state.current.customRecords = state.current.customRecords || [];
    state.current.customRecords.unshift({
      id: mod.id,
      category: "mod",
      name: mod.name || "Mod removido",
      summary: mod.effect || "Mod devolvido ao inventário.",
      source: "Removido de equipamento",
      createdAt: new Date().toISOString(),
    });
  }
  syncDomainCharacterToLegacy(domain);
  persistCurrentCharacterSilently();
  renderForm();
  showToast(returnToInventory ? "Mod removido e devolvido ao inventário." : "Mod removido e excluído.");
}

function findCustomContent(id, type) {
  if (type === "item") return (state.current.customItems || []).find((entry) => entry.id === id);
  if (type === "ability") return (state.current.knownAbilities || []).find((entry) => entry.id === id && entry.custom);
  if (type === "record") return (state.current.customRecords || []).find((entry) => entry.id === id);
  return null;
}

function customLibraryDestination(record, type) {
  if (!record) return "";
  if (type === "item") {
    return {
      item: "itens",
      weapon: "armas",
      armor: "armaduras",
      cube: "armazenamento",
    }[record.category] || "";
  }
  if (type === "ability") {
    const manualType = record.manualType || (record.source === "Cosmos" ? "cosmos" : record.source === "Chip modificador" ? "chip-mod" : "");
    return manualType === "cosmos" ? "magias" : manualType === "chip-mod" ? "chipsMod" : "";
  }
  if (type === "record") {
    if (record.category === "mod") return "mods";
    if (record.category === "special-item") return "itens";
    if (["cube", "vehicle", "drone", "turret", "robot"].includes(record.category)) return "armazenamento";
  }
  return "";
}

function isCustomContentExported(originId) {
  return CUSTOM_LIBRARY_VIEWS.some((view) => customLibraryItems(view).some((entry) => entry.libraryOriginId === originId));
}

function exportCustomContentToLibrary(id, type) {
  const record = findCustomContent(id, type);
  const destination = customLibraryDestination(record, type);
  if (!record || !destination) {
    showToast("Este tipo de conteúdo ainda não possui uma biblioteca correspondente.", "tech-error");
    return;
  }
  const libraryEntry = buildCustomLibraryEntry(record, type, destination);
  const entries = customLibraryItems(destination);
  const existingIndex = entries.findIndex((entry) => entry.libraryOriginId === id);
  if (existingIndex >= 0) entries[existingIndex] = libraryEntry;
  else entries.unshift(libraryEntry);
  state.customLibraryContent[destination] = entries;
  persistCustomLibraryContent();
  renderManualCreatedPage();
  showToast(`${record.name} ${existingIndex >= 0 ? "atualizado na" : "enviado para a"} biblioteca de ${libraryMap[destination].title.toLowerCase()}.`);
}

function buildCustomLibraryEntry(record, type, destination) {
  const common = {
    id: `custom-library-${dataSlug(record.name)}-${record.id}`,
    libraryOriginId: record.id,
    libraryCustom: true,
    source: "Biblioteca personalizada",
    name: record.name,
    summary: record.summary || record.effect || formatOfficialRecordFields(record) || "Conteúdo criado manualmente.",
    tags: uniqueTags(["personalizado", ...(record.tags || [])]),
    imageDataUrl: record.imageDataUrl || "",
    imageName: record.imageName || "",
    schemaVersion: 1,
  };
  if (type === "item") {
    return { ...structuredCloneSafe(record), ...common };
  }
  if (type === "ability") {
    if (destination === "magias") {
      return {
        ...common,
        category: "cosmos",
        cost: Math.max(0, parseFirstNumber(record.tier || record.meta || record.power) || 1),
        duration: record.weight || "",
      };
    }
    return {
      ...common,
      category: "chip-mod",
      rank: record.tier || record.subtype || "Custom",
      slots: Math.max(1, numberValue(record.modifierSlots, 1)),
      passiveEffects: normalizePassiveEffects(record.passiveEffects || inferModifierChipPassiveEffects(record)),
    };
  }
  const baseRecord = {
    ...common,
    category: record.category,
    tier: record.tier || "",
    type: record.type || "",
    price: Number.isFinite(record.price) ? record.price : undefined,
    officialData: record.fields || {},
    templateId: record.templateId || "",
  };
  if (destination === "armazenamento") {
    const capacityText = Object.entries(record.fields || {})
      .find(([key]) => /capacidade|unidades|espacos/i.test(normalizeSearch(key)))?.[1];
    return {
      ...baseRecord,
      cubeKind: record.category === "cube" ? inferCubeKindFromText(`${record.name} ${record.type} ${record.summary}`) : undefined,
      cubeCapacity: record.category === "cube" ? Math.max(1, parseFirstNumber(capacityText || record.summary) || 1) : undefined,
      weight: record.category === "cube" ? `${CUBE_WEIGHT_KG} Kg` : "",
    };
  }
  return baseRecord;
}

function inferCubeKindFromText(value) {
  const text = normalizeSearch(value);
  if (text.includes("especial")) return "specialized";
  if (text.includes("carga")) return "cargo";
  return "simple";
}

function deleteCustomContent(id, type) {
  const collections = {
    item: state.current.customItems || [],
    ability: state.current.knownAbilities || [],
    record: state.current.customRecords || [],
  };
  const record = collections[type]?.find((entry) => entry.id === id);
  if (!record) return;
  if (!window.confirm(`Excluir ${record.name}? Esta ação não devolve Luzentis.`)) return;
  if (type === "item") {
    const domain = domainCharacterFromLegacy();
    const instances = domain.inventory.getAll().filter((entity) => entity.definitionId === id);
    if (instances.some((entity) => entity.location.kind === LOCATION_KINDS.EQUIPPED)) {
      showToast("Este item está equipado. Desequipe antes de excluir.", "tech-error");
      return;
    }
    instances.forEach((entity) => domain.deleteEntityManually(entity.id, { force: true, deleteContents: true }));
    state.current.customItems = (state.current.customItems || []).filter((entry) => entry.id !== id);
    syncDomainCharacterToLegacy(domain);
  } else if (type === "ability") {
    state.current.knownAbilities = (state.current.knownAbilities || []).filter((entry) => entry.id !== id);
  } else {
    state.current.customRecords = (state.current.customRecords || []).filter((entry) => entry.id !== id);
  }
  persistCurrentCharacterSilently();
  renderForm();
  showToast(`${record.name} excluído sem reembolso.`);
}

function createRandomLevel1Character() {
  const firstNames = ["Aric", "Lyssara", "Kael", "Nara", "Voren", "Selene", "Darian", "Ilya", "Tarek", "Mira"];
  const lastNames = ["Valen", "Solaris", "Drak", "Korr", "Nox", "Aster", "Veyra", "Orion", "Tallis", "Rhen"];
  const availableRaces = raceData.filter((race) => race.id);
  const availableProfessions = professionData.filter((profession) => profession.id !== "escolha-profissao");
  const rollPool = Array.from({ length: 7 }, () => Math.floor(Math.random() * 6) + 1);
  const discardedIndex = rollPool.reduce((lowest, value, index) => value < rollPool[lowest] ? index : lowest, 0);
  const kept = rollPool.filter((_, index) => index !== discardedIndex).sort(() => Math.random() - 0.5);
  const character = emptyCharacter();
  character.name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  character.race = availableRaces[Math.floor(Math.random() * availableRaces.length)]?.id || "humanis";
  character.profession = availableProfessions[Math.floor(Math.random() * availableProfessions.length)]?.id || "escolha-profissao";
  character.racialChoice = defaultRacialChoice(findRace(character.race));
  character.level = 1;
  character.attributes = ATTRIBUTES.reduce((values, attr, index) => {
    values[attr] = ATTRIBUTE_BASE + kept[index];
    return values;
  }, {});
  character.initialAttributeRoll = { rolls: rollPool, kept, discardedIndex };
  state.current = character;

  const starterWeapon = weaponData.find((item) => String(item.tier).toUpperCase() === "F") || weaponData[0];
  const starterArmor = armorData.find((item) => String(item.tier).toUpperCase() === "F") || armorData[0];
  const addStarter = (item, slotId) => {
    if (!item) return;
    const domain = domainCharacterFromLegacy();
    const entity = domainDefinitionForItem(item).createInstance({
      location: { kind: LOCATION_KINDS.EQUIPPED, slotId },
    });
    domain.inventory.add(entity);
    domain.equipEntity(entity.id, slotId);
    syncDomainCharacterToLegacy(domain);
  };
  addStarter(starterWeapon, "mainWeapon");
  addStarter(starterArmor, "armor");
  const starterSupply = commonItemData.find((item) => /kit.*suprimento|suprimento.*kit/i.test(item.name)) || commonItemData.find((item) => /kit/i.test(item.name));
  if (starterSupply) {
    const domain = domainCharacterFromLegacy();
    domain.inventory.add(domainDefinitionForItem(starterSupply).createInstance({ location: { kind: LOCATION_KINDS.UNASSIGNED } }));
    syncDomainCharacterToLegacy(domain);
  }

  const simpleCube = cubeData.find((item) => item.cubeKind === "simple") || cubeData[0];
  const cubeCount = Math.max(0, 5 + attributeModifier(totalAttributes().FOR));
  for (let index = 0; index < cubeCount && simpleCube; index += 1) {
    const domain = domainCharacterFromLegacy();
    domain.inventory.add(domainDefinitionForItem(simpleCube).createInstance({ location: { kind: LOCATION_KINDS.UNASSIGNED } }));
    syncDomainCharacterToLegacy(domain);
  }
  const derived = derivedStats(totalAttributes(), findRace(character.race), findProfession(character.profession));
  state.current.pvCurrent = derived.pvMax;
  state.current.cosmosCurrent = derived.cosmosMax;
  persistCurrentCharacterSilently();
  renderForm();
  switchView("personagens");
  switchCharacterPage("ficha");
  showToast(`${state.current.name} foi criado no nível 1.`);
}

function bulkDeleteCharacterContent(kind) {
  if (!window.confirm("Tem certeza? Essa ação não devolve Luzentis e não pode ser desfeita.")) return;
  if (kind === "monsters") {
    state.monsterSession = [];
    persistMonsterSession();
    renderMonsterSessionPanel();
    showToast("Monstros da sessão excluídos.");
    return;
  }
  if (["chips", "spells", "manual"].includes(kind)) {
    state.current.knownAbilities = (state.current.knownAbilities || []).filter((ability) => {
      if (kind === "chips") return ability.source !== "Chip modificador";
      if (kind === "spells") return ability.source !== "Cosmos";
      return !ability.custom && ability.source !== "Manual";
    });
  }
  if (["items", "weapons", "armors", "equipment", "inventory"].includes(kind)) {
    const domain = domainCharacterFromLegacy();
    const targets = domain.inventory.getAll().filter((entity) => {
      if (kind === "inventory") return true;
      if (kind === "weapons") return entity.entityType === ENTITY_TYPES.WEAPON;
      if (kind === "armors") return entity.entityType === ENTITY_TYPES.ARMOR;
      if (kind === "items") return entity.entityType === ENTITY_TYPES.ITEM;
      return [ENTITY_TYPES.WEAPON, ENTITY_TYPES.ARMOR, ENTITY_TYPES.CUBE, ENTITY_TYPES.HOOK, ENTITY_TYPES.HOLSTER, ENTITY_TYPES.BANDOLIER].includes(entity.entityType);
    });
    targets.forEach((entity) => {
      if (domain.inventory.findById(entity.id)) domain.deleteEntityManually(entity.id, { force: true, deleteContents: true });
    });
    syncDomainCharacterToLegacy(domain);
    if (kind === "inventory") state.openCubeUid = "";
  }
  persistCurrentCharacterSilently();
  renderForm();
  showToast("Conteúdo removido sem reembolso.");
}

function syncLibraryFilterOptions(items, view, preferredValue = "") {
  const config = getLibraryFilterConfig(view);
  if (!config) {
    el.libraryTierControl.hidden = true;
    el.libraryTierFilter.innerHTML = '<option value="">Todos</option>';
    el.libraryTierFilter.value = "";
    return "";
  }

  const previousValue = preferredValue || el.libraryTierFilter.value;
  const options = [...new Set(items.flatMap((item) => getLibraryGroupValues(item, view)).filter(Boolean))]
    .sort((a, b) => compareGroupValues(a, b, config));

  if (!options.length) {
    el.libraryTierControl.hidden = true;
    el.libraryTierFilter.innerHTML = '<option value="">Todos</option>';
    el.libraryTierFilter.value = "";
    return "";
  }

  el.libraryTierControl.hidden = false;
  el.libraryTierFilter.innerHTML = [
    `<option value="">${escapeHtml(config.allLabel)}</option>`,
    ...options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(formatLibraryFilterOption(option, config))}</option>`),
  ].join("");

  const selectedValue = options.includes(previousValue) ? previousValue : "";
  el.libraryTierFilter.value = selectedValue;
  return selectedValue;
}

function getLibraryFilterConfig(view) {
  const configs = {
    armas: { allLabel: "Todos os tiers", prefix: "Tier", type: "tier" },
    armaduras: { allLabel: "Todos os tiers", prefix: "Tier", type: "tier" },
    chipsMod: { allLabel: "Todos os ranks", prefix: "Rank", type: "tier" },
    mods: { allLabel: "Todos os tipos", prefix: "", type: "text" },
    magias: { allLabel: "Todos os custos", prefix: "Custo", type: "number" },
    itens: { allLabel: "Todas as categorias", prefix: "", type: "text" },
    armazenamento: { allLabel: "Todos os tipos", prefix: "", type: "text" },
    monstros: { allLabel: "Todos os tiers", prefix: "Tier", type: "tier" },
    regras: { allLabel: "Todos os livros", prefix: "", type: "text" },
  };
  return configs[view] || null;
}

function getLibraryGroupValues(item, view) {
  if (view === "magias") return item.cost !== undefined && item.cost !== "" ? [String(item.cost)] : [];
  if (view === "chipsMod") return item.rank || item.tier ? [String(item.rank || item.tier)] : [];
  if (view === "mods") return item.type ? [String(item.type)] : [];
  if (view === "armas" || view === "armaduras") return item.tier ? [String(item.tier)] : [];
  if (view === "itens") {
    if (item.type) return [String(item.type)];
    return Array.isArray(item.tags) ? item.tags.map(String) : [];
  }
  if (view === "armazenamento") {
    const definition = domainDefinitionForItem(item);
    return [domainEntityTypeLabel(definition.entityType)];
  }
  if (view === "monstros") return item.tier ? [String(item.tier)] : [];
  if (view === "regras") return item.bookLabel ? [String(item.bookLabel)] : [];
  return [];
}

function formatLibraryFilterOption(value, config) {
  if (!config.prefix) return value;
  return `${config.prefix} ${value}`;
}

function sortLibraryItems(items, sortMode, view) {
  const sorted = [...items];
  const config = getLibraryFilterConfig(view);

  if (sortMode === "az") {
    return sorted.sort(compareLibraryNames);
  }

  if (sortMode === "za") {
    return sorted.sort((a, b) => compareLibraryNames(b, a));
  }

  if (sortMode === "price-asc") {
    return sorted.sort((a, b) => compareLibraryPrices(a, b, "asc") || compareLibraryNames(a, b));
  }

  if (sortMode === "price-desc") {
    return sorted.sort((a, b) => compareLibraryPrices(a, b, "desc") || compareLibraryNames(a, b));
  }

  if (sortMode === "tier") {
    return sorted.sort((a, b) => compareLibraryGroups(a, b, view, config) || compareLibraryPrices(a, b, "asc") || compareLibraryNames(a, b));
  }

  return sorted;
}

function compareLibraryGroups(a, b, view, config) {
  if (!config) return 0;
  const aValue = getLibraryGroupValues(a, view)[0] || "";
  const bValue = getLibraryGroupValues(b, view)[0] || "";
  return compareGroupValues(aValue, bValue, config);
}

function compareGroupValues(a, b, config) {
  if (config.type === "number") {
    return toSortableNumber(a) - toSortableNumber(b);
  }

  if (config.type === "tier") {
    const tierDiff = tierSortValue(a) - tierSortValue(b);
    if (tierDiff) return tierDiff;
  }

  return String(a).localeCompare(String(b), "pt-BR", { sensitivity: "base", numeric: true });
}

function compareLibraryNames(a, b) {
  return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base", numeric: true });
}

function compareLibraryPrices(a, b, direction) {
  const aPrice = getLibraryPrice(a);
  const bPrice = getLibraryPrice(b);
  if (aPrice === null && bPrice === null) return 0;
  if (aPrice === null) return 1;
  if (bPrice === null) return -1;
  return direction === "desc" ? bPrice - aPrice : aPrice - bPrice;
}

function getLibraryPrice(item) {
  const price = Number(item.price);
  return Number.isFinite(price) ? price : null;
}

function toSortableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.POSITIVE_INFINITY;
}

function tierSortValue(value) {
  const index = TIER_ORDER.indexOf(String(value).trim().toUpperCase());
  return index >= 0 ? index : TIER_ORDER.length + 1;
}

const itemSearchCache = new WeakMap();

function itemSearchText(item) {
  if (item && typeof item === "object" && itemSearchCache.has(item)) return itemSearchCache.get(item);
  const result = normalizeSearch([
    item.name,
    item.title,
    item.bookLabel,
    item.bookTitle,
    item.number,
    item.breadcrumb,
    item.context,
    item.tier,
    item.type,
    item.role,
    item.size,
    item.pv,
    item.ca,
    item.movement,
    item.habitat,
    item.behavior,
    item.attacks,
    item.abilities,
    item.weaknesses,
    item.resources,
    item.kind,
    item.damage,
    item.summary,
    item.price,
    item.cost,
    item.rank,
    item.duration,
    item.weight,
    item.ca,
    item.mods,
    item.cosmos,
    item.focus,
    item.skill,
    item.category,
    flattenDetailSearchValue(item.officialData),
    flattenDetailSearchValue(item.contentBlocks),
    flattenDetailSearchValue(item.details),
    ...(item.tags || []),
  ].filter((value) => value !== undefined && value !== null && value !== "").join(" "));
  if (item && typeof item === "object") itemSearchCache.set(item, result);
  return result;
}

function flattenDetailSearchValue(value) {
  if (Array.isArray(value)) return value.map(flattenDetailSearchValue).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenDetailSearchValue).join(" ");
  return value === undefined || value === null ? "" : String(value);
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function mergeCatalogByName(primary = [], fallback = []) {
  const entries = [];
  const names = new Set();
  [...(primary || []), ...(fallback || [])].forEach((entry) => {
    const key = normalizeSearch(entry?.name || entry?.id || "");
    if (!key || names.has(key)) return;
    names.add(key);
    entries.push(entry);
  });
  return entries;
}

function saveCurrent() {
  readForm();
  syncDomainSnapshotFromLegacy();
  const now = new Date().toISOString();
  state.current.updatedAt = now;
  const index = state.saved.findIndex((character) => character.id === state.current.id);
  const payload = structuredCloneSafe(state.current);

  if (index >= 0) state.saved[index] = payload;
  else state.saved.unshift(payload);

  persistSaved();
  renderSavedList();
  renderSummary();
  showToast("Ficha salva no arquivo local.");
}

function newCharacter() {
  state.current = emptyCharacter();
  state.openCubeUid = "";
  renderForm();
  renderSavedList();
  switchView("personagens");
  showToast("Nova ficha pronta.");
}

function loadCharacter(id) {
  const character = state.saved.find((item) => item.id === id);
  if (!character) return;
  state.current = normalizeCharacter(character);
  state.openCubeUid = "";
  renderForm();
  renderSavedList();
  switchView("personagens");
}

function handleSavedAction(action, id) {
  if (action === "load") {
    loadCharacter(id);
    return;
  }

  if (action === "duplicate") {
    const character = state.saved.find((item) => item.id === id);
    if (!character) return;
    state.current = {
      ...normalizeCharacter(character),
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: `${character.name || "Personagem"} cópia`,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    state.openCubeUid = "";
    renderForm();
    switchView("personagens");
    showToast("Ficha duplicada.");
    return;
  }

  if (action === "delete") {
    state.saved = state.saved.filter((item) => item.id !== id);
    if (state.current.id === id) {
      state.current = emptyCharacter();
      state.openCubeUid = "";
    }
    persistSaved();
    renderForm();
    renderSavedList();
    showToast("Ficha excluída.");
  }
}

function exportCurrent() {
  readForm();
  syncDomainSnapshotFromLegacy();
  const data = JSON.stringify(state.current, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = (state.current.name || "personagem-solaris")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
  link.href = url;
  link.download = `${safeName || "personagem-solaris"}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Ficha exportada em JSON.");
}

async function importCharacter(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    state.current = normalizeCharacter({
      ...data,
      id: data.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      updatedAt: null,
    });
    state.openCubeUid = "";
    renderForm();
    renderSavedList();
    switchView("personagens");
    showToast("Ficha importada.");
  } catch (error) {
    showToast("Arquivo JSON inválido.");
  } finally {
    event.target.value = "";
  }
}

async function setCharacterPhoto(file) {
  const looksLikeImage = file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
  if (!looksLikeImage) {
    showToast("Escolha um arquivo de imagem.");
    return;
  }

  try {
    state.current.photoDataUrl = await imageFileToDataUrl(file);
    state.current.photoName = file.name;
    renderPhotoPreviews();
    showToast("Imagem adicionada à ficha.");
  } catch (error) {
    showToast("Não foi possível carregar essa imagem.");
  }
}

async function setManualItemImage(file) {
  const looksLikeImage = file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
  if (!looksLikeImage) {
    showToast("Escolha um arquivo de imagem.");
    return;
  }

  try {
    state.manualImageDataUrl = await imageFileToDataUrl(file, 720);
    state.manualImageName = file.name;
    renderManualImagePreview();
    showToast("Imagem adicionada ao conteúdo criado.");
  } catch (error) {
    showToast("Não foi possível carregar essa imagem.");
  }
}

function clearManualItemImage() {
  state.manualImageDataUrl = "";
  state.manualImageName = "";
  renderManualImagePreview();
}

async function imageFileToDataUrl(file, maxSide = 900) {
  const rawDataUrl = await readFileAsDataUrl(file);
  if (file.type === "image/svg+xml") return rawDataUrl;

  const image = await loadImage(rawDataUrl);
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.fillStyle = "#111417";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function renderPhotoPreviews() {
  const hasPhoto = Boolean(state.current.photoDataUrl);
  el.photoDropzone.classList.toggle("has-image", hasPhoto);
  el.removePhotoButton.classList.toggle("visible", hasPhoto);
  el.photoPreview.hidden = !hasPhoto;
  el.summaryPortraitImage.hidden = !hasPhoto;
  el.summaryPortraitIcon.hidden = hasPhoto;
  el.launcherPortraitImage.hidden = !hasPhoto;
  el.launcherPortraitIcon.hidden = hasPhoto;

  if (hasPhoto) {
    el.photoPreview.src = state.current.photoDataUrl;
    el.summaryPortraitImage.src = state.current.photoDataUrl;
    el.launcherPortraitImage.src = state.current.photoDataUrl;
  } else {
    el.photoPreview.removeAttribute("src");
    el.summaryPortraitImage.removeAttribute("src");
    el.launcherPortraitImage.removeAttribute("src");
  }
}

function renderManualImagePreview() {
  if (!el.manualImageDropzone) return;
  const hasImage = Boolean(state.manualImageDataUrl);
  el.manualImageDropzone.classList.toggle("has-image", hasImage);
  el.removeManualImageButton.classList.toggle("visible", hasImage);
  el.manualImagePreview.hidden = !hasImage;

  if (hasImage) {
    el.manualImagePreview.src = state.manualImageDataUrl;
  } else {
    el.manualImagePreview.removeAttribute("src");
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.saved = raw ? JSON.parse(raw).map(normalizeCharacter) : [];
    if (raw) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
      } catch {
        // Keep the migrated sheets loaded even if local persistence is blocked.
      }
    }
  } catch (error) {
    state.saved = [];
  }
}

function persistSaved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
}

function loadCustomLibraryContent() {
  try {
    const raw = localStorage.getItem(CUSTOM_LIBRARY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    state.customLibraryContent = CUSTOM_LIBRARY_VIEWS.reduce((content, view) => {
      content[view] = Array.isArray(parsed?.[view]) ? parsed[view] : [];
      return content;
    }, {});
  } catch {
    state.customLibraryContent = emptyCustomLibraryContent();
  }
}

function persistCustomLibraryContent() {
  localStorage.setItem(CUSTOM_LIBRARY_STORAGE_KEY, JSON.stringify(state.customLibraryContent));
}

function loadShopPriceOverrides() {
  try {
    const raw = localStorage.getItem(SHOP_PRICE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    state.shopPriceOverrides = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    state.shopPriceOverrides = {};
  }
}

function persistShopPriceOverrides() {
  localStorage.setItem(SHOP_PRICE_STORAGE_KEY, JSON.stringify(state.shopPriceOverrides));
}

function loadMonsterSheets() {
  try {
    const raw = localStorage.getItem(MONSTER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    state.monsterSheets = parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    state.monsterSheets = {};
  }
}

function persistMonsterSheets() {
  localStorage.setItem(MONSTER_STORAGE_KEY, JSON.stringify(state.monsterSheets));
}

function loadMonsterSession() {
  try {
    const raw = localStorage.getItem(MONSTER_SESSION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    state.monsterSession = Array.isArray(parsed) ? parsed.map((sheet) => MonsterSheet.fromJSON(sheet)) : [];
  } catch {
    state.monsterSession = [];
  }
}

function persistMonsterSession() {
  localStorage.setItem(MONSTER_SESSION_STORAGE_KEY, JSON.stringify(state.monsterSession.map((sheet) => sheet.toJSON())));
}

function splitMonsterText(value) {
  return String(value || "")
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function monsterDetailLines(record = {}) {
  return (record.details || [])
    .flatMap((group) => Array.isArray(group?.items) ? group.items : [])
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
}

function monsterDiceExpressions(value) {
  return [...String(value || "").matchAll(/(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?/gi)].map((match) => ({
    count: clamp(numberValue(match[1] || 1, 1), 1, 20),
    sides: clamp(numberValue(match[2], 6), 2, 100),
    bonus: match[3] ? numberValue(`${match[3]}${match[4]}`, 0) : 0,
  }));
}

function monsterDamageFormula(value) {
  const expressions = monsterDiceExpressions(value);
  return expressions.map((expression) => (
    `${expression.count}d${expression.sides}${expression.bonus ? formatMod(expression.bonus) : ""}`
  )).join(" + ");
}

function parseMonsterAttackEntry(value) {
  const text = String(value || "").replace(/\.$/, "").trim();
  if (!text || /^ataques?$/i.test(text)) return null;
  const colonMatch = text.match(/^([^:]+):\s*(.+)$/);
  const commaMatch = text.match(/^(.+?),\s*((?:\d*)d\d+.*|sem dano.*)$/i);
  const match = colonMatch || commaMatch;
  if (match) {
    return {
      name: match[1].trim(),
      damage: match[2].trim(),
      description: text,
    };
  }
  return { name: text, damage: "", description: text };
}

function extractMonsterAttacks(record = {}) {
  const lines = monsterDetailLines(record);
  const attacks = [];
  let readingAttacks = false;
  let latestAttack = null;
  const appendAttackText = (value) => {
    String(value || "").split(";").map(parseMonsterAttackEntry).filter(Boolean).forEach((attack) => {
      attacks.push(attack);
      latestAttack = attack;
    });
  };

  lines.forEach((line) => {
    const header = line.match(/^Ataques?\s*:\s*(.*)$/i);
    if (header) {
      readingAttacks = true;
      appendAttackText(header[1]);
      return;
    }
    if (!readingAttacks) return;
    const damage = line.match(/^Dano\s*:\s*(.+)$/i);
    if (damage && latestAttack) {
      latestAttack.damage = damage[1].replace(/\.$/, "").trim();
      latestAttack.description = `${latestAttack.name}: ${latestAttack.damage}`;
      return;
    }
    if (/^(?:Habilidades?|Habilidade\s*[—-]|Ações?|Reações?|Resistências?|Fraquezas?|Sentidos?|Moral|Recursos?|Uso em campanha)\b/i.test(line)) {
      readingAttacks = false;
      return;
    }
    appendAttackText(line);
  });

  if (!attacks.length) {
    splitMonsterText(record.attacks)
      .flatMap((line) => line.replace(/^Ataques?\s*:\s*/i, "").split(";"))
      .map(parseMonsterAttackEntry)
      .filter(Boolean)
      .forEach((attack) => attacks.push(attack));
  }

  return attacks.filter((attack, index, list) => (
    list.findIndex((candidate) => normalizeSearch(`${candidate.name}|${candidate.damage}`) === normalizeSearch(`${attack.name}|${attack.damage}`)) === index
  ));
}

function extractMonsterAbilities(record = {}) {
  const lines = monsterDetailLines(record);
  const abilities = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    current.description = current.description.trim();
    current.damage = monsterDamageFormula(current.description);
    abilities.push(current);
    current = null;
  };

  lines.forEach((line) => {
    const heading = line.match(/^(Habilidade|Ação(?: de chefe)?|Reação|Fase)\s*[—-]\s*([^:]+)\s*:?\s*(.*)$/i);
    if (heading) {
      flush();
      current = {
        name: heading[2].trim(),
        source: heading[1].trim(),
        description: heading[3].trim(),
        damage: "",
      };
      return;
    }
    if (current && /^(?:Resistências?|Fraquezas?|Sentidos?|Moral|Recursos?|Uso em campanha|Condições?)\s*:/i.test(line)) {
      flush();
      return;
    }
    if (current) current.description += `${current.description ? " " : ""}${line}`;
  });
  flush();

  if (!abilities.length) {
    splitMonsterText(record.abilities).forEach((line) => {
      const heading = line.match(/^(?:Habilidade|Ação(?: de chefe)?|Reação|Fase)\s*[—-]\s*([^:]+)\s*:?\s*(.*)$/i);
      if (heading) {
        abilities.push({
          name: heading[1].trim(),
          description: heading[2].trim(),
          damage: monsterDamageFormula(heading[2]),
        });
      } else if (!/^Habilidades?\s*:?\s*$/i.test(line)) {
        abilities.push({ name: line, description: "", damage: monsterDamageFormula(line) });
      }
    });
  }
  return abilities;
}

function extractMonsterAttributes(record = {}) {
  const text = [record.attributes, ...monsterDetailLines(record)].join(" ");
  const attributes = {};
  for (const match of text.matchAll(/\b(FOR|REF|CON|MEN|PRE|INT)\s*(\d+)\s*\/\s*MOD\s*([+-]?\d+)/gi)) {
    attributes[match[1].toUpperCase()] = {
      value: numberValue(match[2], ATTRIBUTE_BASE),
      modifier: numberValue(match[3], 0),
    };
  }
  return Object.keys(attributes).length ? attributes : (typeof record.attributes === "object" ? record.attributes : { resumo: record.attributes || "" });
}

function monsterDefinitionFromRecord(record) {
  const assetAttacks = (record.assets || [])
    .filter((asset) => asset.category === "weapon")
    .map((asset) => ({ name: asset.name, description: asset.summary, ...structuredCloneSafe(asset.snapshot || {}) }));
  const assetAbilities = (record.assets || [])
    .filter((asset) => asset.category !== "weapon")
    .map((asset) => ({ name: asset.name, description: asset.summary, source: monsterAssetCategoryLabel(asset.category) }));
  return new MonsterDefinition({
    id: record.id,
    name: record.name,
    tier: record.tier || record.rank,
    rank: record.rank || record.tier,
    type: record.type || record.role,
    description: record.description || record.summary || record.behavior,
    image: record.imageDataUrl || record.image || "",
    attributes: extractMonsterAttributes(record),
    maxPV: Math.max(1, numberValue(record.pv, parseFirstNumber(record.pv) || 1)),
    ca: Math.max(0, numberValue(record.ca, parseFirstNumber(record.ca))),
    movement: record.movement || "",
    maxCosmos: Math.max(0, numberValue(record.cosmos, parseFirstNumber(record.cosmos))),
    maxStress: Math.max(0, numberValue(record.maxStress, parseFirstNumber(record.stress))),
    attacks: [...extractMonsterAttacks(record), ...assetAttacks],
    abilities: [...extractMonsterAbilities(record), ...assetAbilities],
    rachadurasMax: Math.max(1, numberValue(record.rachadurasMax, parseFirstNumber(record.cracks) || ITEM_CRACK_MAX)),
    quickRolls: splitMonsterText(record.quickRolls),
    metadata: structuredCloneSafe(record),
    sourceReference: { origin: record.source || "Biblioteca de monstros Solaris" },
  });
}

function addMonsterToSession(monsterId, { openEditor = false } = {}) {
  const record = findMonsterSheet(monsterId);
  if (!record) return;
  const sheet = new MonsterSheet({
    definition: monsterDefinitionFromRecord(record),
    gmNotes: record.gmNotes || "",
  });
  state.monsterSession.unshift(sheet);
  persistMonsterSession();
  renderMonsterSessionPanel();
  if (openEditor && !record.official) openMonsterEditor(monsterId);
  showToast(`${record.name} adicionado à sessão.`);
}

function renderMonsterSessionPanel() {
  if (!el.monsterSessionPanel) return;
  const sheets = state.monsterSession || [];
  const key = "monster-session:active";
  const paginated = paginateItems(sheets, state.pagination[key] || 1);
  state.pagination[key] = paginated.page;
  el.monsterSessionPanel.innerHTML = `
    <div class="monster-session-heading">
      <div>
        <span class="ability-source">Mesa ativa</span>
        <h2>Monstros da sessão</h2>
      </div>
      <strong>${sheets.length}</strong>
    </div>
    ${sheets.length ? `
      <div class="monster-session-grid">
        ${paginated.items.map((sheet) => renderMonsterSessionCard(sheet)).join("")}
      </div>
      <nav class="pagination-controls">${renderPaginationControls(paginated, key)}</nav>
    ` : '<div class="empty-state">Adicione uma criatura do bestiário para usar sua ficha simplificada durante a sessão.</div>'}
  `;
}

function normalizedMonsterAttack(attack) {
  if (typeof attack === "string") return parseMonsterAttackEntry(attack.replace(/^Ataques?\s*:\s*/i, ""));
  if (!attack || typeof attack !== "object") return null;
  return {
    ...attack,
    name: attack.name || "Ataque",
    damage: attack.damage || monsterDamageFormula(attack.description),
    description: attack.description || [attack.name, attack.damage].filter(Boolean).join(": "),
  };
}

function normalizedMonsterAbility(ability) {
  if (typeof ability === "string") {
    const heading = ability.match(/^(?:Habilidade|Ação(?: de chefe)?|Reação|Fase)\s*[—-]\s*([^:]+)\s*:?\s*(.*)$/i);
    const name = heading ? heading[1].trim() : ability;
    const description = heading ? heading[2].trim() : "";
    return { name, description, damage: monsterDamageFormula(description || ability) };
  }
  if (!ability || typeof ability !== "object") return null;
  return {
    ...ability,
    name: ability.name || "Habilidade",
    description: ability.description || ability.effect || "",
    damage: ability.damage || monsterDamageFormula(ability.description || ability.effect),
  };
}

function monsterSessionAttacks(monster) {
  const direct = (monster.attacks || []).map(normalizedMonsterAttack).filter((attack) => attack?.name && !/^ataques?$/i.test(attack.name));
  return direct.length ? direct : extractMonsterAttacks(monster.metadata || {});
}

function monsterSessionAbilities(monster) {
  const direct = (monster.abilities || []).map(normalizedMonsterAbility).filter((ability) => ability?.name && !/^habilidades?$/i.test(ability.name));
  return direct.length ? direct : extractMonsterAbilities(monster.metadata || {});
}

function renderMonsterAttackEntry(monster, attack, index) {
  const damage = attack.damage || monsterDamageFormula(attack.description);
  return `
    <div class="monster-combat-entry">
      <div>
        <strong>${escapeHtml(attack.name)}</strong>
        <span>${escapeHtml(damage || attack.description || "Dano não informado")}</span>
      </div>
      <div class="monster-combat-actions">
        <button class="mini-button" type="button" data-monster-session-action="attack" data-monster-session-id="${escapeHtml(monster.id)}" data-monster-attack-index="${index}">Ataque</button>
        <button class="mini-button" type="button" data-monster-session-action="attack-damage" data-monster-session-id="${escapeHtml(monster.id)}" data-monster-attack-index="${index}" ${monsterDiceExpressions(damage).length ? "" : "disabled"}>Dano</button>
      </div>
    </div>
  `;
}

function renderMonsterAbilityEntry(monster, ability, index) {
  return `
    <div class="monster-combat-entry ability-entry">
      <div>
        <strong>${escapeHtml(ability.name)}</strong>
        <span>${escapeHtml(ability.description || "Efeito não informado.")}</span>
        ${ability.damage ? `<small>Dano: ${escapeHtml(ability.damage)}</small>` : ""}
      </div>
      ${ability.damage ? `
        <div class="monster-combat-actions">
          <button class="mini-button" type="button" data-monster-session-action="ability-damage" data-monster-session-id="${escapeHtml(monster.id)}" data-monster-ability-index="${index}">Rolar dano</button>
        </div>
      ` : ""}
    </div>
  `;
}

function monsterLootResultSummary(result) {
  if (!result?.drops?.length) return "Nenhum recurso recuperado";
  return result.drops
    .map((drop) => `${drop.name}${drop.quantity > 1 ? ` x${drop.quantity}` : ""}`)
    .join(", ");
}

function renderMonsterLootPanel(monster) {
  if (!monster.lootTable?.length && monster.metadata?.resources) {
    monster.lootTable = buildMonsterLootTable(monster.metadata.resources);
  }
  const table = monster.lootTable || [];
  const history = monster.lootHistory || [];
  const latest = history[0];
  const tableMarkup = table.length
    ? table.map((item) => `
        <span class="monster-loot-chance rarity-${dataSlug(item.rarity)}" title="${escapeHtml(item.rarity)}">
          ${escapeHtml(item.name)} <strong>${item.chance}%</strong>
        </span>
      `).join("")
    : '<span class="inventory-note">Sem recursos coletáveis catalogados.</span>';
  const logMarkup = history.length
    ? history.slice(0, 3).map((entry) => `
        <li>
          <time datetime="${escapeHtml(entry.createdAt)}">${escapeHtml(new Date(entry.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))}</time>
          <span>${escapeHtml(monsterLootResultSummary(entry))}</span>
        </li>
      `).join("")
    : '<li class="monster-loot-empty">O resultado aparecerá quando a criatura for derrotada.</li>';
  return `
    <section class="monster-loot-panel" aria-label="Loot de ${escapeHtml(monster.name)}">
      <div class="monster-loot-heading">
        <div>
          <strong>Loot</strong>
          <span>${latest ? escapeHtml(monsterLootResultSummary(latest)) : "Chances por recurso"}</span>
        </div>
        ${monster.currentPV === 0 ? `
          <button class="mini-button" type="button" data-monster-session-action="reroll-loot" data-monster-session-id="${escapeHtml(monster.id)}">
            Rolar novamente
          </button>
        ` : ""}
      </div>
      <div class="monster-loot-table">${tableMarkup}</div>
      <ol class="monster-loot-log" aria-label="Histórico de loot">${logMarkup}</ol>
    </section>
  `;
}

function renderMonsterSessionCard(sheet) {
  const monster = sheet.instance;
  const attacks = monsterSessionAttacks(monster);
  const abilities = monsterSessionAbilities(monster);
  const latestRoll = monster.rollHistory?.[0];
  const conditionMarkup = monster.conditions.length
    ? monster.conditions.map((condition) => `<button class="tag" type="button" title="Clique para remover" data-monster-session-action="remove-condition" data-monster-session-id="${escapeHtml(monster.id)}" data-condition-id="${escapeHtml(condition.id)}">${escapeHtml(condition.label)}</button>`).join("")
    : '<span class="inventory-note">Nenhuma condição</span>';
  return `
    <article class="monster-session-card" data-monster-session-card="${escapeHtml(monster.id)}" data-detail-kind="library" data-detail-view="monstros" data-detail-id="${escapeHtml(sheet.definition.id)}">
      <header>
        ${monster.image ? `<img src="${escapeHtml(monster.image)}" alt="${escapeHtml(monster.name)}" />` : '<span class="monster-session-avatar" aria-hidden="true">M</span>'}
        <div>
          <span class="ability-source">${escapeHtml([monster.tier ? `Tier ${monster.tier}` : "", monster.type].filter(Boolean).join(" - ") || "Criatura")}</span>
          <h3>${renderCardTitleButton(monster.name)}</h3>
          <p>${escapeHtml(monster.description || "Ficha de sessão Solaris.")}</p>
        </div>
      </header>
      <div class="monster-session-stats">
        <div><span>PV</span><strong>${monster.currentPV}/${monster.maxPV}</strong></div>
        <div><span>CA</span><strong>${monster.ca}</strong></div>
        <div><span>MOV.</span><strong>${escapeHtml(monster.movement || "—")}</strong></div>
        <div><span>Cosmos</span><strong>${monster.currentCosmos}/${monster.maxCosmos}</strong></div>
        <div><span>Estresse</span><strong>${monster.stress}/${monster.maxStress}</strong></div>
        <div><span>Rachaduras</span><strong>${monster.rachaduras.current}/${monster.rachaduras.max}</strong></div>
      </div>
      <div class="monster-session-section">
        <strong>Ataques</strong>
        ${attacks.length
          ? `<div class="monster-combat-list">${attacks.map((attack, index) => renderMonsterAttackEntry(monster, attack, index)).join("")}</div>`
          : "<p>Nenhum ataque registrado.</p>"}
      </div>
      <div class="monster-session-section">
        <strong>Habilidades</strong>
        ${abilities.length
          ? `<div class="monster-combat-list">${abilities.map((ability, index) => renderMonsterAbilityEntry(monster, ability, index)).join("")}</div>`
          : "<p>Nenhuma habilidade registrada.</p>"}
      </div>
      <div class="tag-row monster-condition-row">${conditionMarkup}</div>
      ${renderMonsterLootPanel(monster)}
      <label class="monster-notes-field">
        Notas do mestre
        <textarea rows="2" data-monster-session-notes="${escapeHtml(monster.id)}">${escapeHtml(sheet.gmNotes || "")}</textarea>
      </label>
      ${latestRoll ? `<p class="monster-last-roll"><strong>Última rolagem:</strong> ${escapeHtml(latestRoll.label || latestRoll.formula)} = ${escapeHtml(latestRoll.total)}</p>` : ""}
      <div class="monster-session-actions">
        <button class="mini-button" type="button" data-monster-session-action="damage" data-monster-session-id="${escapeHtml(monster.id)}">Receber dano</button>
        <button class="mini-button danger-mini-button" type="button" data-monster-session-action="defeat" data-monster-session-id="${escapeHtml(monster.id)}">Derrotar</button>
        <button class="mini-button" type="button" data-monster-session-action="heal" data-monster-session-id="${escapeHtml(monster.id)}">Curar</button>
        <button class="mini-button" type="button" data-monster-session-action="condition" data-monster-session-id="${escapeHtml(monster.id)}">Aplicar condição</button>
        <button class="mini-button" type="button" data-monster-session-action="save-notes" data-monster-session-id="${escapeHtml(monster.id)}">Salvar notas</button>
        <button class="mini-button danger-mini-button" type="button" data-monster-session-action="delete" data-monster-session-id="${escapeHtml(monster.id)}">Excluir monstro</button>
      </div>
    </article>
  `;
}

function findMonsterSessionSheet(instanceId) {
  return (state.monsterSession || []).find((sheet) => sheet.instance.id === instanceId) || null;
}

function monsterAttackAttributeKey(attack = {}) {
  const text = normalizeSearch([attack.name, attack.damage, attack.description].filter(Boolean).join(" "));
  if (/\b(cosmico|cosmica|mental|psiquico|ressonante|magia)\b/.test(text)) return "MEN";
  if (/\b(pistola|revolver|rifle|fuzil|disparo|tiro|projetil|arco|besta|lancador)\b/.test(text)) return "REF";
  return "FOR";
}

function monsterAttributeModifier(monster, attribute) {
  const value = monster.attributes?.[attribute];
  if (value && typeof value === "object") return numberValue(value.modifier, attributeModifier(value.value));
  if (Number.isFinite(value)) return attributeModifier(value);
  return 0;
}

function rollMonsterDamageFormula(monster, label, value) {
  if (!ensureDiceRollAllowed()) return;
  const expressions = monsterDiceExpressions(value);
  if (!expressions.length) {
    showToast("Este ataque ou habilidade não possui dano em dados.", "tech-error");
    return;
  }
  const allRolls = [];
  let total = 0;
  expressions.forEach((expression) => {
    const pool = rollDicePool(expression.count, expression.sides);
    allRolls.push(...pool.rolls);
    total += pool.raw + expression.bonus;
  });
  const formula = expressions.map((expression) => (
    `${expression.count}d${expression.sides}${expression.bonus ? formatMod(expression.bonus) : ""}`
  )).join(" + ");
  monster.recordRoll({ label, formula, rolls: allRolls, total });
  persistMonsterSession();
  renderMonsterSessionPanel();
  showHolographicDiceOverlay({
    label,
    sides: expressions[0].sides,
    rolls: allRolls,
    total,
    formula,
  });
}

function handleMonsterSessionAction(action, instanceId, actionElement = null) {
  const sheet = findMonsterSessionSheet(instanceId);
  if (!sheet) return;
  const monster = sheet.instance;
  if (action === "attack") {
    if (!ensureDiceRollAllowed()) return;
    const attacks = monsterSessionAttacks(monster);
    const attackIndex = Math.max(0, numberValue(actionElement?.dataset.monsterAttackIndex, 0));
    const attack = attacks[attackIndex] || attacks[0];
    if (!attack) {
      showToast("Este monstro não possui ataque registrado.", "tech-error");
      return;
    }
    const attribute = monsterAttackAttributeKey(attack);
    const bonus = monsterAttributeModifier(monster, attribute);
    const rolls = rollDicePool(1, 20);
    const total = rolls.raw + bonus;
    const formula = `1d20${bonus ? formatMod(bonus) : ""}`;
    monster.recordRoll({
      label: `${attack.name} - ataque`,
      formula,
      rolls: rolls.rolls,
      total,
    });
    persistMonsterSession();
    renderMonsterSessionPanel();
    showHolographicDiceOverlay({ label: `${attack.name} - ataque (${attribute})`, sides: 20, rolls: rolls.rolls, total, formula });
    return;
  }
  if (action === "attack-damage") {
    const attacks = monsterSessionAttacks(monster);
    const attackIndex = Math.max(0, numberValue(actionElement?.dataset.monsterAttackIndex, 0));
    const attack = attacks[attackIndex] || attacks[0];
    if (!attack) return;
    rollMonsterDamageFormula(monster, `${attack.name} - dano`, attack.damage || attack.description);
    return;
  }
  if (action === "ability-damage") {
    const abilities = monsterSessionAbilities(monster);
    const abilityIndex = Math.max(0, numberValue(actionElement?.dataset.monsterAbilityIndex, 0));
    const ability = abilities[abilityIndex] || abilities[0];
    if (!ability) return;
    rollMonsterDamageFormula(monster, `${ability.name} - dano`, ability.damage || ability.description);
    return;
  }
  if (action === "reroll-loot") {
    if (monster.currentPV > 0) {
      showToast("O loot só pode ser rolado depois que a criatura for derrotada.", "tech-error");
      return;
    }
    const result = monster.generateLoot({ reason: "nova rolagem" });
    persistMonsterSession();
    renderMonsterSessionPanel();
    showToast(`Novo loot de ${monster.name}: ${monsterLootResultSummary(result)}.`);
    return;
  }
  if (action === "defeat") {
    const previousLootCount = monster.lootHistory?.length || 0;
    if (monster.currentPV > 0) monster.receiveDamage(monster.currentPV);
    else if (!monster.lootGeneratedForDefeat) monster.markDefeated();
    const result = monster.lootHistory?.length > previousLootCount ? monster.lootHistory[0] : null;
    persistMonsterSession();
    renderMonsterSessionPanel();
    showToast(result
      ? `${monster.name} derrotado. Loot: ${monsterLootResultSummary(result)}.`
      : `${monster.name} já estava derrotado.`);
    return;
  }
  if (["damage", "heal"].includes(action)) {
    const requested = window.prompt(action === "damage" ? `Quanto dano ${monster.name} recebe?` : `Quantos PV ${monster.name} recupera?`, "1");
    if (requested === null) return;
    const amount = Math.max(0, numberValue(requested, 0));
    if (action === "damage") {
      const previousPV = monster.currentPV;
      const previousLootCount = monster.lootHistory?.length || 0;
      monster.receiveDamage(amount);
      if (previousPV > 0 && monster.currentPV === 0 && monster.lootHistory.length > previousLootCount) {
        showToast(`${monster.name} derrotado. Loot: ${monsterLootResultSummary(monster.lootHistory[0])}.`);
      }
    } else monster.heal(amount);
  } else if (action === "condition") {
    const label = window.prompt(`Qual condição aplicar em ${monster.name}?`, "");
    if (!label?.trim()) return;
    monster.applyCondition({ label: label.trim(), key: dataSlug(label), description: "Condição aplicada durante a sessão." });
  } else if (action === "remove-condition") {
    const conditionId = actionElement?.dataset.conditionId;
    if (conditionId) monster.removeCondition(conditionId);
  } else if (action === "save-notes") {
    const card = actionElement?.closest("[data-monster-session-card]");
    sheet.gmNotes = card?.querySelector("[data-monster-session-notes]")?.value || "";
    monster.notes = sheet.gmNotes;
    showToast("Notas do mestre salvas.");
  } else if (action === "delete") {
    if (!window.confirm(`Excluir ${monster.name} da sessão? Esta ação não devolve Luzentis.`)) return;
    state.monsterSession = state.monsterSession.filter((entry) => entry.instance.id !== instanceId);
  }
  persistMonsterSession();
  renderMonsterSessionPanel();
}

function deleteMonsterSheetById(monsterId) {
  const monster = state.monsterSheets[monsterId];
  if (!monster) return;
  if (!window.confirm(`Excluir ${monster.name}? Esta ação não devolve Luzentis.`)) return;
  delete state.monsterSheets[monsterId];
  state.monsterSession = state.monsterSession.filter((sheet) => sheet.definition.id !== monsterId);
  persistMonsterSheets();
  persistMonsterSession();
  renderLibrary();
  showToast(`${monster.name} excluído.`);
}

function openMonsterEditor(monsterId = "") {
  const monster = monsterId ? findMonsterSheet(monsterId) : null;
  state.activeMonsterId = monsterId;
  const sheetType = monster?.sheetType || "full";
  el.monsterSheetType.value = sheetType;
  el.monsterEditorTitle.textContent = monster ? `Editar ${monster.name}` : "Criar criatura";
  el.deleteMonsterButton.hidden = !monsterId || !state.monsterSheets[monsterId];
  el.deleteMonsterButton.textContent = monster?.official ? "Restaurar ficha oficial" : "Excluir ficha";
  renderMonsterEditorFields(monster || {}, sheetType);
  el.monsterEditorModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeMonsterEditor() {
  el.monsterEditorModal.hidden = true;
  state.activeMonsterId = "";
  syncModalOpenState();
}

function openMonsterImageDialog(monsterId) {
  const monster = findMonsterSheet(monsterId);
  if (!monster) return;
  state.activeMonsterImageId = monsterId;
  el.monsterImageTitle.textContent = `Imagem de ${monster.name}`;
  renderMonsterImagePreview(monster);
  el.monsterImageModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeMonsterImageDialog() {
  state.activeMonsterImageId = "";
  el.monsterImageModal.hidden = true;
  syncModalOpenState();
}

function renderMonsterImagePreview(monster = findMonsterSheet(state.activeMonsterImageId)) {
  const image = monster?.imageDataUrl || monster?.image || "";
  const hasImage = Boolean(image);
  el.monsterImageDropzone.classList.toggle("has-image", hasImage);
  el.removeMonsterImageButton.classList.toggle("visible", hasImage);
  el.monsterImagePreview.hidden = !hasImage;
  if (hasImage) {
    el.monsterImagePreview.src = image;
    el.monsterImagePreview.alt = monster?.name ? `Imagem de ${monster.name}` : "Imagem da criatura";
  } else {
    el.monsterImagePreview.removeAttribute("src");
    el.monsterImagePreview.alt = "";
  }
}

function syncMonsterImageToSession(monsterId, image) {
  (state.monsterSession || []).forEach((sheet) => {
    if (sheet.definition.id !== monsterId) return;
    sheet.definition.image = image;
    sheet.instance.image = image;
  });
  persistMonsterSession();
  renderMonsterSessionPanel();
}

async function setMonsterImage(file) {
  const monsterId = state.activeMonsterImageId;
  const current = findMonsterSheet(monsterId);
  if (!monsterId || !current) return;
  const looksLikeImage = file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
  if (!looksLikeImage) {
    showToast("Escolha um arquivo de imagem.", "tech-error");
    return;
  }

  try {
    const imageDataUrl = await imageFileToDataUrl(file, 720);
    const monster = ensureEditableMonster(monsterId);
    monster.imageDataUrl = imageDataUrl;
    monster.imageName = file.name;
    monster.updatedAt = new Date().toISOString();
    state.monsterSheets[monster.id] = monster;
    persistMonsterSheets();
    syncMonsterImageToSession(monsterId, imageDataUrl);
    renderMonsterImagePreview(monster);
    renderLibrary();
    showToast(`Imagem de ${monster.name} salva no bestiário.`);
  } catch {
    showToast("Não foi possível salvar essa imagem.", "tech-error");
  }
}

function removeMonsterImage() {
  const monsterId = state.activeMonsterImageId;
  const monster = ensureEditableMonster(monsterId);
  if (!monster) return;
  monster.imageDataUrl = "";
  monster.imageName = "";
  monster.image = "";
  monster.updatedAt = new Date().toISOString();
  state.monsterSheets[monster.id] = monster;
  persistMonsterSheets();
  syncMonsterImageToSession(monsterId, "");
  renderMonsterImagePreview(monster);
  renderLibrary();
  showToast(`Imagem de ${monster.name} removida.`);
}

function renderMonsterEditorFields(monster = {}, sheetType = "full") {
  const template = monsterSheetTemplates[sheetType] || monsterSheetTemplates.full;
  el.monsterEditorFields.innerHTML = `
    <div class="record-template-note">
      <strong>${escapeHtml(template.label)}</strong>
      <span>${escapeHtml(template.source)}</span>
      ${monster.needsCoreStats ? "<small>O Livro 3 não informa Tier, PV e CA desta ficha de chefe. Preencha conforme a sua campanha.</small>" : ""}
    </div>
    ${template.fields.map(([id, label, type]) => renderMonsterEditorField(id, label, type, monster[id])).join("")}
  `;
}

function renderMonsterEditorField(id, label, type, value) {
  const wide = type === "textarea" ? "wide-field" : "";
  if (type === "textarea") {
    return `
      <label class="${wide}">
        ${escapeHtml(label)}
        <textarea rows="4" data-monster-field="${escapeHtml(id)}">${escapeHtml(value || "")}</textarea>
      </label>
    `;
  }
  return `
    <label class="${wide}">
      ${escapeHtml(label)}
      <input type="${type}" ${type === "number" ? 'min="0" step="1"' : ""} data-monster-field="${escapeHtml(id)}" value="${escapeHtml(value ?? "")}" />
    </label>
  `;
}

function saveMonsterSheet(event) {
  event.preventDefault();
  const fields = [...el.monsterEditorFields.querySelectorAll("[data-monster-field]")].reduce((result, input) => {
    const key = input.dataset.monsterField;
    result[key] = input.type === "number"
      ? (input.value === "" ? null : Math.max(0, numberValue(input.value, 0)))
      : input.value.trim();
    return result;
  }, {});
  if (!fields.name) {
    showToast("Informe o nome da criatura.");
    return;
  }
  const current = state.activeMonsterId ? findMonsterSheet(state.activeMonsterId) : null;
  const id = state.activeMonsterId || `custom-monster-${dataSlug(fields.name)}-${Date.now()}`;
  const sheetType = el.monsterSheetType.value;
  const record = {
    ...(current || {}),
    ...fields,
    id,
    category: "monster",
    sheetType,
    summary: fields.behavior || fields.campaign || fields.abilities || current?.summary || "Criatura criada manualmente.",
    tags: uniqueTags([fields.tier, fields.type, fields.role, sheetType === "boss" ? "Chefe" : "", "ficha personalizada"].filter(Boolean)),
    assets: current?.assets || [],
    officialSourceId: current?.official ? current.id : current?.officialSourceId || "",
    source: current?.source || monsterSheetTemplates[sheetType].source,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    createdAt: current?.createdAt || new Date().toISOString(),
    needsCoreStats: false,
  };
  state.monsterSheets[id] = record;
  persistMonsterSheets();
  closeMonsterEditor();
  renderLibrary();
  showToast(`${record.name} salvo no bestiário pessoal.`);
}

function deleteActiveMonsterSheet() {
  const id = state.activeMonsterId;
  if (!id || !state.monsterSheets[id]) return;
  const wasOfficial = monsterData.some((monster) => monster.id === id);
  const target = state.monsterSheets[id];
  if (!window.confirm(wasOfficial ? `Restaurar a ficha oficial de ${target.name}?` : `Excluir ${target.name}? Esta ação não devolve Luzentis.`)) return;
  delete state.monsterSheets[id];
  state.monsterSession = state.monsterSession.filter((sheet) => sheet.definition.id !== id);
  persistMonsterSheets();
  persistMonsterSession();
  closeMonsterEditor();
  renderLibrary();
  showToast(wasOfficial ? "Ficha oficial restaurada." : "Ficha de criatura excluída.");
}

function openMonsterAssets(monsterId) {
  const monster = findMonsterSheet(monsterId);
  if (!monster) return;
  state.activeMonsterId = monsterId;
  state.activeMonsterAssetCategory = el.monsterAssetCategory.value || "weapon";
  el.monsterAssetsTitle.textContent = `Conteúdo de ${monster.name}`;
  el.monsterAssetSearch.value = "";
  el.monsterAssetsModal.hidden = false;
  document.body.classList.add("modal-open");
  renderMonsterAssetManager();
}

function closeMonsterAssets() {
  el.monsterAssetsModal.hidden = true;
  state.activeMonsterId = "";
  syncModalOpenState();
}

function syncModalOpenState() {
  const anyOpen = [
    el.vitalHudModal,
    el.monsterEditorModal,
    el.monsterImageModal,
    el.monsterAssetsModal,
    el.inventoryLocationModal,
    el.levelUpModal,
    el.universalDetailModal,
  ].some((modal) => modal && !modal.hidden);
  document.body.classList.toggle("modal-open", anyOpen);
}

function renderMonsterAssetManager() {
  const monster = findMonsterSheet(state.activeMonsterId);
  if (!monster) return;
  const category = el.monsterAssetCategory.value || state.activeMonsterAssetCategory;
  const query = normalizeSearch(el.monsterAssetSearch.value);
  const attachedIds = new Set((monster.assets || []).map((asset) => `${asset.category}:${asset.id}`));
  const assets = getMonsterAssetCatalog(category).filter((asset) => itemSearchText(asset).includes(query));
  const key = `monster-assets:${category}:${monster.id}`;
  const paginated = paginateItems(assets, state.pagination[key] || 1);
  state.pagination[key] = paginated.page;
  el.monsterAssetGrid.innerHTML = assets.length ? paginated.items.map((asset) => {
    const attached = attachedIds.has(`${category}:${asset.id}`);
    return `
      <article class="asset-manager-card ${attached ? "attached" : ""}">
        <div>
          <span>${escapeHtml(monsterAssetCategoryLabel(category))}</span>
          <h3>${escapeHtml(asset.name)}</h3>
          <p>${escapeHtml(asset.summary || asset.effect || "Sem descrição.")}</p>
        </div>
        <button class="${attached ? "ghost-button" : "primary-button"}" type="button" data-monster-asset-toggle="${escapeHtml(asset.id)}" data-asset-category="${escapeHtml(category)}">
          ${attached ? "Remover" : "Adicionar"}
        </button>
      </article>
    `;
  }).join("") + `<nav class="pagination-controls">${renderPaginationControls(paginated, key)}</nav>` : '<div class="empty-state">Nenhum conteúdo encontrado nesta categoria.</div>';
}

function getMonsterAssetCatalog(category) {
  const customRecords = state.current.customRecords || [];
  if (category === "weapon") {
    return mergeCatalogByName(
      [...weaponData, ...customLibraryItems("armas")],
      (state.current.customItems || []).filter((item) => item.category === "weapon")
    );
  }
  if (category === "cosmos") {
    return mergeCatalogByName(
      [...cosmicSpellData, ...customLibraryItems("magias")],
      (state.current.knownAbilities || [])
        .filter((ability) => ability.source === "Cosmos")
        .map((ability) => ({ ...ability, summary: ability.effect }))
    );
  }
  if (category === "mod") {
    return mergeCatalogByName(
      [...equipmentModData, ...customLibraryItems("mods")],
      customRecords.filter((record) => record.category === "mod")
    );
  }
  return mergeCatalogByName(
    [...modifierChipData, ...customLibraryItems("chipsMod")],
    collectAbilityEntries().map((ability, index) => ({
      ...ability,
      id: ability.id || `character-ability-${index}-${dataSlug(ability.name)}`,
      summary: ability.effect,
    }))
  );
}

function monsterAssetCategoryLabel(category) {
  return {
    weapon: "Arma",
    cosmos: "Magia cósmica",
    ability: "Habilidade",
    mod: "Mod",
  }[category] || "Conteúdo";
}

function toggleMonsterAsset(assetId, category) {
  const monster = ensureEditableMonster(state.activeMonsterId);
  const asset = getMonsterAssetCatalog(category).find((entry) => entry.id === assetId);
  if (!monster || !asset) return;
  monster.assets = monster.assets || [];
  const index = monster.assets.findIndex((entry) => entry.id === assetId && entry.category === category);
  if (index >= 0) {
    monster.assets.splice(index, 1);
  } else {
    monster.assets.push({
      id: asset.id,
      category,
      name: asset.name,
      summary: asset.summary || asset.effect || "",
      source: asset.source || monsterAssetCategoryLabel(category),
      snapshot: structuredCloneSafe(asset),
    });
  }
  monster.updatedAt = new Date().toISOString();
  state.monsterSheets[monster.id] = monster;
  persistMonsterSheets();
  renderMonsterAssetManager();
  renderLibrary();
}

function ensureEditableMonster(id) {
  if (state.monsterSheets[id]) return state.monsterSheets[id];
  const official = monsterData.find((monster) => monster.id === id);
  if (!official) return null;
  state.monsterSheets[id] = {
    ...structuredCloneSafe(official),
    officialSourceId: official.id,
    assets: structuredCloneSafe(official.assets || []),
    schemaVersion: 1,
  };
  return state.monsterSheets[id];
}

function exportActiveMonster() {
  const monster = findMonsterSheet(state.activeMonsterId);
  if (!monster) return;
  const payload = {
    exportType: "solaris-monster",
    schemaVersion: 1,
    foundryReady: true,
    monster,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${dataSlug(monster.name) || "monstro-solaris"}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Ficha de monstro exportada em JSON.");
}

function totalAttributes() {
  const race = findRace(state.current.race);
  const racialBonus = raceEffectiveBonus(race, state.current.racialChoice);
  const passives = modifierPassiveTotals();
  return ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = numberValue(state.current.attributes[attr], ATTRIBUTE_BASE) + (racialBonus[attr] || 0) + (passives.attributes[attr] || 0);
    return acc;
  }, {});
}

function derivedStats(attrs, race, profession) {
  const level = numberValue(state.current.level, 1);
  const passives = modifierPassiveTotals();
  const modFOR = attributeModifier(attrs.FOR);
  const modREF = attributeModifier(attrs.REF);
  const modCON = attributeModifier(attrs.CON);
  const modMEN = attributeModifier(attrs.MEN);
  const equippedArmor = getEquippedMarketItem("armor");
  const equippedArmorEntry = getEquippedInventoryEntry("armor");
  const armorCollapsed = itemCrackLevel(equippedArmorEntry) >= ITEM_CRACK_MAX;
  const armorCa = armorCollapsed ? 0 : equippedArmor?.ca || 0;
  const equipmentCosmosBonus = equippedArmor?.cosmos || 0;
  const officialInitialPv = Math.max(1, 8 + initialLifeBonus(modCON) + numberValue(race.pvBonus, 0));
  const permanentPvBonus = Math.max(0, numberValue(state.current.permanentPvBonus, 0));
  const pvMax = (level === 1
    ? officialInitialPv
    : Math.max(officialInitialPv, 8 * level + Math.max(0, modCON) * level + numberValue(race.pvBonus, 0))) + permanentPvBonus;
  const cosmosMax = Math.max(0, (LEVEL_COSMOS_BASE[level] || 1) + modMEN + equipmentCosmosBonus + (race.cosmos || 0) + passives.cosmosMax + passives.cosmosPerLevel * level);
  const ca = Math.max(1, BASE_CA + modREF + armorCa + passives.ca);
  const baseMovement = Math.max(1, 6 + modREF + (race.movement || 0) + passives.movement);
  const cubeSlots = Math.max(0, 5 + modFOR + (race.cubeBonus || 0) + (profession.cubeBonus || 0) + passives.cubeSlots);
  const passivePerception = 10 + modMEN;
  const stressMax = STRESS_MAX;
  const loadCapacityKg = Math.max(0, numberValue(state.current.bodyWeightKg, 70) / 2 + modFOR * 10);
  const carriedWeightKg = carriedLoadWeightKg();
  const loadRatio = loadCapacityKg > 0 ? carriedWeightKg / loadCapacityKg : carriedWeightKg > 0 ? Number.POSITIVE_INFINITY : 0;
  const movement = loadRatio > 1.5 ? 0 : loadRatio > 1 ? Math.floor(baseMovement / 2) : baseMovement;
  return {
    pvMax,
    cosmosMax,
    ca,
    movement,
    baseMovement,
    cubeSlots,
    passivePerception,
    armorCa,
    equipmentCosmosBonus,
    stressMax,
    loadCapacityKg,
    carriedWeightKg,
    loadRatio,
    passiveBonuses: passives,
  };
}

function initialLifeBonus(modCON) {
  const table = {
    "-2": -2,
    "-1": -1,
    "0": 0,
    "1": 4,
    "2": 6,
    "3": 8,
    "4": 10,
    "5": 12,
  };
  return table[String(clamp(modCON, -2, 5))] ?? 0;
}

function collectAbilityEntries() {
  const race = findRace(state.current.race);
  const profession = findProfession(state.current.profession);
  const currentLevel = numberValue(state.current.level, 1);
  const equippedWeapon = getEquippedMarketItem("weapon");
  const equippedArmor = getEquippedMarketItem("armor");
  const entries = [];

  entries.push({
    name: `${race.name} - habilidade base`,
    source: "Raça",
    effect: race.profile?.baseAbility || race.summary,
    meta: race.name,
  });

  (race.progression || []).forEach((item) => {
    const requiredLevel = numberValue(String(item.level).replace(/\D/g, ""), 0);
    if (requiredLevel && requiredLevel <= currentLevel) {
      entries.push({
        name: item.title,
        source: "Raça",
        effect: item.text,
        meta: item.level,
      });
    }
  });

  [
    ["Foco", profession.focus],
    ["Talento", profession.talent],
    ["Kit", profession.kit],
    ["Penalidade", profession.penalty],
  ].forEach(([name, effect]) => {
    if (!effect) return;
    entries.push({
      name,
      source: "Chip de profissão",
      effect,
      meta: profession.name,
      professionRemovable: profession.id !== "escolha-profissao",
    });
  });

  (state.current.knownAbilities || []).forEach((ability) => entries.push({ ...ability, knownAbility: true }));

  if (equippedWeapon) {
    entries.push({
      name: equippedWeapon.name,
      source: "Arma",
      effect: equippedWeapon.summary || "Arma equipada.",
      meta: marketMeta(equippedWeapon),
    });
  }

  if (equippedArmor) {
    entries.push({
      name: equippedArmor.name,
      source: "Armadura",
      effect: equippedArmor.summary || "Armadura equipada.",
      meta: marketMeta(equippedArmor),
    });
  }

  if (state.current.abilities) {
    entries.push({
      name: "Anotações de habilidades",
      source: "Manual",
      effect: state.current.abilities,
      meta: "Campo Habilidades",
    });
  }

  return entries;
}

function classifyWeapon(weapon) {
  if (!weapon) return { key: "generic", label: "Sem arma", family: "nenhuma" };
  const text = [weapon.name, weapon.type, weapon.kind, weapon.summary, ...(weapon.tags || [])].join(" ").toLowerCase();
  if (/pistola|rev[óo]lver|revolver/.test(text)) return { key: "firearm", label: "Pistola / revólver", family: "pistola" };
  if (/rifle|fuzil|carabina|sniper/.test(text)) return { key: "rifle", label: "Rifle / fuzil", family: "rifle" };
  if (/lan[çc]ador|granada|bazuca|canh[ãa]o/.test(text)) return { key: "launcher", label: "Lançador", family: "lançador" };
  if (/espada|adaga|faca|l[âa]mina/.test(text)) return { key: "blade", label: "Espada / lâmina", family: "espada" };
  if (/machado|foice/.test(text)) return { key: "axe", label: "Machado", family: "machado" };
  if (/lan[çc]a|alabarda|tridente/.test(text)) return { key: "polearm", label: "Lança / haste", family: "lança" };
  if (/martelo|ma[çc]a|bast[ãa]o|clava/.test(text)) return { key: "blunt", label: "Impacto", family: "concussão" };
  if (/manopla|garra|desarmado|punho/.test(text)) return { key: "unarmed", label: "Manoplas / briga", family: "briga" };
  if (/arco|besta/.test(text)) return { key: "rifle", label: "Arco / besta", family: "arco" };
  return { key: "generic", label: "Arma", family: "arma" };
}

function weaponAttackAttribute(group) {
  if (["firearm", "rifle", "launcher"].includes(group.key)) return "REF";
  if (group.family === "arco") return "REF";
  if (group.key === "blade" && /adaga|faca/.test(group.family)) return "REF";
  return "FOR";
}

function parseDiceExpression(value) {
  const match = String(value || "").match(/(\d*)d(\d+)\s*([+-]\s*\d+)?/i);
  if (!match) return null;
  return {
    count: clamp(numberValue(match[1] || 1, 1), 1, 20),
    sides: clamp(numberValue(match[2], 6), 2, 100),
    bonus: match[3] ? numberValue(match[3].replace(/\s+/g, ""), 0) : 0,
  };
}

function findRace(id) {
  return raceData.find((race) => race.id === id) || raceData[0];
}

function findProfession(id) {
  return professionData.find((profession) => profession.id === id) || professionData[0];
}

function customLibraryItems(view) {
  return Array.isArray(state.customLibraryContent?.[view]) ? state.customLibraryContent[view] : [];
}

function resolveShopPrice(item) {
  if (!item) return item;
  if (Number.isFinite(item.price)) return item;
  const override = Number(state.shopPriceOverrides?.[item.id]);
  return {
    ...item,
    price: Number.isFinite(override) ? Math.max(0, override) : item.price,
    priceEditable: true,
  };
}

function findAbilityLibraryItem(id) {
  return [
    ...cosmicSpellData,
    ...modifierChipData,
    ...customLibraryItems("magias"),
    ...customLibraryItems("chipsMod"),
  ].find((item) => item.id === id);
}

function findMarketItem(id) {
  const customItems = state.current?.customItems || [];
  const item = [
    ...storageMarketData,
    ...commonItemData,
    ...weaponData,
    ...armorData,
    ...customLibraryItems("armazenamento"),
    ...customLibraryItems("itens"),
    ...customLibraryItems("armas"),
    ...customLibraryItems("armaduras"),
    ...customItems,
  ].find((entry) => entry.id === id);
  return resolveShopPrice(item);
}

function domainDefinitionForItem(item) {
  const definition = definitionFromLegacyItem(item || {});
  if (item?.category === "cube") {
    definition.maxSlots = Math.max(1, numberValue(item.cubeCapacity, definition.maxSlots || 1));
    definition.cubeKind = item.cubeKind || definition.cubeKind || "simple";
  }
  return definition;
}

function domainEntityTypeLabel(type) {
  const labels = {
    [ENTITY_TYPES.ITEM]: "Item comum",
    [ENTITY_TYPES.WEAPON]: "Arma",
    [ENTITY_TYPES.ARMOR]: "Armadura",
    [ENTITY_TYPES.CUBE]: "Cubo",
    [ENTITY_TYPES.HOOK]: "Gancho",
    [ENTITY_TYPES.HOLSTER]: "Coldre",
    [ENTITY_TYPES.BANDOLIER]: "Bandoleira",
    [ENTITY_TYPES.CHIP_MOD]: "Chip modificador",
    [ENTITY_TYPES.COSMIC_SPELL]: "Magia cósmica",
    [ENTITY_TYPES.CUSTOM_ABILITY]: "Habilidade",
    [ENTITY_TYPES.DRONE]: "Drone",
    [ENTITY_TYPES.ROBOT]: "Robô",
    [ENTITY_TYPES.VEHICLE]: "Veículo",
  };
  return labels[type] || "Entidade";
}

function domainCharacterFromLegacy(character = state.current) {
  const previous = character.domainCharacter
    ? DomainCharacter.fromJSON(character.domainCharacter)
    : null;
  const domain = migrateLegacyCharacterData(
    { ...character, domainCharacter: null },
    (itemId) => findMarketItem(itemId)
  );
  if (previous) {
    domain.knownSpells = previous.knownSpells;
    domain.installedChips = previous.installedChips;
    domain.permanentEffects = previous.permanentEffects;
    domain.temporaryEffects = previous.temporaryEffects;
    domain.conditions = previous.conditions;
    domain.metadata = { ...previous.metadata, ...domain.metadata };
  }
  domain.name = character.name;
  domain.race = character.race;
  domain.level = character.level;
  domain.bodyWeight = character.bodyWeightKg;
  domain.luzentis = character.currency;
  domain.attributes = { ...character.attributes };
  domain.currentPV = character.pvCurrent;
  domain.currentCosmos = character.cosmosCurrent;
  domain.stress = character.stress;
  domain.rollHistory = structuredCloneSafe(character.diceLog || []);
  reconcileDomainInventoryDefinitions(domain);
  return domain;
}

function reconcileDomainInventoryDefinitions(domain) {
  domain.inventory.getAll().forEach((entity) => {
    const item = findMarketItem(entity.definitionId);
    if (!item) return;
    const definition = domainDefinitionForItem(item);
    const template = definition.createInstance({ id: entity.id, location: entity.location });
    entity.weight = template.weight;
    entity.definitionSnapshot = definition.toJSON();
    if (!template.storage) return;
    const previousStorage = entity.storage || {};
    const usesWeightCapacity = template.storage.maxWeight > 0;
    entity.storage = {
      ...template.storage,
      ...previousStorage,
      maxSlots: usesWeightCapacity
        ? template.storage.maxSlots
        : Math.max(template.storage.maxSlots, numberValue(previousStorage.maxSlots, 0)),
      maxWeight: template.storage.maxWeight,
      allowedSizes: [...(template.storage.allowedSizes || [])],
      storedEntityIds: [...new Set(previousStorage.storedEntityIds || [])],
    };
  });
}

function syncDomainCharacterToLegacy(domain, character = state.current) {
  const previousEntries = new Map((character.inventory || []).map((entry) => [entry.uid, entry]));
  character.currency = domain.luzentis;
  character.inventory = domain.inventory.getAll().map((entity) => {
    const previous = previousEntries.get(entity.id) || entity.customData?.legacyEntry || {};
    const location = entity.location || { kind: LOCATION_KINDS.UNASSIGNED };
    const supportSlot = location.kind === LOCATION_KINDS.HOOK
      ? "gancho"
      : location.kind === LOCATION_KINDS.HOLSTER
        ? "coldre"
        : location.kind === LOCATION_KINDS.BANDOLIER
          ? "bandoleira"
          : "";
    return {
      ...previous,
      uid: entity.id,
      itemId: entity.definitionId || previous.itemId,
      category: previous.category || entity.definitionSnapshot?.metadata?.category || entity.entityType,
      inCube: location.kind === LOCATION_KINDS.CUBE && location.containerId === "legacy-cube",
      cubeUid: location.kind === LOCATION_KINDS.CUBE && location.containerId !== "legacy-cube"
        ? location.containerId
        : "",
      supportSlot,
      location: { ...location },
      crackLevel: entity.rachaduras.current,
      crackMax: entity.rachaduras.max,
      cubeCapacity: entity.storage?.maxSlots ?? previous.cubeCapacity,
      cubeKind: entity.definitionSnapshot?.cubeKind || previous.cubeKind,
      domainEntityType: entity.entityType,
      domainEntity: entity.toJSON(),
    };
  });
  character.equippedWeaponUid = domain.loadout.mainWeapon || domain.loadout.secondaryWeapon || "";
  character.equippedArmorUid = domain.loadout.armor || "";
  character.weapon = getMarketItemByInventoryUid(character.equippedWeaponUid)?.name || "";
  character.armor = getMarketItemByInventoryUid(character.equippedArmorUid)?.name || "";
  character.domainCharacter = domain.toJSON();
  return character;
}

function syncDomainSnapshotFromLegacy({ autoSave = false } = {}) {
  const domain = domainCharacterFromLegacy();
  syncDomainCharacterToLegacy(domain);
  if (autoSave) persistCurrentCharacterSilently();
  return domain;
}

function persistCurrentCharacterSilently() {
  state.current.updatedAt = new Date().toISOString();
  const index = state.saved.findIndex((character) => character.id === state.current.id);
  const payload = structuredCloneSafe(state.current);
  if (index >= 0) state.saved[index] = payload;
  else state.saved.unshift(payload);
  persistSaved();
  renderSavedList();
}

function levelUpChoiceOptions(benefit) {
  if (benefit.choice === "skill") {
    return skillData
      .filter((skill) => state.current.skillTraining?.[skill.name] !== "trained")
      .map((skill) => ({ value: skill.name, label: skill.name }));
  }
  if (benefit.choice === "technology-or-pre") {
    return [
      { value: "Tecnologia", label: "Tecnologia" },
      { value: "PRE", label: "PRE" },
    ];
  }
  if (benefit.choice === "pilot-or-fight") {
    return [
      { value: "Pilotagem", label: "Pilotagem" },
      { value: "Briga", label: "Briga" },
    ];
  }
  if (benefit.choice === "protection") {
    return ["JPF", "JPR", "JPC"].map((value) => ({ value, label: value }));
  }
  if (benefit.choice === "craft") {
    return ["Armas", "Armaduras", "Mods"].map((value) => ({ value, label: value }));
  }
  return [];
}

function renderLevelUpDialog() {
  const currentLevel = clamp(numberValue(state.current.level, 1), 1, 10);
  const targetLevel = currentLevel + 1;
  if (targetLevel > 10) {
    el.levelUpContent.innerHTML = '<div class="empty-state">Este personagem já alcançou o nível máximo.</div>';
    el.confirmLevelUp.hidden = true;
    return;
  }

  const requirement = LEVEL_UP_REQUIREMENTS[targetLevel];
  const cost = 500 * targetLevel;
  const pending = state.pendingLevelUp;
  const choiceOptions = pending ? levelUpChoiceOptions(pending.benefit) : [];
  el.confirmLevelUp.hidden = false;
  el.confirmLevelUp.textContent = pending ? "Concluir evolução" : "Sortear benefício";
  el.levelUpContent.innerHTML = `
    <div class="level-up-route">
      <strong>Nível ${currentLevel}</strong>
      <span aria-hidden="true">→</span>
      <strong>Nível ${targetLevel}</strong>
    </div>
    <div class="detail-list level-up-requirements">
      ${renderDetailRow("XP total", `${numberValue(state.current.experience, 0).toLocaleString("pt-BR")} / ${requirement.xp.toLocaleString("pt-BR")}`)}
      ${renderDetailRow("Materiais", requirement.material)}
      ${renderDetailRow("Custo", formatCurrency(cost))}
      ${renderDetailRow("Tempo conectado", requirement.time)}
      ${renderDetailRow("Estação", "Estação de Evolução funcional")}
    </div>
    ${pending ? `
      <section class="level-up-result">
        <span class="ability-source">Resultado 1d6: ${pending.roll}</span>
        <h3>${escapeHtml(pending.benefit.name)}</h3>
        <p>${escapeHtml(pending.benefit.effect)}</p>
        ${choiceOptions.length ? `
          <label>
            Escolha necessária
            <select id="levelUpChoiceSelect">
              ${choiceOptions.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
        ` : ""}
      </section>
    ` : `
      <div class="level-up-confirmations">
        <label><input id="levelUpStationConfirmed" type="checkbox" /> Estação funcional disponível</label>
        <label><input id="levelUpMaterialConfirmed" type="checkbox" /> Materiais entregues e consumidos</label>
      </div>
      <p class="inventory-note">O custo em Luzentis será debitado automaticamente. O resultado do benefício ficará registrado na ficha.</p>
    `}
  `;
}

function openLevelUpDialog() {
  readForm();
  state.pendingLevelUp = null;
  renderLevelUpDialog();
  el.levelUpModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeLevelUpDialog() {
  state.pendingLevelUp = null;
  el.levelUpModal.hidden = true;
  syncModalOpenState();
}

function handleLevelUpSubmit(event) {
  event.preventDefault();
  const currentLevel = clamp(numberValue(state.current.level, 1), 1, 10);
  const targetLevel = currentLevel + 1;
  const requirement = LEVEL_UP_REQUIREMENTS[targetLevel];
  if (!requirement) return;
  const cost = 500 * targetLevel;

  if (!state.pendingLevelUp) {
    if (!ensureDiceRollAllowed()) return;
    if (numberValue(state.current.experience, 0) < requirement.xp) {
      showToast(`Faltam ${(requirement.xp - numberValue(state.current.experience, 0)).toLocaleString("pt-BR")} XP para o nível ${targetLevel}.`, "tech-error");
      return;
    }
    if (numberValue(state.current.currency, 0) < cost) {
      showToast(`São necessários ${formatCurrency(cost)} para a evolução.`, "tech-error");
      return;
    }
    if (!document.querySelector("#levelUpStationConfirmed")?.checked || !document.querySelector("#levelUpMaterialConfirmed")?.checked) {
      showToast("Confirme a estação e o consumo dos materiais.", "tech-error");
      return;
    }
    const roll = Math.floor(Math.random() * 6) + 1;
    state.pendingLevelUp = {
      targetLevel,
      roll,
      benefit: LEVEL_UP_BENEFITS[targetLevel][roll - 1],
    };
    renderLevelUpDialog();
    return;
  }

  if (numberValue(state.current.currency, 0) < cost || numberValue(state.current.experience, 0) < requirement.xp) {
    state.pendingLevelUp = null;
    renderLevelUpDialog();
    showToast("Os requisitos da evolução mudaram. Confira novamente.", "tech-error");
    return;
  }

  const pending = state.pendingLevelUp;
  const choice = document.querySelector("#levelUpChoiceSelect")?.value || "";
  if (pending.benefit.choice && !choice) {
    showToast("Faça a escolha do benefício antes de concluir.", "tech-error");
    return;
  }

  applyLevelUpBenefit(pending.benefit, choice);
  state.current.currency = Math.max(0, numberValue(state.current.currency, 0) - cost);
  state.current.level = pending.targetLevel;
  state.current.evolutionHistory = [
    ...(state.current.evolutionHistory || []),
    {
      level: pending.targetLevel,
      roll: pending.roll,
      benefit: pending.benefit.name,
      choice,
      material: requirement.material,
      cost,
      completedAt: new Date().toISOString(),
    },
  ];
  state.current.knownAbilities = [
    ...(state.current.knownAbilities || []),
    normalizeKnownAbility({
      id: `evolucao-${pending.targetLevel}-${Date.now()}`,
      name: pending.benefit.name,
      source: "Evolução",
      effect: `${pending.benefit.effect}${choice ? ` Escolha: ${choice}.` : ""}`,
      meta: `Nível ${pending.targetLevel} · resultado ${pending.roll}`,
      passiveEffects: pending.benefit.passiveEffects || [],
    }),
  ];
  const roll = pending.roll;
  const level = pending.targetLevel;
  closeLevelUpDialog();
  persistCurrentCharacterSilently();
  renderForm();
  pushDiceLog({
    label: `Evolução para o nível ${level}`,
    count: 1,
    sides: 6,
    bonus: 0,
    rolls: [roll],
    total: roll,
    formula: `1d6 · ${pending.benefit.name}`,
  });
  showToast(`Nível ${level} alcançado: ${pending.benefit.name}.`);
}

function applyLevelUpBenefit(benefit, choice = "") {
  if (benefit.trainedSkill && choice) {
    state.current.skillTraining = { ...(state.current.skillTraining || {}), [choice]: "trained" };
    state.current.bonusTrainedSkills = Math.max(0, numberValue(state.current.bonusTrainedSkills, 0)) + 1;
  }
  let pvBonus = Math.max(0, numberValue(benefit.permanentPvBonus, 0));
  if (benefit.permanentPvRoll) pvBonus += Math.floor(Math.random() * benefit.permanentPvRoll) + 1;
  if (pvBonus) {
    state.current.permanentPvBonus = Math.max(0, numberValue(state.current.permanentPvBonus, 0)) + pvBonus;
    state.current.pvCurrent = Math.max(0, numberValue(state.current.pvCurrent, 0)) + pvBonus;
  }
  if (benefit.stressFloor) {
    state.current.stressFloor = clamp(
      Math.max(numberValue(state.current.stressFloor, 0), benefit.stressFloor),
      0,
      STRESS_MAX
    );
    state.current.stress = Math.max(numberValue(state.current.stress, 0), state.current.stressFloor);
  }
}

function inventoryLocationLabel(entry) {
  const location = entry?.location || {};
  if (location.kind === LOCATION_KINDS.CONTAINER && location.label) return location.label;
  const labels = {
    [LOCATION_KINDS.EQUIPPED]: "Equipado",
    [LOCATION_KINDS.ACTIVE]: "Acesso rápido",
    [LOCATION_KINDS.CUBE]: "Dentro de cubo",
    [LOCATION_KINDS.CONTAINER]: "Armazenado",
    [LOCATION_KINDS.HOOK]: "Gancho",
    [LOCATION_KINDS.HOLSTER]: "Coldre",
    [LOCATION_KINDS.BANDOLIER]: "Bandoleira",
    [LOCATION_KINDS.BASE]: "Base / depósito",
    [LOCATION_KINDS.VEHICLE]: "Veículo",
    [LOCATION_KINDS.UNASSIGNED]: "Sem local definido",
  };
  return labels[location.kind] || labels[LOCATION_KINDS.UNASSIGNED];
}

function storageLocationKind(storageType) {
  if (storageType === "cube") return LOCATION_KINDS.CUBE;
  if (storageType === "hook") return LOCATION_KINDS.HOOK;
  if (storageType === "holster") return LOCATION_KINDS.HOLSTER;
  if (storageType === "bandolier") return LOCATION_KINDS.BANDOLIER;
  if (storageType === "vehicle") return LOCATION_KINDS.VEHICLE;
  return LOCATION_KINDS.CONTAINER;
}

function encodeLocationOption(location) {
  return encodeURIComponent(JSON.stringify(location));
}

function decodeLocationOption(value) {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return { kind: LOCATION_KINDS.UNASSIGNED };
  }
}

function storageCapacityLabel(storage, inventory) {
  if (storage.storage.maxWeight > 0) {
    const availableWeight = storage.getAvailableWeight(inventory);
    return `${formatWeight(availableWeight)} kg livres de ${formatWeight(storage.storage.maxWeight)} kg`;
  }
  const availableSlots = storage.getAvailableSlots(inventory);
  return Number.isFinite(availableSlots)
    ? `${availableSlots} espaço${availableSlots === 1 ? "" : "s"} livre${availableSlots === 1 ? "" : "s"}`
    : "sem limite por unidades";
}

function getInventoryLocationOptions(domain, entity) {
  const options = [
    { label: "Sem local definido (gera alerta)", location: { kind: LOCATION_KINDS.UNASSIGNED } },
    { label: "Ativo / acesso rápido", location: { kind: LOCATION_KINDS.ACTIVE, slotId: "active" } },
    { label: "Base / depósito", location: { kind: LOCATION_KINDS.BASE } },
  ];
  if ([ENTITY_TYPES.WEAPON, ENTITY_TYPES.ARMOR].includes(entity.entityType)) {
    options.splice(1, 0, {
      label: entity.entityType === ENTITY_TYPES.ARMOR ? "Equipar como armadura" : "Equipar como arma principal",
      location: {
        kind: LOCATION_KINDS.EQUIPPED,
        slotId: entity.entityType === ENTITY_TYPES.ARMOR ? "armor" : "mainWeapon",
      },
    });
  }
  domain.inventory.getStorageEntities().forEach((storage) => {
    if (storage.id === entity.id || !storage.canStore(entity, domain.inventory)) return;
    options.push({
      label: `${storage.name} (${storageCapacityLabel(storage, domain.inventory)})`,
      location: {
        kind: storageLocationKind(storage.storage.storageType),
        containerId: storage.id,
        label: storage.name,
      },
    });
  });
  const legacyEntry = getInventoryEntry(entity.id);
  if (legacyEntry) {
    const supportState = externalSupportState();
    supportTypesForEntry(legacyEntry).forEach((supportType) => {
      const typeState = supportState.types.find((entry) => entry.id === supportType.id);
      if (!typeState?.free) return;
      const locationKinds = {
        gancho: LOCATION_KINDS.HOOK,
        coldre: LOCATION_KINDS.HOLSTER,
        bandoleira: LOCATION_KINDS.BANDOLIER,
      };
      options.push({
        label: `${supportType.singular} externo (${typeState.free} livre${typeState.free === 1 ? "" : "s"})`,
        location: {
          kind: locationKinds[supportType.id],
          label: supportType.singular,
        },
      });
    });
  }
  return options;
}

function openInventoryLocationDialog(entityId, reason = "move") {
  const domain = domainCharacterFromLegacy();
  const entity = domain.inventory.findById(entityId);
  if (!entity) return;
  state.pendingLocationEntityId = entityId;
  state.pendingLocationReason = reason;
  el.inventoryLocationTitle.textContent = reason === "purchase"
    ? `Onde guardar ${entity.name}?`
    : `Mover ${entity.name}`;
  el.inventoryLocationMessage.textContent = reason === "purchase"
    ? "A compra foi concluída. Escolha onde o item ficará; sem uma escolha ele permanece com alerta de localização."
    : "A localização define se o item está pronto para uso, armazenado ou aguardando organização.";
  el.inventoryLocationSelect.innerHTML = getInventoryLocationOptions(domain, entity)
    .map((option) => `<option value="${encodeLocationOption(option.location)}">${escapeHtml(option.label)}</option>`)
    .join("");
  el.inventoryLocationModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeInventoryLocationDialog() {
  const reason = state.pendingLocationReason;
  state.pendingLocationEntityId = "";
  state.pendingLocationReason = "";
  el.inventoryLocationModal.hidden = true;
  syncModalOpenState();
  if (reason === "purchase") showToast("Item comprado e mantido sem local definido.", "tech-error");
}

function applyPendingInventoryLocation(event) {
  event.preventDefault();
  const entityId = state.pendingLocationEntityId;
  if (!entityId) return;
  const domain = domainCharacterFromLegacy();
  const entity = domain.inventory.findById(entityId);
  if (!entity) return;
  const location = decodeLocationOption(el.inventoryLocationSelect.value);
  try {
    if (location.kind === LOCATION_KINDS.EQUIPPED) domain.equipEntity(entity.id, location.slotId);
    else if (location.kind === LOCATION_KINDS.ACTIVE) domain.setEntityActive(entity.id, location.slotId);
    else domain.moveEntityTo(entity.id, location);
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    state.pendingLocationEntityId = "";
    state.pendingLocationReason = "";
    el.inventoryLocationModal.hidden = true;
    document.body.classList.remove("modal-open");
    renderForm();
    showToast(`${entity.name} movido para ${inventoryLocationLabel({ location: entity.location })}.`);
  } catch (error) {
    showToast(error.message || "Não foi possível mover o item.", "tech-error");
  }
}

function getInventoryEntry(uid) {
  return state.current.inventory.find((entry) => entry.uid === uid);
}

function isCubeEntry(entry) {
  if (!entry) return false;
  const item = findMarketItem(entry.itemId);
  return entry.category === "cube" || item?.category === "cube";
}

function getCubeEntries() {
  return (state.current.inventory || []).filter(isCubeEntry);
}

function emptySupportCounts() {
  return EXTERNAL_SUPPORT_TYPES.reduce((counts, type) => {
    counts[type.id] = 0;
    return counts;
  }, {});
}

function externalSupportType(id) {
  return EXTERNAL_SUPPORT_TYPES.find((type) => type.id === id) || null;
}

function externalSupportTypeLabel(id, plural = false) {
  const type = externalSupportType(id);
  if (!type) return "Suporte";
  return plural ? type.label : type.singular;
}

function supportSearchText(item) {
  return normalizeSearch([
    item?.name,
    item?.summary,
    item?.type,
    item?.kind,
    item?.category,
    ...(item?.tags || []),
  ].filter(Boolean).join(" "));
}

function escapedPattern(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function supportCountsFromItem(item) {
  const counts = emptySupportCounts();
  counts.gancho = Math.max(0, numberValue(item?.hooks, 0));
  const text = supportSearchText(item);
  if (!text) return counts;
  EXTERNAL_SUPPORT_TYPES.forEach((type) => {
    const pattern = type.keywords.map(escapedPattern).join("|");
    if (!new RegExp(`\\b(?:${pattern})\\b`).test(text)) return;
    const numbered = text.match(new RegExp(`(\\d+)\\s*(?:${pattern})\\b`));
    counts[type.id] = Math.max(counts[type.id], numbered ? numberValue(numbered[1], 1) : 1);
  });
  return counts;
}

function supportProviderCounts(entry) {
  const counts = emptySupportCounts();
  if (!entry || entry.cubeUid || entry.inCube || entry.supportSlot) return counts;
  const item = findMarketItem(entry.itemId);
  if (!item || isCubeEntry(entry)) return counts;
  const itemCounts = supportCountsFromItem(item);
  const hasAnySupport = EXTERNAL_SUPPORT_TYPES.some((type) => itemCounts[type.id] > 0);
  if (!hasAnySupport) return counts;
  const supportLocation = entryLocationKind(entry);
  const looseSupportItem = item.category === "item"
    && ![LOCATION_KINDS.BASE, LOCATION_KINDS.VEHICLE, LOCATION_KINDS.CONTAINER].includes(supportLocation);
  const equippedSupportEquipment = ["weapon", "armor"].includes(item.category) && isInventoryEquipped(entry);
  if (!looseSupportItem && !equippedSupportEquipment) return counts;
  return itemCounts;
}

function isSupportProviderEntry(entry) {
  const counts = supportProviderCounts(entry);
  return EXTERNAL_SUPPORT_TYPES.some((type) => counts[type.id] > 0);
}

function supportTypesForEntry(entry) {
  const item = findMarketItem(entry?.itemId);
  if (!item || isCubeEntry(entry) || entry.cubeUid || entry.inCube || isSupportProviderEntry(entry)) return [];
  const size = inferLegacyInventorySize(item);
  if (item.category === "item") {
    const supports = size === INVENTORY_SIZES.SMALL ? ["gancho"] : ["bandoleira", "gancho"];
    return supports.map(externalSupportType).filter(Boolean);
  }
  if (item.category !== "weapon") return [];
  const supports = size === INVENTORY_SIZES.SMALL ? ["coldre", "gancho"] : ["bandoleira", "gancho"];
  return supports.map(externalSupportType).filter(Boolean);
}

function canAttachToExternalSupport(entry) {
  return supportTypesForEntry(entry).length > 0;
}

function moveInventoryItemToStorage(entityId, storageId) {
  if (!entityId || !storageId || entityId === storageId) return;
  const domain = domainCharacterFromLegacy();
  const entity = domain.inventory.findById(entityId);
  const storage = domain.inventory.findById(storageId);
  if (!entity || !storage?.isStorage()) return;
  if (!storage.canStore(entity, domain.inventory)) {
    showToast(`${storage.name} não possui espaço ou não aceita o porte de ${entity.name}.`, "tech-error");
    return;
  }
  try {
    domain.moveEntityTo(entity.id, {
      kind: storageLocationKind(storage.storage.storageType),
      containerId: storage.id,
      label: storage.name,
    });
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderSummary();
    showToast(`${entity.name} guardado em ${storage.name}.`);
  } catch (error) {
    showToast(error.message || "Não foi possível guardar o item.", "tech-error");
  }
}

function externalSupportState() {
  const capacities = emptySupportCounts();
  const used = emptySupportCounts();
  const assignedByType = EXTERNAL_SUPPORT_TYPES.reduce((map, type) => {
    map[type.id] = [];
    return map;
  }, {});
  const providers = [];

  (state.current.inventory || []).forEach((entry) => {
    const counts = supportProviderCounts(entry);
    const providedTypes = EXTERNAL_SUPPORT_TYPES.filter((type) => counts[type.id] > 0);
    if (providedTypes.length) {
      providedTypes.forEach((type) => {
        capacities[type.id] += counts[type.id];
      });
      const item = findMarketItem(entry.itemId);
      providers.push({ uid: entry.uid, name: item?.name || "Suporte", counts });
    }

    if (entry.supportSlot && !entry.cubeUid && !entry.inCube && assignedByType[entry.supportSlot]) {
      assignedByType[entry.supportSlot].push(entry);
      used[entry.supportSlot] += 1;
    }
  });

  const types = EXTERNAL_SUPPORT_TYPES.map((type) => ({
    ...type,
    capacity: capacities[type.id],
    used: used[type.id],
    free: Math.max(0, capacities[type.id] - used[type.id]),
    over: Math.max(0, used[type.id] - capacities[type.id]),
    assigned: assignedByType[type.id],
  }));

  return {
    capacities,
    used,
    providers,
    types,
    totalCapacity: types.reduce((sum, type) => sum + type.capacity, 0),
    totalUsed: types.reduce((sum, type) => sum + type.used, 0),
  };
}

function findAvailableExternalSupport(entry, supportState = externalSupportState()) {
  const compatible = supportTypesForEntry(entry);
  return compatible.find((type) => supportState.used[type.id] < supportState.capacities[type.id]) || null;
}

function canDisableExternalSupportProvider(entry) {
  const counts = supportProviderCounts(entry);
  const supportState = externalSupportState();
  const blockingType = EXTERNAL_SUPPORT_TYPES.find((type) => (
    counts[type.id] > 0 && supportState.used[type.id] > Math.max(0, supportState.capacities[type.id] - counts[type.id])
  ));
  if (!blockingType) return true;
  showToast(`Solte itens em ${blockingType.label.toLowerCase()} antes de remover esse suporte.`);
  return false;
}

function attachEntryToExternalSupport(entry) {
  const item = findMarketItem(entry?.itemId);
  if (!item) return;
  if (entry.cubeUid || entry.inCube) {
    showToast("Tire o item do cubo antes de prender em um suporte.");
    return;
  }
  if (isSupportProviderEntry(entry)) {
    showToast("Esse equipamento já funciona como suporte externo.");
    return;
  }
  const target = findAvailableExternalSupport(entry);
  if (!target) {
    const labels = supportTypesForEntry(entry).map((type) => type.label.toLowerCase()).join(", ") || "suporte compatível";
    showToast(`Sem ${labels} livre para este item.`);
    return;
  }
  entry.supportSlot = target.id;
  renderSummary();
  showToast(`${item.name} preso em ${target.singular.toLowerCase()}.`);
}

function moveInventoryItemToExternalSupport(uid, supportTypeId) {
  const entry = getInventoryEntry(uid);
  const item = findMarketItem(entry?.itemId);
  const supportType = externalSupportType(supportTypeId);
  if (!entry || !item || !supportType) return;
  if (entry.supportSlot === supportTypeId) {
    showToast(`${item.name} já está em ${supportType.singular.toLowerCase()}.`);
    return;
  }
  if (entry.cubeUid || entry.inCube) {
    showToast("Tire o item do cubo antes de prendê-lo em um suporte.", "tech-error");
    return;
  }
  if (!supportTypesForEntry(entry).some((type) => type.id === supportTypeId)) {
    showToast(`${item.name} não é compatível com ${supportType.label.toLowerCase()}.`, "tech-error");
    return;
  }
  const supportState = externalSupportState();
  const targetState = supportState.types.find((type) => type.id === supportTypeId);
  if (!targetState || targetState.free <= 0) {
    showToast(`Não há espaço livre em ${supportType.label.toLowerCase()}.`, "tech-error");
    return;
  }
  const locationKinds = {
    gancho: LOCATION_KINDS.HOOK,
    coldre: LOCATION_KINDS.HOLSTER,
    bandoleira: LOCATION_KINDS.BANDOLIER,
  };
  try {
    const domain = domainCharacterFromLegacy();
    domain.moveEntityTo(uid, { kind: locationKinds[supportTypeId] });
    syncDomainCharacterToLegacy(domain);
    persistCurrentCharacterSilently();
    renderSummary();
    showToast(`${item.name} preso em ${supportType.singular.toLowerCase()}.`);
  } catch (error) {
    showToast(error.message || "Não foi possível mover o item.", "tech-error");
  }
}

function cubeContainedEntries(cubeUid) {
  return (state.current.inventory || []).filter((entry) => entry.cubeUid === cubeUid && !isCubeEntry(entry));
}

function legacyCubeEntries() {
  return (state.current.inventory || []).filter((entry) => entry.inCube && !entry.cubeUid && !isCubeEntry(entry));
}

function cubeStorageStats(derived = null) {
  const cubes = getCubeEntries();
  const physicalUsedUnits = cubes.reduce((sum, cube) => sum + cubeContainedEntries(cube.uid).length, 0);
  const physicalTotalUnits = cubes.reduce((sum, cube) => sum + cubeCapacity(cube), 0);
  const legacyCubeItems = legacyCubeEntries();
  const legacyUsedUnits = legacyCubeItems.length;
  const baseCapacity = Math.max(0, numberValue(derived?.cubeSlots, 0));
  const hasTrackedStorage = physicalTotalUnits > 0 || physicalUsedUnits > 0 || legacyUsedUnits > 0;
  const usedUnits = hasTrackedStorage
    ? physicalUsedUnits + legacyUsedUnits
    : Math.max(0, numberValue(state.current.loadUsed, 0));
  const legacyCapacity = legacyUsedUnits > 0 ? baseCapacity : 0;
  const totalUnits = Math.max(usedUnits, physicalTotalUnits + legacyCapacity || baseCapacity);
  return {
    cubes,
    looseItems: (state.current.inventory || []).filter((entry) => canStoreEntryInPhysicalCube(entry) && !entry.cubeUid && !entry.inCube && !entry.supportSlot),
    legacyCubeItems,
    physicalUsedUnits,
    physicalTotalUnits,
    legacyUsedUnits,
    usedUnits,
    totalUnits,
    hasTrackedStorage,
  };
}

function syncLoadUsedFromCubeStorage(stats = cubeStorageStats()) {
  if (stats.hasTrackedStorage) state.current.loadUsed = stats.usedUnits;
  return stats;
}

function syncLoadUsedInput() {
  const input = document.querySelector("#loadUsed");
  if (input instanceof HTMLInputElement) input.value = String(Math.max(0, numberValue(state.current.loadUsed, 0)));
}

function parseWeightKg(value) {
  const match = String(value || "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Math.max(0, numberValue(match[0], 0)) : 0;
}

function carriedLoadWeightKg() {
  return (state.current.inventory || []).reduce((total, entry) => {
    const locationKind = entryLocationKind(entry);
    if ([
      LOCATION_KINDS.EQUIPPED,
      LOCATION_KINDS.CUBE,
      LOCATION_KINDS.BASE,
      LOCATION_KINDS.VEHICLE,
    ].includes(locationKind)) return total;
    const item = findMarketItem(entry.itemId);
    if (!item) return total;
    return total + (isCubeEntry(entry) ? CUBE_WEIGHT_KG : parseWeightKg(item.weight));
  }, 0);
}

function formatWeight(value) {
  return numberValue(value, 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function cubeLoadStats(derived = null) {
  const maxCubes = Math.max(0, numberValue(derived?.cubeSlots, 0));
  const carriedCubes = getCubeEntries().length;
  const weightKg = numberValue(derived?.carriedWeightKg, carriedLoadWeightKg());
  const capacityKg = Math.max(0, numberValue(derived?.loadCapacityKg, 0));
  const overCubes = Math.max(0, carriedCubes - maxCubes);
  const overKg = Math.max(0, weightKg - capacityKg);
  const ratio = capacityKg > 0 ? weightKg / capacityKg : weightKg > 0 ? Number.POSITIVE_INFINITY : 0;
  const immobile = ratio > 1.5;
  const overloaded = ratio > 1 || overCubes > 0;
  const atLimit = !overloaded && (ratio >= 0.9 || (maxCubes > 0 && carriedCubes >= maxCubes));
  const statusLabel = immobile
    ? "SOBRECARGA GRAVE: MOV. 0"
    : ratio > 1
      ? "SOBRECARGA: MOV. PELA METADE"
      : overCubes > 0
        ? `CUBOS EXCEDENTES: +${overCubes}`
        : atLimit
          ? "PRÓXIMO DO LIMITE"
          : "CARGA ESTÁVEL";
  const meterPercent = capacityKg > 0 ? clamp(Math.round(ratio * 100), 0, 100) : weightKg > 0 ? 100 : 0;
  return { maxCubes, carriedCubes, weightKg, capacityKg, overCubes, overKg, ratio, immobile, overloaded, atLimit, statusLabel, meterPercent };
}

function renderCubeLoadMonitor(load = cubeLoadStats(derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession)))) {
  if (!el.cubeLoadMonitor) return;
  const stateClass = load.overloaded ? "overloaded" : load.atLimit || load.maxCubes <= 0 ? "at-limit" : "stable";
  el.cubeLoadMonitor.className = `cube-load-monitor ${stateClass}`;
  el.cubeLoadMonitor.innerHTML = `
    <div class="cube-load-head">
      <span>Carga transportada</span>
      <strong>${escapeHtml(load.statusLabel)}</strong>
    </div>
    <div class="cube-load-meter" aria-label="Carga transportada">
      <span style="width:${load.meterPercent}%"></span>
    </div>
    <div class="cube-load-readout">
      <span>${load.carriedCubes}/${load.maxCubes} cubo${load.maxCubes === 1 ? "" : "s"}</span>
      <span>${formatWeight(load.weightKg)}/${formatWeight(load.capacityKg)} Kg</span>
    </div>
  `;
}

function canAddPhysicalCube() {
  const derived = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession));
  const load = cubeLoadStats(derived);
  if (load.carriedCubes >= load.maxCubes || load.overloaded) {
    renderCubeLoadMonitor(load);
    showToast("O cubo será adicionado, mas o personagem ficará acima da capacidade indicada.", "tech-error");
  }
  return true;
}

function cubeCapacity(entry) {
  const item = findMarketItem(entry?.itemId);
  return Math.max(1, numberValue(entry?.cubeCapacity ?? item?.cubeCapacity, 1));
}

function cubeKind(entry) {
  const item = findMarketItem(entry?.itemId);
  return entry?.cubeKind || item?.cubeKind || "simple";
}

function cubeDisplayName(entry) {
  const item = findMarketItem(entry?.itemId);
  return item?.name || "Cubo";
}

function cubeTypeLabel(entry) {
  const definition = CUBE_TYPE_DEFINITIONS[cubeKind(entry)] || CUBE_TYPE_DEFINITIONS.simple;
  return definition.label;
}

function cubeRuleText(entry) {
  const kind = cubeKind(entry);
  const definition = CUBE_TYPE_DEFINITIONS[kind] || CUBE_TYPE_DEFINITIONS.simple;
  const capacity = cubeCapacity(entry);
  if (kind === "simple") return definition.summary;
  const lockLabel = cubeLockLabel(entry);
  const lockPrefix = kind === "cargo" ? "Item aceito" : "Tipo aceito";
  return `${definition.summary} Capacidade: ${capacity} unidade${capacity === 1 ? "" : "s"}. ${lockPrefix}: ${lockLabel}.`;
}

function canStoreEntryInPhysicalCube(entry) {
  if (!entry || isCubeEntry(entry)) return false;
  const item = findMarketItem(entry.itemId);
  return item?.category === "item";
}

function cubeFirstContent(entry) {
  return cubeContainedEntries(entry?.uid)[0] || null;
}

function cubeItemIdentity(entry) {
  const item = findMarketItem(entry?.itemId);
  return {
    id: item?.id || entry?.itemId || "",
    name: normalizeSearch(item?.name || entry?.itemId || ""),
    label: item?.name || "Item",
  };
}

function sameExactCubeItem(firstEntry, nextEntry) {
  const first = cubeItemIdentity(firstEntry);
  const next = cubeItemIdentity(nextEntry);
  if (first.id && next.id && first.id === next.id) return true;
  return Boolean(first.name && next.name && first.name === next.name);
}

function labelFromTag(tag) {
  const clean = String(tag || "").trim();
  return clean ? `${clean.charAt(0).toUpperCase()}${clean.slice(1)}` : "Itens";
}

function classifyCubeItemFamily(entry) {
  const item = findMarketItem(entry?.itemId);
  if (!item) return { key: "desconhecido", label: "Itens sem categoria" };
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const text = normalizeSearch([item.name, item.summary, item.type, item.kind, item.category, ...tags].join(" "));
  if (/granad/.test(text)) return { key: "granada", label: "Granadas" };
  if (/munic|bala|cartucho|carregador/.test(text)) return { key: "municao", label: "Munições" };
  if (/minerio|metal|ferro|aco|carbonita|ferrita|pralatum|cristal|pedra/.test(text)) return { key: "minerais", label: "Minerais e metais" };
  if (/organico|biologico|flora|fauna|carne|couro|osso|madeira|planta|animal/.test(text)) return { key: "organicos", label: "Orgânicos" };
  if (/energia|energetico|cosmos|cosmico|bateria|plasma|luz|celula/.test(text)) return { key: "energeticos", label: "Energéticos" };
  if (/chip|circuito|rede|digital|mecanico|peca|sucata|sensor|modulo/.test(text)) return { key: "tecnologicos", label: "Tecnológicos" };
  if (/quimico|acido|remedio|toxina|veneno|reagente|medicina/.test(text)) return { key: "quimicos", label: "Químicos" };
  if (/kit|ferramenta|suporte|utilitario/.test(text)) return { key: "suporte", label: "Suporte" };
  const tag = tags.find(Boolean);
  if (tag) return { key: dataSlug(tag), label: labelFromTag(tag) };
  return { key: dataSlug(item.category || "item"), label: marketCategoryLabel(item.category || "item") };
}

function cubeLockLabel(entry) {
  const kind = cubeKind(entry);
  const firstEntry = cubeFirstContent(entry);
  if (kind === "simple") return "1 unidade";
  if (!firstEntry) {
    return kind === "cargo"
      ? "livre, o primeiro item define o item exato"
      : "livre, o primeiro item define o tipo";
  }
  if (kind === "cargo") return cubeItemIdentity(firstEntry).label;
  if (kind === "specialized") return classifyCubeItemFamily(firstEntry).label;
  return "Livre";
}

function cubeRejectText(cubeEntry) {
  const kind = cubeKind(cubeEntry);
  if (kind === "cargo") return `Este cubo de carga só aceita ${cubeLockLabel(cubeEntry)}.`;
  if (kind === "specialized") return `Este cubo especializado só aceita ${cubeLockLabel(cubeEntry)}.`;
  return `${cubeDisplayName(cubeEntry)} não aceita esse item.`;
}

function cubeAcceptsItem(cubeEntry, itemEntry) {
  const kind = cubeKind(cubeEntry);
  const contents = cubeContainedEntries(cubeEntry.uid);
  if (kind === "simple") return contents.length < 1;
  if (!contents.length) return true;
  const firstEntry = contents[0];
  if (kind === "cargo") return sameExactCubeItem(firstEntry, itemEntry);
  if (kind === "specialized") {
    return classifyCubeItemFamily(firstEntry).key === classifyCubeItemFamily(itemEntry).key;
  }
  return true;
}

function getEquippedMarketItem(category) {
  const uid = category === "weapon" ? state.current.equippedWeaponUid : state.current.equippedArmorUid;
  const entry = getInventoryEntry(uid);
  return entry ? findMarketItem(entry.itemId) : null;
}

function getEquippedInventoryEntry(category) {
  const uid = category === "weapon" ? state.current.equippedWeaponUid : state.current.equippedArmorUid;
  return uid ? getInventoryEntry(uid) : null;
}

function itemCrackLevel(entry) {
  return clamp(numberValue(entry?.crackLevel, 0), 0, ITEM_CRACK_MAX);
}

function getMarketItemByInventoryUid(uid) {
  const entry = uid ? getInventoryEntry(uid) : null;
  return entry ? findMarketItem(entry.itemId) : null;
}

function modifierChipEntries() {
  return (state.current.knownAbilities || []).filter((ability) => ability.source === "Chip modificador" && ability.installed !== false);
}

function modifierChipSlotCost(entry) {
  const explicit = numberValue(entry?.modifierSlots ?? entry?.slots, NaN);
  if (Number.isFinite(explicit)) return Math.max(1, explicit);
  const official = modifierChipData.find((chip) =>
    chip.id === entry?.id || normalizeSearch(chip.name) === normalizeSearch(entry?.name)
  );
  return Math.max(1, numberValue(official?.slots, 1));
}

function cosmicSpellEntries({ abilities = state.current.knownAbilities } = {}) {
  return (abilities || []).filter((ability) => ability.source === "Cosmos");
}

function cosmicSpellSlotState({
  weaponUid = state.current.equippedWeaponUid,
  armorUid = state.current.equippedArmorUid,
  abilities = state.current.knownAbilities,
  excludedAbilityId = "",
} = {}) {
  const activeAbilities = (abilities || []).filter((ability) => ability.id !== excludedAbilityId);
  const equipped = [
    { label: "Arma equipada", item: getMarketItemByInventoryUid(weaponUid) },
    { label: "Armadura equipada", item: getMarketItemByInventoryUid(armorUid) },
  ].map((entry) => ({
    ...entry,
    slots: cosmicSpellSlotValueFromItem(entry.item),
    name: entry.item?.name || "Nenhuma",
  }));
  const chipSources = activeAbilities
    .filter((ability) => ability.source === "Chip modificador" && ability.installed !== false)
    .map((ability) => ({ name: ability.name, slots: cosmicSpellSlotValueFromAbility(ability) }))
    .filter((source) => source.slots > 0);
  const chipSlots = chipSources.reduce((sum, source) => sum + source.slots, 0);
  const training = Math.max(0, numberValue(state.current.cosmicTrainingSlots, 0));
  const grimoires = Math.max(0, numberValue(state.current.cosmicGrimoireSlots, 0));
  const total = equipped.reduce((sum, entry) => sum + entry.slots, 0) + chipSlots + training + grimoires;
  const used = cosmicSpellEntries({ abilities: activeAbilities }).length;
  return {
    total,
    used,
    free: Math.max(0, total - used),
    over: Math.max(0, used - total),
    training,
    grimoires,
    chipSources,
    sources: [
      ...equipped.map((entry) => ({ label: `${entry.label}: ${entry.name}`, slots: entry.slots })),
      { label: "Chips modificadores", slots: chipSlots },
      { label: "Treino registrado", slots: training },
      { label: "Grimórios encontrados", slots: grimoires },
    ],
  };
}

function cosmicSpellSlotValueFromItem(item) {
  if (!item) return 0;
  const explicit = numberValue(item.cosmicSpellSlots ?? item.spellSlots ?? item.magicSlots, NaN);
  if (Number.isFinite(explicit)) return Math.max(0, explicit);
  const parsed = parseCosmicSpellSlotText([item.name, item.summary, item.type, item.kind, ...(item.tags || [])].join(" "));
  if (parsed > 0) return parsed;
  const cosmos = Math.max(0, numberValue(item.cosmos, 0));
  const text = normalizeSearch([item.name, item.summary, item.type, item.kind, ...(item.tags || [])].join(" "));
  return cosmos > 0 && /cosm|canalizador|habilidade/.test(text) ? cosmos : 0;
}

function cosmicSpellSlotValueFromAbility(ability) {
  if (!ability) return 0;
  const explicit = numberValue(ability.cosmicSpellSlots ?? ability.spellSlots ?? ability.magicSlots, NaN);
  if (Number.isFinite(explicit)) return Math.max(0, explicit);
  return parseCosmicSpellSlotText([ability.name, ability.effect, ability.meta, ...(ability.tags || [])].join(" "));
}

function parseCosmicSpellSlotText(value) {
  const text = normalizeSearch(value);
  const match = text.match(/(?:permite escolher|escolhe|escolher|escolha|aprende|aprender|conhece)\s+(\d+)\s+(?:magias?|habilidades?)(?:\s+\S+){0,6}\s+(?:cosm|cosmos)/);
  return match ? Math.max(0, numberValue(match[1], 0)) : 0;
}

function canAddCosmicSpell() {
  const slots = cosmicSpellSlotState();
  return slots.free > 0;
}

function canUseCosmicSpellSlotLayout(nextSlots) {
  const slots = cosmicSpellSlotState(nextSlots);
  if (slots.used <= slots.total) return true;
  showToast(`Sem espaços de magia cósmica: ${slots.used}/${slots.total}. Libere magias ou registre treino/grimórios.`, "cosmic-error");
  return false;
}

function modifierSlotState({ weaponUid = state.current.equippedWeaponUid, armorUid = state.current.equippedArmorUid } = {}) {
  const equipped = [
    { label: "Arma equipada", item: getMarketItemByInventoryUid(weaponUid) },
    { label: "Armadura equipada", item: getMarketItemByInventoryUid(armorUid) },
  ].map((entry) => ({
    ...entry,
    mods: Math.max(0, numberValue(entry.item?.mods, 0)),
    name: entry.item?.name || "Nenhuma",
  }));
  const total = equipped.reduce((sum, entry) => sum + entry.mods, 0);
  const used = modifierChipEntries().reduce((sum, ability) => sum + modifierChipSlotCost(ability), 0);
  return {
    total,
    used,
    free: Math.max(0, total - used),
    over: Math.max(0, used - total),
    sources: equipped.map((entry) => ({
      label: `${entry.label}: ${entry.name}`,
      mods: entry.mods,
    })),
  };
}

function canAddModifierChip(requiredSlots = 1) {
  const slots = modifierSlotState();
  return slots.free >= Math.max(1, numberValue(requiredSlots, 1));
}

function canUseModifierSlotLayout(nextSlots) {
  const slots = modifierSlotState(nextSlots);
  if (slots.used <= slots.total) return true;
  showToast(`Sem espaço de mods: ${slots.used}/${slots.total}. Desequipe chips modificadores antes.`, "tech-error");
  return false;
}

function isInventoryEquipped(entry) {
  return entry.uid === state.current.equippedWeaponUid || entry.uid === state.current.equippedArmorUid;
}

function marketMeta(item) {
  if (item.category === "cube") {
    const definition = CUBE_TYPE_DEFINITIONS[item.cubeKind || "simple"] || CUBE_TYPE_DEFINITIONS.simple;
    const capacity = Math.max(1, numberValue(item.cubeCapacity, 1));
    return [
      definition.label,
      `${capacity} unidade${capacity === 1 ? "" : "s"}`,
      item.cubeKind === "simple" ? "Sem variação" : "Vínculo pelo primeiro item",
      item.weight || "",
      formatCurrency(item.price),
    ].filter(Boolean).join(" - ");
  }
  const parts = [
    item.tier ? `Tier ${item.tier}` : "",
    item.type || item.kind || "",
    item.damage ? `Dano ${item.damage}` : "",
    item.ca ? `CA ${item.ca}` : "",
    item.mods !== undefined && item.mods !== "" ? `${item.mods} mods` : "",
    item.weight || "",
    formatCurrency(item.price),
  ].filter(Boolean);
  return parts.join(" - ");
}

function compactMarketMeta(item) {
  if (item.category === "cube") {
    const definition = CUBE_TYPE_DEFINITIONS[item.cubeKind || "simple"] || CUBE_TYPE_DEFINITIONS.simple;
    const capacity = Math.max(1, numberValue(item.cubeCapacity, 1));
    return `${definition.label} - ${capacity} unidade${capacity === 1 ? "" : "s"}`;
  }
  const parts = [
    item.tier ? `Tier ${item.tier}` : "",
    item.type || item.kind || "",
    item.damage ? `Dano ${item.damage}` : "",
    item.ca ? `CA ${item.ca}` : "",
    Number.isFinite(item.price) ? formatCurrency(item.price) : "",
  ].filter(Boolean);
  return parts.slice(0, 3).join(" - ") || marketCategoryLabel(item.category);
}

function marketLine(item) {
  return `${item.name} (${marketMeta(item)})`;
}

function libraryMeta(item) {
  const parts = [
    item.source || "",
    item.cost ? `Custo ${item.cost} Cosmos` : "",
    item.category === "cosmos" ? "Ocupa 1 espaço de magia" : "",
    item.rank ? `Rank ${item.rank}` : "",
    item.category === "chip-mod" ? `${Math.max(1, numberValue(item.slots, 1))} slot${numberValue(item.slots, 1) === 1 ? "" : "s"}` : "",
    item.duration ? `Duração ${item.duration}` : "",
    item.context || "",
    item.focus || "",
    item.skill || "",
    item.tier || "",
    item.type || "",
  ].filter(Boolean);
  return parts.join(" - ");
}

function monsterMeta(monster) {
  return [
    monster.tier ? `Tier ${monster.tier}` : "Tier pendente",
    monster.type || "",
    monster.role || "",
    Number.isFinite(monster.pv) ? `PV ${monster.pv}` : "PV pendente",
    Number.isFinite(monster.ca) ? `CA ${monster.ca}` : "CA pendente",
  ].filter(Boolean).join(" - ");
}

function renderMonsterPopoverDetails(monster) {
  const assetCount = (monster.assets || []).length;
  return `
    ${monster.movement ? `<p><strong>Movimento:</strong> ${escapeHtml(monster.movement)}</p>` : ""}
    ${monster.attacks ? `<p><strong>Ataques:</strong> ${escapeHtml(monster.attacks)}</p>` : ""}
    ${monster.abilities ? `<p><strong>Habilidades:</strong> ${escapeHtml(monster.abilities)}</p>` : ""}
    ${monster.weaknesses ? `<p><strong>Fraquezas:</strong> ${escapeHtml(monster.weaknesses)}</p>` : ""}
    ${assetCount ? `<p><strong>Conteúdo vinculado:</strong> ${assetCount}</p>` : ""}
    ${monster.needsCoreStats ? '<p class="support-warning"><strong>Livro 3:</strong> ficha de chefe sem Tier, PV e CA explícitos.</p>' : ""}
  `;
}

function getMonsterLibraryItems() {
  return monsterData.map((monster) => ({
    ...monster,
    ...(state.monsterSheets[monster.id] || {}),
    official: true,
    assets: state.monsterSheets[monster.id]?.assets || monster.assets || [],
  })).concat(
    Object.values(state.monsterSheets).filter((monster) => !monsterData.some((official) => official.id === monster.id))
  );
}

function findMonsterSheet(id) {
  return getMonsterLibraryItems().find((monster) => monster.id === id) || null;
}

function marketCategoryLabel(category) {
  const labels = {
    item: "Item",
    cube: "Cubo",
    weapon: "Arma",
    armor: "Armadura",
  };
  return labels[category] || "Manual";
}

function defaultRacialChoice(race, currentChoice = "") {
  const options = race.choice?.options || [];
  return options.includes(currentChoice) ? currentChoice : (options[0] || "");
}

function raceEffectiveBonus(race, racialChoice) {
  const bonus = { ...(race.bonus || {}) };
  const choice = defaultRacialChoice(race, racialChoice);
  if (choice && race.choice) {
    bonus[choice] = (bonus[choice] || 0) + race.choice.amount;
  }
  return bonus;
}

function raceMechanicalBenefitSummary(race) {
  const benefits = [];
  if (race.extraTrainedSkills) benefits.push(`${formatMod(race.extraTrainedSkills)} perícia treinada`);
  if (race.pvBonus) benefits.push(`${formatMod(race.pvBonus)} PV máximo`);
  if (race.cosmos) benefits.push(`${formatMod(race.cosmos)} Cosmos máximo`);
  if (race.movement) benefits.push(`${formatMod(race.movement)} m de movimento`);
  if (race.cubeBonus) benefits.push(`${formatMod(race.cubeBonus)} cubos`);
  return benefits.length ? benefits.join(" · ") : "Atributo escolhido e traços situacionais";
}

function raceTraitNameSummary(text) {
  const value = String(text || "").trim();
  if (!value) return "—";
  const names = [...value.matchAll(/(?:^|\.\s+)([^.:]+):/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  return names.length ? names.join(" · ") : value;
}

function attributeModifier(value) {
  return Math.floor((numberValue(value, ATTRIBUTE_BASE) - ATTRIBUTE_MOD_BASE) / 2);
}

function parsePassiveNumber(value) {
  return numberValue(String(value || "0").replace(",", "."), 0);
}

function passiveTextPayload(entry = {}) {
  return [
    entry.name,
    entry.effect,
    entry.summary,
    entry.meta,
    entry.activation,
    entry.installation,
    entry.failure,
    ...(entry.tags || []),
  ].filter(Boolean).join(" ");
}

function isConditionalPassiveText(value) {
  const text = normalizeSearch(value);
  return /\b(1x|primeiro|uma jogada|proximo teste|proxima jogada|enquanto|quando|apos|ao chegar|ao conseguir|ao usar|ao trocar|ao destruir|se mover|contra|alvo|inimig|aliad|por descanso|por dia|por combate|por cena|ate \d|para armaduras|para detectar|em areas|em sombras)\b/.test(text);
}

function passiveEffectKey(effect) {
  return [effect.target, effect.key || "", effect.scope || "", effect.value, effect.conditional ? "c" : "p"].join(":");
}

function normalizePassiveEffects(effects = []) {
  if (!Array.isArray(effects)) return [];
  return effects
    .map((effect) => ({
      target: effect.target || "note",
      key: effect.key || "",
      scope: effect.scope || "",
      value: numberValue(effect.value, 0),
      label: effect.label || "Passivo",
      conditional: Boolean(effect.conditional),
    }))
    .filter((effect) => effect.label && (effect.target === "note" || effect.value !== 0));
}

function addPassiveEffect(effects, effect) {
  const normalized = normalizePassiveEffects([effect])[0];
  if (!normalized) return;
  if (effects.some((item) => passiveEffectKey(item) === passiveEffectKey(normalized))) return;
  effects.push(normalized);
}

function inferModifierChipPassiveEffects(entry = {}) {
  const raw = passiveTextPayload(entry);
  const text = normalizeSearch(raw).replace(/[−–—]/g, "-");
  const effects = [];
  const activation = normalizeSearch(entry.activation || "");
  const defaultConditional = isConditionalPassiveText(raw) || Boolean(activation && !activation.includes("passiv"));

  for (const match of text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*(for|ref|con|men|pre|int|esp)\b/g)) {
    const attr = (PASSIVE_ATTRIBUTE_ALIASES[match[2].toUpperCase()] || match[2].toUpperCase());
    addPassiveEffect(effects, {
      target: "attribute",
      key: attr,
      value: parsePassiveNumber(match[1]),
      label: `${attr} ${formatMod(parsePassiveNumber(match[1]))}`,
      conditional: defaultConditional,
    });
  }

  for (const match of text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*(?:de\s*)?ca\b/g)) {
    addPassiveEffect(effects, {
      target: "ca",
      value: parsePassiveNumber(match[1]),
      label: `CA ${formatMod(parsePassiveNumber(match[1]))}`,
      conditional: defaultConditional,
    });
  }

  const movementMatches = [
    ...text.matchAll(/deslocamento\s*([+-]\d+(?:[,.]\d+)?)\s*m/g),
    ...text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*m\s*(?:extra\s*)?por rodada/g),
    ...text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*m\s+de deslocamento/g),
  ];
  movementMatches.forEach((match) => {
    addPassiveEffect(effects, {
      target: "movement",
      value: parsePassiveNumber(match[1]),
      label: `Movimento ${formatMod(parsePassiveNumber(match[1]))} m`,
      conditional: defaultConditional,
    });
  });

  for (const match of text.matchAll(/(?:carrega\s*)?([+-]\d+(?:[,.]\d+)?)\s*cubos?\b/g)) {
    addPassiveEffect(effects, {
      target: "cubeSlots",
      value: parsePassiveNumber(match[1]),
      label: `Cubos ${formatMod(parsePassiveNumber(match[1]))}`,
      conditional: defaultConditional,
    });
  }

  const stressMatch = text.match(/estresse maximo.*?([+-]\d+(?:[,.]\d+)?)/);
  if (stressMatch) {
    addPassiveEffect(effects, {
      target: "stressMax",
      value: parsePassiveNumber(stressMatch[1]),
      label: `Estresse máximo ${formatMod(parsePassiveNumber(stressMatch[1]))}`,
      conditional: defaultConditional,
    });
  }

  const cosmosLevelMatch = text.match(/([+-]\d+(?:[,.]\d+)?)\s*ponto\s*\/\s*lvl\s*de cosmos total/);
  if (cosmosLevelMatch) {
    addPassiveEffect(effects, {
      target: "cosmosPerLevel",
      value: parsePassiveNumber(cosmosLevelMatch[1]),
      label: `Cosmos máximo ${formatMod(parsePassiveNumber(cosmosLevelMatch[1]))}/nível`,
      conditional: defaultConditional,
    });
  }

  addPassiveSkillEffects(effects, text, raw, defaultConditional);
  addPassiveProtectionEffects(effects, text, defaultConditional);
  addPassiveAttackEffects(effects, text, defaultConditional);
  addPassiveDamageEffects(effects, text, defaultConditional);

  return effects;
}

function addPassiveSkillEffects(effects, text, raw, defaultConditional) {
  skillData.forEach((skill) => {
    const variants = skillNameVariants(skill.name);
    variants.forEach((variant) => {
      const regex = new RegExp(`([+-]\\d+(?:[,.]\\d+)?)\\s*(?:em\\s*(?:testes?\\s*de\\s*)?|na\\s*)?${escapeRegExp(variant)}\\b`, "g");
      for (const match of text.matchAll(regex)) {
        addPassiveEffect(effects, {
          target: "skill",
          key: skill.name,
          value: parsePassiveNumber(match[1]),
          label: `${skill.name} ${formatMod(parsePassiveNumber(match[1]))}`,
          conditional: defaultConditional,
        });
      }
    });
  });

  const buscarMatch = text.match(/([+-]\d+(?:[,.]\d+)?)\s*(?:procurar|buscar|busca)/);
  if (buscarMatch) {
    addPassiveEffect(effects, {
      target: "skill",
      key: "Busca Cósmica",
      value: parsePassiveNumber(buscarMatch[1]),
      label: `Busca Cósmica ${formatMod(parsePassiveNumber(buscarMatch[1]))}`,
      conditional: defaultConditional || isConditionalPassiveText(raw),
    });
  }
}

function addPassiveProtectionEffects(effects, text, defaultConditional) {
  for (const match of text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*(?:em\s*)?(jpf|jrf|jpv|jpr)\b/g)) {
    const key = match[2] === "jrf" ? "JPF" : match[2].toUpperCase();
    addPassiveEffect(effects, {
      target: "protection",
      key,
      value: parsePassiveNumber(match[1]),
      label: `${key} ${formatMod(parsePassiveNumber(match[1]))}`,
      conditional: defaultConditional,
    });
  }
}

function addPassiveAttackEffects(effects, text, defaultConditional) {
  for (const match of text.matchAll(/([+-]\d+(?:[,.]\d+)?)\s*(?:em\s*)?(?:jogadas?\s*de\s*)?ataques?\b/g)) {
    const nearby = text.slice(Math.max(0, match.index - 30), match.index + match[0].length + 45);
    addPassiveEffect(effects, {
      target: "attack",
      scope: /\b(corpo a corpo|melee)\b/.test(nearby) ? "melee" : "",
      value: parsePassiveNumber(match[1]),
      label: `Ataques ${formatMod(parsePassiveNumber(match[1]))}`,
      conditional: defaultConditional,
    });
  }
}

function addPassiveDamageEffects(effects, text, defaultConditional) {
  const patterns = [
    /([+-]\d+(?:[,.]\d+)?)\s*(?:em\s*)?jogadas?\s*de\s*dano\b/g,
    /(?:ataques?|armas?)\s+(?:causam?|recebem?)\s*([+-]\d+(?:[,.]\d+)?)\s*(?:de\s*)?dano\b/g,
    /([+-]\d+(?:[,.]\d+)?)\s*(?:de\s*)?dano\s+(?:causado|com armas?)\b/g,
  ];
  patterns.forEach((pattern) => {
    for (const match of text.matchAll(pattern)) {
      const nearby = text.slice(Math.max(0, match.index - 35), match.index + match[0].length + 45);
      if (/\b(sofrer|recebido|recebe|reduz|resistencia)\b/.test(nearby)) continue;
      const value = parsePassiveNumber(match[1]);
      addPassiveEffect(effects, {
        target: "damage",
        scope: /\b(corpo a corpo|melee|desarmad)\b/.test(nearby) ? "melee" : "",
        value,
        label: `Dano ${formatMod(value)}`,
        conditional: defaultConditional,
      });
    }
  });
}

function skillNameVariants(name) {
  const base = normalizeSearch(name);
  const variants = new Set([base]);
  variants.add(base.replace(/\s+cosmic[ao]$/, ""));
  if (base === "percepcao cosmica") variants.add("percepcao");
  if (base === "busca cosmica") variants.add("busca");
  return [...variants].filter(Boolean).sort((a, b) => b.length - a.length);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function abilityPassiveEffects(ability) {
  const saved = normalizePassiveEffects(ability?.passiveEffects);
  if (saved.length) return saved;
  if (ability?.source !== "Chip modificador") return [];
  return inferModifierChipPassiveEffects(ability);
}

function activeModifierPassiveEffects({ includeConditional = false } = {}) {
  return modifierChipEntries()
    .flatMap((ability) => abilityPassiveEffects(ability))
    .filter((effect) => includeConditional || !effect.conditional);
}

function activeEvolutionPassiveEffects({ includeConditional = false } = {}) {
  return (state.current.knownAbilities || [])
    .filter((ability) => ability.source === "Evolução")
    .flatMap((ability) => normalizePassiveEffects(ability.passiveEffects || []))
    .filter((effect) => includeConditional || !effect.conditional);
}

function activeCharacterPassiveEffects({ includeConditional = false } = {}) {
  return [
    ...activeModifierPassiveEffects({ includeConditional }),
    ...activeEvolutionPassiveEffects({ includeConditional }),
  ];
}

function modifierPassiveTotals({ includeConditional = false } = {}) {
  const totals = {
    attributes: ATTRIBUTES.reduce((acc, attr) => ({ ...acc, [attr]: 0 }), {}),
    skills: {},
    protections: {},
    ca: 0,
    movement: 0,
    cubeSlots: 0,
    stressMax: 0,
    cosmosMax: 0,
    cosmosPerLevel: 0,
    attack: 0,
    damage: 0,
  };

  activeCharacterPassiveEffects({ includeConditional }).forEach((effect) => {
    if (effect.target === "attribute" && ATTRIBUTES.includes(effect.key)) totals.attributes[effect.key] += effect.value;
    else if (effect.target === "skill") totals.skills[effect.key] = (totals.skills[effect.key] || 0) + effect.value;
    else if (effect.target === "protection") totals.protections[effect.key] = (totals.protections[effect.key] || 0) + effect.value;
    else if (effect.target in totals && !effect.scope) totals[effect.target] += effect.value;
  });

  return totals;
}

function passiveSkillBonus(skillName) {
  const skills = modifierPassiveTotals().skills;
  if (skills[skillName]) return skills[skillName];
  const normalizedName = normalizeSearch(skillName);
  const match = Object.entries(skills).find(([key]) => normalizeSearch(key) === normalizedName);
  return match ? match[1] : 0;
}

function skillModifier(skill) {
  if (!skill) return 0;
  return attributeModifier(totalAttributes()[skill.attr] || ATTRIBUTE_BASE) + passiveSkillBonus(skill.name);
}

function passiveProtectionBonus(name) {
  const protections = modifierPassiveTotals().protections;
  if (protections[name]) return protections[name];
  const normalizedName = normalizeSearch(name);
  const match = Object.entries(protections).find(([key]) => normalizeSearch(key) === normalizedName);
  return match ? match[1] : 0;
}

function passiveEffectMatchesWeaponScope(effect, weapon, group = classifyWeapon(weapon)) {
  if (!effect.scope) return true;
  if (effect.scope === "melee") return ["blade", "unarmed", "polearm", "blunt", "axe"].includes(group.key);
  return normalizeSearch([weapon?.type, group?.key, group?.label].filter(Boolean).join(" ")).includes(normalizeSearch(effect.scope));
}

function passiveAttackBonus(weapon, group = classifyWeapon(weapon)) {
  const scoped = activeCharacterPassiveEffects()
    .filter((effect) => effect.target === "attack" && effect.scope && passiveEffectMatchesWeaponScope(effect, weapon, group))
    .reduce((sum, effect) => sum + effect.value, 0);
  return (modifierPassiveTotals().attack || 0) + scoped;
}

function passiveDamageBonus(weapon, group = classifyWeapon(weapon)) {
  const scoped = activeCharacterPassiveEffects()
    .filter((effect) => effect.target === "damage" && effect.scope && passiveEffectMatchesWeaponScope(effect, weapon, group))
    .reduce((sum, effect) => sum + effect.value, 0);
  return (modifierPassiveTotals().damage || 0) + scoped;
}

function formatPassiveEffectSummary(effects, { includeConditional = false, empty = "Nenhum" } = {}) {
  const entries = normalizePassiveEffects(effects).filter((effect) => includeConditional || !effect.conditional);
  if (!entries.length) return empty;
  return entries.map((effect) => `${effect.label}${effect.conditional ? " (condicional)" : ""}`).join(", ");
}

function formatBonusSummary(bonus) {
  const parts = ATTRIBUTES
    .filter((attr) => bonus[attr])
    .map((attr) => `${attr} ${formatMod(bonus[attr])}`);
  return parts.length ? parts.join(", ") : "Nenhum";
}

function renderDetailRow(label, value) {
  return `<div class="detail-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function normalizeKnownAbility(ability) {
  const normalized = { ...ability };
  if (normalized.source === "Chip modificador") {
    normalized.passiveEffects = abilityPassiveEffects(normalized);
    normalized.modifierSlots = modifierChipSlotCost(normalized);
    normalized.installed = normalized.installed !== false;
  } else {
    normalized.passiveEffects = normalizePassiveEffects(normalized.passiveEffects);
  }
  return normalized;
}

function migrateStoredArmorDefinitions(character = {}) {
  return reconcileLegacyArmorCatalog(
    character,
    armorData,
    (armor) => domainDefinitionForItem(armor).toJSON()
  );
}

function normalizeCharacter(character) {
  character = migrateStoredArmorDefinitions(character);
  const base = emptyCharacter();
  const race = findRace(character.race);
  const profession = findProfession(character.profession);
  const mergedAttributes = { ...base.attributes, ...(character.attributes || {}) };
  const looksLikeLegacyModifiers = ATTRIBUTES.every((attr) => Math.abs(numberValue(mergedAttributes[attr], ATTRIBUTE_BASE)) <= 6);
  const attributes = ATTRIBUTES.reduce((acc, attr) => {
    const value = numberValue(mergedAttributes[attr], ATTRIBUTE_BASE);
    acc[attr] = looksLikeLegacyModifiers ? ATTRIBUTE_BASE + value : value;
    return acc;
  }, {});
  return {
    ...base,
    ...character,
    race: race.id,
    profession: profession.id,
    racialChoice: defaultRacialChoice(race, character.racialChoice),
    attributes,
    level: numberValue(character.level, 1),
    experience: Math.max(0, numberValue(character.experience, 0)),
    evolutionHistory: Array.isArray(character.evolutionHistory) ? character.evolutionHistory : [],
    permanentPvBonus: Math.max(0, numberValue(character.permanentPvBonus, 0)),
    stressFloor: clamp(numberValue(character.stressFloor, 0), 0, STRESS_MAX),
    bonusTrainedSkills: Math.max(0, numberValue(character.bonusTrainedSkills, 0)),
    pvCurrent: numberValue(character.pvCurrent, 0),
    cosmosCurrent: numberValue(character.cosmosCurrent, 0),
    stress: numberValue(character.stress, 0),
    crackLevel: numberValue(character.crackLevel, 0),
    loadUsed: numberValue(character.loadUsed, 0),
    bodyWeightKg: Math.max(1, numberValue(character.bodyWeightKg, 70)),
    currency: character.currency === undefined ? STARTING_CURRENCY : numberValue(character.currency, 0),
    inventory: Array.isArray(character.inventory) ? character.inventory.map((entry) => {
      const cubeUid = entry.cubeUid || "";
      const inCube = Boolean(entry.inCube);
      const supportSlot = cubeUid || inCube ? "" : entry.supportSlot || "";
      let location = entry.location?.kind ? { ...entry.location } : { kind: LOCATION_KINDS.UNASSIGNED };
      if (!entry.location?.kind) {
        if (entry.uid === character.equippedWeaponUid) location = { kind: LOCATION_KINDS.EQUIPPED, slotId: "mainWeapon" };
        else if (entry.uid === character.equippedArmorUid) location = { kind: LOCATION_KINDS.EQUIPPED, slotId: "armor" };
        else if (cubeUid) location = { kind: LOCATION_KINDS.CUBE, containerId: cubeUid };
        else if (inCube) location = { kind: LOCATION_KINDS.CUBE, containerId: "legacy-cube" };
        else if (supportSlot === "gancho") location = { kind: LOCATION_KINDS.HOOK };
        else if (supportSlot === "coldre") location = { kind: LOCATION_KINDS.HOLSTER };
        else if (supportSlot === "bandoleira") location = { kind: LOCATION_KINDS.BANDOLIER };
      }
      return {
        ...entry,
        cubeUid,
        inCube,
        supportSlot,
        location,
        crackLevel: clamp(numberValue(entry.crackLevel, entry.uid === character.equippedWeaponUid ? character.crackLevel : 0), 0, ITEM_CRACK_MAX),
      };
    }) : [],
    knownAbilities: Array.isArray(character.knownAbilities) ? character.knownAbilities.map(normalizeKnownAbility) : [],
    installedMods: Array.isArray(character.installedMods) ? character.installedMods : [],
    cosmicTrainingSlots: Math.max(0, numberValue(character.cosmicTrainingSlots, 0)),
    cosmicGrimoireSlots: Math.max(0, numberValue(character.cosmicGrimoireSlots, 0)),
    customItems: Array.isArray(character.customItems) ? character.customItems : [],
    customRecords: Array.isArray(character.customRecords) ? character.customRecords : [],
    diceLog: Array.isArray(character.diceLog) ? character.diceLog : [],
    initialAttributeRoll: character.initialAttributeRoll && Array.isArray(character.initialAttributeRoll.rolls)
      ? character.initialAttributeRoll
      : { rolls: [], kept: [] },
    skillTraining: character.skillTraining && typeof character.skillTraining === "object" ? character.skillTraining : {},
    pendingCosmicEffect: ["blessing", "failure"].includes(character.pendingCosmicEffect) ? character.pendingCosmicEffect : "",
    equippedWeaponUid: character.equippedWeaponUid || "",
    equippedArmorUid: character.equippedArmorUid || "",
    domainCharacter: character.domainCharacter && typeof character.domainCharacter === "object"
      ? character.domainCharacter
      : null,
  };
}

function numberValue(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function parseFirstNumber(value) {
  const match = String(value || "").match(/-?\d+/);
  return match ? numberValue(match[0], 0) : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatMod(value) {
  const numeric = numberValue(value, 0);
  return numeric > 0 ? `+${numeric}` : String(numeric);
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "Sem preço";
  return `${value.toLocaleString("pt-BR")} ${CURRENCY_SYMBOL}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatShortTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function dataSlug(value) {
  return String(value || "entrada")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "entrada";
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let diceOverlayTimer = null;
let toastTimer = null;
function showSlotLimitFeedback(type) {
  if (type === "cosmic") {
    const slots = cosmicSpellSlotState();
    showToast(`Sem espaços de magia cósmica disponíveis: ${slots.used}/${slots.total}.`, "cosmic-error");
    return;
  }
  if (type === "tech") {
    const slots = modifierSlotState();
    showToast(`Sem espaço de mods para chip: ${slots.used}/${slots.total}.`, "tech-error");
  }
}

function showToast(message, variant = "") {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.classList.remove("toast-cosmic-error", "toast-tech-error");
  if (variant) el.toast.classList.add(`toast-${variant}`);
  el.toast.classList.add("show");
  toastTimer = setTimeout(() => {
    el.toast.classList.remove("show", "toast-cosmic-error", "toast-tech-error");
  }, 2600);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !["http:", "https:"].includes(window.location.protocol)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

init();
registerServiceWorker();
