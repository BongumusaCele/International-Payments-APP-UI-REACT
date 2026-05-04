import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { createPayment } from '../../store/slices/paymentSlice';
import { fetchBeneficiaries } from '../../store/slices/beneficiarySlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

const paymentProviders = ['SWIFT', 'Bank Transfer', 'EFT'];

export const CreatePaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { loading: paymentLoading, error: paymentError } = useAppSelector((state) => state.payments);
  const {
    items: beneficiaries,
    loading: beneficiariesLoading,
    error: beneficiariesError,
  } = useAppSelector((state) => state.beneficiaries);

  const [formData, setFormData] = React.useState({
    amount: '',
    currency: user?.preferredCurrency || 'ZAR',
    beneficiaryId: '',
    provider: 'SWIFT',
    recipientName: '',
    recipientAccountNumber: '',
    recipientBankName: '',
    swiftCode: '',
    paymentReference: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchBeneficiaries(user.id));
    }
  }, [dispatch, user?.id]);

  const selectedBeneficiary = beneficiaries.find((beneficiary) => beneficiary.id === formData.beneficiaryId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const swiftCode = formData.swiftCode.trim().toUpperCase();

    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.beneficiaryId) newErrors.beneficiaryId = 'Select a beneficiary';
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

    if (name === 'beneficiaryId') {
      const beneficiary = beneficiaries.find((item) => item.id === value);
      setFormData((prev) => ({
        ...prev,
        beneficiaryId: value,
        currency: beneficiary?.currency || user?.preferredCurrency || prev.currency,
        recipientName: beneficiary?.name || '',
        recipientAccountNumber: beneficiary?.accountNumber || '',
        recipientBankName: beneficiary?.bankName || '',
        swiftCode: beneficiary?.swiftCode || '',
      }));
      setErrors((prev) => ({
        ...prev,
        beneficiaryId: '',
        recipientName: '',
        recipientAccountNumber: '',
        recipientBankName: '',
        swiftCode: '',
      }));
      return;
    }

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
          beneficiaryId: formData.beneficiaryId,
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
            Select a saved beneficiary, enter the amount, and submit the payment for processing.
          </p>
        </div>

        <Card>
          {beneficiariesError && (
            <Alert type="error" message={beneficiariesError} />
          )}

          {paymentError && (
            <Alert
              type="error"
              message={paymentError}
            />
          )}

          {!beneficiariesLoading && beneficiaries.length === 0 && (
            <Alert
              type="warning"
              message="Add a beneficiary before creating a payment."
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
                  <label htmlFor="beneficiaryId" className="form-label">
                    Beneficiary
                  </label>
                  <select
                    id="beneficiaryId"
                    name="beneficiaryId"
                    value={formData.beneficiaryId}
                    onChange={handleChange}
                    className={`input-base ${errors.beneficiaryId ? 'border-red-500' : ''}`}
                    disabled={beneficiariesLoading || beneficiaries.length === 0}
                    required
                  >
                    <option value="">
                      {beneficiariesLoading ? 'Loading beneficiaries...' : 'Select beneficiary'}
                    </option>
                    {beneficiaries.map((beneficiary) => (
                      <option key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.name} - {beneficiary.bankName}
                      </option>
                    ))}
                  </select>
                  {errors.beneficiaryId && <p className="form-error">{errors.beneficiaryId}</p>}
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

                <div className="form-group md:col-span-2">
                  <label className="form-label">Payment Currency</label>
                  <div className="input-base bg-gray-50">
                    {selectedBeneficiary?.currency || user?.preferredCurrency || formData.currency}
                  </div>
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                disabled={beneficiariesLoading || beneficiaries.length === 0}
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
