import React, { useState } from 'react';
import { CreditCard, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ReceiptModal({ invoice, onClose }) {
  const { recordReceiptPayment } = useApp();

  const [paymentAmount, setPaymentAmount] = useState(invoice ? invoice.balanceDue : '');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer (NEFT/RTGS)');
  const [referenceId, setReferenceId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!invoice) return null;

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentAmount) return;

    recordReceiptPayment(invoice.id, {
      amount: Number(paymentAmount),
      paymentMode,
      referenceId,
      date: paymentDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Record Customer Receipt
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Invoice: {invoice.invoiceNumber}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRecordPaymentSubmit} className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-medium">
            <p className="text-slate-600">Client: <strong className="text-slate-900 font-bold">{invoice.clientName}</strong></p>
            <p className="text-slate-600">Total Invoice Amount: <strong className="text-slate-900 font-bold">₹{invoice.grandTotal.toLocaleString()}</strong></p>
            <p className="text-slate-600">Outstanding Balance: <strong className="text-amber-700 font-bold">₹{invoice.balanceDue.toLocaleString()}</strong></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Receipt Amount (₹)</label>
            <input
              type="number"
              max={invoice.balanceDue}
              min="1"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="custom-input font-mono text-emerald-700 text-xl font-extrabold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="custom-select"
            >
              <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="UPI / QR Code">UPI / QR Code</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Reference / UTR / Txn ID</label>
            <input
              type="text"
              placeholder="e.g. HDFC-NEFT-99201"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="custom-input font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Receipt Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="custom-input"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2.5 px-6"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Log Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
