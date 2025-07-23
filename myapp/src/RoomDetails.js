import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    members: 1,
    rooms: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch room details by id on mount
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!room) return <p>Loading room details...</p>;

  // Calculate price after discount
  const calculateDiscountPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const discountedPrice = calculateDiscountPrice(room.price, room.discount || 0);
  const totalPrice = (discountedPrice * bookingDetails.rooms).toFixed(2);

  // Basic form validations before booking
  const validateBooking = () => {
    const { name, email, phone, checkIn, checkOut, members } = bookingDetails;

    if (!name || !email || !phone || !checkIn || !checkOut) {
      alert("Please fill all booking details.");
      return false;
    }

    if (!email.includes("@")) {
      alert("Enter a valid email address.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out must be after check-in.");
      return false;
    }

    if (members > (room.maxPerson || Infinity)) {
      alert(`Max ${room.maxPerson} members allowed.`);
      return false;
    }

    return true;
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/book-room", {
        roomId: id,
        ...bookingDetails,
      });

      navigate("/booking-confirmation", {
        state: {
          ...bookingDetails,
          room: room.name,
          discountedPrice,
          totalPrice,
        },
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Show backend error like overlapping booking message
        alert(err.response.data.message);
      } else {
        alert("Booking failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Disable booking button if required fields are missing or currently loading
  const isBookingDisabled =
    !bookingDetails.name ||
    !bookingDetails.email ||
    !bookingDetails.phone ||
    !bookingDetails.checkIn ||
    !bookingDetails.checkOut ||
    loading;

  return (
    <div
      className="room-details"
      style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}
    >
      <h1>{room.name}</h1>
      <img
        src={room.image}
        alt={room.name}
        style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }}
      />
      <p>
        <strong>Description:</strong> {room.description}
      </p>
      <p>
        <strong>Size:</strong> {room.size || "Not specified"} m²
      </p>
      <p>
        <strong>Max People:</strong> {room.maxPerson || "N/A"}
      </p>
      <p>
        <strong>Price per Room:</strong> ₹{room.price}
      </p>
      <p>
        <strong>Discount:</strong> {room.discount || 0}% off
      </p>
      <p>
        <strong>Discounted Price:</strong> ₹{discountedPrice}
      </p>
      <p>
        <strong>Rating:</strong> {room.rating}⭐
      </p>

      <div className="booking-form" style={{ marginTop: "30px" }}>
        <h2>Book This Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={bookingDetails.name}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Your Email"
          value={bookingDetails.email}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={bookingDetails.phone}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, phone: e.target.value })
          }
        />
        <input
          type="date"
          value={bookingDetails.checkIn}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, checkIn: e.target.value })
          }
        />
        <input
          type="date"
          value={bookingDetails.checkOut}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, checkOut: e.target.value })
          }
        />
        <input
          type="number"
          min="1"
          placeholder="Number of Members"
          value={bookingDetails.members}
          onChange={(e) =>
            setBookingDetails({
              ...bookingDetails,
              members: Number(e.target.value),
            })
          }
        />
        <input
          type="number"
          min="1"
          placeholder="Number of Rooms"
          value={bookingDetails.rooms}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, rooms: Number(e.target.value) })
          }
        />

        <p>
          <strong>Total Price:</strong> ₹{totalPrice}
        </p>

        <button onClick={handleBooking} disabled={isBookingDisabled}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
