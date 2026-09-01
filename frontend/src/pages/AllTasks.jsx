import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./AllTasks.css";

function AllTasks() {
  const tasks = [
    {
      id: 1,
      title: "Design Login Page",
      priority: "High",
      status: "In Progress",
      progress: 60,
      assignee: "Arbaz",
      dueDate: "Sep 5, 2026",
    },
    {
      id: 2,
      title: "Setup Database",
      priority: "Medium",
      status: "Completed",
      progress: 100,
      assignee: "Rahul",
      dueDate: "Sep 3, 2026",
    },
    {
      id: 3,
      title: "API Integration",
      priority: "High",
      status: "Pending",
      progress: 0,
      assignee: "Aman",
      dueDate: "Sep 10, 2026",
    },
  ];

  return (
    <DashboardLayout>

      <div className="tasks-header">

        <div>
          <h1>All Tasks</h1>
          <p>Manage and monitor all project tasks.</p>
        </div>

        <Link
          to="/tasks/create"
          className="create-task-btn"
        >
          + Create Task
        </Link>

      </div>

      {/* SEARCH + FILTERS */}

      <div className="task-controls">

        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
        />

        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
          <option>Cancelled</option>
        </select>

        <select>
          <option>All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

      </div>

      {/* TASK TABLE */}

      <div className="tasks-table">

        <div className="tasks-row tasks-heading">
          <span>Task</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Progress</span>
          <span>Assignee</span>
          <span>Due Date</span>
        </div>

        {tasks.map((task) => (
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
              className={`priority ${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>

            <span className="status">
              {task.status}
            </span>

            <span>
              {task.progress}%
            </span>

            <span>
              {task.assignee}
            </span>

            <span>
              {task.dueDate}
            </span>

          </div>
        ))}

      </div>

    </DashboardLayout>
  );
}

export default AllTasks;