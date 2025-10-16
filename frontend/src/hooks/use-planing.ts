import { useState, useEffect, useCallback } from 'react';
import { addExam, getExams, deleteExam, generateStudyPlan, downloadPDF } from '@/lib/api/planing';  // Import the new functions
import type { ExamCreate, ExamOut } from '@/types/exams';

interface PlanningState {
  courses: string[]; // Use course titles directly
  exams: ExamOut[] | null; // Make exams optional since we'll fetch them separately
}

export function usePlanning() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planning, setPlanning] = useState<PlanningState>({
    courses: [], // Initialize courses as an empty array
    exams: null // Initialize exams as null
  });

  // Load course titles directly from localStorage on mount
  useEffect(() => {
    const storedCourses = localStorage.getItem('user_course_titles'); // Retrieve course titles from localStorage
    if (storedCourses) {
      const courses = JSON.parse(storedCourses); // Parse the stored course titles
      setPlanning(prev => ({ ...prev, courses }));
    }
  }, []); // Only run once on mount

  // Memoize fetchExams to prevent unnecessary re-creations
  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const exams = await getExams();
      if (!Array.isArray(exams)) {
        throw new Error("Exams data is not an array");
      }
      setPlanning(prev => ({ ...prev, exams }));
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      setError(error instanceof Error ? error.message : 'Failed to load exams');
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependency array is empty to run only once

  const submitExam = async (examData: ExamCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newExam = await addExam(examData);
      setPlanning(prev => ({
        ...prev,
        exams: prev.exams ? [...prev.exams, newExam] : [newExam]
      }));
      return newExam;
    } catch (error) {
      console.error("Failed to add exam:", error);
      setError(error instanceof Error ? error.message : 'Failed to add exam');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitMultipleExams = async (examsData: ExamCreate[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(examsData.map(exam => submitExam(exam)));
      return results;
    } catch (error) {
      console.error("Failed to add exams:", error);
      setError(error instanceof Error ? error.message : 'Failed to add exams');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeExam = async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteExam(examId);
      setPlanning(prev => ({
        ...prev,
        exams: prev.exams?.filter(exam => exam.id !== examId) || null
      }));
    } catch (error) {
      console.error("Failed to delete exam:", error);
      setError(error instanceof Error ? error.message : 'Failed to delete exam');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // New function to generate and download the study plan PDF
  const generateAndDownloadPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Generate the study plan
      const pdfBlob = await generateStudyPlan();
      // Download the generated PDF
      downloadPDF(pdfBlob, 'weekly_study_plan.pdf');
    } catch (error) {
      console.error('Failed to generate or download study plan:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate or download study plan');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    planning,
    fetchExams, // return memoized fetchExams
    submitExam,
    submitMultipleExams,
    removeExam,
    generateAndDownloadPlan // Expose the new function to trigger plan generation
  };
}
