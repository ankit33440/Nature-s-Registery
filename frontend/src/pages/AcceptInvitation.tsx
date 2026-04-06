import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {};
  if (!firstName.trim()) errors.firstName = 'First name is required';
  if (!lastName.trim()) errors.lastName = 'Last name is required';
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least one number';
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
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

export function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!token) {
      setServerError('Invalid or missing invitation link. Please ask your administrator to resend the invitation.');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const validationErrors = validate(firstName, lastName, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authApi.acceptInvitation({
        invitationToken: token,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      setActivated(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string })?.message ??
          'Failed to activate account.';
        setServerError(typeof msg === 'string' ? msg : 'Failed to activate account.');
      } else {
        setServerError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white text-stone-900 placeholder-stone-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 ${hasError ? 'border-red-400 ring-1 ring-red-300' : 'border-stone-200'}`;
  const labelClass = 'block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5';

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <LeafLogo className="w-9 h-9" />
            <span className="text-green-800 font-bold text-xl">Nature&apos;s Registry</span>
          </div>
          <p className="text-stone-400 text-sm">Carbon Credit Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          {activated ? (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-stone-900 mb-2">Account activated!</h1>
              <p className="text-stone-500 text-sm mb-7">
                Your account is ready. You can now sign in with your email and the password you just set.
              </p>
              <button
                onClick={() => void navigate('/login')}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors"
              >
                Go to login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-stone-900">Complete your registration</h1>
                <p className="text-stone-400 text-sm mt-1">
                  Set your name and password to activate your account.
                </p>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 mb-5">
                  <p className="text-sm font-medium text-red-700 mb-0.5">Unable to activate account</p>
                  <p className="text-sm text-red-600">{serverError}</p>
                  {!token && (
                    <Link to="/login" className="text-red-700 underline text-xs mt-2 inline-block">
                      Return to login
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={(e) => void handleSubmit(e)} noValidate>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>First name</label>
                    <input id="firstName" type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass(!!errors.firstName)}
                      placeholder="John" disabled={isSubmitting || !token} autoComplete="given-name" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1.5">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>Last name</label>
                    <input id="lastName" type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass(!!errors.lastName)}
                      placeholder="Doe" disabled={isSubmitting || !token} autoComplete="family-name" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1.5">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <input id="password" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass(!!errors.password)}
                    placeholder="Min. 8 chars with a number" disabled={isSubmitting || !token} autoComplete="new-password" />
                  {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                  <input id="confirmPassword" type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass(!!errors.confirmPassword)}
                    placeholder="••••••••" disabled={isSubmitting || !token} autoComplete="new-password" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit" disabled={isSubmitting || !token}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-green-900/20"
                >
                  {isSubmitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isSubmitting ? 'Activating...' : 'Activate account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
