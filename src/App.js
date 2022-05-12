import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import CreateAccount from './pages/create-account';
import AuthContext from './components/AuthContext';

import './App.css';

function App() {
  
  return (
    <>
      <AuthProvider>
        <Navigation />
        <LoginOutForm />

        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="detail" element={<Detail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Routes>
      </AuthProvider>
    </>
  );

}


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

const Field = React.forwardRef(({label, type}, ref) => {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} type={type} />
    </div>
  );
});

const LoginOutForm = (props) => {
  const {token, onLogin, onLogout} = React.useContext(AuthContext);

  // create reference to form inputs
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  
  const handleSubmit = e => {
        e.preventDefault();
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };
        onLogin(data);
  };

  if(token){
    return (
      <form onSubmit={onLogout} >
        <button type="submit">Log Out</button>
      </form>
    )
  }
  else{
    return (
      <form onSubmit={handleSubmit} >
        <Field ref={emailRef} label="Email:" type="text" />
        <Field ref={passwordRef} label="Password:" type="password" />
        <button type="submit">Login</button>
      </form>
    );
  }
};

export default App;
