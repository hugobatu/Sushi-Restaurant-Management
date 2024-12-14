import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/HomePage/site-header"
import { PromotionCard } from "@/components/Promotions/promotion-card"

const promotions = [
  {
    title: "CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM",
    image: "/placeholder.svg?height=300&width=400",
    link: "/promotions/teachers-day",
  },
  {
    title: "TOKYO DELI EXPRESS CHÍNH THỨC CÓ MẶT TRÊN BE VÀ GIAO HANG NHANH",
    image: "/placeholder.svg?height=300&width=400",
    link: "/promotions/express-delivery",
  },
  {
    title: "WINTER MENU - HOT POT",
    image: "/placeholder.svg?height=300&width=400",
    link: "/promotions/winter-hot-pot",
  },
  {
    title: "WINTER MENU SETS",
    image: "/placeholder.svg?height=300&width=400",
    link: "/promotions/winter-sets",
  },
]

const news = [
  {
    title: "KHAI TRƯƠNG CỬA HÀNG MỚI",
    image: "/placeholder.svg?height=300&width=400",
    link: "/news/new-store",
  },
  {
    title: "TOKYO DELI NHẬN GIẢI THƯỞNG CHẤT LƯỢNG",
    image: "/placeholder.svg?height=300&width=400",
    link: "/news/quality-award",
  },
]

export default function PromotionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 container py-8 mx-auto ">
        <h1 className="text-3xl font-bold text-center mb-8">THÔNG TIN & KHUYẾN MÃI</h1>
        
        <Tabs defaultValue="promotions" className="w-full">
          <TabsList className="w-full max-w-[400px] mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="news" className="text-base bg-background text-black data-[state=active]:bg-red-700 data-[state=active]:text-white">
              Tin Tức
            </TabsTrigger>
            <TabsTrigger value="promotions" className="text-base bg-background text-black data-[state=active]:bg-red-700 data-[state=active]:text-white">
              Khuyến mãi
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <PromotionCard
                  key={item.link}
                  title={item.title}
                  image={item.image}
                  link={item.link}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="promotions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((item) => (
                <PromotionCard
                  key={item.link}
                  title={item.title}
                  image={item.image}
                  link={item.link}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

