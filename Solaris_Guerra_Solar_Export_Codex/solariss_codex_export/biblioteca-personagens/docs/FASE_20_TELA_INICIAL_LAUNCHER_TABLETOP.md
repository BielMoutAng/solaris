# Solaris Guerra Solar - Fase 20: Tela Inicial e Launcher do Tabletop

Status: implementado localmente no cache `20260624a`.

## Objetivo

Criar uma entrada real para o Solaris Tabletop Alpha no PC/Windows, com aparencia de launcher de jogo e acesso claro aos fluxos principais, sem quebrar a Biblioteca, o modo offline, a mesa local, o servidor VTT, campanhas, autosaves, snapshots e importacao/exportacao.

## Rota escolhida

Foi criada a rota:

```txt
?view=launcher
```

Tambem foi aceito o alias:

```txt
?view=home
```

Rotas preservadas:

```txt
?view=campaigns
?view=mesaVirtual
?view=ficha
```

O Electron do Solaris Tabletop Alpha agora abre em:

```txt
?view=launcher&tabletop=1&check=20260624a
```

## Tela criada

A tela inicial usa CSS puro para criar:

- fundo dark sci-fi em 16:9;
- planeta/mundo Solaris/Tarantus estilizado;
- estrelas e pulso cosmico leve;
- grid holografico;
- logo grande SOLARIS;
- subtitulo GUERRA SOLAR;
- painel de menu principal;
- painel de campanha recente;
- painel de status do Tabletop.

Nao foram adicionadas dependencias novas, videos ou assets pesados. O visual usa fallback em CSS caso qualquer imagem futura nao exista.

## Menu principal

O launcher exibe:

1. Continuar Campanha
2. Criar Sala Offline
3. Criar Sala Multijogador Local
4. Entrar em Sala Local
5. Minhas Campanhas
6. Criador de Personagem
7. Biblioteca / Ficha
8. Bestiario
9. Escudo do Mestre
10. Configuracoes

## Modais

Foram criados modais para:

- Criar Sala Offline: abre a mesa em modo local/simulado.
- Criar Sala Multijogador Local: orienta a rodar `npm run server:vtt` e mostra os enderecos de acesso.
- Entrar em Sala Local: permite digitar o endereco/IP do mestre.
- Configuracoes: permite reduzir movimento/efeitos do launcher e limpar a preferencia visual.

## Comportamento offline

O botao `Criar Sala Offline` usa a estrutura offline ja existente. Sem servidor, o app continua funcionando como mesa local e ficha local.

## Comportamento multijogador local

O botao `Criar Sala Multijogador Local` abre o fluxo de mesa ja existente. Quando `npm run server:vtt` esta ativo, a mesa usa WebSocket e sincronizacao. Quando nao ha servidor, o app preserva o modo simulado sem quebrar.

Para jogadores entrarem na rede local:

```txt
http://IP-DO-MESTRE:3000
```

## Responsividade

O launcher foi desenhado desktop-first para Windows, mas empilha o menu e os paineis em telas menores. A animacao respeita `prefers-reduced-motion` e tambem pode ser desligada pela configuracao rapida do launcher.

## Ajuste de campanhas

A tela `?view=campaigns` foi preservada. Tambem recebeu uma protecao de layout para nao ser deformada pelas regras desktop da mesa em resolucoes menores.

## Cache e versao

- Cache: `20260624a`
- Solaris Tabletop Alpha: `0.6.0-alpha.15`

## Arquivos alterados

- `src/session/solaris-session-ui.js`
- `styles.css`
- `app.js`
- `electron-main-vtt.cjs`
- `index.html`
- `sw.js`
- `package.json`
- `package-lock.json`
- `README.md`
- `README_CONTEXTO_CHATGPT.md`

## Testes recomendados

```bash
npm test
node --check app.js
node --check sw.js
node --check src/domain/solaris-domain-architecture.js
node --check src/session/solaris-session-domain.js
node --check src/session/solaris-session-client.js
node --check src/session/solaris-session-ui.js
node --check src/session/solaris-session-persistence.js
node --check server/solaris-server.js
node --check electron-main-vtt.cjs
node --check electron-main.cjs
```

## Teste manual

1. Rode `npm run start:vtt`.
2. Confirme que o Electron abre no launcher.
3. Clique em `Criar Sala Offline` e confirme que a mesa abre em modo local.
4. Volte ao launcher e teste o modal de multijogador local.
5. Rode `npm run server:vtt`.
6. Abra `http://localhost:3000/?view=launcher&check=20260624a`.
7. Teste `Entrar em Sala Local`, `Minhas Campanhas`, `Biblioteca / Ficha`, `Criador de Personagem`, `Bestiario` e `Escudo do Mestre`.
8. Teste tambem `?view=campaigns`, `?view=mesaVirtual` e `?view=ficha`.

## Limitacoes atuais

- O planeta do fundo ainda e CSS, nao uma imagem final exportada do Canva.
- Nao ha descoberta automatica do IP local do mestre.
- As configuracoes rapidas do launcher cobrem efeitos visuais; configuracoes completas do Tabletop ainda podem virar uma tela propria.

## Proxima etapa recomendada

Transformar o launcher em hub completo de campanha: cards de campanhas recentes, favoritos, restauracao de autosave com preview e botao para abrir a pasta/exportar pacote de sessao.
