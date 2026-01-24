// Word card component

import { escapeHtml } from '../utils.js';

export function createWordCard(word) {
  const foreign = escapeHtml(word.foreign);
  const translation = escapeHtml(word.translation);
  const category = word.category ? escapeHtml(word.category) : '';

  return `
    <div class="word-card" data-word-id="${word.id}">
      <div class="flex justify-between items-start gap-4">
        <!-- Word Content -->
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-lg mb-1 truncate" title="${foreign}">${foreign}</h3>
          <p class="text-gray-600 dark:text-gray-400 truncate" title="${translation}">${translation}</p>
          ${category ? `<span class="badge-primary mt-2">${category}</span>` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 flex-shrink-0">
          <button
            class="btn-icon text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            data-action="edit"
            data-word-id="${word.id}"
            aria-label="Edit word"
            title="Edit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            class="btn-icon text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            data-action="delete"
            data-word-id="${word.id}"
            aria-label="Delete word"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function createWordListEmpty() {
  return `
    <div class="empty-state">
      <svg class="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
      <h3 class="text-xl font-semibold mb-2">No words yet</h3>
      <p>Add your first word to get started!</p>
    </div>
  `;
}

export function createWordListLoading() {
  return `
    <div class="text-center py-8">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading words...</p>
    </div>
  `;
}
