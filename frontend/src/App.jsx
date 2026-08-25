import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConversionPredictor from './components/ConversionPredictor';
import RecommendationRibbon from './components/RecommendationRibbon';
import { fetchProducts, fetchSampleUsers, fetchRecommendations } from './api/client';
import { Package, Star } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const initData = async () => {
      try {
        const [userList, productList] = await Promise.all([
          fetchSampleUsers(),
          fetchProducts(12),
        ]);
        setUsers(userList);
        if (userList.length > 0) setSelectedUser(userList[0]);
        setProducts(productList);
        if (productList.length > 0) setActiveItem(productList[0]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Fetch recommendations whenever active product changes
  useEffect(() => {
    if (!activeItem) return;
    const loadRecs = async () => {
      try {
        const recs = await fetchRecommendations(activeItem.item_id);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };
    loadRecs();
  }, [activeItem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Loading RecEngine Interface...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Header users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Active Selected Product Display */}
        {activeItem && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
              <Package className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Currently Selected Product
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{activeItem.name}</h2>
              <p className="text-xs text-slate-500 mt-1">Item ID: {activeItem.item_id} | Category ID: {activeItem.category_id}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">${activeItem.price}</div>
              <div className="flex items-center justify-end text-amber-500 text-sm font-semibold mt-1">
                <Star className="w-4 h-4 fill-current mr-1" />
                {activeItem.rating} / 5.0
              </div>
            </div>
          </div>
        )}

        {/* Real-time ML Prediction Card */}
        <ConversionPredictor selectedUser={selectedUser} activeItem={activeItem} />

        {/* Collaborative Recommendations Ribbon */}
        <RecommendationRibbon
          recommendations={recommendations}
          onSelectProduct={setActiveItem}
          activeItemId={activeItem?.item_id}
        />

        {/* Catalog Grid */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Explore Full Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((item) => (
              <div
                key={item.item_id}
                onClick={() => setActiveItem(item)}
                className={`p-4 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md ${
                  activeItem?.item_id === item.item_id
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-slate-400 font-mono mb-1">#{item.item_id}</div>
                <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-slate-900">${item.price}</span>
                  <span className="text-xs text-amber-600 font-medium">★ {item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}