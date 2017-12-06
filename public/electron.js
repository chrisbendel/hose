const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain, dialog, shell} = require('electron');
const platform = require('electron-platform');
let mainWindow; 
const isElectron = require('is-electron');
const isDev = require('electron-is-dev');
const autoUpdater = require("electron-updater").autoUpdater;
let willQuitApp = false;

autoUpdater.checkForUpdatesAndNotify();

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

if ( platform.isWin32 ) {
  autoUpdater.addListener("update-downloaded", (info) => {
    dialog.showMessageBox({
      type:      'info',
      title:     'hose update ready',
      message:   'Version ' +  info.version + ' of ' + app.getName() + ' is ready to install!',
      buttons:   ['Install update', 'Not now'],
      defaultId: 0,
      cancelId:  1,
    }, (buttonIndex) => {  
      if (buttonIndex === 0) {
        shell.openExternal('https://s3.amazonaws.com/hose/hose+Setup+' + info.version + '.exe')
      }
    });
  });
}

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

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', () => { 
  createWindow();
});

app.on('window-all-closed', function () {
  app.quit()
});

app.on('before-quit', () => willQuitApp = true);

app.on('activate', function () {
  mainWindow.show();
});