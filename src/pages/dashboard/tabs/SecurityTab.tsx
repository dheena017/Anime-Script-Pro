import { ProfileSecurity } from '../../profile/ProfileSecurity';

interface SecurityTabProps {
  onDeactivate: () => void;
}

export function SecurityTab({ onDeactivate }: SecurityTabProps) {
  return <ProfileSecurity onDeactivate={onDeactivate} />;
}