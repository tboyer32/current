import React from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(
      localStorage.getItem('user_id') || false
    );
  
    const handleLogin = (data) => {
      fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(resultData => {
        console.log(resultData.token);
        localStorage.setItem('user_id', resultData.token);
        setToken(localStorage.getItem('user_id'));
      });
    };
  
    const handleLogout = () => {
      localStorage.removeItem('user_id')
      setToken(null);
    };
  
    const value = {
      token,
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