# Solaris Guerra Solar - Fase 2: Mesa Virtual

Este documento registra a direcao da Fase 2 do projeto Solaris. A regra principal desta fase e:

**nao quebrar o modo offline atual.**

O aplicativo atual continua sendo uma biblioteca/ficha local que funciona sozinha, com `localStorage`, importacao/exportacao e uso offline. A Fase 2 deve nascer como uma camada opcional de mesa virtual, conectada apenas quando estiver madura.

## Objetivo

Transformar a Biblioteca de Personagens Solaris em uma mesa virtual propria do Guerra Solar, com:

- sala de jogo;
- mestre e jogadores;
- chat da mesa;
- rolagens compartilhadas;
- personagens sincronizados;
- monstros jogaveis;
- combate compartilhado;
- bestiario de mesa;
- loja e distribuicao de itens;
- painel do mestre;
- mapa/cena com tokens;
- preparacao para Radmin/LAN primeiro e online real depois.

## Regra de compatibilidade

A Fase 2 nao deve remover nem reescrever de imediato:

- o fluxo offline de personagens;
- a biblioteca de itens, armas, armaduras, chips, magias e regras;
- o bestiario atual;
- os cubos e armazenamento;
- os salvamentos no navegador;
- o Electron/desktop;
- a versao web/iPhone ja existente.

Enquanto a mesa virtual nao estiver completa, ela deve ser desenvolvida como modulo separado.

## Referencias visuais enviadas

As imagens de referencia devem ser tratadas como o norte visual da Fase 2:

1. **Criador de personagem em mesa virtual**
   - wizard em 7 passos;
   - lista de jogadores na lateral;
   - chat da mesa;
   - pre-visualizacao do personagem;
   - inventario rapido na barra inferior.

2. **Ficha de personagem refinada**
   - painel de resumo;
   - atributos, estatisticas derivadas, equipamentos, inventario, chips, habilidades cosmicas, condicoes e pericias;
   - densidade alta, mas legivel;
   - visual sci-fi escuro com neon azul, ciano e roxo.

3. **Pagina do mestre**
   - controle total da sessao;
   - iniciar combate, revelar cena, aplicar condicao, adicionar monstro, distribuir item e salvar sessao;
   - iniciativa, notas secretas, monstros/NPCs e ferramentas.

4. **Ficha jogavel de monstro**
   - PV atual/maximo, CA, movimento, iniciativa, percepcao e sentidos;
   - ataques com botao de ataque e dano;
   - resistencias, imunidades, condicoes, espolios e recompensas;
   - painel de combate ao lado.

5. **Bestiario refinado**
   - filtros por tier, tipo, habitat, papel de ameaca e faccao;
   - lista de criaturas;
   - painel de detalhes com informacoes, habilidades, loot, conhecimento e ficha completa.

6. **Mesa tatica**
   - mapa central com grid;
   - tokens de jogadores e monstros;
   - ordem de iniciativa;
   - objetivos;
   - chat;
   - acoes rapidas.

7. **Loja**
   - catalogo por categorias;
   - filtros e ordenacao;
   - carrinho de compras;
   - saldo em Luzentis;
   - adicionar item a ficha.

8. **Escudo do mestre**
   - notas ocultas;
   - NPCs importantes;
   - contadores secretos;
   - efeitos ambientais;
   - tabelas rapidas;
   - roteiro da sessao.

9. **Tabelas rapidas**
   - referencia rapida para testes, dificuldade, vantagem/desvantagem, estresse, movimento, combate, cobertura, condicoes, cura, equipamentos e cubos.

## Arquitetura desejada

### Camada atual

- `index.html`
- `styles.css`
- `app.js`
- `src/domain/solaris-domain-architecture.js`
- `official-books-data.js`
- `official-book5-catalog.js`
- `official-rulebook-compendium.js`
- `HumanisVitalHUD.js`

Essa camada segue funcionando como app local.

### Nova camada da Fase 2

Modulos criados:

- `src/session/solaris-session-domain.js`
- `src/session/solaris-session-client.js`
- `src/session/solaris-session-ui.js`
- `server/solaris-server.js`

Ele contem os modelos puros de mesa virtual:

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

Tambem define eventos:

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

## Permissoes iniciais

- Mestre pode ver e editar tudo.
- Jogador pode enviar chat e rolar dados.
- Jogador pode editar, causar dano, curar e aplicar/remover condicoes apenas na propria ficha.
- Mestre controla monstros, combate, iniciativa, cenas e tokens.
- Jogador pode mover seu proprio token.

