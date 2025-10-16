// === src/types/files.ts ===
export interface FileOut {
    id: string;
    course_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at: string;
    download_url?: string; // For signed URLs
    content?: string; // For base64 encoded content
    display_type?: 'image' | 'pdf' | 'other';
  }
  
  export interface FileUpload {
    file: File;
  }