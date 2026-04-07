import { ReactNode } from 'react';

type SummaryCardData = {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent?: string;
};

type ProjectStatus = 'LISTING' | 'ISSUANCE' | 'VERIFICATION' | 'CERTIFICATION';

type ProjectRow = {
  name: string;
  methodology: string;
  status: ProjectStatus;
  issued: string;
  retired: string;
  id: string;
  dotColor: string;
};

type AlertTone = 'red' | 'rose';

type AlertItem = {
  title: string;
  message: string;
  meta: string;
  cta: string;
  age: string;
  tone: AlertTone;
};

type TransactionStatus = 'COMPLETED' | 'PENDING';

type TransactionItem = {
  id: string;
  type: 'Trade' | 'Retirement' | 'Transfer';
  date: string;
  volume: string;
  status: TransactionStatus;
};

type ActivityTone = 'green' | 'indigo' | 'rose';

type ActivityItem = {
  title: string;
  description: string;
  time: string;
  tone: ActivityTone;
  icon: ReactNode;
};

const summaryCards: SummaryCardData[] = [
  {
    title: 'TOTAL PROJECTS',
    value: '248',
    subtitle: '+12 this quarter',
    accent: 'text-emerald-700',
    icon: <ProjectsIcon className="h-6 w-6" />,
  },
  {
    title: 'ISSUED CREDITS',
    value: '1.2M',
    subtitle: 'Metric Tons CO2e',
    icon: <IssuedIcon className="h-6 w-6" />,
  },
  {
    title: 'RETIRED CREDITS',
    value: '450K',
    subtitle: 'Permanently Off-set',
    icon: <RetiredIcon className="h-6 w-6" />,
  },
  {
    title: 'BUFFER CREDITS',
    value: '50K',
    subtitle: 'Risk Management Pool',
    icon: <ShieldIcon className="h-6 w-6" />,
  },
];

const activeProjects: ProjectRow[] = [
  {
    name: 'Amazonia Reforest Alpha',
    methodology: 'ARR-V03',
    status: 'LISTING',
    issued: '0',
    retired: '0',
    id: 'REG-29401',
    dotColor: 'bg-green-700',
  },
  {
    name: 'Congo Basin Preservation',
    methodology: 'REDD+ NM',
    status: 'ISSUANCE',
    issued: '1,250,000',
    retired: '940,000',
    id: 'REG-18823',
    dotColor: 'bg-indigo-600',
  },
  {
    name: 'Sumatra Peatland Restoration',
    methodology: 'WRC-V02',
    status: 'VERIFICATION',
    issued: '420,000',
    retired: '5,000',
    id: 'REG-04552',
    dotColor: 'bg-fuchsia-800',
  },
  {
    name: 'Gujarat Wind Harvester',
    methodology: 'ACM0002',
    status: 'CERTIFICATION',
    issued: '840,000',
    retired: '125,000',
    id: 'REG-88201',
    dotColor: 'bg-stone-300',
  },
];

const criticalAlerts: AlertItem[] = [
  {
    title: 'RECONCILIATION ISSUE',
    message: 'Discrepancy detected in Serial Range: #203-902-X',
    meta: 'Run Audit Now',
    cta: 'Run Audit Now',
    age: '2h ago',
    tone: 'red',
  },
  {
    title: 'RECONCILIATION ISSUE',
    message: 'Discrepancy detected in Serial Range: #203-902-X',
    meta: 'Run Audit Now',
    cta: 'Run Audit Now',
    age: '2h ago',
    tone: 'red',
  },
  {
    title: 'RECONCILIATION ISSUE',
    message: 'Discrepancy detected in Serial Range: #203-902-X',
    meta: 'Run Audit Now',
    cta: 'Run Audit Now',
    age: '2h ago',
    tone: 'red',
  },
  {
    title: 'VERIFICATION DELAY',
    message: 'Project ID: REG-04552 is exceeding SLA',
    meta: 'Assigned to: DNV GL Verification',
    cta: 'Assigned to: DNV GL Verification',
    age: '1d ago',
    tone: 'rose',
  },
  {
    title: 'VERIFICATION DELAY',
    message: 'Project ID: REG-04552 is exceeding SLA',
    meta: 'Assigned to: DNV GL Verification',
    cta: 'Assigned to: DNV GL Verification',
    age: '1d ago',
    tone: 'rose',
  },
];

