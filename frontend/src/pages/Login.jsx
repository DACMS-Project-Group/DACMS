import React, { useState } from 'react';

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex w-full h-screen">
      
      {/* ===== LEFT: 40% WHITE SIDE ===== */}
      <div className="w-2/5 bg-white h-full flex flex-col items-center justify-center p-8">
        
        {/* Logo */}
        <img 
          src="/NWU-Acronym-Logo-Purple-Digital.png" 
          alt="NWU Logo" 
          className="h-16 w-auto mb-6"
        />

        {/* ===== SHOW LOGIN / REGISTER / FORGOT PASSWORD ===== */}
        
        {/* ===== LOGIN FORM ===== */}
        {!showForgotPassword && !showRegister && (
          <div className="max-w-sm w-full">
            <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
              Welcome Back
            </h2>
            <p className="text-neutral text-center mt-1 text-sm font-inter">
              Sign in to access your dashboard
            </p>
            
            <form className="mt-6">
              <div className="mb-3">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
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
              Register to get started with DACMS
            </p>
            
            <form className="mt-6">
              <div className="mb-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              </div>
              <div className="mb-3">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
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
            
            <form className="mt-6">
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
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