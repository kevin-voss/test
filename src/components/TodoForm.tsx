import { useState, FormEvent, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import type { Priority } from "@/types/todo"

interface TodoFormProps {
  onAdd: (text: string, priority: Priority, tags: string[], dueDate: Date | null) => void
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [dueDate, setDueDate] = useState<string>("")

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed) {
      const parsedDue = dueDate ? new Date(dueDate) : null
      onAdd(trimmed, priority, tags, parsedDue)
      setText("")
      setPriority("medium")
      setTags([])
      setTagInput("")
      setDueDate("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Priority:</span>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground ml-2">Due:</span>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-8 w-36"
        />
        <span className="text-xs text-muted-foreground ml-2">Tags:</span>
        <Input
          type="text"
          placeholder="Add tag (Enter or ,)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          className="h-8 w-32"
        />
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </form>
  )
}
