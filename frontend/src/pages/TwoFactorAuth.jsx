import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiPost } from '../api';
import Card from '../components/Card';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('setup'); // 'setup' | 'confirm' | 'backup' | 'login'
  const [user, setUser] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showManualKey, setShowManualKey] = useState(false);
  const [backupCodesCopied, setBackupCodesCopied] = useState(false);
  const [showBackupCodesList, setShowBackupCodesList] = useState(false);

  // Determine flow from location state
  useEffect(() => {
    const from = location.state?.from;
    if (from === 'login') {
      setStep('login'); // Coming from login, entering 2FA code to verify
    } else if (from === 'setup') {
      startSetup(); // New admin, initiating 2FA setup
    } else {
      // Fallback: shouldn't happen, redirect to login
      navigate('/login', { replace: true });
    }
  }, [location.state]);

  // Step 1: Request QR code from backend
  const startSetup = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await apiPost('/2fa/setup', {});
      setQrCode(result.qrCode);
      setManualKey(result.manualKey);
      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Failed to start 2FA setup');
      if (err.message.includes('already configured')) {
        setStep('login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm setup with TOTP code
  const confirmSetup = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter the 6-digit code from your authenticator');
      return;
    }

    if (!/^\d{6}$/.test(code.trim())) {
      setError('Code must be exactly 6 digits');
      return;
    }

    setLoading(true);

    try {
      const result = await apiPost('/2fa/setup/confirm', { token: code });
      setBackupCodes(result.backupCodes);
      setStep('backup');
      setCode('');
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save backup codes and finish setup
  const finishSetup = () => {
    // Backup codes displayed; user confirms they've saved them
    // Redirect to login to complete first login with 2FA
    navigate('/login', { replace: true, state: { message: '2FA setup complete. Please log in.' } });
  };

  // Step 4: Verify code during login
  const verifyLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter your 6-digit code or 10-character backup code');
      return;
    }

    setLoading(true);

    try {
      const response = await apiPost('/2fa/verify', { token: code });

      // Handle both nested ({ user: {...} }) and flat ({ id, email, role_id }) shapes
      const u = response.user || response;

      const userData = {
        id: u.id,
        email: u.email,
        role_id: u.role_id,
        role: 'admin',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      window.location.replace('/admin-dashboard');

      return userData;
    } catch (err) {
      setError(err.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = backupCodes.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setBackupCodesCopied(true);
      setTimeout(() => setBackupCodesCopied(false), 2000);
    });
  };

  return (
    <div className="flex w-full min-h-screen bg-off-white">
      {/* LEFT: 40% WHITE SIDE */}
      <div className="w-2/5 bg-white h-full flex flex-col items-center justify-center p-8 relative">
        <img
          src="/NWU-Acronym-Logo-Purple-Digital.png"
          alt="NWU Logo"
          className="h-16 w-auto mb-6"
        />

        <div className="max-w-sm w-full">
          {/* SETUP STEP 1: Display QR Code */}
          {step === 'setup' || (step === 'confirm' && qrCode) ? (
            <>
              <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
                Set Up Two-Factor Authentication
              </h2>

              <p className="text-neutral text-center mt-2 text-sm font-inter">
                Secure your administrator account with an authenticator app
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {step === 'setup' ? (
                <div className="mt-8 text-center">
                  <p className="text-neutral font-inter">Loading setup…</p>
                </div>
              ) : (
                <>
                  <div className="mt-8 bg-gray-50 rounded-xl p-6 flex justify-center">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>

                  <p className="text-sm text-neutral text-center mt-4 font-inter">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                  </p>

                  {!showManualKey && (
                    <button
                      type="button"
                      onClick={() => setShowManualKey(true)}
                      className="mt-4 text-primary text-sm font-semibold hover:text-primary-dark underline w-full text-center"
                    >
                      Can't scan? Enter manually
                    </button>
                  )}

                  {showManualKey && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs text-neutral font-inter mb-2">
                        Manual entry key (if QR doesn't work):
                      </p>
                      <code className="block bg-white p-2 rounded text-center font-mono text-sm break-all">
                        {manualKey}
                      </code>
                    </div>
                  )}

                  <form onSubmit={confirmSetup} className="mt-6">
                    <label className="block text-sm font-semibold text-primary-dark mb-2 font-inter">
                      Verify Setup
                    </label>

                    <p className="text-xs text-neutral mb-3 font-inter">
                      Enter the 6-digit code from your authenticator app to confirm setup:
                    </p>

                    <input
                      type="text"
                      maxLength="6"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm font-mono text-center text-2xl tracking-widest"
                      required
                    />

                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="w-full mt-4 bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying…' : 'Verify and Continue'}
                    </button>
                  </form>
                </>
              )}
            </>
          ) : null}

          {/* BACKUP CODES STEP 2: Save Backup Codes */}
          {step === 'backup' && (
            <>
              <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
                Save Your Backup Codes
              </h2>

              <p className="text-neutral text-center mt-2 text-sm font-inter">
                Keep these codes safe. Each can be used once if you lose your authenticator.
              </p>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-700 font-semibold mb-3 font-inter">
                  ⚠️ Save These Codes Now
                </p>

                <button
                  type="button"
                  onClick={() => setShowBackupCodesList(!showBackupCodesList)}
                  className="text-sm text-primary font-semibold underline mb-3 w-full text-center"
                >
                  {showBackupCodesList ? 'Hide' : 'Show'} Backup Codes
                </button>

                {showBackupCodesList && (
                  <>
                    <div className="bg-white rounded p-3 mb-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                      {backupCodes.map((code, idx) => (
                        <div key={idx} className="text-gray-700">
                          {idx + 1}. <code className="font-semibold">{code}</code>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="w-full p-2 bg-primary text-white rounded text-xs font-semibold hover:bg-primary-dark transition mb-2"
                    >
                      {backupCodesCopied ? '✓ Copied!' : 'Copy All'}
                    </button>

                    <p className="text-xs text-gray-600 text-center font-inter">
                      Print or save to a secure location
                    </p>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="saved"
                  checked={backupCodesCopied}
                  onChange={(e) => setBackupCodesCopied(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-neutral cursor-pointer"
                />
                <label htmlFor="saved" className="text-sm text-neutral font-inter cursor-pointer">
                  I have saved my backup codes to a safe location
                </label>
              </div>

              <button
                type="button"
                onClick={finishSetup}
                disabled={!backupCodesCopied}
                className="w-full mt-6 bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Setup Complete → Log In
              </button>
            </>
          )}

          {/* LOGIN STEP: Enter Code to Verify */}
          {step === 'login' && (
            <>
              <h2 className="text-2xl font-poppins font-bold text-primary-dark text-center">
                Two-Factor Code
              </h2>

              <p className="text-neutral text-center mt-2 text-sm font-inter">
                Enter the 6-digit code from your authenticator app
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={verifyLogin} className="mt-6">
                <label className="block text-sm font-semibold text-primary-dark mb-2 font-inter">
                  Authentication Code
                </label>

                <p className="text-xs text-neutral mb-3 font-inter">
                  6-digit code or 10-character backup code:
                </p>

                <input
                  type="text"
                  maxLength="10"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-neutral rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 text-sm font-mono text-center text-2xl tracking-widest"
                  autoFocus
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full mt-4 bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full mt-3 text-primary text-sm font-semibold hover:text-primary-dark text-center"
              >
                Back to Login
              </button>
            </>
          )}
        </div>

        <div className="absolute bottom-6 text-center">
          <p className="text-xs text-neutral/50 font-inter">
            © 2026 North-West University • AACMS
          </p>
        </div>
      </div>

      {/* RIGHT: 60% PURPLE SIDE */}
      <div className="hidden w-3/5 bg-gradient-to-br from-primary to-primary-dark lg:flex flex-col items-center justify-center p-8 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-poppins font-bold mb-4">
            Secure Your Account
          </h1>

          <p className="text-lg text-white/80 mb-8 font-inter">
            Two-factor authentication adds an extra layer of security to your administrator account.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-white/20 rounded-full p-3 min-w-fit">
                <span className="text-2xl">📱</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1 font-inter">Authenticator App</h3>
                <p className="text-sm text-white/70 font-inter">
                  Use any authenticator app to generate codes
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 rounded-full p-3 min-w-fit">
                <span className="text-2xl">🔑</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1 font-inter">Backup Codes</h3>
                <p className="text-sm text-white/70 font-inter">
                  Save backup codes for account recovery
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 rounded-full p-3 min-w-fit">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-1 font-inter">Always Protected</h3>
                <p className="text-sm text-white/70 font-inter">
                  2FA cannot be disabled for admin accounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;