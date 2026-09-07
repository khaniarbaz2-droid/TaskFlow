import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./CreateTask.css";

function CreateTask() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [attachment, setAttachment] = useState(null);

  const canCreateTask =
    user?.role === "Admin" ||
    user?.role === "Manager";

  if (!canCreateTask) {
    return (
      <DashboardLayout>
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>

          <h1>Access Denied</h1>

          <p>
            You don't have permission to create tasks.
          </p>

          <button
            onClick={() => navigate("/my-tasks")}
          >
            Go to My Tasks
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (startDate && dueDate && dueDate < startDate) {
      alert("Due date cannot be before the start date.");
      return;
    }

    // Get existing tasks
    const existingTasks = JSON.parse(
      localStorage.getItem("taskflow_tasks") || "[]"
    );

    // Create new task
    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      status: "Pending",
      progress: 0,
      assignedTo: assignee,
      assignedBy: user.name,
      startDate,
      dueDate,
      tags,
      attachment: attachment
        ? attachment.name
        : null,
      createdAt: new Date().toLocaleString(),
    };

    // Save task
    const updatedTasks = [
      ...existingTasks,
      newTask,
    ];

    localStorage.setItem(
      "taskflow_tasks",
      JSON.stringify(updatedTasks)
    );

    // Get existing notifications
    const existingNotifications = JSON.parse(
      localStorage.getItem("taskflow_notifications") || "[]"
    );

    // Create notification for assigned user
    const newNotification = {
      id: Date.now() + 1,
      type: "assignment",
      title: "New Task Assigned",
      message: `You have been assigned the task "${title}".`,
      time: "Just now",
      read: false,
      taskId: newTask.id,
      assignedTo: assignee,
    };

    // Save notification
    const updatedNotifications = [
      ...existingNotifications,
      newNotification,
    ];

    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify(updatedNotifications)
    );

    alert("Task created and assigned successfully!");

    navigate("/tasks");
  };

  return (
    <DashboardLayout>
      <div className="create-task-page">

        <div className="page-header">
          <div>
            <h1>Create Task</h1>

            <p>
              Create and assign a new task.
            </p>
          </div>
        </div>

        <div className="task-form-card">

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Task Title *</label>

              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                placeholder="Describe the task..."
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              ></textarea>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Assign To *</label>

                <select
                  value={assignee}
                  onChange={(e) =>
                    setAssignee(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select team member
                  </option>

                  <option value="Arbaz">
                    Arbaz
                  </option>

                  <option value="Rahul">
                    Rahul
                  </option>

                  <option value="Aman">
                    Aman
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                placeholder="e.g. frontend, urgent, project"
                value={tags}
                onChange={(e) =>
                  setTags(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Attachments</label>

              <input
                type="file"
                onChange={(e) =>
                  setAttachment(e.target.files[0])
                }
              />

              {attachment && (
                <small className="selected-file">
                  Selected: {attachment.name}
                </small>
              )}
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-btn"
              >
                Create Task
              </button>

            </div>

          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default CreateTask;