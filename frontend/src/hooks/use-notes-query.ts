'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Query keys for consistent caching
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: string) => [...noteKeys.lists(), { filters }] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
  byCourse: (courseId: string) => [...noteKeys.all, 'course', courseId] as const,
};

export function useNotes() {
  const queryClient = useQueryClient();

  // Fetch all notes with caching
  const {
    data: notes = [],
    isLoading: loading,
    error,
    refetch: loadNotes,
  } = useQuery({
    queryKey: noteKeys.lists(),
    queryFn: async () => {
      const userNotes = await getUserNotes();
      return Array.isArray(userNotes) ? userNotes : [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      // Update the notes list
      queryClient.setQueryData(noteKeys.lists(), (old: NoteOut[] = []) => {
        return [...old, newNote];
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, noteData, previousContent }: { 
      noteId: string; 
      noteData: NoteUpdate; 
      previousContent?: any;
    }) => {
      // Handle image cleanup if we have previous content
      if (previousContent) {
        const currentImages = extractImageUrls(noteData.content || {});
        const previousImages = extractImageUrls(previousContent);
        const deletedImages = previousImages.filter(url => !currentImages.includes(url));

        // Delete removed images from storage
        Promise.all(
          deletedImages.map(url => 
            deleteNoteImage(url).catch(e => {
              console.error(`Failed to delete image ${url}:`, e);
              return null;
            })
          )
        );
      }

      return updateNote(noteId, {
        ...noteData,
        content: noteData.content || { type: 'doc', content: [] }
      });
    },
    onSuccess: (updatedNote, { noteId }) => {
      // Update the notes list
      queryClient.setQueryData(noteKeys.lists(), (old: NoteOut[] = []) => {
        return old.map(note => (note.id === noteId ? updatedNote : note));
      });

      // Update the specific note detail
      queryClient.setQueryData(noteKeys.detail(noteId), updatedNote);
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, noteId) => {
      // Update the notes list
      queryClient.setQueryData(noteKeys.lists(), (old: NoteOut[] = []) => {
        return old.filter(note => note.id !== noteId);
      });

      // Remove the specific note detail from cache
      queryClient.removeQueries({ queryKey: noteKeys.detail(noteId) });
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: ({ noteId, file, onProgress }: { 
      noteId: string; 
      file: File; 
      onProgress?: (progress: number) => void;
    }) => uploadNoteImage(noteId, file, onProgress),
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: deleteNoteImage,
  });

  // Helper function to fetch note by ID
  const fetchNoteById = async (noteId: string) => {
    return await getNoteById(noteId);
  };

  // Helper function to load notes by course
  const loadNotesByCourse = async (courseId: string) => {
    const courseNotes = await getNotesByCourse(courseId);
    return Array.isArray(courseNotes) ? courseNotes : [];
  };

  return {
    notes,
    loading,
    error: error?.message || null,
    loadNotes,
    addNote: addNoteMutation.mutateAsync,
    updateExistingNote: (noteId: string, noteData: NoteUpdate, previousContent?: any) =>
      updateNoteMutation.mutateAsync({ noteId, noteData, previousContent }),
    removeNote: deleteNoteMutation.mutateAsync,
    fetchNoteById,
    loadNotesByCourse,
    uploadImage: (noteId: string, file: File, onProgress?: (progress: number) => void) =>
      uploadImageMutation.mutateAsync({ noteId, file, onProgress }),
    deleteImage: deleteImageMutation.mutateAsync,
    isAddingNote: addNoteMutation.isPending,
    isUpdatingNote: updateNoteMutation.isPending,
    isDeletingNote: deleteNoteMutation.isPending,
    isUploadingImage: uploadImageMutation.isPending,
    isDeletingImage: deleteImageMutation.isPending,
  };
}

// Hook for fetching a single note
export function useNote(noteId: string) {
  return useQuery({
    queryKey: noteKeys.detail(noteId),
    queryFn: () => getNoteById(noteId),
    enabled: !!noteId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

// Hook for fetching notes by course
export function useNotesByCourse(courseId: string) {
  return useQuery({
    queryKey: noteKeys.byCourse(courseId),
    queryFn: () => getNotesByCourse(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
} 