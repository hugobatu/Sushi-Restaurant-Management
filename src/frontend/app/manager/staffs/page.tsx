"use client";

import React, { useEffect, useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav";

const StaffManagementPage = () => {
  interface Staff {
    staff_id: string;
    name: string;
    branch_id: string;
    role: string;
    phone: string;
    email: string;
  }

  interface StaffRating {
    staff_id: string;
    staff_name: string;
    rating: number;
    comment: string;
    rating_date: string;
  }

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffRatings, setStaffRatings] = useState<StaffRating[]>([]);
  const [searchName, setSearchName] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState("all"); // all, search, ratings

  // Fetch staff by name - kept outside useEffect as it's triggered by button click
  const searchStaffByName = async () => {
    try {
      const response = await fetch(`http://localhost:8000/company/manager/staff/name?name=${searchName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
        setMessage("Staff search completed!");
      } else {
        setStaffList([]);
        setMessage(data.message || "No staff found with that name.");
      }
    } catch (error) {
      console.error("Error searching staff:", error);
      setMessage("Error occurred while searching staff.");
    }
  };

  // Effect to fetch data based on active view
  useEffect(() => {
    // Moved functions inside useEffect to avoid dependency issues
    const fetchAllStaffData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/company/manager/staff/all-data?branch_id=${selectedBranchId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          setStaffList(data.data);
          setMessage("Staff data fetched successfully!");
        } else {
          setStaffList([]);
          setMessage(data.message || "Error fetching staff data.");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setMessage("Error occurred while fetching staff data.");
      }
    };

    const fetchStaffRatings = async () => {
      try {
        const response = await fetch(`http://localhost:8000/company/manager/staff/ratings?branch_id=${selectedBranchId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          setStaffRatings(data.data);
          setMessage("Staff ratings fetched successfully!");
        } else {
          setStaffRatings([]);
          setMessage(data.message || "Error fetching staff ratings.");
        }
      } catch (error) {
        console.error("Error fetching staff ratings:", error);
        setMessage("Error occurred while fetching staff ratings.");
      }
    };

    if (selectedBranchId) {
      if (activeView === "all") {
        fetchAllStaffData();
      } else if (activeView === "ratings") {
        fetchStaffRatings();
      }
    }
  }, [selectedBranchId, activeView]);

  return (
    <>
      <ManagerHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Staff Management</h1>

        {/* Branch Selection */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter Branch ID"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="p-2 border rounded mr-4"
          />
        </div>

        {/* View Selection Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveView("all")}
            className={`px-4 py-2 rounded ${
              activeView === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            View All Staff
          </button>
          <button
            onClick={() => setActiveView("search")}
            className={`px-4 py-2 rounded ${
              activeView === "search"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Search by Name
          </button>
          <button
            onClick={() => setActiveView("ratings")}
            className={`px-4 py-2 rounded ${
              activeView === "ratings"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            View Ratings
          </button>
        </div>

        {/* Search Bar (Only shown in search view) */}
        {activeView === "search" && (
          <div className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter staff name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="p-2 border rounded flex-grow"
              />
              <button
                onClick={searchStaffByName}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Staff List Table */}
        {(activeView === "all" || activeView === "search") && (
          <div className="border p-4 rounded-lg">
            <h2 className="font-bold text-xl mb-4">Staff List</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Staff ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Branch ID</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <tr key={staff.staff_id}>
                      <td className="border p-2">{staff.staff_id}</td>
                      <td className="border p-2">{staff.name}</td>
                      <td className="border p-2">{staff.branch_id}</td>
                      <td className="border p-2">{staff.role}</td>
                      <td className="border p-2">{staff.phone}</td>
                      <td className="border p-2">{staff.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border p-2 text-center">
                      No staff data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Staff Ratings Table */}
        {activeView === "ratings" && (
          <div className="border p-4 rounded-lg">
            <h2 className="font-bold text-xl mb-4">Staff Ratings</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Staff ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Rating</th>
                  <th className="border p-2">Comment</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {staffRatings.length > 0 ? (
                  staffRatings.map((rating, index) => (
                    <tr key={index}>
                      <td className="border p-2">{rating.staff_id}</td>
                      <td className="border p-2">{rating.staff_name}</td>
                      <td className="border p-2">{rating.rating}</td>
                      <td className="border p-2">{rating.comment}</td>
                      <td className="border p-2">{rating.rating_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="border p-2 text-center">
                      No ratings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default StaffManagementPage;