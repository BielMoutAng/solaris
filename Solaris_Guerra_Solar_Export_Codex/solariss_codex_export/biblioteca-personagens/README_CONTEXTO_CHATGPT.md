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
docs/FASE_20_TELA_INICIAL_LAUNCHER_TABLETOP.md
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
- O Solaris Tabletop Alpha agora abre em um launcher proprio pela rota `?view=launcher` ou `?view=home`.
- O Electron VTT usa `?view=launcher&tabletop=1&check=20260624h` como entrada.
- O cache atual do runtime da Fase 27A e `20260624h`.
- A versao local do Tabletop passou para `0.6.0-alpha.22`.
- A versao `0.6.0-alpha.22` adiciona o mapa local `assets/maps/nave-caida.png` como cena padrao **Nave Caida - Destrocos**, com grid 24x16 para salas novas sem cena explicita e para o modo offline/simulado.
- A Fase 21 adicionou um modulo puro para criacao/progressao oficial de personagem, guia em 7 etapas guiadas que agrupam os 10 passos do Livro 1, snapshot persistente de escolhas de criacao, historico estruturado de progressao e testes dedicados.
- A Fase 22 adicionou o modulo puro `src/domain/solaris-combat-rules.js`, testes de combate oficial, estado critico, Marcas de Morte, Sangramento, Ferimentos Graves, consequencias de critico/erro critico, dano com resistencia/vulnerabilidade/imunidade/reducao e integracao desses efeitos ao turno da Mesa Virtual.
- A Fase 23 adicionou o modulo puro `src/domain/solaris-equipment-rules.js`, testes de equipamentos do Livro 5, normalizacao de armas/armaduras/mods/municao/carregadores, rachaduras, Jammed, cubos, armazenamento, compra/venda e base de crafting.
- A Fase 24 adicionou o modulo puro `src/domain/solaris-bestiary-rules.js`, testes do bestiario oficial, normalizacao de fichas do Livro 3, ataques/habilidades de monstros integrados ao combate, resistencias/imunidades/vulnerabilidades, moral, loot com chances, recursos coletaveis, variantes, templates, chefes, minions, tokens e estimativa de ameaca para encontros.
- A Fase 25 adicionou o modulo puro `src/domain/solaris-gm-rules.js`, testes do Guia do Mestre, missoes, viagens, recursos, faccoes, reputacao, contadores de campanha, hacking, bases/colonias, recompensas narrativas, eventos GM, persistencia em campanhas/sessoes e aba Campanha no Painel do Mestre.
- A Fase 26 adicionou o modulo puro `src/domain/solaris-lore-rules.js`, testes de lore, compendio navegavel do Livro 4, entradas estruturadas de Solaris, Falaris, Tarantus, Ktaluhl Kalar, faccoes, NPCs, Uryon, Portais Tharan e ganchos, aba Lore no Painel do Mestre, view `Lore` na Biblioteca/Ficha, pins, descobertas, segredos, notas, relatorio, seeds de missoes/cenas/encontros/faccoes/NPCs/contadores e persistencia completa em sessoes/campanhas.

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

## Fase 20 - Tela Inicial / Launcher

A Fase 20 criou a tela inicial real do Solaris Tabletop Alpha.

Rotas preservadas:

```txt
?view=campaigns
?view=mesaVirtual
?view=ficha
```

Novas rotas:

```txt
?view=launcher
?view=home
```

O launcher inclui:

- fundo dark sci-fi com planeta/mundo Solaris/Tarantus em CSS;
- estrelas, pulso cosmico e grid holografico leves;
- logo grande SOLARIS e subtitulo GUERRA SOLAR;
- painel de campanha recente;
- painel de status do Tabletop;
- menu com Continuar Campanha, Criar Sala Offline, Criar Sala Multijogador Local, Entrar em Sala Local, Minhas Campanhas, Criador de Personagem, Biblioteca/Ficha, Bestiario, Escudo do Mestre e Configuracoes.

O botao `Criar Sala Offline` abre a mesa local/simulada sem servidor. O botao `Criar Sala Multijogador Local` usa o fluxo existente de sala com WebSocket quando `npm run server:vtt` esta ativo. O botao `Entrar em Sala Local` pede o endereco do mestre, por exemplo `http://192.168.0.10:3000`.

Nao foram adicionadas dependencias novas. A animacao respeita `prefers-reduced-motion` e tambem pode ser reduzida no modal de configuracoes do launcher.

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

Status: alfa implementada em 2026-06-20 (`20260620c`) e refinada na Fase 5 (`20260620d`).

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

Status: primeira versao funcional implementada em `20260620d`.

- battlemap selecionavel;
- grid configuravel;
- medidor de distancia;
- areas de efeito;
- objetivos com progresso;
- visibilidade de mestre/jogador;
- modal de detalhe de item;
- janela dedicada de loot;
- loot automatico de monstro derrotado;
- ficha de monstro refinada na mesa;
- build `Solaris Tabletop Alpha` abre direto na Mesa Virtual.

### Passo 6 - Alvos e dano tatico

Status: primeira versao funcional implementada em `20260620e`.

- modo Alvo no mapa tatico;
- clique em token para marcar alvo;
- botao Alvo nos cards de combatente;
- ficha de monstro com Atacar Alvo e Dano no Alvo;
- rolagem de ataque compara com CA do alvo quando disponivel;
- dano de ataque de monstro pode ser aplicado automaticamente no alvo marcado;
- areas de efeito clicaveis;
- dano de area aplicado aos tokens dentro da area selecionada;
- logs de dano registram a fonte do ataque ou efeito.

Documentacao:

```txt
docs/FASE_6_ALVOS_E_DANO.md
```

### Passo 7 - Previa de areas e build VTT

Status: primeira versao funcional implementada em `20260620f`.

- cones e linhas possuem direcao simples (`east`, `west`, `north`, `south`);
- area selecionada mostra quais tokens serao atingidos;
- tokens atingidos por area recebem destaque visual;
- legenda do mapa lista os atingidos antes de aplicar dano;
- build Windows de teste passa para `Solaris Tabletop Alpha 0.6.0-alpha.3`.

Documentacao:

```txt
docs/FASE_7_PREVIA_AREAS.md
```

### Passo 8 - Separacao ficha/VTT

Status: primeira versao estrutural implementada apos `20260620f`.

- `electron-main.cjs` agora e a entrada da ficha/biblioteca;
- `electron-main-vtt.cjs` e a entrada da Mesa Virtual/Tabletop;
- `electron-builder.ficha.cjs` gera `Solaris Biblioteca`;
- `electron-builder.vtt.cjs` gera `Solaris Tabletop Alpha`;
- `npm run dist:ficha` cria build separada em `dist-ficha/`;
- `npm run dist:vtt` cria build separada em `dist-vtt/`;
- a build do VTT inclui o servidor local embutido;
- a build da ficha nao inclui `server/**/*`.

Documentacao:

```txt
docs/FASE_8_SEPARACAO_PROJETOS.md
```

### Passo 9 - Persistencia de sessoes e campanhas

Status: primeira versao funcional implementada em `20260620g`.

- novo modulo `src/session/solaris-session-persistence.js`;
- schema inicial de sessao `1.0.0`;
- campanhas salvas no host via `localStorage`;
- sessao salva com jogadores, chat, dados, fichas, combate, cena, mapa, tokens, areas, monstros, loja, loot, aprovacoes e logs;
- modal **Campanhas** dentro da Mesa Virtual;
- Nova Campanha, Continuar, Duplicar, Exportar, Importar e Excluir;
- autosave local com limite;
- snapshot manual;
- restaurar/excluir autosave;
- aviso de sessao recente nao encerrada;
- eventos preparados no cliente/servidor: `campaign:*` e `session:*`;
- servidor pode receber/restaurar estado enviado pelo host;
- limitacao documentada: Electron ainda usa localStorage/JSON, sem ponte IPC nativa para arquivo automatico.

Documentacao:

```txt
docs/FASE_9_PERSISTENCIA_SESSOES.md
```

### Passo 10 - Painel do Mestre / Escudo do Mestre

Status: primeira versao alfa implementada em `20260620h`.

