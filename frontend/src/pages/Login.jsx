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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
      }

      if (Number(regForm.role_id) === 2) {
        payload.department = regForm.department;
      }

      await register(payload);

      setSuccess('Account created. Signing you in…');
      setRegForm(emptyRegister);

      setTimeout(async () => {
        try {
          await login(regForm.email, regForm.password);
        } catch {
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
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* ============ FORM COLUMN ============ */}
      <div
        className="
          w-full md:w-2/5
          bg-white
          flex flex-col items-center
          md:h-screen md:overflow-y-auto
          px-5 py-6 md:p-8
          order-2 md:order-1
          flex-1 md:flex-initial
        "
      >
        {/* Centered form block */}
        <div className="w-full max-w-sm my-auto">
          <div className="flex justify-center mb-4 md:mb-6">
            <img
              src="/NWU-Acronym-Logo-Purple-Digital.png"
              alt="NWU Logo"
              className="h-12 md:h-16 w-auto"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-poppins font-bold text-primary-dark text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p className="text-neutral text-center mt-1 text-sm font-inter">
            {isRegister
              ? 'Register to start using AACMS'
              : 'Sign in to access your AACMS dashboard'}
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center break-words">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm text-center break-words">
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

        {/* Copyright — flow element, no longer absolute */}
        <div className="w-full text-center pt-6 mt-6 md:mt-8">
          <p className="text-xs text-neutral/50 font-inter">
            © 2026 North-West University • AACMS
          </p>
        </div>
      </div>

      {/* ============ VIDEO COLUMN ============ */}
      {/* Mobile: slim hero band at the top. Hidden on very short screens. */}
      {/* Desktop: 60% full-height column. */}
      <div
        className="
          order-1 md:order-2
          w-full md:w-3/5
          h-40 sm:h-56 md:h-screen
          relative overflow-hidden
          bg-primary
        "
      >
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