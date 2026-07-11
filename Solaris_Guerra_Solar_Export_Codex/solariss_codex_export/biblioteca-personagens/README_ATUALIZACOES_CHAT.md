# Atualizacoes Recentes - Biblioteca Solaris / Guerra Solar

Este resumo foi criado para ser enviado a outro chat como contexto do estado
atual do projeto.

## Projeto

Estamos trabalhando na Biblioteca Solaris / Guerra Solar.

A Biblioteca Solaris continua sendo a fonte oficial dos dados do sistema. O
Foundry VTT e o destino final de jogo, mas nao substitui a Biblioteca nem vira
a fonte oficial dos dados.

O objetivo final do projeto e criar a Biblioteca Solaris completa e, a partir
dela, criar um sistema jogavel de Guerra Solar no Foundry VTT. O usuario deve
conseguir criar ou importar personagens da Biblioteca Solaris, abrir um mundo
Guerra Solar no Foundry, criar personagens e criaturas, usar itens e
habilidades, rolar testes oficiais, controlar combate e jogar uma sessao
completa.

## Produtos Conectados

1. Biblioteca Solaris
   - ficha;
   - itens;
   - inventario fisico;
   - cubos;
   - municao;
   - habilidades;
   - bestiario;
   - regras;
   - rolagens;
   - HUD vital;
   - storage;
   - backup;
   - exportacao/importacao.
2. Solaris Foundry Bridge
   - `solaris-character-v1`;
   - `solaris-item-v1`;
   - `solaris-creature-v1`;
   - `solaris-export-bundle-v1`;
   - `solaris-foundry-draft-v1`;
   - importador/exportador.
3. Sistema Foundry Guerra Solar
   - `system.json`;
   - Actors `character` e `npc`;
   - Items `weapon`, `armor`, `ammo`, `magazine`, `container` e `ability`;
   - fichas nativas;
   - rolagens nativas;
   - combate;
   - condicoes;
   - compendios;
   - importador integrado;
   - sessao jogavel.

## Versao Atual

- App: `0.6.0-alpha.35`
- Cache web/PWA: `20260710c`
- Branch enviada ao GitHub: `main`
- Ultima tag enviada: `v0.6.0-alpha.35`
- Ultima fase registrada: Fase 8 - Itens, habilidades e catalogos oficiais estruturados
  concluida
- Ultima decisao registrada: roadmap integrado Biblioteca Solaris -> Foundry
  Bridge -> Sistema Foundry Guerra Solar
- Esta atualizacao conclui a primeira camada oficial de catalogos estruturados
  sem alterar visualmente a interface.

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

### Atualizacao de Direcao - Roadmap Integrado Foundry

Foi registrada a nova direcao oficial do projeto: a Biblioteca Solaris segue
como fonte oficial dos dados, enquanto o Foundry VTT passa a ser o destino final
de jogo. O projeto agora deve ser conduzido como tres produtos conectados:

- Biblioteca Solaris;
- Solaris Foundry Bridge;
- Sistema Foundry Guerra Solar.

Tambem foi registrado o roadmap obrigatorio da Fase 6 ate a Fase 24, mantendo a
Fase 6 como concluida e preparando a Fase 7 como o proximo passo: municao,
carregadores e armas carregadas.

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

### Fase 6 - Inventario Fisico Completo

Foi criada a base estrutural do inventario fisico da ficha, preparando a
Biblioteca Solaris para representar onde cada item esta no corpo, nos cubos,
nos suportes e nos containers, sem implementar ainda a logica profunda de
municao/carregadores.

Status: concluida em `0.6.0-alpha.33`, cache `20260710a`.

Mudancas centrais:

- Criado `src/domain/solaris-inventory-rules.js` com regras puras, sem DOM.
- Criado modelo canonico `location` para itens fisicos.
- Tipos iniciais de local: `equipped`, `armor`, `hand`, `hook`, `holster`,
  `bandolier`, `cube`, `backpack`, `loose`, `attached`, `container` e
  `unknown`.
- Cubos passam a ser normalizados como containers com `contents`.
- Ganchos, coldres e bandoleiras passam a existir como suportes fisicos.
- Foram criadas funcoes para adicionar, remover, mover, equipar e desequipar
  itens sem apagar dados desconhecidos.
- `normalizeActiveCharacter` agora garante inventario fisico normalizado.
- `solaris-character-ui.js` ganhou view models de inventario, equipamento,
  armazenamento, cubos e acesso rapido.
- A exportacao base preserva itens em cubos e suportes no inventario fisico.
- `ammoSystem` continua apenas preparado para a Fase 7.
- `ESP` legado continua preservado em `legacy`, sem conversao automatica.

### Fase 7 - Municao, Carregadores e Armas Carregadas

Foi criada a base funcional de municao da Biblioteca Solaris, mantendo a regra
de que a Biblioteca continua sendo a fonte oficial e que o Foundry so recebe um
rascunho exportavel por enquanto.

Status: concluida em `0.6.0-alpha.34`, cache `20260710b`.

Mudancas centrais:

