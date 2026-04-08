import axios from 'axios';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { permissionsApi } from '../api/permissions.api';
import { Permission, PermissionsGrouped } from '../types/rbac.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACTION_BADGE: Record<string, string> = {
  create: 'bg-green-100 text-green-800 border-green-200',
  read: 'bg-blue-100 text-blue-800 border-blue-200',
  update: 'bg-amber-100 text-amber-800 border-amber-200',
  delete: 'bg-red-100 text-red-800 border-red-200',
  manage: 'bg-purple-100 text-purple-800 border-purple-200',
  export: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  issue: 'bg-orange-100 text-orange-800 border-orange-200',
};

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Create/Edit modal ─────────────────────────────────────────────────────────

function PermissionFormModal({
  perm,
  onClose,
  onDone,
}: {
  perm?: Permission;
  onClose: () => void;
  onDone: () => void;
}) {
  const isEdit = !!perm;
  const [resource, setResource] = useState(perm?.resource ?? '');
  const [action, setAction] = useState(perm?.action ?? '');
  const [name, setName] = useState(perm?.name ?? '');
  const [key, setKey] = useState(perm?.key ?? '');
  const [description, setDescription] = useState(perm?.description ?? '');
  const [nameTouched, setNameTouched] = useState(isEdit);
  const [keyTouched, setKeyTouched] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const deriveFields = (r: string, a: string) => {
    if (!nameTouched) setName(r && a ? `${cap(a)} ${cap(r)}` : '');
    if (!keyTouched) setKey(r && a ? `${r}:${a}` : '');
  };

  const handleResourceChange = (v: string) => {
    setResource(v);
    deriveFields(v, action);
  };
  const handleActionChange = (v: string) => {
    setAction(v);
    deriveFields(resource, v);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (isEdit) {
        await permissionsApi.update(perm.id, { name, key, resource, action, description: description || undefined });
        toast.success('Permission updated');
      } else {
        await permissionsApi.create({ name, key, resource, action, description: description || undefined });
        toast.success('Permission created');
      }
      onDone();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr((error.response?.data as { message?: string })?.message ?? 'Request failed');
      } else {
        setErr('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

  return (
    <Modal title={isEdit ? 'Edit Permission' : 'Create Permission'} onClose={onClose}>
      {err && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4 text-sm text-red-700">{err}</div>}
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Resource</label>
            <input type="text" value={resource} onChange={(e) => handleResourceChange(e.target.value)} className={inputCls} placeholder="projects" required />
          </div>
          <div>
            <label className={labelCls}>Action</label>
            <input type="text" value={action} onChange={(e) => handleActionChange(e.target.value)} className={inputCls} placeholder="create" required />
          </div>
        </div>
        <div>
          <label className={labelCls}>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameTouched(true); }}
            className={inputCls}
            placeholder="Create Projects"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => { setKey(e.target.value); setKeyTouched(true); }}
            className={inputCls + ' font-mono'}
            placeholder="projects:create"
            required
            pattern="[a-z]+:[a-z]+"
            title="Format: resource:action (lowercase)"
          />
        </div>
        <div>
          <label className={labelCls}>Description <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + ' resize-none'} placeholder="What this permission allows" />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; perm: Permission }
  | null;

export function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [activeResource, setActiveResource] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await permissionsApi.getAll();
      setPermissions(res.data.data);
    } catch {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchPermissions(); }, []);

  const grouped = useMemo<PermissionsGrouped>(() => {
    const g: PermissionsGrouped = {};
    for (const p of permissions) {
      if (!g[p.resource]) g[p.resource] = [];
      g[p.resource].push(p);
    }
    return g;
  }, [permissions]);

  const resources = Object.keys(grouped).sort();

  useEffect(() => {
    if (resources.length && !activeResource) {
      setActiveResource(resources[0]);
    }
  }, [resources, activeResource]);

  const handleDelete = async (perm: Permission) => {
    if (perm.isSystem) {
      toast.error('System permissions cannot be deleted');
      return;
    }
    if (!confirm(`Delete permission "${perm.key}"?`)) return;
    try {
      await permissionsApi.delete(perm.id);
      toast.success('Permission deleted');
      void fetchPermissions();
    } catch {
      toast.error('Failed to delete permission');
    }
  };

  const closeModal = () => setModal(null);
  const handleDone = () => { closeModal(); void fetchPermissions(); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{permissions.length} permission{permissions.length !== 1 ? 's' : ''} across {resources.length} resource{resources.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New Permission
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Resource tab list */}
          <div className="w-44 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {resources.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveResource(r)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                    activeResource === r
                      ? 'bg-green-50 text-green-800 border-l-2 border-l-green-500 pl-[14px]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  <span className="ml-1.5 text-xs text-gray-400">({grouped[r].length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Permission list for active resource */}
          <div className="flex-1">
            {activeResource && grouped[activeResource] ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800 capitalize">{activeResource}</h3>
                  <span className="text-xs text-gray-400">{grouped[activeResource].length} permissions</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Key</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {grouped[activeResource].map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-gray-800">{p.name}</span>
                          {p.isSystem && (
                            <span title="System permission — cannot be deleted" className="ml-2 inline-flex items-center">
                              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{p.key}</code>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${ACTION_BADGE[p.action] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {p.action}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModal({ type: 'edit', perm: p })}
                              disabled={p.isSystem}
                              title={p.isSystem ? 'System permissions cannot be edited' : 'Edit'}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => void handleDelete(p)}
                              disabled={p.isSystem}
                              title={p.isSystem ? 'System permissions cannot be deleted' : 'Delete'}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                Select a resource to view its permissions.
              </div>
            )}
          </div>
        </div>
      )}

      {modal?.type === 'create' && <PermissionFormModal onClose={closeModal} onDone={handleDone} />}
      {modal?.type === 'edit' && <PermissionFormModal perm={modal.perm} onClose={closeModal} onDone={handleDone} />}
    </div>
  );
}
