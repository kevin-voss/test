# React Todo List

A simple, modern todo app built with **React**, **Vite**, and **shadcn/ui** components. Add, complete, filter, and delete todos with persistent localStorage storage.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Component Hierarchy](#component-hierarchy)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Development](#development)

---

## Overview

A React-based todo list application with a clean UI built using shadcn/ui components. The app supports adding, completing, filtering, and deleting todos with automatic persistence to localStorage.

---

## Features

- **Add todos** – Enter text and press the add button or submit
- **Toggle complete** – Mark todos as done or active via checkbox
- **Delete todos** – Remove todos with the trash button
- **Filter** – View All, Active, or Completed todos
- **Persistence** – Todos are saved to localStorage and restored on reload

---

## Tech Stack

- **React 18** – UI framework
- **Vite** – Build tool and dev server
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **shadcn/ui** – Button, Input, Card, Checkbox components (Radix UI primitives)
- **Lucide React** – Icons (Plus, Trash2, Check)

---

## Architecture

The application follows a layered architecture with unidirectional data flow:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  (App, TodoList, TodoItem, TodoForm, FilterBar components)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                    │
│                    (useState, useMemo)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data / Persistence                      │
│                    (localStorage)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── TodoForm      # Add new todos
├── FilterBar     # All / Active / Completed
└── TodoList
    └── TodoItem  # Single todo (checkbox, text, delete)
```

| Component   | Responsibility                                 |
|------------|-------------------------------------------------|
| **App**    | Root component; owns state, localStorage sync   |
| **TodoForm** | Input for new todos; submits on add            |
| **FilterBar** | Toggles filter: all / active / completed       |
| **TodoList** | Renders list of TodoItem components            |
| **TodoItem** | Single todo row; toggle complete, delete       |

---

## File Structure

```
src/
├── App.tsx                 # Root component, state & handlers
├── main.tsx                # Entry point
├── index.css               # Tailwind + CSS variables
├── lib/
│   └── utils.ts            # cn() utility for class merging
├── components/
│   ├── TodoForm.tsx        # Add todo input
│   ├── TodoList.tsx        # List container
│   ├── TodoItem.tsx        # Single todo row
│   ├── FilterBar.tsx       # Filter controls
│   └── ui/                 # shadcn components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── checkbox.tsx
└── types/
    └── todo.ts             # Todo, Filter interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Development

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Test

```bash
npm test
```

---

## Data Shape

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type Filter = 'all' | 'active' | 'completed';
```
