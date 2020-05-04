import React from 'react';
import AppLayout from '../containers/AppLayout';
import SettingsSideBar from '../containers/Settings/SettingsSidebar';
import SettingsHelpContent from '../containers/Settings/SettingsHelpContent';
import SettingsSecurityContent from '../containers/Settings/SettingsSecurityContent';

const Settings = ({ match }) => {
  const { page } = match.params;

  const content = page === 'help' ? SettingsHelpContent : SettingsSecurityContent;

  return <AppLayout Sidebar={SettingsSideBar} Content={content} />;
};

export default Settings;
