import React from 'react';
import AuthContext from "../components/AuthContext";
import Field from '../components/Field';

export default function CreateAccount() {
  const {onLogin} = React.useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passwordRef.current.value
    };

    fetch('/register-user', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(resultData => {
      console.log(resultData)
      const loginData = {
        email: emailRef.current.value,
        password: passwordRef.current.value
      }
      onLogin(data);
    });

  }

  // create reference to form inputs
  const usernameRef = React.useRef();
  const phoneRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  
  return (
    <form onSubmit={handleSubmit} >
      <Field ref={usernameRef} label="Username:" type="text" />
      <Field ref={emailRef} label="Email:" type="text" />
      <Field ref={phoneRef} label="Phone:" type="text" />
      <Field ref={passwordRef} label="Password:" type="password" />
      <button type="submit">Create Account</button>
    </form>
  );
};

