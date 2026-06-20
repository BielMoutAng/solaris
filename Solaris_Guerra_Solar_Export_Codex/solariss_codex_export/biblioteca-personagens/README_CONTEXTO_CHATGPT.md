# Contexto completo do projeto Solaris Guerra Solar

Use este README como contexto para outro ChatGPT/Codex entender o projeto sem precisar redescobrir tudo.

## O que e o projeto

O projeto e a **Biblioteca de Personagens Solaris**, um app local/web para o RPG **Guerra Solar / Solaris**.

Ele funciona como:

- criador de fichas;
- ficha de personagem;
- biblioteca de racas, profissoes, magias, chips, mods, armas, armaduras, itens, cubos e regras;
- bestiario;
- ficha jogavel de monstros;
- rolagem de dados;
- inventario com cubos, mochilas, coldres, bandoleiras e ganchos;
- HUD vital Humanis;
- app instalavel no iPhone via PWA;
- app empacotavel para Windows via Electron.

O objetivo atual da nova fase e transformar esse sistema em uma **mesa virtual propria do Guerra Solar**, sem quebrar o modo offline atual.

## Repositorio e pasta principal

Repositorio local:

```txt
C:\Users\Gabriel\Desktop\solaris-repo
```

Pasta do app:

```txt
C:\Users\Gabriel\Desktop\solaris-repo\Solaris_Guerra_Solar_Export_Codex\solariss_codex_export\biblioteca-personagens
```

Branch local atual da Fase 2:

```txt
codex/fase-2-mesa-virtual
```

Importante:

```txt
Nao subir para o GitHub ate o usuario pedir explicitamente.
```

## Stack atual

- HTML/CSS/JavaScript puro.
- Modulos ESM.
- Electron para executavel Windows.
- PWA para web/iPhone.
- Three.js para HUD/visual 3D quando necessario.
- Testes com `node:test`.
- Salvamento local via `localStorage`.

Scripts principais:

```bash
npm test
npm start
npm run server
npm run pack
npm run dist
```

O script de teste deve rodar:

```bash
node --test tests
```

## Arquivos centrais

```txt
index.html
styles.css
app.js
sw.js
manifest.webmanifest
HumanisVitalHUD.js
official-books-data.js
official-book5-catalog.js
official-rulebook-compendium.js
src/domain/solaris-domain-architecture.js
src/session/solaris-session-domain.js
src/session/solaris-session-client.js
src/session/solaris-session-ui.js
server/solaris-server.js
tests/solaris-domain-architecture.test.mjs
tests/solaris-session-domain.test.mjs
docs/FASE_2_MESA_VIRTUAL.md
```

## Estado atual do app antes da Fase 2

O app ja possui:

- ficha de personagem;
- atributos base com padrao 7;
- pericias por atributo;
- jogadas de protecao;
- rolagens com estresse/saturacao;
- iniciativa;
- inventario;
- compra/venda;
- itens criados manualmente;
- exportacao/importacao de ficha;
- biblioteca de itens do Livro 5;
- armaduras com CA nova;
- cubos com peso de 1 kg;
- cubos simples, de carga e especializados;
- regra de cubo de carga: aceita apenas o mesmo item exato do primeiro item inserido;
- regra de cubo especializado: aceita itens da mesma familia/tipo do primeiro item;
- mochilas/coldres/bandoleiras/ganchos;
- Luzentis como moeda;
- monstros do Livro 3;
- imagens de monstros;
- ficha jogavel de monstro;
- botao de ataque e dano de monstro;
- loot automatico quando monstro e derrotado;
- historico minimalista de loot;
- detalhes por duplo clique;
- HUD vital Humanis;
- modo web/iPhone com cache versionado.

Mudanca recente:

- O antigo bloqueio que impedia rolagens quando havia item sem local definido foi cancelado.
- Agora item sem local definido apenas mostra aviso visual, sem bloquear dados, iniciativa, ataques, dano de monstro ou testes.

## Nova Fase 2 - Mesa Virtual

O usuario quer que o app evolua para uma mesa virtual propria com visual semelhante as referencias enviadas:

- criador de personagem em 7 passos;
- ficha refinada;
- pagina do mestre;
- ficha jogavel de monstro refinada;
- bestiario refinado;
- mapa tatico;
- loja;
- escudo do mestre;
- tabelas rapidas.

