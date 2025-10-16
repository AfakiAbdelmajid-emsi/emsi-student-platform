import client from './client';  // Your client for API requests
import type { ExamCreate, ExamOut } from '@/types/exams';  // Define types for ExamCreate and ExamOut
import type { CourseOut } from '@/types/courses';  // Define types for CourseOut

// Interface for response when adding an exam
export interface AddExamResponse {
  message: string;
  exam_data: ExamOut;
}
export async function getExams(): Promise<ExamOut[]> {
  try {
    const data = await client('/planing/get_exams', {
      method: 'GET',
    });

    if (!Array.isArray(data)) {
      throw new Error("Expected an array of exams");
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching exams:', error);
    throw new Error(error.message || 'Failed to fetch exams');
  }
}

export async function addExam(exam: ExamCreate): Promise<ExamOut> {
  try {
    const data = await client('/planing/add_exam', {
      method: 'POST',
      body: JSON.stringify(exam),
    });

    return data;
  } catch (error: any) {
    console.error('Error adding exam:', error);
    throw new Error(error.message || 'Failed to add exam');
  }
}

export async function deleteExam(examId: string): Promise<{ message: string }> {
  try {
    const data = await client(`/planing/delete_exam/${examId}`, {
      method: 'DELETE',
    });

    return data;
  } catch (error: any) {
    console.error('Error deleting exam:', error);
    throw new Error(error.message || 'Failed to delete exam');
  }
}
export async function generateStudyPlan(): Promise<Blob> {
  try {
    const pdfBlob = await client('/planing/generate_plan', {
      method: 'GET',
      responseType: 'blob', // 👈 This tells your client to return a Blob
    });

    return pdfBlob;
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    throw new Error(error.message || 'Failed to generate study plan');
  }
}


// Function to download the generated PDF
export function downloadPDF(pdfBlob: Blob, fileName: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfBlob);
  link.download = fileName;  // Use filename passed as argument
  link.click();
}
