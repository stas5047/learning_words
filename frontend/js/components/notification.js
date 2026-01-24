// Toast notification component

let notificationIdCounter = 0;

export function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const id = `notification-${notificationIdCounter++}`;
  const notification = createNotificationElement(message, type, id);

  container.insertAdjacentHTML('beforeend', notification);

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification(id);
    }, duration);
  }

  return id;
}

function createNotificationElement(message, type, id) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colors = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-white',
    info: 'bg-primary text-white'
  };

  const icon = icons[type] || icons.info;
  const colorClass = colors[type] || colors.info;

  return `
    <div id="${id}" class="notification ${colorClass} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md">
      <span class="text-2xl font-bold">${icon}</span>
      <span class="flex-1">${message}</span>
      <button onclick="window.dismissNotification('${id}')" class="text-white hover:text-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
}

export function dismissNotification(id) {
  const notification = document.getElementById(id);
  if (notification) {
    notification.classList.add('notification-exit');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Make dismissNotification available globally for onclick handlers
window.dismissNotification = dismissNotification;

// Convenience methods
export function showSuccess(message, duration = 3000) {
  return showNotification(message, 'success', duration);
}

export function showError(message, duration = 4000) {
  return showNotification(message, 'error', duration);
}

export function showWarning(message, duration = 3500) {
  return showNotification(message, 'warning', duration);
}

export function showInfo(message, duration = 3000) {
  return showNotification(message, 'info', duration);
}
