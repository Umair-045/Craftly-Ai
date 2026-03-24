# 🎨 Craftly AI - Turn Waste into Wonder

An AI-powered mobile app that helps you create amazing DIY crafts from household waste and recyclable materials.

![Craftly AI](https://img.shields.io/badge/React-18.2.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📸 **Image Upload**: Take photos or upload images of materials
- 🤖 **AI Detection**: Automatically identifies craft materials
- ✏️ **Manual Editing**: Add or remove detected materials
- 🎯 **Personalization**: Choose skill level, time, and purpose
- 💡 **Smart Suggestions**: Get 3-5 unique craft ideas
- 📝 **Step-by-Step**: Easy-to-follow instructions
- ❤️ **Save Favorites**: Bookmark your favorite crafts
- 🌱 **Eco-Friendly**: Promotes recycling and sustainability

## 🚀 Quick Start (Windows)

### Prerequisites

Make sure you have **Node.js** installed:
1. Download from https://nodejs.org (LTS version)
2. Run the installer
3. Restart your computer

### Installation

1. **Extract the folder** to your Desktop
2. **Open Command Prompt** (Windows + R, type `cmd`, press Enter)
3. **Navigate to the folder**:
   ```bash
   cd Desktop\craftly-ai-complete
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
   (Wait 2-5 minutes for installation to complete)

5. **Start the app**:
   ```bash
   npm start
   ```

6. **Open your browser** to http://localhost:3000

That's it! 🎉

## 📁 Project Structure

```
craftly-ai-complete/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.jsx             # Main application component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.

## 🌐 Deployment

### Deploy to Vercel (Free)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   vercel
   ```

3. Follow the prompts and get your live URL!

### Deploy to Netlify (Free)

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag and drop the `build` folder to https://app.netlify.com/drop

## 🔑 API Configuration

This app uses **Anthropic Claude API** for AI features. The API key is already included for testing, but for production:

1. Get your own API key from https://console.anthropic.com
2. Replace the API key in `src/App.jsx` (search for `x-api-key`)

### Free Alternatives

- **Google Gemini**: https://ai.google.dev (Free tier)
- **Hugging Face**: https://huggingface.co/inference-api (Free tier)
- **OpenAI**: https://platform.openai.com ($5 free credit)

## 🎯 How to Use

1. **Start Creating**: Click "Start Creating" on the welcome screen
2. **Upload Images**: Take photos or upload images of materials (max 5)
3. **Detect Materials**: AI will identify recyclable materials
4. **Review & Edit**: Confirm or modify detected materials
5. **Set Preferences**: Choose skill level, time, purpose, and tools
6. **Generate Ideas**: Get AI-powered craft suggestions
7. **View Details**: See step-by-step instructions for each craft
8. **Save Favorites**: Bookmark crafts you want to try later

## 🎨 Customization

### Change Colors

Edit the CSS variables in `src/App.jsx` to change the color scheme:
- Primary: `#3CCFCF` (Teal)
- Secondary: `#FF6F61` (Coral)
- Accent: `#FFD84D` (Yellow)

### Add More Preferences

Modify the `preferences` state in `src/App.jsx` to add more options like:
- Difficulty levels
- Age groups
- Craft categories

## 🐛 Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Solution: Reinstall Node.js and restart your computer

### Port 3000 already in use
- Another app is using port 3000
- Solution: Close other apps or run on different port:
  ```bash
  set PORT=3001 && npm start
  ```

### Module not found errors
- Dependencies not installed properly
- Solution: Delete `node_modules` and run `npm install` again

### API errors
- Check your internet connection
- Verify API key is valid
- Check API credits/quota

## 📱 Mobile Responsive

The app is fully responsive and works great on:
- 📱 Mobile phones (iOS & Android)
- 📱 Tablets
- 💻 Desktop browsers

## 🤝 Contributing

This is a hackathon project! Feel free to:
- Fork the repository
- Create new features
- Fix bugs
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for hackathon submission.

## 🙏 Acknowledgments

- Anthropic Claude API for AI capabilities
- Lucide React for beautiful icons
- React team for the amazing framework

## 📧 Support

If you have any questions or issues:
1. Check the Troubleshooting section
2. Review the code comments
3. Test with different materials and images

---

**Happy Crafting! ♻️✨**

Made with ❤️ for the environment and creativity
