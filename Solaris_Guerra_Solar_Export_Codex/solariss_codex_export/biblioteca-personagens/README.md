# Biblioteca de Personagens Solaris

App local para criar, salvar, exportar e imprimir fichas de personagem de Solaris.

## Abrir

Abra `index.html` no navegador.

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

As bibliotecas de armas, armaduras e itens permitem comprar com o dinheiro da ficha. A compra debita o valor e coloca o equipamento no inventário do personagem, onde armas e armaduras podem ser equipadas e itens podem ser guardados no cubo.

Também há bibliotecas laterais de Magias cósmicas e Chips modificadores. Ao adicionar uma magia ou chip, ele aparece na página Habilidades da ficha com nome, fonte e efeito.

Na página do personagem, as abas Habilidades, Dados e Criar permitem revisar todas as habilidades atuais, rolar dados com histórico em chat e inserir manualmente itens, armas, armaduras, magias, chips ou habilidades personalizadas. Itens no inventário podem ser vendidos com valor editável, e a aba Equipamentos tem um campo de nível de Rachadura.

Essas fórmulas são uma primeira versão para ferramenta de mesa e podem ser ajustadas conforme o sistema Solaris for consolidado.
