import React, { useState } from 'react';
import { FileText, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const HSN_PRESETS = [
  { code: '998314', label: '998314 - Web Application & Software Dev Services' },
  { code: '998313', label: '998313 - IT Portal & Systems Integration' },
  { code: '998311', label: '998311 - Management & Business Consulting' },
  { code: '998312', label: '998312 - Graphic & UI/UX Design Services' },
  { code: '998319', label: '998319 - Other Technical & Professional Services' }
];

export default function QuotationModal({ isOpen, onClose }) {
  const { clientsSuppliers, businessInfo, addQuotation } = useApp();

  const [clientName, setClientName] = useState('Apex Commercial Solutions');
  const [clientGSTIN, setClientGSTIN] = useState('33APEX7711M1Z2');
  const [placeOfSupply, setPlaceOfSupply] = useState('33 - Tamil Nadu');
  const [reference, setReference] = useState('Rahul Nair');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('50% Advance upon kickoff, 50% upon completion & handover. Terms & Conditions apply.');

  const [items, setItems] = useState([
    {
      id: 1,
      description: 'Commercial Space Fitout & Facility Setup',
      hsnSac: '998314',
      qty: 1,
      unitPrice: 120000,
      gstRate: 18
    }
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        description: '',
        hsnSac: '998314',
        qty: 1,
        unitPrice: 0,
        gstRate: 18
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

  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0);
  const isIntraState = placeOfSupply.startsWith(businessInfo.stateCode);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  items.forEach(item => {
    const itemTotal = Number(item.qty) * Number(item.unitPrice);
    const taxAmt = (itemTotal * Number(item.gstRate)) / 100;
    if (isIntraState) {
      cgst += taxAmt / 2;
      sgst += taxAmt / 2;
    } else {
      igst += taxAmt;
    }
  });

  const totalGST = cgst + sgst + igst;
  const grandTotal = subtotal + totalGST;

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!clientName) {
      alert("Please provide a client name");
      return;
    }

    addQuotation({
      clientName,
      clientGSTIN,
      placeOfSupply,
      reference,
      date,
      validUntil,
      status: 'Approved',
      notes,
      items: items.map(it => ({
        ...it,
        amount: Number(it.qty) * Number(it.unitPrice)
      })),
      subtotal,
      cgst,
      sgst,
      igst,
      totalGST,
      grandTotal
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-fade-in my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              Create Proposal / Quotation
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Eza Spaces Quote Engine</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmitQuote} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select / Enter Client Name
              </label>
              <select 
                value={clientName} 
                onChange={handleClientSelect}
                className="custom-select mb-2"
              >
                {clientsSuppliers.filter(c => c.type === 'Client').map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="Custom">-- Custom Client Entry --</option>
              </select>
              <input
                type="text"
                placeholder="Client Company Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="custom-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Client GSTIN
              </label>
              <input
                type="text"
                placeholder="e.g. 33APEX7711M1Z2"
                value={clientGSTIN}
                onChange={(e) => setClientGSTIN(e.target.value)}
                className="custom-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Place of Supply (State)
              </label>
              <select 
                value={placeOfSupply} 
                onChange={(e) => setPlaceOfSupply(e.target.value)}
                className="custom-select"
              >
                <option value="32 - Kerala">32 - Kerala (Intra-State: CGST+SGST)</option>
                <option value="33 - Tamil Nadu">33 - Tamil Nadu (Inter-State: IGST)</option>
                <option value="27 - Maharashtra">27 - Maharashtra (Inter-State: IGST)</option>
                <option value="29 - Karnataka">29 - Karnataka (Inter-State: IGST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Reference Contact
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Nair"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Quote Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          {/* Dynamic Line Items Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">
                Free-Text Line Items & Pricing
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="btn-secondary py-2 px-4 text-xs font-bold"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add Item Line</span>
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      placeholder="Item Description / Service Scope..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="custom-input"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <select
                      value={item.hsnSac}
                      onChange={(e) => updateItem(item.id, 'hsnSac', e.target.value)}
                      className="custom-select text-xs"
                    >
                      {HSN_PRESETS.map(hsn => (
                        <option key={hsn.code} value={hsn.code}>{hsn.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                      className="custom-input text-center"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Rate (₹)"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                      className="custom-input font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tax Summary Preview */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="text-xs text-slate-700 space-y-1.5 font-medium">
              <p><span className="text-slate-500">Tax Type:</span> {isIntraState ? 'Intra-State Supply (CGST 9% + SGST 9%)' : 'Inter-State Supply (IGST 18%)'}</p>
              <p><span className="text-slate-500">Subtotal:</span> ₹{subtotal.toLocaleString()}</p>
              {isIntraState ? (
                <p><span className="text-slate-500">CGST (9%):</span> ₹{cgst.toLocaleString()} | <span className="text-slate-500">SGST (9%):</span> ₹{sgst.toLocaleString()}</p>
              ) : (
                <p><span className="text-slate-500">IGST (18%):</span> ₹{igst.toLocaleString()}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Grand Total</p>
              <p className="text-3xl font-extrabold text-emerald-700 font-mono mt-0.5">
                ₹{grandTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Terms & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Terms, Conditions & Payment Schedule
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="custom-input"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-5 border-t border-slate-200">
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
              <span>Save Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
