// src/components/ui/courses/AddCourseForm.tsx
'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import { useCourses } from '@/hooks/use-courses-query';
import { useTranslation } from 'react-i18next';
import type { CourseCreate } from '@/types/courses';

interface AddCourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddCourseForm = ({ onSuccess, onCancel }: AddCourseFormProps) => {
  const { addCourse, categories } = useCourses();
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
    };

    try {
      await addCourse(courseData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block p-3 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 mb-4">
        </div>
        <h2 className="text-2xl font-display font-bold text-primary-600">
          {t('addNewCourse', 'Add New Course')}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t('createNewCourse', 'Create a new course to start your learning journey')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            label={t('courseTitle', 'Course Title')}
            name="title"
            type="text"
            required
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
              placeholder={t('enterCourseDescription', 'Enter course description')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm resize-none"
            />
          </div>

          <FormSelect
            label={t('category', 'Category')}
            name="category"
            required
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
            {t('addCourse', 'Add Course')}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};