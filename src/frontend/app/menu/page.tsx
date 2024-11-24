import { SiteHeader } from "@/components/site-header"
import { MenuSidebar } from "@/components/menu-sidebar"
import { MenuGrid } from "@/components/menu-grid"

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <MenuSidebar />
        <MenuGrid />
      </div>
    </div>
  )
}

