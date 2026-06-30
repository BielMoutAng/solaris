# Atualizacoes Recentes - Biblioteca Solaris / Guerra Solar

Este resumo foi criado para ser enviado a outro chat como contexto do estado
atual do projeto.

## Projeto

Estamos trabalhando na Biblioteca Solaris / Guerra Solar.

A Biblioteca Solaris continua sendo a fonte oficial dos dados do sistema. O
Foundry VTT sera tratado apenas como destino futuro de exportacao/importacao,
sem virar o centro do projeto.

## Versao Atual

- App: `0.6.0-alpha.28`
- Cache web/PWA: `20260630e`
- Branch enviada ao GitHub: `main`
- Ultima tag enviada: `v0.6.0-alpha.28`
- Ultimo commit relevante: `4851dcc Oficializa MEN nos schemas Solaris`

## Decisao Oficial de Atributos

Foi oficializada a opcao B.

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

### Documentacao

Foram atualizados:

- `docs/GLOSSARIO_SOLARIS.md`
- `docs/SOLARIS_DATA_SCHEMA.md`
- `docs/ARQUITETURA_SOLARIS.md`
- `docs/ROADMAP_SOLARIS.md`

Esses documentos agora deixam claro que:

- `MEN` e atributo oficial.
- `ESP` e apenas legado/compatibilidade.
- Cosmos e recurso/poder separado.
- Conversoes de `ESP` para `MEN` nao devem acontecer automaticamente.

### Schemas e Validadores

O arquivo principal de schemas foi reforcado:

- `src/schemas/solaris-schemas.js`

Ele agora contem:

- constantes oficiais de schema;
- `CURRENT_SOLARIS_SAVE_VERSION`;
- lista oficial de atributos;
- lista de atributos legados;
- validadores basicos para personagem, item, criatura, campanha, export bundle e Foundry Draft;
- warnings quando `ESP` aparece em dados legados;
- warning quando Cosmos aparece indevidamente dentro de `attributes`.

Arquivos auxiliares tambem foram alinhados:

- `src/schemas/solaris-character.schema.js`
- `src/schemas/solaris-item.schema.js`
- `src/schemas/solaris-campaign.schema.js`
- `src/schemas/solaris-export.schema.js`

### Exportacao e Importacao

Foram ajustados:

- `src/export/solaris-export-core.js`
- `src/export/solaris-import-core.js`
- `src/export/solaris-foundry-export.js`

Mudancas principais:

- `attributes.esp` nao e mais exportado como atributo oficial.
- `ESP` antigo fica preservado no `legacy`.
- importacao nao converte `ESP` automaticamente para `MEN`.
- se `ESP` for encontrado, o importador gera warning de compatibilidade.
- Foundry Draft recebeu estrutura de validacao basica, sem usar APIs reais do Foundry.

## Testes Criados/Atualizados

Foi criado:

- `tests/solaris-schemas.test.mjs`

Foi atualizado:

- `tests/solaris-export.test.mjs`

Os testes cobrem:

- constantes oficiais dos schemas;
- personagem minimo valido com `MEN`;
- `ESP` nao obrigatorio;
- warning quando `ESP` aparece;
- warning se Cosmos aparece em `attributes`;
- item, criatura, campanha, export bundle e Foundry Draft minimos;
- exportacao sem `esp` como atributo oficial;
- importacao sem migrar `ESP` para `MEN` automaticamente.

## Validacao Realizada

Comandos rodados com sucesso:

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
node --test tests/solaris-schemas.test.mjs
git diff --check
```

Resultado:

- `npm test`: 182 testes passaram.
- Todos os `node --check` passaram.
- `git diff --check`: sem erro, apenas avisos normais de LF/CRLF no Windows.

## Regras Importantes Para Proximas Etapas

- Nao alterar mecanicas visuais ou UI quando a tarefa for apenas schema/documentacao.
- Nao migrar `ESP` para `MEN` sem decisao manual.
- Preservar dados antigos em `legacy` sempre que houver duvida.
- Foundry deve continuar como destino de exportacao/importacao, nao como fonte oficial.
- A Biblioteca Solaris continua sendo o centro dos dados oficiais.

## Proximo Passo Recomendado

Avancar para a proxima fase da exportacao/importacao:

1. Refinar o formato `solaris-character-v1`.
2. Criar validacao mais profunda por secao da ficha.
3. Definir melhor `resources` para PV, Cosmos, Estresse e outros recursos.
4. Preparar mapeamento Foundry Draft sem usar ainda APIs reais do Foundry.
5. Manter compatibilidade total com fichas antigas.
