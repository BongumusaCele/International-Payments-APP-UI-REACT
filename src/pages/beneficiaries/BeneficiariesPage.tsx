import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import {
  fetchBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
  clearError,
} from '../../store/slices/beneficiarySlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Trash2, Plus } from 'lucide-react';

export const BeneficiariesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: beneficiaries, loading, error } = useAppSelector((state) => state.beneficiaries);
  const [showForm, setShowForm] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    country: '',
    currency: 'ZAR',
  });

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchBeneficiaries(user.id));
    }
  }, [user?.id, dispatch]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    if (!formData.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!formData.swiftCode.trim()) errors.swiftCode = 'SWIFT/BIC code is required';
    if (!formData.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) return;

    const result = await dispatch(
      addBeneficiary({
        userId: user.id,
        data: {
          name: formData.name,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          swiftCode: formData.swiftCode,
          country: formData.country,
          currency: formData.currency,
        },
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setFormData({
        name: '',
        accountNumber: '',
        bankName: '',
        swiftCode: '',
        country: '',
        currency: 'ZAR',
      });
      setShowForm(false);
    }
  };

  const handleDelete = async (beneficiaryId: string) => {
    if (!user?.id) return;
    if (confirm('Are you sure you want to delete this beneficiary?')) {
      dispatch(deleteBeneficiary({ userId: user.id, beneficiaryId }));
    }
  };

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Beneficiaries</h1>
          <Button
            variant={showForm ? 'danger' : 'primary'}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : <Plus className="inline mr-2 h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Beneficiary'}
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => dispatch(clearError())} />
        )}

        {showForm && (
          <Card className="mb-8" title="Add New Beneficiary">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Beneficiary Name"
                name="name"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                required
              />

              <Input
                type="text"
                label="Account Number"
                name="accountNumber"
                placeholder="ACC12345"
                value={formData.accountNumber}
                onChange={handleChange}
                error={formErrors.accountNumber}
                required
              />

              <Input
                type="text"
                label="Bank Name"
                name="bankName"
                placeholder="Global Bank"
                value={formData.bankName}
                onChange={handleChange}
                error={formErrors.bankName}
                required
              />

              <Input
                type="text"
                label="SWIFT/BIC Code"
                name="swiftCode"
                placeholder="GLBKZAJJ"
                value={formData.swiftCode}
                onChange={handleChange}
                error={formErrors.swiftCode}
                required
              />

              <Input
                type="text"
                label="Country"
                name="country"
                placeholder="USA"
                value={formData.country}
                onChange={handleChange}
                error={formErrors.country}
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
                  className="input-base"
                >
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Add Beneficiary
              </Button>
            </form>
          </Card>
        )}

        <Card>
          {loading ? (
            <LoadingSpinner />
          ) : beneficiaries.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No beneficiaries yet. Add one to create payments!
            </p>
          ) : (
            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{beneficiary.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {beneficiary.accountNumber} • {beneficiary.bankName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {beneficiary.swiftCode} • {beneficiary.country} ({beneficiary.currency})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(beneficiary.id)}
                    className="text-danger hover:bg-red-100 p-2 rounded transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
