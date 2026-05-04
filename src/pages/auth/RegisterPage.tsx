import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { register, clearError } from '../../store/slices/authSlice';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

const steps = [
  'Personal Details',
  'Account Details',
  'Security',
  'Review',
];

const accountTypes = ['Cheque', 'Savings', 'Business'];
const currencies = ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD'];

const passwordRules = [
  { label: 'At least 8 characters', test: (password: string) => password.length >= 8 },
  { label: 'A number', test: (password: string) => /\d/.test(password) },
  { label: 'A special character', test: (password: string) => /[^A-Za-z0-9]/.test(password) },
  { label: 'Upper & lower case', test: (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password) },
];

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    accountNumber: '',
    accountType: '',
    preferredCurrency: 'ZAR',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const validateStep = (step = currentStep) => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.idNumber.trim()) errors.idNumber = 'ID number is required';
      else if (!/^\d{13}$/.test(formData.idNumber.replace(/\s/g, ''))) {
        errors.idNumber = 'Enter a valid 13-digit South African ID number';
      }
      if (!formData.email.trim()) errors.email = 'Email address is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    }

    if (step === 1) {
      if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
      if (!formData.accountType) errors.accountType = 'Account type is required';
      if (!formData.preferredCurrency) errors.preferredCurrency = 'Preferred currency is required';
    }

    if (step === 2) {
      if (!formData.username.trim()) errors.username = 'Username is required';
      else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
      if (!formData.password) errors.password = 'Password is required';
      else if (!passwordRules.every((rule) => rule.test(formData.password))) {
        errors.password = 'Password does not meet all requirements';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAll = () => [0, 1, 2].every((step) => validateStep(step));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < steps.length - 1) {
      handleNext();
      return;
    }

    if (!validateAll()) {
      setCurrentStep(0);
      return;
    }

    const result = await dispatch(
      register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        idNumber: formData.idNumber.replace(/\s/g, ''),
        accountNumber: formData.accountNumber,
        preferredCurrency: formData.preferredCurrency,
        phone: formData.phone,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  const renderSelect = (
    name: 'accountType' | 'preferredCurrency',
    label: string,
    placeholder: string,
    options: string[],
  ) => (
    <div className="wizard-field">
      <label htmlFor={name}>{label}</label>
      <div className="wizard-select">
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="h-6 w-6" />
      </div>
      {formErrors[name] && <p className="form-error">{formErrors[name]}</p>}
    </div>
  );

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Please fill in your details to get started!"
      wide
    >
      <main className="auth-wizard">

        <div className="wizard-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <button
                type="button"
                onClick={() => {
                  if (index <= currentStep || validateStep()) {
                    setCurrentStep(index);
                  }
                }}
                className={`wizard-step ${currentStep === index ? 'active' : ''}`}
              >
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </button>
              {index < steps.length - 1 && <div className="wizard-line" />}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="mx-auto mt-8 w-full max-w-4xl">
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearError())}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-1 flex-col">
          {currentStep === 0 && (
            <section>
              <div className="grid gap-4">
                <Input
                  type="text"
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={formErrors.firstName}
                  className="wizard-input"
                  required
                />

                <Input
                  type="text"
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={formErrors.lastName}
                  className="wizard-input"
                  required
                />

                <Input
                  type="email"
                  label="Email Address"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  className="wizard-input"
                  required
                />

                <Input
                  type="text"
                  label="ID Number"
                  name="idNumber"
                  placeholder="Enter your 13-digit ID number"
                  value={formData.idNumber}
                  onChange={handleChange}
                  error={formErrors.idNumber}
                  className="wizard-input"
                  inputMode="numeric"
                  maxLength={13}
                  required
                />

                <Input
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={formErrors.phone}
                  className="wizard-input"
                  required
                />
              </div>
            </section>
          )}

          {currentStep === 1 && (
            <section>
              <h2 className="wizard-section-title">Account Details</h2>
              <div className="grid gap-4">
                <Input
                  type="text"
                  label="Account Number"
                  name="accountNumber"
                  placeholder="Enter your account number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  error={formErrors.accountNumber}
                  className="wizard-input"
                  required
                />
                {renderSelect('accountType', 'Account Type', 'Select account type', accountTypes)}
                {renderSelect('preferredCurrency', 'Preferred  Currency', 'Select preferred currency', currencies)}
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="wizard-section-title">Security Details</h2>
              <div className="grid gap-4">
                <Input
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  error={formErrors.username}
                  className="wizard-input"
                  required
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  className="wizard-input"
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

                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                  className="wizard-input"
                  rightElement={
                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  required
                />
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-black text-black">Password must contain:</h3>
                <div className="mt-4 grid gap-3 text-base md:grid-cols-2">
                  {passwordRules.map((rule) => {
                    const isMet = rule.test(formData.password);

                    return (
                      <div key={rule.label} className="flex items-center gap-3">
                        <CheckCircle2 className={`h-6 w-6 ${isMet ? 'text-green-700' : 'text-gray-300'}`} />
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight text-black">Review your information</h2>
                <p className="mt-2 text-base font-medium text-[#262626]">Please confirm your details before registering.</p>
              </div>

              <div className="mt-8 grid gap-4">
                <ReviewSection title="Personal Details" onEdit={() => handleEditStep(0)}>
                  <ReviewRow label="First Name:" value={formData.firstName || '-'} />
                  <ReviewRow label="Last Name:" value={formData.lastName || '-'} />
                  <ReviewRow label="Email Address:" value={formData.email || '-'} />
                  <ReviewRow label="ID Number:" value={formData.idNumber || '-'} />
                  <ReviewRow label="Phone Number:" value={formData.phone || '-'} />
                </ReviewSection>

                <ReviewSection title="Account Details" onEdit={() => handleEditStep(1)}>
                  <ReviewRow label="Account Number:" value={formData.accountNumber || '-'} />
                  <ReviewRow label="Account Type:" value={formData.accountType || '-'} />
                  <ReviewRow label="Preferred currency:" value={formData.preferredCurrency || '-'} />
                </ReviewSection>

                <ReviewSection title="Security Details" onEdit={() => handleEditStep(2)}>
                  <ReviewRow label="Username:" value={formData.username || '-'} />
                </ReviewSection>
              </div>
            </section>
          )}

          <div className="mt-auto flex flex-col-reverse gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-base">
              {currentStep === 0 ? (
                <span>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#050859]">
                    Login
                  </Link>
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="wizard-button wizard-button-back"
                >
                  Back
                </Button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="wizard-button"
            >
              {currentStep === steps.length - 1 ? 'Confirm & Register' : 'Next'}
            </Button>
          </div>
        </form>
      </main>
    </AuthLayout>
  );
};

interface ReviewRowProps {
  label: string;
  value: string;
}

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, children, onEdit }) => (
  <section className="review-section">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3>{title}</h3>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
    </div>
    <div className="grid gap-2">
      {children}
    </div>
  </section>
);

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) => (
  <div className="review-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