- Criado `src/domain/solaris-ammo-rules.js` com regras puras, sem DOM.
- Pilhas de municao agora sao normalizadas por tipo, quantidade e unidades de
  cubo.
- Carregadores agora sao normalizados com capacidade, municao carregada,
  compatibilidade e vinculo opcional com arma.
- Armas carregadas agora consolidam `ammoProfile`, `ammoState`, fonte ativa,
  carregador acoplado, municao interna e estado de disparo.
- Foram adicionadas operacoes de acoplar/desacoplar carregador, carregar
  carregador, recarregar arma interna, disparar e acionar pump.
- `normalizeActiveCharacter` agora garante `ammoSystem` funcional junto com
  `equipment` e `inventory`.
- `solaris-character-ui.js` ganhou view model de municao para uso futuro pela
  interface.
- A exportacao `solaris-character-v1` e o `solaris-foundry-draft-v1` passam a
  preservar dados de municao, carregadores e armas carregadas.
- `ESP` legado continua preservado em `legacy`, sem conversao automatica para
  `MEN`.
- A interface visual nao foi alterada nesta fase.

### Fase 8 - Itens, Habilidades e Catalogos Oficiais Estruturados

Foi criada a primeira camada canonica de catalogos oficiais da Biblioteca
Solaris, mantendo a Biblioteca como fonte oficial e preparando a futura
exportacao para compendios/itens do Foundry sem implementar Foundry real ainda.

Status: concluida em `0.6.0-alpha.35`, cache `20260710c`.

Mudancas centrais:

- Criado `src/domain/solaris-catalog-rules.js` com regras puras, sem DOM.
- O catalogo oficial do Livro 5 agora e estruturado em colecoes: armas,
  armaduras, itens comuns, armazenamento, cubos, chips modificadores, mods e
  habilidades cosmicas.
- Cada entrada passa a ter schema, id oficial, colecao, tipo, tier, tags,
  preco, peso, quantidade, detalhes completos e metadados de fonte.
- Foram criados indice, filtros por texto/tier/preco/tags/colecao e ordenacao
  por nome, preco ou tier.
- Foram criados detalhes padronizados para janelas de dois cliques.
- Foram criados adaptadores para converter entradas de catalogo em
  `solaris-item-v1`.
- `solaris-item-v1` agora reconhece `container` e `mod` como tipos validos.
- As habilidades cosmicas que estavam duplicadas em `app.js` passaram a sair
  da camada de catalogo, preservando os nomes oficiais acentuados e os IDs
  antigos usados por fichas salvas.
- O service worker passou a cachear o novo modulo de catalogo para uso
  offline/PWA.
- A interface visual nao foi alterada nesta fase.

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
- `src/domain/solaris-inventory-rules.js`
- `tests/solaris-inventory-rules.test.mjs`
- `src/domain/solaris-ammo-rules.js`
- `tests/solaris-ammo-rules.test.mjs`
- `src/domain/solaris-catalog-rules.js`
- `tests/solaris-catalog-rules.test.mjs`

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
- `src/domain/solaris-inventory-rules.js`
- `src/domain/solaris-equipment-rules.js`
- `src/domain/solaris-ammo-rules.js`
- `src/domain/solaris-catalog-rules.js`
- `src/export/solaris-export-core.js`
- `src/export/solaris-foundry-export.js`
- `src/schemas/solaris-schemas.js`
- `src/export/solaris-import-core.js`
- `src/storage/solaris-storage.js`
- `src/storage/solaris-backup.js`
- `src/ui/solaris-character-state.js`
- `src/ui/solaris-character-ui.js`
- `tests/solaris-character-state.test.mjs`
- `tests/solaris-character-ui.test.mjs`
- `tests/solaris-ammo-rules.test.mjs`
- `tests/solaris-catalog-rules.test.mjs`
- `tests/solaris-export.test.mjs`

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

## Como a Fase 6 Funciona

`src/domain/solaris-inventory-rules.js` transforma o inventario em uma estrutura
fisica. Cada item pode carregar `location`, informando se esta solto, equipado,
em armadura, em mao, em cubo, em gancho, em coldre, em bandoleira, em mochila,
acoplado a outro item, dentro de container ou em local desconhecido.

Funcoes centrais:

- `normalizeCharacterInventory`
- `normalizeInventoryItem`
- `normalizeInventoryLocation`
- `addItemToCharacterInventory`
- `removeItemFromCharacterInventory`
- `moveItemToLocation`
- `equipCharacterItem`
- `unequipCharacterItem`
- `equipArmor`
- `unequipArmor`
- `equipWeapon`
- `unequipWeapon`
- `setActiveWeapon`
- `listCubeContents`
- `placeItemOnHook`
- `placeItemInHolster`
- `placeItemInBandolier`

A ficha ativa modular chama essa normalizacao no fechamento da ficha. Assim,
fichas antigas continuam abrindo, mas a estrutura nova ja fica disponivel para
exportacao, futuras telas e futura ponte com Foundry.

Os view models adicionados em `src/ui/solaris-character-ui.js` sao somente de
leitura:

- `getCharacterInventoryViewModel`
- `getCharacterEquipmentViewModel`
- `getCharacterStorageViewModel`
- `getCubeViewModels`
- `getQuickAccessViewModel`

