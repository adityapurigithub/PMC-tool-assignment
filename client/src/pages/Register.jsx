import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-primary">
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6 border border-slate-100">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Create an Account</h2>
          <p className="text-slate-500 text-sm">Join us to manage your projects effortlessly.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
        
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-slate-700 bg-slate-50 focus:bg-white transition-all"
            required
          />
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-slate-700 bg-slate-50 focus:bg-white transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-slate-700 bg-slate-50 focus:bg-white transition-all"
            required
          />
        </div>
        
        <Button type="submit" className="w-full mt-2">
          Register
        </Button>
        
        <p className="text-center text-slate-500 text-sm mt-4">
          Already have an account? <Link to="/login" className="text-accent hover:text-accentHover font-semibold ml-1">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
