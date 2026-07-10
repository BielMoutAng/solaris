# Roadmap Solaris

## Objetivo Final

Criar a Biblioteca Solaris completa e, a partir dela, criar um sistema jogavel
de Guerra Solar no Foundry VTT. A Biblioteca Solaris continua sendo a fonte
oficial dos dados; o Foundry VTT e o destino final de jogo, mas nao substitui a
Biblioteca.

O criterio final de sucesso e permitir que o usuario crie ou importe
personagens da Biblioteca Solaris, abra um mundo Guerra Solar no Foundry, crie
personagens e criaturas, use itens e habilidades, role testes oficiais,
controle combate e jogue uma sessao completa.

## Produtos Conectados

1. Biblioteca Solaris
   - ficha;
   - itens;
   - inventario fisico;
   - cubos;
   - municao;
   - habilidades;
   - bestiario;
   - regras;
   - rolagens;
   - HUD vital;
   - storage;
   - backup;
   - exportacao/importacao.
2. Solaris Foundry Bridge
   - `solaris-character-v1`;
   - `solaris-item-v1`;
   - `solaris-creature-v1`;
   - `solaris-export-bundle-v1`;
   - `solaris-foundry-draft-v1`;
   - importador/exportador.
3. Sistema Foundry Guerra Solar
   - `system.json`;
   - Actors `character` e `npc`;
   - Items `weapon`, `armor`, `ammo`, `magazine`, `container` e `ability`;
   - fichas nativas;
   - rolagens nativas;
   - combate;
   - condicoes;
   - compendios;
   - importador integrado;
   - sessao jogavel.

## Regras Permanentes

- Nao quebrar fichas antigas.
- Nao apagar chaves legadas sem migracao segura e backup.
- Nao migrar `ESP` automaticamente para `MEN`.
- Atributos oficiais: `FOR`, `REF`, `CON`, `INT`, `PRE` e `MEN`.
- Cosmos e recurso/poder separado, nao atributo base.
- Preservar `legacy` sempre que houver duvida.
- Nao alterar valores oficiais sem fase especifica de revisao.
- Preferir regras puras em `src/domain`.
- `app.js` deve ser camada de interface/aplicacao, nao deposito de regra.
- Foundry real so entra depois que a Biblioteca tiver dados estruturados.
- Toda fase deve atualizar `README_CONTEXTO_CHATGPT.md` e
  `README_ATUALIZACOES_CHAT.md`.
- Toda fase deve rodar `npm test`, `node --check` e `git diff --check`.
- Ao alterar `app.js`, `index.html`, `sw.js` ou imports offline, atualizar
  versao e cache.

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

## Fase 5 - Ficha ativa completa e modularizacao

Status: concluida em `0.6.0-alpha.32`.

- Criar estado modular de ficha ativa em `src/ui/solaris-character-state.js`.
- Criar adaptadores de leitura para UI em `src/ui/solaris-character-ui.js`.
- Normalizar a ficha ativa para `solaris-character-v1` sem alterar a interface
  visual.
- Manter `resources.pv`, `resources.stress` e `resources.cosmos` como origem
  oficial de PV, Estresse e Cosmos.
- Manter FOR, REF, CON, INT, PRE e MEN como atributos oficiais.
- Preservar `ESP` em `legacy`, sem migracao automatica para `MEN`.
- Preparar secoes minimas de `equipment`, `inventory` e `ammoSystem` para
  fases futuras.
- Integrar salvar, carregar, importar, exportar e persistencia silenciosa da
  UI atual ao estado modular.

## Fase 6 - Inventario fisico completo

Status: concluida em `0.6.0-alpha.33`.

- Criar `src/domain/solaris-inventory-rules.js` com regras puras de inventario
  fisico, sem DOM.
- Consolidar localizacao fisica de itens por `location.type`, incluindo
  equipado, armadura, maos, gancho, coldre, bandoleira, cubo, mochila, solto,
  acoplado, container e desconhecido.
- Tratar cubos como containers fisicos com `contents`.
- Preparar ganchos, coldres e bandoleiras como suportes de acesso fisico.
- Equipar e desequipar armaduras, armas e itens genericos sem apagar dados.
- Integrar a normalizacao de inventario com a ficha ativa modular.
- Criar view models de inventario, equipamento, armazenamento, cubos e acesso
  rapido para uso gradual pela interface.
- Preservar `ammoSystem` apenas como estrutura preparada; a logica profunda de
  municao e carregadores fica para a Fase 7.
- Preservar `ESP` em `legacy` sem migracao automatica.

## Fase 7 - Municao, carregadores e armas carregadas

Status: concluida em `0.6.0-alpha.34`.

- Criar `src/domain/solaris-ammo-rules.js` com regras puras de municao,
  carregadores e armas carregadas, sem DOM.
- Normalizar pilhas de municao com tipo, quantidade e unidades de cubo.
- Normalizar carregadores com capacidade, municao carregada, compatibilidade e
  vinculo opcional a arma.
- Normalizar armas carregadas com `ammoProfile`, `ammoState`, fonte ativa,
  estado de disparo e compatibilidade de municao.
- Permitir acoplar e desacoplar carregadores, carregar municao em carregador,
  recarregar armas internas, disparar armas e acionar pump em armas que exigem
  esse passo.
- Integrar `ammoSystem` com inventario fisico, ficha ativa modular, view models
  de UI, exportacao oficial e Foundry Draft.
- Preservar `ESP` em `legacy` sem migracao automatica.
- Manter a UI visual sem alteracao nesta fase.

## Roadmap Obrigatorio

- Fase 6 - Inventario fisico completo. Status: concluida em
  `0.6.0-alpha.33`.
- Fase 7 - Municao, carregadores e armas carregadas. Status: concluida em
  `0.6.0-alpha.34`.
- Fase 8 - Itens, habilidades e catalogos oficiais estruturados.
- Fase 9 - Bestiario estruturado.
- Fase 10 - Rolagens e combate completos na Biblioteca.
- Fase 11 - HUD vital funcional.
- Fase 12 - Criador de personagem completo.
- Fase 13 - Painel do mestre na Biblioteca.
- Fase 14 - Foundry Draft completo.
- Fase 15 - Modulo Foundry `solaris-importer`.
- Fase 16 - Estrutura do sistema Foundry `guerra-solar`.
- Fase 17 - Data Models do Foundry.
- Fase 18 - Fichas nativas do Foundry.
- Fase 19 - Rolagens nativas do Foundry.
- Fase 20 - Combate nativo do Foundry.
- Fase 21 - Compendios oficiais do Foundry.
- Fase 22 - Importador integrado ao sistema Foundry.
- Fase 23 - Cena jogavel piloto.
- Fase 24 - Release do sistema Guerra Solar para Foundry.
