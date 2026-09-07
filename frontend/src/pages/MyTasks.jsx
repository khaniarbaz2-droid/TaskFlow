import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./MyTasks.css";

function MyTasks() {
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState("All");
  const [tasks, setTasks] = useState([]);

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
        title: "Database Setup",
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

    // Use saved task when the same ID exists
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

    const handleTasksUpdated = () => {
      loadTasks();
    };

    window.addEventListener(
      "storage",
      handleTasksUpdated
    );

    window.addEventListener(
      "taskflowTasksUpdated",
      handleTasksUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleTasksUpdated
      );

      window.removeEventListener(
        "taskflowTasksUpdated",
        handleTasksUpdated
      );
    };
  }, []);

  const myTasks = tasks.filter(
    (task) => task.assignedTo === user?.name
  );

  const filteredTasks =
    activeFilter === "All"
      ? myTasks
      : myTasks.filter(
          (task) => task.status === activeFilter
        );

  return (
    <DashboardLayout>
      <div className="my-tasks-header">
        <div>
          <h1>My Tasks</h1>

          <p>
            Tasks assigned to {user?.name || "you"}.
          </p>
        </div>
      </div>

      <div className="task-filters">
        {[
          "All",
          "Pending",
          "In Progress",
          "Completed",
        ].map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setActiveFilter(filter)
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="my-tasks-table">
        <div className="my-task-row my-task-heading">
          <span>Task</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Progress</span>
          <span>Due Date</span>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              className="my-task-row"
              key={task.id}
            >
              <Link
                to={`/tasks/${task.id}`}
                className="my-task-title task-link"
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

              <span>{task.status}</span>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${task.progress || 0}%`,
                    }}
                  ></div>
                </div>

                <span>
                  {task.progress || 0}%
                </span>
              </div>

              <span>
                {task.dueDate || "Not set"}
              </span>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            No tasks assigned to you.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyTasks;