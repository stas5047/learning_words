// Word management module - CRUD operations

import { getState, setState } from '../state.js';
import { generateId, validateWordInput, parseWordFile, downloadTextFile } from '../utils.js';
import { showSuccess, showError } from '../components/notification.js';

// Get all words
export function getWords() {
  return getState('words') || [];
}

// Add a new word
export function addWord(foreign, translation, category = 'uncategorized') {
  const validation = validateWordInput(foreign, translation);

  if (!validation.isValid) {
    showError(validation.errors.join(', '));
    return null;
  }

  const newWord = {
    id: generateId(),
    foreign: foreign.trim(),
    translation: translation.trim(),
    category,
    createdAt: new Date().toISOString()
  };

  const words = getWords();
  const updatedWords = [...words, newWord];
  setState('words', updatedWords);

  showSuccess('Word added successfully!');
  return newWord;
}

// Update existing word
export function updateWord(id, updates) {
  const words = getWords();
  const index = words.findIndex(w => w.id === id);

  if (index === -1) {
    showError('Word not found');
    return false;
  }

  if (updates.foreign || updates.translation) {
    const validation = validateWordInput(
      updates.foreign || words[index].foreign,
      updates.translation || words[index].translation
    );

    if (!validation.isValid) {
      showError(validation.errors.join(', '));
      return false;
    }
  }

  const updatedWords = [...words];
  updatedWords[index] = {
    ...words[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  setState('words', updatedWords);
  showSuccess('Word updated successfully!');
  return true;
}

// Delete a word
export function deleteWord(id) {
  const words = getWords();
  const updatedWords = words.filter(w => w.id !== id);

  if (words.length === updatedWords.length) {
    showError('Word not found');
    return false;
  }

  setState('words', updatedWords);
  showSuccess('Word deleted successfully!');
  return true;
}

// Search/filter words
export function searchWords(searchTerm) {
  const words = getWords();

  if (!searchTerm || searchTerm.trim() === '') {
    return words;
  }

  const term = searchTerm.toLowerCase().trim();
  return words.filter(word =>
    word.foreign.toLowerCase().includes(term) ||
    word.translation.toLowerCase().includes(term) ||
    (word.category && word.category.toLowerCase().includes(term))
  );
}

// Import words from file content
export function importWords(fileContent) {
  try {
    const parsedWords = parseWordFile(fileContent);

    if (parsedWords.length === 0) {
      showError('No valid words found in file');
      return 0;
    }

    const words = getWords();
    const newWords = parsedWords.map(({ foreign, translation }) => ({
      id: generateId(),
      foreign,
      translation,
      category: 'imported',
      createdAt: new Date().toISOString()
    }));

    const updatedWords = [...words, ...newWords];
    setState('words', updatedWords);

    showSuccess(`Successfully imported ${newWords.length} word(s)!`);
    return newWords.length;
  } catch (error) {
    showError('Failed to import words: ' + error.message);
    return 0;
  }
}

// Export words to file
export function exportWords() {
  const words = getWords();

  if (words.length === 0) {
    showError('No words to export');
    return;
  }

  const content = words.map(w => `${w.foreign} - ${w.translation}`).join('\n');
  const filename = `words_export_${new Date().toISOString().split('T')[0]}.txt`;

  downloadTextFile(content, filename);
  showSuccess('Words exported successfully!');
}

// Clear all words
export function clearAllWords() {
  setState('words', []);
  showSuccess('All words cleared!');
}

// Get word by ID
export function getWordById(id) {
  const words = getWords();
  return words.find(w => w.id === id);
}

// Get word count
export function getWordCount() {
  return getWords().length;
}

// Get words by category
export function getWordsByCategory(category) {
  const words = getWords();
  return words.filter(w => w.category === category);
}

// Get all categories
export function getAllCategories() {
  const words = getWords();
  const categories = new Set(words.map(w => w.category).filter(Boolean));
  return Array.from(categories).sort();
}
