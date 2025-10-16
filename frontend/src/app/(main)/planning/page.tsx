"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import AddExam from "@/components/planning/AddExam";
import { usePlanning } from "@/hooks/use-planing";
import PageContainer from "@/components/ui/PageContainer";
import CalendarSection from "@/components/planning/CalendarSection";
import TasksSection from "@/components/planning/TasksSection";
import UpcomingExamsSection from "@/components/planning/UpcomingExamsSection";
import { useTranslation } from 'react-i18next';

// Function to generate random colors for each exam
const generateRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-rose-500',
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-pink-400'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function PlanningPage() {
  const { t } = useTranslation('common');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [examColors, setExamColors] = useState<Record<string, string>>({});

  const { planning, isLoading, fetchExams, removeExam, generateAndDownloadPlan } = usePlanning();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    if (planning?.exams?.length) {
      const colors: Record<string, string> = {};
      planning.exams.forEach(exam => {
        colors[exam.id] = generateRandomColor();
      });
      setExamColors(colors);
    }
  }, [planning?.exams]);

  const handleAddExam = () => {
    setShowModal(true);
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleDownloadPDF = () => {
    generateAndDownloadPlan();
  };

  const getExamColorsForDate = (date: Date) => {
    if (!planning?.exams) return [];
    return planning.exams
      .filter(exam => {
        const examDate = new Date(exam.exam_date);
        return (
          examDate.getDate() === date.getDate() &&
          examDate.getMonth() === date.getMonth() &&
          examDate.getFullYear() === date.getFullYear()
        );
      })
      .map(exam => examColors[exam.id] || 'bg-gray-500');
  };

  const tileContent = ({ date }: { date: Date }) => {
    const colors = getExamColorsForDate(date);
    if (colors.length === 0) return null;

    return (
      <div className="flex justify-center gap-1 mt-1">
        {colors.map((color, index) => (
          <div key={index} className={`w-1.5 h-1.5 rounded-full ${color}`} />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-4">
            {t('pageTitles.planning')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t('pageTitles.planningDesc')}
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              {t('generateStudyPlan', 'Generate Study Plan')}
            </Button>
            <Button 
              onClick={handleAddExam}
              className="bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('addExam', 'Add Exam')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <CalendarSection
              selectedDate={selectedDate}
              currentDate={currentDate}
              onDateChange={handleDateChange}
              tileContent={tileContent}
            />
          </div>

          {/* Tasks Section */}
          <div>
            <TasksSection />
          </div>
        </div>

        {/* Upcoming Exams Section */}
        <UpcomingExamsSection
          exams={planning?.exams || []}
          examColors={examColors}
          isLoading={isLoading}
          onRemoveExam={removeExam}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="fixed inset-0" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-hover p-6 animate-scale-in">
            <AddExam onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
