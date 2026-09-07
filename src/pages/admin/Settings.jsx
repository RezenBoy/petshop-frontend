import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    fontSize: 14,
    autosave: true,
    notifications: true,
    emailReports: false,
    backup: true,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="p-6 space-y-6">

      {/* Theme */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <h2 className="text-lg font-medium text-text">Theme</h2>
        <p className="text-sm text-textMuted mb-2">
          Choose how the dashboard looks (light, dark, or system default).
        </p>
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          className="mt-1 block w-64 border border-border bg-surface text-text rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <h2 className="text-lg font-medium text-text">Editor Font Size</h2>
        <p className="text-sm text-textMuted mb-2">
          Adjust the default font size for the editor and dashboard text.
        </p>
        <input
          type="number"
          name="fontSize"
          value={settings.fontSize}
          onChange={handleChange}
          className="mt-1 block w-32 border border-border bg-surface text-text rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Autosave */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-text">Autosave</h2>
          <p className="text-sm text-textMuted">
            Automatically save changes while editing forms.
          </p>
        </div>
        <input
          type="checkbox"
          name="autosave"
          checked={settings.autosave}
          onChange={handleChange}
          className="h-5 w-5 accent-primary mt-1"
        />
      </div>

      {/* Notifications */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-text">Notifications</h2>
          <p className="text-sm text-textMuted">
            Enable or disable push notifications for updates and alerts.
          </p>
        </div>
        <input
          type="checkbox"
          name="notifications"
          checked={settings.notifications}
          onChange={handleChange}
          className="h-5 w-5 accent-primary mt-1"
        />
      </div>

      {/* Email Reports */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-text">Email Reports</h2>
          <p className="text-sm text-textMuted">
            Send weekly performance reports directly to your email.
          </p>
        </div>
        <input
          type="checkbox"
          name="emailReports"
          checked={settings.emailReports}
          onChange={handleChange}
          className="h-5 w-5 accent-primary mt-1"
        />
      </div>

      {/* Backup */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-text">Auto Backup</h2>
          <p className="text-sm text-textMuted">
            Automatically back up your data at regular intervals.
          </p>
        </div>
        <input
          type="checkbox"
          name="backup"
          checked={settings.backup}
          onChange={handleChange}
          className="h-5 w-5 accent-primary mt-1"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button className="px-6 py-2 bg-primary text-surface rounded-md hover:bg-primary/90 transition-colors shadow-sm font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
