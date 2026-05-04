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
import { validationMessages, validationPatterns } from '../../utils/validation';

interface BankOption {
  id: string;
  name: string;
  country: string;
  swiftCode: string;
}

const bankDirectory: BankOption[] = [
  { id: 'za-standard-bank', name: 'Standard Bank', country: 'South Africa', swiftCode: 'SBZAZAJJ' },
  { id: 'za-fnb', name: 'First National Bank', country: 'South Africa', swiftCode: 'FIRNZAJJ' },
  { id: 'za-absa', name: 'ABSA Bank', country: 'South Africa', swiftCode: 'ABSAZAJJ' },
  { id: 'za-nedbank', name: 'Nedbank', country: 'South Africa', swiftCode: 'NEDSZAJJ' },
  { id: 'za-capitec', name: 'Capitec Bank', country: 'South Africa', swiftCode: 'CABLZAJJ' },
  { id: 'us-chase', name: 'JPMorgan Chase Bank', country: 'United States', swiftCode: 'CHASUS33' },
  { id: 'us-citi', name: 'Citibank', country: 'United States', swiftCode: 'CITIUS33' },
  { id: 'us-bofa', name: 'Bank of America', country: 'United States', swiftCode: 'BOFAUS3N' },
  { id: 'us-wells', name: 'Wells Fargo Bank', country: 'United States', swiftCode: 'WFBIUS6S' },
  { id: 'gb-hsbc', name: 'HSBC UK Bank', country: 'United Kingdom', swiftCode: 'HBUKGB4B' },
  { id: 'gb-barclays', name: 'Barclays Bank', country: 'United Kingdom', swiftCode: 'BARCGB22' },
  { id: 'gb-lloyds', name: 'Lloyds Bank', country: 'United Kingdom', swiftCode: 'LOYDGB2L' },
  { id: 'gb-natwest', name: 'NatWest', country: 'United Kingdom', swiftCode: 'NWBKGB2L' },
  { id: 'de-deutsche', name: 'Deutsche Bank', country: 'Germany', swiftCode: 'DEUTDEFF' },
  { id: 'de-commerzbank', name: 'Commerzbank', country: 'Germany', swiftCode: 'COBADEFF' },
  { id: 'fr-bnp', name: 'BNP Paribas', country: 'France', swiftCode: 'BNPAFRPP' },
  { id: 'fr-societe', name: 'Societe Generale', country: 'France', swiftCode: 'SOGEFRPP' },
  { id: 'ca-rbc', name: 'Royal Bank of Canada', country: 'Canada', swiftCode: 'ROYCCAT2' },
  { id: 'ca-td', name: 'TD Canada Trust', country: 'Canada', swiftCode: 'TDOMCATTTOR' },
  { id: 'ca-bmo', name: 'Bank of Montreal', country: 'Canada', swiftCode: 'BOFMCAM2' },
  { id: 'jp-mufg', name: 'MUFG Bank', country: 'Japan', swiftCode: 'BOTKJPJT' },
  { id: 'jp-smbc', name: 'Sumitomo Mitsui Banking Corporation', country: 'Japan', swiftCode: 'SMBCJPJT' },
  { id: 'jp-mizuho', name: 'Mizuho Bank', country: 'Japan', swiftCode: 'MHCBJPJT' },
  { id: 'au-anz', name: 'ANZ Bank', country: 'Australia', swiftCode: 'ANZBAU3M' },
  { id: 'au-cba', name: 'Commonwealth Bank of Australia', country: 'Australia', swiftCode: 'CTBAAU2S' },
];

