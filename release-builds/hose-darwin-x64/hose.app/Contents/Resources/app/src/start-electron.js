const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
let mainWindow;
const DownloadManager = require("electron-download-manager");

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

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Hose',
    width: 1400, 
    height: 900,
    minWidth: 1400,
    minHeight: 900,
    darkTheme: true,
    icon: path.join(__dirname, 'icons/png/64x64.png'),
    webPreferences: {
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