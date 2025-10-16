// src/components/auth/AuthError.tsx
'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface AuthErrorProps {
  message: string;
  redirectPath: string;
  buttonText?: string;
}

export default function AuthError({
  message,
  redirectPath,
  buttonText = 'Return to Register',
}: AuthErrorProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="text-red-500 mb-4">
          <p className="font-medium">{message}</p>
        </div>
        <Button
          onClick={() => router.push(redirectPath)}
          variant="outline"
          className="mt-4 text-blue-600 hover:underline"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}