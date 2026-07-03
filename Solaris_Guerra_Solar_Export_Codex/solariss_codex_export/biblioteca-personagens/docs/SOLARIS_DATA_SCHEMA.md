# Solaris Data Schema

Os schemas iniciais ficam em `src/schemas/solaris-schemas.js`. Esse arquivo
contem as constantes oficiais, validadores basicos e validadores por secao da
ficha. A validacao profunda de regras numericas ainda vira depois, quando os
modelos oficiais estiverem estabilizados.

## Schemas atuais

- `solaris-character-v1`
- `solaris-item-v1`
- `solaris-creature-v1`
- `solaris-campaign-v1`
- `solaris-export-bundle-v1`
- `solaris-foundry-draft-v1`
- `solaris-storage-v1`
- `solaris-backup-v1`

## Personagem

Campos principais:

- `schema`
- `id`
- `meta`
- `identity`
- `attributes`
- `modifiers`
- `resources`
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
separado e deve ficar em `resources`.

### `resources`

`resources` e a secao oficial para recursos mutaveis do personagem:

- `pv`
- `stress`
- `cosmos`

Cada recurso usa o formato:

```json
{
  "value": 0,
  "max": 0
}
```

Durante a transicao, exportacoes podem manter espelhos antigos em
`derived.pv`, `derived.stress` e `derived.cosmos` para compatibilidade, mas o
destino oficial e `resources`.

### `derived`

`derived` deve guardar valores calculados ou auxiliares, como:

- `ca`
- `movement`
- `baseDice`
- `initiative`

PV, Estresse e Cosmos nao devem ser considerados valores derivados oficiais;
eles pertencem a `resources`.

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

## Storage

`solaris-storage-v1` e o envelope dedicado para persistencia local da
Biblioteca Solaris. Ele fica em `src/storage` e deve permitir migracao segura
de dados antigos sem apagar as chaves legadas automaticamente.

Campos principais:

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

As fichas dentro de `data.characters` devem ser normalizadas para
`solaris-character-v1`.

## Backup

`solaris-backup-v1` guarda snapshots exportaveis do storage.

Campos principais:

- `schema`
- `version`
- `id`
- `meta`
- `payload.storage`
- `checksum`
- `warnings`
- `legacy`

O checksum e usado como alerta simples de integridade. Falha de checksum deve
gerar warning e restauracao cautelosa, nao migracao destrutiva.

## Regra de compatibilidade

Novas versoes devem importar dados antigos sempre que possivel. Quando uma
informacao nao puder ser migrada com seguranca, ela deve ir para `legacy` ou
gerar aviso claro ao usuario.

Regras especificas desta fase:

- `MEN` e atributo oficial.
- `ESP` e legado/compatibilidade.
- `Cosmos` e recurso separado.
- `resources` e a origem oficial de PV, Estresse e Cosmos.
- `derived` fica para CA, movimento, iniciativa, dados base e outros valores
  calculados.
- Os validadores de `src/schemas/solaris-schemas.js` verificam secoes da ficha,
  mas nao corrigem dados automaticamente.
