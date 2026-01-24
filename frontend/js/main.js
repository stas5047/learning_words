// Main application entry point

import { initState, getState, setState } from './state.js';
import { initTheme } from './theme.js';
import { initRouter } from './router.js';
import { initNavbar } from './components/navbar.js';
import { loadSampleWords } from './modules/mockData.js';

// Initialize the application
function initApp() {
  console.log('🚀 Initializing Word Learning App...');

  // Prevent transition flash on initial load
  document.documentElement.classList.add('no-transition');

  // Initialize state from localStorage
  initState();

  // Load sample words if no words exist
  const words = getState('words');
  if (!words || words.length === 0) {
    console.log('📚 Loading sample words...');
    const sampleWords = loadSampleWords();
    setState('words', sampleWords);
  }

  // Initialize theme (must be before rendering)
  initTheme();

  // Initialize navbar
  initNavbar();

  // Initialize router (handles initial page render)
  initRouter();

  // Re-enable transitions after a short delay
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition');
    console.log('✅ App initialized successfully!');
  }, 100);

  // Update navbar on hash change
  window.addEventListener('hashchange', () => {
    initNavbar();
  });

  // Log app info
  console.log('📊 Current state:', getState());
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for debugging
window.appState = {
  getState,
  setState
};
