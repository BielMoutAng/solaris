# Solaris Guerra Solar - Fase 9: Persistencia de Sessoes e Campanhas

Status: primeira versao funcional implementada no cache `20260620g`.

## Objetivo

Dar seguranca para campanha longa na Mesa Virtual/Tabletop:

- salvar sessao;
- continuar campanha;
- exportar/importar sessao em JSON;
- autosave;
- snapshots manuais;
- recuperacao apos queda;
- migracao e validacao simples de schema.

## O que foi implementado

- Novo modulo puro `src/session/solaris-session-persistence.js`.
- Schema inicial de sessao `1.0.0`.
- Modelagem normalizada de campanha com:
  - id, nome, sistema, descricao, dono, versao;
  - sessoes salvas;
  - cenas;
  - personagens;
  - monstros;
  - loot;
  - loja;
  - transacoes;
  - notas;
  - configuracoes;
  - autosaves;
  - metadados.
- Modelagem normalizada de sessao com:
  - sala, jogadores, chat, rolagens;
  - fichas sincronizadas;
  - revisoes;
  - combate;
  - cena/mapa/tokens/areas/objetivos;
  - monstros;
  - loot;
  - loja;
  - aprovacoes;
  - logs.
- Tela/modal **Campanhas** na Mesa Virtual.
- Acoes locais:
  - Nova Campanha;
  - Continuar Campanha;
  - Duplicar Campanha;
  - Excluir Campanha com confirmacao forte;
  - Salvar Sessao;
  - Exportar Sessao;
  - Importar Sessao;
  - Snapshot manual;
  - Restaurar autosave;
  - Excluir autosave.
- Autosave local com configuracao padrao:
  - `autosaveEnabled: true`;
  - `autosaveIntervalSeconds: 60`;
  - `maxAutosaves: 10`.
- Aviso de recuperacao:
  - "Encontramos uma sessao recente nao encerrada. Deseja continuar?"
- O antigo `Salvar Sessao` agora salva dentro da campanha ativa e tambem grava uma chave legada para compatibilidade.

## Eventos novos

Eventos preparados no cliente e servidor:

- `campaign:create`
- `campaign:update`
- `campaign:delete`
- `campaign:list`
- `campaign:load`
- `session:save`
- `session:load`
- `session:export`
- `session:import`
- `session:autosave`
- `session:snapshot:create`
- `session:snapshot:restore`
- `session:restore:available`

## Persistencia no host

No navegador e no Electron alfa, as campanhas ficam no armazenamento local:

- `solaris.tabletop.campaigns.v1`
- `solaris.tabletop.activeCampaign.v1`
- `solaris.tabletop.recovery.v1`

Isso preserva compatibilidade com web/PWA e nao exige permissao de arquivo.

Limitacao atual: o Electron ainda nao possui ponte IPC segura para salvar em arquivo nativo automaticamente. Por isso, a forma confiavel de backup externo e **Exportar Sessao** em JSON.

## Exportacao/importacao

O JSON exportado contem:

- `kind`;
- `schemaVersion`;
- `appVersion`;
- `exportedAt`;
- `campaign`;
- `sessionState`;
- `assetsPolicy`;
- `notes`.

Na importacao:

- o JSON e validado;
- a sessao e migrada para o schema atual;
- a campanha importada entra como nova campanha;
- a campanha atual nao e sobrescrita sem acao explicita.

## Como testar

1. Rodar `npm run server:vtt`.
2. Abrir `http://localhost:3000/?view=mesaVirtual&check=20260620g`.
3. Criar sala.
4. Abrir **Campanhas**.
5. Criar campanha.
6. Mover token, adicionar monstro, iniciar combate, rolar dado e criar loot.
7. Clicar **Salvar Sessao**.
8. Recarregar a pagina.
9. Abrir **Campanhas** e clicar **Continuar**.
10. Conferir mapa, tokens, chat, combatentes, loot e rolagens.
11. Clicar **Exportar Sessao** e guardar o JSON.
12. Clicar **Importar Sessao** e importar o JSON como nova campanha.
13. Criar **Snapshot** e restaurar um autosave.
14. Abrir sem servidor e confirmar que a mesa fica em modo simulado/offline.
15. Rodar `npm run start:ficha` para confirmar que a ficha nao foi quebrada.
16. Rodar `npm run start:vtt` para confirmar abertura direta da mesa.

## Limitacoes

- A lista de campanhas no servidor e em memoria; o salvamento duravel principal fica no host via localStorage.
- O servidor consegue receber/restaurar estado enviado pelo host, mas ainda nao grava arquivo proprio em disco.
- Autosave e local ao host que abriu a mesa.
- Cenas multiplas existem na estrutura, mas a UI ainda trabalha prioritariamente com a cena ativa.

Observacao: a Fase 11 adicionou a tela dedicada **Minhas Campanhas** em `?view=campaigns`, mantendo este modelo de persistencia.

## Proxima etapa recomendada

Fase 10 - Pagina do Mestre / Escudo do Mestre refinados:

- tela dedicada do mestre;
- notas secretas;
- contadores;
- encontros;
- carregamento visual de cenas salvas;
- ferramentas de distribuicao e preparacao de sessao.

Continuacao implementada depois:

- Fase 11 consolidou a tela Minhas Campanhas, formularios dedicados, gerador de encontros, Escudo conectado ao compendio quando possivel e relatorio refinado.
