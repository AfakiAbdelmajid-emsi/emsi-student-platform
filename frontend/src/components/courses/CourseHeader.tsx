import { ArrowLeft, Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { CourseOut } from '@/types/courses';

interface CourseHeaderProps {
  course: CourseOut;
  isPinned: boolean;
  onPinToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function CourseHeader({
  course,
  isPinned,
  onPinToggle,
  onEdit,
  onDelete,
  onBack,
}: CourseHeaderProps) {
  return (
    <div className="bg-white rounded-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-500">{course.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onPinToggle}
              className={isPinned ? 'text-yellow-500' : 'text-gray-400'}
            >
              {isPinned ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={onEdit}
              className="text-gray-600 hover:text-gray-900"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 