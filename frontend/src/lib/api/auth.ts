// src/lib/api/auth.ts
import client from './client';
import type { AuthResponse } from '@/types/auth';
// src/lib/api/auth.ts - Update callbackUser

export async function requestEmailChange(new_email: string, current_password: string): Promise<{ message: string }> {
  try {
    const data = await client<{ message: string }>('/auth/request-email-change', {
      method: 'POST',
      credentials: 'include',
      data: {
        new_email,
        current_password
      }
    });

    return data;
  } catch (error: any) {
    console.error('Email change error:', error);
    throw new Error(
      error.message || "Échec du changement d'adresse e-mail"
    );
  }
}

// ✅ Change password securely with current password verification
export async function changePassword(current_password: string, new_password: string): Promise<{ message: string }> {
  try {
    const data = await client<{ message: string }>('/auth/change-password', {
      method: 'POST',
      credentials: 'include',
      data: {
        current_password,
        new_password
      }
    });

    return data;
  } catch (error: any) {
    console.error('Password change error:', error);
    throw new Error(
      error.message || 'Échec du changement de mot de passe'
    );
  }
}



export async function callbackUser(token: string): Promise<AuthResponse> {
  try {
    const data = await client<AuthResponse>(`/auth/callback?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!data.access_token) {
      throw new Error('Authentication failed - no access token received');
    }

    return {
      access_token: data.access_token,
      user_id: data.user_id,
      email: data.email,
      profile_complete: data.profile_complete || false,
    };
  } catch (error: any) {
    console.error('Callback error:', error);
    throw new Error(
      error.message || 'Email verification failed. The link may have expired.'
    );
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const data = await client<AuthResponse>('/auth/login', {
      method: 'POST',
      credentials: 'include',
      data: { email, password }, // ✅ use `data`, not `body`
    });

    console.log("API login response:", data);

    return {
      access_token: '',
      user_id: data.user_id,
      email: data.email,
      profile_complete: data.profile_complete || false,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(
      error.message || 'Une erreur est survenue lors de la connexion'
    );
  }
}


export async function registerUser(
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    const data = await client<AuthResponse>('/auth/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return {
      access_token: data.access_token,
      user_id: data.user_id,
      email: data.email,
      profile_complete: data.profile_complete || false
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(
      error.message.includes('already in use')
        ? 'Cet email est déjà utilisé'
        : "Échec de l'inscription"
    );
  }
}


export async function refreshToken(): Promise<AuthResponse> {
  try {
    const response = await client('/auth/refresh', {
      method: 'POST',
      credentials: 'include'  // Automatically sends cookies
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      user_id: '',  // Will be populated from token
      email: '',    // Will be populated from token
      profile_complete: false
    };
  } catch (error: any) {
    console.error('Token refresh error:', error);
    throw new Error(
      error.message || 'Session expired. Please login again.'
    );
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await client('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(
      error.message || 'Failed to logout properly'
    );
  }
}
