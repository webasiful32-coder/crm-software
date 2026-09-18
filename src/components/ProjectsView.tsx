import React, { useState } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  Calendar,
  DollarSign,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
  X,
  Sliders,
  Trash2,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';
import { Project, Client } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  clients: Client[];
  onAddProject: (project: Omit<Project, 'id'>, generatedTasks?: string[]) => void;
  onUpdateProjectProgress: (id: string, progress: number, status: Project['status']) => void;
  onDeleteProject: (id: string) => void;
  onBack?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  clients,
  onAddProject,
  onUpdateProjectProgress,
  onDeleteProject,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal Form State
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.name || 'ABC Company');
  const [budget, setBudget] = useState('75000');
  const [dueDate, setDueDate] = useState('30 Dec 2025');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [description, setDescription] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState<any[]>([]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleGenerateAITasks = async () => {
    if (!name) return;
    setIsGeneratingTasks(true);
    try {
      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: name,
          description: description || 'Deliver modern responsive application for client',
        }),
      });
      const data = await res.json();
      if (data.tasks) {
        setAiGeneratedTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
      setAiGeneratedTasks([
        { title: 'Project scope review & client sign-off', priority: 'High' },
        { title: 'UX wireframe architecture', priority: 'High' },
        { title: 'Core UI component development', priority: 'Medium' },
        { title: 'Quality Assurance & UAT test pass', priority: 'High' },
      ]);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const taskTitles = aiGeneratedTasks.map((t) => t.title);

    onAddProject(
      {
        name,
        clientName,
        status: 'In Progress',
        progress: 0,
        dueDate: dueDate || '25 Dec 2025',
        budget: Number(budget) || 50000,
        priority,
        description,
      },
      taskTitles.length > 0 ? taskTitles : undefined
    );

    setName('');
    setDescription('');
    setAiGeneratedTasks([]);
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
              <FolderArchive className="w-6 h-6 text-blue-600" />
              Projects Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track milestones, deliverables, budgets, and automated task breakdowns.
            </p>
          </div>
        </div>
        <button
          type="button"
          id="btn-add-project-modal"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {['all', 'In Progress', 'Pending', 'Completed', 'On Hold'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((proj) => {
          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {proj.clientName}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-2">
                      {proj.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : proj.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : proj.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                {proj.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {/* Progress Bar & Slider */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Completion</span>
                    <span className="font-bold text-slate-900">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.progress === 100
                          ? 'bg-emerald-500'
                          : proj.progress > 50
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  {/* Interactive Quick Slider */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={proj.progress}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const nextStatus =
                          val === 100 ? 'Completed' : val === 0 ? 'Pending' : 'In Progress';
                        onUpdateProjectProgress(proj.id, val, nextStatus);
                      }}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Project Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {proj.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold bg-slate-50 p-2 rounded-xl">
                    <span className="text-blue-600">৳</span>
                    <span>{proj.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Priority:
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      proj.priority === 'High'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {proj.priority}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <FolderArchive className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm ? 'No projects match your search criteria.' : 'You have no active projects yet. Create your first project to start organizing tasks.'}
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg text-slate-900">Create New Project</h2>
              </div>
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
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Analytics Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client *
                  </label>
                  <select
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Budget (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20 Dec 2025"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scope & Deliverable Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe core project outcomes, technical requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* AI Auto Task Breakdown Feature */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Gemini AI Task Breakdown</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAITasks}
                    disabled={!name || isGeneratingTasks}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] disabled:opacity-50 transition"
                  >
                    {isGeneratingTasks ? 'Generating...' : 'Auto-Generate Tasks'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Generate milestone tasks automatically using Gemini AI model based on your project name and description.
                </p>

                {aiGeneratedTasks.length > 0 && (
                  <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
                    {aiGeneratedTasks.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-white border border-blue-100 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-medium text-slate-800">{t.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                          {t.priority || 'High'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
