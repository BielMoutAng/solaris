# Auditoria dos Livros 1 e 2 contra o Sistema Solaris

Data da auditoria: 6 de junho de 2026

Documento oficial analisado:

- `Livro_1_Basico_do_Jogador_Guerra_Solar_formatado (1).docx`
- `Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado.docx`

Aplicativo analisado:

- `biblioteca-personagens`
- Versao aberta durante a auditoria: `http://127.0.0.1:8787/?check=20260605b`

## Legenda

- **Alinhado**: a regra ou funcionalidade corresponde aos livros analisados.
- **Parcial**: existe no aplicativo, mas falta parte da regra ou da automacao.
- **Divergente**: existe, mas usa uma regra diferente da publicada nos livros.
- **Ausente**: nao existe como campo, ferramenta, regra consultavel ou automacao.
- **Fora do escopo**: existe no aplicativo, mas os livros analisados enviam os detalhes para outro volume; nao e possivel validar por completo com os Livros 1 e 2.

## Resumo executivo

O aplicativo ja e uma boa biblioteca e gerenciador de fichas: salva personagens, possui criacao guiada, inventario, compras, cubos, equipamentos, magias, chips, rolagens, HUD e exportacao.

O Livro 2 confirma grande parte das regras centrais identificadas no Livro 1 e amplia o sistema com ferramentas de Mestre, missoes, faccoes, monstros, encontros, hacking, bases, economia dinamica, consequencias e modelos de mesa. Ele resolve algumas ambiguidades do Livro 1, mas tambem introduz novas diferencas entre os livros e algumas contradicoes internas.

As maiores divergencias mecanicas sao:

1. Ataques deveriam usar `1d20`, mas o aplicativo usa o perfil de `3d6`, `2d6` ou `4d6`.
2. Iniciativa deveria usar `1d20 + MOD REF`, mas o aplicativo usa o perfil atual da Triade.
3. O calculo de PV nao corresponde nem a tabela de PV inicial do Capitulo 4 nem a formula de progressao do Capitulo 39.
4. O Livro 1 usa JPF, JPR e JPC; o aplicativo ainda usa JPF, JPR e JPV.
5. O aplicativo ainda possui Saturacao e a regra de `4d6`, que nao aparecem no novo Livro 1.
6. As quatro racas existem, mas seus bonus, tracos, fraquezas e progressoes ainda sao majoritariamente de uma versao anterior.
7. Faltam tres pericias oficiais: Performance, Atuacao e Busca.
8. O personagem novo deveria iniciar com 2.000 Luzentis e equipamento basico, mas o aplicativo inicia com dinheiro e inventario zerados.

## 1. O que ja existe no sistema

### Estrutura e armazenamento

1. **Biblioteca local de personagens**: criar, salvar, carregar, duplicar e excluir fichas.
2. **Armazenamento local**: fichas salvas no `localStorage` do navegador.
3. **Importacao e exportacao em JSON**.
4. **Impressao da ficha**.
5. **PWA instalavel** e estrutura de aplicativo para Windows.
6. **Estrutura preparada para Foundry** em registros de rolagem, com `schemaVersion`, `system` e metadados de iniciativa.

### Identidade e criacao

7. Campos de nome, jogador, raca, atributo racial, profissao, nivel e origem.
8. Foto do personagem por clique ou arrastar e soltar.
9. Quatro racas selecionaveis: Humanis, Zerak, Veyrkan e Kairi.
10. Pagina individual de cada raca.
11. Lista de 35 profissoes, alem do marcador inicial "Escolha uma profissao".
12. Guia de criacao em dez passos.
13. Checklist final de criacao.
14. Rolador inicial de `7d6`, descarte do menor e distribuicao dos seis dados.
15. Aplicacao automatica de `7 + dado` em cada atributo.
16. Limite de nivel de 1 a 10.

### Atributos, pericias e protecoes

17. Seis atributos oficiais: FOR, REF, CON, MEN, PRE e INT.
18. Valor base 7 para todos os atributos.
19. Limite de atributo ate 20.
20. Modificador calculado pela progressao oficial: 7 = -2, 8-9 = -1, ate 20 = +5.
21. Testes clicaveis de atributo.
22. Vinte e tres pericias cadastradas e organizadas por atributo.
23. Marcadores individuais de Perito e Ignorante.
24. Perito aplica vantagem e Ignorante aplica desvantagem nas rolagens.
25. JPF com escolha entre FOR e CON.
26. JPR com REF.
27. Campo para bonus situacional.
28. Seletor manual de rolagem normal, vantagem ou desvantagem.

### Recursos e derivados

29. PV atual e PV maximo no formato atual/maximo.
30. Cosmos atual e Cosmos maximo.
31. Estresse.
32. Saturacao, embora este recurso nao esteja no novo Livro 1.
33. CA, movimento, cubos e perfil atual de dados no resumo.
34. Calculo automatico de Cosmos por nivel e MOD MEN.
35. Calculo automatico de movimento por `6 + MOD REF`.
36. Calculo automatico de cubos por `5 + MOD FOR`, com ajustes de profissao, raca e mods.
37. HUD vital Humanis em janela aberta pela area de resumo.

### Equipamentos e inventario

38. Aba de equipamentos do personagem.
39. Inventario com armas, armaduras, itens e cubos.
40. Equipar e desequipar armas.
41. Equipar e desequipar armaduras.
42. Adicionar e remover chips modificadores.
43. Painel para ganchos, coldres e bandoleiras.
44. Vinculo de itens a suportes externos.
45. Um equipamento de combate exibido com esboco por grupo de arma.
46. Botao de ataque da arma equipada.
47. Botao de dano da arma equipada.
48. Marcador visual de rachadura de 0 a 10.
49. Aparencia quebrada ao atingir a rachadura maxima.
50. Aplicacao automatica de varios bonus passivos reconhecidos nos chips modificadores.
51. Pagina unica de habilidades reunindo raca, profissao, arma, armadura, Cosmos e chips.

### Cubos

52. Cubo simples com capacidade de um item.
53. Cubo de carga bloqueado ao primeiro item exato inserido.
54. Cubo especializado bloqueado a categoria do primeiro item inserido.
55. Arrastar item para dentro do cubo.
56. Abrir o interior do cubo por duplo clique ou botao.
57. Retirar item do cubo.
58. Cor de ocupacao indo de verde a vermelho.
59. Peso de 10 kg por cubo.
60. Monitor de quantidade e peso dos cubos.
61. Criador manual dos tres tipos de cubo.

