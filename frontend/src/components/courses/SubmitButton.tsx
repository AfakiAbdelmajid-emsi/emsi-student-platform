'use client';
import { forwardRef } from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, isLoading = false, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        disabled={isLoading}
        className={`relative inline-flex items-center justify-center ${
          isLoading ? 'cursor-not-allowed opacity-80' : ''
        } ${className}`}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      </button>
    );
  }
); 