import axios from 'axios';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user.types';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

function validate(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): FormErrors {
  const errors: FormErrors = {};
  if (!firstName.trim()) errors.firstName = 'First name is required';
  if (!lastName.trim()) errors.lastName = 'Last name is required';
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
}

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.BUYER]: 'Buyer',
  [UserRole.PROJECT_DEVELOPER]: 'Project Developer',
  [UserRole.VERIFIER]: 'Verifier',
  [UserRole.CERTIFIER]: 'Certifier',
  [UserRole.SUPERADMIN]: 'Super Admin',
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.BUYER]: 'Purchase verified carbon credits',
  [UserRole.PROJECT_DEVELOPER]: 'Register and manage carbon projects',
  [UserRole.VERIFIER]: 'Independently verify project data',
  [UserRole.CERTIFIER]: 'Issue certified carbon credits',
  [UserRole.SUPERADMIN]: 'Full platform administration',
};

function LeafLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4C24 4 7 13 7 26C7 35.9 14.6 44 24 44C33.4 44 41 35.9 41 26C41 13 24 4 24 4Z"
        fill="#4ade80"
      />
      <path
        d="M24 44V21"
        stroke="#166534"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 29L16 21"
        stroke="#166534"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 35L32 27"
        stroke="#166534"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5.75.75 0 010-1.5z" />
      </svg>
      {msg}
    </p>
  );
}

function NaturePanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden flex-col">
      {/* Background decorative leaves */}
      <div className="absolute -top-24 -right-24 w-96 h-96 opacity-[0.07]">
        <svg viewBox="0 0 200 200" fill="white">
          <path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 -left-20 w-72 h-72 opacity-[0.06] rotate-45">
        <svg viewBox="0 0 200 200" fill="white">
          <path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" />
        </svg>
      </div>
      <div className="absolute -bottom-20 right-12 w-80 h-80 opacity-[0.07] -rotate-12">
        <svg viewBox="0 0 200 200" fill="white">
          <path d="M100 5C50 5 5 50 5 100C5 150 50 195 100 195C150 195 195 150 195 100C195 50 150 5 100 5Z" />
        </svg>
      </div>

      {/* Forest floor silhouette */}
      <div className="absolute bottom-0 left-0 right-0 opacity-[0.12]">
        <svg viewBox="0 0 480 160" preserveAspectRatio="xMidYMax slice" fill="white">
          <path d="M0 160 L0 95 C15 95 25 72 45 72 C65 72 72 90 92 90 C112 90 125 62 150 62 C175 62 182 82 205 82 C228 82 242 52 270 52 C298 52 308 76 330 76 C352 76 368 60 392 60 C410 60 420 78 440 78 C458 78 468 66 480 66 L480 160Z" />
        </svg>
      </div>

      {/* Floating leaves */}
      <div className="absolute top-24 right-16 w-8 h-8 opacity-30 rotate-12">
        <svg viewBox="0 0 32 32" fill="#4ade80">
          <path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" />
        </svg>
      </div>
      <div className="absolute top-48 left-8 w-6 h-6 opacity-20 -rotate-45">
        <svg viewBox="0 0 32 32" fill="#86efac">
          <path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-16 w-10 h-10 opacity-25 rotate-6">
        <svg viewBox="0 0 32 32" fill="#4ade80">
          <path d="M16 2C16 2 4 8 4 17C4 23.6 9.4 29 16 29C22.6 29 28 23.6 28 17C28 8 16 2 16 2Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-400/20 border border-green-400/25 flex items-center justify-center">
            <LeafLogo className="w-5 h-5" />
          </div>
          <span className="text-white font-semibold text-base tracking-wide">
            Nature&apos;s Registry
          </span>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center mt-12">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Join the platform
          </p>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your role in<br />a sustainable<br />
            <span className="text-green-400">carbon economy</span>
            <br />starts here.
          </h2>
          <p className="text-green-300/80 text-sm leading-relaxed max-w-xs">
            Whether you develop projects, verify data, or trade credits — this
            platform connects every role in the carbon lifecycle.
          </p>

          {/* Roles preview */}
          <div className="mt-10 space-y-3">
            {(
              [
                UserRole.PROJECT_DEVELOPER,
                UserRole.VERIFIER,
                UserRole.BUYER,
              ] as UserRole[]
            ).map((r) => (
              <div key={r} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-green-400"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <span className="text-white text-sm font-medium">
                    {ROLE_LABELS[r]}
                  </span>
                  <span className="text-green-400/60 text-xs ml-2">
                    — {ROLE_DESCRIPTIONS[r]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-8 border-t border-green-800/60 grid grid-cols-3 gap-4">
          {[
            { value: '500+', label: 'Projects' },
            { value: '2.4M', label: 'Credits issued' },
            { value: '98%', label: 'Verified' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-green-400/70 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(firstName, lastName, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, role });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string })?.message ??
          'Registration failed';
        toast.error(typeof msg === 'string' ? msg : 'Registration failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white text-stone-900 placeholder-stone-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 ${
      hasError ? 'border-red-400 ring-1 ring-red-300' : 'border-stone-200'
    }`;

  const labelClass =
    'block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5';

  return (
    <div className="min-h-screen flex">
      <NaturePanel />

      {/* Right — form (scrollable) */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-10 bg-stone-50 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-1">
              <LeafLogo className="w-8 h-8" />
              <span className="text-green-800 font-bold text-xl">
                Nature&apos;s Registry
              </span>
            </div>
            <p className="text-stone-400 text-sm">Carbon Credit Platform</p>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-stone-900">
              Create your account
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Join the carbon credit platform in minutes
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass(!!errors.firstName)}
                  placeholder="John"
                  disabled={isSubmitting}
                  autoComplete="given-name"
                />
                <ErrorMsg msg={errors.firstName} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass(!!errors.lastName)}
                  placeholder="Doe"
                  disabled={isSubmitting}
                  autoComplete="family-name"
                />
                <ErrorMsg msg={errors.lastName} />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(!!errors.email)}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              <ErrorMsg msg={errors.email} />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass(!!errors.password)}
                placeholder="Min. 8 characters"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <ErrorMsg msg={errors.password} />
            </div>

            {/* Role */}
            <div className="mb-6">
              <label htmlFor="role" className={labelClass}>
                Your role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-shadow appearance-none cursor-pointer"
                disabled={isSubmitting}
              >
                {Object.values(UserRole).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
              {role && (
                <p className="text-stone-400 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-600 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.75a.5.5 0 011 0V6.5l1.5 1a.5.5 0 01-.5.866L6 7.134V3.75z"/>
                  </svg>
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-700 hover:bg-green-800 active:bg-green-900 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-green-900/20"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4 opacity-80"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1.5C8 1.5 2.5 4.5 2.5 9C2.5 12.3 5 15 8 15C11 15 13.5 12.3 13.5 9C13.5 4.5 8 1.5 8 1.5Z"
                    fill="currentColor"
                    fillOpacity="0.7"
                  />
                  <path
                    d="M8 15V8"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-400 text-xs">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <p className="text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-700 font-semibold hover:text-green-800 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-stone-400 mt-8">
            By registering you agree to our{' '}
            <span className="text-stone-500 underline cursor-pointer">
              Terms
            </span>{' '}
            and{' '}
            <span className="text-stone-500 underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
