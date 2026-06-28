# Fase 23 - Livro 5 Equipamentos Completo

Status: implementado localmente no cache `20260624d`.

Versao local: `0.6.0-alpha.18`.

## Objetivo

Criar uma camada pura e testavel para as regras do Livro 5, sem reescrever a UI nem quebrar o modo offline, a Biblioteca, o Launcher ou o Tabletop.

A Fase 23 usa o catalogo oficial atual em `official-book5-catalog.js`, gerado a partir de `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`, e preserva a governanca `needsReview` ate a validacao manual tabela por tabela.

## Arquivo novo

- `src/domain/solaris-equipment-rules.js`

Esse modulo concentra regras de:

- armas e categorias oficiais, com `rifle de precisao` como termo correto e `sniper` apenas como alias legado de migracao;
- punhos e Manopla de Kuldrus;
- dano, ataque, atributo usado e bonus passivos;
- armaduras, CA efetiva e penalidades por rachadura;
- rachaduras de 0 a 5, com equipamento inutilizavel em 5;
- Jammed, aplicacao e limpeza fora de combate;
- mods, compatibilidade, slots e efeitos passivos;
- municao e carregadores reaproveitando a arquitetura da Fase 13;
- cubos simples, de carga, especializados e de municao;
- mochilas, coldres, bandoleiras, ganchos e item sem local definido;
- compra, venda editavel e compra inicial sem debito;
- base de crafting, validacao de materiais, ferramentas, custo, CD e resultado;
- serializacao/hidratacao de estado de equipamento para sessao e Foundry futuro.

## Funcoes principais

Exports principais:

- `EQUIPMENT_SCHEMA_VERSION`
- `EQUIPMENT_TIERS`
- `EQUIPMENT_CATEGORIES`
- `WEAPON_CATEGORIES`
- `ARMOR_CATEGORIES`
- `DAMAGE_TYPES`
- `ITEM_STORAGE_TYPES`
- `EQUIPMENT_CONDITION_STATES`
- `REPAIR_ACTIONS`
- `CRAFTING_ACTIONS`
- `MOD_CATEGORIES`
- `MOD_COMPATIBILITY_RULES`
- `createEquipmentState`
- `normalizeEquipmentEntry`
- `normalizeWeaponEntry`
- `normalizeArmorEntry`
- `normalizeModEntry`
- `normalizeAmmoEntry`
- `normalizeMagazineEntry`
- `computeWeaponAttackProfile`
- `computeWeaponDamageProfile`
- `computeArmorProfile`
- `computeEquipmentCrackPenalty`
- `applyEquipmentCrack`
- `repairEquipmentCrack`
- `applyEmergencyRepair`
- `checkEquipmentBroken`
- `checkWeaponJammed`
- `applyJammed`
- `clearJammedOutsideCombat`
- `installEquipmentMod`
- `removeEquipmentMod`
- `checkModCompatibility`
- `computeModEffects`
- `computeItemStorageCost`
- `checkStorageCompatibility`
- `computeSaleValue`
- `computeBuyTransaction`
- `computeCraftingRecipe`
- `validateCraftingAttempt`
- `resolveCraftingAttempt`
- `computeUpgradeTierCost`
- `serializeEquipmentState`
- `hydrateEquipmentState`

## Integracao feita

- `app.js` importa `EQUIPMENT_SCHEMA_VERSION` e grava `equipmentSchemaVersion` em novas fichas.
- `sw.js` adiciona `src/domain/solaris-equipment-rules.js` ao app shell offline/PWA.
- `src/session/solaris-session-domain.js` preserva `equipmentSchemaVersion`, `equipmentState`, `ammoState`, `magazines`, `craftingHistory`, `repairHistory` e `sourceGovernance` no snapshot sincronizado.
- `README.md` e `README_CONTEXTO_CHATGPT.md` foram atualizados para a versao `0.6.0-alpha.18`.
- Cache runtime atualizado para `20260624d`.

## Regras implementadas

### Punhos e Manopla de Kuldrus

- Punhos usam `FOR` e a pericia `Briga`.
- Punhos causam `1d4 + MOD FOR` de dano de concussao.
- Manopla de Kuldrus causa `1d4 + 1 + MOD FOR` de dano de concussao.

### Rachaduras

