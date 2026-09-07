import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("taskflow_notifications") || "[]"
    );

    const defaultNotifications = [
      {
        id: "default-1",
        type: "assignment",
        title: "New Task Assigned",
        message: "You have been assigned the task Design Login Page.",
        time: "10 minutes ago",
        read: false,
        taskId: 1,
        assignedTo: "Arbaz",
      },
      {
        id: "default-2",
        type: "comment",
        title: "New Comment",
        message: "Rahul commented on API Integration.",
        time: "1 hour ago",
        read: false,
        taskId: 3,
        assignedTo: "Arbaz",
      },
      {
        id: "default-3",
        type: "deadline",
        title: "Deadline Approaching",
        message: "Database Setup is due tomorrow.",
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

  const myNotifications = notifications.filter(
    (notification) =>
      notification.assignedTo === user?.name
  );

  const unreadCount = myNotifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(
      (notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
    );

    setNotifications(updatedNotifications);

    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify(
        updatedNotifications.filter(
          (notification) =>
            !String(notification.id).startsWith("default-")
        )
      )
    );
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(
      (notification) => ({
        ...notification,
        read:
          notification.assignedTo === user?.name
            ? true
            : notification.read,
      })
    );

    setNotifications(updatedNotifications);

    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify(
        updatedNotifications.filter(
          (notification) =>
            !String(notification.id).startsWith("default-")
        )
      )
    );
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.taskId) {
      navigate(`/tasks/${notification.taskId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="notifications-page">

        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with your tasks and activities.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="notification-summary">
          <span>
            {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="notifications-list">

          {myNotifications.length > 0 ? (
            myNotifications.map((notification) => (
              <div
                key={notification.id}
                className={
                  notification.read
                    ? "notification-card"
                    : "notification-card unread"
                }
                onClick={() =>
                  handleNotificationClick(notification)
                }
              >

                <div className="notification-icon-box">
                  {notification.type === "assignment" && "📋"}
                  {notification.type === "comment" && "💬"}
                  {notification.type === "deadline" && "⏰"}
                  {notification.type === "update" && "🔄"}
                </div>

                <div className="notification-content">

                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {!notification.read && (
                      <span className="unread-dot"></span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <div className="empty-icon">
                🔔
              </div>

              <h2>No notifications</h2>

              <p>
                You're all caught up!
              </p>
            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Notifications;