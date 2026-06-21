# Solaris Guerra Solar - Fase 11: Consolidacao do Mestre

Status: primeira versao funcional implementada no cache `20260620i`.

## Objetivo

Transformar o Painel do Mestre alfa em uma ferramenta mais confortavel para campanha real, preservando:

- modo offline/simulado;
- Solaris Biblioteca;
- Solaris Tabletop Alpha;
- campanhas, autosaves, snapshots e export/import da Fase 9;
- eventos e permissoes do Painel do Mestre da Fase 10.

## O que foi implementado

- Tela dedicada **Minhas Campanhas** em `?view=campaigns`.
- Cards de campanha com nome, sistema, descricao, ultima sessao, ultimo salvamento, schema, sessoes, cenas, personagens, autosaves e snapshots.
- Acoes de campanha: criar, continuar, editar detalhes, duplicar, exportar, importar e excluir com confirmacao forte pelo nome.
- Formularios dedicados para:
  - Nota do Mestre;
  - Contador do Mestre;
  - Efeito Ambiental;
  - Cena;
  - Encontro Preparado.
- Gerador de encontros dentro do Painel do Mestre, usando o bestiario atual recebido pela Mesa Virtual.
- Filtros do gerador: busca, tier, tipo, habitat, papel, faccao, quantidade e dificuldade.
- Acoes do gerador:
  - salvar como encontro preparado;
  - adicionar a cena agora.
- Escudo do Mestre conectado ao compendio oficial quando houver dados estruturados, com fallback local.
- Busca rapida no Escudo.
- Fixar regra rapida.
- Copiar regra.
- Enviar regra ao chat da mesa.
- Relatorio de sessao refinado em Markdown com opcoes antes de exportar.
- Persistencia de `pinnedShieldRules`, `favoriteShieldRules` e `reportSettings` dentro de `gmDashboardSettings`.
- Layout dos novos paineis com scroll interno e limites de altura para evitar sobreposicao.

## Eventos novos

- `gm:encounter:generate`
- `gm:shield:search`
- `gm:shield:pin`
- `gm:shield:send-to-chat`

Eventos existentes reaproveitados:

- `campaign:create`
- `campaign:update`
- `campaign:delete`
- `campaign:list`
- `campaign:load`
- `gm:note:*`
- `gm:counter:*`
- `gm:environment:*`
- `gm:scene:*`
- `gm:encounter:*`
- `gm:report:export`

## Como abrir

Tela de campanhas:

```txt
http://localhost:3000/?view=campaigns&check=20260620i
```

Mesa direta:

```txt
http://localhost:3000/?view=mesaVirtual&check=20260620i
```

Ficha/biblioteca:

```txt
?view=ficha
```

## Relatorio de sessao

O relatorio Markdown pode incluir:

- jogadores;
- personagens;
- cenas visitadas;
- encontros;
- monstros;
- notas reveladas;
- notas secretas, somente se o mestre marcar;
- contadores;
- efeitos ambientais;
- objetivos concluidos;
- combate;
- loot;
- transacoes;
- chat;
- logs tecnicos, somente se marcado.

Por padrao, notas secretas nao entram.

## Persistencia

Entram em salvar sessao, autosave, snapshot e export/import:

- `gmNotes`;
- `revealedNotes`;
- `gmCounters`;
- `environmentalEffects`;
- `preparedEncounters`;
- `sceneList`;
- `activeSceneId`;
- `gmDashboardSettings`;
- `pinnedShieldRules`;
- `favoriteShieldRules`;
- `reportSettings`.

## Limitacoes atuais

- Os formularios ja substituem os prompts principais do Painel do Mestre, mas ainda podem ganhar edicao visual mais rica para objetivos, zonas e tokens iniciais.
- O gerador usa filtros simples em cima dos campos disponiveis no bestiario atual; balanceamento fino por XP/ameaca ainda e aproximado.
- `gm:shield:search` existe como evento estrutural, mas a busca principal roda no cliente para responder rapido ao mestre.
- O relatorio ainda e Markdown local; exportacao PDF e relatorio visual ficam para etapa futura.

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
```

## Proxima etapa recomendada

- Concluido na Fase 12: transformar cenas e encontros em editores visuais com objetivos, zonas e tokens iniciais.
- Melhorar balanceamento do gerador com pesos oficiais do Livro 2/Livro 3.
- Concluido na Fase 12: criar tela de relatorio com preview antes do download.
- Separar deploy web publico da ficha e do VTT quando a alfa estiver madura.
