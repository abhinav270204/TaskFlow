# React To-Do App

A simple and elegant To-Do application built with React, Vite, and Tailwind CSS.

## Features

- ✅ Add new tasks
- ✏️ Edit existing tasks
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 💾 Local storage persistence
- 📱 Responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- UUID (unique identifiers)

## Project Structure

```
src/
├── components/
│   ├── TodoApp.jsx     # Main todo application component
│   └── TodoItem.jsx    # Individual todo item component
├── App.jsx             # Root application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```