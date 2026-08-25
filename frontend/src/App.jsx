import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchSampleUsers, fetchRecommendations, predictConversion } from './api/client';
import { Sparkles, Eye, ShoppingCart, CheckCircle2, Info, Target, Gauge, Cpu, HelpCircle } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set HTML Page Title to "RecMate"
  useEffect(() => {
    document.title = "RecMate - Smart Commerce Recommendations";
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [uList, pList] = await Promise.all([fetchSampleUsers(), fetchProducts(10)]);
        const tenUsers = (uList || []).slice(0, 10);
        setUsers(tenUsers);
        if (tenUsers.length > 0) setSelectedUser(tenUsers[0]);
        setProducts(pList || []);
        if (pList && pList.length > 0) setActiveItem(pList[0]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const currentItemId = activeItem?.item_id || (products.length > 0 ? products[0].item_id : 1);

    const views = selectedUser.views ?? 0;
    const carts = selectedUser.carts ?? 0;
    const buys = selectedUser.buys ?? 0;

    const runInference = async () => {
      try {
        const [recs, pred] = await Promise.all([
          fetchRecommendations(currentItemId),
          predictConversion({
            visitor_id: selectedUser.visitor_id || selectedUser.visitorid,
            item_id: currentItemId,
            interaction_score: selectedUser.interaction_score ?? 1.0,
            user_total_events: views + carts + buys,
            user_total_score: selectedUser.interaction_score ?? 1.0,
            user_total_purchases: buys,
            item_total_views: views,
            item_total_carts: carts,
            item_total_purchases: buys,
          })
        ]);

        const parsedRecs = Array.isArray(recs) ? recs : recs?.recommendations || [];
        setRecommendations(parsedRecs);
        setPrediction(pred);
      } catch (err) {
        console.error('Inference error:', err);
      }
    };
    runInference();
  }, [activeItem, selectedUser, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center">
        <p className="text-[#252525] font-['Space_Grotesk'] text-sm tracking-widest uppercase animate-pulse font-bold">
          RecMate Engine Initializing...
        </p>
      </div>
    );
  }

  const views = selectedUser?.views ?? 0;
  const carts = selectedUser?.carts ?? 0;
  const buys = selectedUser?.buys ?? 0;

  const buyChance = prediction?.random_forest_conversion_prob ?? 0.0;
  const isHighIntent = buyChance >= 40.0 || prediction?.intent_category === "HIGH INTENT";

  const selectedIndex = users.findIndex(
    u => (u.visitor_id || u.visitorid) === (selectedUser?.visitor_id || selectedUser?.visitorid)
  );

  return (
    <div className="min-h-screen bg-[#F6F2EA] font-['Inter'] text-[#252525] p-4 md:p-10 flex justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      <div className="w-full max-w-4xl space-y-5">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3DDD3] shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#252525] flex items-center justify-center shrink-0 shadow-md">
              <Cpu className="w-6 h-6 text-[#F6F2EA]" strokeWidth={2} />
            </div>
            <div>
              <h1
                className="font-['Space_Grotesk'] font-bold text-xl tracking-tight flex items-center gap-2"
                style={{ color: '#C65A32' }}
              >
                RecMate
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C65A32]/10 text-[#C65A32] border border-[#C65A32]/30 font-mono">
                  v1.0
                </span>
              </h1>
              <p className="text-xs text-[#77716A] mt-0.5">
                AI Customer Intelligence — predicting real-time likelihood to buy and serving instant recommendations.
              </p>
            </div>
          </div>

          {/* USER SELECTOR */}
          <label className="flex items-center gap-2.5 bg-[#F6F2EA] rounded-xl border border-[#E3DDD3] px-3.5 py-2">
            <span className="text-xs text-[#77716A] font-medium whitespace-nowrap">Target User:</span>
            <select
              value={selectedUser?.visitor_id || selectedUser?.visitorid || ''}
              onChange={(e) => {
                const targetId = Number(e.target.value);
                const found = users.find(u => (u.visitor_id || u.visitorid) === targetId);
                if (found) setSelectedUser(found);
              }}
              className="bg-transparent text-sm font-semibold text-[#C65A32] outline-none cursor-pointer"
            >
              {users.map((u, idx) => (
                <option key={u.visitor_id || u.visitorid || idx} value={u.visitor_id || u.visitorid}>
                  User {idx + 1} (ID: {u.visitor_id})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* USER ACTIVITY METRICS (STATUS BADGE REMOVED) */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A]">
              User {selectedIndex >= 0 ? selectedIndex + 1 : 1}'s Store Interactions
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <JourneyStep icon={Eye} label="Product Views" count={views} color="#252525" />
            <JourneyStep icon={ShoppingCart} label="Items Added to Cart" count={carts} color="#A94B3C" />
            <JourneyStep icon={CheckCircle2} label="Past Completed Purchases" count={buys} color="#71856B" />
          </div>
        </div>

        {/* GAUGE & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

          {/* DYNAMIC CONVERSION GAUGE */}
          <div className="md:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] shadow-sm p-6 flex flex-col items-center text-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A] self-start mb-2">
              Purchase Likelihood Score
            </span>
            <ConfidenceGauge percent={buyChance} highIntent={isHighIntent} />
            <span className={`mt-3 text-xs font-semibold px-3.5 py-1 rounded-full border ${
              isHighIntent 
                ? 'bg-[#C65A32]/10 text-[#C65A32] border-[#C65A32]' 
                : 'bg-[#D8C4A8]/30 text-[#252525] border-[#D8C4A8]'
            }`}>
              {prediction?.intent_category || (isHighIntent ? 'HIGH INTENT' : 'LOW INTENT')}
            </span>
            <InSimpleTerms>
              <strong>What this means:</strong> The estimated percentage chance that this shopper will make a purchase during this shopping session.
            </InSimpleTerms>
          </div>

          {/* RECOMMENDED ITEMS */}
          <div className="md:col-span-3 bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] shadow-sm p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A] mb-3 block">
                Personalized Product Suggestions
              </span>
              <div className="space-y-2.5">
                {recommendations.length === 0 ? (
                  <p className="text-xs text-[#77716A] py-6 text-center italic">Finding the best product matches...</p>
                ) : (
                  recommendations.slice(0, 3).map((rec, idx) => {
                    const score = rec.similarity_score;
                    const matchPct = score !== null && score !== undefined ? Math.round(score * 100) : null;
                    const itemName = rec.name || rec.item_name || rec.title || `Item #${rec.item_id}`;
                    const itemPrice = rec.price ? `$${rec.price}` : `$49.99`;

                    return (
                      <div key={rec.item_id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F2EA] border border-[#E3DDD3]">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[#252525]">{itemName}</p>
                          <p className="text-xs text-[#77716A]">{itemPrice}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-28 justify-end">
                          {matchPct !== null ? (
                            <>
                              <div className="flex-1 h-2 rounded-full bg-[#E3DDD3] overflow-hidden">
                                <div className="h-full rounded-full bg-[#D9A441]" style={{ width: `${matchPct}%` }} />
                              </div>
                              <span className="text-xs font-mono font-bold text-[#C65A32] w-9 text-right">{matchPct}%</span>
                            </>
                          ) : (
                            <span className="text-[11px] font-mono text-[#77716A] bg-[#D8C4A8]/20 px-2 py-0.5 rounded border border-[#D8C4A8]">Popular</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <InSimpleTerms>
              <strong>What this means:</strong> Products selected based on item similarity and what customers with similar browsing patterns bought next.
            </InSimpleTerms>
          </div>
        </div>

        {/* KEY SIGNALS */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#D9A441]" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A]">Key Customer Behaviors</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(prediction?.influencing_factors || ["Casual browsing activity"]).map((factor, idx) => (
              <span key={idx} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F6F2EA] border border-[#E3DDD3] text-[#252525]">
                {factor}
              </span>
            ))}
          </div>
          <InSimpleTerms>
            <strong>What this means:</strong> Specific actions taken by this shopper that raised or lowered RecMate's purchase estimation.
          </InSimpleTerms>
        </div>

        {/* BUSINESS ACTION */}
        <div className="rounded-2xl p-6 bg-[#A94B3C] shadow-md text-[#FFFFFF]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#D9A441]" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]/90">Recommended Marketing Strategy</span>
          </div>
          <p className="font-['Space_Grotesk'] font-bold text-xl leading-snug">
            {prediction?.business_action?.action || "Retarget via Catalog Recommendations"}
          </p>
          <p className="text-sm text-[#FFFFFF]/90 mt-1">
            {prediction?.business_action?.strategy || "Focus on product discovery and relevant recommendations."}
          </p>
          <p className="text-xs text-[#FFFFFF]/80 mt-4 border-t border-[#FFFFFF]/20 pt-3">
            Automated promotional offer or product prompt tailored to protect profit margins while securing sales.
          </p>
        </div>

        {/* TRUST METRICS WITH PLAIN ENGLISH EXPLANATIONS */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-[#77716A]" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A]">RecMate AI Accuracy Metrics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard 
              title="Prediction Accuracy (ROC-AUC)" 
              score={prediction?.performance?.conversion_roc_auc ?? '0.84'} 
              color="#C65A32"
              simpleDesc="84% Accuracy Score"
              reason="Measures how good RecMate is at separating real buyers from window shoppers. 0.50 is random guessing; 0.84 represents excellent, trustworthy predictions."
            />
            <MetricCard 
              title="Recommendation Ranking (NDCG)" 
              score={prediction?.performance?.rec_ndcg_at_k ?? '0.36'} 
              color="#252525"
              simpleDesc="Ranking Quality Score"
              reason="Evaluates whether the items the user actually wants are placed at the very top of the recommendation list, rather than buried lower down."
            />
          </div>
          <InSimpleTerms>
            RecMate's <strong>0.84 accuracy score</strong> indicates high overall reliability when triggering automated discounts or targeted promotions.
          </InSimpleTerms>
        </div>

      </div>
    </div>
  );
}

function JourneyStep({ icon: Icon, label, count, color }) {
  return (
    <div className="rounded-xl bg-[#F6F2EA] border border-[#E3DDD3] p-3 flex flex-col items-center text-center gap-1">
      <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
      <span className="font-['Space_Grotesk'] font-bold text-xl text-[#252525]">{count ?? 0}</span>
      <span className="text-[11px] text-[#77716A]">{label}</span>
    </div>
  );
}

function ConfidenceGauge({ percent, highIntent }) {
  const color = highIntent ? '#C65A32' : '#D9A441';
  const track = '#E3DDD3';
  return (
    <div
      className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-sm"
      style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, ${track} 0deg)` }}
      role="img"
      aria-label={`${percent} percent probability`}
    >
      <div className="w-24 h-24 rounded-full bg-[#FFFFFF] flex items-center justify-center border border-[#E3DDD3]">
        <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#252525]">{percent}%</span>
      </div>
    </div>
  );
}

function MetricCard({ title, score, color, simpleDesc, reason }) {
  return (
    <div className="bg-[#F6F2EA] rounded-xl p-3.5 border border-[#E3DDD3]">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-[#77716A] font-medium">{title}</p>
        <div className="group relative cursor-pointer">
          <HelpCircle className="w-3.5 h-3.5 text-[#77716A]" />
          <div className="absolute right-0 bottom-6 hidden group-hover:block w-64 p-2.5 bg-[#252525] text-[#F6F2EA] text-[11px] rounded-lg shadow-xl z-20 leading-relaxed">
            {reason}
          </div>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="font-mono font-bold text-lg" style={{ color }}>{score}</p>
        {simpleDesc && <span className="text-xs font-semibold text-[#77716A]">({simpleDesc})</span>}
      </div>
      <p className="text-[11px] text-[#77716A] mt-1.5 leading-normal">{reason}</p>
    </div>
  );
}

function InSimpleTerms({ children }) {
  return (
    <div className="flex items-start gap-2 mt-4 pt-3 border-t border-[#E3DDD3] text-left w-full">
      <Info className="w-3.5 h-3.5 text-[#77716A] mt-0.5 shrink-0" strokeWidth={2} />
      <p className="text-xs text-[#77716A] leading-relaxed">{children}</p>
    </div>
  );
}