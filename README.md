# Translator

A simple web translator that works in your browser.

## What it does

- Translates text between 20+ languages
- Auto-detects language (works well with Japanese, Chinese, Korean, etc.)
- Real-time translation as you type
- Copy translated text to clipboard

## Run it

```bash
npm install
npm run dev:full
```

This starts both the frontend (port 3000) and backend proxy (port 3001).

## How it works

Uses MyMemory Translation API with a local Express proxy to avoid CORS issues. Has custom language detection that prioritizes Japanese hiragana/katakana over Chinese characters.

## Tech

- React 18 + TypeScript
- Vite for building
- Express.js proxy server
- MyMemory Translation API 