'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserCourses } from '@/lib/api/courses';
import { getExams } from '@/lib/api/planing';
import { getTasks } from '@/lib/api/task';
import { getUserNotes } from '@/lib/api/notes';
import { getOpenAnnouncements } from '@/lib/api/help';

import type { CourseOut } from '@/types/courses';
import type { ExamOut } from '@/types/exams';
import type { Task } from '@/types/task';
import type { FileOut } from '@/types/files';
import type { HelpAnnouncement } from '@/types/help';

interface Note {
  id: string;
  title: string;
  content: string;
  status?: string;
  created_at: string;
}

interface DashboardStats {
  totalCourses: number;
  totalFiles: number;
  totalNotes: number;
  upcomingExam: ExamOut | null;
  tasksDueToday: Task[];
  overdueTasks: Task[];
}

interface DashboardData {
  courses: CourseOut[];
  exams: ExamOut[];
  tasks: Task[];
  notes: Note[];
  announcements: HelpAnnouncement[];
}

// Query keys for consistent caching
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
  courses: () => [...dashboardKeys.all, 'courses'] as const,
  exams: () => [...dashboardKeys.all, 'exams'] as const,
  tasks: () => [...dashboardKeys.all, 'tasks'] as const,
  notes: () => [...dashboardKeys.all, 'notes'] as const,
  announcements: () => [...dashboardKeys.all, 'announcements'] as const,
};

export function useDashboardData() {
  const today = new Date().toISOString().split('T')[0];

  // Fetch courses
  const {
    data: courses = [],
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: dashboardKeys.courses(),
    queryFn: getUserCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch exams
  const {
    data: exams = [],
    isLoading: examsLoading,
  } = useQuery({
    queryKey: dashboardKeys.exams(),
    queryFn: getExams,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading: tasksLoading,
  } = useQuery({
    queryKey: dashboardKeys.tasks(),
    queryFn: getTasks,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch notes
  const {
    data: notes = [],
    isLoading: notesLoading,
  } = useQuery({
    queryKey: dashboardKeys.notes(),
    queryFn: getUserNotes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch announcements
  const {
    data: announcements = [],
    isLoading: announcementsLoading,
  } = useQuery({
    queryKey: dashboardKeys.announcements(),
    queryFn: getOpenAnnouncements,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const loading = coursesLoading || examsLoading || tasksLoading || notesLoading || announcementsLoading;

  const tasksDueToday = tasks.filter(t => t.due_date === today && !t.completed);
  const overdueTasks = tasks.filter(t => t.due_date && t.due_date < today && !t.completed);
  const nextExam = exams.sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0] || null;

  // Calculate total files from localStorage cache (if available)
  const getTotalFiles = () => {
    try {
      const cachedFiles = localStorage.getItem('course_files_cache');
      if (cachedFiles) {
        const filesMap = JSON.parse(cachedFiles);
        return Object.values(filesMap).reduce((acc: number, files: any) => acc + files.length, 0);
      }
    } catch (error) {
      console.error('Error calculating total files:', error);
    }
    return 0; // Fallback to 0 if cache not available
  };

  const stats: DashboardStats = {
    totalCourses: courses.length,
    totalFiles: getTotalFiles(),
    totalNotes: notes.length,
    upcomingExam: nextExam,
    tasksDueToday,
    overdueTasks,
  };

  const data: DashboardData = {
    courses,
    exams,
    tasks,
    notes,
    announcements,
  };

  return {
    loading,
    stats,
    data,
  };
} 