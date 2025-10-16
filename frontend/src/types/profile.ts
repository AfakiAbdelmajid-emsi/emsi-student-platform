// src/types/profile.ts
export type AcademicLevel = 'CP1' | 'CP2' | 'GI1' | 'GI2' | 'GI3';

export type Specialization = 
  | 'Ingénierie Informatique et Réseaux'
  | 'Génie Electrique et Systèmes Intelligents'
  | 'Génie Civil, Bâtiments et Travaux Publics (BTP)'
  | 'Génie Industriel'
  | 'Génie Financier';

export interface ProfileFormProps {
  userId: string;
  token: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  language: string;
  theme: string;
  notifications: NotificationPreferences;
  full_name: string;
  academic_level: AcademicLevel;
  specialization: Specialization | '';
  is_anonymous: boolean;
  image_url?: string; // ✅ Optional field
}

export interface ProfileApiPayload extends Omit<ProfileFormData, 'specialization'> {
  specialization: Specialization | undefined;
}
// src/types/profile.ts
export interface Profile {
  full_name: string;
  academic_level: AcademicLevel;
  specialization?: Specialization;
  is_anonymous: boolean;
  email?: string;
  image_url?: string;
}

export interface ProfileApiResponse {
  full_name: string;
  academic_level: AcademicLevel;
  specialization?: Specialization;
  is_anonymous: boolean;
  profile_complete: boolean;
  email?: string;
}

export interface CompleteProfileResponse {
  status: 'success' | 'error';
  profile: {
    id: string;
    full_name: string;
    academic_level: AcademicLevel;
    specialization: Specialization | null;
    is_anonymous: boolean;
    email?: string;
  };
  user_id: string;
  new_access_token?: string;  // Changed from new_token to be more specific
  new_refresh_token?: string; // Added new field for refresh token
  expires_in?: number;
  image_url?: string; // ✅ Optional field
        // Added expiration time
}

// Additional types for auth flow
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  academic_level: AcademicLevel;
  specialization: Specialization | null;
  is_anonymous: boolean;
  profile_complete: boolean;
    image_url?: string; // ✅ Optional field

}

export interface ProfileInfoProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface SecuritySettingsProps {
  onRequestPasswordReset: () => void;
  onRequestEmailChange: () => void;
}

export interface PreferencesProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}