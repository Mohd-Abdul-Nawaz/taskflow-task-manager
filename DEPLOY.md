# 🌐 Deployment Guide — TaskFlow

Deploy your TaskFlow app so the Honeywell reviewer can see it live.

---

## Option 1: Render (Recommended, Free Tier)

### Prerequisites
- GitHub account
- Render account (render.com)

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com) → "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Runtime:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn app:app`
     - **Instance Type:** Free

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your app will be live at `https://taskflow.onrender.com`

---

## Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub and select your repo
3. Railway auto-detects Python/Flask
4. Add a `start` command: `gunicorn app:app`
5. Deploy — get a live URL instantly

---

## Option 3: PythonAnywhere

1. Create account at [pythonanywhere.com](https://pythonanywhere.com)
2. Upload files via their file manager
3. Create a web app → Flask
4. Point WSGI file to `app.py`
5. Reload and visit your `username.pythonanywhere.com`

---

## 🔑 Production Checklist

Before sharing the link with the reviewer:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `FLASK_DEBUG=False` in environment variables
- [ ] Test all CRUD operations on the live URL
- [ ] Confirm mobile responsiveness
- [ ] Add your live URL to the resume under the project

---

## 🧪 Testing the Live App

1. Open the live URL
2. Add 3–5 tasks with different priorities and statuses
3. Update a task status (Pending → In Progress → Completed)
4. Delete one task
5. Confirm stats update at the top

Share the live URL in your resume:

> **TaskFlow** | Python, Flask, SQLite, JavaScript  
> [Live Demo: https://your-app.onrender.com] | [GitHub: github.com/yourname/taskflow]