### Bibliotecas

62. Biblioteca com 175 itens importados da tabela central anterior.
63. Biblioteca com 16 armas.
64. Biblioteca com 11 armaduras.
65. Biblioteca com 65 magias cosmicas.
66. Biblioteca com 76 chips modificadores.
67. Biblioteca com quatro modelos simples de monstros.
68. Busca, filtro por tier/rank/custo e ordenacao alfabetica ou por preco.
69. Detalhes de cada registro abertos ao clicar no nome.
70. Imagem em conteudo criado manualmente.
71. Modelos de formulario diferentes para item, arma, armadura, magia, chip e monstro.

### Economia

72. Moeda exibida como Luzentis com simbolo `ℓ`.
73. Compra com verificacao de saldo.
74. Debito automatico ao comprar.
75. Item comprado enviado ao inventario.
76. Venda de item.
77. Valor de venda editavel.

### Mods e Cosmos

78. Soma dos slots de mods da arma e armadura equipadas.
79. Bloqueio de novos chips quando nao ha slot.
80. Aviso visual de sobrecarga tecnologica.
81. Soma de espacos de magia vindos de arma, armadura, chips, treino e grimorios.
82. Bloqueio de magia quando nao ha espaco.
83. Aviso visual cosmico quando nao ha espaco.
84. Pagina de magias e chips conhecidos.

### Dados e mesa

85. Rolador livre de d4, d6, d8, d10, d12, d20 e d100.
86. Escolha de quantidade de dados e bonus.
87. Animacao holografica dos dados sobre a tela.
88. Chat local com historico das ultimas rolagens.
89. Rolagens de atributos, pericias, protecoes, iniciativa, ataque e dano.
90. Vantagem e desvantagem por duas rolagens completas, escolhendo a melhor ou pior.
91. Referencia resumida das faixas 3-9, 10-14 e 15+.
92. Biblioteca com 18 acoes sugeridas para combate, cena, timeskip e fora de combate.

## 2. Partes alinhadas ao Livro 1

1. Os atributos oficiais e suas siglas estao corretos.
2. O valor base 7 dos atributos esta correto.
3. A tabela de modificadores de atributo esta correta, incluindo atributo 20 = +5.
4. A rolagem inicial de `7d6`, descarte do menor e distribuicao dos seis restantes esta correta.
5. O limite padrao de nivel 10 esta correto.
6. A quantidade de quatro racas jogaveis esta correta.
7. A maior parte dos nomes das profissoes do Capitulo 8 esta presente.
8. Testes comuns usam `3d6 + modificador + bonus situacional`.
9. As faixas de falha, sucesso parcial e sucesso completo estao registradas corretamente na biblioteca de regras.
10. Vantagem e desvantagem usam duas rolagens completas e escolhem o melhor ou pior resultado.
11. Pericia treinada concede vantagem.
12. Ignorancia concede desvantagem.
13. JPF permite FOR ou CON.
14. JPR usa REF.
15. Cosmos por nivel e MOD MEN segue a tabela do livro.
16. Movimento base segue `6 m + MOD REF`.
17. Cubos iniciais seguem `5 + MOD FOR`.
18. Cada cubo pesa 10 kg.
19. Cubo simples guarda um item.
20. Cubo de carga aceita unidades do mesmo item.
21. Cubo especializado aceita itens da mesma categoria.
22. Luzentis e o simbolo `ℓ` estao padronizados.
23. Compra por preco cheio, verificacao de saldo e debito automatico estao de acordo com a logica economica basica.
24. O aplicativo permite registrar arma, armadura, cubos, mods, magias, rachaduras e recursos, que sao elementos centrais do livro.

## 3. O que existe, mas diverge do Livro 1

### Regras centrais

1. **Ataques**: o livro determina `1d20 + modificador` contra CA. O aplicativo abre o mesmo teste de `3d6/2d6/4d6` usado pelas pericias.
2. **Iniciativa**: o livro determina `1d20 + MOD REF`. O aplicativo usa `3d6`, `2d6` em Colapso ou `4d6` com Saturacao.
3. **Iniciativa situacional**: faltam os ajustes de +2 para emboscada preparada e -2 para personagem surpreso ou desprevenido.
4. **PV inicial**: o livro usa uma tabela propria por MOD CON, com 6, 7, 8, 12, 14, 16, 18 ou 20 PV antes de bonus racial. O aplicativo usa `8 * nivel + MAX(0, MOD CON) * nivel`.
5. **PV com CON negativa**: o aplicativo nunca reduz PV por MOD CON negativo, contrariando a tabela do Capitulo 4.
6. **PV em niveis maiores**: a formula do aplicativo tambem nao corresponde a formula recomendada no Capitulo 39.
7. **CA**: o livro usa `4 + MOD REF + armadura + bonus racial + mods + cobertura`. O aplicativo usa o campo `race.ca` como base inteira; Zerak recebe base 6 e Kairi base 3 sem que o Livro 1 conceda esses valores.
8. **Cobertura**: o aplicativo nao possui controle direto de meia cobertura +2 ou cobertura pesada +4.
9. **Estresse maximo**: o Livro 1 define trilha padrao de 0 a 6. O aplicativo permite 0 a 7 antes de bonus de mods.
10. **Saturacao**: o aplicativo possui Saturacao 0-10, mas o novo Livro 1 nao usa esse recurso.
11. **Rolagem de 4d6**: o aplicativo concede 4d6 com Saturacao maxima. Essa regra nao existe no Livro 1.
12. **Colapso**: o aplicativo troca para 2d6, mas nao classifica automaticamente 2-9 como falha, 10-11 como parcial e 12 natural como sucesso extremo.
13. **Bencao Cosmica**: aparece como texto de referencia, mas o aplicativo nao detecta automaticamente a ordem exata 4, 5, 6 nem guarda/aplica o bonus.
14. **Falha Cosmica**: aparece como texto, mas o aplicativo nao detecta automaticamente a ordem exata 3, 2, 1 nem aplica a consequencia.
15. **Critico em teste comum**: o Livro 1 tambem define triplo 6 e triplo 1 em testes de 3d6; o aplicativo nao reconhece esses resultados.

### Pericias e protecoes

