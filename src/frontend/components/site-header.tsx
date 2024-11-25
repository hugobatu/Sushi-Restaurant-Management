"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'
import { useCart } from "@/contexts/cart-context"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center w-full px-10">
        <Link href="/" className="mr-auto">
          <img 
            src="/placeholder.svg?height=40&width=160" 
            alt="Tokyo Deli" 
            className="h-10 w-40"
          />
        </Link>
        <NavigationMenu className="hidden md:flex justify-center content-center text-center">
          <NavigationMenuList>
          <NavigationMenuItem>
              <Link href="/express" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  GIỚI THIỆU
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/menu" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  THỰC ĐƠN
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/promotions" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  THÔNG TIN - KHUYẾN MÃI
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/home" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  THẺ THÀNH VIÊN
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/catering" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  HỆ THỐNG CHI NHÁNH
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contacts" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  LIÊN HỆ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          <Button variant="outline">ĐĂNG NHẬP</Button>
          <Button className="bg-red-600 hover:bg-red-700">ĐẶT HÀNG NGAY</Button>
        </div>
      </div>
    </header>
  )
}