## Ordem recomendada de implementacao

### Marco 1 - Fundacao segura

Status: concluido na Fase 1.

- Criar dominio de sessao separado.
- Criar testes de permissao, chat, rolagem, combate e tokens.
- Manter app offline intacto.

### Marco 2 - Shell visual da Mesa Virtual

Status: concluido na Fase 1A.

- Criar uma entrada "Mesa Virtual" sem substituir o app atual.
- Criar tela inicial da mesa inspirada nas referencias.
- Mostrar estado local simulado: sala, jogadores, chat, rolagens e status de conexao.
- Funcionar sem servidor em modo simulado/offline.

### Marco 3 - Servidor local Radmin/LAN

Status: concluido na Fase 1B.

- Adicionar servidor Node opcional.
- Servir o app via HTTP.
- Adicionar WebSocket ou Socket.IO.
- Criar comando `npm run server`.
- Mestre acessa `http://localhost:3000`.
- Jogadores acessam `http://IP-DO-MESTRE:3000`.

### Marco 4 - Sala e chat em tempo real

Status: primeira versao concluida.

- Criar sala.
- Entrar em sala.
- Lista de jogadores.
- Chat compartilhado.
- Historico de rolagens compartilhado.

### Marco 5 - Fichas sincronizadas

Status: etapa intermediaria concluida em `20260616j` e consolidada no cache `20260620c`.

- Jogador importa/escolhe personagem.
- Mestre enxerga fichas.
- PV, Cosmos e Estresse continuam sincronizados.
- A ficha completa agora pode ser sincronizada em sessao.
- Inventario, equipamentos, magias, chips, habilidades e condicoes entram no snapshot de sessao.
- O servidor mantem `revision` por personagem e ignora updates antigos.
- Acoes sensiveis agora podem virar pedido de aprovacao do mestre.

### Marco 6 - Combate compartilhado

Status: primeira versao concluida.

- Iniciar/encerrar combate.
- Ordem de iniciativa.
- Turno atual.
- Proximo turno.
- Aplicar dano/cura/condicao.
- Integrar monstros jogaveis.
- Painel visual de combate dentro da Mesa Virtual.
- Seletor de monstros usando o bestiario atual.
- Log minimalista de eventos de combate.
- Modo offline/simulado com as mesmas acoes basicas.
- Servidor WebSocket recebe e transmite eventos de combate.

### Marco 7 - Bestiario e loot de mesa

- Adicionar monstro a sessao.
- Abrir ficha completa do monstro.
- Rolar ataque/dano.
- Gerar loot ao derrotar.
- Distribuir loot para personagens.

### Marco 8 - Mapa e tokens

Status: primeira versao implementada em `20260620a` e mantida no cache `20260620c`.

- Cena/mapa com grid.
- Tokens de personagens e monstros.
- Movimento.
- Areas de perigo.
- Objetivos da cena.

### Marco 9 - Loja e inventario em sessao

Status: alfa implementada em `20260620c`.

- Carrinho.
- Comprar item.
- Distribuir item.
- Mestre pode aprovar/bloquear mudancas se necessario.

### Marco 10 - Polimento visual e README final

- Refinar telas contra as referencias.
- Validar desktop e iPhone.
- Gerar README de contexto completo.
- So subir ao GitHub quando o usuario pedir.

## Decisoes tomadas agora

- A Fase 2 esta em branch local: `codex/fase-2-mesa-virtual`.
- Nada foi enviado ao GitHub.
- O bloqueio de rolagem por item sem local foi removido antes desta fase; agora e apenas aviso visual.
- O primeiro modulo de sessao foi criado separado do app principal.
- O script de teste agora usa `node --test tests` para rodar todos os testes no Windows.
- A Mesa Virtual foi adicionada como tela isolada chamada `Mesa virtual`.
- O servidor local usa Node.js e `ws`.
- O comando de servidor e `npm run server`.
- O servidor roda por padrao em `http://localhost:3000`.
- O app sem servidor continua abrindo a Mesa Virtual em modo simulado/offline.

## Como iniciar o servidor local

Dentro da pasta do app:

```bash
npm run server
```

O mestre acessa:

```txt
http://localhost:3000
```

Na tela inicial, clique em **Mesa** ou no menu **Mesa virtual**.

Depois clique em:

```txt
Criar Sala
```

Quando conectado, o status muda para:

```txt
Conectado
```

## Como jogadores entram pelo Radmin ou LAN

