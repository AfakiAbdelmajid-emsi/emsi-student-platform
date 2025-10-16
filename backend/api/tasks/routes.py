from fastapi import APIRouter, HTTPException, Depends
from typing import List
from core.database import supabase
from core.security import get_current_user
from api.tasks.shemas import Task,TaskCreate  # Make sure this import matches the file structure

router = APIRouter()
# Create Task
@router.post("/create_task", response_model=Task)  # Response model is Task, request model is TaskCreate
async def create_task(task: TaskCreate, user=Depends(get_current_user)):
    try:
        task_data = {
            "user_id": user["id"],
            "title": task.title.strip(),
            "description": task.description,
            "category": task.category,
            "due_date": task.due_date,
            "completed": task.completed
        }
        
        response = supabase.table("tasks").insert(task_data).execute()

        if not response.data:
            raise HTTPException(status_code=400, detail="Task creation failed")

        return response.data[0]  # This will return the created task, including the generated task_id

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

# Get All Tasks for the Current User
@router.get("/get_tasks", response_model=List[Task])
async def get_tasks(user=Depends(get_current_user)):
    try:
        response = supabase.table("tasks").select("*").eq("user_id", user["id"]).execute()

        if not response.data:
            return []

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")


# Update Task
@router.put("/update_task/{task_id}", response_model=Task)
async def update_task(task_id: str, task: Task, user=Depends(get_current_user)):
    try:
        # Check if task exists and belongs to the user
        response = supabase.table("tasks").select("*").eq("task_id", task_id).eq("user_id", user["id"]).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found or does not belong to the user")

        task_data = {
            "title": task.title.strip(),
            "description": task.description,
            "category": task.category,
            "due_date": task.due_date,
            "completed": task.completed
        }

        result = supabase.table("tasks").update(task_data).eq("task_id", task_id).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Task update failed")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")


# Delete Task
@router.delete("/delete_task/{task_id}", response_model=dict)
async def delete_task(task_id: str, user=Depends(get_current_user)):
    try:
        # Check if the task exists and belongs to the user
        response = supabase.table("tasks").select("*").eq("task_id", task_id).eq("user_id", user["id"]).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found or does not belong to the user")

        result = supabase.table("tasks").delete().eq("task_id", task_id).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Task deletion failed")

        return {"message": "Task deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")
