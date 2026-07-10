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

### Ficha ativa na Biblioteca

A UI da Biblioteca usa uma camada modular de ficha ativa em
`src/ui/solaris-character-state.js`. Essa camada recebe a ficha visual antiga,
normaliza para `solaris-character-v1` e preserva compatibilidade sem alterar a
mecanica exibida em `app.js`.

Secoes garantidas na ficha ativa:

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

`src/ui/solaris-character-ui.js` fornece adaptadores somente de leitura para a
interface atual, como resumo, recursos, atributos, combate e equipamentos. Esses
adaptadores nao fazem migracao agressiva, nao convertem `ESP` para `MEN` e nao
tratam Cosmos como atributo base.

### `equipment`

`equipment` descreve o que esta pronto no corpo ou em suportes fisicos do
personagem:

- `armor`: armadura equipada, ou `null`;
- `weapons`: armas equipadas/preparadas;
- `activeWeaponId`: arma ativa;
- `equippedItems`: itens genericos equipados;
- `hooks`: ganchos e itens presos em ganchos;
- `holsters`: coldres e itens presos em coldres;
- `bandoliers`: bandoleiras e itens presos em bandoleiras.

Ganchos, coldres e bandoleiras podem usar `contents` para listar os itens
presos naquele suporte. A compatibilidade de tamanho/tipo ainda e permissiva
nesta fase e sera refinada junto com regras futuras.

### `inventory`

`inventory` descreve armazenamento fisico:

- `looseItems`: itens soltos;
- `cubes`: cubos como containers fisicos;
- `credits`: Luzentis;
- `allItems`: lista consolidada para exportacao/compatibilidade;
- `unassigned`: itens sem local definido;
- `backpacks`: mochilas ou containers similares, quando existirem.

Cubos usam o formato geral de item/container e podem conter:

```json
{
  "id": "cube_001",
  "name": "Cubo Simples",
  "type": "cube",
  "contents": [],
  "capacity": null
}
```

Se a capacidade oficial ainda nao estiver consolidada no dado importado, o app
deve preservar o campo existente e nao bloquear movimentacao apenas por falta de
capacidade.

### `location`

Todo item normalizado pode receber `location` para indicar onde esta fisicamente:

```json
{
  "type": "loose",
  "id": null,
  "parentId": null,
  "slot": null,
  "index": null,
  "metadata": {}
}
```

Tipos iniciais:

- `equipped`
- `armor`
- `hand`
- `hook`
- `holster`
- `bandolier`
- `cube`
- `backpack`
- `loose`
- `attached`
- `container`
- `unknown`

Exemplos:

```json
{ "type": "cube", "id": "cube_001" }
```

```json
{ "type": "attached", "parentId": "weapon_001", "slot": "magazine" }
```

`attached` representa itens acoplados fisicamente a outro item, como um
carregador conectado a uma arma.

### `ammoSystem`

`ammoSystem` usa `schemaVersion: 1` e consolida a parte funcional de municao da
ficha com:

- `magazines`
- `ammoStacks`
- `loadedWeapons`

`ammoStacks` representam pilhas de municao por tipo, quantidade e unidades de
cubo ocupadas. `magazines` representam carregadores com capacidade, municao
carregada, compatibilidade e possivel arma conectada. `loadedWeapons`
representa o estado de municao das armas, incluindo fonte ativa, carregador
acoplado, municao interna, modos de disparo e se a arma pode disparar.

Dados antigos ou incompletos devem ser normalizados sem apagar campos
desconhecidos; quando houver duvida, preservar em `legacy`.

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

### Integracao com o app visual

A Biblioteca deve inicializar a persistencia por `solaris-storage-v1` usando a
chave raiz `solaris.storage.v1`. Quando essa chave ainda nao existir, o app pode
ler as chaves legadas em modo compatibilidade e montar um snapshot migrado em
memoria.

Chaves legadas reconhecidas:

- `solaris.character.library.v1`
- `solaris.custom.content.library.v1`
- `solaris.shop.price.overrides.v1`
- `solaris.monster.library.v1`

Regra de seguranca:

- leitura legada nao apaga chaves antigas;
- primeira gravacao persistida apos detectar legado deve criar backup
  `solaris-backup-v1`;
- importadores e migradores preservam campos desconhecidos em `legacy`;
- `ESP` legado continua preservado em `legacy` e nao e convertido
  automaticamente para `MEN`.

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
