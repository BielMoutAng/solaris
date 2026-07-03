# Atualizacoes Recentes - Biblioteca Solaris / Guerra Solar

Este resumo foi criado para ser enviado a outro chat como contexto do estado
atual do projeto.

## Projeto

Estamos trabalhando na Biblioteca Solaris / Guerra Solar.

A Biblioteca Solaris continua sendo a fonte oficial dos dados do sistema. O
Foundry VTT sera tratado apenas como destino futuro de exportacao/importacao,
sem virar o centro do projeto.

## Versao Atual

- App: `0.6.0-alpha.32`
- Cache web/PWA: `20260703c`
- Branch enviada ao GitHub: `main`
- Ultima tag enviada: `v0.6.0-alpha.32`
- Ultima fase registrada: Fase 5 - Ficha ativa completa e modularizacao

## Decisao Oficial de Atributos

Os atributos oficiais do Guerra Solar sao:

- `FOR`
- `REF`
- `CON`
- `INT`
- `PRE`
- `MEN`

`ESP` nao e atributo oficial principal do schema v1.

Se `ESP` aparecer em dados antigos, rascunhos ou fichas legadas, ele deve ser
preservado em `legacy` ate uma migracao segura ser confirmada manualmente.

Cosmos continua existindo como recurso/poder separado, mas nao como atributo
base.

## O Que Foi Atualizado

### Fase 4 - Persistencia e Migracao Dedicada

Foi criada uma camada dedicada de storage, migracao e backup para preparar a
Biblioteca Solaris para evolucoes futuras sem depender diretamente dos formatos
antigos de `localStorage`.

Mudancas centrais:

- Criado o envelope oficial `solaris-storage-v1`.
- Criada migracao de snapshots legados da biblioteca para storage oficial.
- Criada leitura de chaves legadas sem apagar dados antigos automaticamente.
- Criado adaptador de storage em memoria para testes e uso sem navegador.
- Criadas funcoes para salvar, listar, carregar e remover fichas no storage novo.
- Criado sistema de backup `solaris-backup-v1`.
- Backups incluem checksum simples para alerta de alteracao/corrupcao.
- Restauracao de backup passa pela mesma migracao segura.
- `ESP` legado segue preservado em `legacy`, sem migracao automatica para `MEN`.
- `resources` segue como destino oficial de PV, Estresse e Cosmos.

### Fase 4.5 - Integracao Gradual do App Visual ao Storage

O app visual da Biblioteca agora inicializa e salva dados usando a camada
dedicada `solaris-storage-v1`, sem quebrar as fichas antigas nem apagar as
chaves legadas.

Mudancas centrais:

- `app.js` passou a inicializar a persistencia com
  `initializeSolarisAppStorage`.
- Se `solaris.storage.v1` ja existir, a Biblioteca usa o storage novo como
  fonte principal.
- Se so existirem chaves antigas, a Biblioteca le os dados em modo
  compatibilidade e monta um snapshot migrado em memoria.
- As chaves antigas nao sao removidas nem sobrescritas automaticamente.
- A primeira gravacao persistida apos detectar dados legados cria um backup
  `solaris-backup-v1`.
- Fichas, conteudo personalizado, bestiario local e precos editados agora
  passam pelos wrappers do storage dedicado.
- O fallback em memoria continua disponivel quando `localStorage` nao existe.
- `ESP` continua preservado como legado, sem conversao automatica para `MEN`.
- Nenhuma mecanica, UI ou integracao real com Foundry foi alterada nesta fase.

### Fase 5 - Ficha Ativa Completa e Modularizacao

Foi criada a primeira camada modular da ficha ativa, preparando a Biblioteca
Solaris para evoluir inventario, municao, exportacao Foundry e futuras telas
sem duplicar regras diretamente em `app.js`.

Mudancas centrais:

- Criado `src/ui/solaris-character-state.js` para normalizar a ficha ativa.
- Criado `src/ui/solaris-character-ui.js` com adaptadores de leitura para a UI.
- A ficha ativa passa a ser normalizada para `solaris-character-v1`.
- `resources.pv`, `resources.stress` e `resources.cosmos` seguem como origem
  oficial de PV, Estresse e Cosmos.
