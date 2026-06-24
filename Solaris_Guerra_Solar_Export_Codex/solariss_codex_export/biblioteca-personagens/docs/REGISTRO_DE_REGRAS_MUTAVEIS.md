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
| Iniciativa `1d20 + MOD REF` | Implementado | ficha/VTT | Baixo | Se combate mudar |
| Ataques com `1d20 + modificador` | Implementado/parcial | ficha/VTT | Medio | Se armas ou combate mudar |
| Luzentis como dinheiro | Implementado | loja/inventario | Baixo | Se economia mudar nome/moeda |
| Cubo pesa `1kg` | Implementado | `CUBE_WEIGHT_KG` | Medio | Se Livro 5 mudar carga/cubos |
| Item sem local definido nao bloqueia rolagem | Implementado | inventario/dados | Baixo | Se regra de carga mudar |
| Offline com `localStorage` | Implementado | app principal | Baixo | A cada mudanca de persistencia |
| Separacao Biblioteca/Tabletop | Implementado | Electron/scripts | Baixo | A cada build de desktop |

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
| Progressao de nivel | Parcial | Requisitos, custos e escolhas ainda sensiveis | Alto | Wizard de evolucao |
| Carga maxima | Parcial | Interage com peso, cubos e suportes | Medio | Testes de limite e sobrecarga |
| Loja em sessao | Implementada/parcial | Compra/venda/exclusao dependem de aprovacao | Medio | Cobrir todos fluxos sensiveis |
| Condicoes | Parcial | Falta efeito automatico completo | Alto | Modelo oficial por condicao |
| Ferimentos, morte e estabilizacao | Parcial/ausente | Impacta combate e queda a 0 PV | Alto | Fase de combate oficial |
| Criticos e erros criticos | Parcial | Pode gerar lesoes e consequencias | Alto | Tabelas/efeitos automatizados |
| Balanceamento de encontro | Provisorio | Formula de mesa depende de Livro 2 | Medio | Calibrar com XP/ameaça |
| Loot por monstro | Parcial | Tabelas de Livro 3 precisam fechar | Medio | Testes por monstro |

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
| Faccao e reputacao | Medio | Afeta campanha, recompensa e narrativa | Fase do Guia do Mestre |
| Viagem e ambiente hostil | Medio | Exige recursos e eventos | Fase do Guia do Mestre |
| Livro 4 de lore | Medio | Nao e so texto, precisa navegacao | Compendio por tags |

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

## Politica Recomendada

- Regra numerica oficial precisa de teste.
- Regra de ficha precisa funcionar offline antes de ir para VTT.
- Regra sensivel em VTT precisa permissao/aprovacao.
- Texto exibido ao jogador deve ser limpo, sem campos internos como `notes`.
- Descricao detalhada deve explicar uso em jogo, nao apenas copiar trecho bruto.
- Conteudo gerado manualmente deve guardar `source`, `category`, `type`, `tier/rank`, `version` e `migration`.

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
