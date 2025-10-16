// src/components/ui/courses/EditCourseForm.tsx
'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import { SubmitButton } from './SubmitButton';
import { useTranslation } from 'react-i18next';
import { useCourses } from '@/hooks/use-courses-query';
import type { CourseOut, CourseUpdate } from '@/types/courses';

interface EditCourseFormProps {
  course: CourseOut;
  onSuccess: (updatedCourse: CourseOut) => void;
  onCancel: () => void;
}

export const EditCourseForm = ({ course, onSuccess, onCancel }: EditCourseFormProps) => {
  const { editCourse, categories } = useCourses();
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description || '',
    category: course.category || '',
  });

  useEffect(() => {
    // Reset form values when course prop changes
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category || '',
    });
  }, [course]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedCourse = await editCourse(course.id, formData);
      onSuccess(updatedCourse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-primary-600">
          {t('editCourse', 'Edit Course')}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t('updateCourseDetails', 'Update your course details')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            label={t('courseTitle', 'Course Title')}
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={t('enterCourseTitle', 'Enter course title')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('description', 'Description')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('enterCourseDescription', 'Enter course description')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm resize-none"
            />
          </div>

          <FormSelect
            label={t('category', 'Category')}
            name="category"
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            options={categories}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 bg-white/80 backdrop-blur-sm"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {t('cancel', 'Cancel')}
          </Button>
          <SubmitButton
            isLoading={isSubmitting}
            className="px-6 py-3 rounded-xl bg-primary-500 text-white hover:shadow-lg transition-all duration-200"
          >
            {t('saveChanges', 'Save Changes')}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};
