import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./TaskDetails.css";

function TaskDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // Default tasks
  const defaultTasks = [
    {
      id: 1,
      title: "Design Login Page",
      description:
        "Create a clean and responsive login page for the TaskFlow application.",
      priority: "High",
      status: "In Progress",
      progress: 60,
      assignedTo: "Arbaz",
      assignedBy: "Manager",
      startDate: "Sep 1, 2026",
      dueDate: "Sep 5, 2026",
      tags: "Frontend, UI",
    },
    {
      id: 2,
      title: "Setup Database",
      description: "Set up the TaskFlow database.",
      priority: "Medium",
      status: "Completed",
      progress: 100,
      assignedTo: "Rahul",
      assignedBy: "Manager",
      startDate: "Sep 1, 2026",
      dueDate: "Sep 3, 2026",
      tags: "Database",
    },
    {
      id: 3,
      title: "API Integration",
      description: "Connect the frontend with backend APIs.",
      priority: "High",
      status: "Pending",
      progress: 0,
      assignedTo: "Aman",
      assignedBy: "Manager",
      startDate: "Sep 5, 2026",
      dueDate: "Sep 10, 2026",
      tags: "Backend, API",
    },
  ];

  // Get saved tasks
  const savedTasks = JSON.parse(
    localStorage.getItem("taskflow_tasks") || "[]"
  );

  // Combine default + created tasks
  const allTasks = [...defaultTasks, ...savedTasks];

  // Find the task from URL
  const task = allTasks.find(
    (item) => String(item.id) === String(id)
  );

  // Task not found
  if (!task) {
    return (
      <DashboardLayout>
        <div className="access-denied">
          <h1>Task Not Found</h1>
          <p>This task does not exist.</p>

          <button onClick={() => navigate("/tasks")}>
            Back to Tasks
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const [status, setStatus] = useState(
    task.status || "Pending"
  );

  const [progress, setProgress] = useState(
    task.progress || 0
  );

  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState(() => {
    const savedComments = JSON.parse(
      localStorage.getItem("taskflow_comments") || "{}"
    );

    return (
      savedComments[task.id] || [
        {
          id: 1,
          user: "Arbaz",
          text: "I have started working on this task.",
          time: "Today, 10:30 AM",
        },
      ]
    );
  });

  const [activities, setActivities] = useState(() => {
    const savedActivities = JSON.parse(
      localStorage.getItem("taskflow_activities") || "{}"
    );

    return (
      savedActivities[task.id] || [
        {
          id: 1,
          text: "Task created",
          user: task.assignedBy || "Manager",
          time: task.createdAt || "Today",
        },
        {
          id: 2,
          text: `Task assigned to ${task.assignedTo}`,
          user: task.assignedBy || "Manager",
          time: task.createdAt || "Today",
        },
        {
          id: 3,
          text: `Progress updated to ${task.progress || 0}%`,
          user: task.assignedTo,
          time: "Today",
        },
      ]
    );
  });

  // Check whether current user is allowed to update
  const canUpdate =
    user?.role === "Admin" ||
    user?.role === "Manager" ||
    user?.name === task.assignedTo;

  // Update progress
  const handleProgressChange = (e) => {
    const newProgress = Number(e.target.value);

    setProgress(newProgress);

    if (newProgress === 100) {
      setStatus("Completed");
    } else if (newProgress > 0 && status === "Pending") {
      setStatus("In Progress");
    }
  };

  // Update status
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    setStatus(newStatus);

    if (newStatus === "Completed") {
      setProgress(100);
    } else if (newStatus === "Pending") {
      setProgress(0);
    }
  };

  // Save task update
  const handleUpdate = () => {
    if (!canUpdate) {
      alert("You don't have permission to update this task.");
      return;
    }

    const savedTasks = JSON.parse(
      localStorage.getItem("taskflow_tasks") || "[]"
    );

    const updatedTask = {
      ...task,
      status,
      progress,
      updatedAt: new Date().toLocaleString(),
    };

    const taskExists = savedTasks.some(
      (item) => String(item.id) === String(task.id)
    );

    let updatedTasks;

    if (taskExists) {
      updatedTasks = savedTasks.map((item) =>
        String(item.id) === String(task.id)
          ? updatedTask
          : item
      );
    } else {
      updatedTasks = [...savedTasks, updatedTask];
    }

    localStorage.setItem(
      "taskflow_tasks",
      JSON.stringify(updatedTasks)
    );
    window.dispatchEvent(
  new Event("taskflowTasksUpdated")
);

    // Add activity
    const newActivity = {
      id: Date.now(),
      text: `Task updated: ${status}, ${progress}% progress`,
      user: user?.name || "User",
      time: new Date().toLocaleString(),
    };

    const updatedActivities = [
      newActivity,
      ...activities,
    ];

    setActivities(updatedActivities);

    const savedActivities = JSON.parse(
      localStorage.getItem("taskflow_activities") || "{}"
    );

    savedActivities[task.id] = updatedActivities;

    localStorage.setItem(
      "taskflow_activities",
      JSON.stringify(savedActivities)
    );

    alert("Task updated successfully!");
  };

  // Add comment
  const handleAddComment = () => {
    if (!commentText.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const newComment = {
      id: Date.now(),
      user: user?.name || "User",
      text: commentText.trim(),
      time: new Date().toLocaleString(),
    };

    const updatedComments = [
      newComment,
      ...comments,
    ];

    setComments(updatedComments);
    setCommentText("");

    // Save comments
    const savedComments = JSON.parse(
      localStorage.getItem("taskflow_comments") || "{}"
    );

    savedComments[task.id] = updatedComments;

    localStorage.setItem(
      "taskflow_comments",
      JSON.stringify(savedComments)
    );

    // Add activity
    const newActivity = {
      id: Date.now() + 1,
      text: "Added a comment",
      user: user?.name || "User",
      time: new Date().toLocaleString(),
    };

    const updatedActivities = [
      newActivity,
      ...activities,
    ];

    setActivities(updatedActivities);

    const savedActivities = JSON.parse(
      localStorage.getItem("taskflow_activities") || "{}"
    );

    savedActivities[task.id] = updatedActivities;

    localStorage.setItem(
      "taskflow_activities",
      JSON.stringify(savedActivities)
    );
  };

  return (
    <DashboardLayout>
      <div className="task-details-page">

        {/* Header */}
        <div className="page-header">
          <div>
            <button
              className="back-btn"
              onClick={() => navigate("/tasks")}
            >
              ← Back to Tasks
            </button>

            <h1>{task.title}</h1>

            <p>
              Task details and collaboration
            </p>
          </div>

          {(user?.role === "Admin" ||
            user?.role === "Manager") && (
            <button
              className="edit-btn"
              onClick={() =>
                navigate(`/tasks/${task.id}/edit`)
              }
            >
              Edit Task
            </button>
          )}
        </div>

        {/* Main Task Information */}
        <div className="task-details-grid">

          {/* Left Section */}
          <div>

            <div className="details-card">
              <h2>Task Information</h2>

              <div className="task-description">
                <h3>Description</h3>
                <p>{task.description}</p>
              </div>

              <div className="task-info-grid">

                <div className="info-item">
                  <span>Priority</span>
                  <strong
                    className={`priority-${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Assigned To</span>
                  <strong>{task.assignedTo}</strong>
                </div>

                <div className="info-item">
                  <span>Assigned By</span>
                  <strong>{task.assignedBy}</strong>
                </div>

                <div className="info-item">
                  <span>Start Date</span>
                  <strong>{task.startDate || "Not set"}</strong>
                </div>

                <div className="info-item">
                  <span>Due Date</span>
                  <strong>{task.dueDate || "Not set"}</strong>
                </div>

                <div className="info-item">
                  <span>Tags</span>
                  <strong>{task.tags || "No tags"}</strong>
                </div>

              </div>
            </div>

            {/* Progress */}
            <div className="details-card">
              <h2>Progress</h2>

              <div className="progress-header">
                <strong>{progress}%</strong>
                <span>{status}</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Update Task */}
            {canUpdate && (
              <div className="details-card">

                <h2>Update Task</h2>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    value={status}
                    onChange={handleStatusChange}
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

                <div className="form-group">
                  <label>
                    Progress: {progress}%
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                  />
                </div>

                <button
                  className="update-btn"
                  onClick={handleUpdate}
                >
                  Save Update
                </button>

              </div>
            )}

            {/* Comments */}
            <div className="details-card">

              <h2>Comments</h2>

              <div className="comment-form">

                <textarea
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  placeholder="Write a comment..."
                  rows="4"
                />

                <button
                  className="comment-btn"
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>

              </div>

              <div className="comments-list">

                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      className="comment-item"
                      key={comment.id}
                    >
                      <div className="comment-avatar">
                        {comment.user
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div className="comment-content">

                        <div className="comment-header">
                          <strong>
                            {comment.user}
                          </strong>

                          <span>
                            {comment.time}
                          </span>
                        </div>

                        <p>{comment.text}</p>

                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

              </div>
            </div>

          </div>

          {/* Right Section */}
          <div>

            {/* Activity History */}
            <div className="details-card">

              <h2>Activity History</h2>

              <div className="activity-list">

                {activities.map((activity) => (
                  <div
                    className="activity-item"
                    key={activity.id}
                  >
                    <div className="activity-dot"></div>

                    <div className="activity-content">
                      <strong>
                        {activity.text}
                      </strong>

                      <p>
                        {activity.user} •{" "}
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Attachments */}
            <div className="details-card">

              <h2>Attachments</h2>

              {task.attachment ? (
                <div className="attachment-item">
                  📎 {task.attachment}
                </div>
              ) : (
                <div className="empty-attachments">
                  <p>No attachments available.</p>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetails;