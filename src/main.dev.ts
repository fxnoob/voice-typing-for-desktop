/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { createServer } from 'http';
import { Server } from 'socket.io';
import MenuBuilder from './menu';
import dbService, {schema} from './services/dbService';
import cryptService from './services/cryptService';
import domService from './services/domService';
import commandService from './services/commandsService';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const initSocketServer = () => {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    // ...
  });

  io.on('connection', (socket) => {
    socket.on('toggle_sr', (value: boolean) => {
      console.log("toggle_sr", value);
      socket.broadcast.emit('toggle_sr',{value});
    });
    socket.on('callback_sr', async (value: any) => {
      const {langId, text } = value;
      console.log(value);
      // const { langId, text:encrypted } = value;
      // const text = cryptService.decrypt(encrypted, keys.private);
      const commands = await commandService.getCommands(langId);
      const commandIndex = commands.findIndex(
        p =>
          p.match == "startsWith" && text.startsWith(p.name) ||
          p.match == "exact" && text == p.name.toLowerCase()
      );
      if (commandIndex != -1) {
        const commandToApply = commands[commandIndex];
        commandToApply.exec(text, { dom: domService }, () => {});
      } else {
        const indentedText = text != "." ? ` ${text}` : text;
        domService.simulateWordTyping(indentedText);
      }
    });
    socket.on('change_language_sr', async (value: any) => {
      socket.broadcast.emit('change_language_sr',{value});
    });
    socket.on('check_connection_sr', async (value: any) => {
      socket.broadcast.emit('check_connection_sr',{value});
    })
  });
  httpServer.listen(3000);
  console.log("started listening at 3000");
};

const initDB = async () => {
  initSocketServer();
  if (!(await dbService.has('initiated1'))) {
    await dbService.set('initiated1', {
      init: true
    });
    const keys = cryptService.generate();
    schema.data.publicKey = keys.publicKey;
    schema.data.privateKey = keys.privateKey;
    await dbService.set('data', schema.data);
  } else {
    console.log('initiated already');
  }
};

const createWindow = async () => {
  await initDB();
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
