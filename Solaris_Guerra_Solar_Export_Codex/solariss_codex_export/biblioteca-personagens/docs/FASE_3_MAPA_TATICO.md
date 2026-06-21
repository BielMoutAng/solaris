# Solaris Guerra Solar - Fase 3: Mapa Tatico

Status: primeira versao implementada em `20260620a` e expandida no cache `20260620d`.

## Objetivo

Transformar o placeholder central da Mesa Virtual em um mapa tatico funcional, mantendo o modo offline/simulado intacto.

## O que foi implementado

- Cena com grid configuravel por colunas, linhas, escala, opacidade e visibilidade.
- Upload/selecao de imagem de battlemap.
- Medidor de distancia com casas e metros.
- Movimento com aviso quando excede o MOV.
- Areas visuais de efeito: circulo, cone e linha.
- Ocultar/revelar elementos para jogadores.
- Objetivos com progresso atual/maximo.
- Tokens de personagens e monstros no estado compartilhado da sala.
- Criacao automatica de token quando uma ficha entra na mesa.
- Criacao automatica de token quando o mestre adiciona um monstro.
- Remocao do token quando o monstro sai da cena.
- Movimento de token por clique no grid.
- Movimento de token por arrastar e soltar.
- Permissao preservada:
  - mestre move qualquer token;
  - jogador move apenas o proprio token;
  - monstro continua sob controle do mestre.
- Zonas visuais de cena:
  - perigo;
  - cobertura.
- Objetivos posicionaveis no mapa.
- Log/chat quando um token se move.
- Modo offline com mapa local simulado, tokens, perigo, cobertura e objetivo.

## Eventos usados

- `scene:update`
- `token:move`
- `monster:create`
- `monster:delete`

Esses eventos continuam passando pelo mesmo servidor WebSocket opcional da Mesa Virtual.

## Estrutura de cena

A cena agora pode carregar:

- `columns`;
- `rows`;
- `gridSize`;
- `tokens`;
- `zones`;
- `objectives`;
- `mapImage`;
- `notes`.

Cada token guarda:

- `id`;
- `entityType`;
- `entityId`;
- `name`;
- `x`;
- `y`;
- `size`;
- `image`;
- `color`;
- `hidden`;
- `locked`;
- `metadata`.

## Como testar

1. Rodar `npm run server`.
2. Abrir `http://localhost:3000/?view=mesaVirtual&check=20260620e`.
3. Abrir **Mesa Virtual**.
4. Criar sala.
5. Conferir se o personagem atual aparece como token no mapa.
6. Clicar no token.
7. Clicar em outra casa do grid.
8. Conferir se o token move e o chat registra o movimento.
9. Adicionar monstro pelo painel de combate.
10. Conferir se o monstro aparece no mapa.
11. Tentar mover token de monstro como jogador: deve ser bloqueado pelo servidor.
12. Testar sem servidor: o mapa deve continuar funcionando em modo local.

## Limitacoes atuais

- Areas ainda nao aplicam dano automatico.
- Ainda nao existe linha de visao.
- Objetivos possuem progresso, mas ainda nao disparam automacoes de missao.

## Proxima etapa recomendada

Evoluir a Fase 3 para uma tela tatica mais completa:

- upload/seleção de imagem de mapa;
- medidor de distancia;
- areas circulares/cone/linha para ataques e magias;
- controle de visibilidade para mestre;
- objetivos com progresso sincronizado;
- vincular movimento ao valor de MOV do personagem.
