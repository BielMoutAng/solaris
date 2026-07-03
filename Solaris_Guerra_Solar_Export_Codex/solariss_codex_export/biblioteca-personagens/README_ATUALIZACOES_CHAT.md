# Atualizacoes Recentes - Biblioteca Solaris / Guerra Solar

Este resumo foi criado para ser enviado a outro chat como contexto do estado
atual do projeto.

## Projeto

Estamos trabalhando na Biblioteca Solaris / Guerra Solar.

A Biblioteca Solaris continua sendo a fonte oficial dos dados do sistema. O
Foundry VTT sera tratado apenas como destino futuro de exportacao/importacao,
sem virar o centro do projeto.

## Versao Atual

- App: `0.6.0-alpha.30`
- Cache web/PWA: `20260703a`
- Branch enviada ao GitHub: `main`
- Ultima tag enviada: `v0.6.0-alpha.30`
- Ultima fase registrada: Fase 4 - Persistencia e migracao dedicada

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

### Arquivos Criados

- `src/storage/solaris-storage.js`
- `src/storage/solaris-migrations.js`
- `src/storage/solaris-backup.js`
- `tests/solaris-storage.test.mjs`
- `tests/solaris-migrations.test.mjs`
- `tests/solaris-backup.test.mjs`

### Arquivos Alterados

- `README.md`
- `README_CONTEXTO_CHATGPT.md`
- `README_ATUALIZACOES_CHAT.md`
- `app.js`
- `index.html`
- `sw.js`
- `package.json`
- `package-lock.json`
- `src/domain/solaris-character-creation.js`
- `src/export/solaris-export-core.js`

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
node --test tests/solaris-storage.test.mjs
node --test tests/solaris-migrations.test.mjs
node --test tests/solaris-backup.test.mjs
git diff --check
```

Resultado:

- `npm test`: 203 testes passaram.
- `node --test tests/solaris-storage.test.mjs`: 6 testes passaram.
- `node --test tests/solaris-migrations.test.mjs`: 5 testes passaram.
- `node --test tests/solaris-backup.test.mjs`: 6 testes passaram.
- Todos os `node --check` passaram.
- `git diff --check`: sem erro; apenas avisos normais de LF/CRLF no Windows.

## Regras Importantes Para Proximas Etapas

- Nao alterar mecanicas visuais ou UI quando a tarefa for apenas schema/storage.
- Nao migrar `ESP` para `MEN` sem decisao manual.
- Preservar dados antigos em `legacy` sempre que houver duvida.
- Foundry deve continuar como destino de exportacao/importacao, nao como fonte oficial.
- A Biblioteca Solaris continua sendo o centro dos dados oficiais.

## Proximo Passo Recomendado

Integrar gradualmente o app visual ao novo `solaris-storage-v1`, primeiro em
modo compatibilidade, mantendo leitura das chaves antigas e gerando backup antes
de qualquer migracao persistida automaticamente.
