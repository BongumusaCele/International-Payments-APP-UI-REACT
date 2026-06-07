import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, Eye, EyeOff } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { clearEmployeeError, employeeLogin } from '../../store/slices/employeeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';

export const EmployeeLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.employee);
  const [employeeNumber, setEmployeeNumber] = React.useState('EMP001');
  const [password, setPassword] = React.useState('Password123!');
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/employee/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: 'employeeNumber' | 'password', value: string) => {
    if (field === 'employeeNumber') setEmployeeNumber(value);
    if (field === 'password') setPassword(value);
    if (error) dispatch(clearEmployeeError());
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!employeeNumber.trim()) errors.employeeNumber = 'Employee number is required';
    if (!password) errors.password = 'Password is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    const result = await dispatch(
      employeeLogin({
        employeeNumber: employeeNumber.trim(),
        password,
      })
    );

    if (employeeLogin.fulfilled.match(result)) {
      navigate('/employee/dashboard');
    }
  };

  const fillDemoLogin = (number: string) => {
    setEmployeeNumber(number);
    setPassword('Password123!');
    setFormErrors({});
    if (error) dispatch(clearEmployeeError());
  };

  return (
    <AuthLayout
      title="Employee Sign In"
      subtitle="Access the payment verification workspace."
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearEmployeeError())}
        />
      )}

      <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="mb-3 flex items-center gap-2 font-black">
          <BadgeCheck className="h-5 w-5" />
          Demo employee credentials
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => fillDemoLogin('EMP001')}
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-left font-bold hover:border-blue-900"
          >
            EMP001
            <span className="block text-xs font-semibold text-slate-500">Payments Officer</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoLogin('EMP002')}
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-left font-bold hover:border-blue-900"
          >
            EMP002
            <span className="block text-xs font-semibold text-slate-500">Senior Officer</span>
          </button>
        </div>
        <p className="mt-3 font-semibold">Password for both: Password123!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Employee Number"
          placeholder="EMP001"
          value={employeeNumber}
          onChange={(event) => handleChange('employeeNumber', event.target.value)}
          error={formErrors.employeeNumber}
          className="auth-input"
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => handleChange('password', event.target.value)}
          error={formErrors.password}
          className="auth-input"
          rightElement={
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="auth-primary-button w-full"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="font-semibold text-blue-900 hover:underline">
          Customer login
        </Link>
      </div>
    </AuthLayout>
  );
};
