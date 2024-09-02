// src/App.tsx
import React from 'react';
import SignUpForm from './signupForm';
import SignInForm from './signinForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to List Builder</h1>
        <SignUpForm />
        <SignInForm />
      </header>
    </div>
  );
}

export default App;
