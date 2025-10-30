# Text Formatter Component - Girish (Backend)

A modern, responsive text formatter component with three different formatting modes. Built with vanilla HTML, CSS, and JavaScript for optimal performance and compatibility.

## 🚀 Features

### Three Formatting Components

1. **Component 1 - Alphabetic Only**
   - Retains newline positions
   - Keeps only alphabetic characters (a-z, A-Z)
   - Compresses multiple spaces to single space
   - Removes special characters (.,*!?)

2. **Component 2 - Numbers Only**
   - Retains newline positions
   - Keeps only numeric terms (0-9)
   - Keeps +/- prefixed numbers (+5, -6, +12)

3. **Component 3 - Numeric with ***
   - Retains terms where * follows numeric terms (+6*, -7*)
   - Compresses multiple spaces to single space
   - Removes special characters except *

### 🎨 Modern UI Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Interactive Components** - Smooth hover effects and transitions
- **Real-time Statistics** - Character count, line count, word count
- **Toast Notifications** - User feedback for all actions
- **Keyboard Shortcuts** - Efficient workflow with hotkeys
- **Copy to Clipboard** - One-click result copying
- **Auto-save** - Automatic saving of work progress

### ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Format text
- `Ctrl/Cmd + K` - Clear all content
- `Ctrl/Cmd + C` - Copy result to clipboard
- `1-3` - Select formatting component

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/technicalresearchersclub/textformatter-girish.git
   cd textformatter-girish
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The application will automatically open at `http://localhost:3000/Girish_textformatter.html`

### Alternative Setup (No Node.js)

Simply open `Girish_textformatter.html` directly in your browser for immediate use.

## 📁 Project Structure

```
textformatter-girish/
├── Girish_textformatter.html      # Main HTML file
├── Girish_textformatter_style.css # Modern CSS styling
├── Girish_textformatter_script.js # JavaScript functionality
├── package.json                   # npm configuration
├── README.md                      # Project documentation
└── node_modules/                  # Dependencies
```

## 🎯 Usage

### Basic Usage

1. **Enter Text**: Type or paste your multi-line text in the input area
2. **Select Component**: Choose one of the three formatting components
3. **Format**: Click "Format Text" or use `Ctrl+Enter`
4. **Copy Result**: Use the "Copy Result" button or `Ctrl+C`

### Advanced Features

- **Drag & Drop**: Drop text files directly into the input area
- **Auto-save**: Your work is automatically saved every 30 seconds
- **History**: Previous formatting results are stored locally
- **Export**: Download formatted text as .txt files

## 🔧 Customization

### Theme Customization

The application supports light and dark themes. You can customize colors by modifying CSS variables in `Girish_textformatter_style.css`:

```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Adding New Components

To add a new formatting component:

1. Add a new case in the `formatText()` method
2. Create the formatting logic function
3. Update the component selection UI
4. Add corresponding CSS styles

## 🚀 Performance

- **Lightweight**: No external dependencies for core functionality
- **Fast**: Optimized JavaScript for quick text processing
- **Responsive**: Smooth animations and transitions
- **Accessible**: Screen reader friendly with proper ARIA labels

## 🤝 Contributing

We welcome contributions to improve the text formatter! Here's how you can contribute:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes across different browsers
- Update documentation if needed
- Ensure responsive design compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Girish** - *Backend Developer*
- GitHub: [@girish](https://github.com/girish)
- Technical Researchers Club

## 🙏 Acknowledgments

- Modern CSS techniques and best practices
- Vanilla JavaScript optimization
- Responsive design principles
- User experience best practices

## 📊 Project Stats

- **Lines of Code**: 1000+
- **Components**: 3 formatting modes
- **Features**: 15+ interactive elements
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS, Android

## 🔮 Future Enhancements

- [ ] Additional formatting components
- [ ] Batch processing capabilities
- [ ] API integration for cloud processing
- [ ] Advanced text analysis features
- [ ] Plugin system for custom formatters
- [ ] Real-time collaboration
- [ ] Advanced export formats (PDF, DOCX)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/technicalresearchersclub/textformatter-girish/issues) page
2. Create a new issue with detailed description
3. Contact the maintainer: [@girish](https://github.com/girish)

---

**Made with ❤️ by Girish for Technical Researchers Club**
