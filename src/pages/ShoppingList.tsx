import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useTodoLists } from "@/contexts/TodoListsContext"
import {
  SHOPPING_CATEGORIES,
  SHOPPING_CATEGORY_LABELS,
  ShoppingItem,
} from "@/types/shopping"
import { ShoppingForm } from "@/components/ShoppingForm"
import { ShoppingItem as ShoppingItemComponent } from "@/components/ShoppingItem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

function sortBySupermarketLayout(items: ShoppingItem[]): ShoppingItem[] {
  const orderMap = new Map(SHOPPING_CATEGORIES.map((c, i) => [c, i]))
  return [...items].sort((a, b) => {
    const aOrder = orderMap.get(a.category) ?? 999
    const bOrder = orderMap.get(b.category) ?? 999
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.createdAt.getTime() - b.createdAt.getTime()
  })
}

function groupByCategory(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
  const sorted = sortBySupermarketLayout(items)
  const map = new Map<string, ShoppingItem[]>()
  for (const item of sorted) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return map
}

export function ShoppingListPage() {
  const {
    getShoppingItems,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
  } = useTodoLists()

  const items = getShoppingItems()
  const grouped = useMemo(() => groupByCategory(items), [items])

  const handleAdd = (text: string, category: Parameters<typeof addShoppingItem>[1]) => {
    addShoppingItem(text, category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-xl">
        <Card className="border-emerald-200/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl flex items-center gap-2 flex-1">
                <ShoppingCart className="h-7 w-7 text-emerald-600" />
                Einkaufsliste
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Sortiert wie im Supermarkt: vom Eingang bis zur Kasse.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ShoppingForm onAdd={handleAdd} />
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Noch nichts auf der Liste. Füge deinen ersten Artikel hinzu!
                </p>
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
            ) : (
              <div className="space-y-6">
                {SHOPPING_CATEGORIES.map((category) => {
                  const categoryItems = grouped.get(category)
                  if (!categoryItems?.length) return null
                  return (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
                        {SHOPPING_CATEGORY_LABELS[category]}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {categoryItems.map((item) => (
                          <ShoppingItemComponent
                            key={item.id}
                            item={item}
                            onToggle={toggleShoppingItem}
                            onDelete={deleteShoppingItem}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
