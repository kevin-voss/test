import { Filter, SortOption, Priority } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  filterPriority: Priority | "all"
  onFilterPriorityChange: (p: Priority | "all") => void
  filterTag: string
  onFilterTagChange: (tag: string) => void
  availableTags: string[]
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "created-desc", label: "Newest first" },
  { value: "created-asc", label: "Oldest first" },
  { value: "priority-desc", label: "Priority high→low" },
  { value: "priority-asc", label: "Priority low→high" },
  { value: "due-asc", label: "Due soonest" },
  { value: "due-desc", label: "Due latest" },
  { value: "text-asc", label: "A→Z" },
  { value: "text-desc", label: "Z→A" },
]

const PRIORITY_FILTERS: { value: Priority | "all"; label: string }[] = [
  { value: "all", label: "Any priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function FilterBar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  filterPriority,
  onFilterPriorityChange,
  filterTag,
  onFilterTagChange,
  availableTags,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Status:</span>
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
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Sort:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="text-xs font-medium text-muted-foreground ml-2">Priority:</span>
        <select
          value={filterPriority}
          onChange={(e) => onFilterPriorityChange(e.target.value as Priority | "all")}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {availableTags.length > 0 && (
          <>
            <span className="text-xs font-medium text-muted-foreground ml-2">Tag:</span>
            <select
              value={filterTag}
              onChange={(e) => onFilterTagChange(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  )
}
