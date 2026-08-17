import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { useApp, formatDDMMYYYY } from '../context/AppContext';

export default function InvoicePDFModal({ invoice, onClose }) {
  const { businessInfo } = useApp();

  if (!invoice) return null;

  const isIntraState = invoice.placeOfSupply?.startsWith(businessInfo.stateCode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-6 no-print-bg">
        {/* Modal Controls Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">TAX INVOICE / BUDGETARY QUOTATION DOCUMENT</h3>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800 font-mono font-bold">
              {invoice.invoiceNumber || invoice.quoteNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-1.5 px-4"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container (A4 Layout matching client Excel format) */}
        <div className="p-8 bg-white text-slate-900 font-sans printable-invoice-container max-h-[82vh] overflow-y-auto">
          {/* Top Document Title */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {invoice.title || 'INTERIOR WORKS – BUDGETARY QUOTATION'}
            </h1>
            <p className="text-xs font-semibold text-slate-700 mt-1 font-mono">
              Client: <strong>{invoice.clientName}</strong> | Region basis: <strong>{invoice.regionBasis || 'Malabar / Kerala'}</strong> | Date: <strong>{formatDDMMYYYY(invoice.date)}</strong>
            </p>
          </div>

          {/* Business & Buyer Details */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-extrabold text-emerald-800 uppercase tracking-wider mb-1">{businessInfo.name}</p>
              <p className="text-slate-600 leading-relaxed">{businessInfo.address}</p>
              <p className="mt-1 font-mono"><strong>GSTIN:</strong> {businessInfo.gstin}</p>
              <p>Email: {businessInfo.email} | Phone: {businessInfo.phone}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-right">
              <p className="font-extrabold text-slate-900 uppercase tracking-wider mb-1">Billed To (Client)</p>
              <p className="font-bold text-slate-900 text-sm">{invoice.clientName}</p>
              <p className="font-mono mt-1"><strong>GSTIN:</strong> {invoice.clientGSTIN || 'URP (Unregistered Person)'}</p>
              <p>Place of Supply: <strong>{invoice.placeOfSupply || '32 - Kerala'}</strong></p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border-collapse mb-6">
            <thead>
              <tr className="bg-slate-900 text-white uppercase font-bold">
                <th className="p-2.5 border border-slate-900 w-10 text-center">Sl.No</th>
                <th className="p-2.5 border border-slate-900 w-28">Area</th>
                <th className="p-2.5 border border-slate-900">Item Description</th>
                <th className="p-2.5 border border-slate-900">Specification</th>
                <th className="p-2.5 border border-slate-900 w-16 text-center">Unit</th>
                <th className="p-2.5 border border-slate-900 w-14 text-center">Qty</th>
                <th className="p-2.5 border border-slate-900 w-24 text-right">Rate (₹)</th>
                <th className="p-2.5 border border-slate-900 w-28 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-slate-800 font-sans">
              {invoice.items.map((it, index) => {
                const itemAmt = it.amount || ((it.qty || 1) * (it.unitPrice || 0));
                return (
                  <tr key={index} className="even:bg-slate-50">
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold text-slate-600">{index + 1}</td>
                    <td className="p-2 border border-slate-300 font-bold text-slate-900">{it.area || 'General'}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{it.description}</td>
                    <td className="p-2 border border-slate-300 text-slate-700">{it.specification || it.hsnSac || 'Standard'}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-700">{it.unit || 'Sq.ft'}</td>
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold">{it.qty}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-semibold">{(it.unitPrice || 0).toLocaleString()}</td>
                    <td className="p-2 border border-slate-300 text-right font-mono font-extrabold text-slate-900">
                      {itemAmt.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Calculations Breakdown & Bank Details */}
          <div className="flex justify-between items-start gap-6 border-t border-b border-slate-300 py-4 mb-6">
            {/* Left Bank Details */}
            <div className="w-1/2 text-xs text-slate-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
              <p className="font-bold text-emerald-900 mb-1">Bank Payment Details</p>
              <p>Bank: <strong>{businessInfo.bankName}</strong></p>
              <p>Account No: <strong className="font-mono">{businessInfo.accountNo}</strong></p>
              <p>IFSC Code: <strong className="font-mono">{businessInfo.ifsc}</strong></p>
              <p>Branch: <strong>{businessInfo.branch}</strong></p>
            </div>

            {/* Right Totals */}
            <div className="w-1/2 text-xs space-y-1.5 text-right font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{(invoice.subtotal || invoice.taxableValue || 0).toLocaleString()}</span>
              </div>

              {invoice.contingencyAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Contingency / Site ({invoice.contingencyPercent || 0}%):</span>
                  <span>₹{invoice.contingencyAmount.toLocaleString()}</span>
                </div>
              )}

              {isIntraState ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span>₹{(invoice.cgst || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span>₹{(invoice.sgst || 0).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>GST @ 18%:</span>
                  <span>₹{(invoice.igst || invoice.totalGST || 0).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2 font-sans">
                <span>GRAND TOTAL:</span>
                <span className="text-emerald-700 font-extrabold">₹{(invoice.grandTotal || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="grid grid-cols-2 gap-6 pt-4 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900 mb-1">Terms & Conditions:</p>
              <p className="leading-relaxed whitespace-pre-line">{invoice.notes || 'Payment due within validity period.'}</p>
            </div>

            <div className="text-right flex flex-col justify-end items-end">
              <p className="font-bold text-slate-900">For Eza Spaces Private Limited</p>
              <div className="h-12 border-b border-slate-400 w-40 my-2"></div>
              <p className="text-[11px] text-slate-500 font-semibold">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
