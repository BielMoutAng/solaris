# Manual de Autonomia Tecnica - Biblioteca Solaris / Guerra Solar

Este manual descreve os conhecimentos necessarios para manter, evoluir e
auditar a Biblioteca Solaris sem depender de inferencia de agentes de IA.

O objetivo nao e transformar uma pessoa em especialista em todos os assuntos de
uma vez. O objetivo e dar uma trilha objetiva para entender o projeto, tomar
decisoes tecnicas corretas, implementar mudancas com seguranca, testar, publicar
e preparar a futura exportacao para Foundry VTT.

## Como usar este manual

Leia em ordem:

1. Fundamentos basicos de todas as areas.
2. Nivel intermediario de todas as areas.
3. Nivel avancado de todas as areas.
4. Procedimentos praticos de manutencao.
5. Exercicios de autonomia.

Regra pratica:

- Se voce nao entende o que um arquivo faz, nao altere esse arquivo ainda.
- Se voce nao sabe validar a alteracao, a alteracao ainda nao esta pronta.
- Se voce nao sabe preservar dados antigos, nao mexa em storage, schema ou
  importacao.
- Se voce nao sabe explicar a regra de jogo afetada, nao altere mecanica.

## Estado atual do projeto

A Biblioteca Solaris e a fonte oficial dos dados de Guerra Solar.

O projeto atual contem:

- Aplicacao web local em HTML, CSS e JavaScript.
- PWA/offline via `sw.js`.
- Desktop via Electron.
- Regras puras em `src/domain`.
- Schemas versionados em `src/schemas`.
- Exportacao/importacao em `src/export`.
- Storage, migracao e backup em `src/storage`.
- Estado modular da ficha ativa em `src/ui`.
- Dados oficiais extraidos dos livros em arquivos `official-*`.
- Testes automatizados em `tests`.

Arquivos centrais:

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- `official-books-data.js`
- `official-book5-catalog.js`
- `official-rulebook-compendium.js`
- `src/domain/solaris-domain-architecture.js`
- `src/domain/solaris-character-creation.js`
- `src/domain/solaris-equipment-rules.js`
- `src/domain/solaris-bestiary-rules.js`
- `src/domain/solaris-combat-rules.js`
- `src/domain/solaris-gm-rules.js`
- `src/domain/solaris-lore-rules.js`
- `src/schemas/solaris-schemas.js`
- `src/export/solaris-export-core.js`
- `src/export/solaris-import-core.js`
- `src/export/solaris-foundry-export.js`
- `src/storage/solaris-storage.js`
- `src/storage/solaris-migrations.js`
- `src/storage/solaris-backup.js`
- `src/ui/solaris-character-state.js`
- `src/ui/solaris-character-ui.js`
- `electron-main.cjs`
- `electron-builder.ficha.cjs`

Comandos principais:

```bash
npm start
npm test
npm run dist
```

## Principios obrigatorios do projeto

1. A Biblioteca Solaris e a fonte oficial dos dados.
2. Foundry VTT e destino futuro de exportacao/importacao, nao fonte principal.
3. O app deve funcionar offline no navegador, no PWA/iPhone e no Electron.
4. Fichas antigas nao podem quebrar.
5. Dados desconhecidos devem ser preservados em `legacy`.
6. `ESP` e legado/compatibilidade; nao converter automaticamente para `MEN`.
7. Cosmos e recurso/poder separado, nao atributo base.
8. Atributos oficiais: `FOR`, `REF`, `CON`, `INT`, `PRE`, `MEN`.
9. Regras mecanicas devem ir para `src/domain` sempre que possivel.
10. UI deve adaptar regras, nao reinventar regras.
11. Toda mudanca relevante precisa de teste ou validacao clara.
12. Cache deve ser atualizado quando arquivos carregados pelo navegador mudarem.

---

# Parte 1 - Nivel Basico

Esta parte cobre o minimo necessario para ler, entender e fazer pequenas
alteracoes no projeto com seguranca.

## 1. Logica de programacao

### Conceitos essenciais

- Variavel: nome que aponta para um valor.
- Tipo: classificacao do valor, como texto, numero, booleano, array ou objeto.
- Condicional: decisao com `if`, `else`, `switch`.
- Repeticao: processamento de listas com `for`, `forEach`, `map`, `filter`.
- Funcao: bloco reutilizavel que recebe entrada e devolve resultado.
- Estado: conjunto de dados que representa a situacao atual do app.
- Entrada: dado vindo do usuario, formulario, arquivo, storage ou catalogo.
- Saida: tela renderizada, JSON exportado, arquivo salvo, teste aprovado.

### Exemplo no projeto

Uma ficha tem atributos, recursos e inventario. O app calcula derivados como CA,
PV maximo e movimento. Isso exige:

1. Ler os dados da ficha.
2. Normalizar valores numericos.
3. Aplicar regras oficiais.
4. Renderizar resultado.
5. Salvar estado atualizado.

### O que estudar

- Operadores: `+`, `-`, `*`, `/`, `===`, `!==`, `&&`, `||`.
- Arrays: `map`, `filter`, `find`, `reduce`, `some`, `every`.
- Objetos: chaves, valores, copia, destructuring.
- Funcoes puras: mesma entrada, mesma saida, sem alterar estado externo.

### Erros comuns

- Comparar numero com texto sem converter.
- Alterar objeto compartilhado sem perceber.
- Misturar regra de jogo com DOM.
- Salvar dado derivado como se fosse dado oficial.
- Apagar dado legado em vez de preservar em `legacy`.

## 2. JavaScript basico

### Papel no projeto

JavaScript e a linguagem principal da Biblioteca Solaris. Ela controla:

- Regras de dominio.
- Renderizacao da ficha.
- Leitura de formularios.
- Storage local.
- Exportacao/importacao JSON.
- Service worker.
- Electron.
- Testes.

### Conceitos essenciais

