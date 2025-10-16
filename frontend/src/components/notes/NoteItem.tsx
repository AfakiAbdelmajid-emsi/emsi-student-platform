'use client';
import type { NoteOut } from '@/types/notes';

interface NoteItemProps {
  note: NoteOut;
  onClick: () => void;
}

export default function NoteItem({ note, onClick }: NoteItemProps) {
  const getCourseName = () => {
    try {
      if (!note.course_id) return null;
      
      const coursesJson = localStorage.getItem('user_courses');
      if (!coursesJson) return null;
      
      const courses = JSON.parse(coursesJson);
      const course = courses.find((c: any) => c.id === note.course_id);
      return course?.title || null;
    } catch (error) {
      console.error('Error getting course name:', error);
      return null;
    }
  };

  const courseName = getCourseName();

  return (
    <div 
      className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/50"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-medium text-gray-900 dark:text-white text-lg group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
          {note.title}
        </h3>
        {courseName && (
          <span className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-medium">
            {courseName}
          </span>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Last updated: {new Date(note.updated_at).toLocaleString()}
      </p>
    </div>
  );
}