type ProjectStatusTone = 'verification' | 'submission' | 'certification' | 'issuance';
type QueueTone = 'danger' | 'info' | 'success' | 'neutral';

type ProjectRow = {
  id: string;
  name: string;
  location: string;
  imageTone: 'forest' | 'mountain' | 'coast' | 'grassland';
  status: string;
  statusTone: ProjectStatusTone;
  health: number;
  queueTitle: string;
  queueMeta: string;
  queueTone: QueueTone;
  credits: string;
};

type VintageRow = {
  label: string;
  value: string;
  percent: number;
  tone: string;
};

type SerialRangeCard = {
  block: string;
  range: string;
  quantity: string;
  status: string;
  statusTone: string;
  highlighted?: boolean;
};

const projectRows: ProjectRow[] = [
  {
    id: 'REG-AF-2024-001',
    name: 'Amazon Canopy Reserve IV',
    location: 'Brazil',
    imageTone: 'forest',
    status: 'VERIFICATION',
    statusTone: 'verification',
    health: 92,
    queueTitle: 'Site Audit Overdue',
    queueMeta: 'Reviewer: S. Chen',
    queueTone: 'danger',
    credits: '420,000',
  },
  {
    id: 'REG-AG-2023-142',
    name: 'High Atlas Soil Carbon',
    location: 'Morocco',
    imageTone: 'mountain',
    status: 'SUBMISSION',
    statusTone: 'submission',
    health: 45,
    queueTitle: 'Annex B Missing',
    queueMeta: 'Awaiting Dev',
    queueTone: 'info',
    credits: '1.2M',
  },
  {
    id: 'REG-BC-2024-058',
    name: 'Tasman Kelp Forest Restoration',
    location: 'Australia',
    imageTone: 'coast',
    status: 'CERTIFICATION',
    statusTone: 'certification',
    health: 88,
    queueTitle: 'Board Approved',
    queueMeta: 'Date: Oct 12',
    queueTone: 'success',
    credits: '85,400',
  },
  {
    id: 'REG-PT-2022-019',
    name: 'Scottish Peatland Trust',
    location: 'UK',
    imageTone: 'grassland',
    status: 'SUBMISSION',
    statusTone: 'submission',
    health: 99,
    queueTitle: 'Fully Retired',
    queueMeta: 'Vintage: 2022',
    queueTone: 'neutral',
    credits: '310,000',
  },
  {
    id: 'REG-AMZ-2023-101',
    name: 'Amazon Rainforest Conservation',
    location: 'Brazil',
    imageTone: 'coast',
    status: 'CERTIFICATION',
    statusTone: 'certification',
    health: 92,
    queueTitle: 'Board Approved',
    queueMeta: 'Date: Sep 25',
    queueTone: 'success',
    credits: '150,000',
  },
  {
    id: 'REG-PT-2022-019',
    name: 'Scottish Peatland Trust',
    location: 'UK',
    imageTone: 'grassland',
    status: 'ISSUANCE',
    statusTone: 'issuance',
    health: 99,
    queueTitle: 'Fully Retired',
    queueMeta: 'Vintage: 2022',
    queueTone: 'neutral',
    credits: '310,000',
  },
  {
    id: 'REG-BC-2024-058',
    name: 'Tasman Kelp Forest Restoration',
    location: 'Australia',
    imageTone: 'coast',
    status: 'CERTIFICATION',
    statusTone: 'certification',
    health: 88,
    queueTitle: 'Board Approved',
    queueMeta: 'Date: Oct 12',
    queueTone: 'success',
    credits: '85,400',
  },
  {
    id: 'REG-BC-2024-058',
    name: 'Tasman Kelp Forest Restoration',
    location: 'Australia',
    imageTone: 'coast',
    status: 'CERTIFICATION',
    statusTone: 'certification',
    health: 88,
    queueTitle: 'Board Approved',
    queueMeta: 'Date: Oct 12',
    queueTone: 'success',
    credits: '85,400',
  },
  {
    id: 'REG-PT-2022-019',
    name: 'Scottish Peatland Trust',
    location: 'UK',
    imageTone: 'grassland',
    status: 'ISSUANCE',
    statusTone: 'issuance',
    health: 99,
    queueTitle: 'Fully Retired',
    queueMeta: 'Vintage: 2022',
    queueTone: 'neutral',
    credits: '310,000',
  },
  {
    id: 'REG-BC-2024-058',
    name: 'Tasman Kelp Forest Restoration',
    location: 'Australia',
    imageTone: 'coast',
    status: 'CERTIFICATION',
    statusTone: 'certification',
    health: 88,
    queueTitle: 'Board Approved',
    queueMeta: 'Date: Oct 12',
    queueTone: 'success',
    credits: '85,400',
  },
];

