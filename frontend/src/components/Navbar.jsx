function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="navbar-right">
        <span className="notification-icon">🔔</span>

        <div className="user-info">
          <div className="user-avatar">AK</div>

          <div>
            <strong>Arbaz</strong>
            <p>Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;