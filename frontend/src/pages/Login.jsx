import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = tab === 'login' ? `${API}/auth/login` : `${API}/auth/signup`;
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      localStorage.setItem('pp_token', data.token);
      localStorage.setItem('pp_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen flex font-['Syne',sans-serif] bg-[#050a0e] text-[#e8f4f0]">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-20 flex-1">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 border border-[#00ffb4] rounded-lg flex items-center justify-center text-lg">⚡</div>
          <span className="text-[#00ffb4] font-['Space_Mono',monospace] text-lg font-bold">PricePulse</span>
        </div>
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Price<br />
          <span className="text-[#00ffb4]">Smarter.</span>
        </h1>
        <p className="font-['Space_Mono',monospace] text-sm text-[#5a7a70] leading-relaxed max-w-sm">
          AI-powered pricing that tracks competitors and recommends optimal prices in real time.
        </p>
        <div className="flex gap-8 mt-12">
          {[['12.4%', 'Revenue Uplift'], ['98ms', 'Pricing Latency'], ['50K+', 'Products Tracked']].map(([val, label]) => (
            <div key={label} className="border-l-2 border-[#00ffb4] pl-4">
              <div className="text-2xl font-bold text-[#00ffb4] font-['Space_Mono',monospace]">{val}</div>
              <div className="text-xs text-[#5a7a70] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[440px] bg-[#0b1219] border-l border-[rgba(0,255,180,0.12)] flex flex-col justify-center px-10 py-12">

        {/* Tab switcher */}
        <div className="flex bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg p-1 mb-8">
          {['login', 'signup'].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${tab === t ? 'bg-[#00ffb4] text-[#050a0e]' : 'text-[#5a7a70]'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold mb-1">{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="font-['Space_Mono',monospace] text-xs text-[#5a7a70] mb-6">
          {tab === 'login' ? '// sign in to your account' : '// join the pricing revolution'}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-[rgba(255,94,94,0.08)] border border-[rgba(255,94,94,0.25)] text-[#ff5e5e] text-xs font-['Space_Mono',monospace] rounded-lg">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
          {tab === 'signup' && (
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
              className="bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg px-4 py-3 text-sm font-['Space_Mono',monospace] outline-none focus:border-[#00ffb4] placeholder:text-[#2a4a40]" />
          )}
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email"
            className="bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg px-4 py-3 text-sm font-['Space_Mono',monospace] outline-none focus:border-[#00ffb4] placeholder:text-[#2a4a40]" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password"
            className="bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg px-4 py-3 text-sm font-['Space_Mono',monospace] outline-none focus:border-[#00ffb4] placeholder:text-[#2a4a40]" />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="mt-6 w-full py-3 bg-[#00ffb4] text-[#050a0e] rounded-lg font-bold text-sm hover:bg-[#00e6a2] transition-colors disabled:opacity-60">
          {loading ? 'Please wait...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        <p className="mt-5 text-center font-['Space_Mono',monospace] text-xs text-[#5a7a70]">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-[#00ffb4]">
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}