- Botao **Painel do Mestre** dentro da Mesa Virtual.
- Modal privado para mestre com Resumo, Cenas, Encontros, Notas, Contadores, Ambiente, Escudo e Logs.
- Notas secretas podem ser criadas, reveladas e excluidas.
- Contadores secretos podem ser criados, incrementados, reduzidos, revelados e excluidos.
- Efeitos ambientais podem ser criados e removidos.
- Cenas salvas podem ser criadas, salvas a partir da cena atual, trocadas e excluidas.
- Encontros preparados podem ser criados, iniciados, concluidos e excluidos.
- O servidor filtra dados privados para jogadores.
- Campanhas, snapshots e autosaves preservam os dados do mestre.
- CSS do Tabletop recebeu rolagem interna e contencao para impedir paineis sobrepostos.

Documentacao:

```txt
docs/FASE_10_PAINEL_MESTRE.md
```

### Passo 11 - Consolidacao do Mestre, campanhas e escudo

Status: primeira versao funcional implementada em `20260620i`.

- Tela dedicada **Minhas Campanhas** em `?view=campaigns`, fora do modal da mesa.
- Cards de campanha com dados de sessao, cenas, personagens, autosaves e snapshots.
- Criar, continuar, editar, duplicar, exportar, importar e excluir campanha com confirmacao forte.
- Formulario dedicado para notas do mestre, contadores, efeitos ambientais, cenas e encontros preparados.
- Gerador de encontros com filtros do bestiario e opcao de salvar preparado ou adicionar direto a cena.
- Escudo do Mestre com busca rapida, regras fixadas, copiar regra e enviar regra ao chat.
- Relatorio de sessao refinado em Markdown, com opcoes para chat, notas secretas, logs tecnicos, transacoes, combate e loot.
- Persistencia de `pinnedShieldRules`, `favoriteShieldRules` e `reportSettings` dentro de `gmDashboardSettings`.
- Rotas claras preservadas: `?view=ficha`, `?view=mesaVirtual` e `?view=campaigns`.
- `npm run start:vtt` abre o Tabletop direto na tela de campanhas.

Documentacao:

```txt
docs/FASE_11_CONSOLIDACAO_MESTRE.md
```

### Passo 12 - Editores visuais e polimento de usabilidade

Status: primeira versao alfa implementada em `20260620j`.

- Editor Visual de Cena para criar, duplicar, exportar, salvar e ativar cenas.
- Preview de mapa/grid/tokens/zonas/objetivos dentro do editor.
- Adicao rapida de objetivo, zona de perigo, cobertura e token marcador.
- Editor Visual de Encontro com cena vinculada, lista de monstros, preview e inicio do encontro.
- Balanceamento alfa via `estimateEncounterBalance`.
- Posicoes iniciais de monstros ao iniciar encontro preparado, incluindo `hidden`, `locked` e cor.
- Relatorio com preview, copiar, baixar `.md`, baixar `.html` e salvar na campanha.
- Persistencia de `sessionReports` em sessao, autosave, snapshot e export/import.
- CSS reforcado com rolagem interna para paineis, listas, modais e quadros com muito conteudo.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.5`.

Documentacao:

```txt
docs/FASE_12_EDITORES_POLIMENTO_USABILIDADE.md
```

### Passo 14 - Editor avancado de cenas

Status: primeira versao alfa implementada em `20260621c`.

- Editor Visual de Cena agora permite selecionar elementos no preview.
- Tokens, zonas, areas e objetivos podem ser arrastados dentro do mapa do editor.
- Painel contextual edita objetivo, zona, area ou token selecionado.
- Areas de efeito podem ser criadas diretamente no editor.
- Elemento selecionado recebe destaque visual.
- Edicoes granulares persistem em `sceneList`, cena ativa, snapshots e export/import.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.6`.

Documentacao:

```txt
docs/FASE_14_EDITOR_CENAS_AVANCADO.md
```

### Passo 15 - Loja visual avancada

Status: primeira versao alfa implementada em `20260621d`.

