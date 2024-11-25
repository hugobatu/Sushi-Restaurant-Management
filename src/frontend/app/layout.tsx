import { CartProvider } from "@/contexts/cart-context"
import { SiteHeader } from "@/components/site-header"
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
          <SiteHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

