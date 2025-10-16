'use client';
import { useState, useEffect, useCallback } from 'react';
import { getCourseCategories, getCourse, updateCourse, createCourse, getUserCourses, deleteCourse } from '@/lib/api/courses';
import type { CourseOut, CourseUpdate, CourseCreate, CourseCategoryOption } from '@/types/courses';

export function useCourses() {
  const [courses, setCourses] = useState<CourseOut[]>([]);
  const [categories, setCategories] = useState<CourseCategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Load categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
  
        const cached = localStorage.getItem('course_categories');
        if (cached) {
          setCategories(JSON.parse(cached));
          setCategoriesLoading(false);
          return;
        }
  
        const data = await getCourseCategories();
        setCategories(data);
        localStorage.setItem('course_categories', JSON.stringify(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    loadCategories();
  }, []);

  // Memoized fetch function
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem('user_courses');
      if (cached !== null) {
        setCourses(JSON.parse(cached));
      }
  
      const data = await getUserCourses();
      setCourses(data);
      localStorage.setItem('user_courses', JSON.stringify(data));

      // Store course titles in separate localStorage
      const courseTitles = data.filter(course => course.title).map(course => course.title);
      localStorage.setItem('user_course_titles', JSON.stringify(courseTitles));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);
const addCourse = async (courseData: CourseCreate) => {
  setLoading(true);
  try {
    const newCourse = await createCourse(courseData);

    // Check if the course already exists in the current courses before adding it
    const cached = localStorage.getItem('user_courses');
    const currentCourses = cached ? JSON.parse(cached) : [];

    // Avoid adding duplicate course
    if (!currentCourses.some(course => course.id === newCourse.id)) {
      const updatedCourses = [newCourse, ...currentCourses];
      setCourses(updatedCourses);
      localStorage.setItem('user_courses', JSON.stringify(updatedCourses));

      // Store course titles in separate localStorage
      const cachedTitles = localStorage.getItem('user_course_titles');
      const courseTitles = cachedTitles ? JSON.parse(cachedTitles) : [];
      if (newCourse.title && !courseTitles.includes(newCourse.title)) {
        courseTitles.push(newCourse.title); // Only add if the title is valid and not already present
        localStorage.setItem('user_course_titles', JSON.stringify(courseTitles));
      }
    }

    return newCourse;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create course');
    throw err;
  } finally {
    setLoading(false);
  }
};


  const fetchCourseById = async (courseId: string): Promise<CourseOut | null> => {
    try {
      return await getCourse(courseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
      return null;
    }
  };

  const removeCourse = async (courseId: string) => {
    setLoading(true);
    try {
      const courseToRemove = courses.find(course => course.id === courseId);
      if (courseToRemove && courseToRemove.title) {
        // Remove course title from localStorage
        const cachedTitles = localStorage.getItem('user_course_titles');
        if (cachedTitles) {
          const courseTitles = JSON.parse(cachedTitles);
          const updatedTitles = courseTitles.filter(title => title !== courseToRemove.title);
          localStorage.setItem('user_course_titles', JSON.stringify(updatedTitles));
        }
      }
  
      await deleteCourse(courseId);
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);
      localStorage.setItem('user_courses', JSON.stringify(updatedCourses));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const editCourse = async (courseId: string, updates: CourseUpdate) => {
    setLoading(true);
    try {
      const updatedCourse = await updateCourse(courseId, updates);

      // Update course title in localStorage
      const cachedTitles = localStorage.getItem('user_course_titles');
      if (cachedTitles) {
        const courseTitles = JSON.parse(cachedTitles);
        const index = courseTitles.findIndex(title => title === updates.title); // assuming updates includes the title
        if (index !== -1) {
          courseTitles[index] = updates.title; // Update the title
          localStorage.setItem('user_course_titles', JSON.stringify(courseTitles));
        }
      }

      // Update courses in state and localStorage
      const updatedCourses = courses.map(course => 
        course.id === courseId ? updatedCourse : course
      );
      setCourses(updatedCourses);
      localStorage.setItem('user_courses', JSON.stringify(updatedCourses));

      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    categories,
    loading,
    categoriesLoading,
    error,
    fetchCourses,
    addCourse,
    removeCourse,
    editCourse,
  };
}
