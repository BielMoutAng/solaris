# Solaris Guerra Solar - Fase 7: Previa de areas e executavel VTT

Status: primeira versao implementada em `20260620f`.

## Objetivo

Melhorar a leitura tatica antes de aplicar dano, permitindo que o mestre veja quais tokens serao atingidos por uma area e escolha direcoes simples para cones e linhas.

## O que foi implementado

- Areas de efeito mantem uma direcao estruturada:
  - `east`;
  - `west`;
  - `north`;
  - `south`.
- Ao criar cone ou linha, o mestre escolhe a direcao.
- O mapa mostra a direcao da area selecionada.
- Tokens dentro da area selecionada recebem destaque visual de impacto.
- A legenda do mapa lista os nomes dos tokens atingidos pela area.
- O botao `Dano na area` continua aplicando dano somente nos tokens atingidos.
- O dominio calcula areas direcionais, entao a regra pode ser testada sem depender da tela.

## Regras atuais

- Circulo continua usando raio a partir do centro.
- Linha usa comprimento na direcao escolhida e largura transversal.
- Cone usa comprimento na direcao escolhida e abertura proporcional ate a largura final.
- A direcao padrao e `east` quando nenhuma direcao e informada.

## Build

A versao de teste do executavel passa a ser:

```txt
Solaris Tabletop Alpha Setup 0.6.0-alpha.3.exe
```

Essa build abre direto na Mesa Virtual:

```txt
http://localhost:3000/?view=mesaVirtual&tabletop=1&check=20260620f
```

## Limitacoes atuais

- Ainda nao existe rotacionador visual com setas dentro do mapa.
- A previa usa tokens dentro da geometria da area, mas ainda nao considera paredes/linha de visao.
- Resistencias, vulnerabilidades e condicoes secundarias ainda precisam ser resolvidas manualmente.

## Proxima etapa recomendada

- Criar controles visuais de rotacao para cone/linha.
- Previa de cobertura e linha de visao.
- Automatizar resistencias/vulnerabilidades ao aplicar dano.
- Permitir ataques completos de personagens jogadores contra monstros pelo mapa.
