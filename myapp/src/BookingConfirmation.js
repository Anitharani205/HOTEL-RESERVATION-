import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
	
const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(true);

  if (!bookingDetails) {
    return <p>No booking details found!</p>;
  }

  const {
    name,
    room,
    email,
    phone,
    checkIn,
    checkOut,
    members,
    rooms,
    totalPrice,
  } = bookingDetails;

  const handleProceed = () => {
    navigate("/");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="confirmation-container">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-header">Booking Confirmed!</h2>
            <p>
              Your booking has been successfully confirmed. Please review your
              details and proceed.
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/128/5290/5290058.png"
              alt="Booking confirmation icon"
            />
            <button className="proceed-btn" onClick={closeModal}>
              Proceed
            </button>
          </div>
        </div>
      )}

      <div className="header">
        <h1>✅ Booking Confirmed!!!</h1>
      </div>

      <p className="confirmation-text">
        We're excited to confirm your reservation! Thank you for booking with
        us. Please check the details below:
      </p>

      <div className="booking-details">
        <h2>Booking Details</h2>
        <div className="detail-row"><strong>Full Name:</strong> {name}</div>
        <div className="detail-row"><strong>Email:</strong> {email}</div>
        <div className="detail-row"><strong>Phone:</strong> {phone}</div>
        <div className="detail-row"><strong>Room Name:</strong> {room}</div>
        <div className="detail-row"><strong>Check-in:</strong> {checkIn}</div>
        <div className="detail-row"><strong>Check-out:</strong> {checkOut}</div>
        <div className="detail-row"><strong>Members:</strong> {members}</div>
        <div className="detail-row"><strong>Rooms:</strong> {rooms}</div>
        <div className="detail-row"><strong>Total Price:</strong> ₹{totalPrice}</div>
        <div className="detail-row status">
          <strong>Status:</strong>{" "}
          <span className="status-confirmed">Confirmed</span>
        </div>
      </div>

      <div className="agreement-section">
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          I agree to the terms and conditions
        </label>
      </div>

      <button
        className={`proceed-btn ${isChecked ? "active" : "disabled"}`}
        disabled={!isChecked}
        onClick={handleProceed}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingConfirmation;

