from fastapi import Body
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from core.database import supabase
from core.security import get_current_user
from api.courses.schemas import CourseCreate, CourseOut
from utils.course_categories import get_categories_by_specialization
from models.profile import ProfileData
from typing import List, Dict,Optional

router = APIRouter()

@router.get("/get_categories", response_model=List[Dict[str, str]])
async def get_my_categories(user=Depends(get_current_user)):
    """Get categories for current user based on their profile"""
    try:
        # Get user profile from database
        profile = supabase.table("profiles")\
            .select("*")\
            .eq("id", user["id"])\
            .single()\
            .execute()
        
        if not profile.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Get categories based only on specialization (academic_level no longer needed)
        specialization_categories = get_categories_by_specialization(
            specialization=profile.data.get("specialization")
        )
        
        # Always add "Other" as an option
        specialization_categories.append({"value": "other", "label": "Other"})
        
        return specialization_categories
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# In your router file
@router.post("/create_course", response_model=CourseCreate)
async def create_course(course: CourseCreate, user=Depends(get_current_user)):
    """Create a new course with simple category validation"""
    try:
        # Get user profile (if still needed for other purposes)
        profile = supabase.table("profiles")\
            .select("*")\
            .eq("id", user["id"])\
            .single()\
            .execute()

        if not profile.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Prepare course data - no special validation for "other"
        course_data = {
            "user_id": user["id"],
            "title": course.title,
            "description": course.description,
            "category": course.category  # Can be None, "other", or any string
        }
        
        # Insert course data
        result = supabase.table("courses").insert(course_data).execute()
        return result.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_courses", response_model=List[CourseOut])
async def list_user_courses(user=Depends(get_current_user)):
    """Get all courses for the current user"""
    try:
        result = supabase.table("courses")\
            .select("*")\
            .eq("user_id", user["id"])\
            .order("created_at", desc=True)\
            .execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/get_course/{course_id}", response_model=CourseOut)
async def get_course(course_id: str, user=Depends(get_current_user)):
    """Get a specific course by ID for the current user"""
    try:
        result = supabase.table("courses")\
            .select("*")\
            .eq("id", course_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.delete("/{course_id}")
async def delete_course(course_id: str, user=Depends(get_current_user)):
    """Delete a course and its associated files"""
    try:
        # Check ownership
        course = supabase.table("courses")\
            .select("*")\
            .eq("id", course_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()
        if not course.data:
            raise HTTPException(status_code=404, detail="Course not found")

        # Delete associated files
        files = supabase.table("files")\
            .select("*")\
            .eq("course_id", course_id)\
            .execute()
        if files.data:
            paths = [f["file_path"] for f in files.data]
            supabase.storage.from_("filesb").remove(paths)
            supabase.table("files").delete().eq("course_id", course_id).execute()

        # Delete course
        supabase.table("courses").delete().eq("id", course_id).execute()
        return {"message": "Course deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
from fastapi import Path
from api.courses.schemas import CourseUpdate  # Create this if not existing

@router.put("/edit_course/{course_id}", response_model=CourseOut)
async def edit_course(
    course_id: str,
    course_data: CourseUpdate,
    user=Depends(get_current_user)
):
    """Update an existing course owned by the user"""
    try:
        # Verify course ownership
        existing = supabase.table("courses")\
            .select("*")\
            .eq("id", course_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Course not found")

        # Update course
        updated = supabase.table("courses")\
            .update(course_data.dict(exclude_unset=True))\
            .eq("id", course_id)\
            .execute()
        return updated.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

