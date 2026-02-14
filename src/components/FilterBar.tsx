import { Filter } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(f.value)}
          className={cn(filter === f.value && "shadow-sm")}
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}
