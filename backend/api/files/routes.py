from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from core.database import supabase
from core.security import get_current_user
from slugify import slugify
import os

router = APIRouter()
def sanitize_filename(filename: str) -> str:
    """Sanitize the filename to be safe for storage and avoid invalid characters."""
    name, ext = os.path.splitext(filename)
    clean_name = slugify(name)  # Use slugify to clean the filename
    return f"{clean_name}{ext}"

@router.post("/upload_file/{course_id}")
async def upload_file(
    course_id: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    """Handle file upload for a specific course."""
    try:
        # Verify course ownership
        course_result = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not course_result.data:
            raise HTTPException(status_code=404, detail="Course not found")
        if course_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        # Process file
        file_content = await file.read()
        safe_file_name = sanitize_filename(file.filename)
        file_path = f"courses/{course_id}/{safe_file_name}"

        # Upload to Supabase
        upload_result = supabase.storage.from_('filesb').upload(
            file_path,
            file_content,
            {"content-type": file.content_type}
        )

        if isinstance(upload_result, dict) and 'error' in upload_result:
            raise HTTPException(status_code=400, detail=upload_result['error'])

        # Save metadata
        file_data = {
            "course_id": course_id,
            "file_name": safe_file_name,
            "file_path": file_path,
            "file_type": file.content_type,
            "file_size": len(file_content),
        }
        insert_result = supabase.table("files").insert(file_data).execute()
        if not insert_result.data:
            raise HTTPException(status_code=400, detail="Failed to save metadata")

        return {"message": "File uploaded successfully", "file_data": insert_result.data[0]}

    except HTTPException as he:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        
@router.get("/get_files/{course_id}")
async def get_course_files(
    course_id: str,
    user=Depends(get_current_user)
):
    """Get all files for a course (without icons)."""
    try:
        # 1. Verify course ownership
        course_result = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not course_result.data:
            raise HTTPException(status_code=404, detail="Course not found")
        if course_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        # 2. Fetch all files for this course
        files_result = supabase.table("files").select("*").eq("course_id", course_id).execute()
        
        return {"files": files_result.data or []}  # Return empty list if no files

    except HTTPException as he:
        print(f"HTTP Exception: {he.detail}")
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
@router.get("/generate_preview_url/{course_id}/{file_name}")
async def generate_preview_url(
    course_id: str,
    file_name: str,
    user=Depends(get_current_user)
):
    """Generate a signed URL for previewing a file."""
    try:
        # Verify course ownership
        course_result = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not course_result.data:
            raise HTTPException(status_code=404, detail="Course not found")
        if course_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        # Verify file exists
        file_result = supabase.table("files").select("*").eq("course_id", course_id).eq("file_name", file_name).execute()
        if not file_result.data:
            raise HTTPException(status_code=404, detail="File not found")

        # Generate signed URL (expires in 1 hour)
        file_path = file_result.data[0]['file_path']
        signed_url = supabase.storage.from_('filesb').create_signed_url(file_path, 3600)
        
        if isinstance(signed_url, dict) and 'error' in signed_url:
            raise HTTPException(status_code=400, detail=signed_url['error'])

        return {"url": signed_url['signedURL']}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/generate_download_url/{course_id}/{file_name}")
async def generate_download_url(
    course_id: str,
    file_name: str,
    user=Depends(get_current_user)
):
    """Generate a signed URL for downloading a file."""
    try:
        # Same verification as preview URL
        course_result = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not course_result.data:
            raise HTTPException(status_code=404, detail="Course not found")
        if course_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        file_result = supabase.table("files").select("*").eq("course_id", course_id).eq("file_name", file_name).execute()
        if not file_result.data:
            raise HTTPException(status_code=404, detail="File not found")

        file_path = file_result.data[0]['file_path']
        signed_url = supabase.storage.from_('filesb').create_signed_url(file_path, 3600)
        
        if isinstance(signed_url, dict) and 'error' in signed_url:
            raise HTTPException(status_code=400, detail=signed_url['error'])

        return {"url": signed_url['signedURL']}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# api/files.py
@router.delete("/delete_file/{course_id}/{file_id}")
async def delete_file(
    course_id: str,
    file_id: str,
    user=Depends(get_current_user)
):
    try:
        # Verify course ownership
        course_result = supabase.table("courses").select("user_id").eq("id", course_id).execute()
        if not course_result.data:
            raise HTTPException(status_code=404, detail="Course not found")
        if course_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        # Get file metadata
        file_result = supabase.table("files").select("*").eq("id", file_id).execute()
        if not file_result.data:
            raise HTTPException(status_code=404, detail="File not found")

        file_data = file_result.data[0]

        # Delete from storage
        delete_result = supabase.storage.from_('filesb').remove([file_data['file_path']])
        if isinstance(delete_result, dict) and 'error' in delete_result:
            raise HTTPException(status_code=400, detail=delete_result['error'])

        # Delete from database
        supabase.table("files").delete().eq("id", file_id).execute()

        return {"message": "File deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 