import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PromotionCardProps {
  title: string
  image: string
  link: string
}

export function PromotionCard({ title, image, link }: PromotionCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-4 line-clamp-2 min-h-[56px]">{title}</h3>
          <Link href={link}>
            <Button variant="destructive" size="sm" className="text-xs">
              XEM THÊM
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

