import { useState, useEffect, useMemo } from "react"
import { Todo, Filter } from "@/types/todo"
import { TodoForm } from "@/components/TodoForm"
import { TodoList } from "@/components/TodoList"
import { FilterBar } from "@/components/FilterBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "react-todo-todos"

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.map((t: { id: string; text: string; completed: boolean; createdAt: string }) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }))
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed)
      case "completed":
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const handleAdd = (text: string) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setTodos((prev) => [...prev, todo])
  }

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Todo App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TodoForm onAdd={handleAdd} />
            <FilterBar filter={filter} onFilterChange={setFilter} />
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
