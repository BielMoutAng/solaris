# Solaris Data Schema

Os schemas iniciais ficam em `src/schemas/solaris-schemas.js`.

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
