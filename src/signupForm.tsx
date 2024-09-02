import React, { useState } from 'react';
import { signUp } from './authServices';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setEmail('');
      setPassword('');
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignUpForm;