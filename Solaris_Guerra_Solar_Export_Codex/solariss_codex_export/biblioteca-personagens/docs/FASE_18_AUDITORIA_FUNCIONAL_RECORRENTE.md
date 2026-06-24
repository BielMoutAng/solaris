# Solaris Guerra Solar - Fase 18: Auditoria Funcional Recorrente

Esta auditoria reflete o estado dos livros e do app na data/cache atual. Como as regras de Guerra Solar ainda estão em desenvolvimento, esta matriz deve ser revisada sempre que os livros oficiais forem alterados.

## Escopo

Data da auditoria: 2026-06-22.

Estado auditado do app:

- Cache publico atual: `20260622f`.
- Solaris Tabletop Alpha: `0.6.0-alpha.13`.
- Solaris Biblioteca e PWA mantidos como app principal de ficha/biblioteca.
- Solaris Tabletop Alpha separado como VTT/mesa virtual local.
- Nenhuma alteracao de runtime foi feita nesta fase.
- Nenhum cache ou versao foi atualizado nesta fase.

Fontes oficiais usadas como base:

- `C:\Users\Gabriel\Desktop\Solaris\livros de regras\versao final\Livro 1 base do jogador.docx`
- `C:\Users\Gabriel\Desktop\Solaris\livros de regras\versao final\Livro_2_Guia_do_Mestre_rifles_corrigido.docx`
- `C:\Users\Gabriel\Desktop\Solaris\livros de regras\versao final\Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx`
- `C:\Users\Gabriel\Desktop\Solaris\livros de regras\versao final\Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx`
- `C:\Users\Gabriel\Desktop\Solaris\livros de regras\versao final\Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`

## Metodologia

A auditoria foi feita por comparacao funcional entre:

- capitulos, tabelas e sistemas descritos nos cinco livros oficiais;
- codigo do app em `app.js`, `src/domain`, `src/session`, `server`, Electron e service worker;
- documentacao de fases anteriores;
- testes automatizados existentes em `tests/`;
- comportamento esperado para Biblioteca offline, PWA/iPhone e Tabletop Alpha no PC.

Cada regra foi classificada como:

- **Implementada**: existe no app com fluxo utilizavel e teste ou codigo claro.
- **Parcial**: existe, mas cobre apenas parte da regra oficial ou usa simplificacao.
- **Provisoria**: existe para manter o jogo fluindo, mas ainda depende de consolidacao dos livros.
- **Ausente**: nao ha fluxo funcional suficiente no app.
- **Divergente**: existe, mas pode estar desalinhada com o livro oficial atual.
- **Instavel**: depende de regra ainda mutavel ou de catalogo com fonte desatualizada.

## Resultado Geral

O projeto esta em um ponto bom: a ficha offline e a primeira VTT estao funcionais, com uma arquitetura ja separando dominio, sessao, persistencia, servidor e UI. O maior risco agora nao e falta de estrutura; e governanca de regra. Os livros mudaram varias vezes, e algumas bases de dados do app ainda apontam para nomes antigos de documentos oficiais.

Principais blocos bem implementados:

- ficha local/offline com `localStorage`, exportacao e importacao;
- bibliotecas de itens, armas, armaduras, chips, mods, magias, regras e bestiario;
- compra, venda, exclusao, inventario fisico e aviso de item sem local definido;
- cubos, mochilas, coldres, bandoleiras, ganchos e peso de cubo em `1kg`;
- rachaduras por item;
- municao, carregadores, fontes de alimentacao, recarga, rajada, pump e cubo de municao;
- dados, iniciativa, testes, ataques, dano, cura, condicoes e chat;
- monstros com ficha jogavel, dano, condicoes, loot e adicao a sessao;
- VTT com sala, jogadores, chat, rolagens, combate, mapa tatico, alvos, areas, loja, distribuicao, painel do mestre e persistencia;
- separacao entre Solaris Biblioteca e Solaris Tabletop Alpha;
- visual desktop-first do Tabletop preservando layout mobile/PWA.

Principais blocos que precisam de fase propria:

