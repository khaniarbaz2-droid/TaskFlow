import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, loginAs } = useAuth();

  const role = user?.role;

  // Read tasks from localStorage
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

    return [...defaultTasks, ...savedTasks];
  });

  // Calculate task statistics
  const myTasks = tasks.filter(
    (task) => task.assignedTo === user?.name
  );

  const pendingTasks = myTasks.filter(
    (task) => task.status === "Pending"
  );

  const inProgressTasks = myTasks.filter(
    (task) => task.status === "In Progress"
  );

  const completedTasks = myTasks.filter(
    (task) => task.status === "Completed"
  );

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();

    return dueDate < today;
  });

  const teamTasks = tasks.filter(
    (task) => task.assignedBy === user?.name
  );

  // Dashboard data based on role
  let currentDashboard;

  if (role === "Admin") {
    currentDashboard = {
      subtitle:
        "Here's an overview of your organization.",

      stats: [
        {
          title: "Total Users",
          value: "12",
        },
        {
          title: "Total Tasks",
          value: tasks.length,
        },
        {
          title: "Completed",
          value: tasks.filter(
            (task) => task.status === "Completed"
          ).length,
        },
        {
          title: "In Progress",
          value: tasks.filter(
            (task) => task.status === "In Progress"
          ).length,
        },
        {
          title: "Overdue",
          value: overdueTasks.length,
        },
      ],
    };
  } else if (role === "Manager") {
    currentDashboard = {
      subtitle:
        "Here's an overview of your team's work.",

      stats: [
        {
          title: "My Tasks",
          value: myTasks.length,
        },
        {
          title: "Team Tasks",
          value: teamTasks.length,
        },
        {
          title: "In Progress",
          value: tasks.filter(
            (task) => task.status === "In Progress"
          ).length,
        },
        {
          title: "Completed",
          value: tasks.filter(
            (task) => task.status === "Completed"
          ).length,
        },
        {
          title: "Overdue",
          value: overdueTasks.length,
        },
      ],
    };
  } else {
    currentDashboard = {
      subtitle:
        "Here's an overview of your assigned tasks.",

      stats: [
        {
          title: "My Tasks",
          value: myTasks.length,
        },
        {
          title: "Pending",
          value: pendingTasks.length,
        },
        {
          title: "In Progress",
          value: inProgressTasks.length,
        },
        {
          title: "Completed",
          value: completedTasks.length,
        },
        {
          title: "Overdue",
          value: overdueTasks.filter(
            (task) => task.assignedTo === user?.name
          ).length,
        },
      ],
    };
  }

  // Show recent tasks
  const recentTasks = tasks.slice(-5).reverse();

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div>
          <h1>Welcome back 👋</h1>
          <p>{currentDashboard.subtitle}</p>
        </div>

        {/* Temporary role switcher for testing */}
        <div className="role-switcher">
          <label>Test Role:</label>

          <select
            value={role || ""}
            onChange={(e) =>
              loginAs(e.target.value)
            }
          >
            <option value="Manager">
              Manager
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="Team Member">
              Team Member
            </option>
          </select>
        </div>
      </div>

      <div className="current-role">
        Logged in as: <strong>{role}</strong>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {currentDashboard.stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="recent-section">
        <h2>Recent Tasks</h2>

        <div className="task-table">

          <div className="task-row task-heading">
            <span>Task</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Progress</span>
          </div>

          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div
                className="task-row"
                key={task.id}
              >
                <span>{task.title}</span>

                <span
                  className={
                    task.priority?.toLowerCase()
                  }
                >
                  {task.priority}
                </span>

                <span>{task.status}</span>

                <span>
                  {task.progress || 0}%
                </span>
              </div>
            ))
          ) : (
            <div className="task-row">
              <span>No tasks available</span>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;