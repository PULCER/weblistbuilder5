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
      </header>
      <main className="App-main">
        {user ? (
          <Dashboard userId={user.uid} />
        ) : (
          <div>
            <SignInForm />
            <SignUpForm />
          </div>
        )}
      </main>
      {user && (
        <footer className="App-footer">
          <button className="logout-button" onClick={signOutUser}>
            Log Out
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;