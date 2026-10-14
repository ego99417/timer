const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  setMode: (mode) => ipcRenderer.send('widget:set-mode', mode),
  minimize: () => ipcRenderer.send('widget:minimize'),
  close: () => ipcRenderer.send('widget:close'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('widget:set-always-on-top', flag),
  onModeChanged: (callback) => ipcRenderer.on('widget:mode-changed', (_event, mode) => callback(mode)),
});
