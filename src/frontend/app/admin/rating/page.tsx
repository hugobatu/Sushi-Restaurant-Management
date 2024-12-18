"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const RatingPage = () => {
    interface Rating {
        id: string;
        name: string;
        rating: number;
        comments: string;
    }

    const [branchRatings, setBranchRatings] = useState<Rating[]>([]);
    const [staffRatings, setStaffRatings] = useState<Rating[]>([]);
    const [currentTab, setCurrentTab] = useState<"branch" | "staff">("branch");

    const [pagination, setPagination] = useState({
        page_number: 1,
        page_size: 5,
    });

    const [totalItems, setTotalItems] = useState(0);
    const [message, setMessage] = useState("");

    // Fetch branch ratings
    const fetchBranchRatings = async () => {
        try {
            const response = await fetch("http://localhost:8000/company/ratings/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pagination),
            });

            const data = await response.json();
            if (data.success) {
                setBranchRatings(data.data);
                setTotalItems(data.pagination.total || 0);
            } else {
                setBranchRatings([]);
                setMessage(data.message || "No branch ratings found.");
            }
        } catch (error) {
            console.error("Error fetching branch ratings:", error);
            setMessage("Error fetching branch ratings.");
        }
    };

    // Fetch staff ratings
    const fetchStaffRatings = async () => {
        try {
            const response = await fetch("http://localhost:8000/company/ratings/staffs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pagination),
            });

            const data = await response.json();
            if (data.success) {
                setStaffRatings(data.data);
                setTotalItems(data.pagination.total || 0);
            } else {
                setStaffRatings([]);
                setMessage(data.message || "No staff ratings found.");
            }
        } catch (error) {
            console.error("Error fetching staff ratings:", error);
            setMessage("Error fetching staff ratings.");
        }
    };

    // Handle tab switching
    useEffect(() => {
        if (currentTab === "branch") {
            fetchBranchRatings();
        } else {
            fetchStaffRatings();
        }
    }, [currentTab, pagination]);

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

    // Reload handler
    const handleReload = () => {
        if (currentTab === "branch") {
            fetchBranchRatings();
        } else {
            fetchStaffRatings();
        }
    };

    return (
        <>
            <AdminHeader />
            <SideNav />
            <div className="ml-60 p-6">
                <h1 className="font-bold text-4xl mb-6">Ratings Management</h1>

                {/* Tab Navigation */}
                <div className="mb-4 flex space-x-4">
                    <button
                        onClick={() => setCurrentTab("branch")}
                        className={`px-4 py-2 rounded ${currentTab === "branch" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    >
                        Branch Ratings
                    </button>
                    <button
                        onClick={() => setCurrentTab("staff")}
                        className={`px-4 py-2 rounded ${currentTab === "staff" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    >
                        Staff Ratings
                    </button>
                    <button
                        onClick={handleReload}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Reload
                    </button>
                </div>

                {/* Table Data */}
                <div className="border p-4 rounded-lg">
                    <h2 className="font-bold text-xl mb-4">
                        {currentTab === "branch" ? "Branch Ratings" : "Staff Ratings"}
                    </h2>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Rating</th>
                                <th className="border p-2">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentTab === "branch" ? branchRatings : staffRatings).map((rating) => (
                                <tr key={rating.id}>
                                    <td className="border p-2">{rating.id}</td>
                                    <td className="border p-2">{rating.name}</td>
                                    <td className="border p-2">{rating.rating}</td>
                                    <td className="border p-2">{rating.comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
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
                        disabled={(currentTab === "branch" ? branchRatings : staffRatings).length < pagination.page_size}
                        >
                        Next
                        </button>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
                )}
            </div>
        </>
    );
};

export default RatingPage;
