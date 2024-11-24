import { Card, CardContent } from "@/components/ui/card"

// Sample menu items data
const menuItems = [
  {
    id: "ST1",
    name: "TRỨNG HẤP KIỂU NHẬT & TRỨNG CÁ HỒI",
    price: "75.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ST2",
    name: "TRỨNG HẤP KIỂU NHẬT VÀ LƯƠN NHẬT",
    price: "39.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ST3",
    name: "TRỨNG HẤP KIỂU NHẬT",
    price: "32.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ST4",
    name: "SÚP MISO",
    price: "25.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ST5",
    name: "CANH SÚP",
    price: "25.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ST6",
    name: "CANH SÚP CHAY",
    price: "25.000 ₫",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export function MenuGrid() {
  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{item.id}</div>
                <h3 className="font-medium mb-2 min-h-[40px]">{item.name}</h3>
                <div className="text-red-600 font-semibold">{item.price}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

