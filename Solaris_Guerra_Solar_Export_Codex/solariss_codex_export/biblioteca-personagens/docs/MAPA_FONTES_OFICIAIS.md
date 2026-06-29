# Mapa de Fontes Oficiais

Data da ultima reconciliacao: 2026-06-23.

| Livro | Arquivo oficial atual | Conteudo governado | Arquivo do app relacionado | Status | Ultima reconciliacao | Risco | Observacoes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Livro 1 | `Livro 1 base do jogador.docx` | racas, atributos, pericias, criacao, chips de profissao, rolagens, estresse, Cosmos, JPs, combate basico, progressao | `official-books-data.js`, `official-rulebook-compendium.js`, `app.js` | current-source-needs-review | 2026-06-23 | Alto | Fonte atual registrada; racas e progressao ainda precisam conferencia mecanica |
| Livro 2 | `Livro_2_Guia_do_Mestre_rifles_corrigido.docx` | escudo, tabelas rapidas, encontros, viagem, ambiente, recompensas, reputacao, faccoes, hacking, bases | `official-rulebook-compendium.js`, `src/session/solaris-session-domain.js` | current-source-needs-review | 2026-06-23 | Medio/alto | Sistemas do mestre existem parcialmente e precisam virar regras estruturadas |
| Livro 3 | `Livro_3_Bestiario_Guerra_Solar_revisado_coerencia_fichas.docx` | bestiario, fichas de monstro, comportamento, loot, recursos, variantes, chefes | `official-books-data.js`, `official-rulebook-compendium.js`, `src/domain/solaris-domain-architecture.js` | current-source-needs-review | 2026-06-23 | Alto | Bestiario funciona, mas todos os valores precisam conferencia final |
| Livro 4 | `Livro_4_Cenarios_e_Historia_Guerra_Solar_formatado_revisado.docx` | lore, locais, faccoes, povos, Tarantus, Falaris, Uryon, Ktaluhl Kalar, portais, NPCs, ganchos | `official-rulebook-compendium.js`, `src/domain/solaris-lore-rules.js`, `src/session/solaris-session-domain.js` | current-source-needs-review | 2026-06-24 | Medio | Fase 26 criou compendio navegavel inicial e integracao com Painel do Mestre; ainda falta transcricao granular completa por capitulo |
| Livro 5 | `Livro_5_Itens_Equipamentos_Habilidades_punhos_corrigido.docx` | armas, armaduras, itens, cubos, municoes, carregadores, mods, chips, magias, drones, torretas, veiculos, materiais, servicos, crafting | `official-book5-catalog.js`, `official-books-data.js`, `official-rulebook-compendium.js`, `src/domain/solaris-domain-architecture.js` | current-source-needs-review | 2026-06-23 | Muito alto | Fonte atualizada; catalogo mecanico deve ser validado tabela por tabela na Fase 22 |

## Politica de atualizacao

Quando um livro mudar:

1. Atualizar este mapa.
2. Rodar `node scripts/audit-official-sources.mjs`.
3. Atualizar `official-*` com `sourceFileCurrent` e `sourceFilePrevious`.
4. Marcar dados duvidosos com `needsReview` e `reviewReason`.
5. Criar teste para qualquer valor numerico oficial.
6. So publicar release se `npm test` e `node --check` passarem.
