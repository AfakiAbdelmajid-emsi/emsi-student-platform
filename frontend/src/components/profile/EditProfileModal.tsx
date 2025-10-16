import { useState } from 'react';
import { type ProfileFormData, type AcademicLevel, type Specialization } from '@/types/profile';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProfileFormData>) => void;
  initialData: ProfileFormData;
}

const academicLevels: AcademicLevel[] = ['CP1', 'CP2', 'GI1', 'GI2', 'GI3'];
const specializations: Specialization[] = [
  'Ingénierie Informatique et Réseaux',
  'Génie Electrique et Systèmes Intelligents',
  'Génie Civil, Bâtiments et Travaux Publics (BTP)',
  'Génie Industriel',
  'Génie Financier'
];

export const EditProfileModal = ({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    full_name: initialData.full_name,
    academic_level: initialData.academic_level,
    specialization: initialData.specialization
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">{t('editProfile')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label={t('fullName')}
            name="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            required
          />

          <FormSelect
            label={t('academicLevel')}
            name="academic_level"
            value={formData.academic_level}
            onChange={(e) => setFormData(prev => ({ ...prev, academic_level: e.target.value as AcademicLevel }))}
            required
            options={[
              { value: '', label: t('selectAcademicLevel', 'Select Academic Level') },
              ...academicLevels.map(level => ({ value: level, label: level }))
            ]}
          />

          <FormSelect
            label={t('specialization')}
            name="specialization"
            value={formData.specialization}
            onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value as Specialization }))}
            required
            options={[
              { value: '', label: t('selectSpecialization', 'Select Specialization') },
              ...specializations.map(spec => ({ value: spec, label: spec }))
            ]}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit">
              {t('saveChanges', 'Save Changes')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 