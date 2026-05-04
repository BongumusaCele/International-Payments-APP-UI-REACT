import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import {
  fetchBeneficiaries,
  addBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  clearError,
} from '../../store/slices/beneficiarySlice';
import { BeneficiaryRequest } from '../../types';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pencil, Trash2, Plus } from 'lucide-react';

const emptyFormData: BeneficiaryRequest = {
  name: '',
  accountNumber: '',
  bankName: '',
  swiftCode: '',
  country: '',
};

export const BeneficiariesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: beneficiaries, loading, error } = useAppSelector((state) => state.beneficiaries);
  const [showForm, setShowForm] = React.useState(false);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<BeneficiaryRequest>(emptyFormData);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const isEditing = editingBeneficiaryId !== null;

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchBeneficiaries(user.id));
    }
  }, [user?.id, dispatch]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const swiftCode = formData.swiftCode.trim().toUpperCase();

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    else if (!/^\d+$/.test(formData.accountNumber.trim())) errors.accountNumber = 'Account number must contain digits only';
    if (!formData.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!swiftCode) errors.swiftCode = 'SWIFT/BIC code is required';
    else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      errors.swiftCode = 'Enter a valid 8 or 11 character SWIFT code';
    }
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

  const resetForm = () => {
    setFormData(emptyFormData);
    setFormErrors({});
    setEditingBeneficiaryId(null);
    setShowForm(false);
  };

  const handleAddClick = () => {
    setFormData(emptyFormData);
    setFormErrors({});
    setEditingBeneficiaryId(null);
    setShowForm(true);
  };

  const handleEditClick = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find((item) => item.id === beneficiaryId);
    if (!beneficiary) return;

    setFormData({
      name: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
      bankName: beneficiary.bankName,
      swiftCode: beneficiary.swiftCode,
      country: beneficiary.country,
    });
    setFormErrors({});
    setEditingBeneficiaryId(beneficiaryId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) return;

    const normalizedData = {
      name: formData.name.trim(),
      accountNumber: formData.accountNumber.trim(),
      bankName: formData.bankName.trim(),
      swiftCode: formData.swiftCode.trim().toUpperCase(),
      country: formData.country.trim(),
    };

    const result = isEditing
      ? await dispatch(updateBeneficiary({ beneficiaryId: editingBeneficiaryId, data: normalizedData }))
      : await dispatch(addBeneficiary({ userId: user.id, data: normalizedData }));

    if (result.meta.requestStatus === 'fulfilled') {
      resetForm();
    }
  };

  const handleDelete = async (beneficiaryId: string) => {
    if (confirm('Are you sure you want to delete this beneficiary?')) {
      const result = await dispatch(deleteBeneficiary(beneficiaryId));
      if (result.meta.requestStatus === 'fulfilled' && editingBeneficiaryId === beneficiaryId) {
        resetForm();
      }
    }
  };

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Beneficiaries</h1>
          <Button
            variant={showForm ? 'danger' : 'primary'}
            onClick={showForm ? resetForm : handleAddClick}
          >
            {showForm ? null : <Plus className="inline mr-2 h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Beneficiary'}
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => dispatch(clearError())} />
        )}

        {showForm && (
          <Card className="mb-8" title={isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary'}>
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
                placeholder="123456789"
                value={formData.accountNumber}
                onChange={handleChange}
                error={formErrors.accountNumber}
                inputMode="numeric"
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
                maxLength={11}
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

              <div className="flex flex-col-reverse gap-4 sm:flex-row">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
                  {isEditing ? 'Save Changes' : 'Add Beneficiary'}
                </Button>
              </div>
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
                      {beneficiary.accountNumber} - {beneficiary.bankName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {beneficiary.swiftCode} - {beneficiary.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(beneficiary.id)}
                      className="text-blue-900 hover:bg-blue-100 p-2 rounded transition-colors"
                      aria-label={`Edit ${beneficiary.name}`}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(beneficiary.id)}
                      className="text-danger hover:bg-red-100 p-2 rounded transition-colors"
                      aria-label={`Delete ${beneficiary.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
