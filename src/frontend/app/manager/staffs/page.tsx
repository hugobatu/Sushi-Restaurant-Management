"use client";

import React, { useEffect, useState } from "react";
import { ManagerHeader } from "@/components/Manager/manager-header";
import { SideNav } from "@/components/Manager/side-nav";
import Cookies from "js-cookie";

const StaffManagementPage = () => {
  interface Staff {
    staff_id: number;
    department_id: number[];
    staff_name: string;
    birth_date: string;
    phone_number: string;
    gender: string;
    salary: number;
    join_date: string;
    resign_date: string | null;
    staff_status: string;
    username: string;
    branch_id: string;
    department_name: string;
    base_salary: number;
  }

  interface StaffRating {
    staff_id: string;
    staff_name: string;
    Rating: number;
  }

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size
  const [totalRatings, setTotalRatings] = useState(0);

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffRatings, setStaffRatings] = useState<StaffRating[]>([]);
  const [searchName, setSearchName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [activeView, setActiveView] = useState("all"); // all, search, ratings

  const [currentUserId, setCurrentUserId] = useState(Cookies.get("user_id") || "");

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // Fetch staff by name
  const searchStaffByName = async () => {
    if (!currentUserId || !searchName) {
      showMessage("Please enter both User ID and Staff Name", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/manager/staff/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(currentUserId),
          staff_name: searchName
        })
      });
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
        showMessage("Staff search completed!", "success");
      } else {
        setStaffList([]);
        showMessage(data.message || "No staff found with that name.", "error");
      }
    } catch (error) {
      console.error("Error searching staff:", error);
      showMessage("Error occurred while searching staff.", "error");
    }
  };

  // Effect to fetch data based on active view
  useEffect(() => {
    const fetchAllStaffData = async () => {
      if (!currentUserId) {
        showMessage("Please enter User ID", "error");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/manager/staff/all-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(currentUserId)
          })
        });
        const data = await response.json();
        if (data.success) {
          setStaffList(data.data);
          showMessage("Staff data fetched successfully!", "success");
        } else {
          setStaffList([]);
          showMessage(data.message || "Error fetching staff data.", "error");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        showMessage("Error occurred while fetching staff data.", "error");
      }
    };

    const fetchStaffRatings = async () => {
      if (!currentUserId) {
        showMessage("Please enter User ID", "error");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/manager/staff/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(currentUserId),
            page_number: currentPage,
            page_size: pageSize
          })
        });
        const data = await response.json();
        if (data.success) {
          setStaffRatings(data.data);
          showMessage("Staff ratings fetched successfully!", "success");
        } else {
          setStaffRatings([]);
          showMessage(data.message || "Error fetching staff ratings.", "error");
        }
      } catch (error) {
        console.error("Error fetching staff ratings:", error);
        showMessage("Error occurred while fetching staff ratings.", "error");
      }
    };

    if (currentUserId) {
      if (activeView === "all") {
        fetchAllStaffData();
      } else if (activeView === "ratings") {
        fetchStaffRatings();
      }
    }
  }, [currentUserId, activeView]);

  useEffect(() => {
    const fetchStaffRatings = async () => {
      if (!currentUserId) {
        showMessage("Please enter User ID", "error");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/manager/staff/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(currentUserId),
            page_number: currentPage,
            page_size: pageSize
          })
        });
        const data = await response.json();
        if (data.success) {
          setStaffRatings(data.data);
          showMessage("Staff ratings fetched successfully!", "success");
        } else {
          setStaffRatings([]);
          showMessage(data.message || "Error fetching staff ratings.", "error");
        }
      } catch (error) {
        console.error("Error fetching staff ratings:", error);
        showMessage("Error occurred while fetching staff ratings.", "error");
      }
    };

    fetchStaffRatings();
  }, [currentPage]);

  return (
    <>
      <ManagerHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Staff Management</h1>

        {/* User ID Input */}
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter Your User ID"
            value={currentUserId}
            onChange={(e) => setCurrentUserId(e.target.value)}
            className="p-2 border rounded mr-4"
            required
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

        {/* Search Bar */}
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
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Branch</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Birth Date</th>
                  <th className="border p-2">Join Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Salary</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <tr key={staff.staff_id}>
                      <td className="border p-2">{staff.staff_id}</td>
                      <td className="border p-2">{staff.staff_name}</td>
                      <td className="border p-2">{staff.department_name}</td>
                      <td className="border p-2">{staff.branch_id}</td>
                      <td className="border p-2 capitalize">{staff.gender}</td>
                      <td className="border p-2">{staff.phone_number}</td>
                      <td className="border p-2">
                        {new Date(staff.birth_date).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        {new Date(staff.join_date).toLocaleDateString()}
                      </td>
                      <td className="border p-2 capitalize">{staff.staff_status}</td>
                      <td className="border p-2">{staff.salary.toLocaleString()} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="border p-2 text-center">
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
                </tr>
              </thead>
              <tbody>
                {staffRatings.length > 0 ? (
                  staffRatings.map((rating, index) => (
                    <tr key={index}>
                      <td className="border p-2">{rating.staff_id}</td>
                      <td className="border p-2">{rating.staff_name}</td>
                      <td className="border p-2">{rating.Rating}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border p-2 text-center">
                      No ratings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 text-center font-bold ${
            messageType === "success" ? "text-green-500" : "text-red-500"
          }`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default StaffManagementPage;