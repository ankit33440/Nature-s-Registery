import { ReactNode } from 'react';
import { UserRole } from '../../types/user.types';

export type SidebarItem = {
  label: string;
  to?: string;
  icon: ReactNode;
};

const adminMenu: SidebarItem[] = [
  {
    label: 'Home',
    to: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    label: 'User Management',
    to: '/admin/users',
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    label: 'Roles',
    to: '/admin/roles',
    icon: <RolesIcon className="h-5 w-5" />,
  },
  {
    label: 'Permissions',
    to: '/admin/permissions',
    icon: <PermissionsIcon className="h-5 w-5" />,
  },
  {
    label: 'Departments',
    to: '/admin/departments',
    icon: <DepartmentsIcon className="h-5 w-5" />,
  },
  { label: 'Verification', icon: <VerificationIcon className="h-5 w-5" /> },
  { label: 'Certification', icon: <CertificationIcon className="h-5 w-5" /> },
  { label: 'Credits', icon: <CreditsIcon className="h-5 w-5" /> },
  { label: 'Transactions', icon: <TransactionsIcon className="h-5 w-5" /> },
  { label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> },
  { label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
];

const developerMenu: SidebarItem[] = [
  {
    label: 'Home',
    to: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon className="h-5 w-5" /> },
  { label: 'Transactions', icon: <TransactionsIcon className="h-5 w-5" /> },
  { label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> },
  { label: 'Drafts', icon: <DraftsIcon className="h-5 w-5" /> },
  { label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
];

const verifierMenu: SidebarItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon className="h-5 w-5" /> },
  { label: 'Verification', icon: <VerificationIcon className="h-5 w-5" /> },
  { label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> },
  { label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
];

const certifierMenu: SidebarItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon className="h-5 w-5" /> },
  { label: 'Certification', icon: <CertificationIcon className="h-5 w-5" /> },
  { label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> },
  { label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
];

const buyerMenu: SidebarItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon className="h-5 w-5" /> },
  { label: 'Credits', icon: <CreditsIcon className="h-5 w-5" /> },
  { label: 'Transactions', icon: <TransactionsIcon className="h-5 w-5" /> },
  { label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> },
  { label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
];

function buildDynamicMenu(permissions: string[]): SidebarItem[] {
  const items: SidebarItem[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
  ];
  if (permissions.some((p) => p.startsWith('projects:')))
    items.push({ label: 'Projects', to: '/projects', icon: <ProjectsIcon className="h-5 w-5" /> });
  if (permissions.some((p) => p.startsWith('verification:')))
    items.push({ label: 'Verification', icon: <VerificationIcon className="h-5 w-5" /> });
  if (permissions.some((p) => p.startsWith('certification:')))
    items.push({ label: 'Certification', icon: <CertificationIcon className="h-5 w-5" /> });
  if (permissions.some((p) => p.startsWith('reports:')))
    items.push({ label: 'Reports', icon: <ReportsIcon className="h-5 w-5" /> });
  items.push({ label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> });
  return items;
}

export function getSidebarItems(role?: UserRole | null, permissions: string[] = []): SidebarItem[] {
  switch (role) {
    case UserRole.PROJECT_DEVELOPER:
      return developerMenu;
    case UserRole.VERIFIER:
    case UserRole.CERTIFIER:
      return permissions.length > 0 ? buildDynamicMenu(permissions) : (role === UserRole.VERIFIER ? verifierMenu : certifierMenu);
    case UserRole.BUYER:
      return buyerMenu;
    case UserRole.SUPERADMIN:
    default:
      return adminMenu;
  }
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
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

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 3l6 6H4l6-6zM6 9v6M10 9v8M14 9v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerificationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5l5.5 2v4.6c0 3.3-1.9 6.2-5.5 8.4-3.6-2.2-5.5-5.1-5.5-8.4V4.5l5.5-2z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.6 9.9l1.6 1.7 3.2-3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CertificationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 3l4.5 2.5v5L10 13 5.5 10.5v-5L10 3z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 7.4l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3.8-1.6z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 13l-1 4 3.6-1.9L13.6 17l-1-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CreditsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2.5l6 3.5v8L10 17.5 4 14V6l6-3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TransactionsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 6h11M11 3l4 3-4 3M16 14H5M9 11l-4 3 4 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect
        x="3.5"
        y="3.5"
        width="13"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 13V9M10 13V6M13 13v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DraftsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4.5 14.5 13.8 5.2a1.8 1.8 0 1 1 2.5 2.5L7 17H4.5v-2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m11.8 7.2 2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 3l1.2 1.1 1.7-.2.6 1.6 1.5.8-.8 1.5.2 1.7-1.6.6L10 13l-1.1-1.2-1.7.2-.6-1.6-1.5-.8.8-1.5-.2-1.7 1.6-.6L10 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RolesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 17c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.5 3.5l1.5 1.5-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PermissionsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="4" y="8.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 8.5V6a3 3 0 0 1 6 0v2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

function DepartmentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="7.5" y="2.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="13.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 6.5v3M10 9.5H4.5v4M10 9.5h5.5v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
