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
  { id: "khai-vi", name: "KHAI VỊ", href: "/menu/khai-vi" },
  { id: "sushi", name: "SUSHI", href: "/menu/sushi" },
  { id: "sashimi", name: "SASHIMI", href: "/menu/sashimi" },
  { id: "nigiri", name: "NIGIRI", href: "/menu/nigiri" },
  { id: "salad", name: "SALAD", href: "/menu/salad" },
  { id: "cac-mon-mi", name: "CÁC MÓN MÌ", href: "/menu/cac-mon-mi" },
  { id: "curry", name: "CURRY", href: "/menu/curry" },
  { id: "do-uong", name: "ĐỒ UỐNG", href: "/menu/do-uong" },
]

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

