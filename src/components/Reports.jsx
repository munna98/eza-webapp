import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  PieChart, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { invoices, receipts, payables, businessInfo } = useApp();

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalTaxable = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalCGST = invoices.reduce((sum, inv) => sum + (inv.cgst || 0), 0);
  const totalSGST = invoices.reduce((sum, inv) => sum + (inv.sgst || 0), 0);
  const totalIGST = invoices.reduce((sum, inv) => sum + (inv.igst || 0), 0);
  const totalGSTCollected = totalCGST + totalSGST + totalIGST;

  const downloadCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice Number,Client Name,Date,Due Date,Subtotal,CGST,SGST,IGST,Grand Total,Amount Paid,Balance Due,Status\n";

    invoices.forEach(inv => {
      csvContent += `"${inv.invoiceNumber}","${inv.clientName}","${inv.date}","${inv.dueDate}",${inv.subtotal},${inv.cgst || 0},${inv.sgst || 0},${inv.igst || 0},${inv.grandTotal},${inv.amountPaid},${inv.balanceDue},"${inv.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GSTR1_Tax_Report_${businessInfo.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass-panel p-8 md:p-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
            Financial & GST Tax Reports
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            GSTR-1 compliant tax summaries, financial cashflow audits, and CSV data exports
          </p>
        </div>

        <button
          onClick={downloadCSVReport}
          className="btn-primary py-3.5 px-6 text-sm shrink-0 font-bold"
        >
          <Download className="w-5 h-5" />
          <span>Export GSTR-1 CSV Report</span>
        </button>
      </div>

      {/* Tax Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="glass-panel p-7 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Taxable Value</p>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-2">₹{totalTaxable.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-7 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total CGST + SGST</p>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-2">₹{(totalCGST + totalSGST).toLocaleString()}</p>
        </div>

        <div className="glass-panel p-7 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total IGST (Inter-State)</p>
          <p className="text-3xl font-extrabold text-indigo-700 font-mono mt-2">₹{totalIGST.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-7 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total GST Liability</p>
          <p className="text-3xl font-extrabold text-teal-700 font-mono mt-2">₹{totalGSTCollected.toLocaleString()}</p>
        </div>
      </div>

      {/* GSTR-1 Tax Summary Table */}
      <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            GSTR-1 Outward Supplies Summary Table
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">Biller GSTIN: {businessInfo.gstin}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-7 py-5">Invoice #</th>
                <th className="px-7 py-5">Client Name</th>
                <th className="px-7 py-5">Client GSTIN</th>
                <th className="px-7 py-5 text-right">Taxable Value</th>
                <th className="px-7 py-5 text-right">CGST (9%)</th>
                <th className="px-7 py-5 text-right">SGST (9%)</th>
                <th className="px-7 py-5 text-right">IGST (18%)</th>
                <th className="px-7 py-5 text-right">Invoice Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-7 py-5 font-semibold text-emerald-700">{inv.invoiceNumber}</td>
                  <td className="px-7 py-5 font-sans font-bold text-slate-900">{inv.clientName}</td>
                  <td className="px-7 py-5 text-slate-500 text-xs font-semibold">{inv.clientGSTIN || 'URP'}</td>
                  <td className="px-7 py-5 text-right">₹{(inv.subtotal || 0).toLocaleString()}</td>
                  <td className="px-7 py-5 text-right">₹{(inv.cgst || 0).toLocaleString()}</td>
                  <td className="px-7 py-5 text-right">₹{(inv.sgst || 0).toLocaleString()}</td>
                  <td className="px-7 py-5 text-right">₹{(inv.igst || 0).toLocaleString()}</td>
                  <td className="px-7 py-5 text-right font-extrabold text-slate-900">₹{(inv.grandTotal || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 text-slate-900 font-extrabold border-t-2 border-slate-200 text-sm font-mono">
              <tr>
                <td colSpan="3" className="px-7 py-5 text-right uppercase font-sans">Total:</td>
                <td className="px-7 py-5 text-right">₹{totalTaxable.toLocaleString()}</td>
                <td className="px-7 py-5 text-right text-emerald-700">₹{totalCGST.toLocaleString()}</td>
                <td className="px-7 py-5 text-right text-emerald-700">₹{totalSGST.toLocaleString()}</td>
                <td className="px-7 py-5 text-right text-indigo-700">₹{totalIGST.toLocaleString()}</td>
                <td className="px-7 py-5 text-right text-emerald-700 text-base">₹{totalBilled.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
