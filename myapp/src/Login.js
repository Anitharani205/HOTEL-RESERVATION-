import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, role } = formData;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (role === "admin") {
      // Check frontend admin credentials
      if (email === adminCredentials.email && password === adminCredentials.password) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("name", "Admin");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials");
      }
    } else {
      // User login via backend
      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("role", data.role);
          localStorage.setItem("name", data.name);
          navigate("/enter-hotel");
        } else {
          setError(data.message || "Login failed");
        }
      } catch {
        setError("Server error. Try again later.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