- Loja Solaris ganhou shell visual dedicado com sidebar de categorias, topbar, filtros e carrinho lateral.
- Modos de loja: Biblioteca, Sessao e Mestre.
- Filtros por categoria, tier, raridade, preco, estoque, compatibilidade e ordenacao.
- Cards padronizados com raridade, badges, preco, fonte, resumo, detalhes, comparar e adicionar.
- Carrinho possui destino por item: inventario, ativo, equipar, mochila, cubo, coldre, bandoleira, gancho ou sem local definido.
- Mestre ve carrinhos e pedidos pendentes na loja.
- Aprovacao de compra em carrinho pode ser feita por item individual usando `shopLineId`.
- Compra aprovada respeita destino individual de cada linha.
- Mestre pode converter carrinho em loot.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.7`.

Documentacao:

```txt
docs/FASE_15_LOJA_VISUAL_AVANCADA.md
```

### Passo 16 - Padronizacao visual global

Status: primeira versao alfa implementada em `20260621e`.

- Tokens globais `--solaris-*` para cores, brilho, sombras, espacamento, bordas e tipografia.
- Classes globais como `solaris-shell`, `solaris-topbar`, `solaris-sidebar`, `solaris-panel`, `solaris-card`, `solaris-modal`, `solaris-modal-large`, `solaris-scroll-panel` e `solaris-bottom-bar`.
- Mesa Virtual, Minhas Campanhas, Painel do Mestre, Escudo, editores, ficha de monstro, loot, aprovacoes e loja passam a seguir uma linguagem visual mais consistente.
- Scroll interno e responsividade foram reforcados para reduzir sobreposicoes em janelas menores do Electron.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.8`.

Documentacao:

```txt
docs/FASE_16_PADRONIZACAO_VISUAL_GLOBAL.md
```

### Passo 17 - Estrutura visual por telas

Status: primeira versao alfa implementada em `20260621f`.

- A Mesa Virtual passa a organizar o centro do app em telas principais: `Mesa`, `Loja`, `Ficha` e `Mestre`.
- A tela `Mesa` preserva mapa tatico, painéis laterais, chat e uma faixa inferior compacta do personagem.
- A tela `Loja` abre o Mercado Solaris em tela ampla, escondendo laterais que competiam por espaco.
- A tela `Ficha` abre um resumo sincronizado de personagem em layout proprio, sem disputar area com o mapa.
- A tela `Mestre` mostra comandos, resumo de cena, objetivos, notas, monstros, mapas e contadores em cards organizados.
- Paineis densos passam a usar altura controlada e scroll interno para evitar que quadros fiquem uns por cima dos outros.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.9`.

Documentacao:

```txt
docs/FASE_17_ESTRUTURA_VISUAL_TABLETOP.md
```

### Passo 17B - Desktop-first do Tabletop

Status: primeira versao alfa implementada em `20260622f`.

- Layout do VTT foi refinado pensando primeiro em PC/Windows, com comportamento semelhante a mesas virtuais como Foundry e Roll20.
- O mapa/palco central fica dominante na tela `Mesa`.
- Topbar, toolbar de mapa, laterais e barra inferior foram compactadas para liberar mais area util.
- Jogadores, chat, combate, aprovacoes, loot, objetivos e historico funcionam como docks com rolagem interna.
- A Loja e a Ficha continuam abrindo em modo amplo, sem laterais competindo por espaco.
- O fallback responsivo para iPhone/PWA foi mantido com colunas empilhadas e abas em duas colunas.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.13`.

Documentacao:

```txt
docs/FASE_17B_DESKTOP_FIRST_TABLETOP.md
```

### Passo 18 - Auditoria Funcional Recorrente das Regras Oficiais

Status: auditoria documental criada em `20260622f`, sem alteracao de runtime.

- A Fase 18 compara o estado atual do app com os Livros 1 a 5 oficiais.
- Foram criados tres documentos: auditoria geral, matriz funcional e registro de regras mutaveis.
- A auditoria classifica cada area como implementada, parcial, provisoria, ausente, divergente ou instavel.
- Nenhum cache, service worker, versao Electron ou codigo de regra foi alterado nesta fase.
- O Solaris Biblioteca, o PWA/iPhone, o modo offline e o Solaris Tabletop Alpha devem permanecer exatamente como estavam.
- Principais P0/P1 detectados: reconciliar fontes oficiais atuais, revisar racas/pericia extra, revisar Livro 5 contra catalogos, completar criacao/progressao, completar combate oficial e padronizar condicoes.
- A auditoria deve ser refeita sempre que algum livro oficial for renomeado, corrigido ou recompilado.

