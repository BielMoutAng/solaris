# Fase 27B - Redesign do launcher e da mesa virtual

Status: implementada no cache `20260629a`.

Versao local: `0.6.0-alpha.24`.

## Objetivo

Substituir a tela antiga e poluida da sessao por uma estrutura de VTT mais proxima de Foundry/Roll20:

- mapa como protagonista;
- sem coluna esquerda fixa de jogadores/chat;
- sem cards grandes soltos no topo;
- sem painel de combate/loot/objetivos fora de lugar;
- sem barra inferior de inventario rapido;
- informacoes agrupadas em um unico painel lateral direito por abas.

## Referencias usadas

- Figma informado pelo usuario: `https://www.figma.com/design/rCoSWxlQ5dqiAdbat2UBBi`.
- A leitura direta via MCP do Figma ficou bloqueada pelo limite do plano Starter.
- As imagens anexadas e o prompt estrutural foram usados como referencia principal para a implementacao.

## Entrega

### Launcher

O launcher agora usa a rota `?view=launcher` / `?view=home` com:

- fundo cinematografico dark sci-fi em CSS;
- marca grande `SOLARIS TABLETOP / GUERRA SOLAR`;
- painel Entrar na Sessao;
- painel Descricao do Mundo;
- painel Detalhes da Sessao;
- painel Configuracao do Mestre;
- rodape com status, versao e cache.

### Sessao

A tela da mesa foi reorganizada em:

- topbar compacto;
- toolbar vertical esquerda;
- menu circular de cenas no canto superior esquerdo do mapa;
- mapa central dominante com grid/tokens preservados;
- painel direito unico com abas:
  - Bate-papo;
  - Personagens;
  - Combate;
  - Itens.

### Interacoes preservadas

- modo offline/simulado;
- modo servidor local;
- mapa e tokens;
- troca de cenas;
- rolagens;
- chat;
- iniciativa;
- combate;
- adicionar monstros;
- loja/itens rapidos;
- ficha flutuante de personagem;
- modais existentes do mestre, cena, encontro, loot e detalhes.

## Arquivos principais

- `src/session/solaris-session-ui.js`
- `styles.css`
- `index.html`
- `sw.js`
- `electron-main-vtt.cjs`
- `tests/tabletop-launcher.test.mjs`
- `README.md`
- `README_CONTEXTO_CHATGPT.md`

## Validacao esperada

1. `npm test`
2. `node --check app.js`
3. `node --check sw.js`
4. `node --check src/domain/solaris-domain-architecture.js`
5. `node --check src/session/solaris-session-domain.js`
6. `node --check src/session/solaris-session-client.js`
7. `node --check src/session/solaris-session-ui.js`
8. `node --check server/solaris-server.js`
9. Abrir `http://localhost:3000/?view=launcher&check=20260629a`.
10. Abrir `http://localhost:3000/?view=mesaVirtual&check=20260629a`.

## Proxima etapa recomendada

Refinar o mapa como canvas de jogo:

- zoom/pan visual mais fluido;
- camadas de mapa, grid, tokens e iluminacao;
- menus contextuais nos tokens;
- ficha flutuante arrastavel;
- criacao de pasta/personagem dentro do painel de Personagens;
- iniciativa oficial com bonus situacional, vantagem, desvantagem, emboscada e surpreendido aplicados ao resultado.
