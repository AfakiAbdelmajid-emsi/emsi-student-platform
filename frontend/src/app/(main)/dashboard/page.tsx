"use client";

import { FC, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDashboardData } from '@/hooks/use-dashboard-query';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/ui/PageContainer';
import { getCourseFiles } from '@/lib/api/files';
import { getProfile } from '@/lib/api/profile';
import {
  Search,
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  FolderOpen,
  ChevronRight,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import type { FileOut } from '@/types/files';

const Dashboard: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { loading, stats, data } = useDashboardData();
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFiles, setCourseFiles] = useState<Record<string, FileOut[]>>({});
  const [filesLoading, setFilesLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; image_url?: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const loadFiles = async () => {
      if (!data?.courses) return;
      
      try {
        setFilesLoading(true);
        const filesPromises = data.courses.map(async (course) => {
          try {
            const files = await getCourseFiles(course.id);
            return { courseId: course.id, files };
          } catch (error) {
            console.error(`Failed to load files for course ${course.id}:`, error);
            return { courseId: course.id, files: [] };
          }
        });

        const results = await Promise.all(filesPromises);
        const filesMap = results.reduce((acc, { courseId, files }) => {
          acc[courseId] = files;
          return acc;
        }, {} as Record<string, FileOut[]>);

        setCourseFiles(filesMap);
      } catch (error) {
        console.error('Failed to load course files:', error);
      } finally {
        setFilesLoading(false);
      }
    };

    loadFiles();
  }, [data?.courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-blue-200"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Welcome Section */}
        <div className="bg-blue-600 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">{greeting}, {profile?.full_name || user?.email?.split('@')[0]}</h1>
              </div>
              <div className="h-24 w-24 rounded-2xl bg-white/10 flex items-center justify-center text-white font-medium overflow-hidden border-2 border-white/30 shadow-lg">
                {profile?.image_url ? (
                  <img 
                    src={profile.image_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold">{user?.email?.[0].toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Quick Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses or files..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/courses')}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                New Course
              </button>
              <button
                onClick={() => router.push('/AIbot')}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                AI Assistant
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group hover:border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Total Courses</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stats.totalCourses}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                  <BookOpen className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <button 
                onClick={() => router.push('/courses')}
                className="mt-6 flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                View all courses
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group hover:border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">Study Files</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{stats.totalFiles}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl group-hover:from-green-100 group-hover:to-green-200 transition-colors">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <button 
                onClick={() => router.push('/courses')}
                className="mt-6 flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                Browse files
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all group hover:border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">Upcoming Exams</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{data.exams.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl group-hover:from-purple-100 group-hover:to-purple-200 transition-colors">
                  <Calendar className="h-7 w-7 text-purple-600" />
                </div>
              </div>
              <button 
                onClick={() => router.push('/planning')}
                className="mt-6 flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                View schedule
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course List */}
              <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                    <button
                      onClick={() => router.push('/courses')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      View all
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.courses.map((course) => (
                      <div key={course.id} 
                        className="group relative bg-white rounded-xl p-5 hover:bg-gray-50/80 transition-all border border-gray-100 hover:border-blue-100 hover:shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {filesLoading ? (
                                <span className="flex items-center text-blue-500">
                                  <span className="animate-spin mr-2">⌛</span>
                                  Loading files...
                                </span>
                              ) : (
                                `${courseFiles[course.id]?.length || 0} files`
                              )}
                            </p>
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <GraduationCap className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span>{course.category || 'No category set'}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/courses/${course.id}`)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Course"
                            >
                              <FolderOpen className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => router.push(`/courses/${course.id}`)}
                              className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Files"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Upcoming Exams */}
              <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Exams</h2>
                    <button
                      onClick={() => router.push('/planning')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      View all
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {data.exams.slice(0, 3).map((exam) => (
                      <div key={exam.id} 
                        className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50/80 transition-all border border-gray-100 hover:border-blue-100">
                        <div>
                          <p className="font-medium text-gray-900">{exam.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {new Date(exam.exam_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                          exam.priority === 1 ? 'bg-red-100 text-red-800' :
                          exam.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {exam.priority === 1 ? 'High' :
                           exam.priority === 2 ? 'Medium' :
                           'Low'}
                        </span>
                      </div>
                    ))}
                    {data.exams.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No upcoming exams</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* AI Assistant Widget */}
              <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 via-white to-purple-50">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                    AI Study Assistant
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-600">Get instant help with your studies</p>
                    <button
                      onClick={() => router.push('/AIbot')}
                      className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center font-medium"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Open Study Assistant
                    </button>
                  </div>
                </div>
              </section>

              {/* Help Requests Section */}
              <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-orange-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Help Requests
                    </h2>
                    <button
                      onClick={() => router.push('/help-requests')}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-sm hover:shadow-md active:scale-95 text-sm font-medium"
                    >
                      Ask for Help
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {data.announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} 
                        className="p-4 bg-white rounded-xl hover:bg-gray-50/80 transition-all border border-gray-100 hover:border-orange-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span>Contact: {announcement.contact_value}</span>
                              <span className="mx-2">•</span>
                              <span>Category: {announcement.categorie}</span>
                            </div>
                            <div className="mt-2 flex items-center text-xs text-gray-400">
                              <span>Posted {new Date(announcement.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                            announcement.status === 'open' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {announcement.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {data.announcements.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No open help requests</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard; 