const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const {download} = require('electron-dl');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
      title: 'Hose',
      width: 1400, 
      height: 900,
      minWidth: 1400,
      minHeight: 900,
      darkTheme: true,
      webPreferences: {
        nodeIntegration: false,
        preload: __dirname + '/preload.js'
      }
    });
    mainWindow.loadURL('http://localhost:3000');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

ipcMain.on('download', (url, options) => {
  console.log(options);
	download(BrowserWindow.getFocusedWindow(), url, options)
		.then(dl => console.log(dl.getSavePath()))
		.catch(console.error);
});

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