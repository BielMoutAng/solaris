# Changelog

## Export inicial para Codex

- Adicionada estrutura de repositório.
- Incluídos documentos principais, planilhas, fichas e imagens de prévia.
- Criados `README.md`, `AGENTS.md` e `TAREFAS_CODEX.md` para orientar o Codex.

## Biblioteca de personagens

- Criado app local `biblioteca-personagens` para montar fichas de personagem.
- Adicionadas seções de biblioteca para raças, profissões, armas, monstros e regras base.
- Incluídos salvamento local, importação/exportação JSON, impressão e cálculo automático de derivados.
- Adicionada área de imagem do personagem com seleção por clique, arrastar e soltar, prévia e persistência na ficha.
- Atualizadas raças e chips de profissão com base nos documentos oficiais indicados.
- Ajustados cálculos de MOD, PV, CA, movimento, Cosmos e slots de cubo para seguir a ficha padrão.
- Adicionada página interna de detalhe para cada raça jogável, aberta ao clicar no card da biblioteca de raças.
- Alterado o padrão dos atributos iniciais para 7.
- Corrigido o limite dos atributos para 20 e restaurado o MOD oficial `INT((valor final - 10) / 2)`.
- Ajustados PV atual/máximo, Cosmos máximo, CA com armadura equipada e slots de cubo conforme a ficha atual.
- Adicionadas páginas internas de Equipamentos, Cosmos e chips, e Cubo dentro da área de personagem.
- Criadas bibliotecas de itens, armaduras e armas com compra, débito automático e ações de equipar/guardar no cubo.
- Adicionadas bibliotecas de Magias cósmicas e Chips modificadores com 65 magias e 76 chips extraídos da planilha oficial.
- Criadas páginas internas de Habilidades, Dados e Criar na ficha do personagem.
- Adicionado botão de venda no inventário com valor editável e crédito automático no dinheiro da ficha.
- Adicionado rolador de dados com quantidade, tipo de dado, bônus, faces visuais e chat de histórico.
- Adicionada criação manual de itens, armas, armaduras, magias, chips e habilidades personalizadas.
- Removido o ajuste manual de Armadura da área de Recursos.
- Adicionado nível editável de Rachadura na aba Equipamentos.
- Versionados `app.js` e `styles.css` no HTML para forçar recarregamento dos assets atualizados.
- Adicionado empacotamento Electron para gerar instalador e executável portátil do Windows.

