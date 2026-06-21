# Solaris Guerra Solar - Fase 16: Padronizacao Visual Global

Status: primeira versao alfa implementada no cache `20260621e`.

## Objetivo

Padronizar visualmente as telas principais do Solaris Tabletop Alpha sem reescrever a arquitetura, sem trocar HTML/CSS/JS puro por framework e sem quebrar:

- modo offline/simulado;
- Solaris Biblioteca;
- Solaris Tabletop Alpha;
- servidor local via `npm run server:vtt`;
- campanhas, autosaves, snapshots e export/import;
- mapa tatico, combate, loja, loot, painel do mestre e editores.

## Referencia visual

O arquivo Figma informado expôs o frame `Loja Solaris VTT - Proposta organizada 1920x1080`. A Fase 16 usa essa tela como guia visual para densidade, cores, painéis, bordas finas, cards, topbar, sidebar, scroll interno e linguagem neon/cosmos.

## O que foi implementado

- Tokens globais `--solaris-*` para cores, brilho, sombra, espacamento, raio, tipografia e tamanhos estruturais.
- Classes globais de design system para shells, topbar, sidebars, painéis, cards, botões, inputs, badges, modais, scroll panels, toasts e barra inferior.
- Mapeamento das telas atuais do Tabletop para a nova linguagem visual mantendo as classes antigas.
- Padronizacao do topo do VTT e da tela Minhas Campanhas.
- Reforco visual em sidebars, paineis, mapa tatico, barra inferior, cards, listas e modais.
- Melhor contencao de conteudo com scroll interno em listas, painéis, modais, editores e grids.
- Responsividade refinada para larguras proximas de 1600px, 1366px, tablets e janelas menores do Electron.
- Modais grandes do mestre, editor de cena, editor de encontro, relatorio, monstro e campanhas passam a usar a classe `solaris-modal-large`.
- O cache foi atualizado para `20260621e`.
- O Solaris Tabletop Alpha foi atualizado para `0.6.0-alpha.8`.

## Telas padronizadas

- Mesa Virtual / Combate Tatico.
- Loja Solaris.
- Minhas Campanhas.
- Painel do Mestre / Escudo.
- Editor Visual de Cena.
- Editor Visual de Encontro.
- Preview de Relatorio.
- Ficha Jogavel de Monstro.
- Distribuicao de Loot.
- Aprovacoes do Mestre.
- Barras laterais e barra inferior do VTT.

## Classes globais criadas ou consolidadas

- `solaris-shell`
- `solaris-topbar`
- `solaris-sidebar`
- `solaris-sidebar-right`
- `solaris-main-stage`
- `solaris-panel`
- `solaris-card`
- `solaris-card-selected`
- `solaris-section-title`
- `solaris-divider`
- `solaris-button`
- `solaris-button-primary`
- `solaris-button-secondary`
- `solaris-button-danger`
- `solaris-button-success`
- `solaris-button-ghost`
- `solaris-input`
- `solaris-select`
- `solaris-badge`
- `solaris-badge-tier`
- `solaris-badge-rarity`
- `solaris-meter`
- `solaris-progress`
- `solaris-token`
- `solaris-modal`
- `solaris-modal-large`
- `solaris-scroll-panel`
- `solaris-empty-state`
- `solaris-toast`
- `solaris-toolbar`
- `solaris-bottom-bar`

## Como usar o design system base

Para novas telas do Tabletop, preferir:

1. `solaris-shell` no container principal.
2. `solaris-topbar` no topo.
3. `solaris-sidebar` para laterais.
4. `solaris-panel` para quadros funcionais.
5. `solaris-card` para itens repetidos.
6. `solaris-modal` ou `solaris-modal-large` para janelas.
7. `solaris-scroll-panel` em listas que possam crescer.

As classes antigas `vtt-*` continuam validas. A regra desta fase e complementar, nao substituir.

## Limitacoes

- O Figma acessivel no momento tinha somente o frame da loja com conteudo; as outras paginas apareceram vazias pela API.
- A Fase 16 nao cria mecanicas novas, apenas padroniza a UI existente.
- Algumas telas da ficha/biblioteca fora do Tabletop ainda mantem sua identidade anterior para evitar quebrar o app online.
- A responsividade foi reforcada, mas telas muito densas ainda devem receber refinamentos especificos por fluxo.

## Validacao esperada

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
```

## Proxima etapa recomendada

Refinar visualmente cada tela em ciclos menores, começando por:

- Ficha de Personagem dentro do Tabletop;
- Bestiario em tela cheia;
- Ficha Jogavel de Monstro;
- Escudo do Mestre;
- Tabelas Rapidas;
- Criador de Personagem em wizard.