const countries = Array.from(new Set(bankDirectory.map((bank) => bank.country))).sort();
const customBankId = 'custom';

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
  const [selectedBankId, setSelectedBankId] = React.useState('');
  const [bankSearch, setBankSearch] = React.useState('');
  const isEditing = editingBeneficiaryId !== null;
  const isCustomBank = selectedBankId === customBankId;

  const filteredBanks = React.useMemo(() => {
    const normalizedSearch = bankSearch.trim().toLowerCase();

    return bankDirectory.filter((bank) => {
      const matchesCountry = !formData.country || bank.country === formData.country;
      const matchesSearch = !normalizedSearch
        || bank.name.toLowerCase().includes(normalizedSearch)
        || bank.swiftCode.toLowerCase().includes(normalizedSearch);

      return matchesCountry && matchesSearch;
    });
  }, [bankSearch, formData.country]);

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchBeneficiaries(user.id));
    }
  }, [user?.id, dispatch]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const swiftCode = formData.swiftCode.trim().toUpperCase();

    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (!validationPatterns.personName.test(formData.name.trim())) errors.name = validationMessages.personName;
    if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    else if (!validationPatterns.beneficiaryAccountNumber.test(formData.accountNumber.trim())) errors.accountNumber = validationMessages.beneficiaryAccountNumber;
    if (!formData.bankName.trim()) errors.bankName = 'Bank name is required';
    else if (!validationPatterns.bankName.test(formData.bankName.trim())) errors.bankName = validationMessages.bankName;
    if (!swiftCode) errors.swiftCode = 'SWIFT/BIC code is required';
    else if (!validationPatterns.swiftCode.test(swiftCode)) {
      errors.swiftCode = validationMessages.swiftCode;
    }
    if (!formData.country.trim()) errors.country = 'Country is required';
    else if (!validationPatterns.country.test(formData.country.trim())) errors.country = validationMessages.country;

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

  const clearFieldErrors = (...fieldNames: string[]) => {
    setFormErrors((prev) => {
      const nextErrors = { ...prev };
      fieldNames.forEach((fieldName) => {
        delete nextErrors[fieldName];
      });
      return nextErrors;
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country,
      bankName: '',
      swiftCode: '',
    }));
    setSelectedBankId('');
    setBankSearch('');
    clearFieldErrors('country', 'bankName', 'swiftCode');
  };

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bankId = e.target.value;
    setSelectedBankId(bankId);

    if (!bankId) {
      setFormData((prev) => ({
        ...prev,
        bankName: '',
        swiftCode: '',
      }));
      return;
    }

    if (bankId === customBankId) {
      setFormData((prev) => ({
        ...prev,
        bankName: '',
        swiftCode: '',
      }));
      clearFieldErrors('bankName', 'swiftCode');
      return;
    }

    const bank = bankDirectory.find((item) => item.id === bankId);
    if (!bank) return;

    setFormData((prev) => ({
      ...prev,
      bankName: bank.name,
      swiftCode: bank.swiftCode,
      country: bank.country,
    }));
    setBankSearch('');
    clearFieldErrors('country', 'bankName', 'swiftCode');
  };

  const resetForm = () => {
    setFormData(emptyFormData);
    setFormErrors({});
    setEditingBeneficiaryId(null);
    setSelectedBankId('');
    setBankSearch('');
    setShowForm(false);
  };

  const handleAddClick = () => {
    setFormData(emptyFormData);
    setFormErrors({});
    setEditingBeneficiaryId(null);
    setSelectedBankId('');
    setBankSearch('');
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
    const matchingBank = bankDirectory.find((bank) =>
      bank.name === beneficiary.bankName &&
      bank.country === beneficiary.country &&
      bank.swiftCode === beneficiary.swiftCode
    );
    setFormErrors({});
    setSelectedBankId(matchingBank?.id || customBankId);
    setBankSearch('');
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
                minLength={2}
                maxLength={50}
                pattern="[A-Za-z][A-Za-z' -]{1,49}"
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
                minLength={6}
                maxLength={20}
                pattern="\d{6,20}"
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className={`input-base ${formErrors.country ? 'border-red-500' : ''}`}
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {formErrors.country && <p className="form-error">{formErrors.country}</p>}
                </div>

                <Input
                  type="search"
                  label="Search Bank"
                  placeholder="Search by bank or SWIFT"
                  value={bankSearch}
                  onChange={(event) => setBankSearch(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bank-select" className="form-label">
                  Bank
                </label>
                <select
                  id="bank-select"
                  value={selectedBankId}
                  onChange={handleBankSelect}
                  className={`input-base ${formErrors.bankName ? 'border-red-500' : ''}`}
                  required={!isCustomBank}
                >
                  <option value="">
                    {formData.country ? 'Select bank' : 'Select a country first'}
                  </option>
                  {filteredBanks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name} - {bank.swiftCode}
                    </option>
                  ))}
                  <option value={customBankId}>Bank not listed</option>
                </select>
                {formErrors.bankName && <p className="form-error">{formErrors.bankName}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Selecting a listed bank fills the country and SWIFT/BIC code automatically.
                </p>
              </div>

              {isCustomBank && (
                <Input
                  type="text"
                  label="Bank Name"
                  name="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={handleChange}
                  error={formErrors.bankName}
                  minLength={2}
                  maxLength={80}
                  pattern="[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{1,79}"
                  required
                />
              )}

              <Input
                type="text"
                label="SWIFT/BIC Code"
                name="swiftCode"
                placeholder="Example: FIRNZAJJ"
                value={formData.swiftCode}
                onChange={handleChange}
                error={formErrors.swiftCode}
                pattern="[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?"
                maxLength={11}
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
