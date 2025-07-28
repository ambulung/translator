# Universal Translator

A modern, real-time translation web application built with React and TypeScript. This application allows you to translate text between multiple languages with automatic language detection.

## Features

- 🌍 **Multi-language Support**: Translate between 20+ languages
- 🔍 **Auto Language Detection**: Automatically detect the source language
- ⚡ **Real-time Translation**: Instant translation as you type
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Works perfectly on all devices
- 🔄 **Language Swap**: Easily swap between source and target languages
- 🧹 **Clear Functionality**: Clear all text with one click

## Supported Languages

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Chinese
- Arabic
- Hindi
- Turkish
- Dutch
- Polish
- Swedish
- Danish
- Norwegian
- Finnish

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd translator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Running with Proxy Server (Optional)

For enhanced reliability, you can run both the frontend and the proxy server:

```bash
npm run dev:full
```

This will start:
- Frontend on `http://localhost:3000`
- Proxy server on `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## Usage

1. **Select Languages**: Choose your source and target languages from the dropdown menus
2. **Enter Text**: Type or paste the text you want to translate in the left text area
3. **Auto Translation**: The translation will appear automatically in the right text area
4. **Manual Translation**: Click the "Translate" button for manual translation
5. **Swap Languages**: Use the swap button to quickly switch between languages
6. **Clear Text**: Click "Clear all text" to reset both text areas

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful icons
- **MyMemory Translation API**: Free translation service with no CORS issues
- **Express.js**: Local proxy server for fallback translation requests

## API

This application uses the MyMemory Translation API, which is a free translation service with no CORS restrictions. The API provides:

- High-quality translations
- Language detection
- Support for multiple languages
- No API key required for basic usage
- No CORS issues

### Fallback Proxy Server

The application also includes a local Express.js proxy server that can handle translation requests if the direct API fails. This provides:

- CORS-free translation requests
- Reliable fallback service
- Better error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LibreTranslate for providing the translation API
- Lucide for the beautiful icons
- Vite team for the excellent build tool 