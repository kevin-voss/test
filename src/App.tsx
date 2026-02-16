import { useState } from "react"
import { TodoForm } from "@/components/TodoForm"
import { TodoItem } from "@/components/TodoItem"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

function generateId() {
  return crypto.randomUUID?.() ?? `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    if (!text.trim()) return
    setTodos((prev) => [
      ...prev,
      { id: generateId(), text: text.trim(), completed: false },
    ])
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-xl px-4 py-16">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">
            Todo
          </h1>
          <p className="mt-2 text-slate-500">
            A simple task list to keep you organized
          </p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
          <TodoForm onAdd={addTodo} />
          <ul className="mt-6 space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
          {todos.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-400">
              No tasks yet. Add one above!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
