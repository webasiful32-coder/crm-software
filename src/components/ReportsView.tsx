import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  PieChart as PieIcon,
  Printer,
  ArrowLeft
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { revenueExpenseChartData, leadsSourceChartData } from '../mockData';
import { Client, Project, Invoice, Payment, Expense, Lead } from '../types';

interface ReportsViewProps {
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  leads: Lead[];
  onBack?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients,
  projects,
  invoices,
  payments,
  expenses,
  leads,
  onBack,
}) => {
  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Revenue,Expense\n' +
      revenueExpenseChartData.map((d) => `${d.month},${d.revenue},${d.expense}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'crm_financial_report_2025.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Executive Reports & Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive business intelligence, profit margins, and monthly fiscal breakdown.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Gross Collections</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1.5">
            ৳ {totalIncome.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            ↑ 22% from last quarter
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Operational Burn</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1.5">
            ৳ {totalExpense.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
            Controlled overheads
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Net Profit Margin</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1.5">{margin}%</div>
          <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
            ৳ {netProfit.toLocaleString()} Net Gain
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Active Pipeline Value</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1.5">
            ৳ {leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
            Across {leads.length} qualified prospects
          </span>
        </div>
      </div>

      {/* Recharts Bar Comparison Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Monthly Revenue vs. Expense Comparison (BDT)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              12-Month Audited Fiscal Cycle
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            FY 2025
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueExpenseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `৳${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Revenue Inflow" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Operational Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Monthly Fiscal Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Fiscal Ledger Table</h3>
          <span className="text-xs text-slate-400">All amounts in Bangladeshi Taka (৳)</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <th className="py-3 px-4">Month</th>
              <th className="py-3 px-4 text-right">Revenue</th>
              <th className="py-3 px-4 text-right">Expenses</th>
              <th className="py-3 px-4 text-right">Net Profit</th>
              <th className="py-3 px-4 text-right">Operating Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {revenueExpenseChartData.map((row) => {
              const net = row.revenue - row.expense;
              const pct = Math.round((net / row.revenue) * 100);
              return (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.month} 2025</td>
                  <td className="py-3 px-4 text-right font-extrabold text-blue-600">
                    ৳ {row.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-rose-600">
                    ৳ {row.expense.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                    ৳ {net.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-600">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
