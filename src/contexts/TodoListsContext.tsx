import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { Todo, TodoListMeta } from "@/types/todo"
import { loadData, saveData, StoredData } from "@/lib/storage"

interface TodoListsContextValue {
  lists: TodoListMeta[]
  todosByListId: Record<string, Todo[]>
  addList: (name: string) => string
  deleteList: (id: string) => void
  updateListName: (id: string, name: string) => void
  getTodos: (listId: string) => Todo[]
  addTodo: (listId: string, todo: Omit<Todo, "id" | "createdAt">) => void
  toggleTodo: (listId: string, todoId: string) => void
  deleteTodo: (listId: string, todoId: string) => void
  updateTodos: (listId: string, todos: Todo[]) => void
}

const TodoListsContext = createContext<TodoListsContextValue | null>(null)

export function TodoListsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const addList = useCallback((name: string) => {
    const id = crypto.randomUUID()
    const meta: TodoListMeta = {
      id,
      name: name.trim() || "Untitled List",
      createdAt: new Date(),
    }
    setData((prev) => ({
      lists: [...prev.lists, meta],
      todosByListId: { ...prev.todosByListId, [id]: [] },
    }))
    return id
  }, [])

  const deleteList = useCallback((id: string) => {
    setData((prev) => {
      const { [id]: _, ...rest } = prev.todosByListId
      return {
        lists: prev.lists.filter((l) => l.id !== id),
        todosByListId: rest,
      }
    })
  }, [])

  const updateListName = useCallback((id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === id ? { ...l, name: name.trim() || l.name } : l
      ),
    }))
  }, [])

  const getTodos = useCallback(
    (listId: string) => data.todosByListId[listId] ?? [],
    [data.todosByListId]
  )

  const addTodo = useCallback(
    (
      listId: string,
      todo: Omit<Todo, "id" | "createdAt">
    ) => {
      const newTodo: Todo = {
        ...todo,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      }
      setData((prev) => ({
        ...prev,
        todosByListId: {
          ...prev.todosByListId,
          [listId]: [...(prev.todosByListId[listId] ?? []), newTodo],
        },
      }))
    },
    []
  )

  const toggleTodo = useCallback((listId: string, todoId: string) => {
    setData((prev) => {
      const todos = prev.todosByListId[listId] ?? []
      return {
        ...prev,
        todosByListId: {
          ...prev.todosByListId,
          [listId]: todos.map((t) =>
            t.id === todoId ? { ...t, completed: !t.completed } : t
          ),
        },
      }
    })
  }, [])

  const deleteTodo = useCallback((listId: string, todoId: string) => {
    setData((prev) => ({
      ...prev,
      todosByListId: {
        ...prev.todosByListId,
        [listId]: (prev.todosByListId[listId] ?? []).filter((t) => t.id !== todoId),
      },
    }))
  }, [])

  const updateTodos = useCallback((listId: string, todos: Todo[]) => {
    setData((prev) => ({
      ...prev,
      todosByListId: { ...prev.todosByListId, [listId]: todos },
    }))
  }, [])

  const value: TodoListsContextValue = {
    lists: data.lists,
    todosByListId: data.todosByListId,
    addList,
    deleteList,
    updateListName,
    getTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodos,
  }

  return (
    <TodoListsContext.Provider value={value}>
      {children}
    </TodoListsContext.Provider>
  )
}

export function useTodoLists() {
  const ctx = useContext(TodoListsContext)
  if (!ctx) throw new Error("useTodoLists must be used within TodoListsProvider")
  return ctx
}
