const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

app.setAppUserModelId("com.solaris.biblioteca");

const TABLETOP_QUERY = "view=mesaVirtual&tabletop=1&check=20260620d";

function isTabletopBuild() {
  const name = String(app.getName?.() || "").toLowerCase();
  return process.env.SOLARIS_TABLETOP === "1"
    || process.argv.includes("--tabletop")
    || name.includes("tabletop")
    || name.includes("mesa");
}

async function startEmbeddedTabletopServer() {
  try {
    process.env.PORT = process.env.PORT || "3000";
    await import(pathToFileURL(path.join(__dirname, "server", "solaris-server.js")).href);
    return true;
  } catch (error) {
    console.warn("Nao foi possivel iniciar o servidor tabletop embutido:", error?.message || error);
    return false;
  }
}

async function createWindow() {
  const tabletop = isTabletopBuild();
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    title: tabletop ? "Solaris Tabletop Alpha" : "Solaris - Biblioteca de Personagens",
    backgroundColor: "#111417",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (tabletop && await startEmbeddedTabletopServer()) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT || 3000}/?${TABLETOP_QUERY}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"), {
      query: tabletop ? { view: "mesaVirtual", tabletop: "1", check: "20260620d" } : {},
    });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
