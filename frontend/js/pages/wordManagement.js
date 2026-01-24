// Word Management page view

import { getWords, addWord, updateWord, deleteWord, importWords, exportWords, searchWords } from '../modules/wordManager.js';
import { createWordCard, createWordListEmpty } from '../components/wordCard.js';
import { showConfirmDialog, showEditWordDialog } from '../components/modal.js';
import { showError, showSuccess } from '../components/notification.js';
import { debounce } from '../utils.js';
import { subscribe } from '../state.js';

let searchTerm = '';

export function renderWordManagementPage() {
  const words = getWords();
  const filteredWords = searchTerm ? searchWords(searchTerm) : words;

  setTimeout(() => {
    attachWordManagementListeners();
    subscribe('words', () => {
      renderWordList();
    });
  }, 0);

  return `
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Manage Words</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column: Add Word Form -->
        <div class="lg:col-span-1">
          <div class="card sticky top-4">
            <h2 class="text-2xl font-bold mb-6">Add New Word</h2>

            <form id="add-word-form" class="space-y-4">
              <div>
                <label for="foreign-word" class="block text-sm font-medium mb-2">
                  Foreign Word/Phrase
                </label>
                <input
                  type="text"
                  id="foreign-word"
                  class="input-field"
                  placeholder="e.g., Hello"
                  required
                  autocomplete="off"
                >
              </div>

              <div>
                <label for="translation" class="block text-sm font-medium mb-2">
                  Translation
                </label>
                <input
                  type="text"
                  id="translation"
                  class="input-field"
                  placeholder="e.g., Привет"
                  required
                  autocomplete="off"
                >
              </div>

              <button type="submit" class="btn-primary w-full">
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Word
                </span>
              </button>
            </form>

            <!-- Import/Export Section -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="font-bold mb-4">Import/Export</h3>

              <div class="space-y-3">
                <label class="btn-secondary w-full cursor-pointer block text-center">
                  <input type="file" id="import-file" accept=".txt" class="hidden">
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Import from File
                  </span>
                </label>

                <button id="export-words-btn" class="btn-secondary w-full">
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                    </svg>
                    Export Words
                  </span>
                </button>
              </div>

              <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Format: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">word - translation</code>
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Word List -->
        <div class="lg:col-span-2">
          <!-- Search Bar -->
          <div class="card mb-6">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="search-words"
                class="search-input"
                placeholder="Search words or translations..."
                value="${searchTerm}"
              >
            </div>
          </div>

          <!-- Word Count -->
          <div class="flex justify-between items-center mb-4">
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-bold text-lg">${filteredWords.length}</span>
              ${filteredWords.length === 1 ? 'word' : 'words'}
              ${searchTerm ? ' (filtered)' : ''}
            </p>
            ${words.length > 0 ? `
              <button id="clear-all-btn" class="text-sm text-red-600 dark:text-red-400 hover:underline">
                Clear All
              </button>
            ` : ''}
          </div>

          <!-- Word List -->
          <div id="word-list" class="space-y-4 custom-scrollbar">
            ${renderWordListContent(filteredWords)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderWordListContent(words) {
  if (words.length === 0) {
    return createWordListEmpty();
  }

  return words.map(word => createWordCard(word)).join('');
}

function renderWordList() {
  const wordListContainer = document.getElementById('word-list');
  if (!wordListContainer) return;

  const words = getWords();
  const filteredWords = searchTerm ? searchWords(searchTerm) : words;

  wordListContainer.innerHTML = renderWordListContent(filteredWords);

  // Update word count
  const countElement = wordListContainer.previousElementSibling;
  if (countElement) {
    countElement.querySelector('p').innerHTML = `
      <span class="font-bold text-lg">${filteredWords.length}</span>
      ${filteredWords.length === 1 ? 'word' : 'words'}
      ${searchTerm ? ' (filtered)' : ''}
    `;
  }
}

function attachWordManagementListeners() {
  // Add word form submission
  const addWordForm = document.getElementById('add-word-form');
  if (addWordForm) {
    addWordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const foreign = document.getElementById('foreign-word').value;
      const translation = document.getElementById('translation').value;

      if (addWord(foreign, translation)) {
        addWordForm.reset();
        document.getElementById('foreign-word').focus();
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('search-words');
  if (searchInput) {
    const debouncedSearch = debounce((term) => {
      searchTerm = term;
      renderWordList();
    }, 300);

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }

  // Import file
  const importFile = document.getElementById('import-file');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        importWords(event.target.result);
        importFile.value = ''; // Reset file input
      };
      reader.onerror = () => {
        showError('Failed to read file');
      };
      reader.readAsText(file);
    });
  }

  // Export words
  const exportBtn = document.getElementById('export-words-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportWords();
    });
  }

  // Clear all words
  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      showConfirmDialog(
        'Clear All Words',
        'Are you sure you want to delete all words? This action cannot be undone.',
        () => {
          const { clearAllWords } = require('../modules/wordManager.js');
          clearAllWords();
        }
      );
    });
  }

  // Word list event delegation (edit/delete)
  const wordList = document.getElementById('word-list');
  if (wordList) {
    wordList.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const wordId = button.dataset.wordId;

      if (action === 'edit') {
        handleEditWord(wordId);
      } else if (action === 'delete') {
        handleDeleteWord(wordId);
      }
    });
  }
}

function handleEditWord(wordId) {
  const { getWordById } = require('../modules/wordManager.js');
  const word = getWordById(wordId);

  if (!word) {
    showError('Word not found');
    return;
  }

  showEditWordDialog(word, (updatedWord) => {
    updateWord(wordId, {
      foreign: updatedWord.foreign,
      translation: updatedWord.translation
    });
  });
}

function handleDeleteWord(wordId) {
  const { getWordById } = require('../modules/wordManager.js');
  const word = getWordById(wordId);

  if (!word) {
    showError('Word not found');
    return;
  }

  showConfirmDialog(
    'Delete Word',
    `Are you sure you want to delete "${word.foreign}"?`,
    () => {
      deleteWord(wordId);
    }
  );
}
