import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  /* =========================
     LOAD NOTIFICATIONS
     ========================= */

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("taskflow_notifications") || "[]"
    );

    const defaultNotifications = [
      {
        id: "default-1",
        type: "assignment",
        title: "New Task Assigned",
        message:
          "You have been assigned the task Design Login Page.",
        time: "10 minutes ago",
        read: false,
        taskId: 1,
        assignedTo: "Arbaz",
      },
      {
        id: "default-2",
        type: "comment",
        title: "New Comment",
        message:
          "Rahul commented on API Integration.",
        time: "1 hour ago",
        read: false,
        taskId: 3,
        assignedTo: "Arbaz",
      },
      {
        id: "default-3",
        type: "deadline",
        title: "Deadline Approaching",
        message:
          "Database Setup is due tomorrow.",
        time: "3 hours ago",
        read: true,
        taskId: 2,
        assignedTo: "Rahul",
      },
    ];

    setNotifications([
      ...defaultNotifications,
      ...savedNotifications,
    ]);
  }, []);

  /* =========================
     USER NOTIFICATIONS
     ========================= */

  const myNotifications = notifications.filter(
    (notification) =>
      notification.assignedTo === user?.name
  );

  /* =========================
     FILTER
     ========================= */

  const filteredNotifications =
    activeFilter === "All"
      ? myNotifications
      : activeFilter === "Unread"
      ? myNotifications.filter(
          (notification) => !notification.read
        )
      : myNotifications.filter(
          (notification) =>
            notification.type === activeFilter
        );

  /* =========================
     COUNTS
     ========================= */

  const unreadCount = myNotifications.filter(
    (notification) => !notification.read
  ).length;

  const assignmentCount = myNotifications.filter(
    (notification) =>
      notification.type === "assignment"
  ).length;

  const commentCount = myNotifications.filter(
    (notification) =>
      notification.type === "comment"
  ).length;

  const updateCount = myNotifications.filter(
    (notification) =>
      notification.type === "update"
  ).length;

  /* =========================
     SAVE CUSTOM NOTIFICATIONS
     ========================= */

  const saveCustomNotifications = (
    updatedNotifications
  ) => {
    const customNotifications =
      updatedNotifications.filter(
        (notification) =>
          !String(notification.id).startsWith(
            "default-"
          )
      );

    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify(customNotifications)
    );
  };

  /* =========================
     MARK AS READ
     ========================= */

  const markAsRead = (id) => {
    const updatedNotifications =
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      );

    setNotifications(updatedNotifications);

    saveCustomNotifications(
      updatedNotifications
    );
  };

  /* =========================
     MARK ALL AS READ
     ========================= */

  const markAllAsRead = () => {
    const updatedNotifications =
      notifications.map((notification) =>
        notification.assignedTo === user?.name
          ? {
              ...notification,
              read: true,
            }
          : notification
      );

    setNotifications(updatedNotifications);

    saveCustomNotifications(
      updatedNotifications
    );
  };

  /* =========================
     CLICK NOTIFICATION
     ========================= */

  const handleNotificationClick = (
    notification
  ) => {
    markAsRead(notification.id);

    if (notification.taskId) {
      navigate(
        `/tasks/${notification.taskId}`
      );
    }
  };

  /* =========================
     ICON
     ========================= */

  const getNotificationIcon = (type) => {
    if (type === "assignment") {
      return "📋";
    }

    if (type === "comment") {
      return "💬";
    }

    if (type === "deadline") {
      return "⏰";
    }

    if (type === "update") {
      return "🔄";
    }

    return "🔔";
  };

  return (
    <DashboardLayout>

      <div className="notifications-page">

        {/* =========================
            HEADER
            ========================= */}

        <div className="notifications-header">

          <div>
            <p className="notifications-label">
              Updates
            </p>

            <h1>Notifications</h1>

            <p className="notifications-subtitle">
              Stay updated with your tasks and
              team activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllAsRead}
            >
              ✓ Mark all as read
            </button>
          )}

        </div>

        {/* =========================
            SUMMARY CARDS
            ========================= */}

        <div className="notification-stats">

          <div className="notification-stat">

            <div className="notification-stat-icon blue">
              🔔
            </div>

            <div>
              <span>Total</span>
              <strong>
                {myNotifications.length}
              </strong>
            </div>

          </div>

          <div className="notification-stat">

            <div className="notification-stat-icon red">
              ●
            </div>

            <div>
              <span>Unread</span>
              <strong>
                {unreadCount}
              </strong>
            </div>

          </div>

          <div className="notification-stat">

            <div className="notification-stat-icon purple">
              📋
            </div>

            <div>
              <span>Assignments</span>
              <strong>
                {assignmentCount}
              </strong>
            </div>

          </div>

          <div className="notification-stat">

            <div className="notification-stat-icon green">
              💬
            </div>

            <div>
              <span>Comments</span>
              <strong>
                {commentCount}
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            FILTERS
            ========================= */}

        <div className="notification-filters">

          <button
            className={
              activeFilter === "All"
                ? "notification-filter active"
                : "notification-filter"
            }
            onClick={() =>
              setActiveFilter("All")
            }
          >
            All
          </button>

          <button
            className={
              activeFilter === "Unread"
                ? "notification-filter active"
                : "notification-filter"
            }
            onClick={() =>
              setActiveFilter("Unread")
            }
          >
            Unread
            {unreadCount > 0 && (
              <span>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className={
              activeFilter === "assignment"
                ? "notification-filter active"
                : "notification-filter"
            }
            onClick={() =>
              setActiveFilter("assignment")
            }
          >
            Assignments
          </button>

          <button
            className={
              activeFilter === "comment"
                ? "notification-filter active"
                : "notification-filter"
            }
            onClick={() =>
              setActiveFilter("comment")
            }
          >
            Comments
          </button>

          <button
            className={
              activeFilter === "update"
                ? "notification-filter active"
                : "notification-filter"
            }
            onClick={() =>
              setActiveFilter("update")
            }
          >
            Updates
          </button>

        </div>

        {/* =========================
            NOTIFICATION LIST
            ========================= */}

        <div className="notifications-card">

          <div className="notifications-card-header">

            <div>
              <h2>
                Recent Notifications
              </h2>

              <p>
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount !== 1
                        ? "s"
                        : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>

            <span>
              {updateCount > 0 &&
                `${updateCount} updates`}
            </span>

          </div>

          <div className="notifications-list">

            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(
                (notification) => (
                  <div
                    key={notification.id}
                    className={
                      notification.read
                        ? "notification-item"
                        : "notification-item unread"
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    {/* Icon */}
                    <div
                      className={`notification-icon ${notification.type}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* Content */}
                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="unread-dot"></span>
                        )}

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <div className="notification-meta">

                        <span>
                          🕒 {notification.time}
                        </span>

                        {notification.taskId && (
                          <span>
                            View task →
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )
            ) : (
              <div className="empty-notifications">

                <div className="empty-notification-icon">
                  🔔
                </div>

                <h2>
                  No notifications
                </h2>

                <p>
                  {activeFilter === "Unread"
                    ? "You have no unread notifications."
                    : "You're all caught up!"}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Notifications;