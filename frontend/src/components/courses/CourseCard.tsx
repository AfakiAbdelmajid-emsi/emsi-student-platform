import { useState } from 'react';
import { FolderIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ContextMenu } from './ContextMenu';
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
  course: any;
  onClick: () => void;
  isPinned?: boolean;
  onPinToggle?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
}

export const CourseCard = ({ 
  course, 
  onClick, 
  isPinned, 
  onPinToggle, 
  onDelete, 
  onShare, 
  onEdit 
}: CourseCardProps) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { t } = useTranslation('common');

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleOpenNewTab = () => {
    window.open(`/courses/${course.id}`, '_blank');
    setContextMenu(null);
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in border border-gray-100"
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pin Button */}
      {onPinToggle && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPinToggle();
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          {isPinned ? (
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
          )}
        </button>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <FolderIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-display font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {course.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {course.category || t('uncategorized', 'Uncategorized')}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(course.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={() => {
            onDelete?.();
            setContextMenu(null);
          }}
          onShare={() => {
            onShare?.();
            setContextMenu(null);
          }}
          onEdit={() => {
            onEdit?.();
            setContextMenu(null);
          }}
          onOpenNewTab={handleOpenNewTab}
        />
      )}
    </div>
  );
}; 