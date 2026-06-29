# Registro de Regras Mutaveis - Guerra Solar / Solaris

Esta auditoria reflete o estado dos livros e do app na data/cache atual. Como as regras de Guerra Solar ainda estão em desenvolvimento, esta matriz deve ser revisada sempre que os livros oficiais forem alterados.

## Objetivo

Este registro separa o que parece estavel do que ainda deve ser tratado como provisao. Ele existe para evitar que uma regra em desenvolvimento fique "enterrada" no codigo como se fosse definitiva.

## Regras Estaveis ou Quase Estaveis

| Regra | Estado atual | Onde aparece | Risco | Quando reauditar |
| --- | --- | --- | --- | --- |
| Seis atributos `FOR`, `REF`, `CON`, `MEN`, `PRE`, `INT` | Implementado | `app.js` | Baixo | Se Livro 1 alterar atributos |
| Atributo base `7` | Implementado | `ATTRIBUTE_BASE` | Baixo | Se criacao mudar |
| Limite de atributo ate `20` | Implementado | inputs/ficha | Baixo | Se Livro 1 alterar limite |
| Modificador por `INT((valor - 10) / 2)` | Implementado | derivados/testes | Baixo | Se tabela de mods mudar |
| Criacao oficial agrupada em 7 etapas / 10 passos do Livro 1 | Implementado | `solaris-character-creation.js`, aba Guia | Medio | Se Livro 1 alterar criacao |
| CON sem pericias proprias | Implementado | `OFFICIAL_SKILLS_BY_ATTRIBUTE` | Baixo | Se Livro 1 alterar pericias |
| Equipamento inicial basico | Implementado/parcial | aba Guia, personagem aleatorio | Medio | Se Livro 1/Livro 5 alterar kits |
| Iniciativa `1d20 + MOD REF` | Implementado | ficha/VTT | Baixo | Se combate mudar |
| Ataques com `1d20 + modificador` | Implementado/parcial | ficha/VTT | Medio | Se armas ou combate mudar |
| Motor oficial de combate da Fase 22 | Implementado | `solaris-combat-rules.js`, `solaris-session-domain.js` | Medio | Se Livro 1/Livro 5 alterar combate, criticos ou dano |
| Estado critico, Sangramento, Ferimentos Graves e Marcas de Morte | Implementado/parcial | dominio/VTT | Medio | Se Livro 1 alterar morte, estabilizacao ou condicoes |
| Luzentis como dinheiro | Implementado | loja/inventario | Baixo | Se economia mudar nome/moeda |
| Cubo pesa `1kg` | Implementado | `CUBE_WEIGHT_KG` | Medio | Se Livro 5 mudar carga/cubos |
| Item sem local definido nao bloqueia rolagem | Implementado | inventario/dados | Baixo | Se regra de carga mudar |
| Offline com `localStorage` | Implementado | app principal | Baixo | A cada mudanca de persistencia |
| Separacao Biblioteca/Tabletop | Implementado | Electron/scripts | Baixo | A cada build de desktop |
| Motor oficial de bestiario da Fase 24 | Implementado | `solaris-bestiary-rules.js`, VTT | Medio | Se Livro 3 alterar fichas, ataques, loot ou resistencias |
| Ficha de monstro normalizada | Implementado | `normalizeMonsterEntry`, `createSessionMonsterFromBestiary` | Medio | Sempre que recompilar Livro 3 |
| Modelos do Guia do Mestre da Fase 25 | Implementado | `solaris-gm-rules.js`, Painel do Mestre | Medio | Se Livro 2 alterar missoes, viagem, hacking, bases ou reputacao |
| Persistencia de campanha GM | Implementado | `gmState`, sessoes/campanhas/autosaves | Baixo | A cada mudanca de schema de campanha |
| Compendio inicial do Livro 4 | Implementado/parcial | `solaris-lore-rules.js`, Biblioteca Lore, Painel do Mestre | Medio | Se Livro 4 alterar lore, locais, faccoes, NPCs ou ganchos |

## Regras Funcionais Provisorias

