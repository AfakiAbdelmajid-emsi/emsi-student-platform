// src/app/(auth)/confirm-email/page.tsx
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ConfirmEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const email = params.get('email')

  // Redirect if someone lands here without an email
  useEffect(() => {
    if (!email) {
      router.replace('/register')
    }
  }, [email, router])

  if (!email) return null

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-800">
          Vérifiez votre e-mail
        </h1>

        <p className="text-center text-gray-700 mb-6">
          Nous avons envoyé un lien de confirmation à&nbsp;
          <span className="font-semi bold">{email}</span>.
        </p>

        <p className="text-sm text-center text-gray-500 mb-6">
          Si vous ne l’avez pas reçu, regardez dans vos spams ou réessayez dans quelques minutes.
        </p>

        <button
          onClick={() => router.replace('/register')}
          className="w-full py-2 rounded-2xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Retour à l’inscription
        </button>
      </div>
    </main>
  )
}
