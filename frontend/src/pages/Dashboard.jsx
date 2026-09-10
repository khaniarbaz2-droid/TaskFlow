import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const role = user?.role || "Team Member";

  const [tasks] = useState(() => {
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

    const taskMap = new Map();

    defaultTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    savedTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    return Array.from(taskMap.values());
  });

  /* =========================
     TASK COUNTS
     ========================= */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const myTasks = tasks.filter(
    (task) => task.assignedTo === user?.name
  );

  const myCompletedTasks = myTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const myInProgressTasks = myTasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const myPendingTasks = myTasks.filter(
    (task) => task.status === "Pending"
  ).length;

  /* =========================
     OVERDUE
     ========================= */

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();

    return dueDate < today;
  });

  /* =========================
     COMPLETION %
     ========================= */

  const completionPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  /* =========================
     ROLE DATA
     ========================= */

  let stats;

  if (role === "Admin") {
    stats = [
      {
        title: "Total Users",
        value: "12",
        icon: "👥",
        type: "blue",
      },
      {
        title: "Total Tasks",
        value: totalTasks,
        icon: "📋",
        type: "purple",
      },
      {
        title: "Completed",
        value: completedTasks,
        icon: "✓",
        type: "green",
      },
      {
        title: "In Progress",
        value: inProgressTasks,
        icon: "↻",
        type: "orange",
      },
    ];
  } else if (role === "Manager") {
    stats = [
      {
        title: "My Tasks",
        value: myTasks.length,
        icon: "📋",
        type: "blue",
      },
      {
        title: "Team Tasks",
        value: totalTasks,
        icon: "👥",
        type: "purple",
      },
      {
        title: "Completed",
        value: completedTasks,
        icon: "✓",
        type: "green",
      },
      {
        title: "Overdue",
        value: overdueTasks.length,
        icon: "⚠",
        type: "red",
      },
    ];
  } else {
    stats = [
      {
        title: "My Tasks",
        value: myTasks.length,
        icon: "📋",
        type: "blue",
      },
      {
        title: "Pending",
        value: myPendingTasks,
        icon: "◷",
        type: "orange",
      },
      {
        title: "In Progress",
        value: myInProgressTasks,
        icon: "↻",
        type: "purple",
      },
      {
        title: "Completed",
        value: myCompletedTasks,
        icon: "✓",
        type: "green",
      },
    ];
  }

  /* =========================
     RECENT TASKS
     ========================= */

  const recentTasks = tasks
    .slice(-5)
    .reverse();

  /* =========================
     PRIORITY COUNTS
     ========================= */

  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const criticalPriority = tasks.filter(
    (task) => task.priority === "Critical"
  ).length;

  return (
    <DashboardLayout>

      {/* =========================
          WELCOME
          ========================= */}

      <div className="dashboard-top">

        <div>
          <p className="dashboard-label">
            {role} Dashboard
          </p>

          <h1>
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="dashboard-description">
            Here's what's happening with your
            tasks today.
          </p>
        </div>

        {(role === "Admin" ||
          role === "Manager") && (
          <Link
            to="/tasks/create"
            className="dashboard-create-btn"
          >
            + Create Task
          </Link>
        )}

      </div>

      {/* =========================
          STAT CARDS
          ========================= */}

      <div className="dashboard-stats">

        {stats.map((stat) => (
          <div
            className="dashboard-stat-card"
            key={stat.title}
          >

            <div
              className={`dashboard-stat-icon ${stat.type}`}
            >
              {stat.icon}
            </div>

            <div className="dashboard-stat-content">

              <p>{stat.title}</p>

              <h2>{stat.value}</h2>

            </div>

          </div>
        ))}

      </div>

      {/* =========================
          MAIN GRID
          ========================= */}

      <div className="dashboard-grid">

        {/* Completion */}
        <div className="dashboard-panel completion-panel">

          <div className="panel-header">

            <div>
              <h2>Task Completion</h2>

              <p>
                Overall project progress
              </p>
            </div>

            <span className="panel-icon">
              📊
            </span>

          </div>

          <div className="completion-content">

            <div className="completion-circle">

              <div>
                <strong>
                  {completionPercentage}%
                </strong>

                <span>
                  Complete
                </span>
              </div>

            </div>

            <div className="completion-details">

              <div className="completion-row">
                <span>
                  <i className="dot completed-dot"></i>
                  Completed
                </span>

                <strong>
                  {completedTasks}
                </strong>
              </div>

              <div className="completion-row">
                <span>
                  <i className="dot progress-dot"></i>
                  In Progress
                </span>

                <strong>
                  {inProgressTasks}
                </strong>
              </div>

              <div className="completion-row">
                <span>
                  <i className="dot pending-dot"></i>
                  Pending
                </span>

                <strong>
                  {pendingTasks}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* Priority */}
        <div className="dashboard-panel priority-panel">

          <div className="panel-header">

            <div>
              <h2>Task Priority</h2>

              <p>
                Tasks by priority level
              </p>
            </div>

            <span className="panel-icon">
              🎯
            </span>

          </div>

          <div className="priority-list">

            <div className="priority-item">

              <div className="priority-info">
                <span>Critical</span>
                <strong>
                  {criticalPriority}
                </strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-fill critical"
                  style={{
                    width: `${
                      totalTasks
                        ? (criticalPriority /
                            totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="priority-item">

              <div className="priority-info">
                <span>High</span>
                <strong>
                  {highPriority}
                </strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-fill high"
                  style={{
                    width: `${
                      totalTasks
                        ? (highPriority /
                            totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="priority-item">

              <div className="priority-info">
                <span>Medium</span>
                <strong>
                  {mediumPriority}
                </strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-fill medium"
                  style={{
                    width: `${
                      totalTasks
                        ? (mediumPriority /
                            totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="priority-item">

              <div className="priority-info">
                <span>Low</span>
                <strong>
                  {lowPriority}
                </strong>
              </div>

              <div className="priority-bar">
                <div
                  className="priority-fill low"
                  style={{
                    width: `${
                      totalTasks
                        ? (lowPriority /
                            totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          RECENT TASKS
          ========================= */}

      <div className="dashboard-panel recent-panel">

        <div className="panel-header">

          <div>
            <h2>Recent Tasks</h2>

            <p>
              Latest activity across your workspace
            </p>
          </div>

          <Link
            to={
              role === "Team Member"
                ? "/my-tasks"
                : "/tasks"
            }
            className="view-all-link"
          >
            View all →
          </Link>

        </div>

        <div className="dashboard-task-list">

          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <Link
                to={`/tasks/${task.id}`}
                className="dashboard-task-row"
                key={task.id}
              >

                <div className="task-main">

                  <div className="task-mini-icon">
                    📋
                  </div>

                  <div>
                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      Assigned to{" "}
                      {task.assignedTo}
                    </p>
                  </div>

                </div>

                <div className="task-status-area">

                  <span
                    className={`dashboard-priority ${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`dashboard-status ${task.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {task.status}
                  </span>

                  <div className="mini-progress">

                    <div className="mini-progress-bar">
                      <div
                        className="mini-progress-fill"
                        style={{
                          width: `${
                            task.progress || 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <span>
                      {task.progress || 0}%
                    </span>

                  </div>

                </div>

              </Link>
            ))
          ) : (
            <div className="dashboard-empty">
              <span>📋</span>
              <p>No tasks available.</p>
            </div>
          )}

        </div>

      </div>

      {/* =========================
          QUICK ACTIONS
          ========================= */}

      <div className="quick-actions">

        <div className="quick-action-heading">
          <h2>Quick Actions</h2>
          <p>
            Get things done faster.
          </p>
        </div>

        <div className="quick-action-grid">

          {(role === "Admin" ||
            role === "Manager") && (
            <Link
              to="/tasks/create"
              className="quick-action"
            >
              <span className="quick-action-icon">
                +
              </span>

              <div>
                <strong>Create Task</strong>
                <small>
                  Assign a new task
                </small>
              </div>

              <span>→</span>
            </Link>
          )}

          <Link
            to={
              role === "Team Member"
                ? "/my-tasks"
                : "/tasks"
            }
            className="quick-action"
          >
            <span className="quick-action-icon">
              📋
            </span>

            <div>
              <strong>
                {role === "Team Member"
                  ? "My Tasks"
                  : "All Tasks"}
              </strong>

              <small>
                View your task list
              </small>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/notifications"
            className="quick-action"
          >
            <span className="quick-action-icon">
              🔔
            </span>

            <div>
              <strong>
                Notifications
              </strong>

              <small>
                Check recent updates
              </small>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/profile"
            className="quick-action"
          >
            <span className="quick-action-icon">
              👤
            </span>

            <div>
              <strong>
                My Profile
              </strong>

              <small>
                Manage your account
              </small>
            </div>

            <span>→</span>
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;