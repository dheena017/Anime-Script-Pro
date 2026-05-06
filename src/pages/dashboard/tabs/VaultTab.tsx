import { ProfileVault } from '../../profile/ProfileVault';

interface VaultTabProps {
  generations: any[];
  favorites: any[];
}

export function VaultTab({ generations, favorites }: VaultTabProps) {
  return <ProfileVault generations={generations} favorites={favorites} />;
}