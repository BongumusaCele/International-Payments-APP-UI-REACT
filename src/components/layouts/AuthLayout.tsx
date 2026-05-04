import React from 'react';
import { CreditCard } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  wide?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, wide = false }) => {
  return (
    <div className="auth-shell">
      <div className={`auth-card ${wide ? 'auth-card-wide' : ''}`}>
        <div className="auth-brand">
          <span>
            <CreditCard className="h-6 w-6" />
          </span>
          <strong>International Payments Portal</strong>
        </div>

        {(title || subtitle) && (
          <div className="auth-heading">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
