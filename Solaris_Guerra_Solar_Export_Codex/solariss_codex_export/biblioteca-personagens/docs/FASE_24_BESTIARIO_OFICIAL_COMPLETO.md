# Fase 24 - Bestiario Oficial Completo

Status: implementado no cache `20260624e`.

Versao local: `0.6.0-alpha.19`.

Branch: `codex/fase-24-bestiario-oficial-completo`.

## Objetivo

Transformar o Bestiario do Livro 3 em uma base funcional de dominio, reutilizavel pela Biblioteca, pela ficha jogavel de monstro, pelo Tabletop, pelo combate, pelo loot, pelos encontros e pela persistencia de campanha.

Esta fase nao redesenha a UI. Ela cria a estrutura oficial e deixa a interface atual capaz de consumir os novos campos.

## Contexto

- Fase 19 registrou os cinco livros oficiais atuais e marcou dados como `current-source-needs-review`.
- Fase 20 separou o launcher do Tabletop.
- Fase 21 criou criacao/progressao de personagem.
- Fase 22 criou o motor oficial de combate.
- Fase 23 criou o motor oficial de equipamentos do Livro 5.

A Fase 24 adiciona o motor puro do Livro 3 em `src/domain/solaris-bestiary-rules.js`.

## Modulo Criado

Arquivo: `src/domain/solaris-bestiary-rules.js`.

Exports principais:

- `BESTIARY_SCHEMA_VERSION`
- constantes de tier, tipo, papel, tamanho, comportamento, moral, sentidos, recursos, templates, variantes e ameaca
- `normalizeMonsterEntry`
- `normalizeMonsterAttack`
- `normalizeMonsterAbility`
- `normalizeMonsterResistanceProfile`
- `normalizeMonsterLootProfile`
- `normalizeMonsterMoraleProfile`
- `validateMonsterSheet`
- `computeMonsterCombatProfile`
- `computeMonsterAttackProfile`
- `computeMonsterDamageProfile`
- `computeMonsterInitiativeProfile`
- `computeMonsterDefenses`
- `computeMonsterSenses`
- `resolveMonsterAttack`
- `resolveMonsterAbilityUse`
- `resolveMonsterMoraleCheck`
- `resolveMonsterLoot`
- `collectMonsterResource`
- `applyMonsterVariant`
- `applyMonsterTemplate`
- `createBossVersion`
- `createMinionVersion`
- `createEliteVersion`
- `createSwarmVersion`
- `createSessionMonsterFromBestiary`
- `createMonsterTokenDefaults`
- `estimateMonsterThreat`
- `estimateEncounterThreat`
- `serializeMonsterState`
- `hydrateMonsterState`

## Estrutura Oficial de Monstro

Cada monstro agora pode ser normalizado com:

- id, nome, tier, tipo, papel, tamanho, habitat e comportamento
- PV, CA, movimento e atributos
- ataques, dano, tipo de dano, alcance e condicoes aplicadas
- habilidades, salvamento, CD, area, recarga e efeito
- resistencias, vulnerabilidades, imunidades, reducoes e imunidades de condicao
- sentidos
- moral/comportamento
- loot, recursos coletaveis e recompensa
- ganchos narrativos, pistas, escolhas morais e ameaca recorrente
- `sourceGovernance`, `sourceFileCurrent`, `sourceStatus`, `dataStability`, `needsReview` e `reviewReason`

Campos antigos continuam preservados quando a UI ainda depende deles.

## Normalizacao

O Bestiario vindo de `official-books-data.js` agora passa por `normalizeMonsterEntry` no carregamento do app. Criaturas criadas manualmente tambem sao normalizadas ao salvar.

Quando um campo numerico importante estiver ausente, o monstro nao trava o app. Ele recebe `needsReview` e `reviewReason`.

## Ataques

Ataques passam a ter:

- id e nome
- bonus de ataque
- alcance em metros
- alvo e area
- formula de dano
- bonus fixo
- tipo de dano
- condicao inferida quando possivel
- salvamento quando o texto indicar JPF, JPR ou JPC

`resolveMonsterAttack` usa `resolveAttackRoll`, `resolveDamageRoll` e `applyDamageToCombatant` do motor da Fase 22.

## Habilidades

Habilidades passam a ter estrutura:

- id, nome e tipo
- acao necessaria
- alcance, alvo, duracao, recarga e custo
- gatilho, efeito, dano e tipo de dano
- condicao aplicada
- salvamento e CD