- FOR, REF, CON, INT, PRE e MEN seguem como atributos oficiais.
- `ESP` segue preservado apenas em `legacy`, sem conversao automatica para
  `MEN`.
- Cosmos segue como recurso/poder separado, nao como atributo.
- Foram preparadas secoes minimas de `equipment`, `inventory` e `ammoSystem`.
- `app.js` passou a sincronizar a ficha ativa ao salvar, carregar, importar,
  exportar, duplicar, criar nova ficha e persistir silenciosamente.
- A UI e as mecanicas foram preservadas; esta fase e estrutural.

### Arquivos Criados

- `src/storage/solaris-storage.js`
- `src/storage/solaris-migrations.js`
- `src/storage/solaris-backup.js`
- `tests/solaris-storage.test.mjs`
- `tests/solaris-migrations.test.mjs`
- `tests/solaris-backup.test.mjs`
- `tests/solaris-storage-integration.test.mjs`
- `src/ui/solaris-character-state.js`
- `src/ui/solaris-character-ui.js`
- `tests/solaris-character-state.test.mjs`
- `tests/solaris-character-ui.test.mjs`

### Arquivos Alterados

- `README.md`
- `README_CONTEXTO_CHATGPT.md`
- `README_ATUALIZACOES_CHAT.md`
- `docs/ROADMAP_SOLARIS.md`
- `docs/SOLARIS_DATA_SCHEMA.md`
- `docs/CHECKLIST_PUBLICACAO.md`
- `app.js`
- `index.html`
- `sw.js`
- `package.json`
- `package-lock.json`
- `src/domain/solaris-character-creation.js`
- `src/export/solaris-export-core.js`
- `src/export/solaris-import-core.js`
- `src/storage/solaris-storage.js`
- `src/storage/solaris-backup.js`
- `src/ui/solaris-character-state.js`
- `src/ui/solaris-character-ui.js`
- `tests/solaris-character-state.test.mjs`
- `tests/solaris-character-ui.test.mjs`

## Como a Fase 4 Funciona

### Storage

O novo storage usa `solaris.storage.v1` como chave raiz e guarda dados em um
envelope versionado:

- `schema`
- `version`
- `meta`
- `data.characters`
- `data.customLibraryContent`
- `data.monsterSheets`
- `data.shopPriceOverrides`
- `data.settings`
- `data.campaigns`
- `data.backups`
- `migration`
- `legacy`

As chaves antigas continuam sendo lidas:

- `solaris.character.library.v1`
- `solaris.custom.content.library.v1`
- `solaris.shop.price.overrides.v1`
- `solaris.monster.library.v1`

### Migracao

A migracao aceita:

- array legado de fichas;
- snapshot legado do app;
- envelope `solaris-storage-v1`;
- JSON string valido;
- objeto ja parseado.

JSON invalido retorna erro estruturado.

### Backup

O backup cria `solaris-backup-v1`, com:

- `meta`
- `payload.storage`
- `checksum`
- `warnings`
- `legacy`

A restauracao valida o schema, avisa quando o checksum nao confere e normaliza
o conteudo pelo mesmo fluxo de migracao.

## Como a Fase 4.5 Funciona

Na abertura do app, a Biblioteca tenta carregar `solaris.storage.v1`. Se a
chave existir, ela e migrada/normalizada e usada como estado atual.

Se a chave nova nao existir, o app verifica as chaves legadas e monta um estado
compativel em memoria. Isso permite que a ficha continue abrindo como antes. A
gravacao no storage novo so acontece quando o usuario salva algo; nesse primeiro
save, um backup completo e inserido em `data.backups` antes da persistencia.

Wrappers adicionados/estabilizados:

- `initializeSolarisAppStorage`
- `listStoredSolarisCharacters`
- `loadStoredSolarisCharacter`
- `saveStoredSolarisCharacter`
- `saveStoredSolarisCharacters`
- `deleteStoredSolarisCharacter`

## Como a Fase 5 Funciona

`src/ui/solaris-character-state.js` recebe a ficha visual/legada atual e gera
uma ficha ativa normalizada para `solaris-character-v1`.

Esse estado garante:

