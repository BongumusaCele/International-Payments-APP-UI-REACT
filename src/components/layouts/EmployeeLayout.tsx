import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { employeeLogout } from '../../store/slices/employeeSlice';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/payments', label: 'Review Queue', icon: ClipboardCheck },
];

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EmployeeNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpen={() => setIsSidebarOpen(true)}
      />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/85 px-4 py-4 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/85 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl justify-end">
            <EmployeeAccountMenu />
          </div>
        </header>

        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

interface EmployeeNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const EmployeeNavigation: React.FC<EmployeeNavigationProps> = ({ isOpen, onClose, onOpen }) => {
  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-900 text-white">
            <Building2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-black leading-tight text-slate-950 dark:text-white">
              Employee
              <span className="block">Payments Portal</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close employee navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-3xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        Verify beneficiary details, confirm SWIFT/BIC information, and submit approved payments.
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg lg:hidden"
        aria-label="Open employee navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block">
        {sidebar}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={onClose}
            aria-label="Close employee navigation overlay"
          />
          <div className="relative h-full">
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
};

const EmployeeAccountMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.employee);
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'EP';

  const handleLogout = () => {
    dispatch(employeeLogout());
    setIsOpen(false);
    navigate('/employee/login');
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-900 text-sm font-black text-white">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-44 truncate text-sm font-black text-slate-950 dark:text-white">{user?.fullName}</span>
          <span className="mt-1 block max-w-44 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{user?.role}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-5 w-5 text-blue-900" />
              {user?.employeeNumber}
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <BadgeCheck className="h-5 w-5" />
              {user?.branch}
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
            role="menuitem"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