| Regra | Estado atual | Motivo da provisoriedade | Risco | Acao recomendada |
| --- | --- | --- | --- | --- |
| PV maximo por nivel | Provisorio | Livros passaram por ajustes | Alto | Reconciliar Livro 1 e fichas existentes |
| Cosmos maximo e recuperacao | Provisorio | Formula depende de nivel, MEN, bonus e equipamentos | Alto | Criar teste de formula oficial |
| Estresse, saturacao e colapso | Provisorio | App ja teve valores diferentes no historico | Alto | Unificar Livro 1, HUD e rolagens |
| JPF com FOR ou CON | Parcial | Escolha e situacionalidade precisam UI clara | Medio | Criar seletor por rolagem |
| Perito/ignorante | Parcial | Usuario pediu ignorancias ilimitadas | Medio | Sincronizar e testar sem limite |
| Racas e pericia extra | Divergente possivel | Humanis ja teve problema relatado | Alto | Validar todas as racas |
| Chips de profissao | Parcial | Afeta pericias e passivos | Alto | Reconciliar com Livro 1/Livro 5 |
| Progressao de nivel | Parcial | Historico estruturado implementado; kits/materiais finais ainda sensiveis | Alto | Wizard de evolucao e reconciliacao Livro 5 |
| Carga maxima | Parcial | Interage com peso, cubos e suportes | Medio | Testes de limite e sobrecarga |
| Loja em sessao | Implementada/parcial | Compra/venda/exclusao dependem de aprovacao | Medio | Cobrir todos fluxos sensiveis |
| Condicoes | Implementada/parcial | Sangramento e duracao entraram no motor; catalogo visual ainda incompleto | Medio | Completar UI e lista oficial |
| Ferimentos, morte e estabilizacao | Implementada/parcial | Motor existe; faltam paineis/acoes dedicadas na UI | Medio | Expor Marcas, Ferimentos e estabilizar na mesa |
| Criticos e erros criticos | Implementada/parcial | Tabelas e consequencias existem; algumas dependem de decisao do mestre | Medio | Conectar todos efeitos ao fluxo visual de ataque |
| Balanceamento de encontro | Provisorio | Formula de mesa depende de Livro 2 e Livro 3 | Medio | Calibrar com XP/ameaca oficial |
| Loot por monstro | Implementada/parcial | Motor existe, mas tabelas raras podem mudar | Medio | Testes por monstro e revisao de Livro 3 |
| Variantes, templates, chefes, minions e enxames | Provisorio/parcial | Modelo existe, mas multiplicadores finais podem mudar | Medio | Reauditar quando Livro 3/Guia do Mestre fecharem balanceamento |
| Moral, fuga e comportamento de criatura | Parcial | Estado e teste existem; gatilhos narrativos ainda dependem do mestre | Medio | Completar compendio tatico por criatura |
| Recompensas narrativas de missao | Parcial | Motor registra recompensa, mas entrega automatica em ficha ainda precisa fase propria | Medio | Conectar a Luzentis, itens, XP e aprovacoes |
| Viagem e recursos do Guia do Mestre | Implementada/parcial | Dominio existe; UI ainda usa prompts e listas compactas | Medio | Criar formularios dedicados e controles visuais |
| Hacking e bases/colonias | Implementada/parcial | Motor existe; minissistema visual ainda nao esta completo | Medio | Criar telas dedicadas ou modais completos |

## Regras de Alto Risco de Mudanca

| Regra/conteudo | Risco | Sinal de alerta | Recomendacao |
| --- | --- | --- | --- |
| Catalogo do Livro 5 | Muito alto | Arquivos `official-*` citam fontes com nomes diferentes | Fase 19 de reconciliacao |
| CA das armaduras | Muito alto | Usuario ja apontou que CAs antigas apareciam | Teste automatico por armadura |
| Dano e propriedades de armas | Alto | Exemplo: Rifle de Precisao / Olho de NYX | Conferir texto oficial e campos |
| Chips modificadores | Alto | Trechos incoerentes ja foram citados | Limpar texto e padronizar guia de uso |
| Magias cosmicas | Alto | Slots e aquisicao dependem de regras finais | Modelo de fonte/slot/treino/grimorio |
| Mods passivos | Alto | Afetam ataques, dano, PV, CA, slots | Tabela de efeitos automatizados |
| Crafting | Alto | Existe no sistema, mas adiado | Implementar so depois da tabela final |
| Veiculos | Medio/alto | Podem exigir ficha propria | Fase dedicada |
| Drones e torretas | Medio/alto | Podem agir como criaturas/equipamentos | Fase dedicada |
| Robos e automatos | Medio/alto | Aparecem em Livro 5 e possivelmente Livro 3 | Modelo unificado |
| Faccao e reputacao | Medio | Afeta campanha, recompensa e narrativa | Fase 25 criou modelo; refinar compendio e UI |
| Viagem e ambiente hostil | Medio | Exige recursos e eventos | Fase 25 criou modelo; refinar formularios e automacoes |
| Livro 4 de lore | Medio | Agora tem compendio inicial, mas falta granularidade total | Expandir por capitulo e vincular monstros/itens/cenas |

