// Utility functions

// Generate unique ID
export function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Escape HTML to prevent XSS
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Debounce function for search inputs
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Shuffle array
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random items from array
export function getRandomItems(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Calculate percentage
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Validate word input
export function validateWordInput(foreign, translation) {
  const errors = [];

  if (!foreign || foreign.trim() === '') {
    errors.push('Foreign word is required');
  }

  if (!translation || translation.trim() === '') {
    errors.push('Translation is required');
  }

  if (foreign && foreign.length > 100) {
    errors.push('Foreign word is too long (max 100 characters)');
  }

  if (translation && translation.length > 100) {
    errors.push('Translation is too long (max 100 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Parse word file content
export function parseWordFile(content) {
  const lines = content.split('\n');
  const words = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    // Split by ' - ' separator
    const parts = trimmed.split(' - ');

    if (parts.length >= 2) {
      const foreign = parts[0].trim();
      const translation = parts.slice(1).join(' - ').trim(); // Handle multiple dashes

      if (foreign && translation) {
        words.push({
          foreign,
          translation,
          lineNumber: index + 1
        });
      }
    }
  });

  return words;
}

// Download text file
export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
