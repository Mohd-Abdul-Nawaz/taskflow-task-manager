"""
TaskFlow - Task Management Application
Full-stack task management REST API with Python, Flask, and SQLite.
Showcase project for Honeywell Software Engineering Intern application.
"""

import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'taskflow.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

db = SQLAlchemy(app)
CORS(app)


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default="Pending")
    priority = db.Column(db.String(20), nullable=False, default="Medium")
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


with app.app_context():
    db.create_all()


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    status = request.args.get("status")
    priority = request.args.get("priority")
    query = Task.query
    if status:
        query = query.filter_by(status=status)
    if priority:
        query = query.filter_by(priority=priority)
    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict()), 200


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json() or request.form
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    due_date = None
    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str)
        except ValueError:
            return jsonify({"error": "Invalid due_date format. Use ISO format."}), 400

    task = Task(
        title=title,
        description=data.get("description", "").strip(),
        status=data.get("status", "Pending"),
        priority=data.get("priority", "Medium"),
        due_date=due_date,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json() or request.form
    task.title = data.get("title", task.title).strip()
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.priority = data.get("priority", task.priority)

    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            task.due_date = datetime.fromisoformat(due_date_str)
        except ValueError:
            return jsonify({"error": "Invalid due_date format"}), 400

    db.session.commit()
    return jsonify(task.to_dict()), 200


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 200


@app.route("/api/stats", methods=["GET"])
def get_stats():
    total = Task.query.count()
    pending = Task.query.filter_by(status="Pending").count()
    in_progress = Task.query.filter_by(status="In Progress").count()
    completed = Task.query.filter_by(status="Completed").count()
    return jsonify({
        "total": total, "pending": pending,
        "in_progress": in_progress, "completed": completed,
    }), 200


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "taskflow"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)