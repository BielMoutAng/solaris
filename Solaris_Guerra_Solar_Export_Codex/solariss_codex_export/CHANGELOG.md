# Changelog

## 0.1.1

- Gerada versao Windows 0.1.1 com instalador e executavel portatil em `downloads/windows/v0.1.1/`.
- Incluida a correcao dos detalhes dos cards abrindo por clique no nome, sem cobrir Comprar/Adicionar.

## Publicacao mobile

- Adicionado suporte PWA com manifest, service worker, icones e deploy automatico pelo GitHub Pages para uso em celulares.

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
- Adicionada biblioteca lateral de Ações possíveis para combate, cena, timeskip e fora de combate.
- Adicionado campo de Saturação e regra de testes com 3d6, 2d6 em colapso e 4d6 com saturação máxima.
- Adicionados testes rápidos clicáveis para atributos, perícias e jogadas de proteção com bônus situacional, vantagem e desvantagem.
- Adicionado HUD corporal de estresse com cor de alerta conforme o nível de estresse.
- Adicionado painel de combate com esboço da arma equipada, botões de ataque/dano e visual de equipamento quebrado em rachadura máxima.
- Sincronizada a biblioteca de itens com 175 itens da aba `tabela de itens` da planilha central `Tabela Solaris V2.xlsx`.
- Reorganizada a ficha para colocar perícias abaixo dos atributos, jogadas de proteção à direita e HUD vital centralizado.
- Alterado o limite máximo de Estresse da ficha para 7.
- Atualizada a aba Criar para exibir formatos padrão e campos dinâmicos por tipo de conteúdo manual.
- Adicionada animação holográfica de dados sobreposta à tela para todas as rolagens.
- Adicionado botão de iniciativa na aba Dados, usando REF e a regra atual de dados por Estresse/Saturação.
- Marcadas novas rolagens com metadados estruturados para facilitar uma futura migração para Foundry VTT.
- Adicionados filtros e ordenação nas bibliotecas de itens, armas, armaduras, magias e chips por tier/rank/custo/categoria, preço e ordem alfabética.
- Atualizada a direção visual do app com fundo cósmico, painéis holográficos, neon Solaris e detalhes discretos de matéria orgânica.
- Adicionada imagem personalizada para itens, armas e armaduras criados manualmente, com clique, arrastar e soltar, preview e persistência na ficha.
- Refinados HUD vital, recursos e cards de biblioteca/inventário para seguir a referência visual Solaris, com caixas uniformes e detalhes em janela no hover/foco.
- Atualizada a HUD vital com corpo holográfico animado no hover/foco, diagnósticos visuais, ícones de recursos alinhados e menu lateral expansivo/recolhível.
- Aprimorada a figura Humanis da HUD vital com silhueta anatômica, malha holográfica, órgãos, articulações e melhor enquadramento na cápsula de sinais vitais.
- Integrado o componente `HumanisVitalHUD.js` à ficha, renderizando `#hud-humanis` com dados reais mapeados de PV, Estresse, Cosmos, CA, sinais vitais, recursos, sangramento e partes do corpo.

