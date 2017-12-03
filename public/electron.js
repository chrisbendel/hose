const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
let mainWindow;
const DownloadManager = require("electron-download-manager");
const isElectron = require('is-electron');
const isDev = require('electron-is-dev');
const autoUpdater = require("electron-updater").autoUpdater

autoUpdater.checkForUpdatesAndNotify();

DownloadManager.register();
ipcMain.on('download', (event, urls, show) => {
  DownloadManager.bulkDownload({
    urls: urls,
    path: show
  }, function(error, finished, errors) {
    if (error){
      console.log("finished: " + finished);
      console.log("errors: " + errors);
      return;
    }
  });
});

if (isElectron()) {
  prefs = {
    webSecurity: false
  }
} else {
  prefs = {
    nodeIntegration: false,
    preload: __dirname + '/preload.js',
    webSecurity: false
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Hose',
    width: 1400, 
    height: 900,
    minWidth: 1400,
    minHeight: 900,
    darkTheme: true,
    icon: path.join(__dirname, 'icons/png/64x64.png'),
    webPreferences: prefs
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/../build/index.html')}`);
  
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
      mainWindow = null
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});