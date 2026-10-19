// TaskFlow - Frontend JavaScript
const API_BASE = "/api/tasks";
const STATS_API = "/api/stats";

const taskForm = document.getElementById("taskForm");
const tasksList = document.getElementById("tasksList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const statsBadge = document.getElementById("statsBadge");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    fetchStats();
    fetchTasks();
    taskForm.addEventListener("submit", handleAddTask);
});

async function fetchStats() {
    try {
        const res = await fetch(STATS_API);
        const data = await res.json();
        statsBadge.textContent = `${data.completed}/${data.total} completed`;
    } catch (err) {
        statsBadge.textContent = "Stats unavailable";
    }
}

async function fetchTasks(filter = "all") {
    try {
        let url = API_BASE;
        const params = [];
        if (filter === "High") {
            params.push("priority=High");
        } else if (filter !== "all") {
            params.push(`status=${filter}`);
        }
        if (params.length) url += "?" + params.join("&");
        const res = await fetch(url);
        const tasks = await res.json();
        renderTasks(tasks);
        await fetchStats();
    } catch (err) {
        tasksList.innerHTML = `<p style="color:#dc2626; text-align:center; padding:2rem;">Failed to load tasks.</p>`;
    }
}

async function addTask(taskData) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return await res.json();
}

async function updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return await res.json();
}

async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    return await res.json();
}
async function handleAddTask(e) {
    e.preventDefault();
    const dueDateInput = document.getElementById("due_date").value;
    const taskData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        status: document.getElementById("status").value,
        priority: document.getElementById("priority").value,
        due_date: dueDateInput || null,
    };
    try {
        await addTask(taskData);
        taskForm.reset();
        document.getElementById("priority").value = "Medium";
        fetchTasks(currentFilter);
    } catch (err) {
        alert(err.message);
    }
}

async function handleToggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "Pending" ? "In Progress" : currentStatus === "In Progress" ? "Completed" : "Pending";
    try {
        await updateTask(id, { status: newStatus });
        fetchTasks(currentFilter);
    } catch (err) {
        alert("Failed to update status");
    }
}

async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
        await deleteTask(id);
        fetchTasks(currentFilter);
    } catch (err) {
        alert("Failed to delete task");
    }
}

function renderTasks(tasks) {
    tasksList.innerHTML = "";
    if (!tasks || tasks.length === 0) {
        emptyState.style.display = "block";
        taskCount.textContent = "(0)";
        return;
    }
    emptyState.style.display = "none";
    taskCount.textContent = `(${tasks.length})`;
    tasks.forEach((task) => {
        const card = document.createElement("div");
        card.className = `task-card ${task.priority.toLowerCase()}`;
        card.innerHTML = `
            <div class="task-info">
                <span class="task-title">${escapeHtml(task.title)}</span>
                ${task.description ? `<span class="task-desc">${escapeHtml(task.description)}</span>` : ""}
                <div class="task-meta">
                    <span>📅 ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</span>
                    <span>🏷️ ${task.priority}</span>
                    <span>🕒 ${task.created_at ? new Date(task.created_at).toLocaleDateString() : ""}</span>
                </div>
            </div>
            <div class="task-actions">
                <span class="status-badge status-${task.status.replace(" ", "-")}">${task.status}</span>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-sm btn-success" onclick="handleToggleStatus(${task.id}, '${task.status}')">
                        ${task.status === "Completed" ? "Reopen" : "Next"}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="handleDelete(${task.id})">Delete</button>
                </div>
            </div>
        `;
        tasksList.appendChild(card);
    });
}

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        fetchTasks(currentFilter);
    });
});

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}