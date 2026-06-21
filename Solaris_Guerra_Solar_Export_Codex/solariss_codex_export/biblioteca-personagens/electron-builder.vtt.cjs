module.exports = {
  appId: "com.solaris.tabletop",
  productName: "Solaris Tabletop Alpha",
  directories: {
    output: "dist-vtt",
  },
  extraMetadata: {
    name: "solaris-tabletop",
    main: "electron-main-vtt.cjs",
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
    "server/**/*",
    "electron-main-vtt.cjs",
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
    shortcutName: "Solaris Tabletop Alpha",
  },
};
