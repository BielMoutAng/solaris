# Roadmap Solaris

## Fase 1 - Documentacao e arquitetura

- Criar documentacao base.
- Registrar glossario oficial.
- Definir plano Foundry sem acoplar o app ao Foundry.

## Fase 2 - Schemas oficiais

- Criar constantes de schema em `src/schemas`.
- Validar formas basicas de personagem, item e criatura.
- Reconhecer FOR, REF, CON, INT, PRE e MEN como atributos oficiais.
- Manter ESP apenas como legado/compatibilidade ate migracao manual confirmada.
- Manter Cosmos como recurso/poder separado.
- Manter schemas sem dependencias externas.

## Fase 3 - Exportacao/importacao base

Status: concluida em `0.6.0-alpha.29`.

- Exportar ficha para `solaris-character-v1`.
- Importar `solaris-character-v1` e fichas legadas.
- Criar `solaris-export-bundle-v1`.
- Criar `solaris-foundry-draft-v1`.
- Estabilizar `resources` como secao oficial para PV, Estresse e Cosmos.
- Priorizar exportacao/importacao e validacao antes de novas telas.

## Fase 4 - Persistencia e migracao dedicada

Status: concluida em `0.6.0-alpha.30`.

- Criar `solaris-storage-v1` como envelope dedicado de persistencia.
- Migrar arrays e snapshots legados da Biblioteca sem apagar chaves antigas.
- Preservar dados desconhecidos em `legacy`.
- Manter `ESP` apenas como legado, sem conversao automatica para `MEN`.
- Criar `solaris-backup-v1` para exportar/restaurar snapshots com checksum.
- Testar storage, migracoes e backup sem depender do navegador real.

## Fase 4.5 - Integracao gradual do app visual ao storage

Status: concluida em `0.6.0-alpha.31`.

- Inicializar a Biblioteca pelo `solaris-storage-v1` quando a chave nova
  existir.
- Ler chaves legadas em modo compatibilidade quando ainda nao houver
  `solaris.storage.v1`.
- Nao apagar nem sobrescrever chaves antigas automaticamente.
- Criar backup `solaris-backup-v1` antes da primeira migracao persistida a
  partir de dados legados.
- Encapsular leitura/gravacao de fichas por wrappers de storage compativeis
  com a UI atual.
- Manter dados desconhecidos e `ESP` legado preservados em `legacy`.
- Manter UI e mecanicas sem alteracao nesta etapa.

## Fases seguintes

- Ficha ativa mais modular.
- Inventario fisico completo.
- Municao e carregadores completos.
- Itens, skills e bestiario totalmente estruturados.
- Foundry Draft mais rico.
- Modulo importador Foundry.
- Sistema Guerra Solar nativo para Foundry.
