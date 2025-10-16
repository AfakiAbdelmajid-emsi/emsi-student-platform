// === src/components/ui/FileInput.tsx ===
'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  containerClass?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, error, helpText, containerClass = '', className = '', ...props }, ref) => {
    return (
      <div className={`space-y-1 ${containerClass}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
        
        <div className="relative">
          <input
            type="file"
            ref={ref}
            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${className}`}
            {...props}
          />
          <div className="px-4 py-3 border border-gray-300 rounded-md bg-white flex items-center justify-between">
            <span className="text-sm text-gray-500 truncate">
              {props.value ? String(props.value) : 'Choose a file...'}
            </span>
            <span className="text-gray-400">📁</span>
          </div>
        </div>

        {helpText && !error && (
          <p className="text-xs text-gray-500 mt-1">{helpText}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1" id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;