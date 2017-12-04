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
const Analytics  = require('electron-google-analytics');
const analytics = new Analytics.default('UA-110587683-1');

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

let willQuitApp = false;

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    title: 'Hose',
    width: width * .5,
    height: height * .5,
    darkTheme: true,
    icon: __dirname + 'build/icon.ico',
    webPreferences: prefs
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/../build/index.html')}`);
 
  mainWindow.on('close', function (event) {
    if (willQuitApp) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  })
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
      app.quit()
  }
});

app.on('before-quit', () => willQuitApp = true);

app.on('activate', function () {
  mainWindow.show();
});