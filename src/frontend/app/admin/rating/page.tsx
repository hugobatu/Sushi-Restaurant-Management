"use client";
import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/Admin/admin-header";
import { SideNav } from "@/components/Admin/side-nav";

const RatingPage = () => {
    interface BranchRating {
        branch_id: string;
        branch_name: string;
        rating_id: number;
        branch_rating: number;
    }

    interface StaffRating {
        id: number;
        staff_name: string;
        StaffRating: number;
        TotalRatings: number;
    }

    const [branchRatings, setBranchRatings] = useState<BranchRating[]>([]);
    const [staffRatings, setStaffRatings] = useState<StaffRating[]>([]);
    const [currentTab, setCurrentTab] = useState<"branch" | "staff">("branch");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [pagination, setPagination] = useState({
        page_number: 1,
        page_size: 10,
    });

    const [totalPages, setTotalPages] = useState(1);

    // Fetch branch ratings
    const fetchBranchRatings = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(
                `http://localhost:8000/company/ratings/branches`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pagination),
                }
            );

            const data = await response.json();
            if (response.ok && data.success) {
                setBranchRatings(data.data || []);
                if (!data.data?.length) {
                    setError("No branch ratings found.");
                }
            } else {
                setError(data.message || "Failed to fetch branch ratings.");
                setBranchRatings([]);
            }
        } catch (error) {
            console.error("Error fetching branch ratings:", error);
            setError("Error connecting to the server.");
            setBranchRatings([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch staff ratings
    const fetchStaffRatings = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(
                `http://localhost:8000/company/ratings/staffs`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pagination),
                }
            );

            const data = await response.json();
            if (response.ok && data.success) {
                setStaffRatings(data.data || []);
                console.log(data.data);
                if (!data.data?.length) {
                    setError("No staff ratings found.");
                }
            } else {
                setError(data.message || "Failed to fetch staff ratings.");
                setStaffRatings([]);
            }
        } catch (error) {
            console.error("Error fetching staff ratings:", error);
            setError("Error connecting to the server.");
            setStaffRatings([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentTab === "branch") {
            fetchBranchRatings();
        } else {
            fetchStaffRatings();
        }
    }, [currentTab, pagination.page_number]);

    const handleReload = () => {
        if (currentTab === "branch") {
            fetchBranchRatings();
        } else {
            fetchStaffRatings();
        }
    };

    const handleNextPage = () => {
        setPagination((prev) => ({
            ...prev,
            page_number: prev.page_number + 1,
        }));
    };

    const handlePreviousPage = () => {
        setPagination((prev) => ({
            ...prev,
            page_number: Math.max(prev.page_number - 1, 1),
        }));
    };

    const handlePageClick = (pageNumber: number) => {
        setPagination((prev) => ({
            ...prev,
            page_number: pageNumber,
        }));
    };

    const renderBranchTable = () => (
        <table className="w-full border-collapse border">
            <thead>
                <tr>
                    <th className="border p-2">Branch ID</th>
                    <th className="border p-2">Branch Name</th>
                    <th className="border p-2">Rating ID</th>
                    <th className="border p-2">Rating</th>
                </tr>
            </thead>
            <tbody>
                {branchRatings.map((rating) => (
                    <tr key={`${rating.branch_id}-${rating.rating_id}`}>
                        <td className="border p-2">{rating.branch_id}</td>
                        <td className="border p-2">{rating.branch_name}</td>
                        <td className="border p-2">{rating.rating_id}</td>
                        <td className="border p-2">{rating.branch_rating}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderStaffTable = () => (
        <table className="w-full border-collapse border">
            <thead>
                <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Rating</th>
                    <th className="border p-2">Total Rating</th>   
                </tr>
            </thead>
            <tbody>
                {staffRatings.map((rating) => (
                    <tr key={rating.id}>
                        <td className="border p-2">{rating.staff_name}</td>
                        <td className="border p-2">{rating.StaffRating}</td>
                        <td className="border p-2">{rating.TotalRatings}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <AdminHeader />
            <SideNav />
            <div className="ml-60 p-6">
                <h1 className="font-bold text-4xl mb-6">Ratings Management</h1>

                <div className="mb-4 flex space-x-4">
                    <button
                        onClick={() => setCurrentTab("branch")}
                        className={`px-4 py-2 rounded ${
                            currentTab === "branch"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                        }`}
                    >
                        Branch Ratings
                    </button>
                    <button
                        onClick={() => setCurrentTab("staff")}
                        className={`px-4 py-2 rounded ${
                            currentTab === "staff"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                        }`}
                    >
                        Staff Ratings
                    </button>
                    <button
                        onClick={handleReload}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Reload"}
                    </button>
                </div>

                <div className="border p-4 rounded-lg">
                    <h2 className="font-bold text-xl mb-4">
                        {currentTab === "branch" ? "Branch Ratings" : "Staff Ratings"}
                    </h2>

                    {isLoading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-4">{error}</div>
                    ) : (
                        currentTab === "branch" ? renderBranchTable() : renderStaffTable()
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousPage}
                            className="px-4 py-2 bg-gray-300 rounded"
                            disabled={pagination.page_number === 1 || isLoading}
                        >
                            Previous
                        </button>
                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageClick(index + 1)}
                                    className={`px-4 py-2 rounded ${
                                        pagination.page_number === index + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300"
                                    }`}
                                    disabled={isLoading}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleNextPage}
                            className="px-4 py-2 bg-gray-300 rounded"
                            disabled={isLoading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RatingPage;
