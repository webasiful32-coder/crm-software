import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { TicketsView } from './components/TicketsView';
import { InvoicesView } from './components/InvoicesView';
import { FinanceView } from './components/FinanceView';
import { LeadsView } from './components/LeadsView';
import { ContactsView } from './components/ContactsView';
import { AgreementsView } from './components/AgreementsView';
import { ReportsView } from './components/ReportsView';
import { AiAssistantView } from './components/AiAssistantView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { SearchModal } from './components/SearchModal';
import {
  fetchDatabaseState,
  syncUserToDatabase,
  syncCollectionToDatabase,
} from './services/dbApi';

import {
  CRMView,
  User,
  Client,
  Project,
  Task,
  Ticket,
  Invoice,
  Payment,
  Expense,
  Lead,
  Contact as ContactType,
  Agreement,
  Activity
} from './types';

import {
  initialUsers,
  initialClients,
  initialProjects,
  initialTasks,
  initialTickets,
  initialInvoices,
  initialPayments,
  initialExpenses,
  initialLeads,
  initialContacts,
  initialAgreements,
  initialActivities
} from './mockData';

export default function App() {
  const [activeView, setActiveView] = useState<CRMView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database sync state & indicator
  const [dbSource, setDbSource] = useState<'neon' | 'server-file'>('server-file');
  const [dbLoaded, setDbLoaded] = useState(false);

  // Registered accounts (persisted in Database)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(initialUsers);

  // Current logged in user (in-memory state)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Core CRM Data Collections (loaded & synced with database)
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [contacts, setContacts] = useState<ContactType[]>(initialContacts);
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // Initial load from PostgreSQL / Server Database
  useEffect(() => {
    async function loadData() {
      const state = await fetchDatabaseState();
      if (state) {
        setDbSource(state.source);
        if (state.users && state.users.length > 0) {
          // Merge with initial users to ensure default admin is always accessible
          const emailMap = new Set(state.users.map((u) => u.email.toLowerCase()));
          const merged = [...state.users];
          for (const initU of initialUsers) {
            if (!emailMap.has(initU.email.toLowerCase())) {
              merged.push(initU);
            }
          }
          setRegisteredUsers(merged);
        }
        if (state.clients && state.clients.length > 0) setClients(state.clients);
        if (state.projects && state.projects.length > 0) setProjects(state.projects);
        if (state.tasks && state.tasks.length > 0) setTasks(state.tasks);
        if (state.tickets && state.tickets.length > 0) setTickets(state.tickets);
        if (state.invoices && state.invoices.length > 0) setInvoices(state.invoices);
        if (state.payments && state.payments.length > 0) setPayments(state.payments);
        if (state.expenses && state.expenses.length > 0) setExpenses(state.expenses);
        if (state.leads && state.leads.length > 0) setLeads(state.leads);
        if (state.contacts && state.contacts.length > 0) setContacts(state.contacts);
        if (state.agreements && state.agreements.length > 0) setAgreements(state.agreements);
        if (state.activities && state.activities.length > 0) setActivities(state.activities);
      }
      setDbLoaded(true);
    }
    loadData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'User logged in',
        detail: `${user.name} (${user.role}) authenticated`,
        time: 'Just now',
        type: 'project',
      },
      ...prev,
    ]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const handleRegister = async (newUser: User) => {
    setRegisteredUsers((prev) => [newUser, ...prev]);
    // Save to Neon / server database
    await syncUserToDatabase(newUser);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'New user registered',
        detail: `${newUser.name} created account in database with role ${newUser.role}`,
        time: 'Just now',
        type: 'lead',
      },
      ...prev,
    ]);
  };

  // Auto-sync collections to PostgreSQL / Database whenever they are mutated
  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('clients', clients);
  }, [clients, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('projects', projects);
  }, [projects, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('tasks', tasks);
  }, [tasks, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('tickets', tickets);
  }, [tickets, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('invoices', invoices);
  }, [invoices, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('payments', payments);
  }, [payments, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('expenses', expenses);
  }, [expenses, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('leads', leads);
  }, [leads, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('contacts', contacts);
  }, [contacts, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('agreements', agreements);
  }, [agreements, dbLoaded]);

  useEffect(() => {
    if (!dbLoaded) return;
    syncCollectionToDatabase('activities', activities);
  }, [activities, dbLoaded]);

  // Keyboard shortcut for global search (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Handlers: Clients ---
  const handleAddClient = (newClient: Omit<Client, 'id' | 'createdAt'>) => {
    const created: Client = {
      ...newClient,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'New client onboarded',
        detail: created.name,
        time: 'Just now',
        type: 'lead',
      },
      ...prev,
    ]);
  };

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // --- Handlers: Projects ---
  const handleAddProject = (
    newProject: Omit<Project, 'id'>,
    generatedTasks?: string[]
  ) => {
    const createdProject: Project = {
      ...newProject,
      id: `prj-${Date.now()}`,
    };
    setProjects((prev) => [createdProject, ...prev]);

    // If Gemini automatically drafted milestone tasks, inject them into Tasks list!
    if (generatedTasks && generatedTasks.length > 0) {
      const newTasks: Task[] = generatedTasks.map((title, idx) => ({
        id: `tsk-${Date.now()}-${idx}`,
        title,
        projectName: createdProject.name,
        assignee: currentUser?.name || 'Assigned Lead',
        status: 'Todo',
        priority: 'High',
        dueDate: createdProject.dueDate,
      }));
      setTasks((prev) => [...newTasks, ...prev]);
    }

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Project initiated',
        detail: createdProject.name,
        time: 'Just now',
        type: 'project',
      },
      ...prev,
    ]);
  };

  const handleUpdateProjectProgress = (
    id: string,
    progress: number,
    status: Project['status']
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress, status } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Handlers: Tasks ---
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const created: Task = { ...newTask, id: `tsk-${Date.now()}` };
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Handlers: Tickets ---
  const handleAddTicket = (
    newTicket: Omit<Ticket, 'id' | 'createdAt' | 'lastReply'>
  ) => {
    const created: Ticket = {
      ...newTicket,
      id: `tck-${Date.now()}`,
      createdAt: 'Just now',
      lastReply: currentUser?.name || 'Support Agent',
    };
    setTickets((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'New support ticket',
        detail: created.subject,
        time: 'Just now',
        type: 'ticket',
      },
      ...prev,
    ]);
  };

  const handleUpdateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Handlers: Invoices ---
  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    const created: Invoice = { ...newInvoice, id: `inv-${Date.now()}` };
    setInvoices((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Invoice generated',
        detail: `${created.invoiceNumber} (৳ ${created.amount.toLocaleString()})`,
        time: 'Just now',
        type: 'invoice',
      },
      ...prev,
    ]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  // --- Handlers: Payments & Expenses ---
  const handleAddPayment = (newPay: Omit<Payment, 'id'>) => {
    const created: Payment = { ...newPay, id: `pay-${Date.now()}` };
    setPayments((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Payment settlement',
        detail: `৳ ${created.amount.toLocaleString()} from ${created.clientName}`,
        time: 'Just now',
        type: 'payment',
      },
      ...prev,
    ]);
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const created: Expense = { ...newExp, id: `exp-${Date.now()}` };
    setExpenses((prev) => [created, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Handlers: Leads ---
  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdAt'>) => {
    const created: Lead = {
      ...newLead,
      id: `led-${Date.now()}`,
      createdAt: 'Just now',
    };
    setLeads((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'New prospect qualified',
        detail: `${created.name} (${created.company})`,
        time: 'Just now',
        type: 'lead',
      },
      ...prev,
    ]);
  };

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const handleConvertToClient = (lead: Lead) => {
    handleAddClient({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: 'Dhaka, Bangladesh',
      status: 'Active',
      totalBilled: lead.value,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    });
    handleUpdateLeadStatus(lead.id, 'Won');
    setActiveView('clients');
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // --- Handlers: Contacts ---
  const handleAddContact = (newContact: Omit<ContactType, 'id'>) => {
    const created: ContactType = { ...newContact, id: `cnt-${Date.now()}` };
    setContacts((prev) => [created, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // --- Handlers: Agreements ---
  const handleAddAgreement = (newAgr: Omit<Agreement, 'id'>) => {
    const created: Agreement = { ...newAgr, id: `agr-${Date.now()}` };
    setAgreements((prev) => [created, ...prev]);
  };

  const handleUpdateAgreementStatus = (id: string, status: Agreement['status']) => {
    setAgreements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAgreement = (id: string) => {
    setAgreements((prev) => prev.filter((a) => a.id !== id));
  };

  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        registeredUsers={registeredUsers}
        onRegister={handleRegister}
      />
    );
  }

  const currentRoleNormalized: 'Admin' | 'Employee' =
    currentUser.role.toLowerCase() === 'admin' ? 'Admin' : 'Employee';

  return (
    <div className="flex h-screen bg-[#f4f7fe] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchUser={(u) => handleLogin(u)}
          availableUsers={registeredUsers}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setActiveView('settings')}
          onOpenAIAssistant={() => setActiveView('ai-assistant')}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          unreadCount={tickets.filter((t) => t.status === 'Open').length}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          activeView={activeView}
          onBack={() => setActiveView('dashboard')}
          dbSource={dbSource}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                projects={projects}
                activities={activities}
                clients={clients}
                invoices={invoices}
                payments={payments}
                expenses={expenses}
                leads={leads}
                tasks={tasks}
                tickets={tickets}
                onNavigate={(v) => setActiveView(v)}
                onCreateProject={() => setActiveView('projects')}
                onOpenQuickAction={(act) => {
                  if (act === 'new-invoice') setActiveView('invoices');
                  if (act === 'record-payment') setActiveView('payments');
                  if (act === 'new-lead') setActiveView('leads');
                }}
                onOpenAIAssistant={() => setActiveView('ai-assistant')}
                userName={currentUser.name}
              />
            )}

            {activeView === 'clients' && (
              <ClientsView
                clients={clients}
                projects={projects}
                invoices={invoices}
                onAddClient={handleAddClient}
                onDeleteClient={handleDeleteClient}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'projects' && (
              <ProjectsView
                projects={projects}
                clients={clients}
                onAddProject={handleAddProject}
                onUpdateProjectProgress={handleUpdateProjectProgress}
                onDeleteProject={handleDeleteProject}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'tasks' && (
              <TasksView
                tasks={tasks}
                projects={projects}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'tickets' && (
              <TicketsView
                tickets={tickets}
                clients={clients}
                onAddTicket={handleAddTicket}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onDeleteTicket={handleDeleteTicket}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'invoices' && (
              <InvoicesView
                invoices={invoices}
                clients={clients}
                onAddInvoice={handleAddInvoice}
                onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                onDeleteInvoice={handleDeleteInvoice}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {(activeView === 'payments' || activeView === 'expenses') && (
              <FinanceView
                payments={payments}
                expenses={expenses}
                clients={clients}
                onAddPayment={handleAddPayment}
                onAddExpense={handleAddExpense}
                onDeletePayment={handleDeletePayment}
                onDeleteExpense={handleDeleteExpense}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'leads' && (
              <LeadsView
                leads={leads}
                onAddLead={handleAddLead}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onConvertToClient={handleConvertToClient}
                onDeleteLead={handleDeleteLead}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'contacts' && (
              <ContactsView
                contacts={contacts}
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'agreements' && (
              <AgreementsView
                agreements={agreements}
                clients={clients}
                onAddAgreement={handleAddAgreement}
                onUpdateAgreementStatus={handleUpdateAgreementStatus}
                onDeleteAgreement={handleDeleteAgreement}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'reports' && (
              <ReportsView
                clients={clients}
                projects={projects}
                invoices={invoices}
                payments={payments}
                expenses={expenses}
                leads={leads}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'ai-assistant' && (
              <AiAssistantView
                clients={clients}
                projects={projects}
                tasks={tasks}
                invoices={invoices}
                payments={payments}
                expenses={expenses}
                leads={leads}
                tickets={tickets}
                onBack={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'settings' && (
              <SettingsView
                currentRole={currentRoleNormalized}
                onBack={() => setActiveView('dashboard')}
                dbSource={dbSource}
              />
            )}

            {/* Fallbacks for sub-items like services / items */}
            {(activeView === 'services' || activeView === 'items') && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold text-xl">
                  ৳
                </div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">
                  {activeView} Catalog
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Standard product packages, software subscriptions, and hourly service rates are linked directly to the Invoicing and Projects modules.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveView('dashboard')}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('invoices')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
                  >
                    Go to Invoices & Billing
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          handleLogin(user);
        }}
        registeredUsers={registeredUsers}
        onRegister={handleRegister}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={(v) => setActiveView(v)}
        clients={clients}
        projects={projects}
        tasks={tasks}
        tickets={tickets}
        invoices={invoices}
        leads={leads}
        contacts={contacts}
      />
    </div>
  );
}