- reconciliar de forma automatizada os cinco livros oficiais atuais com os arquivos `official-*`;
- completar criacao de personagem guiada segundo Livro 1;
- completar progressao de nivel, requisitos e escolhas oficiais;
- revisar todas as racas, bonus, pericia extra e habilidades raciais;
- revisar todos os chips de profissao, chips modificadores, magias e passivos;
- completar ferimentos, morte, estabilizacao, criticos, erros criticos e lesoes;
- implementar crafting completo;
- implementar viagem, ambiente hostil, sobrevivencia, faccoes e reputacao;
- completar veiculos, drones, torretas, robos e automatos;
- transformar Livro 4 em banco navegavel de lore/cenarios/campanha.

## Livro 1 - Base do Jogador

### Criacao de Personagem

Status: **Parcial / Provisorio**.

O app tem criacao de ficha, importacao/exportacao, campos de personagem, raca, profissao, nivel, atributos, pericias e equipamento. Tambem tem guia de criacao, rolagem de atributos iniciais e criacao manual de conteudos.

Gaps:

- a criacao ainda nao e um wizard completo e blindado com todas as etapas oficiais do livro;
- beneficios raciais e pericia extra precisam de reconciliacao contra a versao atual do Livro 1;
- escolhas de progressao e requisito por nivel precisam ser mais guiadas;
- equipamento inicial precisa ser validado contra os pacotes oficiais mais recentes.

Prioridade: **P0/P1**, porque afeta todo personagem novo.

### Racas Jogaveis

Status: **Parcial / Risco de divergencia**.

O app ja possui racas jogaveis, paginas de raca, bonus e habilidades. O historico do projeto ja tratou Humanis e outras racas, mas a auditoria marca essa area como sensivel porque o livro oficial mudou e o usuario apontou anteriormente problema com pericia extra do Humanis.

Gaps:

- validar bonus finais de todas as racas contra Livro 1 atual;
- registrar pericia extra em formato estruturado;
- garantir que bonus passivos entram automaticamente na ficha e na sessao;
- atualizar detalhes oficiais em duplo clique quando houver texto completo.

Prioridade: **P0**.

### Atributos, Pericias e Jogadas de Protecao

Status: **Implementado / Parcial**.

O app usa atributos `FOR`, `REF`, `CON`, `MEN`, `PRE`, `INT`, base `7`, limite ate `20` e modificador por `INT((valor - 10) / 2)`. As pericias foram organizadas por atributo, e Constituicao foi retirada da area de pericias/protecao conforme pedido anterior. As jogadas de protecao foram ajustadas para JPF, JPR e JPC.

Gaps:

- conferir nomes finais e descricoes completas de cada pericia contra Livro 1;
- validar todos os calculos de pericia, perito e ignorante;
- garantir que o jogador possa ter quantas ignorancias quiser, sem limite indevido;
- revisar se JPF usa escolha situacional entre FOR e CON em todas as telas.

Prioridade: **P1**.

### Testes, Rolagens e Estresse

Status: **Implementado / Provisorio**.

O app possui rolagens comuns, iniciativa, testes por atributo/pericia/protecao, bonus situacional, vantagem/desvantagem, chat de rolagem e animacao holografica. O historico registra que item sem local definido virou apenas aviso visual e nao bloqueia rolagens.

Gaps:

- consolidar mecanica oficial de estresse, colapso, bencao/falha cosmica e saturacao;
- validar quando usar `3d6`, `2d6`, `4d6`, `1d20` e pools especiais;
- padronizar mensagens de resultado com os nomes oficiais do Livro 1.

Prioridade: **P1**.

### Combate, Dano, Cura e Condicoes

Status: **Parcial / Funcional**.

O app e a VTT ja possuem iniciativa, combatentes, turno, rodada, dano, cura, condicoes, ataques, dano de monstro, alvos e areas. Existe painel visual de combate e log.

Gaps:

- completar lista oficial de acoes em combate, fora de combate, cenas e timeskip;
- implementar ferimentos, morte, estabilizacao, criticos, erros criticos e lesoes em fluxo completo;
- revisar cobertura, movimento, alcance, reacao e defesa contra texto final;
- padronizar condicoes com duracao, fonte, encerramento e efeitos automaticos.

Prioridade: **P0/P1**.

### Inventario, Carga e Luzentis

Status: **Implementado / Parcial**.

O app usa Luzentis, compra/venda, suporte de armazenamento, item sem local definido como aviso e peso fora de cubo. Cubos pesam `1kg`. Equipado nao pesa conforme regra local desejada.

Gaps:

