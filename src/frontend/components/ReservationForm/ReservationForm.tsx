"use client";


import "./ReservationStyles.css";
import { useState } from "react";
import { CustomerHeader } from "../../components/CustomerPage/customer-header";
const ReservationForm = () => {
  const [formType, setFormType] = useState("reserve"); // Toggle between reserve or delivery
  const [formData, setFormData] = useState({
    branch_id: "",
    date: "",
    time: "",
    num_guests: 0,
    address: "", // Used only for delivery orders
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve cookies for user_id and token
    const cookies = document.cookie;
    const user_id = cookies.split("; ").find((row) => row.startsWith("user_id="))?.split("=")[1];
    const token = cookies.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

    if (!user_id || !token) {
      alert("Authentication error: Missing user ID or token.");
      return;
    }

    // Fetch items from localStorage
    const checkedItems = JSON.parse(localStorage.getItem("checkedItems") || "[]");

    // Format items JSON
    const items_json = checkedItems.map((item: { id: string; quantity: number }) => ({
      item_id: item.id,
      quantity: item.quantity,
    }));

    const payload = {
      user_id,
      branch_id: formData.branch_id,
      datetime: `${formData.date}T${formData.time}`,
      ...(formType === "reserve" ? { num_guests: formData.num_guests } : { address: formData.address }),
      items_json,
    };

    const endpoint = formType === "reserve" ? "/customer/reserve-order" : "/customer/delivery-order";

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${formType === "reserve" ? "Reservation" : "Delivery"} order placed successfully!`);
        console.log("Success:", data);
      } else {
        alert(data.message || `Failed to place ${formType} order.`);
      }
    } catch (error) {
      console.error(`Error placing ${formType} order:`, error);
      alert(`An error occurred. Please try again.`);
    }
  };

  return (
    <>
      <CustomerHeader/>
      <div className="reservation-form-container">
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-header">
            <h1 className="form-title">
              {formType === "reserve" ? "Đặt bàn trước" : "Giao tận nơi"}
            </h1>
            <p className="form-subtitle">Vui lòng điền đầy đủ thông tin</p>
          </div>

          {/* Toggle Form Type */}
          <div className="form-group">
            <label className="form-label">Chọn loại đơn hàng</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="form-input"
            >
              <option value="reserve">Đặt bàn</option>
              <option value="delivery">Giao hàng</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="branch_id" className="form-label">Chọn chi nhánh</label>
            <select
              id="branch_id"
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Chọn chi nhánh</option>
              <option value="B001">B001 - TPHCM - TEKASHIMAYA QUẬN 1</option>
              <option value="B002">B002 - TPHCM - NGUYỄN VĂN CỪ</option>
              <option value="B003">B003 - NT - TOKYO DELI KOMODO</option>
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 4} value={`B00${i + 4}`}>B00{i + 4}</option>
              ))}
              <option value="B010">B010</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">Chọn ngày</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label">Chọn giờ</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Reserve-specific Fields */}
          {formType === "reserve" && (
            <div className="form-group">
              <label htmlFor="num_guests" className="form-label">Số lượng khách</label>
              <input
                type="number"
                id="num_guests"
                name="num_guests"
                value={formData.num_guests}
                onChange={handleChange}
                className="form-input"
                min={1}
                required
              />
            </div>
          )}

          {/* Delivery-specific Fields */}
          {formType === "delivery" && (
            <div className="form-group">
              <label htmlFor="address" className="form-label">Địa chỉ giao hàng</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          )}

          <button type="submit" className="submit-button">
            Gửi
          </button>
        </form>
      </div>
    </>
  );
};

export default ReservationForm;
