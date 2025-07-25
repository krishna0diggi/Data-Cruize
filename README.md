
# ✅ STEP 1: Clone the Project
git clone https://github.com/krishna0diggi/Data-Cruize.git
cd data-cruize

# ✅ STEP 2: Create Virtual Environment (venv)
python -m venv venv

# ✅ STEP 3: Activate Virtual Environment
.\venv\Scripts\activate


# ✅ STEP 4: Install Required Python Packages
pip install -r requirements.txt

# ✅ STEP 5: Set Up .env File
# 🔐 Create a `.env` file in the root folder (same level as requirements.txt)

# Paste this inside .env 👇
SECRET_KEY=your-django-secret-key
DEBUG=True

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# ✅ STEP 6: Apply Migrations (Set up the database)
python backend/manage.py makemigrations


python backend/manage.py migrate

# ✅ STEP 7: Run the Development Server
python backend/manage.py runserver

# 📌 Visit in browser:
# http://127.0.0.1:8000/

# ✅ STEP 9: Create a New App (Module)
# (inside /apps/ directory)
python backend/manage.py startapp user apps/user

# ✅ STEP 10: Add Your App to `INSTALLED_APPS` in backend/settings.py
# Example:
INSTALLED_APPS = [
    ...
    'apps.user',
]

# ✅ STEP 11: Add Routes in backend/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('apps.user.urls')),
]
