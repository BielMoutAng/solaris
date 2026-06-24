# Relatorio de Divergencias de Dados Oficiais

Data: 2026-06-23.

| Arquivo | Livro | Categoria | Entrada | Campo | Valor no app | Valor esperado ou suspeito no livro | Tipo de divergencia | Acao tomada | Precisa revisao manual | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `official-books-data.js` | Livro 1 | fonte | sources.book1 | source | `livro 1 base para jogadores.docx` | `Livro 1 base do jogador.docx` | fonte antiga | atualizado em `sources`; antigo preservado em `sourceFilesPrevious` | sim | P0 |
| `official-books-data.js` | Livro 2 | fonte | sources.book2 | source | `Livro_2_Guia_do_Mestre_Guerra_Solar_formatado_enumerado.docx` | `Livro_2_Guia_do_Mestre_rifles_corrigido.docx` | fonte antiga | atualizado em `sources`; antigo preservado em `sourceFilesPrevious` | sim | P0 |
| `official-books-data.js` | Livro 3 | fonte | sources.book3 | source | `Livro_3_Bestiario_Guerra_Solar_Edicao_Visual.docx` | `Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx` | fonte antiga | atualizado em `sources`; antigo preservado em `sourceFilesPrevious` | sim | P0 |
| `official-books-data.js` | Livro 4 | fonte | sources.book4 | source | ausente | `Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx` | fonte ausente | adicionada fonte atual | sim | P1 |
| `official-books-data.js` | Livro 5 | fonte | sources.book5 | source | `Livro_5_Guerra_Solar_COMPILADO_COMPLETO_FINAL.docx` | `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx` | fonte antiga | atualizado em `sources`; antigo preservado em `sourceFilesPrevious` | sim | P0 |
| `official-book5-catalog.js` | Livro 5 | catalogo | topo do arquivo | source | `Livro_5_Itens_Equipamentos_Habilidades_CA_armaduras_corrigida.docx` | `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx` | fonte antiga | `source` e `sourceFileCurrent` atualizados; antigo em `sourceFilePrevious` | sim | P0 |
| `official-rulebook-compendium.js` | Livro 1 | compendio | sources.book1 | file | `Livro_1_Basico_do_Jogador_punhos_corrigido.docx` | `Livro 1 base do jogador.docx` | fonte antiga | `file` atualizado; antigo em `filePrevious` | sim | P0 |
| `official-rulebook-compendium.js` | Livro 5 | compendio | sources.book5 | file | `Livro_5_Itens_Equipamentos_Habilidades_CA_armaduras_corrigida.docx` | `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx` | fonte antiga | `file` atualizado; antigo em `filePrevious` | sim | P0 |
| `official-rulebook-compendium.js` | Livro 5 | texto bruto | secoes | termos como `sniper` | aparece em texto bruto | categoria mecanica deve ser `rifle de precisao` | termo antigo em texto | nao alterado em texto oficial; catalogo mecanico normaliza categoria/tag se ocorrer | sim | P1 |
| `official-rulebook-compendium.js` | Todos | texto bruto | secoes | `TODO`, `corrigir`, `revisar` | aparece em texto dos livros/compilacao | nao deve virar UI mecanica sem revisao | compendio marcado como `needsReview` | sim | P1 |
| `official-book5-catalog.js` | Livro 5 | catalogo | todas entradas | metadata | sem `sourceFileCurrent` em entradas | entradas devem ter rastreabilidade | metadado ausente | aplicado por reconciliacao em runtime | sim | P1 |
| `official-books-data.js` | Livros 3/5 | catalogo/bestiario | entradas | metadata | sem `sourceStatus` consistente | dados devem indicar status de fonte | governanca ausente | aplicado por reconciliacao em runtime | sim | P1 |
| `README.md` | App | documentacao | formula/catalogo | fonte Livro 5 | dizia `livro 5 tabelas.docx` | fonte atual Livro 5 punhos corrigido | documentacao antiga | atualizado para Fase 19 | nao | P1 |

## Observacoes

- Esta fase corrigiu fontes e metadados, mas nao alterou mecanicas grandes.
- Divergencias de valor numerico, como CA, dano, preco e slots, ficaram marcadas para a Fase 22.
- Fontes antigas foram preservadas como historico quando util, nao como fonte atual.
