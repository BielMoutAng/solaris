# Plano de Exportacao Foundry

## Direcao

Foundry VTT sera destino de exportacao/importacao. A Biblioteca Solaris continua
sendo a fonte oficial.

## Fase Foundry 1 - Draft

Implementado nesta base:

- `exportFoundryDraft(character)`
- Saida `solaris-foundry-draft-v1`
- Actor draft de personagem
- Itens draft para armas, armaduras, cubos, consumiveis e habilidades
- `flags.solaris` preservando o objeto original
- `system` preenchido com dados Solaris normalizados

Este arquivo ainda nao cria documentos dentro do Foundry. Ele e um contrato para
o futuro importador.

## Fase Foundry 2 - Modulo importador

Nome sugerido: `solaris-importer`.

Responsabilidade:

- Ler `solaris-foundry-draft-v1`.
- Criar Actors e Items no Foundry.
- Converter habilidades e condicoes em Active Effects quando possivel.
- Criar Journal Entries para regras e notas.

## Fase Foundry 3 - Sistema Guerra Solar

Nome sugerido: `guerra-solar`.

Responsabilidade:

- Ficha nativa.
- Rolagens oficiais.
- Compendios.
- Itens e bestiario.
- Combate e automacoes.

## Cuidados

- Nao depender de APIs especificas do Foundry dentro da Biblioteca.
- Nao remover exportacao Solaris JSON.
- Nao implementar sistema Foundry antes de estabilizar schemas.
