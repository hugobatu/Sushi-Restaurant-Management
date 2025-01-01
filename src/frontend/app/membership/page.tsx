"use client";

import React, { useState } from "react";
import { CustomerHeader } from "@/components/CustomerPage/customer-header";

const MembershipPage = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [membershipData, setMembershipData] = useState<any | null>(null);
    const [message, setMessage] = useState("");

    const handleViewPoints = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        if (!phoneNumber) {
            setMessage("Please enter your phone number.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/customer/view-points", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone_number: phoneNumber }),
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
            setMessage("An error occurred while fetching membership points or no active membership found for the provided phone number..");
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
                        value={phoneNumber}
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
                        <h2 className="text-2xl font-bold mb-4">
                            Membership Details
                        </h2>
                        <p>
                            <strong>Customer Name:</strong> {membershipData.customer_name}
                        </p>
                        <p>
                            <strong>Phone Number:</strong> {membershipData.phone_number}
                        </p>
                        <p>
                            <strong>Card ID:</strong> {membershipData.card_id}
                        </p>
                        <p>
                            <strong>Membership Level:</strong> {membershipData.level_name}
                        </p>
                        <p>
                            <strong>Points:</strong> {membershipData.points}
                        </p>
                        <p>
                            <strong>Status:</strong> {membershipData.membership_status}
                        </p>
                        <p>
                            <strong>Issued Date:</strong>{" "}
                            {new Date(membershipData.issued_date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Valid Until:</strong>{" "}
                            {new Date(membershipData.valid_until).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipPage;
