'use client';

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const StaffsPage = () => {
  interface Staff {
    staff_id: number;
    staff_name: string;
    birth_date: string;
    phone_number: string;
    gender: string;
    staff_status: string;
    branch_name: string;
    department_id: string;
    salary: string;
    join_date: string; 
    resign_date: string; 
    username: string
  }

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    branch_id: "",
    department_name: "",
    staff_name: "",
    birth_date: "",
    phone_number: "",
    gender: "",
  });
  const [updateSalaryData, setUpdateSalaryData] = useState({
    staff_id: "",
    increase_rate: "",
  });
  const [transferData, setTransferData] = useState({
    staff_id: "",
    new_branch_id: "",
    new_department_name: ""
  });
  const [searchName, setSearchName] = useState("");
  const [staffToFire, setStaffToFire] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page_number: 1,
    page_size: 5,
  });
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch staff data
  const fetchStaffs = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/company/staff/getstaffdata?page_number=${pagination.page_number}&page_size=${pagination.page_size}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );
      const data = await response.json();
      if (data.success) {
        setStaffs(data.data);
        setTotalStaffs(data.pagination.total || 0);
        setMessage("Staffs fetched successfully!");
      } else {
        setStaffs([]);
        setMessage(data.message || "Error fetching staff");
      }
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };
  // Add a new staff
  const addStaff = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/staff/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Staff added successfully!");
        fetchStaffs(); // Refresh staff list
      } else {
        setMessage(data.message || "Error adding staff.");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  // Fire a staff
  const fireStaff = async () => {
    if (!staffToFire) return;
    try {
      const response = await fetch("http://localhost:8000/company/staff/fire", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_id: staffToFire }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Staff fired successfully!");
        fetchStaffs(); // Refresh staff list
        setStaffToFire(null);
      } else {
        setMessage(data.message || "Error firing staff.");
      }
    } catch (error) {
      console.error("Error firing staff:", error);
    }
  };

  // Update staff salary
  const updateSalary = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/staff/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateSalaryData),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Salary updated successfully!");
        fetchStaffs(); // Refresh staff list
      } else {
        setMessage(data.message || "Error updating salary.");
      }
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  // Transfer staff to a new branch
  const transferStaff = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/staff/transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferData),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Staff transferred successfully!");
        fetchStaffs(); // Refresh staff list
      } else {
        setMessage(data.message || "Error transferring staff.");
      }
    } catch (error) {
      console.error("Error transferring staff:", error);
    }
  };

  // Search staff by name
  const searchStaffByName = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/staff/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_name: searchName }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setStaffs(data.data);  // Assuming 'data' contains the staff data
        setMessage(`Found ${data.data.length} result(s).`);
      } else {
        setStaffs([]);
        setMessage(data.message || "No staff found.");
      }
    } catch (error) {
      console.error("Error searching staff:", error);
      setMessage("Error searching staff.");
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

  useEffect(() => {
    fetchStaffs();
  }, [pagination]);

  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Staff Management</h1>

        {/* Add New Staff Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add New Staff</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addStaff();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
              type="text"
              placeholder="Branch ID"
              value={newStaff.branch_id}
              onChange={(e) =>
                setNewStaff({ ...newStaff, branch_id: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <select
              value={newStaff.department_name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, department_name: e.target.value })
              }
              className="p-2 border rounded"
              required
              >
              <option value="">Select Department</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="security">Security</option>
              <option value="chef">Chef</option>
              </select>
              <input
              type="text"
              placeholder="Staff Name"
              value={newStaff.staff_name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, staff_name: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <input
              type="date"
              placeholder="Birth Date"
              value={newStaff.birth_date}
              onChange={(e) =>
                setNewStaff({ ...newStaff, birth_date: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <input
              type="text"
              placeholder="Phone Number"
              value={newStaff.phone_number}
              onChange={(e) =>
                setNewStaff({ ...newStaff, phone_number: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <select
              value={newStaff.gender}
              onChange={(e) =>
                setNewStaff({ ...newStaff, gender: e.target.value })
              }
              className="p-2 border rounded"
              required
              >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Staff
            </button>
          </form>
        </div>

        {/* Update Staff Section */}
        <div className="border p-4 rounded-lg bg-yellow-100 mb-6 hover:bg-yellow-300">
          <h2 className="font-bold text-xl mb-4">Update Staff Salary</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSalary();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
          type="number"
          placeholder="Staff ID"
          value={updateSalaryData.staff_id}
          onChange={(e) =>
            setUpdateSalaryData({ ...updateSalaryData, staff_id: e.target.value })
          }
          className="p-2 border rounded"
          required
              />
              <input
          type="number"
          placeholder="New Increate Rate"
          value={updateSalaryData.increase_rate}
          onChange={(e) =>
            setUpdateSalaryData({ ...updateSalaryData, increase_rate: e.target.value })
          }
          className="p-2 border rounded"
          required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Update Salary
            </button>
          </form>
        </div>

        {/* Transfer Staff Section */}
        <div className="border p-4 rounded-lg bg-green-100 mb-6 hover:bg-green-300">
            <h2 className="font-bold text-xl mb-4 ">Transfer Staff</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              transferStaff();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
              type="text"
              placeholder="Staff ID"
              value={transferData.staff_id}
              onChange={(e) =>
              setTransferData({ ...transferData, staff_id: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <input
              type="text"
              placeholder="New Branch ID"
              value={transferData.new_branch_id}
              onChange={(e) =>
              setTransferData({ ...transferData, new_branch_id: e.target.value })
              }
              className="p-2 border rounded"
              required
              />
              <select
              value={transferData.new_department_name}
              onChange={(e) =>
              setTransferData({ ...transferData, new_department_name: e.target.value })
              }
              className="p-2 border rounded"
              required
              >
              <option value="">Select Department</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="security">Security</option>
              <option value="chef">Chef</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Transfer Staff
            </button>
          </form>
        </div>

        {/* Fire Staff Section */}
        <div className="border p-4 rounded-lg bg-red-100 mb-6 hover:bg-red-300">
          <h2 className="font-bold text-xl mb-4">Fire Staff</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fireStaff();
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <input
                type="number"
                placeholder="Staff ID"
                value={staffToFire || ""}
                onChange={(e) => setStaffToFire(Number(e.target.value))}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Fire Staff
            </button>
          </form>
        </div>

{/* Search Staff by Name
<div className="mt-4">
  <h2 className="font-bold text-xl mb-4">Search Staff by Name</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      searchStaffByName();  // Trigger search when the form is submitted
    }}
  >
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Staff Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}  // Update search term
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  </form>
  <div className="border p-4 rounded-lg mt-4">
    <h2 className="font-bold text-xl mb-4">Search Results</h2>
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          <th className="border p-2">Staff ID</th>
          <th className="border p-2">Staff Name</th>
          <th className="border p-2">Phone Number</th>
          <th className="border p-2">Gender</th>
          <th className="border p-2">Department ID</th>
          <th className="border p-2">Salary</th>
          <th className="border p-2">Staff Status</th>
        </tr>
      </thead>
      <tbody>
        {staffs.map((staff) => (
          <tr key={staff.staff_id}>
            <td className="border p-2">{staff.staff_id}</td>
            <td className="border p-2">{staff.staff_name}</td>
            <td className="border p-2">{staff.phone_number}</td>
            <td className="border p-2">{staff.gender}</td>
            <td className="border p-2">{staff.department_id}</td>
            <td className="border p-2">{staff.salary}</td>
            <td className="border p-2">{staff.staff_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div> */}


        {/* Staff List */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold text-xl mb-4">Staff List</h2>
          <button
            onClick={fetchStaffs}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh Staff List
          </button>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
          <th className="border p-2">Staff ID</th>
          <th className="border p-2">Staff Name</th>
          <th className="border p-2">Phone Number</th>
          <th className="border p-2">Gender</th>

          <th className="border p-2">Department ID</th>
          <th className="border p-2">Salary</th>
          <th className="border p-2">Staff Status</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
          <tr key={staff.staff_id}>
            <td className="border p-2">{staff.staff_id}</td>
            <td className="border p-2">{staff.staff_name}</td>
            <td className="border p-2">{staff.phone_number}</td>
            <td className="border p-2">{staff.gender}</td>

            <td className="border p-2">{staff.department_id}</td>
            <td className="border p-2">{staff.salary}</td>
            <td className="border p-2">{staff.staff_status}</td>


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
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={staffs.length < pagination.page_size}
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

export default StaffsPage;
