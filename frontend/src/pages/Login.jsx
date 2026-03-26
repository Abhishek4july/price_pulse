import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

const Login = () => {
  const [currentTab, setCurrentTab] = useState('login');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // UI State
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', msg: '' }
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [successState, setSuccessState] = useState({ visible: false, title: '', msg: '' });

  // Password Strength State
  const [pwScore, setPwScore] = useState(0);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Evaluate password strength if typing in signup password
    if (name === 'password' && currentTab === 'signup') {
      evaluatePassword(value);
    }
  };

  const evaluatePassword = (pw) => {
    if (!pw) {
      setPwScore(0);
      return;
    }
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setPwScore(score);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Switch Tabs
  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
    setErrors({});
    setAlert(null);
    setSuccessState({ visible: false, title: '', msg: '' });
    setShowPass(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setPwScore(0);
  };

  // Login Submit
  const handleLogin = async () => {
    setErrors({});
    setAlert(null);
    
    const { email, password } = formData;
    let newErrors = {};
    let isValid = true;

    if (!email) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateEmail(email)) { newErrors.email = 'Enter a valid email'; isValid = false; }
    if (!password) { newErrors.password = 'Password is required'; isValid = false; }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423) {
          setAlert({ type: 'error', msg: data.message });
        } else if (data.errors) {
          const apiErrors = {};
          data.errors.forEach(e => { apiErrors[e.field] = e.message; });
          setErrors(apiErrors);
        } else {
          setAlert({ type: 'error', msg: data.message || 'Login failed. Please try again.' });
        }
        return;
      }

      localStorage.setItem('pp_token', data.accessToken);
      localStorage.setItem('pp_user', JSON.stringify(data.user));

      setSuccessState({
        visible: true,
        title: `Welcome back, ${data.user?.name || 'User'}!`,
        msg: 'Login successful. Redirecting to your dashboard...'
      });
      
      setTimeout(() => { window.location.href = '/home.html'; }, 1500);

    } catch (err) {
      setAlert({ type: 'error', msg: 'Cannot connect to server. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  // Signup Submit
  const handleSignup = async () => {
    setErrors({});
    setAlert(null);

    const { name, email, password, confirmPassword } = formData;
    let newErrors = {};
    let isValid = true;

    if (!name || name.length < 2) { newErrors.name = 'Name must be at least 2 characters'; isValid = false; }
    if (!email) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateEmail(email)) { newErrors.email = 'Enter a valid email'; isValid = false; }
    if (!password || password.length < 8) { newErrors.password = 'Password must be at least 8 characters'; isValid = false; }
    if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; isValid = false; }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const apiErrors = {};
          data.errors.forEach(e => { apiErrors[e.field] = e.message; });
          setErrors(apiErrors);
        } else {
          setAlert({ type: 'error', msg: data.message || 'Signup failed. Please try again.' });
        }
        return;
      }

      localStorage.setItem('pp_token', data.accessToken);
      localStorage.setItem('pp_user', JSON.stringify(data.user));

      setSuccessState({
        visible: true,
        title: `Welcome, ${data.user?.name || 'User'}! 🎉`,
        msg: 'Your account has been created. Setting up your dashboard...'
      });

      setTimeout(() => { window.location.href = '/home.html'; }, 1500);

    } catch (err) {
      setAlert({ type: 'error', msg: 'Cannot connect to server. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  // Enter Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        currentTab === 'login' ? handleLogin() : handleSignup();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, formData]);


  // Helper styles for password strength
  const getPwLevelClass = (index) => {
    if (index >= pwScore) return 'bg-[#101d28] border-[rgba(0,255,180,0.12)]';
    if (pwScore === 1) return 'bg-[#ff5e5e] border-[#ff5e5e]';
    if (pwScore === 2) return 'bg-[#ffa500] border-[#ffa500]';
    if (pwScore === 3) return 'bg-[#00bfff] border-[#00bfff]';
    return 'bg-[#00ffb4] border-[#00ffb4]';
  };

  const getPwLabel = () => {
    if (pwScore === 1) return { text: 'Weak', color: '#ff5e5e' };
    if (pwScore === 2) return { text: 'Fair', color: '#ffa500' };
    if (pwScore === 3) return { text: 'Good — almost there', color: '#00bfff' };
    if (pwScore === 4) return { text: 'Strong ✓', color: '#00ffb4' };
    return { text: 'Enter a password', color: '#5a7a70' };
  };

  return (
    <div className="min-h-screen flex font-['Syne',sans-serif] bg-[#050a0e] text-[#e8f4f0] overflow-hidden selection:bg-[#00ffb4] selection:text-[#050a0e]">
      
      {/* Required Custom CSS for animations and complex masks not supported natively by Tailwind classes */}
      <style>{`
        .custom-grid-bg {
          background-image: linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 30% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 30% 50%, black 30%, transparent 100%);
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker-scroll 20s linear infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,180,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,255,180,0.4); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        input:focus + svg, input:focus ~ button svg { opacity: 0.8 !important; }
      `}</style>

      {/* ─── Left Panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-20 py-15 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,255,180,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(0,191,255,0.05) 0%, transparent 60%)'
          }}
        />
        <div className="absolute inset-0 custom-grid-bg z-0" />

        <div className="relative z-10 mb-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 border-[1.5px] border-[#00ffb4] rounded-[10px] flex items-center justify-center text-[20px] shadow-[0_0_20px_rgba(0,255,180,0.2),inset_0_0_20px_rgba(0,255,180,0.05)]">⚡</div>
            <span className="text-[22px] font-extrabold tracking-[-0.5px] text-[#00ffb4] font-['Space_Mono',monospace]">PricePulse</span>
          </div>
          <div className="text-[11px] text-[#5a7a70] font-['Space_Mono',monospace] tracking-[2px] uppercase ml-14">Intelligent Pricing Engine</div>
        </div>

        <div className="relative z-10">
          <h1 className="text-[clamp(36px,4vw,56px)] font-extrabold leading-[1.05] tracking-[-2px] mb-5">
            <div className="text-[#e8f4f0]">Price</div>
            <div className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0,255,180,0.5)' }}>Smarter.</div>
            <div className="bg-gradient-to-r from-[#00ffb4] to-[#00bfff] text-transparent bg-clip-text">Win More.</div>
          </h1>
          <p className="font-['Space_Mono',monospace] text-[13px] text-[#5a7a70] leading-[1.8] max-w-[380px]">
            AI-powered dynamic pricing that tracks competitors,
            predicts demand shifts, and recommends optimal prices
            — in real time.
          </p>
        </div>

        <div className="flex gap-8 mt-14 relative z-10">
          <div className="border-l-2 border-[#00ffb4] pl-4">
            <div className="text-[28px] font-extrabold text-[#00ffb4] font-['Space_Mono',monospace] leading-none">12.4%</div>
            <div className="text-[11px] text-[#5a7a70] uppercase tracking-[1px] mt-1">Avg Revenue Uplift</div>
          </div>
          <div className="border-l-2 border-[#00ffb4] pl-4">
            <div className="text-[28px] font-extrabold text-[#00ffb4] font-['Space_Mono',monospace] leading-none">98ms</div>
            <div className="text-[11px] text-[#5a7a70] uppercase tracking-[1px] mt-1">Pricing Latency</div>
          </div>
          <div className="border-l-2 border-[#00ffb4] pl-4">
            <div className="text-[28px] font-extrabold text-[#00ffb4] font-['Space_Mono',monospace] leading-none">50K+</div>
            <div className="text-[11px] text-[#5a7a70] uppercase tracking-[1px] mt-1">Products Tracked</div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 overflow-hidden z-10">
          <div className="flex gap-12 whitespace-nowrap animate-ticker w-max">
            {/* Render items twice for seamless loop */}
            {[1, 2].map((loopIndex) => (
              <React.Fragment key={loopIndex}>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(0,255,180,0.4)]">AAPL ▲ $189.42</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(255,94,94,0.4)]">AMZN ▼ $178.90</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(0,255,180,0.4)]">MSFT ▲ $412.33</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(0,255,180,0.4)]">NVDA ▲ $878.12</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(255,94,94,0.4)]">META ▼ $501.45</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(0,255,180,0.4)]">TSLA ▲ $201.34</span>
                <span className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-2 text-[rgba(255,94,94,0.4)]">GOOGL ▼ $166.78</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Panel ────────────────────────────────── */}
      <div className="w-full lg:w-[480px] lg:min-w-[480px] bg-[#0b1219] lg:border-l border-[rgba(0,255,180,0.12)] flex flex-col justify-center px-6 py-10 md:px-12 md:py-15 relative overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ffb4] to-transparent lg:hidden" />
        
        {/* Render content based on success state */}
        {!successState.visible ? (
          <>
            {/* Tab Switcher */}
            <div className="flex bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-[10px] p-1 mb-10">
              <button 
                className={`flex-1 p-[10px] border-none font-['Syne',sans-serif] text-[13px] font-semibold rounded-[7px] transition-all duration-200 tracking-[0.5px] ${currentTab === 'login' ? 'bg-[#00ffb4] text-[#050a0e]' : 'bg-transparent text-[#5a7a70]'}`}
                onClick={() => handleTabSwitch('login')}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 p-[10px] border-none font-['Syne',sans-serif] text-[13px] font-semibold rounded-[7px] transition-all duration-200 tracking-[0.5px] ${currentTab === 'signup' ? 'bg-[#00ffb4] text-[#050a0e]' : 'bg-transparent text-[#5a7a70]'}`}
                onClick={() => handleTabSwitch('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Alert Box */}
            {alert && (
              <div className={`p-3 rounded-lg font-['Space_Mono',monospace] text-[12px] flex items-start gap-2.5 mb-6 ${alert.type === 'error' ? 'bg-[rgba(255,94,94,0.08)] border border-[rgba(255,94,94,0.25)] text-[#ff5e5e]' : 'bg-[rgba(0,255,180,0.08)] border border-[rgba(0,255,180,0.25)] text-[#00ffb4]'}`}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"/>
                </svg>
                <span>{alert.msg}</span>
              </div>
            )}

            {/* Login Form */}
            {currentTab === 'login' && (
              <div className="animate-fade-in flex flex-col">
                <div className="mb-8">
                  <h2 className="text-[26px] font-extrabold tracking-[-1px] mb-1.5">Welcome back</h2>
                  <p className="font-['Space_Mono',monospace] text-[12px] text-[#5a7a70]">// sign in to your account</p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com" 
                        className={`w-full bg-[#101d28] border ${errors.email ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    {errors.email && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        className={`w-full bg-[#101d28] border ${errors.password ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7a70] p-1 flex items-center opacity-60 hover:opacity-100 transition-opacity">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                    {errors.password && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.password}</span>
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={handleLogin}
                    disabled={loading}
                    className={`mt-2 w-full py-3.5 bg-[#00ffb4] text-[#050a0e] border-none rounded-lg font-['Syne',sans-serif] text-[14px] font-bold cursor-pointer tracking-[0.5px] transition-all duration-200 relative overflow-hidden ${loading ? 'opacity-70 pointer-events-none' : 'hover:bg-[#00e6a2] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,255,180,0.25)] active:translate-y-0'}`}
                  >
                    {!loading ? <span>Sign In →</span> : <div className="w-4 h-4 border-2 border-transparent border-t-[#050a0e] rounded-full animate-spin mx-auto" />}
                  </button>

                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-[1px] bg-[rgba(0,255,180,0.12)]"></div>
                    <span className="font-['Space_Mono',monospace] text-[10px] text-[#2a4a40] uppercase tracking-[2px]">or continue with</span>
                    <div className="flex-1 h-[1px] bg-[rgba(0,255,180,0.12)]"></div>
                  </div>

                  <div className="flex gap-2.5">
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg text-[#5a7a70] font-['Space_Mono',monospace] text-[12px] transition-all duration-200 hover:border-[rgba(0,255,180,0.35)] hover:text-[#e8f4f0]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </a>
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-lg text-[#5a7a70] font-['Space_Mono',monospace] text-[12px] transition-all duration-200 hover:border-[rgba(0,255,180,0.35)] hover:text-[#e8f4f0]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.013.044.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                      Discord
                    </a>
                  </div>
                </div>

                <div className="mt-6 text-center font-['Space_Mono',monospace] text-[11px] text-[#5a7a70]">
                  Don't have an account? <a href="#" className="text-[#00ffb4] no-underline" onClick={(e) => { e.preventDefault(); handleTabSwitch('signup'); }}>Sign up free</a>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {currentTab === 'signup' && (
              <div className="animate-fade-in flex flex-col">
                <div className="mb-8">
                  <h2 className="text-[26px] font-extrabold tracking-[-1px] mb-1.5">Create account</h2>
                  <p className="font-['Space_Mono',monospace] text-[12px] text-[#5a7a70]">// join the pricing revolution</p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Name Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className={`w-full bg-[#101d28] border ${errors.name ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    {errors.name && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com" 
                        className={`w-full bg-[#101d28] border ${errors.email ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    {errors.email && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters" 
                        className={`w-full bg-[#101d28] border ${errors.password ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7a70] p-1 flex items-center opacity-60 hover:opacity-100 transition-opacity">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password.length > 0 && (
                      <div className="mt-2 block">
                        <div className="flex gap-1 mb-1.5">
                          {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className={`flex-1 h-[3px] rounded-[2px] border transition-colors duration-300 ${getPwLevelClass(idx)}`} />
                          ))}
                        </div>
                        <span className="font-['Space_Mono',monospace] text-[10px]" style={{ color: getPwLabel().color }}>
                          {getPwLabel().text}
                        </span>
                      </div>
                    )}

                    {errors.password && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.password}</span>
                      </span>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#5a7a70] uppercase tracking-[1.5px] font-['Space_Mono',monospace]">Confirm Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        className={`w-full bg-[#101d28] border ${errors.confirmPassword ? 'border-[#ff5e5e]' : 'border-[rgba(0,255,180,0.12)]'} rounded-lg py-3 pr-3.5 pl-[42px] text-[#e8f4f0] font-['Space_Mono',monospace] text-[13px] outline-none transition-all duration-200 focus:border-[#00ffb4] focus:bg-[rgba(0,255,180,0.03)] focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)] placeholder:text-[#2a4a40]`}
                      />
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none transition-opacity duration-200">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    {errors.confirmPassword && (
                      <span className="font-['Space_Mono',monospace] text-[11px] text-[#ff5e5e] flex items-center gap-1 mt-0.5">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        <span>{errors.confirmPassword}</span>
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={handleSignup}
                    disabled={loading}
                    className={`mt-2 w-full py-3.5 bg-[#00ffb4] text-[#050a0e] border-none rounded-lg font-['Syne',sans-serif] text-[14px] font-bold cursor-pointer tracking-[0.5px] transition-all duration-200 relative overflow-hidden ${loading ? 'opacity-70 pointer-events-none' : 'hover:bg-[#00e6a2] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,255,180,0.25)] active:translate-y-0'}`}
                  >
                    {!loading ? <span>Create Account →</span> : <div className="w-4 h-4 border-2 border-transparent border-t-[#050a0e] rounded-full animate-spin mx-auto" />}
                  </button>
                </div>

                <div className="mt-5 text-center font-['Space_Mono',monospace] text-[11px] text-[#5a7a70]">
                  Already have an account? <a href="#" className="text-[#00ffb4] no-underline" onClick={(e) => { e.preventDefault(); handleTabSwitch('login'); }}>Sign in</a><br/>
                  <span className="text-[10px] mt-1.5 block text-[#2a4a40]">
                    By signing up you agree to our Terms of Service & Privacy Policy
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <div className="animate-fade-in flex flex-col items-center text-center gap-4">
            <div className="w-[72px] h-[72px] border-2 border-[#00ffb4] rounded-full flex items-center justify-center text-[32px] text-[#00ffb4] shadow-[0_0_40px_rgba(0,255,180,0.2)] animate-pulse-glow">
              ✓
            </div>
            <h2 className="text-[22px] tracking-[-0.5px] font-extrabold">{successState.title}</h2>
            <p className="font-['Space_Mono',monospace] text-[12px] text-[#5a7a70] max-w-[280px]">
              {successState.msg}
            </p>
            <div className="font-['Space_Mono',monospace] text-[11px] text-[#00ffb4] flex items-center gap-1.5 mt-2">
              <div className="w-3 h-3 border-2 border-transparent border-t-[#00ffb4] rounded-full animate-spin block"></div>
              Loading dashboard...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;