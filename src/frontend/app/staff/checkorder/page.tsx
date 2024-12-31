"use client";

import React, { useEffect, useState } from "react";
import { StaffHeader } from "@/components/Staff/staff-header";
import { SideNav } from "@/components/Staff/side-nav";

const CustomerOrderPage = () => {
  interface Order {
    order_id: string;
    customer_name: string;
    total_amount: number;
    order_status: string;
  }

  const [customerForm, setCustomerForm] = useState({
    customer_name: "",
    email: "",
    phone_number: "",
    gender: "",
    birth_date: "",
    id_number: "",
  });

  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    notes: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const fetchOrders = async () => {
    const userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('user_id='))
        ?.split('=')[1];

    if (!userId) {
        setMessage("User ID is missing in cookies.");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8000/staff/customer/order/view?user_id=${userId}&order_status=pending`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = await response.json();

        if (data.success) {
            setOrders(data.order);
            setMessage("Orders fetched successfully!");
        } else {
            setOrders([]);
            setMessage(data.message || "No orders found.");
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        setMessage("An error occurred while fetching orders.");
    }
};



  // Add Customer
  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/staff/customer/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerForm),
      });
      const data = await response.json();
      if (data.success) {
        alert("Customer added successfully!");
        setCustomerForm({
          customer_name: "",
          email: "",
          phone_number: "",
          gender: "",
          birth_date: "",
          id_number: "",
        });
      } else {
        alert(data.message || "Error adding customer.");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setMessage("An error occurred while adding the customer.");
    }
  };

  // Create Order
  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/staff/customer/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Order created successfully!");
        fetchOrders();
        setOrderForm({
          customer_id: "",
          notes: "",
        });
      } else {
        setMessage(data.message || "Error creating order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage("An error occurred while creating the order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <StaffHeader />
      <SideNav />
      <div className="ml-60 p-6">
        <h1 className="font-bold text-4xl mb-6">Customer & Order Management</h1>

        {/* Add Customer Form */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Add Customer</h2>
          <form
            onSubmit={handleAddCustomer}
            className="grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Customer Name"
              value={customerForm.customer_name}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, customer_name: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={customerForm.email}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, email: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={customerForm.phone_number}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, phone_number: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <select
              value={customerForm.gender}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, gender: e.target.value })
              }
              className="p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="date"
              value={customerForm.birth_date}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, birth_date: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="ID Number"
              value={customerForm.id_number}
              onChange={(e) =>
                setCustomerForm({ ...customerForm, id_number: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Customer
            </button>
          </form>
        </div>

        {/* Create Order Form KHÔNG DÙNG CÁI NÀY NỮA ĐÃ LÀM XONG FLOW KHÁC RỒI
        <div className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h2 className="font-bold text-xl mb-4">Create Order</h2>
          <form
            onSubmit={handleCreateOrder}
            className="grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Customer ID"
              value={orderForm.customer_id}
              onChange={(e) =>
                setOrderForm({ ...orderForm, customer_id: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Order Notes"
              value={orderForm.notes}
              onChange={(e) =>
                setOrderForm({ ...orderForm, notes: e.target.value })
              }
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="col-span-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Order
            </button>
          </form>
        </div> */}

{/* Orders List */}
<div className="border p-4 rounded-lg">
  <h2 className="font-bold text-xl mb-4">Orders List</h2>
  <table className="w-full border-collapse border">
    <thead>
      <tr>
        <th className="border p-2">Order ID</th>
        <th className="border p-2">Customer</th>
        <th className="border p-2">Order Type</th>
        <th className="border p-2">Status</th>

      </tr>
    </thead>
    <tbody>
      {orders.length > 0 ? (
        orders.map((order) => (
          <tr key={order.order_id}>
            <td className="border p-2">{order.order_id}</td>
            <td className="border p-2">{order.customer_name}</td>
            <td className="border p-2">{order.total_amount}</td>
            <td className="border p-2">{order.order_status}</td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="text-center p-4">
            No orders available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default CustomerOrderPage;
