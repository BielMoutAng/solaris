# Biblioteca de Personagens Solaris

App local para criar, salvar, exportar e imprimir fichas de personagem de Solaris.

## Abrir

Abra `index.html` no navegador.

## Mesa Virtual / Tabletop

A Mesa Virtual fica disponivel pela tela `Mesa virtual` do app e tambem pode abrir direto com:

```txt
http://localhost:3000/?view=campaigns&check=20260622f
```

Ela possui modo offline/simulado quando nao ha servidor e modo multiplayer quando `npm run server:vtt` esta ativo. A fase atual inclui sala, jogadores, chat, rolagens, ficha sincronizada, combate, monstros, loja, loot, mapa tatico, selecao de alvo, dano automatico no alvo ou em areas, previa visual de tokens atingidos por areas, persistencia local de campanhas/sessoes e Painel do Mestre com notas, contadores, cenas, encontros, gerador de encontros, editores visuais de cena/encontro, escudo rapido conectado ao compendio quando houver dados estruturados e relatorio com preview antes de salvar/exportar.

O Solaris Tabletop Alpha abre pela tela **Minhas Campanhas**. Ali voce pode criar campanha, continuar sessao salva, editar detalhes, duplicar, excluir com confirmacao forte, exportar/importar JSON e restaurar autosaves. Dentro da mesa, o botao **Minhas Campanhas** volta para essa entrada e o botao **Painel do Mestre** abre as ferramentas privadas do mestre.

A versao `0.6.0-alpha.13` adiciona o refinamento **Desktop-first** do Tabletop. No PC/Windows, a mesa prioriza o palco/mapa central, controles de grade como sobreposicao, laterais como docks independentes, topo mais compacto, barra inferior mais baixa e paineis com rolagem interna. A estrutura responsiva para iPhone/PWA continua preservada.

Rotas uteis no navegador:

- `?view=ficha`: abre a ficha/biblioteca.
- `?view=mesaVirtual`: abre diretamente a mesa.
- `?view=campaigns`: abre a tela Minhas Campanhas do Tabletop.

## iPhone e Android

O app pode ser usado como PWA quando publicado pelo GitHub Pages. No iPhone, abra `https://bielmoutang.github.io/solaris/` no Safari, toque em Compartilhar e escolha Adicionar a Tela de Inicio. Depois disso ele abre como um app instalado.

Cada aparelho salva suas proprias fichas localmente no navegador. Para levar uma ficha para outro celular ou PC, use `Exportar` e depois `Importar`.

## Aplicativo Windows

Agora existem dois aplicativos Windows separados no mesmo projeto:

- `Solaris Biblioteca`: ficha local/online, bibliotecas e PWA.
- `Solaris Tabletop Alpha`: Mesa Virtual / VTT com servidor local embutido.

Comandos da ficha:

- `npm run start:ficha`: abre a ficha em modo desktop.
- `npm run dist:ficha`: gera instalador e portatil em `dist-ficha/`.

Comandos do VTT:

- `npm run start:vtt`: abre a Mesa Virtual em modo desktop.
- `npm run server:vtt`: sobe o servidor local da mesa.
- `npm run dist:vtt`: gera instalador e portatil em `dist-vtt/`.

Aliases mantidos:

- `npm start`: aponta para a ficha.
- `npm run server`: aponta para o servidor da mesa.
- `npm run dist`: aponta para o build da ficha.

Cada computador salva as proprias fichas localmente. Para mover uma ficha entre PCs, use `Exportar` e `Importar`.

Como o app ainda nao tem assinatura digital paga, o Windows pode exibir aviso de seguranca ao abrir o instalador. Isso e esperado em builds locais sem certificado.

## Dados salvos

As fichas ficam no `localStorage` do navegador. Use `Exportar` para guardar uma ficha em JSON e `Importar` para carregar esse arquivo depois.

As imagens de personagem são redimensionadas no navegador e salvas junto com a ficha. Você pode clicar na área da foto ou arrastar um arquivo de imagem para dentro dela.

