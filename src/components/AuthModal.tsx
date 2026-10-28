import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';
import { DEMO_PROFILES } from '../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'forgot';
  onOpenPrivacy?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'login',
  onOpenPrivacy 
}) => {
  const { store } = useBarangayStore();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sitioPurok, setSitioPurok] = useState('Purok 1');
  const [completeAddress, setCompleteAddress] = useState('');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Widowed' | 'Separated'>('Single');
  const [residencyYears, setResidencyYears] = useState(3);
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = store.login(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickLogin = (email: string) => {
    setError(null);
    const res = store.login(email);
    if (res.success) {
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!privacyAgreed) {
      setError('You must agree to the Data Privacy Notice pursuant to RA 10173');
      return;
    }

    const res = store.register({
      fullName,
      email: registerEmail,
      mobileNumber,
      sitioPurok,
      completeAddress,
      civilStatus,
      residencyYears
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please provide your registered email address.');
      return;
    }
    setError(null);
    setResetSent(true);
    setSuccessMsg(`A password recovery verification link has been dispatched to ${forgotEmail}. Please check your inbox.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 brand-band p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-700/80 border border-blue-400/30 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-300">Republic of the Philippines</span>
              <h2 className="text-xl font-black tracking-tight">BARANGAY360</h2>
            </div>
          </div>
          <p className="text-xs text-blue-100">
            Secure Citizen & Administrative Access Portal
          </p>

          {/* Navigation Tabs */}
          <div className="flex border-b border-blue-800 mt-4 pt-1">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`pb-2 px-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
                tab === 'login' ? 'border-amber-400 text-white' : 'border-transparent text-blue-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`pb-2 px-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
                tab === 'register' ? 'border-amber-400 text-white' : 'border-transparent text-blue-300 hover:text-white'
              }`}
            >
              Resident Registration
            </button>
            <button
              onClick={() => { setTab('forgot'); setError(null); }}
              className={`pb-2 px-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
                tab === 'forgot' ? 'border-amber-400 text-white' : 'border-transparent text-blue-300 hover:text-white'
              }`}
            >
              Recovery
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              {successMsg}
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. juan.delacruz@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer text-xs"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>

              {/* 1-Click Persona Tester */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="text-[11px] text-slate-600 font-semibold block mb-2 text-center uppercase tracking-wider">
                  Quick Login Demo Accounts:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleQuickLogin(p.email)}
                      className="p-2 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-left transition text-[11px] cursor-pointer"
                    >
                      <div className="font-semibold text-slate-800 truncate">{p.full_name}</div>
                      <div className="text-[10px] text-blue-700 capitalize font-medium">{p.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name (as in Govt ID)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Juan Carlos Dela Cruz"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Philippine Mobile #</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+63 917 123 4567"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sitio / Purok</label>
                  <select
                    value={sitioPurok}
                    onChange={(e) => setSitioPurok(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="Purok 1">Purok 1 (Rosal)</option>
                    <option value="Purok 2">Purok 2 (Ilang-Ilang)</option>
                    <option value="Purok 3">Purok 3 (Sampaguita)</option>
                    <option value="Purok 4">Purok 4 (Bougainvillea)</option>
                    <option value="Sitio Ilaya">Sitio Ilaya</option>
                    <option value="Sitio Ibaba">Sitio Ibaba</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Years of Residency</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={residencyYears}
                    onChange={(e) => setResidencyYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Complete House Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="House / Unit #, Street name"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Data Privacy Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-blue-900 focus:ring-blue-500"
                    required
                  />
                  <span>
                    I confirm that the information provided is accurate and I agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-blue-800 underline font-semibold hover:text-blue-950"
                    >
                      Data Privacy Notice (RA 10173)
                    </button>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer text-xs mt-2"
              >
                Create Resident Account
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <div className="text-slate-600 text-xs">
                Enter your registered citizen or official email address. We will verify your account and transmit a password reset token.
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. juan.delacruz@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer text-xs"
              >
                <KeyRound className="w-4 h-4 mr-1.5" />
                {resetSent ? 'Recovery Link Sent' : 'Send Recovery Instructions'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-blue-800 font-semibold hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
