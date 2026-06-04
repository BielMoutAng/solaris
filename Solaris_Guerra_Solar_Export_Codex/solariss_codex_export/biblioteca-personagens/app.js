const ATTRIBUTES = ["FOR", "REF", "CON", "MEN", "PRE", "INT"];
const QUICK_TEST_ATTRIBUTES = ATTRIBUTES.filter((attr) => attr !== "CON");
const ATTRIBUTE_BASE = 7;
const ATTRIBUTE_MOD_BASE = 10;
const STORAGE_KEY = "solaris.character.library.v1";
const LEVEL_COSMOS_BASE = { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 4 };
const STRESS_MAX = 7;
const SATURATION_MAX = 10;
const TIER_ORDER = ["F", "E", "D", "C", "B", "A", "S"];

const skillData = [
  { name: "Atletismo", attr: "FOR", summary: "Corrida, salto, escalada, natação, abrir passagens, derrubar portas e erguer objetos." },
  { name: "Briga", attr: "FOR", summary: "Combate desarmado, agarrões, imobilizações, quedas, arremessos e desarmes corpo a corpo. Ataque sem arma usa Briga para 1d6 base." },
  { name: "Demolição", attr: "FOR", summary: "Força bruta contra estruturas e máquinas: derrubar paredes, arrombar cofres, quebrar grades ou arrancar cabos." },
  { name: "Coleta", attr: "FOR", summary: "Usar força para coleta de materiais como minérios, madeira e materiais energéticos." },
  { name: "Furtividade", attr: "REF", summary: "Esconder-se, mover-se em silêncio, camuflagem e infiltração. Para ficar furtivo, supere a percepção passiva do alvo." },
  { name: "Mãos Leves", attr: "REF", summary: "Bater carteiras, abrir fechaduras, desarmar armadilhas e fazer manipulação delicada." },
  { name: "Acrobacia", attr: "REF", summary: "Equilíbrio, saltos difíceis, rolamentos e quedas controladas." },
  { name: "Pilotagem", attr: "REF", summary: "Controle de naves, veículos, exoesqueletos ou máquinas em movimento, incluindo manobras evasivas e combate veicular." },
  { name: "Pés Ágeis", attr: "REF", summary: "Performance artística, dança, fuga e escapar de armadilhas já ativas." },
  { name: "Cosmos", attr: "MEN", summary: "Sentir cosmos: perceber energias, presenças e distúrbios cósmicos." },
  { name: "Memória Cósmica", attr: "MEN", summary: "História e saberes universais ligados ao cosmos, incluindo conhecimentos históricos, mitológicos ou científicos." },
  { name: "Intuição Cósmica", attr: "MEN", summary: "Antecipar eventos e conectar informações de forma instintiva por meio de energias cósmicas." },
  { name: "Percepção Cósmica", attr: "MEN", summary: "Perceber quando algo está errado pelas variações do cosmos. Percepção passiva racial: 10 + MOD MEN." },
  { name: "Busca Cósmica", attr: "MEN", summary: "Procurar itens, rastros ou alvos por energia cósmica e conhecimento relacionado." },
  { name: "Intimidação", attr: "PRE", summary: "Usar presença, voz ou postura para forçar respeito ou medo." },
  { name: "Persuasão", attr: "PRE", summary: "Convencer, negociar, inspirar confiança ou manipular socialmente." },
  { name: "Empatia", attr: "PRE", summary: "Perceber emoções, intenções, mentiras, medo e motivações ocultas." },
  { name: "Acalmar Criatura", attr: "PRE", summary: "Tentar domesticar ou acalmar criatura capaz de compreender o personagem, evitando combate quando ela ataca por medo." },
  { name: "Tecnologia", attr: "INT", summary: "Interagir com sistemas digitais, hackear e obter dados." },
  { name: "Medicina", attr: "INT", summary: "Estancar sangramento, fazer remédios, realizar cirurgias, identificar doenças e estabilizar aliados em 1d4 turnos." },
  { name: "Engenharia", attr: "INT", summary: "Reparar e construir equipamentos, consertar veículos e fazer modificações em oficinas de equipamentos e mods." },
  { name: "Biologia", attr: "INT", summary: "Aprender sobre fauna e flora e descobrir propriedades de plantas e componentes animais." },
  { name: "Culinária", attr: "INT", summary: "Preparar alimentos com os materiais disponíveis: sucesso total prepara tudo, parcial prepara metade, falha não gera alimento comestível." },
];