Na biblioteca de raças, clique em qualquer card para abrir uma página interna com perfil, criação, fraqueza, habilidade base, progressão por nível e notas dos documentos oficiais.

## Fórmulas atuais

- Atributos iniciais da ficha: `7`
- Limite dos atributos no campo numérico: `0` a `20`
- MOD de atributo: `INT((valor final - 10) / 2)`
- PV inicial: `8 + vida adicional por MOD CON + bônus racial`, usando o valor máximo dos dados no nível 1
- PV depois do nível 1: cálculo provisório mantido enquanto os Livros 1 e 2 não consolidam uma fórmula única
- PV atual: campo editável exibido como `PV atual / PV máximo`
- Cosmos máximo: `Cosmos base do nível + MOD MEN + bônus racial + bônus de equipamento`
- CA: `4 + MOD REF + armadura equipada + mods`
- Movimento: `6 + MOD REF + bônus racial/equipamento`
- Slots de cubo: `5 + MOD FOR + bônus racial + bônus do chip`
- Carga máxima: `metade do peso corporal + MOD FOR * 10 kg`
- Estresse máximo padrão na ficha: `6`
- Testes comuns: `3d6 + MOD + bônus situacional`; com Estresse 6 usa `2d6`
- Ataques: `1d20 + modificador`; 20 natural é crítico e 1 natural é erro crítico
- Iniciativa: `1d20 + MOD REF`
- Rachaduras: cada item possui sua própria trilha e colapsa em `5`

As bibliotecas de armas, armaduras e itens permitem comprar com os Luzentis (ℓ) da ficha. A compra debita o valor e coloca o equipamento no inventário do personagem, onde armas e armaduras podem ser equipadas e itens podem ser guardados no cubo. As bibliotecas também têm busca, filtro por tier/rank/custo/categoria conforme o tipo de conteúdo, e ordenação por tier, preço ou ordem alfabética.

A biblioteca de armas, armaduras, itens, materiais, cubos, chips e mods é carregada de `official-book5-catalog.js`, gerado diretamente do documento oficial `livro 5 tabelas.docx`.

Itens podem ser organizados em cubos, ganchos, coldres e bandoleiras. Na tela de equipamentos, arraste um item compatível até um suporte com espaço livre. Consumíveis recebem uma etiqueta própria e são removidos automaticamente do inventário ao serem usados.

O botão `Evoluir` aplica a progressão oficial do Livro 1: confere XP total, materiais, custo, tempo e Estação de Evolução; sorteia o benefício do novo nível; registra escolhas e aplica automaticamente efeitos permanentes bem definidos.

Também há bibliotecas laterais de Magias cósmicas e Chips modificadores. Ao adicionar uma magia ou chip, ele aparece na página Habilidades da ficha com nome, fonte e efeito.

Na página do personagem, as abas Habilidades, Dados e Criar permitem revisar todas as habilidades atuais, rolar dados com histórico em chat e inserir manualmente itens, armas, armaduras, magias, chips ou habilidades personalizadas. Toda rolagem também exibe uma animação holográfica de dados sobre a tela. A aba Criar muda o formato do formulário conforme o tipo selecionado, seguindo o padrão das bibliotecas oficiais. Itens, armas e armaduras criados manualmente podem receber imagem por clique ou arrastar e soltar. Itens no inventário podem ser vendidos com valor editável, e armas, armaduras, cubos e itens possuem Rachaduras individuais.

A ficha também tem testes rápidos por atributo, perícia e jogada de proteção, HUD visual de estresse, biblioteca de ações possíveis e painel de combate com esboço da arma equipada, ataque, dano e estado de rachadura.

Para uma futura migração ao Foundry VTT, novas rolagens e conteúdos manuais devem manter categorias e metadados estruturados. A rolagem de iniciativa já é registrada como `kind: "initiative"` e usa `1d20 + MOD REF`.

Essas fórmulas são uma primeira versão para ferramenta de mesa e podem ser ajustadas conforme o sistema Solaris for consolidado.
