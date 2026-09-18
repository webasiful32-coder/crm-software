// API service for interacting with PostgreSQL / Neon database backend
import { User, Client, Project, Task, Ticket, Invoice, Payment, Expense, Lead, Contact, Agreement, Activity } from '../types';

export interface DatabaseState {
  source: 'neon' | 'server-file';
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  tickets: Ticket[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  leads: Lead[];
  contacts: Contact[];
  agreements: Agreement[];
  activities: Activity[];
}

export async function fetchDatabaseState(): Promise<DatabaseState | null> {
  try {
    const res = await fetch('/api/db/state');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch database state from server, using local fallback:', err);
    return null;
  }
}

export async function syncUserToDatabase(user: User): Promise<boolean> {
  try {
    const res = await fetch('/api/db/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync user to database:', err);
    return false;
  }
}

export async function syncCollectionToDatabase<T>(key: string, data: T[]): Promise<boolean> {
  try {
    const res = await fetch(`/api/db/collection/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch (err) {
    console.error(`Failed to sync collection ${key} to database:`, err);
    return false;
  }
}

export async function checkServerHealth(): Promise<{ status: string; neonConnected: boolean } | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
