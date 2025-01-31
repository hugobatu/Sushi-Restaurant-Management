import { Button } from "@/components/ui/button"
import Link from "next/link"
export function StaffSection() {
  return (
    <div className="relative overflow-hidden bg-[#FFF5F5]">
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute transform -rotate-45">
          <div className="w-16 h-16 bg-red-200 rounded-full opacity-20" />
        </div>
      </div>
      <div className="container relative z-10 py-12 lg:py-20 px-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              TOKYO DELI HOME
            </h1>
            <h2 className="text-2xl font-semibold text-red-600">
              WELCOME STAFF
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl">
              Authentic Japanese cuisine delivered straight to your doorstep
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="bg-red-600 hover:bg-red-700 text-lg h-12 px-8">
                ĐẶT HÀNG NGAY
              </Button>

              <Link href="/menu" legacyBehavior passHref>
              <Button variant="outline" className="text-lg h-12 px-8">XEM MENU</Button>
              </Link>

            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute transform rotate-45">
          <div className="w-16 h-16 bg-red-200 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  )
}
