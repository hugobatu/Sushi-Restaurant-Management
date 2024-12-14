"use client";

import * as React from "react";

interface CartItem {
  id: string;
  name: string;
  price: number; // Đổi kiểu dữ liệu từ string thành number để dễ tính toán
  quantity: number;
  checked: boolean; // Trạng thái checkbox
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "checked">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleItem: (id: string, checked: boolean) => void; // Hàm toggle checkbox
  updateQuantity: (id: string, quantity: number) => void; // Cập nhật số lượng
  itemCount: number;
  totalAmount: number; // Tổng tiền
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);



// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = React.useState<CartItem[]>([]);

//   const addItem = React.useCallback((item: Omit<CartItem, "quantity" | "checked">) => {
//     setItems((currentItems) => {
//       const existingItem = currentItems.find((i) => i.id === item.id);
//       if (existingItem) {
//         return currentItems.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...currentItems, { ...item, quantity: 1, checked: false }];
//     });
//   }, []);

//   const removeItem = React.useCallback((id: string) => {
//     setItems((currentItems) => currentItems.filter((item) => item.id !== id));
//   }, []);

//   const clearCart = React.useCallback(() => {
//     setItems([]);
//   }, []);

//   const toggleItem = React.useCallback((id: string, checked: boolean) => {
//     setItems((currentItems) =>
//       currentItems.map((item) =>
//         item.id === id ? { ...item, checked } : item
//       )
//     );
//   }, []);

//   const updateQuantity = React.useCallback((id: string, quantity: number) => {
//     setItems((currentItems) =>
//       currentItems.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
//       )
//     );
//   }, []);

//   const itemCount = React.useMemo(() => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   }, [items]);

//   const totalAmount = React.useMemo(() => {
//     return items
//       .filter((item) => item.checked) // Chỉ tính các item được chọn
//       .reduce((total, item) => total + item.price * item.quantity, 0);
//   }, [items]);

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addItem,
//         removeItem,
//         clearCart,
//         toggleItem,
//         updateQuantity,
//         itemCount,
//         totalAmount,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }


// testing


export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([
    // Preloaded test items
    {
      id: "ST1",
      name: "TRỨNG HẤP KIỂU NHẬT & TRỨNG CÁ HỒI",
      price: 75000,
      quantity: 1,
      checked: true, // Default to selected
    },
    {
      id: "ST2",
      name: "TRỨNG HẤP KIỂU NHẬT VÀ LƯƠN NHẬT",
      price: 39000,
      quantity: 1,
      checked: true,
    },
    // {
    //   id: "ST3",
    //   name: "TRỨNG HẤP KIỂU NHẬT",
    //   price: 32000,
    //   quantity: 1,
    //   checked: false, // Not selected by default
    // },
  ]);

  const addItem = React.useCallback((item: Omit<CartItem, "quantity" | "checked">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1, checked: false }];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
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
      .filter((item) => item.checked) // Only include selected items
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


