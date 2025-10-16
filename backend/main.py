from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.auth.routes import router as auth_router
from api.profiles.routes import router as profile_router
from api.courses.routes import router as course_router
from api.files.routes import router as file_router
from api.planing.route import router as planing_router  # import the planing router
from api.notes.routes import router as notes_router
from api.AIChat.routes import router as Airouter
from api.tasks.routes import router as tasks_router
from api.announcements.routes import router as announcements_router
app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(

    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(announcements_router, prefix="/announcements", tags=["announcements"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(notes_router, prefix="/notes", tags=["notes"])
app.include_router(course_router, prefix="/courses", tags=["courses"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(profile_router, prefix="/profiles", tags=["profiles"])
app.include_router(file_router, prefix="/files", tags=["files"])
app.include_router(planing_router, prefix="/planing", tags=["planing"])
app.include_router(Airouter, prefix="/ai", tags=["ai"])
@app.get("/")
def root():
    return {"message": "API is running"}