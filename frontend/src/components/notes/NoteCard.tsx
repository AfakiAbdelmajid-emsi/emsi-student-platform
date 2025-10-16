'use client';
import { NoteOut } from '@/types/notes';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface NoteCardProps {
  note: NoteOut;
  onClick?: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const router = useRouter();
  const [courseName, setCourseName] = useState<string | null>(null);

  useEffect(() => {
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

    setCourseName(getCourseName());
  }, [note.course_id]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/notes/${note.id}`);
    }
  };

  return (
    <div 
      className="group border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500"
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {note.title}
            </h3>
            
            {courseName && (
              <span className="inline-block bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs px-2.5 py-1 rounded-full font-medium">
                {courseName}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(note.updated_at), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
    </div>
  );
}