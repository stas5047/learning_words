// Modal dialog component

import { escapeHtml, validateWordInput } from '../utils.js';
import { showError } from './notification.js';

let currentModal = null;

export function createModal(title, content, actions = []) {
  // Remove any existing modal
  closeModal();

  const modalId = 'current-modal';
  const actionsHtml = actions.map(action => {
    const btnClass = action.type === 'primary' ? 'btn-primary' :
                     action.type === 'danger' ? 'btn-danger' :
                     'btn-secondary';

    return `
      <button
        id="${action.id || ''}"
        class="${btnClass}"
        onclick="window.modalActions['${action.id || ''}']?.()"
      >
        ${action.label}
      </button>
    `;
  }).join('');

  const modalHtml = `
    <div id="${modalId}" class="modal-backdrop">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold">${escapeHtml(title)}</h3>
          <button onclick="window.closeModal()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          ${content}
        </div>

        <!-- Modal Actions -->
        ${actions.length > 0 ? `
          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            ${actionsHtml}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const container = document.getElementById('modal-container');
  if (container) {
    container.innerHTML = modalHtml;
    currentModal = modalId;

    // Store action handlers
    window.modalActions = {};
    actions.forEach(action => {
      if (action.id && action.onClick) {
        window.modalActions[action.id] = action.onClick;
      }
    });

    // Close modal on backdrop click
    const backdrop = document.getElementById(modalId);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal();
        }
      });
    }

    // Close modal on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.innerHTML = '';
  }
  currentModal = null;
  window.modalActions = {};
}

// Make closeModal available globally for onclick handlers
window.closeModal = closeModal;

// Confirmation dialog
export function showConfirmDialog(title, message, onConfirm, onCancel) {
  createModal(
    title,
    `<p class="text-gray-700 dark:text-gray-300">${escapeHtml(message)}</p>`,
    [
      {
        id: 'cancel-btn',
        label: 'Cancel',
        type: 'secondary',
        onClick: () => {
          closeModal();
          if (onCancel) onCancel();
        }
      },
      {
        id: 'confirm-btn',
        label: 'Confirm',
        type: 'danger',
        onClick: () => {
          closeModal();
          if (onConfirm) onConfirm();
        }
      }
    ]
  );
}

// Edit word dialog
export function showEditWordDialog(word, onSave) {
  const content = `
    <form id="edit-word-form" class="space-y-4">
      <div>
        <label for="edit-foreign" class="block text-sm font-medium mb-2">Foreign Word</label>
        <input
          type="text"
          id="edit-foreign"
          class="input-field"
          value="${escapeHtml(word.foreign || '')}"
          maxlength="100"
          required
        >
      </div>
      <div>
        <label for="edit-translation" class="block text-sm font-medium mb-2">Translation</label>
        <input
          type="text"
          id="edit-translation"
          class="input-field"
          value="${escapeHtml(word.translation || '')}"
          maxlength="100"
          required
        >
      </div>
    </form>
  `;

  createModal(
    'Edit Word',
    content,
    [
      {
        id: 'cancel-edit-btn',
        label: 'Cancel',
        type: 'secondary',
        onClick: closeModal
      },
      {
        id: 'save-edit-btn',
        label: 'Save',
        type: 'primary',
        onClick: () => {
          const foreign = document.getElementById('edit-foreign').value.trim();
          const translation = document.getElementById('edit-translation').value.trim();

          const validation = validateWordInput(foreign, translation);
          if (!validation.isValid) {
            showError(validation.errors.join(', '));
            return;
          }

          onSave({
            ...word,
            foreign,
            translation
          });
          closeModal();
        }
      }
    ]
  );

  // Submit form on Enter
  const form = document.getElementById('edit-word-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('save-edit-btn')?.click();
    });
  }
}
