import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles,
  Command,
  X,
  ArrowLeft,
  UserPlus,
  Database
} from 'lucide-react';
import { User, CRMView } from '../types';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  availableUsers: User[];
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenAIAssistant: () => void;
  onOpenSearch: () => void;
  unreadCount?: number;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
  activeView?: CRMView;
  onBack?: () => void;
  dbSource?: 'neon' | 'server-file';
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  availableUsers,
  onToggleSidebar,
  onOpenSettings,
  onOpenAIAssistant,
  onOpenSearch,
  unreadCount = 3,
  onOpenAuthModal,
  onLogout,
  activeView,
  onBack,
  dbSource = 'server-file',
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle, Back Button & Search Bar */}
      <div className="flex items-center gap-2.5 flex-1 max-w-lg">
        <button
          type="button"
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeView && activeView !== 'dashboard' && onBack && (
          <button
            type="button"
            id="btn-header-back"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors shrink-0 shadow-2xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Global Search Bar (Matching image: Search anything... (Ctrl + K)) */}
        <div
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 rounded-xl text-slate-400 text-sm cursor-pointer transition-colors border border-transparent hover:border-slate-200"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate flex-1 text-slate-500">
            Search anything... (Ctrl + K)
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right Side: Quick Tools, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Database Status Pill */}
        <button
          type="button"
          id="btn-db-status"
          onClick={onOpenSettings}
          title={dbSource === 'neon' ? 'Connected to Neon PostgreSQL' : 'Server Database Active (Local Storage Removed)'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-700"
        >
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden lg:inline text-[11px] font-medium">DB:</span>
          <span className="text-[11px] font-bold text-slate-900">
            {dbSource === 'neon' ? 'Neon Postgres' : 'PostgreSQL DB'}
          </span>
          <span className={`w-2 h-2 rounded-full ${dbSource === 'neon' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
        </button>

        {/* Quick AI Trigger */}
        <button
          type="button"
          id="btn-quick-ai"
          onClick={onOpenAIAssistant}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200/60"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Ask AI</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>New Payment Received</span>
                    <span className="text-[10px] text-slate-400">8h ago</span>
                  </div>
                  <p className="text-slate-600">XYZ Ltd settled ৳ 30,000 via Bank Wire.</p>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>New Ticket #TCK-1042</span>
                    <span className="text-[10px] text-slate-400">6h ago</span>
                  </div>
                  <p className="text-slate-600">ABC Company reported Social SSO callback bug.</p>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Lead Score High</span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-slate-600">Website Reload reached 88% qualification score.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          type="button"
          id="btn-header-settings"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="CRM Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Pill */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            id="btn-user-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors group text-left"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1.5 ring-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 capitalize flex items-center gap-1">
                {currentUser.role === 'admin' ? (
                  <span className="inline-flex items-center gap-0.5 text-blue-600 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-slate-500">
                    <UserCheck className="w-3 h-3" /> Employee
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 hidden sm:block" />
          </button>

          {/* Profile Dropdown & Switcher */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                  {currentUser.title}
                </div>
              </div>

              {/* Role Switcher */}
              <div className="p-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  Switch Account / Role
                </p>
                <div className="space-y-1">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSwitchUser(u);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition ${
                        u.id === currentUser.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="flex-1 truncate">
                        <div className="truncate text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {u.role} • {u.department}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAuthModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-medium cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Register / Switch Account</span>
                </button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out / লগআউট</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
