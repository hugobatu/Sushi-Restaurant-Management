"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p>{item.price} ₫</p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value, 10))
                  }
                  className="w-16 border rounded p-1 text-center"
                />
                <Button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4">
            <h3 className="text-lg font-semibold">
              Total: {totalAmount.toLocaleString()} ₫
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
