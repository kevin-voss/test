import { useState } from "react"
import { Link } from "react-router-dom"
import { useTodoLists } from "@/contexts/TodoListsContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ListTodo, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Dashboard() {
  const { lists, addList, deleteList } = useTodoLists()
  const [newListName, setNewListName] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newListName.trim()
    if (name) {
      addList(name)
      setNewListName("")
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ListTodo className="h-7 w-7" />
              Todo Lists
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a list to view and manage your todos, or create a new one.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={handleAdd}
              className={cn(
                "flex gap-2 transition-all",
                isAdding ? "opacity-100" : "opacity-80"
              )}
            >
              {isAdding ? (
                <>
                  <Input
                    type="text"
                    placeholder="List name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false)
                      setNewListName("")
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add new list
                </Button>
              )}
            </form>

            {lists.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No todo lists yet. Create your first one above!
                </p>
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
            ) : (
              <div className="grid gap-2">
                {lists.map((list) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    onDelete={() => deleteList(list.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ListCard({
  list,
  onDelete,
}: {
  list: { id: string; name: string; createdAt: Date }
  onDelete: () => void
}) {
  const { getTodos } = useTodoLists()
  const todos = getTodos(list.id)
  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors group">
      <Link
        to={`/list/${list.id}`}
        className="flex-1 flex items-center gap-3 min-w-0"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{list.name}</p>
          <p className="text-xs text-muted-foreground">
            {totalCount} {totalCount === 1 ? "item" : "items"}
            {totalCount > 0 && ` · ${completedCount} completed`}
          </p>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault()
          onDelete()
        }}
        className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete ${list.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Link to={`/list/${list.id}`}>
        <Button size="sm">Open</Button>
      </Link>
    </div>
  )
}
