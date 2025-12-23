// IPC para comunicación con el proceso principal
const { ipcRenderer } = require('electron');

// Configuración de relojes (se pueden agregar más)
const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localLabel = localTimezone.split('/').pop().replace(/_/g, ' '); // Extraer nombre de ciudad

// Cargar relojes desde localStorage o usar valores por defecto
function loadClocks() {
  const saved = localStorage.getItem('clocks');
  if (saved) {
    return JSON.parse(saved);
  }
  // Relojes por defecto
  return [
    { id: 'clock1', label: localLabel, timezone: localTimezone },
    { id: 'clock2', label: 'New York', timezone: 'America/New_York' },
    { id: 'clock3', label: 'London', timezone: 'Europe/London' }
  ];
}

// Guardar relojes en localStorage
function saveClocks() {
  localStorage.setItem('clocks', JSON.stringify(clocks));
}

let clocks = loadClocks();

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Variables para drag and drop
let draggedElement = null;
let draggedIndex = null;

// Renderizar todos los relojes
function renderClocks() {
  const container = document.getElementById('clocksContainer');
  container.innerHTML = '';

  clocks.forEach((clock, index) => {
    const clockItem = document.createElement('div');
    clockItem.className = 'clock-item';
    clockItem.id = clock.id;
    clockItem.draggable = true;

    clockItem.innerHTML = `
      <button class="delete-btn" data-clock-id="${clock.id}">×</button>
      <div class="clock-label">${clock.label}</div>
      <div class="clock-time">--:--:--</div>
      <div class="clock-date">----</div>
    `;

    container.appendChild(clockItem);

    // Agregar event listener para el botón de eliminar
    const deleteBtn = clockItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteClock(clock.id);
    });

    // Click to copy time to clipboard
    clockItem.addEventListener('click', () => {
      const timeElement = clockItem.querySelector('.clock-time');
      const time = timeElement.textContent;
      navigator.clipboard.writeText(time).then(() => {
        // Visual feedback
        timeElement.style.color = '#007aff';
        setTimeout(() => {
          timeElement.style.color = '';
        }, 300);
      });
    });
  });

  // Reconfigurar drag and drop
  setupDragAndDrop();

  // Actualizar los relojes
  updateClocks();
}

// Eliminar un reloj
function deleteClock(clockId) {
  clocks = clocks.filter(c => c.id !== clockId);
  saveClocks();
  renderClocks();
}

// Actualizar todos los relojes
function updateClocks() {
  const now = new Date();

  // Obtener offset del timezone local en minutos
  const localOffset = -now.getTimezoneOffset();

  clocks.forEach(clock => {
    const element = document.getElementById(clock.id);
    if (!element) return;

    // Formatear hora
    const timeFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: clock.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // Formatear fecha
    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: clock.timezone,
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    // Calcular diferencia horaria
    const clockDate = new Date(now.toLocaleString('en-US', { timeZone: clock.timezone }));
    const localDate = new Date(now.toLocaleString('en-US', { timeZone: localTimezone }));
    const diffMs = clockDate - localDate;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    let diffText = '';
    if (diffHours > 0) {
      diffText = `+${diffHours}h`;
    } else if (diffHours < 0) {
      diffText = `${diffHours}h`;
    } else {
      diffText = '';
    }

    const labelElement = element.querySelector('.clock-label');

    // Reconstruir el contenido del label con la diferencia horaria
    if (diffText) {
      labelElement.innerHTML = `${clock.label} <span class="time-diff">${diffText}</span>`;
    } else {
      labelElement.innerHTML = clock.label;
    }

    element.querySelector('.clock-time').textContent = timeFormatter.format(now);
    element.querySelector('.clock-date').textContent = dateFormatter.format(now);
  });
}

