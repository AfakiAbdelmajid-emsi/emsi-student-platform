import { useRef, useEffect } from 'react';
import { PencilIcon, ShareIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onShare: () => void;
  onEdit: () => void;
  onOpenNewTab: () => void;
}

export const ContextMenu = ({ x, y, onClose, onDelete, onShare, onEdit, onOpenNewTab }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] animate-scale-in"
      style={{ top: y, left: x }}
      onClick={handleMenuClick}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <PencilIcon className="h-4 w-4" />
        {t('editCourse', 'Edit Course')}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onShare();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <ShareIcon className="h-4 w-4" />
        {t('shareCourse', 'Share Course')}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenNewTab();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        {t('openInNewTab', 'Open in New Tab')}
      </button>
      <div className="h-px bg-gray-100 my-2" />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <TrashIcon className="h-4 w-4" />
        {t('deleteCourse', 'Delete Course')}
      </button>
    </div>
  );
}; 