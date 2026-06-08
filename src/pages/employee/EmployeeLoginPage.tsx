import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { clearEmployeeError, employeeLogin } from '../../store/slices/employeeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { validationMessages, validationPatterns } from '../../utils/validation';

export const EmployeeLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.employee);
  const [employeeNumber, setEmployeeNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
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

    const normalizedEmployeeNumber = employeeNumber.trim();

    if (!normalizedEmployeeNumber) errors.employeeNumber = 'Employee username is required';
    else if (!validationPatterns.employeeUsername.test(normalizedEmployeeNumber)) {
      errors.employeeNumber = validationMessages.employeeUsername;
    }

    if (!password) errors.password = 'Password is required';
    else if (!validationPatterns.employeePassword.test(password)) {
      errors.password = validationMessages.employeePassword;
    }

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Employee Username"
          name="employeeNumber"
          placeholder="employee1"
          value={employeeNumber}
          onChange={(event) => handleChange('employeeNumber', event.target.value)}
          error={formErrors.employeeNumber}
          className="auth-input"
          autoComplete="username"
          minLength={3}
          maxLength={30}
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => handleChange('password', event.target.value)}
          error={formErrors.password}
          className="auth-input"
          autoComplete="current-password"
          minLength={8}
          maxLength={100}
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
