import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, WalletCards } from 'lucide-react';
import { Navigation } from './Navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { useClickOutside } from '../../hooks/useClickOutside';
import { AppShell } from './AppShell';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <AppShell
      navigation={(
        <Navigation
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpen={() => setIsSidebarOpen(true)}
        />
      )}
      accountMenu={<AccountMenu />}
    >
      {children}
    </AppShell>
  );
};

const AccountMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);
  const closeMenu = React.useCallback(() => setIsOpen(false), []);
  const menuRef = useClickOutside<HTMLDivElement>(closeMenu);

  const initials = user?.fullName
    ?.split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PA';

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/login');
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
          <span className="mt-1 block max-w-44 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{user?.email}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            role="menuitem"
          >
            <User className="h-5 w-5" />
            Profile
          </Link>
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
          <div className="border-t border-slate-100 px-5 py-4 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <WalletCards className="h-4 w-4" />
              {user?.email}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
