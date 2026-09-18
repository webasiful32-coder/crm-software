import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  FileText,
  Trash2,
  ExternalLink,
  Building2,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Invoice, Client } from '../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  onDeleteInvoice: (id: string) => void;
  onBack?: () => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  clients,
  onAddInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Invoice Form
  const [clientName, setClientName] = useState(clients[0]?.name || 'ABC Company');
  const [issueDate, setIssueDate] = useState('2025-11-15');
  const [dueDate, setDueDate] = useState('2025-11-30');
  const [items, setItems] = useState([
    { id: '1', description: 'Web Application Development Phase 1', qty: 1, rate: 45000, amount: 45000 },
  ]);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: 'Design & Code Milestone',
        qty: 1,
        rate: 15000,
        amount: 15000,
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    item.amount = (Number(item.qty) || 0) * (Number(item.rate) || 0);
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculatedTotal = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invNum = `#INV-00${Math.floor(45 + Math.random() * 50)}`;

    onAddInvoice({
      invoiceNumber: invNum,
      clientName,
      amount: calculatedTotal,
      status: 'Pending',
      issueDate,
      dueDate,
      items,
      notes: 'Thank you for partnering with BusinessPro. Payment due within 15 days.',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs shadow-2xs transition-all shrink-0 cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              Invoices & Billing
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create itemized invoices, track payments status, and generate printable receipts.
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-create-invoice-modal"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {['all', 'Paid', 'Pending', 'Overdue'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Amount (BDT)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-xs">No invoices found</p>
                      <p className="text-[11px] text-slate-400">
                        {searchTerm ? 'No invoices match your search' : 'No invoices generated yet. Click "Create Invoice" to start billing.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {inv.clientName}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ৳ {inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : inv.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700 font-bold'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                        title="View Voucher"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Voucher Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Action buttons header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-blue-600">
                  {selectedInvoice.invoiceNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedInvoice.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Voucher Printable Body */}
            <div className="mt-6 space-y-6 text-xs text-slate-700">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Business<span className="text-blue-600">Pro</span> CRM
                  </h2>
                  <p className="text-slate-500 mt-0.5">Software Solutions & IT Services</p>
                  <p className="text-slate-400">Gulshan-2, Dhaka-1212, Bangladesh</p>
                  <p className="text-slate-400">support@businesspro.com</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    INVOICE
                  </span>
                  <div className="text-lg font-bold text-slate-900 font-mono">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <p className="text-slate-500 mt-1">Date: {selectedInvoice.issueDate}</p>
                  <p className="text-slate-500">Due Date: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Billed To:
                </span>
                <div className="font-bold text-sm text-slate-900 mt-1">
                  {selectedInvoice.clientName}
                </div>
                <p className="text-slate-500">
                  {selectedInvoice.clientEmail || 'finance@clientcorp.com'}
                </p>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {it.description}
                        </td>
                        <td className="py-2.5 px-3 text-center">{it.qty}</td>
                        <td className="py-2.5 px-3 text-right">৳ {it.rate.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold">
                          ৳ {it.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ৳ {selectedInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT / Tax (0%):</span>
                    <span className="font-semibold">৳ 0</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                    <span>Total Due:</span>
                    <span className="text-blue-600">
                      ৳ {selectedInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status toggle actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600">Update Status:</span>
                  {(['Paid', 'Pending', 'Overdue'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateInvoiceStatus(selectedInvoice.id, st);
                        setSelectedInvoice({ ...selectedInvoice, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        selectedInvoice.status === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Create New Invoice</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client *</label>
                  <select
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold text-slate-800">
                  <span>Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(idx, 'qty', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(idx, 'rate', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl flex justify-between items-center font-bold text-sm text-slate-900">
                <span>Calculated Total:</span>
                <span className="text-blue-600">৳ {calculatedTotal.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Create & Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
