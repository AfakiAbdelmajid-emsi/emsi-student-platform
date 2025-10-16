// utility/FileCategory.ts
import type { FileOut } from '@/types/files';

export function categorizeFiles(files: FileOut[]) {
  return {
    imageFiles: files.filter(file => 
      file.file_type.includes('image') ||
      file.file_name?.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)
    ),
    pdfFiles: files.filter(file => 
      file.file_type === 'application/pdf' ||
      file.file_name?.match(/\.pdf$/i)
    ),
    documentFiles: files.filter(file => 
      (file.file_type.includes('word') || 
       file.file_type.includes('document') ||
       file.file_type.includes('msword') ||
       file.file_type.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) &&
      !file.file_name?.match(/\.(ppt|pptx)$/i) // Exclude presentations
    ),
    presentationFiles: files.filter(file => 
      (file.file_type.includes('powerpoint') || 
       file.file_type.includes('presentation') ||
       file.file_type.includes('vnd.ms-powerpoint') ||
       file.file_type.includes('vnd.openxmlformats-officedocument.presentationml.presentation') ||
       file.file_name?.match(/\.(ppt|pptx)$/i)) &&
      !file.file_name?.match(/\.(doc|docx)$/i) // Exclude documents
    ),
    archiveFiles: files.filter(file => 
      file.file_type.includes('zip') || 
      file.file_type.includes('compressed') ||
      file.file_type.includes('x-rar-compressed') ||
      file.file_type.includes('x-7z-compressed') ||
      file.file_name?.match(/\.(zip|rar|7z|tar|gz)$/i)
    ),
    textFiles: files.filter(file => 
      file.file_type === 'text/plain' ||
      file.file_type.includes('text/') ||
      file.file_name?.match(/\.(txt|csv|json|xml|html|js|ts|py|java|cpp)$/i)
    ),
    otherFiles: files.filter(file => {
      const isOther = 
        !file.file_type.includes('image') && 
        file.file_type !== 'application/pdf' &&
        !file.file_type.includes('word') &&
        !file.file_type.includes('document') &&
        !file.file_type.includes('powerpoint') &&
        !file.file_type.includes('presentation') &&
        !file.file_type.includes('zip') &&
        !file.file_type.includes('compressed') &&
        !file.file_type.includes('text/') &&
        !file.file_name?.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|pdf|doc|docx|ppt|pptx|zip|rar|7z|tar|gz|txt|csv|json|xml|html|js|ts|py|java|cpp)$/i);
      return isOther;
    })
  };
}