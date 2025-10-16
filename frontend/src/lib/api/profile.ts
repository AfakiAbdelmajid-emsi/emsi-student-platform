import client from './client';
import type { ProfileApiPayload } from '@/types/profile';
import type { AcademicLevel, Specialization } from '@/types/profile';

export interface CompleteProfileResponse {
  status: 'success' | 'error';
  profile: any;
  user_id: string;
  new_access_token?: string;
  new_refresh_token?: string;
  expires_in?: number;
  image_url?: string;
}

export async function completeProfile(data: {
  profileData: ProfileApiPayload;
}): Promise<CompleteProfileResponse> {
  const response = await client('/profiles/complete-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data.profileData)
  });

  setTimeout(() => {
    window.location.reload(); // refresh to update cookies/session
  }, 100);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function getProfile(): Promise<{
  full_name: string;
  academic_level: AcademicLevel;
  specialization?: Specialization;
  is_anonymous: boolean;
  image_url?: string;
}> {
  try {
    const data = await client('/profiles/me');

    return data;
  } catch (error: any) {
    const errorMessage = error.data?.message || error.message || 'Failed to fetch profile';
    throw new Error(errorMessage);
  }
}

export async function updateProfile(data: ProfileApiPayload): Promise<any> {
  const response = await client('/profiles/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function uploadProfileImage(file: File): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client('/profiles/upload-profile-image', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteProfile(): Promise<{ message: string }> {
  const response = await client('/profiles/delete-profile', {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
