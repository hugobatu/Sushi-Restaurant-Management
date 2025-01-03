"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Manager/side-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SalesDashboardPage = () => {
  interface BranchSales {
    branch_name: string;
    Period: string;
    TotalRevenue: number;
    TotalOrders: number;
  }

  interface ItemSales {
    item_name: string;
    TotalRevenue: number;
    TotalQuantitySold: number;
  }

  const [branchSales, setBranchSales] = useState<BranchSales[]>([]);
  const [itemSales, setItemSales] = useState<ItemSales[]>([]);
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });
  const [groupBy, setGroupBy] = useState("day");
  const [branchId, setBranchId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch branch sales
  const fetchBranchSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/branchsales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
          group_by: groupBy,
          branch_id: branchId || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setBranchSales(data.data);
        setStatus("Branch sales data loaded successfully.");
      } else {
        setBranchSales([]);
        setStatus(data.message || "Failed to fetch branch sales data.");
      }
    } catch (error) {
      console.error("Error fetching branch sales:", error);
      setStatus("Error fetching branch sales data.");
    }
  };

  // Fetch item sales
  const fetchItemSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/itemsales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
          branch_id: branchId || null,
          region_id: regionId || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setItemSales(data.data);
        setStatus("Item sales data loaded successfully.");
      } else {
        setItemSales([]);
        setStatus(data.message || "Failed to fetch item sales data.");
      }
    } catch (error) {
      console.error("Error fetching item sales:", error);
      setStatus("Error fetching item sales data.");
    }
  };

  useEffect(() => {
    if (dateRange.start_date && dateRange.end_date) {
      fetchBranchSales();
      fetchItemSales();
    }
  }, [dateRange, groupBy, branchId, regionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <SideNav />

      <div className="ml-60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
            <input
              type="text"
              placeholder="Branch ID (Optional)"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Region ID (Optional)"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Branch Sales Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Branch Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2">Branch</th>
                    <th className="border p-2">Period</th>
                    <th className="border p-2">Total Revenue</th>
                    <th className="border p-2">Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {branchSales.length > 0 ? (
                    branchSales.map((branch, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{branch.branch_name}</td>
                        <td className="border p-2">{branch.Period}</td>
                        <td className="border p-2">{branch.TotalRevenue.toLocaleString()} VND</td>
                        <td className="border p-2">{branch.TotalOrders}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="border p-2 text-center">
                        No branch sales data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Item Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Item Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2">Item Name</th>
                    <th className="border p-2">Total Revenue</th>
                    <th className="border p-2">Total Quantity Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {itemSales.length > 0 ? (
                    itemSales.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{item.item_name}</td>
                        <td className="border p-2">{item.TotalRevenue.toLocaleString()} VND</td>
                        <td className="border p-2">{item.TotalQuantitySold}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="border p-2 text-center">
                        No item sales data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {status && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              status.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboardPage;