import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EnterHotel.css";

const EnterHotel = () => {
  const locationSearch = new URLSearchParams(useLocation().search);
  const type = locationSearch.get("type");
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    locations: [],
    prices: [],
    ratings: [],
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (type) {
      setFilters((prev) => ({
        ...prev,
        locations: [type],
      }));
    }
  }, [type]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckboxChange = (e, category) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const filteredRooms = rooms.filter((room) => {
    return (
      (!type || room.location === type) &&
      (!filters.locations.length || filters.locations.includes(room.location)) &&
      (!filters.prices.length || filters.prices.some((price) => room.price <= +price)) &&
      (!filters.ratings.length || filters.ratings.some((rating) => room.rating >= +rating))
    );
  });

  return (
    <div className="enter-hotel-container">
      <div className="sidebar">
        <h3>Filters</h3>

        <div className="filter-section">
          <h4>Location</h4>
          {["Kerala", "TamilNadu", "Darjeeling", "Andaman Island"].map((loc) => (
            <label key={loc}>
              <span>{loc}</span>
              <input
                type="checkbox"
                value={loc}
                checked={filters.locations.includes(loc)}
                onChange={(e) => handleCheckboxChange(e, "locations")}
              />
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Price Range</h4>
          {["3000", "5000", "6000", "8000", "10000", "12000"].map((price) => (
            <label key={price}>
              <span>Up to ₹{price}</span>
              <input
                type="checkbox"
                value={price}
                onChange={(e) => handleCheckboxChange(e, "prices")}
              />
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Rating</h4>
          {["3", "4", "4.5", "5"].map((rating) => (
            <label key={rating}>
              <span>{rating}+ Stars</span>
              <input
                type="checkbox"
                value={rating}
                onChange={(e) => handleCheckboxChange(e, "ratings")}
              />
            </label>
          ))}
        </div>

        <button onClick={() => setFilters({ locations: [], prices: [], ratings: [] })}>
          Clear All Filters
        </button>
      </div>

      <div className="rooms-listing">
        <h2>{type || "Hotel"} Rooms</h2>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="room-card"
              onClick={() => navigate(`/room/${room._id}`)}
            >
              <div className="room-images">
                <img src={room.image} alt={room.name} />
                <img src={room.image2 || room.image} alt={room.name + " alt"} />
              </div>
              <div className="room-card-content">
                <h3>{room.name}</h3>
                <p>Location: {room.location}</p>
                <p>Type: {room.type}</p>
                <p>Price: ₹{room.price}</p>
                <p>Rating: {room.rating} Stars</p>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
    </div>
  );
};

export default EnterHotel;
