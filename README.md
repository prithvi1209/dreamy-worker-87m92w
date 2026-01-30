# FlashGenius - AI-Powered Flashcard Generator 🎴✨

Transform your notes into powerful, customizable flashcards using AI. FlashGenius leverages **Puter.js** with **Claude Sonnet 4** to intelligently analyze your notes and generate high-quality study materials.

![FlashGenius Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=FlashGenius+-+Master+Anything,+One+Card+at+a+Time)

## ✨ Features

### 🤖 AI-Powered Generation
- **Smart Analysis**: AI parses your notes and extracts key concepts
- **Multiple Card Types**: 
  - Basic Concept Cards
  - Application-Based Questions
  - Quiz-Style Cards
  - Multiple Choice Questions (MCQ)
  - Fill-in-the-Blank Cards
- **Customizable Difficulty**: Easy, Medium, Hard, or Mixed

### 📝 Manual Creation
- Add custom flashcards manually
- Mix AI-generated and manual cards
- Full control over content

### 🎨 Beautiful UI
- Modern, aesthetic design with gradient accents
- Dark theme optimized for extended study sessions
- Responsive layout for all devices
- Smooth animations and transitions

### 📚 Smart Organization
- Create named collections
- Add descriptions and tags
- Folder-based categorization
- Search and filter capabilities

### ⏰ Spaced Repetition
- Customizable revision schedules (1, 3, 5, 7, or 14 days)
- Email and SMS notifications
- Automatic locking system for missed reviews
- Progress tracking

### 📥 Export Options
- **Text Export**: Plain text format for easy sharing
- **PDF Export**: Beautifully formatted slide-view PDFs
- Download and share your flashcards

### 🔐 User Profiles
- Secure local storage
- Personal dashboard
- Track your collections and progress
- Customizable notification preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

4. **Open in browser**:
Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Sign In
- Click "Sign In" in the sidebar
- Enter your email and phone number
- These are used for revision reminders

### 2. Generate Flashcards

#### Using AI (Recommended)
1. Click "Generate Cards" in the sidebar
2. Paste your notes in the text area
3. Select card types you want:
   - ✅ Basic Concepts
   - ✅ Application Questions
   - ✅ Quiz Style
   - ✅ Multiple Choice
   - ✅ Fill in the Blanks
4. Choose number of cards and difficulty
5. Click "Generate Flashcards"
6. Review generated cards and remove any you don't need

#### Manual Creation
1. Click "Add Card Manually"
2. Select card type
3. Enter front (question) and back (answer)
4. Click "Add Card"

### 3. Save Collection
1. Give your collection a name
2. Add an optional description
3. Set revision schedule:
   - Daily
   - Every 3 days
   - Every 5 days
   - Weekly
   - Bi-weekly
4. Click "Save Collection"

### 4. Study Your Cards
1. Go to Dashboard
2. Click "Study" on any collection
3. Use Study Mode:
   - Click card to flip
   - Use Previous/Next buttons
   - Mark cards as "Mastered"
4. Or use Grid View to see all cards at once

### 5. Export Your Work
- Click "Export as Text" for plain text
- Click "Export as PDF" for formatted slides

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **CSS3** with custom properties and animations
- Responsive design with CSS Grid and Flexbox

### AI Integration
- **Puter.js** - Cloud platform for AI capabilities
- **Claude Sonnet 4** - Advanced language model for flashcard generation
- No API keys required from users!

### Additional Libraries
- **jsPDF** - PDF generation and export
- Local Storage API - Data persistence

## 🎨 Design Philosophy

FlashGenius features a distinctive dark theme with:
- **Fonts**: 
  - Crimson Pro (Display)
  - DM Sans (Body)
  - Space Mono (Monospace)
- **Color Palette**:
  - Primary: Indigo/Purple gradient
  - Accents: Amber, Cyan, Pink
  - Dark backgrounds with subtle glows
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Emphasis on readability with HTML formatting support

## 📁 Project Structure

