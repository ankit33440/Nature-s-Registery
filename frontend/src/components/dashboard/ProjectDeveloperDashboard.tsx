type VintageRow = {
  label: string;
  value: string;
  percent: number;
  tone: string;
};

type ProjectCard = {
  name: string;
  id: string;
  standard: string;
  statusLabel: string;
  statusTone: string;
  serialLabel?: string;
  showTimeline: boolean;
  activeStep?: number;
};

type SerialRangeCard = {
  block: string;
  range: string;
  quantity: string;
  status: string;
  statusTone: string;
  highlighted?: boolean;
};

type TransactionRow = {
  id: string;
  type: 'Trade' | 'Retirement' | 'Transfer';
  date: string;
  volume: string;
  status: 'COMPLETED' | 'PENDING';
};

const vintageRows: VintageRow[] = [
  { label: 'Vintage 2023', value: '450k', percent: 80, tone: 'bg-green-700' },
  { label: 'Vintage 2022', value: '320k', percent: 58, tone: 'bg-green-400' },
  { label: 'Vintage 2021', value: '185k', percent: 38, tone: 'bg-green-200' },
];

const projects: ProjectCard[] = [
  {
    name: 'Amazon Rainshield Reforestation',
    id: 'CR-BRA-2024-001',
    standard: 'Verra Standard',
    statusLabel: 'VERIFIED',
    statusTone: 'bg-lime-200 text-green-900',
    serialLabel: 'VCS-1294',
    showTimeline: true,
    activeStep: 3,
  },
  {
    name: 'Patagonia Wind Initiative',
    id: 'CR-ARG-2023-042',
    standard: 'Gold Standard',
    statusLabel: 'RECERTIFICATION PENDING',
    statusTone: 'bg-rose-100 text-rose-800',
    showTimeline: false,
  },
];

const serialRanges: SerialRangeCard[] = [
  {
    block: 'BLOCK A (2023)',
    range: 'VCS-2023-BR-001-900234-950234',
    quantity: 'Qty: 50,000 units',
    status: 'AVAILABLE',
    statusTone: 'text-green-700',
    highlighted: true,
  },
  {
    block: 'BLOCK B (2022)',
    range: 'VCS-2022-BR-001-400500-410500',
    quantity: 'Qty: 10,000 units',
    status: 'RETIRED',
    statusTone: 'text-indigo-600',
  },
];

const transactions: TransactionRow[] = [
  {
    id: '#TR-9283-481',
    type: 'Trade',
    date: 'Oct 24, 2024',
    volume: '12,500',
    status: 'COMPLETED',
  },
  {
    id: '#RT-1049-592',
    type: 'Retirement',
    date: 'Oct 22, 2024',
    volume: '4,000',
    status: 'COMPLETED',
  },
  {
    id: '#TR-8812-302',
    type: 'Transfer',
    date: 'Oct 19, 2024',
    volume: '50,000',
    status: 'PENDING',
  },
];

const timelineSteps = [
  'Listing',
  'Submission',
  'Verification',
  'Certification',
  'Issuance',
];

const documentItems = [
  { label: 'Certification', icon: <SealIcon className="h-8 w-8" /> },
  { label: 'Issuance', icon: <DocumentIcon className="h-8 w-8" /> },
  { label: 'Impact Report', icon: <ClipboardIcon className="h-8 w-8" /> },
  { label: 'Batch CSV', icon: <UploadCloudIcon className="h-8 w-8" /> },
];

function Surface({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`border border-stone-200 bg-white ${className}`}>{children}</section>;
}

function TopMetricCard() {
  return (
    <Surface className="p-6 sm:p-9">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600">
        Total Issued Credits
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <span className="text-[50px] font-semibold leading-none tracking-[-0.05em] text-stone-900 sm:text-[62px]">
          1,284,500
        </span>
        <span className="pb-1 text-[24px] font-medium text-stone-400">tCO2e</span>
      </div>
      <div className="mt-10 flex flex-wrap gap-6 text-stone-500">
        <div className="min-w-[120px]">
          <p className="text-[16px]">Available</p>
          <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-green-700">842,000</p>
        </div>
        <div className="hidden h-10 w-px bg-stone-200 sm:block" />
        <div className="min-w-[120px]">
          <p className="text-[16px]">Retired</p>
          <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-teal-500">442,500</p>
        </div>
      </div>
    </Surface>
  );
}

