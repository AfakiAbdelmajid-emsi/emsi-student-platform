## AI Study Platform (Flask)

An AI-focused study and learning management web app. Organize study tracks, cohorts (groups), assignments, personal learning tasks, and live sessions with a unified calendar. Role-based access: Admin and Student (named `employee` in the code).

### What this platform does
- Admin
  - Create tracks (curricula) and cohorts, assign coursework, schedule sessions
  - Manage users: activate/deactivate, set roles, view learner details
- Student
  - View and complete assigned coursework; log progress entries
  - Create personal study tasks and track progress
  - View a role-aware calendar aggregating assignments, track milestones, and events
  - Manage profile and avatar

### Architecture overview
- Flask app (`app.py`) registers three blueprints and configures DB/auth
  - `authroutes.py`: login/logout
  - `adminroutes.py`: admin features (users, teams, projects, tasks, events, profile)
  - `employeeroutes.py`: student features (assigned tasks, personal tasks, teams, projects, events, profile)
- Data models in `modals.py` (SQLAlchemy): `users`, `Teams`, `Project`, `Task`, `TaskAssignment`, `Task_Progression`, `PersonalTask`, `PersonalTaskProgression`, `Event` and joins
- Extensions in `extensions.py`: `db`, `bcrypt`, `login_manager`, `ALLOWED_EXTENSIONS`
- Helpers in `utils.py`: status calculation and sorting
- UI in `templates/` (admin, employee, and shared `components/`)

Concept mapping to study domain
- Tracks → `Project`
- Cohorts/Groups → `Teams` (+ `TeamsMember` and supervisor)
- Assignments → `Task` (+ `TaskAssignment`, `Task_Progression`)
- Personal learning tasks → `PersonalTask` (+ `PersonalTaskProgression`)
- Live sessions → `Event` (+ `EventTeam`, `EventEmployee`)

### Tech stack
- Python, Flask
- Flask-SQLAlchemy (MySQL), Flask-Login, Flask-Bcrypt
- Jinja2 templates

### Setup
Prerequisites
- Python 3.10+
- MySQL 8.x (or compatible)

1) Create a virtual environment
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows PowerShell
```

2) Install dependencies
```bash
pip install Flask Flask-SQLAlchemy Flask-Bcrypt Flask-Login PyMySQL
```

3) Configure environment
Set env vars or edit `config.py` defaults.
```powershell
$env:SECRET_KEY = "change-me"
$env:DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost/python_project"
```

Create the database
```sql
CREATE DATABASE python_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Note: For local dev without HTTPS, you may set `SESSION_COOKIE_SECURE=False` in `config.py` temporarily.

4) Run
```bash
python app.py
```
Open `http://127.0.0.1:5000/`.

### Roles and access
- Admin: full access to tracks, cohorts, assignments, events, and user management
- Student (`employee` in code): assigned tasks, personal tasks, teams, calendar, profile

First Admin bootstrap
```python
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
print(bcrypt.generate_password_hash("YourPassword").decode("utf-8"))
```
Insert a row in `users` with `status='active'`, `usertype='Admin'`, and the hash in `Pasword`.

### Key flows
- Status logic: Upcoming/Open/Closed computed from dates and status fields
- Sorting: open first, then upcoming, then closed
- Calendar: merges assignments, tracks, and events; student view filters to relevant items

### High-level routes
- Auth: `/`, `/login`, `/logout`
- Admin: `/admin/usersdashboard`, `/admin/teams`, `/admin/projects`, `/admin/tasks`, `/admin/calendar`, `/admin/profile/<Utoken>`
- Student: `/employee/Assignedtasks`, `/employee/personaltasks`, `/employee/teams`, `/employee/team_projects`, `/employee/calendar`, `/employee/profile/<Utoken>`

### Roadmap (AI)
- Personalized track recommendations and pacing via progress data
- Spaced repetition scheduler for assignments/personal tasks
- LLM tutor for contextual Q&A and code reviews
- Predictive reminders and risk flags for falling behind

### Troubleshooting
- Login loops: ensure user is `active` and has correct `usertype`
- MySQL driver: use `mysql+pymysql://...` when PyMySQL is installed
- Cookies in dev: set `SESSION_COOKIE_SECURE=False` if not on HTTPS

### Screenshots
Add images to `static/` and reference them here.

### License
Add a license (MIT recommended) if open-sourcing.
