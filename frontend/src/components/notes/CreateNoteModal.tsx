'use client';
import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/use-notes-query';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: any[];
}

export default function CreateNoteModal({ isOpen, onClose, courses }: CreateNoteModalProps) {
  const { addNote } = useNotes();
  const [title, setTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    try {
      await addNote({
        title,
        content: '', // Empty content to start
        course_id: selectedCourse || null
      });
      setTitle('');
      setSelectedCourse('');
      onClose();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-xl bg-white 0 p-6 shadow-xl animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">Create New Note</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Start organizing your study materials</p>
          </div>
          
          <div className="space-y-4">
            <FormInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
              className="focus:ring-primary-200"
            />
            
            <FormSelect
              label="Link to Course (Optional)"
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
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <Button 
              onClick={onClose}
              className="bg-gray-100 dark:text-white-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!title.trim()}
              className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}