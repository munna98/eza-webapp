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
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenNewQuote, isCollapsed = false, onToggleCollapse }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'invoices', label: 'Tax Invoices', icon: Receipt },
    { id: 'ledger', label: 'Payables & Receivables', icon: Wallet },
    { id: 'directory', label: 'Parties', icon: Users },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 }
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 shadow-sm no-print transition-all duration-300 ease-in-out`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className={`p-4 ${isCollapsed ? 'px-2' : 'p-6'} border-b border-slate-200/80 transition-all duration-300`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-950">
                <img 
                  src="/eza-logo.jpg" 
                  alt="Eza Spaces Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button
                onClick={onToggleCollapse}
                title="Expand sidebar"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 shadow-md shrink-0 bg-slate-950">
                  <img 
                    src="/eza-logo.jpg" 
                    alt="Eza Spaces Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight truncate">
                    Eza Spaces
                  </h1>
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5 whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" /> Financial Portal
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleCollapse}
                title="Collapse sidebar"
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className={isCollapsed ? "p-3 flex justify-center" : "p-4"}>
          {isCollapsed ? (
            <button
              onClick={onOpenNewQuote}
              title="Create New Quote"
              className="w-12 h-12 btn-primary justify-center p-0 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center group relative"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                Create New Quote
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenNewQuote}
              className="w-full btn-primary justify-center py-3 shadow-md shadow-emerald-600/20 text-sm font-bold"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              <span>Create New Quote</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={`${isCollapsed ? 'px-2 flex flex-col items-center' : 'px-3'} space-y-1.5 mt-1`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (isCollapsed) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className={`border-t border-slate-200 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
        {isCollapsed ? (
          <div 
            title="Eza Spaces Pvt Ltd" 
            className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center cursor-default group relative"
          >
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
              Eza Spaces Pvt Ltd
            </span>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">Eza Spaces Pvt Ltd</span>
          </div>
        )}
      </div>
    </aside>
  );
}
