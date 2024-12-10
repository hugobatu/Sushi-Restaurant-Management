"use client";

import "./formStyles.css";
import { useState } from "react";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    branch: "",
    guests: 0,
    date: "",
    time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // TODO: Send the form data to the API or process it further
  };

  return (
    <div className="reservation-form-container">
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-header">
          <h1 className="form-title">Đặt bàn</h1>
          <p className="form-subtitle">Vui lòng điền đầy đủ thông tin</p>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">Họ và tên *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Số điện thoại *</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="branch" className="form-label">Chọn chi nhánh *</label>
          <select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Chọn chi nhánh</option>
            <option value="HCM">TP Hồ Chí Minh</option>
            <option value="HN">Hà Nội</option>
            {/* Add more branches as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="guests" className="form-label">Số lượng khách</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">Ngày</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label">Giờ</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