const protectionData = [
  { name: "JPF", attr: "FOR", attrs: ["FOR", "CON"], summary: "JP física: integridade física, músculos e saúde. Role com MOD FOR ou MOD CON, conforme a situação pedida pelo mestre." },
  { name: "JPV", attr: "PRE", summary: "JP de Vontade: resistir a habilidades cósmicas, efeitos de ambiente e pressão mental." },
  { name: "JPR", attr: "REF", summary: "JP de Reflexo: tempo de reação, esquiva, explosões, quedas, armadilhas e situações rápidas." },
];

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
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["adaptável", "explorador", "+1 atributo"],
    summary: "Adaptáveis, curiosos e exploradores. Escolhem qualquer atributo para receber +1 e uma sub-habilidade ligada a essa escolha.",
    profile: {
      age: "100-120 anos / maturidade aos 18",
      build: "1,75m / 70-90 kg",
      attributeBonus: "+1 em qualquer atributo",
      documentCosmos: "Tabela V2: 1; ficha padrão: 0",
      culture: "Adaptáveis, curiosos e exploradores.",
      baseAbility: "Entendem tom de voz; 1x por descanso rápido podem receber vantagem em teste social ou narrativo ligado à leitura de intenção.",
      weakness: "Vulneráveis a doenças alienígenas: -1 em testes de resistência contra doenças e contaminações.",
      skill: "Escolhem 1 sub-habilidade do atributo escolhido e recebem +1 nela.",
      note: "Boa raça flexível para jogadores novos.",
    },
    progression: [
      { level: "LV1", title: "Experte", text: "Escolhe 1 perícia para dobrar o valor 1x por dia." },
      { level: "LV3", title: "Apego à Vida", text: "1x por descanso longo, faz teste contra morte com vantagem." },
      { level: "LV5", title: "Olhar de Radiação", text: "Passa a enxergar calor emitido por seres vivos." },
      { level: "LV7", title: "Experte", text: "Escolhe 1 atributo para dobrar o valor em situação específica definida pelo mestre." },
      { level: "LV9", title: "Trapaça", text: "Pode rerrolar teste em atributo treinado 1x por descanso curto." },
      { level: "LV10", title: "Evolução Cósmica", text: "Transforma uma falha em sucesso gastando todos os pontos de Cosmos." },
    ],
    documentNotes: [
      "A Tabela Solaris V2 registra Cosmos racial 1 para Humanis, mas a ficha padrão automática registra bônus de Cosmos 0. O cálculo atual da ficha usa 0.",
      "A própria tabela recomenda evitar atributo dobrado permanente; o efeito foi mantido como uso limitado por descanso ou situação do mestre.",
    ],
  },
  {
    id: "veyrkan",
    name: "Veyrkan",
    bonus: {},
    choice: { label: "Atributo racial", options: ["PRE", "REF"], amount: 1 },
    ca: 4,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["anfíbio", "cooperação", "PRE ou REF"],
    summary: "Anfíbios e cooperativos, com memória coletiva. Ficam 10 minutos sem oxigênio e escolhem PRE ou REF para receber +1.",
    profile: {
      age: "Até 150 anos / maturidade aos 16",
      build: "1,80m / ~80 kg",
      attributeBonus: "+1 PRE ou +1 REF",
      documentCosmos: "0",
      culture: "Anfíbios, cooperativos, com memória coletiva e adaptação ao grupo.",
      baseAbility: "Ficam 10 minutos sem oxigênio.",
      weakness: "Troca de pele: em algum momento do dia precisam de 1 turno para trocar a pele.",
      skill: "Escolhem 1 perícia de PRE ou REF.",
      note: "Use PRE no lugar do antigo ESP.",
    },
    progression: [
      { level: "LV1", title: "Amigável", text: "Torna-se o alvo menos perigoso; se estiver ao lado de aliado, inimigos priorizam outro." },
      { level: "LV3", title: "Secreção da Pele", text: "1x por descanso curto, usa secreção para estancar feridas." },
      { level: "LV5", title: "Coaxar Hipnótico", text: "Aliados recebem +1d4 no ataque por 10 turnos." },
      { level: "LV7", title: "Liso", text: "Todo dano de concussão é reduzido pela metade." },
      { level: "LV9", title: "Membro Extra", text: "Pode manifestar tentáculos, pernas de sapo ou olhos precisos." },
      { level: "LV10", title: "Perfeitamente Liso", text: "Não recebe dano de concussão." },
    ],
    documentNotes: [
      "A Tabela Solaris V2 trata o bônus como escolha entre PRE ou REF; a ficha padrão fixa +1 PRE e +1 REF. O app mantém a versão de escolha para criação de personagem.",
      "Olhos precisos com +5 aparece como ponto sensível de balanceamento; sugestão oficial: limitar a +2 ou 1x/cena.",
    ],
  },
  {
    id: "zerak",
    name: "Zerak",
    bonus: { REF: -1 },
    choice: { label: "Atributo racial", options: ["FOR", "CON"], amount: 2 },
    ca: 6,
    cosmos: 0,
    movement: 0,
    cubeBonus: 0,
    tags: ["força", "disciplina", "+2 FOR/CON"],
    summary: "Disciplina, hierarquia e força como status. Escolhem FOR ou CON para receber +2 e sofrem -1 em REF.",
    profile: {
      age: "Até 120 anos / maturidade aos 15",
      build: "1,85m / 110-130 kg",
      attributeBonus: "+2 FOR ou +2 CON, -1 REF",
      documentCosmos: "0",
      culture: "Disciplina, hierarquia, força como status e resistência física.",
      baseAbility: "Não sofrem penalidade por carga até 150%.",
      weakness: "Recebem +1 de dano contra ataques cósmicos e energéticos.",
      skill: "Escolhem 1 perícia de FOR. A antiga ignorância em REF pode ser opcional do mestre.",
      note: "Boa raça tanque/brutamontes.",
    },
    progression: [
      { level: "LV1", title: "Duro como Pedra", text: "Se não se mover no turno, ganha +1 CA até se mover ou ser movido." },
      { level: "LV3", title: "Energia da Rocha", text: "1x por descanso longo, ao cair a 0 PV fica desacordado por 4h em vez de morrer imediatamente." },
      { level: "LV5", title: "Sentir a Terra", text: "Não é pego em turno surpresa." },
      { level: "LV7", title: "Bom de Briga", text: "Ataques desarmados recebem +1d8 de dano." },
      { level: "LV9", title: "Força Motriz", text: "Move 3 m e realiza 2 ataques com +1d4 por ataque." },
      { level: "LV10", title: "Carne de Pedra", text: "Imune a dano perfurante e sangramento." },
    ],
    documentNotes: [
      "A Tabela Solaris V2 permite escolher +2 FOR ou +2 CON com -1 REF; a ficha padrão fixa +2 FOR e -1 REF. O app mantém a escolha FOR/CON.",
      "A imunidade total do LV10 é forte, mas a nota organizada indica que condiz com fim de campanha.",
    ],
  },
  {
    id: "kairi",
    name: "Kairi",
    bonus: {},
    choice: { label: "Atributo racial", options: ["REF", "MEN"], amount: 1 },
    ca: 3,
    cosmos: 2,
    movement: 0,
    cubeBonus: 0,
    tags: ["cosmos", "suporte", "REF ou MEN"],
    summary: "Espirituais e ligados ao equilíbrio do Cosmos. Escolhem REF ou MEN para receber +1 e têm +2 Cosmos racial.",
    profile: {
      age: "Até 180 anos / maturidade aos 20",
      build: "1,70m / 60-75 kg",
      attributeBonus: "+1 REF ou +1 MEN",
      documentCosmos: "Tabela V2: 2; ficha padrão: 0",
      culture: "Espirituais, ligados ao equilíbrio do Cosmos.",
      baseAbility: "Sentem variações energéticas no ambiente.",
      weakness: "Consomem 2x mais saciedade por fase do dia.",
      skill: "Escolhem 1 perícia de REF ou MEN.",
      note: "Boa raça para cosmos, suporte e sensibilidade.",
    },
    progression: [
      { level: "LV1", title: "Ser Cósmico", text: "Pode usar uma habilidade sem gastar Cosmos entre Golpe de Energia ou Sono." },
      { level: "LV3", title: "Proficiência Cósmica", text: "Habilidades cósmicas Tier F são conjuradas com 1 ponto de Cosmos acima." },
      { level: "LV5", title: "Sono Cósmico", text: "Recupera metade dos pontos de Cosmos em descanso curto." },
      { level: "LV7", title: "Clone", text: "Ao chegar à metade da vida, cria clone com 15 PV." },
      { level: "LV9", title: "Proficiência Cósmica", text: "Habilidades Tier F são usadas com máximo de pontos gastando 1 Cosmos." },
      { level: "LV10", title: "Onipresença Cósmica", text: "Ataques aliados dão +4 de dano cósmico." },
    ],
    documentNotes: [
      "A Tabela Solaris V2 registra +2 Cosmos e escolha entre REF ou MEN; a ficha padrão fixa +1 REF, +1 MEN e registra bônus de Cosmos 0. O app mantém a versão organizada: escolha REF/MEN e +2 Cosmos.",
      "A nota organizada pede monitorar o dano em grupo; Onipresença Cósmica pode virar aura 1x/cena para balancear.",
    ],
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
    talent: "Estabilizar Rápido — estabiliza um aliado como ação bônus e cura +1d4 PV 1×/cena.",
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
    talent: "Desjam — remove Jammed de 1 arma/console como ação bônus 1×/cena.",
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
    focus: "+1 em Presença/presságios",
    skill: "Intuição Cósmica",
    talent: "Eco Cósmico — 1×/cena, converte +1 Estresse que receberia em +1 no próximo teste de PRE.",
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
    focus: "+1 em Mãos Leves",
    skill: "Mãos Leves",
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
    focus: "+1 em Percepção",
    skill: "Percepção Cósmica",
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
    penalty: "Curiosidade Perigosa — ao ver criatura/material novo, falha em MEN CD 10 perde ação bônus.",
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
    skill: "Pés Ágeis",
    talent: "Ritmo de Guerra — 1×/cena, aliados a 6 m ganham +1 no próximo teste por 5 rodadas.",
    kit: "Instrumento compacto.",
    penalty: "Ritmo Visado — enquanto tocar, sofre −1 CA.",
    notes: "Como não há perícia Performance fixa, foi mapeado para Pés Ágeis.",
    cubeBonus: 0,
    tags: ["moral", "suporte"],
    summary: "Chip de moral, ritmo de combate e suporte de grupo.",
  },
  {
    id: "artista",
    name: "Artista",
    focus: "+1 em Atuação/Enganar",
    skill: "Persuasão",
    talent: "Máscara Social — 1×/cena, vantagem numa interação social curta.",
    kit: "Tintas/patches para marcações discretas.",
    penalty: "Ego Performático — após sucesso completo social, −1 em outro teste social no turno seguinte.",
    notes: "Como não há perícia Atuação fixa, foi mapeado para Persuasão.",
    cubeBonus: 0,
    tags: ["social", "persuasão"],
    summary: "Chip social para atuação, enganação e presença em cena.",
  },
  {
    id: "catador-sucatas",
    name: "Catador de Sucatas",
    focus: "+1 em Busca",
    skill: "Busca Cósmica",
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
    talent: "Troca Tática — 1×/cena, recarrega como ação bônus.",
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
    talent: "Troca Tática — 1×/cena, recarrega como ação bônus.",
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
    talent: "Flow — acertar no alcance máximo dá +3 no próximo ataque.",
    kit: "Coldre de coxa.",
    penalty: "Foco Estático — se mover, −1 em Percepção para localizar alvos.",
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
    talent: "Troca Tática — 1×/cena, recarrega como ação bônus.",
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
    talent: "Troca Tática — 1×/cena, recarrega como ação bônus.",
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
    talent: "Atordoar — 1×/combate, alvo testa MEN CD 12 ou fica Atordoado e −2 CA.",
    kit: "Correia de pulso.",
    penalty: "Retorno Lento — após usar Atordoar, inimigos têm vantagem para acertá-lo.",
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
    penalty: "Pressa de Mão Dupla — se atacar com outra mão, JR de FOR −1 até próximo turno.",
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

const officialItemRows = Array.isArray(globalThis.SOLARIS_OFFICIAL_ITEMS)
  ? globalThis.SOLARIS_OFFICIAL_ITEMS
  : [];

const itemData = officialItemRows.map((item) => ({
  ...item,
  category: "item",
  tags: Array.isArray(item.tags) && item.tags.length ? item.tags : ["item"],
}));

const weaponData = [
  { id: "arma-bastao-carbonita", category: "weapon", name: "Bastão de Carbonita", tier: "F", type: "Concussão", damage: "1d4", mods: 0, weight: "2 Kg", price: 2000, tags: ["frágil"], summary: "Muito frágil; quebra rápido." },
  { id: "arma-bastao-ferrita", category: "weapon", name: "Bastão de Ferrita", tier: "F", type: "Concussão", damage: "1d4", mods: 0, weight: "4 Kg", price: 5000, tags: ["pesado"], summary: "Pesado para dano baixo." },
  { id: "arma-bastao-paralatum", category: "weapon", name: "Bastão de poeira estelar com Paralatum", tier: "F", type: "Concussão", damage: "1d4", mods: 1, weight: "2 Kg", price: 10000, tags: ["canalizador"], summary: "Serve como canalizador cósmico e permite escolher 3 habilidades de 1 Cosmos." },
  { id: "arma-espada-ferrita", category: "weapon", name: "Espada de Ferrita", tier: "F", type: "Cortante", damage: "1d6", mods: 1, weight: "3 Kg", price: 12000, tags: ["simples"], summary: "Arma comum em colônias." },
  { id: "arma-adaga-pralatum", category: "weapon", name: "Adaga de Pralatum", tier: "F", type: "Cortante", damage: "1d6+1", mods: 0, weight: "0,5 Kg", price: 7000, tags: ["REF"], summary: "Usa MOD de REF para atacar." },
  { id: "arma-faca-ferrita", category: "weapon", name: "Faca Ferrita Padrão", tier: "E", type: "Cortante", damage: "1d6", mods: 1, weight: "0,8 Kg", price: 4000, tags: ["campo"], summary: "Usada em campo, confiável e durável." },
  { id: "arma-lanca-carbonita", category: "weapon", name: "Lança de Carbonita", tier: "E", type: "Perfurante", damage: "1d6", mods: 0, weight: "2,5 Kg", price: 4000, tags: ["alcance"], summary: "Básica, mas tem alcance extra." },
  { id: "arma-espada-curta-pralatum", category: "weapon", name: "Espada Curta de Pralatum", tier: "E", type: "Cortante", damage: "1d6+1", mods: 1, weight: "3 Kg", price: 3000, tags: ["equilibrada"], summary: "Boa para uso geral." },
  { id: "arma-maca-ferrita", category: "weapon", name: "Maça de Ferrita", tier: "E", type: "Concussão", damage: "1d6", mods: 1, weight: "5 Kg", price: 2500, tags: ["impacto"], summary: "Arma simples de concussão." },
  { id: "arma-lanca-aco", category: "weapon", name: "Lança de Aço", tier: "E", type: "Perfurante", damage: "1d8", mods: 1, weight: "4 Kg", price: 6000, tags: ["alcance"], summary: "Alcance médio; ataca com 1 quadrado de distância." },
  { id: "arma-espada-longa-pralatum", category: "weapon", name: "Espada Longa de Pralatum", tier: "E", type: "Cortante", damage: "1d6", mods: 2, weight: "4 Kg", price: 7000, tags: ["oficial"], summary: "Arma padrão de oficiais." },
  { id: "arma-martelo-guerra", category: "weapon", name: "Martelo de Guerra Reforçado", tier: "E", type: "Concussão", damage: "1d10", mods: 1, weight: "8 Kg", price: 10000, tags: ["crítico"], summary: "Derruba inimigos em críticos por 1 rodada." },
  { id: "arma-lanca-krun-ferrita", category: "weapon", name: "Lança Laminada Krun-Ferrita", tier: "E", type: "Perfurante", damage: "1d10", mods: 2, weight: "3,5 Kg", price: 12000, tags: ["canalizador"], summary: "Permite escolher 1 habilidade de 2 Cosmos e pode canalizar Cosmos." },
  { id: "arma-pistola-ferrita", category: "weapon", name: "Pistola de Ferrita", tier: "F", type: "Perfurante", damage: "1d4", mods: 0, weight: "0,5 Kg", price: 1500, tags: ["2-8 m"], summary: "Carregador com 6 munições." },
  { id: "arma-revolver-sucata", category: "weapon", name: "Revólver de Sucata Seis-Fendas", tier: "F", type: "Perfurante", damage: "1d4", mods: 0, weight: "0,9 Kg", price: 3000, tags: ["2-8 m"], summary: "Tambor com 6 munições." },
  { id: "arma-rifle-olho-nyx", category: "weapon", name: "Rifle de Precisão Olho de Nyx", tier: "E", type: "Perfurante", damage: "2d6", mods: 2, weight: "4,2 Kg", price: 15000, tags: ["4-20 m"], summary: "Carregador 5; entre 12 e 16 m, +1 dano." },
];

const armorData = [
  { id: "armadura-malha-carbonita", category: "armor", name: "Armadura de Malha Carbonita", tier: "F", kind: "CaC", ca: 8, mods: 1, weight: "25 Kg", price: 60, tags: ["corpo a corpo"], summary: "Proteção reforçada para linha de frente." },
  { id: "armadura-peitoral-kudrog", category: "armor", name: "Peitoral de Couro de Kudrog", tier: "F", kind: "Ranged", ca: 5, mods: 1, weight: "10 Kg", price: 40, tags: ["leve"], summary: "Projetado para atiradores; aumenta mobilidade." },
  { id: "armadura-sucatas", category: "armor", name: "Armadura de Sucatas", tier: "F", kind: "Suporte", ca: 6, mods: 2, weight: "20 Kg", price: 15, tags: ["utilitária"], summary: "2 ganchos fixos e interface de rede com 1 RAM." },
  { id: "armadura-aco-pralatum", category: "armor", name: "Armadura de Aço Pralatum", tier: "E", kind: "CaC", ca: 8, mods: 2, weight: "28 Kg", price: 15000, tags: ["frontal"], summary: "Boa defesa em combate fechado." },
  { id: "armadura-colete-carbonita", category: "armor", name: "Colete Tático de Carbonita", tier: "E", kind: "Ranged", ca: 6, mods: 1, weight: "12 Kg", price: 90, tags: ["leve"], summary: "Projetado para manobras rápidas." },
  { id: "armadura-vestes-fluxo", category: "armor", name: "Vestes de Fluxo Estelar", tier: "E", kind: "Cósmica", ca: 5, mods: 2, cosmos: 2, weight: "9 Kg", price: 100, tags: ["cosmos"], summary: "Permite escolher 2 habilidades de 1 consumo cósmico." },
  { id: "armadura-traje-ferrita", category: "armor", name: "Traje Modular de Ferrita", tier: "E", kind: "Suporte", ca: 6, mods: 3, weight: "22 Kg", price: 80, tags: ["utilitária"], summary: "3 slots utilitários e interface com 2 RAM." },
  { id: "armadura-couraca-leviata", category: "armor", name: "Couraça Leviatã de Ktaluhl", tier: "S", kind: "CaC", ca: 12, mods: 4, weight: "40 Kg", price: 10000000, tags: ["lendária"], summary: "Contra-ataca 1x/rodada ao sofrer dano corpo a corpo." },
  { id: "armadura-traje-nulo", category: "armor", name: "Traje Nulo Mira de Uryon", tier: "S", kind: "Ranged", ca: 7, mods: 4, weight: "30 Kg", price: 10000000, tags: ["sniper"], summary: "Ignora distância mínima e pode tratar ataque recebido como erro automático." },
  { id: "armadura-manto-falaris", category: "armor", name: "Manto de Falaris", tier: "S", kind: "Cósmica", ca: 6, mods: 5, cosmos: 4, weight: "12 Kg", price: 10000000, tags: ["cosmos"], summary: "Disparo potencializado e alto suporte cósmico." },
  { id: "armadura-serafim", category: "armor", name: "Armadura Serafim de Emergência", tier: "S", kind: "Suporte", ca: 8, mods: 6, weight: "38 Kg", price: 10000000, tags: ["suporte"], summary: "Intercepta ataques, cura aliados e opera itens por braços mecânicos." },
];

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
  [3, "Dominação Mental", "Alvo em até 10 m faz ESP CD 15; em falha, fica sob influência por 1 turno.", "1 turno"],
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
  [8, "Cadeia de Julgamento", "1 alvo disputa MEN/JRC; falha atordoa e causa 4d8, parcial aplica -2 CA.", "1 turno"],
  [8, "Portal de Extração", "Teleporta você e até 2 aliados a 3 m para um ponto visto a 60 m.", "Instantânea"],
  [8, "Reanimação de Campo", "Alvo a 10 m em 0 PV volta com 2d12 PV e fica Saturado por 1 cena.", "Instantânea"],
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
  [10, "Apagamento do Medo", "Até 4 aliados removem Medo/Terror, reduzem -4 Estresse e ganham vantagem em JRE.", "1 cena"],
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

const modifierChipRows = [
  ["F", "Passos rápidos", "Deslocamento +1 m"],
  ["F", "Pernas elásticas", "Pulo +1 m"],
  ["F", "Pulmões reforçados", "Respira +10 min embaixo d'água"],
  ["F", "Pele de Veyrkan", "Pele úmida (-1 concussão)"],
  ["F", "Pele dura", "+1 de CA no primeiro turno"],
  ["F", "Visão noturna simples", "Enxerga 10 m no escuro"],
  ["F", "Unhas reforçadas", "Dano desarmado 1 cortante"],
  ["F", "Pele endurecida", "+1 PV temporário por descanso"],
  ["F", "Corrida básica", "+1,5 m extra por rodada"],
  ["F", "Ossos rígidos", "Reduz 1 de dano em quedas leves"],
  ["F", "Tato fino", "+1 procurar objetos pequenos"],
  ["F", "Mãos firmes", "+1 em jogadas de ataque"],
  ["F", "Instinto alerta", "+1 percepção para não ser surpreendido"],
  ["F", "Estômago adaptado", "Ignora comida estragada"],
  ["F", "Audição aguçada", "Vantagem em Percepção para detectar sons à distância"],
  ["F", "Músculos tensos", "Carrega +1 Cubo"],
  ["F", "Voz firme", "+1 persuasão"],
  ["F", "Respiração ritmada", "+1 em testes de atletismo"],
  ["F", "Olhos atentos", "+1 na jogada de ataque em inimigos até 6 m"],
  ["F", "Calos nas mãos", "Ignora penalidade de armas improvisadas"],
  ["F", "Reflexo básico", "+1 de CA para armaduras feitas por tecido"],
  ["F", "Equilíbrio estável", "Reduz chance de queda (-1 em CD ou +1 em testes)"],
  ["F", "Pulso frio", "Em 1 natural, role 1d4; em 4 ignora penalidade"],
  ["F", "Nadador iniciante", "Aumenta 3 m de nado em águas calmas"],
  ["F", "Pele resistente ao sol", "Ignora insolação leve"],
  ["F", "Orientação simples", "+1 pilotagem em áreas urbanas/corredores"],
  ["F", "Orientação cósmica fraquíssima", "Escolhe 3 habilidades cósmicas de custo base 1"],
  ["F", "Primeiros socorros", "Pode sacrificar movimento para fazer teste de medicina no próprio turno"],
  ["E", "Surto de energia", "1x/dia repete última ação se tiver condições"],
  ["E", "Escudo temporário", "2 PV temporários por descanso rápido, não podem ser curados"],
  ["E", "Passos silenciosos", "Pode usar a ação Esconder-se como bônus"],
  ["E", "Reflexo de Gatyiuk", "+1 REF"],
  ["E", "Força de Graluk", "+1 FOR"],
  ["E", "Espírito de Yndra", "+1 ESP"],
  ["E", "Mente de Khorl", "+1 MEN"],
  ["E", "Pele Mutável", "Altera aparência superficial 1x/dia"],
  ["E", "Instinto Predador", "Escolhe inimigo prioritário; +1 ataque contra ele por descanso rápido"],
  ["E", "Poliglota Cósmico", "Aprende 2 idiomas adicionais"],
  ["E", "Marca da Presa", "1x/combate marca alvo; +1 rastreamento/dano"],
  ["E", "Lâmina de Luz", "Invoca lâmina cósmica 1d6, custa 1 Cosmos"],
  ["E", "Estouro Cósmico", "Explosão em área 3 m, 1d4 cósmico, custa 1 Cosmos"],
  ["E", "Toque Curativo", "Cura 1d4 PV em toque, custa 1 Cosmos"],
  ["E", "Disparo de Fóton", "Disparo cósmico 1d6 até 16 m, custa 1 Cosmos"],
  ["E", "Faísca Persistente", "Gera luz fraca de 10 m mesmo sem Cosmos"],
  ["E", "Aura de Repulsa", "Inimigos gastam +1 m para atravessar em 2 m"],
  ["E", "Centelha de Dano", "Ataques desarmados dão +1 de dano cósmico mesmo sem Cosmos"],
  ["E", "Fluxo Instável", "Ao chegar a 0 Cosmos, causa 1d6 de dano cósmico em 1,5 m"],
  ["E", "Choque Ventricular", "Ao chegar a 0 PV, revive com 1 PV; 1x/descanso longo"],
  ["E", "Vínculo Mental", "Telepatia simples com 1 aliado em até 9 m"],
  ["E", "Pulso de Eco", "Sonar de 9 m revela corredores/salas 1x por dia"],
  ["E", "Regeneração Lenta", "+1 PV adicional em descansos curtos"],
  ["E", "Pulso Estimulante", "1x/combate aliado a 6 m ganha +1 em ataque por 5 rodadas"],
  ["E", "Campo de Estabilidade", "Aliados ignoram terreno difícil em 3 m"],
  ["E", "Marca de Alvo", "1x/descanso curto marca inimigo; aliados +1 ataque contra ele"],
  ["E", "Pulso Desestabilizador", "Inimigo a 6 m tem desvantagem no próximo ataque por 5 turnos"],
  ["E", "Orientação cósmica fraquíssima", "Escolhe 2 habilidades cósmicas de custo base 2"],
  ["D", "Nervo Estabilizador", "+1 em JRF"],
  ["D", "Pulso Antecipado D-02", "1x/combate, trate a Iniciativa como se tivesse rolado +2"],
  ["D", "Filtro Neural D-03", "Falhar em testes não gera estresse"],
  ["D", "Trava de Mira D-04", "+1 para acertar o mesmo alvo em sequência"],
  ["D", "Sinapse Cinética D-05", "+1 m de deslocamento após atacar"],
  ["D", "Reflexo de Impacto D-06", "+1 de CA"],
  ["D", "Anel de Memória D-07", "+1 em Memória Cósmica e testes de lore técnico"],
  ["D", "Equalizador de Estresse D-08", "1x/dia consome 1 de estresse para 1d4 pontos de vida"],
  ["D", "Condutor Fino D-09", "+1 para ataques com cosmos"],
  ["D", "Servo de Precisão D-10", "+1d4 de dano no primeiro ataque da cena"],
  ["C", "Matriz Autônoma C-01", "1x/combate, converta uma ação simples em ação bônus"],
  ["C", "Campo Inercial C-02", "1x/combate, reduza 1d6 de dano recebido"],
  ["C", "Nó de Consistência C-03", "Ao conseguir sucesso total em teste, ganha vantagem no próximo teste"],
  ["C", "Foco de Guerra C-04", "+1 em ataques e CA enquanto PV <= 50%"],
  ["C", "Regulador Neural C-05", "Estresse máximo aumenta em +1"],
  ["C", "Eco Tático C-06", "1x/combate, como ação bônus, repita um ataque falho"],
  ["C", "Canalizador Avançado C-07", "+1 ponto/lvl de Cosmos total"],
  ["C", "Lente Predatória C-08", "Vantagem 1x/descanso rápido em Percepção ou Busca"],
  ["C", "Blindagem Sináptica C-09", "1x/descanso rápido, ignore efeito mental recebido"],
  ["C", "Núcleo de Decisão C-10", "1x/cena, +2 em um teste após ver o resultado"],
];

const modifierChipData = modifierChipRows.map(([rank, name, summary]) => ({
  id: `chipmod-${rank.toLowerCase()}-${dataSlug(name)}`,
  category: "chip-mod",
  name,
  rank,
  summary,
  tags: ["chip modificador", `rank ${rank}`],
}));

const monsterData = [
  { name: "Predador territorial", tier: "Baixo", type: "Besta", tags: ["emboscada", "rastros"], summary: "Ameaça de exploração externa, normalmente foge quando ferida demais." },
  { name: "Drone batedor", tier: "Baixo", type: "Máquina", tags: ["rede", "alarme"], summary: "Vigia rotas, marca alvos e aumenta o risco de patrulhas próximas." },
  { name: "Sombra no escuro", tier: "Médio", type: "Anomalia", tags: ["medo", "surpresa"], summary: "Aparece em locais instáveis e pressiona MEN antes do ataque." },
  { name: "Enxame", tier: "Variável", type: "Criatura", tags: ["grupo", "movimento"], summary: "Várias criaturas pequenas que atrapalham deslocamento e concentração." },
];

const ruleData = [
  { name: "Rolagem padrão", tags: ["3d6", "modificador"], summary: "Role 3d6 + atributo/perícia + modificador situacional. 3 a 9 falha, 10 a 14 sucesso parcial, 15 a 18 sucesso completo." },
  { name: "Estresse e colapso", tags: ["estresse", "2d6"], summary: "Enquanto o Estresse fica em 5 ou menos, a Tríade usa 3d6. Em 6 ou mais, a rolagem cai para 2d6 + modificadores." },
  { name: "Bênção Cósmica", tags: ["4-5-6", "bônus"], summary: "Com 3d6 ativos, a sequência 4, 5, 6 gera +1d4 futuro. Apenas um bônus fica guardado por vez." },
  { name: "Falha Cósmica", tags: ["3-2-1", "risco"], summary: "Com 3d6 ativos, a sequência 3, 2, 1 aplica -1d4 na próxima rolagem e pode causar rachadura ou Estresse." },
  { name: "Level up", tags: ["espinha artificial", "evolução"], summary: "A evolução usa materiais, custo em PO, tempo de procedimento e rolagem de benefício do nível." },
];

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
  { name: "Descansar", context: "Timeskip", tags: ["cura", "estresse"], summary: "Recupere recursos, reduza estresse, trate ferimentos e estabilize saturação conforme a mesa." },
  { name: "Viajar", context: "Fora de combate", tags: ["exploração"], summary: "Defina rota, marcha, vigias, suprimentos, ritmo e riscos de encontro." },
  { name: "Comprar ou vender", context: "Fora de combate", tags: ["economia"], summary: "Negocie equipamento, venda itens do inventário e atualize dinheiro da ficha." },
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
    summary: "Escolha 2 perícias treinadas livres. O chip concede um foco profissional. O mestre pode permitir 1 ignorância para ganhar mais 1 perícia.",
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
  ["PV inicial", "8 + bônus de CON, com a ficha digital calculando o PV máximo atual"],
  ["CA", "4 + MOD REF + armadura + raça + mods + cobertura"],
  ["Cosmos", "Base do nível + MOD MEN + raça + equipamento/mod"],
  ["Movimento", "6 m + MOD REF + ajustes raciais/equipamento"],
  ["Iniciativa", "Rolagem de iniciativa do app usa o perfil atual de dados + REF"],
  ["Cubos", "5 + MOD FOR + raça + profissão"],
];