1. O mestre inicia o servidor com `npm run server`.
2. O mestre confirma o IP da maquina dele no Radmin ou na rede local.
3. O jogador abre no navegador:

```txt
http://IP-DO-MESTRE:3000
```

4. O jogador abre **Mesa**.
5. O jogador clica em **Entrar em Sala**.

Nesta fase existe uma sala padrao:

```txt
Colonia Solaris-7
```

## Como testar chat

1. Mestre cria sala.
2. Jogador entra na sala.
3. Escreva no campo **Digite sua mensagem...**.
4. Clique em **Enviar**.
5. A mensagem deve aparecer no chat de todos os conectados.

## Como testar rolagem compartilhada

1. Com a sala conectada, clique em **Rolar**.
2. A rolagem aparece no historico de rolagens.
3. A mesma rolagem aparece no chat da mesa.
4. Outros clientes conectados recebem a atualizacao da sala.

## Como testar PV, Cosmos e Estresse

1. Abra a Mesa Virtual.
2. Crie ou entre na sala.
3. No painel inferior do personagem, altere PV, Cosmos ou Estresse.
4. Ao sair do campo, o cliente envia `character:resources:update`.
5. O servidor valida permissao:
   - mestre altera qualquer ficha;
   - jogador altera apenas a propria ficha.

## Eventos WebSocket da Fase 1

- `room:create`
- `room:join`
- `room:state`
- `player:join`
- `player:leave`
- `chat:message`
- `dice:roll`
- `character:resources:update`
- `error`

## Eventos WebSocket adicionados e revalidados em 20260620c

### Ficha completa

- `character:sheet:update`
- `character:attributes:update`
- `character:derived:update`
- `character:equipment:update`
- `character:inventory:update`
- `character:item:add`
- `character:item:remove`
- `character:item:move`
- `character:item:equip`
- `character:item:unequip`
- `character:item:use`
- `character:weapon:update`
- `character:armor:update`
- `character:cube:update`
- `character:spell:add`
- `character:spell:remove`
- `character:chip:add`
- `character:chip:remove`
- `character:chip:install`
- `character:chip:uninstall`
- `character:ability:add`
- `character:ability:remove`
- `character:condition:add`
- `character:condition:remove`
- `character:condition:update`
- `character:sync:request`
- `character:sync:full`

### Aprovacao do mestre

- `approval:request`
- `approval:approve`
- `approval:reject`
- `approval:state`

Cada pedido de aprovacao possui:

- `id`;
- `requestedBy`;
- `characterId`;
- `type`;
- `payload`;
- `createdAt`;
- `status`: `pending`, `approved` ou `rejected`;
- `message`.

## Como funciona a sincronizacao completa

Cada `SessionCharacter` possui:

- `snapshot`: estado completo da ficha;
- `revision`: versao incremental da ficha;
- `ownerPlayerId`: jogador dono da ficha;
- `conditions`: condicoes ativas normalizadas.

Quando um update chega:

1. O servidor identifica o personagem por `characterId`.
2. O `PermissionManager` confere se o ator pode editar aquela ficha.
3. Se a acao for sensivel, o servidor cria um `approval:request`.
4. Se a acao for permitida, o servidor aplica a mutacao no snapshot.
5. A `revision` do personagem sobe.
6. O servidor transmite `room:state` para todos.
7. O cliente ignora updates com `revision` menor que a local.

O cliente `SolarisSessionClient` expoe metodos diretos para essa etapa:

- `requestCharacterSync(characterId)`;
- `sendFullCharacterSync(character)`;
- `updateCharacterSheet(characterId, patch)`;
- `updateCharacterAttributes(characterId, attributes)`;
- `updateCharacterDerived(characterId, derivedStats)`;
- `updateCharacterEquipment(characterId, equipment)`;
- `updateCharacterInventory(characterId, inventory)`;
- `addCharacterItem(characterId, item)`;
- `removeCharacterItem(characterId, itemId)`;
- `moveCharacterItem(characterId, itemId, location)`;
- `equipCharacterItem(characterId, itemId, slotId)`;
- `unequipCharacterItem(characterId, itemId)`;
- `useCharacterItem(characterId, itemId)`;
- `addCharacterSpell(characterId, spell)`;
- `removeCharacterSpell(characterId, spellId)`;
- `addCharacterChip(characterId, chip)`;
- `removeCharacterChip(characterId, chipId)`;
- `installCharacterChip(characterId, chipId, targetId)`;
- `uninstallCharacterChip(characterId, chipId)`;
- `addCharacterAbility(characterId, ability)`;
- `removeCharacterAbility(characterId, abilityId)`;
- `addCharacterCondition(characterId, condition)`;
- `removeCharacterCondition(characterId, conditionId)`;
- `updateCharacterCondition(characterId, conditionId, patch)`;
- `requestApproval(payload)`;
- `requestApprovalState()`;
- `approveRequest(requestId)`;
- `rejectRequest(requestId)`.