16. **Pericias faltando**: Performance, Atuacao e Busca com INT nao estao cadastradas.
17. **Pes Ageis**: o aplicativo inclui performance artistica dentro de Pes Ageis, mas o novo livro separa Performance como pericia de PRE.
18. **Jogada Cosmica**: o Livro 1 usa JPC, com escolha entre MEN e PRE. O aplicativo usa JPV apenas com PRE.
19. **Quantidade de pericias treinadas**: o guia fala em duas, mas o aplicativo permite marcar qualquer quantidade sem limite ou aviso.
20. **Ignorancia**: o livro trata uma ignorancia adicional como opcao do mestre para ganhar outra pericia; o aplicativo nao controla essa troca.
21. **Foco de profissao**: os focos `+1` sao exibidos, mas nao entram automaticamente na maior parte dos testes e ataques.
22. **Kit adequado**: o livro permite vantagem ou remocao de penalidade; o aplicativo guarda os kits como texto, sem aplicacao automatica.
23. **Ajuda**: o bonus padrao de +1 ou vantagem por ajuda decisiva nao possui ferramenta propria.

### Racas

24. **Humanis**: o bonus de +1 em qualquer atributo esta correto, mas os tracos e a fraqueza do aplicativo sao antigos. O livro usa Adaptabilidade Humana, Gente de Sistema e Sem Especializacao Natural.
25. **Zerak**: o livro concede +1 em FOR ou CON e +2 PV no nivel 1. O aplicativo concede +2 em FOR ou CON, -1 REF, CA base 6 e outra fraqueza.
26. **Veyrkan**: o livro concede +1 em MEN ou INT, infravermelho limitado, Leitura de Padroes, Anfibio Parcial e Secura Corporal. O aplicativo oferece +1 PRE ou REF e usa um conjunto racial anterior.
27. **Kairi**: o livro concede +1 em MEN ou PRE, visao de penumbra, Escutar o Mundo, Freio do Ciclo e Peso do Desrespeito. O aplicativo oferece +1 REF ou MEN, +2 Cosmos e uma fraqueza de saciedade.
28. **Progressoes raciais por nivel**: o aplicativo possui progressoes LV1 a LV10 que nao aparecem como regras raciais no novo Livro 1.
29. **Visao e idiomas raciais**: sao mostrados apenas como texto parcial ou antigo e nao entram na ficha como campos mecanicos.

### Profissoes

30. **Piloto**: existe como profissao completa no aplicativo, mas o Capitulo 8 apenas cita Piloto e nao fornece ficha detalhada ou linha na tabela rapida.
31. **Medico, Eletricista e especialistas de arma**: o aplicativo usa o termo antigo "acao bonus"; o Livro 1 usa "acao simples".
32. **Medium**: o talento do livro pode dar +1 no proximo teste de MEN ou PRE; o aplicativo restringe a PRE.
33. **Atirador de Elite**: o livro usa foco em armas longas; o aplicativo usa foco em Maos Leves.
34. **Guarda Interestelar**: o livro indica Busca/seguranca; o aplicativo usa Percepcao Cosmica.
35. **Musico**: o livro usa Performance; o aplicativo mapeia o foco para Pes Ageis.
36. **Artista**: o livro usa Atuacao ou Performance; o aplicativo mapeia para Persuasao.
37. **Catador de Sucatas**: o livro usa Busca; o aplicativo mapeia para Busca Cosmica.
38. **Perito em Rifles de Precisao**: o livro concede +1 no proximo ataque no alcance maximo; o aplicativo registra +3. Kit e penalidade tambem usam versoes anteriores.
39. **Perito em Martelos**: o livro pede JPF com CON CD 12; o aplicativo registra teste de MEN CD 12. A penalidade do livro concede +1 para acertar, enquanto o aplicativo registra vantagem.
40. **Perito em Adagas**: o livro usa JPF com FOR ou CON; o aplicativo ainda registra "JR de FOR".
41. **Kits, talentos e penalidades**: sao exibidos e reunidos na pagina de habilidades, mas quase todos dependem de controle manual.
42. **Kit inicial da profissao**: nao e adicionado automaticamente ao inventario ao escolher o chip.

### Inventario, carga e economia

43. **Dinheiro inicial**: o livro determina 2.000 Luzentis. A ficha nova inicia com 0.
44. **Equipamento inicial**: o livro concede arma Tier F, armadura Tier F, kit de suprimento, kit da profissao e cubos. O inventario novo inicia vazio.
45. **Cubos iniciais**: o valor calculado aparece no resumo, mas os cubos fisicos nao sao criados automaticamente.
46. **Mochila Leve**: o livro concede suporte para ate cinco cubos; o aplicativo nao possui esse item inicial nem essa regra como suporte principal.
47. **Carga maxima**: o livro usa metade do peso corporal + `MOD FOR * 10 kg`. O aplicativo usa quantidade maxima de cubos vezes 10 kg.
48. **Peso corporal**: nao existe campo para calcular a carga oficial.
49. **Sobrecarga**: o livro permite passar de 100% e aplica metade do movimento, depois movimento 0 acima de 150%. O aplicativo normalmente bloqueia a criacao/compra de cubos acima do limite e nao altera movimento.
50. **Peso de outros equipamentos**: o monitor considera principalmente cubos, nao soma automaticamente arma, armadura e itens grandes na carga detalhada.
51. **Capacidade de cubo de carga e especializado**: o Livro 1 define ate 10 unidades. O criador do aplicativo permite capacidades variaveis de 1 a 99.
52. **Acesso a item no cubo**: o livro exige duas ou tres acoes conforme o suporte. O aplicativo abre e retira imediatamente, sem contador de acoes.
53. **Venda**: o livro sugere percentuais por estado do item. O aplicativo inicia o valor editavel com 100% do preco.
54. **Preco Tier F**: o livro afirma que a arma Tier F mais barata custa 5.000 Luzentis. O aplicativo possui Pistola de Ferrita por 1.500 e Bastao de Carbonita por 2.000.
55. **Conversao economica**: varios precos de armas, armaduras e itens parecem vir da tabela antiga e apenas receberam o simbolo de Luzentis, sem conversao comprovada.
56. **Rachaduras por item**: o aplicativo usa um marcador geral de rachadura para o painel de combate, em vez de guardar rachaduras individualmente em cada arma, armadura, mod ou equipamento.

### Termos antigos ainda presentes

57. `ESP` ainda aparece em Dominação Mental e no chip Espirito de Yndra.
58. `JRC` ainda aparece em Cadeia de Julgamento.
59. `JRE` ainda aparece em Apagamento do Medo.
60. `JR de FOR` ainda aparece no Perito em Adagas.
61. `acao bonus` ainda aparece em varias profissoes e chips, embora a estrutura oficial use acao simples.

## 4. O que ainda nao esta no sistema

### Ficha e criacao

