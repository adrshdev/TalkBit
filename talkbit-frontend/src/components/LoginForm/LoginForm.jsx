import React from "react";
import './loginform.css';
import { useState } from "react";

const LoginForm = ({username, setUsername, handleEnter}) => {
  const [mode, setMode] = useState('login');
  const [password, setPassword] = useState('');
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setPassword('');
  }
  const handleSubmit = () => {
    if(!username.trim()){
      return alert('Username required');
    }
    if(!password.trim()){
      return alert('Password is required');
    }
    handleEnter();
  }
  return(
    <div className="login-container">
      <div className="login-box">
        <h2>{mode === 'login' ? 'Login to TalkBit' : 'Create a TalkBit Account'}</h2>
        <p className="subtitle">{mode === 'login' ? 'Enter your details to continue' : 'Create a new account to start chatting'}</p>
        <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}></input>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSubmit}>{mode === 'login' ? 'Login' : 'Signup'}</button>
        <p className="switch-mode">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{''}
          <span onClick={toggleMode}>
            {mode === 'login' ? 'Create an account' : 'Login'}
          </span>
        </p>
      </div>
      <div className="login-graphic">
         <img src="https://cdn-icons-png.flaticon.com/512/4221/4221419.png" alt="Chat Icon" />
      </div>
    </div> 
  )
};

export default LoginForm;