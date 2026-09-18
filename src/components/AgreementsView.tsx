import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  Download,
  Eye,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { Agreement, Client } from '../types';

interface AgreementsViewProps {
  agreements: Agreement[];
  clients: Client[];
  onAddAgreement: (agreement: Omit<Agreement, 'id'>) => void;
  onUpdateAgreementStatus: (id: string, status: Agreement['status']) => void;
  onDeleteAgreement: (id: string) => void;
  onBack?: () => void;
}

export const AgreementsView: React.FC<AgreementsViewProps> = ({
  agreements,
  clients,
  onAddAgreement,
  onUpdateAgreementStatus,
  onDeleteAgreement,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.name || 'ABC Company');
  const [value, setValue] = useState('120000');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [status, setStatus] = useState<Agreement['status']>('Draft');
  const [terms, setTerms] = useState(
    'Standard software engineering SLA guarantee of 99.9% uptime, monthly support retainer, and quarterly security audits.'
  );

  const filteredAgreements = agreements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddAgreement({
      title,
      clientName,
      value: Number(value) || 50000,
      startDate,
      endDate,
      status,
      terms,
    });

    setTitle('');
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
              <FileCheck2 className="w-6 h-6 text-blue-600" />
              Agreements & Legal Contracts
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage legal NDAs, master services agreements (MSAs), and SLA commitments.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Agreement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agreements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {['all', 'Signed', 'Pending Signature', 'Draft', 'Expired'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Agreements List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <th className="py-3.5 px-4">Agreement Title</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Contract Value</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredAgreements.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileCheck2 className="w-6 h-6 text-slate-300" />
                    <p className="font-semibold text-slate-700 text-xs">No agreements found</p>
                    <p className="text-[11px] text-slate-400">
                      {searchTerm ? 'No agreements match your search' : 'No agreements created yet. Click "New Agreement" to draft contracts.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAgreements.map((a) => (
              <tr
                key={a.id}
                className="hover:bg-slate-50/80 transition cursor-pointer"
                onClick={() => setSelectedAgreement(a)}
              >
                <td className="py-3.5 px-4 font-bold text-slate-900">{a.title}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">{a.clientName}</td>
                <td className="py-3.5 px-4 font-extrabold text-blue-600">
                  ৳ {a.value.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {a.startDate} to {a.endDate}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      a.status === 'Signed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : a.status === 'Pending Signature'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAgreement(a)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                      title="View Agreement"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAgreement(a.id)}
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

      {/* Selected Agreement Details Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Contract Agreement
                </span>
                <h2 className="font-bold text-lg text-slate-900 mt-0.5">
                  {selectedAgreement.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block">Client:</span>
                  <span className="font-bold text-slate-900">{selectedAgreement.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Value:</span>
                  <span className="font-bold text-blue-600">
                    ৳ {selectedAgreement.value.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-semibold block mb-1">
                  Scope & Terms Conditions:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedAgreement.terms || 'Standard terms & conditions apply.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Status:</span>
                  {(['Signed', 'Pending Signature', 'Draft'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateAgreementStatus(selectedAgreement.id, st);
                        setSelectedAgreement({ ...selectedAgreement, status: st });
                      }}
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        selectedAgreement.status === st
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
                  onClick={() => setSelectedAgreement(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agreement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Create New Agreement</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Agreement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Service Agreement (MSA)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Value (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Agreement Terms & Obligations
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
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
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
