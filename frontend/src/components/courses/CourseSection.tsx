import { ReactNode } from 'react';
import { CourseCard } from './CourseCard';
import { useTranslation } from 'react-i18next';

interface CourseSectionProps {
  title: string;
  icon: ReactNode;
  courses: any[];
  viewMode: 'grid' | 'list';
  onCourseClick: (courseId: string) => void;
  onPinToggle: (courseId: string) => void;
  onDelete: (courseId: string) => void;
  onShare: (courseId: string) => void;
  onEdit: (courseId: string) => void;
  pinnedCourses: string[];
}

export const CourseSection = ({
  title,
  icon,
  courses,
  viewMode,
  onCourseClick,
  onPinToggle,
  onDelete,
  onShare,
  onEdit,
  pinnedCourses,
}: CourseSectionProps) => {
  const { t } = useTranslation('common');
  if (courses.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-2xl font-display font-bold text-gray-900">{t(title, title)}</h2>
      </div>
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {courses.map((course) => (
          <CourseCard
            key={`${title}-${course.id}`}
            course={course}
            onClick={() => onCourseClick(course.id)}
            isPinned={pinnedCourses.includes(course.id)}
            onPinToggle={() => onPinToggle(course.id)}
            onDelete={() => onDelete(course.id)}
            onShare={() => onShare(course.id)}
            onEdit={() => onEdit(course.id)}
          />
        ))}
      </div>
    </div>
  );
}; 