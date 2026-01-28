import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  UserCheck,
} from 'lucide-react';
import { useAuthStore, type UserRole } from '@/stores/authStore';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'COACH', 'LOCATION_LEAD'] },
  { label: 'Cohorts', icon: GraduationCap, path: '/cohorts', roles: ['ADMIN', 'COACH', 'LOCATION_LEAD'] },
  { label: 'Coaches', icon: Users, path: '/coaches', roles: ['ADMIN'] },
  { label: 'Stakeholders', icon: UserCheck, path: '/stakeholders', roles: ['ADMIN', 'COACH', 'LOCATION_LEAD'] },
  { label: 'Candidates', icon: Users, path: '/candidates', roles: ['COACH', 'LOCATION_LEAD'] },
  { label: 'Daily Efforts', icon: Calendar, path: '/efforts', roles: ['COACH', 'LOCATION_LEAD'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['ADMIN', 'COACH', 'LOCATION_LEAD'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['ADMIN'] },
];

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingOrbs variant="dashboard" />

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 hidden h-screen border-r border-border/50 bg-sidebar/80 backdrop-blur-xl lg:block"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-neon-blue">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-foreground">Cohort Effort</h1>
                    <p className="text-xs text-muted-foreground">Management</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'sidebar-link w-full',
                    isActive && 'active'
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="border-t border-border/50 p-4">
            <motion.button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              whileHover={{ x: 4 }}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 flex-shrink-0" />
              )}
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* User Section */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-neon-purple text-sm font-semibold text-secondary-foreground">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="truncate text-xs capitalize text-muted-foreground">{user?.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              whileHover={{ x: 4 }}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-neon-blue">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">Cohort Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <NotificationDropdown />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex h-full flex-col px-4 pt-20">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="mt-auto mb-8 flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-6 w-6" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 lg:pt-0',
          sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-20'
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl lg:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cohorts, candidates..."
              className="input-premium pl-10 w-80"
            />
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};