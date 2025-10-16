'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { completeProfile, getProfile, uploadProfileImage, updateProfile, deleteProfile } from '@/lib/api/profile';
import type { ProfileFormData, AcademicLevel, Specialization } from '@/types/profile';

interface Profile {
  full_name: string;
  academic_level: AcademicLevel;
  specialization?: Specialization;
  is_anonymous: boolean;
  emsil?: string; // Optional email field
  image_url?: string;
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  // Load the user's profile data when the component mounts
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProfile();
        console.log('Profile data loaded:', data);

        const validLevels: AcademicLevel[] = ['CP1', 'CP2', 'GI1', 'GI2', 'GI3'];
        const academicLevel = validLevels.includes(data.academic_level)
          ? data.academic_level
          : 'CP1';

        setProfile({
          full_name: data.full_name,
          academic_level: academicLevel,
          specialization: data.specialization,
          is_anonymous: data.is_anonymous,
          email: data.email, // Assuming email is part of the profile data
          image_url: data.image_url,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to load profile');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Submit the profile data
  const submitProfile = async (formData: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await completeProfile({
        profileData: {
          full_name: formData.full_name,
          academic_level: formData.academic_level,
          specialization: formData.specialization || undefined,
          email: formData.email || undefined, // Include email if provided
          is_anonymous: formData.is_anonymous,
          image_url: formData.image_url, // ✅ include image URL if present
        }
      });

      if (response.new_access_token && response.new_refresh_token) {
        const cookieOptions = {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
        };

        document.cookie = `access_token=${response.new_access_token}; max-age=${response.expires_in}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`;
        document.cookie = `refresh_token=${response.new_refresh_token}; max-age=604800; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`;

        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.assign('/complete-profile');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload profile image
  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadProfileImage(file);

      // If successful, update profile with the new image URL
      if (response.image_url) {
        setProfile(prevProfile => ({
          ...prevProfile,
          image_url: response.image_url,
        }));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile details
  const handleProfileUpdate = async (formData: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateProfile(formData);

      // Update the profile state with the new information
      if (response.profile) {
        setProfile(response.profile);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete profile
  const handleProfileDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteProfile();

      // If the deletion was successful, navigate to the home page
      if (response.message === 'Profile deleted successfully') {
        router.push('/');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    profile,
    submitProfile,
    handleImageUpload,
    handleProfileUpdate,
    handleProfileDelete,
  };
}
