import { useState, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { useTodoLists } from "@/contexts/TodoListsContext"
import { Filter, SortOption, Priority } from "@/types/todo"
import { TodoForm } from "@/components/TodoForm"
import { TodoList } from "@/components/TodoList"
import { FilterBar } from "@/components/FilterBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
}

export function TodoListDetail() {
  const { listId } = useParams<{ listId: string }>()
  const {
    lists,
    getTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoLists()

  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<SortOption>("created-desc")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterTag, setFilterTag] = useState<string>("")

  const list = lists.find((l) => l.id === listId)
  const todos = listId ? getTodos(listId) : []

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
    if (listId) {
      addTodo(listId, { text, completed: false, priority, tags, dueDate })
    }
  }

  const handleToggle = (id: string) => {
    if (listId) toggleTodo(listId, id)
  }

  const handleDelete = (id: string) => {
    if (listId) deleteTodo(listId, id)
  }

  if (!listId || !list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">List not found.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl flex-1">{list.name}</CardTitle>
            </div>
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
