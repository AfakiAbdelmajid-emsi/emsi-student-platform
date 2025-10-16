'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCourseCategories, 
  getCourse, 
  updateCourse, 
  createCourse, 
  getUserCourses, 
  deleteCourse 
} from '@/lib/api/courses';
import type { CourseOut, CourseUpdate, CourseCreate, CourseCategoryOption } from '@/types/courses';

// Query keys for consistent caching
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: string) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  categories: ['courseCategories'] as const,
};

export function useCourses() {
  const queryClient = useQueryClient();

  // Fetch courses with caching
  const {
    data: courses = [],
    isLoading: loading,
    error,
    refetch: fetchCourses,
  } = useQuery({
    queryKey: courseKeys.lists(),
    queryFn: async () => {
      const data = await getUserCourses();
      // Store in localStorage for offline access
      localStorage.setItem('user_courses', JSON.stringify(data));
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch categories with caching
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: courseKeys.categories,
    queryFn: async () => {
      const cached = localStorage.getItem('course_categories');
      if (cached) {
        return JSON.parse(cached);
      }
      const data = await getCourseCategories();
      localStorage.setItem('course_categories', JSON.stringify(data));
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Add course mutation
  const addCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (newCourse) => {
      // Update the courses list
      queryClient.setQueryData(courseKeys.lists(), (old: CourseOut[] = []) => {
        const updated = [newCourse, ...old];
        localStorage.setItem('user_courses', JSON.stringify(updated));
        return updated;
      });

      // Update course titles
      const cachedTitles = localStorage.getItem('user_course_titles');
      const courseTitles = cachedTitles ? JSON.parse(cachedTitles) : [];
      if (newCourse.title && !courseTitles.includes(newCourse.title)) {
        courseTitles.push(newCourse.title);
        localStorage.setItem('user_course_titles', JSON.stringify(courseTitles));
      }
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (_, courseId) => {
      // Update the courses list
      queryClient.setQueryData(courseKeys.lists(), (old: CourseOut[] = []) => {
        const courseToRemove = old.find(course => course.id === courseId);
        const updated = old.filter(course => course.id !== courseId);
        localStorage.setItem('user_courses', JSON.stringify(updated));

        // Remove course title from localStorage
        if (courseToRemove?.title) {
          const cachedTitles = localStorage.getItem('user_course_titles');
          if (cachedTitles) {
            const courseTitles = JSON.parse(cachedTitles);
            const updatedTitles = courseTitles.filter((title: string) => title !== courseToRemove.title);
            localStorage.setItem('user_course_titles', JSON.stringify(updatedTitles));
          }
        }
        return updated;
      });
    },
  });

  // Edit course mutation
  const editCourseMutation = useMutation({
    mutationFn: ({ courseId, updates }: { courseId: string; updates: CourseUpdate }) =>
      updateCourse(courseId, updates),
    onSuccess: (updatedCourse, { courseId }) => {
      // Update the courses list
      queryClient.setQueryData(courseKeys.lists(), (old: CourseOut[] = []) => {
        const updated = old.map(course => 
          course.id === courseId ? updatedCourse : course
        );
        localStorage.setItem('user_courses', JSON.stringify(updated));
        return updated;
      });

      // Update course titles if title changed
      if (updatedCourse.title) {
        const cachedTitles = localStorage.getItem('user_course_titles');
        if (cachedTitles) {
          const courseTitles = JSON.parse(cachedTitles);
          const index = courseTitles.findIndex((title: string) => title === updatedCourse.title);
          if (index !== -1) {
            courseTitles[index] = updatedCourse.title;
            localStorage.setItem('user_course_titles', JSON.stringify(courseTitles));
          }
        }
      }
    },
  });

  // Helper function to get course by ID
  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId) || null;
  };

  return {
    courses,
    categories,
    loading,
    categoriesLoading,
    error: error?.message || null,
    fetchCourses,
    addCourse: addCourseMutation.mutateAsync,
    removeCourse: deleteCourseMutation.mutateAsync,
    editCourse: (courseId: string, updates: CourseUpdate) => 
      editCourseMutation.mutateAsync({ courseId, updates }),
    getCourseById,
    isAddingCourse: addCourseMutation.isPending,
    isDeletingCourse: deleteCourseMutation.isPending,
    isEditingCourse: editCourseMutation.isPending,
  };
}

// Hook for fetching a single course
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
} 