- `const`: valor que nao sera reatribuido.
- `let`: valor que pode ser reatribuido.
- `function`: funcao nomeada.
- `=>`: funcao de seta.
- `import` e `export`: modularizacao.
- `Promise` e `async/await`: operacoes assincronas.
- `JSON.stringify` e `JSON.parse`: converter objeto para texto e texto para
  objeto.

### Padrao recomendado

Use `const` por padrao. Use `let` apenas quando precisar reatribuir.

Prefira:

```js
const total = items.reduce((sum, item) => sum + item.price, 0);
```

Evite:

```js
var total = 0;
for (var i = 0; i < items.length; i++) {
  total = total + items[i].price;
}
```

### Como aplicar no Solaris

Para criar uma regra nova:

1. Coloque a regra pura em `src/domain`.
2. Exporte a funcao.
3. Crie teste em `tests`.
4. Importe no `app.js`.
5. Use a funcao para renderizar ou salvar.

## 3. HTML basico

### Papel no projeto

`index.html` define a estrutura inicial da Biblioteca:

- Formularios.
- Botoes.
- Containers.
- Modais.
- Areas de biblioteca.
- Entradas de arquivo.

JavaScript preenche e atualiza esses elementos.

### Conceitos essenciais

- Elemento: tag HTML como `div`, `button`, `input`.
- Atributo: informacao no elemento, como `id`, `class`, `data-*`.
- Formulario: grupo de entradas do usuario.
- Semantica: escolher tag que representa o papel do conteudo.

### Padrao no projeto

Elementos manipulados pelo JavaScript geralmente usam:

- `id`, quando existe apenas um elemento.
- `class`, quando existe estilo ou grupo.
- `data-*`, quando o elemento dispara acao especifica.

Exemplo:

```html
<button data-action="save-character">Salvar ficha</button>
```

## 4. CSS basico

### Papel no projeto

`styles.css` controla:

- Aparencia sci-fi/neon.
- Layout responsivo.
- Modais.
- Cards.
- Paineis.
- Estados visuais.
- PWA/mobile.

### Conceitos essenciais

- Seletor: escolhe elementos.
- Propriedade: define estilo.
- Box model: `margin`, `border`, `padding`, `content`.
- Flexbox: alinhar em linha/coluna.
- Grid: layouts em grade.
- Media query: responsividade.
- Variaveis CSS: tokens de cor, sombra e espacamento.

### Regra pratica

Antes de criar uma classe nova, procure uma classe parecida em `styles.css`.

Evite:

- CSS duplicado.
- Tamanhos fixos que quebram mobile.
- Texto que nao cabe no botao.
- Layout que depende de scroll desnecessario.

## 5. DOM basico

### Papel no projeto

DOM e a arvore de elementos HTML que o JavaScript manipula.

O `app.js` usa:

- `document.querySelector`
- `addEventListener`
- `innerHTML`
- `textContent`
- `classList`
- `dataset`

### Cuidados

- Nunca use dado do usuario em `innerHTML` sem escapar.
- Prefira `textContent` quando for texto simples.
- Use funcoes como `escapeHtml` quando precisar montar HTML.
- Evite espalhar `querySelector` em muitos lugares para a mesma coisa.

## 6. Git basico

### Papel no projeto

Git registra historico de alteracoes. GitHub publica o repositorio.

Comandos essenciais:

```bash
git status
git diff
git add caminho/do/arquivo
git commit -m "Mensagem clara"
git push origin main
git tag v0.0.0
git push origin v0.0.0
```

### Processo minimo seguro

1. `git status`
2. Fazer alteracao.
3. `git diff`
4. Rodar testes/checks.
5. `git add`
6. `git commit`
7. `git push`

### Mensagem de commit

Boa:

```text
Modulariza ficha ativa Solaris
```

Ruim:

```text
update
```

## 7. Node.js e npm basico

### Papel no projeto

Node executa scripts, testes e builds. npm gerencia dependencias.

Arquivos:

- `package.json`: scripts, versao, dependencias.
- `package-lock.json`: versoes travadas.
- `node_modules`: dependencias instaladas.

Comandos:

```bash
npm install
npm test
npm start
npm run dist
```

### Cuidados

- Nao edite `package-lock.json` manualmente sem motivo.
- Se mudar versao em `package.json`, mantenha `package-lock.json` alinhado.
- Nao commite `node_modules`.

## 8. Testes basicos

### Papel no projeto

Testes garantem que regras, schemas e migracoes continuem funcionando.

O projeto usa `node:test`.

Exemplo simples:

```js
import assert from "node:assert/strict";
import test from "node:test";

test("soma dois valores", () => {
  assert.equal(2 + 2, 4);
});
```

### Quando criar teste

Crie teste quando alterar:

- Regra de combate.
- Inventario.
- Storage.
- Schema.
- Exportacao/importacao.
- Migracao.
- Calculo de ficha.
- Parser de catalogo.

## 9. Dados basicos

### Conceitos essenciais

- Dado bruto: informacao como veio do livro, usuario ou catalogo.
- Dado normalizado: informacao convertida para formato padrao.
- Schema: contrato de formato.
- Migracao: conversao segura de versao antiga para nova.
- Legacy: area para preservar dado antigo ou desconhecido.

### Exemplo Solaris

Na ficha antiga:

```js
attributes: { FOR: 8, REF: 9, ESP: 12 }
```

No schema oficial:

```js
attributes: { for: 8, ref: 9, con: 0, int: 0, pre: 0, men: 0 },
legacy: { attributes: { ESP: 12 } }
```

## 10. APIs basicas

### O que e API

API e uma interface para outro codigo usar. Pode ser:

- Funcao interna.
- Modulo JavaScript.
- API do navegador.
- API do Electron.
- API do Foundry no futuro.
- API HTTP.

### APIs usadas no projeto

- DOM API.
- File API.
- localStorage.
- Cache API.
- Service Worker API.
- Electron APIs.
- Futuramente Foundry APIs.

## 11. Arquitetura basica

### Camadas atuais