1. Campos separados para conceito, cultura, faccao associada, base atual e caminho Tecnologia/Cosmos/Hibrido.
2. Campos estruturados para aparencia e personalidade.
3. Historia resumida separada das notas gerais.
4. Idiomas conhecidos.
5. Objetivo pessoal como campo proprio.
6. Ligacao com o grupo como campo proprio.
7. Visao racial e sentidos especiais na ficha.
8. Percepcao passiva calculada e exibida.
9. Limite e validacao das duas pericias treinadas iniciais.
10. Automacao completa do pacote inicial.

### Resolucao de acoes

11. Classificacao automatica de falha, sucesso parcial e sucesso completo.
12. Campo de CD fixa e comparacao automatica.
13. Presets de dificuldade +3, +1, 0, -1 e -3.
14. Testes opostos.
15. Testes prolongados.
16. Testes em grupo.
17. Ajuda entre personagens.
18. Aplicacao automatica de consequencias, Estresse ou bonus cosmicos.

### Estresse e Cosmos

19. Regras de crise durante o Colapso.
20. Descanso rapido, de vigilia e completo com recuperacao.
21. Apoio entre personagens para reduzir Estresse.
22. Bonus cosmico guardado.
23. Tabelas opcionais de Bencao e Falha Cosmica.
24. Controle de foco/canalizador exigido para usar uma magia.
25. Consumo automatico de Cosmos ao conjurar magia.

### Visao, exploracao e movimento

26. Luz clara, luz fraca, penumbra, escuridao e escuridao cosmica.
27. Visao comum, penumbra e infravermelho limitado.
28. Busca ativa e surpresa.
29. Movimento diagonal, corrida, disparada, rastejar e levantar.
30. Terreno dificil, perigoso e instavel.
31. Salto, escalada, queda, natacao e prender a respiracao.
32. Exploracao por turnos, ritmo, navegacao e marcha prolongada.

### Combate e ataques

33. Rastreador de rodada, turno, acao principal, acao simples e reacao.
34. Ataque de oportunidade, recuar, defesa total e proteger aliado.
35. Comparacao automatica do ataque contra a CA do alvo.
36. Critico de ataque em 20 natural.
37. Erro critico em 1 natural.
38. Tabelas de critico e erro critico.
39. Distancia minima, alcance e penalidades de alcance.
40. Cobertura por direcao.
41. Ataques em area.
42. Duas armas, mao secundaria e armas de duas maos.
43. Ataque improvisado, desarmado, mirado e nao letal.
44. Tipos de dano, resistencias, vulnerabilidades e imunidades.
45. Munição atual/maxima por arma.
46. Consumo de munição em todo disparo, inclusive erro.
47. Recarga usando acao principal + acao simples.
48. Rajada consumindo quatro municoes.
49. Arma secundaria equipada.

### Vida, ferimentos e condicoes

50. Estado critico ao chegar a 0 PV.
51. Teste de sobrevivencia `3d6 + MOD CON` contra CD 12.
52. Marcas de Morte.
53. Estabilizacao e estabilizacao rapida.
54. Inconsciencia.
55. Sangramento como estado real editavel.
56. Ferimentos graves, lesoes permanentes e cicatrizes.
57. PV temporarios.
58. Tratamentos e recuperacao.
59. Lista e controle das condicoes oficiais do Capitulo 19.
60. Duracao, acumulacao e remocao de condicoes.

### Sobrevivencia

61. Comida e racoes por dia.
62. Fome e a condicao Faminto.
63. Saciedade e sua vantagem situacional.
64. Agua e Desidratacao.
65. Oxigenio e Sufocamento.
66. Luz e bateria.
67. Consumo diario de recursos.
68. Acampamento e guarda.
69. Viagem com feridos.

### Tecnologia e hacking

70. Sessao de Acesso.
71. Seguranca de Rede de 9 a 20+.
72. Barreiras de rede.
73. Alerta/deteccao da rede.
74. Acoes digitais estruturadas.
75. Jammed digital com duracao.
76. Tabela ERROR 403.

### Progressao

77. XP atual e XP necessario.
78. Escolha entre progressao por XP e por marco.
79. Estacao de Evolucao.
80. Materiais exigidos por nivel.
81. Custo de `500 Luzentis * nivel-alvo`.
82. Tempo de procedimento.
83. Rolagem de beneficio de nivel.
84. Efeitos colaterais permanentes.
85. Desenvolvimento do nucleo cosmico.
86. Implantes e riscos de implantes.
87. Treinamento entre missoes.
88. Troca estruturada de Chip de Profissao.

### Economia e campanha

89. Troca direta.
90. Negociacao com resultado mecanico.
91. Dividas com juros por ciclo.
92. Itens ilegais e disponibilidade de mercado.
93. Reputacao por faccao.
94. Relacoes e favores.
95. Registro separado de recursos, dividas e contatos.

## 5. Conteudos presentes, mas que o Livro 1 nao permite validar sozinho

Estes conteudos existem no aplicativo, mas o proprio Livro 1 envia seus detalhes para o Livro 5 ou outros livros:

1. Os 175 itens da tabela central.
2. As 16 armas e suas estatisticas.
3. As 11 armaduras e suas estatisticas.
4. As 65 magias cosmicas.
5. Os 76 chips modificadores.
6. Slots exatos de mods em cada arma e armadura.
7. Slots de magia concedidos por equipamentos.
8. Precos detalhados, raridade, disponibilidade e crafting.
9. Ganchos, coldres, bandoleiras e compatibilidades especificas.
10. Modelos de monstros.

Esses registros devem ser marcados como **provisorios** ate a comparacao com o Livro 5 e com a versao final da tabela central.

## 6. Inconsistencias encontradas no proprio Livro 1

Estas decisoes precisam ser resolvidas antes de transformar o livro em regra automatica definitiva:

