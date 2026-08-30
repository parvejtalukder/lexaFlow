'use client';

import { useState } from 'react';

export default function LegalSignUp() {
  const [role, setRole] = useState('Attorney');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSignUp = (e) => {
    e.preventDefault();
    // Integrate your backend registration logic here
    console.log('Signing up with:', { role, ...formData });
  };

  const handleGoogleSignUp = () => {
    // Integrate NextAuth, Supabase, or Firebase OAuth trigger here
    console.log(`Initiating Google OAuth for role: ${role}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl text-slate-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-100 font-semibold tracking-wide">
          Join the Legal Portal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Streamline case management, secure client communication, and collaborate effortlessly.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Select Your Professional Role
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
          {['Attorney', 'Case Worker', 'Paralegal'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`py-2 rounded-md font-medium transition-all ${
                role === item
                  ? 'bg-amber-600/90 text-amber-50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Social Registration */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm text-slate-200 font-medium transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-900 px-2 text-slate-500 uppercase tracking-wider">
            Or register with credentials
          </span>
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Jane Doe, Esq."
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Work / Firm Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="jdoe@lawfirm.com"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-amber-50 font-medium text-sm rounded-lg transition-colors shadow-md"
        >
          Create {role} Account
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Already registered?{' '}
        <a href="/login" className="text-amber-400 hover:underline">
          Sign in here
        </a>
      </p>
    </div>
  );
}