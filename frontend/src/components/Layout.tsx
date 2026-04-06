import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <span className="font-bold text-lg tracking-tight">
          Nature&apos;s Registry
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs bg-green-900 px-2 py-1 rounded font-medium">
            {user?.role.replace(/_/g, ' ')}
          </span>
          <button
            onClick={() => void handleLogout()}
            className="text-sm underline hover:no-underline transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
