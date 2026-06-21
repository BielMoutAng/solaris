# Solaris Guerra Solar - Fase 15: Loja Visual Avancada

Status: primeira versao alfa implementada no cache `20260621d`.

## Objetivo

Transformar a loja alfa da Mesa Virtual em uma tela mais organizada e visualmente proxima da referencia sci-fi do Solaris, preservando:

- modo offline/simulado;
- Solaris Biblioteca;
- Solaris Tabletop Alpha;
- ficha sincronizada;
- aprovacoes do mestre;
- campanhas, autosaves, snapshots e export/import.

## O que foi implementado

- Novo shell visual **Loja Solaris** dentro da Mesa Virtual.
- Sidebar de categorias com contagem por categoria.
- Modos de loja:
  - Biblioteca;
  - Sessao;
  - Mestre, visivel apenas para mestre.
- Topbar com busca, modo da loja e saldo em Luzentis.
- Filtros por tier, raridade, preco minimo, preco maximo, estoque e compatibilidade.
- Ordenacao por nome, preco, tier, raridade e categoria.
- Cards visuais com tamanho padronizado, imagem/icone, raridade, tier, categoria, resumo, fonte, preco e badges.
- Modal de detalhe do item com descricao, mecanica, compatibilidade, politica da sessao e acoes.
- Carrinho lateral com subtotal, taxa, total, saldo restante e aviso visual.
- Destino de armazenamento por item do carrinho:
  - sem local definido;
  - inventario;
  - ativo;
  - equipar apos compra;
  - mochila;
  - cubo;
  - coldre;
  - bandoleira;
  - gancho.
- O carrinho em sessao continua sendo enviado ao mestre pela camada de aprovacao.
- Mestre consegue ver carrinhos da mesa.
- Pedido de compra em carrinho agora aceita aprovacao ou rejeicao por item individual.
- Compra aprovada respeita o destino individual de cada linha.
- Mestre pode converter carrinho em pacote de loot.
- Item sem local definido continua sendo apenas aviso visual e nao bloqueia rolagens.
- Cache atualizado para `20260621d`.
- Solaris Tabletop Alpha atualizado para `0.6.0-alpha.7`.

## Eventos usados ou reaproveitados

- `shop:catalog:request`
- `shop:catalog:state`
- `shop:cart:update`
- `shop:cart:submit`
- `shop:purchase:request`
- `shop:purchase:approve`
- `shop:purchase:reject`
- `shop:item:details`
- `shop:item:compare`
- `shop:item:send-to-chat`
- `approval:request`
- `approval:approve`
- `approval:reject`
- `approval:state`
- `loot:create`
- `loot:distribute`
- `transaction:log`

Nesta fase, os eventos de detalhes, comparar e enviar ao chat sao tratados principalmente pela UI local. A aprovacao individual usa `approval:approve`/`approval:reject` com `shopLineId`.

## Como abrir

Com servidor:

```bash
npm run server:vtt
```

Depois:

```txt
http://localhost:3000/?view=mesaVirtual&check=20260621d
```

Sem servidor, a Mesa Virtual continua abrindo em modo offline/simulado e a loja compra localmente na ficha atual.

## Como usar

1. Abra a Mesa Virtual.
2. Localize o painel **Loja Solaris**.
3. Escolha o modo Biblioteca, Sessao ou Mestre.
4. Use busca, categorias e filtros.
5. Abra detalhes com o botao **Detalhes** ou duplo clique no card.
6. Adicione itens ao carrinho.
7. Escolha o destino de armazenamento em cada linha.
8. Como jogador conectado, solicite compra.
9. Como mestre, aprove o carrinho completo ou aprove/rejeite itens individuais.
10. Opcionalmente, converta o carrinho em loot.

## Persistencia

A fase reaproveita as estruturas ja persistidas:

- `shopState`;
- `approvals`;
- `lootPacks`;
- `transactionLog`;
- ficha sincronizada e `revision`.

Os destinos por linha viajam no carrinho e entram nos itens criados quando a compra e aprovada.

## Testes adicionados

- Aprovacao individual de item do carrinho.
- Respeito ao destino por linha ao criar item comprado.
- Rejeicao de linha sem adicionar item nem debitar valor extra.

## Limitacoes atuais

- A loja ainda usa catalogo local carregado pelo cliente; `shop:catalog:state` segue estrutural.
- Taxa aparece no visual, mas a regra economica ainda esta em `0%` por padrao.
- Compatibilidade e estoque sao heuristicas alfa, nao uma validacao completa das regras do Livro 5.
- Comparacao de equipamento ainda e resumida por notificacao.
- Carrinho por jogador e visivel ao mestre, mas edicao remota do preco/destino pelo mestre ainda deve ganhar formulario dedicado.

## Proxima etapa recomendada

- Criar editor de politica da loja para o mestre.
- Permitir alterar preco e disponibilidade por sessao.
- Criar drawer compacto para notebook pequeno.
- Adicionar comparacao mecanica real contra arma/armadura equipada.
- Persistir filtros favoritos do mestre por campanha.

## Continuacao na Fase 16

A Fase 16 (`20260621e`) usa a Loja Solaris como principal referencia visual acessivel no Figma e expande o mesmo padrao para o Tabletop:

- tokens globais `--solaris-*`;
- topbar e sidebars consistentes;
- paineis, cards e modais com a mesma linguagem sci-fi neon;
- scroll interno reforcado;
- responsividade para janelas menores do Electron.

Documentacao:

```txt
docs/FASE_16_PADRONIZACAO_VISUAL_GLOBAL.md
```
