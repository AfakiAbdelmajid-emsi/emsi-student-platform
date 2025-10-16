'use client';
import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
  helpText?: string;
  containerClass?: string;
  textarea?: boolean;
  showLabel?: boolean;
  icon?: ReactNode;
}

export default function FormInput({
  label,
  error,
  helpText,
  containerClass = '',
  className = '',
  textarea = false,
  showLabel = true,
  icon,
  type,
  ...props
}: FormInputProps) {
  const InputComponent = textarea ? 'textarea' : 'input';
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={`space-y-2 ${containerClass}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <InputComponent
          type={inputType}
          className={`w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg shadow-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
            }
            ${textarea ? 'min-h-[120px] resize-y' : ''}
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
            placeholder:text-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {helpText && !error && (
        <p className="text-sm text-gray-500 mt-1 animate-fade-in">{helpText}</p>
      )}
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