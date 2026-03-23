"use client";

import { useEffect, useState } from 'react';

type Invoice = {
  _id: string;
  invoiceNumber: string;
  client: { _id: string; name: string };
  shipment: { _id: string; trackingNumber: string; price: number };
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  issueDate: string;
  dueDate?: string;
};

// Types for form dropdowns
type Option = { _id: string; name?: string; trackingNumber?: string; price?: number };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Dropdown data
  const [clients, setClients] = useState<Option[]>([]);
  const [shipments, setShipments] = useState<Option[]>([]);

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState<'Pending' | 'Paid' | 'Overdue'>('Pending');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const [invoicesRes, clientsRes, shipmentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments`),
      ]);

      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (shipmentsRes.ok) setShipments(await shipmentsRes.json());
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-fill amount when a shipment is selected
  useEffect(() => {
    if (shipmentId) {
      const selectedShipment = shipments.find(s => s._id === shipmentId);
      if (selectedShipment && selectedShipment.price) {
        setAmount(selectedShipment.price.toString());
      }
    }
  }, [shipmentId, shipments]);

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        invoiceNumber,
        client: clientId,
        shipment: shipmentId,
        amount: Number(amount),
        status,
      };
      
      if (dueDate) payload.dueDate = new Date(dueDate).toISOString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        // Reset form
        setInvoiceNumber('');
        setClientId('');
        setShipmentId('');
        setAmount('0');
        setStatus('Pending');
        setDueDate('');
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to add invoice:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Invoices</h1>
          <p className="text-slate-500 mt-1">Manage billing and payments</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          {showForm ? 'Close Form' : '+ Create Invoice'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Create a New Invoice</h2>
          <form onSubmit={handleAddInvoice} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="INV-2023-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="" disabled>Select a client...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Related Shipment</label>
              <select value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} required className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="" disabled>Select a shipment...</option>
                {shipments.map(s => <option key={s._id} value={s._id}>{s.trackingNumber} - ${s.price}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700" />
            </div>
            <div className="flex items-end flex-col justify-end">
              <label className="block text-sm font-medium text-slate-700 mb-1 self-start">Status</label>
              <div className="flex w-full gap-2">
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="flex-1 border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-medium transition-colors">
                  Create Invoice
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 text-lg">No invoices found. Create your first invoice.</p>
          </div>
        ) : (
          invoices.map(invoice => (
            <div key={invoice._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className={`absolute transform rotate-45 text-xs font-bold py-1 right-[-35px] top-[20px] w-[140px] text-center shadow-sm ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-500 text-sm font-medium mb-1">Invoice</p>
                <h3 className="text-2xl font-black font-mono text-slate-800">{invoice.invoiceNumber}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 text-sm">Client</span>
                    <span className="font-bold text-slate-700">{invoice.client?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Amount Due</span>
                    <span className="font-bold text-2xl text-slate-900">${invoice.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Related Shipment</span>
                    <span className="font-medium font-mono text-slate-700">{invoice.shipment?.trackingNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued On</span>
                    <span className="font-medium text-slate-700">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Due By</span>
                      <span className={`font-medium ${new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid' ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
