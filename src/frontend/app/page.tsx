import { HeroSection } from "@/components/HomePage/hero-section"
import { SiteHeader } from "@/components/HomePage/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
      <SiteHeader/>
      XIN CHÀO QUÝ DỊ 
        <HeroSection />
      </main>

      
    </div>
  )
}


// DAY LA HOME DAU TIEN dành cho khi người đó chưa đăng ký, đăng nhập
