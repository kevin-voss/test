import { Todo, TodoListMeta } from "@/types/todo"
import { ShoppingItem } from "@/types/shopping"

const STORAGE_KEY = "react-todo-data"
const LEGACY_STORAGE_KEY = "react-todo-todos"

export interface StoredData {
  lists: TodoListMeta[]
  todosByListId: Record<string, Todo[]>
  shoppingItems: ShoppingItem[]
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

function migrateShoppingItem(s: Record<string, unknown>): ShoppingItem {
  const category = (s.category as ShoppingItem["category"]) ?? "sonstiges"
  return {
    id: s.id as string,
    text: s.text as string,
    completed: Boolean(s.completed),
    createdAt: s.createdAt ? new Date(s.createdAt as string) : new Date(),
    category: category,
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
        shoppingItems?: Record<string, unknown>[]
      }
      const lists = (parsed.lists ?? []).map(migrateListMeta)
      const todosByListId: Record<string, Todo[]> = {}
      for (const [listId, todos] of Object.entries(parsed.todosByListId ?? {})) {
        todosByListId[listId] = (todos ?? []).map(migrateTodo)
      }
      const rawItems = parsed.shoppingItems ?? []
      const shoppingItems = Array.isArray(rawItems)
        ? rawItems.map((s) => migrateShoppingItem(s as Record<string, unknown>))
        : []
      return { lists, todosByListId, shoppingItems }
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
      shoppingItems: [],
    }
  }

  return { lists: [], todosByListId: {}, shoppingItems: [] }
}

export function saveData(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  }
}
