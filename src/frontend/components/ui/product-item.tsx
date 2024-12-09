import React from "react";

interface ProductItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onToggle: (checked: boolean) => void;
  checked: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  name,
  price,
  quantity,
  onAdd,
  onRemove,
  onToggle,
  checked,
}) => {
  return (
    <div className="flex items-center space-x-4 border-b py-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="flex-1">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{price.toLocaleString()} đ</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onRemove} className="px-2">-</button>
        <span>{quantity}</span>
        <button onClick={onAdd} className="px-2">+</button>
      </div>
    </div>
  );
};

export default ProductItem;
