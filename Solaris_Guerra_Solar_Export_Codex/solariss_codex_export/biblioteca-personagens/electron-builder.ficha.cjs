module.exports = {
  appId: "com.solaris.biblioteca",
  productName: "Solaris Biblioteca",
  directories: {
    output: "dist-ficha",
  },
  extraMetadata: {
    name: "solaris-biblioteca",
    main: "electron-main.cjs",
  },
  files: [
    "index.html",
    "manifest.webmanifest",
    "styles.css",
    "app.js",
    "sw.js",
    "HumanisVitalHUD.js",
    "official-books-data.js",
    "official-book5-catalog.js",
    "official-rulebook-compendium.js",
    "src/**/*",
    "electron-main.cjs",
    "README.md",
    "assets/**/*",
  ],
  win: {
    signAndEditExecutable: false,
    target: [
      { target: "nsis", arch: ["x64"] },
      { target: "portable", arch: ["x64"] },
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Solaris Biblioteca",
  },
};
