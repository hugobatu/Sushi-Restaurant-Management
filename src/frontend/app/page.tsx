import { HeroSection } from "@/components/hero-section"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
      <SiteHeader/>
        <HeroSection />
      </main>
    </div>
  )
}

