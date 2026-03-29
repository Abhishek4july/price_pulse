import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [greeting, setGreeting] = useState('// loading...');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('pp_user') || '{}');
    const name = user.name || 'User';
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    setGreeting(`// ${timeGreeting}, ${name} — ${dateStr}`);
  }, []);

  // Chart Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const days = ['Mar 1', 'Mar 5', 'Mar 9', 'Mar 13', 'Mar 17', 'Mar 21', 'Mar 25', 'Mar 27'];
    const yours = [132000, 134000, 133500, 135000, 134900, 136000, 134900, 134900];
    const comp = [130000, 131000, 133000, 132500, 132000, 133000, 132900, 132900];

    const drawChart = () => {
      const wrap = canvas.parentElement;
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      const W = canvas.width, H = canvas.height;
      const PAD = { top: 20, right: 20, bottom: 36, left: 70 };
      const cW = W - PAD.left - PAD.right;
      const cH = H - PAD.top - PAD.bottom;

      ctx.clearRect(0, 0, W, H);

      const allVals = [...yours, ...comp];
      const minV = Math.min(...allVals) - 2000;
      const maxV = Math.max(...allVals) + 2000;

      const xPos = i => PAD.left + (i / (days.length - 1)) * cW;
      const yPos = v => PAD.top + cH - ((v - minV) / (maxV - minV)) * cH;

      // Grid lines
      for (let i = 0; i <= 4; i++) {
        const y = PAD.top + (i / 4) * cH;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,255,180,0.06)';
        ctx.lineWidth = 1;
        ctx.moveTo(PAD.left, y);
        ctx.lineTo(PAD.left + cW, y);
        ctx.stroke();

        const val = maxV - ((maxV - minV) * i / 4);
        ctx.fillStyle = 'rgba(90,120,112,0.8)';
        ctx.font = '10px Space Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('₹' + (val / 1000).toFixed(0) + 'K', PAD.left - 8, y + 4);
      }

      // X labels
      ctx.fillStyle = 'rgba(90,120,112,0.8)';
      ctx.textAlign = 'center';
      days.forEach((d, i) => { ctx.fillText(d, xPos(i), H - 8); });

      const drawLine = (data, color, dashed) => {
        ctx.beginPath();
        ctx.setLineDash(dashed ? [5, 4] : []);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        data.forEach((v, i) => { i === 0 ? ctx.moveTo(xPos(i), yPos(v)) : ctx.lineTo(xPos(i), yPos(v)); });
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Gradient
      const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
      grad.addColorStop(0, 'rgba(0,255,180,0.18)');
      grad.addColorStop(1, 'rgba(0,255,180,0)');
      ctx.beginPath();
      yours.forEach((v, i) => { i === 0 ? ctx.moveTo(xPos(i), yPos(v)) : ctx.lineTo(xPos(i), yPos(v)); });
      ctx.lineTo(xPos(yours.length - 1), PAD.top + cH);
      ctx.lineTo(xPos(0), PAD.top + cH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      drawLine(comp, 'rgba(0,191,255,0.55)', true);
      drawLine(yours, '#00ffb4', false);

      // Dots
      yours.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(xPos(i), yPos(v), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffb4';
        ctx.fill();
        ctx.strokeStyle = '#050a0e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Legend
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00ffb4';
      ctx.fillRect(PAD.left, 6, 12, 3);
      ctx.fillText('Your Price', PAD.left + 16, 12);
      ctx.fillStyle = 'rgba(0,191,255,0.55)';
      ctx.fillRect(PAD.left + 100, 6, 12, 3);
      ctx.fillStyle = 'rgba(0,191,255,0.7)';
      ctx.fillText('Competitor Avg', PAD.left + 116, 12);
    };

    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.4s ease both; }
        .animate-blink { animation: blink 1.5s ease infinite; }
        .scrollbar-custom::-webkit-scrollbar { width: 4px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #1e3828; border-radius: 2px; }
      `}</style>

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-8 py-4 bg-[#0b1219] border-b border-[rgba(0,255,180,0.10)] shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold tracking-[-0.5px]">Dashboard <span className="text-[#00ffb4]">Overview</span></h1>
          <p className="font-['Space_Mono',monospace] text-[11px] text-[#4a7060] mt-0.5">{greeting}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-['Space_Mono',monospace] text-[11px] text-[#00ffb4] bg-[rgba(0,255,180,0.07)] border border-[rgba(0,255,180,0.2)] px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-[#00ffb4] rounded-full animate-blink"></div>
            Live Tracking
          </div>
          <button onClick={() => navigate('/add-product')} className="flex items-center gap-1.5 px-4 py-2 bg-[#00ffb4] text-[#050a0e] border-none rounded-lg font-['Syne',sans-serif] text-[12px] font-bold cursor-pointer transition-transform hover:bg-[#00e6a2] hover:-translate-y-[1px]">
            + Add Product
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-7 md:px-8 flex flex-col gap-6 scrollbar-custom">
        
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl p-5 relative overflow-hidden hover:border-[rgba(0,255,180,0.22)] hover:-translate-y-[2px] transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#00ffb4] before:to-transparent" style={{ animationDelay: '0.05s' }}>
            <div className="flex justify-between items-start mb-3.5">
              <span className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px]">Products Tracked</span>
              <span className="text-[18px] opacity-60">📦</span>
            </div>
            <div className="text-[30px] font-extrabold tracking-[-1px] leading-none mb-1.5 text-[#00ffb4]">12</div>
            <div className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-1 text-[#00ffb4]">▲ 3 added this week</div>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl p-5 relative overflow-hidden hover:border-[rgba(0,255,180,0.22)] hover:-translate-y-[2px] transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#00bfff] before:to-transparent" style={{ animationDelay: '0.10s' }}>
            <div className="flex justify-between items-start mb-3.5">
              <span className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px]">Avg Price Delta</span>
              <span className="text-[18px] opacity-60">📉</span>
            </div>
            <div className="text-[30px] font-extrabold tracking-[-1px] leading-none mb-1.5 text-[#00bfff]">−4.2%</div>
            <div className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-1 text-[#ff5e5e]">▼ vs competitors</div>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl p-5 relative overflow-hidden hover:border-[rgba(0,255,180,0.22)] hover:-translate-y-[2px] transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#ffa500] before:to-transparent" style={{ animationDelay: '0.15s' }}>
            <div className="flex justify-between items-start mb-3.5">
              <span className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px]">Revenue Uplift</span>
              <span className="text-[18px] opacity-60">💰</span>
            </div>
            <div className="text-[30px] font-extrabold tracking-[-1px] leading-none mb-1.5 text-[#ffa500]">+12.4%</div>
            <div className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-1 text-[#00ffb4]">▲ from AI pricing</div>
          </div>

          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl p-5 relative overflow-hidden hover:border-[rgba(0,255,180,0.22)] hover:-translate-y-[2px] transition-all duration-200 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#ff5e5e] before:to-transparent" style={{ animationDelay: '0.20s' }}>
            <div className="flex justify-between items-start mb-3.5">
              <span className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px]">Active Alerts</span>
              <span className="text-[18px] opacity-60">🔔</span>
            </div>
            <div className="text-[30px] font-extrabold tracking-[-1px] leading-none mb-1.5 text-[#ff5e5e]">5</div>
            <div className="font-['Space_Mono',monospace] text-[11px] flex items-center gap-1 text-[#4a7060]">● 2 critical, 3 info</div>
          </div>
        </div>

        {/* TWO COL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          
          {/* Chart Panel */}
          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between p-4 px-5 border-b border-[rgba(0,255,180,0.10)]">
              <div className="text-[14px] font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ffb4]"></div> Price Trend — Last 30 Days
              </div>
              <button className="font-['Space_Mono',monospace] text-[11px] text-[#00ffb4] bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity">View all →</button>
            </div>
            <div className="p-5 h-[240px] relative w-full">
              <canvas ref={canvasRef} className="w-full h-full"></canvas>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between p-4 px-5 border-b border-[rgba(0,255,180,0.10)]">
              <div className="text-[14px] font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff5e5e]"></div> Live Alerts
              </div>
              <button className="font-['Space_Mono',monospace] text-[11px] text-[#00ffb4] bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity">Clear all</button>
            </div>
            <div className="flex flex-col">
              {[
                { dot: '#ff5e5e', title: 'Competitor undercut detected', desc: 'Amazon dropped iPhone 15 by ₹2,000 below your price', time: '2m ago' },
                { dot: '#00ffb4', title: 'Price raise opportunity', desc: 'Sony WH-1000XM5 demand up 34% — raise by ₹500', time: '15m ago' },
                { dot: '#ffa500', title: 'Stock low — adjust pricing', desc: 'MacBook Air M2 stock at 8 units, consider scarcity pricing', time: '1h ago' },
                { dot: '#00bfff', title: 'Weekly report ready', desc: 'Revenue uplift report for March 2026 is ready', time: '3h ago' },
                { dot: '#ffa500', title: 'Seasonal demand shift', desc: 'Summer products trending — update pricing strategy', time: '5h ago' }
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 px-5 border-b border-[rgba(0,255,180,0.10)] hover:bg-[#0f1c27] transition-colors last:border-none">
                  <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: alert.dot, boxShadow: `0 0 6px ${alert.dot}80` }}></div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold mb-0.5">{alert.title}</div>
                    <div className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] leading-[1.5]">{alert.desc}</div>
                  </div>
                  <div className="font-['Space_Mono',monospace] text-[10px] text-[#1e3828] shrink-0 ml-auto">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="animate-fade-up bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-xl overflow-hidden" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between p-4 px-5 border-b border-[rgba(0,255,180,0.10)]">
            <div className="text-[14px] font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></div> Product Pricing Intelligence
            </div>
            <button className="font-['Space_Mono',monospace] text-[11px] text-[#00ffb4] bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity">Export CSV →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">Product</th>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">Your Price</th>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">Competitor Avg</th>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">Trend</th>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">AI Recommendation</th>
                  <th className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[1.5px] p-2.5 px-5 border-b border-[rgba(0,255,180,0.10)] whitespace-nowrap">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'iPhone 15 Pro 256GB', cat: 'Electronics · Apple', price: '₹1,34,900', comp: '₹1,32,900', trend: '▼ Falling', tClass: 'text-[#ff5e5e] bg-[rgba(255,94,94,0.1)] border-[rgba(255,94,94,0.2)]', rec: '↓ Lower ₹1,900', rClass: 'text-[#ff5e5e] bg-[rgba(255,94,94,0.08)] border-[rgba(255,94,94,0.2)]', conf: '94%', cClass: 'text-[#00ffb4]' },
                  { name: 'Sony WH-1000XM5', cat: 'Audio · Sony', price: '₹26,990', comp: '₹28,500', trend: '▲ Rising', tClass: 'text-[#00ffb4] bg-[rgba(0,255,180,0.1)] border-[rgba(0,255,180,0.2)]', rec: '↑ Raise ₹1,500', rClass: 'text-[#00ffb4] bg-[rgba(0,255,180,0.08)] border-[rgba(0,255,180,0.2)]', conf: '87%', cClass: 'text-[#00ffb4]' },
                  { name: 'MacBook Air M2', cat: 'Laptops · Apple', price: '₹1,14,900', comp: '₹1,14,500', trend: '● Stable', tClass: 'text-[#00bfff] bg-[rgba(0,191,255,0.1)] border-[rgba(0,191,255,0.2)]', rec: '◆ Hold', rClass: 'text-[#00bfff] bg-[rgba(0,191,255,0.08)] border-[rgba(0,191,255,0.2)]', conf: '79%', cClass: 'text-[#00bfff]' },
                  { name: 'Samsung 65" QLED', cat: 'TVs · Samsung', price: '₹89,990', comp: '₹94,000', trend: '▲ Rising', tClass: 'text-[#00ffb4] bg-[rgba(0,255,180,0.1)] border-[rgba(0,255,180,0.2)]', rec: '↑ Raise ₹3,000', rClass: 'text-[#00ffb4] bg-[rgba(0,255,180,0.08)] border-[rgba(0,255,180,0.2)]', conf: '91%', cClass: 'text-[#00ffb4]' },
                  { name: 'OnePlus 12 256GB', cat: 'Electronics · OnePlus', price: '₹64,999', comp: '₹62,000', trend: '⚠ Watch', tClass: 'text-[#ffa500] bg-[rgba(255,165,0,0.1)] border-[rgba(255,165,0,0.2)]', rec: '↓ Lower ₹2,000', rClass: 'text-[#ff5e5e] bg-[rgba(255,94,94,0.08)] border-[rgba(255,94,94,0.2)]', conf: '72%', cClass: 'text-[#ffa500]' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(0,255,180,0.10)] hover:bg-[#0f1c27] transition-colors cursor-pointer last:border-none">
                    <td className="p-3.5 px-5 whitespace-nowrap">
                      <div className="font-bold text-[13px]">{row.name}</div>
                      <div className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] mt-0.5">{row.cat}</div>
                    </td>
                    <td className="p-3.5 px-5 whitespace-nowrap">
                      <div className="font-['Space_Mono',monospace] font-bold text-[13px]">{row.price}</div>
                      <div className="font-['Space_Mono',monospace] text-[11px] text-[#4a7060] mt-0.5">Comp: {row.comp}</div>
                    </td>
                    <td className="p-3.5 px-5 whitespace-nowrap"><span className="font-['Space_Mono',monospace] text-[13px]">{row.comp}</span></td>
                    <td className="p-3.5 px-5 whitespace-nowrap"><span className={`inline-block px-2.5 py-1 rounded-full font-['Space_Mono',monospace] text-[10px] font-bold border ${row.tClass}`}>{row.trend}</span></td>
                    <td className="p-3.5 px-5 whitespace-nowrap"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-['Space_Mono',monospace] text-[11px] font-bold border ${row.rClass}`}>{row.rec}</span></td>
                    <td className="p-3.5 px-5 whitespace-nowrap"><span className={`font-['Space_Mono',monospace] text-[12px] ${row.cClass}`}>{row.conf}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}