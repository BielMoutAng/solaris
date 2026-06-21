# Solaris Guerra Solar - Fase 10: Painel do Mestre

Status: primeira versao alfa implementada no cache `20260620h`.

## Objetivo

Criar uma area dedicada para o mestre preparar e conduzir sessoes no Solaris Tabletop Alpha, sem quebrar a ficha online e sem quebrar o modo offline/simulado.

## O que foi implementado

- Botao **Painel do Mestre** na Mesa Virtual.
- Modal privado para mestre com abas:
  - Resumo;
  - Cenas;
  - Encontros;
  - Notas;
  - Contadores;
  - Ambiente;
  - Escudo;
  - Logs.
- Notas secretas com criar, revelar aos jogadores e excluir.
- Contadores secretos com criar, incrementar, reduzir, revelar e excluir.
- Efeitos ambientais com criar e remover.
- Cenas salvas com criar, salvar cena atual, trocar cena ativa e excluir cena nao ativa.
- Encontros preparados com criar, iniciar, concluir e excluir.
- Ao iniciar encontro preparado, os monstros entram na cena, aparecem no combate e geram token.
- Relatorio da sessao exportado em Markdown.
- Estado do mestre salvo junto com campanhas, autosaves, snapshots e exportacao/importacao JSON.
- Servidor filtra dados privados: jogador so recebe notas, contadores e efeitos revelados/visiveis.
- Layout do VTT ganhou contencao de caixas e rolagem interna para listas longas.

## Eventos novos

- `gm:dashboard:state`
- `gm:note:create`
- `gm:note:update`
- `gm:note:delete`
- `gm:note:reveal`
- `gm:counter:create`
- `gm:counter:update`
- `gm:counter:delete`
- `gm:counter:tick`
- `gm:counter:reveal`
- `gm:environment:create`
- `gm:environment:update`
- `gm:environment:delete`
- `gm:scene:create`
- `gm:scene:update`
- `gm:scene:delete`
- `gm:scene:switch`
- `gm:encounter:create`
- `gm:encounter:update`
- `gm:encounter:delete`
- `gm:encounter:start`
- `gm:encounter:complete`
- `gm:report:export`

## Como testar

1. Rodar `npm run server:vtt`.
2. Abrir `http://localhost:3000/?view=mesaVirtual&tabletop=1&check=20260620h`.
3. Criar sala.
4. Clicar em **Painel do Mestre**.
5. Criar nota, contador, efeito ambiental, cena e encontro.
6. Revelar uma nota ou contador e conferir log/chat.
7. Trocar cena salva.
8. Iniciar encontro preparado e confirmar monstro/token na cena.
9. Exportar relatorio.
10. Salvar sessao, recarregar e restaurar para confirmar persistencia.

## Limitacoes atuais

- Edicao completa de cenas e encontros ainda usa prompts simples.
- O Escudo do Mestre possui conteudo inicial de referencia rapida e deve ser conectado ao compendio oficial em uma fase posterior.
- Relatorio e exportado localmente pelo host; o retorno do evento `gm:report:export` no servidor ainda e estrutural.
- A interface ainda e alfa, mas os quadros agora possuem rolagem interna para evitar sobreposicao.

Observacao: estas limitacoes eram da Fase 10. A Fase 11 substituiu os prompts principais por formularios dedicados, adicionou a tela **Minhas Campanhas**, conectou o Escudo ao compendio quando ha dados estruturados e refinou o relatorio.

## Proxima etapa recomendada

- Criar tela inicial de campanhas fora do modal.
- Trocar prompts por formularios dedicados.
- Criar gerador de encontro com filtros do bestiario.
- Conectar o Escudo do Mestre ao compendio oficial estruturado.
- Separar rotas web publicas da ficha e do VTT quando a versao alfa estiver madura.

Continuacao implementada:

```txt
docs/FASE_11_CONSOLIDACAO_MESTRE.md
```
