// src/components/auth/AuthForm.tsx
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import FormInput from '@/components/ui/FormInput'
import SubmitButton from '@/components/ui/SubmitButton'
import AuthError from '@/components/ui/AuthError'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'

interface AuthFormProps {
  type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const {
    register,
    login,
    loading: authLoading,
    error: authError,
  } = useAuth()

  const isLogin = type === 'login'
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLogin && password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`)
      }
    } catch {
      // Error is handled in the hook
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
    >
      <div className="flex flex-col items-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <img src="/emsi.svg" alt="EMSI Logo" className="w-64 h-auto" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-gray-800"
        >
          {isLogin ? 'Bienvenue !' : 'Créer un compte'}
        </motion.h2>
        <p className="text-gray-500 mt-2 text-center">
          {isLogin ? 'Connectez-vous pour continuer' : 'Rejoignez notre communauté'}
        </p>
      </div>

      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">{authError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-5 w-5 text-gray-400" />}
          />

          <FormInput
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            helpText={!isLogin ? "Le mot de passe doit contenir au moins 6 caractères" : undefined}
          />

          {!isLogin && (
            <FormInput
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
          )}
        </div>

        <div className="space-y-4">
          <SubmitButton
            isLoading={authLoading}
            loadingText={isLogin ? 'Connexion...' : 'Inscription...'}
            defaultText={isLogin ? 'Se connecter' : "S'inscrire"}
            className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={async () => {
              try {
                const res = await fetch('http://localhost:8000/auth/google');
                const { auth_url } = await res.json();
                window.location.href = auth_url;
              } catch (error) {
                router.push('/register?error=oauth_failed');
              }
            }}
            className="w-full h-12 flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700">Continuer avec Google</span>
          </Button>
        </div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-center mt-6 text-gray-500"
      >
        {isLogin ? (
          <>
            Pas encore inscrit ?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Créer un compte
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Se connecter
            </Link>
          </>
        )}
      </motion.p>
    </motion.div>
  )
}