## Regras que Nao Devem Bloquear o Jogador

| Situação | Decisao atual | Motivo |
| --- | --- | --- |
| Item sem local definido | Apenas aviso visual | O usuario cancelou bloqueio de rolagem |
| Falta de servidor local | App funciona offline | Regra critica do projeto |
| Falta de modelo 3D da HUD | Usa fallback visual | Evita quebrar ficha |
| Dados oficiais incompletos | Mostrar aviso/detalhe parcial | Melhor do que travar uso |
| Aprovacao offline | Autoaprovar/ignorar | Modo offline deve ser fluido |

## Regras que Precisam de Fonte Canonica

Estas areas nao devem ser ajustadas "de cabeca" quando houver nova alteracao. Devem ser extraidas, conferidas e registradas a partir dos livros:

- lista final de racas;
- bonus raciais;
- pericia extra de cada raca;
- chip de profissao;
- todas as pericias;
- tabela de progressao;
- requisitos de evolucao;
- valores de PV, Cosmos, Estresse, CA e Movimento;
- todas as armas;
- todas as armaduras;
- todos os chips modificadores;
- todos os mods;
- todas as magias cosmicas;
- todos os itens;
- todos os cubos e suportes;
- todos os monstros;
- todas as condicoes;
- tabelas de loot.

## Procedimento de Reauditoria

1. Confirmar quais cinco arquivos `.docx` sao oficiais no momento.
2. Extrair texto e tabelas para arquivos temporarios.
3. Comparar nomes, categorias, precos, pesos, danos, CAs, slots, tier/rank e descricoes contra `official-*`.
4. Atualizar a matriz funcional.
5. Atualizar este registro.
6. Criar testes para toda regra que tenha valor numerico oficial.
7. Rodar validacao completa.
8. So depois considerar cache, build, release ou push.
9. Ao concluir uma etapa do projeto, publicar primeiro a versao Web/GitHub Pages para aprovacao beta pelo usuario.
10. Gerar ou publicar executavel do VTT somente depois da aprovacao da versao Web.

## Politica Recomendada

- Regra numerica oficial precisa de teste.
- Regra de ficha precisa funcionar offline antes de ir para VTT.
- Regra sensivel em VTT precisa permissao/aprovacao.
- Texto exibido ao jogador deve ser limpo, sem campos internos como `notes`.
- Descricao detalhada deve explicar uso em jogo, nao apenas copiar trecho bruto.
- Conteudo gerado manualmente deve guardar `source`, `category`, `type`, `tier/rank`, `version` e `migration`.
- Fluxo de entrega atual: Web primeiro para aprovacao; executavel do VTT depois da aprovacao.

## Atualizacao da Fase 19

Data: 2026-06-23.

Regras de governanca que agora estao ativas:

| Regra | Estado | Onde aparece | Risco | Quando reauditar |
| --- | --- | --- | --- | --- |
| Todo arquivo `official-*` deve indicar fonte atual | Implementado parcialmente | `source`, `sources`, `sourceFileCurrent` | Medio | Sempre que livro for renomeado |
| Fonte antiga deve ficar separada da fonte atual | Implementado | `sourceFilePrevious`, `sourceFilesPrevious` | Baixo | Sempre que houver nova compilacao |
| Dado oficial duvidoso deve ter `needsReview` e `reviewReason` | Implementado parcialmente | `official-*` | Medio | Antes de automatizar regra |
| Catalogo do Livro 5 e provisoriamente reconciliado | Provisorio | `official-book5-catalog.js` | Alto | Fase 22 |
| Compendio textual nao e regra automatica | Provisorio/estavel como politica | `official-rulebook-compendium.js` | Medio | Antes de usar texto como mecanica |
| Auditoria deve rodar por script | Implementado | `scripts/audit-official-sources.mjs` | Baixo | Antes de release com dados oficiais |

