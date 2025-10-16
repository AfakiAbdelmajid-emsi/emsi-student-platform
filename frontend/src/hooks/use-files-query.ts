'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile, getCourseFiles, deleteFile, getFilePreviewUrl, getFileDownloadUrl } from '@/lib/api/files';
import type { FileOut, FileUpload } from '@/types/files';
import { useCourses } from './use-courses-query';

// Query keys for consistent caching
export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  byCourse: (courseId: string) => [...fileKeys.lists(), courseId] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
};

export function useFiles({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();

  // Fetch files for a course with caching
  const {
    data: files = [],
    isLoading,
    error,
    refetch: fetchFiles,
  } = useQuery({
    queryKey: fileKeys.byCourse(courseId),
    queryFn: async () => {
      const response = await getCourseFiles(courseId);
      
      // Cache files in localStorage for dashboard stats
      try {
        const cachedFiles = localStorage.getItem('course_files_cache');
        const filesMap = cachedFiles ? JSON.parse(cachedFiles) : {};
        filesMap[courseId] = response;
        localStorage.setItem('course_files_cache', JSON.stringify(filesMap));
      } catch (error) {
        console.error('Error caching files:', error);
      }
      
      return response;
    },
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadFile(courseId, { file }),
    onSuccess: (uploadedFile) => {
      // Update the files list for this course
      queryClient.setQueryData(fileKeys.byCourse(courseId), (old: FileOut[] = []) => {
        const updated = [...old, uploadedFile];
        
        // Update localStorage cache
        try {
          const cachedFiles = localStorage.getItem('course_files_cache');
          const filesMap = cachedFiles ? JSON.parse(cachedFiles) : {};
          filesMap[courseId] = updated;
          localStorage.setItem('course_files_cache', JSON.stringify(filesMap));
        } catch (error) {
          console.error('Error updating files cache:', error);
        }
        
        return updated;
      });
    },
  });

  // Upload multiple files mutation
  const uploadMultipleFilesMutation = useMutation({
    mutationFn: ({ files }: { files: File[] }) => {
      const uploadPromises = files.map(file => uploadFile(courseId, { file }));
      return Promise.all(uploadPromises);
    },
    onSuccess: (uploadedFiles) => {
      // Update the files list for this course
      queryClient.setQueryData(fileKeys.byCourse(courseId), (old: FileOut[] = []) => {
        const updated = [...old, ...uploadedFiles];
        
        // Update localStorage cache
        try {
          const cachedFiles = localStorage.getItem('course_files_cache');
          const filesMap = cachedFiles ? JSON.parse(cachedFiles) : {};
          filesMap[courseId] = updated;
          localStorage.setItem('course_files_cache', JSON.stringify(filesMap));
        } catch (error) {
          console.error('Error updating files cache:', error);
        }
        
        return updated;
      });
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: ({ fileId }: { fileId: string }) => deleteFile(courseId, fileId),
    onSuccess: (_, { fileId }) => {
      // Update the files list for this course
      queryClient.setQueryData(fileKeys.byCourse(courseId), (old: FileOut[] = []) => {
        const updated = old.filter(file => file.id !== fileId);
        
        // Update localStorage cache
        try {
          const cachedFiles = localStorage.getItem('course_files_cache');
          const filesMap = cachedFiles ? JSON.parse(cachedFiles) : {};
          filesMap[courseId] = updated;
          localStorage.setItem('course_files_cache', JSON.stringify(filesMap));
        } catch (error) {
          console.error('Error updating files cache:', error);
        }
        
        return updated;
      });
    },
  });

  return {
    files,
    isLoading,
    error: error?.message || null,
    fetchFiles,
    uploadFile: (file: File) => uploadFileMutation.mutateAsync({ file }),
    uploadMultipleFiles: (files: File[]) => uploadMultipleFilesMutation.mutateAsync({ files }),
    deleteFile: (fileId: string) => deleteFileMutation.mutateAsync({ fileId }),
    isUploading: uploadFileMutation.isPending,
    isUploadingMultiple: uploadMultipleFilesMutation.isPending,
    isDeleting: deleteFileMutation.isPending,
  };
}

// Hook for file preview functionality
export function useFilePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'office' | 'text' | null>(null);

  const previewFile = async (courseId: string, files: any[], fileId: string, fileName: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    try {
      if (file.file_type.includes('image')) {
        const url = await getFilePreviewUrl(courseId, fileName);
        setPreviewType('image');
        setPreviewUrl(url);
      } else if (file.file_type === 'application/pdf') {
        const url = await getFilePreviewUrl(courseId, fileName);
        setPreviewType('pdf');
        setPreviewUrl(url);
      } else if (
        file.file_type.includes('word') ||
        file.file_name.match(/\.(doc|docx)$/i) ||
        file.file_type.includes('powerpoint') ||
        file.file_name.match(/\.(ppt|pptx)$/i)
      ) {
        const previewUrl = await getFilePreviewUrl(courseId, fileName);
        const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewUrl)}`;
        setPreviewType('office');
        setPreviewUrl(officeUrl);
      } else if (file.file_type === 'text/plain' || file.file_name.match(/\.txt$/i)) {
        const url = await getFilePreviewUrl(courseId, fileName);
        setPreviewType('text');
        setPreviewUrl(url);
      } else {
        // For unsupported types, trigger download
        const downloadUrl = await getFileDownloadUrl(courseId, fileName);
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return {
    previewUrl,
    previewType,
    previewFile,
    clearPreview,
  };
}

// Hook for fetching all files across all courses (for dashboard)
export function useAllFiles() {
  const { courses } = useCourses();

  return useQuery({
    queryKey: ['allFiles'],
    queryFn: async () => {
      const filesResults = await Promise.all(
        courses.map(async (course) => {
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

      return filesMap;
    },
    enabled: courses.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 