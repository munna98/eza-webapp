import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Wallet, 
  Users, 
  BarChart3, 
  PlusCircle, 
  Building2, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenNewQuote }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'invoices', label: 'Tax Invoices', icon: Receipt },
    { id: 'ledger', label: 'Payables & Receivables', icon: Wallet },
    { id: 'directory', label: 'Parties', icon: Users },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 shadow-sm no-print">
      {/* Brand Header */}
      <div>
        <div className="p-7 border-b border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 font-extrabold text-white text-2xl">
              E
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900 tracking-tight leading-tight">
                Eza Spaces
              </h1>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Financial Portal
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-5">
          <button
            onClick={onOpenNewQuote}
            className="w-full btn-primary justify-center py-3.5 shadow-md shadow-emerald-600/20 text-sm font-bold"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Quote</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-5 border-t border-slate-200">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800 truncate">Eza Spaces Pvt Ltd</span>
        </div>
      </div>
    </aside>
  );
}
