# Contexto para ChatGPT - Solaris Biblioteca

Este projeto e a Biblioteca de Personagens Solaris / Guerra Solar.

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

Regras de manutencao:

- Preservar funcionamento offline.
- Nao quebrar fichas salvas antigas; usar migracoes quando necessario.
- Preferir regras puras em `src/domain` e adaptar a UI em `app.js`.
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
- A Fase 6 iniciou a consolidacao do inventario fisico em
  `src/domain/solaris-inventory-rules.js`, com `location`, cubos como
  containers, ganchos, coldres, bandoleiras e view models de armazenamento.
