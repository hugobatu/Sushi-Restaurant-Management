import React from "react";
import { useCart } from "@/contexts/cart-context";
import ProductItem from "../ui/product-item";

const ProductList = () => {
  const { items, addItem, removeItem, toggleItem, updateQuantity } = useCart();

  return (
    <div>
      {items.map((item) => (
        <ProductItem
          key={item.id}
          {...item}
          onAdd={() => updateQuantity(item.id, item.quantity + 1)}
          onRemove={() => updateQuantity(item.id, item.quantity - 1)}
          onToggle={(checked) => toggleItem(item.id, checked)}
        />
      ))}
    </div>
  );
};

export default ProductList;
