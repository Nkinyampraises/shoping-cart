# Shooping Todo Web App

A well-structured, modern React todo app with localStorage persistence, dark mode, and UI sections (home/todo/about).

## 🚀 Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm start
```

3. Open in browser:

- `http://localhost:3000`

## 🧩 Project structure

- `public/index.html` – root HTML
- `src/index.js` – React root + CSS imports
- `src/index.css` – global reset and vars
- `src/App.js` – main page + todo behavior
- `src/App.css` – all app styling

## ✅ Features

- add / edit / delete tasks
- mark tasks done/undone
- filter all/todo/done
- clear all with confirmation
- localStorage persistence
- theme toggle (light/dark)
- smooth one-page sections: Home, Todo, About

## 💡 Usage notes

- type task text and press Enter or Add
- click edit to modify an item
- checkbox toggles done state
- can clear all tasks

## 🛠️ Deployment

Build for production:

```bash
npm run build
```

Serve with any static file server (e.g. `serve` or GitHub Pages).

## 📂 File paths

- `src/App.js`: component logic and page layout
- `src/App.css`: structured style rules with responsive design
- `src/index.css`: base styles and theme hooks

## 🧹 Git

Keep commits small & descriptive, e.g. `git commit -m "add todo app and style"`.

