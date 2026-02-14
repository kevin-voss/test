import { Todo, Priority } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
}

function formatDueDate(d: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(d)
  due.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff === -1) return "Yesterday"
  if (diff > 0 && diff <= 7) return `In ${diff} days`
  if (diff < 0 && diff >= -7) return `${Math.abs(diff)} days ago`
  return d.toLocaleDateString()
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
        todo.completed && "bg-muted/50"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <div className="flex flex-1 flex-col gap-1">
        <span
          className={cn(
            "text-sm",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.text}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-xs font-medium",
              PRIORITY_STYLES[todo.priority]
            )}
          >
            {todo.priority}
          </span>
          {todo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {todo.dueDate && (
            <span className="text-xs text-muted-foreground">
              Due: {formatDueDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
