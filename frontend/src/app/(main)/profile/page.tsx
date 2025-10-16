"use client"
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { type ProfileFormData } from '@/types/profile';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/lib/i18n';

export default function ProfilePage() {
  const {
    isLoading,
    error,
    profile,
    handleProfileUpdate,
  } = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    full_name: '',
    academic_level: 'CP1',
    specialization: '',
    is_anonymous: false,
    image_url: ''
  });

  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name,
        email: profile.emsil ?? '',
        language: 'en',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          marketing: false
        },
        full_name: profile.full_name,
        academic_level: profile.academic_level,
        specialization: profile.specialization ?? '',
        is_anonymous: profile.is_anonymous,
        image_url: profile.image_url ?? ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (data: Partial<ProfileFormData>) => {
    try {
      await handleProfileUpdate({
        ...formData,
        ...data
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    changeLanguage(lang);
  };

  if (isLoading) return (
    <PageContainer>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </PageContainer>
  );

  if (error) return (
    <PageContainer>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{t('profileSettings')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('manageAccount')}</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {t('editProfile')}
            </Button>
          </div>
        </div>

        <ProfileInfo 
          formData={formData} 
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={formData}
      />
    </PageContainer>
  );
}

