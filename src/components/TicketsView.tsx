import React, { useState } from 'react';
import {
  Ticket as TicketIcon,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  X,
  User,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { Ticket, Client } from '../types';

interface TicketsViewProps {
  tickets: Ticket[];
  clients: Client[];
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'lastReply'>) => void;
  onUpdateTicketStatus: (id: string, status: Ticket['status']) => void;
  onDeleteTicket: (id: string) => void;
  onBack?: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  clients,
  onAddTicket,
  onUpdateTicketStatus,
  onDeleteTicket,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.name || 'ABC Company');
  const [priority, setPriority] = useState<Ticket['priority']>('High');
  const [description, setDescription] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    onAddTicket({
      code: `TCK-${randomNum}`,
      subject,
      clientName,
      priority,
      status: 'Open',
      description,
    });

    setSubject('');
    setDescription('');
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
              <TicketIcon className="w-6 h-6 text-blue-600" />
              Support Tickets
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Resolve customer queries, system alerts, and technical issues.
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-create-ticket-modal"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
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

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-3.5 px-4 w-28">Ticket ID</th>
                <th className="py-3.5 px-4">Subject & Client</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4">Last Reply</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <TicketIcon className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-xs">No support tickets found</p>
                      <p className="text-[11px] text-slate-400">
                        {searchTerm ? 'No tickets match your search' : 'No support tickets opened yet. Click "New Ticket" to log an issue.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => setSelectedTicket(t)}
                >
                  <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">
                    #{t.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.subject}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{t.clientName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700 font-black'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        t.status === 'Open'
                          ? 'bg-blue-100 text-blue-700'
                          : t.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {t.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {t.lastReply}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onDeleteTicket(t.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail & Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-blue-600 font-bold">
                  #{selectedTicket.code}
                </span>
                <h2 className="font-bold text-base text-slate-900 mt-0.5">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-slate-500">{selectedTicket.clientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900 block mb-1">
                  Issue Description:
                </span>
                {selectedTicket.description}
              </div>

              {/* Status Update bar */}
              <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <span className="font-semibold text-slate-700">Ticket Status:</span>
                <div className="flex gap-1.5">
                  {(['Open', 'In Progress', 'Resolved', 'Closed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateTicketStatus(selectedTicket.id, st);
                        setSelectedTicket({ ...selectedTicket, status: st });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedTicket.status === st
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-semibold text-slate-800">
                  Post Support Response:
                </label>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type official reply to client..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!replyMessage) return;
                      onUpdateTicketStatus(selectedTicket.id, 'Resolved');
                      setSelectedTicket({
                        ...selectedTicket,
                        status: 'Resolved',
                        lastReply: 'You (Support)',
                      });
                      setReplyMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reply & Mark Resolved</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!replyMessage) return;
                      setSelectedTicket({
                        ...selectedTicket,
                        lastReply: 'You (Support)',
                      });
                      setReplyMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Create Support Ticket</h2>
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
                  Ticket Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database connection latency spikes"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client Account *
                  </label>
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
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Urgent">Urgent (SLA 1h)</option>
                    <option value="High">High (SLA 4h)</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Issue Description & Reproduction Steps *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe error logs, steps to reproduce, user context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