- revisar formula de carga maxima com Livro 1 e Livro 2;
- revisar todos os suportes fisicos: mochila, coldre, bandoleira, gancho e cubo;
- deixar claro o que pesa, o que nao pesa e o que apenas ocupa local;
- validar regras de cubo simples, cubo de carga e cubo especializado.

Prioridade: **P1**.

## Livro 2 - Guia do Mestre

Status geral: **Parcial / Provisorio**.

O app ja cobre varias ferramentas de mestre: sala, combate, iniciativa, monstros, painel do mestre, cenas, relatorios, distribuicao de itens, loja, encontros, balanceamento estimado e persistencia. Porem Livro 2 parece conter muitos sistemas de condução e campanha que ainda estao apenas representados por ferramentas genericas.

Implementado ou iniciado:

- painel do mestre;
- notas e historico de sessao;
- cenas, mapas e tokens;
- encontro e estimativa de balanceamento;
- logs, eventos e relatorios;
- permissao/aprovacao basica de mesa;
- distribuicao de itens e loot;
- loja e economia em fluxo funcional.

Gaps:

- viagens, exploracao e ambiente hostil;
- reputacao, faccoes, recompensas e consequencias;
- tabela de dificuldades e escalas de perigo consolidadas;
- hacking/tecnologia avancada;
- bases, oficinas, reparos e operacoes longas;
- geradores de missao, eventos e complicacoes;
- integracao narrativa com Livro 4.

Prioridade: **P1/P2**.

## Livro 3 - Bestiario

Status geral: **Implementado / Parcial**.

O bestiario existe no app, com monstros, imagens, ficha jogavel, ataques, dano, condicoes, loot e adicao a sessao. A VTT permite adicionar monstros ao combate e usar dano/turnos.

Gaps:

- validar se todos os monstros do Livro 3 estao presentes e com campos completos;
- conferir dano, CA, PV, movimento, sentidos, resistencias, vulnerabilidades e habilidades;
- adicionar comportamento, taticas, ecologia, habitat e uso narrativo quando houver;
- implementar templates/variantes/boss de forma estruturada se o livro pedir;
- exportar armas, habilidades e magias para fichas de monstro com governanca.

Prioridade: **P1**.

## Livro 4 - Cenarios e Historia

Status geral: **Ausente / Parcial como compendio**.

O app tem aba de livros/regras e pode exibir conteudo, mas o Livro 4 ainda nao virou uma ferramenta forte de mesa. O ideal e transformar o livro em banco navegavel de lore, locais, faccoes, NPCs, eventos, linha do tempo e ganchos.

Gaps:

- catalogo de locais/cenarios;
- faccoes e relacoes;
- NPCs importantes;
- linhas do tempo e eventos;
- ganchos de missao;
- busca por tags;
- ligacao entre cenas do VTT e entradas de lore.

Prioridade: **P2**.

## Livro 5 - Itens, Equipamentos e Habilidades

Status geral: **Implementado / Alto risco de fonte divergente**.

O app tem catalogos, filtros, detalhes por duplo clique, loja, inventario, passivos, mods, chips, armas, armaduras, itens, cubos, municao, carregadores, rachaduras e loot. Essa e uma das partes mais ricas do sistema.

Risco principal:

- os arquivos de dados oficiais no app ainda citam fontes com nomes diferentes dos documentos oficiais atuais. O auditado atual aponta para `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`, enquanto alguns arquivos `official-*` mencionam nomes anteriores como `CA_armaduras_corrigida`, `COMPILADO_COMPLETO_FINAL` ou `livro 5 tabelas`.

Gaps:

- reconciliar automaticamente Livro 5 atual contra `official-book5-catalog.js`;
- remover notas internas como `notes` quando aparecem ao jogador sem sentido;
- padronizar descricoes detalhadas como guia de uso, nao apenas trecho bruto;
- validar armas com trecho oficial fiel, incluindo casos como Rifle de Precisao / Olho de NYX;
- revisar chips modificadores com trechos incoerentes e limpar referencias erradas;
- completar crafting;
- completar veiculos, drones, torretas, robos e automatos;
- revisar armaduras, CA, ganchos, slots, rachaduras e reparo contra a versao final.

Prioridade: **P0/P1**.

## Arquitetura e Persistencia

Status: **Implementado / Boa base**.

Ha separacao clara entre:

- ficha/biblioteca offline;
- dominio reutilizavel;
- cliente de sessao;
- UI de sessao;
- persistencia de sessao/campanha;
- servidor WebSocket;
- Electron da ficha;
- Electron do VTT.

Essa base e boa para evoluir sem quebrar o modo offline. A recomendacao e continuar colocando regra pura em `src/domain` e usar adaptadores para UI, VTT, servidor e persistencia.

## Top 10 Lacunas Criticas

1. **Fonte oficial divergente nos catalogos**: arquivos `official-*` citam nomes de livros diferentes dos livros oficiais atuais.
2. **Criacao de personagem ainda incompleta**: precisa virar wizard oficial completo.
3. **Racas e pericia extra**: precisa reconciliar bonus e automatismos finais.
4. **Progressao de nivel**: precisa consolidar requisitos, escolhas e aplicacao automatica.
5. **Ferimentos, morte, criticos e lesoes**: ainda nao parecem completos.
6. **Condicoes oficiais**: precisam efeitos automaticos, duracao e encerramento padronizados.
7. **Livro 5 completo**: armas, armaduras, mods, chips, magias e descricoes ainda precisam revisao fiel.
8. **Crafting**: citado nos livros e no historico, mas ainda nao implementado de forma completa.
9. **Sistemas de campanha do Livro 2**: viagem, ambiente, faccoes, reputacao e recompensas ainda estao parciais.
10. **Livro 4**: precisa virar compendio navegavel e integrado a cenas/campanhas.

## P0 e P1 Recomendados

P0:

- reconciliar fontes oficiais atuais;
- validar racas, bonus, pericia extra e chips de profissao;
- revisar Livro 5 completo contra catalogos do app;
- completar regras que afetam rolagem, dano, cura, morte e condicoes.

P1:

- criacao de personagem guiada;
- progressao de nivel;
- inventario/carga/cubos/suportes;
- bestiario completo e ficha de monstro;
- loja, compra, venda, aprovacao e distribuicao em sessao;
- testes automatizados de regressao contra dados oficiais.

## Proximas Fases Sugeridas

Fase 19 - Reconciliacao oficial de dados:

- extrair livros atuais;
- gerar relatorio de diferencas;
- atualizar fontes `official-*`;
- criar testes de catalogo.

Fase 20 - Criacao e progressao oficial de personagem:

- wizard completo;
- validacoes;
- pericia extra;
- escolhas por nivel;
- equipamento inicial.

Fase 21 - Combate oficial completo:

- acoes, reacoes, cobertura, movimento;
- ferimentos, morte, estabilizacao;
- criticos, erros criticos e lesoes;
- condicoes automaticas.

Fase 22 - Livro 5 completo:

- armas, armaduras, mods, chips, magias, itens e crafting;
- descricoes padronizadas;
- passivos e efeitos automaticos.

Fase 23 - Bestiario oficial completo:

- campos finais;
- comportamento;
- loot;
- variantes;
- exportacao para VTT.

Fase 24 - Guia do Mestre:

- faccoes, reputacao, viagem, recursos, encontros, recompensas e eventos.

Fase 25 - Livro 4:

- lore navegavel;
- locais, NPCs, faccoes e linha do tempo;
- integracao com cenas e campanhas.

## Quando Repetir Esta Auditoria

Repetir sempre que:

- qualquer livro oficial for renomeado, corrigido ou recompilado;
- Livro 5 mudar tabelas de armas, armaduras, itens, chips ou magias;
- Livro 1 mudar criacao, racas, atributos, progressao ou combate;
- Livro 3 mudar estatisticas de monstros;
- uma nova fase alterar runtime de regras;
- antes de publicar uma nova alpha para amigos.

## Validacao Desta Fase

Como esta fase e documental, nao houve alteracao de runtime. A validacao esperada e:

- testes automatizados continuam passando;
- `node --check` nos arquivos principais continua sem erro;
- cache permanece `20260622f`;
- versao do Tabletop permanece `0.6.0-alpha.13`;
- GitHub nao recebe commit/push.

## Conclusao

O app ja tem um esqueleto forte e varias mecanicas jogaveis. O passo mais importante agora e transformar a relacao com os livros em processo recorrente: cada regra precisa saber de qual livro veio, se e estavel, se e provisoria e onde aparece no app. Isso evita retrabalho e prepara o Solaris para virar uma mesa virtual propria com a mesma confianca de uma ficha oficial.