const characterCreationChecklist = [
  "Nome, conceito, origem e objetivo pessoal",
  "Raça, atributo racial, idioma, habilidade e fraqueza",
  "Atributos distribuídos e modificadores conferidos",
  "Chip de profissão com foco, talento, kit e penalidade",
  "Perícias treinadas e ignorância, se o mestre permitir",
  "PV atual/máximo, CA, Cosmos, movimento, cubos e iniciativa",
  "Arma inicial Tier F e armadura inicial Tier F",
  "Kit de suprimento, kit da profissão, dinheiro inicial e anotações",
  "Ligação com outro personagem ou com a missão inicial",
  "Ficha salva e, se quiser compartilhar, exportada em JSON",
];

const libraryMap = {
  racas: { title: "Raças", kicker: "Povos de Tarantus", items: raceData },
  profissoes: { title: "Profissões", kicker: "Chips de função", items: professionData },
  magias: { title: "Magias cósmicas", kicker: "Tabela Cósmica", items: cosmicSpellData, learn: "cosmos" },
  chipsMod: { title: "Chips modificadores", kicker: "Mods por ranking", items: modifierChipData, learn: "chip-mod" },
  armas: { title: "Armas", kicker: "Tiers e dano", items: weaponData, market: true },
  armaduras: { title: "Armaduras", kicker: "CA e mods", items: armorData, market: true },
  itens: { title: "Itens", kicker: "Equipamentos e cubo", items: itemData, market: true },
  monstros: { title: "Monstros", kicker: "Ameaças de mesa", items: monsterData },
  regras: { title: "Regras", kicker: "Sistema base", items: ruleData },
  acoes: { title: "Ações possíveis", kicker: "Combate, cena e downtime", items: actionData },
};

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
  origin: "",
  attributes: { FOR: ATTRIBUTE_BASE, REF: ATTRIBUTE_BASE, CON: ATTRIBUTE_BASE, MEN: ATTRIBUTE_BASE, PRE: ATTRIBUTE_BASE, INT: ATTRIBUTE_BASE },
  pvCurrent: 8,
  cosmosCurrent: 0,
  stress: 0,
  saturation: 0,
  crackLevel: 0,
  weapon: "",
  armor: "",
  loadUsed: 0,
  currency: 0,
  inventory: [],
  knownAbilities: [],
  customItems: [],
  diceLog: [],
  initialAttributeRoll: { rolls: [], kept: [] },
  skillTraining: {},
  vitalSigns: {},
  vitalResources: {},
  conditions: {},
  bodyParts: {},
  equippedWeaponUid: "",
  equippedArmorUid: "",
  photoDataUrl: "",
  photoName: "",
  abilities: "",
  notes: "",
});

