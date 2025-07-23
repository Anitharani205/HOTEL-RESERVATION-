import React from "react";
import BookingDetail from "./BookingDetail";
import SamplePic from "./SamplePic";
import Features from "./Features";

const Home = () => {
  return (
    <div className="room">
      <div className="title-container">
        <h1>Welcome to Anitha Hotel</h1>
        <img
          src="https://cdn-icons-png.flaticon.com/128/3168/3168643.png"
          alt="hotel"
        />
      </div>
      <BookingDetail />
      <SamplePic />
      <Features />
    </div>
  );
};

export default Home;
