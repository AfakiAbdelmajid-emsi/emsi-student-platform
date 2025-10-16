'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser,requestEmailChange,changePassword } from '@/lib/api/auth';
import type { UserData } from '@/types/auth';
import { logout as logoutApi } from '@/lib/api/auth';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error('Failed to decode token', err);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const decodeAndSetUser = (token: string) => {
    const payload = decodeToken(token);
    if (!payload) return;

    const profileComplete =
      payload.profile_complete === true ||
      payload?.user_metadata?.profile_complete === true;

    setUser({
      id: payload.sub,
      email: payload.email,
      profile_complete: profileComplete,
    });
  };
  const updateEmail = useCallback(async (newEmail: string, currentPassword: string) => {
    setError(null);
    try {
      const result = await requestEmailChange(newEmail, currentPassword);
      return result.message;
    } catch (err: any) {
      const msg = err.message || "Impossible de changer l'email.";
      setError(msg);
      throw new Error(msg);
    }
  }, []);
  

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setError(null);
    try {
      const result = await changePassword(currentPassword, newPassword);
      return result.message;
    } catch (err: any) {
      const msg = err.message || "Impossible de changer le mot de passe.";
      setError(msg);
      throw new Error(msg);
    }
  }, []);
  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const authData = await registerUser(email, password);
      decodeAndSetUser(authData.access_token);
      router.push('/confirm-email');
      return authData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail?.includes('already in use')
        ? 'Cet email est déjà utilisé. Veuillez utiliser un autre email.'
        : 'Erreur lors de l\'inscription.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const authData = await loginUser(email, password);
      window.location.href = '/courses';
      decodeAndSetUser(authData.access_token);
      return authData;
    } catch (err: any) {
      const errorMessage = err.message.includes('Invalid') || err.message.includes('incorrect')
        ? 'Email ou mot de passe incorrect.'
        : 'Erreur lors de la connexion.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);
const logout = useCallback(async () => {
  try {
    await logoutApi(); // ✅ now it calls the imported function
  } catch (err) {
    console.error("Logout API error", err);
  } finally {
    setUser(null);
    router.push('/login');
  }
}, [router]);


  useEffect(() => {
    const verifyAuth = () => {
      const token = getCookie('access_token'); // use server-set cookie only
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = decodeToken(token);
      if (!payload) {
        setLoading(false);
        return;
      }

      const profileComplete =
        payload.profile_complete === true ||
        payload?.user_metadata?.profile_complete === true;

      setUser({
        id: payload.sub,
        email: payload.email,
        profile_complete: profileComplete,
      });

      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (profileComplete && path === '/complete-profile') {
          router.push('/');
        } else if (!profileComplete &&
          !['/complete-profile', '/login', '/register'].includes(path)) {
          router.push('/complete-profile');
        }
      }

      setLoading(false);
    };

    verifyAuth();
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    updateEmail,     // ← new
    updatePassword,  
    register,
    logout,
    isAuthenticated: !!user,
  };
}
