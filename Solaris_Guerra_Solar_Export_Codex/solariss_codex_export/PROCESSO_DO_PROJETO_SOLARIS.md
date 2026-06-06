# Processo do Projeto Solaris

Documento criado em 04/06/2026 para registrar, em texto, os principais passos feitos para transformar o repositório Solaris em uma biblioteca/ficha jogável de personagens.

## 1. Organização inicial do projeto

1. O repositório `BielMoutAng/solaris` foi baixado para a máquina local.
2. O app principal ficou concentrado em:
   - `Solaris_Guerra_Solar_Export_Codex/solariss_codex_export/biblioteca-personagens/`
3. A estrutura do app foi mantida como uma aplicação web local simples:
   - `index.html`: estrutura da tela.
   - `styles.css`: visual e responsividade.
   - `app.js`: regras, estado da ficha, bibliotecas e interações.
   - `official-items.js`: lista de itens oficiais importados da tabela.
   - `HumanisVitalHUD.js`: componente da HUD vital Humanis.
   - `electron-main.cjs`: entrada do app desktop Electron.
   - `package.json`: scripts e configuração de build.

## 2. Uso dos documentos oficiais

Foram usados como base os documentos que você indicou:

- `REGRAS simplificadas.docx`
- `Tabela Solaris V2.xlsx`
- fichas padrão em `.xlsx`

Com isso, o app passou a refletir regras atuais do Solaris:

- quatro raças jogáveis;
- chips de profissão;
- atributos com padrão inicial `7`;
- limite de atributo até `20`;
- modificador calculado por `INT((valor final - 10) / 2)`;
- estresse máximo `7`;
- testes com `3d6`, `2d6` em colapso e `4d6` com saturação máxima;
- itens oficiais importados da aba de itens da tabela central.

## 3. Criação da ficha de personagem

Foi criada uma ficha dentro do app com campos de:

- nome do personagem;
- nome do jogador;
- raça;
- atributo racial;
- chip de profissão;
- nível;
- origem;
- dinheiro;
- foto do personagem;
- atributos base;
- recursos e derivados;
- perícias;
- jogadas de proteção;
- equipamentos;
- magias;
- chips modificadores;
- cubo;
- habilidades;
- rolagens de dados;
- criação manual.

As fichas são salvas no navegador usando `localStorage`, permitindo que cada computador ou celular tenha suas próprias fichas.

## 4. Imagem do personagem

Foi adicionada uma área de imagem do personagem com duas formas de uso:

1. clicar na área para procurar um arquivo;
2. arrastar uma imagem para dentro da área.

A imagem é convertida e salva junto com a ficha, para continuar aparecendo quando a ficha for reaberta naquele dispositivo.

## 5. Raças jogáveis

A biblioteca de raças foi ajustada para exibir apenas as raças jogáveis atuais.

Também foi criada uma página interna para cada raça. Ao clicar em uma raça, o app abre uma página com as informações daquela raça, em vez de mostrar tudo no mesmo card.

## 6. Atributos, perícias e proteções

Os atributos passaram a iniciar em `7`.

Foram adicionadas perícias ligadas aos atributos:

- Força: Atletismo, Briga, Demolição, Coleta.
- Reflexo: Furtividade, Mãos Leves, Acrobacia, Pilotagem, Pés Ágeis.
- Mentalidade: Cosmos, Memória Cósmica, Intuição Cósmica, Percepção Cósmica, Busca Cósmica.
- Presença: Intimidação, Persuasão, Empatia, Acalmar Criatura.
- Intelecto: Tecnologia, Medicina, Engenharia, Biologia, Culinária.

Também foi adicionado o controle de treino das perícias:

- perito;
- ignorante;
- normal.

A Constituição foi removida da lista comum de perícias/proteções rápidas, mas ainda pode ser usada na JP Física quando a situação pedir.

As jogadas de proteção foram ajustadas para:

- `JPF`: JP Física, usando MOD FOR ou MOD CON, conforme a situação.
- `JPV`: JP Vontade, usando MOD PRE.
- `JPR`: JP Reflexo, usando MOD REF.

## 7. Testes rápidos

Foram criados botões para testar:

- atributos;
- perícias;
- jogadas de proteção.

Cada teste abre uma janela de rolagem com:

- fórmula atual;
- bônus situacional;
- modo normal;
- vantagem;
- desvantagem.

A regra de dados considera estresse e saturação:

- padrão: `3d6 + MOD + bônus`;
- estresse 6 ou mais: `2d6 + MOD + bônus`;
- saturação máxima e sem colapso: `4d6 + MOD + bônus`.

## 8. Recursos e derivados

Foram ajustados os recursos principais:

- PV atual / PV máximo;
- Cosmos atual / Cosmos máximo;
- Estresse;
- Saturação.

O PV atual passou a ficar junto do PV máximo, no formato semelhante a `10/10`, permitindo reduzir apenas o PV atual.

Também foram mantidos derivados como:

- CA;
- movimento;
- cubos;
- dados atuais da ficha.

## 9. Bibliotecas de conteúdo

Foram criadas ou ampliadas bibliotecas laterais para:

- raças;
- profissões;
- magias;
- chips modificadores;
- armas;
- armaduras;
- itens;
- monstros;
- regras;
- ações possíveis.

As bibliotecas ganharam:

- busca;
- filtro por tier/rank/custo/categoria;
- ordenação por tier;
- ordenação por preço;
- ordenação alfabética.

## 10. Itens oficiais

A lista de itens oficiais foi importada da `Tabela Solaris V2.xlsx`.

Esses itens foram colocados em `official-items.js`.

A biblioteca de itens passou a usar essa lista como fonte principal.

## 11. Compra, venda e equipamentos

Foi criado um sistema de compra:

1. o jogador clica em `Comprar`;
2. o app verifica se há dinheiro suficiente;
3. se houver, debita o valor;
4. o item entra no inventário/equipamentos da ficha.

Foi criado também:

- botão de vender item;
- valor de venda editável;
- botão de equipar;
- botão de desequipar;
- botão de guardar/tirar item do cubo;
- campo de rachadura do equipamento.

O antigo slot manual de armadura ao lado do estresse foi removido. A armadura passou a ser controlada pela aba de equipamentos.

## 12. Magias e chips

Foram adicionadas abas laterais para:

- magias cósmicas;
- chips modificadores.

Ao adicionar uma magia ou chip, ele aparece na ficha do personagem.

Também foi criado botão para desequipar chips modificadores.

Todas as habilidades do personagem passaram a aparecer em uma página de habilidades, indicando a fonte:

- raça;
- cosmos;
- chip modificador;
- arma;
- armadura;
- item;
- manual.

## 13. Criação manual de conteúdo

Foi criada uma aba para inserir manualmente:

- item;
- arma;
- armadura;
- magia;
- chip;
- habilidade.

O formulário muda conforme o tipo escolhido e já apresenta um formato padrão aproximado do conteúdo oficial.

Também foi permitido adicionar imagem em itens, armas e armaduras criados manualmente.

## 14. Rolador de dados

Foi criado um rolador com:

- quantidade de dados;
- tipo do dado;
- bônus;
- resultado;
- animação holográfica;
- chat/histórico das rolagens.

Também foi criado um botão de iniciativa, usando REF e as mesmas regras de estresse/saturação.

As rolagens foram estruturadas com metadados para facilitar uma futura migração para Foundry VTT.

## 15. Guia de criação de personagem

Foi criada uma aba de guia para ajudar jogadores a criarem personagens.

O guia inclui:

- passos de criação;
- rolagem de atributos iniciais;
- distribuição dos resultados;
- checklist final.

A aba `Guia` foi colocada por último, como você pediu.

## 16. HUD Vital Humanis

Foi criado e integrado o componente `HumanisVitalHUD.js`.

Ele recebe dados reais da ficha e renderiza dentro de:

```html
<div id="hud-humanis"></div>
```

A HUD foi ajustada várias vezes:

1. começou como painel de estresse;
2. evoluiu para monitoramento vital;
3. ganhou visual holográfico;
4. recebeu corpo Humanis;
5. recebeu fallback SVG;
6. ficou preparada para modelo 3D `.glb` em `assets/models/humanis.glb`;
7. depois foi reduzida e colocada como janela/modal aberta a partir da ficha.

Também foram removidas partes que você não gostou, como diagrama corporal grande, hidratação/nutrição, sangramento e alertas extras.

## 17. Visual do app

O layout foi redesenhado para seguir uma estética Solaris:

- fundo escuro;
- neon ciano;
- dourado solar;
- painéis holográficos;
- aparência de HUD;
- detalhes cósmicos;
- detalhes de matéria orgânica;
- cards mais uniformes;
- menos sensação de conteúdo espremido;
- menu lateral expansivo/recolhível.

O objetivo foi deixar o app simples, bonito e funcional para mesa.

## 18. Janela de detalhes dos cards

Inicialmente, os detalhes de itens, armas, armaduras, magias e chips apareciam ao passar o mouse.

Isso atrapalhava os botões de:

- Comprar;
- Adicionar;
- Equipar;
- Vender.

A correção final foi:

1. remover a abertura por hover;
2. transformar o nome do card em um botão discreto;
3. abrir a janela de detalhes apenas ao clicar no nome;
4. fechar ao clicar fora ou apertar `Esc`.

Essa correção foi publicada no commit:

```text
40f05fb Corrige detalhes dos cards por clique
```

## 19. Preparação para Foundry VTT

Desde as últimas etapas, as novas funções foram pensadas para facilitar migração futura para Foundry VTT.

