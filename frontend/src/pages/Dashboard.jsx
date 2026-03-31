import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('// INITIALIZING_SYSTEM...');
  const [stats, setStats] = useState({ total: 0, categories: 0, alerts: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('pp_user') || '{}');
    const name = user.name || 'Agent';
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(`// ${timeGreeting}, ${name} — System active.`);

    // Fetch live product count for real metrics
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const uniqueCats = [...new Set(data.map(p => p.category))].length;
        setStats({ total: data.length, categories: uniqueCats, alerts: 5 });
      })
      .catch(() => setStats({ total: 0, categories: 0, alerts: 0 }));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#050a0e] overflow-hidden">
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.4s ease both; }
        .animate-blink { animation: blink 1.5s ease infinite; }
      `}</style>

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-8 py-5 bg-[#0b1219] border-b border-[rgba(0,255,180,0.10)]">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight">Command <span className="text-[#00ffb4]">Center</span></h1>
          <p className="font-['Space_Mono',monospace] text-[11px] text-[#4a7060] mt-1">{greeting}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-['Space_Mono',monospace] text-[10px] text-[#00ffb4] bg-[rgba(0,255,180,0.05)] border border-[rgba(0,255,180,0.15)] px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00ffb4] rounded-full animate-blink"></div>
            ENCRYPTION_ACTIVE
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-custom">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.1)] rounded-2xl p-6 hover:border-[rgba(0,255,180,0.2)] transition-all">
            <p className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-4">Total Managed Assets</p>
            <div className="text-5xl font-black text-[#dff0ea] mb-2">{stats.total}</div>
            <p className="text-[11px] text-[#00ffb4] font-['Space_Mono']">// Ready for market pulse analysis</p>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,191,255,0.1)] rounded-2xl p-6 hover:border-[rgba(0,191,255,0.2)] transition-all" style={{ animationDelay: '0.1s' }}>
            <p className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-4">Active Categories</p>
            <div className="text-5xl font-black text-[#00bfff] mb-2">{stats.categories}</div>
            <p className="text-[11px] text-[#00bfff] font-['Space_Mono']">// Diverse inventory coverage</p>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(255,94,94,0.1)] rounded-2xl p-6 hover:border-[rgba(255,94,94,0.2)] transition-all" style={{ animationDelay: '0.2s' }}>
            <p className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-4">Security Notifications</p>
            <div className="text-5xl font-black text-[#ff5e5e] mb-2">{stats.alerts}</div>
            <p className="text-[11px] text-[#ff5e5e] font-['Space_Mono']">// Anomalies detected in pricing</p>
          </div>
        </div>

        {/* QUICK ACTIONS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.05)] rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-[rgba(0,255,180,0.05)] border border-[rgba(0,255,180,0.2)] rounded-full flex items-center justify-center text-2xl">📦</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Inventory Management</h3>
              <p className="text-sm text-[#4a7060] font-['Space_Mono']">Register new products to start tracking market trends and AI recommendations.</p>
            </div>
            <button 
              onClick={() => navigate('/add-product')}
              className="px-8 py-3 bg-[#00ffb4] text-[#050a0e] font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Initialize New Asset
            </button>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,191,255,0.05)] rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-[rgba(0,191,255,0.05)] border border-[rgba(0,191,255,0.2)] rounded-full flex items-center justify-center text-2xl">⚡</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Market Intelligence</h3>
              <p className="text-sm text-[#4a7060] font-['Space_Mono']">View active price pulses and analyze competitor data shifts in real-time.</p>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-3 border border-[#00bfff] text-[#00bfff] font-bold rounded-xl hover:bg-[#00bfff]/10 transition-all"
            >
              Open Pulse Monitor
            </button>
          </div>
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <div className="pt-8 border-t border-[rgba(0,255,180,0.05)] flex justify-between items-center text-[10px] font-['Space_Mono'] text-[#1e3828] uppercase tracking-[2px]">
          <div>System: PricePulse_Kernel_v2.0</div>
          <div className="flex gap-4">
            <span>Uptime: 99.99%</span>
            <span className="text-[#00ffb4]">Status: Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}