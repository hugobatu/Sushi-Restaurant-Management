"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  { id: "A", name: "Appetizer", href: "/menu/appetizer" },
  { id: "B", name: "Bento Box", href: "/menu/bento-box" },
  { id: "BE", name: "Beer", href: "/menu/beer" },
  { id: "C", name: "Curry", href: "/menu/curry" },
  { id: "D", name: "Donburi", href: "/menu/donburi" },
  { id: "F", name: "Furai", href: "/menu/furai" },
  { id: "FJ", name: "Fruit Juice", href: "/menu/fruit-juice" },
  { id: "G", name: "Gunkan", href: "/menu/gunkan" },
  { id: "HO", name: "Hosomaki", href: "/menu/hosomaki" },
  { id: "HP", name: "Hotpot", href: "/menu/hotpot" },
  { id: "IC", name: "Ice-cream", href: "/menu/ice-cream" },
  { id: "M", name: "Maki", href: "/menu/maki" },
  { id: "MO", name: "Mojito", href: "/menu/mojito" },
  { id: "N", name: "Nigiri", href: "/menu/nigiri" },
  { id: "ND", name: "Noodles", href: "/menu/noodles" },
  { id: "SA", name: "Sashimi", href: "/menu/sashimi" },
  { id: "SD", name: "Soft Drink", href: "/menu/soft-drink" },
  { id: "SE", name: "Set", href: "/menu/set" },
  { id: "SL", name: "Salad", href: "/menu/salad" },
  { id: "SO", name: "Soda", href: "/menu/soda" },
  { id: "ST", name: "Starter", href: "/menu/starter" },
  { id: "T", name: "Teppan", href: "/menu/teppan" },
  { id: "TE", name: "Tea", href: "/menu/tea" },
  { id: "TP", name: "Tempura", href: "/menu/tempura" },
  { id: "WI", name: "Wine", href: "/menu/wine" },
  { id: "Y", name: "Yaki", href: "/menu/yaki" },
];




const locations = [
  { id: "1", name: "Hồ Chí Minh" },
  { id: "2", name: "Hà Nội" },
  { id: "3", name: "Đà Nẵng" },
]

export function MenuSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-red-600">THỰC ĐƠN CHI NHÁNH</h2>
      </div>
      <div className="p-4 border-b flex items-center gap-2">
        <MapPin className="h-4 w-4 text-red-600" />
        <Select defaultValue="1">
          <SelectTrigger className="w-full border-none shadow-none focus:ring-0">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="flex flex-col p-4 space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={`justify-start font-normal hover:bg-red-50 hover:text-red-600 ${
                pathname === category.href ? "bg-red-50 text-red-600" : ""
              }`}
              asChild
            >
              <Link href={category.href}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