Isso significa manter dados com campos como:

- categoria;
- fonte;
- tipo;
- efeito;
- tags;
- custo;
- tier;
- metadados de rolagem.

Assim, no futuro, fica mais fácil transformar personagens, itens, magias e rolagens em documentos do Foundry.

## 20. PWA e uso em celular

O app foi preparado para funcionar como PWA:

- `manifest.webmanifest`;
- `sw.js`;
- ícones em `assets/icons`;
- cache offline básico;
- meta tags para iPhone;
- suporte para adicionar à Tela de Início.

Também foi criado workflow de GitHub Pages:

```text
.github/workflows/pages.yml
```

O GitHub não permitiu habilitar Pages automaticamente pelo token do workflow. Por isso, ainda é necessário ativar uma vez em:

```text
Settings > Pages > Build and deployment > GitHub Actions
```

Depois disso, o link esperado para celular é:

```text
https://bielmoutang.github.io/solaris/
```

No iPhone, o uso seria:

1. abrir o link no Safari;
2. tocar em Compartilhar;
3. escolher `Adicionar à Tela de Início`.

## 21. Publicação no GitHub

As alterações foram publicadas na branch:

```text
main
```

O repositório remoto é:

```text
https://github.com/BielMoutAng/solaris.git
```

Foram feitos commits para:

- atualizar a biblioteca Solaris;
- adicionar PWA;
- configurar GitHub Pages;
- corrigir detalhes dos cards por clique;
- publicar build Windows 0.1.1.

## 22. Build para Windows

O projeto foi preparado com Electron.

Scripts principais:

```text
npm run start
npm run dist
```

Foi gerada a versão:

```text
0.1.1
```

O primeiro build falhou porque a pasta antiga `dist/win-unpacked` estava com arquivo em uso.

Para resolver, foi gerada uma build em uma pasta temporária nova:

```text
dist-v0.1.1
```

Depois, os arquivos finais foram copiados para:

```text
downloads/windows/v0.1.1/
```

Arquivos publicados:

```text
Solaris Biblioteca Setup 0.1.1.exe
Solaris Biblioteca 0.1.1.exe
README.md
```

O instalador é recomendado para jogadores comuns.

A versão portátil abre direto, sem instalar.

## 23. Links de download Windows

Instalador:

```text
https://raw.githubusercontent.com/BielMoutAng/solaris/main/downloads/windows/v0.1.1/Solaris%20Biblioteca%20Setup%200.1.1.exe
```

Portátil:

```text
https://raw.githubusercontent.com/BielMoutAng/solaris/main/downloads/windows/v0.1.1/Solaris%20Biblioteca%200.1.1.exe
```

## 24. Validações feitas

Durante o processo, foram feitos checks como:

```text
node --check app.js
node --check sw.js
git diff --check
git status
git fetch origin
git push origin main
```

Também foram feitas validações no navegador local quando possível:

- app carregando em `http://127.0.0.1:8787/`;
- ausência de erros de console;
- scripts e CSS com cache-buster atualizado;
- manifest PWA presente;
- arquivos de vendor Three.js presentes;
- links de download confirmados pela API do GitHub.

## 25. Pontos importantes para continuar

Para uma nova versão Windows:

1. ajustar `version` em `package.json`;
2. rodar `npm install` se dependências mudarem;
3. rodar `npm run dist` ou `npx electron-builder`;
4. copiar os `.exe` finais para `downloads/windows/vX.Y.Z/`;
5. gerar hashes SHA256;
6. atualizar o README da pasta de download;
7. atualizar `CHANGELOG.md`;
8. commitar;
9. criar tag;
10. fazer push.

Para uma nova versão web/PWA:

1. atualizar `app.js`, `styles.css` ou outros assets;
2. atualizar cache-buster no `index.html`;
3. atualizar nomes de cache no `sw.js`;
4. commitar;
5. fazer push;
6. conferir o GitHub Pages.

## 26. Observação sobre dados salvos

As fichas ficam no navegador ou no app local usando armazenamento local.

Isso significa:

- cada PC tem suas próprias fichas;
- cada celular tem suas próprias fichas;
- desinstalar, limpar dados do navegador ou trocar de aparelho pode apagar fichas locais;
- o caminho seguro para backup é usar `Exportar`;
- o caminho para levar ficha para outro dispositivo é usar `Importar`.

## 27. Estado atual

O projeto está em uma versão jogável inicial, com:

- ficha de personagem;
- bibliotecas;
- criação manual;
- rolagens;
- HUD vital;
- compra/venda/equipamento;
- suporte desktop Windows;
- preparação PWA/mobile;
- base pensada para Foundry VTT.

O próximo grande passo, quando você quiser, pode ser consolidar regras completas, revisar balanceamento e preparar exportação/importação mais estruturada para Foundry.
