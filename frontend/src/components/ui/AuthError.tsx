// src/components/auth/AuthError.tsx
'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface AuthErrorProps {
  message: string;
  redirectPath?: string;  // Made optional
  buttonText?: string;
  className?: string;
}

export default function AuthError({
  message,
  redirectPath,
  buttonText = 'Retry',
  className = '',
}: AuthErrorProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-center h-screen ${className}`}>
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-500 mb-4">
          <p className="font-medium">{message}</p>
        </div>
        {redirectPath && (  // Only show button if redirectPath exists
          <Button
            onClick={() => router.push(redirectPath)}
            variant="outline"
            className="text-blue-600 hover:underline"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}