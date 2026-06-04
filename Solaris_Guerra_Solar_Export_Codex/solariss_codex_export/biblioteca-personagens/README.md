# Biblioteca de Personagens Solaris

App local para criar, salvar, exportar e imprimir fichas de personagem de Solaris.

## Abrir

Abra `index.html` no navegador.

## iPhone e Android

O app pode ser usado como PWA quando publicado pelo GitHub Pages. No iPhone, abra `https://bielmoutang.github.io/solaris/` no Safari, toque em Compartilhar e escolha Adicionar a Tela de Inicio. Depois disso ele abre como um app instalado.

Cada aparelho salva suas proprias fichas localmente no navegador. Para levar uma ficha para outro celular ou PC, use `Exportar` e depois `Importar`.

## Aplicativo Windows

Esta biblioteca também pode virar um aplicativo de Windows com Electron.

- `npm install`: instala as dependências de empacotamento.
- `npm run start`: abre o app em modo desktop para testar.
- `npm run dist`: gera os arquivos em `dist/`.

Arquivos gerados:

- `dist/Solaris Biblioteca Setup 0.1.0.exe`: instalador para enviar aos jogadores.
- `dist/Solaris Biblioteca 0.1.0.exe`: versão portátil, abre direto sem instalar.

Cada computador salva as próprias fichas localmente. Para mover uma ficha entre PCs, use `Exportar` e `Importar`.

Como o app ainda não tem assinatura digital paga, o Windows pode exibir aviso de segurança ao abrir o instalador. Isso é esperado em builds locais sem certificado.

## Dados salvos

As fichas ficam no `localStorage` do navegador. Use `Exportar` para guardar uma ficha em JSON e `Importar` para carregar esse arquivo depois.

As imagens de personagem são redimensionadas no navegador e salvas junto com a ficha. Você pode clicar na área da foto ou arrastar um arquivo de imagem para dentro dela.

Na biblioteca de raças, clique em qualquer card para abrir uma página interna com perfil, criação, fraqueza, habilidade base, progressão por nível e notas dos documentos oficiais.

## Fórmulas atuais

- Atributos iniciais da ficha: `7`
- Limite dos atributos no campo numérico: `0` a `20`
- MOD de atributo: `INT((valor final - 10) / 2)`
- PV máximo: `8 * nível + MAX(0, MOD CON) * nível`
- PV atual: campo editável exibido como `PV atual / PV máximo`
- Cosmos máximo: `Cosmos base do nível + MOD MEN + bônus racial + bônus de equipamento`
- CA: `CA da raça + MOD REF + armadura equipada`
- Movimento: `6 + MOD REF + bônus racial/equipamento`
- Slots de cubo: `5 + MOD FOR + bônus racial + bônus do chip`
- Estresse máximo na ficha: `7`
- Testes: `3d6 + MOD + bônus situacional`; com Estresse 6+ usa `2d6`; com Saturação 10 e Estresse menor que 6 usa `4d6`

As bibliotecas de armas, armaduras e itens permitem comprar com o dinheiro da ficha. A compra debita o valor e coloca o equipamento no inventário do personagem, onde armas e armaduras podem ser equipadas e itens podem ser guardados no cubo. As bibliotecas também têm busca, filtro por tier/rank/custo/categoria conforme o tipo de conteúdo, e ordenação por tier, preço ou ordem alfabética.

A biblioteca de itens é carregada de `official-items.js`, com 175 itens extraídos da aba `tabela de itens` da planilha central `Tabela Solaris V2.xlsx`. Dados de crafting ainda não foram importados para o app.

Também há bibliotecas laterais de Magias cósmicas e Chips modificadores. Ao adicionar uma magia ou chip, ele aparece na página Habilidades da ficha com nome, fonte e efeito.

Na página do personagem, as abas Habilidades, Dados e Criar permitem revisar todas as habilidades atuais, rolar dados com histórico em chat e inserir manualmente itens, armas, armaduras, magias, chips ou habilidades personalizadas. Toda rolagem também exibe uma animação holográfica de dados sobre a tela. A aba Criar muda o formato do formulário conforme o tipo selecionado, seguindo o padrão das bibliotecas oficiais. Itens, armas e armaduras criados manualmente podem receber imagem por clique ou arrastar e soltar. Itens no inventário podem ser vendidos com valor editável, e a aba Equipamentos tem um campo de nível de Rachadura.

A ficha também tem testes rápidos por atributo, perícia e jogada de proteção, HUD visual de estresse, biblioteca de ações possíveis e painel de combate com esboço da arma equipada, ataque, dano e estado de rachadura.

Para uma futura migração ao Foundry VTT, novas rolagens e conteúdos manuais devem manter categorias e metadados estruturados. A rolagem de iniciativa já é registrada como `kind: "initiative"` e usa `3d6 + MOD REF`, ajustando para `2d6` em colapso ou `4d6` com saturação máxima.

Essas fórmulas são uma primeira versão para ferramenta de mesa e podem ser ajustadas conforme o sistema Solaris for consolidado.
