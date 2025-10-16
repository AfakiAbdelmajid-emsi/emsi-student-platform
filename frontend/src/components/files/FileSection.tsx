'use client';
import { useState } from 'react';
import CustomFileIcon from './FileIcon';
import type { FileOut } from '@/types/files';
import { Trash2 } from 'lucide-react';
import { FileCard } from './FileCard';

interface FileSectionProps {
  title: string;
  icon: string;
  files: FileOut[];
  onPreview: (fileId: string, fileName: string) => void;
  onDelete: (fileId: string) => void;
  courseId: string;
}

export const FileSection = ({ title, icon, files, onPreview, onDelete, courseId }: FileSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({files.length})</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onPreview={onPreview}
                onDelete={onDelete}
                courseId={courseId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};