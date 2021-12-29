'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from "fs";
import path from "path";
import {format} from "date-fns";

const isDevelopment = process.env.NODE_ENV !== 'production'
const cmdArgs = process.argv.slice(2);
const rootPath = isDevelopment ? '' : path.dirname(process.execPath);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// The League client uses self signed SSL certificates, so we have to disable some security checks.
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

async function createWindow() {

  if(cmdArgs.includes('--headless')) {
    return;
  }

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      webSecurity: false // Disable CORS
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

let settings = {
  leagueLocation: 'C:\\Riot Games\\League of Legends',
  maxBackups: 5,
}

function readSettings() {
  if (fs.existsSync(path.join(rootPath, "settings.json"))) {
    Object.assign(
        settings,
        JSON.parse(
            fs.readFileSync(path.join(rootPath, "settings.json"), {encoding: "utf-8", flag: "r"})
        ) || {}
    )
  }
}

readSettings();

ipcMain.on('close', () => {
  BrowserWindow.getFocusedWindow().close();
})

ipcMain.on('maximize', () => {
  let browserWindow = BrowserWindow.getFocusedWindow();
  if(!browserWindow.isMaximized()) {
    browserWindow.maximize();
  } else {
    browserWindow.unmaximize();
  }
})

ipcMain.on('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize();
})

ipcMain.handle('create-backup', () => {
  return createBackup();
})

ipcMain.on('save-settings', () => {
  readSettings();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin' && !cmdArgs.includes("--headless")) {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

if (!fs.existsSync( "backups")){
  fs.mkdirSync("backups");
}

if(cmdArgs.includes("--create-backup")) {
  createBackup();
  app.quit();
}

function createBackup() {
  let date = format(new Date(), "yyyy-MM-dd HH-mm-ss")

  if(fs.existsSync(path.join(rootPath, "backups", date))) {
    return;
  }

  try {
    fs.mkdirSync(path.join(rootPath, "backups", date), {recursive: true});

    fs.copyFileSync(
        path.join(settings.leagueLocation, "Config", "LCUAccountPreferences.yaml"),
        path.join(rootPath, "backups", date, "LCUAccountPreferences.yaml")
    )
    fs.copyFileSync(
        path.join(settings.leagueLocation, "Config", "LCULocalPreferences.yaml"),
        path.join(rootPath, "backups", date, "LCULocalPreferences.yaml")
    )

    let backups = fs.readdirSync(path.join(rootPath, "backups")).sort().reverse();
    if(settings.maxBackups > 0 && backups.length > settings.maxBackups) {
      fs.rmdirSync(path.join(rootPath, "backups", backups[settings.maxBackups]), {recursive: true})
    }

    return date
  } catch (e) {
    fs.rmdirSync(path.join(rootPath, "backups", date), {recursive: true})
    throw e;
  }
}