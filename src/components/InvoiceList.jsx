import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Printer, 
  CreditCard
} from 'lucide-react';
import { useApp, formatDDMMYYYY } from '../context/AppContext';

export default function InvoiceList({ searchTerm, onSelectInvoiceForPDF, onSelectInvoiceForReceipt, onOpenNewQuote }) {
  const { invoices } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && inv.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass-panel p-6 md:p-8">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Receipt className="w-7 h-7 text-emerald-600" />
            GST Tax Invoices Directory
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Manage tax compliant invoices, record payments, and export PDF copies
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="btn-primary py-3 px-5 text-sm shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Create Proposal / Invoice</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        {['All', 'Paid', 'Partially Paid', 'Unpaid', 'Overdue'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Client & GSTIN</th>
                <th className="px-6 py-4">Issue / Due Date</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Paid / Balance</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{inv.clientName}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: {inv.clientGSTIN || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <p className="text-slate-800 font-bold">{formatDDMMYYYY(inv.date)}</p>
                    <p className="text-amber-700 font-bold mt-0.5">Due: {formatDDMMYYYY(inv.dueDate)}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-slate-900 font-mono text-base">
                    ₹{inv.grandTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <p className="text-emerald-700 font-bold">₹{inv.amountPaid.toLocaleString()}</p>
                    {inv.balanceDue > 0 && (
                      <p className="text-amber-700 text-xs font-bold mt-0.5">Bal: ₹{inv.balanceDue.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${
                      inv.status === 'Paid' ? 'badge-paid' :
                      inv.status === 'Partially Paid' ? 'badge-partial' :
                      inv.status === 'Overdue' ? 'badge-overdue' : 'badge-pending'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => onSelectInvoiceForReceipt(inv)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors"
                          title="Record Customer Receipt"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectInvoiceForPDF(inv)}
                        className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
                        title="Print / View Tax Invoice PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
