import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Arbaz",
      email: "arbaz@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul",
      email: "rahul@example.com",
      role: "Team Member",
      status: "Active",
    },
    {
      id: 3,
      name: "Aman",
      email: "aman@example.com",
      role: "Team Member",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
  ]);

  const toggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  const changeRole = (id, newRole) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? { ...user, role: newRole }
          : user
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="user-management-page">

        <div className="user-management-header">
          <div>
            <h1>User Management</h1>
            <p>Manage users, roles, and account status.</p>
          </div>

          <div className="user-count">
            {users.length} Users
          </div>
        </div>

        <div className="users-card">

          <div className="users-table">

            <div className="users-row users-heading">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {users.map((user) => (
              <div className="users-row" key={user.id}>

                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>

                  <strong>{user.name}</strong>
                </div>

                <span className="user-email">
                  {user.email}
                </span>

                <select
                  className="role-select"
                  value={user.role}
                  onChange={(e) =>
                    changeRole(user.id, e.target.value)
                  }
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Team Member</option>
                </select>

                <span
                  className={
                    user.status === "Active"
                      ? "user-status active"
                      : "user-status inactive"
                  }
                >
                  {user.status}
                </span>

                <button
                  className={
                    user.status === "Active"
                      ? "status-btn deactivate"
                      : "status-btn activate"
                  }
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status === "Active"
                    ? "Deactivate"
                    : "Activate"}
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default UserManagement;