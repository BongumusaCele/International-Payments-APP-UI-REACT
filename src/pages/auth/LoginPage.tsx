import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { login, verifyMfa, clearError } from '../../store/slices/authSlice';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { LoginResult } from '../../types';
import { isValidUserAccountNumber, validationMessages, validationPatterns } from '../../utils/validation';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, mfaChallengeId } = useAppSelector((state) => state.auth);
  const [username, setUsername] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!username.trim()) errors.username = 'Username is required';
    else if (!validationPatterns.username.test(username.trim())) errors.username = validationMessages.username;
    if (!accountNumber.trim()) errors.accountNumber = 'Account number is required';
    else if (!isValidUserAccountNumber(accountNumber.trim())) errors.accountNumber = validationMessages.userAccountNumber;
    if (!password) errors.password = 'Password is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: 'username' | 'accountNumber' | 'password' | 'otpCode', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'accountNumber') setAccountNumber(value);
    if (field === 'password') setPassword(value);
    if (field === 'otpCode') setOtpCode(value);

    if (error) dispatch(clearError());
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await dispatch(
      login({ username: username.trim(), accountNumber: accountNumber.trim(), password })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      const payload = result.payload as LoginResult | undefined;
      if (payload && !payload.requiresMfa) {
        navigate('/dashboard');
      }
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOtpCode = otpCode.trim();

    if (!mfaChallengeId) return;

    if (!/^\d{6}$/.test(trimmedOtpCode)) {
      setFormErrors({ otpCode: 'Enter the 6-digit code sent to your email' });
      return;
    }

    const result = await dispatch(
      verifyMfa({ mfaChallengeId, otpCode: trimmedOtpCode })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your payment dashboard.">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearError())}
        />
      )}

      {mfaChallengeId ? (
        <form onSubmit={handleVerifyMfa} className="space-y-5">
          <Alert
            type="info"
            message="We sent a verification code to your email address."
          />

          <Input
            type="text"
            label="Verification Code"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => handleFieldChange('otpCode', e.target.value)}
            error={formErrors.otpCode}
            className="auth-input"
            inputMode="numeric"
            maxLength={6}
            required
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="auth-primary-button w-full"
          >
            Verify Code
          </Button>
        </form>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => handleFieldChange('username', e.target.value)}
          error={formErrors.username}
          className="auth-input"
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z][A-Za-z0-9._-]{2,29}"
          required
        />

        <Input
          type="text"
          label="Account Number"
          placeholder="Enter your account number"
          value={accountNumber}
          onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
          error={formErrors.accountNumber}
          className="auth-input"
          inputMode="numeric"
          minLength={6}
          maxLength={10}
          pattern="\d{6,10}"
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
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
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-900 hover:underline font-semibold">
            Register here
          </Link>
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Bank employee?{' '}
          <Link to="/employee/login" className="font-semibold text-blue-900 hover:underline">
            Open employee portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
