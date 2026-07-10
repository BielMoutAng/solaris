# Contexto para ChatGPT - Solaris Biblioteca

Este projeto e a Biblioteca de Personagens Solaris / Guerra Solar.

Direcao oficial atual:

- O objetivo final e criar a Biblioteca Solaris completa e, a partir dela,
  criar um sistema jogavel de Guerra Solar no Foundry VTT.
- A Biblioteca Solaris continua sendo a fonte oficial dos dados.
- O Foundry VTT e o destino final de jogo, mas nao substitui a Biblioteca.
- O usuario deve conseguir criar ou importar personagens da Biblioteca
  Solaris, abrir um mundo Guerra Solar no Foundry, criar personagens e
  criaturas, usar itens e habilidades, rolar testes oficiais, controlar
  combate e jogar uma sessao completa.

Produtos conectados:

1. Biblioteca Solaris: ficha, itens, inventario fisico, cubos, municao,
   habilidades, bestiario, regras, rolagens, HUD vital, storage, backup e
   exportacao/importacao.
2. Solaris Foundry Bridge: `solaris-character-v1`, `solaris-item-v1`,
   `solaris-creature-v1`, `solaris-export-bundle-v1`,
   `solaris-foundry-draft-v1` e importador/exportador.
3. Sistema Foundry Guerra Solar: `system.json`, Actors `character`/`npc`,
   Items `weapon`/`armor`/`ammo`/`magazine`/`container`/`ability`, fichas
   nativas, rolagens nativas, combate, condicoes, compendios, importador
   integrado e sessao jogavel.

Estado atual:

- O repositorio deve manter somente a Biblioteca Solaris.
- A tela inicial da Biblioteca continua sendo o hub em formato de tablet.
- A ficha de personagem, biblioteca de itens, bestiario, regras, rolagens,
  inventario fisico, cubos e HUD vital continuam ativos.
- O app precisa funcionar offline no navegador, no PWA/iPhone e no desktop
  Electron.
- Dados do usuario ficam em armazenamento local e devem poder ser exportados e
  importados.

Arquivos principais:

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- `HumanisVitalHUD.js`
- `official-books-data.js`
- `official-book5-catalog.js`
- `official-rulebook-compendium.js`
- `src/domain/solaris-domain-architecture.js`
- `src/domain/solaris-character-creation.js`
- `src/domain/solaris-equipment-rules.js`
- `src/domain/solaris-inventory-rules.js`
- `src/domain/solaris-bestiary-rules.js`
- `src/domain/solaris-combat-rules.js`
- `src/domain/solaris-gm-rules.js`
- `src/domain/solaris-lore-rules.js`
- `src/schemas/solaris-schemas.js`
- `src/export/solaris-export-core.js`
- `src/export/solaris-import-core.js`
- `src/export/solaris-foundry-export.js`
- `src/storage/solaris-storage.js`
- `src/storage/solaris-migrations.js`
- `src/storage/solaris-backup.js`
- `src/ui/solaris-character-state.js`
- `src/ui/solaris-character-ui.js`
- `tests/solaris-storage-integration.test.mjs`
- `tests/solaris-inventory-rules.test.mjs`
- `tests/solaris-character-state.test.mjs`
- `tests/solaris-character-ui.test.mjs`
- `electron-main.cjs`
- `electron-builder.ficha.cjs`

Comandos principais:

```bash
npm start
npm test
npm run dist
```

Validacao recomendada:

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-equipment-rules.js
node --check src/domain/solaris-inventory-rules.js
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
node --test tests/solaris-storage-integration.test.mjs
node --test tests/solaris-inventory-rules.test.mjs
node --test tests/solaris-character-state.test.mjs
node --test tests/solaris-character-ui.test.mjs
```

Versao atual:

- App: `0.6.0-alpha.33`
- Cache web: `20260710a`

Roadmap obrigatorio daqui em diante:

- Fase 6 - Inventario fisico completo. Status: concluida em
  `0.6.0-alpha.33`.
- Fase 7 - Municao, carregadores e armas carregadas.
- Fase 8 - Itens, habilidades e catalogos oficiais estruturados.
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

Regras de manutencao:

- Preservar funcionamento offline.
- Nao quebrar fichas salvas antigas; usar migracoes quando necessario.
- Nao apagar chaves legadas sem migracao segura e backup.
- Nao migrar `ESP` automaticamente para `MEN`.
- Atributos oficiais: `FOR`, `REF`, `CON`, `INT`, `PRE` e `MEN`.
- Cosmos e recurso/poder separado, nao atributo base.
- Preservar `legacy` sempre que houver duvida.
- Nao alterar valores oficiais sem fase especifica de revisao.
- Preferir regras puras em `src/domain` e adaptar a UI em `app.js`.
- `app.js` deve ser camada de interface/aplicacao, nao deposito de regra.
- Foundry real so entra depois que a Biblioteca tiver dados estruturados.
- Toda fase deve atualizar `README_CONTEXTO_CHATGPT.md` e
  `README_ATUALIZACOES_CHAT.md`.
- Toda fase deve rodar `npm test`, `node --check` e `git diff --check`.
- Ao alterar catalogos oficiais, manter detalhes completos acessiveis por dois
  cliques quando a tela oferecer detalhamento.
- Ao publicar, atualizar cache em `index.html`, `app.js`, `sw.js` e nos imports
  de dominio quando necessario.
- A exportacao oficial agora comeca por `solaris-character-v1`; o Foundry usa
  `solaris-foundry-draft-v1` como rascunho independente.
- A persistencia dedicada usa `solaris-storage-v1` e backups usam
  `solaris-backup-v1`, preservando chaves antigas em modo compatibilidade.
- O app visual ja inicializa pelo storage dedicado: quando so existem chaves
  legadas, ele le em modo compatibilidade e cria backup antes da primeira
  gravacao persistida no storage novo.
- A ficha ativa ja possui camada modular em `src/ui`, normalizada para
  `solaris-character-v1`, com recursos oficiais em `resources` e `ESP`
  preservado somente em `legacy`.
- A Fase 6 concluiu a consolidacao do inventario fisico em
  `src/domain/solaris-inventory-rules.js`, com `location`, cubos como
  containers, ganchos, coldres, bandoleiras, view models de armazenamento e
  testes dedicados.
