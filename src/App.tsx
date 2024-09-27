// src/App.tsx
import React, { useState, useEffect } from 'react';
import AuthForm from './authform';
import Dashboard from './dashboard';
import { onAuthStateChange, signOutUser } from './authServices';
import { User } from 'firebase/auth';
import './App.css';
import './modal.css';
import headerSvg from './assets/headerpng.png';

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
        <img src={headerSvg} alt="List Builder" className="header-image" />
      </header>
      <main className="App-main">
        {user ? (
          <Dashboard userId={user.uid} />
        ) : (
          <AuthForm />
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