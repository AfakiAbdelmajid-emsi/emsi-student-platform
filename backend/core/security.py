# core/security.py
from fastapi import Depends, HTTPException, status, Request
from core.database import supabase
from core.config import settings

async def get_current_user(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(401, detail="Access token missing")
    
    try:
        user = supabase.auth.get_user(access_token)
        return {
            "id": user.user.id,
            "email": user.user.email,
            "profile_complete": await get_profile_status(user.user.id)
        }
    except Exception as e:
        raise HTTPException(401, detail=f"Authentication failed: {str(e)}")

async def get_profile_status(user_id: str):
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        return bool(response.data)
    except Exception:
        return False