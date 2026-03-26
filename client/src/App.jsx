import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectBoard from './pages/ProjectBoard.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-slate-800 antialiased font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectBoard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
