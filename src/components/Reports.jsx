import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { useApp, formatDDMMYYYY } from '../context/AppContext';

// Helper to convert DD-MM-YYYY string to Date object
const parseDDMMYYYY = (dateStr) => {
  if (!dateStr) return new Date(0);
  const str = String(dateStr).split('T')[0];
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts[0].length === 2 && parts[2].length === 4) {
      // DD-MM-YYYY
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else if (parts[0].length === 4) {
      // YYYY-MM-DD
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  }
  return new Date(str);
};

export default function Reports() {
  const { invoices, businessInfo } = useApp();

  // Date Range Filter States (Default: This Month)
  const todayISO = new Date().toISOString().split('T')[0];
  const firstOfMonthISO = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(firstOfMonthISO);
  const [toDate, setToDate] = useState(todayISO);
  const [activePreset, setActivePreset] = useState('This Month');

  // Quick Preset Handlers
  const setPreset = (presetName) => {
    setActivePreset(presetName);
    const now = new Date();
    if (presetName === 'This Month') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setFromDate(first);
      setToDate(todayISO);
    } else if (presetName === 'Previous Month') {
      const firstOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastOfPrev = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      setFromDate(firstOfPrev);
      setToDate(lastOfPrev);
    } else if (presetName === 'FY 2026-27') {
      setFromDate('2026-04-01');
      setToDate('2027-03-31');
    } else if (presetName === 'All Time') {
      setFromDate('2020-01-01');
      setToDate('2030-12-31');
    }
  };

  const fromDateTime = new Date(fromDate).getTime();
  const toDateTime = new Date(toDate + 'T23:59:59').getTime();

  // Filter invoices by selected Date Range
  const filteredInvoices = invoices.filter(inv => {
    const invTime = parseDDMMYYYY(inv.date).getTime();
    return invTime >= fromDateTime && invTime <= toDateTime;
  });

  // Flatten filtered invoices into itemized individual line items
  const itemizedRows = [];

  filteredInvoices.forEach((inv) => {
    const isIntraState = inv.placeOfSupply ? inv.placeOfSupply.startsWith(businessInfo.stateCode) : true;
    
    if (inv.items && inv.items.length > 0) {
      inv.items.forEach((it, idx) => {
        const taxable = Number(it.amount || (Number(it.qty || 1) * Number(it.unitPrice || 0)));
        const cgst = isIntraState ? (taxable * 0.09) : 0;
        const sgst = isIntraState ? (taxable * 0.09) : 0;
        const igst = !isIntraState ? (taxable * 0.18) : 0;
        const total = taxable + cgst + sgst + igst;

        itemizedRows.push({
          id: `${inv.id}-${idx}`,
          invoiceNumber: inv.invoiceNumber,
          clientName: inv.clientName,
          clientGSTIN: inv.clientGSTIN || 'URP',
          date: inv.date,
          area: it.area || 'General Scope',
          description: it.description,
          hsnSac: it.hsnSac || '995419',
          unit: it.unit || 'Sq.ft',
          qty: it.qty || 1,
          unitPrice: it.unitPrice || 0,
          taxable,
          cgst,
          sgst,
          igst,
          total
        });
      });
    } else {
      const taxable = inv.subtotal || 0;
      const cgst = inv.cgst || 0;
      const sgst = inv.sgst || 0;
      const igst = inv.igst || 0;
      const total = inv.grandTotal || taxable + cgst + sgst + igst;

      itemizedRows.push({
        id: `${inv.id}-0`,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.clientName,
        clientGSTIN: inv.clientGSTIN || 'URP',
        date: inv.date,
        area: 'General Scope',
        description: 'Scope Summary',
        hsnSac: '995419',
        unit: 'L.S',
        qty: 1,
        unitPrice: taxable,
        taxable,
        cgst,
        sgst,
        igst,
        total
      });
    }
  });

  const totalTaxable = itemizedRows.reduce((sum, r) => sum + r.taxable, 0);
  const totalCGST = itemizedRows.reduce((sum, r) => sum + r.cgst, 0);
  const totalSGST = itemizedRows.reduce((sum, r) => sum + r.sgst, 0);
  const totalIGST = itemizedRows.reduce((sum, r) => sum + r.igst, 0);
  const totalGSTCollected = totalCGST + totalSGST + totalIGST;
  const totalBilled = totalTaxable + totalGSTCollected;

  const downloadCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice Number,Date,Client Name,Client GSTIN,Area / Section,Item Description,HSN/SAC,Qty,Unit,Rate (INR),Taxable Value (INR),CGST (9%),SGST (9%),IGST (18%),Line Total (INR)\n";

    itemizedRows.forEach(r => {
      csvContent += `"${r.invoiceNumber}","${r.date}","${r.clientName}","${r.clientGSTIN}","${r.area}","${r.description}","${r.hsnSac}",${r.qty},"${r.unit}",${r.unitPrice},${r.taxable},${r.cgst},${r.sgst},${r.igst},${r.total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Itemized_Tax_Report_${formatDDMMYYYY(fromDate)}_to_${formatDDMMYYYY(toDate)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass-panel p-8 md:p-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
            Financial Tax Reports
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Itemized outward supplies tax summaries, HSN/SAC breakdowns, and custom date range CSV exports
          </p>
        </div>

        <button
          onClick={downloadCSVReport}
          className="btn-primary py-3.5 px-6 text-sm shrink-0 font-bold shadow-md shadow-emerald-600/20"
        >
          <Download className="w-5 h-5" />
          <span>Export Itemized CSV</span>
        </button>
      </div>

      {/* DATE RANGE FILTER BAR */}
      <div className="glass-panel p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Filter Report by Date Range
            </h3>
          </div>

          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
            {itemizedRows.length} Items Found
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Custom Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setActivePreset('Custom');
                }}
                className="custom-input font-mono font-bold text-xs"
              />
              <p className="text-[11px] text-emerald-700 mt-1 font-bold font-mono">
                From: {formatDDMMYYYY(fromDate)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setActivePreset('Custom');
                }}
                className="custom-input font-mono font-bold text-xs"
              />
              <p className="text-[11px] text-emerald-700 mt-1 font-bold font-mono">
                To: {formatDDMMYYYY(toDate)}
              </p>
            </div>
          </div>

          {/* Quick Presets (Vertically Centered with Date Inputs) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Presets:</span>
            {['This Month', 'Previous Month', 'FY 2026-27', 'All Time'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPreset(preset)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePreset === preset
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
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
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Tax Liability</p>
          <p className="text-3xl font-extrabold text-teal-700 font-mono mt-2">₹{totalGSTCollected.toLocaleString()}</p>
        </div>
      </div>

      {/* Itemized Outward Supplies Tax Summary Table */}
      <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Outward Supplies Tax Summary Table ({formatDDMMYYYY(fromDate)} to {formatDDMMYYYY(toDate)})
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">Biller Tax ID: {businessInfo.gstin}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-4">Invoice #</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-5 py-4">Client Name</th>
                <th className="px-5 py-4">Area & Description</th>
                <th className="px-4 py-4 text-center">HSN/SAC</th>
                <th className="px-4 py-4 text-center">Qty / Unit</th>
                <th className="px-5 py-4 text-right">Rate (₹)</th>
                <th className="px-5 py-4 text-right">Taxable Value</th>
                <th className="px-5 py-4 text-right">CGST (9%)</th>
                <th className="px-5 py-4 text-right">SGST (9%)</th>
                <th className="px-5 py-4 text-right">IGST (18%)</th>
                <th className="px-5 py-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-mono text-xs">
              {itemizedRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-emerald-700">{row.invoiceNumber}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">{formatDDMMYYYY(row.date)}</td>
                  <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                    {row.clientName}
                    <span className="block text-[10px] text-slate-400 font-mono">GSTIN: {row.clientGSTIN}</span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">[{row.area}]</span>
                    <span className="font-semibold text-slate-800">{row.description}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-700 bg-slate-50/70">
                    <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-mono text-[11px]">
                      {row.hsnSac}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold">
                    {row.qty} {row.unit}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold">
                    ₹{row.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    ₹{row.taxable.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right text-emerald-700">
                    ₹{row.cgst.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right text-emerald-700">
                    ₹{row.sgst.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right text-indigo-700">
                    ₹{row.igst.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 bg-slate-50/70">
                    ₹{row.total.toLocaleString()}
                  </td>
                </tr>
              ))}

              {itemizedRows.length === 0 && (
                <tr>
                  <td colSpan="12" className="py-12 text-center text-slate-400 font-sans">
                    No items found for the selected date range ({formatDDMMYYYY(fromDate)} to {formatDDMMYYYY(toDate)}).
                  </td>
                </tr>
              )}
            </tbody>
            {itemizedRows.length > 0 && (
              <tfoot className="bg-slate-100 text-slate-900 font-extrabold border-t-2 border-slate-200 text-xs font-mono">
                <tr>
                  <td colSpan="7" className="px-5 py-4 text-right uppercase font-sans">Filtered Total ({itemizedRows.length} items):</td>
                  <td className="px-5 py-4 text-right text-slate-900">₹{totalTaxable.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-emerald-700">₹{totalCGST.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-emerald-700">₹{totalSGST.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-indigo-700">₹{totalIGST.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-emerald-700 text-sm">₹{totalBilled.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
