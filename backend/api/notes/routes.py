from fastapi import APIRouter, Depends, File, UploadFile,HTTPException
from typing import List
from core.database import supabase
from core.security import get_current_user
from models.profile import ProfileData
from api.notes.Schemas import NoteCreate, NoteOut, NoteUpdate
from api.courses.schemas import CourseOut
from fastapi import Body
from slugify import slugify
from urllib.parse import urlparse
import os

router = APIRouter()
def sanitize_filename(filename: str) -> str:
    """Sanitize the filename to be safe for storage and avoid invalid characters."""
    name, ext = os.path.splitext(filename)
    clean_name = slugify(name)  # Use slugify to clean the filename
    return f"{clean_name}{ext}"

# Image upload endpoint
@router.post("/upload_image/{note_id}")
async def upload_image(
    note_id: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    """Handle image upload for a specific note."""
    try:
        # Verify the note exists and belongs to the current user
        note_result = supabase.table("notes").select("user_id").eq("id", note_id).execute()
        if not note_result.data:
            raise HTTPException(status_code=404, detail="Note not found")
        if note_result.data[0]['user_id'] != user["id"]:
            raise HTTPException(status_code=403, detail="User is not the owner")

        # Process file
        file_content = await file.read()
        safe_file_name = sanitize_filename(file.filename)
        file_path = f"notes/{note_id}/{safe_file_name}"

        # Upload the file to Supabase Storage (filesb bucket)
        upload_result = supabase.storage.from_("filesb").upload(
            file_path,
            file_content,
            {"content-type": file.content_type}
        )

        if isinstance(upload_result, dict) and 'error' in upload_result:
            raise HTTPException(status_code=400, detail=upload_result['error'])

        # Save image metadata in the database (notes_files table)
        file_data = {
            "note_id": note_id,
            "file_name": safe_file_name,
            "file_path": file_path,
            "file_type": file.content_type,
            "file_size": len(file_content),
        }
        insert_result = supabase.table("notes_files").insert(file_data).execute()
        if not insert_result.data:
            raise HTTPException(status_code=400, detail="Failed to save image metadata")

        return {"message": "Image uploaded successfully", "file_data": insert_result.data[0]}

    except HTTPException as he:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/create_note", response_model=NoteOut)
async def create_note(note: NoteCreate, user=Depends(get_current_user)):
    """Create a new note linked to a course for the current user"""
    try:
        # Validate course_id exists if provided
        if note.course_id:
            course = supabase.table("courses")\
                .select("*")\
                .eq("id", note.course_id)\
                .maybe_single()\
                .execute()
            
            if not course.data:
                raise HTTPException(
                    status_code=400, 
                    detail="Course not found"
                )

        # Prepare note data with properly structured content
        note_data = {
            "user_id": user["id"],
            "title": note.title,
            "content": note.content,  # Already validated by Pydantic
            "course_id": note.course_id,
        }

        # Insert note into database
        result = supabase.table("notes").insert(note_data).execute()

        if not result.data:
            raise HTTPException(
                status_code=400, 
                detail="Failed to create note"
            )

        return result.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Error creating note: {str(e)}"
        )

@router.get("/get_notes", response_model=List[NoteOut])
async def list_user_notes(user=Depends(get_current_user)):
    """Get all notes for the current user"""
    try:
        # Retrieve notes for the current user
        result = supabase.table("notes")\
            .select("*")\
            .eq("user_id", user["id"])\
            .order("created_at", desc=True)\
            .execute()
        return result.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_note/{note_id}", response_model=NoteOut)
