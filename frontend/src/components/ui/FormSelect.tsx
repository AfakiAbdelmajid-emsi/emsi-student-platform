// src/components/ui/FormSelect.tsx
'use client';

import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  containerClass?: string;
  showLabel?: boolean;
}

export default function FormSelect({
  label,
  options,
  error,
  containerClass = '',
  className = '',
  showLabel = true,
  ...props
}: FormSelectProps) {
  // Development-only: warn if duplicate values
  if (process.env.NODE_ENV !== 'production') {
    const seen = new Set();
    for (const opt of options) {
      if (seen.has(opt.value)) {
        // eslint-disable-next-line no-console
        console.warn(`Duplicate option value detected in FormSelect:`, opt.value, options);
        break;
      }
      seen.add(opt.value);
    }
  }
  return (
    <div className={`space-y-2 ${containerClass}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full rounded-lg border border-gray-300 px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            appearance-none bg-white
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={option.value}
              disabled={option.disabled}
              className="py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p 
          className="text-sm text-red-600 mt-1 animate-fade-in" 
          id={`${props.id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}