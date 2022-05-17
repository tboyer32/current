import React from "react";
import AuthContext from "./AuthContext";
import Field from "./Field";

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

export default LoginOutForm;