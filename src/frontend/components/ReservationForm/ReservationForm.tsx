// "use client";

// import "./ReservationStyles.css";
// import { useState } from "react";

// const ReservationForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     branch: "",
//     guests: 0,
//     date: "",
//     time: "",
//   });


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form data submitted:", formData);
//     // TODO: Send the form data to the API or process it further
    
//   };

//   return (
//     <div className="reservation-form-container">
//       <form onSubmit={handleSubmit} className="reservation-form">
//         <div className="form-header">
//           <h1 className="form-title">Đặt bàn</h1>
//           <p className="form-subtitle">Vui lòng điền đầy đủ thông tin</p>
//         </div>

//         <div className="form-group">
//           <label htmlFor="name" className="form-label">Họ và tên *</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="phone" className="form-label">Số điện thoại *</label>
//           <input
//             type="text"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email" className="form-label">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="branch" className="form-label">Chọn chi nhánh *</label>
//           <select
//             id="branch"
//             name="branch"
//             value={formData.branch}
//             onChange={handleChange}
//             className="form-input"
//             required
//           >
//             <option value="">Chọn chi nhánh</option>
//             <option value="HCM">TP Hồ Chí Minh</option>
//             <option value="HN">Hà Nội</option>
//             {/* Add more branches as needed */}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="guests" className="form-label">Số lượng khách</label>
//           <input
//             type="number"
//             id="guests"
//             name="guests"
//             value={formData.guests}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="date" className="form-label">Ngày</label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="time" className="form-label">Giờ</label>
//           <input
//             type="time"
//             id="time"
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             className="form-input"
//           />
//         </div>

//         <button type="submit" className="submit-button">
//           Gửi
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ReservationForm;




// Form 2 theo table ReservationOrder
"use client";

import "./ReservationStyles.css";
import { useState } from "react";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    guests: 0,
    date: "",
    time: "",
    customer_name: "",
    table_number: "",
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
            console.log("Checked Items:", formattedCheckedItems);
            console.log("Total Amount:", totalAmount);

            // đợi API của Quân Bùi
            fetch('/api/reservations', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
              user_id,
              customer_name: formData.customer_name,
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
            alert(`Form Data:\nuser_id: ${user_id}\nRole: ${role}\nCustomer Name: ${formData.customer_name}\nTable ID: ${formData.table_number}\nChecked Items:\n${formattedCheckedItems}\nTotal Amount: ${totalAmount}`);
          }}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;