import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Date Formatter Helper: YYYY-MM-DD -> DD-MM-YYYY
export const formatDDMMYYYY = (dateInput) => {
  if (!dateInput) return '';
  const str = String(dateInput).split('T')[0];
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return str;
};

export const getTodayDDMMYYYY = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getFutureDDMMYYYY = (daysAhead) => {
  const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Business Profile for Eza Spaces Private Limited
const SEED_BUSINESS_INFO = {
  name: "Eza Spaces Private Limited",
  gstin: "32EZA8899K1Z5",
  stateCode: "32",
  stateName: "Kerala",
  address: "Eza Spaces Tower, MG Road, Ernakulam, Kerala - 682016",
  email: "billing@ezaspaces.com",
  phone: "+91 99887 76655",
  website: "www.ezaspaces.com",
  bankName: "HDFC Bank",
  accountNo: "50200099881122",
  ifsc: "HDFC0001234",
  branch: "Ernakulam Main Branch"
};

// Registered Clients & Suppliers of Eza Spaces
const SEED_CLIENTS_SUPPLIERS = [
  {
    id: "DIR-001",
    name: "Mr. Abdul Rasheed",
    type: "Client",
    contactPerson: "Abdul Rasheed",
    email: "rasheed@malabarspaces.in",
    phone: "+91 98470 11223",
    gstin: "32ABDUL7711M1Z2",
    placeOfSupply: "32 - Kerala",
    address: "Rasheed Villa, Malabar, Kerala",
    balance: 852000
  },
  {
    id: "DIR-002",
    name: "Apex Commercial Solutions",
    type: "Client",
    contactPerson: "Rahul Nair",
    email: "rahul@apexcommercial.in",
    phone: "+91 98470 55443",
    gstin: "33APEX7711M1Z2",
    placeOfSupply: "33 - Tamil Nadu",
    address: "121 Mount Road, Guindy, Chennai, Tamil Nadu - 600032",
    balance: 141600
  },
  {
    id: "DIR-003",
    name: "Urban Nest Developers",
    type: "Client",
    contactPerson: "Meera Krishnan",
    email: "accounts@urbannest.co",
    phone: "+91 97455 33445",
    gstin: "32URBAN5544P1Z8",
    placeOfSupply: "32 - Kerala",
    address: "Urban Towers, Kowdiar, Trivandrum, Kerala - 695003",
    balance: 41300
  },
  {
    id: "DIR-004",
    name: "SiliconTech Office Systems",
    type: "Supplier",
    contactPerson: "Vikram Shah",
    email: "sales@silicontech.in",
    phone: "+91 98112 44556",
    gstin: "32SILICON4411P1Z0",
    placeOfSupply: "32 - Kerala",
    address: "Industrial Estate, Kalamassery, Kochi - 683104",
    balance: 18000
  }
];

// Quotations in DD-MM-YYYY date format
const SEED_QUOTATIONS = [
  {
    id: "Q-2026-001",
    quoteNumber: "EZA-QT-2026-01",
    clientName: "Mr. Abdul Rasheed",
    clientGSTIN: "32ABDUL7711M1Z2",
    placeOfSupply: "32 - Kerala",
    regionBasis: "Malabar / Kerala",
    date: "09-08-2026",
    validUntil: "08-09-2026",
    status: "Draft",
    reference: "Abdul Rasheed",
    title: "BUDGETARY QUOTATION",
    contingencyPercent: 0,
    contingencyAmount: 0,
    items: [
      { id: 1, area: "Reception / Foyer", description: "Reception Counter & Feature Wall", specification: "Premium Finish", unit: "L.S", qty: 1, unitPrice: 45000, amount: 45000 },
      { id: 2, area: "Office Space", description: "Workstation Desks & Partitioning", specification: "Laminated Finish", unit: "Nos", qty: 10, unitPrice: 12500, amount: 125000 },
      { id: 3, area: "Executive Cabin", description: "Executive Desk & Credenza Unit", specification: "Veneer / PU Finish", unit: "L.S", qty: 1, unitPrice: 65000, amount: 65000 }
    ],
    subtotal: 235000,
    taxableValue: 235000,
    cgst: 21150,
    sgst: 21150,
    igst: 0,
    totalGST: 42300,
    grandTotal: 277300,
    notes: "1. Payment Terms: 50% Advance upon project approval & sign-off.\n2. 40% Progress payment upon material delivery to site.\n3. 10% Final payment upon completion & handover."
  },
  {
    id: "Q-2026-002",
    quoteNumber: "EZA-QT-2026-02",
    clientName: "Apex Commercial Solutions",
    clientGSTIN: "33APEX7711M1Z2",
    placeOfSupply: "33 - Tamil Nadu",
    regionBasis: "Chennai / Tamil Nadu",
    date: "12-08-2026",
    validUntil: "11-09-2026",
    status: "Sent",
    reference: "Rahul Nair",
    title: "COMMERCIAL FITOUT QUOTATION",
    contingencyPercent: 0,
    contingencyAmount: 0,
    items: [
      { id: 1, area: "Conference Room", description: "12-Seater Modular Table & Wall Panels", specification: "Veneer Finish", unit: "L.S", qty: 1, unitPrice: 120000, amount: 120000 }
    ],
    subtotal: 120000,
    taxableValue: 120000,
    cgst: 0,
    sgst: 0,
    igst: 21600,
    totalGST: 21600,
    grandTotal: 141600,
    notes: "Sent for client review."
  }
];

// Tax Invoices in DD-MM-YYYY date format
const SEED_INVOICES = [
  {
    id: "INV-2026-0801",
    invoiceNumber: "INV/2026-27/001",
    clientName: "Mr. Abdul Rasheed",
    clientGSTIN: "32ABDUL7711M1Z2",
    placeOfSupply: "32 - Kerala",
    date: "10-08-2026",
    dueDate: "25-08-2026",
    status: "Paid",
    items: [
      { id: 1, area: "Living", description: "50% Advance - Living & Bedroom Fitout", specification: "Wood + PU finish", unit: "L.S", qty: 1, unitPrice: 387375, amount: 387375 }
    ],
    subtotal: 387375,
    cgst: 34863.75,
    sgst: 34863.75,
    igst: 0,
    totalGST: 69727.5,
    grandTotal: 457102.5,
    amountPaid: 457102.5,
    balanceDue: 0,
    notes: "Advance payment received via Bank Transfer."
  }
];

const SEED_RECEIPTS = [
  {
    id: "REC-101",
    receiptNumber: "REC/2026/001",
    invoiceNumber: "INV/2026-27/001",
    clientName: "Mr. Abdul Rasheed",
    date: "10-08-2026",
    amount: 457102.5,
    paymentMode: "Bank Transfer (NEFT)",
    referenceId: "HDFC-NEFT-9982103",
    notes: "Advance payment received with thanks."
  }
];

const SEED_PAYABLES = [
  {
    id: "PAY-301",
    billNumber: "BILL-ST-109",
    supplierName: "SiliconTech Office Systems",
    supplierGSTIN: "32SILICON4411P1Z0",
    category: "Smart Locks & Access Control Hardware",
    date: "10-08-2026",
    dueDate: "25-08-2026",
    amount: 18000,
    status: "Unpaid",
    paidAmount: 0,
    paymentMode: "-",
    referenceId: "-"
  }
];

export function AppProvider({ children }) {
  const [businessInfo] = useState(SEED_BUSINESS_INFO);
  
  const [clientsSuppliers, setClientsSuppliers] = useState(() => {
    const saved = localStorage.getItem('eza_directory_v6');
    return saved ? JSON.parse(saved) : SEED_CLIENTS_SUPPLIERS;
  });

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem('eza_quotations_v6');
    return saved ? JSON.parse(saved) : SEED_QUOTATIONS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('eza_invoices_v6');
    return saved ? JSON.parse(saved) : SEED_INVOICES;
  });

  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem('eza_receipts_v6');
    return saved ? JSON.parse(saved) : SEED_RECEIPTS;
  });

  const [payables, setPayables] = useState(() => {
    const saved = localStorage.getItem('eza_payables_v6');
    return saved ? JSON.parse(saved) : SEED_PAYABLES;
  });

  useEffect(() => {
    localStorage.setItem('eza_directory_v6', JSON.stringify(clientsSuppliers));
  }, [clientsSuppliers]);

  useEffect(() => {
    localStorage.setItem('eza_quotations_v6', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('eza_invoices_v6', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('eza_receipts_v6', JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem('eza_payables_v6', JSON.stringify(payables));
  }, [payables]);

  const addQuotation = (quote) => {
    const newQuote = {
      ...quote,
      id: `Q-2026-${String(quotations.length + 1).padStart(3, '0')}`,
      quoteNumber: `EZA-QT-2026-${String(quotations.length + 1).padStart(2, '0')}`,
      date: formatDDMMYYYY(quote.date) || getTodayDDMMYYYY(),
      validUntil: formatDDMMYYYY(quote.validUntil) || getFutureDDMMYYYY(30)
    };
    setQuotations([newQuote, ...quotations]);
    return newQuote;
  };

  const updateQuotation = (updatedQuote) => {
    setQuotations(quotations.map(q => q.id === updatedQuote.id ? {
      ...updatedQuote,
      date: formatDDMMYYYY(updatedQuote.date),
      validUntil: formatDDMMYYYY(updatedQuote.validUntil)
    } : q));
  };

  const updateQuotationStatus = (quoteId, newStatus) => {
    setQuotations(quotations.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
  };

  const convertQuoteToInvoice = (quoteId) => {
    const quote = quotations.find(q => q.id === quoteId);
    if (!quote) return null;

    const newInvoiceNumber = `INV/2026-27/${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`,
      invoiceNumber: newInvoiceNumber,
      clientName: quote.clientName,
      clientGSTIN: quote.clientGSTIN || "",
      placeOfSupply: quote.placeOfSupply || "32 - Kerala",
      date: getTodayDDMMYYYY(),
      dueDate: getFutureDDMMYYYY(15),
      status: "Unpaid",
      items: quote.items.map(item => ({ ...item })),
      subtotal: quote.subtotal,
      cgst: quote.cgst,
      sgst: quote.sgst,
      igst: quote.igst,
      totalGST: quote.totalGST,
      grandTotal: quote.grandTotal,
      amountPaid: 0,
      balanceDue: quote.grandTotal,
      notes: `Converted from Quotation #${quote.quoteNumber}. ${quote.notes || ''}`
    };

    setInvoices([newInvoice, ...invoices]);
    setQuotations(quotations.map(q => q.id === quoteId ? { ...q, status: 'Converted' } : q));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    return newInvoice;
  };

  const recordReceiptPayment = (invoiceId, paymentInfo) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const paymentAmount = Number(paymentInfo.amount);
    const newAmountPaid = invoice.amountPaid + paymentAmount;
    const newBalance = Math.max(0, invoice.grandTotal - newAmountPaid);
    const newStatus = newBalance === 0 ? "Paid" : "Partially Paid";

    setInvoices(invoices.map(inv => inv.id === invoiceId ? {
      ...inv,
      amountPaid: newAmountPaid,
      balanceDue: newBalance,
      status: newStatus
    } : inv));

    const newReceipt = {
      id: `REC-${receipts.length + 101}`,
      receiptNumber: `REC/2026/${String(receipts.length + 1).padStart(3, '0')}`,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      date: formatDDMMYYYY(paymentInfo.date) || getTodayDDMMYYYY(),
      amount: paymentAmount,
      paymentMode: paymentInfo.paymentMode,
      referenceId: paymentInfo.referenceId,
      notes: paymentInfo.notes || "Receipt logged"
    };

    setReceipts([newReceipt, ...receipts]);
  };

  const addPayable = (payableData) => {
    const newPayable = {
      ...payableData,
      id: `PAY-${payables.length + 301}`,
      date: formatDDMMYYYY(payableData.date) || getTodayDDMMYYYY(),
      dueDate: formatDDMMYYYY(payableData.dueDate) || getFutureDDMMYYYY(15),
      status: "Unpaid",
      paidAmount: 0
    };
    setPayables([newPayable, ...payables]);
    return newPayable;
  };

  const recordPayablePayment = (payableId, paymentInfo) => {
    setPayables(payables.map(p => {
      if (p.id === payableId) {
        return {
          ...p,
          status: "Paid",
          paidAmount: p.amount,
          paymentMode: paymentInfo.paymentMode,
          referenceId: paymentInfo.referenceId,
          paidDate: formatDDMMYYYY(paymentInfo.date) || getTodayDDMMYYYY()
        };
      }
      return p;
    }));
  };

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: `DIR-${String(clientsSuppliers.length + 1).padStart(3, '0')}`,
      balance: 0
    };
    setClientsSuppliers([...clientsSuppliers, newContact]);
  };

  const deleteContact = (id) => {
    setClientsSuppliers(clientsSuppliers.filter(c => c.id !== id));
  };

  const resetData = () => {
    setClientsSuppliers(SEED_CLIENTS_SUPPLIERS);
    setQuotations(SEED_QUOTATIONS);
    setInvoices(SEED_INVOICES);
    setReceipts(SEED_RECEIPTS);
    setPayables(SEED_PAYABLES);
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{
      businessInfo,
      clientsSuppliers,
      quotations,
      invoices,
      receipts,
      payables,
      addQuotation,
      updateQuotation,
      updateQuotationStatus,
      convertQuoteToInvoice,
      recordReceiptPayment,
      addPayable,
      recordPayablePayment,
      addContact,
      deleteContact,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
