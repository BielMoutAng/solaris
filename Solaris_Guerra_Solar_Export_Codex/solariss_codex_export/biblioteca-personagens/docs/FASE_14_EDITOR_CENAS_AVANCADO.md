# Solaris Guerra Solar - Fase 14: Editor Avancado de Cenas

Status: primeira versao alfa implementada no cache `20260621c`.

## Objetivo

Evoluir o Editor Visual de Cena da Mesa Virtual para preparar mapas com menos prompts e mais manipulacao direta, sem quebrar:

- modo offline/simulado;
- servidor local via `npm run server:vtt`;
- tela de campanhas;
- salvamento, autosave, snapshot e export/import;
- separacao entre Solaris Biblioteca e Solaris Tabletop Alpha.

## O que foi implementado

- Selecao de elementos diretamente no preview da cena.
- Reposicionamento por arrastar dentro do editor visual.
- Formulario contextual para editar elementos da cena.
- Edicao detalhada de objetivos.
- Edicao detalhada de zonas.
- Edicao detalhada de areas de efeito.
- Edicao detalhada de tokens e marcadores.
- Botao para criar area de efeito no editor.
- Listas de objetivos, zonas, areas e tokens com botao `Editar`.
- Destaque visual do elemento selecionado.
- Preservacao dos dados editados em `sceneList`, cena ativa, snapshots e export/import.
- Cache atualizado para `20260621c`.
- Versao do Tabletop Alpha atualizada para `0.6.0-alpha.6`.

## Editor de elementos

Objetivos agora podem editar:

- titulo;
- descricao;
- progresso atual/maximo;
- posicao;
- cor;
- icone;
- recompensa;
- notas do mestre;
- concluido;
- visibilidade.

Zonas agora podem editar:

- nome;
- tipo;
- formato;
- posicao;
- largura e altura;
- direcao;
- opacidade;
- cor;
- duracao;
- descricao;
- efeito mecanico;
- visibilidade.

Areas agora podem editar:

- nome;
- tipo: circulo, cone ou linha;
- posicao;
- raio;
- comprimento;
- largura;
- direcao;
- cor;
- origem;
- visibilidade.

Tokens agora podem editar:

- nome;
- tipo de entidade;
- ID vinculado;
- posicao;
- tamanho;
- movimento;
- cor;
- imagem;
- oculto;
- travado;
- notas.

## Interacao no preview

- Clique em token, zona, area ou objetivo para selecionar.
- Arraste o elemento no mapa para reposicionar.
- A posicao salva respeita os limites de colunas e linhas da cena.
- O elemento selecionado recebe destaque dourado.

## Testes adicionados

Foi adicionado teste para garantir que edicoes granulares de zona, area, objetivo e token:

- passam por `GM_SCENE_UPDATE`;
- atualizam a cena ativa;
- persistem em `sceneList`;
- sobrevivem ao snapshot migrado da sessao.

## Validacao esperada

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
```

## Limitacoes atuais

- O drag-and-drop ainda e por celula, sem rotacionador visual para cones/linhas.
- Areas criadas pelo editor usam defaults simples e depois devem ser ajustadas no formulario.
- O editor ainda nao importa/exporta pacotes reutilizaveis de cena + encontro em um unico arquivo.
- O relatorio visual em PDF/HTML estilizado segue como etapa futura.

## Proxima etapa recomendada

- Importar/exportar cenas e encontros como pacotes reutilizaveis.
- Rotacionador visual para cones e linhas.
- Editor visual de posicoes iniciais dos monstros dentro do encontro preparado.
- Relatorio visual com identidade Guerra Solar.

Continuacao implementada depois: a Fase 15 (`20260621d`) refinou a Loja Solaris do Tabletop, mantendo o mesmo cuidado de UI com paineis contidos, scroll interno e controles granulares.

Continuacao visual: a Fase 16 (`20260621e`) aplica a linguagem global `solaris-*` aos editores, modais grandes e barras do Tabletop, preservando a manipulacao visual de cena.
