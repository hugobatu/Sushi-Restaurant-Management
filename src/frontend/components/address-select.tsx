"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin } from 'lucide-react'

const locations = [
  { id: "1", name: "Hồ Chí Minh" },
  { id: "2", name: "Hà Nội" },
  { id: "3", name: "Đà Nẵng" },
]

export function AddressSelect() {
  return (
    <div className="flex items-center gap-2 p-4 border-b bg-white">
      <MapPin className="h-4 w-4 text-red-600" />
      <Select defaultValue="1">
        <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0">
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
  )
}

