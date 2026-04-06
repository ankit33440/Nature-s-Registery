import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-gray-500">
          You are signed in as{' '}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            {user?.role.replace(/_/g, ' ')}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Account Summary
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <dt className="text-gray-500">Full name</dt>
          <dd className="font-medium text-gray-800">
            {user?.firstName} {user?.lastName}
          </dd>

          <dt className="text-gray-500">Email</dt>
          <dd className="font-medium text-gray-800">{user?.email}</dd>

          <dt className="text-gray-500">Role</dt>
          <dd className="font-medium text-gray-800">
            {user?.role.replace(/_/g, ' ')}
          </dd>

          <dt className="text-gray-500">Account status</dt>
          <dd>
            {user?.isActive ? (
              <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                Inactive
              </span>
            )}
          </dd>

          <dt className="text-gray-500">Member since</dt>
          <dd className="font-medium text-gray-800">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '—'}
          </dd>
        </dl>
      </div>
    </div>
  );
}
