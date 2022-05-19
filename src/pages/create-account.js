import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../components/AuthContext";
import Field from '../components/Field';

export default function CreateAccount() {
  const navigate = useNavigate();
  const {onLogin, token} = React.useContext(AuthContext);

  React.useEffect(() => {
    if(token){
      const home = '/home/'
      navigate(home);
    }
  }, [token])

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
    <>
      <main>
        <div className='container account'>
          <h4>Create an Account</h4>
          <form onSubmit={handleSubmit} >
            <Field ref={usernameRef} label="Username:" type="text" />
            <Field ref={emailRef} label="Email:" type="text" />
            <Field ref={phoneRef} label="Phone:" type="text" />
            <Field ref={passwordRef} label="Password:" type="password" />
            <button type="submit" className='button-primary'>Create Account</button>
          </form>
        </div>
      </main>
    </>
  );
};

