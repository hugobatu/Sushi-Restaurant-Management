"use client";

import React, { useEffect, useState } from "react";
import { StaffHeader } from "@/components/Staff/staff-header";
import { SideNav } from "@/components/Staff/side-nav";

const CustomerOrderPage = () => {
  interface Order {
    order_id: string;
    customer_name: string;
    order_type: string;
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


  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratings, setRatings] = useState({
    servile_manner_rating: 1,
    branch_rating: 1,
    food_quality_rating: 1,
    price_rating: 1,
    surroundings_rating: 1,
    personal_response: "",
  });


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

  // Fetch orders
  const fetchOrders = async () => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_id="))
      ?.split("=")[1];

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

  // Confirm Direct Service Order
  const handleConfirmDirectOrder = async (order_id: string) => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_id="))
      ?.split("=")[1];

    if (!userId) {
      setMessage("User ID is missing in cookies.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/staff/customer/order/confirm-direct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            order_id,
            ...ratings,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Order confirmed successfully!");
        fetchOrders();
        setSelectedOrder(null);
      } else {
        setMessage(data.message || "Error confirming order.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      setMessage("An error occurred while confirming the order.");
    }
  };

  // Confirm Reserve or Delivery Order
  const handleConfirmReserveDelivery = async (order_id: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/staff/customer/order/confirm-reserve-delivery",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`Order ID: ${order_id} confirmed successfully.`);
        setMessage(`Order ID: ${order_id} confirmed successfully.`);
        fetchOrders();
      } else {
        setMessage(data.message || "Error confirming reserve/delivery order.");
      }
    } catch (error) {
      console.error("Error confirming reserve/delivery order:", error);
      setMessage("An error occurred while confirming the reserve/delivery order.");
    }
  };

  // Delete order
  const handleDeleteOrder = async (order_id: string) => {
    if (window.confirm(`Are you sure you want to delete order ID: ${order_id}?`)) {
      try {
        const response = await fetch("http://localhost:8000/staff/customer/order/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage(`Order ID: ${order_id} deleted successfully.`);
          fetchOrders();
        } else {
          setMessage(data.message || "Error deleting order.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        setMessage("An error occurred while deleting the order.");
      }
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
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="border p-2">{order.order_id}</td>
                    <td className="border p-2">{order.customer_name}</td>
                    <td className="border p-2">{order.order_type}</td>
                    <td className="border p-2">{order.order_status}</td>
                    <td className="border p-2 space-x-2">
                      {order.order_type === "Direct Service Order" && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Confirm
                        </button>
                      )}
                      {["Reservation Order", "Delivery Order"].includes(order.order_type) && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                          onClick={() => handleConfirmReserveDelivery(order.order_id)}
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      >
                        Delete
                      </button>
                    </td>
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

        {/* Confirm Order Form for Direct Service Orders */}
        {selectedOrder && selectedOrder.order_type === "Direct Service Order" && (
          <div className="border p-4 rounded-lg bg-gray-100 mt-6">
            <h2 className="font-bold text-xl mb-4">Confirm Order - {selectedOrder.order_id}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmDirectOrder(selectedOrder.order_id);
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label>Servile Manner Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings.servile_manner_rating}
                  onChange={(e) =>
                    setRatings({ ...ratings, servile_manner_rating: +e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Branch Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings.branch_rating}
                  onChange={(e) =>
                    setRatings({ ...ratings, branch_rating: +e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Food Quality Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings.food_quality_rating}
                  onChange={(e) =>
                    setRatings({ ...ratings, food_quality_rating: +e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Price Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings.price_rating}
                  onChange={(e) =>
                    setRatings({ ...ratings, price_rating: +e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label>Surroundings Rating (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratings.surroundings_rating}
                  onChange={(e) =>
                    setRatings({ ...ratings, surroundings_rating: +e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-2">
                <label>Personal Response:</label>
                <textarea
                  value={ratings.personal_response}
                  onChange={(e) =>
                    setRatings({ ...ratings, personal_response: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm Order
              </button>
            </form>
          </div>
        )}

        {message && (
          <div className="mt-4 text-center text-red-500 font-bold">{message}</div>
        )}
      </div>
    </>
  );
};

export default CustomerOrderPage;