1. `src/domain`: regras puras.
2. `src/schemas`: contratos de dados.
3. `src/export`: conversores.
4. `src/storage`: persistencia.
5. `src/ui`: estado/adaptadores da ficha ativa.
6. `app.js`: aplicacao e UI.
7. `index.html` e `styles.css`: estrutura e visual.
8. `sw.js`: offline/PWA.
9. Electron: desktop.

### Regra de dependencia

Dependencias devem apontar para dentro, nao para fora:

- UI pode usar dominio.
- Dominio nao deve depender de UI.
- Storage pode usar schema/export quando necessario.
- Schema nao deve depender de UI.

## 12. ML basico

### Papel real no projeto

ML nao e parte obrigatoria da Biblioteca Solaris atual. O app nao deve depender
de modelo de IA para funcionar.

ML pode ajudar futuramente em tarefas auxiliares:

- Extrair tabelas de livros.
- Classificar itens.
- Detectar inconsistencias.
- Sugerir normalizacao.
- Gerar descricoes auxiliares.

Mas o resultado final deve virar dado estruturado auditavel, testado e
versionado. A aplicacao nao deve depender de inferencia em tempo real.

---

# Parte 2 - Nivel Intermediario

Esta parte permite fazer alteracoes reais no projeto com menos risco.

## 13. JavaScript intermediario

### Imutabilidade pratica

Evite alterar objetos recebidos por parametro se a funcao deveria ser pura.

Prefira:

```js
function updatePv(character, value) {
  return {
    ...character,
    resources: {
      ...character.resources,
      pv: {
        ...character.resources.pv,
        value,
      },
    },
  };
}
```

Evite:

```js
function updatePv(character, value) {
  character.resources.pv.value = value;
  return character;
}
```

### Normalizacao de entrada

Nunca confie que um dado vindo de arquivo ou storage tem o formato correto.

Use funcoes auxiliares:

- `numberValue`
- `textValue`
- `arrayValue`
- `isObject`
- `clone`

### Erros e warnings

Erros devem impedir operacao perigosa.

Warnings devem avisar sem destruir dados.

Exemplo:

- JSON invalido: erro.
- `ESP` legado: warning.
- Campo desconhecido: preservar em `legacy`.

## 14. CSS intermediario

### Layout responsivo

O app precisa funcionar em:

- Desktop.
- Browser.
- PWA/iPhone.
- Electron.

Use:

- `grid-template-columns`
- `minmax`
- `clamp`
- `max-width`
- `overflow`
- media queries.

Evite:

- Texto absoluto em pixels sem responsividade.
- Elementos fixos que encobrem botoes.
- Layout que depende de zoom manual.

### Estados visuais

Estados importantes:

- Selecionado.
- Desabilitado.
- Erro.
- Aviso.
- Sucesso.
- Carregando.
- Sem dados.

Um estado visual deve corresponder a um estado real do sistema.

## 15. DOM intermediario

### Delegacao de eventos

Em listas dinamicas, use evento no container:

```js
container.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  // tratar acao
});
```

Isso evita recriar listeners para cada item.

### Renderizacao segura

Ao montar HTML com dados dinamicos:

```js
return `<strong>${escapeHtml(item.name)}</strong>`;
```

Se for texto simples:

```js
node.textContent = item.name;
```

## 16. Modelagem de dominio

### O que e dominio

Dominio e o conjunto de regras reais do sistema:

- Como calcula PV.
- Como funciona CA.
- Como arma dispara.
- Como cubo armazena.
- Como rachadura afeta equipamento.
- Como monstro rola dano.
- Como compra debita Luzentis.

### Onde fica

O dominio deve ficar em `src/domain`.

Exemplos:

- `solaris-domain-architecture.js`
- `solaris-equipment-rules.js`
- `solaris-combat-rules.js`
- `solaris-bestiary-rules.js`

### Regra pratica

Se a regra pode ser testada sem navegador, ela deve estar em `src/domain`.

## 17. Schemas intermediarios

### Papel do schema

Schema define contrato. Ele responde:

- Que campos existem?
- Quais sao obrigatorios?
- Que formato cada campo tem?
- Qual versao desse formato?
- Como preservar dados antigos?

### Schemas atuais

- `solaris-character-v1`
- `solaris-item-v1`
- `solaris-creature-v1`
- `solaris-campaign-v1`
- `solaris-export-bundle-v1`
- `solaris-foundry-draft-v1`
- `solaris-storage-v1`
- `solaris-backup-v1`

### Evolucao segura

Para adicionar campo:

1. Adicione no schema.
2. Atualize normalizadores.
3. Preserve compatibilidade.
4. Adicione teste.
5. Atualize docs.

Para remover campo:

1. Nao remova direto.
2. Marque como legado.
3. Preserve em `legacy`.
4. Crie migracao quando a regra estiver definida.

## 18. Storage intermediario

### Storage atual

O storage oficial e `solaris-storage-v1`.

Chave raiz:

```text
solaris.storage.v1
```

Chaves legadas lidas em compatibilidade:

- `solaris.character.library.v1`
- `solaris.custom.content.library.v1`
- `solaris.shop.price.overrides.v1`
- `solaris.monster.library.v1`

### Regra critica

Leitura de legado nao apaga legado.

Na primeira gravacao depois de detectar legado, criar backup antes de persistir.

### Backup

Backup oficial:

```text
solaris-backup-v1
```

Inclui:

- schema.
- versao.
- payload.
- checksum.
- warnings.
- legacy.

## 19. Exportacao/importacao intermediaria

### Exportacao

Exportar e transformar dado interno em contrato externo.

Arquivos:

- `src/export/solaris-export-core.js`
- `src/export/solaris-foundry-export.js`

### Importacao

Importar e receber dado externo ou antigo e converter para formato seguro.

Arquivo:

- `src/export/solaris-import-core.js`

### Regra pratica

Importador deve ser tolerante.

Exportador deve ser consistente.

Migrador deve ser conservador.

## 20. Testes intermediarios

### Tipos de teste uteis

