# Solaris Data Schema

Os schemas iniciais ficam em `src/schemas/solaris-schemas.js`. Esse arquivo
contem as constantes oficiais e validadores basicos da Fase 2. A validacao
profunda vira depois, quando os modelos oficiais estiverem estabilizados.

## Schemas atuais

- `solaris-character-v1`
- `solaris-item-v1`
- `solaris-creature-v1`
- `solaris-campaign-v1`
- `solaris-export-bundle-v1`
- `solaris-foundry-draft-v1`

## Personagem

Campos principais:

- `schema`
- `id`
- `meta`
- `identity`
- `attributes`
- `modifiers`
- `derived`
- `skills`
- `protectionRolls`
- `combat`
- `equipment`
- `inventory`
- `ammoSystem`
- `abilities`
- `notes`
- `migration`
- `legacy`

### `attributes`

Em `solaris-character-v1`, os atributos oficiais sao:

- `for`
- `ref`
- `con`
- `int`
- `pre`
- `men`

`esp` foi removido do schema oficial. ESP pode aparecer em dados legados,
rascunhos antigos ou fichas anteriores, mas importadores devem preservar esse
valor em `legacy` sem apagar. Migradores so devem converter `esp` para `men` se
uma regra de migracao for confirmada manualmente.

Cosmos nao e atributo base. Cosmos continua existindo como recurso/poder
separado e deve ficar em `derived`, `resources` ou campo equivalente futuro.

O campo `legacy` preserva dados originais para compatibilidade enquanto o app
migra para formatos mais estaveis.

## Item

Campos principais:

- `schema`
- `id`
- `name`
- `type`
- `tier`
- `source`
- `tags`
- `rules`
- `equip`
- `durability`
- `storage`
- `quantity`
- `price`
- `weight`
- `description`
- `legacy`

## Regra de compatibilidade

Novas versoes devem importar dados antigos sempre que possivel. Quando uma
informacao nao puder ser migrada com seguranca, ela deve ir para `legacy` ou
gerar aviso claro ao usuario.

Regras especificas desta fase:

- `MEN` e atributo oficial.
- `ESP` e legado/compatibilidade.
- `Cosmos` e recurso separado.
- Os validadores de `src/schemas/solaris-schemas.js` sao minimos e nao corrigem
  dados automaticamente.
