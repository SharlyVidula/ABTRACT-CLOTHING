'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import {
  Heart, Sparkles, ArrowLeft, Eye, EyeOff,
  UserPlus, LogIn, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const { login, register } = useStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('login');

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female'>('Female');
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Submit: Login ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(loginUsername, loginPassword);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/'), 1100);
    } else {
      setError(result.error || 'Login failed.');
      setLoading(false);
    }
  };

  // ── Submit: Register ───────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);

    const result = await register(regUsername, regPassword, regGender, regEmail);
    if (result.success) {
      setSuccess(true);
      // Simulate sending welcome notice
      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail })
      }).catch(() => {});

      setTimeout(() => router.push('/'), 2000);
    } else {
      setError(result.error || 'Registration failed.');
      setLoading(false);
    }
  };

  // ── Input class helper ─────────────────────────────────────────────────────
  const inputClass =
    'w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-white/40 py-3 px-4 rounded-xl text-sm font-sans text-white placeholder-white/30 transition-all outline-none';

  return (
    <div className="min-h-screen bg-[#090a0f] relative flex items-center justify-center p-4">
      {/* Ambient glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[140px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[140px] -bottom-20 -right-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 bg-black/60 backdrop-blur-2xl rounded-[28px] p-8 border border-white/8 shadow-2xl flex flex-col gap-6"
      >
        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-all w-fit cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to store
        </button>

        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/logo.png" alt="Abstract Logo" className="w-24 h-24 object-contain rounded-[24px] border border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-105 transition-transform duration-300" />
          <div>
            <h1 className="font-sans text-2xl font-black tracking-wider text-white mt-3 uppercase">ABSTRACT Account</h1>
            <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-1">Your premium couture profile</p>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/8 gap-1">
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                tab === t
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t === 'login' ? <><LogIn className="w-3.5 h-3.5" /> Sign In</> : <><UserPlus className="w-3.5 h-3.5" /> Register</>}
            </button>
          ))}
        </div>

        {/* Success state */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-semibold mb-1">
                  {tab === 'login' ? 'Authentication Successful' : 'Account Created'}
                </p>
                <p className="text-white/60 text-xs">
                  {tab === 'login' 
                    ? 'Entering secure terminal...' 
                    : 'Welcome to ABSTRACT! A welcome notice has been sent and you are now connected to our newsletter. Redirecting...'}
                </p>
              </div>
            </motion.div>

          ) : tab === 'login' ? (
            /* ── Login Form ───────────────────────────────────────────────── */
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Username</label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                  >
                    {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>



              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-60 active:scale-[0.98] transition-all cursor-pointer border border-white/20 shadow-lg mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </motion.form>

          ) : (
            /* ── Register Form ────────────────────────────────────────────── */
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Username</label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Choose a username (min. 3 chars)"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="For newsletter & welcome notice"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Password</label>
                <div className="relative">
                  <input
                    type={showRegPw ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                  >
                    {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showRegConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                  >
                    {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gender preference — affects storefront theme & fit recommendations */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/60">Style Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegGender('Female')}
                    className={`py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
                      regGender === 'Female'
                        ? 'border-rose-400 text-rose-300 bg-rose-500/8 shadow-[0_0_16px_rgba(244,63,94,0.12)]'
                        : 'border-white/10 text-white/50 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current opacity-80" />
                    Female ♀
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegGender('Male')}
                    className={`py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
                      regGender === 'Male'
                        ? 'border-amber-500 text-amber-300 bg-amber-500/8 shadow-[0_0_16px_rgba(245,158,11,0.12)]'
                        : 'border-white/10 text-white/50 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Male ♂
                  </button>
                </div>
                <p className="text-[11px] text-white/30">This sets your storefront theme and fit recommendations. You can change it anytime.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-60 active:scale-[0.98] transition-all cursor-pointer border border-white/20 shadow-lg mt-1"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-[11px] text-white/30">
                Registering creates a Customer account.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
