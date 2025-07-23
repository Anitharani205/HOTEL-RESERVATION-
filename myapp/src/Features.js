import React from "react";

const Features = () => {
  return (
    <div className="amenities-section">
      <div className="text-wrapper">
        <h1>ANITHA'S HOTEL</h1>
        <h2>WE PROVIDE YOUR NECESSARY NEEDS</h2>

        <div className="amenities-list">
          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=80&id=y5fznw9gBMnp&format=png"
              alt="Swimming Pool"
            />
            <span>Swimming Pool</span>
          </div>

          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=48&id=122648&format=png"
              alt="BreakFast"
            />
            <span>BreakFast</span>
          </div>

          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=64&id=104294&format=png"
              alt="Parking"
            />
            <span>Parking</span>
          </div>

          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=40&id=kMGRDHJMytTI&format=png"
              alt="Luggage"
            />
            <span>Luggage</span>
          </div>

          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=48&id=hgCYIjaa8Iqo&format=png"
              alt="Air Conditioner"
            />
            <span>Air Conditioner</span>
          </div>

          <div className="amenity-item">
            <img
              src="https://img.icons8.com/?size=48&id=13047&format=png"
              alt="Free Wifi"
            />
            <span>Free Wifi</span>
          </div>
        </div>
      </div>

      <div className="hotel-image">
        <h3>
          Anitha Hotel is dedicated to rapid growth in the hospitality industry
          by expanding our premium accommodations and delivering unparalleled
          comfort, luxury, and service excellence!
        </h3>
        <img
          src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Hotel"
        />
      </div>
    </div>
  );
};

export default Features;
