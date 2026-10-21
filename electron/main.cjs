const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let currentMode = 'normal'; // 'normal' | 'mini'
let normalBounds = { width: 395, height: 400 };

// FluffyWork Tray Icon (Supports both Windows and macOS Menu Bar)
function createTrayIcon() {
  const iconPath = path.join(__dirname, '../public/tray-icon.png');
  const img = nativeImage.createFromPath(iconPath);
  if (process.platform === 'darwin') {
    // macOS menu bar icon should be 18x18 or 22x22 and template enabled for dark/light mode
    const resized = img.resize({ width: 18, height: 18 });
    resized.setTemplateImage(true);
    return resized;
  }
  return img;
}

// macOS Application Menu (Required for Cmd+C, Cmd+V, Cmd+Q shortcuts on macOS)
function setupAppMenu() {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'FluffyWork',
        submenu: [
          { role: 'about', label: 'FluffyWork 정보' },
          { type: 'separator' },
          { role: 'hide', label: 'FluffyWork 가리기' },
          { role: 'hideOthers', label: '기타 가리기' },
          { role: 'unhide', label: '모두 보기' },
          { type: 'separator' },
          { role: 'quit', label: 'FluffyWork 종료' },
        ],
      },
      {
        label: '편집',
        submenu: [
          { role: 'undo', label: '실행 취소' },
          { role: 'redo', label: '다시 실행' },
          { type: 'separator' },
          { role: 'cut', label: '오려두기' },
          { role: 'copy', label: '복사' },
          { role: 'paste', label: '붙여넣기' },
          { role: 'selectAll', label: '전체 선택' },
        ],
      },
      {
        label: '보기',
        submenu: [
          {
            label: '미니 모드 전환',
            accelerator: 'CmdOrCtrl+M',
            click: () => {
              const nextMode = currentMode === 'normal' ? 'mini' : 'normal';
              setWidgetMode(nextMode);
              if (mainWindow) mainWindow.webContents.send('widget:mode-changed', nextMode);
            },
          },
          { role: 'reload', label: '새로고침' },
        ],
      },
      {
        label: '창',
        submenu: [
          { role: 'minimize', label: '최소화' },
          { role: 'close', label: '창 닫기' },
        ],
      },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
}

function setWindowAlwaysOnTop(flag) {
  if (!mainWindow) return;
  if (process.platform === 'darwin') {
    mainWindow.setAlwaysOnTop(flag, 'floating');
    mainWindow.setVisibleOnAllWorkspaces(flag, { visibleOnFullScreen: true });
  } else {
    mainWindow.setAlwaysOnTop(flag);
  }
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
    resizable: false, // Fixed widget size
    alwaysOnTop: true, // Always on Top by default
    hasShadow: false, // Windows/macOS transparent corners use CSS shadow
    backgroundColor: '#00000000',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false, // Accurate timer in background
    },
  });

  // macOS: Ensure always on top floats across spaces/virtual desktops
  if (process.platform === 'darwin') {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  normalBounds = mainWindow.getBounds();

  // Load Dev Server or Production Build
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devServerUrl).catch(() => {
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
          if (!mainWindow) {
            createWindow();
          } else {
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
          if (mainWindow) mainWindow.webContents.send('widget:mode-changed', nextMode);
        },
      },
      {
        label: '항상 위에 고정',
        type: 'checkbox',
        checked: true,
        click: (menuItem) => {
          setWindowAlwaysOnTop(menuItem.checked);
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
      if (!mainWindow) {
        createWindow();
      } else if (mainWindow.isVisible()) {
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
      x: Math.round(miniX),
      y: Math.round(miniY),
      width: miniWidth,
      height: miniHeight,
    });
  } else {
    // Restore normal widget mode
    const normW = 395;
    const normH = 400;

    const curBounds = mainWindow.getBounds();
    const rawTargetX = (normalBounds && typeof normalBounds.x === 'number' && !isNaN(normalBounds.x))
      ? normalBounds.x
      : Math.round(workX + workWidth - normW - 20);
    const rawTargetY = (normalBounds && typeof normalBounds.y === 'number' && !isNaN(normalBounds.y))
      ? normalBounds.y
      : Math.round((workHeight - normH) / 2);

    const restoredX = Math.max(workX + 10, Math.min(rawTargetX, workX + workWidth - normW - 10));
    const restoredY = Math.max(workY + 10, Math.min(rawTargetY, workY + workHeight - normH - 10));

    mainWindow.setBounds({
      x: Math.round(restoredX),
      y: Math.round(restoredY),
      width: normW,
      height: normH,
    });
  }

  // Notify renderer of mode change
  mainWindow.webContents.send('widget:mode-changed', mode);
}

// IPC Handlers
ipcMain.on('widget:set-mode', (_event, mode) => {
  setWidgetMode(mode);
});

ipcMain.on('widget:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('widget:close', () => {
  if (process.platform === 'darwin') {
    // On macOS, closing window hides it or destroys it
    if (mainWindow) mainWindow.hide();
  } else {
    if (mainWindow) mainWindow.close();
  }
});

ipcMain.on('widget:set-always-on-top', (_event, flag) => {
  setWindowAlwaysOnTop(flag);
});

// App Lifecycle
app.whenReady().then(() => {
  setupAppMenu();
  createWindow();

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
