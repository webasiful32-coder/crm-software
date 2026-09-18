import React from 'react';
import {
  FolderArchive,
  Receipt,
  CreditCard,
  ReceiptText,
  TrendingUp,
  Clock,
  Wallet,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  MoreVertical,
  Users,
  Target,
  Sparkles,
  Bot,
  ExternalLink,
  ArrowUpRight,
  CheckSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Project,
  Activity,
  CRMView,
  Client,
  Invoice,
  Payment,
  Expense,
  Lead,
  Task,
  Ticket
} from '../types';

interface DashboardViewProps {
  projects: Project[];
  activities: Activity[];
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  leads: Lead[];
  tasks: Task[];
  tickets: Ticket[];
  onNavigate: (view: CRMView) => void;
  onCreateProject: () => void;
  onOpenQuickAction: (action: string) => void;
  onOpenAIAssistant: () => void;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  activities,
  clients,
  invoices,
  payments,
  expenses,
  leads,
  tasks,
  tickets,
  onNavigate,
  onCreateProject,
  onOpenQuickAction,
  onOpenAIAssistant,
  userName = 'Asiful',
}) => {
  // Dynamic financial totals
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalPayments = totalRevenue;

  // Dynamic monthly chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dynamicChartData = months.map((m, idx) => {
    // Map payments and expenses to months based on date string if available
    const monthPayments = payments.filter((p) => {
      if (!p.date) return false;
      const d = new Date(p.date);
      return !isNaN(d.getTime()) && d.getMonth() === idx;
    });
    const monthExpenses = expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return !isNaN(d.getTime()) && d.getMonth() === idx;
    });

    const rev = monthPayments.reduce((s, p) => s + p.amount, 0);
    const exp = monthExpenses.reduce((s, e) => s + e.amount, 0);

    return {
      month: m,
      revenue: rev,
      expense: exp,
    };
  });

  const hasChartData = payments.length > 0 || expenses.length > 0;

  // Dynamic Leads by Source Donut
  const leadSources: Lead['source'][] = ['Website', 'Feedback', 'Referral', 'Instagram', 'Other'];
  const leadColors: Record<string, string> = {
    Website: '#3b82f6',
    Feedback: '#06b6d4',
    Referral: '#10b981',
    Instagram: '#f59e0b',
    Other: '#94a3b8',
  };

  const totalLeadsCount = leads.length;
  const dynamicLeadsSource = leadSources.map((src) => {
    const count = leads.filter((l) => l.source === src).length;
    const percentage = totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0;
    return {
      name: src,
      value: count,
      percentage: `${percentage}%`,
      color: leadColors[src] || '#94a3b8',
    };
  });

  // Task statistics
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const taskProgressPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER & 4 QUICK STATS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Hero Welcome Banner */}
        <div className="xl:col-span-8 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/60 rounded-3xl p-6 sm:p-7 border border-blue-100/80 flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div className="z-10 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {userName}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-normal">
              Here's an overview of your business performance today.
            </p>
            <div className="mt-6">
              <button
                type="button"
                id="btn-hero-create-project"
                onClick={onCreateProject}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>
          </div>

          {/* Right Vector Illustration */}
          <div className="hidden sm:block absolute right-4 -bottom-1 w-64 md:w-80 pointer-events-none select-none opacity-95">
            <svg
              viewBox="0 0 400 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto drop-shadow-sm"
            >
              <rect x="260" y="30" width="70" height="48" rx="8" fill="#e0e7ff" />
              <rect x="270" y="42" width="50" height="6" rx="3" fill="#6366f1" />
              <rect x="270" y="54" width="30" height="5" rx="2.5" fill="#a5b4fc" />
              <rect x="270" y="64" width="40" height="5" rx="2.5" fill="#c7d2fe" />
              <ellipse cx="200" cy="225" rx="140" ry="12" fill="#e2e8f0" />
              <path d="M70 215 L330 215" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
              <rect x="140" y="165" width="80" height="50" rx="4" fill="#3b82f6" />
              <path d="M120 215 L240 215" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right 4 Quick Mini Cards */}
        <div className="xl:col-span-4 grid grid-cols-2 gap-3.5">
          {/* Projects Card */}
          <div
            id="quick-stat-projects"
            onClick={() => onNavigate('projects')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FolderArchive className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-500 font-medium">Projects</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {projects.length}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <span>{projects.filter((p) => p.status === 'In Progress').length} in progress</span>
              </div>
            </div>
          </div>

          {/* Invoices Card */}
          <div
            id="quick-stat-invoices"
            onClick={() => onNavigate('invoices')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-500 font-medium">Invoices</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {invoices.length}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <span>{invoices.filter((i) => i.status === 'Paid').length} paid</span>
              </div>
            </div>
          </div>

          {/* Payments Card */}
          <div
            id="quick-stat-payments"
            onClick={() => onNavigate('payments')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-500 font-medium">Payments</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {payments.length}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <span>{payments.length} settlements</span>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div
            id="quick-stat-expenses"
            onClick={() => onNavigate('expenses')}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <ReceiptText className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-500 font-medium">Expenses</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {expenses.length}
              </div>
              <div className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                <span>{expenses.length} entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 MAIN KPI CARDS (Computed from actual data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                ৳ {totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500 gap-1">
            <span>From {payments.length} received payments</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Expenses</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                ৳ {totalExpenses.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500 gap-1">
            <span>From {expenses.length} operating bills</span>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PiggyBank className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Net Profit</span>
              <div
                className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                  totalProfit >= 0 ? 'text-slate-900' : 'text-rose-600'
                }`}
              >
                ৳ {totalProfit.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500 gap-1">
            <span>Net cash balance</span>
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Settled Payments</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                ৳ {totalPayments.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500 gap-1">
            <span>{invoices.filter((i) => i.status === 'Pending').length} pending invoices</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: REVENUE & EXPENSE OVERVIEW + LEADS BY SOURCE + MINI METRIC STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Dual Spline / Area Chart */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h2 className="font-bold text-base text-slate-900">
                Revenue & Expense Overview
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly trajectory for fiscal ledger
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                <span className="text-slate-600">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dynamicChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => (val > 0 ? `৳ ${val / 1000}k` : '৳0')}
                />
                <Tooltip
                  formatter={(value: any) => [`৳ ${Number(value).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
            {!hasChartData && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/40">
                <span className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  No transaction data yet — record payments or expenses to visualize
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Leads by Source Donut Chart */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-bold text-base text-slate-900">Leads by Source</h2>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Details →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            {/* Donut Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalLeadsCount > 0 ? dynamicLeadsSource : [{ name: 'None', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={totalLeadsCount > 0 ? 4 : 0}
                    dataKey="value"
                  >
                    {totalLeadsCount > 0 ? (
                      dynamicLeadsSource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    ) : (
                      <Cell fill="#e2e8f0" />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      totalLeadsCount > 0 ? `${val} leads` : '0 leads',
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900">
                  {totalLeadsCount}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Total Leads
                </span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 w-full sm:w-auto text-xs font-medium">
              {dynamicLeadsSource.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {item.value}{' '}
                    <span className="text-slate-400 font-normal">({item.percentage})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Stack: Total Revenue & Task Report */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Mini Revenue Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-extrabold text-slate-900">
                ৳ {totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              {payments.length === 0 ? 'No payments recorded yet' : `${payments.length} transactions processed`}
            </div>
          </div>

          {/* Task Report Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Task Report</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                {tasks.length} Total
              </span>
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-800">
                {completedTasks} of {tasks.length} completed
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {tasks.length === 0 ? 'No active tasks in system' : 'Ongoing sprint status'}
              </p>
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${taskProgressPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium">
                <span>Progress: {taskProgressPct}%</span>
                <span>{tasks.filter((t) => t.status !== 'Completed').length} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: RECENT PROJECTS TABLE, RECENT ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Recent Projects Table */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">Recent Projects</h2>
              <p className="text-xs text-slate-400">Active project milestones & status</p>
            </div>
            <button
              type="button"
              id="btn-view-all-projects"
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="py-3 px-4 w-10">#</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 min-w-[120px]">Progress</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-3 w-8 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderArchive className="w-7 h-7 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No projects created yet</p>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Click &ldquo;Create New Project&rdquo; to add your first project milestone.
                        </p>
                        <button
                          type="button"
                          onClick={onCreateProject}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Project</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.slice(0, 5).map((project, idx) => (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onNavigate('projects')}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {project.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {project.clientName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 shrink-0">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {project.dueDate}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Recent Activity</h2>
              <span className="text-xs text-slate-400">{activities.length} entries</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs mt-1 flex-1 flex flex-col justify-center">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 text-xs">No recent activity recorded yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Your actions across clients, projects, and invoices will show here in real time.
                  </p>
                </div>
              ) : (
                activities.map((act) => {
                  let iconColor = 'bg-blue-50 text-blue-600';
                  let Icon = Users;
                  if (act.type === 'lead') {
                    iconColor = 'bg-emerald-50 text-emerald-600';
                    Icon = Target;
                  } else if (act.type === 'invoice') {
                    iconColor = 'bg-blue-50 text-blue-600';
                    Icon = Receipt;
                  } else if (act.type === 'project') {
                    iconColor = 'bg-purple-50 text-purple-600';
                    Icon = FolderArchive;
                  } else if (act.type === 'ticket') {
                    iconColor = 'bg-rose-50 text-rose-600';
                    Icon = AlertCircle;
                  } else if (act.type === 'payment') {
                    iconColor = 'bg-amber-50 text-amber-600';
                    Icon = CreditCard;
                  }

                  return (
                    <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{act.title}</p>
                          <p className="text-slate-500 text-[11px] truncate">{act.detail}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                        {act.time}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK ACTIONS & AI SALES INSIGHTS BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 6 Quick Action Buttons */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h2 className="font-bold text-base text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              type="button"
              id="action-add-client"
              onClick={() => onOpenQuickAction('client')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 font-semibold text-xs border border-blue-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="truncate">Add Client</span>
            </button>

            <button
              type="button"
              id="action-create-project"
              onClick={() => onOpenQuickAction('project')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 font-semibold text-xs border border-purple-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                <FolderArchive className="w-4 h-4" />
              </div>
              <span className="truncate">Create Project</span>
            </button>

            <button
              type="button"
              id="action-add-invoice"
              onClick={() => onOpenQuickAction('invoice')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 font-semibold text-xs border border-emerald-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="truncate">Add Invoice</span>
            </button>

            <button
              type="button"
              id="action-add-payment"
              onClick={() => onOpenQuickAction('payment')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 text-amber-800 font-semibold text-xs border border-amber-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="truncate">Add Payment</span>
            </button>

            <button
              type="button"
              id="action-create-lead"
              onClick={() => onOpenQuickAction('lead')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/80 hover:bg-rose-100/80 text-rose-700 font-semibold text-xs border border-rose-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <span className="truncate">Create Lead</span>
            </button>

            <button
              type="button"
              id="action-new-task"
              onClick={() => onOpenQuickAction('task')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50/80 hover:bg-teal-100/80 text-teal-700 font-semibold text-xs border border-teal-100 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="truncate">New Task</span>
            </button>
          </div>
        </div>

        {/* AI Sales Insights Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-blue-50/90 rounded-2xl p-5 border border-indigo-100/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Sales Insights</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xs">
              Get intelligent insights ahead of your pipeline, lead conversion rates, and sales performance.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              id="btn-view-ai-insights"
              onClick={onOpenAIAssistant}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <span>View Insights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xs border border-indigo-200/60 shadow-md flex items-center justify-center p-2">
              <Bot className="w-9 h-9 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM AI ASSISTANT PROMPT BAR */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md shadow-blue-500/20">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">AI Assistant</h3>
            <p className="text-xs text-blue-100">
              Get smart insights, generate work, analyze contracts, and more with AI.
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-bottom-open-ai"
          onClick={onOpenAIAssistant}
          className="px-5 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs shrink-0 shadow-sm transition-all cursor-pointer"
        >
          Open AI Assistant →
        </button>
      </div>
    </div>
  );
};
