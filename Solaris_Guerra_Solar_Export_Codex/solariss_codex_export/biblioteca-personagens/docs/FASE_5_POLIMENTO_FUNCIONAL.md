# Solaris Guerra Solar - Fase 5: Polimento Funcional da Mesa Virtual

Status: alfa implementada em `20260620d`.

## Objetivo

Evoluir a Mesa Virtual de alfa funcional para uma experiencia mais confortavel de jogo, mantendo o modo offline da ficha local.

## Mapa tatico avancado

- Upload/seleção de battlemap pelo mestre.
- Grid configuravel por colunas, linhas, escala em metros, visibilidade, opacidade e snap.
- Medidor de distancia com casas e metros.
- Movimento de token com aviso quando excede o MOV, sem bloquear.
- Areas de efeito: circulo, cone e linha.
- Limpeza de areas e medidas.
- Ocultar/revelar token.
- Objetivos com progresso atual/maximo.
- Cena filtrada por jogador: mestre ve tudo; jogador nao recebe elementos ocultos no payload.

## Loja e loot

- Modal de detalhe de item dentro da Mesa Virtual.
- Destino de armazenamento na compra: sem local definido, ativo, mochila, cubo, coldre, bandoleira ou gancho.
- Carrinhos de jogadores visiveis ao mestre.
- Janela dedicada de distribuicao de loot.
- Criacao de pacote com Luzentis, item oficial ou item manual.
- Distribuicao de loot para personagem e destino escolhido.
- Loot pendente automatico quando monstro chega a 0 PV.

## Ficha de monstro refinada

- Modal de ficha de monstro dentro da mesa.
- Exibe retrato, tier/papel/tipo, PV, CA, movimento, iniciativa, sentidos, habitat, ataques, habilidades e notas.
- Botoes para atacar, rolar dano, aplicar dano, curar, aplicar condicao, criar loot e remover da cena.
- Ataques e danos entram no chat/log como rolagens compartilhadas.

## Eventos novos

- `scene:map:update`
- `scene:grid:update`
- `scene:measurement:create`
- `scene:measurement:clear`
- `scene:area:create`
- `scene:area:update`
- `scene:area:delete`
- `scene:visibility:update`
- `scene:objective:create`
- `scene:objective:update`
- `scene:objective:delete`
- `shop:item:details`
- `shop:cart:state`
- `shop:cart:submit`
- `shop:cart:approve`
- `shop:cart:reject`
- `loot:pack:create`
- `loot:pack:update`
- `loot:pack:distribute`
- `loot:monster:defeated`

## Build tabletop

A build Windows da Mesa Virtual agora usa o produto `Solaris Tabletop Alpha` e abre direto em:

```txt
http://localhost:3000/?view=mesaVirtual&tabletop=1&check=20260620d
```

No Electron, a build tabletop tenta iniciar o servidor local embutido. Se isso falhar, abre o app em modo offline/simulado na propria Mesa Virtual.

## Validacao

Testes automatizados adicionados:

- cena aceita imagem de mapa;
- grid atualiza;
- medicao calcula casas e metros;
- area circular cria e atualiza;
- objetivo cria e atualiza progresso;
- visibilidade filtra token oculto para jogador;
- movimento acima do MOV gera aviso;
- compra aprovada respeita destino de armazenamento;
- monstro derrotado cria loot pendente automaticamente.

## Limitacoes atuais

- Areas de efeito ainda sao visuais e nao aplicam dano automatico.
- A distribuicao de loot em massa ainda e simples.
- A ficha de monstro rola ataque/dano, mas aplicar dano em alvo selecionado fica para etapa posterior.
- Linha de visao e paredes ainda nao foram implementadas.

## Proxima etapa recomendada

- Selecao de alvo no mapa.
- Aplicar dano automatico a partir de ataque/area.
- Biblioteca visual de mapas/tokens.
- Painel do mestre com controle de encontros, cenas e notas secretas.
