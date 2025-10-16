// === src/lib/api/courses.ts ===
import client from './client';
import type { CourseOut, CourseCreate,CourseUpdate } from '@/types/courses';
// === Add in src/lib/api/courses.ts ===
import type { CourseCategoryOption } from '@/types/courses'; // You can define this as { value: string, label: string }

export async function getCourseCategories(

): Promise<CourseCategoryOption[]> {
  return await client<CourseCategoryOption[]>('/courses/get_categories');
}

export async function createCourse(courseData: CourseCreate): Promise<CourseOut> {
  return await client<CourseOut>('/courses/create_course', {
    method: 'POST',
    data: courseData,
  });
}

export async function getUserCourses(): Promise<CourseOut[]> {
  return await client<CourseOut[]>('/courses/get_courses');
}


export async function deleteCourse(courseId: string): Promise<void> {
  await client(`/courses/${courseId}`, {
    method: 'DELETE',
  });
}
export async function getCourse(courseId: string): Promise<CourseOut> {
  return await client<CourseOut>(`/courses/get_course/${courseId}`);
}
export async function updateCourse(courseId: string, updates: CourseUpdate): Promise<CourseOut> {
  return await client<CourseOut>(`/courses/edit_course/${courseId}`, {
    method: 'PUT',
    data: updates,
  });
}