# Matriz Funcional de Regras - Guerra Solar / Solaris

Esta auditoria reflete o estado dos livros e do app na data/cache atual. Como as regras de Guerra Solar ainda estão em desenvolvimento, esta matriz deve ser revisada sempre que os livros oficiais forem alterados.

## Legenda

Status:

- `Implementada`: fluxo existe e pode ser usado.
- `Parcial`: parte da regra existe, mas ainda falta completude.
- `Provisoria`: regra existe como solucao temporaria.
- `Ausente`: nao ha fluxo funcional suficiente.
- `Divergente`: ha risco de desalinhamento com livro atual.
- `Instavel`: depende de fonte ou regra ainda mutavel.

Prioridade:

- `P0`: corrige base do sistema ou evita erro grave.
- `P1`: necessario para alpha confiavel.
- `P2`: importante para completar experiencia.
- `P3`: acabamento, organizacao ou conteudo expandido.

## Matriz

| Livro | Area | Regra/Função | Estabilidade | Status no app | Onde aparece | Offline | VTT | Sincronizacao | Testes | Gap principal | Prioridade | Fase sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Criacao | Criar ficha com nome, jogador, raca, profissao e nivel | Media | Parcial | `app.js` | Sim | Parcial | Parcial | Parcial | Wizard oficial incompleto | P1 | 20 |
| 1 | Criacao | Guia passo a passo de personagem | Media | Parcial | Aba/guia de ficha e docs | Sim | Nao central | Nao | Nao | Deve sair da ficha e virar fluxo dedicado | P1 | 20 |
| 1 | Criacao | Rolagem de atributos iniciais | Media | Implementada | `rollInitialAttributePool` | Sim | Parcial | Nao | Parcial | Falta validar texto oficial final | P1 | 20 |
| 1 | Criacao | Equipamento inicial por origem/profissao | Instavel | Parcial | Catalogos e loja | Sim | Parcial | Parcial | Parcial | Pacotes oficiais precisam reconciliacao | P1 | 20 |
| 1 | Racas | Humanis, Zerak, Veyrkan, Kairi e bonus | Alta | Parcial/Divergente | `raceData` | Sim | Parcial | Parcial | Parcial | Revalidar bonus e pericia extra | P0 | 19/20 |
| 1 | Racas | Pericia extra racial | Alta | Divergente | `raceData`, skills | Sim | Parcial | Parcial | Nao claro | Humanis ja teve erro relatado | P0 | 19/20 |
| 1 | Racas | Habilidades raciais por nivel | Media | Parcial | `raceData`, habilidades | Sim | Parcial | Parcial | Parcial | Verificar progressao oficial | P1 | 20 |
| 1 | Atributos | FOR, REF, CON, MEN, PRE, INT | Alta | Implementada | `ATTRIBUTES` | Sim | Sim | Sim | Sim | Nenhum critico | P2 | 21 |
| 1 | Atributos | Base 7 e limite 0-20 | Alta | Implementada | `ATTRIBUTE_BASE` | Sim | Sim | Sim | Sim | Conferir se todos inputs respeitam limite | P2 | 21 |
| 1 | Atributos | Modificador `INT((valor-10)/2)` | Alta | Implementada | `attrMod`, derivados | Sim | Sim | Sim | Sim | Nenhum critico | P2 | 21 |
| 1 | Pericias | Pericias por FOR | Media | Parcial | `skillData` | Sim | Parcial | Parcial | Parcial | Conferir nomes e textos oficiais | P1 | 20/21 |
| 1 | Pericias | Pericias por REF | Media | Parcial | `skillData` | Sim | Parcial | Parcial | Parcial | Conferir nomes e textos oficiais | P1 | 20/21 |
| 1 | Pericias | Pericias por MEN | Media | Parcial | `skillData` | Sim | Parcial | Parcial | Parcial | Cosmos/percepcao precisam padrao | P1 | 20/21 |
| 1 | Pericias | Pericias por PRE | Media | Parcial | `skillData` | Sim | Parcial | Parcial | Parcial | Espirito/Presenca precisa termo unico | P1 | 20/21 |
| 1 | Pericias | Pericias por INT | Media | Parcial | `skillData` | Sim | Parcial | Parcial | Parcial | Medicina/Tecnologia/Engenharia etc. | P1 | 20/21 |
| 1 | Pericias | Perito e ignorante | Media | Parcial | ficha | Sim | Parcial | Parcial | Parcial | Permitir ignorancias ilimitadas e sincronizar | P1 | 20 |
| 1 | Protecao | JPF com FOR ou CON | Alta | Parcial | `protectionData` | Sim | Parcial | Parcial | Parcial | Escolha situacional precisa estar clara | P1 | 21 |
| 1 | Protecao | JPR com REF | Alta | Implementada/Parcial | `protectionData` | Sim | Parcial | Parcial | Parcial | Conferir UI e texto | P2 | 21 |
| 1 | Protecao | JPC/JP Vontade com PRE | Alta | Implementada/Parcial | `protectionData` | Sim | Parcial | Parcial | Parcial | Termo oficial precisa padrao | P2 | 21 |
| 1 | Testes | Testes comuns 3d6 + mod + bonus | Alta | Implementada | `rollCharacterTest` | Sim | Sim | Sim | Parcial | Resultado oficial deve ser padronizado | P1 | 21 |
| 1 | Testes | Estresse altera dados | Media | Provisoria | `rollDicePool`, UI | Sim | Sim | Sim | Parcial | Consolidar thresholds oficiais | P1 | 21 |
| 1 | Testes | Vantagem/desvantagem | Media | Implementada/Parcial | UI de dados | Sim | Sim | Sim | Parcial | Conferir empilhamento oficial | P2 | 21 |
| 1 | Cosmos | Cosmos maximo e recuperacao | Instavel | Provisoria | `derivedStats` | Sim | Parcial | Parcial | Parcial | Formula final precisa verificacao | P1 | 20/21 |
| 1 | Estresse | Maximo, colapso e HUD | Instavel | Parcial | ficha/HUD | Sim | Parcial | Parcial | Parcial | Livro e app ja tiveram valores distintos | P1 | 21 |
| 1 | Combate | Iniciativa `1d20 + REF` | Alta | Implementada | `rollInitiative` | Sim | Sim | Sim | Sim | Nenhum critico | P2 | 21 |
| 1 | Combate | Ataque `1d20 + modificador` | Alta | Implementada/Parcial | ficha/VTT | Sim | Sim | Sim | Parcial | Escolha de modificador precisa UI completa | P1 | 21 |
| 1 | Combate | Dano de arma | Alta | Implementada/Parcial | `rollWeaponDamage` | Sim | Sim | Sim | Parcial | Validar armas oficiais e mods passivos | P1 | 21/22 |
| 1 | Combate | Lista de acoes | Media | Parcial | Biblioteca de acoes | Sim | Parcial | Nao | Nao | Completar combate/cena/timeskip/fora combate | P2 | 21 |
| 1 | Combate | Ferimentos, morte, estabilizacao | Alta | Parcial/Ausente | regras/ficha | Parcial | Parcial | Parcial | Nao claro | Fluxo completo necessario | P0 | 21 |
| 1 | Combate | Criticos, erros criticos e lesoes | Alta | Parcial | rolagens/regras | Parcial | Parcial | Parcial | Nao claro | Efeitos automaticos ausentes | P1 | 21 |
| 1 | Condicoes | Condicoes oficiais | Alta | Parcial | ficha/VTT | Sim | Sim | Sim | Sim | Efeitos e fim precisam padrao | P1 | 21 |
| 1 | Inventario | Luzentis | Alta | Implementada | compra/venda | Sim | Sim | Sim | Sim | Nenhum critico | P2 | 22 |
| 1 | Inventario | Carga maxima | Media | Parcial | ficha/inventario | Sim | Parcial | Parcial | Parcial | Conferir formula final | P1 | 20/22 |
| 1 | Inventario | Item sem local definido | Alta | Implementada | aviso visual | Sim | Sim | Sim | Sim | Deve permanecer sem bloquear rolagem | P2 | 22 |
| 1 | Progressao | XP, custo, tempo e nivel | Instavel | Parcial | botao Evoluir | Sim | Parcial | Parcial | Parcial | Requisitos e escolhas precisam guia | P0 | 20 |
| 2 | Mestre | Painel do mestre | Media | Implementada | Tabletop | Nao | Sim | Sim | Sim | Falta regras narrativas completas | P2 | 24 |
| 2 | Mestre | Notas, logs e relatorios | Media | Implementada/Parcial | `solaris-session-persistence` | Nao | Sim | Sim | Sim | Exportacao final e filtros | P2 | 24 |
| 2 | Encontros | Criacao e balanceamento | Instavel | Provisoria | `estimateEncounterBalance` | Nao | Sim | Sim | Sim | Formula oficial precisa calibragem | P1 | 24 |
| 2 | Encontros | Geradores de missao/eventos | Media | Parcial/Ausente | painel mestre | Nao | Parcial | Parcial | Nao | Ainda generico | P2 | 24 |
| 2 | Campanha | Recompensas | Instavel | Parcial | loot/loja | Sim | Sim | Sim | Parcial | XP, itens e dinheiro por risco | P1 | 24 |
| 2 | Campanha | Faccao e reputacao | Media | Parcial/Ausente | ficha/regras | Parcial | Parcial | Nao | Nao | Precisa modelo dedicado | P2 | 24 |
| 2 | Exploracao | Viagem e ambiente hostil | Media | Ausente/Parcial | regras | Parcial | Parcial | Nao | Nao | Faltam ferramentas de mesa | P2 | 24 |
| 2 | Tecnologia | Hacking e sistemas digitais | Media | Parcial | pericia Tecnologia | Sim | Parcial | Nao | Nao | Falta minissistema | P2 | 24 |
| 2 | Recursos | Oficinas, reparos e bases | Media | Parcial | rachaduras/reparo | Sim | Parcial | Parcial | Parcial | Bases e oficinas ausentes | P2 | 24 |
| 3 | Bestiario | Catalogo de monstros | Alta | Implementada/Parcial | bestiario | Sim | Sim | Sim | Parcial | Conferir todos os monstros atuais | P1 | 23 |
| 3 | Bestiario | Ficha jogavel de monstro | Alta | Implementada | `MonsterSheet` | Sim | Sim | Sim | Sim | Completar campos narrativos | P2 | 23 |
| 3 | Bestiario | Ataques e dano de monstros | Alta | Implementada/Parcial | VTT/ficha monstro | Sim | Sim | Sim | Sim | Validar formulas oficiais | P1 | 23 |
| 3 | Bestiario | Resistencias, imunidades, vulnerabilidades | Alta | Parcial | bestiario | Sim | Sim | Parcial | Parcial | Conferir listas oficiais | P1 | 23 |
| 3 | Bestiario | Loot automatico | Media | Implementada/Parcial | `rollMonsterLoot` | Sim | Sim | Sim | Sim | Tabelas de drop por monstro precisam fechar | P1 | 23 |
| 3 | Bestiario | Comportamento, taticas e ecologia | Media | Parcial/Ausente | detalhes | Sim | Parcial | Nao | Nao | Texto do livro deve entrar em detalhes | P2 | 23 |
| 3 | Bestiario | Variantes e templates | Media | Ausente/Parcial | bestiario | Parcial | Parcial | Nao | Nao | Falta modelo estruturado | P2 | 23 |
| 4 | Cenarios | Compendio de lore | Instavel | Parcial | livros/regras | Sim | Parcial | Nao | Nao | Nao e banco navegavel ainda | P2 | 25 |
| 4 | Cenarios | Locais e cenas | Media | Parcial | cenas/VTT | Nao | Sim | Sim | Sim | Faltam links com lore oficial | P2 | 25 |
| 4 | Cenarios | Faccao/NPC/linha do tempo | Media | Ausente/Parcial | notas | Parcial | Parcial | Nao | Nao | Precisa modelo dedicado | P2 | 25 |
| 4 | Cenarios | Ganchos de campanha | Media | Parcial/Ausente | painel mestre | Nao | Parcial | Nao | Nao | Integrar a sessoes e cenas | P3 | 25 |
| 5 | Catalogo | Fonte oficial de dados | Alta | Divergente/Instavel | `official-*` | Sim | Sim | Sim | Parcial | Nomes de fontes nao batem com livros atuais | P0 | 19 |
| 5 | Itens | Itens comuns e consumiveis | Alta | Implementada/Parcial | loja/inventario | Sim | Sim | Sim | Sim | Validar lista final | P1 | 19/22 |
| 5 | Itens | Detalhe por duplo clique | Alta | Implementada/Parcial | modal detalhes | Sim | Parcial | Nao | Nao | Padronizar guia de uso | P1 | 22 |
| 5 | Loja | Compra com Luzentis | Alta | Implementada | loja | Sim | Sim | Sim | Sim | Conferir aprovacao VTT em todos fluxos | P2 | 22 |
| 5 | Loja | Venda com valor editavel | Alta | Implementada | inventario | Sim | Sim | Sim | Sim | Testar em sessao com aprovacao | P2 | 22 |
| 5 | Loja | Exportar criado para biblioteca | Media | Parcial | criador manual | Sim | Parcial | Parcial | Parcial | Precisa persistencia/catalogo compartilhado | P1 | 22 |
| 5 | Armas | Categorias e grupos de arma | Alta | Parcial | catalogo/ficha | Sim | Sim | Sim | Parcial | Conferir grupos oficiais | P1 | 22 |
| 5 | Armas | Rifle de Precisao / Olho de NYX | Alta | Divergente | detalhes armas | Sim | Parcial | Nao | Nao | Trecho oficial citado como incompleto | P1 | 19/22 |
| 5 | Armas | Municao e carregadores | Alta | Implementada | dominio/ficha | Sim | Parcial | Parcial | Sim | Completar UI VTT se necessario | P1 | 22 |
| 5 | Armas | Modos de disparo | Alta | Implementada/Parcial | dominio | Sim | Parcial | Parcial | Sim | Conferir todas armas oficiais | P1 | 22 |
| 5 | Armaduras | CA oficial | Alta | Divergente/Parcial | catalogo/derivados | Sim | Sim | Sim | Parcial | Validar contra Livro 5 atual | P0 | 19/22 |
| 5 | Armaduras | Ganchos e suporte | Alta | Implementada/Parcial | inventario | Sim | Parcial | Parcial | Parcial | Conferir capacidade/peso | P1 | 22 |
| 5 | Equipamento | Rachaduras | Alta | Implementada | `Rachaduras` | Sim | Parcial | Parcial | Sim | Integrar reparo oficial completo | P1 | 22 |
| 5 | Equipamento | Jammed / travamento | Media | Parcial | catalogo/regras | Parcial | Parcial | Parcial | Nao claro | Efeito automatico precisa consolidar | P2 | 22 |
| 5 | Cubos | Cubo simples, carga, especializado | Alta | Implementada/Parcial | `renderCubePage` | Sim | Parcial | Parcial | Parcial | Validar regras de tipo e capacidade | P1 | 22 |
| 5 | Cubos | Peso 1kg | Alta | Implementada | `CUBE_WEIGHT_KG` | Sim | Sim | Sim | Sim | Nenhum critico | P2 | 22 |
| 5 | Armazenamento | Mochila, coldre, bandoleira e gancho | Alta | Implementada/Parcial | inventario | Sim | Parcial | Parcial | Sim | Melhorar UI e sincronizacao | P1 | 22 |
| 5 | Mods | Slots de mods | Alta | Implementada/Parcial | `modifierSlotState` | Sim | Parcial | Parcial | Parcial | Conferir soma de equipamentos | P1 | 22 |
| 5 | Mods | Passivos de ataque/dano/status | Alta | Parcial | `modifierPassiveTotals` | Sim | Parcial | Parcial | Parcial | Conferir todos os mods | P1 | 22 |
| 5 | Chips | Chips modificadores | Alta | Divergente/Parcial | catalogo/chips | Sim | Parcial | Parcial | Parcial | Trechos incoerentes citados | P0 | 19/22 |
| 5 | Chips | Instalar/remover chip | Alta | Implementada/Parcial | ficha/VTT sync | Sim | Sim | Sim | Sim | Aprovar em sessao sensivel | P2 | 22 |
| 5 | Magias | Magias cosmicas e slots | Alta | Parcial | biblioteca/habilidades | Sim | Parcial | Parcial | Parcial | Conferir aquisicao e limites | P1 | 22 |
| 5 | Crafting | Receita, materiais e fabricacao | Instavel | Ausente/Parcial | catalogos | Parcial | Parcial | Nao | Nao | Sistema completo adiado | P1 | 22 |
| 5 | Utilitarios | Drones, torretas, robos e automatos | Media | Parcial/Ausente | catalogos | Sim | Parcial | Parcial | Nao claro | Precisa modelo dedicado | P2 | 22 |
| 5 | Veiculos | Veiculos e equipamentos grandes | Media | Parcial/Ausente | catalogos | Parcial | Parcial | Nao | Nao | Falta ficha/uso em VTT | P2 | 22 |
| App | Offline | Ficha local sem servidor | Alta | Implementada | app principal | Sim | Nao | Nao | Sim | Nao quebrar | P0 | Continua |
| App | PWA | Uso no iPhone | Alta | Implementada | GitHub Pages/PWA | Sim | Parcial | Nao | Manual | Validar apos cada build | P1 | Continua |
| App | VTT | Mesa com servidor opcional | Alta | Implementada | `server`, `src/session` | Nao | Sim | Sim | Sim | Evoluir sem quebrar offline | P0 | Continua |
| App | Persistencia | Campanhas e sessoes | Alta | Implementada | `solaris-session-persistence` | Nao | Sim | Sim | Sim | Backup/restore e migracoes | P1 | 24 |
| App | Permissoes | Mestre/jogador/aprovacoes | Alta | Implementada/Parcial | sessao/servidor | Nao | Sim | Sim | Sim | Expandir a todos fluxos sensiveis | P1 | 24 |

