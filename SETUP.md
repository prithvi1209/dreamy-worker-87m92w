# FlashGenius Setup Guide for React Sandbox

This guide will help you set up FlashGenius in any React TypeScript sandbox environment (CodeSandbox, StackBlitz, etc.).

## 📦 Quick Setup

### Option 1: Direct File Upload

1. **Create a new React TypeScript project** in your sandbox
2. **Upload all files** maintaining the directory structure:
   ```
   /
   ├── public/
   │   └── index.html
   ├── src/ (or root, depending on sandbox)
   │   ├── components/
   │   ├── styles/
   │   ├── types/
   │   ├── utils/
   │   ├── App.tsx
   │   └── index.tsx
   ├── package.json
   ├── tsconfig.json
   └── README.md
   ```

3. **Install dependencies**: The sandbox should auto-install from package.json
4. **Run the project**: Click "Run" or start the dev server

### Option 2: Manual Setup

If you need to set up manually:

1. Create new React TypeScript sandbox
2. Replace `package.json` with provided version
3. Copy all files from each directory
4. Ensure Puter.js script is in `public/index.html`
5. Run: `npm install`
6. Start development server

## 🔧 Sandbox-Specific Instructions

### CodeSandbox

1. Go to [codesandbox.io](https://codesandbox.io)
2. Click "Create Sandbox"
3. Select "React TypeScript" template
4. Upload files via:
   - File menu → Upload Files
   - Drag and drop into file explorer
5. Dependencies install automatically
6. Click "Open Preview" to view

**File Structure in CodeSandbox:**
```
/
├── public/
│   └── index.html (with Puter.js script)
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── components/
    ├── styles/
    ├── types/
    └── utils/
```

### StackBlitz

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click "New Project" → React TypeScript
3. Use the file explorer to create directories
4. Paste file contents one by one
5. StackBlitz auto-installs dependencies
6. Preview opens automatically

**Note**: StackBlitz uses Vite, so ensure imports are correct.

### CodePen (Limited)

CodePen doesn't support full React projects well. Use CodeSandbox or StackBlitz instead.

## 📝 File Checklist

Before running, ensure you have:

- [ ] `public/index.html` with Puter.js CDN script
- [ ] `src/App.tsx` - Main app component
- [ ] `src/index.tsx` - React entry point
- [ ] `src/types/index.ts` - TypeScript definitions
- [ ] `src/components/` directory with all 6 components
- [ ] `src/styles/` directory with all 7 CSS files
- [ ] `src/utils/` directory with 2 utility files
- [ ] `package.json` with dependencies
- [ ] `tsconfig.json` for TypeScript config

## 🎯 Key Dependencies

These should be in your `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "jspdf": "^2.5.1"
  }
}
```

## 🔗 Puter.js Integration

The most critical part is the Puter.js script in `public/index.html`:

```html
<script src="https://js.puter.com/v2/"></script>
```

**Verify it's loaded:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type `window.puter` and press Enter
4. Should see an object, not `undefined`

## 🚀 First Run

After setup:

1. **Check for errors** in browser console
2. **Sign in** using the modal (test email/phone)
3. **Generate cards** with sample notes:
   ```
   Photosynthesis is the process by which plants convert light energy into chemical energy. 
   It occurs in chloroplasts and requires carbon dioxide, water, and sunlight. 
   The products are glucose and oxygen.
   ```
4. **Save collection** with any name
5. **View dashboard** to see your saved collection
6. **Study cards** using the viewer

## ⚠️ Common Issues

### Issue: "window.puter is undefined"
**Solution**: 
- Ensure Puter.js script is in `<head>` of index.html
- Check browser console for script loading errors
- Verify internet connection

### Issue: TypeScript errors
**Solution**:
- Ensure `tsconfig.json` is present
- Check all imports use correct paths
- Verify all files are in correct directories

### Issue: CSS not loading
**Solution**:
- Check import statements in components
- Ensure all CSS files are in `styles/` directory
- Verify file names match exactly (case-sensitive)

### Issue: "Module not found: jspdf"
**Solution**:
```bash
npm install jspdf
```
Or add to dependencies and let sandbox auto-install.

### Issue: White screen / App not rendering
**Solution**:
- Check browser console for errors
- Verify `index.tsx` renders App component
- Check `public/index.html` has `<div id="root"></div>`
- Ensure all component exports/imports are correct

## 🧪 Testing the AI

To test AI generation without notes:

1. Use the manual card add feature first
2. For AI testing, use clear, structured notes
3. Start with 5-10 cards to test quickly
4. Check generated cards for quality

**Sample Test Notes:**
```
React Hooks

useState: Manages state in functional components
useEffect: Handles side effects and lifecycle
useContext: Accesses context values
useReducer: Complex state management
useMemo: Memoizes expensive calculations
useCallback: Memoizes callback functions
```

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Features requiring modern browsers:**
- CSS Grid and Flexbox
- CSS Custom Properties
- Local Storage API
- ES2020 JavaScript features

## 💾 Data Persistence

Data is stored in browser's Local Storage:
- Collections: `flashcard_collections`
- User info: `flashcard_user`

**To reset data:**
```javascript
// In browser console:
localStorage.removeItem('flashcard_collections');
localStorage.removeItem('flashcard_user');
location.reload();
```

## 🎨 Customization Tips

### Change Theme Colors
Edit `src/styles/App.css`:
```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
}
```

### Adjust AI Model
Edit `src/utils/aiService.ts`:
```typescript
model: 'claude-sonnet-4-20250514' // Change model here
```

### Modify Card Layouts
Edit component CSS files in `src/styles/`

## 📊 Performance Tips

1. **Limit initial cards**: Start with 10-15 cards for testing
2. **Optimize images**: If adding images later, compress them
3. **Clear old data**: Remove test collections regularly
4. **Use production build**: For deployment, run `npm run build`

## 🔐 Security Notes

- No sensitive data is sent to servers
- Puter.js only receives note text for AI generation
- User credentials stored locally only
- No cookies or tracking

## 📚 Additional Resources

- [Puter.js Documentation](https://docs.puter.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

## 🆘 Getting Help

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify file structure** matches the checklist
3. **Test in incognito mode** to rule out extensions
4. **Try different browser** to isolate browser-specific issues
5. **Check Puter.js status** at [status.puter.com](https://status.puter.com)

## ✅ Final Checklist

Before considering setup complete:

- [ ] All files uploaded and in correct locations
- [ ] Dependencies installed (check package.json)
- [ ] No errors in browser console
- [ ] Puter.js script loads successfully
- [ ] Can navigate between views (Dashboard, Generator)
- [ ] Can sign in successfully
- [ ] Can generate cards with AI
- [ ] Can save and view collections
- [ ] Can export as text and PDF
- [ ] Responsive design works on mobile

## 🎉 Success!

If all checks pass, your FlashGenius setup is complete! 

Start creating amazing flashcards and happy studying! 🎴✨

---

**Need more help?** Check README.md for detailed usage instructions.