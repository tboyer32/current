import React, { useContext } from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoginOutForm from './components/LoginOutForm';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import CreateAccount from './pages/create-account';
import AuthProvider from './components/AuthProvider';

import './css/normalize.css';
import './css/barebones.css';
import './css/current.css'

function App() {

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,400;0,700;0,800;1,400;1,700;1,800&family=Rubik:ital,wght@0,300;1,300;1,700&display=swap" rel="stylesheet" />
      </Helmet>
      <AuthProvider>
          <header>
            <div className='container'>
              <h1><Link to="/home">Current</Link></h1>
              <Navigation />
              <LoginOutForm />
            </div>
          </header>

        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="detail" />
            <Route path=":id" element={<Detail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Routes>
      </AuthProvider>
      <Footer />
    </>
  );

}

export default App;
