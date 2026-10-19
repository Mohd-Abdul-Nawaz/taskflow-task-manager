# 🚀 TaskFlow — Task Management Application

A full-stack task management REST API + web UI built with **Python, Flask, and SQLite**.  
Created as a showcase project for the **Honeywell Software Engineering Intern** application.

---

## 📸 Features

| Feature | Description |
|---------|-------------|
| ✅ CRUD Operations | Create, read, update, delete tasks |
| 📊 Status Tracking | Pending → In Progress → Completed workflow |
| 🎯 Priority Levels | Low / Medium / High with color coding |
| 📅 Due Dates | Optional due dates with date picker |
| 📈 Statistics | Dashboard stats (total, pending, in progress, completed) |
| 🌐 REST API | JSON API endpoints for frontend/mobile integration |
| 💾 SQLite | File-based database, no separate DB server needed |

---

## 🛠️ Tech Stack

- **Backend:** Python 3.10+, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** SQLite (single file, zero-config)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (fetch API)
- **Deployment:** Render, Railway, PythonAnywhere, or any WSGI server

---

## 📁 Project Structure

```
taskflow-task-manager/
├── app.py                 # Flask application + API routes + DB models
├── requirements.txt       # Python dependencies
├── taskflow.db            # SQLite database (auto-created)
├── templates/
│   └── index.html         # Main web UI
├── static/
│   ├── style.css          # Styles
│   └── script.js          # Frontend logic (fetch API)
├── README.md
└── DEPLOY.md              # Deployment instructions
```

---

## 🚀 Quick Start (Local)

### 1. Clone / Open the folder
```bash
cd taskflow-task-manager
```

### 2. Create a virtual environment (recommended)
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the application
```bash
python app.py
```

### 5. Open in browser
Visit: **http://localhost:5000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (query: `?status=Pending`, `?priority=High`) |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Task statistics |
| GET | `/health` | Health check |
| GET | `/` | Web UI |

### Example: Create a task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Review Honeywell JD","priority":"High","status":"Pending"}'
```

---

## ☁️ Deployment

See **DEPLOY.md** for step-by-step instructions to deploy on **Render** (free tier) or **Railway**.

---

## 🎓 Why This Project for Honeywell

- Demonstrates **full-stack development** (Python backend + web frontend)
- Shows **REST API design** — relevant to Honeywell's software solutions
- Uses **JavaScript fetch API** for asynchronous communication — matches "collaborate to design and develop software solutions"
- Includes **database design** with SQLAlchemy ORM
- Clean, modular code following **software engineering principles**
- Ready to deploy — reviewer can see live working app

---

## 📄 License

MIT License — free to use for learning and portfolio purposes.