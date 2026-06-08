import React from 'react';

interface AppShellProps {
  navigation: React.ReactNode;
  accountMenu: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  navigation,
  accountMenu,
  children,
}) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    {navigation}
    <div className="lg:pl-72">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/85 px-4 py-4 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/85 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl justify-end">
          {accountMenu}
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  </div>
);
