# Fase 26 - Livro 4 como Compendio Navegavel e Lore de Campanha

Status: implementado no cache `20260624g`.

Versao local: `0.6.0-alpha.21`.

## Objetivo

Transformar o Livro 4, `Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx`, em uma camada estruturada de lore para a Biblioteca Solaris e para o Painel do Mestre, sem quebrar modo offline, Launcher, Biblioteca/Ficha, Tabletop Alpha, campanhas, autosaves, export/import e fases 20 a 25.

## O Que Entrou

- Novo modulo puro `src/domain/solaris-lore-rules.js`.
- Compendio inicial do Livro 4 com Solaris, Falaris, Tarantus, Ktaluhl Kalar, Conselho, Enfermaria Myrr, Forja de Durn Karr, Sucateiros, Selia Vardes, Uryon, Portais Tharan e ganchos de campanha.
- Tipos estruturados de entrada: universo, planeta, regiao, cidade, plataforma, local, faccao, povo, cultura, NPC, entidade, organizacao, evento historico, ameaca, misterio, tecnologia, crenca, recurso, gancho, rumor, segredo e linha do tempo.
- Relacoes entre entradas de lore, incluindo links com missoes, monstros e itens.
- Pins de lore, descobertas, segredos, notas do mestre e envio para relatorio de sessao.
- Seeds para criar missao, encontro, NPC, cena/local, contador de campanha e faccao a partir de uma entrada de lore.
- Persistencia de lore em sessao, campanha, autosave, snapshot, exportacao e importacao.
- Aba `Lore` no Painel do Mestre, com busca, filtros por tipo/importancia, pins, detalhes e acoes rapidas.
- Biblioteca/Ficha com a visao `Lore`, acessivel pela lateral e pelo hub de livros.
- Relatorio de sessao com bloco `Lore e cenario`.

## Arquivos Principais

- `src/domain/solaris-lore-rules.js`
- `src/session/solaris-session-domain.js`
- `src/session/solaris-session-persistence.js`
- `src/session/solaris-session-ui.js`
- `app.js`
- `index.html`
- `styles.css`
- `sw.js`
- `tests/solaris-lore-rules.test.mjs`

## Integracao Com A Mesa

O mestre pode usar a aba `Lore` para:

- pinar entradas importantes;
- marcar entrada como descoberta;
- marcar entrada como segredo;
- enviar lore para notas privadas;
- enviar lore para relatorio;
- criar missao a partir de um local, faccao, NPC ou gancho;
- criar cena a partir de local;
- criar encontro a partir de local, ameaca ou misterio;
- criar contador de campanha a partir de entidade, ameaca ou misterio;
- transformar faccao de lore em estado de faccao do Guia do Mestre;
- criar nota de NPC a partir de entrada de personagem/lore.

Jogadores recebem apenas entradas publicas, reveladas ou descobertas. Entradas secretas continuam visiveis para o mestre.

## Fonte Oficial e Governanca

As entradas carregam metadados:

- `sourceFileCurrent`;
- `sourceStatus`;
- `sourceChapter`;
- `needsReview`;
- `reviewReason`;
- `dataStability`.

Como o Livro 4 e primariamente narrativo, varias entradas permanecem com `current-source-needs-review` ate uma futura auditoria de texto fiel e expansao completa por capitulo.

## Testes Adicionados

`tests/solaris-lore-rules.test.mjs` cobre:

- constantes e entradas oficiais iniciais;
- normalizacao de locais, faccoes, NPCs, entidades, eventos e ganchos;
- validacao;
- busca e filtros;
- relacoes;
- pins, descobertas e segredos;
- notas, relatorio, missao, encontro, NPC, cena e faccao;
- hidratacao e serializacao;
- integracao com `GameRoom`;
- filtro de segredos para jogadores;
- persistencia em sessao e campanha.

## Limitacoes Atuais

- O compendio inicial cobre os pilares do Livro 4, mas ainda nao e uma transcricao completa capitulo por capitulo.
- Imagens, mapas e diagramas oficiais de locais ainda nao foram extraidos para cards visuais.
- A UI seleciona a primeira entrada filtrada como detalhe principal; uma futura fase pode adicionar selecao persistente e uma janela de detalhe maior.
- Links com monstros e itens ja existem estruturalmente, mas a vinculacao automatica com o bestiario e catalogo completo deve ser refinada em fase propria.

## Como Testar

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-lore-rules.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
```

Teste manual:

1. Rode `npm run server`.
2. Abra `http://localhost:3000/?view=launcher&check=20260624g`.
3. Entre na Mesa Virtual.
4. Abra o Painel do Mestre.
5. Clique na aba `Lore`.
6. Pesquise `Tarantus`, `Uryon` e `Ktaluhl`.
7. Pine uma entrada, envie para notas, crie uma missao e crie uma cena.
8. Salve/exporte a campanha e importe novamente.
9. Confirme que os pins, notas, links e relatorio foram preservados.

## Proxima Etapa Recomendada

Completar o Livro 4 com todas as regioes, faccoes, povos, NPCs, locais, linha do tempo e ganchos em granularidade maior, ligando automaticamente entradas aos monstros do Livro 3, itens do Livro 5 e cenas/mapas do Tabletop.
