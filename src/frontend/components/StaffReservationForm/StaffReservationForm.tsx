"use client";

import { sourceMapsEnabled } from "process";
import "./StaffReservationForm.css";
import { useState } from "react";

const StaffReservationForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    table_number: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn hành động mặc định của form

    // Lấy thông tin từ cookies và localStorage
    const cookies = document.cookie;
    const token = cookies.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
    const user_id = cookies.split("; ").find((row) => row.startsWith("user_id="))?.split("=")[1];

    if (!token || !user_id) {
      alert("Authentication error: Missing token or user ID.");
      return;
    }

    const checkedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]");
    const simplifiedItems = checkedItems.map((item: { id: string; quantity: number }) => ({
      item_id: item.id,
      quantity: item.quantity,
    }));

    const totalAmount = localStorage.getItem("totalAmount");

    // Kiểm tra dữ liệu đầu vào
    if (!formData.customer_name || !formData.phone_number || !formData.table_number || simplifiedItems.length === 0) {
      alert("Please fill in all required fields and select items.");
      return;
    }

    try {
      // Gọi API `createOrder`
      const response = await fetch("http://localhost:8000/staff/customer/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id,
          customer_name: formData.customer_name,
          phone_number: formData.phone_number,
          table_id: formData.table_number,
          items: simplifiedItems,
          total_amount: totalAmount,
        }),
      });

      console.log("Simplified Items:", simplifiedItems);

      const data = await response.json();

      if (response.ok) {
        // Hiển thị thông báo thành công và thông tin chi tiết
        alert(`Order created successfully!\n\nDetails:\n- User ID: ${user_id}\n- Customer Name: ${formData.customer_name}\n- Phone Number: ${formData.phone_number}\n- Table Number: ${formData.table_number}\n- Items:\n${checkedItems
          .map((item: { id: string; quantity: number }) => `  - Item ID: ${item.id}, Quantity: ${item.quantity}`)
          .join("\n")}\n- Total Amount: ${totalAmount}`);

      } else {
        alert(`Failed to create order\nOr this customer has no data, please ask them to get data, then input in database."`);

      }
    } catch (error) {
      alert("An error occurred while creating the order.");
      console.error("Fetch Error:", error);
    }
  };

  return (
    <div className="reservation-form-container">
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-header">
          <h1 className="form-title">Đặt bàn</h1>
          <p className="form-subtitle">Vui lòng điền đầy đủ thông tin</p>
        </div>

        <div className="form-group">
          <label htmlFor="user_id" className="form-label">User ID</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={typeof document !== "undefined" ? document.cookie.split("; ").find((row) => row.startsWith("user_id="))?.split("=")[1] || "" : ""}
            readOnly
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer_name" className="form-label">Nhập tên khách hàng</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name || ""}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number" className="form-label">Nhập SDT</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="table_number" className="form-label">Chọn bàn 1-30</label>
          <select
            id="table_number"
            name="table_number"
            value={formData.table_number || ""}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Chọn bàn</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Gửi
        </button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default StaffReservationForm;
