import { ShoppingItem as ShoppingItemType } from "@/types/shopping"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShoppingItemProps {
  item: ShoppingItemType
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function ShoppingItem({ item, onToggle, onDelete }: ShoppingItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
        item.completed && "bg-muted/50"
      )}
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={() => onToggle(item.id)}
      />
      <div className="flex flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-sm",
            item.completed && "text-muted-foreground line-through"
          )}
        >
          {item.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
