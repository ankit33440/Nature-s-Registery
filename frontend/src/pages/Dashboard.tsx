import { AdminOverviewDashboard } from '../components/dashboard/AdminOverviewDashboard';
import { ProjectDeveloperDashboard } from '../components/dashboard/ProjectDeveloperDashboard';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user.types';

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === UserRole.PROJECT_DEVELOPER) {
    return <ProjectDeveloperDashboard />;
  }

  return <AdminOverviewDashboard />;
}
