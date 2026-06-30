const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

app.setAppUserModelId("com.solaris.tabletop");

const TABLETOP_QUERY = "view=launcher&tabletop=1&check=20260629a";

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
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    title: "Solaris Tabletop Alpha",
    backgroundColor: "#07111f",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (await startEmbeddedTabletopServer()) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT || 3000}/?${TABLETOP_QUERY}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"), {
      query: { view: "launcher", tabletop: "1", check: "20260629a" },
    });
  }

  mainWindow.webContents.on("page-title-updated", (event) => {
    event.preventDefault();
    mainWindow.setTitle("Solaris Tabletop Alpha");
  });

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
