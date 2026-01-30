import React, { useState } from "react";
import { User } from "../types";
import "../styles/ProfileSettings.css";

interface ProfileSettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  onUpdateUser,
}) => {
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      email,
      phone,
    };
    onUpdateUser(updatedUser);
    localStorage.setItem("flashcard_user", JSON.stringify(updatedUser));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Profile Settings</h1>
        <p>Manage your account and notification preferences</p>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Account Information</h2>
          <div className="settings-form">
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="settings-input"
              />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="settings-input"
              />
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notification Preferences</h2>
          <div className="settings-toggles">
            <div className="toggle-item">
              <div className="toggle-info">
                <h3>Enable Notifications</h3>
                <p>Receive reminders when flashcards are due for review</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h3>Email Notifications</h3>
                <p>Get revision reminders via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={!notificationsEnabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <h3>SMS Notifications</h3>
                <p>Get revision reminders via text message</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  disabled={!notificationsEnabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>About Your Account</h2>
          <div className="account-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Account ID</span>
              <span className="stat-value">{user.id}</span>
            </div>
          </div>
        </section>

        <div className="settings-actions">
          <button className="save-settings-btn" onClick={handleSave}>
            {isSaved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
