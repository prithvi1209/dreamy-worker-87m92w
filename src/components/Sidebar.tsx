import React from "react";
import { User } from "../types";
import "../styles/Sidebar.css";

interface SidebarProps {
  currentView: string;
  onViewChange: (
    view: "dashboard" | "generator" | "viewer" | "settings"
  ) => void;
  user: User | null;
  onLogout: () => void;
  onShowAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  user,
  onLogout,
  onShowAuth,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h1 className="logo-text">FlashGenius</h1>
        </div>
        <p className="tagline">Master anything, one card at a time</p>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => onViewChange("dashboard")}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </button>

        <button
          className={`nav-item ${currentView === "generator" ? "active" : ""}`}
          onClick={() => onViewChange("generator")}
        >
          <span className="nav-icon">✨</span>
          <span className="nav-text">Generate Cards</span>
        </button>

        {user && (
          <button
            className={`nav-item ${currentView === "settings" ? "active" : ""}`}
            onClick={() => onViewChange("settings")}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-info">
            <div className="user-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-email">{user.email}</p>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button className="login-btn" onClick={onShowAuth}>
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};
