import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Contact,
  FolderArchive,
  Ticket as TicketIcon,
  Cog,
  Receipt,
  Package,
  CheckSquare,
  FileSignature,
  CreditCard,
  ReceiptText,
  BarChart3,
  Sparkles,
  Settings,
  ChevronRight,
  X,
  Briefcase
} from 'lucide-react';
import { CRMView } from '../types';

interface SidebarProps {
  activeView: CRMView;
  setActiveView: (view: CRMView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  onClose,
}) => {
  const navItem = (
    view: CRMView,
    label: string,
    Icon: React.ElementType,
    badge?: string | number,
    hasSub = false
  ) => {
    const isActive = activeView === view;
    return (
      <button
        type="button"
        id={`nav-${view}`}
        onClick={() => {
          setActiveView(view);
          if (window.innerWidth < 1024) onClose();
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
          isActive
            ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon
            className={`w-[18px] h-[18px] shrink-0 ${
              isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
            }`}
          />
          <span className="truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {badge}
            </span>
          )}
          {hasSub && (
            <ChevronRight
              className={`w-3.5 h-3.5 opacity-60 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}
            />
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveView('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Business<span className="text-blue-600">Pro</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                CRM
              </span>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-sidebar"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 text-xs scrollbar-thin">
          {/* Main Dashboard */}
          <div>
            {navItem('dashboard', 'Dashboard', LayoutDashboard)}
          </div>

          {/* CRM Section */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              CRM
            </div>
            <div className="space-y-1">
              {navItem('clients', 'Clients', Users, undefined, true)}
              {navItem('leads', 'Leads', Target, '5')}
              {navItem('contacts', 'Contacts', Contact)}
            </div>
          </div>

          {/* Project & Sales */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Project & Sales
            </div>
            <div className="space-y-1">
              {navItem('projects', 'Projects', FolderArchive, '8', true)}
              {navItem('tickets', 'Tickets', TicketIcon, '2')}
              {navItem('services', 'Services', Cog)}
              {navItem('invoices', 'Invoices', Receipt, '12', true)}
              {navItem('items', 'Items', Package, undefined, true)}
            </div>
          </div>

          {/* Task & Management */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Task & Management
            </div>
            <div className="space-y-1">
              {navItem('tasks', 'Tasks', CheckSquare, '6')}
              {navItem('agreements', 'Agreements', FileSignature)}
            </div>
          </div>

          {/* Finance */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Finance
            </div>
            <div className="space-y-1">
              {navItem('payments', 'Payments', CreditCard, '7', true)}
              {navItem('expenses', 'Expense', ReceiptText, '5')}
            </div>
          </div>

          {/* Reports */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Reports
            </div>
            <div className="space-y-1">
              {navItem('reports', 'Reports', BarChart3, undefined, true)}
            </div>
          </div>

          {/* AI Assistant */}
          <div>
            <div className="px-3 mb-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              AI Assistant
            </div>
            <div className="space-y-1">
              <button
                type="button"
                id="nav-ai-assistant"
                onClick={() => {
                  setActiveView('ai-assistant');
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  activeView === 'ai-assistant'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Sparkles
                    className={`w-[18px] h-[18px] shrink-0 ${
                      activeView === 'ai-assistant' ? 'text-white' : 'text-blue-600 animate-pulse'
                    }`}
                  />
                  <span className="truncate">AI Assistant</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 uppercase">
                  Gemini
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            id="nav-settings"
            onClick={() => {
              setActiveView('settings');
              if (window.innerWidth < 1024) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'settings'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-[18px] h-[18px] text-slate-500" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
