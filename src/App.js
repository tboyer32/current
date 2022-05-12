import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import CreateAccount from './pages/create-account';

import './App.css';

function App() {

  return (
    <>
      <Navigation />
      <LoginForm onSubmit={handleLogin}/>

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="detail" element={<Detail />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="create-account" element={<CreateAccount />} />
      </Routes>
    </>
  );

}

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

const LoginForm = ({onSubmit}) => {
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const handleSubmit = e => {
      e.preventDefault();
      const data = {
          email: emailRef.current.value,
          password: passwordRef.current.value
      };
      onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit} >
      <Field ref={emailRef} label="Email:" type="text" />
      <Field ref={passwordRef} label="Password:" type="password" />
      <button type="submit">Login</button>
    </form>
  );
};

const handleLogin = data => {
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(resultData => {
    console.log(resultData)
  });
};

export default App;
