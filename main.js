const { app, BrowserWindow, ipcMain } = require('electron');
const ioHook = require('@spacek33z/iohook');
const path = require('path');

let mainWindow;
let selectedInput = '';
let lastScrollDirection = null;
let scrollTimer = null;
let isLoggingActive = false; // Flag to control event logging

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 515,
        frame: false,
        resizable: false,
        icon: path.join(__dirname, 'public/icons/applogo.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false
        }
    });

    mainWindow.loadFile('index.html');
    
    // Handle audio file paths for renderer (for packaged app)
    ipcMain.handle('get-audio-path', (event, filename) => {
        return path.join(__dirname, filename);
    });

    ioHook.on('mousewheel', (event) => {
        if (isLoggingActive && selectedInput.startsWith('Scroll wheel')) {
            const currentDirection = event.rotation > 0 ? 'up' : 'down';
            if (lastScrollDirection !== currentDirection || !scrollTimer) {
                lastScrollDirection = currentDirection;

                if ((currentDirection === 'up' && selectedInput === 'Scroll wheel up') ||
                    (currentDirection === 'down' && selectedInput === 'Scroll wheel down')) {
                    mainWindow.webContents.send('io-event', { type: 'mousewheel', event });
                }

                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    lastScrollDirection = null;
                    scrollTimer = null;
                }, 400);
            }
        }
    });

    ioHook.on('keydown', (event) => {
        if (isLoggingActive && selectedInput === 'Spacebar' && event.keycode === 57) {
            mainWindow.webContents.send('io-event', { type: 'key', event });
        }
    });

    ioHook.start();
}

app.whenReady().then(createWindow);

ipcMain.on('set-input', (event, input) => {
    selectedInput = input;
    lastScrollDirection = null;
    clearTimeout(scrollTimer);
    scrollTimer = null;
});

ipcMain.on('start-logging', (event) => {
    isLoggingActive = true;
});

ipcMain.on('stop-logging', (event) => {
    isLoggingActive = false;
});

ipcMain.on('minimize-app', () => {
    mainWindow.minimize();
  });
  
  ipcMain.on('close-app', () => {
    app.quit(); // Or mainWindow.close() if you want to only close the window
  });

app.on('window-all-closed', () => {
    ioHook.unload();
    ioHook.stop();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