const recentTransactions: TransactionItem[] = [
  { id: '#TR-9283-481', type: 'Trade', date: 'Oct 24, 2024', volume: '12,500', status: 'COMPLETED' },
  { id: '#RT-1049-592', type: 'Retirement', date: 'Oct 22, 2024', volume: '4,000', status: 'COMPLETED' },
  { id: '#TR-8812-302', type: 'Transfer', date: 'Oct 19, 2024', volume: '50,000', status: 'PENDING' },
];

const methodologyData = [
  { label: 'Reforestation', value: 54, color: '#136f2a' },
  { label: 'Conservation', value: 32, color: '#505db8' },
  { label: 'Technical', value: 14, color: '#983761' },
];

const issuanceBars = [
  { month: 'JAN', value: 28, color: 'bg-stone-100' },
  { month: 'FEB', value: 58, color: 'bg-stone-100' },
  { month: 'MAR', value: 42, color: 'bg-slate-300' },
  { month: 'APR', value: 78, color: 'bg-sky-700' },
  { month: 'MAY', value: 61, color: 'bg-sky-900/90' },
  { month: 'JUN', value: 92, color: 'bg-slate-800' },
];

const recentActivity: ActivityItem[] = [
  {
    title: 'Credits Issued',
    description: '50,000 tCO2e issued to Amazonia Reforest Alpha',
    time: 'Today, 09:45 AM',
    tone: 'green',
    icon: <CreditsIssuedIcon className="h-5 w-5" />,
  },
  {
    title: 'Registry Sync Complete',
    description: 'Cross-chain reconciliation with Toucan Protocol',
    time: 'Yesterday, 11:30 PM',
    tone: 'indigo',
    icon: <SyncIcon className="h-5 w-5" />,
  },
  {
    title: 'New User Access',
    description: 'Sarah J. invited as External Auditor (PWC)',
    time: 'Oct 24, 02:15 PM',
    tone: 'rose',
    icon: <UserAccessIcon className="h-5 w-5" />,
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  LISTING: 'bg-indigo-100 text-indigo-800',
  ISSUANCE: 'bg-stone-200 text-stone-700',
  VERIFICATION: 'bg-lime-200 text-green-800',
  CERTIFICATION: 'bg-rose-100 text-rose-900',
};

const transactionStyles: Record<TransactionStatus, string> = {
  COMPLETED: 'bg-lime-200 text-green-900',
  PENDING: 'bg-stone-200 text-stone-700',
};

export function AdminOverviewDashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.03em] text-emerald-950 sm:text-[42px]">
            The Registry Overview
          </h1>
        </div>
        <button className="inline-flex h-12 items-center justify-center gap-3 self-start whitespace-nowrap bg-slate-900 px-6 text-base font-semibold text-white shadow-[0_8px_24px_rgba(19,36,49,0.16)] transition-colors hover:bg-slate-800">
          <PlusIcon className="h-4 w-4" />
          Register New Project
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.9fr)_400px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[18px] font-semibold text-stone-900 sm:text-[20px]">
                Active Projects
              </h2>
              <button className="inline-flex h-12 items-center gap-3 bg-slate-100 px-5 text-[15px] font-semibold text-slate-600">
                <FilterIcon className="h-4 w-4" />
                All Statuses
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full">
                <thead>
                  <tr className="bg-stone-50 text-left">
                    {['PROJECT NAME', 'METHODOLOGY', 'STATUS', 'ISSUED', 'RETIRED', 'ACTION'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-[11px] font-semibold tracking-[0.14em] text-stone-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeProjects.map((project) => (
                    <tr key={project.id} className="border-t border-stone-100 bg-white">
                      <td className="px-6 py-7">
                        <div className="flex items-center gap-5">
                          <span className={`h-5 w-5 rounded-full ${project.dotColor}`} />
                          <div>
                            <p className="max-w-[230px] text-[20px] font-semibold leading-[1.18] text-stone-900">
                              {project.name}
                            </p>
                            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-stone-400">
                              ID: {project.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-7 text-[18px] text-stone-600">{project.methodology}</td>
                      <td className="px-6 py-7">
                        <span className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold ${statusStyles[project.status]}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-7 text-right font-mono text-[18px] text-stone-800">{project.issued}</td>
                      <td className="px-6 py-7 text-right font-mono text-[18px] text-stone-800">{project.retired}</td>
                      <td className="px-6 py-7">
                        <div className="flex justify-end gap-2">
                          <button className="flex h-11 w-11 items-center justify-center rounded-md border border-red-500 text-red-600">
                            <CloseIcon className="h-5 w-5" />
                          </button>
                          <button className="flex h-11 w-11 items-center justify-center rounded-md border border-green-700 text-green-700">
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-stone-100 px-6 py-5 text-[15px] text-stone-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing 4 of 142 Active Projects</p>
              <button className="inline-flex items-center gap-2 text-[18px] font-semibold text-slate-800">
                View All Projects
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
              <h2 className="text-[18px] font-semibold text-stone-900 sm:text-[20px]">
                Recent Transactions
              </h2>
              <button className="inline-flex items-center gap-2 text-[16px] font-semibold text-slate-800">
                View All Transactions
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full">
                <thead>
                  <tr className="bg-stone-50 text-left">
                    {['TRANSACTION ID', 'TYPE', 'DATE', 'VOLUME', 'STATUS'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-[11px] font-semibold tracking-[0.14em] text-stone-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-stone-100">
                      <td className="px-6 py-6 text-[16px] text-stone-500">{transaction.id}</td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-3 text-[18px] text-stone-900">
                          {transaction.type === 'Trade' ? (
                            <TradeIcon className="h-5 w-5 text-green-700" />
                          ) : transaction.type === 'Retirement' ? (
                            <RetirementTypeIcon className="h-5 w-5 text-indigo-700" />
                          ) : (
                            <TransferIcon className="h-5 w-5 text-stone-400" />
                          )}
                          {transaction.type}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-[18px] text-stone-500">{transaction.date}</td>
                      <td className="px-6 py-6">
                        <span className="text-[18px] font-semibold text-stone-900">{transaction.volume}</span>
                        <span className="ml-1 text-[14px] text-stone-400">tCO2e</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold ${transactionStyles[transaction.status]}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="px-6 py-6">
              <h3 className="text-[18px] font-semibold text-stone-900">
                Distribution by Methodology
              </h3>
              <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center">
                <DonutChart />
                <div className="flex-1 space-y-3">
                  {methodologyData.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 text-[16px]">
                      <div className="flex items-center gap-3 text-stone-800">
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </div>
                      <span className="font-semibold text-stone-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="px-6 py-6">
              <h3 className="text-[18px] font-semibold text-stone-900">
                Monthly Issuance Volume
              </h3>
              <div className="mt-10 flex h-[240px] items-end gap-4">
                {issuanceBars.map((bar) => (
                  <div key={bar.month} className="flex flex-1 flex-col items-center gap-4">
                    <div className={`w-full rounded-t-[4px] ${bar.color}`} style={{ height: `${bar.value}%` }} />
                    <span className="text-[13px] font-semibold tracking-[0.08em] text-stone-700">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 px-1 pt-1 text-stone-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-semibold tracking-[0.22em]">
              © 2026 NATURE&apos;S REGISTRY • ALL RIGHT RESERVED
            </p>
            <p className="text-[12px] font-semibold tracking-[0.18em]">PRIVACY</p>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="border-red-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <AlertIcon className="h-8 w-8 text-red-600" />
              <h2 className="text-[18px] font-semibold text-stone-900">
                Critical Alerts
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {criticalAlerts.map((alert, index) => (
                <AlertCard key={`${alert.title}-${index}`} alert={alert} />
              ))}
            </div>

            <button className="mt-6 inline-flex items-center gap-2 text-[18px] font-semibold text-slate-800">
              View All Alerts
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </Card>

          <Card className="px-6 py-6">
            <h3 className="text-[18px] font-semibold text-stone-900">Recent Activity</h3>
            <div className="mt-6 space-y-6">
              {recentActivity.map((item, index) => (
                <ActivityRow
                  key={item.title}
                  item={item}
                  showLine={index !== recentActivity.length - 1}
                />
              ))}
            </div>
            <button className="mt-8 flex h-12 w-full items-center justify-center bg-stone-50 text-[14px] font-semibold tracking-[0.18em] text-stone-700">
              VIEW ALL ACTIVITY
            </button>
          </Card>

          <div className="overflow-hidden border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-50 px-8 py-8">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-stone-500">
              REGISTRY REPORT
            </p>
            <h3 className="mt-4 max-w-[270px] text-[20px] font-semibold leading-[1.25] text-emerald-950">
              Q4 Environmental Impact Disclosure is now ready.
            </h3>
            <button className="mt-8 inline-flex h-12 items-center justify-center bg-slate-900 px-8 text-[15px] font-semibold text-white">
              DOWNLOAD PDF
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon, accent }: SummaryCardData) {
  return (
    <Card className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-stone-500">
            {title}
          </p>
          <p className="mt-5 text-[50px] font-bold leading-none tracking-[-0.04em] text-emerald-950">
            {value}
          </p>
          <p className={`mt-4 text-[13px] ${accent ?? 'text-stone-600'}`}>{subtitle}</p>
        </div>
        <span className="text-emerald-700">{icon}</span>
      </div>
    </Card>
  );
}

function AlertCard({ alert }: { alert: AlertItem }) {
  const toneClass =
    alert.tone === 'red'
      ? 'border-l-red-700'
      : 'border-l-rose-500';

  return (
    <div className={`rounded-2xl border border-stone-100 border-l-4 bg-white px-6 py-5 shadow-[0_12px_24px_rgba(20,31,38,0.06)] ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <p className={`text-[11px] font-semibold ${alert.tone === 'red' ? 'text-red-700' : 'text-rose-600'}`}>
          {alert.title}
        </p>
        <span className="text-[11px] text-stone-400">{alert.age}</span>
      </div>
      <p className="mt-3 text-[17px] font-semibold leading-[1.35] text-stone-900">
        {alert.message}
      </p>
      <p className="mt-4 text-[11px] text-stone-500">{alert.meta}</p>
      {alert.tone === 'red' && (
        <button className="mt-4 text-[13px] font-semibold text-green-800 underline underline-offset-2">
          {alert.cta}
        </button>
      )}
    </div>
  );
}

function ActivityRow({ item, showLine }: { item: ActivityItem; showLine: boolean }) {
  const toneClasses: Record<ActivityTone, string> = {
    green: 'bg-lime-100 text-green-800',
    indigo: 'bg-indigo-100 text-indigo-700',
    rose: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${toneClasses[item.tone]}`}>
          {item.icon}
        </div>
        {showLine && <div className="mt-2 h-full w-px bg-stone-200" />}
      </div>
      <div className="pb-1">
        <p className="text-[18px] font-semibold text-stone-900">{item.title}</p>
        <p className="mt-1 text-[15px] leading-[1.45] text-stone-600">{item.description}</p>
        <p className="mt-3 text-[13px] text-stone-400">{item.time}</p>
      </div>
    </div>
  );
}

function DonutChart() {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { value: 54, color: '#203644' },
    { value: 32, color: '#b8bec5' },
    { value: 14, color: '#eef1f2' },
  ];

  let offset = 0;

  return (
    <div className="relative mx-auto h-[240px] w-[240px] shrink-0">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#eef1f2" strokeWidth="22" />
        {segments.map((segment) => {
          const dash = (segment.value / 100) * circumference;
          const circle = (
            <circle
              key={segment.color}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="22"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[38px] font-bold leading-none text-stone-900">54%</p>
        <p className="mt-1 text-[16px] font-semibold text-stone-600">ARR</p>
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border border-stone-200 bg-white ${className}`}>{children}</div>;
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IssuedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.4 2.2 3.2-.5.9 3.1 2.9 1.5-1.5 2.9.5 3.2-3.1.9L15 22l-3-1.6L9 22l-2-2.4-3.1-.9.5-3.2L3 12.5 5.9 11 6.8 7.9l3.2.5L12 2z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.7 12.1l2.2 2.3 4.4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RetiredIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v5c0 5.1-2.9 8.8-7 10-4.1-1.2-7-4.9-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4.5 10.5l3.4 3.4L15.5 6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10h12M11 4.5L16.5 10 11 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4l8 15H4L12 4z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9.2v4.8M12 17.2h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TradeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 7h10M10 3l4 4-4 4M16 13H6M10 17l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RetirementTypeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.5 10h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TransferIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3.5 7.5h8M8.5 3.5l4 4-4 4M16.5 12.5h-8M11.5 8.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CreditsIssuedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 12.5l2 2 4-5M21 12a9 9 0 11-4.2-7.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SyncIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7.5 7.5H4v-3M16.5 16.5H20v3M5 10a7 7 0 0112-3.5L20 9M19 14a7 7 0 01-12 3.5L4 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserAccessIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 11a4 4 0 100-8 4 4 0 000 8zM18 8v6M15 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