1. **PV do Capitulo 4 contra PV do Capitulo 39**: o Capitulo 4 usa tabela de vida adicional por MOD CON e dados maximizados no nivel 1. O Capitulo 39 recomenda `8 * nivel + CON + bonus`. As duas formulas nao geram os mesmos valores.
2. **Criticos do Capitulo 17 contra Capitulo 44A**: as duas tabelas de critico possuem efeitos diferentes, especialmente nos resultados 1, 2, 3, 5 e 6.
3. **Erro critico duplicado**: o Capitulo 17 e o Capitulo 44A apresentam versoes diferentes da tabela.
4. **Profissao Piloto**: Piloto e citado na criacao, nos focos e nas sugestoes raciais, mas nao possui ficha detalhada no Capitulo 8 e nao aparece na tabela rapida de profissoes.
5. **Cubos e peso**: os Capitulos 4 e 9 dizem que cubos nao anulam completamente o peso e permitem controle detalhado; o Capitulo 23 diz que a carga interna nao soma peso adicional e que a carga e medida principalmente pelos cubos.
6. **Tabela de cubos do Capitulo 4**: mostra apenas MOD FOR -1, 0 e +2; a tabela completa aparece no Capitulo 9.
7. **Formula de PV do Capitulo 39**: usa o termo `CON +2` no exemplo, mas deveria esclarecer se significa valor de CON ou MOD CON.
8. **Estrutura editorial**: a numeracao salta do Capitulo 19 para 23, 24A, 36A, 39, 43A, 44A e 48A.
9. **Estilos de titulo**: varias subsecoes dos capitulos 36A, 43A e 44A estao formatadas como titulo principal, o que dificulta geracao automatica de sumario.
10. **Erros de texto**: aparecem formas como `Eestressee`, alem de trechos sem acentuacao no Capitulo 23.

## 7. Ordem recomendada de correcao do aplicativo

1. Corrigir ataques e iniciativa para `1d20`.
2. Substituir JPV por JPC com MEN/PRE.
3. Atualizar as quatro racas para o Livro 1.
4. Adicionar Performance, Atuacao e Busca.
5. Remover ou redefinir Saturacao e corrigir o limite de Estresse.
6. Decidir a formula oficial de PV e implementa-la.
7. Aplicar automaticamente focos de profissao e corrigir os chips divergentes.
8. Criar o pacote inicial com 2.000 Luzentis, cubos, arma, armadura e kits.
9. Implementar peso corporal, carga real e penalidades de sobrecarga.
10. Implementar sucesso, CD, Bencao, Falha e criticos.
11. Implementar PV 0, sobrevivencia, Marcas de Morte e condicoes.
12. Implementar munição, recarga, alcance e cobertura.
13. Implementar sobrevivencia, hacking e progressao.
14. Validar bibliotecas de itens, armas, armaduras, magias e mods contra o Livro 5.

## 8. Escopo acrescentado pelo Livro 2

O Livro 2 foi analisado como uma expansao e uma consolidacao do Livro 1. A comparacao abaixo separa quatro situacoes:

1. Regra do Livro 1 confirmada ou esclarecida pelo Livro 2.
2. Regra nova do Livro 2 que ainda nao existe no aplicativo.
3. Funcionalidade do aplicativo que nao aparece no Livro 2.
4. Contradicao entre Livro 1, Livro 2 ou capitulos diferentes do proprio Livro 2.

O Guia do Mestre possui 19 capitulos, um glossario e um grande conjunto de tabelas e formularios. Seus blocos principais sao:

1. Logistica, recursos e consequencias.
2. Viagem, exploracao e ambientes hostis.
3. Missoes, contratos, recompensas e complicacoes.
4. Faccoes, reputacao, contatos, favores e influencia.
5. Conducao do Mestre, dificuldades e consequencias.
6. Estrutura de aventuras e campanhas.
7. Aventuras prontas.
8. Criacao de monstros e encontros.
9. Chefes, entidades e ameacas de campanha.
10. Tecnologia, hacking e combate digital.
11. Bases, colonias e assentamentos.
12. Economia, escassez e mercado negro.
13. Criticos, falhas, rachaduras e ferimentos graves.
14. Campanha introdutoria.
15. Continuacao da campanha introdutoria.
16. Exemplos completos de jogo.
17. Modelos de mesa e consulta.
18. Tabelas rapidas e referencias.
19. Encerramento e direcionamento para suplementos.

## 9. O que o Livro 2 confirma no aplicativo

### Estrutura basica da ficha

1. Nome, raca, profissao, nivel, atributos e recursos continuam sendo dados centrais do personagem.
2. Os seis atributos FOR, REF, CON, MEN, PRE e INT permanecem oficiais.
3. O valor base 7 e a escala de modificadores permanecem compativeis com o Livro 1.
4. O nivel maximo padrao permanece 10.
5. A biblioteca de regras e a pagina de acoes do aplicativo sao adequadas como meios digitais de consulta.

### Testes e derivados

6. Testes comuns usam `3d6 + modificador + situacao`.
7. As faixas 3-9, 10-14 e 15+ continuam oficiais.
8. Triplo 6 e critico em teste comum; triplo 1 e erro critico.
9. Ataque usa `1d20 + atributo`.
10. Ataque corpo a corpo normalmente usa FOR.
11. Ataque a distancia normalmente usa REF.
12. Ataque cosmico normalmente usa MEN.
13. Iniciativa usa `1d20 + MOD REF`.
14. CA usa `4 + MOD REF + armadura + bonus`.
15. Cobertura media concede +2 CA e cobertura pesada concede +4 CA.
16. Movimento usa `6 m + MOD REF`.
17. Percepcao passiva usa `10 + MOD MEN`.
18. Cosmos inicial usa `1 + MOD MEN`, antes de bonus especificos.
19. Cubos iniciais usam `5 + MOD FOR`.

### Pericias e protecoes

20. O Livro 2 reforca a lista oficial de 26 pericias do Livro 1.
21. Performance permanece uma pericia de PRE.
22. Atuacao permanece separada das demais pericias sociais.
23. Busca permanece uma pericia propria, diferente de Busca Cosmica.
24. As Jogadas de Protecao oficiais permanecem JPF, JPR e JPC.
25. JPF pode usar FOR ou CON.
26. JPR usa REF.
27. JPC usa MEN ou PRE conforme a natureza do efeito.

### Estresse, equipamento e economia

28. Com Estresse de 0 a 5, o personagem rola normalmente 3d6.
29. Com Estresse 6 ou mais, o personagem rola 2d6.
30. O Livro 2 nao usa Saturacao.
31. Cada cubo pesa 10 kg.
32. O cubo simples armazena um item.
33. O cubo de carga aceita item pesado ou varios itens compativeis.
34. O cubo especializado armazena uma categoria definida, como medicina, municao ou minerais.
35. Itens em gancho ou cinto possuem acesso rapido.
36. Itens dentro de cubo normalmente exigem tres etapas ou turnos para acesso em combate.
37. A moeda oficial permanece Luzentis.
38. O dinheiro inicial permanece 2.000 Luzentis.
39. O pacote inicial inclui arma Tier F, armadura Tier F, kit de suprimento, kit da profissao e cubos.
40. A arma Tier F mais barata parte de 5.000 Luzentis.

