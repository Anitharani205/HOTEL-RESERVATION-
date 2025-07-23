import React, { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupData = { name, email, password, confirmPassword, role };

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("user");
      } else {
        setMessage(data.message || "Signup failed!");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 5,
        marginTop: 40,
      }}
    >
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          />
        </label>

        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          />
        </label>

        <label>
          Signup as:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          type="submit"
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          Signup
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: 10,
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Signup;