Campos cobertos no snapshot:

- id, dono, nome, raca, profissao, nivel e XP;
- atributos, modificadores, derivados, pericias e jogadas de protecao;
- PV, Cosmos, Estresse, CA, movimento e iniciativa;
- armas, armaduras, cubos, itens ativos e inventario completo;
- itens sem local definido, cubos, mochilas, coldres, bandoleiras e ganchos;
- magias cosmicas, chips modificadores, chip de profissao e mods instalados;
- habilidades raciais, manuais e gerais;
- condicoes, notas visiveis ao jogador e metadados de migracao.

## Como funciona a aprovacao do mestre

O mestre pode editar qualquer ficha diretamente.

O jogador pode editar apenas a propria ficha. Quando a alteracao e sensivel, o servidor cria um pedido pendente em vez de aplicar imediatamente.

Acoes sensiveis nesta etapa:

- comprar item;
- vender item;
- excluir item;
- mover item entre personagens;
- alterar dinheiro;
- instalar ou remover chip;
- adicionar ou remover magia;
- alterar equipamento durante combate.

No modo offline/simulado, a ficha local continua funcionando como antes. A aprovacao nao bloqueia o app local.

## Como testar ficha sincronizada

1. Rodar `npm run server`.
2. Abrir `http://localhost:3000/?view=mesaVirtual&check=20260620e`.
3. Abrir a Mesa Virtual.
4. Como mestre, clicar em **Criar Sala**.
5. Em outra aba, abrir a mesma URL e clicar em **Entrar em Sala**.
6. Clicar em **Sincronizar** para enviar a ficha completa.
7. Alterar PV, Cosmos e Estresse no painel inferior.
8. Usar os botoes **Usar Item**, **Mover Item** e **Equipar** para disparar eventos de ficha.
9. Usar **Comprar**, **Vender** ou **Excluir** para criar pedidos ao mestre.
10. No painel **Aprovacoes do mestre**, aprovar ou rejeitar.
11. Conferir chat e historico visual da mesa.
12. Fechar o servidor e recarregar o app para confirmar modo offline.

## Limitacoes atuais

- Ainda nao existe lista de salas.
- Existe uma sala padrao para teste: `Colonia Solaris-7`.
- O mapa tatico ja possui grid, tokens, zonas e movimento; ainda falta upload visual de battlemap e medicao de distancia.
- Compra/venda/exclusao em sessao possuem base de aprovacao e a loja alfa ja usa carrinho local com pedido ao mestre.
- A UI da Mesa Virtual ainda usa prompts simples para loot; a proxima etapa deve trocar isso por janelas dedicadas.
- Aprovacao de itens importantes ja existe no dominio, mas ainda falta granularidade por politica de sala.
- Monstros ativos e combate sincronizam, mas distribuicao de loot para fichas ainda fica para fase seguinte.
- A abertura via `file://index.html` precisa ser conferida manualmente fora do Browser interno do Codex, pois o Browser interno bloqueia URLs `file://` por politica de seguranca.
- O modo offline validado nesta fase foi: app carregado sem servidor WebSocket em `127.0.0.1:8787`, mantendo status `Offline` e sem erros de console.

## Fase 3 iniciada

O mapa tatico saiu do placeholder em `20260620a` e foi mantido no cache `20260620c`. A documentacao detalhada esta em:

```txt
docs/FASE_3_MAPA_TATICO.md
```

## Proximo passo sugerido

Evoluir o mapa tatico e, em seguida, construir a camada de **loja, loot e distribuicao de itens em sessao** em cima da aprovacao atual:

- upload/selecao de imagem de mapa;
- medidor de distancia;
- areas de efeito para ataques e magias;
- carrinho de compras multiplayer;
- aprovacao por item e por lote;
- distribuicao de loot de monstro para personagens;
- janelas dedicadas para mover item entre cubo, mochila, coldre, bandoleira e gancho;
- exportacao de mudancas para a ficha local e para futuras fichas de monstro;
- politicas de sala para decidir quais acoes exigem aprovacao do mestre.

