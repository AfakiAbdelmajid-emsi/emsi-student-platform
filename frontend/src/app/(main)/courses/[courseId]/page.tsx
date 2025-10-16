'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourse } from '@/hooks/use-courses-query';
import { useFiles } from '@/hooks/use-files-query';
import FileUploadForm from '@/components/files/FileUploadForm';
import { FileSection } from '@/components/files/FileSection';
import { categorizeFiles } from '@/utility/FileCategory';
import type { CourseOut } from '@/types/courses';
import { Upload, FileText, Clock, Calendar, FolderOpen, BarChart2 } from 'lucide-react';
import { useCourses } from '@/hooks/use-courses-query';
import { EditCourseForm } from '@/components/courses/EditCourse';
import PreviewModal from '@/components/files/PreviewModal';
import { getFilePreviewUrl, getFileDownloadUrl } from '@/lib/api/files';
import CourseHeader from '@/components/courses/CourseHeader';
import FileTabs from '@/components/files/FileTabs';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { editCourse, removeCourse } = useCourses();
  const [showEditForm, setShowEditForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'office' | 'text' | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'recent'>('all');
  const { t } = useTranslation('common');

  // Use optimized hooks
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseId as string);
  const { files, isLoading: filesLoading, error: filesError, deleteFile } = useFiles({
    courseId: courseId as string,
  });

  const handleEditCourse = (updatedCourse: CourseOut) => {
    editCourse(courseId as string, updatedCourse);
  };

  useEffect(() => {
    if (!courseId) return;

    const pinnedCourses = JSON.parse(localStorage.getItem('pinnedCourses') || '[]');
    setIsPinned(pinnedCourses.includes(courseId));
  }, [courseId]);

  const handlePinToggle = () => {
    const pinnedCourses = JSON.parse(localStorage.getItem('pinnedCourses') || '[]');
    const newPinned = isPinned
      ? pinnedCourses.filter((id: string) => id !== courseId)
      : [...pinnedCourses, courseId];
    localStorage.setItem('pinnedCourses', JSON.stringify(newPinned));
    setIsPinned(!isPinned);
  };

  const previewFile = async (fileId: string, fileName: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    try {
      if (file.file_type.includes('image')) {
        const url = await getFilePreviewUrl(courseId as string, fileName);
        setPreviewType('image');
        setPreviewUrl(url);
      } else if (file.file_type === 'application/pdf') {
        const url = await getFilePreviewUrl(courseId as string, fileName);
        setPreviewType('pdf');
        setPreviewUrl(url);
      } else if (
        file.file_type.includes('word') ||
        file.file_name.match(/\.(doc|docx)$/i) ||
        file.file_type.includes('powerpoint') ||
        file.file_name.match(/\.(ppt|pptx)$/i)
      ) {
        const previewUrl = await getFilePreviewUrl(courseId as string, fileName);
        const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewUrl)}`;
        setPreviewType('office');
        setPreviewUrl(officeUrl);
      } else if (file.file_type === 'text/plain' || file.file_name.match(/\.txt$/i)) {
        const url = await getFilePreviewUrl(courseId as string, fileName);
        setPreviewType('text');
        setPreviewUrl(url);
      } else {
        const downloadUrl = await getFileDownloadUrl(courseId as string, fileName);
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const getFileStats = () => {
    return {
      total: files.length,
      images: imageFiles.length,
      documents: documentFiles.length + pdfFiles.length,
      presentations: presentationFiles.length,
      archives: archiveFiles.length,
      text: textFiles.length,
      other: otherFiles.length,
    };
  };

  const handleDeleteCourse = async () => {
    try {
      const confirmDelete = confirm(t('confirmDeleteCourse', 'Are you sure you want to delete this course?'));
      if (confirmDelete) {
        await removeCourse(courseId as string);
        router.push('/courses');
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  if (courseLoading) return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    </PageContainer>
  );

  if (courseError || !course) return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('courseNotFound', 'Course not found')}</h2>
          <p className="text-gray-600 mb-8">{t('courseNotFoundDesc', 'The course you are looking for does not exist or has been removed.')}</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('backToCourses', 'Back to Courses')}
          </button>
        </div>
      </div>
    </PageContainer>
  );

  const {
    imageFiles,
    pdfFiles,
    documentFiles,
    presentationFiles,
    archiveFiles,
    otherFiles,
    textFiles,
  } = categorizeFiles(files);

  const pinnedFiles = files.filter(file => {
    const pinnedFiles = JSON.parse(localStorage.getItem(`pinnedFiles_${courseId}`) || '[]');
    return pinnedFiles.includes(file.id);
  });

  const recentFiles = files
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <PageContainer>
      <div className="min-h-[calc(100vh-8rem)]">
        <CourseHeader
          course={course}
          isPinned={isPinned}
          onPinToggle={handlePinToggle}
          onEdit={() => setShowEditForm(true)}
          onDelete={handleDeleteCourse}
          onBack={() => router.push('/courses')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Quick Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('courseOverview', 'Course Overview')}</h2>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('description', 'Description')}</h3>
                <p className="text-gray-700">{course.description || t('noDescription', 'No description provided')}</p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-700">{t('totalFiles', 'Total Files')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{getFileStats().total}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">{t('documents', 'Documents')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{getFileStats().documents}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart2 className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{t('presentations', 'Presentations')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{getFileStats().presentations}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">{t('created', 'Created')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">{t('lastUpdated', 'Last Updated')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(course.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="lg:col-span-2">
            <FileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="space-y-6 mt-6">
              {filesLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <>
                  {activeTab === 'all' && (
                    <>
                      {imageFiles.length > 0 && (
                        <FileSection
                          title={t('images', 'Images')}
                          icon="🖼️"
                          files={imageFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {pdfFiles.length > 0 && (
                        <FileSection
                          title={t('pdfs', 'PDFs')}
                          icon="📄"
                          files={pdfFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {documentFiles.length > 0 && (
                        <FileSection
                          title={t('documents', 'Documents')}
                          icon="📝"
                          files={documentFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {presentationFiles.length > 0 && (
                        <FileSection
                          title={t('presentations', 'Presentations')}
                          icon="📊"
                          files={presentationFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {archiveFiles.length > 0 && (
                        <FileSection
                          title={t('archives', 'Archives')}
                          icon="🗄️"
                          files={archiveFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {textFiles.length > 0 && (
                        <FileSection
                          title={t('textFiles', 'Text Files')}
                          icon="📄"
                          files={textFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                      {otherFiles.length > 0 && (
                        <FileSection
                          title={t('otherFiles', 'Other Files')}
                          icon="📁"
                          files={otherFiles}
                          onPreview={previewFile}
                          onDelete={deleteFile}
                          courseId={courseId as string}
                        />
                      )}
                    </>
                  )}
                  {activeTab === 'pinned' && (
                    <FileSection
                      title={t('pinnedFiles', 'Pinned Files')}
                      icon="📌"
                      files={pinnedFiles}
                      onPreview={previewFile}
                      onDelete={deleteFile}
                      courseId={courseId as string}
                    />
                  )}
                  {activeTab === 'recent' && (
                    <FileSection
                      title={t('recentFiles', 'Recent Files')}
                      icon="🕒"
                      files={recentFiles}
                      onPreview={previewFile}
                      onDelete={deleteFile}
                      courseId={courseId as string}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => setShowUploadForm(true)}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 transform hover:-translate-y-1"
      >
        <Upload className="h-6 w-6" />
      </button>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="fixed inset-0" onClick={() => setShowUploadForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
            <FileUploadForm
              courseId={courseId as string}
              onSuccess={() => {
                setShowUploadForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="fixed inset-0" onClick={() => setShowEditForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
            <EditCourseForm
              course={course}
              onSuccess={handleEditCourse}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && previewType && (
        <PreviewModal
          url={previewUrl}
          type={previewType}
          onClose={() => {
            setPreviewUrl(null);
            setPreviewType(null);
          }}
        />
      )}
    </PageContainer>
  );
}
