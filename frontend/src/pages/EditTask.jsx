import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./EditTask.css";

function EditTask() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAllowed =
    user?.role === "Admin" || user?.role === "Manager";

  if (!isAllowed) {
    return (
      <DashboardLayout>
        <div className="access-denied">
          <h1>🔒 Access Denied</h1>

          <p>
            You don't have permission to edit this task.
          </p>

          <button onClick={() => navigate("/tasks/1")}>
            Back to Task
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="edit-task-page">

        <div className="page-header">
          <h1>Edit Task</h1>
          <p>Update task information.</p>
        </div>

        <div className="task-form-card">

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Task updated successfully!");
              navigate("/tasks/1");
            }}
          >

            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                defaultValue="Design Login Page"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="5"
                defaultValue="Create a clean and responsive login page for TaskFlow."
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Assign To *</label>

                <select defaultValue="Arbaz">
                  <option>Arbaz</option>
                  <option>Rahul</option>
                  <option>Aman</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select defaultValue="High">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Status</label>

                <select defaultValue="In Progress">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Progress (%)</label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="60"
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  defaultValue="2026-09-01"
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  defaultValue="2026-09-05"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                defaultValue="frontend, login, design"
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/tasks/1")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-btn"
              >
                Save Changes
              </button>

            </div>

          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default EditTask;