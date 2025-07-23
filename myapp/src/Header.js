
import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
return (
<header className="header">
<div className="searching-bar">
<input type="text" placeholder="What are you looking for?" />
<button className="searching-btn">🔍</button>
</div>
<nav className="home-1">
<Link to="/"> 🏠 HOME</Link>
<Link to="/enter-hotel">🏨ENTERHOTEL</Link>
<Link to="/login" className="login">
👤LOGIN
</Link>
<Link to="/signup" className="signup">
📝SIGN UP
</Link>
</nav>
</header>
);
};
export default Header;
