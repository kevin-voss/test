import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import {
  ShoppingCategory,
  SHOPPING_CATEGORIES,
  SHOPPING_CATEGORY_LABELS,
} from "@/types/shopping"

interface ShoppingFormProps {
  onAdd: (text: string, category: ShoppingCategory) => void
}

export function ShoppingForm({ onAdd }: ShoppingFormProps) {
  const [text, setText] = useState("")
  const [category, setCategory] = useState<ShoppingCategory>("sonstiges")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed) {
      onAdd(trimmed, category)
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Was brauchst du?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ShoppingCategory)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[140px]"
        >
          {SHOPPING_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {SHOPPING_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
