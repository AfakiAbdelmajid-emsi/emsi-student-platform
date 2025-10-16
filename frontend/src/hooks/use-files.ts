'use client';
import { useState } from 'react';
import { uploadFile, getCourseFiles } from '@/lib/api/files';
import type { FileOut, FileUpload } from '@/types/files';
import { deleteFile } from '@/lib/api/files'; // You'll need to create this API function

interface UseFilesOptions {
  courseId: string;
}
import { getFilePreviewUrl, getFileDownloadUrl } from '@/lib/api/files';

export const useFilePreview = () => {
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
      // Handle error (show toast, etc.)
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
};
export function useFiles({ courseId }: UseFilesOptions) {
  const [files, setFiles] = useState<FileOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCourseFiles(courseId);
      setFiles(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const uploadedFile = await uploadFile(courseId, { file });
      setFiles(prev => [...prev, uploadedFile]);
      return uploadedFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File upload failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadMultiple = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const uploadPromises = files.map(file => uploadFile(courseId, { file }));
      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      return uploadedFiles;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Some files failed to upload');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (fileId: string) => {
    setIsLoading(true);
    try {
      await deleteFile(courseId, fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    files,
    isLoading,
    error,
    deleteFile: handleDelete,
    fetchFiles,
    uploadFile: handleUpload,
    uploadMultipleFiles: handleUploadMultiple,
  };
}