"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const RegionPage = () => {
  const [regionName, setRegionName] = useState(""); // For adding a region
  const [message, setMessage] = useState(""); // Display success or error messages

  // Add a new region
  const addRegion = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/region/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region_name: regionName }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("New region added successfully!");
        setRegionName(""); // Reset input field
      } else {
        setMessage(data.message || "Error adding region.");
      }
    } catch (error) {
      console.error("Error adding region:", error);
      setMessage("An error occurred while adding the region.");
    }
  };

  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Region Management</h1>

        {/* Add New Region Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add New Region</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addRegion();
            }}
          >
            <div>
              <input
                type="text"
                placeholder="Region Name"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Region
            </button>
          </form>
        </div>

        {/* Display Message */}
        {message && (
          <div className="mt-4 text-center text-green-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default RegionPage;
