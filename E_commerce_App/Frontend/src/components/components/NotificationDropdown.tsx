import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import "./../../styles/NotificationDropdown.css";

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from backend
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    if (!token) return;

    const getNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5001/user/getNotification", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch notifications");
          return;
        }

        const data = await res.json();
        // Map your notifications if needed here (e.g. format time)
        setNotifications(
          data.map((n: any) => ({
            _id: n._id,
            message: n.message,
            createdAt: n.createdAt,
          }))
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper to format time (optional)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      {/* Button */}
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">Notifications</div>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li key={n._id} className="dropdown-item">
                  <p>{n.message}</p>
                  <span>{formatTime(n.createdAt)}</span>
                </li>
              ))
            ) : (
              <li className="empty-message">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