async def get_note(note_id: str, user=Depends(get_current_user)):
    """Get a specific note by ID for the current user"""
    try:
        result = supabase.table("notes")\
            .select("*")\
            .eq("id", note_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Note not found")

        return result.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/edit_note/{note_id}", response_model=NoteOut)
async def edit_note(note_id: str, note_data: NoteUpdate, user=Depends(get_current_user)):
    print("notedata", note_data)
    """Update an existing note owned by the user"""
    try:
        # Verify note ownership
        existing_note = supabase.table("notes")\
            .select("*")\
            .eq("id", note_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()

        if not existing_note.data:
            raise HTTPException(status_code=404, detail="Note not found")

        # Prepare update data - ensure content is properly handled
        update_data = {
            "title": note_data.title,
            "content": note_data.content or {"type": "doc", "content": []},
            "course_id": note_data.course_id
        }

        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        # Update note
        updated_note = supabase.table("notes")\
            .update(update_data)\
            .eq("id", note_id)\
            .execute()

        if not updated_note.data:
            raise HTTPException(status_code=400, detail="Update failed")

        return updated_note.data[0]

    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Error updating note: {str(e)}"
        )



@router.delete("/delete_note/{note_id}")
async def delete_note(note_id: str, user=Depends(get_current_user)):
    """Delete a note owned by the user"""
    try:
        # Check if note exists and belongs to the user
        note = supabase.table("notes")\
            .select("*")\
            .eq("id", note_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()

        if not note.data:
            raise HTTPException(status_code=404, detail="Note not found")

        # Delete associated files if any (assuming files are stored in a related "files" table)
        files = supabase.table("files")\
            .select("*")\
            .eq("note_id", note_id)\
            .execute()

        if files.data:
            paths = [f["file_path"] for f in files.data]
            supabase.storage.from_("filesb").remove(paths)
            supabase.table("files").delete().eq("note_id", note_id).execute()

        # Delete the note
        supabase.table("notes").delete().eq("id", note_id).execute()

        return {"message": "Note deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_notes_by_course/{course_id}", response_model=List[NoteOut])
async def get_notes_by_course(course_id: str, user=Depends(get_current_user)):
    """Get all notes for a specific course"""
    try:
        # Get all notes for the given course
        result = supabase.table("notes")\
            .select("*")\
            .eq("course_id", course_id)\
            .eq("user_id", user["id"])\
            .order("created_at", desc=True)\
            .execute()

        return result.data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.delete("/delete_image")
async def delete_image(
    url: str = Body(..., embed=True),
    user=Depends(get_current_user)
):
    """
    Delete an image from storage and its metadata from database.
    """
    try:
        # Parse URL and extract file path
        url_obj = urlparse(url)
        path_parts = url_obj.path.split('/filesb/')
        if len(path_parts) < 2:
            raise HTTPException(status_code=400, detail="Invalid image URL format")
        
        file_path = path_parts[1].lstrip('/')
        
        # 1. First verify the image exists and belongs to user
        file_record = supabase.table("notes_files") \
            .select("note_id, file_path") \
            .eq("file_path", file_path) \
            .maybe_single() \
            .execute()

        if not file_record.data:
            raise HTTPException(status_code=404, detail="Image record not found")

        # 2. Verify note ownership
        note = supabase.table("notes") \
            .select("user_id") \
            .eq("id", file_record.data["note_id"]) \
            .maybe_single() \
            .execute()

        if not note.data or note.data["user_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")

        # 3. Delete from storage
        try:
            # Supabase Python client v2 returns a list of results
            storage_result = supabase.storage.from_("filesb").remove([file_path])
            
            # Check if we got an error response
            if isinstance(storage_result, dict) and storage_result.get("error"):
                raise Exception(storage_result["error"])
            
            # If it's a list, check for any errors
            if isinstance(storage_result, list):
                for item in storage_result:
                    if isinstance(item, dict) and item.get("error"):
                        raise Exception(item["error"])
        except Exception as storage_error:
            raise HTTPException(
                status_code=400,
                detail=f"Storage deletion failed: {str(storage_error)}"
            )

        # 4. Delete metadata
        db_response = supabase.table("notes_files") \
            .delete() \
            .eq("file_path", file_path) \
            .execute()

        if not db_response.data:
            raise HTTPException(
                status_code=400,
                detail="Failed to delete image metadata"
            )

        return {
            "message": "Image deleted successfully",
            "deleted_path": file_path
        }

    except HTTPException as he:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting image: {str(e)}"
        )