Documentacao da loja alfa:

```txt
docs/FASE_4_LOJA_E_DISTRIBUICAO.md
```
## Fase 5 - Polimento funcional

Implementada no cache `20260620d`.

- Mapa com imagem, grid configuravel, medicao, areas e objetivos com progresso.
- Visibilidade filtrada para jogadores.
- Loja com detalhe de item, destino de armazenamento e carrinhos visiveis ao mestre.
- Loot com janela dedicada e pacote automatico ao derrotar monstro.
- Ficha de monstro modal com ataque, dano, condicoes e criacao de loot.

## Fase 6 - Alvos e dano tatico

Implementada no cache `20260620e`.

- Modo Alvo no mapa tatico.
- Token alvo destacado visualmente.
- Botao Alvo nos cards de combatente.
- Ficha de monstro com Atacar Alvo e Dano no Alvo.
- Areas de efeito clicaveis.
- Dano na area aplicado aos tokens dentro da area.
- Logs de dano registram a fonte do ataque ou efeito.

Documentacao:

```txt
docs/FASE_6_ALVOS_E_DANO.md
```

## Fase 7 - Previa de areas

Implementada no cache `20260620f`.

- Cones e linhas possuem direcao (`east`, `west`, `north`, `south`).
- Area selecionada mostra quais tokens serao atingidos.
- Tokens atingidos por area recebem destaque visual.
- A legenda da area mostra os nomes atingidos antes de aplicar dano.
- Build de teste do VTT passa para `0.6.0-alpha.3`.

Documentacao:

```txt
docs/FASE_7_PREVIA_AREAS.md
```

## Fase 8 - Separacao ficha/VTT

Implementada apos o cache `20260620f`.

- Ficha/biblioteca volta a ter entrada Electron propria em `electron-main.cjs`.
- Mesa Virtual ganha entrada propria em `electron-main-vtt.cjs`.
- Build da ficha usa `electron-builder.ficha.cjs`.
- Build do VTT usa `electron-builder.vtt.cjs`.
- `dist:ficha` gera `Solaris Biblioteca`.
- `dist:vtt` gera `Solaris Tabletop Alpha`.
- Saidas separadas em `dist-ficha/` e `dist-vtt/`.

Documentacao:

```txt
docs/FASE_8_SEPARACAO_PROJETOS.md
```

## Fase 9 - Persistencia de sessoes e campanhas

Implementada no cache `20260620g`.

- Modulo puro `src/session/solaris-session-persistence.js`.
- Schema de sessao `1.0.0`.
- Campanhas e sessoes salvas no host via `localStorage`.
- Exportacao/importacao JSON de sessao.
- Autosaves com limite.
- Snapshot manual.
- Recuperacao de sessao recente nao encerrada.
- Modal **Campanhas** dentro da Mesa Virtual.
- Eventos `campaign:*` e `session:*` preparados no cliente/servidor.
- Servidor local pode receber e restaurar estado enviado pelo host.

Documentacao:

```txt
docs/FASE_9_PERSISTENCIA_SESSOES.md
```

## Fase 10 - Painel do Mestre

Implementada no cache `20260620h`.

- Painel privado do mestre com abas de resumo, cenas, encontros, notas, contadores, ambiente, escudo e logs.
- Eventos `gm:*` no dominio, cliente e servidor.
- Notas, contadores e efeitos ocultos sao filtrados para jogadores.
- Cenas salvas e encontros preparados entram no estado persistente da campanha.
- Layout do Tabletop recebeu rolagem interna para evitar caixas sobrepostas quando listas crescem.

Documentacao:

```txt
docs/FASE_10_PAINEL_MESTRE.md
```

## Fase 11 - Consolidacao do Mestre, campanhas e escudo

Implementada no cache `20260620i`.

- Tela dedicada **Minhas Campanhas** em `?view=campaigns`.
- Formularios dedicados para notas, contadores, efeitos ambientais, cenas e encontros.
- Gerador de encontros com filtros do bestiario.
- Escudo do Mestre com busca, regras fixadas, copiar e enviar ao chat.
- Relatorio de sessao refinado com opcoes de inclusao.
- Persistencia de configuracoes do mestre em `gmDashboardSettings`.
- `npm run start:vtt` passa a abrir o Tabletop na tela de campanhas.

Documentacao:

```txt
docs/FASE_11_CONSOLIDACAO_MESTRE.md
```

## Fase 12 - Editores visuais e polimento

Implementada no cache `20260620j`.

