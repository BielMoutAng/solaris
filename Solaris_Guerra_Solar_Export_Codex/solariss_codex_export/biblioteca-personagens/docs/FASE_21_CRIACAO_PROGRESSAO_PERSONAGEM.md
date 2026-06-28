# Fase 21 - Criacao e Progressao Oficial de Personagem

Status: implementado localmente no cache `20260624b`.

Versao local: `0.6.0-alpha.16`.

Esta fase consolida a base de criacao e progressao do personagem a partir do Livro 1 atual, sem publicar Web, sem gerar EXE e sem subir para o GitHub nesta etapa.

## Fontes usadas

- `Livro 1 base do jogador.docx`
- `docs/MATRIZ_FUNCIONAL_REGRAS_GUERRA_SOLAR.md`
- `docs/MAPA_FONTES_OFICIAIS.md`
- `docs/REGISTRO_DE_REGRAS_MUTAVEIS.md`

Trechos confirmados no Livro 1:

- Capitulo 4: criacao em 10 passos oficiais.
- Capitulo 7: pericias oficiais por atributo; CON nao possui pericias proprias.
- Capitulo 9: equipamento inicial.
- Capitulo 39: progressao, XP, estacao de evolucao, custo, tempo, materiais e beneficio 1d6.

## O que mudou

Foi criado o modulo:

```txt
src/domain/solaris-character-creation.js
```

Ele centraliza:

- versao de schema da criacao;
- cache/versionamento da fase;
- quatro racas jogaveis oficiais;
- atributos oficiais;
- pericias oficiais por atributo;
- CON sem pericias proprias;
- pacote inicial de nivel 1;
- sete etapas guiadas da interface, agrupando os dez passos oficiais do Livro 1;
- checklist oficial completo de criacao;
- tabela de XP por nivel;
- rolagem inicial 7d6 com descarte do menor;
- aplicacao de dados nos atributos;
- snapshot das escolhas de criacao;
- validacao basica de personagem de criacao;
- entrada estruturada de historico de progressao.

## Guia de criacao

A aba Guia da ficha agora mostra:

- `Solaris - 7 etapas guiadas / 10 passos oficiais`;
- resumo da ficha em criacao;
- raca, chip de profissao, pericias treinadas e ignorancias;
- derivados principais;
- pacote inicial oficial;
- cards das sete etapas guiadas;
- checklist oficial completo.

As sete etapas sao uma organizacao de tela. Elas nao substituem o Livro 1: cada etapa indica quais passos oficiais ela cobre.

## Persistencia da ficha

Toda ficha nova passa a ter:

```txt
createdWithVersion
characterSchemaVersion
creationChoices
progressionHistory
appliedBonuses
manualOverrides
needsReviewFlags
```

Fichas antigas importadas ou carregadas sao normalizadas com esses campos sem apagar dados existentes.

Antes de salvar, exportar ou sincronizar a ficha em sessao, o app atualiza o snapshot de criacao.

## Progressao

O fluxo de subir de nivel continua usando o modal ja existente, com:

- verificacao de XP;
- custo `500 Luzentis x nivel-alvo`;
- confirmacao de Estacao de Evolucao;
- confirmacao de materiais consumidos;
- rolagem de `1d6`;
- aplicacao do beneficio;
- registro em `evolutionHistory`;
- novo registro estruturado em `progressionHistory`;
- novo registro em `appliedBonuses`.

## Sincronizacao com VTT

A snapshot enviada para a Mesa Virtual agora inclui:

- `creationChoices`;
- `progressionHistory`;
- `evolutionHistory`;
- `appliedBonuses`;
- `manualOverrides`;
- `needsReviewFlags`;
- `metadata.characterSchemaVersion`;
- `metadata.appVersion`;
- `metadata.appCache`.

Isso prepara a ficha para exibicao e auditoria na VTT sem quebrar o modo offline.

## Cache e versao

Atualizado para:

```txt
cache: 20260624b
versao: 0.6.0-alpha.16
```

Arquivos versionados:

- `index.html`
- `sw.js`
- `app.js`
- `src/session/solaris-session-ui.js`
- `electron-main-vtt.cjs`
- `package.json`
- `package-lock.json`

## Testes adicionados

Arquivo:

```txt
tests/solaris-character-creation.test.mjs
```

Cobertura:

- quatro racas jogaveis oficiais;
- sete etapas guiadas;
- checklist oficial;
- CON sem pericias proprias;
- modificador de atributo, incluindo 20 como +5;
- rolagem 7d6 e descarte do menor;
- aplicacao de dados sem reutilizar dado;
- snapshot de escolhas;
- equipamento inicial com 2000 Luzentis;
- validacao basica;
- historico de progressao.

## Duvidas e limites atuais

- O Livro 1 descreve 10 passos oficiais; a interface agrupa em 7 etapas para usabilidade.
- Humanis concede pericia treinada adicional, mas a escolha continua sendo feita pelo jogador na grade de pericias.
- O kit especifico de cada profissao ainda depende da lista final de profissoes/itens do Livro 5.
- A progressao racial futura aparece como campo preparado, mas as racas atuais do app mantem progressao vazia por governanca anterior.
- Fase 22 ainda deve reconciliar valores mecanicos do Livro 5 tabela por tabela.

## Validacao recomendada

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
```

Teste manual:

1. Rodar `npm run server`.
2. Abrir `http://localhost:3000/?view=launcher&check=20260624b`.
3. Entrar na Biblioteca/Ficha.
4. Abrir a aba Guia.
5. Rolar atributos iniciais.
6. Aplicar atributos.
7. Criar personagem aleatorio nivel 1.
8. Salvar e exportar JSON.
9. Importar o JSON.
10. Conferir se `creationChoices`, `progressionHistory` e `characterSchemaVersion` foram preservados.
11. Abrir sem servidor e confirmar que a ficha offline continua funcionando.
