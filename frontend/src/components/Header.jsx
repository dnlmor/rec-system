import React from 'react';
import { ShoppingBag, UserCheck } from 'lucide-react';

export default function Header({ users, selectedUser, onSelectUser }) {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">RecEngine AI</h1>
            <p className="text-xs text-slate-400">Hybrid ML E-Commerce Platform</p>
          </div>
        </div>

        {/* Persona Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-300 font-medium">Active User ID:</span>
          <select
            value={selectedUser || ''}
            onChange={(e) => onSelectUser(Number(e.target.value))}
            className="bg-slate-900 text-indigo-300 text-xs font-semibold rounded px-2 py-1 outline-none cursor-pointer border border-slate-700"
          >
            {users.map((uid) => (
              <option key={uid} value={uid}>
                Visitor #{uid}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}