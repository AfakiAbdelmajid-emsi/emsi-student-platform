import { useState, useEffect } from 'react';
import { useCourses } from './use-courses-query';
import { useFiles } from './use-files-query';
import { useNotes } from './use-notes-query';

export const useCoursePage = (courseId: string) => {
  const { getCourseById } = useCourses();
  const { files, uploadFile } = useFiles();
  const { notes, loadNotes } = useNotes();
  const course = getCourseById(courseId);

  const [showEditForm, setShowEditForm] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [recentlyOpened, setRecentlyOpened] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'files' | 'notes'>('files');

  useEffect(() => {
    // Load pinned items from localStorage
    const storedPinnedItems = localStorage.getItem(`pinned-items-${courseId}`);
    if (storedPinnedItems) {
      setPinnedItems(JSON.parse(storedPinnedItems));
    }

    // Load recently opened items from localStorage
    const storedRecentlyOpened = localStorage.getItem(`recently-opened-${courseId}`);
    if (storedRecentlyOpened) {
      setRecentlyOpened(JSON.parse(storedRecentlyOpened));
    }

    // Load notes for this course
    loadNotes(courseId);
  }, [courseId, loadNotes]);

  const handleTogglePin = (itemId: string) => {
    setPinnedItems((prev) => {
      const newPinnedItems = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem(`pinned-items-${courseId}`, JSON.stringify(newPinnedItems));
      return newPinnedItems;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file, courseId);
    }
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  return {
    course,
    showEditForm,
    setShowEditForm,
    pinnedItems,
    recentlyOpened,
    activeTab,
    setActiveTab,
    files,
    notes,
    handleTogglePin,
    handleFileUpload,
    handleEditSuccess,
  };
}; 