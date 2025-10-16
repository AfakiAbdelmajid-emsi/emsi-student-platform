// components/notes/NoteEditor.tsx
'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import { useNotes } from '@/hooks/use-notes-query';
import ModernEditor from '@/components/editor/ModernEditor';
import type { NoteOut } from '@/types/notes';
import * as Icons from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';

interface NoteEditorProps {
  note: NoteOut;
  onClose: () => void;
  courses: any[];
}

export default function NoteEditor({ note, onClose, courses }: NoteEditorProps) {
  const { updateExistingNote } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState<string>(typeof note.content === 'string' ? note.content : JSON.stringify(note.content));
  const [selectedCourse, setSelectedCourse] = useState(note.course_id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Parse the content if it's a string
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      await updateExistingNote(note.id, {
        title,
        content: parsedContent,
        course_id: selectedCourse || null
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title !== note.title || content !== JSON.stringify(note.content) || selectedCourse !== note.course_id) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [title, content, selectedCourse]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed at top */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Icons.ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Note</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Icons.Clock size={16} />
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              <Button 
                onClick={handleSave}
                className="bg-primary-500 text-white hover:bg-primary-600"
                disabled={isSaving}
              >
                <Icons.Save size={16} className="h-5 w-5 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="space-y-4">
                  <FormInput
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                    className="focus:ring-primary-200"
                  />

                  <FormSelect
                    label="Course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    options={[
                      { value: '', label: 'None' },
                      ...courses.map(course => ({
                        value: course.id,
                        label: course.title
                      }))
                    ]}
                    className="focus:ring-primary-200"
                  />

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icons.BookOpen size={16} />
                      <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Icons.Clock size={16} />
                      <span>Last updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Note Content</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && (
                        <span className="text-sm text-gray-500">Saving...</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <ModernEditor 
                    content={content}
                    onUpdate={setContent}
                    placeholder="Start writing your note..."
                  />
                </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}