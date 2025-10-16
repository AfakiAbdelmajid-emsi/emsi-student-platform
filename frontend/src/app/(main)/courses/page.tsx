'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, StarIcon, ClockIcon, BoltIcon, FolderIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCourses } from '@/hooks/use-courses-query';
import { useRouter } from 'next/navigation';
import { AddCourseForm } from '@/components/courses/AddCourseForm';
import { CourseSection } from '@/components/courses/CourseSection';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { EditCourseForm } from '@/components/courses/EditCourse';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';

const CoursesPage = () => {
  const { courses, categories, loading, error, addCourse, removeCourse, editCourse } = useCourses();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pinnedCourses, setPinnedCourses] = useState<string[]>([]);
  const [recentlyOpened, setRecentlyOpened] = useState<string[]>([]);
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    // Load pinned and recently opened courses from localStorage
    const savedPinned = localStorage.getItem('pinnedCourses');
    const savedRecent = localStorage.getItem('recentlyOpened');
    if (savedPinned) setPinnedCourses(JSON.parse(savedPinned));
    if (savedRecent) setRecentlyOpened(JSON.parse(savedRecent));
  }, []);

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
    // Update recently opened courses
    const newRecent = [courseId, ...recentlyOpened.filter(id => id !== courseId)].slice(0, 5);
    setRecentlyOpened(newRecent);
    localStorage.setItem('recentlyOpened', JSON.stringify(newRecent));
  };

  const handlePinToggle = (courseId: string) => {
    const newPinned = pinnedCourses.includes(courseId)
      ? pinnedCourses.filter(id => id !== courseId)
      : [...pinnedCourses, courseId];
    setPinnedCourses(newPinned);
    localStorage.setItem('pinnedCourses', JSON.stringify(newPinned));
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await removeCourse(courseId);
        // Remove from pinned and recently opened if present
        setPinnedCourses(prev => prev.filter(id => id !== courseId));
        setRecentlyOpened(prev => prev.filter(id => id !== courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const handleShare = async (courseId: string) => {
    try {
      const url = `${window.location.origin}/courses/${courseId}`;
      await navigator.clipboard.writeText(url);
      alert('Course link copied to clipboard!');
    } catch (error) {
      console.error('Failed to share course:', error);
    }
  };

  const handleEdit = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setEditingCourse(course);
    }
  };

  const handleEditSuccess = (updatedCourse: any) => {
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const pinnedCoursesList = filteredCourses.filter(course => pinnedCourses.includes(course.id));
  const recentlyOpenedList = filteredCourses.filter(course => recentlyOpened.includes(course.id));
  const quickAccessList = filteredCourses.filter(course => !pinnedCourses.includes(course.id) && !recentlyOpened.includes(course.id)).slice(0, 4);
  const remainingCourses = filteredCourses.filter(course => 
    !pinnedCourses.includes(course.id) && 
    !recentlyOpened.includes(course.id) && 
    !quickAccessList.includes(course)
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-4">
            {t('allCourses', 'My Courses')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('organizeMaterials', 'Organize and access your learning materials')}
          </p>
        </div>

        <CourseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <CourseSection
          title={t('pinnedCourses', 'Pinned Courses')}
          icon={<StarIconSolid className="h-6 w-6 text-yellow-400" />}
          courses={pinnedCoursesList}
          viewMode={viewMode}
          onCourseClick={handleCourseClick}
          onPinToggle={handlePinToggle}
          onDelete={handleDelete}
          onShare={handleShare}
          onEdit={handleEdit}
          pinnedCourses={pinnedCourses}
        />

        <CourseSection
          title={t('recentlyOpened', 'Recently Opened')}
          icon={<ClockIcon className="h-6 w-6 text-primary-500" />}
          courses={recentlyOpenedList}
          viewMode={viewMode}
          onCourseClick={handleCourseClick}
          onPinToggle={handlePinToggle}
          onDelete={handleDelete}
          onShare={handleShare}
          onEdit={handleEdit}
          pinnedCourses={pinnedCourses}
        />

        <CourseSection
          title={t('quickAccess', 'Quick Access')}
          icon={<BoltIcon className="h-6 w-6 text-accent-500" />}
          courses={quickAccessList}
          viewMode={viewMode}
          onCourseClick={handleCourseClick}
          onPinToggle={handlePinToggle}
          onDelete={handleDelete}
          onShare={handleShare}
          onEdit={handleEdit}
          pinnedCourses={pinnedCourses}
        />

        <CourseSection
          title={t('allCourses', 'All Courses')}
          icon={<FolderIcon className="h-6 w-6 text-primary-400" />}
          courses={remainingCourses}
          viewMode={viewMode}
          onCourseClick={handleCourseClick}
          onPinToggle={handlePinToggle}
          onDelete={handleDelete}
          onShare={handleShare}
          onEdit={handleEdit}
          pinnedCourses={pinnedCourses}
        />

        {/* Add New Course Button */}
        <button 
          onClick={() => setShowAddForm(true)} 
          className="fixed bottom-8 right-8 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 animate-scale-in transform hover:-translate-y-1"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        {/* Add Course Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="fixed inset-0" onClick={() => setShowAddForm(false)} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
              <AddCourseForm 
                onSuccess={() => { 
                  setShowAddForm(false); 
                }} 
                onCancel={() => setShowAddForm(false)} 
              />
            </div>
          </div>
        )}

        {/* Edit Course Form Modal */}
        {editingCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="fixed inset-0" onClick={() => setEditingCourse(null)} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
              <EditCourseForm
                course={editingCourse}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingCourse(null)}
              />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CoursesPage;
