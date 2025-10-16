from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID
from core.database import supabase
from core.security import get_current_user
from api.announcements.schemas import HelpAnnouncementCreate, HelpAnnouncementUpdate
router = APIRouter()

# --- SCHEMAS ---



# --- ROUTES ---

@router.post("/create-announcements", status_code=201)
async def create_announcement(data: HelpAnnouncementCreate, user=Depends(get_current_user)):
    try:
        # Fallback to user's email if method is email and no value was provided
        contact_value = data.contact_value
        if data.contact_method == "email" and not contact_value:
            contact_value = user["email"]

        result = supabase.table("help_announcements").insert({
            "title": data.title,
            "contact_method": data.contact_method,
            "contact_value": contact_value,
            "status": data.status,
            "user_id": user["id"],
            "categorie": data.categorie
        }).execute()

        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/announcements", response_model=List[dict])
async def get_open_announcements_excluding_user(user=Depends(get_current_user)):
    try:
        # Fetch all open announcements excluding the user's own
        result = supabase.table("help_announcements") \
            .select("id, title, contact_value, status, contact_method,user_id, created_at, categorie") \
            .eq("status", "open") \
            .neq("user_id", user["id"]) \
            .order("created_at", desc=True) \
            .execute()

        # Fetch user profiles (full_name and image_url) for each announcement's user_id
        announcements = result.data
        for announcement in announcements:
            user_profile = supabase.table("profiles") \
                .select("full_name, image_url") \
                .eq("id", announcement["user_id"]) \
                .execute()

            if user_profile.data:
                announcement["full_name"] = user_profile.data[0].get("full_name", "")
                announcement["image_url"] = user_profile.data[0].get("image_url", "")

        return announcements
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my_announcements", response_model=List[dict])
async def list_announcements(user=Depends(get_current_user)):
    try:
        # Fetch all user's announcements
        result = supabase.table("help_announcements") \
            .select("id, title, contact_value, status,contact_method, user_id, created_at, categorie") \
            .eq("user_id", user["id"]) \
            .order("created_at", desc=True) \
            .execute()

        # Fetch user profiles (full_name and image_url) for each announcement's user_id
        announcements = result.data
        for announcement in announcements:
            user_profile = supabase.table("profiles") \
                .select("full_name, image_url") \
                .eq("id", announcement["user_id"]) \
                .execute()

            if user_profile.data:
                announcement["full_name"] = user_profile.data[0].get("full_name", "")
                announcement["image_url"] = user_profile.data[0].get("image_url", "")

        return announcements
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/toggle_status/{announcement_id}")
async def toggle_announcement_status(announcement_id: UUID, user=Depends(get_current_user)):
    try:
        # Get the current announcement
        result = supabase.table("help_announcements") \
            .select("status") \
            .eq("id", str(announcement_id)) \
            .eq("user_id", user["id"]) \
            .single() \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Announcement not found")

        current_status = result.data["status"]
        new_status = "closed" if current_status == "open" else "open"

        update_result = supabase.table("help_announcements") \
            .update({"status": new_status}) \
            .eq("id", str(announcement_id)) \
            .eq("user_id", user["id"]) \
            .execute()

        return update_result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update_announcements/{announcement_id}")
async def update_announcement(announcement_id: UUID, data: HelpAnnouncementUpdate, user=Depends(get_current_user)):
    try:
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        result = supabase.table("help_announcements") \
            .update(update_data) \
            .eq("id", str(announcement_id)) \
            .eq("user_id", user["id"]) \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Announcement not found")

        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delet_announcements/{announcement_id}")
async def delete_announcement(announcement_id: UUID, user=Depends(get_current_user)):
    try:
        result = supabase.table("help_announcements") \
            .delete() \
            .eq("id", str(announcement_id)) \
            .eq("user_id", user["id"]) \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Announcement not found")

        return {"message": "Announcement deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
