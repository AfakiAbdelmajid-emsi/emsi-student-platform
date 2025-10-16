// app/auth/callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { callbackUser } from '@/lib/api/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const error = searchParams.get('error');

      // Handle errors first
      if (error) {
        router.replace(`/register?error=${encodeURIComponent(error)}`);
        return;
      }

      // Validate required params
      if (!token || type !== 'signup') {
        router.replace('/register?error=invalid_verification_link');
        return;
      }

      try {
        const data = await callbackUser(token);
        
        // Redirect based on profile completion
        router.replace(data.profile_complete ? '/' : '/complete-profile');
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/register?error=verification_failed');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying email...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
      </div>
    </div>
  );
}