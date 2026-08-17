import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Directory({ searchTerm, onSelectClientForQuote, onOpenAddContact }) {
  const { clientsSuppliers, deleteContact } = useApp();
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredDirectory = clientsSuppliers.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.contactPerson && item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.gstin && item.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (typeFilter === 'All') return matchesSearch;
    return matchesSearch && item.type === typeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 md:p-8">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-600" />
            Parties
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Centralized database of registered clients, vendors, GSTIN details, and ledger balances
          </p>
        </div>

        <button
          onClick={onOpenAddContact}
          className="btn-primary py-3 px-5 text-sm shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Party</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        {[
          { label: 'All Parties', value: 'All' },
          { label: 'Clients Only', value: 'Client' },
          { label: 'Suppliers / Vendors', value: 'Supplier' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === tab.value
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDirectory.map((contact) => (
          <div 
            key={contact.id} 
            className="glass-panel-interactive rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-5"
          >
            <div>
              {/* Card Top: Avatar, Name & Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-xs ${
                    contact.type === 'Client' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-purple-100 text-purple-800 border border-purple-300'
                  }`}>
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
                      contact.type === 'Client' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-purple-100 text-purple-800 border border-purple-300'
                    }`}>
                      {contact.type}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 mt-1 leading-snug">
                      {contact.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Detailed Contact List */}
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contact: <strong className="text-slate-900 font-bold">{contact.contactPerson || 'N/A'}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">{contact.email || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700 font-mono font-medium">{contact.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2.5 font-mono text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">GSTIN: {contact.gstin || 'N/A'} ({contact.placeOfSupply || 'Kerala'})</span>
                </div>

                {contact.address && (
                  <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-0.5 leading-relaxed font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{contact.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Bottom: Balance Ledger & Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Ledger Balance</p>
                <p className="text-lg font-extrabold font-mono text-slate-900 mt-0.5">
                  ₹{(contact.balance || 0).toLocaleString()}
                </p>
              </div>

              {contact.type === 'Client' && (
                <button
                  onClick={() => onSelectClientForQuote(contact.name)}
                  className="btn-secondary text-xs py-2 px-3.5 shrink-0 font-bold"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Create Quote</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
