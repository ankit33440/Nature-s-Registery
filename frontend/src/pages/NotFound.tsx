import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <p className="text-8xl font-bold text-gray-200 mb-4 select-none">404</p>
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/login"
        className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
      >
        Return to login
      </Link>
    </div>
  );
}