```
flashgenius/
├── public/
│   └── index.html          # HTML entry point with Puter.js
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx           # Sign-in modal
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── FlashcardGenerator.tsx  # Card generation
│   │   ├── FlashcardViewer.tsx     # Study interface
│   │   ├── ProfileSettings.tsx     # User settings
│   │   └── Sidebar.tsx             # Navigation sidebar
│   ├── styles/
│   │   ├── App.css                 # Global styles
│   │   ├── AuthModal.css
│   │   ├── Dashboard.css
│   │   ├── FlashcardGenerator.css
│   │   ├── FlashcardViewer.css
│   │   ├── ProfileSettings.css
│   │   └── Sidebar.css
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── utils/
│   │   ├── aiService.ts           # Puter.js AI integration
│   │   └── pdfExport.ts           # PDF generation
│   ├── App.tsx                    # Main app component
│   └── index.tsx                  # React entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Key Features Explained

### Smart Text Parsing
The AI analyzes your notes and:
- Identifies key concepts and definitions
- Extracts important relationships
- Generates contextual questions
- Formats content with emphasis tags

### HTML Formatting in Cards
Cards support rich formatting:
- `<strong>` for topics and titles (bold)
- `<mark>` for important concepts (highlighted)
- `<em>` for subtle emphasis (italic)

### Revision System
- Collections have scheduled review dates
- Notifications sent via email/SMS when due
- If not reviewed within 24 hours of due date:
  - Collection is locked for 1 day
  - Warning displayed to user
  - Data is NOT lost, just temporarily inaccessible

### Mastery Tracking
- Mark individual cards as "Mastered"
- Track progress within each session
- Complete review updates schedule automatically

## 🔒 Data & Privacy

- **Local Storage**: All data stored on your device
- **No Backend**: No server-side data storage
- **Puter.js**: Only used for AI generation, no data retention
- **Privacy First**: Your notes and flashcards stay with you

## 🎓 Best Practices

### For Effective Flashcards
1. **Keep questions specific** - One concept per card
2. **Use your own words** - Better retention
3. **Include context** - Why, not just what
4. **Mix card types** - Engage different recall methods
5. **Review regularly** - Stick to the schedule

### For Better AI Results
1. **Provide structured notes** - Paragraphs or bullet points
2. **Include definitions and examples** - More context = better cards
3. **Remove irrelevant content** - Focus on key material
4. **Use clear language** - AI works better with well-written text

## 🛠️ Customization

### Changing Colors
Edit CSS variables in `styles/App.css`:
```css
:root {
  --primary: #6366f1;      /* Main color */
  --secondary: #f59e0b;    /* Accent color */
  --bg-primary: #0f0f23;   /* Background */
  /* ... more variables */
}
```

### Adjusting AI Behavior
Modify the prompt in `utils/aiService.ts` to change how the AI generates flashcards.

## 🐛 Troubleshooting

### AI Generation Fails
- Ensure internet connection is active
- Check browser console for errors
- Verify Puter.js script is loaded (check Network tab)
- Try with shorter notes (under 2000 words)

### PDF Export Not Working
- Ensure jsPDF is installed: `npm install jspdf`
- Check browser allows downloads
- Try exporting as text instead

### Cards Not Saving
- Check browser's local storage isn't full
- Ensure you're signed in
- Try a different browser

## 📝 Future Enhancements

Potential features for future versions:
- Cloud sync across devices
- Collaborative collections
- Voice recording for pronunciations
- Image support in flashcards
- Gamification and achievements
- Advanced analytics and insights
- Mobile native apps

## 🤝 Contributing

This is a demo project showcasing Puter.js integration with React. Feel free to:
- Fork and modify for your needs
- Report bugs or suggest features
- Improve the AI prompts
- Enhance the UI/UX

## 📄 License

This project is provided as-is for educational and personal use.

## 🙏 Acknowledgments

- **Puter.js** - For providing seamless AI integration
- **Anthropic Claude** - For powering the AI generation
- **React Team** - For the amazing framework
- **jsPDF** - For PDF export capabilities

## 📧 Support

For questions or issues:
1. Check this README thoroughly
2. Review the code comments
3. Test in a clean browser environment
4. Check Puter.js documentation at [puter.com](https://puter.com)

---

**Made with ❤️ and ☕ for students everywhere**

*Master anything, one card at a time* 🎴✨