// Renderizar calendario
function renderCalendar(month, year) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDate = lastDay.getDate();
  const prevLastDate = prevLastDay.getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

  const calendarGrid = document.querySelector('.calendar-grid');

  // Limpiar días anteriores (mantener los headers)
  const dayCells = calendarGrid.querySelectorAll('.day-cell');
  dayCells.forEach(cell => cell.remove());

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const todayDate = today.getDate();

  // Días del mes anterior
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell other-month';
    dayCell.textContent = prevLastDate - i;

    // Agregar click para abrir calendario del sistema
    dayCell.addEventListener('click', () => {
      ipcRenderer.send('open-calendar');
    });

    calendarGrid.appendChild(dayCell);
  }

  // Días del mes actual
  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.textContent = day;

    if (isCurrentMonth && day === todayDate) {
      dayCell.classList.add('today');
    }

    // Agregar click para abrir calendario del sistema
    dayCell.addEventListener('click', () => {
      ipcRenderer.send('open-calendar');
    });

    calendarGrid.appendChild(dayCell);
  }

  // Días del mes siguiente
  const totalCells = calendarGrid.children.length - 7; // Restar los headers
  const remainingCells = 42 - totalCells; // 6 semanas * 7 días

  for (let day = 1; day <= remainingCells; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell other-month';
    dayCell.textContent = day;

    // Agregar click para abrir calendario del sistema
    dayCell.addEventListener('click', () => {
      ipcRenderer.send('open-calendar');
    });

    calendarGrid.appendChild(dayCell);
  }
}

