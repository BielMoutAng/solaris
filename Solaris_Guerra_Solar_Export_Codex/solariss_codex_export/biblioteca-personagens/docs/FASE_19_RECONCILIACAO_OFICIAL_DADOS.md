# Solaris Guerra Solar - Fase 19: Reconciliacao Oficial de Dados

## Resumo executivo

A Fase 19 reconciliou os metadados das fontes oficiais usadas pelo app com os cinco livros atualmente tratados como base oficial do Guerra Solar. Esta fase nao implementa mecanicas grandes e nao cria telas novas; ela organiza governanca de dados para reduzir divergencia futura.

Runtime foi alterado de forma leve porque os arquivos `official-*` receberam metadados de governanca. Por isso o cache passa para `20260622g` e o Solaris Tabletop Alpha passa para `0.6.0-alpha.14`.

## Aviso de regras em desenvolvimento

As regras de Guerra Solar ainda estao em desenvolvimento. Esta reconciliacao marca os dados oficiais como `current-source-needs-review`: as fontes atuais estao registradas corretamente, mas varios valores mecanicos e textos longos ainda precisam conferencia manual antes de serem tratados como definitivos.

## Cache e versao analisados

- Antes da fase: cache `20260622f`, Tabletop `0.6.0-alpha.13`.
- Depois da fase: cache `20260622g`, Tabletop `0.6.0-alpha.14`.
- Data da reconciliacao: `2026-06-23`.

## Livros oficiais usados

| Livro | Arquivo oficial atual | Papel no app | Status |
| --- | --- | --- | --- |
| Livro 1 | `Livro 1 base do jogador.docx` | racas, atributos, pericias, criacao, rolagens, progressao, ficha | current-source-needs-review |
| Livro 2 | `Livro_2_Guia_do_Mestre_rifles_corrigido.docx` | mestre, encontros, viagem, recompensas, reputacao, hacking | current-source-needs-review |
| Livro 3 | `Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx` | bestiario, monstros, loot, recursos coletaveis | current-source-needs-review |
| Livro 4 | `Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx` | lore, locais, faccoes, povos, NPCs e ganchos | current-source-needs-review |
| Livro 5 | `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx` | armas, armaduras, itens, cubos, mods, chips, magias, crafting | current-source-needs-review |

## Arquivos analisados

- `official-books-data.js`
- `official-book5-catalog.js`
- `official-rulebook-compendium.js`
- `app.js`
- `sw.js`
- `README.md`
- `README_CONTEXTO_CHATGPT.md`
- docs da Fase 2 ate a Fase 18

## Metodologia

1. Foram lidos os READMEs e documentos de fase existentes.
2. Foram identificadas referencias antigas de fontes dentro dos arquivos `official-*`.
3. Foi criado `scripts/audit-official-sources.mjs`, um diagnostico sem dependencia nova.
4. O script localiza os cinco livros atuais, extrai `word/document.xml` diretamente do `.docx` como ZIP, conta paragrafos/tabelas/caracteres e detecta capitulos principais.
5. O script carrega os arquivos `official-*` em VM, conta entradas por catalogo e procura termos de fonte antiga.
6. Foram aplicados metadados de governanca sem remover campos antigos usados pela UI.
7. Foram criados testes para impedir regressao de fonte, metadados e categorias perigosas.

## Assinatura dos livros detectada

Resultado do script em 2026-06-23:

| Livro | Encontrado | Paragrafos | Tabelas | Caracteres | Primeiros capitulos detectados |
| --- | --- | ---: | ---: | ---: | --- |
| Livro 1 | sim | 8160 | 209 | 566210 | Introducao; Universo; Conceitos Basicos; Criacao; Racas; Atributos |
| Livro 2 | sim | 14793 | 235 | 557075 | Logistica; Viagens; Missoes; Faccao; Mestre; Campanha |
| Livro 3 | sim | 3082 | 17 | 130203 | Bestiario Inicial; Tarantus; Chefes; Variantes; Fichas |
| Livro 4 | sim | 1793 | 34 | 93670 | Universo; Poderes Sociais; Faccoes; Entidades; Fichas de Mundo |
| Livro 5 | sim | 11201 | 254 | 426029 | Armas/Armaduras; Mods; Tiers; Cubos; Crafting; Utilitarios |

## Fontes antigas encontradas

Foram encontradas referencias antigas em:

- `official-books-data.js`: `COMPILADO_COMPLETO_FINAL`, `Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado`, `Livro_3_Bestiario_Guerra_Solar_Edicao_Visual`, `livro 1 base para jogadores.docx`.
- `official-book5-catalog.js`: `CA_armaduras_corrigida`.
- `official-rulebook-compendium.js`: `CA_armaduras_corrigida`.

Acao tomada:

- As fontes atuais foram registradas em `source`, `sources`, `sourceFileCurrent` e `sourceGovernance`.
- As fontes antigas foram preservadas apenas como historico em `sourceFilePrevious` ou `sourceFilesPrevious`.
- Os dados ficaram marcados com `sourceStatus: "current-source-needs-review"`.

## Alteracoes nos dados

