// Home page view

import { getWordCount } from '../modules/wordManager.js';
import { getTestStatistics } from '../modules/testEngine.js';

export function renderHomePage() {
  const wordCount = getWordCount();
  const stats = getTestStatistics();

  return `
    <div class="max-w-6xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-gradient">
          Word Learning App
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Master vocabulary with interactive tests and smart tracking
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="card text-center">
          <div class="text-4xl mb-2">📚</div>
          <div class="text-3xl font-bold mb-1">${wordCount}</div>
          <div class="text-gray-600 dark:text-gray-400">Words Learned</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl mb-2">🎯</div>
          <div class="text-3xl font-bold mb-1">${stats ? stats.totalTests : 0}</div>
          <div class="text-gray-600 dark:text-gray-400">Tests Taken</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl mb-2">⭐</div>
          <div class="text-3xl font-bold mb-1">${stats ? stats.averageScore : 0}%</div>
          <div class="text-gray-600 dark:text-gray-400">Average Score</div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Manage Words Card -->
        <a href="#/words" class="card-hover group">
          <div class="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
            📝
          </div>
          <h2 class="text-2xl font-bold mb-2 text-center">Manage Words</h2>
          <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
            Add, edit, and organize your vocabulary
          </p>
          <div class="flex items-center justify-center text-primary group-hover:text-blue-600">
            <span class="font-medium">Get Started</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </a>

        <!-- Take Test Card -->
        <a href="#/test" class="card-hover group">
          <div class="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
            🎓
          </div>
          <h2 class="text-2xl font-bold mb-2 text-center">Take Test</h2>
          <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
            Test your knowledge with interactive quizzes
          </p>
          <div class="flex items-center justify-center text-primary group-hover:text-blue-600">
            <span class="font-medium">Start Testing</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </a>

        <!-- Statistics Card -->
        <a href="#/statistics" class="card-hover group">
          <div class="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
            📊
          </div>
          <h2 class="text-2xl font-bold mb-2 text-center">Statistics</h2>
          <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
            Track your progress and performance
          </p>
          <div class="flex items-center justify-center text-primary group-hover:text-blue-600">
            <span class="font-medium">View Statistics</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </a>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center mb-8">Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl mb-3">🔤</div>
            <h3 class="font-bold mb-2">Word Management</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Add, edit, and delete words with ease
            </p>
          </div>
          <div class="text-center">
            <div class="text-3xl mb-3">📁</div>
            <h3 class="font-bold mb-2">Import/Export</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Import word lists from text files
            </p>
          </div>
          <div class="text-center">
            <div class="text-3xl mb-3">🎯</div>
            <h3 class="font-bold mb-2">Two Test Modes</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Multiple choice and text input tests
            </p>
          </div>
          <div class="text-center">
            <div class="text-3xl mb-3">🌙</div>
            <h3 class="font-bold mb-2">Dark Mode</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Easy on the eyes, day or night
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
