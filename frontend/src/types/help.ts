export interface HelpAnnouncement {
  id: string;
  title: string;
  contact_method: 'email' | 'phone';
  contact_value: string;
  status: 'open' | 'closed';
  user_id: string;
  created_at: string;
  full_name?: string;  // Added optional fields for user profile
  image_url?: string;
  categorie: string;
}

export interface CreateHelpAnnouncement {
  title: string;
  contact_method: 'email' | 'phone';
  contact_value?: string; // Optional: fallback to user email if not provided and contact_method is email
  status?: 'open' | 'closed';
  categorie: string;
}

export interface UpdateHelpAnnouncement {
  title?: string;
  contact_method?: 'email' | 'phone';
  contact_value?: string;
  status?: 'open' | 'closed';
  categorie?: string;
}