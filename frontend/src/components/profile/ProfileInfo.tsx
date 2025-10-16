import { ProfileInfoProps } from '@/types/profile';
import Button from '@/components/ui/Button';
import { Shield, Mail, Bell, BookOpen, GraduationCap, Settings, User, Camera } from 'lucide-react';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { useRef, useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import Toast, { ToastType } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';

export const ProfileInfo = ({ formData, isEditing, onInputChange }: ProfileInfoProps) => {
  const { t } = useTranslation('common');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleImageUpload, isLoading } = useProfile();
  const [toastState, setToastState] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleImageUpload(file);
        setToastState({
          message: 'Profile image updated successfully',
          type: 'success',
          isVisible: true,
        });
      } catch (error) {
        setToastState({
          message: error instanceof Error ? error.message : 'Failed to upload image',
          type: 'error',
          isVisible: true,
        });
      }
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />
      {/* Basic Profile Section */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-start gap-6">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageClick();
              }
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden ring-4 ring-white shadow-lg">
              <img
                src={formData.image_url || '/images/placeholder-avatar.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center gap-1">
                <Camera className="h-5 w-5 text-white" />
                <span className="text-white text-sm">{t('changePhoto', 'Change Photo')}</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('fullName', 'Full Name')}</p>
                  <p className="font-medium text-gray-900">{formData.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('email', 'Email')}</p>
                  <p className="font-medium text-gray-900">{formData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary-500" />
          {t('academicInformation', 'Academic Information')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t('academicLevel', 'Academic Level')}</p>
              <p className="font-medium text-gray-900">{formData.academic_level}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t('specialization', 'Specialization')}</p>
              <p className="font-medium text-gray-900">{formData.specialization || t('notSpecified', 'Not specified')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <SecuritySection />

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-500" />
          {t('notificationPreferences', 'Notification Preferences')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('studyReminders', 'Study Reminders')}</p>
                <p className="text-sm text-gray-500">{t('getNotifiedAboutStudySchedule', 'Get notified about your study schedule')}</p>
              </div>
            </div>
            <Button variant="outline">{t('configure', 'Configure')}</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('emailNotifications', 'Email Notifications')}</p>
                <p className="text-sm text-gray-500">{t('manageEmailPreferences', 'Manage your email preferences')}</p>
              </div>
            </div>
            <Button variant="outline">{t('manage', 'Manage')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
