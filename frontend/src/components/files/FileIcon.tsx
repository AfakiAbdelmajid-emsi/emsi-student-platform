'use client';
import { FileIcon, defaultStyles } from 'react-file-icon';

interface FileIconProps {
  fileName: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomFileIcon({ fileName, size = 'md' }: FileIconProps) {
  if (!fileName) return null;
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const sizeClasses = {
    sm: 'w-6 h-8',
    md: 'w-8 h-10',
    lg: 'w-10 h-12'
  };

  return (
    <div className={sizeClasses[size]}>
      <FileIcon
        extension={extension}
        {...(defaultStyles[extension as keyof typeof defaultStyles] || {})}
      />
    </div>
  );
}