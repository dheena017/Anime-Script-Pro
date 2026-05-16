import { ProfileSettings } from '../../profile/ProfileSettings';

interface ConfigTabProps {
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: (theme: 'dark' | 'light') => void;
  emailAlerts: { upscale: boolean; generation: boolean; security: boolean };
  setEmailAlerts: (alerts: { upscale: boolean; generation: boolean; security: boolean }) => void;
}

export function ConfigTab({
  aspectRatio,
  setAspectRatio,
  theme,
  toggleTheme,
  emailAlerts,
  setEmailAlerts
}: ConfigTabProps) {
  return (
    <ProfileSettings
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      theme={theme}
      toggleTheme={toggleTheme}
      emailAlerts={emailAlerts}
      setEmailAlerts={setEmailAlerts}
    />
  );
}
