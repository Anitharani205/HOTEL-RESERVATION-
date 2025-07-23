import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Page components
import Login from "./Login";
import SignUp from "./SignUp";
import Header from "./Header";
import Home from "./Home";
import BookingDetail from "./BookingDetail";
import EnterHotel from "./EnterHotel";
import RoomDetails from "./RoomDetails";
import AdminPage from "./AdminPage";
import BookingConfirmation from "./BookingConfirmation";
import Footer from "./Footer";

// Styles
import "./styles.css";

// ProtectedRoute component to protect routes like /admin
const ProtectedRoute = ({ children, roleRequired }) => {
  const userRole = localStorage.getItem("role") || "user"; // default role

  if (userRole === roleRequired) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Wrapper component to use useLocation hook inside Router
const AppWrapper = () => {
  const location = useLocation();

  // Routes where header should be hidden
  const hideHeaderRoutes = ["/admin"];

  // Check if current path is in the list
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {/* Conditionally render Header except on /admin */}
      {!shouldHideHeader && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booking" element={<BookingDetail />} />
        <Route path="/enter-hotel" element={<EnterHotel />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        {/* Admin Route - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
