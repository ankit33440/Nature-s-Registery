import axios from 'axios';
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { usersApi } from '../api/users.api';
import { User, UserRole, UserStatus } from '../types/user.types';

const STATUS_LABEL: Record<UserStatus, string> = {
  [UserStatus.PENDING_APPROVAL]: 'Pending Approval',
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INVITED]: 'Invited',
  [UserStatus.REJECTED]: 'Rejected',
};

const STATUS_BADGE: Record<UserStatus, string> = {
  [UserStatus.PENDING_APPROVAL]: 'border-amber-200 bg-amber-100 text-amber-800',
  [UserStatus.ACTIVE]: 'border-green-200 bg-green-100 text-green-800',
  [UserStatus.INVITED]: 'border-blue-200 bg-blue-100 text-blue-800',
  [UserStatus.REJECTED]: 'border-red-200 bg-red-100 text-red-700',
};

const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Super Admin',
  [UserRole.PROJECT_DEVELOPER]: 'Project Developer',
  [UserRole.VERIFIER]: 'Verifier',
  [UserRole.CERTIFIER]: 'Certifier',
  [UserRole.BUYER]: 'Buyer',
};

const TABS = [
  { key: 'all', label: 'All People' },
  {
    key: 'pending',
    label: 'Pending Approval',
    status: UserStatus.PENDING_APPROVAL,
  },
  { key: 'active', label: 'Active', status: UserStatus.ACTIVE },
  { key: 'invited', label: 'Invited', status: UserStatus.INVITED },
  { key: 'rejected', label: 'Rejected', status: UserStatus.REJECTED },
] as const;

type TabKey = (typeof TABS)[number]['key'];

type ModalState =
  | { type: 'approve'; user: User }
  | { type: 'reject'; user: User }
  | { type: 'resend'; user: User }
  | { type: 'deactivate'; user: User }
  | { type: 'create' }
  | { type: 'invite' }
  | null;

