import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CreditCard,
  LayoutDashboard,
  Menu,
  Send,
  Users,
  UserCircle,
  X,
} from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppDispatch';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/payments', label: 'Payments', icon: Send },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onOpen }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-900 text-white">
            <CreditCard className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-black leading-tight text-slate-950 dark:text-white">
              International
              <span className="block">Payments Portal</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close navigation"
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
        Manage beneficiaries, payments, and profile settings from one workspace.
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg lg:hidden"
        aria-label="Open navigation"
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
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full">
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
};
