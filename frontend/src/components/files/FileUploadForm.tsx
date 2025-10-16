'use client';
import { useState, useCallback, useRef } from 'react';
import { useFiles } from '@/hooks/use-files-query';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import SubmitButton from '@/components/ui/SubmitButton';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadFormProps {
  courseId: string;
  onSuccess?: () => void;
}

export default function FileUploadForm({ courseId, onSuccess }: FileUploadFormProps) {
  const { t } = useTranslation('common');
  const { isLoading, error, uploadMultipleFiles } = useFiles({ courseId });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Create a Set of existing file names for quick lookup
      const existingNames = new Set(selectedFiles.map(f => f.name));
      
      // Filter out duplicates
      const uniqueNewFiles = newFiles.filter(file => !existingNames.has(file.name));
      
      if (uniqueNewFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...uniqueNewFiles]);
      }
      
      // Reset the input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      await uploadMultipleFiles(selectedFiles);
      setSelectedFiles([]);
      onSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return (
      <div className="w-8 h-10">
        <FileIcon
          extension={extension}
          {...(defaultStyles[extension as keyof typeof defaultStyles] || {})}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t('clickToUpload', 'Click to upload')}</span> {t('orDragAndDrop', 'or drag and drop')}
              </p>
              <p className="text-xs text-gray-500">
                {selectedFiles.length > 0 ? t('addMoreFiles', 'Add more files') : t('multipleFilesSupported', 'Multiple files supported')}
              </p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              multiple
              disabled={isLoading}
            />
          </label>

          {selectedFiles.length > 0 && (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <div key={file.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="p-2"
                      disabled={isLoading}
                    >
                      <FiX size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {selectedFiles.length} {t('filesSelected', 'file(s) selected')}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  disabled={isLoading}
                >
                  {t('clearAll', 'Clear all')}
                </button>
              </div>
            </>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <SubmitButton
            isLoading={isLoading}
            defaultText={t('uploadFiles', 'Upload {{count}} File(s)', { count: selectedFiles.length })}
            loadingText={t('uploading', 'Uploading...')}
          />
        )}
      </form>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
          {String(error)}
        </div>
      )}
    </div>
  );
}