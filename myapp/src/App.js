import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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


import "./styles.css";


const ProtectedRoute = ({ children, roleRequired }) => {
  const userRole = localStorage.getItem("role") || "user"; 

  if (userRole === roleRequired) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};


const AppWrapper = () => {
  const location = useLocation();

  const hideHeaderRoutes = ["/admin"];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      
      {!shouldHideHeader && <Header />}

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booking" element={<BookingDetail />} />
        <Route path="/enter-hotel" element={<EnterHotel />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

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
