"use client";

import React, { useEffect, useState } from "react";
import { StaffHeader } from "@/components/Staff/staff-header";
import { SideNav } from "@/components/Staff/side-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CustomerManagementPage = () => {
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [orderForm, setOrderForm] = useState({
    customer_id: '',
    items: [],
    total: 0,
    notes: '',
  });

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/customer/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Customer added successfully');
        setCustomerForm({ name: '', phone: '', email: '', address: '' });
      } else {
        setStatus(data.message || 'Error adding customer');
      }
    } catch (error) {
      setStatus('Failed to add customer');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/customer/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Order created successfully');
        setOrderForm({ customer_id: '', items: [], total: 0, notes: '' });
        fetchOrders();
      } else {
        setStatus(data.message || 'Error creating order');
      }
    } catch (error) {
      setStatus('Failed to create order');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch('/customer/order/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (response.ok) {
        setStatus('Order confirmed successfully');
        fetchOrders();
      } else {
        setStatus('Error confirming order');
      }
    } catch (error) {
      setStatus('Failed to confirm order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch('/customer/order/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (response.ok) {
        setStatus('Order deleted successfully');
        fetchOrders();
      } else {
        setStatus('Error deleting order');
      }
    } catch (error) {
      setStatus('Failed to delete order');
    }
  };

  const handleExportBill = async (orderId) => {
    try {
      const response = await fetch('/customer/export-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (response.ok) {
        setStatus('Bill exported successfully');
      } else {
        setStatus('Error exporting bill');
      }
    } catch (error) {
      setStatus('Failed to export bill');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/customer/order/view');
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setStatus('Error fetching orders');
      }
    } catch (error) {
      setStatus('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffHeader />
      <SideNav />
      
      <div className="ml-60 p-6">
        {/* Add Customer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                className="w-full border p-2"
                placeholder="Customer Name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              />
              <input
                className="w-full border p-2"
                placeholder="Phone Number"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              />
              <input
                className="w-full border p-2"
                placeholder="Email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
              />
              <input
                className="w-full border p-2"
                placeholder="Address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
              />
              <Button type="submit">Add Customer</Button>
            </form>
          </CardContent>
        </Card>

        {/* Create Order Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <input
                className="w-full border p-2"
                placeholder="Customer ID"
                value={orderForm.customer_id}
                onChange={(e) => setOrderForm({ ...orderForm, customer_id: e.target.value })}
              />
              <input
                className="w-full border p-2"
                placeholder="Order Notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              />
              <Button type="submit">Create Order</Button>
            </form>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4">{order.id}</td>
                      <td className="px-6 py-4">{order.customer_name}</td>
                      <td className="px-6 py-4">${order.total}</td>
                      <td className="px-6 py-4">{order.status}</td>
                      <td className="px-6 py-4 space-x-2">
                        <Button size="sm" onClick={() => handleConfirmOrder(order.id)}>Confirm</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                        <Button size="sm" variant="outline" onClick={() => handleExportBill(order.id)}>Export Bill</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {status && (
          <div className={`mt-4 p-4 rounded-lg ${status.includes('Error') || status.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagementPage;
