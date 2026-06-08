import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { changePassword, clearError, logout, updateProfile } from '../../store/slices/authSlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import {
  isStrongPassword,
  validationMessages,
  validationPatterns,
} from '../../utils/validation';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [editMode, setEditMode] = React.useState(false);
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const [formData, setFormData] = React.useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    idNumber: user?.idNumber || '',
    accountNumber: user?.accountNumber || '',
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!fullName) newErrors.fullName = 'Full name is required';
    else if (!validationPatterns.personName.test(fullName)) newErrors.fullName = validationMessages.personName;

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';

    if (phone && !validationPatterns.phone.test(phone)) newErrors.phone = validationMessages.phone;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!validateProfileForm()) return;

    const result = await dispatch(
      updateProfile({
        userId: user.id,
        data: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
      })
    );

    if (result.meta.requestStatus !== 'fulfilled') return;

    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (!isStrongPassword(passwordData.newPassword)) newErrors.newPassword = validationMessages.password;
    if (passwordData.newPassword && passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'New password must be different from the current password';
    }
    if (!passwordData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await dispatch(
      changePassword({
        userId: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (result.meta.requestStatus !== 'fulfilled') return;

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordForm(false);
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Profile Settings</h1>

        {successMessage && (
          <Alert type="success" message={successMessage} />
        )}

        {error && (
          <Alert type="error" message={error} onClose={() => dispatch(clearError())} />
        )}

        {/* Profile Information */}
        <Card title="Profile Information" className="mb-6">
          {editMode ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                minLength={2}
                maxLength={50}
                pattern="[A-Za-z][A-Za-z' -]{1,49}"
                autoComplete="name"
                required
              />

              <Input
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                required
              />

              <Input
                type="tel"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                maxLength={20}
                pattern="\+?[0-9 ()-]{7,20}"
                autoComplete="tel"
              />

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">Read-only information:</p>
                <Input
                  type="text"
                  label="Username"
                  value={user?.username || ''}
                  disabled
                />

                <Input
                  type="text"
                  label="ID/Passport Number"
                  value={formData.idNumber}
                  disabled
                />

                <Input
                  type="text"
                  label="Account Number"
                  value={formData.accountNumber}
                  disabled
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-lg">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-lg">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-lg">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-semibold text-lg">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID/Passport Number</p>
                  <p className="font-semibold text-lg">{formData.idNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-semibold text-lg">{formData.accountNumber}</p>
                </div>
              </div>

              <Button variant="primary" onClick={() => setEditMode(true)} className="w-full">
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        {/* Change Password */}
        <Card title="Security" className="mb-6">
          {showPasswordForm ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                autoComplete="current-password"
                maxLength={128}
                required
              />

              <Input
                type="password"
                label="New Password"
                name="newPassword"
                placeholder="Use a strong password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="flex-1"
                >
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Last password change: Never</p>
              <Button
                variant="primary"
                onClick={() => setShowPasswordForm(true)}
                className="w-full"
              >
                Change Password
              </Button>
            </div>
          )}
        </Card>

        {/* Account Actions */}
        <Card>
          <Button variant="danger" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
};
