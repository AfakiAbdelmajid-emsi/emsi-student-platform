## AI Study Platform (FastAPI + Next.js)

An AI-assisted study and learning platform with courses, notes, tasks, exams planning (PDF export), file storage, announcements (help board), and an AI chat assistant. The stack uses FastAPI with Supabase (Auth, Postgres, Storage) and a Next.js 15 frontend.

### Tech stack
- Backend: FastAPI, Supabase Python client, Groq LLM
- Frontend: Next.js 15, React 19, TailwindCSS, React Query, TipTap editor
- Auth & Data: Supabase Auth, Postgres, Storage bucket `filesb`

---

## Monorepo structure
- `backend/`: FastAPI app (`backend/main.py`) mounting routers under prefixes
- `frontend/`: Next.js application (cookies-based session, middleware guards)
- `supabase/`: Edge functions and configs (e.g. `delete_expired_exams`)

---

## Quick start

### Prerequisites
- Python 3.13
- Node.js 20+
- Supabase project (URL, service role or anon key), Storage bucket `filesb`
- Groq API key (for AI chat)

### 1) Backend setup
```powershell
cd backend
python -m venv venv
venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt

# Create .env (see Environment variables below)
copy NUL .env

# Run API
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`.

### 2) Frontend setup
```powershell
cd frontend
npm install

# .env.local (optional) to point to API
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 > .env.local

npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Environment variables

### Backend (`backend/.env`)
```env
# App
ENVIRONMENT=development
PROJECT_NAME=AI Study Platform
SITE_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_or_anon_key

# OAuth (if used by your flow)
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/auth/callback

# AI
GROQ_API_KEY=your_groq_api_key
```

Notes
- CORS is allowed for `http://localhost:3000` by default in `core/config.py`.
- Storage bucket `filesb` must exist in Supabase Storage.
- Tables used: `profiles`, `courses`, `files`, `notes`, `notes_files`, `tasks`, `exams`, `conversations`, `messages`, `help_announcements`.

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Backend overview

- Entrypoint: `backend/main.py`
  - CORS, app title, and routers
  - Routers mounted:
    - `/auth` (auth/session, email verify callback, login, signup, refresh, logout, change password, request email change)
    - `/profiles` (complete, get/update/delete profile, upload image)
    - `/courses` (get/create/edit/delete, categories)
    - `/files` (upload/list/signed URLs/delete)
    - `/notes` (CRUD notes, upload/delete embedded images, by course)
    - `/tasks` (CRUD tasks)
    - `/planing` (exams CRUD, generate weekly study plan PDF)
    - `/announcements` (help board CRUD, toggle status)

- Config: `backend/core/config.py` (Pydantic BaseSettings; loads `.env`)
- Database: `backend/core/database.py` (Supabase client singleton)
- Security: `backend/core/security.py` (cookie-based session, `get_current_user`)
- Utils: `backend/core/utils.py` (set auth cookies, redirect with cookies)

Health check: `GET /` → `{ "message": "API is running" }`.

---

## Key API endpoints (summary)

Base URL: `http://localhost:8000`

- Auth (`/auth`)
  - `POST /signup`
  - `POST /login`
  - `GET /callback?token=...` (email verification)
  - `POST /refresh`
  - `POST /logout`
  - `POST /change-password`
  - `POST /request-email-change`

- Profiles (`/profiles`)
  - `POST /complete-profile`
  - `GET /me`
  - `PUT /update-profile`
  - `DELETE /delete-profile`
  - `POST /upload-profile-image`

- Courses (`/courses`)
  - `GET /get_categories`
  - `POST /create_course`
  - `GET /get_courses`
  - `GET /get_course/{course_id}`
  - `PUT /edit_course/{course_id}`
  - `DELETE /{course_id}`

- Files (`/files`)
  - `POST /upload_file/{course_id}`
  - `GET /get_files/{course_id}`
  - `GET /generate_preview_url/{course_id}/{file_name}`
  - `GET /generate_download_url/{course_id}/{file_name}`
  - `DELETE /delete_file/{course_id}/{file_id}`

- Notes (`/notes`)
  - `POST /create_note`
  - `GET /get_notes`
  - `GET /get_note/{note_id}`
  - `PUT /edit_note/{note_id}`
  - `DELETE /delete_note/{note_id}`
  - `GET /get_notes_by_course/{course_id}`
  - `POST /upload_image/{note_id}`
  - `DELETE /delete_image` (body: `{ url: string }`)

- Tasks (`/tasks`)
  - `POST /create_task`
  - `GET /get_tasks`
  - `PUT /update_task/{task_id}`
  - `DELETE /delete_task/{task_id}`

- Planning (`/planing`)
  - `POST /add_exam`
  - `GET /get_exams`
  - `DELETE /delete_exam/{exam_id}`
  - `GET /generate_plan` (PDF download)

- Announcements (`/announcements`)
  - `POST /create-announcements`
  - `GET /announcements` (open, excluding current user)
  - `GET /my_announcements`
  - `PATCH /toggle_status/{announcement_id}`
  - `PUT /update_announcements/{announcement_id}`
  - `DELETE /delet_announcements/{announcement_id}`

AI Chat (`/ai`)
- `POST /start-conversation`
- `GET /get-conversations`
- `GET /get-messages/{conversation_id}`
- `POST /save-message`
- `POST /ai-chat` (uses Groq `llama-3.3-70b-versatile`)
- `POST /explain_file` (body: file name; fetches from Storage, extracts text, calls AI)

---

## Frontend overview

- API client: `frontend/src/lib/api/client.ts` uses `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`) and includes cookies.
- Middleware: `frontend/src/middleware.ts` protects routes via `access_token` cookie and enforces profile completion.
- Pages and components are in `frontend/src/app` and `frontend/src/components`.

Scripts (in `frontend/package.json`):
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Development workflow

1) Start backend first on port 8000.
2) Start frontend on port 3000.
3) Login/Signup: flows set HTTP-only cookies (`access_token`, `refresh_token`).
4) Ensure Supabase Storage bucket `filesb` exists for uploads (courses and notes).

### Testing (manual)
- Hit `GET /` to verify API is up.
- Create account via `POST /auth/signup`, then complete email verification (`/auth/callback`).
- Complete profile via `/profiles/complete-profile` or UI.

### Deployment notes
- Set `ENVIRONMENT=production` to enforce secure cookies.
- Update CORS origins in `core/config.py`.
- Provide all environment variables in your hosting platform.

---

## Troubleshooting
- 401 Unauthorized: missing/expired cookies; check domain and `ENVIRONMENT` for cookie security.
- Supabase errors: verify table names and `filesb` bucket. Check service role/anon key permissions.
- CORS issues: align `BACKEND_CORS_ORIGINS` and frontend origin.

---

## License
Copyright (c) 2025 Abdelmajid Afaki. All rights reserved.

This software and associated files are the exclusive property of Abdelmajid Afaki.

Unauthorized copying, modification, distribution, or use of this software, 
in whole or in part, without prior written permission from the copyright holder 
is strictly prohibited.

The software may not be redistributed or published in any form, with or without 
modifications, without explicit authorization.

For inquiries, permissions, or commercial use, please contact:
afakiabdelmajid@gmail.com

