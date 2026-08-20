import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Sparkles, 
  Check,
  Edit3,
  Send,
  CheckCircle2,
  Undo2,
  Printer
} from 'lucide-react';
import { useApp, formatDDMMYYYY } from '../context/AppContext';

export default function QuotationBuilder({ onOpenNewQuote, onEditQuote, onSelectQuoteForPDF, searchTerm, onSelectInvoiceForPDF }) {
  const { quotations, updateQuotationStatus, convertQuoteToInvoice } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = 
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.reference && q.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && q.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 md:p-8">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-600" />
            Quotations
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Create, track, and manage quotations
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="btn-primary py-3 px-5 text-sm shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        {['All', 'Draft', 'Sent', 'Approved', 'Converted'].map((tab) => (
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

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuotations.map((quote) => (
          <div 
            key={quote.id} 
            className="glass-panel-interactive rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300 inline-block font-extrabold">
                    {quote.quoteNumber}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-2 leading-snug">
                    {quote.clientName}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full shrink-0 ${
                    quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    quote.status === 'Sent' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    quote.status === 'Converted' ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    {quote.status}
                  </span>

                  {/* Top PDF Printer Button */}
                  <button
                    onClick={() => onSelectQuoteForPDF(quote)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors"
                    title="View / Download Quotation PDF"
                  >
                    <Printer className="w-4 h-4 text-slate-700" />
                  </button>

                  {/* Top Edit Button */}
                  <button
                    onClick={() => onEditQuote(quote)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors"
                    title="Edit Quotation"
                  >
                    <Edit3 className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                <p><span className="text-slate-500 font-medium">Ref Person:</span> <strong className="text-slate-900 font-bold">{quote.reference || 'N/A'}</strong></p>
                <p><span className="text-slate-500 font-medium">Quote Date:</span> <strong className="font-mono font-bold text-slate-900">{formatDDMMYYYY(quote.date)}</strong> (Valid to <span className="font-mono">{formatDDMMYYYY(quote.validUntil)}</span>)</p>
                <p><span className="text-slate-500 font-medium">Place of Supply:</span> {quote.placeOfSupply}</p>
              </div>

              {/* Line Items Summary */}
              <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">Line Items ({quote.items.length}):</p>
                {quote.items.map((it, idx) => (
                  <p key={idx} className="text-slate-800 truncate font-semibold">
                    • [{it.area || 'General'}] {it.description} ({it.qty} {it.unit} @ ₹{it.unitPrice})
                  </p>
                ))}
              </div>
            </div>

            {/* Card Footer Workflow Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Grand Total (incl. GST)</p>
                <p className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">
                  ₹{quote.grandTotal.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Mark as Sent */}
                {quote.status === 'Draft' && (
                  <button
                    onClick={() => updateQuotationStatus(quote.id, 'Sent')}
                    className="btn-secondary py-2 px-3 text-xs font-bold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100"
                    title="Mark quotation as sent to client"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mark as Sent</span>
                  </button>
                )}

                {/* 2. Mark as Approved */}
                {(quote.status === 'Draft' || quote.status === 'Sent') && (
                  <button
                    onClick={() => updateQuotationStatus(quote.id, 'Approved')}
                    className="btn-secondary py-2 px-3 text-xs font-bold text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
                    title="Mark quotation as approved by client"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Approved</span>
                  </button>
                )}

                {/* 3. Revert Sent to Draft */}
                {quote.status === 'Sent' && (
                  <button
                    onClick={() => updateQuotationStatus(quote.id, 'Draft')}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors text-xs font-bold"
                    title="Revert to Draft"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* 4. Convert Approved Quote to Invoice */}
                {quote.status === 'Approved' && (
                  <button
                    onClick={() => {
                      const inv = convertQuoteToInvoice(quote.id);
                      if (inv && onSelectInvoiceForPDF) {
                        onSelectInvoiceForPDF(inv);
                      }
                    }}
                    className="btn-primary py-2 px-3.5 text-xs font-bold shadow-md shadow-emerald-600/20"
                    title="Generate Tax Invoice"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convert to Invoice</span>
                  </button>
                )}

                {/* Converted Badge */}
                {quote.status === 'Converted' && (
                  <span className="text-xs text-indigo-900 font-extrabold flex items-center gap-1 font-mono bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-300">
                    <Check className="w-3.5 h-3.5 text-indigo-700" /> Converted
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
