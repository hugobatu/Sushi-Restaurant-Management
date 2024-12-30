
"use client";

import "./StaffReservationForm.css";
import { useState } from "react";

const StaffReservationForm = () => {
  const [formData, setFormData] = useState({
    guests: 0,
    date: "",
    time: "",
    customer_name: "",
    table_number: "",
    phone_number: ""
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
          <label htmlFor="user_id" className="form-label">User ID</label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1] || ''}
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
            value={formData.customer_name || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer_name" className="form-label">Nhập SDT</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="table_number" className="form-label">Chọn bàn 1-30</label>
          <select
            id="table_number"
            name="table_number"
            value={formData.table_number || ''}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Chọn bàn</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
              <option key={number} value={number}>
          {number}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="submit-button"
          onClick={() => {
            const cookies = document.cookie;
            const role = cookies.split('; ').find(row => row.startsWith('role='))?.split('=')[1];
            const token = cookies.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            const username = cookies.split('; ').find(row => row.startsWith('username='))?.split('=')[1];
            const user_id = cookies.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];

            const checkedItems = JSON.parse(localStorage.getItem('checkedItems') || '[]');
            const formattedCheckedItems = checkedItems.map((item: { id: string, quantity: number }) => `ID: ${item.id}, Quantity: ${item.quantity}`).join('\n');
            const totalAmount = localStorage.getItem('totalAmount');

            console.log("Cookies:", cookies);
            console.log("Role:", role);
            console.log("Token:", token);
            console.log("User Name:", username);
            console.log("user_id: ", user_id);
            console.log("Customer Name:", formData.customer_name);
            console.log("Table Number:", formData.table_number);
            console.log("Phone Number:", formData.phone_number);
            console.log("Checked Items:", formattedCheckedItems);
            console.log("Total Amount:", totalAmount);

            // đợi API của Quân Bùi (chua co nen lam alert)
            fetch('/api/reservations', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
              user_id,
              customer_name: formData.customer_name,
              phone_number: formData.phone_number,
              table_number: formData.table_number,
              items: checkedItems,
              total_amount: totalAmount
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
            alert(`Form Data:\nuser_id: ${user_id}\nRole: ${role}\nCustomer Name: ${formData.customer_name}\nPhone Number: ${formData.phone_number}\nTable ID: ${formData.table_number}\nChecked Items:\n${formattedCheckedItems}\nTotal Amount: ${totalAmount}`);
          }}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default StaffReservationForm;