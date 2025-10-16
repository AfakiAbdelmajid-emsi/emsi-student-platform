// src/app/auth/register/page.tsx
'use client';
import AuthForm from '@/components/auth/AuthForm';
export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <AuthForm type="register" />
    </main>
  );
}