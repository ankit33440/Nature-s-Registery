import axios from 'axios';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
}

type StatusBanner =
  | { kind: 'pending' }
  | { kind: 'rejected' }
  | { kind: 'invited' }
  | { kind: 'deactivated' }
  | { kind: 'error'; message: string };

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) errors.password = 'Password is required';
  return errors;
}

function StatusBox({ banner }: { banner: StatusBanner }) {
  const configs = {
    pending: {
      bg: 'bg-amber-50 border-amber-300',
      icon: '🕐',
      title: 'Account pending approval',
      body: 'Your account is pending approval by the administrator. You will receive access once approved.',
    },
    rejected: {
      bg: 'bg-red-50 border-red-300',
      icon: '✕',
      title: 'Account rejected',
      body: 'Your account has been rejected. Please contact the administrator for assistance.',
    },
    invited: {
      bg: 'bg-blue-50 border-blue-300',
      icon: '✉',
      title: 'Complete your registration',
      body: 'Please complete your registration via the invitation link sent to your email.',
    },
    deactivated: {
      bg: 'bg-stone-100 border-stone-300',
      icon: '⊘',
      title: 'Account deactivated',
      body: 'Your account has been deactivated. Please contact the administrator.',
    },
    error: {
      bg: 'bg-red-50 border-red-300',
      icon: '!',
      title: 'Sign in failed',
      body: banner.kind === 'error' ? banner.message : '',
    },
  };

  const c = configs[banner.kind];
  return (
    <div className={`rounded-xl border px-4 py-3 mb-5 ${c.bg}`}>
      <p className="text-sm font-semibold text-stone-800 mb-0.5">
        <span className="mr-1.5">{c.icon}</span>
        {c.title}
      </p>
      <p className="text-sm text-stone-600">{c.body}</p>
    </div>
  );
}

function LeafLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 4C24 4 7 13 7 26C7 35.9 14.6 44 24 44C33.4 44 41 35.9 41 26C41 13 24 4 24 4Z" fill="#4ade80" />
      <path d="M24 44V21" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 29L16 21" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 35L32 27" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function NaturePanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden flex-col">
      <div className="absolute -top-24 -right-24 w-96 h-96 opacity-[0.07]">
        <svg viewBox="0 0 200 200" fill="white"><path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" /></svg>
      </div>
      <div className="absolute top-1/3 -left-20 w-72 h-72 opacity-[0.06] rotate-45">
        <svg viewBox="0 0 200 200" fill="white"><path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" /></svg>
      </div>
      <div className="absolute -bottom-20 right-12 w-80 h-80 opacity-[0.07] -rotate-12">
        <svg viewBox="0 0 200 200" fill="white"><path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" /></svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-[0.12]">
        <svg viewBox="0 0 480 160" preserveAspectRatio="xMidYMax slice" fill="white">
          <path d="M0 160 L0 95 C15 95 25 72 45 72 C65 72 72 90 92 90 C112 90 125 62 150 62 C175 62 182 82 205 82 C228 82 242 52 270 52 C298 52 308 76 330 76 C352 76 368 60 392 60 C410 60 420 78 440 78 C458 78 468 66 480 66 L480 160Z" />
        </svg>
      </div>
      <div className="absolute top-24 right-16 w-8 h-8 opacity-30 rotate-12">
        <svg viewBox="0 0 32 32" fill="#4ade80"><path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" /></svg>
      </div>
      <div className="absolute top-48 left-8 w-6 h-6 opacity-20 -rotate-45">
        <svg viewBox="0 0 32 32" fill="#86efac"><path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" /></svg>
      </div>
      <div className="absolute bottom-40 left-16 w-10 h-10 opacity-25 rotate-6">
        <svg viewBox="0 0 32 32" fill="#4ade80"><path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" /></svg>
      </div>
      <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-400/20 border border-green-400/25 flex items-center justify-center">
            <LeafLogo className="w-5 h-5" />
          </div>
          <span className="text-white font-semibold text-base tracking-wide">Nature&apos;s Registry</span>
        </div>
        <div className="flex-1 flex flex-col justify-center mt-12">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">Carbon Credit Platform</p>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Building a<br />greener future,<br />
            <span className="text-green-400">one credit</span><br />at a time.
          </h2>
          <p className="text-green-300/80 text-sm leading-relaxed max-w-xs">
            A trusted platform for monitoring, reporting, and verification of carbon credits across the full MRV lifecycle.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { title: 'Verified Carbon Credits', desc: 'Full MRV lifecycle management' },
              { title: 'Transparent Reporting', desc: 'Real-time monitoring & audit trails' },
              { title: 'Trusted Marketplace', desc: 'Secure issuance and trading' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-400" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-green-400/60 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-green-800/60 grid grid-cols-3 gap-4">
          {[{ value: '500+', label: 'Projects' }, { value: '2.4M', label: 'Credits issued' }, { value: '98%', label: 'Verified' }].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-green-400/70 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [banner, setBanner] = useState<StatusBanner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setBanner(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorCode = (err.response?.data as { errorCode?: string })?.errorCode;
        const message = (err.response?.data as { message?: string })?.message ?? 'Invalid email or password.';
        if (errorCode === 'PENDING_APPROVAL') { setBanner({ kind: 'pending' }); return; }
        if (errorCode === 'REJECTED') { setBanner({ kind: 'rejected' }); return; }
        if (errorCode === 'INVITED') { setBanner({ kind: 'invited' }); return; }
        if (errorCode === 'DEACTIVATED') { setBanner({ kind: 'deactivated' }); return; }
        setBanner({ kind: 'error', message: typeof message === 'string' ? message : 'Invalid email or password.' });
      } else {
        setBanner({ kind: 'error', message: 'An unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <NaturePanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-stone-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="flex items-center gap-2 mb-1">
              <LeafLogo className="w-8 h-8" />
              <span className="text-green-800 font-bold text-xl">Nature&apos;s Registry</span>
            </div>
            <p className="text-stone-400 text-sm">Carbon Credit Platform</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900">Welcome back</h1>
            <p className="text-stone-400 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {banner && <StatusBox banner={banner} />}

          <form onSubmit={(e) => void handleSubmit(e)} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-stone-900 placeholder-stone-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 ${errors.email ? 'border-red-400 ring-1 ring-red-300' : 'border-stone-200'}`}
                placeholder="you@example.com" disabled={isSubmitting} autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-stone-900 placeholder-stone-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 ${errors.password ? 'border-red-400 ring-1 ring-red-300' : 'border-stone-200'}`}
                placeholder="••••••••" disabled={isSubmitting} autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-green-700 hover:bg-green-800 active:bg-green-900 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-green-900/20"
            >
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <svg className="w-4 h-4 opacity-80" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C8 1.5 2.5 4.5 2.5 9C2.5 12.3 5 15 8 15C11 15 13.5 12.3 13.5 9C13.5 4.5 8 1.5 8 1.5Z" fill="currentColor" fillOpacity="0.7" /><path d="M8 15V8" stroke="white" strokeWidth="1.2" strokeLinecap="round" /></svg>}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-400 text-xs">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <p className="text-center text-sm text-stone-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-green-700 font-semibold hover:text-green-800 hover:underline transition-colors">
              Register
            </Link>
          </p>
          <p className="text-center text-xs text-stone-400 mt-8">
            By signing in you agree to our{' '}
            <span className="text-stone-500 underline cursor-pointer">Terms</span>{' '}and{' '}
            <span className="text-stone-500 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