// Navegación del calendario
document.getElementById('prevMonth').addEventListener('click', (e) => {
  e.stopPropagation(); // Evitar que abra el calendario del sistema
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

document.getElementById('nextMonth').addEventListener('click', (e) => {
  e.stopPropagation(); // Evitar que abra el calendario del sistema
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

// Agregar nuevo reloj
document.getElementById('addClockBtn').addEventListener('click', () => {
  document.getElementById('timezoneModal').classList.remove('hidden');
});

// Copy all times to clipboard
document.getElementById('copyAllBtn').addEventListener('click', () => {
  let allTimes = '';
  clocks.forEach(clock => {
    const element = document.getElementById(clock.id);
    if (element) {
      const timeText = element.querySelector('.clock-time').textContent;
      const dateText = element.querySelector('.clock-date').textContent;
      allTimes += `${clock.label}: ${timeText} ${dateText}\n`;
    }
  });

  navigator.clipboard.writeText(allTimes.trim()).then(() => {
    // Visual feedback
    const btn = document.getElementById('copyAllBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.backgroundColor = '#34c759';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 1500);
  });
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  document.getElementById('timezoneModal').classList.add('hidden');
});

document.getElementById('saveClockBtn').addEventListener('click', () => {
  const timezone = document.getElementById('timezoneSelect').value;

  // Verificar si ya existe un reloj con esta timezone
  const exists = clocks.some(clock => clock.timezone === timezone);
  if (exists) {
    alert('This timezone is already added!');
    return;
  }

  // Extraer el nombre de la ciudad de la timezone si no hay label
  let label = document.getElementById('clockLabel').value;
  if (!label) {
    // Extraer nombre de ciudad de la timezone (ej: "America/New_York" -> "New York")
    label = timezone.split('/').pop().replace(/_/g, ' ');
  }

  // Crear nuevo reloj
  const newClockId = `clock${Date.now()}`;
  clocks.push({ id: newClockId, label, timezone });

  // Guardar en localStorage
  saveClocks();

  // Re-renderizar todos los relojes
  renderClocks();

  // Cerrar modal y limpiar
  document.getElementById('timezoneModal').classList.add('hidden');
  document.getElementById('clockLabel').value = '';
});

// ============ DRAG AND DROP ============

function setupDragAndDrop() {
  const clockItems = document.querySelectorAll('.clock-item');

  clockItems.forEach((item, index) => {
    // Asegurarse de que sea draggable
    item.setAttribute('draggable', 'true');

    // Agregar event listeners (removeEventListener previene duplicados)
    item.removeEventListener('dragstart', handleDragStart);
    item.removeEventListener('dragover', handleDragOver);
    item.removeEventListener('drop', handleDrop);
    item.removeEventListener('dragend', handleDragEnd);
    item.removeEventListener('dragleave', handleDragLeave);

    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedElement = this;
  draggedIndex = Array.from(this.parentNode.children).indexOf(this);

  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  if (this !== draggedElement) {
    this.classList.add('drag-over');
  }

  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (draggedElement !== this) {
    // Obtener índices
    const fromIndex = draggedIndex;
    const toIndex = Array.from(this.parentNode.children).indexOf(this);

    // Reordenar en el array de clocks
    const movedClock = clocks.splice(fromIndex, 1)[0];
    clocks.splice(toIndex, 0, movedClock);

    // Guardar el nuevo orden
    saveClocks();

    // Reordenar en el DOM
    const clocksSection = document.querySelector('.clocks-section');

    if (fromIndex < toIndex) {
      clocksSection.insertBefore(draggedElement, this.nextSibling);
    } else {
      clocksSection.insertBefore(draggedElement, this);
    }
  }

  this.classList.remove('drag-over');
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');

  // Limpiar todas las clases drag-over
  document.querySelectorAll('.clock-item').forEach(item => {
    item.classList.remove('drag-over');
  });

  draggedElement = null;
  draggedIndex = null;
}

// ============ CONFIGURACIÓN ============

let settings = {
  layout: 'horizontal',  // horizontal, vertical
  iconStyle: 'time',  // time, numeric-date, month-day
  fontSize: 'medium',  // small, medium, large
  theme: 'dark'  // dark, light, glass
};

// Abrir modal de configuración
// Quit button
document.getElementById('quitBtn').addEventListener('click', () => {
  ipcRenderer.send('quit-app');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  // Cargar configuración actual
  document.querySelector(`input[name="layout"][value="${settings.layout}"]`).checked = true;
  document.querySelector(`input[name="iconStyle"][value="${settings.iconStyle}"]`).checked = true;
  document.querySelector(`input[name="fontSize"][value="${settings.fontSize}"]`).checked = true;
  document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
  document.getElementById('settingsModal').classList.remove('hidden');
});

// Cerrar modal de configuración
document.getElementById('settingsCancelBtn').addEventListener('click', () => {
  document.getElementById('settingsModal').classList.add('hidden');
});

// Guardar configuración
document.getElementById('settingsSaveBtn').addEventListener('click', () => {
  // Obtener valores
  settings.layout = document.querySelector('input[name="layout"]:checked').value;
  settings.iconStyle = document.querySelector('input[name="iconStyle"]:checked').value;
  settings.fontSize = document.querySelector('input[name="fontSize"]:checked').value;
  settings.theme = document.querySelector('input[name="theme"]:checked').value;

  // Aplicar configuración
  applySettings();

  // Cerrar modal
  document.getElementById('settingsModal').classList.add('hidden');
});

function applySettings() {
  const container = document.querySelector('.container');

  // Aplicar layout
  container.classList.remove('horizontal', 'vertical');
  container.classList.add(settings.layout);

  // Aplicar font size
  container.classList.remove('font-small', 'font-medium', 'font-large');
  container.classList.add(`font-${settings.fontSize}`);

  // Aplicar theme
  container.classList.remove('theme-dark', 'theme-light');
  container.classList.add(`theme-${settings.theme}`);

  // Actualizar ícono en la barra
  ipcRenderer.send('update-tray-icon', settings.iconStyle);

  // Notificar al proceso principal para ajustar el tamaño de la ventana
  ipcRenderer.send('change-layout', settings.layout);
}

// Inicializar
renderCalendar(currentMonth, currentYear);
renderClocks(); // Renderizar relojes desde localStorage (incluye setupDragAndDrop y updateClocks)
applySettings(); // Aplicar configuración inicial

// Actualizar relojes cada segundo
setInterval(updateClocks, 1000);