const state = {
  activeView: "personagens",
  activeLibrary: "racas",
  activeRaceId: null,
  activeCharacterPage: "ficha",
  navExpanded: false,
  pendingTest: null,
  manualImageDataUrl: "",
  manualImageName: "",
  current: emptyCharacter(),
  saved: [],
};

const el = {
  form: document.querySelector("#characterForm"),
  navList: document.querySelector(".nav-list"),
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
  testBonus: document.querySelector("#testBonus"),
  testMode: document.querySelector("#testMode"),
  equipmentWallet: document.querySelector("#equipmentWallet"),
  cubeUsagePill: document.querySelector("#cubeUsagePill"),
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
  toast: document.querySelector("#toast"),
};

function init() {
  installIcons();
  syncNavState();
  hydrateSelects();
  hydrateAttributes();
  hydrateQuickTests();
  applyManualTemplate();
  loadSaved();
  bindEvents();
  renderForm();
  renderSavedList();
  renderSummary();
  renderLibrary();
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
    <article class="attribute-cell">
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
  el.quickTestGrid.innerHTML = `
    <section class="quick-test-section">
      <h4>Perícias por atributo</h4>
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
  const modifier = attributeModifier(totalAttributes()[skill.attr] || ATTRIBUTE_BASE);
  return `
    <div class="skill-training-row">
      <button class="quick-test-button skill-test-button" type="button" title="${escapeHtml(skill.summary)}" aria-label="${escapeHtml(`${skill.name} ${formatMod(modifier)}. ${skill.summary}`)}" data-test-roll data-test-kind="Perícia" data-test-name="${escapeHtml(skill.name)}" data-test-attr="${escapeHtml(skill.attr)}">
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
    node.textContent = formatMod(attributeModifier(totals[attr] || ATTRIBUTE_BASE));
  });
}

function renderQuickTestButton(kind, item) {
  return `
    <button class="quick-test-button" type="button" data-test-roll data-test-kind="${escapeHtml(kind)}" data-test-name="${escapeHtml(item.name)}" data-test-attr="${escapeHtml(item.attr)}">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.attr)} - ${escapeHtml(item.summary)}</span>
    </button>
  `;
}

