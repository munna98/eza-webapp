import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';
import { useApp, formatDDMMYYYY } from '../context/AppContext';

// General Area Presets
const AREA_PRESETS = [
  "General Scope", "Office Space", "Reception / Foyer", "Conference Room", 
  "Executive Cabin", "Workstation Bay", "Living Room", "Dining Area", 
  "Master Bedroom", "Kitchen & Pantry", "Storage / Utility", "Exterior / Elevation"
];

// General Material & Specification Presets
const SPEC_PRESETS = [
  "Standard Grade Materials",
  "Premium Finish",
  "As per Approved Drawings",
  "Custom Fabrication",
  "Laminated Finish",
  "Veneer / PU Finish",
  "Gypsum / Board Work",
  "Powder Coated Metal",
  "Turnkey Fitout"
];

// Common Measurement Units
const UNIT_PRESETS = ["Sq.ft", "Nos", "R.ft", "L.S", "Mtr", "Box", "Set"];

// Helper to convert DD-MM-YYYY or ISO string back to YYYY-MM-DD for date input
const toYYYYMMDD = (dStr) => {
  if (!dStr) return new Date().toISOString().split('T')[0];
  if (dStr.includes('-')) {
    const parts = dStr.split('T')[0].split('-');
    if (parts[0].length === 2 && parts[2].length === 4) {
      // DD-MM-YYYY -> YYYY-MM-DD
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dStr;
};

export default function CreateQuotation({ editingQuote, onBack, onQuoteCreated }) {
  const { clientsSuppliers, businessInfo, addQuotation, updateQuotation } = useApp();

  // Active Tab View: Quotation Items Grid vs Terms & Conditions
  const [activeTab, setActiveTab] = useState('quotation');

  // Client & Status Details
  const [clientName, setClientName] = useState(editingQuote ? editingQuote.clientName : 'Mr. Abdul Rasheed');
  const [clientGSTIN, setClientGSTIN] = useState(editingQuote ? editingQuote.clientGSTIN : '32ABDUL7711M1Z2');
  const [placeOfSupply, setPlaceOfSupply] = useState(editingQuote ? editingQuote.placeOfSupply : '32 - Kerala');
  const [reference, setReference] = useState(editingQuote ? editingQuote.reference : 'Abdul Rasheed');
  const [quoteStatus, setQuoteStatus] = useState(editingQuote ? editingQuote.status : 'Draft');
  const [rawDate, setRawDate] = useState(editingQuote ? toYYYYMMDD(editingQuote.date) : new Date().toISOString().split('T')[0]);
  const [rawValidUntil, setRawValidUntil] = useState(editingQuote ? toYYYYMMDD(editingQuote.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [contingencyPercent, setContingencyPercent] = useState(editingQuote ? (editingQuote.contingencyPercent || 0) : 0);

  const [notes, setNotes] = useState(
    editingQuote ? editingQuote.notes : (
      "1. Payment Terms: 50% Advance upon project approval & sign-off.\n" +
      "2. 40% Progress payment upon material delivery to site.\n" +
      "3. 10% Final payment upon completion & handover.\n" +
      "4. Validity: Quotation valid for 30 Days from date of issue.\n" +
      "5. Any scope variations or additional requirements will be billed separately."
    )
  );

  // Line Items Grid State initialized with editingQuote items or a single empty row
  const [items, setItems] = useState(
    editingQuote && editingQuote.items.length > 0
      ? editingQuote.items.map((it, idx) => ({ ...it, id: it.id || idx + 1 }))
      : [{ id: 1, area: "", description: "", specification: "", unit: "Sq.ft", qty: 1, unitPrice: 0 }]
  );

  useEffect(() => {
    if (editingQuote) {
      setClientName(editingQuote.clientName);
      setClientGSTIN(editingQuote.clientGSTIN || '');
      setPlaceOfSupply(editingQuote.placeOfSupply || '32 - Kerala');
      setReference(editingQuote.reference || '');
      setQuoteStatus(editingQuote.status || 'Draft');
      setRawDate(toYYYYMMDD(editingQuote.date));
      setRawValidUntil(toYYYYMMDD(editingQuote.validUntil));
      setContingencyPercent(editingQuote.contingencyPercent || 0);
      setNotes(editingQuote.notes || '');
      if (editingQuote.items && editingQuote.items.length > 0) {
        setItems(editingQuote.items.map((it, idx) => ({ ...it, id: it.id || idx + 1 })));
      }
    }
  }, [editingQuote]);

  const handleClientSelect = (e) => {
    const selectedName = e.target.value;
    setClientName(selectedName);
    const found = clientsSuppliers.find(c => c.name === selectedName);
    if (found) {
      setClientGSTIN(found.gstin || '');
      setPlaceOfSupply(found.placeOfSupply || '32 - Kerala');
      setReference(found.contactPerson || '');
    }
  };

  const addItemRow = () => {
    setItems(prevItems => [
      ...prevItems,
      {
        id: Date.now(),
        area: "",
        description: "",
        specification: "",
        unit: "Sq.ft",
        qty: 1,
        unitPrice: 0
      }
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Auto-select text on focus helper
  const handleFocus = (e) => {
    e.target.select();
  };

  // Keyboard Enter Key Navigation across Spreadsheet Inputs
  const handleKeyDown = (e, itemIndex, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent accidental form submission
      
      const fieldOrder = ['area', 'description', 'specification', 'unit', 'qty', 'unitPrice'];
      const currentFieldIndex = fieldOrder.indexOf(fieldName);
      
      if (currentFieldIndex < fieldOrder.length - 1) {
        const nextField = fieldOrder[currentFieldIndex + 1];
        const el = document.getElementById(`input-${itemIndex}-${nextField}`);
        if (el) {
          el.focus();
          if (el.select) el.select();
        }
      } else if (fieldName === 'unitPrice') {
        if (itemIndex === items.length - 1) {
          const newId = Date.now();
          setItems(prevItems => [
            ...prevItems,
            { id: newId, area: "", description: "", specification: "", unit: "Sq.ft", qty: 1, unitPrice: 0 }
          ]);
          setTimeout(() => {
            const nextEl = document.getElementById(`input-${itemIndex + 1}-area`);
            if (nextEl) {
              nextEl.focus();
              if (nextEl.select) nextEl.select();
            }
          }, 60);
        } else {
          const nextEl = document.getElementById(`input-${itemIndex + 1}-area`);
          if (nextEl) {
            nextEl.focus();
            if (nextEl.select) nextEl.select();
          }
        }
      }
    }
  };

  // Real-time Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.unitPrice || 0)), 0);
  const contingencyAmount = (rawSubtotal * Number(contingencyPercent || 0)) / 100;
  const taxableValue = rawSubtotal + contingencyAmount;
  
  const isIntraState = placeOfSupply.startsWith(businessInfo.stateCode);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isIntraState) {
    cgst = (taxableValue * 9) / 100;
    sgst = (taxableValue * 9) / 100;
  } else {
    igst = (taxableValue * 18) / 100;
  }

  const totalGST = cgst + sgst + igst;
  const grandTotal = taxableValue + totalGST;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName) {
      alert("Please specify a client name.");
      return;
    }

    const payload = {
      title: "BUDGETARY QUOTATION",
      clientName,
      clientGSTIN,
      placeOfSupply,
      reference,
      date: formatDDMMYYYY(rawDate),
      validUntil: formatDDMMYYYY(rawValidUntil),
      status: quoteStatus || 'Draft',
      contingencyPercent: Number(contingencyPercent),
      contingencyAmount,
      notes,
      items: items.map(it => ({
        ...it,
        amount: Number(it.qty || 0) * Number(it.unitPrice || 0)
      })),
      subtotal: rawSubtotal,
      taxableValue,
      cgst,
      sgst,
      igst,
      totalGST,
      grandTotal
    };

    let result = null;
    if (editingQuote) {
      result = { ...editingQuote, ...payload };
      updateQuotation(result);
    } else {
      result = addQuotation(payload);
    }

    if (onQuoteCreated) {
      onQuoteCreated(result);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 md:p-7">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition-colors shrink-0"
            title="Back to Quotations List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
              {editingQuote ? `Edit Quotation (${editingQuote.quoteNumber})` : 'Create Quotation'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {editingQuote ? 'Modify line items, quantities, rates, and terms' : 'Create and manage professional budgetary quotations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSubmit}
            className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{editingQuote ? 'Update Quotation' : 'Save Quotation'}</span>
          </button>
        </div>
      </div>

      {/* Top Navigation Tabs: Quotation vs Terms */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('quotation')}
          className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'quotation'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotation Items Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Terms & Conditions</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROJECT HEADER INFO SECTION */}
        <div className="glass-panel p-6 md:p-8 border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Project Header Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select a Client
              </label>
              <select
                value={clientName}
                onChange={handleClientSelect}
                className="custom-select mb-2 font-semibold"
              >
                {clientsSuppliers.filter(c => c.type === 'Client').map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="Custom">-- Enter New Custom Client --</option>
              </select>
              <input
                type="text"
                placeholder="Client Company Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onFocus={handleFocus}
                className="custom-input font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Client GSTIN (Tax ID)
              </label>
              <input
                type="text"
                placeholder="e.g. 32ABDUL7711M1Z2"
                value={clientGSTIN}
                onChange={(e) => setClientGSTIN(e.target.value)}
                onFocus={handleFocus}
                className="custom-input font-mono font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Leave blank for Unregistered Persons (URP)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quotation Status
              </label>
              <select
                value={quoteStatus}
                onChange={(e) => setQuoteStatus(e.target.value)}
                className="custom-select font-bold text-slate-900"
              >
                <option value="Draft">Draft (Initial Workspace State)</option>
                <option value="Sent">Sent (Delivered to Client)</option>
                <option value="Approved">Approved (Ready for Invoice)</option>
                <option value="Converted">Converted (Invoice Generated)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Place of Supply (State)
              </label>
              <select
                value={placeOfSupply}
                onChange={(e) => setPlaceOfSupply(e.target.value)}
                className="custom-select font-semibold"
              >
                <option value="32 - Kerala">32 - Kerala (Intra-State: CGST 9% + SGST 9%)</option>
                <option value="33 - Tamil Nadu">33 - Tamil Nadu (Inter-State: IGST 18%)</option>
                <option value="27 - Maharashtra">27 - Maharashtra (Inter-State: IGST 18%)</option>
                <option value="29 - Karnataka">29 - Karnataka (Inter-State: IGST 18%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Person / Reference
              </label>
              <input
                type="text"
                placeholder="e.g. Abdul Rasheed"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                onFocus={handleFocus}
                className="custom-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quotation Date (DD-MM-YYYY)
              </label>
              <input
                type="date"
                value={rawDate}
                onChange={(e) => setRawDate(e.target.value)}
                className="custom-input font-mono"
              />
              <p className="text-[11px] text-emerald-700 mt-1 font-bold font-mono">Form: {formatDDMMYYYY(rawDate)}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Validity Expiry Date (DD-MM-YYYY)
              </label>
              <input
                type="date"
                value={rawValidUntil}
                onChange={(e) => setRawValidUntil(e.target.value)}
                className="custom-input font-mono"
              />
              <p className="text-[11px] text-emerald-700 mt-1 font-bold font-mono">Form: {formatDDMMYYYY(rawValidUntil)}</p>
            </div>
          </div>
        </div>

        {/* TAB 1: Quotation Items Table */}
        {activeTab === 'quotation' && (
          <div className="glass-panel p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Item Table
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addItemRow}
                  className="btn-secondary py-2 px-3.5 text-xs font-bold"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Add Line Row</span>
                </button>
              </div>
            </div>

            {/* Spreadsheet Grid */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3 border border-slate-800 w-12 text-center">Sl.No</th>
                    <th className="p-3 border border-slate-800 w-36">Area</th>
                    <th className="p-3 border border-slate-800 min-w-[200px]">Item Description</th>
                    <th className="p-3 border border-slate-800 min-w-[220px]">Specification</th>
                    <th className="p-3 border border-slate-800 w-24 text-center">Unit</th>
                    <th className="p-3 border border-slate-800 w-20 text-center">Qty</th>
                    <th className="p-3 border border-slate-800 w-28 text-right">Rate (₹)</th>
                    <th className="p-3 border border-slate-800 w-32 text-right">Amount (₹)</th>
                    <th className="p-3 border border-slate-800 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-900 font-sans">
                  {items.map((item, idx) => {
                    const rowAmount = Number(item.qty || 0) * Number(item.unitPrice || 0);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        {/* Sl.No */}
                        <td className="p-2 border border-slate-200 text-center font-bold font-mono text-slate-500">
                          {idx + 1}
                        </td>

                        {/* Area */}
                        <td className="p-2 border border-slate-200">
                          <input
                            id={`input-${idx}-area`}
                            type="text"
                            list={`area-list-${item.id}`}
                            value={item.area}
                            onChange={(e) => updateItem(item.id, 'area', e.target.value)}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'area')}
                            placeholder="Area/Section"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                          <datalist id={`area-list-${item.id}`}>
                            {AREA_PRESETS.map((a, i) => <option key={i} value={a} />)}
                          </datalist>
                        </td>

                        {/* Item Description */}
                        <td className="p-2 border border-slate-200">
                          <input
                            id={`input-${idx}-description`}
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'description')}
                            placeholder="Item name / Scope description"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            required
                          />
                        </td>

                        {/* Specification */}
                        <td className="p-2 border border-slate-200">
                          <input
                            id={`input-${idx}-specification`}
                            type="text"
                            list={`spec-list-${item.id}`}
                            value={item.specification}
                            onChange={(e) => updateItem(item.id, 'specification', e.target.value)}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'specification')}
                            placeholder="Specification / Details"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                          <datalist id={`spec-list-${item.id}`}>
                            {SPEC_PRESETS.map((s, i) => <option key={i} value={s} />)}
                          </datalist>
                        </td>

                        {/* Unit */}
                        <td className="p-2 border border-slate-200">
                          <select
                            id={`input-${idx}-unit`}
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'unit')}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-1.5 py-1.5 text-xs font-bold text-center text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          >
                            {UNIT_PRESETS.map((u, i) => <option key={i} value={u}>{u}</option>)}
                          </select>
                        </td>

                        {/* Qty */}
                        <td className="p-2 border border-slate-200">
                          <input
                            id={`input-${idx}-qty`}
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'qty')}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-extrabold text-center font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </td>

                        {/* Rate */}
                        <td className="p-2 border border-slate-200">
                          <input
                            id={`input-${idx}-unitPrice`}
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, idx, 'unitPrice')}
                            placeholder="0"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-right font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </td>

                        {/* Amount */}
                        <td className="p-2 border border-slate-200 text-right font-mono font-extrabold text-slate-900 bg-slate-50 text-xs">
                          ₹{rowAmount.toLocaleString()}
                        </td>

                        {/* Remove Action */}
                        <td className="p-2 border border-slate-200 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Table */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addItemRow}
                  className="btn-secondary py-2.5 px-5 text-xs font-bold"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Add Another Item Row</span>
                </button>
              </div>

              {/* Calculations Panel */}
              <div className="w-full md:w-96 glass-panel p-5 border border-slate-200 space-y-2.5 text-xs font-mono bg-slate-50">
                <div className="flex justify-between text-slate-700">
                  <span className="font-bold">Subtotal:</span>
                  <span className="font-extrabold text-slate-900">₹{rawSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 py-1 border-t border-slate-200">
                  <span className="font-bold">Contingency / Site (%):</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={contingencyPercent}
                      onChange={(e) => setContingencyPercent(e.target.value)}
                      onFocus={handleFocus}
                      className="w-16 bg-white border border-slate-300 rounded px-2 py-0.5 text-right font-bold text-xs"
                    />
                    <span>%</span>
                    <span className="font-extrabold text-slate-900 ml-2">₹{contingencyAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1.5">
                  <span>Taxable Value:</span>
                  <span className="font-extrabold text-slate-900">₹{taxableValue.toLocaleString()}</span>
                </div>

                {isIntraState ? (
                  <>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>CGST (9%):</span>
                      <span className="text-emerald-700 font-bold">₹{cgst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>SGST (9%):</span>
                      <span className="text-emerald-700 font-bold">₹{sgst.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>GST @ 18%:</span>
                    <span className="text-indigo-700 font-bold">₹{igst.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2 font-sans">
                  <span>GRAND TOTAL:</span>
                  <span className="text-emerald-700 font-extrabold font-mono">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="glass-panel p-6 md:p-8 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Payment Terms, Conditions & Deliverable Clauses
              </h3>
            </div>

            <textarea
              rows="10"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="custom-input text-xs leading-relaxed font-sans"
              placeholder="Enter quotation payment milestones, warranty clauses, site readiness requirements..."
            ></textarea>
          </div>
        )}

        {/* BOTTOM ACTION BAR WITH SECOND SAVE BUTTON */}
        <div className="glass-panel p-6 border border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary py-3 px-6 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel / Back</span>
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-primary py-3 px-8 text-xs font-extrabold shadow-lg shadow-emerald-600/25 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{editingQuote ? 'Update Quotation' : 'Save Quotation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
