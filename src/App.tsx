import { useState, useEffect } from "react"
import { TodoForm } from "@/components/TodoForm"
import { TodoItem } from "@/components/TodoItem"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

const STORAGE_KEY = "todo-app-todos"

function generateId() {
  return crypto.randomUUID?.() ?? `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Todo[]
      return Array.isArray(parsed) ? parsed : []
    }
  } catch {
    // ignore
  }
  return []
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

type Filter = "all" | "active" | "completed"

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

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

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ]

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
          {todos.length > 0 && (
            <div className="mt-4 flex gap-2">
              {filters.map((f) => (
                <Button
                  key={f.value}
                  variant={filter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f.value)}
                  className={cn(filter === f.value && "shadow-sm")}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          )}
          <ul className="mt-6 space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
          {filteredTodos.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-400">
              {todos.length === 0
                ? "No tasks yet. Add one above!"
                : `No ${filter} tasks.`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
