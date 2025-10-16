from supabase import create_client
import os
from core.config import settings  # Import settings from the configuration file

class SupabaseClient:
    def __init__(self):
        self.client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
    
    def get_client(self):
        return self.client

# Singleton instance
supabase = SupabaseClient().get_client()
