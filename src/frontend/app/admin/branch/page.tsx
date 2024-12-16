"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const BranchPage = () => {
  interface Branch {
    branch_id: string;
    branch_name: string;
    branch_address: string;
    phone_number: string;
    branch_status: string;
  }

  const [branches, setBranches] = useState<Branch[]>([]);
  const [newBranch, setNewBranch] = useState({
    region_id: "",
    branch_name: "",
    branch_address: "",
    opening_time: "",
    closing_time: "",
    phone_number: "",
    has_bike_parking_lot: false,
    has_car_parking_lot: false,
  });
  const [pagination, setPagination] = useState({
    page_number: 1,
    page_size: 5,
  });
  const [totalBranches, setTotalBranches] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch branch data
  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/branch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagination),
      });
      const data = await response.json();

      if (data.success) {
        setBranches(data.data);
        setTotalBranches(data.pagination.total || 0);
      } else {
        setBranches([]);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // Add a new branch
  const addBranch = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/branch/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Branch added successfully!");
        fetchBranches(); // Refresh branch list
      } else {
        setMessage(data.message || "Error adding branch.");
      }
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  // Update branch information
  const updateBranch = async (branch_id: string, new_status: string) => {
    try {
      const response = await fetch("http://localhost:8000/company/branch/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch_id, new_status }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Branch updated successfully!");
        fetchBranches(); // Refresh branch list
      } else {
        setMessage(data.message || "Error updating branch.");
      }
    } catch (error) {
      console.error("Error updating branch:", error);
    }
  };

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

  // Fetch branches on pagination or page load
  useEffect(() => {
    fetchBranches();
  }, [pagination]);

  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Branch Management</h1>

        {/* Add New Branch Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add New Branch</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addBranch();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Region ID"
                value={newBranch.region_id}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, region_id: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Branch Name"
                value={newBranch.branch_name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, branch_name: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newBranch.branch_address}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, branch_address: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="time"
                placeholder="Opening Time"
                value={newBranch.opening_time}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, opening_time: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="time"
                placeholder="Closing Time"
                value={newBranch.closing_time}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, closing_time: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newBranch.phone_number}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, phone_number: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={newBranch.has_bike_parking_lot}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        has_bike_parking_lot: e.target.checked,
                      })
                    }
                  />{" "}
                  Bike Parking
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={newBranch.has_car_parking_lot}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        has_car_parking_lot: e.target.checked,
                      })
                    }
                  />{" "}
                  Car Parking
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Branch
            </button>
          </form>
        </div>

        {/* Branch List */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Branch List</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Branch Name</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.branch_id}>
                  <td className="border p-2">{branch.branch_name}</td>
                  <td className="border p-2">{branch.branch_address}</td>
                  <td className="border p-2">{branch.phone_number}</td>
                  <td className="border p-2">{branch.branch_status}</td>
                  <td className="border p-2">
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                      onClick={() => updateBranch(branch.branch_id, "working")}
                    >
                      Set Working
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => updateBranch(branch.branch_id, "closed")}
                    >
                      Set Closed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={pagination.page_number === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page_number} of{" "}
              {Math.ceil(totalBranches / pagination.page_size)}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={branches.length < pagination.page_size}
            >
              Next
            </button>
          </div>
        </div>

        {/* Display Messages */}
        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default BranchPage;
