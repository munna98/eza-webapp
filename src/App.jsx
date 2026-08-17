import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuotationBuilder from './components/QuotationBuilder';
import CreateQuotation from './components/CreateQuotation';
import InvoiceList from './components/InvoiceList';
import PaymentsLedger from './components/PaymentsLedger';
import Directory from './components/Directory';
import Reports from './components/Reports';

// Root Level Modals
import ContactModal from './components/modals/ContactModal';
import ReceiptModal from './components/modals/ReceiptModal';
import PayableModal from './components/modals/PayableModal';
import SettlePayableModal from './components/modals/SettlePayableModal';
import InvoicePDFModal from './components/InvoicePDFModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuote, setEditingQuote] = useState(null);
  
  // Root Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPayableModalOpen, setIsPayableModalOpen] = useState(false);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState(null);
  const [selectedPayableForSettlement, setSelectedPayableForSettlement] = useState(null);
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState(null);

  const handleOpenNewQuote = () => {
    setEditingQuote(null);
    setActiveTab('create-quotation');
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setActiveTab('create-quotation');
  };

  const handleSelectClientForQuote = (clientName) => {
    setEditingQuote(null);
    setActiveTab('create-quotation');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'create-quotation') setEditingQuote(null);
          setActiveTab(tab);
        }} 
        onOpenNewQuote={handleOpenNewQuote}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />

        <main className="p-6 md:p-8 max-w-[1450px] mx-auto w-full flex-1 space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              setActiveTab={setActiveTab}
              onOpenNewQuote={handleOpenNewQuote}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationBuilder 
              onOpenNewQuote={handleOpenNewQuote}
              onEditQuote={handleEditQuote}
              onSelectQuoteForPDF={(quote) => setSelectedInvoiceForPDF(quote)}
              searchTerm={searchTerm}
              onSelectInvoiceForPDF={(inv) => {
                setActiveTab('invoices');
                setSelectedInvoiceForPDF(inv);
              }}
            />
          )}

          {activeTab === 'create-quotation' && (
            <CreateQuotation 
              editingQuote={editingQuote}
              onBack={() => {
                setEditingQuote(null);
                setActiveTab('quotations');
              }}
              onQuoteCreated={() => {
                setEditingQuote(null);
                setActiveTab('quotations');
              }}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceList 
              searchTerm={searchTerm}
              onSelectInvoiceForPDF={(inv) => setSelectedInvoiceForPDF(inv)}
              onSelectInvoiceForReceipt={(inv) => setSelectedInvoiceForReceipt(inv)}
              onOpenNewQuote={handleOpenNewQuote}
            />
          )}

          {activeTab === 'ledger' && (
            <PaymentsLedger 
              searchTerm={searchTerm}
              onOpenAddPayable={() => setIsPayableModalOpen(true)}
              onSelectPayableForSettlement={(payable) => setSelectedPayableForSettlement(payable)}
            />
          )}

          {activeTab === 'directory' && (
            <Directory 
              searchTerm={searchTerm} 
              onSelectClientForQuote={handleSelectClientForQuote}
              onOpenAddContact={() => setIsContactModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <Reports />
          )}
        </main>
      </div>

      {/* ROOT LEVEL MODALS */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <ReceiptModal 
        invoice={selectedInvoiceForReceipt} 
        onClose={() => setSelectedInvoiceForReceipt(null)} 
      />

      <PayableModal 
        isOpen={isPayableModalOpen} 
        onClose={() => setIsPayableModalOpen(false)} 
      />

      <SettlePayableModal 
        payable={selectedPayableForSettlement} 
        onClose={() => setSelectedPayableForSettlement(null)} 
      />

      {selectedInvoiceForPDF && (
        <InvoicePDFModal 
          invoice={selectedInvoiceForPDF}
          onClose={() => setSelectedInvoiceForPDF(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
