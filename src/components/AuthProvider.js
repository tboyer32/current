import React from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(
      localStorage.getItem('user_id') || false
    );

    const [userFavorites, setUserFavorites] = React.useState(
      localStorage.getItem('userFavorites') || null
    );
  
    const handleLogin = (data) => {
      fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(resultData => {
        localStorage.setItem('user_id', resultData.token);
        localStorage.setItem('userFavorites', resultData.favorites);

        setToken(localStorage.getItem('user_id'));
        setUserFavorites(resultData.favorites);
        //need to set a fav river state
        //when a user logs in add a list of rivers that are already faved.
        //add to the list when they fav rivers

      });
    };
  
    const handleLogout = () => {
      localStorage.removeItem('user_id')
      setToken(null);
    };

    const value = {
      token,
      userFavorites,
      onLogin: handleLogin,
      onLogout: handleLogout,
    };
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };

export default AuthProvider;