- `identity` com nome, jogador, raca, profissao, nivel e XP;
- `attributes` oficiais com `for`, `ref`, `con`, `int`, `pre` e `men`;
- `resources` oficiais com `pv`, `stress` e `cosmos`;
- `derived` para CA, movimento, iniciativa e dados base;
- `equipment`, `inventory` e `ammoSystem` minimos para fases futuras;
- `legacy` preservado, incluindo `ESP` quando aparecer em dados antigos.

`src/ui/solaris-character-ui.js` transforma a ficha ativa em dados de leitura
para a interface, como resumo, recursos, atributos, combate e equipamentos.
Esses adaptadores nao alteram mecanicas e nao fazem migracao agressiva.

No `app.js`, a ficha ativa e sincronizada quando o usuario salva, carrega,
duplica, importa, exporta, cria ficha nova, altera foto ou quando o app faz
persistencia silenciosa.

## Testes Criados/Atualizados

Foram criados testes dedicados para:

- storage em memoria;
- migracao de snapshot legado;
- persistencia no envelope oficial;
- leitura de chaves antigas;
- preservacao de `ESP` em `legacy`;
- ausencia de conversao automatica de `ESP` para `MEN`;
- criacao de backup;
- importacao/restauracao de backup;
- warning de checksum divergente;
- rotacao de backups.
- inicializacao do app com storage novo;
- inicializacao sem storage novo;
- leitura de chaves legadas em modo compatibilidade;
- backup antes da primeira migracao persistida;
- wrappers de fichas usados pelo app visual;
- fallback em memoria sem `localStorage`.
- normalizacao da ficha ativa;
- preservacao de `ESP` em `legacy` na ficha ativa;
- recursos oficiais PV, Estresse e Cosmos em `resources`;
- adaptadores de UI para resumo, atributos, recursos, combate e equipamentos;
- sincronizacao estrutural da ficha ativa sem depender do DOM.

## Validacao Realizada

Comandos executados com sucesso:

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-equipment-rules.js
node --check src/domain/solaris-bestiary-rules.js
node --check src/domain/solaris-combat-rules.js
node --check src/domain/solaris-gm-rules.js
node --check src/domain/solaris-lore-rules.js
node --check src/schemas/solaris-schemas.js
node --check src/export/solaris-export-core.js
node --check src/export/solaris-import-core.js
node --check src/export/solaris-foundry-export.js
node --check src/storage/solaris-storage.js
node --check src/storage/solaris-migrations.js
node --check src/storage/solaris-backup.js
node --check src/ui/solaris-character-state.js
node --check src/ui/solaris-character-ui.js
node --test tests/solaris-storage.test.mjs
node --test tests/solaris-migrations.test.mjs
node --test tests/solaris-backup.test.mjs
node --test tests/solaris-storage-integration.test.mjs
node --test tests/solaris-character-state.test.mjs
node --test tests/solaris-character-ui.test.mjs
git diff --check
```

Resultado:

- `npm test`: 237 testes passaram.
- `node --test tests/solaris-storage.test.mjs`: 6 testes passaram.
- `node --test tests/solaris-migrations.test.mjs`: 5 testes passaram.
- `node --test tests/solaris-backup.test.mjs`: 6 testes passaram.
- `node --test tests/solaris-storage-integration.test.mjs`: 9 testes passaram.
- `node --test tests/solaris-character-state.test.mjs`: 17 testes passaram.
- `node --test tests/solaris-character-ui.test.mjs`: 8 testes passaram.
- Todos os `node --check` passaram.
- `git diff --check`: sem erro; apenas avisos normais de LF/CRLF no Windows.

## Regras Importantes Para Proximas Etapas

- Nao alterar mecanicas visuais ou UI quando a tarefa for apenas schema/storage.
- Nao migrar `ESP` para `MEN` sem decisao manual.
- Preservar dados antigos em `legacy` sempre que houver duvida.
- Foundry deve continuar como destino de exportacao/importacao, nao como fonte oficial.
- A Biblioteca Solaris continua sendo o centro dos dados oficiais.

## Proximo Passo Recomendado

Seguir para a Fase 6: inventario fisico completo usando a ficha ativa modular,
com foco em equipamentos, locais fisicos, municao, carregadores e preparacao
mais rica para exportacao Foundry futura.