### `official-books-data.js`

- `schemaVersion` atualizado para `2`.
- `sources` atualizado para os cinco livros atuais, incluindo Livro 4.
- Novo bloco `sourceGovernance`.
- Aplicacao automatica de metadados em templates, catalogo, bestiario e regras:
  - `officialId`;
  - `bookId`;
  - `bookTitle`;
  - `sourceFileCurrent`;
  - `sourceStatus`;
  - `sourceLastReconciledAt`;
  - `dataStability`;
  - `sourceSection`.

### `official-book5-catalog.js`

- `schemaVersion` atualizado para `3`.
- `source` atualizado para `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx`.
- Adicionados:
  - `sourceFileCurrent`;
  - `sourceFilePrevious`;
  - `sourceStatus`;
  - `sourceLastReconciledAt`;
  - `sourceNeedsReview`;
  - `needsReview`;
  - `reviewReason`;
  - `dataStability`;
  - `bookId`;
  - `bookTitle`.
- Catalogo recebeu metadados por entrada sem quebrar `name`, `category`, `type`, `price`, `summary`, `officialData` ou campos usados pela loja.
- Categoria/tag `sniper`, se aparecer como dado mecanico, e normalizada para `rifle de precisao`.

### `official-rulebook-compendium.js`

- `schemaVersion` atualizado para `2`.
- Fontes dos cinco livros atualizadas.
- Fontes anteriores preservadas como `filePrevious`.
- Compendio marcado como `needsReview` porque contem texto bruto e trechos que ainda nao devem virar regra automatica sem conferencia.
- Secoes recebem `sourceFileCurrent`, `sourceStatus`, `sourceLastReconciledAt`, `dataStability` e `sourceChapter`.

## Dados marcados como needsReview

Marcados explicitamente:

- `official-books-data.js/sourceGovernance`;
- `official-book5-catalog.js` no topo;
- `official-rulebook-compendium.js` no topo;
- cada fonte do compendio.

Motivo: a fonte atual foi reconciliada, mas a conferencia mecanica fina ainda precisa comparar tabela por tabela e item por item.

## Principais divergencias por livro

| Livro | Divergencia principal | Status |
| --- | --- | --- |
| Livro 1 | nomes antigos de fonte e necessidade de conferir racas/progressao | needsReview |
| Livro 2 | fonte antiga no arquivo legado; sistemas do mestre ainda parciais | needsReview |
| Livro 3 | fonte antiga visual no legado; bestiario precisa conferencia completa | needsReview |
| Livro 4 | antes nao aparecia em `official-books-data.js/sources` | corrigido como fonte atual |
| Livro 5 | fonte principal antiga no catalogo; valores mecanicos ainda exigem revisao manual | needsReview |

## Principais divergencias do Livro 5

- Fonte antiga `CA_armaduras_corrigida` ainda existia no catalogo.
- Catalogo atual possui muitos dados mecanicos, mas ainda precisa checagem de:
  - CA;
  - dano;
  - preco;
  - tier;
  - slots;
  - ganchos;
  - peso;
  - municao;
  - carregador;
  - descricoes detalhadas;
  - chips modificadores;
  - magias/habilidades cosmicas.
- O app deve tratar o catalogo como utilizavel, mas provisoriamente reconciliado.

## Testes criados

Novo arquivo:

- `tests/official-data-reconciliation.test.mjs`

Cobertura:

- carrega `official-books-data.js`;
- carrega `official-book5-catalog.js`;
- carrega `official-rulebook-compendium.js`;
- verifica fontes atuais;
- verifica governanca minima no Livro 5;
- verifica peso do cubo em `1`;
- impede categoria mecanica `sniper`;
- impede `slot de carga` em campos de categoria/tipo/tag;
- verifica preco numerico nao negativo;
- garante que todo `needsReview` tenha `reviewReason`;
- garante que o script diagnostico roda.

## Script criado

Novo arquivo:

- `scripts/audit-official-sources.mjs`

Uso:

```bash
node scripts/audit-official-sources.mjs
node scripts/audit-official-sources.mjs --json
```

Ele nao altera arquivos. Apenas diagnostica.

## Validacao

Validacao esperada para esta fase:

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
node --check scripts/audit-official-sources.mjs
```

## Limitacoes

- A Fase 19 nao reextraiu e reescreveu todos os catologos mecanicos.
- A Fase 19 nao resolveu todas as divergencias de CA, dano, preco ou texto oficial.
- O compendio ainda contem texto bruto dos livros; ele e bom para consulta, mas nao deve ser tratado automaticamente como regra estruturada.
- O script diagnostico extrai texto do `.docx`, mas nao reconstrói tabelas complexas em JSON.

## Proximas fases recomendadas

1. Fase 20 - Criacao e progressao oficial de personagem.
2. Fase 21 - Combate oficial completo.
3. Fase 22 - Livro 5 completo por tabela, com comparacao de valores mecanicos.
4. Fase 23 - Bestiario completo e validado.
5. Fase 24 - Guia do Mestre.
6. Fase 25 - Livro 4 como compendio navegavel.
