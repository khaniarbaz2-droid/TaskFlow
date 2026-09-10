import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================================
     LOAD PROFILE
     ========================================= */

  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem("taskflow_profile") || "{}"
    );

    setName(
      savedProfile.name ||
        user?.name ||
        ""
    );

    setPhone(
      savedProfile.phone ||
        ""
    );

    setDesignation(
      savedProfile.designation ||
        (user?.role === "Admin"
          ? "Administrator"
          : user?.role === "Manager"
          ? "Project Manager"
          : "Team Member")
    );
  }, [user]);

  /* =========================================
     TASK STATISTICS
     ========================================= */

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

  const allTasks = Array.from(
    taskMap.values()
  );

  const myTasks = allTasks.filter(
    (task) =>
      task.assignedTo === user?.name
  );

  const totalTasks = myTasks.length;

  const completedTasks = myTasks.filter(
    (task) =>
      task.status === "Completed"
  ).length;

  const inProgressTasks = myTasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length;

  const pendingTasks = myTasks.filter(
    (task) =>
      task.status === "Pending"
  ).length;

  const overdueTasks = myTasks.filter(
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

  /* =========================================
     SAVE PROFILE
     ========================================= */

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage(
        "Please enter your full name."
      );
      return;
    }

    const updatedProfile = {
      name: name.trim(),
      phone: phone.trim(),
      designation: designation.trim(),
    };

    localStorage.setItem(
      "taskflow_profile",
      JSON.stringify(updatedProfile)
    );

    /*
      Update AuthContext user if setUser
      is available.
    */

    if (setUser && user) {
      const updatedUser = {
        ...user,
        name: name.trim(),
      };

      setUser(updatedUser);

      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(updatedUser)
      );
    }

    setIsEditing(false);

    setMessage(
      "Profile updated successfully!"
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =========================================
     INITIALS
     ========================================= */

  const getInitials = (value) => {
    if (!value) {
      return "U";
    }

    const words = value
      .trim()
      .split(" ")
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <DashboardLayout>

      <div className="profile-page">

        {/* =================================
            HEADER
            ================================= */}

        <div className="profile-header">

          <div>

            <p className="profile-label">
              Account
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              View and manage your account
              information.
            </p>

          </div>

          <div className="profile-header-actions">

            <button
              className="password-btn"
              onClick={() =>
                navigate("/change-password")
              }
            >
              🔒 Change Password
            </button>

            {!isEditing && (
              <button
                className="edit-profile-btn"
                onClick={() =>
                  setIsEditing(true)
                }
              >
                ✎ Edit Profile
              </button>
            )}

          </div>

        </div>


        {/* =================================
            SUCCESS MESSAGE
            ================================= */}

        {message && (
          <div className="profile-message">
            ✓ {message}
          </div>
        )}


        <div className="profile-grid">

          {/* =================================
              PROFILE INFORMATION
              ================================= */}

          <div className="profile-card profile-info-card">

            <div className="profile-top">

              <div className="profile-avatar">
                {getInitials(name)}
              </div>

              <div>

                <h2>
                  {name || "User"}
                </h2>

                <p>
                  {user?.role ||
                    "Team Member"}
                </p>

                <span className="active-badge">
                  Active
                </span>

              </div>

            </div>


            {isEditing ? (

              <form
                className="profile-edit-form"
                onSubmit={handleSave}
              >

                <div className="profile-form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      user?.email || ""
                    }
                    disabled
                  />

                  <small>
                    Email cannot be changed
                    here.
                  </small>

                </div>


                <div className="profile-form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="+91 98765 43210"
                  />

                </div>


                <div className="profile-form-group">

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(
                        e.target.value
                      )
                    }
                    placeholder="Your designation"
                  />

                </div>


                <div className="profile-edit-actions">

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={() =>
                      setIsEditing(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                  >
                    ✓ Save Changes
                  </button>

                </div>

              </form>

            ) : (

              <div className="profile-details">

                <div className="detail-item">

                  <span className="detail-label">
                    Full Name
                  </span>

                  <strong>
                    {name || "Not set"}
                  </strong>

                </div>


                <div className="detail-item">

                  <span className="detail-label">
                    Email
                  </span>

                  <strong>
                    {user?.email ||
                      "Not set"}
                  </strong>

                </div>


                <div className="detail-item">

                  <span className="detail-label">
                    Phone
                  </span>

                  <strong>
                    {phone ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="detail-item">

                  <span className="detail-label">
                    Designation
                  </span>

                  <strong>
                    {designation ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="detail-item">

                  <span className="detail-label">
                    Role
                  </span>

                  <strong>
                    {user?.role ||
                      "Team Member"}
                  </strong>

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

            )}

          </div>


          {/* =================================
              STATISTICS
              ================================= */}

          <div className="profile-card">

            <div className="profile-card-heading">

              <div>

                <h2>
                  Task Statistics
                </h2>

                <p>
                  Your current task
                  performance.
                </p>

              </div>

              <span>
                📊
              </span>

            </div>


            <div className="profile-stats">

              <div className="profile-stat">

                <span>
                  Total Tasks
                </span>

                <strong>
                  {totalTasks}
                </strong>

              </div>


              <div className="profile-stat">

                <span>
                  Completed
                </span>

                <strong className="stat-green">
                  {completedTasks}
                </strong>

              </div>


              <div className="profile-stat">

                <span>
                  In Progress
                </span>

                <strong className="stat-blue">
                  {inProgressTasks}
                </strong>

              </div>


              <div className="profile-stat">

                <span>
                  Pending
                </span>

                <strong className="stat-orange">
                  {pendingTasks}
                </strong>

              </div>


              <div className="profile-stat">

                <span>
                  Overdue
                </span>

                <strong className="stat-red">
                  {overdueTasks}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Profile;