Termos e fontes antigas encontrados nesta fase:

- `COMPILADO_COMPLETO_FINAL`;
- `CA_armaduras_corrigida`;
- `Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado`;
- `Livro_3_Bestiario_Guerra_Solar_Edicao_Visual`;
- `livro 1 base para jogadores.docx`.

Eles nao devem ser usados como fonte atual. Quando aparecerem, devem estar apenas em campo historico.

## Atualizacao da Fase 24

Data: 2026-06-24.

Regras de bestiario que agora estao ativas:

| Regra | Estado | Onde aparece | Risco | Quando reauditar |
| --- | --- | --- | --- | --- |
| Normalizacao de ficha de monstro | Implementado | `normalizeMonsterEntry` | Medio | Sempre que Livro 3 mudar campos |
| Ataque de monstro com acerto, dano e propriedades | Implementado | `resolveMonsterAttack`, `computeMonsterAttackProfile`, `computeMonsterDamageProfile` | Medio | Quando danos oficiais mudarem |
| Resistencias, imunidades, vulnerabilidades e reducoes | Implementado/parcial | `resistanceProfile` | Medio | Quando fichas oficiais forem revisadas |
| Loot por chance e recursos coletaveis | Implementado/parcial | `resolveMonsterLoot`, `collectMonsterResource` | Medio | Quando tabelas de drops fecharem |
| Moral de criatura | Parcial | `resolveMonsterMoraleCheck` | Medio | Quando comportamento oficial ficar mais detalhado |
| Variantes e templates | Provisorio/parcial | `applyMonsterVariant`, `applyMonsterTemplate` | Alto | Quando balanceamento oficial for fechado |
| Chefes, elites, minions e enxames | Provisorio/parcial | `createBossMonster`, `createEliteMonster`, `createMinionMonster`, `createSwarmMonster` | Alto | Quando Livro 3/Guia do Mestre fecharem multiplicadores |
| Tokens de monstro para VTT | Implementado | `createMonsterTokenDefaults`, `buildSceneToken` | Baixo | Se grade/tamanho mudar |
| Ameaca de encontro | Provisorio/parcial | `estimateMonsterThreat`, `estimateEncounterThreat` | Alto | Quando XP/ameaca oficial for calibrada |

## Atualizacao da Fase 25

Data: 2026-06-24.

Regras do Guia do Mestre que agora estao ativas:

| Regra | Estado | Onde aparece | Risco | Quando reauditar |
| --- | --- | --- | --- | --- |
| Missoes, objetivos, fases e complicacoes | Implementado/parcial | `solaris-gm-rules.js`, aba Campanha | Medio | Quando Livro 2 mudar estrutura de missao |
| Recompensas por risco | Provisorio/parcial | `computeMissionReward`, `applyMissionReward` | Alto | Quando economia/XP forem calibrados |
| Viagem, terreno, ritmo e eventos | Implementado/parcial | `createTravelRoute`, `resolveTravelEvent` | Medio | Quando eventos oficiais mudarem |
| Recursos e pressao logistica | Implementado/parcial | `createResourceTrack`, `computeResourcePressure` | Medio | Quando regras de carga/suprimentos mudarem |
| Faccoes e reputacao | Implementado/parcial | `createFactionState`, `updateFactionReputation` | Medio | Quando Livro 4/Livro 2 consolidarem faccoes |
| Hacking | Implementado/parcial | `createHackingChallenge`, `advanceHackingChallenge` | Alto | Quando SR, RAM, ICE ou ERROR 403 forem revisados |
| Bases e colonias | Implementado/parcial | `createBaseState`, `advanceBaseProject` | Alto | Quando ciclos/projetos/oficinas forem fechados |
