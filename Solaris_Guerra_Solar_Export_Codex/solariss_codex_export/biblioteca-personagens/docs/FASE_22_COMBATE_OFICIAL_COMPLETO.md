# Fase 22 - Combate Oficial Completo

Status: implementado localmente no cache `20260624c`.

Versao local: `0.6.0-alpha.17`.

## Objetivo

Centralizar as regras oficiais de combate em um modulo de dominio puro, reutilizavel pelo app offline, pelo Tabletop Alpha e por futuras exportacoes para VTT/Foundry, sem quebrar ficha local, campanhas salvas, autosaves, loja, loot, mapa tatico ou servidor local.

Esta fase nao redesenha a UI. Ela troca a base mecanica de dano, cura, condicoes e consequencias de combate para um formato estruturado e testavel.

## Fontes consultadas

- Livro 1 base do jogador.
- Livro 2 Guia do Mestre.
- Livro 3 Bestiario.
- Livro 4 Cenarios e Historia.
- Livro 5 Itens, Equipamentos e Habilidades.
- `README.md`.
- `README_CONTEXTO_CHATGPT.md`.
- `docs/FASE_18_AUDITORIA_FUNCIONAL_RECORRENTE.md`.
- `docs/FASE_19_RECONCILIACAO_OFICIAL_DADOS.md`.
- `docs/FASE_20_TELA_INICIAL_LAUNCHER_TABLETOP.md`.
- `docs/FASE_21_CRIACAO_PROGRESSAO_PERSONAGEM.md`.
- `docs/MAPA_FONTES_OFICIAIS.md`.
- `docs/RELATORIO_DIVERGENCIAS_DADOS_OFICIAIS.md`.
- `docs/MATRIZ_FUNCIONAL_REGRAS_GUERRA_SOLAR.md`.
- `docs/REGISTRO_DE_REGRAS_MUTAVEIS.md`.

## Arquivos principais

- `src/domain/solaris-combat-rules.js`
- `src/session/solaris-session-domain.js`
- `tests/solaris-combat-rules.test.mjs`
- `tests/solaris-session-domain.test.mjs`
- `sw.js`
- `index.html`
- `app.js`
- `src/session/solaris-session-ui.js`
- `electron-main-vtt.cjs`
- `package.json`

## O que foi implementado

Foi criado o modulo `solaris-combat-rules.js` com regras puras para:

- acoes de combate disponiveis;
- reacoes de combate;
- ataque com `1d20 + modificador`;
- acerto, erro, 20 natural e 1 natural;
- cobertura parcial, pesada e total;
- alcance normal, estendido e impossivel;
- arma sem municao, arma travada e arma inutilizavel;
- dano com reducao, resistencia, vulnerabilidade e imunidade;
- critico dobrando dados, sem duplicar bonus fixo;
- erro critico com efeitos como `Jammed`, alvo facil, queda de item, estresse e rachadura;
- ferimentos graves em `1d6`;
- Sangramento no inicio do turno;
- personagens em 0 PV;
- Marcas de Morte;
- morte em 2 Marcas de Morte;
- dano em 0 PV;
- dano excedente massivo;
- estabilizacao;
- cura sem remover Marcas de Morte, Sangramento ou ferimentos;
- monstro comum derrotado ao chegar a 0 PV;
- monstro importante ou chefe podendo usar Marcas de Morte;
- estado de acoes do turno;
- reset de acao/movimento/reacao no inicio do turno;
- rachaduras de armas e armaduras.

## Integracao com a sessao

`SessionCharacter` e `SharedMonster` passaram a usar o modulo oficial para:

- aplicar dano;
- aplicar cura;
- adicionar condicao;
- remover condicao;
- processar efeitos no inicio do turno.

`CombatTracker` tambem passou a preservar:

- `deathMarks`;
- `isDead`;
- `criticalState`;
- `stabilized`;
- `usesDeathMarks`;
- `severeWounds`;
- `injuries`;
- `scars`;
- `woundHistory`;
- `combatActionState`;
- `equipmentCombatState`;
- `ammoCombatState`;
- `lastCombatEvents`;
- resistencias, vulnerabilidades, imunidades e reducoes.

O avanço de turno da mesa agora chama efeitos oficiais de inicio de turno, incluindo Sangramento e reducao/expiracao de duracao de condicoes.

## Logs de combate

O log minimalista continua preservado. Eventos simples de dano e cura seguem como antes, mas consequencias adicionais entram como mensagens separadas quando necessario:

- Sangramento;
- Ferimento Grave;
- Marca de Morte;
- derrota;
- expiracao de condicao.

## Compatibilidade

Preservado:

- modo offline;
- app de ficha local;
- `localStorage`;
- PWA/iPhone;
- servidor local com `npm run server:vtt`;
- rotas `?view=launcher`, `?view=home`, `?view=campaigns`, `?view=mesaVirtual`, `?view=ficha`;
- campanhas, autosaves e snapshots;
- import/export;
- loja;
- loot automatico;
- mapa tatico;
- painel do mestre.

Item sem local definido continua sendo apenas aviso visual e nao bloqueia rolagens, iniciativa, ataques, dano de monstro, testes ou evolucao.

## Limitacoes atuais

- As tabelas de critico e erro critico foram estruturadas com base na regra oficial lida, mas alguns efeitos ainda dependem de decisao do mestre.
- A UI ainda nao mostra todos os campos novos de estado critico, ferimentos e Marcas de Morte em todos os paineis.
- Reparo completo de rachaduras ainda depende de uma fase propria de equipamentos/oficina.
- Nem todos os ataques de monstros e armas do Livro 5 estao recalculados por este modulo automaticamente; a fase cria a base para isso.
- A exportacao Foundry ainda nao foi implementada, mas os campos foram mantidos em formato serializavel.

## Como testar

1. Rodar `npm test`.
2. Rodar `node --check` nos arquivos principais.
3. Rodar `npm run server:vtt`.
4. Abrir `http://localhost:3000/?view=launcher&check=20260624c`.
5. Entrar na Mesa Virtual.
6. Iniciar combate.
7. Adicionar personagem e monstro.
8. Aplicar dano ate 0 PV em personagem.
9. Confirmar estado critico.
10. Aplicar dano novamente em 0 PV e confirmar Marca de Morte.
11. Curar 1 PV e confirmar que sai do estado critico sem apagar Marca de Morte.
12. Adicionar Sangramento, avancar turno e confirmar dano/log.
13. Derrubar monstro comum e confirmar estado derrotado/loot.
14. Derrubar monstro com `usesDeathMarks: true` e confirmar estado critico.
15. Abrir sem servidor e confirmar que a ficha local continua funcionando.

## Proxima etapa recomendada

A proxima fase pode ser uma camada de UI para o combate oficial:

- mostrar Marcas de Morte na ficha e na ficha de monstro;
- mostrar Ferimentos Graves em painel dedicado;
- botao de estabilizar;
- botao de estancar Sangramento;
- botao de critico/erro critico no fluxo de ataque;
- painel de consequencias de rachadura;
- aplicar automaticamente propriedades de armas e mods no ataque/dano.

