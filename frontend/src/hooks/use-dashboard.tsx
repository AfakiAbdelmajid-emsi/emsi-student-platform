import { useEffect, useState } from 'react';
import { getUserCourses } from '@/lib/api/courses';
import { getExams } from '@/lib/api/planing';
import { getTasks } from '@/lib/api/task';
import { getUserNotes } from '@/lib/api/notes';
import { getCourseFiles } from '@/lib/api/files';
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

export function useDashboardData() {
  const [courses, setCourses] = useState<CourseOut[]>([]);
  const [exams, setExams] = useState<ExamOut[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [courseFiles, setCourseFiles] = useState<Record<string, FileOut[]>>({});
  const [announcements, setAnnouncements] = useState<HelpAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, examsData, tasksData, notesData, openAnnouncements] = await Promise.all([
          getUserCourses(),
          getExams(),
          getTasks(),
          getUserNotes(),
          getOpenAnnouncements(),
        ]);

        setCourses(coursesData);
        setExams(examsData);
        setTasks(tasksData);
        setNotes(notesData);
        setAnnouncements(openAnnouncements);

        const filesResults = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const files = await getCourseFiles(course.id);
              return { courseId: course.id, files };
            } catch {
              return { courseId: course.id, files: [] };
            }
          })
        );

        const filesMap = filesResults.reduce((acc, { courseId, files }) => {
          acc[courseId] = files;
          return acc;
        }, {} as Record<string, FileOut[]>);

        setCourseFiles(filesMap);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const tasksDueToday = tasks.filter(t => t.due_date === today && !t.completed);
  const overdueTasks = tasks.filter(t => t.due_date && t.due_date < today && !t.completed);
  const nextExam = exams.sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0] || null;

  const stats: DashboardStats = {
    totalCourses: courses.length,
    totalFiles: Object.values(courseFiles).reduce((acc, files) => acc + files.length, 0),
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
