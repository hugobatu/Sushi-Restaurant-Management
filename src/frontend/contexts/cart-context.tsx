"use client";

import * as React from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  checked: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "checked">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleItem: (id: string, checked: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void;
  itemCount: number;
  totalAmount: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  
  React.useEffect(() => {
    // Only run on the client side
    const loadCartFromLocalStorage = () => {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    };

    const savedItems = loadCartFromLocalStorage();
    setItems(savedItems);
  }, []);

  const syncCartToLocalStorage = (cart: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const addItem = React.useCallback((item: Omit<CartItem, "quantity" | "checked">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      const updatedItems = existingItem
        ? currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...currentItems, { ...item, quantity: 1, checked: false }];
      
      syncCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }, []);
  

  const removeItem = React.useCallback((id: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.id !== id);
      syncCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
    syncCartToLocalStorage([]);
  }, []);

  const toggleItem = React.useCallback((id: string, checked: boolean) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked } : item
      )
    );
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  }, []);

  const itemCount = React.useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const totalAmount = React.useMemo(() => {
    return items
      .filter((item) => item.checked) // Filter selected items (those that are checked)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        toggleItem,
        updateQuantity,
        itemCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}