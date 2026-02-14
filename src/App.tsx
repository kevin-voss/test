import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TodoListsProvider } from "@/contexts/TodoListsContext"
import { Dashboard } from "@/pages/Dashboard"
import { TodoListDetail } from "@/pages/TodoListDetail"

export default function App() {
  return (
    <TodoListsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/list/:listId" element={<TodoListDetail />} />
        </Routes>
      </BrowserRouter>
    </TodoListsProvider>
  )
}
