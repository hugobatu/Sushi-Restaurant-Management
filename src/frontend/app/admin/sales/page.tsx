"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const SalePage = () => {
  interface Sale {
    id?: string;
    name?: string;
    revenue?: number;
    quantity?: number;
    period?: string;
  }

  const [branchSales, setBranchSales] = useState<Sale[]>([]);
  const [itemSales, setItemSales] = useState<Sale[]>([]);
  const [currentTab, setCurrentTab] = useState<"branch" | "item">("branch");
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    branch_id: "",
    region_id: "",
    group_by: "month", // Default to "month" for branch sales
  });

  const [pagination, setPagination] = useState({
    page_number: 1,
    page_size: 5,
  });

  const [message, setMessage] = useState("");

  // Fetch branch sales
  const fetchBranchSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/branchsales", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters }),
      });

      const data = await response.json();
      if (data.success) {
        setBranchSales(data.data);
        setMessage("");
      } else {
        setBranchSales([]);
        setMessage(data.message || "No branch sales found.");
      }
    } catch (error) {
      console.error("Error fetching branch sales:", error);
      setMessage("Error fetching branch sales.");
    }
  };

  // Fetch item sales stats
  const fetchItemSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/itemsales", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters }),
      });

      const data = await response.json();
      if (data.success) {
        setItemSales(data.data);
        setMessage("");
      } else {
        setItemSales([]);
        setMessage(data.message || "No item sales stats found.");
      }
    } catch (error) {
      console.error("Error fetching item sales stats:", error);
      setMessage("Error fetching item sales stats.");
    }
  };

  // Handle tab switching and fetch data
  useEffect(() => {
    if (currentTab === "branch") {
      fetchBranchSales();
    } else {
      fetchItemSales();
    }
  }, [currentTab, filters]);

  // Pagination handlers
  const handleNextPage = () => {
    setPagination((prev) => ({ ...prev, page_number: prev.page_number + 1 }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      page_number: Math.max(prev.page_number - 1, 1),
    }));
  };

  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Sales Management</h1>

        {/* Filters Section */}
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-4">Filters</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentTab === "branch") fetchBranchSales();
              else fetchItemSales();
            }}
            className="grid grid-cols-3 gap-4"
          >
            <input
              type="date"
              placeholder="Start Date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="date"
              placeholder="End Date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="p-2 border rounded"
              required
            />
            {currentTab === "branch" && (
              <select
                value={filters.group_by}
                onChange={(e) => setFilters({ ...filters, group_by: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            )}
            <input
              type="text"
              placeholder="Branch ID (optional)"
              value={filters.branch_id}
              onChange={(e) => setFilters({ ...filters, branch_id: e.target.value })}
              className="p-2 border rounded"
            />
            {currentTab === "item" && (
              <input
                type="text"
                placeholder="Region ID (optional)"
                value={filters.region_id}
                onChange={(e) => setFilters({ ...filters, region_id: e.target.value })}
                className="p-2 border rounded"
              />
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setCurrentTab("branch")}
            className={`px-4 py-2 rounded ${
              currentTab === "branch" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Branch Sales
          </button>
          <button
            onClick={() => setCurrentTab("item")}
            className={`px-4 py-2 rounded ${
              currentTab === "item" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Item Sales Stats
          </button>
        </div>

        {/* Table Data */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold text-xl mb-4">
            {currentTab === "branch" ? "Branch Sales" : "Item Sales Stats"}
          </h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                {currentTab === "branch" ? (
                  <>
                    <th className="border p-2">Branch ID</th>
                    <th className="border p-2">Revenue</th>
                    <th className="border p-2">Period</th>
                  </>
                ) : (
                  <>
                    <th className="border p-2">Item Name</th>
                    <th className="border p-2">Quantity Sold</th>
                    <th className="border p-2">Branch ID</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(currentTab === "branch" ? branchSales : itemSales).map((sale, index) => (
                <tr key={index}>
                  {currentTab === "branch" ? (
                    <>
                      <td className="border p-2">{sale.id}</td>
                      <td className="border p-2">{sale.revenue}</td>
                      <td className="border p-2">{sale.period}</td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{sale.name}</td>
                      <td className="border p-2">{sale.quantity}</td>
                      <td className="border p-2">{sale.id}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default SalePage;
