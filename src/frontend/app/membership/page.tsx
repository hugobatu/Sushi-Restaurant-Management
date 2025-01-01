"use client";

import React, { useState } from "react";
import { CustomerHeader } from "@/components/CustomerPage/customer-header";

const MembershipPage = () => {
    const [phone_number, setPhoneNumber] = useState("");
    const [membershipData, setMembershipData] = useState<any | null>(null);
    const [message, setMessage] = useState("");

    const handleViewPoints = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        if (!phone_number) {
            setMessage("Please enter your phone number.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/customer/view-points", {
                method: "POST", // Corrected to POST
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone_number }), // Passing phone_number in the request body
            });

            const data = await response.json();

            if (data.success) {
                setMembershipData(data.data[0]); // Assume only one record per active membership
                setMessage("Membership information retrieved successfully!");
            } else {
                setMembershipData(null);
                setMessage(data.message || "No active membership found.");
            }
        } catch (error) {
            console.error("Error fetching membership points:", error);
            setMessage("An error occurred while fetching membership points.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <CustomerHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">View Membership Points</h1>
                <form
                    onSubmit={handleViewPoints}
                    className="bg-white shadow p-6 rounded mb-6"
                >
                    <label htmlFor="phone" className="block font-medium mb-2">
                        Enter Your Phone Number:
                    </label>
                    <input
                        id="phone"
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        View Points
                    </button>
                </form>

                {message && (
                    <p className="text-center text-red-500 font-bold">{message}</p>
                )}

                {membershipData && (
                    <div className="bg-white shadow p-6 rounded">
                        <h2 className="text-2xl font-bold mb-4">Membership Details</h2>
                        <table className="w-full border-collapse border text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Field</th>
                                    <th className="border p-2">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border p-2">Customer Name</td>
                                    <td className="border p-2">{membershipData.customer_name}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Phone Number</td>
                                    <td className="border p-2">{membershipData.phone_number}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Card ID</td>
                                    <td className="border p-2">{membershipData.card_id}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Membership Level</td>
                                    <td className="border p-2">{membershipData.level_name}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Points</td>
                                    <td className="border p-2">{membershipData.points}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Status</td>
                                    <td className="border p-2">{membershipData.membership_status}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Issued Date</td>
                                    <td className="border p-2">
                                        {new Date(membershipData.issued_date).toLocaleDateString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Valid Until</td>
                                    <td className="border p-2">
                                        {new Date(membershipData.valid_until).toLocaleDateString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipPage;
