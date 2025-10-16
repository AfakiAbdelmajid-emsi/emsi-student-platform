// === src/lib/api/notes.ts ===
'use client';
import client from './client';
import type { NoteOut, NoteCreate, NoteUpdate } from '@/types/notes';
import { extractImageUrls } from '@/utility/utils';
// Function to create a new note
export async function createNote(noteData: NoteCreate): Promise<NoteOut> {
  try {
    const response = await client<NoteOut>('/notes/create_note', {
      method: 'POST',
      data: noteData,
    });
    return response;
  } catch (error) {
    console.error('Failed to create note:', error);
    throw error;
  }
}

// Function to get all notes for the current user
export async function getUserNotes(): Promise<NoteOut[]> {
  try {
    const response = await client<NoteOut[]>('/notes/get_notes');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch user notes:', error);
    return [];
  }
}

// Function to get a specific note by its ID
export async function getNoteById(noteId: string): Promise<NoteOut> {
  try {
    const response = await client<NoteOut>(`/notes/get_note/${noteId}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch note by ID:', error);
    throw error;
  }
}

// Function to update an existing note
export async function updateNote(
  noteId: string,
  noteData: NoteUpdate
): Promise<NoteOut> {
  try {
    const response = await client<NoteOut>(`/notes/edit_note/${noteId}`, {
      method: 'PUT',
      data: {
        ...noteData,
        content: noteData.content || { type: 'doc', content: [] }
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to update note:', error);
    throw error;
  }
}

// Function to delete a specific note by its ID
export async function deleteNote(noteId: string): Promise<void> {
  try {
    await client(`/notes/delete_note/${noteId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error;
  }
}

// Function to get all notes for a specific course
export async function getNotesByCourse(courseId: string): Promise<NoteOut[]> {
  try {
    const response = await client<{ notes: NoteOut[] }>(`/notes/get_notes_by_course/${courseId}`);
    return response.notes;
  } catch (error) {
    console.error('Failed to fetch notes by course:', error);
    throw error;
  }
}

// Function to upload an image for a note
export async function uploadNoteImage(
  noteId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ file_data: { file_path: string } }> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await client<{ file_data: { file_path: string } }>(
      `/notes/upload_image/${noteId}`,
      {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          if (event.progress && onProgress) {
            onProgress(event.progress * 100);
          }
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to upload note image:', error);
    throw error;
  }
}

export async function deleteNoteImage(imageUrl: string): Promise<{ message: string }> {
  const response = await client('/notes/delete_image', {
    method: 'DELETE',
    data: { url: imageUrl }
  });

  return response || { message: 'Image deleted successfully' };
}



// Function to update note content with image cleanup
export async function updateNoteWithImageCleanup(
  noteId: string,
  noteData: NoteUpdate,
  previousContent: any
): Promise<NoteOut> {
  try {
    // First update the note
    const updatedNote = await updateNote(noteId, noteData);
    
    // Extract image URLs from old and new content
    const currentImages = extractImageUrls(noteData.content || {});
    const previousImages = extractImageUrls(previousContent);
    
    // Find images that were removed
    const deletedImages = previousImages.filter(url => !currentImages.includes(url));

    // Delete removed images from storage
    await Promise.all(
      deletedImages.map(url => 
        deleteNoteImage(url).catch(e => {
          console.error(`Failed to delete image ${url}:`, e);
          return null;
        })
      )
    );

    return updatedNote;
  } catch (error) {
    console.error('Failed to update note with image cleanup:', error);
    throw error;
  }
}

// Helper function to extract image URLs from note content
