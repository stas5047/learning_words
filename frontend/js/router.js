// Hash-based SPA router

import { renderHomePage } from './pages/home.js';
import { renderWordManagementPage } from './pages/wordManagement.js';
import { renderTestingPage } from './pages/testing.js';

const routes = {
  '/': renderHomePage,
  '/words': renderWordManagementPage,
  '/test': renderTestingPage
};

export function initRouter() {
  // Handle hash change events
  window.addEventListener('hashchange', handleRoute);

  // Handle initial page load
  handleRoute();
}

function handleRoute() {
  const path = window.location.hash.slice(1) || '/';
  const renderPage = routes[path] || routes['/'];

  // Get main content container
  const mainContent = document.getElementById('main-content');

  if (!mainContent) {
    console.error('Main content container not found');
    return;
  }

  // Render the page
  mainContent.innerHTML = renderPage();

  // Update active navigation link
  updateActiveNavLink(path);

  // Scroll to top
  window.scrollTo(0, 0);
}

export function navigateTo(path) {
  window.location.hash = path;
}

function updateActiveNavLink(currentPath) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${currentPath}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Export for use in links
export function handleLinkClick(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#/')) {
    e.preventDefault();
    const path = e.target.getAttribute('href').slice(1);
    navigateTo(path);
  }
}
