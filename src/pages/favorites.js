import React from 'react';
import AuthContext from '../components/AuthContext';

export default function Favorites() {
  const {token} = React.useContext(AuthContext);
  if(token) {
    return (
      <main>
        <h3>Favorites</h3>
        <p>Logged in</p>
      </main>
    );
  } else {
    <main>
      <p>Log in to see favorites</p>
    </main>
  }
};