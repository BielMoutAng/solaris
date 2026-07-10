# Solaris Biblioteca

Aplicativo local e web para criar, consultar e manter fichas de personagens de
Solaris / Guerra Solar.

Este repositorio mantem apenas a Biblioteca Solaris: fichas, regras, bestiario,
catalogos, itens, armas, armaduras, chips, magias cosmicas, dados, inventario,
cubos e exportacao/importacao de dados.

## Como Abrir

- Web: abra o `index.html` publicado no GitHub Pages.
- Local simples: abra `index.html` no navegador.
- Desktop: rode `npm start`.
- Instalador Windows: rode `npm run dist`.

## Comandos

```bash
npm start
npm test
npm run dist
```

## Rotas Principais

- `?view=ficha`: abre direto na ficha/personagens.
- Sem parametro: abre a tela inicial da Biblioteca.

## Persistencia

As fichas e bibliotecas criadas pelo usuario ficam salvas no armazenamento local
do navegador ou do app desktop. Use exportar/importar dentro do proprio sistema
para fazer backup ou passar fichas para outro computador.

## Documentacao

- `docs/MANUAL_AUTONOMIA_TECNICA_SOLARIS.md`: manual completo de estudos e
  operacao autonoma para manter e evoluir a Biblioteca Solaris sem depender de
  agentes de IA.
- `docs/ARQUITETURA_SOLARIS.md`: arquitetura geral do projeto.
- `docs/SOLARIS_DATA_SCHEMA.md`: contratos de dados, schemas, storage,
  migracoes e compatibilidade.
- `docs/ROADMAP_SOLARIS.md`: fases de evolucao da Biblioteca.
- `docs/CHECKLIST_PUBLICACAO.md`: validacao antes de publicar.

## Modulos Mantidos

- `app.js`: interface principal e fluxos da Biblioteca.
- `src/domain/solaris-domain-architecture.js`: dominio de ficha, inventario,
  equipamentos e migracoes.
- `src/domain/solaris-character-creation.js`: criacao e progressao.
- `src/domain/solaris-equipment-rules.js`: regras de equipamentos.
- `src/domain/solaris-inventory-rules.js`: regras puras de inventario fisico,
  localizacao de itens, cubos e suportes.
- `src/domain/solaris-bestiary-rules.js`: bestiario, ataques e loot.
- `src/domain/solaris-combat-rules.js`: regras puras de combate usadas pela
  ficha e pelos monstros.
- `src/domain/solaris-gm-rules.js`: tabelas e apoio ao mestre dentro da
  Biblioteca.
- `src/domain/solaris-lore-rules.js`: compendio de lore.
- `src/storage/solaris-storage.js`: camada dedicada de persistencia.
- `src/storage/solaris-migrations.js`: migracoes seguras de storage legado.
- `src/storage/solaris-backup.js`: backup e restauracao de snapshots Solaris.
- `src/ui/solaris-character-state.js`: estado modular da ficha ativa.
- `src/ui/solaris-character-ui.js`: adaptadores de leitura da ficha ativa para
  a interface atual.

## Build Desktop

O build desktop usa:

- `electron-main.cjs`
- `electron-builder.ficha.cjs`

Produto gerado: `Solaris Biblioteca`.

## Validacao Recomendada

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

## Versao

Versao atual: `0.6.0-alpha.33`
Cache web atual: `20260710a`
