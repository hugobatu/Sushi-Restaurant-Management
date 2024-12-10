import { MenuSidebar } from "@/components/menu-sidebar"
import { MenuGrid } from "@/components/menu-grid"
import fs from 'fs'
import path from 'path'

interface MenuItem {
  item_id: string
  item_name: string
  base_price: string
  image_url: string
  menu_item_status: string
}

// Categories mapping (from your data)
const categoryMapping = {
  A: "Appetizer",
  BE: "Beer",
  B: "Bento-Box",
  C: "Curry",
  D: "Donburi",
  F: "Furai",
  FJ: "Fruit-Juice",
  G: "Gunkan",
  HO: "Hosomaki",
  HP: "Hotpot",
  IC: "Ice-cream",
  MO: "Mojito",
  M: "Maki",
  ND: "Noodles",
  N: "Nigiri",
  SA: "Sashimi",
  SD: "Soft-Drink",
  SE: "Set",
  SL: "Salad",
  SO: "Soda",
  ST: "Starter",
  T: "Teppan",
  TE: "Tea",
  TP: "Tempura",
  WI: "Wine",
  Y: "Yaki"
}

// Function to get items by category from final_data.json
function getItemsByCategory(category: string) {
  // Get the path to the final_data.json file
  const filePath = path.join(process.cwd(), 'app/DataTest/final_data.json')
  const fileData = fs.readFileSync(filePath, 'utf8')
  const menuItems: MenuItem[] = JSON.parse(fileData)

  // Filter items by category prefix from item_id (match the full category ID)
  const filteredItems = menuItems.filter(item => {
    // Check if the item_id starts with the category prefix and matches exactly
    return item.item_id.startsWith(category)
  })

  return filteredItems.map(item => ({
    id: item.item_id,
    name: item.item_name,
    price: parseFloat(item.base_price), // Ensure price is a number
    image_url: item.image_url,
  }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  // Convert category from URL to category ID (e.g., "sushi" -> "A", "appetizer" -> "A")
  const categoryMappingReverse = Object.entries(categoryMapping).reduce((acc, [key, value]) => {
    acc[value.toLowerCase()] = key
    return acc
  }, {} as Record<string, string>)

  const categoryId = categoryMappingReverse[params.category] || "A" // Default to "A" if category is not found
  const items = getItemsByCategory(categoryId)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <MenuSidebar />
        <MenuGrid items={items} />
      </div>
    </div>
  )
}
