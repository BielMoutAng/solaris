# Fase 13 - Ficha virtual: armas, municao e carregadores

Status: implementado no cache `20260621b`.

## Objetivo

Separar arma, municao, carregador e local de armazenamento dentro da ficha virtual. A arma nao guarda mais toda a municao de forma generica: a fonte de alimentacao passa a ser o carregador, o tambor interno, o tubo interno, a celula interna, a cinta ou a carga unica.

## Modelos adicionados ao dominio

- `AMMO_KINDS`: tipos de municao, como leve, media, cartucho, celula de energia, granada e foguete.
- `FEED_SYSTEMS`: sistemas de alimentacao, como carregador removivel, tambor interno, tubo interno, carga unica, celula e cinta.
- `FIRE_MODE_IDS` e `FIRE_MODES`: modos de disparo oficiais.
- `createWeaponAmmoState`: cria o estado inicial de municao de uma arma.
- `createMagazineInstance`: cria uma instancia de carregador com municao propria.
- `attachMagazineToWeapon` e `detachMagazineFromWeapon`: acoplam e removem carregadores sem perder a municao.
- `loadAmmoIntoMagazine`: transfere municao de uma pilha para um carregador.
- `reloadInternalWeapon`: recarrega arma de tambor, tubo, celula, cinta ou carga unica.
- `fireWeapon`: consome a quantidade certa de municao conforme o modo de disparo.
- `pumpWeapon`: libera armas que precisam bombear depois do disparo.
- `ammoCubeUnitsFor`: calcula unidades de cubo para pilhas e carregadores.

## Modos de disparo

- Tiro: consome 1.
- Rajada: consome 4, marca vantagem e deixa +1 dado de dano pendente.
- Rajada pesada: consome 4, marca desvantagem e deixa +3 dados de dano pendentes.
- Cone de escopeta: consome 1 e informa que o alvo testa JPR.
- Lancador: consome 1.
- Rajada de metralhadora: consome 6.
- Supressao: consome 10 e informa que o alvo testa JPR.

## Interface da ficha

Na aba de equipamentos, a arma equipada agora mostra:

- fonte ativa de municao;
- quantidade atual e maxima;
- aviso de sem carregador;
- aviso de precisa bombear;
- botoes de disparo;
- botao de bombear;
- botoes de criar, colocar, remover e municiar carregador;
- botao para adicionar pilha de municao compativel;
- recarga interna para revolveres, escopetas, lancadores, armas de celula e armas de cinta.

Tambem foi adicionada a secao `Municao e carregadores`, que lista pilhas e carregadores como itens da ficha.

## Biblioteca Solaris

A biblioteca de armas agora usa a mesma arquitetura da ficha virtual.

- Cards de armas mostram um resumo curto do sistema de municao.
- A loja inclui carregador, capacidade resumida e preco na mesma linha de metadados.
- O duplo clique no nome da arma abre a janela de detalhes com `Perfil de municao e carregador`.
- O guia de uso da arma explica alimentacao, carregador/recarga, modos de disparo e regra de cubo de municao.
- A biblioteca usa `ammoProfile` quando existir; quando nao existir, infere o perfil inicial pelo nome, categoria e tags da arma.

## Regras preservadas

- Nao dispara sem municao.
- Nao dispara rajada com menos municao que o custo.
- Nao aceita municao incompativel.
- Nao aceita carregador em revolver ou arma interna.
- Carregador removido preserva a municao restante.
- Arma travada, superaquecida ou precisando bombear nao dispara.
- Armas corpo a corpo nao exibem painel de municao.

## Observacoes

A inferencia inicial usa nome, categoria e tags da arma. Quando o Livro 5 tiver campos oficiais separados para tipo de alimentacao e tipo de municao, esses campos devem alimentar `ammoProfile` diretamente.
