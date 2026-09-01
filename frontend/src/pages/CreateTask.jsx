import DashboardLayout from "../layouts/DashboardLayout";
import "./CreateTask.css";

function CreateTask() {
  return (
    <DashboardLayout>
      <div className="create-task-page">

        <div className="page-header">
          <div>
            <h1>Create Task</h1>
            <p>Create and assign a new task.</p>
          </div>
        </div>

        <div className="task-form-card">

          <form>

            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="Enter task title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the task..."
                rows="5"
              ></textarea>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Assign To *</label>

                <select>
                  <option value="">Select team member</option>
                  <option>Arbaz</option>
                  <option>Rahul</option>
                  <option>Aman</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select>
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
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>

                <input
                  type="date"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                placeholder="e.g. frontend, urgent, project"
              />
            </div>

            <div className="form-group">
              <label>Attachments</label>

              <input
                type="file"
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
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