function renderProtectionTestButton(item) {
  const attrs = item.attrs || [item.attr];
  if (attrs.length === 1) return renderQuickTestButton("Proteção", item);

  return `
    <article class="protection-choice-card">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.summary)}</span>
      </div>
      <div class="protection-choice-actions" aria-label="Escolha o atributo da ${escapeHtml(item.name)}">
        ${attrs.map((attr) => `
          <button class="mini-button" type="button" data-test-roll data-test-kind="Proteção" data-test-name="${escapeHtml(item.name)}" data-test-attr="${escapeHtml(attr)}">${escapeHtml(attr)}</button>
        `).join("")}
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => handleNavClick(button.dataset.view));
  });

  el.characterTabs.forEach((button) => {
    button.addEventListener("click", () => switchCharacterPage(button.dataset.characterPage));
  });
  el.creationGuideContent.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const pageButton = event.target.closest("[data-guide-page]");
    if (pageButton) {
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
    if (applyAttributesButton) applyInitialAttributePool();
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
    openTestDialog({
      kind: button.dataset.testKind,
      name: button.dataset.testName,
      attr: button.dataset.testAttr,
      mode: defaultTestModeFor(button.dataset.testKind, button.dataset.testName),
    });
  });
  el.quickTestGrid.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.dataset.skillTraining) return;
    const skillName = event.target.dataset.skillTraining;
    const skillState = event.target.dataset.skillTrainingValue;
    const row = event.target.closest(".skill-training-row");
    state.current.skillTraining = state.current.skillTraining || {};
    if (event.target.checked) {
      row?.querySelectorAll("[data-skill-training]").forEach((input) => {
        if (input !== event.target) input.checked = false;
      });
      state.current.skillTraining[skillName] = skillState;
    } else if (state.current.skillTraining[skillName] === skillState) {
      delete state.current.skillTraining[skillName];
    }
    renderSummary();
  });
  el.race.addEventListener("change", () => {
    hydrateRacialChoice(el.race.value);
    const race = findRace(el.race.value);
    el.racialChoice.value = defaultRacialChoice(race, el.racialChoice.value);
    readForm();
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
  [el.vitalHudCharacterTrigger, el.vitalHudDerivedTrigger].forEach((trigger) => {
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
    if (event.key === "Escape" && !el.vitalHudModal.hidden) closeVitalHud();
  });
  el.testBonus.addEventListener("input", renderPendingTestFormula);
  el.testMode.addEventListener("change", renderPendingTestFormula);

  el.characterSearch.addEventListener("input", renderSavedList);
  el.librarySearch.addEventListener("input", renderLibrary);
  el.libraryTierFilter.addEventListener("change", renderLibrary);
  el.librarySort.addEventListener("change", renderLibrary);
  el.libraryGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const buyButton = event.target.closest("[data-buy-id]");
    if (buyButton) {
      buyMarketItem(buyButton.dataset.buyId);
      return;
    }
    const learnButton = event.target.closest("[data-learn-id]");
    if (learnButton) {
      learnLibraryAbility(learnButton.dataset.learnId);
      return;
    }
    const raceCard = event.target.closest("[data-race-id]");
    if (!raceCard || state.activeLibrary !== "racas") return;
    openRaceDetail(raceCard.dataset.raceId);
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

  el.cosmosPageContent.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const unequipChipButton = event.target.closest("[data-unequip-chip-id]");
    if (!unequipChipButton) return;
    unequipModifierChip(unequipChipButton.dataset.unequipChipId);
  });

  el.equipmentPageContent.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.id !== "crackLevelInput") return;
    state.current.crackLevel = clamp(numberValue(event.target.value, 0), 0, 10);
    updateCrackVisual();
  });
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

function switchView(view) {
  setActiveNav(view);
  setNavExpanded(false);
  state.activeView = view;
  state.activeRaceId = null;

  if (view === "personagens") {
    el.personagensView.classList.add("active");
    el.libraryView.classList.remove("active");
    el.raceDetailView.classList.remove("active");
    el.viewKicker.textContent = "Ficha ativa";
    el.viewTitle.textContent = "Criador de personagem";
    return;
  }

  state.activeLibrary = view;
  el.personagensView.classList.remove("active");
  el.libraryView.classList.add("active");
  el.raceDetailView.classList.remove("active");
  el.viewKicker.textContent = "Biblioteca";
  el.viewTitle.textContent = libraryMap[view].title;
  el.librarySearch.value = "";
  el.libraryTierFilter.value = "";
  el.librarySort.value = "default";
  renderLibrary();
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

      <section class="race-hero">
        <div class="race-hero-copy">
          <p>Povo jogável</p>
          <h2>${escapeHtml(race.name)}</h2>
          <strong>${escapeHtml(race.summary)}</strong>
          ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        </div>
        <div class="race-stat-strip" aria-label="Números da raça na ficha">
          ${renderRaceStatTile("CA raça", race.ca)}
          ${renderRaceStatTile("Cosmos usado", race.cosmos)}
          ${renderRaceStatTile("Movimento", formatMod(race.movement || 0))}
          ${renderRaceStatTile("Cubos", formatMod(race.cubeBonus || 0))}
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
  state.current.origin = form.get("origin").trim();
  ATTRIBUTES.forEach((attr) => {
    state.current.attributes[attr] = clamp(numberValue(form.get(attr), ATTRIBUTE_BASE), 0, 20);
  });
  state.current.pvCurrent = numberValue(form.get("pvCurrent"), 0);
  state.current.cosmosCurrent = numberValue(form.get("cosmosCurrent"), 0);
  state.current.stress = numberValue(form.get("stress"), 0);
  state.current.saturation = numberValue(form.get("saturation"), 0);
  state.current.weapon = form.get("weapon").trim();
  state.current.armor = form.get("armor").trim();
  state.current.loadUsed = numberValue(form.get("loadUsed"), 0);
  state.current.currency = numberValue(form.get("currency"), 0);
  state.current.abilities = form.get("abilities").trim();
  state.current.notes = form.get("notes").trim();
}

function renderForm() {
  document.querySelector("#name").value = state.current.name;
  document.querySelector("#player").value = state.current.player;
  document.querySelector("#race").value = state.current.race;
  hydrateRacialChoice(state.current.race);
  document.querySelector("#racialChoice").value = defaultRacialChoice(findRace(state.current.race), state.current.racialChoice);
  document.querySelector("#profession").value = state.current.profession;
  document.querySelector("#level").value = state.current.level;
  document.querySelector("#origin").value = state.current.origin;
  ATTRIBUTES.forEach((attr) => {
    document.querySelector(`#${attr}`).value = state.current.attributes[attr] ?? 0;
  });
  document.querySelector("#pvCurrent").value = state.current.pvCurrent;
  document.querySelector("#cosmosCurrent").value = state.current.cosmosCurrent;
  document.querySelector("#stress").value = state.current.stress;
  document.querySelector("#saturation").value = state.current.saturation;
  document.querySelector("#weapon").value = state.current.weapon;
  document.querySelector("#armor").value = state.current.armor;
  document.querySelector("#loadUsed").value = state.current.loadUsed;
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

  document.querySelector("#derivedStats").innerHTML = [
    ["PV", `${state.current.pvCurrent}/${derived.pvMax}`],
    ["CA", derived.ca],
    ["Mov.", `${derived.movement} m`],
    ["Cosmos", `${state.current.cosmosCurrent}/${derived.cosmosMax}`],
    ["Cubos", `${state.current.loadUsed}/${derived.cubeSlots}`],
    ["Dados", `${diceProfile.count}d6`],
  ].map(([label, value]) => `
    <div class="stat-tile">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  const racialBonus = raceEffectiveBonus(race, state.current.racialChoice);
  document.querySelector("#bonusList").innerHTML = [
    ["Bônus racial", formatBonusSummary(racialBonus)],
    ["CA raça", race.ca],
    ["CA armadura equipada", derived.armorCa],
    ["Cosmos racial", race.cosmos || 0],
    ["Cosmos equipamento", derived.equipmentCosmosBonus],
    ["Foco", profession.focus || "—"],
    ["Perícia foco", profession.skill || "Combate/equipamento"],
    ["Talento", profession.talent || "—"],
    ["Kit inicial", profession.kit || "—"],
    ["Penalidade", profession.penalty || "—"],
  ].map(([label, value]) => renderDetailRow(label, value)).join("");

  document.querySelector("#slotList").innerHTML = [
    ["Slots de cubo", derived.cubeSlots],
    ["Mods de arma", "Pelo tier da arma"],
    ["Mods de armadura", "Pela peça equipada"],
    ["Armadura equipada", state.current.armor || "Nenhuma"],
    ["Arma equipada", state.current.weapon || "Nenhuma"],
  ].map(([label, value]) => `<div class="row-line"><span>${label}</span><strong>${value}</strong></div>`).join("");
  renderStressHud(diceProfile, derived);
  renderCharacterPages(derived);
}

function syncResourceBounds(derived) {
  state.current.pvCurrent = clamp(numberValue(state.current.pvCurrent, derived.pvMax), 0, derived.pvMax);
  state.current.cosmosCurrent = clamp(numberValue(state.current.cosmosCurrent, 0), 0, derived.cosmosMax);
  state.current.stress = clamp(numberValue(state.current.stress, 0), 0, STRESS_MAX);
  state.current.saturation = clamp(numberValue(state.current.saturation, 0), 0, SATURATION_MAX);
  const pvInput = document.querySelector("#pvCurrent");
  const cosmosInput = document.querySelector("#cosmosCurrent");
  const stressInput = document.querySelector("#stress");
  const saturationInput = document.querySelector("#saturation");
  pvInput.max = derived.pvMax;
  cosmosInput.max = derived.cosmosMax;
  stressInput.max = STRESS_MAX;
  saturationInput.max = SATURATION_MAX;
  pvInput.value = state.current.pvCurrent;
  cosmosInput.value = state.current.cosmosCurrent;
  stressInput.value = state.current.stress;
  saturationInput.value = state.current.saturation;
}

function renderResourceMeters(derived) {
  const meterValues = [
    ["#pvMeter", derived.pvMax ? state.current.pvCurrent / derived.pvMax : 0],
    ["#cosmosMeter", derived.cosmosMax ? state.current.cosmosCurrent / derived.cosmosMax : 0],
    ["#stressMeter", STRESS_MAX ? state.current.stress / STRESS_MAX : 0],
    ["#saturationMeter", SATURATION_MAX ? state.current.saturation / SATURATION_MAX : 0],
  ];

  meterValues.forEach(([selector, ratio]) => {
    const meter = document.querySelector(selector);
    if (!meter) return;
    meter.style.width = `${Math.round(clamp(ratio, 0, 1) * 100)}%`;
  });
}

function currentDiceProfile() {
  if (state.current.stress >= 6) return { count: 2, label: "Colapso: 2d6", reason: "Estresse 6+" };
  if (state.current.saturation >= SATURATION_MAX) return { count: 4, label: "Saturação máxima: 4d6", reason: "Saturação cheia" };
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
  const stress = clamp(numberValue(state.current.stress, 0), 0, STRESS_MAX);
  const saturation = clamp(numberValue(state.current.saturation, 0), 0, SATURATION_MAX);
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
      maximo: STRESS_MAX,
    },
    cosmos: {
      atual: state.current.cosmosCurrent,
      maximo: derived.cosmosMax,
    },
    saturacao: {
      atual: saturation,
      maximo: SATURATION_MAX,
    },
    defesa: buildHumanisDefenseData(derived, race, equippedArmor),
    sinaisVitais: {
      frequenciaCardiaca: optionalNumber(vitalSigns, ["frequenciaCardiaca", "heartRate", "batimentos"], inferHeartRate(pvPercent, stress)),
      pressaoArterial: vitalSigns.pressaoArterial || vitalSigns.bloodPressure || inferBloodPressure(pvPercent, stress),
      frequenciaRespiratoria: optionalNumber(vitalSigns, ["frequenciaRespiratoria", "respirationRate", "respiracao"], inferRespiration(stress)),
      temperatura: optionalNumber(vitalSigns, ["temperatura", "temperature"], inferTemperature(stress, saturation)).toFixed(1),
      saturacaoOxigenio: optionalNumber(vitalSigns, ["saturacaoOxigenio", "oxygen", "oxigenio"], inferOxygen(pvPercent, saturation)),
    },
    recursos: {
      hidratacao: optionalNumber(vitalResources, ["hidratacao", "hydration"], clamp(100 - saturation * 2 - stress * 2, 0, 100)),
      nutricao: optionalNumber(vitalResources, ["nutricao", "nutrition"], clamp(88 - Math.max(0, state.current.loadUsed - 2) * 3, 35, 100)),
    },
    condicoes: {
      sangramento: conditions.sangramento || conditions.bleeding || inferBleeding(pvPercent),
      alerta: conditions.alerta || conditions.alert || inferHudAlert(pvPercent, stress, saturation, diceProfile),
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

function inferTemperature(stress, saturation) {
  return clamp(36.7 + stress * 0.05 + saturation * 0.02, 35, 41);
}

function inferOxygen(pvPercent, saturation) {
  return Math.round(clamp(99 - saturation * 2 - (pvPercent < 35 ? 5 : 0), 70, 99));
}

function inferBleeding(pvPercent) {
  if (pvPercent <= 0) return "CRITICO";
  if (pvPercent < 30) return "RISCO";
  return "NENHUM";
}

function inferHudAlert(pvPercent, stress, saturation, diceProfile) {
  if (pvPercent <= 0) return "PV ESGOTADO";
  if (pvPercent < 35) return "PV EM RISCO";
  if (stress >= 6) return "COLAPSO POR ESTRESSE";
  if (saturation >= SATURATION_MAX) return "SATURAÇÃO MÁXIMA";
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

function renderEquipmentPage(derived) {
  const equippedWeapon = getEquippedMarketItem("weapon");
  const equippedArmor = getEquippedMarketItem("armor");
  el.equipmentWallet.textContent = `${state.current.currency} dinheiro`;
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
        ${renderDetailRow("CA total", derived.ca)}
        ${renderDetailRow("Dinheiro", state.current.currency)}
      </div>
      <label class="crack-control">
        Rachadura
        <input id="crackLevelInput" type="number" min="0" max="10" step="1" value="${state.current.crackLevel || 0}" />
      </label>
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Inventário comprado</h3>
      ${renderInventoryCards(state.current.inventory, { showCubeAction: true, showEquipAction: true })}
    </section>
  `;
}

