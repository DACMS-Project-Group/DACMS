import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Backend uses numeric role IDs. Frontend uses string roles.
const ROLE_MAP = {
  1: 'student',
  2: 'lecturer',
  3: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login — backend sets an httpOnly cookie named "token"
  const login = async (email, password) => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      credentials: 'include', // required: sends/receives the cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed');
    }

    // Backend returns { message, user: { id, email, role_id } }
    const data = await response.json();

    // Handle both nested ({ user: {...} }) and flat ({ id, email, role_id }) shapes
    const u = data.user || data;

    const userData = {
      id: u.id,
      email: u.email,
      role_id: u.role_id,
      role: ROLE_MAP[u.role_id] || 'student',
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    redirectUserByRole(userData.role, navigate);

    return userData;
  };

  // Register — backend path is /users/create, not /register
  const register = async (userData) => {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Registration failed');
    }

    return response.json();
  };

  // Logout — clear the cookie on the backend, then clear local state
  const logout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // backend might be down — we still want to log out locally
    }

    setUser(null);
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Forgot password — no backend endpoint documented yet
  const forgotPassword = async () => {
    throw new Error('Forgot password is not available yet.');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    userRole: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const redirectUserByRole = (role, navigate) => {
  switch (role) {
    case 'student':
      navigate('/student-dashboard', { replace: true });
      break;
    case 'lecturer':
      navigate('/lecturer-dashboard', { replace: true });
      break;
    case 'admin':
      navigate('/admin-dashboard', { replace: true });
      break;
    default:
      navigate('/login', { replace: true });
  }
};