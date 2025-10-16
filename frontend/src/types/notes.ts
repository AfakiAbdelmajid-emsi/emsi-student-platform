// === src/types/notes.ts ===

export interface NoteCreate {
  title: string;  // The title of the note
  content: string;  // The content of the note (can be rich text, e.g., from Tiptap)
  course_id?: string | null;  // The ID of the course the note is linked to (optional)
}

// types/notes.ts
export interface NoteOut {
  id: string;
  user_id: string;
  title: string;
  content: {  // Changed to object type
    type: string;
    content: any[];
  };
  course_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteUpdate {
  title?: string;
  content?: {  // Changed to object type
    type: string;
    content: any[];
  };
  course_id?: string | null;
}
