const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let tray = null;
let window = null;
let iconStyle = 'time'; // time, numeric-date, month-day

function createWindow() {
  window = new BrowserWindow({
    width: 560,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.loadFile('index.html');

  // Ocultar la ventana cuando pierde el foco
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
}

function createTray() {
  // En macOS, podemos usar texto en el tray (más visible)
  // Crear un ícono vacío pero usar setTitle para mostrar un emoji/texto
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle('🕐'); // Emoji de reloj
  tray.setToolTip('Reloj y Calendario - Haz clic para abrir');

  tray.on('click', () => {
    toggleWindow();
  });

  // Actualizar el emoji del reloj cada minuto
  updateTrayTime();
  setInterval(updateTrayTime, 60000); // Cada minuto
}

function updateTrayTime() {
  const now = new Date();
  let displayText = '';

  if (iconStyle === 'time') {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    displayText = `${hours}:${minutes}`;
  }
  else if (iconStyle === 'numeric-date') {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    displayText = `${day}/${month}`;
  }
  else if (iconStyle === 'month-day') {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const day = now.getDate();
    const month = months[now.getMonth()];
    displayText = `${month} ${day}`;
  }

  tray.setTitle(displayText);
}

function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

function showWindow() {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
}

function getWindowPosition() {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Calcular la posición para que aparezca debajo del ícono en la barra
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
}

// Recibir actualizaciones de configuración desde el renderer
ipcMain.on('update-tray-icon', (event, newIconStyle) => {
  iconStyle = newIconStyle;
  updateTrayTime();
});

// Cambiar el tamaño de la ventana según el layout
ipcMain.on('change-layout', (event, layout) => {
  if (layout === 'horizontal') {
    window.setSize(560, 450);
  } else if (layout === 'vertical') {
    window.setSize(320, 500);
  }
});

// Abrir el calendario del sistema
ipcMain.on('open-calendar', () => {
  const { shell } = require('electron');
  shell.openPath('/System/Applications/Calendar.app');
});

app.whenReady().then(() => {
  createTray();
  createWindow();

  // Registrar atajo de teclado global: Cmd+Shift+C
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    toggleWindow();
  });
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// No cerrar la app cuando se cierran todas las ventanas (comportamiento de barra de menú)
app.dock.hide(); // Ocultar del dock en macOS
