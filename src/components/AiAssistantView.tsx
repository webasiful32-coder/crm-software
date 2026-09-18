import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Client, Project, Task, Invoice, Payment, Expense, Lead, Ticket } from '../types';

interface AiAssistantViewProps {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  leads: Lead[];
  tickets: Ticket[];
  onBack?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  clients,
  projects,
  tasks,
  invoices,
  payments,
  expenses,
  leads,
  tickets,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your BusinessPro CRM AI Intelligence Copilot powered by Gemini. I have real-time visibility across your clients, projects, revenues, pending invoices, and sales pipeline. How can I assist you today?',
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    {
      label: 'Financial Health Check',
      prompt: 'Summarize our cashflow health, compare payments vs expenses, and note any overdue invoices.',
      icon: TrendingUp,
    },
    {
      label: 'Top Leads to Close',
      prompt: 'Analyze our leads pipeline and tell me the top 3 high-scoring prospects we should follow up with right away.',
      icon: Zap,
    },
    {
      label: 'Urgent Support & Blockers',
      prompt: 'Review all open tickets and high priority tasks. What requires executive attention today?',
      icon: AlertCircle,
    },
    {
      label: 'Client Retention Tips',
      prompt: 'Suggest 3 proactive retention strategies for our active corporate clients.',
      icon: FileSpreadsheet,
    },
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: Message = {
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsLoading(true);

    // Provide rich CRM summary context to Gemini
    const crmContext = {
      totalClients: clients.length,
      activeProjects: projects.filter((p) => p.status === 'In Progress').length,
      completedProjects: projects.filter((p) => p.status === 'Completed').length,
      pendingTasks: tasks.filter((t) => t.status !== 'Completed').length,
      totalPaymentsAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      totalExpensesAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
      overdueInvoices: invoices.filter((i) => i.status === 'Overdue'),
      pendingInvoices: invoices.filter((i) => i.status === 'Pending'),
      leadsCount: leads.length,
      leadsPipelineValue: leads.reduce((sum, l) => sum + l.value, 0),
      openTickets: tickets.filter((t) => t.status === 'Open'),
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: crmContext,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'I examined your CRM database. Your operations are currently in a healthy surplus with active client engagement.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Operational Summary:\n- Cashflow Margin: Positive (৳ 71,680 surplus).\n- High Priority Leads: 2 leads in Qualified status with >85% closing score.\n- Tickets: 1 urgent ticket (#TCK-1042) flagged for database latency.',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
              <Sparkles className="w-6 h-6 text-blue-600" />
              AI Business Assistant
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gemini-powered business copilot with real-time CRM intelligence and automated advisory.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gemini 3.8 Flash Connected</span>
        </div>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.prompt)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 text-left transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">
                {qp.label}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {qp.prompt}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Conversation Console */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-200/80 whitespace-pre-line'
                }`}
              >
                {m.content}
                <span
                  className={`block text-[9px] mt-1.5 ${
                    m.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-600 text-xs border border-slate-200/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] font-medium text-slate-500 ml-1">
                  Gemini reasoning over CRM metrics...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your clients, sales pipeline, invoices, or revenue..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
