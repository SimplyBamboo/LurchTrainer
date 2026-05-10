const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: ipcRenderer
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'api', { // Use a unique name here to avoid conflicts
        send: (...args) => ipcRenderer.send(...args),
        on: (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);
