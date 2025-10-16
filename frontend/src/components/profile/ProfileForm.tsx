'use client';
import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { ACADEMIC_LEVELS } from '@/constants/academic-levels';
import { SPECIALIZATIONS } from '@/constants/specializations';
import type { ProfileFormData } from '@/types/profile';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import FormCheckbox from '@/components/ui/FormCheckbox';
import SubmitButton from '@/components/ui/SubmitButton';
import { useTranslation } from 'react-i18next';

export default function ProfileForm() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    academic_level: 'CP1',
    specialization: '',
    is_anonymous: false
  });

  const { isLoading, error, submitProfile } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitProfile(formData);
    } catch {
      // error is handled in hook
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
  
    const isCheckbox = (
      target: EventTarget & (HTMLInputElement | HTMLTextAreaElement)
    ): target is HTMLInputElement => {
      return (target as HTMLInputElement).type === 'checkbox';
    };
  
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox(e.target) ? e.target.checked : value,
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {t('completeProfile', 'Compléter Votre Profil EMSI')}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label={t('fullName', 'Nom Complet')}
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleInputChange}
          disabled={formData.is_anonymous}
          required={!formData.is_anonymous}
          className={formData.is_anonymous ? 'bg-gray-100 text-gray-400' : ''}
        />

        <FormSelect
          label={t('academicLevel', 'Niveau Académique')}
          name="academic_level"
          value={formData.academic_level}
          onChange={handleSelectChange}
          options={ACADEMIC_LEVELS}
        />

        {['GI1', 'GI2', 'GI3'].includes(formData.academic_level) && (
          <FormSelect
            label={t('specialization', 'Spécialisation')}
            name="specialization"
            value={formData.specialization}
            onChange={handleSelectChange}
            required
            options={[
              { value: '', label: t('selectSpecialization', 'Sélectionnez votre spécialisation') },
              ...SPECIALIZATIONS.map(spec => ({ value: spec, label: spec }))
            ]}
          />
        )}

        <FormCheckbox
          name="is_anonymous"
          checked={formData.is_anonymous}
          onChange={handleInputChange}
          label={t('stayAnonymous', 'Rester anonyme')}
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText={t('loading', 'En cours...')}
          defaultText={t('completeProfile', 'Compléter le Profil')}
        />
      </form>
    </div>
  );
}
