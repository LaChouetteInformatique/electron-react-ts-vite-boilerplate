import { app, BrowserWindow } from "electron"
import { ipcMainHandle } from "./util.js"
import { isDev } from "./isDev.js"
import { getPreloadPath, getUIPath } from "./pathResolver.js"
import path from "path"

let mainWindow: BrowserWindow | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath()
    }
  })

  if (isDev()) {
    mainWindow.loadURL("http://localhost:3524")
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(getUIPath())
  }
}

app.on("ready", () => {
  createMainWindow()

  // Exemple de handler IPC que vous pouvez garder
  ipcMainHandle("ping", async () => {
    console.log("Received ping from renderer")
    return "pong"
  })

  // Le handler pour les notifications est utile, gardez-le !
  // (Le code du handler lui-même n'est pas ici, c'est l'appel depuis le frontend qui le déclenche)
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
