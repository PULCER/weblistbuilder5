// src/AuthForm.tsx
import React, { useState } from 'react';
import { signIn, signUp } from './authServices';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="auth-buttons">
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleSignIn}>Log In</button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AuthForm;