import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { login, clearError } from '../../store/slices/authSlice';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = React.useState('johndoe');
  const [accountNumber, setAccountNumber] = React.useState('ACC001');
  const [password, setPassword] = React.useState('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      login({ username, accountNumber, password })
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
          required
        />

        <Input
          type="text"
          label="Account Number"
          placeholder="Enter your account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="auth-input"
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />

        <div className="text-sm text-center">
          <p className="text-gray-600 mb-2">Demo credentials: johndoe / ACC001 / password</p>
        </div>

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
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-900 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
