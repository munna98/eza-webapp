import React, { useState } from 'react';
import { Search, Bell, Calendar } from 'lucide-react';

export default function Header({ searchTerm, setSearchTerm, activeTab }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const currentDateStr = `${day}-${month}-${year}`;

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs no-print">
      {/* Search Input Bar */}
      <div className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search invoices, quotes, parties, GSTIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* System Date Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentDateStr}</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 relative transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-xl z-50 border border-slate-200 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                <h4 className="font-bold text-sm text-slate-900">System Notifications</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-emerald-200">
                  <p className="font-bold text-emerald-800">Quote Approved 🎉</p>
                  <p className="text-slate-700 mt-0.5">Kochi Horizon approved proposal EZA-QT-2026-03.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-amber-800">Payment Due Reminder</p>
                  <p className="text-slate-700 mt-0.5">INV-2026-0802 due in 3 days (Urban Nest).</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-emerald-700">
              EZ
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Eza Admin</p>
            <p className="text-[11px] text-emerald-700 font-bold">Eza Spaces Pvt Ltd</p>
          </div>
        </div>
      </div>
    </header>
  );
}
