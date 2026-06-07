import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/useAppDispatch';
import { setTheme } from './store/slices/themeSlice';
import { LandingPage } from './pages/landing/LandingPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Payments
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { CreatePaymentPage } from './pages/payments/CreatePaymentPage';
import { PaymentDetailPage } from './pages/payments/PaymentDetailPage';
import { PaymentSuccessPage } from './pages/payments/PaymentSuccessPage';

// Beneficiaries
import { BeneficiariesPage } from './pages/beneficiaries/BeneficiariesPage';

// Profile
import { ProfilePage } from './pages/profile/ProfilePage';

// Employee Portal
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';
import { EmployeeLoginPage } from './pages/employee/EmployeeLoginPage';
import { EmployeePaymentsPage } from './pages/employee/EmployeePaymentsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const EmployeeProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.employee);

  if (!isAuthenticated) {
    return <Navigate to="/employee/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // Initialize theme from localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    }
  }, [dispatch]);

  React.useEffect(() => {
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/employee/login" element={<EmployeeLoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/create"
          element={
            <ProtectedRoute>
              <CreatePaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/:paymentId"
          element={
            <ProtectedRoute>
              <PaymentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/beneficiaries"
          element={
            <ProtectedRoute>
              <BeneficiariesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Employee Protected Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeProtectedRoute>
              <EmployeeDashboardPage />
            </EmployeeProtectedRoute>
          }
        />

        <Route
          path="/employee/payments"
          element={
            <EmployeeProtectedRoute>
              <EmployeePaymentsPage />
            </EmployeeProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
