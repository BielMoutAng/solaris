# Solaris Guerra Solar - Fase 6: Alvos e dano tatico

Status: primeira versao implementada em `20260620e`.

## Objetivo

Transformar o mapa tatico da Mesa Virtual em uma superficie de combate mais jogavel, permitindo escolher alvo e aplicar dano de ataque ou area sem depender apenas de prompts soltos.

## O que foi implementado

- Modo `Alvo` no mapa tatico.
- Clique em token durante o modo alvo marca quem recebera ataque/dano.
- Token alvo recebe destaque visual proprio.
- Cards de combatente possuem botao `Alvo` para marcar alvo sem depender do mapa.
- A ficha modal de monstro ganhou:
  - `Atacar Alvo`: rola ataque e compara com a CA do alvo quando ela existe.
  - `Dano no Alvo`: rola o dano do ataque e aplica automaticamente no alvo marcado.
- Acoes rapidas do mapa ganharam:
  - `Dano no alvo`;
  - `Dano na area`.
- Areas de efeito agora sao clicaveis e podem ser selecionadas.
- Dano de area aplica dano aos tokens dentro da area selecionada.
- Logs de dano agora registram a fonte, como `Pulso cosmico`, `Rifle de teste` ou o nome do ataque do monstro.

## Regras de area nesta alfa

- Circulo: mede distancia do centro ate o token e compara com o raio.
- Linha: usa comprimento e largura a partir do ponto inicial.
- Cone: usa uma aproximacao triangular voltada para a direita do ponto inicial.

Essas regras sao simples e previsiveis para a alfa. Linha de visao, rotacao de cone e paredes ficam para uma etapa posterior.

## Modo online e offline

- Com servidor conectado, o dano usa os eventos ja existentes de `character:damage` e `monster:damage`.
- Sem servidor, o dano altera o estado local/simulado e continua sem quebrar a ficha local.
- Item sem local definido continua sendo apenas aviso visual e nao bloqueia rolagens, ataques ou dano.

## Testes adicionados

- Calculo de tokens dentro de area circular.
- Calculo basico de cone.
- Dano em personagem com fonte no log.
- Dano em monstro com fonte no log.
- Recriacao de `Scene` serializada mantendo o calculo de area.

## Limitacoes atuais

- Previa de quais tokens serao atingidos antes de confirmar o dano: implementada na Fase 7.
- Cone e linha agora possuem direcao simples na Fase 7, mas ainda nao possuem rotacionador visual.
- Ataque de monstro compara com CA, mas nao aplica dano automaticamente ao acertar; o mestre ainda decide apertar `Dano no Alvo`.
- Efeitos secundarios, condicoes e resistencias ainda nao sao resolvidos automaticamente.

## Proxima etapa recomendada

- Controles visuais de rotacao/direcao para cones e linhas.
- Aplicar condicoes a partir de habilidades.
- Seletor de alvo para personagens jogadores atacarem monstros.
- Painel do mestre com encontros, cenas e notas secretas.
