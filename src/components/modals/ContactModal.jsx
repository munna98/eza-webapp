import React, { useState } from 'react';
import { Users, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ContactModal({ isOpen, onClose, initialName = '' }) {
  const { addContact } = useApp();

  const [name, setName] = useState(initialName);
  const [type, setType] = useState('Client');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('32 - Kerala');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addContact({
      name,
      type,
      contactPerson,
      email,
      phone,
      gstin,
      placeOfSupply,
      address
    });

    onClose();
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setGstin('');
    setAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in my-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            Add Party
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Company / Name</label>
              <input
                type="text"
                placeholder="e.g. Eza Spaces Pvt Ltd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="custom-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Party Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="custom-select"
              >
                <option value="Client">Client</option>
                <option value="Supplier">Supplier / Vendor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Afnan Sonu"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">GSTIN</label>
              <input
                type="text"
                placeholder="e.g. 32EZA8899K1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="custom-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Place of Supply</label>
            <select
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              className="custom-select"
            >
              <option value="32 - Kerala">32 - Kerala</option>
              <option value="33 - Tamil Nadu">33 - Tamil Nadu</option>
              <option value="27 - Maharashtra">27 - Maharashtra</option>
              <option value="29 - Karnataka">29 - Karnataka</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Office Address</label>
            <textarea
              rows="2"
              placeholder="Street, City, State, Pincode"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="custom-input"
            ></textarea>
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
              Save Party
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
