'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn({ onSwitchToSignUp }) {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <aside className="w-full max-w-md px-6 py-8 text-slate-100 font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#080B1A] tracking-wide">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Sign in to your LexFlow dashboard.
        </p>
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#080B1A] hover:bg-slate-800/60 text-sm text-slate-200 font-medium transition-colors"
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>
      
      <div className="flex items-center my-6 gap-3">
        <div className="h-[1px] bg-slate-800 flex-1" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Or</span>
        <div className="h-[1px] bg-slate-800 flex-1" />
      </div>

      {/* Borderless Input Fields */}
      <form onSubmit={(e) => e.preventDefault()} autoComplete="off" className="space-y-5">
        <input type="text" name="fake-username" style={{ display: 'none' }} tabIndex={-1} />
        <input type="password" name="fake-password" style={{ display: 'none' }} tabIndex={-1} />

        <div className="bg-slate-800/40 rounded-lg p-3">
          <label className="block text-xs font-medium text-[#080B1A] uppercase tracking-wider mb-1">
            Work Email
          </label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            placeholder="jdoe@lawfirm.com"
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-700 focus:outline-none"
          />
        </div>

        <div className="bg-slate-800/40 rounded-lg p-3">
          <label className="block text-xs font-medium text-[#080B1A] uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-700 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 bg-[#080B1A] hover:bg-[#080B1A]/90 text-slate-150 font-semibold text-sm rounded-xl transition-colors shadow-lg"
        >
          Sign In
        </button>
      </form>

      {/* Switcher */}
      <div className="mt-8 text-center text-xs text-slate-400">
        {"Don't have an account?"}{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-[#080B1A] font-semibold hover:underline ml-1"
        >
          Create Account
        </button>
      </div>
    </aside>
  );
}