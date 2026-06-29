import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Electron VTT abre no launcher versionado", () => {
  const electronMain = read("electron-main-vtt.cjs");
  assert.match(electronMain, /view=launcher&tabletop=1&check=20260624h/);
  assert.match(electronMain, /Solaris Tabletop Alpha/);
});

test("rotas launcher e home entram no fluxo da mesa virtual", () => {
  const app = read("app.js");
  assert.match(app, /requested === "launcher"/);
  assert.match(app, /requested === "home"/);
  assert.match(app, /initialScreen = requestedView === "campaigns"/);
});

test("launcher possui acoes principais e modais essenciais", () => {
  const ui = read("src/session/solaris-session-ui.js");
  [
    "Continuar Campanha",
    "Criar Sala Offline",
    "Criar Sala Multijogador Local",
    "Entrar em Sala Local",
    "Minhas Campanhas",
    "Criador de Personagem",
    "Biblioteca / Ficha",
    "Bestiário",
    "Escudo do Mestre",
    "Configurações",
    "renderLauncherModal",
    "launchOfflineRoom",
    "launchMultiplayerRoom",
    "joinLocalAddress",
  ].forEach((fragment) => assert.ok(ui.includes(fragment), `fragmento ausente: ${fragment}`));
});

test("launcher usa cache novo e respeita reducao de movimento", () => {
  const styles = read("styles.css");
  const index = read("index.html");
  const sw = read("sw.js");
  assert.match(styles, /solaris-launcher/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /vtt-shell\.vtt-campaign-home\.solaris-shell/);
  assert.match(index, /20260624h/);
  assert.match(sw, /20260624h/);
});
