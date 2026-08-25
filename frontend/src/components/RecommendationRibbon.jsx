import React from 'react';
import { Sparkles, Star } from 'lucide-react';

export default function RecommendationRibbon({ recommendations, onSelectProduct, activeItemId }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900">
          Customers Who Interacted With This Also Liked
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.item_id}
            onClick={() => onSelectProduct(item)}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-md ${
              activeItemId === item.item_id
                ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono font-medium text-slate-400">#{item.item_id}</span>
              {item.similarity_score && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Match {(item.similarity_score * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <h4 className="text-sm font-semibold text-slate-800 truncate mb-1">{item.name}</h4>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-bold text-slate-900">${item.price}</span>
              <div className="flex items-center text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                {item.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}