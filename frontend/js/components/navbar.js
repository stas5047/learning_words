// Navigation bar component

export function createNavbar() {
  const currentPath = window.location.hash.slice(1) || '/';

  return `
    <nav class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo/Title -->
          <a href="#/" class="text-2xl font-bold text-gradient">
            📚 Word Learning
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a href="#/" class="nav-link ${currentPath === '/' ? 'active' : ''}">
              Home
            </a>
            <a href="#/words" class="nav-link ${currentPath === '/words' ? 'active' : ''}">
              Manage Words
            </a>
            <a href="#/test" class="nav-link ${currentPath === '/test' ? 'active' : ''}">
              Take Test
            </a>
            <button id="theme-toggle" class="btn-icon" aria-label="Toggle theme">
              <span class="text-2xl">🌙</span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button id="mobile-menu-toggle" class="md:hidden btn-icon" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div id="mobile-menu" class="hidden md:hidden mt-4 pb-2 space-y-2">
          <a href="#/" class="block nav-link ${currentPath === '/' ? 'active' : ''}">
            Home
          </a>
          <a href="#/words" class="block nav-link ${currentPath === '/words' ? 'active' : ''}">
            Manage Words
          </a>
          <a href="#/test" class="block nav-link ${currentPath === '/test' ? 'active' : ''}">
            Take Test
          </a>
          <div class="pt-2">
            <button id="theme-toggle-mobile" class="btn-icon" aria-label="Toggle theme">
              <span class="text-2xl">🌙</span> <span class="ml-2">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function initNavbar() {
  const navbarContainer = document.getElementById('navbar');
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
    attachMobileMenuListener();
  }
}

function attachMobileMenuListener() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Handle mobile theme toggle
  const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', (e) => {
      // Theme toggle is handled by theme.js
      e.target.id = 'theme-toggle';
    });
  }
}