A direcao visual e:

- dark sci-fi;
- neon azul/ciano;
- roxo para cosmos;
- vermelho para perigo/combate;
- paineis densos e elegantes;
- barras laterais;
- HUDs;
- grids e containers com bordas finas;
- visual de terminal/mesa holografica;
- tudo legivel e funcional.

## Requisito critico

Nao substituir nem quebrar o modo offline.

A mesa virtual deve ser opcional:

```txt
Sem servidor: app funciona como ficha local.
Com servidor: ativa modo multiplayer/mesa virtual.
```

## Arquitetura da Fase 2

Foram criados os modulos:

```txt
src/session/solaris-session-domain.js
src/session/solaris-session-client.js
src/session/solaris-session-ui.js
server/solaris-server.js
```

Ele contem os modelos puros da mesa virtual:

- `GameRoom`
- `PlayerConnection`
- `SessionCharacter`
- `SharedMonster`
- `Scene`
- `MapToken`
- `CombatTracker`
- `InitiativeEntry`
- `ChatMessage`
- `DiceRollEvent`
- `GameEvent`
- `PermissionManager`

Eventos suportados:

- `player:join`
- `player:leave`
- `chat:message`
- `dice:roll`
- `character:update`
- `character:damage`
- `character:heal`
- `character:condition:add`
- `character:condition:remove`
- `monster:create`
- `monster:update`
- `monster:delete`
- `monster:damage`
- `monster:heal`
- `monster:condition:add`
- `monster:condition:remove`
- `combat:start`
- `combat:end`
- `combat:log`
- `initiative:roll`
- `initiative:update`
- `turn:next`
- `scene:update`
- `token:move`

Permissoes iniciais:

- Mestre pode tudo.
- Jogador pode enviar chat e rolar dados.
- Jogador edita apenas a propria ficha.
- Jogador move apenas o proprio token.
- Mestre controla monstros, combate, iniciativa, cenas e tokens.

Testes criados:

```txt
tests/solaris-session-domain.test.mjs
```

Eles validam:

- entrada de mestre/jogador na sala;
- chat;
- rolagem compartilhada;
- permissao de ficha;
- dano/cura;
- combate/iniciativa;
- criacao de monstro;
- movimento de token.

## Estado atual da Fase 2

A Fase 1A e 1B da Mesa Virtual ja foram implementadas.

Ja existe uma tela isolada chamada:

```txt
Mesa virtual
```

Ela tem:

- topo com sala, sistema, status e botoes;
- lista lateral de jogadores/personagens;
- chat da mesa;
- painel central de cena;
- placeholder de mapa tatico;
- acoes rapidas;
- painel inferior do personagem selecionado;
- PV, Cosmos e Estresse editaveis;
- CA, movimento, arma e armadura;
- objetivos;
- painel de combate compartilhado;
- iniciativa sincronizavel;
- adicionar monstros do bestiario a cena;
- aplicar dano, cura e condicoes em combatentes;
- log minimalista de combate;
- historico de rolagens;
- inventario rapido inferior.
- mapa tatico inicial com grid, tokens, zonas e objetivos.

Sem servidor, ela fica em modo:

```txt
Offline / simulado
```

Com servidor, ela conecta via WebSocket.

Servidor local:

```bash
npm run server
```

Endereco do mestre:

```txt
http://localhost:3000
```

Endereco dos jogadores na LAN/Radmin:

```txt
http://IP-DO-MESTRE:3000
```

Eventos WebSocket ja implementados:

- `room:create`
- `room:join`
- `room:state`
- `player:join`
- `player:leave`
- `chat:message`
- `dice:roll`
- `character:resources:update`
- `character:damage`
- `character:heal`
- `character:condition:add`
- `character:condition:remove`
- `monster:create`
- `monster:update`
- `monster:delete`
- `monster:damage`
- `monster:heal`
- `monster:condition:add`
- `monster:condition:remove`
- `combat:start`
- `combat:end`
- `combat:log`
- `initiative:roll`
- `initiative:update`
- `turn:next`
- `error`

O servidor ja transmite:

