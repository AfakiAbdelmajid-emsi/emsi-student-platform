'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Shield, Mail, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Toast, { ToastType } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const SecuritySection = () => {
  const { updateEmail, updatePassword } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('common');

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const handleAuthError = (error: any) => {
    if (error.message?.includes('Session') || error.message?.includes('JWT')) {
      showToast('Your session has expired. Please log in again.', 'error');
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      showToast(error.message || 'An error occurred. Please try again.', 'error');
    }
  };

  const handleChangeEmail = async () => {
    try {
      await updateEmail(newEmail, emailPassword);
      showToast('Confirmation links have been sent to both your current and new email addresses.', 'success');
      setIsEmailModalOpen(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      showToast('Password updated successfully.', 'success');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary-500" />
        {t('securitySettings', 'Security Settings')}
      </h3>
      <div className="space-y-4">
        {/* General Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Mail className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('emailSecurity', 'Email Security')}</p>
              <p className="text-sm text-gray-500">{t('updateEmailAndPassword', 'Update your email and password')}</p>
            </div>
          </div>
        </div>

        {/* Change Email */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <KeyRound className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('changeEmail', 'Change Email')}</p>
              <p className="text-sm text-gray-500">{t('changeAccountEmail', 'Change your account email (confirmation required)')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEmailModalOpen(true)}
            className="hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
          >
            {t('changeEmail', 'Change Email')}
          </Button>
        </div>

        {/* Change Password */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Lock className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('resetPassword', 'Reset Password')}</p>
              <p className="text-sm text-gray-500">{t('changeAccountPassword', 'Change your account password')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
          >
            {t('resetPassword', 'Reset Password')}
          </Button>
        </div>

        {/* Placeholder for 2FA */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Shield className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('twoFactorAuth', 'Two-Factor Authentication')}</p>
              <p className="text-sm text-gray-500">{t('addExtraSecurity', 'Add an extra layer of security')}</p>
            </div>
          </div>
          <Button variant="outline">{t('enable', 'Enable')}</Button>
        </div>
      </div>

      {/* Email Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title={t('changeEmail', 'Change Email')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('newEmail', 'New Email')}</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder={t('enterNewEmail', 'Enter new email')}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{t('currentPassword', 'Current Password')}</label>
            <input
              type={showEmailPassword ? "text" : "password"}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder={t('enterYourPassword', 'Enter your password')}
            />
            <button
              type="button"
              onClick={() => setShowEmailPassword(!showEmailPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showEmailPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button onClick={handleChangeEmail}>
              {t('changeEmail', 'Change Email')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title={t('changePassword', 'Change Password')}>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{t('currentPassword', 'Current Password')}</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder={t('enterCurrentPassword', 'Enter current password')}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{t('newPassword', 'New Password')}</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder={t('enterNewPassword', 'Enter new password')}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{t('confirmNewPassword', 'Confirm New Password')}</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
              placeholder={t('confirmNewPassword', 'Confirm new password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button onClick={handleChangePassword}>
              {t('updatePassword', 'Update Password')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};
