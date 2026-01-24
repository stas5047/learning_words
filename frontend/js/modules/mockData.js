// Mock data for demonstration

import { generateId } from '../utils.js';

export const sampleWords = [
  {
    id: generateId(),
    foreign: 'Hello',
    translation: 'Привет',
    category: 'greetings',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: generateId(),
    foreign: 'Goodbye',
    translation: 'До свидания',
    category: 'greetings',
    createdAt: '2026-01-20T10:05:00Z'
  },
  {
    id: generateId(),
    foreign: 'Thank you',
    translation: 'Спасибо',
    category: 'polite',
    createdAt: '2026-01-20T10:10:00Z'
  },
  {
    id: generateId(),
    foreign: 'Please',
    translation: 'Пожалуйста',
    category: 'polite',
    createdAt: '2026-01-20T10:15:00Z'
  },
  {
    id: generateId(),
    foreign: 'Water',
    translation: 'Вода',
    category: 'food',
    createdAt: '2026-01-20T10:20:00Z'
  },
  {
    id: generateId(),
    foreign: 'Book',
    translation: 'Книга',
    category: 'objects',
    createdAt: '2026-01-20T10:25:00Z'
  },
  {
    id: generateId(),
    foreign: 'Friend',
    translation: 'Друг',
    category: 'people',
    createdAt: '2026-01-20T10:30:00Z'
  },
  {
    id: generateId(),
    foreign: 'House',
    translation: 'Дом',
    category: 'places',
    createdAt: '2026-01-20T10:35:00Z'
  },
  {
    id: generateId(),
    foreign: 'Beautiful',
    translation: 'Красивый',
    category: 'adjectives',
    createdAt: '2026-01-20T10:40:00Z'
  },
  {
    id: generateId(),
    foreign: 'To eat',
    translation: 'Есть',
    category: 'verbs',
    createdAt: '2026-01-20T10:45:00Z'
  },
  {
    id: generateId(),
    foreign: 'Good morning',
    translation: 'Доброе утро',
    category: 'greetings',
    createdAt: '2026-01-20T10:50:00Z'
  },
  {
    id: generateId(),
    foreign: 'Good night',
    translation: 'Спокойной ночи',
    category: 'greetings',
    createdAt: '2026-01-20T10:55:00Z'
  },
  {
    id: generateId(),
    foreign: 'Yes',
    translation: 'Да',
    category: 'basic',
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: generateId(),
    foreign: 'No',
    translation: 'Нет',
    category: 'basic',
    createdAt: '2026-01-20T11:05:00Z'
  },
  {
    id: generateId(),
    foreign: 'Sorry',
    translation: 'Извините',
    category: 'polite',
    createdAt: '2026-01-20T11:10:00Z'
  },
  {
    id: generateId(),
    foreign: 'Help',
    translation: 'Помощь',
    category: 'basic',
    createdAt: '2026-01-20T11:15:00Z'
  },
  {
    id: generateId(),
    foreign: 'Time',
    translation: 'Время',
    category: 'basic',
    createdAt: '2026-01-20T11:20:00Z'
  },
  {
    id: generateId(),
    foreign: 'Today',
    translation: 'Сегодня',
    category: 'time',
    createdAt: '2026-01-20T11:25:00Z'
  },
  {
    id: generateId(),
    foreign: 'Tomorrow',
    translation: 'Завтра',
    category: 'time',
    createdAt: '2026-01-20T11:30:00Z'
  },
  {
    id: generateId(),
    foreign: 'Yesterday',
    translation: 'Вчера',
    category: 'time',
    createdAt: '2026-01-20T11:35:00Z'
  }
];

export function getDefaultWords() {
  return [...sampleWords];
}

export function loadSampleWords() {
  return getDefaultWords();
}
