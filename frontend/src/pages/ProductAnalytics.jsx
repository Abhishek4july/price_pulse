import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductAnalytics() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPulse = async () => {
    setLoading(true);
    try {
      // 1. Fetch AI Recommendation

      const recRes = await fetch(
        `http://localhost:5000/api/recommend/${productId}`,
      );
      const recData = await recRes.json();
      setRecommendation(recData);

      // 2. Fetch Product Context
      const prodRes = await fetch(`http://localhost:5000/api/products`);
      const allProds = await prodRes.json();
      setProduct(allProds.find((p) => p._id === productId));
    } catch (err) {
      console.error("Pulse synchronization failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050a0e] font-['Space_Mono'] text-[#00ffb4]">
        <div className="animate-pulse tracking-[4px]">
          // SYNCHRONIZING_NEURAL_NETWORK...
        </div>
      </div>
    );
  }

  const isDataReady =
    recommendation && recommendation.recommendedPrice !== undefined;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#050a0e] scrollbar-custom flex flex-col items-center">
      <div className="w-full max-w-5xl animate-fade-up">
        {/* HEADER & NAVIGATION */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <button
              onClick={() => navigate("/products")}
              className="font-['Space_Mono'] text-[10px] text-[#4a7060] uppercase tracking-[2px] mb-4 hover:text-[#00ffb4] transition-colors"
            >
              ← Back to Inventory
            </button>
            <h1 className="text-4xl font-extrabold text-[#dff0ea] tracking-tight">
              Market <span className="text-[#00ffb4]">Pulse</span>
            </h1>
            <p className="font-['Space_Mono'] text-xs text-[#4a7060] mt-2">
              // Neural Analysis for:{" "}
              <span className="text-[#dff0ea]">
                {product?.name || "Unknown Asset"}
              </span>
            </p>
          </div>

          <div className="text-right">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isDataReady ? "border-[#00ffb4]/20 bg-[#00ffb4]/5 text-[#00ffb4]" : "border-[#ff5e5e]/20 bg-[#ff5e5e]/5 text-[#ff5e5e]"} font-['Space_Mono'] text-[9px] uppercase tracking-widest`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${isDataReady ? "bg-[#00ffb4] animate-blink" : "bg-[#ff5e5e]"}`}
              ></div>
              {recommendation?.mlUsed
                ? "ML Engine Active"
                : "Fallback Logic Active"}
            </div>
          </div>
        </div>

        {/* MAIN ANALYSIS CARD */}
        <div className="bg-[#0b1219] border border-[rgba(0,191,255,0.15)] rounded-3xl p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00bfff] opacity-[0.02] blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ffb4] opacity-[0.02] blur-[100px]"></div>

          {isDataReady ? (
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* PRIMARY RECOMMENDATION */}
                <div className="flex flex-col justify-center">
                  <span className="font-['Space_Mono'] text-[10px] text-[#00bfff] tracking-[4px] uppercase mb-6">
                    AI Optimization Result
                  </span>
                  {!recommendation?.mlUsed && (
                    <p className="text-xs text-[#ffa500] mt-3 font-['Space_Mono']">
                      // Using limited-data prediction (1+ history point supported)
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#4a7060]">₹</span>
                    <h2 className="text-6xl font-black text-[#dff0ea] tracking-tighter">
                      {recommendation.recommendedPrice?.toLocaleString() || "0"}
                    </h2>
                  </div>

                  <div className="mt-8 p-6 bg-[rgba(0,255,180,0.03)] border border-[rgba(0,255,180,0.1)] rounded-2xl">
                    <div className="flex gap-3">
                      <span className="text-[#00ffb4] text-lg">💡</span>
                      <p className="text-[#dff0ea] text-sm leading-relaxed italic">
                        "{recommendation.reason}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-6 bg-[#101d28] border border-[rgba(255,255,255,0.03)] rounded-2xl group hover:border-[#ffa500]/30 transition-all">
                    <p className="text-[#4a7060] text-[10px] font-['Space_Mono'] uppercase tracking-widest mb-2">
                      Predicted Demand
                    </p>
                    <div className="flex items-end justify-between">
                      <p className="text-4xl font-bold text-[#ffa500]">
                        {((recommendation.predictedDemand || 0) * 100).toFixed(
                          1,
                        )}
                        %
                      </p>
                      <div className="w-24 h-1 bg-[#1e3828] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ffa500]"
                          style={{
                            width: `${(recommendation.predictedDemand || 0) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#101d28] border border-[rgba(255,255,255,0.03)] rounded-2xl group hover:border-[#00bfff]/30 transition-all">
                    <p className="text-[#4a7060] text-[10px] font-['Space_Mono'] uppercase tracking-widest mb-2">
                      Competitor Average
                    </p>
                    <p className="text-4xl font-bold text-[#00bfff]">
                      ₹
                      {recommendation.avgCompetitorPrice?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>

                  <div className="p-6 bg-[#101d28] border border-[rgba(255,255,255,0.03)] rounded-2xl group hover:border-[#dff0ea]/30 transition-all">
                    <p className="text-[#4a7060] text-[10px] font-['Space_Mono'] uppercase tracking-widest mb-2">
                      Current Delta
                    </p>
                    <p
                      className={`text-4xl font-bold ${recommendation.recommendedPrice > recommendation.currentPrice ? "text-[#00ffb4]" : "text-[#ff5e5e]"}`}
                    >
                      {recommendation.recommendedPrice >
                      recommendation.currentPrice
                        ? "+"
                        : ""}
                      {(
                        (recommendation.recommendedPrice /
                          recommendation.currentPrice -
                          1) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 relative z-10">
              <div className="w-16 h-16 border-2 border-dashed border-[#1e3828] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#1e3828] text-xl">!</span>
              </div>
              <h2 className="text-[#4a7060] font-['Space_Mono'] text-sm tracking-[2px] uppercase">
                {recommendation?.message || "Insufficient Market Intelligence"}
              </h2>
              <p className="text-[#1e3828] text-xs mt-4 max-w-xs mx-auto font-['Space_Mono']">
                // Please return to the Products terminal and inject at least 1
                historical price point and optionally competitor quotes to activate the
                engine.
              </p>
              <button
                onClick={() => navigate("/track")}
                className="mt-8 px-6 py-2 border border-[rgba(0,255,180,0.2)] text-[#00ffb4] text-[10px] font-bold rounded-lg hover:bg-[#00ffb4]/5 transition-all"
              >
                GO TO SEEDING TERMINAL
              </button>
            </div>
          )}
        </div>

        {/* FOOTER METADATA */}
        <div className="mt-8 flex justify-between items-center px-4">
          <div className="font-['Space_Mono'] text-[9px] text-[#1e3828] uppercase tracking-[2px]">
            Engine Version: PULSE_V1.0.4 // Last Sync:{" "}
            {new Date().toLocaleTimeString()}
          </div>
          <div className="font-['Space_Mono'] text-[9px] text-[#1e3828] uppercase tracking-[2px]">
            Encryption: AES_256 // Mode: Realtime_Predictive
          </div>
        </div>
      </div>
    </div>
  );
}
