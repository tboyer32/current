import React from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(
      localStorage.getItem('user_id') || false
    );

    const [favList, setFavorites] = React.useState(null);
  
    const handleLogin = (data) => {
      fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(resultData => {
        localStorage.setItem('user_id', resultData.token);
        setToken(localStorage.getItem('user_id'));
        setFavorites(resultData.favorites);

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
      favList,
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