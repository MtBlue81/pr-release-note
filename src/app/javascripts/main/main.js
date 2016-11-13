import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/../app/html/main.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

