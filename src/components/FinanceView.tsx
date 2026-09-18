import React, { useState } from 'react';
import {
  CreditCard,
  ReceiptText,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CheckCircle2,
  Clock,
  Building2,
  X,
  Trash2,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Payment, Expense, Client } from '../types';

interface FinanceViewProps {
  payments: Payment[];
  expenses: Expense[];
  clients: Client[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeletePayment: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onBack?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  payments,
  expenses,
  clients,
  onAddPayment,
  onAddExpense,
  onDeletePayment,
  onDeleteExpense,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'expenses'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Payment form state
  const [payClient, setPayClient] = useState(clients[0]?.name || 'XYZ Ltd');
  const [payAmount, setPayAmount] = useState('30000');
  const [payMethod, setPayMethod] = useState<Payment['method']>('Bank Transfer');
  const [payRef, setPayRef] = useState('');

  // Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<Expense['category']>('Software');
  const [expAmount, setExpAmount] = useState('8000');
  const [expDate, setExpDate] = useState('2025-11-16');

  const totalPaymentsAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashflow = totalPaymentsAmount - totalExpensesAmount;

  const filteredPayments = payments.filter((p) =>
    p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment({
      receiptNo: `RCPT-2025-${Math.floor(90 + Math.random() * 90)}`,
      clientName: payClient,
      amount: Number(payAmount) || 10000,
      method: payMethod,
      date: 'Just now',
      status: 'Completed',
      reference: payRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setShowAddPaymentModal(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle) return;

    onAddExpense({
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount) || 5000,
      date: expDate,
      status: 'Approved',
      recordedBy: 'Asiful Islam',
    });

    setExpTitle('');
    setShowAddExpenseModal(false);
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
              <Wallet className="w-6 h-6 text-blue-600" />
              Payments & Expenses
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time ledger tracking client receipts, vendor expenses, and net profit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-add-payment-modal"
            onClick={() => setShowAddPaymentModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
          <button
            type="button"
            id="btn-add-expense-modal"
            onClick={() => setShowAddExpenseModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Received</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ৳ {totalPaymentsAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            ↑ 20% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ৳ {totalExpensesAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            ↑ 5% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Net Operating Cash</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-2">
            ৳ {netCashflow.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            Profitable Margin
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments Received ({payments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'expenses'
                ? 'bg-white text-rose-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Business Expenses ({expenses.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'payments'
                ? 'Search receipts, clients...'
                : 'Search expense title, category...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Payments Table */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CreditCard className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-xs">No payment records found</p>
                      <p className="text-[11px] text-slate-400">
                        {searchTerm ? 'No payments match your search' : 'No payments logged yet. Click "Record Payment" to add one.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {p.receiptNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{p.clientName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                    ৳ {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{p.date}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {p.reference}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeletePayment(p.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-3.5 px-4">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Recorded By</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ReceiptText className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-xs">No expense records found</p>
                      <p className="text-[11px] text-slate-400">
                        {searchTerm ? 'No expenses match your search' : 'No expenses recorded yet. Click "Record Expense" to add one.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{e.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-rose-600">
                    ৳ {e.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{e.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{e.recordedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(e.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Record Client Payment</h2>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client *</label>
                <select
                  value={payClient}
                  onChange={(e) => setPayClient(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount Received (৳ BDT) *
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Bank Transfer">Bank Transfer (EFT / Wire)</option>
                  <option value="bKash">bKash Merchant</option>
                  <option value="Nagad">Nagad Direct</option>
                  <option value="Stripe">Stripe Credit Card</option>
                  <option value="Cash">Cash in Hand</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque #</label>
                <input
                  type="text"
                  placeholder="e.g. TXN-8849201"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Save Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Record Business Expense</h2>
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Infrastructure Billing"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Software">Software Licenses</option>
                    <option value="Hosting">Cloud & Hosting</option>
                    <option value="Office">Office & Utilities</option>
                    <option value="Marketing">Marketing & Ads</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Misc">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-500/20"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
