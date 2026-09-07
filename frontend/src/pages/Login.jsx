import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the role from URL parameter
  const selectedRole = searchParams.get('role') || 'student';

  // ============================================================
  // OPTION 1: DEMO LOGIN (NO CREDENTIALS NEEDED) - ACTIVE
  // ============================================================
  const handleLogin = (e) => {
    e.preventDefault();
    // Redirect to the correct dashboard based on role
    navigate(`/${selectedRole}-dashboard`);
  };

  // ============================================================
  // OPTION 2: FUNCTIONAL LOGIN (WITH AUTH) - COMMENTED OUT
  // ============================================================
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   
  //   try {
  //     // Call your actual login API
  //     const response = await fetch('/api/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password, selectedRole }),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error('Invalid email or password');
  //     }
  //
  //     const data = await response.json();
  //     
  //     // Store user data
  //     localStorage.setItem('user', JSON.stringify(data.user));
  //     
  //     // Redirect based on role
  //     navigate(`/${selectedRole}-dashboard`);
  //   } catch (err) {
  //     setError(err.message || 'Login failed. Please try again.');
  //   }
  // };

  // ============================================================
  // REGISTER HANDLER (Demo)
  // ============================================================
  const handleRegister = (e) => {
    e.preventDefault();
    // For demo, just go back to login
    setShowRegister(false);
  };

  // ============================================================
  // FUNCTIONAL REGISTER (Comment out above and uncomment below)
  // ============================================================
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   
  //   try {
  //     const formData = new FormData(e.target);
  //     const userData = {
  //       name: formData.get('name'),
  //       email: formData.get('email'),
  //       password: formData.get('password'),
  //       role: selectedRole,
  //     };
  //
  //     const response = await fetch('/api/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(userData),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error('Registration failed');
  //     }
  //
  //     // After successful registration, go to login
  //     setShowRegister(false);
  //   } catch (err) {
  //     setError(err.message || 'Registration failed. Please try again.');
  //   }
  // };

  // ============================================================
  // FORGOT PASSWORD HANDLER (Demo)
  // ============================================================
  const handleForgotPassword = (e) => {
    e.preventDefault();
    // For demo, just go back to login
    setShowForgotPassword(false);
  };

  // ============================================================
  // FUNCTIONAL FORGOT PASSWORD (Comment out above and uncomment below)
  // ============================================================
  // const handleForgotPassword = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   
  //   try {
  //     const formData = new FormData(e.target);
  //     const email = formData.get('email');
  //
  //     const response = await fetch('/api/forgot-password', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email }),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error('Failed to send reset link');
  //     }
  //
  //     // Show success message, then go back to login
  //     setShowForgotPassword(false);
  //   } catch (err) {
  //     setError(err.message || 'Failed to send reset link. Please try again.');
  //   }
  // };

  return (
    <div className="flex w-full h-screen">
      
      {/* ===== LEFT: 40% WHITE SIDE ===== */}
      <div className="w-2/5 bg-white h-full flex flex-col items-center justify-center p-8 relative">
        
        {/* Logo */}
        <img 
          src="/NWU-Acronym-Logo-Purple-Digital.png" 
          alt="NWU Logo" 
          className="h-16 w-auto mb-6"
        />

        {/* Selected Role Badge */}
        <div className="mb-4 px-4 py-1 bg-primary-lightest text-primary-dark rounded-full text-sm font-semibold">
          {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Access
        </div>

        {/* Demo Mode Notice */}
        <div className="mb-4 px-4 py-2 bg-primary-lightest text-primary-dark rounded-lg text-sm font-inter">
          🎯 Demo Mode: Click Sign In to continue
        </div>

        {/* ===== SHOW LOGIN / REGISTER / FORGOT PASSWORD ===== */}
        
        {/* ===== LOGIN FORM ===== */}
        {!showForgotPassword && !showRegister && (
          <div className="max-w-sm w-full">
            <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
              Welcome Back
            </h2>
            <p className="text-neutral text-center mt-1 text-sm font-inter">
              Sign in to access your {selectedRole} dashboard
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="mt-6">
              <div className="mb-3">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address (Demo: any email works)" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  defaultValue="demo@nwu.ac.za"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password (Demo: any password works)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  defaultValue="password"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm"
              >
                Sign In
              </button>
            </form>
            
            <div className="text-center mt-3">
              <button 
                onClick={() => setShowForgotPassword(true)}
                className="text-primary text-xs hover:underline font-inter cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="text-center mt-4 pt-4 border-t border-neutral/20">
              <p className="text-xs text-neutral font-inter">
                Don't have an account?{' '}
                <button 
                  onClick={() => setShowRegister(true)}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ===== REGISTER FORM ===== */}
        {showRegister && (
          <div className="max-w-sm w-full">
            <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
              Create Account
            </h2>
            <p className="text-neutral text-center mt-1 text-sm font-inter">
              Register as a {selectedRole}
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="mt-6">
              <div className="mb-3">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  required
                />
              </div>
              <div className="mb-3">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  required
                />
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm"
              >
                Register
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-xs text-neutral font-inter">
                Already have an account?{' '}
                <button 
                  onClick={() => setShowRegister(false)}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ===== FORGOT PASSWORD FORM ===== */}
        {showForgotPassword && (
          <div className="max-w-sm w-full">
            <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
              Reset Password
            </h2>
            <p className="text-neutral text-center mt-1 text-sm font-inter">
              Enter your email and we'll send you a reset link
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="mt-6">
              <div className="mb-4">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm"
              >
                Send Reset Link
              </button>
            </form>
            
            <div className="text-center mt-4">
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="text-primary text-xs hover:underline font-inter cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-xs text-neutral/50 font-inter">
            © 2026 North-West University • DACMS
          </p>
        </div>
        
      </div>
      
      {/* ===== RIGHT: 60% VIDEO SIDE ===== */}
      <div className="w-3/5 h-full relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        >
          <source src="/GradientVideo.mp4" type="video/mp4" />
        </video>
      </div>
      
    </div>
  );
};

export default Login;