import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      // AuthContext handles the redirect based on role
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* LEFT: 40% WHITE SIDE */}
      <div className="w-2/5 bg-white h-full flex flex-col items-center justify-center p-8 relative">
        <img
          src="/NWU-Acronym-Logo-Purple-Digital.png"
          alt="NWU Logo"
          className="h-16 w-auto mb-6"
        />

        <div className="max-w-sm w-full">
          <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
            Welcome Back
          </h2>

          <p className="text-neutral text-center mt-1 text-sm font-inter">
            Sign in to access your AACMS dashboard
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
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="absolute bottom-6 text-center">
          <p className="text-xs text-neutral/50 font-inter">
            © 2026 North-West University • AACMS
          </p>
        </div>
      </div>

      {/* RIGHT: 60% VIDEO SIDE */}
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