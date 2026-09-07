import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./AllTasks.css";

function AllTasks() {
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] =
    useState("All Priorities");

  const loadTasks = () => {
    const savedTasks = JSON.parse(
      localStorage.getItem("taskflow_tasks") || "[]"
    );

    const defaultTasks = [
      {
        id: 1,
        title: "Design Login Page",
        priority: "High",
        status: "In Progress",
        progress: 60,
        assignedTo: "Arbaz",
        dueDate: "Sep 5, 2026",
      },
      {
        id: 2,
        title: "Setup Database",
        priority: "Medium",
        status: "Completed",
        progress: 100,
        assignedTo: "Rahul",
        dueDate: "Sep 3, 2026",
      },
      {
        id: 3,
        title: "API Integration",
        priority: "High",
        status: "Pending",
        progress: 0,
        assignedTo: "Aman",
        dueDate: "Sep 10, 2026",
      },
    ];

    // Saved tasks should replace default tasks
    // when they have the same ID.
    const taskMap = new Map();

    defaultTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    savedTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    setTasks(Array.from(taskMap.values()));
  };

  useEffect(() => {
    loadTasks();

    const handleStorageChange = () => {
      loadTasks();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "taskflowTasksUpdated",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "taskflowTasksUpdated",
        handleStorageChange
      );
    };
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All Priorities" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  return (
    <DashboardLayout>
      <div className="tasks-header">
        <div>
          <h1>All Tasks</h1>
          <p>
            Manage and monitor all project tasks.
          </p>
        </div>

        <Link
          to="/tasks/create"
          className="create-task-btn"
        >
          + Create Task
        </Link>
      </div>

      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
          <option>Cancelled</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option>All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      <div className="tasks-table">
        <div className="tasks-row tasks-heading">
          <span>Task</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Progress</span>
          <span>Assignee</span>
          <span>Due Date</span>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              className="tasks-row"
              key={task.id}
            >
              <Link
                to={`/tasks/${task.id}`}
                className="task-title task-link"
              >
                {task.title}
              </Link>

              <span
                className={`priority ${
                  task.priority?.toLowerCase() || ""
                }`}
              >
                {task.priority}
              </span>

              <span className="status">
                {task.status}
              </span>

              <span>
                {task.progress || 0}%
              </span>

              <span>
                {task.assignedTo}
              </span>

              <span>
                {task.dueDate || "Not set"}
              </span>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            No tasks found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AllTasks;