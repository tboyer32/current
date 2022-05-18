import React from "react";
import { Link } from "react-router-dom";
import AuthContext from '../components/AuthContext';

const Navigation = () => {
  const {token} = React.useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li><Link to="/favorites">Favorites</Link></li>
      {!token && <li><Link to="/create-account">Create Account</Link></li>}
      </ul>
    </nav>
  );
};

export default Navigation;