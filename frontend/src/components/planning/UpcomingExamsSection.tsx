'use client';

import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Exam {
  id: string;
  title: string;
  exam_date: string;
}

interface UpcomingExamsSectionProps {
  exams: Exam[];
  examColors: Record<string, string>;
  isLoading: boolean;
  onRemoveExam: (id: string) => void;
}

export default function UpcomingExamsSection({ 
  exams, 
  examColors, 
  isLoading, 
  onRemoveExam 
}: UpcomingExamsSectionProps) {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">{t('upcomingExams', 'Upcoming Exams')}</h2>
      </div>

      {isLoading ? (
        <p className="text-gray-500 animate-pulse">{t('loadingExams', 'Loading exams...')}</p>
      ) : exams.length > 0 ? (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-soft p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{exam.title}</p>
                  <p className="text-sm text-gray-500">
                    {t('examDate', 'Date: {{date}}', { date: new Date(exam.exam_date).toLocaleDateString() })}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveExam(exam.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title={t('deleteExam', 'Delete Exam')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t('noExamsScheduled', 'No exams scheduled yet')}</p>
      )}
    </div>
  );
} 