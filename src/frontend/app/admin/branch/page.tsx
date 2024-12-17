"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const BranchPage = () => {
  interface Branch {
    region_id: string;
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

  const [updateBranchData, setUpdateBranchData] = useState({
    branch_id: "",
    new_status: "",
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
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
        setTotalBranches(data.pagination.total || 0);
        setMessage("Branches fetched successfully!");
      } else {
        setBranches([]);
        setMessage(data.message || "Error fetching branches.");
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setMessage("Error occurred while fetching branches.");
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
      setMessage("Error adding branch.");
    }
  };

  // Update branch
  const updateBranch = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/branch/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBranchData),
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
      setMessage("Error updating branch.");
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

  // Fetch branches on page load or pagination change
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
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Branch
            </button>
          </form>
        </div>

        {/* Update Branch Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Update Branch</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateBranch();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Branch ID"
                value={updateBranchData.branch_id}
                onChange={(e) =>
                  setUpdateBranchData({
                    ...updateBranchData,
                    branch_id: e.target.value,
                  })
                }
                className="p-2 border rounded"
                required
              />
              <select
                value={updateBranchData.new_status}
                onChange={(e) =>
                  setUpdateBranchData({
                    ...updateBranchData,
                    new_status: e.target.value,
                  })
                }
                className="p-2 border rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="working">Working</option>
                <option value="closed">Closed</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={updateBranchData.has_bike_parking_lot}
                    onChange={(e) =>
                      setUpdateBranchData({
                        ...updateBranchData,
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
                    checked={updateBranchData.has_car_parking_lot}
                    onChange={(e) =>
                      setUpdateBranchData({
                        ...updateBranchData,
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
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Branch
            </button>
          </form>
        </div>

        {/* Branch List */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Branch List</h2>
            <button
            onClick={fetchBranches}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
            Reload Branches
            </button>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Region ID</th>
                <th className="border p-2">Branch ID</th>
                <th className="border p-2">Branch Name</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.branch_id}>
                    <td className="border p-2">{branch.region_id}</td>
                    <td className="border p-2">{branch.branch_id}</td>
                    <td className="border p-2">{branch.branch_name}</td>
                    <td className="border p-2">{branch.branch_address}</td>
                    <td className="border p-2">{branch.phone_number}</td>
                    <td className="border p-2">{branch.branch_status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border p-2 text-center">
                    No branches available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={pagination.page_number === 1}
            >
              Previous
            </button>

            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={branches.length < pagination.page_size}
            >
              Next
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default BranchPage;
