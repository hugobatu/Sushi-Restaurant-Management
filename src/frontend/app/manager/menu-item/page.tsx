"use client";

import React, { useEffect, useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav";

const BranchMenuPage = () => {
  interface BranchMenuItem {
    branch_id: string;
    menu_item_id: string;
    item_name: string;
    status: string;
    price: number;
  }

  const [branchMenuItems, setBranchMenuItems] = useState<BranchMenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    branch_id: "",
    menu_item_id: "",
    item_name: "",
    status: "available",
    price: 0
  });

  const [deleteMenuItem, setDeleteMenuItem] = useState({
    branch_id: "",
    menu_item_id: ""
  });

  const [updateMenuItem, setUpdateMenuItem] = useState({
    branch_id: "",
    menu_item_id: "",
    new_status: "",
  });

  const [message, setMessage] = useState("");

  // Fetch branch menu items
  const fetchBranchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-branch-item", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setBranchMenuItems(data.data);
        setMessage("Menu items fetched successfully!");
      } else {
        setBranchMenuItems([]);
        setMessage(data.message || "Error fetching menu items.");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMessage("Error occurred while fetching menu items.");
    }
  };

  // Add menu item to branch
  const addBranchMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-branch-item/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenuItem),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Menu item added successfully!");
        fetchBranchMenuItems();
        setNewMenuItem({
          branch_id: "",
          menu_item_id: "",
          item_name: "",
          status: "available",
          price: 0
        });
      } else {
        setMessage(data.message || "Error adding menu item.");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      setMessage("Error adding menu item.");
    }
  };

  // Delete menu item from branch
  const deleteBranchMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-branch-item/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteMenuItem),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Menu item deleted successfully!");
        fetchBranchMenuItems();
        setDeleteMenuItem({ branch_id: "", menu_item_id: "" });
      } else {
        setMessage(data.message || "Error deleting menu item.");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setMessage("Error deleting menu item.");
    }
  };

   // Update menu item status
   const updateBranchMenuItemStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-branch-item/change-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateMenuItem),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Menu item status updated successfully!");
        fetchBranchMenuItems();
        setUpdateMenuItem({ branch_id: "", menu_item_id: "", new_status: "" });
      } else {
        setMessage(data.message || "Error updating menu item status.");
      }
    } catch (error) {
      console.error("Error updating menu item status:", error);
      setMessage("Error updating menu item status.");
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
                placeholder="Branch ID"
                value={newMenuItem.branch_id}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, branch_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Menu Item ID"
                value={newMenuItem.menu_item_id}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, menu_item_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Item Name"
                value={newMenuItem.item_name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, item_name: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <select
                value={newMenuItem.status}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, status: e.target.value })
                }
                className="p-2 border rounded"
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="sold_out">Sold Out</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })
                }
                className="p-2 border rounded"
                required
                min="0"
                step="0.01"
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
                placeholder="Branch ID"
                value={deleteMenuItem.branch_id}
                onChange={(e) =>
                  setDeleteMenuItem({ ...deleteMenuItem, branch_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Menu Item ID"
                value={deleteMenuItem.menu_item_id}
                onChange={(e) =>
                  setDeleteMenuItem({ ...deleteMenuItem, menu_item_id: e.target.value })
                }
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
                placeholder="Branch ID"
                value={updateMenuItem.branch_id}
                onChange={(e) =>
                  setUpdateMenuItem({ ...updateMenuItem, branch_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Menu Item ID"
                value={updateMenuItem.menu_item_id}
                onChange={(e) =>
                  setUpdateMenuItem({ ...updateMenuItem, menu_item_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <select
                value={updateMenuItem.new_status}
                onChange={(e) =>
                  setUpdateMenuItem({ ...updateMenuItem, new_status: e.target.value })
                }
                className="p-2 border rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="sold_out">Sold Out</option>
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
                <th className="border p-2">Menu Item ID</th>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {branchMenuItems.length > 0 ? (
                branchMenuItems.map((item) => (
                  <tr key={`${item.branch_id}-${item.menu_item_id}`}>
                    <td className="border p-2">{item.branch_id}</td>
                    <td className="border p-2">{item.menu_item_id}</td>
                    <td className="border p-2">{item.item_name}</td>
                    <td className="border p-2">{item.status}</td>
                    <td className="border p-2">${item.price}</td>
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

        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default BranchMenuPage;
