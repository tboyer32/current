import React from 'react';
import AuthContext from '../components/AuthContext';

export default function Favorites() {

  //TODO - get the favorite rivers for a user if there is a token
  //add a river component for each river faved by a user
  //deal with pagination (returned from API)

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