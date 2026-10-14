const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let currentMode = 'normal'; // 'normal' | 'mini'
let normalBounds = { width: 395, height: 400 };

// FluffyWork Peach 'f' Logo for Tray
function createTrayIcon() {
  const iconPath = path.join(__dirname, '../public/tray-icon.png');
  return nativeImage.createFromPath(iconPath);
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Initial position: center-right of screen
  const initialX = Math.round(screenWidth - 415);
  const initialY = Math.round((screenHeight - 420) / 2);

  mainWindow = new BrowserWindow({
    width: 395,
    height: 400,
    x: initialX,
    y: Math.max(20, initialY),
    frame: false, // Frameless desktop widget
    transparent: true, // Transparent glassmorphism
    resizable: false, // Fix to requested 395x400 widget size
    alwaysOnTop: true, // Always on Top by default
    hasShadow: false, // Windows transparent rounded corners should use CSS box-shadow
    backgroundColor: '#00000000',
    icon: path.join(__dirname, '../public/icon.png'), // FluffyWork App Icon for Windows Taskbar
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false, // Keep timer running accurately in background
    },
  });

  normalBounds = mainWindow.getBounds();

  // Load Dev Server or Production Build
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devServerUrl).catch(() => {
      // Retry in 1s if dev server is warming up
      setTimeout(() => mainWindow.loadURL(devServerUrl), 1000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Setup System Tray
  try {
    const icon = createTrayIcon();
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'FluffyWork 열기',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: '미니 모드 전환',
        click: () => {
          const nextMode = currentMode === 'normal' ? 'mini' : 'normal';
          setWidgetMode(nextMode);
          mainWindow.webContents.send('widget:mode-changed', nextMode);
        },
      },
      {
        label: '항상 위에 고정',
        type: 'checkbox',
        checked: true,
        click: (menuItem) => {
          if (mainWindow) {
            mainWindow.setAlwaysOnTop(menuItem.checked);
          }
        },
      },
      { type: 'separator' },
      {
        label: '종료',
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip('FluffyWork - 유연근무 힐링 타이머 위젯');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    });
  } catch (err) {
    console.error('Tray initialization notice:', err.message);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Switch between Normal Widget Mode and Mini Floating Bar Mode
function setWidgetMode(mode) {
  if (!mainWindow) return;
  currentMode = mode;

  const currentDisplay = screen.getDisplayMatching(mainWindow.getBounds());
  const { width: workWidth, height: workHeight, x: workX, y: workY } = currentDisplay.workArea;

  if (mode === 'mini') {
    normalBounds = mainWindow.getBounds();
    const miniWidth = 290;
    const miniHeight = 64;
    // Snap to bottom-right of current screen
    const miniX = workX + workWidth - miniWidth - 20;
    const miniY = workY + workHeight - miniHeight - 20;

    mainWindow.setBounds({
      x: miniX,
      y: miniY,
      width: miniWidth,
      height: miniHeight,
    });
  } else {
    // Restore normal widget mode
    const normW = 395;
    const normH = 400;
    const restoredX = Math.max(workX + 20, Math.min(normalBounds.x, workX + workWidth - normW - 20));
    const restoredY = Math.max(workY + 20, Math.min(normalBounds.y, workY + workHeight - normH - 20));

    mainWindow.setBounds({
      x: restoredX,
      y: restoredY,
      width: normW,
      height: normH,
    });
  }
}

// IPC Handlers
ipcMain.on('widget:set-mode', (_event, mode) => {
  setWidgetMode(mode);
});

ipcMain.on('widget:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('widget:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('widget:set-always-on-top', (_event, flag) => {
  if (mainWindow) mainWindow.setAlwaysOnTop(flag);
});

// App Lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
