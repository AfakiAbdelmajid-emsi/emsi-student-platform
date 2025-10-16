'use client';
import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";
import { usePlanning } from '@/hooks/use-planing';
import { useTranslation } from 'react-i18next';
import { X, Plus } from 'lucide-react';

interface ExamFormData {
  title: string;
  exam_date: string;
  priority: string;
  course: string;
  customCourse: string;
}

interface AddExamProps {
  onClose: () => void;
}

export default function AddExam({ onClose }: AddExamProps) {
  const { planning, isLoading, error, submitMultipleExams } = usePlanning();
  const { t } = useTranslation('common');
  const [exams, setExams] = useState<ExamFormData[]>([
    { 
      title: "", 
      exam_date: new Date().toISOString().slice(0, 16), 
      priority: "3", 
      course: "",
      customCourse: "" 
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedExams = [...exams];
    const value = e.target.value;

    updatedExams[index] = {
      ...updatedExams[index],
      [e.target.name]: value
    };

    if (e.target.name === "course") {
      if (value !== "other") {
        updatedExams[index].title = value;
      } else {
        updatedExams[index].title = "";
      }
    }

    setExams(updatedExams);
  };

  const addExamField = () => {
    setExams([
      ...exams,
      { 
        title: "", 
        exam_date: new Date().toISOString().slice(0, 16), 
        priority: "3", 
        course: "",
        customCourse: "" 
      },
    ]);
  };

  const removeExam = (index: number) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const examsToSubmit = exams.map(exam => ({
        title: exam.course === "other" ? exam.customCourse : exam.title,
        exam_date: exam.exam_date,
        priority: parseInt(exam.priority),
        course: exam.course === "other" ? exam.customCourse : exam.course
      }));

      await submitMultipleExams(examsToSubmit);
      onClose();
    } catch (error) {
      console.error("Failed to submit exams:", error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit exams');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold text-gray-900">{t('addMultipleExams', 'Add Multiple Exams')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              title={t('close', 'Close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg animate-fade-in border border-red-200">
              {submitError}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 animate-pulse">{t('loadingCourses', 'Loading courses...')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {exams.map((exam, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-6 rounded-xl space-y-4 relative animate-fade-in border border-gray-200"
                >
                  <FormSelect
                    label="Course"
                    name="course"
                    value={exam.course}
                    onChange={(e) => handleChange(index, e)}
                    options={[
                      { label: "Select a course", value: "", disabled: true },
                      ...(planning.courses?.map((course) => ({
                        label: course,
                        value: course
                      })) || []),
                      { label: "Other", value: "other" },
                    ]}
                    required
                  />

                  {exam.course === "other" && (
                    <FormInput
                      label="Enter New Course"
                      name="customCourse"
                      value={exam.customCourse}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Enter new course name"
                      required
                    />
                  )}

                  <FormInput
                    label="Exam Date"
                    type="datetime-local"
                    name="exam_date"
                    value={exam.exam_date}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />

                  <FormSelect
                    label="Priority"
                    name="priority"
                    value={exam.priority}
                    onChange={(e) => handleChange(index, e)}
                    options={[
                      { label: "1 (Highest)", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5 (Lowest)", value: "5" },
                    ]}
                    required
                  />
                  
                  {exams.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExam(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title={t('removeExam', 'Remove Exam')}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button 
                  type="button" 
                  onClick={addExamField}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {t('addAnotherExam', 'Add Another Exam')}
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t('cancel', 'Cancel')}
                  </Button>
                  <SubmitButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-primary-600 text-white hover:bg-primary-700"
                  >
                    {isSubmitting ? t('saving', 'Saving...') : t('saveExams', 'Save Exams')}
                  </SubmitButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
