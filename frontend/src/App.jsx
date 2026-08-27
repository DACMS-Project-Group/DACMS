import React from 'react';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;