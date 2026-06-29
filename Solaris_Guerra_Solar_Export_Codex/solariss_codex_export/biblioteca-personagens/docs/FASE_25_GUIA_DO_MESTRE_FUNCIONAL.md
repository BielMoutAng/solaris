# Fase 25 - Guia do Mestre Funcional

Status: implementado no cache `20260624f`.

Versao local: `0.6.0-alpha.20`.

Branch de trabalho: `codex/fase-25-guia-do-mestre`.

## Objetivo

Transformar regras do Livro 2 em ferramentas funcionais para o Mestre dentro do Solaris Tabletop Alpha, preservando o modo offline e a separacao entre Biblioteca/Ficha e Tabletop.

## Fontes

- `Livro_2_Guia_do_Mestre_rifles_corrigido.docx`
- Matrizes e registros das Fases 18 a 24
- Estrutura existente do Painel do Mestre

## Implementado

- Novo dominio puro em `src/domain/solaris-gm-rules.js`.
- Modelos de missao, objetivos, fases, risco, complicacoes e recompensas.
- Modelos de viagem, terreno, ritmo, perigos ambientais e eventos.
- Trilhas de recursos com pressao: estavel, atencao, pressionado, critico e esgotado.
- Faccoes com reputacao de `-3` a `+3` e relacao derivada.
- Contadores de campanha.
- Desafios de hacking com SR, nos, RAM, deteccao e bloqueio.
- Bases/colonias com atributos, projetos, crises, eventos e nivel inferido.
- Eventos narrativos do Mestre serializaveis.
- Integracao com `GameRoom`, eventos GM, permissao de Mestre e relatorio de sessao.
- Persistencia em sessao/campanha/autosave/importacao/exportacao.
- Aba `Campanha` no Painel do Mestre com listas e acoes rapidas.
- Cache web atualizado para `20260624f`.

## Eventos Novos

- `gm:mission:create`
- `gm:mission:update`
- `gm:mission:delete`
- `gm:mission:advance`
- `gm:mission:objective:create`
- `gm:mission:objective:complete`
- `gm:mission:objective:fail`
- `gm:mission:complication`
- `gm:travel-route:create`
- `gm:travel-route:update`
- `gm:travel-route:delete`
- `gm:travel:event`
- `gm:resource:create`
- `gm:resource:consume`
- `gm:resource:restore`
- `gm:faction:create`
- `gm:faction:update`
- `gm:faction:reputation`
- `gm:clock:create`
- `gm:clock:advance`
- `gm:clock:resolve`
- `gm:hacking:create`
- `gm:hacking:advance`
- `gm:hacking:fail`
- `gm:base:create`
- `gm:base:update`
- `gm:base:resource:update`
- `gm:base:project:advance`
- `gm:base:event`
- `gm:reward:create`
- `gm:reward:apply`
- `gm:event:create`

## UI

No Painel do Mestre, a aba `Campanha` concentra:

- missao ativa;
- risco calculado da missao;
- complicacao de missao;
- objetivos;
- recursos;
- reputacao de faccoes;
- rotas e eventos de viagem;
- contadores de campanha;
- desafios de hacking;
- bases/colonias;
- historico GM.

A primeira versao usa prompts simples para criacao rapida. A estrutura de dominio ja permite trocar esses prompts por formularios mais completos sem mudar os contratos de dados.

## Persistencia

Os novos campos passam a ser mantidos em:

- `gmState`;
- `missions`;
- `travelRoutes`;
- `resourceTracks`;
- `factionStates`;
- `reputationLog`;
- `campaignClocks`;
- `gmEvents`;
- `rewards`;
- `consequences`;
- `hackingChallenges`;
- `bases`.

Salvamentos antigos continuam migrando com listas vazias.

## Testes

Foi criada a suite `tests/solaris-gm-rules.test.mjs`, cobrindo:

- normalizacao de missao;
- fases de missao;
- objetivo concluido/falho;
- complicacoes;
- recompensa e risco;
- viagem;
- perigo ambiental;
- recursos e pressao;
- faccoes e reputacao;
- contadores;
- hacking;
- bases e projetos;
- seeds geradas;
- serializacao/hidratacao;
- permissao do Mestre;
- persistencia em sessao/campanha;
- relatorio da sessao.

## Limitacoes Atuais

- Os formularios da aba `Campanha` ainda sao alfa e usam `prompt`.
- Valores narrativos de recompensa e risco ainda podem ser calibrados quando o Livro 2 receber revisoes finais.
- A aplicacao de recompensas ainda registra transacao narrativa; a entrega automatica em ficha deve ser refinada em fase propria.
- O Livro 4 ainda precisa de uma fase dedicada para transformar lore em compendio navegavel.

## Validacao Recomendada

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-combat-rules.js
node --check src/domain/solaris-equipment-rules.js
node --check src/domain/solaris-bestiary-rules.js
node --check src/domain/solaris-gm-rules.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
node --check scripts/audit-official-sources.mjs
```

URL local:

```txt
http://localhost:3000/?view=launcher&check=20260624f
```

URL web apos publicacao:

```txt
https://bielmoutang.github.io/solaris/?view=launcher&check=20260624f
```

## Proxima Etapa Recomendada

Refinar a UI do Painel do Mestre, substituindo prompts por janelas estruturadas e conectando recompensas a personagens, inventario, Luzentis e logs de campanha com aprovacao do Mestre.