- Editor Visual de Cena.
- Editor Visual de Encontro.
- Preview de relatorio antes de exportar.
- Relatorios salvos em sessao/campanha.
- Balanceamento alfa de encontros.
- Posicoes iniciais de monstros em encontros preparados.
- Rolagem interna reforcada em paineis e modais.
- Tabletop Alpha em `0.6.0-alpha.5`.

Documentacao:

```txt
docs/FASE_12_EDITORES_POLIMENTO_USABILIDADE.md
```

## Fase 14 - Editor avancado de cenas

Implementada no cache `20260621c`.

- Selecionar token, zona, area ou objetivo direto no preview da cena.
- Arrastar elementos dentro do editor para reposicionar por celula.
- Formulario contextual para editar cada tipo de elemento.
- Criacao de areas de efeito pelo editor.
- Persistencia das edicoes em cena ativa, `sceneList`, snapshots e export/import.
- Tabletop Alpha em `0.6.0-alpha.6`.

Documentacao:

```txt
docs/FASE_14_EDITOR_CENAS_AVANCADO.md
```

## Fase 15 - Loja visual avancada

Implementada no cache `20260621d`.

- Loja Solaris com sidebar de categorias, topbar, busca, filtros e carrinho lateral.
- Modos Biblioteca, Sessao e Mestre.
- Filtros por categoria, tier, raridade, preco, estoque e compatibilidade.
- Cards padronizados com raridade, badges, preco, fonte e acoes.
- Modal de detalhe com compatibilidade, politica da sessao e acoes.
- Carrinho com destino por item.
- Aprovacao individual de item dentro de carrinho.
- Compra aprovada respeita destino de cada linha.
- Mestre pode converter carrinho em loot.
- Tabletop Alpha em `0.6.0-alpha.7`.

Documentacao:

```txt
docs/FASE_15_LOJA_VISUAL_AVANCADA.md
```

## Fase 16 - Padronizacao visual global

Implementada no cache `20260621e`.

- Tokens globais `--solaris-*` para identidade visual do Tabletop.
- Classes reutilizaveis para shell, topbar, sidebars, paineis, cards, botoes, inputs, badges, medidores, modais, scroll panels e barra inferior.
- Mesa Virtual, Loja, Minhas Campanhas, Painel do Mestre, Escudo, editores, ficha de monstro, loot e aprovacoes foram alinhados ao mesmo visual sci-fi neon.
- Responsividade reforcada para 1600px, 1366px e janelas menores do Electron.
- Tabletop Alpha em `0.6.0-alpha.8`.

Documentacao:

```txt
docs/FASE_16_PADRONIZACAO_VISUAL_GLOBAL.md
```

## Fase 17 - Estrutura visual por telas

Implementada no cache `20260621f`.

- O centro da Mesa Virtual agora possui navegacao principal por telas: `Mesa`, `Loja`, `Ficha` e `Mestre`.
- A tela `Mesa` concentra mapa tatico, laterais, chat, combate e uma faixa inferior compacta do personagem.
- A tela `Loja` usa largura ampla e remove laterais durante a compra para reduzir competicao visual.
- A tela `Ficha` apresenta resumo sincronizado do personagem em uma estrutura propria.
- A tela `Mestre` organiza comandos, cena atual, objetivos, notas, monstros, mapas e contadores em paineis dedicados.
- Conteudos longos passam a rolar dentro do proprio box, reduzindo sobreposicoes quando uma acao adiciona mais dados na tela.
- Tabletop Alpha em `0.6.0-alpha.9`.

Documentacao:

```txt
docs/FASE_17_ESTRUTURA_VISUAL_TABLETOP.md
```

## Fase 17B - Desktop-first do Tabletop

Implementada no cache `20260622f`.

- O layout do Tabletop foi ajustado para PC/Windows como prioridade.
- A tela `Mesa` passa a favorecer o mapa/palco central, mantendo jogadores/chat e painel de combate como docks laterais.
- Topbar, toolbar de mapa, barra inferior e slots rapidos foram compactados para liberar area vertical.
- Paineis laterais usam alturas controladas e rolagem interna para impedir sobreposicoes em sessoes longas.
- A Loja e a Ficha continuam em modo amplo, escondendo laterais quando isso melhora a leitura.
- O comportamento mobile/iPhone permanece preservado por media queries abaixo de 760px.
- Tabletop Alpha em `0.6.0-alpha.13`.

Documentacao:

```txt
docs/FASE_17B_DESKTOP_FIRST_TABLETOP.md
```
