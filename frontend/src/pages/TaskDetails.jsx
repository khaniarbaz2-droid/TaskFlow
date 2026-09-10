import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./TaskDetails.css";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [status, setStatus] =
    useState("Pending");
  const [progress, setProgress] =
    useState(0);

  const [commentText, setCommentText] =
    useState("");

  const [comments, setComments] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  const defaultTasks = [
    {
      id: 1,
      title: "Design Login Page",
      description:
        "Create a modern login interface for TaskFlow.",
      assignedBy: "Arbaz",
      assignedTo: "Arbaz",
      priority: "High",
      status: "In Progress",
      progress: 60,
      startDate: "2026-09-01",
      dueDate: "2026-09-05",
      tags: ["frontend", "login"],
      attachment: "",
    },
    {
      id: 2,
      title: "Database Setup",
      description:
        "Set up the database for the TaskFlow project.",
      assignedBy: "Arbaz",
      assignedTo: "Rahul",
      priority: "Medium",
      status: "Completed",
      progress: 100,
      startDate: "2026-09-01",
      dueDate: "2026-09-03",
      tags: ["database"],
      attachment: "",
    },
    {
      id: 3,
      title: "API Integration",
      description:
        "Connect the frontend with backend APIs.",
      assignedBy: "Arbaz",
      assignedTo: "Aman",
      priority: "High",
      status: "Pending",
      progress: 0,
      startDate: "2026-09-05",
      dueDate: "2026-09-10",
      tags: ["api", "backend"],
      attachment: "",
    },
  ];

  /* =====================================
     LOAD TASK
     ===================================== */

  const loadTask = () => {
    const savedTasks = JSON.parse(
      localStorage.getItem(
        "taskflow_tasks"
      ) || "[]"
    );

    const taskMap = new Map();

    defaultTasks.forEach((item) => {
      taskMap.set(
        String(item.id),
        item
      );
    });

    savedTasks.forEach((item) => {
      taskMap.set(
        String(item.id),
        item
      );
    });

    const foundTask =
      taskMap.get(String(id));

    if (foundTask) {
      setTask(foundTask);

      setStatus(
        foundTask.status ||
          "Pending"
      );

      setProgress(
        Number(
          foundTask.progress || 0
        )
      );
    } else {
      setTask(null);
    }
  };

  /* =====================================
     LOAD COMMENTS / ACTIVITIES
     ===================================== */

  const loadExtraData = () => {
    const savedComments =
      JSON.parse(
        localStorage.getItem(
          `taskflow_comments_${id}`
        ) || "[]"
      );

    const savedActivities =
      JSON.parse(
        localStorage.getItem(
          `taskflow_activities_${id}`
        ) || "[]"
      );

    setComments(savedComments);
    setActivities(savedActivities);
  };

  useEffect(() => {
    loadTask();
    loadExtraData();

    const handleTasksUpdated = () => {
      loadTask();
      loadExtraData();
    };

    window.addEventListener(
      "taskflowTasksUpdated",
      handleTasksUpdated
    );

    window.addEventListener(
      "storage",
      handleTasksUpdated
    );

    return () => {
      window.removeEventListener(
        "taskflowTasksUpdated",
        handleTasksUpdated
      );

      window.removeEventListener(
        "storage",
        handleTasksUpdated
      );
    };
  }, [id]);

  /* =====================================
     PERMISSIONS
     ===================================== */

  const isAdmin =
    user?.role === "Admin";

  const isManager =
    user?.role === "Manager";

  const isAssignedUser =
    task?.assignedTo ===
    user?.name;

  const canEdit =
    isAdmin || isManager;

  const canUpdate =
    isAdmin ||
    isManager ||
    isAssignedUser;

  /* =====================================
     STATUS
     ===================================== */

  const handleStatusChange = (
    newStatus
  ) => {
    setStatus(newStatus);

    if (
      newStatus === "Completed"
    ) {
      setProgress(100);
    }

    if (
      newStatus === "Pending"
    ) {
      setProgress(0);
    }
  };

  /* =====================================
     PROGRESS
     ===================================== */

  const handleProgressChange = (
    value
  ) => {
    let newProgress =
      Number(value);

    if (newProgress < 0) {
      newProgress = 0;
    }

    if (newProgress > 100) {
      newProgress = 100;
    }

    setProgress(newProgress);

    if (
      newProgress === 100
    ) {
      setStatus("Completed");
    } else if (
      newProgress > 0 &&
      status === "Pending"
    ) {
      setStatus("In Progress");
    }
  };

  /* =====================================
     UPDATE TASK
     ===================================== */

  const handleUpdate = () => {
    if (!task) {
      return;
    }

    let finalStatus = status;
    let finalProgress =
      Number(progress);

    if (
      finalStatus === "Completed"
    ) {
      finalProgress = 100;
    }

    if (
      finalStatus === "Pending"
    ) {
      finalProgress = 0;
    }

    if (
      finalProgress === 100
    ) {
      finalStatus = "Completed";
    }

    if (
      finalProgress > 0 &&
      finalStatus === "Pending"
    ) {
      finalStatus = "In Progress";
    }

    const savedTasks =
      JSON.parse(
        localStorage.getItem(
          "taskflow_tasks"
        ) || "[]"
      );

    const updatedTask = {
      ...task,

      status: finalStatus,

      progress: finalProgress,

      updatedAt:
        new Date().toISOString(),
    };

    const taskExists =
      savedTasks.some(
        (item) =>
          String(item.id) ===
          String(task.id)
      );

    const updatedTasks =
      taskExists
        ? savedTasks.map((item) =>
            String(item.id) ===
            String(task.id)
              ? updatedTask
              : item
          )
        : [
            ...savedTasks,
            updatedTask,
          ];

    localStorage.setItem(
      "taskflow_tasks",
      JSON.stringify(updatedTasks)
    );

    // IMPORTANT:
    // Tell all task pages that
    // task data changed.
    window.dispatchEvent(
      new Event("taskflowTasksUpdated")
    );

    /* ===================================
       ACTIVITY
       =================================== */

    const activityKey =
      `taskflow_activities_${task.id}`;

    const savedActivities =
      JSON.parse(
        localStorage.getItem(
          activityKey
        ) || "[]"
      );

    const newActivity = {
      id: Date.now(),

      text: `${user?.name || "User"} updated the task status to ${finalStatus} and progress to ${finalProgress}%.`,

      time: new Date().toLocaleString(),

      type: "update",
    };

    const updatedActivities = [
      ...savedActivities,
      newActivity,
    ];

    localStorage.setItem(
      activityKey,
      JSON.stringify(
        updatedActivities
      )
    );

    setActivities(
      updatedActivities
    );

    /* ===================================
       NOTIFICATION
       =================================== */

    if (
      task.assignedTo &&
      task.assignedTo !==
        user?.name
    ) {
      const notification = {
        id: Date.now() + 1,

        type: "update",

        title: "Task Updated",

        message: `The task "${task.title}" was updated.`,

        time: "Just now",

        read: false,

        taskId: task.id,

        assignedTo:
          task.assignedTo,
      };

      const savedNotifications =
        JSON.parse(
          localStorage.getItem(
            "taskflow_notifications"
          ) || "[]"
        );

      localStorage.setItem(
        "taskflow_notifications",
        JSON.stringify([
          ...savedNotifications,
          notification,
        ])
      );

      window.dispatchEvent(
        new Event(
          "taskflowNotificationsUpdated"
        )
      );
    }

    setTask(updatedTask);

    alert(
      "Task updated successfully!"
    );
  };

  /* =====================================
     COMMENTS
     ===================================== */

  const handleAddComment = () => {
    if (
      !commentText.trim()
    ) {
      return;
    }

    const newComment = {
      id: Date.now(),

      user:
        user?.name ||
        "User",

      text:
        commentText.trim(),

      time:
        new Date().toLocaleString(),
    };

    const updatedComments = [
      ...comments,
      newComment,
    ];

    setComments(
      updatedComments
    );

    localStorage.setItem(
      `taskflow_comments_${id}`,
      JSON.stringify(
        updatedComments
      )
    );

    /* ===================================
       COMMENT ACTIVITY
       =================================== */

    const newActivity = {
      id: Date.now() + 1,

      text: `${user?.name || "User"} added a comment.`,

      time:
        new Date().toLocaleString(),

      type: "comment",
    };

    const updatedActivities = [
      ...activities,
      newActivity,
    ];

    setActivities(
      updatedActivities
    );

    localStorage.setItem(
      `taskflow_activities_${id}`,
      JSON.stringify(
        updatedActivities
      )
    );

    /* ===================================
       CREATOR NOTIFICATION
       =================================== */

    if (
      task.assignedBy &&
      task.assignedBy !==
        user?.name
    ) {
      const notification = {
        id: Date.now() + 2,

        type: "comment",

        title: "New Comment",

        message: `${user?.name || "User"} commented on "${task.title}".`,

        time: "Just now",

        read: false,

        taskId: task.id,

        assignedTo:
          task.assignedBy,
      };

      const savedNotifications =
        JSON.parse(
          localStorage.getItem(
            "taskflow_notifications"
          ) || "[]"
        );

      localStorage.setItem(
        "taskflow_notifications",
        JSON.stringify([
          ...savedNotifications,
          notification,
        ])
      );

      window.dispatchEvent(
        new Event(
          "taskflowNotificationsUpdated"
        )
      );
    }

    setCommentText("");
  };

  if (!task) {
    return (
      <DashboardLayout>

        <div className="task-not-found">

          <h2>
            Task Not Found
          </h2>

          <button
            onClick={() =>
              navigate("/tasks")
            }
          >
            Back to Tasks
          </button>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="task-details-page">

        {/* =================================
            HEADER
            ================================= */}

        <div className="task-details-header">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/tasks")
            }
          >
            ← Back to Tasks
          </button>

          <div className="task-header-actions">

            {canEdit && (
              <button
                className="edit-task-btn"
                onClick={() =>
                  navigate(
                    `/tasks/${task.id}/edit`
                  )
                }
              >
                Edit Task
              </button>
            )}

          </div>

        </div>


        {/* =================================
            TITLE
            ================================= */}

        <div className="task-main-card">

          <div className="task-title-section">

            <div>

              <div className="task-title-row">

                <h1>
                  {task.title}
                </h1>

                <span
                  className={`priority-badge ${task.priority
                    .toLowerCase()
                    .replace(
                      " ",
                      "-"
                    )}`}
                >
                  {task.priority}
                </span>

              </div>

              <p>
                {task.description ||
                  "No description provided."}
              </p>

            </div>

          </div>


          {/* =================================
              META
              ================================= */}

          <div className="task-meta-grid">

            <div className="task-meta-item">

              <span>
                Assigned By
              </span>

              <strong>
                {task.assignedBy ||
                  "—"}
              </strong>

            </div>


            <div className="task-meta-item">

              <span>
                Assigned To
              </span>

              <strong>
                {task.assignedTo ||
                  "—"}
              </strong>

            </div>


            <div className="task-meta-item">

              <span>
                Start Date
              </span>

              <strong>
                {task.startDate ||
                  "—"}
              </strong>

            </div>


            <div className="task-meta-item">

              <span>
                Due Date
              </span>

              <strong>
                {task.dueDate ||
                  "—"}
              </strong>

            </div>

          </div>


          {/* =================================
              PROGRESS
              ================================= */}

          <div className="task-progress-section">

            <div className="task-progress-header">

              <div>

                <span>
                  Progress
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>

              <span>
                {status}
              </span>

            </div>

            <div className="task-progress-bar">

              <div
                className="task-progress-fill"
                style={{
                  width:
                    `${progress}%`,
                }}
              ></div>

            </div>

          </div>


          {/* =================================
              UPDATE CONTROLS
              ================================= */}

          {canUpdate && (
            <div className="task-update-panel">

              <div className="task-update-field">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              <div className="task-update-field">

                <label>
                  Progress
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) =>
                    handleProgressChange(
                      e.target.value
                    )
                  }
                />

              </div>


              <button
                className="update-task-btn"
                onClick={
                  handleUpdate
                }
              >
                Update Task
              </button>

            </div>
          )}


          {/* =================================
              TAGS
              ================================= */}

          {task.tags &&
            task.tags.length > 0 && (
              <div className="task-tags">

                <span>
                  Tags
                </span>

                <div>

                  {task.tags.map(
                    (tag, index) => (
                      <span
                        key={index}
                        className="task-tag"
                      >
                        {tag}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

        </div>


        {/* =================================
            COMMENTS
            ================================= */}

        <div className="task-section-card">

          <div className="section-heading">

            <div>

              <h2>
                Comments
              </h2>

              <p>
                Team discussion and
                updates.
              </p>

            </div>

            <span>
              {comments.length}
            </span>

          </div>


          <div className="comment-form">

            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) =>
                setCommentText(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleAddComment
              }
            >
              Add Comment
            </button>

          </div>


          <div className="comments-list">

            {comments.length > 0 ? (
              comments.map(
                (comment) => (
                  <div
                    className="comment-item"
                    key={comment.id}
                  >

                    <div className="comment-avatar">
                      {comment.user
                        .charAt(0)}
                    </div>

                    <div className="comment-content">

                      <div className="comment-top">

                        <strong>
                          {comment.user}
                        </strong>

                        <span>
                          {comment.time}
                        </span>

                      </div>

                      <p>
                        {comment.text}
                      </p>

                    </div>

                  </div>
                )
              )
            ) : (
              <div className="empty-comments">
                No comments yet.
              </div>
            )}

          </div>

        </div>


        {/* =================================
            ACTIVITY
            ================================= */}

        <div className="task-section-card">

          <div className="section-heading">

            <div>

              <h2>
                Activity History
              </h2>

              <p>
                Recent activity on
                this task.
              </p>

            </div>

            <span>
              {activities.length}
            </span>

          </div>


          <div className="activity-list">

            {activities.length > 0 ? (
              activities
                .slice()
                .reverse()
                .map(
                  (activity) => (
                    <div
                      className="activity-item"
                      key={activity.id}
                    >

                      <div className="activity-dot">
                      </div>

                      <div>

                        <p>
                          {activity.text}
                        </p>

                        <span>
                          {activity.time}
                        </span>

                      </div>

                    </div>
                  )
                )
            ) : (
              <div className="empty-comments">
                No activity yet.
              </div>
            )}

          </div>

        </div>


        {/* =================================
            ATTACHMENT
            ================================= */}

        <div className="task-section-card">

          <div className="section-heading">

            <div>

              <h2>
                Attachments
              </h2>

              <p>
                Files attached to this
                task.
              </p>

            </div>

          </div>


          {task.attachment ? (

            <div className="attachment-item">

              <span>
                📎
              </span>

              <strong>
                {task.attachment}
              </strong>

            </div>

          ) : (

            <div className="empty-comments">
              No attachments.
            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default TaskDetails;