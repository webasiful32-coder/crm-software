import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Users,
  FolderArchive,
  CheckSquare,
  Ticket as TicketIcon,
  Receipt,
  Target,
  Contact,
  ArrowRight
} from 'lucide-react';
import {
  CRMView,
  Client,
  Project,
  Task,
  Ticket,
  Invoice,
  Lead,
  Contact as ContactType
} from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: CRMView) => void;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  tickets: Ticket[];
  invoices: Invoice[];
  leads: Lead[];
  contacts: ContactType[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  clients,
  projects,
  tasks,
  tickets,
  invoices,
  leads,
  contacts,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingClients = q ? clients.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingTickets = q ? tickets.filter((t) => t.subject.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingInvoices = q ? invoices.filter((i) => i.invoiceNumber.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchingLeads = q ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)).slice(0, 3) : [];

  const hasResults =
    matchingClients.length > 0 ||
    matchingProjects.length > 0 ||
    matchingTasks.length > 0 ||
    matchingTickets.length > 0 ||
    matchingInvoices.length > 0 ||
    matchingLeads.length > 0;

  const handleSelect = (view: CRMView) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search clients, projects, tasks, invoices, leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!q && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p>Type anything to search across all CRM modules in real time.</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSelect('clients')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Clients
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('projects')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Projects
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('invoices')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Invoices
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('leads')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Leads
                </button>
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {matchingClients.length > 0 && (
            <div>
              <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Clients
              </div>
              <div className="space-y-1">
                {matchingClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('clients')}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.company}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingProjects.length > 0 && (
            <div>
              <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5 text-blue-600" /> Projects
              </div>
              <div className="space-y-1">
                {matchingProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('projects')}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.clientName} • {p.progress}%</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingTasks.length > 0 && (
            <div>
              <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Tasks
              </div>
              <div className="space-y-1">
                {matchingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect('tasks')}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-500">{t.assignee} • {t.status}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingInvoices.length > 0 && (
            <div>
              <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-blue-600" /> Invoices
              </div>
              <div className="space-y-1">
                {matchingInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect('invoices')}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{inv.invoiceNumber} - {inv.clientName}</div>
                      <div className="text-[11px] text-slate-500">৳ {inv.amount.toLocaleString()} • {inv.status}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
