import { MenuSidebar } from "@/components/menu-sidebar";
import { MenuGrid } from "@/components/menu-grid";
import { SiteHeader } from "@/components/site-header"
import fs from "fs";
import path from "path";

interface MenuItem {
  item_id: string;
  item_name: string;
  base_price: string;
  image_url: string;
  menu_item_status: string;
}

const categoryMapping = {
  A: "Appetizer",
  BE: "Beer",
  B: "Bento-Box",
  C: "Curry",
  D: "Donburi",
  F: "Furai",
  FJ: "Fruit-Juice",
  G: "Gunkan",
  HO: "Hosomaki",
  HP: "Hotpot",
  IC: "Ice-cream",
  MO: "Mojito",
  M: "Maki",
  ND: "Noodles",
  N: "Nigiri",
  SA: "Sashimi",
  SD: "Soft-Drink",
  SE: "Set",
  SL: "Salad",
  SO: "Soda",
  ST: "Starter",
  T: "Tempura",
  TE: "Tea",
  TP: "Teppan",
  WI: "Wine",
  Y: "Yaki",
};

// Create the reverse mapping properly with type assertion
const categoryMappingReverse = Object.entries(categoryMapping).reduce(
  (acc, [key, value]) => {
    acc[value.toLowerCase()] = key as keyof typeof categoryMapping; // Explicitly cast to valid category keys
    return acc;
  },
  {} as Record<string, keyof typeof categoryMapping> // Ensure the result type is properly asserted
);

function getItemsByCategory(category: keyof typeof categoryMapping) {
  const filePath = path.join(process.cwd(), "app/DataTest/final_data.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const menuItems: MenuItem[] = JSON.parse(fileData);

  const filteredItems = menuItems.filter((item) => {
    const prefix = category;
    if (!item.item_id.startsWith(prefix)) return false;

    // Ensure the next character after the prefix is either undefined or a digit
    const nextChar = item.item_id[prefix.length];
    return nextChar === undefined || /^[0-9]$/.test(nextChar);
  });

  return filteredItems.map((item) => ({
    id: item.item_id,
    name: item.item_name,
    price: parseFloat(item.base_price),
    image_url: item.image_url,
  }));
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Get categoryId from the reverse mapping and ensure it is a valid category
  const categoryId =
    categoryMappingReverse[params.category.toLowerCase()] || "A";

  // If category is invalid, fallback to "A" (Appetizer)
  if (!categoryId) {
    console.error("Invalid category");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
      </div>
    );
  }

  // Get items for the valid category
  const items = getItemsByCategory(categoryId);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <div className="flex flex-1">
        <MenuSidebar />
        <MenuGrid items={items} />
      </div>
    </div>
  );
}
