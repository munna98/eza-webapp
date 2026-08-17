import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SettlePayableModal({ payable, onClose }) {
  const { recordPayablePayment } = useApp();

  const [payablePayMode, setPayablePayMode] = useState('Bank Transfer (NEFT)');
  const [payableRef, setPayableRef] = useState('');

  if (!payable) return null;

  const handlePayableSettlementSubmit = (e) => {
    e.preventDefault();
    recordPayablePayment(payable.id, {
      paymentMode: payablePayMode,
      referenceId: payableRef
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h4 className="font-extrabold text-lg text-slate-900">Settle Supplier Bill</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePayableSettlementSubmit} className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 font-medium">
            <p>Supplier: <strong className="text-slate-900 font-bold">{payable.supplierName}</strong></p>
            <p>Bill Ref: <strong className="font-mono text-slate-700">{payable.billNumber}</strong></p>
            <p>Amount to Settle: <strong className="font-mono text-rose-700 text-sm font-extrabold">₹{payable.amount.toLocaleString()}</strong></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Payment Mode</label>
            <select
              value={payablePayMode}
              onChange={(e) => setPayablePayMode(e.target.value)}
              className="custom-select"
            >
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
              <option value="Corporate Credit Card">Corporate Credit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Reference / UTR / Card Txn ID</label>
            <input
              type="text"
              placeholder="e.g. TXN-881923"
              value={payableRef}
              onChange={(e) => setPayableRef(e.target.value)}
              className="custom-input font-mono"
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
              Confirm Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
