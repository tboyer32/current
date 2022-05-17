import React from "react";
import { Link } from "react-router-dom";
import AuthContext from '../components/AuthContext';

const Navigation = () => {
  const {token} = React.useContext(AuthContext);

  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/favorites">Favorites</Link>
      {!token && <Link to="/create-account">Create Account</Link>}
    </nav>
  );
};

export default Navigation;