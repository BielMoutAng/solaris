# Instruções para Codex — Projeto Guerra Solar / Solaris

Você está trabalhando no projeto **Guerra Solar / Solaris**, um sistema de RPG próprio.

## Regras de trabalho

- Preserve os arquivos originais sempre que possível.
- Ao alterar planilhas, crie uma nova versão com sufixo incremental, por exemplo `v0_3_6`.
- Não remova abas antigas sem autorização.
- Mantenha fórmulas legíveis e evite referências quebradas.
- Quando criar campos automáticos, use tabelas-base editáveis.
- Prefira nomes de abas curtos, claros e sem caracteres problemáticos.
- Sempre documente mudanças relevantes no arquivo `CHANGELOG.md`.

## Convenções do sistema

Use como padrão atual:

- FOR — Força
- REF — Reflexo
- CON — Constituição
- MEN — Mentalidade
- PRE — Presença
- INT — Intelecto

Atenção: alguns documentos antigos usam `ESP`. Ao converter:

- `ESP` ligado a vontade, social, medo e controle emocional deve virar `PRE`.
- `ESP` usado para PV/resistência corporal deve ser revisado e possivelmente virar `CON`.

## Ficha de personagem

A ficha deve automatizar:

- raça selecionável;
- chip de profissão selecionável;
- bônus fixos de raça;
- bônus fixos de profissão;
- nível e benefícios liberados;
- CA total;
- movimento;
- PV;
- Cosmos;
- cubos/carga;
- slots de mods de armas;
- slots de mods de armaduras.

## Ficha de monstro

A ficha deve manter campos para:

- nome;
- tier;
- tipo;
- atributos;
- derivados;
- ataques;
- habilidades passivas/ativas;
- comportamento;
- loot;
- uso em crafting.

## Objetivo técnico

Transformar as planilhas em ferramentas robustas para mesa, com pouca chance de erro humano e fácil edição pelo mestre.

