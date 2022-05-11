import React, { useState, useEffect } from 'react';
import Nav from './components/nav';
import './App.css';

function App() {
  // const [placeholder, setPlaceholder] = useState('Hi');

  // useEffect(() => {
  //   fetch('/test').then(res => res.json()).then(data => {
  //     setPlaceholder(data.message);
  //   });
  // }, []);

  // return (
  //   <p>
  //     {placeholder}
  //   </p>
  // );

  return (
    <Nav />
  );


}

export default App;
