import React, { useState, useEffect } from 'react';
import SignUpForm from './signupForm';
import SignInForm from './signinForm';
import Dashboard from './dashboard';
import { onAuthStateChange, signOutUser } from './authServices';
import { User } from 'firebase/auth';
import './App.css';  // Import the CSS file

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to List Builder</h1>
        {user ? (
          <>
            <Dashboard userId={user.uid} />
            <button className="logout-button" onClick={signOutUser}>
              Log Out
            </button>
          </>
        ) : (
          <div>
            <SignInForm />
            <SignUpForm />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;