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

  const isAllowed =
    user?.role === "Manager" ||
    user?.role === "Admin";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!assignee) {
      alert("Please select an assignee.");
      return;
    }

    if (
      startDate &&
      dueDate &&
      new Date(dueDate) < new Date(startDate)
    ) {
      alert("Due date cannot be before the start date.");
      return;
    }

    const savedTasks = JSON.parse(
      localStorage.getItem("taskflow_tasks") || "[]"
    );

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      assignedBy: user.name,
      assignedTo: assignee,
      priority,
      status: "Pending",
      progress: 0,
      startDate,
      dueDate,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      attachment: attachment
        ? attachment.name
        : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [
      ...savedTasks,
      newTask,
    ];

    localStorage.setItem(
      "taskflow_tasks",
      JSON.stringify(updatedTasks)
    );

    // Notify all task-related pages
    window.dispatchEvent(
      new Event("taskflowTasksUpdated")
    );

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

    const savedNotifications = JSON.parse(
      localStorage.getItem(
        "taskflow_notifications"
      ) || "[]"
    );

    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify([
        ...savedNotifications,
        newNotification,
      ])
    );

    // Notify notification page
    window.dispatchEvent(
      new Event("taskflowNotificationsUpdated")
    );

    alert("Task created successfully!");

    navigate("/tasks");
  };

  if (!isAllowed) {
    return (
      <DashboardLayout>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h2>Access Denied</h2>

          <p>
            Only Managers and Admins can create
            tasks.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="create-task-page">

        <div className="create-task-header">
          <div>
            <h1>Create New Task</h1>

            <p>
              Create and assign a new task to
              your team.
            </p>
          </div>
        </div>

        <div className="create-task-card">

          <form onSubmit={handleSubmit}>

            <div className="form-section">

              <h2>Task Information</h2>

              <div className="form-group">
                <label>
                  Task Title
                  <span>*</span>
                </label>

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
                <label>
                  Description
                </label>

                <textarea
                  placeholder="Describe the task..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows="5"
                />
              </div>

            </div>

            <div className="form-section">

              <h2>Assignment</h2>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Assign To
                    <span>*</span>
                  </label>

                  <select
                    value={assignee}
                    onChange={(e) =>
                      setAssignee(
                        e.target.value
                      )
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

                  <label>
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value
                      )
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>

                </div>

              </div>

            </div>

            <div className="form-section">

              <h2>Schedule</h2>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

            <div className="form-section">

              <h2>Additional Details</h2>

              <div className="form-group">

                <label>
                  Tags
                </label>

                <input
                  type="text"
                  placeholder="e.g. frontend, urgent, website"
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                />

                <small>
                  Separate multiple tags with
                  commas.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Attachment
                </label>

                <input
                  type="file"
                  onChange={(e) =>
                    setAttachment(
                      e.target.files[0]
                    )
                  }
                />

              </div>

            </div>

            <div className="create-task-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  navigate("/tasks")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-task-btn"
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