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
- `src/domain/solaris-bestiary-rules.js`
- `src/domain/solaris-combat-rules.js`
- `src/domain/solaris-gm-rules.js`
- `src/domain/solaris-lore-rules.js`
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
node --check src/domain/solaris-bestiary-rules.js
node --check src/domain/solaris-combat-rules.js
node --check src/domain/solaris-gm-rules.js
node --check src/domain/solaris-lore-rules.js
```

Versao atual:

- App: `0.6.0-alpha.25`
- Cache web: `20260630a`

Regras de manutencao:

- Preservar funcionamento offline.
- Nao quebrar fichas salvas antigas; usar migracoes quando necessario.
- Preferir regras puras em `src/domain` e adaptar a UI em `app.js`.
- Ao alterar catalogos oficiais, manter detalhes completos acessiveis por dois
  cliques quando a tela oferecer detalhamento.
- Ao publicar, atualizar cache em `index.html`, `app.js`, `sw.js` e nos imports
  de dominio quando necessario.
