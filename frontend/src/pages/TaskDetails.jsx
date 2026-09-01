import DashboardLayout from "../layouts/DashboardLayout";
import "./TaskDetails.css";

function TaskDetails() {
  const task = {
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
  };

  return (
    <DashboardLayout>

      <div className="task-details-page">

        <div className="task-details-header">
          <div>
            <button className="back-btn">← Back to Tasks</button>

            <h1>{task.title}</h1>

            <p>{task.description}</p>
          </div>

          <button className="edit-task-btn">
            Edit Task
          </button>
        </div>

        <div className="task-info-grid">

          <div className="info-card">
            <span>Priority</span>
            <strong className="high">
              {task.priority}
            </strong>
          </div>

          <div className="info-card">
            <span>Status</span>
            <strong>
              {task.status}
            </strong>
          </div>

          <div className="info-card">
            <span>Assigned To</span>
            <strong>
              {task.assignedTo}
            </strong>
          </div>

          <div className="info-card">
            <span>Assigned By</span>
            <strong>
              {task.assignedBy}
            </strong>
          </div>

          <div className="info-card">
            <span>Start Date</span>
            <strong>
              {task.startDate}
            </strong>
          </div>

          <div className="info-card">
            <span>Due Date</span>
            <strong>
              {task.dueDate}
            </strong>
          </div>

        </div>

        <div className="progress-card">

          <div className="progress-header">
            <h2>Progress</h2>
            <strong>{task.progress}%</strong>
          </div>

          <div className="large-progress-bar">
            <div
              className="large-progress-fill"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>

        </div>

        <div className="details-columns">

          <section className="details-card">

            <h2>Comments</h2>

            <div className="comment">
              <div className="comment-avatar">
                AK
              </div>

              <div>
                <strong>Arbaz</strong>
                <p>
                  Started working on the login page.
                </p>
                <small>
                  Sep 1, 2026 · 10:30 AM
                </small>
              </div>
            </div>

            <textarea
              placeholder="Write a comment..."
              rows="4"
            ></textarea>

            <button className="comment-btn">
              Add Comment
            </button>

          </section>

          <section className="details-card">

            <h2>Activity History</h2>

            <div className="activity">
              <strong>Task created</strong>
              <p>Manager created this task.</p>
              <small>Sep 1, 2026 · 9:00 AM</small>
            </div>

            <div className="activity">
              <strong>Task assigned</strong>
              <p>Task assigned to Arbaz.</p>
              <small>Sep 1, 2026 · 9:05 AM</small>
            </div>

            <div className="activity">
              <strong>Progress updated</strong>
              <p>Progress changed from 0% to 60%.</p>
              <small>Sep 1, 2026 · 10:30 AM</small>
            </div>

          </section>

        </div>

        <section className="details-card attachments-card">

          <h2>Attachments</h2>

          <div className="attachment">
            <div>
              <strong>login-design.pdf</strong>
              <p>Uploaded by Arbaz · 2.4 MB</p>
            </div>

            <button>
              Download
            </button>
          </div>

          <label className="upload-btn">
            Upload File
            <input type="file" hidden />
          </label>

        </section>

      </div>

    </DashboardLayout>
  );
}

export default TaskDetails;