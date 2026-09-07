import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();

  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TaskFlow</h2>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0) || "U"}
        </div>

        <div>
          <strong>{user?.name || "User"}</strong>
          <p>{role || "Guest"}</p>
        </div>
      </div>

      <nav className="sidebar-menu">

        <Link to="/dashboard">
          Dashboard
        </Link>

        {/* Manager and Admin */}
        {(role === "Manager" || role === "Admin") && (
          <>
            <Link to="/tasks">
              All Tasks
            </Link>

            <Link to="/tasks/create">
              Create Task
            </Link>
          </>
        )}

        {/* Team Member */}
        <Link to="/my-tasks">
          My Tasks
        </Link>

        <Link to="/notifications">
          Notifications
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        {/* Admin only */}
        {role === "Admin" && (
          <Link to="/users">
            User Management
          </Link>
        )}

        {/* Manager */}
        {role === "Manager" && (
          <Link to="/workload">
            Team Workload
          </Link>
        )}

      </nav>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;