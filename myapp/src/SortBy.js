import React from "react";

const SortBy = () => {
  return (
    <div className="sort-container">
      <span className="sort-label">SORT BY:</span>
      <button className="sort-button active">Most Popular</button>
      <button className="sort-button">Price – Low to High</button>
      <button className="sort-button">Price – High to Low</button>
      <button className="sort-button">Goibibo Reviews – Highest First</button>
    </div>
  );
};

export default SortBy;
