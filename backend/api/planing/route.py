from fastapi import APIRouter, Depends,Response, HTTPException
from typing import List
from core.database import supabase
from core.security import get_current_user
from api.courses.schemas import CourseOut
from api.planing.schemas import ExamCreate, ExamOut
from datetime import datetime
from reportlab.pdfgen import canvas  # Import canvas here
from reportlab.lib.pagesizes import letter  
from fpdf import FPDF
from .pdf_generator import generate_study_plan_pdf
from datetime import date, timedelta
router = APIRouter()

# Endpoint to get course names for a user

@router.post("/add_exam", response_model=ExamOut)
async def add_exam(
    exam: ExamCreate,
    user=Depends(get_current_user)
):
    """Add a new exam without associating it with a course (no course_id)."""
    try:
        exam_data = {
            "title": exam.title,
            "exam_date": exam.exam_date.isoformat(),
            "priority": exam.priority,
            "user_id": user["id"]
        }

        result = supabase.table("exams").insert(exam_data).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to add exam")

        # Return just the exam data (which will be validated against ExamOut)
        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# Endpoint to get all exams for a user
@router.get("/get_exams", response_model=List[ExamOut])
async def get_exams_for_user(user=Depends(get_current_user)):
    """Get all exams for a user."""
    try:
        result = supabase.table("exams")\
            .select("*")\
            .eq("user_id", user["id"])\
            .order("exam_date", desc=True)\
            .execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# Endpoint to delete an exam
@router.delete("/delete_exam/{exam_id}")
async def delete_exam(exam_id: str, user=Depends(get_current_user)):
    """Delete an exam by its ID."""
    try:
        # Check if the exam exists and belongs to the current user
        result = supabase.table("exams")\
            .select("*")\
            .eq("id", exam_id)\
            .eq("user_id", user["id"])\
            .single()\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Exam not found or you are not the owner")

        # Delete the exam
        supabase.table("exams").delete().eq("id", exam_id).execute()

        return {"message": "Exam deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def get_user_exams(user_id: str):
    """Helper function to fetch user's exams"""
    result = supabase.table("exams")\
        .select("*")\
        .eq("user_id", user_id)\
        .gte("exam_date", date.today().isoformat())\
        .order("exam_date")\
        .order("priority", desc=True)\
        .execute()

    return result.data
@router.get("/generate_plan", response_class=Response)
async def generate_study_plan(user=Depends(get_current_user)):
    try:
        exams = await get_user_exams(user["id"])
        if not exams:
            raise HTTPException(status_code=404, detail="No upcoming exams found")

        pdf_content = generate_study_plan_pdf(exams)

        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=weekly_study_plan.pdf"}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating plan: {str(e)}")
