# Solaris Guerra Solar - Fase 8: Separacao entre ficha online e VTT

Status: primeira versao implementada apos `20260620f`.

## Objetivo

Separar a identidade de execucao da ficha online/biblioteca e da Mesa Virtual/Tabletop, evitando que o instalador do VTT substitua ou confunda o projeto da ficha.

## Estrutura atual

O codigo ainda compartilha os mesmos modulos de dominio, dados oficiais e estilos, mas agora existem entradas separadas:

- `electron-main.cjs`: abre a Biblioteca/Ficha local.
- `electron-main-vtt.cjs`: abre a Mesa Virtual/Tabletop e tenta iniciar o servidor local embutido.

Tambem existem configuracoes de build separadas:

- `electron-builder.ficha.cjs`: gera o app `Solaris Biblioteca`.
- `electron-builder.vtt.cjs`: gera o app `Solaris Tabletop Alpha`.

## Comandos

Ficha / biblioteca:

```bash
npm run start:ficha
npm run dist:ficha
```

Mesa Virtual / Tabletop:

```bash
npm run start:vtt
npm run server:vtt
npm run dist:vtt
```

Aliases preservados:

```bash
npm start
npm run server
npm run dist
```

`npm start` e `npm run dist` apontam para a ficha/biblioteca. `npm run server` continua apontando para o servidor da mesa por compatibilidade com as validacoes anteriores.

## Saidas de build

- `dist-ficha/`: instaladores da ficha/biblioteca.
- `dist-vtt/`: instaladores da Mesa Virtual/Tabletop.

Essas pastas sao ignoradas pelo Git.

## Resultado pratico

- A ficha online/PWA continua abrindo como ficha local pelo `index.html` e GitHub Pages.
- O executavel VTT abre direto em `?view=mesaVirtual&tabletop=1`.
- A build do VTT inclui `server/**/*`.
- A build da ficha nao inclui `server/**/*`.

## Proxima etapa recomendada

- Separar tambem o deploy web em duas rotas/publicacoes:
  - `/solaris/` para ficha online;
  - `/solaris-tabletop/` ou outro repositorio para a Mesa Virtual.
- Extrair modulos compartilhados para uma pasta `src/shared` quando a duplicacao de responsabilidades crescer.
