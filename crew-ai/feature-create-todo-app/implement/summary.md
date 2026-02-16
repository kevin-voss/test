# Todo App Implementation Summary

## Overview

A simple, modern todo application built with React, Vite, TypeScript, and Tailwind CSS. The app provides core todo functionality with a clean, responsive UI.

## Tech Stack

- **React 18** – UI framework
- **Vite 5** – Build tool and dev server
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Radix UI** – Accessible checkbox component
- **Lucide React** – Icons (Plus, Trash2)

## Project Structure

```
src/
├── App.tsx              # Main app with state, filters, persistence
├── main.tsx             # Entry point
├── index.css            # Global styles, Tailwind
├── components/
│   ├── TodoForm.tsx     # Add new todo input + submit
│   ├── TodoItem.tsx     # Single todo row (checkbox, text, delete)
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── checkbox.tsx
└── lib/
    └── utils.ts         # cn() for class merging
```

## Features

1. **Add todos** – Enter text and submit to add a new task
2. **Toggle completion** – Click checkbox to mark tasks complete/incomplete
3. **Delete todos** – Remove tasks with the trash icon
4. **Filter view** – Switch between All, Active, and Completed
5. **Persistence** – Todos are saved to `localStorage` and restored on reload

## Data Model

```typescript
interface Todo {
  id: string
  text: string
  completed: boolean
}
```

IDs are generated with `crypto.randomUUID()` (with fallback for older environments).

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm test` – Run Vitest

## Design

- Gradient background (slate-50 to slate-100)
- Centered card layout with shadow
- Hover states on todo items and buttons
- Strikethrough for completed tasks
- Responsive layout (max-width 36rem)
