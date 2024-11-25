"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useCart } from "@/contexts/cart-context"

interface MenuItem {
  id: string
  name: string
  price: string
  image: string
}

interface MenuGridProps {
  items: MenuItem[]
}

export function MenuGrid({ items }: MenuGridProps) {
  const { addItem } = useCart()

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <CardContent className="p-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4 relative">
                <div className="text-sm text-gray-500 mb-1">{item.id}</div>
                <h3 className="font-medium mb-2 min-h-[40px]">{item.name}</h3>
                <div className="text-red-600 font-semibold">{item.price} ₫</div>
                <Button 
                  size="icon"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700"
                  onClick={() => addItem(item)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

