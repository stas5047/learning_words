// Test engine module - Generate and validate tests

import { getState, setState } from '../state.js';
import { shuffleArray, getRandomItems, calculatePercentage } from '../utils.js';
import { showError, showSuccess } from '../components/notification.js';

// Initialize a new test
export function initTest(words, mode, questionCount) {
  if (!words || words.length === 0) {
    showError('No words available for testing');
    return null;
  }

  if (words.length < 4 && mode === 'multiple-choice') {
    showError('You need at least 4 words for multiple choice tests');
    return null;
  }

  const actualQuestionCount = Math.min(questionCount, words.length);
  const questions = generateQuestions(words, mode, actualQuestionCount);

  const testState = {
    mode,
    totalQuestions: actualQuestionCount,
    currentQuestionIndex: 0,
    questions,
    answers: [],
    correctCount: 0,
    isComplete: false,
    startTime: new Date().toISOString()
  };

  setState('testState', testState);
  return testState;
}

// Generate questions for the test
function generateQuestions(words, mode, count) {
  const selectedWords = getRandomItems(words, count);

  return selectedWords.map(word => {
    if (mode === 'multiple-choice') {
      return generateMultipleChoiceQuestion(word, words);
    } else {
      return generateTextInputQuestion(word);
    }
  });
}

// Generate a multiple choice question
function generateMultipleChoiceQuestion(correctWord, allWords) {
  // Get 3 random wrong answers
  const wrongWords = allWords
    .filter(w => w.id !== correctWord.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Combine and shuffle options
  const options = shuffleArray([
    ...wrongWords.map(w => w.translation),
    correctWord.translation
  ]);

  return {
    id: correctWord.id,
    question: correctWord.foreign,
    options,
    correctAnswer: correctWord.translation,
    type: 'multiple-choice',
    userAnswer: null,
    isCorrect: null
  };
}

// Generate a text input question
function generateTextInputQuestion(word) {
  return {
    id: word.id,
    question: word.translation,
    correctAnswer: word.foreign,
    type: 'text-input',
    userAnswer: null,
    isCorrect: null
  };
}

// Submit answer for current question
export function submitAnswer(answer) {
  const testState = getState('testState');

  if (!testState || testState.isComplete) {
    return null;
  }

  const currentQuestion = testState.questions[testState.currentQuestionIndex];
  const isCorrect = checkAnswer(answer, currentQuestion);

  // Update question with answer
  currentQuestion.userAnswer = answer;
  currentQuestion.isCorrect = isCorrect;

  // Update test state
  if (isCorrect) {
    testState.correctCount++;
  }

  setState('testState', testState);
  return { isCorrect, correctAnswer: currentQuestion.correctAnswer };
}

// Check if answer is correct
function checkAnswer(userAnswer, question) {
  if (question.type === 'multiple-choice') {
    return userAnswer === question.correctAnswer;
  } else {
    // Text input - case insensitive comparison
    const normalized = (str) => str.trim().toLowerCase();
    return normalized(userAnswer) === normalized(question.correctAnswer);
  }
}

// Move to next question
export function nextQuestion() {
  const testState = getState('testState');

  if (!testState || testState.isComplete) {
    return null;
  }

  const nextIndex = testState.currentQuestionIndex + 1;

  if (nextIndex >= testState.totalQuestions) {
    // Test is complete
    completeTest();
    return null;
  }

  testState.currentQuestionIndex = nextIndex;
  setState('testState', testState);

  return testState.questions[nextIndex];
}

// Complete the test
function completeTest() {
  const testState = getState('testState');

  if (!testState) return;

  testState.isComplete = true;
  testState.endTime = new Date().toISOString();

  // Calculate duration
  const startTime = new Date(testState.startTime);
  const endTime = new Date(testState.endTime);
  testState.durationSeconds = Math.round((endTime - startTime) / 1000);

  setState('testState', testState);

  // Save to test history
  saveTestResult(testState);
}

// Save test result to history
function saveTestResult(testState) {
  const history = getState('testHistory') || [];

  const result = {
    date: testState.endTime,
    mode: testState.mode,
    totalQuestions: testState.totalQuestions,
    correctCount: testState.correctCount,
    score: calculatePercentage(testState.correctCount, testState.totalQuestions),
    durationSeconds: testState.durationSeconds
  };

  const updatedHistory = [result, ...history].slice(0, 50); // Keep last 50 results
  setState('testHistory', updatedHistory);
}

// Get current test state
export function getCurrentTest() {
  return getState('testState');
}

// Get current question
export function getCurrentQuestion() {
  const testState = getState('testState');

  if (!testState || testState.isComplete) {
    return null;
  }

  return testState.questions[testState.currentQuestionIndex];
}

// Get test results
export function getTestResults() {
  const testState = getState('testState');

  if (!testState || !testState.isComplete) {
    return null;
  }

  const score = calculatePercentage(testState.correctCount, testState.totalQuestions);

  return {
    mode: testState.mode,
    totalQuestions: testState.totalQuestions,
    correctCount: testState.correctCount,
    incorrectCount: testState.totalQuestions - testState.correctCount,
    score,
    durationSeconds: testState.durationSeconds,
    questions: testState.questions,
    passed: score >= 70
  };
}

// Reset test
export function resetTest() {
  setState('testState', null);
}

// Get test history
export function getTestHistory() {
  return getState('testHistory') || [];
}

// Get test statistics
export function getTestStatistics() {
  const history = getTestHistory();

  if (history.length === 0) {
    return null;
  }

  const totalTests = history.length;
  const averageScore = Math.round(
    history.reduce((sum, test) => sum + test.score, 0) / totalTests
  );
  const bestScore = Math.max(...history.map(test => test.score));
  const totalQuestions = history.reduce((sum, test) => sum + test.totalQuestions, 0);
  const totalCorrect = history.reduce((sum, test) => sum + test.correctCount, 0);

  return {
    totalTests,
    averageScore,
    bestScore,
    totalQuestions,
    totalCorrect,
    overallAccuracy: calculatePercentage(totalCorrect, totalQuestions)
  };
}
