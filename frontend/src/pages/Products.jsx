import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'history', price: '', compName: '' });
  const [status, setStatus] = useState({ type: '', msg: '' }); // Professional Status UI
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("// Error fetching product index:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSeed = async (e) => {
    e.preventDefault();
    const endpoint = formData.type === 'history' ? '/api/products/history' : '/api/products/competitor';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct._id,
          price: Number(formData.price),
          ...(formData.type === 'comp' && { competitorName: formData.compName })
        })
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: '// DATA_INJECTED_SUCCESSFULLY' });
        setFormData({ ...formData, price: '', compName: '' });
        // Clear status after 3 seconds
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: '// SYSTEM_LINK_FAILURE' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-custom bg-[#050a0e]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00ffb4] animate-blink"></div>
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] uppercase tracking-[2px]">Active Inventory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#dff0ea]">
            Product <span className="text-[#00ffb4]">Intelligence</span>
          </h1>
          <p className="font-['Space_Mono',monospace] text-xs text-[#4a7060] mt-1">
            // Monitoring {products.length} assets across the price pulse network
          </p>
        </div>
        <button 
          onClick={() => navigate('/add-product')}
          className="px-6 py-2.5 bg-[#00ffb4] text-[#050a0e] rounded-lg font-bold text-xs hover:bg-[#00e6a2] transition-all hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,255,180,0.1)]"
        >
          + Register New Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="flex items-center justify-center h-64 font-['Space_Mono',monospace] text-[#1e3828] animate-pulse">// Synchronizing database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div 
              key={product._id} 
              className="animate-fade-up group relative bg-[#0b1219] border border-[rgba(0,255,180,0.1)] rounded-2xl p-6 hover:border-[rgba(0,255,180,0.3)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-['Space_Mono',monospace] text-[9px] text-[#4a7060] bg-[rgba(0,255,180,0.03)] border border-[rgba(0,255,180,0.1)] px-2 py-1 rounded tracking-widest uppercase">{product.category}</span>
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,180,0.05)] flex items-center justify-center text-xs opacity-40 group-hover:opacity-100 transition-opacity">📦</div>
              </div>

              <h3 className="text-xl font-bold text-[#dff0ea] mb-1 group-hover:text-[#00ffb4] transition-colors">{product.name}</h3>
              <p className="font-['Space_Mono',monospace] text-[10px] text-[#4a7060] mb-6">ID: {product._id.substring(18).toUpperCase()}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-[rgba(0,255,180,0.05)]">
                <div>
                  <p className="font-['Space_Mono',monospace] text-[9px] text-[#4a7060] uppercase tracking-tighter">Base Value</p>
                  <p className="text-lg font-black text-[#dff0ea]">₹{product.basePrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-['Space_Mono',monospace] text-[9px] text-[#4a7060] uppercase tracking-tighter">Status</p>
                  <p className="text-[11px] font-bold text-[#00ffb4]">● TRACKING</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                   onClick={() => { setSelectedProduct(product); setShowModal(true); setStatus({type:'', msg:''}); }}
                   className="flex-1 py-3 bg-[#101d28] border border-[rgba(0,255,180,0.12)] text-[#00ffb4] font-['Space_Mono',monospace] text-[10px] font-bold rounded-xl hover:bg-[rgba(0,255,180,0.1)] transition-all"
                >
                  + SEED DATA
                </button>
                <button 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="flex-1 py-3 bg-[#00ffb4] text-[#050a0e] font-['Space_Mono',monospace] text-[10px] font-bold rounded-xl hover:bg-[#00e6a2] transition-all"
                >
                  AI PULSE →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- QUICK SEED MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050a0e]/95 backdrop-blur-md p-4">
          <div className="bg-[#0b1219] border border-[#00ffb4]/30 w-full max-w-md rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-up relative overflow-hidden">
            
            {/* Success/Error Toast (Top of Modal) */}
            {status.msg && (
              <div className={`absolute top-0 left-0 right-0 py-2 px-4 text-center font-['Space_Mono'] text-[10px] font-bold animate-pulse ${status.type === 'success' ? 'bg-[#00ffb4] text-[#050a0e]' : 'bg-[#ff5e5e] text-[#dff0ea]'}`}>
                {status.msg}
              </div>
            )}

            <div className="flex justify-between items-center mb-8 mt-4">
              <div>
                <h2 className="font-['Space_Mono'] text-[#00ffb4] text-[11px] font-bold tracking-[3px] uppercase">Data Injection Terminal</h2>
                <p className="text-[#4a7060] text-[10px] mt-1 font-['Space_Mono']">// Target: {selectedProduct?.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a7060] hover:text-[#ff5e5e] hover:bg-[#ff5e5e]/10 transition-all">✕</button>
            </div>

            <form onSubmit={handleSeed} className="space-y-6">
              {/* FIXED TABS: Increased height and padding */}
              <div className="flex bg-[#050a0e] p-1.5 rounded-xl border border-[rgba(0,255,180,0.15)] shadow-inner">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'history'})} 
                  className={`flex-1 py-2.5 text-[10px] font-black rounded-lg transition-all duration-300 tracking-widest ${formData.type === 'history' ? 'bg-[#00ffb4] text-[#050a0e] shadow-[0_0_15px_rgba(0,255,180,0.3)]' : 'text-[#4a7060] hover:text-[#dff0ea]'}`}
                >
                  INTERNAL
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'comp'})} 
                  className={`flex-1 py-2.5 text-[10px] font-black rounded-lg transition-all duration-300 tracking-widest ${formData.type === 'comp' ? 'bg-[#00ffb4] text-[#050a0e] shadow-[0_0_15px_rgba(0,255,180,0.3)]' : 'text-[#4a7060] hover:text-[#dff0ea]'}`}
                >
                  COMPETITOR
                </button>
              </div>

              <div className="space-y-4">
                {formData.type === 'comp' && (
                  <div>
                    <label className="block text-[9px] font-['Space_Mono'] text-[#4a7060] uppercase mb-2 ml-1">Market Source</label>
                    <input 
                      placeholder="e.g. Amazon, Flipkart" 
                      className="w-full bg-[#101d28] border border-[rgba(0,255,180,0.15)] p-4 rounded-xl text-xs font-['Space_Mono'] text-[#dff0ea] outline-none focus:border-[#00ffb4] focus:shadow-[0_0_10px_rgba(0,255,180,0.05)] transition-all" 
                      value={formData.compName} 
                      onChange={e => setFormData({...formData, compName: e.target.value})} 
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-[9px] font-['Space_Mono'] text-[#4a7060] uppercase mb-2 ml-1">Point Valuation (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-[#101d28] border border-[rgba(0,255,180,0.15)] p-4 rounded-xl text-xs font-['Space_Mono'] text-[#dff0ea] outline-none focus:border-[#00ffb4] focus:shadow-[0_0_10px_rgba(0,255,180,0.05)] transition-all" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    required
                  />
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#00ffb4] text-[#050a0e] font-black text-xs rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(0,255,180,0.15)] uppercase tracking-widest mt-4">
                Inject data →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}