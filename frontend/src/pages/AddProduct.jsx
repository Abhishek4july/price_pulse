import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', basePrice: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: '', msg: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: '// Product indexed successfully' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus({ type: 'error', msg: '// Failed to register product' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: '// Connection to engine failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#050a0e]">
      <div className="w-full max-w-lg animate-fade-up">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-block px-3 py-1 mb-4 border border-[rgba(0,255,180,0.2)] bg-[rgba(0,255,180,0.05)] rounded-full">
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#00ffb4] tracking-[2px] uppercase">New Entry</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#dff0ea]">
            Add <span className="text-[#00ffb4]">Product</span>
          </h1>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={handleSubmit}
          className="bg-[#0b1219] border border-[rgba(0,255,180,0.10)] rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative side accent */}
          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00ffb4] to-transparent opacity-40"></div>

          {status.msg && (
            <div className={`mb-6 p-3 rounded-lg font-['Space_Mono',monospace] text-[11px] border ${
              status.type === 'success' 
              ? 'bg-[rgba(0,255,180,0.05)] border-[rgba(0,255,180,0.2)] text-[#00ffb4]' 
              : 'bg-[rgba(255,94,94,0.05)] border-[rgba(255,94,94,0.2)] text-[#ff5e5e]'
            }`}>
              {status.msg}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-2 ml-1">Product Name</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sony WH-1000XM5"
                className="w-full bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-xl px-4 py-3 text-sm font-['Space_Mono',monospace] text-[#dff0ea] outline-none focus:border-[#00ffb4] transition-colors placeholder:text-[#1e3828]"
              />
            </div>

            <div>
              <label className="block font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-2 ml-1">Category</label>
              <input
                required
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Audio · Electronics"
                className="w-full bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-xl px-4 py-3 text-sm font-['Space_Mono',monospace] text-[#dff0ea] outline-none focus:border-[#00ffb4] transition-colors placeholder:text-[#1e3828]"
              />
            </div>

            <div>
              <label className="block font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-widest mb-2 ml-1">Base Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Space_Mono',monospace] text-[#4a7060] text-sm">₹</span>
                <input
                  required
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-[#101d28] border border-[rgba(0,255,180,0.12)] rounded-xl px-8 py-3 text-sm font-['Space_Mono',monospace] text-[#dff0ea] outline-none focus:border-[#00ffb4] transition-colors placeholder:text-[#1e3828]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 border border-[rgba(0,255,180,0.1)] rounded-xl font-bold text-xs text-[#4a7060] hover:bg-[#0f1c27] transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-[2] py-3 bg-[#00ffb4] text-[#050a0e] rounded-xl font-bold text-xs hover:bg-[#00e6a2] hover:-translate-y-[1px] transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(0,255,180,0.15)]"
            >
              {loading ? 'Processing...' : 'Add Product →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}