function renderEquipmentCombatPanel(equippedWeapon) {
  const group = classifyWeapon(equippedWeapon);
  const crack = clamp(numberValue(state.current.crackLevel, 0), 0, 10);
  const broken = crack >= 10;
  const attackAttr = weaponAttackAttribute(group);
  return `
    <div class="combat-panel">
      <div class="equipment-visual ${broken ? "broken" : ""}">
        ${renderWeaponSketch(group)}
        <div>
          <span class="ability-source">${escapeHtml(group.label)}</span>
          <h4>${escapeHtml(equippedWeapon?.name || "Nenhuma arma equipada")}</h4>
          <p>${escapeHtml(equippedWeapon ? marketMeta(equippedWeapon) : "Equipe uma arma para habilitar ataque e dano.")}</p>
          <div class="crack-track" aria-label="Graus de rachadura">
            ${Array.from({ length: 10 }, (_, index) => `<span class="${index < crack ? "filled" : ""}"></span>`).join("")}
          </div>
          <p class="inventory-note" id="equipmentCrackNote">${broken ? "Equipamento quebrado: o esboço entra em estado crítico." : `Rachadura ${crack}/10.`}</p>
        </div>
      </div>
      <div class="combat-actions">
        <button class="primary-button" type="button" data-equipment-roll="attack" ${equippedWeapon ? "" : "disabled"}>Ataque (${attackAttr})</button>
        <button class="ghost-button" type="button" data-equipment-roll="damage" ${equippedWeapon?.damage ? "" : "disabled"}>Dano ${escapeHtml(equippedWeapon?.damage || "")}</button>
      </div>
    </div>
  `;
}

function updateCrackVisual() {
  const crack = clamp(numberValue(state.current.crackLevel, 0), 0, 10);
  const visual = el.equipmentPageContent.querySelector(".equipment-visual");
  if (!visual) return;
  visual.classList.toggle("broken", crack >= 10);
  el.equipmentPageContent.querySelectorAll(".crack-track span").forEach((node, index) => {
    node.classList.toggle("filled", index < crack);
  });
  const note = el.equipmentPageContent.querySelector("#equipmentCrackNote");
  if (note) note.textContent = crack >= 10 ? "Equipamento quebrado: o esboço entra em estado crítico." : `Rachadura ${crack}/10.`;
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
    <section class="inventory-panel">
      <h3>Chip escolhido</h3>
      <div class="detail-list">
        ${renderDetailRow("Chip", profession.name)}
        ${renderDetailRow("Foco", profession.focus || "—")}
        ${renderDetailRow("Talento", profession.talent || "—")}
        ${renderDetailRow("Kit", profession.kit || "—")}
        ${renderDetailRow("Penalidade", profession.penalty || "—")}
      </div>
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Habilidades registradas</h3>
      ${learnedCosmosAndChips.length ? `<div class="ability-grid">${learnedCosmosAndChips.map(renderKnownAbilityCard).join("")}</div>` : `<p class="inventory-note">${escapeHtml(state.current.abilities || "Nenhuma habilidade cósmica, chip modificador ou talento extra registrado ainda.")}</p>`}
    </section>
  `;
}

function renderCubePage(derived) {
  const cubeItems = state.current.inventory.filter((entry) => entry.inCube);
  el.cubeUsagePill.textContent = `${cubeItems.length}/${derived.cubeSlots} slots`;
  el.cubePageContent.innerHTML = `
    <section class="inventory-panel">
      <h3>Uso do cubo</h3>
      <div class="detail-list">
        ${renderDetailRow("Slots usados", `${cubeItems.length}/${derived.cubeSlots}`)}
        ${renderDetailRow("Regra atual", "5 + MOD FOR + bônus racial + bônus do chip")}
        ${renderDetailRow("Observação", "Com atributo 7, o MOD segue a ficha: INT((valor - 10) / 2).")}
      </div>
    </section>
    <section class="inventory-panel inventory-panel-wide">
      <h3>Dentro do cubo</h3>
      ${renderInventoryCards(cubeItems, { showCubeAction: true, showEquipAction: false })}
    </section>
  `;
}

function renderAbilitiesPage() {
  const entries = collectAbilityEntries();
  el.abilitiesPageContent.innerHTML = `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Habilidades do personagem</h3>
      ${entries.length ? `<div class="ability-grid">${entries.map(renderAbilityCard).join("")}</div>` : '<div class="empty-state">Nenhuma habilidade vinculada à ficha ainda.</div>'}
    </section>
  `;
}

function renderDicePage() {
  const log = state.current.diceLog || [];
  const latest = log[0];
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
    ${latest.alternateRolls?.length ? `<p>Alternativas: ${escapeHtml(latest.alternateRolls.map((rolls) => `[${rolls.join(", ")}]`).join(" / "))}</p>` : ""}
    ${latest.modifier || latest.bonus ? `<p>Modificador: ${formatMod(latest.modifier || 0)} | Bônus: ${formatMod(latest.bonus || 0)}</p>` : ""}
  ` : "Nenhuma rolagem ainda.";

  el.diceChatLog.innerHTML = log.length ? log.map((entry) => `
    <article class="dice-log-entry">
      <div>
        <strong>${escapeHtml(entry.label || entry.formula)} = ${entry.total}</strong>
        <span>${escapeHtml(entry.formula)} | ${escapeHtml(entry.rolls.join(", "))}${entry.modifier ? ` ${formatMod(entry.modifier)}` : ""}${entry.bonus ? ` ${formatMod(entry.bonus)}` : ""}${entry.mode && entry.mode !== "normal" ? ` | ${entry.mode === "advantage" ? "vantagem" : "desvantagem"}` : ""}</span>
      </div>
      <time>${escapeHtml(formatShortTime(entry.createdAt))}</time>
    </article>
  `).join("") : '<div class="empty-state">O chat ainda não tem rolagens.</div>';
}

function renderManualCreatedPage() {
  const customItems = state.current.customItems || [];
  const customAbilities = (state.current.knownAbilities || []).filter((ability) => ability.custom);
  el.manualCreatedContent.innerHTML = `
    <section class="inventory-panel inventory-panel-wide">
      <h3>Conteúdo criado</h3>
      ${customItems.length || customAbilities.length ? `
        <div class="ability-grid">
          ${customItems.map((item) => renderAbilityCard({
            name: item.name,
            source: marketCategoryLabel(item.category),
            effect: item.summary,
            meta: marketMeta(item),
            imageDataUrl: item.imageDataUrl,
            imageName: item.imageName,
          })).join("")}
          ${customAbilities.map(renderAbilityCard).join("")}
        </div>
      ` : '<div class="empty-state">Nada criado manualmente ainda.</div>'}
    </section>
  `;
}

function renderAbilityCard(entry) {
  return `
    <article class="inventory-card ability-card compact-card ${entry.imageDataUrl ? "with-image" : ""}" tabindex="0">
      ${renderCardImage(entry)}
      <div class="card-face">
        <span class="ability-source">${escapeHtml(entry.source || "Manual")}</span>
        <h4>${escapeHtml(entry.name)}</h4>
        ${entry.meta ? `<p class="card-meta-line">${escapeHtml(entry.meta)}</p>` : ""}
      </div>
      <div class="card-hover-popover" role="tooltip">
        <strong>${escapeHtml(entry.name)}</strong>
        ${entry.meta ? `<p>${escapeHtml(entry.meta)}</p>` : ""}
        <p>${escapeHtml(entry.effect || "Sem efeito registrado.")}</p>
      </div>
    </article>
  `;
}

function renderKnownAbilityCard(entry) {
  const canUnequipChip = entry.source === "Chip modificador";
  return `
    <article class="inventory-card ability-card compact-card ${canUnequipChip ? "with-actions" : ""} ${entry.imageDataUrl ? "with-image" : ""}" tabindex="0">
      ${renderCardImage(entry)}
      <div class="card-face">
        <span class="ability-source">${escapeHtml(entry.source || "Manual")}</span>
        <h4>${escapeHtml(entry.name)}</h4>
        ${entry.meta ? `<p class="card-meta-line">${escapeHtml(entry.meta)}</p>` : ""}
      </div>
      ${canUnequipChip ? `
        <div class="inventory-actions">
          <button class="mini-button danger-mini-button" type="button" data-unequip-chip-id="${escapeHtml(entry.id)}">Desequipar chip</button>
        </div>
      ` : ""}
      <div class="card-hover-popover" role="tooltip">
        <strong>${escapeHtml(entry.name)}</strong>
        ${entry.meta ? `<p>${escapeHtml(entry.meta)}</p>` : ""}
        <p>${escapeHtml(entry.effect || "Sem efeito registrado.")}</p>
      </div>
    </article>
  `;
}

function renderCardImage(entry) {
  if (!entry?.imageDataUrl) return "";
  return `
    <div class="item-card-image">
      <img src="${escapeHtml(entry.imageDataUrl)}" alt="${escapeHtml(entry.imageName || entry.name || "Imagem do item")}" />
    </div>
  `;
}