### Conteudos parcialmente representados

41. O inventario do aplicativo representa armas, armaduras, itens, cubos, mods e suportes externos.
42. As bibliotecas por Tier ajudam a consultar a escala F, E, D, C, B, A e S usada pelo Livro 2.
43. A biblioteca de monstros representa o conceito de bestiario, mas ainda nao possui a ficha mecanica exigida.
44. A pagina de acoes representa parte da consulta rapida de combate e exploracao.
45. O chat de dados e o historico de rolagens ajudam a registrar testes, ataques e iniciativa.
46. O criador manual de conteudo pode futuramente receber monstros, NPCs, missoes e registros de campanha do Livro 2.

## 10. Discrepancias do Livro 1 esclarecidas pelo Livro 2

### Resolvidas ou fortemente consolidadas

1. **Ataque**: fica confirmado como `1d20 + atributo`, e nao como teste comum de 3d6.
2. **Iniciativa**: fica confirmada como `1d20 + MOD REF`.
3. **Jogada Cosmica**: o nome oficial e JPC, usando MEN ou PRE. JPV nao aparece no Livro 2.
4. **Lista de pericias**: o Livro 2 reforca as 26 pericias e confirma que Performance, Atuacao e Busca devem existir separadamente.
5. **PV inicial**: o Livro 2 apresenta uma tabela consolidada de `8 + vida adicional por MOD CON`, usando o valor maximo dos dados no nivel 1.
6. **Critico de ataque**: 20 natural e o gatilho oficial; 1 natural e erro critico.
7. **Critico geral**: triplo 6 e triplo 1 permanecem os gatilhos dos testes de 3d6.
8. **Pacote inicial**: 2.000 Luzentis, cubos, arma Tier F, armadura Tier F, suprimentos e kit da profissao.
9. **Carga maxima**: metade do peso corporal + `MOD FOR x 10 kg`.
10. **Sobrecarga**: acima de 100% reduz movimento pela metade; acima de 150% deixa movimento em 0.
11. **Economia inicial**: arma Tier F mais barata parte de 5.000 Luzentis.
12. **Acesso a cubos**: retirar algo de dentro normalmente e demorado e leva tres etapas ou turnos em combate.
13. **Economia de acoes**: um turno possui acao principal, acao simples e movimento.
14. **Recarga**: normalmente consome acao principal e acao simples.
15. **Estresse**: 6 ou mais reduz a rolagem para 2d6; Saturacao e 4d6 nao pertencem a essa versao.
16. **Percepcao passiva**: `10 + MOD MEN`.
17. **Cosmos inicial**: `1 + MOD MEN`, antes de fontes adicionais.
18. **Rachaduras**: equipamento colapsa ao chegar a 5 rachaduras.

### Parcialmente resolvidas

19. **PV no nivel 1**: o Livro 2 resolve o total inicial, mas altera as expressoes de +4 e +5 em relacao ao Livro 1. Os valores maximizados continuam chegando a 18 e 20.
20. **Tabela principal de criticos**: o Capitulo 13 do Livro 2 consolida uma tabela oficial, mas a referencia rapida posterior ainda traz uma tabela de falha diferente.
21. **Cubos**: os tipos e usos ficam mais claros, mas a capacidade numerica exata de cubos de carga e especializados nao e fechada no Livro 2.
22. **Dificuldades**: o Livro 2 organiza faixas e exemplos, mas alterna entre bonus situacional e CD fixa conforme a cena.

### Nao resolvidas

23. **PV depois do nivel 1**: o Livro 2 nao fornece uma formula completa de progressao de PV por nivel que elimine a ambiguidade do Livro 1.
24. **Profissao Piloto**: o Guia usa Piloto em exemplos e cenas, mas nao fornece uma ficha completa da profissao.
25. **Progressoes raciais antigas do aplicativo**: o Livro 2 nao valida as progressoes LV1-LV10 atualmente cadastradas.
26. **Venda de item usado**: o Livro 2 trabalha negociacao, escassez e mercado, mas nao substitui claramente os percentuais de venda sugeridos no Livro 1.
27. **Slots de magia e mods**: o Livro 2 nao apresenta a regra digital de espacos usada pelo aplicativo.
28. **Capacidade exata de cubos**: permanece dependente da ficha, do Livro 5 ou de uma decisao oficial posterior.

## 11. O que existe no aplicativo, mas diverge do Livro 2

### Regras centrais

1. **Iniciativa**: o aplicativo ainda rola o perfil de 2d6, 3d6 ou 4d6; o Livro 2 exige `1d20 + MOD REF`.
2. **Ataque**: o botao de ataque abre o mesmo perfil de teste comum; o Livro 2 exige 1d20.
3. **JPC**: o aplicativo ainda usa JPV somente com PRE.
4. **Saturacao**: o aplicativo possui recurso 0-10, HUD, barra e efeitos; nao ha Saturacao no Livro 2.
5. **4d6**: o aplicativo concede 4d6 com Saturacao maxima; a regra nao existe no Guia.
6. **Estresse maximo**: o aplicativo usa base 7 e ainda aceita bonus passivos; o Guia apenas define que Estresse 6+ causa a rolagem de 2d6 e nao valida essa trilha digital.
7. **PV**: o aplicativo calcula `8 x nivel + MOD CON positivo x nivel`, diferente da tabela consolidada.
8. **Rachaduras**: o aplicativo usa escala 0-10 e quebra visualmente em 10; o Livro 2 determina colapso em 5.
9. **Rachadura geral**: o aplicativo guarda um marcador principal, enquanto o Livro 2 trata rachaduras individualmente em arma, armadura, cubo, foco, drone, veiculo e outros equipamentos.
10. **Efeitos de rachadura**: faltam penalidades como -1 no ataque da arma, -1 CA na armadura, Jammed e falha de vedacao.

### Pericias, criacao e personagem

11. O aplicativo possui 23 pericias; o Guia confirma 26.
12. Performance, Atuacao e Busca continuam faltando.
13. Pes Ageis ainda absorve parte da funcao de Performance.
14. Busca Cosmica ainda ocupa usos que o livro atribui a Busca.
15. Nao ha limite automatico para as duas pericias treinadas iniciais.
16. O dinheiro inicial permanece 0 em vez de 2.000 Luzentis.
17. Arma, armadura, cubos, suprimento e kit de profissao nao sao entregues automaticamente.
18. Percepcao passiva nao e exibida como derivado principal.
19. Focos de profissao ainda nao sao aplicados de modo uniforme.
20. A ficha nao possui peso corporal para calcular a carga oficial.

