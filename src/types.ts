export type UserRole = 'admin' | 'employee' | 'Admin' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  department?: string;
  password?: string;
  phone?: string;
  registeredAt?: string;
}

export type UserProfile = User;

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Lead';
  totalBilled: number;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'On Hold';
  progress: number;
  dueDate: string;
  budget: number;
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
  assignedTo?: string[];
}

export interface Task {
  id: string;
  title: string;
  projectName: string;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

export interface Ticket {
  id: string;
  code: string;
  subject: string;
  clientName: string;
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  lastReply: string;
  description: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNo: string;
  clientName: string;
  amount: number;
  method: 'Bank Transfer' | 'bKash' | 'Nagad' | 'Stripe' | 'Cash';
  date: string;
  status: 'Completed' | 'Pending';
  reference?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Office' | 'Software' | 'Payroll' | 'Marketing' | 'Hosting' | 'Misc';
  amount: number;
  date: string;
  status: 'Approved' | 'Pending';
  recordedBy: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'Feedback' | 'Referral' | 'Instagram' | 'Other';
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
  score: number;
  assignedTo?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  category: 'Customer' | 'Vendor' | 'Partner' | 'Lead';
}

export interface Agreement {
  id: string;
  title: string;
  clientName: string;
  type?: 'NDA' | 'Service Agreement' | 'Proposal' | 'Maintenance' | 'Retainer';
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired' | 'Pending Signature';
  value: number;
  validUntil?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  signedDate?: string;
  contentSummary?: string;
}

export interface Activity {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'lead' | 'invoice' | 'project' | 'ticket' | 'payment';
}

export type CRMView =
  | 'dashboard'
  | 'clients'
  | 'leads'
  | 'contacts'
  | 'projects'
  | 'tickets'
  | 'services'
  | 'invoices'
  | 'items'
  | 'tasks'
  | 'agreements'
  | 'payments'
  | 'expenses'
  | 'reports'
  | 'ai-assistant'
  | 'settings';
