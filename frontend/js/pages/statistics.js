// Statistics page view

import { getTestStatistics, getTestHistory } from '../modules/testEngine.js';
import { formatDate } from '../utils.js';

export function renderStatisticsPage() {
  const stats = getTestStatistics();
  const history = getTestHistory();

  // Show empty state if no tests taken
  if (!stats) {
    return renderEmptyState();
  }

  return `
    <div class="max-w-6xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gradient mb-2">📊 Statistics</h1>
        <p class="text-gray-600 dark:text-gray-400">Track your learning progress and performance</p>
      </div>

      <!-- Overview Cards -->
      ${renderOverviewCards(stats)}

      <!-- Mode Comparison -->
      ${renderModeComparison(history)}

      <!-- Recent Test History -->
      ${renderHistoryTable(history)}
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="max-w-2xl mx-auto text-center py-16">
      <div class="text-8xl mb-6">📊</div>
      <h1 class="text-3xl font-bold mb-4">No Statistics Yet</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Take your first test to start tracking your progress
      </p>
      <a href="#/test" class="btn-primary inline-block">
        Take a Test
      </a>
    </div>
  `;
}

function renderOverviewCards(stats) {
  return `
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card text-center">
        <div class="text-4xl mb-2">🎯</div>
        <div class="text-3xl font-bold mb-1">${stats.totalTests}</div>
        <div class="text-gray-600 dark:text-gray-400">Total Tests</div>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">⭐</div>
        <div class="text-3xl font-bold mb-1">${stats.averageScore}%</div>
        <div class="text-gray-600 dark:text-gray-400">Average Score</div>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">🏆</div>
        <div class="text-3xl font-bold mb-1">${stats.bestScore}%</div>
        <div class="text-gray-600 dark:text-gray-400">Best Score</div>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">📊</div>
        <div class="text-3xl font-bold mb-1">${stats.overallAccuracy}%</div>
        <div class="text-gray-600 dark:text-gray-400">Overall Accuracy</div>
      </div>
    </div>
  `;
}

function renderScoreHistory(history) {
  const recentTests = history.slice(0, 15);

  if (recentTests.length === 0) {
    return '';
  }

  return `
    <div class="card mb-8">
      <h2 class="text-2xl font-bold mb-6">Score History</h2>
      <div class="bar-chart-container">
        ${recentTests.reverse().map((test, index) => `
          <div class="chart-bar">
            <div class="chart-bar-fill bg-${getScoreColor(test.score)}-500"
                 style="height: ${test.score}%"
                 title="Test ${index + 1}: ${test.score}%">
              <div class="text-xs text-white font-bold p-1">${test.score}%</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Last ${recentTests.length} test${recentTests.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;
}

function renderModeComparison(history) {
  const multipleChoiceStats = calculateModeStats(history, 'multiple-choice');
  const textInputStats = calculateModeStats(history, 'text-input');

  return `
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Multiple Choice Stats -->
      <div class="card">
        <div class="flex items-center mb-4">
          <div class="text-3xl mr-3">✅</div>
          <h3 class="text-xl font-bold">Multiple Choice</h3>
        </div>
        ${multipleChoiceStats ? `
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Tests Taken</span>
              <span class="font-bold text-lg">${multipleChoiceStats.totalTests}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Average Score</span>
              <span class="font-bold text-lg text-${getScoreColor(multipleChoiceStats.averageScore)}-600">
                ${multipleChoiceStats.averageScore}%
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Accuracy</span>
              <span class="font-bold text-lg">${multipleChoiceStats.accuracy}%</span>
            </div>
          </div>
        ` : `
          <p class="text-gray-500 dark:text-gray-400 italic">No tests taken yet</p>
        `}
      </div>

      <!-- Text Input Stats -->
      <div class="card">
        <div class="flex items-center mb-4">
          <div class="text-3xl mr-3">✍️</div>
          <h3 class="text-xl font-bold">Text Input</h3>
        </div>
        ${textInputStats ? `
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Tests Taken</span>
              <span class="font-bold text-lg">${textInputStats.totalTests}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Average Score</span>
              <span class="font-bold text-lg text-${getScoreColor(textInputStats.averageScore)}-600">
                ${textInputStats.averageScore}%
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Accuracy</span>
              <span class="font-bold text-lg">${textInputStats.accuracy}%</span>
            </div>
          </div>
        ` : `
          <p class="text-gray-500 dark:text-gray-400 italic">No tests taken yet</p>
        `}
      </div>
    </div>
  `;
}

function renderHistoryTable(history) {
  if (history.length === 0) {
    return '';
  }

  return `
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">Score History</h2>
      <div class="overflow-x-auto">
        <table class="w-full stats-table">
          <thead>
            <tr class="border-b dark:border-gray-700">
              <th class="text-left py-3 px-2">Date</th>
              <th class="text-left py-3 px-2">Mode</th>
              <th class="text-center py-3 px-2">Questions</th>
              <th class="text-center py-3 px-2">Score</th>
              <th class="text-center py-3 px-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${history.map(test => `
              <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="py-3 px-2">${formatDate(test.date)}</td>
                <td class="py-3 px-2">
                  <span class="px-2 py-1 rounded text-xs font-medium ${
                    test.mode === 'multiple-choice'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }">
                    ${test.mode === 'multiple-choice' ? 'Multiple Choice' : 'Text Input'}
                  </span>
                </td>
                <td class="py-3 px-2 text-center">${test.totalQuestions}</td>
                <td class="py-3 px-2 text-center">
                  <span class="font-bold text-${getScoreColor(test.score)}-600">
                    ${test.score}%
                  </span>
                </td>
                <td class="py-3 px-2 text-center">${formatDuration(test.durationSeconds)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Helper functions

function calculateModeStats(history, mode) {
  const modeTests = history.filter(t => t.mode === mode);

  if (modeTests.length === 0) {
    return null;
  }

  const avgScore = Math.round(
    modeTests.reduce((sum, t) => sum + t.score, 0) / modeTests.length
  );
  const totalQuestions = modeTests.reduce((sum, t) => sum + t.totalQuestions, 0);
  const totalCorrect = modeTests.reduce((sum, t) => sum + t.correctCount, 0);
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

  return {
    totalTests: modeTests.length,
    averageScore: avgScore,
    accuracy: accuracy
  };
}

function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 70) return 'blue';
  if (score >= 50) return 'yellow';
  return 'red';
}

function formatDuration(seconds) {
  if (!seconds) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}
