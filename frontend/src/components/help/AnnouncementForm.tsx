import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { CreateHelpAnnouncement } from '@/types/help';
import { useTranslation } from 'react-i18next';

interface Category {
  value: string;
  label: string;
}

interface AnnouncementFormProps {
  userEmail: string;
  onSubmit: (data: CreateHelpAnnouncement) => void;
  onCancel: () => void;
  initialData?: CreateHelpAnnouncement;
  isEditing?: boolean;
}

export const AnnouncementForm = ({ 
  userEmail, 
  onSubmit, 
  onCancel,
  initialData,
  isEditing = false
}: AnnouncementFormProps) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<CreateHelpAnnouncement>({
    title: initialData?.title || '',
    contact_method: initialData?.contact_method || 'email',
    contact_value: initialData?.contact_value || '',
    status: initialData?.status || 'open',
    categorie: initialData?.categorie || ''
  });
  const [useCustomEmail, setUseCustomEmail] = useState(!initialData?.contact_value);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem('course_categories');
    if (storedCategories) {
      try {
        const parsedCategories = JSON.parse(storedCategories);
        setCategories(Array.isArray(parsedCategories) ? parsedCategories : []);
      } catch (error) {
        console.error('Error parsing categories:', error);
        setCategories([]);
      }
    }
  }, []);

  const isFormValid = () => {
    if (!formData.title) return false;
    if (!formData.categorie) return false;
    if (formData.contact_method === 'phone' && !formData.contact_value) return false;
    if (formData.contact_method === 'email') {
      if (!useCustomEmail) return true;
      if (useCustomEmail && !formData.contact_value) return false;
    }
    return true;
  };

  const handleFormChange = (field: keyof CreateHelpAnnouncement, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      contact_value: formData.contact_method === 'email' && !useCustomEmail ? '' : formData.contact_value
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? t('editHelpAnnouncement', 'Edit Help Announcement') : t('createHelpAnnouncement', 'Create Help Announcement')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('title', 'Title')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={t('enterTitlePlaceholder', 'e.g., Need help with Calculus II')}
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('category', 'Category')} <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.categorie}
              onChange={(e) => handleFormChange('categorie', e.target.value)}
            >
              <option value="">{t('selectCategory', 'Select a category')}</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contactMethod', 'Contact Method')} <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.contact_method}
              onChange={(e) => handleFormChange('contact_method', e.target.value as 'email' | 'phone')}
            >
              <option value="email">{t('email', 'Email')}</option>
              <option value="phone">{t('phone', 'Phone')}</option>
            </select>
          </div>

          {formData.contact_method === 'phone' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('phoneNumber', 'Phone Number')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={t('enterPhoneNumberPlaceholder', 'Enter your phone number')}
                value={formData.contact_value}
                onChange={(e) => handleFormChange('contact_value', e.target.value)}
              />
            </div>
          )}

          {formData.contact_method === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useCustomEmail}
                    onChange={() => {
                      setUseCustomEmail(false);
                      handleFormChange('contact_value', '');
                    }}
                    className="mr-2"
                  />
                  {t('useMyAccountEmail', 'Use my account email ({userEmail})')}
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useCustomEmail}
                    onChange={() => {
                      setUseCustomEmail(true);
                      handleFormChange('contact_value', '');
                    }}
                    className="mr-2"
                  />
                  {t('useDifferentEmail', 'Use a different email')}
                </label>
              </div>
              {useCustomEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('emailAddress', 'Email Address')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={t('enterEmailAddressPlaceholder', 'Enter your email address')}
                    value={formData.contact_value}
                    onChange={(e) => handleFormChange('contact_value', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button 
              type="submit" 
              className="bg-primary-600 hover:bg-primary-700"
              disabled={!isFormValid()}
            >
              {isEditing ? t('updateAnnouncement', 'Update Announcement') : t('createAnnouncement', 'Create Announcement')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 