import axios from 'axios';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { departmentsApi } from '../api/departments.api';
import { permissionsApi } from '../api/permissions.api';
import { rolesApi } from '../api/roles.api';
import { Department, Permission, PermissionsGrouped, Role } from '../types/rbac.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ── Modal base ────────────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 overflow-y-auto"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`bg-white rounded-xl shadow-xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-6`}>
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

// ── RoleFormModal (shared by Create + Edit) ───────────────────────────────────

function RoleFormModal({
  role,
  allPermissions,
  allDepartments,
  onClose,
  onDone,
}: {
  role?: Role;
  allPermissions: Permission[];
  allDepartments: Department[];
  onClose: () => void;
  onDone: () => void;
}) {
  const isEdit = !!role;

  const [name, setName] = useState(role?.name ?? '');
  const [slug, setSlug] = useState(role?.slug ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(
    () => new Set((role?.permissions ?? []).map((p) => p.id)),
  );
  const [selectedDeptIds, setSelectedDeptIds] = useState<Set<string>>(
    () => new Set((role?.departments ?? []).map((d) => d.id)),
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const grouped = useMemo<PermissionsGrouped>(() => {
    const g: PermissionsGrouped = {};
    for (const p of allPermissions) {
      if (!g[p.resource]) g[p.resource] = [];
      g[p.resource].push(p);
    }
    return g;
  }, [allPermissions]);

  const resources = Object.keys(grouped).sort();

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(toSlug(v));
  };

  const togglePerm = (id: string) => {
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleResource = (resource: string) => {
    const resourcePerms = grouped[resource];
    const allSelected = resourcePerms.every((p) => selectedPermIds.has(p.id));
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        resourcePerms.forEach((p) => next.delete(p.id));
      } else {
        resourcePerms.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const toggleDept = (id: string) => {
    setSelectedDeptIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const permissionIds = [...selectedPermIds];
    const departmentIds = [...selectedDeptIds];
    try {
      if (isEdit) {
        await rolesApi.update(role.id, { name, slug, description: description || undefined });
        await rolesApi.setPermissions(role.id, permissionIds);
        await rolesApi.setDepartments(role.id, departmentIds);
        toast.success('Role updated');
      } else {
        await rolesApi.create({ name, slug, description: description || undefined, permissionIds, departmentIds });
        toast.success('Role created');
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
    <Modal title={isEdit ? `Edit Role: ${role.name}` : 'Create Role'} onClose={onClose} wide>
      {err && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4 text-sm text-red-700">{err}</div>}
      <form onSubmit={(e) => void handleSubmit(e)}>
        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelCls}>Role Name</label>
            <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} placeholder="Senior Verifier" required />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              className={inputCls}
              placeholder="senior-verifier"
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>
        </div>
        <div className="mb-5">
          <label className={labelCls}>Description <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Brief description" />
        </div>

        {/* Permission matrix */}
        <div className="mb-5">
          <p className={labelCls}>Permissions <span className="text-green-700 font-normal normal-case">({selectedPermIds.size} selected)</span></p>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            {resources.map((resource) => {
              const perms = grouped[resource];
              const allChecked = perms.every((p) => selectedPermIds.has(p.id));
              const someChecked = perms.some((p) => selectedPermIds.has(p.id));
              return (
                <div key={resource} className="border-b border-gray-100 last:border-0">
                  {/* Resource header row */}
                  <div
                    className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleResource(resource)}
                  >
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked; }}
                      onChange={() => toggleResource(resource)}
                      className="accent-green-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide capitalize">{resource}</span>
                    <span className="text-xs text-gray-400 ml-auto">{perms.filter((p) => selectedPermIds.has(p.id)).length}/{perms.length}</span>
                  </div>
                  {/* Permission rows */}
                  {perms.map((p) => (
                    <label key={p.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermIds.has(p.id)}
                        onChange={() => togglePerm(p.id)}
                        className="accent-green-600"
                      />
                      <span className="text-sm text-gray-700 flex-1">{p.name}</span>
                      <code className="text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{p.key}</code>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Department scope */}
        {allDepartments.length > 0 && (
          <div className="mb-5">
            <p className={labelCls}>Department Scope <span className="text-gray-400 font-normal normal-case">(optional)</span></p>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {allDepartments.map((dept) => (
                <label key={dept.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={selectedDeptIds.has(dept.id)} onChange={() => toggleDept(dept.id)} className="accent-green-600" />
                  <span className="text-sm text-gray-700 flex-1">{dept.name}</span>
                  <code className="text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{dept.slug}</code>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isEdit ? 'Save changes' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────

function DeleteRoleModal({
  role,
  onClose,
  onDone,
}: {
  role: Role;
  onClose: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await rolesApi.delete(role.id);
      toast.success('Role deleted');
      onDone();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error((error.response?.data as { message?: string })?.message ?? 'Failed to delete role');
      } else {
        toast.error('Failed to delete role');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Delete role" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-5">
        Delete <span className="font-semibold text-gray-900">{role.name}</span>? Users with this role will lose its permissions. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={() => void confirm()} disabled={loading} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-60 transition-colors">
          {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Delete
        </button>
      </div>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; role: Role }
  | { type: 'delete'; role: Role }
  | null;

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes, deptsRes] = await Promise.all([
        rolesApi.getAll(),
        permissionsApi.getAll(),
        departmentsApi.getAll(),
      ]);
      setRoles(rolesRes.data.data);
      setAllPermissions(permsRes.data.data);
      setAllDepartments(deptsRes.data.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  const closeModal = () => setModal(null);
  const handleDone = () => { closeModal(); void fetchData(); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{roles.length} role{roles.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New Role
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No roles yet. Create one to get started.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Permissions</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Departments</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{role.name}</span>
                      {role.isSystem && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          SYSTEM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{role.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {role.departments.length === 0 ? (
                      <span className="text-gray-300 text-xs">All</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {role.departments.map((d) => (
                          <span key={d.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-100">
                            {d.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ type: 'edit', role })}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setModal({ type: 'delete', role })}
                        disabled={role.isSystem}
                        title={role.isSystem ? 'System roles cannot be deleted' : 'Delete'}
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
        )}
      </div>

      {modal?.type === 'create' && (
        <RoleFormModal
          allPermissions={allPermissions}
          allDepartments={allDepartments}
          onClose={closeModal}
          onDone={handleDone}
        />
      )}
      {modal?.type === 'edit' && (
        <RoleFormModal
          role={modal.role}
          allPermissions={allPermissions}
          allDepartments={allDepartments}
          onClose={closeModal}
          onDone={handleDone}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteRoleModal role={modal.role} onClose={closeModal} onDone={handleDone} />
      )}
    </div>
  );
}
