# AI Study Platform

## Setup

### Prerequisites
- Node.js v18+
- Python 3.10+

### Backend
<pre> 
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
</pre> 
### Frontend
```bash
cd frontend
npm install

## Github 
## Uploading Your Changes (Push)
# Check which files have been modified
git status

# Stage all changes (or specify specific files)
git add .  # Adds all changes
# OR
git add file1.txt file2.js  # Adds specific files

# Commit changes with a descriptive message
git commit -m "Your descriptive commit message"

# Pull latest changes from the remote (to avoid conflicts)
git pull origin main  # or 'master' if your branch is named differently

# Push your changes to the remote repository
git push origin main  # or 'master'


##  Getting Updates from Your Team (Pull)
# Fetch and merge the latest changes from 'main' (or 'master')
git pull origin main

# If you want to check changes before merging, first fetch:
git fetch origin

# Then compare your branch with the remote
git diff main origin/main

# Finally, merge the changes
git merge origin/main