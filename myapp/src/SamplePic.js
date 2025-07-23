import React from "react";
import { useNavigate } from "react-router-dom";

const rentals = [
  {
    image: "https://womenshine.in/wp-content/uploads/2023/06/Kerala-Tourism.webp",
    title: "Kerala",
    type: "Kerala",
  },
  {
    image: "https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg",
    title: "TamilNadu",
    type: "TamilNadu",
  },
  {
    image: "https://www.authenticindiatours.com/app/uploads/2022/03/The-Elgin-Hotel-Darjeeling-West-Bengal-.jpg",
    title: "Darjeeling",
    type: "Darjeeling",
  },
  {
    image: "https://pix10.agoda.net/hotelImages/10446/0/966155661f6eb243188648beb2a40cfa.jpg?ca=7&ce=1&s=414x232&ar=16x9",
    title: "Andaman Island",
    type: "Andaman Island",
  },
];

const SamplePic = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate(`/enter-hotel?type=${type}`);
  };

  return (
    <div className="vacation-container">
      <h2>Explore More Vacation Rentals</h2>
      <div className="rentals-grid">
        {rentals.map((rental, index) => (
          <div
            key={index}
            className="rental-card"
            onClick={() => handleClick(rental.type)}
          >
            <img
              src={rental.image}
              alt={rental.title}
              className="rental-image"
            />
            <div className="rental-info">
              <h3>{rental.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SamplePic;
