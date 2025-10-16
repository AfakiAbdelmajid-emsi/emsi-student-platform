// src/components/auth/UserEmail.tsx
'use client'
import { useAuth } from '@/hooks/use-auth'

export default function UserEmail() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="text-sm text-gray-600 px-4 py-2">
      Welcome, {user.email}
    </div>
  )
}
