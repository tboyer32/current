import React, { useContext } from 'react';
import { Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginOutForm from './components/LoginOutForm';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import CreateAccount from './pages/create-account';
import AuthProvider from './components/AuthProvider';

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
          <Route path="detail" />
            <Route path=":id" element={<Detail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Routes>
      </AuthProvider>
    </>
  );

}

export default App;
