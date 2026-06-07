import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, ClipboardList, CheckCircle2, XCircle, Trash2, 
  Settings, PenSquare, RefreshCw, BarChart3, Clock, AlertTriangle, Key, Search
} from 'lucide-react';
import { UserProfile, UsageLog, SubscriptionRequest, SystemSettings } from '../../types';

interface AdminProps {
  user: UserProfile | null;
}

export default function Admin({ user }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'logs' | 'settings'>('overview');
  
  // Storage arrays
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allLogs, setAllLogs] = useState<UsageLog[]>([]);
  const [subs, setSubs] = useState<SubscriptionRequest[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Filters & Loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');

  // Editing User dialog triggers
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState<string>('user');
  const [editedCredits, setEditedCredits] = useState<number>(30);

  const navigate = useNavigate();

  // Enforce rigid admin checks
  const isAdmin = user && (user.role === 'admin' || user.email === 'hananirfan91@gmail.com');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      return; // will display unauthorised notice
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/data');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load admin controls.");
      }

      setAllUsers(data.users || []);
      setAllLogs(data.logs || []);
      setSubs(data.subscriptions || []);
      setSettings(data.settings || null);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching admin registries");
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleChange = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editedRole, credits: editedCredits })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setActionSuccessMessage("User credentials and credits allocated successfully.");
      setEditingUserId(null);
      fetchAdminData();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubscriptionAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccessMessage(`Manual check receipt successfully ${status}.`);
      fetchAdminData();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("CRITICAL: Are you sure you want to permanently erase this user profile? History and audio relative files maps will be purged.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccessMessage("User wiped from directory safely.");
      fetchAdminData();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccessMessage("Global configurations updated instantly.");
      fetchAdminData();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user || !isAdmin) {
    return (
      <article className="mx-auto max-w-md p-10 text-center py-24 animate-in zoom-in-95 leading-relaxed">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-xl font-extrabold text-text-primary tracking-tight">
          Unauthorised System Access
        </h1>
        <p className="text-xs text-text-muted mt-2 max-w-sm mx-auto">
          You lack administrator tokens required to access URH LABS control rails. Only authorized master addresses (e.g. <strong>hananirfan91@gmail.com</strong>) can load panels.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-6 px-4 py-2 bg-primary hover:bg-[#574feb] text-white text-xs font-semibold rounded-lg cursor-pointer"
        >
          Sign In as Admin
        </button>
      </article>
    );
  }

  // Derived variables for Overview stats
  const totalUsersCount = allUsers.length;
  const totalConversationalLogs = allLogs.length;
  const pendingRequestsCount = subs.filter(s => s.status === 'pending').length;
  const activePremiumCustomers = allUsers.filter(u => u.role === 'customer').length;

  // Filtered users
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <article id="admin-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 transition-colors animate-in fade-in duration-200">
      
      {/* Title Header */}
      <section id="admin-title-panel" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-border-custom pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/15 text-secondary border border-secondary/20 rounded-2xl w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-text-primary leading-none flex items-center gap-2">
              Master Admin Panel
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-secondary/10 border border-secondary/20 text-secondary px-2 py-0.5 rounded">
                Super Admin
              </span>
            </h1>
            <h2 className="text-xs text-text-muted mt-2 font-display">
              Oversee registered profiles and manual payment approvals of the SaaS network.
            </h2>
          </div>
        </div>

        {/* Sync triggers */}
        <button
          type="button"
          onClick={fetchAdminData}
          className="px-4 py-2 bg-dark-bg hover:bg-card-bg text-text-muted hover:text-text-primary border border-border-custom hover:border-text-muted rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Sync System Registries
        </button>
      </section>

      {/* Global alert or success banner indicators */}
      {actionSuccessMessage && (
        <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl mb-6 text-xs text-secondary flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <strong>Admin Alert:</strong> {actionSuccessMessage}
        </div>
      )}

      {/* Tabs list navigation */}
      <section id="admin-tabs" className="flex border-b border-border-custom/50 mb-8 overflow-x-auto gap-2">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase border-b-2 bg-transparent text-left cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Overview Statistics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase border-b-2 bg-transparent text-left cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Users Directory ({totalUsersCount})
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase border-b-2 bg-transparent text-left cursor-pointer transition-all relative ${
            activeTab === 'subscriptions'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Sub Approvals
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-400 text-dark-bg text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase border-b-2 bg-transparent text-left cursor-pointer transition-all ${
            activeTab === 'logs'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Global Usage Auditor
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 font-display text-xs font-semibold tracking-wider uppercase border-b-2 bg-transparent text-left cursor-pointer transition-all ${
            activeTab === 'settings'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          System Configs
        </button>

      </section>

      {/* Primary tab views content switchboards */}
      <section id="admin-main-viewport">
        {loading ? (
          <div className="flex flex-col gap-3 py-20 items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="font-mono text-xs text-text-muted">auditing master registry files...</span>
          </div>
        ) : (
          <div>
            
            {/* 1. OVERVIEW STATISTICS TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Item 1 */}
                  <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Total User base Registered</p>
                      <p className="text-2xl font-extrabold text-text-primary font-mono mt-1">{totalUsersCount}</p>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Global Voice Conversions</p>
                      <p className="text-2xl font-extrabold text-text-primary font-mono mt-1">{totalConversationalLogs}</p>
                    </div>
                    <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider font-bold">Pending Manual Upgrades</p>
                      <p className={`text-2xl font-extrabold font-mono mt-1 ${pendingRequestsCount > 0 ? 'text-red-400' : 'text-text-muted'}`}>{pendingRequestsCount}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${pendingRequestsCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-dark-bg text-text-muted'}`}>
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="p-5 bg-card-bg border border-border-custom rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Premium paid Subscribers</p>
                      <p className="text-2xl font-extrabold text-[#00d9a6] font-mono mt-1">{activePremiumCustomers}</p>
                    </div>
                    <div className="p-3 bg-primary/15 text-[#00d9a6] rounded-xl">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>

                </div>

                {/* Database files fallback alert indicator notice */}
                <div className="bg-[#12121a] border border-border-custom p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-1.5 font-display">
                    <AlertTriangle className="h-4.5 w-4.5 text-secondary" />
                    Hosting Infrastructure Diagnostics
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    SaaS files are structured inside dynamic multi-fallbacks routes. Database operations securely query <strong>Supabase PostgreSQL</strong> credentials if defined; otherwise, they fall back instantly to local encrypted JSON schemas, guaranteeing robust continuous sandbox executions without crashes.
                  </p>
                </div>
              </div>
            )}

            {/* 2. USERS DIRECTORY TAB */}
            {activeTab === 'users' && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                <div className="flex items-center gap-3 bg-dark-bg p-2 rounded-xl border border-border-custom max-w-sm mb-2">
                  <Search className="h-4 w-4 text-text-muted ml-1" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Search users by name, email, or role..."
                    className="w-full bg-transparent border-0 text-xs focus:outline-none text-text-primary font-sans"
                  />
                </div>

                <div className="overflow-x-auto border border-border-custom bg-card-bg/10 rounded-2xl p-4">
                  <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border-custom/50 font-mono tracking-wider text-text-muted uppercase text-[9px] py-1">
                        <th className="py-2.5 px-2">Registered User</th>
                        <th className="py-2.5 px-2">Vocal Role</th>
                        <th className="py-2.5 px-2">Assigned Credits Balance</th>
                        <th className="py-2.5 px-2">Created timestamp</th>
                        <th className="py-2.5 px-2 text-center">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/10 text-text-muted">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-card-bg/20 transition-colors">
                          
                          {/* Name Email */}
                          <td className="py-3 px-2">
                            <div className="flex flex-col">
                              <span className="font-bold text-text-primary">{u.name}</span>
                              <span className="text-[10px] text-text-muted mt-0.5">{u.email}</span>
                            </div>
                          </td>

                          {/* Role badges */}
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin' 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : u.role === 'customer' 
                                ? 'bg-[#00d9a6]/10 text-[#00d9a6] border border-[#00d9a6]/20 font-bold' 
                                : 'bg-border-custom text-text-muted'
                            }`}>
                              {u.role}
                            </span>
                          </td>

                          {/* Credits count */}
                          <td className="py-3 px-2 font-mono font-bold text-text-primary">
                            {u.credits !== null ? u.credits : 'None (Daily reset)'}
                          </td>

                          {/* Timestamp */}
                          <td className="py-3 px-2 font-mono text-[11px]">
                            {new Date(u.created_at || Date.now()).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          {/* Action edit buttons triggers */}
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-2">
                              {editingUserId === u.id ? (
                                <div className="flex items-center gap-2 bg-dark-bg p-2 rounded-xl border border-border-custom">
                                  <select
                                    value={editedRole}
                                    onChange={(e) => setEditedRole(e.target.value)}
                                    className="bg-transparent border-0 text-[11px] text-text-primary outline-none focus:ring-0 select-none cursor-pointer"
                                  >
                                    <option value="user" className="bg-card-bg text-text-primary">user</option>
                                    <option value="customer" className="bg-card-bg text-text-primary">customer</option>
                                    <option value="admin" className="bg-card-bg text-text-primary">admin</option>
                                  </select>
                                  <input
                                    type="number"
                                    value={editedCredits}
                                    onChange={(e) => setEditedCredits(parseInt(e.target.value))}
                                    className="w-12 bg-transparent text-center border-0 text-[11px] text-text-primary outline-none focus:ring-0 font-mono font-bold"
                                    title="Credits Assigned"
                                  />
                                  <button
                                    onClick={() => handleUserRoleChange(u.id)}
                                    className="bg-secondary p-1 border-0 rounded text-dark-bg cursor-pointer hover:bg-secondary/90 flex items-center justify-center"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingUserId(null)}
                                    className="bg-red-500/10 border-0 p-1 rounded text-red-400 cursor-pointer flex items-center justify-center"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingUserId(u.id);
                                      setEditedRole(u.role);
                                      setEditedCredits(u.credits || 0);
                                    }}
                                    className="px-2 py-1 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded cursor-pointer font-bold text-[10px] flex items-center gap-1 leading-none"
                                  >
                                    <PenSquare className="h-3 w-3" />
                                    Allocate / Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1 border-0 hover:bg-red-500/10 text-text-muted hover:text-red-400 rounded cursor-pointer flex items-center justify-center"
                                    title="Wipe User Profile"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SUBSCRIPTION MANUAL APPROVALS TAB */}
            {activeTab === 'subscriptions' && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                <div className="overflow-x-auto border border-border-custom bg-card-bg/25 rounded-2xl p-4">
                  <table className="w-full text-xs text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="border-b border-border-custom/50 font-mono tracking-wider text-text-muted uppercase text-[9px]">
                        <th className="py-2.5 px-2">Account Profile Details</th>
                        <th className="py-2.5 px-2">Required Plan</th>
                        <th className="py-2.5 px-2">Proof Notes Metadata Details</th>
                        <th className="py-2.5 px-2">Verification status</th>
                        <th className="py-2.5 px-2 text-center font-bold">Approve / Decline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/15 text-text-muted">
                      {subs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 font-mono text-xs text-text-muted">
                            No manual subscription request coordinates logged in tables.
                          </td>
                        </tr>
                      ) : (
                        subs.map((s) => (
                          <tr key={s.id} className="hover:bg-card-bg/25 transition-colors">
                            
                            {/* User details */}
                            <td className="py-3 px-2">
                              <div className="flex flex-col font-sans">
                                <span className="font-bold text-text-primary">{s.name}</span>
                                <span className="text-[10px] text-text-muted mt-0.5">{s.email}</span>
                                {s.phone && <span className="text-[9px] text-[#00d9a6] font-mono mt-0.5 font-bold leading-none">{s.phone}</span>}
                              </div>
                            </td>

                            {/* Plans chosen */}
                            <td className="py-3 px-2">
                              <span className="font-bold text-secondary font-mono">{s.plan_name}</span>
                            </td>

                            {/* Message / reference proof */}
                            <td className="py-3 px-2 max-w-[280px] break-words text-[11px] font-sans text-text-primary block overflow-hidden leading-relaxed pr-3 py-4">
                              {s.proof_message || 'None provided'}
                            </td>

                            {/* Verification status */}
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.status === 'pending' 
                                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse' 
                                  : s.status === 'approved' 
                                  ? 'bg-[#00d9a6]/10 text-[#00d9a6] border border-[#00d9a6]/20' 
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {s.status}
                              </span>
                            </td>

                            {/* Actions toggle triggers */}
                            <td className="py-3 px-2">
                              <div className="flex items-center justify-center gap-2">
                                {s.status === 'pending' ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleSubscriptionAction(s.id, 'approved')}
                                      className="px-2.5 py-1.5 bg-secondary text-dark-bg hover:opacity-90 border-0 rounded-lg cursor-pointer font-bold text-[10px] flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                      Approve Plan
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSubscriptionAction(s.id, 'rejected')}
                                      className="px-2.5 py-1.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg cursor-pointer font-semibold hover:bg-red-500/25 text-[10px] flex items-center gap-1"
                                    >
                                      <XCircle className="h-3 w-3" />
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-text-muted italic font-mono uppercase tracking-wider">Historical request closed</span>
                                )}
                              </div>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. GLOBAL USAGE LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                <div className="overflow-x-auto border border-border-custom bg-card-bg/20 rounded-2xl p-4">
                  <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border-custom/50 font-mono tracking-wider text-text-muted uppercase text-[9px]">
                        <th className="py-2.5 px-2">Timestamp Logged</th>
                        <th className="py-2.5 px-2">Assigned User account</th>
                        <th className="py-2.5 px-2">Input Characters Length</th>
                        <th className="py-2.5 px-2">Action dial</th>
                        <th className="py-2.5 px-2">Audible preview files url</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/10 text-text-muted">
                      {allLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 font-mono text-xs text-text-muted">
                            No global audit conversions found in database yet.
                          </td>
                        </tr>
                      ) : (
                        allLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-card-bg/15 transition-colors">
                            
                            {/* Date */}
                            <td className="py-3 px-2 font-mono text-text-muted text-[10px]">
                              {new Date(log.created_at).toLocaleString()}
                            </td>

                            {/* User email owner */}
                            <td className="py-3 px-2 font-bold text-text-primary">
                              {log.user_email || 'Anonymous Visitor'}
                            </td>

                            {/* Input Length parameters */}
                            <td className="py-3 px-2 font-mono">
                              {log.text_input.length} Chars
                            </td>

                            {/* Language dialects vocal indicators */}
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${log.language === 'ur' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/15 text-secondary border border-secondary/20'}`}>
                                {log.language} · {log.voice_type}
                              </span>
                            </td>

                            {/* Sound file URL address */}
                            <td className="py-3 px-2 max-w-[200px] truncate outline-none font-mono text-[10px] text-secondary">
                              <a href={log.audio_url} target="_blank" rel="noreferrer" className="hover:underline">
                                {log.audio_url}
                              </a>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. GLOBAL SYSTEM SETTINGS CONFIGURATIONS TAB */}
            {activeTab === 'settings' && settings && (
              <form onSubmit={handleSettingsUpdate} className="max-w-xl mx-auto bg-card-bg border border-border-custom p-6 rounded-2xl flex flex-col gap-5 animate-in fade-in duration-200 shadow-md">
                <h3 className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5 border-b border-border-custom pb-3 mb-1">
                  <Settings className="h-4 w-4 text-primary" />
                  Override Global Platforms Limits Configs
                </h3>

                {/* Switchboard limits */}
                <div className="flex items-center justify-between p-3 bg-dark-bg/40 border border-border-custom/50 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-text-primary">Platform Maintenance Mode</span>
                    <span className="text-[10px] text-text-muted">Gracefully locks speech generation for manual cluster upgrades.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer border-border-custom bg-dark-bg"
                  />
                </div>

                {/* Numeric fields parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                    <label>Free Daily Conversions Limit</label>
                    <input
                      type="number"
                      value={settings.free_daily_limit}
                      onChange={(e) => setSettings({ ...settings, free_daily_limit: parseInt(e.target.value) })}
                      className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                    <label>Default Credits Upgrading Plan</label>
                    <input
                      type="number"
                      value={settings.basic_monthly_credits}
                      onChange={(e) => setSettings({ ...settings, basic_monthly_credits: parseInt(e.target.value) })}
                      className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                    <label>Free Text character Limit cap</label>
                    <input
                      type="number"
                      value={settings.max_free_chars}
                      onChange={(e) => setSettings({ ...settings, max_free_chars: parseInt(e.target.value) })}
                      className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                    <label>Premium Paid character Limit cap</label>
                    <input
                      type="number"
                      value={settings.max_premium_chars}
                      onChange={(e) => setSettings({ ...settings, max_premium_chars: parseInt(e.target.value) })}
                      className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Submits */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-[#574feb] text-white font-semibold text-xs border-0 rounded-xl cursor-pointer shadow-lg shadow-primary/20 flex justify-center items-center gap-1.5 transition-all mt-4"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Commit Parameter Changes
                </button>

              </form>
            )}

          </div>
        )}
      </section>

    </article>
  );
}
