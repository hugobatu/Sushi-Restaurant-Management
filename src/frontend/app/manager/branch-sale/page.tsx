"use client";

import React, { useEffect, useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BranchRevenuePage = () => {
  interface RevenueData {
    date: string;
    total_revenue: number;
    order_count: number;
    average_order: number;
  }

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });
  const [groupBy, setGroupBy] = useState("day"); // Grouping option
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState({
    total_revenue: 0,
    total_orders: 0,
    average_order: 0,
    revenue_growth: 0
  });

  // Fetch branch revenue data
  useEffect(() => {
    const fetchBranchRevenue = async () => {
      if (!dateRange.start_date || !dateRange.end_date || !groupBy) {
        setStatus("Please select both start and end dates and a grouping option.");
        return;
      }

      try {
        const response = await fetch(`/manager/branch-sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            user_id: 1, // Replace with actual user ID from session or auth
            group_by: groupBy,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setRevenueData(data.data);
          
          // Calculate summary metrics
          const totalRev = data.data.reduce((sum: number, day: RevenueData) => sum + day.total_revenue, 0);
          const totalOrders = data.data.reduce((sum: number, day: RevenueData) => sum + day.order_count, 0);
          
          // Calculate revenue growth (comparing first and last day)
          const firstDay = data.data[0]?.total_revenue || 0;
          const lastDay = data.data[data.data.length - 1]?.total_revenue || 0;
          const growth = firstDay ? ((lastDay - firstDay) / firstDay) * 100 : 0;
          
          setSummary({
            total_revenue: totalRev,
            total_orders: totalOrders,
            average_order: totalOrders > 0 ? totalRev / totalOrders : 0,
            revenue_growth: growth
          });

          setStatus("Data loaded successfully");
        } else {
          setRevenueData([]);
          setStatus(data.message || "Error fetching revenue data");
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setStatus("Failed to fetch revenue data");
      }
    };

    fetchBranchRevenue();
  }, [dateRange, groupBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerHeader />
      <SideNav />
      
      <div className="ml-60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Branch Revenue Dashboard</h1>
          
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${summary.total_revenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.total_orders.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${summary.average_order.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${summary.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.revenue_growth.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Revenue Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueData.length > 0 ? (
                    revenueData.map((day) => (
                      <tr key={day.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${day.total_revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{day.order_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${(day.total_revenue / day.order_count).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No revenue data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {status && (
          <div className={`mt-4 p-4 rounded-lg ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchRevenuePage;
