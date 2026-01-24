// Simple state management with observer pattern

const state = {
  words: [],
  theme: 'light',
  testState: null,
  filters: {
    searchTerm: '',
    category: 'all'
  },
  testHistory: []
};

const listeners = {};

// Initialize state from localStorage
export function initState() {
  const savedWords = localStorage.getItem('wordApp_words');
  const savedTheme = localStorage.getItem('wordApp_theme');
  const savedHistory = localStorage.getItem('wordApp_testHistory');

  if (savedWords) {
    try {
      state.words = JSON.parse(savedWords);
    } catch (e) {
      console.error('Failed to parse saved words:', e);
    }
  }

  if (savedTheme) {
    state.theme = savedTheme;
  }

  if (savedHistory) {
    try {
      state.testHistory = JSON.parse(savedHistory);
    } catch (e) {
      console.error('Failed to parse saved history:', e);
    }
  }
}

// Get state value
export function getState(key) {
  if (key) {
    return state[key];
  }
  return state;
}

// Set state value and notify listeners
export function setState(key, value) {
  state[key] = value;

  // Save to localStorage for persistent data
  if (key === 'words') {
    localStorage.setItem('wordApp_words', JSON.stringify(value));
  } else if (key === 'theme') {
    localStorage.setItem('wordApp_theme', value);
  } else if (key === 'testHistory') {
    localStorage.setItem('wordApp_testHistory', JSON.stringify(value));
  }

  // Notify listeners
  if (listeners[key]) {
    listeners[key].forEach(callback => callback(value));
  }
}

// Subscribe to state changes
export function subscribe(key, callback) {
  if (!listeners[key]) {
    listeners[key] = [];
  }
  listeners[key].push(callback);

  // Return unsubscribe function
  return () => {
    listeners[key] = listeners[key].filter(cb => cb !== callback);
  };
}

// Clear all state (for testing)
export function clearState() {
  state.words = [];
  state.testState = null;
  state.filters = { searchTerm: '', category: 'all' };
  state.testHistory = [];

  localStorage.removeItem('wordApp_words');
  localStorage.removeItem('wordApp_testHistory');
}
