import React, { useState, useEffect } from 'react';
import { predictConversion } from '../api/client';
import { Activity, Brain, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ConversionPredictor({ selectedUser, activeItem }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeItem || !selectedUser) return;

    const runInference = async () => {
      setLoading(true);
      try {
        const res = await predictConversion({
          visitor_id: selectedUser,
          item_id: activeItem.item_id,
          interaction_score: 3.0,
          user_total_events: 12,
          user_total_score: 18.0,
          item_total_views: 45,
          item_total_carts: 9,
          item_total_purchases: 3,
        });
        setPrediction(res);
      } catch (err) {
        console.error('Inference error:', err);
      } finally {
        setLoading(false);
      }
    };

    runInference();
  }, [selectedUser, activeItem]);

  if (!activeItem) return null;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-base text-slate-100">
            Real-Time Machine Learning Inference
          </h3>
        </div>
        <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-full font-mono">
          Model: Random Forest vs. Logistic Baseline
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
          Running Random Forest Feature Inference...
        </div>
      ) : prediction ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Random Forest Card */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">Random Forest Conversion Prob</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-indigo-400">
                {prediction.random_forest_conversion_prob}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Supervised Re-Ranker Output</p>
          </div>

          {/* Logistic Regression Card */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">Logistic Regression Baseline</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-300">
                {prediction.logistic_baseline_prob}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Linear Benchmark Model</p>
          </div>

          {/* Incremental Uplift Card */}
          <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/40">
            <p className="text-xs text-indigo-300 font-medium">Model Intelligence Uplift</p>
            <div className="flex items-center space-x-2 mt-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span className="text-3xl font-extrabold text-emerald-400">
                +{prediction.model_uplift}%
              </span>
            </div>
            <p className="text-xs text-indigo-300/70 mt-1">Accuracy gain over baseline</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}