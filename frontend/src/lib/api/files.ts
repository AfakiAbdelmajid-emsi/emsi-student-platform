// === src/lib/api/files.ts ===
'use client';
import client from './client'; // Assuming this is a client utility for making HTTP requests
import type { FileOut, FileUpload } from '@/types/files'; // Importing types for the response and the upload data

// Function to upload a file for a specific course
export async function uploadFile(
  courseId: string,  // The ID of the course
  fileData: FileUpload // The file upload data containing the file itself
): Promise<FileOut> { // Returns a Promise with the uploaded file information (FileOut)
  
  const formData = new FormData();  // Create a new FormData object to append the file and course ID
  formData.append('file', fileData.file);  // Append the file itself  
  // Log the contents of the FormData (for debugging)
  // Note: FormData cannot be logged directly, so we loop over entries to see the values.
  for (const [key, value] of formData.entries()) {
    console.log(key, value); // Log key-value pairs of FormData
  }

  // Making the POST request to the backend to upload the file
  try {
    const response = await client<FileOut>(`/files/upload_file/${courseId}`, {
      method: 'POST',
      body: formData,  // Sending the FormData object as the body
    });
    return response;  // Return the server's response, which should contain the uploaded file info
  } catch (error) {
    console.error('File upload failed:', error);  // Log any errors during the upload
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Function to get the files associated with a course
export async function getCourseFiles(
  courseId: string  // The ID of the course to fetch the files for
): Promise<FileOut[]> { // Returns a Promise with an array of file details for the course
  try {
    const response = await client<{ files: FileOut[] }>(`/files/get_files/${courseId}`);
    return response.files; // Return the list of files
  } catch (error) {
    console.error('Failed to fetch course files:', error); // Log any errors while fetching files
    throw error;  // Rethrow the error for the caller to handle
  }
}// Function to get a preview URL for a file
export async function getFilePreviewUrl(
  courseId: string,
  fileName: string
): Promise<string> {  // Changed from Blob to string
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await client<{ url: string }>(
      `/files/generate_preview_url/${courseId}/${encodedFileName}`
    );
    return response.url;  // Return just the URL string
  } catch (error) {
    console.error('Failed to generate preview URL:', error);
    throw error;
  }
}

// Function to get direct file content for preview (if needed)
export async function getFilePreviewBlob(
  courseId: string,
  fileName: string
): Promise<Blob> {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await client<Blob>(
      `/files/preview_file/${courseId}/${encodedFileName}`,
      {
        responseType: 'blob',
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch file preview:', error);
    throw error;
  }
}

// Function to get signed URL for direct download
export async function getFileDownloadUrl(
  courseId: string,
  fileName: string
): Promise<string> {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await client<{ url: string }>(
      `/files/generate_download_url/${courseId}/${encodedFileName}`
    );
    return response.url;
  } catch (error) {
    console.error('Failed to generate download URL:', error);
    throw error;
  }
}
export async function deleteFile(
  courseId: string,
  fileId: string
): Promise<void> {
  try {
    await client(`/files/delete_file/${courseId}/${fileId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('File deletion failed:', error);
    throw error;
  }
}