const vintageRows: VintageRow[] = [
  { label: 'Vintage 2023', value: '450k', percent: 78, tone: 'bg-green-700' },
  { label: 'Vintage 2022', value: '320k', percent: 55, tone: 'bg-green-400' },
  { label: 'Vintage 2021', value: '185k', percent: 36, tone: 'bg-green-200' },
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

const documentItems = [
  { label: 'Certification', icon: <SealIcon className="h-7 w-7" /> },
  { label: 'Issuance', icon: <DocumentIcon className="h-7 w-7" /> },
  { label: 'Impact Report', icon: <ClipboardIcon className="h-7 w-7" /> },
  { label: 'Batch CSV', icon: <UploadCloudIcon className="h-7 w-7" /> },
];

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`border border-stone-200 bg-white ${className}`}>{children}</section>;
}

export function Projects() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-[40px] font-semibold tracking-[-0.05em] text-emerald-950 sm:text-[56px]">
          Projects
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

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <ProjectsTableCard />
        <div className="space-y-5">
          <IssuesCard />
          <VintageDistributionCard />
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

function ProjectsTableCard() {
  return (
    <Panel className="overflow-hidden">
      <div className="hidden grid-cols-[2.2fr_1.15fr_0.7fr_1.1fr_0.8fr_0.55fr] gap-6 border-b border-stone-100 bg-stone-50 px-10 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-600 lg:grid">
        <span>Project Identity</span>
        <span>Status</span>
        <span>Health</span>
        <span>Workflow Queue</span>
        <span>Credits</span>
        <span>Comments</span>
      </div>

      <div>
        {projectRows.map((project) => (
          <ProjectTableRow key={`${project.id}-${project.status}-${project.credits}-${project.queueTitle}`} project={project} />
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-stone-100 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[16px] text-stone-600">Showing 1-10 of 248 projects</p>
        <div className="flex items-center gap-3 text-[18px] font-semibold text-slate-800">
          <button className="rounded-full p-2 text-stone-300 transition-colors hover:bg-stone-100 hover:text-stone-600">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">1</button>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-stone-100">2</button>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-stone-100">3</button>
          <span className="px-1 text-stone-400">...</span>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-stone-100">25</button>
          <button className="rounded-full p-2 text-slate-700 transition-colors hover:bg-stone-100">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Panel>
  );
}

function ProjectTableRow({ project }: { project: ProjectRow }) {
  return (
    <div className="border-b border-stone-100 px-6 py-6 last:border-b-0 sm:px-8 lg:px-10">
      <div className="hidden grid-cols-[2.2fr_1.15fr_0.7fr_1.1fr_0.8fr_0.55fr] items-center gap-6 lg:grid">
        <ProjectIdentityCell project={project} />
        <StatusBadge status={project.status} tone={project.statusTone} />
        <HealthCell value={project.health} />
        <WorkflowQueueCell title={project.queueTitle} meta={project.queueMeta} tone={project.queueTone} />
        <CreditsCell value={project.credits} />
        <CommentButton />
      </div>

      <div className="space-y-5 lg:hidden">
        <div className="flex items-start gap-4">
          <ProjectThumb tone={project.imageTone} />
          <div className="min-w-0 flex-1">
            <p className="text-[24px] font-medium leading-tight tracking-[-0.03em] text-stone-900">
              {project.name}
            </p>
            <p className="mt-2 text-[15px] text-stone-500">
              ID: {project.id} • {project.location}
            </p>
          </div>
          <CommentButton />
        </div>

        <div className="flex flex-wrap gap-3">
          <StatusBadge status={project.status} tone={project.statusTone} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Health</p>
            <div className="mt-3">
              <HealthCell value={project.health} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Workflow Queue</p>
            <div className="mt-3">
              <WorkflowQueueCell title={project.queueTitle} meta={project.queueMeta} tone={project.queueTone} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Credits</p>
            <div className="mt-3">
              <CreditsCell value={project.credits} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectIdentityCell({ project }: { project: ProjectRow }) {
  return (
    <div className="flex items-center gap-5">
      <ProjectThumb tone={project.imageTone} />
      <div>
        <p className="text-[18px] font-medium leading-tight tracking-[-0.03em] text-stone-900">
          {project.name}
        </p>
        <p className="mt-2 text-[15px] leading-snug text-stone-500">
          ID: {project.id} •
          <br className="2xl:hidden" /> {project.location}
        </p>
      </div>
    </div>
  );
}

function ProjectThumb({ tone }: { tone: ProjectRow['imageTone'] }) {
  const toneMap: Record<ProjectRow['imageTone'], string> = {
    forest:
      'bg-[radial-gradient(circle_at_62%_26%,rgba(255,243,147,0.35),transparent_18%),linear-gradient(180deg,#31481d_0%,#102310_35%,#1d2d13_60%,#0f180a_100%)]',
    mountain:
      'bg-[linear-gradient(180deg,#2592db_0%,#7dd0ff_28%,#8e8d8f_29%,#4f5661_50%,#6f513d_70%,#2d231c_100%)]',
    coast:
      'bg-[linear-gradient(180deg,#42a9eb_0%,#8de4ff_26%,#1b7ea0_27%,#1e5d56_52%,#7d5f3d_78%,#3e2d1f_100%)]',
    grassland:
      'bg-[linear-gradient(160deg,#a5d56f_0%,#6a8b26_32%,#ccd950_50%,#587426_74%,#324713_100%)]',
  };

  return (
    <div className={`h-[56px] w-[56px] shrink-0 overflow-hidden rounded-xl ${toneMap[tone]}`}>
      <div className="h-full w-full bg-[radial-gradient(circle_at_18%_78%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_38%_72%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_60%_68%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_78%_76%,rgba(255,255,255,0.08),transparent_18%)]" />
    </div>
  );
}

function StatusBadge({
  status,
  tone,
}: {
  status: string;
  tone: ProjectStatusTone;
}) {
  const toneClass: Record<ProjectStatusTone, string> = {
    verification: 'bg-rose-100 text-rose-700',
    submission: 'bg-slate-200 text-slate-700',
    certification: 'bg-lime-300 text-green-900',
    issuance: 'bg-stone-200 text-stone-700',
  };

  return (
    <span className={`inline-flex rounded-full px-4 py-1.5 text-[14px] font-semibold ${toneClass[tone]}`}>
      {status}
    </span>
  );
}

function HealthCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[5px] w-[22px] rounded-full bg-green-700" />
      <span className="text-[16px] font-semibold text-stone-700">{value}%</span>
    </div>
  );
}

function WorkflowQueueCell({
  title,
  meta,
  tone,
}: {
  title: string;
  meta: string;
  tone: QueueTone;
}) {
  const iconTone: Record<QueueTone, string> = {
    danger: 'text-red-600',
    info: 'text-indigo-500',
    success: 'text-green-700',
    neutral: 'text-stone-500',
  };

  const titleTone: Record<QueueTone, string> = {
    danger: 'text-red-600',
    info: 'text-indigo-600',
    success: 'text-green-700',
    neutral: 'text-stone-700',
  };

  const Icon = tone === 'danger' ? AlertQueueIcon : tone === 'info' ? DocumentQueueIcon : tone === 'success' ? CheckCircleIcon : RetiredIcon;

  return (
    <div>
      <div className={`flex items-start gap-2 ${titleTone[tone]}`}>
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconTone[tone]}`} />
        <span className="text-[15px] font-semibold leading-tight">{title}</span>
      </div>
      <p className="mt-1 text-[14px] text-stone-500">{meta}</p>
    </div>
  );
}

function CreditsCell({ value }: { value: string }) {
  return (
    <div>
      <p className="text-[18px] font-semibold leading-none tracking-[-0.02em] text-stone-900">{value}</p>
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-stone-500">Tons CO2e</p>
    </div>
  );
}

function CommentButton() {
  return (
    <button className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-stone-100">
      <CommentIcon className="h-8 w-8" />
    </button>
  );
}

function IssuesCard() {
  return (
    <Panel className="p-6">
      <div className="flex items-start justify-between gap-4">
        <AlertTriangleIcon className="mt-1 h-8 w-8 text-red-600" />
        <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Action Required</span>
      </div>
      <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em] text-stone-700">Pending Issues</p>
      <p className="mt-2 max-w-[260px] text-[24px] font-semibold leading-tight tracking-[-0.03em] text-stone-900">
        2 Verification Non-Conformances
      </p>
      <button className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-[16px] font-semibold text-white transition-colors hover:bg-slate-800">
        Resolve Issues
      </button>
    </Panel>
  );
}

function VintageDistributionCard() {
  return (
    <Panel className="p-6">
      <div className="flex items-center gap-3">
        <ClockwiseIcon className="h-5 w-5 text-green-700" />
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">Vintage Distribution</h2>
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
    </Panel>
  );
}

function SerialRangesCard() {
  return (
    <Panel className="p-6">
      <div className="flex items-center gap-3">
        <LedgerIcon className="h-5 w-5 text-indigo-600" />
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">Issued Serial Ranges</h2>
      </div>
      <div className="mt-7 space-y-4">
        {serialRanges.map((item) => (
          <div
            key={item.block}
            className={`rounded-2xl border p-4 ${
              item.highlighted
                ? 'border-stone-100 bg-white shadow-[0_8px_24px_rgba(20,31,38,0.05)]'
                : 'border-dashed border-stone-200 bg-stone-50/70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-stone-400">{item.block}</p>
                <p className="mt-2 text-[15px] font-semibold tracking-[0.02em] text-stone-800">{item.range}</p>
                <p className="mt-3 text-[14px] text-stone-500">{item.quantity}</p>
              </div>
              <span className={`text-[14px] font-semibold ${item.statusTone}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DocumentHubCard() {
  return (
    <Panel className="p-6">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-stone-900">Document Hub</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {documentItems.map((item) => (
          <button
            key={item.label}
            className="flex min-h-[116px] flex-col items-center justify-center rounded-2xl bg-stone-100/80 px-4 text-center text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            {item.icon}
            <span className="mt-4 text-[16px] font-semibold text-stone-800">{item.label}</span>
          </button>
        ))}
      </div>
    </Panel>
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

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4 3.7 19h16.6L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.25v4.75M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 5.5h12a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 18 16.5H11l-4.5 3v-3H6A1.5 1.5 0 0 1 4.5 15V7A1.5 1.5 0 0 1 6 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AlertQueueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3.5 3.8 15.5h12.4L10 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 7.8v3.9M10 13.9h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DocumentQueueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6.5 3.5h4.8L14.5 6v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.3 3.5V6h3.2M7.7 9.4h4.5M7.7 12.2h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m7.4 10.2 1.7 1.8 3.5-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RetiredIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 6.8v3.4l2.3 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="m12.5 5.5-4.5 4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="m7.5 5.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
