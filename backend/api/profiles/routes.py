from fastapi import APIRouter, Request, HTTPException, status, Depends, File, UploadFile
from core.database import supabase
from core.utils import get_session_from_request, create_redirect_response
from models.profile import ProfileData
from core.config import settings
from core.security import get_current_user

router = APIRouter()

@router.post("/complete-profile")
async def complete_profile(profile_data: ProfileData, request: Request):
    access_token, refresh_token = get_session_from_request(request)
    supabase.auth.set_session(access_token, refresh_token)
    
    try:
        user = supabase.auth.get_user(access_token).user
        user_id = user.id
        print(f"User ID: {user_id}")  # Debugging line to check user ID
        email = user.email  # Extract email from auth user object
        print(f"User Email: {email}")  # Debugging line to check user email
        profile = {
            "id": user_id,
            "email": email,  # Automatically use email from auth
            "full_name": profile_data.full_name.strip(),
            "academic_level": profile_data.academic_level.value,
            "specialization": profile_data.specialization.value if profile_data.specialization else None,
            "is_anonymous": profile_data.is_anonymous
        }

        if profile_data.image_url:
            profile["image_url"] = profile_data.image_url

        supabase.table("profiles").upsert(profile).execute()

        supabase.auth.update_user({"data": {"profile_complete": True}})
        session = supabase.auth.refresh_session()
        return create_redirect_response(session.session)

    except Exception as e:
        raise HTTPException(400, detail=str(e))



@router.get("/me")
async def get_current_profile(user=Depends(get_current_user)):
    try:
        response = supabase.table("profiles")\
            .select("*")\
            .eq("id", user["id"])\
            .execute()

        if not response.data:
            return {"profile_complete": False}

        profile = response.data[0]  # Fix: access first item

        return {
            "full_name": profile.get("full_name", ""),
            "academic_level": profile.get("academic_level"),
            "specialization": profile.get("specialization"),
            "is_anonymous": profile.get("is_anonymous", False),
            "email": profile.get("email"),
            "image_url": profile.get("image_url"),
            "profile_complete": True
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.put("/update-profile")
async def update_profile(profile_data: ProfileData, user=Depends(get_current_user)):
    try:
        update_data = {
            "full_name": profile_data.full_name.strip(),
            "academic_level": profile_data.academic_level.value,
            "specialization": profile_data.specialization.value if profile_data.specialization else None,
            "is_anonymous": profile_data.is_anonymous
        }

        if profile_data.image_url:
            update_data["image_url"] = profile_data.image_url

        result = supabase.table("profiles")\
            .update(update_data)\
            .eq("id", user["id"])\
            .execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Profile update failed")

        return {"message": "Profile updated successfully", "profile": result.data[0]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")


@router.delete("/delete-profile")
async def delete_profile(user=Depends(get_current_user)):
    try:
        result = supabase.table("profiles")\
            .delete()\
            .eq("id", user["id"])\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found or already deleted")

        return {"message": "Profile deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting profile: {str(e)}")


@router.post("/upload-profile-image")
async def upload_profile_image(file: UploadFile = File(...), user=Depends(get_current_user)):
    try:
        file_content = await file.read()
        file_ext = file.filename.split('.')[-1]
        file_path = f"profiles/{user['id']}/profile.{file_ext}"

        upload_result = supabase.storage.from_("filesb").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )

        if isinstance(upload_result, dict) and upload_result.get("error"):
            raise HTTPException(status_code=400, detail=upload_result["error"])

        public_url = supabase.storage.from_("filesb").get_public_url(file_path)
        supabase.table("profiles").update({"image_url": public_url}).eq("id", user["id"]).execute()

        return {"message": "Image uploaded successfully", "image_url": public_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