Documentacao:

```txt
docs/FASE_18_AUDITORIA_FUNCIONAL_RECORRENTE.md
docs/MATRIZ_FUNCIONAL_REGRAS_GUERRA_SOLAR.md
docs/REGISTRO_DE_REGRAS_MUTAVEIS.md
```

### Passo 19 - Reconciliacao Oficial de Dados

Status: implementada em `20260622g`.

- Runtime alterado de forma leve nos arquivos `official-*`.
- Versao do Solaris Tabletop Alpha: `0.6.0-alpha.14`.
- Os cinco livros oficiais atuais foram registrados como fonte canonica:
  - `Livro 1 base do jogador.docx`;
  - `Livro_2_Guia_do_Mestre_rifles_corrigido.docx`;
  - `Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx`;
  - `Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx`;
  - `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`.
- `official-books-data.js` passou para schema `2` e ganhou `sourceGovernance`.
- `official-book5-catalog.js` passou para schema `3`, fonte atual do Livro 5 e metadados por entrada.
- `official-rulebook-compendium.js` passou para schema `2`, fontes atuais e marcacao de revisao manual.
- Foi criado `scripts/audit-official-sources.mjs` para diagnosticar livros e arquivos oficiais.
- Foi criado `tests/official-data-reconciliation.test.mjs`.
- Fontes antigas ficam apenas em campos historicos como `sourceFilePrevious`.
- Dados duvidosos devem usar `needsReview` e `reviewReason`.

Documentacao:

```txt
docs/FASE_19_RECONCILIACAO_OFICIAL_DADOS.md
docs/RELATORIO_DIVERGENCIAS_DADOS_OFICIAIS.md
docs/MAPA_FONTES_OFICIAIS.md
```

Politica nova do usuario:

```txt
A partir da Fase 21, ao terminar uma parte do projeto:
1. publicar primeiro a versao Web/GitHub Pages para o usuario aprovar como beta;
2. validar o link direto publicado;
3. somente depois da aprovacao do usuario gerar/publicar o executavel do VTT.

Ou seja: Web primeiro para aprovacao, EXE do VTT depois.
```

Comparar cada tela com as imagens de referencia:

- criador;
- ficha;
- pagina do mestre;
- bestiario;
- mapa;
- loja;
- escudo;
- tabelas rapidas.

## Fase 13 - ficha virtual e biblioteca: municao e carregadores

Status: implementada no cache `20260621b`.

Foi adicionada a arquitetura de arma, municao, carregador e fonte de alimentacao na ficha virtual e na biblioteca Solaris.

Agora existem no dominio:

- `AMMO_KINDS`;
- `FEED_SYSTEMS`;
- `FIRE_MODE_IDS`;
- `FIRE_MODES`;
- `createWeaponAmmoState`;
- `createMagazineInstance`;
- `attachMagazineToWeapon`;
- `detachMagazineFromWeapon`;
- `loadAmmoIntoMagazine`;
- `reloadInternalWeapon`;
- `fireWeapon`;
- `pumpWeapon`;
- `ammoCubeUnitsFor`.

Na aba de equipamentos da ficha:

- a arma equipada mostra fonte de municao, quantidade atual/maxima e estado;
- carregadores removiveis guardam a propria municao;
- revolver, escopeta, lancador, celula e cinta usam municao interna;
- rajada e rajada pesada consomem municao e deixam bonus de dano pendente;
- escopeta pode exigir bombear antes de disparar de novo;
- existe secao `Municao e carregadores` para pilhas e carregadores.

Na biblioteca Solaris:

- cards de armas mostram resumo de municao/carregador;
- metadados de loja indicam sistema de alimentacao e capacidade curta;
- duplo clique no nome da arma abre detalhes com `Perfil de municao e carregador`;
- guia de uso detalha carregador, recarga, modos de disparo e unidades de cubo de municao.

Documentacao:

```txt
docs/FASE_13_FICHA_MUNICAO_CARREGADORES.md
```

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
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
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
