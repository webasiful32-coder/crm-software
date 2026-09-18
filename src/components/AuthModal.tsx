import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Shield,
  Briefcase,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  registeredUsers?: UserType[];
  onRegister?: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers = [],
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'Admin' | 'Employee'>('Admin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (demoEmail: string) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (found) {
      onLoginSuccess(found);
    } else {
      onLoginSuccess({
        id: 'usr-1',
        name: 'Asiful Islam',
        email: demoEmail,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Managing Director & Admin',
        department: 'Executive'
      });
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (mode === 'login') {
      const matched = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (!matched) {
        setError('No account found with this email.');
        return;
      }
      if (matched.password && matched.password !== password) {
        setError('Incorrect password. Default demo password is "password123".');
        return;
      }
      onLoginSuccess(matched);
      onClose();
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const existing = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        setError('This email is already registered.');
        return;
      }

      const newUser: UserType = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: trimmedEmail,
        role: (role.toLowerCase() === 'admin' ? 'admin' : 'employee'),
        password,
        avatar: role === 'Admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: role === 'Admin' ? 'Business Administrator' : 'Staff Member',
        department: role === 'Admin' ? 'Management' : 'Operations',
        registeredAt: new Date().toISOString().split('T')[0]
      };

      if (onRegister) {
        onRegister(newUser);
      }
      onLoginSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                {mode === 'login' ? 'Sign In to CRM' : 'Create Staff Account'}
              </h2>
              <p className="text-[11px] text-slate-500">BusinessPro Enterprise Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
            ⚡ 1-Click Quick Demo Sign In:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('asifulcse22@gmail.com')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold hover:border-blue-500 hover:text-blue-600 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('tanvir@businesspro.com')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold hover:border-blue-500 hover:text-blue-600 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              <span>Employee Login</span>
            </button>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'login' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'register' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Asiful Islam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="asifulcse22@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Admin">Administrator (Full Access)</option>
              <option value="Employee">Employee (Staff Access)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
