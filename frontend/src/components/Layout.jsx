import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'user' });

  useEffect(() => {
    const token = localStorage.getItem('pp_token');
    const userData = JSON.parse(localStorage.getItem('pp_user') || 'null');
    
    if (!token || !userData) {
      navigate('/');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    navigate('/');
  };

  const navItems = [
    { section: 'Main' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Products', path: '/products', icon: '📦' },
    // { name: 'Compare Products', path: '/compare', icon: '⚖️' },
    // { section: 'Analytics' },
    // { name: 'Price History', path: '/track', icon: '📈' },
    // { name: 'Demand Model', path: '#', icon: '🎯' },
    // { name: 'Alerts', path: '#', icon: '⚠️' },
    // { section: 'Settings' },
    // { name: 'Settings', path: '#', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen w-full font-['Syne',sans-serif] bg-[#050a0e] text-[#dff0ea] overflow-hidden">
      
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-[240px] min-w-[240px] bg-[#0b1219] border-r border-[rgba(0,255,180,0.10)] relative z-10 after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-[#00ffb4] after:to-transparent after:opacity-15">
        
        <div className="flex items-center gap-2.5 p-6 pb-5 border-b border-[rgba(0,255,180,0.10)]">
          <div className="w-9 h-9 border-[1.5px] border-[#00ffb4] rounded-lg flex items-center justify-center text-[16px] shadow-[0_0_16px_rgba(0,255,180,0.15)] shrink-0">⚡</div>
          <div>
            <div className="font-['Space_Mono',monospace] text-[15px] font-bold text-[#00ffb4] leading-none">PricePulse</div>
            <div className="font-['Space_Mono',monospace] text-[9px] text-[#4a7060] tracking-[1.5px] uppercase mt-1">Pricing Engine</div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item, idx) => 
            item.section ? (
              <div key={idx} className="font-['Space_Mono',monospace] text-[9px] text-[#4a7060] uppercase tracking-[2px] px-2 pt-2.5 pb-1.5 mt-2">
                {item.section}
              </div>
            ) : (
              <Link 
                key={idx} 
                to={item.path}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-150 border text-[13px] font-semibold relative ${location.pathname === item.path ? 'bg-[rgba(0,255,180,0.07)] text-[#00ffb4] border-[rgba(0,255,180,0.18)]' : 'border-transparent text-[#4a7060] hover:bg-[#0f1c27] hover:text-[#dff0ea] hover:border-[rgba(0,255,180,0.10)]'}`}
              >
                {location.pathname === item.path && <div className="absolute -left-[1px] top-[20%] bottom-[20%] w-[2px] bg-[#00ffb4] rounded-[2px]" />}
                <span className="text-[15px] w-5 text-center">{item.icon}</span>
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="p-4 border-t border-[rgba(0,255,180,0.10)]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0f1c27] border border-[rgba(0,255,180,0.10)]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ffb4] to-[#00bfff] rounded-lg flex items-center justify-center font-bold text-[13px] text-[#050a0e] shrink-0">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-[12px] font-bold text-[#dff0ea] whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px]">{user?.name}</div>
            </div>
            <button onClick={handleLogout} className="ml-auto bg-transparent border-none text-[#4a7060] cursor-pointer text-[16px] p-1 transition-colors hover:text-[#ff5e5e] shrink-0" title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  );
}