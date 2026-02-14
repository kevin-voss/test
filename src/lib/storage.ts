import { Todo, TodoListMeta } from "@/types/todo"

const STORAGE_KEY = "react-todo-data"
const LEGACY_STORAGE_KEY = "react-todo-todos"

export interface StoredData {
  lists: TodoListMeta[]
  todosByListId: Record<string, Todo[]>
}

function migrateTodo(t: Record<string, unknown>): Todo {
  const createdAt = t.createdAt
    ? new Date(t.createdAt as string)
    : new Date()
  const priority = (t.priority as Todo["priority"]) ?? "medium"
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

function migrateListMeta(l: Record<string, unknown>): TodoListMeta {
  return {
    id: l.id as string,
    name: l.name as string,
    createdAt: l.createdAt ? new Date(l.createdAt as string) : new Date(),
  }
}

function loadLegacyTodos(): Todo[] | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>[]
    return parsed.map(migrateTodo)
  } catch {
    return null
  }
}

export function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as {
        lists: Record<string, unknown>[]
        todosByListId: Record<string, Record<string, unknown>[]>
      }
      const lists = (parsed.lists ?? []).map(migrateListMeta)
      const todosByListId: Record<string, Todo[]> = {}
      for (const [listId, todos] of Object.entries(parsed.todosByListId ?? {})) {
        todosByListId[listId] = (todos ?? []).map(migrateTodo)
      }
      return { lists, todosByListId }
    }
  } catch {
    // fall through to migration or default
  }

  const legacyTodos = loadLegacyTodos()
  if (legacyTodos && legacyTodos.length > 0) {
    const defaultList: TodoListMeta = {
      id: crypto.randomUUID(),
      name: "My Todos",
      createdAt: new Date(),
    }
    return {
      lists: [defaultList],
      todosByListId: { [defaultList.id]: legacyTodos },
    }
  }

  return { lists: [], todosByListId: {} }
}

export function saveData(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  }
}