## Diagnostico

A matriz mostra que o app tem boa infraestrutura, mas precisa de uma fase de reconciliacao oficial antes de novas mecanicas grandes. A parte mais vulneravel e conteudo: nomes de livros, catalogos gerados, descricoes oficiais, armas, armaduras, chips, mods e magias.

O caminho mais seguro e:

1. Congelar a lista de documentos oficiais atuais.
2. Regerar/validar catalogos oficiais.
3. Criar testes que falhem quando uma CA, dano, preco, slot ou nome oficial divergir.
4. So entao completar progressao, combate avancado, crafting e sistemas de campanha.

## Atualizacao da Fase 19

Data: 2026-06-23.

A Fase 19 executou o primeiro passo da governanca:

- os cinco livros oficiais atuais foram registrados em `docs/MAPA_FONTES_OFICIAIS.md`;
- `official-books-data.js` passou a usar fontes atuais e incluiu Livro 4 em `sources`;
- `official-book5-catalog.js` passou a apontar para `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`;
- `official-rulebook-compendium.js` recebeu fontes atuais e preservou fontes anteriores como historico;
- entradas principais receberam metadados de rastreabilidade como `sourceFileCurrent`, `sourceStatus`, `sourceLastReconciledAt`, `dataStability`, `needsReview` e `reviewReason`;
- foi criado `scripts/audit-official-sources.mjs`;
- foi criado `tests/official-data-reconciliation.test.mjs`.

Mudanca de status:

| Area | Status antes | Status depois | Observacao |
| --- | --- | --- | --- |
| Fontes oficiais | Divergente/Instavel | Parcialmente corrigido | Fontes atuais registradas; conteudo ainda precisa revisao manual |
| Livro 5 catalogo | Alto risco | Governanca aplicada | Valores mecanicos ainda P0/P1 para Fase 22 |
| Livro 4 no mapa oficial | Parcial/ausente | Fonte registrada | Ainda falta compendio navegavel |
| Testes de catalogo | Parcial | Criados testes de governanca | Ainda faltam testes numericos por tabela |

Nova prioridade:

- P0 imediato concluido: fonte atual rastreavel.
- P0 restante: conferir valores mecanicos oficiais do Livro 5.
- P1 restante: validar racas/progressao do Livro 1 contra fonte atual.
