'use client';
import { useState, useEffect } from 'react';
import { 
  createNote, 
  getUserNotes, 
  getNoteById, 
  updateNote, 
  deleteNote, 
  getNotesByCourse,
  uploadNoteImage,
  deleteNoteImage
} from '@/lib/api/notes';
import type { NoteOut, NoteCreate, NoteUpdate } from '@/types/notes';
import { extractImageUrls } from '@/utility/utils';

export function useNotes() {
  const [notes, setNotes] = useState<NoteOut[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load all notes for the current user
  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const userNotes = await getUserNotes();
      setNotes(Array.isArray(userNotes) ? userNotes : []);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new note
  const addNote = async (noteData: NoteCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await createNote(noteData);
      setNotes(prevNotes => Array.isArray(prevNotes) ? [...prevNotes, newNote] : [newNote]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single note by its ID
  const fetchNoteById = async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const note = await getNoteById(noteId);
      return note;
    } catch (err) {
      setError('Failed to fetch note by ID');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing note with image cleanup
  const updateExistingNote = async (
    noteId: string,
    noteData: NoteUpdate,
    previousContent?: any
  ): Promise<NoteOut> => {
    setLoading(true);
    setError(null);
    try {
      // First handle image cleanup if we have previous content
      if (previousContent) {
        const currentImages = extractImageUrls(noteData.content || {});
        const previousImages = extractImageUrls(previousContent);
        const deletedImages = previousImages.filter(url => !currentImages.includes(url));

        // Delete removed images from storage
        await Promise.all(
          deletedImages.map(url => 
            deleteImage(url).catch(e => {
              console.error(`Failed to delete image ${url}:`, e);
              return null;
            })
          )
        );
      }

      // Then update the note
      console.log('Updating note with ID:', noteData);
      const updatedNote = await updateNote(noteId, {
        ...noteData,
        content: noteData.content || { type: 'doc', content: [] }
      });
      
      setNotes(prevNotes => 
        Array.isArray(prevNotes) 
          ? prevNotes.map(note => (note.id === noteId ? updatedNote : note)) 
          : [updatedNote]
      );
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      console.error('Update error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a note by its ID
  const removeNote = async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteNote(noteId);
      setNotes(prevNotes => 
        Array.isArray(prevNotes) 
          ? prevNotes.filter(note => note.id !== noteId) 
          : []
      );
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch notes for a specific course
  const loadNotesByCourse = async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const courseNotes = await getNotesByCourse(courseId);
      setNotes(Array.isArray(courseNotes) ? courseNotes : []);
    } catch (err) {
      setError('Failed to fetch notes for the course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload an image for a note
  const uploadImage = async (noteId: string, file: File, onProgress?: (progress: number) => void) => {
    setLoading(true);
    setError(null);
    try {
      const response = await uploadNoteImage(noteId, file, onProgress);
      return response;
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an image
  const deleteImage = async (imageUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteNoteImage(imageUrl);
      return response;
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initially load notes when the hook is first used
  useEffect(() => {
    loadNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    loadNotes,
    addNote,
    fetchNoteById,
    updateExistingNote,
    removeNote,
    loadNotesByCourse,
    uploadImage,
    deleteImage,
  };
}