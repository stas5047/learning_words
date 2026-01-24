# Word Learning App - Frontend

A minimal, functional word learning application built with vanilla JavaScript and Tailwind CSS.

## Features

✨ **Fully Functional Interface** - Not just a mockup, but a working application!

### Word Management
- ➕ Add new words with foreign word and translation
- ✏️ Edit existing words
- 🗑️ Delete words with confirmation
- 🔍 Real-time search/filter
- 📁 Import word lists from text files
- 💾 Export words to text files
- 💾 Automatic save to browser localStorage

### Testing
- 🎯 **Multiple Choice Mode** - Select correct translation from 4 options
- ⌨️ **Text Input Mode** - Type the correct word yourself
- 📊 Real-time score tracking
- ✅ Instant feedback (correct/incorrect)
- 📈 Detailed results with review of mistakes
- 📚 Test history saved locally

### UI/UX
- 🌙 Dark mode toggle (saves preference)
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern, minimalist interface
- ⚡ Fast and smooth animations
- 💾 All data persists in browser

## Getting Started

### Quick Start

1. Simply open `index.html` in a modern web browser
2. No build tools or installation required!
3. The app will load with 20 sample English-Russian words

### Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## How to Use

### 1. Home Page
- View statistics (word count, tests taken, average score)
- Navigate to different sections

### 2. Manage Words
**Add Words:**
- Enter foreign word and translation
- Click "Add Word" or press Enter

**Search:**
- Type in the search box to filter words
- Searches both foreign words and translations

**Edit/Delete:**
- Click the edit (✏️) icon to modify a word
- Click the delete (🗑️) icon to remove a word

**Import from File:**
- Click "Import from File"
- Select a `.txt` file with format: `word - translation` (one per line)
- Example:
  ```
  Hello - Привет
  Goodbye - До свидания
  ```

**Export:**
- Click "Export Words" to download all words as a text file

### 3. Take Test
**Configure Test:**
- Choose test mode (Multiple Choice or Text Input)
- Select number of questions (5, 10, 20, or all words)
- Click "Start Test"

**During Test:**
- Answer each question
- Click "Next Question" to proceed
- See instant feedback for each answer
- Track your progress with the progress bar

**Results:**
- View your final score and statistics
- Review incorrect answers
- Take another test or return home

## Project Structure

```
frontend/
├── index.html              # Main HTML file (SPA entry point)
├── css/
│   └── styles.css          # Custom CSS styles
├── js/
│   ├── main.js             # Application bootstrap
│   ├── state.js            # State management
│   ├── router.js           # SPA routing
│   ├── theme.js            # Dark mode toggle
│   ├── utils.js            # Utility functions
│   ├── components/
│   │   ├── navbar.js       # Navigation component
│   │   ├── notification.js # Toast notifications
│   │   ├── modal.js        # Modal dialogs
│   │   └── wordCard.js     # Word list item
│   ├── modules/
│   │   ├── mockData.js     # Sample words
│   │   ├── wordManager.js  # CRUD operations
│   │   └── testEngine.js   # Test logic
│   └── pages/
│       ├── home.js         # Home page
│       ├── wordManagement.js  # Word management page
│       └── testing.js      # Testing page
└── README.md              # This file
```

## Technical Details

### Architecture
- **SPA (Single Page Application)** with hash-based routing
- **Component-based** structure with ES6 modules
- **State management** with observer pattern
- **LocalStorage** for data persistence

### Technologies
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with Tailwind CSS (via CDN)
- **Vanilla JavaScript (ES6+)** - No frameworks
- **LocalStorage API** - Data persistence

### Key Features
- No build process required
- No dependencies to install
- Works offline (after initial load)
- All data stored locally in browser
- Responsive and mobile-friendly

## Data Storage

All data is stored in the browser's `localStorage`:
- `wordApp_words` - Your word list
- `wordApp_theme` - Theme preference (light/dark)
- `wordApp_testHistory` - Test results history

**Note:** Clearing browser data will delete all words and history. Use the Export feature to backup your words!

## Customization

### Adding Your Own Words
The app comes with 20 sample English-Russian words. You can:
1. Delete all sample words (click "Clear All" in Word Management)
2. Add your own words manually
3. Import a word list from a text file

### Import File Format
Create a `.txt` file with one word pair per line:
```
foreign word - translation
another word - its translation
# This is a comment (will be ignored)

Empty lines are also ignored
```

## Tips
- Use keyboard shortcuts: Press Enter to submit forms
- The search is instant and searches both columns
- Test yourself regularly to improve retention
- Review incorrect answers after each test
- Export your words periodically as backup

## Future Enhancements

Possible features to add:
- Backend integration (user accounts, cloud sync)
- Statistics dashboard
- Spaced repetition algorithm
- Audio pronunciation
- Multiple word categories
- Flashcard mode
- Progress tracking over time

## Troubleshooting

**Words not saving?**
- Check if localStorage is enabled in your browser
- Try a different browser

**App not loading?**
- Make sure you're using a modern browser
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

**Import not working?**
- Check file format (must be .txt)
- Ensure format is: `word - translation`
- Use space-dash-space as separator

## Developer Notes

### Running Locally
1. Clone the repository
2. Open `frontend/index.html` in a browser
3. No build step needed!

### Debugging
Open browser console (F12) and use:
```javascript
// View current state
window.appState.getState()

// View words
window.appState.getState('words')

// Clear all data
localStorage.clear()
```

### Code Style
- ES6 modules for organization
- Functional programming patterns
- Event delegation for performance
- Semantic HTML and accessible markup
- Mobile-first responsive design

## License

This is a learning project. Feel free to use and modify as needed!

## Credits

Built with:
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Vanilla JavaScript - No frameworks needed!
- Love and dedication to learning 💙

---

**Happy Learning! 📚✨**
