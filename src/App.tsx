import { useState, useEffect, useMemo } from "react"
import { Todo, Filter, SortOption, Priority } from "@/types/todo"
import { TodoForm } from "@/components/TodoForm"
import { TodoList } from "@/components/TodoList"
import { FilterBar } from "@/components/FilterBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "react-todo-todos"

const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
}

function migrateTodo(t: Record<string, unknown>): Todo {
  const createdAt = t.createdAt
    ? new Date(t.createdAt as string)
    : new Date()
  const priority = (t.priority as Priority) ?? "medium"
  const tags = Array.isArray(t.tags) ? (t.tags as string[]) : []
  const dueDate = t.dueDate ? new Date(t.dueDate as string) : null
  return {
    id: t.id as string,
    text: t.text as string,
    completed: Boolean(t.completed),
    createdAt,
    priority,
    tags,
    dueDate,
  }
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Record<string, unknown>[]
    return parsed.map(migrateTodo)
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
  const [sort, setSort] = useState<SortOption>("created-desc")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterTag, setFilterTag] = useState<string>("")

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const availableTags = useMemo(() => {
    const set = new Set<string>()
    todos.forEach((t) => t.tags.forEach((tag) => set.add(tag)))
    return Array.from(set).sort()
  }, [todos])

  const filteredAndSortedTodos = useMemo(() => {
    let result = todos

    switch (filter) {
      case "active":
        result = result.filter((t) => !t.completed)
        break
      case "completed":
        result = result.filter((t) => t.completed)
        break
    }

    if (filterPriority !== "all") {
      result = result.filter((t) => t.priority === filterPriority)
    }

    if (filterTag) {
      result = result.filter((t) => t.tags.includes(filterTag))
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "created-asc":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "created-desc":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "priority-desc":
          return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
        case "priority-asc":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        case "due-asc": {
          const aTime = a.dueDate?.getTime() ?? Infinity
          const bTime = b.dueDate?.getTime() ?? Infinity
          return aTime - bTime
        }
        case "due-desc": {
          const aTime = a.dueDate?.getTime() ?? -Infinity
          const bTime = b.dueDate?.getTime() ?? -Infinity
          return bTime - aTime
        }
        case "text-asc":
          return a.text.localeCompare(b.text)
        case "text-desc":
          return b.text.localeCompare(a.text)
        default:
          return 0
      }
    })

    return result
  }, [todos, filter, sort, filterPriority, filterTag])

  const handleAdd = (
    text: string,
    priority: Priority,
    tags: string[],
    dueDate: Date | null
  ) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      tags,
      dueDate,
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
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              sort={sort}
              onSortChange={setSort}
              filterPriority={filterPriority}
              onFilterPriorityChange={setFilterPriority}
              filterTag={filterTag}
              onFilterTagChange={setFilterTag}
              availableTags={availableTags}
            />
            <TodoList
              todos={filteredAndSortedTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
