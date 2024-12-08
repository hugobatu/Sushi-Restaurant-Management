"use client";

import React from "react";
import { CartProvider, useCart } from "@/contexts/cart-context";
import Image from "next/image";

const TestCart = () => {
  const { items, addItem, removeItem, toggleItem, updateQuantity, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-gray-300">
        <div className="flex items-center space-x-4">

          <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
        </div>
      </header>

      {/* Cart Table */}
      <table className="w-full mt-8 border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Sản phẩm</th>
            <th className="p-4">Đơn giá</th>
            <th className="p-4">Số lượng</th>
            <th className="p-4">Thành tiền</th>

          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              {/* Checkbox */}
                <td className="p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => toggleItem(item.id, e.target.checked)}
                  className="mr-2"
                />
                <img
                src={`/starter/${item.id}.jpg`}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-md mr-4"
                />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.id}</div>
                </div>
                </td>
              {/* Price */}
              <td className="p-4">{item.price.toLocaleString()} đ</td>
              {/* Quantity */}
              <td className="p-4 flex items-center">
                <button
                  className="px-2 py-1 border border-gray-400 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  className="px-2 py-1 border border-gray-400 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </td>
              {/* Total */}
              <td className="p-4 text-orange-600 font-bold">
                {(item.quantity * item.price).toLocaleString()} đ
              </td>
              {/* Remove */}
              <td className="p-4">
                <button
                  className="text-red-500 font-bold"
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Amount */}
      <div className="text-right mt-6 text-lg font-semibold">
        Tổng cộng: <span className="text-orange-600">{totalAmount.toLocaleString()} đ</span>
      </div>
    </div>
  );
};

// Wrap the page in CartProvider
const Page = () => (
  <CartProvider>
    <TestCart />
  </CartProvider>
);

export default Page;
