export type Priority = "low" | "medium" | "high" | "urgent"

export interface TodoListMeta {
  id: string
  name: string
  createdAt: Date
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  priority: Priority
  tags: string[]
  dueDate: Date | null
}

export type Filter = "all" | "active" | "completed"

export type SortOption =
  | "created-asc"
  | "created-desc"
  | "priority-desc"
  | "priority-asc"
  | "due-asc"
  | "due-desc"
  | "text-asc"
  | "text-desc"
