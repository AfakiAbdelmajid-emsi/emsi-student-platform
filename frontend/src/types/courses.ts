export interface CourseOut {
  id: string;
  title: string;
  description: string;
  category?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  academic_level?: string;
  specialization?: string;
}

export interface CourseCreate {
  title: string;
  description?: string;
  category?: string;

}

export interface CourseCategoryOption {
  value: string;
  label: string;
}

// For the profile data you'll need to fetch
export interface AcademicLevel {
  level: 'CP1' | 'CP2' | 'GI1' | 'GI2' | 'GI3';
  specialization?: 'IIR' | 'GESI' | 'GI' | 'GC' | 'GF';
}
export interface CourseUpdate {
  title?: string;
  description?: string;
  category?: string;
}
