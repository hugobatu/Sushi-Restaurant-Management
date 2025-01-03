'use client';

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/Admin/side-nav"

const MenuPage = () => {
  //--------------Menu Item Management----------------
  interface MenuItem {
    item_name: string,
    description: string,
    base_price: number,
    status: string,
    category_id: string,
    image_url: string,
  }
  const [newMenuItem, setNewMenuItem] = useState({
    item_name: "",
    description: "",
    base_price: "",
    status: "available",
    category_id: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");
  const [itemDelete, setItemDelete] = useState<string | null>(null);

  // Add a new menu item
  const addMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-item/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenuItem),
      });
      const data = await response.json();
      if (data.success) {
        alert("Menu Item added successfully!");
        fetchMenuListPage(currentPage); // Refresh menu list
      } else {
        alert(data.message || "Error adding menu item.");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  // Deleting menu item
  const deleteMenuItem = async () => {
    if (!itemDelete) return;
    try {
      const response = await fetch("http://localhost:8000/company/menu-item/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemDelete }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Menu Item deleted successfully!");
        fetchMenuListPage(1); // Refresh menu list
        setItemDelete(null);
      } else {
        alert(data.message || "Error deleting menu item.");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };


  //-----------------Menu List-------------------
  interface MenuItemList {
    item_id: string,
    item_name: string,
    menu_item_description: string,
    base_price: number,
    menu_item_status: string,
    category_id: string,
    category_name: string,
    image_url: string,
    row_num: number,
  }
  const [menuItemList, setMenuItemList] = useState<MenuItemList[]>([]);

  // Get menu list
  // const fetchMenuList = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/company/menu-item/get`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       setMenuItemList(data.data);
  //       setMessage("Menu data fetched successfully!");
  //     } else {
  //       setMenuItemList([]);
  //       setMessage(data.message || "Error fetching menu data.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching menu data:", error);
  //     setMessage("Error occurred while fetching menu data.");
  //   }
  // };
  const fetchMenuListPage = async (pageNumber: number) => {
    try {
      const response = await fetch("http://localhost:8000/company/menu-item/get-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_number: pageNumber,
          page_size: 10,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMenuItemList(data.data);
        setTotalPages(Math.ceil(data.data[0].row_num / 10));
        console.log("Fetch");
      } else {
        setMenuItemList([]);
        setTotalPages(1);
        console.error("Error fetching menu items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  // useEffect(() => {
  //   //fetchMenuList();
  //   fetchMenuListPage();
  // }, []);

  // // Pagination State
  // const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 10;

  // // Calculate displayed rows
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentRows = menuItemList.slice(indexOfFirstRow, indexOfLastRow);

  // // Total pages
  // const totalPages = Math.ceil(menuItemList.length / rowsPerPage);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handlePageClick = (page: number) => {
  //   setCurrentPage(page);
  // };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    // Fetch initial data for page 1
    fetchMenuListPage(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //--------------Combo Management----------------
  interface Combo {
    combo_name: string,
    combo_description: string,
    item_ids: string[],
  }
  const [combo, setCombo] = useState<Combo[]>([]);
  const [newCombo, setNewCombo] = useState({
    combo_name: "",
    combo_description: "",
    item_ids: ["", "", ""],
  });
  const [comboDelete, setComboDelete] = useState<string | null>(null);

  // Add a new combo
  const addCombo = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/combo/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCombo),
      });
      const data = await response.json();
      if (data.success) {
        alert("Combo added successfully!");
      } else {
        alert(data.message || "Error adding combo.");
      }
    } catch (error) {
      console.error("Error adding combo:", error);
    }
  };

  // Deleting combo
  const deleteCombo = async () => {
    if (!comboDelete) return;
    try {
      const response = await fetch("http://localhost:8000/company/combo/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ combo_id: comboDelete }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Combo deleted successfully!");
        setComboDelete(null);
      } else {
        alert(data.message || "Error deleting combo.");
      }
    } catch (error) {
      console.error("Error deleting combo:", error);
    }
  };

  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Menu Management</h1>
        {/* Add New Menu Item Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add New Menu Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNewMenuItem({ ...newMenuItem, status: 'available' });
              addMenuItem();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
              type="text"
              placeholder="Menu Category Id"
              value={newMenuItem.category_id}
              onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, category_id: e.target.value })
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
              <input
              type="text"
              placeholder="Base Price"
              value={newMenuItem.base_price}
              onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, base_price: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <textarea
              placeholder="Item Description"
              value={newMenuItem.description}
              onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, description: e.target.value })
              }
              className="p-2 border rounded col-span-2 max-h-[120px] min-h-[120px]"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Menu Item
            </button>
          </form>
        </div>
        {/*message && <p className="mt-4 text-green-500">{message}</p>*/}
        {/* Delete Menu Item Section */}
        <div className="border p-4 rounded-lg bg-red-100 mb-6 hover:bg-red-300">
          <h2 className="font-bold text-xl mb-4">Delete Menu Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteMenuItem();
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <input
          type="string"
          placeholder="Menu Item ID"
          value={itemDelete || ""}
          onChange={(e) => setItemDelete(String(e.target.value))}
          className="p-2 border rounded"
          required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete Menu Item
            </button>
          </form>
        </div>

        {/* Menu List */}
        <div className="border p-4 rounded-lg mb-6">
          <h2 className="font-bold text-xl mb-4">Menu List</h2>
          <button
            // onClick={fetchMenuList}
            onClick={(e) => {
              e.preventDefault();
              fetchMenuListPage(1);
              handlePageClick(1);
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh Menu List
          </button>
          <table id="myTable" className="w-full border-collapse border">
            <thead>
              <tr>
                <th style={{ width: "100px" }} className="border p-2">Item ID</th>
                <th className="border p-2">Item Name</th>
                <th style={{ width: "150px" }} className="border p-2">Base Price</th>
                <th style={{ width: "120px" }} className="border p-2">Status</th>
                <th style={{ width: "180px" }} className="border p-2">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {menuItemList.length > 0 ? (
                menuItemList.map((item) => (
                  <tr key={item.item_id}>
                    <td className="border p-2">{item.item_id}</td>
                    <td className="border p-2">{item.item_name}</td>
                    <td className="border p-2">{item.base_price}</td>
                    <td className="border p-2">{item.menu_item_status}</td>
                    <td className="border p-2">{item.category_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border p-2 text-center">
                    No menu item available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
                {totalPages > 0 && (
                  <button
                    onClick={() => handlePageClick(1)}
                    type="button"
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {1}
                  </button>
                )}

                {currentPage > 4 && <div className={'px-4 py-2 font-bold'}>. . .</div>}

                {currentPage === totalPages && totalPages > 4 && (
                  <button
                    onClick={() => handlePageClick(currentPage - 3)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage - 3}
                  </button>
                )}
                {currentPage > 3 && (
                  <button
                    onClick={() => handlePageClick(currentPage - 2)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage - 2}
                  </button>
                )}
                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage - 1}
                  </button>
                )}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <button
                    onClick={() => handlePageClick(currentPage)}
                    type="button"
                  className={`px-4 py-2 rounded ${
                    currentPage !== 1 && currentPage !== totalPages
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  >
                    {currentPage}
                  </button>
                )}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage + 1}
                  </button>
                )}
                {currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageClick(currentPage + 2)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage + 2}
                  </button>
                )}
                {currentPage === 1 && totalPages > 4 && (
                  <button
                    onClick={() => handlePageClick(currentPage + 3)}
                    type="button"
                  className={'px-4 py-2 rounded bg-gray-300 text-black'}
                  >
                    {currentPage + 3}
                  </button>
                )}

                {currentPage < totalPages - 3 && <div className={'px-4 py-2 font-bold'}>. . .</div>}

                {totalPages !== 1 && (
                  <button
                    onClick={() => handlePageClick(totalPages)}
                    type="button"
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  >
                    {totalPages}
                  </button>
                )}
                {/* {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClick(index + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))} */}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Add Combo */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add New Combo</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCombo();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
          type="text"
          placeholder="Combo Name"
          value={newCombo.combo_name}
          onChange={(e) =>
            setNewCombo({ ...newCombo, combo_name: e.target.value })
          }
          className="p-2 border rounded col-span-2"
          required
              />
              <textarea
          placeholder="Combo Description"
          value={newCombo.combo_description}
          onChange={(e) =>
            setNewCombo({ ...newCombo, combo_description: e.target.value })
          }
          className="p-2 border rounded col-span-2 max-h-[120px] min-h-[120px]"
              />
              <input
          type="text"
          placeholder="Item ID 1"
          value={newCombo.item_ids[0] || ""}
          onChange={(e) =>
            setNewCombo({
              ...newCombo,
              item_ids: [e.target.value, newCombo.item_ids[1], newCombo.item_ids[2]],
            })
          }
          className="p-2 border rounded col-span-2"
          required
              />
              <input
          type="text"
          placeholder="Item ID 2"
          value={newCombo.item_ids[1] || ""}
          onChange={(e) =>
            setNewCombo({
              ...newCombo,
              item_ids: [newCombo.item_ids[0], e.target.value, newCombo.item_ids[2]],
            })
          }
          className="p-2 border rounded col-span-2"
              />
              <input
          type="text"
          placeholder="Item ID 3"
          value={newCombo.item_ids[2] || ""}
          onChange={(e) =>
            setNewCombo({
              ...newCombo,
              item_ids: [newCombo.item_ids[0], newCombo.item_ids[1], e.target.value],
            })
          }
          className="p-2 border rounded col-span-2"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Combo
            </button>
          </form>
        </div>

        {/* Delete Combo*/}
        <div className="border p-4 rounded-lg bg-red-100 mb-6 hover:bg-red-300">
          <h2 className="font-bold text-xl mb-4">Delete Combo</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteCombo();
              
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <input
                type="string"
                placeholder="Combo ID"
                value={comboDelete || ""}
                onChange={(e) => setComboDelete(String(e.target.value))}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete Combo
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MenuPage;