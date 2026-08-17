import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PayableModal({ isOpen, onClose }) {
  const { clientsSuppliers, addPayable } = useApp();

  const [supplierName, setSupplierName] = useState('SiliconTech Office Systems');
  const [billNumber, setBillNumber] = useState('');
  const [category, setCategory] = useState('Hardware & Access Control');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleAddPayableSubmit = (e) => {
    e.preventDefault();
    if (!supplierName || !amount) return;

    addPayable({
      supplierName,
      billNumber: billNumber || `BILL-${Date.now().toString().slice(-4)}`,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      dueDate
    });

    onClose();
    setBillNumber('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h4 className="font-extrabold text-lg text-slate-900">Record Supplier Bill / Payable</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAddPayableSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Supplier Name</label>
            <select
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="custom-select"
            >
              {clientsSuppliers.filter(c => c.type === 'Supplier').map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
              <option value="AWS Cloud Infrastructure">AWS Cloud Infrastructure</option>
              <option value="Generic Vendor">Generic Vendor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Bill Reference Number</label>
            <input
              type="text"
              placeholder="e.g. BILL-99812"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              className="custom-input font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Expense Category</label>
            <input
              type="text"
              placeholder="e.g. Hardware, Cloud Hosting, Maintenance"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="custom-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Bill Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="custom-input font-mono text-rose-700 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
              Save Payable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
