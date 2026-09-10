import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./Workload.css";

function Workload() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================
     LOAD TASKS
     ========================================= */

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

  /* =========================================
     ACCESS
     ========================================= */

  const isAllowed =
    user?.role === "Manager" ||
    user?.role === "Admin";

  /* =========================================
     TEAM MEMBERS
     ========================================= */

  const teamMembers = useMemo(() => {
    const memberNames = [
      "Arbaz",
      "Rahul",
      "Aman",
    ];

    return memberNames.map((name, index) => {
      const memberTasks = tasks.filter(
        (task) =>
          task.assignedTo === name
      );

      const total = memberTasks.length;

      const pending = memberTasks.filter(
        (task) =>
          task.status === "Pending"
      ).length;

      const inProgress = memberTasks.filter(
        (task) =>
          task.status === "In Progress"
      ).length;

      const completed = memberTasks.filter(
        (task) =>
          task.status === "Completed"
      ).length;

      const overdue = memberTasks.filter(
        (task) => {
          if (
            !task.dueDate ||
            task.status === "Completed"
          ) {
            return false;
          }

          const dueDate = new Date(
            task.dueDate
          );

          const today = new Date();

          today.setHours(0, 0, 0, 0);

          return dueDate < today;
        }
      ).length;

      const completion =
        total > 0
          ? Math.round(
              (completed / total) * 100
            )
          : 0;

      let workload = "Low";

      if (total >= 7) {
        workload = "High";
      } else if (total >= 4) {
        workload = "Medium";
      }

      return {
        id: index + 1,
        name,
        role:
          name === "Arbaz"
            ? "Frontend Developer"
            : name === "Rahul"
            ? "Backend Developer"
            : "Database Developer",
        total,
        pending,
        inProgress,
        completed,
        overdue,
        completion,
        workload,
      };
    });
  }, [tasks]);

  /* =========================================
     FILTER
     ========================================= */

  const filteredMembers =
    teamMembers.filter((member) =>
      member.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  /* =========================================
     SUMMARY
     ========================================= */

  const totalMembers =
    teamMembers.length;

  const totalTasks = tasks.length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

  const overdueTasks =
    tasks.filter((task) => {
      if (
        !task.dueDate ||
        task.status === "Completed"
      ) {
        return false;
      }

      const dueDate = new Date(
        task.dueDate
      );

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return dueDate < today;
    }).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  /* =========================================
     ACCESS DENIED
     ========================================= */

  if (!isAllowed) {
    return (
      <DashboardLayout>
        <div className="access-denied">
          <h1>🔒 Access Denied</h1>

          <p>
            Only managers and administrators
            can view team workload.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="workload-page">

        {/* =================================
            HEADER
            ================================= */}

        <div className="workload-header">

          <div>

            <p className="workload-label">
              Team Management
            </p>

            <h1>
              Team Workload
            </h1>

            <p>
              Monitor team tasks, progress,
              and workload.
            </p>

          </div>

        </div>


        {/* =================================
            SUMMARY
            ================================= */}

        <div className="workload-summary">

          <div className="workload-stat">

            <div className="workload-stat-icon blue">
              👥
            </div>

            <div>
              <span>
                Total Members
              </span>

              <strong>
                {totalMembers}
              </strong>
            </div>

          </div>


          <div className="workload-stat">

            <div className="workload-stat-icon purple">
              📋
            </div>

            <div>
              <span>
                Total Tasks
              </span>

              <strong>
                {totalTasks}
              </strong>
            </div>

          </div>


          <div className="workload-stat">

            <div className="workload-stat-icon orange">
              ↻
            </div>

            <div>
              <span>
                In Progress
              </span>

              <strong>
                {inProgressTasks}
              </strong>
            </div>

          </div>


          <div className="workload-stat">

            <div className="workload-stat-icon red">
              ⚠
            </div>

            <div>
              <span>
                Overdue
              </span>

              <strong>
                {overdueTasks}
              </strong>
            </div>

          </div>

        </div>


        {/* =================================
            OVERALL PROGRESS
            ================================= */}

        <div className="workload-progress-card">

          <div className="workload-progress-heading">

            <div>

              <h2>
                Overall Team Progress
              </h2>

              <p>
                Completed tasks across
                the entire team.
              </p>

            </div>

            <strong>
              {completionPercentage}%
            </strong>

          </div>

          <div className="workload-progress-bar">

            <div
              className="workload-progress-fill"
              style={{
                width:
                  `${completionPercentage}%`,
              }}
            ></div>

          </div>

          <div className="workload-progress-footer">

            <span>
              {completedTasks} of{" "}
              {totalTasks} tasks completed
            </span>

            <span>
              {totalTasks -
                completedTasks} remaining
            </span>

          </div>

        </div>


        {/* =================================
            TOOLBAR
            ================================= */}

        <div className="workload-toolbar">

          <div className="workload-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search team member..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* =================================
            TEAM CARD
            ================================= */}

        <div className="team-table-card">

          <div className="team-card-header">

            <div>

              <h2>
                Team Members
              </h2>

              <p>
                Task distribution and
                individual workload.
              </p>

            </div>

            <span>
              {filteredMembers.length} members
            </span>

          </div>


          <div className="team-table">

            {/* TABLE HEADER */}

            <div className="team-row team-heading">

              <span>
                Member
              </span>

              <span>
                Tasks
              </span>

              <span>
                Pending
              </span>

              <span>
                In Progress
              </span>

              <span>
                Completed
              </span>

              <span>
                Workload
              </span>

            </div>


            {/* MEMBERS */}

            {filteredMembers.length > 0 ? (

              filteredMembers.map(
                (member) => (

                  <div
                    className="team-row"
                    key={member.id}
                  >

                    {/* MEMBER */}

                    <div className="member-info">

                      <div className="member-avatar">
                        {member.name.charAt(0)}
                      </div>

                      <div>

                        <strong>
                          {member.name}
                        </strong>

                        <p>
                          {member.role}
                        </p>

                      </div>

                    </div>


                    {/* TOTAL */}

                    <div className="task-total">

                      <strong>
                        {member.total}
                      </strong>

                      <small>
                        {member.completion}%
                        complete
                      </small>

                    </div>


                    {/* PENDING */}

                    <span className="pending-count">
                      {member.pending}
                    </span>


                    {/* IN PROGRESS */}

                    <span className="progress-count">
                      {member.inProgress}
                    </span>


                    {/* COMPLETED */}

                    <span className="completed-count">
                      {member.completed}
                    </span>


                    {/* WORKLOAD */}

                    <span
                      className={`workload-badge ${member.workload.toLowerCase()}`}
                    >
                      {member.workload}
                    </span>

                  </div>

                )
              )

            ) : (

              <div className="workload-empty">

                <div>
                  👥
                </div>

                <h2>
                  No team members found
                </h2>

                <p>
                  Try a different search.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Workload;