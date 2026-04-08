import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user.types';

interface ProtectedRouteProps {
  roles?: UserRole[];
  /** Optional dynamic permission key required e.g. "projects:create" */
  requirePermission?: string;
}

export function ProtectedRoute({ roles, requirePermission }: ProtectedRouteProps) {
  const { user, permissions, isLoading } = useAuth();
  const location = useLocation();

  const roleBlocked =
    user !== null &&
    roles !== undefined &&
    roles.length > 0 &&
    !roles.includes(user.role);

  const permissionBlocked =
    user !== null &&
    requirePermission !== undefined &&
    user.role !== UserRole.SUPERADMIN &&
    !permissions.includes(requirePermission);

  const isBlocked = roleBlocked || permissionBlocked;

  useEffect(() => {
    if (isBlocked) {
      toast.error("You don't have permission to access that page.");
    }
  }, [isBlocked]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isBlocked) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
