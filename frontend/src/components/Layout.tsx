import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SidebarItem = {
  label: string;
  to?: string;
  icon: React.ReactNode;
};

const primaryItems: SidebarItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    label: "User Management",
    to: "/admin/users",
    icon: <UsersIcon className="h-5 w-5" />,
  },
  { label: "Projects", icon: <ProjectsIcon className="h-5 w-5" /> },
  { label: "Verification", icon: <VerificationIcon className="h-5 w-5" /> },
  { label: "Certification", icon: <CertificationIcon className="h-5 w-5" /> },
  { label: "Credits", icon: <CreditsIcon className="h-5 w-5" /> },
  { label: "Transactions", icon: <TransactionsIcon className="h-5 w-5" /> },
  { label: "Reports", icon: <ReportsIcon className="h-5 w-5" /> },
  { label: "Settings", icon: <SettingsIcon className="h-5 w-5" /> },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const onCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const roleLabel = user?.role.replace(/_/g, " ").toLowerCase() ?? "admin";
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "AS";

  return (
    <div className="min-h-screen bg-[#eef1f4] text-stone-900">
      <header className="fixed inset-x-0 top-0 z-30 h-20 border-b border-slate-700 bg-[#1f313d]">
        <div className="flex h-full items-center gap-3 px-4 md:pl-[104px] md:pr-5 lg:pl-[248px] lg:pr-8">
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 transition-colors hover:bg-white/10"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <RegistryMark className="h-10 w-10 shrink-0" />
          </div>

          <div className="min-w-0 flex-1">
            <label className="relative block max-w-[560px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 sm:left-5">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search projects, issuers, or serial numbers..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none sm:h-12 sm:pl-14 sm:text-[15px]"
              />
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-white sm:gap-3 lg:gap-5">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition-colors hover:bg-white/10">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#1f313d] bg-red-500" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition-colors hover:bg-white/10">
              <HelpIcon className="h-5 w-5" />
            </button>
            <div className="hidden h-10 w-px bg-white/15 sm:block" />
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right leading-tight">
                <p className="text-[13px] font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="mt-1 text-[11px] capitalize text-slate-300">
                  {roleLabel}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#bce6d8] bg-[#efd8b3] text-[14px] font-bold text-slate-900">
                {initials}
              </div>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 md:hidden",
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onCloseMobileSidebar}
      />

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={onCloseMobileSidebar}
      />

      <div className="pt-20 md:pl-[104px] lg:pl-[220px]">
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  isMobileOpen,
  onCloseMobile,
}: {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-stone-200 bg-white transition-transform duration-300 ease-out md:w-[104px] lg:w-[220px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-20 items-center justify-between border-b border-stone-200 px-4 md:justify-center md:px-3 lg:justify-start lg:px-4">
        <div className="flex items-center gap-3">
          <RegistryMark className="h-11 w-11 shrink-0" />
          <div className="md:hidden lg:block">
            <p className="text-[17px] font-bold leading-[0.95] tracking-[-0.03em] text-slate-900">
              Nature&apos;s Registry
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onCloseMobile}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-100 md:hidden"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 pt-4">
        <nav className="space-y-1 px-2 lg:px-0">
          {primaryItems.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors md:justify-center md:px-0 lg:justify-start lg:rounded-none lg:px-4 lg:py-[14px]",
                    isActive
                      ? "bg-[#20323e] text-white"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-700",
                  ].join(" ")
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="md:hidden lg:block">{item.label}</span>
              </NavLink>
            ) : (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left text-[15px] font-medium text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-700 md:justify-center md:px-0 lg:justify-start lg:rounded-none lg:px-4 lg:py-[14px]"
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="md:hidden lg:block">{item.label}</span>
              </button>
            ),
          )}
        </nav>
      </div>

      <div className="px-3 pb-5 lg:px-4">
        <div className="rounded-2xl bg-stone-50 p-4 md:px-2 md:py-3 lg:p-4">
          <p className="text-[11px] font-semibold text-stone-600 md:hidden lg:block">
            Registry Capacity
          </p>
          <div className="mt-3 h-2 rounded-full bg-stone-200 md:mt-0 lg:mt-3">
            <div className="h-2 w-[74%] rounded-full bg-[#20323e]" />
          </div>
          <p className="mt-3 text-[11px] text-stone-500 md:hidden lg:block">
            7.4M / 10M tCO2e Tracked
          </p>
        </div>
      </div>
    </aside>
  );
}

function RegistryMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 46" className={className} fill="none">
      <rect width="46" height="46" rx="12" fill="#20323E" />
      <path d="M4 4h38v38H4z" fill="#20323E" />
      <path d="M4 4h19L4 23V4z" fill="#C6E42E" />
      <path d="M23 4h15L18 24 9.5 15.5 23 4z" fill="#F0E948" />
      <path d="M4 27l11-11 10 10L15 38.5 4 27z" fill="#8AD6DD" />
      <path d="M15 38.5L25 26l13 12.5H15z" fill="#4B8397" />
    </svg>
  );
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle
        cx="8.5"
        cy="8.5"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12.5 12.5L17 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M6.5 8a3.5 3.5 0 117 0v2.7l1.3 2H5.2l1.3-2V8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 15a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.8 7.6A1.8 1.8 0 0110.4 7c1 0 1.9.6 1.9 1.7 0 1.8-2.3 1.7-2.3 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.5" r=".8" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4 6h12M4 10h12M4 14h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
