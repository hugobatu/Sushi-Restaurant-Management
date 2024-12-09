import { MenuSidebar } from "@/components/menu-sidebar"
import { MenuGrid } from "@/components/menu-grid"

const menuItems = {
  "khai-vi": [
    {
      id: "ST1",
      name: "TRỨNG HẤP KIỂU NHẬT & TRỨNG CÁ HỒI",
      price: "75.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST2",
      name: "TRỨNG HẤP KIỂU NHẬT VÀ LƯƠN NHẬT",
      price: "39.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST3",
      name: "TRỨNG HẤP KIỂU NHẬT",
      price: "32.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST4",
      name: "TRỨNG HẤP KIỂU NHẬT & TRỨNG CÁ HỒI",
      price: "75.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST5",
      name: "TRỨNG HẤP KIỂU NHẬT VÀ LƯƠN NHẬT",
      price: "39.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST6",
      name: "TRỨNG HẤP KIỂU NHẬT",
      price: "32.000",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],

  "sushi": [
    {
      id: "ST1",
      name: "TRỨNG HẤP KIỂU NHẬT & TRỨNG CÁ HỒI",
      price: "75.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST2",
      name: "TRỨNG HẤP KIỂU NHẬT VÀ LƯƠN NHẬT",
      price: "39.000",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "ST3",
      name: "TRỨNG HẤP KIỂU NHẬT",
      price: "32.000",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const items = (menuItems[params.category as keyof typeof menuItems] || []).map(item => ({
    ...item,
    price: parseFloat(item.price.replace(/\./g, ''))
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <MenuSidebar />
        <MenuGrid items={items} />
      </div>
    </div>
  )
}

