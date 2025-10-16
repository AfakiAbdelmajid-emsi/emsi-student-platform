// src/app/complete-profile/page.tsx
'use client';
import ProfileForm from '@/components/profile/ProfileForm';

export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ProfileForm />
    </main>
  );
}