function VintageDistributionCard() {
  return (
    <Surface className="p-6">
      <div className="flex items-center gap-3">
        <ClockwiseIcon className="h-5 w-5 text-green-700" />
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">
          Vintage Distribution
        </h2>
      </div>
      <div className="mt-7 space-y-5">
        {vintageRows.map((row) => (
          <div key={row.label}>
            <div className="mb-3 flex items-center justify-between gap-3 text-[16px] text-stone-600">
              <span>{row.label}</span>
              <span className="font-semibold text-stone-900">{row.value}</span>
            </div>
            <div className="h-[8px] rounded-full bg-stone-100">
              <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function IssuesCard() {
  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between gap-4">
        <AlertTriangleIcon className="mt-1 h-8 w-8 text-red-600" />
        <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Action Required
        </span>
      </div>
      <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em] text-stone-700">
        Pending Issues
      </p>
      <p className="mt-2 max-w-[260px] text-[24px] font-semibold leading-tight tracking-[-0.03em] text-stone-900">
        2 Verification Non-Conformances
      </p>
      <button className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-[16px] font-semibold text-white transition-colors hover:bg-slate-800">
        Resolve Issues
      </button>
    </Surface>
  );
}

function ProjectVisual() {
  return (
    <div className="h-14 w-14 overflow-hidden rounded-xl border border-sky-100 bg-[radial-gradient(circle_at_30%_22%,rgba(120,214,255,0.95),rgba(31,102,145,0.85)_32%,rgba(42,66,50,0.98)_70%),linear-gradient(180deg,#6fd7ff_0%,#0f6f99_34%,#304732_100%)]">
      <div className="h-full w-full bg-[radial-gradient(circle_at_20%_78%,rgba(195,150,88,0.95),rgba(118,83,43,0.98)_18%,transparent_19%),radial-gradient(circle_at_42%_74%,rgba(203,163,99,0.95),rgba(114,81,42,0.98)_19%,transparent_20%),radial-gradient(circle_at_62%_76%,rgba(212,175,112,0.92),rgba(113,82,43,0.98)_18%,transparent_19%),radial-gradient(circle_at_78%_73%,rgba(202,162,97,0.92),rgba(111,80,42,0.98)_16%,transparent_17%),radial-gradient(circle_at_34%_55%,rgba(39,122,84,0.95),rgba(15,83,54,0.95)_22%,transparent_23%),radial-gradient(circle_at_70%_52%,rgba(53,136,93,0.95),rgba(18,87,57,0.98)_22%,transparent_23%)]" />
    </div>
  );
}

function ActiveProjectsSection() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-stone-900">Active Projects</h2>
        <button className="inline-flex items-center gap-2 text-[18px] font-semibold text-slate-800">
          View all
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5">
        {projects.map((project) => (
          <Surface key={project.name} className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <ProjectVisual />
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-stone-900">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[14px] text-stone-500">
                      ID: {project.id} • {project.standard}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start">
                  <span className={`rounded-full px-4 py-2 text-sm font-semibold ${project.statusTone}`}>
                    {project.statusLabel}
                  </span>
                  {project.serialLabel ? (
                    <span className="rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-600">
                      {project.serialLabel}
                    </span>
                  ) : (
                    <button className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
                      <DotsVerticalIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {project.showTimeline && (
                <div className="pt-3">
                  <div className="relative mx-4 flex items-start justify-between before:absolute before:left-0 before:right-0 before:top-[14px] before:h-px before:bg-stone-200">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = (project.activeStep ?? 0) > index;
                      const isCurrent = project.activeStep === index;

                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center text-center">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold ${
                              isCompleted
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : isCurrent
                                  ? 'border-[#d5e3d4] bg-[#dbe9d7] text-slate-900'
                                  : 'border-stone-100 bg-stone-100 text-stone-300'
                            }`}
                          >
                            {isCompleted ? <CheckIcon className="h-3.5 w-3.5" /> : ''}
                          </span>
                          <span
                            className={`mt-4 text-[14px] font-semibold ${
                              !isCompleted && !isCurrent ? 'text-stone-300' : 'text-slate-800'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Surface>
        ))}
      </div>
    </section>
  );
}

function SerialRangesCard() {
  return (
    <Surface className="p-6">
      <div className="flex items-center gap-3">
        <LedgerIcon className="h-5 w-5 text-indigo-600" />
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">
          Issued Serial Ranges
        </h2>
      </div>
      <div className="mt-7 space-y-4">
        {serialRanges.map((item) => (
          <div
            key={item.block}
            className={`rounded-2xl border p-4 ${
              item.highlighted ? 'border-stone-100 bg-white shadow-[0_8px_24px_rgba(20,31,38,0.05)]' : 'border-dashed border-stone-200 bg-stone-50/70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-stone-400">
                  {item.block}
                </p>
                <p className="mt-2 text-[15px] font-semibold tracking-[0.02em] text-stone-800">
                  {item.range}
                </p>
                <p className="mt-3 text-[14px] text-stone-500">{item.quantity}</p>
              </div>
              <span className={`text-[14px] font-semibold ${item.statusTone}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function DocumentHubCard() {
  return (
    <Surface className="p-6">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">Document Hub</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {documentItems.map((item) => (
          <button
            key={item.label}
            className="flex min-h-[124px] flex-col items-center justify-center rounded-2xl bg-stone-100/80 px-4 text-center text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            {item.icon}
            <span className="mt-4 text-[16px] font-semibold text-stone-800">{item.label}</span>
          </button>
        ))}
      </div>
    </Surface>
  );
}

function TransactionsSection() {
  return (
    <Surface className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-stone-900">Recent Transactions</h2>
        <button className="inline-flex items-center gap-2 text-[16px] font-semibold text-slate-800">
          View All Transactions
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full">
          <thead>
            <tr className="bg-stone-50">
              {['TRANSACTION ID', 'TYPE', 'DATE', 'VOLUME', 'STATUS'].map((label) => (
                <th
                  key={label}
                  className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-stone-100">
                <td className="px-6 py-6 text-[15px] tracking-[0.04em] text-stone-500">{transaction.id}</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3 text-[16px] font-medium text-stone-900">
                    <TransactionTypeIcon type={transaction.type} />
                    {transaction.type}
                  </div>
                </td>
                <td className="px-6 py-6 text-[16px] text-stone-500">{transaction.date}</td>
                <td className="px-6 py-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">
                      {transaction.volume}
                    </span>
                    <span className="text-[15px] text-stone-400">tCO2e</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span
                    className={`rounded-full px-4 py-1.5 text-[14px] font-semibold ${
                      transaction.status === 'COMPLETED'
                        ? 'bg-lime-300 text-green-900'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

export function ProjectDeveloperDashboard() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-[40px] font-semibold tracking-[-0.05em] text-emerald-950 sm:text-[56px]">
          Projects Developer
        </h1>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex h-12 items-center justify-center gap-3 px-5 text-[18px] font-semibold text-slate-800 transition-colors hover:text-slate-900">
            <DownloadIcon className="h-5 w-5" />
            Export Ledger
          </button>
          <button className="inline-flex h-12 items-center justify-center gap-3 bg-slate-900 px-6 text-[18px] font-semibold text-white shadow-[0_8px_24px_rgba(19,36,49,0.18)] transition-colors hover:bg-slate-800">
            <PlusIcon className="h-4 w-4" />
            Register New Project
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_0.72fr_0.72fr]">
        <TopMetricCard />
        <VintageDistributionCard />
        <IssuesCard />
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.65fr)_0.75fr]">
        <div className="space-y-5">
          <ActiveProjectsSection />
          <TransactionsSection />
        </div>
        <div className="space-y-5">
          <SerialRangesCard />
          <DocumentHubCard />
        </div>
      </section>

      <footer className="flex flex-col gap-3 pt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Nature&apos;s Registry • All Right Reserved</span>
        <span>Privacy</span>
      </footer>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3.5v8M6.75 8.75 10 12l3.25-3.25M4.5 14.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockwiseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6 5.5A6.5 6.5 0 1 1 4 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 4.5h3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4 3.7 19h16.6L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.25v4.75M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="m5.5 10.25 3 3 6-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 4.5h.01M10 10h.01M10 15.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LedgerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 5.5v9M16.5 5.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SealIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4.5 9.7 6.2l-2.8-.3-.7 2.7L4 10.5l1.5 2.1-.3 2.8 2.8.7 1.7 2.2 2.3-1.5 2.3 1.5 1.7-2.2 2.8-.7-.3-2.8 1.5-2.1-2.2-1.9-.7-2.7-2.8.3L12 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9.5 12 1.6 1.6 3.4-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 4.5h5l3 3V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13 4.5V8h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12.5h5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 5.5h6M10 4h4a1 1 0 0 1 1 1v1H9V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 6.5H7a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-1" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 11h6M9 14.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function UploadCloudIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8.5 17.5H8a4 4 0 1 1 .8-7.9A5 5 0 0 1 18 11a3.5 3.5 0 1 1-.5 6.5H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10.5v8M9.5 13 12 10.5 14.5 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TransactionTypeIcon({
  type,
}: {
  type: TransactionRow['type'];
}) {
  if (type === 'Trade') {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-green-700">
        <path d="M5 6.5h7.5m0 0L10.5 4m2 2.5L10.5 9M15 13.5H7.5m0 0L9.5 11m-2 2.5L9.5 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'Retirement') {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-indigo-600">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 10h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-stone-500">
      <path d="M5 13.5h7.5m0 0L10.5 11m2 2.5L10.5 16M15 6.5H7.5m0 0L9.5 4m-2 2.5L9.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
