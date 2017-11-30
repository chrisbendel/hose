const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const {download} = require('electron-dl');
let mainWindow;
const DownloadManager = require("electron-download-manager");

DownloadManager.register();

function createWindow() {
  console.log(__dirname);
    mainWindow = new BrowserWindow({
      title: 'Hose',
      width: 1400, 
      height: 900,
      minWidth: 1400,
      minHeight: 900,
      darkTheme: true,
      icon: path.join(__dirname, 'icons/png/64x64.png'),
      webPreferences: {
        nodeIntegration: false,
        preload: __dirname + '/preload.js',
        webSecurity: false
      }
    });
    mainWindow.loadURL('http://localhost:3000');

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