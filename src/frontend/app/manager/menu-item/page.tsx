"use client";

import React, { useEffect, useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav";

const BranchMenuPage = () => {
  interface BranchMenuItem {
    branch_id: string;
    item_id: string;
    item_name: string;
    is_available: boolean;
    base_price: number;
  }

  const formatPrice = (base_price: number) => {
    return `${base_price.toLocaleString("vi-VN")} VND`;
  };

  const [branchMenuItems, setBranchMenuItems] = useState<BranchMenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    user_id: "",
    item_id: "",
  });

  const [deleteMenuItem, setDeleteMenuItem] = useState({
    user_id: "",
    item_id: "",
  });

  const [updateMenuItem, setUpdateMenuItem] = useState({
    user_id: "",
    item_id: "",
    is_available: 1 as number,
  });

  const fetchBranchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/manager/menu-branch-item", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setBranchMenuItems(data.data);
        alert("Menu items fetched successfully!");
      } else {
        setBranchMenuItems([]);
        alert(data.message || "Error fetching menu items.");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      alert("An error occurred while fetching menu items.");
    }
  };

  const addBranchMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:8000/manager/menu-branch-item/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(newMenuItem.user_id),
          item_id: newMenuItem.item_id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Menu item added successfully!");
        fetchBranchMenuItems();
        setNewMenuItem({ user_id: "", item_id: "" });
      } else {
        alert(data.message || "Error adding menu item.");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item.\nOr this menu item is exists in the branch already ");
    }
  };

  const deleteBranchMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:8000/manager/menu-branch-item/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(deleteMenuItem.user_id),
          item_id: deleteMenuItem.item_id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Menu item deleted successfully!");
        fetchBranchMenuItems();
        setDeleteMenuItem({ user_id: "", item_id: "" });
      } else {
        alert(data.message || "Error deleting menu item.");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Error deleting menu item.");
    }
  };

  const updateBranchMenuItemStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/manager/menu-branch-item/change-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(updateMenuItem.user_id),
          item_id: updateMenuItem.item_id,
          is_available: updateMenuItem.is_available,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Menu item status updated successfully!");
        fetchBranchMenuItems();
        setUpdateMenuItem({ user_id: "", item_id: "", is_available: 1 });
      } else {
        alert(data.message || "Error updating menu item status.");
      }
    } catch (error) {
      console.error("Error updating menu item status:", error);
      alert("Error updating menu item status.");
    }
  };

  useEffect(() => {
    fetchBranchMenuItems();
  }, []);

  return (
    <>
      <ManagerHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Branch Menu Management</h1>

        {/* Add New Menu Item Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add Menu Item to Branch</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addBranchMenuItem();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="User ID"
                value={newMenuItem.user_id}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, user_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Item ID"
                value={newMenuItem.item_id}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, item_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Menu Item
            </button>
          </form>
        </div>

        {/* Delete Menu Item Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Delete Menu Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteBranchMenuItem();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="User ID"
                value={deleteMenuItem.user_id}
                onChange={(e) => setDeleteMenuItem({ ...deleteMenuItem, user_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Item ID"
                value={deleteMenuItem.item_id}
                onChange={(e) => setDeleteMenuItem({ ...deleteMenuItem, item_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Menu Item
            </button>
          </form>
        </div>

        {/* Update Menu Item Status Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Update Menu Item Status</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateBranchMenuItemStatus();
            }}
          >
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="User ID"
                value={updateMenuItem.user_id}
                onChange={(e) => setUpdateMenuItem({ ...updateMenuItem, user_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Item ID"
                value={updateMenuItem.item_id}
                onChange={(e) => setUpdateMenuItem({ ...updateMenuItem, item_id: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <select
                value={updateMenuItem.is_available.toString()}
                onChange={(e) =>
                  setUpdateMenuItem({
                    ...updateMenuItem,
                    is_available: e.target.value === "true" ? 1 : 0,
                  })
                }
                className="p-2 border rounded"
                required
              >
                <option value="1">Available</option>
                <option value="0">Unavailable</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Status
            </button>
          </form>
        </div>

        {/* Branch Menu Items List */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Branch Menu Items</h2>
          <button
            onClick={fetchBranchMenuItems}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Reload Menu Items
          </button>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Branch ID</th>
                <th className="border p-2">Item ID</th>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {branchMenuItems.length > 0 ? (
                branchMenuItems.map((item) => (
                  <tr key={`${item.branch_id}-${item.item_id}`}>
                    <td className="border p-2">{item.branch_id}</td>
                    <td className="border p-2">{item.item_id}</td>
                    <td className="border p-2">{item.item_name}</td>
                    <td className="border p-2">
                      {item.is_available ? "Available" : "Unavailable"}
                    </td>
                    <td className="border p-2">{formatPrice(item.base_price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border p-2 text-center">
                    No menu items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BranchMenuPage;