- lista de jogadores;
- chat;
- rolagens;
- PV;
- Cosmos;
- Estresse.
- monstros da sessao;
- estado de combate;
- ordem de iniciativa;
- dano/cura/condicoes em personagens e monstros;
- log de combate.

## Plano recomendado para continuar

### Passo 1 - Combate compartilhado

Status: primeira versao implementada em 2026-06-16.

- iniciar combate;
- encerrar combate;
- rolar iniciativa na mesa;
- ordem de iniciativa sincronizada;
- turno atual;
- proximo turno;
- aplicar dano;
- curar;
- aplicar/remover condicao;
- adicionar monstro;
- abrir ficha de monstro.

Observacao: a ficha completa de monstro dentro da mesa ainda pode ser refinada, mas o estado compartilhado de combate ja existe no dominio, cliente, servidor e UI.

### Passo 2 - Fichas sincronizadas completas

Status: primeira versao consolidada e revalidada em 2026-06-20 (`20260620c`).

Sincronizar:

- condicoes;
- equipamentos;
- inventario;
- magias;
- chips;
- habilidades raciais;
- passivos de mods;
- recursos derivados.

### Passo 3 - Mapa tatico

Status: primeira versao implementada em 2026-06-20 (`20260620a`) e mantida no cache `20260620c`.

- mapa central;
- tokens;
- grid;
- movimento;
- areas de perigo;
- objetivos.

Documentacao:

```txt
docs/FASE_3_MAPA_TATICO.md
```

### Passo 4 - Loja e distribuicao

Status: alfa implementada em 2026-06-20 (`20260620c`).

- loja visual;
- carrinho;
- compra;
- distribuicao de itens;
- integracao com Luzentis.

Documentacao:

```txt
docs/FASE_4_LOJA_E_DISTRIBUICAO.md
```

### Passo 5 - Polimento visual

Comparar cada tela com as imagens de referencia:

- criador;
- ficha;
- pagina do mestre;
- bestiario;
- mapa;
- loja;
- escudo;
- tabelas rapidas.

## Como validar sem quebrar o app atual

Sempre rodar:

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check server/solaris-server.js
```

Depois abrir:

```txt
http://127.0.0.1:8787/?check=VERSAO
```

Validar:

- tela inicial abre;
- ficha abre;
- dados rolam;
- bibliotecas abrem;
- bestiario abre;
- modo offline segue funcionando.

## Prompt curto para usar em outro ChatGPT

```txt
Estou criando o Solaris Guerra Solar, um app HTML/CSS/JS puro com Electron/PWA para fichas de personagem, inventario, itens, armas, armaduras, cubos, magias, chips, regras, bestiario, monstros jogaveis, rolagens e loot automatico.

O app atual funciona offline com localStorage e deve continuar funcionando.

Agora estou na Fase 2: transformar isso em uma mesa virtual propria, sem quebrar o modo offline.

Ja existe um modulo novo:
src/session/solaris-session-domain.js
src/session/solaris-session-client.js
src/session/solaris-session-ui.js
server/solaris-server.js

Ele contem GameRoom, PlayerConnection, SessionCharacter, SharedMonster, Scene, MapToken, CombatTracker, InitiativeEntry, ChatMessage, DiceRollEvent, GameEvent e PermissionManager.

Eventos: player:join, player:leave, chat:message, dice:roll, character:update, character:damage, character:heal, character:condition:add, character:condition:remove, monster:create, monster:update, monster:delete, monster:damage, monster:heal, monster:condition:add, monster:condition:remove, combat:start, combat:end, combat:log, initiative:roll, initiative:update, turn:next, scene:update, token:move.

Ja existe a tela Mesa virtual com modo simulado/offline e servidor local opcional via npm run server em http://localhost:3000. Ela ja tem sala, chat, rolagens, recursos, painel de combate, iniciativa, adicionar monstro do bestiario, dano/cura/condicoes e log de combate.

Objetivo: implementar passo a passo uma mesa virtual com sala, jogadores, chat, rolagens compartilhadas, fichas sincronizadas, combate, monstros, mapa/tokens, loja, painel do mestre e visual dark sci-fi neon fiel as referencias.

Regra: nao subir para GitHub ate eu pedir e nao quebrar a versao atual offline.
```
