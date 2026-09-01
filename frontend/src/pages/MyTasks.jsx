import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./MyTasks.css";

function MyTasks() {
  const [activeFilter, setActiveFilter] = useState("All");

  const tasks = [
    {
      id: 1,
      title: "Design Login Page",
      priority: "High",
      status: "In Progress",
      progress: 60,
      dueDate: "Sep 5, 2026",
    },
    {
      id: 3,
      title: "API Integration",
      priority: "High",
      status: "Pending",
      progress: 0,
      dueDate: "Sep 10, 2026",
    },
    {
      id: 2,
      title: "Database Setup",
      priority: "Medium",
      status: "Completed",
      progress: 100,
      dueDate: "Sep 3, 2026",
    },
  ];

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  return (
    <DashboardLayout>

      <div className="my-tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>Tasks assigned to you.</p>
        </div>
      </div>

      {/* FILTER BUTTONS */}

      <div className="task-filters">

        {["All", "Pending", "In Progress", "Completed"].map(
          (filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          )
        )}

      </div>

      {/* TASK TABLE */}

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

              {/* CLICKABLE TASK */}

              <Link
                to={`/tasks/${task.id}`}
                className="my-task-title task-link"
              >
                {task.title}
              </Link>

              {/* PRIORITY */}

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              {/* STATUS */}

              <span>
                {task.status}
              </span>

              {/* PROGRESS */}

              <div className="progress-container">

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${task.progress}%`,
                    }}
                  ></div>
                </div>

                <span>{task.progress}%</span>

              </div>

              {/* DUE DATE */}

              <span>
                {task.dueDate}
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

export default MyTasks;