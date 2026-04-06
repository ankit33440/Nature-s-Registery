import axios from 'axios';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { usersApi } from '../api/users.api';
import { User, UserRole, UserStatus } from '../types/user.types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<UserStatus, string> = {
  [UserStatus.PENDING_APPROVAL]: 'Pending Approval',
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INVITED]: 'Invited',
  [UserStatus.REJECTED]: 'Rejected',
};

const STATUS_BADGE: Record<UserStatus, string> = {
  [UserStatus.PENDING_APPROVAL]: 'bg-amber-100 text-amber-800 border-amber-200',
  [UserStatus.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [UserStatus.INVITED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [UserStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
};

const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Super Admin',
  [UserRole.PROJECT_DEVELOPER]: 'Project Developer',
  [UserRole.VERIFIER]: 'Verifier',
  [UserRole.CERTIFIER]: 'Certifier',
  [UserRole.BUYER]: 'Buyer',
};

const TABS: { label: string; status?: UserStatus }[] = [
  { label: 'All' },
  { label: 'Pending', status: UserStatus.PENDING_APPROVAL },
  { label: 'Active', status: UserStatus.ACTIVE },
  { label: 'Invited', status: UserStatus.INVITED },
  { label: 'Rejected', status: UserStatus.REJECTED },
];

// ── Modal base ────────────────────────────────────────────────────────────────

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, confirmLabel, confirmClass, isLoading, onConfirm }: {
  onCancel: () => void;
  confirmLabel: string;
  confirmClass?: string;
  isLoading: boolean;
  onConfirm?: () => void;
}) {
  return (
    <div className="flex gap-3 mt-5">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type={onConfirm ? 'button' : 'submit'}
        onClick={onConfirm}
        disabled={isLoading}
        className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${confirmClass ?? 'bg-green-700 hover:bg-green-800'}`}
      >
        {isLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {confirmLabel}
      </button>
    </div>
  );
}

// ── Approve modal ─────────────────────────────────────────────────────────────

function ApproveModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await usersApi.approve(user.id);
      toast.success(`${user.firstName} ${user.lastName} approved`);
      onDone();
    } catch {
      toast.error('Failed to approve user');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Approve registration" onClose={onClose}>
      <p className="text-sm text-stone-600 leading-relaxed">
        Approve <span className="font-semibold text-stone-800">{user.firstName} {user.lastName}</span> as a Project Developer? They will be able to log in immediately.
      </p>
      <ModalActions onCancel={onClose} confirmLabel="Approve" isLoading={loading} onConfirm={() => void confirm()} />
    </Modal>
  );
}

// ── Reject modal ──────────────────────────────────────────────────────────────

function RejectModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await usersApi.reject(user.id, reason || undefined);
      toast.success(`${user.firstName} ${user.lastName} rejected`);
      onDone();
    } catch {
      toast.error('Failed to reject user');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Reject registration" onClose={onClose}>
      <p className="text-sm text-stone-600 mb-4">
        Reject <span className="font-semibold text-stone-800">{user.firstName} {user.lastName}</span>&apos;s registration? This cannot be undone.
      </p>
      <div>
        <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
          Reason <span className="text-stone-400 font-normal normal-case">(optional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Insufficient project documentation provided."
          className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 resize-none"
        />
      </div>
      <ModalActions onCancel={onClose} confirmLabel="Reject" confirmClass="bg-red-600 hover:bg-red-700" isLoading={loading} onConfirm={() => void confirm()} />
    </Modal>
  );
}

// ── Resend invitation modal ───────────────────────────────────────────────────

function ResendModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await usersApi.resendInvitation(user.id);
      toast.success(`Invitation resent to ${user.email}`);
      onDone();
    } catch {
      toast.error('Failed to resend invitation');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Resend invitation" onClose={onClose}>
      <p className="text-sm text-stone-600 leading-relaxed">
        Resend the invitation email to <span className="font-semibold text-stone-800">{user.email}</span>? The previous link will be invalidated and a new one will be generated.
      </p>
      <ModalActions onCancel={onClose} confirmLabel="Resend" confirmClass="bg-blue-600 hover:bg-blue-700" isLoading={loading} onConfirm={() => void confirm()} />
    </Modal>
  );
}

// ── Deactivate modal ──────────────────────────────────────────────────────────

function DeactivateModal({ user, onClose, onDone }: { user: User; onClose: () => void; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const action = user.isActive ? 'Deactivate' : 'Activate';
  const confirm = async () => {
    setLoading(true);
    try {
      await usersApi.updateStatus(user.id, !user.isActive);
      toast.success(`${user.firstName} ${user.lastName} ${action.toLowerCase()}d`);
      onDone();
    } catch {
      toast.error(`Failed to ${action.toLowerCase()} user`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title={`${action} user`} onClose={onClose}>
      <p className="text-sm text-stone-600">
        {action} <span className="font-semibold text-stone-800">{user.firstName} {user.lastName}</span>?
        {user.isActive && ' They will no longer be able to log in.'}
      </p>
      <ModalActions
        onCancel={onClose}
        confirmLabel={action}
        confirmClass={user.isActive ? 'bg-stone-700 hover:bg-stone-800' : 'bg-green-700 hover:bg-green-800'}
        isLoading={loading}
        onConfirm={() => void confirm()}
      />
    </Modal>
  );
}

// ── Create user modal ─────────────────────────────────────────────────────────

function CreateUserModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: UserRole.VERIFIER as UserRole.VERIFIER | UserRole.CERTIFIER });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await usersApi.create(form);
      toast.success('User created successfully');
      onDone();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr((error.response?.data as { message?: string })?.message ?? 'Failed to create user');
      } else {
        setErr('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500';
  const labelClass = 'block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5';

  return (
    <Modal title="Create user" onClose={onClose}>
      {err && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4 text-sm text-red-700">{err}</div>}
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>First name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} placeholder="Jane" required />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} placeholder="Smith" required />
          </div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="jane@example.com" required />
        </div>
        <div className="mb-3">
          <label className={labelClass}>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="Min. 8 characters" required minLength={8} />
        </div>
        <div className="mb-1">
          <label className={labelClass}>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole.VERIFIER | UserRole.CERTIFIER })} className={`${inputClass} bg-white cursor-pointer`}>
            <option value={UserRole.VERIFIER}>Verifier</option>
            <option value={UserRole.CERTIFIER}>Certifier</option>
          </select>
        </div>
        <ModalActions onCancel={onClose} confirmLabel="Create user" isLoading={loading} />
      </form>
    </Modal>
  );
}

// ── Invite user modal ─────────────────────────────────────────────────────────

function InviteUserModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: UserRole.VERIFIER as UserRole.VERIFIER | UserRole.CERTIFIER });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await usersApi.invite(form);
      toast.success(`Invitation sent to ${form.email}`);
      onDone();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr((error.response?.data as { message?: string })?.message ?? 'Failed to send invitation');
      } else {
        setErr('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500';
  const labelClass = 'block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5';

  return (
    <Modal title="Invite user" onClose={onClose}>
      {err && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4 text-sm text-red-700">{err}</div>}
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>First name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} placeholder="Jane" required />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} placeholder="Smith" required />
          </div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="jane@example.com" required />
        </div>
        <div className="mb-1">
          <label className={labelClass}>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole.VERIFIER | UserRole.CERTIFIER })} className={`${inputClass} bg-white cursor-pointer`}>
            <option value={UserRole.VERIFIER}>Verifier</option>
            <option value={UserRole.CERTIFIER}>Certifier</option>
          </select>
        </div>
        <ModalActions onCancel={onClose} confirmLabel="Send invitation" confirmClass="bg-blue-600 hover:bg-blue-700" isLoading={loading} />
      </form>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'approve'; user: User }
  | { type: 'reject'; user: User }
  | { type: 'resend'; user: User }
  | { type: 'deactivate'; user: User }
  | { type: 'create' }
  | { type: 'invite' }
  | null;

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const limit = 10;

  const activeStatus = TABS[activeTab]?.status;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({
        page,
        limit,
        status: activeStatus,
      });
      const d = res.data.data;
      setUsers(d.data);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, activeStatus]);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setPage(1);
  };

  const closeModal = () => setModal(null);
  const handleDone = () => { closeModal(); void fetchUsers(); };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">User Management</h1>
          <p className="text-stone-400 text-sm mt-0.5">{total} user{total !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModal({ type: 'invite' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M13 4H3a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3 5l5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Invite User
          </button>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-700 text-white hover:bg-green-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Create User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-5 w-fit">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(idx)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === idx ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-stone-900 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{user.email}</td>
                    <td className="px-5 py-3.5 text-stone-600 whitespace-nowrap">{ROLE_LABEL[user.role]}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_BADGE[user.status]}`}>
                        {STATUS_LABEL[user.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-stone-400 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === UserStatus.PENDING_APPROVAL && (
                          <>
                            <button
                              onClick={() => setModal({ type: 'approve', user })}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setModal({ type: 'reject', user })}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {user.status === UserStatus.INVITED && (
                          <button
                            onClick={() => setModal({ type: 'resend', user })}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            Resend
                          </button>
                        )}
                        {user.status === UserStatus.ACTIVE && user.role !== UserRole.SUPERADMIN && (
                          <button
                            onClick={() => setModal({ type: 'deactivate', user })}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                        {!user.isActive && user.status === UserStatus.ACTIVE && (
                          <button
                            onClick={() => setModal({ type: 'deactivate', user })}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'approve' && <ApproveModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'reject' && <RejectModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'resend' && <ResendModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'deactivate' && <DeactivateModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'create' && <CreateUserModal onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'invite' && <InviteUserModal onClose={closeModal} onDone={handleDone} />}
    </div>
  );
}