function renderInventoryCards(entries, options = {}) {
  if (!entries.length) return '<div class="empty-state">Nenhum item nesta lista.</div>';
  return `
    <div class="inventory-grid">
      ${entries.map((entry) => {
        const item = findMarketItem(entry.itemId);
        if (!item) return "";
        const equipped = isInventoryEquipped(entry);
        const cubeLabel = entry.inCube ? "Tirar do cubo" : "Guardar no cubo";
        const equipAction = equipped ? "unequip" : "equip";
        const equipLabel = equipped ? "Desequipar" : "Equipar";
        const salePrice = Number.isFinite(item.price) ? item.price : 0;
        return `
          <article class="inventory-card compact-card ${item.imageDataUrl ? "with-image" : ""}" tabindex="0">
            ${renderCardImage(item)}
            <div class="card-face">
              <span class="ability-source">${escapeHtml(marketCategoryLabel(item.category))}</span>
              <h4>${escapeHtml(item.name)}</h4>
              <p class="card-meta-line">${escapeHtml(compactMarketMeta(item))}</p>
            </div>
            <div class="inventory-actions">
              ${options.showEquipAction && item.category !== "item" ? `<button class="mini-button" type="button" data-inventory-action="${equipAction}" data-uid="${entry.uid}">${equipLabel}</button>` : ""}
              ${options.showCubeAction && item.category === "item" ? `<button class="mini-button" type="button" data-inventory-action="cube" data-uid="${entry.uid}">${cubeLabel}</button>` : ""}
              <button class="mini-button danger-mini-button" type="button" data-inventory-action="sell" data-uid="${entry.uid}">Vender</button>
            </div>
            <div class="card-hover-popover" role="tooltip">
              <strong>${escapeHtml(item.name)}</strong>
              <p>${escapeHtml(marketMeta(item))}</p>
              <p>${escapeHtml(item.summary || "Sem descrição.")}</p>
              ${(item.tags || []).length ? `<div class="tag-row">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
              <label class="sell-field">
                Valor de venda
                <input type="number" min="0" step="1" value="${salePrice}" data-sell-value />
              </label>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function buyMarketItem(itemId) {
  readForm();
  const item = findMarketItem(itemId);
  if (!item) return;
  if (!Number.isFinite(item.price)) {
    showToast("Este item não tem preço definido.");
    return;
  }
  if (state.current.currency < item.price) {
    showToast("Dinheiro insuficiente para comprar.");
    return;
  }
  state.current.currency -= item.price;
  state.current.inventory.unshift({
    uid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    itemId: item.id,
    category: item.category,
    inCube: item.category === "item",
  });
  renderForm();
  showToast(`${item.name} comprado e adicionado aos equipamentos.`);
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
  state.current.knownAbilities.unshift({
    id: item.id,
    name: item.name,
    source,
    effect: item.summary,
    meta: libraryMeta(item),
    custom: false,
  });
  renderSummary();
  showToast(`${item.name} adicionado às habilidades.`);
}

function unequipModifierChip(abilityId) {
  const ability = (state.current.knownAbilities || []).find((entry) => entry.id === abilityId);
  if (!ability) return;
  state.current.knownAbilities = (state.current.knownAbilities || []).filter((entry) => entry.id !== abilityId);
  renderSummary();
  showToast(`${ability.name} desequipado da ficha.`);
}

function rollDice() {
  readForm();
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
  const diceProfile = currentDiceProfile();
  const totals = totalAttributes();
  const modifier = attributeModifier(totals.REF);
  const pool = rollDicePool(diceProfile.count, 6);
  const total = pool.raw + modifier;
  const formula = `Iniciativa: ${diceProfile.count}d6${formatMod(modifier)}`;
  pushDiceLog({
    kind: "initiative",
    label: "Iniciativa",
    count: diceProfile.count,
    sides: 6,
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
      diceProfile: diceProfile.reason,
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
  document.body.classList.remove("modal-open");
}

function defaultTestModeFor(kind, name) {
  if (kind !== "Perícia") return "normal";
  const stateValue = state.current.skillTraining?.[name] || "";
  if (stateValue === "trained") return "advantage";
  if (stateValue === "ignorant") return "disadvantage";
  return "normal";
}

function openTestDialog({ kind = "Teste", name = "Rolagem", attr = "FOR", modifier = null, mode = "normal" } = {}) {
  readForm();
  const totals = totalAttributes();
  const testModifier = modifier ?? attributeModifier(totals[attr] || ATTRIBUTE_BASE);
  state.pendingTest = { kind, name, attr, modifier: testModifier };
  el.testDialogKicker.textContent = kind;
  el.testDialogTitle.textContent = `${name} (${attr})`;
  el.testBonus.value = "0";
  el.testMode.value = mode;
  renderPendingTestFormula();
  el.testDialog.hidden = false;
  el.testBonus.focus();
}

function closeTestDialog() {
  el.testDialog.hidden = true;
  state.pendingTest = null;
}

function renderPendingTestFormula() {
  if (!state.pendingTest) return;
  const diceProfile = currentDiceProfile();
  const bonus = numberValue(el.testBonus.value, 0);
  const modeLabel = el.testMode.value === "advantage" ? "vantagem" : el.testMode.value === "disadvantage" ? "desvantagem" : "normal";
  el.testDialogFormula.textContent = `${diceProfile.count}d6 ${formatMod(state.pendingTest.modifier)} ${bonus ? formatMod(bonus) : ""} (${modeLabel})`;
}

function submitTestRoll(event) {
  event.preventDefault();
  if (!state.pendingTest) return;
  const testName = state.pendingTest.name;
  const bonus = numberValue(el.testBonus.value, 0);
  const mode = el.testMode.value;
  const result = rollCharacterTest(state.pendingTest, bonus, mode);
  closeTestDialog();
  showToast(`${testName}: ${result.total}`);
}

function rollCharacterTest(test, situationalBonus = 0, mode = "normal") {
  const diceProfile = currentDiceProfile();
  const pools = [rollDicePool(diceProfile.count, 6)];
  if (mode !== "normal") pools.push(rollDicePool(diceProfile.count, 6));
  const chosen = mode === "advantage"
    ? pools.reduce((best, pool) => pool.raw > best.raw ? pool : best, pools[0])
    : mode === "disadvantage"
      ? pools.reduce((worst, pool) => pool.raw < worst.raw ? pool : worst, pools[0])
      : pools[0];
  const total = chosen.raw + test.modifier + situationalBonus;
  const formula = `${test.name}: ${diceProfile.count}d6${formatMod(test.modifier)}${situationalBonus ? formatMod(situationalBonus) : ""}`;
  pushDiceLog({
    label: `${test.kind} - ${test.name}`,
    count: diceProfile.count,
    sides: 6,
    bonus: situationalBonus,
    modifier: test.modifier,
    rolls: chosen.rolls,
    alternateRolls: pools.length > 1 ? pools.map((pool) => pool.rolls) : [],
    mode,
    total,
    formula,
  });
  return { total, rolls: chosen.rolls };
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
  const weapon = getEquippedMarketItem("weapon");
  if (!weapon) {
    showToast("Equipe uma arma antes de rolar.");
    return;
  }
  const group = classifyWeapon(weapon);
  if (kind === "attack") {
    const attr = weaponAttackAttribute(group);
    const modifier = attributeModifier(totalAttributes()[attr]);
    openTestDialog({ kind: "Ataque", name: weapon.name, attr, modifier });
    return;
  }
  if (kind === "damage") rollWeaponDamage(weapon);
}

function rollWeaponDamage(weapon) {
  const expression = parseDiceExpression(weapon.damage);
  if (!expression) {
    showToast("Essa arma não tem dano em formato de dado.");
    return;
  }
  const rolls = Array.from({ length: expression.count }, () => Math.floor(Math.random() * expression.sides) + 1);
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + expression.bonus;
  const formula = `Dano ${weapon.name}: ${expression.count}d${expression.sides}${expression.bonus ? formatMod(expression.bonus) : ""}`;
  pushDiceLog({
    label: `Dano - ${weapon.name}`,
    count: expression.count,
    sides: expression.sides,
    bonus: expression.bonus,
    rolls,
    total,
    formula,
  });
  showToast(`${formula}: ${total}`);
}

function applyManualTemplate() {
  if (!el.manualType) return;
  const template = manualCreationTemplates[el.manualType.value] || manualCreationTemplates.item;
  const allowsImage = ["item", "weapon", "armor"].includes(el.manualType.value);
  el.manualFormatGuide.innerHTML = `
    <strong>${escapeHtml(template.title)}</strong>
    <span>${escapeHtml(template.format)}</span>
    <small>${escapeHtml(template.example)}</small>
  `;

  el.manualImagePanel.hidden = !allowsImage;
  renderManualImagePreview();
  ["tier", "subtype", "price", "weight", "power", "mods", "cosmos", "tags"].forEach((field) => {
    setManualField(field, template.fields[field] || {});
  });
  el.manualEffect.placeholder = template.fields.effect?.placeholder || "Descreva o efeito, regra ou observações.";
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
  const template = manualCreationTemplates[type] || manualCreationTemplates.item;
  const visible = (field) => !template.fields[field]?.hidden;
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
    imageDataUrl: ["item", "weapon", "armor"].includes(type) ? state.manualImageDataUrl : "",
    imageName: ["item", "weapon", "armor"].includes(type) ? state.manualImageName : "",
  };
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
  const tags = uniqueTags(["manual", ...manual.tags]);
  const summary = manual.effect || manual.power || "Criado manualmente.";
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
      inCube: item.category === "item",
    });
    event.currentTarget.reset();
    clearManualItemImage();
    applyManualTemplate();
    renderForm();
    showToast(`${manual.name} criado e colocado nos equipamentos.`);
    return;
  }

  const sourceMap = {
    cosmos: "Cosmos",
    "chip-mod": "Chip modificador",
    ability: "Manual",
  };
  state.current.knownAbilities = state.current.knownAbilities || [];
  state.current.knownAbilities.unshift({
    id,
    name: manual.name,
    source: manual.type === "ability" ? manual.tier || "Manual" : sourceMap[manual.type] || "Manual",
    effect: manual.effect || "Sem efeito registrado.",
    meta: buildManualAbilityMeta(manual.type, manual),
    tags,
    custom: true,
  });
  event.currentTarget.reset();
  clearManualItemImage();
  applyManualTemplate();
  renderSummary();
  showToast(`${manual.name} criado e adicionado às habilidades.`);
}

function handleInventoryAction(action, uid, trigger = null) {
  const entry = state.current.inventory.find((item) => item.uid === uid);
  if (!entry) return;
  const item = findMarketItem(entry.itemId);
  if (!item) return;

  if (action === "sell") {
    const input = trigger?.closest(".inventory-card")?.querySelector("[data-sell-value]");
    const saleValue = Math.max(0, numberValue(input?.value, 0));
    state.current.currency += saleValue;
    state.current.inventory = state.current.inventory.filter((inventoryItem) => inventoryItem.uid !== uid);
    if (state.current.equippedWeaponUid === uid) {
      state.current.equippedWeaponUid = "";
      state.current.weapon = "";
    }
    if (state.current.equippedArmorUid === uid) {
      state.current.equippedArmorUid = "";
      state.current.armor = "";
    }
    renderForm();
    showToast(`${item.name} vendido por ${saleValue} dinheiro.`);
    return;
  }

  if (action === "equip") {
    if (item.category === "weapon") {
      state.current.equippedWeaponUid = uid;
      state.current.weapon = item.name;
    }
    if (item.category === "armor") {
      state.current.equippedArmorUid = uid;
      state.current.armor = item.name;
    }
    renderForm();
    showToast(`${item.name} equipado.`);
    return;
  }

  if (action === "unequip") {
    if (item.category === "weapon" && state.current.equippedWeaponUid === uid) {
      state.current.equippedWeaponUid = "";
      state.current.weapon = "";
    }
    if (item.category === "armor" && state.current.equippedArmorUid === uid) {
      state.current.equippedArmorUid = "";
      state.current.armor = "";
    }
    renderForm();
    showToast(`${item.name} desequipado.`);
    return;
  }

  if (action === "cube") {
    const derived = derivedStats(totalAttributes(), findRace(state.current.race), findProfession(state.current.profession));
    const cubeCount = state.current.inventory.filter((inventoryItem) => inventoryItem.inCube).length;
    if (!entry.inCube && cubeCount >= derived.cubeSlots) {
      showToast("O cubo está sem slots livres.");
      return;
    }
    entry.inCube = !entry.inCube;
    renderSummary();
    showToast(entry.inCube ? "Item guardado no cubo." : "Item removido do cubo.");
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

function renderLibrary() {
  const library = libraryMap[state.activeLibrary];
  const selectedGroup = syncLibraryFilterOptions(library, state.activeLibrary);
  const sortMode = el.librarySort.value || "default";
  const query = normalizeSearch(el.librarySearch.value.trim());
  const isRaceLibrary = state.activeLibrary === "racas";
  const isMarketLibrary = Boolean(library.market);
  const isLearnLibrary = Boolean(library.learn);
  el.libraryTitle.textContent = library.title;
  el.libraryKicker.textContent = library.kicker;

  const filtered = sortLibraryItems(library.items.filter((item) => {
    const matchesSearch = itemSearchText(item).includes(query);
    const matchesGroup = !selectedGroup || getLibraryGroupValues(item, state.activeLibrary).includes(selectedGroup);
    return matchesSearch && matchesGroup;
  }), sortMode, state.activeLibrary);

  if (!filtered.length) {
    el.libraryGrid.innerHTML = '<div class="empty-state">Nada encontrado na biblioteca.</div>';
    return;
  }

  el.libraryGrid.innerHTML = filtered.map((item) => {
    const meta = isMarketLibrary ? marketMeta(item) : libraryMeta(item);
    const bonus = item.bonus ? Object.entries(item.bonus).map(([key, value]) => `${key} ${formatMod(value)}`).join("  ") : "";
    const tags = (item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const cardOpen = isRaceLibrary
      ? `<button class="library-card race-card compact-card" type="button" data-race-id="${escapeHtml(item.id)}" aria-label="Abrir página da raça ${escapeHtml(item.name)}">`
      : `<article class="library-card compact-card ${item.imageDataUrl ? "with-image" : ""}" tabindex="0">`;
    const cardClose = isRaceLibrary ? "</button>" : "</article>";
    return `
      ${cardOpen}
        ${renderCardImage(item)}
        <div class="card-face">
          <h3>${escapeHtml(item.name)}</h3>
          ${meta || bonus ? `<p class="card-meta-line">${escapeHtml(meta || bonus)}</p>` : ""}
        </div>
        ${isMarketLibrary ? `<button class="primary-button shop-button" type="button" data-buy-id="${escapeHtml(item.id)}">Comprar</button>` : ""}
        ${isLearnLibrary ? `<button class="primary-button shop-button" type="button" data-learn-id="${escapeHtml(item.id)}">${library.learn === "cosmos" ? "Adicionar magia" : "Adicionar chip"}</button>` : ""}
        <div class="card-hover-popover" role="tooltip">
          <strong>${escapeHtml(item.name)}</strong>
          ${meta || bonus ? `<p>${escapeHtml(meta || bonus)}</p>` : ""}
          <p>${escapeHtml(item.summary)}</p>
          ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        </div>
      ${cardClose}
    `;
  }).join("");
}

function syncLibraryFilterOptions(library, view) {
  const config = getLibraryFilterConfig(view);
  if (!config) {
    el.libraryTierControl.hidden = true;
    el.libraryTierFilter.innerHTML = '<option value="">Todos</option>';
    el.libraryTierFilter.value = "";
    return "";
  }

  const previousValue = el.libraryTierFilter.value;
  const options = [...new Set(library.items.flatMap((item) => getLibraryGroupValues(item, view)).filter(Boolean))]
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
    magias: { allLabel: "Todos os custos", prefix: "Custo", type: "number" },
    itens: { allLabel: "Todas as categorias", prefix: "", type: "text" },
  };
  return configs[view] || null;
}

function getLibraryGroupValues(item, view) {
  if (view === "magias") return item.cost !== undefined && item.cost !== "" ? [String(item.cost)] : [];
  if (view === "chipsMod") return item.rank || item.tier ? [String(item.rank || item.tier)] : [];
  if (view === "armas" || view === "armaduras") return item.tier ? [String(item.tier)] : [];
  if (view === "itens") return Array.isArray(item.tags) ? item.tags.map(String) : [];
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

function itemSearchText(item) {
  return normalizeSearch([
    item.name,
    item.context,
    item.tier,
    item.type,
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
    ...(item.tags || []),
  ].filter((value) => value !== undefined && value !== null && value !== "").join(" "));
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function saveCurrent() {
  readForm();
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
  renderForm();
  renderSavedList();
  switchView("personagens");
  showToast("Nova ficha pronta.");
}

function loadCharacter(id) {
  const character = state.saved.find((item) => item.id === id);
  if (!character) return;
  state.current = normalizeCharacter(character);
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
    renderForm();
    switchView("personagens");
    showToast("Ficha duplicada.");
    return;
  }

  if (action === "delete") {
    state.saved = state.saved.filter((item) => item.id !== id);
    if (state.current.id === id) state.current = emptyCharacter();
    persistSaved();
    renderForm();
    renderSavedList();
    showToast("Ficha excluída.");
  }
}

function exportCurrent() {
  readForm();
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

  if (hasPhoto) {
    el.photoPreview.src = state.current.photoDataUrl;
    el.summaryPortraitImage.src = state.current.photoDataUrl;
  } else {
    el.photoPreview.removeAttribute("src");
    el.summaryPortraitImage.removeAttribute("src");
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
  } catch (error) {
    state.saved = [];
  }
}

function persistSaved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
}

function totalAttributes() {
  const race = findRace(state.current.race);
  const racialBonus = raceEffectiveBonus(race, state.current.racialChoice);
  return ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = numberValue(state.current.attributes[attr], ATTRIBUTE_BASE) + (racialBonus[attr] || 0);
    return acc;
  }, {});
}

function derivedStats(attrs, race, profession) {
  const level = numberValue(state.current.level, 1);
  const modFOR = attributeModifier(attrs.FOR);
  const modREF = attributeModifier(attrs.REF);
  const modCON = attributeModifier(attrs.CON);
  const modMEN = attributeModifier(attrs.MEN);
  const equippedArmor = getEquippedMarketItem("armor");
  const armorCa = equippedArmor?.ca || 0;
  const equipmentCosmosBonus = equippedArmor?.cosmos || 0;
  const pvMax = Math.max(1, 8 * level + Math.max(0, modCON) * level);
  const cosmosMax = Math.max(0, (LEVEL_COSMOS_BASE[level] || 1) + modMEN + equipmentCosmosBonus + (race.cosmos || 0));
  const ca = Math.max(1, (race.ca || 0) + modREF + armorCa);
  const movement = Math.max(1, 6 + modREF + (race.movement || 0));
  const cubeSlots = Math.max(0, 5 + modFOR + (race.cubeBonus || 0) + (profession.cubeBonus || 0));
  return { pvMax, cosmosMax, ca, movement, cubeSlots, armorCa, equipmentCosmosBonus };
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
    });
  });

  (state.current.knownAbilities || []).forEach((ability) => entries.push(ability));

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

function findAbilityLibraryItem(id) {
  return [...cosmicSpellData, ...modifierChipData].find((item) => item.id === id);
}

function findMarketItem(id) {
  const customItems = state.current?.customItems || [];
  return [...itemData, ...weaponData, ...armorData, ...customItems].find((item) => item.id === id);
}

function getInventoryEntry(uid) {
  return state.current.inventory.find((entry) => entry.uid === uid);
}

function getEquippedMarketItem(category) {
  const uid = category === "weapon" ? state.current.equippedWeaponUid : state.current.equippedArmorUid;
  const entry = getInventoryEntry(uid);
  return entry ? findMarketItem(entry.itemId) : null;
}

function isInventoryEquipped(entry) {
  return entry.uid === state.current.equippedWeaponUid || entry.uid === state.current.equippedArmorUid;
}

function marketMeta(item) {
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
    item.cost ? `Custo ${item.cost} Cosmos` : "",
    item.rank ? `Rank ${item.rank}` : "",
    item.duration ? `Duração ${item.duration}` : "",
    item.context || "",
    item.focus || "",
    item.skill || "",
    item.tier || "",
    item.type || "",
  ].filter(Boolean);
  return parts.join(" - ");
}

function marketCategoryLabel(category) {
  const labels = {
    item: "Item",
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

function attributeModifier(value) {
  return Math.floor((numberValue(value, ATTRIBUTE_BASE) - ATTRIBUTE_MOD_BASE) / 2);
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

function normalizeCharacter(character) {
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
    pvCurrent: numberValue(character.pvCurrent, 0),
    cosmosCurrent: numberValue(character.cosmosCurrent, 0),
    stress: numberValue(character.stress, 0),
    saturation: numberValue(character.saturation, 0),
    crackLevel: numberValue(character.crackLevel, 0),
    loadUsed: numberValue(character.loadUsed, 0),
    currency: numberValue(character.currency, 0),
    inventory: Array.isArray(character.inventory) ? character.inventory : [],
    knownAbilities: Array.isArray(character.knownAbilities) ? character.knownAbilities : [],
    customItems: Array.isArray(character.customItems) ? character.customItems : [],
    diceLog: Array.isArray(character.diceLog) ? character.diceLog : [],
    initialAttributeRoll: character.initialAttributeRoll && Array.isArray(character.initialAttributeRoll.rolls)
      ? character.initialAttributeRoll
      : { rolls: [], kept: [] },
    skillTraining: character.skillTraining && typeof character.skillTraining === "object" ? character.skillTraining : {},
    equippedWeaponUid: character.equippedWeaponUid || "",
    equippedArmorUid: character.equippedArmorUid || "",
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
  return `${value.toLocaleString("pt-BR")} dinheiro`;
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
function showToast(message) {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.classList.add("show");
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2200);
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
