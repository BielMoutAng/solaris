# Solaris Guerra Solar - Fase 17: Estrutura Visual por Telas

Status: primeira versao alfa implementada no cache `20260621f`.

## Objetivo

Melhorar a estrutura visual do Solaris Tabletop Alpha sem refazer a aplicacao inteira. A tela anterior concentrava mapa, loja, ficha, painel do mestre, chat e paineis laterais ao mesmo tempo, o que deixava a interface embolada em janelas menores.

Esta fase separa os fluxos principais em telas dedicadas, mantendo o modo offline/simulado, o servidor local e as mecanicas ja existentes.

## Referencias usadas

As imagens de referencia enviadas pelo usuario foram usadas como guia de organizacao:

- Pagina do Mestre com paineis em grade.
- Loja com sidebar, cards e carrinho lateral.
- Ficha com cards de resumo, equipamentos e rolagens.
- Mapa tatico com faixa inferior de personagem e acoes rapidas.
- Tabelas rapidas e escudo do mestre com informacao densa, mas compartimentada.

O plugin do Figma foi consultado para contexto estrutural. A API retornou metadados do arquivo, mas a conta atingiu limite de plano durante a consulta; por isso, a implementacao foi guiada principalmente pelas imagens locais fornecidas.

## O que foi implementado

- Navegacao principal no centro do Tabletop com quatro telas: `Mesa`, `Loja`, `Ficha` e `Mestre`.
- A tela `Mesa` preserva mapa tatico, chat, jogadores, painel de combate e barra inferior.
- A tela `Loja` abre o Mercado Solaris em tela ampla, sem laterais competindo por espaco.
- A tela `Ficha` abre um resumo sincronizado do personagem, com recursos, equipamentos, itens ativos e rolagens rapidas.
- A tela `Mestre` organiza comandos, resumo da cena, objetivos, notas, monstros, mapas e contadores.
- A faixa inferior da mesa foi compactada para servir como HUD rapida do personagem.
- Paineis longos agora usam `overflow` interno e altura controlada, evitando que conteudo novo desmonte a grade.
- O cache foi atualizado para `20260621f`.
- O Solaris Tabletop Alpha foi atualizado para `0.6.0-alpha.9`.

## Arquivos principais

- `src/session/solaris-session-ui.js`
- `styles.css`
- `app.js`
- `index.html`
- `sw.js`
- `package.json`
- `package-lock.json`

## Como testar visualmente

1. Rode `npm run server:vtt`.
2. Abra `http://localhost:3000/?view=mesaVirtual&check=20260621f`.
3. Alterne entre `Mesa`, `Loja`, `Ficha` e `Mestre`.
4. Confirme que a tela ativa ocupa o espaco central sem sobrepor as laterais.
5. Confirme que listas longas rolam dentro do proprio painel.
6. Confirme que a Loja e a Ficha continuam funcionando em modo offline/simulado.

## Limitacoes atuais

- A tela `Ficha` ainda e um resumo operacional, nao a ficha completa final do VTT.
- A tela `Mestre` ainda usa os dados estruturados existentes e deve evoluir para um escudo completo.
- As referencias de Figma nao puderam ser lidas por completo devido ao limite de plano da API.
- A etapa ainda nao cria novos fluxos mecanicos; ela reorganiza e estabiliza a interface.

## Proxima etapa recomendada

Refinar uma tela por vez:

1. Ficha completa do jogador no VTT.
2. Bestiario em tela ampla.
3. Escudo completo do mestre.
4. Criador de personagem em wizard.
5. Tabelas rapidas consultaveis durante a sessao.
