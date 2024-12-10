"use client";

import "./formStyles.css";
import { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    memberCard: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // TODO: Gửi form lên API
  };

  return (
    <div className="registration-form-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h1>ĐĂNG KÝ TÀI KHOẢN</h1>
        <h3>Vui lòng nhập thông tin đầy đủ để tạo tài khoản</h3>

        {/* Tên Đăng Nhập */}
        <div className="form-group">
          <label htmlFor="username">Tên Đăng Nhập *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Số Điện Thoại */}
        <div className="form-group">
          <label htmlFor="phone">Số Điện Thoại *</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mã Thẻ Thành Viên */}
        <div className="form-group">
          <label htmlFor="memberCard">Mã Thẻ Thành Viên *</label>
          <input
            type="text"
            id="memberCard"
            name="memberCard"
            value={formData.memberCard}
            onChange={handleChange}
          />
        </div>

        {/* Họ Và Tên */}
        <div className="form-group">
          <label htmlFor="fullName">Họ Và Tên *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mật Khẩu */}
        <div className="form-group">
          <label htmlFor="password">Mật Khẩu *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Xác Nhận Mật Khẩu */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nút Gửi */}
        <button type="submit" className="submit-button">
          Đăng Ký
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
