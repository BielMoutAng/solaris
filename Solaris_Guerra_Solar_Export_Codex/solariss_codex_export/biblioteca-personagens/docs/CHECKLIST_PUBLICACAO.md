# Checklist de Publicacao

Antes de publicar:

1. Confirmar que a Biblioteca abre normalmente.
2. Confirmar que o modo offline continua funcionando.
3. Confirmar que fichas antigas ainda importam.
4. Atualizar cache em `index.html`, `app.js` e `sw.js` quando necessario.
5. Rodar `npm test`.
6. Rodar `node --check` nos arquivos principais.
7. Rodar `node --check` em novos arquivos JS.
8. Verificar `git diff --check`.
9. Atualizar `README_CONTEXTO_CHATGPT.md` quando a estrutura mudar.
10. Criar tag/release somente depois dos testes.

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
node --test tests/solaris-schemas.test.mjs
node --test tests/solaris-export.test.mjs
node --test tests/solaris-storage.test.mjs
node --test tests/solaris-migrations.test.mjs
node --test tests/solaris-backup.test.mjs
node --test tests/solaris-storage-integration.test.mjs
node --test tests/solaris-inventory-rules.test.mjs
node --test tests/solaris-character-state.test.mjs
node --test tests/solaris-character-ui.test.mjs
```
