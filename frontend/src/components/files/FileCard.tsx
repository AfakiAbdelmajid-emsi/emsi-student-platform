'use client';
import { useState } from 'react';
import { FileText, Image, FileArchive, FileSpreadsheet, Trash2, Pin, PinOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileCardProps {
  file: any;
  onPreview: (fileId: string, fileName: string) => void;
  onDelete: (fileId: string) => void;
  courseId: string;
}

export const FileCard = ({ file, onPreview, onDelete, courseId }: FileCardProps) => {
  const { t } = useTranslation('common');
  const [isPinned, setIsPinned] = useState(() => {
    const pinnedFiles = JSON.parse(localStorage.getItem(`pinnedFiles_${courseId}`) || '[]');
    return pinnedFiles.includes(file.id);
  });

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pinnedFiles = JSON.parse(localStorage.getItem(`pinnedFiles_${courseId}`) || '[]');
    const newPinned = isPinned
      ? pinnedFiles.filter((id: string) => id !== file.id)
      : [...pinnedFiles, file.id];
    localStorage.setItem(`pinnedFiles_${courseId}`, JSON.stringify(newPinned));
    setIsPinned(!isPinned);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('confirmDeleteFile', 'Are you sure you want to delete this file?'))) {
      onDelete(file.id);
    }
  };

  const getFileIcon = () => {
    if (file.file_type.includes('image')) return <Image className="h-4 w-4 text-blue-500" />;
    if (file.file_type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (file.file_type.includes('word') || file.file_name.match(/\.(doc|docx)$/i)) return <FileText className="h-4 w-4 text-blue-600" />;
    if (file.file_type.includes('powerpoint') || file.file_name.match(/\.(ppt|pptx)$/i)) return <FileSpreadsheet className="h-4 w-4 text-orange-500" />;
    if (file.file_type.includes('zip') || file.file_name.match(/\.(zip|rar|7z)$/i)) return <FileArchive className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onPreview(file.id, file.file_name)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pin Button */}
      <button 
        onClick={handlePinToggle}
        className="absolute top-2 right-2 z-10 p-1 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        title={isPinned ? t('unpinFile', 'Unpin File') : t('pinFile', 'Pin File')}
      >
        {isPinned ? (
          <Pin className="h-4 w-4 text-primary-400" />
        ) : (
          <PinOff className="h-4 w-4 text-gray-400 hover:text-primary-400" />
        )}
      </button>

      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              {getFileIcon()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {file.file_name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {t('fileSize', '{{size}} KB', { size: (file.size / 1024).toFixed(1) })}
              </span>
              <span className="text-xs text-gray-500">
                {t('fileDate', '{{date}}', { date: new Date(file.created_at).toLocaleDateString() })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute bottom-2 right-2 p-1 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-red-50 transition-colors"
        title={t('deleteFile', 'Delete File')}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}; 