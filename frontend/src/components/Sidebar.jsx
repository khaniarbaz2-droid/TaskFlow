import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TaskFlow</h2>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/my-tasks">My Tasks</Link>
        <Link to="/tasks">All Tasks</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <button className="logout-btn">Logout</button>
    </aside>
  );
}

export default Sidebar;