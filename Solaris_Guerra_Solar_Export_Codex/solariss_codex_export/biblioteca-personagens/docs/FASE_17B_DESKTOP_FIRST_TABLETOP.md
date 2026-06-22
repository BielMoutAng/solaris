# Solaris Guerra Solar - Fase 17B: Desktop-first do Tabletop

Status: primeira versao alfa implementada no cache `20260622f`.

## Objetivo

Priorizar a experiencia do Solaris Tabletop Alpha em PC/Windows, aproximando a estrutura de uso de mesas virtuais como Foundry VTT e Roll20: palco central dominante, docks laterais, topo compacto, barra inferior funcional e paineis que rolam dentro do proprio limite.

Esta fase nao altera regras, dominio, persistencia ou servidor. Ela e uma camada de layout e usabilidade sobre a estrutura visual por telas da Fase 17.

## O que mudou

- A tela `Mesa` agora usa uma estrutura desktop-first com mapa/palco central mais dominante.
- A topbar foi compactada para liberar altura util.
- A toolbar do mapa ficou mais compacta, com rolagem horizontal quando houver muitos comandos.
- As sidebars funcionam como docks independentes para jogadores, chat, combate, aprovacoes, loot, objetivos e historico.
- A barra inferior da mesa ficou mais baixa, com personagem, equipamento, itens ativos e acoes rapidas mais densos.
- A quickbar inferior ficou mais compacta e horizontal.
- A Loja e a Ficha continuam abrindo em largura ampla.
- A responsividade para iPhone/PWA foi preservada, com colunas empilhadas e abas em duas colunas.

## Arquivos principais

- `styles.css`
- `app.js`
- `index.html`
- `sw.js`
- `src/session/solaris-session-ui.js`
- `package.json`
- `package-lock.json`

## Como testar

1. Rode `npm run server:vtt`.
2. Abra `http://localhost:3000/?view=mesaVirtual&check=20260622f`.
3. Em desktop, confira `Mesa`, `Loja`, `Ficha` e `Mestre`.
4. Confirme que a tela `Mesa` deixa o mapa como area principal.
5. Confirme que os paineis laterais rolam internamente.
6. Confirme que Loja e Ficha seguem amplas.
7. Teste um viewport mobile e confirme que a interface empilha sem overflow horizontal.

## Limites atuais

- Ainda nao existem drawers recolhiveis reais para cada dock.
- O mapa ainda usa grid HTML/CSS, nao canvas dedicado.
- A ficha do VTT ainda e um resumo operacional, nao a ficha completa final.

## Proxima etapa recomendada

Criar controles de colapso para docks laterais e transformar ferramentas do mapa em uma toolbar vertical opcional, mantendo o mesmo estado do app.
