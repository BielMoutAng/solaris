# Solaris Guerra Solar - Fase 12: Editores Visuais e Polimento de Usabilidade

Status: primeira versao alfa implementada no cache `20260620j`.

## Objetivo

Dar ao mestre ferramentas mais visuais para preparar e revisar sessoes reais, sem quebrar:

- modo offline/simulado;
- Solaris Biblioteca;
- Solaris Tabletop Alpha;
- servidor local via `npm run server:vtt`;
- campanhas, autosaves, snapshots e export/import.

## O que foi implementado

- Editor Visual de Cena.
- Editor Visual de Encontro.
- Preview de relatorio antes de exportar.
- Salvamento de relatorios na sessao/campanha.
- Persistencia de `sessionReports`.
- Balanceamento alfa de encontros com `estimateEncounterBalance`.
- Posicoes iniciais de monstros ao iniciar encontro preparado.
- Preservacao de `hidden`, `locked` e cor do token quando o encontro aplica posicoes iniciais.
- Mais dados estruturados em cenas: descricao, notas publicas, notas do mestre, iluminacao, clima, perigo e cor do grid.
- Mais dados estruturados em zonas e objetivos: efeito mecanico, duracao, recompensa e notas do mestre.
- Polimento de CSS com rolagem interna em paineis e modais para reduzir sobreposicoes.
- Cache atualizado para `20260620j`.
- Versao do Tabletop Alpha atualizada para `0.6.0-alpha.5`.

## Editor Visual de Cena

O mestre pode abrir pelo Painel do Mestre, aba Cenas, ou pelo botao `Cena` no mapa tatico.

Recursos atuais:

- listar cenas salvas;
- criar nova cena;
- duplicar cena;
- exportar cena em JSON;
- salvar propriedades da cena;
- tornar cena ativa;
- visualizar mapa/grid/tokens/zonas/objetivos;
- adicionar objetivo;
- adicionar zona de perigo;
- adicionar cobertura;
- adicionar token marcador;
- remover objetivos, zonas e tokens.

Campos editaveis:

- nome;
- imagem/mapa;
- colunas;
- linhas;
- metros por casa;
- opacidade do grid;
- cor do grid;
- iluminacao;
- clima;
- perigo;
- descricao;
- notas publicas;
- notas do mestre.

## Editor Visual de Encontro

O mestre pode abrir pelo Painel do Mestre, aba Encontros.

Recursos atuais:

- listar encontros preparados;
- criar novo encontro;
- duplicar encontro;
- salvar dados do encontro;
- vincular encontro a uma cena;
- adicionar monstros do bestiario carregado;
- remover monstros do encontro;
- ver preview da cena vinculada;
- ver dificuldade estimada;
- iniciar encontro.

O balanceamento alfa considera:

- tier da criatura;
- papel/funcao quando disponivel;
- quantidade de monstros;
- tamanho e nivel medio do grupo.

Classificacoes possiveis:

- `Trivial`;
- `Facil`;
- `Moderado`;
- `Dificil`;
- `Mortal`;
- `Boss/Climax`.

## Relatorios de Sessao

O relatorio agora pode ser pre-visualizado antes de baixar.

Opcoes disponiveis:

- chat completo;
- notas secretas;
- logs tecnicos;
- transacoes;
- combate;
- loot;
- contadores;
- ambiente;
- pendencias;
- cenas;
- encontros;
- objetivos.

Acoes:

- copiar Markdown;
- baixar `.md`;
- baixar `.html`;
- salvar na campanha.

Relatorios salvos entram em:

- estado da sala;
- salvar sessao;
- autosave;
- snapshot;
- export/import de campanha.

## Eventos e dados

Eventos novos ou consolidados:

- `gm:report:save`;
- `gm:encounter:generate`;
- `gm:encounter:start` com `loadScene`;
- `gm:scene:create`;
- `gm:scene:update`;
- `gm:scene:switch`.

Estruturas novas/polidas:

- `sessionReports`;
- `reportSettings`;
- `initialPositions`;
- `estimatedDifficulty`;
- `balance`;
- `publicNotes`;
- `secretNotes`;
- `gmNotes`;
- `mechanicalEffect`.

## Testes adicionados

Foram adicionados testes para:

- cenas ricas criadas pelo editor visual;
- persistencia de dados de cena;
- balanceamento alfa de encontro;
- encontro iniciado carregando cena vinculada;
- posicoes iniciais de monstros;
- tokens escondidos em encontro preparado;
- relatorios salvos em sessao/campanha.

## Validacao

Comandos esperados:

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

## Limitacoes atuais

- O editor visual ainda nao tem drag-and-drop interno para reposicionar elementos dentro do modal.
- Os formularios de objetivo, zona e token ainda usam defaults simples; a edicao granular fica para a proxima fase.
- O balanceamento e alfa e deve ser calibrado com pesos oficiais do Livro 2/Livro 3.
- O relatorio HTML ainda e simples, com foco em conteudo textual.

## Proxima etapa recomendada

- Reposicionamento por arrastar dentro do editor de cena.
- Edicao detalhada de cada objetivo, zona, area e token.
- Importar/exportar cenas e encontros como pacotes reutilizaveis.
- Relatorio visual com identidade Guerra Solar em PDF/HTML estilizado.

Continuacao relacionada: a Fase 15 aplica o mesmo principio de polimento e rolagem interna na **Loja Solaris**, com cards padronizados, filtros compactos, carrinho lateral e modal de detalhes com scroll controlado.

Continuacao visual: a Fase 16 (`20260621e`) cria o design system `solaris-*` e reforca modais, editores, paineis e scroll interno para reduzir sobreposicoes em janelas menores.