- Equipamentos usam escala 0 a 5.
- Armas com rachaduras recebem penalidade de ataque e risco de Jammed conforme o estado.
- Armaduras com rachaduras reduzem CA efetiva.
- Em 5 rachaduras o equipamento fica inutilizavel.
- Reparo normal reduz rachadura.
- Reparo emergencial cria reducao temporaria efetiva, sem apagar o dano real do equipamento.

### Jammed

- Arma Jammed bloqueia o perfil de ataque.
- Jammed pode ser aplicado por erro critico, falha mecanica ou regra de item.
- Fora de combate, `clearJammedOutsideCombat` limpa o estado e registra manutencao.

### Cubos e armazenamento

- Cubo simples usa capacidade simples.
- Cubo de carga aceita varias unidades do mesmo item exato definido pelo primeiro item colocado.
- Cubo especializado aceita itens da mesma familia do primeiro item colocado.
- Cubo de municao aceita municao e carregadores.
- Mochilas aceitam itens pequenos ate 10 Kg.
- Coldres aceitam armas pequenas.
- Bandoleiras aceitam itens medios, grandes e armas carregaveis.
- Ganchos aceitam itens de acesso rapido e suporte de armadura.
- Item sem local definido continua sendo aviso visual e nao bloqueia rolagens.

### Mods

- Mods validam tipo de alvo e slots disponiveis.
- Mods duplicados nao instalam no mesmo equipamento.
- Efeitos passivos somam ataque, dano, CA, alcance, movimento, PV, Cosmos e slots quando declarados.

### Compra, venda e crafting

- Compra valida Luzentis e debita quando ha saldo.
- Compra inicial pode adicionar equipamento sem debito.
- Venda usa metade do preco como padrao, mas aceita valor editavel.
- Crafting valida materiais, ferramentas, custo, CD e rolagem.
- Sucesso cria item; falha nao cria item.
- Upgrade de tier tem custo progressivo por distancia de tier.

## Testes adicionados

Arquivo novo:

- `tests/solaris-equipment-rules.test.mjs`

Coberturas principais:

- catalogo oficial do Livro 5 e governanca de fonte;
- categorias oficiais sem `sniper`;
- normalizacao de arma, armadura, item, ammo, carregador e mod;
- punhos e Manopla de Kuldrus;
- ataque, dano, Jammed e arma sem municao;
- CA de armadura com rachadura;
- reparo normal e emergencial;
- instalacao/remocao de mods;
- efeitos passivos;
- cubos e armazenamento fisico;
- item sem local definido sem bloqueio de rolagem;
- compra, venda e compra inicial;
- crafting e upgrade;
- serializacao/hidratacao de estado.

## Como testar

Comandos obrigatorios:

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-combat-rules.js
node --check src/domain/solaris-equipment-rules.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
node --check scripts/audit-official-sources.mjs
```

Teste manual recomendado:

1. Rodar `npm run server`.
2. Abrir `http://localhost:3000/?view=launcher&check=20260624d`.
3. Abrir Biblioteca/Ficha e conferir que fichas antigas carregam.
4. Criar uma ficha nova e verificar `equipmentSchemaVersion`.
5. Comprar item, arma, armadura, cubo, mochila, coldre e bandoleira.
6. Testar item sem local definido e confirmar que rolagens continuam liberadas.
7. Equipar arma, aplicar rachaduras e conferir ataque/dano.
8. Aplicar Jammed e limpar fora de combate.
9. Instalar/remover mod em equipamento com slots.
10. Abrir Mesa Virtual e confirmar que o app ainda entra em modo offline quando o servidor nao esta ativo.

## Limitacoes atuais

- O modulo de regras esta pronto e testado, mas a UI ainda usa varias rotinas antigas em pontos especificos.
- O catalogo oficial continua marcado como `current-source-needs-review`, pois a validacao tabela por tabela ainda precisa acontecer manualmente.
- Crafting ainda e base de dominio, nao tela final de oficina.
- Drones, torretas, veiculos e robos entram como categorias estruturadas, mas ainda precisam de telas dedicadas de controle.

## Proxima etapa recomendada

Integrar gradualmente `solaris-equipment-rules.js` nas telas de Biblioteca, Loja, Inventario, Ficha e Mesa Virtual:

- substituir calculos antigos de rachadura, CA e mods por chamadas ao modulo;
- usar `computeWeaponAttackProfile` e `computeWeaponDamageProfile` nos botoes de ataque/dano;
- criar tela de oficina/crafting;
- expor o `equipmentState` completo na ficha sincronizada do Tabletop;
- preparar migracao exportavel para Foundry.
