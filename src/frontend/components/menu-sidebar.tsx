import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  { id: "starter", name: "Starter" },
  { id: "sashimi-combo", name: "Sashimi Combo" },
  { id: "sashimi", name: "Sashimi" },
  { id: "sushi-combo", name: "Sushi Combo" },
  { id: "nigiri", name: "Nigiri" },
  { id: "gunkan", name: "Gunkan" },
  { id: "hosomaki", name: "Hosomaki" },
  { id: "maki", name: "Maki" },
  { id: "salad", name: "Salad" },
  { id: "appetizer", name: "Appetizer" },
  { id: "teppan", name: "Teppan" },
  { id: "yaki", name: "Yaki" },
  { id: "furai", name: "Furai" },
  { id: "tempura", name: "Tempura" },
  { id: "noodles", name: "Noodles" },
  { id: "donburi", name: "Donburi" },
]

export function MenuSidebar() {
  return (
    <div className="w-64 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Grand Menu</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="flex flex-col p-4 space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="justify-start font-normal hover:bg-red-50 hover:text-red-600"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

