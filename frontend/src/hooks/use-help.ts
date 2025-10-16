import { useState, useEffect } from 'react';
import {
  createHelpAnnouncement,
  getOpenAnnouncements,
  getMyAnnouncements,
  updateHelpAnnouncement,
  deleteHelpAnnouncement,
  HelpAnnouncement,
  CreateHelpAnnouncement,
  toggleHelpAnnouncementStatus,
  UpdateHelpAnnouncement,
} from '@/lib/api/help';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<HelpAnnouncement[]>([]);
  const [myAnnouncements, setMyAnnouncements] = useState<HelpAnnouncement[]>([]);
  
  // Separate loading states for each operation
  const [loadingOpenAnnouncements, setLoadingOpenAnnouncements] = useState<boolean>(false);
  const [loadingMyAnnouncements, setLoadingMyAnnouncements] = useState<boolean>(false);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // Fetch all open announcements excluding the current user
  const fetchOpenAnnouncements = async () => {
    setLoadingOpenAnnouncements(true);
    try {
      const data = await getOpenAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      setError(`Failed to fetch open announcements: ${err.message}`);
    } finally {
      setLoadingOpenAnnouncements(false);
    }
  };
  // Toggle announcement status (open/closed)
const toggleAnnouncementStatus = async (announcementId: string) => {
  try {
    const updatedAnnouncement = await toggleHelpAnnouncementStatus(announcementId);
    
    // Update both lists if needed, preserving all fields
    setAnnouncements((prev) =>
      prev.map((a) => 
        a.id === updatedAnnouncement.id 
          ? { ...a, ...updatedAnnouncement, categorie: a.categorie } 
          : a
      )
    );
    setMyAnnouncements((prev) =>
      prev.map((a) => 
        a.id === updatedAnnouncement.id 
          ? { ...a, ...updatedAnnouncement, categorie: a.categorie } 
          : a
      )
    );
  } catch (err: any) {
    setError(`Failed to toggle status: ${err.message}`);
  }
};

  // Fetch current user's announcements
  const fetchMyAnnouncements = async () => {
    setLoadingMyAnnouncements(true);
    try {
      const data = await getMyAnnouncements();
      setMyAnnouncements(data);
    } catch (err: any) {
      setError(`Failed to fetch your announcements: ${err.message}`);
    } finally {
      setLoadingMyAnnouncements(false);
    }
  };

  // Create a new help announcement
  const createAnnouncement = async (data: CreateHelpAnnouncement) => {
    setLoadingCreate(true);
    try {
      const newAnnouncement = await createHelpAnnouncement(data);
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    } catch (err: any) {
      setError(`Failed to create announcement: ${err.message}`);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Update an existing help announcement
  const updateAnnouncement = async (announcementId: string, data: UpdateHelpAnnouncement) => {
    console.log("data,", data);
    setLoadingUpdate(true);
    try {
      const updatedAnnouncement = await updateHelpAnnouncement(announcementId, data);
      // Update both lists to ensure consistency
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === updatedAnnouncement.id 
            ? { ...announcement, ...updatedAnnouncement }
            : announcement
        )
      );
      setMyAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === updatedAnnouncement.id 
            ? { ...announcement, ...updatedAnnouncement }
            : announcement
        )
      );
    } catch (err: any) {
      setError(`Failed to update announcement: ${err.message}`);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Delete an announcement
  const deleteAnnouncement = async (announcementId: string) => {
    setLoadingDelete(true);
    try {
      await deleteHelpAnnouncement(announcementId);
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== announcementId));
    } catch (err: any) {
      setError(`Failed to delete announcement: ${err.message}`);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Fetch announcements on component mount
  useEffect(() => {
    fetchOpenAnnouncements();
    fetchMyAnnouncements();
  }, []);  // Runs only once on component mount

  return {
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
    deleteAnnouncement,
    toggleAnnouncementStatus,
  };
}
