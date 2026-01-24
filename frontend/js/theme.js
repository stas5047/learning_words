// Theme management for light/dark mode

import { getState, setState } from './state.js';

let currentTheme = 'light';

export function initTheme() {
  // Load theme from state
  currentTheme = getState('theme') || 'light';
  applyTheme(currentTheme);

  // Attach event listener to theme toggle button
  document.addEventListener('click', (e) => {
    if (e.target.id === 'theme-toggle' || e.target.closest('#theme-toggle')) {
      toggleTheme();
    }
  });
}

export function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

export function setTheme(theme) {
  currentTheme = theme;
  applyTheme(theme);
  setState('theme', theme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update toggle button icon if it exists
  updateThemeButton();
}

function updateThemeButton() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = currentTheme === 'dark'
      ? '<span class="text-2xl">☀️</span>'
      : '<span class="text-2xl">🌙</span>';
  }
}

export function getCurrentTheme() {
  return currentTheme;
}
