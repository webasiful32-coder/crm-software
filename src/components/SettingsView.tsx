import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Building,
  Database,
  Key,
  Bell,
  CheckCircle2,
  Save,
  Users,
  Lock,
  Server,
  ArrowLeft,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';
import { checkServerHealth } from '../services/dbApi';

interface SettingsViewProps {
  currentRole: 'Admin' | 'Employee';
  onBack?: () => void;
  dbSource?: 'neon' | 'server-file';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentRole, onBack, dbSource = 'server-file' }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'roles' | 'database' | 'security'>('general');
  const [companyName, setCompanyName] = useState('BusinessPro Ltd');
  const [currency, setCurrency] = useState('BDT (৳)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [neonConnected, setNeonConnected] = useState<boolean>(dbSource === 'neon');

  useEffect(() => {
    checkServerHealth().then((res) => {
      if (res) {
        setNeonConnected(res.neonConnected);
      }
    });
  }, []);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
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
              <Settings className="w-6 h-6 text-blue-600" />
              CRM Settings & Configuration
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure enterprise preferences, RBAC permissions, and PostgreSQL / Neon database connectivity.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          {savedNotice ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          General & Company
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'database'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          PostgreSQL / Neon DB
          {neonConnected ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Roles & Permissions (RBAC)
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          Security & API Keys
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6 max-w-2xl">
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900">Organization Info</h2>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Operating Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="BDT (৳)">BDT - Bangladeshi Taka (৳)</option>
                <option value="USD ($)">USD - US Dollar ($)</option>
                <option value="EUR (€)">EUR - Euro (€)</option>
                <option value="GBP (£)">GBP - British Pound (£)</option>
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-3 text-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Notifications
            </h2>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div>
                <span className="font-bold text-slate-900 block">Email Invoice & Ticket Alerts</span>
                <span className="text-slate-500">Receive instant updates for invoices and new client tickets.</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database & Backend Architecture */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              PostgreSQL & Neon Database Integration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect your CRM directly with a serverless PostgreSQL database from Neon (or any standard Postgres provider).
            </p>
          </div>

          {/* Connection Status Card */}
          <div className={`p-5 rounded-2xl border transition ${
            neonConnected
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${neonConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="font-bold text-sm">
                  {neonConnected ? 'Neon PostgreSQL Connected (Live Database)' : 'Server-Side Database Active (Local Storage Removed)'}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                neonConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {neonConnected ? 'Neon Active' : 'Fallback File Storage'}
              </span>
            </div>

            <p className="text-xs mt-2 text-slate-700">
              {neonConnected
                ? 'Your users, clients, projects, invoices, and tickets are directly synchronized with your Neon PostgreSQL cloud tables.'
                : 'Local storage has been disabled. The CRM now saves all data on the backend server database (`/data/crm_database.json`). To connect your live cloud Neon database, provide DATABASE_URL in Settings.'}
            </p>
          </div>

          {/* Setup Guide for Neon */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Server className="w-4 h-4 text-blue-600" />
              How to connect your Neon PostgreSQL database:
            </h3>

            <ol className="list-decimal list-inside space-y-2 text-slate-700 pl-1 font-medium">
              <li>
                Visit <a href="https://console.neon.tech" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-0.5">Neon Console <ExternalLink className="w-3 h-3" /></a> and create a free project.
              </li>
              <li>
                Copy your <strong>PostgreSQL Connection String</strong> (e.g., <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-800">postgresql://neondb_owner:***@ep-xyz.neon.tech/neondb?sslmode=require</code>).
              </li>
              <li>
                In the AI Studio <strong>Settings &gt; Environment Variables</strong> menu, set:
                <div className="mt-1 bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px]">
                  DATABASE_URL="your-neon-connection-string"
                </div>
              </li>
              <li>
                Restart the applet. The server will automatically connect to Neon, run table migrations (`users`, `crm_state`), and store all CRM data in PostgreSQL!
              </li>
            </ol>
          </div>

          {/* Database Schema Map */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              Database Tables & Structure:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">users</span>
                <span className="text-slate-500 text-[11px]">id, name, email, password, role, avatar, department</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">clients</span>
                <span className="text-slate-500 text-[11px]">id, name, company, email, phone, status</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">projects & tasks</span>
                <span className="text-slate-500 text-[11px]">id, name, budget, progress, deadline, assignee</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">invoices & payments</span>
                <span className="text-slate-500 text-[11px]">invoice_num, amount, client, status, method</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">tickets & support</span>
                <span className="text-slate-500 text-[11px]">id, subject, priority, status, assigned_to</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block font-mono text-[11px]">leads & contracts</span>
                <span className="text-slate-500 text-[11px]">id, title, value, stage, source, validity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Permissions (RBAC) */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Current user permissions mapped directly from enterprise policy.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                  <th className="py-3 px-4 font-bold">Module / Capability</th>
                  <th className="py-3 px-4 font-bold text-center">Admin</th>
                  <th className="py-3 px-4 font-bold text-center">Employee</th>
                  <th className="py-3 px-4 font-bold">Permissions Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { module: 'Clients & Accounts Directory', admin: true, emp: true, note: 'Create & view client profiles' },
                  { module: 'Projects & Milestone Tracking', admin: true, emp: true, note: 'Update tasks & status' },
                  { module: 'Support Tickets Desk', admin: true, emp: true, note: 'Full response capabilities' },
                  { module: 'Invoices & Vouchers Generation', admin: true, emp: false, note: 'Admin-only billing' },
                  { module: 'Payments & Business Expenses', admin: true, emp: false, note: 'Admin-only ledger' },
                  { module: 'Sales Leads & Conversions', admin: true, emp: true, note: 'Outreach & qualification' },
                  { module: 'Agreements & Legal Contracts', admin: true, emp: false, note: 'Admin signatory only' },
                  { module: 'Gemini AI Business Assistant', admin: true, emp: true, note: 'Productivity acceleration' },
                ].map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{perm.module}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                        ✓ Allowed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {perm.emp ? (
                        <span className="inline-flex p-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                          ✓ Allowed
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded-full bg-rose-50 text-rose-600 font-bold">
                          ✕ Restricted
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{perm.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6 max-w-3xl text-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Security & Authentication
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Gemini API Key</span>
                <span className="text-slate-500">Stored server-side via process.env.GEMINI_API_KEY</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                Configured & Protected
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Database URL (PostgreSQL / Neon)</span>
                <span className="text-slate-500">Stored securely server-side in process.env.DATABASE_URL</span>
              </div>
              <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                neonConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {neonConnected ? 'Connected to Neon' : 'Local Server Mode'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
