# Fase 27A - Nova tela de sessao da mesa virtual

Status: iniciada no cache `20260624h`.

Versao local: `0.6.0-alpha.22`.

## Entrega desta etapa

Esta etapa adiciona o mapa **Nave Caida - Destrocos** como asset local da Mesa Virtual:

- arquivo local: `assets/maps/nave-caida.png`;
- cena padrao do dominio: `SOLARIS_DEFAULT_SCENE`;
- mapa padrao: `SOLARIS_DEFAULT_MAPS.CRASHED_SHIP`;
- grid padrao: 24 colunas por 16 linhas;
- modo offline/simulado abre com a nave caida;
- salas novas sem cena explicita tambem usam esse mapa;
- o asset entrou no service worker para a versao web/cacheada.

## O que ficou preservado

- Solaris Biblioteca;
- Launcher;
- Mesa Virtual offline;
- Mesa Virtual com servidor local;
- campanhas, sessoes, autosaves, snapshots e export/import;
- fichas, combate, equipamentos, bestiario, Guia do Mestre e Lore.

## Proxima etapa recomendada

Continuar a Fase 27A visual completa:

- grid dominante central em estilo VTT;
- tokens posicionaveis mais refinados;
- menu circular de cenas;
- painel lateral direito por abas;
- chat/rolagens acoplados ao mapa;
- gerenciamento de personagens, combate, iniciativa e itens dentro da nova tela.
