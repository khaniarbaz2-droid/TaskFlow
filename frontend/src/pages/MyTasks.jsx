import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./MyTasks.css";

function MyTasks() {
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [tasks, setTasks] = useState([]);


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


    /* =========================================
       MERGE DEFAULT + SAVED TASKS
       ========================================= */

    const taskMap = new Map();

    defaultTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    savedTasks.forEach((task) => {
      taskMap.set(String(task.id), task);
    });

    setTasks(Array.from(taskMap.values()));
  };


  /* =========================================
     INITIAL LOAD
     ========================================= */

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
     MY TASKS
     ========================================= */

  const myTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.assignedTo === user?.name
    );
  }, [tasks, user?.name]);


  /* =========================================
     FILTER + SEARCH
     ========================================= */

  const filteredTasks = useMemo(() => {
    return myTasks.filter((task) => {

      const matchesStatus =
        activeFilter === "All" ||
        task.status === activeFilter;

      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    myTasks,
    activeFilter,
    searchTerm,
  ]);


  /* =========================================
     COUNTS
     ========================================= */

  const pendingCount = myTasks.filter(
    (task) =>
      task.status === "Pending"
  ).length;

  const progressCount = myTasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length;

  const completedCount = myTasks.filter(
    (task) =>
      task.status === "Completed"
  ).length;


  /* =========================================
     OVERDUE
     ========================================= */

  const isOverdue = (task) => {
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
  };


  /* =========================================
     PRIORITY CLASS
     ========================================= */

  const getPriorityClass = (priority) => {
    return (
      priority
        ?.toLowerCase()
        .replace(" ", "-") || ""
    );
  };


  /* =========================================
     STATUS CLASS
     ========================================= */

  const getStatusClass = (status) => {
    return (
      status
        ?.toLowerCase()
        .replace(" ", "-") || ""
    );
  };


  return (
    <DashboardLayout>

      <div className="my-tasks-page">

        {/* =================================
            HEADER
            ================================= */}

        <div className="my-tasks-header">

          <div>

            <p className="my-tasks-label">
              Task Management
            </p>

            <h1>
              My Tasks
            </h1>

            <p>
              Tasks assigned to{" "}
              <strong>
                {user?.name || "you"}
              </strong>
              .
            </p>

          </div>

          <div className="task-count-box">

            <strong>
              {myTasks.length}
            </strong>

            <span>
              Total Tasks
            </span>

          </div>

        </div>


        {/* =================================
            SUMMARY
            ================================= */}

        <div className="my-task-summary">

          <div className="summary-card">

            <div className="summary-icon blue">
              📋
            </div>

            <div>
              <span>Total Tasks</span>
              <strong>
                {myTasks.length}
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon orange">
              ◷
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {pendingCount}
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon purple">
              ↻
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {progressCount}
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon green">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>
                {completedCount}
              </strong>
            </div>

          </div>

        </div>


        {/* =================================
            TOOLBAR
            ================================= */}

        <div className="my-tasks-toolbar">

          <div className="task-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search your tasks..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

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

                {filter === "All" && (
                  <span>
                    {myTasks.length}
                  </span>
                )}

                {filter === "Pending" && (
                  <span>
                    {pendingCount}
                  </span>
                )}

                {filter === "In Progress" && (
                  <span>
                    {progressCount}
                  </span>
                )}

                {filter === "Completed" && (
                  <span>
                    {completedCount}
                  </span>
                )}

              </button>

            ))}

          </div>

        </div>


        {/* =================================
            TASK TABLE
            ================================= */}

        <div className="my-tasks-table">

          <div className="my-task-row my-task-heading">

            <span>
              Task
            </span>

            <span>
              Priority
            </span>

            <span>
              Status
            </span>

            <span>
              Progress
            </span>

            <span>
              Due Date
            </span>

          </div>


          {filteredTasks.length > 0 ? (

            filteredTasks.map((task) => (

              <Link
                to={`/tasks/${task.id}`}
                className="my-task-row my-task-data-row"
                key={task.id}
              >

                {/* TASK */}

                <div className="task-name-cell">

                  <div className="task-list-icon">
                    📋
                  </div>

                  <div>

                    <strong>
                      {task.title}
                    </strong>

                    {isOverdue(task) && (
                      <small className="overdue-label">
                        Overdue
                      </small>
                    )}

                  </div>

                </div>


                {/* PRIORITY */}

                <span
                  className={`priority-badge ${getPriorityClass(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>


                {/* STATUS */}

                <span
                  className={`status-badge ${getStatusClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>


                {/* PROGRESS */}

                <div className="progress-cell">

                  <div className="progress-top">

                    <span>
                      Progress
                    </span>

                    <strong>
                      {task.progress || 0}%
                    </strong>

                  </div>

                  <div className="progress-container">

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            task.progress || 0
                          }%`,
                        }}
                      ></div>

                    </div>

                  </div>

                </div>


                {/* DUE DATE */}

                <div
                  className={
                    isOverdue(task)
                      ? "due-date overdue"
                      : "due-date"
                  }
                >

                  <span>
                    📅
                  </span>

                  <span>
                    {task.dueDate ||
                      "Not set"}
                  </span>

                </div>

              </Link>

            ))

          ) : (

            <div className="no-tasks">

              <div className="no-tasks-icon">
                📋
              </div>

              <h2>
                No tasks found
              </h2>

              <p>
                {searchTerm
                  ? "Try a different search term."
                  : "You don't have any tasks matching this filter."}
              </p>

              {searchTerm && (
                <button
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="clear-search-btn"
                >
                  Clear Search
                </button>
              )}

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default MyTasks;