Eles nao alteram layout, DOM ou mecanicas oficiais.

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
- normalizacao de inventario fisico;
- localizacao de itens por `location`;
- movimentacao de itens entre solto, cubo, gancho, coldre e bandoleira;
- cubos como containers com `contents`;
- equipar/desequipar arma e armadura;
- view models de inventario, equipamento, cubos e acesso rapido.
- normalizacao de pilhas de municao, carregadores e armas carregadas;
- acoplar/desacoplar carregador, recarregar, disparar e pump;
- view model de municao;
- exportacao de `ammoSystem` para schema oficial e Foundry Draft.
- catalogos oficiais estruturados para armas, armaduras, itens,
  armazenamento, cubos, chips modificadores, mods e habilidades cosmicas;
- indice, filtros, detalhes completos e conversao para `solaris-item-v1`.

## Validacao Realizada

Comandos executados com sucesso:

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-equipment-rules.js
node --check src/domain/solaris-inventory-rules.js
node --check src/domain/solaris-ammo-rules.js
node --check src/domain/solaris-catalog-rules.js
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
node --test tests/solaris-inventory-rules.test.mjs
node --test tests/solaris-storage.test.mjs
node --test tests/solaris-migrations.test.mjs
node --test tests/solaris-backup.test.mjs
node --test tests/solaris-storage-integration.test.mjs
node --test tests/solaris-character-state.test.mjs
node --test tests/solaris-character-ui.test.mjs
node --test tests/solaris-ammo-rules.test.mjs
node --test tests/solaris-catalog-rules.test.mjs
git diff --check
```

Resultado:

- `npm test`: 295 testes passaram.
- `node --test tests/solaris-storage.test.mjs`: 6 testes passaram.
- `node --test tests/solaris-migrations.test.mjs`: 5 testes passaram.
- `node --test tests/solaris-backup.test.mjs`: 6 testes passaram.
- `node --test tests/solaris-storage-integration.test.mjs`: 9 testes passaram.
- `node --test tests/solaris-inventory-rules.test.mjs`: 30 testes passaram.
- `node --test tests/solaris-ammo-rules.test.mjs`: 8 testes passaram.
- `node --test tests/solaris-catalog-rules.test.mjs`: 10 testes passaram.
- `node --test tests/solaris-character-state.test.mjs`: 21 testes passaram.
- `node --test tests/solaris-character-ui.test.mjs`: 14 testes passaram.
- Todos os `node --check` passaram.
- `git diff --check`: sem erro; apenas avisos normais de LF/CRLF no Windows.

## Regras Importantes Para Proximas Etapas

- Nao quebrar fichas antigas.
- Nao apagar chaves legadas sem migracao segura e backup.
- Nao migrar `ESP` para `MEN` sem decisao manual.
- Atributos oficiais: `FOR`, `REF`, `CON`, `INT`, `PRE` e `MEN`.
- Cosmos e recurso/poder separado, nao atributo base.
- Preservar dados antigos em `legacy` sempre que houver duvida.
- Nao alterar valores oficiais sem fase especifica de revisao.
- Preferir regras puras em `src/domain`.
- `app.js` deve ser camada de interface/aplicacao, nao deposito de regra.
- Foundry real so entra depois que a Biblioteca tiver dados estruturados.
- A Biblioteca Solaris continua sendo o centro dos dados oficiais.
- Toda fase deve atualizar `README_CONTEXTO_CHATGPT.md` e
  `README_ATUALIZACOES_CHAT.md`.
- Toda fase deve rodar `npm test`, `node --check` e `git diff --check`.

## Roadmap Obrigatorio

- Fase 6 - Inventario fisico completo. Status: concluida em
  `0.6.0-alpha.33`.
- Fase 7 - Municao, carregadores e armas carregadas. Status: concluida em
  `0.6.0-alpha.34`.
- Fase 8 - Itens, habilidades e catalogos oficiais estruturados. Status:
  concluida em `0.6.0-alpha.35`.
- Fase 9 - Bestiario estruturado.
- Fase 10 - Rolagens e combate completos na Biblioteca.
- Fase 11 - HUD vital funcional.
- Fase 12 - Criador de personagem completo.
- Fase 13 - Painel do mestre na Biblioteca.
- Fase 14 - Foundry Draft completo.
- Fase 15 - Modulo Foundry `solaris-importer`.
- Fase 16 - Estrutura do sistema Foundry `guerra-solar`.
- Fase 17 - Data Models do Foundry.
- Fase 18 - Fichas nativas do Foundry.
- Fase 19 - Rolagens nativas do Foundry.
- Fase 20 - Combate nativo do Foundry.
- Fase 21 - Compendios oficiais do Foundry.
- Fase 22 - Importador integrado ao sistema Foundry.
- Fase 23 - Cena jogavel piloto.
- Fase 24 - Release do sistema Guerra Solar para Foundry.

## Proximo Passo Recomendado

Seguir para a Fase 9: bestiario estruturado, usando a mesma estrategia de
catalogo oficial, detalhes completos, indice/filtros e conversao para
`solaris-creature-v1`.
