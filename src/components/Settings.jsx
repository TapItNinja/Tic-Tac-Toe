import React from "react";

const Settings = ({ settings, updateSetting, showSettings }) => {
  return (
    <div className={`settings-panel ${showSettings ? "visible" : ""}`}>
      <h3 className="settings-title">Game Settings</h3>
      <div className="settings-row">
        <span className="settings-label">Animations</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.animations}
            onChange={e => updateSetting("animations", e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
      <div className="settings-row">
        <span className="settings-label">Dark Mode</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={e => updateSetting("darkMode", e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  );
};

export default Settings;
