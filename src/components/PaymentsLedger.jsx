import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PaymentsLedger({ searchTerm, onOpenAddPayable, onSelectPayableForSettlement }) {
  const { receipts, payables } = useApp();
  const [activeLedgerTab, setActiveLedgerTab] = useState('receivables');

  const filteredReceipts = receipts.filter(r => 
    r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayables = payables.filter(p => 
    p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass-panel p-8 md:p-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            Payments Ledger (Receivables & Payables)
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Track incoming customer receipts and manage outgoing supplier vendor bills
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeLedgerTab === 'payables' && (
            <button
              onClick={onOpenAddPayable}
              className="btn-primary py-3.5 px-6 text-sm shrink-0 font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>Record Supplier Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Dual Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={() => setActiveLedgerTab('receivables')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all ${
            activeLedgerTab === 'receivables'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          <span>Customer Receivables ({receipts.length} Receipts)</span>
        </button>

        <button
          onClick={() => setActiveLedgerTab('payables')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all ${
            activeLedgerTab === 'payables'
              ? 'bg-rose-50 text-rose-700 border border-rose-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-600" />
          <span>Supplier Payables ({payables.length} Bills)</span>
        </button>
      </div>

      {/* TAB 1: Customer Receivables View */}
      {activeLedgerTab === 'receivables' && (
        <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-sm text-slate-700">
            <span className="font-bold text-emerald-800">Verified Incoming Receipts Log</span>
            <span>Total Receipts: <strong className="font-mono text-emerald-700 text-base font-extrabold">₹{receipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-7 py-5">Receipt #</th>
                  <th className="px-7 py-5">Invoice #</th>
                  <th className="px-7 py-5">Customer Name</th>
                  <th className="px-7 py-5">Payment Mode</th>
                  <th className="px-7 py-5">Reference / Txn ID</th>
                  <th className="px-7 py-5">Date</th>
                  <th className="px-7 py-5 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredReceipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-7 py-5 font-mono font-bold text-emerald-700">
                      {rec.receiptNumber}
                    </td>
                    <td className="px-7 py-5 font-mono text-slate-700 font-semibold">
                      {rec.invoiceNumber}
                    </td>
                    <td className="px-7 py-5 font-bold text-slate-900">
                      {rec.clientName}
                    </td>
                    <td className="px-7 py-5 text-slate-700 font-medium">
                      {rec.paymentMode}
                    </td>
                    <td className="px-7 py-5 font-mono text-slate-500 text-xs">
                      {rec.referenceId || '-'}
                    </td>
                    <td className="px-7 py-5 text-slate-700 font-medium">
                      {rec.date}
                    </td>
                    <td className="px-7 py-5 text-right font-extrabold text-emerald-700 font-mono text-base">
                      +₹{rec.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Supplier Payables View */}
      {activeLedgerTab === 'payables' && (
        <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-sm text-slate-700">
            <span className="font-bold text-rose-800">Supplier Vendor Bills & Outgoing Expenses</span>
            <span>Unsettled Payables: <strong className="font-mono text-rose-700 text-base font-extrabold">₹{payables.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-7 py-5">Bill Ref</th>
                  <th className="px-7 py-5">Supplier Name</th>
                  <th className="px-7 py-5">Category</th>
                  <th className="px-7 py-5">Due Date</th>
                  <th className="px-7 py-5 text-right">Amount</th>
                  <th className="px-7 py-5 text-center">Status</th>
                  <th className="px-7 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredPayables.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-7 py-5 font-mono font-bold text-slate-700">
                      {p.billNumber}
                    </td>
                    <td className="px-7 py-5 font-bold text-slate-900">
                      {p.supplierName}
                    </td>
                    <td className="px-7 py-5 text-slate-500 text-xs font-medium">
                      {p.category}
                    </td>
                    <td className="px-7 py-5 text-slate-700 font-medium">
                      {p.dueDate}
                    </td>
                    <td className="px-7 py-5 text-right font-extrabold text-rose-700 font-mono text-base">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="px-7 py-5 text-center">
                      <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full inline-block ${p.status === 'Paid' ? 'badge-paid' : 'badge-overdue'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-7 py-5 text-center">
                      {p.status !== 'Paid' ? (
                        <button
                          onClick={() => onSelectPayableForSettlement(p)}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Settle Bill
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono font-bold">Settled ({p.paymentMode})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
