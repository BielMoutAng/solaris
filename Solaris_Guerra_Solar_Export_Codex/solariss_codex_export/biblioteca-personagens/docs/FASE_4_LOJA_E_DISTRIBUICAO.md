# Solaris Guerra Solar - Fase 4: Loja, Loot e Distribuicao em Sessao

Status: alfa implementada em `20260620c` e refinada no cache `20260620d`.

## Objetivo

Adicionar uma camada de economia compartilhada na Mesa Virtual sem quebrar o modo offline da ficha local.

## O que foi implementado

- Painel **Loja da Sessao** dentro da Mesa Virtual.
- Busca, filtros por categoria/tier e ordenacao.
- Paginacao com `paginateItems(items, page, pageSize = 20)`.
- Cards de loja com nome, categoria, tier, resumo, fonte e preco em Luzentis.
- Carrinho com quantidade, total, saldo e saldo restante.
- Compra offline direta em modo simulado.
- Compra em sessao como pedido para o mestre, usando a base de aprovacoes.
- Venda e exclusao em sessao como pedidos ao mestre.
- Estado de sala com `shopState`, `lootPacks` e `transactionLog`.
- Painel **Distribuicao de Loot** com criacao e distribuicao de pacotes.
- Janela dedicada de loot para criar pacote, adicionar Luzentis, item oficial ou item manual e escolher destino.
- Modal de detalhe de item dentro da Mesa Virtual.
- Compra com destino de armazenamento.
- Loot automatico pendente quando monstro derrotado chega a 0 PV.
- Logs de transacao enviados ao chat/historico.
- Integracao com ficha sincronizada: compra/loot adicionam itens ao inventario e incrementam a revisao.

## Eventos novos

- `shop:catalog:request`
- `shop:catalog:state`
- `shop:cart:update`
- `shop:purchase:request`
- `shop:purchase:approve`
- `shop:purchase:reject`
- `shop:purchase:complete`
- `shop:sell:request`
- `shop:sell:approve`
- `shop:sell:reject`
- `shop:sell:complete`
- `shop:delete:request`
- `shop:delete:approve`
- `shop:delete:reject`
- `loot:create`
- `loot:update`
- `loot:delete`
- `loot:assign`
- `loot:claim`
- `loot:distribute`
- `loot:state`
- `transaction:log`

## Como testar

1. Rodar `npm run server`.
2. Abrir `http://localhost:3000/?view=mesaVirtual&check=20260620d`.
3. Abrir **Mesa Virtual**.
4. Criar sala como Mestre.
5. Em outra aba, entrar como Jogador.
6. Abrir a **Loja da Sessao**.
7. Buscar item, filtrar e adicionar ao carrinho.
8. Jogador solicita compra.
9. Mestre aprova no painel de aprovacoes.
10. Conferir Luzentis debitados, item no inventario e log/chat.
11. Solicitar venda/exclusao e aprovar como Mestre.
12. Criar pacote de loot e distribuir para personagem.
13. Fechar o servidor e confirmar que a Mesa Virtual segue abrindo em modo simulado.

## Limitacoes da alfa

- O carrinho e local ao cliente; em sessao ele envia o pedido para o mestre.
- Compra/venda/exclusao usam a camada generica de aprovacoes.
- Ainda falta uma tela dedicada para editar pacote de loot com varios destinatarios e divisao automatica.
- Regras finas de requisito e espaco ainda devem ser refinadas na proxima etapa.

## Proxima etapa recomendada

- Criar modal completo de detalhes de item dentro da Mesa Virtual.
- Trocar prompts de loot por uma janela dedicada.
- Permitir carrinho por jogador visivel ao mestre em tempo real.
- Integrar loot automatico de monstro derrotado diretamente aos pacotes pendentes.
- Adicionar compra em lote com selecao de destino: inventario, mochila, cubo, coldre, bandoleira ou gancho.
