// src/components/ui/FormCheckbox.tsx
'use client';

import { InputHTMLAttributes } from 'react';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  containerClass?: string;
}

export default function FormCheckbox({
  label,
  description,
  error,
  containerClass = '',
  className = '',
  ...props
}: FormCheckboxProps) {
  return (
    <div className={`space-y-1 ${containerClass}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
            error ? 'border-red-300' : ''
          } ${className}`}
          {...props}
        />
        <label
          htmlFor={props.id}
          className="ml-2 block text-sm text-gray-700 font-medium"
        >
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-gray-500 ml-6">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 ml-6" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}