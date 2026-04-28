import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { createPayment } from '../../store/slices/paymentSlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

const currencies = ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD'];
const paymentProviders = ['SWIFT', 'Bank Transfer', 'EFT'];

export const CreatePaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { loading: paymentLoading, error: paymentError } = useAppSelector((state) => state.payments);

  const [formData, setFormData] = React.useState({
    amount: '',
    currency: 'ZAR',
    provider: 'SWIFT',
    recipientName: '',
    recipientAccountNumber: '',
    recipientBankName: '',
    swiftCode: '',
    paymentReference: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const swiftCode = formData.swiftCode.trim().toUpperCase();

    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.provider) newErrors.provider = 'Payment provider is required';
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!formData.recipientAccountNumber.trim()) newErrors.recipientAccountNumber = 'Account number is required';
    if (!formData.recipientBankName.trim()) newErrors.recipientBankName = 'Bank name is required';
    if (!swiftCode) {
      newErrors.swiftCode = 'SWIFT code is required';
    } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      newErrors.swiftCode = 'Enter a valid 8 or 11 character SWIFT code';
    }
    if (!formData.paymentReference.trim()) newErrors.paymentReference = 'Payment reference is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) return;

    const result = await dispatch(
      createPayment({
        userId: user.id,
        data: {
          amount: Number(formData.amount),
          currency: formData.currency,
          provider: formData.provider,
          recipientName: formData.recipientName,
          recipientAccountNumber: formData.recipientAccountNumber,
          recipientBankName: formData.recipientBankName,
          swiftCode: formData.swiftCode.trim().toUpperCase(),
          paymentReference: formData.paymentReference,
        },
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/payments');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Make a Payment</h1>
          <p className="mt-2 text-gray-600">
            Enter the payment amount, select a provider, then add the recipient account and SWIFT details.
          </p>
        </div>

        <Card>
          {paymentError && (
            <Alert
              type="error"
              message={paymentError}
              onClose={() => window.location.reload()}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-bold text-blue-900">Payment Details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  type="number"
                  label="Amount"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  error={errors.amount}
                  step="0.01"
                  min="0"
                  required
                />

                <div className="form-group">
                  <label htmlFor="currency" className="form-label">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={`input-base ${errors.currency ? 'border-red-500' : ''}`}
                    required
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  {errors.currency && <p className="form-error">{errors.currency}</p>}
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="provider" className="form-label">
                    Payment Provider
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className={`input-base ${errors.provider ? 'border-red-500' : ''}`}
                    required
                  >
                    {paymentProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                  {errors.provider && <p className="form-error">{errors.provider}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-blue-900">Recipient Account Information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  type="text"
                  label="Recipient Name"
                  name="recipientName"
                  placeholder="Enter recipient name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  error={errors.recipientName}
                  required
                />

                <Input
                  type="text"
                  label="Account Number"
                  name="recipientAccountNumber"
                  placeholder="Enter account number"
                  value={formData.recipientAccountNumber}
                  onChange={handleChange}
                  error={errors.recipientAccountNumber}
                  required
                />

                <Input
                  type="text"
                  label="Bank Name"
                  name="recipientBankName"
                  placeholder="Enter recipient bank"
                  value={formData.recipientBankName}
                  onChange={handleChange}
                  error={errors.recipientBankName}
                  required
                />

                <Input
                  type="text"
                  label="SWIFT Code"
                  name="swiftCode"
                  placeholder="Example: FIRNZAJJ"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  error={errors.swiftCode}
                  maxLength={11}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="Payment Reference"
                    name="paymentReference"
                    placeholder="REF-12345"
                    value={formData.paymentReference}
                    onChange={handleChange}
                    error={errors.paymentReference}
                    required
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/payments')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={paymentLoading}
                className="flex-1"
              >
                Pay Now
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};
