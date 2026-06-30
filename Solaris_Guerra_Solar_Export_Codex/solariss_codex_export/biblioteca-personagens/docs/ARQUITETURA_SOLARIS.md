# Arquitetura Solaris

A Biblioteca Solaris e a fonte oficial dos dados de Guerra Solar. Foundry VTT,
Electron, PWA e futuras ferramentas devem consumir dados exportados pela
Biblioteca, sem virar o centro do projeto.

## Camadas

1. Dominio puro: regras, calculos, inventario, combate e bestiario em
   `src/domain`.
2. Dados oficiais: catalogos e livros carregados pela Biblioteca.
3. Aplicacao/UI: `app.js`, `index.html` e `styles.css`.
4. Persistencia local: localStorage hoje, camada dedicada em fase futura.
5. Schemas: contratos versionados em `src/schemas`.
6. Exportacao/importacao: conversores em `src/export`.
7. Adaptadores externos: Foundry Draft primeiro, modulo Foundry depois.

## Principios

- Nao quebrar fichas antigas.
- Toda exportacao nova deve ter `schema`, `saveVersion` e `appVersion`.
- Os atributos oficiais do schema v1 sao FOR, REF, CON, INT, PRE e MEN.
- ESP e legado/compatibilidade e deve ser preservado em `legacy` ate migracao segura.
- Cosmos e recurso/poder separado, nao atributo base.
- Regras mecanicas devem migrar gradualmente de `app.js` para `src/domain`.
- O app deve continuar funcionando offline no navegador, PWA/iPhone e Electron.
- Foundry recebe dados; a Biblioteca continua independente.

## Fluxo de dados

Ficha legada da Biblioteca -> Solaris Character v1 -> Solaris Export Bundle v1
-> Foundry Draft v1 -> futuro modulo importador Foundry.
