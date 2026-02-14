/**
 * German supermarket layout order (from entry to exit).
 * Typical structure: Obst → Brot → Milch → Fleisch → Getränke → Lebensmittel → Süßigkeiten → Tiefkühl → Haushalt → Sonstiges
 */
export const SHOPPING_CATEGORIES = [
  "obst-gemuese",      // Obst & Gemüse (Fruits & Vegetables) - entry
  "brot-backwaren",    // Brot & Backwaren (Bread & Bakery)
  "milch-kaese",       // Milchprodukte & Käse (Dairy & Cheese)
  "fleisch-wurst",     // Fleisch & Wurst (Meat & Sausage)
  "getraenke",        // Getränke (Beverages)
  "lebensmittel",     // Lebensmittel (Dry goods: pasta, rice, canned)
  "suessigkeiten",    // Süßigkeiten & Snacks (Sweets & Snacks)
  "tiefkuehl",        // Tiefkühl (Frozen)
  "haushalt",         // Haushalt & Drogerie (Household & Toiletries)
  "sonstiges",        // Sonstiges (Other)
] as const

export type ShoppingCategory = (typeof SHOPPING_CATEGORIES)[number]

export interface ShoppingItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  category: ShoppingCategory
}

export const SHOPPING_CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  "obst-gemuese": "Obst & Gemüse",
  "brot-backwaren": "Brot & Backwaren",
  "milch-kaese": "Milch & Käse",
  "fleisch-wurst": "Fleisch & Wurst",
  "getraenke": "Getränke",
  "lebensmittel": "Lebensmittel",
  "suessigkeiten": "Süßigkeiten & Snacks",
  "tiefkuehl": "Tiefkühl",
  "haushalt": "Haushalt & Drogerie",
  "sonstiges": "Sonstiges",
}
