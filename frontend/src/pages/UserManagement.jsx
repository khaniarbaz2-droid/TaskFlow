import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./UserManagement.css";

function UserManagement() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [message, setMessage] =
    useState("");


  /* =========================================
     DEFAULT USERS
     ========================================= */

  const defaultUsers = [
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
  ];


  /* =========================================
     LOAD USERS
     ========================================= */

  useEffect(() => {
    const savedUsers = JSON.parse(
      localStorage.getItem(
        "taskflow_users"
      ) || "null"
    );

    if (savedUsers) {
      setUsers(savedUsers);
    } else {
      setUsers(defaultUsers);

      localStorage.setItem(
        "taskflow_users",
        JSON.stringify(defaultUsers)
      );
    }
  }, []);


  /* =========================================
     SAVE USERS
     ========================================= */

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);

    localStorage.setItem(
      "taskflow_users",
      JSON.stringify(updatedUsers)
    );
  };


  /* =========================================
     CHANGE STATUS
     ========================================= */

  const toggleStatus = (id) => {
    const selectedUser = users.find(
      (item) => item.id === id
    );

    if (!selectedUser) {
      return;
    }

    /*
      Prevent deactivating the currently
      logged-in account.
    */

    if (
      selectedUser.email === user?.email
    ) {
      setMessage(
        "You cannot deactivate your own account."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    const updatedUsers = users.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
    );

    saveUsers(updatedUsers);

    setMessage(
      `${selectedUser.name}'s account status was updated.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  /* =========================================
     CHANGE ROLE
     ========================================= */

  const changeRole = (
    id,
    newRole
  ) => {
    const selectedUser = users.find(
      (item) => item.id === id
    );

    if (!selectedUser) {
      return;
    }

    const updatedUsers = users.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              role: newRole,
            }
          : item
    );

    saveUsers(updatedUsers);

    setMessage(
      `${selectedUser.name}'s role was changed to ${newRole}.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  /* =========================================
     FILTER USERS
     ========================================= */

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search) ||
        item.email
          .toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        item.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);


  /* =========================================
     COUNTS
     ========================================= */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (item) =>
      item.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (item) =>
      item.status === "Inactive"
  ).length;

  const managerCount = users.filter(
    (item) =>
      item.role === "Manager"
  ).length;

  const memberCount = users.filter(
    (item) =>
      item.role === "Team Member"
  ).length;


  /* =========================================
     INITIALS
     ========================================= */

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name
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


  /* =========================================
     ACCESS DENIED
     ========================================= */

  if (user?.role !== "Admin") {
    return (
      <DashboardLayout>

        <div className="access-denied">

          <h1>
            🔒 Access Denied
          </h1>

          <p>
            Only administrators can manage
            users.
          </p>

        </div>

      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>

      <div className="user-management-page">

        {/* =================================
            HEADER
            ================================= */}

        <div className="user-management-header">

          <div>

            <p className="user-management-label">
              Administration
            </p>

            <h1>
              User Management
            </h1>

            <p>
              Manage users, roles, and account
              status.
            </p>

          </div>

          <div className="user-count">

            <strong>
              {totalUsers}
            </strong>

            <span>
              Total Users
            </span>

          </div>

        </div>


        {/* =================================
            MESSAGE
            ================================= */}

        {message && (
          <div className="user-management-message">
            ✓ {message}
          </div>
        )}


        {/* =================================
            STATISTICS
            ================================= */}

        <div className="user-management-stats">

          <div className="user-stat-card">

            <div className="user-stat-icon blue">
              👥
            </div>

            <div>
              <span>Total Users</span>
              <strong>
                {totalUsers}
              </strong>
            </div>

          </div>


          <div className="user-stat-card">

            <div className="user-stat-icon green">
              ✓
            </div>

            <div>
              <span>Active</span>
              <strong>
                {activeUsers}
              </strong>
            </div>

          </div>


          <div className="user-stat-card">

            <div className="user-stat-icon red">
              ●
            </div>

            <div>
              <span>Inactive</span>
              <strong>
                {inactiveUsers}
              </strong>
            </div>

          </div>


          <div className="user-stat-card">

            <div className="user-stat-icon purple">
              👔
            </div>

            <div>
              <span>Managers</span>
              <strong>
                {managerCount}
              </strong>
            </div>

          </div>


          <div className="user-stat-card">

            <div className="user-stat-icon orange">
              💻
            </div>

            <div>
              <span>Team Members</span>
              <strong>
                {memberCount}
              </strong>
            </div>

          </div>

        </div>


        {/* =================================
            TOOLBAR
            ================================= */}

        <div className="users-toolbar">

          <div className="users-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>


          <select
            className="users-filter"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Roles
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="Manager">
              Manager
            </option>

            <option value="Team Member">
              Team Member
            </option>

          </select>


          <select
            className="users-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>


        {/* =================================
            USERS CARD
            ================================= */}

        <div className="users-card">

          <div className="users-table">

            {/* HEADER */}

            <div className="users-row users-heading">

              <span>
                User
              </span>

              <span>
                Email
              </span>

              <span>
                Role
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {/* USERS */}

            {filteredUsers.length > 0 ? (

              filteredUsers.map(
                (item) => (

                  <div
                    className="users-row"
                    key={item.id}
                  >

                    {/* USER */}

                    <div className="user-info">

                      <div className="user-avatar">
                        {getInitials(
                          item.name
                        )}
                      </div>

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        {item.email ===
                          user?.email && (
                          <small>
                            You
                          </small>
                        )}

                      </div>

                    </div>


                    {/* EMAIL */}

                    <span className="user-email">
                      {item.email}
                    </span>


                    {/* ROLE */}

                    <select
                      className="role-select"
                      value={item.role}
                      disabled={
                        item.email ===
                        user?.email
                      }
                      onChange={(e) =>
                        changeRole(
                          item.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Admin">
                        Admin
                      </option>

                      <option value="Manager">
                        Manager
                      </option>

                      <option value="Team Member">
                        Team Member
                      </option>

                    </select>


                    {/* STATUS */}

                    <span
                      className={
                        item.status ===
                        "Active"
                          ? "user-status active"
                          : "user-status inactive"
                      }
                    >
                      <i></i>
                      {item.status}
                    </span>


                    {/* ACTION */}

                    <button
                      className={
                        item.status ===
                        "Active"
                          ? "status-btn deactivate"
                          : "status-btn activate"
                      }
                      disabled={
                        item.email ===
                        user?.email
                      }
                      onClick={() =>
                        toggleStatus(
                          item.id
                        )
                      }
                    >
                      {item.email ===
                      user?.email
                        ? "Current User"
                        : item.status ===
                          "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                  </div>

                )
              )

            ) : (

              <div className="users-empty">

                <div className="users-empty-icon">
                  👥
                </div>

                <h2>
                  No users found
                </h2>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default UserManagement;