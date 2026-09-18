import {
  Client,
  Project,
  Task,
  Ticket,
  Invoice,
  Payment,
  Expense,
  Lead,
  Contact,
  Agreement,
  Activity,
  User
} from './types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Asiful Islam',
    email: 'asifulcse22@gmail.com',
    role: 'admin',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director & Admin',
    department: 'Executive',
    phone: '+880 1712-345678',
    registeredAt: '2024-01-15'
  },
  {
    id: 'usr-2',
    name: 'Tanvir Ahmed',
    email: 'tanvir@businesspro.com',
    role: 'employee',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Frontend Engineer',
    department: 'Engineering',
    phone: '+880 1819-876543',
    registeredAt: '2024-02-01'
  },
  {
    id: 'usr-3',
    name: 'Sadia Khan',
    email: 'sadia@businesspro.com',
    role: 'employee',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Client Success Manager',
    department: 'Sales & Support',
    phone: '+880 1911-223344',
    registeredAt: '2024-03-10'
  }
];

// Clean slate: 0 demo data as requested by user
export const initialClients: Client[] = [];
export const initialProjects: Project[] = [];
export const initialTasks: Task[] = [];
export const initialTickets: Ticket[] = [];
export const initialInvoices: Invoice[] = [];
export const initialPayments: Payment[] = [];
export const initialExpenses: Expense[] = [];
export const initialLeads: Lead[] = [];
export const initialContacts: Contact[] = [];
export const initialAgreements: Agreement[] = [];
export const initialActivities: Activity[] = [];

// Clean 12-month zero template (updates dynamically when payments/expenses are added)
export const revenueExpenseChartData = [
  { month: 'Jan', revenue: 0, expense: 0 },
  { month: 'Feb', revenue: 0, expense: 0 },
  { month: 'Mar', revenue: 0, expense: 0 },
  { month: 'Apr', revenue: 0, expense: 0 },
  { month: 'May', revenue: 0, expense: 0 },
  { month: 'Jun', revenue: 0, expense: 0 },
  { month: 'Jul', revenue: 0, expense: 0 },
  { month: 'Aug', revenue: 0, expense: 0 },
  { month: 'Sep', revenue: 0, expense: 0 },
  { month: 'Oct', revenue: 0, expense: 0 },
  { month: 'Nov', revenue: 0, expense: 0 },
  { month: 'Dec', revenue: 0, expense: 0 }
];

export const leadsSourceChartData = [
  { name: 'Website', value: 0, percentage: '0%', color: '#3b82f6' },
  { name: 'Feedback', value: 0, percentage: '0%', color: '#06b6d4' },
  { name: 'Referral', value: 0, percentage: '0%', color: '#10b981' },
  { name: 'Instagram', value: 0, percentage: '0%', color: '#f59e0b' },
  { name: 'Other', value: 0, percentage: '0%', color: '#94a3b8' }
];