### Inventario, cubos e economia

21. O aplicativo bloqueia cubos acima do limite, enquanto o Guia permite sobrecarga com penalidades.
22. O monitor calcula principalmente quantidade de cubos x 10 kg, nao metade do peso corporal + MOD FOR.
23. Peso de armas, armaduras e itens nao entra em uma carga total completa.
24. O criador permite capacidade variavel de 1 a 99; o Livro 2 nao autoriza essa faixa.
25. O acesso e a retirada de itens do cubo sao instantaneos no aplicativo.
26. Faltam cubo de contencao e cubo Tharan/antigo.
27. O valor inicial de venda e 100% do preco, sem estado, reputacao, escassez ou negociacao.
28. Existem armas Tier F abaixo de 5.000 Luzentis.
29. Faltam multiplicadores regionais: abundante x0,5, escasso x2, raro x5, ilegal x2 a x10 e crise.
30. Faltam licencas, disponibilidade, intermediarios, item roubado, rastreamento e mercado negro.

### Combate e consequencias

31. Nao ha deteccao automatica de 20 natural, 1 natural, triplo 6 ou triplo 1.
32. Nao ha tabela automatica de critico de ataque do Capitulo 13.
33. Nao ha tabela automatica de erro critico de ataque.
34. Nao ha Ferimento Grave estruturado.
35. Nao ha estado Jammed estruturado para cada equipamento.
36. Nao ha rastreador de acao principal, acao simples, movimento e reacao.
37. Nao ha munição atual/maxima nem consumo e recarga completos.
38. Nao ha resistencias, vulnerabilidades, imunidades e tipos de dano plenamente mecanizados.

## 12. Conteudo do Livro 2 que ainda nao esta no aplicativo

### Missoes e campanha

1. Criador de missao com objetivo principal, secundario e secreto.
2. Contratante, faccao, local, prazo, pagamento, bonus e penalidade.
3. Riscos conhecidos e ocultos.
4. Condicoes de sucesso e falha.
5. Consequencias de recusa, falha e sucesso.
6. Gerador de complicacoes de missao.
7. Recompensas por dinheiro, recurso, contato, favor, licenca, mapa ou equipamento.
8. Controle de contratos ativos.
9. Controle de sessoes e resumo da sessao anterior.
10. Estrutura de campanha por arcos, ameacas e ganchos.
11. Aventuras prontas do Guia acessiveis pela biblioteca.

### Faccoes e relacoes

12. Registro de faccoes.
13. Reputacao de -3 a +3 por faccao.
14. Atitude inicial por reputacao.
15. Descontos, sobretaxas e acesso por reputacao.
16. Contatos, favores e dividas.
17. Influencia e consequencias politicas.
18. Ficha de NPC completa.
19. Ficha curta de NPC.
20. Cena social estruturada com objetivo, postura e consequencia.

### Exploracao e logistica

21. Consumo de agua, comida, municao, baterias e combustivel.
22. Ritmos de viagem.
23. Navegacao, atraso e perda de rota.
24. Terreno dificil, clima, radiacao, contaminacao e falta de oxigenio.
25. Marcha prolongada e vigilia.
26. Acampamento, guarda e eventos noturnos.
27. Estados Saciado, Alimentado, Com fome e Faminto.
28. Penalidades oficiais de fome.
29. Fadiga, exposicao e ambiente hostil.
30. Checklist antes e depois da missao.

### Monstros e encontros

31. Criador de monstro com Tier, tipo, papel, tamanho, habitat e comportamento.
32. PV, CA, movimento e atributos do monstro.
33. Ataques, habilidades, condicoes, resistencias e fraquezas.
34. Sentidos, moral, recursos e recompensas.
35. Papeis de combate de monstros.
36. Orcamento e composicao de encontros.
37. Comportamento e instinto de criaturas.
38. Partes coletaveis e loot biologico.
39. Chefes com fases.
40. Acoes lendarias ou de cena.
41. Entidades e ameacas narrativas.
42. Escalonamento de encontros por Tier.

### Tecnologia e hacking

43. Seguranca de Rede de 10 a 20+.
44. Sessao de Acesso.
45. Nos de rede.
46. RAM como recurso de invasao.
47. ICE, Deteccao, Rastro e ERROR 403.
48. Acoes digitais com custo e tempo.
49. Controle de portas, cameras, drones e veiculos.
50. Tabelas de redes e recompensas tecnologicas.
51. Consequencias fisicas de falhas digitais.

### Bases, veiculos e maquinas

52. Ficha de base ou colonia.
53. Agua, comida, energia, medicina, oficina, defesa, moral e seguranca da base.
54. Producao, comunicacao e armazenamento.
55. Ciclos e eventos de base.
56. Crises, ataques e manutencao.
57. Veiculos com velocidade, falhas, combustivel e perseguicao.
58. Overdrive e manobras evasivas.
59. Drones de reconhecimento, medicina, ataque e furtividade.
60. Torretas, robos de carga, reparo e combate.
61. Estados de maquina: normal, rachado, Jammed, sem energia, hackeado e instavel.

### Economia avancada

62. Preco regional e escassez.
63. Crises economicas com multiplicadores.
64. Barganha e negociacao mecanica.
65. Mercado negro.
66. Licencas e itens controlados.
67. Dividas e juros.
68. Itens falsos, roubados, rastreados ou defeituosos.
69. Economia por faccao.
70. Loot comum, tecnologico e cosmico.

### Consequencias e suporte ao Mestre

71. Tabela oficial de critico de ataque.
72. Tabela oficial de erro critico de ataque.
73. Tabelas de critico e erro critico para testes gerais.
74. Ferimento Grave com gatilho, tipo, tratamento e cicatriz.
75. Consequencias por combate, defesa, social, tecnica, medicina, exploracao, hacking e Cosmos.
76. Trilha de ameaca.
77. Trilha de investigacao.
78. Controle de Estresse de NPCs e grupo.
79. Controle de divida e favor.
80. Ficha de encontro.
81. Ficha de cena de exploracao.
82. Folha do Mestre durante a sessao.
83. Controle geral do grupo.
84. Checklist do Mestre antes da primeira sessao.
85. Checklist final de sessao.

## 13. O que existe no aplicativo, mas nao aparece no Livro 2

Estes itens nao sao necessariamente erros. Muitos sao funcionalidades digitais legitimas, mas nao devem ser apresentados como regras oficiais do Guia sem outra fonte.