- Teste de funcao pura.
- Teste de migracao.
- Teste de importacao/exportacao.
- Teste de storage em memoria.
- Teste de regra de combate.
- Teste de inventario.
- Teste de regressao.

### Estrutura recomendada

```js
test("descricao objetiva do comportamento", () => {
  const input = {};
  const result = funcao(input);
  assert.equal(result.campo, valorEsperado);
});
```

### O que testar em cada mudanca

Mudanca em schema:

- Validador aceita formato novo.
- Validador alerta formato legado.
- Importador preserva legado.

Mudanca em regra:

- Caso normal.
- Caso limite.
- Caso invalido.

Mudanca em storage:

- Salva.
- Carrega.
- Migra.
- Preserva legado.
- Falha com erro claro.

## 21. Debug intermediario

### Ferramentas

- Console do navegador.
- DevTools.
- `console.log` temporario.
- `node --check`.
- `npm test`.
- `git diff`.

### Processo

1. Reproduzir problema.
2. Isolar entrada.
3. Localizar funcao responsavel.
4. Criar teste que falha.
5. Corrigir.
6. Rodar teste.
7. Remover logs temporarios.

### Erros frequentes

- `undefined is not a function`: chamada em valor errado.
- `Cannot read properties of undefined`: caminho de objeto ausente.
- JSON invalido: arquivo corrompido ou formato errado.
- Cache antigo: PWA carregando versao anterior.
- Import quebrado: query `?v=` ou caminho incorreto.

## 22. Build e publicacao intermediarios

### Web/PWA

Arquivos importantes:

- `index.html`
- `sw.js`
- `manifest.webmanifest`
- `assets/icons/*`

Quando mudar arquivo importado pelo navegador:

1. Atualize query `?v=...`.
2. Atualize caches em `sw.js`.
3. Teste em janela anonima ou limpe cache.

### Electron

Arquivos:

- `electron-main.cjs`
- `electron-builder.ficha.cjs`
- `package.json`

Comandos:

```bash
npm start
npm run dist
```

### GitHub

Publicacao basica:

```bash
git add .
git commit -m "Descricao"
git push origin main
git tag v0.0.0
git push origin v0.0.0
```

## 23. APIs e integracoes intermediarias

### Browser APIs

DOM API:

- Manipula tela.

File API:

- Importa imagens e JSON.

localStorage:

- Persiste dados locais.

Cache API:

- Guarda arquivos offline.

Service Worker:

- Intercepta requests e serve cache.

### Electron

Electron empacota o app web como desktop.

Cuidados:

- Nao depender de servidor externo para funcoes basicas.
- Manter caminhos relativos.
- Testar em Windows.

### Foundry Draft

O projeto ainda nao implementa Foundry real.

Existe draft:

- `solaris-foundry-draft-v1`
- `src/export/solaris-foundry-export.js`

Objetivo:

- Preparar dados para futuro modulo/importador.
- Nao acoplar Biblioteca ao Foundry.

## 24. Dados intermediarios

### Catalogos oficiais

Arquivos:

- `official-books-data.js`
- `official-book5-catalog.js`
- `official-rulebook-compendium.js`

Esses arquivos carregam conteudo dos livros.

### Governanca de dados

Toda entrada oficial deve ter, quando possivel:

- id.
- nome.
- tipo.
- tier.
- preco.
- peso.
- descricao.
- regras.
- fonte.
- trecho oficial.
- tags.

### Normalizacao

Normalizacao converte variedade de entrada em formato unico.

Exemplo:

- "Arma", "weapon", "arma de fogo" podem virar `type: "weapon"`.

## 25. ML intermediario

### Quando ML ajuda

ML pode ajudar em etapas de preparacao:

- OCR.
- Classificacao.
- Extracao de tabelas.
- Agrupamento de itens.
- Deteccao de duplicatas.

### Quando ML nao deve decidir

ML nao deve decidir sozinho:

- Regras oficiais.
- CA de armadura.
- Dano de arma.
- Custo de item.
- Migracao de atributo.
- Compatibilidade de schema.

### Pipeline correto com ML

1. Modelo sugere extracao.
2. Humano revisa.
3. Dado entra em catalogo.
4. Testes validam.
5. App consome dado estruturado.

---

# Parte 3 - Nivel Avancado

Esta parte cobre evolucao arquitetural, confiabilidade, performance e
preparacao para integracoes maiores.

## 26. Arquitetura avancada

### Objetivo

Separar responsabilidades para que o projeto cresca sem virar um unico arquivo
dificil de manter.

### Direcao ideal

```text
Dados oficiais -> Schemas -> Dominio -> Estado ativo -> UI
                         -> Storage
                         -> Exportadores
```

### Regras de dependencia

Permitido:

- `app.js` importar `src/domain`, `src/storage`, `src/export`, `src/ui`.
- `src/ui` importar schemas/exportadores quando for adaptador.
- `src/storage` importar migracoes e schemas.
- `src/export` importar schemas.
- `src/domain` ser independente de DOM.

Evitar:

- `src/domain` importar `app.js`.
- `src/domain` acessar DOM.
- `src/domain` acessar localStorage diretamente.
- `src/schemas` depender de UI.

## 27. Modularizacao avancada de `app.js`

### Problema

`app.js` concentra muita responsabilidade:

- Eventos.
- Renderizacao.
- Regras ainda legadas.
- Estado visual.
- Fluxos de compra.
- Ficha.
- Inventario.
- Dados.

### Estrategia

Extrair por fronteira:

1. Estado de ficha: `src/ui/solaris-character-state.js`.
2. Adaptadores de leitura: `src/ui/solaris-character-ui.js`.
3. Renderizacao de componentes.
4. Eventos por area.
5. Fluxos de aplicacao.

### Ordem segura

1. Criar modulo novo puro.
2. Cobrir com testes.
3. Importar no `app.js`.
4. Substituir uso antigo aos poucos.
5. Validar UI.

## 28. Arquitetura de dados avancada

### Versionamento

Todo formato persistente deve ter:

- `schema`
- `version` ou `saveVersion`
- `appVersion`
- `createdAt`
- `updatedAt`

### Compatibilidade

Nunca assuma que dado salvo hoje sera igual ao dado salvo daqui a seis meses.

Regras:

- Adicionar campo e seguro se tiver default.
- Renomear campo exige migracao.
- Remover campo exige preservar em `legacy`.
- Alterar tipo exige migracao e teste.

### Contratos

Contratos atuais:

- Personagem: `solaris-character-v1`.
- Item: `solaris-item-v1`.
- Criatura: `solaris-creature-v1`.
- Storage: `solaris-storage-v1`.
- Backup: `solaris-backup-v1`.
- Foundry Draft: `solaris-foundry-draft-v1`.

## 29. Migracoes avancadas

### Objetivo

Permitir que dados antigos continuem abrindo.

### Migracao segura

1. Detectar formato.
2. Validar minimamente.
3. Copiar dados conhecidos.
4. Preservar desconhecidos em `legacy`.
5. Gerar warnings.
6. Nunca apagar origem automaticamente.
7. Testar caso legado.

### Migracao perigosa

Exemplo proibido:

```js
attributes.men = attributes.esp;
delete attributes.esp;
```

Isso perde informacao e assume regra nao confirmada.

Correto:

```js
legacy.attributes.ESP = attributes.ESP;
```

## 30. Testes avancados

### Testes de regressao

Quando um bug aparece:

1. Crie teste reproduzindo bug.
2. Veja teste falhar.
3. Corrija.
4. Veja teste passar.

### Testes de propriedades

Para regras numericas, pense em invariantes:

- PV atual nao deve ultrapassar PV maximo apos cura.
- Item vendido deve sair do inventario.
- Compra sem saldo nao deve debitar.
- Backup restaurado deve manter schema.
- Item em cubo nao deve contar como item solto se a regra disser isso.

### Testes de migracao

Mantenha amostras antigas:

- Ficha sem `resources`.
- Ficha com `ESP`.
- Ficha com inventario legado.
- Storage antigo como array.
- JSON invalido.

## 31. Performance avancada

### Onde performance importa

- Renderizacao de listas grandes.
- Busca em catalogos oficiais.
- Bestiario.
- Compendio de regras.
- Service worker/cache.
- Imagens.
- Electron.

### Tecnicas

- Evitar renderizar tudo a cada tecla.
- Usar paginacao.
- Usar filtros precomputados.
- Evitar `innerHTML` gigante quando nao necessario.
- Cuidar de imagens grandes em base64.
- Medir antes de otimizar.

### Sinais de problema

- Digitar em busca trava tela.
- Abrir biblioteca demora muito.
- PWA carrega arquivo antigo.
- Electron abre lento.
- Imagem deixa ficha pesada.

## 32. Seguranca avancada

### Riscos reais

- JSON importado malformado.
- HTML injetado em descricoes.
- Imagem enorme em base64.
- Storage corrompido.
- Dependencia externa comprometida.
- Publicacao acidental de arquivos pessoais.

### Mitigacoes

- Escapar HTML.
- Validar JSON.
- Limitar formatos de imagem.
- Manter backups.
- Revisar `git diff`.
- Nao commitar `.env`, dados pessoais ou arquivos temporarios.

## 33. Offline/PWA avancado

### Componentes

- `manifest.webmanifest`
- `sw.js`
- Cache API.
- Assets locais.
- Query de cache `?v=...`.

### Falhas comuns

- Arquivo novo nao incluido no `APP_SHELL`.
- Cache nao atualizado.
- Import com versao antiga.
- GitHub Pages servindo arquivo antigo por cache.

### Processo seguro

Quando criar arquivo JS importado:

1. Importar com `?v=cache`.
2. Adicionar ao `sw.js` se precisar offline.
3. Atualizar `STATIC_CACHE` e `RUNTIME_CACHE`.
4. Testar reload limpo.

## 34. Electron avancado

### Objetivo

Entregar a Biblioteca como app desktop Windows.

### Arquivos

- `electron-main.cjs`
- `electron-builder.ficha.cjs`
- `package.json`

### Cuidados

- O app deve abrir sem servidor.
- Caminhos devem ser relativos.
- Storage do Electron pode ser diferente do navegador.
- Build deve ser testado em maquina limpa quando possivel.

## 35. Foundry avancado

### Estado atual

O projeto ainda nao implementa Foundry real.

Existe:

- Plano em `docs/FOUNDRY_EXPORT_PLAN.md`.
- Draft em `src/export/solaris-foundry-export.js`.
- Schema `solaris-foundry-draft-v1`.

### Ordem correta para Foundry

1. Estabilizar schemas da Biblioteca.
2. Estabilizar inventario e municao.
3. Enriquecer Foundry Draft.
4. Criar importador externo.
5. Criar modulo Foundry.
6. Criar sistema Foundry nativo, se necessario.

### Conhecimentos necessarios

- Modelo de dados de atores.
- Modelo de dados de itens.
- Packs/compendios.
- Hooks.
- Sheets.
- Templates.
- Migracoes de sistema.
- Permissoes.

## 36. APIs avancadas

### REST

REST e um padrao de comunicacao HTTP.

Conceitos:

- `GET`: buscar.
- `POST`: criar.
- `PUT/PATCH`: atualizar.
- `DELETE`: remover.
- Status code.
- JSON body.
- Autenticacao.

Atualmente a Biblioteca nao depende de REST para funcionar.

### WebSocket

WebSocket serve para sincronizacao em tempo real.

Foi relevante na fase antiga de VTT, mas a Biblioteca atual deve permanecer
local/offline como prioridade.

### Integracao futura

Qualquer API futura deve respeitar:

- Modo offline.
- Export/import local.
- Dados oficiais na Biblioteca.
- Privacidade dos dados do usuario.

## 37. ML avancado

### Conceitos

