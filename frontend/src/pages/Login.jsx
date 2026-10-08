import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_OPTIONS = [
  { value: 1, label: 'Student' },
  { value: 2, label: 'Lecturer' },
  { value: 3, label: 'Administrator' },
];

const emptyRegister = {
  title: 'Mr',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  role_id: 1,
  // Student-specific
  student_number: '',
  study_level: 'Undergraduate',
  contact_details: '',
  // Lecturer-specific
  department: '',
};

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('login'); // 'login' | 'register'

  // ---- login state ----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ---- register state ----
  const [regForm, setRegForm] = useState(emptyRegister);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegForm((prev) => ({ ...prev, [name]: value }));
  };

  const switchView = (next) => {
    setView(next);
    setError('');
    setSuccess('');
  };

  // ---- LOGIN ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

  // ---- REGISTER ----
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regForm.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (regForm.password !== regForm.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      // Build payload — only include role-specific fields the backend needs
      const payload = {
        title: regForm.title,
        first_name: regForm.first_name,
        last_name: regForm.last_name,
        email: regForm.email,
        password: regForm.password,
        role_id: Number(regForm.role_id),
      };

      if (Number(regForm.role_id) === 1) {
        payload.student_number = regForm.student_number;
        payload.study_level = regForm.study_level;
        payload.contact_details = regForm.contact_details;
        // bank_name / account_number / branch_code are optional at signup
      }

      if (Number(regForm.role_id) === 2) {
        payload.department = regForm.department;
      }

      await register(payload);

      setSuccess('Account created. Signing you in…');
      setRegForm(emptyRegister);

      // Auto-login with the credentials they just typed
      setTimeout(async () => {
        try {
          await login(regForm.email, regForm.password);
        } catch {
          // If auto-login fails for any reason, drop them back on the login form
          setView('login');
          setEmail(regForm.email);
          setPassword('');
        }
      }, 800);
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  const isRegister = view === 'register';
  const roleId = Number(regForm.role_id);

  return (
    <div className="flex w-full h-screen">
      {/* LEFT: 40% WHITE SIDE */}
      <div className="w-2/5 bg-white h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <img
          src="/NWU-Acronym-Logo-Purple-Digital.png"
          alt="NWU Logo"
          className="h-16 w-auto mb-6"
        />

        <div className="max-w-sm w-full">
          <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p className="text-neutral text-center mt-1 text-sm font-inter">
            {isRegister
              ? 'Register to start using AACMS'
              : 'Sign in to access your AACMS dashboard'}
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm text-center">
              {success}
            </div>
          )}

          {/* ============ LOGIN VIEW ============ */}
          {!isRegister && (
            <>
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

              <p className="text-center text-sm text-neutral mt-6 font-inter">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-primary font-semibold hover:underline"
                >
                  Register
                </button>
              </p>
            </>
          )}

          {/* ============ REGISTER VIEW ============ */}
          {isRegister && (
            <form onSubmit={handleRegister} className="mt-6 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="title"
                  value={regForm.title}
                  onChange={handleRegisterChange}
                  className="p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>

                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={regForm.first_name}
                  onChange={handleRegisterChange}
                  required
                  className="col-span-2 p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              </div>

              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={regForm.last_name}
                onChange={handleRegisterChange}
                required
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={regForm.email}
                onChange={handleRegisterChange}
                required
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
              />

              <select
                name="role_id"
                value={regForm.role_id}
                onChange={handleRegisterChange}
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Student-only fields */}
              {roleId === 1 && (
                <>
                  <input
                    type="text"
                    name="student_number"
                    placeholder="Student Number"
                    value={regForm.student_number}
                    onChange={handleRegisterChange}
                    required
                    className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  />

                  <select
                    name="study_level"
                    value={regForm.study_level}
                    onChange={handleRegisterChange}
                    className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>

                  <input
                    type="tel"
                    name="contact_details"
                    placeholder="Contact Number"
                    value={regForm.contact_details}
                    onChange={handleRegisterChange}
                    required
                    className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                  />
                </>
              )}

              {/* Lecturer-only fields */}
              {roleId === 2 && (
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={regForm.department}
                  onChange={handleRegisterChange}
                  required
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                />
              )}

              <input
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                value={regForm.password}
                onChange={handleRegisterChange}
                required
                minLength={8}
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
              />

              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={regForm.confirm_password}
                onChange={handleRegisterChange}
                required
                className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-neutral mt-4 font-inter">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
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