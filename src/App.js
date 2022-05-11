import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import CreateAccount from './pages/create-account';

import './App.css';

function App() {

  return (
    <>
      <Navigation />

      <Routes>
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

export default App;