- Dataset: conjunto de exemplos.
- Feature: atributo usado pelo modelo.
- Label: resposta esperada.
- Treinamento: ajuste do modelo.
- Inferencia: uso do modelo treinado.
- Avaliacao: medir erro.
- Overfitting: decorar exemplos.
- Hallucination: gerar informacao falsa ou nao comprovada.

### Aplicacao prudente no Solaris

ML pode ser usado fora do app para:

- Extrair tabelas de DOCX/PDF.
- Comparar livro com catalogo.
- Sugerir tags.
- Sugerir descricoes.

Mas a saida deve virar:

- Arquivo estruturado.
- Revisao humana.
- Teste automatizado.
- Fonte documentada.

### Proibido depender de ML para

- Calculo de dano em tempo real.
- Compra/venda.
- Migracao de schema.
- Validacao de ficha.
- Regras oficiais.
- Dados de livro sem revisao.

## 38. Ciencia da computacao aplicada

### Estruturas de dados

Array:

- Listas de itens, personagens, monstros.

Objeto/mapa:

- Estado da ficha, indices por id, configuracoes.

Grafo:

- Relacoes de lore, faccoes, locais, NPCs.

Fila:

- Logs, eventos, notificacoes.

Pilha:

- Historico de desfazer/refazer, se for implementado.

### Algoritmos

Busca:

- Filtrar itens por texto.

Ordenacao:

- Ordenar por tier, preco, nome.

Reducao:

- Somar peso, slots, preco.

Parsing:

- Converter texto dos livros em dados.

Validacao:

- Verificar shape, campos obrigatorios e warnings.

### Complexidade

Ao filtrar 10 itens, qualquer abordagem serve.

Ao filtrar milhares de entradas oficiais, indices e cache passam a importar.

## 39. Arquitetura de qualidade

### Criterios de pronto

Uma mudanca esta pronta quando:

- Implementa o comportamento pedido.
- Nao quebra comportamento existente.
- Preserva dados antigos.
- Tem teste quando toca regra, schema, storage ou export.
- Passa `npm test`.
- Passa `node --check`.
- Passa `git diff --check`.
- Docs foram atualizados se a estrutura mudou.

### Criterios de rejeicao

Rejeite ou refaca se:

- Apaga `legacy` sem necessidade.
- Mistura regra nova diretamente em UI sem teste.
- Quebra offline.
- Exige IA para funcionar.
- Muda valores oficiais sem fonte.
- Cria formato persistente sem schema.

---

# Parte 4 - Procedimentos praticos sem IA

## 40. Como implementar uma nova regra

1. Localize a regra no livro oficial.
2. Escreva a regra em linguagem simples.
3. Identifique entradas e saidas.
4. Crie ou atualize funcao em `src/domain`.
5. Crie teste.
6. Rode teste.
7. Integre no `app.js`.
8. Rode `npm test`.
9. Atualize docs se a regra mudar estrutura.

Modelo:

```text
Regra: armadura com X rachaduras altera CA.
Entrada: armadura, rachaduras, CA base.
Saida: CA final.
Arquivo: src/domain/solaris-equipment-rules.js
Teste: tests/solaris-equipment-rules.test.mjs
```

## 41. Como adicionar campo na ficha

1. Verifique se e dado oficial, derivado ou legado.
2. Atualize `src/schemas/solaris-schemas.js`.
3. Atualize exportador.
4. Atualize importador se necessario.
5. Atualize storage/migracao se for persistente.
6. Atualize `src/ui/solaris-character-state.js`.
7. Atualize UI em `app.js`/`index.html`.
8. Crie teste.
9. Atualize docs.

## 42. Como mexer em inventario

1. Leia `src/domain/solaris-domain-architecture.js`.
2. Identifique entidade: arma, armadura, item, cubo, mochila, coldre,
   bandoleira, gancho, municao ou carregador.
3. Verifique local fisico.
4. Verifique peso.
5. Verifique equipado vs armazenado.
6. Verifique compatibilidade.
7. Crie teste de movimento.
8. Crie teste de peso/capacidade.
9. Integre UI.

## 43. Como mexer em storage

1. Leia `docs/SOLARIS_DATA_SCHEMA.md`.
2. Leia `src/storage/solaris-storage.js`.
3. Leia `src/storage/solaris-migrations.js`.
4. Leia `src/storage/solaris-backup.js`.
5. Crie caso legado.
6. Preserve desconhecidos em `legacy`.
7. Teste salvar/carregar/migrar.
8. Nao apague chaves antigas automaticamente.

## 44. Como mexer em exportacao

1. Defina schema destino.
2. Verifique campos obrigatorios.
3. Normalize dados.
4. Preserve original em `legacy` se aplicavel.
5. Gere warnings para ambiguidades.
6. Teste exportacao.
7. Teste importacao reversa quando existir.

## 45. Como mexer no PWA/offline

1. Identifique arquivos novos.
2. Adicione ao `sw.js` se precisam funcionar offline.
3. Atualize cache.
4. Atualize query `?v=` em imports/scripts.
5. Teste navegador limpo.
6. Teste sem internet quando possivel.

## 46. Como mexer no Electron

1. Rode `npm start`.
2. Verifique console.
3. Teste import/export local.
4. Rode `npm run dist`.
5. Instale/abra build se necessario.
6. Verifique se caminhos funcionam fora do repo.

## 47. Como publicar

1. `git status`
2. `git diff`
3. `npm test`
4. `node --check` nos arquivos alterados e principais.
5. `git diff --check`
6. Atualizar versao/cache se app mudou.
7. `git add`
8. `git commit -m "Mensagem"`
9. `git tag vX.Y.Z` se for release.
10. `git push origin main`
11. `git push origin vX.Y.Z`

