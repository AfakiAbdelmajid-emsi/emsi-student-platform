import client from './client';
import { HelpAnnouncement, CreateHelpAnnouncement, UpdateHelpAnnouncement } from '@/types/help';


// Create a new help announcement
export async function createHelpAnnouncement(data: CreateHelpAnnouncement): Promise<HelpAnnouncement> {
  try {
    const response = await client('/announcements/create-announcements', {
      method: 'POST',
      data,
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error creating announcement: ${error.message}`);
  }
}

// Get all open announcements (excluding current user)
export async function getOpenAnnouncements(): Promise<HelpAnnouncement[]> {
  try {
    const response = await client('/announcements/announcements', {
      method: 'GET',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error fetching announcements: ${error.message}`);
  }
}
// Toggle open/closed status of an announcement
export async function toggleHelpAnnouncementStatus(announcementId: string): Promise<HelpAnnouncement> {
  try {
    const response = await client(`/announcements/toggle_status/${announcementId}`, {
      method: 'PATCH',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error toggling status: ${error.message}`);
  }
}

// Get current user's announcements
export async function getMyAnnouncements(): Promise<HelpAnnouncement[]> {
  try {
    const response = await client('/announcements/my_announcements', {
      method: 'GET',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error fetching my announcements: ${error.message}`);
  }
}

// Update an announcement
export async function updateHelpAnnouncement(announcementId: string, data: UpdateHelpAnnouncement): Promise<HelpAnnouncement> {
  try {
    const response = await client(`/announcements/update_announcements/${announcementId}`, {
      method: 'PUT',
      data,
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error updating announcement: ${error.message}`);
  }
}

// Delete an announcement
export async function deleteHelpAnnouncement(announcementId: string): Promise<{ message: string }> {
  try {
    const response = await client(`/announcements/delet_announcements/${announcementId}`, {
      method: 'DELETE',
      responseType: 'json',
    });
    return response;
  } catch (error: any) {
    throw new Error(`Error deleting announcement: ${error.message}`);
  }
}
