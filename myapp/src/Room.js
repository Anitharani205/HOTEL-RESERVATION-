import React from "react";

const Room = ({ room }) => {
  return (
    <div className="card">
      <img src={room.image} alt={room.name} className="image" />
      <h3>{room.name}</h3>
      <p>Location: {room.location}</p>
      <p>Price: ₹{room.price} per day</p>
      <p>✅ Breakfast included</p>
      <p>⚡ 20% Off on food and beverages, Spa and laundry</p>
      <span className="rating">{room.rating} ⭐</span>
    </div>
  );
};

export default Room;