## 48. Checklist de validacao completa

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/domain/solaris-character-creation.js
node --check src/domain/solaris-equipment-rules.js
node --check src/domain/solaris-bestiary-rules.js
node --check src/domain/solaris-combat-rules.js
node --check src/domain/solaris-gm-rules.js
node --check src/domain/solaris-lore-rules.js
node --check src/schemas/solaris-schemas.js
node --check src/export/solaris-export-core.js
node --check src/export/solaris-import-core.js
node --check src/export/solaris-foundry-export.js
node --check src/storage/solaris-storage.js
node --check src/storage/solaris-migrations.js
node --check src/storage/solaris-backup.js
node --check src/ui/solaris-character-state.js
node --check src/ui/solaris-character-ui.js
node --test tests/solaris-storage-integration.test.mjs
node --test tests/solaris-character-state.test.mjs
node --test tests/solaris-character-ui.test.mjs
git diff --check
```

---

# Parte 5 - Trilhas de estudo por area

## 49. Trilha de programacao

Basico:

- Variaveis.
- Tipos.
- Condicionais.
- Loops.
- Funcoes.
- Arrays.
- Objetos.

Intermediario:

- Modulos.
- Async/await.
- Imutabilidade.
- Tratamento de erro.
- Testes unitarios.
- Normalizacao de entrada.

Avancado:

- Arquitetura modular.
- Design de APIs internas.
- Performance.
- Refatoracao segura.
- Testes de regressao.
- Compatibilidade de dados.

## 50. Trilha de frontend

Basico:

- HTML.
- CSS.
- DOM.
- Eventos.
- Formularios.

Intermediario:

- Layout responsivo.
- Componentizacao manual.
- Acessibilidade.
- Estados visuais.
- Renderizacao segura.

Avancado:

- PWA.
- Service worker.
- Performance de renderizacao.
- Gerenciamento de estado.
- Offline-first.
- Empacotamento Electron.

## 51. Trilha de dados

Basico:

- JSON.
- Arrays e objetos.
- IDs.
- Tipos.
- Campos obrigatorios.

Intermediario:

- Schemas.
- Normalizacao.
- Migracao.
- Storage.
- Backup.
- Legacy.

Avancado:

- Versionamento de contratos.
- Compatibilidade retroativa.
- Governanca de catalogos.
- Auditoria de fonte.
- Export/import robusto.
- Preparacao para Foundry.

## 52. Trilha de ciencia da computacao

Basico:

- Variaveis.
- Memoria conceitual.
- Listas.
- Mapas.
- Funcoes.

Intermediario:

- Algoritmos de busca.
- Ordenacao.
- Complexidade basica.
- Recursao quando necessaria.
- Separacao de responsabilidades.

Avancado:

- Invariantes.
- Modelagem de estados.
- Grafos para lore.
- Sistemas event-driven.
- Consistencia eventual em sincronizacao futura.

## 53. Trilha de arquitetura

Basico:

- Separar tela, dados e regra.
- Entender camadas.
- Entender entrada/processamento/saida.

Intermediario:

- Dominio puro.
- Schemas.
- Adaptadores.
- Storage.
- Exportadores.

Avancado:

- Hexagonal architecture.
- Event sourcing quando fizer sentido.
- Versionamento de dominio.
- Migracoes sem perda.
- Integracoes externas desacopladas.

## 54. Trilha de ML

Basico:

- O que e modelo.
- O que e dataset.
- O que e inferencia.
- O que e erro.

Intermediario:

- Extracao de dados.
- Classificacao.
- Avaliacao.
- Revisao humana.

Avancado:

- Pipeline auditavel.
- Human-in-the-loop.
- Validacao contra fonte oficial.
- Deteccao de inconsistencias.
- Geracao assistida sem dependencia runtime.

## 55. Trilha de APIs e integracoes

Basico:

- O que e API.
- JSON.
- HTTP.
- Import/export.

Intermediario:

- REST.
- Autenticacao.
- Web APIs.
- Electron.
- GitHub Pages.

Avancado:

- Foundry API.
- Modulos Foundry.
- Sincronizacao.
- Packs/compendios.
- Migracoes externas.
- Contratos publicos.

---

# Parte 6 - Exercicios de autonomia

## 56. Exercicios basicos

1. Rode `npm test`.
2. Rode `node --check app.js`.
3. Encontre onde a versao do app e definida.
4. Encontre onde o cache do PWA e definido.
5. Encontre onde os atributos oficiais sao validados.
6. Exporte uma ficha e identifique `schema`, `resources` e `legacy`.
7. Leia `src/ui/solaris-character-state.js` e identifique onde `ESP` e
   preservado.

## 57. Exercicios intermediarios

1. Criar teste para um item com campo desconhecido preservado em `legacy`.
2. Criar uma funcao pura que calcula porcentagem de recurso.
3. Adicionar warning para um campo legado novo.
4. Adicionar uma entrada simples em docs e validar `git diff --check`.
5. Criar fixture de personagem legado com `ESP` e provar que `MEN` nao muda.

## 58. Exercicios avancados

1. Extrair uma regra ainda presente em `app.js` para `src/domain`.
2. Criar teste de regressao para essa regra.
3. Atualizar UI para usar a funcao extraida.
4. Criar migracao conservadora para campo novo.
5. Criar exportador draft para uma estrutura futura do Foundry.
6. Medir o impacto de renderizar biblioteca grande e propor otimizacao.

---

# Parte 7 - Tabelas de decisao

## 59. Onde colocar codigo novo

| Tipo de codigo | Onde colocar |
| --- | --- |
| Calculo de regra | `src/domain` |
| Contrato de dados | `src/schemas` |
| Conversao para JSON oficial | `src/export` |
| Leitura/gravacao local | `src/storage` |
| Estado/adaptador de UI | `src/ui` |
| Renderizacao e eventos atuais | `app.js` |
| Estrutura HTML | `index.html` |
| Visual | `styles.css` |
| Offline/PWA | `sw.js` |
| Desktop | `electron-main.cjs`, `electron-builder.ficha.cjs` |
| Documentacao | `docs` |
| Teste | `tests` |

## 60. Quando atualizar versao/cache

Atualize versao quando:

- A app muda comportamento.
- Schema muda.
- Storage muda.
- Export/import muda.
- Release sera publicada.

Atualize cache quando:

- `app.js` muda.
- `styles.css` muda.
- `index.html` muda.
- Modulo importado muda.
- Arquivo novo precisa funcionar offline.

## 61. Quando criar teste

Sempre criar teste quando:

- Regra de jogo muda.
- Storage muda.
- Schema muda.
- Import/export muda.
- Migracao muda.
- Bug foi corrigido.

Teste manual pode bastar quando:

- Texto de documentacao muda.
- Pequeno ajuste visual sem regra.

Mesmo assim, rode `git diff --check`.

## 62. Quando preservar em `legacy`

Preserve em `legacy` quando:

- Campo nao existe no schema oficial.
- Regra de migracao nao foi confirmada.
- Dado vem de versao antiga.
- Dado e desconhecido mas pode ser importante.
- Ha risco de perda de informacao.

## 63. Quando bloquear uma mudanca

Bloqueie ou adie quando:

- A regra oficial nao esta clara.
- O dado vem de fonte conflitante.
- A migracao pode apagar informacao.
- A mudanca quebra offline.
- A mudanca exige IA para funcionar.
- A validacao nao foi definida.

---

# Parte 8 - Glossario tecnico

API:

- Interface usada por outro codigo.

App shell:

- Conjunto minimo de arquivos para abrir o PWA offline.

Cache busting:

- Troca de versao `?v=` para forcar navegador a buscar arquivo novo.

Contrato:

- Formato que consumidores do dado esperam.

Dominio:

- Regras reais do sistema.

DTO:

- Objeto usado para transportar dados entre camadas.

Exportador:

- Codigo que transforma dado interno em formato externo.

Importador:

- Codigo que recebe dado externo e normaliza para o app.

Legacy:

- Area de preservacao de dados antigos/desconhecidos.

Migracao:

- Conversao segura entre versoes de dados.

Normalizacao:

- Transformar formatos variados em um formato padrao.

PWA:

- Aplicacao web instalavel/offline.

Schema:

- Definicao de formato de dados.

Service worker:

- Script do navegador que permite cache/offline.

Teste de regressao:

- Teste criado para garantir que um bug corrigido nao volte.

---

# Parte 9 - Leitura recomendada dentro do projeto

Ordem recomendada:

1. `README.md`
2. `README_CONTEXTO_CHATGPT.md`
3. `docs/ARQUITETURA_SOLARIS.md`
4. `docs/GLOSSARIO_SOLARIS.md`
5. `docs/SOLARIS_DATA_SCHEMA.md`
6. `docs/ROADMAP_SOLARIS.md`
7. `docs/CHECKLIST_PUBLICACAO.md`
8. `src/schemas/solaris-schemas.js`
9. `src/export/solaris-export-core.js`
10. `src/export/solaris-import-core.js`
11. `src/storage/solaris-storage.js`
12. `src/storage/solaris-migrations.js`
13. `src/storage/solaris-backup.js`
14. `src/ui/solaris-character-state.js`
15. `src/ui/solaris-character-ui.js`
16. `src/domain/solaris-domain-architecture.js`
17. `app.js`

## Leitura externa recomendada

JavaScript:

- MDN JavaScript Guide.
- MDN DOM.
- MDN Web Storage API.
- MDN Service Worker API.

Node:

- Node.js test runner.
- npm scripts.

Arquitetura:

- Clean Architecture.
- Hexagonal Architecture.
- Domain-driven design basico.

Dados:

- JSON Schema.
- Data migration patterns.
- Backward compatibility.

Frontend:

- Responsive design.
- Accessibility basics.
- Web performance basics.

Electron:

- Electron quick start.
- electron-builder docs.

Foundry:

- Foundry VTT system development.
- Foundry VTT documents and data model.
- Compendium packs.

ML:

- Supervised learning basics.
- Evaluation metrics.
- Human-in-the-loop data pipelines.

---

# Parte 10 - Plano de estudo sugerido

## Semana 1 - Fundamentos

- JavaScript basico.
- HTML/CSS basico.
- Git basico.
- Rodar projeto.
- Rodar testes.
- Ler READMEs.

Entrega:

- Conseguir abrir app, rodar teste e fazer commit simples.

## Semana 2 - Dados e schemas

- JSON.
- Schemas.
- Export/import.
- Legacy.
- Storage.

Entrega:

- Exportar uma ficha e explicar cada secao.

## Semana 3 - Dominio

- Regras puras.
- Testes.
- Inventario.
- Equipamentos.
- Combate.

Entrega:

- Criar ou alterar uma regra simples com teste.

## Semana 4 - UI e PWA

- DOM.
- Renderizacao.
- Eventos.
- Service worker.
- Cache.

Entrega:

- Alterar um painel pequeno sem quebrar mobile/offline.

## Semana 5 - Storage e migracao

- Storage oficial.
- Migracao.
- Backup.
- Compatibilidade.

Entrega:

- Criar teste de migracao de dado legado.

## Semana 6 - Exportacao e Foundry Draft

- Exportadores.
- Foundry draft.
- Contratos externos.
- Validacao.

Entrega:

- Enriquecer um campo do draft sem acoplar Biblioteca ao Foundry.

## Semana 7 - Qualidade avancada

- Regressao.
- Performance.
- Seguranca.
- Publicacao.

Entrega:

- Fazer release controlada com checklist completo.

---

# Parte 11 - Regras finais de autonomia

Para trabalhar sem IA, siga sempre este ciclo:

1. Entender a regra ou comportamento.
2. Localizar arquivos responsaveis.
3. Definir formato de dados.
4. Escrever teste ou criterio de validacao.
5. Implementar a menor alteracao correta.
6. Rodar validacao.
7. Revisar diff.
8. Documentar mudanca.
9. Commitar.
10. Publicar apenas depois de validar.

Se qualquer passo nao puder ser executado, a tarefa ainda nao esta pronta.

O projeto Solaris deve crescer por contratos claros, testes e dados auditaveis.
Esse e o caminho para manter a Biblioteca independente, confiavel e preparada
para futuras integracoes como Foundry VTT.
