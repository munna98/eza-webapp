import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  FileText, 
  Wallet, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Dashboard({ setActiveTab, onOpenNewQuote }) {
  const { invoices, quotations, receipts, payables } = useApp();

  // Financial Calculations
  const totalReceivables = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
  const totalPayables = payables.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCollected = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalQuoteValue = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Receivables */}
        <div className="glass-panel-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Receivables</span>
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalReceivables)}
          </h3>
          <p className="text-xs text-amber-700 mt-3 flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Outstanding across {invoices.filter(i => i.balanceDue > 0).length} unpaid invoices</span>
          </p>
        </div>

        {/* Card 2: Total Payables */}
        <div className="glass-panel-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Payables</span>
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalPayables)}
          </h3>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Supplier bills to settle</span>
          </p>
        </div>

        {/* Card 3: Total Collected */}
        <div className="glass-panel-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Collected Revenue</span>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalCollected)}
          </h3>
          <p className="text-xs text-emerald-700 mt-3 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Verified Collections</span>
          </p>
        </div>

        {/* Card 4: Proposal Volume */}
        <div className="glass-panel-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Proposals</span>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalQuoteValue)}
          </h3>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5 font-semibold">
            <span>{quotations.length} quotes generated</span>
          </p>
        </div>
      </div>

      {/* Main Content Grid: Cashflow visualizer & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Analytics & Bar chart */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-7 border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Monthly Financial Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Receivables collected vs Supplier Payables</p>
            </div>
            <div className="flex items-center gap-5 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-700">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="space-y-4 pt-1">
            {[
              { month: 'Jun 2026', income: 45000, expense: 12000 },
              { month: 'Jul 2026', income: 68000, expense: 22000 },
              { month: 'Aug 2026 (Current)', income: 26550, expense: 3200 }
            ].map((bar, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>{bar.month}</span>
                  <span>
                    Income: <strong className="text-emerald-600 font-extrabold">₹{bar.income.toLocaleString()}</strong> | 
                    Exp: <strong className="text-rose-600 font-extrabold">₹{bar.expense.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-1 border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (bar.income / 70000) * 100)}%` }}
                  ></div>
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (bar.expense / 70000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={onOpenNewQuote}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500 rounded-xl text-left transition-all shadow-2xs"
            >
              <FileText className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-slate-900">New Quote</p>
              <p className="text-xs text-slate-500 mt-0.5">Custom line items</p>
            </button>

            <button 
              onClick={() => setActiveTab('invoices')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500 rounded-xl text-left transition-all shadow-2xs"
            >
              <Receipt className="w-5 h-5 text-teal-600 mb-2" />
              <p className="text-sm font-bold text-slate-900">GST Invoices</p>
              <p className="text-xs text-slate-500 mt-0.5">Printable A4 copy</p>
            </button>

            <button 
              onClick={() => setActiveTab('ledger')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500 rounded-xl text-left transition-all shadow-2xs"
            >
              <Wallet className="w-5 h-5 text-indigo-600 mb-2" />
              <p className="text-sm font-bold text-slate-900">Payables Log</p>
              <p className="text-xs text-slate-500 mt-0.5">Supplier bills</p>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Recent Transactions & Alerts */}
        <div className="glass-panel p-6 md:p-7 border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900">Recent Receipts</h3>
            <button 
              onClick={() => setActiveTab('ledger')} 
              className="text-xs text-emerald-700 hover:underline font-bold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {receipts.map((rec) => (
              <div key={rec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{rec.clientName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rec.paymentMode} • {rec.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-700 font-mono">+₹{rec.amount.toLocaleString()}</p>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono inline-block font-bold mt-0.5">
                    {rec.invoiceNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Alerts */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Action Required</h4>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Urban Nest Developers Invoice</p>
                <p className="text-xs text-amber-800 mt-0.5 font-medium">₹41,300 balance due on Aug 20, 2026.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
