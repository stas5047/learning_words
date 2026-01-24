// Testing page view

import { getWords } from '../modules/wordManager.js';
import { initTest, submitAnswer, nextQuestion, getCurrentTest, getCurrentQuestion, getTestResults, resetTest } from '../modules/testEngine.js';
import { showError, showSuccess } from '../components/notification.js';
import { calculatePercentage } from '../utils.js';

let currentAnswer = null;

export function renderTestingPage() {
  const testState = getCurrentTest();

  if (!testState) {
    return renderTestConfiguration();
  }

  if (testState.isComplete) {
    return renderTestResults();
  }

  return renderTestQuestion();
}

// Test configuration screen
function renderTestConfiguration() {
  const words = getWords();

  setTimeout(() => {
    attachTestConfigListeners();
  }, 0);

  return `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Take a Test</h1>

      ${words.length === 0 ? `
        <div class="card text-center py-12">
          <div class="text-6xl mb-4">📚</div>
          <h2 class="text-2xl font-bold mb-4">No Words Available</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            You need to add some words before you can take a test.
          </p>
          <a href="#/words" class="btn-primary inline-block">
            Add Words
          </a>
        </div>
      ` : `
        <div class="card">
          <h2 class="text-2xl font-bold mb-6">Configure Your Test</h2>

          <form id="test-config-form" class="space-y-6">
            <!-- Test Mode -->
            <div>
              <label class="block text-sm font-medium mb-3">Test Mode</label>
              <div class="space-y-3">
                <label class="flex items-start p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="test-mode" value="multiple-choice" checked class="mt-1 mr-3">
                  <div>
                    <div class="font-bold">Multiple Choice</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Select the correct translation from 4 options
                    </div>
                  </div>
                </label>

                <label class="flex items-start p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="test-mode" value="text-input" class="mt-1 mr-3">
                  <div>
                    <div class="font-bold">Text Input</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Type the correct word yourself
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Number of Questions -->
            <div>
              <label for="question-count" class="block text-sm font-medium mb-3">
                Number of Questions
              </label>
              <select id="question-count" class="input-field">
                <option value="5">5 Questions</option>
                <option value="10" selected>10 Questions</option>
                <option value="20">20 Questions</option>
                <option value="${words.length}">All ${words.length} Words</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You have ${words.length} word${words.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <!-- Start Button -->
            <button type="submit" class="btn-primary w-full text-lg py-4">
              <span class="flex items-center justify-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Start Test
              </span>
            </button>
          </form>
        </div>
      `}
    </div>
  `;
}

// Test question screen
function renderTestQuestion() {
  const testState = getCurrentTest();
  const question = getCurrentQuestion();

  if (!question) {
    return renderTestConfiguration();
  }

  const progress = calculatePercentage(testState.currentQuestionIndex + 1, testState.totalQuestions);
  const questionNumber = testState.currentQuestionIndex + 1;

  setTimeout(() => {
    attachTestQuestionListeners();
  }, 0);

  return `
    <div class="max-w-3xl mx-auto">
      <!-- Progress Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question ${questionNumber} of ${testState.totalQuestions}
          </span>
          <span class="text-sm font-medium text-primary">
            Score: ${testState.correctCount}/${testState.currentQuestionIndex > 0 ? testState.currentQuestionIndex : 0}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="card">
        <div class="mb-8">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            ${testState.mode === 'multiple-choice' ? 'Translate this word:' : 'What is the foreign word for:'}
          </p>
          <h2 class="text-4xl font-bold text-center py-6">
            ${question.question}
          </h2>
        </div>

        ${testState.mode === 'multiple-choice'
          ? renderMultipleChoiceOptions(question)
          : renderTextInputOption()
        }

        <!-- Answer Feedback -->
        <div id="answer-feedback" class="hidden mt-6"></div>

        <!-- Navigation -->
        <div class="mt-8 flex gap-4">
          <button id="quit-test-btn" class="btn-secondary">
            Quit Test
          </button>
          <button id="submit-answer-btn" class="btn-primary flex-1" disabled>
            ${questionNumber === testState.totalQuestions ? 'Finish Test' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMultipleChoiceOptions(question) {
  return `
    <div id="answer-options" class="space-y-3">
      ${question.options.map((option, index) => `
        <button
          class="test-option"
          data-option="${option}"
        >
          <div class="flex items-center gap-3">
            <span class="font-bold text-lg w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
              ${String.fromCharCode(65 + index)}
            </span>
            <span>${option}</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;
}

function renderTextInputOption() {
  return `
    <div>
      <label for="text-answer" class="block text-sm font-medium mb-2">
        Your Answer:
      </label>
      <input
        type="text"
        id="text-answer"
        class="input-field text-lg"
        placeholder="Type your answer here..."
        autocomplete="off"
        autofocus
      >
    </div>
  `;
}

// Test results screen
function renderTestResults() {
  const results = getTestResults();

  if (!results) {
    return renderTestConfiguration();
  }

  const scoreColor = results.score >= 90 ? 'text-green-600 dark:text-green-400' :
                     results.score >= 70 ? 'text-blue-600 dark:text-blue-400' :
                     results.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                     'text-red-600 dark:text-red-400';

  const message = results.score >= 90 ? 'Excellent! 🎉' :
                  results.score >= 70 ? 'Great job! 👏' :
                  results.score >= 50 ? 'Good effort! 💪' :
                  'Keep practicing! 📚';

  setTimeout(() => {
    attachTestResultsListeners();
  }, 0);

  return `
    <div class="max-w-3xl mx-auto">
      <div class="card text-center">
        <!-- Score Display -->
        <div class="mb-8">
          <div class="text-6xl mb-4">
            ${results.passed ? '🏆' : '📊'}
          </div>
          <h1 class="text-5xl font-bold ${scoreColor} mb-2">
            ${results.score}%
          </h1>
          <p class="text-2xl font-semibold mb-4">${message}</p>
          <p class="text-gray-600 dark:text-gray-400">
            ${results.correctCount} out of ${results.totalQuestions} correct
          </p>
        </div>

        <!-- Statistics -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              ${results.correctCount}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Correct</div>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              ${results.incorrectCount}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
          </div>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              ${results.durationSeconds}s
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button id="new-test-btn" class="btn-primary flex-1">
            Take Another Test
          </button>
          <a href="#/" class="btn-secondary flex-1 flex items-center justify-center">
            Back to Home
          </a>
        </div>

        <!-- Review Wrong Answers -->
        ${results.incorrectCount > 0 ? `
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-bold mb-4 text-left">Review Mistakes</h3>
            <div class="space-y-3">
              ${results.questions
                .filter(q => !q.isCorrect)
                .map(q => `
                  <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                    <div class="font-bold mb-1">Q: ${q.question}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Your answer: <span class="text-red-600 dark:text-red-400">${q.userAnswer || '(no answer)'}</span>
                    </div>
                    <div class="text-sm text-green-600 dark:text-green-400">
                      Correct answer: ${q.correctAnswer}
                    </div>
                  </div>
                `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Event listeners
function attachTestConfigListeners() {
  const form = document.getElementById('test-config-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const mode = document.querySelector('input[name="test-mode"]:checked').value;
      const questionCount = parseInt(document.getElementById('question-count').value);

      const words = getWords();

      if (mode === 'multiple-choice' && words.length < 4) {
        showError('You need at least 4 words for multiple choice tests');
        return;
      }

      const test = initTest(words, mode, questionCount);

      if (test) {
        // Re-render the page to show the first question
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.innerHTML = renderTestingPage();
        }
      }
    });
  }
}

function attachTestQuestionListeners() {
  const testState = getCurrentTest();

  // Multiple choice options
  if (testState.mode === 'multiple-choice') {
    const optionButtons = document.querySelectorAll('[data-option]');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove previous selection
        optionButtons.forEach(b => b.classList.remove('selected'));

        // Mark as selected
        btn.classList.add('selected');

        // Store answer
        currentAnswer = btn.dataset.option;

        // Enable submit button
        const submitBtn = document.getElementById('submit-answer-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      });
    });
  }

  // Text input
  const textInput = document.getElementById('text-answer');
  if (textInput) {
    textInput.addEventListener('input', (e) => {
      currentAnswer = e.target.value;

      const submitBtn = document.getElementById('submit-answer-btn');
      if (submitBtn) {
        submitBtn.disabled = !currentAnswer || currentAnswer.trim() === '';
      }
    });

    // Submit on Enter
    textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && currentAnswer && currentAnswer.trim()) {
        document.getElementById('submit-answer-btn')?.click();
      }
    });
  }

  // Submit answer button
  const submitBtn = document.getElementById('submit-answer-btn');
  if (submitBtn) {
    let isSubmitting = false; // Prevent double submission

    submitBtn.addEventListener('click', () => {
      if (!currentAnswer || isSubmitting) return;

      isSubmitting = true; // Lock to prevent double-click
      const result = submitAnswer(currentAnswer);

      if (result) {
        // Show feedback
        showAnswerFeedback(result.isCorrect, result.correctAnswer);

        // Disable further answers
        submitBtn.disabled = true;

        if (testState.mode === 'multiple-choice') {
          // Highlight correct/incorrect options
          const optionButtons = document.querySelectorAll('[data-option]');
          optionButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.option === result.correctAnswer) {
              btn.classList.add('correct');
            } else if (btn.dataset.option === currentAnswer && !result.isCorrect) {
              btn.classList.add('incorrect');
            }
          });
        } else {
          textInput.disabled = true;
        }

        // Change button to "Next" or "Finish"
        submitBtn.textContent = testState.currentQuestionIndex === testState.totalQuestions - 1
          ? 'View Results'
          : 'Next Question';
        submitBtn.disabled = false;

        // Replace click handler to move to next
        submitBtn.onclick = () => {
          const nextQ = nextQuestion();
          currentAnswer = null;

          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.innerHTML = renderTestingPage();
          }
        };
      }
    });
  }

  // Quit test button
  const quitBtn = document.getElementById('quit-test-btn');
  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        resetTest();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.innerHTML = renderTestingPage();
        }
      }
    });
  }
}

function attachTestResultsListeners() {
  const newTestBtn = document.getElementById('new-test-btn');
  if (newTestBtn) {
    newTestBtn.addEventListener('click', () => {
      resetTest();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = renderTestingPage();
      }
    });
  }
}

function showAnswerFeedback(isCorrect, correctAnswer) {
  const feedback = document.getElementById('answer-feedback');
  if (!feedback) return;

  feedback.className = isCorrect
    ? 'p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-center font-medium'
    : 'p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-center';

  feedback.innerHTML = isCorrect
    ? '✓ Correct!'
    : `✗ Incorrect. The correct answer is: <strong>${correctAnswer}</strong>`;

  feedback.classList.remove('hidden');
}