### Funcionalidades de software

1. Armazenamento das fichas em `localStorage`.
2. Criar, duplicar e excluir fichas pela biblioteca local.
3. Importar e exportar ficha em JSON.
4. Imprimir ficha.
5. PWA instalavel.
6. Empacotamento para Windows.
7. Foto do personagem por clique ou arrastar e soltar.
8. Imagens personalizadas para itens, armas e armaduras.
9. HUD vital holografica.
10. Animacao de dados sobreposta a tela.
11. Chat local de resultados.
12. Busca, filtros e ordenacao das bibliotecas.
13. Compra e debito automaticos.
14. Venda por valor editavel.
15. Criacao manual de item, arma, armadura, magia, chip e monstro.
16. Metadados preparados para integracao futura com Foundry.

### Regras ou automacoes sem equivalente no Livro 2

17. Saturacao 0-10.
18. Rolagem de 4d6 por Saturacao maxima.
19. Espacos de magia cosmica calculados por equipamento, chip, treino e grimorio.
20. Bloqueio de magia por falta de espaco.
21. Espacos de chips modificadores somados por arma e armadura.
22. Bloqueio de chip por falta de slot.
23. Aviso cosmico de falta de espaco.
24. Aviso de sobrecarga tecnologica.
25. Parser automatico de bonus passivos em textos de mods.
26. Progressoes raciais LV1-LV10 atuais.
27. Escala de rachadura 0-10.
28. Capacidade de cubo configuravel ate 99.
29. Regra exata do primeiro item para travar cubo de carga.
30. Regra automatica de familia do primeiro item para travar cubo especializado.
31. Campos especificos para treino e grimorio como fonte de magia.

## 14. Novas inconsistencias encontradas ao incluir o Livro 2

### Livro 1 contra Livro 2

1. **Vida adicional com MOD CON +4**: o Livro 1 usa `1d8+2`; o Livro 2 usa `1d6+4`. No nivel 1 ambos maximizam em +10.
2. **Vida adicional com MOD CON +5**: o Livro 1 usa `1d10+2`; o Livro 2 usa `1d8+4`. No nivel 1 ambos maximizam em +12.
3. **Materiais de Level Up**: a tabela do Livro 2 muda os materiais dos niveis 6, 7, 9 e 10 em relacao ao Livro 1.
4. **Nivel 6**: o Livro 2 exige Ourium + Paralatum refinadas; o Livro 1 indicava Palatita.
5. **Nivel 7**: o Livro 2 exige Palatita; o Livro 1 indicava Palatita + Ourium.
6. **Nivel 9**: o Livro 2 exige Vulcanium; o Livro 1 indicava uma combinacao de Adamantita, Palatita e Ourium.
7. **Nivel 10**: o Livro 2 exige Titanium ou equivalente; o Livro 1 indicava Vulcanium.
8. **Custo de Level Up**: o Livro 1 apresenta `500 Luzentis x nivel-alvo`; o Livro 2 manda consultar o custo da economia do Livro 5.
9. **Fome**: o Livro 1 simplifica Faminto como -1 em ataque e CA; o Livro 2 cria Com fome (-1) e Faminto (-2).
10. **Cubos**: o Livro 1 cita capacidade de ate 10 unidades; o Livro 2 deixa multiplos itens condicionados ao que a ficha permitir.
11. **Tipos de cubo**: o Livro 2 acrescenta cubo de contencao e cubo Tharan/antigo.
12. **Criticos**: o Livro 2 consolida uma tabela nova no Capitulo 13, substituindo na pratica as versoes conflitantes do Livro 1.

### Contradicoes dentro do Livro 2

13. **Falha critica de ataque**: o Capitulo 13 usa Jammed, rachadura, exposicao, recurso gasto, risco a aliado e consequencia de cena. A referencia rapida posterior recupera uma tabela diferente, semelhante ao rascunho antigo do Livro 1.
14. **Monstros por Tier**: o Capitulo 8 e o Capitulo 18 apresentam faixas diferentes de PV, CA e dano para os mesmos Tiers.
15. **Tier F de monstro**: o Capitulo 8 usa 4-8 PV; o Capitulo 18 usa 5-10 PV.
16. **Tier E de monstro**: o Capitulo 8 usa 8-14 PV; o Capitulo 18 usa 10-20 PV.
17. **Tier A de monstro**: o Capitulo 8 usa 80-140 PV; o Capitulo 18 usa 120+ PV.
18. **Numeracao editorial**: o Capitulo 10 usa cabecalhos numerados como 36.x, apesar de pertencer ao decimo capitulo.
19. **Atuacao no indice textual**: a lista oficial e reforcada pelo conjunto dos livros, mas a busca textual direta no Livro 2 nao localiza o termo com consistencia, indicando possivel problema de grafia, formatacao ou codificacao.
20. **Estresse maximo**: o Livro 2 determina o efeito em 6+, mas nao declara de forma inequivoca um limite superior unico para a trilha.

## 15. Decisoes oficiais recomendadas antes da proxima automacao

1. Usar `1d20 + MOD REF` para iniciativa.
2. Usar 1d20 para ataques e manter 3d6 para testes comuns.
3. Substituir JPV por JPC com MEN/PRE.
4. Adicionar Performance, Atuacao e Busca.
5. Remover Saturacao e a regra de 4d6, ou marca-las explicitamente como regra opcional externa aos Livros 1 e 2.
6. Adotar a tabela consolidada de PV inicial do Livro 2.
7. Definir separadamente a progressao de PV depois do nivel 1.
8. Alterar o colapso de equipamentos para 5 rachaduras e guardar rachaduras por item.
9. Criar dinheiro e equipamento iniciais automaticamente.
10. Implementar peso corporal, carga real e penalidades de sobrecarga.
11. Corrigir os precos Tier F abaixo de 5.000 Luzentis ou marca-los como excecoes oficiais.
12. Escolher qual tabela de monstros por Tier e definitiva.
13. Escolher qual tabela de falha critica de ataque e definitiva.
14. Confirmar a nova tabela de materiais de Level Up do Livro 2.
15. Decidir se slots de magia e slots de mods sao regras oficiais do futuro Livro 5 ou apenas controles do aplicativo.
16. Manter PWA, JSON, imagens, HUD, filtros e Foundry como funcionalidades digitais, sem trata-las como regras dos livros.
17. Planejar um modulo de Mestre separado para missoes, NPCs, faccoes, encontros, monstros, bases e hacking.
