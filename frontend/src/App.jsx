import React from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <AdminDashboard />
    </div>
  );
}

export default App;