'use client';
import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/use-notes-query';
import Button from '@/components/ui/Button';
import CreateNoteModal from '@/components/notes/CreateNoteModal';
import NoteItem from '@/components/notes/NoteItem';
import FormInput from '@/components/ui/FormInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NoteEditor from '@/components/notes/NoteEditor';
import { Plus, Search, BookOpen, Clock, Tag, AlertCircle, Pin, PinOff, Filter } from 'lucide-react';
import type { NoteOut } from '@/types/notes';
import PageContainer from '@/components/ui/PageContainer';
import { useTranslation } from 'react-i18next';

export default function NotesPage() {
  const { notes = [], loading, error } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteOut | null>(null);
  const [pinnedNotes, setPinnedNotes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const storedCourses = localStorage.getItem('user_courses');
    const storedPinnedNotes = localStorage.getItem('pinned_notes');
    if (storedCourses) {
      setUserCourses(JSON.parse(storedCourses));
    }
    if (storedPinnedNotes) {
      setPinnedNotes(JSON.parse(storedPinnedNotes));
    }
  }, []);

  const togglePinNote = (noteId: string) => {
    setPinnedNotes(prev => {
      const newPinnedNotes = prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId];
      localStorage.setItem('pinned_notes', JSON.stringify(newPinnedNotes));
      return newPinnedNotes;
    });
  };

  const categories = Array.from(new Set(notes.map(note => note.course_id).filter(Boolean)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || note.course_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const aIsPinned = pinnedNotes.includes(a.id);
    const bIsPinned = pinnedNotes.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const handleNoteClick = (note: NoteOut) => {
    setSelectedNote(note);
  };

  const handleCloseEditor = () => {
    setSelectedNote(null);
  };

  const getCourseName = (courseId: string | null) => {
    if (!courseId) return null;
    const course = userCourses.find(c => c.id === courseId);
    return course?.title || null;
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          {selectedNote ? (
            <NoteEditor 
              note={selectedNote} 
              onClose={handleCloseEditor} 
              courses={userCourses}
            />
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-600 mb-4">
                  {t('pageTitles.notes')}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  {t('pageTitles.notesDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={t('searchNotes', 'Search notes...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <Filter className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{t('filters', 'Filters')}</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-white rounded-xl shadow-soft animate-fade-in">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === null
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t('allNotes', 'All Notes')}
                    </button>
                    {categories.map(courseId => (
                      <button
                        key={courseId}
                        onClick={() => setSelectedCategory(courseId)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === courseId
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getCourseName(courseId)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl animate-fade-in flex items-center gap-2 max-w-2xl mx-auto">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {sortedNotes.map(note => (
                    <div 
                      key={note.id} 
                      className="animate-fade-in transform hover:scale-[1.02] transition-all duration-200"
                    >
                      <div 
                        onClick={() => handleNoteClick(note)}
                        className="bg-white rounded-xl shadow-soft hover:shadow-hover p-6 cursor-pointer h-full flex flex-col border border-gray-100 hover:border-primary-100 transition-all duration-200 relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinNote(note.id);
                          }}
                          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={pinnedNotes.includes(note.id) ? t('unpinNote', 'Unpin note') : t('pinNote', 'Pin note')}
                        >
                          {pinnedNotes.includes(note.id) ? (
                            <Pin className="h-4 w-4 text-primary-500" />
                          ) : (
                            <PinOff className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <div className="flex items-start justify-between mb-4 pr-8">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                              {note.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                              {note.content.type === 'doc' && note.content.content
                                ? note.content.content.map((item: any) => item.text || '').join(' ')
                                : ''}
                            </p>
                          </div>
                          {note.course_id && (
                            <span className="ml-2 px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full whitespace-nowrap">
                              {getCourseName(note.course_id)}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto pt-4 flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(note.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {note.content.type === 'doc' && note.content.content
                                ? Math.ceil(note.content.content.length / 100)
                                : 0} {t('minRead', 'min read')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Floating Action Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-50"
                aria-label={t('createNewNote', 'Create new note')}
              >
                <Plus className="h-6 w-6" />
              </button>

              <CreateNoteModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                courses={userCourses}
              />
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}