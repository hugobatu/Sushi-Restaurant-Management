import { CartProvider } from "@/contexts/cart-context"
import { SiteHeader } from "@/components/HomePage/site-header"
import { AdminHeader } from "@/components/Admin/admin-header"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

