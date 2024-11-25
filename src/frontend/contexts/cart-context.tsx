"use client"

import * as React from "react"

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id)
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...currentItems, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }, [])

  const clearCart = React.useCallback(() => {
    setItems([])
  }, [])

  const itemCount = React.useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