Se a habilidade for ambigua, fica registrada para o mestre usar no log/mesa sem automatizar efeito perigoso.

## Condicoes

O bestiario reconhece condicoes comuns como:

- Sangrando
- Imobilizado
- Caido
- Atordoado
- Cego
- Envenenado
- Queimando
- Vulneravel
- Alvo facil

Quando um ataque ou habilidade tem condicao clara, ela pode ser aplicada ao alvo usando `applyConditionToCombatant`.

## Defesas e Sentidos

Foram normalizados:

- resistencias
- vulnerabilidades/fraquezas
- imunidades
- reducoes de dano
- imunidades de condicao
- sentidos como visao noturna, olfato, audicao, cosmos, tremor, termico e tecnologico

O dano recebido por alvos continua usando a mitigacao oficial do motor de combate.

## Moral e Comportamento

`resolveMonsterMoraleCheck` cria uma decisao simples para o mestre:

- continua lutando
- recua
- foge
- protege aliado/ninho
- entra em furia
- se rende, se for inteligente

Nao foi criada IA automatica complexa. A funcao e ferramenta de mesa.

## Loot e Recursos

`resolveMonsterLoot` usa a tabela de recursos do monstro com porcentagens. Ao derrotar monstro no VTT, o pacote de loot usa os drops rolados, nao a tabela inteira.

`collectMonsterResource` permite transformar recurso coletavel em item/material quando o teste passa.

## Variantes, Templates, Chefes e Minions

Foram criadas funcoes para:

- variante jovem, alfa, anciao, ferido, corrompido, cosmico, tecnologico, mutante, territorial, enxame, elite e boss
- template Minion
- template Elite
- template Boss/Chefe
- template Enxame

Os multiplicadores sao configuraveis e marcados como `needsReview`, porque balanceamento final do Livro 3/Livro 2 ainda pode mudar.

## Ficha Jogavel de Monstro

A ficha jogavel offline passa a receber ataques e habilidades ja normalizados. O painel de monstros da sessao continua com os botoes existentes:

- ataque
- dano
- receber dano
- curar
- aplicar condicao
- derrotar
- gerar loot
- salvar notas

## VTT e Tokens

`SharedMonster` agora preserva:

- `bestiarySchemaVersion`
- `monsterState`
- `monsterSource`
- `monsterCombatProfile`
- `monsterLootProfile`
- `monsterMoraleProfile`
- `monsterVariantState`
- `monsterTemplateState`
- `collectedResources`
- `usedAbilities`
- `abilityCooldowns`
- `sourceGovernance`

Tokens criados a partir de monstros usam imagem, movimento e tamanho normalizado quando disponivel.

## Encontros

O gerador/editor de encontros do VTT agora adiciona `bestiaryThreat`, calculado por `estimateEncounterThreat`, mantendo `threatXp` antigo para compatibilidade.

## Persistencia

Os novos campos ficam dentro do snapshot do monstro e do `SharedMonster`. Campanhas antigas com monstros simples recebem defaults durante hidratacao, sem quebrar carregamento.

## Testes

Criado `tests/solaris-bestiary-rules.test.mjs` com cobertura para:

- normalizacao de monstro, ataque, dano, habilidade, defesas, sentidos, loot, recursos e moral
- ataque, critico, erro critico, dano, resistencia, vulnerabilidade, imunidade e condicao
- habilidades com salvamento
- monstro comum derrotado e chefe com Marcas de Morte
- loot e coleta
- variantes, templates, boss, elite, minion e enxame
- token padrao
- serializacao/hidratacao
- ameaca de encontro
- compatibilidade com sessao e campanhas antigas

## Publicacao Web

Cache atualizado para `20260624e`. O service worker inclui o novo modulo `src/domain/solaris-bestiary-rules.js`.

URL de teste esperada apos publicacao:

`https://bielmoutang.github.io/solaris/?view=launcher&check=20260624e`

## Limitacoes

- Os dados do Livro 3 seguem marcados como `current-source-needs-review`.
- O balanceamento de templates e variantes e configuravel/provisorio.
- UI/UX refinada do bestiario fica para depois da Fase 26.
- Habilidades complexas registram efeito, mas nao aplicam automacao perigosa sem confirmacao do mestre.

## Proxima Fase Recomendada

Fase 25 - Guia do Mestre: missoes, viagem, recursos, reputacao e faccoes.
