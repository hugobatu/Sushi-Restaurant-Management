"use client";

import React, { useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

const BranchRevenuePage = () => {
  interface RevenueData {
    branch_name: string;
    Period: string;
    TotalRevenue: number;
    TotalOrders: number;
  }

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [dateRange, setDateRange] = useState({ start_date: "", end_date: "" });
  const [groupBy, setGroupBy] = useState("day");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(Cookies.get("user_id") || "");

  const fetchBranchRevenue = async () => {
    if (!dateRange.start_date || !dateRange.end_date || !groupBy || !userId) {
      setStatus("Please fill all required fields (User ID, Date Range, Group By).");
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:8000/manager/branch-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
          group_by: groupBy,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRevenueData(data.data);
        setStatus("Data loaded successfully!");
      } else {
        setRevenueData([]);
        setStatus(data.message || "Error fetching revenue data.");
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setStatus("Failed to fetch revenue data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerHeader />
      <SideNav />

      <div className="ml-60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Branch Revenue Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
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
            <button
              onClick={fetchBranchRevenue}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load Data
            </button>
          </div>
        </div>

        {/* Revenue Table */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-blue-500">Loading...</div>
            ) : revenueData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Period</th>
                      <th className="px-4 py-2 text-left">Branch</th>
                      <th className="px-4 py-2 text-left">Total Revenue</th>
                      <th className="px-4 py-2 text-left">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{item.Period}</td>
                        <td className="px-4 py-2">{item.branch_name}</td>
                        <td className="px-4 py-2">{item.TotalRevenue.toLocaleString()} VND</td>
                        <td className="px-4 py-2">{item.TotalOrders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500">No revenue data available.</div>
            )}
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

export default BranchRevenuePage;
