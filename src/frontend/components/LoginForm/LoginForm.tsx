// "use client";

// import "./LoginStyles.css";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await fetch("http://localhost:8000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log("Login Response:", data); 
//       console.log("data role: ",data.role);
//       console.log("data username:", data.username);
//       if (response.ok) {
//         setMessage("Login successful!");
//         localStorage.setItem("token", data.token); // Store JWT token
//         console.log("Generated token: ", data.token);


//         if (data.role === "customer") {
//           router.push("/customer"); // Redirect to the guest page
//         } else if(data.role === "admin") {
//           router.push("/admin"); // Redirect to the dashboard
//         }
//           else if(data.role === "manager") {
//             router.push("/manager");
//           }
//           else if(data.role === "staff"){
//             router.push("/staff");
//           }
//       } else {
//         setMessage(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       setMessage("An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-form-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <div className="form-header">
//           <h1 className="form-title">Đăng Nhập</h1>
//           <p className="form-subtitle">Vui lòng nhập thông tin đăng nhập của bạn</p>
//         </div>

//         <div className="form-group">
//           <label htmlFor="username" className="form-label">Tên Đăng Nhập *</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password" className="form-label">Mật Khẩu *</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//         </div>

//         <button type="submit" className="submit-button" disabled={loading}>
//           {loading ? "Logging in..." : "Đăng Nhập"}
//         </button>

//         {message && <p className="form-message">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default LoginForm;


"use client";

import "./LoginStyles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data); 
      console.log("data role: ", data.role);
      console.log("data username:", data.username);
      console.log("user_id: ",data.user_id);

      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token); // Store JWT token in localStorage
        console.log("Generated token: ", data.token);

        // Store username, role, and token in cookies
        Cookies.set("username", data.username, { expires: 7 }); // Expires in 7 days
        Cookies.set("role", data.role, { expires: 7 });
        Cookies.set("token", data.token, { expires: 7 });
        Cookies.set("user_id", data.user_id, { expires: 7 });
        
        // Redirect based on role
        if (data.role === "customer") {
          router.push("/customer");
        } else if (data.role === "admin") {
          router.push("/admin");
        } else if (data.role === "manager") {
          router.push("/manager");
        } else if (data.role === "staff") {
          router.push("/staff");
        }
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <h1 className="form-title">Đăng Nhập</h1>
          <p className="form-subtitle">Vui lòng nhập thông tin đăng nhập của bạn</p>
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">Tên Đăng Nhập *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Mật Khẩu *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Đăng Nhập"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
