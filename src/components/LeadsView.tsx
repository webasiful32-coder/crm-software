import React, { useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  Building2,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  X,
  Send,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { Lead } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLeadStatus: (id: string, status: Lead['status']) => void;
  onConvertToClient: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onBack?: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onConvertToClient,
  onDeleteLead,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiPitchModalLead, setAiPitchModalLead] = useState<Lead | null>(null);
  const [aiGeneratedEmail, setAiGeneratedEmail] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<Lead['source']>('Website');
  const [value, setValue] = useState('50000');
  const [status, setStatus] = useState<Lead['status']>('New');

  const pipelineStages: Lead['status'][] = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Won',
    'Lost',
  ];

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePitch = async (lead: Lead) => {
    setAiPitchModalLead(lead);
    setIsGeneratingEmail(true);
    setAiGeneratedEmail('Analyzing lead requirements and generating tailored proposal email...');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a high-converting, professional B2B cold email proposal to ${lead.name} from ${lead.company}. We are offering custom software engineering and digital transformation services with an estimated deal value of ৳ ${lead.value.toLocaleString()}. Keep it concise, friendly, and persuasive.`,
          context: { lead },
        }),
      });
      const data = await res.json();
      setAiGeneratedEmail(data.reply || 'Email proposal ready.');
    } catch (err) {
      setAiGeneratedEmail(
        `Subject: Tailored Digital Solutions for ${lead.company}\n\nHi ${lead.name},\n\nI noticed ${lead.company}'s recent growth initiatives. At BusinessPro, we specialize in high-performance web systems and digital platforms that reduce operational costs by up to 35%.\n\nWe would love to share a 15-minute concept walkthrough on how we can accelerate your targets.\n\nBest regards,\nAsiful Islam\nManaging Director, BusinessPro`
      );
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    onAddLead({
      name,
      company,
      email: email || 'contact@leadcompany.com',
      phone: phone || '+880 1700-000000',
      source,
      value: Number(value) || 40000,
      status,
      score: Math.floor(70 + Math.random() * 28),
    });

    setName('');
    setCompany('');
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
              <Target className="w-6 h-6 text-blue-600" />
              Leads & Sales Pipeline
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Qualify incoming prospects, generate AI outreach pitches, and convert leads to clients.
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-add-lead-modal"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, company, source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Potential Value:{' '}
          <span className="font-extrabold text-slate-900">
            ৳ {leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.status === stage);
          let stageColor = 'border-slate-200 bg-slate-50/60';
          if (stage === 'Qualified') stageColor = 'border-blue-200 bg-blue-50/30';
          if (stage === 'Proposal') stageColor = 'border-purple-200 bg-purple-50/30';
          if (stage === 'Won') stageColor = 'border-emerald-200 bg-emerald-50/30';

          return (
            <div
              key={stage}
              className={`p-3.5 rounded-2xl border ${stageColor} flex flex-col min-h-[460px]`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  {stage}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {lead.name}
                      </h4>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {lead.score}% Score
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{lead.company}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {lead.source}
                      </span>
                      <span className="font-extrabold text-blue-600">
                        ৳ {lead.value.toLocaleString()}
                      </span>
                    </div>

                    {/* AI Pitch Button */}
                    <button
                      type="button"
                      onClick={() => handleGeneratePitch(lead)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-semibold text-[11px] rounded-lg border border-blue-200/50 transition"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>AI Outreach Email</span>
                    </button>

                    {/* Convert or Move actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      {lead.status !== 'Won' ? (
                        <button
                          type="button"
                          onClick={() => onConvertToClient(lead)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                          title="Convert to Client"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Convert Client</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Won
                        </span>
                      )}

                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 font-medium"
                      >
                        {pipelineStages.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Cold Outreach Modal */}
      {aiPitchModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-base text-slate-900">
                  AI Cold Email Pitch: {aiPitchModalLead.company}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAiPitchModalLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl text-blue-800">
                Target: <strong>{aiPitchModalLead.name}</strong> ({aiPitchModalLead.email})
                • Deal Size: <strong>৳ {aiPitchModalLead.value.toLocaleString()}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Generated Proposal Content (Editable):
                </label>
                <textarea
                  rows={8}
                  value={aiGeneratedEmail}
                  onChange={(e) => setAiGeneratedEmail(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAiPitchModalLead(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiGeneratedEmail);
                    alert('Email draft copied to clipboard!');
                    setAiPitchModalLead(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Copy & Send Pitch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-900">Add New Lead</h2>
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
                  Prospect Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzul Alam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Textiles Ltd"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Website">Website</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Referral">Referral</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Deal (৳)
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
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
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
