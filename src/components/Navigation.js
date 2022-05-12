import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/detail">River Detail</Link>
        <Link to="/create-account">Create Account</Link>
      </nav>
    );
  };

export default Navigation;