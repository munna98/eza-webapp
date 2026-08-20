import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InvoicePDFModal({ invoice, onClose }) {
  const { businessInfo } = useApp();

  if (!invoice) return null;

  /* =========================================================================
     TEMPORARILY BYPASSED PDF GENERATION & PREVIEW (WILL BE REVERTED AFTER CLIENT REVIEW)
     =========================================================================
     
     const isIntraState = invoice.placeOfSupply?.startsWith(businessInfo.stateCode);

     const handlePrint = () => {
       window.print();
     };
  ========================================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in p-7 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <Clock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-extrabold inline-block mb-3">
            COMING SOON
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            PDF Functionality Coming Soon
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-center">
          <button
            onClick={onClose}
            className="btn-primary py-2.5 px-8 text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            Close
          </button>
        </div>
      </div>

      {/* =========================================================================
         TEMPORARILY COMMENTED PRINTABLE PDF HTML CONTAINER FOR REVERSION:
         =========================================================================
         
         <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-6 no-print-bg">
           <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-emerald-400" />
               <h3 className="font-extrabold text-sm text-white">TAX INVOICE / BUDGETARY QUOTATION DOCUMENT</h3>
               <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800 font-mono font-bold">
                 {invoice.invoiceNumber || invoice.quoteNumber}
               </span>
             </div>

             <div className="flex items-center gap-3">
               <button onClick={handlePrint} className="btn-primary text-xs py-1.5 px-4">
                 <Printer className="w-4 h-4" />
                 <span>Print / Export PDF</span>
               </button>
               <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                 <X className="w-5 h-5" />
               </button>
             </div>
           </div>

           <div className="p-8 bg-white text-slate-900 font-sans printable-invoice-container max-h-[82vh] overflow-y-auto">
             ...
           </div>
         </div>
      ========================================================================= */}
    </div>
  );
}