function isTabKey(value: string | null): value is TabKey {
  return value !== null && TABS.some((tab) => tab.key === value);
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_24px_60px_rgba(20,31,38,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 6l8 8M14 6l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  confirmLabel,
  confirmClass,
  isLoading,
  onConfirm,
}: {
  onCancel: () => void;
  confirmLabel: string;
  confirmClass?: string;
  isLoading: boolean;
  onConfirm?: () => void;
}) {
  return (
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
      >
        Cancel
      </button>
      <button
        type={onConfirm ? 'button' : 'submit'}
        onClick={onConfirm}
        disabled={isLoading}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
          confirmClass ?? 'bg-green-700 hover:bg-green-800'
        }`}
      >
        {isLoading && (
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        )}
        {confirmLabel}
      </button>
    </div>
  );
}

function ApproveModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
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
      <p className="text-sm leading-relaxed text-stone-600">
        Approve{' '}
        <span className="font-semibold text-stone-800">
          {user.firstName} {user.lastName}
        </span>{' '}
        as a Project Developer? They will be able to log in immediately.
      </p>
      <ModalActions
        onCancel={onClose}
        confirmLabel="Approve"
        isLoading={loading}
        onConfirm={() => void confirm()}
      />
    </Modal>
  );
}

function RejectModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
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
      <p className="mb-4 text-sm text-stone-600">
        Reject{' '}
        <span className="font-semibold text-stone-800">
          {user.firstName} {user.lastName}
        </span>
        &apos;s registration? This cannot be undone.
      </p>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600">
          Reason{' '}
          <span className="font-normal normal-case text-stone-400">
            (optional)
          </span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Insufficient project documentation provided."
          className="w-full resize-none rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/40"
        />
      </div>
      <ModalActions
        onCancel={onClose}
        confirmLabel="Reject"
        confirmClass="bg-red-600 hover:bg-red-700"
        isLoading={loading}
        onConfirm={() => void confirm()}
      />
    </Modal>
  );
}

function ResendModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
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
      <p className="text-sm leading-relaxed text-stone-600">
        Resend the invitation email to{' '}
        <span className="font-semibold text-stone-800">{user.email}</span>? The
        previous link will be invalidated and a new one will be generated.
      </p>
      <ModalActions
        onCancel={onClose}
        confirmLabel="Resend"
        confirmClass="bg-blue-600 hover:bg-blue-700"
        isLoading={loading}
        onConfirm={() => void confirm()}
      />
    </Modal>
  );
}

function DeactivateModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
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
        {action}{' '}
        <span className="font-semibold text-stone-800">
          {user.firstName} {user.lastName}
        </span>
        ?{user.isActive && ' They will no longer be able to log in.'}
      </p>
      <ModalActions
        onCancel={onClose}
        confirmLabel={action}
        confirmClass={
          user.isActive
            ? 'bg-stone-700 hover:bg-stone-800'
            : 'bg-green-700 hover:bg-green-800'
        }
        isLoading={loading}
        onConfirm={() => void confirm()}
      />
    </Modal>
  );
}
function CreateUserModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.VERIFIER as UserRole.VERIFIER | UserRole.CERTIFIER,
  });
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
        setErr(
          (error.response?.data as { message?: string })?.message ??
            'Failed to create user',
        );
      } else {
        setErr('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40';
  const labelClass =
    'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600';

  return (
    <Modal title="Create user" onClose={onClose}>
      {err && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {err}
        </div>
      )}
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className={inputClass}
              placeholder="Jane"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputClass}
              placeholder="Smith"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="jane@example.com"
            required
          />
        </div>
        <div className="mb-3">
          <label className={labelClass}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
            placeholder="Min. 8 characters"
            required
            minLength={8}
          />
        </div>
        <div className="mb-1">
          <label className={labelClass}>Role</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as UserRole.VERIFIER | UserRole.CERTIFIER,
              })
            }
            className={`${inputClass} cursor-pointer bg-white`}
          >
            <option value={UserRole.VERIFIER}>Verifier</option>
            <option value={UserRole.CERTIFIER}>Certifier</option>
          </select>
        </div>
        <ModalActions
          onCancel={onClose}
          confirmLabel="Create user"
          isLoading={loading}
        />
      </form>
    </Modal>
  );
}

function InviteUserModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.VERIFIER as UserRole.VERIFIER | UserRole.CERTIFIER,
  });
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
        setErr(
          (error.response?.data as { message?: string })?.message ??
            'Failed to send invitation',
        );
      } else {
        setErr('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40';
  const labelClass =
    'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600';

  return (
    <Modal title="Invite user" onClose={onClose}>
      {err && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {err}
        </div>
      )}
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className={inputClass}
              placeholder="Jane"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputClass}
              placeholder="Smith"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="jane@example.com"
            required
          />
        </div>
        <div className="mb-1">
          <label className={labelClass}>Role</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as UserRole.VERIFIER | UserRole.CERTIFIER,
              })
            }
            className={`${inputClass} cursor-pointer bg-white`}
          >
            <option value={UserRole.VERIFIER}>Verifier</option>
            <option value={UserRole.CERTIFIER}>Certifier</option>
          </select>
        </div>
        <ModalActions
          onCancel={onClose}
          confirmLabel="Send invitation"
          confirmClass="bg-blue-600 hover:bg-blue-700"
          isLoading={loading}
        />
      </form>
    </Modal>
  );
}

function ShellCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-stone-200 bg-white shadow-[0_12px_32px_rgba(20,31,38,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  tone,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  tone: string;
  icon: ReactNode;
}) {
  return (
    <ShellCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            {title}
          </p>
          <p className="mt-4 text-[36px] font-bold leading-none tracking-[-0.04em] text-emerald-950">
            {value}
          </p>
          <p className="mt-3 text-sm text-stone-500">{subtitle}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
          {icon}
        </span>
      </div>
    </ShellCard>
  );
}

function TabButton({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-[0_8px_18px_rgba(20,31,38,0.16)]'
          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`inline-flex min-w-[24px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
            active ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function EmptyState({ tabLabel }: { tabLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
        <UsersGlyph className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-stone-900">
        No users in {tabLabel.toLowerCase()}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
        When people match this tab, they will appear here with their current
        access state and actions.
      </p>
    </div>
  );
}
function UsersTable({
  users,
  onOpenModal,
}: {
  users: User[];
  onOpenModal: (modal: Exclude<ModalState, null>) => void;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              {['Person', 'Role', 'Status', 'Joined', 'Access', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-stone-100 last:border-b-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-800">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-stone-600">
                  {ROLE_LABEL[user.role]}
                </td>
                <td className="px-6 py-5">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-6 py-5 text-sm text-stone-500">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {user.isActive ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <ActionButtons user={user} onOpenModal={onOpenModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 p-4 lg:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl border border-stone-200 bg-stone-50 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-semibold text-emerald-800">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-stone-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <UserStatusBadge status={user.status} />
                </div>
                <p className="mt-1 break-all text-sm text-stone-500">
                  {user.email}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-stone-400">
                      Role
                    </p>
                    <p className="mt-1 text-stone-700">{ROLE_LABEL[user.role]}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-stone-400">
                      Joined
                    </p>
                    <p className="mt-1 text-stone-700">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ActionButtons user={user} onOpenModal={onOpenModal} mobile />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ActionButtons({
  user,
  onOpenModal,
  mobile = false,
}: {
  user: User;
  onOpenModal: (modal: Exclude<ModalState, null>) => void;
  mobile?: boolean;
}) {
  const baseClass = 'rounded-xl px-3 py-2 text-xs font-semibold';

  return (
    <div className={`flex flex-wrap ${mobile ? 'gap-2' : 'justify-end gap-2'}`}>
      {user.status === UserStatus.PENDING_APPROVAL && (
        <>
          <button
            onClick={() => onOpenModal({ type: 'approve', user })}
            className={`${baseClass} bg-green-100 text-green-700 hover:bg-green-200`}
          >
            Approve
          </button>
          <button
            onClick={() => onOpenModal({ type: 'reject', user })}
            className={`${baseClass} bg-red-100 text-red-700 hover:bg-red-200`}
          >
            Reject
          </button>
        </>
      )}
      {user.status === UserStatus.INVITED && (
        <button
          onClick={() => onOpenModal({ type: 'resend', user })}
          className={`${baseClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
        >
          Resend Invite
        </button>
      )}
      {user.status === UserStatus.ACTIVE &&
        user.role !== UserRole.SUPERADMIN &&
        (user.isActive ? (
          <button
            onClick={() => onOpenModal({ type: 'deactivate', user })}
            className={`${baseClass} bg-stone-100 text-stone-700 hover:bg-stone-200`}
          >
            Deactivate
          </button>
        ) : (
          <button
            onClick={() => onOpenModal({ type: 'deactivate', user })}
            className={`${baseClass} bg-green-100 text-green-700 hover:bg-green-200`}
          >
            Activate
          </button>
        ))}
    </div>
  );
}

function UsersGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M13.5 11.5a3 3 0 1 0-2.58-4.53M6.5 11.5a3 3 0 1 1 2.58-4.53"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3.5 16.5a3.5 3.5 0 0 1 3.5-3.5h1.5a3.5 3.5 0 0 1 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.5 16.5a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 15.5V9.5M10 15.5V5.5M16 15.5V11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 16.5h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InviteGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M16 5H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 15h12a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 16 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 6l6.5 5 6.5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function UserManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const limit = 10;

  const tabParam = searchParams.get('tab');
  const activeTabKey: TabKey = isTabKey(tabParam) ? tabParam : 'all';

  useEffect(() => {
    if (!isTabKey(searchParams.get('tab'))) {
      const next = new URLSearchParams(searchParams);
      next.set('tab', 'all');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [activeTabKey]);

  const activeTab = TABS.find((tab) => tab.key === activeTabKey) ?? TABS[0];
  const activeStatus = 'status' in activeTab ? activeTab.status : undefined;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({
        page,
        limit,
        status: activeStatus,
      });
      const payload = res.data.data;
      setUsers(payload.data);
      setTotal(payload.total);
      setTotalPages(payload.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [activeStatus, page]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const visibleCounts = useMemo(
    () => ({
      active: users.filter((user) => user.status === UserStatus.ACTIVE).length,
      pending: users.filter(
        (user) => user.status === UserStatus.PENDING_APPROVAL,
      ).length,
      invited: users.filter((user) => user.status === UserStatus.INVITED).length,
      disabled: users.filter(
        (user) => user.status === UserStatus.ACTIVE && !user.isActive,
      ).length,
    }),
    [users],
  );

  const tabCountMap: Partial<Record<TabKey, number>> = {
    all: total,
    active: activeTabKey === 'active' ? total : visibleCounts.active,
    pending: activeTabKey === 'pending' ? total : visibleCounts.pending,
    invited: activeTabKey === 'invited' ? total : visibleCounts.invited,
  };

  const openTab = (key: TabKey) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', key);
    setSearchParams(next);
  };

  const closeModal = () => setModal(null);
  const handleDone = () => {
    closeModal();
    void fetchUsers();
  };

  return (
    <div className="space-y-0">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ShellCard className="overflow-hidden">
          <div className="border-b border-stone-100 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Access Administration
                </p>
                <h1 className="mt-3 text-[32px] font-bold tracking-[-0.04em] text-emerald-950 sm:text-[40px]">
                  User Management
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
                  Review pending registrations, monitor active access, and manage invited staff from one consistent control surface.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setModal({ type: 'invite' })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <InviteGlyph className="h-4 w-4" />
                  Invite User
                </button>
                <button
                  onClick={() => setModal({ type: 'create' })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(20,31,38,0.18)] transition-colors hover:bg-slate-800"
                >
                  <PlusGlyph className="h-4 w-4" />
                  Create User
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Filtered Users"
              value={String(total)}
              subtitle={`Currently showing ${activeTab.label.toLowerCase()}`}
              tone="bg-emerald-50 text-emerald-700"
              icon={<UsersGlyph className="h-5 w-5" />}
            />
            <SummaryCard
              title="Pending Review"
              value={String(visibleCounts.pending)}
              subtitle="Visible in current result set"
              tone="bg-amber-50 text-amber-700"
              icon={<ChartGlyph className="h-5 w-5" />}
            />
            <SummaryCard
              title="Invitations"
              value={String(visibleCounts.invited)}
              subtitle="Awaiting acceptance"
              tone="bg-blue-50 text-blue-700"
              icon={<InviteGlyph className="h-5 w-5" />}
            />
            <SummaryCard
              title="Restricted Access"
              value={String(visibleCounts.disabled)}
              subtitle="Active profiles currently disabled"
              tone="bg-stone-100 text-stone-700"
              icon={<ChartGlyph className="h-5 w-5" />}
            />
          </div>
        </ShellCard>

        <ShellCard className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Page Context
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                Current Tab
              </p>
              <p className="mt-2 text-lg font-semibold text-stone-900">
                {activeTab.label}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                URL Persistence
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                The selected tab is stored in the URL so reloads and browser navigation keep the same management view active.
              </p>
            </div>
          </div>
        </ShellCard>
      </section>

      <ShellCard className="overflow-hidden">
        <div className="border-b border-stone-100 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <TabButton
                  key={tab.key}
                  label={tab.label}
                  active={activeTabKey === tab.key}
                  count={tabCountMap[tab.key]}
                  onClick={() => openTab(tab.key)}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              URL tab state: <span className="font-semibold text-stone-700">{activeTabKey}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-stone-100 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                {activeTab.label}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {total} result{total !== 1 ? 's' : ''} across page {page}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-500">
              Filter is driven by <span className="font-semibold text-stone-700">?tab={activeTabKey}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState tabLabel={activeTab.label} />
        ) : (
          <UsersTable users={users} onOpenModal={setModal} />
        )}

        <div className="border-t border-stone-100 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </ShellCard>

      {modal?.type === 'approve' && <ApproveModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'reject' && <RejectModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'resend' && <ResendModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'deactivate' && <DeactivateModal user={modal.user} onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'create' && <CreateUserModal onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'invite' && <InviteUserModal onClose={closeModal} onDone={handleDone} />}
    </div>
  );
}
