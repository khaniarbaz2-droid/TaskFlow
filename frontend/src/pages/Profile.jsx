import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="profile-page">

        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your account information.</p>
          </div>

          <button
            className="password-btn"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </div>

        <div className="profile-grid">

          {/* Profile Information */}
          <div className="profile-card profile-info-card">
            <div className="profile-top">
              <div className="profile-avatar">
                AK
              </div>

              <div>
                <h2>Arbaz</h2>
                <p>Manager</p>
                <span className="active-badge">
                  Active
                </span>
              </div>
            </div>

            <div className="profile-details">

              <div className="detail-item">
                <span className="detail-label">
                  Full Name
                </span>
                <strong>Arbaz</strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  Email
                </span>
                <strong>arbaz@example.com</strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  Phone
                </span>
                <strong>+91 98765 43210</strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  Designation
                </span>
                <strong>Project Manager</strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  Role
                </span>
                <strong>Manager</strong>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  Account Status
                </span>
                <strong className="status-active">
                  Active
                </strong>
              </div>

            </div>
          </div>

          {/* Statistics */}
          <div className="profile-card">
            <h2>Task Statistics</h2>

            <div className="profile-stats">

              <div className="profile-stat">
                <span>Total Tasks</span>
                <strong>24</strong>
              </div>

              <div className="profile-stat">
                <span>Completed</span>
                <strong>7</strong>
              </div>

              <div className="profile-stat">
                <span>In Progress</span>
                <strong>7</strong>
              </div>

              <div className="profile-stat">
                <span>Pending</span>
                <strong>8</strong>
              </div>

              <div className="profile-stat">
                <span>Overdue</span>
                <strong>2</strong>
              </div>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Profile;