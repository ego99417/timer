/**
 * @file electron/preload.cjs
 * @description Electron 보안 IPC 브리지(Preload 스크립트)
 * 
 * [주요 역할]
 * - React 웹 렌더러와 Node.js 메인 프로세스(main.cjs) 사이의 안전한 통신 인터페이스 제공
 * - `window.electronAPI` 객체를 브라우저 전역에 노출하여 모드 변경, 창 닫기, 최소화 기능 연동
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform, // 'darwin' (macOS) | 'win32' (Windows)
  setMode: (mode) => ipcRenderer.send('widget:set-mode', mode),
  minimize: () => ipcRenderer.send('widget:minimize'),
  close: () => ipcRenderer.send('widget:close'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('widget:set-always-on-top', flag),
  onModeChanged: (callback) => ipcRenderer.on('widget:mode-changed', (_event, mode) => callback(mode)),
});
