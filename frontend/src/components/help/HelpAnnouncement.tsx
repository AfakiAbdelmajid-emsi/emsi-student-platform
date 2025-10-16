"use client";
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { AnnouncementCard } from './AnnouncementCard';
import { AnnouncementForm } from './AnnouncementForm';
import { SearchAndFilter } from './SearchAndFilter';
import { useAnnouncements } from '@/hooks/use-help';
import type { HelpAnnouncement as HelpAnnouncementType, CreateHelpAnnouncement, UpdateHelpAnnouncement } from '@/types/help';
import { useTranslation } from 'react-i18next';

export const HelpAnnouncement = ({ userEmail }: { userEmail: string }) => {
  const { t } = useTranslation('common');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const {
    announcements,
    myAnnouncements,
    loadingOpenAnnouncements,
    loadingMyAnnouncements,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
    createAnnouncement,
    updateAnnouncement,
    toggleAnnouncementStatus,
    deleteAnnouncement,
  } = useAnnouncements();

  const handleCreateAnnouncement = async (data: CreateHelpAnnouncement) => {
    await createAnnouncement(data);
    setIsCreating(false);
  };

  const handleUpdateAnnouncement = async (data: CreateHelpAnnouncement) => {
    if (editingId) {
      await updateAnnouncement(editingId, data as UpdateHelpAnnouncement);
      setEditingId(null);
    }
  };

  const handleCloseAnnouncement = async (id: string) => {
    await toggleAnnouncementStatus(id);
  };

  const handleEdit = (id: string) => {
    const announcement = myAnnouncements.find(a => a.id === id);
    if (announcement) {
      setEditingId(id);
    }
  };

  const handleContact = (announcement: HelpAnnouncementType) => {
    // Just pass the announcement to the card component
    // The card will handle displaying the contact info
  };

  const filteredAnnouncements = (activeTab === 'all' ? announcements : myAnnouncements)
    .filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">

        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loadingCreate}
        >
          {t('createAnnouncement', 'Create Announcement')}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'all'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {t('allAnnouncements', 'All Announcements')}
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'my'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {t('myAnnouncements', 'My Announcements')}
        </button>
      </div>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading States */}
      {(loadingOpenAnnouncements || loadingMyAnnouncements) && (
        <div className="text-center py-4">
          {t('loadingAnnouncements', 'Loading announcements...')}
        </div>
      )}

      {/* Create/Edit Announcement Modal */}
      {(isCreating || editingId) && (
        <AnnouncementForm
          userEmail={userEmail}
          onSubmit={editingId ? handleUpdateAnnouncement : handleCreateAnnouncement}
          onCancel={() => {
            setIsCreating(false);
            setEditingId(null);
          }}
          initialData={editingId ? myAnnouncements.find(a => a.id === editingId) : undefined}
          isEditing={!!editingId}
        />
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            activeTab={activeTab}
            onEdit={handleEdit}
            onClose={handleCloseAnnouncement}
            onContact={handleContact}
            {...(activeTab === 'my' ? { onDelete: deleteAnnouncement } : {})}
          />
        ))}
        {filteredAnnouncements.length === 0 && !loadingOpenAnnouncements && !loadingMyAnnouncements && (
          <div className="text-center py-8 text-gray-500">
            {t('noAnnouncementsFound', 'No announcements found')}
          </div>
        )}
      </div>
    </div>
  );
}; 